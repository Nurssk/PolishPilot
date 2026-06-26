import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as high-level anti-generic frontend direction only. Preserve the user's product context, brand, and stack; do not copy exact text, assets, logos, or token values.";

const TASTE_SKILL_URL =
  "https://github.com/tasteskill/tasteskill/blob/main/skills/taste-skill/SKILL.md";
const GPT_TASTE_URL =
  "https://github.com/tasteskill/tasteskill/blob/main/skills/gpt-tasteskill/SKILL.md";
const REDESIGN_SKILL_URL =
  "https://github.com/tasteskill/tasteskill/blob/main/skills/redesign-skill/SKILL.md";
const MINIMALIST_SKILL_URL =
  "https://github.com/tasteskill/tasteskill/blob/main/skills/minimalist-skill/SKILL.md";
const BRUTALIST_SKILL_URL =
  "https://github.com/tasteskill/tasteskill/blob/main/skills/brutalist-skill/SKILL.md";
const SOFT_SKILL_URL =
  "https://github.com/tasteskill/tasteskill/blob/main/skills/soft-skill/SKILL.md";

export const tasteSkillReferences: TemplateReference[] = [
  {
    id: "taste-design-dials-direction",
    source: "taste-skill",
    title: "Taste Skill Design Dials",
    url: TASTE_SKILL_URL,
    category: "other",
    tags: ["anti-slop", "design-direction", "variance", "motion", "density"],
    keywords: [
      "anti-slop",
      "generic-saas-composition",
      "centered-stack-default",
      "pure-black-surface",
      "arbitrary-z-index",
      "design-variance",
      "visual-density"
    ],
    description:
      "General direction for reading the product context first, then tuning layout variance, motion intensity, and visual density instead of defaulting to a generic SaaS look.",
    author: "tasteskill/tasteskill",
    relatedPatternIds: ["featured-side-stack", "bento-grid", "editorial-feature-stack"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/tasteskill/tasteskill/main/skills/taste-skill/SKILL.md"
  },
  {
    id: "taste-asymmetric-layout-direction",
    source: "taste-skill",
    title: "Anti-Center Layout Direction",
    url: TASTE_SKILL_URL,
    category: "features",
    tags: ["layout", "asymmetry", "cards", "anti-center", "feature-grid"],
    keywords: ["centered-stack-default", "cards-too-equal", "equal-grid", "three equal cards", "asymmetric"],
    description:
      "Layout direction for replacing centered/equal feature blocks with split, left-aligned, or asymmetric structures that create a stronger focal point.",
    author: "tasteskill/tasteskill",
    relatedPatternIds: ["featured-side-stack", "workflow-feature-grid", "bento-grid"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/tasteskill/tasteskill/main/skills/taste-skill/SKILL.md"
  },
  {
    id: "taste-redesign-audit-direction",
    source: "taste-skill",
    title: "Redesign Audit Direction",
    url: REDESIGN_SKILL_URL,
    category: "cards",
    tags: ["redesign", "audit", "generic-patterns", "hierarchy", "spacing"],
    keywords: [
      "repetitive-equal-cards",
      "weak-hierarchy",
      "overpadded-layout",
      "generic-saas-composition",
      "placeholder-dead-links",
      "missing-image-alt",
      "overwide-paragraph-measure",
      "layout"
    ],
    description:
      "Audit-first redesign guidance for finding generic typography, color, surface, layout, and card patterns before making targeted upgrades.",
    author: "tasteskill/tasteskill",
    relatedPatternIds: ["editorial-feature-stack", "resource-card-grid", "featured-side-stack"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/tasteskill/tasteskill/main/skills/redesign-skill/SKILL.md"
  },
  {
    id: "taste-gpt-bento-spacing-direction",
    source: "taste-skill",
    title: "Gapless Bento & Spacing Direction",
    url: GPT_TASTE_URL,
    category: "features",
    tags: ["bento", "spacing", "grid", "cards", "editorial"],
    keywords: ["bento", "gapless", "cards-too-equal", "no-visual-rhythm", "spacing"],
    description:
      "Direction for using fewer, more intentional cards with a mathematically filled grid, stronger spacing, and clear visual rhythm.",
    author: "tasteskill/tasteskill",
    relatedPatternIds: ["bento-grid", "featured-side-stack", "workflow-feature-grid"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/tasteskill/tasteskill/main/skills/gpt-tasteskill/SKILL.md"
  },
  {
    id: "taste-minimalist-direction",
    source: "taste-skill",
    title: "Minimalist UI Direction",
    url: MINIMALIST_SKILL_URL,
    category: "navigation",
    tags: ["minimal", "navigation", "typography", "restraint", "clarity"],
    keywords: ["navigation", "footer", "ai-nav-footer-template", "low-noise", "minimal"],
    description:
      "Restrained editorial/product UI direction for reducing generic link clusters, ornamental labels, heavy shadows, and default component decoration.",
    author: "tasteskill/tasteskill",
    relatedPatternIds: ["command-center-nav", "feature-tabs", "settings-detail-pane"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/tasteskill/tasteskill/main/skills/minimalist-skill/SKILL.md"
  },
  {
    id: "taste-brutalist-cta-direction",
    source: "taste-skill",
    title: "Brutalist CTA Direction",
    url: BRUTALIST_SKILL_URL,
    category: "cta",
    tags: ["cta", "brutalist", "contrast", "direct", "sharp"],
    keywords: ["cta", "weak-primary-action", "button-contrast", "direct", "primary-action"],
    description:
      "High-contrast CTA direction for blocks that need direct action clarity and stronger visual commitment instead of soft generic polish.",
    author: "tasteskill/tasteskill",
    relatedPatternIds: ["banner-cta", "split-cta", "demo-panel-cta"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/tasteskill/tasteskill/main/skills/brutalist-skill/SKILL.md"
  },
  {
    id: "taste-soft-premium-direction",
    source: "taste-skill",
    title: "Soft Premium Direction",
    url: SOFT_SKILL_URL,
    category: "other",
    tags: ["premium", "soft", "motion", "spacing", "polish"],
    keywords: ["premium", "soft", "microinteraction", "motion", "spacing", "brand"],
    description:
      "Premium visual direction for calmer spacing, softer contrast, and intentional motion when the product context calls for a warmer brand feel.",
    author: "tasteskill/tasteskill",
    relatedPatternIds: ["split-cta", "editorial-feature-stack", "hero-product-preview"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/tasteskill/tasteskill/main/skills/soft-skill/SKILL.md"
  }
];
