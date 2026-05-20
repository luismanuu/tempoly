import { Mono } from "@/components/ui/Mono";

type Props = {
  value: string;
  label: string;
  hint?: string;
};

export function StatCard({ value, label, hint }: Props) {
  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-bg-elev)] p-5">
      <div className="font-(family-name:--font-display) text-4xl font-light text-[var(--color-fg)]">
        {value}
      </div>
      <Mono className="mt-2 block">{label}</Mono>
      {hint ? (
        <p className="mt-2 text-sm text-[var(--color-fg-subtle)]">{hint}</p>
      ) : null}
    </div>
  );
}
