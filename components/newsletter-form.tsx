"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { submitLead } from "@/lib/leads";

export function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  return state === "done" ? (
    <p className="flex items-center gap-2 font-medium text-accent">
      <Check size={18} /> You&apos;re on the list — watch your inbox.
    </p>
  ) : (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setState("loading");
        const r = await submitLead({ type: "newsletter", email, source });
        if (r.ok) setState("done");
        else {
          setState("error");
          setError(r.error ?? "");
        }
      }}
    >
      <div className="flex gap-2">
        <input className="field" type="email" required placeholder="Your email for member rates" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button disabled={state === "loading"} className="grid shrink-0 place-items-center rounded-2xl bg-primary px-4 text-background transition hover:brightness-110 disabled:opacity-60" aria-label="Subscribe">
          <ArrowRight size={18} />
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </form>
  );
}
