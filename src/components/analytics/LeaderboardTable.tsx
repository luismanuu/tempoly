"use client";

import { useState } from "react";
import { Mono } from "@/components/ui/Mono";
import { formatPct } from "@/lib/format";
import { ENGINE_LABELS, type Industry } from "@/lib/seed/types";
import { Sparkline } from "./Sparkline";

type SortKey = "rank" | "citationRate" | "shareOfVoice";

type Props = {
  industry: Industry;
  limit?: number;
};

function MovementArrow({ rank, prevRank }: { rank: number; prevRank: number }) {
  const delta = prevRank - rank; // positive = moved up
  if (delta === 0) {
    return (
      <span
        className="text-[var(--color-fg-subtle)]"
        aria-label="sin cambio"
        title="Sin cambio"
      >
        —
      </span>
    );
  }
  const up = delta > 0;
  return (
    <span
      className={up ? "text-[var(--color-success)]" : "text-[var(--color-warn)]"}
      aria-label={up ? `subió ${delta}` : `bajó ${Math.abs(delta)}`}
      title={up ? `Subió ${delta}` : `Bajó ${Math.abs(delta)}`}
    >
      {up ? "▲" : "▼"}
      {Math.abs(delta)}
    </span>
  );
}

function Bar({ value, max }: { value: number; max: number }) {
  const width = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return (
    <span className="block h-1 w-full bg-[var(--color-border)]">
      <span
        className="block h-1 bg-[var(--color-success)]"
        style={{ width: `${width}%` }}
      />
    </span>
  );
}

export function LeaderboardTable({ industry, limit }: Props) {
  const [sort, setSort] = useState<SortKey>("rank");

  const maxRate = Math.max(...industry.companies.map((c) => c.citationRate));
  const maxSov = Math.max(...industry.companies.map((c) => c.shareOfVoice));

  const sorted = [...industry.companies].sort((a, b) => {
    if (sort === "rank") return a.rank - b.rank;
    return b[sort] - a[sort];
  });
  const rows = limit ? sorted.slice(0, limit) : sorted;

  function header(key: SortKey, label: string, align: "left" | "right") {
    const active = sort === key;
    return (
      <button
        type="button"
        onClick={() => setSort(key)}
        className={`flex items-center gap-1 text-[0.7rem] uppercase tracking-[0.16em] ${
          align === "right" ? "ml-auto" : ""
        } ${
          active
            ? "text-[var(--color-success)]"
            : "text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]"
        }`}
        aria-pressed={active}
      >
        {label}
        {active ? <span aria-hidden>↓</span> : null}
      </button>
    );
  }

  return (
    <div className="w-full border border-[var(--color-border)] bg-[var(--color-bg-elev)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] font-(family-name:--font-mono) text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="w-16 px-4 py-3 text-left">{header("rank", "#", "left")}</th>
              <th className="px-4 py-3 text-left text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                Empresa
              </th>
              <th className="w-40 px-4 py-3 text-right">
                {header("citationRate", "Citación", "right")}
              </th>
              <th className="w-32 px-4 py-3 text-right">
                {header("shareOfVoice", "Voz", "right")}
              </th>
              <th className="w-24 px-4 py-3 text-right text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                8 sem
              </th>
              <th className="w-28 px-4 py-3 text-right text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                Motores
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.slug}
                className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-bg)]"
              >
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[var(--color-fg-subtle)]">
                      {String(c.rank).padStart(2, "0")}
                    </span>
                    <MovementArrow rank={c.rank} prevRank={c.prevRank} />
                  </div>
                </td>
                <td className="px-4 py-3 align-middle">
                  <a
                    href={`/leaderboards/${industry.slug}/${c.slug}`}
                    className="text-[var(--color-fg)] hover:text-[var(--color-success)] hover:underline underline-offset-4"
                  >
                    {c.name}
                  </a>
                  <div className="text-[0.72rem] text-[var(--color-fg-subtle)]">
                    {c.city}
                  </div>
                </td>
                <td className="px-4 py-3 align-middle text-right">
                  <div className="text-[var(--color-fg)]">
                    {formatPct(c.citationRate)}
                  </div>
                  <div className="mt-1">
                    <Bar value={c.citationRate} max={maxRate} />
                  </div>
                </td>
                <td className="px-4 py-3 align-middle text-right">
                  <div className="text-[var(--color-fg-muted)]">
                    {formatPct(c.shareOfVoice, 1)}
                  </div>
                  <div className="mt-1">
                    <Bar value={c.shareOfVoice} max={maxSov} />
                  </div>
                </td>
                <td className="px-4 py-3 align-middle text-right">
                  <div className="flex justify-end">
                    <Sparkline
                      values={c.trend}
                      aria-label={`Tendencia de ${c.name}`}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 align-middle">
                  <div className="flex justify-end gap-1.5">
                    {c.perEngine.map((e) => (
                      <span
                        key={e.engine}
                        className="inline-block size-2.5 rounded-full bg-[var(--color-success)]"
                        style={{ opacity: 0.25 + e.citationRate * 0.75 }}
                        title={`${ENGINE_LABELS[e.engine]}: ${formatPct(e.citationRate)}`}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] px-4 py-3">
        <Mono>
          {`${industry.companies.length} empresas · 40 queries · ${industry.engines.length} motores`}
        </Mono>
        <Mono className="text-[var(--color-fg-subtle)]">
          ordenar: rank · citación · voz
        </Mono>
      </footer>
    </div>
  );
}
