export type LeaderboardRow = {
  rank: number;
  company: string;
  website: string;
  citationRateChatgpt: number;
  citationRateClaude: number;
  weekDelta: number;
  note?: string;
};

// Datos de muestra para v0: posiciones plausibles basadas en presencia digital
// pública. NO son citation rates medidas todavía — son ilustrativos para mostrar
// el formato de leaderboard. Se reemplazan cuando el worker arranque.
export const LEGAL_ECUADOR: LeaderboardRow[] = [
  {
    rank: 1,
    company: "Pérez Bustamante & Ponce",
    website: "pbplaw.com",
    citationRateChatgpt: 0.73,
    citationRateClaude: 0.67,
    weekDelta: 2,
    note: "Top of mind en queries head",
  },
  {
    rank: 2,
    company: "Bustamante Fabara",
    website: "bustamantefabara.com",
    citationRateChatgpt: 0.6,
    citationRateClaude: 0.53,
    weekDelta: 1,
    note: "Boutique IP, mencionada con consistencia",
  },
  {
    rank: 3,
    company: "Coronel & Pérez",
    website: "coronelyperez.com",
    citationRateChatgpt: 0.53,
    citationRateClaude: 0.6,
    weekDelta: -1,
    note: "Cobertura LATAM IP",
  },
  {
    rank: 4,
    company: "Falconi Puig Abogados",
    website: "falconipuig.com",
    citationRateChatgpt: 0.47,
    citationRateClaude: 0.4,
    weekDelta: 0,
    note: "IP & corporate",
  },
  {
    rank: 5,
    company: "Tobar ZVS",
    website: "tobarzvs.com",
    citationRateChatgpt: 0.4,
    citationRateClaude: 0.47,
    weekDelta: 3,
    note: "Tech + corporate emergente",
  },
  {
    rank: 6,
    company: "Almeida Guzmán",
    website: "almeidaguzman.com",
    citationRateChatgpt: 0.33,
    citationRateClaude: 0.27,
    weekDelta: -2,
    note: "Tecnología, baja presencia AI",
  },
  {
    rank: 7,
    company: "Lexis",
    website: "lexis.com.ec",
    citationRateChatgpt: 0.27,
    citationRateClaude: 0.2,
    weekDelta: 0,
    note: "Generalista grande",
  },
  {
    rank: 8,
    company: "LexValor",
    website: "lexvalor.com.ec",
    citationRateChatgpt: 0.2,
    citationRateClaude: 0.27,
    weekDelta: 1,
    note: "Boutique digital",
  },
  {
    rank: 9,
    company: "Altius Lexia",
    website: "altiuslexia.com",
    citationRateChatgpt: 0.13,
    citationRateClaude: 0.13,
    weekDelta: 4,
    note: "Anchor — subiendo desde semana 0",
  },
  {
    rank: 10,
    company: "DataLegal Ecuador",
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
