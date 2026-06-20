import { getAuthHeaders } from "./authService";

export type ScreenshotUsage = {
  email: string;
  documentId: string;
  plan: "free" | "pro";
  screenshotsRemaining: number;
  screenshotsTotal: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
};

export class UsageError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "UsageError";
    this.code = code;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export async function getScreenshotUsage(): Promise<ScreenshotUsage> {
  const body = await usageFetch<{ ok: true; usage: ScreenshotUsage }>("/api/usage/me", {
    method: "GET"
  });
  return body.usage;
}

export async function consumeScreenshotCredit(): Promise<ScreenshotUsage> {
  const body = await usageFetch<{ ok: true; usage: ScreenshotUsage }>(
    "/api/usage/screenshots/consume",
    { method: "POST" }
  );
  return body.usage;
}

async function usageFetch<T>(path: string, init: RequestInit): Promise<T> {
  const headers = await getAuthHeaders();
  if (!headers.Authorization) {
    throw new UsageError("MISSING_AUTH", "Sign in to use screenshots.");
  }
  if (!API_BASE_URL) {
    throw new UsageError("USAGE_NOT_CONFIGURED", "The API base URL is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...(init.headers ?? {})
      }
    });
  } catch {
    throw new UsageError("NETWORK_ERROR", "Could not reach the usage server.");
  }

  const body = (await response.json().catch(() => null)) as
    | { ok?: boolean; error?: { code?: string; message?: string } }
    | null;

  if (!response.ok || body?.ok === false || !body) {
    throw new UsageError(
      body?.error?.code ?? "USAGE_ERROR",
      body?.error?.message ?? "Could not update screenshot usage."
    );
  }

  return body as T;
}
