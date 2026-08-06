import { NextResponse } from "next/server";
import { validateClinicLead, validateLead } from "@/lib/validation";
import {
  parseGhlMeta,
  pushClinicLeadToGhl,
  pushLeadToGhl,
} from "@/lib/ghl";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const meta = parseGhlMeta((body as { meta?: unknown })?.meta, req);
  const leadType =
    typeof body === "object" && body !== null && "leadType" in body
      ? (body as { leadType?: unknown }).leadType
      : undefined;

  try {
    if (leadType === "patient") {
      const result = validateLead(body);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      await pushLeadToGhl(result.lead, meta);
    } else {
      // Keep the previous clinic-owner payload as the backwards-compatible
      // default so existing outreach links and cached clients keep working.
      const result = validateClinicLead(body);
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      await pushClinicLeadToGhl(result.lead, meta);
    }
  } catch (err) {
    console.error("[lead] GHL push failed:", err);
    return NextResponse.json(
      { error: "We couldn't submit your details. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
