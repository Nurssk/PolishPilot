import type { AIUnderstandingResult, DesignIntent, UIProblem } from "../shared/types";
import { animationReferences, type AnimationReference } from "./animationReferences";
import { keywordScore, normalizeKeywords } from "./keywordUtils";
import { layoutPatterns, type LayoutPattern, type LayoutPatternId } from "./layoutPatterns";
import { templateReferences, type TemplateReference } from "./templateReferences";

export type HumanizerSuggestions = {
  layoutPatterns: LayoutPattern[];
  templateReferences: TemplateReference[];
  animationReferences: AnimationReference[];
  debug: {
    inputKeywords: string[];
    sectionType?: string;
    layoutType?: string;
    scores: Array<{
      type: "layout" | "template" | "animation";
      id: string;
      score: number;
      matchedKeywords: string[];
    }>;
  };
};

type Scored<T> = {
  item: T;
  score: number;
  matchedKeywords: string[];
};
type AnimationSectionType = AnimationReference["relatedSectionTypes"][number];

const animationSectionTypes: AnimationSectionType[] = [
  "hero",
  "features",
  "cards",
  "pricing",
  "cta",
  "stats",
  "form",
  "dashboard",
  "testimonials",
  "unknown"
];

export function selectHumanizerSuggestions(args: {
  aiResult: AIUnderstandingResult;
  limit?: {
    layouts?: number;
    templates?: number;
    animations?: number;
  };
}): HumanizerSuggestions {
  const limits = {
    layouts: args.limit?.layouts ?? 4,
    templates: args.limit?.templates ?? 4,
    animations: args.limit?.animations ?? 3
  };
  const inputKeywords = buildInputKeywords(args.aiResult);
  const disallowHeroRecommendations = args.aiResult.sectionType === "unknown";

  const scoredLayouts = layoutPatterns
    .map((pattern) => scoreLayout(pattern, args.aiResult, inputKeywords))
    .filter((scored) => scored.score > 0)
    .filter((scored) => !disallowHeroRecommendations || scored.item.category !== "hero")
    .sort(sortScored);
  const selectedLayouts = ensureLayoutFallback(
    dedupeById(scoredLayouts).slice(0, limits.layouts),
    args.aiResult,
    inputKeywords,
    limits.layouts
  );
  const selectedLayoutIds = selectedLayouts.map((scored) => scored.item.id);

  const scoredTemplates = templateReferences
    .map((reference) => scoreTemplate(reference, args.aiResult, inputKeywords, selectedLayoutIds))
    .filter((scored) => scored.score > 0)
    .filter((scored) => !disallowHeroRecommendations || scored.item.category !== "hero")
    .sort(sortScored);
  const selectedTemplates = ensureTemplateFallback(
    selectSourceDiverse(dedupeById(scoredTemplates), limits.templates),
    args.aiResult,
    selectedLayoutIds,
    limits.templates
  );

  const scoredAnimations = animationReferences
    .map((reference) => scoreAnimation(reference, args.aiResult, inputKeywords))
    .filter((scored) => scored.score > 0)
    .filter(
      (scored) =>
        !disallowHeroRecommendations ||
        (!scored.item.relatedSectionTypes.includes("hero") &&
          !scored.item.relatedPatternIds.some((id) => id.includes("hero")))
    )
    .sort(sortScored);
  const selectedAnimations = ensureAnimationFallback(
    selectSourceDiverse(dedupeById(scoredAnimations), limits.animations),
    args.aiResult,
    selectedLayoutIds,
    limits.animations
  );

  return {
    layoutPatterns: selectedLayouts.map((scored) => scored.item),
    templateReferences: selectedTemplates.map((scored) => scored.item),
    animationReferences: selectedAnimations.map((scored) => scored.item),
    debug: {
      inputKeywords,
      sectionType: args.aiResult.sectionType,
      layoutType: args.aiResult.layoutType,
      scores: [
        ...selectedLayouts.map((scored) => debugScore("layout", scored.item.id, scored)),
        ...selectedTemplates.map((scored) => debugScore("template", scored.item.id, scored)),
        ...selectedAnimations.map((scored) => debugScore("animation", scored.item.id, scored))
      ]
    }
  };
}

function buildInputKeywords(aiResult: AIUnderstandingResult) {
  return normalizeKeywords([
    aiResult.sectionType,
    aiResult.layoutType,
    aiResult.contentType,
    aiResult.designIntent,
    ...aiResult.detectedKeywords,
    ...aiResult.uiProblems,
    ...aiResult.animationKeywords,
    ...aiResult.recommendedCategories.layoutCategories,
    ...aiResult.recommendedCategories.templateCategories,
    ...aiResult.recommendedCategories.animationCategories,
    ...aiResult.detectedBlocks.flatMap((block) => [block.type, block.description])
  ]);
}

function scoreLayout(
  pattern: LayoutPattern,
  aiResult: AIUnderstandingResult,
  inputKeywords: string[]
): Scored<LayoutPattern> {
  const targetKeywords = normalizeKeywords([
    pattern.id,
    pattern.name,
    pattern.category,
    ...pattern.keywords,
    ...pattern.inspirationTags,
    ...pattern.problemSolved
  ]);
  const matchedKeywords = matched(inputKeywords, targetKeywords);
  let score = matchedKeywords.length;

  if (categoryMatches(aiResult.sectionType, pattern.category)) score += 5;
  score += intersectionCount(aiResult.uiProblems, pattern.solvesProblems) * 3;
  score += intersectionCount([aiResult.designIntent], pattern.designIntents) * 2;
  if (aiResult.layoutType === "equal_grid" && pattern.solvesProblems.includes("cards_too_equal")) score += 4;
  if (aiResult.sectionType === "pricing" && pattern.category === "pricing") score += 5;
  if (aiResult.sectionType === "hero" && pattern.category === "hero") score += 5;
  if (aiResult.sectionType === "form" && pattern.category === "form") score += 5;

  return { item: pattern, score, matchedKeywords };
}

function scoreTemplate(
  reference: TemplateReference,
  aiResult: AIUnderstandingResult,
  inputKeywords: string[],
  selectedLayoutIds: string[]
): Scored<TemplateReference> {
  const targetKeywords = normalizeKeywords([
    reference.id,
    reference.title,
    reference.category,
    ...reference.tags,
    ...(reference.keywords ?? []),
    ...(reference.description ? [reference.description] : [])
  ]);
  const matchedKeywords = matched(inputKeywords, targetKeywords);
  let score = matchedKeywords.length;

  if (categoryMatches(aiResult.sectionType, reference.category)) score += 5;
  score += intersectionCount(reference.relatedPatternIds, selectedLayoutIds) * 2;
  if (aiResult.sectionType === "pricing" && reference.category === "pricing") score += 5;
  if (aiResult.sectionType === "hero" && reference.category === "hero") score += 5;
  if (aiResult.sectionType === "form" && (reference.category === "forms" || reference.category === "auth")) score += 5;
  if (isCopywritingReference(reference) && hasCopywritingSignal(inputKeywords)) score += 6;
  if (isRepoParsedReference(reference) && hasRepoParsedSignal(reference, inputKeywords)) score += 7;

  return { item: reference, score, matchedKeywords };
}

function scoreAnimation(
  reference: AnimationReference,
  aiResult: AIUnderstandingResult,
  inputKeywords: string[]
): Scored<AnimationReference> {
  const targetKeywords = normalizeKeywords([
    reference.id,
    reference.title,
    reference.category,
    ...reference.tags,
    ...(reference.keywords ?? []),
    ...(reference.description ? [reference.description] : []),
    ...reference.relatedSectionTypes,
    ...reference.relatedPatternIds
  ]);
  const matchedKeywords = matched(inputKeywords, targetKeywords);
  let score = matchedKeywords.length;

  if (aiResult.recommendedCategories.animationCategories.includes(reference.category)) score += 4;
  score += intersectionCount(aiResult.uiProblems, reference.solvesProblems ?? []) * 3;
  if (aiResult.uiProblems.includes("missing_microinteraction")) score += 2;
  if (aiResult.sectionType === "hero" && reference.relatedSectionTypes.includes("hero")) score += 5;
  if (aiResult.sectionType === "pricing" && reference.relatedSectionTypes.includes("pricing")) score += 5;
  if (aiResult.sectionType === "form" && reference.relatedSectionTypes.includes("form")) score += 5;

  return { item: reference, score, matchedKeywords };
}

function ensureLayoutFallback(
  selected: Scored<LayoutPattern>[],
  aiResult: AIUnderstandingResult,
  inputKeywords: string[],
  limit: number
): Scored<LayoutPattern>[] {
  if (selected.length >= Math.min(2, limit)) return selected;

  const existing = new Set(selected.map((scored) => scored.item.id));
  const fallbackIds = getFallbackLayoutIds(aiResult, inputKeywords).filter(
    (id) => !existing.has(id)
  );
  const fallbackItems = fallbackIds
    .map((id, index) => {
      const pattern = layoutPatterns.find((item) => item.id === id);
      if (!pattern) return null;

      return fallbackScore(pattern, index);
    })
    .filter(Boolean) as Scored<LayoutPattern>[];

  return [...selected, ...fallbackItems].slice(0, limit);
}

function ensureTemplateFallback(
  selected: Scored<TemplateReference>[],
  aiResult: AIUnderstandingResult,
  selectedLayoutIds: LayoutPatternId[],
  limit: number
): Scored<TemplateReference>[] {
  if (selected.length >= Math.min(2, limit)) return selected;

  const existing = new Set(selected.map((scored) => scored.item.id));
  const sectionCategory = templateCategoryForSection(aiResult.sectionType);
  const selectedLayoutSet = new Set<string>(selectedLayoutIds);
  const fallbackItems = templateReferences
    .filter((reference) => !existing.has(reference.id))
    .filter((reference) => aiResult.sectionType !== "unknown" || reference.category !== "hero")
    .filter(
      (reference) =>
        reference.relatedPatternIds.some((id) => selectedLayoutSet.has(id)) ||
        reference.category === sectionCategory ||
        (aiResult.sectionType === "unknown" && reference.category === "features")
    )
    .slice(0, Math.max(0, limit - selected.length))
    .map((reference, index) => fallbackScore(reference, index));

  return [...selected, ...fallbackItems].slice(0, limit);
}

function ensureAnimationFallback(
  selected: Scored<AnimationReference>[],
  aiResult: AIUnderstandingResult,
  selectedLayoutIds: LayoutPatternId[],
  limit: number
): Scored<AnimationReference>[] {
  if (selected.length >= Math.min(1, limit)) return selected;

  const selectedLayoutSet = new Set<string>(selectedLayoutIds);
  const sectionType = toAnimationSectionType(aiResult.sectionType);
  const fallbackItems = animationReferences
    .filter(
      (reference) =>
        aiResult.sectionType !== "unknown" ||
        (!reference.relatedSectionTypes.includes("hero") &&
          !reference.relatedPatternIds.some((id) => id.includes("hero")))
    )
    .filter(
      (reference) =>
        reference.relatedSectionTypes.includes(sectionType) ||
        reference.relatedSectionTypes.includes("unknown") ||
        reference.relatedPatternIds.some((id) => selectedLayoutSet.has(id))
    )
    .slice(0, Math.max(0, limit - selected.length))
    .map((reference, index) => fallbackScore(reference, index));

  return [...selected, ...fallbackItems].slice(0, limit);
}

function toAnimationSectionType(sectionType: AIUnderstandingResult["sectionType"]): AnimationSectionType {
  return animationSectionTypes.includes(sectionType as AnimationSectionType)
    ? (sectionType as AnimationSectionType)
    : "unknown";
}

function fallbackScore<T extends { id: string }>(item: T, index: number): Scored<T> {
  return {
    item,
    score: 0.9 - index / 100,
    matchedKeywords: ["fallback"]
  };
}

function getFallbackLayoutIds(
  aiResult: AIUnderstandingResult,
  inputKeywords: string[]
): LayoutPatternId[] {
  const sectionType = aiResult.sectionType;
  const problems = new Set<UIProblem>(aiResult.uiProblems);
  const keywords = new Set(inputKeywords);
  const hasAnyKeyword = (values: string[]) => values.some((value) => keywords.has(value));

  if (sectionType === "hero") {
    if (hasAnyKeyword(["dashboard", "analytics", "workspace", "product-ui", "screen", "screenshot"])) {
      return ["hero-dashboard-preview", "hero-product-preview", "split-hero", "hero-trust-bar"];
    }
    if (hasAnyKeyword(["email", "waitlist", "newsletter", "invite", "magic-link", "early-access"])) {
      return ["hero-email-capture", "centered-hero", "split-auth-proof", "hero-trust-bar"];
    }
    if (hasAnyKeyword(["logo", "logos", "trusted", "customers", "integrations", "companies"])) {
      return ["hero-logo-cloud", "hero-trust-bar", "hero-social-proof-strip", "split-hero"];
    }
    if (hasAnyKeyword(["video", "demo-video", "play", "watch", "walkthrough"])) {
      return ["hero-video-demo", "demo-steps-hero", "hero-product-preview", "split-hero"];
    }
    if (hasAnyKeyword(["tab", "tabs", "mode", "modes", "segment", "segmented"])) {
      return ["hero-tabs-preview", "feature-tabs", "hero-product-preview", "split-hero"];
    }
    if (hasAnyKeyword(["background", "image-background", "photo", "venue", "event"])) {
      return ["hero-image-background", "hero-contained-card", "centered-hero", "split-hero"];
    }
    if (hasAnyKeyword(["contained", "card", "panel", "module"])) {
      return ["hero-contained-card", "split-hero", "hero-product-preview", "centered-hero"];
    }
    if (hasAnyKeyword(["off-grid", "abstract", "clouds", "isometric", "asymmetric"])) {
      return ["hero-off-grid-visual", "hero-product-preview", "split-hero", "before-after-hero"];
    }
    if (hasAnyKeyword(["before", "after", "compare", "comparison"])) {
      return ["before-after-hero", "hero-product-preview", "split-hero", "hero-trust-bar"];
    }
    if (hasAnyKeyword(["step", "steps", "workflow", "process", "demo"])) {
      return ["demo-steps-hero", "hero-product-preview", "split-hero", "centered-hero"];
    }
    return ["hero-product-preview", "split-hero", "centered-hero", "hero-trust-bar"];
  }
  if (sectionType === "pricing") {
    if (hasAnyKeyword(["toggle", "annual", "monthly", "billing"])) {
      return ["pricing-toggle", "pricing-emphasis", "plan-comparison-table", "two-tier-pricing-split"];
    }
    return ["pricing-emphasis", "plan-comparison-table", "two-tier-pricing-split", "pricing-faq-combo"];
  }
  if (sectionType === "form") {
    if (hasAnyKeyword(["login", "signin", "sign-in", "signup", "auth", "email", "verification"])) {
      return ["magic-link-panel", "split-auth-proof", "onboarding-checklist-form", "form-benefits-sidebar"];
    }
    return ["form-benefits-sidebar", "two-step-form-layout", "compact-lead-form", "form-faq-sidebar"];
  }
  if (sectionType === "stats") {
    return ["analytics-overview", "metric-trend-grid", "stats-story-band", "metric-bento"];
  }
  if (sectionType === "cta") {
    if (hasAnyKeyword(["demo", "preview", "product"])) {
      return ["demo-panel-cta", "split-cta", "banner-cta", "cta-trust-notes"];
    }
    return ["split-cta", "banner-cta", "card-cta", "cta-trust-notes"];
  }
  if (sectionType === "dashboard" || sectionType === "settings") {
    if (hasAnyKeyword(["table", "row", "rows", "list"])) {
      return ["table-summary-rail", "activity-feed-sidebar", "analytics-overview", "settings-detail-pane"];
    }
    if (hasAnyKeyword(["kanban", "task", "tasks", "status", "pipeline"])) {
      return ["kanban-board", "activity-feed-sidebar", "analytics-overview", "sidebar-app-shell"];
    }
    if (hasAnyKeyword(["settings", "profile", "account", "workspace"])) {
      return ["settings-detail-pane", "profile-settings-form", "sidebar-app-shell", "table-summary-rail"];
    }
    return ["analytics-overview", "metric-trend-grid", "activity-feed-sidebar", "table-summary-rail"];
  }
  if (sectionType === "auth") {
    return ["split-auth-proof", "magic-link-panel", "onboarding-checklist-form", "profile-settings-form"];
  }
  if (sectionType === "navigation") {
    return ["sidebar-app-shell", "command-center-nav", "mega-menu-topbar", "footer-link-hub"];
  }
  if (sectionType === "footer") {
    return ["footer-link-hub", "mega-menu-topbar", "command-center-nav", "resource-card-grid"];
  }
  if (sectionType === "unknown") {
    if (hasAnyKeyword(["checkout", "cart", "order", "payment", "buy", "purchase"])) {
      return ["checkout-summary-split", "product-detail-split", "product-card-grid", "comparison-spec-table"];
    }
    if (hasAnyKeyword(["product", "catalog", "marketplace", "shop", "ecommerce"])) {
      return ["product-card-grid", "product-detail-split", "comparison-spec-table", "resource-card-grid"];
    }
    if (hasAnyKeyword(["faq", "question", "questions", "answer", "answers"])) {
      return ["faq-sidebar", "resource-card-grid", "form-faq-sidebar", "comparison-matrix"];
    }
    if (hasAnyKeyword(["compare", "comparison", "versus", "vs", "spec", "matrix"])) {
      return ["comparison-matrix", "comparison-spec-table", "feature-comparison-blocks", "plan-comparison-table"];
    }
    if (hasAnyKeyword(["article", "blog", "docs", "guide", "resource", "resources", "changelog", "release"])) {
      return ["resource-card-grid", "editorial-feature-stack", "changelog-timeline", "faq-sidebar"];
    }
    if (hasAnyKeyword(["quote", "testimonial", "review", "customer", "case-study", "case"])) {
      return ["quote-wall", "case-study-split", "testimonial-wall", "resource-card-grid"];
    }
    return ["bento-grid", "analytics-overview", "resource-card-grid", "featured-side-stack"];
  }

  if (hasAnyKeyword(["checkout", "cart", "order", "payment", "buy", "purchase"])) {
    return ["checkout-summary-split", "product-detail-split", "product-card-grid", "comparison-spec-table"];
  }
  if (hasAnyKeyword(["product", "catalog", "marketplace", "shop", "ecommerce"])) {
    return ["product-card-grid", "product-detail-split", "comparison-spec-table", "demo-panel-cta"];
  }
  if (hasAnyKeyword(["faq", "question", "questions", "answer", "answers"])) {
    return ["faq-sidebar", "pricing-faq-combo", "form-faq-sidebar", "resource-card-grid"];
  }
  if (hasAnyKeyword(["compare", "comparison", "versus", "vs", "spec", "matrix"])) {
    return ["comparison-matrix", "comparison-spec-table", "feature-comparison-blocks", "plan-comparison-table"];
  }
  if (hasAnyKeyword(["article", "blog", "docs", "guide", "resource", "resources", "changelog", "release"])) {
    if (hasAnyKeyword(["changelog", "release", "timeline"])) {
      return ["changelog-timeline", "resource-card-grid", "editorial-feature-stack", "faq-sidebar"];
    }
    return ["resource-card-grid", "editorial-feature-stack", "changelog-timeline", "faq-sidebar"];
  }
  if (hasAnyKeyword(["quote", "testimonial", "review", "customer", "case-study", "case"])) {
    return ["quote-wall", "case-study-split", "featured-testimonial", "testimonial-wall"];
  }

  if (
    sectionType === "features" ||
    sectionType === "cards" ||
    problems.has("cards_too_equal") ||
    problems.has("too_repetitive") ||
    problems.has("weak_hierarchy") ||
    problems.has("flat_layout") ||
    aiResult.layoutType === "equal_grid"
  ) {
    if (hasAnyKeyword(["tab", "tabs", "mode", "modes"])) {
      return ["feature-tabs", "bento-grid", "featured-side-stack", "center-highlight"];
    }
    if (hasAnyKeyword(["integration", "integrations", "logo", "logos", "tools"])) {
      return ["integration-logo-grid", "bento-grid", "featured-side-stack", "center-highlight"];
    }
    return ["bento-grid", "featured-side-stack", "center-highlight", "problem-solution-cards"];
  }

  return ["bento-grid", "analytics-overview", "resource-card-grid", "featured-side-stack"];
}

function templateCategoryForSection(sectionType: string): TemplateReference["category"] {
  if (sectionType === "form") return "forms";
  if (
    sectionType === "hero" ||
    sectionType === "features" ||
    sectionType === "pricing" ||
    sectionType === "cta" ||
    sectionType === "cards" ||
    sectionType === "dashboard"
  ) {
    return sectionType;
  }

  return "features";
}

function categoryMatches(sectionType: string, category: string) {
  if (sectionType === category) return true;
  if (sectionType === "form" && category === "forms") return true;
  if (sectionType === "cards" && category === "features") return true;
  return false;
}

function isCopywritingReference(reference: TemplateReference): boolean {
  return normalizeKeywords([
    ...reference.tags,
    ...(reference.keywords ?? []),
    reference.description ?? ""
  ]).includes("copywriting");
}

function hasCopywritingSignal(inputKeywords: string[]): boolean {
  const keywords = new Set(inputKeywords);
  return [
    "copywriting",
    "fake-premium-copy",
    "formulaic-ai-copy",
    "ai-slop-phrase-tells",
    "ai-punctuation-tells",
    "generic-copy"
  ].some((keyword) => keywords.has(keyword));
}

function isRepoParsedReference(reference: TemplateReference): boolean {
  return [
    "hallmark",
    "stop-slop",
    "anti-ai-slop-pack",
    "interface-design",
    "nng-ux-guidelines",
    "baymard-ux",
    "wai-aria-apg",
    "wcag-wai",
    "govuk-design-system",
    "material-design",
    "carbon-design-system",
    "apple-hig",
    "carbon-data-viz",
    "uswds",
    "carbon-table",
    "ons-design-system",
    "carbon-navigation",
    "material-navigation"
  ].includes(reference.source);
}

function hasRepoParsedSignal(
  reference: TemplateReference,
  inputKeywords: string[]
): boolean {
  const keywords = new Set(inputKeywords);
  const sourceSignals: Record<string, string[]> = {
    hallmark: [
      "hallmark",
      "icon-tile-feature-cards",
      "default-font-stack-template",
      "decorative-status-dots",
      "redrawn-ui-chrome",
      "centered-stack-default",
      "unbounded-sluggish-motion"
    ],
    "stop-slop": [
      "stop-slop",
      "copywriting",
      "formulaic-ai-copy",
      "ai-slop-phrase-tells",
      "ai-punctuation-tells"
    ],
    "anti-ai-slop-pack": [
      "anti-ai-slop-pack",
      "generic-saas-composition",
      "fake-charts",
      "decorative-status-dots",
      "default-font-stack-template",
      "placeholder-proof-copy"
    ],
    "interface-design": [
      "interface-design",
      "design-system",
      "inconsistent-spacing",
      "oversized-radius",
      "dramatic-shadows",
      "settings",
      "dashboard"
    ],
    "nng-ux-guidelines": [
      "nng-ux-guidelines",
      "layout-guideline",
      "visual-hierarchy",
      "weak-hierarchy",
      "text-scanning",
      "text-heavy",
      "f-pattern",
      "layer-cake",
      "form-layout",
      "single-column",
      "field-grouping"
    ],
    "baymard-ux": [
      "baymard-ux",
      "layout-guideline",
      "ecommerce",
      "checkout",
      "cart",
      "payment",
      "product-list",
      "product-detail",
      "filters",
      "sorting",
      "marketplace"
    ],
    "wai-aria-apg": [
      "wai-aria-apg",
      "interaction-guideline",
      "aria",
      "keyboard-navigation",
      "table",
      "grid",
      "interactive-table",
      "interactive-grid",
      "tabs",
      "tablist",
      "tabpanel",
      "dialog",
      "modal",
      "focus-trap",
      "disclosure",
      "accordion",
      "aria-expanded",
      "menubar",
      "menu-button",
      "menuitem",
      "aria-haspopup",
      "command-menu"
    ],
    "wcag-wai": [
      "wcag-wai",
      "interaction-guideline",
      "wcag",
      "target-size",
      "touch-target",
      "24px",
      "focus-visible",
      "keyboard-focus",
      "focus-ring",
      "accessibility"
    ],
    "govuk-design-system": [
      "govuk-design-system",
      "interaction-guideline",
      "validation",
      "error-summary",
      "error-message",
      "form-errors",
      "field-errors",
      "recover",
      "plain-language",
      "table-guideline",
      "semantic-table",
      "not-layout",
      "navigation-guideline",
      "breadcrumb",
      "breadcrumbs",
      "masthead",
      "service-header",
      "service-identity"
    ],
    "material-design": [
      "material-design",
      "visual-guideline",
      "table-guideline",
      "color-roles",
      "semantic-color",
      "type-scale",
      "typography",
      "data-table",
      "filter-chips",
      "pagination",
      "default-sort",
      "data-visualization",
      "chart-accessibility",
      "glanceable",
      "shape-scale",
      "corner-radius",
      "oversized-radius",
      "weak-hierarchy"
    ],
    "carbon-design-system": [
      "carbon-design-system",
      "visual-guideline",
      "color-tokens",
      "tokenized-color",
      "spacing-scale",
      "2x-grid",
      "productive-type",
      "expressive-type",
      "design-system",
      "inconsistent-spacing"
    ],
    "apple-hig": [
      "apple-hig",
      "visual-guideline",
      "semantic-color",
      "adaptive-color",
      "dark-mode",
      "contrast",
      "data-visualization",
      "charting-data",
      "effective-chart",
      "typography",
      "legibility",
      "dynamic-type",
      "accessibility"
    ],
    "carbon-data-viz": [
      "carbon-data-viz",
      "data-viz-guideline",
      "data-visualization",
      "chart-type",
      "chart-purpose",
      "chart-anatomy",
      "axis",
      "legend",
      "tooltip",
      "accessible-chart",
      "fake-charts"
    ],
    uswds: [
      "uswds",
      "data-viz-guideline",
      "data-visualization",
      "accessibility",
      "usability",
      "assistive-tooling",
      "charts",
      "relationships",
      "data-set"
    ],
    "carbon-table": [
      "carbon-table",
      "table-guideline",
      "data-table",
      "sorting",
      "filtering",
      "pagination",
      "row-selection",
      "batch-actions",
      "row-expansion",
      "sort-indicator",
      "dashboard-table",
      "list-management"
    ],
    "ons-design-system": [
      "ons-design-system",
      "table-guideline",
      "empty-state",
      "empty-table",
      "no-results",
      "search-results",
      "no-data",
      "filter-empty",
      "list-management"
    ],
    "carbon-navigation": [
      "carbon-navigation",
      "navigation-guideline",
      "ui-shell",
      "shell-header",
      "global-header",
      "persistent-navigation",
      "side-nav",
      "sidebar",
      "secondary-navigation",
      "active-state",
      "app-shell"
    ],
    "material-navigation": [
      "material-navigation",
      "navigation-guideline",
      "navigation-rail",
      "navigation-drawer",
      "responsive-navigation",
      "primary-destinations",
      "3-7-destinations",
      "medium-window",
      "expanded-window",
      "app-destinations"
    ]
  };

  return (sourceSignals[reference.source] ?? []).some((signal) => keywords.has(signal));
}

function matched(inputKeywords: string[], targetKeywords: string[]) {
  const normalizedInput = normalizeKeywords(inputKeywords);
  const normalizedTarget = normalizeKeywords(targetKeywords);
  const targetSet = new Set(normalizedTarget);

  return normalizedInput.filter((keyword) => targetSet.has(keyword));
}

function intersectionCount(source: string[], target: string[]) {
  return keywordScore(source, target);
}

function sortScored<T>(a: Scored<T>, b: Scored<T>) {
  return b.score - a.score;
}

function dedupeById<T extends { id: string }>(items: Scored<T>[]) {
  const seen = new Set<string>();

  return items.filter((scored) => {
    if (seen.has(scored.item.id)) return false;
    seen.add(scored.item.id);
    return true;
  });
}

function selectSourceDiverse<T extends { id: string; source?: string }>(
  items: Scored<T>[],
  limit: number
) {
  if (items.length <= limit || limit <= 1) {
    return items.slice(0, limit);
  }

  const selected: Scored<T>[] = [];
  const first = items[0];
  selected.push(first);

  const selectedSources = new Set<string>();
  if (first.item.source) selectedSources.add(first.item.source);
  const sourceDiversitySlots = Math.min(limit, 4);

  for (const item of items) {
    if (selected.length >= sourceDiversitySlots) break;
    const source = item.item.source;
    if (!source || selectedSources.has(source)) continue;
    if (item.score < first.score - 2) continue;
    selected.push(item);
    selectedSources.add(source);
  }

  for (const item of items) {
    if (selected.length >= limit) break;
    if (selected.some((selectedItem) => selectedItem.item.id === item.item.id)) continue;
    selected.push(item);
  }

  return selected.slice(0, limit);
}

function debugScore(
  type: "layout" | "template" | "animation",
  id: string,
  scored: Scored<unknown>
) {
  return {
    type,
    id,
    score: scored.score,
    matchedKeywords: scored.matchedKeywords
  };
}
