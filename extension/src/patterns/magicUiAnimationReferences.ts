import type { AnimationReference } from "./animationReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as source-parsed motion direction only. Respect Magic UI's license and registry install flow; choose one purposeful motion layer and include reduced-motion behavior.";

const DOCS_URL = "https://magicui.design/docs";
const REGISTRY_URL =
  "https://github.com/magicuidesign/magicui/blob/main/registry.json";
const COMPONENT_REF_URL =
  "https://github.com/magicuidesign/magicui/blob/main/skills/magic-ui/references/components.md";

export const magicUiAnimationReferences: AnimationReference[] = [
  {
    id: "magic-ui-magic-card-hover",
    source: "magic-ui",
    title: "Magic Card Hover Spotlight",
    url: `${DOCS_URL}/components/magic-card`,
    category: "card",
    tags: ["magic-ui", "magic-card", "card", "hover", "spotlight"],
    keywords: ["magic-ui", "magic-card", "spotlight", "hover", "cards_too_equal", "feature-cards"],
    description:
      "Hover spotlight direction for giving one featured card clearer affordance without making every card equally loud.",
    dependencies: ["motion"],
    framework: "react",
    bestFor:
      "Featured feature cards, pricing plan emphasis, resource cards, and card groups that need restrained hover feedback.",
    avoidWhen:
      "Avoid on dense dashboards, tables, or glow-heavy UI where hover light competes with data readability.",
    solvesProblems: ["cards_too_equal", "missing_microinteraction", "weak_hierarchy"],
    relatedSectionTypes: ["features", "cards", "pricing"],
    relatedPatternIds: ["featured-side-stack", "bento-grid", "pricing-emphasis"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "magic-ui-marquee-proof-motion",
    source: "magic-ui",
    title: "Marquee Proof Rail",
    url: `${DOCS_URL}/components/marquee`,
    category: "scroll",
    tags: ["magic-ui", "marquee", "logos", "testimonials", "social-proof"],
    keywords: ["magic-ui", "marquee", "logos", "testimonials", "reviews", "customers", "social-proof"],
    description:
      "Infinite rail direction for compact social proof: logos, review snippets, avatars, or customer outcomes.",
    framework: "react",
    bestFor:
      "Logo strips, testimonial rails, social proof bands, and compact repeated proof items.",
    avoidWhen:
      "Avoid auto-scrolling long testimonials, pricing details, or any decision-critical content without pause controls.",
    solvesProblems: ["weak_trust_signals", "too_repetitive", "missing_microinteraction"],
    relatedSectionTypes: ["testimonials", "cta", "features"],
    relatedPatternIds: ["testimonial-wall", "logo-cloud-quote", "banner-cta"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "magic-ui-number-ticker-metrics",
    source: "magic-ui",
    title: "Number Ticker Metrics",
    url: `${DOCS_URL}/components/number-ticker`,
    category: "text",
    tags: ["magic-ui", "number-ticker", "stats", "pricing", "metrics"],
    keywords: ["magic-ui", "number-ticker", "number", "credits", "price", "pricing", "stats", "kpi", "metrics"],
    description:
      "Animated number direction for real values such as credit balances, prices, KPI deltas, usage counts, and stats.",
    dependencies: ["motion"],
    framework: "react",
    bestFor:
      "Credit counters, pricing amount changes, dashboard KPIs, usage meters, and stats sections with real numeric state.",
    avoidWhen:
      "Avoid animating invented proof metrics or static marketing percentages with no source of truth.",
    solvesProblems: ["weak_hierarchy", "missing_microinteraction", "weak_trust_signals"],
    relatedSectionTypes: ["pricing", "stats", "dashboard"],
    relatedPatternIds: ["pricing-emphasis", "metric-bento", "metric-trend-grid"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "magic-ui-animated-list-activity",
    source: "magic-ui",
    title: "Animated List Activity Feed",
    url: `${DOCS_URL}/components/animated-list`,
    category: "list",
    tags: ["magic-ui", "animated-list", "activity", "notifications", "events"],
    keywords: ["magic-ui", "animated-list", "notifications", "events", "activity-feed", "dashboard", "list"],
    description:
      "Sequenced list direction for activity feeds, notification stacks, recent events, and workflow updates.",
    dependencies: ["motion"],
    framework: "react",
    bestFor:
      "Dashboard activity feeds, onboarding checklists, workflow event lists, and notification previews.",
    avoidWhen:
      "Avoid if rows need immediate comparison or if list animation causes scanning delay.",
    solvesProblems: ["flat_layout", "missing_microinteraction", "no_visual_rhythm"],
    relatedSectionTypes: ["dashboard", "cards", "unknown"],
    relatedPatternIds: ["activity-feed-sidebar", "settings-detail-pane", "table-summary-rail"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "magic-ui-animated-beam-integration",
    source: "magic-ui",
    title: "Animated Beam Integration Diagram",
    url: `${DOCS_URL}/components/animated-beam`,
    category: "transition",
    tags: ["magic-ui", "animated-beam", "workflow", "integrations", "diagram"],
    keywords: ["magic-ui", "animated-beam", "beam", "integration", "integrations", "workflow", "diagram", "tools"],
    description:
      "Path animation direction for showing how integrations, automations, or workflow steps connect.",
    dependencies: ["motion"],
    framework: "react",
    bestFor:
      "Integration diagrams, automation workflows, agent/tool routing visuals, and process explanation blocks.",
    avoidWhen:
      "Avoid as pure decoration or when the connection path does not represent a real product relationship.",
    solvesProblems: ["weak_hierarchy", "no_visual_rhythm", "missing_microinteraction"],
    relatedSectionTypes: ["features", "hero", "dashboard"],
    relatedPatternIds: ["workflow-feature-grid", "integration-logo-grid", "demo-steps-hero"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "magic-ui-button-feedback",
    source: "magic-ui",
    title: "Button Feedback Set",
    url: `${DOCS_URL}/components/shiny-button`,
    category: "button",
    tags: ["magic-ui", "button", "shiny-button", "ripple-button", "subscribe"],
    keywords: ["magic-ui", "button", "shiny-button", "ripple-button", "subscribe", "copy-button", "buy-credits", "cta"],
    description:
      "Small CTA/button feedback direction for primary actions, buy-credit buttons, copy prompt controls, and subscribe states.",
    dependencies: ["motion"],
    framework: "react",
    bestFor:
      "Primary CTA, buy more credits, copy prompt, generate preview, subscribe, and form submit buttons.",
    avoidWhen:
      "Avoid rainbow or pulsating treatments in quiet product tools; keep motion stateful and brief.",
    solvesProblems: ["cta_not_clear", "missing_microinteraction"],
    relatedSectionTypes: ["pricing", "cta", "form", "hero"],
    relatedPatternIds: ["pricing-emphasis", "banner-cta", "compact-lead-form"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "magic-ui-blur-fade-text-reveal",
    source: "magic-ui",
    title: "Blur Fade / Text Reveal",
    url: `${DOCS_URL}/components/blur-fade`,
    category: "text",
    tags: ["magic-ui", "blur-fade", "text-reveal", "stagger", "copy"],
    keywords: ["magic-ui", "blur-fade", "text-reveal", "stagger", "headline", "copy", "too_text_heavy"],
    description:
      "Text reveal direction for short headings, labels, and grouped content where the motion should clarify reading order.",
    dependencies: ["motion"],
    framework: "react",
    bestFor:
      "Short headings, compact body copy, step labels, and grouped cards that need a calm reveal rhythm.",
    avoidWhen:
      "Avoid on long paragraphs, legal copy, nav/footer links, or text that must be immediately readable.",
    solvesProblems: ["too_text_heavy", "no_visual_rhythm", "missing_microinteraction"],
    relatedSectionTypes: ["features", "cards", "cta", "unknown"],
    relatedPatternIds: ["workflow-feature-grid", "featured-side-stack", "split-cta"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "magic-ui-component-index",
    source: "magic-ui",
    title: "Magic UI Registry Index",
    url: REGISTRY_URL,
    category: "other",
    tags: ["magic-ui", "registry", "component-index", "shadcn", "motion"],
    keywords: ["magic-ui", "registry", "component-index", "shadcn", "motion", "tailwind", "animated-components"],
    description:
      "Registry index direction for choosing Magic UI components by job: bento layout, proof rail, metric ticker, activity list, beam diagram, button feedback, or text reveal.",
    dependencies: ["motion", "tailwindcss", "shadcn"],
    framework: "react",
    bestFor:
      "Prompt construction when the AI detects a component family but needs a source-backed recommendation.",
    avoidWhen:
      "Avoid adding broad landing-page effects just because the registry has them; tie each component to a detected block.",
    solvesProblems: ["missing_microinteraction", "unknown"],
    relatedSectionTypes: ["unknown", "features", "cards", "dashboard"],
    relatedPatternIds: ["bento-grid", "activity-feed-sidebar", "resource-card-grid"],
    usageNote: `${USAGE_NOTE} Component selection heuristics are summarized at ${COMPONENT_REF_URL}.`,
    scrapedAt: SCRAPED_AT
  }
];
