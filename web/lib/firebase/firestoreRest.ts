import { createSign } from "node:crypto";
import {
  getAdminClientEmail,
  getAdminPrivateKey,
  getFirebaseProjectId
} from "../auth/firebaseAdmin";

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { timestampValue: string }
  | { booleanValue: boolean };

export type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
};

let tokenCache: { accessToken: string; expiresAt: number } | null = null;

export async function getFirestoreDocument(
  collection: string,
  documentId: string
): Promise<FirestoreDocument | null> {
  const response = await firestoreFetch(documentPath(collection, documentId), {
    method: "GET"
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(await firestoreErrorMessage(response, "read"));
  }
  return (await response.json()) as FirestoreDocument;
}

export async function patchFirestoreDocument(
  collection: string,
  documentId: string,
  fields: Record<string, FirestoreValue>,
  options?: { updateTime?: string }
): Promise<FirestoreDocument> {
  const params = new URLSearchParams();
  for (const key of Object.keys(fields)) {
    params.append("updateMask.fieldPaths", key);
  }
  if (options?.updateTime) {
    params.set("currentDocument.updateTime", options.updateTime);
  }

  const response = await firestoreFetch(`${documentPath(collection, documentId)}?${params}`, {
    method: "PATCH",
    body: JSON.stringify({ fields })
  });

  if (!response.ok) {
    throw new Error(await firestoreErrorMessage(response, "patch"));
  }
  return (await response.json()) as FirestoreDocument;
}

export async function createFirestoreDocument(
  collection: string,
  documentId: string,
  fields: Record<string, FirestoreValue>
): Promise<FirestoreDocument> {
  const path = `/${encodeURIComponent(collection)}?documentId=${encodeURIComponent(documentId)}`;
  const response = await firestoreFetch(path, {
    method: "POST",
    body: JSON.stringify({ fields })
  });

  if (!response.ok && response.status !== 409) {
    throw new Error(await firestoreErrorMessage(response, "create"));
  }
  if (response.status === 409) {
    const existing = await getFirestoreDocument(collection, documentId);
    if (existing) return existing;
  }
  return (await response.json()) as FirestoreDocument;
}

export function stringField(value: string): FirestoreValue {
  return { stringValue: value };
}

export function integerField(value: number): FirestoreValue {
  return { integerValue: String(Math.trunc(value)) };
}

export function timestampField(value: Date): FirestoreValue {
  return { timestampValue: value.toISOString() };
}

export function readString(fields: Record<string, FirestoreValue> | undefined, key: string): string | null {
  const value = fields?.[key];
  return value && "stringValue" in value ? value.stringValue : null;
}

export function readInteger(fields: Record<string, FirestoreValue> | undefined, key: string): number | null {
  const value = fields?.[key];
  if (!value || !("integerValue" in value)) return null;
  const parsed = Number(value.integerValue);
  return Number.isFinite(parsed) ? parsed : null;
}

export function readTimestamp(fields: Record<string, FirestoreValue> | undefined, key: string): string | null {
  const value = fields?.[key];
  return value && "timestampValue" in value ? value.timestampValue : null;
}

async function firestoreFetch(path: string, init: RequestInit): Promise<Response> {
  const accessToken = await getAccessToken();
  return fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });
}

async function firestoreErrorMessage(response: Response, operation: string): Promise<string> {
  const body = (await response.json().catch(() => null)) as
    | { error?: { status?: string; message?: string } }
    | null;
  const status = body?.error?.status;
  const message = body?.error?.message;
  return [
    `Firestore ${operation} failed: ${response.status}`,
    status ? `status=${status}` : "",
    message ? `message=${message}` : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function baseUrl(): string {
  return `https://firestore.googleapis.com/v1/projects/${getFirebaseProjectId()}/databases/(default)/documents`;
}

function documentPath(collection: string, documentId: string): string {
  return `/${encodeURIComponent(collection)}/${encodeURIComponent(documentId)}`;
}

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.accessToken;
  }

  const clientEmail = getAdminClientEmail();
  const privateKey = getAdminPrivateKey();
  if (!clientEmail || !privateKey) {
    throw new Error("Firebase admin credentials are not configured.");
  }

  const now = Math.floor(Date.now() / 1000);
  const assertion = signJwt(
    {
      alg: "RS256",
      typ: "JWT"
    },
    {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600
    },
    privateKey
  );

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });

  if (!response.ok) {
    throw new Error(`Firebase admin token request failed: ${response.status}`);
  }

  const body = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!body.access_token) {
    throw new Error("Firebase admin token response did not include access_token.");
  }

  tokenCache = {
    accessToken: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000
  };
  return tokenCache.accessToken;
}

function signJwt(header: object, payload: object, privateKey: string): string {
  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  return `${signingInput}.${signer.sign(privateKey, "base64url")}`;
}

function base64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}
