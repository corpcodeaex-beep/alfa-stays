import type { Metadata } from "next";
import { QrGenerator } from "@/components/qr-generator";

export const metadata: Metadata = {
  title: "QR code generator",
  robots: { index: false, follow: false },
};

export default function QrPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-32">
      <div className="print:hidden">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Host tools</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">QR codes for reviews & leads</h1>
        <p className="mt-3 max-w-2xl text-text/65">
          Generate a QR code for each apartment and placement. Print it on welcome cards, fridge magnets or checkout notes — every scan and lead is
          tagged with its source so you can see which placement works best.
        </p>
      </div>
      <div className="mt-10">
        <QrGenerator />
      </div>
    </div>
  );
}
