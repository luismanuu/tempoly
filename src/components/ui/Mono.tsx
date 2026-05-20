import { cx } from "@/lib/cx";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "div" | "p";
};

export function Mono({ children, className, as: Tag = "span" }: Props) {
  return (
    <Tag
      className={cx(
        "font-(family-name:--font-mono) text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
