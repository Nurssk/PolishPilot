export type HtmlSnapshotScope = "selected-block" | "whole-page";

const DEFAULT_SELECTED_MAX_CHARS = 16_000;
const DEFAULT_WHOLE_PAGE_MAX_CHARS = 80_000;

export function sanitizeHtmlSnapshot(
  html: string,
  options: {
    scope?: HtmlSnapshotScope;
    maxLength?: number;
  } = {}
): string {
  const scope = options.scope ?? "selected-block";
  const maxLength =
    options.maxLength ??
    (scope === "whole-page" ? DEFAULT_WHOLE_PAGE_MAX_CHARS : DEFAULT_SELECTED_MAX_CHARS);

  const sanitized = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<([a-z][\w:-]*)\b[^>]*(?:data-polishpilot=["']true["']|id=["']polishpilot-[^"']*["'])[^>]*>[\s\S]*?<\/\1>/gi,
      ""
    )
    .replace(
      /<([a-z][\w:-]*)\b[^>]*(?:data-polishpilot=["']true["']|id=["']polishpilot-[^"']*["'])[^>]*\/?>/gi,
      ""
    )
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, "")
    .replace(/<template\b[\s\S]*?<\/template>/gi, "")
    .replace(/\sdata-polishpilot=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(?:nonce|integrity|crossorigin|referrerpolicy)=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "blocked-javascript:")
    .replace(/data:image\/[a-zA-Z+.-]+;base64,[A-Za-z0-9+/=]+/g, "[image-data-omitted]")
    .replace(/[A-Za-z0-9+/=]{700,}/g, "[long-encoded-value-omitted]")
    .replace(
      /<meta\b(?!(?=[^>]*(?:charset=|name=["']viewport["'])))[^>]*>/gi,
      ""
    )
    .replace(
      /<link\b[^>]*rel=["'](?:preload|prefetch|dns-prefetch|preconnect|modulepreload|manifest|icon|apple-touch-icon)["'][^>]*>/gi,
      ""
    )
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

  return truncateHtmlSnapshot(sanitized, maxLength);
}

export function truncateHtmlSnapshot(html: string, maxLength: number): string {
  if (!html || html.length <= maxLength) {
    return html;
  }

  return `${html.slice(0, maxLength)}\n<!-- truncated: ${
    html.length - maxLength
  } chars omitted from sanitized HTML snapshot -->`;
}
