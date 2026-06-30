import type {
  CodeApplyStatus,
  SourceFileCandidate,
  SourcePatchEdit
} from "../shared/types";

export type SourceFileInput = {
  path: string;
  content: string;
  size?: number;
};

export type SourceSearchContext = {
  originalHtml?: string;
  modifiedHtml?: string;
  originalCss?: string;
  modifiedCss?: string;
  recommendations?: string[];
  title?: string;
  url?: string;
};

export type ExactPatchResult = {
  content: string;
  status: CodeApplyStatus;
};

const SOURCE_EXTENSIONS = new Set([
  "html",
  "htm",
  "css",
  "scss",
  "sass",
  "tsx",
  "jsx",
  "vue",
  "svelte"
]);

const EXCLUDED_DIRECTORIES = new Set([
  ".git",
  ".hg",
  ".svn",
  ".next",
  ".nuxt",
  ".svelte-kit",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".turbo",
  ".vite",
  "out"
]);

const EXCLUDED_FILE_NAMES = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lockb",
  "bun.lock",
  "composer.lock",
  "poetry.lock"
]);

export const MAX_SOURCE_FILE_BYTES = 260_000;
export const MAX_CANDIDATE_SNIPPET_CHARS = 14_000;
export const MAX_CANDIDATES_FOR_GEMINI = 12;

export function shouldSkipSourceDirectory(name: string) {
  return EXCLUDED_DIRECTORIES.has(name) || name.startsWith(".");
}

export function isLikelySourceFile(path: string, size = 0) {
  const fileName = lastPathPart(path).toLowerCase();
  if (EXCLUDED_FILE_NAMES.has(fileName)) return false;
  if (/\.min\.(css|js)$/i.test(fileName)) return false;
  if (size > MAX_SOURCE_FILE_BYTES) return false;

  const extension = fileName.split(".").pop() ?? "";
  return SOURCE_EXTENSIONS.has(extension);
}

export function languageForPath(path: string) {
  const extension = (lastPathPart(path).split(".").pop() ?? "").toLowerCase();
  if (extension === "htm") return "html";
  if (extension === "sass") return "scss";
  return extension || "text";
}

export function rankSourceFileCandidates(
  files: SourceFileInput[],
  context: SourceSearchContext
): SourceFileCandidate[] {
  const tokens = buildSourceSearchTokens(context);

  return files
    .filter((file) => isLikelySourceFile(file.path, file.size ?? file.content.length))
    .map((file) => scoreSourceFile(file, tokens))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .slice(0, MAX_CANDIDATES_FOR_GEMINI);
}

export function buildSourceSearchTokens(context: SourceSearchContext): string[] {
  const tokenWeights = new Map<string, number>();
  const add = (token: string, weight: number) => {
    const normalized = normalizeToken(token);
    if (!normalized || normalized.length < 3) return;
    if (/^(div|span|class|style|true|false|null|px|rem|rgb|rgba|var)$/.test(normalized)) return;
    tokenWeights.set(normalized, Math.max(tokenWeights.get(normalized) ?? 0, weight));
  };

  const html = `${context.originalHtml ?? ""}\n${context.modifiedHtml ?? ""}`;
  const css = `${context.originalCss ?? ""}\n${context.modifiedCss ?? ""}`;

  for (const match of html.matchAll(/\b(?:class|className)=["']([^"']+)["']/gi)) {
    match[1].split(/\s+/).forEach((token) => add(token, 5));
  }

  for (const match of html.matchAll(/\b(?:id|href|src|aria-label|alt)=["']([^"']+)["']/gi)) {
    add(match[1], 6);
    splitIdentifier(match[1]).forEach((token) => add(token, 4));
  }

  for (const match of css.matchAll(/[.#]([_a-zA-Z][\w-]*)/g)) {
    add(match[1], 4);
  }

  const visibleText = stripMarkup(html);
  visibleText
    .split(/[^\p{L}\p{N}%$€₸-]+/u)
    .filter((token) => token.length >= 4)
    .slice(0, 260)
    .forEach((token) => add(token, token.length > 12 ? 4 : 2));

  (context.recommendations ?? [])
    .join(" ")
    .split(/[^\p{L}\p{N}-]+/u)
    .forEach((token) => add(token, 1));

  splitIdentifier(context.title ?? "").forEach((token) => add(token, 2));
  splitIdentifier(context.url ?? "").forEach((token) => add(token, 2));

  return Array.from(tokenWeights.entries())
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, 180)
    .map(([token]) => token);
}

export function applyExactSourceEdit(
  content: string,
  edit: SourcePatchEdit
): ExactPatchResult {
  if (!edit.originalSnippet) {
    return {
      content,
      status: {
        editId: edit.id,
        filePath: edit.filePath,
        status: "manual",
        message: "No original snippet was provided; review manually."
      }
    };
  }

  const occurrences = countOccurrences(content, edit.originalSnippet);
  if (occurrences !== 1) {
    return {
      content,
      status: {
        editId: edit.id,
        filePath: edit.filePath,
        status: "blocked",
        message:
          occurrences === 0
            ? "Original snippet no longer matches this file."
            : "Original snippet appears more than once; apply manually."
      }
    };
  }

  return {
    content: content.replace(edit.originalSnippet, edit.replacementSnippet),
    status: {
      editId: edit.id,
      filePath: edit.filePath,
      status: "applied",
      message: "Applied exact source snippet replacement."
    }
  };
}

export function buildUnifiedPatchText(edits: SourcePatchEdit[]) {
  if (!edits.length) return "No source edits were generated.";

  return edits
    .map((edit) => {
      const before = edit.originalSnippet.split(/\r?\n/);
      const after = edit.replacementSnippet.split(/\r?\n/);
      return [
        `diff --design-humanizer a/${edit.filePath} b/${edit.filePath}`,
        `--- a/${edit.filePath}`,
        `+++ b/${edit.filePath}`,
        `@@ ${edit.explanation || "Generated source edit"} @@`,
        ...before.map((line) => `-${line}`),
        ...after.map((line) => `+${line}`)
      ].join("\n");
    })
    .join("\n\n");
}

export function buildSourceEditPreview(edit: SourcePatchEdit) {
  return [
    `File: ${edit.filePath}`,
    `Confidence: ${Math.round(edit.confidence * 100)}%`,
    edit.explanation ? `Why: ${edit.explanation}` : "",
    "",
    "Before:",
    edit.originalSnippet,
    "",
    "After:",
    edit.replacementSnippet
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function scoreSourceFile(file: SourceFileInput, tokens: string[]): SourceFileCandidate {
  const lowerContent = file.content.toLowerCase();
  const lowerPath = file.path.toLowerCase();
  const matchedTokens: string[] = [];
  const reasons: string[] = [];
  let score = 0;
  let bestIndex = -1;

  tokens.forEach((token, index) => {
    const pathMatch = lowerPath.includes(token);
    const contentIndex = lowerContent.indexOf(token);
    if (!pathMatch && contentIndex === -1) return;

    matchedTokens.push(token);
    if (pathMatch) {
      score += Math.max(10, 28 - index * 0.1);
      if (reasons.length < 4) reasons.push(`path:${token}`);
    }
    if (contentIndex !== -1) {
      score += Math.max(6, 18 - index * 0.08);
      if (bestIndex === -1 || contentIndex < bestIndex) bestIndex = contentIndex;
      if (reasons.length < 4) reasons.push(`content:${token}`);
    }
  });

  const language = languageForPath(file.path);
  if (/^(tsx|jsx|vue|svelte|html)$/.test(language)) score += 8;
  if (/^(css|scss)$/.test(language) && /class|style|css|color|spacing|radius/i.test(tokens.join(" "))) {
    score += 4;
  }

  return {
    path: file.path,
    language,
    size: file.size ?? file.content.length,
    score: Math.round(score),
    reasons,
    snippet: buildCandidateSnippet(file.content, bestIndex),
    matchedTokens: matchedTokens.slice(0, 24)
  };
}

function buildCandidateSnippet(content: string, matchIndex: number) {
  if (content.length <= MAX_CANDIDATE_SNIPPET_CHARS) return content;
  const center = matchIndex >= 0 ? matchIndex : 0;
  const start = Math.max(0, center - Math.floor(MAX_CANDIDATE_SNIPPET_CHARS / 2));
  const end = Math.min(content.length, start + MAX_CANDIDATE_SNIPPET_CHARS);
  return `${start > 0 ? "/* snippet truncated before */\n" : ""}${content.slice(
    start,
    end
  )}${end < content.length ? "\n/* snippet truncated after */" : ""}`;
}

function stripMarkup(html: string) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ");
}

function splitIdentifier(value: string) {
  return value
    .replace(/https?:\/\//gi, " ")
    .split(/[^\p{L}\p{N}%$€₸-]+|(?=[A-Z])/u)
    .flatMap((token) => token.split(/[-_./]+/))
    .filter(Boolean);
}

function normalizeToken(token: string) {
  return token
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^#/, "")
    .replace(/^[./]+|[.,;:!?()[\]{}'"`]+$/g, "")
    .trim();
}

function countOccurrences(content: string, search: string) {
  let count = 0;
  let index = content.indexOf(search);
  while (index !== -1) {
    count += 1;
    index = content.indexOf(search, index + search.length);
  }
  return count;
}

function lastPathPart(path: string) {
  return path.split(/[\\/]/).pop() ?? path;
}
