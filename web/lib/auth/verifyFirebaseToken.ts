import { getFirebaseProjectId } from "./firebaseAdmin";

// Verifies a Firebase Auth ID token (RS256) without any third-party SDK or
// service account. It checks the signature against Google's public keys and
// validates issuer/audience/expiry for the configured project.
//
// Returns null on any failure (invalid/expired token, fetch error, etc.) so
// callers can decide how to handle anonymous/invalid requests. Existing public
// API routes are NOT required to call this yet.

const JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

type Jwk = JsonWebKey & { kid?: string };
type JwksCache = { keys: Jwk[]; fetchedAt: number };

let jwksCache: JwksCache | null = null;
const JWKS_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function verifyFirebaseToken(
  idToken: string
): Promise<{ uid: string; email?: string } | null> {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;

    const header = decodeJson(headerB64);
    const payload = decodeJson(payloadB64);
    if (!header || !payload) return null;

    const kid = header.kid;
    if (header.alg !== "RS256" || typeof kid !== "string") return null;

    const projectId = getFirebaseProjectId();
    const now = Math.floor(Date.now() / 1000);

    // Standard Firebase ID token claim checks.
    const sub = payload.sub;
    const exp = payload.exp;
    const iat = payload.iat;
    if (payload.aud !== projectId) return null;
    if (payload.iss !== `https://securetoken.google.com/${projectId}`) return null;
    if (typeof sub !== "string" || sub.length === 0) return null;
    if (typeof exp !== "number" || exp <= now) return null;
    if (typeof iat !== "number" || iat > now + 300) return null;

    const jwk = await getSigningKey(kid);
    if (!jwk) return null;

    const key = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      base64UrlToBytes(signatureB64),
      toArrayBufferBytes(new TextEncoder().encode(`${headerB64}.${payloadB64}`))
    );
    if (!valid) return null;

    return {
      uid: sub,
      email: typeof payload.email === "string" ? payload.email : undefined
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[auth] verifyFirebaseToken failed:", (error as Error)?.message);
    }
    return null;
  }
}

async function getSigningKey(kid: string): Promise<Jwk | null> {
  if (!jwksCache || Date.now() - jwksCache.fetchedAt > JWKS_TTL_MS) {
    const response = await fetch(JWKS_URL, { cache: "no-store" });
    if (!response.ok) return null;
    const body = (await response.json()) as { keys?: Jwk[] };
    if (!Array.isArray(body.keys)) return null;
    jwksCache = { keys: body.keys, fetchedAt: Date.now() };
  }
  return jwksCache.keys.find((key) => key.kid === kid) ?? null;
}

function decodeJson(segment: string): Record<string, unknown> | null {
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(segment));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    value.length + ((4 - (value.length % 4)) % 4),
    "="
  );
  const binary = atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Copies any byte view into an ArrayBuffer-backed Uint8Array so it satisfies the
// strict `BufferSource` (ArrayBuffer) type expected by WebCrypto.
function toArrayBufferBytes(view: Uint8Array): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(new ArrayBuffer(view.byteLength));
  out.set(view);
  return out;
}
