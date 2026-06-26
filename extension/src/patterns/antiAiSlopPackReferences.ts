import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as high-level review/checklist direction only. Preserve the user's product facts and avoid authorship claims.";

const WEB_UI_URL =
  "https://github.com/ch040602/anti-ai-slop/blob/main/dimensions/web_ui_design.md";
const DASHBOARD_URL =
  "https://github.com/ch040602/anti-ai-slop/blob/main/dimensions/data_charts_dashboards.md";
const MARKETING_URL =
  "https://github.com/ch040602/anti-ai-slop/blob/main/dimensions/marketing_brand.md";

export const antiAiSlopPackReferences: TemplateReference[] = [
  {
    id: "anti-ai-slop-pack-web-ui-review",
    source: "anti-ai-slop-pack",
    title: "Web UI AI-Smell Review",
    url: WEB_UI_URL,
    category: "other",
    tags: ["web-ui", "ai-smell", "accessibility", "specificity", "anti-template"],
    keywords: [
      "generic-saas-composition",
      "decorative-status-dots",
      "default-font-stack-template",
      "icon-tile-feature-cards",
      "weak-primary-action",
      "fake-charts"
    ],
    description:
      "Review direction for checking whether UI choices reveal real state, hierarchy, action, and product meaning instead of modern-SaaS template polish.",
    author: "ch040602/anti-ai-slop",
    relatedPatternIds: ["featured-side-stack", "settings-detail-pane", "bento-grid"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/ch040602/anti-ai-slop/main/dimensions/web_ui_design.md"
  },
  {
    id: "anti-ai-slop-pack-dashboard-review",
    source: "anti-ai-slop-pack",
    title: "Dashboard Data Meaning Review",
    url: DASHBOARD_URL,
    category: "dashboard",
    tags: ["dashboard", "charts", "metrics", "data", "specificity"],
    keywords: [
      "dashboard",
      "charts",
      "fake-charts",
      "metric-card-grid-default",
      "placeholder-proof-copy",
      "data-hierarchy"
    ],
    description:
      "Dashboard direction for separating real decision-supporting data from decorative metric rows, placeholder charts, and unsourced proof numbers.",
    author: "ch040602/anti-ai-slop",
    relatedPatternIds: ["table-summary-rail", "analytics-overview", "metric-trend-grid"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/ch040602/anti-ai-slop/main/dimensions/data_charts_dashboards.md"
  },
  {
    id: "anti-ai-slop-pack-marketing-specificity",
    source: "anti-ai-slop-pack",
    title: "Marketing Specificity Review",
    url: MARKETING_URL,
    category: "cta",
    tags: ["marketing", "copywriting", "proof", "positioning", "cta"],
    keywords: [
      "fake-premium-copy",
      "placeholder-proof-copy",
      "ai-slop-phrase-tells",
      "weak-primary-action",
      "trust-signals"
    ],
    description:
      "Marketing review direction for replacing generic positioning, fake proof, stock metrics, and vague CTAs with product-specific claims and real evidence.",
    author: "ch040602/anti-ai-slop",
    relatedPatternIds: ["split-cta", "banner-cta", "pricing-faq-combo"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/ch040602/anti-ai-slop/main/dimensions/marketing_brand.md"
  }
];
