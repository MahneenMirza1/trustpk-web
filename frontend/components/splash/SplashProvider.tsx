"use client";

import { useEffect, useState } from "react";
import { SplashScreen } from "@/components/splash/SplashScreen";

const SPLASH_SESSION_KEY = "trustpk-splash-seen";

type SplashProviderProps = {
  children: React.ReactNode;
};

export function SplashProvider({ children }: SplashProviderProps) {
  const [showSplash, setShowSplash] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
    setShowSplash(!seen);
    setReady(true);
  }, []);

  return (
    <>
      {ready && showSplash ? (
        <SplashScreen
          durationMs={2500}
          onComplete={() => {
            sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
            setShowSplash(false);
          }}
        />
      ) : null}
      {children}
    </>
  );
}
