import "../styles/tailwind.css";
import { useEffect, useMemo, useState } from "react";
import {
  AI_PREVIEW_STORAGE_KEY,
  FULL_PREVIEW_STORAGE_KEY,
  LATEST_AI_RESULT_STORAGE_KEY,
  LATEST_CAPTURE_STORAGE_KEY,
  POLISH_PILOT_MODE_STORAGE_KEY,
  SELECTED_PATTERN_STORAGE_KEY,
  formatPixels,
  isPolishPilotMessage
} from "../shared/messages";
import { PatternCard } from "../components/PatternCard";
import { buildHumanizedPreviewHtml } from "../patterns/buildHumanizedPreviewHtml";
import {
  extractPreviewContent,
  type PreviewContent
} from "../patterns/extractPreviewItems";
import { generateCursorPrompt } from "../patterns/generateCursorPrompt";
import { selectHumanizerSuggestions } from "../patterns/selectHumanizerSuggestions";
import {
  appendPreviewDebugLogs,
  createPreviewDebugLog,
  sanitizeDebugCss,
  sanitizeDebugHtml,
  sanitizePreviewDebugLogs,
  truncateDebugText,
  type PreviewDebugLog
} from "../shared/previewDebug";
import type { LayoutPattern, LayoutPatternId } from "../patterns/layoutPatterns";
import type { AnimationReference } from "../patterns/animationReferences";
import type { BuildHumanizedPreviewHtmlResult } from "../patterns/buildHumanizedPreviewHtml";
import { templateReferences, type TemplateReference } from "../patterns/templateReferences";
import type {
  AIUnderstandingResult,
  PolishPilotMode,
  RectangleCapture
} from "../shared/types";

const ANALYZE_URL = "http://localhost:3000/api/analyze-area";
const AI_PREVIEW_URL = "http://localhost:3000/api/generate-ai-preview";
const HEALTH_URL = "http://localhost:3000/api/health";
const SIMPLE_BACKEND_ERROR =
  "Gemini backend is not running. Start it with: cd web && npm run dev";

type AIStatus = "idle" | "loading" | "success" | "error";
type BackendHealthStatus = "checking" | "online" | "offline";
type GeminiLogEntry = {
  id: string;
  time: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
  data?: Record<string, unknown>;
};
type GeminiApiError = {
  code: string;
  message: string;
  details?: string;
  stage: "validation" | "gemini_request" | "gemini_response" | "json_parse" | "unknown";
};
type GeminiDebugState = {
  requestId?: string;
  model?: string;
  durationMs?: number;
  retryCount?: number;
  screenshotLength?: number;
  matchedElementsCount?: number;
  jsonParseStrategy?: "direct" | "extracted" | "repaired" | "fallback";
  error?: GeminiApiError;
};
type AIPreviewStatus = "idle" | "loading" | "success" | "error";
type AIPreviewDebugState = {
  requestId?: string;
  model?: string;
  durationMs?: number;
  screenshotLength?: number;
  templateMode?: "text-only" | "schematic-image" | "both";
  hasTemplateImage?: boolean;
  availableImageModels?: string[];
  selectedModel?: string;
  sdkModelName?: string;
  orderedModelCandidates?: string[];
  modelSelectionWarning?: string;
  quotaError?: boolean;
  retryAfterSeconds?: number;
  modelAttempts?: Array<Record<string, unknown>>;
  callMode?: string;
  responseTopLevelKeys?: string[];
  imageInlineDataFound?: boolean;
  promptUsed?: string;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
};
type AnalyzeAreaSuccessResponse = {
  ok: true;
  requestId: string;
  model: string;
  durationMs: number;
  result: AIUnderstandingResult;
  debug?: {
    screenshotLength?: number;
    matchedElementsCount?: number;
    rawResponseLength?: number;
    jsonParseStrategy?: "direct" | "extracted" | "repaired" | "fallback";
    retryCount?: number;
  };
};
type GenerateAIPreviewSuccessResponse = {
  ok: true;
  requestId: string;
  provider: "gemini";
  model: string;
  durationMs: number;
  previewImageBase64: string;
  promptUsed: string;
  debug?: {
    screenshotLength: number;
    templateMode: "text-only" | "schematic-image" | "both";
    hasTemplateImage: boolean;
    availableImageModels?: string[];
    selectedModel?: string;
    sdkModelName?: string;
    orderedModelCandidates?: string[];
    modelSelectionWarning?: string;
    quotaError?: boolean;
    retryAfterSeconds?: number;
    modelAttempts?: Array<Record<string, unknown>>;
    callMode?: string;
    responseTopLevelKeys?: string[];
    imageInlineDataFound?: boolean;
  };
};
type GenerateAIPreviewErrorResponse = {
  ok: false;
  requestId?: string;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  debug?: Record<string, unknown>;
};
type AnalyzeAreaErrorResponse = {
  ok: false;
  requestId?: string;
  error?: GeminiApiError;
  debug?: {
    model?: string;
    durationMs?: number;
    screenshotLength?: number;
    matchedElementsCount?: number;
    retryCount?: number;
  };
};

export function SidePanel() {
  const [mode, setMode] = useState<PolishPilotMode>("simple");
  const [capture, setCapture] = useState<RectangleCapture | null>(null);
  const [hasLoadedCapture, setHasLoadedCapture] = useState(false);
  const [aiResult, setAIResult] = useState<AIUnderstandingResult | null>(null);
  const [aiStatus, setAIStatus] = useState<AIStatus>("idle");
  const [aiError, setAIError] = useState("");
  const [backendHealthStatus, setBackendHealthStatus] =
    useState<BackendHealthStatus>("checking");
  const [backendHealthError, setBackendHealthError] = useState("");
  const [selectedPatternId, setSelectedPatternId] =
    useState<LayoutPatternId | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedAnimationId, setSelectedAnimationId] = useState<string | null>(null);
  const [copiedPatternId, setCopiedPatternId] = useState<LayoutPatternId | null>(null);
  const [pagePreviewStatus, setPagePreviewStatus] = useState("");
  const [lastAnalyzedCaptureId, setLastAnalyzedCaptureId] = useState<string | null>(
    null
  );
  const [geminiDebug, setGeminiDebug] = useState<GeminiDebugState>({});
  const [aiPreviewStatus, setAIPreviewStatus] = useState<AIPreviewStatus>("idle");
  const [aiPreviewError, setAIPreviewError] = useState("");
  const [aiPreviewDebug, setAIPreviewDebug] = useState<AIPreviewDebugState>({});
  const [geminiLogs, setGeminiLogs] = useState<GeminiLogEntry[]>([]);
  const [debugCopied, setDebugCopied] = useState(false);
  const [previewDebugCopied, setPreviewDebugCopied] = useState(false);

  useEffect(() => {
    void refreshData();
    void checkBackendHealth();

    function handleStorageChange(
      changes: Record<string, chrome.storage.StorageChange>,
      areaName: string
    ) {
      if (areaName === "local") {
        const nextMode = changes[POLISH_PILOT_MODE_STORAGE_KEY]?.newValue;
        if (nextMode === "simple" || nextMode === "developer") setMode(nextMode);
        return;
      }

      if (areaName !== "session") return;

      const nextCapture = changes[LATEST_CAPTURE_STORAGE_KEY]?.newValue as
        | RectangleCapture
        | undefined;
      const nextAIResult = changes[LATEST_AI_RESULT_STORAGE_KEY]?.newValue as
        | AIUnderstandingResult
        | undefined;
      const nextPatternId = changes[SELECTED_PATTERN_STORAGE_KEY]?.newValue as
        | LayoutPatternId
        | undefined;

      if (nextCapture) {
        setCapture((current) => {
          const isSameCapture = current?.captureId === nextCapture.captureId;

          if (!isSameCapture) {
            setAIResult(null);
            setAIStatus("idle");
            setAIError("");
            setGeminiDebug({});
            setAIPreviewStatus("idle");
            setAIPreviewError("");
            setAIPreviewDebug({});
            setSelectedPatternId(null);
            setSelectedTemplateId(null);
            setSelectedAnimationId(null);
          }

          return nextCapture;
        });
      }
      if (nextAIResult) {
        setAIResult(nextAIResult);
        setAIStatus("success");
      }
      if (nextPatternId) setSelectedPatternId(nextPatternId);
    }

    function handleRuntimeMessage(message: unknown) {
      if (!isPolishPilotMessage(message)) return;
      if (message.type === "CAPTURE_UPDATED") {
        setCapture(message.capture);
        setAIResult(null);
        setAIStatus("idle");
        setAIError("");
        setGeminiDebug({});
        setAIPreviewStatus("idle");
        setAIPreviewError("");
        setAIPreviewDebug({});
        setSelectedPatternId(null);
        setSelectedTemplateId(null);
        setSelectedAnimationId(null);
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange);
    chrome.runtime.onMessage.addListener(handleRuntimeMessage);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
      chrome.runtime.onMessage.removeListener(handleRuntimeMessage);
    };
  }, []);

  useEffect(() => {
    if (mode !== "simple" || !capture || aiResult || aiStatus === "loading") return;

    const captureKey = capture.captureId || `${capture.screenshotBase64.length}`;
    if (lastAnalyzedCaptureId === captureKey) return;

    setLastAnalyzedCaptureId(captureKey);
    void analyzeWithGemini(capture, true);
  }, [aiResult, aiStatus, capture, lastAnalyzedCaptureId, mode]);

  const imageSrc = getScreenshotImageSrc(capture?.screenshotBase64);
  const effectiveAIResult = useMemo(
    () => aiResult ?? (capture ? buildFallbackAIResultFromCapture(capture) : null),
    [aiResult, capture]
  );
  const suggestions = useMemo(
    () =>
      effectiveAIResult
        ? selectHumanizerSuggestions({
            aiResult: effectiveAIResult,
            limit: { templates: mode === "developer" ? 4 : 12 }
          })
        : null,
    [effectiveAIResult, mode]
  );
  const suggestedPatterns = suggestions?.layoutPatterns ?? [];
  const suggestedTemplates = useMemo(
    () =>
      (suggestions?.templateReferences ?? []).filter(
        (reference) => mode === "developer" || reference.urlStatus !== "broken"
      ).slice(0, 4),
    [mode, suggestions]
  );
  const suggestedAnimations = suggestions?.animationReferences ?? [];
  const selectedPattern =
    suggestedPatterns.find((pattern) => pattern.id === selectedPatternId) ??
    suggestedPatterns[0] ??
    null;
  const selectedTemplate =
    suggestedTemplates.find((reference) => reference.id === selectedTemplateId) ?? null;
  const selectedAnimation =
    suggestedAnimations.find((reference) => reference.id === selectedAnimationId) ?? null;

  async function refreshData() {
    const [localResult, sessionResult] = await Promise.all([
      chrome.storage.local.get(POLISH_PILOT_MODE_STORAGE_KEY),
      chrome.storage.session.get([
        LATEST_CAPTURE_STORAGE_KEY,
        LATEST_AI_RESULT_STORAGE_KEY,
        SELECTED_PATTERN_STORAGE_KEY
      ])
    ]);
    const storedMode = localResult[POLISH_PILOT_MODE_STORAGE_KEY];
    if (storedMode === "simple" || storedMode === "developer") setMode(storedMode);

    setCapture((sessionResult[LATEST_CAPTURE_STORAGE_KEY] as RectangleCapture | undefined) ?? null);
    const storedAIResult = sessionResult[LATEST_AI_RESULT_STORAGE_KEY] as
      | AIUnderstandingResult
      | undefined;
    setAIResult(storedAIResult ?? null);
    setAIStatus(storedAIResult ? "success" : "idle");
    setSelectedPatternId(
      (sessionResult[SELECTED_PATTERN_STORAGE_KEY] as LayoutPatternId | undefined) ?? null
    );
    setHasLoadedCapture(true);
  }

  async function updateMode(nextMode: PolishPilotMode) {
    setMode(nextMode);
    await chrome.storage.local.set({ [POLISH_PILOT_MODE_STORAGE_KEY]: nextMode });
  }

  async function checkBackendHealth() {
    addGeminiLog("info", "Health check started", { url: HEALTH_URL });
    setBackendHealthStatus("checking");
    setBackendHealthError("");

    try {
      const response = await fetch(HEALTH_URL, { method: "GET", cache: "no-store" });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body || typeof body !== "object" || !("ok" in body)) {
        throw new Error(`Backend health returned ${response.status}`);
      }
      setBackendHealthStatus("online");
      addGeminiLog("success", "Health check succeeded", { status: response.status });
    } catch (error) {
      setBackendHealthStatus("offline");
      setBackendHealthError(
        isFetchFailure(error)
          ? SIMPLE_BACKEND_ERROR
          : error instanceof Error
            ? error.message
            : String(error)
      );
      addGeminiLog("error", "Health check failed", {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async function analyzeWithGemini(
    targetCapture = capture,
    simpleMode = mode === "simple"
  ) {
    if (!targetCapture) {
      setAIStatus("error");
      setAIError("Select an area before analyzing.");
      setGeminiDebug({
        error: {
          code: "NO_CAPTURE",
          message: "Select an area before analyzing.",
          stage: "validation"
        }
      });
      addGeminiLog("warn", "Analyze requested without capture");
      return;
    }

    setAIStatus("loading");
    setAIError("");
    setDebugCopied(false);
    setGeminiDebug({
      screenshotLength: targetCapture.screenshotBase64.length,
      matchedElementsCount: targetCapture.matchedElements.length
    });
    addGeminiLog("info", simpleMode ? "Auto-analysis started" : "Analyze clicked", {
      url: ANALYZE_URL
    });
    addGeminiLog("info", "Request payload summary", {
      screenshotLength: targetCapture.screenshotBase64.length,
      matchedElementsCount: targetCapture.matchedElements.length,
      selectedWidth: Math.round(targetCapture.selectedRect.width),
      selectedHeight: Math.round(targetCapture.selectedRect.height)
    });

    try {
      const response = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildAnalyzePayload(targetCapture))
      });
      const body = await response.json().catch(() => null);
      addGeminiLog("info", "Response received", { status: response.status });

      if (!response.ok || isWrappedErrorResponse(body)) {
      const parsedError = parseAnalyzeError(body, response.status);
        setGeminiDebug(debugFromErrorResponse(body, parsedError));
        addGeminiLog("error", "Gemini response error", {
          code: parsedError.code,
          stage: parsedError.stage,
          message: parsedError.message
        });
        setAIStatus("error");
        setAIError(simpleMode ? simpleGeminiErrorMessage(parsedError) : formatGeminiError(parsedError));
        const fallbackResult = buildFallbackAIResultFromCapture(targetCapture);
        setAIResult(fallbackResult);
        await chrome.storage.session.set({ [LATEST_AI_RESULT_STORAGE_KEY]: fallbackResult });
        return;
      }

      const parsedResponse = parseAnalyzeSuccess(body);
      const result = parsedResponse.result;
      setGeminiDebug(parsedResponse.debug);
      setAIResult(result);
      setAIStatus("success");
      setSelectedPatternId(null);
      setSelectedTemplateId(null);
      setSelectedAnimationId(null);
      await chrome.storage.session.set({ [LATEST_AI_RESULT_STORAGE_KEY]: result });
      await chrome.storage.session.remove(SELECTED_PATTERN_STORAGE_KEY);
      addGeminiLog("success", "Result parsed", {
        requestId: parsedResponse.debug.requestId ?? "",
        model: parsedResponse.debug.model ?? "",
        durationMs: parsedResponse.debug.durationMs ?? 0,
        jsonParseStrategy: parsedResponse.debug.jsonParseStrategy ?? ""
      });
    } catch (error) {
      const fallbackError: GeminiApiError = {
        code: isFetchFailure(error) ? "BACKEND_UNREACHABLE" : "EXTENSION_ANALYZE_FAILED",
        message: isFetchFailure(error)
          ? "Cannot reach backend. Make sure `cd web && npm run dev` is running."
          : error instanceof Error
            ? error.message
            : String(error),
        stage: "unknown"
      };
      setGeminiDebug((current) => ({
        ...current,
        error: fallbackError
      }));
      addGeminiLog("error", "Analyze error caught", {
        code: fallbackError.code,
        message: fallbackError.message
      });
      setAIStatus("error");
      const fallbackResult = buildFallbackAIResultFromCapture(targetCapture);
      setAIResult(fallbackResult);
      await chrome.storage.session.set({ [LATEST_AI_RESULT_STORAGE_KEY]: fallbackResult });
      setAIError(
        simpleMode ? simpleGeminiErrorMessage(fallbackError) : formatGeminiError(fallbackError)
      );
    }
  }

  async function selectPattern(pattern: LayoutPattern) {
    setSelectedPatternId(pattern.id);
    await chrome.storage.session.set({
      [SELECTED_PATTERN_STORAGE_KEY]: pattern.id
    });
  }

  async function openTemplateReference(reference: TemplateReference) {
    const targetUrl =
      reference.urlStatus === "broken"
        ? reference.fallbackUrl
        : reference.url;

    if (!targetUrl) {
      setPagePreviewStatus("Reference unavailable.");
      return;
    }

    if (reference.urlStatus === "broken") {
      setPagePreviewStatus("Reference unavailable. Opening the 21st.dev fallback page.");
    } else if (reference.urlStatus === "unknown" || !reference.urlStatus) {
      setPagePreviewStatus("This external reference may be unavailable.");
    } else {
      setPagePreviewStatus("Opening reference.");
    }

    await chrome.tabs.create({ url: targetUrl });
  }

  async function copyPatternPrompt(pattern: LayoutPattern) {
    const prompt = generateCursorPrompt({
      pattern,
      aiResult: effectiveAIResult,
      capture,
      templateReference: selectedTemplate,
      animationReference: selectedAnimation
    });
    await navigator.clipboard.writeText(prompt);
    setCopiedPatternId(pattern.id);
    window.setTimeout(() => {
      setCopiedPatternId((current) => (current === pattern.id ? null : current));
    }, 1800);
  }

  async function openFullPreview() {
    if (!capture || !selectedPattern) {
      setPagePreviewStatus("Select a pattern first.");
      return;
    }

    const previewContent = extractPreviewContent({ capture, aiResult: effectiveAIResult });
    const builtPreview = buildHumanizedPreviewHtml({
      pattern: selectedPattern,
      content: previewContent,
      styleTokens: capture.styleTokens
    });
    const nextCapture = await appendPreviewLogsToCapture(capture, [
      createPreviewContentLog(previewContent),
      createHtmlGenerationLog(selectedPattern, builtPreview),
      createPreviewIframeSummaryLog(builtPreview, capture)
    ]);

    await chrome.storage.session.set({
      [FULL_PREVIEW_STORAGE_KEY]: {
        patternId: selectedPattern.id,
        pattern: selectedPattern,
        previewContent,
        styleContext: nextCapture.styleContext,
        sectionType: effectiveAIResult?.sectionType ?? capture.detected.sectionType,
        aiResult: effectiveAIResult,
        templateReference: selectedTemplate,
        animationReference: selectedAnimation,
        capture: nextCapture,
        captureId: nextCapture.captureId,
        mode
      }
    });

    await chrome.tabs.create({
      url: chrome.runtime.getURL("full-preview.html")
    });
  }

  async function showOnPage() {
    if (!capture || !selectedPattern) {
      setPagePreviewStatus("Select a pattern in the review window first.");
      return;
    }

    const previewContent = extractPreviewContent({ capture, aiResult: effectiveAIResult });
    const nextCapture = await appendPreviewLogsToCapture(capture, [
      createPreviewContentLog(previewContent)
    ]);
    const response = await chrome.runtime.sendMessage({
      type: "SHOW_IN_PAGE_PREVIEW",
      payload: {
        selectedRect: nextCapture.selectedRect,
        patternId: selectedPattern.id,
        patternName: selectedPattern.name,
        previewContent,
        styleContext: nextCapture.styleContext,
        usedCssRules: nextCapture.usedCssRules,
        styleTokens: nextCapture.styleTokens,
        problemNotes: [
          effectiveAIResult?.currentLayoutProblem,
          ...selectedPattern.problemSolved
        ].filter(Boolean)
      }
    });

    if (response && typeof response === "object" && "ok" in response && !response.ok) {
      setPagePreviewStatus(
        "error" in response ? String(response.error) : "Could not show page preview."
      );
      return;
    }

    setPagePreviewStatus("Preview shown on page.");
  }

  async function generateAIPreview() {
    if (!capture || !selectedPattern || !capture.screenshotBase64) {
      setAIPreviewStatus("error");
      setAIPreviewError("Select an area and a pattern before generating AI preview.");
      return;
    }

    const previewContent = extractPreviewContent({ capture, aiResult: effectiveAIResult });
    setAIPreviewStatus("loading");
    setAIPreviewError("");
    setAIPreviewDebug({
      screenshotLength: capture.screenshotBase64.length,
      templateMode: "text-only",
      hasTemplateImage: false
    });
    setPagePreviewStatus("Generating visual preview...");

    try {
      const response = await fetch(AI_PREVIEW_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screenshotBase64: capture.screenshotBase64,
          url: capture.url,
          title: capture.title,
          aiResult: effectiveAIResult,
          selectedPattern: {
            id: selectedPattern.id,
            name: selectedPattern.name,
            description: selectedPattern.problemSolved.join(" "),
            bestFor: selectedPattern.bestFor,
            tailwindHint: selectedPattern.tailwindHint,
            promptInstruction: selectedPattern.promptInstruction,
            exampleStructure: selectedPattern.exampleStructure
          },
          selectedTemplateReference: selectedTemplate,
          selectedAnimationReference: selectedAnimation,
          previewContent,
          styleContext: capture.styleContext,
          templateMode: "text-only"
        })
      });
      const body = (await response.json().catch(() => null)) as
        | GenerateAIPreviewSuccessResponse
        | GenerateAIPreviewErrorResponse
        | null;

      if (!response.ok || !body || body.ok !== true) {
        const errorBody = body && "ok" in body && body.ok === false ? body : null;
        const message = formatAIPreviewErrorMessage(errorBody?.error);
        setAIPreviewStatus("error");
        setAIPreviewError(message);
        setAIPreviewDebug({
          ...(errorBody?.debug as Partial<AIPreviewDebugState> | undefined),
          requestId: errorBody?.requestId,
          error: errorBody?.error
            ? {
                code: errorBody.error.code,
                message: errorBody.error.message,
                details: errorBody.error.details
              }
            : {
                code: "AI_PREVIEW_FAILED",
                message
              }
        });
        setPagePreviewStatus(message);
        addGeminiLog("error", "AI preview failed", {
          status: response.status,
          message,
          debug: errorBody?.debug
        });
        return;
      }

      setAIPreviewStatus("success");
      setAIPreviewError("");
      setAIPreviewDebug({
        requestId: body.requestId,
        model: body.model,
        durationMs: body.durationMs,
        screenshotLength: body.debug?.screenshotLength,
        templateMode: body.debug?.templateMode,
        hasTemplateImage: body.debug?.hasTemplateImage,
        availableImageModels: body.debug?.availableImageModels,
        selectedModel: body.debug?.selectedModel,
        sdkModelName: body.debug?.sdkModelName,
        orderedModelCandidates: body.debug?.orderedModelCandidates,
        modelSelectionWarning: body.debug?.modelSelectionWarning,
        quotaError: body.debug?.quotaError,
        retryAfterSeconds: body.debug?.retryAfterSeconds,
        modelAttempts: body.debug?.modelAttempts,
        callMode: body.debug?.callMode,
        responseTopLevelKeys: body.debug?.responseTopLevelKeys,
        imageInlineDataFound: body.debug?.imageInlineDataFound,
        promptUsed: body.promptUsed
      });

      await chrome.storage.session.set({
        [AI_PREVIEW_STORAGE_KEY]: {
          requestId: body.requestId,
          model: body.model,
          durationMs: body.durationMs,
          patternId: selectedPattern.id,
          patternName: selectedPattern.name,
          previewImageBase64: body.previewImageBase64,
          debug: body.debug
        }
      });

      const previewResponse = await chrome.runtime.sendMessage({
        type: "SHOW_AI_IMAGE_PREVIEW",
        payload: {
          previewImageBase64: body.previewImageBase64,
          patternName: selectedPattern.name
        }
      });

      if (
        previewResponse &&
        typeof previewResponse === "object" &&
        "ok" in previewResponse &&
        !previewResponse.ok
      ) {
        throw new Error(
          "error" in previewResponse
            ? String(previewResponse.error)
            : "Could not show AI preview on page."
        );
      }

      setPagePreviewStatus("AI visual preview shown on page.");
      addGeminiLog("success", "AI preview generated", {
        requestId: body.requestId,
        model: body.model,
        durationMs: body.durationMs
      });
    } catch (error) {
      const message = isFetchFailure(error)
        ? "AI visual preview failed. Make sure `cd web && npm run dev` is running. You can still use local layout preview or copy the implementation prompt."
        : error instanceof Error
          ? error.message
          : "AI visual preview failed. You can still use local layout preview or copy the implementation prompt.";
      setAIPreviewStatus("error");
      setAIPreviewError(message);
      setAIPreviewDebug((current) => ({
        ...current,
        error: {
          code: isFetchFailure(error) ? "BACKEND_UNREACHABLE" : "AI_PREVIEW_FAILED",
          message
        }
      }));
      setPagePreviewStatus(message);
      addGeminiLog("error", "AI preview error caught", { message });
    }
  }

  async function closePagePreview() {
    await chrome.runtime.sendMessage({ type: "REMOVE_IN_PAGE_PREVIEW" });
    setPagePreviewStatus("Page preview closed.");
  }

  async function startNewScreenshot() {
    setSelectedPatternId(null);
    setSelectedTemplateId(null);
    setSelectedAnimationId(null);
    setCopiedPatternId(null);
    setAIPreviewStatus("idle");
    setAIPreviewError("");
    setAIPreviewDebug({});
    setAIStatus((current) =>
      current === "loading" || current === "error" ? "idle" : current
    );
    setAIError("");
    setGeminiDebug({});
    setPagePreviewStatus("Drag to select a new area. Previous capture stays until replaced.");

    await chrome.storage.session.remove([
      SELECTED_PATTERN_STORAGE_KEY,
      FULL_PREVIEW_STORAGE_KEY,
      AI_PREVIEW_STORAGE_KEY
    ]);

    try {
      const response = await chrome.runtime.sendMessage({
        type: "START_NEW_SCREENSHOT"
      });

      if (
        response &&
        typeof response === "object" &&
        "ok" in response &&
        !response.ok
      ) {
        throw new Error(
          "error" in response
            ? String(response.error)
            : "Could not start screenshot selection."
        );
      }
    } catch (error) {
      setPagePreviewStatus(
        error instanceof Error ? error.message : "Could not start screenshot selection."
      );
    }
  }

  function addGeminiLog(
    level: GeminiLogEntry["level"],
    message: string,
    data?: Record<string, unknown>
  ) {
    setGeminiLogs((current) =>
      [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          time: new Date().toLocaleTimeString(),
          level,
          message,
          data
        },
        ...current
      ].slice(0, 20)
    );
  }

  async function copyDebugInfo() {
    const safeDebugInfo = {
      backendUrl: ANALYZE_URL,
      requestId: geminiDebug.requestId,
      model: geminiDebug.model,
      status: aiStatus,
      durationMs: geminiDebug.durationMs,
      retryCount: geminiDebug.retryCount,
      error: geminiDebug.error
        ? {
            code: geminiDebug.error.code,
            stage: geminiDebug.error.stage,
            message: geminiDebug.error.message,
            details: geminiDebug.error.details
          }
        : undefined,
      debug: {
        screenshotLength: geminiDebug.screenshotLength,
        matchedElementsCount: geminiDebug.matchedElementsCount,
        jsonParseStrategy: geminiDebug.jsonParseStrategy,
        aiPreview: {
          requestId: aiPreviewDebug.requestId,
          model: aiPreviewDebug.model,
          durationMs: aiPreviewDebug.durationMs,
          screenshotLength: aiPreviewDebug.screenshotLength,
          templateMode: aiPreviewDebug.templateMode,
          availableImageModels: aiPreviewDebug.availableImageModels,
          selectedModel: aiPreviewDebug.selectedModel,
          sdkModelName: aiPreviewDebug.sdkModelName,
          orderedModelCandidates: aiPreviewDebug.orderedModelCandidates,
          modelSelectionWarning: aiPreviewDebug.modelSelectionWarning,
          quotaError: aiPreviewDebug.quotaError,
          retryAfterSeconds: aiPreviewDebug.retryAfterSeconds,
          modelAttempts: aiPreviewDebug.modelAttempts,
          callMode: aiPreviewDebug.callMode,
          responseTopLevelKeys: aiPreviewDebug.responseTopLevelKeys,
          imageInlineDataFound: aiPreviewDebug.imageInlineDataFound,
          error: aiPreviewDebug.error
            ? {
                code: aiPreviewDebug.error.code,
                message: aiPreviewDebug.error.message,
                details: aiPreviewDebug.error.details
              }
            : undefined,
          promptUsedPreview: aiPreviewDebug.promptUsed
            ? truncateDebugText(aiPreviewDebug.promptUsed, 1200)
            : undefined
        },
        usedCssRuleCount: capture?.usedCssRules?.ruleCount,
        skippedStyleSheets: capture?.usedCssRules?.skippedStyleSheets,
        styleTokensAvailable: Boolean(capture?.styleTokens)
      }
    };

    await navigator.clipboard.writeText(JSON.stringify(safeDebugInfo, null, 2));
    setDebugCopied(true);
    window.setTimeout(() => setDebugCopied(false), 1800);
  }

  async function appendPreviewLogsToCapture(
    targetCapture: RectangleCapture,
    logs: PreviewDebugLog[]
  ) {
    const nextCapture = {
      ...targetCapture,
      previewDebugLogs: appendPreviewDebugLogs(targetCapture.previewDebugLogs, logs)
    };

    setCapture(nextCapture);
    await chrome.storage.session.set({
      [LATEST_CAPTURE_STORAGE_KEY]: nextCapture
    });

    return nextCapture;
  }

  async function copyPreviewDebugLogs() {
    const safeLogs = sanitizePreviewDebugLogs(capture?.previewDebugLogs ?? []);
    await navigator.clipboard.writeText(JSON.stringify(safeLogs, null, 2));
    setPreviewDebugCopied(true);
    window.setTimeout(() => setPreviewDebugCopied(false), 1800);
  }

  async function clearPreviewDebugLogs() {
    if (!capture) {
      return;
    }

    const nextCapture = {
      ...capture,
      previewDebugLogs: []
    };

    setCapture(nextCapture);
    await chrome.storage.session.set({
      [LATEST_CAPTURE_STORAGE_KEY]: nextCapture
    });
  }

  function createPreviewContentLog(previewContent: PreviewContent) {
    return createPreviewDebugLog(
      "preview-content-extraction",
      "Preview content extracted",
      {
        summary: {
          sectionTitle: previewContent.sectionTitle,
          sectionSubtitle: previewContent.sectionSubtitle,
          itemCount: previewContent.items?.length ?? 0,
          buttonCount: previewContent.items.filter((item) => item.cta).length,
          statCount: previewContent.items.filter((item) => item.sourceRole === "stat").length,
          formFieldCount: 0,
          testimonialCount: 0,
          pricingPlanCount: previewContent.items.filter((item) => item.value || item.cta).length,
          rootTagName: previewContent.rootTagName,
          rootClassName: previewContent.rootClassName,
          items: previewContent.items?.slice(0, 12).map((item) => ({
            title: item.title,
            description: truncateDebugText(item.description ?? "", 160),
            sourceRole: item.sourceRole,
            sourceTagName: item.sourceTagName,
            sourceClassName: item.sourceClassName
          }))
        }
      }
    );
  }

  function createHtmlGenerationLog(
    pattern: LayoutPattern,
    buildResult: BuildHumanizedPreviewHtmlResult
  ) {
    return createPreviewDebugLog(
      "html-generation",
      "Humanized preview HTML/CSS generated",
      {
        summary: {
          patternId: pattern.id,
          patternName: pattern.name,
          rendererUsed: buildResult.debug?.rendererUsed,
          preservedClassCount: buildResult.debug?.preservedClassCount,
          inlineFallbackUsed: buildResult.debug?.inlineFallbackUsed,
          generatedNodeCount: buildResult.debug?.generatedNodeCount
        },
        outputHtml: truncateDebugText(sanitizeDebugHtml(buildResult.html), 8000),
        outputCss: truncateDebugText(sanitizeDebugCss(buildResult.layoutCss), 8000)
      }
    );
  }

  function createPreviewIframeSummaryLog(
    buildResult: BuildHumanizedPreviewHtmlResult,
    targetCapture: RectangleCapture
  ) {
    const usedCssText = targetCapture.usedCssRules?.cssText ?? "";
    const estimatedDocumentLength =
      buildResult.html.length + buildResult.layoutCss.length + usedCssText.length;

    return createPreviewDebugLog(
      "iframe-render",
      "Preview iframe document prepared",
      {
        summary: {
          htmlLength: buildResult.html.length,
          usedCssLength: usedCssText.length,
          layoutCssLength: buildResult.layoutCss.length,
          totalDocumentLength: estimatedDocumentLength
        },
        htmlPreview: truncateDebugText(sanitizeDebugHtml(buildResult.html), 4000),
        cssPreview: truncateDebugText(
          sanitizeDebugCss(`${usedCssText}\n\n${buildResult.layoutCss}`),
          8000
        )
      }
    );
  }

  return (
    <main className="min-h-screen bg-pilot-bg px-3 py-3 text-pilot-text">
      <header className="sticky top-0 z-10 -mx-3 border-b border-slate-800 bg-pilot-bg/95 px-3 pb-3 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base font-bold tracking-tight">PolishPilot</h1>
            <p className="text-xs text-slate-400">Control panel</p>
          </div>
          <button
            className="shrink-0 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs font-bold text-slate-100 shadow-sm transition hover:border-cyan-300/60 hover:bg-cyan-300/10 hover:text-cyan-50"
            onClick={() => void startNewScreenshot()}
            type="button"
          >
            New Screenshot
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-1">
          {(["simple", "developer"] as const).map((option) => (
            <button
              className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                mode === option
                  ? "bg-cyan-300 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
              key={option}
              onClick={() => void updateMode(option)}
              type="button"
            >
              {option === "simple" ? "Simple" : "Developer"}
            </button>
          ))}
        </div>
      </header>

      <section className="mt-3 rounded-xl border border-slate-800 bg-slate-900/74 p-3 shadow-pilot">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-50">Selected area</h2>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              {capture
                ? `${formatPixels(capture.selectedRect.width)} x ${formatPixels(
                    capture.selectedRect.height
                  )} captured`
                : hasLoadedCapture
                  ? "Select an area from the popup."
                  : "Loading latest capture..."}
            </p>
          </div>
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[11px] font-bold text-cyan-100">
            {mode === "simple" ? "Simple" : "Developer"}
          </span>
        </div>

        <div className="mt-3 flex min-h-32 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-950 p-2">
          {imageSrc ? (
            <img
              alt="Selected UI area"
              className="block max-h-48 max-w-full rounded-md object-contain"
              src={imageSrc}
            />
          ) : (
            <p className="text-xs font-medium text-slate-400">No screenshot captured</p>
          )}
        </div>

        <button
          className="mt-3 w-full rounded-lg border border-cyan-200/50 bg-cyan-200 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
          disabled={!capture || !selectedPattern}
          onClick={() => void openFullPreview()}
          type="button"
        >
          Open Full Preview
        </button>

        {mode === "developer" ? (
          <button
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs font-bold text-slate-100 transition hover:bg-slate-800/80 disabled:cursor-not-allowed disabled:text-slate-500"
            disabled={!capture || aiStatus === "loading"}
            onClick={() => void analyzeWithGemini()}
            type="button"
          >
            {aiStatus === "loading" ? "Analyzing..." : "Analyze with Gemini"}
          </button>
        ) : null}
      </section>

      <section className="mt-3 rounded-xl border border-slate-800 bg-slate-900/74 p-3">
        <div className="grid grid-cols-2 gap-2">
          <Metric label="Backend" value={backendHealthStatus} />
          <Metric label="AI" value={aiStatus} />
        </div>
        {effectiveAIResult ? (
          <p className="mt-3 text-xs leading-5 text-slate-300">
            {effectiveAIResult.designerDescription ||
              `${effectiveAIResult.sectionType} section, ${effectiveAIResult.layoutType} layout`}
          </p>
        ) : null}
        {aiError ? (
          <p className="mt-3 whitespace-pre-line text-xs leading-5 text-red-100">
            {aiError}
          </p>
        ) : null}
        {aiStatus === "error" && mode === "simple" ? (
          <button
            className="mt-3 w-full rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-50 transition hover:bg-cyan-300/16 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
            disabled={!capture}
            onClick={() => void analyzeWithGemini(capture, true)}
            type="button"
          >
            Retry Analysis
          </button>
        ) : null}
        {backendHealthError && mode === "developer" ? (
          <p className="mt-3 whitespace-pre-line text-xs leading-5 text-red-100">
            {backendHealthError}
          </p>
        ) : null}
      </section>

      {mode === "developer" ? (
        <GeminiDebugPanel
          aiStatus={aiStatus}
          aiPreviewDebug={aiPreviewDebug}
          aiPreviewStatus={aiPreviewStatus}
          backendHealthStatus={backendHealthStatus}
          capture={capture}
          copied={debugCopied}
          debug={geminiDebug}
          logs={geminiLogs}
          onCopyDebugInfo={() => void copyDebugInfo()}
          onClearPreviewDebugLogs={() => void clearPreviewDebugLogs()}
          onCopyPreviewDebugLogs={() => void copyPreviewDebugLogs()}
          onRetryGemini={() => void analyzeWithGemini(capture, false)}
          previewDebugCopied={previewDebugCopied}
        />
      ) : null}

      <section className="mt-3 rounded-xl border border-slate-800 bg-slate-900/74 p-3">
        <h2 className="text-sm font-bold text-slate-50">Design layouts</h2>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          Local layout patterns selected from the AI category and keyword signals.
        </p>
        <div className="mt-3 space-y-3">
          {suggestedPatterns.length ? (
            suggestedPatterns.map((pattern) => (
              <PatternCard
                copied={copiedPatternId === pattern.id}
                copyLabel="Copy Prompt"
                key={pattern.id}
                pattern={pattern}
                selectLabel="Select"
                selected={selectedPattern?.id === pattern.id}
                onCopyPrompt={() => void copyPatternPrompt(pattern)}
                onSelect={() => void selectPattern(pattern)}
              />
            ))
          ) : (
            <p className="rounded-lg border border-slate-800 bg-slate-950/45 p-3 text-xs leading-5 text-slate-400">
              Layout suggestions appear after capture or analysis.
            </p>
          )}
        </div>
      </section>

      <section className="mt-3 rounded-xl border border-slate-800 bg-slate-900/74 p-3">
        <h2 className="text-sm font-bold text-slate-50">Template references</h2>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          Public 21st.dev references for high-level inspiration only.
        </p>
        <div className="mt-3 space-y-2">
          {suggestedTemplates.length ? (
            suggestedTemplates.map((reference) => (
              <TemplateReferenceCard
                key={reference.id}
                mode={mode}
                reference={reference}
                selected={selectedTemplate?.id === reference.id}
                onOpen={() => void openTemplateReference(reference)}
                onSelect={() => setSelectedTemplateId(reference.id)}
              />
            ))
          ) : (
            <p className="rounded-lg border border-slate-800 bg-slate-950/45 p-3 text-xs leading-5 text-slate-400">
              Template references appear after capture or analysis.
            </p>
          )}
        </div>
      </section>

      <section className="mt-3 rounded-xl border border-slate-800 bg-slate-900/74 p-3">
        <h2 className="text-sm font-bold text-slate-50">Animation ideas</h2>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          ReactBits references selected separately from layout suggestions.
        </p>
        <div className="mt-3 space-y-2">
          {suggestedAnimations.length ? (
            suggestedAnimations.map((reference) => (
              <AnimationReferenceCard
                key={reference.id}
                reference={reference}
                selected={selectedAnimation?.id === reference.id}
                onSelect={() => setSelectedAnimationId(reference.id)}
              />
            ))
          ) : (
            <p className="rounded-lg border border-slate-800 bg-slate-950/45 p-3 text-xs leading-5 text-slate-400">
              Animation ideas appear after capture or analysis.
            </p>
          )}
        </div>
      </section>

      {mode === "developer" && suggestions ? (
        <SuggestionDebugPanel
          debug={suggestions.debug}
          referenceHealth={getReferenceHealthDebug(templateReferences, selectedTemplate)}
        />
      ) : null}

      <section className="mt-3 rounded-xl border border-slate-800 bg-slate-900/74 p-3">
        <h2 className="text-sm font-bold text-slate-50">AI visual preview</h2>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          Optional image mockup using the screenshot and selected layout pattern.
        </p>
        <button
          className="mt-3 w-full rounded-lg border border-cyan-200/50 bg-cyan-200 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
          disabled={!capture || !selectedPattern || aiPreviewStatus === "loading"}
          onClick={() => void generateAIPreview()}
          type="button"
        >
          {aiPreviewStatus === "loading" ? "Generating visual preview..." : "Generate AI Preview"}
        </button>
        {aiPreviewStatus === "success" ? (
          <p className="mt-3 text-xs leading-5 text-cyan-100">
            AI visual preview shown on page.
          </p>
        ) : null}
        {aiPreviewError ? (
          <p className="mt-3 text-xs leading-5 text-red-100">{aiPreviewError}</p>
        ) : null}
      </section>

      <section className="mt-3 rounded-xl border border-slate-800 bg-slate-900/74 p-3">
        <h2 className="text-sm font-bold text-slate-50">Page overlay</h2>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          Optional preview directly on the current page.
        </p>
        <div className="mt-3 grid gap-2">
          <button
            className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-50 transition hover:bg-cyan-300/16 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
            disabled={!selectedPattern}
            onClick={() => void showOnPage()}
            type="button"
          >
            Show on page
          </button>
          <button
            className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs font-bold text-slate-100 transition hover:border-red-300/70 hover:bg-red-500/10"
            onClick={() => void closePagePreview()}
            type="button"
          >
            Close page preview
          </button>
        </div>
        {pagePreviewStatus ? (
          <p className="mt-3 text-xs leading-5 text-slate-300">{pagePreviewStatus}</p>
        ) : null}
      </section>
    </main>
  );
}

function GeminiDebugPanel({
  aiStatus,
  aiPreviewDebug,
  aiPreviewStatus,
  backendHealthStatus,
  capture,
  copied,
  debug,
  logs,
  onCopyDebugInfo,
  onClearPreviewDebugLogs,
  onCopyPreviewDebugLogs,
  onRetryGemini,
  previewDebugCopied
}: {
  aiStatus: AIStatus;
  aiPreviewDebug: AIPreviewDebugState;
  aiPreviewStatus: AIPreviewStatus;
  backendHealthStatus: BackendHealthStatus;
  capture: RectangleCapture | null;
  copied: boolean;
  debug: GeminiDebugState;
  logs: GeminiLogEntry[];
  onCopyDebugInfo: () => void;
  onClearPreviewDebugLogs: () => void;
  onCopyPreviewDebugLogs: () => void;
  onRetryGemini: () => void;
  previewDebugCopied: boolean;
}) {
  const previewDebugLogs = capture?.previewDebugLogs ?? [];

  return (
    <>
      <details
        className="mt-3 rounded-xl border border-slate-800 bg-slate-900/74 p-3"
        open={aiStatus === "error"}
      >
        <summary className="cursor-pointer text-sm font-bold text-slate-50">
          Gemini Debug
        </summary>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Metric label="Backend URL" value={ANALYZE_URL} />
          <Metric label="Health" value={backendHealthStatus} />
          <Metric label="Request ID" value={debug.requestId ?? "none"} />
          <Metric label="Model" value={debug.model ?? "unknown"} />
          <Metric label="Analyze" value={aiStatus} />
          <Metric label="Duration" value={debug.durationMs ? `${debug.durationMs}ms` : "none"} />
          <Metric label="Retries" value={debug.retryCount ?? 0} />
          <Metric label="Screenshot" value={debug.screenshotLength ?? 0} />
          <Metric label="Elements" value={debug.matchedElementsCount ?? 0} />
          <Metric label="JSON" value={debug.jsonParseStrategy ?? "none"} />
          <Metric label="Error Code" value={debug.error?.code ?? "none"} />
          <Metric label="Error Stage" value={debug.error?.stage ?? "none"} />
          <Metric label="AI Preview" value={aiPreviewStatus} />
          <Metric label="AI Preview ID" value={aiPreviewDebug.requestId ?? "none"} />
          <Metric label="AI Preview Model" value={aiPreviewDebug.model ?? "unknown"} />
          <Metric label="Selected Image Model" value={aiPreviewDebug.selectedModel ?? "none"} />
          <Metric label="SDK Model Name" value={aiPreviewDebug.sdkModelName ?? "none"} />
          <Metric label="Image Models" value={aiPreviewDebug.availableImageModels?.length ?? 0} />
          <Metric
            label="Image Candidates"
            value={aiPreviewDebug.orderedModelCandidates?.length ?? 0}
          />
          <Metric label="Quota Error" value={String(aiPreviewDebug.quotaError ?? false)} />
          <Metric
            label="Retry After"
            value={
              typeof aiPreviewDebug.retryAfterSeconds === "number"
                ? `${aiPreviewDebug.retryAfterSeconds}s`
                : "none"
            }
          />
          <Metric label="Model Attempts" value={aiPreviewDebug.modelAttempts?.length ?? 0} />
          <Metric label="Image Inline Data" value={String(aiPreviewDebug.imageInlineDataFound ?? false)} />
          <Metric
            label="Response Keys"
            value={aiPreviewDebug.responseTopLevelKeys?.join(", ") || "none"}
          />
          <Metric
            label="AI Preview Time"
            value={aiPreviewDebug.durationMs ? `${aiPreviewDebug.durationMs}ms` : "none"}
          />
          <Metric label="Template" value={aiPreviewDebug.templateMode ?? "none"} />
          <Metric label="AI Preview Error" value={aiPreviewDebug.error?.code ?? "none"} />
          <Metric label="Used CSS" value={capture?.usedCssRules?.ruleCount ?? 0} />
          <Metric label="Skipped CSS" value={capture?.usedCssRules?.skippedStyleSheets ?? 0} />
          <Metric label="Style Tokens" value={capture?.styleTokens ? "available" : "missing"} />
        </div>

        {debug.error ? (
          <div className="mt-3 rounded-lg border border-red-300/20 bg-red-950/20 p-3">
            <p className="text-xs font-bold text-red-100">{debug.error.message}</p>
            {debug.error.details ? (
              <p className="mt-2 break-words text-xs leading-5 text-red-100/80">
                {debug.error.details}
              </p>
            ) : null}
          </div>
        ) : null}

        {aiPreviewDebug.error ? (
          <div className="mt-3 rounded-lg border border-red-300/20 bg-red-950/20 p-3">
            <p className="text-xs font-bold text-red-100">
              AI Preview: {aiPreviewDebug.error.message}
            </p>
            {aiPreviewDebug.error.details ? (
              <p className="mt-2 break-words text-xs leading-5 text-red-100/80">
                {aiPreviewDebug.error.details}
              </p>
            ) : null}
          </div>
        ) : null}

        {aiPreviewDebug.modelSelectionWarning ? (
          <div className="mt-3 rounded-lg border border-amber-300/20 bg-amber-950/20 p-3">
            <p className="text-xs font-bold text-amber-100">
              {aiPreviewDebug.modelSelectionWarning}
            </p>
          </div>
        ) : null}

        {aiPreviewDebug.modelAttempts?.length ? (
          <DebugDetails
            title="AI image model attempts"
            value={JSON.stringify(aiPreviewDebug.modelAttempts, null, 2)}
          />
        ) : null}

        {aiPreviewDebug.promptUsed ? (
          <details className="mt-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <summary className="cursor-pointer text-xs font-bold text-slate-100">
              AI preview prompt
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-5 text-slate-300">
              {aiPreviewDebug.promptUsed}
            </pre>
          </details>
        ) : null}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-50 transition hover:bg-cyan-300/16 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
            disabled={aiStatus === "loading"}
            onClick={onRetryGemini}
            type="button"
          >
            Retry Gemini
          </button>
          <button
            className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs font-bold text-slate-100 transition hover:bg-slate-800/80"
            onClick={onCopyDebugInfo}
            type="button"
          >
            {copied ? "Copied" : "Copy Debug Info"}
          </button>
        </div>

        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/45 p-3">
          <h3 className="text-xs font-bold text-slate-100">Logs</h3>
          <div className="mt-2 max-h-48 space-y-2 overflow-auto">
            {logs.length ? (
              logs.map((entry) => (
                <div
                  className="rounded-md border border-slate-800 bg-slate-950/60 p-2"
                  key={entry.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={logLevelClassName(entry.level)}>{entry.level}</span>
                    <span className="text-[10px] text-slate-500">{entry.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-200">{entry.message}</p>
                  {entry.data ? (
                    <pre className="mt-2 max-h-24 overflow-auto whitespace-pre-wrap break-words text-[10px] leading-4 text-slate-400">
                      {JSON.stringify(entry.data, null, 2)}
                    </pre>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No Gemini logs yet.</p>
            )}
          </div>
        </div>
      </details>

      <details
        className="mt-3 rounded-xl border border-slate-800 bg-slate-900/74 p-3"
        open={previewDebugLogs.length > 0}
      >
        <summary className="cursor-pointer text-sm font-bold text-slate-50">
          Preview Debug Logs
        </summary>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs font-bold text-slate-100 transition hover:bg-slate-800/80"
            onClick={onCopyPreviewDebugLogs}
            type="button"
          >
            {previewDebugCopied ? "Copied" : "Copy Preview Debug Logs"}
          </button>
          <button
            className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs font-bold text-slate-100 transition hover:border-red-300/70 hover:bg-red-500/10"
            onClick={onClearPreviewDebugLogs}
            type="button"
          >
            Clear Preview Debug Logs
          </button>
        </div>

        <div className="mt-3 max-h-[520px] space-y-3 overflow-auto">
          {previewDebugLogs.length ? (
            previewDebugLogs
              .slice()
              .reverse()
              .map((log) => <PreviewDebugLogEntry key={log.id} log={log} />)
          ) : (
            <p className="rounded-lg border border-slate-800 bg-slate-950/45 p-3 text-xs leading-5 text-slate-400">
              No preview debug logs yet. Select an area, then open or show a preview.
            </p>
          )}
        </div>
      </details>
    </>
  );
}

function PreviewDebugLogEntry({ log }: { log: PreviewDebugLog }) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950/45 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-cyan-100">
          {log.stage}
        </span>
        <span className="text-[10px] text-slate-500">
          {new Date(log.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="mt-2 text-xs font-bold text-slate-100">{log.message}</p>
      {log.summary ? (
        <DebugDetails title="Summary" value={JSON.stringify(log.summary, null, 2)} />
      ) : null}
      {log.htmlPreview ? <DebugDetails title="HTML preview" value={log.htmlPreview} /> : null}
      {log.cssPreview ? <DebugDetails title="CSS preview" value={log.cssPreview} /> : null}
      {log.outputHtml ? <DebugDetails title="Output HTML" value={log.outputHtml} /> : null}
      {log.outputCss ? <DebugDetails title="Output CSS" value={log.outputCss} /> : null}
      {log.warnings?.length ? (
        <DebugDetails title="Warnings" value={JSON.stringify(log.warnings, null, 2)} />
      ) : null}
      {log.errors?.length ? (
        <DebugDetails title="Errors" value={JSON.stringify(log.errors, null, 2)} />
      ) : null}
    </article>
  );
}

function DebugDetails({ title, value }: { title: string; value: string }) {
  return (
    <details className="mt-2 rounded-md border border-slate-800 bg-slate-950/70 p-2">
      <summary className="cursor-pointer text-[11px] font-bold text-slate-300">
        {title}
      </summary>
      <pre className="mt-2 max-h-52 overflow-auto whitespace-pre-wrap break-words text-[10px] leading-4 text-slate-400">
        {value}
      </pre>
    </details>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/45 p-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold text-slate-50">{value}</p>
    </div>
  );
}

function TemplateReferenceCard({
  mode,
  reference,
  selected,
  onOpen,
  onSelect
}: {
  mode: PolishPilotMode;
  reference: TemplateReference;
  selected: boolean;
  onOpen: () => void;
  onSelect: () => void;
}) {
  const isBroken = reference.urlStatus === "broken";
  const isUnknown = reference.urlStatus === "unknown" || !reference.urlStatus;

  return (
    <article
      className={`rounded-lg border p-3 transition ${
        selected
          ? "border-cyan-300/80 bg-cyan-300/10"
          : "border-slate-800 bg-slate-950/45 hover:border-slate-600"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-50">{reference.title}</h3>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-cyan-200/80">
            {reference.source} · {reference.category}
          </p>
        </div>
        {selected ? (
          <span className="shrink-0 rounded-full border border-cyan-300/40 bg-cyan-300/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-100">
            Attached
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {isBroken && mode === "developer" ? (
          <span className="rounded-full border border-red-300/40 bg-red-300/10 px-2 py-0.5 text-[10px] font-bold text-red-100">
            Broken link
          </span>
        ) : null}
        {isUnknown ? (
          <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 text-[10px] font-bold text-amber-100">
            Unchecked link
          </span>
        ) : null}
        {reference.urlStatus === "ok" ? (
          <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2 py-0.5 text-[10px] font-bold text-emerald-100">
            Link checked
          </span>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-300">
        {isBroken ? "Reference unavailable. A fallback 21st.dev page will be used." : reference.description ?? reference.usageNote}
      </p>
      <TagList tags={reference.tags.slice(0, 5)} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition ${
            selected
              ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              : "bg-slate-800 text-slate-100 hover:bg-slate-700"
          }`}
          onClick={onSelect}
          type="button"
        >
          Attach reference
        </button>
        <button
          className="rounded-lg border border-slate-700 px-2.5 py-2 text-center text-xs font-semibold text-slate-100 transition hover:border-cyan-300/70 hover:bg-cyan-300/10"
          onClick={onOpen}
          type="button"
        >
          {isBroken ? "Open fallback" : "Open reference"}
        </button>
      </div>
    </article>
  );
}

function AnimationReferenceCard({
  reference,
  selected,
  onSelect
}: {
  reference: AnimationReference;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={`rounded-lg border p-3 transition ${
        selected
          ? "border-cyan-300/80 bg-cyan-300/10"
          : "border-slate-800 bg-slate-950/45 hover:border-slate-600"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-50">{reference.title}</h3>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-cyan-200/80">
            {reference.source} · {reference.category}
          </p>
        </div>
        {selected ? (
          <span className="shrink-0 rounded-full border border-cyan-300/40 bg-cyan-300/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-100">
            Selected
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-300">{reference.bestFor}</p>
      <TagList tags={reference.tags.slice(0, 5)} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition ${
            selected
              ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              : "bg-slate-800 text-slate-100 hover:bg-slate-700"
          }`}
          onClick={onSelect}
          type="button"
        >
          Use animation idea
        </button>
        <a
          className="rounded-lg border border-slate-700 px-2.5 py-2 text-center text-xs font-semibold text-slate-100 transition hover:border-cyan-300/70 hover:bg-cyan-300/10"
          href={reference.url}
          rel="noreferrer"
          target="_blank"
        >
          Open link
        </a>
      </div>
    </article>
  );
}

function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-300"
          key={tag}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function SuggestionDebugPanel({
  debug,
  referenceHealth
}: {
  debug: {
    inputKeywords: string[];
    scores: Array<{
      type: "layout" | "template" | "animation";
      id: string;
      score: number;
      matchedKeywords: string[];
    }>;
  };
  referenceHealth: {
    total: number;
    ok: number;
    broken: number;
    unknown: number;
    selectedStatus: string;
  };
}) {
  return (
    <section className="mt-3 rounded-xl border border-slate-800 bg-slate-900/74 p-3">
      <h2 className="text-sm font-bold text-slate-50">Suggestion debug</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Metric label="References" value={referenceHealth.total} />
        <Metric label="OK links" value={referenceHealth.ok} />
        <Metric label="Broken links" value={referenceHealth.broken} />
        <Metric label="Unknown links" value={referenceHealth.unknown} />
      </div>
      <p className="mt-2 text-[11px] leading-5 text-slate-400">
        Selected reference status: {referenceHealth.selectedStatus}
      </p>
      <TagList tags={debug.inputKeywords.slice(0, 30)} />
      <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-slate-800 bg-slate-950/70">
        {debug.scores.map((score) => (
          <div
            className="grid grid-cols-[74px_1fr_42px] gap-2 border-b border-slate-800 px-2 py-2 text-[10px] last:border-b-0"
            key={`${score.type}-${score.id}`}
          >
            <span className="font-bold uppercase text-cyan-100">{score.type}</span>
            <span className="min-w-0 truncate text-slate-300" title={score.id}>
              {score.id}
            </span>
            <span className="text-right font-bold text-slate-50">{score.score}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function getReferenceHealthDebug(
  references: TemplateReference[],
  selectedReference: TemplateReference | null
) {
  return references.reduce(
    (summary, reference) => {
      const status = reference.urlStatus ?? "unknown";

      if (status === "ok") summary.ok += 1;
      else if (status === "broken") summary.broken += 1;
      else summary.unknown += 1;

      return summary;
    },
    {
      total: references.length,
      ok: 0,
      broken: 0,
      unknown: 0,
      selectedStatus: selectedReference?.urlStatus ?? "none"
    }
  );
}

function parseAnalyzeSuccess(body: unknown): {
  result: AIUnderstandingResult;
  debug: GeminiDebugState;
} {
  if (isWrappedSuccessResponse(body)) {
    return {
      result: body.result,
      debug: {
        requestId: body.requestId,
        model: body.model,
        durationMs: body.durationMs,
        retryCount: body.debug?.retryCount,
        screenshotLength: body.debug?.screenshotLength,
        matchedElementsCount: body.debug?.matchedElementsCount,
        jsonParseStrategy: body.debug?.jsonParseStrategy
      }
    };
  }

  return {
    result: body as AIUnderstandingResult,
    debug: {}
  };
}

function parseAnalyzeError(body: unknown, status: number): GeminiApiError {
  if (isWrappedErrorResponse(body) && body.error) {
    return body.error;
  }

  if (isRecord(body) && "error" in body) {
    return {
      code: `HTTP_${status}`,
      message: String(body.error),
      details: "details" in body ? String(body.details) : undefined,
      stage: "unknown"
    };
  }

  return {
    code: `HTTP_${status}`,
    message: `Backend returned ${status}`,
    stage: "unknown"
  };
}

function debugFromErrorResponse(body: unknown, error: GeminiApiError): GeminiDebugState {
  if (isWrappedErrorResponse(body)) {
    return {
      requestId: body.requestId,
      model: body.debug?.model,
      durationMs: body.debug?.durationMs,
      retryCount: body.debug?.retryCount,
      screenshotLength: body.debug?.screenshotLength,
      matchedElementsCount: body.debug?.matchedElementsCount,
      error
    };
  }

  return { error };
}

function isWrappedSuccessResponse(value: unknown): value is AnalyzeAreaSuccessResponse {
  return Boolean(
    isRecord(value) &&
      value.ok === true &&
      "result" in value &&
      isRecord(value.result)
  );
}

function isWrappedErrorResponse(value: unknown): value is AnalyzeAreaErrorResponse {
  return Boolean(isRecord(value) && value.ok === false);
}

function simpleGeminiErrorMessage(error: GeminiApiError) {
  return error.code === "BACKEND_UNREACHABLE"
    ? SIMPLE_BACKEND_ERROR
    : "Gemini analysis failed. Try again or switch to Developer Mode for details.";
}

function formatAIPreviewErrorMessage(error: GenerateAIPreviewErrorResponse["error"]) {
  if (error?.code === "GEMINI_IMAGE_QUOTA_EXHAUSTED") {
    return "AI image preview quota is exhausted for available image models. Use Live HTML/CSS Preview or try again later.";
  }

  if (error?.code === "GEMINI_IMAGE_GENERATION_FAILED") {
    return "Image model is available, but generation failed. Check Developer Mode logs.";
  }

  if (error?.code === "GEMINI_IMAGE_MODEL_UNAVAILABLE") {
    return "No Gemini image model is available for this key.";
  }

  return (
    error?.message ??
    "AI visual preview failed. You can still use local layout preview or copy the implementation prompt."
  );
}

function formatGeminiError(error: GeminiApiError) {
  const parts = [
    `${error.code} (${error.stage})`,
    error.message,
    error.details ? `Details: ${error.details}` : ""
  ].filter(Boolean);

  return parts.join("\n");
}

function logLevelClassName(level: GeminiLogEntry["level"]) {
  const base =
    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]";

  if (level === "success") {
    return `${base} bg-emerald-300/10 text-emerald-100`;
  }
  if (level === "error") {
    return `${base} bg-red-300/10 text-red-100`;
  }
  if (level === "warn") {
    return `${base} bg-amber-300/10 text-amber-100`;
  }

  return `${base} bg-cyan-300/10 text-cyan-100`;
}

function getScreenshotImageSrc(screenshotBase64: string | undefined): string {
  if (!screenshotBase64) return "";
  return screenshotBase64.startsWith("data:")
    ? screenshotBase64
    : `data:image/png;base64,${screenshotBase64}`;
}

function buildAnalyzePayload(capture: RectangleCapture) {
  const {
    usedCssRules: _usedCssRules,
    styleTokens: _styleTokens,
    previewDebugLogs: _previewDebugLogs,
    ...payload
  } = capture;
  return payload;
}

function buildFallbackAIResultFromCapture(capture: RectangleCapture): AIUnderstandingResult {
  const counts = capture.counts;
  const sectionType = capture.detected.sectionType;
  const layoutType = capture.detected.layoutType;
  const detectedKeywords = buildLocalKeywords(capture);
  const uiProblems = inferLocalProblems(capture);

  return {
    sectionType,
    layoutType,
    contentType: inferContentType(capture),
    confidence: Math.max(0.25, capture.detected.confidence * 0.8),
    detectedBlocks: [
      counts.headings ? { type: "heading", count: counts.headings, description: "Headings detected locally." } : null,
      counts.buttons ? { type: "button", count: counts.buttons, description: "Buttons detected locally." } : null,
      counts.images ? { type: "image", count: counts.images, description: "Images detected locally." } : null,
      counts.inputs ? { type: "input", count: counts.inputs, description: "Inputs detected locally." } : null,
      counts.cardsEstimate ? { type: "card", count: counts.cardsEstimate, description: "Card-like groups detected locally." } : null,
      counts.textLength ? { type: "text", count: counts.textLength, description: "Visible text detected locally." } : null
    ].filter(Boolean) as AIUnderstandingResult["detectedBlocks"],
    detectedKeywords,
    designIntent: inferDesignIntent(sectionType),
    uiProblems,
    recommendedCategories: {
      layoutCategories: [sectionType],
      templateCategories: [sectionType],
      animationCategories: inferAnimationCategories(sectionType, counts)
    },
    animationKeywords: inferAnimationKeywords(sectionType, counts),
    designerDescription: `Local fallback classified this as ${sectionType} with ${layoutType} layout.`,
    currentLayoutProblem: uiProblems.includes("unknown")
      ? "Local fallback did not detect a specific UI problem."
      : `Local fallback detected: ${uiProblems.join(", ")}.`,
    reasoning: [
      "Built from local DOM, CSS, text, and element counts.",
      "Used because Gemini has not completed or failed."
    ]
  };
}

function buildLocalKeywords(capture: RectangleCapture) {
  const text = capture.matchedElements
    .slice(0, 40)
    .map((element) =>
      [
        element.tagName,
        element.className,
        element.role,
        element.ariaLabel,
        element.text
      ]
        .filter(Boolean)
        .join(" ")
    )
    .join(" ");
  const rawKeywords = [
    capture.detected.sectionType,
    capture.detected.layoutType,
    capture.counts.cardsEstimate ? "cards" : "",
    capture.counts.buttons ? "button cta" : "",
    capture.counts.inputs ? "form input lead-capture" : "",
    capture.counts.images ? "image product-preview" : "",
    capture.counts.svgs ? "icon" : "",
    text
  ].join(" ");

  return [...new Set(
    rawKeywords
      .split(/[^a-zA-Z0-9_-]+/)
      .map((keyword) =>
        keyword
          .toLowerCase()
          .trim()
          .replace(/[\s_]+/g, "-")
          .replace(/[^a-z0-9-]+/g, "")
      )
      .filter(Boolean)
  )].slice(0, 30);
}

function inferContentType(capture: RectangleCapture): AIUnderstandingResult["contentType"] {
  if (capture.detected.sectionType === "pricing") return "pricing_plans";
  if (capture.detected.sectionType === "stats") return "metrics";
  if (capture.detected.sectionType === "form" || capture.counts.inputs > 0) return "form";
  if (capture.counts.cardsEstimate > 0) return "cards";
  if (capture.counts.textLength > 0) return "text_block";
  return "unknown";
}

function inferDesignIntent(sectionType: RectangleCapture["detected"]["sectionType"]): AIUnderstandingResult["designIntent"] {
  if (sectionType === "hero" || sectionType === "cta" || sectionType === "pricing") return "conversion";
  if (sectionType === "features" || sectionType === "cards") return "explanation";
  if (sectionType === "stats") return "data_summary";
  if (sectionType === "form") return "lead_capture";
  return "unknown";
}

function inferLocalProblems(capture: RectangleCapture): AIUnderstandingResult["uiProblems"] {
  const problems = new Set<AIUnderstandingResult["uiProblems"][number]>();

  if (capture.detected.layoutType === "equal_grid") problems.add("cards_too_equal");
  if (capture.detected.layoutType === "equal_grid" || capture.detected.sectionType === "cards") problems.add("flat_layout");
  if (capture.counts.cardsEstimate >= 3) problems.add("too_repetitive");
  if (capture.counts.textLength > 500) problems.add("too_text_heavy");
  if (capture.counts.buttons === 0 && (capture.detected.sectionType === "hero" || capture.detected.sectionType === "cta")) problems.add("cta_not_clear");
  if (capture.detected.sectionType === "hero" || capture.detected.sectionType === "features") problems.add("weak_hierarchy");

  return problems.size ? [...problems] : ["unknown"];
}

function inferAnimationCategories(
  sectionType: RectangleCapture["detected"]["sectionType"],
  counts: RectangleCapture["counts"]
): AIUnderstandingResult["recommendedCategories"]["animationCategories"] {
  const categories = new Set<AIUnderstandingResult["recommendedCategories"]["animationCategories"][number]>();

  if (sectionType === "hero" || sectionType === "cta") {
    categories.add("text");
    categories.add("button");
    categories.add("background");
  }
  if (sectionType === "features" || sectionType === "cards" || sectionType === "pricing") {
    categories.add("card");
    categories.add("hover");
    categories.add("scroll");
  }
  if (sectionType === "form" || counts.inputs > 0) {
    categories.add("button");
    categories.add("loader");
  }

  return categories.size ? [...categories] : ["other"];
}

function inferAnimationKeywords(
  sectionType: RectangleCapture["detected"]["sectionType"],
  counts: RectangleCapture["counts"]
) {
  const keywords = new Set<string>();

  if (sectionType === "hero") {
    keywords.add("text-reveal");
    keywords.add("background");
  }
  if (counts.cardsEstimate > 0) {
    keywords.add("card-hover");
    keywords.add("stagger");
  }
  if (counts.buttons > 0) keywords.add("button-microinteraction");
  if (sectionType === "features" || sectionType === "pricing") keywords.add("reveal");

  return [...keywords];
}

function isFetchFailure(error: unknown) {
  return error instanceof TypeError || String(error).includes("Failed to fetch");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
