#!/usr/bin/env node
// Measurement CLI.
//
//   node --import ./scripts/register-ts.mjs scripts/measure.mjs --industry <slug>
//   (alias: pnpm measure -- --industry universidades-ecuador)
//
// DEFAULTS TO DRY-RUN: uses offline fixture responses built from the static
// seed, makes NO network calls, writes NOTHING to the DB, and just prints the
// snapshot it would produce.
//
// LIVE mode requires ALL of: --live flag AND MEASUREMENT_LIVE=1 AND CEO go.
// Without all three the run stays in dry-run / refuses, so it can never spend.
import { INDUSTRIES } from "../src/lib/seed/index.ts";
import {
  measureIndustry,
  isoWeekMonday,
} from "../src/measurement/run/measure-industry.ts";

function parseArgs(argv) {
  const args = { industry: null, live: false, dryRun: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--industry") args.industry = argv[++i];
    else if (a === "--live") args.live = true;
    else if (a === "--dry-run") args.dryRun = true;
  }
  if (args.live) args.dryRun = false;
  return args;
}

// Build an offline industry from static seed (id = slug/index — no DB).
function loadFromSeed(industry) {
  return {
    industryId: industry.slug,
    companies: industry.companies.map((c) => ({
      id: c.slug,
      slug: c.slug,
      names: [...new Set([c.name, c.fullName].filter(Boolean))],
    })),
    queries: industry.queryGroups
      .flatMap((g) => g.queries)
      .map((text, i) => ({ id: `q${i}`, text })),
  };
}

// Deterministic fixture engine: names the top-K companies (by rank) so the
// parser finds citations. K varies per engine to create realistic spread.
function fixtureEngine(slug, industry, k) {
  const top = [...industry.companies]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, k)
    .map((c) => c.name);
  const text = `Entre las mejores opciones se encuentran ${top.join(", ")}.`;
  return {
    slug,
    async ask() {
      return { text, tokensIn: 30, tokensOut: 40, costUsd: 0 };
    },
  };
}

// In-memory store for dry-run: captures, never persists.
function memoryStore(industry) {
  let seq = 0;
  return {
    runs: [],
    citations: [],
    snapshot: null,
    async loadIndustry() {
      return loadFromSeed(industry);
    },
    async insertQueryRun(rec) {
      const id = `run-${++seq}`;
      this.runs.push({ ...rec, id });
      return { id };
    },
    async insertCitations(rows) {
      this.citations.push(...rows);
    },
    async loadPrevRankings() {
      return [];
    },
    async saveSnapshot(_id, snap) {
      this.snapshot = snap;
    },
  };
}

async function dryRun(industry) {
  const store = memoryStore(industry);
  // Distinct K per engine → varied per-engine rates, still fully offline.
  const engines = [
    fixtureEngine("chatgpt", industry, 6),
    fixtureEngine("claude", industry, 5),
    fixtureEngine("perplexity", industry, 7),
    fixtureEngine("gemini", industry, 4),
  ];
  const result = await measureIndustry({
    industrySlug: industry.slug,
    weekStarting: isoWeekMonday(new Date()),
    store,
    engines,
  });

  console.log(`\nDRY-RUN — ${industry.name} (${industry.slug})`);
  console.log(`  no network calls, no DB writes`);
  console.log(
    `  runs=${result.runCount}  queries=${result.snapshot.totalQueries}  engines=${result.snapshot.enginesUsed.join(",")}`,
  );
  console.log("  top of leaderboard (fixture data):");
  for (const row of result.snapshot.rankings.slice(0, 5)) {
    console.log(
      `    #${row.position}  ${row.slug.padEnd(24)} rate=${row.citation_rate}  sov=${row.share_of_voice}`,
    );
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const industries = args.industry
    ? INDUSTRIES.filter((i) => i.slug === args.industry)
    : INDUSTRIES;
  if (args.industry && industries.length === 0) {
    console.error(`Unknown industry: ${args.industry}`);
    process.exit(1);
  }

  if (!args.live) {
    for (const industry of industries) await dryRun(industry);
    console.log("\nDry-run complete. Zero engine calls, zero DB writes.");
    return;
  }

  // ── LIVE PATH ──────────────────────────────────────────────────────────
  // Triple gate. We refuse here unless the env flag is also set; and even then
  // the gateway re-checks the flag before any fetch.
  if (process.env.MEASUREMENT_LIVE !== "1") {
    console.error(
      "Refusing --live: MEASUREMENT_LIVE !== '1'. Live runs require --live AND " +
        "MEASUREMENT_LIVE=1 AND CEO authorization of API spend.",
    );
    process.exit(1);
  }
  const { SupabaseStore } = await import(
    "../src/measurement/run/supabase-store.ts"
  );
  const { createGatewayClients } = await import(
    "../src/measurement/engines/gateway.ts"
  );
  const store = SupabaseStore.fromEnv(process.env);
  const engines = createGatewayClients(process.env);
  const weekStarting = isoWeekMonday(new Date());
  for (const industry of industries) {
    const r = await measureIndustry({
      industrySlug: industry.slug,
      weekStarting,
      store,
      engines,
    });
    console.log(
      `LIVE ${industry.slug}: runs=${r.runCount} cost=$${r.totalCostUsd}`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
