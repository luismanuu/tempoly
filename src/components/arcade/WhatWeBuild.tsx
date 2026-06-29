import styles from "./WhatWeBuild.module.css";

type Cell = {
  tag: string;
  title: string;
  body: string;
  accent: "cyan" | "magenta" | "lime" | "amber";
  variant: "wide" | "filled" | "outline";
};

const CELLS: Cell[] = [
  {
    tag: "WEB",
    title: "Sitios web",
    body: "Landing pages y sitios a medida: rápidos, precisos y listos para convertir desde el día uno.",
    accent: "cyan",
    variant: "wide",
  },
  {
    tag: "AI",
    title: "Agentes de IA",
    body: "Asistentes que conversan, deciden y ejecutan tareas reales por ti.",
    accent: "magenta",
    variant: "filled",
  },
  {
    tag: "APPS",
    title: "Productos digitales",
    body: "Apps y plataformas completas, del primer prototipo al lanzamiento.",
    accent: "lime",
    variant: "outline",
  },
  {
    tag: "FLOW",
    title: "Automatizaciones",
    body: "Conecta tus herramientas y deja que los procesos repetitivos corran solos, sin que tengas que vigilarlos.",
    accent: "amber",
    variant: "wide",
  },
];

export function WhatWeBuild() {
  return (
    <section className={styles.section} id="que-construimos">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Qué construimos</h2>
          <p className={styles.sub}>
            Un estudio abierto: el formato cambia, el oficio no. Esto es lo que
            sabemos llevar de idea a producción.
          </p>
        </div>

        <div className={styles.bento}>
          {CELLS.map((cell) => (
            <article
              key={cell.title}
              className={styles.cell}
              data-accent={cell.accent}
              data-variant={cell.variant}
            >
              <div className={styles.cellTop}>
                <span className={styles.chip}>
                  <Glyph kind={cell.tag} />
                </span>
                <span className={styles.tag}>{cell.tag}</span>
              </div>
              <div className={styles.cellText}>
                <h3 className={styles.title}>{cell.title}</h3>
                <p className={styles.body}>{cell.body}</p>
              </div>
              <div className={styles.pixels} aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Small pixel glyphs per capability — drawn on a crisp grid. */
function Glyph({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 12 12" width="18" height="18" shapeRendering="crispEdges" aria-hidden="true">
      {kind === "WEB" && (
        <g fill="currentColor">
          <rect x="1" y="2" width="10" height="2" />
          <rect x="1" y="4" width="2" height="6" />
          <rect x="9" y="4" width="2" height="6" />
          <rect x="1" y="9" width="10" height="1" />
        </g>
      )}
      {kind === "AI" && (
        <g fill="currentColor">
          <rect x="3" y="1" width="6" height="2" />
          <rect x="2" y="3" width="8" height="6" />
          <rect x="4" y="5" width="1" height="2" fill="var(--ink-on-accent)" />
          <rect x="7" y="5" width="1" height="2" fill="var(--ink-on-accent)" />
          <rect x="5" y="9" width="2" height="2" />
        </g>
      )}
      {kind === "APPS" && (
        <g fill="currentColor">
          <rect x="1" y="1" width="4" height="4" />
          <rect x="7" y="1" width="4" height="4" />
          <rect x="1" y="7" width="4" height="4" />
          <rect x="7" y="7" width="4" height="4" />
        </g>
      )}
      {kind === "FLOW" && (
        <g fill="currentColor">
          <rect x="1" y="2" width="3" height="3" />
          <rect x="4" y="3" width="4" height="1" />
          <rect x="8" y="2" width="3" height="3" />
          <rect x="9" y="5" width="1" height="3" />
          <rect x="5" y="8" width="5" height="1" />
          <rect x="4" y="7" width="3" height="3" />
        </g>
      )}
    </svg>
  );
}
