import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as high-level HTML-native design direction only. Preserve the user's brand, content, and implementation boundaries; do not copy exact text, assets, logos, or token values.";

const DESIGN_STYLES_URL =
  "https://github.com/alchaincyf/huashu-design/blob/master/references/design-styles.md";
const CONTENT_GUIDELINES_URL =
  "https://github.com/alchaincyf/huashu-design/blob/master/references/content-guidelines.md";

export const huashuDesignReferences: TemplateReference[] = [
  {
    id: "huashu-asymmetric-card-grid-direction",
    source: "huashu-design",
    title: "Asymmetric Card Grid Direction",
    url: CONTENT_GUIDELINES_URL,
    category: "features",
    tags: ["features", "cards", "asymmetric", "hierarchy", "anti-slop"],
    keywords: ["cards-too-equal", "equal-grid", "no-visual-rhythm", "feature-grid", "bento-overuse"],
    description:
      "Direction for replacing equal card grids with varied emphasis, asymmetric rhythm, and one clear focal item.",
    author: "alchaincyf/huashu-design",
    relatedPatternIds: ["featured-side-stack", "bento-grid", "workflow-feature-grid"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/alchaincyf/huashu-design/master/references/content-guidelines.md"
  },
  {
    id: "huashu-editorial-typography-direction",
    source: "huashu-design",
    title: "Editorial Typography Direction",
    url: DESIGN_STYLES_URL,
    category: "cards",
    tags: ["editorial", "typography", "copy", "hierarchy", "reading-rhythm"],
    keywords: ["text-heavy", "weak-hierarchy", "copywriting", "long-copy", "content"],
    description:
      "Editorial direction for text-heavy blocks that need stronger type scale, spacing, and reading rhythm instead of more cards.",
    author: "alchaincyf/huashu-design",
    relatedPatternIds: ["editorial-feature-stack", "resource-card-grid", "changelog-timeline"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/alchaincyf/huashu-design/master/references/design-styles.md"
  },
  {
    id: "huashu-technical-dashboard-hairline-grid",
    source: "huashu-design",
    title: "Technical Dashboard Hairline Grid",
    url: DESIGN_STYLES_URL,
    category: "dashboard",
    tags: ["dashboard", "technical", "hairline-grid", "data", "restraint"],
    keywords: ["dashboard", "metrics", "kpi", "data", "blue-cyan-ai-dashboard", "metric-card-grid"],
    description:
      "Restrained technical dashboard direction using calm surfaces, hairline structure, and data hierarchy instead of glow-heavy cards.",
    author: "alchaincyf/huashu-design",
    relatedPatternIds: ["table-summary-rail", "analytics-overview", "metric-trend-grid"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/alchaincyf/huashu-design/master/references/design-styles.md"
  },
  {
    id: "huashu-refined-pricing-comparison",
    source: "huashu-design",
    title: "Refined Pricing Comparison Direction",
    url: DESIGN_STYLES_URL,
    category: "pricing",
    tags: ["pricing", "comparison", "plans", "decision-hierarchy", "restraint"],
    keywords: ["pricing", "credits", "plans", "comparison", "recommended-plan", "pricing-plan-weak-emphasis"],
    description:
      "Pricing direction focused on decision hierarchy, aligned comparison rows, and restrained proof instead of cloned plan cards.",
    author: "alchaincyf/huashu-design",
    relatedPatternIds: ["pricing-emphasis", "plan-comparison-table", "pricing-faq-combo"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/alchaincyf/huashu-design/master/references/design-styles.md"
  },
  {
    id: "huashu-direct-cta-brutalist-direction",
    source: "huashu-design",
    title: "Direct CTA Brutalist Direction",
    url: DESIGN_STYLES_URL,
    category: "cta",
    tags: ["cta", "brutalist", "contrast", "direct", "action"],
    keywords: ["cta", "primary-action", "weak-primary-action", "conversion", "contrast"],
    description:
      "Direct, high-contrast CTA direction for blocks where action clarity matters more than decorative polish.",
    author: "alchaincyf/huashu-design",
    relatedPatternIds: ["banner-cta", "split-cta", "demo-panel-cta"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/alchaincyf/huashu-design/master/references/design-styles.md"
  },
  {
    id: "huashu-minimal-ia-navigation-direction",
    source: "huashu-design",
    title: "Minimal IA Navigation Direction",
    url: CONTENT_GUIDELINES_URL,
    category: "navigation",
    tags: ["navigation", "footer", "ia", "minimal", "anti-template"],
    keywords: ["navigation", "footer", "link-cluster", "ai-nav-footer-template", "information-architecture"],
    description:
      "Navigation/footer direction that removes stock SaaS sitemap groups and keeps only destinations that earn their place.",
    author: "alchaincyf/huashu-design",
    relatedPatternIds: ["command-center-nav", "mega-menu-topbar", "footer-link-hub"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/alchaincyf/huashu-design/master/references/content-guidelines.md"
  }
];
