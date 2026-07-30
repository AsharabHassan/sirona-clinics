# PBSerum VELURIA for Clinics

A conversion-focused Sirona Aesthetics campaign page for UK clinics. The page
combines:

- a clinic-personalised landing experience;
- a real VELURIA before-and-after case study from Aesthetics Central;
- a main CTA that opens the consented camera/upload experience immediately;
- an instant branded patient preview and clinic-growth report;
- an optional live, non-diagnostic AI skin visualisation;
- a clinic growth report comparing product-only promotion with the connected
  VELURIA + AI patient journey;
- a transparent clinic scenario planner;
- repeated registration paths to the 3 August 2026 VELURIA webinar; and
- a secondary private-walkthrough lead form connected to GoHighLevel.

Built with Next.js 15, React 19, TypeScript and Tailwind CSS.

## Personalised outreach links

Pass a public clinic name in the `clinic` query parameter:

```text
https://your-domain.example/?clinic=Harley%20Street%20Skin%20Studio
```

Do not place a recipient's name, email address or other personal data in the
URL. Without the parameter, visitors can enter their own clinic name before
opening the preview.

## Local development

```bash
npm install
npm run dev
```

Run the production check with:

```bash
npm run build
```

## Environment

See `.env.local.example` for the complete template.

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Cosmetic visible-skin analysis for the optional live preview. |
| `OPENAI_API_KEY` | AI-generated visualisation for the optional live preview. |
| `GHL_WEBHOOK_URL` | Sirona GoHighLevel webhook used by the private-walkthrough form. |
| `NEXT_PUBLIC_CALENDAR_URL` | Optional private Sirona walkthrough calendar. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional campaign attribution. |

The webinar registration URL is defined in `app/page.tsx`.

## Production safeguards

- The Aesthetics Central case study can be explored without an AI request.
- A visitor must explicitly consent before adding a photo.
- Camera and photo-upload controls stay disabled until consent is recorded.
- Live AI routes enforce request-size checks and lightweight per-visitor limits.
- The UI describes outputs as illustrative, cosmetic and non-diagnostic.
- The scenario planner exposes its assumptions and does not present a forecast.

For a multi-instance production deployment, replace the in-memory AI route
limiter with a shared rate-limit store and complete a documented privacy review
of every image-processing provider before sending campaign traffic.
