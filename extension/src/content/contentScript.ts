import type {
  DetectionSummary,
  ElementCounts,
  MatchedElement,
  RectangleSelectionPayload,
  SelectionRect,
  AIImagePreviewPayload,
  InPagePreviewPayload,
  StyleContext
} from "../shared/types";
import { detectSectionAndLayout, estimateCards } from "./sectionDetection";
import { extractStyleTokens } from "./extractStyleTokens";
import { extractUsedCssRules } from "./extractUsedCssRules";
import type { StyleTokens } from "./extractStyleTokens";
import type { UsedCssExtractionResult } from "./extractUsedCssRules";
import {
  createPreviewDebugLog,
  sanitizeDebugCss,
  sanitizeDebugHtml,
  truncateDebugText
} from "../shared/previewDebug";

declare global {
  interface Window {
    __polishPilotRectangleSelectionLoaded?: boolean;
  }
}

(() => {
const OVERLAY_ID = "polishpilot-rectangle-overlay";
const PREVIEW_OVERLAY_ID = "polishpilot-in-page-preview";
const PREVIEW_BACKDROP_ID = "polishpilot-in-page-preview-backdrop";
const IGNORED_TAGS = new Set(["SCRIPT", "STYLE", "META", "LINK", "NOSCRIPT"]);

let isSelecting = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let overlay: HTMLDivElement | null = null;
let selectionBox: HTMLDivElement | null = null;
let dimensionsLabel: HTMLDivElement | null = null;
let previewContainer: HTMLDivElement | null = null;
let previewBackdrop: HTMLDivElement | null = null;
let isPreviewExpanded = false;
let previewKeydownHandler: ((event: KeyboardEvent) => void) | null = null;

if (!window.__polishPilotRectangleSelectionLoaded) {
  window.__polishPilotRectangleSelectionLoaded = true;

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!isPolishPilotContentMessage(message)) {
      return false;
    }

    try {
      if (message.type === "START_RECTANGLE_SELECTION") {
        startRectangleSelection();
        sendResponse({ ok: true });
        return false;
      }

      if (message.type === "SHOW_IN_PAGE_PREVIEW") {
        showInPagePreview(message.payload);
        sendResponse({ ok: true });
        return false;
      }

      if (message.type === "SHOW_AI_IMAGE_PREVIEW") {
        showAIImagePreview(message.payload);
        sendResponse({ ok: true });
        return false;
      }

      if (message.type === "REMOVE_IN_PAGE_PREVIEW") {
        removeInPagePreview();
        sendResponse({ ok: true });
        return false;
      }
    } catch (error) {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }

    return false;
  });
}

function isPolishPilotContentMessage(
  value: unknown
): value is
  | { type: "START_RECTANGLE_SELECTION" }
  | { type: "SHOW_IN_PAGE_PREVIEW"; payload: InPagePreviewPayload }
  | { type: "SHOW_AI_IMAGE_PREVIEW"; payload: AIImagePreviewPayload }
  | { type: "REMOVE_IN_PAGE_PREVIEW" } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "type" in value &&
      typeof (value as { type?: unknown }).type === "string" &&
      [
        "START_RECTANGLE_SELECTION",
        "SHOW_IN_PAGE_PREVIEW",
        "SHOW_AI_IMAGE_PREVIEW",
        "REMOVE_IN_PAGE_PREVIEW"
      ].includes((value as { type: string }).type)
  );
}

function startRectangleSelection() {
  removeInPagePreview();

  if (isSelecting || overlay) {
    stopSelection();
  } else {
    removeOverlay();
  }

  isSelecting = true;
  isDragging = false;
  createOverlay();
}

function createOverlay() {
  removeOverlay();

  overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.dataset.polishpilot = "true";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "2147483647";
  overlay.style.cursor = "crosshair";
  overlay.style.background = "rgba(2, 6, 23, 0.18)";
  overlay.style.userSelect = "none";
  overlay.style.touchAction = "none";

  const hint = document.createElement("div");
  hint.textContent = "Drag over a UI section";
  hint.style.position = "fixed";
  hint.style.top = "16px";
  hint.style.left = "50%";
  hint.style.transform = "translateX(-50%)";
  hint.style.padding = "8px 12px";
  hint.style.borderRadius = "999px";
  hint.style.border = "1px solid rgba(34, 211, 238, 0.35)";
  hint.style.background = "rgba(8, 13, 26, 0.92)";
  hint.style.color = "#E0F2FE";
  hint.style.font = "600 12px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  hint.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.35)";
  overlay.appendChild(hint);

  selectionBox = document.createElement("div");
  selectionBox.dataset.polishpilot = "true";
  selectionBox.style.position = "fixed";
  selectionBox.style.display = "none";
  selectionBox.style.border = "2px solid #22D3EE";
  selectionBox.style.background = "rgba(34, 211, 238, 0.14)";
  selectionBox.style.boxShadow = "0 0 0 9999px rgba(2, 6, 23, 0.38), inset 0 0 0 1px rgba(255,255,255,0.22)";
  selectionBox.style.borderRadius = "8px";
  overlay.appendChild(selectionBox);

  dimensionsLabel = document.createElement("div");
  dimensionsLabel.dataset.polishpilot = "true";
  dimensionsLabel.style.position = "fixed";
  dimensionsLabel.style.display = "none";
  dimensionsLabel.style.padding = "4px 7px";
  dimensionsLabel.style.borderRadius = "7px";
  dimensionsLabel.style.background = "#0F172A";
  dimensionsLabel.style.color = "#E0F2FE";
  dimensionsLabel.style.font = "700 11px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  dimensionsLabel.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.34)";
  overlay.appendChild(dimensionsLabel);

  overlay.addEventListener("mousedown", handleMouseDown, true);
  overlay.addEventListener("mousemove", handleMouseMove, true);
  overlay.addEventListener("mouseup", handleMouseUp, true);
  window.addEventListener("keydown", handleKeyDown, true);

  document.documentElement.appendChild(overlay);
}

function handleMouseDown(event: MouseEvent) {
  if (!overlay || event.button !== 0) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  isDragging = true;
  startX = clamp(event.clientX, 0, window.innerWidth);
  startY = clamp(event.clientY, 0, window.innerHeight);
  updateSelectionBox(startX, startY);
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  updateSelectionBox(event.clientX, event.clientY);
}

function handleMouseUp(event: MouseEvent) {
  if (!isDragging) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const selectedRect = buildSelectionRect(startX, startY, event.clientX, event.clientY);

  if (selectedRect.width < 8 || selectedRect.height < 8) {
    stopSelection();
    return;
  }

  const matchedElements = getElementsInRect(selectedRect);
  const counts = buildCounts(matchedElements);
  const detected = detectSectionAndLayout(matchedElements, counts);
  const styleContext = extractStyleContext(selectedRect, matchedElements);
  const selectedRoot = findSelectedRootElement(selectedRect);
  const usedCssRules = selectedRoot ? extractUsedCssRules(selectedRoot) : undefined;
  const styleTokens = selectedRoot ? extractStyleTokens(selectedRoot) : undefined;
  const previewDebugLogs = buildCapturePreviewDebugLogs({
    selectedRect,
    selectedRoot,
    matchedElements,
    counts,
    detected,
    usedCssRules,
    styleTokens
  });
  const payload: RectangleSelectionPayload = {
    url: window.location.href,
    title: document.title,
    selectedRect,
    matchedElements,
    counts,
    detected,
    styleContext,
    usedCssRules,
    styleTokens,
    previewDebugLogs
  };

  stopSelection();

  chrome.runtime.sendMessage({
    type: "RECTANGLE_SELECTION_COMPLETE",
    payload
  });
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    stopSelection();
  }
}

function stopSelection() {
  isSelecting = false;
  isDragging = false;
  window.removeEventListener("keydown", handleKeyDown, true);
  removeOverlay();
}

function showInPagePreview(payload: InPagePreviewPayload) {
  removeInPagePreview();
  isPreviewExpanded = false;

  const backdrop = document.createElement("div");
  backdrop.id = PREVIEW_BACKDROP_ID;
  backdrop.dataset.polishpilot = "true";
  backdrop.style.position = "fixed";
  backdrop.style.inset = "0";
  backdrop.style.zIndex = "2147483646";
  backdrop.style.display = "none";
  backdrop.style.background = "rgba(2, 6, 23, 0.5)";
  backdrop.style.backdropFilter = "blur(3px)";
  backdrop.style.pointerEvents = "auto";
  backdrop.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPreviewExpanded(false);
  });

  const container = document.createElement("div");
  container.id = PREVIEW_OVERLAY_ID;
  container.dataset.polishpilot = "true";
  container.setAttribute("role", "dialog");
  container.setAttribute("aria-label", "PolishPilot page preview");
  container.style.boxSizing = "border-box";
  container.style.border = "1px solid rgba(148, 163, 184, 0.34)";
  container.style.borderRadius = "20px";
  container.style.background = "rgba(2, 6, 23, 0.96)";
  container.style.color = "#F8FAFC";
  container.style.boxShadow = "0 28px 90px rgba(0, 0, 0, 0.5)";
  container.style.backdropFilter = "blur(14px)";
  container.style.font = "500 13px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  container.style.pointerEvents = "auto";
  container.style.transition = "top 160ms ease, left 160ms ease, right 160ms ease, width 160ms ease, max-height 160ms ease, transform 160ms ease";
  container.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  const topBar = document.createElement("div");
  topBar.style.display = "flex";
  topBar.style.alignItems = "center";
  topBar.style.justifyContent = "space-between";
  topBar.style.gap = "12px";
  topBar.style.padding = "12px 14px";
  topBar.style.borderBottom = "1px solid rgba(148, 163, 184, 0.2)";
  topBar.style.position = "sticky";
  topBar.style.top = "0";
  topBar.style.zIndex = "1";
  topBar.style.background = "rgba(2, 6, 23, 0.92)";
  topBar.style.backdropFilter = "blur(14px)";

  const titleWrap = document.createElement("div");
  titleWrap.style.minWidth = "0";
  titleWrap.style.flex = "1 1 auto";

  const label = document.createElement("div");
  label.textContent = "Preview";
  label.style.fontSize = "11px";
  label.style.lineHeight = "14px";
  label.style.fontWeight = "800";
  label.style.letterSpacing = "0.08em";
  label.style.textTransform = "uppercase";
  label.style.color = "#67E8F9";

  const patternName = document.createElement("div");
  patternName.textContent = payload.patternName;
  patternName.style.marginTop = "2px";
  patternName.style.overflow = "hidden";
  patternName.style.textOverflow = "ellipsis";
  patternName.style.whiteSpace = "nowrap";
  patternName.style.fontSize = "13px";
  patternName.style.lineHeight = "18px";
  patternName.style.fontWeight = "800";
  patternName.style.color = "#F8FAFC";

  const hint = document.createElement("div");
  hint.textContent = "Click preview to enlarge";
  hint.style.marginTop = "2px";
  hint.style.fontSize = "11px";
  hint.style.lineHeight = "15px";
  hint.style.fontWeight = "700";
  hint.style.color = "#94A3B8";

  titleWrap.append(label, patternName, hint);

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.alignItems = "center";
  actions.style.gap = "8px";
  actions.style.flex = "0 0 auto";

  const expandButton = createPreviewButton("⛶", "Expand preview");
  expandButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPreviewExpanded(!isPreviewExpanded);
  });

  const closeButton = createPreviewButton("×", "Close preview");
  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeInPagePreview();
  });

  actions.append(expandButton, closeButton);
  topBar.append(titleWrap, actions);
  container.appendChild(topBar);

  const body = document.createElement("div");
  body.style.padding = "16px";
  body.style.display = "grid";
  body.style.gap = "12px";
  body.style.cursor = "zoom-in";
  body.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isPreviewExpanded) {
      setPreviewExpanded(true);
    }
  });

  if (payload.problemNotes?.length) {
    body.appendChild(renderProblemNotes(payload.problemNotes));
  }

  body.appendChild(renderPreviewHtml(payload));
  container.appendChild(body);

  previewContainer = container;
  previewBackdrop = backdrop;
  previewKeydownHandler = (event: KeyboardEvent) => {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (isPreviewExpanded) {
      setPreviewExpanded(false);
      return;
    }

    removeInPagePreview();
  };

  window.addEventListener("keydown", previewKeydownHandler, true);
  applyPreviewContainerMode(container, false);
  document.documentElement.append(backdrop, container);
}

function showAIImagePreview(payload: AIImagePreviewPayload) {
  removeInPagePreview();
  isPreviewExpanded = false;

  const backdrop = document.createElement("div");
  backdrop.id = PREVIEW_BACKDROP_ID;
  backdrop.dataset.polishpilot = "true";
  backdrop.style.position = "fixed";
  backdrop.style.inset = "0";
  backdrop.style.zIndex = "2147483646";
  backdrop.style.display = "none";
  backdrop.style.background = "rgba(2, 6, 23, 0.58)";
  backdrop.style.backdropFilter = "blur(4px)";
  backdrop.style.pointerEvents = "auto";
  backdrop.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPreviewExpanded(false);
  });

  const container = document.createElement("div");
  container.id = PREVIEW_OVERLAY_ID;
  container.dataset.polishpilot = "true";
  container.setAttribute("role", "dialog");
  container.setAttribute("aria-label", "Design Humanizer AI preview");
  container.style.boxSizing = "border-box";
  container.style.border = "1px solid rgba(148, 163, 184, 0.34)";
  container.style.borderRadius = "20px";
  container.style.background = "rgba(2, 6, 23, 0.96)";
  container.style.color = "#F8FAFC";
  container.style.boxShadow = "0 28px 90px rgba(0, 0, 0, 0.5)";
  container.style.backdropFilter = "blur(14px)";
  container.style.font = "500 13px ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  container.style.pointerEvents = "auto";
  container.style.transition = "top 160ms ease, left 160ms ease, right 160ms ease, width 160ms ease, max-height 160ms ease, transform 160ms ease";
  container.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  const topBar = document.createElement("div");
  topBar.style.display = "flex";
  topBar.style.alignItems = "center";
  topBar.style.justifyContent = "space-between";
  topBar.style.gap = "12px";
  topBar.style.padding = "12px 14px";
  topBar.style.borderBottom = "1px solid rgba(148, 163, 184, 0.2)";
  topBar.style.position = "sticky";
  topBar.style.top = "0";
  topBar.style.zIndex = "1";
  topBar.style.background = "rgba(2, 6, 23, 0.92)";
  topBar.style.backdropFilter = "blur(14px)";

  const titleWrap = document.createElement("div");
  titleWrap.style.minWidth = "0";
  titleWrap.style.flex = "1 1 auto";

  const label = document.createElement("div");
  label.textContent = "AI Preview";
  label.style.fontSize = "11px";
  label.style.lineHeight = "14px";
  label.style.fontWeight = "800";
  label.style.letterSpacing = "0.08em";
  label.style.textTransform = "uppercase";
  label.style.color = "#67E8F9";

  const patternName = document.createElement("div");
  patternName.textContent = payload.patternName;
  patternName.style.marginTop = "2px";
  patternName.style.overflow = "hidden";
  patternName.style.textOverflow = "ellipsis";
  patternName.style.whiteSpace = "nowrap";
  patternName.style.fontSize = "13px";
  patternName.style.lineHeight = "18px";
  patternName.style.fontWeight = "800";
  patternName.style.color = "#F8FAFC";

  titleWrap.append(label, patternName);

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.alignItems = "center";
  actions.style.gap = "8px";
  actions.style.flex = "0 0 auto";

  const expandButton = createPreviewButton("⛶", "Expand AI preview");
  expandButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPreviewExpanded(!isPreviewExpanded);
  });

  const closeButton = createPreviewButton("×", "Close AI preview");
  closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeInPagePreview();
  });

  actions.append(expandButton, closeButton);
  topBar.append(titleWrap, actions);
  container.appendChild(topBar);

  const body = document.createElement("div");
  body.style.padding = "14px";
  body.style.cursor = "zoom-in";
  body.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isPreviewExpanded) {
      setPreviewExpanded(true);
    }
  });

  const image = document.createElement("img");
  image.alt = `AI preview for ${payload.patternName}`;
  image.src = payload.previewImageBase64;
  image.style.display = "block";
  image.style.width = "100%";
  image.style.height = "auto";
  image.style.maxHeight = "calc(80vh - 88px)";
  image.style.objectFit = "contain";
  image.style.borderRadius = "14px";
  image.style.border = "1px solid rgba(148, 163, 184, 0.22)";
  image.style.background = "#fff";
  body.appendChild(image);
  container.appendChild(body);

  previewContainer = container;
  previewBackdrop = backdrop;
  previewKeydownHandler = (event: KeyboardEvent) => {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (isPreviewExpanded) {
      setPreviewExpanded(false);
      return;
    }

    removeInPagePreview();
  };

  window.addEventListener("keydown", previewKeydownHandler, true);
  applyPreviewContainerMode(container, false);
  document.documentElement.append(backdrop, container);
}

function createPreviewButton(text: string, ariaLabel: string) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.setAttribute("aria-label", ariaLabel);
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.width = "32px";
  button.style.height = "32px";
  button.style.flex = "0 0 auto";
  button.style.border = "1px solid rgba(148, 163, 184, 0.32)";
  button.style.borderRadius = "10px";
  button.style.background = "rgba(15, 23, 42, 0.95)";
  button.style.color = "#CBD5E1";
  button.style.font = "800 16px ui-sans-serif, system-ui, sans-serif";
  button.style.cursor = "pointer";
  button.style.lineHeight = "1";
  return button;
}

function setPreviewExpanded(expanded: boolean) {
  if (!previewContainer || !previewBackdrop) {
    return;
  }

  isPreviewExpanded = expanded;
  previewBackdrop.style.display = expanded ? "block" : "none";
  applyPreviewContainerMode(previewContainer, expanded);
}

function applyPreviewContainerMode(container: HTMLDivElement, expanded: boolean) {
  container.style.position = "fixed";
  container.style.overflow = "auto";

  if (expanded) {
    container.style.top = "16px";
    container.style.left = "16px";
    container.style.right = "16px";
    container.style.width = "calc(100vw - 32px)";
    container.style.maxHeight = "calc(100vh - 32px)";
    container.style.transform = "none";
    container.style.zIndex = "2147483647";
    return;
  }

  container.style.top = window.innerWidth <= 640 ? "16px" : "24px";
  container.style.left = window.innerWidth <= 640 ? "16px" : "auto";
  container.style.right = window.innerWidth <= 640 ? "16px" : "24px";
  container.style.width = window.innerWidth <= 640 ? "calc(100vw - 32px)" : "min(896px, calc(100vw - 48px))";
  container.style.maxHeight = "80vh";
  container.style.transform = "none";
  container.style.zIndex = "2147483646";
}

function cleanupPreviewKeydown() {
  if (previewKeydownHandler) {
    window.removeEventListener("keydown", previewKeydownHandler, true);
    previewKeydownHandler = null;
  }
}

function removeInPagePreview() {
  cleanupPreviewKeydown();
  document.getElementById(PREVIEW_OVERLAY_ID)?.remove();
  document.getElementById(PREVIEW_BACKDROP_ID)?.remove();
  previewContainer = null;
  previewBackdrop = null;
  isPreviewExpanded = false;
}

function renderProblemNotes(notes: string[]) {
  const card = document.createElement("div");
  card.style.border = "1px solid rgba(148, 163, 184, 0.22)";
  card.style.borderRadius = "12px";
  card.style.background = "rgba(15, 23, 42, 0.82)";
  card.style.padding = "10px";

  const title = document.createElement("div");
  title.textContent = "Problem notes";
  title.style.fontWeight = "800";
  title.style.fontSize = "11px";
  title.style.lineHeight = "14px";
  title.style.color = "#E2E8F0";
  card.appendChild(title);

  const list = document.createElement("ul");
  list.style.margin = "6px 0 0";
  list.style.padding = "0 0 0 16px";
  list.style.color = "#CBD5E1";
  list.style.fontSize = "11px";
  list.style.lineHeight = "16px";

  notes.slice(0, 3).forEach((note) => {
    const item = document.createElement("li");
    item.textContent = note;
    list.appendChild(item);
  });

  card.appendChild(list);
  return card;
}

function renderPreviewHtml(payload: InPagePreviewPayload) {
  const previewContent = withStyleTokenTheme(payload.previewContent, payload.styleTokens);
  const theme = previewContent.theme;
  const section = document.createElement("section");
  section.style.border = `1px solid ${theme.borderColor}`;
  section.style.borderRadius = theme.borderRadius;
  section.style.background = theme.sectionBackground;
  section.style.color = theme.textColor;
  section.style.padding = "16px";
  section.style.boxSizing = "border-box";
  section.style.fontFamily = theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif";

  if (previewContent.sectionEyebrow) {
    const eyebrow = document.createElement("div");
    eyebrow.textContent = previewContent.sectionEyebrow;
    eyebrow.style.margin = "0 0 6px";
    eyebrow.style.color = theme.accentColor;
    eyebrow.style.font = `900 11px/14px ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
    eyebrow.style.letterSpacing = "0.08em";
    eyebrow.style.textTransform = "uppercase";
    section.appendChild(eyebrow);
  }

  if (previewContent.sectionTitle) {
    const heading = document.createElement("h2");
    heading.textContent = previewContent.sectionTitle;
    heading.style.margin = "0";
    heading.style.color = theme.textColor;
    heading.style.font = `900 ${theme.headingFontSize ?? "18px"}/24px ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
    section.appendChild(heading);
  }

  if (previewContent.sectionSubtitle) {
    const subtitle = document.createElement("p");
    subtitle.textContent = previewContent.sectionSubtitle;
    subtitle.style.margin = "6px 0 0";
    subtitle.style.color = theme.mutedTextColor;
    subtitle.style.font = `500 ${theme.bodyFontSize ?? "12px"}/18px ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
    section.appendChild(subtitle);
  }

  const layout = document.createElement("div");
  layout.style.marginTop = previewContent.sectionTitle || previewContent.sectionSubtitle ? "16px" : "0";
  layout.appendChild(renderPatternCards(payload.patternId, previewContent));
  section.appendChild(layout);

  if (previewContent.outsideText.length) {
    const outside = document.createElement("div");
    outside.style.display = "grid";
    outside.style.gap = "8px";
    outside.style.marginTop = "16px";

    previewContent.outsideText.forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      paragraph.style.margin = "0";
      paragraph.style.color = theme.mutedTextColor;
      paragraph.style.font = `500 ${theme.bodyFontSize ?? "12px"}/18px ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
      outside.appendChild(paragraph);
    });

    section.appendChild(outside);
  }

  return section;
}

function withStyleTokenTheme(
  previewContent: InPagePreviewPayload["previewContent"],
  styleTokens: InPagePreviewPayload["styleTokens"]
): InPagePreviewPayload["previewContent"] {
  if (!styleTokens) {
    return previewContent;
  }

  return {
    ...previewContent,
    theme: {
      ...previewContent.theme,
      mode:
        styleTokens.theme === "unknown"
          ? previewContent.theme.mode
          : styleTokens.theme,
      sectionBackground:
        styleTokens.section.background ?? previewContent.theme.sectionBackground,
      cardBackground:
        styleTokens.card.background ?? previewContent.theme.cardBackground,
      textColor:
        styleTokens.heading.color ??
        styleTokens.section.color ??
        previewContent.theme.textColor,
      mutedTextColor:
        styleTokens.muted.color ??
        styleTokens.body.color ??
        previewContent.theme.mutedTextColor,
      borderColor:
        styleTokens.card.borderColor ?? previewContent.theme.borderColor,
      accentColor:
        styleTokens.accentColor ?? previewContent.theme.accentColor,
      borderRadius:
        styleTokens.card.borderRadius ?? previewContent.theme.borderRadius,
      cardShadow: styleTokens.card.boxShadow ?? previewContent.theme.cardShadow,
      cardPadding: styleTokens.card.padding ?? previewContent.theme.cardPadding,
      fontFamily: styleTokens.section.fontFamily ?? previewContent.theme.fontFamily,
      headingFontSize:
        styleTokens.heading.fontSize ?? previewContent.theme.headingFontSize,
      bodyFontSize: styleTokens.body.fontSize ?? previewContent.theme.bodyFontSize,
      buttonBackground:
        styleTokens.button.background ?? previewContent.theme.buttonBackground,
      buttonColor: styleTokens.button.color ?? previewContent.theme.buttonColor,
      buttonBorderRadius:
        styleTokens.button.borderRadius ?? previewContent.theme.buttonBorderRadius
    }
  };
}

function renderPatternCards(
  patternId: InPagePreviewPayload["patternId"],
  previewContent: InPagePreviewPayload["previewContent"]
) {
  const items = previewContent.items;
  const theme = previewContent.theme;
  const key = patternId as string;

  if (!items.length) {
    const empty = document.createElement("div");
    empty.textContent = "No repeated card content was detected in this selection.";
    empty.style.border = `1px solid ${theme.borderColor}`;
    empty.style.borderRadius = theme.borderRadius;
    empty.style.background = theme.cardBackground;
    empty.style.color = theme.mutedTextColor;
    empty.style.padding = "12px";
    return empty;
  }

  if (key === "featured-side-stack") {
    const grid = makeGrid("1.25fr 0.75fr");
    grid.appendChild(makePreviewCard(items[0], theme, true));
    const stack = makeStack();
    items.slice(1, 3).forEach((item) => stack.appendChild(makePreviewCard(item, theme)));
    grid.appendChild(stack);
    return grid;
  }

  if (key === "bento-grid") {
    const grid = makeGrid("1.12fr 0.88fr");
    const large = makePreviewCard(items[0], theme, true);
    large.style.minHeight = "172px";
    grid.appendChild(large);
    const stack = makeStack();
    items.slice(1, 4).forEach((item) => stack.appendChild(makePreviewCard(item, theme)));
    grid.appendChild(stack);
    return grid;
  }

  if (key === "center-highlight") {
    const wrap = makeStack();
    const first = makePreviewCard(items[0], theme, true);
    first.style.maxWidth = "82%";
    first.style.margin = "0 auto";
    wrap.appendChild(first);
    const grid = makeGrid("1fr 1fr");
    items.slice(1, 5).forEach((item) => grid.appendChild(makePreviewCard(item, theme)));
    wrap.appendChild(grid);
    return wrap;
  }

  if (key === "workflow-feature-grid" || key === "step-flow") {
    const grid = makeGrid("1fr 1fr 1fr");
    items.slice(0, 4).forEach((item, index) => {
      grid.appendChild(makePreviewCard(item, theme, false, `0${index + 1}`));
    });
    return grid;
  }

  if (key === "pricing-emphasis") {
    const grid = makeGrid("1fr 1fr 1fr");
    items.slice(0, 3).forEach((item, index) => {
      grid.appendChild(makePricingCard(item, theme, index === 1));
    });
    return grid;
  }

  if (key === "stats-highlight" || key === "hero-metric-support-stats" || key === "metric-bento") {
    const grid = makeGrid("1.15fr 0.85fr");
    grid.appendChild(makeStatCard(items[0], theme, true));
    const stack = makeStack();
    items.slice(1, 5).forEach((item) => stack.appendChild(makeStatCard(item, theme)));
    grid.appendChild(stack);
    return grid;
  }

  const grid = makeGrid("1fr 1fr");
  items.slice(0, 6).forEach((item, index) => {
    grid.appendChild(makePreviewCard(item, theme, index === 0));
  });
  return grid;
}

function makePreviewCard(
  item: InPagePreviewPayload["previewContent"]["items"][number],
  theme: InPagePreviewPayload["previewContent"]["theme"],
  strong = false,
  eyebrow?: string
) {
  const card = document.createElement("article");
  card.style.border = `1px solid ${strong ? theme.accentColor : theme.borderColor}`;
  card.style.borderRadius = theme.borderRadius;
  card.style.background = theme.cardBackground;
  card.style.padding = theme.cardPadding ?? (strong ? "14px" : "12px");
  card.style.boxShadow = theme.cardShadow ?? (strong ? "0 12px 32px rgba(8, 47, 73, 0.14)" : "none");
  card.style.fontFamily = theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif";

  if (item.icon?.exists) {
    card.appendChild(makeIconPlaceholder(item.icon, theme));
  }

  if (eyebrow ?? item.eyebrow) {
    const small = document.createElement("div");
    small.textContent = eyebrow ?? item.eyebrow ?? "";
    small.style.marginBottom = "6px";
    small.style.color = theme.accentColor;
    small.style.font = `800 10px/12px ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
    small.style.letterSpacing = "0.08em";
    card.appendChild(small);
  }

  const title = document.createElement("h3");
  title.textContent = item.title;
  title.style.margin = "0";
  title.style.color = theme.textColor;
  title.style.font = `${strong ? "900 15px/20px" : "800 13px/18px"} ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
  card.appendChild(title);

  if (item.description) {
    const description = document.createElement("p");
    description.textContent = item.description;
    description.style.margin = "8px 0 0";
    description.style.color = theme.mutedTextColor;
    description.style.font = `500 11px/16px ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
    card.appendChild(description);
  }

  if (item.cta) {
    const cta = document.createElement("div");
    cta.textContent = item.cta;
    cta.style.marginTop = "10px";
    cta.style.color = theme.accentColor;
    cta.style.font = `800 11px/14px ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
    card.appendChild(cta);
  }

  return card;
}

function makePricingCard(
  item: InPagePreviewPayload["previewContent"]["items"][number],
  theme: InPagePreviewPayload["previewContent"]["theme"],
  emphasized: boolean
) {
  const card = makePreviewCard(item, theme, emphasized);

  if (emphasized) {
    const badge = document.createElement("div");
    badge.textContent = "Recommended";
    badge.style.display = "inline-flex";
    badge.style.marginBottom = "8px";
    badge.style.padding = "3px 7px";
    badge.style.borderRadius = "999px";
    badge.style.background = theme.buttonBackground ?? theme.accentColor;
    badge.style.color = theme.buttonColor ?? (theme.mode === "light" ? "#FFFFFF" : "#082F49");
    badge.style.font = `900 10px/12px ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
    card.prepend(badge);
  }

  if (item.value) {
    const price = document.createElement("div");
    price.textContent = item.value;
    price.style.marginTop = "8px";
    price.style.color = theme.textColor;
    price.style.font = `900 20px/24px ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
    card.insertBefore(price, card.children[emphasized ? 2 : 1] ?? null);
  }

  return card;
}

function makeStatCard(
  item: InPagePreviewPayload["previewContent"]["items"][number],
  theme: InPagePreviewPayload["previewContent"]["theme"],
  strong = false
) {
  const card = document.createElement("article");
  card.style.border = `1px solid ${strong ? theme.accentColor : theme.borderColor}`;
  card.style.borderRadius = theme.borderRadius;
  card.style.background = theme.cardBackground;
  card.style.padding = theme.cardPadding ?? (strong ? "16px" : "12px");
  card.style.boxShadow = theme.cardShadow ?? "none";
  card.style.fontFamily = theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif";

  const value = document.createElement("div");
  value.textContent = item.value ?? item.title;
  value.style.color = theme.textColor;
  value.style.font = `${strong ? "900 26px/30px" : "900 19px/22px"} ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
  card.appendChild(value);

  const label = document.createElement("div");
  label.textContent = item.value ? item.title : item.description ?? "";
  label.style.marginTop = "6px";
  label.style.color = theme.mutedTextColor;
  label.style.font = `700 11px/15px ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
  card.appendChild(label);

  return card;
}

function makeIconPlaceholder(
  icon: NonNullable<InPagePreviewPayload["previewContent"]["items"][number]["icon"]>,
  theme: InPagePreviewPayload["previewContent"]["theme"]
) {
  const placeholder = document.createElement("div");
  placeholder.textContent = "·";
  placeholder.style.display = "flex";
  placeholder.style.alignItems = "center";
  placeholder.style.justifyContent = "center";
  placeholder.style.width = "34px";
  placeholder.style.height = "34px";
  placeholder.style.marginBottom = icon.position === "inline" ? "0" : "10px";
  placeholder.style.marginRight = icon.position === "left" ? "10px" : "0";
  placeholder.style.float = icon.position === "left" ? "left" : "none";
  placeholder.style.border = `2px solid ${icon.color ?? theme.accentColor}`;
  placeholder.style.borderRadius = "10px";
  placeholder.style.color = icon.color ?? theme.accentColor;
  placeholder.style.font = `900 18px/1 ${theme.fontFamily ?? "ui-sans-serif, system-ui, sans-serif"}`;
  return placeholder;
}

function makeGrid(columns: string) {
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = columns;
  grid.style.gap = "10px";
  return grid;
}

function makeStack() {
  const stack = document.createElement("div");
  stack.style.display = "grid";
  stack.style.gap = "10px";
  return stack;
}

function findSelectedRootElement(selectionRect: SelectionRect): HTMLElement | null {
  const candidates = getStyleCandidates(selectionRect);
  const centerElement = document.elementFromPoint(
    selectionRect.left + selectionRect.width / 2,
    selectionRect.top + selectionRect.height / 2
  );
  const selected =
    findLargestLocalContainer(candidates, selectionRect) ??
    (centerElement instanceof HTMLElement
      ? centerElement.closest<HTMLElement>("section, article, main, div")
      : null);

  return selected instanceof HTMLElement ? selected : document.body;
}

function buildCapturePreviewDebugLogs({
  selectedRect,
  selectedRoot,
  matchedElements,
  counts,
  detected,
  usedCssRules,
  styleTokens
}: {
  selectedRect: SelectionRect;
  selectedRoot: HTMLElement | null;
  matchedElements: MatchedElement[];
  counts: ElementCounts;
  detected: DetectionSummary;
  usedCssRules?: UsedCssExtractionResult;
  styleTokens?: StyleTokens;
}) {
  const logs = [];

  if (selectedRoot) {
    logs.push(
      createPreviewDebugLog("selection", "Selected DOM root captured", {
        summary: {
          tagName: selectedRoot.tagName,
          className: truncateDebugText(String(selectedRoot.className ?? ""), 160),
          childElementCount: selectedRoot.childElementCount,
          textLength: selectedRoot.innerText?.length ?? 0,
          rect: {
            width: Math.round(selectedRect.width),
            height: Math.round(selectedRect.height),
            top: Math.round(selectedRect.top),
            left: Math.round(selectedRect.left)
          }
        },
        htmlPreview: truncateDebugText(
          sanitizeDebugHtml(selectedRoot.outerHTML),
          4000
        )
      })
    );
  }

  logs.push(
    createPreviewDebugLog("dom-extraction", "DOM summary extracted", {
      summary: {
        elementCount: matchedElements.length,
        visibleElementCount: matchedElements.length,
        headingCount: counts.headings,
        paragraphCount: matchedElements.filter((element) => element.tagName === "p").length,
        buttonCount: counts.buttons,
        linkCount: counts.links,
        imageCount: counts.images,
        inputCount: counts.inputs,
        likelyCardCount: counts.cardsEstimate,
        localSectionType: detected.sectionType,
        localLayoutType: detected.layoutType,
        parsedElements: matchedElements.slice(0, 30).map((element) => ({
          tag: element.tagName,
          role: element.role,
          text: truncateDebugText(element.text ?? "", 120),
          className: truncateDebugText(element.className ?? "", 120)
        }))
      }
    })
  );

  if (usedCssRules) {
    logs.push(
      createPreviewDebugLog("used-css-extraction", "Used CSS rules extracted", {
        summary: {
          ruleCount: usedCssRules.ruleCount,
          skippedStyleSheets: usedCssRules.skippedStyleSheets,
          errorCount: usedCssRules.errors.length,
          matchedSelectors: usedCssRules.debug?.matchedSelectors?.slice(0, 80),
          skippedSelectors: usedCssRules.debug?.skippedSelectors?.slice(0, 80),
          skippedStyleSheetHrefs: usedCssRules.debug?.skippedStyleSheetHrefs?.slice(0, 20),
          mediaRuleCount: usedCssRules.debug?.mediaRuleCount
        },
        cssPreview: truncateDebugText(sanitizeDebugCss(usedCssRules.cssText), 8000),
        warnings:
          usedCssRules.skippedStyleSheets > 0
            ? [
                `Skipped ${usedCssRules.skippedStyleSheets} stylesheet(s), likely because of CORS.`
              ]
            : [],
        errors: usedCssRules.errors
      })
    );
  }

  if (styleTokens) {
    logs.push(
      createPreviewDebugLog("style-token-extraction", "Style tokens extracted", {
        summary: styleTokens
      })
    );
  }

  return logs;
}

function extractStyleContext(
  selectionRect: SelectionRect,
  matchedElements: MatchedElement[]
): StyleContext {
  const candidates = getStyleCandidates(selectionRect);
  const centerElement =
    document.elementFromPoint(
      selectionRect.left + selectionRect.width / 2,
      selectionRect.top + selectionRect.height / 2
    ) instanceof Element
      ? (document.elementFromPoint(
          selectionRect.left + selectionRect.width / 2,
          selectionRect.top + selectionRect.height / 2
        ) as Element)
      : null;
  const sectionElement =
    findLargestLocalContainer(candidates, selectionRect) ??
    centerElement?.closest("section, main, article, div") ??
    document.body;
  const sectionStyle = getComputedStyle(sectionElement);
  const sectionBackground =
    firstVisibleBackground(sectionElement) ||
    firstColor(
      candidates.map((element) => getComputedStyle(element).backgroundColor),
      { allowNeutral: true }
    ) ||
    "rgb(255, 255, 255)";
  const sectionTextColor =
    nonTransparentColor(sectionStyle.color) ||
    firstColor(candidates.map((element) => getComputedStyle(element).color), {
      allowNeutral: true
    });
  const theme = luminanceFromCss(sectionBackground) > 0.55 ? "light" : "dark";
  const headingElement = candidates.find((element) =>
    /^h[1-6]$/i.test(element.tagName) || element.getAttribute("role") === "heading"
  );
  const bodyElement =
    candidates.find((element) => ["P", "SPAN", "LI"].includes(element.tagName)) ??
    candidates.find((element) => getElementText(element).length > 20);
  const headingStyle = headingElement ? getComputedStyle(headingElement) : null;
  const bodyStyle = bodyElement ? getComputedStyle(bodyElement) : null;
  const representativeCard = findRepresentativeCard(candidates, selectionRect, sectionBackground);
  const cardStyle = representativeCard ? getComputedStyle(representativeCard) : null;
  const buttonElement = candidates.find(isCtaElement);
  const buttonStyle = buttonElement ? getComputedStyle(buttonElement) : null;
  const accent = findAccentContext(candidates, matchedElements);

  return {
    theme,
    section: {
      backgroundColor: sectionBackground,
      color: sectionTextColor,
      fontFamily: sectionStyle.fontFamily,
      borderRadius: usableRadius(sectionStyle.borderRadius),
      padding: usableSpacing(sectionStyle.padding)
    },
    card: {
      backgroundColor:
        cardStyle && nonTransparentColor(cardStyle.backgroundColor)
          ? cardStyle.backgroundColor
          : theme === "light"
            ? "rgba(255, 255, 255, 0.94)"
            : "rgba(15, 23, 42, 0.86)",
      color: cardStyle?.color || sectionTextColor,
      borderColor: cardStyle ? firstBorderColor(cardStyle) : undefined,
      borderRadius: cardStyle ? usableRadius(cardStyle.borderRadius) : undefined,
      boxShadow: cardStyle ? usableShadow(cardStyle.boxShadow) : undefined,
      padding: cardStyle ? usableSpacing(cardStyle.padding) : undefined
    },
    text: {
      headingColor: headingStyle?.color || sectionTextColor,
      bodyColor: bodyStyle?.color || sectionTextColor,
      mutedColor: bodyStyle?.color || (theme === "light" ? "rgb(71, 85, 105)" : "rgb(203, 213, 225)"),
      headingFontSize: headingStyle?.fontSize,
      bodyFontSize: bodyStyle?.fontSize,
      fontFamily: headingStyle?.fontFamily || bodyStyle?.fontFamily || sectionStyle.fontFamily,
      fontWeight: headingStyle?.fontWeight || bodyStyle?.fontWeight,
      lineHeight: bodyStyle?.lineHeight
    },
    accent,
    button: buttonStyle
      ? {
          backgroundColor: nonTransparentColor(buttonStyle.backgroundColor) || undefined,
          color: buttonStyle.color,
          borderRadius: usableRadius(buttonStyle.borderRadius),
          padding: usableSpacing(buttonStyle.padding),
          borderColor: firstBorderColor(buttonStyle)
        }
      : undefined
  };
}

function getStyleCandidates(selectionRect: SelectionRect) {
  return Array.from(document.body.querySelectorAll("*"))
    .filter((node): node is HTMLElement | SVGElement => node instanceof HTMLElement || node instanceof SVGElement)
    .filter((element) => {
      if (IGNORED_TAGS.has(element.tagName) || element.closest("[data-polishpilot='true']")) {
        return false;
      }

      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);

      return (
        rect.width >= 6 &&
        rect.height >= 6 &&
        intersects(rect, selectionRect) &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) !== 0
      );
    })
    .slice(0, 160);
}

function findLargestLocalContainer(
  elements: Array<HTMLElement | SVGElement>,
  selectionRect: SelectionRect
) {
  return elements
    .filter((element): element is HTMLElement => element instanceof HTMLElement)
    .filter((element) => ["SECTION", "ARTICLE", "DIV", "MAIN"].includes(element.tagName))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const area = rect.width * rect.height;
      const style = getComputedStyle(element);

      return {
        element,
        score:
          area -
          Math.abs(area - selectionRect.width * selectionRect.height) * 0.35 +
          (nonTransparentColor(style.backgroundColor) ? 8000 : 0) +
          (Number.parseFloat(style.padding) > 0 ? 1800 : 0)
      };
    })
    .sort((a, b) => b.score - a.score)[0]?.element;
}

function findRepresentativeCard(
  elements: Array<HTMLElement | SVGElement>,
  selectionRect: SelectionRect,
  sectionBackground: string
) {
  return elements
    .filter((element): element is HTMLElement => element instanceof HTMLElement)
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const background = nonTransparentColor(style.backgroundColor);
      const hasDifferentBackground =
        background && parseCssColor(background) && parseCssColor(sectionBackground)
          ? colorDistance(parseCssColor(background)!, parseCssColor(sectionBackground)!) > 18
          : false;
      const radius = Number.parseFloat(style.borderRadius);
      const borderColor = firstBorderColor(style);
      const hasBorder = Boolean(borderColor && !isNeutralTransparent(borderColor));
      const hasShadow = Boolean(usableShadow(style.boxShadow));
      const padding = Number.parseFloat(style.padding);
      const containsText = getElementText(element).length > 8;
      const area = rect.width * rect.height;
      const plausibleSize =
        rect.width >= 90 &&
        rect.height >= 60 &&
        area < selectionRect.width * selectionRect.height * 0.85;

      return {
        element,
        score:
          (plausibleSize ? 8 : 0) +
          (hasDifferentBackground ? 5 : 0) +
          (Number.isFinite(radius) && radius > 2 ? 4 : 0) +
          (hasBorder ? 3 : 0) +
          (hasShadow ? 4 : 0) +
          (Number.isFinite(padding) && padding > 4 ? 3 : 0) +
          (containsText ? 3 : 0)
      };
    })
    .filter((candidate) => candidate.score >= 8)
    .sort((a, b) => b.score - a.score)[0]?.element;
}

function findAccentContext(
  elements: Array<HTMLElement | SVGElement>,
  matchedElements: MatchedElement[]
): StyleContext["accent"] {
  const svgColors = elements
    .filter((element) => element instanceof SVGElement || element.querySelector("svg"))
    .flatMap((element) => {
      const style = getComputedStyle(element);
      return [style.stroke, style.fill, style.color];
    });
  const linkColors = elements
    .filter((element) => element.tagName === "A")
    .map((element) => getComputedStyle(element).color);
  const buttonBackgrounds = elements
    .filter(isCtaElement)
    .map((element) => getComputedStyle(element).backgroundColor);
  const borderColors = elements.flatMap((element) => {
    const style = getComputedStyle(element);
    return [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor];
  });
  const customColors = elements.slice(0, 20).flatMap((element) => collectCustomPropertyColors(getComputedStyle(element)));
  const serializedColors = matchedElements.flatMap((element) => [
    element.style.color,
    element.style.backgroundColor
  ]);

  const color =
    firstColor(svgColors, { allowNeutral: false }) ||
    firstColor(linkColors, { allowNeutral: false }) ||
    firstColor(buttonBackgrounds, { allowNeutral: false }) ||
    firstColor(borderColors, { allowNeutral: false }) ||
    firstColor(customColors, { allowNeutral: false }) ||
    firstColor(serializedColors, { allowNeutral: false }) ||
    firstColor([...linkColors, ...buttonBackgrounds, ...borderColors], { allowNeutral: true });

  return {
    color,
    borderColor: firstColor(borderColors, { allowNeutral: false }) || color,
    backgroundColor: firstColor(buttonBackgrounds, { allowNeutral: false }) || color
  };
}

function isCtaElement(element: Element) {
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute("role");
  const text = getElementText(element);

  return tagName === "button" || tagName === "a" || role === "button" || /\b(start|try|get|join|buy|sign|contact|book|learn)\b/i.test(text);
}

function firstVisibleBackground(element: Element | null): string | undefined {
  let current: Element | null = element;

  while (current) {
    const color = nonTransparentColor(getComputedStyle(current).backgroundColor);

    if (color) {
      return color;
    }

    current = current.parentElement;
  }

  return nonTransparentColor(getComputedStyle(document.body).backgroundColor);
}

function firstColor(values: string[], options: { allowNeutral: boolean }) {
  return values
    .map((value) => nonTransparentColor(value))
    .find((value): value is string => Boolean(value && (options.allowNeutral || !isNeutralColor(value))));
}

function nonTransparentColor(value: string | undefined) {
  if (!value || value === "transparent" || value === "currentColor") {
    return undefined;
  }

  const parsed = parseCssColor(value);

  if (!parsed || parsed.a === 0) {
    return undefined;
  }

  return value;
}

function firstBorderColor(style: CSSStyleDeclaration) {
  return firstColor(
    [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor],
    { allowNeutral: true }
  );
}

function usableRadius(value: string | undefined) {
  if (!value || value === "0px") {
    return undefined;
  }

  return value;
}

function usableSpacing(value: string | undefined) {
  if (!value || value === "0px") {
    return undefined;
  }

  return value;
}

function usableShadow(value: string | undefined) {
  if (!value || value === "none") {
    return undefined;
  }

  return value;
}

function collectCustomPropertyColors(style: CSSStyleDeclaration) {
  const colors: string[] = [];

  for (let index = 0; index < style.length; index += 1) {
    const property = style.item(index);

    if (!property.startsWith("--")) {
      continue;
    }

    const value = style.getPropertyValue(property).trim();

    if (parseCssColor(value)) {
      colors.push(value);
    }
  }

  return colors;
}

type ParsedColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

function parseCssColor(value: string): ParsedColor | null {
  const rgbMatch = value.match(/rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)(?:,\s*([0-9.]+))?\)/i);

  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
      a: rgbMatch[4] ? Number(rgbMatch[4]) : 1
    };
  }

  const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (!hexMatch) {
    return null;
  }

  const hex = hexMatch[1];
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : hex;

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
    a: 1
  };
}

function luminanceFromCss(value: string) {
  const color = parseCssColor(value);

  if (!color) {
    return 1;
  }

  const [r, g, b] = [color.r, color.g, color.b].map((channelValue) => {
    const channel = channelValue / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function colorDistance(a: ParsedColor, b: ParsedColor) {
  return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
}

function isNeutralTransparent(value: string) {
  const color = parseCssColor(value);
  return !color || color.a === 0 || isNeutralColor(value);
}

function isNeutralColor(value: string) {
  const color = parseCssColor(value);

  if (!color) {
    return true;
  }

  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);

  return max - min < 22 || max < 36 || min > 232;
}

function removeOverlay() {
  const staleOverlay = document.getElementById(OVERLAY_ID);

  if (staleOverlay && staleOverlay !== overlay) {
    staleOverlay.remove();
  }

  if (overlay) {
    overlay.removeEventListener("mousedown", handleMouseDown, true);
    overlay.removeEventListener("mousemove", handleMouseMove, true);
    overlay.removeEventListener("mouseup", handleMouseUp, true);
    overlay.remove();
  }

  overlay = null;
  selectionBox = null;
  dimensionsLabel = null;
}

function updateSelectionBox(currentClientX: number, currentClientY: number) {
  if (!selectionBox || !dimensionsLabel) {
    return;
  }

  const rect = buildSelectionRect(startX, startY, currentClientX, currentClientY);

  selectionBox.style.display = "block";
  selectionBox.style.left = `${rect.left}px`;
  selectionBox.style.top = `${rect.top}px`;
  selectionBox.style.width = `${rect.width}px`;
  selectionBox.style.height = `${rect.height}px`;

  dimensionsLabel.textContent = `${Math.round(rect.width)} × ${Math.round(rect.height)}`;
  dimensionsLabel.style.display = "block";
  dimensionsLabel.style.left = `${Math.min(rect.right - 64, window.innerWidth - 96)}px`;
  dimensionsLabel.style.top = `${Math.max(rect.top - 30, 8)}px`;
}

function buildSelectionRect(
  startClientX: number,
  startClientY: number,
  endClientX: number,
  endClientY: number
): SelectionRect {
  const endX = clamp(endClientX, 0, window.innerWidth);
  const endY = clamp(endClientY, 0, window.innerHeight);
  const left = Math.min(startClientX, endX);
  const top = Math.min(startClientY, endY);
  const right = Math.max(startClientX, endX);
  const bottom = Math.max(startClientY, endY);

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    top,
    left,
    right,
    bottom,
    devicePixelRatio: window.devicePixelRatio || 1,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight
  };
}

function getElementsInRect(selectionRect: SelectionRect): MatchedElement[] {
  const elements = Array.from(document.body.querySelectorAll("*"))
    .filter((node): node is HTMLElement | SVGElement => node instanceof HTMLElement || node instanceof SVGElement)
    .filter((element) => isMeaningfulElement(element, selectionRect))
    .map((element) => ({
      element,
      score: scoreElement(element),
      area: areaOf(element.getBoundingClientRect())
    }))
    .sort((a, b) => b.score - a.score || b.area - a.area)
    .slice(0, 50)
    .map(({ element }) => serializeElement(element));

  return elements;
}

function isMeaningfulElement(
  element: HTMLElement | SVGElement,
  selectionRect: SelectionRect
): boolean {
  if (IGNORED_TAGS.has(element.tagName) || element.closest("[data-polishpilot='true']")) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  if (rect.width < 8 || rect.height < 8) {
    return false;
  }

  if (!intersects(rect, selectionRect)) {
    return false;
  }

  const style = getComputedStyle(element);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0" ||
    Number(style.opacity) === 0
  ) {
    return false;
  }

  const text = getElementText(element);
  const tag = element.tagName.toLowerCase();
  const className = getClassName(element).toLowerCase();

  return Boolean(
    text ||
      ["img", "svg", "button", "a", "input", "textarea", "select", "article", "section"].includes(tag) ||
      className.includes("card") ||
      className.includes("feature") ||
      className.includes("grid")
  );
}

function serializeElement(element: HTMLElement | SVGElement): MatchedElement {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);

  return {
    tagName: element.tagName.toLowerCase(),
    id: element.id || null,
    className: getClassName(element) || null,
    role: element.getAttribute("role"),
    ariaLabel: element.getAttribute("aria-label"),
    text: getElementText(element).slice(0, 180),
    rect: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom
    },
    style: {
      display: style.display,
      position: style.position,
      backgroundColor: style.backgroundColor,
      color: style.color,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      borderColor: style.borderColor,
      borderRadius: style.borderRadius,
      boxShadow: style.boxShadow,
      padding: style.padding,
      margin: style.margin
    }
  };
}

function buildCounts(elements: MatchedElement[]): ElementCounts {
  const textLength = elements.reduce((sum, element) => sum + element.text.length, 0);

  return {
    totalElements: elements.length,
    headings: elements.filter((element) => /^h[1-6]$/.test(element.tagName)).length,
    buttons: elements.filter(
      (element) => element.tagName === "button" || element.role === "button"
    ).length,
    links: elements.filter((element) => element.tagName === "a").length,
    images: elements.filter((element) => element.tagName === "img").length,
    svgs: elements.filter((element) => element.tagName === "svg").length,
    inputs: elements.filter((element) =>
      ["input", "textarea", "select"].includes(element.tagName)
    ).length,
    cardsEstimate: estimateCards(elements),
    textLength
  };
}

function scoreElement(element: HTMLElement | SVGElement): number {
  const tag = element.tagName.toLowerCase();
  const className = getClassName(element).toLowerCase();
  let score = 0;

  if (getElementText(element)) score += 3;
  if (["h1", "h2", "h3", "button", "a", "img", "svg", "input"].includes(tag)) score += 4;
  if (["article", "section", "li"].includes(tag)) score += 3;
  if (className.includes("card") || className.includes("feature") || className.includes("grid")) score += 3;
  if (element.getAttribute("role") || element.getAttribute("aria-label")) score += 1;

  return score;
}

function intersects(rect: DOMRect, selectionRect: SelectionRect): boolean {
  return !(
    rect.right < selectionRect.left ||
    rect.left > selectionRect.right ||
    rect.bottom < selectionRect.top ||
    rect.top > selectionRect.bottom
  );
}

function areaOf(rect: DOMRect): number {
  return rect.width * rect.height;
}

function getClassName(element: Element): string {
  const className = element.getAttribute("class");
  return typeof className === "string" ? className.slice(0, 220) : "";
}

function getElementText(element: Element): string {
  return (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 240);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
})();
