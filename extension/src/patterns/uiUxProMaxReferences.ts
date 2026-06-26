import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as high-level UI/UX guidance only. Preserve the user's product context and do not copy exact text, assets, logos, or generated palette values.";

const UX_GUIDELINES_URL =
  "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/data/ux-guidelines.csv";
const CHARTS_URL =
  "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/data/charts.csv";
const LANDING_URL =
  "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/data/landing.csv";
const STYLES_URL =
  "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/data/styles.csv";

export const uiUxProMaxReferences: TemplateReference[] = [
  {
    id: "uupm-accessible-form-checklist",
    source: "ui-ux-pro-max",
    title: "Accessible Form UX Checklist",
    url: UX_GUIDELINES_URL,
    category: "forms",
    tags: ["forms", "accessibility", "labels", "errors", "mobile"],
    keywords: ["form", "input", "label", "placeholder-only", "error-feedback", "lead-capture"],
    description:
      "Form direction focused on visible labels, error placement, submit feedback, autofill, mobile keyboards, and touch-friendly controls.",
    author: "nextlevelbuilder/ui-ux-pro-max-skill",
    relatedPatternIds: ["form-benefits-sidebar", "compact-lead-form", "two-step-form-layout"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/ux-guidelines.csv"
  },
  {
    id: "uupm-accessible-interaction-checklist",
    source: "ui-ux-pro-max",
    title: "Accessible Interaction Checklist",
    url: UX_GUIDELINES_URL,
    category: "buttons",
    tags: ["buttons", "accessibility", "touch-targets", "focus", "keyboard"],
    keywords: ["touch-target", "44x44", "focus-state", "icon-button", "keyboard", "aria-label"],
    description:
      "Interaction direction for comfortable touch targets, visible focus states, accessible icon controls, and clear loading/disabled feedback.",
    author: "nextlevelbuilder/ui-ux-pro-max-skill",
    relatedPatternIds: ["split-cta", "banner-cta", "compact-lead-form"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/ux-guidelines.csv"
  },
  {
    id: "uupm-dashboard-chart-selection",
    source: "ui-ux-pro-max",
    title: "Dashboard Chart Selection",
    url: CHARTS_URL,
    category: "dashboard",
    tags: ["dashboard", "charts", "analytics", "data", "comparison"],
    keywords: ["dashboard", "chart", "metrics", "kpi", "analytics", "comparison", "data-summary"],
    description:
      "Dashboard direction for choosing chart types and information density based on the decision the user needs to make.",
    author: "nextlevelbuilder/ui-ux-pro-max-skill",
    relatedPatternIds: ["analytics-overview", "table-summary-rail", "metric-trend-grid"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/charts.csv"
  },
  {
    id: "uupm-pricing-conversion-pattern",
    source: "ui-ux-pro-max",
    title: "Pricing Conversion Pattern",
    url: LANDING_URL,
    category: "pricing",
    tags: ["pricing", "conversion", "plans", "faq", "comparison"],
    keywords: ["pricing", "plans", "credits", "comparison", "faq", "recommended-plan", "annual-discount"],
    description:
      "Pricing direction for plan hierarchy, comparison tables, FAQ objection handling, and repeated but non-competing CTAs.",
    author: "nextlevelbuilder/ui-ux-pro-max-skill",
    relatedPatternIds: ["pricing-emphasis", "plan-comparison-table", "pricing-faq-combo"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/landing.csv"
  },
  {
    id: "uupm-interactive-product-demo-pattern",
    source: "ui-ux-pro-max",
    title: "Interactive Product Demo Pattern",
    url: LANDING_URL,
    category: "hero",
    tags: ["hero", "product-demo", "interactive", "preview", "software"],
    keywords: ["demo", "product-preview", "interactive", "mockup", "video", "software", "show-dont-tell"],
    description:
      "Landing direction for replacing abstract hero visuals with a product demo, preview, or interaction-first proof of value.",
    author: "nextlevelbuilder/ui-ux-pro-max-skill",
    relatedPatternIds: ["hero-product-preview", "demo-steps-hero", "hero-video-demo"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/landing.csv"
  },
  {
    id: "uupm-accessible-ethical-style",
    source: "ui-ux-pro-max",
    title: "Accessible & Ethical Style Direction",
    url: STYLES_URL,
    category: "other",
    tags: ["accessibility", "contrast", "semantic", "reduced-motion", "inclusive"],
    keywords: ["accessible", "contrast", "wcag", "semantic-html", "reduced-motion", "touch-target"],
    description:
      "Style direction for public, healthcare, education, and broad-audience interfaces that need high contrast, semantic HTML, and reduced-motion support.",
    author: "nextlevelbuilder/ui-ux-pro-max-skill",
    relatedPatternIds: ["settings-detail-pane", "form-benefits-sidebar", "table-summary-rail"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/styles.csv"
  }
];
