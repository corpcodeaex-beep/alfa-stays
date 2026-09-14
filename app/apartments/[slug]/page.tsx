import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, Check, DoorOpen, MapPin, Navigation, Star, Users } from "lucide-react";
import { apartments, getApartment } from "@/lib/apartments";
import { BookingWidget } from "@/components/booking-widget";
import { InView } from "@/components/motion-primitives/in-view";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return apartments.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const apt = getApartment((await params).slug);
  if (!apt) return {};
  return {
    title: apt.name,
    description: apt.summary,
    openGraph: { images: [apt.images[0]] },
  };
}

export default async function ApartmentPage({ params }: Props) {
  const apt = getApartment((await params).slug);
  if (!apt) notFound();

  const facts = [
    { icon: Users, label: `${apt.guests} guests` },
    { icon: DoorOpen, label: apt.bedrooms === 0 ? "Studio" : `${apt.bedrooms} bedroom${apt.bedrooms > 1 ? "s" : ""}` },
    { icon: BedDouble, label: `${apt.beds} bed${apt.beds > 1 ? "s" : ""}` },
    { icon: Bath, label: `${apt.baths} bath${apt.baths > 1 ? "s" : ""}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: apt.name,
    description: apt.description,
    image: apt.images,
    numberOfRooms: apt.bedrooms,
    occupancy: { "@type": "QuantitativeValue", maxValue: apt.guests },
    aggregateRating: { "@type": "AggregateRating", ratingValue: apt.rating, reviewCount: apt.reviews },
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/apartments" className="inline-flex items-center gap-2 text-sm font-medium text-text/60 hover:text-primary">
        <ArrowLeft size={16} /> All apartments
      </Link>

      <InView>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{apt.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-text/70">
          <span className="flex items-center gap-1 font-semibold text-text"><Star size={16} className="fill-primary text-primary" />{apt.rating.toFixed(1)}</span>
          <span>{apt.reviews} reviews</span>
          <span className="flex items-center gap-1"><MapPin size={16} />{apt.area}</span>
        </div>
      </InView>

      <InView delay={0.1}>
        <div className="mt-8 grid h-[320px] gap-3 overflow-hidden rounded-[2rem] sm:h-[460px] sm:grid-cols-3 sm:grid-rows-2">
          {apt.images.slice(0, 3).map((src, i) => (
            <div key={src} className={`group relative overflow-hidden ${i === 0 ? "sm:col-span-2 sm:row-span-2" : "hidden sm:block"}`}>
              <Image src={src} alt={`${apt.name} photo ${i + 1}`} fill priority={i === 0} sizes={i === 0 ? "66vw" : "33vw"} className="object-cover transition duration-700 group-hover:scale-105" />
            </div>
          ))}
        </div>
      </InView>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex flex-wrap gap-3">
            {facts.map((f) => (
              <span key={f.label} className="flex items-center gap-2 rounded-full border border-text/10 px-4 py-2 text-sm">
                <f.icon size={16} className="text-primary" />{f.label}
              </span>
            ))}
          </div>

          <InView>
            <h2 className="mt-10 font-display text-2xl font-semibold">About this stay</h2>
            <p className="mt-3 text-lg leading-relaxed text-text/75">{apt.description}</p>
          </InView>

          <InView>
            <h2 className="mt-10 font-display text-2xl font-semibold">What this place offers</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {apt.amenities.map((a) => (
                <li key={a} className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-full bg-accent/15 text-accent"><Check size={15} /></span>
                  {a}
                </li>
              ))}
            </ul>
          </InView>

          <InView>
            <div className="mt-10 rounded-3xl border border-text/10 bg-background/60 p-6 backdrop-blur-md">
              <h2 className="font-display text-2xl font-semibold">Good to know</h2>
              <ul className="mt-3 space-y-1 text-text/70">
                <li>Smart-lock self check-in — no waiting for keys</li>
                <li>Check-in / check-out timings confirmed when you book</li>
                <li>No parties or events · Please respect the neighbours</li>
              </ul>
            </div>
          </InView>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <BookingWidget apt={apt} />
        </div>
      </div>

      <section className="mt-20">
        <h2 className="font-display text-3xl font-semibold">Photo tour</h2>
        <div className="mt-6 columns-2 gap-3 md:columns-3 [&>*]:mb-3 [&>*]:break-inside-avoid">
          {apt.images.map((src, i) => (
            <InView key={src} delay={(i % 3) * 0.05} y={20}>
              <div className="group overflow-hidden rounded-2xl">
                <Image src={src} alt={`${apt.name} photo ${i + 1}`} width={900} height={1200} sizes="(min-width: 768px) 33vw, 50vw" className="h-auto w-full transition duration-700 group-hover:scale-105" />
              </div>
            </InView>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="overflow-hidden rounded-[2rem] border border-text/10">
          <iframe
            title={`Map of ${apt.name}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(apt.mapQuery)}&z=16&output=embed`}
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="rounded-[2rem] border border-text/10 bg-background/60 p-6 backdrop-blur-md">
          <h2 className="font-display text-2xl font-semibold">Location</h2>
          <p className="mt-2 flex gap-2 text-text/70"><MapPin size={18} className="mt-0.5 shrink-0 text-primary" />{apt.address}</p>
          <div className="mt-6 grid gap-2">
            <a href={apt.googleMapsUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-background transition hover:brightness-110">
              <Navigation size={17} /> Get directions
            </a>
            <a href={apt.googleReviewUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-2xl border border-text/15 py-3.5 font-semibold transition hover:border-primary">
              <Star size={17} /> Read {apt.reviews} Google reviews
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
