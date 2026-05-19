import { Mono } from "@/components/ui/Mono";
import {
  LEGAL_ECUADOR,
  LEGAL_ECUADOR_META,
} from "@/lib/seed/legal-ecuador";

function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function deltaText(delta: number): string {
  if (delta === 0) return "—";
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta}`;
}

function deltaColor(delta: number): string {
  if (delta > 0) return "text-[var(--color-success)]";
  if (delta < 0) return "text-[var(--color-warn)]";
  return "text-[var(--color-fg-subtle)]";
}

export function Leaderboard() {
  return (
    <div className="w-full border border-[var(--color-border)] bg-[var(--color-bg-elev)]">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <Mono>{`leaderboard · ${LEGAL_ECUADOR_META.industrySlug}`}</Mono>
          <div className="mt-1 font-(family-name:--font-display) text-xl text-[var(--color-fg)]">
            {LEGAL_ECUADOR_META.industryName}
          </div>
        </div>
        <Mono>
          {`${LEGAL_ECUADOR_META.totalQueries} queries · ${LEGAL_ECUADOR_META.enginesUsed.join(" + ")}`}
        </Mono>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full font-(family-name:--font-mono) text-sm">
          <thead>
            <tr className="text-[var(--color-fg-subtle)]">
              <th className="w-12 px-5 py-3 text-left text-[0.7rem] uppercase tracking-[0.16em]">
                #
              </th>
              <th className="px-5 py-3 text-left text-[0.7rem] uppercase tracking-[0.16em]">
                Empresa
              </th>
              <th className="px-5 py-3 text-right text-[0.7rem] uppercase tracking-[0.16em]">
                ChatGPT
              </th>
              <th className="px-5 py-3 text-right text-[0.7rem] uppercase tracking-[0.16em]">
                Claude
              </th>
              <th className="px-5 py-3 text-right text-[0.7rem] uppercase tracking-[0.16em]">
                Δ semana
              </th>
            </tr>
          </thead>
          <tbody>
            {LEGAL_ECUADOR.map((row) => {
              const anchor = row.company === "Altius Lexia";
              return (
                <tr
                  key={row.rank}
                  className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg)]"
                >
                  <td className="px-5 py-3 text-[var(--color-fg-subtle)]">
                    {String(row.rank).padStart(2, "0")}
                  </td>
                  <td className="px-5 py-3">
                    <div
                      className={
                        anchor
                          ? "text-[var(--color-success)]"
                          : "text-[var(--color-fg)]"
                      }
                    >
                      {row.company}
                    </div>
                    <div className="text-[0.72rem] text-[var(--color-fg-subtle)]">
                      {row.website}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right text-[var(--color-fg)]">
                    {pct(row.citationRateChatgpt)}
                  </td>
                  <td className="px-5 py-3 text-right text-[var(--color-fg)]">
                    {pct(row.citationRateClaude)}
                  </td>
                  <td
                    className={`px-5 py-3 text-right ${deltaColor(row.weekDelta)}`}
                  >
                    {deltaText(row.weekDelta)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="border-t border-[var(--color-border)] px-5 py-3">
        <Mono>
          {`datos de muestra · última actualización ${LEGAL_ECUADOR_META.lastUpdated}`}
        </Mono>
      </footer>
    </div>
  );
}
