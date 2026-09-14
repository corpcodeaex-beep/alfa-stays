import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { ApartmentCard } from "@/components/apartment-card";
import { CTA, Features, Stats, Testimonials } from "@/components/home-sections";
import { InView } from "@/components/motion-primitives/in-view";
import { apartments } from "@/lib/apartments";

export default function Home() {
  const featured = apartments.filter((a) => a.featured);

  return (
    <>
      <Hero />
      <Stats />

      <section className="mx-auto max-w-6xl px-6 pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">Featured stays</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Handpicked apartments</h2>
          </div>
          <Link href="/apartments" className="group flex items-center gap-2 font-semibold text-primary">
            View all <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((a, i) => (
            <InView key={a.slug} delay={i * 0.1}>
              <ApartmentCard apt={a} />
            </InView>
          ))}
        </div>
      </section>

      <Features />
      <Testimonials />
      <CTA />
    </>
  );
}
