import { Fragment } from "react";
import styles from "./HowWeWork.module.css";

type Node = {
  title: string;
  body: string;
  accent: "cyan" | "lime" | "amber" | "magenta";
};

const NODES: Node[] = [
  {
    title: "Cuéntanos",
    body: "Nos traes la idea, sin importar qué tan cruda esté.",
    accent: "cyan",
  },
  {
    title: "Trazamos",
    body: "La aterrizamos en un plan claro y un alcance honesto.",
    accent: "lime",
  },
  {
    title: "Construimos",
    body: "Diseño y código, mostrándote avances reales.",
    accent: "amber",
  },
  {
    title: "Lanzamos",
    body: "Sale en vivo. Y seguimos contigo si hace falta.",
    accent: "magenta",
  },
];

export function HowWeWork() {
  return (
    <section className={styles.section} id="como-trabajamos">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Cómo trabajamos</h2>
          <p className={styles.sub}>
            De la idea al lanzamiento, sin vueltas. Un camino corto y claro
            donde siempre sabes en qué nivel vamos.
          </p>
        </div>

        <ol className={styles.path}>
          {NODES.map((node, i) => (
            <Fragment key={node.title}>
              <li className={styles.node} data-accent={node.accent}>
                <span className={styles.chip} aria-hidden="true">
                  <span className={styles.chipDot} />
                </span>
                <h3 className={styles.nodeTitle}>{node.title}</h3>
                <p className={styles.nodeBody}>{node.body}</p>
              </li>
              {i < NODES.length - 1 ? (
                <li
                  className={styles.conn}
                  data-accent={node.accent}
                  aria-hidden="true"
                >
                  ▶
                </li>
              ) : null}
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
}
