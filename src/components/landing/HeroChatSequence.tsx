"use client";

import { motion, useReducedMotion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Mono } from "@/components/ui/Mono";

const USER_QUERY =
  "¿Quién es la mejor firma de protección de datos personales en Ecuador?";

const AI_RESPONSE =
  "Algunas firmas reconocidas en este espacio en Ecuador son [Firma A], [Firma B] y [Firma C]. [Firma A] aparece con cumplimiento LOPDP documentado y atención a startups tech.";

const TOP_5 = [
  { rank: 1, name: "Firma A", chatgpt: "73%", delta: "+2" },
  { rank: 2, name: "Firma B", chatgpt: "60%", delta: "+1" },
  { rank: 3, name: "Firma C", chatgpt: "53%", delta: "-1" },
  { rank: 4, name: "Firma D", chatgpt: "47%", delta: "—" },
  { rank: 5, name: "Firma E", chatgpt: "40%", delta: "+3" },
];

type Phase =
  | "idle"
  | "typing"
  | "thinking"
  | "streaming"
  | "reveal"
  | "locked";

const TIMINGS = {
  typeCharMs: 38,
  streamCharMs: 22,
  idleHoldMs: 500,
  thinkingMs: 600,
  revealHoldMs: 900,
  lockedHoldMs: 4000,
};

export function HeroChatSequence() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { amount: 0.4 });
  const [phaseState, setPhase] = useState<Phase>("idle");
  const [typedState, setTyped] = useState("");
  const [streamedState, setStreamed] = useState("");
  const [cycle, setCycle] = useState(0);

  const phase: Phase = reduced ? "locked" : phaseState;
  const typed = reduced ? USER_QUERY : typedState;
  const streamed = reduced ? AI_RESPONSE : streamedState;

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

    after(0, () => {
      setTyped("");
      setStreamed("");
      setPhase("idle");
    });

    after(TIMINGS.idleHoldMs, () => {
      setPhase("typing");
      for (let i = 1; i <= USER_QUERY.length; i++) {
        after(TIMINGS.idleHoldMs + i * TIMINGS.typeCharMs, () => {
          setTyped(USER_QUERY.slice(0, i));
        });
      }
      const typingDoneAt =
        TIMINGS.idleHoldMs + USER_QUERY.length * TIMINGS.typeCharMs;

      const thinkingAt = typingDoneAt + 200;
      after(thinkingAt, () => setPhase("thinking"));

      const streamingStartAt = thinkingAt + TIMINGS.thinkingMs;
      after(streamingStartAt, () => setPhase("streaming"));

      for (let i = 1; i <= AI_RESPONSE.length; i++) {
        after(streamingStartAt + i * TIMINGS.streamCharMs, () => {
          setStreamed(AI_RESPONSE.slice(0, i));
        });
      }
      const streamingDoneAt =
        streamingStartAt + AI_RESPONSE.length * TIMINGS.streamCharMs;

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
  }, [reduced, inView, cycle]);

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
          <Mono>Claude · chat simulado</Mono>
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
            Sources: tempoly.xyz · 4 motores · 15q
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
              leaderboard · top 5 · preview
            </Mono>
          </header>
          <ul className="divide-y divide-[var(--color-border)] font-(family-name:--font-mono) text-sm">
            {TOP_5.map((row) => (
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
                  <span className="text-[var(--color-fg)]">{row.chatgpt}</span>
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
