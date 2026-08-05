import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isCampaignStage } from "@/lib/campaign";
import { recordOutreachEvent } from "@/lib/outreachEvents";
import { readOutreachToken } from "@/lib/outreachToken";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string; stage: string }> },
) {
  const { token, stage } = await context.params;
  if (!isCampaignStage(stage)) return NextResponse.redirect(new URL("/", request.url));

  try {
    const payload = readOutreachToken(token);
    await recordOutreachEvent(payload, {
      eventId: randomUUID(),
      event: "outreach_click",
      stage,
      occurredAt: new Date().toISOString(),
      pageUrl: request.url,
    }).catch((error) => console.warn("[outreach-click]", error));
    const target = new URL(`/clinic/${encodeURIComponent(payload.clinicSlug)}`, request.url);
    target.searchParams.set("r", token);
    target.searchParams.set("stage", stage);
    return NextResponse.redirect(target, 302);
  } catch {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }
}
