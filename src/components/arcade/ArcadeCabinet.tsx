import styles from "./ArcadeCabinet.module.css";

/**
 * The ARCADE CABINET — pure CSS/SVG render. No images.
 * Marquee → CRT screen (pixel rocket scene + scanlines + HUD + insert prompt)
 * → control deck (joystick + button row).
 */
export function ArcadeCabinet() {
  return (
    <div className={styles.cabinet} role="img" aria-label="Cabina arcade de Tempoly con una escena pixelada de un cohete despegando">
      {/* Marquee */}
      <div className={styles.marquee}>
        <span className={styles.marqueeTitle}>TEMPOLY ARCADE</span>
        <span className={styles.credit}>1 CRÉDITO</span>
      </div>

      {/* CRT screen */}
      <div className={styles.screen}>
        <div className={styles.crt}>
          <PixelScene />
          <div className={styles.scanlines} aria-hidden="true" />
          <div className={styles.sweep} aria-hidden="true" />
          <div className={styles.glow} aria-hidden="true" />
        </div>

        <div className={styles.hud} aria-hidden="true">
          <div className={styles.hudCell}>
            <span className={styles.hudLabelCyan}>IDEAS</span>
            <span className={styles.hudValue}>∞</span>
          </div>
          <div className={`${styles.hudCell} ${styles.hudCellRight}`}>
            <span className={styles.hudLabelLime}>NIVEL</span>
            <span className={styles.hudValue}>01</span>
          </div>
        </div>

        <div className={styles.insert} aria-hidden="true">
          <span className={styles.insertArrow}>▶</span>
          <span className={styles.insertText}>INSERT IDEA TO START</span>
        </div>
      </div>

      {/* Control deck */}
      <div className={styles.controls} aria-hidden="true">
        <div className={styles.joystick}>
          <div className={styles.stick}>
            <span className={styles.stickBall} />
          </div>
          <span className={styles.ctrlLabel}>MUEVE</span>
        </div>
        <div className={styles.buttons}>
          <span className={styles.btn} data-c="cyan" />
          <span className={styles.btn} data-c="lime" />
          <span className={styles.btn} data-c="amber" />
          <span className={styles.btn} data-c="magenta" />
        </div>
      </div>
    </div>
  );
}

/** Pixel-art rocket launch scene, drawn on a tight grid so it reads as 8-bit. */
function PixelScene() {
  return (
    <svg
      className={styles.scene}
      viewBox="0 0 64 64"
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* starfield */}
      <g fill="#3de7e0" opacity="0.85">
        <rect x="6" y="8" width="2" height="2" />
        <rect x="52" y="6" width="2" height="2" />
        <rect x="14" y="18" width="2" height="2" />
        <rect x="48" y="22" width="2" height="2" />
      </g>
      <g fill="#f5f0ff" opacity="0.7">
        <rect x="26" y="4" width="2" height="2" />
        <rect x="42" y="14" width="2" height="2" />
        <rect x="10" y="30" width="2" height="2" />
        <rect x="56" y="34" width="2" height="2" />
      </g>

      {/* rocket body (animated bob via CSS) */}
      <g className={styles.rocket}>
        {/* nose */}
        <rect x="30" y="14" width="4" height="2" fill="#ff3d9a" />
        <rect x="28" y="16" width="8" height="2" fill="#ff3d9a" />
        {/* fuselage */}
        <rect x="28" y="18" width="8" height="14" fill="#f5f0ff" />
        <rect x="28" y="18" width="2" height="14" fill="#b9add6" />
        {/* window */}
        <rect x="30" y="22" width="4" height="4" fill="#3de7e0" />
        <rect x="30" y="22" width="2" height="2" fill="#c2ff4d" />
        {/* fins */}
        <rect x="24" y="28" width="4" height="6" fill="#ff3d9a" />
        <rect x="36" y="28" width="4" height="6" fill="#ff3d9a" />
        {/* base */}
        <rect x="28" y="32" width="8" height="2" fill="#7e719c" />
      </g>

      {/* flame */}
      <g className={styles.flame}>
        <rect x="29" y="34" width="6" height="3" fill="#ffc93d" />
        <rect x="30" y="37" width="4" height="3" fill="#ff3d9a" />
        <rect x="31" y="40" width="2" height="3" fill="#c2ff4d" />
      </g>

      {/* ground line */}
      <rect x="0" y="58" width="64" height="2" fill="#2a1e47" />
      <g fill="#3d2c63">
        <rect x="4" y="54" width="6" height="4" />
        <rect x="54" y="52" width="6" height="6" />
      </g>
    </svg>
  );
}
