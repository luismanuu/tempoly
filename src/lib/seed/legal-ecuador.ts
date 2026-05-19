export type LeaderboardRow = {
  rank: number;
  company: string;
  website: string;
  citationRateChatgpt: number;
  citationRateClaude: number;
  weekDelta: number;
  note?: string;
};

// Datos de muestra ilustrativos para v0. NO representan firmas reales — son
// placeholders genéricos para mostrar el formato de leaderboard. Se reemplazan
// con mediciones reales cuando el worker arranque (julio 2026).
export const LEGAL_ECUADOR: LeaderboardRow[] = [
  {
    rank: 1,
    company: "Firma A",
    website: "—",
    citationRateChatgpt: 0.73,
    citationRateClaude: 0.67,
    weekDelta: 2,
    note: "Top of mind en queries head",
  },
  {
    rank: 2,
    company: "Firma B",
    website: "—",
    citationRateChatgpt: 0.6,
    citationRateClaude: 0.53,
    weekDelta: 1,
    note: "Boutique IP, mencionada con consistencia",
  },
  {
    rank: 3,
    company: "Firma C",
    website: "—",
    citationRateChatgpt: 0.53,
    citationRateClaude: 0.6,
    weekDelta: -1,
    note: "Cobertura LATAM IP",
  },
  {
    rank: 4,
    company: "Firma D",
    website: "—",
    citationRateChatgpt: 0.47,
    citationRateClaude: 0.4,
    weekDelta: 0,
    note: "IP & corporate",
  },
  {
    rank: 5,
    company: "Firma E",
    website: "—",
    citationRateChatgpt: 0.4,
    citationRateClaude: 0.47,
    weekDelta: 3,
    note: "Tech + corporate emergente",
  },
  {
    rank: 6,
    company: "Firma F",
    website: "—",
    citationRateChatgpt: 0.33,
    citationRateClaude: 0.27,
    weekDelta: -2,
    note: "Tecnología, baja presencia AI",
  },
  {
    rank: 7,
    company: "Firma G",
    website: "—",
    citationRateChatgpt: 0.27,
    citationRateClaude: 0.2,
    weekDelta: 0,
    note: "Generalista grande",
  },
  {
    rank: 8,
    company: "Firma H",
    website: "—",
    citationRateChatgpt: 0.2,
    citationRateClaude: 0.27,
    weekDelta: 1,
    note: "Boutique digital",
  },
  {
    rank: 9,
    company: "Firma I",
    website: "—",
    citationRateChatgpt: 0.13,
    citationRateClaude: 0.13,
    weekDelta: 4,
    note: "Subiendo desde semana 0",
  },
  {
    rank: 10,
    company: "Firma J",
    website: "—",
    citationRateChatgpt: 0.07,
    citationRateClaude: 0.13,
    weekDelta: -1,
    note: "Boutique LOPDP",
  },
];

export const LEGAL_ECUADOR_META = {
  industrySlug: "legal-ecuador",
  industryName: "Firmas Legales Tech · Ecuador",
  totalQueries: 15,
  enginesUsed: ["ChatGPT", "Claude"] as const,
  lastUpdated: "2026-05-19",
};
