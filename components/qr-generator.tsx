"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Copy, Download, Printer } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { apartments } from "@/lib/apartments";
import { site } from "@/lib/site";

const destinations = [
  { value: "review", label: "Review page (rate your stay)" },
  { value: "book", label: "Apartment booking page" },
  { value: "home", label: "Homepage (lead capture)" },
];

export function QrGenerator() {
  const [origin, setOrigin] = useState(site.url);
  const [apt, setApt] = useState(apartments[0].slug);
  const [dest, setDest] = useState("review");
  const [src, setSrc] = useState("room-card");
  const [fg, setFg] = useState("#16110d");
  const wrap = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => setOrigin(window.location.origin), []);

  const qs = new URLSearchParams({ src });
  if (dest === "review") qs.set("apt", apt);
  const path = dest === "review" ? "/review" : dest === "book" ? `/apartments/${apt}` : "/";
  const url = `${origin}${path}?${qs.toString()}`;
  const aptName = apartments.find((a) => a.slug === apt)?.name ?? "";

  const download = () => {
    const canvas = wrap.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `qr-${dest}-${apt}-${src}.png`;
    a.click();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <div className="space-y-4 print:hidden">
        <label className="block text-sm font-semibold">
          Destination
          <select className="field mt-1 font-normal" value={dest} onChange={(e) => setDest(e.target.value)}>
            {destinations.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </label>
        {dest !== "home" && (
          <label className="block text-sm font-semibold">
            Apartment
            <select className="field mt-1 font-normal" value={apt} onChange={(e) => setApt(e.target.value)}>
              {apartments.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
            </select>
          </label>
        )}
        <label className="block text-sm font-semibold">
          Placement / source tag <span className="font-normal text-text/50">(tracked with every lead)</span>
          <input className="field mt-1 font-normal" value={src} onChange={(e) => setSrc(e.target.value.replace(/[^a-z0-9-_]/gi, "-").toLowerCase())} placeholder="e.g. fridge-magnet, welcome-card, flyer" />
        </label>
        <label className="flex items-center gap-3 text-sm font-semibold">
          QR color
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-16 cursor-pointer rounded-lg border border-text/10 bg-transparent" />
        </label>
        <div className="rounded-2xl bg-text/5 p-4 text-sm">
          <p className="font-semibold">Link encoded</p>
          <p className="mt-1 break-all font-mono text-text/70">{url}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="mt-3 inline-flex items-center gap-2 font-semibold text-primary"
          >
            <Copy size={14} /> {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>

      {/* Printable card */}
      <motion.div layout className="mx-auto w-full max-w-sm">
        <div ref={wrap} className="rounded-[2rem] bg-[#faf6f1] p-8 text-center text-[#16110d] shadow-2xl print:shadow-none">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-60">{site.name}</p>
          <p className="mt-2 font-display text-2xl font-semibold">
            {dest === "review" ? "Enjoyed your stay?" : dest === "book" ? "Book again & save" : "Stay with us"}
          </p>
          <p className="mt-1 text-sm opacity-70">
            {dest === "review" ? `Scan to rate ${aptName}` : `Scan for ${site.directBookingDiscount}% off direct bookings`}
          </p>
          <div className="mx-auto mt-6 w-fit rounded-2xl bg-white p-4">
            <QRCodeCanvas value={url} size={220} fgColor={fg} bgColor="#ffffff" level="H" marginSize={1} />
          </div>
          <p className="mt-5 text-xs opacity-50">Point your phone camera at the code</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 print:hidden">
          <button onClick={download} className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-semibold text-background hover:brightness-110">
            <Download size={16} /> PNG
          </button>
          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 rounded-2xl border border-text/15 py-3 font-semibold hover:border-primary">
            <Printer size={16} /> Print card
          </button>
        </div>
      </motion.div>
    </div>
  );
}
