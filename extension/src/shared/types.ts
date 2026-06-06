import type { PreviewContent } from "../patterns/extractPreviewItems";
import type { LayoutPatternId } from "../patterns/layoutPatterns";
import type { UsedCssExtractionResult } from "../content/extractUsedCssRules";
import type { StyleTokens } from "../content/extractStyleTokens";
import type { PreviewDebugLog } from "./previewDebug";

export type SelectionRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  devicePixelRatio: number;
  scrollX: number;
  scrollY: number;
  viewportWidth: number;
  viewportHeight: number;
};

export type MatchedElement = {
  tagName: string;
  id: string | null;
  className: string | null;
  role: string | null;
  ariaLabel: string | null;
  text: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
  style: {
    display: string;
    position: string;
    backgroundColor: string;
    color: string;
    fontSize: string;
    fontWeight: string;
    borderColor: string;
    borderRadius: string;
    boxShadow: string;
    padding: string;
    margin: string;
  };
};

export type ElementCounts = {
  totalElements: number;
  headings: number;
  buttons: number;
  links: number;
  images: number;
  svgs: number;
  inputs: number;
  cardsEstimate: number;
  textLength: number;
};

export type UIBlockCategory =
  | "hero"
  | "features"
  | "cards"
  | "pricing"
  | "cta"
  | "stats"
  | "form"
  | "testimonials"
  | "dashboard"
  | "navigation"
  | "footer"
  | "auth"
  | "settings"
  | "unknown";

export type UILayoutType =
  | "equal_grid"
  | "two_column"
  | "vertical_stack"
  | "horizontal_row"
  | "bento"
  | "pricing_columns"
  | "form_layout"
  | "timeline"
  | "carousel"
  | "unknown";

export type DesignIntent =
  | "conversion"
  | "explanation"
  | "comparison"
  | "social_proof"
  | "data_summary"
  | "lead_capture"
  | "navigation"
  | "onboarding"
  | "trust_building"
  | "product_showcase"
  | "unknown";

export type UIProblem =
  | "flat_layout"
  | "weak_hierarchy"
  | "too_repetitive"
  | "cta_not_clear"
  | "cards_too_equal"
  | "spacing_issue"
  | "too_text_heavy"
  | "no_visual_rhythm"
  | "weak_trust_signals"
  | "missing_microinteraction"
  | "unknown";

export type SectionType = Extract<
  UIBlockCategory,
  "hero" | "features" | "cards" | "pricing" | "form" | "stats" | "cta" | "unknown"
>;

export type LayoutType = Extract<
  UILayoutType,
  "equal_grid" | "horizontal_row" | "vertical_stack" | "two_column" | "unknown"
>;

export type DetectionSummary = {
  sectionType: SectionType;
  layoutType: LayoutType;
  confidence: number;
  reasons: string[];
};

export type RectangleCapture = {
  captureId: string;
  url: string;
  title: string;
  selectedRect: SelectionRect;
  screenshotBase64: string;
  matchedElements: MatchedElement[];
  counts: ElementCounts;
  detected: DetectionSummary;
  styleContext?: StyleContext;
  usedCssRules?: UsedCssExtractionResult;
  styleTokens?: StyleTokens;
  previewDebugLogs?: PreviewDebugLog[];
};

export type RectangleSelectionPayload = Omit<
  RectangleCapture,
  "captureId" | "screenshotBase64"
>;

export type StartRectangleSelectionMessage = {
  type: "START_RECTANGLE_SELECTION";
};

export type StartNewScreenshotMessage = {
  type: "START_NEW_SCREENSHOT";
};

export type RectangleSelectionCompleteMessage = {
  type: "RECTANGLE_SELECTION_COMPLETE";
  payload: RectangleSelectionPayload;
};

export type RectangleCaptureReadyMessage = {
  type: "RECTANGLE_CAPTURE_READY";
  payload: RectangleCapture;
};

export type CaptureUpdatedMessage = {
  type: "CAPTURE_UPDATED";
  capture: RectangleCapture;
};

export type InPagePreviewPayload = {
  selectedRect: SelectionRect;
  patternId: LayoutPatternId;
  patternName: string;
  previewContent: PreviewContent;
  styleContext?: StyleContext;
  usedCssRules?: UsedCssExtractionResult;
  styleTokens?: StyleTokens;
  problemNotes?: string[];
};

export type ShowInPagePreviewMessage = {
  type: "SHOW_IN_PAGE_PREVIEW";
  payload: InPagePreviewPayload;
};

export type AIImagePreviewPayload = {
  previewImageBase64: string;
  patternName: string;
};

export type ShowAIImagePreviewMessage = {
  type: "SHOW_AI_IMAGE_PREVIEW";
  payload: AIImagePreviewPayload;
};

export type RemoveInPagePreviewMessage = {
  type: "REMOVE_IN_PAGE_PREVIEW";
};

export type PolishPilotMessage =
  | StartRectangleSelectionMessage
  | StartNewScreenshotMessage
  | RectangleSelectionCompleteMessage
  | RectangleCaptureReadyMessage
  | CaptureUpdatedMessage
  | ShowInPagePreviewMessage
  | ShowAIImagePreviewMessage
  | RemoveInPagePreviewMessage;

export type AIUnderstandingResult = {
  sectionType: UIBlockCategory;
  layoutType: UILayoutType;
  contentType:
    | "cards"
    | "text_block"
    | "form"
    | "pricing_plans"
    | "metrics"
    | "testimonial_cards"
    | "navigation_links"
    | "dashboard_widgets"
    | "unknown";
  confidence: number;
  detectedBlocks: Array<{
    type:
      | "heading"
      | "text"
      | "card"
      | "button"
      | "image"
      | "icon"
      | "input"
      | "stat"
      | "price"
      | "testimonial"
      | "nav_item"
      | "unknown";
    count: number;
    description: string;
  }>;
  detectedKeywords: string[];
  designIntent: DesignIntent;
  uiProblems: UIProblem[];
  recommendedCategories: {
    layoutCategories: UIBlockCategory[];
    templateCategories: UIBlockCategory[];
    animationCategories: Array<
      | "text"
      | "card"
      | "button"
      | "scroll"
      | "background"
      | "loader"
      | "transition"
      | "hover"
      | "cursor"
      | "image"
      | "list"
      | "navigation"
      | "other"
    >;
  };
  animationKeywords: string[];
  designerDescription: string;
  currentLayoutProblem: string;
  reasoning: string[];
};

export type StyleContext = {
  theme: "light" | "dark";
  section: {
    backgroundColor?: string;
    color?: string;
    fontFamily?: string;
    borderRadius?: string;
    padding?: string;
  };
  card: {
    backgroundColor?: string;
    color?: string;
    borderColor?: string;
    borderRadius?: string;
    boxShadow?: string;
    padding?: string;
  };
  text: {
    headingColor?: string;
    bodyColor?: string;
    mutedColor?: string;
    headingFontSize?: string;
    bodyFontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    lineHeight?: string;
  };
  accent: {
    color?: string;
    borderColor?: string;
    backgroundColor?: string;
  };
  button?: {
    backgroundColor?: string;
    color?: string;
    borderRadius?: string;
    padding?: string;
    borderColor?: string;
  };
};

export type PolishPilotMode = "simple" | "developer";
