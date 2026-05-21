import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LeaderboardTable } from "../LeaderboardTable";
import { buildCompanies } from "@/lib/seed/build";
import type { Industry } from "@/lib/seed/types";

const industry: Industry = {
  slug: "test-industry",
  name: "Test",
  region: "Ecuador",
  tagline: "t",
  engines: ["chatgpt", "claude", "perplexity", "gemini"],
  lastUpdated: "2026-05-18",
  queryGroups: [],
  companies: buildCompanies([
    {
      slug: "alpha",
      name: "Alpha",
      fullName: "Alpha",
      website: "a.com",
      city: "Quito",
      rank: 1,
      prevRank: 3, // moved up 2
      perEngine: { chatgpt: 0.6, claude: 0.6, perplexity: 0.6, gemini: 0.6 },
      trend: [0.5, 0.55, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6],
      topQueries: ["q1", "q2"],
      blurb: "b",
    },
    {
      slug: "beta",
      name: "Beta",
      fullName: "Beta",
      website: "b.com",
      city: "Guayaquil",
      rank: 2,
      prevRank: 1, // moved down 1
      perEngine: { chatgpt: 0.3, claude: 0.3, perplexity: 0.3, gemini: 0.3 },
      trend: [0.4, 0.38, 0.35, 0.33, 0.32, 0.31, 0.3, 0.3],
      topQueries: ["q1", "q2"],
      blurb: "b",
    },
  ]),
};

afterEach(() => cleanup());

describe("LeaderboardTable", () => {
  it("renders every company with a link to its detail page", () => {
    render(<LeaderboardTable industry={industry} />);
    const alpha = screen.getByRole("link", { name: "Alpha" });
    expect(alpha.getAttribute("href")).toBe(
      "/leaderboards/test-industry/alpha",
    );
    expect(screen.getByRole("link", { name: "Beta" })).toBeInTheDocument();
  });

  it("shows movement arrows matching rank vs prevRank", () => {
    render(<LeaderboardTable industry={industry} />);
    // Alpha moved up 2 (▲2), Beta moved down 1 (▼1)
    expect(screen.getByTitle("Subió 2")).toBeInTheDocument();
    expect(screen.getByTitle("Bajó 1")).toBeInTheDocument();
  });

  it("respects the limit prop", () => {
    render(<LeaderboardTable industry={industry} limit={1} />);
    expect(screen.getByRole("link", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Beta" })).toBeNull();
  });

  it("keeps rank order by default and stays stable when sorting by citation", () => {
    render(<LeaderboardTable industry={industry} />);
    const rowsBefore = screen.getAllByRole("row").slice(1); // drop header
    expect(within(rowsBefore[0]).getByRole("link").textContent).toBe("Alpha");

    fireEvent.click(screen.getByRole("button", { name: /Citación/i }));
    const rowsAfter = screen.getAllByRole("row").slice(1);
    // Alpha has the higher citation rate, so it stays on top.
    expect(within(rowsAfter[0]).getByRole("link").textContent).toBe("Alpha");
  });
});
