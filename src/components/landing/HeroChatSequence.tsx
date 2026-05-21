"use client";

import { motion, useReducedMotion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Mono } from "@/components/ui/Mono";
import { formatPct } from "@/lib/format";
import { INDUSTRIES } from "@/lib/seed";

type Scenario = {
  industry: string;
  query: string;
  response: string;
  top5: { rank: number; name: string; rate: string; delta: string }[];
};

function deltaText(rank: number, prevRank: number): string {
  const d = prevRank - rank;
  if (d === 0) return "—";
  return d > 0 ? `+${d}` : `${d}`;
}

// Built from the real seed so the chat reveal never drifts from the leaderboards.
const SCENARIOS: Scenario[] = INDUSTRIES.map((ind) => {
  const top = [...ind.companies].sort((a, b) => a.rank - b.rank);
  const [a, b, c] = top;
  return {
    industry: ind.name,
    query: ind.queryGroups[0].queries[0],
    response: `Según las respuestas que medimos, los más citados para esta pregunta son ${a.name}, ${b.name} y ${c.name}. ${a.name} aparece en la mayoría de los motores.`,
    top5: top.slice(0, 5).map((co) => ({
      rank: co.rank,
      name: co.name,
      rate: formatPct(co.citationRate),
      delta: deltaText(co.rank, co.prevRank),
    })),
  };
});

type Phase = "idle" | "typing" | "thinking" | "streaming" | "reveal" | "locked";

const TIMINGS = {
  typeCharMs: 34,
  streamCharMs: 18,
  idleHoldMs: 500,
  thinkingMs: 600,
  revealHoldMs: 900,
  lockedHoldMs: 3200,
};

export function HeroChatSequence() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { amount: 0.4 });
  const [phaseState, setPhase] = useState<Phase>("idle");
  const [typedState, setTyped] = useState("");
  const [streamedState, setStreamed] = useState("");
  const [cycle, setCycle] = useState(0);

  const scenario = SCENARIOS[cycle % SCENARIOS.length];
  const phase: Phase = reduced ? "locked" : phaseState;
  const typed = reduced ? scenario.query : typedState;
  const streamed = reduced ? scenario.response : streamedState;

  useEffect(() => {
    if (reduced) return;
    if (!inView) return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const after = (ms: number, fn: () => void) => {
      const t = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(t);
    };

    const query = scenario.query;
    const response = scenario.response;

    after(0, () => {
      setTyped("");
      setStreamed("");
      setPhase("idle");
    });

    after(TIMINGS.idleHoldMs, () => {
      setPhase("typing");
      for (let i = 1; i <= query.length; i++) {
        after(TIMINGS.idleHoldMs + i * TIMINGS.typeCharMs, () => {
          setTyped(query.slice(0, i));
        });
      }
      const typingDoneAt = TIMINGS.idleHoldMs + query.length * TIMINGS.typeCharMs;

      const thinkingAt = typingDoneAt + 200;
      after(thinkingAt, () => setPhase("thinking"));

      const streamingStartAt = thinkingAt + TIMINGS.thinkingMs;
      after(streamingStartAt, () => setPhase("streaming"));

      for (let i = 1; i <= response.length; i++) {
        after(streamingStartAt + i * TIMINGS.streamCharMs, () => {
          setStreamed(response.slice(0, i));
        });
      }
      const streamingDoneAt =
        streamingStartAt + response.length * TIMINGS.streamCharMs;

      const revealAt = streamingDoneAt + TIMINGS.revealHoldMs;
      after(revealAt, () => setPhase("reveal"));

      const lockedAt = revealAt + 900;
      after(lockedAt, () => setPhase("locked"));

      after(lockedAt + TIMINGS.lockedHoldMs, () => {
        setCycle((c) => c + 1);
      });
    });

    return () => {
      cancelled = true;
      for (const t of timers) clearTimeout(t);
    };
  }, [reduced, inView, cycle, scenario.query, scenario.response]);

  const showLeaderboard = phase === "reveal" || phase === "locked";
  const chatOpacity = phase === "locked" ? 0.35 : 1;

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        animate={{ opacity: chatOpacity }}
        transition={{ duration: 0.6 }}
        className="border border-[var(--color-border)] bg-[var(--color-bg-elev)]"
      >
        <header className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
          <span
            aria-hidden
            className="inline-block size-2 rounded-full bg-[var(--color-success)]"
          />
          <Mono>{`Claude · ${scenario.industry.toLowerCase()} · Ecuador`}</Mono>
        </header>

        <div className="px-5 py-5 font-(family-name:--font-mono) text-[0.85rem] leading-relaxed text-[var(--color-fg)]">
          <div>
            <Mono className="text-[var(--color-fg-subtle)]">User</Mono>
            <p
              className="mt-2 min-h-[1.5rem] text-[var(--color-fg)]"
              data-testid="hero-chat-user"
            >
              {typed}
              {phase === "typing" ? <Caret /> : null}
            </p>
          </div>

          <div className="mt-6">
            <Mono className="text-[var(--color-success)]">Claude</Mono>
            <p
              className="mt-2 min-h-[3rem] text-[var(--color-fg-muted)]"
              data-testid="hero-chat-ai"
            >
              {phase === "thinking" ? (
                <ThinkingDots />
              ) : (
                <>
                  {streamed}
                  {phase === "streaming" ? <Caret /> : null}
                </>
              )}
            </p>
          </div>

          <p className="mt-6 text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
            Tempoly · 4 motores · 40 queries · semanal
          </p>
        </div>
      </motion.div>

      {showLeaderboard ? (
        <motion.div
          initial={reduced ? false : { y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-x-0 top-0 border border-[var(--color-success)]/40 bg-[var(--color-bg-elev)]"
          data-testid="hero-leaderboard-reveal"
        >
          <header className="border-b border-[var(--color-border)] px-4 py-3">
            <Mono className="text-[var(--color-success)]">
              {`leaderboard · ${scenario.industry.toLowerCase()} · top 5`}
            </Mono>
          </header>
          <ul className="divide-y divide-[var(--color-border)] font-(family-name:--font-mono) text-sm">
            {scenario.top5.map((row) => (
              <li
                key={row.rank}
                className="flex items-baseline justify-between px-4 py-3"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-[var(--color-fg-subtle)]">
                    {String(row.rank).padStart(2, "0")}
                  </span>
                  <span className="text-[var(--color-fg)]">{row.name}</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="text-[var(--color-fg)]">{row.rate}</span>
                  <span
                    className={
                      row.delta.startsWith("+")
                        ? "text-[var(--color-success)]"
                        : row.delta.startsWith("-")
                          ? "text-[var(--color-warn)]"
                          : "text-[var(--color-fg-subtle)]"
                    }
                  >
                    {row.delta}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </div>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      className="ml-[1px] inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[var(--color-success)]"
    />
  );
}

function ThinkingDots() {
  return (
    <span aria-label="Pensando" className="inline-flex gap-1">
      <span className="size-1.5 animate-pulse rounded-full bg-[var(--color-fg-subtle)]" />
      <span className="size-1.5 animate-pulse rounded-full bg-[var(--color-fg-subtle)] [animation-delay:150ms]" />
      <span className="size-1.5 animate-pulse rounded-full bg-[var(--color-fg-subtle)] [animation-delay:300ms]" />
    </span>
  );
}
