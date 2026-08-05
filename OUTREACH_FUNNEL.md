# VELURIA Consultation Outreach Funnel

## End goal

Move a qualified UK clinic decision-maker from cold product awareness to a
booked free 20-minute online consultation with Sirona Aesthetics.

The sequence must make the value clear in this order:

1. What PBSerum VELURIA is and why an enzyme-led professional range may be
   relevant to the clinic.
2. A real VELURIA before-and-after result and the clinic-branded AI experience.
3. A sample clinic-growth report showing the difference between product-only
   promotion and the connected patient funnel.
4. A private conversation about range fit, training and implementation.

## Eligibility

Previous CRM conversation or prior marketing history does not automatically
exclude a person. A person may enter or continue the funnel when all current
identity, mailbox and suppression gates pass and none of these stop signals is
present:

- unsubscribe;
- explicit request to stop or not be contacted;
- clear negative reply such as not interested or not relevant;
- email or channel DND;
- spam complaint or provider suppression;
- hard bounce, invalid or unusable mailbox;
- unresolved identity, role, clinic or LinkedIn conflict; or
- active duplicate sequence for the same person.

Do not refer to old conversations in the copy. Re-audit eligibility immediately
before every follow-up because a person may unsubscribe or change status after
the first message.

## Links

For every link, URL-encode the public clinic trading name. Never put a person's
name, email address, phone number or another private identifier in the URL.

- Campaign overview:
  `https://demo.sironaaesthetics.agency/r/{OPAQUE_TOKEN}/email-1`
- Real result and AI before-and-after experience:
  `https://demo.sironaaesthetics.agency/r/{OPAQUE_TOKEN}/email-2`
- Sample clinic-growth report:
  `https://demo.sironaaesthetics.agency/r/{OPAQUE_TOKEN}/email-3`
- Scenario planner:
  `https://demo.sironaaesthetics.agency/clinic/{VERIFIED_SLUG}?r={OPAQUE_TOKEN}&stage=roi`
- Free consultation:
  `https://demo.sironaaesthetics.agency/book/{OPAQUE_TOKEN}/email-4`

## Email sequence

Every email is written individually from current clinic evidence. The stage
defines the job of the message, not reusable final prose.

### E1: Product relevance

- Timing: initial cleared outreach.
- Explain VELURIA as a professional enzyme-based bioremodelling range in plain
  language.
- Connect one selected product pathway or treatment-story opportunity to a
  verified clinic service.
- Link to the personalised campaign overview.
- Ask a low-friction question about relevance, not for an immediate purchase.

### E2: Real result and interactive proof

- Timing: two business days after E1 when there is no reply or stop signal.
- Refer to the specific unanswered clinical or commercial question from E1.
- Share the real VELURIA before-and-after and clinic-branded AI experience.
- Link directly to `view=demo`.
- Explain that the AI layer helps a clinic start a patient conversation around
  the professional range.

### E3: Sample clinic-growth report

- Timing: three business days after E2 when there is no reply or stop signal.
- Share the personalised sample report using `view=report`.
- Summarise the difference between product-only promotion and a connected
  attract, engage, follow-up and consult journey.
- Mention that results depend on the clinic, audience, offer and follow-up; do
  not promise patients, bookings or revenue.

### E4: Free consultation

- Timing: four business days after E3 when there is no reply or stop signal.
- Keep it short and acknowledge that this is the final scheduled email in the
  sequence.
- Offer the free 20-minute consultation to discuss product fit, training and the
  funnel.
- Use the direct booking link.
- If there is no response, close the automated email sequence. Do not restart it
  without a new reason and fresh approval.

Every email uses `hello@sironaaesthetics.co.uk`, sender name
`Jacqui Shand | Sirona Aesthetics`, one primary link and GoHighLevel's existing
unsubscribe footer.

## LinkedIn sequence

- Cold and not connected: use a personalised Sales Navigator InMail first.
- Send a connection invitation only after engagement or when a genuine shared
  context has been recorded.
- Pending: no action.
- Connected: send a concise product-first message. If unanswered, one proof
  follow-up with the personalised `view=demo` link and one consultation follow-up
  with the sample-report or booking link.
- A longer conversational sequence, including a personalised video, is allowed
  only after genuine engagement. Do not send seven scheduled messages to a
  silent connection.
- Stop immediately for a negative reply, request to stop, profile conflict or
  LinkedIn warning.

## Queue and capacity

The loop maintains two queues:

1. `FOLLOW_UP_DUE`, ordered by due time and funnel stage.
2. `NEW_OUTREACH`, ordered by qualification score and source rank.

Follow-ups are processed first. A cycle may transmit to no more than 10 distinct
people across both queues. Unused capacity may be filled with new outreach.
Follow-up transmissions do not increase the 200-person unique-contact counter,
but they do increase channel and stage totals.

Every transmission remains subject to fresh approval, the UK-time gate and the
Sunday lockout in `OUTREACH_LOOP.md`.

## Conversion states

`COLD -> PRODUCT_INTRODUCED -> PROOF_VIEWED -> REPORT_VIEWED -> CONSULTATION_OFFERED -> CONSULTATION_BOOKED`

Alternative terminal states are:

- `POSITIVE_REPLY_REQUIRES_HUMAN`
- `NOT_INTERESTED`
- `UNSUBSCRIBED`
- `BOUNCED`
- `SUPPRESSED`
- `IDENTITY_HOLD`
- `SEQUENCE_COMPLETE_NO_RESPONSE`

The end goal is `CONSULTATION_BOOKED`, but no stage may make a guaranteed
clinical, patient-volume or revenue claim.
