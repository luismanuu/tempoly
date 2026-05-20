import type { CompanyRanking, EngineSlug } from "./types";

export const ENGINE_ORDER: EngineSlug[] = [
  "chatgpt",
  "claude",
  "perplexity",
  "gemini",
];

export interface CompanyInput {
  slug: string;
  name: string;
  fullName: string;
  website: string;
  city: string;
  rank: number;
  prevRank: number;
  perEngine: Record<EngineSlug, number>;
  trend: number[];
  topQueries: string[];
  blurb: string;
}

function round(n: number, places = 4): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

/**
 * Derives overall citation rate (mean across the 4 engines) and a normalized
 * share-of-voice (each company's mentions as a fraction of the industry total),
 * so shareOfVoice always sums to ~1.0 without hand-tuning.
 */
export function buildCompanies(inputs: CompanyInput[]): CompanyRanking[] {
  const withRate = inputs.map((c) => {
    const rates = ENGINE_ORDER.map((e) => c.perEngine[e]);
    const citationRate = rates.reduce((a, b) => a + b, 0) / rates.length;
    return { input: c, citationRate };
  });

  const total = withRate.reduce((a, c) => a + c.citationRate, 0);

  return withRate
    .map(({ input, citationRate }) => ({
      slug: input.slug,
      name: input.name,
      fullName: input.fullName,
      website: input.website,
      city: input.city,
      rank: input.rank,
      prevRank: input.prevRank,
      citationRate: round(citationRate),
      shareOfVoice: round(citationRate / total),
      perEngine: ENGINE_ORDER.map((engine) => ({
        engine,
        citationRate: input.perEngine[engine],
      })),
      trend: input.trend,
      topQueries: input.topQueries,
      blurb: input.blurb,
    }))
    .sort((a, b) => a.rank - b.rank);
}
