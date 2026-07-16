import { NextResponse } from "next/server";
import { validateClinicLead } from "@/lib/validation";
import { pushClinicLeadToGhl, parseGhlMeta } from "@/lib/ghl";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const result = validateClinicLead(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const meta = parseGhlMeta((body as { meta?: unknown })?.meta, req);

  try {
    await pushClinicLeadToGhl(result.lead, meta);
  } catch (err) {
    console.error("[lead] GHL push failed:", err);
    return NextResponse.json(
      { error: "We couldn't submit your details. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
