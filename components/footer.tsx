import Link from "next/link";
import { Camera as Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { apartments } from "@/lib/apartments";
import { LayeredPeaks } from "./haikei";
import { NewsletterForm } from "./newsletter-form";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      <LayeredPeaks className="h-24 w-full" />
      <div className="bg-secondary/25">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo full className="text-text" />
            <p className="mt-3 max-w-sm text-text/70">{site.tagline} Get {site.directBookingDiscount}% off when you book direct.</p>
            <div className="mt-6 max-w-sm">
              <NewsletterForm />
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-text/50">Stays</p>
            <ul className="space-y-2">
              {apartments.map((a) => (
                <li key={a.slug}>
                  <Link href={`/apartments/${a.slug}`} className="hover:text-primary">
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-text/50">Contact</p>
            <ul className="space-y-3">
              <li><a className="flex items-center gap-2 hover:text-primary" href={`mailto:${site.email}`}><Mail size={16} />{site.email}</a></li>
              <li><a className="flex items-center gap-2 hover:text-primary" href={`tel:${site.phone}`}><Phone size={16} />{site.phone}</a></li>
              <li><a className="flex items-center gap-2 hover:text-primary" href={whatsappLink("Hi! I'd like to book a stay.")} target="_blank" rel="noreferrer"><MessageCircle size={16} />WhatsApp</a></li>
              <li><a className="flex items-center gap-2 hover:text-primary" href={site.socials.instagram} target="_blank" rel="noreferrer"><Instagram size={16} />Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 border-t border-text/10 px-6 py-6 text-sm text-text/50">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <Link href="/review" className="hover:text-primary">Stayed with us? Leave a review →</Link>
        </div>
      </div>
    </footer>
  );
}
