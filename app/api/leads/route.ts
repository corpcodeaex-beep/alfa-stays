import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/leads";
import { formatPrice, site, whatsappLink } from "@/lib/site";

/**
 * Lead endpoint for every form: booking requests, contact, newsletter/popup,
 * review feedback and review-link clicks.
 *
 * No email addresses live in code — delivery is configured with env vars only:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD — the mailbox that sends the emails
 *   SMTP_USE_TLS      — "true" to require STARTTLS (port 587); port 465 always uses TLS
 *   SMTP_FROM_EMAIL   — sender address (defaults to SMTP_USER)
 *   SMTP_FROM_NAME    — sender display name (defaults to site.name)
 *   LEAD_NOTIFY_EMAIL — inbox(es) that receive leads, comma-separated
 *   LEAD_WEBHOOK_URL  — optional: also POST each lead as JSON (Google Sheets, Zapier, CRM…)
 */

const TYPES = new Set(["booking", "contact", "newsletter", "review-feedback", "review-click"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v: unknown, max = 2000) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

type Lead = ReturnType<typeof toLead>;

function toLead(body: Partial<LeadPayload>, req: Request) {
  return {
    type: body.type as LeadPayload["type"],
    name: clean(body.name, 120),
    email: clean(body.email, 254),
    phone: clean(body.phone, 40),
    message: clean(body.message, 5000),
    apartment: clean(body.apartment, 80),
    checkIn: clean(body.checkIn, 20),
    checkOut: clean(body.checkOut, 20),
    guests: num(body.guests),
    rating: num(body.rating),
    total: num(body.total),
    source: clean(body.source, 300),
    createdAt: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") ?? undefined,
  };
}

export async function POST(req: Request) {
  let body: Partial<LeadPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Bots fill hidden fields — pretend success so they get no signal.
  if (body.company) return NextResponse.json({ ok: true });

  if (!body.type || !TYPES.has(body.type)) {
    return NextResponse.json({ error: "Invalid lead type" }, { status: 400 });
  }

  const lead = toLead(body, req);
  if (lead.type !== "review-click" && (!lead.email || !EMAIL_RE.test(lead.email))) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  }

  // Always visible in the terminal / Vercel → Logs.
  console.log("[lead]", JSON.stringify(lead));

  const [webhookOk, emailOk] = await Promise.all([sendWebhook(lead), sendEmails(lead)]);

  // Only fail when a channel is configured and every configured channel failed.
  if (webhookOk === false && emailOk !== true || emailOk === false && webhookOk !== true) {
    return NextResponse.json(
      { error: `We couldn't send your request. Please message us on WhatsApp at ${site.phone}.` },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}

/* ───────────────────────── delivery ───────────────────────── */

/** true = delivered, false = configured but failed, null = not configured */
async function sendWebhook(lead: Lead): Promise<boolean | null> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return null;
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
    if (!res.ok) throw new Error(`status ${res.status}`);
    return true;
  } catch (error) {
    console.error("[lead] webhook failed", error);
    return false;
  }
}

async function sendEmails(lead: Lead): Promise<boolean | null> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, LEAD_NOTIFY_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !LEAD_NOTIFY_EMAIL) {
    if (process.env.NODE_ENV === "production") console.warn("[lead] SMTP or LEAD_NOTIFY_EMAIL not set — lead only logged");
    return null;
  }
  if (lead.type === "review-click") return null; // tracked in logs/webhook only

  const port = Number(SMTP_PORT) || 587;
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: process.env.SMTP_USE_TLS === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
  const from = { name: process.env.SMTP_FROM_NAME || site.name, address: process.env.SMTP_FROM_EMAIL || SMTP_USER };
  const team = LEAD_NOTIFY_EMAIL.split(",").map((s) => s.trim()).filter(Boolean);

  // Team notification — the one that must succeed.
  try {
    await transport.sendMail({
      from,
      to: team,
      replyTo: lead.email ? { name: lead.name ?? lead.email, address: lead.email } : undefined,
      subject: notificationSubject(lead),
      html: notificationHtml(lead),
    });
  } catch (error) {
    console.error("[lead] notification email failed", error);
    return false;
  }

  // Guest confirmation — best effort; the lead already reached the team.
  if (lead.email) {
    try {
      const conf = confirmation(lead);
      await transport.sendMail({ from, to: lead.email, replyTo: team[0], subject: conf.subject, html: conf.html });
    } catch (error) {
      console.error("[lead] confirmation email failed", error);
    }
  }
  return true;
}

/* ───────────────────────── email templates ───────────────────────── */
// Email clients ignore <style> and modern CSS, so layout is tables with inline styles.
// Colours mirror the Realtime Colors palette in globals.css.

const c = { canvas: "#f8f6f1", card: "#ffffff", inset: "#f3efe6", line: "#e8e1d4", fg: "#12100c", muted: "#5a544a", dim: "#8a8377", gold: "#a8823f", ink: "#0a0908", green: "#25D366" };
const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const serif = "Georgia,'Times New Roman',serif";

function esc(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);
}

const stars = (n?: number) => (n ? `${"★".repeat(n)}${"☆".repeat(5 - n)}` : "");
const karachiTime = (iso: string) => new Date(iso).toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" });
const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("0") ? `92${d.slice(1)}` : d;
};
const nights = (a?: string, b?: string) => (a && b ? Math.max(0, Math.round((+new Date(b) - +new Date(a)) / 86400000)) : 0);
const firstName = (lead: Lead) => esc((lead.name ?? "there").split(" ")[0]);

function layout({ preheader, badge, body }: { preheader: string; badge: string; body: string }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:${c.canvas}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.canvas}">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
        <tr><td style="background:${c.ink};border-radius:14px 14px 0 0;padding:26px 32px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-family:${font};color:#f3eee5">
              <div style="font-size:18px;font-weight:500;letter-spacing:6px">ALFA STAYS</div>
              <div style="font-size:9px;letter-spacing:4px;color:${c.gold};margin-top:6px">PREMIUM LUXURY STAYS</div>
            </td>
            <td align="right" style="font-family:${font};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${c.gold}">● ${badge}</td>
          </tr></table>
        </td></tr>
        <tr><td style="background:${c.card};border:1px solid ${c.line};border-top:0;border-radius:0 0 14px 14px;padding:36px 32px">${body}</td></tr>
        <tr><td align="center" style="padding:24px 16px 0;font-family:${font};font-size:12px;line-height:1.8;color:${c.dim}">
          <a href="${site.url}" style="color:${c.fg};text-decoration:none;font-weight:600">${site.name}</a> · Bahria Town, Lahore<br>
          <a href="tel:${site.phone.replace(/[^+\d]/g, "")}" style="color:${c.dim};text-decoration:none">${site.phone}</a> &nbsp;·&nbsp;
          <a href="https://wa.me/${site.whatsapp}" style="color:${c.dim};text-decoration:none">WhatsApp</a> &nbsp;·&nbsp;
          <a href="${site.socials.instagram}" style="color:${c.dim};text-decoration:none">Instagram</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

const h1 = (text: string) => `<h1 style="margin:0 0 10px;font-family:${serif};font-size:26px;line-height:1.25;font-weight:600;color:${c.fg}">${text}</h1>`;
const p = (text: string) => `<p style="margin:0 0 24px;font-family:${font};font-size:15px;line-height:1.65;color:${c.muted}">${text}</p>`;
const label = (text: string) => `<div style="font-family:${font};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${c.dim};margin:0 0 10px">${text}</div>`;
const quote = (text: string) =>
  `<div style="background:${c.inset};border-left:3px solid ${c.gold};border-radius:6px;padding:16px 18px;margin:0 0 24px;font-family:${font};font-size:14px;line-height:1.65;color:${c.fg};white-space:pre-wrap">${esc(text)}</div>`;

function rows(items: [string, string | undefined][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${c.line};margin:0 0 24px">
    ${items
      .filter(([, v]) => v)
      .map(
        ([k, v]) => `<tr>
          <td style="padding:10px 16px 10px 0;border-bottom:1px solid ${c.line};font-family:${font};font-size:13px;color:${c.dim};width:120px;vertical-align:top">${k}</td>
          <td style="padding:10px 0;border-bottom:1px solid ${c.line};font-family:${font};font-size:14px;color:${c.fg}">${v}</td>
        </tr>`,
      )
      .join("")}
  </table>`;
}

function buttons(items: { href: string; text: string; color: string; textColor?: string }[]) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 0"><tr>
    ${items
      .map(
        (b) => `<td style="padding:0 10px 10px 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${b.color};border-radius:10px">
          <a href="${b.href}" style="display:inline-block;padding:13px 22px;font-family:${font};font-size:14px;font-weight:600;color:${b.textColor ?? "#ffffff"};text-decoration:none">${b.text}</a>
        </td></tr></table></td>`,
      )
      .join("")}
  </tr></table>`;
}

function stayRows(lead: Lead) {
  const n = nights(lead.checkIn, lead.checkOut);
  return rows([
    ["Apartment", lead.apartment && esc(lead.apartment)],
    ["Check-in", lead.checkIn && esc(lead.checkIn)],
    ["Check-out", lead.checkOut && esc(lead.checkOut)],
    ["Nights", n ? String(n) : undefined],
    ["Guests", lead.guests ? String(lead.guests) : undefined],
    ["Est. total", lead.total ? formatPrice(lead.total) : undefined],
  ]);
}

function notificationSubject(lead: Lead) {
  const who = lead.name ?? lead.email ?? "guest";
  switch (lead.type) {
    case "booking":
      return `New booking request · ${lead.apartment ?? site.name} · ${lead.checkIn} → ${lead.checkOut} · ${who}`;
    case "review-feedback":
      return `${lead.rating ?? "?"}★ guest feedback · ${lead.apartment ?? site.name} · ${who}`;
    case "newsletter":
      return `New guest-list signup · ${who}`;
    default:
      return `New enquiry · ${who}${lead.apartment ? ` · ${lead.apartment}` : ""}`;
  }
}

function notificationHtml(lead: Lead) {
  const titles: Record<string, string> = {
    booking: "New booking request",
    contact: "New enquiry",
    newsletter: "New guest-list signup",
    "review-feedback": "New guest feedback",
  };
  const actions = [
    lead.phone && { href: `https://wa.me/${waNumber(lead.phone)}?text=${encodeURIComponent(`Hi ${lead.name?.split(" ")[0] ?? ""}, this is ${site.name} about your request.`)}`, text: "WhatsApp guest", color: c.green },
    lead.email && { href: `mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(`Re: your ${site.name} request`)}`, text: "Reply by email", color: c.ink },
  ].filter(Boolean) as { href: string; text: string; color: string }[];

  const body = `
    ${h1(esc(lead.name ?? lead.email ?? "Guest"))}
    <p style="margin:0 0 26px;font-family:${font};font-size:14px;color:${c.muted}">
      ${lead.email ? `<a href="mailto:${esc(lead.email)}" style="color:${c.gold};text-decoration:none">${esc(lead.email)}</a>` : ""}
      ${lead.phone ? ` &nbsp;·&nbsp; ${esc(lead.phone)}` : ""}
    </p>
    ${lead.type === "booking" ? `${label("Stay")}${stayRows(lead)}` : ""}
    ${lead.rating ? `${label("Rating")}<div style="font-size:22px;color:${c.gold};margin:0 0 24px">${stars(lead.rating)}</div>` : ""}
    ${lead.message ? `${label("Message")}${quote(lead.message)}` : ""}
    ${label("Details")}
    ${rows([
      ["Type", titles[lead.type] ?? lead.type],
      ["Apartment", lead.type !== "booking" && lead.apartment ? esc(lead.apartment) : undefined],
      ["Source", lead.source && `<span style="font-size:12px;color:${c.muted}">${esc(lead.source)}</span>`],
      ["Received", karachiTime(lead.createdAt)],
    ])}
    ${actions.length ? buttons(actions) : ""}
    <p style="margin:10px 0 0;font-family:${font};font-size:12px;color:${c.dim}">Hitting Reply goes straight to the guest.</p>
  `;
  return layout({ preheader: notificationSubject(lead), badge: titles[lead.type] ?? "New lead", body });
}

function confirmation(lead: Lead): { subject: string; html: string } {
  const wa = { href: whatsappLink(`Hi ${site.name}! I just sent a ${lead.type === "booking" ? "booking request" : "message"} on your website.`), text: "Chat on WhatsApp", color: c.green };
  const browse = { href: `${site.url}/apartments`, text: "Browse apartments", color: c.ink };
  const code = `<div style="display:inline-block;margin:0 0 24px;padding:12px 20px;border:1px dashed ${c.gold};border-radius:10px;font-family:${font};font-size:20px;font-weight:700;letter-spacing:3px;color:${c.fg}">${site.directBookingCode}</div>`;

  switch (lead.type) {
    case "booking":
      return {
        subject: `We received your booking request — ${lead.apartment ?? site.name}`,
        html: layout({
          preheader: "We're checking availability and will confirm shortly.",
          badge: "Request received",
          body: `${h1(`Thanks, ${firstName(lead)}. Your request is in.`)}
            ${p("We're checking availability now and will confirm your stay and payment details shortly. You haven't been charged anything yet.")}
            ${label("Your request")}${stayRows(lead)}
            ${lead.message ? `${label("Your note")}${quote(lead.message)}` : ""}
            ${p("Want a faster reply? Message us on WhatsApp — a real person answers.")}
            ${buttons([wa])}`,
        }),
      };
    case "newsletter":
      return {
        subject: `Welcome to ${site.name} — your ${site.directBookingDiscount}% code inside`,
        html: layout({
          preheader: `Your ${site.directBookingDiscount}% direct-booking code is inside.`,
          badge: "Welcome",
          body: `${h1("Welcome to the guest list.")}
            ${p(`You'll be first to hear about member rates and last-minute availability. Here's ${site.directBookingDiscount}% off your first direct booking:`)}
            ${code}
            ${p("Enter it in the promo box when you request a booking on our website.")}
            ${buttons([browse])}`,
        }),
      };
    case "review-feedback": {
      const happy = (lead.rating ?? 0) >= 4;
      return {
        subject: happy ? `Thank you for staying with ${site.name}` : `Thanks for your feedback — ${site.name}`,
        html: layout({
          preheader: happy ? "A little thank-you for your next stay." : "Our team will get back to you personally.",
          badge: "Thank you",
          body: happy
            ? `${h1(`Thank you, ${firstName(lead)}!`)}
               ${p(`We're so glad you enjoyed your stay. As a thank-you, here's ${site.directBookingDiscount}% off your next direct booking:`)}
               ${code}
               ${buttons([browse])}`
            : `${h1(`Thank you, ${firstName(lead)}.`)}
               ${p("We're sorry your stay wasn't perfect. Our team reads every message and will get back to you personally to make it right.")}
               ${lead.message ? `${label("What you told us")}${quote(lead.message)}` : ""}
               ${buttons([wa])}`,
        }),
      };
    }
    default:
      return {
        subject: `We received your message — ${site.name}`,
        html: layout({
          preheader: "We'll get back to you shortly.",
          badge: "Message received",
          body: `${h1(`Thanks, ${firstName(lead)}. We have it.`)}
            ${p("A member of our team will get back to you shortly. For anything urgent, WhatsApp is the fastest way to reach us.")}
            ${lead.message ? `${label("What you sent")}${quote(lead.message)}` : ""}
            ${buttons([wa, browse])}`,
        }),
      };
  }
}
