import { Mono } from "@/components/ui/Mono";

type Tier = {
  name: string;
  price: string;
  cadence?: string;
  blurb: string;
  features: string[];
  highlight?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "—",
    blurb: "Tu listado público con citation rate semanal.",
    features: [
      "Ranking público",
      "Citation rate vs. competidores",
      "Sin acceso a queries individuales",
    ],
  },
  {
    name: "Verified",
    price: "$29",
    cadence: "/mes",
    blurb: "Reclamas tu ficha y ves dónde apareces.",
    features: [
      "Detalle por query",
      "Snippets que la IA usa para citarte",
      "Notificación si tu rank cambia",
    ],
    highlight: true,
  },
  {
    name: "Growth",
    price: "$99",
    cadence: "/mes",
    blurb: "Optimizas con queries propias.",
    features: [
      "10 queries personalizadas",
      "Recomendaciones de contenido a publicar",
      "Reporte mensual descargable",
    ],
  },
  {
    name: "Pro",
    price: "$299",
    cadence: "/mes",
    blurb: "Para firmas que compiten por share of voice.",
    features: [
      "Queries ilimitadas",
      "Hist&oacute;rico completo + API",
      "Slack/Discord webhook",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "—",
    blurb: "Multi-marca, multi-país, white-label.",
    features: ["SLA dedicado", "Dashboard branded", "Integración con CRM"],
  },
];

export function Pricing() {
  return (
    <div className="overflow-x-auto border border-[var(--color-border)]">
      <table className="w-full min-w-[760px] font-(family-name:--font-mono) text-sm">
        <thead>
          <tr>
            {TIERS.map((t) => (
              <th
                key={t.name}
                className={`border-b border-[var(--color-border)] px-5 py-5 text-left align-bottom ${
                  t.highlight ? "bg-[var(--color-bg-elev)]" : ""
                }`}
              >
                <Mono>{t.name}</Mono>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-(family-name:--font-display) text-3xl text-[var(--color-fg)]">
                    {t.price}
                  </span>
                  {t.cadence && t.cadence !== "—" ? (
                    <span className="text-[var(--color-fg-subtle)]">
                      {t.cadence}
                    </span>
                  ) : null}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {TIERS.map((t) => (
              <td
                key={t.name}
                className={`align-top px-5 py-5 ${
                  t.highlight ? "bg-[var(--color-bg-elev)]" : ""
                }`}
              >
                <p className="text-[var(--color-fg-muted)]">{t.blurb}</p>
                <ul className="mt-4 space-y-2 text-[var(--color-fg)]">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span
                        aria-hidden
                        className="text-[var(--color-success)]"
                      >
                        ·
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
