import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as high-level design-system direction only. Preserve the user's brand, content, and implementation boundaries; do not copy exact text, assets, logos, or token values.";

export const typeUiDesignSkillReferences: TemplateReference[] = [
  {
    id: "typeui-bento-design-skill",
    source: "typeui-design-skills",
    title: "Bento Design Skill",
    url: "https://typeui.sh/design-skills/bento",
    category: "features",
    tags: ["bento", "features", "cards", "modular-grid", "hierarchy"],
    keywords: ["bento", "feature-grid", "cards-too-equal", "modular", "scannable"],
    description:
      "Modular grid direction for turning equal cards into varied blocks with clearer hierarchy and scan rhythm.",
    author: "typeui.sh",
    relatedPatternIds: ["bento-grid", "featured-side-stack", "workflow-feature-grid"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/bergside/awesome-design-skills/main/skills/bento/SKILL.md"
  },
  {
    id: "typeui-dashboard-design-skill",
    source: "typeui-design-skills",
    title: "Dashboard Design Skill",
    url: "https://typeui.sh/design-skills/dashboard",
    category: "dashboard",
    tags: ["dashboard", "metrics", "data", "productivity", "hierarchy"],
    keywords: ["dashboard", "metrics", "kpi", "data-summary", "metric-card-grid"],
    description:
      "Dashboard direction focused on modular grids, explicit states, and stronger data hierarchy for productivity views.",
    author: "typeui.sh",
    relatedPatternIds: ["metric-bento", "table-summary-rail", "settings-detail-pane"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/bergside/awesome-design-skills/main/skills/dashboard/SKILL.md"
  },
  {
    id: "typeui-application-design-skill",
    source: "typeui-design-skills",
    title: "Application Design Skill",
    url: "https://typeui.sh/design-skills/application",
    category: "settings",
    tags: ["application", "settings", "forms", "states", "workflow"],
    keywords: ["application", "settings", "form", "detail-pane", "workspace"],
    description:
      "Application UI direction for practical product screens with clear component states and workflow-oriented structure.",
    author: "typeui.sh",
    relatedPatternIds: ["settings-detail-pane", "profile-settings-form", "command-center-nav"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/bergside/awesome-design-skills/main/skills/application/SKILL.md"
  },
  {
    id: "typeui-enterprise-design-skill",
    source: "typeui-design-skills",
    title: "Enterprise Design Skill",
    url: "https://typeui.sh/design-skills/enterprise",
    category: "dashboard",
    tags: ["enterprise", "workflow", "data", "high-contrast", "structured"],
    keywords: ["enterprise", "workflow", "data-driven", "high-contrast", "automation"],
    description:
      "Enterprise direction for structured data-driven workflows with restrained contrast and durable component rules.",
    author: "typeui.sh",
    relatedPatternIds: ["table-summary-rail", "metric-bento", "kanban-board"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/bergside/awesome-design-skills/main/skills/enterprise/SKILL.md"
  },
  {
    id: "typeui-minimal-design-skill",
    source: "typeui-design-skills",
    title: "Minimal Design Skill",
    url: "https://typeui.sh/design-skills/minimal",
    category: "navigation",
    tags: ["minimal", "navigation", "clarity", "restraint", "focus"],
    keywords: ["minimal", "navigation", "footer", "low-noise", "clarity"],
    description:
      "Minimal direction for reducing generic link clusters and leaving only the information architecture that earns its place.",
    author: "typeui.sh",
    relatedPatternIds: ["command-center-nav", "feature-tabs", "settings-detail-pane"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/bergside/awesome-design-skills/main/skills/minimal/SKILL.md"
  },
  {
    id: "typeui-clean-design-skill",
    source: "typeui-design-skills",
    title: "Clean Design Skill",
    url: "https://typeui.sh/design-skills/clean",
    category: "forms",
    tags: ["clean", "forms", "accessibility", "labels", "states"],
    keywords: ["clean", "form", "input", "lead-capture", "accessibility"],
    description:
      "Clean form direction emphasizing explicit labels, visible states, accessible focus, and low-friction grouping.",
    author: "typeui.sh",
    relatedPatternIds: ["form-benefits-sidebar", "compact-lead-form", "two-step-form-layout"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/bergside/awesome-design-skills/main/skills/clean/SKILL.md"
  },
  {
    id: "typeui-editorial-design-skill",
    source: "typeui-design-skills",
    title: "Editorial Design Skill",
    url: "https://typeui.sh/design-skills/editorial",
    category: "cards",
    tags: ["editorial", "copy", "typography", "story", "sections"],
    keywords: ["editorial", "copywriting", "storytelling", "text-heavy", "typography"],
    description:
      "Editorial direction for text-heavy sections that need stronger reading rhythm, hierarchy, and purposeful spacing.",
    author: "typeui.sh",
    relatedPatternIds: ["editorial-feature-stack", "changelog-timeline", "featured-testimonial"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/bergside/awesome-design-skills/main/skills/editorial/SKILL.md"
  },
  {
    id: "typeui-brutalism-design-skill",
    source: "typeui-design-skills",
    title: "Brutalism Design Skill",
    url: "https://typeui.sh/design-skills/brutalism",
    category: "cta",
    tags: ["brutalism", "cta", "contrast", "direct", "bold"],
    keywords: ["brutalism", "cta", "conversion", "contrast", "direct-action"],
    description:
      "Direct, high-contrast CTA direction for blocks that need a stronger action and less decorative polish.",
    author: "typeui.sh",
    relatedPatternIds: ["banner-cta", "split-cta", "demo-panel-cta"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/bergside/awesome-design-skills/main/skills/brutalism/SKILL.md"
  },
  {
    id: "typeui-professional-design-skill",
    source: "typeui-design-skills",
    title: "Professional Design Skill",
    url: "https://typeui.sh/design-skills/professional",
    category: "pricing",
    tags: ["professional", "pricing", "comparison", "trust", "business"],
    keywords: ["professional", "pricing", "comparison", "plan", "trust"],
    description:
      "Professional comparison direction for pricing or plan sections that need clearer decision hierarchy and credible restraint.",
    author: "typeui.sh",
    relatedPatternIds: ["pricing-emphasis", "two-tier-pricing-split", "pricing-faq-combo"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/bergside/awesome-design-skills/main/skills/professional/SKILL.md"
  },
  {
    id: "typeui-refined-design-skill",
    source: "typeui-design-skills",
    title: "Refined Design Skill",
    url: "https://typeui.sh/design-skills/refined",
    category: "testimonials",
    tags: ["refined", "testimonials", "trust", "restraint", "proof"],
    keywords: ["refined", "testimonial", "social-proof", "trust", "quote"],
    description:
      "Refined trust-building direction for testimonials and proof sections that need restraint instead of generic quote cards.",
    author: "typeui.sh",
    relatedPatternIds: ["featured-testimonial", "testimonial-wall", "logo-cloud-quote"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/bergside/awesome-design-skills/main/skills/refined/SKILL.md"
  }
];
