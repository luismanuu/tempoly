import { describe, expect, it } from "vitest";
import {
  aggregateLeaderboard,
  type AggregateInput,
} from "../aggregate/leaderboard";
import type { EngineSlug } from "../engines/types";

const ENGINES: EngineSlug[] = ["chatgpt", "claude"];

// 2 queries (q1,q2) × 2 engines. a cited in both queries on both engines (rate
// 1.0). b cited in q1 only (rate 0.5). c never cited (rate 0).
function baseInput(): AggregateInput {
  const runs = [
    { queryId: "q1", engineSlug: "chatgpt" as EngineSlug },
    { queryId: "q1", engineSlug: "claude" as EngineSlug },
    { queryId: "q2", engineSlug: "chatgpt" as EngineSlug },
    { queryId: "q2", engineSlug: "claude" as EngineSlug },
  ];
  const citations = [
    { queryId: "q1", engineSlug: "chatgpt" as EngineSlug, companySlug: "a" },
    { queryId: "q1", engineSlug: "claude" as EngineSlug, companySlug: "a" },
    { queryId: "q2", engineSlug: "chatgpt" as EngineSlug, companySlug: "a" },
    { queryId: "q2", engineSlug: "claude" as EngineSlug, companySlug: "a" },
    { queryId: "q1", engineSlug: "chatgpt" as EngineSlug, companySlug: "b" },
    { queryId: "q1", engineSlug: "claude" as EngineSlug, companySlug: "b" },
  ];
  return {
    industrySlug: "test",
    weekStarting: "2026-05-18",
    companySlugs: ["a", "b", "c"],
    engines: ENGINES,
    runs,
    citations,
  };
}

describe("aggregateLeaderboard", () => {
  it("computes per-engine and overall citation rates", () => {
    const snap = aggregateLeaderboard(baseInput());
    const a = snap.rankings.find((r) => r.slug === "a")!;
    const b = snap.rankings.find((r) => r.slug === "b")!;
    const c = snap.rankings.find((r) => r.slug === "c")!;
    expect(a.citation_rate).toBe(1);
    expect(b.citation_rate).toBe(0.5);
    expect(c.citation_rate).toBe(0);
    expect(a.per_engine.find((e) => e.engine === "chatgpt")!.citation_rate).toBe(1);
    expect(b.per_engine.find((e) => e.engine === "claude")!.citation_rate).toBe(
      0.5,
    );
  });

  it("ranks by citation rate descending", () => {
    const snap = aggregateLeaderboard(baseInput());
    expect(snap.rankings.map((r) => r.slug)).toEqual(["a", "b", "c"]);
    expect(snap.rankings.map((r) => r.position)).toEqual([1, 2, 3]);
  });

  it("normalizes share of voice to ~1.0", () => {
    const snap = aggregateLeaderboard(baseInput());
    const sum = snap.rankings.reduce((s, r) => s + r.share_of_voice, 0);
    expect(sum).toBeGreaterThan(0.98);
    expect(sum).toBeLessThanOrEqual(1.0001);
    // a has 4 mentions of 6 total → 0.6667.
    expect(snap.rankings.find((r) => r.slug === "a")!.share_of_voice).toBeCloseTo(
      0.6667,
      3,
    );
  });

  it("reports total queries and engines used", () => {
    const snap = aggregateLeaderboard(baseInput());
    expect(snap.totalQueries).toBe(2);
    expect(snap.enginesUsed).toEqual(["chatgpt", "claude"]);
  });

  it("computes week-over-week movement from prev rankings", () => {
    const input = baseInput();
    input.prevRankings = [
      { slug: "a", position: 2 },
      { slug: "b", position: 1 },
    ];
    const snap = aggregateLeaderboard(input);
    // a moved 2→1 (+1), b moved 1→2 (-1), c is new (null).
    expect(snap.rankings.find((r) => r.slug === "a")!.change_vs_prev).toBe(1);
    expect(snap.rankings.find((r) => r.slug === "b")!.change_vs_prev).toBe(-1);
    expect(snap.rankings.find((r) => r.slug === "c")!.change_vs_prev).toBeNull();
  });

  it("breaks ties deterministically by mentions then slug", () => {
    // Two companies with identical rate 1.0 but different mention counts.
    const input: AggregateInput = {
      industrySlug: "t",
      weekStarting: "2026-05-18",
      companySlugs: ["zeta", "alpha"],
      engines: ["chatgpt"],
      runs: [{ queryId: "q1", engineSlug: "chatgpt" }],
      citations: [
        { queryId: "q1", engineSlug: "chatgpt", companySlug: "zeta" },
        { queryId: "q1", engineSlug: "chatgpt", companySlug: "alpha" },
      ],
    };
    const snap = aggregateLeaderboard(input);
    // equal rate (1.0) and equal mentions (1) → slug asc → alpha first.
    expect(snap.rankings.map((r) => r.slug)).toEqual(["alpha", "zeta"]);
  });

  it("handles zero citations without dividing by zero", () => {
    const input = baseInput();
    input.citations = [];
    const snap = aggregateLeaderboard(input);
    expect(snap.rankings.every((r) => r.citation_rate === 0)).toBe(true);
    expect(snap.rankings.every((r) => r.share_of_voice === 0)).toBe(true);
  });
});
