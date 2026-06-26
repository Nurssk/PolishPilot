import { GoogleGenAI } from "@google/genai";
import {
  buildCodeChangePrompt,
  type GenerateCodeChangeRequest,
  type GenerateCodeChangeResult
} from "../../../lib/ai/prompts/buildCodeChangePrompt";

export const runtime = "nodejs";

type GenerateCodeChangeErrorCode =
  | "MISSING_SCREENSHOT"
  | "MISSING_HTML"
  | "MISSING_GEMINI_API_KEY"
  | "GEMINI_CODE_CHANGE_FAILED"
  | "INVALID_GEMINI_JSON";

type RouteDebug = {
  screenshotExists?: boolean;
  screenshotLength?: number;
  scope?: GenerateCodeChangeRequest["scope"];
  originalHtmlChars?: number;
  selectedHtmlChars?: number;
  fullPageHtmlChars?: number;
  usedCssChars?: number;
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

    const body = (await request.json()) as Partial<GenerateCodeChangeRequest>;
    const payload = normalizePayload(body);
    const normalizedScreenshot = normalizeBase64Image(payload.screenshotBase64);

    debug.screenshotExists = Boolean(normalizedScreenshot);
    debug.screenshotLength = payload.screenshotBase64.length;
    debug.scope = payload.scope;
    debug.originalHtmlChars = payload.originalHtml.length;
    debug.selectedHtmlChars = payload.selectedHtml?.length ?? 0;
    debug.fullPageHtmlChars = payload.fullPageHtml?.length ?? 0;
    debug.usedCssChars = payload.usedCss?.length ?? 0;

    if (!normalizedScreenshot) {
      return errorResponse(requestId, startedAt, 400, {
        code: "MISSING_SCREENSHOT",
        message: "No screenshotBase64 was provided."
      }, debug);
    }

    if (!payload.originalHtml.trim()) {
      return errorResponse(requestId, startedAt, 400, {
        code: "MISSING_HTML",
        message: "No originalHtml was provided for the code change."
      }, debug);
    }

    const promptUsed = buildCodeChangePrompt(payload);
    debug.promptChars = promptUsed.length;

    const ai = new GoogleGenAI({ apiKey });
    const generated = await generateGeminiText(ai, normalizedScreenshot, promptUsed);
    debug.model = generated.model;
    debug.retryCount = generated.retryCount;

    const parsed = parseGeminiJson(generated.text);
    debug.jsonParseStrategy = parsed.strategy;
    const result = normalizeCodeChangeResult(parsed.value, payload);
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

    const isJsonError = /invalid json|modifiedHtml/i.test(safeErrorMessage(error));
    return errorResponse(requestId, startedAt, isJsonError ? 502 : 502, {
      code: isJsonError ? "INVALID_GEMINI_JSON" : "GEMINI_CODE_CHANGE_FAILED",
      message: isJsonError
        ? "Gemini returned an invalid code-change JSON response."
        : "Gemini code-change generation failed.",
      details: safeErrorMessage(error)
    }, debug);
  }
}

function normalizePayload(body: Partial<GenerateCodeChangeRequest>): GenerateCodeChangeRequest {
  const scope = body.scope === "whole-page" ? "whole-page" : "selected-block";
  const selectedHtml = stringValue(body.selectedHtml);
  const fullPageHtml = stringValue(body.fullPageHtml);
  const originalHtml =
    stringValue(body.originalHtml) ||
    (scope === "whole-page" ? fullPageHtml : selectedHtml);

  return {
    screenshotBase64: stringValue(body.screenshotBase64),
    scope,
    url: stringValue(body.url) || undefined,
    title: stringValue(body.title) || undefined,
    originalHtml,
    selectedHtml: selectedHtml || undefined,
    fullPageHtml: fullPageHtml || undefined,
    usedCss: stringValue(body.usedCss) || undefined,
    styleContext: body.styleContext,
    styleTokens: body.styleTokens,
    aiResult: body.aiResult,
    recommendations: Array.isArray(body.recommendations)
      ? body.recommendations
          .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
          .slice(0, 24)
      : [],
    selectedPattern: body.selectedPattern,
    selectedTemplateReference: body.selectedTemplateReference,
    selectedAnimationReference: body.selectedAnimationReference
  };
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
              temperature: 0.2,
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

function normalizeCodeChangeResult(
  value: unknown,
  payload: GenerateCodeChangeRequest
): GenerateCodeChangeResult {
  if (!isRecord(value)) {
    throw new Error("Gemini code-change JSON must be an object.");
  }

  const modifiedHtml = stringOrLines(value.modifiedHtml, value.modifiedHtmlLines).trim();

  if (!modifiedHtml) {
    throw new Error("Gemini code-change JSON must include modifiedHtmlLines.");
  }

  const diffSummary =
    stringValue(value.diffSummary).trim() ||
    "Generated a revised rendered HTML snapshot for review.";
  const modifiedCss =
    stringOrLines(value.modifiedCss, value.modifiedCssLines).trim() ||
    payload.usedCss?.trim() ||
    buildMinimalFallbackCss();
  const fullHtmlDocument = buildStandaloneHtmlDocument({
    title: payload.title,
    html: modifiedHtml,
    css: modifiedCss,
    scope: payload.scope
  });
  const warnings = Array.isArray(value.warnings)
    ? value.warnings
        .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
        .slice(0, 8)
    : [];
  const cursorPrompt =
    stringValue(value.cursorPrompt).trim() ||
    buildFallbackCursorPrompt(payload, modifiedHtml, modifiedCss, diffSummary);

  if (!/rendered dom|rendered html|actual source|source files|map/i.test(cursorPrompt)) {
    warnings.push(
      "The generated source-code prompt was missing an explicit rendered-DOM mapping note; review before applying."
    );
  }

  return {
    modifiedHtml,
    modifiedCss,
    fullHtmlDocument,
    diffSummary,
    cursorPrompt,
    warnings
  };
}

function buildFallbackCursorPrompt(
  payload: GenerateCodeChangeRequest,
  modifiedHtml: string,
  modifiedCss: string,
  diffSummary: string
) {
  return `Use this rendered HTML/CSS rewrite as implementation guidance for the real codebase.
The original HTML/CSS is rendered DOM/CSS, not guaranteed source code. First map the block back to the actual React/Next/Vue/static source files, then apply the same structural, copy, and style changes there.

Scope: ${payload.scope}
Summary: ${diffSummary}

Modified rendered HTML:
${modifiedHtml}

Modified rendered CSS:
${modifiedCss}`;
}

function buildStandaloneHtmlDocument({
  title,
  html,
  css,
  scope
}: {
  title?: string;
  html: string;
  css: string;
  scope: GenerateCodeChangeRequest["scope"];
}) {
  if (/<!doctype html|<html[\s>]/i.test(html)) {
    return injectCssIntoHtmlDocument(html, css);
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title || `Design Humanizer ${scope}`)}</title>
    <style>
${css}
    </style>
  </head>
  <body>
${html}
  </body>
</html>`;
}

function injectCssIntoHtmlDocument(html: string, css: string) {
  const styleTag = `<style>\n${css}\n</style>`;

  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${styleTag}\n</head>`);
  }

  if (/<html[\s>]/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, `<html$1><head>${styleTag}</head>`);
  }

  return `<!doctype html><html><head>${styleTag}</head><body>${html}</body></html>`;
}

function buildMinimalFallbackCss() {
  return `body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #111111;
  background: #ffffff;
}

img, svg, video, canvas {
  max-width: 100%;
}

a {
  color: inherit;
}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
    ...extractJsonCandidates(cleaned).map((candidate) => ({
      text: candidate,
      strategy: "extracted" as JsonParseStrategy
    }))
  ];

  for (const candidate of candidates) {
    try {
      return {
        value: JSON.parse(candidate.text),
        strategy: candidate.strategy
      };
    } catch {
      // Try the next parsing strategy.
    }
  }

  for (const candidate of candidates) {
    const repaired = repairLikelyJson(candidate.text);

    if (repaired === candidate.text) continue;

    try {
      return {
        value: JSON.parse(repaired),
        strategy: "repaired" as JsonParseStrategy
      };
    } catch {
      // Keep trying remaining candidates.
    }
  }

  throw new Error("Gemini returned invalid JSON.");
}

function extractJsonCandidates(text: string) {
  const candidates: string[] = [];
  const objectCandidate = extractBalancedJson(text, "{", "}");

  if (objectCandidate) candidates.push(objectCandidate);

  return candidates;
}

function extractBalancedJson(text: string, open: string, close: string) {
  const start = text.indexOf(open);
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === open) depth += 1;
    if (char === close) depth -= 1;

    if (depth === 0) {
      return text.slice(start, index + 1);
    }
  }

  return null;
}

function repairLikelyJson(text: string) {
  return text
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/([{,]\s*)([A-Za-z0-9_$-]+)\s*:/g, '$1"$2":');
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(
        () => reject(new Error(`Gemini request timed out after ${timeoutMs}ms.`)),
        timeoutMs
      );
    })
  ]);
}

function isModelAvailabilityError(error: unknown) {
  const message = safeErrorMessage(error);
  return /not found|not available|unsupported|permission|model/i.test(message);
}

function isTransientGeminiError(error: unknown) {
  const message = safeErrorMessage(error);
  return (
    /network|fetch|timeout|timed out|temporar/i.test(message) ||
    TRANSIENT_STATUS_CODES.some((status) => message.includes(String(status)))
  );
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function stringOrLines(value: unknown, lines: unknown) {
  const direct = stringValue(value);
  if (direct.trim()) return direct;

  if (!Array.isArray(lines)) return "";

  return lines
    .filter((line): line is string => typeof line === "string")
    .join("\n");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function safeErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function jsonResponse(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: corsHeaders
  });
}

function errorResponse(
  requestId: string,
  startedAt: number,
  status: number,
  error: {
    code: GenerateCodeChangeErrorCode;
    message: string;
    details?: string;
  },
  debug: RouteDebug = {}
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
