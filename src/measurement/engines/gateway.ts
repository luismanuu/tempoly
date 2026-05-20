// Live engine clients, routed through the Cloudflare AI Gateway (one base URL,
// per-provider path). Reads keys from an env record (works with both
// process.env in Node and the Worker `env` binding).
//
// SAFETY GATE: ask() throws MeasurementDisabledError unless env.MEASUREMENT_LIVE
// === '1'. The throw happens BEFORE any network call, so importing or
// constructing these clients can never spend money. This is the guarantee that
// no engine is hit before CEO authorizes spend. A unit test asserts it.

import { Decimal } from "decimal.js";
import {
  type EngineAnswer,
  type EngineClient,
  type EngineSlug,
  MeasurementDisabledError,
} from "./types";

export type EngineEnv = Record<string, string | undefined>;

interface EngineConfig {
  slug: EngineSlug;
  provider: "openai" | "anthropic" | "perplexity" | "google";
  modelId: string;
  apiKeyEnv: string; // env var holding the provider key
  outputCap: number;
  // USD per 1M tokens. Approximate consumer-tier pricing; revise at go time.
  inputPer1M: number;
  outputPer1M: number;
}

export const ENGINE_CONFIGS: Record<EngineSlug, EngineConfig> = {
  chatgpt: { slug: "chatgpt", provider: "openai", modelId: "gpt-5", apiKeyEnv: "OPENAI_API_KEY", outputCap: 500, inputPer1M: 1.25, outputPer1M: 10 },
  claude: { slug: "claude", provider: "anthropic", modelId: "claude-sonnet-4-6", apiKeyEnv: "ANTHROPIC_API_KEY", outputCap: 500, inputPer1M: 3, outputPer1M: 15 },
  perplexity: { slug: "perplexity", provider: "perplexity", modelId: "sonar", apiKeyEnv: "PERPLEXITY_API_KEY", outputCap: 500, inputPer1M: 1, outputPer1M: 1 },
  gemini: { slug: "gemini", provider: "google", modelId: "gemini-2.5-flash", apiKeyEnv: "GEMINI_API_KEY", outputCap: 500, inputPer1M: 0.3, outputPer1M: 2.5 },
};

function costUsd(cfg: EngineConfig, tokensIn: number, tokensOut: number): number {
  const cost = new Decimal(tokensIn)
    .div(1_000_000)
    .times(cfg.inputPer1M)
    .plus(new Decimal(tokensOut).div(1_000_000).times(cfg.outputPer1M));
  return cost.toDecimalPlaces(5).toNumber();
}

class GatewayEngineClient implements EngineClient {
  readonly slug: EngineSlug;
  constructor(
    private readonly cfg: EngineConfig,
    private readonly env: EngineEnv,
  ) {
    this.slug = cfg.slug;
  }

  async ask(query: string): Promise<EngineAnswer> {
    // ── SAFETY GATE ──────────────────────────────────────────────────────
    if (this.env.MEASUREMENT_LIVE !== "1") {
      throw new MeasurementDisabledError();
    }
    // ─────────────────────────────────────────────────────────────────────
    const base = this.env.CF_AI_GATEWAY_URL;
    if (!base) throw new Error("CF_AI_GATEWAY_URL not set");
    const apiKey = this.env[this.cfg.apiKeyEnv];
    if (!apiKey) throw new Error(`${this.cfg.apiKeyEnv} not set`);

    const { url, init, parse } = this.buildRequest(base, apiKey, query);
    const res = await fetch(url, init);
    if (!res.ok) {
      throw new Error(`${this.slug} gateway ${res.status}: ${await res.text()}`);
    }
    const json = await res.json();
    const { text, tokensIn, tokensOut } = parse(json);
    return {
      text,
      tokensIn,
      tokensOut,
      costUsd: costUsd(this.cfg, tokensIn, tokensOut),
      cacheHit: res.headers.get("cf-aig-cache-status") === "HIT",
    };
  }

  // Per-provider request shape. Verify exact paths/fields against the live
  // Cloudflare AI Gateway docs at go time — providers drift.
  private buildRequest(
    base: string,
    apiKey: string,
    query: string,
  ): {
    url: string;
    init: RequestInit;
    parse: (j: any) => { text: string; tokensIn: number; tokensOut: number };
  } {
    const b = base.replace(/\/$/, "");
    const { provider, modelId, outputCap } = this.cfg;
    switch (provider) {
      case "openai":
      case "perplexity": {
        const path = provider === "openai" ? "openai" : "perplexity";
        return {
          url: `${b}/${path}/chat/completions`,
          init: {
            method: "POST",
            headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ model: modelId, max_tokens: outputCap, messages: [{ role: "user", content: query }] }),
          },
          parse: (j: any): { text: string; tokensIn: number; tokensOut: number } => ({
            text: j?.choices?.[0]?.message?.content ?? "",
            tokensIn: j?.usage?.prompt_tokens ?? 0,
            tokensOut: j?.usage?.completion_tokens ?? 0,
          }),
        };
      }
      case "anthropic":
        return {
          url: `${b}/anthropic/v1/messages`,
          init: {
            method: "POST",
            headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
            body: JSON.stringify({ model: modelId, max_tokens: outputCap, messages: [{ role: "user", content: query }] }),
          },
          parse: (j: any): { text: string; tokensIn: number; tokensOut: number } => ({
            text: (j?.content ?? []).map((c: any) => c?.text ?? "").join(""),
            tokensIn: j?.usage?.input_tokens ?? 0,
            tokensOut: j?.usage?.output_tokens ?? 0,
          }),
        };
      case "google":
        return {
          url: `${b}/google-ai-studio/v1/models/${modelId}:generateContent`,
          init: {
            method: "POST",
            headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
            body: JSON.stringify({
              contents: [{ parts: [{ text: query }] }],
              generationConfig: { maxOutputTokens: outputCap },
            }),
          },
          parse: (j: any): { text: string; tokensIn: number; tokensOut: number } => ({
            text: (j?.candidates?.[0]?.content?.parts ?? []).map((p: any) => p?.text ?? "").join(""),
            tokensIn: j?.usageMetadata?.promptTokenCount ?? 0,
            tokensOut: j?.usageMetadata?.candidatesTokenCount ?? 0,
          }),
        };
    }
  }
}

/** Builds the four live engine clients. Each is inert until MEASUREMENT_LIVE=1. */
export function createGatewayClients(env: EngineEnv): EngineClient[] {
  return (Object.keys(ENGINE_CONFIGS) as EngineSlug[]).map(
    (slug) => new GatewayEngineClient(ENGINE_CONFIGS[slug], env),
  );
}
