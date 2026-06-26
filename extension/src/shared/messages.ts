import type { LayoutPattern } from "../patterns/layoutPatterns";
import type { ElementCounts, PolishPilotMessage, RectangleCapture } from "./types";

export const LATEST_CAPTURE_STORAGE_KEY = "latestRectangleCapture";
export const LATEST_AI_RESULT_STORAGE_KEY = "latestAIResult";
export const SELECTED_PATTERN_STORAGE_KEY = "selectedPatternId";
export const FULL_PREVIEW_STORAGE_KEY = "fullPreviewData";
export const AI_PREVIEW_STORAGE_KEY = "aiPreviewData";
export const POLISH_PILOT_MODE_STORAGE_KEY = "polishPilotMode";

// Floating-window data + selection sync (control-center architecture).
export const DESIGN_IDEAS_STORAGE_KEY = "designIdeasData";
export const RECOMMENDATIONS_STORAGE_KEY = "recommendationsData";
export const SELECTED_TEMPLATE_STORAGE_KEY = "selectedTemplateId";
export const SELECTED_ANIMATION_STORAGE_KEY = "selectedAnimationId";
export const EXCLUDED_UNCODIX_RULES_STORAGE_KEY = "excludedUncodixRuleIds";
export const AI_PREVIEW_REGENERATE_KEY = "aiPreviewRegenerateRequest";
export const WORKSPACE_AI_PREVIEW_REQUEST_KEY = "workspaceAiPreviewRequest";
export const CODE_CHANGE_STORAGE_KEY = "codeChangeData";

export function isPolishPilotMessage(value: unknown): value is PolishPilotMessage {
  return Boolean(
    value &&
      typeof value === "object" &&
      "type" in value &&
      typeof (value as { type?: unknown }).type === "string" &&
      [
        "START_RECTANGLE_SELECTION",
        "START_NEW_SCREENSHOT",
        "RECTANGLE_SELECTION_COMPLETE",
        "RECTANGLE_CAPTURE_READY",
        "CAPTURE_UPDATED",
        "USAGE_UPDATED",
        "SHOW_IN_PAGE_PREVIEW",
        "SHOW_AI_IMAGE_PREVIEW",
        "REMOVE_IN_PAGE_PREVIEW"
      ].includes((value as { type: string }).type)
  );
}

export function patternCopyLabel(pattern: LayoutPattern): string {
  return `Copy prompt for ${pattern.name}`;
}

export function chromeLastErrorMessage(): string | null {
  return chrome.runtime.lastError?.message ?? null;
}

export function formatPixels(value: number): string {
  return `${Math.round(value)}px`;
}

export function buildDesignerDescription(capture: RectangleCapture): string {
  const counts = summarizeCounts(capture.counts);

  return `This selected area contains ${counts}. Gemini will classify the section from the screenshot.`;
}

function summarizeCounts(counts: ElementCounts): string {
  const parts = [
    `${counts.totalElements} elements`,
    counts.headings ? `${counts.headings} headings` : "",
    counts.buttons ? `${counts.buttons} buttons` : "",
    counts.links ? `${counts.links} links` : "",
    counts.images ? `${counts.images} images` : "",
    counts.svgs ? `${counts.svgs} icons` : "",
    counts.inputs ? `${counts.inputs} inputs` : ""
  ].filter(Boolean);

  return parts.join(", ");
}
