"use client";

import { motion, type Variants } from "motion/react";

type Props = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  per?: "word" | "char";
  className?: string;
  delay?: number;
};

const container: Variants = {
  hidden: {},
  visible: (delay: number) => ({ transition: { staggerChildren: 0.035, delayChildren: delay } }),
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 180, damping: 22 } },
};

/** Staggered blur-in text reveal (Motion-Primitives style). */
export function TextEffect({ children, as = "p", per = "word", className, delay = 0 }: Props) {
  const Tag = motion[as];
  const segments = per === "word" ? children.split(/(\s+)/) : children.split("");

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
      custom={delay}
      aria-label={children}
    >
      {segments.map((s, i) =>
        /^\s+$/.test(s) ? (
          <span key={i}>{s}</span>
        ) : (
          <motion.span key={i} variants={item} className="inline-block whitespace-pre" aria-hidden>
            {s}
          </motion.span>
        ),
      )}
    </Tag>
  );
}
