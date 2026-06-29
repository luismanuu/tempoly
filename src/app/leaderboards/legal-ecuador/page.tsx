import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Display } from "@/components/ui/Display";
import { Mono } from "@/components/ui/Mono";
import { Section } from "@/components/ui/Section";
import { Footer } from "@/components/landing/Footer";
import { Leaderboard } from "@/components/landing/Leaderboard";

export const metadata = {
  title: "Leaderboard · Firmas Legales Tech Ecuador — Tempoly",
  description:
    "Diez firmas legales tech en Ecuador, rankeadas por cuántas veces los modelos AI las citan al responder preguntas de compradores reales.",
};

export default function LegalEcuadorPage() {
  return (
    <>
      <header className="border-b border-[var(--color-border)] py-5">
        <Container className="flex items-center justify-between">
          <Link
            href="/"
            className="font-(family-name:--font-display) text-xl text-[var(--color-fg)]"
          >
            Tempoly
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <a
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              href="/manifesto"
            >
              Manifesto
            </a>
            <Link
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              href="/#contacto"
            >
              Hablemos
            </Link>
          </nav>
        </Container>
      </header>

      <main className="flex-1">
        <Section>
          <Container>
            <Mono>leaderboards · legal-ecuador</Mono>
            <Display.One className="mt-6 max-w-4xl">
              Firmas legales tech, Ecuador.
            </Display.One>
            <p className="mt-6 max-w-2xl text-lg text-[var(--color-fg-muted)]">
              Diez firmas. Quince preguntas de compradores reales. Dos motores
              (por ahora). El que cita más, gana visibilidad. El que no aparece,
              no existe para el comprador que arranca su búsqueda en una IA.
            </p>
            <div className="mt-12">
              <Leaderboard />
            </div>
            <p className="mt-6 max-w-2xl text-sm text-[var(--color-fg-subtle)]">
              Datos de muestra para v0. La versión live arranca cuando el
              worker semanal entre en producción. Si tu firma debería estar y
              no está, escríbenos a hola@tempoly.xyz.
            </p>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
