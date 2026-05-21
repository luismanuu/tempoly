import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Display } from "@/components/ui/Display";
import { LinkButton } from "@/components/ui/Button";
import { Mono } from "@/components/ui/Mono";
import { Section } from "@/components/ui/Section";
import { Footer } from "@/components/landing/Footer";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { EngineBreakdown } from "@/components/analytics/EngineBreakdown";
import { Sparkline } from "@/components/analytics/Sparkline";
import { StatCard } from "@/components/analytics/StatCard";
import { INDUSTRIES, getCompany } from "@/lib/seed";
import { formatPct } from "@/lib/format";

export function generateStaticParams() {
  return INDUSTRIES.flatMap((ind) =>
    ind.companies.map((c) => ({ industria: ind.slug, empresa: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industria: string; empresa: string }>;
}) {
  const { industria, empresa } = await params;
  const found = getCompany(industria, empresa);
  if (!found) return {};
  return {
    title: `${found.company.name} · citación AI en ${found.industry.name} — Tempoly`,
    description: `Cómo aparece ${found.company.fullName} en ChatGPT, Claude, Perplexity y Gemini cuando un cliente pregunta por ${found.industry.name.toLowerCase()} en Ecuador.`,
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ industria: string; empresa: string }>;
}) {
  const { industria, empresa } = await params;
  const found = getCompany(industria, empresa);
  if (!found) notFound();
  const { industry, company } = found;

  const movement = company.prevRank - company.rank;
  const movementLabel =
    movement === 0
      ? "Sin cambio"
      : movement > 0
        ? `▲ Subió ${movement}`
        : `▼ Bajó ${Math.abs(movement)}`;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Section>
          <Container>
            <Mono>
              <a href="/leaderboards" className="hover:text-[var(--color-fg)]">
                leaderboards
              </a>{" "}
              /{" "}
              <a
                href={`/leaderboards/${industry.slug}`}
                className="hover:text-[var(--color-fg)]"
              >
                {industry.slug}
              </a>{" "}
              / {company.slug}
            </Mono>

            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <Display.One className="max-w-3xl">{company.name}</Display.One>
                <p className="mt-4 text-lg text-[var(--color-fg-muted)]">
                  {company.fullName} · {company.city}
                </p>
                <a
                  href={`https://${company.website}`}
                  rel="noopener nofollow"
                  className="mt-2 inline-block font-(family-name:--font-mono) text-sm text-[var(--color-success)] hover:underline underline-offset-4"
                >
                  {company.website} ↗
                </a>
              </div>
              <div className="text-right">
                <Mono>rank actual</Mono>
                <div className="font-(family-name:--font-display) text-6xl font-light text-[var(--color-fg)]">
                  #{company.rank}
                </div>
              </div>
            </div>

            <p className="mt-8 max-w-2xl text-[var(--color-fg-muted)]">
              {company.blurb}
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <StatCard
                value={formatPct(company.citationRate)}
                label="tasa de citación"
                hint="promedio en los 4 motores"
              />
              <StatCard
                value={formatPct(company.shareOfVoice, 1)}
                label="share of voice"
                hint={`dentro de ${industry.name.toLowerCase()}`}
              />
              <StatCard value={movementLabel} label="movimiento semanal" />
            </div>
          </Container>
        </Section>

        <Section divider>
          <Container>
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <Mono>por motor</Mono>
                <Display.Two className="mt-4">Dónde aparece.</Display.Two>
                <p className="mt-4 text-[var(--color-fg-muted)]">
                  Tasa de citación de {company.name} en cada motor de IA.
                </p>
                <div className="mt-8">
                  <EngineBreakdown perEngine={company.perEngine} />
                </div>
              </div>
              <div>
                <Mono>tendencia · 8 semanas</Mono>
                <Display.Two className="mt-4">Cómo se mueve.</Display.Two>
                <p className="mt-4 text-[var(--color-fg-muted)]">
                  Tasa de citación semana a semana.
                </p>
                <div className="mt-8 border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-6">
                  <Sparkline
                    values={company.trend}
                    width={320}
                    height={96}
                    className="w-full"
                    aria-label={`Tendencia de 8 semanas de ${company.name}`}
                  />
                  <div className="mt-4 flex justify-between font-(family-name:--font-mono) text-xs text-[var(--color-fg-subtle)]">
                    <span>hace 8 semanas</span>
                    <span>hoy · {formatPct(company.trend[company.trend.length - 1])}</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section divider>
          <Container>
            <Mono>preguntas fuertes</Mono>
            <Display.Two className="mt-4 max-w-3xl">
              Aparece más fuerte en estas preguntas.
            </Display.Two>
            <ul className="mt-8 max-w-2xl space-y-3">
              {company.topQueries.map((q) => (
                <li
                  key={q}
                  className="border border-[var(--color-border)] bg-[var(--color-bg-elev)] px-5 py-4 text-[var(--color-fg-muted)]"
                >
                  {q}
                </li>
              ))}
            </ul>
          </Container>
        </Section>

        <Section divider>
          <Container>
            <div className="max-w-3xl">
              <Display.Two>¿Eres {company.name}?</Display.Two>
              <p className="mt-6 text-[var(--color-fg-muted)] md:text-lg">
                Reclama tu análisis completo: en qué preguntas apareces, en
                cuáles te dejan afuera, qué fuentes usan los modelos y qué mover
                para subir.
              </p>
              <div className="mt-8">
                <LinkButton
                  href={`/contacto?industria=${industry.name}&empresa=${encodeURIComponent(company.name)}`}
                  size="lg"
                >
                  Reclamar mi análisis
                </LinkButton>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
