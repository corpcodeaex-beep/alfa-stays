export type LeadType = "booking" | "contact" | "newsletter" | "review-feedback" | "review-click";

export type LeadPayload = {
  type: LeadType;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  apartment?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rating?: number;
  total?: number;
  source?: string;
  /** honeypot — must stay empty */
  company?: string;
};

export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const source =
      payload.source ??
      (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("src") ?? document.referrer ?? "direct" : undefined);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source }),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok ? { ok: true } : { ok: false, error: data.error ?? "Something went wrong" };
  } catch {
    return { ok: false, error: "Network error — please try again" };
  }
}
