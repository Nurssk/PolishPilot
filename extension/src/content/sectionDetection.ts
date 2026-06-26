import type {
  DetectionSummary,
  ElementCounts,
  LayoutType,
  MatchedElement,
  SectionType,
  SourceSectionPart
} from "../shared/types";

type SectionCandidate = {
  sectionType: SectionType;
  score: number;
  reasons: string[];
};

type HeroSignalResult = {
  score: number;
  reasons: string[];
  variant?: string;
};

type SourceSectionDetectionContext = Pick<
  SourceSectionPart,
  | "tagName"
  | "id"
  | "className"
  | "role"
  | "ariaLabel"
  | "textSummary"
  | "selectionOverlap"
  | "counts"
  | "headingSnippets"
  | "ctaSnippets"
  | "mediaSnippets"
  | "childElementCount"
  | "domPath"
>;

type DetectionOptions = {
  selectedSourceSection?: SourceSectionDetectionContext | null;
  sourceSections?: SourceSectionDetectionContext[];
};

const HERO_SOURCE_IDENTITY_RE =
  /hero|landing|cta|banner|jumbotron|above-fold|headline|intro|masthead|splash/i;
const CTA_TEXT_RE = /start|get|try|watch|demo|book|join|sign|learn|contact|download|buy|subscribe/i;
const TRUST_TEXT_RE =
  /trusted|customers|users|teams|companies|logos?|testimonial|rating|reviews?|no credit card|free trial|soc2|gdpr|used by|joined by/i;

export function detectSectionAndLayout(
  elements: MatchedElement[],
  counts: ElementCounts,
  options: DetectionOptions = {}
): DetectionSummary {
  const candidates = [
    options.selectedSourceSection
      ? scoreSourceSection(options.selectedSourceSection, elements, counts)
      : null,
    scoreHeroSection(elements, counts),
    scorePricingSection(elements, counts),
    scoreStatsSection(elements, counts),
    scoreFormSection(elements, counts),
    scoreNavigationSection(elements, counts),
    scoreFeaturesSection(elements, counts),
    scoreTestimonialsSection(elements, counts),
    scoreFooterSection(elements, counts),
    scoreDashboardSection(elements, counts),
    scoreAuthSection(elements, counts),
    scoreCtaSection(elements, counts)
  ].filter((candidate): candidate is SectionCandidate => Boolean(candidate))
    .sort((a, b) => b.score - a.score);

  const best = candidates[0] ?? { sectionType: "unknown", score: 0, reasons: [] };
  const sectionType = best.score >= 35 ? best.sectionType : "unknown";
  const reasons = sectionType === "unknown" ? [] : [...best.reasons];
  const layoutType = detectLayoutType(elements, reasons);
  const confidence = sectionType === "unknown"
    ? 0.25
    : Math.min(0.95, 0.28 + best.score / 100 + Math.min(elements.length, 20) / 120);

  return {
    sectionType,
    layoutType,
    confidence: Number(confidence.toFixed(2)),
    reasons
  };
}

function scoreSourceSection(
  source: SourceSectionDetectionContext,
  elements: MatchedElement[],
  fallbackCounts: ElementCounts
): SectionCandidate {
  const counts = source.counts ?? fallbackCounts;
  const identity = [
    source.tagName,
    source.id,
    source.className,
    source.role,
    source.ariaLabel,
    source.domPath
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const text = [source.textSummary, combinedText(elements)].join(" ").toLowerCase();

  if (
    (source.tagName === "nav" || /\b(nav|navbar|navigation|menu|topbar)\b/i.test(identity)) &&
    counts.links >= 2 &&
    counts.textLength < 420
  ) {
    return {
      sectionType: "navigation",
      score: 92,
      reasons: ["explicit navigation source container detected"]
    };
  }

  if (source.tagName === "footer" || /\bfooter\b|site-footer/i.test(identity)) {
    return {
      sectionType: "footer",
      score: 88,
      reasons: ["explicit footer source container detected"]
    };
  }

  if (source.tagName === "form" && counts.inputs >= 1) {
    return {
      sectionType: "form",
      score: 88,
      reasons: ["explicit form source container detected"]
    };
  }

  const candidates: SectionCandidate[] = [
    scoreSourceIdentity("navigation", identity, text, [
      { re: /\b(nav|navbar|navigation|menu|topbar|header)\b/i, points: 54, reason: "source container is navigation/header-like" },
      { re: /\b(header)\b/i, points: 30, reason: "header source tag detected" }
    ], counts),
    scoreSourceIdentity("footer", identity, text, [
      { re: /\b(footer|site-footer)\b/i, points: 58, reason: "source container is footer-like" }
    ], counts),
    scoreSourceIdentity("auth", identity, text, [
      { re: /\b(auth|login|sign-in|signin|sign-up|signup|password)\b/i, points: 58, reason: "source identity indicates auth flow" }
    ], counts),
    scoreSourceIdentity("form", identity, text, [
      { re: /\b(form|contact|lead|newsletter|waitlist)\b/i, points: 54, reason: "source container is form/lead-capture-like" }
    ], counts),
    scoreSourceIdentity("pricing", identity, text, [
      { re: /\b(pricing|price|plans?|billing|subscription)\b/i, points: 60, reason: "source identity indicates pricing" }
    ], counts),
    scoreSourceIdentity("testimonials", identity, text, [
      { re: /\b(testimonials?|reviews?|quotes?|customers?|social-proof)\b/i, points: 58, reason: "source identity indicates testimonials/social proof" }
    ], counts),
    scoreSourceIdentity("stats", identity, text, [
      { re: /\b(stats?|metrics?|kpi|numbers?|results?)\b/i, points: 56, reason: "source identity indicates stats/metrics" }
    ], counts),
    scoreSourceIdentity("dashboard", identity, text, [
      { re: /\b(dashboard|analytics|metrics|widgets?|chart|kpi)\b/i, points: 54, reason: "source identity indicates dashboard/metrics" }
    ], counts),
    scoreSourceIdentity("features", identity, text, [
      { re: /\b(features?|benefits?|cards?|grid|integrations?|workflow|how-it-works)\b/i, points: 54, reason: "source identity indicates feature/card section" }
    ], counts),
    scoreSourceIdentity("cta", identity, text, [
      { re: /\b(cta|call-to-action|banner)\b/i, points: 52, reason: "source identity indicates CTA section" }
    ], counts),
    scoreSourceIdentity("hero", identity, text, [
      { re: HERO_SOURCE_IDENTITY_RE, points: 64, reason: "source identity indicates hero/landing section" }
    ], counts)
  ];

  const best = candidates.sort((a, b) => b.score - a.score)[0] ?? {
    sectionType: "unknown",
    score: 0,
    reasons: []
  };

  if (source.selectionOverlap >= 0.55) {
    best.score += 10;
    best.reasons.push("source section strongly overlaps selected rectangle");
  } else if (source.selectionOverlap >= 0.25) {
    best.score += 5;
    best.reasons.push("source section partially overlaps selected rectangle");
  }

  if (source.headingSnippets.length) {
    best.score += 6;
    best.reasons.push("source section includes heading text");
  }
  if (source.ctaSnippets.length && ["hero", "cta", "pricing", "form", "auth"].includes(best.sectionType)) {
    best.score += 7;
    best.reasons.push("source section includes CTA/action text");
  }
  if (source.mediaSnippets.length && ["hero", "features", "dashboard"].includes(best.sectionType)) {
    best.score += 5;
    best.reasons.push("source section includes media/visual nodes");
  }

  return best;
}

function scoreSourceIdentity(
  sectionType: SectionType,
  identity: string,
  text: string,
  rules: Array<{ re: RegExp; points: number; reason: string }>,
  counts: ElementCounts
): SectionCandidate {
  let score = 0;
  const reasons: string[] = [];

  for (const rule of rules) {
    if (rule.re.test(identity) || rule.re.test(text)) {
      score += rule.points;
      reasons.push(rule.reason);
      break;
    }
  }

  if (sectionType === "pricing" && /(price|pricing|\$|month|year|plan|subscription)/i.test(text)) {
    score += 18;
    reasons.push("source text contains pricing language");
  }
  if (sectionType === "features" && counts.cardsEstimate >= 3) {
    score += 12;
    reasons.push("source section has repeated card-like children");
  }
  if (sectionType === "form" && counts.inputs >= 1) {
    score += 22;
    reasons.push("source section contains form inputs");
  }
  if (sectionType === "auth" && counts.inputs >= 1) {
    score += 18;
    reasons.push("source section contains auth inputs");
  }
  if (sectionType === "navigation" && counts.links >= 3 && counts.textLength < 320) {
    score += 16;
    reasons.push("source section is a low-density link cluster");
  }
  if (sectionType === "footer" && counts.links >= 3) {
    score += 12;
    reasons.push("source footer contains link groups");
  }
  if (sectionType === "testimonials" && TRUST_TEXT_RE.test(text)) {
    score += 18;
    reasons.push("source text contains review/trust language");
  }
  if (sectionType === "stats" && /\b\d+(?:[%+]|\s?[km])\b/i.test(text)) {
    score += 18;
    reasons.push("source text contains metric values");
  }
  if (sectionType === "cta" && CTA_TEXT_RE.test(text) && counts.totalElements <= 20) {
    score += 16;
    reasons.push("source text contains CTA language");
  }

  return { sectionType, score, reasons };
}

export function estimateCards(elements: MatchedElement[]): number {
  return elements.filter((element) => {
    const className = element.className?.toLowerCase() ?? "";
    const identity = [
      element.id,
      className,
      element.role,
      element.ariaLabel
    ]
      .filter(Boolean)
      .join(" ");
    const hasCardTag = ["article", "li"].includes(element.tagName);
    const hasCardClass =
      /\b(card|feature|tile|item|step|plan|price|testimonial|review|metric|stat|panel|box|cell|widget)\b/i.test(identity);
    const hasSurface =
      hasVisibleSurface(element.style.backgroundColor) ||
      hasVisibleSurface(element.style.borderColor) ||
      element.style.boxShadow !== "none" ||
      element.style.borderRadius !== "0px";
    const hasCardShape =
      element.rect.width >= 120 &&
      element.rect.height >= 80 &&
      element.rect.width <= 760 &&
      element.rect.height <= 760 &&
      hasSurface;

    return hasCardTag || hasCardClass || hasCardShape;
  }).length;
}

function hasVisibleSurface(value: string | undefined): boolean {
  if (!value || value === "transparent") return false;
  if (/rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i.test(value)) return false;
  return value !== "none";
}

function scoreHeroSection(
  elements: MatchedElement[],
  counts: ElementCounts
): SectionCandidate {
  const signal = scoreHeroSignals(elements, counts);

  return {
    sectionType: "hero",
    score: signal.score,
    reasons: signal.variant
      ? [...signal.reasons, `hero variant: ${signal.variant}`]
      : signal.reasons
  };
}

function scoreHeroSignals(
  elements: MatchedElement[],
  counts: ElementCounts
): HeroSignalResult {
  const reasons: string[] = [];
  let score = 0;
  const bounds = boundsOf(elements);
  const headline = findHeroHeadline(elements);
  const supportingCopy = findSupportingCopy(elements, headline);
  const ctas = elements.filter(isButtonLike);
  const navItems = findNavLikeElements(elements, bounds);
  const visual = findHeroVisual(elements, counts, bounds);
  const trust = hasTrustSignal(elements);
  const sourceIdentity = elements.some((element) =>
    HERO_SOURCE_IDENTITY_RE.test([element.id, element.className, element.role, element.ariaLabel].filter(Boolean).join(" "))
  );

  if (headline) {
    score += 30;
    reasons.push("large headline-like text detected");
    if (isNearTop(headline, bounds)) {
      score += 15;
      reasons.push("headline appears in the first viewport area");
    }
  }

  if (supportingCopy) {
    score += 12;
    reasons.push("supporting copy appears near the headline");
  }

  if (ctas.length > 0) {
    score += 22;
    reasons.push(ctas.length > 1 ? "primary and secondary CTA-like controls detected" : "CTA-like control detected");
  }

  if (navItems.length >= 2) {
    score += 8;
    reasons.push("navigation-like row detected near the hero");
  }

  if (visual) {
    score += 18;
    reasons.push("large supporting visual cluster detected");
  }

  if (trust) {
    score += 8;
    reasons.push("trust/proof signal detected near hero content");
  }

  if (sourceIdentity) {
    score += 8;
    reasons.push("hero/landing source identity detected");
  }

  if (isHeroLikeAspect(bounds)) {
    score += 7;
    reasons.push("selected area has hero-like wide first-viewport proportions");
  }

  return {
    score,
    reasons,
    variant: score >= 55 ? detectHeroVariant(elements, counts, bounds, ctas, visual) : undefined
  };
}

function scorePricingSection(elements: MatchedElement[], counts: ElementCounts): SectionCandidate {
  const text = combinedText(elements);
  let score = 0;
  const reasons: string[] = [];

  if (/(price|pricing|\$|month|year|plan|pro|basic|starter|premium|seat|subscription)/i.test(text)) {
    score += 38;
    reasons.push("pricing-related words or symbols detected");
  }
  if (counts.cardsEstimate >= 2 && /(plan|pro|basic|starter|premium)/i.test(text)) {
    score += 18;
    reasons.push("multiple plan/card-like blocks detected");
  }

  return { sectionType: "pricing", score, reasons };
}

function scoreStatsSection(elements: MatchedElement[], counts: ElementCounts): SectionCandidate {
  const text = combinedText(elements);
  let score = 0;
  const reasons: string[] = [];

  if (/\b\d+(?:[%+]|\s?[km])\b/i.test(text)) {
    score += 28;
    reasons.push("metric-like numbers detected");
  }
  if (counts.cardsEstimate >= 3 && /(kpi|metric|growth|revenue|users|score)/i.test(text)) {
    score += 20;
    reasons.push("metric card group detected");
  }

  return { sectionType: "stats", score, reasons };
}

function scoreFormSection(_elements: MatchedElement[], counts: ElementCounts): SectionCandidate {
  const reasons: string[] = [];
  let score = 0;

  if (counts.inputs >= 2) {
    score += 55;
    reasons.push("multiple input controls detected");
  } else if (counts.inputs === 1) {
    score += 28;
    reasons.push("single input control detected");
  }

  return { sectionType: "form", score, reasons };
}

function scoreNavigationSection(elements: MatchedElement[], counts: ElementCounts): SectionCandidate {
  const bounds = boundsOf(elements);
  const navItems = findNavLikeElements(elements, bounds);
  const mostlyNav = navItems.length >= 3 && counts.totalElements <= 12 && counts.textLength < 220;

  return {
    sectionType: "navigation",
    score: mostlyNav ? 54 : navItems.length >= 3 ? 26 : 0,
    reasons: mostlyNav ? ["navigation-like link cluster detected"] : []
  };
}

function scoreFeaturesSection(elements: MatchedElement[], counts: ElementCounts): SectionCandidate {
  const reasons: string[] = [];
  let score = 0;

  if (counts.cardsEstimate >= 3) {
    score += 45;
    reasons.push("repeated card-like blocks detected");
  }
  if (/feature|benefit|workflow|integrations?|templates?/i.test(combinedText(elements))) {
    score += 14;
    reasons.push("feature-related text detected");
  }

  return { sectionType: "features", score, reasons };
}

function scoreTestimonialsSection(elements: MatchedElement[], counts: ElementCounts): SectionCandidate {
  const text = combinedText(elements);
  const identity = combinedIdentity(elements);
  const reasons: string[] = [];
  let score = 0;

  if (/\b(testimonials?|reviews?|quotes?|customers?|rating|stars?|trusted|loved by)\b/i.test(`${text} ${identity}`)) {
    score += 44;
    reasons.push("testimonial/review source text detected");
  }
  if (counts.cardsEstimate >= 2 && /(said|says|review|customer|founder|ceo|rating)/i.test(text)) {
    score += 14;
    reasons.push("repeated testimonial-like cards detected");
  }

  return { sectionType: "testimonials", score, reasons };
}

function scoreFooterSection(elements: MatchedElement[], counts: ElementCounts): SectionCandidate {
  const identity = combinedIdentity(elements);
  const text = combinedText(elements);
  const linkDense = counts.links >= 3 && counts.textLength < 700;
  const reasons: string[] = [];
  let score = 0;

  if (/\bfooter\b|site-footer|copyright|privacy|terms/i.test(`${identity} ${text}`)) {
    score += 48;
    reasons.push("footer-like source identity or text detected");
  }
  if (linkDense && /privacy|terms|contact|company|resources|docs/i.test(text)) {
    score += 10;
    reasons.push("footer-like link group detected");
  }

  return { sectionType: "footer", score, reasons };
}

function scoreDashboardSection(elements: MatchedElement[], counts: ElementCounts): SectionCandidate {
  const text = combinedText(elements);
  const identity = combinedIdentity(elements);
  const reasons: string[] = [];
  let score = 0;

  if (/(dashboard|analytics|chart|widget|kpi|revenue|pipeline|activity|table)/i.test(`${text} ${identity}`)) {
    score += 38;
    reasons.push("dashboard/analytics language detected");
  }
  if (counts.cardsEstimate >= 3 && /\b\d+(?:[%+]|\s?[km])\b/i.test(text)) {
    score += 16;
    reasons.push("dashboard-like metric widget group detected");
  }

  return { sectionType: "dashboard", score, reasons };
}

function scoreAuthSection(elements: MatchedElement[], counts: ElementCounts): SectionCandidate {
  const text = combinedText(elements);
  const identity = combinedIdentity(elements);
  const reasons: string[] = [];
  let score = 0;

  if (/(auth|login|log in|sign in|signin|sign up|signup|password|magic link)/i.test(`${text} ${identity}`)) {
    score += 46;
    reasons.push("auth/login source text detected");
  }
  if (counts.inputs >= 1 && /(password|email|account)/i.test(text)) {
    score += 16;
    reasons.push("auth input controls detected");
  }

  return { sectionType: "auth", score, reasons };
}

function scoreCtaSection(elements: MatchedElement[], counts: ElementCounts): SectionCandidate {
  const ctas = elements.filter(isButtonLike);
  const text = combinedText(elements);
  const shortBlock = counts.totalElements <= 10 && counts.textLength < 360;
  const score = ctas.length >= 1 && shortBlock && /start|get|try|join|contact|book|download/i.test(text)
    ? 42
    : ctas.length >= 2
      ? 35
      : 0;

  return {
    sectionType: "cta",
    score,
    reasons: score ? ["CTA-focused short block detected"] : []
  };
}

function detectLayoutType(elements: MatchedElement[], reasons: string[]): LayoutType {
  const blocks = elements
    .filter((element) => element.rect.width >= 80 && element.rect.height >= 45)
    .slice(0, 20);

  if (blocks.length < 2) {
    return "unknown";
  }

  const bounds = boundsOf(blocks);
  const leftBlocks = blocks.filter((element) => centerX(element) < bounds.left + bounds.width * 0.48);
  const rightBlocks = blocks.filter((element) => centerX(element) > bounds.left + bounds.width * 0.52);
  const leftArea = areaSum(leftBlocks);
  const rightArea = areaSum(rightBlocks);

  if (leftBlocks.length >= 1 && rightBlocks.length >= 1 && leftArea > 0 && rightArea > 0) {
    reasons.push("content is split into left/right visual groups");
    return "two_column";
  }

  const centersX = blocks.map(centerX);
  const centersY = blocks.map(centerY);
  const xSpread = Math.max(...centersX) - Math.min(...centersX);
  const ySpread = Math.max(...centersY) - Math.min(...centersY);
  const similarWidths = blocks.filter(
    (element) => Math.abs(element.rect.width - blocks[0].rect.width) < blocks[0].rect.width * 0.25
  ).length;
  const topAligned = blocks.filter(
    (element) => Math.abs(element.rect.top - blocks[0].rect.top) < 40
  ).length;

  if (blocks.length >= 3 && similarWidths >= 3 && topAligned >= 3) {
    reasons.push("three or more similarly sized columns detected");
    return "equal_grid";
  }

  if (blocks.length >= 2 && blocks.length <= 4 && topAligned >= 2 && xSpread > ySpread * 1.4) {
    reasons.push("elements are mostly arranged horizontally");
    return "horizontal_row";
  }

  if (blocks.length >= 2 && xSpread < ySpread * 0.55) {
    reasons.push("elements are mostly stacked vertically");
    return "vertical_stack";
  }

  return "unknown";
}

function detectHeroVariant(
  elements: MatchedElement[],
  counts: ElementCounts,
  bounds: Bounds,
  ctas: MatchedElement[],
  visual: MatchedElement | null
): string {
  const text = combinedText(elements);
  const identity = elements
    .map((element) => [element.id, element.className, element.role, element.ariaLabel].filter(Boolean).join(" "))
    .join(" ")
    .toLowerCase();

  if (counts.inputs >= 1 || /email|waitlist|newsletter|invite|early access|magic link/i.test(text)) {
    return "hero-email-capture";
  }
  if (hasVideoIdentity(elements, identity) && visual) {
    return "hero-video-demo";
  }
  if (/tab|tabs|segmented|mode/.test(identity)) {
    return "hero-tabs-preview";
  }
  if (TRUST_TEXT_RE.test(text) || /logo|logos|customer/.test(identity)) {
    return "hero-logo-cloud";
  }
  if (/dashboard|workspace|product|preview|screenshot|mockup/.test(`${text} ${identity}`) && visual) {
    return "hero-dashboard-preview";
  }
  if (/background|photo|image/.test(identity)) {
    return "hero-image-background";
  }
  if (isContainedHero(elements, bounds)) {
    return "hero-contained-card";
  }
  if (visual && isOffGridVisual(visual, bounds, ctas)) {
    return "hero-off-grid-visual";
  }
  if (visual) {
    return "split_visual_hero";
  }
  return "centered_hero";
}

function hasVideoIdentity(elements: MatchedElement[], identity: string): boolean {
  if (/video|player|play-button|media-demo|demo-video/.test(identity)) return true;
  return elements.some((element) => element.tagName.toLowerCase() === "video");
}

function findHeroHeadline(elements: MatchedElement[]): MatchedElement | null {
  const candidates = elements
    .filter((element) => {
      const text = element.text.trim();
      if (!text || text.length > 140) return false;
      const words = wordCount(text);
      if (words < 2 || words > 16) return false;
      const tag = element.tagName.toLowerCase();
      const weight = Number.parseInt(element.style.fontWeight ?? "", 10);
      const size = parsePx(element.style.fontSize);
      const classText = `${element.id ?? ""} ${element.className ?? ""} ${element.role ?? ""}`;
      return /^h[1-3]$/.test(tag) || element.role === "heading" || size >= 32 || weight >= 700 || /headline|title|hero/.test(classText);
    })
    .sort((a, b) => headlineStrength(b) - headlineStrength(a));

  return candidates[0] ?? null;
}

function headlineStrength(element: MatchedElement): number {
  return parsePx(element.style.fontSize) * 2 + Number.parseInt(element.style.fontWeight ?? "0", 10) / 20 + element.rect.width / 20;
}

function findSupportingCopy(elements: MatchedElement[], headline: MatchedElement | null): MatchedElement | null {
  if (!headline) return null;
  const headlineBottom = headline.rect.bottom;
  return elements.find((element) => {
    const text = element.text.trim();
    const words = wordCount(text);
    if (words < 5 || words > 45) return false;
    if (isButtonLike(element)) return false;
    const size = parsePx(element.style.fontSize);
    return size <= 24 && element.rect.top >= headlineBottom - 20 && element.rect.top <= headlineBottom + 220;
  }) ?? null;
}

function findNavLikeElements(elements: MatchedElement[], bounds: Bounds): MatchedElement[] {
  const topLimit = bounds.top + Math.max(90, bounds.height * 0.18);
  return elements.filter((element) => {
    const text = element.text.trim();
    if (!text || text.length > 48) return false;
    const tag = element.tagName.toLowerCase();
    const classText = `${element.id ?? ""} ${element.className ?? ""} ${element.role ?? ""}`.toLowerCase();
    return element.rect.top <= topLimit && (tag === "a" || /nav|menu|link|navbar|topbar/.test(classText));
  });
}

function findHeroVisual(
  elements: MatchedElement[],
  counts: ElementCounts,
  bounds: Bounds
): MatchedElement | null {
  const minArea = Math.max(9000, bounds.width * bounds.height * 0.08);
  const visual = elements
    .filter((element) => {
      const tag = element.tagName.toLowerCase();
      const classText = `${element.id ?? ""} ${element.className ?? ""} ${element.ariaLabel ?? ""}`.toLowerCase();
      const area = element.rect.width * element.rect.height;
      const visualTag = ["img", "svg", "picture", "video", "canvas"].includes(tag);
      const visualClass = /visual|image|media|preview|product|dashboard|demo|graphic|illustration|orb|mockup/.test(classText);
      const largeDecorativeBlock = area >= minArea && element.text.trim().length < 80 && element.rect.width >= 160 && element.rect.height >= 120;
      return visualTag || visualClass || largeDecorativeBlock;
    })
    .sort((a, b) => b.rect.width * b.rect.height - a.rect.width * a.rect.height)[0];

  if (visual) return visual;
  return counts.images > 0 || counts.svgs > 0 ? elements.find((element) => ["img", "svg"].includes(element.tagName)) ?? null : null;
}

function isButtonLike(element: MatchedElement): boolean {
  const tag = element.tagName.toLowerCase();
  const text = element.text.trim();
  const classText = `${element.id ?? ""} ${element.className ?? ""} ${element.role ?? ""} ${element.ariaLabel ?? ""}`.toLowerCase();
  const buttonShape = element.rect.width >= 56 && element.rect.width <= 260 && element.rect.height >= 28 && element.rect.height <= 72;
  if (tag === "button" || element.role === "button") return true;
  if (tag === "a" && text.length > 0 && text.length <= 48) return true;
  if (/button|btn|cta|action/.test(classText) && buttonShape) return true;
  return buttonShape && CTA_TEXT_RE.test(text);
}

function hasTrustSignal(elements: MatchedElement[]): boolean {
  return TRUST_TEXT_RE.test(combinedText(elements));
}

function isNearTop(element: MatchedElement, bounds: Bounds): boolean {
  return element.rect.top <= bounds.top + Math.max(260, bounds.height * 0.38);
}

function isHeroLikeAspect(bounds: Bounds): boolean {
  return bounds.width >= 520 && bounds.height >= 300 && bounds.width / Math.max(bounds.height, 1) >= 1.15;
}

function isContainedHero(elements: MatchedElement[], bounds: Bounds): boolean {
  return elements.some((element) => {
    const area = element.rect.width * element.rect.height;
    const boundsArea = bounds.width * bounds.height;
    return area / Math.max(boundsArea, 1) >= 0.55 && element.style.borderRadius !== "0px";
  });
}

function isOffGridVisual(
  visual: MatchedElement,
  bounds: Bounds,
  ctas: MatchedElement[]
): boolean {
  const rightSide = centerX(visual) > bounds.left + bounds.width * 0.55;
  const large = visual.rect.width * visual.rect.height > bounds.width * bounds.height * 0.16;
  const ctaLeft = ctas.length ? ctas.some((cta) => centerX(cta) < bounds.left + bounds.width * 0.45) : true;
  return rightSide && large && ctaLeft;
}

type Bounds = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

function boundsOf(elements: MatchedElement[]): Bounds {
  if (!elements.length) {
    return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
  }
  const left = Math.min(...elements.map((element) => element.rect.left));
  const right = Math.max(...elements.map((element) => element.rect.right));
  const top = Math.min(...elements.map((element) => element.rect.top));
  const bottom = Math.max(...elements.map((element) => element.rect.bottom));
  return { top, left, right, bottom, width: right - left, height: bottom - top };
}

function combinedText(elements: MatchedElement[]): string {
  return elements.map((element) => element.text).join(" ").toLowerCase();
}

function combinedIdentity(elements: MatchedElement[]): string {
  return elements
    .map((element) =>
      [element.tagName, element.id, element.className, element.role, element.ariaLabel]
        .filter(Boolean)
        .join(" ")
    )
    .join(" ")
    .toLowerCase();
}

function parsePx(value: string | undefined): number {
  if (!value) return 0;
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number.parseFloat(match[0]) : 0;
}

function wordCount(value: string): number {
  return (value.trim().match(/\b[\p{L}\p{N}'-]+\b/gu) ?? []).length;
}

function centerX(element: MatchedElement): number {
  return element.rect.left + element.rect.width / 2;
}

function centerY(element: MatchedElement): number {
  return element.rect.top + element.rect.height / 2;
}

function areaSum(elements: MatchedElement[]): number {
  return elements.reduce((sum, element) => sum + element.rect.width * element.rect.height, 0);
}
