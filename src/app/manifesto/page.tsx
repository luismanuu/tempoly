import { Container } from "@/components/ui/Container";
import { Display } from "@/components/ui/Display";
import { LinkButton } from "@/components/ui/Button";
import { Mono } from "@/components/ui/Mono";
import { Section } from "@/components/ui/Section";
import { Footer } from "@/components/landing/Footer";
import { SiteHeader } from "@/components/landing/SiteHeader";

export const metadata = {
  title: "Manifesto — Tempoly",
  description:
    "Por qué construimos Tempoly: analítica pública de citaciones AI por industria en Ecuador, y consultoría para las empresas que quieren aparecer.",
};

export default function ManifestoPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <Section>
          <Container>
            <article className="mx-auto max-w-2xl">
              <Mono>manifesto · 2026</Mono>
              <Display.One className="mt-6">Te citan o no existes.</Display.One>
              <p className="mt-8 text-xl text-[var(--color-fg-muted)] md:text-2xl">
                Una nota corta sobre por qué construimos Tempoly, qué medimos y
                qué hacemos con lo que medimos.
              </p>

              <div className="prose-tempoly mt-16 space-y-8 text-[var(--color-fg)]">
                <Section1 />
                <Section2 />
                <Section3 />
                <Section4 />
                <Section5 />
                <SectionAgentes />
                <Section6 />
              </div>

              <p className="mt-20 font-(family-name:--font-mono) text-sm uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                — Tempoly · Guayaquil · 2026
              </p>

              <div className="mt-12 flex flex-wrap gap-4">
                <LinkButton href="/contacto" size="lg">
                  Hablemos
                </LinkButton>
                <LinkButton href="/leaderboards" size="lg" variant="ghost">
                  Ver leaderboards
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

function Section1() {
  return (
    <section className="space-y-5">
      <H2 n="01">El problema que nadie nombra</H2>
      <P>
        El cliente cambió. Antes empezaba en Google. Hoy empieza en ChatGPT, en
        Claude, en Perplexity, en Gemini. Le pregunta a una IA cuál es la mejor
        universidad para su hijo, en qué banco abrir una cuenta, a qué hospital
        ir por una segunda opinión. La IA contesta con tres o cuatro nombres. El
        cliente investiga esos nombres. Decide entre ellos.
      </P>
      <P>
        Si tu empresa no apareció en esa respuesta, no perdiste por precio ni
        por calidad. Perdiste porque no entraste a la conversación. Y a
        diferencia del SEO clásico, no hay manera fácil de saber cuántas veces
        pasó. El modelo no te muestra impresiones. No te muestra ranking. Solo
        responde — y tu cliente cierra la pestaña.
      </P>
    </section>
  );
}

function Section2() {
  return (
    <section className="space-y-5">
      <H2 n="02">Por qué LATAM importa más</H2>
      <P>
        Los modelos hablan español pero piensan en inglés. Están entrenados con
        datos donde la frase &ldquo;la mejor opción&rdquo; evoca marcas
        estadounidenses antes que ecuatorianas. Cuando un cliente en Quito o
        Guayaquil pregunta en español, el modelo intenta traducir ese sesgo a
        una respuesta local. A veces lo hace bien. A veces inventa. A veces cita
        a la primera empresa que apareció en cualquier nota de prensa de hace
        años.
      </P>
      <P>
        Eso deja un hueco enorme. El primero que llegue a poblar ese hueco con
        contenido propio, fuentes verificables y presencia consistente va a
        dominar el siguiente ciclo de decisión. No por marketing. Por
        infraestructura informativa. Por estar.
      </P>
    </section>
  );
}

function Section3() {
  return (
    <section className="space-y-5">
      <H2 n="03">Lo que medimos</H2>
      <P>
        Medimos tres números por empresa, cada semana. Tasa de citación: de las
        preguntas que hace tu cliente, en cuántas apareces. Share of voice:
        cuando apareces, qué fracción del total de menciones tienes frente a tus
        competidores. Tendencia: cómo cambió eso comparado con la semana pasada.
      </P>
      <P>
        Las preguntas son públicas — cerca de cuarenta por industria, que cubren
        el espectro de intención del comprador. Los motores son los cuatro que
        importan hoy: ChatGPT, Claude, Perplexity y Gemini. Publicamos los
        rankings en abierto. Si no estás de acuerdo con cómo te medimos, puedes
        leer la metodología completa.
      </P>
    </section>
  );
}

function Section4() {
  return (
    <section className="space-y-5">
      <H2 n="04">Lo que hacemos con eso</H2>
      <P>
        Los leaderboards son gratis para ver. Esa es la parte pública: una
        métrica honesta de quién aparece y quién no. Pero medir no mueve la
        aguja por sí solo. La empresa que quiere aparecer necesita trabajar sus
        fuentes, sus entidades y su contenido para que los modelos la citen.
      </P>
      <P>
        Ahí entramos. No somos una agencia de SEO que descubrió ChatGPT.
        Partimos de la medición — sabemos exactamente en qué preguntas estás
        invisible — y construimos desde ahí. Diagnóstico, estrategia y
        monitoreo. Lo que mides, lo puedes mover.
      </P>
    </section>
  );
}

function Section5() {
  return (
    <section className="space-y-5">
      <H2 n="05">Quién deberías ser tú</H2>
      <P>
        Si diriges una universidad, un banco o un hospital en Ecuador — o
        cualquier empresa cuyo cliente investiga antes de decidir — el comprador
        que mañana firma contigo está hoy pidiéndole recomendaciones a una IA.
        Si no apareces, no es porque seas peor que el que aparece. Es porque
        nadie midió, nadie publicó, nadie hizo el trabajo de quedarse parado
        frente al modelo.
      </P>
      <P>
        Hay una ventana corta — dos, tres años — donde ser el primero de tu
        industria en tu país en aparecer consistentemente en el output de los
        modelos vale más que cualquier campaña pagada. Pasada esa ventana, las
        posiciones se calcifican. Igual que pasó con Google entre 2003 y 2009.
      </P>
    </section>
  );
}

function SectionAgentes() {
  return (
    <section className="space-y-5">
      <H2 n="06">La próxima ola: la economía de los agentes</H2>
      <P>
        Hasta aquí hablamos de humanos preguntándole a la IA. Pero la IA no se
        va a quedar recomendando. Lo que viene son agentes que comparan,
        negocian y compran en nombre de tu cliente — sin que tu cliente abra una
        sola pestaña. Se está construyendo la infraestructura para que
        transaccionen solos: una economía de agentes.
      </P>
      <P>
        Cuando eso pase, la regla se endurece. Hoy, si no te citan, pierdes una
        recomendación. Mañana, si un agente no puede leer tu catálogo, entender
        tu oferta y confiar en tus datos, no va a encontrarte — y le va a comprar
        a quien sí es legible. La invisibilidad deja de costar leads: empieza a
        costar ventas.
      </P>
      <P>
        No medimos compras de agentes — nadie las mide todavía, porque la ola
        apenas empieza. Lo que hacemos es prepararte para ella desde lo que sí es
        medible hoy: ser visible y citado en los modelos. El que llega legible y
        confiable antes de que los agentes empiecen a comprar define el precio de
        entrada para el resto.
      </P>
    </section>
  );
}

function Section6() {
  return (
    <section className="space-y-5">
      <H2 n="07">Dónde estamos hoy</H2>
      <P>
        Tres industrias medidas en Ecuador: universidades, bancos y hospitales.
        Cerca de cuarenta preguntas por industria, cuatro motores, cadencia
        semanal. Rankings públicos que cualquiera puede revisar. Si tu empresa
        debería estar y no está, o si tu industria todavía no la medimos,
        escríbenos.
      </P>
      <P>
        La métrica es nueva pero el juego es viejo: el que se queda parado donde
        el cliente va a buscar, gana.
      </P>
    </section>
  );
}
