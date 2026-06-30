import { apiUrl } from "./apiConfig";

export type ExtensionUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  idToken?: string;
};

export type UserPlan = "free" | "pro";

export type AuthState = {
  user: ExtensionUser | null;
  plan: UserPlan;
  isLoading: boolean;
};

export type AuthErrorCode =
  | "AUTH_NOT_CONFIGURED"
  | "INVALID_CODE"
  | "CODE_EXPIRED"
  | "CODE_USED"
  | "CODE_EXCHANGE_FAILED"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export type ExchangeWebsiteCodeResult = {
  email: string;
  token: string;
  tokenType: "Bearer";
  expiresInSeconds: number;
};

const AUTH_AUTHORIZE_URL = "https://www.beuniq.design/extension/authorize";
const AUTH_EXCHANGE_URL = apiUrl("/api/extension-auth/exchange");
const AUTH_PROFILE_KEY = "authUserProfile";
const AUTH_TOKEN_KEY = "authSessionToken";
const AUTH_TOKEN_EXPIRES_AT_KEY = "authSessionTokenExpiresAt";

const authListeners = new Set<(user: ExtensionUser | null) => void>();

export function getAuthorizeUrl(): string {
  return AUTH_AUTHORIZE_URL;
}

export async function openAuthorizationPage(): Promise<void> {
  if (chrome?.tabs?.create) {
    await chrome.tabs.create({ url: AUTH_AUTHORIZE_URL });
    return;
  }
  window.open(AUTH_AUTHORIZE_URL, "_blank", "noopener,noreferrer");
}

export async function exchangeWebsiteCode(code: string): Promise<ExtensionUser> {
  const normalizedCode = normalizeCode(code);

  if (normalizedCode.length !== 6) {
    throw new AuthError("INVALID_CODE", "Enter the 6-character code.");
  }

  const body = await exchangeCodeRequest(normalizedCode);
  const user: ExtensionUser = {
    uid: body.email,
    email: body.email,
    displayName: null,
    photoURL: null,
    idToken: body.token
  };

  await persistSession(user, body.token, body.expiresInSeconds);
  notifyAuthListeners(user);
  return user;
}

export async function signOutUser(): Promise<void> {
  await clearSession();
  notifyAuthListeners(null);
}

export async function getCurrentUser(): Promise<ExtensionUser | null> {
  const [profile, token] = await Promise.all([readCachedProfile(), readCachedToken()]);
  if (!profile || !token) return null;
  if (await isStoredTokenExpired()) {
    await clearSession();
    return null;
  }
  return { ...profile, idToken: token };
}

export function onAuthStateChangedSafe(
  callback: (user: ExtensionUser | null) => void
): () => void {
  authListeners.add(callback);
  void getCurrentUser().then(callback).catch(() => callback(null));
  return () => {
    authListeners.delete(callback);
  };
}

export async function getCurrentIdToken(): Promise<string | null> {
  const token = await readCachedToken();
  if (!token) return null;
  if (await isStoredTokenExpired()) {
    await clearSession();
    notifyAuthListeners(null);
    return null;
  }
  return token;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getCurrentIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function exchangeCodeRequest(code: string): Promise<ExchangeWebsiteCodeResult> {
  let response: Response;
  try {
    response = await fetch(AUTH_EXCHANGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
  } catch {
    throw new AuthError("NETWORK_ERROR", "Could not reach the authorization server.");
  }

  const body = (await response.json().catch(() => null)) as
    | {
        token?: unknown;
        tokenType?: unknown;
        expiresInSeconds?: unknown;
        email?: unknown;
        error?: { code?: unknown; message?: unknown } | string;
        message?: unknown;
      }
    | null;

  if (!response.ok || !body?.token || body.tokenType !== "Bearer") {
    throw mapExchangeError(errorCodeFromBody(body), errorMessageFromBody(body));
  }

  if (
    typeof body.token !== "string" ||
    typeof body.email !== "string" ||
    typeof body.expiresInSeconds !== "number"
  ) {
    throw new AuthError("CODE_EXCHANGE_FAILED", "Authorization server returned an invalid response.");
  }

  return {
    token: body.token,
    tokenType: "Bearer",
    expiresInSeconds: body.expiresInSeconds,
    email: body.email
  };
}

function mapExchangeError(code?: unknown, message?: unknown): AuthError {
  const normalizedCode = typeof code === "string" ? code.toUpperCase() : "";
  const normalizedMessage =
    typeof message === "string" && message ? message : null;

  if (normalizedCode.includes("EXPIRED")) {
    return new AuthError(
      "CODE_EXPIRED",
      normalizedMessage ?? "This code expired. Generate a new code on the website."
    );
  }
  if (normalizedCode.includes("USED") || normalizedCode.includes("CONSUMED")) {
    return new AuthError(
      "CODE_USED",
      normalizedMessage ?? "This code has already been used. Generate a new code on the website."
    );
  }
  if (normalizedCode.includes("INVALID_EMAIL")) {
    return new AuthError(
      "CODE_EXCHANGE_FAILED",
      "Authorization backend is out of date. Deploy the latest web backend, then try again."
    );
  }
  if (normalizedCode.includes("INVALID_CODE") || normalizedCode.includes("INVALID")) {
    return new AuthError(
      "INVALID_CODE",
      normalizedMessage ?? "This code is invalid. Copy a fresh code from the website."
    );
  }
  return new AuthError(
    "CODE_EXCHANGE_FAILED",
    normalizedMessage ?? "Could not connect this extension."
  );
}

function errorCodeFromBody(
  body: { error?: { code?: unknown; message?: unknown } | string; message?: unknown } | null
): unknown {
  if (!body) return undefined;
  if (typeof body.error === "string") return body.error;
  return body.error?.code;
}

function errorMessageFromBody(
  body: { error?: { code?: unknown; message?: unknown } | string; message?: unknown } | null
): unknown {
  if (!body) return undefined;
  if (typeof body.error === "object" && body.error?.message) return body.error.message;
  return body.message;
}

async function persistSession(
  user: ExtensionUser,
  token: string,
  expiresInSeconds: number
): Promise<void> {
  const safe = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  };
  await chrome.storage.local.set({
    [AUTH_PROFILE_KEY]: safe,
    [AUTH_TOKEN_KEY]: token,
    [AUTH_TOKEN_EXPIRES_AT_KEY]: Date.now() + expiresInSeconds * 1000
  });
}

async function clearSession(): Promise<void> {
  await chrome.storage.local.remove([
    AUTH_PROFILE_KEY,
    AUTH_TOKEN_KEY,
    AUTH_TOKEN_EXPIRES_AT_KEY
  ]);
}

async function readCachedProfile(): Promise<ExtensionUser | null> {
  try {
    const result = await chrome.storage.local.get(AUTH_PROFILE_KEY);
    const value = result[AUTH_PROFILE_KEY];
    if (value && typeof value === "object" && typeof (value as ExtensionUser).uid === "string") {
      return value as ExtensionUser;
    }
  } catch {
    // ignore
  }
  return null;
}

async function readCachedToken(): Promise<string | null> {
  try {
    const result = await chrome.storage.local.get(AUTH_TOKEN_KEY);
    const value = result[AUTH_TOKEN_KEY];
    return typeof value === "string" && value ? value : null;
  } catch {
    return null;
  }
}

async function isStoredTokenExpired(): Promise<boolean> {
  try {
    const result = await chrome.storage.local.get(AUTH_TOKEN_EXPIRES_AT_KEY);
    const expiresAt = result[AUTH_TOKEN_EXPIRES_AT_KEY];
    return typeof expiresAt === "number" && expiresAt <= Date.now() + 60_000;
  } catch {
    return false;
  }
}

function notifyAuthListeners(user: ExtensionUser | null): void {
  for (const listener of authListeners) {
    listener(user);
  }
}

export function normalizeCode(code: string): string {
  return code.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 6);
}
