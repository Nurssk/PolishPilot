export type PreviewDebugLog = {
  id: string;
  timestamp: number;
  stage:
    | "selection"
    | "dom-extraction"
    | "used-css-extraction"
    | "style-token-extraction"
    | "preview-content-extraction"
    | "html-generation"
    | "iframe-render"
    | "error";
  message: string;
  summary?: Record<string, unknown>;
  htmlPreview?: string;
  cssPreview?: string;
  outputHtml?: string;
  outputCss?: string;
  warnings?: string[];
  errors?: string[];
};

export const MAX_PREVIEW_DEBUG_LOGS = 100;

export function createPreviewDebugLog(
  stage: PreviewDebugLog["stage"],
  message: string,
  data: Partial<PreviewDebugLog> = {}
): PreviewDebugLog {
  const log: PreviewDebugLog = {
    ...data,
    id: data.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: data.timestamp ?? Date.now(),
    stage,
    message,
    htmlPreview: data.htmlPreview
      ? truncateDebugText(sanitizeDebugHtml(data.htmlPreview), 4000)
      : undefined,
    cssPreview: data.cssPreview
      ? truncateDebugText(sanitizeDebugCss(data.cssPreview), 8000)
      : undefined,
    outputHtml: data.outputHtml
      ? truncateDebugText(sanitizeDebugHtml(data.outputHtml), 8000)
      : undefined,
    outputCss: data.outputCss
      ? truncateDebugText(sanitizeDebugCss(data.outputCss), 8000)
      : undefined,
    warnings: data.warnings?.slice(0, 20),
    errors: data.errors?.slice(0, 20)
  };

  logPreviewDebugToConsole(log);
  return log;
}

export function appendPreviewDebugLogs(
  current: PreviewDebugLog[] | undefined,
  next: PreviewDebugLog[]
) {
  return [...(current ?? []), ...next].slice(-MAX_PREVIEW_DEBUG_LOGS);
}

export function sanitizePreviewDebugLogs(logs: PreviewDebugLog[]) {
  return logs.map((log) => ({
    ...log,
    htmlPreview: truncateDebugText(sanitizeDebugHtml(log.htmlPreview ?? ""), 4000),
    cssPreview: truncateDebugText(sanitizeDebugCss(log.cssPreview ?? ""), 8000),
    outputHtml: truncateDebugText(sanitizeDebugHtml(log.outputHtml ?? ""), 8000),
    outputCss: truncateDebugText(sanitizeDebugCss(log.outputCss ?? ""), 8000)
  }));
}

export function truncateDebugText(value: string, maxLength = 4000): string {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}\n\n/* truncated: ${value.length - maxLength} chars omitted */`;
}

export function sanitizeDebugHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "<script>[removed]</script>")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\son\w+=([^\s>]+)/gi, "")
    .replace(/javascript:/gi, "blocked-javascript:");
}

export function sanitizeDebugCss(css: string): string {
  return css
    .replace(/url\([\s\S]*?\)/gi, "url([removed])")
    .replace(/@import[^;]+;/gi, "/* @import removed */");
}

function logPreviewDebugToConsole(log: PreviewDebugLog) {
  if (!isConsoleDebugEnabled()) {
    return;
  }

  console.groupCollapsed(`[Design Humanizer Preview] ${log.stage}`);
  console.log(log.summary ?? {});
  if (log.htmlPreview) console.log("HTML:", log.htmlPreview);
  if (log.cssPreview) console.log("CSS:", log.cssPreview);
  if (log.outputHtml) console.log("Output HTML:", log.outputHtml);
  if (log.outputCss) console.log("Output CSS:", log.outputCss);
  if (log.warnings?.length) console.warn(log.warnings);
  if (log.errors?.length) console.error(log.errors);
  console.groupEnd();
}

function isConsoleDebugEnabled() {
  try {
    const meta = import.meta as ImportMeta & { env?: { DEV?: boolean } };
    return (
      Boolean(meta.env?.DEV) ||
      globalThis.localStorage?.getItem("DH_PREVIEW_DEBUG") === "1"
    );
  } catch {
    return false;
  }
}
