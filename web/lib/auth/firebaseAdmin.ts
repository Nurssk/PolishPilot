// Firebase "admin"-side helpers.
//
// IMPORTANT: verifying a Firebase **ID token** does NOT require a service account
// — it only needs the project ID + Google's public keys (handled in
// verifyFirebaseToken.ts). A service account is needed for Firestore REST writes
// that run from the backend. Do NOT commit service account JSON to the repo; set
// it as Vercel environment variables.

type ServiceAccountEnv = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

let parsedServiceAccount: ServiceAccountEnv | null | undefined;
let serviceAccountParseError = false;

export function getFirebaseProjectId(): string {
  return process.env.FIREBASE_PROJECT_ID || getServiceAccountEnv()?.project_id || "humanize-ui";
}

// Whether privileged admin credentials are configured. Supports either split
// env vars or a full FIREBASE_SERVICE_ACCOUNT_JSON blob.
export function hasAdminCredentials(): boolean {
  return Boolean(getAdminClientEmail() && getAdminPrivateKey());
}

export function getAdminClientEmail(): string | null {
  return process.env.FIREBASE_CLIENT_EMAIL || getServiceAccountEnv()?.client_email || null;
}

// Normalizes the private key when stored in an env var with escaped newlines.
export function getAdminPrivateKey(): string | null {
  const raw = process.env.FIREBASE_PRIVATE_KEY || getServiceAccountEnv()?.private_key;
  return raw ? raw.replace(/\\n/g, "\n") : null;
}

export function getFirebaseAdminDebugInfo() {
  const splitClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const splitPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccount = getServiceAccountEnv();
  const privateKey = getAdminPrivateKey();
  const clientEmail = getAdminClientEmail();

  return {
    projectId: getFirebaseProjectId(),
    projectIdSource: process.env.FIREBASE_PROJECT_ID
      ? "FIREBASE_PROJECT_ID"
      : serviceAccount?.project_id
        ? "FIREBASE_SERVICE_ACCOUNT_JSON"
        : "default",
    hasAdminCredentials: hasAdminCredentials(),
    splitEnv: {
      hasClientEmail: Boolean(splitClientEmail),
      hasPrivateKey: Boolean(splitPrivateKey)
    },
    serviceAccountJson: {
      present: Boolean(serviceAccountRaw),
      validJson: Boolean(serviceAccountRaw) && !serviceAccountParseError,
      hasProjectId: Boolean(serviceAccount?.project_id),
      hasClientEmail: Boolean(serviceAccount?.client_email),
      hasPrivateKey: Boolean(serviceAccount?.private_key)
    },
    resolvedClientEmail: maskEmail(clientEmail),
    privateKey: {
      present: Boolean(privateKey),
      hasBeginMarker: privateKey?.includes("-----BEGIN PRIVATE KEY-----") ?? false,
      hasEndMarker: privateKey?.includes("-----END PRIVATE KEY-----") ?? false,
      hasEscapedNewlines: Boolean(
        (process.env.FIREBASE_PRIVATE_KEY || serviceAccount?.private_key)?.includes("\\n")
      )
    }
  };
}

function getServiceAccountEnv(): ServiceAccountEnv | null {
  if (parsedServiceAccount !== undefined) return parsedServiceAccount;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    parsedServiceAccount = null;
    return parsedServiceAccount;
  }

  try {
    const parsed = JSON.parse(raw) as ServiceAccountEnv;
    parsedServiceAccount = parsed && typeof parsed === "object" ? parsed : null;
    serviceAccountParseError = false;
  } catch {
    parsedServiceAccount = null;
    serviceAccountParseError = true;
  }

  return parsedServiceAccount;
}

function maskEmail(email: string | null): string | null {
  if (!email) return null;
  const [name, domain] = email.split("@");
  if (!name || !domain) return "***";
  return `${name.slice(0, 4)}***@${domain}`;
}
