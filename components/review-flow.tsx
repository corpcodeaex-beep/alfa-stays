"use client";

import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, Heart, Loader2, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { apartments } from "@/lib/apartments";
import { submitLead } from "@/lib/leads";
import { site } from "@/lib/site";

const labels = ["", "Poor", "Fair", "Good", "Great", "Amazing!"];

/**
 * QR-code review flow.
 * Every guest can post a public review (no review gating — Google & Airbnb policies forbid
 * hiding the public option from unhappy guests). Guests can also leave private feedback,
 * which is captured as a lead with their contact details.
 */
export function ReviewFlow() {
  const params = useSearchParams();
  const aptSlug = params.get("apt") ?? "";
  const source = params.get("src") ?? "qr";
  const apt = apartments.find((a) => a.slug === aptSlug);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [step, setStep] = useState<"rate" | "next" | "done">("rate");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", company: "", optIn: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const happy = rating >= 4;
  const shown = hover || rating;

  const choose = (r: number) => {
    setRating(r);
    setTimeout(() => setStep("next"), 350);
  };

  const trackClick = (platform: string) =>
    submitLead({ type: "review-click", rating, apartment: apt?.name, source: `${source}:${platform}` });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const r = await submitLead({
      type: "review-feedback",
      rating,
      apartment: apt?.name,
      source,
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      message: `${form.message}${form.optIn ? "\n[Opted in to offers]" : ""}`,
    });
    setLoading(false);
    if (r.ok) setStep("done");
    else setError(r.error ?? "Something went wrong");
  };

  return (
    <div className="relative mx-auto w-full max-w-lg rounded-[2.25rem] border border-text/10 bg-background/80 p-7 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-10">
      <AnimatePresence mode="wait">
        {step === "rate" && (
          <motion.div key="rate" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{apt ? apt.name : site.name}</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">How was your stay?</h1>
            <p className="mt-2 text-text/65">Tap a star — it takes 10 seconds and means the world to us.</p>

            <div className="mt-8 flex justify-center gap-2" onPointerLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <motion.button
                  key={n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onPointerEnter={() => setHover(n)}
                  onClick={() => choose(n)}
                  whileHover={{ scale: 1.2, rotate: -8 }}
                  whileTap={{ scale: 0.85 }}
                  animate={rating === n ? { scale: [1, 1.4, 1] } : {}}
                  className="p-1"
                >
                  <Star size={46} strokeWidth={1.5} className={`transition-colors ${n <= shown ? "fill-primary text-primary" : "text-text/25"}`} />
                </motion.button>
              ))}
            </div>
            <p className="mt-3 h-6 font-semibold text-primary">{labels[shown]}</p>
          </motion.div>
        )}

        {step === "next" && (
          <motion.div key="next" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={22} className={n <= rating ? "fill-primary text-primary" : "text-text/20"} />
              ))}
            </div>
            <h2 className="mt-4 text-center font-display text-3xl font-semibold">
              {happy ? "Thank you! Would you share that?" : "Thanks for being honest."}
            </h2>
            <p className="mt-2 text-center text-text/65">
              {happy
                ? "A public review helps other travellers find us — it's the best way to support a small host."
                : "Tell us what we could do better — our team reads every message. You're also welcome to post a public review."}
            </p>

            <div className={`mt-6 grid gap-2 ${happy ? "" : "order-last"}`}>
              {(apt ? [apt] : apartments).map((a) => (
                <a
                  key={a.slug}
                  href={a.googleReviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackClick(`google:${a.slug}`)}
                  className={`flex items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition ${happy ? "bg-primary text-background hover:brightness-110" : "border border-text/15 hover:border-primary"}`}
                >
                  {apt ? "Review us on Google" : `Review ${a.name} on Google`} <ExternalLink size={16} />
                </a>
              ))}
              {apt?.airbnbUrl && (
                <a
                  href={apt.airbnbUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackClick("airbnb")}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-text/15 py-4 font-semibold transition hover:border-primary"
                >
                  Review on Airbnb <ExternalLink size={16} />
                </a>
              )}
            </div>

            <form onSubmit={submit} className="mt-6 space-y-2 border-t border-text/10 pt-6">
              <p className="text-sm font-semibold">
                {happy ? `Get ${site.directBookingDiscount}% off your next stay` : "Private feedback to our team"}
              </p>
              {!happy && (
                <textarea className="field" rows={3} required placeholder="What could we have done better?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              )}
              <div className="grid gap-2 sm:grid-cols-2">
                <input className="field" required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="field" type="tel" placeholder="WhatsApp (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <input className="field" required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input tabIndex={-1} autoComplete="off" className="hidden" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} aria-hidden />
              <label className="flex items-center gap-2 text-sm text-text/65">
                <input type="checkbox" checked={form.optIn} onChange={(e) => setForm({ ...form, optIn: e.target.checked })} className="accent-[var(--primary)]" />
                Send me member rates & returning-guest offers
              </label>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button disabled={loading} className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition disabled:opacity-60 ${happy ? "border border-text/15 hover:border-primary" : "bg-primary text-background hover:brightness-110"}`}>
                {loading && <Loader2 size={18} className="animate-spin" />}
                {happy ? "Claim my discount" : "Send feedback"}
              </button>
            </form>
            <button onClick={() => setStep("rate")} className="mt-3 w-full text-sm text-text/50 hover:text-primary">← Change rating</button>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
            <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }} className="mx-auto grid size-20 place-items-center rounded-full bg-primary/15 text-primary">
              <Heart size={36} className="fill-current" />
            </motion.span>
            <h2 className="mt-5 font-display text-3xl font-semibold">Thank you, {form.name.split(" ")[0] || "friend"}!</h2>
            <p className="mt-2 text-text/65">
              {happy ? (
                <>Your code for {site.directBookingDiscount}% off your next direct booking: <span className="rounded-md bg-primary px-2 py-0.5 font-mono font-semibold text-background">{site.directBookingCode}</span></>
              ) : (
                "Our team will review your feedback and get back to you personally."
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
