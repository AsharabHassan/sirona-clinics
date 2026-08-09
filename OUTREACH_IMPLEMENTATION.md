# VELURIA outreach operating system

## Safety state

The campaign is `PAUSED` by default. The controller can research, validate and
prepare approval packets while paused, but it cannot transmit an email or
perform a LinkedIn action. `release` only exposes approved manual actions. It
does not send them.

Live activation requires all of the following:

- five different authenticated `@sironaaesthetics.co.uk` senders with real names;
- at least 500 fully verified, unsuppressed people in the ready queue;
- an approved production profile for every clinic;
- a working Sirona GoHighLevel event webhook;
- a 32-character or longer recipient-token secret;
- explicit funnel, sender and research approval by a named reviewer.

Activation command, to be used only after those checks pass:

```powershell
node tools/outreach-loop.mjs activate --funnel-approved yes --senders-approved yes --research-approved yes --by "Reviewer name"
```

Activation still does not send anything. Every introduction and follow-up
packet needs separate approval, a valid UK release window and a manual send
receipt.

## Operating limits

- 100 new people per day, Monday to Saturday.
- 50 introductions assigned to 09:30 and 50 assigned to 14:30 UK time.
- No message on Sunday or at/after 18:00 UK time.
- Five senders, each capped at 20 new people and 80 total messages per day.
- Four emails on business days 0, 3, 7 and 12.
- 20 manual LinkedIn invitations per day, with no more than four messages after acceptance.
- One person per clinic in a daily packet. A second person is eligible only
  after 15 business days with no clinic-level engagement.
- Positive replies, bookings and meaningful funnel activity stop generic
  follow-ups and move the record to human review.

Pending approval packets reserve sender capacity. Preparing the command twice
cannot silently schedule more than the daily or per-sender limits.

## Approved clinic discovery and verification

The daily research target is 150 candidate clinics and 120 fully approved
people, maintaining at least 500 send-ready people. Discovery may use public
search engines, public UK clinic directories, Google Business listings,
professional association directories and the existing Sirona CRM.

Every person must pass this chain before entering a packet:

1. Confirm clinic fit, official website, UK location, services and an active
   corporate status using the official site and Companies House.
2. Match the exact Sales Navigator account using domain, location and trading
   name. A name-only match fails.
3. Match a current owner, founder, clinic/commercial director or medical
   director to the exact account.
4. Check the same person in SalesQL and retain only a verified work email.
   Personal/free-mail addresses are rejected.
5. Match the existing GoHighLevel contact ID in Sirona location
   `OdylxFk47CSXq3mt6RoF` and check DND, unsubscribe, suppression, bounce and
   identity conflicts.
6. Add a source-backed clinic signal, approved profile and final personalised
   copy. Never invent a service or clinic fact.

Automated LinkedIn scraping, bulk invitations and automated LinkedIn messages
are prohibited. Sales Navigator actions stay manual and stop on any warning.

## Research queue schema

Import JSON or CSV. CSV supports the human-readable names in parentheses.

| Field | Requirement |
| --- | --- |
| `discoverySourceUrl` (`Discovery Source URL`) | Public page where the clinic was found |
| `clinicName` (`Business Name`) | Confirmed trading name |
| `officialWebsite` (`Website`) | Exact clinic domain |
| `city` (`City`) | Confirmed UK location |
| `officialSourceUrl` (`Official Source URL`) | Page supporting the personalisation statement |
| `companiesHouseNumber` | Corporate identifier |
| `companiesHouseStatus` | Must be `active` |
| `clinicFit` | Must be `qualified` |
| `verifiedServices` | Array in JSON or semicolon-separated in CSV |
| `clinicSignal` | One truthful, source-backed sentence |
| `profileSlug` | A `verified` record in `data/clinic-profiles.json` |
| `contactId` (`Contact Id`) | Existing Sirona GHL contact ID |
| `personName` (`Contact Name`) | Exact matched person |
| `currentRole` (`Role`) | Current decision-making role |
| `personOrder` | `1` for primary, `2` for delayed secondary |
| `salesNavigatorAccountUrl` | Exact clinic account |
| `salesNavigatorLeadUrl` | Exact person |
| `salesQlChecked` | Must be `true` or `yes` |
| `workEmail` (`Email`) | Same person's verified work address |
| `emailStatus` | Must be `verified` |
| `identityMatch` | Must be `exact` |
| `ghlChecked` | Must be `true` or `yes` |
| `connectionState` | `not-connected`, `connected`, `pending` or `unresolved` |
| `verifiedAt` | Verification date |

Any true stop flag (`dnd`, `unsubscribed`, `suppressed`, `hardBounce`,
`explicitStop`) blocks the person.

## Daily commands

```powershell
npm run outreach:init
npm run outreach:readiness
npm run outreach:research

node tools/outreach-loop.mjs research-import --input "C:\path\verified-research.csv"
node tools/outreach-loop.mjs research-status

npm run outreach:prepare
node tools/outreach-loop.mjs approve --run <run-id> --by "Reviewer name"
node tools/outreach-loop.mjs release --run <run-id> --window 09:30

npm run outreach:followups
node tools/outreach-loop.mjs approve --run <followup-run-id> --by "Reviewer name"
node tools/outreach-loop.mjs release --run <followup-run-id>
```

After each manual action, record the real outcome:

```powershell
node tools/outreach-loop.mjs record --run <run-id> --contact <ghl-contact-id> --event sent --stage email-1
node tools/outreach-loop.mjs record --contact <ghl-contact-id> --event delivered
node tools/outreach-loop.mjs record --contact <ghl-contact-id> --event positive_reply
node tools/outreach-loop.mjs record --contact <ghl-contact-id> --event booked
```

Supported response outcomes include `positive_reply`, `negative_reply`,
`explicit_stop`, `unsubscribe`, `hard_bounce`, `complaint`, `booking_click`,
`booked`, `linkedin_accept` and `linkedin_reply`. Replies are classified and a
personal draft is prepared, but a human approves every reply before sending.

For an interested reply or question, write the truly personalised response to
a private text file and create a separate approval packet:

```powershell
node tools/outreach-loop.mjs prepare-reply --contact <ghl-contact-id> --classification question --draft-file "C:\private\reply.txt" --subject "Re: VELURIA"
node tools/outreach-loop.mjs approve --run <reply-run-id> --by "Reviewer name"
node tools/outreach-loop.mjs release --run <reply-run-id>
```

Available classifications are `positive`, `question`, `pricing`, `timing`,
`referral`, `not_now`, `out_of_office`, `decline` and `stop`. Every
classification stops generic sequencing. `decline` and `stop` suppress the
clinic immediately and intentionally create no reply packet.

## Four-stage message journey

1. Email 1 introduces the relevant VELURIA product pathway and opens the
   clinic-personalised product page.
2. Email 2 explains the VELURIA clinic-growth funnel and gross-revenue scenario.
3. Email 3 invites the doctor to try the before-and-after patient application.
4. Email 4 explains the optional contextual AI Sales Brain and offers the free
   20-minute VELURIA Clinic Growth Map.

The same private token maintains clinic and recipient attribution throughout.
Copy QA rejects guarantee language and long dashes, and every email contains a
plain-language opt-out sentence. GoHighLevel must also append its configured
unsubscribe footer.

## GoHighLevel boundary

Work only in Sirona location `OdylxFk47CSXq3mt6RoF`. Update existing contacts
by Contact ID and do not create contacts from campaign events. The receiving
workflow must map contact, clinic, stage, experiment, event, timestamp and page
URL, and stop both email and LinkedIn follow-up when a consultation is booked.

Calendar:
`https://link.sironaaesthetics.co.uk/widget/bookings/veluria-clinic-growth-map`

Before activation, test booking, attribution, confirmation, reminders,
cancellation, timezone display, suppression and cross-channel stopping with a
Sirona-owned test contact.

## Learning loop

Run `npm run outreach:learn` after recording outcomes. Bookings and positive
replies are the primary signals; clicks and application activity are intent
signals; opens are diagnostic only. Change one variable at a time and wait for
the configured cohort and observation period. The learner may recommend a
change or a pause, but it cannot alter live copy or send without approval.
