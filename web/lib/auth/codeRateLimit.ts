import { createHash } from "node:crypto";
import {
  createFirestoreDocument,
  getFirestoreDocument,
  integerField,
  patchFirestoreDocument,
  readInteger,
  readTimestamp,
  stringField,
  timestampField
} from "../firebase/firestoreRest";

const AUTH_RATE_LIMITS_COLLECTION = "authRateLimits";
const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW_MS = 60 * 1000;

export type CodeRateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number };

export async function consumeCodeSendAllowance(
  scope: string,
  subject: string,
  options: { limit?: number; windowMs?: number; now?: Date } = {}
): Promise<CodeRateLimitResult> {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS;
  const now = options.now ?? new Date();
  const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
  const resetAt = new Date(windowStart.getTime() + windowMs);
  const documentId = `${sanitizeScope(scope)}_${hashSubject(subject)}`;

  const existing = await getFirestoreDocument(AUTH_RATE_LIMITS_COLLECTION, documentId);
  const existingWindowStart = readTimestamp(existing?.fields, "windowStart");
  const count =
    existing && existingWindowStart === windowStart.toISOString()
      ? readInteger(existing.fields, "count") ?? 0
      : 0;

  if (count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((resetAt.getTime() - now.getTime()) / 1000))
    };
  }

  const fields = {
    scope: stringField(scope),
    subjectHash: stringField(hashSubject(subject)),
    count: integerField(count + 1),
    limit: integerField(limit),
    windowStart: timestampField(windowStart),
    resetAt: timestampField(resetAt),
    updatedAt: timestampField(now)
  };

  if (existing) {
    await patchFirestoreDocument(AUTH_RATE_LIMITS_COLLECTION, documentId, fields);
  } else {
    await createFirestoreDocument(AUTH_RATE_LIMITS_COLLECTION, documentId, {
      ...fields,
      createdAt: timestampField(now)
    });
  }

  return { ok: true, remaining: Math.max(0, limit - count - 1) };
}

function sanitizeScope(scope: string): string {
  return scope.replace(/[^a-z0-9_-]/gi, "_").slice(0, 48) || "auth";
}

function hashSubject(subject: string): string {
  return createHash("sha256").update(subject).digest("hex").slice(0, 40);
}
