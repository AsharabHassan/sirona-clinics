import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isCampaignStage, isOutreachEventName } from "@/lib/campaign";
import { recordOutreachEvent } from "@/lib/outreachEvents";
import { readOutreachToken } from "@/lib/outreachToken";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 16_384) {
    return NextResponse.json({ ok: false, error: "payload-too-large" }, { status: 413 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (
      typeof body.token !== "string" ||
      !isOutreachEventName(body.event) ||
      !isCampaignStage(body.stage)
    ) {
      return NextResponse.json({ ok: false, error: "invalid-event" }, { status: 400 });
    }
    const token = readOutreachToken(body.token);
    const result = await recordOutreachEvent(token, {
      eventId: typeof body.eventId === "string" ? body.eventId.slice(0, 100) : randomUUID(),
      event: body.event,
      stage: body.stage,
      occurredAt: new Date().toISOString(),
      pageUrl: typeof body.pageUrl === "string" ? body.pageUrl.slice(0, 500) : undefined,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.warn(
      "[outreach-event] rejected",
      error instanceof Error ? error.message : "unknown-error",
    );
    return NextResponse.json({ ok: false, error: "event-rejected" }, { status: 400 });
  }
}
