"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, ExternalLink, Loader2, MessageCircle, Star } from "lucide-react";
import { useMemo, useState } from "react";
import type { Apartment } from "@/lib/apartments";
import { submitLead } from "@/lib/leads";
import { formatPrice, site, whatsappLink } from "@/lib/site";

const today = () => new Date().toISOString().slice(0, 10);
const addDays = (iso: string, d: number) => {
  const dt = new Date(iso);
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().slice(0, 10);
};

export function BookingWidget({ apt }: { apt: Apartment }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"dates" | "details" | "done">("dates");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, Math.round((+new Date(checkOut) - +new Date(checkIn)) / 86400000));
  }, [checkIn, checkOut]);

  const discountOn = code.trim().toUpperCase() === site.directBookingCode;
  const subtotal = nights * apt.pricePerNight;
  const discount = discountOn ? Math.round((subtotal * site.directBookingDiscount) / 100) : 0;
  const total = nights ? subtotal + apt.cleaningFee - discount : 0;

  const summary = `Booking request: ${apt.name}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}\nEst. total: ${formatPrice(total)}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const r = await submitLead({
      type: "booking",
      apartment: apt.name,
      checkIn,
      checkOut,
      guests,
      total,
      ...form,
      message: [form.message, discountOn ? `Promo: ${site.directBookingCode}` : ""].filter(Boolean).join("\n"),
    });
    setLoading(false);
    if (r.ok) setStep("done");
    else setError(r.error ?? "Something went wrong");
  };

  return (
    <div className="rounded-[2rem] border border-text/10 bg-background p-6 shadow-2xl shadow-black/5">
      <div className="flex items-baseline justify-between">
        <p>
          <span className="font-display text-3xl font-semibold">{formatPrice(apt.pricePerNight)}</span>
          <span className="text-text/60"> / night</span>
        </p>
        <span className="flex items-center gap-1 text-sm"><Star size={14} className="fill-primary text-primary" />{apt.rating.toFixed(1)}</span>
      </div>

      <AnimatePresence mode="wait">
        {step === "dates" && (
          <motion.div key="dates" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text/55">
                Check-in
                <input
                  type="date"
                  className="field mt-1 text-sm normal-case tracking-normal"
                  min={today()}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (!checkOut || checkOut <= e.target.value) setCheckOut(addDays(e.target.value, 2));
                  }}
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wider text-text/55">
                Check-out
                <input type="date" className="field mt-1 text-sm normal-case tracking-normal" min={checkIn ? addDays(checkIn, 1) : today()} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              </label>
            </div>
            <label className="mt-2 block text-xs font-semibold uppercase tracking-wider text-text/55">
              Guests
              <select className="field mt-1 text-sm normal-case tracking-normal" value={guests} onChange={(e) => setGuests(+e.target.value)}>
                {Array.from({ length: apt.guests }).map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1} guest{i ? "s" : ""}</option>
                ))}
              </select>
            </label>
            <input className="field mt-2 text-sm uppercase" placeholder="Promo code" value={code} onChange={(e) => setCode(e.target.value)} />

            <AnimatePresence>
              {nights > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <dl className="mt-5 space-y-2 text-text/75">
                    <div className="flex justify-between"><dt>{formatPrice(apt.pricePerNight)} × {nights} night{nights > 1 ? "s" : ""}</dt><dd>{formatPrice(subtotal)}</dd></div>
                    <div className="flex justify-between"><dt>Cleaning fee</dt><dd>{formatPrice(apt.cleaningFee)}</dd></div>
                    {discountOn && <div className="flex justify-between text-accent"><dt>Direct booking −{site.directBookingDiscount}%</dt><dd>−{formatPrice(discount)}</dd></div>}
                    <div className="flex justify-between border-t border-text/10 pt-2 font-semibold text-text"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
                  </dl>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={!nights}
              onClick={() => setStep("details")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-background transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CalendarCheck size={18} /> {nights ? "Request to book" : "Select dates"}
            </button>
            <div className={`mt-3 grid gap-2 text-sm ${apt.airbnbUrl ? "grid-cols-2" : "grid-cols-1"}`}>
              <a href={whatsappLink(nights ? summary : `Hi! Is ${apt.name} available?`)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 rounded-2xl border border-text/10 py-3 font-medium hover:border-primary">
                <MessageCircle size={16} /> WhatsApp
              </a>
              {apt.airbnbUrl && (
                <a href={apt.airbnbUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 rounded-2xl border border-text/10 py-3 font-medium hover:border-primary">
                  <ExternalLink size={16} /> Airbnb
                </a>
              )}
            </div>
            <p className="mt-3 text-center text-xs text-text/50">You won&apos;t be charged yet. We confirm availability within the hour.</p>
          </motion.div>
        )}

        {step === "details" && (
          <motion.form key="details" onSubmit={submit} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-5 space-y-2">
            <p className="rounded-2xl bg-primary/10 p-3 text-sm">
              {checkIn} → {checkOut} · {guests} guest{guests > 1 ? "s" : ""} · <b>{formatPrice(total)}</b>
            </p>
            <input className="field" required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="field" required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="field" required type="tel" placeholder="Phone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <textarea className="field" rows={3} placeholder="Anything we should know? (arrival time, occasion…)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <input tabIndex={-1} autoComplete="off" className="hidden" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} aria-hidden />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-background transition hover:brightness-110 disabled:opacity-60">
              {loading && <Loader2 size={18} className="animate-spin" />} Send booking request
            </button>
            <button type="button" onClick={() => setStep("dates")} className="w-full py-2 text-sm text-text/60 hover:text-primary">← Change dates</button>
          </motion.form>
        )}

        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }} className="mx-auto grid size-16 place-items-center rounded-full bg-accent/15 text-accent">
              <CalendarCheck size={30} />
            </motion.span>
            <h3 className="mt-4 font-display text-2xl font-semibold">Request sent!</h3>
            <p className="mt-2 text-text/65">We&apos;ll confirm availability and payment details by email shortly.</p>
            <a href={whatsappLink(summary)} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white">
              <MessageCircle size={18} /> Speed it up on WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
