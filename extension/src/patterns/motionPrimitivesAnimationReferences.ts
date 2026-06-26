import type { AnimationReference } from "./animationReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as motion inspiration and implementation direction only. Respect the source license; do not copy code blindly, and adapt timing/easing to the product context.";

const DOCS_URL = "https://motion-primitives.com/docs";
const GITHUB_DOCS_URL =
  "https://github.com/ibelick/motion-primitives/tree/main/app/docs";
const CORE_URL =
  "https://github.com/ibelick/motion-primitives/tree/main/components/core";

export const motionPrimitivesAnimationReferences: AnimationReference[] = [
  {
    id: "motion-primitives-animated-group",
    source: "motion-primitives",
    title: "Animated Group / Staggered Reveal",
    url: `${DOCS_URL}/animated-group`,
    category: "list",
    tags: ["stagger", "cards", "list", "reveal", "motion"],
    keywords: ["animated-group", "stagger", "cards_too_equal", "no_visual_rhythm", "feature-cards"],
    description:
      "Staggered group reveal direction for cards, lists, and workflow steps where a single entrance rhythm should clarify grouping without animating every element independently.",
    dependencies: ["motion/react", "tailwindcss"],
    framework: "react",
    bestFor:
      "Feature grids, workflow cards, testimonial lists, and dashboard widgets that need grouped entrance rhythm.",
    avoidWhen:
      "Avoid for dense app screens that load frequently, or when reduced-motion users should see static content immediately.",
    solvesProblems: ["flat_layout", "too_repetitive", "cards_too_equal", "no_visual_rhythm", "missing_microinteraction"],
    relatedSectionTypes: ["features", "cards", "testimonials", "dashboard"],
    relatedPatternIds: ["bento-grid", "featured-side-stack", "workflow-feature-grid", "testimonial-wall"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "motion-primitives-animated-number",
    source: "motion-primitives",
    title: "Animated Number",
    url: `${DOCS_URL}/animated-number`,
    category: "text",
    tags: ["number", "stats", "pricing", "metrics", "counter"],
    keywords: ["animated-number", "sliding-number", "stats", "metrics", "pricing", "credits", "kpi"],
    description:
      "Number transition direction for real metrics, pricing amounts, credits, balances, or dashboard KPIs where value change is meaningful.",
    dependencies: ["motion/react"],
    framework: "react",
    bestFor:
      "Pricing toggles, credit balances, dashboard metrics, KPI deltas, and stats sections with real numeric state.",
    avoidWhen:
      "Avoid for fabricated proof metrics, static marketing numbers, or decorative percentages with no data source.",
    solvesProblems: ["weak_hierarchy", "missing_microinteraction", "weak_trust_signals"],
    relatedSectionTypes: ["pricing", "stats", "dashboard"],
    relatedPatternIds: ["pricing-emphasis", "metric-trend-grid", "analytics-overview"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "motion-primitives-transition-panel",
    source: "motion-primitives",
    title: "Transition Panel",
    url: `${DOCS_URL}/transition-panel`,
    category: "transition",
    tags: ["panel", "tabs", "state", "view-transition", "layout"],
    keywords: ["transition-panel", "tabs", "settings", "dashboard", "state-transition", "panel"],
    description:
      "Panel transition direction for switching between selected layouts, settings panes, pricing intervals, or recommendation tabs inside one screen.",
    dependencies: ["motion/react"],
    framework: "react",
    bestFor:
      "Settings/detail panes, recommendation tabs, pricing monthly/yearly toggles, and dashboard state changes.",
    avoidWhen:
      "Avoid if the transition hides important state changes or causes layout shift in dense data tables.",
    solvesProblems: ["flat_layout", "missing_microinteraction", "spacing_issue"],
    relatedSectionTypes: ["dashboard", "pricing", "cards", "unknown"],
    relatedPatternIds: ["settings-detail-pane", "feature-tabs", "pricing-emphasis"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "motion-primitives-morphing-dialog",
    source: "motion-primitives",
    title: "Morphing Dialog / Popover",
    url: `${DOCS_URL}/morphing-dialog`,
    category: "transition",
    tags: ["dialog", "popover", "preview", "details", "shared-layout"],
    keywords: ["morphing-dialog", "morphing-popover", "preview", "details", "modal", "shared-layout"],
    description:
      "Shared-layout modal/popover direction for expanding a card, preview, or recommendation into a focused detail surface without opening a new page.",
    dependencies: ["motion/react"],
    framework: "react",
    bestFor:
      "Recommendation detail views, template previews, card expansion, image/product detail, and single-window drill-down flows.",
    avoidWhen:
      "Avoid for destructive confirmations, legal modals, or flows that need explicit non-animated state changes.",
    solvesProblems: ["flat_layout", "missing_microinteraction", "weak_hierarchy"],
    relatedSectionTypes: ["cards", "features", "dashboard", "unknown"],
    relatedPatternIds: ["resource-card-grid", "settings-detail-pane", "table-summary-rail"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "motion-primitives-image-comparison",
    source: "motion-primitives",
    title: "Image Comparison",
    url: `${DOCS_URL}/image-comparison`,
    category: "image",
    tags: ["image", "before-after", "comparison", "slider", "proof"],
    keywords: ["image-comparison", "before-after", "comparison", "proof", "product-preview"],
    description:
      "Before/after image comparison direction for proof-oriented blocks where users need to inspect the visual change, not just read claims.",
    dependencies: ["motion/react"],
    framework: "react",
    bestFor:
      "Design improvement previews, product visual comparisons, image-editing tools, and before/after proof sections.",
    avoidWhen:
      "Avoid when there is no real before/after asset, or when the comparison would be simulated/fake proof.",
    solvesProblems: ["weak_trust_signals", "weak_hierarchy"],
    relatedSectionTypes: ["features", "hero", "cta"],
    relatedPatternIds: ["hero-product-preview", "demo-panel-cta", "featured-side-stack"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "motion-primitives-infinite-slider-carousel",
    source: "motion-primitives",
    title: "Carousel / Infinite Slider",
    url: `${DOCS_URL}/infinite-slider`,
    category: "scroll",
    tags: ["carousel", "slider", "logo-wall", "testimonials", "marquee"],
    keywords: ["carousel", "infinite-slider", "testimonials", "logo-wall", "marquee", "social-proof"],
    description:
      "Slider direction for restrained social-proof/logo/testimonial motion where content loops or scrolls only when it supports scanning.",
    dependencies: ["motion/react"],
    framework: "react",
    bestFor:
      "Testimonial walls, logo strips, lightweight carousels, and proof rows with enough real items to justify motion.",
    avoidWhen:
      "Avoid auto-rotating decision-critical content without pause controls or reduced-motion fallback.",
    solvesProblems: ["weak_trust_signals", "too_repetitive", "missing_microinteraction"],
    relatedSectionTypes: ["testimonials", "cta", "features"],
    relatedPatternIds: ["testimonial-wall", "logo-cloud-quote", "banner-cta"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "motion-primitives-docs-index",
    source: "motion-primitives",
    title: "Motion-Primitives Component Index",
    url: GITHUB_DOCS_URL,
    category: "other",
    tags: ["motion", "component-index", "react", "tailwind", "primitives"],
    keywords: ["motion-primitives", "component-index", "motion", "react", "tailwind"],
    description:
      "General source index for choosing a primitive by job: reveal grouped content, animate real numbers, transition panels, expand detail, compare images, or create restrained proof sliders.",
    dependencies: ["motion/react", "tailwindcss"],
    framework: "react",
    bestFor:
      "Prompt construction when Gemini detects a motion need but the exact interaction pattern is still open.",
    avoidWhen:
      "Avoid treating the index as permission to add decorative motion; pick one primitive tied to the user task.",
    solvesProblems: ["missing_microinteraction", "no_visual_rhythm", "unknown"],
    relatedSectionTypes: ["unknown", "features", "cards", "dashboard"],
    relatedPatternIds: ["feature-tabs", "settings-detail-pane", "bento-grid"],
    usageNote: `${USAGE_NOTE} Source components live under ${CORE_URL}.`,
    scrapedAt: SCRAPED_AT
  }
];
