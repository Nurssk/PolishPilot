export type SourcePatchScope = "selected-block" | "whole-page";

export type SourceFileCandidate = {
  path: string;
  language: string;
  size: number;
  score: number;
  reasons: string[];
  snippet: string;
  matchedTokens: string[];
};

export type GenerateSourcePatchRequest = {
  screenshotBase64: string;
  scope: SourcePatchScope;
  url?: string;
  title?: string;
  originalHtml: string;
  originalCss?: string;
  modifiedHtml: string;
  modifiedCss?: string;
  recommendations?: string[];
  selectedPattern?: unknown;
  selectedTemplateReference?: unknown;
  selectedAnimationReference?: unknown;
  candidateFiles: SourceFileCandidate[];
};

export type SourcePatchEdit = {
  id: string;
  filePath: string;
  originalSnippet: string;
  replacementSnippet: string;
  explanation: string;
  confidence: number;
};

export type GenerateSourcePatchResult = {
  summary: string;
  edits: SourcePatchEdit[];
  warnings: string[];
  manualInstructions?: string;
};

const MAX_HTML_CHARS = 38_000;
const MAX_CSS_CHARS = 18_000;
const MAX_CANDIDATE_FILES = 12;
const MAX_CANDIDATE_SNIPPET_CHARS = 14_000;

export function buildSourcePatchPrompt(input: GenerateSourcePatchRequest): string {
  const scopeRule =
    input.scope === "whole-page"
      ? "Map the whole rendered page rewrite back to source files. Keep unrelated source stable."
      : "Map only the selected rendered block rewrite back to source files. Do not edit unrelated page sections.";
  const selectedDirection = {
    selectedPattern: input.selectedPattern,
    selectedTemplateReference: input.selectedTemplateReference,
    selectedAnimationReference: input.selectedAnimationReference
  };
  const hasSelectedDirection = hasMeaningfulValue(selectedDirection);

  return `You are Design Humanizer Source Patch.
You are given a screenshot, a rendered HTML/CSS before/after rewrite, and ranked real project source snippets.
Generate reviewable source-file edits only. Do not claim files were edited.

Scope: ${input.scope}
Scope rule: ${scopeRule}
URL: ${empty(input.url)}
Title: ${empty(input.title)}

The rendered HTML/CSS is browser output. The source files may be React, Next, Vue, Svelte, static HTML, CSS, or SCSS.
Use the screenshot and modified rendered HTML/CSS to understand the intended UI change.
Use the candidate source snippets to locate exact source edits.

Recommendations:
${formatList(input.recommendations)}

Selected layout/template/animation direction:
${formatJson(selectedDirection)}

Selected direction source-mapping rule:
${
    hasSelectedDirection
      ? "The user explicitly picked this layout/template/animation direction. Source edits must preserve that chosen structure and motion intent when mapping the rendered rewrite into framework/source files."
      : "No explicit template or animation was selected. Map only the rendered rewrite and recommendations."
  }

ORIGINAL_RENDERED_HTML:
${capText(input.originalHtml, MAX_HTML_CHARS)}

ORIGINAL_RENDERED_CSS:
${capText(input.originalCss ?? "", MAX_CSS_CHARS) || "No original CSS provided."}

MODIFIED_RENDERED_HTML:
${capText(input.modifiedHtml, MAX_HTML_CHARS)}

MODIFIED_RENDERED_CSS:
${capText(input.modifiedCss ?? "", MAX_CSS_CHARS) || "No modified CSS provided."}

RANKED_SOURCE_CANDIDATES:
${formatCandidates(input.candidateFiles)}

Return JSON only with this exact shape:
{
  "summary": "short summary of source files to edit",
  "edits": [
    {
      "id": "stable-edit-id",
      "filePath": "relative/path/from/project/root",
      "originalSnippet": "exact substring copied from the provided source candidate snippet",
      "replacementSnippet": "replacement source code",
      "explanation": "why this edit maps the rendered change to source",
      "confidence": 0.0
    }
  ],
  "warnings": ["string"],
  "manualInstructions": "string"
}

Rules:
1. originalSnippet MUST be copied exactly from a provided source candidate snippet, including whitespace.
2. If you cannot find an exact source snippet, do not invent one. Put guidance in manualInstructions instead.
3. Each edit must modify only the files needed for the rendered change.
4. For selected-block scope, do not rewrite the whole page or global app shell.
5. Preserve framework syntax, imports, component boundaries, props, links, accessibility labels, and business logic.
6. If adding CSS classes, include a separate edit for the relevant CSS/SCSS file when a candidate exists.
7. If a selected template exists, map its structural intent into existing components instead of adding unrelated demo markup.
8. If a selected animation exists, map the motion into existing CSS/component code and preserve reduced-motion behavior when the codebase already has it.
9. Keep confidence between 0 and 1. Use confidence below 0.7 when mapping is uncertain.
10. Do not return Markdown fences.`;
}

function formatCandidates(candidates: SourceFileCandidate[]) {
  const formatted = candidates
    .slice(0, MAX_CANDIDATE_FILES)
    .map((candidate, index) =>
      [
        `#${index + 1} ${candidate.path}`,
        `language: ${candidate.language}`,
        `size: ${candidate.size}`,
        `score: ${candidate.score}`,
        `reasons: ${candidate.reasons.join(", ") || "none"}`,
        `matchedTokens: ${candidate.matchedTokens.slice(0, 20).join(", ") || "none"}`,
        "sourceSnippet:",
        capText(candidate.snippet, MAX_CANDIDATE_SNIPPET_CHARS)
      ].join("\n")
    );

  return formatted.length ? formatted.join("\n\n---\n\n") : "No candidate source files provided.";
}

function formatList(items: string[] | undefined) {
  if (!items?.length) return "No explicit recommendations provided.";
  return items.map((item, index) => `${index + 1}. ${capText(item, 700)}`).join("\n");
}

function formatJson(value: unknown) {
  if (value == null) return "None provided.";
  return capText(JSON.stringify(value, null, 2), 12_000);
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
