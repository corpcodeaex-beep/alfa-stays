"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { apartments } from "@/lib/apartments";
import { submitLead } from "@/lib/leads";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", apartment: "", message: "", company: "" });
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="rounded-[2rem] border border-text/10 bg-background/80 p-8 shadow-2xl shadow-black/5 backdrop-blur-xl">
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid h-full place-items-center py-16 text-center">
            <div>
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent/15 text-accent"><Check size={30} /></span>
              <h2 className="mt-4 font-display text-3xl font-semibold">Message received</h2>
              <p className="mt-2 text-text/65">We&apos;ll be in touch shortly.</p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0 }}
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setState("loading");
              setError("");
              const r = await submitLead({ type: "contact", ...form });
              if (r.ok) setState("done");
              else {
                setState("idle");
                setError(r.error ?? "");
              }
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="field" required placeholder="Name" value={form.name} onChange={set("name")} />
              <input className="field" type="tel" placeholder="Phone / WhatsApp" value={form.phone} onChange={set("phone")} />
            </div>
            <input className="field" required type="email" placeholder="Email" value={form.email} onChange={set("email")} />
            <select className="field" value={form.apartment} onChange={set("apartment")}>
              <option value="">Interested in… (optional)</option>
              {apartments.map((a) => <option key={a.slug} value={a.name}>{a.name}</option>)}
              <option value="Long stay / corporate">Long stay / corporate</option>
            </select>
            <textarea className="field" required rows={5} placeholder="Tell us about your trip" value={form.message} onChange={set("message")} />
            <input tabIndex={-1} autoComplete="off" className="hidden" value={form.company} onChange={set("company")} aria-hidden />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button disabled={state === "loading"} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-background transition hover:brightness-110 disabled:opacity-60">
              {state === "loading" && <Loader2 size={18} className="animate-spin" />} Send message
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
