import { NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/leads";
import { site } from "@/lib/site";

const TYPES = new Set(["booking", "contact", "newsletter", "review-feedback", "review-click"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

export async function POST(req: Request) {
  let body: Partial<LeadPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Bots fill hidden fields — pretend success.
  if (body.company) return NextResponse.json({ ok: true });

  if (!body.type || !TYPES.has(body.type)) {
    return NextResponse.json({ error: "Invalid lead type" }, { status: 400 });
  }

  const lead = {
    type: body.type,
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    message: clean(body.message),
    apartment: clean(body.apartment, 80),
    checkIn: clean(body.checkIn, 20),
    checkOut: clean(body.checkOut, 20),
    guests: typeof body.guests === "number" ? body.guests : undefined,
    rating: typeof body.rating === "number" ? body.rating : undefined,
    total: typeof body.total === "number" ? body.total : undefined,
    source: clean(body.source, 300),
    createdAt: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") ?? undefined,
  };

  const needsContact = lead.type !== "review-click";
  if (needsContact && (!lead.email || !EMAIL_RE.test(lead.email))) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  }

  const results = await Promise.allSettled([sendWebhook(lead), sendEmail(lead)]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value);

  // Always visible in Vercel → Logs, even if no integration is configured.
  console.log("[lead]", JSON.stringify(lead));
  if (!delivered && process.env.NODE_ENV === "production") {
    console.warn("[lead] No LEAD_WEBHOOK_URL or RESEND_API_KEY configured — lead only logged.");
  }

  return NextResponse.json({ ok: true });
}

/** POST the lead to any webhook: Google Sheets (Apps Script), Zapier, Make, n8n, a CRM… */
async function sendWebhook(lead: Record<string, unknown>) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
  return true;
}

/** Email notification via Resend (https://resend.com). */
async function sendEmail(lead: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) return false;
  if (lead.type === "review-click") return false; // don't spam inbox with clicks

  const rows = Object.entries(lead)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `<tr><td style="padding:4px 12px;color:#888">${k}</td><td style="padding:4px 12px">${escapeHtml(String(v))}</td></tr>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL ?? `${site.name} <onboarding@resend.dev>`,
      to: [to],
      reply_to: lead.email,
      subject: `New ${lead.type} lead${lead.apartment ? ` · ${lead.apartment}` : ""}${lead.name ? ` · ${lead.name}` : ""}`,
      html: `<h2>New ${lead.type} lead</h2><table>${rows}</table>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
  return true;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
