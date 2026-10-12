import { Loader2 } from "lucide-react";

export type LoadingProps = {
  label?: string;
  className?: string;
};

export function Loading({ label = "Loading…", className = "" }: LoadingProps) {
  return (
    <div
      className={`flex items-center gap-3 text-sm text-ink-muted ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-4 w-4 animate-spin text-brand-600 motion-reduce:animate-none" />
      <span>{label}</span>
    </div>
  );
}

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-brand-100/80 motion-reduce:animate-none ${className}`}
      aria-hidden
    />
  );
}
