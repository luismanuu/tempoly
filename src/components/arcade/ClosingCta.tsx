import { CONTACT_EMAIL, CONTACT_HREF } from "./links";
import styles from "./ClosingCta.module.css";

export function ClosingCta() {
  return (
    <section className={styles.section} id="contacto">
      <div className={styles.inner}>
        <span className={styles.badge}>
          <span className={styles.blink} aria-hidden="true" />
          PLAYER 1 — TU TURNO
        </span>

        <h2 className={styles.head}>
          <span className={styles.line}>¿Tienes una idea?</span>
          <span className={`${styles.line} ${styles.lineAccent}`}>
            Construyámosla.
          </span>
        </h2>

        <p className={styles.sub}>
          Sin compromiso ni tecnicismos. Nos cuentas qué tienes en mente y te
          decimos cómo lo construimos.
        </p>

        <div className={styles.ctaRow}>
          <a href={CONTACT_HREF} className={styles.primary}>
            Cuéntanos tu idea
            <span aria-hidden="true">▶</span>
          </a>
          <a href={CONTACT_HREF} className={styles.mail}>
            <span aria-hidden="true">✉</span>
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
