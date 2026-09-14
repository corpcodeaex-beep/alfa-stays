"use client";

import { ExternalLink, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { apartments } from "@/lib/apartments";
import { googleReviews } from "@/lib/reviews";
import { InView } from "./motion-primitives/in-view";

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

const Stars = ({ n, size = 14 }: { n: number; size?: number }) => (
  <span className="flex text-[#FBBC04]">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={size} className={i < Math.round(n) ? "fill-current" : "opacity-30"} />
    ))}
  </span>
);

/** Google rating summary + real Google reviews. Filters to one apartment when ?apt= is present (QR codes). */
export function GoogleReviews() {
  const aptSlug = useSearchParams().get("apt");
  const current = apartments.find((a) => a.slug === aptSlug);
  const shown = current ? [current] : apartments;
  const reviews = current ? googleReviews.filter((r) => r.apt === current.slug) : googleReviews;

  return (
    <section className="relative mx-auto w-full max-w-6xl px-2 pt-24">
      <div className="text-center">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
          <GoogleIcon className="size-4" /> Google reviews
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">What our guests say</h2>
      </div>

      <div className={`mx-auto mt-10 grid gap-4 ${shown.length > 1 ? "max-w-3xl sm:grid-cols-2" : "max-w-md"}`}>
        {shown.map((a, i) => (
          <InView key={a.slug} delay={i * 0.08}>
            <a
              href={a.googleReviewUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-5 rounded-3xl border border-text/10 bg-background/70 p-5 backdrop-blur-md transition hover:border-primary/40"
            >
              <span className="font-display text-5xl font-semibold">{a.rating.toFixed(1)}</span>
              <span className="min-w-0 flex-1">
                <Stars n={a.rating} size={16} />
                <span className="mt-1 block truncate font-semibold">{a.name}</span>
                <span className="flex items-center gap-1 text-sm text-text/60 group-hover:text-primary">
                  {a.reviews} reviews on Google <ExternalLink size={13} />
                </span>
              </span>
              <GoogleIcon className="size-9 shrink-0" />
            </a>
          </InView>
        ))}
      </div>

      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {reviews.map((r, i) => (
          <InView key={`${r.apt}-${r.name}`} delay={(i % 3) * 0.06} y={20}>
            <figure className="rounded-3xl border border-text/10 bg-background/80 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-primary/15 font-semibold text-primary">{r.name[0]}</span>
                  <span>
                    <span className="block font-semibold leading-tight">{r.name}</span>
                    <span className="text-xs text-text/55">ALFA Stays {r.place}</span>
                  </span>
                </div>
                <GoogleIcon className="size-5" />
              </div>
              <div className="mt-3">
                <Stars n={r.stars} />
              </div>
              <blockquote className="mt-2 text-text/80">{r.text}</blockquote>
            </figure>
          </InView>
        ))}
      </div>
    </section>
  );
}
