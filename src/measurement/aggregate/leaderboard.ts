// Pure aggregation: turns a week's query runs + citations into a leaderboard
// snapshot. Computes per-company citation rate, per-engine breakdown, normalized
// share of voice, and ranking with week-over-week movement. Decimal for the rate
// math; rounds only at output.

import { Decimal } from "decimal.js";
import type { EngineSlug } from "../engines/types";

/** One (query, engine) call that was executed. */
export interface RunRef {
  queryId: string;
  engineSlug: EngineSlug;
}

/** One company mention found in a run. */
export interface CitationRef {
  queryId: string;
  engineSlug: EngineSlug;
  companySlug: string;
}

export interface PrevRanking {
  slug: string;
  position: number;
}

export interface AggregateInput {
  industrySlug: string;
  weekStarting: string; // ISO date (Monday)
  companySlugs: string[]; // all tracked companies (so zero-citation ones appear)
  engines: EngineSlug[];
  runs: RunRef[];
  citations: CitationRef[];
  prevRankings?: PrevRanking[];
}

export interface EngineScore {
  engine: EngineSlug;
  citation_rate: number;
}

export interface CompanyRankingRow {
  slug: string;
  position: number;
  citation_rate: number; // mean across engines, 0..1
  share_of_voice: number; // normalized fraction of all mentions
  mentions: number; // total (query×engine) mentions
  per_engine: EngineScore[];
  change_vs_prev: number | null; // prevPos - pos; +up, -down, null if new
}

export interface LeaderboardSnapshot {
  industrySlug: string;
  weekStarting: string;
  totalQueries: number;
  enginesUsed: EngineSlug[];
  rankings: CompanyRankingRow[];
}

function round(d: Decimal, places = 4): number {
  return d.toDecimalPlaces(places).toNumber();
}

export function aggregateLeaderboard(
  input: AggregateInput,
): LeaderboardSnapshot {
  const { engines, runs, citations, companySlugs } = input;

  // Queries run per engine (distinct query ids).
  const runQueriesByEngine = new Map<EngineSlug, Set<string>>();
  for (const e of engines) runQueriesByEngine.set(e, new Set());
  for (const r of runs) runQueriesByEngine.get(r.engineSlug)?.add(r.queryId);

  // Per company: distinct cited queries per engine, and total mentions.
  const citedByCompanyEngine = new Map<string, Map<EngineSlug, Set<string>>>();
  const mentionsByCompany = new Map<string, number>();
  for (const slug of companySlugs) {
    citedByCompanyEngine.set(slug, new Map(engines.map((e) => [e, new Set()])));
    mentionsByCompany.set(slug, 0);
  }
  for (const c of citations) {
    const perEngine = citedByCompanyEngine.get(c.companySlug);
    if (!perEngine) continue; // citation for an untracked company → ignore
    perEngine.get(c.engineSlug)?.add(c.queryId);
    mentionsByCompany.set(
      c.companySlug,
      (mentionsByCompany.get(c.companySlug) ?? 0) + 1,
    );
  }

  const totalMentions = [...mentionsByCompany.values()].reduce((a, b) => a + b, 0);
  const prevPos = new Map(
    (input.prevRankings ?? []).map((p) => [p.slug, p.position]),
  );

  const rows = companySlugs.map((slug) => {
    const perEngine: EngineScore[] = engines.map((engine) => {
      const ran = runQueriesByEngine.get(engine)?.size ?? 0;
      const cited = citedByCompanyEngine.get(slug)?.get(engine)?.size ?? 0;
      const rate = ran === 0 ? new Decimal(0) : new Decimal(cited).div(ran);
      return { engine, citation_rate: round(rate) };
    });

    // Overall rate = mean of per-engine rates over engines that actually ran.
    const ranEngines = engines.filter(
      (e) => (runQueriesByEngine.get(e)?.size ?? 0) > 0,
    );
    const overall = ranEngines.length
      ? ranEngines
          .reduce((acc, engine) => {
            const ran = runQueriesByEngine.get(engine)!.size;
            const cited = citedByCompanyEngine.get(slug)?.get(engine)?.size ?? 0;
            return acc.plus(new Decimal(cited).div(ran));
          }, new Decimal(0))
          .div(ranEngines.length)
      : new Decimal(0);

    const mentions = mentionsByCompany.get(slug) ?? 0;
    const sov =
      totalMentions === 0
        ? new Decimal(0)
        : new Decimal(mentions).div(totalMentions);

    return {
      slug,
      citation_rate: round(overall),
      share_of_voice: round(sov),
      mentions,
      per_engine: perEngine,
      _overall: overall,
    };
  });

  // Rank: citation rate desc, then mentions desc, then slug asc (stable ties).
  rows.sort(
    (a, b) =>
      b._overall.cmp(a._overall) ||
      b.mentions - a.mentions ||
      a.slug.localeCompare(b.slug),
  );

  const rankings: CompanyRankingRow[] = rows.map((r, i) => {
    const position = i + 1;
    const prev = prevPos.get(r.slug);
    return {
      slug: r.slug,
      position,
      citation_rate: r.citation_rate,
      share_of_voice: r.share_of_voice,
      mentions: r.mentions,
      per_engine: r.per_engine,
      change_vs_prev: prev === undefined ? null : prev - position,
    };
  });

  const totalQueries = new Set(runs.map((r) => r.queryId)).size;
  const enginesUsed = engines.filter(
    (e) => (runQueriesByEngine.get(e)?.size ?? 0) > 0,
  );

  return {
    industrySlug: input.industrySlug,
    weekStarting: input.weekStarting,
    totalQueries,
    enginesUsed,
    rankings,
  };
}
