import { CONTACT_EMAIL, CONTACT_HREF, NAV_LINKS } from "./links";
import styles from "./RetroFooter.module.css";

const WORDMARK: { ch: string; c: string }[] = [
  { ch: "T", c: "magenta" },
  { ch: "E", c: "cyan" },
  { ch: "M", c: "lime" },
  { ch: "P", c: "amber" },
  { ch: "O", c: "primary" },
  { ch: "L", c: "cyan" },
  { ch: "Y", c: "magenta" },
];

export function RetroFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.wordmark} aria-label="Tempoly">
              {WORDMARK.map((l, i) => (
                <span key={i} data-c={l.c} aria-hidden="true">
                  {l.ch}
                </span>
              ))}
            </p>
            <p className={styles.tagline}>
              Tu idea, construida. · Estudio creativo + técnico
            </p>
          </div>

          <div className={styles.cols}>
            <nav className={styles.col} aria-label="Estudio">
              <span className={styles.colHead}>ESTUDIO</span>
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className={styles.colLink}>
                  {link.label}
                </a>
              ))}
            </nav>

            <div className={styles.col}>
              <span className={styles.colHead}>CONTACTO</span>
              <a href={CONTACT_HREF} className={styles.colLink}>
                {CONTACT_EMAIL}
              </a>
              <a href="#contacto" className={styles.colLink}>
                Cuéntanos tu idea
              </a>
              <a
                href="https://instagram.com/tempoly"
                className={styles.colLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bar}>
          <span className={styles.copy}>
            © 2026 Tempoly · Hecho con créditos ilimitados
          </span>
          <span className={styles.dots} aria-hidden="true">
            <span data-c="magenta" />
            <span data-c="cyan" />
            <span data-c="lime" />
            <span data-c="amber" />
          </span>
        </div>
      </div>
    </footer>
  );
}
