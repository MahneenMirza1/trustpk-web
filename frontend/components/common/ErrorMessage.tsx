import { RefreshCw } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

export type ErrorMessageProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  variant?: "card" | "banner";
};

export function ErrorMessage({
  title = "Unable to Load Data",
  message = "An error occurred while loading this content.",
  onRetry,
  className = "",
  variant = "card",
}: ErrorMessageProps) {
  if (variant === "banner") {
    return (
      <div
        className={`rounded-2xl border border-danger/20 bg-danger-soft px-5 py-6 text-center ${className}`}
        role="alert"
      >
        <p className="text-sm font-semibold text-danger">⚠ {title}</p>
        <p className="mt-2 text-sm text-danger/90">{message}</p>
        {onRetry ? (
          <div className="mt-4 flex justify-center">
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4" aria-hidden />
              Try Again
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Card className={`border-danger/20 bg-white p-8 text-center sm:p-10 ${className}`}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-danger">
        <RefreshCw className="h-7 w-7" aria-hidden />
      </div>

      <h2 className="mt-5 text-xl font-bold text-navy">{title}</h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-ink-muted">
        {message}
      </p>

      {onRetry ? (
        <div className="mt-6 flex justify-center">
          <Button type="button" variant="outline" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try Again
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

export { ErrorMessage as ErrorState };
