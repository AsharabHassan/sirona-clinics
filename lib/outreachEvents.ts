import "server-only";

import type {
  CampaignStage,
  OutreachEventName,
} from "./campaign";
import type { OutreachTokenPayload } from "./outreachToken";

interface OutreachEventRecord {
  eventId: string;
  event: OutreachEventName;
  stage: CampaignStage;
  occurredAt: string;
  pageUrl?: string;
}

const recentEvents = new Map<string, number>();

function isDuplicate(key: string): boolean {
  const now = Date.now();
  for (const [eventKey, timestamp] of recentEvents) {
    if (now - timestamp > 10 * 60 * 1000) recentEvents.delete(eventKey);
  }
  if (recentEvents.has(key)) return true;
  recentEvents.set(key, now);
  return false;
}

export async function recordOutreachEvent(
  token: OutreachTokenPayload,
  event: OutreachEventRecord,
): Promise<{ recorded: boolean; duplicate: boolean }> {
  const dedupeKey = `${token.contactId}:${event.event}:${event.stage}`;
  if (isDuplicate(dedupeKey)) return { recorded: false, duplicate: true };

  const webhookUrl = process.env.GHL_OUTREACH_EVENT_WEBHOOK_URL;
  const payload = {
    event_id: event.eventId,
    event_name: event.event,
    event_stage: event.stage,
    event_occurred_at: event.occurredAt,
    event_page_url: event.pageUrl ?? "",
    campaign_id: token.campaignId,
    clinic_profile_id: token.clinicSlug,
    experiment_variant: token.experiment,
    contact_id: token.contactId,
    source: "VELURIA Consultation Outreach",
  };

  if (!webhookUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[outreach-event]", JSON.stringify(payload));
      return { recorded: true, duplicate: false };
    }
    throw new Error("GHL_OUTREACH_EVENT_WEBHOOK_URL is not configured");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Outreach webhook returned ${response.status}`);
  return { recorded: true, duplicate: false };
}
