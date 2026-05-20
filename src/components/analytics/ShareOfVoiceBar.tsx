import { Mono } from "@/components/ui/Mono";
import { formatPct } from "@/lib/format";
import type { Industry } from "@/lib/seed/types";

type Props = {
  industry: Industry;
  topN?: number;
};

// Alternating success-tinted opacities give the stacked bar visible segments
// without introducing new palette colors.
const SEGMENT_OPACITY = [1, 0.78, 0.6, 0.46, 0.34, 0.24];

export function ShareOfVoiceBar({ industry, topN = 6 }: Props) {
  const sorted = [...industry.companies].sort(
    (a, b) => b.shareOfVoice - a.shareOfVoice,
  );
  const top = sorted.slice(0, topN);
  const restShare = sorted
    .slice(topN)
    .reduce((a, c) => a + c.shareOfVoice, 0);

  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden border border-[var(--color-border)]">
        {top.map((c, i) => (
          <div
            key={c.slug}
            className="h-full bg-[var(--color-success)]"
            style={{
              width: `${c.shareOfVoice * 100}%`,
              opacity: SEGMENT_OPACITY[i] ?? 0.24,
            }}
            title={`${c.name}: ${formatPct(c.shareOfVoice, 1)}`}
          />
        ))}
        {restShare > 0 ? (
          <div
            className="h-full bg-[var(--color-border-strong)]"
            style={{ width: `${restShare * 100}%` }}
            title={`Resto: ${formatPct(restShare, 1)}`}
          />
        ) : null}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-(family-name:--font-mono) text-xs">
        {top.map((c, i) => (
          <li key={c.slug} className="flex items-center gap-2">
            <span
              className="inline-block size-2.5 bg-[var(--color-success)]"
              style={{ opacity: SEGMENT_OPACITY[i] ?? 0.24 }}
            />
            <span className="text-[var(--color-fg-muted)]">{c.name}</span>
            <span className="text-[var(--color-fg-subtle)]">
              {formatPct(c.shareOfVoice, 1)}
            </span>
          </li>
        ))}
        {restShare > 0 ? (
          <li className="flex items-center gap-2">
            <span className="inline-block size-2.5 bg-[var(--color-border-strong)]" />
            <Mono>resto {formatPct(restShare, 1)}</Mono>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
