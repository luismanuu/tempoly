import { Container } from "@/components/ui/Container";

const NAV = [
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/servicios", label: "Servicios" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-border)] py-5">
      <Container className="flex items-center justify-between gap-4">
        <a
          href="/"
          className="font-(family-name:--font-display) text-xl text-[var(--color-fg)]"
        >
          Tempoly
        </a>
        <nav className="flex items-center gap-5 text-sm md:gap-6">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hidden text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] sm:inline"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/contacto"
            className="bg-[var(--color-success)] px-4 py-2 font-(family-name:--font-mono) text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-bg)] hover:brightness-110"
          >
            Hablemos
          </a>
        </nav>
      </Container>
    </header>
  );
}
