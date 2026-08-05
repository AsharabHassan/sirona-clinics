# VELURIA consultation outreach implementation

## Current safety state

The controller is `PAUSED`. Building and testing the funnel does not authorize
researching, queuing, approving, releasing or sending a live batch. Activation
requires explicit funnel approval and records the reviewer:

```powershell
node tools/outreach-loop.mjs activate --funnel-approved yes --by "Reviewer name"
```

Activation does not send anything. Every batch still requires its own approval
and a fresh release inside the UK clock gate.

## Clinic profiles

Add only approved records to `data/clinic-profiles.json`. A live profile needs
`status: "verified"`, a confirmed corporate entity, an official website and
location, source-backed clinic signals, verification dates, relevant VELURIA
products and clinic-specific funnel copy. Unknown slugs return a 404. The
included example is an internal QA record and cannot pass the live batch gate.

## Recipient evidence

`npm run outreach:init` creates the gitignored file
`outreach-private/recipient-evidence.json`. Key records by the existing
GoHighLevel Contact ID:

```json
{
  "EXISTING_GHL_CONTACT_ID": {
    "identityMatch": "exact",
    "currentRole": "Founder and Clinic Director",
    "workEmail": "name@clinic-domain.co.uk",
    "emailStatus": "verified",
    "salesNavigatorLeadUrl": "https://www.linkedin.com/sales/lead/...",
    "officialSourceUrl": "https://clinic-domain.co.uk/relevant-service",
    "connectionState": "not-connected",
    "dnd": false,
    "unsubscribed": false,
    "suppressed": false,
    "hardBounce": false,
    "explicitStop": false
  }
}
```

Personal email domains, missing identity evidence, non-corporate businesses and
all stop signals are held automatically.

## Batch lifecycle

```powershell
node tools/outreach-loop.mjs prepare --input "C:\path\Sirona_Top100_Outreach.csv" --limit 10 --variant control
node tools/outreach-loop.mjs approve --run <run-id> --by "Reviewer name"
node tools/outreach-loop.mjs release --run <run-id>
node tools/outreach-loop.mjs record --run <run-id> --contact <ghl-contact-id> --event delivered
node tools/outreach-loop.mjs record --run <run-id> --contact <ghl-contact-id> --event booked
```

`release` never transmits email or LinkedIn messages. It refuses paused
campaigns, unapproved batches, a location mismatch, Sunday, times outside the
09:30/14:30 UK windows, starts after 17:45 and all times at or after 18:00.

## GoHighLevel configuration

The dedicated Sirona calendar is live at
`https://link.sironaaesthetics.co.uk/widget/bookings/veluria-clinic-growth-map`.
Its calendar ID is `Tsy3vyvGTiInsley6Egm`.

The published `VELURIA | Booking Suppression & Handoff` workflow is limited to
that calendar and adds the existing `consultation | appointment booked` tag.
Treat that tag as a hard promotional stop in every execution audit.

Work only in location `OdylxFk47CSXq3mt6RoF`.

1. Create a dedicated inbound-webhook workflow and set its URL as
   `GHL_OUTREACH_EVENT_WEBHOOK_URL`.
2. Map contact, campaign, clinic-profile, experiment, event, stage, timestamp
   and page URL fields. Update by existing Contact ID; never create a contact
   from an outreach event.
3. Attach a custom calendar form requiring first name, last name, work email
   and clinic name. Phone is optional. Include the hidden Source field.
4. Recipient booking links pass `vl26.<token>` as Source.
5. A Customer Booked Appointment workflow applies the booked tag, notifies
   Jacqui and stops email and LinkedIn follow-ups.
6. Use reminders only after booking.

Before activation, test-book with a Sirona-owned contact and confirm matching,
attribution, confirmation, reminders, cancellation, timezone display and
cross-channel sequence stopping.

## Learning rules

Events update the ledger immediately, but copy changes require 20 delivered
recipients per variant and five business days of observation. Bookings,
positive replies, booking clicks, AI completions and report views can support a
decision. Opens cannot select a winner.
