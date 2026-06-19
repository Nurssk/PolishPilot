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
  | "INVALID_EMAIL"
  | "INVALID_CODE"
  | "CODE_EXPIRED"
  | "CODE_SEND_FAILED"
  | "NETWORK_ERROR"
  | "FLOW_FAILED"
  | "UNKNOWN";

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export type RequestEmailCodeResult = {
  email: string;
  debugCode?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";
const AUTH_PROFILE_KEY = "authUserProfile";
const AUTH_TOKEN_KEY = "authSessionToken";

const authListeners = new Set<(user: ExtensionUser | null) => void>();

export function isAuthConfigured(): boolean {
  return API_BASE_URL.length > 0;
}

export async function requestEmailCode(email: string): Promise<RequestEmailCodeResult> {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new AuthError("INVALID_EMAIL", "Enter a valid email address.");
  }
  const body = await authFetch<{
    ok: true;
    email: string;
    debugCode?: string;
  }>("/api/auth/email/start", {
    method: "POST",
    body: JSON.stringify({ email: normalizedEmail })
  });

  return {
    email: body.email,
    ...(body.debugCode ? { debugCode: body.debugCode } : {})
  };
}

export async function verifyEmailCode(email: string, code: string): Promise<ExtensionUser> {
  const normalizedEmail = normalizeEmail(email);
  const normalizedCode = code.trim();
  if (!normalizedEmail) {
    throw new AuthError("INVALID_EMAIL", "Enter a valid email address.");
  }
  if (!/^\d{6}$/.test(normalizedCode)) {
    throw new AuthError("INVALID_CODE", "Enter the 6-digit code.");
  }

  const body = await authFetch<{
    ok: true;
    token: string;
    user: { uid: string; email: string };
  }>("/api/auth/email/verify", {
    method: "POST",
    body: JSON.stringify({ email: normalizedEmail, code: normalizedCode })
  });

  const user: ExtensionUser = {
    uid: body.user.uid,
    email: body.user.email,
    displayName: null,
    photoURL: null,
    idToken: body.token
  };
  await persistSession(user, body.token);
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
  return readCachedToken();
}

// Optional auth headers for backend requests. Returns {} when not logged in, so
// anonymous/free analysis keeps working unchanged.
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getCurrentIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function authFetch<T>(path: string, init: RequestInit): Promise<T> {
  if (!isAuthConfigured()) {
    throw new AuthError("AUTH_NOT_CONFIGURED", "The API base URL is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {})
      }
    });
  } catch {
    throw new AuthError("NETWORK_ERROR", "Could not reach the authentication server.");
  }

  const body = (await response.json().catch(() => null)) as
    | {
        ok?: boolean;
        error?: { code?: string; message?: string };
      }
    | null;

  if (!response.ok || body?.ok === false || !body) {
    throw mapApiError(body?.error?.code, body?.error?.message);
  }

  return body as T;
}

function mapApiError(code?: string, message?: string): AuthError {
  if (code === "INVALID_EMAIL") {
    return new AuthError("INVALID_EMAIL", message || "Enter a valid email address.");
  }
  if (code === "INVALID_CODE") {
    return new AuthError("INVALID_CODE", message || "The code is invalid.");
  }
  if (code === "CODE_EXPIRED") {
    return new AuthError("CODE_EXPIRED", message || "The code has expired.");
  }
  if (code === "EMAIL_SEND_FAILED" || code === "EMAIL_NOT_CONFIGURED") {
    return new AuthError("CODE_SEND_FAILED", message || "Could not send the code.");
  }
  if (code === "AUTH_NOT_CONFIGURED") {
    return new AuthError("AUTH_NOT_CONFIGURED", message || "Email login is not configured.");
  }
  return new AuthError("UNKNOWN", message || "Sign-in failed.");
}

async function persistSession(user: ExtensionUser, token: string): Promise<void> {
  const safe = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  };
  await chrome.storage.local.set({
    [AUTH_PROFILE_KEY]: safe,
    [AUTH_TOKEN_KEY]: token
  });
}

async function clearSession(): Promise<void> {
  await chrome.storage.local.remove([AUTH_PROFILE_KEY, AUTH_TOKEN_KEY]);
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

function notifyAuthListeners(user: ExtensionUser | null): void {
  for (const listener of authListeners) {
    listener(user);
  }
}

function normalizeEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : "";
}
