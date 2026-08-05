import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { CAMPAIGN_ID } from "./campaign";

const TOKEN_VERSION = 1;
const TOKEN_LIFETIME_MS = 90 * 24 * 60 * 60 * 1000;

export interface OutreachTokenPayload {
  v: 1;
  campaignId: typeof CAMPAIGN_ID;
  contactId: string;
  clinicSlug: string;
  experiment: string;
  expiresAt: number;
}
function secretKey(): Buffer {
  const secret = process.env.OUTREACH_TOKEN_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("OUTREACH_TOKEN_SECRET must contain at least 32 characters");
  }
  return createHash("sha256").update(secret, "utf8").digest();
}

function encode(value: Buffer): string {
  return value.toString("base64url");
}

function decode(value: string): Buffer {
  return Buffer.from(value, "base64url");
}

export function issueOutreachToken(input: {
  contactId: string;
  clinicSlug: string;
  experiment?: string;
  expiresAt?: number;
}): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secretKey(), iv);
  const payload: OutreachTokenPayload = {
    v: TOKEN_VERSION,
    campaignId: CAMPAIGN_ID,
    contactId: input.contactId,
    clinicSlug: input.clinicSlug,
    experiment: input.experiment ?? "control",
    expiresAt: input.expiresAt ?? Date.now() + TOKEN_LIFETIME_MS,
  };
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [encode(iv), encode(encrypted), encode(tag)].join(".");
}

export function readOutreachToken(token: string): OutreachTokenPayload {
  if (token.length > 512) throw new Error("Invalid outreach token");
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid outreach token");
  const [ivPart, encryptedPart, tagPart] = parts;
  const decipher = createDecipheriv("aes-256-gcm", secretKey(), decode(ivPart));
  decipher.setAuthTag(decode(tagPart));
  const clear = Buffer.concat([
    decipher.update(decode(encryptedPart)),
    decipher.final(),
  ]).toString("utf8");
  const payload = JSON.parse(clear) as Partial<OutreachTokenPayload>;

  if (
    payload.v !== TOKEN_VERSION ||
    payload.campaignId !== CAMPAIGN_ID ||
    typeof payload.contactId !== "string" ||
    typeof payload.clinicSlug !== "string" ||
    typeof payload.experiment !== "string" ||
    typeof payload.expiresAt !== "number" ||
    payload.expiresAt <= Date.now()
  ) {
    throw new Error("Expired or invalid outreach token");
  }
  return payload as OutreachTokenPayload;
}
