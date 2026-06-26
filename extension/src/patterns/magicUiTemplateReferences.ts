import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as source-parsed layout inspiration only. Do not copy template copy, assets, branding, or full sections; adapt the structure to the captured screen and existing design system.";

const DOCS_URL = "https://magicui.design/docs";
const TEMPLATE_URL = `${DOCS_URL}/templates`;
const SKILL_RECIPE_URL =
  "https://github.com/magicuidesign/magicui/blob/main/skills/magic-ui/references/recipes.md";
const REGISTRY_URL =
  "https://github.com/magicuidesign/magicui/blob/main/registry.json";

export const magicUiTemplateReferences: TemplateReference[] = [
  {
    id: "magic-ui-feature-bento-grid",
    source: "magic-ui",
    title: "Magic UI Bento Feature Grid",
    url: `${DOCS_URL}/components/bento-grid`,
    category: "features",
    tags: ["magic-ui", "bento-grid", "features", "feature-cards", "cards"],
    keywords: [
      "magic-ui",
      "bento",
      "bento-grid",
      "feature-cards",
      "cards_too_equal",
      "too_repetitive",
      "no_visual_rhythm",
      "product-capabilities"
    ],
    description:
      "Registry-backed direction for replacing equal feature cards with a bento grid that gives one or two capabilities more visual weight.",
    relatedPatternIds: ["bento-grid", "featured-side-stack", "workflow-feature-grid"],
    usageNote:
      `${USAGE_NOTE} Prefer the bento composition; avoid adding animated backgrounds or glow to every card.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: REGISTRY_URL
  },
  {
    id: "magic-ui-testimonial-logo-rail",
    source: "magic-ui",
    title: "Magic UI Marquee Trust Rail",
    url: `${DOCS_URL}/components/marquee`,
    category: "testimonials",
    tags: ["magic-ui", "marquee", "testimonials", "logos", "social-proof"],
    keywords: [
      "magic-ui",
      "marquee",
      "logo-rail",
      "logo-cloud",
      "testimonials",
      "reviews",
      "customers",
      "social-proof",
      "weak_trust_signals"
    ],
    description:
      "Source-parsed social-proof direction for logo strips, review rails, and short testimonial loops.",
    relatedPatternIds: ["testimonial-wall", "logo-cloud-quote", "featured-testimonial"],
    usageNote:
      `${USAGE_NOTE} Moving rails should carry short proof items only and need pause/reduced-motion behavior.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: SKILL_RECIPE_URL
  },
  {
    id: "magic-ui-pricing-saas-template",
    source: "magic-ui",
    title: "Magic UI SaaS Pricing Sections",
    url: `${TEMPLATE_URL}/saas`,
    category: "other",
    tags: ["magic-ui", "saas", "pricing", "plans", "credits", "faq"],
    keywords: [
      "magic-ui",
      "magic-ui-pricing",
      "saas-pricing",
      "subscription",
      "billing",
      "pricing-faq",
      "plan-comparison"
    ],
    description:
      "Template-level direction for pricing blocks inside SaaS pages: plans, FAQ, testimonial proof, and a clear CTA hierarchy.",
    relatedPatternIds: ["pricing-emphasis", "plan-comparison-table", "pricing-faq-combo"],
    usageNote:
      `${USAGE_NOTE} Use only the pricing composition cues; do not let generic hero copy drive pricing recommendations.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: REGISTRY_URL
  },
  {
    id: "magic-ui-devtool-workflow-template",
    source: "magic-ui",
    title: "Magic UI Developer Tool Workflow Template",
    url: `${TEMPLATE_URL}/devtool`,
    category: "dashboard",
    tags: ["magic-ui", "developer-tool", "workflow", "dashboard", "metrics"],
    keywords: [
      "magic-ui",
      "developer-tool",
      "workflow",
      "automation",
      "dashboard",
      "metrics",
      "kpi",
      "examples",
      "statistics",
      "activity"
    ],
    description:
      "Template-level direction for developer-tool/product screens that need workflow visualization, examples, stats, and feature hierarchy.",
    relatedPatternIds: ["analytics-overview", "metric-trend-grid", "activity-feed-sidebar"],
    usageNote:
      `${USAGE_NOTE} Favor concrete workflow and data hierarchy over decorative terminal/mockup chrome.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: REGISTRY_URL
  },
  {
    id: "magic-ui-cta-button-stack",
    source: "magic-ui",
    title: "Magic UI CTA Button Stack",
    url: `${DOCS_URL}/components/shiny-button`,
    category: "cta",
    tags: ["magic-ui", "cta", "button", "shiny-button", "microinteraction"],
    keywords: [
      "magic-ui",
      "cta",
      "button",
      "primary-action",
      "copy-button",
      "subscribe",
      "buy",
      "credits",
      "missing_microinteraction"
    ],
    description:
      "CTA direction from Magic UI button families for clear action feedback, purchase buttons, copy buttons, and subscribe states.",
    relatedPatternIds: ["split-cta", "banner-cta", "demo-panel-cta"],
    usageNote:
      `${USAGE_NOTE} Use one button treatment per action group; avoid rainbow/glow styles in utility or dashboard contexts.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: REGISTRY_URL
  },
  {
    id: "magic-ui-agent-landing-sections",
    source: "magic-ui",
    title: "Magic UI Agent Landing Sections",
    url: `${TEMPLATE_URL}/agent`,
    category: "features",
    tags: ["magic-ui", "agent", "landing-page", "features", "pricing", "cta"],
    keywords: [
      "magic-ui",
      "agent",
      "ai-agent",
      "landing-page",
      "features",
      "bento-grid",
      "testimonials",
      "pricing",
      "faq",
      "cta"
    ],
    description:
      "Template-level section map for AI-agent landing pages: hero, logos, feature bento, testimonials, pricing, FAQ, CTA, and footer.",
    relatedPatternIds: ["workflow-feature-grid", "bento-grid", "testimonial-wall", "pricing-emphasis"],
    usageNote:
      `${USAGE_NOTE} Treat this as a section-order reference only; Gemini's detected section type should decide which part is relevant.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: SKILL_RECIPE_URL
  },
  {
    id: "magic-ui-changelog-timeline",
    source: "magic-ui",
    title: "Magic UI Changelog Timeline",
    url: `${TEMPLATE_URL}/changelog`,
    category: "other",
    tags: ["magic-ui", "changelog", "timeline", "release-notes", "docs"],
    keywords: [
      "magic-ui",
      "changelog",
      "timeline",
      "release",
      "updates",
      "docs",
      "article",
      "resource",
      "release-notes"
    ],
    description:
      "Template-level direction for release notes and update timelines where chronology is more important than card repetition.",
    relatedPatternIds: ["changelog-timeline", "resource-card-grid", "editorial-feature-stack"],
    usageNote:
      `${USAGE_NOTE} Use timeline structure for dated updates; do not turn docs or changelogs into a hero redesign.`,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: REGISTRY_URL
  }
];
