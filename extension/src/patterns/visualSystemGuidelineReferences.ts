import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const MATERIAL_USAGE_NOTE =
  "Use as Material Design visual-system guidance only. Apply the principle to hierarchy, color, type, or shape decisions without copying a Material UI surface verbatim.";
const CARBON_USAGE_NOTE =
  "Use as Carbon Design System guidance only. Translate the principle into the product's existing tokens and component system instead of importing Carbon styling.";
const APPLE_USAGE_NOTE =
  "Use as Apple HIG visual guidance only. Preserve the product's platform and brand while applying the legibility, adaptation, and semantic-color principle.";

export const visualSystemGuidelineReferences: TemplateReference[] = [
  {
    id: "material-color-roles-semantic-hierarchy",
    source: "material-design",
    title: "Color Roles For Semantic Hierarchy",
    url: "https://m3.material.io/styles/color/roles",
    category: "other",
    tags: ["visual-guideline", "color", "semantic-color", "hierarchy", "material"],
    keywords: [
      "visual-guideline",
      "material-design",
      "color-roles",
      "semantic-color",
      "color-system",
      "primary-secondary-tertiary",
      "gradient-overuse",
      "one-note-palette",
      "weak-hierarchy"
    ],
    description:
      "Material 3 color roles separate surfaces, primary actions, secondary accents, outlines, and semantic feedback so color communicates hierarchy instead of becoming decoration.",
    relatedPatternIds: [
      "banner-cta",
      "pricing-emphasis",
      "analytics-overview",
      "settings-detail-pane",
      "split-hero"
    ],
    usageNote: MATERIAL_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "material-typography-type-scale-roles",
    source: "material-design",
    title: "Type Scale Roles For Readable Hierarchy",
    url: "https://m3.material.io/styles/typography/type-scale-tokens",
    category: "other",
    tags: ["visual-guideline", "typography", "type-scale", "hierarchy", "material"],
    keywords: [
      "visual-guideline",
      "material-design",
      "type-scale",
      "typography",
      "display",
      "headline",
      "title",
      "body",
      "label",
      "default-font-stack-template",
      "weak-hierarchy"
    ],
    description:
      "Material's type scale defines display, headline, title, body, and label roles so typography maps to content purpose rather than arbitrary font-size jumps.",
    relatedPatternIds: [
      "editorial-feature-stack",
      "center-highlight",
      "metric-bento",
      "form-benefits-sidebar",
      "hero-product-preview"
    ],
    usageNote: MATERIAL_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "material-shape-corner-scale",
    source: "material-design",
    title: "Shape Scale For Intentional Corners",
    url: "https://m3.material.io/styles/shape/shape-scale-tokens",
    category: "cards",
    tags: ["visual-guideline", "shape", "corner-radius", "cards", "buttons"],
    keywords: [
      "visual-guideline",
      "material-design",
      "shape-scale",
      "corner-radius",
      "rounded-corners",
      "oversized-radius",
      "pill-overload",
      "cards",
      "buttons",
      "surface-shape"
    ],
    description:
      "Material shape guidance uses a scale of corner treatments so surfaces, cards, and controls have intentional shape roles instead of every object using the same large radius.",
    relatedPatternIds: [
      "bento-grid",
      "pricing-emphasis",
      "resource-card-grid",
      "compact-lead-form",
      "settings-detail-pane"
    ],
    usageNote: MATERIAL_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "carbon-color-token-system",
    source: "carbon-design-system",
    title: "Tokenized Color System",
    url: "https://carbondesignsystem.com/elements/color/overview/",
    category: "dashboard",
    tags: ["visual-guideline", "color", "tokens", "theme", "carbon"],
    keywords: [
      "visual-guideline",
      "carbon-design-system",
      "color-tokens",
      "tokenized-color",
      "theme",
      "light-dark",
      "hard-coded-colors",
      "semantic-color",
      "design-system",
      "inconsistent-color"
    ],
    description:
      "Carbon organizes color through tokens and themes so product UI can adapt across light/dark contexts, states, and surfaces without hard-coded decorative color choices.",
    relatedPatternIds: [
      "analytics-overview",
      "table-summary-rail",
      "settings-detail-pane",
      "sidebar-app-shell",
      "metric-trend-grid"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "carbon-spacing-2x-grid-scale",
    source: "carbon-design-system",
    title: "2x Grid Spacing Scale",
    url: "https://carbondesignsystem.com/elements/spacing/overview/",
    category: "dashboard",
    tags: ["visual-guideline", "spacing", "grid", "density", "carbon"],
    keywords: [
      "visual-guideline",
      "carbon-design-system",
      "spacing-scale",
      "2x-grid",
      "whitespace",
      "density",
      "spacing-issue",
      "inconsistent-spacing",
      "crowded",
      "layout-rhythm"
    ],
    description:
      "Carbon's spacing scale and 2x grid create consistent rhythm between components, helping dense dashboards and repeated cards avoid arbitrary gaps or cramped grouping.",
    relatedPatternIds: [
      "analytics-overview",
      "table-summary-rail",
      "bento-grid",
      "settings-detail-pane",
      "metric-bento"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "carbon-typography-productive-expressive",
    source: "carbon-design-system",
    title: "Productive And Expressive Typography",
    url: "https://carbondesignsystem.com/elements/typography/overview/",
    category: "dashboard",
    tags: ["visual-guideline", "typography", "product-ui", "hierarchy", "carbon"],
    keywords: [
      "visual-guideline",
      "carbon-design-system",
      "typography",
      "productive-type",
      "expressive-type",
      "product-ui",
      "dashboard",
      "default-font-stack-template",
      "weak-hierarchy",
      "label-hierarchy"
    ],
    description:
      "Carbon distinguishes productive type for task-focused UI from expressive type for editorial moments, preventing dashboard labels and marketing headings from sharing one generic scale.",
    relatedPatternIds: [
      "analytics-overview",
      "settings-detail-pane",
      "table-summary-rail",
      "editorial-feature-stack",
      "center-highlight"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "apple-hig-color-adaptive-semantic",
    source: "apple-hig",
    title: "Adaptive Semantic Color",
    url: "https://developer.apple.com/design/human-interface-guidelines/color",
    category: "other",
    tags: ["visual-guideline", "color", "semantic-color", "contrast", "apple"],
    keywords: [
      "visual-guideline",
      "apple-hig",
      "semantic-color",
      "adaptive-color",
      "dark-mode",
      "contrast",
      "color-alone",
      "brand-color",
      "accessibility",
      "one-note-palette"
    ],
    description:
      "Apple's color guidance emphasizes semantic meaning, contrast, dark-mode adaptation, and avoiding color as the only communicator of state.",
    relatedPatternIds: [
      "compact-lead-form",
      "settings-detail-pane",
      "banner-cta",
      "analytics-overview",
      "pricing-emphasis"
    ],
    usageNote: APPLE_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "apple-hig-typography-legibility-dynamic-type",
    source: "apple-hig",
    title: "Legible Typography And Dynamic Type",
    url: "https://developer.apple.com/design/human-interface-guidelines/typography",
    category: "other",
    tags: ["visual-guideline", "typography", "legibility", "dynamic-type", "apple"],
    keywords: [
      "visual-guideline",
      "apple-hig",
      "typography",
      "legibility",
      "dynamic-type",
      "line-height",
      "text-heavy",
      "readability",
      "weak-hierarchy",
      "accessibility"
    ],
    description:
      "Apple typography guidance centers legibility, clear hierarchy, and adaptability, making it useful for dense text blocks, form copy, and UI labels.",
    relatedPatternIds: [
      "editorial-feature-stack",
      "form-benefits-sidebar",
      "faq-sidebar",
      "settings-detail-pane",
      "resource-card-grid"
    ],
    usageNote: APPLE_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  }
];
