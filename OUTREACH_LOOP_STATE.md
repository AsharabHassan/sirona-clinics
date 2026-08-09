# VELURIA Outreach Loop State

> Historical snapshot. Do not use the totals or limits below as current
> campaign state. Run `npm run outreach:status` and follow
> `OUTREACH_IMPLEMENTATION.md`.

Last updated: 6 August 2026

## Automation status

`PAUSED` by user instruction. Do not research, queue, draft, follow up or send
until the clinic-offering personalization model has been designed, reviewed and
explicitly approved, and the user explicitly requests that the automation be
resumed.

The verified clinic route, encrypted recipient attribution, tracked booking
handoff and review-gated controller are implemented locally. The bundled clinic
profile is an internal QA demonstration only; no live clinic has been queued or
sent during implementation.

## Controller configuration

- Timezone: `Europe/London`
- Transmission windows: Monday-Saturday, 09:30 and 14:30 UK time
- Hard lockout: at or after 18:00 UK time
- Sunday: research and audit only; no email or LinkedIn transmission
- Batch size: maximum 10 distinct people
- Programme cap: 200 distinct contacted people
- Approval: required for every batch immediately before transmission
- Idempotency key: campaign + normalized email + normalized LinkedIn lead URL
- Uncertain send result: reconcile; never retry automatically
- Queue priority: eligible `FOLLOW_UP_DUE` before `NEW_OUTREACH`
- Cycle transmission capacity: maximum 10 distinct people across both queues
- Email stages: E1 product, E2 proof, E3 report, E4 consultation

## Programme status

| Metric | Current | Target |
| --- | ---: | ---: |
| Distinct people contacted | 10 | 200 |
| Qualified consultation bookings attributable to outreach | 0 | — |
| Genuine email replies | 0 | — |
| LinkedIn replies | 0 | — |
| LinkedIn invitations accepted | 0 of 9 | — |
| Verified landing-page clicks | 0 | — |
| Hard bounces attributable to the personalised pilot | 0 confirmed | 0 |
| Unsubscribes attributable to the personalised pilot | 0 confirmed | 0 |

Batch 02 and Batch 03 were prepared but not sent because final identity,
mailbox and/or GoHighLevel suppression gates were incomplete.

## Current offer

- Primary offer: PBSerum VELURIA professional range plus a clinic-branded AI
  patient funnel.
- Primary CTA: free 20-minute online clinic consultation.
- Landing page: `https://demo.sironaaesthetics.agency/`
- Booking page:
  `https://link.sironaaesthetics.co.uk/widget/bookings/veluria-clinic-growth-map`
- GoHighLevel calendar: `VELURIA Clinic Growth Map`
  (`Tsy3vyvGTiInsley6Egm`), active and verified on 6 August 2026.
- Published booking suppression workflow: `VELURIA | Booking Suppression & Handoff`
  (`c6231255-4d0b-4ccd-b815-c38b025a29d2`). A booking in the dedicated
  calendar adds the existing `consultation | appointment booked` tag.

## Funnel counters

| State | Count |
| --- | ---: |
| E1 product introduction sent | 10 baseline webinar-era contacts; reclassification pending |
| E2 real result / AI proof sent | 0 confirmed |
| E3 sample report sent | 0 confirmed |
| E4 free consultation sent | 0 confirmed |
| Consultation booked from outreach | 0 |

Before adding a baseline contact to a new follow-up stage, re-audit the actual
message previously sent and confirm that the proposed stage does not duplicate
its content.

## Current hypothesis

The fixed webinar created too much timing friction for a cold audience. A
private 20-minute consultation should reduce commitment and let the clinic
choose its own time. This is a hypothesis, not yet a proven improvement.

## Next experiment

- Cohort size: 20 delivered contacts, prepared as two review batches of 10.
- Constant: qualified UK aesthetic-clinic decision-makers, VELURIA product-first
  positioning, one personalised clinic signal and the same landing page.
- Variable: replace the webinar invitation with a free private consultation.
- Success measure: landing clicks, positive replies and booked consultations.
- Do not treat opens as success.

## Cycle ledger

| Cycle | Prepared | Approved | Contacted | Angle | Clicks | Positive replies | Bookings | Holds / safety signals | Decision |
| --- | ---: | ---: | ---: | --- | ---: | ---: | ---: | --- | --- |
| Baseline webinar pilot | 10 | 10 | 10 | Webinar + personalised AI funnel | 0 verified | 0 | 0 | 9 LinkedIn invitations still pending | Retire webinar CTA |

## Required per-person ledger fields

Each future cycle must record: cohort, CSV rank, CRM Contact ID, clinic, person,
role, official evidence URL, Sales Navigator account and lead URLs, connection
state, SalesQL status, selected email, GoHighLevel suppression state,
personalisation source, landing URL, final email, final LinkedIn copy, approval,
send timestamp, delivery, bounce, unsubscribe, click, reply, acceptance,
consultation booking and hold reason.
