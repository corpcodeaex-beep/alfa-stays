"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Clock, KeyRound, MapPin, QrCode, ShieldCheck, Sparkles, Star } from "lucide-react";
import { InView } from "./motion-primitives/in-view";
import { AnimatedNumber } from "./motion-primitives/animated-number";
import { InfiniteSlider } from "./motion-primitives/infinite-slider";
import { TextEffect } from "./motion-primitives/text-effect";
import { Magnetic } from "./motion-primitives/magnetic";
import { BlobScene } from "./haikei";
import { site, whatsappLink } from "@/lib/site";
import { apartments, totalReviews } from "@/lib/apartments";
import { googleReviews } from "@/lib/reviews";

export function Stats() {
  const stats = [
    { value: 4.9, decimals: 1, suffix: "★", label: "Google rating" },
    { value: totalReviews, label: "Google reviews" },
    { value: apartments.length, label: "Luxury apartments" },
    { value: 24, suffix: "/7", label: "WhatsApp support" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s, i) => (
          <InView key={s.label} delay={i * 0.08}>
            <div className="rounded-3xl border border-text/10 bg-background/55 p-6 text-center backdrop-blur-md">
              <p className="font-display text-4xl font-semibold text-primary">
                <AnimatedNumber value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-text/60">{s.label}</p>
            </div>
          </InView>
        ))}
      </div>
    </section>
  );
}

export function Features() {
  const items = [
    { icon: KeyRound, title: "Smart-lock self check-in", text: "No waiting around for keys — let yourself in whenever you arrive." },
    { icon: Sparkles, title: "Spotless & hygienic", text: "Cleanliness is the #1 thing our guests mention in their Google reviews." },
    { icon: Star, title: "Starlight ceilings", text: "Fibre-optic starry skies and warm cove lighting you won't find in a hotel." },
    { icon: Clock, title: "Host on WhatsApp 24/7", text: "Our team is one message away before, during and after your stay." },
    { icon: ShieldCheck, title: "Safe & private", text: "Secure buildings in Bahria Town — ideal for families and couples." },
    { icon: QrCode, title: "Best rate direct", text: `Book with us and save ${site.directBookingDiscount}% vs. booking platforms.` },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Why guests choose us</p>
        <TextEffect as="h2" className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Everything you love about hotels. None of the stiffness.
        </TextEffect>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <InView key={it.title} delay={i * 0.06}>
            <motion.div
              whileHover={{ y: -6 }}
              className="group h-full rounded-3xl border border-text/10 bg-background/50 p-7 backdrop-blur-md transition-colors hover:border-primary/40"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary transition group-hover:rotate-6 group-hover:scale-110">
                <it.icon size={22} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-text/65">{it.text}</p>
            </motion.div>
          </InView>
        ))}
      </div>
    </section>
  );
}

const testimonials = googleReviews.filter((r) => r.featured);

export function Testimonials() {
  return (
    <section className="py-10">
      <div className="mx-auto mb-12 max-w-6xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{totalReviews} Google reviews</p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Words from our guests</h2>
      </div>
      {[false, true].map((rev) => (
        <InfiniteSlider key={String(rev)} reverse={rev} duration={55} className="py-3">
          {(rev ? [...testimonials].reverse() : testimonials).map((t) => (
            <figure key={`${t.apt}-${t.name}`} className="w-[340px] shrink-0 rounded-3xl border border-text/10 bg-background/85 p-6">
              <div className="flex text-primary">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-current" />)}</div>
              <blockquote className="mt-3 text-text/80">&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-semibold">
                {t.name} <span className="font-normal text-text/50">· Google review · {t.place}</span>
              </figcaption>
            </figure>
          ))}
        </InfiniteSlider>
      ))}
    </section>
  );
}

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-24">
      <InView>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-text px-8 py-16 text-background sm:px-16">
          <BlobScene className="pointer-events-none absolute -right-40 -top-40 w-[900px] max-w-none opacity-80" />
          <div className="relative max-w-xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Ready for your next stay?</h2>
            <p className="mt-4 text-lg opacity-75">
              Book direct for the best rate, flexible check-in and a personal host. Use code{" "}
              <span className="rounded-md bg-primary px-2 py-0.5 font-mono font-semibold">{site.directBookingCode}</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Magnetic>
                <Link href="/apartments" className="inline-block rounded-full bg-primary px-7 py-4 font-semibold text-background transition hover:brightness-110">
                  Check availability
                </Link>
              </Magnetic>
              <a href={whatsappLink("Hi! I'd like to check availability.")} target="_blank" rel="noreferrer" className="rounded-full border border-background/25 px-7 py-4 font-semibold transition hover:bg-background/10">
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </InView>
    </section>
  );
}
