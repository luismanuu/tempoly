// Orchestration: for one industry, run every (query, engine), parse citations,
// persist runs + citations, then aggregate and save the weekly snapshot.
//
// Dependencies (engines + store) are injected so this is testable with mocks and
// makes no network/DB calls of its own. It only runs when real EngineClients are
// passed — and those are gated by MEASUREMENT_LIVE (see engines/gateway.ts). It
// is NOT invoked anywhere in this build.

import { Decimal } from "decimal.js";
import type { EngineClient, EngineSlug } from "../engines/types";
import { extractCitations, type CompanyMatcher } from "../parse/extract-citations";
import {
  aggregateLeaderboard,
  type CitationRef,
  type LeaderboardSnapshot,
  type PrevRanking,
  type RunRef,
} from "../aggregate/leaderboard";

export interface LoadedCompany {
  id: string;
  slug: string;
  names: string[]; // name + fullName + aliases, for the parser
}

export interface LoadedQuery {
  id: string;
  text: string;
}

export interface LoadedIndustry {
  industryId: string;
  companies: LoadedCompany[];
  queries: LoadedQuery[];
}

export interface QueryRunRecord {
  queryId: string;
  engineSlug: EngineSlug;
  responseRaw: string;
  costUsd: number;
  tokensIn: number;
  tokensOut: number;
  cacheHit: boolean;
}

export interface CitationRecord {
  queryRunId: string;
  companyId: string;
  position: number;
  snippet: string;
}

/** DB boundary. The orchestrator speaks slugs; the store maps to ids/tables. */
export interface MeasurementStore {
  loadIndustry(slug: string): Promise<LoadedIndustry>;
  insertQueryRun(rec: QueryRunRecord): Promise<{ id: string }>;
  insertCitations(rows: CitationRecord[]): Promise<void>;
  loadPrevRankings(
    industryId: string,
    weekStarting: string,
  ): Promise<PrevRanking[]>;
  saveSnapshot(
    industryId: string,
    snapshot: LeaderboardSnapshot,
  ): Promise<void>;
}

export interface MeasureIndustryResult {
  snapshot: LeaderboardSnapshot;
  runCount: number;
  totalCostUsd: number;
}

export async function measureIndustry(opts: {
  industrySlug: string;
  weekStarting: string;
  store: MeasurementStore;
  engines: EngineClient[];
}): Promise<MeasureIndustryResult> {
  const { industrySlug, weekStarting, store, engines } = opts;

  const { industryId, companies, queries } = await store.loadIndustry(
    industrySlug,
  );
  const companyIdBySlug = new Map(companies.map((c) => [c.slug, c.id]));
  const matchers: CompanyMatcher[] = companies.map((c) => ({
    slug: c.slug,
    names: c.names,
  }));

  const runs: RunRef[] = [];
  const citationRefs: CitationRef[] = [];
  let totalCost = new Decimal(0);

  for (const query of queries) {
    for (const engine of engines) {
      const answer = await engine.ask(query.text);
      totalCost = totalCost.plus(answer.costUsd);

      const run = await store.insertQueryRun({
        queryId: query.id,
        engineSlug: engine.slug,
        responseRaw: answer.text,
        costUsd: answer.costUsd,
        tokensIn: answer.tokensIn,
        tokensOut: answer.tokensOut,
        cacheHit: answer.cacheHit ?? false,
      });

      const matches = extractCitations(answer.text, matchers);
      const citationRows: CitationRecord[] = matches.map((m) => ({
        queryRunId: run.id,
        companyId: companyIdBySlug.get(m.slug)!,
        position: m.position,
        snippet: m.snippet,
      }));
      if (citationRows.length) await store.insertCitations(citationRows);

      runs.push({ queryId: query.id, engineSlug: engine.slug });
      for (const m of matches) {
        citationRefs.push({
          queryId: query.id,
          engineSlug: engine.slug,
          companySlug: m.slug,
        });
      }
    }
  }

  const prevRankings = await store.loadPrevRankings(industryId, weekStarting);
  const snapshot = aggregateLeaderboard({
    industrySlug,
    weekStarting,
    companySlugs: companies.map((c) => c.slug),
    engines: engines.map((e) => e.slug),
    runs,
    citations: citationRefs,
    prevRankings,
  });

  await store.saveSnapshot(industryId, snapshot);

  return {
    snapshot,
    runCount: runs.length,
    totalCostUsd: totalCost.toDecimalPlaces(5).toNumber(),
  };
}

/** Runs the pipeline for several industries in sequence. Inert until live
 *  EngineClients (gated by MEASUREMENT_LIVE) are supplied. */
export async function measureAllIndustries(opts: {
  industrySlugs: string[];
  weekStarting: string;
  store: MeasurementStore;
  engines: EngineClient[];
}): Promise<MeasureIndustryResult[]> {
  const results: MeasureIndustryResult[] = [];
  for (const slug of opts.industrySlugs) {
    results.push(
      await measureIndustry({
        industrySlug: slug,
        weekStarting: opts.weekStarting,
        store: opts.store,
        engines: opts.engines,
      }),
    );
  }
  return results;
}

/** ISO week Monday (UTC) for a given date, as YYYY-MM-DD. */
export function isoWeekMonday(date: Date): string {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const day = d.getUTCDay(); // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // shift back to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}
