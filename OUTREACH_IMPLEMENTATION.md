# VELURIA outreach operating system

## Safety state

The campaign is `PAUSED` by default. The controller can research, validate and
prepare review packets while paused, but it cannot transmit an email or
perform a LinkedIn action. `release` only exposes approved manual actions. It
does not send them.

Live activation requires all of the following:

- one authenticated `@sironaaesthetics.co.uk` sender with a real name;
- at least one fully verified, unsuppressed person in the rolling ready queue;
- an approved production profile for every clinic;
- a working Sirona GoHighLevel event webhook;
- a 32-character or longer recipient-token secret;
- explicit funnel, sender and research approval by a named reviewer.

Activation command, to be used only after those checks pass:

```powershell
node tools/outreach-loop.mjs activate --funnel-approved yes --senders-approved yes --research-approved yes --by "Reviewer name"
```

Activation still does not send anything. The user granted standing authorisation
on 10 August 2026 for fully cleared introductions and scheduled follow-ups, so
those packets may enter `APPROVED_WAITING_FOR_WINDOW` automatically. Every send
still needs a valid UK release window, a fresh suppression check, manual UI
transmission and a visible send receipt. Contextual replies remain separately
reviewed because their content depends on the recipient's actual message.

## Operating limits

- A maximum of 100 total emails per day, Monday to Saturday. Follow-ups and
  approved reply messages count inside the same cap and take priority over new
  introductions.
- Maintain a daily research target of 120 new clinic candidates so holds and
  failed verification do not prevent up to 100 fully cleared routes reaching
  the sender queue. Research volume never overrides a verification gate.
- Prepare introductions one clinic at a time. Use the remaining
  daily capacity at 09:30 or 14:30 UK time.
- No message on Sunday or at/after 18:00 UK time.
- One sender capped at 100 total messages per day, including introductions,
  follow-ups and replies.
- Four emails on business days 0, 3, 7 and 12.
- Never repeat the same stage to the same contact. A contact receives at most
  one scheduled campaign email per UK day. "Continue the loop" means progress
  through the configured 0, 3, 7 and 12 business-day sequence, not duplicate
  or same-day repeated messages.
- 20 manual LinkedIn invitations per day, with no more than four messages after acceptance.
- One person per clinic in a daily packet. A second person is eligible only
  after 15 business days with no clinic-level engagement.
- Positive replies, bookings and meaningful funnel activity stop generic
  follow-ups and move the record to human review.

Prepared packets reserve sender capacity. Prepare due follow-ups before
new introductions; introductions use only the remaining daily capacity.
Preparing the command twice cannot silently schedule more than 100 total.
The programme has no lifetime cap and continues each eligible working day until
the user stops it. The daily figure is a hard ceiling, not permission to lower
identity, suppression, evidence or copy standards; if fewer routes clear, send
fewer and report the holds.

## Approved clinic discovery and verification

Research and clear one clinic at a time. Discovery may use public search
engines, public UK clinic directories, Google Business listings, professional
association directories and the existing Sirona CRM.

Use this recipient hierarchy, stopping at the first verified route:

1. Owner, founder, managing director, clinic director or medical director.
2. A current doctor, nurse prescriber or senior clinician at the exact clinic,
   with copy that asks them to forward the information when another colleague
   owns new treatment decisions.
3. The clinic's official role inbox published on its own website, with copy
   addressed to the clinic team and a clear request to pass it to the relevant
   clinician or director.

Do not contact unrelated employees, personal/free-mail addresses or several
people at the same clinic simultaneously. One active recipient route per clinic
is allowed until it replies, stops, bounces or completes the sequence.

Every recipient route must pass this chain before entering a packet:

1. Confirm clinic fit, official website, UK location, services and an active
   corporate status using the official site and Companies House.
2. Match the exact Sales Navigator account using domain, location and trading
   name. A name-only match fails.
3. Match a current decision-maker or relevant clinician to the exact account.
   If neither has a usable work address, verify the clinic's official role
   inbox on the clinic website.
4. For a person, check the same person in SalesQL and retain only a verified
   work email. For a clinic inbox, require the exact official clinic domain and
   the status `official-role-inbox`. Personal/free-mail addresses are rejected.
5. Search Sirona GoHighLevel location `OdylxFk47CSXq3mt6RoF` for the exact
   person and work email. Reuse the existing contact when found. If no exact
   contact exists, create one verified contact in that location, record its
   Contact ID, and then check DND, unsubscribe, suppression, bounce and identity
   conflicts before clearance.
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
| `recipientType` | `decision-maker`, `clinical-referral` or `clinic-inbox` |
| `contactId` (`Contact Id`) | Exact reused or newly created Sirona GHL contact ID |
| `personName` (`Contact Name`) | Exact matched person |
| `currentRole` (`Role`) | Current role, or `Clinic team` for an official inbox |
| `personOrder` | `1` for primary, `2` for delayed secondary |
| `salesNavigatorAccountUrl` | Exact clinic account |
| `salesNavigatorLeadUrl` | Exact person; not required for `clinic-inbox` |
| `salesQlChecked` | Required for named people; not required for `clinic-inbox` |
| `workEmail` (`Email`) | Verified person's work address or official clinic-domain role inbox |
| `emailStatus` | `verified` for people or `official-role-inbox` for a clinic inbox |
| `identityMatch` | `exact` for people or `clinic-exact` for a clinic inbox |
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

node tools/outreach-loop.mjs prepare-followups
node tools/outreach-loop.mjs approve --run <followup-run-id> --by "Reviewer name"
node tools/outreach-loop.mjs release --run <followup-run-id>

npm run outreach:prepare
node tools/outreach-loop.mjs approve --run <run-id> --by "Reviewer name"
node tools/outreach-loop.mjs release --run <run-id> --window 09:30
```

After each manual action, record the real outcome:

```powershell
node tools/outreach-loop.mjs record --run <run-id> --contact <ghl-contact-id> --event sent --stage email-1 --channel email
node tools/outreach-loop.mjs record --contact <ghl-contact-id> --event delivered --stage email-1 --channel email
node tools/outreach-loop.mjs record --contact <ghl-contact-id> --event positive_reply --stage email-1 --channel email --classification positive --topic product_fit --note "Privacy-safe summary"
node tools/outreach-loop.mjs record --contact <ghl-contact-id> --event booked --channel consultation --topic consultation
npm run outreach:learn
```

Supported response outcomes include `positive_reply`, `negative_reply`,
`explicit_stop`, `unsubscribe`, `hard_bounce`, `complaint`, `booking_click`,
`booked`, `linkedin_accept` and `linkedin_reply`. Replies are classified and a
personal draft is prepared, but a human approves every reply before sending.
The learning command saves a durable snapshot only when new interactions exist.
It aggregates stages, channels, classifications and topics, then proposes one
reviewable hypothesis without changing live copy or sending automatically.

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

Work only in Sirona location `OdylxFk47CSXq3mt6RoF`. Reuse exact contacts by
Contact ID. A newly discovered person may be created once, manually, only after
the identity and verified work-email chain passes. Campaign events must never
create contacts. The receiving workflow must map contact, clinic, stage,
experiment, event, timestamp and page URL, and stop both email and LinkedIn
follow-up when a consultation is booked.

Published Sirona safeguards:

- `VELURIA | Campaign Event Intake` receives the dedicated website event
  webhook. Its synthetic mapping reference covers contact, clinic, stage,
  experiment, event, timestamp and page URL. It does not create contacts.
- `VELURIA | Booking Suppression & Handoff` handles the consultation booking
  stop and handoff.
- `VELURIA | Reply Review and Suppression` watches email replies from contacts
  carrying `veluria_consultation_outreach` and adds
  `veluria_reply_review` for human classification before any follow-up.
- Every campaign contact must receive `veluria_consultation_outreach` before
  the first approved email is sent.

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
change or a pause, but it cannot alter live copy or bypass the verified-recipient,
suppression, sender, time-window, platform-warning or receipt gates.
