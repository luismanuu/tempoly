import { Container } from "@/components/ui/Container";
import { Display } from "@/components/ui/Display";
import { LinkButton } from "@/components/ui/Button";
import { Mono } from "@/components/ui/Mono";
import { Section } from "@/components/ui/Section";
import { Footer } from "@/components/landing/Footer";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { INDUSTRIES } from "@/lib/seed";

export const metadata = {
  title: "Metodología — Tempoly",
  description:
    "Cómo Tempoly mide la citación en IA: qué medimos, cómo lo medimos, qué motores, con qué frecuencia y cuáles son los límites del método.",
};

function H2({ children, n }: { children: React.ReactNode; n: string }) {
  return (
    <div className="pt-8">
      <Mono className="text-[var(--color-success)]">{n}</Mono>
      <h2 className="mt-3 font-(family-name:--font-display) text-3xl font-normal leading-tight text-[var(--color-fg)] md:text-4xl">
        {children}
      </h2>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
      {children}
    </p>
  );
}

export default function MetodologiaPage() {
  const totalQueries = INDUSTRIES.reduce(
    (n, i) => n + i.queryGroups.reduce((m, g) => m + g.queries.length, 0),
    0,
  );

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Section>
          <Container>
            <article className="mx-auto max-w-2xl">
              <Mono>metodología</Mono>
              <Display.One className="mt-6">Cómo medimos.</Display.One>
              <p className="mt-8 text-xl text-[var(--color-fg-muted)] md:text-2xl">
                Un ranking solo vale lo que vale su método. Este es el nuestro,
                explicado sin adornos.
              </p>

              <div className="mt-16 space-y-8">
                <section className="space-y-5">
                  <H2 n="01">Qué medimos</H2>
                  <P>
                    Medimos tres cosas por empresa. <strong>Tasa de citación</strong>:
                    de las preguntas que hace tu comprador, en cuántas aparece tu
                    empresa en la respuesta del modelo. <strong>Share of voice</strong>:
                    cuando hay menciones, qué fracción del total se lleva tu empresa
                    frente a sus competidores. <strong>Tendencia</strong>: cómo cambia
                    eso semana a semana.
                  </P>
                </section>

                <section className="space-y-5">
                  <H2 n="02">Cómo lo medimos</H2>
                  <P>
                    Para cada industria definimos un conjunto de ~40 preguntas que
                    cubren el espectro de intención del comprador: términos
                    generales, por producto o carrera, por ciudad, comparativas y
                    long-tail. Hoy seguimos {INDUSTRIES.length} industrias y un total
                    de {totalQueries} preguntas.
                  </P>
                  <P>
                    Corremos cada pregunta en los cuatro motores, capturamos la
                    respuesta y registramos qué empresas aparecen mencionadas y con
                    qué prominencia. Agregamos los resultados por empresa y los
                    normalizamos para obtener tasa de citación y share of voice.
                  </P>
                </section>

                <section className="space-y-5">
                  <H2 n="03">Qué motores</H2>
                  <P>
                    Los cuatro que concentran las consultas de los compradores hoy:
                    ChatGPT, Claude, Perplexity y Gemini. Una empresa puede ser
                    fuerte en uno y débil en otro — por eso publicamos el desglose
                    por motor en cada ficha.
                  </P>
                </section>

                <section className="space-y-5">
                  <H2 n="04">Con qué frecuencia</H2>
                  <P>
                    Semanal. Las respuestas de los modelos cambian con el tiempo, y
                    una foto de un día no dice nada. La cadencia semanal es lo que
                    convierte el dato en una tendencia útil.
                  </P>
                </section>

                <section className="space-y-5">
                  <H2 n="05">Límites del método</H2>
                  <P>
                    Los modelos son no deterministas: la misma pregunta puede dar
                    respuestas distintas. Por eso medimos tasas y tendencias, no
                    verdades absolutas. Las respuestas dependen de cómo se formula la
                    pregunta, del momento y de la versión del modelo. Trabajamos con
                    formulaciones estables y volumen para que la señal supere al
                    ruido, pero ningún ranking de IA es exacto al decimal.
                  </P>
                </section>

                <section className="space-y-5">
                  <H2 n="06">Lo que el ranking no dice</H2>
                  <P>
                    El ranking refleja lo que dicen los motores de IA, no la opinión
                    de Tempoly sobre la calidad de ninguna institución. Que una
                    empresa aparezca más citada significa que los modelos la
                    mencionan más para esas preguntas — no que sea mejor. Medimos
                    presencia en IA, no desempeño real.
                  </P>
                </section>
              </div>

              <div className="mt-16 flex flex-wrap gap-4">
                <LinkButton href="/leaderboards">Ver leaderboards</LinkButton>
                <LinkButton href="/contacto" variant="ghost">
                  Hablemos
                </LinkButton>
              </div>
            </article>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
