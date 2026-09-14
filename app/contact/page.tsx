import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { BlobScene } from "@/components/haikei";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about a stay, long-term rates or corporate bookings? Get in touch.",
};

export default function ContactPage() {
  const channels = [
    { icon: MessageCircle, label: "WhatsApp", value: "Fastest reply", href: whatsappLink("Hi! I have a question.") },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phone}` },
  ];

  return (
    <div className="relative overflow-hidden pt-36">
      <BlobScene className="pointer-events-none absolute -right-60 top-0 w-[1000px] max-w-none opacity-60" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Contact</p>
          <TextEffect as="h1" className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            Let&apos;s plan your stay.
          </TextEffect>
          <p className="mt-5 max-w-md text-lg text-text/70">
            Long stays, corporate housing, group bookings or just a question — a real host will get back to you quickly.
          </p>
          <div className="mt-10 space-y-3">
            {channels.map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-3xl border border-text/10 p-5 transition hover:border-primary/50">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary transition group-hover:scale-110">
                  <c.icon size={22} />
                </span>
                <span>
                  <span className="block font-semibold">{c.label}</span>
                  <span className="text-text/60">{c.value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
