import { type ReactNode } from "react";

export type BadgeVariant = "neutral" | "brand" | "success" | "warning" | "danger" | "navy";

export type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variants: Record<BadgeVariant, string> = {
  neutral: "border-surface-border bg-white text-ink-muted",
  brand: "border-brand-100 bg-brand-50 text-brand-700",
  success: "border-success/15 bg-success-soft text-success",
  warning: "border-warning/20 bg-warning-soft text-warning",
  danger: "border-danger/15 bg-danger-soft text-danger",
  navy: "border-navy/10 bg-navy/5 text-navy",
};

export function Badge({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
