import { Mono } from "@/components/ui/Mono";

export function Pricing() {
  return (
    <div className="border-t border-[var(--color-border)] pt-10 grid gap-8 md:grid-cols-2">
      <div>
        <Mono>Ver el leaderboard</Mono>
        <p className="mt-4 font-(family-name:--font-display) text-3xl text-[var(--color-fg)]">
          Gratis. Para siempre.
        </p>
        <p className="mt-3 text-[var(--color-fg-muted)]">
          El ranking público es la pieza central de Tempoly. No paywall.
        </p>
      </div>
      <div>
        <Mono>Ver dentro</Mono>
        <p className="mt-4 font-(family-name:--font-display) text-3xl text-[var(--color-fg)]">
          Desde $29/mes.{" "}
          <span className="text-[var(--color-fg-subtle)]">Pronto.</span>
        </p>
        <p className="mt-3 text-[var(--color-fg-muted)]">
          Queries individuales, snippets, recomendaciones. Cuando arranquemos
          el producto pagado, abrimos primero a la lista de espera.
        </p>
      </div>
    </div>
  );
}
