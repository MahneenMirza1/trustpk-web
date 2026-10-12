import { type ReactNode } from "react";

export type PageContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "main" | "section";
};

export function PageContainer({
  children,
  className = "",
  as: Tag = "div",
}: PageContainerProps) {
  return (
    <Tag className={`container-page ${className}`.trim()}>
      {children}
    </Tag>
  );
}
