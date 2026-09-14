"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/apartments", label: "Apartments" },
  { href: "/review", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2 transition-all duration-500 ${
          scrolled ? "glass shadow-lg shadow-black/5" : "border border-transparent"
        }`}
      >
        <Link href="/" aria-label={site.name} className="transition hover:text-primary">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link href={l.href} className="relative px-4 py-2 text-sm font-medium">
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-text/[0.07]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/apartments"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-background transition hover:brightness-110 sm:inline-block"
          >
            Book now
          </Link>
          <button className="grid size-10 place-items-center md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="glass mx-auto mt-2 max-w-6xl rounded-3xl p-3 md:hidden"
          >
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 font-medium hover:bg-text/5">
                {l.label}
              </Link>
            ))}
            <Link href="/apartments" onClick={() => setOpen(false)} className="mt-2 block rounded-2xl bg-primary px-4 py-3 text-center font-semibold text-background">
              Book now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
