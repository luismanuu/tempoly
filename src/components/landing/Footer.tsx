import { Container } from "@/components/ui/Container";
import { Mono } from "@/components/ui/Mono";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-12">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-(family-name:--font-display) text-2xl text-[var(--color-fg)]">
              Tempoly
            </div>
            <p className="mt-2 max-w-sm text-sm text-[var(--color-fg-muted)]">
              Leaderboards públicos de citaciones AI por industria y país.
              Empezamos en Ecuador.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-8 gap-y-3 text-sm"
          >
            <a
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              href="/manifesto"
            >
              Manifesto
            </a>
            <a
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              href="/leaderboards/legal-ecuador"
            >
              Leaderboard legal · Ecuador
            </a>
            <a
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              href="mailto:hola@tempoly.xyz"
            >
              hola@tempoly.xyz
            </a>
            <a
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              href="https://github.com/luismanuu/tempoly"
              rel="noopener"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6">
          <Mono>tempoly · made in ecuador · 2026</Mono>
          <Mono>AGPL-3.0 · @tamanuu</Mono>
        </div>
      </Container>
    </footer>
  );
}
