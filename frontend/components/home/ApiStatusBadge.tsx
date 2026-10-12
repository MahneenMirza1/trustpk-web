"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/common/Badge";
import { checkApiHealth } from "@/services/api";

type ConnectionState = "checking" | "connected" | "unavailable";

/** Dev-only connectivity badge. Hidden when NEXT_PUBLIC_SHOW_API_STATUS=false. */
export function ApiStatusBadge() {
  const [state, setState] = useState<ConnectionState>("checking");
  const show = process.env.NEXT_PUBLIC_SHOW_API_STATUS !== "false";

  useEffect(() => {
    if (!show) return;
    let cancelled = false;
    async function run() {
      try {
        const data = await checkApiHealth();
        if (!cancelled) {
          setState(data.status === "healthy" ? "connected" : "unavailable");
        }
      } catch {
        if (!cancelled) setState("unavailable");
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [show]);

  if (!show) return null;

  const labels = {
    checking: "Checking API…",
    connected: "TrustPK API Connected",
    unavailable: "Backend unavailable",
  } as const;

  const variants = {
    checking: "neutral",
    connected: "success",
    unavailable: "danger",
  } as const;

  return (
    <Badge variant={variants[state]} className="mb-5">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          state === "connected"
            ? "bg-success"
            : state === "unavailable"
              ? "bg-danger"
              : "bg-ink-subtle"
        }`}
        aria-hidden
      />
      <span aria-live="polite">{labels[state]}</span>
    </Badge>
  );
}
