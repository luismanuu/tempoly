# Tempoly measurement Worker

Weekly cron that runs the citation-measurement pipeline. **Built but NOT
deployed.** Inert until the CEO authorizes API spend.

## Status

- ⛔ **Not deployed.** Do not run `wrangler deploy`.
- ⛔ **No secrets set.** Do not run `wrangler secret put …` yet.
- The scheduled handler exits early unless `MEASUREMENT_LIVE === "1"`, and the
  engine gateway throws `MeasurementDisabledError` before any network call when
  that flag isn't exactly `"1"`. Two independent inert layers.

## What it does (once live)

`crons = ["0 9 * * 1"]` — Mondays 09:00 UTC → `scheduled()` →
`measureAllIndustries()` over the 3 seeded industries → CF AI Gateway → 4 engines
→ deterministic parse → writes `query_runs` / `citations` / `leaderboard_snapshots`.

## Required secrets (set at go time, never committed)

```sh
wrangler secret put OPENAI_API_KEY
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put PERPLEXITY_API_KEY
wrangler secret put GEMINI_API_KEY
wrangler secret put CF_AI_GATEWAY_URL          # e.g. https://gateway.ai.cloudflare.com/v1/<acct>/<gw>
wrangler secret put NEXT_PUBLIC_SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

`MEASUREMENT_LIVE` is set as a plain var (`[vars]` in `wrangler.toml`, currently
commented out) to `"1"` only when going live.

## Go-live checklist (later, on CEO go — NOT now)

1. Confirm CEO authorization of API spend.
2. Set a budget cap + alerts on the Cloudflare AI Gateway.
3. `wrangler secret put …` for all keys above.
4. Uncomment `[vars] MEASUREMENT_LIVE = "1"` in `wrangler.toml`.
5. `wrangler deploy`.
6. Trigger one manual run, verify cost in the gateway logs matches the estimate
   in `docs/measurement-architecture.md`, then let the cron take over.

## Local offline exercise (safe, no spend)

```sh
pnpm measure -- --industry universidades-ecuador   # dry-run, fixtures, no network
```
