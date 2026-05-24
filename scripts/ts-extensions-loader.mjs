// Minimal ESM resolve hook: lets Node import the project's extensionless
// TypeScript modules (e.g. `./universidades-ecuador`, `./index`) from scripts.
// Node 22 strips types natively but won't guess the `.ts` extension — this fills
// that gap so the seed loader can reuse src/lib/seed without a bundler.
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const CANDIDATES = [".ts", ".mts", ".tsx"];

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.[mc]?[jt]sx?$/.test(specifier)) {
    for (const ext of CANDIDATES) {
      const url = new URL(specifier + ext, context.parentURL);
      if (existsSync(fileURLToPath(url))) {
        return nextResolve(specifier + ext, context);
      }
    }
    // Bare directory import → look for index.ts
    const dir = new URL(specifier, context.parentURL);
    try {
      if (statSync(fileURLToPath(dir)).isDirectory()) {
        return nextResolve(specifier.replace(/\/?$/, "/index.ts"), context);
      }
    } catch {
      // not a directory; fall through
    }
  }
  return nextResolve(specifier, context);
}
