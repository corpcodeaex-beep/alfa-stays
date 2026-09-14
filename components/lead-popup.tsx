"use client";

import { AnimatePresence, motion } from "motion/react";
import { Gift, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { NewsletterForm } from "./newsletter-form";

const KEY = "lead-popup-dismissed";

/** Discount popup shown once after 25s or on exit-intent (desktop). Hidden on the QR review flow. */
export function LeadPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/review") || pathname.startsWith("/qr")) return;
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {}
    const show = () => setOpen(true);
    const timer = setTimeout(show, 25000);
    const onLeave = (e: MouseEvent) => e.clientY < 5 && show();
    document.addEventListener("mouseout", onLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [pathname]);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative w-full max-w-md rounded-[2rem] bg-background p-8 shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <button onClick={close} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full hover:bg-text/5" aria-label="Close">
              <X size={18} />
            </button>
            <span className="grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary">
              <Gift size={26} />
            </span>
            <h3 className="mt-5 font-display text-3xl font-semibold">Get {site.directBookingDiscount}% off your first stay</h3>
            <p className="mt-2 text-text/65">Join our guest list for member-only rates and last-minute deals. No spam, ever.</p>
            <div className="mt-6">
              <NewsletterForm source="popup" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
