"use client";

import { useState } from "react";
import { Mono } from "@/components/ui/Mono";
import type { Industry } from "@/lib/seed/types";
import { LeaderboardTable } from "./LeaderboardTable";
import { MoversStrip } from "./MoversStrip";

type Props = {
  industries: Industry[];
};

export function IndustrySwitcher({ industries }: Props) {
  const [active, setActive] = useState(0);
  const industry = industries[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Industrias"
        className="flex flex-wrap gap-2"
      >
        {industries.map((ind, i) => {
          const selected = i === active;
          return (
            <button
              key={ind.slug}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              className={`border px-4 py-2 font-(family-name:--font-mono) text-[0.78rem] uppercase tracking-[0.16em] transition-colors ${
                selected
                  ? "border-[var(--color-success)] bg-[var(--color-success)] text-[var(--color-bg)]"
                  : "border-[var(--color-border-strong)] text-[var(--color-fg-muted)] hover:border-[var(--color-fg)] hover:text-[var(--color-fg)]"
              }`}
            >
              {ind.name}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
        <p className="max-w-xl text-[var(--color-fg-muted)]">{industry.tagline}</p>
        <a
          href={`/leaderboards/${industry.slug}`}
          className="font-(family-name:--font-mono) text-[0.78rem] uppercase tracking-[0.16em] text-[var(--color-success)] hover:underline underline-offset-4"
        >
          Ver leaderboard completo →
        </a>
      </div>

      <div className="mt-5">
        <LeaderboardTable industry={industry} limit={8} />
      </div>

      <div className="mt-6">
        <MoversStrip industry={industry} />
      </div>

      <p className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Mono>{`actualizado ${industry.lastUpdated} · cadencia semanal`}</Mono>
        <a
          href="/metodologia"
          className="font-(family-name:--font-mono) text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)] hover:text-[var(--color-success)]"
        >
          Cómo medimos →
        </a>
      </p>
    </div>
  );
}
