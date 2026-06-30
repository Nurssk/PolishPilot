import type {
  GenerateCodeChangeRequest,
  GenerateCodeChangeResult
} from "../ai/prompts/buildCodeChangePrompt";
import type { AuthenticatedUser } from "../auth/readAuthenticatedUser";
import {
  createFirestoreAutoIdDocument,
  queryFirestoreDocuments,
  readBoolean,
  readInteger,
  readString,
  readTimestamp,
  stringField,
  integerField,
  timestampField,
  booleanField
} from "../firebase/firestoreRest";

export type CodeGenerationHistoryItem = {
  id: string;
  createdAt: string;
  userId: string;
  email: string | null;
  sourceUrl: string | null;
  sourceTitle: string | null;
  scope: string;
  sectionType: string | null;
  layoutType: string | null;
  patternName: string | null;
  templateTitle: string | null;
  animationTitle: string | null;
  model: string | null;
  provider: "gemini";
  requestId: string | null;
  diffSummary: string | null;
  generatedHtmlPreview: string;
  generatedHtml?: string;
  modifiedHtml?: string;
  modifiedCss?: string;
  cursorPrompt?: string;
  htmlChars: number;
  cssChars: number;
  htmlTruncated: boolean;
  cssTruncated: boolean;
};

type SaveCodeGenerationHistoryInput = {
  user: AuthenticatedUser;
  payload: GenerateCodeChangeRequest;
  result: GenerateCodeChangeResult;
  requestId: string;
  model: string;
};

const CODE_GENERATION_HISTORY_COLLECTION = "codeGenerationHistory";
const MAX_GENERATED_HTML_CHARS = 420_000;
const MAX_MODIFIED_HTML_CHARS = 220_000;
const MAX_CSS_CHARS = 120_000;
const MAX_CURSOR_PROMPT_CHARS = 60_000;
const MAX_SUMMARY_CHARS = 4_000;
const MAX_PREVIEW_CHARS = 1_200;

export async function saveCodeGenerationHistory({
  user,
  payload,
  result,
  requestId,
  model
}: SaveCodeGenerationHistoryInput): Promise<CodeGenerationHistoryItem> {
  const createdAt = new Date();
  const generatedHtml = result.fullHtmlDocument || result.modifiedHtml;
  const generatedHtmlCap = capText(generatedHtml, MAX_GENERATED_HTML_CHARS);
  const modifiedHtmlCap = capText(result.modifiedHtml, MAX_MODIFIED_HTML_CHARS);
  const modifiedCssCap = capText(result.modifiedCss ?? "", MAX_CSS_CHARS);
  const cursorPromptCap = capText(result.cursorPrompt ?? "", MAX_CURSOR_PROMPT_CHARS);
  const aiResult = asRecord(payload.aiResult);
  const selectedPattern = asRecord(payload.selectedPattern);
  const selectedTemplate = asRecord(payload.selectedTemplateReference);
  const selectedAnimation = asRecord(payload.selectedAnimationReference);

  const document = await createFirestoreAutoIdDocument(CODE_GENERATION_HISTORY_COLLECTION, {
    userId: stringField(user.uid),
    email: stringField(user.email ?? ""),
    sourceUrl: stringField(payload.url ?? ""),
    sourceTitle: stringField(payload.title ?? ""),
    scope: stringField(payload.scope),
    sectionType: stringField(stringFromRecord(aiResult, "sectionType")),
    layoutType: stringField(stringFromRecord(aiResult, "layoutType")),
    patternName: stringField(stringFromRecord(selectedPattern, "name")),
    templateTitle: stringField(stringFromRecord(selectedTemplate, "title")),
    animationTitle: stringField(stringFromRecord(selectedAnimation, "title")),
    provider: stringField("gemini"),
    model: stringField(model),
    requestId: stringField(requestId),
    diffSummary: stringField(capText(result.diffSummary ?? "", MAX_SUMMARY_CHARS).text),
    generatedHtml: stringField(generatedHtmlCap.text),
    generatedHtmlPreview: stringField(generatedHtml.slice(0, MAX_PREVIEW_CHARS)),
    modifiedHtml: stringField(modifiedHtmlCap.text),
    modifiedCss: stringField(modifiedCssCap.text),
    cursorPrompt: stringField(cursorPromptCap.text),
    htmlChars: integerField(generatedHtml.length),
    cssChars: integerField((result.modifiedCss ?? "").length),
    htmlTruncated: booleanField(generatedHtmlCap.truncated || modifiedHtmlCap.truncated),
    cssTruncated: booleanField(modifiedCssCap.truncated),
    createdAt: timestampField(createdAt),
    updatedAt: timestampField(createdAt)
  });

  return historyItemFromDocument(document);
}

export async function listCodeGenerationHistory(
  user: AuthenticatedUser,
  options: { limit?: number; includeHtml?: boolean } = {}
): Promise<CodeGenerationHistoryItem[]> {
  const documents = await queryFirestoreDocuments(CODE_GENERATION_HISTORY_COLLECTION, {
    userId: stringField(user.uid)
  });

  return documents
    .map(historyItemFromDocument)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, options.limit ?? 20)
    .map((item) =>
      options.includeHtml
        ? item
        : {
            ...item,
            generatedHtml: undefined,
            modifiedHtml: undefined,
            modifiedCss: undefined,
            cursorPrompt: undefined
          }
    );
}

function historyItemFromDocument(document: {
  name: string;
  fields?: Record<string, unknown>;
  createTime?: string;
}): CodeGenerationHistoryItem {
  const fields = document.fields as Parameters<typeof readString>[0];
  const id = document.name.split("/").pop() ?? document.name;
  return {
    id,
    createdAt: readTimestamp(fields, "createdAt") ?? document.createTime ?? new Date(0).toISOString(),
    userId: readString(fields, "userId") ?? "",
    email: emptyToNull(readString(fields, "email")),
    sourceUrl: emptyToNull(readString(fields, "sourceUrl")),
    sourceTitle: emptyToNull(readString(fields, "sourceTitle")),
    scope: readString(fields, "scope") ?? "selected-block",
    sectionType: emptyToNull(readString(fields, "sectionType")),
    layoutType: emptyToNull(readString(fields, "layoutType")),
    patternName: emptyToNull(readString(fields, "patternName")),
    templateTitle: emptyToNull(readString(fields, "templateTitle")),
    animationTitle: emptyToNull(readString(fields, "animationTitle")),
    model: emptyToNull(readString(fields, "model")),
    provider: "gemini",
    requestId: emptyToNull(readString(fields, "requestId")),
    diffSummary: emptyToNull(readString(fields, "diffSummary")),
    generatedHtmlPreview: readString(fields, "generatedHtmlPreview") ?? "",
    generatedHtml: readString(fields, "generatedHtml") ?? undefined,
    modifiedHtml: readString(fields, "modifiedHtml") ?? undefined,
    modifiedCss: readString(fields, "modifiedCss") ?? undefined,
    cursorPrompt: readString(fields, "cursorPrompt") ?? undefined,
    htmlChars: readInteger(fields, "htmlChars") ?? 0,
    cssChars: readInteger(fields, "cssChars") ?? 0,
    htmlTruncated: readBoolean(fields, "htmlTruncated") ?? false,
    cssTruncated: readBoolean(fields, "cssTruncated") ?? false
  };
}

function capText(value: string, maxChars: number) {
  return {
    text: value.length > maxChars ? value.slice(0, maxChars) : value,
    truncated: value.length > maxChars
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function stringFromRecord(record: Record<string, unknown> | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value : "";
}

function emptyToNull(value: string | null) {
  return value && value.trim() ? value : null;
}
