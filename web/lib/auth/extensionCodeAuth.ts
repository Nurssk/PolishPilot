import { randomInt, timingSafeEqual } from "node:crypto";
import {
  createFirestoreAutoIdDocument,
  deleteFirestoreDocument,
  queryFirestoreDocuments,
  readString,
  stringField
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
      code: "INVALID_EMAIL" | "INVALID_CODE" | "CODE_EXPIRED" | "CODE_USED";
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

  await deleteExistingCodesForEmail(normalizedEmail);

  const code = generateExtensionCode();
  await createFirestoreAutoIdDocument(EXTENSION_CODES_COLLECTION, {
    email: stringField(normalizedEmail),
    code: stringField(code)
  });

  return {
    code,
    expiresAt: new Date(Date.now() + EXTENSION_CODE_TTL_MS).toISOString()
  };
}

export async function exchangeExtensionAuthCode(
  emailValue: unknown,
  codeValue: unknown
): Promise<ExtensionCodeExchangeResult> {
  const email = normalizeEmail(emailValue);
  const code = normalizeExtensionCode(codeValue);

  if (!email) {
    return {
      ok: false,
      status: 400,
      code: "INVALID_EMAIL",
      message: "Enter the same email you used on the website."
    };
  }
  if (!code) {
    return {
      ok: false,
      status: 400,
      code: "INVALID_CODE",
      message: "Enter the 6-character code from the website."
    };
  }

  const documents = await queryFirestoreDocuments(EXTENSION_CODES_COLLECTION, {
    email: stringField(email)
  });
  const matchingDocument = documents.find((document) => {
    const fields = document.fields;
    return (
      safeEqual(readString(fields, "email") ?? "", email) &&
      safeEqual(readString(fields, "code") ?? "", code)
    );
  });

  if (!matchingDocument) {
    return invalidCode();
  }

  if (isExpired(matchingDocument.createTime)) {
    await deleteDocumentByName(matchingDocument.name);
    return {
      ok: false,
      status: 410,
      code: "CODE_EXPIRED",
      message: "This code expired. Generate a new code on the website."
    };
  }

  await deleteDocumentByName(matchingDocument.name);
  return { ok: true, email };
}

async function deleteExistingCodesForEmail(email: string): Promise<void> {
  const documents = await queryFirestoreDocuments(EXTENSION_CODES_COLLECTION, {
    email: stringField(email)
  });
  await Promise.all(documents.map((document) => deleteDocumentByName(document.name)));
}

async function deleteDocumentByName(name: string): Promise<void> {
  const documentId = name.split("/").pop();
  if (!documentId) return;
  await deleteFirestoreDocument(EXTENSION_CODES_COLLECTION, documentId);
}

function invalidCode(): ExtensionCodeExchangeResult {
  return {
    ok: false,
    status: 401,
    code: "INVALID_CODE",
    message: "The email and code do not match. Copy a fresh code from the website."
  };
}

function generateExtensionCode(): string {
  let code = "";
  for (let index = 0; index < 6; index += 1) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return code;
}

function isExpired(createTime: string | undefined): boolean {
  if (!createTime) return false;
  return Date.parse(createTime) + EXTENSION_CODE_TTL_MS <= Date.now();
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
