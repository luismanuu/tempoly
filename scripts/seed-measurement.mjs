#!/usr/bin/env node
// Loads the static seed (engines, industries, queries, companies) into Supabase.
// Idempotent: upserts by slug / (industry, text). Makes NO engine calls — pure
// DB writes of public, static data. Re-runnable by the team at any time.
//
// Run:
//   export NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=...
//   node --import ./scripts/register-ts.mjs scripts/seed-measurement.mjs
import { createClient } from "@supabase/supabase-js";
import { INDUSTRIES } from "../src/lib/seed/index.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.",
  );
  process.exit(1);
}

const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Engine catalog — consumer-default tiers. Mirrors the plan. Stored as data so
// model IDs can be revised before go without code changes.
const ENGINES = [
  { slug: "chatgpt", name: "ChatGPT", provider: "openai", model_id: "gpt-5", tier: "default", output_cap: 500 },
  { slug: "claude", name: "Claude", provider: "anthropic", model_id: "claude-sonnet-4-6", tier: "default", output_cap: 500 },
  { slug: "perplexity", name: "Perplexity", provider: "perplexity", model_id: "sonar", tier: "default", output_cap: 500 },
  { slug: "gemini", name: "Gemini", provider: "google", model_id: "gemini-2.5-flash", tier: "default", output_cap: 500 },
];

function aliasesFor(c) {
  // Conservative: only the company's own name + full name (deduped, no guessed
  // nicknames). Curate richer aliases per company before go (see questions doc).
  return [...new Set([c.name, c.fullName].filter(Boolean))];
}

function priorityFor(category) {
  return /long.?tail/i.test(category) ? 2 : 1;
}

async function check(label, { error }) {
  if (error) {
    console.error(`✗ ${label}: ${error.message}`);
    process.exit(1);
  }
  console.log(`✓ ${label}`);
}

async function main() {
  await check(
    `engines (${ENGINES.length})`,
    await db.from("engines").upsert(ENGINES, { onConflict: "slug" }),
  );

  // Industries — upsert, then read back ids by slug.
  const industryRows = INDUSTRIES.map((i) => ({
    slug: i.slug,
    name: i.name,
    region: i.region,
    language: "es",
    active: true,
  }));
  await check(
    `industries (${industryRows.length})`,
    await db.from("industries").upsert(industryRows, { onConflict: "slug" }),
  );

  const { data: industries, error: indErr } = await db
    .from("industries")
    .select("id, slug");
  if (indErr) {
    console.error(`✗ read industries: ${indErr.message}`);
    process.exit(1);
  }
  const idBySlug = Object.fromEntries(industries.map((r) => [r.slug, r.id]));

  for (const industry of INDUSTRIES) {
    const industryId = idBySlug[industry.slug];

    const queryRows = industry.queryGroups.flatMap((g) =>
      g.queries.map((text) => ({
        industry_id: industryId,
        text,
        category: g.category,
        priority: priorityFor(g.category),
      })),
    );
    await check(
      `queries[${industry.slug}] (${queryRows.length})`,
      await db
        .from("queries")
        .upsert(queryRows, { onConflict: "industry_id,text" }),
    );

    const companyRows = industry.companies.map((c) => ({
      industry_id: industryId,
      slug: c.slug,
      name: c.name,
      full_name: c.fullName,
      website: c.website,
      city: c.city,
      aliases: aliasesFor(c),
      active: true,
    }));
    await check(
      `companies[${industry.slug}] (${companyRows.length})`,
      await db.from("companies").upsert(companyRows, { onConflict: "slug" }),
    );
  }

  console.log("\nSeed load complete. No engine calls made.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
