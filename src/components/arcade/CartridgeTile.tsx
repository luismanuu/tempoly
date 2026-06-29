import Image from "next/image";
import styles from "./CartridgeTile.module.css";

export type Project = {
  name: string;
  url: string;
  /** Live href; "#" when the real URL is still pending. */
  href: string;
  tag: string;
  /** Accent token key driving the cartridge color. */
  accent: "magenta" | "cyan" | "lime" | "amber";
  image: string;
  imageAlt: string;
  /** When true, the screenshot is a styled placeholder, not a real capture. */
  placeholder?: boolean;
};

export function CartridgeTile({ project }: { project: Project }) {
  const live = project.href !== "#";
  const commonProps = {
    className: styles.tile,
    "data-accent": project.accent,
  } as const;

  const inner = (
    <>
      <div className={styles.visual}>
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(min-width: 760px) 50vw, 100vw"
          className={styles.shot}
          priority={false}
        />
        <div className={styles.visualTop}>
          <span className={styles.tag}>{project.tag}</span>
          {live ? (
            <span className={styles.live} aria-hidden="true">
              ★
            </span>
          ) : (
            <span className={styles.soon}>PRÓXIMAMENTE</span>
          )}
        </div>
        <div className={styles.playHint} aria-hidden="true">
          <span className={styles.playArrow}>▶</span>
          <span className={styles.playText}>PRESS START</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.nameGroup}>
          <span className={styles.name}>{project.name}</span>
          <span className={styles.urlText}>{project.url}</span>
        </div>
        <span className={styles.visit}>
          {live ? "VISITAR" : "EN CAMINO"}
          <span aria-hidden="true">↗</span>
        </span>
      </div>
    </>
  );

  if (!live) {
    return (
      <div {...commonProps} aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <a
      {...commonProps}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {inner}
    </a>
  );
}
