// Firebase "admin"-side helpers.
//
// IMPORTANT: verifying a Firebase **ID token** does NOT require a service account
// — it only needs the project ID + Google's public keys (handled in
// verifyFirebaseToken.ts). A service account (FIREBASE_CLIENT_EMAIL /
// FIREBASE_PRIVATE_KEY) is only needed later for *privileged* admin operations
// (e.g. minting custom tokens, writing as admin). Do NOT commit a service
// account JSON to the repo; set these as Vercel environment variables.

export function getFirebaseProjectId(): string {
  return process.env.FIREBASE_PROJECT_ID || "humanize-ui";
}

// Whether privileged admin credentials are configured. Not required for ID-token
// verification — only for future server-side privileged operations.
export function hasAdminCredentials(): boolean {
  return Boolean(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
}

// Normalizes the private key when stored in an env var with escaped newlines.
export function getAdminPrivateKey(): string | null {
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  return raw ? raw.replace(/\\n/g, "\n") : null;
}
