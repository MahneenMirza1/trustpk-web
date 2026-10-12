import { type LucideIcon, SearchX } from "lucide-react";
import { type ReactNode } from "react";
import { Button } from "./Button";
import { Card } from "./Card";

export type EmptyStateProps = {
  title?: string;
  message?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  variant?: "card" | "dashed";
  className?: string;
  children?: ReactNode;
};

export function EmptyState({
  title = "No results found",
  message = "Try changing your search or filters.",
  icon: Icon = SearchX,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  variant = "card",
  className = "",
  children,
}: EmptyStateProps) {
  if (variant === "dashed") {
    return (
      <div
        className={`rounded-2xl border border-dashed border-surface-border bg-white px-5 py-10 text-center ${className}`}
      >
        <p className="text-base font-semibold text-ink">{title}</p>
        <p className="mt-2 text-sm text-ink-muted">{message}</p>
        {children}
      </div>
    );
  }

  return (
    <Card className={`p-8 text-center sm:p-10 ${className}`}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon className="h-7 w-7" aria-hidden />
      </div>

      <h2 className="mt-5 text-xl font-bold text-navy">{title}</h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-ink-muted">
        {message}
      </p>

      {actionLabel && onAction ? (
        <div className="mt-6 flex justify-center">
          <Button type="button" variant="outline" onClick={onAction}>
            {ActionIcon ? <ActionIcon className="h-4 w-4" aria-hidden /> : null}
            {actionLabel}
          </Button>
        </div>
      ) : null}

      {children}
    </Card>
  );
}
