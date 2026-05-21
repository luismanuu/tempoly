import { Container } from "@/components/ui/Container";
import { Display } from "@/components/ui/Display";
import { LinkButton } from "@/components/ui/Button";
import { Mono } from "@/components/ui/Mono";
import { Section } from "@/components/ui/Section";
import { Footer } from "@/components/landing/Footer";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { HeroChatSequence } from "@/components/landing/HeroChatSequence";
import { ContactForm } from "@/components/landing/ContactForm";
import { IndustrySwitcher } from "@/components/analytics/IndustrySwitcher";
import { INDUSTRIES } from "@/lib/seed";

const SERVICIOS = [
  {
    n: "01",
    title: "Diagnóstico de visibilidad AI",
    body: "Auditoría de dónde apareces hoy en los cuatro motores, qué preguntas te dejan afuera y dónde están los quick wins.",
  },
  {
    n: "02",
    title: "Estrategia de citación",
    body: "Plan de contenido, fuentes y entidades para que los modelos te citen cuando tu cliente pregunta.",
  },
  {
    n: "03",
    title: "Monitoreo continuo",
    body: "Medición semanal, reportes y ajustes trimestrales. Vemos tu posición moverse y actuamos.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <Section>
          <Container>
            <Mono>tempoly · analítica de citación AI · Ecuador</Mono>
            <div className="mt-6 grid gap-12 md:grid-cols-2 md:gap-16 md:items-start">
              <div>
                <Display.One>
                  Te citan{" "}
                  <span className="text-[var(--color-success)]">o no existes</span>.
                </Display.One>
                <p className="mt-8 max-w-2xl text-lg text-[var(--color-fg-muted)] md:text-xl">
                  Hoy tus clientes le preguntan a ChatGPT, Claude, Perplexity y
                  Gemini a quién elegir. Pronto, los agentes de IA van a comparar
                  y comprar por ellos. En ambos casos vale la misma regla: si la
                  IA no te ve, no existes. Medimos dónde apareces — y te hacemos
                  visible.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <LinkButton href="/contacto" size="lg">
                    Hablemos de tu caso
                  </LinkButton>
                  <LinkButton href="/leaderboards" size="lg" variant="ghost">
                    Ver leaderboards
                  </LinkButton>
                </div>
                <p className="mt-6 text-sm text-[var(--color-fg-subtle)]">
                  Tres industrias medidas hoy: universidades, bancos y
                  hospitales. Tu industria es la siguiente.
                </p>
              </div>
              <div className="md:pt-2">
                <HeroChatSequence />
              </div>
            </div>
          </Container>
        </Section>

        {/* 3-industry leaderboard preview */}
        <Section divider id="leaderboards">
          <Container>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <Mono>leaderboards en vivo</Mono>
                <Display.Two className="mt-4">
                  Esto es lo que ve tu cliente.
                </Display.Two>
              </div>
              <p className="max-w-md text-[var(--color-fg-muted)]">
                Rankings de citación AI por industria. El que más aparece, gana
                la conversación. El que no aparece, no entra a la decisión de
                compra.
              </p>
            </div>
            <div className="mt-10">
              <IndustrySwitcher industries={INDUSTRIES} />
            </div>
          </Container>
        </Section>

        {/* La economía de los agentes — agentic commerce (thesis / forward-looking) */}
        <Section divider id="agentes">
          <Container>
            <Mono>lo que viene</Mono>
            <Display.Two className="mt-4 max-w-3xl">
              Los agentes ya no solo recomiendan. Empiezan a comprar.
            </Display.Two>
            <div className="mt-8 grid max-w-3xl gap-5 text-[var(--color-fg-muted)] md:text-lg">
              <p>
                Hoy la IA recomienda y un humano decide. Lo que viene es
                distinto: los agentes de IA van a comparar, elegir y comprar en
                nombre de tu cliente. Se está construyendo la infraestructura
                para que transaccionen solos — una economía de agentes.
              </p>
              <p>
                En esa economía, lo que no es legible para un agente no existe.
                Si tus productos, tus precios y tus servicios no están descritos
                de forma que un agente los entienda y confíe en ellos, no va a
                encontrarte — y le va a comprar a otro. La góndola deja de ser
                visual: pasa a ser una conversación entre máquinas.
              </p>
              <p>
                Todavía nadie tiene datos de compras hechas por agentes —
                nosotros tampoco, porque la ola apenas empieza. Pero la dirección
                es clara, y la ventaja es de quien se prepara antes. Tempoly te
                hace visible y citado hoy, y elegible por los agentes cuando esa
                ola llegue.
              </p>
            </div>
            <p className="mt-8 font-(family-name:--font-mono) text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              Lo que viene · 2026→
            </p>
          </Container>
        </Section>

        {/* Servicios teaser */}
        <Section divider>
          <Container>
            <Mono>servicios</Mono>
            <Display.Two className="mt-4 max-w-3xl">
              No solo medimos. Te ayudamos a subir.
            </Display.Two>
            <ol className="mt-12 grid gap-10 md:grid-cols-3">
              {SERVICIOS.map((s) => (
                <li key={s.n}>
                  <Mono className="text-[var(--color-success)]">{s.n}</Mono>
                  <h3 className="mt-3 font-(family-name:--font-display) text-2xl text-[var(--color-fg)]">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[var(--color-fg-muted)]">{s.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <a
                href="/servicios"
                className="inline-flex items-center gap-2 font-(family-name:--font-mono) text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-success)] hover:underline underline-offset-4"
              >
                Ver servicios →
              </a>
            </div>
          </Container>
        </Section>

        {/* Authority */}
        <Section divider>
          <Container>
            <Mono>por qué Tempoly</Mono>
            <Display.Two className="mt-4 max-w-3xl">
              Los modelos hablan español pero piensan en inglés.
            </Display.Two>
            <div className="mt-8 grid max-w-3xl gap-5 text-[var(--color-fg-muted)] md:text-lg">
              <p>
                Cuando un comprador en Quito o Guayaquil le pregunta a una IA por
                la mejor opción, el modelo traduce su sesgo gringo a una respuesta
                local. A veces acierta. A veces deja afuera a quien debería estar.
              </p>
              <p>
                Somos los únicos midiendo esto en Ecuador, industria por
                industria, semana a semana. No es marketing: es infraestructura
                informativa. El primero que ocupa ese espacio domina el siguiente
                ciclo de venta.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="/manifesto"
                className="inline-flex items-center gap-2 font-(family-name:--font-mono) text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-success)] hover:underline underline-offset-4"
              >
                Leer el manifesto →
              </a>
            </div>
          </Container>
        </Section>

        {/* Closing contact CTA */}
        <Section divider id="contacto">
          <Container>
            <div className="max-w-3xl">
              <Mono>siguiente paso</Mono>
              <Display.Two className="mt-4">
                ¿Tu empresa aparece cuando tu cliente pregunta?
              </Display.Two>
              <p className="mt-6 text-[var(--color-fg-muted)] md:text-lg">
                Averigüémoslo juntos. Cuéntanos de tu empresa y te mostramos
                dónde apareces hoy — y dónde podrías estar.
              </p>
              <div className="mt-10">
                <ContactForm source="landing" />
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
