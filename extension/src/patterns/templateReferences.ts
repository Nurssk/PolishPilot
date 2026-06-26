import { watermelonTemplateReferences } from "./watermelonTemplateReferences";
import { typeUiDesignSkillReferences } from "./typeUiDesignSkillReferences";
import { huashuDesignReferences } from "./huashuDesignReferences";
import { uiUxProMaxReferences } from "./uiUxProMaxReferences";
import { tasteSkillReferences } from "./tasteSkillReferences";
import { antiAiSlopWritingReferences } from "./antiAiSlopWritingReferences";
import { hallmarkDesignReferences } from "./hallmarkDesignReferences";
import { stopSlopReferences } from "./stopSlopReferences";
import { antiAiSlopPackReferences } from "./antiAiSlopPackReferences";
import { interfaceDesignReferences } from "./interfaceDesignReferences";
import { magicUiTemplateReferences } from "./magicUiTemplateReferences";
import { aceternityTemplateReferences } from "./aceternityTemplateReferences";
import { layoutGuidelineReferences } from "./layoutGuidelineReferences";
import { interactionGuidelineReferences } from "./interactionGuidelineReferences";
import { visualSystemGuidelineReferences } from "./visualSystemGuidelineReferences";
import { dataVisualizationGuidelineReferences } from "./dataVisualizationGuidelineReferences";
import { tableGuidelineReferences } from "./tableGuidelineReferences";
import { navigationGuidelineReferences } from "./navigationGuidelineReferences";

export type TemplateSource =
  | "21st.dev"
  | "watermelon-ui"
  | "typeui-design-skills"
  | "huashu-design"
  | "ui-ux-pro-max"
  | "taste-skill"
  | "anti-ai-slop-writing"
  | "hallmark"
  | "stop-slop"
  | "anti-ai-slop-pack"
  | "interface-design"
  | "magic-ui"
  | "aceternity-ui"
  | "nng-ux-guidelines"
  | "baymard-ux"
  | "wai-aria-apg"
  | "wcag-wai"
  | "govuk-design-system"
  | "material-design"
  | "carbon-design-system"
  | "apple-hig"
  | "carbon-data-viz"
  | "uswds"
  | "carbon-table"
  | "ons-design-system"
  | "carbon-navigation"
  | "material-navigation";

export type TemplateCategory =
  | "hero"
  | "features"
  | "pricing"
  | "cta"
  | "testimonials"
  | "forms"
  | "cards"
  | "buttons"
  | "dashboard"
  | "navigation"
  | "footer"
  | "auth"
  | "settings"
  | "other";

export type TemplateReference = {
  id: string;
  source: TemplateSource;
  title: string;
  url: string;
  category: TemplateCategory;
  tags: string[];
  keywords?: string[];
  description?: string;
  author?: string;
  previewImageUrl?: string;
  relatedPatternIds: string[];
  usageNote: string;
  scrapedAt: string;
  urlStatus?: "ok" | "broken" | "unknown";
  checkedAt?: string;
  fallbackUrl?: string;
};

const communityTemplateReferences: TemplateReference[] = [
  {
    "id": "21st-dev-abdulali254-aurora-button",
    "source": "21st.dev",
    "title": "Aurora Button",
    "url": "https://21st.dev/community/components/s/buttons",
    "category": "buttons",
    "tags": [
      "button",
      "border"
    ],
    "description": "The AuroraButton is a customizable React component that creates a button with a beautiful, animated gradient border effect. When you hover over the button, the border glows with an aurora-like effect, using a blend of purple, cyan, and emerald colors. The button itself has a dark glass-like appearance with a transparent background, making it suitable for modern, elegant user interfaces.",
    "author": "Abdul D'braun",
    "previewImageUrl": "https://cdn.21st.dev/user_2sL0eM87CfXisyj7dkJIIY1lpEQ/aurora-button/default/preview.1738226297855.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-aceternity-action-search-bar",
    "source": "21st.dev",
    "title": "Action Search Bar",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "call-to-action",
      "input",
      "combobox"
    ],
    "description": "Action search bar inspired from Raycast",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/action-search-bar/default/preview.1737986716282.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-aceternity-animated-ai-input",
    "source": "21st.dev",
    "title": "Animated AI Input",
    "url": "https://21st.dev/community/components/s/forms",
    "category": "forms",
    "tags": [
      "input",
      "ai-chat",
      "ai",
      "textarea"
    ],
    "description": "AI input with animated model switching.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/animated-ai-input/default/preview.1746444542947.png",
    "relatedPatternIds": [
      "form-benefits-sidebar",
      "compact-lead-form"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/forms"
  },
  {
    "id": "21st-dev-aceternity-animated-hero",
    "source": "21st.dev",
    "title": "Animated hero",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "hero",
      "buttons"
    ],
    "description": "Animated hero with text and two shadcn/ui buttons",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/animated-hero.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-aceternity-animated-text-cycle",
    "source": "21st.dev",
    "title": "Animated Text Cycle",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "text",
      "text-effects",
      "landing-page",
      "animation",
      "hero"
    ],
    "description": "Component to smoothly animate a list of words. Can be used in Hero sections for example. Built using Framer Motion. Animation can be easily changed in the component.",
    "author": "Jatin Yadav",
    "previewImageUrl": "https://cdn.21st.dev/user_2ue7h0Xyywk5R5wzsNX1W8bcJq3/animated-text-cycle/animated-text-cycle/preview.png?v=1",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-aceternity-aurora-background",
    "source": "21st.dev",
    "title": "Aurora Background",
    "url": "https://21st.dev/community/components/aceternity/aurora-background",
    "category": "other",
    "tags": [
      "backgrounds",
      "background"
    ],
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/aurora-background.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:11.555Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-aceternity-background-boxes",
    "source": "21st.dev",
    "title": "Background Boxes",
    "url": "https://21st.dev/community/components/aceternity/background-boxes",
    "category": "other",
    "tags": [
      "gradient",
      "backgrounds",
      "bento",
      "statistics",
      "landing-page",
      "background"
    ],
    "description": "A full width background box container that highlights on hover",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/background-boxes.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:12.357Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-aceternity-background-gradient-animation",
    "source": "21st.dev",
    "title": "Background Gradient Animation",
    "url": "https://21st.dev/community/components/aceternity/background-gradient-animation",
    "category": "hero",
    "tags": [
      "hero",
      "landing-page",
      "backgrounds",
      "background"
    ],
    "description": "A smooth and elegant background gradient animation that changes the gradient position over time.",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/background-gradient-animation.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:13.452Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-aceternity-background-paths",
    "source": "21st.dev",
    "title": "Background Paths",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "landing-page",
      "call-to-action",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "Landing Background paths with Gradient Title",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/background-paths/default/preview.png?v=1",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-aceternity-container-scroll-animation",
    "source": "21st.dev",
    "title": "Container Scroll Animation",
    "url": "https://21st.dev/community/components/aceternity/container-scroll-animation",
    "category": "hero",
    "tags": [
      "3d-elements",
      "hero",
      "spline",
      "features"
    ],
    "description": "A React component that integrates Spline 3D scenes.\\n\\nDemo component combines interactive 3D visualization with a spotlight effect and responsive text content.\\n\\nFeatures:\\n\\t•\\tLazy-loaded Spline integration\\n\\t•\\tResponsive layout with flex columns\\n\\t•\\tGradient text effects\\n\\t•\\tSpotlight background effect\\n\\t•\\tDark theme optimized\\n\\n",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/container-scroll-animation.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:15.112Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-aceternity-display-cards",
    "source": "21st.dev",
    "title": "Display Cards",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "landing-page",
      "card",
      "features",
      "cards"
    ],
    "description": "A visually appealing stacked card layout with hover animations and grayscale effects.\\n\\nFeatures:\\n\\t•\\tStacked card layout\\n\\t•\\tHover animations\\n\\t•\\tGrayscale effects\\n\\t•\\tCustom icons\\n\\t•\\tResponsive design\\n\\t•\\tDark mode support\\n\\t•\\tCustomizable styles\\n\\t•\\tAccessible markup\\n\\nNotes:\\n\\t•\\tBuilt with Tailwind CSS for responsive design\\n\\t•\\tUses CSS Grid for stacking cards\\n\\t•\\tImplements smooth hover animations\\n\\t•\\tSupports custom icons from any library\\n\\t•\\tIncludes grayscale hover effects\\n\\t•\\tMaintains consistent spacing\\n\\t•\\tSupports dark mode\\n\\t•\\tTypeScript support with proper types\\n\\n",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_Codehagen/display-cards.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-aceternity-hand-writing-text",
    "source": "21st.dev",
    "title": "Hand Writing Text",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "motion-primitives",
      "text-effects",
      "text",
      "call-to-action"
    ],
    "description": "A nice svg hand written text",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/hand-writing-text/default/preview.png?v=2",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-aceternity-hero-highlight",
    "source": "21st.dev",
    "title": "Hero Highlight",
    "url": "https://21st.dev/community/components/aceternity/hero-highlight",
    "category": "hero",
    "tags": [
      "landing-page",
      "gradient",
      "backgrounds",
      "call-to-action",
      "card",
      "background",
      "hero"
    ],
    "description": "A background effect with a text highlight component, perfect for hero sections.",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/hero-highlight.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:17.524Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-aceternity-lamp",
    "source": "21st.dev",
    "title": "Lamp",
    "url": "https://21st.dev/community/components/aceternity/lamp",
    "category": "hero",
    "tags": [
      "hero",
      "video",
      "video-player",
      "image",
      "image-expansion",
      "video-expansion",
      "framer-motion",
      "motion",
      "scroll-animation",
      "scrolltrigger",
      "scroll-effect",
      "scroll-area"
    ],
    "description": "A modern, interactive media component for Next.js that expands videos or images as users scroll, creating an engaging and immersive experience.\\n",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/lamp.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:18.186Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-aceternity-link-preview",
    "source": "21st.dev",
    "title": "Link Preview",
    "url": "https://21st.dev/community/components/aceternity/link-preview",
    "category": "hero",
    "tags": [
      "text",
      "text-effects",
      "landing-page",
      "animation",
      "hero"
    ],
    "description": "Component to smoothly animate a list of words. Can be used in Hero sections for example. Built using Framer Motion. Animation can be easily changed in the component.",
    "author": "Jatin Yadav",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/link-preview.png",
    "relatedPatternIds": [
      "hero-product-preview",
      "split-hero",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:19.544Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-aceternity-pulse-beams",
    "source": "21st.dev",
    "title": "Pulse Beams",
    "url": "https://21st.dev/community/components/aceternity/pulse-beams",
    "category": "cta",
    "tags": [
      "3d-elements",
      "call-to-action",
      "backgrounds",
      "footer",
      "landing-page",
      "card",
      "background"
    ],
    "description": "A full width background box container that highlights on hover",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/pulse-beams/default/preview.png?v=1",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:20.516Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-aceternity-radar-effect",
    "source": "21st.dev",
    "title": "Radar Effect",
    "url": "https://21st.dev/community/components/aceternity/radar-effect",
    "category": "other",
    "tags": [
      "backgrounds",
      "background"
    ],
    "description": "Here is Background Components component",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/aceternity/radar-effect/demos/default/preview.1773405167421.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:21.296Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-aceternity-scroll-expansion-hero",
    "source": "21st.dev",
    "title": "Scroll media expansion hero",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "hero",
      "video",
      "video-player",
      "image",
      "image-expansion",
      "video-expansion",
      "framer-motion",
      "motion",
      "scroll-animation",
      "scrolltrigger",
      "scroll-effect",
      "scroll-area"
    ],
    "description": "A modern, interactive media component for Next.js that expands videos or images as users scroll, creating an engaging and immersive experience.\\n",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_2wfnj4jcSPR8JWRk7tpzrihdDV8/scroll-expansion-hero/default/preview.1746632883284.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-aceternity-sparkles",
    "source": "21st.dev",
    "title": "Sparkles",
    "url": "https://21st.dev/community/components/aceternity/sparkles",
    "category": "hero",
    "tags": [
      "highlight",
      "hero",
      "landing-page",
      "backgrounds",
      "background"
    ],
    "description": "A configurable sparkles component that can be used as a background or as a standalone component.",
    "author": "Magic UI",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/sparkles.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:22.896Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-aceternity-splite",
    "source": "21st.dev",
    "title": "Spline Scene",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "3d-elements",
      "hero",
      "spline",
      "features"
    ],
    "description": "A React component that integrates Spline 3D scenes.\\n\\nDemo component combines interactive 3D visualization with a spotlight effect and responsive text content.\\n\\nFeatures:\\n\\t•\\tLazy-loaded Spline integration\\n\\t•\\tResponsive layout with flex columns\\n\\t•\\tGradient text effects\\n\\t•\\tSpotlight background effect\\n\\t•\\tDark theme optimized\\n\\n",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/splite.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-aceternity-tubelight-navbar",
    "source": "21st.dev",
    "title": "Tubelight Navbar",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "landing-page",
      "navigation-menus",
      "navbar-navigation",
      "features",
      "navigation"
    ],
    "description": "A sleek and modern navigation bar component with smooth animations and a dynamic indicator. Perfect for primary navigation in web applications.\\n\\nFeatures\\n- Animated tab indicator with glowing effect\\n- Responsive design (mobile & desktop views)\\n- Icons for mobile view, text for desktop\\n- Dark/Light theme support\\n- Frosted glass effect for active state\\n- Smooth transitions between tabs\\n- Built with Framer Motion for fluid animations\\n\\n",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_ayushmxxn/tubelight-navbar.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-aceternity-typewriter-effect",
    "source": "21st.dev",
    "title": "Typewriter Effect",
    "url": "https://21st.dev/community/components/aceternity/typewriter-effect",
    "category": "cta",
    "tags": [
      "motion-primitives",
      "text-effects",
      "text",
      "call-to-action"
    ],
    "description": "A nice svg hand written text",
    "author": "aceternity",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/typewriter-effect.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:25.333Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-aghasisahakyan1-section-with-mockup",
    "source": "21st.dev",
    "title": "Section With Mockup",
    "url": "https://21st.dev/community/components/aghasisahakyan1/section-with-mockup",
    "category": "features",
    "tags": [
      "tabs",
      "features"
    ],
    "description": "A versatile section with 3 features inside a tabs component",
    "author": "Erik X",
    "previewImageUrl": "https://cdn.21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/section-with-mockup/default/preview.1746632628368.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:26.456Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-aghasisahakyan1-shadcnblocks-com-feature108",
    "source": "21st.dev",
    "title": "Feature 108",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "tabs",
      "features"
    ],
    "description": "A versatile section with 3 features inside a tabs component",
    "author": "Erik X",
    "previewImageUrl": "https://cdn.21st.dev/user_2rguB0QxcSITG2Y7ivePFsKsUU6/shadcnblocks-com-feature108/default/preview.1737979331417.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-aghasisahakyan1-sign-in-flow-1",
    "source": "21st.dev",
    "title": "Sign In Flow",
    "url": "https://21st.dev/community/components/aghasisahakyan1/sign-in-flow-1",
    "category": "auth",
    "tags": [
      "button",
      "theme-toggle"
    ],
    "description": "Cool Toggles with framer motion animations that you can copy-paste into your apps.",
    "author": "Erik X",
    "previewImageUrl": "https://cdn.21st.dev/nubmaster4568/sign-in-flow-1/default/preview.1747131539764.png",
    "relatedPatternIds": [
      "form-benefits-sidebar",
      "compact-lead-form"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:28.721Z",
    "fallbackUrl": "https://21st.dev/community/components/s/auth"
  },
  {
    "id": "21st-dev-aghasisahakyan1-theme-toggle",
    "source": "21st.dev",
    "title": "Theme Toggle",
    "url": "https://21st.dev/community/components/s/buttons",
    "category": "buttons",
    "tags": [
      "button",
      "theme-toggle"
    ],
    "description": "Cool Toggles with framer motion animations that you can copy-paste into your apps.",
    "author": "Erik X",
    "previewImageUrl": "https://cdn.21st.dev/user_ayushmxxn/theme-toggle.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-arunachalam0606-scroll-expansion-hero",
    "source": "21st.dev",
    "title": "Scroll media expansion hero",
    "url": "https://21st.dev/community/components/arunachalam0606/scroll-expansion-hero",
    "category": "hero",
    "tags": [
      "landing-page",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "A nicely landing with shapes and color.",
    "author": "Arunachalam",
    "previewImageUrl": "https://cdn.21st.dev/user_2wfnj4jcSPR8JWRk7tpzrihdDV8/scroll-expansion-hero/default/preview.1746632883284.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:30.423Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-arunachalam0606-shape-landing-hero",
    "source": "21st.dev",
    "title": "Shape Landing Hero",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "landing-page",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "A nicely landing with shapes and color.",
    "author": "Arunachalam",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/shape-landing-hero/default/preview.1737988084934.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-ayushmxxn-3d-testimonails",
    "source": "21st.dev",
    "title": "3D Testimonails",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "3d-effects",
      "testimonials",
      "3d-background",
      "users",
      "marquee",
      "3d-elements",
      "hero",
      "heros"
    ],
    "description": "A marquee component continuously scrolls text, images, or videos in an infinite loop, with customizable speed, direction, and responsive design for engaging displays.",
    "author": "ayushmxxn",
    "previewImageUrl": "https://cdn.21st.dev/sean0205/3d-testimonails/default/preview.1751128591723.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-ayushmxxn-animated-hero",
    "source": "21st.dev",
    "title": "Animated hero",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "hero",
      "buttons"
    ],
    "description": "Animated hero with text and two shadcn/ui buttons",
    "author": "ayushmxxn",
    "previewImageUrl": "https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/animated-hero.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-ayushmxxn-testimonials",
    "source": "21st.dev",
    "title": "Testimonials",
    "url": "https://21st.dev/community/components/ayushmxxn/testimonials",
    "category": "hero",
    "tags": [
      "3d-effects",
      "testimonials",
      "3d-background",
      "users",
      "marquee",
      "3d-elements",
      "hero",
      "heros",
      "testimonial"
    ],
    "description": "A marquee component continuously scrolls text, images, or videos in an infinite loop, with customizable speed, direction, and responsive design for engaging displays.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_ayushmxxn/testimonials.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:33.935Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-ayushmxxn-theme-toggle",
    "source": "21st.dev",
    "title": "Theme Toggle",
    "url": "https://21st.dev/community/components/ayushmxxn/theme-toggle",
    "category": "hero",
    "tags": [
      "text-effects",
      "hero",
      "text",
      "landing-page",
      "call-to-action"
    ],
    "description": "Text generates as if it is being typed on the screen.",
    "author": "Erik X",
    "previewImageUrl": "https://cdn.21st.dev/user_ayushmxxn/theme-toggle.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:35.143Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-ayushmxxn-tubelight-navbar",
    "source": "21st.dev",
    "title": "Tubelight Navbar",
    "url": "https://21st.dev/community/components/ayushmxxn/tubelight-navbar",
    "category": "hero",
    "tags": [
      "hero",
      "buttons"
    ],
    "description": "Animated hero with text and two shadcn/ui buttons",
    "author": "ayushmxxn",
    "previewImageUrl": "https://cdn.21st.dev/user_ayushmxxn/tubelight-navbar.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:36.293Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-ayushmxxn-typewriter-effect",
    "source": "21st.dev",
    "title": "Typewriter Effect",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "text-effects",
      "hero",
      "text",
      "landing-page",
      "call-to-action"
    ],
    "description": "Text generates as if it is being typed on the screen.",
    "author": "Erik X",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/typewriter-effect.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-bankkroll-animated-glassy-pricing",
    "source": "21st.dev",
    "title": "Animated Glassy Pricing",
    "url": "https://21st.dev/community/components/s/pricing",
    "category": "pricing",
    "tags": [
      "webgl",
      "animated",
      "pricing-card",
      "animation",
      "backdrop-blur",
      "3d-background",
      "background-animation",
      "customizable",
      "customizable-background",
      "easemize-ui",
      "pricing",
      "pricing-cards"
    ],
    "description": "Animated Glassy Pricing",
    "author": "Bankk",
    "previewImageUrl": "https://cdn.21st.dev/easemize/animated-glassy-pricing/default/preview.1750949491192.png",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-bankkroll-animated-testimonials",
    "source": "21st.dev",
    "title": "Animated Testimonials",
    "url": "https://21st.dev/community/components/s/testimonials",
    "category": "testimonials",
    "tags": [
      "testimonials",
      "glassmorphism",
      "testimonial",
      "cards"
    ],
    "description": "Draggable Testimonial Cards with Glassmorphism",
    "author": "Bankk",
    "previewImageUrl": "https://cdn.21st.dev/user_2vDrVta4PKJEhGZOxwYiAcxSKTV/animated-testimonials/default/preview.1744401112544.png",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-bankkroll-pricing-card",
    "source": "21st.dev",
    "title": "Pricing Card",
    "url": "https://21st.dev/community/components/bankkroll/pricing-card",
    "category": "pricing",
    "tags": [
      "webgl",
      "animated",
      "pricing-card",
      "animation",
      "backdrop-blur",
      "3d-background",
      "background-animation",
      "customizable",
      "customizable-background",
      "easemize-ui",
      "pricing",
      "pricing-cards"
    ],
    "description": "Animated Glassy Pricing",
    "author": "Bankk",
    "previewImageUrl": "https://cdn.21st.dev/user_BankkRoll/pricing-card.png",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:39.984Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-bankkroll-pricing-cards",
    "source": "21st.dev",
    "title": "Pricing Section",
    "url": "https://21st.dev/community/components/s/pricing",
    "category": "pricing",
    "tags": [
      "pricing-section",
      "pricing-card",
      "pricing",
      "cards"
    ],
    "description": "Pricing Cards",
    "author": "Bankk",
    "previewImageUrl": "https://cdn.21st.dev/user_tommyjepsen/pricing-cards.png",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-bankkroll-single-pricing-card",
    "source": "21st.dev",
    "title": "Single Pricing Card",
    "url": "https://21st.dev/community/components/s/pricing",
    "category": "pricing",
    "tags": [
      "pricing-section",
      "pricing-card",
      "pricing",
      "cards"
    ],
    "description": "Pricing Cards",
    "author": "Bankk",
    "previewImageUrl": "https://cdn.21st.dev/user_2vDrVta4PKJEhGZOxwYiAcxSKTV/single-pricing-card/default/preview.1744402058872.png",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-bankkroll-testimonial-cards",
    "source": "21st.dev",
    "title": "Testimonial Cards",
    "url": "https://21st.dev/community/components/s/testimonials",
    "category": "testimonials",
    "tags": [
      "testimonials",
      "glassmorphism",
      "testimonial",
      "cards"
    ],
    "description": "Draggable Testimonial Cards with Glassmorphism",
    "author": "Bankk",
    "previewImageUrl": "https://cdn.21st.dev/user_2rV0b4mwh6SKrMK7lUyQUkzEa92/testimonial-cards/testimonial-cards/preview.png?v=1",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-chetanverma16-floating-action-menu",
    "source": "21st.dev",
    "title": "Floating Action Menu",
    "url": "https://21st.dev/community/components/chetanverma16/floating-action-menu",
    "category": "cta",
    "tags": [
      "call-to-action",
      "button"
    ],
    "author": "Chetan Verma",
    "previewImageUrl": "https://cdn.21st.dev/user_2rc5PfL1BTeoSaeKi50f3UeVfRn/floating-action-menu/default/preview.png?v=1",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:43.415Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-chetanverma16-magnetize-button",
    "source": "21st.dev",
    "title": "Magnetize Button",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "call-to-action",
      "button"
    ],
    "author": "Chetan Verma",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/magnetize-button.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-codehagen-display-cards",
    "source": "21st.dev",
    "title": "Display Cards",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "text",
      "landing-page",
      "hero",
      "features",
      "cards"
    ],
    "description": "A fluid text morphing component that creates smooth, gooey transitions between words. This component is designed to work seamlessly with shadcn/ui themes, providing an engaging visual effect for hero sections, loading states, or interactive text displays.\\n\\nFeatures\\n- Smooth morphing transitions between text phrases\\n- Customizable animation timing\\n- Gooey effect using SVG filters\\n- Automatic theme adaptation with shadcn/ui\\n- Responsive text sizing\\n- Fully customizable styling\\n- TypeScript support\\n\\nProps\\n- `texts` - Array of strings to cycle through\\n- `morphTime` - Duration of morphing animation in seconds (default: 1)\\n- `cooldownTime` - Pause duration between morphs in seconds (default: 0.25)\\n- `className` - Additional classes for container\\n- `textClassName` - Additional classes for text elements (overrides theme text color if specified)",
    "author": "Jatin Yadav",
    "previewImageUrl": "https://cdn.21st.dev/user_Codehagen/display-cards.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-codehagen-gooey-text-morphing",
    "source": "21st.dev",
    "title": "Gooey Text Morphing",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "text",
      "landing-page",
      "hero",
      "features"
    ],
    "description": "A fluid text morphing component that creates smooth, gooey transitions between words. This component is designed to work seamlessly with shadcn/ui themes, providing an engaging visual effect for hero sections, loading states, or interactive text displays.\\n\\nFeatures\\n- Smooth morphing transitions between text phrases\\n- Customizable animation timing\\n- Gooey effect using SVG filters\\n- Automatic theme adaptation with shadcn/ui\\n- Responsive text sizing\\n- Fully customizable styling\\n- TypeScript support\\n\\nProps\\n- `texts` - Array of strings to cycle through\\n- `morphTime` - Duration of morphing animation in seconds (default: 1)\\n- `cooldownTime` - Pause duration between morphs in seconds (default: 0.25)\\n- `className` - Additional classes for container\\n- `textClassName` - Additional classes for text elements (overrides theme text color if specified)",
    "author": "Jatin Yadav",
    "previewImageUrl": "https://cdn.21st.dev/user_victorwelander/gooey-text-morphing.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-codehagen-hero-badge",
    "source": "21st.dev",
    "title": "Hero Badge",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "announcements",
      "hero",
      "announcement",
      "features"
    ],
    "description": "A versatile, animated badge component for highlighting new features, announcements, or important links.\\n\\nFeatures:\\n\\t•\\tSmooth entrance animations\\n\\t•\\tIcon rotation on hover\\n\\t•\\tMultiple size variants\\n\\t•\\tMultiple style variants\\n\\t•\\tLink and button functionality\\n\\t•\\tCustomizable icons\\n\\t•\\tResponsive design\\n\\t•\\tAccessibility features\\nNotes:\\n\\t•\\tBuilt with Framer Motion for smooth animations\\n\\t•\\tUses React Server Components (RSC) with the \\",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/user_Codehagen/hero-badge.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-codehagen-hero-pill",
    "source": "21st.dev",
    "title": "Hero Pill",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "call-to-action",
      "cursor",
      "announcements",
      "highlight",
      "banner",
      "announcement",
      "hero",
      "features",
      "form"
    ],
    "description": "A stunning and interactive announcement banner featuring smooth animations and customizable content.\\n\\nFeatures:\\n\\t•\\tFluid entrance animations\\n\\t•\\tCustomizable content and styling options\\n\\t•\\tMobile-responsive design for optimal viewing on all devices\\n\\t•\\tSupport for icons and links\\n\\t•\\tAccessible design with ARIA attributes\\n\\t•\\tTypeScript support for enhanced development experience\\n\\t•\\tServer-Side Rendering (SSR) compatibility\\n\\nNotes:\\n\\t•\\tPowered by Framer Motion for seamless animations\\n\\t•\\tFully typed using TypeScript for improved code quality and maintainability\\n\\t•\\tImplemented as a Server Component with client-side hydration for optimal performance\\n\\t•\\tDesigned with a mobile-first approach to ensure responsiveness across devices\\n\\t•\\tCustomizable through props for easy integration and reusability\\n\\t•\\tOptimized bundle size for efficient loading and performance\\n\\t•\\tReusable across various contexts and projects\\n\\n",
    "author": "Codehagen",
    "previewImageUrl": "https://cdn.21st.dev/user_Codehagen/hero-pill.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-codehagen-pricing",
    "source": "21st.dev",
    "title": "Pricing",
    "url": "https://21st.dev/community/components/s/pricing",
    "category": "pricing",
    "tags": [
      "card",
      "call-to-action",
      "testimonials",
      "tweets",
      "pricing"
    ],
    "description": "A nice gradient Card displaying a post from X (Twitter)",
    "author": "Codehagen",
    "previewImageUrl": "https://cdn.21st.dev/user_Codehagen/pricing.png",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-codehagen-splite",
    "source": "21st.dev",
    "title": "Spline Scene",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "3d-elements",
      "hero",
      "spline",
      "features"
    ],
    "description": "A React component that integrates Spline 3D scenes.\\n\\nDemo component combines interactive 3D visualization with a spotlight effect and responsive text content.\\n\\nFeatures:\\n\\t•\\tLazy-loaded Spline integration\\n\\t•\\tResponsive layout with flex columns\\n\\t•\\tGradient text effects\\n\\t•\\tSpotlight background effect\\n\\t•\\tDark theme optimized\\n\\n",
    "author": "Codehagen",
    "previewImageUrl": "https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/splite.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-codehagen-x-gradient-card",
    "source": "21st.dev",
    "title": "X Gradient Card",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "card",
      "call-to-action",
      "testimonials",
      "tweets"
    ],
    "description": "A nice gradient Card displaying a post from X (Twitter)",
    "author": "Codehagen",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/x-gradient-card/default/preview.png?v=2",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-cybergaz-button-colorful",
    "source": "21st.dev",
    "title": "Button Colorful with Hover Effect",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "button",
      "call-to-action"
    ],
    "author": "Gaz",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/button-colorful.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-cybergaz-neon-button",
    "source": "21st.dev",
    "title": "Neon Button",
    "url": "https://21st.dev/community/components/cybergaz/neon-button",
    "category": "buttons",
    "tags": [
      "button",
      "border"
    ],
    "description": "a simple and clean neon bordered button with hover effect",
    "author": "Gaz",
    "previewImageUrl": "https://cdn.21st.dev/user_2sAqoiqsju5FgfPpyDU67flpOxe/neon-button/default/preview.1738079756934.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:51.918Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-danielpetho-animated-gradient-with-svg",
    "source": "21st.dev",
    "title": "Animated Gradient With SVG",
    "url": "https://21st.dev/community/components/danielpetho/animated-gradient-with-svg",
    "category": "hero",
    "tags": [
      "backgrounds",
      "pattern",
      "hero",
      "landing-page",
      "background"
    ],
    "description": "An animated multi-color gradient background effect with SVG elements.\\n\\nAnimated gradients can be achieved with many different techniques (shaders, CSS gradients, etc.), this component uses simple SVG circles with a blur filter to create the effect.\\n\\n1. For each color in the colors prop array, the component creates an SVG circle element\\n2. Each circle is given a random initial position using percentage values\\n3. The movement of each circle is controlled by 8 CSS variables that define target positions:\\n--tx-1 and --ty-1 for the first position\\n--tx-2 and --ty-2 for the second position\\nAnd so on for positions 3 and 4\\n4. These variables are set to random values between -0.5 and 0.5.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_danielpetho/animated-gradient-with-svg.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:53.105Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-danielpetho-gooey-filter",
    "source": "21st.dev",
    "title": "Gooey Filter",
    "url": "https://21st.dev/community/components/danielpetho/gooey-filter",
    "category": "hero",
    "tags": [
      "landing-page",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "An svg filter component that creates a gooey effect on the background. Can be used to create fluid interfaces or rounded-at-all-corners panels. Limited support for Safari.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_danielpetho/gooey-filter/default/preview.png?v=1",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:54.134Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-danielpetho-gooey-text-morphing",
    "source": "21st.dev",
    "title": "Gooey Text Morphing",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "text",
      "landing-page",
      "hero",
      "features"
    ],
    "description": "A fluid text morphing component that creates smooth, gooey transitions between words. This component is designed to work seamlessly with shadcn/ui themes, providing an engaging visual effect for hero sections, loading states, or interactive text displays.\\n\\nFeatures\\n- Smooth morphing transitions between text phrases\\n- Customizable animation timing\\n- Gooey effect using SVG filters\\n- Automatic theme adaptation with shadcn/ui\\n- Responsive text sizing\\n- Fully customizable styling\\n- TypeScript support\\n\\nProps\\n- `texts` - Array of strings to cycle through\\n- `morphTime` - Duration of morphing animation in seconds (default: 1)\\n- `cooldownTime` - Pause duration between morphs in seconds (default: 0.25)\\n- `className` - Additional classes for container\\n- `textClassName` - Additional classes for text elements (overrides theme text color if specified)",
    "author": "Magic UI",
    "previewImageUrl": "https://cdn.21st.dev/user_victorwelander/gooey-text-morphing.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-danielpetho-pixel-trail",
    "source": "21st.dev",
    "title": "Pixel Trail",
    "url": "https://21st.dev/community/components/danielpetho/pixel-trail",
    "category": "hero",
    "tags": [
      "landing-page",
      "call-to-action",
      "backgrounds",
      "hero",
      "background"
    ],
    "description": "You can customize the individual pixels by passing a pixelClassName prop.\\n\\n1. The component operates by dividing the container into a grid of pixels and dynamically recoloring them as you move your cursor. Each pixel is represented by a single div element, so perf may be impacted when using a large number of pixels, especially on the first render.\\n\\n2. Keep the z-index of the effect's container lower than the rest of your content, so the pointer-events will captured by all of your other elements.",
    "author": "Magic UI",
    "previewImageUrl": "https://cdn.21st.dev/user_danielpetho/pixel-trail.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:55.731Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-danielpetho-typewriter",
    "source": "21st.dev",
    "title": "Typewriter",
    "url": "https://21st.dev/community/components/danielpetho/typewriter",
    "category": "hero",
    "tags": [
      "text",
      "landing-page",
      "hero",
      "features"
    ],
    "description": "A fluid text morphing component that creates smooth, gooey transitions between words. This component is designed to work seamlessly with shadcn/ui themes, providing an engaging visual effect for hero sections, loading states, or interactive text displays.\\n\\nFeatures\\n- Smooth morphing transitions between text phrases\\n- Customizable animation timing\\n- Gooey effect using SVG filters\\n- Automatic theme adaptation with shadcn/ui\\n- Responsive text sizing\\n- Fully customizable styling\\n- TypeScript support\\n\\nProps\\n- `texts` - Array of strings to cycle through\\n- `morphTime` - Duration of morphing animation in seconds (default: 1)\\n- `cooldownTime` - Pause duration between morphs in seconds (default: 0.25)\\n- `className` - Additional classes for container\\n- `textClassName` - Additional classes for text elements (overrides theme text color if specified)",
    "author": "Magic UI",
    "previewImageUrl": "https://cdn.21st.dev/user_danielpetho/typewriter.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:56.236Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-designali-in-ai-gen",
    "source": "21st.dev",
    "title": "AI Gen",
    "url": "https://21st.dev/community/components/designali-in/ai-gen",
    "category": "features",
    "tags": [
      "chat",
      "ai-chat",
      "input",
      "features"
    ],
    "description": "A modern chat input component with a web search toggle and file upload functionality. This component features an animated search toggle, file attachment support, and smooth transitions.\\n\\nFeatures:\\n\\t•\\tAnimated search toggle button\\n\\t•\\tFile upload support\\n\\t•\\tAuto-resizing textarea\\n\\t•\\tDark mode compatibility\\n\\t•\\tKeyboard shortcuts\\n\\t•\\tFramer Motion animations for enhanced user experience\\n\\t•\\tMobile responsiveness",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/user_2rO0IUQINTfBex4xN8Ghho5dpr4/ai-gen/default/preview.1746773134930.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:15:57.026Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-designali-in-ai-input-with-search",
    "source": "21st.dev",
    "title": "AI Input With Search",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "chat",
      "ai-chat",
      "input",
      "features"
    ],
    "description": "A modern chat input component with a web search toggle and file upload functionality. This component features an animated search toggle, file attachment support, and smooth transitions.\\n\\nFeatures:\\n\\t•\\tAnimated search toggle button\\n\\t•\\tFile upload support\\n\\t•\\tAuto-resizing textarea\\n\\t•\\tDark mode compatibility\\n\\t•\\tKeyboard shortcuts\\n\\t•\\tFramer Motion animations for enhanced user experience\\n\\t•\\tMobile responsiveness",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/ai-input-with-search.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-designali-in-background-gradient-animation",
    "source": "21st.dev",
    "title": "Background Gradient Animation",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "landing-page",
      "gradient",
      "backgrounds",
      "call-to-action",
      "card",
      "background"
    ],
    "description": "A smooth and elegant background gradient animation that changes the gradient position over time.",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/background-gradient-animation.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-designali-in-dot-pattern-1",
    "source": "21st.dev",
    "title": "dot-pattern",
    "url": "https://21st.dev/community/components/s/buttons",
    "category": "buttons",
    "tags": [
      "button",
      "border"
    ],
    "description": "Quote",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/user_2rO0IUQINTfBex4xN8Ghho5dpr4/dot-pattern-1/quote/preview.png?v=1",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-designali-in-glowing-shadow",
    "source": "21st.dev",
    "title": "Glowing Shadow",
    "url": "https://21st.dev/community/components/designali-in/glowing-shadow",
    "category": "features",
    "tags": [
      "rainbow",
      "animated-button",
      "border",
      "button",
      "features"
    ],
    "description": "The component features a rotating, color-cycling glow that responds beautifully to hover interactions with enhanced blur, opacity, and scale effects.",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/designali-in/glowing-shadow/default/preview.1755534839304.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:00.955Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-designali-in-gradient-text",
    "source": "21st.dev",
    "title": "Gradient Text",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "text",
      "text-effects",
      "animation",
      "text-animation"
    ],
    "description": "A React component that creates text vaporization animations using Canvas, with customizable text cycling and particle effects.",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/user_2rO0IUQINTfBex4xN8Ghho5dpr4/gradient-text/gradient-text/preview.png?v=1",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-designali-in-highlighter",
    "source": "21st.dev",
    "title": "Highlighter",
    "url": "https://21st.dev/community/components/designali-in/highlighter",
    "category": "hero",
    "tags": [
      "announcements",
      "hero",
      "announcement",
      "cta"
    ],
    "description": "Highlighter, Particle, CTA",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/user_2rO0IUQINTfBex4xN8Ghho5dpr4/highlighter.jpg",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:02.437Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-designali-in-liquid-glass-button",
    "source": "21st.dev",
    "title": "Liquid Glass Button",
    "url": "https://21st.dev/community/components/designali-in/liquid-glass-button",
    "category": "auth",
    "tags": [
      "sign-in",
      "section",
      "pixel",
      "animated",
      "animation",
      "button",
      "navbar",
      "input",
      "transition"
    ],
    "description": "Sing In Flow with animated background",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/designali-in/liquid-glass-button/default/preview.1750605472950.png",
    "relatedPatternIds": [
      "form-benefits-sidebar",
      "compact-lead-form"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:03.457Z",
    "fallbackUrl": "https://21st.dev/community/components/s/auth"
  },
  {
    "id": "21st-dev-designali-in-shader-animation",
    "source": "21st.dev",
    "title": "Shader Animation",
    "url": "https://21st.dev/community/components/designali-in/shader-animation",
    "category": "hero",
    "tags": [
      "landing-page",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "A nicely landing with shapes and color.",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/designali-in/shader-animation/default/preview.1755486352919.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:04.569Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-designali-in-shader-background",
    "source": "21st.dev",
    "title": "Shader Background",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "shader"
    ],
    "description": "Component that renders a full-screen WebGL canvas behind all other content. It compiles and executes custom vertex and fragment shaders to create an animated purple-blue plasma grid effect.",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/minhxthanh/shader-background/default/preview.1748699860662.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-designali-in-shader-lines",
    "source": "21st.dev",
    "title": "Shader Lines",
    "url": "https://21st.dev/community/components/designali-in/shader-lines",
    "category": "hero",
    "tags": [
      "background-animation",
      "heros",
      "animated-hero",
      "shader"
    ],
    "description": "Now the WebGL shader component is properly imported and rendered on the main page. The colorful wave distortion effect should display fullscreen when you view the page.",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/designali-in/shader-lines/default/preview.1755617050358.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:06.153Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-designali-in-shape-landing-hero",
    "source": "21st.dev",
    "title": "Shape Landing Hero",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "landing-page",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "A nicely landing with shapes and color.",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/shape-landing-hero/default/preview.1737988084934.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-designali-in-sign-in-flow-1",
    "source": "21st.dev",
    "title": "Sign In Flow",
    "url": "https://21st.dev/community/components/s/auth",
    "category": "auth",
    "tags": [
      "sign-in",
      "section",
      "pixel",
      "animated",
      "animation",
      "button",
      "navbar",
      "input",
      "transition"
    ],
    "description": "Sing In Flow with animated background",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/nubmaster4568/sign-in-flow-1/default/preview.1747131539764.png",
    "relatedPatternIds": [
      "form-benefits-sidebar",
      "compact-lead-form"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/auth"
  },
  {
    "id": "21st-dev-designali-in-vapour-text-effect",
    "source": "21st.dev",
    "title": "Vapour Text Effect",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "text",
      "text-effects",
      "animation",
      "text-animation"
    ],
    "description": "A React component that creates text vaporization animations using Canvas, with customizable text cycling and particle effects.",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/jatin-yadav05/vapour-text-effect/default/preview.1747562393196.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-designali-in-web-gl-shader",
    "source": "21st.dev",
    "title": "WebGL Shader",
    "url": "https://21st.dev/community/components/designali-in/web-gl-shader",
    "category": "hero",
    "tags": [
      "background-animation",
      "heros",
      "animated-hero",
      "shader"
    ],
    "description": "Now the WebGL shader component is properly imported and rendered on the main page. The colorful wave distortion effect should display fullscreen when you view the page.",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/designali-in/web-gl-shader/default/preview.1755664380314.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:09.515Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-dillionverma-animated-shiny-text",
    "source": "21st.dev",
    "title": "Animated Shiny Text",
    "url": "https://21st.dev/community/components/dillionverma/animated-shiny-text",
    "category": "hero",
    "tags": [
      "announcements",
      "banner",
      "landing-page",
      "upgrade",
      "hero",
      "announcement"
    ],
    "description": "A light glare effect which pans across text making it appear as if it is shimmering.",
    "author": "Magic UI",
    "previewImageUrl": "https://cdn.21st.dev/user_magicui/animated-shiny-text.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:10.385Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-dillionverma-border-beam",
    "source": "21st.dev",
    "title": "Border Beam",
    "url": "https://21st.dev/community/components/dillionverma/border-beam",
    "category": "hero",
    "tags": [
      "hero",
      "card",
      "animation",
      "video",
      "border",
      "magicui",
      "demo"
    ],
    "description": "An animated beam of light which travels along the border of its container.",
    "author": "Magic UI",
    "previewImageUrl": "https://cdn.21st.dev/user_magicui/border-beam.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:11.062Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-dillionverma-features-8",
    "source": "21st.dev",
    "title": "Features 8",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "saas",
      "landing-page",
      "marketing",
      "features",
      "bento"
    ],
    "description": "features section",
    "author": "Magic UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2tUYFzCDCVfrMrVC3TfB9DUBAyx/features-8/default/preview.png?v=1",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-dillionverma-grid-pattern",
    "source": "21st.dev",
    "title": "Grid Pattern",
    "url": "https://21st.dev/community/components/dillionverma/grid-pattern",
    "category": "other",
    "tags": [
      "backgrounds",
      "landing-page",
      "background"
    ],
    "description": "A background grid pattern made with SVGs, fully customizable using Tailwind CSS.",
    "author": "Magic UI",
    "previewImageUrl": "https://cdn.21st.dev/user_magicui/grid-pattern.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:13.002Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-dillionverma-shine-border",
    "source": "21st.dev",
    "title": "Shine Border",
    "url": "https://21st.dev/community/components/dillionverma/shine-border",
    "category": "hero",
    "tags": [
      "hero",
      "quote",
      "banner",
      "border"
    ],
    "description": "Shine border is an animated background border effect.",
    "author": "Magic UI",
    "previewImageUrl": "https://cdn.21st.dev/user_magicui/shine-border.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:14.127Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-dillionverma-sparkles-text",
    "source": "21st.dev",
    "title": "Sparkles Text",
    "url": "https://21st.dev/community/components/dillionverma/sparkles-text",
    "category": "hero",
    "tags": [
      "landing-page",
      "text",
      "text-effects",
      "hero"
    ],
    "description": "A component that types out a text, one letter at a time.\\n\\nAs a text, either a string or an array of strings can be passed to the component. The component will automatically split the text into an array of characters, and animate each letter one by one. If you pass an array of strings, the component will animate one text, delete it, then continue animating the next one. The component will loop through the texts if you set the loop prop to true.\\n\\nThe cursor at the end of the text is optional. You can use a character or even a svg node if you like. There is a prop to customize the cursor animation, where you have to define the two motion variants as initial and animate.\\n\\nIdeally, the component should respect multiple lines. If you experience otherwise, please let me know.:)",
    "author": "Magic UI",
    "previewImageUrl": "https://cdn.21st.dev/user_magicui/sparkles-text.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:15.012Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-dillionverma-typewriter",
    "source": "21st.dev",
    "title": "Typewriter",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "landing-page",
      "text",
      "text-effects",
      "hero"
    ],
    "description": "A component that types out a text, one letter at a time.\\n\\nAs a text, either a string or an array of strings can be passed to the component. The component will automatically split the text into an array of characters, and animate each letter one by one. If you pass an array of strings, the component will animate one text, delete it, then continue animating the next one. The component will loop through the texts if you set the loop prop to true.\\n\\nThe cursor at the end of the text is optional. You can use a character or even a svg node if you like. There is a prop to customize the cursor animation, where you have to define the two motion variants as initial and animate.\\n\\nIdeally, the component should respect multiple lines. If you experience otherwise, please let me know.:)",
    "author": "Magic UI",
    "previewImageUrl": "https://cdn.21st.dev/user_danielpetho/typewriter.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-dubinc-banner",
    "source": "21st.dev",
    "title": "Banner",
    "url": "https://21st.dev/community/components/dubinc/banner",
    "category": "hero",
    "tags": [
      "hero",
      "announcements",
      "banner",
      "announcement",
      "features"
    ],
    "description": "A versatile notification banner component with gradient background and grid pattern overlay. Originally designed for Dub.co's domain claim notifications.\\n\\nFeatures\\n- Dismissible banner with close button\\n- Optional icon with circular background\\n- Customizable action button\\n- \\",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/user_dubinc/banner.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:16.971Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-easemize-ai-input-with-loading",
    "source": "21st.dev",
    "title": "AI Input With Loading",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "ai-chat",
      "spinner-loader",
      "input",
      "features"
    ],
    "description": "A chat input component with a loading state animation featuring an auto-resizing textarea, loading spinner, and status message.\\n\\nFeatures:\\n\\t•\\tLoading state animation\\n\\t•\\tAuto-resizing textarea\\n\\t•\\tCustomizable loading durations\\n\\t•\\tDark mode support\\n\\t•\\tStatus messages\\n\\t•\\tKeyboard shortcuts\\n\\t•\\tAuto-animation mode\\n\\t•\\tMobile responsiveness",
    "author": "Hossain Jahed",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/ai-input-with-loading.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-easemize-ai-prompt-box",
    "source": "21st.dev",
    "title": "AI prompt Box",
    "url": "https://21st.dev/community/components/easemize/ai-prompt-box",
    "category": "features",
    "tags": [
      "voice",
      "input",
      "ai-chat",
      "features"
    ],
    "description": "A voice input component with an animated visualizer and recording timer. It includes a demo mode, customizable visualizer, and recording callbacks.\\n\\nFeatures:\\n\\t•\\tAnimated audio visualizer\\n\\t•\\tRecording timer display\\n\\t•\\tDemo/preview mode\\n\\t•\\tStart/stop callbacks\\n\\t•\\tDark mode support\\n\\t•\\tCustomizable visualizer bars\\n\\t•\\tMobile responsive",
    "author": "Hossain Jahed",
    "previewImageUrl": "https://cdn.21st.dev/easemize/ai-prompt-box/default/preview.1747972675277.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:18.534Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-easemize-ai-voice-input",
    "source": "21st.dev",
    "title": "AI Voice Input",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "voice",
      "input",
      "ai-chat",
      "features"
    ],
    "description": "A voice input component with an animated visualizer and recording timer. It includes a demo mode, customizable visualizer, and recording callbacks.\\n\\nFeatures:\\n\\t•\\tAnimated audio visualizer\\n\\t•\\tRecording timer display\\n\\t•\\tDemo/preview mode\\n\\t•\\tStart/stop callbacks\\n\\t•\\tDark mode support\\n\\t•\\tCustomizable visualizer bars\\n\\t•\\tMobile responsive",
    "author": "Hossain Jahed",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/ai-voice-input.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-easemize-animated-glassy-pricing",
    "source": "21st.dev",
    "title": "Animated Glassy Pricing",
    "url": "https://21st.dev/community/components/easemize/animated-glassy-pricing",
    "category": "features",
    "tags": [
      "pricing-card",
      "pricing-section",
      "features",
      "pricing",
      "testimonial"
    ],
    "description": "A super clean single pricing card with features and testimonials.",
    "author": "Hossain Jahed",
    "previewImageUrl": "https://cdn.21st.dev/easemize/animated-glassy-pricing/default/preview.1750949491192.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:20.093Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-easemize-animated-glow-card",
    "source": "21st.dev",
    "title": "Animated Glow Card",
    "url": "https://21st.dev/community/components/easemize/animated-glow-card",
    "category": "features",
    "tags": [
      "ripple-in-and-out",
      "ripple",
      "easemize-ui",
      "button",
      "border-ripple",
      "button-hover",
      "animation",
      "border",
      "interactive",
      "hover-effect",
      "animated",
      "hover-ripple"
    ],
    "description": "A React component that renders a visually striking card with an animated, glowing border effect. This component uses an SVG filter (feColorMatrix) to achieve the customizable glow, enhancing UI elements with a modern and interactive feel. It includes a CardCanvas to house the SVG filter definition and a Card component for the main content display, complete with border elements. Ideal for drawing attention to featured content, calls to action, or simply adding a touch of dynamic visual flair to your application.",
    "author": "Hossain Jahed",
    "previewImageUrl": "https://cdn.21st.dev/easemize/animated-glow-card/default/preview.1748325242342.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:20.613Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-easemize-animated-gradient-border",
    "source": "21st.dev",
    "title": "Animated Gradient Border",
    "url": "https://21st.dev/community/components/easemize/animated-gradient-border",
    "category": "cards",
    "tags": [
      "card",
      "animation",
      "hover-card",
      "glow",
      "interactive",
      "animated-card",
      "pointer",
      "animated",
      "focus",
      "hover-animation",
      "glow-effect",
      "hover-effect"
    ],
    "description": "Animated Border, Border animation, border gradient, animated border gradient, border rotate, border rotate animation, border rotation animation, card",
    "author": "Hossain Jahed",
    "relatedPatternIds": [
      "bento-grid",
      "center-highlight"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:21.665Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cards"
  },
  {
    "id": "21st-dev-easemize-animated-shader-hero",
    "source": "21st.dev",
    "title": "Animated Shader Hero",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "hero",
      "hero-section",
      "interactive-hero-backgrounds",
      "shader"
    ],
    "description": "Animated Shader Hero\\nA stunning React hero component with animated WebGL shader backgrounds, smooth animations, and fully customizable content. Perfect for modern landing pages and SaaS websites.",
    "author": "Hossain Jahed",
    "previewImageUrl": "https://cdn.21st.dev/ravikatiyar162/animated-shader-hero/default/preview.1755360493434.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-easemize-chatgpt-prompt-input",
    "source": "21st.dev",
    "title": "Chatgpt Prompt Input",
    "url": "https://21st.dev/community/components/easemize/chatgpt-prompt-input",
    "category": "features",
    "tags": [
      "ai-chat",
      "spinner-loader",
      "input",
      "features"
    ],
    "description": "A chat input component with a loading state animation featuring an auto-resizing textarea, loading spinner, and status message.\\n\\nFeatures:\\n\\t•\\tLoading state animation\\n\\t•\\tAuto-resizing textarea\\n\\t•\\tCustomizable loading durations\\n\\t•\\tDark mode support\\n\\t•\\tStatus messages\\n\\t•\\tKeyboard shortcuts\\n\\t•\\tAuto-animation mode\\n\\t•\\tMobile responsiveness",
    "author": "Hossain Jahed",
    "previewImageUrl": "https://cdn.21st.dev/easemize/chatgpt-prompt-input/default/preview.1750427255605.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:23.249Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-easemize-multi-type-ripple-buttons",
    "source": "21st.dev",
    "title": "Multi Type Ripple Buttons",
    "url": "https://21st.dev/community/components/easemize/multi-type-ripple-buttons",
    "category": "buttons",
    "tags": [
      "tooltip",
      "glow",
      "border",
      "buttons"
    ],
    "description": "Part of the EaseMize library, this highly customizable React button component offers a theme-aware JavaScript click ripple and four distinct visual variants (default, ghost, hover, hoverborder). Designed to be \\",
    "author": "Hossain Jahed",
    "previewImageUrl": "https://cdn.21st.dev/easemize/multi-type-ripple-buttons/default/preview.1748083166438.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:23.782Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-easemize-single-pricing-card",
    "source": "21st.dev",
    "title": "Single Pricing Card",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "pricing-card",
      "pricing-section",
      "features",
      "pricing",
      "testimonial"
    ],
    "description": "A super clean single pricing card with features and testimonials.",
    "author": "Hossain Jahed",
    "previewImageUrl": "https://cdn.21st.dev/user_2vDrVta4PKJEhGZOxwYiAcxSKTV/single-pricing-card/default/preview.1744402058872.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-easemize-spooky-smoke-animation",
    "source": "21st.dev",
    "title": "Spooky Smoke Animation",
    "url": "https://21st.dev/community/components/easemize/spooky-smoke-animation",
    "category": "hero",
    "tags": [
      "backgrounds",
      "hero",
      "features",
      "background",
      "form"
    ],
    "description": "A customizable animated smoke background component for React, built with WebGL for high performance. It's perfect for adding a dynamic, mesmerizing vibe to your projects. You can easily change the smoke color to match your brand or design, making it incredibly versatile. This component is part of the EaseMize UI library, which focuses on components that are easy to use and great to customize. It's ideal for hero sections, interactive backgrounds, or any element that needs a touch of magic",
    "author": "Hossain Jahed",
    "previewImageUrl": "https://cdn.21st.dev/easemize/spooky-smoke-animation/default/preview.1749313020943.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:25.999Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-easemize-spotlight-card",
    "source": "21st.dev",
    "title": "Spotlight Card",
    "url": "https://21st.dev/community/components/easemize/spotlight-card",
    "category": "features",
    "tags": [
      "easemize-ui",
      "ui",
      "svg-filter",
      "hover-effect",
      "highlight",
      "animated-card",
      "card",
      "glow",
      "glow-effect",
      "border",
      "features",
      "form"
    ],
    "description": "advanced React component designed to create an engaging and modern card interface. It features a unique spotlight glow effect that intelligently tracks the mouse pointer across the screen, highlighting the card with a configurable hue. Part of the EaseMize UI library, it supports several preset glow colors, predefined responsive sizes ('sm', 'md', 'lg'), and allows for completely custom dimensions via width, height, or className props. The underlying CSS leverages custom properties for a highly dynamic and performant visual effect.",
    "author": "Hossain Jahed",
    "previewImageUrl": "https://cdn.21st.dev/easemize/spotlight-card/default/preview.1749394917546.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:27.300Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-edwinvakayil-combobox",
    "source": "21st.dev",
    "title": "Combobox",
    "url": "https://21st.dev/community/components/edwinvakayil/combobox",
    "category": "hero",
    "tags": [
      "accordion",
      "collapse",
      "heroui",
      "faq",
      "disclosure"
    ],
    "description": "This is combobox component",
    "author": "edwinvakayil",
    "previewImageUrl": "https://cdn.21st.dev/lyanchouss/combobox/default/preview.1780177029789.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:28.136Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-edwinvakayil-new-checkbox",
    "source": "21st.dev",
    "title": "New checkbox",
    "url": "https://21st.dev/community/components/edwinvakayil/new-checkbox",
    "category": "other",
    "tags": [
      "checkbox",
      "group"
    ],
    "description": "This is a checkbox component",
    "author": "edwinvakayil",
    "previewImageUrl": "https://cdn.21st.dev/lyanchouss/new-checkbox/default/preview.1780172525858.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:29.012Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-edwinvakayil-new-context-menu",
    "source": "21st.dev",
    "title": "New Context Menu",
    "url": "https://21st.dev/community/components/edwinvakayil/new-context-menu",
    "category": "navigation",
    "tags": [
      "dialog"
    ],
    "description": "This is context menu",
    "author": "edwinvakayil",
    "previewImageUrl": "https://cdn.21st.dev/lyanchouss/new-context-menu/default/preview.1780177994596.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:29.668Z",
    "fallbackUrl": "https://21st.dev/community/components/s/navigation"
  },
  {
    "id": "21st-dev-edwinvakayil-new-hover-card",
    "source": "21st.dev",
    "title": "New Hover Card",
    "url": "https://21st.dev/community/components/edwinvakayil/new-hover-card",
    "category": "cards",
    "tags": [
      "chip",
      "badge",
      "tag",
      "status",
      "label"
    ],
    "description": "This is hover card component.",
    "author": "edwinvakayil",
    "previewImageUrl": "https://cdn.21st.dev/lyanchouss/new-hover-card/default/preview.1780264099333.png",
    "relatedPatternIds": [
      "bento-grid",
      "center-highlight"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:30.737Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cards"
  },
  {
    "id": "21st-dev-edwinvakayil-the-checkbox-group",
    "source": "21st.dev",
    "title": "The Checkbox Group",
    "url": "https://21st.dev/community/components/edwinvakayil/the-checkbox-group",
    "category": "other",
    "tags": [
      "combobox",
      "box"
    ],
    "description": "This is checkbox group component",
    "author": "edwinvakayil",
    "previewImageUrl": "https://cdn.21st.dev/lyanchouss/the-checkbox-group/default/preview.1780173261175.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:31.520Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-edwinvakayil-the-dialog",
    "source": "21st.dev",
    "title": "The Dialog",
    "url": "https://21st.dev/community/components/edwinvakayil/the-dialog",
    "category": "hero",
    "tags": [
      "alert",
      "heroui",
      "status",
      "notification",
      "feedback"
    ],
    "description": "This is dialog component",
    "author": "edwinvakayil",
    "previewImageUrl": "https://cdn.21st.dev/lyanchouss/the-dialog/default/preview.1780178505250.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:32.524Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-fanoflix-lamp-tooltip",
    "source": "21st.dev",
    "title": "Lamp Tooltip",
    "url": "https://21st.dev/community/components/fanoflix/lamp-tooltip",
    "category": "hero",
    "tags": [
      "animation",
      "border",
      "hero",
      "beam",
      "video",
      "magicui",
      "demo"
    ],
    "description": "A beautiful tooltip with a lamp/glow effect",
    "author": "Muhammad Ammar",
    "previewImageUrl": "https://cdn.21st.dev/user_2x6HZ61WugX45OSP6IdJCEehEtA/lamp-tooltip/default/preview.1747384449384.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:33.862Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-gaxocif204-mapcn-marker-content",
    "source": "21st.dev",
    "title": "MarkerContent",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "map",
      "marker",
      "tooltip",
      "location",
      "interactive"
    ],
    "description": "Custom marker content rendered inside a MapLibre marker.",
    "author": "FlyWood",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-marker-content/default/preview.1780350008960.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-gaxocif204-preloader",
    "source": "21st.dev",
    "title": "Preloader",
    "url": "https://21st.dev/community/components/gaxocif204/preloader",
    "category": "navigation",
    "tags": [
      "map",
      "marker",
      "interactive",
      "location",
      "navigation"
    ],
    "description": "Full-screen preloader that exits with a slide-up animation when the page is ready.",
    "author": "FlyWood",
    "previewImageUrl": "https://cdn.21st.dev/gaxocif204/preloader/default/preview.1780300548748.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:35.571Z",
    "fallbackUrl": "https://21st.dev/community/components/s/navigation"
  },
  {
    "id": "21st-dev-hari-gradient-text",
    "source": "21st.dev",
    "title": "Gradient Text",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "gradient",
      "text",
      "animation",
      "text-effects"
    ],
    "description": "Gradient Text",
    "author": "Animata",
    "previewImageUrl": "https://cdn.21st.dev/user_2rO0IUQINTfBex4xN8Ghho5dpr4/gradient-text/gradient-text/preview.png?v=1",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-hari-reveal-images",
    "source": "21st.dev",
    "title": "Reveal images",
    "url": "https://21st.dev/community/components/hari/reveal-images",
    "category": "other",
    "tags": [
      "gradient",
      "text",
      "animation",
      "text-effects"
    ],
    "description": "Gradient Text",
    "author": "Animata",
    "previewImageUrl": "https://cdn.21st.dev/user_hari/reveal-images.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:37.154Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-haydenbleasel-announcement",
    "source": "21st.dev",
    "title": "Announcement",
    "url": "https://21st.dev/community/components/haydenbleasel/announcement",
    "category": "other",
    "tags": [
      "info",
      "announcements",
      "announcement"
    ],
    "description": "A compound badge designed to display an announcement.\\n\\n",
    "author": "Hayden Bleasel",
    "previewImageUrl": "https://cdn.21st.dev/user_2rdQLmsxuhvWx0tfvW2jDPWI7CY/announcement/default/preview.1737987848451.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:37.930Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-hero-ui-heroui-accordion",
    "source": "21st.dev",
    "title": "HeroUI Accordion",
    "url": "https://21st.dev/community/components/hero_ui/heroui-accordion",
    "category": "hero",
    "tags": [
      "context-menu",
      "hero"
    ],
    "description": "HeroUI v3 Accordion — a collapsible content panel built with the real @heroui/react package. Default and surface variants, single or multiple expanded, controlled and default-expanded keys, custom indicator, disabled items, hidden separators, grouped FAQ layout and custom styles. Works in light and dark themes.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/heroui-accordion/default/preview.1780270047692.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:38.584Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-alert",
    "source": "21st.dev",
    "title": "HeroUI Alert",
    "url": "https://21st.dev/community/components/hero_ui/heroui-alert",
    "category": "hero",
    "tags": [
      "alert-dialog",
      "confirmation",
      "heroui",
      "modal",
      "overlay",
      "hero",
      "buttons"
    ],
    "description": "HeroUI v3 Alert — status-aware feedback messages built with the real @heroui/react package. Includes default, accent, success, warning and danger statuses, action buttons, close buttons, custom indicators, compact alerts, stacked notifications, maintenance notices and custom BEM/Tailwind styling. Works in light and dark themes.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/heroui-alert/default/preview.1780180468308.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:39.415Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-alert-dialog",
    "source": "21st.dev",
    "title": "HeroUI AlertDialog",
    "url": "https://21st.dev/community/components/hero_ui/heroui-alert-dialog",
    "category": "hero",
    "tags": [
      "avatar",
      "profile",
      "users",
      "image",
      "react",
      "hero"
    ],
    "description": "HeroUI AlertDialog for critical confirmations, with status icons, placements, backdrop variants, sizes, custom icons, dismiss behavior, controlled state and custom trigger examples. Uses the real @heroui/react component with bundled @heroui/styles CSS.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/heroui-alert-dialog/default/preview.1780180682494.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:40.260Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-avatar",
    "source": "21st.dev",
    "title": "Avatar",
    "url": "https://21st.dev/community/components/hero_ui/heroui-avatar",
    "category": "hero",
    "tags": [
      "breadcrumb",
      "navigation",
      "links",
      "menu",
      "react",
      "hero"
    ],
    "description": "Display user profile images with customizable fallback content.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-avatar/default/preview.1780252844076.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:41.057Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-badge",
    "source": "21st.dev",
    "title": "Badge",
    "url": "https://21st.dev/community/components/hero_ui/heroui-badge",
    "category": "hero",
    "tags": [
      "checkbox",
      "form",
      "input",
      "toggle",
      "selection",
      "hero"
    ],
    "description": "Displays a small indicator positioned relative to another element, commonly used for notification counts, status dots, and labels.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-badge/default/preview.1780254468142.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:42.046Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-breadcrumbs",
    "source": "21st.dev",
    "title": "Breadcrumbs",
    "url": "https://21st.dev/community/components/hero_ui/heroui-breadcrumbs",
    "category": "hero",
    "tags": [
      "card",
      "container",
      "layout",
      "content",
      "image",
      "hero",
      "navigation"
    ],
    "description": "Display the current page location within a navigational hierarchy.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-breadcrumbs/default/preview.1780254281824.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:42.939Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-card",
    "source": "21st.dev",
    "title": "Card",
    "url": "https://21st.dev/community/components/hero_ui/heroui-card",
    "category": "hero",
    "tags": [
      "badge",
      "notification",
      "status",
      "avatar",
      "react",
      "hero"
    ],
    "description": "Flexible container component for grouping related content and actions.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-card/default/preview.1780254434805.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:43.717Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-checkbox",
    "source": "21st.dev",
    "title": "Checkbox",
    "url": "https://21st.dev/community/components/hero_ui/heroui-checkbox",
    "category": "hero",
    "tags": [
      "hover",
      "card",
      "hover-card",
      "hero",
      "cta",
      "form"
    ],
    "description": "A selectable control for binary choices, form options, indeterminate states, labels, and validation messaging.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-checkbox/default/preview.1780258040183.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:44.493Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-chip",
    "source": "21st.dev",
    "title": "Chip",
    "url": "https://21st.dev/community/components/hero_ui/heroui-chip",
    "category": "hero",
    "tags": [
      "button",
      "action",
      "control",
      "icon",
      "interactive",
      "hero",
      "form"
    ],
    "description": "Small informational badges for displaying labels, statuses, and categories.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-chip/default/preview.1780264594989.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:45.400Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-color-field",
    "source": "21st.dev",
    "title": "ColorField",
    "url": "https://21st.dev/community/components/hero_ui/heroui-color-field",
    "category": "hero",
    "tags": [
      "color",
      "color-picker",
      "picker",
      "slider",
      "input",
      "hero"
    ],
    "description": "Color input field with labels, descriptions, validation, and HSL channel editing.",
    "author": "David Hakobyan",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-color-field/default/preview.1780271409351.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:47.519Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-color-swatch",
    "source": "21st.dev",
    "title": "ColorSwatch",
    "url": "https://21st.dev/community/components/hero_ui/heroui-color-swatch",
    "category": "hero",
    "tags": [
      "color",
      "color-picker",
      "picker",
      "input",
      "accessibility",
      "hero"
    ],
    "description": "A visual preview of a color value with accessibility support.",
    "author": "David Hakobyan",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-color-swatch/default/preview.1780278032535.png",
    "relatedPatternIds": [
      "hero-product-preview",
      "split-hero",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:48.543Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-color-swatch-picker",
    "source": "21st.dev",
    "title": "ColorSwatchPicker",
    "url": "https://21st.dev/community/components/hero_ui/heroui-color-swatch-picker",
    "category": "hero",
    "tags": [
      "color",
      "color-picker",
      "picker",
      "input",
      "slider",
      "hero"
    ],
    "description": "A list of color swatches that allows users to select a color from a predefined palette.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-color-swatch-picker/default/preview.1780278136205.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:49.329Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-combo-box",
    "source": "21st.dev",
    "title": "ComboBox",
    "url": "https://21st.dev/community/components/hero_ui/heroui-combo-box",
    "category": "hero",
    "tags": [
      "date-picker",
      "calendar",
      "date-input",
      "input",
      "react-aria",
      "hero"
    ],
    "description": "A filterable select field that lets people search, choose, and enter values from a popover list.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-combo-box/default/preview.1780281654285.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:50.150Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-date-field",
    "source": "21st.dev",
    "title": "DateField",
    "url": "https://21st.dev/community/components/hero_ui/heroui-date-field",
    "category": "hero",
    "tags": [
      "timeline",
      "8bit",
      "steps",
      "block",
      "retro",
      "hero"
    ],
    "description": "Date input field with labels, descriptions, and validation built on React Aria DateField.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-date-field/default/preview.1780281808380.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:50.809Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-hero-ui-heroui-date-picker",
    "source": "21st.dev",
    "title": "DatePicker",
    "url": "https://21st.dev/community/components/hero_ui/heroui-date-picker",
    "category": "hero",
    "tags": [
      "date",
      "date-input",
      "input",
      "field",
      "form-validation",
      "hero"
    ],
    "description": "Composable date picker built on React Aria DatePicker with DateField and Calendar composition.",
    "author": "hero_ui",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-date-picker/default/preview.1780348199534.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:51.496Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-isaiahbjork-agent-plan",
    "source": "21st.dev",
    "title": "Agent Plan",
    "url": "https://21st.dev/community/components/isaiahbjork/agent-plan",
    "category": "features",
    "tags": [
      "ui",
      "ai-chat",
      "ai",
      "chat",
      "features"
    ],
    "description": "An AI chat interface with glass-morphism design and smart command features. Built with React and Framer Motion for smooth animations and professional interactions.",
    "author": "Isaiah",
    "previewImageUrl": "https://cdn.21st.dev/user_2tkbBPFWYn8YMjZNHwgIuP3yzvd/agent-plan/agent-plan/preview.png?v=1",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:52.738Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-isaiahbjork-animated-ai-chat",
    "source": "21st.dev",
    "title": "Animated AI Chat",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "ui",
      "ai-chat",
      "ai",
      "chat",
      "features"
    ],
    "description": "An AI chat interface with glass-morphism design and smart command features. Built with React and Framer Motion for smooth animations and professional interactions.",
    "author": "Isaiah",
    "previewImageUrl": "https://cdn.21st.dev/user_2ra80vx0iKMyQWJ5AESmNfFbCHD/animated-ai-chat/default/preview.1746632407641.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-jatin-yadav05-animated-ai-chat",
    "source": "21st.dev",
    "title": "Animated AI Chat",
    "url": "https://21st.dev/community/components/jatin-yadav05/animated-ai-chat",
    "category": "cta",
    "tags": [
      "ai",
      "ai-chat",
      "textarea",
      "call-to-action"
    ],
    "description": "Design of the v0 AI Chat",
    "author": "Jatin Yadav",
    "previewImageUrl": "https://cdn.21st.dev/user_2ra80vx0iKMyQWJ5AESmNfFbCHD/animated-ai-chat/default/preview.1746632407641.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:54.621Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-jatin-yadav05-display-cards",
    "source": "21st.dev",
    "title": "Display Cards",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "landing-page",
      "card",
      "features",
      "cards"
    ],
    "description": "A visually appealing stacked card layout with hover animations and grayscale effects.\\n\\nFeatures:\\n\\t•\\tStacked card layout\\n\\t•\\tHover animations\\n\\t•\\tGrayscale effects\\n\\t•\\tCustom icons\\n\\t•\\tResponsive design\\n\\t•\\tDark mode support\\n\\t•\\tCustomizable styles\\n\\t•\\tAccessible markup\\n\\nNotes:\\n\\t•\\tBuilt with Tailwind CSS for responsive design\\n\\t•\\tUses CSS Grid for stacking cards\\n\\t•\\tImplements smooth hover animations\\n\\t•\\tSupports custom icons from any library\\n\\t•\\tIncludes grayscale hover effects\\n\\t•\\tMaintains consistent spacing\\n\\t•\\tSupports dark mode\\n\\t•\\tTypeScript support with proper types\\n\\n",
    "author": "Jatin Yadav",
    "previewImageUrl": "https://cdn.21st.dev/user_Codehagen/display-cards.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-jatin-yadav05-etheral-shadow",
    "source": "21st.dev",
    "title": "Etheral Shadow",
    "url": "https://21st.dev/community/components/jatin-yadav05/etheral-shadow",
    "category": "other",
    "tags": [
      "grid",
      "pattern",
      "dots",
      "dark-mode",
      "dark-theme",
      "backgrounds",
      "mask",
      "background"
    ],
    "description": "Creates an animated, ethereal shadow effect with customizable noise, color, and animation properties, featuring a centered text overlay with responsive typography.",
    "author": "Jatin Yadav",
    "previewImageUrl": "https://cdn.21st.dev/jatin-yadav05/etheral-shadow/default/preview.1748327080862.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:56.178Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-jatin-yadav05-link-preview",
    "source": "21st.dev",
    "title": "Link Preview",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "text",
      "hero",
      "landing-page",
      "link"
    ],
    "description": "Dynamic link previews for your anchor tags",
    "author": "Jatin Yadav",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/link-preview.png",
    "relatedPatternIds": [
      "hero-product-preview",
      "split-hero",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-jatin-yadav05-radial-orbital-timeline",
    "source": "21st.dev",
    "title": "Radial Orbital Timeline",
    "url": "https://21st.dev/community/components/jatin-yadav05/radial-orbital-timeline",
    "category": "features",
    "tags": [
      "landing-page",
      "card",
      "features",
      "cards"
    ],
    "description": "A visually appealing stacked card layout with hover animations and grayscale effects.\\n\\nFeatures:\\n\\t•\\tStacked card layout\\n\\t•\\tHover animations\\n\\t•\\tGrayscale effects\\n\\t•\\tCustom icons\\n\\t•\\tResponsive design\\n\\t•\\tDark mode support\\n\\t•\\tCustomizable styles\\n\\t•\\tAccessible markup\\n\\nNotes:\\n\\t•\\tBuilt with Tailwind CSS for responsive design\\n\\t•\\tUses CSS Grid for stacking cards\\n\\t•\\tImplements smooth hover animations\\n\\t•\\tSupports custom icons from any library\\n\\t•\\tIncludes grayscale hover effects\\n\\t•\\tMaintains consistent spacing\\n\\t•\\tSupports dark mode\\n\\t•\\tTypeScript support with proper types\\n\\n",
    "author": "Jatin Yadav",
    "previewImageUrl": "https://cdn.21st.dev/user_2ra80vx0iKMyQWJ5AESmNfFbCHD/radial-orbital-timeline/default/preview.1745917317806.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:16:58.410Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-jatin-yadav05-v0-ai-chat",
    "source": "21st.dev",
    "title": "v0 AI Chat",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "ai",
      "ai-chat",
      "textarea",
      "call-to-action"
    ],
    "description": "Design of the v0 AI Chat",
    "author": "Jatin Yadav",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/v0-ai-chat/default/preview.png?v=1",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-jatin-yadav05-vapour-text-effect",
    "source": "21st.dev",
    "title": "Vapour Text Effect",
    "url": "https://21st.dev/community/components/jatin-yadav05/vapour-text-effect",
    "category": "hero",
    "tags": [
      "text",
      "hero",
      "landing-page",
      "link"
    ],
    "description": "Dynamic link previews for your anchor tags",
    "author": "Jatin Yadav",
    "previewImageUrl": "https://cdn.21st.dev/jatin-yadav05/vapour-text-effect/default/preview.1747562393196.png",
    "relatedPatternIds": [
      "hero-product-preview",
      "split-hero",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:00.077Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-kokonutd-action-search-bar",
    "source": "21st.dev",
    "title": "Action Search Bar",
    "url": "https://21st.dev/community/components/kokonutd/action-search-bar",
    "category": "cta",
    "tags": [
      "ai",
      "ai-chat",
      "textarea",
      "call-to-action"
    ],
    "description": "Design of the v0 AI Chat",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/action-search-bar/default/preview.1737986716282.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:01.132Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-kokonutd-agent-plan",
    "source": "21st.dev",
    "title": "Agent Plan",
    "url": "https://21st.dev/community/components/s/pricing",
    "category": "pricing",
    "tags": [
      "ai",
      "ai-chat",
      "agi",
      "agent",
      "planner",
      "plan",
      "animated-card",
      "card"
    ],
    "description": "An animated task plan for your agent, including subtasks and assigned MCP servers.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2tkbBPFWYn8YMjZNHwgIuP3yzvd/agent-plan/agent-plan/preview.png?v=1",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-kokonutd-ai-gen",
    "source": "21st.dev",
    "title": "AI Gen",
    "url": "https://21st.dev/community/components/s/cards",
    "category": "cards",
    "tags": [
      "ai",
      "ai-chat",
      "card",
      "chat",
      "text-to-image",
      "image",
      "text-to-video",
      "video"
    ],
    "description": "AI Image Gen",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rO0IUQINTfBex4xN8Ghho5dpr4/ai-gen/default/preview.1746773134930.png",
    "relatedPatternIds": [
      "bento-grid",
      "center-highlight"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cards"
  },
  {
    "id": "21st-dev-kokonutd-ai-input-with-loading",
    "source": "21st.dev",
    "title": "AI Input With Loading",
    "url": "https://21st.dev/community/components/kokonutd/ai-input-with-loading",
    "category": "pricing",
    "tags": [
      "ai",
      "ai-chat",
      "agi",
      "agent",
      "planner",
      "plan",
      "animated-card",
      "card"
    ],
    "description": "An animated task plan for your agent, including subtasks and assigned MCP servers.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/ai-input-with-loading.png",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:03.750Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-kokonutd-ai-input-with-search",
    "source": "21st.dev",
    "title": "AI Input With Search",
    "url": "https://21st.dev/community/components/kokonutd/ai-input-with-search",
    "category": "forms",
    "tags": [
      "ai-chat",
      "tooltip",
      "chat",
      "chat-input",
      "framer-motion",
      "easemize-ui",
      "chatgpt",
      "file-upload",
      "dialog",
      "image",
      "popover",
      "ai-input"
    ],
    "description": "This is a complete replica of the chatgpt prompt input some may call it chat input or prompt box or promptbox",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/ai-input-with-search.png",
    "relatedPatternIds": [
      "form-benefits-sidebar",
      "compact-lead-form"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:04.847Z",
    "fallbackUrl": "https://21st.dev/community/components/s/forms"
  },
  {
    "id": "21st-dev-kokonutd-ai-prompt-box",
    "source": "21st.dev",
    "title": "AI prompt Box",
    "url": "https://21st.dev/community/components/s/forms",
    "category": "forms",
    "tags": [
      "creative-ai",
      "animated",
      "input",
      "chat",
      "framer-motion",
      "search",
      "ai",
      "ai-chat",
      "ai-input"
    ],
    "description": "AI prompt Box, AI chat Input, AI chat box, with search, with think, with thinking, with canvas, with audio recording",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/easemize/ai-prompt-box/default/preview.1747972675277.png",
    "relatedPatternIds": [
      "form-benefits-sidebar",
      "compact-lead-form"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/forms"
  },
  {
    "id": "21st-dev-kokonutd-ai-voice-input",
    "source": "21st.dev",
    "title": "AI Voice Input",
    "url": "https://21st.dev/community/components/kokonutd/ai-voice-input",
    "category": "features",
    "tags": [
      "section",
      "features",
      "animated-card",
      "image-card"
    ],
    "description": "responsive React component for displaying a section with text (title, description) and a styled image mockup. Features optional layout reversal and subtle scroll-triggered animations using framer-motion, including a parallax effect for the mockup and its background.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/ai-voice-input.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:06.893Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-kokonutd-animated-ai-input",
    "source": "21st.dev",
    "title": "Animated AI Input",
    "url": "https://21st.dev/community/components/kokonutd/animated-ai-input",
    "category": "forms",
    "tags": [
      "ai",
      "ai-chat",
      "card",
      "chat",
      "text-to-image",
      "image",
      "text-to-video",
      "video"
    ],
    "description": "AI Image Gen",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/animated-ai-input/default/preview.1746444542947.png",
    "relatedPatternIds": [
      "form-benefits-sidebar",
      "compact-lead-form"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:08.050Z",
    "fallbackUrl": "https://21st.dev/community/components/s/forms"
  },
  {
    "id": "21st-dev-kokonutd-avatar",
    "source": "21st.dev",
    "title": "Avatar",
    "url": "https://21st.dev/community/components/s/testimonials",
    "category": "testimonials",
    "tags": [
      "testimonials",
      "tweets"
    ],
    "description": "Enchanced shadcn/ui avatar",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_originui/avatar/default/preview.png?v=1",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-kokonutd-background-circles",
    "source": "21st.dev",
    "title": "Background Circles",
    "url": "https://21st.dev/community/components/kokonutd/background-circles",
    "category": "hero",
    "tags": [
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "An svg filter component that creates a gooey effect on the background. Can be used to create fluid interfaces or rounded-at-all-corners panels. Limited support for Safari.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/background-circles/default/preview.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:09.585Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-kokonutd-background-paths",
    "source": "21st.dev",
    "title": "Background Paths",
    "url": "https://21st.dev/community/components/kokonutd/background-paths",
    "category": "hero",
    "tags": [
      "landing-page",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "Landing Background paths with Gradient Title",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/background-paths/default/preview.png?v=1",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:10.664Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-kokonutd-beams-background",
    "source": "21st.dev",
    "title": "Beams Background",
    "url": "https://21st.dev/community/components/kokonutd/beams-background",
    "category": "cta",
    "tags": [
      "3d-elements",
      "call-to-action",
      "backgrounds",
      "footer",
      "landing-page",
      "card",
      "background"
    ],
    "description": "Beams Bacground animated with colors",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/beams-background/default/preview.png?v=1",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:11.328Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-kokonutd-bento-grid",
    "source": "21st.dev",
    "title": "Bento Grid",
    "url": "https://21st.dev/community/components/kokonutd/bento-grid",
    "category": "features",
    "tags": [
      "timeline",
      "orbital",
      "animation",
      "ui",
      "features",
      "menu"
    ],
    "description": "A dynamic orbital visualization component that displays nodes in a circular pattern around a central point. Each node represents a data point with title, status, and energy level.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/bento-grid/default/preview.1738072374201.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:12.752Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-kokonutd-button-colorful",
    "source": "21st.dev",
    "title": "Button Colorful with Hover Effect",
    "url": "https://21st.dev/community/components/kokonutd/button-colorful",
    "category": "cta",
    "tags": [
      "menu",
      "dropdown",
      "call-to-action",
      "floating-action-menu",
      "floating-action-button",
      "button",
      "add-new"
    ],
    "description": "A floating action menu component made with framer motion and tailwind css.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/button-colorful.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:13.710Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-kokonutd-chatgpt-prompt-input",
    "source": "21st.dev",
    "title": "Chatgpt Prompt Input",
    "url": "https://21st.dev/community/components/s/forms",
    "category": "forms",
    "tags": [
      "ai-chat",
      "tooltip",
      "chat",
      "chat-input",
      "framer-motion",
      "easemize-ui",
      "chatgpt",
      "file-upload",
      "dialog",
      "image",
      "popover",
      "ai-input"
    ],
    "description": "This is a complete replica of the chatgpt prompt input some may call it chat input or prompt box or promptbox",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/easemize/chatgpt-prompt-input/default/preview.1750427255605.png",
    "relatedPatternIds": [
      "form-benefits-sidebar",
      "compact-lead-form"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/forms"
  },
  {
    "id": "21st-dev-kokonutd-creative-pricing",
    "source": "21st.dev",
    "title": "Creative Pricing",
    "url": "https://21st.dev/community/components/kokonutd/creative-pricing",
    "category": "features",
    "tags": [
      "pricing-section",
      "pricing-card",
      "features",
      "pricing",
      "cards"
    ],
    "description": "A pricing table component with a glass effect and animated cards, perfect for displaying tiered pricing plans and feature comparisons.\\n\\nFeatures\\n- Responsive design with mobile-first approach\\n- Animated glass effect with blur transitions\\n- Feature comparison with checkmark indicators\\n- Gradient text and background effects\\n- Customizable pricing tiers and benefits\\n- Motion animations on scroll",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/creative-pricing/default/preview.png?v=2",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:15.333Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-kokonutd-dark-gradient-pricing",
    "source": "21st.dev",
    "title": "Dark Gradient Pricing",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "pricing-section",
      "pricing-card",
      "features",
      "pricing",
      "cards"
    ],
    "description": "A pricing table component with a glass effect and animated cards, perfect for displaying tiered pricing plans and feature comparisons.\\n\\nFeatures\\n- Responsive design with mobile-first approach\\n- Animated glass effect with blur transitions\\n- Feature comparison with checkmark indicators\\n- Gradient text and background effects\\n- Customizable pricing tiers and benefits\\n- Motion animations on scroll",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rV0b4mwh6SKrMK7lUyQUkzEa92/dark-gradient-pricing.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-kokonutd-floating-action-menu",
    "source": "21st.dev",
    "title": "Floating Action Menu",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "menu",
      "dropdown",
      "call-to-action",
      "floating-action-menu",
      "floating-action-button",
      "button",
      "add-new"
    ],
    "description": "A floating action menu component made with framer motion and tailwind css.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rc5PfL1BTeoSaeKi50f3UeVfRn/floating-action-menu/default/preview.png?v=1",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-kokonutd-hand-writing-text",
    "source": "21st.dev",
    "title": "Hand Writing Text",
    "url": "https://21st.dev/community/components/kokonutd/hand-writing-text",
    "category": "hero",
    "tags": [
      "hover",
      "text",
      "hero"
    ],
    "description": "Reveals the images on hover.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/hand-writing-text/default/preview.png?v=2",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:17.681Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-kokonutd-highlighter",
    "source": "21st.dev",
    "title": "Highlighter",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "call-to-action",
      "cursor",
      "announcements",
      "highlight",
      "banner",
      "announcement",
      "cta"
    ],
    "description": "Highlighter, Particle, CTA",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rO0IUQINTfBex4xN8Ghho5dpr4/highlighter.jpg",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-kokonutd-liquid-glass",
    "source": "21st.dev",
    "title": "Liquid Glass",
    "url": "https://21st.dev/community/components/s/buttons",
    "category": "buttons",
    "tags": [
      "glass-morphism",
      "liquid-glass",
      "dock",
      "ai",
      "header",
      "chat",
      "backdrop-blur",
      "button"
    ],
    "description": "A liquid glass effect with a dynamic background feat. MacOS Dock Icons.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/suraj-xd/liquid-glass/default/preview.1750159373393.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-kokonutd-magnetize-button",
    "source": "21st.dev",
    "title": "Magnetize Button",
    "url": "https://21st.dev/community/components/kokonutd/magnetize-button",
    "category": "buttons",
    "tags": [
      "glass-morphism",
      "liquid-glass",
      "dock",
      "ai",
      "header",
      "chat",
      "backdrop-blur",
      "button"
    ],
    "description": "A liquid glass effect with a dynamic background feat. MacOS Dock Icons.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/magnetize-button.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:20.187Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-kokonutd-pulse-beams",
    "source": "21st.dev",
    "title": "Pulse Beams",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "beam",
      "call-to-action"
    ],
    "description": "Multiple beams that converge into a single point, as seen on Next.js website",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/pulse-beams/default/preview.png?v=1",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-kokonutd-radial-orbital-timeline",
    "source": "21st.dev",
    "title": "Radial Orbital Timeline",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "timeline",
      "orbital",
      "animation",
      "ui",
      "features",
      "menu"
    ],
    "description": "A dynamic orbital visualization component that displays nodes in a circular pattern around a central point. Each node represents a data point with title, status, and energy level.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2ra80vx0iKMyQWJ5AESmNfFbCHD/radial-orbital-timeline/default/preview.1745917317806.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-kokonutd-reveal-images",
    "source": "21st.dev",
    "title": "Reveal images",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "hover",
      "text",
      "hero"
    ],
    "description": "Reveals the images on hover.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_hari/reveal-images.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-kokonutd-section-with-mockup",
    "source": "21st.dev",
    "title": "Section With Mockup",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "section",
      "features",
      "animated-card",
      "image-card"
    ],
    "description": "responsive React component for displaying a section with text (title, description) and a styled image mockup. Features optional layout reversal and subtle scroll-triggered animations using framer-motion, including a parallax effect for the mockup and its background.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2wRb2ACTQ44hvI4zlLmE3zYQQZU/section-with-mockup/default/preview.1746632628368.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-kokonutd-shape-landing-hero",
    "source": "21st.dev",
    "title": "Shape Landing Hero",
    "url": "https://21st.dev/community/components/kokonutd/shape-landing-hero",
    "category": "hero",
    "tags": [
      "landing-page",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "A nicely landing with shapes and color.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/shape-landing-hero/default/preview.1737988084934.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:25.136Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-kokonutd-sparkles",
    "source": "21st.dev",
    "title": "Sparkles",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "landing-page",
      "call-to-action",
      "backgrounds",
      "hero",
      "background"
    ],
    "description": "A configurable sparkles component that can be used as a background or as a standalone component.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/sparkles.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-kokonutd-v0-ai-chat",
    "source": "21st.dev",
    "title": "v0 AI Chat",
    "url": "https://21st.dev/community/components/kokonutd/v0-ai-chat",
    "category": "cta",
    "tags": [
      "ai",
      "ai-chat",
      "textarea",
      "call-to-action"
    ],
    "description": "Design of the v0 AI Chat",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/v0-ai-chat/default/preview.png?v=1",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:26.897Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-kokonutd-x-gradient-card",
    "source": "21st.dev",
    "title": "X Gradient Card",
    "url": "https://21st.dev/community/components/kokonutd/x-gradient-card",
    "category": "testimonials",
    "tags": [
      "avatar",
      "testimonials"
    ],
    "description": "Enchanced shadcn/ui avatar",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/x-gradient-card/default/preview.png?v=2",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:27.697Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-larsen66-heroui-close-button",
    "source": "21st.dev",
    "title": "CloseButton",
    "url": "https://21st.dev/community/components/larsen66/heroui-close-button",
    "category": "hero",
    "tags": [
      "slider",
      "color",
      "input",
      "control",
      "accessibility",
      "hero"
    ],
    "description": "Button component for closing dialogs, modals, or dismissing content.",
    "author": "David Hakobyan",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-close-button/default/preview.1780267915751.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:28.493Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-larsen66-heroui-color-area",
    "source": "21st.dev",
    "title": "ColorArea",
    "url": "https://21st.dev/community/components/larsen66/heroui-color-area",
    "category": "hero",
    "tags": [
      "8bit",
      "mana-bar",
      "game-ui",
      "progress",
      "retro",
      "hero"
    ],
    "description": "A 2D color picker for selecting colors from a gradient area.",
    "author": "David Hakobyan",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-color-area/default/preview.1780271452293.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:29.226Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-larsen66-heroui-color-picker",
    "source": "21st.dev",
    "title": "ColorPicker",
    "url": "https://21st.dev/community/components/larsen66/heroui-color-picker",
    "category": "hero",
    "tags": [
      "enemy-health",
      "game-ui",
      "8bit",
      "retro",
      "health-bar",
      "hero"
    ],
    "description": "A composable color picker that synchronizes color value between multiple color components.",
    "author": "David Hakobyan",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-color-picker/default/preview.1780280395996.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:30.259Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-larsen66-heroui-color-slider",
    "source": "21st.dev",
    "title": "ColorSlider",
    "url": "https://21st.dev/community/components/larsen66/heroui-color-slider",
    "category": "hero",
    "tags": [
      "color",
      "input",
      "form",
      "field",
      "react-aria",
      "hero"
    ],
    "description": "A color slider allows users to adjust an individual channel of a color value.",
    "author": "David Hakobyan",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/heroui-color-slider/default/preview.1780275636041.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:31.096Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-legionwebdev-bento-grid",
    "source": "21st.dev",
    "title": "Bento Grid",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "bento",
      "landing-page",
      "card",
      "features"
    ],
    "description": "A nice Bento Grid with hover items and shadow.",
    "author": "SVG UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/bento-grid/default/preview.1738072374201.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-legionwebdev-cpu-architecture",
    "source": "21st.dev",
    "title": "CPU Architecture",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "bento",
      "landing-page",
      "card",
      "features"
    ],
    "description": "A nice Bento Grid with hover items and shadow.",
    "author": "SVG UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/cpu-architecture/default/preview.png?v=1",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-ln-dev7-creative-pricing",
    "source": "21st.dev",
    "title": "Creative Pricing",
    "url": "https://21st.dev/community/components/s/pricing",
    "category": "pricing",
    "tags": [
      "pricing-section",
      "pricing-card",
      "pricing"
    ],
    "description": "A nice creative design",
    "author": "LN",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/creative-pricing/default/preview.png?v=2",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-ln-dev7-pricing-interaction",
    "source": "21st.dev",
    "title": "Pricing Interaction",
    "url": "https://21st.dev/community/components/ln-dev7/pricing-interaction",
    "category": "pricing",
    "tags": [
      "pricing-section",
      "pricing-card",
      "pricing"
    ],
    "description": "A nice creative design",
    "author": "LN",
    "previewImageUrl": "https://cdn.21st.dev/user_2rmPdOT0hL8MtSnYm8IpqqrYTVg/pricing-interaction/default/preview.png?v=1",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:34.540Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-lovesickfromthe6ix-background-paper-shaders",
    "source": "21st.dev",
    "title": "Background Paper Shaders",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "shader"
    ],
    "description": "Background Paper Shade with grey shaders",
    "author": "scott clayton",
    "previewImageUrl": "https://cdn.21st.dev/muhammadnadeemmn9485134/background-paper-shaders/default/preview.1755685936905.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-lovesickfromthe6ix-shader-animation",
    "source": "21st.dev",
    "title": "Shader Animation",
    "url": "https://21st.dev/community/components/lovesickfromthe6ix/shader-animation",
    "category": "other",
    "tags": [
      "shader"
    ],
    "description": "Background Paper Shade with grey shaders",
    "author": "scott clayton",
    "previewImageUrl": "https://cdn.21st.dev/lovesickfromthe6ix/shader-animation/default/preview.1755805553789.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:36.572Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-lukacho-tiles",
    "source": "21st.dev",
    "title": "Tiles",
    "url": "https://21st.dev/community/components/lukacho/tiles",
    "category": "hero",
    "tags": [
      "hero",
      "backgrounds",
      "background"
    ],
    "author": "lukacho",
    "previewImageUrl": "https://cdn.21st.dev/user_lukacho/tiles.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:37.419Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-lyanchouss-asd",
    "source": "21st.dev",
    "title": "Blueprint Shader Grid",
    "url": "https://21st.dev/community/components/lyanchouss/asd",
    "category": "other",
    "tags": [
      "backgrounds",
      "background"
    ],
    "description": "Here is Blueprint Shader Grid component",
    "author": "uimix",
    "previewImageUrl": "https://cdn.21st.dev/user_2xFgBhIEcC8WVjxizPEzB14AOkb/asd/default/preview.1756894585457.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:38.352Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-mapcn-flightcn-flight-airport",
    "source": "21st.dev",
    "title": "FlightAirport",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "map",
      "interactive",
      "data-visualization",
      "location",
      "travel"
    ],
    "description": "Renders a single airport marker with optional labels, custom marker UI, and click callbacks.",
    "author": "mapcn",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/flightcn-flight-airport/default/preview.1780350519948.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-mapcn-mapcn-custom-layer",
    "source": "21st.dev",
    "title": "CustomLayer",
    "url": "https://21st.dev/community/components/mapcn/mapcn-custom-layer",
    "category": "other",
    "tags": [
      "map",
      "interactive",
      "data-visualization",
      "location",
      "visualization"
    ],
    "description": "A MapLibre custom layer control that toggles interactive GeoJSON park polygons over a themed map.",
    "author": "mapcn",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-custom-layer/default/preview.1780285116840.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:40.457Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-mapcn-mapcn-layer-markers",
    "source": "21st.dev",
    "title": "LayerMarkers",
    "url": "https://21st.dev/community/components/mapcn/mapcn-layer-markers",
    "category": "forms",
    "tags": [
      "map",
      "interactive",
      "data-visualization",
      "location",
      "visualization",
      "form"
    ],
    "description": "A high-performance MapLibre marker layer that renders many clickable point markers from GeoJSON.",
    "author": "mapcn",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-layer-markers/default/preview.1780285175991.png",
    "relatedPatternIds": [
      "form-benefits-sidebar",
      "compact-lead-form"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:41.569Z",
    "fallbackUrl": "https://21st.dev/community/components/s/forms"
  },
  {
    "id": "21st-dev-mapcn-mapcn-map",
    "source": "21st.dev",
    "title": "Map",
    "url": "https://21st.dev/community/components/mapcn/mapcn-map",
    "category": "cta",
    "tags": [
      "cta",
      "retro",
      "8bit",
      "comparison",
      "block"
    ],
    "description": "A MapLibre-powered map component with theme-aware basemaps, controlled viewport state, and custom style switching.",
    "author": "mapcn",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-map/default/preview.1780283710643.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:42.812Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-mapcn-mapcn-map-arc",
    "source": "21st.dev",
    "title": "MapArc",
    "url": "https://21st.dev/community/components/mapcn/mapcn-map-arc",
    "category": "other",
    "tags": [
      "map",
      "marker",
      "interactive",
      "location",
      "tooltip"
    ],
    "description": "A MapLibre arc layer component for curved origin-destination connections with hover details.",
    "author": "mapcn",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-map-arc/default/preview.1780285370947.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:43.887Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-mapcn-mapcn-map-cluster-layer",
    "source": "21st.dev",
    "title": "MapClusterLayer",
    "url": "https://21st.dev/community/components/mapcn/mapcn-map-cluster-layer",
    "category": "other",
    "tags": [
      "map",
      "interactive",
      "data-visualization",
      "location",
      "visualization"
    ],
    "description": "A MapLibre cluster layer for grouped GeoJSON points with clickable clusters, individual point callbacks, and popup support.",
    "author": "mapcn",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-map-cluster-layer/default/preview.1780285057544.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:45.176Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-mapcn-mapcn-map-controls",
    "source": "21st.dev",
    "title": "MapControls",
    "url": "https://21st.dev/community/components/mapcn/mapcn-map-controls",
    "category": "other",
    "tags": [
      "map",
      "interactive",
      "data-visualization",
      "location",
      "visualization"
    ],
    "description": "Interactive map controls for zoom, compass, geolocation, and fullscreen actions.",
    "author": "mapcn",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-map-controls/default/preview.1780284947308.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:46.291Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-mapcn-mapcn-map-marker",
    "source": "21st.dev",
    "title": "MapMarker",
    "url": "https://21st.dev/community/components/mapcn/mapcn-map-marker",
    "category": "other",
    "tags": [
      "map",
      "marker",
      "popup",
      "interactive",
      "location"
    ],
    "description": "DOM-based map markers with custom content, tooltips, popups, and draggable marker support.",
    "author": "mapcn",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-map-marker/default/preview.1780285602576.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:47.483Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-mapcn-mapcn-map-popup",
    "source": "21st.dev",
    "title": "MapPopup",
    "url": "https://21st.dev/community/components/mapcn/mapcn-map-popup",
    "category": "navigation",
    "tags": [
      "map",
      "controls",
      "interactive",
      "navigation",
      "location"
    ],
    "description": "A standalone MapLibre popup component for controlled overlays at specific coordinates.",
    "author": "mapcn",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-map-popup/default/preview.1780284920300.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:48.711Z",
    "fallbackUrl": "https://21st.dev/community/components/s/navigation"
  },
  {
    "id": "21st-dev-mapcn-mapcn-map-route",
    "source": "21st.dev",
    "title": "MapRoute",
    "url": "https://21st.dev/community/components/mapcn/mapcn-map-route",
    "category": "cta",
    "tags": [
      "map",
      "interactive",
      "data-visualization",
      "location",
      "visualization",
      "cta"
    ],
    "description": "A MapLibre route layer component for drawing paths and selectable route options.",
    "author": "mapcn",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-map-route/default/preview.1780285150542.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:49.888Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-mapcn-mapcn-marker-content",
    "source": "21st.dev",
    "title": "MarkerContent",
    "url": "https://21st.dev/community/components/mapcn/mapcn-marker-content",
    "category": "other",
    "tags": [
      "map",
      "marker",
      "tooltip",
      "location",
      "interactive"
    ],
    "description": "Custom marker content rendered inside a MapLibre marker.",
    "author": "FlyWood",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-marker-content/default/preview.1780350008960.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:50.936Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-mapcn-mapcn-marker-label",
    "source": "21st.dev",
    "title": "MarkerLabel",
    "url": "https://21st.dev/community/components/mapcn/mapcn-marker-label",
    "category": "other",
    "tags": [
      "map",
      "interactive",
      "data-visualization",
      "location",
      "travel"
    ],
    "description": "Positioned marker labels for MapLibre marker content.",
    "author": "mapcn",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-marker-label/default/preview.1780350397877.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:51.771Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-mapcn-mapcn-marker-popup",
    "source": "21st.dev",
    "title": "MarkerPopup",
    "url": "https://21st.dev/community/components/mapcn/mapcn-marker-popup",
    "category": "hero",
    "tags": [
      "page-transition",
      "preloader",
      "landing-page",
      "gsap",
      "animated-hero",
      "cards"
    ],
    "description": "Marker popups for rich location cards with labels, media, ratings, hours, and actions.",
    "author": "mapcn",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-marker-popup/default/preview.1780285795091.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:53.247Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-mapcn-mapcn-marker-tooltip",
    "source": "21st.dev",
    "title": "MarkerTooltip",
    "url": "https://21st.dev/community/components/mapcn/mapcn-marker-tooltip",
    "category": "other",
    "tags": [
      "map",
      "marker",
      "label",
      "location",
      "interactive"
    ],
    "description": "Hover tooltip content for MapLibre markers.",
    "author": "FlyWood",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/mapcn-marker-tooltip/default/preview.1780350239698.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:54.080Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-maxim-bort-devel-animated-testimonials",
    "source": "21st.dev",
    "title": "Animated Testimonials",
    "url": "https://21st.dev/community/components/s/testimonials",
    "category": "testimonials",
    "tags": [
      "testimonials",
      "testimonial"
    ],
    "description": "A clean animated testimonials section",
    "author": "Maxim Bortnikov",
    "previewImageUrl": "https://cdn.21st.dev/user_2vDrVta4PKJEhGZOxwYiAcxSKTV/animated-testimonials/default/preview.1744401112544.png",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-maxim-bort-devel-circular-testimonials",
    "source": "21st.dev",
    "title": "Circular Testimonials",
    "url": "https://21st.dev/community/components/maxim.bort.devel/circular-testimonials",
    "category": "testimonials",
    "tags": [
      "testimonials",
      "testimonial"
    ],
    "description": "A clean animated testimonials section",
    "author": "Maxim Bortnikov",
    "previewImageUrl": "https://cdn.21st.dev/maxim.bort.devel/circular-testimonials/default/preview.1749048275501.png",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:56.179Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-mdafsarx-banner",
    "source": "21st.dev",
    "title": "banner",
    "url": "https://21st.dev/community/components/mdafsarx/banner",
    "category": "other",
    "tags": [
      "alert",
      "badge",
      "banner",
      "alert-dialog",
      "announcements",
      "announcement"
    ],
    "description": "A stylish banner component for modern UIs, built with accessibility and animation in mind.",
    "author": "nur/ui",
    "previewImageUrl": "https://cdn.21st.dev/mdafsarx/banner/default/preview.1760488875110.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:56.847Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-meghtrix-background-components",
    "source": "21st.dev",
    "title": "Background Components",
    "url": "https://21st.dev/community/components/meghtrix/background-components",
    "category": "other",
    "tags": [
      "backgrounds",
      "background"
    ],
    "description": "Here is Background Components component",
    "author": "meghtrix",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/background-components/default/preview.1758000384735.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:57.504Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-meschacirung-features-8",
    "source": "21st.dev",
    "title": "Features 8",
    "url": "https://21st.dev/community/components/meschacirung/features-8",
    "category": "features",
    "tags": [
      "carousel",
      "card",
      "clients",
      "projects",
      "gallery",
      "features",
      "cards"
    ],
    "description": "A carousel gallery of full height image cards with case study text on top.",
    "author": "Tailark",
    "previewImageUrl": "https://cdn.21st.dev/user_2tUYFzCDCVfrMrVC3TfB9DUBAyx/features-8/default/preview.png?v=1",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:17:58.330Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-meschacirung-gallery4",
    "source": "21st.dev",
    "title": "Gallery with image cards",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "carousel",
      "card",
      "clients",
      "projects",
      "gallery",
      "features",
      "cards"
    ],
    "description": "A carousel gallery of full height image cards with case study text on top.",
    "author": "Tailark",
    "previewImageUrl": "https://cdn.21st.dev/user_2rguB0QxcSITG2Y7ivePFsKsUU6/gallery4/default/preview.png?v=1",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-mikolajdobrucki-glow",
    "source": "21st.dev",
    "title": "Glow",
    "url": "https://21st.dev/community/components/mikolajdobrucki/glow",
    "category": "hero",
    "tags": [
      "landing-page",
      "call-to-action",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "A collection of demos showcasing different use cases for the Glow component:\\n\\t1.\\tGlowBasic\\n\\t▪\\tBasic implementation with top positioning\\n\\t▪\\tDemonstrates default animation\\n\\t2.\\tGlowCentered\\n\\t▪\\tCentered glow effect\\n\\t▪\\tShows pulse animation\\n\\t3.\\tGlowMultiple\\n\\t▪\\tMultiple glow effects combined\\n\\t▪\\tDemonstrates layering capabilities\\n\\t4.\\tGlowInteractive\\n\\t▪\\tInteractive hover effects\\n\\t▪\\tShows transition animations\\n",
    "author": "mikolajdobrucki",
    "previewImageUrl": "https://cdn.21st.dev/user_mikolajdobrucki/glow.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:00.076Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-minhxthanh-animated-glowing-search-bar",
    "source": "21st.dev",
    "title": "Animated Glowing Search Bar",
    "url": "https://21st.dev/community/components/minhxthanh/animated-glowing-search-bar",
    "category": "cards",
    "tags": [
      "animated",
      "animation",
      "hover-animation",
      "hover-card",
      "border",
      "interactive",
      "animated-card",
      "hover-effect",
      "customizable",
      "card",
      "cards",
      "focus"
    ],
    "description": "Animated Glowing Search Bar Component",
    "author": "Le Thanh",
    "previewImageUrl": "https://cdn.21st.dev/minhxthanh/animated-glowing-search-bar/default/preview.1749186772283.png",
    "relatedPatternIds": [
      "bento-grid",
      "center-highlight"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:01.199Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cards"
  },
  {
    "id": "21st-dev-minhxthanh-animated-shader-background",
    "source": "21st.dev",
    "title": "Animated Shader Background",
    "url": "https://21st.dev/community/components/minhxthanh/animated-shader-background",
    "category": "hero",
    "tags": [
      "animation",
      "hero",
      "three",
      "shaders",
      "shader"
    ],
    "description": "a real-time animated shader background built with Three.js and GLSL",
    "author": "Le Thanh",
    "previewImageUrl": "https://cdn.21st.dev/minhxthanh/animated-shader-background/default/preview.1749003393329.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:02.008Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-minhxthanh-shader-animation",
    "source": "21st.dev",
    "title": "Shader Animation",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "animation",
      "hero",
      "background-animation",
      "shader"
    ],
    "description": "The page will now show the beautiful animated ripple effect that fills the entire screen with the mesmerizing concentric circles and color gradients from your original Three.js shader code.",
    "author": "Le Thanh",
    "previewImageUrl": "https://cdn.21st.dev/designali-in/shader-animation/default/preview.1755486352919.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-minhxthanh-shader-background",
    "source": "21st.dev",
    "title": "Shader Background",
    "url": "https://21st.dev/community/components/minhxthanh/shader-background",
    "category": "hero",
    "tags": [
      "animation",
      "hero",
      "three",
      "shaders",
      "shader"
    ],
    "description": "a real-time animated shader background built with Three.js and GLSL",
    "author": "Le Thanh",
    "previewImageUrl": "https://cdn.21st.dev/minhxthanh/shader-background/default/preview.1748699860662.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:03.651Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-muhammad-binsalman-rainbow-borders-button",
    "source": "21st.dev",
    "title": "Rainbow Borders Button",
    "url": "https://21st.dev/community/components/muhammad-binsalman/rainbow-borders-button",
    "category": "cta",
    "tags": [
      "input",
      "search-bar",
      "search",
      "animation",
      "animated",
      "border",
      "glow-effect",
      "hover-effect",
      "hover",
      "call-to-action",
      "buttons"
    ],
    "description": "A stunning button component featuring an animated rainbow gradient border with a sleek dark gradient background. The rainbow border cycles through vibrant colors with a smooth animation, creating an eye-catching glow effect. Perfect for call-to-action buttons, gaming interfaces, or any modern web application that needs a bold, dynamic visual element. Built with Tailwind CSS and includes hover animations for enhanced interactivity",
    "author": "M.bin Salman",
    "previewImageUrl": "https://cdn.21st.dev/muhammad-binsalman/rainbow-borders-button/default/preview.1754474690576.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:04.178Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-orcdev-8bit-carousel",
    "source": "21st.dev",
    "title": "8bit Carousel",
    "url": "https://21st.dev/community/components/s/forms",
    "category": "forms",
    "tags": [
      "combobox",
      "input",
      "form",
      "search",
      "select",
      "buttons"
    ],
    "description": "An 8-bit styled carousel built on Embla. Pixel-bordered slides with retro prev/next buttons featuring blocky pixel arrows, full keyboard and swipe support.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-carousel/default/preview.1780350202026.png",
    "relatedPatternIds": [
      "form-benefits-sidebar",
      "compact-lead-form"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/forms"
  },
  {
    "id": "21st-dev-orcdev-8bit-cta1",
    "source": "21st.dev",
    "title": "8bit CTA 1 — Comparison",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "8bit",
      "game-ui",
      "game-over",
      "retro",
      "block",
      "cta"
    ],
    "description": "An 8-bit styled CTA comparison block: a retro card with a three-column us-vs-them feature table, built on the 8bit card primitive with the Press Start 2P pixel font.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-cta1/default/preview.1780283999649.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-orcdev-8bit-difficulty-select",
    "source": "21st.dev",
    "title": "8bit Difficulty Select",
    "url": "https://21st.dev/community/components/s/cards",
    "category": "cards",
    "tags": [
      "map",
      "interactive",
      "data-visualization",
      "location",
      "visualization",
      "buttons"
    ],
    "description": "An 8-bit styled game difficulty selection screen built on the retro card and button primitives. Renders a titled card (Select Difficulty) with EASY / NORMAL / HARD pixel-font buttons; clicking one highlights it as the active difficulty. Supports controlled and uncontrolled value, custom title/description, and vertical or horizontal layout.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-difficulty-select/default/preview.1780284659015.png",
    "relatedPatternIds": [
      "bento-grid",
      "center-highlight"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cards"
  },
  {
    "id": "21st-dev-orcdev-8bit-empty",
    "source": "21st.dev",
    "title": "8bit Empty",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "8bit",
      "health-bar",
      "retro",
      "game-ui",
      "progress"
    ],
    "description": "An 8-bit styled empty state built from composable retro primitives — header, media, title, description, and content slots. Use it as a placeholder when a list, table, or view has no data yet.",
    "author": "David Hakobyan",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-empty/default/preview.1780279103776.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-orcdev-8bit-enemy-health-display",
    "source": "21st.dev",
    "title": "8bit Enemy Health Display",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "retro",
      "empty",
      "empty-state",
      "placeholder",
      "8bit"
    ],
    "description": "An 8-bit styled enemy health display built on the retro health-bar primitive. Shows enemy name, level, and a health bar with a percentage overlay, driven by current/max health values.",
    "author": "David Hakobyan",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-enemy-health-display/default/preview.1780279045096.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-orcdev-8bit-faq1",
    "source": "21st.dev",
    "title": "8bit FAQ 1",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "not-found",
      "404",
      "8bit",
      "layout",
      "retro"
    ],
    "description": "An 8-bit styled FAQ section built on the retro accordion primitive. A centered title and description above a single-collapsible accordion of question/answer pairs, all in the pixel retro font.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-faq1/default/preview.1780350903797.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-orcdev-8bit-faq2",
    "source": "21st.dev",
    "title": "8bit FAQ 2 — Card Grid",
    "url": "https://21st.dev/community/components/s/cards",
    "category": "cards",
    "tags": [
      "map",
      "interactive",
      "data-visualization",
      "location",
      "visualization"
    ],
    "description": "An 8-bit styled FAQ block: a responsive two-column grid of retro card tiles, each pairing a question with a short answer. Built on the 8bit card primitive with the Press Start 2P pixel font.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-faq2/default/preview.1780283011610.png",
    "relatedPatternIds": [
      "bento-grid",
      "center-highlight"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cards"
  },
  {
    "id": "21st-dev-orcdev-8bit-faq3",
    "source": "21st.dev",
    "title": "8bit FAQ 3 Searchable",
    "url": "https://21st.dev/community/components/s/forms",
    "category": "forms",
    "tags": [
      "changelog",
      "timeline",
      "block",
      "8bit",
      "retro"
    ],
    "description": "An 8-bit styled searchable help center. A retro pixel search input filters question/answer pairs live, grouped by category into collapsible retro accordions, with an empty state when nothing matches.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-faq3/default/preview.1780351164743.png",
    "relatedPatternIds": [
      "form-benefits-sidebar",
      "compact-lead-form"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/forms"
  },
  {
    "id": "21st-dev-orcdev-8bit-game-over",
    "source": "21st.dev",
    "title": "8bit Game Over",
    "url": "https://21st.dev/community/components/s/cards",
    "category": "cards",
    "tags": [
      "block",
      "8bit",
      "game-ui",
      "main-menu",
      "retro",
      "buttons"
    ],
    "description": "An 8-bit styled game over screen block built on the retro card and button primitives. Shows a 'Game Over / Continue?' panel with pixel-art Retry and Exit buttons and an optional skull artwork pane.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-game-over/default/preview.1780284023576.png",
    "relatedPatternIds": [
      "bento-grid",
      "center-highlight"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cards"
  },
  {
    "id": "21st-dev-orcdev-8bit-game-progress",
    "source": "21st.dev",
    "title": "8bit Game Progress",
    "url": "https://21st.dev/community/components/s/cards",
    "category": "cards",
    "tags": [
      "8bit",
      "block",
      "game-ui",
      "retro",
      "difficulty-select"
    ],
    "description": "An 8-bit styled game progress card composing retro health, mana, and experience bars. Displays a player's level stats at a glance with pixel-art styling and labeled progress values.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-game-progress/default/preview.1780284631221.png",
    "relatedPatternIds": [
      "bento-grid",
      "center-highlight"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cards"
  },
  {
    "id": "21st-dev-orcdev-8bit-health-bar",
    "source": "21st.dev",
    "title": "8bit Health Bar",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "8bit",
      "layout",
      "resizable",
      "panels",
      "retro"
    ],
    "description": "An 8-bit styled health bar built on the retro progress primitive. Shows a smooth red fill (default) or pixelated squares (retro variant), driven by a 0-100 value.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-health-bar/default/preview.1780279092981.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-orcdev-8bit-loading-screen",
    "source": "21st.dev",
    "title": "8bit Loading Screen",
    "url": "https://21st.dev/community/components/s/cards",
    "category": "cards",
    "tags": [
      "8bit",
      "faq",
      "block",
      "card",
      "retro"
    ],
    "description": "An 8-bit styled loading screen block with an animated retro progress bar, rotating gameplay tips, and a pulsing pixel-font title. Supports auto-progress, custom tips, percentage toggle, and a fullscreen overlay variant.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-loading-screen/default/preview.1780283477355.png",
    "relatedPatternIds": [
      "bento-grid",
      "center-highlight"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cards"
  },
  {
    "id": "21st-dev-orcdev-8bit-main-menu",
    "source": "21st.dev",
    "title": "8bit Main Menu",
    "url": "https://21st.dev/community/components/s/cards",
    "category": "cards",
    "tags": [
      "pause-menu",
      "retro",
      "game-ui",
      "block",
      "8bit",
      "buttons"
    ],
    "description": "An 8-bit styled game main menu block built on the retro card and button primitives. Renders a titled menu card (Main Menu / Retro 8-bit Quest) with a vertical stack of pixel-font action buttons: Start Game, Options, High Scores, Multiplayer, and Quit.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-main-menu/default/preview.1780284111023.png",
    "relatedPatternIds": [
      "bento-grid",
      "center-highlight"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cards"
  },
  {
    "id": "21st-dev-orcdev-8bit-mana-bar",
    "source": "21st.dev",
    "title": "8bit Mana Bar",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "color",
      "color-picker",
      "picker",
      "accessibility",
      "react-aria"
    ],
    "description": "An 8-bit styled mana bar built on the retro progress primitive. Shows a smooth blue fill (default) or pixelated squares (retro variant), driven by a 0-100 value.",
    "author": "David Hakobyan",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-mana-bar/default/preview.1780277752147.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-orcdev-8bit-not-found1",
    "source": "21st.dev",
    "title": "8bit 404 Page",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "faq",
      "accordion",
      "retro",
      "8bit",
      "search",
      "cta"
    ],
    "description": "A retro 8-bit 404 not-found page with a large pixel headline, decorative pixel-art character, and a retro CTA button linking back home. Built on the 8bit button primitive.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-not-found1/default/preview.1780518137501.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-orcdev-8bit-pause-menu",
    "source": "21st.dev",
    "title": "8bit Pause Menu",
    "url": "https://21st.dev/community/components/s/cards",
    "category": "cards",
    "tags": [
      "8bit",
      "card",
      "progress",
      "game-ui",
      "retro"
    ],
    "description": "An 8-bit styled in-game pause menu overlay built on the retro card and button primitives. Shows a 'Paused' panel with pixel-art Resume, Restart and Quit actions.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-pause-menu/default/preview.1780284646527.png",
    "relatedPatternIds": [
      "bento-grid",
      "center-highlight"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cards"
  },
  {
    "id": "21st-dev-orcdev-8bit-resizable",
    "source": "21st.dev",
    "title": "8bit Resizable",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "8bit",
      "carousel",
      "game-ui",
      "retro",
      "embla"
    ],
    "description": "An 8-bit styled resizable panel group with retro pixel borders and a draggable handle, built on react-resizable-panels. Supports horizontal and vertical layouts with optional grip handles.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-resizable/default/preview.1780280730195.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-orcdev-8bit-team2",
    "source": "21st.dev",
    "title": "8bit Changelog",
    "url": "https://21st.dev/community/components/s/cards",
    "category": "cards",
    "tags": [],
    "description": "An 8-bit styled changelog block. Vertical list of release entries with date, title, description, an optional version badge, and pixel separators between entries. Built from retro badge, card, and separator primitives.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-team2/default/preview.1780351195255.png",
    "relatedPatternIds": [
      "bento-grid",
      "center-highlight"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cards"
  },
  {
    "id": "21st-dev-orcdev-8bit-timeline2",
    "source": "21st.dev",
    "title": "8bit Timeline Horizontal",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "8bit",
      "loading-screen",
      "progress",
      "game-ui",
      "retro"
    ],
    "description": "An 8-bit styled horizontal timeline block with numbered checkpoints on a dashed track. Renders steps horizontally on desktop and stacks vertically on mobile, with a retro pixel-font title and description. Fully prop-driven via title, description, and steps.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-timeline2/default/preview.1780282992414.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-orcdev-animated-blur-number",
    "source": "21st.dev",
    "title": "Animated Blur Number",
    "url": "https://21st.dev/community/components/s/pricing",
    "category": "pricing",
    "tags": [],
    "description": "An animated number that transitions digit-by-digit with an iOS-style spring, blurring only the digits that change. A drop-in for counters, stats, prices and live metrics.",
    "author": "OrcDev",
    "previewImageUrl": "https://cdn.21st.dev/localhost_danverr/animated-blur-number/default/preview.1780483105301.png",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-originui-avatar",
    "source": "21st.dev",
    "title": "Avatar",
    "url": "https://21st.dev/community/components/originui/avatar",
    "category": "testimonials",
    "tags": [
      "testimonials",
      "tweets",
      "testimonial"
    ],
    "description": "This Username Testimonial Displays user testimonials with profile images, usernames, feedback text, and a link to their social media.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_originui/avatar/default/preview.png?v=1",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:21.241Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-originui-hero-pill",
    "source": "21st.dev",
    "title": "Hero Pill",
    "url": "https://21st.dev/community/components/originui/hero-pill",
    "category": "hero",
    "tags": [
      "announcements",
      "shimmer",
      "announcement",
      "hero",
      "features"
    ],
    "description": "A pill-shaped component for highlighting key features or messages with optional icons and animations.\\n\\nFeatures\\n- Optional leading icon\\n- Smooth entrance animation\\n- Dark mode support\\n- Customizable styles and animations\\n- Hover effects",
    "author": "Ali Imam",
    "previewImageUrl": "https://cdn.21st.dev/user_originui/hero-pill.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:22.011Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-originui-testimonials",
    "source": "21st.dev",
    "title": "Testimonials",
    "url": "https://21st.dev/community/components/s/testimonials",
    "category": "testimonials",
    "tags": [
      "testimonials",
      "tweets",
      "testimonial"
    ],
    "description": "This Username Testimonial Displays user testimonials with profile images, usernames, feedback text, and a link to their social media.",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_ayushmxxn/testimonials.png",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-phucbm-moving-border",
    "source": "21st.dev",
    "title": "Moving Border",
    "url": "https://21st.dev/community/components/phucbm/moving-border",
    "category": "cta",
    "tags": [
      "animated-text",
      "text",
      "background-pattern",
      "border",
      "cta"
    ],
    "description": "Animated gradient border that smoothly travels around any element, from rounded rectangles to perfect circles.",
    "author": "Phuc Bui",
    "previewImageUrl": "https://cdn.21st.dev/phucbm/moving-border/default/preview.1762237382565.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:23.697Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-ravikatiyar162-animated-shader-hero",
    "source": "21st.dev",
    "title": "Animated Shader Hero",
    "url": "https://21st.dev/community/components/ravikatiyar162/animated-shader-hero",
    "category": "hero",
    "tags": [
      "animated",
      "shader",
      "hero"
    ],
    "description": "The component dynamically loads Three.js, sets up the WebGL renderer with your custom shaders, and creates the colorful mosaic effect with animated lines.",
    "author": "Ravi Katiyar",
    "previewImageUrl": "https://cdn.21st.dev/ravikatiyar162/animated-shader-hero/default/preview.1755360493434.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:25.263Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-ravikatiyar162-shader-lines",
    "source": "21st.dev",
    "title": "Shader Lines",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "animated",
      "shader"
    ],
    "description": "The component dynamically loads Three.js, sets up the WebGL renderer with your custom shaders, and creates the colorful mosaic effect with animated lines.",
    "author": "Ravi Katiyar",
    "previewImageUrl": "https://cdn.21st.dev/designali-in/shader-lines/default/preview.1755617050358.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-reuno-ui-background-paper-shaders",
    "source": "21st.dev",
    "title": "Background Paper Shaders",
    "url": "https://21st.dev/community/components/reuno-ui/background-paper-shaders",
    "category": "hero",
    "tags": [
      "shader",
      "animated-shader",
      "canvas",
      "backgrounds",
      "animated-background",
      "background",
      "hero",
      "form"
    ],
    "description": "A customizable animated smoke background component for React, built with WebGL for high performance. It's perfect for adding a dynamic, mesmerizing vibe to your projects. You can easily change the smoke color to match your brand or design, making it incredibly versatile. This component is part of the EaseMize UI library, which focuses on components that are easy to use and great to customize. It's ideal for hero sections, interactive backgrounds, or any element that needs a touch of magic",
    "author": "scott clayton",
    "previewImageUrl": "https://cdn.21st.dev/muhammadnadeemmn9485134/background-paper-shaders/default/preview.1755685936905.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:27.636Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-reuno-ui-neon-button",
    "source": "21st.dev",
    "title": "Neon Button",
    "url": "https://21st.dev/community/components/s/buttons",
    "category": "buttons",
    "tags": [
      "button",
      "border"
    ],
    "description": "a simple and clean neon bordered button with hover effect",
    "author": "Serafim",
    "previewImageUrl": "https://cdn.21st.dev/user_2sAqoiqsju5FgfPpyDU67flpOxe/neon-button/default/preview.1738079756934.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-reuno-ui-slide-button",
    "source": "21st.dev",
    "title": "Slide Button",
    "url": "https://21st.dev/community/components/reuno-ui/slide-button",
    "category": "buttons",
    "tags": [
      "button",
      "border"
    ],
    "description": "a simple and clean neon bordered button with hover effect",
    "author": "Serafim",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/slide-button/default/preview.1750556888612.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:29.569Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-reuno-ui-spooky-smoke-animation",
    "source": "21st.dev",
    "title": "Spooky Smoke Animation",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "shader",
      "animated-shader",
      "canvas",
      "backgrounds",
      "animated-background",
      "background",
      "hero",
      "form"
    ],
    "description": "A customizable animated smoke background component for React, built with WebGL for high performance. It's perfect for adding a dynamic, mesmerizing vibe to your projects. You can easily change the smoke color to match your brand or design, making it incredibly versatile. This component is part of the EaseMize UI library, which focuses on components that are easy to use and great to customize. It's ideal for hero sections, interactive backgrounds, or any element that needs a touch of magic",
    "author": "scott clayton",
    "previewImageUrl": "https://cdn.21st.dev/easemize/spooky-smoke-animation/default/preview.1749313020943.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-ridemountainpig-8bit-faq1",
    "source": "21st.dev",
    "title": "8bit FAQ 1",
    "url": "https://21st.dev/community/components",
    "category": "other",
    "tags": [
      "retro",
      "accordion",
      "section",
      "8bit",
      "faq"
    ],
    "description": "An 8-bit styled FAQ section built on the retro accordion primitive. A centered title and description above a single-collapsible accordion of question/answer pairs, all in the pixel retro font.",
    "author": "ridemountainpig",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/8bit-faq1/default/preview.1780350903797.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-ridemountainpig-flightcn-flight-airport",
    "source": "21st.dev",
    "title": "FlightAirport",
    "url": "https://21st.dev/community/components/ridemountainpig/flightcn-flight-airport",
    "category": "other",
    "tags": [
      "retro",
      "accordion",
      "section",
      "8bit",
      "faq"
    ],
    "description": "Renders a single airport marker with optional labels, custom marker UI, and click callbacks.",
    "author": "ridemountainpig",
    "previewImageUrl": "https://cdn.21st.dev/reapollo/flightcn-flight-airport/default/preview.1780350519948.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:32.091Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-sean0205-3d-testimonails",
    "source": "21st.dev",
    "title": "3D Testimonails",
    "url": "https://21st.dev/community/components/sean0205/3d-testimonails",
    "category": "testimonials",
    "tags": [
      "animated-card",
      "image-card",
      "testimonials",
      "scroll-animation",
      "motion"
    ],
    "description": "- Reveal card depending on scroll position with animations",
    "author": "ReUI",
    "previewImageUrl": "https://cdn.21st.dev/sean0205/3d-testimonails/default/preview.1751128591723.png",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:32.911Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-sean0205-animated-cards-stack",
    "source": "21st.dev",
    "title": "Animated Cards Stack",
    "url": "https://21st.dev/community/components/s/testimonials",
    "category": "testimonials",
    "tags": [
      "animated-card",
      "image-card",
      "testimonials",
      "scroll-animation",
      "motion",
      "cards"
    ],
    "description": "- Reveal card depending on scroll position with animations",
    "author": "ReUI",
    "previewImageUrl": "https://cdn.21st.dev/user_2sdAd21yCZlZRkVtZyf4K8ogkBh/animated-cards-stack/animated-cards-stack-on-scroll/preview.png?v=1",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-serafimcloud-animated-blur-number",
    "source": "21st.dev",
    "title": "Animated Blur Number",
    "url": "https://21st.dev/community/components/serafimcloud/animated-blur-number",
    "category": "pricing",
    "tags": [],
    "description": "An animated number that transitions digit-by-digit with an iOS-style spring, blurring only the digits that change. A drop-in for counters, stats, prices and live metrics.",
    "author": "Serafim",
    "previewImageUrl": "https://cdn.21st.dev/localhost_danverr/animated-blur-number/default/preview.1780483105301.png",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:34.530Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-serafimcloud-falling-pattern",
    "source": "21st.dev",
    "title": "Falling Pattern",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "backgrounds",
      "call-to-action",
      "hero",
      "shader",
      "background"
    ],
    "description": "A mesmerizing falling-particles background with customizable colors, blur, and density—perfect for subtle motion effects.\\nBuilt with Framer Motion for buttery-smooth infinite animation.",
    "author": "Serafim",
    "previewImageUrl": "https://cdn.21st.dev/sshahaider/falling-pattern/default/preview.1755170299566.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-serafimcloud-hover-button",
    "source": "21st.dev",
    "title": "Hover Button",
    "url": "https://21st.dev/community/components/serafimcloud/hover-button",
    "category": "buttons",
    "tags": [
      "slide-button",
      "button",
      "component",
      "animated"
    ],
    "description": "Here is Slide Button component",
    "author": "Serafim",
    "previewImageUrl": "https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/hover-button.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:36.107Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-serafimcloud-preloader",
    "source": "21st.dev",
    "title": "Preloader",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "page-transition",
      "preloader",
      "landing-page",
      "gsap",
      "animated-hero"
    ],
    "description": "Full-screen preloader that exits with a slide-up animation when the page is ready.",
    "author": "Serafim",
    "previewImageUrl": "https://cdn.21st.dev/gaxocif204/preloader/default/preview.1780300548748.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-serafimcloud-slide-button",
    "source": "21st.dev",
    "title": "Slide Button",
    "url": "https://21st.dev/community/components/s/buttons",
    "category": "buttons",
    "tags": [
      "slide-button",
      "button",
      "component",
      "animated"
    ],
    "description": "Here is Slide Button component",
    "author": "Serafim",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/slide-button/default/preview.1750556888612.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-serafimcloud-splite",
    "source": "21st.dev",
    "title": "Spline Scene",
    "url": "https://21st.dev/community/components/serafimcloud/splite",
    "category": "hero",
    "tags": [
      "backgrounds",
      "call-to-action",
      "hero",
      "shader",
      "background"
    ],
    "description": "A mesmerizing falling-particles background with customizable colors, blur, and density—perfect for subtle motion effects.\\nBuilt with Framer Motion for buttery-smooth infinite animation.",
    "author": "Serafim",
    "previewImageUrl": "https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/splite.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:38.154Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-shadcnblockscom-cpu-architecture",
    "source": "21st.dev",
    "title": "CPU Architecture",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "bento",
      "landing-page",
      "card",
      "features"
    ],
    "description": "A simple CPU architecture animation",
    "author": "Shadcnblocks.com",
    "previewImageUrl": "https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/cpu-architecture/default/preview.png?v=1",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-shadcnblockscom-feature-with-image-comparison",
    "source": "21st.dev",
    "title": "Feature with Image Comparison",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "features",
      "comparison",
      "image"
    ],
    "description": "Feature block with Image Comparison",
    "author": "Shadcnblocks.com",
    "previewImageUrl": "https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/feature-with-image-comparison.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-shadcnblockscom-gallery4",
    "source": "21st.dev",
    "title": "Gallery with image cards",
    "url": "https://21st.dev/community/components/shadcnblockscom/gallery4",
    "category": "features",
    "tags": [
      "animation",
      "beam",
      "features",
      "cards"
    ],
    "description": "A simple CPU architecture animation",
    "author": "Shadcnblocks.com",
    "previewImageUrl": "https://cdn.21st.dev/user_2rguB0QxcSITG2Y7ivePFsKsUU6/gallery4/default/preview.png?v=1",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:40.622Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-shadcnblockscom-shadcnblocks-com-feature108",
    "source": "21st.dev",
    "title": "Feature 108",
    "url": "https://21st.dev/community/components/shadcnblockscom/shadcnblocks-com-feature108",
    "category": "features",
    "tags": [
      "features",
      "comparison",
      "image"
    ],
    "description": "Feature block with Image Comparison",
    "author": "Shadcnblocks.com",
    "previewImageUrl": "https://cdn.21st.dev/user_2rguB0QxcSITG2Y7ivePFsKsUU6/shadcnblocks-com-feature108/default/preview.1737979331417.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:41.691Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-shadcnspace-avatar-border",
    "source": "21st.dev",
    "title": "Avatar - Border",
    "url": "https://21st.dev/community/components/shadcnspace/avatar-border",
    "category": "other",
    "tags": [
      "border"
    ],
    "description": "Here is avatar border component",
    "author": "ShadcnSpace",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/avatar-border/default/preview.1773068709168.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:42.650Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-shadcnspace-shine-border",
    "source": "21st.dev",
    "title": "Shine Border",
    "url": "https://21st.dev/community/components/shadcnspace/shine-border",
    "category": "other",
    "tags": [
      "phucbm",
      "border",
      "gsap",
      "gradient"
    ],
    "description": "Here is shine border component",
    "author": "ShadcnSpace",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/shine-border/default/preview.1772718920491.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:43.365Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-shatlyk1011-gradient-borders-button",
    "source": "21st.dev",
    "title": "Gradient Borders Button",
    "url": "https://21st.dev/community/components/s/buttons",
    "category": "buttons",
    "tags": [
      "avatar",
      "border"
    ],
    "description": "A button with animated radial gradient borders that glow on hover. Pill-shaped with emerald accent.",
    "author": "Shatlyk1011",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/gradient-borders-button/demos/default/preview.1773180369585.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-shatlyk1011-hover-border-gradient",
    "source": "21st.dev",
    "title": "Hover Border Gradient",
    "url": "https://21st.dev/community/components/s/buttons",
    "category": "buttons",
    "tags": [
      "glow",
      "button",
      "gradient",
      "border"
    ],
    "description": "A button with a rotating border gradient that highlights on hover with a blue radial glow.",
    "author": "Shatlyk1011",
    "previewImageUrl": "https://cdn.21st.dev/larsen66/hover-border-gradient/demos/default/preview.1773180541153.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-sshahaider-banner",
    "source": "21st.dev",
    "title": "Banner",
    "url": "https://21st.dev/community/components/sshahaider/banner",
    "category": "features",
    "tags": [
      "announcements",
      "banner",
      "announcement",
      "buttons"
    ],
    "description": "he Banner component is a flexible notification element for showing messages, alerts, or announcements. It supports multiple variants (success, warning, info, premium, etc.), different sizes, optional icons, action buttons, and a closable option. It also includes an autoHide feature to dismiss the banner automatically after a set time and an optional shimmer shade effect for extra visual emphasis.",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/sshahaider/banner/default/preview.1755973959132.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:45.786Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-sshahaider-bg-pattern",
    "source": "21st.dev",
    "title": "BG Patterns",
    "url": "https://21st.dev/community/components/sshahaider/bg-pattern",
    "category": "hero",
    "tags": [
      "canvas",
      "hero",
      "ui",
      "backgrounds",
      "background"
    ],
    "description": "A versatile background pattern component for React, it supports six visual styles and eight customizable mask effects. You can easily add subtle texture or visual flair to any section using pure CSS gradients—no images or external assets required.",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/sshahaider/bg-pattern/default/preview.1747466400576.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:46.766Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-sshahaider-dotted-surface",
    "source": "21st.dev",
    "title": "Dotted Surface",
    "url": "https://21st.dev/community/components/sshahaider/dotted-surface",
    "category": "other",
    "tags": [
      "blueprint",
      "shader",
      "grid",
      "backgrounds",
      "gradient",
      "background"
    ],
    "description": "An animated 3D dotted wave background built with Three.js that flows like water.\\nTheme-aware and lightweight, perfect for adding subtle motion depth to your UI.",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/sshahaider/dotted-surface/default/preview.1757222194599.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:47.645Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-sshahaider-falling-pattern",
    "source": "21st.dev",
    "title": "Falling Pattern",
    "url": "https://21st.dev/community/components/sshahaider/falling-pattern",
    "category": "hero",
    "tags": [
      "backgrounds",
      "call-to-action",
      "hero",
      "shader",
      "background"
    ],
    "description": "A mesmerizing falling-particles background with customizable colors, blur, and density—perfect for subtle motion effects.\\nBuilt with Framer Motion for buttery-smooth infinite animation.",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/sshahaider/falling-pattern/default/preview.1755170299566.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:48.304Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-sshahaider-gradient-background",
    "source": "21st.dev",
    "title": "Gradient Background",
    "url": "https://21st.dev/community/components/sshahaider/gradient-background",
    "category": "hero",
    "tags": [
      "text",
      "text-effects",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "A smooth, looping gradient background powered by Framer Motion, with optional overlay and center-aligned content.\\nPerfect for creating vibrant hero sections, landing pages, or fullscreen app backdrops.",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/sshahaider/gradient-background/default/preview.1755094951715.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:49.376Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-sshahaider-gradient-dots",
    "source": "21st.dev",
    "title": "Gradient Dots",
    "url": "https://21st.dev/community/components/sshahaider/gradient-dots",
    "category": "other",
    "tags": [
      "backgrounds",
      "background"
    ],
    "description": "A lively field of tiny, colorful dots that shimmer, shift, and cycle through the rainbow.\\nPowered by Framer Motion for smooth endless animation and customizable spacing, size, and speed.",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/sshahaider/gradient-dots/default/preview.1755279879732.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:50.247Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-sshahaider-hover-button",
    "source": "21st.dev",
    "title": "Hover Button",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "landing-page",
      "button",
      "animation",
      "call-to-action",
      "hover"
    ],
    "description": "Button Hover Animation inspired by twitter.com/aaroniker_me",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/hover-button.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-sshahaider-pattern-text",
    "source": "21st.dev",
    "title": "Pattern Text",
    "url": "https://21st.dev/community/components/sshahaider/pattern-text",
    "category": "hero",
    "tags": [
      "border",
      "call-to-action",
      "hero"
    ],
    "description": "A bold patterned text component with an animated shadow effect for standout headings.\\nPerfect for hero sections, titles, or anywhere you want striking typography.",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/sshahaider/pattern-text/default/preview.1757173737415.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:51.845Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-sshahaider-pricing-section-with-comparison",
    "source": "21st.dev",
    "title": "Pricing Section with Comparison",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "features",
      "pricing-section",
      "pricing"
    ],
    "description": "Pricing Section with Comparison",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/user_tommyjepsen/pricing-section-with-comparison.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-sshahaider-shader-animation",
    "source": "21st.dev",
    "title": "Shader Animation",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "shader",
      "hero"
    ],
    "description": "Animated hero background with procedural gradient animation using webgl",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/lovesickfromthe6ix/shader-animation/default/preview.1755805553789.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-sshahaider-single-pricing-card-1",
    "source": "21st.dev",
    "title": "Single Pricing Card",
    "url": "https://21st.dev/community/components/sshahaider/single-pricing-card-1",
    "category": "features",
    "tags": [
      "features",
      "pricing-section",
      "pricing"
    ],
    "description": "Pricing Section with Comparison",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/sshahaider/single-pricing-card/default/preview.1747467081300.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:54.169Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-sshahaider-testimonials-columns-1",
    "source": "21st.dev",
    "title": "Testimonials Columns",
    "url": "https://21st.dev/community/components/sshahaider/testimonials-columns-1",
    "category": "cta",
    "tags": [
      "landing-page",
      "button",
      "animation",
      "call-to-action",
      "hover",
      "testimonial"
    ],
    "description": "Button Hover Animation inspired by twitter.com/aaroniker_me",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/user_2tWTE0rCrloVAVylFPYfp10xU92/testimonials-columns-1/default/preview.1746775320320.png",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:55.060Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-sshahaider-wave-path",
    "source": "21st.dev",
    "title": "Wave Path",
    "url": "https://21st.dev/community/components/sshahaider/wave-path",
    "category": "other",
    "tags": [
      "glow",
      "border"
    ],
    "description": "An interactive SVG wave line that bends and ripples as you move your mouse across it.\\nSmoothly animates back to rest when the cursor leaves, giving a playful liquid-like feel.",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/sshahaider/wave-path/default/preview.1756105008574.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:56.172Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-suraj-xd-liquid-glass",
    "source": "21st.dev",
    "title": "Liquid Glass",
    "url": "https://21st.dev/community/components/suraj-xd/liquid-glass",
    "category": "buttons",
    "tags": [
      "button",
      "liquid",
      "liquid-glass"
    ],
    "description": "Liquid Glass Button",
    "author": "Suraj Gaud",
    "previewImageUrl": "https://cdn.21st.dev/suraj-xd/liquid-glass/default/preview.1750159373393.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:18:56.809Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-suraj-xd-liquid-glass-button",
    "source": "21st.dev",
    "title": "Liquid Glass Button",
    "url": "https://21st.dev/community/components/s/buttons",
    "category": "buttons",
    "tags": [
      "button",
      "liquid",
      "liquid-glass"
    ],
    "description": "Liquid Glass Button",
    "author": "Suraj Gaud",
    "previewImageUrl": "https://cdn.21st.dev/designali-in/liquid-glass-button/default/preview.1750605472950.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/buttons"
  },
  {
    "id": "21st-dev-thimows-animated-text-cycle",
    "source": "21st.dev",
    "title": "Animated Text Cycle",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "text",
      "hero",
      "landing-page",
      "features",
      "text-effects"
    ],
    "description": "A dynamic text that generates continuous sparkles with smooth transitions, perfect for highlighting text with animated stars.",
    "author": "Thimo Waanders",
    "previewImageUrl": "https://cdn.21st.dev/user_2ue7h0Xyywk5R5wzsNX1W8bcJq3/animated-text-cycle/animated-text-cycle/preview.png?v=1",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-thimows-sparkles-text",
    "source": "21st.dev",
    "title": "Sparkles Text",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "text",
      "hero",
      "landing-page",
      "features",
      "text-effects"
    ],
    "description": "A dynamic text that generates continuous sparkles with smooth transitions, perfect for highlighting text with animated stars.",
    "author": "Thimo Waanders",
    "previewImageUrl": "https://cdn.21st.dev/user_magicui/sparkles-text.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-tommyjepsen-animated-hero",
    "source": "21st.dev",
    "title": "Animated hero",
    "url": "https://21st.dev/community/components/tommyjepsen/animated-hero",
    "category": "hero",
    "tags": [
      "hero",
      "scroll-area",
      "demo",
      "animation",
      "landing-page"
    ],
    "description": "A scroll animation that rotates in 3d on scroll. Perfect for hero or marketing sections.",
    "author": "tommyjepsen",
    "previewImageUrl": "https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/animated-hero.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:00.208Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-tommyjepsen-container-scroll-animation",
    "source": "21st.dev",
    "title": "Container Scroll Animation",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "hero",
      "scroll-area",
      "demo",
      "animation",
      "landing-page"
    ],
    "description": "A scroll animation that rotates in 3d on scroll. Perfect for hero or marketing sections.",
    "author": "tommyjepsen",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/container-scroll-animation.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-tommyjepsen-expandable-tabs",
    "source": "21st.dev",
    "title": "Expandable Tabs",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "menu",
      "control",
      "tab",
      "navigation-menus",
      "tabs",
      "navbar-navigation",
      "features",
      "dashboard",
      "navigation",
      "settings"
    ],
    "description": "A set of expandable tabs that show both icon and text when selected. Tabs animate smoothly to expand or collapse on click, and clicking outside collapses any open tab.\\n\\nFeatures\\n- Animated Expansion: Smooth animations when revealing tab labels\\n- Space Efficient: Collapses to icons-only when not in use\\n- Click Outside: Automatically collapses when clicking outside\\n- Separator Support: Optional separators between tab groups\\n- Customizable: Supports custom colors and styling\\n- Shadcn/UI Theme: Fully integrated with shadcn/ui theming system\\n- Dark Mode: Built-in dark mode support\\n- Accessible: Keyboard navigation and screen reader friendly\\n\\nExample Use Cases\\n- Navigation Menus: Compact sidebar navigation\\n- Toolbars: Feature-rich toolbars that save space\\n- Mobile Interfaces: Touch-friendly navigation\\n- Settings Panels: Grouped settings controls\\n- Dashboard Controls: Quick access to main features",
    "author": "tommyjepsen",
    "previewImageUrl": "https://cdn.21st.dev/user_victorwelander/expandable-tabs.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-tommyjepsen-feature-with-image-comparison",
    "source": "21st.dev",
    "title": "Feature with Image Comparison",
    "url": "https://21st.dev/community/components/tommyjepsen/feature-with-image-comparison",
    "category": "hero",
    "tags": [
      "text",
      "hero",
      "landing-page",
      "features",
      "text-effects"
    ],
    "description": "A dynamic text that generates continuous sparkles with smooth transitions, perfect for highlighting text with animated stars.",
    "author": "Shadcnblocks.com",
    "previewImageUrl": "https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/feature-with-image-comparison.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:03.034Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-tommyjepsen-pricing-cards",
    "source": "21st.dev",
    "title": "Pricing Section",
    "url": "https://21st.dev/community/components/tommyjepsen/pricing-cards",
    "category": "pricing",
    "tags": [
      "pricing-section",
      "badge",
      "pricing-card",
      "button",
      "card",
      "grid",
      "framer-motion",
      "motion",
      "motion-primitives",
      "dark-mode",
      "dark-theme",
      "pricing"
    ],
    "description": "A modern, responsive single-plan pricing section built for SaaS apps. Easy to customize and integrate into any project.",
    "author": "Bankk",
    "previewImageUrl": "https://cdn.21st.dev/user_tommyjepsen/pricing-cards.png",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:03.811Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-tommyjepsen-pricing-interaction",
    "source": "21st.dev",
    "title": "Pricing Interaction",
    "url": "https://21st.dev/community/components/s/pricing",
    "category": "pricing",
    "tags": [
      "pricing-section",
      "pricing-card",
      "select",
      "pricing"
    ],
    "description": "A reusable pricing selector component that supports three plans (Free, Starter, Pro) with toggles between monthly and annual pricing, and highlights the selected plan dynamically.",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/user_2rmPdOT0hL8MtSnYm8IpqqrYTVg/pricing-interaction/default/preview.png?v=1",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-tommyjepsen-pricing-section-with-comparison",
    "source": "21st.dev",
    "title": "Pricing Section with Comparison",
    "url": "https://21st.dev/community/components/tommyjepsen/pricing-section-with-comparison",
    "category": "pricing",
    "tags": [
      "pricing-section",
      "pricing-card",
      "select",
      "pricing"
    ],
    "description": "A reusable pricing selector component that supports three plans (Free, Starter, Pro) with toggles between monthly and annual pricing, and highlights the selected plan dynamically.",
    "author": "Efferd",
    "previewImageUrl": "https://cdn.21st.dev/user_tommyjepsen/pricing-section-with-comparison.png",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:05.741Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-tommyjepsen-single-pricing-card-1",
    "source": "21st.dev",
    "title": "Single Pricing Card",
    "url": "https://21st.dev/community/components/s/pricing",
    "category": "pricing",
    "tags": [
      "pricing-section",
      "badge",
      "pricing-card",
      "button",
      "card",
      "grid",
      "framer-motion",
      "motion",
      "motion-primitives",
      "dark-mode",
      "dark-theme",
      "pricing"
    ],
    "description": "A modern, responsive single-plan pricing section built for SaaS apps. Easy to customize and integrate into any project.",
    "author": "Bankk",
    "previewImageUrl": "https://cdn.21st.dev/sshahaider/single-pricing-card/default/preview.1747467081300.png",
    "relatedPatternIds": [
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/pricing"
  },
  {
    "id": "21st-dev-tommyjepsen-sparkles-text",
    "source": "21st.dev",
    "title": "Sparkles Text",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "text",
      "hero",
      "landing-page",
      "features",
      "text-effects"
    ],
    "description": "A dynamic text that generates continuous sparkles with smooth transitions, perfect for highlighting text with animated stars.",
    "author": "Shadcnblocks.com",
    "previewImageUrl": "https://cdn.21st.dev/user_magicui/sparkles-text.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-vaib215-circular-testimonials",
    "source": "21st.dev",
    "title": "Circular Testimonials",
    "url": "https://21st.dev/community/components/s/testimonials",
    "category": "testimonials",
    "tags": [
      "feedback",
      "auto-play",
      "reviews",
      "testimonials",
      "carousel",
      "namer-ui",
      "circular",
      "rotating-text",
      "swapping",
      "spring",
      "testimonial",
      "form"
    ],
    "description": "An animated testimonial section that displays user feedback in a visually engaging way.\\n\\nFor the disclaimer, credit information, and the Vanilla HTML/CSS/JS version, please visit https://codepen.io/Northstrix/pen/QwWoYzZ\\n\\nVue Version https://namer-ui-for-vue.netlify.app/components/circular-testimonials\\n\\n\\nThis component (Next.js version) is also available on Namer UI https://namer-ui.netlify.app",
    "author": "Systaliko UI",
    "previewImageUrl": "https://cdn.21st.dev/maxim.bort.devel/circular-testimonials/default/preview.1749048275501.png",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-vaib215-dark-gradient-pricing",
    "source": "21st.dev",
    "title": "Dark Gradient Pricing",
    "url": "https://21st.dev/community/components/vaib215/dark-gradient-pricing",
    "category": "features",
    "tags": [
      "pricing-section",
      "features",
      "pricing",
      "cards"
    ],
    "description": "A dynamic pricing section with animated cards, confetti effects, and monthly/yearly toggle.\\n\\nFeatures:\\n\\t•\\tAnimated pricing cards using Framer Motion\\n\\t•\\tInteractive monthly/yearly pricing toggle with a confetti effect\\n\\t•\\tResponsive design using a mobile-first approach\\n\\t•\\tDynamic price updates with NumberFlow animations\\n\\t•\\tIndustry-specific content customization\\n\\t•\\tPopular plan highlighting\\n\\t•\\tDark mode compatibility",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rV0b4mwh6SKrMK7lUyQUkzEa92/dark-gradient-pricing.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:08.909Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-vaib215-pricing",
    "source": "21st.dev",
    "title": "Pricing",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "pricing-section",
      "features",
      "pricing",
      "cards"
    ],
    "description": "A dynamic pricing section with animated cards, confetti effects, and monthly/yearly toggle.\\n\\nFeatures:\\n\\t•\\tAnimated pricing cards using Framer Motion\\n\\t•\\tInteractive monthly/yearly pricing toggle with a confetti effect\\n\\t•\\tResponsive design using a mobile-first approach\\n\\t•\\tDynamic price updates with NumberFlow animations\\n\\t•\\tIndustry-specific content customization\\n\\t•\\tPopular plan highlighting\\n\\t•\\tDark mode compatibility",
    "author": "Kokonut UI",
    "previewImageUrl": "https://cdn.21st.dev/user_Codehagen/pricing.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-vaib215-stagger-testimonials",
    "source": "21st.dev",
    "title": "Stagger Testimonials",
    "url": "https://21st.dev/community/components/vaib215/stagger-testimonials",
    "category": "testimonials",
    "tags": [
      "feedback",
      "auto-play",
      "reviews",
      "testimonials",
      "carousel",
      "namer-ui",
      "circular",
      "rotating-text",
      "swapping",
      "spring",
      "testimonial",
      "form"
    ],
    "description": "An animated testimonial section that displays user feedback in a visually engaging way.\\n\\nFor the disclaimer, credit information, and the Vanilla HTML/CSS/JS version, please visit https://codepen.io/Northstrix/pen/QwWoYzZ\\n\\nVue Version https://namer-ui-for-vue.netlify.app/components/circular-testimonials\\n\\n\\nThis component (Next.js version) is also available on Namer UI https://namer-ui.netlify.app",
    "author": "Systaliko UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rV0b4mwh6SKrMK7lUyQUkzEa92/stagger-testimonials/default/preview.1748453527935.png",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:10.745Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-vaib215-testimonial-cards",
    "source": "21st.dev",
    "title": "Testimonial Cards",
    "url": "https://21st.dev/community/components/vaib215/testimonial-cards",
    "category": "testimonials",
    "tags": [
      "reviews",
      "testimonials",
      "clients",
      "testimonial",
      "cards"
    ],
    "description": "an animated testimonials section where the testimonials are shown in columns",
    "author": "Bankk",
    "previewImageUrl": "https://cdn.21st.dev/user_2rV0b4mwh6SKrMK7lUyQUkzEa92/testimonial-cards/testimonial-cards/preview.png?v=1",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:11.571Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-vaib215-testimonials-columns-1",
    "source": "21st.dev",
    "title": "Testimonials Columns",
    "url": "https://21st.dev/community/components/s/testimonials",
    "category": "testimonials",
    "tags": [
      "reviews",
      "testimonials",
      "clients",
      "testimonial"
    ],
    "description": "an animated testimonials section where the testimonials are shown in columns",
    "author": "Bankk",
    "previewImageUrl": "https://cdn.21st.dev/user_2tWTE0rCrloVAVylFPYfp10xU92/testimonials-columns-1/default/preview.1746775320320.png",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-victorwelander-container-scroll-animation",
    "source": "21st.dev",
    "title": "Container Scroll Animation",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "hero",
      "scroll-area",
      "demo",
      "animation",
      "landing-page"
    ],
    "description": "A scroll animation that rotates in 3d on scroll. Perfect for hero or marketing sections.",
    "author": "victorwelander",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/container-scroll-animation.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-victorwelander-expandable-tabs",
    "source": "21st.dev",
    "title": "Expandable Tabs",
    "url": "https://21st.dev/community/components/victorwelander/expandable-tabs",
    "category": "hero",
    "tags": [
      "hero",
      "scroll-area",
      "demo",
      "animation",
      "landing-page"
    ],
    "description": "A scroll animation that rotates in 3d on scroll. Perfect for hero or marketing sections.",
    "author": "victorwelander",
    "previewImageUrl": "https://cdn.21st.dev/user_victorwelander/expandable-tabs.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:14.625Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-victorwelander-gooey-text-morphing",
    "source": "21st.dev",
    "title": "Gooey Text Morphing",
    "url": "https://21st.dev/community/components/victorwelander/gooey-text-morphing",
    "category": "features",
    "tags": [
      "pricing-section",
      "pricing-card",
      "features",
      "pricing"
    ],
    "description": "A modern, animated pricing card component with features and perks sections.\\n\\nFeatures:\\n\\t•\\tSmooth animations on scroll\\n\\t•\\tResponsive layout\\n\\t•\\tCustomizable content\\n\\t•\\tFeature/perk lists with icons\\n\\t•\\tOriginal price display (optional)\\n\\t•\\tCustom button action\\n\\nProps:\\n\\t•\\ttitle: string\\n\\t•\\tdescription: string\\n\\t•\\tprice: number\\n\\t•\\toriginalPrice?: number\\n\\t•\\tfeatures: PricingFeature[]\\n\\t•\\tbuttonText?: string\\n\\t•\\tonButtonClick?: () => void\\n",
    "author": "victorwelander",
    "previewImageUrl": "https://cdn.21st.dev/user_victorwelander/gooey-text-morphing.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:15.420Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-victorwelander-lamp",
    "source": "21st.dev",
    "title": "Lamp",
    "url": "https://21st.dev/community/components/s/hero",
    "category": "hero",
    "tags": [
      "landing-page",
      "linear",
      "hero",
      "header"
    ],
    "description": "A lamp effect as seen on linear, great for section headers.",
    "author": "victorwelander",
    "previewImageUrl": "https://cdn.21st.dev/user_aceternity/lamp.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-victorwelander-pricing-card",
    "source": "21st.dev",
    "title": "Pricing Card",
    "url": "https://21st.dev/community/components/s/features",
    "category": "features",
    "tags": [
      "pricing-section",
      "pricing-card",
      "features",
      "pricing"
    ],
    "description": "A modern, animated pricing card component with features and perks sections.\\n\\nFeatures:\\n\\t•\\tSmooth animations on scroll\\n\\t•\\tResponsive layout\\n\\t•\\tCustomizable content\\n\\t•\\tFeature/perk lists with icons\\n\\t•\\tOriginal price display (optional)\\n\\t•\\tCustom button action\\n\\nProps:\\n\\t•\\ttitle: string\\n\\t•\\tdescription: string\\n\\t•\\tprice: number\\n\\t•\\toriginalPrice?: number\\n\\t•\\tfeatures: PricingFeature[]\\n\\t•\\tbuttonText?: string\\n\\t•\\tonButtonClick?: () => void\\n",
    "author": "victorwelander",
    "previewImageUrl": "https://cdn.21st.dev/user_BankkRoll/pricing-card.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-victorwelander-upgrade-banner",
    "source": "21st.dev",
    "title": "Upgrade Banner",
    "url": "https://21st.dev/community/components/victorwelander/upgrade-banner",
    "category": "features",
    "tags": [
      "announcements",
      "badge",
      "announcement",
      "features",
      "call-to-action"
    ],
    "description": "An animated promotional banner component with floating gear icons and hover effects. Inspired by Vercel's upgrade prompts.\\n\\nFeatures\\n- Smooth entrance animation\\n- Interactive floating gear icons on hover\\n- Dark mode support\\n- Customizable button text and description\\n- Optional close button\\n- Responsive design\\n- Accessible button interactions\\n\\nPerfect for:\\n- Premium feature promotions\\n- Upgrade notifications\\n- Subscription upsells\\n- Feature announcements\\n\\nProps\\n- `buttonText` - Primary call-to-action text (default: \\",
    "author": "Magic UI",
    "previewImageUrl": "https://cdn.21st.dev/user_victorwelander/upgrade-banner.png",
    "relatedPatternIds": [
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:18.102Z",
    "fallbackUrl": "https://21st.dev/community/components/s/features"
  },
  {
    "id": "21st-dev-xubohuah-entropy",
    "source": "21st.dev",
    "title": "Entropy",
    "url": "https://21st.dev/community/components/xubohuah/entropy",
    "category": "hero",
    "tags": [
      "landing-page",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "Order and chaos dance —digital poetry in motion.",
    "author": "KainXu",
    "previewImageUrl": "https://cdn.21st.dev/user_2vl1Dn19f2uJMuYVfUEcAh5qqyv/entropy/default/preview.1745329100338.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:19.121Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-xubohuah-flickering-grid-hero",
    "source": "21st.dev",
    "title": "FlickeringGridHero",
    "url": "https://21st.dev/community/components/xubohuah/flickering-grid-hero",
    "category": "hero",
    "tags": [
      "animation",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "Inspired by magic ui",
    "author": "KainXu",
    "previewImageUrl": "https://cdn.21st.dev/xubohuah/flickering-grid-hero/default/preview.1748402352650.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:19.889Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-xubohuah-hand-writing-text",
    "source": "21st.dev",
    "title": "Hand Writing Text",
    "url": "https://21st.dev/community/components/s/cta",
    "category": "cta",
    "tags": [
      "motion-primitives",
      "text-effects",
      "text",
      "call-to-action"
    ],
    "description": "A nice svg hand written text",
    "author": "KainXu",
    "previewImageUrl": "https://cdn.21st.dev/user_2rQ1QHrJyxpmWMHhqhANzWMc64n/hand-writing-text/default/preview.png?v=2",
    "relatedPatternIds": [
      "split-cta",
      "banner-cta",
      "card-cta"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/cta"
  },
  {
    "id": "21st-dev-xubohuah-particle-text-effect",
    "source": "21st.dev",
    "title": "ParticleTextEffect",
    "url": "https://21st.dev/community/components/xubohuah/particle-text-effect",
    "category": "other",
    "tags": [
      "shader",
      "animated-shader",
      "canvas",
      "backgrounds",
      "animated-background",
      "background"
    ],
    "description": "A dynamic text animation component that renders words using interactive particles with fluid motion and color transitions, allowing particle destruction through right-click mouse interaction.",
    "author": "KainXu",
    "previewImageUrl": "https://cdn.21st.dev/xubohuah/particle-text-effect/default/preview.1750754554695.png",
    "relatedPatternIds": [],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:21.384Z",
    "fallbackUrl": "https://21st.dev/community/components"
  },
  {
    "id": "21st-dev-xubohuah-spiral-animation",
    "source": "21st.dev",
    "title": "SpiralAnimation",
    "url": "https://21st.dev/community/components/xubohuah/spiral-animation",
    "category": "hero",
    "tags": [
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "The inspiration comes from Bleuje",
    "author": "KainXu",
    "previewImageUrl": "https://cdn.21st.dev/user_2vl1Dn19f2uJMuYVfUEcAh5qqyv/spiral-animation/spiral-animation/preview.png?v=1",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:22.163Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-xubohuah-wave-background",
    "source": "21st.dev",
    "title": "Wave Background",
    "url": "https://21st.dev/community/components/xubohuah/wave-background",
    "category": "hero",
    "tags": [
      "canvas",
      "hero",
      "backgrounds",
      "background"
    ],
    "description": "Inspired by antoine",
    "author": "KainXu",
    "previewImageUrl": "https://cdn.21st.dev/user_2vl1Dn19f2uJMuYVfUEcAh5qqyv/wave-background/default/preview.1745935040082.png",
    "relatedPatternIds": [
      "split-hero",
      "hero-product-preview",
      "hero-trust-bar"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:23.017Z",
    "fallbackUrl": "https://21st.dev/community/components/s/hero"
  },
  {
    "id": "21st-dev-youcefbnm-animated-cards-stack",
    "source": "21st.dev",
    "title": "Animated Cards Stack",
    "url": "https://21st.dev/community/components/youcefbnm/animated-cards-stack",
    "category": "testimonials",
    "tags": [
      "testimonials",
      "vaib",
      "testimonial",
      "cards"
    ],
    "description": "Testimonial Component that stands apart from the boring boxes of quotes. Dark mode compatible, no frame motion used.",
    "author": "Systaliko UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2sdAd21yCZlZRkVtZyf4K8ogkBh/animated-cards-stack/animated-cards-stack-on-scroll/preview.png?v=1",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:19:24.321Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  },
  {
    "id": "21st-dev-youcefbnm-stagger-testimonials",
    "source": "21st.dev",
    "title": "Stagger Testimonials",
    "url": "https://21st.dev/community/components/s/testimonials",
    "category": "testimonials",
    "tags": [
      "testimonials",
      "vaib",
      "testimonial"
    ],
    "description": "Testimonial Component that stands apart from the boring boxes of quotes. Dark mode compatible, no frame motion used.",
    "author": "Systaliko UI",
    "previewImageUrl": "https://cdn.21st.dev/user_2rV0b4mwh6SKrMK7lUyQUkzEa92/stagger-testimonials/default/preview.1748453527935.png",
    "relatedPatternIds": [
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote"
    ],
    "usageNote": "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.",
    "scrapedAt": "2026-06-06T17:06:57.661Z",
    "urlStatus": "ok",
    "checkedAt": "2026-06-06T19:45:52.662Z",
    "fallbackUrl": "https://21st.dev/community/components/s/testimonials"
  }
];

export const templateReferences: TemplateReference[] = [
  ...communityTemplateReferences,
  ...watermelonTemplateReferences,
  ...typeUiDesignSkillReferences,
  ...huashuDesignReferences,
  ...uiUxProMaxReferences,
  ...tasteSkillReferences,
  ...antiAiSlopWritingReferences,
  ...hallmarkDesignReferences,
  ...stopSlopReferences,
  ...antiAiSlopPackReferences,
  ...interfaceDesignReferences,
  ...magicUiTemplateReferences,
  ...aceternityTemplateReferences,
  ...layoutGuidelineReferences,
  ...interactionGuidelineReferences,
  ...visualSystemGuidelineReferences,
  ...dataVisualizationGuidelineReferences,
  ...tableGuidelineReferences,
  ...navigationGuidelineReferences
];
