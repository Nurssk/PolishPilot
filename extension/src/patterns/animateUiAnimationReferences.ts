import type { AnimationReference } from "./animationReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as animation inspiration and accessibility direction only. Respect the source license; adapt components to the existing design system.";

const DOCS_URL = "https://animate-ui.com/docs";
const COMPONENT_META_URL =
  "https://github.com/imskyleen/animate-ui/blob/main/apps/www/content/docs/components/meta.json";
const PRIMITIVE_META_URL =
  "https://github.com/imskyleen/animate-ui/blob/main/apps/www/content/docs/primitives/meta.json";
const ACCESSIBILITY_URL =
  "https://github.com/imskyleen/animate-ui/blob/main/apps/www/content/docs/accessibility.mdx";

export const animateUiAnimationReferences: AnimationReference[] = [
  {
    id: "animate-ui-accessible-motion-config",
    source: "animate-ui",
    title: "Accessible Motion Defaults",
    url: ACCESSIBILITY_URL,
    category: "other",
    tags: ["accessibility", "reduced-motion", "motion-config", "safe-animation"],
    keywords: ["reduced-motion", "prefers-reduced-motion", "motion-config", "accessibility", "safe-animation"],
    description:
      "Reduced-motion direction for keeping helpful opacity/background transitions while disabling large transform, parallax, auto-scroll, and looping background motion for users who prefer less motion.",
    dependencies: ["motion/react"],
    framework: "react",
    bestFor:
      "Any generated prompt that recommends Motion-powered interactions, especially background, carousel, dialog, or card reveal effects.",
    avoidWhen:
      "Do not add animation recommendations without including reduced-motion handling and a static fallback.",
    solvesProblems: ["missing_microinteraction", "unknown"],
    relatedSectionTypes: ["unknown", "hero", "features", "cards", "dashboard", "pricing", "cta", "form", "testimonials"],
    relatedPatternIds: ["feature-tabs", "settings-detail-pane", "banner-cta"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "animate-ui-tabs-tooltip-components",
    source: "animate-ui",
    title: "Animated Tabs / Tooltip Components",
    url: `${DOCS_URL}/components/animate/tabs`,
    category: "navigation",
    tags: ["tabs", "tooltip", "state", "navigation", "single-window"],
    keywords: ["tabs", "tooltip", "single-window", "recommendations", "settings", "state-transition"],
    description:
      "Animated tabs/tooltip direction for switching recommendation categories, layout ideas, settings panes, or compact contextual help in one window.",
    dependencies: ["motion/react", "tailwindcss"],
    framework: "react",
    bestFor:
      "Tabbed recommendation panels, settings views, compare modes, hover/focus hints, and single-page UI exploration.",
    avoidWhen:
      "Avoid if tabs hide critical information on mobile, or tooltips become the only source of required instructions.",
    solvesProblems: ["missing_microinteraction", "weak_hierarchy", "flat_layout"],
    relatedSectionTypes: ["dashboard", "cards", "unknown"],
    relatedPatternIds: ["feature-tabs", "settings-detail-pane", "command-center-nav"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "animate-ui-button-microinteractions",
    source: "animate-ui",
    title: "Button Microinteractions",
    url: `${DOCS_URL}/components/buttons/button`,
    category: "button",
    tags: ["button", "ripple", "copy", "liquid", "theme-toggle", "microinteraction"],
    keywords: ["button", "ripple", "copy-button", "theme-toggler", "cta_not_clear", "primary-action"],
    description:
      "Button motion direction for clear press, copy, theme-toggle, and CTA feedback using small stateful motion rather than broad hover transforms.",
    dependencies: ["motion/react"],
    framework: "react",
    bestFor:
      "Primary CTAs, copy prompt buttons, form submits, buy-credit buttons, and toolbar actions that need immediate feedback.",
    avoidWhen:
      "Avoid decorative liquid/ripple effects in dense enterprise tools unless the brand supports playful motion.",
    solvesProblems: ["cta_not_clear", "missing_microinteraction"],
    relatedSectionTypes: ["cta", "hero", "form", "pricing"],
    relatedPatternIds: ["split-cta", "banner-cta", "compact-lead-form", "pricing-emphasis"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "animate-ui-text-effects",
    source: "animate-ui",
    title: "Animated Text Effects",
    url: `${DOCS_URL}/primitives/texts/typing`,
    category: "text",
    tags: ["text", "typing", "rolling", "morphing", "number", "shimmer"],
    keywords: ["typing", "morphing", "rolling", "counting-number", "text-effect", "headline", "pricing"],
    description:
      "Text animation direction for small, meaningful text transitions: typed examples, rolling numbers, morphing labels, highlights, or shimmer only where the text itself changes state.",
    dependencies: ["motion/react"],
    framework: "react",
    bestFor:
      "Search/chat examples, pricing number changes, status labels, short hero demos, and interactive copy states.",
    avoidWhen:
      "Avoid animated text for long paragraphs, accessibility-critical copy, or generic hero decoration.",
    solvesProblems: ["weak_hierarchy", "missing_microinteraction", "too_text_heavy"],
    relatedSectionTypes: ["hero", "pricing", "stats", "form"],
    relatedPatternIds: ["hero-product-preview", "pricing-emphasis", "compact-lead-form"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "animate-ui-effects-primitives",
    source: "animate-ui",
    title: "Effect Primitives",
    url: `${DOCS_URL}/primitives/effects/fade`,
    category: "transition",
    tags: ["fade", "slide", "zoom", "blur", "image-zoom", "magnetic", "tilt"],
    keywords: ["fade", "slide", "zoom", "blur", "image-zoom", "magnetic", "tilt", "motion"],
    description:
      "Effect primitive direction for small state transitions, image zoom, magnetic hover, tilt, and fade/slide/zoom effects that should be chosen by interaction purpose.",
    dependencies: ["motion/react"],
    framework: "react",
    bestFor:
      "Hover detail, image inspection, panel reveal, and lightweight state changes that need one clear motion cue.",
    avoidWhen:
      "Avoid stacking multiple effects on the same element or using tilt/magnetic effects on utilitarian dashboard controls.",
    solvesProblems: ["flat_layout", "missing_microinteraction", "no_visual_rhythm"],
    relatedSectionTypes: ["features", "cards", "dashboard", "testimonials"],
    relatedPatternIds: ["resource-card-grid", "featured-side-stack", "testimonial-wall"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "animate-ui-background-components",
    source: "animate-ui",
    title: "Animated Background Components",
    url: `${DOCS_URL}/components/backgrounds/gradient`,
    category: "background",
    tags: ["background", "stars", "gradient", "bubble", "hexagon", "fireworks"],
    keywords: ["background", "gradient", "stars", "bubble", "hexagon", "fireworks", "hero", "cta"],
    description:
      "Background animation direction for rare brand/hero moments, with restraint: animated backgrounds must support foreground readability and respect reduced motion.",
    dependencies: ["motion/react"],
    framework: "react",
    bestFor:
      "Brand-forward hero or CTA surfaces where motion is part of the visual identity and content remains readable.",
    avoidWhen:
      "Avoid on dashboards, forms, pricing tables, or any screen where background motion competes with decisions.",
    solvesProblems: ["flat_layout", "weak_hierarchy", "missing_microinteraction"],
    relatedSectionTypes: ["hero", "cta"],
    relatedPatternIds: ["split-hero", "banner-cta", "hero-product-preview"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT
  },
  {
    id: "animate-ui-component-index",
    source: "animate-ui",
    title: "Animate UI Component Index",
    url: COMPONENT_META_URL,
    category: "other",
    tags: ["component-index", "animated-components", "radix", "base-ui", "headless-ui"],
    keywords: ["animate-ui", "component-index", "radix", "base-ui", "headless-ui", "animated-components"],
    description:
      "Component index direction for selecting animated primitives by interaction family: tabs, tooltip, dialog, popover, progress, switch, button, background, text, or effect.",
    dependencies: ["motion/react", "tailwindcss"],
    framework: "react",
    bestFor:
      "Prompt construction when a detected component needs an accessible animated equivalent.",
    avoidWhen:
      "Avoid importing a whole visual style; use only the interaction behavior that fits the existing system.",
    solvesProblems: ["missing_microinteraction", "unknown"],
    relatedSectionTypes: ["unknown", "features", "cards", "dashboard"],
    relatedPatternIds: ["feature-tabs", "settings-detail-pane", "compact-lead-form"],
    usageNote: `${USAGE_NOTE} Primitive index: ${PRIMITIVE_META_URL}.`,
    scrapedAt: SCRAPED_AT
  }
];
