# Tempoly — Measurement pipeline architecture

> Status: **build-only, inert**. Nothing in this document has been run against a
> real model provider. The live path is gated behind `MEASUREMENT_LIVE=1` (env)
> **and** `--live` (CLI) **and** explicit CEO authorization of API spend. None of
> those are set in this build.

## 1. What we measure (and why the usual cost levers don't apply)

Tempoly publishes AI-citation leaderboards: for a fixed set of queries per
industry, we ask each consumer AI engine the question and record which companies
it names. The signal we sell *is the raw model output* — so the cost-reduction
tricks that work for most LLM apps are off the table:

- ❌ **Model routing / cascades** — we cannot substitute a cheaper model; the
  point is to measure what *that specific engine* answers a real user.
- ❌ **Prompt compression / summarization** — the prompt is the user's question,
  verbatim. Shortening it changes the measurement.
- ❌ **Cheaper model for the "hard" part** — there is no hard part to offload;
  the engine's answer is the ground truth.

### Levers that DO apply

| Lever | Effect | Notes |
|---|---|---|
| **Batch API** (OpenAI, Anthropic) | −50% | Async <24h. Weekly cron has no latency pressure → ideal. |
| **Output token caps** | Bounded cost | Cap ~500 output tokens; a citation answer is short. Set per engine. |
| **Deterministic parsing** | $0 | Citation extraction is pure string matching (name + aliases). No LLM in the parse step — see `src/measurement/parse`. |
| **Consumer-default tier** | Realistic + cheap | We query each engine at the model/tier a normal user gets (gpt-5 default, sonar, etc.), not premium reasoning tiers. |
| **Sampling cadence** | Linear cost control | Head queries weekly, long-tail monthly. `queries.priority` drives this. |
| **Exact-match cache** | Dedup | CF AI Gateway caches identical (engine, prompt) pairs across industries that share a query. |
| **Budget caps + observability** | Hard ceiling | CF AI Gateway enforces per-gateway spend limits and logs every call. |

## 2. Projected cost

Deterministic parse = $0. Engine calls dominate. With 40 queries × 4 engines,
output capped, Batch where available:

- **~$0.30–1.00 / industry / run**
- **~$4–12 / month** for 3 industries run weekly
- **~$60–120 / month** at 20 industries with head-weekly / long-tail-monthly
  sampling

These are ceilings to validate against the CF AI Gateway budget cap before any
live run. The build does not commit to a number — the gateway logs do.

## 3. Data flow

```
                  (Mondays 09:00, cron — NOT deployed)
  Cloudflare Worker  ──► measureAllIndustries()
        │
        ▼
  Cloudflare AI Gateway  ──► OpenAI / Anthropic / Perplexity / Google
   (single base URL,           (consumer-default tiers, output-capped)
    per-provider path,
    cache + budget cap + logs)
        │  raw response text + token/cost usage
        ▼
  Deterministic parser  (src/measurement/parse) — no LLM, $0
   matches company name + aliases → first-occurrence position
        │
        ▼
  Supabase (service-role writes)
   ├─ query_runs   (one row per query×engine: raw response, cost, tokens, cache_hit, batch_id)
   ├─ citations    (one row per company found in a run: position, snippet, source_url)
   └─ leaderboard_snapshots  (per industry/week: rankings jsonb, pre-aggregated)
        │
        ▼
  Landing site (Vercel)  ──► reads leaderboard_snapshots ONLY
```

## 4. Why the landing never triggers a live call

The public site renders **pre-aggregated `leaderboard_snapshots`** written by the
weekly job. A page view is a single indexed `SELECT` against
`leaderboard_snapshots` (+ `companies`/`industries` for labels) under the anon
role. There is no code path from an HTTP request to an engine call: the anon role
has no access to `query_runs`, and `gateway.ask()` is server-only and gated by
`MEASUREMENT_LIVE`. Traffic spikes cost Vercel/Supabase reads, never model spend.

## 5. The safety gate (non-negotiable)

`src/measurement/engines/gateway.ts` throws `MeasurementDisabledError` from
`ask()` whenever `process.env.MEASUREMENT_LIVE !== '1'`. The Worker's scheduled
handler and the CLI both refuse to call engines unless the flag is set; the CLI
additionally requires `--live`. Default everywhere = inert. A unit test asserts
the gate throws, so the guarantee is enforced in CI, not just by convention.

Going live (later, on CEO go) means: set provider API keys + `CF_AI_GATEWAY_URL`
+ `SUPABASE_SERVICE_ROLE_KEY` as Worker secrets, set `MEASUREMENT_LIVE=1`, deploy
the Worker. None of that happens in this build.
