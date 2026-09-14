"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AnimatedBackground = dynamic(() => import("./animated-background"), { ssr: false });

/** Fixed, full-viewport 3D animated background shared by every page. */
export function Background() {
  const [env, setEnv] = useState<{ lite: boolean; reducedMotion: boolean } | null>(null);

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    setEnv({
      lite: window.innerWidth < 768 || cores <= 4,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* static fallback while WebGL loads (or if unavailable) */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_20%,color-mix(in_oklab,var(--primary)_28%,transparent),transparent),radial-gradient(50%_50%_at_85%_70%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent)]" />
      {env && <AnimatedBackground lite={env.lite} reducedMotion={env.reducedMotion} />}
    </div>
  );
}
