#!/usr/bin/env node
// Detect Argentinian voseo verbs in user-facing copy.
// Spanish neutro (tuteo) only. CEO ruling.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();

const SCAN_DIRS = ["src"];
const SCAN_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".md", ".mdx", ".css"]);
const IGNORE_DIRS = new Set(["node_modules", ".next", "dist", "build", "coverage", ".git"]);

// Voseo verbal patterns: querés, tenés, podés, sos, decís, hacés, andás, vení, etc.
// Word-boundary, case-insensitive. Tuteo equivalents: quieres, tienes, puedes, eres, dices.
const VOSEO_PATTERNS = [
  /\b(?:sos)\b/i,
  /\b\w*[aeiou]r[aá]s\b(?!a)/i, // crude — disabled by exclusion below
  /\b(?:querés|tenés|podés|sabés|decís|hacés|venís|salís|andás|vivís|sentís|comés|leés)\b/i,
  /\b(?:fijate|mirá|escuchá|dale|vení|andá|tomá|pensá|esperá|contame|fijate|llamá|dejá|pasá|hablá|cerrá|abrí)\b/i,
  /\b(?:vos)\b(?!\.)/i, // standalone "vos" pronoun (allow "vos." abbreviations)
];

// Disable the crude future-tense pattern — too noisy.
VOSEO_PATTERNS.splice(1, 1);

// Allowlisted strings (e.g., names, foreign loans)
const ALLOW = [
  /SOS Children/i,
];

let violations = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (IGNORE_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full);
    else if (SCAN_EXTS.has(extname(entry))) scan(full);
  }
}

function scan(file) {
  const raw = readFileSync(file, "utf8");
  const lines = raw.split("\n");
  lines.forEach((line, i) => {
    for (const pat of VOSEO_PATTERNS) {
      const m = line.match(pat);
      if (!m) continue;
      if (ALLOW.some((a) => a.test(line))) continue;
      const rel = file.replace(ROOT + "/", "");
      console.error(`${rel}:${i + 1}  voseo "${m[0]}"  → ${line.trim()}`);
      violations++;
    }
  });
}

for (const d of SCAN_DIRS) {
  try {
    walk(join(ROOT, d));
  } catch {
    // dir may not exist; skip
  }
}

if (violations > 0) {
  console.error(`\nlint:voseo found ${violations} violation(s). Spanish neutro tuteo only.`);
  process.exit(1);
}
console.log("lint:voseo OK — no voseo detected.");
