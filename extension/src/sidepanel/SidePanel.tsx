import "../styles/tailwind.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AI_PREVIEW_STORAGE_KEY,
  AI_PREVIEW_REGENERATE_KEY,
  CODE_CHANGE_STORAGE_KEY,
  DESIGN_IDEAS_STORAGE_KEY,
  EXCLUDED_UNCODIX_RULES_STORAGE_KEY,
  FULL_PREVIEW_STORAGE_KEY,
  LATEST_AI_RESULT_STORAGE_KEY,
  LATEST_CAPTURE_STORAGE_KEY,
  POLISH_PILOT_MODE_STORAGE_KEY,
  RECOMMENDATIONS_STORAGE_KEY,
  SELECTED_ANIMATION_STORAGE_KEY,
  SELECTED_PATTERN_STORAGE_KEY,
  SELECTED_TEMPLATE_STORAGE_KEY,
  WORKSPACE_AI_PREVIEW_REQUEST_KEY,
  formatPixels,
  isPolishPilotMessage
} from "../shared/messages";
import { API_BASE_URL, apiUrl } from "../shared/apiConfig";
import { downloadBase64Image, previewDownloadFilename } from "../shared/downloadImage";
import {
  addGeneratedPreview,
  GENERATED_PREVIEWS_KEY,
  getGeneratedPreviews
} from "../shared/generatedPreviewStore";
import type { GeneratedPreviewImage } from "../shared/generatedPreviewTypes";
import { AccountPanel } from "../components/AccountPanel";
import { getAuthHeaders } from "../shared/authService";
import { UncodixifyCheck } from "../components/UncodixifyCheck";
import { analyzeUncodixify } from "../analysis/analyzeUncodixify";
import type { UncodixifyAnalysisResult } from "../analysis/uncodixifyTypes";
import { buildCaptureObjectInventory } from "../analysis/buildObjectInventory";
import { buildHumanizedPreviewHtml } from "../patterns/buildHumanizedPreviewHtml";
import {
  extractPreviewContent,
  type PreviewContent
} from "../patterns/extractPreviewItems";
import { generateCursorPrompt } from "../patterns/generateCursorPrompt";
import { validateGeneratedPrompt } from "../patterns/validateGeneratedPrompt";
import {
  selectHumanizerSuggestions,
  type HumanizerSuggestions
} from "../patterns/selectHumanizerSuggestions";
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
import type {
  CodeChangeData,
  DesignIdeasData,
  RecommendationsData
} from "../shared/windowData";

const ANALYZE_URL = apiUrl("/api/analyze-area");
const AI_PREVIEW_URL = apiUrl("/api/generate-ai-preview");
const HEALTH_URL = apiUrl("/api/health");

type AIStatus = "idle" | "loading" | "success" | "error";
type AnalysisProcessStepId =
  | "idle"
  | "capture"
  | "prepare"
  | "send"
  | "read"
  | "reason"
  | "recommend"
  | "complete"
  | "error";
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
  sourceContextChars?: number;
  matchedElementsCount?: number;
  jsonParseStrategy?: "direct" | "extracted" | "repaired";
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
  recommendationCounts?: {
    designChecks: number;
    layoutIdeas: number;
    templateReferences: number;
    animationReferences: number;
    uncodixifyRecommendations: number;
  };
  solutionStatus?: "success" | "error" | "skipped";
  solutionModel?: string;
  solutionDurationMs?: number;
  solutionPromptChars?: number;
  solutionTextEditCount?: number;
  solutionSummary?: string;
  solutionError?: string;
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
    sourceContextChars?: number;
    matchedElementsCount?: number;
    rawResponseLength?: number;
    jsonParseStrategy?: "direct" | "extracted" | "repaired";
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
    recommendationCounts?: AIPreviewDebugState["recommendationCounts"];
    solutionStatus?: AIPreviewDebugState["solutionStatus"];
    solutionModel?: string;
    solutionDurationMs?: number;
    solutionPromptChars?: number;
    solutionTextEditCount?: number;
    solutionSummary?: string;
    solutionError?: string;
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
    sourceContextChars?: number;
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
  const [analysisStep, setAnalysisStep] = useState<AnalysisProcessStepId>("idle");
  const [aiError, setAIError] = useState("");
  const [backendHealthStatus, setBackendHealthStatus] =
    useState<BackendHealthStatus>("checking");
  const [backendHealthError, setBackendHealthError] = useState("");
  const [selectedPatternId, setSelectedPatternId] =
    useState<LayoutPatternId | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedAnimationId, setSelectedAnimationId] = useState<string | null>(null);
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
  const [promptCopied, setPromptCopied] = useState(false);
  const [generatedPreviews, setGeneratedPreviews] = useState<GeneratedPreviewImage[]>([]);
  const [excludedUncodixRuleIds, setExcludedUncodixRuleIds] = useState<string[]>([]);
  const generateAIPreviewRef = useRef<((options?: { openResult?: boolean }) => Promise<void>) | null>(null);
  const analysisTimersRef = useRef<number[]>([]);

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
      const nextGeneratedPreviews = changes[GENERATED_PREVIEWS_KEY]?.newValue as
        | GeneratedPreviewImage[]
        | undefined;

      // Selections made inside the floating windows sync back here.
      if (SELECTED_TEMPLATE_STORAGE_KEY in changes) {
        setSelectedTemplateId(
          (changes[SELECTED_TEMPLATE_STORAGE_KEY]?.newValue as string | null | undefined) ??
            null
        );
      }
      if (SELECTED_ANIMATION_STORAGE_KEY in changes) {
        setSelectedAnimationId(
          (changes[SELECTED_ANIMATION_STORAGE_KEY]?.newValue as string | null | undefined) ??
            null
        );
      }
      if (EXCLUDED_UNCODIX_RULES_STORAGE_KEY in changes) {
        const next = changes[EXCLUDED_UNCODIX_RULES_STORAGE_KEY]?.newValue;
        setExcludedUncodixRuleIds(Array.isArray(next) ? (next as string[]) : []);
      }
      if (AI_PREVIEW_REGENERATE_KEY in changes && changes[AI_PREVIEW_REGENERATE_KEY]?.newValue) {
        void generateAIPreviewRef.current?.();
      }
      if (
        WORKSPACE_AI_PREVIEW_REQUEST_KEY in changes &&
        changes[WORKSPACE_AI_PREVIEW_REQUEST_KEY]?.newValue
      ) {
        void generateAIPreviewRef.current?.({ openResult: false });
      }

      if (nextCapture) {
        setCapture((current) => {
          const isSameCapture = current?.captureId === nextCapture.captureId;

          if (!isSameCapture) {
            setAIResult(null);
            setAIStatus("idle");
            setAnalysisStep("capture");
            setAIError("");
            setGeminiDebug({});
            setAIPreviewStatus("idle");
            setAIPreviewError("");
            setAIPreviewDebug({});
            setSelectedPatternId(null);
            setSelectedTemplateId(null);
            setSelectedAnimationId(null);
            setExcludedUncodixRuleIds([]);
            setPromptCopied(false);
            void chrome.storage.session.remove([
              SELECTED_PATTERN_STORAGE_KEY,
              SELECTED_TEMPLATE_STORAGE_KEY,
              SELECTED_ANIMATION_STORAGE_KEY,
              EXCLUDED_UNCODIX_RULES_STORAGE_KEY
            ]);
          }

          return nextCapture;
        });
      }
      if (nextAIResult) {
        setAIResult(nextAIResult);
        setAIStatus("success");
        setAnalysisStep("complete");
      }
      if (nextPatternId) setSelectedPatternId(nextPatternId);
      if (Array.isArray(nextGeneratedPreviews)) {
        setGeneratedPreviews(nextGeneratedPreviews);
      } else if (GENERATED_PREVIEWS_KEY in changes && !nextGeneratedPreviews) {
        setGeneratedPreviews([]);
      }
    }

    function handleRuntimeMessage(message: unknown) {
      if (!isPolishPilotMessage(message)) return;
      if (message.type === "CAPTURE_UPDATED") {
        setCapture(message.capture);
        setAIResult(null);
        setAIStatus("idle");
        setAnalysisStep("capture");
        setAIError("");
        setGeminiDebug({});
        setAIPreviewStatus("idle");
        setAIPreviewError("");
        setAIPreviewDebug({});
        setSelectedPatternId(null);
        setSelectedTemplateId(null);
        setSelectedAnimationId(null);
        setExcludedUncodixRuleIds([]);
        setPromptCopied(false);
        void chrome.storage.session.remove([
          SELECTED_PATTERN_STORAGE_KEY,
          SELECTED_TEMPLATE_STORAGE_KEY,
          SELECTED_ANIMATION_STORAGE_KEY,
          EXCLUDED_UNCODIX_RULES_STORAGE_KEY
        ]);
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange);
    chrome.runtime.onMessage.addListener(handleRuntimeMessage);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
      chrome.runtime.onMessage.removeListener(handleRuntimeMessage);
      clearAnalysisProgressTimers();
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
  const effectiveAIResult = aiResult;
  const uncodixifyResult = useMemo(
    () => analyzeUncodixify(capture, effectiveAIResult),
    [capture, effectiveAIResult]
  );
  const includedUncodixRuleIds = useMemo(() => {
    if (!uncodixifyResult) return [];
    const excluded = new Set(excludedUncodixRuleIds);
    return uncodixifyResult.findings
      .map((finding) => finding.ruleId)
      .filter((ruleId) => !excluded.has(ruleId));
  }, [uncodixifyResult, excludedUncodixRuleIds]);
  const allUncodixRecommendations = useMemo(() => {
    if (!uncodixifyResult) return [];
    return uncodixifyResult.findings.map(
      (finding) =>
        `${finding.title}: ${finding.recommendation} Better direction: ${finding.betterDirection}`
    );
  }, [uncodixifyResult]);
  const codeChangeRecommendations = useMemo(() => {
    if (!uncodixifyResult) return [];
    const included = new Set(includedUncodixRuleIds);
    return uncodixifyResult.findings
      .filter((finding) => included.has(finding.ruleId))
      .map(
        (finding) =>
          `${finding.title}: ${finding.recommendation} Better direction: ${finding.betterDirection}`
      );
  }, [includedUncodixRuleIds, uncodixifyResult]);

  function toggleUncodixRule(ruleId: string) {
    setExcludedUncodixRuleIds((current) => {
      const next = current.includes(ruleId)
        ? current.filter((id) => id !== ruleId)
        : [...current, ruleId];
      void chrome.storage.session.set({ [EXCLUDED_UNCODIX_RULES_STORAGE_KEY]: next });
      return next;
    });
  }
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
  const allSuggestedTemplates = useMemo(
    () =>
      (suggestions?.templateReferences ?? []).filter(
        (reference) => mode === "developer" || reference.urlStatus !== "broken"
      ),
    [mode, suggestions]
  );
  const suggestedTemplates = useMemo(
    () => allSuggestedTemplates.slice(0, 4),
    [allSuggestedTemplates]
  );
  const suggestedAnimations = suggestions?.animationReferences ?? [];
  const explicitSelectedPattern = selectedPatternId
    ? suggestedPatterns.find((pattern) => pattern.id === selectedPatternId) ?? null
    : null;
  const selectedPattern =
    explicitSelectedPattern ??
    suggestedPatterns[0] ??
    null;
  const selectedTemplate =
    allSuggestedTemplates.find((reference) => reference.id === selectedTemplateId) ?? null;
  const selectedAnimation =
    suggestedAnimations.find((reference) => reference.id === selectedAnimationId) ?? null;
  const latestGeneratedPreview = generatedPreviews[0] ?? null;
  // A design direction counts only when the user actively selected one (not the
  // fallback first suggestion). This drives the Cursor prompt's preservation rule.
  const designDirectionSelected = Boolean(
    selectedPatternId || selectedTemplateId || selectedAnimationId
  );
  const cursorPromptText = useMemo(
    () =>
      generateCursorPrompt({
        aiResult: effectiveAIResult,
        capture,
        designDirectionSelected,
        pattern: selectedPattern,
        templateReference: selectedTemplate,
        animationReference: selectedAnimation,
        uncodixify: uncodixifyResult,
        includedUncodixifyRuleIds: includedUncodixRuleIds
      }),
    [
      effectiveAIResult,
      capture,
      designDirectionSelected,
      selectedPattern,
      selectedTemplate,
      selectedAnimation,
      uncodixifyResult,
      includedUncodixRuleIds
    ]
  );

  // Mirror the latest suggestions to the Design Ideas floating window.
  useEffect(() => {
    const data: DesignIdeasData = {
      mode,
      hasAnalysis: Boolean(effectiveAIResult),
      sourceTitle: capture?.title,
      sourceUrl: capture?.url,
      layoutPatterns: suggestedPatterns,
      templateReferences: allSuggestedTemplates,
      animationReferences: suggestedAnimations,
      fitReason:
        effectiveAIResult?.designerDescription ||
        effectiveAIResult?.currentLayoutProblem ||
        undefined,
      selectedPatternId,
      selectedTemplateId,
      selectedAnimationId,
      cursorPrompt: cursorPromptText
    };
    void chrome.storage.session.set({ [DESIGN_IDEAS_STORAGE_KEY]: data });
  }, [
    mode,
    effectiveAIResult,
    capture,
    suggestions,
    suggestedPatterns,
    allSuggestedTemplates,
    suggestedAnimations,
    selectedPatternId,
    selectedTemplateId,
    selectedAnimationId,
    cursorPromptText
  ]);

  // Mirror the Uncodixify analysis to the Recommendations floating window.
  useEffect(() => {
    const data: RecommendationsData = {
      mode,
      hasAnalysis: Boolean(effectiveAIResult),
      sourceTitle: capture?.title,
      sourceUrl: capture?.url,
      analysis: uncodixifyResult,
      excludedRuleIds: excludedUncodixRuleIds,
      cursorPrompt: cursorPromptText
    };
    void chrome.storage.session.set({ [RECOMMENDATIONS_STORAGE_KEY]: data });
  }, [mode, effectiveAIResult, capture, uncodixifyResult, excludedUncodixRuleIds, cursorPromptText]);

  // Mirror the latest capture and recommendations to the Code Change tab.
  useEffect(() => {
    const data: CodeChangeData = {
      mode,
      hasAnalysis: Boolean(effectiveAIResult),
      sourceTitle: capture?.title,
      sourceUrl: capture?.url,
      capture,
      aiResult: effectiveAIResult,
      analysis: uncodixifyResult,
      selectedPattern: explicitSelectedPattern,
      selectedTemplateReference: selectedTemplate,
      selectedAnimationReference: selectedAnimation,
      recommendations: codeChangeRecommendations,
      cursorPrompt: cursorPromptText,
      defaultScope: "selected-block"
    };
    void chrome.storage.session.set({ [CODE_CHANGE_STORAGE_KEY]: data });
  }, [
    mode,
    effectiveAIResult,
    capture,
    uncodixifyResult,
    explicitSelectedPattern,
    selectedTemplate,
    selectedAnimation,
    codeChangeRecommendations,
    cursorPromptText
  ]);

  async function openRecommendationsWindow() {
    const url = chrome.runtime.getURL("recommendations.html");
    const existing = await chrome.tabs.query({ url });
    const tab = existing[0];

    if (tab?.id) {
      await chrome.tabs.update(tab.id, { active: true });
      if (tab.windowId !== undefined) {
        await chrome.windows.update(tab.windowId, { focused: true });
      }
      return;
    }

    await chrome.tabs.create({ url });
  }

  async function openCodeChangeTab() {
    const url = chrome.runtime.getURL("code-change.html");
    const existing = await chrome.tabs.query({ url });
    const tab = existing[0];

    if (tab?.id) {
      await chrome.tabs.update(tab.id, { active: true });
      if (tab.windowId !== undefined) {
        await chrome.windows.update(tab.windowId, { focused: true });
      }
      return;
    }

    await chrome.tabs.create({ url });
  }

  async function copyCursorPromptFromSidePanel() {
    if (!cursorPromptText) return;
    await navigator.clipboard.writeText(cursorPromptText);
    setPromptCopied(true);
    setPagePreviewStatus("Prompt copied.");
    window.setTimeout(() => setPromptCopied(false), 1600);
  }

  // Keep a live reference so the AI Preview window's "Regenerate" can call it.
  generateAIPreviewRef.current = generateAIPreview;

  async function refreshData() {
    const [localResult, sessionResult] = await Promise.all([
      chrome.storage.local.get(POLISH_PILOT_MODE_STORAGE_KEY),
      chrome.storage.session.get([
        LATEST_CAPTURE_STORAGE_KEY,
        LATEST_AI_RESULT_STORAGE_KEY,
        SELECTED_PATTERN_STORAGE_KEY,
        SELECTED_TEMPLATE_STORAGE_KEY,
        SELECTED_ANIMATION_STORAGE_KEY,
        EXCLUDED_UNCODIX_RULES_STORAGE_KEY,
        GENERATED_PREVIEWS_KEY
      ])
    ]);
    const storedMode = localResult[POLISH_PILOT_MODE_STORAGE_KEY];
    if (storedMode === "simple" || storedMode === "developer") setMode(storedMode);

    const storedCapture =
      (sessionResult[LATEST_CAPTURE_STORAGE_KEY] as RectangleCapture | undefined) ?? null;
    setCapture(storedCapture);
    const storedAIResult = sessionResult[LATEST_AI_RESULT_STORAGE_KEY] as
      | AIUnderstandingResult
      | undefined;
    setAIResult(storedAIResult ?? null);
    setAIStatus(storedAIResult ? "success" : "idle");
    setAnalysisStep(storedAIResult ? "complete" : storedCapture ? "capture" : "idle");
    setSelectedPatternId(
      (sessionResult[SELECTED_PATTERN_STORAGE_KEY] as LayoutPatternId | undefined) ?? null
    );
    setSelectedTemplateId(
      (sessionResult[SELECTED_TEMPLATE_STORAGE_KEY] as string | undefined) ?? null
    );
    setSelectedAnimationId(
      (sessionResult[SELECTED_ANIMATION_STORAGE_KEY] as string | undefined) ?? null
    );
    setExcludedUncodixRuleIds(
      Array.isArray(sessionResult[EXCLUDED_UNCODIX_RULES_STORAGE_KEY])
        ? (sessionResult[EXCLUDED_UNCODIX_RULES_STORAGE_KEY] as string[])
        : []
    );
    setGeneratedPreviews(
      Array.isArray(sessionResult[GENERATED_PREVIEWS_KEY])
        ? (sessionResult[GENERATED_PREVIEWS_KEY] as GeneratedPreviewImage[])
        : []
    );
    setHasLoadedCapture(true);
  }

  async function updateMode(nextMode: PolishPilotMode) {
    setMode(nextMode);
    await chrome.storage.local.set({ [POLISH_PILOT_MODE_STORAGE_KEY]: nextMode });
  }

  function clearAnalysisProgressTimers() {
    analysisTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    analysisTimersRef.current = [];
  }

  function scheduleAnalysisStep(step: AnalysisProcessStepId, delayMs: number) {
    const timer = window.setTimeout(() => {
      setAnalysisStep(step);
    }, delayMs);
    analysisTimersRef.current.push(timer);
  }

  function startAnalysisProgress() {
    clearAnalysisProgressTimers();
    setAnalysisStep("capture");
    scheduleAnalysisStep("prepare", 250);
    scheduleAnalysisStep("send", 650);
    scheduleAnalysisStep("read", 1300);
    scheduleAnalysisStep("reason", 2800);
    scheduleAnalysisStep("recommend", 4800);
  }

  function finishAnalysisProgress(step: Extract<AnalysisProcessStepId, "complete" | "error">) {
    clearAnalysisProgressTimers();
    setAnalysisStep(step);
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
          ? formatBackendUnavailableMessage(HEALTH_URL)
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
      setAnalysisStep("error");
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
    startAnalysisProgress();
    setAIError("");
    setDebugCopied(false);
    setGeminiDebug({
      screenshotLength: targetCapture.screenshotBase64.length,
      matchedElementsCount: 0
    });
    addGeminiLog("info", simpleMode ? "Auto-analysis started" : "Analyze clicked", {
      url: ANALYZE_URL
    });
    addGeminiLog("info", "Request payload summary", {
      screenshotLength: targetCapture.screenshotBase64.length,
      selectedWidth: Math.round(targetCapture.selectedRect.width),
      selectedHeight: Math.round(targetCapture.selectedRect.height),
      geminiInput: "screenshot+source-context",
      sourceSections: targetCapture.sourceSections?.length ?? 0,
      usedCssRuleCount: targetCapture.usedCssRules?.ruleCount ?? 0,
      pageDesignSampledElements: targetCapture.pageDesignContext?.sampledElements ?? 0
    });

    try {
      const response = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await getAuthHeaders()) },
        body: JSON.stringify(buildAnalyzePayload(targetCapture))
      });
      const body = await response.json().catch(() => null);
      setAnalysisStep("recommend");
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
        finishAnalysisProgress("error");
        setAIError(simpleMode ? simpleGeminiErrorMessage(parsedError) : formatGeminiError(parsedError));
        return;
      }

      const parsedResponse = parseAnalyzeSuccess(body);
      const result = parsedResponse.result;
      setGeminiDebug(parsedResponse.debug);
      setAIResult(result);
      setAIStatus("success");
      finishAnalysisProgress("complete");
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
          ? formatBackendUnavailableMessage(ANALYZE_URL)
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
      finishAnalysisProgress("error");
      setAIError(
        simpleMode ? simpleGeminiErrorMessage(fallbackError) : formatGeminiError(fallbackError)
      );
    }
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
        sectionType: effectiveAIResult?.sectionType ?? "unknown",
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

  async function generateAIPreview(options: { openResult?: boolean } = {}) {
    const openResult = options.openResult ?? true;
    if (!capture || !capture.screenshotBase64) {
      setAIPreviewStatus("error");
      setAIPreviewError("Select an area before generating AI preview.");
      return;
    }

    const previewPattern = explicitSelectedPattern;
    const previewContent = extractPreviewContent({ capture, aiResult: effectiveAIResult });
    setAIPreviewStatus("loading");
    setAIPreviewError("");
    setAIPreviewDebug({
      screenshotLength: capture.screenshotBase64.length,
      templateMode: "text-only",
      hasTemplateImage: false,
      recommendationCounts: buildAIPreviewRecommendationCounts({
        analysis: uncodixifyResult,
        suggestions,
        templateReferences: allSuggestedTemplates,
        animationReferences: suggestedAnimations,
        uncodixifyRecommendations: allUncodixRecommendations
      })
    });
    setPagePreviewStatus("Planning fixes, humanizing text, then generating visual preview...");

    try {
      const response = await fetch(AI_PREVIEW_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await getAuthHeaders()) },
        body: JSON.stringify({
          screenshotBase64: capture.screenshotBase64,
          url: capture.url,
          title: capture.title,
          aiResult: effectiveAIResult,
          selectedPattern: previewPattern
            ? {
                id: previewPattern.id,
                name: previewPattern.name,
                description: previewPattern.problemSolved.join(" "),
                bestFor: previewPattern.bestFor,
                tailwindHint: previewPattern.tailwindHint,
                promptInstruction: previewPattern.promptInstruction,
                exampleStructure: previewPattern.exampleStructure
              }
            : undefined,
          selectedTemplateReference: selectedTemplate,
          selectedAnimationReference: selectedAnimation,
          recommendationContext: buildAIPreviewRecommendationContext({
            analysis: uncodixifyResult,
            suggestions,
            templateReferences: allSuggestedTemplates,
            animationReferences: suggestedAnimations
          }),
          previewContent,
          styleContext: capture.styleContext,
          templateMode: "text-only",
          uncodixify: allUncodixRecommendations.length
            ? { recommendations: allUncodixRecommendations }
            : undefined
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
        recommendationCounts: body.debug?.recommendationCounts,
        solutionStatus: body.debug?.solutionStatus,
        solutionModel: body.debug?.solutionModel,
        solutionDurationMs: body.debug?.solutionDurationMs,
        solutionPromptChars: body.debug?.solutionPromptChars,
        solutionTextEditCount: body.debug?.solutionTextEditCount,
        solutionSummary: body.debug?.solutionSummary,
        solutionError: body.debug?.solutionError,
        promptUsed: body.promptUsed
      });

      await chrome.storage.session.set({
        [AI_PREVIEW_STORAGE_KEY]: {
          requestId: body.requestId,
          model: body.model,
          durationMs: body.durationMs,
          patternId: previewPattern?.id,
          patternName: previewPattern?.name ?? "Recommendation fixes",
          previewImageBase64: body.previewImageBase64,
          previewId: body.requestId,
          debug: body.debug
        }
      });

      const generatedPreview: GeneratedPreviewImage = {
        id: body.requestId || `preview-${Date.now()}`,
        createdAt: new Date().toISOString(),
        sourceUrl: capture.url,
        sourceTitle: capture.title,
        patternId: previewPattern?.id,
        patternName: previewPattern?.name ?? "Recommendation fixes",
        sectionType: effectiveAIResult?.sectionType ?? "unknown",
        layoutType: effectiveAIResult?.layoutType ?? "unknown",
        imageBase64: body.previewImageBase64,
        sourceScreenshotBase64: capture.screenshotBase64,
        promptUsed: body.promptUsed,
        model: body.model,
        provider: "gemini",
        uncodixifyScore: uncodixifyResult?.score,
        uncodixifyFindings: uncodixifyResult?.findings
          .map((finding) => finding.title)
      };

      await addGeneratedPreview(generatedPreview);
      setGeneratedPreviews(await getGeneratedPreviews());
      if (openResult) {
        await openGeneratedPreviewWindow(generatedPreview.id);
      }

      setPagePreviewStatus(
        openResult ? "AI preview generated." : "AI preview generated in Recommendations."
      );
      addGeminiLog("success", "AI preview generated", {
        previewId: generatedPreview.id,
        requestId: body.requestId,
        model: body.model,
        durationMs: body.durationMs
      });
    } catch (error) {
      const message = isFetchFailure(error)
        ? formatBackendUnavailableMessage(AI_PREVIEW_URL)
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

  async function openGeneratedPreviewTab(previewId: string) {
    const url = chrome.runtime.getURL(`preview-image.html?id=${previewId}`);

    await chrome.tabs.create({ url });
  }

  async function openGeneratedPreviewWindow(previewId: string) {
    await chrome.tabs.create({
      url: chrome.runtime.getURL(`preview-image.html?id=${previewId}`)
    });
  }

  async function openGeneratedPreviewGallery() {
    const url = chrome.runtime.getURL("preview-gallery.html");

    await chrome.tabs.create({ url });
  }

  async function showGeneratedPreviewOnPage(preview = latestGeneratedPreview) {
    if (!preview) {
      setPagePreviewStatus("No generated AI preview available.");
      return;
    }

    const response = await chrome.runtime.sendMessage({
      type: "SHOW_AI_IMAGE_PREVIEW",
      payload: {
        previewImageBase64: preview.imageBase64,
        patternName: preview.patternName ?? "Generated preview"
      }
    });

    if (response && typeof response === "object" && "ok" in response && !response.ok) {
      setPagePreviewStatus(
        "error" in response ? String(response.error) : "Could not show AI preview on page."
      );
      return;
    }

    setPagePreviewStatus("AI preview shown on page.");
  }

  function downloadGeneratedPreview(preview = latestGeneratedPreview) {
    if (!preview) {
      setPagePreviewStatus("No generated AI preview available.");
      return;
    }

    downloadBase64Image(preview.imageBase64, previewDownloadFilename(preview.createdAt));
  }

  async function startNewScreenshot() {
    setSelectedPatternId(null);
    setSelectedTemplateId(null);
    setSelectedAnimationId(null);
    setExcludedUncodixRuleIds([]);
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
      SELECTED_TEMPLATE_STORAGE_KEY,
      SELECTED_ANIMATION_STORAGE_KEY,
      EXCLUDED_UNCODIX_RULES_STORAGE_KEY,
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
      apiBaseUrl: API_BASE_URL,
      backendUrl: ANALYZE_URL,
      healthUrl: HEALTH_URL,
      aiPreviewUrl: AI_PREVIEW_URL,
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
          sourceContextChars: geminiDebug.sourceContextChars,
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
          solutionStatus: aiPreviewDebug.solutionStatus,
          solutionModel: aiPreviewDebug.solutionModel,
          solutionDurationMs: aiPreviewDebug.solutionDurationMs,
          solutionPromptChars: aiPreviewDebug.solutionPromptChars,
          solutionTextEditCount: aiPreviewDebug.solutionTextEditCount,
          solutionSummary: aiPreviewDebug.solutionSummary,
          solutionError: aiPreviewDebug.solutionError,
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
        styleTokensAvailable: Boolean(capture?.styleTokens),
        objectInventory: capture ? buildCaptureObjectInventory(capture) : undefined
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

  const analysisStatusLabel =
    aiStatus === "loading"
      ? "Analyzing"
      : aiStatus === "error"
        ? "Local rules"
        : effectiveAIResult
          ? "Ready"
          : capture
            ? "Captured"
            : "Waiting";

  return (
    <main className="min-h-screen bg-pilot-bg px-4 pb-8 pt-4 text-base text-pilot-text">
      <header className="sticky top-0 z-20 -mx-4 border-b border-pilot-border bg-pilot-bg/95 px-4 pb-4 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pilot-primary text-base font-black text-white">
              DH
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-black leading-tight tracking-tight">
                Design Humanizer
              </h1>
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg border border-pilot-border bg-pilot-panel p-1">
          {(["simple", "developer"] as const).map((option) => (
            <button
              className={`rounded-md px-3 py-2.5 text-sm font-bold transition ${
                mode === option
                  ? "bg-pilot-primary text-white"
                  : "text-pilot-muted hover:bg-pilot-primary/10 hover:text-pilot-text"
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

      <section className="mt-4 space-y-2">
        <button
          className="dh-button-primary flex h-14 w-full items-center justify-center gap-2 text-base"
          onClick={() => void startNewScreenshot()}
          type="button"
        >
          <span className="text-xl leading-none">+</span>
          New Screenshot
        </button>
      </section>

      <AccountPanel mode={mode} />

      <section className="dh-card mt-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-pilot-text">Selected Area</h2>
            {!capture ? (
              <p className="mt-1 text-sm leading-6 text-pilot-muted">
                {hasLoadedCapture ? "Select an area from the popup." : "Loading latest capture..."}
              </p>
            ) : null}
          </div>
          <span className="dh-chip">
            {capture ? "Screenshot ready" : "Waiting"}
          </span>
        </div>

        <div className="mt-3 flex min-h-32 items-center justify-center overflow-hidden rounded-lg border border-pilot-border bg-pilot-card/55 p-2">
          {imageSrc ? (
            <img
              alt="Selected UI area"
              className="block max-h-48 max-w-full rounded-md object-contain"
              src={imageSrc}
            />
          ) : (
            <p className="text-sm font-semibold text-pilot-soft">No screenshot captured</p>
          )}
        </div>

        {mode === "developer" ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Metric
              label="Area"
              value={
                capture
                  ? `${formatPixels(capture.selectedRect.width)} x ${formatPixels(
                      capture.selectedRect.height
                    )}`
                  : "none"
              }
            />
            <Metric label="Backend" value={backendHealthStatus} />
            <Metric label="AI" value={aiStatus} />
          </div>
        ) : null}

        {mode === "developer" ? (
          <button
            className="dh-button-secondary mt-3 w-full px-3 py-2.5 text-sm"
            disabled={!capture || aiStatus === "loading"}
            onClick={() => void analyzeWithGemini()}
            type="button"
          >
            {aiStatus === "loading" ? "Analyzing..." : "Analyze with Gemini"}
          </button>
        ) : null}
      </section>

      <section className="dh-card mt-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-black text-pilot-text">Analysis</h2>
          <span className="dh-chip">{analysisStatusLabel}</span>
        </div>
        {effectiveAIResult ? (
          <>
            {mode === "developer" ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="dh-chip">{effectiveAIResult.sectionType}</span>
                <span className="dh-chip">{effectiveAIResult.layoutType}</span>
                <span className="dh-chip">
                  {effectiveAIResult.uiProblems[0] ?? "polish opportunity"}
                </span>
              </div>
            ) : null}
            <p className="mt-3 text-sm leading-6 text-pilot-muted">
              {effectiveAIResult.designerDescription ||
                `${effectiveAIResult.sectionType} section, ${effectiveAIResult.layoutType} layout`}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm leading-6 text-pilot-muted">
            {capture
              ? "Analyzing the selected block…"
              : "Select an area to analyze."}
          </p>
        )}
        <AnalysisProcessTrail
          aiResult={effectiveAIResult}
          capture={capture}
          status={aiStatus}
          step={analysisStep}
        />
        {aiStatus === "error" ? (
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-pilot-danger">
            {mode === "simple"
              ? "AI analysis is unavailable. Style checks are still available."
              : aiError}
          </p>
        ) : null}
        {aiStatus === "error" ? (
          <button
            className="dh-button-secondary mt-3 w-full px-3 py-2.5 text-sm"
            disabled={!capture}
            onClick={() => void analyzeWithGemini(capture, mode === "simple")}
            type="button"
          >
            Retry Analysis
          </button>
        ) : null}
        {backendHealthError && mode === "developer" ? (
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-pilot-danger">
            {backendHealthError}
          </p>
        ) : null}
      </section>

      <UncodixifyCheck
        result={uncodixifyResult}
        mode={mode}
        variant={mode === "developer" ? "full" : "summary"}
        geminiRaw={effectiveAIResult?.uncodixify ?? null}
        includedRuleIds={includedUncodixRuleIds}
        onToggleRule={toggleUncodixRule}
      />

      <section className="dh-card mt-4 p-4">
        <h2 className="text-lg font-black text-pilot-text">Actions</h2>
        <div className="mt-3 grid gap-2">
          <button
            className="dh-button-primary w-full px-3 py-3.5 text-base"
            disabled={!uncodixifyResult}
            onClick={() => void openRecommendationsWindow()}
            type="button"
          >
            Open Recommendation
          </button>
          <button
            className="dh-button-secondary w-full px-3 py-3 text-sm"
            disabled={!effectiveAIResult || !cursorPromptText}
            onClick={() => void copyCursorPromptFromSidePanel()}
            type="button"
          >
            {promptCopied ? "Copied" : "Copy Prompt"}
          </button>
          <button
            className="dh-button-secondary w-full px-3 py-3 text-sm"
            disabled={!capture}
            onClick={() => void openCodeChangeTab()}
            type="button"
          >
            Generate Code Change
          </button>
        </div>
        {aiPreviewStatus === "error" && aiPreviewError ? (
          <p className="mt-3 rounded-md border border-pilot-border bg-pilot-bg p-3 text-sm leading-6 text-pilot-muted">
            AI Preview is unavailable. Use the Cursor Prompt.
          </p>
        ) : null}
        {pagePreviewStatus ? (
          <p className="mt-3 text-sm leading-6 text-pilot-soft">{pagePreviewStatus}</p>
        ) : null}
      </section>

      {mode === "developer" ? (
        <details className="dh-card mt-4 p-4" open>
          <summary className="cursor-pointer text-sm font-black text-pilot-text">
            Developer Details
          </summary>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              className="dh-button-secondary px-3 py-2 text-xs"
              disabled={!capture || aiPreviewStatus === "loading"}
              onClick={() => void generateAIPreview({ openResult: false })}
              type="button"
            >
              {aiPreviewStatus === "loading" ? "Generating…" : "Generate AI Preview"}
            </button>
            <button
              className="dh-button-secondary px-3 py-2 text-xs"
              disabled={!generatedPreviews.length}
              onClick={() => void openGeneratedPreviewGallery()}
              type="button"
            >
              Open Gallery
            </button>
            <button
              className="dh-button-secondary px-3 py-2 text-xs"
              disabled={!selectedPattern}
              onClick={() => void openFullPreview()}
              type="button"
            >
              Open Full Preview
            </button>
            <button
              className="dh-button-secondary px-3 py-2 text-xs"
              disabled={!selectedPattern}
              onClick={() => void showOnPage()}
              type="button"
            >
              Show on page
            </button>
            <button
              className="dh-button-secondary px-3 py-2 text-xs"
              disabled={!latestGeneratedPreview}
              onClick={() => downloadGeneratedPreview(latestGeneratedPreview)}
              type="button"
            >
              Download Preview
            </button>
            <button
              className="dh-button-secondary px-3 py-2 text-xs hover:border-pilot-danger/70"
              onClick={() => void closePagePreview()}
              type="button"
            >
              Close page preview
            </button>
          </div>

          <GeminiDebugPanel
            aiStatus={aiStatus}
            aiPreviewDebug={aiPreviewDebug}
            aiPreviewStatus={aiPreviewStatus}
            backendHealthStatus={backendHealthStatus}
            capture={capture}
            copied={debugCopied}
            debug={geminiDebug}
            logs={geminiLogs}
            onCheckBackend={() => void checkBackendHealth()}
            onCopyDebugInfo={() => void copyDebugInfo()}
            onClearPreviewDebugLogs={() => void clearPreviewDebugLogs()}
            onCopyPreviewDebugLogs={() => void copyPreviewDebugLogs()}
            onRetryGemini={() => void analyzeWithGemini(capture, false)}
            previewDebugCopied={previewDebugCopied}
          />

          <PromptDebugPanel
            cursorPrompt={cursorPromptText}
            aiImagePrompt={aiPreviewDebug.promptUsed}
            analysisSummary={buildAnalysisPromptSummary(capture, geminiDebug, effectiveAIResult)}
            designDirectionSelected={designDirectionSelected}
            includedFixCount={includedUncodixRuleIds.length}
          />

          {suggestions ? (
            <SuggestionDebugPanel
              debug={suggestions.debug}
              referenceHealth={getReferenceHealthDebug(templateReferences, selectedTemplate)}
            />
          ) : null}
        </details>
      ) : null}
    </main>
  );
}

function buildAIPreviewRecommendationCounts({
  analysis,
  suggestions,
  templateReferences,
  animationReferences,
  uncodixifyRecommendations
}: {
  analysis: UncodixifyAnalysisResult | null;
  suggestions: HumanizerSuggestions | null;
  templateReferences: TemplateReference[];
  animationReferences: AnimationReference[];
  uncodixifyRecommendations: string[];
}) {
  return {
    designChecks: analysis?.findings.length ?? 0,
    layoutIdeas: suggestions?.layoutPatterns.length ?? 0,
    templateReferences: templateReferences.length,
    animationReferences: animationReferences.length,
    uncodixifyRecommendations: uncodixifyRecommendations.length
  };
}

function buildAIPreviewRecommendationContext({
  analysis,
  suggestions,
  templateReferences,
  animationReferences
}: {
  analysis: UncodixifyAnalysisResult | null;
  suggestions: HumanizerSuggestions | null;
  templateReferences: TemplateReference[];
  animationReferences: AnimationReference[];
}) {
  return {
    designChecks:
      analysis?.findings.map((finding, index) => ({
        index: index + 1,
        ruleId: finding.ruleId,
        title: previewContextText(finding.title, 96),
        category: finding.category,
        severity: finding.severity,
        recommendation: previewContextText(finding.recommendation, 220),
        betterDirection: previewContextText(finding.betterDirection, 180),
        evidence: previewContextText(finding.evidence[0], 160)
      })) ?? [],
    layoutIdeas:
      suggestions?.layoutPatterns.map((pattern, index) => ({
        index: index + 1,
        id: pattern.id,
        name: previewContextText(pattern.name, 96),
        category: pattern.category,
        instruction: previewContextText(pattern.promptInstruction, 240),
        solves: pattern.solvesProblems.slice(0, 5)
      })) ?? [],
    templateReferences: templateReferences.map((reference, index) => ({
      index: index + 1,
      id: reference.id,
      title: previewContextText(reference.title, 120),
      source: reference.source,
      category: reference.category,
      tags: reference.tags.slice(0, 8),
      description: previewContextText(reference.description, 180),
      usageNote: previewContextText(reference.usageNote, 180)
    })),
    animationReferences: animationReferences.map((reference, index) => ({
      index: index + 1,
      id: reference.id,
      title: previewContextText(reference.title, 120),
      source: reference.source,
      category: reference.category,
      tags: reference.tags.slice(0, 8),
      bestFor: previewContextText(reference.bestFor, 180),
      avoidWhen: previewContextText(reference.avoidWhen, 180)
    }))
  };
}

function previewContextText(value: string | undefined, maxLength: number) {
  const clean = (value ?? "").replace(/\s+/g, " ").trim();
  if (!clean) return undefined;
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 3)}...` : clean;
}

const ANALYSIS_PROCESS_STEPS: Array<{
  id: Exclude<AnalysisProcessStepId, "idle" | "complete" | "error">;
  label: string;
  detail: string;
}> = [
  {
    id: "capture",
    label: "Capture screenshot",
    detail: "Selected pixels are ready."
  },
  {
    id: "prepare",
    label: "Prepare image",
    detail: "Screenshot is packaged for vision analysis."
  },
  {
    id: "send",
    label: "Send to Gemini",
    detail: "Only the screenshot is sent."
  },
  {
    id: "read",
    label: "Read text and components",
    detail: "Gemini scans visible words, buttons, cards, inputs, and media."
  },
  {
    id: "reason",
    label: "Analyze visible context",
    detail: "Text and components drive the section decision."
  },
  {
    id: "recommend",
    label: "Build recommendations",
    detail: "Layout, template, animation, and style findings are prepared."
  }
];

function AnalysisProcessTrail({
  aiResult,
  capture,
  status,
  step
}: {
  aiResult: AIUnderstandingResult | null;
  capture: RectangleCapture | null;
  status: AIStatus;
  step: AnalysisProcessStepId;
}) {
  if (status !== "loading" || !capture) {
    return null;
  }

  const activeStep = step === "idle" && capture ? "capture" : step;
  const activeIndex =
    activeStep === "complete"
      ? ANALYSIS_PROCESS_STEPS.length
      : activeStep === "error"
        ? Math.max(0, ANALYSIS_PROCESS_STEPS.findIndex((item) => item.id === "recommend"))
        : ANALYSIS_PROCESS_STEPS.findIndex((item) => item.id === activeStep);
  const safeActiveIndex = activeIndex < 0 ? 0 : activeIndex;
  const keywordSignals = aiResult?.detectedKeywords.slice(0, 8) ?? [];
  const blockSignals =
    aiResult?.detectedBlocks
      .filter((block) => block.count > 0)
      .slice(0, 6)
      .map((block) => `${block.count} ${block.type.replace("_", " ")}`) ?? [];

  return (
    <div
      aria-live="polite"
      className="mt-4 rounded-xl border border-pilot-border bg-pilot-card/60 p-3"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.08em] text-pilot-text">
          AI process
        </p>
        <span className="text-xs font-semibold text-pilot-muted">
          Thinking
        </span>
      </div>

      <ol className="mt-3 grid gap-2">
        {ANALYSIS_PROCESS_STEPS.map((item, index) => {
          const isDone = index < safeActiveIndex;
          const isActive = index === safeActiveIndex;

          return (
            <li
              className={`flex gap-3 rounded-lg border px-3 py-2 ${
                isActive
                  ? "border-pilot-borderStrong bg-pilot-bg"
                  : "border-pilot-border bg-transparent"
              }`}
              key={item.id}
            >
              <span
                className={`mt-1 flex h-3 w-3 shrink-0 rounded-full ${
                  isActive
                    ? "animate-pulse bg-pilot-primary"
                    : isDone
                      ? "bg-pilot-primary"
                      : "bg-pilot-surface2"
                }`}
              />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-pilot-text">
                  {item.label}
                </span>
                <span className="block text-xs leading-5 text-pilot-muted">
                  {item.detail}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      {aiResult ? (
        <div className="mt-3 grid gap-2">
          {keywordSignals.length ? (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-pilot-muted">
                Text signals
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {keywordSignals.map((keyword) => (
                  <span className="dh-chip text-[11px]" key={keyword}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {blockSignals.length ? (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-pilot-muted">
                Component signals
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {blockSignals.map((signal) => (
                  <span className="dh-chip text-[11px]" key={signal}>
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function PromptDebugPanel({
  cursorPrompt,
  aiImagePrompt,
  analysisSummary,
  designDirectionSelected,
  includedFixCount
}: {
  cursorPrompt: string;
  aiImagePrompt?: string;
  analysisSummary: string;
  designDirectionSelected: boolean;
  includedFixCount: number;
}) {
  const [copied, setCopied] = useState<"debug" | "cursor" | null>(null);
  const safeImagePrompt = aiImagePrompt
    ? redactBase64(aiImagePrompt)
    : "Not generated yet. Generate an AI Preview to populate this.";
  const validation = validateGeneratedPrompt(cursorPrompt, {
    hasFindings: includedFixCount > 0,
    designDirectionSelected
  });

  function flash(which: "debug" | "cursor") {
    setCopied(which);
    window.setTimeout(() => setCopied((c) => (c === which ? null : c)), 1600);
  }

  async function copyCursor() {
    await navigator.clipboard.writeText(cursorPrompt);
    flash("cursor");
  }

  async function copyDebug() {
    const text = [
      "=== Gemini Analysis Prompt (summary) ===",
      analysisSummary,
      "",
      "=== AI Image Preview Prompt ===",
      safeImagePrompt,
      "",
      "=== Cursor/Codex Prompt ===",
      cursorPrompt
    ].join("\n");
    await navigator.clipboard.writeText(text);
    flash("debug");
  }

  return (
    <details className="mt-3 rounded-lg border border-pilot-border bg-pilot-panel p-3">
      <summary className="cursor-pointer text-sm font-bold text-pilot-text">
        Prompt Debug
      </summary>

      <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-pilot-soft">
        <span className="rounded bg-pilot-bg px-1.5 py-0.5">
          design direction: {designDirectionSelected ? "selected" : "none"}
        </span>
        <span className="rounded bg-pilot-bg px-1.5 py-0.5">
          fixes in prompt: {includedFixCount}
        </span>
        <span className="rounded bg-pilot-bg px-1.5 py-0.5">
          screenshot: attached separately
        </span>
      </div>

      <div className="mt-3 rounded-md border border-pilot-border bg-pilot-card/60 p-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-pilot-text">Prompt validation</span>
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] ${
              validation.errors.length
                ? "bg-pilot-danger/15 text-pilot-danger"
                : validation.warnings.length
                  ? "bg-pilot-warning/12 text-pilot-warning"
                  : "bg-pilot-success/12 text-pilot-success"
            }`}
          >
            {validation.errors.length
              ? "Errors"
              : validation.warnings.length
                ? "Warnings"
                : "Valid"}
          </span>
        </div>
        {validation.errors.length || validation.warnings.length ? (
          <ul className="mt-2 space-y-0.5 text-[10px] leading-4">
            {validation.errors.map((message, index) => (
              <li className="text-pilot-danger" key={`e-${index}`}>
                • {message}
              </li>
            ))}
            {validation.warnings.map((message, index) => (
              <li className="text-pilot-warning" key={`w-${index}`}>
                • {message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-[10px] text-pilot-soft">
            Prompt follows the PromptGen architecture and safety rules.
          </p>
        )}
      </div>

      <PromptBlock title="1. Gemini Analysis Prompt (summary)" value={analysisSummary} />
      <PromptBlock title="2. AI Image Preview Prompt" value={safeImagePrompt} />
      <PromptBlock title="3. Cursor/Codex Prompt" value={cursorPrompt} open />

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className="rounded-lg border border-pilot-border bg-pilot-card px-3 py-2 text-xs font-bold text-pilot-text transition hover:border-pilot-borderStrong"
          onClick={() => void copyDebug()}
          type="button"
        >
          {copied === "debug" ? "Copied" : "Copy Prompt Debug"}
        </button>
        <button
          className="dh-button-primary px-3 py-2 text-xs"
          onClick={() => void copyCursor()}
          type="button"
        >
          {copied === "cursor" ? "Copied" : "Copy Cursor Prompt"}
        </button>
      </div>
    </details>
  );
}

function PromptBlock({
  title,
  value,
  open
}: {
  title: string;
  value: string;
  open?: boolean;
}) {
  return (
    <details className="mt-2 rounded-md border border-pilot-border bg-pilot-card/60 p-2" open={open}>
      <summary className="cursor-pointer text-[11px] font-bold text-pilot-muted">
        {title}
      </summary>
      <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words text-[10px] leading-4 text-pilot-muted">
        {value}
      </pre>
    </details>
  );
}

// Reconstructs a safe, human-readable summary of what is sent to the Gemini UI
// analysis endpoint. The full system prompt is built server-side in
// web/app/api/analyze-area/route.ts. This never includes screenshot base64.
function buildAnalysisPromptSummary(
  capture: RectangleCapture | null,
  debug: GeminiDebugState,
  aiResult: AIUnderstandingResult | null
): string {
  if (!capture) {
    return "No capture yet. Select an area to send a UI analysis request.";
  }
  return [
    "Gemini UI analysis request (system prompt is built server-side).",
    "[screenshot image attached separately]",
    `Model: ${debug.model ?? "auto (gemini flash)"}`,
    `Selected area: ${Math.round(capture.selectedRect.width)}x${Math.round(
      capture.selectedRect.height
    )}`,
    "Gemini input: screenshot plus capped source context from the selected area.",
    `Source context: selected HTML=${Boolean(capture.selectedSourceSection?.htmlPreview)}, section candidates=${capture.sourceSections?.length ?? 0}, matched elements=${capture.matchedElements.length}, used CSS rules=${capture.usedCssRules?.ruleCount ?? 0}, page design sample=${capture.pageDesignContext?.sampledElements ?? 0} elements.`,
    `Object inventory: ${formatObjectInventorySummary(capture)}.`,
    "Gemini instruction: inspect the screen first, then use HTML/CSS context to confirm visible text, structure, and style problems.",
    `Includes Uncodixify visual-quality check: yes`,
    `Result section/layout: ${aiResult?.sectionType ?? "?"} / ${aiResult?.layoutType ?? "?"}`,
    "Expected output: strict JSON (AIUnderstandingResult + uncodixify block)."
  ].join("\n");
}

// Defensive: strip any data:image/base64 blob from a prompt before display/copy.
function redactBase64(text: string): string {
  return text
    .replace(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/g, "[screenshot image attached separately]")
    .replace(/[A-Za-z0-9+/=]{400,}/g, "[binary data omitted]");
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
  onCheckBackend,
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
  onCheckBackend: () => void;
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
        className="mt-3 rounded-xl border border-pilot-border bg-pilot-panel/82 p-3"
        open={aiStatus === "error"}
      >
        <summary className="cursor-pointer text-sm font-bold text-pilot-text">
          Gemini Debug
        </summary>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Metric label="API base URL" value={API_BASE_URL} />
          <Metric label="Health URL" value={HEALTH_URL} />
          <Metric label="Analyze URL" value={ANALYZE_URL} />
          <Metric label="Health" value={backendHealthStatus} />
          <Metric label="Request ID" value={debug.requestId ?? "none"} />
          <Metric label="Model" value={debug.model ?? "unknown"} />
          <Metric label="Analyze" value={aiStatus} />
          <Metric label="Duration" value={debug.durationMs ? `${debug.durationMs}ms` : "none"} />
          <Metric label="Retries" value={debug.retryCount ?? 0} />
          <Metric label="Screenshot" value={debug.screenshotLength ?? 0} />
          <Metric label="Source Context" value={debug.sourceContextChars ?? 0} />
          <Metric label="Input" value={debug.sourceContextChars ? "screenshot + source" : "screenshot"} />
          <Metric label="JSON" value={debug.jsonParseStrategy ?? "none"} />
          <Metric label="Error Code" value={debug.error?.code ?? "none"} />
          <Metric label="Error Stage" value={debug.error?.stage ?? "none"} />
          <Metric label="AI Preview" value={aiPreviewStatus} />
          <Metric label="AI Preview ID" value={aiPreviewDebug.requestId ?? "none"} />
          <Metric label="AI Preview Model" value={aiPreviewDebug.model ?? "unknown"} />
          <Metric label="Solution" value={aiPreviewDebug.solutionStatus ?? "none"} />
          <Metric label="Solution Model" value={aiPreviewDebug.solutionModel ?? "none"} />
          <Metric
            label="Solution Time"
            value={aiPreviewDebug.solutionDurationMs ? `${aiPreviewDebug.solutionDurationMs}ms` : "none"}
          />
          <Metric label="Text Edits" value={aiPreviewDebug.solutionTextEditCount ?? 0} />
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
          <Metric label="Page Tokens" value={capture?.pageDesignContext?.sampledElements ?? 0} />
        </div>

        {capture ? <ObjectInventoryDebug capture={capture} /> : null}

        {debug.error ? (
          <div className="mt-3 rounded-lg border border-red-300/20 bg-red-950/20 p-3">
            <p className="text-xs font-bold text-red-700">{debug.error.message}</p>
            {debug.error.details ? (
              <p className="mt-2 break-words text-xs leading-5 text-red-700/80">
                {debug.error.details}
              </p>
            ) : null}
          </div>
        ) : null}

        {aiPreviewDebug.error ? (
          <div className="mt-3 rounded-lg border border-red-300/20 bg-red-950/20 p-3">
            <p className="text-xs font-bold text-red-700">
              AI Preview: {aiPreviewDebug.error.message}
            </p>
            {aiPreviewDebug.error.details ? (
              <p className="mt-2 break-words text-xs leading-5 text-red-700/80">
                {aiPreviewDebug.error.details}
              </p>
            ) : null}
          </div>
        ) : null}

        {aiPreviewDebug.solutionError ? (
          <div className="mt-3 rounded-lg border border-amber-300/20 bg-amber-950/20 p-3">
            <p className="text-xs font-bold text-amber-800">
              Solution prepass: {aiPreviewDebug.solutionError}
            </p>
          </div>
        ) : null}

        {aiPreviewDebug.solutionSummary ? (
          <DebugDetails
            title="AI preview solution summary"
            value={aiPreviewDebug.solutionSummary}
          />
        ) : null}

        {aiPreviewDebug.modelSelectionWarning ? (
          <div className="mt-3 rounded-lg border border-amber-300/20 bg-amber-950/20 p-3">
            <p className="text-xs font-bold text-amber-800">
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
          <details className="mt-3 rounded-lg border border-pilot-border bg-pilot-card/50 p-3">
            <summary className="cursor-pointer text-xs font-bold text-pilot-text">
              AI preview prompt
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-5 text-pilot-muted">
              {aiPreviewDebug.promptUsed}
            </pre>
          </details>
        ) : null}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            className="rounded-lg border border-pilot-primary/30 bg-pilot-primary/10 px-3 py-2 text-xs font-bold text-pilot-primaryDeep transition hover:bg-pilot-primary/16 disabled:cursor-not-allowed disabled:border-pilot-border disabled:bg-pilot-panel disabled:text-pilot-soft"
            disabled={backendHealthStatus === "checking"}
            onClick={onCheckBackend}
            type="button"
          >
            {backendHealthStatus === "checking" ? "Checking..." : "Check backend"}
          </button>
          <button
            className="rounded-lg border border-pilot-primary/30 bg-pilot-primary/10 px-3 py-2 text-xs font-bold text-pilot-primaryDeep transition hover:bg-pilot-primary/16 disabled:cursor-not-allowed disabled:border-pilot-border disabled:bg-pilot-panel disabled:text-pilot-soft"
            disabled={aiStatus === "loading"}
            onClick={onRetryGemini}
            type="button"
          >
            Retry Gemini
          </button>
          <button
            className="rounded-lg border border-pilot-border bg-pilot-card/60 px-3 py-2 text-xs font-bold text-pilot-text transition hover:bg-pilot-card/80"
            onClick={onCopyDebugInfo}
            type="button"
          >
            {copied ? "Copied" : "Copy Debug Info"}
          </button>
        </div>

        <div className="mt-3 rounded-lg border border-pilot-border bg-pilot-card/45 p-3">
          <h3 className="text-xs font-bold text-pilot-text">Logs</h3>
          <div className="mt-2 max-h-48 space-y-2 overflow-auto">
            {logs.length ? (
              logs.map((entry) => (
                <div
                  className="rounded-md border border-pilot-border bg-pilot-card/60 p-2"
                  key={entry.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={logLevelClassName(entry.level)}>{entry.level}</span>
                    <span className="text-[10px] text-pilot-soft">{entry.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-pilot-text">{entry.message}</p>
                  {entry.data ? (
                    <pre className="mt-2 max-h-24 overflow-auto whitespace-pre-wrap break-words text-[10px] leading-4 text-pilot-muted">
                      {JSON.stringify(entry.data, null, 2)}
                    </pre>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-xs text-pilot-muted">No Gemini logs yet.</p>
            )}
          </div>
        </div>
      </details>

      <details
        className="mt-3 rounded-xl border border-pilot-border bg-pilot-panel/82 p-3"
        open={previewDebugLogs.length > 0}
      >
        <summary className="cursor-pointer text-sm font-bold text-pilot-text">
          Preview Debug Logs
        </summary>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            className="rounded-lg border border-pilot-border bg-pilot-card/60 px-3 py-2 text-xs font-bold text-pilot-text transition hover:bg-pilot-card/80"
            onClick={onCopyPreviewDebugLogs}
            type="button"
          >
            {previewDebugCopied ? "Copied" : "Copy Preview Debug Logs"}
          </button>
          <button
            className="rounded-lg border border-pilot-border bg-pilot-card/60 px-3 py-2 text-xs font-bold text-pilot-text transition hover:border-red-300/70 hover:bg-red-500/10"
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
            <p className="rounded-lg border border-pilot-border bg-pilot-card/45 p-3 text-xs leading-5 text-pilot-muted">
              No preview debug logs yet. Select an area, then open or show a preview.
            </p>
          )}
        </div>
      </details>
    </>
  );
}

function ObjectInventoryDebug({ capture }: { capture: RectangleCapture }) {
  const inventory = buildCaptureObjectInventory(capture);
  const summary = inventory.summary;

  return (
    <details className="mt-3 rounded-lg border border-pilot-border bg-pilot-card/50 p-3" open>
      <summary className="cursor-pointer text-xs font-bold text-pilot-text">
        Object Inventory
      </summary>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Metric label="Headings" value={summary.headings} />
        <Metric label="Actions" value={summary.actions} />
        <Metric label="Cards" value={summary.cards} />
        <Metric label="Inputs" value={summary.inputs} />
        <Metric label="Media" value={summary.media} />
        <Metric label="Metrics" value={summary.metrics} />
        <Metric label="Prices" value={summary.priceTokens} />
        <Metric label="Testimonials" value={summary.testimonials} />
        <Metric label="Long Text" value={summary.longTextBlocks} />
      </div>
      <DebugDetails
        title="Inventory JSON"
        value={JSON.stringify(
          {
            primaryHeading: inventory.primaryHeading,
            headings: inventory.headings,
            actions: inventory.actions.slice(0, 8),
            cards: inventory.cards.slice(0, 10),
            metrics: inventory.metrics,
            priceTokens: inventory.priceTokens,
            repeatedGroups: inventory.repeatedGroups,
            styleSignals: inventory.styleSignals,
            layoutSignals: inventory.layoutSignals,
            keywords: inventory.keywords
          },
          null,
          2
        )}
      />
    </details>
  );
}

function PreviewDebugLogEntry({ log }: { log: PreviewDebugLog }) {
  return (
    <article className="rounded-lg border border-pilot-border bg-pilot-card/45 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-pilot-primary/25 bg-pilot-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-pilot-primaryDeep">
          {log.stage}
        </span>
        <span className="text-[10px] text-pilot-soft">
          {new Date(log.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="mt-2 text-xs font-bold text-pilot-text">{log.message}</p>
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
    <details className="mt-2 rounded-md border border-pilot-border bg-pilot-card/70 p-2">
      <summary className="cursor-pointer text-[11px] font-bold text-pilot-muted">
        {title}
      </summary>
      <pre className="mt-2 max-h-52 overflow-auto whitespace-pre-wrap break-words text-[10px] leading-4 text-pilot-muted">
        {value}
      </pre>
    </details>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-pilot-border bg-pilot-card/45 p-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-pilot-soft">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold text-pilot-text">{value}</p>
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
          ? "border-pilot-primary/80 bg-pilot-primary/10"
          : "border-pilot-border bg-pilot-card/45 hover:border-pilot-primary/45"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-pilot-text">{reference.title}</h3>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-pilot-primary/80">
            {reference.source} · {reference.category}
          </p>
        </div>
        {selected ? (
          <span className="shrink-0 rounded-full border border-pilot-primary/40 bg-pilot-primary/15 px-2 py-0.5 text-[10px] font-semibold text-pilot-primaryDeep">
            Attached
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {isBroken && mode === "developer" ? (
          <span className="rounded-full border border-red-300/40 bg-red-100/80 px-2 py-0.5 text-[10px] font-bold text-red-700">
            Broken link
          </span>
        ) : null}
        {isUnknown ? (
          <span className="rounded-full border border-amber-300/40 bg-amber-100/80 px-2 py-0.5 text-[10px] font-bold text-amber-800">
            Unchecked link
          </span>
        ) : null}
        {reference.urlStatus === "ok" ? (
          <span className="rounded-full border border-emerald-300/40 bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            Link checked
          </span>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-pilot-muted">
        {isBroken ? "Reference unavailable. A fallback 21st.dev page will be used." : reference.description ?? reference.usageNote}
      </p>
      <TagList tags={reference.tags.slice(0, 5)} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition ${
            selected
              ? "bg-pilot-primary text-white hover:bg-pilot-primaryDeep"
              : "bg-pilot-card text-pilot-text hover:bg-pilot-card"
          }`}
          onClick={onSelect}
          type="button"
        >
          Attach reference
        </button>
        <button
          className="rounded-lg border border-pilot-border px-2.5 py-2 text-center text-xs font-semibold text-pilot-text transition hover:border-pilot-primary/70 hover:bg-pilot-primary/10"
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
          ? "border-pilot-primary/80 bg-pilot-primary/10"
          : "border-pilot-border bg-pilot-card/45 hover:border-pilot-primary/45"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-pilot-text">{reference.title}</h3>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-pilot-primary/80">
            {reference.source} · {reference.category}
          </p>
        </div>
        {selected ? (
          <span className="shrink-0 rounded-full border border-pilot-primary/40 bg-pilot-primary/15 px-2 py-0.5 text-[10px] font-semibold text-pilot-primaryDeep">
            Selected
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xs leading-5 text-pilot-muted">{reference.bestFor}</p>
      <TagList tags={reference.tags.slice(0, 5)} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition ${
            selected
              ? "bg-pilot-primary text-white hover:bg-pilot-primaryDeep"
              : "bg-pilot-card text-pilot-text hover:bg-pilot-card"
          }`}
          onClick={onSelect}
          type="button"
        >
          Use animation idea
        </button>
        <a
          className="rounded-lg border border-pilot-border px-2.5 py-2 text-center text-xs font-semibold text-pilot-text transition hover:border-pilot-primary/70 hover:bg-pilot-primary/10"
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
          className="rounded-full border border-pilot-border bg-pilot-panel px-2 py-0.5 text-[10px] font-medium text-pilot-muted"
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
    <section className="mt-3 rounded-xl border border-pilot-border bg-pilot-panel/82 p-3">
      <h2 className="text-sm font-bold text-pilot-text">Suggestion debug</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Metric label="References" value={referenceHealth.total} />
        <Metric label="OK links" value={referenceHealth.ok} />
        <Metric label="Broken links" value={referenceHealth.broken} />
        <Metric label="Unknown links" value={referenceHealth.unknown} />
      </div>
      <p className="mt-2 text-[11px] leading-5 text-pilot-muted">
        Selected reference status: {referenceHealth.selectedStatus}
      </p>
      <TagList tags={debug.inputKeywords.slice(0, 30)} />
      <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-pilot-border bg-pilot-card/70">
        {debug.scores.map((score) => (
          <div
            className="grid grid-cols-[74px_1fr_42px] gap-2 border-b border-pilot-border px-2 py-2 text-[10px] last:border-b-0"
            key={`${score.type}-${score.id}`}
          >
            <span className="font-bold uppercase text-pilot-primaryDeep">{score.type}</span>
            <span className="min-w-0 truncate text-pilot-muted" title={score.id}>
              {score.id}
            </span>
            <span className="text-right font-bold text-pilot-text">{score.score}</span>
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
        sourceContextChars: body.debug?.sourceContextChars,
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
      sourceContextChars: body.debug?.sourceContextChars,
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
    ? error.message
    : "Gemini analysis failed. Try again or switch to Developer Mode for details.";
}

function formatBackendUnavailableMessage(url: string) {
  return [
    `Backend URL used: ${url}`,
    "Could not reach backend.",
    "Check VITE_API_BASE_URL and whether the Vercel backend is deployed."
  ].join("\n");
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
    return `${base} bg-emerald-100/80 text-emerald-700`;
  }
  if (level === "error") {
    return `${base} bg-red-100/80 text-red-700`;
  }
  if (level === "warn") {
    return `${base} bg-amber-100/80 text-amber-800`;
  }

  return `${base} bg-pilot-primary/10 text-pilot-primaryDeep`;
}

function getScreenshotImageSrc(screenshotBase64: string | undefined): string {
  if (!screenshotBase64) return "";
  return screenshotBase64.startsWith("data:")
    ? screenshotBase64
    : `data:image/png;base64,${screenshotBase64}`;
}

function buildAnalyzePayload(capture: RectangleCapture) {
  return {
    screenshotBase64: capture.screenshotBase64,
    sourceContext: buildAnalyzeSourceContext(capture)
  };
}

function buildAnalyzeSourceContext(capture: RectangleCapture) {
  const objectInventory = buildCaptureObjectInventory(capture);

  return {
    url: capture.url,
    title: capture.title,
    selectedArea: {
      width: Math.round(capture.selectedRect.width),
      height: Math.round(capture.selectedRect.height),
      top: Math.round(capture.selectedRect.top),
      left: Math.round(capture.selectedRect.left),
      viewportWidth: Math.round(capture.selectedRect.viewportWidth),
      viewportHeight: Math.round(capture.selectedRect.viewportHeight)
    },
    visibleText: summarizeVisibleText(capture.matchedElements),
    counts: capture.counts,
    objectInventory,
    selectedSourceSection: capture.selectedSourceSection
      ? serializeSourceSectionForGemini(capture.selectedSourceSection, 2400)
      : null,
    sourceSectionCandidates: (capture.sourceSections ?? [])
      .slice(0, 8)
      .map((section) => serializeSourceSectionForGemini(section, 1200)),
    matchedElements: capture.matchedElements.slice(0, 50).map((element) => ({
      tagName: element.tagName,
      id: element.id,
      className: element.className,
      role: element.role,
      ariaLabel: element.ariaLabel,
      text: truncateDebugText(element.text, 220),
      rect: {
        width: Math.round(element.rect.width),
        height: Math.round(element.rect.height),
        top: Math.round(element.rect.top),
        left: Math.round(element.rect.left)
      },
      style: {
        display: element.style.display,
        position: element.style.position,
        backgroundColor: element.style.backgroundColor,
        color: element.style.color,
        fontSize: element.style.fontSize,
        fontWeight: element.style.fontWeight,
        borderRadius: element.style.borderRadius,
        boxShadow: truncateDebugText(element.style.boxShadow, 180),
        padding: element.style.padding,
        margin: element.style.margin
      }
    })),
    styleContext: capture.styleContext,
    styleTokens: capture.styleTokens,
    pageDesignContext: capture.pageDesignContext
      ? serializePageDesignContextForGemini(capture.pageDesignContext)
      : undefined,
    usedCssRules: capture.usedCssRules
      ? {
          cssText: truncateDebugText(sanitizeDebugCss(capture.usedCssRules.cssText), 10000),
          ruleCount: capture.usedCssRules.ruleCount,
          skippedStyleSheets: capture.usedCssRules.skippedStyleSheets,
          errors: capture.usedCssRules.errors.slice(0, 5),
          matchedSelectors: capture.usedCssRules.debug?.matchedSelectors.slice(0, 80),
          mediaRuleCount: capture.usedCssRules.debug?.mediaRuleCount
        }
      : undefined
  };
}

function formatObjectInventorySummary(capture: RectangleCapture) {
  const inventory = buildCaptureObjectInventory(capture);
  const summary = inventory.summary;

  return [
    `${summary.headings} headings`,
    `${summary.actions} actions`,
    `${summary.cards} cards`,
    `${summary.inputs} inputs`,
    `${summary.media} media`,
    `${summary.metrics} metrics`,
    `${summary.priceTokens} price tokens`
  ].join(", ");
}

function serializeSourceSectionForGemini(
  section: RectangleCapture["selectedSourceSection"],
  htmlLimit: number
) {
  if (!section) return null;

  return {
    domPath: section.domPath,
    tagName: section.tagName,
    id: section.id,
    className: section.className,
    role: section.role,
    ariaLabel: section.ariaLabel,
    textSummary: truncateDebugText(section.textSummary, 500),
    childElementCount: section.childElementCount,
    selectionOverlap: Number(section.selectionOverlap.toFixed(3)),
    counts: section.counts,
    headingSnippets: section.headingSnippets.slice(0, 5),
    ctaSnippets: section.ctaSnippets.slice(0, 5),
    mediaSnippets: section.mediaSnippets.slice(0, 5),
    htmlPreview: truncateDebugText(sanitizeDebugHtml(section.htmlPreview), htmlLimit)
  };
}

function serializePageDesignContextForGemini(
  context: NonNullable<RectangleCapture["pageDesignContext"]>
) {
  return {
    sampledAt: context.sampledAt,
    totalElements: context.totalElements,
    sampledElements: context.sampledElements,
    typography: {
      fontFamilies: context.typography.fontFamilies.slice(0, 4),
      fontSizes: context.typography.fontSizes.slice(0, 8),
      fontWeights: context.typography.fontWeights.slice(0, 6),
      lineHeights: context.typography.lineHeights.slice(0, 6),
      letterSpacing: context.typography.letterSpacing.slice(0, 4)
    },
    colors: {
      text: context.colors.text.slice(0, 6),
      backgrounds: context.colors.backgrounds.slice(0, 6),
      borders: context.colors.borders.slice(0, 6),
      focus: context.colors.focus.slice(0, 3)
    },
    spacing: {
      scale: context.spacing.scale.slice(0, 8),
      margin: context.spacing.margin.slice(0, 6),
      padding: context.spacing.padding.slice(0, 6)
    },
    radius: context.radius.slice(0, 6),
    shadows: context.shadows.slice(0, 4),
    motion: {
      durations: context.motion.durations.slice(0, 5),
      easings: context.motion.easings.slice(0, 5)
    },
    components: context.components.slice(0, 8),
    siteSignals: {
      title: context.siteSignals.title,
      description: truncateDebugText(context.siteSignals.description, 360),
      keywords: truncateDebugText(context.siteSignals.keywords, 240),
      ogType: context.siteSignals.ogType,
      ogSiteName: context.siteSignals.ogSiteName,
      appName: context.siteSignals.appName,
      pathname: context.siteSignals.pathname,
      hostname: context.siteSignals.hostname,
      headings: context.siteSignals.headings.slice(0, 8),
      navTexts: context.siteSignals.navTexts.slice(0, 16),
      ctaTexts: context.siteSignals.ctaTexts.slice(0, 16),
      textSample: truncateDebugText(context.siteSignals.textSample, 1200),
      elementCounts: context.siteSignals.elementCounts
    },
    diagnostics: context.diagnostics.slice(0, 5)
  };
}

function summarizeVisibleText(elements: RectangleCapture["matchedElements"]) {
  const unique = new Set<string>();

  elements.forEach((element) => {
    const text = element.text.replace(/\s+/g, " ").trim();
    if (text) unique.add(text);
  });

  return truncateDebugText(Array.from(unique).slice(0, 80).join("\n"), 5000);
}

function isFetchFailure(error: unknown) {
  return error instanceof TypeError || String(error).includes("Failed to fetch");
}

// Safe, development-only prompt logging. Never logs prompt content, screenshots,
// or secrets — only the type, length, and section metadata.
function logPromptSafely(
  type: "cursor" | "ai-image" | "analysis",
  prompt: string,
  meta: Record<string, unknown>
) {
  if (!import.meta.env.DEV) return;
  console.log(`[prompt:${type}]`, { chars: prompt.length, ...meta });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
