import { Container } from "@/components/ui/Container";
import { Display } from "@/components/ui/Display";
import { Mono } from "@/components/ui/Mono";
import { Section } from "@/components/ui/Section";
import { Footer } from "@/components/landing/Footer";
import { Leaderboard } from "@/components/landing/Leaderboard";
import { Pricing } from "@/components/landing/Pricing";
import { WaitlistForm } from "@/components/landing/WaitlistForm";

export default function Home() {
  return (
    <>
      <header className="border-b border-[var(--color-border)] py-5">
        <Container className="flex items-center justify-between">
          <div className="font-(family-name:--font-display) text-xl text-[var(--color-fg)]">
            Tempoly
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              href="/manifesto"
            >
              Manifesto
            </a>
            <a
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              href="#leaderboard"
            >
              Leaderboard
            </a>
            <a
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              href="#waitlist"
            >
              Sumarme
            </a>
          </nav>
        </Container>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <Section>
          <Container>
            <Mono>01 — tempoly · 2026</Mono>
            <Display.One className="mt-6">
              Te citan{" "}
              <span className="text-[var(--color-success)]">
                o no existes
              </span>
              .
            </Display.One>
            <p className="mt-8 max-w-2xl text-lg text-[var(--color-fg-muted)] md:text-xl">
              Tempoly mide cómo apareces en ChatGPT, Claude, Perplexity y Gemini
              cuando un cliente busca a alguien como tú. Si no estás citado, no
              estás en la conversación.
            </p>
            <div id="waitlist" className="mt-10">
              <WaitlistForm variant="hero" />
            </div>
            <p className="mt-4 text-sm text-[var(--color-fg-subtle)]">
              Arrancamos con firmas legales tech en Ecuador. Avísanos si
              quieres tu industria primero.
            </p>
          </Container>
        </Section>

        {/* Leaderboard preview */}
        <Section divider id="leaderboard">
          <Container>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <Mono>02 — preview</Mono>
                <Display.Two className="mt-4">
                  Esto es lo que ven tus clientes.
                </Display.Two>
              </div>
              <p className="max-w-md text-[var(--color-fg-muted)]">
                Diez firmas legales tech en Ecuador, rankeadas por cuántas veces
                las IAs las mencionan al responder preguntas de compradores
                reales.
              </p>
            </div>
            <div className="mt-10">
              <Leaderboard />
            </div>
            <p className="mt-4 text-sm text-[var(--color-fg-subtle)]">
              Sample data · La versión live mide 15 queries semanales contra 4
              motores y publica todo en abierto.
            </p>
          </Container>
        </Section>

        {/* Manifesto teaser */}
        <Section divider>
          <Container>
            <Mono>03 — manifesto</Mono>
            <Display.Two className="mt-4 max-w-3xl">
              Los buscadores murieron. Nadie lo dijo.
            </Display.Two>
            <div className="mt-8 grid max-w-3xl gap-5 text-[var(--color-fg-muted)] md:text-lg">
              <p>
                El comprador B2B abre ChatGPT antes que Google. Si la IA no te
                cita, no entras a la conversación — y si no entras a la
                conversación, no hay venta.
              </p>
              <p>
                Tempoly mide eso. Industria por industria, país por país,
                semana a semana. Empezamos por LATAM porque los modelos hablan
                español pero piensan en Estados Unidos, y eso deja un hueco.
              </p>
              <p>
                No somos otra agencia de SEO que descubrió ChatGPT. Somos un
                leaderboard público — gratis para ver, pagado para optimizar.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="/manifesto"
                className="inline-flex items-center gap-2 font-(family-name:--font-mono) text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-success)] hover:underline underline-offset-4"
              >
                Leer manifesto completo →
              </a>
            </div>
          </Container>
        </Section>

        {/* How it works */}
        <Section divider>
          <Container>
            <Mono>04 — cómo funciona</Mono>
            <Display.Two className="mt-4 max-w-3xl">
              Tres pasos. Sin teatro.
            </Display.Two>
            <ol className="mt-12 grid gap-10 md:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Definimos las preguntas",
                  body: "Las 15 que tus clientes hacen hoy a la IA al buscar a alguien como tú. Las publicamos.",
                },
                {
                  n: "02",
                  title: "Las corremos semanal",
                  body: "Cada semana, los 4 motores grandes responden esas preguntas. Capturamos quién es citado y en qué posición.",
                },
                {
                  n: "03",
                  title: "Publicamos el ranking",
                  body: "Leaderboard público y gratis. Si reclamas tu ficha, te decimos qué mover.",
                },
              ].map((step) => (
                <li key={step.n}>
                  <Mono className="text-[var(--color-success)]">{step.n}</Mono>
                  <h3 className="mt-3 font-(family-name:--font-display) text-2xl text-[var(--color-fg)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[var(--color-fg-muted)]">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>

        {/* Pricing teaser */}
        <Section divider id="pricing">
          <Container>
            <Mono>05 — precios</Mono>
            <Display.Two className="mt-4 max-w-3xl">
              Ver es gratis. Optimizar cuesta.
            </Display.Two>
            <p className="mt-4 max-w-2xl text-[var(--color-fg-muted)]">
              Los leaderboards son públicos para siempre. Pagas si quieres ver
              dentro: queries individuales, snippets, recomendaciones.
            </p>
            <div className="mt-10">
              <Pricing />
            </div>
          </Container>
        </Section>

        {/* Closing CTA */}
        <Section divider>
          <Container>
            <div className="max-w-3xl">
              <Mono>06 — siguiente paso</Mono>
              <Display.Two className="mt-4">
                Únete a la lista. Te avisamos cuando abramos tu industria.
              </Display.Two>
              <p className="mt-6 text-[var(--color-fg-muted)] md:text-lg">
                Estamos cerrando el primer leaderboard de Ecuador. El segundo
                país y la segunda industria se abren cuando haya demanda real.
                Decirnos cuál te interesa nos ayuda a priorizar.
              </p>
              <div className="mt-10">
                <WaitlistForm variant="inline" />
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
