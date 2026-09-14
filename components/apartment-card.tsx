"use client";

import Image from "next/image";
import Link from "next/link";
import { BedDouble, Star, Users } from "lucide-react";
import type { Apartment } from "@/lib/apartments";
import { formatPrice } from "@/lib/site";
import { Tilt } from "./motion-primitives/tilt";

export function ApartmentCard({ apt, priority }: { apt: Apartment; priority?: boolean }) {
  return (
    <Tilt max={6} className="group relative rounded-[1.75rem]">
      <Link
        href={`/apartments/${apt.slug}`}
        className="block overflow-hidden rounded-[1.75rem] border border-text/10 bg-background shadow-xl shadow-black/5 transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-primary/15"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={apt.images[0]}
            alt={apt.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold">{apt.area}</span>
          <span className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-sm font-semibold text-white backdrop-blur">
            <Star size={13} className="fill-current" /> {apt.rating.toFixed(1)}
          </span>
        </div>
        <div className="p-5" style={{ transform: "translateZ(30px)" }}>
          <h3 className="font-display text-2xl font-semibold">{apt.name}</h3>
          <p className="mt-1 line-clamp-1 text-text/65">{apt.summary}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-4 text-sm text-text/60">
              <span className="flex items-center gap-1"><Users size={15} />{apt.guests}</span>
              <span className="flex items-center gap-1"><BedDouble size={15} />{apt.bedrooms === 0 ? "Studio" : `${apt.bedrooms} bd`}</span>
            </div>
            <p>
              <span className="text-lg font-bold text-primary">{formatPrice(apt.pricePerNight)}</span>
              <span className="text-sm text-text/55"> / night</span>
            </p>
          </div>
        </div>
      </Link>
    </Tilt>
  );
}
