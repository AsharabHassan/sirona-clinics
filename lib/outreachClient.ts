import type { CampaignStage, OutreachEventName } from "./campaign";

export function trackOutreachEvent(
  token: string | undefined,
  event: OutreachEventName,
  stage: CampaignStage,
): void {
  if (!token) return;
  const payload = JSON.stringify({ token, event, stage, pageUrl: window.location.href });

  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon(
      "/api/outreach/event",
      new Blob([payload], { type: "application/json" }),
    );
    return;
  }

  void fetch("/api/outreach/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}

export function consultationHref(
  token: string | undefined,
  stage: CampaignStage,
  clinicSlug?: string,
): string {
  return token
    ? `/book/${encodeURIComponent(token)}/${encodeURIComponent(stage)}`
    : clinicSlug
      ? `/consultation?clinic=${encodeURIComponent(clinicSlug)}`
      : "/consultation";
}
