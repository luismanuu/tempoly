import { CartridgeTile, type Project } from "./CartridgeTile";
import styles from "./Portfolio.module.css";

const PROJECTS: Project[] = [
  {
    name: "Emerald Packs",
    url: "emeraldpacks.com",
    href: "https://emeraldpacks.com",
    tag: "E-COMMERCE",
    accent: "lime",
    image: "/portfolio/emeraldpacks.png",
    imageAlt:
      "Tienda Emerald Packs: cuatro sobres de cartas Pokémon con neón verde sobre fondo oscuro",
  },
  {
    name: "DarkPerformance",
    url: "darkperformance.com",
    href: "#",
    tag: "WEB",
    accent: "magenta",
    image: "/portfolio/darkperformance.png",
    imageAlt: "DarkPerformance: sitio en construcción, vista previa próximamente",
    placeholder: true,
  },
];

export function Portfolio() {
  return (
    <section className={styles.section} id="proyectos">
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headLeft}>
            <h2 className={styles.heading}>Selecciona un proyecto</h2>
            <p className={styles.sub}>
              Cosas reales que hemos construido y están en vivo. Toca un
              cartucho para abrir el sitio.
            </p>
          </div>
          <span className={styles.counter}>
            <span className={styles.counterDot} aria-hidden="true">
              ●
            </span>
            2 EN VIVO · MÁS PRONTO
          </span>
        </div>

        <div className={styles.grid}>
          {PROJECTS.map((project) => (
            <CartridgeTile key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
