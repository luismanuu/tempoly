// Engine abstraction for the measurement pipeline. An EngineClient asks one
// engine one query and returns the raw answer plus usage. Implementations live
// behind the Cloudflare AI Gateway (gateway.ts). Tests use mock clients.

export type EngineSlug = "chatgpt" | "claude" | "perplexity" | "gemini";

export interface EngineAnswer {
  text: string; // full raw response
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  cacheHit?: boolean;
}

export interface EngineClient {
  readonly slug: EngineSlug;
  ask(query: string): Promise<EngineAnswer>;
}

/** Thrown by the live gateway when MEASUREMENT_LIVE is not enabled. The safety
 *  gate that guarantees we never spend on engines before CEO go. */
export class MeasurementDisabledError extends Error {
  constructor(message = "Measurement is disabled (MEASUREMENT_LIVE !== '1')") {
    super(message);
    this.name = "MeasurementDisabledError";
  }
}
