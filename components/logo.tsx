// Alfa Stays logo — vector recreation of the brand mark (skyline line-art).

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="190 255 710 300" className={className} fill="none" stroke="currentColor" strokeWidth={14} strokeLinejoin="miter" aria-hidden>
      <path d="M202 538H404V425L518 380L596 410V538H518V330L668 268L716 290V538H884" />
      <path d="M666 280V545" />
    </svg>
  );
}

export function Logo({ className, full = false }: { className?: string; full?: boolean }) {
  if (!full) {
    return (
      <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
        <LogoMark className="h-6 w-auto" />
        <span className="text-[0.95rem] font-medium tracking-[0.28em]">ALFA STAYS</span>
      </span>
    );
  }
  return (
    <span className={`inline-flex flex-col items-center ${className ?? ""}`}>
      <LogoMark className="h-16 w-auto" />
      <span className="mt-3 text-3xl font-light tracking-[0.3em]">ALFA STAYS</span>
      <span className="mt-2 flex w-full items-center gap-3 opacity-80">
        <span className="h-px flex-1 bg-current" />
        <svg viewBox="0 0 10 10" className="size-3 fill-current"><path d="M5 0Q5.6 4.4 10 5Q5.6 5.6 5 10Q4.4 5.6 0 5Q4.4 4.4 5 0Z" /></svg>
        <span className="h-px flex-1 bg-current" />
      </span>
      <span className="mt-2 text-[0.65rem] tracking-[0.45em]">PREMIUM LUXURY STAYS</span>
    </span>
  );
}
