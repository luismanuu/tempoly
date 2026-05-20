export type EngineSlug = "chatgpt" | "claude" | "perplexity" | "gemini";

export const ENGINE_LABELS: Record<EngineSlug, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  perplexity: "Perplexity",
  gemini: "Gemini",
};

export interface EngineScore {
  engine: EngineSlug;
  citationRate: number; // 0..1, fraction of queries where company appears in this engine
}

export interface CompanyRanking {
  slug: string; // "usfq"
  name: string; // "USFQ"
  fullName: string; // "Universidad San Francisco de Quito"
  website: string; // "usfq.edu.ec"
  city: string; // "Quito"
  rank: number; // 1-based current rank
  prevRank: number; // last week's rank (for movement arrows)
  citationRate: number; // 0..1 overall (avg across engines)
  shareOfVoice: number; // 0..1, fraction of total mentions in the industry
  perEngine: EngineScore[];
  trend: number[]; // 8 weekly citationRate values, oldest→newest (for sparkline)
  topQueries: string[]; // 2-3 queries where this company appears strongest
  blurb: string; // 1-2 sentence factual description (NO fabricated metric claims)
}

export interface QueryGroup {
  category: string; // e.g. "Head terms", "Por carrera"
  queries: string[];
}

export interface Industry {
  slug: string; // "universidades-ecuador"
  name: string; // "Universidades"
  region: string; // "Ecuador"
  tagline: string; // short positioning line
  queryGroups: QueryGroup[]; // ~40 queries grouped by category
  engines: EngineSlug[]; // engines tracked
  companies: CompanyRanking[];
  lastUpdated: string; // ISO date, recent (NOT a future date)
}

export function allQueries(industry: Industry): string[] {
  return industry.queryGroups.flatMap((g) => g.queries);
}

export function queryCount(industry: Industry): number {
  return industry.queryGroups.reduce((n, g) => n + g.queries.length, 0);
}

export function topCompany(industry: Industry): CompanyRanking {
  return industry.companies.reduce((a, b) => (a.rank <= b.rank ? a : b));
}
