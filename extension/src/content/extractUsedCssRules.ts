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
const MAX_CSS_LENGTH = 90_000;

export function extractUsedCssRules(root: HTMLElement): UsedCssExtractionResult {
  const elements = [root, ...Array.from(root.querySelectorAll("*"))];
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

  const cssText = Array.from(rules).join("\n\n").slice(0, MAX_CSS_LENGTH);

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
