# VELURIA Outreach Learning Loop

## Objective

Build a review-gated campaign to reach 200 distinct, qualified UK clinic
decision-makers and progress eligible people through the follow-up funnel in
`OUTREACH_FUNNEL.md`. Each five-hour cycle prepares a maximum of 10 distinct
people across due follow-ups and new prospect packets around one offer:

> Explore the clinic-branded VELURIA AI patient funnel, then book a free
> 20-minute online consultation with Sirona Aesthetics.

The landing route is:
`https://demo.sironaaesthetics.agency/r/{OPAQUE_TOKEN}/{STAGE}`

The booking route is:
`https://demo.sironaaesthetics.agency/book/{OPAQUE_TOKEN}/{STAGE}`

## Non-negotiable gates

- Work only in Sirona Aesthetics GoHighLevel location
  `OdylxFk47CSXq3mt6RoF`. Never access or modify MEDfacials.
- Previous contact history is not an automatic exclusion. Continue only when
  the person has not unsubscribed, opted out, clearly declined, entered DND or
  triggered another current stop signal in `OUTREACH_FUNNEL.md`.
- Never run two active sequences for the same person or repeat a completed
  funnel stage.
- Require the same current person across the clinic, LinkedIn/Sales Navigator,
  SalesQL and the email address.
- Prefer a verified named work email. Hold personal or generic addresses for
  explicit approval.
- Hold DND, unsubscribed, suppressed, invalid, bounced, conflicting or
  uncertain records.
- Use one truthful clinic-specific observation with a recorded source URL.
- Use one booking link, the authenticated sender
  `hello@sironaaesthetics.co.uk`, the sender name
  `Jacqui Shand | Sirona Aesthetics`, and GoHighLevel's unsubscribe footer.
- Do not mention the failed webinar or any unverified previous interaction.
- Do not use em dashes. Run a final grammar and punctuation check.
- LinkedIn actions remain manual and one by one. Never use bulk invitations,
  automated scraping or automatic LinkedIn interaction.
- Stop for a LinkedIn warning, location mismatch, hard bounce, suppression
  conflict, broken link or uncertain identity.

## Five-hour cycle

1. Read `OUTREACH_MEMORY.md`, `OUTREACH_LOOP_STATE.md` and the current trackers.
2. Audit the previous cohort for genuine replies, LinkedIn acceptances, landing
   clicks, consultation bookings, bounces, DND changes and unsubscribes.
3. Update the learning ledger. Opens are diagnostic only and never count as a
   positive conversion because privacy tools and scanners can inflate them.
4. Build `FOLLOW_UP_DUE` and `NEW_OUTREACH` queues. Process eligible due
   follow-ups first, then use remaining capacity for unused people. Use no more
   than two decision-makers from one clinic across the entire 200-person
   programme.
5. Reconfirm clinic fit, current role, exact account, usable mailbox and CRM
   suppression state at execution time.
6. Research one relevant service, treatment philosophy, technology, expansion
   or patient-journey signal from an official source.
7. Draft the person's unique current funnel stage from `OUTREACH_FUNNEL.md`.
   The product comes first, followed by the real before-and-after, sample report
   and free consultation.
8. QA every record and message. Place all 10 in a review table with evidence,
   hold reasons and character counts.
9. Ask for explicit batch approval immediately before sending. Show whether
   each row is new outreach or E2/E3/E4/LinkedIn follow-up. Approval is not
   inherited by later cycles.
10. After approved manual sending, log the exact channel, timestamp and delivery
    result in `OUTREACH_LOOP_STATE.md` and the relevant workbook.

## Transmission clock gate

Every run must calculate the current time in the IANA timezone `Europe/London`.
Never use a fixed UTC offset because British Summer Time changes during the
year.

- Sending is allowed only Monday through Saturday from 09:00 until 17:45 UK
  time.
- At 17:45, stop starting new sends. This safety buffer ensures every email,
  LinkedIn invitation and LinkedIn message finishes before 18:00 UK time.
- At or after 18:00 UK time, transmission is locked without exception.
- On Sunday, transmission is locked for the entire day.
- A cycle outside the permitted window may audit, research, verify, draft and
  queue records, but it must not transmit anything.
- Approval does not bypass the clock gate. An approved batch that misses its
  window returns to `APPROVED_WAITING_FOR_WINDOW` and must be rechecked for DND,
  mailbox and identity changes before later execution.

## Loop-engineering state machine

Each cycle has one durable `run_id` and advances only through these states:

`AUDIT -> LEARN -> SELECT -> VERIFY -> DRAFT -> QA -> APPROVAL_REQUIRED -> APPROVED_WAITING_FOR_WINDOW -> SEND_EMAIL -> SEND_LINKEDIN -> RECONCILE -> COMPLETE`

A failed gate moves a record to `HELD`, never around the gate. A safety signal
moves the entire cycle to `STOPPED`.

Engineering rules:

- Idempotency: before every transmission, check the person, email, LinkedIn URL,
  campaign key and prior send receipt. A matching receipt means `ALREADY_SENT`,
  not a retry.
- Record locking: one person can belong to only one active cycle. Release a lock
  only after `COMPLETE` or a documented hold.
- Checkpointing: write the state file after every transition so a restarted run
  resumes safely instead of repeating work.
- Reconciliation: never mark a send from the click alone. Require the visible
  GoHighLevel or LinkedIn success state, then record its timestamp and channel.
- Bounded retries: one safe retry is allowed for a transient page-load problem.
  Never retry a send action when its result is uncertain; reconcile first.
- Backoff: a platform warning, authentication issue, unexpected bounce cluster,
  unsubscribe spike or broken booking link pauses transmission and requires
  review.
- Cohort isolation: keep audience, offer and CTA fixed while testing one copy
  variable across at least 20 delivered contacts.
- Promotion rule: adopt a new angle only from stronger clicks, positive replies
  or consultation bookings. Never optimize from opens alone.
- Termination: stop at 200 distinct contacted people. A heartbeat after the cap
  performs reporting only and must not select more prospects.

## Learning method

Change one meaningful variable per 20 cleared recipients. Examples are the
opening angle, CTA wording, email length or proof point. Do not change the
audience, offer and CTA simultaneously.

Rank evidence in this order:

1. Consultation booked
2. Positive reply or qualified question
3. Landing-page click
4. LinkedIn acceptance
5. Genuine email open

Negative signals are unsubscribe, negative reply, hard bounce, spam complaint,
profile mismatch and LinkedIn warning. A single safety signal overrides a weak
engagement signal.

Do not declare a winner from opens. Promote a message angle only after at least
20 delivered contacts and a better rate of clicks, replies or consultations.
Record the evidence and the next hypothesis in the state file after every run.

## Completion

Stop at 200 distinct contacted people, or earlier if there is an authentication
problem, a platform warning, a compliance conflict or the user pauses the
campaign. Report totals by channel, clinic, cohort and outcome before proposing
an expansion.
