"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useRef } from "react";
import { TextEffect } from "./motion-primitives/text-effect";
import { Magnetic } from "./motion-primitives/magnetic";
import { LogoMark } from "./logo";
import { site } from "@/lib/site";

/** Real photo presented as a 3D card: pointer tilt, inner parallax, slow zoom and a light sweep. */
function HomeCard() {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 140, damping: 18 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-13, 13]), spring);
  const imgX = useSpring(useTransform(px, [-0.5, 0.5], [22, -22]), spring);
  const imgY = useSpring(useTransform(py, [-0.5, 0.5], [16, -16]), spring);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[520px] [perspective:1400px]"
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, rotateY: -28, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateY: 0, rotateX: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="relative [transform-style:preserve-3d]"
      >
        <motion.div style={{ rotateX, rotateY }} className="relative [transform-style:preserve-3d]">
          {/* depth glow behind */}
          <div className="absolute -inset-8 rounded-[3rem] bg-primary/35 blur-3xl [transform:translateZ(-80px)]" />

          {/* the photo */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2.25rem] border border-white/15 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.55)] lg:aspect-[4/5]">
            <motion.div style={{ x: imgX, y: imgY }} className="absolute -inset-8">
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1.04, 1.14] }}
                transition={{ duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
              >
                <Image
                  src="/hero/two-storey-home.jpg"
                  alt="Modern two-storey luxury home at dusk"
                  fill
                  priority
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover object-[58%_50%]"
                />
              </motion.div>
            </motion.div>

            {/* light sweep */}
            <motion.div
              aria-hidden
              className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              initial={{ x: "-150%" }}
              animate={{ x: "350%" }}
              transition={{ duration: 2.2, delay: 1.6, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
              <div>
                <LogoMark className="h-6 w-auto text-white/90" />
                <p className="mt-2 text-xs font-medium tracking-[0.35em]">PREMIUM LUXURY STAYS</p>
                <p className="mt-1 text-sm text-white/70">Bahria Town · Lahore</p>
              </div>
              <Link href="/apartments" className="pointer-events-auto grid size-12 place-items-center rounded-full bg-white/15 backdrop-blur-md transition hover:bg-white/30" aria-label="View apartments">
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden pb-16 pt-28">
      <motion.div style={{ y, opacity }} className="relative mx-auto grid min-h-[calc(100svh-9rem)] max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <Sparkles size={14} className="text-primary" /> {site.directBookingDiscount}% off when you book direct
          </motion.span>

          <TextEffect as="h1" className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Premium luxury stays in Bahria Town, Lahore.
          </TextEffect>

          <TextEffect as="p" delay={0.5} className="mt-6 max-w-lg text-lg text-text/75">
            {site.description}
          </TextEffect>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }} className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link href="/apartments" className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-background shadow-xl shadow-primary/30 transition hover:brightness-110">
                Explore apartments
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Link href="/contact" className="glass rounded-full px-7 py-4 font-semibold transition hover:border-primary hover:text-primary">
              Talk to a host
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-10 flex flex-wrap gap-6 text-sm text-text/75">
            <span className="flex items-center gap-2">
              <span className="flex text-primary">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-current" />)}</span>
              4.9 on Google Maps
            </span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> Guest Favourite on Airbnb</span>
          </motion.div>
        </div>

        <HomeCard />
      </motion.div>
    </section>
  );
}
