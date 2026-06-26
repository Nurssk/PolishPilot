import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const NNG_USAGE_NOTE =
  "Use as UX research-backed layout guidance only. Preserve the product's content and brand; apply the principle to the selected block instead of copying examples.";
const BAYMARD_USAGE_NOTE =
  "Use as ecommerce UX research-backed layout guidance only. Preserve business logic and content; apply the principle to reduce user effort and improve decision clarity.";

export const layoutGuidelineReferences: TemplateReference[] = [
  {
    id: "nng-visual-hierarchy-scale-contrast-grouping",
    source: "nng-ux-guidelines",
    title: "Visual Hierarchy Through Scale, Contrast, And Grouping",
    url: "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/",
    category: "features",
    tags: ["layout-guideline", "visual-hierarchy", "scale", "contrast", "grouping"],
    keywords: [
      "visual-hierarchy",
      "weak-hierarchy",
      "scale",
      "contrast",
      "grouping",
      "proximity",
      "too-many-equal-elements",
      "cards-too-equal"
    ],
    description:
      "NN/g frames visual hierarchy as the layout system that guides attention through importance, using scale, contrast, color, and grouping instead of treating every element equally.",
    relatedPatternIds: [
      "featured-side-stack",
      "center-highlight",
      "bento-grid",
      "metric-bento",
      "hero-product-preview"
    ],
    usageNote: NNG_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "nng-visual-design-scale-balance-contrast",
    source: "nng-ux-guidelines",
    title: "Scale, Balance, Contrast, And Gestalt Principles",
    url: "https://www.nngroup.com/articles/principles-visual-design/",
    category: "cards",
    tags: ["layout-guideline", "visual-design", "scale", "balance", "contrast", "gestalt"],
    keywords: [
      "visual-design",
      "balance",
      "contrast",
      "gestalt",
      "scale",
      "layout-principles",
      "flat-layout",
      "no-visual-rhythm"
    ],
    description:
      "NN/g's visual-design principles help turn generic blocks into readable compositions by using relative size, balance, contrast, and grouping as structural decisions.",
    relatedPatternIds: [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "comparison-matrix",
      "analytics-overview"
    ],
    usageNote: NNG_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "nng-text-scanning-layer-cake-spotted-patterns",
    source: "nng-ux-guidelines",
    title: "Design For Scanning Patterns",
    url: "https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/",
    category: "other",
    tags: ["layout-guideline", "scanning", "text-heavy", "headings", "bullets"],
    keywords: [
      "text-scanning",
      "f-pattern",
      "layer-cake",
      "spotted-pattern",
      "text-heavy",
      "headings",
      "bullets",
      "readability",
      "content-layout"
    ],
    description:
      "NN/g eyetracking research shows users scan text-heavy pages through patterns shaped by headings, bullets, emphasis, and task-relevant words; dense prose needs structure for fast parsing.",
    relatedPatternIds: [
      "editorial-feature-stack",
      "resource-card-grid",
      "faq-sidebar",
      "changelog-timeline",
      "form-faq-sidebar"
    ],
    usageNote: NNG_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "nng-form-label-grouping-single-column",
    source: "nng-ux-guidelines",
    title: "Form Labels, Grouping, And Single-Column Flow",
    url: "https://www.nngroup.com/articles/web-form-design/",
    category: "forms",
    tags: ["layout-guideline", "forms", "labels", "single-column", "grouping"],
    keywords: [
      "form",
      "forms",
      "label",
      "labels",
      "single-column",
      "field-grouping",
      "form-layout",
      "input",
      "accessibility"
    ],
    description:
      "NN/g recommends visible labels close to fields, grouped related inputs, logical sequencing, and a single-column flow for most forms to reduce reorientation.",
    relatedPatternIds: [
      "compact-lead-form",
      "form-benefits-sidebar",
      "two-step-form-layout",
      "profile-settings-form",
      "magic-link-panel"
    ],
    usageNote: NNG_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "nng-form-field-minimization-and-input-fit",
    source: "nng-ux-guidelines",
    title: "Minimize Fields And Match Input Shape",
    url: "https://www.nngroup.com/articles/web-form-design/",
    category: "forms",
    tags: ["layout-guideline", "forms", "field-minimization", "input-size", "conversion"],
    keywords: [
      "field-minimization",
      "too-many-fields",
      "input-size",
      "radio-buttons",
      "dropdown",
      "conversion",
      "lead-capture",
      "checkout"
    ],
    description:
      "NN/g form guidance emphasizes removing unnecessary questions and matching each control to the expected answer so users can complete the flow without avoidable effort.",
    relatedPatternIds: [
      "compact-lead-form",
      "two-step-form-layout",
      "checkout-summary-split",
      "split-auth-proof",
      "onboarding-checklist-form"
    ],
    usageNote: NNG_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "baymard-checkout-manageable-linear-transparent",
    source: "baymard-ux",
    title: "Checkout Should Feel Manageable, Linear, And Transparent",
    url: "https://baymard.com/learn/checkout-flow-ux-optimization",
    category: "forms",
    tags: ["layout-guideline", "checkout", "ecommerce", "form", "progress"],
    keywords: [
      "checkout",
      "cart",
      "payment",
      "order",
      "guest-checkout",
      "progress",
      "linear-flow",
      "perceived-effort",
      "transparent-flow"
    ],
    description:
      "Baymard's checkout guidance focuses on reducing perceived effort with a manageable flow, clear progress, guest-first entry, and fewer distractions during purchase.",
    relatedPatternIds: [
      "checkout-summary-split",
      "compact-lead-form",
      "two-step-form-layout",
      "form-benefits-sidebar",
      "product-detail-split"
    ],
    usageNote: BAYMARD_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "baymard-product-list-filter-sort-balance",
    source: "baymard-ux",
    title: "Product Lists Need Filters, Sorting, And Balanced Cards",
    url: "https://baymard.com/research/ecommerce-product-lists",
    category: "cards",
    tags: ["layout-guideline", "ecommerce", "product-list", "filters", "cards"],
    keywords: [
      "product-list",
      "catalog",
      "ecommerce",
      "filters",
      "sorting",
      "product-card",
      "marketplace",
      "comparison",
      "balanced-card"
    ],
    description:
      "Baymard product-list research points to the chain between clear filters, useful sorting, and balanced product card design so users can find and compare items.",
    relatedPatternIds: [
      "product-card-grid",
      "comparison-spec-table",
      "comparison-matrix",
      "product-detail-split",
      "resource-card-grid"
    ],
    usageNote: BAYMARD_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "baymard-product-detail-decision-support",
    source: "baymard-ux",
    title: "Product Detail Pages Need Decision Support",
    url: "https://baymard.com/research/product-page",
    category: "other",
    tags: ["layout-guideline", "ecommerce", "product-detail", "decision-support", "proof"],
    keywords: [
      "product-detail",
      "product-page",
      "buy",
      "purchase",
      "decision-support",
      "specs",
      "reviews",
      "trust",
      "comparison"
    ],
    description:
      "Baymard product-page research focuses on layouts that help users interpret product information, inspect details, compare alternatives, and make purchase decisions.",
    relatedPatternIds: [
      "product-detail-split",
      "comparison-spec-table",
      "case-study-split",
      "before-after-hero",
      "demo-panel-cta"
    ],
    usageNote: BAYMARD_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  }
];
