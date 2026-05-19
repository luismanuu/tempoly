import { cx } from "@/lib/cx";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className, invalid, ...rest }: Props) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cx(
        "h-12 w-full border bg-[var(--color-bg-elev)] px-4 text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)]",
        "font-(family-name:--font-sans) text-[0.95rem]",
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-offset-0",
        invalid
          ? "border-[var(--color-warn)] focus:ring-[var(--color-warn)]"
          : "border-[var(--color-border)] focus:border-[var(--color-success)] focus:ring-[var(--color-success)]",
        className,
      )}
      {...rest}
    />
  );
}
