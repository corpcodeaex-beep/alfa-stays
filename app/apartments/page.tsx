import type { Metadata } from "next";
import { ApartmentCard } from "@/components/apartment-card";
import { InView } from "@/components/motion-primitives/in-view";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { BlobScene } from "@/components/haikei";
import { apartments } from "@/lib/apartments";

export const metadata: Metadata = {
  title: "Apartments",
  description: "Browse our collection of design-led serviced apartments and book direct for the best rate.",
};

export default function ApartmentsPage() {
  return (
    <div className="relative overflow-hidden pt-36">
      <BlobScene className="pointer-events-none absolute -top-40 left-1/2 w-[130%] max-w-none -translate-x-1/2 opacity-50" />
      <section className="relative mx-auto max-w-6xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{apartments.length} stays available</p>
        <TextEffect as="h1" className="mt-3 max-w-3xl font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          Find the apartment that fits your trip.
        </TextEffect>
        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {apartments.map((a, i) => (
            <InView key={a.slug} delay={i * 0.08}>
              <ApartmentCard apt={a} priority={i < 3} />
            </InView>
          ))}
        </div>
      </section>
    </div>
  );
}
