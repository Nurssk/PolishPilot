export type CodeChangeScope = "selected-block" | "whole-page";

export type GenerateCodeChangeRequest = {
  screenshotBase64: string;
  scope: CodeChangeScope;
  url?: string;
  title?: string;
  originalHtml: string;
  selectedHtml?: string;
  fullPageHtml?: string;
  usedCss?: string;
  styleContext?: unknown;
  styleTokens?: unknown;
  aiResult?: unknown;
  recommendations?: string[];
  selectedPattern?: unknown;
  selectedTemplateReference?: unknown;
  selectedAnimationReference?: unknown;
};

export type GenerateCodeChangeResult = {
  modifiedHtml: string;
  modifiedCss?: string;
  fullHtmlDocument?: string;
  diffSummary: string;
  cursorPrompt: string;
  warnings: string[];
};

const MAX_HTML_CHARS = 80_000;
const MAX_CSS_CHARS = 18_000;
const MAX_JSON_CONTEXT_CHARS = 12_000;

export function buildCodeChangePrompt(input: GenerateCodeChangeRequest): string {
  const isWholePage = input.scope === "whole-page";
  const scopeInstruction = isWholePage
    ? `Rewrite the full rendered HTML document in ORIGINAL_HTML. Keep unrelated areas stable unless a change is needed to satisfy the recommendations.`
    : `Rewrite ONLY the selected block in ORIGINAL_HTML. Return modifiedHtmlLines for that selected block only. Do not rewrite the full page.`;
  const selectedDirection = {
    selectedPattern: input.selectedPattern,
    selectedTemplateReference: input.selectedTemplateReference,
    selectedAnimationReference: input.selectedAnimationReference
  };
  const hasSelectedDirection = hasMeaningfulValue(selectedDirection);

  return `You are Design Humanizer Code Change.
You are given a screenshot plus sanitized rendered HTML from the user's own website/app.
Generate a reviewable HTML + CSS/code rewrite. This is review-only; do not claim files were edited.

Scope: ${input.scope}
Scope rule: ${scopeInstruction}

Source:
- URL: ${empty(input.url)}
- Title: ${empty(input.title)}
- The screenshot is the visual source of truth.
- The HTML is a rendered DOM snapshot, not guaranteed framework source.
- If ORIGINAL_HTML contains inline style attributes, they are computed browser styles captured for visual fidelity. Preserve them unless a recommendation requires a visual change.
- The Cursor/Claude prompt must tell the coding agent to map the rendered HTML back to the actual source files before editing.

Humanizer recommendations to satisfy:
${formatList(input.recommendations)}

Detected AI/layout context:
${formatJson(input.aiResult)}

Selected layout/template/animation direction:
${formatJson(selectedDirection)}

Selected direction rule:
${
    hasSelectedDirection
      ? "The user explicitly picked this layout/template/animation direction. Treat it as required implementation guidance: apply its structure and motion intent while preserving the user's brand, content meaning, accessibility, and framework-safe HTML/CSS."
      : "No explicit template or animation was selected. Use recommendations and screenshot context only."
  }

Style/CSS context for preserving the brand:
STYLE_CONTEXT:
${formatJson(input.styleContext)}

STYLE_TOKENS:
${formatJson(input.styleTokens)}

USED_CSS:
${capText(input.usedCss ?? "", MAX_CSS_CHARS) || "No used CSS context provided."}

ORIGINAL_HTML:
${capText(input.originalHtml, MAX_HTML_CHARS)}

SELECTED_HTML_CONTEXT:
${capText(input.selectedHtml ?? "", MAX_HTML_CHARS) || "No separate selected HTML context provided."}

FULL_PAGE_HTML_CONTEXT:
${
    isWholePage
      ? capText(input.fullPageHtml ?? input.originalHtml, MAX_HTML_CHARS)
      : "Not included because selected-block scope is active."
  }

Return JSON only with this exact shape:
{
  "modifiedHtmlLines": ["string"],
  "modifiedCssLines": ["string"],
  "diffSummary": "short human-readable summary of concrete changes",
  "cursorPrompt": "prompt for Cursor/Claude Code to apply this change in the real codebase",
  "warnings": ["string"]
}

Rules:
1. modifiedHtmlLines joined with "\\n" must be valid HTML for the requested scope.
2. modifiedCssLines joined with "\\n" must include the CSS required to render modifiedHtmlLines close to the screenshot. Start from USED_CSS when it exists, preserve useful existing class styles, and add CSS for any new or changed classes.
3. Do not return a complete HTML document. The server will build the standalone .html file by combining modifiedHtmlLines and modifiedCssLines.
4. Preserve inline style attributes from ORIGINAL_HTML when they carry layout, typography, colors, spacing, borders, shadows, or sizing.
5. Preserve product meaning, names, links, numbers, prices, form fields, accessibility labels, and core functionality.
6. You may rewrite text when recommendations mention copywriting, dense text, weak hierarchy, unclear CTA, or generic AI wording.
7. If a selected template exists, use its layout/component idea as the main structural direction without copying unrelated demo content.
8. If a selected animation exists, include the required CSS/classes/attributes for that motion, keep motion purposeful, and include reduced-motion safeguards when possible.
9. Keep existing brand direction from CSS/style context unless a recommendation or selected direction requires a visible change.
10. Do not add external scripts, tracking, remote assets, watermarks, or unrelated sections.
11. Do not return Markdown fences.
12. Put any uncertainty or source-mapping limitation in warnings.
13. cursorPrompt must explicitly say the provided HTML/CSS is rendered DOM/CSS and must be mapped to React/Next/Vue/static source files before editing.`;
}

function formatList(items: string[] | undefined) {
  if (!items?.length) {
    return "No explicit recommendations were provided. Improve only obvious visual, hierarchy, copy, and accessibility issues visible in the screenshot.";
  }

  return items.map((item, index) => `${index + 1}. ${capText(item, 700)}`).join("\n");
}

function formatJson(value: unknown) {
  if (value == null) return "None provided.";
  return capText(JSON.stringify(value, null, 2), MAX_JSON_CONTEXT_CHARS);
}

function capText(value: string, maxLength: number) {
  if (!value) return "";
  return value.length <= maxLength
    ? value
    : `${value.slice(0, maxLength)}\n/* truncated: ${
        value.length - maxLength
      } chars omitted */`;
}

function empty(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "unknown";
}

function hasMeaningfulValue(value: unknown): boolean {
  if (value == null) return false;
  if (Array.isArray(value)) return value.some(hasMeaningfulValue);
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(hasMeaningfulValue);
  }
  if (typeof value === "string") return Boolean(value.trim());
  return true;
}
