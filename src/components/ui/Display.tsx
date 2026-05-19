import { cx } from "@/lib/cx";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
};

function base(className?: string) {
  return cx(
    "font-(family-name:--font-display) text-balance text-[var(--color-fg)]",
    className,
  );
}

export const Display = {
  One({ children, className, as: Tag = "h1" }: Props) {
    return (
      <Tag
        className={base(
          cx(
            "text-5xl md:text-7xl lg:text-[5.25rem] font-light leading-[0.95] tracking-tight",
            className,
          ),
        )}
      >
        {children}
      </Tag>
    );
  },
  Two({ children, className, as: Tag = "h2" }: Props) {
    return (
      <Tag
        className={base(
          cx(
            "text-3xl md:text-5xl font-light leading-[1.05] tracking-tight",
            className,
          ),
        )}
      >
        {children}
      </Tag>
    );
  },
  Three({ children, className, as: Tag = "h3" }: Props) {
    return (
      <Tag
        className={base(
          cx("text-2xl md:text-3xl font-normal leading-tight", className),
        )}
      >
        {children}
      </Tag>
    );
  },
};
