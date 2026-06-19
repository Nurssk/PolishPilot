import { createHmac, createHash, timingSafeEqual } from "node:crypto";

export type AppSessionUser = {
  uid: string;
  email: string;
};

const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const SESSION_PREFIX = "pp_email_";

export function normalizeEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : null;
}

export function createEmailCode(email: string, now = Date.now()): string {
  return codeForBucket(email, bucketFor(now));
}

export function verifyEmailCode(email: string, code: string, now = Date.now()): boolean {
  const normalizedCode = code.trim();
  if (!/^\d{6}$/.test(normalizedCode)) return false;

  const currentBucket = bucketFor(now);
  return [currentBucket, currentBucket - 1].some((bucket) =>
    safeEqual(normalizedCode, codeForBucket(email, bucket))
  );
}

export function createAppSessionToken(email: string, now = Date.now()): string {
  const iat = Math.floor(now / 1000);
  const payload = {
    sub: uidForEmail(email),
    email,
    iat,
    exp: iat + SESSION_TTL_SECONDS
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${SESSION_PREFIX}${encodedPayload}.${signature}`;
}

export function getEmailUserId(email: string): string {
  return uidForEmail(email);
}

export function verifyAppSessionToken(token: string): AppSessionUser | null {
  if (!token.startsWith(SESSION_PREFIX)) return null;
  const withoutPrefix = token.slice(SESSION_PREFIX.length);
  const [encodedPayload, signature] = withoutPrefix.split(".");
  if (!encodedPayload || !signature || !safeEqual(signature, sign(encodedPayload))) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as {
      sub?: unknown;
      email?: unknown;
      exp?: unknown;
    };
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    if (typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return { uid: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export async function sendEmailCode(email: string, code: string): Promise<{
  sent: boolean;
  debugCode?: string;
  errorCode?: "EMAIL_NOT_CONFIGURED" | "EMAIL_SEND_FAILED";
}> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;

  if (!resendApiKey || !from) {
    if (process.env.NODE_ENV === "production" && process.env.AUTH_EMAIL_DEBUG_CODE !== "true") {
      return { sent: false, errorCode: "EMAIL_NOT_CONFIGURED" };
    }
    console.info(`[auth] Dev email code for ${email}: ${code}`);
    return { sent: false, debugCode: code };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Your PolishPilot verification code",
      text: `Your PolishPilot verification code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your PolishPilot verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`
    })
  });

  if (!response.ok) {
    return { sent: false, errorCode: "EMAIL_SEND_FAILED" };
  }
  return { sent: true };
}

export function isEmailAuthConfigured(): boolean {
  return Boolean(emailAuthSecret());
}

function codeForBucket(email: string, bucket: number): string {
  const digest = createHmac("sha256", emailAuthSecret())
    .update(`${email}:${bucket}`)
    .digest();
  const value = digest.readUInt32BE(0) % 1_000_000;
  return value.toString().padStart(6, "0");
}

function bucketFor(now: number): number {
  return Math.floor(now / CODE_TTL_MS);
}

function uidForEmail(email: string): string {
  const digest = createHash("sha256").update(email).digest("hex").slice(0, 32);
  return `email:${digest}`;
}

function sign(value: string): string {
  return createHmac("sha256", emailAuthSecret()).update(value).digest("base64url");
}

function emailAuthSecret(): string {
  const secret = process.env.AUTH_EMAIL_SECRET || process.env.AUTH_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") return "";
  return "local-development-email-auth-secret";
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
