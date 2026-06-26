import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as high-level anti-template design direction only. Preserve the user's product context, brand, and stack; do not copy exact text, themes, assets, logos, or token values.";

const HALLMARK_URL = "https://github.com/Nutlope/hallmark";
const SLOP_TEST_URL =
  "https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/references/slop-test.md";
const ANTI_PATTERNS_URL =
  "https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/references/anti-patterns.md";
const MACROSTRUCTURES_URL =
  "https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/references/macrostructures.md";
const MOTION_URL =
  "https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/references/motion.md";
const TYPOGRAPHY_URL =
  "https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/references/typography.md";

export const hallmarkDesignReferences: TemplateReference[] = [
  {
    id: "hallmark-slop-test-visual-gates",
    source: "hallmark",
    title: "Hallmark Visual Slop Gates",
    url: SLOP_TEST_URL,
    category: "other",
    tags: ["anti-slop", "visual-audit", "gradient", "cards", "hero", "motion"],
    keywords: [
      "generic-saas-composition",
      "gradient-overuse",
      "repetitive-equal-cards",
      "centered-stack-default",
      "redrawn-ui-chrome",
      "decorative-status-dots",
      "default-font-stack-template"
    ],
    description:
      "Visual audit direction for catching recognizable generated UI fingerprints: gradient hero text, centered full-viewport hero shape, equal feature grids, fake chrome, decorative dots, and motion without purpose.",
    author: "Nutlope/hallmark",
    relatedPatternIds: ["bento-grid", "featured-side-stack", "editorial-feature-stack"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/Nutlope/hallmark/main/skills/hallmark/references/slop-test.md"
  },
  {
    id: "hallmark-anti-template-feature-grid",
    source: "hallmark",
    title: "Anti-Template Feature Grid Direction",
    url: ANTI_PATTERNS_URL,
    category: "features",
    tags: ["features", "cards", "bento", "asymmetry", "icon-tiles"],
    keywords: [
      "icon-tile-feature-cards",
      "repetitive-equal-cards",
      "cards-too-equal",
      "feature-grid",
      "bento",
      "asymmetric"
    ],
    description:
      "Direction for replacing the default three-column icon-card grid with varied card sizes, inline icons, grouped hierarchy, or a workflow-shaped layout.",
    author: "Nutlope/hallmark",
    relatedPatternIds: ["bento-grid", "featured-side-stack", "workflow-feature-grid"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/Nutlope/hallmark/main/skills/hallmark/references/anti-patterns.md"
  },
  {
    id: "hallmark-macrostructure-routing",
    source: "hallmark",
    title: "Macrostructure Routing",
    url: MACROSTRUCTURES_URL,
    category: "cards",
    tags: ["macrostructure", "layout", "workflow", "proof", "dashboard"],
    keywords: [
      "macrostructure",
      "workflow",
      "quote-led",
      "feature-stack",
      "bento",
      "catalogue",
      "ecosystem-index",
      "dashboard"
    ],
    description:
      "Layout routing direction for picking a block structure from the content: bento for varied modules, quote-led for proof, narrative workflow for process, feature stack for product detail, and catalogue/index for inventory.",
    author: "Nutlope/hallmark",
    relatedPatternIds: [
      "bento-grid",
      "workflow-feature-grid",
      "featured-testimonial",
      "feature-tabs",
      "table-summary-rail"
    ],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/Nutlope/hallmark/main/skills/hallmark/references/macrostructures.md"
  },
  {
    id: "hallmark-motion-discipline",
    source: "hallmark",
    title: "Motion Discipline",
    url: MOTION_URL,
    category: "buttons",
    tags: ["motion", "microinteraction", "reduced-motion", "hover", "state"],
    keywords: [
      "motion",
      "missing_microinteraction",
      "transform-hover-overuse",
      "unbounded-sluggish-motion",
      "motion-reduced-accessibility-missing",
      "transition-all"
    ],
    description:
      "Motion direction for using one purposeful interaction layer, bounded durations, transform/opacity changes, and reduced-motion fallbacks instead of hover-scale and scroll-fade everywhere.",
    author: "Nutlope/hallmark",
    relatedPatternIds: ["split-cta", "compact-lead-form", "feature-tabs"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/Nutlope/hallmark/main/skills/hallmark/references/motion.md"
  },
  {
    id: "hallmark-typography-pairing",
    source: "hallmark",
    title: "Typography Pairing Direction",
    url: TYPOGRAPHY_URL,
    category: "other",
    tags: ["typography", "font-pairing", "type-scale", "brand", "labels"],
    keywords: [
      "default-font-stack-template",
      "weak-hierarchy",
      "uppercase-label-overuse",
      "cheap-section-meta-labels",
      "typography",
      "font-pairing"
    ],
    description:
      "Typography direction for avoiding one-font template pages: pair display and body roles, constrain mono/outlier usage, and define a clear type scale before styling cards or CTAs.",
    author: "Nutlope/hallmark",
    relatedPatternIds: ["editorial-feature-stack", "resource-card-grid", "settings-detail-pane"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/Nutlope/hallmark/main/skills/hallmark/references/typography.md"
  }
];
