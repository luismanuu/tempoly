import { cx } from "@/lib/cx";

type Props = {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
  id?: string;
};

export function Section({ children, className, divider = false, id }: Props) {
  return (
    <section
      id={id}
      className={cx(
        "py-20 md:py-28",
        divider && "border-t border-[var(--color-border)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
