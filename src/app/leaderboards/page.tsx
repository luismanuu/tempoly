import { Container } from "@/components/ui/Container";
import { Display } from "@/components/ui/Display";
import { Mono } from "@/components/ui/Mono";
import { Section } from "@/components/ui/Section";
import { Footer } from "@/components/landing/Footer";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { INDUSTRIES, queryCount, topCompany } from "@/lib/seed";
import { formatPct } from "@/lib/format";

export const metadata = {
  title: "Leaderboards de citación AI · Ecuador — Tempoly",
  description:
    "Rankings de citación AI por industria en Ecuador: universidades, bancos y hospitales. Medimos qué empresas cita la IA en ChatGPT, Claude, Perplexity y Gemini.",
};

export default function LeaderboardsIndexPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Section>
          <Container>
            <Mono>leaderboards · Ecuador</Mono>
            <Display.One className="mt-6 max-w-4xl">
              Quién aparece cuando tu cliente le pregunta a la IA.
            </Display.One>
            <p className="mt-6 max-w-2xl text-lg text-[var(--color-fg-muted)]">
              Medimos la presencia de empresas ecuatorianas en los principales
              motores de IA. Estos son los rankings por industria, actualizados
              cada semana.
            </p>

            <div className="mt-14 grid gap-px overflow-hidden border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3">
              {INDUSTRIES.map((ind) => {
                const top = topCompany(ind);
                return (
                  <a
                    key={ind.slug}
                    href={`/leaderboards/${ind.slug}`}
                    className="group flex flex-col bg-[var(--color-bg-elev)] p-6 transition-colors hover:bg-[var(--color-bg)]"
                  >
                    <Mono className="text-[var(--color-success)]">
                      {ind.region}
                    </Mono>
                    <h2 className="mt-3 font-(family-name:--font-display) text-3xl text-[var(--color-fg)]">
                      {ind.name}
                    </h2>
                    <p className="mt-3 flex-1 text-sm text-[var(--color-fg-muted)]">
                      {ind.tagline}
                    </p>
                    <dl className="mt-6 grid grid-cols-3 gap-2 font-(family-name:--font-mono) text-xs text-[var(--color-fg-subtle)]">
                      <div>
                        <dt className="sr-only">Empresas</dt>
                        <dd className="text-lg text-[var(--color-fg)]">
                          {ind.companies.length}
                        </dd>
                        <span>empresas</span>
                      </div>
                      <div>
                        <dt className="sr-only">Queries</dt>
                        <dd className="text-lg text-[var(--color-fg)]">
                          {queryCount(ind)}
                        </dd>
                        <span>queries</span>
                      </div>
                      <div>
                        <dt className="sr-only">Motores</dt>
                        <dd className="text-lg text-[var(--color-fg)]">
                          {ind.engines.length}
                        </dd>
                        <span>motores</span>
                      </div>
                    </dl>
                    <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                      <Mono>#1 actual</Mono>
                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="text-[var(--color-fg)]">
                          {top.name}
                        </span>
                        <span className="font-(family-name:--font-mono) text-sm text-[var(--color-success)]">
                          {formatPct(top.citationRate)}
                        </span>
                      </div>
                    </div>
                    <span className="mt-6 font-(family-name:--font-mono) text-[0.78rem] uppercase tracking-[0.16em] text-[var(--color-success)] group-hover:underline underline-offset-4">
                      Ver leaderboard completo →
                    </span>
                  </a>
                );
              })}
            </div>

            <p className="mt-8 text-sm text-[var(--color-fg-subtle)]">
              ¿Tu industria no está?{" "}
              <a
                href="/contacto"
                className="text-[var(--color-success)] hover:underline underline-offset-4"
              >
                Hablemos
              </a>{" "}
              y la medimos.
            </p>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
