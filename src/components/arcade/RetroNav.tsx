import Link from "next/link";
import { CONTACT_HREF, NAV_LINKS } from "./links";
import styles from "./RetroNav.module.css";

export function RetroNav() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="#top" className={styles.brand} aria-label="Tempoly — inicio">
          <span className={styles.brandMark} aria-hidden="true">
            T
          </span>
          <span className={styles.brandName}>Tempoly</span>
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        <a href={CONTACT_HREF} className={styles.cta}>
          Hablemos
        </a>
      </div>
    </header>
  );
}
