"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Seamless horizontal marquee. */
export function InfiniteSlider({
  children,
  duration = 40,
  reverse = false,
  className,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] ${className ?? ""}`}>
      <motion.div
        className="flex w-max gap-6"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        <div className="flex gap-6">{children}</div>
        <div className="flex gap-6" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
