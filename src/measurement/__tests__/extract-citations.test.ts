import { describe, expect, it } from "vitest";
import {
  extractCitations,
  type CompanyMatcher,
} from "../parse/extract-citations";

const COMPANIES: CompanyMatcher[] = [
  { slug: "usfq", names: ["USFQ", "Universidad San Francisco de Quito"] },
  { slug: "espol", names: ["ESPOL", "Escuela Superior Politécnica del Litoral"] },
  { slug: "puce", names: ["PUCE", "Pontificia Universidad Católica del Ecuador"] },
];

describe("extractCitations", () => {
  it("matches an exact acronym", () => {
    const r = extractCitations("La mejor opción es USFQ sin duda.", COMPANIES);
    expect(r.map((m) => m.slug)).toEqual(["usfq"]);
    expect(r[0].position).toBe(1);
  });

  it("matches via the full-name alias", () => {
    const r = extractCitations(
      "La Universidad San Francisco de Quito destaca.",
      COMPANIES,
    );
    expect(r.map((m) => m.slug)).toEqual(["usfq"]);
  });

  it("is case-insensitive", () => {
    const r = extractCitations("recomiendo espol y puce.", COMPANIES);
    expect(r.map((m) => m.slug).sort()).toEqual(["espol", "puce"]);
  });

  it("is accent-insensitive (Católica → Catolica)", () => {
    const r = extractCitations(
      "La Pontificia Universidad Catolica del Ecuador es buena.",
      COMPANIES,
    );
    expect(r.map((m) => m.slug)).toEqual(["puce"]);
  });

  it("returns nothing when no company is mentioned", () => {
    expect(extractCitations("No hay universidades aquí.", COMPANIES)).toEqual(
      [],
    );
  });

  it("does not match an acronym embedded in a larger word", () => {
    // "USFQX" / "PUCExyz" must NOT count as a mention.
    const r = extractCitations("Mira USFQX y PUCExyz, no cuentan.", COMPANIES);
    expect(r).toEqual([]);
  });

  it("orders multiple companies by first occurrence", () => {
    const text = "Primero PUCE, luego ESPOL, y finalmente USFQ.";
    const r = extractCitations(text, COMPANIES);
    expect(r.map((m) => m.slug)).toEqual(["puce", "espol", "usfq"]);
    expect(r.map((m) => m.position)).toEqual([1, 2, 3]);
  });

  it("uses the earliest alias occurrence for position", () => {
    // Full name appears before the acronym; first occurrence wins.
    const text =
      "La Universidad San Francisco de Quito (USFQ) y antes ESPOL.";
    const r = extractCitations(text, COMPANIES);
    // USFQ's full name comes before ESPOL → USFQ is position 1.
    expect(r.map((m) => m.slug)).toEqual(["usfq", "espol"]);
  });

  it("includes a snippet around the match", () => {
    const r = extractCitations("Recomiendo ampliamente USFQ para todos.", COMPANIES);
    expect(r[0].snippet).toContain("USFQ");
  });
});
