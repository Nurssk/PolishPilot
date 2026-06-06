import type { StyleTokens } from "../content/extractStyleTokens";
import type { LayoutPattern } from "./layoutPatterns";
import type { PreviewContent, PreviewItem } from "./extractPreviewItems";

export type BuildHumanizedPreviewHtmlInput = {
  pattern: LayoutPattern;
  content: PreviewContent;
  styleTokens?: StyleTokens;
};

export type BuildHumanizedPreviewHtmlResult = {
  html: string;
  layoutCss: string;
  debug?: {
    patternId: string;
    patternName?: string;
    rendererUsed: string;
    preservedClassCount: number;
    inlineFallbackUsed: boolean;
    generatedNodeCount?: number;
  };
};

export function buildHumanizedPreviewHtml(
  input: BuildHumanizedPreviewHtmlInput
): BuildHumanizedPreviewHtmlResult {
  const patternKey = input.pattern.layoutPreviewType;
  const items = normalizedItems(input.content.items);
  const html = `
<section class="polishpilot-preview-root polishpilot-preview-section polishpilot-pattern-${escapeAttribute(patternKey)}" style="${sectionStyle(input.styleTokens)}">
  ${renderHeader(input.content, input.styleTokens)}
  ${renderItems(patternKey, items, input.styleTokens)}
  ${renderOutsideTextFallback(input.content, input.styleTokens)}
</section>`;

  return {
    html,
    layoutCss: buildLayoutCss(),
    debug: {
      patternId: input.pattern.id,
      patternName: input.pattern.name,
      rendererUsed: patternGridClass(patternKey),
      preservedClassCount: countPreservedClasses(input.content),
      inlineFallbackUsed: Boolean(input.styleTokens),
      generatedNodeCount: countGeneratedNodes(html)
    }
  };
}

function normalizedItems(items: PreviewItem[]): PreviewItem[] {
  if (items.length) {
    return items.slice(0, 6);
  }

  return [
    {
      id: "fallback-1",
      title: "Card 1",
      description: "Extracted preview item"
    },
    {
      id: "fallback-2",
      title: "Card 2",
      description: "Extracted preview item"
    },
    {
      id: "fallback-3",
      title: "Card 3",
      description: "Extracted preview item"
    }
  ];
}

function renderHeader(content: PreviewContent, styleTokens?: StyleTokens) {
  if (!content.sectionEyebrow && !content.sectionTitle && !content.sectionSubtitle) {
    return "";
  }

  return `<div class="polishpilot-preview-header">
    ${
      content.sectionEyebrow
        ? `<div class="polishpilot-preview-eyebrow" style="${accentStyle(styleTokens)}">${escapeHtml(content.sectionEyebrow)}</div>`
        : ""
    }
    ${
      content.sectionTitle
        ? `<h2 class="polishpilot-preview-heading" style="${headingStyle(styleTokens)}">${escapeHtml(content.sectionTitle)}</h2>`
        : ""
    }
    ${
      content.sectionSubtitle
        ? `<p class="polishpilot-preview-subtitle" style="${bodyStyle(styleTokens, true)}">${escapeHtml(content.sectionSubtitle)}</p>`
        : ""
    }
  </div>`;
}

function renderItems(
  patternId: string,
  items: PreviewItem[],
  styleTokens?: StyleTokens
) {
  const gridClass = patternGridClass(patternId);
  return `<div class="polishpilot-preview-grid ${gridClass}">
    ${items.slice(0, 6).map((item, index) => renderCard(item, index, patternId, styleTokens)).join("\n")}
  </div>`;
}

function renderCard(
  item: PreviewItem,
  index: number,
  patternId: string,
  styleTokens?: StyleTokens
) {
  const featured = isFeaturedCard(index, patternId);
  const cardClasses = `polishpilot-preview-card${featured ? " polishpilot-preview-card-featured" : ""}`;

  if (patternId === "pricing-emphasis") {
    return renderPricingCard(item, index, cardClasses, styleTokens);
  }

  if (
    patternId === "metric-bento" ||
    patternId === "hero-metric-support-stats" ||
    patternId === "stats-highlight"
  ) {
    return renderStatCard(item, cardClasses, styleTokens);
  }

  return `<article class="${cardClasses}" style="${cardStyle(styleTokens, featured)}">
    ${item.icon?.exists ? renderIcon(styleTokens) : ""}
    ${item.eyebrow ? `<div class="polishpilot-preview-card-eyebrow" style="${accentStyle(styleTokens)}">${escapeHtml(item.eyebrow)}</div>` : ""}
    <h3 class="polishpilot-preview-card-title" style="${cardTitleStyle(styleTokens)}">${escapeHtml(item.title)}</h3>
    ${item.description ? `<p class="polishpilot-preview-card-text" style="${bodyStyle(styleTokens, true)}">${escapeHtml(item.description)}</p>` : ""}
    ${item.cta ? `<div class="polishpilot-preview-card-cta" style="${buttonStyle(styleTokens)}">${escapeHtml(item.cta)}</div>` : ""}
  </article>`;
}

function renderPricingCard(
  item: PreviewItem,
  index: number,
  className: string,
  styleTokens?: StyleTokens
) {
  const emphasized = index === 1;

  return `<article class="${className}${emphasized ? " polishpilot-preview-card-featured" : ""}" style="${cardStyle(styleTokens, emphasized)}">
    ${emphasized ? `<div class="polishpilot-preview-badge" style="${buttonStyle(styleTokens)}">Recommended</div>` : ""}
    <h3 class="polishpilot-preview-card-title" style="${cardTitleStyle(styleTokens)}">${escapeHtml(item.title)}</h3>
    ${item.value ? `<div class="polishpilot-preview-price" style="${headingStyle(styleTokens)}">${escapeHtml(item.value)}</div>` : ""}
    ${item.description ? `<p class="polishpilot-preview-card-text" style="${bodyStyle(styleTokens, true)}">${escapeHtml(item.description)}</p>` : ""}
    ${item.cta ? `<div class="polishpilot-preview-card-cta" style="${buttonStyle(styleTokens)}">${escapeHtml(item.cta)}</div>` : ""}
  </article>`;
}

function renderStatCard(item: PreviewItem, className: string, styleTokens?: StyleTokens) {
  return `<article class="${className}" style="${cardStyle(styleTokens)}">
    <div class="polishpilot-preview-stat-value" style="${headingStyle(styleTokens)}">${escapeHtml(item.value ?? item.title)}</div>
    <div class="polishpilot-preview-stat-label" style="${bodyStyle(styleTokens, true)}">${escapeHtml(item.value ? item.title : item.description ?? "")}</div>
  </article>`;
}

function renderIcon(styleTokens?: StyleTokens) {
  return `<div class="polishpilot-preview-icon-placeholder" style="${iconStyle(styleTokens)}">·</div>`;
}

function renderOutsideTextFallback(content: PreviewContent, styleTokens?: StyleTokens) {
  if (!content.outsideText.length || hasStructuredContent(content)) {
    return "";
  }

  return `<div class="polishpilot-preview-outside-text">
    ${content.outsideText
      .map((text) => `<p style="${bodyStyle(styleTokens, true)}">${escapeHtml(text)}</p>`)
      .join("\n")}
  </div>`;
}

function hasStructuredContent(content: PreviewContent) {
  return Boolean(
    content.sectionEyebrow ||
      content.sectionTitle ||
      content.sectionSubtitle ||
      content.items.length
  );
}

function patternGridClass(patternId: string) {
  if (patternId === "bento-grid") return "polishpilot-preview-bento-grid";
  if (patternId === "featured-side-stack") return "polishpilot-preview-featured-side-stack";
  if (patternId === "center-highlight") return "polishpilot-preview-center-highlight";
  if (patternId === "workflow-feature-grid" || patternId === "step-flow") return "polishpilot-preview-step-grid";
  if (patternId === "pricing-emphasis") return "polishpilot-preview-pricing-grid";
  if (patternId === "split-hero" || patternId === "split-cta") return "polishpilot-preview-split-grid";
  if (patternId === "hero-product-preview") return "polishpilot-preview-product-preview-grid";
  if (patternId === "form-benefits-sidebar") return "polishpilot-preview-form-grid";
  if (patternId === "metric-bento" || patternId === "hero-metric-support-stats") return "polishpilot-preview-metric-grid";
  return "polishpilot-preview-generic-grid";
}

function isFeaturedCard(index: number, patternId: string) {
  return (
    index === 0 &&
    [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "hero-product-preview",
      "metric-bento",
      "hero-metric-support-stats"
    ].includes(patternId)
  );
}

function countPreservedClasses(content: PreviewContent) {
  return [
    ...(content.rootClasses ?? []),
    ...(content.sectionTitleSourceClasses ?? []),
    ...(content.sectionSubtitleSourceClasses ?? []),
    ...content.items.flatMap((item) => [
      ...(item.sourceClasses ?? []),
      ...(item.titleSourceClasses ?? []),
      ...(item.textSourceClasses ?? []),
      ...(item.buttonSourceClasses ?? [])
    ])
  ].length;
}

function countGeneratedNodes(html: string) {
  return html.match(/<([a-z][a-z0-9-]*)\b/gi)?.length ?? 0;
}

function sectionStyle(tokens?: StyleTokens) {
  const sectionPadding = clampSpacing(tokens?.section.padding, "48px");

  return styleString({
    background: tokens?.section.background,
    color: tokens?.section.color,
    "font-family": tokens?.section.fontFamily,
    padding: sectionPadding,
    "--pp-section-bg": tokens?.section.background,
    "--pp-text": tokens?.heading.color ?? tokens?.section.color,
    "--pp-muted": tokens?.body.color,
    "--pp-card-bg": tokens?.card.background,
    "--pp-border": tokens?.card.borderColor,
    "--pp-radius": tokens?.card.borderRadius,
    "--pp-shadow": tokens?.card.boxShadow,
    "--pp-section-padding": sectionPadding,
    "--pp-accent-color": tokens?.accentColor
  });
}

function headingStyle(tokens?: StyleTokens) {
  return styleString({
    color: tokens?.heading.color,
    "font-family": tokens?.heading.fontFamily,
    "font-size": clampPx(tokens?.heading.fontSize, 24, 56, "36px"),
    "font-weight": tokens?.heading.fontWeight,
    "line-height": "1.08",
    "letter-spacing": tokens?.heading.letterSpacing
  });
}

function cardTitleStyle(tokens?: StyleTokens) {
  return styleString({
    color: tokens?.heading.color,
    "font-family": tokens?.heading.fontFamily,
    "font-size": clampPx(tokens?.body.fontSize ?? tokens?.heading.fontSize, 14, 22, "16px"),
    "font-weight": tokens?.heading.fontWeight
  });
}

function bodyStyle(tokens?: StyleTokens, muted = false) {
  return styleString({
    color: muted ? tokens?.muted.color ?? tokens?.body.color : tokens?.body.color,
    "font-size": clampPx(tokens?.body.fontSize, 12, 18, "14px"),
    "line-height": "1.45"
  });
}

function cardStyle(tokens?: StyleTokens, featured = false) {
  return styleString({
    background: tokens?.card.background,
    border: featured && tokens?.accentColor ? `1px solid ${tokens.accentColor}` : tokens?.card.border,
    "border-color": featured ? tokens?.accentColor ?? tokens?.card.borderColor : tokens?.card.borderColor,
    "border-radius": tokens?.card.borderRadius,
    "box-shadow": tokens?.card.boxShadow,
    padding: clampSpacing(tokens?.card.padding, "24px")
  });
}

function buttonStyle(tokens?: StyleTokens) {
  return styleString({
    background: tokens?.button.background ?? tokens?.accentColor,
    color: tokens?.button.color,
    border: tokens?.button.border,
    "border-radius": tokens?.button.borderRadius,
    padding: tokens?.button.padding,
    "font-weight": tokens?.button.fontWeight
  });
}

function accentStyle(tokens?: StyleTokens) {
  return styleString({
    color: tokens?.accentColor
  });
}

function iconStyle(tokens?: StyleTokens) {
  return styleString({
    color: tokens?.accentColor,
    "border-color": tokens?.accentColor
  });
}

function buildLayoutCss() {
  return `
.polishpilot-preview-root,
.polishpilot-preview-section {
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: var(--pp-section-padding, 48px);
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column;
  justify-content: center;
  position: relative !important;
  opacity: 1 !important;
  visibility: visible !important;
  background: var(--pp-section-bg, #ffffff);
  color: var(--pp-text, #111827);
}
.polishpilot-preview-header {
  max-width: 760px;
  margin-bottom: clamp(18px, 4%, 32px);
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}
.polishpilot-preview-heading,
.polishpilot-preview-subtitle,
.polishpilot-preview-card-title,
.polishpilot-preview-card-text,
.polishpilot-preview-outside-text p {
  margin: 0;
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}
.polishpilot-preview-subtitle {
  margin-top: 12px;
  max-width: 760px;
}
.polishpilot-preview-eyebrow,
.polishpilot-preview-card-eyebrow {
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 800;
  font-size: 12px;
}
.polishpilot-preview-grid {
  display: grid !important;
  gap: clamp(12px, 2.4%, 20px);
  min-height: 0;
}
.polishpilot-preview-card {
  min-width: 0;
  overflow: hidden !important;
  border-style: solid;
  border-width: 1px;
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  position: relative !important;
  background: var(--pp-card-bg, #ffffff);
  color: var(--pp-text, #111827);
  border-color: var(--pp-border, #e5e7eb);
  border-radius: var(--pp-radius, 16px);
  box-shadow: var(--pp-shadow, none);
}
.polishpilot-preview-card-title,
.polishpilot-preview-card-text,
.polishpilot-preview-stat-label,
.polishpilot-preview-outside-text p {
  overflow-wrap: anywhere;
}
.polishpilot-preview-card-text {
  margin-top: 10px;
}
.polishpilot-preview-card-cta,
.polishpilot-preview-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
}
.polishpilot-preview-badge {
  margin-top: 0;
  margin-bottom: 14px;
}
.polishpilot-preview-icon-placeholder {
  width: 36px;
  height: 36px;
  border: 2px solid var(--pp-accent-color, currentColor);
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  opacity: 0.75;
}
.polishpilot-preview-outside-text {
  display: grid;
  gap: 10px;
  margin-top: 28px;
  max-width: 820px;
}
.polishpilot-preview-bento-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.polishpilot-preview-bento-grid .polishpilot-preview-card-featured {
  grid-column: span 2;
  grid-row: span 2;
}
.polishpilot-preview-featured-side-stack,
.polishpilot-preview-metric-grid {
  grid-template-columns: 1.35fr 0.85fr;
}
.polishpilot-preview-featured-side-stack .polishpilot-preview-card:first-child,
.polishpilot-preview-metric-grid .polishpilot-preview-card:first-child {
  grid-row: span 2;
}
.polishpilot-preview-center-highlight {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.polishpilot-preview-center-highlight .polishpilot-preview-card:first-child {
  grid-column: 1 / -1;
  max-width: 78%;
  justify-self: center;
}
.polishpilot-preview-step-grid,
.polishpilot-preview-pricing-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.polishpilot-preview-split-grid,
.polishpilot-preview-form-grid,
.polishpilot-preview-product-preview-grid {
  grid-template-columns: 0.9fr 1.1fr;
  align-items: center;
}
.polishpilot-preview-generic-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.polishpilot-preview-price,
.polishpilot-preview-stat-value {
  margin-top: 16px;
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1;
  font-weight: 900;
}
.polishpilot-preview-stat-label {
  margin-top: 10px;
}
@media (max-width: 768px) {
  .polishpilot-preview-root,
  .polishpilot-preview-section {
    padding: 28px;
  }
  .polishpilot-preview-grid,
  .polishpilot-preview-bento-grid,
  .polishpilot-preview-featured-side-stack,
  .polishpilot-preview-center-highlight,
  .polishpilot-preview-step-grid,
  .polishpilot-preview-pricing-grid,
  .polishpilot-preview-split-grid,
  .polishpilot-preview-form-grid,
  .polishpilot-preview-product-preview-grid,
  .polishpilot-preview-metric-grid,
  .polishpilot-preview-generic-grid {
    grid-template-columns: 1fr;
  }
  .polishpilot-preview-bento-grid .polishpilot-preview-card-featured,
  .polishpilot-preview-center-highlight .polishpilot-preview-card:first-child {
    grid-column: auto;
    grid-row: auto;
    max-width: none;
  }
}`;
}

function clampPx(
  value: string | undefined,
  min: number,
  max: number,
  fallback: string
) {
  const numericValue = Number.parseFloat(value ?? "");

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return `${Math.max(min, Math.min(max, numericValue))}px`;
}

function clampSpacing(value: string | undefined, fallback: string) {
  const parts = value?.split(/\s+/).filter(Boolean);

  if (!parts?.length) {
    return fallback;
  }

  return parts
    .slice(0, 4)
    .map((part) => clampPx(part, 10, 36, fallback))
    .join(" ");
}

function classNames(...values: Array<string[] | string | undefined>) {
  return values
    .flatMap((value) => (Array.isArray(value) ? value : value ? value.split(/\s+/) : []))
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .map(escapeAttribute)
    .join(" ");
}

function styleString(values: Record<string, string | undefined>) {
  return Object.entries(values)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([property, value]) => `${property}: ${escapeStyleValue(value)};`)
    .join(" ");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function escapeStyleValue(value: string) {
  return value.replace(/[<>"']/g, "");
}
