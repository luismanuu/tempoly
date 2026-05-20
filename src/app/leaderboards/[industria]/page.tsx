import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Display } from "@/components/ui/Display";
import { LinkButton } from "@/components/ui/Button";
import { Mono } from "@/components/ui/Mono";
import { Section } from "@/components/ui/Section";
import { Footer } from "@/components/landing/Footer";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { LeaderboardTable } from "@/components/analytics/LeaderboardTable";
import { ShareOfVoiceBar } from "@/components/analytics/ShareOfVoiceBar";
import { MoversStrip } from "@/components/analytics/MoversStrip";
import { StatCard } from "@/components/analytics/StatCard";
import { INDUSTRIES, getIndustry, queryCount } from "@/lib/seed";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industria: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industria: string }>;
}) {
  const { industria } = await params;
  const industry = getIndustry(industria);
  if (!industry) return {};
  return {
    title: `Leaderboard de ${industry.name} · Ecuador — Tempoly`,
    description: industry.tagline,
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ industria: string }>;
}) {
  const { industria } = await params;
  const industry = getIndustry(industria);
  if (!industry) notFound();

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
              / {industry.slug}
            </Mono>
            <Display.One className="mt-6 max-w-4xl">
              {industry.name}, {industry.region}.
            </Display.One>
            <p className="mt-6 max-w-2xl text-lg text-[var(--color-fg-muted)]">
              {industry.tagline}
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                value={String(industry.companies.length)}
                label="empresas medidas"
              />
              <StatCard
                value={String(queryCount(industry))}
                label="preguntas semanales"
              />
              <StatCard
                value={String(industry.engines.length)}
                label="motores de IA"
                hint="ChatGPT · Claude · Perplexity · Gemini"
              />
              <StatCard
                value={formatDate(industry.lastUpdated)}
                label="última actualización"
                hint="cadencia semanal"
              />
            </div>
          </Container>
        </Section>

        <Section divider>
          <Container>
            <Mono>share of voice</Mono>
            <Display.Two className="mt-4">Quién domina la conversación.</Display.Two>
            <p className="mt-4 max-w-2xl text-[var(--color-fg-muted)]">
              De todas las menciones que reparten los modelos en esta industria,
              qué fracción se lleva cada empresa.
            </p>
            <div className="mt-8">
              <ShareOfVoiceBar industry={industry} />
            </div>
            <div className="mt-12">
              <MoversStrip industry={industry} />
            </div>
          </Container>
        </Section>

        <Section divider>
          <Container>
            <Mono>ranking completo</Mono>
            <Display.Two className="mt-4">El leaderboard.</Display.Two>
            <p className="mt-4 max-w-2xl text-[var(--color-fg-muted)]">
              Ordena por rank, tasa de citación o share of voice. Cada empresa
              enlaza a su análisis por motor.
            </p>
            <div className="mt-8">
              <LeaderboardTable industry={industry} />
            </div>
          </Container>
        </Section>

        <Section divider>
          <Container>
            <Mono>transparencia</Mono>
            <Display.Two className="mt-4 max-w-3xl">
              Las {queryCount(industry)} preguntas que medimos.
            </Display.Two>
            <p className="mt-4 max-w-2xl text-[var(--color-fg-muted)]">
              Corremos estas preguntas cada semana en los cuatro motores y
              registramos qué empresas aparecen.{" "}
              <a
                href="/metodologia"
                className="text-[var(--color-success)] hover:underline underline-offset-4"
              >
                Cómo lo medimos →
              </a>
            </p>
            <div className="mt-8 space-y-4">
              {industry.queryGroups.map((group) => (
                <details
                  key={group.category}
                  className="border border-[var(--color-border)] bg-[var(--color-bg-elev)]"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-(family-name:--font-mono) text-sm text-[var(--color-fg)]">
                    <span>{group.category}</span>
                    <span className="text-[var(--color-fg-subtle)]">
                      {group.queries.length}
                    </span>
                  </summary>
                  <ul className="border-t border-[var(--color-border)] px-5 py-4">
                    {group.queries.map((q) => (
                      <li
                        key={q}
                        className="border-b border-[var(--color-border)] py-2 text-[var(--color-fg-muted)] last:border-b-0"
                      >
                        {q}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </Container>
        </Section>

        <Section divider>
          <Container>
            <div className="max-w-3xl">
              <Display.Two>
                ¿Eres de {industry.name.toLowerCase()} y quieres subir en este
                ranking?
              </Display.Two>
              <p className="mt-6 text-[var(--color-fg-muted)] md:text-lg">
                Te mostramos exactamente en qué preguntas apareces, en cuáles no,
                y qué mover para que la IA te cite. Hablemos.
              </p>
              <div className="mt-8">
                <LinkButton href={`/contacto?industria=${industry.name}`} size="lg">
                  Solicitar propuesta
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
