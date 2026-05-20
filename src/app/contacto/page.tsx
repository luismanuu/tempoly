import { Container } from "@/components/ui/Container";
import { Display } from "@/components/ui/Display";
import { Mono } from "@/components/ui/Mono";
import { Section } from "@/components/ui/Section";
import { Footer } from "@/components/landing/Footer";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { ContactForm } from "@/components/landing/ContactForm";

export const metadata = {
  title: "Contacto — Tempoly",
  description:
    "Cuéntanos tu caso. Medimos dónde apareces hoy en ChatGPT, Claude, Perplexity y Gemini, y te ayudamos a aparecer más.",
};

const VALID_INDUSTRIES = ["Universidades", "Bancos", "Hospitales", "Otra"];

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ industria?: string; empresa?: string }>;
}) {
  const { industria, empresa } = await searchParams;
  const defaultIndustry =
    industria && VALID_INDUSTRIES.includes(industria) ? industria : undefined;
  const defaultMessage = empresa
    ? `Represento a ${empresa} y quiero ver mi análisis completo de citación en IA.`
    : undefined;

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Section>
          <Container>
            <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
              <div>
                <Mono>contacto</Mono>
                <Display.One className="mt-6">Hablemos.</Display.One>
                <p className="mt-8 text-lg text-[var(--color-fg-muted)]">
                  Cuéntanos de tu empresa y qué quieres lograr. Te mostramos
                  dónde apareces hoy cuando tu cliente le pregunta a la IA — y
                  qué haría falta para que aparezcas más.
                </p>
                <div className="mt-10 space-y-4 border-t border-[var(--color-border)] pt-8">
                  <div>
                    <Mono>respuesta</Mono>
                    <p className="mt-1 text-[var(--color-fg-muted)]">
                      Menos de 24 horas hábiles.
                    </p>
                  </div>
                  <div>
                    <Mono>correo directo</Mono>
                    <p className="mt-1">
                      <a
                        href="mailto:hola@tempoly.xyz"
                        className="text-[var(--color-success)] hover:underline underline-offset-4"
                      >
                        hola@tempoly.xyz
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <ContactForm
                  source="contacto"
                  defaultIndustry={defaultIndustry}
                  defaultMessage={defaultMessage}
                  defaultCompany={empresa}
                />
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
