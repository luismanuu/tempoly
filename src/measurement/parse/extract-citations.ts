// Deterministic citation extraction. Given an engine's raw answer and the
// industry's companies (each with a set of names/aliases), find which companies
// are mentioned and the order of first mention. No LLM — pure string matching,
// so it costs $0 and is fully testable.
//
// Matching is case- and accent-insensitive and word-boundary aware (so "EPN"
// does not match inside "epnea", and "USFQ" does not match "USFQX").

export interface CompanyMatcher {
  slug: string;
  /** All strings that count as a mention: name + fullName + curated aliases. */
  names: string[];
}

export interface CitationMatch {
  slug: string;
  /** 1-based rank by order of first appearance in the text. */
  position: number;
  /** Character offset of the first match in the original text. */
  charIndex: number;
  /** Short window of original text around the first match. */
  snippet: string;
}

const DIACRITIC = /\p{Diacritic}/gu;

// Fold a single char to an accent-stripped lowercase form, preserving length
// (é→e, ñ→n) so match indices map 1:1 onto the original text. Falls back to the
// original char when folding would change length (e.g. ligatures).
function foldChar(ch: string): string {
  const folded = ch.normalize("NFD").replace(DIACRITIC, "");
  return (folded.length === 1 ? folded : ch).toLowerCase();
}

function fold(s: string): string {
  let out = "";
  for (const ch of s) out += foldChar(ch);
  return out;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Word-boundary match for a folded needle inside folded haystack. Boundaries are
// "not a letter or number" so acronyms and multi-word names match cleanly.
function firstIndexOf(haystack: string, needle: string): number {
  if (!needle) return -1;
  const re = new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRegExp(needle)}(?![\\p{L}\\p{N}])`,
    "u",
  );
  const m = re.exec(haystack);
  return m ? m.index : -1;
}

function snippetAround(text: string, index: number, len: number): string {
  const radius = 40;
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + len + radius);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return prefix + text.slice(start, end).trim() + suffix;
}

export function extractCitations(
  text: string,
  companies: CompanyMatcher[],
): CitationMatch[] {
  const foldedText = fold(text);

  const found: Omit<CitationMatch, "position">[] = [];
  for (const company of companies) {
    let best = -1;
    let bestLen = 0;
    for (const name of company.names) {
      const idx = firstIndexOf(foldedText, fold(name.trim()));
      if (idx !== -1 && (best === -1 || idx < best)) {
        best = idx;
        bestLen = name.trim().length;
      }
    }
    if (best !== -1) {
      found.push({
        slug: company.slug,
        charIndex: best,
        snippet: snippetAround(text, best, bestLen),
      });
    }
  }

  return found
    .sort((a, b) => a.charIndex - b.charIndex)
    .map((m, i) => ({ ...m, position: i + 1 }));
}
