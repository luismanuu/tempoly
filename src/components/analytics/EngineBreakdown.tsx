import { formatPct } from "@/lib/format";
import { ENGINE_LABELS, type EngineScore } from "@/lib/seed/types";

type Props = {
  perEngine: EngineScore[];
};

export function EngineBreakdown({ perEngine }: Props) {
  return (
    <div className="space-y-4">
      {perEngine.map((e) => (
        <div key={e.engine}>
          <div className="flex items-baseline justify-between font-(family-name:--font-mono) text-sm">
            <span className="text-[var(--color-fg-muted)]">
              {ENGINE_LABELS[e.engine]}
            </span>
            <span className="text-[var(--color-fg)]">
              {formatPct(e.citationRate)}
            </span>
          </div>
          <div className="mt-2 h-2 w-full bg-[var(--color-border)]">
            <div
              className="h-2 bg-[var(--color-success)]"
              style={{ width: `${Math.max(2, e.citationRate * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
