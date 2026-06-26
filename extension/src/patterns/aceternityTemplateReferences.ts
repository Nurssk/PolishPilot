import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as source-parsed layout inspiration only. Do not copy Aceternity code, copy, assets, or branding; adapt the structure to the captured screen and current design system.";

const COMPONENTS_URL = "https://ui.aceternity.com/components";
const BLOCKS_URL = "https://ui.aceternity.com/blocks";

export const aceternityTemplateReferences: TemplateReference[] = [
  {
    id: "aceternity-feature-section-blocks",
    source: "aceternity-ui",
    title: "Aceternity Feature Sections",
    url: "https://ui.aceternity.com/blocks/feature-sections",
    category: "features",
    tags: ["aceternity-ui", "feature-sections", "bento", "cards", "product-capabilities"],
    keywords: [
      "aceternity-ui",
      "feature-sections",
      "feature-cards",
      "bento-grids",
      "cards_too_equal",
      "no_visual_rhythm",
      "product-capabilities"
    ],
    description:
      "Block-level source direction for feature sections ranging from bento grids to simpler product capability layouts.",
    relatedPatternIds: ["bento-grid", "featured-side-stack", "workflow-feature-grid"],
    usageNote:
      `${USAGE_NOTE} Prefer hierarchy and asymmetry; do not add heavy animated backgrounds to every feature card.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: COMPONENTS_URL
  },
  {
    id: "aceternity-bento-grid-blocks",
    source: "aceternity-ui",
    title: "Aceternity Bento Grids",
    url: "https://ui.aceternity.com/blocks/bento-grids",
    category: "cards",
    tags: ["aceternity-ui", "bento-grids", "feature-cards", "cards", "grid"],
    keywords: [
      "aceternity-ui",
      "bento",
      "bento-grid",
      "bento-grids",
      "card-grid",
      "cards_too_equal",
      "flat_layout"
    ],
    description:
      "Bento-grid block direction for breaking equal-card repetition with mixed-size cards and clearer visual rhythm.",
    relatedPatternIds: ["bento-grid", "center-highlight", "featured-side-stack"],
    usageNote:
      `${USAGE_NOTE} Keep card count and copy density tied to the detected content instead of copying a full marketing block.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: COMPONENTS_URL
  },
  {
    id: "aceternity-testimonial-logo-proof",
    source: "aceternity-ui",
    title: "Aceternity Testimonials And Logo Clouds",
    url: "https://ui.aceternity.com/blocks/testimonials",
    category: "testimonials",
    tags: ["aceternity-ui", "testimonials", "logo-clouds", "social-proof", "reviews"],
    keywords: [
      "aceternity-ui",
      "testimonials",
      "logo-clouds",
      "reviews",
      "customers",
      "social-proof",
      "weak_trust_signals"
    ],
    description:
      "Social-proof block direction for testimonial sections, logo clouds, and compact proof bands.",
    relatedPatternIds: ["testimonial-wall", "logo-cloud-quote", "featured-testimonial"],
    usageNote:
      `${USAGE_NOTE} Use real quotes/logos only; avoid moving proof rails for long or decision-critical testimonials.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: "https://ui.aceternity.com/blocks/logo-clouds"
  },
  {
    id: "aceternity-cta-section-blocks",
    source: "aceternity-ui",
    title: "Aceternity CTA Sections",
    url: "https://ui.aceternity.com/blocks/cta-sections",
    category: "cta",
    tags: ["aceternity-ui", "cta-sections", "cta", "buttons", "microinteractions"],
    keywords: [
      "aceternity-ui",
      "cta-sections",
      "cta",
      "primary-action",
      "buy-credits",
      "copy-button",
      "cta_not_clear",
      "missing_microinteraction"
    ],
    description:
      "CTA block direction for modern action sections with strong primary/secondary action hierarchy and subtle microinteractions.",
    relatedPatternIds: ["split-cta", "banner-cta", "demo-panel-cta"],
    usageNote:
      `${USAGE_NOTE} Keep the CTA compact and specific; do not turn unknown sections into hero recommendations.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: COMPONENTS_URL
  },
  {
    id: "aceternity-pricing-section-blocks",
    source: "aceternity-ui",
    title: "Aceternity Pricing Sections",
    url: "https://ui.aceternity.com/blocks/pricing-sections",
    category: "other",
    tags: ["aceternity-ui", "pricing-sections", "pricing", "plans", "credits"],
    keywords: [
      "aceternity-ui",
      "aceternity-pricing",
      "pricing-sections",
      "minimal-pricing",
      "plan-cards",
      "credits-pricing"
    ],
    description:
      "Pricing block direction for minimal plan sections when the captured content contains plan, credit, or billing context.",
    relatedPatternIds: ["pricing-emphasis", "plan-comparison-table", "two-tier-pricing-split"],
    usageNote:
      `${USAGE_NOTE} Source-gate this with explicit pricing or credit signals so generic card sections do not become pricing.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: COMPONENTS_URL
  },
  {
    id: "aceternity-auth-contact-forms",
    source: "aceternity-ui",
    title: "Aceternity Login, Signup, And Contact Sections",
    url: "https://ui.aceternity.com/blocks/login-and-signup-sections",
    category: "forms",
    tags: ["aceternity-ui", "login", "signup", "contact", "forms", "auth"],
    keywords: [
      "aceternity-ui",
      "login-and-signup",
      "signup-form",
      "contact-sections",
      "form",
      "auth",
      "input",
      "lead-capture"
    ],
    description:
      "Form block direction for login, signup, registration, contact, and lead-capture sections with restrained motion.",
    relatedPatternIds: ["split-auth-proof", "form-benefits-sidebar", "compact-lead-form"],
    usageNote:
      `${USAGE_NOTE} Keep labels, validation, loading, and error states explicit; do not hide required guidance in animation.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: "https://ui.aceternity.com/blocks/contact-sections"
  },
  {
    id: "aceternity-stats-empty-dashboard-blocks",
    source: "aceternity-ui",
    title: "Aceternity Stats And Empty States",
    url: "https://ui.aceternity.com/blocks/stats-sections",
    category: "dashboard",
    tags: ["aceternity-ui", "stats-sections", "empty-states", "dashboard", "metrics"],
    keywords: [
      "aceternity-ui",
      "stats-sections",
      "empty-states",
      "dashboard",
      "metrics",
      "kpi",
      "changelog",
      "state"
    ],
    description:
      "Dashboard-adjacent block direction for stats, changelog-style metrics, and empty states in product tools.",
    relatedPatternIds: ["metric-bento", "analytics-overview", "activity-feed-sidebar"],
    usageNote:
      `${USAGE_NOTE} Use real data hierarchy and empty-state actions; avoid decorative fake charts or placeholder proof.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: "https://ui.aceternity.com/blocks/empty-states"
  },
  {
    id: "aceternity-nav-sidebar-blocks",
    source: "aceternity-ui",
    title: "Aceternity Navbars And Sidebars",
    url: "https://ui.aceternity.com/blocks/navbars",
    category: "navigation",
    tags: ["aceternity-ui", "navbars", "sidebars", "navigation", "app-shell"],
    keywords: [
      "aceternity-ui",
      "navbars",
      "sidebars",
      "navigation",
      "app-shell",
      "menu",
      "header",
      "sidebar"
    ],
    description:
      "Navigation block direction for headers, responsive navbars, sidebars, and app-shell navigation states.",
    relatedPatternIds: ["mega-menu-topbar", "sidebar-app-shell", "command-center-nav"],
    usageNote:
      `${USAGE_NOTE} Navigation/footer detections should receive navigation cleanup, not hero or card redesign recommendations.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: "https://ui.aceternity.com/blocks/sidebars"
  },
  {
    id: "aceternity-component-catalog-index",
    source: "aceternity-ui",
    title: "Aceternity Component Catalog",
    url: COMPONENTS_URL,
    category: "other",
    tags: ["aceternity-ui", "component-catalog", "blocks", "templates", "motion"],
    keywords: [
      "aceternity-ui",
      "component-catalog",
      "component-index",
      "blocks",
      "templates",
      "framer-motion",
      "tailwind"
    ],
    description:
      "Catalog-level source index for choosing Aceternity sections by detected component family: features, bento, CTA, pricing, forms, stats, nav, footer, or proof.",
    relatedPatternIds: ["resource-card-grid", "bento-grid", "settings-detail-pane"],
    usageNote:
      `${USAGE_NOTE} Treat this as a lookup source for prompt construction, not as permission to add high-motion landing-page effects.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: BLOCKS_URL
  }
];
