import { type ReactNode } from "react";

export type CardProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  as?: "div" | "article" | "section";
  interactive?: boolean;
};

export function Card({
  children,
  id,
  className = "",
  as: Tag = "div",
  interactive = false,
}: CardProps) {
  return (
    <Tag
      id={id}
      className={[
        "rounded-2xl border border-surface-border bg-white p-6 shadow-soft sm:p-7",
        interactive
          ? "transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-elevated"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
