# Alfastays — apartment booking, QR reviews & lead generation

Next.js 16 · React 19 · Three.js (React Three Fiber + drei) · Motion (Motion-Primitives style) · Haikei SVGs · Realtime Colors palette · Tailwind v4

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Pages

| Route | What it does |
| --- | --- |
| `/` | 3D animated hero (apartment tower, floating key, orbs), stats, featured stays, features, testimonials marquee, CTA |
| `/apartments` | All apartments with 3D tilt cards |
| `/apartments/[slug]` | Gallery, amenities, booking widget (dates → price calc → promo code → request form, WhatsApp, Airbnb link) |
| `/review?apt=slug&src=tag` | **QR landing page**: star rating → public Google/Airbnb review links + private feedback / discount lead form |
| `/qr` | **Host tool** (not indexed): generate per-apartment, per-placement QR codes, download PNG or print a card |
| `/contact` | Contact form + channels |

Leads (bookings, contact, newsletter, popup, review feedback, review-link clicks) all go to `POST /api/leads`, tagged with the `src` from the QR code.

## Customize

- **Brand, phone, WhatsApp, review links, promo code** → `lib/site.ts`
- **Apartments, prices, photos, Airbnb URLs** → `lib/apartments.ts` (put your own photos in `public/apartments/`)
- **Colors** → export from [realtimecolors.com](https://www.realtimecolors.com) and paste the 5 CSS variables into `app/globals.css` (light + `.dark`). The 3D scene picks them up automatically.
- **Backgrounds** → `components/haikei.tsx` — replace path data with your own [haikei.app](https://haikei.app) exports (keep `fill="var(--primary)"` etc.)
- **Animations** → `components/motion-primitives/`

## Receiving leads

Set env vars in Vercel → Project → Settings → Environment Variables (see `.env.example`):

- `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` (+ `LEAD_FROM_EMAIL` on a verified domain) → email per lead
- `LEAD_WEBHOOK_URL` → JSON POST to Google Sheets (Apps Script), Zapier, Make, n8n or your CRM

Without either, leads are only printed in Vercel → Logs.

### Google Sheets in 2 minutes
Sheet → Extensions → Apps Script, paste, Deploy → Web app (access: Anyone), copy URL into `LEAD_WEBHOOK_URL`:

```js
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sh = SpreadsheetApp.getActiveSheet();
  const cols = ["createdAt","type","name","email","phone","apartment","checkIn","checkOut","guests","total","rating","message","source"];
  if (sh.getLastRow() === 0) sh.appendRow(cols);
  sh.appendRow(cols.map((c) => d[c] ?? ""));
  return ContentService.createTextOutput("ok");
}
```

## Deploy to Vercel

```bash
npx vercel          # or push to GitHub and import the repo at vercel.com/new
```

Set `NEXT_PUBLIC_SITE_URL` to your production domain.

> The review page shows the public review links to **every** guest, whatever rating they give. Google and Airbnb don't allow "review gating", which means only sending happy guests to leave a public review.
