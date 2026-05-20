import { afterEach, describe, expect, it, vi } from "vitest";
import { createGatewayClients } from "../engines/gateway";
import { MeasurementDisabledError } from "../engines/types";

afterEach(() => vi.restoreAllMocks());

describe("gateway safety gate", () => {
  it("ask() throws MeasurementDisabledError when MEASUREMENT_LIVE !== '1'", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new Error("network must not be touched"));

    // Even with provider keys + gateway URL present, an unset flag blocks all calls.
    const env = {
      CF_AI_GATEWAY_URL: "https://gateway.example/v1",
      OPENAI_API_KEY: "sk-test",
      ANTHROPIC_API_KEY: "sk-test",
      PERPLEXITY_API_KEY: "pk-test",
      GEMINI_API_KEY: "g-test",
      // MEASUREMENT_LIVE intentionally absent
    };

    const clients = createGatewayClients(env);
    expect(clients).toHaveLength(4);

    for (const client of clients) {
      await expect(client.ask("¿mejor universidad?")).rejects.toBeInstanceOf(
        MeasurementDisabledError,
      );
    }

    // The guarantee: zero network calls were made.
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("still refuses when the flag is any value other than exactly '1'", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const [client] = createGatewayClients({
      MEASUREMENT_LIVE: "true",
      CF_AI_GATEWAY_URL: "https://gateway.example/v1",
      OPENAI_API_KEY: "sk-test",
    });
    await expect(client.ask("hola")).rejects.toBeInstanceOf(
      MeasurementDisabledError,
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
