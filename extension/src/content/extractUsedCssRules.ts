export type UsedCssExtractionResult = {
  cssText: string;
  ruleCount: number;
  skippedStyleSheets: number;
  errors: string[];
  debug?: {
    matchedSelectors: string[];
    skippedSelectors: string[];
    skippedStyleSheetHrefs: string[];
    mediaRuleCount: number;
  };
};

const MAX_RULES = 260;
const MAX_CSS_LENGTH = 150_000;
const MAX_COMPUTED_RULES = 180;

export function extractUsedCssRules(root: HTMLElement): UsedCssExtractionResult {
  const elements = [
    document.documentElement,
    document.body,
    root,
    ...Array.from(root.querySelectorAll("*"))
  ].filter((element): element is Element => Boolean(element));
  const rules = new Set<string>();
  const errors: string[] = [];
  const matchedSelectors = new Set<string>();
  const skippedSelectors = new Set<string>();
  const skippedStyleSheetHrefs: string[] = [];
  let mediaRuleCount = 0;
  let skippedStyleSheets = 0;

  Array.from(document.styleSheets).forEach((sheet) => {
    let cssRules: CSSRuleList;

    try {
      cssRules = sheet.cssRules;
    } catch (error) {
      skippedStyleSheets += 1;
      skippedStyleSheetHrefs.push(sheet.href ?? "inline stylesheet");
      errors.push(safeErrorMessage(error));
      return;
    }

    mediaRuleCount += collectMatchingRules(cssRules, elements, rules, errors, {
      matchedSelectors,
      skippedSelectors
    });
  });

  const computedCssText = buildComputedCssSnapshot(root);
  const cssText = [
    Array.from(rules).join("\n\n"),
    computedCssText
  ]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, MAX_CSS_LENGTH);

  return {
    cssText,
    ruleCount: rules.size,
    skippedStyleSheets,
    errors: errors.slice(0, 8),
    debug: {
      matchedSelectors: Array.from(matchedSelectors).slice(0, 160),
      skippedSelectors: Array.from(skippedSelectors).slice(0, 160),
      skippedStyleSheetHrefs: skippedStyleSheetHrefs.slice(0, 40),
      mediaRuleCount
    }
  };
}

function buildComputedCssSnapshot(root: HTMLElement): string {
  const sampledElements = collectComputedStyleElements(root);
  const emittedSelectors = new Set<string>();
  const rules: string[] = [];
  const rootVariables = collectCssVariables(document.documentElement);

  if (rootVariables) {
    rules.push(`:root {\n${rootVariables}\n}`);
  }

  const bodyStyle = getComputedStyle(document.body);
  rules.push(
    [
      "*, *::before, *::after {",
      "  box-sizing: border-box;",
      "}",
      "body {",
      "  margin: 0;",
      `  font-family: ${sanitizeCssValue(bodyStyle.fontFamily || getComputedStyle(root).fontFamily)};`,
      `  color: ${sanitizeCssValue(bodyStyle.color || getComputedStyle(root).color)};`,
      `  background: ${sanitizeCssValue(nonTransparentColor(bodyStyle.backgroundColor) ?? "transparent")};`,
      "}"
    ].join("\n")
  );

  for (const element of sampledElements) {
    if (rules.length >= MAX_COMPUTED_RULES) break;
    const selector = selectorForComputedStyleRule(element, root);
    if (!selector || emittedSelectors.has(selector)) continue;

    const declarations = computedDeclarationsForElement(element);
    if (!declarations.length) continue;

    emittedSelectors.add(selector);
    rules.push(`${selector} {\n${declarations.join("\n")}\n}`);
  }

  return [
    "/* Computed CSS snapshot for standalone HTML export. */",
    ...rules
  ].join("\n\n");
}

function collectComputedStyleElements(root: HTMLElement): HTMLElement[] {
  const selectors = [
    "h1,h2,h3,h4,h5,h6",
    "p,span,strong,em,small",
    "a,button,[role='button'],input,textarea,select,label",
    "section,article,nav,header,footer,main,aside,form",
    "div,ul,ol,li",
    "img,svg,picture,video,canvas",
    "[class],[id]"
  ];
  const seen = new Set<HTMLElement>();
  const output: HTMLElement[] = [];

  for (const element of [root, ...Array.from(root.querySelectorAll<HTMLElement>(selectors.join(",")))]) {
    if (!(element instanceof HTMLElement) || seen.has(element)) continue;
    if (element.closest("[data-polishpilot='true']")) continue;
    if (!isVisibleForComputedSnapshot(element)) continue;
    seen.add(element);
    output.push(element);
    if (output.length >= MAX_COMPUTED_RULES) break;
  }

  return output;
}

function isVisibleForComputedSnapshot(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    Number(style.opacity) !== 0
  );
}

function selectorForComputedStyleRule(element: HTMLElement, root: HTMLElement): string | null {
  if (element.id) return `#${cssEscape(element.id)}`;

  const usefulClassNames = usefulClasses(element);
  if (usefulClassNames.length) {
    return usefulClassNames
      .slice(0, 2)
      .map((className) => `.${cssEscape(className)}`)
      .join("");
  }

  const rootSelector = root.id
    ? `#${cssEscape(root.id)}`
    : usefulClasses(root)[0]
      ? `.${cssEscape(usefulClasses(root)[0])}`
      : root.tagName.toLowerCase();
  const tagName = element.tagName.toLowerCase();

  if (/^h[1-6]$|^(p|a|button|ul|ol|li|img|svg|form|input|label)$/.test(tagName)) {
    return `${rootSelector} ${tagName}`;
  }

  return null;
}

function computedDeclarationsForElement(element: HTMLElement): string[] {
  const style = getComputedStyle(element);
  const tagName = element.tagName.toLowerCase();
  const declarations = new Map<string, string>();

  setDeclaration(declarations, "display", importantDisplay(style.display));
  setDeclaration(declarations, "position", style.position !== "static" ? style.position : "");
  setDeclaration(declarations, "flex-direction", style.flexDirection !== "row" ? style.flexDirection : "");
  setDeclaration(declarations, "align-items", style.alignItems !== "normal" ? style.alignItems : "");
  setDeclaration(declarations, "justify-content", style.justifyContent !== "normal" ? style.justifyContent : "");
  setDeclaration(declarations, "gap", style.gap !== "normal" && style.gap !== "0px" ? style.gap : "");
  setDeclaration(declarations, "grid-template-columns", style.gridTemplateColumns !== "none" ? style.gridTemplateColumns : "");
  setDeclaration(declarations, "grid-template-rows", style.gridTemplateRows !== "none" ? style.gridTemplateRows : "");
  setDeclaration(declarations, "max-width", style.maxWidth !== "none" ? style.maxWidth : "");
  setDeclaration(declarations, "min-height", style.minHeight !== "0px" ? style.minHeight : "");
  setDeclaration(declarations, "box-sizing", style.boxSizing !== "content-box" ? style.boxSizing : "");
  setDeclaration(declarations, "margin", usefulBoxValue(style.margin));
  setDeclaration(declarations, "padding", usefulBoxValue(style.padding));
  setDeclaration(declarations, "font-family", style.fontFamily);
  setDeclaration(declarations, "font-size", style.fontSize);
  setDeclaration(declarations, "font-weight", style.fontWeight);
  setDeclaration(declarations, "line-height", style.lineHeight);
  setDeclaration(declarations, "letter-spacing", style.letterSpacing !== "normal" ? style.letterSpacing : "");
  setDeclaration(declarations, "text-align", style.textAlign !== "start" ? style.textAlign : "");
  setDeclaration(declarations, "text-decoration", usefulTextDecoration(style.textDecorationLine, style.textDecorationColor, style.textDecorationStyle));
  setDeclaration(declarations, "text-transform", style.textTransform !== "none" ? style.textTransform : "");
  setDeclaration(declarations, "color", style.color);
  setDeclaration(declarations, "background", usefulBackground(style));
  setDeclaration(declarations, "border", usefulBorder(style));
  setDeclaration(declarations, "border-radius", style.borderRadius !== "0px" ? style.borderRadius : "");
  setDeclaration(declarations, "box-shadow", style.boxShadow !== "none" ? style.boxShadow : "");
  setDeclaration(declarations, "opacity", style.opacity !== "1" ? style.opacity : "");
  setDeclaration(declarations, "overflow", style.overflow !== "visible" ? style.overflow : "");
  setDeclaration(declarations, "object-fit", tagName === "img" && style.objectFit !== "fill" ? style.objectFit : "");
  setDeclaration(declarations, "transition", usefulTransition(style));

  return Array.from(declarations.entries()).map(
    ([property, value]) => `  ${property}: ${sanitizeCssValue(value)};`
  );
}

function setDeclaration(output: Map<string, string>, property: string, value: string | undefined) {
  if (!value) return;
  const sanitized = sanitizeCssValue(value);
  if (!sanitized || sanitized === "normal" || sanitized === "none none rgb(0, 0, 0)") return;
  output.set(property, sanitized);
}

function importantDisplay(value: string) {
  return /flex|grid|inline-flex|inline-grid|contents|none/i.test(value) ? value : "";
}

function usefulBoxValue(value: string) {
  return value && value !== "0px" && value !== "0px 0px" && value !== "0px 0px 0px 0px"
    ? value
    : "";
}

function usefulTextDecoration(line: string, color: string, style: string) {
  return line && line !== "none" ? `${line} ${style} ${color}` : "";
}

function usefulBackground(style: CSSStyleDeclaration) {
  const image = style.backgroundImage;
  if (image && image !== "none" && !/url\(/i.test(image)) {
    return style.background;
  }
  return nonTransparentColor(style.backgroundColor) ?? "";
}

function usefulBorder(style: CSSStyleDeclaration) {
  if (
    style.borderTopStyle === "none" ||
    style.borderTopWidth === "0px" ||
    !nonTransparentColor(style.borderTopColor)
  ) {
    return "";
  }

  return `${style.borderTopWidth} ${style.borderTopStyle} ${style.borderTopColor}`;
}

function usefulTransition(style: CSSStyleDeclaration) {
  if (!style.transitionDuration || style.transitionDuration === "0s") return "";
  return style.transition;
}

function collectCssVariables(element: HTMLElement) {
  const style = getComputedStyle(element);
  const lines: string[] = [];

  for (let index = 0; index < style.length && lines.length < 120; index += 1) {
    const property = style.item(index);
    if (!property.startsWith("--")) continue;
    const value = style.getPropertyValue(property).trim();
    if (!value) continue;
    lines.push(`  ${property}: ${sanitizeCssValue(value)};`);
  }

  return lines.join("\n");
}

function usefulClasses(element: Element) {
  return Array.from(element.classList).filter(
    (className) => className.length <= 80 && /^[A-Za-z0-9:_/-]+$/.test(className)
  );
}

function cssEscape(value: string) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}

function nonTransparentColor(value: string | undefined) {
  if (!value || value === "transparent" || value === "currentColor") return undefined;
  if (/rgba?\([^)]*,\s*0(?:\.0+)?\)/i.test(value)) return undefined;
  return value;
}

function sanitizeCssValue(value: string) {
  return value
    .replace(/url\([\s\S]*?\)/gi, "url([removed])")
    .replace(/;\s*/g, "")
    .trim();
}

function collectMatchingRules(
  cssRules: CSSRuleList,
  elements: Element[],
  output: Set<string>,
  errors: string[],
  debug: {
    matchedSelectors: Set<string>;
    skippedSelectors: Set<string>;
  }
) {
  let mediaRuleCount = 0;

  Array.from(cssRules).some((rule) => {
    if (output.size >= MAX_RULES) {
      return true;
    }

    if (rule instanceof CSSStyleRule) {
      const selectorResult = selectorMatchesAny(rule.selectorText, elements);

      selectorResult.skippedSelectors.forEach((selector) =>
        debug.skippedSelectors.add(selector)
      );

      if (selectorResult.matches) {
        debug.matchedSelectors.add(rule.selectorText);
        output.add(rule.cssText);
      }

      return false;
    }

    if (rule instanceof CSSMediaRule) {
      const nested = new Set<string>();
      const nestedMediaRuleCount = collectMatchingRules(
        rule.cssRules,
        elements,
        nested,
        errors,
        debug
      );
      mediaRuleCount += 1 + nestedMediaRuleCount;

      if (nested.size) {
        output.add(`@media ${rule.conditionText} {\n${Array.from(nested).join("\n")}\n}`);
      }

      return false;
    }

    if (isSupportsRule(rule)) {
      const nested = new Set<string>();
      mediaRuleCount += collectMatchingRules(rule.cssRules, elements, nested, errors, debug);

      if (nested.size) {
        output.add(`@supports ${rule.conditionText} {\n${Array.from(nested).join("\n")}\n}`);
      }
    }

    return false;
  });

  return mediaRuleCount;
}

function selectorMatchesAny(
  selectorText: string,
  elements: Element[]
): { matches: boolean; skippedSelectors: string[] } {
  const selectors = selectorText
    .split(",")
    .map((selector) => selector.trim())
    .filter(Boolean);
  const skippedSelectors: string[] = [];
  let matches = false;

  selectors.forEach((selector) => {
    try {
      if (elements.some((element) => element.matches(selector))) {
        matches = true;
      }
    } catch {
      skippedSelectors.push(selector);
    }
  });

  return { matches, skippedSelectors };
}

function isSupportsRule(rule: CSSRule): rule is CSSConditionRule {
  return (
    typeof CSSSupportsRule !== "undefined" &&
    rule instanceof CSSSupportsRule &&
    "cssRules" in rule
  );
}

function safeErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.slice(0, 180);
}
