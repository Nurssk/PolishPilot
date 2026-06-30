import { watermelonAnimationReferences } from "./watermelonAnimationReferences";
import { motionPrimitivesAnimationReferences } from "./motionPrimitivesAnimationReferences";
import { animateUiAnimationReferences } from "./animateUiAnimationReferences";
import { magicUiAnimationReferences } from "./magicUiAnimationReferences";
import { aceternityAnimationReferences } from "./aceternityAnimationReferences";
import { motionGuidelineReferences } from "./motionGuidelineReferences";

export type AnimationSource =
  | "reactbits"
  | "watermelon-ui"
  | "motion-primitives"
  | "animate-ui"
  | "magic-ui"
  | "aceternity-ui"
  | "carbon-motion"
  | "material-motion"
  | "apple-hig"
  | "mdn-web-docs";

export type AnimationCategory =
  | "text"
  | "card"
  | "button"
  | "scroll"
  | "background"
  | "loader"
  | "transition"
  | "hover"
  | "cursor"
  | "image"
  | "list"
  | "navigation"
  | "other";

export type AnimationReference = {
  id: string;
  source: AnimationSource;
  title: string;
  url: string;
  category: AnimationCategory;
  tags: string[];
  keywords?: string[];
  description?: string;
  previewImageUrl?: string;
  previewPageUrl?: string;
  dependencies?: string[];
  framework?: "react" | "next" | "css" | "framer-motion" | "gsap" | "three" | "unknown";
  bestFor: string;
  avoidWhen: string;
  solvesProblems?: Array<
    | "flat_layout"
    | "weak_hierarchy"
    | "too_repetitive"
    | "cta_not_clear"
    | "cards_too_equal"
    | "spacing_issue"
    | "too_text_heavy"
    | "no_visual_rhythm"
    | "weak_trust_signals"
    | "missing_microinteraction"
    | "unknown"
  >;
  relatedSectionTypes: Array<
    "hero" | "features" | "cards" | "pricing" | "cta" | "stats" | "form" | "dashboard" | "testimonials" | "unknown"
  >;
  relatedPatternIds: string[];
  usageNote: string;
  scrapedAt: string;
};

const reactbitsAnimationReferences: AnimationReference[] = [
  {
    "id": "reactbits-animations-animated-content",
    "source": "reactbits",
    "title": "Animated Content",
    "url": "https://reactbits.dev/animations/animated-content",
    "category": "transition",
    "tags": [
      "animation",
      "animations",
      "animated-content"
    ],
    "framework": "react",
    "bestFor": "State changes, route changes, or view swaps that need continuity.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-antigravity",
    "source": "reactbits",
    "title": "Antigravity",
    "url": "https://reactbits.dev/animations/antigravity",
    "category": "background",
    "tags": [
      "animation",
      "animations",
      "antigravity"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-blob-cursor",
    "source": "reactbits",
    "title": "Blob Cursor",
    "url": "https://reactbits.dev/animations/blob-cursor",
    "category": "cursor",
    "tags": [
      "animation",
      "animations",
      "blob-cursor",
      "cursor"
    ],
    "framework": "react",
    "bestFor": "Experimental marketing surfaces where pointer-following effects fit the brand.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-click-spark",
    "source": "reactbits",
    "title": "Click Spark",
    "url": "https://reactbits.dev/animations/click-spark",
    "category": "button",
    "tags": [
      "animation",
      "animations",
      "click-spark",
      "click"
    ],
    "framework": "react",
    "bestFor": "Primary CTAs and form actions where a small microinteraction can reinforce clickability.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "cta",
      "hero",
      "form"
    ],
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-crosshair",
    "source": "reactbits",
    "title": "Crosshair",
    "url": "https://reactbits.dev/animations/crosshair",
    "category": "cursor",
    "tags": [
      "animation",
      "animations",
      "crosshair"
    ],
    "framework": "react",
    "bestFor": "Experimental marketing surfaces where pointer-following effects fit the brand.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-cubes",
    "source": "reactbits",
    "title": "Cubes",
    "url": "https://reactbits.dev/animations/cubes",
    "category": "background",
    "tags": [
      "animation",
      "animations",
      "cubes"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-electric-border",
    "source": "reactbits",
    "title": "Electric Border",
    "url": "https://reactbits.dev/animations/electric-border",
    "category": "card",
    "tags": [
      "animation",
      "animations",
      "electric-border"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-fade-content",
    "source": "reactbits",
    "title": "Fade Content",
    "url": "https://reactbits.dev/animations/fade-content",
    "category": "transition",
    "tags": [
      "animation",
      "animations",
      "fade-content"
    ],
    "framework": "react",
    "bestFor": "State changes, route changes, or view swaps that need continuity.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-ghost-cursor",
    "source": "reactbits",
    "title": "Ghost Cursor",
    "url": "https://reactbits.dev/animations/ghost-cursor",
    "category": "cursor",
    "tags": [
      "animation",
      "animations",
      "ghost-cursor",
      "cursor"
    ],
    "framework": "react",
    "bestFor": "Experimental marketing surfaces where pointer-following effects fit the brand.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-glare-hover",
    "source": "reactbits",
    "title": "Glare Hover",
    "url": "https://reactbits.dev/animations/glare-hover",
    "category": "card",
    "tags": [
      "animation",
      "animations",
      "glare-hover",
      "glare",
      "hover"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-gradual-blur",
    "source": "reactbits",
    "title": "Gradual Blur",
    "url": "https://reactbits.dev/animations/gradual-blur",
    "category": "text",
    "tags": [
      "animation",
      "animations",
      "gradual-blur",
      "blur"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-image-trail",
    "source": "reactbits",
    "title": "Image Trail",
    "url": "https://reactbits.dev/animations/image-trail",
    "category": "image",
    "tags": [
      "animation",
      "animations",
      "image-trail",
      "image"
    ],
    "framework": "react",
    "bestFor": "Media galleries, product previews, and visual card layouts.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "hero",
      "features",
      "cards"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-laser-flow",
    "source": "reactbits",
    "title": "Laser Flow",
    "url": "https://reactbits.dev/animations/laser-flow",
    "category": "background",
    "tags": [
      "animation",
      "animations",
      "laser-flow"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-logo-loop",
    "source": "reactbits",
    "title": "Logo Loop",
    "url": "https://reactbits.dev/animations/logo-loop",
    "category": "other",
    "tags": [
      "animation",
      "animations",
      "logo-loop"
    ],
    "framework": "react",
    "bestFor": "Selected UI blocks that need a specific animation reference.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-magic-rings",
    "source": "reactbits",
    "title": "Magic Rings",
    "url": "https://reactbits.dev/animations/magic-rings",
    "category": "background",
    "tags": [
      "animation",
      "animations",
      "magic-rings"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-magnet",
    "source": "reactbits",
    "title": "Magnet",
    "url": "https://reactbits.dev/animations/magnet",
    "category": "button",
    "tags": [
      "animation",
      "animations",
      "magnet"
    ],
    "framework": "react",
    "bestFor": "Primary CTAs and form actions where a small microinteraction can reinforce clickability.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "cta",
      "hero",
      "form"
    ],
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-magnet-lines",
    "source": "reactbits",
    "title": "Magnet Lines",
    "url": "https://reactbits.dev/animations/magnet-lines",
    "category": "button",
    "tags": [
      "animation",
      "animations",
      "magnet-lines"
    ],
    "framework": "react",
    "bestFor": "Primary CTAs and form actions where a small microinteraction can reinforce clickability.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "cta",
      "hero",
      "form"
    ],
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-meta-balls",
    "source": "reactbits",
    "title": "Meta Balls",
    "url": "https://reactbits.dev/animations/meta-balls",
    "category": "background",
    "tags": [
      "animation",
      "animations",
      "meta-balls"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-metallic-paint",
    "source": "reactbits",
    "title": "Metallic Paint",
    "url": "https://reactbits.dev/animations/metallic-paint",
    "category": "background",
    "tags": [
      "animation",
      "animations",
      "metallic-paint"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-noise",
    "source": "reactbits",
    "title": "Noise",
    "url": "https://reactbits.dev/animations/noise",
    "category": "background",
    "tags": [
      "animation",
      "animations",
      "noise"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-orbit-images",
    "source": "reactbits",
    "title": "Orbit Images",
    "url": "https://reactbits.dev/animations/orbit-images",
    "category": "image",
    "tags": [
      "animation",
      "animations",
      "orbit-images",
      "image"
    ],
    "framework": "react",
    "bestFor": "Media galleries, product previews, and visual card layouts.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "hero",
      "features",
      "cards"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-pixel-trail",
    "source": "reactbits",
    "title": "Pixel Trail",
    "url": "https://reactbits.dev/animations/pixel-trail",
    "category": "other",
    "tags": [
      "animation",
      "animations",
      "pixel-trail"
    ],
    "framework": "react",
    "bestFor": "Selected UI blocks that need a specific animation reference.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-pixel-transition",
    "source": "reactbits",
    "title": "Pixel Transition",
    "url": "https://reactbits.dev/animations/pixel-transition",
    "category": "transition",
    "tags": [
      "animation",
      "animations",
      "pixel-transition",
      "transition"
    ],
    "framework": "react",
    "bestFor": "State changes, route changes, or view swaps that need continuity.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-ribbons",
    "source": "reactbits",
    "title": "Ribbons",
    "url": "https://reactbits.dev/animations/ribbons",
    "category": "background",
    "tags": [
      "animation",
      "animations",
      "ribbons"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-shape-blur",
    "source": "reactbits",
    "title": "Shape Blur",
    "url": "https://reactbits.dev/animations/shape-blur",
    "category": "text",
    "tags": [
      "animation",
      "animations",
      "shape-blur",
      "blur"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-splash-cursor",
    "source": "reactbits",
    "title": "Splash Cursor",
    "url": "https://reactbits.dev/animations/splash-cursor",
    "category": "cursor",
    "tags": [
      "animation",
      "animations",
      "splash-cursor",
      "cursor"
    ],
    "framework": "react",
    "bestFor": "Experimental marketing surfaces where pointer-following effects fit the brand.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-star-border",
    "source": "reactbits",
    "title": "Star Border",
    "url": "https://reactbits.dev/animations/star-border",
    "category": "card",
    "tags": [
      "animation",
      "animations",
      "star-border"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-sticker-peel",
    "source": "reactbits",
    "title": "Sticker Peel",
    "url": "https://reactbits.dev/animations/sticker-peel",
    "category": "image",
    "tags": [
      "animation",
      "animations",
      "sticker-peel"
    ],
    "framework": "react",
    "bestFor": "Media galleries, product previews, and visual card layouts.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "hero",
      "features",
      "cards"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-animations-target-cursor",
    "source": "reactbits",
    "title": "Target Cursor",
    "url": "https://reactbits.dev/animations/target-cursor",
    "category": "cursor",
    "tags": [
      "animation",
      "animations",
      "target-cursor",
      "cursor"
    ],
    "framework": "react",
    "bestFor": "Experimental marketing surfaces where pointer-following effects fit the brand.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-aurora",
    "source": "reactbits",
    "title": "Aurora",
    "url": "https://reactbits.dev/backgrounds/aurora",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "aurora"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-balatro",
    "source": "reactbits",
    "title": "Balatro",
    "url": "https://reactbits.dev/backgrounds/balatro",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "balatro"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-ballpit",
    "source": "reactbits",
    "title": "Ballpit",
    "url": "https://reactbits.dev/backgrounds/ballpit",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "ballpit"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-beams",
    "source": "reactbits",
    "title": "Beams",
    "url": "https://reactbits.dev/backgrounds/beams",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "beams"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-color-bends",
    "source": "reactbits",
    "title": "Color Bends",
    "url": "https://reactbits.dev/backgrounds/color-bends",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "color-bends"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-dark-veil",
    "source": "reactbits",
    "title": "Dark Veil",
    "url": "https://reactbits.dev/backgrounds/dark-veil",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "dark-veil"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-dither",
    "source": "reactbits",
    "title": "Dither",
    "url": "https://reactbits.dev/backgrounds/dither",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "dither"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-dot-field",
    "source": "reactbits",
    "title": "Dot Field",
    "url": "https://reactbits.dev/backgrounds/dot-field",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "dot-field"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-dot-grid",
    "source": "reactbits",
    "title": "Dot Grid",
    "url": "https://reactbits.dev/backgrounds/dot-grid",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "dot-grid",
      "grid"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-evil-eye",
    "source": "reactbits",
    "title": "Evil Eye",
    "url": "https://reactbits.dev/backgrounds/evil-eye",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "evil-eye"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-faulty-terminal",
    "source": "reactbits",
    "title": "Faulty Terminal",
    "url": "https://reactbits.dev/backgrounds/faulty-terminal",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "faulty-terminal"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-ferrofluid",
    "source": "reactbits",
    "title": "Ferrofluid",
    "url": "https://reactbits.dev/backgrounds/ferrofluid",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "ferrofluid"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-floating-lines",
    "source": "reactbits",
    "title": "Floating Lines",
    "url": "https://reactbits.dev/backgrounds/floating-lines",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "floating-lines"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-galaxy",
    "source": "reactbits",
    "title": "Galaxy",
    "url": "https://reactbits.dev/backgrounds/galaxy",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "galaxy"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-gradient-blinds",
    "source": "reactbits",
    "title": "Gradient Blinds",
    "url": "https://reactbits.dev/backgrounds/gradient-blinds",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "gradient-blinds",
      "gradient"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-grainient",
    "source": "reactbits",
    "title": "Grainient",
    "url": "https://reactbits.dev/backgrounds/grainient",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "grainient"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-grid-distortion",
    "source": "reactbits",
    "title": "Grid Distortion",
    "url": "https://reactbits.dev/backgrounds/grid-distortion",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "grid-distortion",
      "grid"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-grid-motion",
    "source": "reactbits",
    "title": "Grid Motion",
    "url": "https://reactbits.dev/backgrounds/grid-motion",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "grid-motion",
      "grid"
    ],
    "dependencies": [
      "framer-motion"
    ],
    "framework": "framer-motion",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-grid-scan",
    "source": "reactbits",
    "title": "Grid Scan",
    "url": "https://reactbits.dev/backgrounds/grid-scan",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "grid-scan",
      "grid"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-hyperspeed",
    "source": "reactbits",
    "title": "Hyperspeed",
    "url": "https://reactbits.dev/backgrounds/hyperspeed",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "hyperspeed"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-iridescence",
    "source": "reactbits",
    "title": "Iridescence",
    "url": "https://reactbits.dev/backgrounds/iridescence",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "iridescence"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-letter-glitch",
    "source": "reactbits",
    "title": "Letter Glitch",
    "url": "https://reactbits.dev/backgrounds/letter-glitch",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "letter-glitch"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-light-pillar",
    "source": "reactbits",
    "title": "Light Pillar",
    "url": "https://reactbits.dev/backgrounds/light-pillar",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "light-pillar"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-light-rays",
    "source": "reactbits",
    "title": "Light Rays",
    "url": "https://reactbits.dev/backgrounds/light-rays",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "light-rays"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-lightfall",
    "source": "reactbits",
    "title": "Lightfall",
    "url": "https://reactbits.dev/backgrounds/lightfall",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "lightfall"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-lightning",
    "source": "reactbits",
    "title": "Lightning",
    "url": "https://reactbits.dev/backgrounds/lightning",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "lightning"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-line-waves",
    "source": "reactbits",
    "title": "Line Waves",
    "url": "https://reactbits.dev/backgrounds/line-waves",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "line-waves"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-liquid-chrome",
    "source": "reactbits",
    "title": "Liquid Chrome",
    "url": "https://reactbits.dev/backgrounds/liquid-chrome",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "liquid-chrome"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-liquid-ether",
    "source": "reactbits",
    "title": "Liquid Ether",
    "url": "https://reactbits.dev/backgrounds/liquid-ether",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "liquid-ether"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-orb",
    "source": "reactbits",
    "title": "Orb",
    "url": "https://reactbits.dev/backgrounds/orb",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "orb"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-particles",
    "source": "reactbits",
    "title": "Particles",
    "url": "https://reactbits.dev/backgrounds/particles",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "particles"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-pixel-blast",
    "source": "reactbits",
    "title": "Pixel Blast",
    "url": "https://reactbits.dev/backgrounds/pixel-blast",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "pixel-blast"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-pixel-snow",
    "source": "reactbits",
    "title": "Pixel Snow",
    "url": "https://reactbits.dev/backgrounds/pixel-snow",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "pixel-snow"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-plasma",
    "source": "reactbits",
    "title": "Plasma",
    "url": "https://reactbits.dev/backgrounds/plasma",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "plasma"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-plasma-wave",
    "source": "reactbits",
    "title": "Plasma Wave",
    "url": "https://reactbits.dev/backgrounds/plasma-wave",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "plasma-wave"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-prism",
    "source": "reactbits",
    "title": "Prism",
    "url": "https://reactbits.dev/backgrounds/prism",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "prism"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-prismatic-burst",
    "source": "reactbits",
    "title": "Prismatic Burst",
    "url": "https://reactbits.dev/backgrounds/prismatic-burst",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "prismatic-burst"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-radar",
    "source": "reactbits",
    "title": "Radar",
    "url": "https://reactbits.dev/backgrounds/radar",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "radar"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-ripple-grid",
    "source": "reactbits",
    "title": "Ripple Grid",
    "url": "https://reactbits.dev/backgrounds/ripple-grid",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "ripple-grid",
      "ripple",
      "grid"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-shape-grid",
    "source": "reactbits",
    "title": "Shape Grid",
    "url": "https://reactbits.dev/backgrounds/shape-grid",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "shape-grid",
      "grid"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-side-rays",
    "source": "reactbits",
    "title": "Side Rays",
    "url": "https://reactbits.dev/backgrounds/side-rays",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "side-rays"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-silk",
    "source": "reactbits",
    "title": "Silk",
    "url": "https://reactbits.dev/backgrounds/silk",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "silk"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-soft-aurora",
    "source": "reactbits",
    "title": "Soft Aurora",
    "url": "https://reactbits.dev/backgrounds/soft-aurora",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "soft-aurora",
      "aurora"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-threads",
    "source": "reactbits",
    "title": "Threads",
    "url": "https://reactbits.dev/backgrounds/threads",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "threads"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-backgrounds-waves",
    "source": "reactbits",
    "title": "Waves",
    "url": "https://reactbits.dev/backgrounds/waves",
    "category": "background",
    "tags": [
      "background",
      "backgrounds",
      "waves"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-animated-list",
    "source": "reactbits",
    "title": "Animated List",
    "url": "https://reactbits.dev/components/animated-list",
    "category": "list",
    "tags": [
      "component",
      "components",
      "animated-list",
      "list"
    ],
    "framework": "react",
    "bestFor": "Feature lists, stats groups, and repeated cards that should appear as a coordinated set.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "stats"
    ],
    "relatedPatternIds": [
      "metric-bento",
      "stats-strip"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-border-glow",
    "source": "reactbits",
    "title": "Border Glow",
    "url": "https://reactbits.dev/components/border-glow",
    "category": "card",
    "tags": [
      "component",
      "components",
      "border-glow"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-bounce-cards",
    "source": "reactbits",
    "title": "Bounce Cards",
    "url": "https://reactbits.dev/components/bounce-cards",
    "category": "card",
    "tags": [
      "component",
      "components",
      "bounce-cards",
      "card"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-bubble-menu",
    "source": "reactbits",
    "title": "Bubble Menu",
    "url": "https://reactbits.dev/components/bubble-menu",
    "category": "navigation",
    "tags": [
      "component",
      "components",
      "bubble-menu",
      "menu"
    ],
    "framework": "react",
    "bestFor": "Menus, navbars, and dashboard navigation that need active-state feedback.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "hero",
      "dashboard"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-card-nav",
    "source": "reactbits",
    "title": "Card Nav",
    "url": "https://reactbits.dev/components/card-nav",
    "category": "card",
    "tags": [
      "component",
      "components",
      "card-nav",
      "card",
      "nav"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-card-swap",
    "source": "reactbits",
    "title": "Card Swap",
    "url": "https://reactbits.dev/components/card-swap",
    "category": "card",
    "tags": [
      "component",
      "components",
      "card-swap",
      "card"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-carousel",
    "source": "reactbits",
    "title": "Carousel",
    "url": "https://reactbits.dev/components/carousel",
    "category": "list",
    "tags": [
      "component",
      "components",
      "carousel"
    ],
    "framework": "react",
    "bestFor": "Feature lists, stats groups, and repeated cards that should appear as a coordinated set.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "stats"
    ],
    "relatedPatternIds": [
      "metric-bento",
      "stats-strip"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-chroma-grid",
    "source": "reactbits",
    "title": "Chroma Grid",
    "url": "https://reactbits.dev/components/chroma-grid",
    "category": "background",
    "tags": [
      "component",
      "components",
      "chroma-grid",
      "grid"
    ],
    "framework": "react",
    "bestFor": "Hero and CTA sections that need motion atmosphere behind clear foreground content.",
    "avoidWhen": "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "banner-cta"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-circular-gallery",
    "source": "reactbits",
    "title": "Circular Gallery",
    "url": "https://reactbits.dev/components/circular-gallery",
    "category": "image",
    "tags": [
      "component",
      "components",
      "circular-gallery",
      "gallery"
    ],
    "framework": "react",
    "bestFor": "Media galleries, product previews, and visual card layouts.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "hero",
      "features",
      "cards"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-counter",
    "source": "reactbits",
    "title": "Counter",
    "url": "https://reactbits.dev/components/counter",
    "category": "list",
    "tags": [
      "component",
      "components",
      "counter"
    ],
    "framework": "react",
    "bestFor": "Feature lists, stats groups, and repeated cards that should appear as a coordinated set.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "stats",
      "dashboard"
    ],
    "relatedPatternIds": [
      "metric-bento",
      "stats-strip"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-decay-card",
    "source": "reactbits",
    "title": "Decay Card",
    "url": "https://reactbits.dev/components/decay-card",
    "category": "card",
    "tags": [
      "component",
      "components",
      "decay-card",
      "card"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-dock",
    "source": "reactbits",
    "title": "Dock",
    "url": "https://reactbits.dev/components/dock",
    "category": "navigation",
    "tags": [
      "component",
      "components",
      "dock"
    ],
    "framework": "react",
    "bestFor": "Menus, navbars, and dashboard navigation that need active-state feedback.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "hero",
      "dashboard"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-dome-gallery",
    "source": "reactbits",
    "title": "Dome Gallery",
    "url": "https://reactbits.dev/components/dome-gallery",
    "category": "image",
    "tags": [
      "component",
      "components",
      "dome-gallery",
      "gallery"
    ],
    "framework": "react",
    "bestFor": "Media galleries, product previews, and visual card layouts.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "hero",
      "features",
      "cards"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-elastic-slider",
    "source": "reactbits",
    "title": "Elastic Slider",
    "url": "https://reactbits.dev/components/elastic-slider",
    "category": "other",
    "tags": [
      "component",
      "components",
      "elastic-slider"
    ],
    "framework": "react",
    "bestFor": "Selected UI blocks that need a specific animation reference.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-flowing-menu",
    "source": "reactbits",
    "title": "Flowing Menu",
    "url": "https://reactbits.dev/components/flowing-menu",
    "category": "navigation",
    "tags": [
      "component",
      "components",
      "flowing-menu",
      "menu"
    ],
    "framework": "react",
    "bestFor": "Menus, navbars, and dashboard navigation that need active-state feedback.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "hero",
      "dashboard"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-fluid-glass",
    "source": "reactbits",
    "title": "Fluid Glass",
    "url": "https://reactbits.dev/components/fluid-glass",
    "category": "card",
    "tags": [
      "component",
      "components",
      "fluid-glass"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-flying-posters",
    "source": "reactbits",
    "title": "Flying Posters",
    "url": "https://reactbits.dev/components/flying-posters",
    "category": "image",
    "tags": [
      "component",
      "components",
      "flying-posters"
    ],
    "framework": "react",
    "bestFor": "Media galleries, product previews, and visual card layouts.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "hero",
      "features",
      "cards"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-folder",
    "source": "reactbits",
    "title": "Folder",
    "url": "https://reactbits.dev/components/folder",
    "category": "other",
    "tags": [
      "component",
      "components",
      "folder"
    ],
    "framework": "react",
    "bestFor": "Selected UI blocks that need a specific animation reference.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-glass-icons",
    "source": "reactbits",
    "title": "Glass Icons",
    "url": "https://reactbits.dev/components/glass-icons",
    "category": "card",
    "tags": [
      "component",
      "components",
      "glass-icons"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-glass-surface",
    "source": "reactbits",
    "title": "Glass Surface",
    "url": "https://reactbits.dev/components/glass-surface",
    "category": "card",
    "tags": [
      "component",
      "components",
      "glass-surface"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-gooey-nav",
    "source": "reactbits",
    "title": "Gooey Nav",
    "url": "https://reactbits.dev/components/gooey-nav",
    "category": "navigation",
    "tags": [
      "component",
      "components",
      "gooey-nav",
      "nav"
    ],
    "framework": "react",
    "bestFor": "Menus, navbars, and dashboard navigation that need active-state feedback.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "hero",
      "dashboard"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-infinite-menu",
    "source": "reactbits",
    "title": "Infinite Menu",
    "url": "https://reactbits.dev/components/infinite-menu",
    "category": "navigation",
    "tags": [
      "component",
      "components",
      "infinite-menu",
      "menu"
    ],
    "framework": "react",
    "bestFor": "Menus, navbars, and dashboard navigation that need active-state feedback.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "hero",
      "dashboard"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-lanyard",
    "source": "reactbits",
    "title": "Lanyard",
    "url": "https://reactbits.dev/components/lanyard",
    "category": "other",
    "tags": [
      "component",
      "components",
      "lanyard"
    ],
    "framework": "react",
    "bestFor": "Selected UI blocks that need a specific animation reference.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-magic-bento",
    "source": "reactbits",
    "title": "Magic Bento",
    "url": "https://reactbits.dev/components/magic-bento",
    "category": "card",
    "tags": [
      "component",
      "components",
      "magic-bento"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-masonry",
    "source": "reactbits",
    "title": "Masonry",
    "url": "https://reactbits.dev/components/masonry",
    "category": "list",
    "tags": [
      "component",
      "components",
      "masonry"
    ],
    "framework": "react",
    "bestFor": "Feature lists, stats groups, and repeated cards that should appear as a coordinated set.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "stats"
    ],
    "relatedPatternIds": [
      "metric-bento",
      "stats-strip"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-model-viewer",
    "source": "reactbits",
    "title": "Model Viewer",
    "url": "https://reactbits.dev/components/model-viewer",
    "category": "other",
    "tags": [
      "component",
      "components",
      "model-viewer"
    ],
    "framework": "react",
    "bestFor": "Selected UI blocks that need a specific animation reference.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-pill-nav",
    "source": "reactbits",
    "title": "Pill Nav",
    "url": "https://reactbits.dev/components/pill-nav",
    "category": "navigation",
    "tags": [
      "component",
      "components",
      "pill-nav",
      "nav"
    ],
    "framework": "react",
    "bestFor": "Menus, navbars, and dashboard navigation that need active-state feedback.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "hero",
      "dashboard"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-pixel-card",
    "source": "reactbits",
    "title": "Pixel Card",
    "url": "https://reactbits.dev/components/pixel-card",
    "category": "card",
    "tags": [
      "component",
      "components",
      "pixel-card",
      "card"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-profile-card",
    "source": "reactbits",
    "title": "Profile Card",
    "url": "https://reactbits.dev/components/profile-card",
    "category": "card",
    "tags": [
      "component",
      "components",
      "profile-card",
      "card"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-reflective-card",
    "source": "reactbits",
    "title": "Reflective Card",
    "url": "https://reactbits.dev/components/reflective-card",
    "category": "card",
    "tags": [
      "component",
      "components",
      "reflective-card",
      "card"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-scroll-stack",
    "source": "reactbits",
    "title": "Scroll Stack",
    "url": "https://reactbits.dev/components/scroll-stack",
    "category": "scroll",
    "tags": [
      "component",
      "components",
      "scroll-stack",
      "scroll"
    ],
    "framework": "react",
    "bestFor": "Long landing sections where content should enter progressively as users scroll.",
    "avoidWhen": "Avoid for dense dashboards or workflows where delayed content reduces scanning speed.",
    "relatedSectionTypes": [
      "hero",
      "features",
      "pricing",
      "testimonials"
    ],
    "relatedPatternIds": [
      "alternating-feature-rows",
      "workflow-feature-grid",
      "testimonial-wall"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-spotlight-card",
    "source": "reactbits",
    "title": "Spotlight Card",
    "url": "https://reactbits.dev/components/spotlight-card",
    "category": "card",
    "tags": [
      "component",
      "components",
      "spotlight-card",
      "card",
      "spotlight"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-stack",
    "source": "reactbits",
    "title": "Stack",
    "url": "https://reactbits.dev/components/stack",
    "category": "list",
    "tags": [
      "component",
      "components",
      "stack"
    ],
    "framework": "react",
    "bestFor": "Feature lists, stats groups, and repeated cards that should appear as a coordinated set.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "stats"
    ],
    "relatedPatternIds": [
      "metric-bento",
      "stats-strip"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-staggered-menu",
    "source": "reactbits",
    "title": "Staggered Menu",
    "url": "https://reactbits.dev/components/staggered-menu",
    "category": "list",
    "tags": [
      "component",
      "components",
      "staggered-menu",
      "stagger",
      "menu"
    ],
    "framework": "react",
    "bestFor": "Feature lists, stats groups, and repeated cards that should appear as a coordinated set.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "stats"
    ],
    "relatedPatternIds": [
      "alternating-feature-rows",
      "workflow-feature-grid",
      "testimonial-wall"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-stepper",
    "source": "reactbits",
    "title": "Stepper",
    "url": "https://reactbits.dev/components/stepper",
    "category": "other",
    "tags": [
      "component",
      "components",
      "stepper"
    ],
    "framework": "react",
    "bestFor": "Selected UI blocks that need a specific animation reference.",
    "avoidWhen": "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.",
    "relatedSectionTypes": [
      "unknown"
    ],
    "relatedPatternIds": [],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-components-tilted-card",
    "source": "reactbits",
    "title": "Tilted Card",
    "url": "https://reactbits.dev/components/tilted-card",
    "category": "card",
    "tags": [
      "component",
      "components",
      "tilted-card",
      "card",
      "tilt"
    ],
    "framework": "react",
    "bestFor": "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.",
    "avoidWhen": "Avoid when the surface already has many competing motion effects or must stay very utilitarian.",
    "relatedSectionTypes": [
      "features",
      "cards",
      "pricing"
    ],
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "pricing-emphasis"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-ascii-text",
    "source": "reactbits",
    "title": "Ascii Text",
    "url": "https://reactbits.dev/text-animations/ascii-text",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "ascii-text"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-blur-text",
    "source": "reactbits",
    "title": "Blur Text",
    "url": "https://reactbits.dev/text-animations/blur-text",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "blur-text",
      "blur"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-circular-text",
    "source": "reactbits",
    "title": "Circular Text",
    "url": "https://reactbits.dev/text-animations/circular-text",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "circular-text"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-count-up",
    "source": "reactbits",
    "title": "Count Up",
    "url": "https://reactbits.dev/text-animations/count-up",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "count-up"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "stats",
      "dashboard"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-curved-loop",
    "source": "reactbits",
    "title": "Curved Loop",
    "url": "https://reactbits.dev/text-animations/curved-loop",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "curved-loop"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-decrypted-text",
    "source": "reactbits",
    "title": "Decrypted Text",
    "url": "https://reactbits.dev/text-animations/decrypted-text",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "decrypted-text"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-falling-text",
    "source": "reactbits",
    "title": "Falling Text",
    "url": "https://reactbits.dev/text-animations/falling-text",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "falling-text"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-fuzzy-text",
    "source": "reactbits",
    "title": "Fuzzy Text",
    "url": "https://reactbits.dev/text-animations/fuzzy-text",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "fuzzy-text"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-glitch-text",
    "source": "reactbits",
    "title": "Glitch Text",
    "url": "https://reactbits.dev/text-animations/glitch-text",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "glitch-text"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-gradient-text",
    "source": "reactbits",
    "title": "Gradient Text",
    "url": "https://reactbits.dev/text-animations/gradient-text",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "gradient-text",
      "gradient"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-rotating-text",
    "source": "reactbits",
    "title": "Rotating Text",
    "url": "https://reactbits.dev/text-animations/rotating-text",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "rotating-text"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-scrambled-text",
    "source": "reactbits",
    "title": "Scrambled Text",
    "url": "https://reactbits.dev/text-animations/scrambled-text",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "scrambled-text"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-scroll-float",
    "source": "reactbits",
    "title": "Scroll Float",
    "url": "https://reactbits.dev/text-animations/scroll-float",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "scroll-float",
      "scroll"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "alternating-feature-rows",
      "workflow-feature-grid",
      "testimonial-wall"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-scroll-reveal",
    "source": "reactbits",
    "title": "Scroll Reveal",
    "url": "https://reactbits.dev/text-animations/scroll-reveal",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "scroll-reveal",
      "scroll",
      "reveal"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "alternating-feature-rows",
      "workflow-feature-grid",
      "testimonial-wall"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-scroll-velocity",
    "source": "reactbits",
    "title": "Scroll Velocity",
    "url": "https://reactbits.dev/text-animations/scroll-velocity",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "scroll-velocity",
      "scroll"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "alternating-feature-rows",
      "workflow-feature-grid",
      "testimonial-wall"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-shiny-text",
    "source": "reactbits",
    "title": "Shiny Text",
    "url": "https://reactbits.dev/text-animations/shiny-text",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "shiny-text"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-shuffle",
    "source": "reactbits",
    "title": "Shuffle",
    "url": "https://reactbits.dev/text-animations/shuffle",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "shuffle"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-split-text",
    "source": "reactbits",
    "title": "Split Text",
    "url": "https://reactbits.dev/text-animations/split-text",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "split-text",
      "split"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-text-cursor",
    "source": "reactbits",
    "title": "Text Cursor",
    "url": "https://reactbits.dev/text-animations/text-cursor",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "text-cursor",
      "cursor"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-text-pressure",
    "source": "reactbits",
    "title": "Text Pressure",
    "url": "https://reactbits.dev/text-animations/text-pressure",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "text-pressure"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-text-type",
    "source": "reactbits",
    "title": "Text Type",
    "url": "https://reactbits.dev/text-animations/text-type",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "text-type"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-true-focus",
    "source": "reactbits",
    "title": "True Focus",
    "url": "https://reactbits.dev/text-animations/true-focus",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "true-focus"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  },
  {
    "id": "reactbits-text-animations-variable-proximity",
    "source": "reactbits",
    "title": "Variable Proximity",
    "url": "https://reactbits.dev/text-animations/variable-proximity",
    "category": "text",
    "tags": [
      "text",
      "animation",
      "text-animations",
      "variable-proximity"
    ],
    "framework": "react",
    "bestFor": "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.",
    "avoidWhen": "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.",
    "relatedSectionTypes": [
      "hero",
      "cta"
    ],
    "relatedPatternIds": [
      "split-hero",
      "centered-hero",
      "hero-product-preview"
    ],
    "usageNote": "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.",
    "scrapedAt": "2026-06-06T17:29:57.590Z"
  }
];

export const animationReferences: AnimationReference[] = [
  ...reactbitsAnimationReferences,
  ...watermelonAnimationReferences,
  ...motionPrimitivesAnimationReferences,
  ...animateUiAnimationReferences,
  ...magicUiAnimationReferences,
  ...aceternityAnimationReferences,
  ...motionGuidelineReferences
];
