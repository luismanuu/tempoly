import { cx } from "@/lib/cx";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "main" | "article";
};

export function Container({ children, className, as: Tag = "div" }: Props) {
  return (
    <Tag className={cx("mx-auto w-full max-w-6xl px-6 md:px-8", className)}>
      {children}
    </Tag>
  );
}
