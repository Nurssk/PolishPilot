import type { MatchedElement, RectangleCapture, StyleContext } from "../shared/types";
import type { StyleTokens } from "../content/extractStyleTokens";
import type { LocalUncodixifyFinding } from "./uncodixifyTypes";

// Local, deterministic Uncodixify detector.
//
// Runs entirely from extracted DOM/CSS data — no network. It is intentionally
// conservative: it only emits a finding when concrete CSS evidence supports it,
// so that local findings can be treated as higher-priority than Gemini guesses.

export type LocalUncodixifyInput = {
  matchedElements: MatchedElement[];
  styleContext?: StyleContext;
  styleTokens?: StyleTokens;
  counts?: RectangleCapture["counts"];
  detected?: RectangleCapture["detected"];
  screenshot?: { width?: number; height?: number };
};

export function runLocalUncodixifyCheck(
  input: LocalUncodixifyInput
): LocalUncodixifyFinding[] {
  const elements = Array.isArray(input.matchedElements) ? input.matchedElements : [];
  const findings: LocalUncodixifyFinding[] = [];
  const total = Math.max(elements.length, 1);

  // Pre-compute reusable measurements.
  const classText = elements
    .map((element) => (element.className ?? "").toLowerCase())
    .join(" ");
  const isDark =
    input.styleContext?.theme === "dark" || input.styleTokens?.theme === "dark";
  const sectionType: string = input.detected?.sectionType ?? "unknown";

  // --- hero UX rule base --------------------------------------------------
  if (sectionType === "hero") {
    findings.push(...detectHeroSectionIssues(input, elements, total, classText));
  }

  // --- radius: oversized rounded corners ---------------------------------
  const oversizedRadius = elements.filter(
    (element) => maxBorderRadiusPx(element.style.borderRadius) >= 20
  );
  if (oversizedRadius.length >= 3) {
    findings.push({
      ruleId: "oversized-radius",
      confidence: confidenceFromCount(oversizedRadius.length, total, 0.7),
      evidence: [
        `${oversizedRadius.length} elements use border-radius >= 20px.`,
        ...sampleRadiusEvidence(oversizedRadius)
      ]
    });
  }

  // --- buttons: pill overload --------------------------------------------
  const pillElements = elements.filter((element) => isPillShaped(element));
  if (pillElements.length >= 3) {
    findings.push({
      ruleId: "pill-overload",
      confidence: confidenceFromCount(pillElements.length, total, 0.7),
      evidence: [
        `${pillElements.length} elements are pill-shaped (fully rounded).`,
        ...samplePillEvidence(pillElements)
      ]
    });
  }

  // --- shadow: dramatic shadows ------------------------------------------
  const dramaticShadows = elements.filter(
    (element) => maxShadowBlurPx(element.style.boxShadow) > 16
  );
  if (dramaticShadows.length >= 2) {
    findings.push({
      ruleId: "dramatic-shadows",
      confidence: confidenceFromCount(dramaticShadows.length, total, 0.65),
      evidence: [
        `${dramaticShadows.length} elements use box-shadow blur > 16px.`,
        ...dramaticShadows
          .slice(0, 2)
          .map((element) => `${describeElement(element)} shadow: ${element.style.boxShadow}.`)
      ]
    });
  }

  // --- shadow/color: glow-heavy UI (colored shadows) ---------------------
  const glowElements = elements.filter((element) => hasColoredShadow(element.style.boxShadow));
  if (glowElements.length >= 1) {
    findings.push({
      ruleId: "glow-heavy-ui",
      confidence: confidenceFromCount(glowElements.length, total, 0.6),
      evidence: [
        `${glowElements.length} element(s) use colored glow shadows instead of hierarchy.`,
        ...glowElements
          .slice(0, 2)
          .map((element) => `${describeElement(element)} glow: ${element.style.boxShadow}.`)
      ]
    });
  }

  // --- color: gradient overuse (class-based, computed bg can't show it) ---
  const gradientClassHits = countClassMatches(elements, [
    "bg-gradient",
    "gradient-to",
    "from-",
    "via-",
    "to-"
  ]);
  if (gradientClassHits >= 2 || /gradient/.test(classText)) {
    findings.push({
      ruleId: "gradient-overuse",
      confidence: gradientClassHits >= 2 ? 0.6 : 0.45,
      evidence: [
        gradientClassHits >= 2
          ? `${gradientClassHits} elements use gradient utility classes.`
          : "Gradient-related classes were detected in the selection."
      ]
    });
  }

  // --- panels: glassmorphism (backdrop blur via class) -------------------
  const glassHits = countClassMatches(elements, [
    "backdrop-blur",
    "backdrop-filter",
    "glass",
    "frosted"
  ]);
  if (glassHits >= 1) {
    findings.push({
      ruleId: "glassmorphism-default",
      confidence: confidenceFromCount(glassHits, total, 0.6),
      evidence: [`Detected backdrop-blur / glass classes on ${glassHits} element(s).`]
    });
  }

  // --- spacing: overpadded layout ----------------------------------------
  const overpadded = elements.filter((element) => maxPaddingPx(element.style.padding) >= 48);
  if (overpadded.length >= 2) {
    findings.push({
      ruleId: "overpadded-layout",
      confidence: confidenceFromCount(overpadded.length, total, 0.6),
      evidence: [
        `${overpadded.length} sections/cards use padding >= 48px.`,
        ...overpadded
          .slice(0, 2)
          .map((element) => `${describeElement(element)} padding: ${element.style.padding}.`)
      ]
    });
  }

  // --- spacing: inconsistent spacing -------------------------------------
  const paddingValues = elements
    .map((element) => maxPaddingPx(element.style.padding))
    .filter((value) => value > 0);
  const offScale = paddingValues.filter((value) => !isOnSpacingScale(value));
  if (paddingValues.length >= 4 && offScale.length >= Math.ceil(paddingValues.length / 2)) {
    findings.push({
      ruleId: "inconsistent-spacing",
      confidence: 0.55,
      evidence: [
        `${offScale.length} of ${paddingValues.length} padding values are off the 4/8px spacing scale.`,
        `Off-scale values: ${[...new Set(offScale)].slice(0, 6).map((v) => `${v}px`).join(", ")}.`
      ]
    });
  }

  // --- typography: uppercase label overuse / eyebrows --------------------
  const uppercaseLabels = elements.filter((element) => isUppercaseLabel(element));
  if (uppercaseLabels.length >= 2) {
    findings.push({
      ruleId: "uppercase-label-overuse",
      confidence: confidenceFromCount(uppercaseLabels.length, total, 0.55),
      evidence: [
        `${uppercaseLabels.length} short uppercase labels were detected.`,
        ...uppercaseLabels
          .slice(0, 3)
          .map((element) => `Label: "${truncate(element.text, 40)}".`)
      ]
    });
  }
  const eyebrowHits = countClassMatches(elements, ["eyebrow", "overline", "kicker"]);
  if (eyebrowHits >= 1 || uppercaseLabels.length >= 3) {
    findings.push({
      ruleId: "decorative-eyebrows",
      confidence: eyebrowHits >= 1 ? 0.6 : 0.45,
      evidence: [
        eyebrowHits >= 1
          ? `Detected eyebrow/overline labels on ${eyebrowHits} element(s).`
          : "Multiple small uppercase labels read as decorative eyebrows."
      ]
    });
  }

  // --- cards: repetitive equal cards -------------------------------------
  const equalCards = findEqualCards(elements);
  const equalGrid = input.detected?.layoutType === "equal_grid";
  if (equalCards.count >= 3) {
    findings.push({
      ruleId: "repetitive-equal-cards",
      confidence: equalGrid ? 0.8 : 0.65,
      evidence: [
        `${equalCards.count} card containers share the same width/height and visual weight.`,
        ...(equalGrid ? ["Local detection classified the layout as an equal grid."] : [])
      ]
    });
  } else if (equalGrid && (input.counts?.cardsEstimate ?? 0) >= 3) {
    findings.push({
      ruleId: "repetitive-equal-cards",
      confidence: 0.6,
      evidence: [
        `Equal-grid layout with ${input.counts?.cardsEstimate} similar cards detected.`
      ]
    });
  }

  // --- cards: metric/KPI grid default ------------------------------------
  if (
    (sectionType === "stats" || sectionType === "dashboard") &&
    (equalGrid || equalCards.count >= 3) &&
    (input.counts?.cardsEstimate ?? 0) >= 3
  ) {
    findings.push({
      ruleId: "metric-card-grid-default",
      confidence: 0.6,
      evidence: [
        `A ${input.counts?.cardsEstimate}-tile equal metric/KPI grid is used as the default ${sectionType} layout.`
      ]
    });
  }

  // --- panels: nested panel overload -------------------------------------
  const panelLike = elements.filter((element) => isPanelLike(element));
  if (panelLike.length >= 4) {
    findings.push({
      ruleId: "nested-panel-overload",
      confidence: confidenceFromCount(panelLike.length, total, 0.55),
      evidence: [
        `${panelLike.length} bordered/filled panel containers were detected, suggesting nested panels.`
      ]
    });
  }

  // --- color: blue/cyan AI-dashboard -------------------------------------
  if (isDark) {
    const accentColors = collectAccentColors(input, elements);
    const blueCyan = accentColors.filter((color) => isBlueOrCyan(color));
    if (blueCyan.length >= 1) {
      findings.push({
        ruleId: "blue-cyan-ai-dashboard",
        confidence: confidenceFromCount(blueCyan.length, Math.max(accentColors.length, 1), 0.55),
        evidence: [
          `Dark UI uses blue/cyan accent colors (${[...new Set(blueCyan)].slice(0, 3).join(", ")}).`
        ]
      });
    }
  }

  // --- typography: weak hierarchy ----------------------------------------
  const headingSizes = elements
    .filter((element) => isHeadingLike(element))
    .map((element) => parsePx(element.style.fontSize))
    .filter((value) => value > 0);
  if (headingSizes.length >= 2) {
    const max = Math.max(...headingSizes);
    const min = Math.min(...headingSizes);
    if (max > 0 && max - min <= 4) {
      findings.push({
        ruleId: "weak-hierarchy",
        confidence: 0.55,
        evidence: [
          `Heading-like text sizes are nearly equal (${min}px–${max}px), so hierarchy is weak.`
        ]
      });
    }
  }

  // --- typography: too many muted labels ---------------------------------
  const mutedLabels = elements.filter((element) => isMutedSmallText(element, input));
  if (mutedLabels.length >= 4) {
    findings.push({
      ruleId: "too-many-muted-labels",
      confidence: confidenceFromCount(mutedLabels.length, total, 0.5),
      evidence: [`${mutedLabels.length} low-contrast muted labels were detected.`]
    });
  }

  // --- motion: decorative hover transforms (class-based) -----------------
  const transformHits = countClassMatches(elements, [
    "hover:scale",
    "hover:-translate",
    "hover:translate",
    "transition-transform",
    "hover:rotate"
  ]);
  if (transformHits >= 1) {
    findings.push({
      ruleId: "transform-hover-overuse",
      confidence: confidenceFromCount(transformHits, total, 0.5),
      evidence: [`Detected hover transform classes on ${transformHits} element(s).`]
    });
  }

  // --- badges: decorative badges -----------------------------------------
  const badgeHits = countClassMatches(elements, ["badge", "tag", "chip", "pill"]);
  if (badgeHits >= 3) {
    findings.push({
      ruleId: "decorative-badges",
      confidence: confidenceFromCount(badgeHits, total, 0.5),
      evidence: [`${badgeHits} badge/tag/chip elements were detected.`]
    });
  }

  // --- navigation: floating sidebar shell --------------------------------
  const sidebar = elements.find((element) => isFloatingSidebar(element, classText));
  if (sidebar) {
    findings.push({
      ruleId: "sidebar-floating-shell",
      confidence: 0.5,
      evidence: [
        `A sidebar with rounded outer corners / floating shell was detected (${describeElement(sidebar)}).`
      ]
    });
  }

  return dedupeByRuleId(findings);
}

function detectHeroSectionIssues(
  input: LocalUncodixifyInput,
  elements: MatchedElement[],
  total: number,
  classText: string
): LocalUncodixifyFinding[] {
  const findings: LocalUncodixifyFinding[] = [];
  const headings = elements.filter((element) => isHeadingLike(element));
  const buttonLike = elements.filter((element) => isButtonLike(element));
  const textBlocks = elements.filter((element) => isHeroSupportingText(element));
  const longestSupportingText = textBlocks
    .map((element) => ({ element, wordCount: wordCount(element.text) }))
    .sort((a, b) => b.wordCount - a.wordCount)[0];
  const hasVisualProof = hasHeroVisualProof(input, elements, classText);
  const hasTrustSupport = hasHeroTrustSupport(input, elements, classText);

  if (!headings.length) {
    findings.push({
      ruleId: "hero-missing-clear-headline",
      confidence: 0.72,
      evidence: ["Hero section detected, but no heading-like element was found."]
    });
  } else {
    const strongestHeading = headings
      .map((element) => ({ element, size: parsePx(element.style.fontSize), text: element.text.trim() }))
      .sort((a, b) => b.size - a.size)[0];
    if (strongestHeading && wordCount(strongestHeading.text) <= 2) {
      findings.push({
        ruleId: "hero-missing-clear-headline",
        confidence: 0.52,
        evidence: [`Largest hero heading is very short/vague: "${truncate(strongestHeading.text, 60)}".`]
      });
    }
  }

  if (longestSupportingText?.wordCount && longestSupportingText.wordCount > 25) {
    findings.push({
      ruleId: "hero-supporting-copy-too-long",
      confidence: Math.min(0.82, 0.55 + longestSupportingText.wordCount / 160),
      evidence: [
        `Hero supporting copy has ${longestSupportingText.wordCount} words; target is one concise paragraph under 25 words.`,
        `Text: "${truncate(longestSupportingText.element.text.trim(), 110)}".`
      ]
    });
  }

  if (buttonLike.length === 0) {
    findings.push({
      ruleId: "hero-missing-primary-cta",
      confidence: 0.78,
      evidence: ["Hero section has no button/link CTA in the selected area."]
    });
  } else if (buttonLike.length >= 3) {
    findings.push({
      ruleId: "hero-competing-ctas",
      confidence: confidenceFromCount(buttonLike.length, total, 0.55),
      evidence: [
        `${buttonLike.length} button/link actions were detected in the hero, which can split focus.`,
        `Actions: ${buttonLike.slice(0, 4).map((element) => `"${truncate(element.text.trim(), 28)}"`).join(", ")}.`
      ]
    });
  }

  if (!hasVisualProof) {
    findings.push({
      ruleId: "hero-missing-relevant-visual",
      confidence: 0.52,
      evidence: ["Hero has no detected image, SVG/icon system, product preview card, or visual proof element."]
    });
  }

  if (!hasTrustSupport) {
    findings.push({
      ruleId: "hero-missing-trust-support",
      confidence: 0.45,
      evidence: ["No nearby trust support was detected (logos, testimonial, metric, or reassurance text)."]
    });
  }

  if (headings.length && buttonLike.length && !heroCtaNearHeading(headings, buttonLike)) {
    findings.push({
      ruleId: "hero-poor-scan-flow",
      confidence: 0.5,
      evidence: ["The primary hero action appears spatially disconnected from the main heading."]
    });
  }

  if (hasPerformanceHeavyHeroVisual(input, elements, classText)) {
    findings.push({
      ruleId: "hero-performance-heavy-visual",
      confidence: 0.5,
      evidence: ["Hero uses video/background/animation-heavy signals; ensure core heading and CTA load first."]
    });
  }

  return findings;
}

// --- evidence helpers ----------------------------------------------------

function sampleRadiusEvidence(elements: MatchedElement[]): string[] {
  return elements
    .slice(0, 2)
    .map((element) => `${describeElement(element)} radius: ${element.style.borderRadius}.`);
}

function samplePillEvidence(elements: MatchedElement[]): string[] {
  return elements
    .slice(0, 2)
    .map((element) => `${describeElement(element)} is pill-shaped.`);
}

function describeElement(element: MatchedElement): string {
  const tag = element.tagName ? element.tagName.toLowerCase() : "element";
  const firstClass = (element.className ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join(".");
  return firstClass ? `${tag}.${firstClass}` : tag;
}

// --- numeric parsing -----------------------------------------------------

function parsePx(value: string | undefined): number {
  if (!value) return 0;
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number.parseFloat(match[0]) : 0;
}

function maxBorderRadiusPx(value: string | undefined): number {
  if (!value) return 0;
  if (/\d+%/.test(value)) {
    // percentage radius — only count as large if >= ~40%
    const pct = Number.parseFloat(value);
    return pct >= 40 ? 999 : 0;
  }
  const numbers = (value.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  return numbers.length ? Math.max(...numbers) : 0;
}

function isPillShaped(element: MatchedElement): boolean {
  const radius = element.style.borderRadius ?? "";
  if (/9999px|50%/.test(radius)) return true;
  const radiusPx = maxBorderRadiusPx(radius);
  const height = element.rect?.height ?? 0;
  // Pill = radius >= half the height on a short element (button/chip-like).
  return radiusPx >= 18 && height > 0 && height <= 72 && radiusPx >= height / 2 - 2;
}

function maxShadowBlurPx(value: string | undefined): number {
  if (!value || value === "none") return 0;
  // box-shadow: offsetX offsetY blur spread color — pick the largest 3rd number
  // across comma-separated shadows.
  const shadows = value.split(/,(?![^()]*\))/);
  let maxBlur = 0;
  for (const shadow of shadows) {
    const lengths = (shadow.match(/-?\d+(?:\.\d+)?px/g) ?? []).map((n) => Number.parseFloat(n));
    const blur = lengths[2] ?? 0;
    if (blur > maxBlur) maxBlur = blur;
  }
  return maxBlur;
}

function hasColoredShadow(value: string | undefined): boolean {
  if (!value || value === "none") return false;
  const colors = value.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}|hsla?\([^)]*\)/gi) ?? [];
  return colors.some((color) => {
    const parsed = parseColor(color);
    if (!parsed) return false;
    if (parsed.a !== undefined && parsed.a < 0.05) return false;
    // Colored = noticeably saturated (not gray/black) shadow.
    const max = Math.max(parsed.r, parsed.g, parsed.b);
    const min = Math.min(parsed.r, parsed.g, parsed.b);
    return max - min >= 40 && max >= 60;
  });
}

function maxPaddingPx(value: string | undefined): number {
  if (!value) return 0;
  const numbers = (value.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  return numbers.length ? Math.max(...numbers) : 0;
}

function isOnSpacingScale(value: number): boolean {
  if (value <= 0) return true;
  const scale = [4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96];
  return scale.some((step) => Math.abs(step - value) <= 1);
}

function isUppercaseLabel(element: MatchedElement): boolean {
  const text = (element.text ?? "").trim();
  if (!text || text.length > 28) return false;
  const letters = text.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 2) return false;
  return letters === letters.toUpperCase() && /[A-Z]/.test(letters);
}

function isHeadingLike(element: MatchedElement): boolean {
  const tag = (element.tagName ?? "").toLowerCase();
  if (/^h[1-4]$/.test(tag)) return true;
  if (element.role === "heading") return true;
  const weight = Number.parseInt(element.style.fontWeight ?? "", 10);
  const size = parsePx(element.style.fontSize);
  return size >= 20 && weight >= 600;
}

function isMutedSmallText(element: MatchedElement, input: LocalUncodixifyInput): boolean {
  const size = parsePx(element.style.fontSize);
  if (size === 0 || size > 15) return false;
  const text = (element.text ?? "").trim();
  if (!text || text.length > 60) return false;
  const color = parseColor(element.style.color);
  const background = parseColor(
    element.style.backgroundColor ||
      input.styleContext?.section.backgroundColor ||
      input.styleTokens?.section.background ||
      ""
  );
  if (!color) return false;
  if (!background) return false;
  return contrastRatio(color, background) < 4.5;
}

function isPanelLike(element: MatchedElement): boolean {
  const hasBackground = Boolean(parseColor(element.style.backgroundColor));
  const hasBorder = Boolean(parseColor(element.style.borderColor));
  const radius = maxBorderRadiusPx(element.style.borderRadius);
  const rect = element.rect;
  const isContainer = (rect?.width ?? 0) >= 120 && (rect?.height ?? 0) >= 80;
  return isContainer && (hasBackground || hasBorder) && (hasBorder || radius > 0);
}

function isFloatingSidebar(element: MatchedElement, classText: string): boolean {
  const className = (element.className ?? "").toLowerCase();
  const looksSidebar = /sidebar|side-?nav|rail/.test(className) || /sidebar/.test(classText);
  if (!looksSidebar) return false;
  const rect = element.rect;
  const tall = (rect?.height ?? 0) >= 320 && (rect?.width ?? 0) <= 340;
  const rounded = maxBorderRadiusPx(element.style.borderRadius) >= 10;
  const floats = maxShadowBlurPx(element.style.boxShadow) > 0;
  return tall && (rounded || floats);
}

function isButtonLike(element: MatchedElement): boolean {
  const tag = (element.tagName ?? "").toLowerCase();
  const className = (element.className ?? "").toLowerCase();
  if (tag === "button") return true;
  if (element.role === "button") return true;
  if (tag === "a" && element.text.trim().length > 0 && element.text.trim().length <= 48) {
    return true;
  }
  return /btn|button|cta/.test(className);
}

function isHeroSupportingText(element: MatchedElement): boolean {
  const tag = (element.tagName ?? "").toLowerCase();
  if (/^h[1-6]$/.test(tag) || isButtonLike(element)) return false;
  const text = element.text.trim();
  if (!text || text.length < 24) return false;
  if (text.length > 420) return false;
  const size = parsePx(element.style.fontSize);
  return tag === "p" || size <= 22;
}

function wordCount(value: string | undefined): number {
  if (!value) return 0;
  return (value.trim().match(/\b[\p{L}\p{N}'-]+\b/gu) ?? []).length;
}

function hasHeroVisualProof(
  input: LocalUncodixifyInput,
  elements: MatchedElement[],
  classText: string
): boolean {
  if ((input.counts?.images ?? 0) > 0 || (input.counts?.svgs ?? 0) >= 2) return true;
  if ((input.counts?.cardsEstimate ?? 0) > 0 && /preview|product|dashboard|demo|screen|visual|image|video/.test(classText)) {
    return true;
  }
  return elements.some((element) => {
    const tag = (element.tagName ?? "").toLowerCase();
    const className = (element.className ?? "").toLowerCase();
    const ariaLabel = (element.ariaLabel ?? "").toLowerCase();
    return (
      ["img", "picture", "video", "canvas"].includes(tag) ||
      /preview|product|dashboard|demo|screenshot|mockup|visual|media|video|hero-image/.test(className) ||
      /preview|product|dashboard|demo|screenshot|mockup|video/.test(ariaLabel)
    );
  });
}

function hasHeroTrustSupport(
  input: LocalUncodixifyInput,
  elements: MatchedElement[],
  classText: string
): boolean {
  const text = elements.map((element) => element.text).join(" ").toLowerCase();
  return /trusted|customers|users|teams|companies|logo|logos|testimonial|rating|stars|review|reviews|no credit card|free trial|soc2|gdpr|fortune|used by|joined by/.test(
    `${text} ${classText}`
  );
}

function heroCtaNearHeading(headings: MatchedElement[], buttonLike: MatchedElement[]): boolean {
  const strongestHeading = headings
    .map((element) => ({ element, size: parsePx(element.style.fontSize) }))
    .sort((a, b) => b.size - a.size)[0]?.element;
  if (!strongestHeading) return true;
  const headingCenterY = strongestHeading.rect.top + strongestHeading.rect.height / 2;
  const headingCenterX = strongestHeading.rect.left + strongestHeading.rect.width / 2;
  return buttonLike.some((button) => {
    const buttonCenterY = button.rect.top + button.rect.height / 2;
    const buttonCenterX = button.rect.left + button.rect.width / 2;
    const verticalDistance = Math.abs(buttonCenterY - headingCenterY);
    const horizontalDistance = Math.abs(buttonCenterX - headingCenterX);
    return verticalDistance <= 320 && horizontalDistance <= 520;
  });
}

function hasPerformanceHeavyHeroVisual(
  input: LocalUncodixifyInput,
  elements: MatchedElement[],
  classText: string
): boolean {
  const hasVideoOrAnimationClass = /video|background-video|autoplay|lottie|canvas|animated|motion|parallax/.test(
    classText
  );
  const hasLargeMediaElement = elements.some((element) => {
    const tag = (element.tagName ?? "").toLowerCase();
    if (!["video", "canvas", "img", "picture"].includes(tag)) return false;
    const area = (element.rect.width ?? 0) * (element.rect.height ?? 0);
    const captureArea = (input.screenshot?.width ?? 0) * (input.screenshot?.height ?? 0);
    return captureArea > 0 && area / captureArea >= 0.45;
  });
  return hasVideoOrAnimationClass && (hasLargeMediaElement || (input.screenshot?.height ?? 0) >= 640);
}

type EqualCardsResult = { count: number };

function findEqualCards(elements: MatchedElement[]): EqualCardsResult {
  const cards = elements.filter((element) => isPanelLike(element));
  const buckets = new Map<string, number>();
  for (const card of cards) {
    const width = Math.round((card.rect?.width ?? 0) / 12) * 12;
    const height = Math.round((card.rect?.height ?? 0) / 12) * 12;
    const bg = card.style.backgroundColor || "none";
    const key = `${width}x${height}|${bg}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  let max = 0;
  for (const value of buckets.values()) {
    if (value > max) max = value;
  }
  return { count: max };
}

function collectAccentColors(
  input: LocalUncodixifyInput,
  elements: MatchedElement[]
): string[] {
  const colors: string[] = [];
  const push = (value: string | undefined) => {
    if (value && value !== "none") colors.push(value);
  };
  push(input.styleTokens?.accentColor);
  push(input.styleContext?.accent.color);
  push(input.styleContext?.accent.backgroundColor);
  push(input.styleContext?.button?.backgroundColor);
  for (const element of elements) {
    const tag = (element.tagName ?? "").toLowerCase();
    if (tag === "a" || tag === "button" || element.role === "button") {
      push(element.style.backgroundColor);
      push(element.style.color);
    }
  }
  return colors;
}

function isBlueOrCyan(value: string): boolean {
  const color = parseColor(value);
  if (!color) return false;
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  if (max - min < 30) return false; // grayish, not a saturated accent
  const hue = rgbToHue(color);
  // Blue/cyan band ~ 180deg (cyan) to 260deg (blue) and blue dominant.
  const blueDominant = color.b >= color.r && color.b >= color.g - 10;
  return blueDominant && hue >= 175 && hue <= 265;
}

// --- color utilities -----------------------------------------------------

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
  if (hex) {
    const raw = hex[1];
    const normalized =
      raw.length === 3
        ? raw
            .split("")
            .map((c) => `${c}${c}`)
            .join("")
        : raw;
    return {
      r: Number.parseInt(normalized.slice(0, 2), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      b: Number.parseInt(normalized.slice(4, 6), 16),
      a: 1
    };
  }
  return null;
}

function rgbToHue(color: ParsedColor): number {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let hue: number;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  hue *= 60;
  return hue < 0 ? hue + 360 : hue;
}

function relativeLuminance(color: ParsedColor): number {
  const [r, g, b] = [color.r, color.g, color.b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: ParsedColor, b: ParsedColor): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

// --- misc ----------------------------------------------------------------

function countClassMatches(elements: MatchedElement[], needles: string[]): number {
  return elements.filter((element) => {
    const className = (element.className ?? "").toLowerCase();
    return needles.some((needle) => className.includes(needle));
  }).length;
}

function confidenceFromCount(count: number, total: number, base: number): number {
  const ratio = Math.min(count / Math.max(total, 1), 1);
  return clamp01(base + ratio * 0.2);
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function truncate(value: string | undefined, max: number): string {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

function dedupeByRuleId(findings: LocalUncodixifyFinding[]): LocalUncodixifyFinding[] {
  const map = new Map<string, LocalUncodixifyFinding>();
  for (const finding of findings) {
    const existing = map.get(finding.ruleId);
    if (!existing) {
      map.set(finding.ruleId, finding);
      continue;
    }
    map.set(finding.ruleId, {
      ruleId: finding.ruleId,
      confidence: Math.max(existing.confidence, finding.confidence),
      evidence: [...new Set([...existing.evidence, ...finding.evidence])]
    });
  }
  return [...map.values()];
}
