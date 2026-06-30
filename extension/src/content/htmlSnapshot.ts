export type HtmlSnapshotScope = "selected-block" | "whole-page";

const DEFAULT_SELECTED_MAX_CHARS = 16_000;
const DEFAULT_WHOLE_PAGE_MAX_CHARS = 80_000;
const DEFAULT_INLINE_SELECTED_MAX_CHARS = 260_000;
const DEFAULT_INLINE_WHOLE_PAGE_MAX_CHARS = 520_000;

const INLINE_STYLE_PROPERTIES = [
  "box-sizing",
  "display",
  "position",
  "inset",
  "top",
  "right",
  "bottom",
  "left",
  "z-index",
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",
  "aspect-ratio",
  "margin",
  "padding",
  "overflow",
  "overflow-x",
  "overflow-y",
  "font-family",
  "font-size",
  "font-style",
  "font-weight",
  "line-height",
  "letter-spacing",
  "text-align",
  "text-decoration",
  "text-transform",
  "white-space",
  "color",
  "background",
  "background-color",
  "background-image",
  "background-size",
  "background-position",
  "background-repeat",
  "border",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "border-radius",
  "outline",
  "box-shadow",
  "opacity",
  "object-fit",
  "object-position",
  "flex",
  "flex-direction",
  "flex-wrap",
  "align-items",
  "justify-content",
  "align-content",
  "gap",
  "row-gap",
  "column-gap",
  "order",
  "grid-template-columns",
  "grid-template-rows",
  "grid-column",
  "grid-row",
  "place-items",
  "place-content",
  "transform",
  "transform-origin",
  "filter",
  "backdrop-filter",
  "clip-path"
];

export function sanitizeHtmlSnapshot(
  html: string,
  options: {
    scope?: HtmlSnapshotScope;
    maxLength?: number;
    preserveVisualAssets?: boolean;
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
    .replace(
      /data:image\/[a-zA-Z+.-]+;base64,[A-Za-z0-9+/=]+/g,
      options.preserveVisualAssets ? "$&" : "[image-data-omitted]"
    )
    .replace(
      /[A-Za-z0-9+/=]{700,}/g,
      options.preserveVisualAssets ? "$&" : "[long-encoded-value-omitted]"
    )
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

  const safeCut = findSafeHtmlCutIndex(html, maxLength);

  return `${html.slice(0, safeCut)}\n<!-- truncated: ${
    html.length - safeCut
  } chars omitted from sanitized HTML snapshot -->`;
}

export function buildInlineComputedHtmlSnapshot(
  root: HTMLElement,
  options: {
    scope?: HtmlSnapshotScope;
    includeDoctype?: boolean;
    maxLength?: number;
    preserveVisualAssets?: boolean;
  } = {}
): string {
  const scope = options.scope ?? "selected-block";
  const maxLength =
    options.maxLength ??
    (scope === "whole-page"
      ? DEFAULT_INLINE_WHOLE_PAGE_MAX_CHARS
      : DEFAULT_INLINE_SELECTED_MAX_CHARS);
  const clone = root.cloneNode(true) as HTMLElement;

  applyComputedStyles(root, clone);
  preserveMutableElementState(root, clone);

  const html = `${options.includeDoctype ? "<!doctype html>\n" : ""}${clone.outerHTML}`;

  return sanitizeHtmlSnapshot(html, {
    scope,
    maxLength,
    preserveVisualAssets: options.preserveVisualAssets ?? true
  });
}

function applyComputedStyles(source: Element, clone: Element) {
  if (source instanceof HTMLElement || source instanceof SVGElement) {
    const computed = getComputedStyle(source);
    const inlineStyle = buildInlineStyle(computed);

    if (inlineStyle) {
      clone.setAttribute("style", inlineStyle);
    }
  }

  const sourceChildren = Array.from(source.children);
  const cloneChildren = Array.from(clone.children);

  sourceChildren.forEach((sourceChild, index) => {
    const cloneChild = cloneChildren[index];
    if (cloneChild) {
      applyComputedStyles(sourceChild, cloneChild);
    }
  });
}

function preserveMutableElementState(source: Element, clone: Element) {
  if (source instanceof HTMLInputElement && clone instanceof HTMLInputElement) {
    if (source.type === "checkbox" || source.type === "radio") {
      if (source.checked) clone.setAttribute("checked", "");
      else clone.removeAttribute("checked");
    } else if (source.value) {
      clone.setAttribute("value", source.value);
    }
  }

  if (source instanceof HTMLTextAreaElement && clone instanceof HTMLTextAreaElement) {
    clone.textContent = source.value;
  }

  if (source instanceof HTMLSelectElement && clone instanceof HTMLSelectElement) {
    Array.from(source.options).forEach((option, index) => {
      if (option.selected) {
        clone.options[index]?.setAttribute("selected", "");
      }
    });
  }

  const sourceChildren = Array.from(source.children);
  const cloneChildren = Array.from(clone.children);

  sourceChildren.forEach((sourceChild, index) => {
    const cloneChild = cloneChildren[index];
    if (cloneChild) {
      preserveMutableElementState(sourceChild, cloneChild);
    }
  });
}

function buildInlineStyle(style: CSSStyleDeclaration) {
  const declarations: string[] = [];

  INLINE_STYLE_PROPERTIES.forEach((property) => {
    const value = sanitizeCssValue(style.getPropertyValue(property));
    if (!value || shouldSkipInlineDeclaration(property, value)) {
      return;
    }
    declarations.push(`${property}: ${value}`);
  });

  return declarations.length ? `${declarations.join("; ")};` : "";
}

function shouldSkipInlineDeclaration(property: string, value: string) {
  if (value === "normal" || value === "none" || value === "auto") return true;
  if (value === "0px" && !/^(width|height|line-height)$/.test(property)) return true;
  if (value === "0px 0px" || value === "0px 0px 0px 0px") return true;
  if (property === "display" && value === "block") return false;
  if (property === "position" && value === "static") return true;
  if (property === "background-image" && /url\(\[removed\]\)/.test(value)) return true;
  return false;
}

function sanitizeCssValue(value: string) {
  return value
    .replace(/url\((\s*['"]?)javascript:[\s\S]*?\)/gi, "url(blocked-javascript:)")
    .replace(/;\s*/g, "")
    .trim();
}

function findSafeHtmlCutIndex(html: string, maxLength: number) {
  const lastClose = html.lastIndexOf(">", maxLength);
  if (lastClose > 0) {
    return lastClose + 1;
  }

  return maxLength;
}
