import { GoogleGenAI, Modality } from "@google/genai";
import {
  selectImageModel,
  toSdkModelName,
} from "../../../lib/ai/gemini/selectImageModel";
import {
  buildImagePreviewPrompt,
  type GenerateAIPreviewRequest,
} from "../../../lib/ai/prompts/buildImagePreviewPrompt";

export const runtime = "nodejs";

type GenerateAIPreviewErrorCode =
  | "MISSING_SCREENSHOT"
  | "MISSING_PATTERN"
  | "MISSING_GEMINI_API_KEY"
  | "GEMINI_IMAGE_MODEL_UNAVAILABLE"
  | "GEMINI_IMAGE_QUOTA_EXHAUSTED"
  | "GEMINI_IMAGE_GENERATION_FAILED"
  | "UNKNOWN_ERROR";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const GEMINI_TIMEOUT_MS = 60_000;

type RouteDebug = {
  screenshotExists?: boolean;
  screenshotLength?: number;
  selectedPatternId?: string;
  selectedPatternName?: string;
  templateMode?: GenerateAIPreviewRequest["templateMode"];
  hasTemplateImage?: boolean;
  availableImageModels?: string[];
  selectedModel?: string;
  sdkModelName?: string;
  orderedModelCandidates?: string[];
  modelSelectionWarning?: string;
  quotaError?: boolean;
  retryAfterSeconds?: number;
  modelAttempts?: ModelAttemptDebug[];
  callMode?: "gemini-image-edit" | "imagen-text-to-image";
  responseTopLevelKeys?: string[];
  imageInlineDataFound?: boolean;
  durationMs?: number;
};

type ModelAttemptDebug = {
  modelName: string;
  sdkModelName: string;
  callMode: "gemini-image-edit" | "imagen-text-to-image";
  status: "success" | "quota_error" | "generation_error";
  responseTopLevelKeys?: string[];
  imageInlineDataFound?: boolean;
  retryAfterSeconds?: number;
  error?: string;
};

class PreviewGenerationError extends Error {
  code: "GEMINI_IMAGE_QUOTA_EXHAUSTED" | "GEMINI_IMAGE_GENERATION_FAILED";
  status: number;

  constructor({
    code,
    message,
    status,
    details,
  }: {
    code: PreviewGenerationError["code"];
    message: string;
    status: number;
    details?: string;
  }) {
    super(details ? `${message} Details: ${details}` : message);
    this.name = "PreviewGenerationError";
    this.code = code;
    this.status = status;
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
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
        message: "GEMINI_API_KEY is not configured in web/.env.local",
      });
    }

    const body = (await request.json()) as Partial<GenerateAIPreviewRequest>;
    const screenshotBase64 =
      typeof body.screenshotBase64 === "string" ? body.screenshotBase64 : "";
    const normalizedScreenshot = normalizeBase64Image(screenshotBase64);

    debug.screenshotExists = Boolean(normalizedScreenshot);
    debug.screenshotLength = screenshotBase64.length;
    debug.selectedPatternId = body.selectedPattern?.id;
    debug.selectedPatternName = body.selectedPattern?.name;

    if (!normalizedScreenshot) {
      return errorResponse(requestId, startedAt, 400, {
        code: "MISSING_SCREENSHOT",
        message: "No screenshotBase64 was provided.",
      }, debug);
    }

    if (!body.selectedPattern || typeof body.selectedPattern.name !== "string") {
      return errorResponse(requestId, startedAt, 400, {
        code: "MISSING_PATTERN",
        message: "No selectedPattern was provided.",
      }, debug);
    }

    const templateMode = body.templateMode ?? "text-only";
    const normalizedTemplateImage =
      typeof body.templateImageBase64 === "string"
        ? normalizeBase64Image(body.templateImageBase64)
        : "";
    const hasTemplateImage = Boolean(normalizedTemplateImage);

    debug.templateMode = templateMode;
    debug.hasTemplateImage = hasTemplateImage;

    const payload: GenerateAIPreviewRequest = {
      screenshotBase64,
      url: typeof body.url === "string" ? body.url : undefined,
      title: typeof body.title === "string" ? body.title : undefined,
      aiResult: body.aiResult,
      selectedPattern: body.selectedPattern,
      previewContent: body.previewContent,
      styleContext: body.styleContext,
      templateMode,
      templateImageBase64: body.templateImageBase64,
    };
    const promptUsed = buildImagePreviewPrompt(payload);
    const ai = new GoogleGenAI({ apiKey });
    const selected = await selectImageModel(ai, process.env.GEMINI_IMAGE_MODEL);

    debug.availableImageModels = selected.availableImageModels;
    debug.selectedModel = selected.modelName;
    debug.sdkModelName = selected.modelName ? toSdkModelName(selected.modelName) : "";
    debug.orderedModelCandidates = selected.orderedModelCandidates;
    debug.modelSelectionWarning = selected.warning;

    console.log("[AI Preview]", {
      requestId,
      screenshotExists: debug.screenshotExists,
      screenshotLength: debug.screenshotLength,
      selectedPatternId: debug.selectedPatternId,
      selectedPatternName: debug.selectedPatternName,
      templateMode,
      availableImageModels: selected.availableImageModels,
      selectedModel: selected.modelName,
      sdkModelName: debug.sdkModelName,
      orderedModelCandidates: selected.orderedModelCandidates,
      modelSelectionWarning: selected.warning,
    });

    if (selected.availableImageModels.length === 0 || !selected.modelName) {
      return errorResponse(requestId, startedAt, 503, {
        code: "GEMINI_IMAGE_MODEL_UNAVAILABLE",
        message: "No Gemini image model is available for this key.",
      }, debug);
    }

    const generated = await generatePreviewImage({
      ai,
      modelCandidates: selected.orderedModelCandidates,
      normalizedScreenshot,
      prompt: promptUsed,
      normalizedTemplateImage,
      requestId,
      debug,
    });
    const durationMs = Date.now() - startedAt;

    debug.durationMs = durationMs;

    console.log("[AI Preview] generation complete", {
      requestId,
      selectedModel: debug.selectedModel,
      sdkModelName: debug.sdkModelName,
      responseTopLevelKeys: debug.responseTopLevelKeys,
      imageInlineDataFound: debug.imageInlineDataFound,
      durationMs,
    });

    return jsonResponse(
      {
        ok: true,
        requestId,
        provider: "gemini",
        model: generated.modelName,
        durationMs,
        previewImageBase64: `data:image/png;base64,${generated.imageBase64}`,
        promptUsed,
        debug,
      },
      200
    );
  } catch (error) {
    const durationMs = Date.now() - startedAt;

    debug.durationMs = durationMs;

    console.error("[AI Preview] generation failed", {
      requestId,
      selectedModel: debug.selectedModel,
      sdkModelName: debug.sdkModelName,
      availableImageModels: debug.availableImageModels,
      responseTopLevelKeys: debug.responseTopLevelKeys,
      imageInlineDataFound: debug.imageInlineDataFound,
      durationMs,
      error: safeErrorMessage(error),
    });

    if (error instanceof PreviewGenerationError) {
      return errorResponse(requestId, startedAt, error.status, {
        code: error.code,
        message:
          error.code === "GEMINI_IMAGE_QUOTA_EXHAUSTED"
            ? "AI image preview quota is exhausted for available image models. Use Live HTML/CSS Preview or try again later."
            : "Gemini image model is available, but preview generation failed.",
        details: safeErrorMessage(error),
      }, debug);
    }

    return errorResponse(requestId, startedAt, 502, {
      code: "GEMINI_IMAGE_GENERATION_FAILED",
      message: "Gemini image model is available, but preview generation failed.",
      details: safeErrorMessage(error),
    }, debug);
  }
}

async function generatePreviewImage({
  ai,
  modelCandidates,
  normalizedScreenshot,
  prompt,
  normalizedTemplateImage,
  requestId,
  debug,
}: {
  ai: GoogleGenAI;
  modelCandidates: string[];
  normalizedScreenshot: string;
  prompt: string;
  normalizedTemplateImage?: string;
  requestId: string;
  debug: RouteDebug;
}) {
  let lastError: unknown = null;
  let quotaErrorCount = 0;
  const attempts: ModelAttemptDebug[] = [];

  debug.modelAttempts = attempts;

  for (const selectedModel of modelCandidates) {
    const sdkModelName = toSdkModelName(selectedModel);
    const callMode = selectedModel.includes("/imagen-")
      ? "imagen-text-to-image"
      : "gemini-image-edit";
    const attempt: ModelAttemptDebug = {
      modelName: selectedModel,
      sdkModelName,
      callMode,
      status: "generation_error",
    };

    debug.selectedModel = selectedModel;
    debug.sdkModelName = sdkModelName;
    debug.callMode = callMode;
    attempts.push(attempt);

    console.log("[AI Preview] Gemini call start", {
      requestId,
      selectedModel,
      sdkModelName,
      callMode,
    });

    try {
      const response =
        callMode === "imagen-text-to-image"
          ? await withTimeout(
              ai.models.generateImages({
                model: sdkModelName,
                prompt,
                config: {
                  numberOfImages: 1,
                  includeRaiReason: true,
                },
              }),
              GEMINI_TIMEOUT_MS
            )
          : await withTimeout(
              ai.models.generateContent({
                model: sdkModelName,
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        inlineData: {
                          mimeType: "image/png",
                          data: normalizedScreenshot,
                        },
                      },
                      ...(normalizedTemplateImage
                        ? [
                            {
                              inlineData: {
                                mimeType: "image/png",
                                data: normalizedTemplateImage,
                              },
                            },
                          ]
                        : []),
                      {
                        text: prompt,
                      },
                    ],
                  },
                ],
                config: {
                  responseModalities: [Modality.TEXT, Modality.IMAGE],
                  temperature: 0.35,
                },
              }),
              GEMINI_TIMEOUT_MS
            );

      console.log("[AI Preview] Gemini call end", {
        requestId,
        selectedModel,
        sdkModelName,
      });

      const responseTopLevelKeys = topLevelKeys(response);
      const extracted = extractImageBase64FromGeminiResponse(response);

      attempt.responseTopLevelKeys = responseTopLevelKeys;
      attempt.imageInlineDataFound = extracted.found;
      debug.responseTopLevelKeys = responseTopLevelKeys;
      debug.imageInlineDataFound = extracted.found;

      if (!extracted.imageBase64) {
        throw new Error(
          `Gemini image model ${selectedModel} returned no image data. Response keys: ${
            responseTopLevelKeys.join(", ") || "none"
          }`
        );
      }

      attempt.status = "success";
      return {
        imageBase64: extracted.imageBase64,
        modelName: selectedModel,
      };
    } catch (error) {
      lastError = error;
      attempt.error = safeErrorMessage(error);

      if (isQuotaError(error)) {
        quotaErrorCount += 1;
        attempt.status = "quota_error";
        attempt.retryAfterSeconds = extractRetryAfterSeconds(error);
        debug.quotaError = true;
        debug.retryAfterSeconds = minDefined(
          debug.retryAfterSeconds,
          attempt.retryAfterSeconds
        );

        console.warn("[AI Preview] model quota exhausted, trying next candidate", {
          requestId,
          selectedModel,
          sdkModelName,
          retryAfterSeconds: attempt.retryAfterSeconds,
        });
        continue;
      }

      throw new PreviewGenerationError({
        code: "GEMINI_IMAGE_GENERATION_FAILED",
        status: 502,
        message: "Gemini image model is available, but preview generation failed.",
        details: safeErrorMessage(error),
      });
    }
  }

  if (quotaErrorCount > 0 && quotaErrorCount === modelCandidates.length) {
    throw new PreviewGenerationError({
      code: "GEMINI_IMAGE_QUOTA_EXHAUSTED",
      status: 429,
      message:
        "AI image preview quota is exhausted for available image models. Use Live HTML/CSS Preview or try again later.",
      details: safeErrorMessage(lastError),
    });
  }

  throw new PreviewGenerationError({
    code: "GEMINI_IMAGE_GENERATION_FAILED",
    status: 502,
    message: "Gemini image model is available, but preview generation failed.",
    details: safeErrorMessage(lastError),
  });
}

function extractImageBase64FromGeminiResponse(response: unknown) {
  const found = findImageBase64(response);

  return {
    imageBase64: found,
    found: Boolean(found),
  };
}

function findImageBase64(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findImageBase64(item);

      if (found) {
        return found;
      }
    }

    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const directData = value.data;

  if (typeof directData === "string" && directData.length > 100) {
    return directData;
  }

  const inlineData = value.inlineData ?? value.inline_data;

  if (isRecord(inlineData)) {
    const mimeType = inlineData.mimeType ?? inlineData.mime_type;

    if (
      typeof inlineData.data === "string" &&
      inlineData.data.length > 100 &&
      (typeof mimeType !== "string" || mimeType.startsWith("image/"))
    ) {
      return inlineData.data;
    }
  }

  const image = value.image;

  if (isRecord(image) && typeof image.imageBytes === "string" && image.imageBytes) {
    return image.imageBytes;
  }

  if (typeof value.imageBytes === "string" && value.imageBytes) {
    return value.imageBytes;
  }

  for (const child of Object.values(value)) {
    const found = findImageBase64(child);

    if (found) {
      return found;
    }
  }

  return null;
}

function isQuotaError(error: unknown) {
  const message = safeErrorMessage(error);
  return /429|RESOURCE_EXHAUSTED|quota|rate-limits|rate limit/i.test(message);
}

function extractRetryAfterSeconds(error: unknown) {
  const message = safeErrorMessage(error);
  const retryInfoMatch = message.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/i);

  if (retryInfoMatch) {
    return Math.ceil(Number(retryInfoMatch[1]));
  }

  const retryTextMatch = message.match(/retry in\s+(\d+(?:\.\d+)?)s/i);

  if (retryTextMatch) {
    return Math.ceil(Number(retryTextMatch[1]));
  }

  return undefined;
}

function minDefined(current: number | undefined, next: number | undefined) {
  if (typeof current !== "number") {
    return next;
  }

  if (typeof next !== "number") {
    return current;
  }

  return Math.min(current, next);
}

function normalizeBase64Image(input: string | undefined) {
  return input?.replace(/^data:image\/\w+;base64,/, "").trim() ?? "";
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(
        () => reject(new Error(`Gemini image request timed out after ${timeoutMs}ms.`)),
        timeoutMs
      );
    }),
  ]);
}

function topLevelKeys(value: unknown) {
  return isRecord(value) ? Object.keys(value) : [];
}

function jsonResponse(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: corsHeaders,
  });
}

function errorResponse(
  requestId: string,
  startedAt: number,
  status: number,
  error: {
    code: GenerateAIPreviewErrorCode;
    message: string;
    details?: string;
  },
  debug?: RouteDebug
) {
  return jsonResponse(
    {
      ok: false,
      requestId,
      error,
      debug: {
        ...debug,
        durationMs: Date.now() - startedAt,
      },
    },
    status
  );
}

function safeErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
