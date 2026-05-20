import { Mono } from "@/components/ui/Mono";
import type { CompanyRanking, Industry } from "@/lib/seed/types";

type Props = {
  industry: Industry;
};

function MoverRow({
  industrySlug,
  company,
}: {
  industrySlug: string;
  company: CompanyRanking;
}) {
  const delta = company.prevRank - company.rank;
  const up = delta > 0;
  return (
    <li>
      <a
        href={`/leaderboards/${industrySlug}/${company.slug}`}
        className="flex items-baseline justify-between gap-3 py-2 hover:text-[var(--color-success)]"
      >
        <span className="text-[var(--color-fg)]">{company.name}</span>
        <span
          className={`font-(family-name:--font-mono) text-sm ${
            up ? "text-[var(--color-success)]" : "text-[var(--color-warn)]"
          }`}
        >
          {up ? "▲" : "▼"}
          {Math.abs(delta)} · #{company.rank}
        </span>
      </a>
    </li>
  );
}

export function MoversStrip({ industry }: Props) {
  const movers = industry.companies.filter((c) => c.prevRank !== c.rank);
  const gainers = movers
    .filter((c) => c.prevRank - c.rank > 0)
    .sort((a, b) => b.prevRank - b.rank - (a.prevRank - a.rank))
    .slice(0, 3);
  const losers = movers
    .filter((c) => c.prevRank - c.rank < 0)
    .sort((a, b) => a.prevRank - a.rank - (b.prevRank - b.rank))
    .slice(0, 3);

  if (gainers.length === 0 && losers.length === 0) return null;

  return (
    <div className="grid gap-px overflow-hidden border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2">
      <div className="bg-[var(--color-bg-elev)] p-5">
        <Mono className="text-[var(--color-success)]">▲ subieron esta semana</Mono>
        <ul className="mt-3 divide-y divide-[var(--color-border)]">
          {gainers.map((c) => (
            <MoverRow key={c.slug} industrySlug={industry.slug} company={c} />
          ))}
        </ul>
      </div>
      <div className="bg-[var(--color-bg-elev)] p-5">
        <Mono className="text-[var(--color-warn)]">▼ bajaron esta semana</Mono>
        <ul className="mt-3 divide-y divide-[var(--color-border)]">
          {losers.map((c) => (
            <MoverRow key={c.slug} industrySlug={industry.slug} company={c} />
          ))}
        </ul>
      </div>
    </div>
  );
}
