import type { ElementCounts, MatchedElement, SourceSectionPart } from "../shared/types";

export type ObjectInventoryItem = {
  label: string;
  tagName: string;
  role: string | null;
  className: string | null;
  width: number;
  height: number;
  top: number;
  left: number;
};

export type ObjectInventory = {
  summary: {
    totalElements: number;
    headings: number;
    actions: number;
    cards: number;
    inputs: number;
    media: number;
    metrics: number;
    priceTokens: number;
    testimonials: number;
    navItems: number;
    longTextBlocks: number;
  };
  primaryHeading?: string;
  headings: string[];
  actions: ObjectInventoryItem[];
  cards: ObjectInventoryItem[];
  inputs: ObjectInventoryItem[];
  media: ObjectInventoryItem[];
  metrics: string[];
  priceTokens: string[];
  testimonials: string[];
  navItems: string[];
  longTextBlocks: string[];
  repeatedGroups: Array<{
    type: "card" | "action" | "metric" | "unknown";
    count: number;
    averageWidth: number;
    averageHeight: number;
    similarSize: boolean;
  }>;
  styleSignals: {
    largeRadiusCount: number;
    pillCount: number;
    shadowCount: number;
    glowCount: number;
    filledSurfaceCount: number;
  };
  layoutSignals: {
    boundsWidth: number;
    boundsHeight: number;
    density: "sparse" | "balanced" | "dense";
    columnsEstimate: number;
    rowsEstimate: number;
  };
  keywords: string[];
};

export function buildObjectInventory(
  elements: MatchedElement[],
  counts?: ElementCounts
): ObjectInventory {
  const safeElements = Array.isArray(elements) ? elements : [];
  const headings = safeElements.filter(isHeadingLike);
  const actions = safeElements.filter(isActionLike);
  const cards = safeElements.filter(isCardLike);
  const inputs = safeElements.filter(isInputLike);
  const media = safeElements.filter(isMediaLike);
  const metrics = extractUniqueText(safeElements.filter(hasMetricText), 12);
  const priceTokens = extractPriceTokens(safeElements);
  const testimonials = extractUniqueText(safeElements.filter(hasTestimonialText), 8);
  const navItems = extractUniqueText(safeElements.filter(isNavItemLike), 12);
  const longTextBlocks = extractUniqueText(
    safeElements.filter((element) => wordCount(element.text) >= 34),
    8,
    180
  );
  const repeatedGroups = buildRepeatedGroups({ cards, actions, metricsCount: metrics.length });
  const styleSignals = buildStyleSignals(safeElements);
  const layoutSignals = buildLayoutSignals(safeElements);
  const keywords = extractKeywords(safeElements);

  return {
    summary: {
      totalElements: counts?.totalElements ?? safeElements.length,
      headings: headings.length || counts?.headings || 0,
      actions: actions.length || counts?.buttons || 0,
      cards: cards.length || counts?.cardsEstimate || 0,
      inputs: inputs.length || counts?.inputs || 0,
      media: media.length || (counts ? counts.images + counts.svgs : 0),
      metrics: metrics.length,
      priceTokens: priceTokens.length,
      testimonials: testimonials.length,
      navItems: navItems.length,
      longTextBlocks: longTextBlocks.length
    },
    primaryHeading: headings.sort(byVisualWeight)[0]?.text.trim(),
    headings: extractUniqueText(headings.sort(byVisualWeight), 10, 140),
    actions: actions.sort(byVisualWeight).slice(0, 12).map(toInventoryItem),
    cards: cards.sort(byVisualWeight).slice(0, 16).map(toInventoryItem),
    inputs: inputs.slice(0, 12).map(toInventoryItem),
    media: media.sort(byVisualWeight).slice(0, 12).map(toInventoryItem),
    metrics,
    priceTokens,
    testimonials,
    navItems,
    longTextBlocks,
    repeatedGroups,
    styleSignals,
    layoutSignals,
    keywords
  };
}

export function buildCaptureObjectInventory(input: {
  matchedElements: MatchedElement[];
  counts?: ElementCounts;
  selectedSourceSection?: SourceSectionPart | null;
  sourceSections?: SourceSectionPart[];
}): ObjectInventory {
  const base = buildObjectInventory(input.matchedElements, input.counts);
  const sourceParts = selectSourcePartsForInventory(
    input.selectedSourceSection,
    input.sourceSections
  );

  if (!sourceParts.length) {
    return base;
  }

  const sourceCounts = mergeSourceCounts(sourceParts, input.counts);
  const sourceText = sourceParts
    .flatMap((part) => [
      part.textSummary,
      ...part.headingSnippets,
      ...part.ctaSnippets,
      ...part.mediaSnippets,
      part.className ?? "",
      part.id ?? "",
      part.role ?? "",
      part.ariaLabel ?? ""
    ])
    .join(" ");
  const sourceHeadings = uniqueStrings(sourceParts.flatMap((part) => part.headingSnippets), 12);
  const sourceActions = sourceParts.flatMap((part) =>
    part.ctaSnippets.slice(0, 8).map((snippet) => sourceInventoryItem(part, snippet, "button"))
  );
  const sourceMedia = sourceParts.flatMap((part) =>
    part.mediaSnippets.slice(0, 8).map((snippet) => sourceInventoryItem(part, snippet, "media"))
  );
  const sourceMetrics = extractMetricStrings(sourceText, 12);
  const sourcePriceTokens = extractPriceTokensFromText(sourceText, 16);
  const sourceTestimonials = /testimonial|review|rating|stars?|customer|founder|ceo|loved|trusted|quote/i.test(sourceText)
    ? uniqueStrings(sourceParts.map((part) => part.textSummary), 8, 160)
    : [];
  const sourceNavItems = sourceParts.some((part) => part.tagName === "nav" || /\b(nav|menu|navbar|navigation)\b/i.test(`${part.className ?? ""} ${part.id ?? ""} ${part.role ?? ""}`))
    ? uniqueStrings(sourceParts.flatMap((part) => [part.textSummary, ...part.ctaSnippets]), 16, 64)
    : [];
  const sourceKeywords = extractKeywordsFromText(sourceText);
  const sourceCardItems = buildSourceCardItems(sourceParts, sourceCounts.cardsEstimate);
  const repeatedGroups = [...base.repeatedGroups];

  if (
    sourceCounts.cardsEstimate >= 3 &&
    !repeatedGroups.some((group) => group.type === "card")
  ) {
    repeatedGroups.push({
      type: "card",
      count: sourceCounts.cardsEstimate,
      averageWidth: Math.round(sourceParts[0]?.rect.width ?? 0),
      averageHeight: Math.round((sourceParts[0]?.rect.height ?? 0) / Math.max(sourceCounts.cardsEstimate, 1)),
      similarSize: true
    });
  }

  return {
    ...base,
    summary: {
      totalElements: Math.max(base.summary.totalElements, sourceCounts.totalElements),
      headings: Math.max(base.summary.headings, sourceCounts.headings, sourceHeadings.length),
      actions: Math.max(base.summary.actions, sourceCounts.buttons, sourceActions.length),
      cards: Math.max(base.summary.cards, sourceCounts.cardsEstimate),
      inputs: Math.max(base.summary.inputs, sourceCounts.inputs),
      media: Math.max(base.summary.media, sourceCounts.images + sourceCounts.svgs, sourceMedia.length),
      metrics: Math.max(base.summary.metrics, sourceMetrics.length),
      priceTokens: Math.max(base.summary.priceTokens, sourcePriceTokens.length),
      testimonials: Math.max(base.summary.testimonials, sourceTestimonials.length),
      navItems: Math.max(base.summary.navItems, sourceNavItems.length),
      longTextBlocks: Math.max(
        base.summary.longTextBlocks,
        sourceParts.filter((part) => wordCount(part.textSummary) >= 34).length
      )
    },
    primaryHeading: base.primaryHeading ?? sourceHeadings[0],
    headings: uniqueStrings([...base.headings, ...sourceHeadings], 12),
    actions: dedupeInventoryItems([...base.actions, ...sourceActions], 14),
    cards: dedupeInventoryItems([...base.cards, ...sourceCardItems], 18),
    inputs: base.inputs,
    media: dedupeInventoryItems([...base.media, ...sourceMedia], 14),
    metrics: uniqueStrings([...base.metrics, ...sourceMetrics], 14),
    priceTokens: uniqueStrings([...base.priceTokens, ...sourcePriceTokens], 18),
    testimonials: uniqueStrings([...base.testimonials, ...sourceTestimonials], 10, 160),
    navItems: uniqueStrings([...base.navItems, ...sourceNavItems], 16, 64),
    longTextBlocks: uniqueStrings(
      [
        ...base.longTextBlocks,
        ...sourceParts
          .filter((part) => wordCount(part.textSummary) >= 34)
          .map((part) => part.textSummary)
      ],
      10,
      180
    ),
    repeatedGroups,
    keywords: uniqueStrings([...base.keywords, ...sourceKeywords], 20)
  };
}

function selectSourcePartsForInventory(
  selectedSourceSection: SourceSectionPart | null | undefined,
  sourceSections: SourceSectionPart[] | undefined
) {
  if (selectedSourceSection) {
    return [selectedSourceSection];
  }

  return (sourceSections ?? []).slice(0, 3);
}

function mergeSourceCounts(sourceParts: SourceSectionPart[], fallback?: ElementCounts): ElementCounts {
  const initial: ElementCounts = fallback ?? {
    totalElements: 0,
    headings: 0,
    buttons: 0,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 0,
    textLength: 0
  };

  return sourceParts.reduce<ElementCounts>(
    (merged, part) => ({
      totalElements: Math.max(merged.totalElements, part.counts.totalElements),
      headings: Math.max(merged.headings, part.counts.headings),
      buttons: Math.max(merged.buttons, part.counts.buttons),
      links: Math.max(merged.links, part.counts.links),
      images: Math.max(merged.images, part.counts.images),
      svgs: Math.max(merged.svgs, part.counts.svgs),
      inputs: Math.max(merged.inputs, part.counts.inputs),
      cardsEstimate: Math.max(merged.cardsEstimate, part.counts.cardsEstimate),
      textLength: Math.max(merged.textLength, part.counts.textLength)
    }),
    initial
  );
}

function sourceInventoryItem(
  part: SourceSectionPart,
  label: string,
  tagName: string
): ObjectInventoryItem {
  return {
    label: truncate(normalizeText(label), 120) || tagName,
    tagName,
    role: tagName === "button" ? "button" : part.role,
    className: part.className,
    width: Math.round(part.rect.width),
    height: Math.round(part.rect.height),
    top: Math.round(part.rect.top),
    left: Math.round(part.rect.left)
  };
}

function buildSourceCardItems(
  sourceParts: SourceSectionPart[],
  cardCount: number
): ObjectInventoryItem[] {
  if (cardCount <= 0) return [];
  const part = sourceParts[0];
  if (!part) return [];
  const labels = uniqueStrings(
    [
      ...part.headingSnippets,
      ...part.textSummary
        .split(/(?<=[.!?])\s+|\s{2,}/)
        .map((item) => item.trim())
        .filter(Boolean)
    ],
    Math.min(cardCount, 8),
    120
  );

  return Array.from({ length: Math.min(cardCount, 8) }, (_, index) => ({
    label: labels[index] ?? `Card ${index + 1}`,
    tagName: "card",
    role: null,
    className: part.className,
    width: Math.round(part.rect.width / Math.min(cardCount, 3)),
    height: Math.round(part.rect.height / Math.ceil(cardCount / 3)),
    top: Math.round(part.rect.top),
    left: Math.round(part.rect.left)
  }));
}

function dedupeInventoryItems(items: ObjectInventoryItem[], limit: number) {
  const seen = new Set<string>();
  const output: ObjectInventoryItem[] = [];

  for (const item of items) {
    const key = `${item.tagName}:${item.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(item);
    if (output.length >= limit) break;
  }

  return output;
}

function uniqueStrings(values: string[], limit: number, maxLength = 120) {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const normalized = truncate(normalizeText(value), maxLength);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    output.push(normalized);
    if (output.length >= limit) break;
  }

  return output;
}

function extractMetricStrings(text: string, limit: number) {
  const matches = text.match(/\b\d+(?:[.,]\d+)?(?:[%+$]|k|m|b|x| hrs?| min| sec| users?| teams?| credits?)\b/gi) ?? [];
  return uniqueStrings(matches, limit, 80);
}

function extractPriceTokensFromText(text: string, limit: number) {
  const matches = text.match(/\$\s?\d+(?:[.,]\d+)?|\b\d+\s?(?:credits?|seats?|users?)\b|\b(?:free|pro|starter|enterprise|month|year|monthly|yearly|billing|plan)\b/gi) ?? [];
  return uniqueStrings(matches, limit, 80);
}

function extractKeywordsFromText(text: string) {
  const keywords = [
    "pricing",
    "credits",
    "plan",
    "billing",
    "feature",
    "workflow",
    "testimonial",
    "review",
    "dashboard",
    "metric",
    "analytics",
    "form",
    "email",
    "password",
    "waitlist",
    "contact",
    "settings",
    "footer",
    "navigation",
    "cta",
    "steps",
    "process"
  ];

  return keywords.filter((keyword) => new RegExp(`\\b${keyword}\\b`, "i").test(text));
}

function toInventoryItem(element: MatchedElement): ObjectInventoryItem {
  return {
    label: labelForElement(element),
    tagName: element.tagName,
    role: element.role,
    className: element.className,
    width: Math.round(element.rect.width),
    height: Math.round(element.rect.height),
    top: Math.round(element.rect.top),
    left: Math.round(element.rect.left)
  };
}

function labelForElement(element: MatchedElement): string {
  const text = normalizeText(element.text);
  if (text) return truncate(text, 120);
  if (element.ariaLabel) return truncate(element.ariaLabel, 120);
  if (element.id) return `#${element.id}`;
  if (element.className) return `.${element.className.split(/\s+/).filter(Boolean).slice(0, 2).join(".")}`;
  return element.tagName;
}

function isHeadingLike(element: MatchedElement): boolean {
  const tag = element.tagName.toLowerCase();
  if (/^h[1-6]$/.test(tag) || element.role === "heading") return true;
  const size = parsePx(element.style.fontSize);
  const weight = parseFontWeight(element.style.fontWeight);
  return normalizeText(element.text).length > 0 && size >= 22 && weight >= 600;
}

function isActionLike(element: MatchedElement): boolean {
  const tag = element.tagName.toLowerCase();
  const text = normalizeText(element.text);
  const identity = `${element.id ?? ""} ${element.className ?? ""} ${element.role ?? ""} ${element.ariaLabel ?? ""}`.toLowerCase();
  const buttonShape =
    element.rect.width >= 44 &&
    element.rect.width <= 320 &&
    element.rect.height >= 26 &&
    element.rect.height <= 84;

  return (
    tag === "button" ||
    element.role === "button" ||
    (tag === "a" && text.length > 0 && text.length <= 72) ||
    (buttonShape && /\b(btn|button|cta|action|submit|start|get|try|buy|book|join|sign|contact|demo|download)\b/i.test(`${identity} ${text}`))
  );
}

function isInputLike(element: MatchedElement): boolean {
  return ["input", "textarea", "select"].includes(element.tagName.toLowerCase());
}

function isMediaLike(element: MatchedElement): boolean {
  const tag = element.tagName.toLowerCase();
  const identity = `${element.id ?? ""} ${element.className ?? ""} ${element.ariaLabel ?? ""}`.toLowerCase();
  return (
    ["img", "svg", "picture", "video", "canvas"].includes(tag) ||
    /\b(image|media|visual|mockup|preview|screenshot|chart|graph|illustration)\b/i.test(identity)
  );
}

function isCardLike(element: MatchedElement): boolean {
  const tag = element.tagName.toLowerCase();
  const identity = `${element.id ?? ""} ${element.className ?? ""} ${element.role ?? ""} ${element.ariaLabel ?? ""}`.toLowerCase();
  const hasSurface =
    hasVisiblePaint(element.style.backgroundColor) ||
    hasVisiblePaint(element.style.borderColor) ||
    element.style.boxShadow !== "none" ||
    maxBorderRadiusPx(element.style.borderRadius) > 0;
  const cardShape =
    element.rect.width >= 96 &&
    element.rect.height >= 56 &&
    element.rect.width <= 820 &&
    element.rect.height <= 820 &&
    hasSurface;

  return (
    ["article", "li"].includes(tag) ||
    /\b(card|feature|tile|item|step|plan|price|testimonial|review|metric|stat|panel|box|cell|widget)\b/i.test(identity) ||
    cardShape
  );
}

function isNavItemLike(element: MatchedElement): boolean {
  const tag = element.tagName.toLowerCase();
  const identity = `${element.id ?? ""} ${element.className ?? ""} ${element.role ?? ""}`.toLowerCase();
  const text = normalizeText(element.text);
  return text.length > 0 && text.length <= 48 && (tag === "a" || /\b(nav|menu|link|tab)\b/i.test(identity));
}

function hasMetricText(element: MatchedElement): boolean {
  return /\b\d+(?:[.,]\d+)?(?:[%+$]|k|m|b|x| hrs?| min| sec| users?| teams?| credits?)\b/i.test(element.text);
}

function hasTestimonialText(element: MatchedElement): boolean {
  return /\b(testimonial|review|rating|stars?|customer|founder|ceo|loved|trusted|quote)\b/i.test(
    `${element.text} ${element.className ?? ""} ${element.ariaLabel ?? ""}`
  );
}

function extractPriceTokens(elements: MatchedElement[]) {
  const tokens = new Set<string>();

  elements.forEach((element) => {
    const text = element.text;
    const matches = text.match(/\$\s?\d+(?:[.,]\d+)?|\b\d+\s?(?:credits?|seats?|users?)\b|\b(?:free|pro|starter|enterprise|month|year|monthly|yearly|billing|plan)\b/gi) ?? [];
    matches.forEach((match) => tokens.add(match.trim()));
  });

  return Array.from(tokens).slice(0, 16);
}

function extractUniqueText(elements: MatchedElement[], limit: number, maxLength = 120) {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const element of elements) {
    const text = normalizeText(element.text || element.ariaLabel || "");
    if (!text || seen.has(text)) continue;
    seen.add(text);
    output.push(truncate(text, maxLength));
    if (output.length >= limit) break;
  }

  return output;
}

function buildRepeatedGroups({
  actions,
  cards,
  metricsCount
}: {
  actions: MatchedElement[];
  cards: MatchedElement[];
  metricsCount: number;
}): ObjectInventory["repeatedGroups"] {
  const groups: ObjectInventory["repeatedGroups"] = [];
  const cardGroup = summarizeSimilarGroup(cards, "card");
  const actionGroup = summarizeSimilarGroup(actions, "action");

  if (cardGroup) groups.push(cardGroup);
  if (actionGroup) groups.push(actionGroup);
  if (metricsCount >= 3) {
    groups.push({
      type: "metric",
      count: metricsCount,
      averageWidth: 0,
      averageHeight: 0,
      similarSize: false
    });
  }

  return groups;
}

function summarizeSimilarGroup(
  elements: MatchedElement[],
  type: "card" | "action"
): ObjectInventory["repeatedGroups"][number] | null {
  if (elements.length < 2) return null;
  const avgWidth = average(elements.map((element) => element.rect.width));
  const avgHeight = average(elements.map((element) => element.rect.height));
  const similarSize =
    elements.length >= 3 &&
    elements.filter(
      (element) =>
        Math.abs(element.rect.width - avgWidth) <= Math.max(16, avgWidth * 0.18) &&
        Math.abs(element.rect.height - avgHeight) <= Math.max(16, avgHeight * 0.22)
    ).length >= 3;

  return {
    type,
    count: elements.length,
    averageWidth: Math.round(avgWidth),
    averageHeight: Math.round(avgHeight),
    similarSize
  };
}

function buildStyleSignals(elements: MatchedElement[]): ObjectInventory["styleSignals"] {
  return {
    largeRadiusCount: elements.filter((element) => maxBorderRadiusPx(element.style.borderRadius) >= 20).length,
    pillCount: elements.filter(isPillShaped).length,
    shadowCount: elements.filter((element) => maxShadowBlurPx(element.style.boxShadow) > 16).length,
    glowCount: elements.filter((element) => hasColoredShadow(element.style.boxShadow)).length,
    filledSurfaceCount: elements.filter((element) => hasVisiblePaint(element.style.backgroundColor)).length
  };
}

function buildLayoutSignals(elements: MatchedElement[]): ObjectInventory["layoutSignals"] {
  if (!elements.length) {
    return {
      boundsWidth: 0,
      boundsHeight: 0,
      density: "sparse",
      columnsEstimate: 0,
      rowsEstimate: 0
    };
  }

  const left = Math.min(...elements.map((element) => element.rect.left));
  const right = Math.max(...elements.map((element) => element.rect.right));
  const top = Math.min(...elements.map((element) => element.rect.top));
  const bottom = Math.max(...elements.map((element) => element.rect.bottom));
  const boundsWidth = right - left;
  const boundsHeight = bottom - top;
  const area = Math.max(boundsWidth * boundsHeight, 1);
  const elementArea = elements.reduce(
    (sum, element) => sum + element.rect.width * element.rect.height,
    0
  );
  const densityRatio = elementArea / area;
  const density =
    densityRatio > 1.8 ? "dense" : densityRatio < 0.45 ? "sparse" : "balanced";
  const columnsEstimate = estimateClusters(elements.map((element) => centerX(element)), 48);
  const rowsEstimate = estimateClusters(elements.map((element) => centerY(element)), 48);

  return {
    boundsWidth: Math.round(boundsWidth),
    boundsHeight: Math.round(boundsHeight),
    density,
    columnsEstimate,
    rowsEstimate
  };
}

function extractKeywords(elements: MatchedElement[]) {
  const text = elements.map((element) => `${element.text} ${element.className ?? ""} ${element.id ?? ""}`).join(" ");
  const keywords = [
    "pricing",
    "credits",
    "plan",
    "billing",
    "feature",
    "workflow",
    "testimonial",
    "review",
    "dashboard",
    "metric",
    "analytics",
    "form",
    "email",
    "password",
    "waitlist",
    "contact",
    "settings",
    "footer",
    "navigation",
    "cta"
  ];

  return keywords.filter((keyword) => new RegExp(`\\b${keyword}\\b`, "i").test(text)).slice(0, 16);
}

function byVisualWeight(a: MatchedElement, b: MatchedElement) {
  return visualWeight(b) - visualWeight(a);
}

function visualWeight(element: MatchedElement) {
  return (
    parsePx(element.style.fontSize) * 6 +
    parseFontWeight(element.style.fontWeight) / 10 +
    Math.sqrt(Math.max(element.rect.width * element.rect.height, 0)) +
    (isActionLike(element) ? 80 : 0) +
    (isCardLike(element) ? 45 : 0)
  );
}

function estimateClusters(values: number[], threshold: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  let clusters = 1;
  let current = sorted[0];

  for (const value of sorted.slice(1)) {
    if (Math.abs(value - current) > threshold) {
      clusters += 1;
      current = value;
    } else {
      current = (current + value) / 2;
    }
  }

  return clusters;
}

function hasVisiblePaint(value: string | undefined) {
  if (!value || value === "none" || value === "transparent") return false;
  if (/rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i.test(value)) return false;
  return true;
}

function isPillShaped(element: MatchedElement): boolean {
  const radius = element.style.borderRadius ?? "";
  if (/9999px|50%/.test(radius)) return true;
  const radiusPx = maxBorderRadiusPx(radius);
  const height = element.rect?.height ?? 0;
  return radiusPx >= 18 && height > 0 && height <= 72 && radiusPx >= height / 2 - 2;
}

function hasColoredShadow(value: string | undefined): boolean {
  if (!value || value === "none") return false;
  const colors = value.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}|hsla?\([^)]*\)/gi) ?? [];
  return colors.some((color) => {
    const parsed = parseColor(color);
    if (!parsed) return false;
    if (parsed.a !== undefined && parsed.a < 0.05) return false;
    return Math.max(parsed.r, parsed.g, parsed.b) - Math.min(parsed.r, parsed.g, parsed.b) >= 40;
  });
}

function maxShadowBlurPx(value: string | undefined): number {
  if (!value || value === "none") return 0;
  const shadows = value.split(/,(?![^()]*\))/);
  let maxBlur = 0;
  for (const shadow of shadows) {
    const lengths = (shadow.match(/-?\d+(?:\.\d+)?px/g) ?? []).map((n) => Number.parseFloat(n));
    const blur = lengths[2] ?? 0;
    if (blur > maxBlur) maxBlur = blur;
  }
  return maxBlur;
}

function maxBorderRadiusPx(value: string | undefined): number {
  if (!value) return 0;
  if (/\d+%/.test(value)) {
    const pct = Number.parseFloat(value);
    return pct >= 40 ? 999 : 0;
  }
  const numbers = (value.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  return numbers.length ? Math.max(...numbers) : 0;
}

function parsePx(value: string | undefined): number {
  if (!value) return 0;
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number.parseFloat(match[0]) : 0;
}

function parseFontWeight(value: string | undefined): number {
  if (!value) return 400;
  if (value === "bold") return 700;
  if (value === "normal") return 400;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 400;
}

type ParsedColor = { r: number; g: number; b: number; a?: number };

function parseColor(value: string | undefined): ParsedColor | null {
  if (!value) return null;
  const rgb = value.match(
    /rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)(?:,\s*([0-9.]+))?\)/i
  );
  if (rgb) {
    return {
      r: Number(rgb[1]),
      g: Number(rgb[2]),
      b: Number(rgb[3]),
      a: rgb[4] !== undefined ? Number(rgb[4]) : 1
    };
  }
  const hex = value.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
  if (!hex) return null;
  const raw = hex[1];
  const normalized =
    raw.length === 3
      ? raw.split("").map((char) => `${char}${char}`).join("")
      : raw;
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
    a: 1
  };
}

function centerX(element: MatchedElement) {
  return element.rect.left + element.rect.width / 2;
}

function centerY(element: MatchedElement) {
  return element.rect.top + element.rect.height / 2;
}

function average(values: number[]) {
  return values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;
}

function wordCount(text: string | undefined): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function normalizeText(text: string | undefined) {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}
