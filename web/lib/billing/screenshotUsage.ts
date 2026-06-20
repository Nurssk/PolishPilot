import type { UserPlan } from "./types";
import {
  createFirestoreDocument,
  getFirestoreDocument,
  integerField,
  patchFirestoreDocument,
  readInteger,
  readString,
  readTimestamp,
  stringField,
  timestampField
} from "../firebase/firestoreRest";

export type ScreenshotUsage = {
  email: string;
  documentId: string;
  plan: UserPlan;
  screenshotsRemaining: number;
  screenshotsTotal: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
};

const CUSTOMER_CREDITS_COLLECTION = "customerCredits";
const FREE_SCREENSHOT_LIMIT = 5;

export async function getScreenshotUsage(email: string): Promise<ScreenshotUsage> {
  return normalizeUsageDocument(email, await getOrCreateUsageDocument(email));
}

export async function consumeScreenshot(email: string): Promise<ScreenshotUsage> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const document = await getOrCreateUsageDocument(email);
    const usage = normalizeUsageDocument(email, document);

    if (usage.screenshotsRemaining <= 0) {
      const error = new Error("No screenshots remaining.");
      error.name = "USAGE_LIMIT_EXCEEDED";
      throw error;
    }

    try {
      const updated = await patchFirestoreDocument(
        CUSTOMER_CREDITS_COLLECTION,
        usage.documentId,
        {
          creditsRemaining: integerField(usage.screenshotsRemaining - 1),
          lastScreenshotAt: timestampField(new Date()),
          updatedAt: timestampField(new Date())
        },
        { updateTime: document.updateTime }
      );
      return normalizeUsageDocument(email, updated);
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }

  throw new Error("Could not consume screenshot credit.");
}

async function getOrCreateUsageDocument(email: string) {
  const documentId = customerCreditsDocumentId(email);
  const existing = await getFirestoreDocument(CUSTOMER_CREDITS_COLLECTION, documentId);

  if (existing) {
    const normalized = normalizeUsageDocument(email, existing);
    const now = Date.now();
    if (new Date(normalized.currentPeriodEnd).getTime() <= now) {
      return patchFirestoreDocument(CUSTOMER_CREDITS_COLLECTION, documentId, {
        creditsRemaining: integerField(normalized.screenshotsTotal),
        currentPeriodStart: timestampField(new Date(now)),
        currentPeriodEnd: timestampField(addMonths(new Date(now), 1)),
        updatedAt: timestampField(new Date(now))
      });
    }
    return existing;
  }

  const now = new Date();
  return createFirestoreDocument(CUSTOMER_CREDITS_COLLECTION, documentId, {
    emailKey: stringField(documentId),
    plan: stringField("free"),
    creditsRemaining: integerField(FREE_SCREENSHOT_LIMIT),
    creditsTotal: integerField(FREE_SCREENSHOT_LIMIT),
    currentPeriodStart: timestampField(now),
    currentPeriodEnd: timestampField(addMonths(now, 1)),
    createdAt: timestampField(now),
    updatedAt: timestampField(now)
  });
}

function normalizeUsageDocument(email: string, document: {
  fields?: Record<string, unknown>;
  updateTime?: string;
}): ScreenshotUsage {
  const fields = document.fields as Parameters<typeof readInteger>[0];
  const documentId = customerCreditsDocumentId(email);
  const planValue = readString(fields, "plan");
  const storedTotal = Math.max(1, readInteger(fields, "creditsTotal") ?? FREE_SCREENSHOT_LIMIT);
  const plan: UserPlan =
    planValue === "pro"
      ? "pro"
      : planValue === "free"
        ? "free"
        : storedTotal > FREE_SCREENSHOT_LIMIT
          ? "pro"
          : "free";
  const total = plan === "free" ? FREE_SCREENSHOT_LIMIT : storedTotal;
  const storedRemaining = readInteger(fields, "creditsRemaining") ?? total;
  const remaining = Math.max(0, Math.min(total, storedRemaining));
  const now = new Date();

  return {
    email,
    documentId,
    plan,
    screenshotsRemaining: remaining,
    screenshotsTotal: total,
    currentPeriodStart: readTimestamp(fields, "currentPeriodStart") ?? now.toISOString(),
    currentPeriodEnd: readTimestamp(fields, "currentPeriodEnd") ?? addMonths(now, 1).toISOString()
  };
}

export function customerCreditsDocumentId(email: string): string {
  return email.trim().toLowerCase().replace(/\./g, "_").replace(/\//g, "_");
}

function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}
