import { Container } from "@/components/ui/Container";
import { Display } from "@/components/ui/Display";
import { Mono } from "@/components/ui/Mono";
import { Section } from "@/components/ui/Section";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Manifesto — Tempoly",
  description:
    "Por qué construimos Tempoly: leaderboards públicos de citaciones AI por industria y país. Empezamos por LATAM porque los modelos hablan español pero piensan en Estados Unidos.",
};

export default function ManifestoPage() {
  return (
    <>
      <header className="border-b border-[var(--color-border)] py-5">
        <Container className="flex items-center justify-between">
          <a
            href="/"
            className="font-(family-name:--font-display) text-xl text-[var(--color-fg)]"
          >
            Tempoly
          </a>
          <nav className="flex items-center gap-6 text-sm">
            <a
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              href="/leaderboards/legal-ecuador"
            >
              Leaderboard
            </a>
            <a
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              href="/#waitlist"
            >
              Sumarme
            </a>
          </nav>
        </Container>
      </header>

      <main className="flex-1">
        <Section>
          <Container>
            <article className="mx-auto max-w-2xl">
              <Mono>manifesto · v0 · 2026</Mono>
              <Display.One className="mt-6">
                Te citan o no existes.
              </Display.One>
              <p className="mt-8 text-xl text-[var(--color-fg-muted)] md:text-2xl">
                Una nota corta sobre por qué construimos Tempoly, qué medimos y
                qué no somos.
              </p>

              <div className="prose-tempoly mt-16 space-y-8 text-[var(--color-fg)]">
                <Section1 />
                <Section2 />
                <Section3 />
                <Section4 />
                <Section5 />
                <Section6 />
              </div>

              <p className="mt-20 font-(family-name:--font-mono) text-sm uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                — Tempoly · Guayaquil · 2026
              </p>

              <div className="mt-12 flex flex-wrap gap-4">
                <a
                  href="/#waitlist"
                  className="inline-flex items-center gap-2 bg-[var(--color-success)] px-6 py-3 font-(family-name:--font-mono) text-[0.78rem] uppercase tracking-[0.16em] text-[var(--color-bg)]"
                >
                  Sumarme a la lista →
                </a>
                <a
                  href="/leaderboards/legal-ecuador"
                  className="inline-flex items-center gap-2 border border-[var(--color-border-strong)] px-6 py-3 font-(family-name:--font-mono) text-[0.78rem] uppercase tracking-[0.16em] text-[var(--color-fg)] hover:border-[var(--color-fg)]"
                >
                  Ver leaderboard
                </a>
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
        El comprador B2B cambió. Antes empezaba en Google. Hoy empieza en
        ChatGPT, en Claude, en Perplexity, en Gemini. Le pregunta a una IA quién
        es el mejor abogado de protección de datos en Ecuador, qué firma
        recomiendan para una Serie A, dónde conviene registrar la marca. La IA
        contesta con tres o cuatro nombres. El comprador investiga esos
        nombres. Compra a uno de ellos.
      </P>
      <P>
        Si tu firma no apareció en esa respuesta, no perdiste por precio ni por
        propuesta. Perdiste porque no entraste a la conversación. Y a
        diferencia del SEO clásico, no hay manera de saber cuántas veces pasó.
        El modelo no te muestra impresiones. No te muestra ranking. Solo
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
        Los modelos hablan español pero piensan en Estados Unidos. Entrenados
        con datos donde la frase &ldquo;mejor firma de propiedad intelectual&rdquo;
        evoca a Cooley o Goodwin antes que a Bustamante Fabara. Cuando un
        comprador en Quito pregunta en español, el modelo intenta traducir su
        bias gringo a una respuesta latinoamericana. A veces lo hace bien. A
        veces inventa firmas. A veces cita a la primera que apareció en
        cualquier nota de prensa de 2022.
      </P>
      <P>
        Eso deja un hueco enorme. El primero que llegue a poblar ese hueco con
        contenido propio, citas verificables y presencia consistente va a
        dominar el siguiente ciclo de venta. No por márketing. Por
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
        Vamos a medir tres números por empresa por semana. Citation rate: de
        las preguntas que tu comprador hace, ¿en cuántas apareces? Share of
        voice: cuando apareces, ¿qué fracción del total de menciones tienes
        vs. tus competidores? Drift: ¿cómo cambió eso comparado con la semana
        pasada?
      </P>
      <P>
        Las preguntas van a ser públicas — quince queries iniciales, redactadas
        con base en research del comportamiento del comprador. Antes de
        publicar el primer leaderboard, vamos a validarlas con tres a cinco
        compradores reales de la industria. Los motores son los cuatro que
        importan hoy: ChatGPT, Claude, Perplexity, Gemini. Las respuestas
        crudas se archivan en cada corrida y publicamos el log. Si no estás de
        acuerdo con cómo te medimos, lo puedes leer.
      </P>
    </section>
  );
}

function Section4() {
  return (
    <section className="space-y-5">
      <H2 n="04">Lo que no somos</H2>
      <P>
        No somos una agencia de SEO que descubrió ChatGPT. No vendemos paquetes
        de contenido optimizado para LLMs. No hacemos &ldquo;GEO&rdquo; ni
        prometemos posicionarte en respuestas. Somos una métrica pública. Tú
        decides qué hacer con ella.
      </P>
      <P>
        Tampoco somos un directorio. Tener una ficha en Tempoly cuesta cero.
        Aparecer en el ranking cuesta cero. Lo que cuesta es ver dentro: qué
        snippets te citan, qué fuentes externas usan los modelos, qué queries
        te están dejando afuera. Esa información es lo que vendemos.
      </P>
    </section>
  );
}

function Section5() {
  return (
    <section className="space-y-5">
      <H2 n="05">Quién deberías ser tú</H2>
      <P>
        Si lideras una firma legal tech en Ecuador, una fintech en Lima, una
        SaaS B2B en Bogotá: el comprador que mañana firma contigo está hoy
        pidiendo recomendaciones a una IA. Si no apareces, no es porque seas
        peor que el que aparece. Es porque nadie midió, nadie publicó, nadie
        hizo el trabajo de quedarse parado en frente del modelo.
      </P>
      <P>
        Hay una ventana corta — dos, tres años — donde ser el primero de tu
        industria en tu país en aparecer consistentemente cita en el output de
        los modelos vale más que cualquier campaña pagada. Pasada esa ventana,
        las posiciones se calcifican. Igual que pasó con Google entre 2003 y
        2009.
      </P>
    </section>
  );
}

function Section6() {
  return (
    <section className="space-y-5">
      <H2 n="06">Cómo empezamos</H2>
      <P>
        Ecuador, sector legal, quince queries, dos motores. Diez firmas
        rankeadas. Un leaderboard público que arranca actualizándose en julio
        2026 y mantiene cadencia semanal. Si tu firma debería estar y no está,
        escríbenos. Si tu industria no es legal o tu país no es Ecuador,
        súmate a la lista y dinos cuál priorizar.
      </P>
      <P>
        La métrica es nueva pero el juego es viejo: el que se queda parado
        donde el comprador va a buscar, gana.
      </P>
    </section>
  );
}
