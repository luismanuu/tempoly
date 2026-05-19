import { cx } from "@/lib/cx";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-[var(--color-success)] text-[var(--color-bg)] hover:brightness-110 active:brightness-95",
  ghost:
    "border border-[var(--color-border-strong)] text-[var(--color-fg)] hover:border-[var(--color-fg)] hover:bg-[var(--color-bg-elev)]",
  danger:
    "bg-[var(--color-warn)] text-[var(--color-bg)] hover:brightness-110",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-none font-(family-name:--font-mono) text-[0.78rem] uppercase tracking-[0.16em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-success)] disabled:cursor-not-allowed disabled:opacity-50";

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cx(BASE, SIZE[size], VARIANT[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href">;

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...rest
}: LinkButtonProps) {
  return (
    <a
      href={href}
      className={cx(BASE, SIZE[size], VARIANT[variant], className)}
      {...rest}
    >
      {children}
    </a>
  );
}
