import { Container } from "@/components/ui/Container";
import { Display } from "@/components/ui/Display";
import { LinkButton } from "@/components/ui/Button";
import { Mono } from "@/components/ui/Mono";
import { Section } from "@/components/ui/Section";
import { Footer } from "@/components/landing/Footer";
import { SiteHeader } from "@/components/landing/SiteHeader";

export const metadata = {
  title: "Servicios de visibilidad en IA — Tempoly",
  description:
    "Diagnóstico, estrategia y monitoreo para que los modelos de IA citen a tu empresa cuando tu cliente pregunta. Consultoría GEO/AEO en Ecuador.",
};

const SERVICIOS = [
  {
    n: "01",
    title: "Diagnóstico de visibilidad AI",
    para: "Una auditoría completa de dónde apareces hoy. Corremos las preguntas que hace tu comprador en los cuatro motores, medimos tu tasa de citación frente a tus competidores y mapeamos las preguntas que te están dejando afuera.",
    incluye: [
      "Tu posición actual en ChatGPT, Claude, Perplexity y Gemini",
      "Comparativa contra tus competidores directos",
      "Las preguntas donde no apareces (y deberías)",
      "Quick wins priorizados por impacto",
    ],
    para_quien:
      "Para empresas que quieren saber, con números, si la IA las está recomendando o no.",
  },
  {
    n: "02",
    title: "Estrategia de citación",
    para: "Un plan accionable para que los modelos te citen. Trabajamos las fuentes, las entidades y el contenido que los modelos consultan, alineados con las preguntas reales de tu comprador.",
    incluye: [
      "Plan de contenido y fuentes priorizado",
      "Trabajo de entidades y datos estructurados",
      "Mensajes y posicionamiento que los modelos puedan citar",
      "Roadmap por trimestre con metas de citación",
    ],
    para_quien:
      "Para empresas que ya saben que están invisibles y quieren cambiarlo.",
  },
  {
    n: "03",
    title: "Monitoreo continuo",
    para: "Medición semanal de tu visibilidad, con reportes y ajustes. Ves tu posición moverse en tiempo real y actuamos sobre las caídas antes de que cuesten ventas.",
    incluye: [
      "Medición semanal en los cuatro motores",
      "Reportes con tendencias y alertas de caídas",
      "Ajustes trimestrales de estrategia",
      "Acceso a tu tablero de citación",
    ],
    para_quien:
      "Para empresas que tratan la visibilidad en IA como un canal, no como un proyecto puntual.",
  },
];

export default function ServiciosPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Section>
          <Container>
            <Mono>servicios</Mono>
            <Display.One className="mt-6 max-w-4xl">
              Medimos, y después te ayudamos a aparecer.
            </Display.One>
            <p className="mt-6 max-w-2xl text-lg text-[var(--color-fg-muted)]">
              Tempoly es consultoría de visibilidad en IA: GEO, AEO y estrategia
              de marketing para la era de los agentes. Los leaderboards son la
              prueba; el trabajo real es mover tu empresa hacia arriba — que
              cuando tu cliente, o el agente que compra por él, consulte a la IA,
              tu nombre esté en la respuesta. Trabajamos en tres frentes.
            </p>
          </Container>
        </Section>

        {SERVICIOS.map((s) => (
          <Section divider key={s.n}>
            <Container>
              <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
                <div>
                  <Mono className="text-[var(--color-success)]">{s.n}</Mono>
                  <h2 className="mt-3 font-(family-name:--font-display) text-3xl text-[var(--color-fg)] md:text-4xl">
                    {s.title}
                  </h2>
                  <p className="mt-4 text-[var(--color-fg-subtle)]">
                    {s.para_quien}
                  </p>
                  <div className="mt-8">
                    <LinkButton href="/contacto">Solicitar propuesta</LinkButton>
                  </div>
                </div>
                <div>
                  <p className="text-lg leading-relaxed text-[var(--color-fg-muted)]">
                    {s.para}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {s.incluye.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-[var(--color-fg-muted)]"
                      >
                        <span
                          aria-hidden
                          className="mt-1 text-[var(--color-success)]"
                        >
                          ·
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Container>
          </Section>
        ))}

        <Section divider>
          <Container>
            <div className="max-w-3xl">
              <Display.Two>Cada empresa parte de un punto distinto.</Display.Two>
              <p className="mt-6 text-[var(--color-fg-muted)] md:text-lg">
                Por eso no publicamos paquetes cerrados. Cuéntanos tu caso y
                armamos una propuesta a tu medida — alcance, tiempos y
                prioridades según dónde apareces hoy.
              </p>
              <div className="mt-8">
                <LinkButton href="/contacto" size="lg">
                  Hablemos
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
