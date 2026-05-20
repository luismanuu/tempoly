import { UNIVERSIDADES_ECUADOR } from "./universidades-ecuador";
import { BANCOS_ECUADOR } from "./bancos-ecuador";
import { HOSPITALES_ECUADOR } from "./hospitales-ecuador";
import type { CompanyRanking, Industry } from "./types";

export const INDUSTRIES: Industry[] = [
  UNIVERSIDADES_ECUADOR,
  BANCOS_ECUADOR,
  HOSPITALES_ECUADOR,
];

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

export function getCompany(
  industrySlug: string,
  companySlug: string,
): { industry: Industry; company: CompanyRanking } | undefined {
  const industry = getIndustry(industrySlug);
  if (!industry) return undefined;
  const company = industry.companies.find((c) => c.slug === companySlug);
  if (!company) return undefined;
  return { industry, company };
}

export * from "./types";
