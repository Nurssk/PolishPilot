import type { PageDesignContext } from "../shared/types";

type ValueCount = { value: string; count: number };

export function extractPageDesignContext(): PageDesignContext {
  const sampledElements = collectSampledElements(220);
  const typography = {
    fontFamilies: new Map<string, number>(),
    fontSizes: new Map<string, number>(),
    fontWeights: new Map<string, number>(),
    lineHeights: new Map<string, number>(),
    letterSpacing: new Map<string, number>()
  };
  const colors = {
    text: new Map<string, number>(),
    backgrounds: new Map<string, number>(),
    borders: new Map<string, number>(),
    focus: new Map<string, number>()
  };
  const spacing = {
    margin: new Map<string, number>(),
    padding: new Map<string, number>(),
    scale: new Map<string, number>()
  };
  const radius = new Map<string, number>();
  const shadows = new Map<string, number>();
  const motionDurations = new Map<string, number>();
  const motionEasings = new Map<string, number>();

  for (const element of sampledElements) {
    const style = getComputedStyle(element);
    increment(typography.fontFamilies, normalizeFontFamilyStack(style.fontFamily));
    increment(typography.fontSizes, normalizeCssValue(style.fontSize));
    increment(typography.fontWeights, normalizeCssValue(style.fontWeight));
    increment(typography.lineHeights, normalizeCssValue(style.lineHeight));
    increment(typography.letterSpacing, normalizeCssValue(style.letterSpacing));

    incrementColor(colors.text, style.color);
    incrementColor(colors.backgrounds, style.backgroundColor);
    incrementColor(colors.borders, style.borderColor);
    incrementColor(colors.focus, style.outlineColor);

    for (const value of [style.marginTop, style.marginRight, style.marginBottom, style.marginLeft]) {
      incrementSpacing(spacing.margin, spacing.scale, value);
    }
    for (const value of [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft]) {
      incrementSpacing(spacing.padding, spacing.scale, value);
    }

    incrementNonZeroLength(radius, style.borderRadius);
    if (style.boxShadow && style.boxShadow !== "none") increment(shadows, normalizeCssValue(style.boxShadow));

    for (const duration of splitCssList(`${style.transitionDuration},${style.animationDuration}`)) {
      if (duration !== "0s" && duration !== "0ms") increment(motionDurations, duration);
    }
    for (const easing of splitCssList(`${style.transitionTimingFunction},${style.animationTimingFunction}`)) {
      if (easing && easing !== "ease") increment(motionEasings, easing);
    }
  }

  const diagnostics: string[] = [];
  if (sampledElements.length < 30) {
    diagnostics.push("Low page sample size: fewer than 30 visible elements were sampled.");
  }
  if (topValues(colors.backgrounds, 4).length < 2) {
    diagnostics.push("Limited page-level background color diversity detected.");
  }
  if (topValues(typography.fontSizes, 6).length < 3) {
    diagnostics.push("Limited page-level typography scale detected.");
  }

  return {
    sampledAt: new Date().toISOString(),
    totalElements: document.querySelectorAll("*").length,
    sampledElements: sampledElements.length,
    typography: {
      fontFamilies: topValues(typography.fontFamilies, 4),
      fontSizes: topNumericValues(typography.fontSizes, 10),
      fontWeights: topNumericValues(typography.fontWeights, 8),
      lineHeights: topNumericValues(typography.lineHeights, 8),
      letterSpacing: topValues(typography.letterSpacing, 6)
    },
    colors: {
      text: topValues(colors.text, 8),
      backgrounds: topValues(colors.backgrounds, 8),
      borders: topValues(colors.borders, 8),
      focus: topValues(colors.focus, 4)
    },
    spacing: {
      margin: topNumericValues(spacing.margin, 8),
      padding: topNumericValues(spacing.padding, 8),
      scale: topNumericValues(spacing.scale, 10)
    },
    radius: topNumericValues(radius, 8),
    shadows: topValues(shadows, 6),
    motion: {
      durations: topDurationValues(motionDurations, 6),
      easings: topValues(motionEasings, 6)
    },
    components: collectComponentCounts(),
    siteSignals: collectSiteSignals(),
    diagnostics
  };
}

function collectSampledElements(limit: number): HTMLElement[] {
  const selectors = [
    "body",
    "h1,h2,h3,h4,h5,h6",
    "p",
    "a",
    "button",
    "input,textarea,select",
    "label",
    "nav,header,footer,main,section,article,aside",
    "ul li,ol li",
    "table,th,td",
    "[role='button']",
    "[class*='card']",
    "[class*='btn']",
    "[tabindex]"
  ];
  const seen = new Set<HTMLElement>();
  const output: HTMLElement[] = [];

  for (const selector of selectors) {
    for (const node of Array.from(document.querySelectorAll(selector))) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.closest("[data-polishpilot='true']")) continue;
      if (seen.has(node) || !isVisible(node)) continue;
      seen.add(node);
      output.push(node);
      if (output.length >= limit) return output;
    }
  }

  if (output.length === 0 && document.body) output.push(document.body);
  return output;
}

function collectComponentCounts(): PageDesignContext["components"] {
  const map: Record<string, string> = {
    buttons: "button, [role='button'], .btn, [class*='button']",
    links: "a[href]",
    inputs: "input, textarea, select",
    forms: "form",
    cards: ".card, [class*='card'], article",
    navigation: "nav, header",
    lists: "ul, ol",
    tables: "table",
    media: "img, picture, video, canvas, svg"
  };

  return Object.entries(map)
    .map(([type, selector]) => ({ type, count: document.querySelectorAll(selector).length }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 9);
}

function collectSiteSignals(): PageDesignContext["siteSignals"] {
  return {
    title: normalizeWhitespace(document.title || ""),
    description: getMetaContent("description"),
    keywords: getMetaContent("keywords"),
    ogType: getMetaContent("og:type", true),
    ogSiteName: getMetaContent("og:site_name", true),
    appName: getMetaContent("application-name"),
    pathname: window.location.pathname || "/",
    hostname: window.location.hostname || "",
    headings: collectTexts("h1, h2", 10, 120),
    navTexts: collectTexts("nav a, nav button, header a, header button", 24, 50),
    ctaTexts: collectTexts(
      "button, [role='button'], a[class*='button'], a[class*='btn'], input[type='submit']",
      24,
      50
    ),
    textSample: normalizeWhitespace((document.body?.innerText || "").slice(0, 2500)),
    elementCounts: {
      forms: document.querySelectorAll("form").length,
      inputs: document.querySelectorAll("input, textarea, select").length,
      tables: document.querySelectorAll("table").length,
      codeBlocks: document.querySelectorAll("pre, code").length,
      articles: document.querySelectorAll("article").length,
      pricingSections: countNodesByText("section, div, article", ["pricing", "plans", "credits", "billing"]),
      productMarkers: document.querySelectorAll(
        "[itemtype*='Product'], [class*='product'], [id*='product'], [data-product]"
      ).length,
      authMarkers: countNodesByText("a, button, label, span", [
        "sign in",
        "log in",
        "login",
        "register",
        "dashboard",
        "workspace"
      ]),
      checkoutMarkers: countNodesByText("a, button, span", [
        "add to cart",
        "checkout",
        "buy now",
        "cart"
      ])
    }
  };
}

function getMetaContent(name: string, property = false): string {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  return normalizeWhitespace(document.querySelector(selector)?.getAttribute("content") || "");
}

function collectTexts(selector: string, limit: number, maxLength: number): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const node of Array.from(document.querySelectorAll(selector))) {
    if (!(node instanceof HTMLElement) || !isVisible(node)) continue;
    const text = normalizeWhitespace(node.innerText || node.textContent || "");
    if (!text || text.length > maxLength || seen.has(text)) continue;
    seen.add(text);
    output.push(text);
    if (output.length >= limit) break;
  }

  return output;
}

function countNodesByText(selector: string, keywords: string[]): number {
  let count = 0;
  for (const node of Array.from(document.querySelectorAll(selector))) {
    if (!(node instanceof HTMLElement)) continue;
    const text = normalizeWhitespace((node.innerText || node.textContent || "").toLowerCase());
    if (text && keywords.some((keyword) => text.includes(keyword))) count += 1;
  }
  return count;
}

function isVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0;
}

function incrementColor(map: Map<string, number>, value: string) {
  const color = normalizeCssValue(value);
  if (!color || isTransparent(color)) return;
  increment(map, color);
}

function incrementSpacing(map: Map<string, number>, scale: Map<string, number>, value: string) {
  const px = parsePx(value);
  if (!Number.isFinite(px) || px <= 0) return;
  const normalized = `${px}px`;
  increment(map, normalized);
  increment(scale, normalized);
}

function incrementNonZeroLength(map: Map<string, number>, value: string) {
  const px = parsePx(value);
  if (!Number.isFinite(px) || px <= 0) return;
  increment(map, `${px}px`);
}

function increment(map: Map<string, number>, value: string) {
  const normalized = normalizeCssValue(value);
  if (!normalized || normalized === "normal" || normalized === "none") return;
  map.set(normalized, (map.get(normalized) ?? 0) + 1);
}

function topValues(map: Map<string, number>, limit: number): string[] {
  return topEntries(map, limit).map((entry) => entry.value);
}

function topNumericValues(map: Map<string, number>, limit: number): string[] {
  return topEntries(map, limit)
    .sort((a, b) => parsePx(a.value) - parsePx(b.value))
    .map((entry) => entry.value);
}

function topDurationValues(map: Map<string, number>, limit: number): string[] {
  return topEntries(map, limit)
    .sort((a, b) => parseDurationMs(a.value) - parseDurationMs(b.value))
    .map((entry) => entry.value);
}

function topEntries(map: Map<string, number>, limit: number): ValueCount[] {
  return Array.from(map.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
    .slice(0, limit);
}

function normalizeFontFamilyStack(value: string): string {
  return normalizeWhitespace(value)
    .split(",")
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");
}

function normalizeCssValue(value: string | null | undefined): string {
  return normalizeWhitespace(value || "");
}

function normalizeWhitespace(value: string): string {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function splitCssList(value: string): string[] {
  return value
    .split(",")
    .map(normalizeWhitespace)
    .filter(Boolean);
}

function isTransparent(value: string): boolean {
  return value === "transparent" || /rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i.test(value);
}

function parsePx(value: string): number {
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number.parseFloat(match[0]) : Number.NaN;
}

function parseDurationMs(value: string): number {
  const match = value.match(/(-?\d*\.?\d+)(ms|s)\b/);
  if (!match) return Number.NaN;
  const amount = Number(match[1]);
  return match[2] === "s" ? amount * 1000 : amount;
}
