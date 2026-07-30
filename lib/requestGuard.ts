type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function visitorKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const platformIp = req.headers.get("x-real-ip")?.trim();
  return forwarded || platformIp || "unknown";
}

/**
 * Lightweight abuse protection for costly AI preview routes.
 *
 * This intentionally remains a last line of defence rather than a billing or
 * security boundary: a shared external rate-limit store should replace it when
 * the application runs across multiple serverless instances.
 */
export function consumeRequestLimit(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number,
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const now = Date.now();
  const key = `${scope}:${visitorKey(req)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  buckets.set(key, current);
  return { allowed: true };
}
