import { randomInt, timingSafeEqual } from "node:crypto";
import {
  createFirestoreAutoIdDocument,
  deleteFirestoreDocument,
  type FirestoreDocument,
  queryFirestoreDocuments,
  readString,
  readTimestamp,
  stringField,
  timestampField
} from "../firebase/firestoreRest";
import { normalizeEmail } from "./emailCodeAuth";

export const EXTENSION_CODE_TTL_MS = 10 * 60 * 1000;
const EXTENSION_CODES_COLLECTION = "extensionAuthCodes";
const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export type ExtensionAuthCodeResult = {
  code: string;
  expiresAt: string;
};

export type ExtensionCodeExchangeResult =
  | { ok: true; email: string }
  | {
      ok: false;
      status: number;
      code: "INVALID_CODE" | "CODE_EXPIRED";
      message: string;
    };

export function normalizeExtensionCode(code: unknown): string | null {
  if (typeof code !== "string") return null;
  const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return /^[A-Z0-9]{6}$/.test(normalized) ? normalized : null;
}

export async function createExtensionAuthCode(email: string): Promise<ExtensionAuthCodeResult> {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error("Cannot create an extension code without a valid email.");
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + EXTENSION_CODE_TTL_MS);
  const code = generateExtensionCode();
  await createFirestoreAutoIdDocument(EXTENSION_CODES_COLLECTION, {
    email: stringField(normalizedEmail),
    code: stringField(code),
    createdAt: timestampField(now),
    expiresAt: timestampField(expiresAt)
  });

  return {
    code,
    expiresAt: expiresAt.toISOString()
  };
}

export async function exchangeExtensionAuthCode(
  codeValue: unknown
): Promise<ExtensionCodeExchangeResult> {
  const code = normalizeExtensionCode(codeValue);

  if (!code) {
    return {
      ok: false,
      status: 400,
      code: "INVALID_CODE",
      message: "Enter the 6-character code from the website."
    };
  }

  const documents = await queryFirestoreDocuments(EXTENSION_CODES_COLLECTION, {
    code: stringField(code)
  });

  let sawExpiredCode = false;
  for (const document of documents) {
    const fields = document.fields;
    const storedCode = readString(fields, "code") ?? "";
    const email = normalizeEmail(readString(fields, "email"));
    if (!email || !safeEqual(storedCode, code)) continue;

    if (isExpired(document)) {
      sawExpiredCode = true;
      await deleteDocumentByName(document.name).catch(() => undefined);
      continue;
    }

    await deleteDocumentByName(document.name);
    return { ok: true, email };
  }

  if (sawExpiredCode) {
    return {
      ok: false,
      status: 401,
      code: "CODE_EXPIRED",
      message: "This code expired. Generate a new code on the website."
    };
  }

  return invalidCode();
}

function invalidCode(): ExtensionCodeExchangeResult {
  return {
    ok: false,
    status: 401,
    code: "INVALID_CODE",
    message: "This code is invalid. Copy a fresh code from the website."
  };
}

function generateExtensionCode(): string {
  let code = "";
  for (let index = 0; index < 6; index += 1) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return code;
}

function isExpired(document: FirestoreDocument): boolean {
  const expiresAt = readTimestamp(document.fields, "expiresAt");
  if (expiresAt) return Date.parse(expiresAt) <= Date.now();
  if (!document.createTime) return false;
  return Date.parse(document.createTime) + EXTENSION_CODE_TTL_MS <= Date.now();
}

async function deleteDocumentByName(name: string): Promise<void> {
  const documentId = name.split("/").pop();
  if (!documentId) return;
  await deleteFirestoreDocument(EXTENSION_CODES_COLLECTION, documentId);
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
