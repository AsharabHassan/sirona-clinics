import type { ClinicLeadPayload, LeadPayload, SkinGoal } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_GOALS: SkinGoal[] = [
  "Hydration & glow",
  "Fine lines & wrinkles",
  "Texture & pores",
  "Tone & redness",
  "Overall rejuvenation",
];

export function validateLead(input: unknown):
  | { ok: true; lead: LeadPayload }
  | { ok: false; error: string } {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "Invalid request body." };
  }
  const o = input as Record<string, unknown>;

  const name = typeof o.name === "string" ? o.name.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const phone = typeof o.phone === "string" ? o.phone.trim() : "";
  const consent = o.consent === true;
  const clinicName =
    typeof o.clinicName === "string" ? o.clinicName.trim().slice(0, 120) : "";
  const goals = Array.isArray(o.goals)
    ? (o.goals.filter(
        (g): g is SkinGoal =>
          typeof g === "string" && (VALID_GOALS as string[]).includes(g),
      ) as SkinGoal[])
    : [];

  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  if (!EMAIL_RE.test(email))
    return { ok: false, error: "Please enter a valid email address." };
  if (phone.replace(/\D/g, "").length < 7)
    return { ok: false, error: "Please enter a valid phone number." };
  if (!consent)
    return { ok: false, error: "Please accept the consent statement to continue." };

  return {
    ok: true,
    lead: {
      name,
      email,
      phone,
      goals,
      consent,
      ...(clinicName ? { clinicName } : {}),
    },
  };
}

export function validateClinicLead(input: unknown):
  | { ok: true; lead: ClinicLeadPayload }
  | { ok: false; error: string } {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "Invalid request body." };
  }
  const o = input as Record<string, unknown>;

  const clinicName = typeof o.clinicName === "string" ? o.clinicName.trim() : "";
  const ownerName = typeof o.ownerName === "string" ? o.ownerName.trim() : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const phone = typeof o.phone === "string" ? o.phone.trim() : "";
  const city = typeof o.city === "string" ? o.city.trim() : "";
  const consent = o.consent === true;
  const rawPatients =
    typeof o.monthlyPatients === "number"
      ? o.monthlyPatients
      : typeof o.monthlyPatients === "string" && o.monthlyPatients.trim() !== ""
        ? Number(o.monthlyPatients)
        : undefined;
  const monthlyPatients =
    typeof rawPatients === "number" && Number.isFinite(rawPatients) && rawPatients >= 0
      ? Math.round(rawPatients)
      : undefined;

  if (clinicName.length < 2)
    return { ok: false, error: "Please enter your clinic name." };
  if (ownerName.length < 2)
    return { ok: false, error: "Please enter your name." };
  if (!EMAIL_RE.test(email))
    return { ok: false, error: "Please enter a valid email address." };
  if (phone.replace(/\D/g, "").length < 7)
    return { ok: false, error: "Please enter a valid phone number." };
  if (!consent)
    return { ok: false, error: "Please accept the consent statement to continue." };

  return {
    ok: true,
    lead: { clinicName, ownerName, email, phone, city, monthlyPatients, consent },
  };
}
