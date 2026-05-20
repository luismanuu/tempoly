type Props = {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
  "aria-label"?: string;
};

type Trend = "up" | "down" | "flat";

export function trendOf(values: number[]): Trend {
  if (values.length < 2) return "flat";
  const first = values[0];
  const last = values[values.length - 1];
  const delta = last - first;
  if (Math.abs(delta) < 0.015) return "flat";
  return delta > 0 ? "up" : "down";
}

const TREND_COLOR: Record<Trend, string> = {
  up: "var(--color-success)",
  down: "var(--color-warn)",
  flat: "var(--color-fg-subtle)",
};

export function Sparkline({
  values,
  width = 80,
  height = 24,
  className,
  "aria-label": ariaLabel,
}: Props) {
  const trend = trendOf(values);
  const color = TREND_COLOR[trend];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 2;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * innerW;
    const y = pad + (1 - (v - min) / span) * innerH;
    return [x, y] as const;
  });

  const d = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={ariaLabel ?? `Tendencia ${trend}`}
      data-trend={trend}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2} fill={color} />
    </svg>
  );
}
