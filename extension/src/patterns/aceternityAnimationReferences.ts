import type { AnimationReference } from "./animationReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as source-parsed motion direction only. Do not copy Aceternity code blindly; keep motion tied to a detected component, respect reduced-motion preferences, and avoid stacking high-motion effects.";

const COMPONENTS_URL = "https://ui.aceternity.com/components";

export const aceternityAnimationReferences: AnimationReference[] = [
  {
    id: "aceternity-card-interaction-set",
    source: "aceternity-ui",
    title: "Card Hover, Focus, And Expansion Effects",
    url: "https://ui.aceternity.com/components/card-hover-effect",
    category: "card",
    tags: ["aceternity-ui", "card-hover-effect", "focus-cards", "wobble-card", "expandable-card"],
    keywords: [
      "aceternity-ui",
      "card-hover-effect",
      "focus-cards",
      "wobble-card",
      "expandable-card",
      "card-spotlight",
      "cards_too_equal"
    ],
    description:
      "Card interaction direction for hover focus, expansion, spotlight, and restrained depth effects.",
    dependencies: ["framer-motion", "tailwindcss"],
    framework: "react",
    bestFor:
      "Feature cards, resource cards, testimonial cards, and pricing cards that need a single clear interaction cue.",
    avoidWhen:
      "Avoid on dense tables, dashboards, or already glow-heavy cards where hover depth harms scanning.",
    solvesProblems: ["cards_too_equal", "missing_microinteraction", "weak_hierarchy"],
    relatedSectionTypes: ["features", "cards", "pricing", "testimonials"],
    relatedPatternIds: ["bento-grid", "featured-side-stack", "pricing-emphasis", "testimonial-wall"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "aceternity-scroll-storytelling-set",
    source: "aceternity-ui",
    title: "Sticky Scroll, Tracing Beam, And Timeline Motion",
    url: "https://ui.aceternity.com/components/sticky-scroll-reveal",
    category: "scroll",
    tags: ["aceternity-ui", "sticky-scroll-reveal", "tracing-beam", "timeline", "parallax-scroll"],
    keywords: [
      "aceternity-ui",
      "sticky-scroll-reveal",
      "tracing-beam",
      "timeline",
      "parallax-scroll",
      "scroll",
      "workflow",
      "steps"
    ],
    description:
      "Scroll-story direction for process sections, workflow explanations, timelines, and step-by-step product narratives.",
    dependencies: ["framer-motion", "tailwindcss"],
    framework: "react",
    bestFor:
      "How-it-works sections, timeline/changelog blocks, workflow feature sections, and long-form product explanations.",
    avoidWhen:
      "Avoid if key content becomes inaccessible without scrolling or if motion hides chronology on mobile.",
    solvesProblems: ["no_visual_rhythm", "flat_layout", "weak_hierarchy"],
    relatedSectionTypes: ["features", "cards", "dashboard"],
    relatedPatternIds: ["workflow-feature-grid", "changelog-timeline", "demo-steps-hero"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "aceternity-text-motion-set",
    source: "aceternity-ui",
    title: "Text Flip, Generate, And Reveal Effects",
    url: "https://ui.aceternity.com/components/text-generate-effect",
    category: "text",
    tags: ["aceternity-ui", "text-generate-effect", "flip-words", "typewriter-effect", "encrypted-text"],
    keywords: [
      "aceternity-ui",
      "text-generate-effect",
      "flip-words",
      "typewriter-effect",
      "encrypted-text",
      "layout-text-flip",
      "too_text_heavy"
    ],
    description:
      "Text motion direction for short examples, rotating terms, generated text, and compact reveal moments.",
    dependencies: ["framer-motion", "tailwindcss"],
    framework: "react",
    bestFor:
      "Short headings, examples, status labels, AI-output demos, and compact text changes where the words themselves change state.",
    avoidWhen:
      "Avoid on long paragraphs, legal text, navigation, or any text that needs immediate readability.",
    solvesProblems: ["too_text_heavy", "missing_microinteraction", "weak_hierarchy"],
    relatedSectionTypes: ["features", "cta", "form"],
    relatedPatternIds: ["feature-tabs", "compact-lead-form", "split-cta"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "aceternity-form-button-feedback-set",
    source: "aceternity-ui",
    title: "Stateful Buttons, Gooey Inputs, And Upload Feedback",
    url: "https://ui.aceternity.com/components/stateful-button",
    category: "button",
    tags: ["aceternity-ui", "stateful-button", "gooey-input", "file-upload", "magnetic-button"],
    keywords: [
      "aceternity-ui",
      "stateful-button",
      "gooey-input",
      "file-upload",
      "placeholders-and-vanish-input",
      "magnetic-button",
      "buy-credits",
      "copy-button"
    ],
    description:
      "Microinteraction direction for action feedback: loading, success, drag/drop upload, expanding search input, and button hover response.",
    dependencies: ["framer-motion", "tailwindcss"],
    framework: "react",
    bestFor:
      "Buy credits, copy prompt, submit, upload, search, invite, and auth actions that need visible state feedback.",
    avoidWhen:
      "Avoid playful magnetic/gooey motion in quiet enterprise tools unless it supports the brand and task.",
    solvesProblems: ["cta_not_clear", "missing_microinteraction"],
    relatedSectionTypes: ["form", "pricing", "cta", "dashboard"],
    relatedPatternIds: ["compact-lead-form", "pricing-emphasis", "banner-cta", "settings-detail-pane"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "aceternity-navigation-motion-set",
    source: "aceternity-ui",
    title: "Floating Navbar, Resizable Navbar, And Sidebar Motion",
    url: "https://ui.aceternity.com/components/resizable-navbar",
    category: "navigation",
    tags: ["aceternity-ui", "resizable-navbar", "floating-navbar", "sidebar", "navbar-menu"],
    keywords: [
      "aceternity-ui",
      "resizable-navbar",
      "floating-navbar",
      "navbar-menu",
      "sidebar",
      "sticky-banner",
      "navigation"
    ],
    description:
      "Navigation motion direction for responsive navbars, sticky/floating headers, app sidebars, and active menu state transitions.",
    dependencies: ["framer-motion", "tailwindcss"],
    framework: "react",
    bestFor:
      "Navigation, sidebars, app shells, sticky banners, and compact menu state changes.",
    avoidWhen:
      "Avoid hiding critical navigation on scroll in task-heavy tools unless the user can easily recover it.",
    solvesProblems: ["missing_microinteraction", "weak_hierarchy"],
    relatedSectionTypes: ["unknown", "dashboard"],
    relatedPatternIds: ["sidebar-app-shell", "mega-menu-topbar", "command-center-nav"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "aceternity-image-comparison-inspection-set",
    source: "aceternity-ui",
    title: "Compare, Lens, Carousel, And Image Inspection",
    url: "https://ui.aceternity.com/components/compare",
    category: "image",
    tags: ["aceternity-ui", "compare", "lens", "carousel", "apple-cards-carousel"],
    keywords: [
      "aceternity-ui",
      "compare",
      "lens",
      "carousel",
      "image-slider",
      "apple-cards-carousel",
      "before-after",
      "product-preview"
    ],
    description:
      "Image interaction direction for before/after comparisons, zoom inspection, carousels, and visual proof.",
    dependencies: ["framer-motion", "tailwindcss"],
    framework: "react",
    bestFor:
      "Before/after design previews, product imagery, media galleries, and proof sections with real assets.",
    avoidWhen:
      "Avoid if the comparison uses placeholder or fabricated proof imagery.",
    solvesProblems: ["weak_trust_signals", "weak_hierarchy", "missing_microinteraction"],
    relatedSectionTypes: ["features", "cta", "testimonials"],
    relatedPatternIds: ["featured-side-stack", "demo-panel-cta", "testimonial-wall"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "aceternity-background-effect-guardrails",
    source: "aceternity-ui",
    title: "Background Effects With Guardrails",
    url: "https://ui.aceternity.com/blocks/backgrounds",
    category: "background",
    tags: ["aceternity-ui", "backgrounds", "aurora-background", "spotlight", "beams", "vortex"],
    keywords: [
      "aceternity-ui",
      "backgrounds",
      "aurora-background",
      "background-beams",
      "spotlight",
      "vortex",
      "grid-and-dot-backgrounds",
      "dotted-glow-background"
    ],
    description:
      "Background motion direction for rare brand moments, with source-specific guardrails against overusing aurora, beams, spotlight, vortex, and glow effects.",
    dependencies: ["framer-motion", "tailwindcss"],
    framework: "react",
    bestFor:
      "Brand-forward CTA or selected marketing sections where background motion improves hierarchy without reducing contrast.",
    avoidWhen:
      "Avoid on forms, pricing tables, dashboards, navigation, or unknown sections; animated backgrounds often create generic AI-slop.",
    solvesProblems: ["flat_layout", "weak_hierarchy"],
    relatedSectionTypes: ["cta", "features"],
    relatedPatternIds: ["banner-cta", "featured-side-stack"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "aceternity-component-motion-index",
    source: "aceternity-ui",
    title: "Aceternity Motion Component Index",
    url: COMPONENTS_URL,
    category: "other",
    tags: ["aceternity-ui", "component-index", "framer-motion", "tailwind", "motion"],
    keywords: [
      "aceternity-ui",
      "component-index",
      "framer-motion",
      "tailwind",
      "animated-components",
      "motion"
    ],
    description:
      "Catalog index for selecting a motion family by task: cards, scroll storytelling, text, buttons/forms, navigation, image inspection, or guarded backgrounds.",
    dependencies: ["framer-motion", "tailwindcss"],
    framework: "react",
    bestFor:
      "Prompt construction when Gemini detects a matching component family but the exact motion component is still open.",
    avoidWhen:
      "Avoid selecting from the catalog without a detected content/component reason.",
    solvesProblems: ["missing_microinteraction", "unknown"],
    relatedSectionTypes: ["unknown", "features", "cards", "dashboard"],
    relatedPatternIds: ["bento-grid", "resource-card-grid", "settings-detail-pane"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  }
];
