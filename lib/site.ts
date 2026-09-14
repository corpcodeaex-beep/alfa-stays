// ─────────────────────────────────────────────────────────────
//  Central site config — edit this file to rebrand the site.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "ALFA Stays",
  tagline: "Premium luxury stays in Bahria Town, Lahore.",
  description:
    "Premium serviced apartments in Bahria Town, Lahore — starlight ceilings, hotel-grade comfort, self check-in and a host on WhatsApp 24/7. Book direct for the best rate.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://alfastays.vercel.app",
  city: "Lahore",
  // TODO: replace with your real business email
  email: "hello@alfastays.pk",
  phone: "+92 339 3971689",
  // Digits only, with country code — used for wa.me links
  whatsapp: "923393971689",
  currency: "PKR",
  // Fallback public review links (each apartment also has its own Google link)
  reviewLinks: {
    google: "https://www.google.com/maps?cid=18181730961433277806",
    airbnb: "https://www.airbnb.com/",
  },
  socials: {
    instagram: "https://www.instagram.com/alfastays.pk",
  },
  directBookingDiscount: 10, // percent, shown in lead popup
  directBookingCode: "DIRECT10",
} as const;

export const whatsappLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const formatPrice = (amount: number) => `${site.currency} ${Math.round(amount).toLocaleString("en-PK")}`;
