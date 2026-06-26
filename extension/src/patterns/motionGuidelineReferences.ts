import type { AnimationReference } from "./animationReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as motion-system guidance, not as copied implementation. Apply the principle to the selected UI, preserve accessibility, and keep motion purposeful.";

export const motionGuidelineReferences: AnimationReference[] = [
  {
    id: "carbon-motion-productive-microinteraction",
    source: "carbon-motion",
    title: "Productive Microinteraction Timing",
    url: "https://carbondesignsystem.com/elements/motion/overview/",
    category: "button",
    tags: ["motion-guideline", "microinteraction", "duration", "feedback", "productive"],
    keywords: [
      "microinteraction",
      "button",
      "toggle",
      "dropdown",
      "hover",
      "feedback",
      "90-120ms",
      "productive-motion"
    ],
    description:
      "Carbon's motion guidance favors efficient feedback for product UI: microinteractions should feel immediate, purposeful, and unobtrusive rather than decorative.",
    framework: "css",
    bestFor:
      "Buttons, toggles, dropdowns, form controls, and dashboard controls that need clear feedback without becoming a showpiece.",
    avoidWhen:
      "Avoid turning routine controls into expressive or bouncy animations; keep repeated product actions fast and quiet.",
    solvesProblems: ["missing_microinteraction", "cta_not_clear", "flat_layout"],
    relatedSectionTypes: ["form", "dashboard", "pricing", "cta", "unknown"],
    relatedPatternIds: [
      "compact-lead-form",
      "settings-detail-pane",
      "table-summary-rail",
      "pricing-toggle",
      "banner-cta"
    ],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "carbon-motion-duration-scale",
    source: "carbon-motion",
    title: "Duration Scales With Distance And Size",
    url: "https://carbondesignsystem.com/elements/motion/overview/",
    category: "transition",
    tags: ["motion-guideline", "duration", "scale", "distance", "timing"],
    keywords: [
      "duration",
      "timing",
      "transition",
      "expansion",
      "distance",
      "size",
      "70ms",
      "110ms",
      "150ms",
      "240ms",
      "400ms"
    ],
    description:
      "Carbon ties duration to the size and distance of the movement: tiny feedback stays fast, while larger expansions and notifications get more time.",
    framework: "css",
    bestFor:
      "Choosing practical durations for card expansion, panel reveal, toast, modal, drawer, dashboard, and pricing state changes.",
    avoidWhen:
      "Avoid one global duration for every transition, especially when tiny controls and large panels move at the same speed.",
    solvesProblems: ["missing_microinteraction", "no_visual_rhythm", "spacing_issue"],
    relatedSectionTypes: ["cards", "pricing", "dashboard", "form", "stats", "unknown"],
    relatedPatternIds: [
      "settings-detail-pane",
      "feature-tabs",
      "pricing-emphasis",
      "metric-trend-grid",
      "resource-card-grid"
    ],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "carbon-motion-sequence-and-stagger",
    source: "carbon-motion",
    title: "Sequence And Stagger For Dense Content",
    url: "https://carbondesignsystem.com/elements/motion/choreography/",
    category: "list",
    tags: ["motion-guideline", "stagger", "sequence", "choreography", "cards", "tables"],
    keywords: [
      "stagger",
      "sequence",
      "cards",
      "table",
      "rows",
      "workflow",
      "steps",
      "20ms",
      "500ms",
      "choreography"
    ],
    description:
      "Carbon recommends sequencing related entrances instead of dropping every item in at once, while keeping the whole sequence short enough to stay useful.",
    framework: "css",
    bestFor:
      "Feature grids, workflow steps, testimonial walls, dashboard tables, and repeated cards that need reading rhythm.",
    avoidWhen:
      "Avoid long cascading delays or animating every child separately when the user needs immediate access to the content.",
    solvesProblems: ["too_repetitive", "cards_too_equal", "no_visual_rhythm", "flat_layout"],
    relatedSectionTypes: ["features", "cards", "dashboard", "testimonials", "stats"],
    relatedPatternIds: [
      "bento-grid",
      "workflow-feature-grid",
      "testimonial-wall",
      "table-summary-rail",
      "metric-bento"
    ],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "carbon-motion-semantic-spatial-consistency",
    source: "carbon-motion",
    title: "Semantic And Spatial Motion Consistency",
    url: "https://carbondesignsystem.com/elements/motion/choreography/",
    category: "transition",
    tags: ["motion-guideline", "consistency", "spatial", "semantic", "panel", "navigation"],
    keywords: [
      "spatial",
      "semantic",
      "consistency",
      "panel",
      "drawer",
      "tabs",
      "navigation",
      "shared-elements",
      "continuity"
    ],
    description:
      "Carbon separates semantic consistency from spatial consistency: same intent should move similarly, while different layers should move in a way that clarifies hierarchy.",
    framework: "css",
    bestFor:
      "Tabs, side panels, nav drawers, settings panes, recommendation details, and dashboard drill-down states.",
    avoidWhen:
      "Avoid random directions, diagonal paths, or unrelated easing choices that make navigation feel arbitrary.",
    solvesProblems: ["flat_layout", "weak_hierarchy", "missing_microinteraction"],
    relatedSectionTypes: ["dashboard", "cards", "form", "unknown"],
    relatedPatternIds: [
      "sidebar-app-shell",
      "settings-detail-pane",
      "command-center-nav",
      "activity-feed-sidebar",
      "resource-card-grid"
    ],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "material-motion-emphasized-transitions",
    source: "material-motion",
    title: "Emphasized Easing For Meaningful Transitions",
    url: "https://m3.material.io/styles/motion/easing-and-duration",
    category: "transition",
    tags: ["motion-guideline", "material", "easing", "duration", "transition"],
    keywords: [
      "material",
      "emphasized",
      "easing",
      "duration",
      "transition",
      "container-transform",
      "shared-axis",
      "fade-through"
    ],
    description:
      "Material 3 frames easing and duration as the system for responsive, expressive transitions, with emphasized easing suited to meaningful UI changes.",
    framework: "css",
    bestFor:
      "State changes where the user needs to understand continuity between cards, panels, dialogs, previews, or full-screen views.",
    avoidWhen:
      "Avoid using expressive transition language for tiny hover states or repetitive app controls.",
    solvesProblems: ["flat_layout", "weak_hierarchy", "missing_microinteraction"],
    relatedSectionTypes: ["cards", "dashboard", "form", "pricing", "cta", "unknown"],
    relatedPatternIds: [
      "resource-card-grid",
      "settings-detail-pane",
      "hero-product-preview",
      "pricing-emphasis",
      "demo-panel-cta"
    ],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "material-motion-connect-elements-and-views",
    source: "material-motion",
    title: "Transitions Connect Elements And Views",
    url: "https://m3.material.io/styles/motion/transitions",
    category: "transition",
    tags: ["motion-guideline", "material", "view-transition", "continuity", "navigation"],
    keywords: [
      "view-transition",
      "transition",
      "screen",
      "elements",
      "connect",
      "continuity",
      "navigation",
      "details"
    ],
    description:
      "Material treats transitions as short animations that connect individual elements or screens, so motion should explain where the user went.",
    framework: "css",
    bestFor:
      "Card-to-detail flows, preview expansion, recommendation tabs, onboarding steps, product detail, and app navigation.",
    avoidWhen:
      "Avoid transitions that hide content changes, delay interaction, or do not map to a clear spatial or semantic relationship.",
    solvesProblems: ["flat_layout", "weak_hierarchy", "missing_microinteraction"],
    relatedSectionTypes: ["cards", "dashboard", "features", "form", "unknown"],
    relatedPatternIds: [
      "resource-card-grid",
      "product-detail-split",
      "onboarding-checklist-form",
      "settings-detail-pane"
    ],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "apple-hig-purposeful-motion",
    source: "apple-hig",
    title: "Purposeful Motion Only",
    url: "https://developer.apple.com/design/human-interface-guidelines/motion",
    category: "other",
    tags: ["motion-guideline", "apple", "restraint", "purpose", "accessibility"],
    keywords: [
      "purposeful",
      "restraint",
      "excessive-motion",
      "accessibility",
      "focus",
      "clarity",
      "motion-purpose"
    ],
    description:
      "Apple's HIG motion guidance is restraint-first: motion should support the experience and avoid overshadowing content or task flow.",
    framework: "unknown",
    bestFor:
      "Auditing whether a proposed animation actually improves clarity, feedback, continuity, or focus before adding it.",
    avoidWhen:
      "Avoid adding decorative loops, parallax, or attention-grabbing effects just because the section feels visually plain.",
    solvesProblems: ["missing_microinteraction", "no_visual_rhythm"],
    relatedSectionTypes: [
      "hero",
      "features",
      "cards",
      "pricing",
      "cta",
      "stats",
      "form",
      "dashboard",
      "testimonials",
      "unknown"
    ],
    relatedPatternIds: [
      "bento-grid",
      "pricing-emphasis",
      "form-benefits-sidebar",
      "analytics-overview",
      "banner-cta"
    ],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "mdn-prefers-reduced-motion",
    source: "mdn-web-docs",
    title: "Reduced Motion Accessibility Fallback",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion",
    category: "other",
    tags: ["motion-guideline", "accessibility", "reduced-motion", "css", "fallback"],
    keywords: [
      "prefers-reduced-motion",
      "reduced-motion",
      "accessibility",
      "vestibular",
      "motion-sensitivity",
      "fallback",
      "css-media-query"
    ],
    description:
      "MDN documents the CSS media feature for detecting reduced-motion preferences and replacing motion that can trigger discomfort.",
    framework: "css",
    bestFor:
      "Any recommended animation, especially scroll, scale, parallax, carousel, auto-play, and background motion.",
    avoidWhen:
      "Do not use as an excuse to ship motion-heavy defaults; design a calm baseline and enhance only when appropriate.",
    solvesProblems: ["missing_microinteraction", "unknown"],
    relatedSectionTypes: [
      "hero",
      "features",
      "cards",
      "pricing",
      "cta",
      "stats",
      "form",
      "dashboard",
      "testimonials",
      "unknown"
    ],
    relatedPatternIds: [
      "split-hero",
      "bento-grid",
      "pricing-emphasis",
      "testimonial-wall",
      "analytics-overview"
    ],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  }
];
