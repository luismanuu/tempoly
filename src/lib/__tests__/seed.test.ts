import { describe, expect, it } from "vitest";
import { INDUSTRIES, queryCount } from "@/lib/seed";

describe("seed data integrity", () => {
  for (const industry of INDUSTRIES) {
    describe(industry.slug, () => {
      it("tracks exactly 40 queries", () => {
        expect(queryCount(industry)).toBe(40);
      });

      it("has a recent, non-future lastUpdated date", () => {
        const updated = new Date(industry.lastUpdated);
        expect(Number.isNaN(updated.getTime())).toBe(false);
        expect(updated.getTime()).toBeLessThanOrEqual(Date.now());
      });

      it("shareOfVoice sums to ~1.0", () => {
        const sum = industry.companies.reduce(
          (a, c) => a + c.shareOfVoice,
          0,
        );
        expect(sum).toBeGreaterThan(0.98);
        expect(sum).toBeLessThan(1.02);
      });

      it("ranks are unique and cover 1..N", () => {
        const ranks = industry.companies.map((c) => c.rank).sort((a, b) => a - b);
        expect(ranks).toEqual(
          Array.from({ length: industry.companies.length }, (_, i) => i + 1),
        );
      });

      it("each company has 4 engines and an 8-week trend", () => {
        for (const c of industry.companies) {
          expect(c.perEngine).toHaveLength(4);
          expect(c.trend).toHaveLength(8);
          expect(c.citationRate).toBeGreaterThan(0);
          expect(c.citationRate).toBeLessThanOrEqual(1);
          expect(c.topQueries.length).toBeGreaterThanOrEqual(2);
        }
      });

      it("company slugs are unique", () => {
        const slugs = industry.companies.map((c) => c.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
      });
    });
  }
});
