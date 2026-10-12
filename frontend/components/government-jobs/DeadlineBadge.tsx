"use client";

import { AlertCircle, Calendar, Clock } from "lucide-react";
import type { JobStatus } from "@/types/job";

type DeadlineBadgeProps = {
  deadlineStr: string | null;
  status: JobStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
};

export function DeadlineBadge({
  deadlineStr,
  status,
  size = "md",
  showIcon = true,
}: DeadlineBadgeProps) {
  const isClosingSoon = status === "Closing Soon";
  const isExpired = status === "Expired";

  const sizeClasses = size === "sm" ? "text-xs px-2.5 py-0.5" : "text-xs sm:text-sm px-3 py-1";

  if (isExpired) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-ink-muted border border-surface-border ${sizeClasses}`}
      >
        {showIcon && <Clock className="h-3.5 w-3.5 text-ink-subtle" />}
        <span>Expired: {deadlineStr || "Closed"}</span>
      </span>
    );
  }

  if (isClosingSoon) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-200 animate-pulse ${sizeClasses}`}
      >
        {showIcon && <AlertCircle className="h-3.5 w-3.5 text-amber-600" />}
        <span>Closing Soon · {deadlineStr || "Check Notice"}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-brand-50/70 text-navy border border-brand-100 ${sizeClasses}`}
    >
      {showIcon && <Calendar className="h-3.5 w-3.5 text-brand-600" />}
      <span>Deadline: {deadlineStr || "See Official Ad"}</span>
    </span>
  );
}
