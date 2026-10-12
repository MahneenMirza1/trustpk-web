"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SplashScreenProps = {
  durationMs?: number;
  fadeMs?: number;
  onComplete?: () => void;
  enabled?: boolean;
};

export function SplashScreen({
  durationMs = 2500,
  fadeMs = 450,
  onComplete,
  enabled = true,
}: SplashScreenProps) {
  const [visible, setVisible] = useState(enabled);
  const [fading, setFading] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const effectiveDuration = useMemo(
    () => (reducedMotion ? Math.min(durationMs, 500) : durationMs),
    [durationMs, reducedMotion],
  );
  const effectiveFade = useMemo(
    () => (reducedMotion ? 0 : fadeMs),
    [fadeMs, reducedMotion],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) {
      onComplete?.();
      return;
    }
    const fadeTimer = window.setTimeout(() => setFading(true), effectiveDuration);
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, effectiveDuration + effectiveFade);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [effectiveDuration, effectiveFade, enabled, onComplete]);

  if (!visible) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[60] flex items-center justify-center",
        "bg-gradient-to-br from-navy via-navy-800 to-brand-800",
        fading ? "opacity-0" : "opacity-100",
        reducedMotion ? "" : "transition-opacity duration-[450ms] ease-out",
      ].join(" ")}
      role="status"
      aria-live="polite"
      aria-label="TrustPK is loading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30 grid-bg"
        aria-hidden
      />
      <div className="relative px-6 text-center text-white">
        <div
          className={[
            "mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur",
            reducedMotion ? "" : "animate-splash-mark",
          ].join(" ")}
        >
          <ShieldCheck className="h-9 w-9 text-brand-200" strokeWidth={2.25} />
        </div>
        <h1
          className={[
            "mt-6 text-4xl font-bold tracking-tight sm:text-5xl",
            reducedMotion ? "" : "animate-splash-title",
          ].join(" ")}
        >
          TrustPK
        </h1>
        <p
          className={[
            "mt-3 text-sm text-white/75 sm:text-base",
            reducedMotion ? "" : "animate-splash-tagline",
          ].join(" ")}
        >
          Your Trusted Digital Assistant for Pakistan
        </p>
      </div>
    </div>
  );
}
