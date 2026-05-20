// Cloudflare Worker: weekly measurement cron. CONFIGURED BUT NOT DEPLOYED.
//
// The scheduled handler is doubly inert in this build:
//   1. It exits early unless env.MEASUREMENT_LIVE === '1'.
//   2. Even if reached, every engine call goes through the gateway safety gate,
//      which throws unless MEASUREMENT_LIVE === '1'.
// Going live requires setting the Worker secrets + MEASUREMENT_LIVE=1 and
// deploying — none of which is done here. See worker/README.md.

import {
  isoWeekMonday,
  measureAllIndustries,
} from "../../src/measurement/run/measure-industry";
import { SupabaseStore } from "../../src/measurement/run/supabase-store";
import { createGatewayClients } from "../../src/measurement/engines/gateway";

// Minimal Workers runtime shapes (avoids a build-time dependency on
// @cloudflare/workers-types; the runtime provides the real objects).
interface ScheduledController {
  scheduledTime: number;
  cron: string;
}
interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

export interface Env {
  MEASUREMENT_LIVE?: string;
  CF_AI_GATEWAY_URL?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  PERPLEXITY_API_KEY?: string;
  GEMINI_API_KEY?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

const INDUSTRY_SLUGS = [
  "universidades-ecuador",
  "bancos-ecuador",
  "hospitales-ecuador",
];

export default {
  async scheduled(
    event: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    if (env.MEASUREMENT_LIVE !== "1") {
      console.log(
        "measurement disabled (MEASUREMENT_LIVE !== '1') — exiting, no engine calls",
      );
      return;
    }

    const weekStarting = isoWeekMonday(new Date(event.scheduledTime));
    const store = SupabaseStore.fromEnv(env as Record<string, string | undefined>);
    const engines = createGatewayClients(env as Record<string, string | undefined>);

    ctx.waitUntil(
      measureAllIndustries({
        industrySlugs: INDUSTRY_SLUGS,
        weekStarting,
        store,
        engines,
      }).then((results) => {
        const cost = results.reduce((s, r) => s + r.totalCostUsd, 0);
        const runs = results.reduce((s, r) => s + r.runCount, 0);
        console.log(
          `measurement complete: ${results.length} industries, ${runs} runs, $${cost.toFixed(4)}`,
        );
      }),
    );
  },
};
