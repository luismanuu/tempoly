import { describe, expect, it, vi } from "vitest";
import {
  measureIndustry,
  type CitationRecord,
  type LoadedIndustry,
  type MeasurementStore,
  type QueryRunRecord,
} from "../run/measure-industry";
import type { EngineAnswer, EngineClient, EngineSlug } from "../engines/types";
import type { LeaderboardSnapshot, PrevRanking } from "../aggregate/leaderboard";

// Mock engine: returns canned answers, never touches the network. Tracks calls.
class MockEngine implements EngineClient {
  calls: string[] = [];
  constructor(
    readonly slug: EngineSlug,
    private readonly answers: Record<string, string>,
  ) {}
  async ask(query: string): Promise<EngineAnswer> {
    this.calls.push(query);
    return {
      text: this.answers[query] ?? "",
      tokensIn: 10,
      tokensOut: 20,
      costUsd: 0.001,
    };
  }
}

// In-memory store: captures everything the orchestrator persists.
class MemoryStore implements MeasurementStore {
  runs: (QueryRunRecord & { id: string })[] = [];
  citations: CitationRecord[] = [];
  snapshot?: LeaderboardSnapshot;
  private seq = 0;

  constructor(private readonly industry: LoadedIndustry) {}

  async loadIndustry(): Promise<LoadedIndustry> {
    return this.industry;
  }
  async insertQueryRun(rec: QueryRunRecord): Promise<{ id: string }> {
    const id = `run-${++this.seq}`;
    this.runs.push({ ...rec, id });
    return { id };
  }
  async insertCitations(rows: CitationRecord[]): Promise<void> {
    this.citations.push(...rows);
  }
  async loadPrevRankings(): Promise<PrevRanking[]> {
    return [];
  }
  async saveSnapshot(_id: string, snap: LeaderboardSnapshot): Promise<void> {
    this.snapshot = snap;
  }
}

const INDUSTRY: LoadedIndustry = {
  industryId: "ind-1",
  companies: [
    { id: "c-usfq", slug: "usfq", names: ["USFQ"] },
    { id: "c-espol", slug: "espol", names: ["ESPOL"] },
  ],
  queries: [
    { id: "q1", text: "¿mejor universidad?" },
    { id: "q2", text: "¿mejor para tecnología?" },
  ],
};

describe("measureIndustry (mock engine, no network)", () => {
  it("persists runs + citations and produces a ranked snapshot", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const engine = new MockEngine("chatgpt", {
      "¿mejor universidad?": "Recomiendo USFQ y ESPOL.",
      "¿mejor para tecnología?": "ESPOL es la mejor.",
    });
    const store = new MemoryStore(INDUSTRY);

    const result = await measureIndustry({
      industrySlug: "test",
      weekStarting: "2026-05-18",
      store,
      engines: [engine],
    });

    // One run per (query × engine).
    expect(engine.calls).toHaveLength(2);
    expect(store.runs).toHaveLength(2);
    expect(store.runs[0].responseRaw).toContain("USFQ");

    // Citations: q1 → usfq+espol, q2 → espol = 3 rows.
    expect(store.citations).toHaveLength(3);
    expect(
      store.citations.filter((c) => c.companyId === "c-espol"),
    ).toHaveLength(2);

    // ESPOL cited in both queries (rate 1.0) ranks above USFQ (0.5).
    const snap = store.snapshot!;
    expect(snap.rankings.map((r) => r.slug)).toEqual(["espol", "usfq"]);
    expect(snap.rankings[0].citation_rate).toBe(1);
    expect(snap.rankings[1].citation_rate).toBe(0.5);
    expect(snap.totalQueries).toBe(2);

    expect(result.runCount).toBe(2);
    expect(result.totalCostUsd).toBeCloseTo(0.002, 5);

    // The hard guarantee: the orchestrator made zero real network calls.
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
