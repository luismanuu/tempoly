"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArcadeCabinet } from "./ArcadeCabinet";
import { CONTACT_HREF } from "./links";
import styles from "./Hero.module.css";

const CAPABILITIES = [
  "Sitios web",
  "Productos",
  "Agentes de IA",
  "Automatizaciones",
];

export function Hero() {
  const reduce = useReducedMotion();

  // Content is visible by default (opacity:1). Motion only adds a small
  // upward settle that collapses to a no-op under reduced motion.
  const rise = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section className={styles.hero} id="top">
      <div className={styles.grid}>
        <div className={styles.left}>
          <motion.span
            className={styles.statusPill}
            {...rise}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.dot} aria-hidden="true" />
            STUDIO ABIERTO · ONLINE
          </motion.span>

          <motion.h1
            className={styles.headline}
            {...rise}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.line}>Tu idea,</span>
            <span className={`${styles.line} ${styles.lineAccent}`}>
              construida.
            </span>
          </motion.h1>

          <motion.p
            className={styles.subhead}
            {...rise}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            Somos un estudio creativo y técnico. Traes una idea —un sitio, un
            producto, un agente de IA, una automatización— y la construimos
            contigo.
          </motion.p>

          <motion.div
            className={styles.ctaRow}
            {...rise}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href={CONTACT_HREF} className={styles.primary}>
              Cuéntanos tu idea
              <span aria-hidden="true">▶</span>
            </a>
            <a href="#proyectos" className={styles.secondary}>
              <span aria-hidden="true">▶</span>
              Ver los proyectos
            </a>
          </motion.div>

          <motion.ul
            className={styles.caps}
            {...rise}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {CAPABILITIES.map((cap, i) => (
              <li key={cap} className={styles.cap}>
                {cap}
                {i < CAPABILITIES.length - 1 ? (
                  <span className={styles.capDot} aria-hidden="true">
                    ·
                  </span>
                ) : null}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          className={styles.right}
          initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <ArcadeCabinet />
        </motion.div>
      </div>
    </section>
  );
}
