import { GoogleGenAI } from "@google/genai";
import {
  buildSourcePatchPrompt,
  type GenerateSourcePatchRequest,
  type GenerateSourcePatchResult,
  type SourceFileCandidate,
  type SourcePatchEdit
} from "../../../lib/ai/prompts/buildSourcePatchPrompt";

export const runtime = "nodejs";

type GenerateSourcePatchErrorCode =
  | "MISSING_SCREENSHOT"
  | "MISSING_RENDERED_CHANGE"
  | "MISSING_CANDIDATES"
  | "MISSING_GEMINI_API_KEY"
  | "GEMINI_SOURCE_PATCH_FAILED"
  | "INVALID_GEMINI_JSON";

type RouteDebug = {
  screenshotExists?: boolean;
  screenshotLength?: number;
  scope?: GenerateSourcePatchRequest["scope"];
  originalHtmlChars?: number;
  modifiedHtmlChars?: number;
  candidateCount?: number;
  promptChars?: number;
  model?: string;
  retryCount?: number;
  jsonParseStrategy?: JsonParseStrategy;
  durationMs?: number;
};

type JsonParseStrategy = "direct" | "extracted" | "repaired";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const GEMINI_TIMEOUT_MS = 45_000;
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;
const TRANSIENT_STATUS_CODES = [408, 409, 425, 429, 500, 502, 503, 504];

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  const debug: RouteDebug = {};

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return errorResponse(requestId, startedAt, 500, {
        code: "MISSING_GEMINI_API_KEY",
        message: "GEMINI_API_KEY is not configured in web/.env.local"
      }, debug);
    }

    const body = (await request.json()) as Partial<GenerateSourcePatchRequest>;
    const payload = normalizePayload(body);
    const normalizedScreenshot = normalizeBase64Image(payload.screenshotBase64);

    debug.screenshotExists = Boolean(normalizedScreenshot);
    debug.screenshotLength = payload.screenshotBase64.length;
    debug.scope = payload.scope;
    debug.originalHtmlChars = payload.originalHtml.length;
    debug.modifiedHtmlChars = payload.modifiedHtml.length;
    debug.candidateCount = payload.candidateFiles.length;

    if (!normalizedScreenshot) {
      return errorResponse(requestId, startedAt, 400, {
        code: "MISSING_SCREENSHOT",
        message: "No screenshotBase64 was provided."
      }, debug);
    }

    if (!payload.originalHtml.trim() || !payload.modifiedHtml.trim()) {
      return errorResponse(requestId, startedAt, 400, {
        code: "MISSING_RENDERED_CHANGE",
        message: "Both originalHtml and modifiedHtml are required."
      }, debug);
    }

    if (!payload.candidateFiles.length) {
      return errorResponse(requestId, startedAt, 400, {
        code: "MISSING_CANDIDATES",
        message: "No ranked source file candidates were provided."
      }, debug);
    }

    const promptUsed = buildSourcePatchPrompt(payload);
    debug.promptChars = promptUsed.length;

    const ai = new GoogleGenAI({ apiKey });
    const generated = await generateGeminiText(ai, normalizedScreenshot, promptUsed);
    debug.model = generated.model;
    debug.retryCount = generated.retryCount;

    const parsed = parseGeminiJson(generated.text);
    debug.jsonParseStrategy = parsed.strategy;
    const result = normalizeSourcePatchResult(parsed.value);
    const durationMs = Date.now() - startedAt;
    debug.durationMs = durationMs;

    return jsonResponse(
      {
        ok: true,
        requestId,
        provider: "gemini",
        model: generated.model,
        durationMs,
        result,
        promptUsed,
        debug
      },
      200
    );
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    debug.durationMs = durationMs;

    const isJsonError = /invalid json|source patch|edits|originalSnippet/i.test(
      safeErrorMessage(error)
    );
    return errorResponse(requestId, startedAt, 502, {
      code: isJsonError ? "INVALID_GEMINI_JSON" : "GEMINI_SOURCE_PATCH_FAILED",
      message: isJsonError
        ? "Gemini returned an invalid source-patch JSON response."
        : "Gemini source-patch generation failed.",
      details: safeErrorMessage(error)
    }, debug);
  }
}

function normalizePayload(body: Partial<GenerateSourcePatchRequest>): GenerateSourcePatchRequest {
  return {
    screenshotBase64: stringValue(body.screenshotBase64),
    scope: body.scope === "whole-page" ? "whole-page" : "selected-block",
    url: stringValue(body.url) || undefined,
    title: stringValue(body.title) || undefined,
    originalHtml: stringValue(body.originalHtml),
    originalCss: stringValue(body.originalCss) || undefined,
    modifiedHtml: stringValue(body.modifiedHtml),
    modifiedCss: stringValue(body.modifiedCss) || undefined,
    recommendations: Array.isArray(body.recommendations)
      ? body.recommendations
          .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
          .slice(0, 24)
      : [],
    selectedPattern: body.selectedPattern,
    selectedTemplateReference: body.selectedTemplateReference,
    selectedAnimationReference: body.selectedAnimationReference,
    candidateFiles: normalizeCandidates(body.candidateFiles)
  };
}

function normalizeCandidates(value: unknown): SourceFileCandidate[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item): SourceFileCandidate | null => {
      if (!isRecord(item)) return null;
      const path = stringValue(item.path).trim();
      const snippet = stringValue(item.snippet);
      if (!path || !snippet.trim()) return null;
      return {
        path,
        language: stringValue(item.language) || "text",
        size: numberValue(item.size),
        score: numberValue(item.score),
        reasons: stringArray(item.reasons).slice(0, 8),
        snippet,
        matchedTokens: stringArray(item.matchedTokens).slice(0, 30)
      };
    })
    .filter((item): item is SourceFileCandidate => Boolean(item))
    .slice(0, 12);
}

async function generateGeminiText(
  ai: GoogleGenAI,
  normalizedImage: string,
  prompt: string
) {
  let lastError: unknown = null;
  let retryCount = 0;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        if (attempt > 0) retryCount += 1;

        const response = await withTimeout(
          ai.models.generateContent({
            model,
            contents: [
              {
                inlineData: {
                  mimeType: "image/png",
                  data: normalizedImage
                }
              },
              {
                text: prompt
              }
            ],
            config: {
              responseMimeType: "application/json",
              temperature: 0.15,
              maxOutputTokens: 16384
            }
          }),
          GEMINI_TIMEOUT_MS
        );

        const text = response.text;
        if (!text) {
          throw new Error(`Gemini model ${model} returned no text.`);
        }

        return { text, model, retryCount };
      } catch (error) {
        lastError = error;

        if (isModelAvailabilityError(error)) {
          break;
        }

        if (attempt === 0 && isTransientGeminiError(error)) {
          continue;
        }

        throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("No Gemini Flash vision-capable model was available.");
}

function normalizeSourcePatchResult(value: unknown): GenerateSourcePatchResult {
  if (!isRecord(value)) {
    throw new Error("Gemini source patch JSON must be an object.");
  }

  const edits = Array.isArray(value.edits)
    ? value.edits
        .map((item, index): SourcePatchEdit | null => {
          if (!isRecord(item)) return null;
          const filePath = stringValue(item.filePath).trim();
          const originalSnippet = stringValue(item.originalSnippet);
          const replacementSnippet = stringValue(item.replacementSnippet);
          if (!filePath || !originalSnippet || !replacementSnippet) return null;
          return {
            id: stringValue(item.id).trim() || `edit-${index + 1}`,
            filePath,
            originalSnippet,
            replacementSnippet,
            explanation: stringValue(item.explanation).trim(),
            confidence: clamp(numberValue(item.confidence), 0, 1)
          };
        })
        .filter((item): item is SourcePatchEdit => Boolean(item))
        .slice(0, 16)
    : [];

  const warnings = stringArray(value.warnings).slice(0, 12);
  const manualInstructions = stringValue(value.manualInstructions).trim() || undefined;

  if (!edits.length && !manualInstructions) {
    warnings.push("Gemini did not find exact source snippets to edit.");
  }

  return {
    summary:
      stringValue(value.summary).trim() ||
      (edits.length
        ? `Generated ${edits.length} source edit${edits.length === 1 ? "" : "s"}.`
        : "No exact source edits were generated."),
    edits,
    warnings,
    manualInstructions
  };
}

function normalizeBase64Image(input: string | undefined) {
  return input?.replace(/^data:image\/\w+;base64,/, "").trim() ?? "";
}

function parseGeminiJson(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
  const candidates = [
    { text: cleaned, strategy: "direct" as JsonParseStrategy },
    {
      text: cleaned.match(/\{[\s\S]*\}/)?.[0] ?? "",
      strategy: "extracted" as JsonParseStrategy
    },
    {
      text: repairCommonJsonIssues(cleaned.match(/\{[\s\S]*\}/)?.[0] ?? cleaned),
      strategy: "repaired" as JsonParseStrategy
    }
  ];

  for (const candidate of candidates) {
    if (!candidate.text.trim()) continue;
    try {
      return { value: JSON.parse(candidate.text) as unknown, strategy: candidate.strategy };
    } catch {
      continue;
    }
  }

  throw new Error("Gemini returned invalid JSON for source patch.");
}

function repairCommonJsonIssues(text: string) {
  return text
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}

function errorResponse(
  requestId: string,
  startedAt: number,
  status: number,
  error: { code: GenerateSourcePatchErrorCode; message: string; details?: string },
  debug: RouteDebug
) {
  return jsonResponse(
    {
      ok: false,
      requestId,
      error,
      debug: {
        ...debug,
        durationMs: Date.now() - startedAt
      }
    },
    status
  );
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error(`Gemini source patch timed out after ${timeoutMs}ms.`)),
          timeoutMs
        );
      })
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function isTransientGeminiError(error: unknown) {
  const status = statusFromError(error);
  return status ? TRANSIENT_STATUS_CODES.includes(status) : /timeout|overloaded|temporar/i.test(safeErrorMessage(error));
}

function isModelAvailabilityError(error: unknown) {
  const message = safeErrorMessage(error);
  return /not found|not supported|permission|model/i.test(message) && /model|gemini/i.test(message);
}

function statusFromError(error: unknown) {
  if (isRecord(error)) {
    const status = error.status ?? error.statusCode ?? error.code;
    if (typeof status === "number") return status;
    if (typeof status === "string" && /^\d+$/.test(status)) return Number(status);
  }
  return undefined;
}

function safeErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
    : [];
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
