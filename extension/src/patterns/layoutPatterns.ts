import type { DesignIntent, UIProblem } from "../shared/types";

export type PatternCategory =
  | "hero"
  | "features"
  | "pricing"
  | "stats"
  | "cta"
  | "form"
  | "testimonials"
  | "dashboard"
  | "auth"
  | "navigation"
  | "footer"
  | "ecommerce"
  | "content"
  | "comparison"
  | "faq";

export type LayoutPatternId =
  | "split-hero"
  | "centered-hero"
  | "hero-product-preview"
  | "hero-trust-bar"
  | "hero-feature-chips"
  | "hero-social-proof-strip"
  | "hero-dashboard-preview"
  | "hero-email-capture"
  | "hero-logo-cloud"
  | "hero-video-demo"
  | "hero-tabs-preview"
  | "hero-image-background"
  | "hero-contained-card"
  | "hero-off-grid-visual"
  | "featured-side-stack"
  | "bento-grid"
  | "center-highlight"
  | "alternating-feature-rows"
  | "icon-grid-grouping"
  | "problem-solution-cards"
  | "feature-comparison-blocks"
  | "workflow-feature-grid"
  | "pricing-emphasis"
  | "plan-comparison-table"
  | "two-tier-pricing-split"
  | "pricing-faq-combo"
  | "hero-metric-support-stats"
  | "stats-strip"
  | "metric-bento"
  | "before-after-metrics"
  | "banner-cta"
  | "split-cta"
  | "card-cta"
  | "cta-trust-notes"
  | "form-benefits-sidebar"
  | "two-step-form-layout"
  | "compact-lead-form"
  | "form-faq-sidebar"
  | "testimonial-wall"
  | "featured-testimonial"
  | "logo-cloud-quote"
  | "review-cards-carousel"
  | "analytics-overview"
  | "metric-trend-grid"
  | "activity-feed-sidebar"
  | "table-summary-rail"
  | "kanban-board"
  | "settings-detail-pane"
  | "split-auth-proof"
  | "magic-link-panel"
  | "onboarding-checklist-form"
  | "profile-settings-form"
  | "command-center-nav"
  | "sidebar-app-shell"
  | "mega-menu-topbar"
  | "footer-link-hub"
  | "product-detail-split"
  | "product-card-grid"
  | "checkout-summary-split"
  | "comparison-spec-table"
  | "faq-sidebar"
  | "editorial-feature-stack"
  | "changelog-timeline"
  | "resource-card-grid"
  | "before-after-hero"
  | "demo-steps-hero"
  | "feature-tabs"
  | "integration-logo-grid"
  | "comparison-matrix"
  | "quote-wall"
  | "case-study-split"
  | "pricing-toggle"
  | "demo-panel-cta"
  | "stats-story-band";

export const patternCategories = [
  "hero",
  "features",
  "pricing",
  "stats",
  "cta",
  "form",
  "testimonials",
  "dashboard",
  "auth",
  "navigation",
  "footer",
  "ecommerce",
  "content",
  "comparison",
  "faq"
] as const satisfies readonly PatternCategory[];

export const layoutPatternIds = [
  "split-hero",
  "centered-hero",
  "hero-product-preview",
  "hero-trust-bar",
  "hero-feature-chips",
  "hero-social-proof-strip",
  "hero-dashboard-preview",
  "hero-email-capture",
  "hero-logo-cloud",
  "hero-video-demo",
  "hero-tabs-preview",
  "hero-image-background",
  "hero-contained-card",
  "hero-off-grid-visual",
  "featured-side-stack",
  "bento-grid",
  "center-highlight",
  "alternating-feature-rows",
  "icon-grid-grouping",
  "problem-solution-cards",
  "feature-comparison-blocks",
  "workflow-feature-grid",
  "pricing-emphasis",
  "plan-comparison-table",
  "two-tier-pricing-split",
  "pricing-faq-combo",
  "hero-metric-support-stats",
  "stats-strip",
  "metric-bento",
  "before-after-metrics",
  "banner-cta",
  "split-cta",
  "card-cta",
  "cta-trust-notes",
  "form-benefits-sidebar",
  "two-step-form-layout",
  "compact-lead-form",
  "form-faq-sidebar",
  "testimonial-wall",
  "featured-testimonial",
  "logo-cloud-quote",
  "review-cards-carousel",
  "analytics-overview",
  "metric-trend-grid",
  "activity-feed-sidebar",
  "table-summary-rail",
  "kanban-board",
  "settings-detail-pane",
  "split-auth-proof",
  "magic-link-panel",
  "onboarding-checklist-form",
  "profile-settings-form",
  "command-center-nav",
  "sidebar-app-shell",
  "mega-menu-topbar",
  "footer-link-hub",
  "product-detail-split",
  "product-card-grid",
  "checkout-summary-split",
  "comparison-spec-table",
  "faq-sidebar",
  "editorial-feature-stack",
  "changelog-timeline",
  "resource-card-grid",
  "before-after-hero",
  "demo-steps-hero",
  "feature-tabs",
  "integration-logo-grid",
  "comparison-matrix",
  "quote-wall",
  "case-study-split",
  "pricing-toggle",
  "demo-panel-cta",
  "stats-story-band"
] as const satisfies readonly LayoutPatternId[];

export type LayoutPattern = {
  id: LayoutPatternId;
  name: string;
  category: PatternCategory;
  inspirationTags: string[];
  keywords: string[];
  solvesProblems: UIProblem[];
  designIntents: DesignIntent[];
  problemSolved: string[];
  bestFor: string;
  avoidWhen: string;
  requiredElements: string[];
  layoutPreviewType: LayoutPatternId;
  tailwindHint: string;
  promptInstruction: string;
  exampleStructure: string;
};

type RawLayoutPattern = Omit<LayoutPattern, "keywords" | "solvesProblems" | "designIntents"> &
  Partial<Pick<LayoutPattern, "keywords" | "solvesProblems" | "designIntents">>;

const rawLayoutPatterns: RawLayoutPattern[] = [
  {
    id: "split-hero",
    name: "Split Hero",
    category: "hero",
    inspirationTags: ["saas-landing", "conversion-section"],
    problemSolved: ["Hero text and product context compete for attention.", "The first viewport lacks a clear reading path."],
    bestFor: "Landing pages that need a concise message beside a product visual, form, or proof panel.",
    avoidWhen: "The hero has no meaningful visual or needs a purely editorial, centered announcement.",
    requiredElements: ["headline", "supporting copy", "primary action", "visual or proof panel"],
    layoutPreviewType: "split-hero",
    tailwindHint: "Use grid grid-cols-1 lg:grid-cols-2 gap-8 items-center with a constrained text column and stable visual aspect-ratio.",
    promptInstruction: "Refactor the hero into a balanced split layout with copy on one side and the most relevant product or proof content on the other.",
    exampleStructure: "Left: headline, copy, actions. Right: product preview or proof module."
  },
  {
    id: "centered-hero",
    name: "Centered Hero",
    category: "hero",
    inspirationTags: ["saas-landing", "conversion-section"],
    problemSolved: ["The hero feels scattered.", "Primary message is diluted by too many side elements."],
    bestFor: "Simple launches, waitlists, and focused product messages with one dominant action.",
    avoidWhen: "A complex product screenshot needs equal prominence beside the copy.",
    requiredElements: ["headline", "supporting copy", "primary action"],
    layoutPreviewType: "centered-hero",
    tailwindHint: "Use mx-auto max-w-3xl text-center with stacked actions and optional proof row below.",
    promptInstruction: "Refactor the hero into a centered message with strong hierarchy, a clear action row, and restrained supporting proof.",
    exampleStructure: "Centered headline, short paragraph, actions, optional compact proof row."
  },
  {
    id: "hero-product-preview",
    name: "Hero Product Preview",
    category: "hero",
    inspirationTags: ["saas-landing", "product-preview"],
    problemSolved: ["The hero describes the product but does not show it.", "Users cannot quickly understand what the product does."],
    bestFor: "Software and tool pages where a screenshot, canvas, or generated result is the strongest explanation.",
    avoidWhen: "The product has no stable visual state or the preview would be misleading.",
    requiredElements: ["headline", "supporting copy", "primary action", "product preview"],
    layoutPreviewType: "hero-product-preview",
    tailwindHint: "Use a centered copy block followed by a wide rounded preview with aspect-video, border, and subtle shadow.",
    promptInstruction: "Refactor the hero so the product preview becomes the main visual proof while keeping the headline and action hierarchy concise.",
    exampleStructure: "Top: message and actions. Bottom: wide product preview with small supporting details."
  },
  {
    id: "hero-trust-bar",
    name: "Hero Trust Bar",
    category: "hero",
    inspirationTags: ["saas-landing", "social-proof"],
    problemSolved: ["The hero asks for trust before showing evidence.", "Proof points are buried below the fold."],
    bestFor: "Conversion-focused pages with logos, metrics, ratings, or customer counts available.",
    avoidWhen: "There is no real proof to show or trust markers would distract from a transactional flow.",
    requiredElements: ["headline", "primary action", "proof items"],
    layoutPreviewType: "hero-trust-bar",
    tailwindHint: "Use a hero stack with a compact grid or flex trust bar directly under the action row.",
    promptInstruction: "Add a compact trust bar under the hero actions using existing proof content, keeping it secondary to the main message.",
    exampleStructure: "Hero message, actions, horizontal proof strip with logos or concise metrics."
  },
  {
    id: "hero-feature-chips",
    name: "Hero Feature Chips",
    category: "hero",
    inspirationTags: ["saas-landing", "product-preview"],
    problemSolved: ["The hero lists benefits in a dense paragraph.", "Key product capabilities are hard to scan."],
    bestFor: "Products with three to six crisp capabilities that support the headline.",
    avoidWhen: "The feature list is long, technical, or better explained in a dedicated section.",
    requiredElements: ["headline", "supporting copy", "feature labels"],
    layoutPreviewType: "hero-feature-chips",
    tailwindHint: "Use flex flex-wrap justify-center or justify-start gap-2 for compact feature chips beneath the hero copy.",
    promptInstruction: "Convert supporting feature details into concise visual chips that reinforce the hero without becoming a full feature grid.",
    exampleStructure: "Hero copy, actions, wrapped feature chips with short labels."
  },
  {
    id: "hero-social-proof-strip",
    name: "Hero Social Proof Strip",
    category: "hero",
    inspirationTags: ["saas-landing", "social-proof"],
    problemSolved: ["Testimonials and usage proof feel disconnected from the hero.", "The first viewport lacks credibility cues."],
    bestFor: "Hero sections with a short quote, rating, usage count, or customer proof available.",
    avoidWhen: "The proof is weak, generic, or visually overwhelms the primary CTA.",
    requiredElements: ["headline", "primary action", "social proof"],
    layoutPreviewType: "hero-social-proof-strip",
    tailwindHint: "Use a narrow proof strip with avatar/quote/metric cells under the primary hero content.",
    promptInstruction: "Place concise social proof directly below the hero message as a strip that builds confidence without changing the core CTA.",
    exampleStructure: "Hero message, actions, three-cell proof strip with quote, rating, or metric."
  },
  {
    id: "hero-dashboard-preview",
    name: "Hero Dashboard Preview",
    category: "hero",
    inspirationTags: ["saas-landing", "dashboard", "product-preview"],
    problemSolved: ["The hero describes a SaaS product without showing the working interface.", "The product value is too abstract on first glance."],
    bestFor: "SaaS tools where a real dashboard, workspace, or product state explains the value proposition.",
    avoidWhen: "The product UI is unavailable, visually misleading, or too detailed for first-glance comprehension.",
    requiredElements: ["headline", "supporting copy", "primary action", "dashboard preview"],
    layoutPreviewType: "hero-dashboard-preview",
    tailwindHint: "Use a concise hero copy column with a large product/dashboard preview panel that stays legible and connected to the value proposition.",
    promptInstruction: "Refactor the hero so a dashboard/product preview becomes the main proof, using only real product UI or honest placeholders from the existing page.",
    exampleStructure: "Left copy and CTA; right large dashboard preview with two or three readable UI modules."
  },
  {
    id: "hero-email-capture",
    name: "Hero Email Capture",
    category: "hero",
    inspirationTags: ["saas-landing", "email-cta", "lead-capture"],
    problemSolved: ["The hero CTA requires too much navigation before conversion.", "Users cannot start the intended signup/waitlist flow immediately."],
    bestFor: "Waitlists, newsletters, early access pages, invite flows, and products where email is the first conversion step.",
    avoidWhen: "The primary action is not email-based or the page already has a complex signup flow.",
    requiredElements: ["headline", "supporting copy", "email input", "primary action"],
    layoutPreviewType: "hero-email-capture",
    tailwindHint: "Use a compact email input and submit button directly under the value proposition, with a short reassurance note below.",
    promptInstruction: "Refactor the hero CTA into an email-capture flow when the existing content supports waitlist, newsletter, invite, or magic-link conversion.",
    exampleStructure: "Heading, short copy, inline email field plus button, small trust note."
  },
  {
    id: "hero-logo-cloud",
    name: "Hero Logo Cloud",
    category: "hero",
    inspirationTags: ["saas-landing", "logos", "social-proof"],
    problemSolved: ["The hero asks for trust without visible credibility cues.", "Customer or integration proof is disconnected from the main claim."],
    bestFor: "B2B SaaS pages with recognizable customers, partners, integrations, or media logos.",
    avoidWhen: "Logos are unavailable, unverified, or would distract from a simple consumer conversion path.",
    requiredElements: ["headline", "primary action", "logos or customer names"],
    layoutPreviewType: "hero-logo-cloud",
    tailwindHint: "Place a restrained logo cloud below the CTA or beside the hero visual, keeping it secondary to the main message.",
    promptInstruction: "Add or reorganize existing customer/integration logos near the hero CTA as proof without overpowering the headline.",
    exampleStructure: "Hero message and CTA followed by a compact row/grid of logos or trusted names."
  },
  {
    id: "hero-video-demo",
    name: "Hero Video Demo",
    category: "hero",
    inspirationTags: ["saas-landing", "video", "product-preview"],
    problemSolved: ["The hero needs to show motion or workflow, but the visual is static or decorative.", "Users cannot understand the product interaction from copy alone."],
    bestFor: "Products where a short demo, walkthrough, or animated product state directly clarifies value.",
    avoidWhen: "Video would slow down the initial load or compete with the headline and CTA.",
    requiredElements: ["headline", "supporting copy", "primary action", "video or demo panel"],
    layoutPreviewType: "hero-video-demo",
    tailwindHint: "Use an optimized video/demo panel with a clear play affordance; keep headline, copy, and CTA immediately readable.",
    promptInstruction: "Refactor the hero around a purposeful video/demo panel only when it explains the product better than a static image.",
    exampleStructure: "Hero copy and CTA paired with a video/demo panel that has a visible play or motion state."
  },
  {
    id: "hero-tabs-preview",
    name: "Hero Tabs Preview",
    category: "hero",
    inspirationTags: ["saas-landing", "tabs", "product-preview"],
    problemSolved: ["The hero tries to explain multiple modes at once.", "Users cannot scan distinct use cases or product views quickly."],
    bestFor: "SaaS products with multiple audiences, workflows, modes, or product tabs.",
    avoidWhen: "Tabs would imply unsupported interaction or hide the primary value proposition.",
    requiredElements: ["headline", "tab labels", "active product/content preview", "primary action"],
    layoutPreviewType: "hero-tabs-preview",
    tailwindHint: "Use a small tab/segmented control connected to one active preview panel; preserve existing tab behavior if present.",
    promptInstruction: "Refactor the hero to show distinct product modes with tabs when the existing content already implies multiple use cases.",
    exampleStructure: "Hero copy, CTA, tab row, active preview panel."
  },
  {
    id: "hero-image-background",
    name: "Hero Image Background",
    category: "hero",
    inspirationTags: ["saas-landing", "image-background", "contained"],
    problemSolved: ["The hero background is decorative but unrelated, or the foreground text lacks enough visual context.", "The first viewport feels generic."],
    bestFor: "Brand, product, event, or venue pages where a real image immediately communicates the offer.",
    avoidWhen: "No relevant image exists or text contrast/readability would suffer.",
    requiredElements: ["headline", "supporting copy", "primary action", "relevant background image"],
    layoutPreviewType: "hero-image-background",
    tailwindHint: "Use a real relevant image as the hero background with strong overlay contrast and no text-card wrapper unless required for readability.",
    promptInstruction: "Refactor the hero around a relevant real image background only if it directly supports the offer and keeps text readable.",
    exampleStructure: "Full-bleed or contained image background with headline, copy, and CTA layered in a readable area."
  },
  {
    id: "hero-contained-card",
    name: "Hero Contained Card",
    category: "hero",
    inspirationTags: ["saas-landing", "contained", "cards"],
    problemSolved: ["The hero bleeds into the page without a clear composition boundary.", "The message and proof elements feel scattered."],
    bestFor: "Compact SaaS landing pages that need a focused hero module without a full-bleed treatment.",
    avoidWhen: "The page needs immersive brand impact or a full viewport visual.",
    requiredElements: ["headline", "supporting copy", "primary action", "contained proof or visual"],
    layoutPreviewType: "hero-contained-card",
    tailwindHint: "Use a constrained hero container with a clear internal grid and modest radius; avoid nested card-on-card shells.",
    promptInstruction: "Refactor the hero into a contained module when the content benefits from a focused boundary and compact proof.",
    exampleStructure: "Constrained hero panel with copy, CTA, and adjacent proof/preview module."
  },
  {
    id: "hero-off-grid-visual",
    name: "Hero Off-Grid Visual",
    category: "hero",
    inspirationTags: ["saas-landing", "off-grid", "feature-abstracts"],
    problemSolved: ["The hero feels too symmetrical or template-like.", "The visual does not create a memorable scan path."],
    bestFor: "Creative SaaS or AI products where an asymmetrical preview can still preserve clarity.",
    avoidWhen: "The layout would reduce readability, accessibility, or mobile stability.",
    requiredElements: ["headline", "supporting copy", "primary action", "asymmetric visual"],
    layoutPreviewType: "hero-off-grid-visual",
    tailwindHint: "Use an asymmetrical grid with one intentional visual offset; keep text alignment and mobile stacking stable.",
    promptInstruction: "Refactor the hero into a controlled off-grid composition only when asymmetry improves the scan path and does not hide the CTA.",
    exampleStructure: "Anchored copy column plus overlapping or offset visual cards with a stable mobile stack."
  },
  {
    id: "featured-side-stack",
    name: "Featured + Side Stack",
    category: "features",
    inspirationTags: ["saas-landing", "product-preview"],
    problemSolved: ["All cards have equal weight even when one idea matters most.", "Repeated cards feel flat."],
    bestFor: "Feature sections where one item should be visually stronger than the rest.",
    avoidWhen: "Every item truly has equal priority or the content cannot be reordered.",
    requiredElements: ["feature cards", "one primary feature", "supporting features"],
    layoutPreviewType: "featured-side-stack",
    tailwindHint: "Use grid grid-cols-1 lg:grid-cols-3 gap-6; make first card lg:col-span-2 lg:row-span-2.",
    promptInstruction: "Refactor equal cards into a featured layout where the first card is larger and the remaining cards are stacked on the side.",
    exampleStructure: "Large featured card on the left; two or three supporting cards stacked on the right."
  },
  {
    id: "bento-grid",
    name: "Bento Grid",
    category: "features",
    inspirationTags: ["saas-landing", "product-preview"],
    problemSolved: ["A uniform grid feels generic.", "Important features do not stand out."],
    bestFor: "SaaS features, AI tools, and product capability sections.",
    avoidWhen: "Cards have highly variable text lengths that would make spans feel arbitrary.",
    requiredElements: ["feature cards", "short headings", "supporting descriptions"],
    layoutPreviewType: "bento-grid",
    tailwindHint: "Use CSS grid with asymmetric spans; keep mobile as one column.",
    promptInstruction: "Refactor the section into a bento grid with varied card sizes while preserving existing content.",
    exampleStructure: "One wide card, one tall card, and smaller supporting cards in a responsive grid."
  },
  {
    id: "center-highlight",
    name: "Center Highlight",
    category: "features",
    inspirationTags: ["saas-landing", "conversion-section"],
    problemSolved: ["The main benefit is hidden among secondary cards.", "The section lacks a focal point."],
    bestFor: "Benefits, value proposition sections, and main feature emphasis.",
    avoidWhen: "No single item should be presented as more important.",
    requiredElements: ["main card", "secondary cards"],
    layoutPreviewType: "center-highlight",
    tailwindHint: "Use centered max-width layout; main card full/centered, secondary cards in two columns.",
    promptInstruction: "Refactor the section so the most important card is highlighted in the center and the other cards support it.",
    exampleStructure: "Dominant center card above or between smaller supporting cards."
  },
  {
    id: "alternating-feature-rows",
    name: "Alternating Feature Rows",
    category: "features",
    inspirationTags: ["saas-landing", "product-preview"],
    problemSolved: ["Dense cards do not explain complex features well.", "Screenshots and copy need more breathing room."],
    bestFor: "Feature sections with three to five substantial features and supporting visuals.",
    avoidWhen: "Each feature only has a short label and no detail to justify a row.",
    requiredElements: ["feature heading", "feature description", "visual or detail panel"],
    layoutPreviewType: "alternating-feature-rows",
    tailwindHint: "Use stacked rows with md:grid-cols-2 and alternate visual/text order on desktop.",
    promptInstruction: "Refactor compact feature cards into alternating rows that give each feature room for explanation and visual support.",
    exampleStructure: "Row 1 text left visual right; row 2 visual left text right; repeat."
  },
  {
    id: "icon-grid-grouping",
    name: "Icon Grid Grouping",
    category: "features",
    inspirationTags: ["saas-landing", "mobile-onboarding"],
    problemSolved: ["Many small features feel noisy.", "Users cannot scan categories quickly."],
    bestFor: "Feature lists with six or more small capabilities that can be grouped.",
    avoidWhen: "Icons are decorative only or the features need long explanations.",
    requiredElements: ["icons or labels", "feature names", "category grouping"],
    layoutPreviewType: "icon-grid-grouping",
    tailwindHint: "Use a responsive grid with compact icon cells and optional group headings.",
    promptInstruction: "Group small features into a compact icon grid with clear categories and consistent spacing.",
    exampleStructure: "Group heading, two-column or three-column icon feature cells."
  },
  {
    id: "problem-solution-cards",
    name: "Problem / Solution Cards",
    category: "features",
    inspirationTags: ["saas-landing", "conversion-section"],
    problemSolved: ["Benefits feel generic.", "Users do not see what pain each feature resolves."],
    bestFor: "Feature sections that need stronger narrative and clearer before/after framing.",
    avoidWhen: "The page should stay purely technical or each item is not tied to a user problem.",
    requiredElements: ["problem statement", "solution statement", "feature details"],
    layoutPreviewType: "problem-solution-cards",
    tailwindHint: "Use paired card interiors with muted problem copy and emphasized solution copy.",
    promptInstruction: "Rewrite the card structure visually into problem and solution zones while preserving the original content meaning.",
    exampleStructure: "Each card: problem label, short pain statement, solution heading, benefit copy."
  },
  {
    id: "feature-comparison-blocks",
    name: "Feature Comparison Blocks",
    category: "features",
    inspirationTags: ["saas-landing", "conversion-section"],
    problemSolved: ["The section does not clarify differences between options or states.", "Users cannot compare feature groups."],
    bestFor: "Sections comparing old vs new, manual vs automated, or basic vs advanced workflows.",
    avoidWhen: "There are no meaningful contrasts to compare.",
    requiredElements: ["two or more comparison groups", "feature details"],
    layoutPreviewType: "feature-comparison-blocks",
    tailwindHint: "Use md:grid-cols-2 comparison panels with aligned rows and distinct headings.",
    promptInstruction: "Refactor the content into comparison blocks that make the key differences easy to scan.",
    exampleStructure: "Two columns with matched rows, labels, and emphasized winning attributes."
  },
  {
    id: "workflow-feature-grid",
    name: "Workflow Feature Grid",
    category: "features",
    inspirationTags: ["saas-landing", "mobile-onboarding"],
    problemSolved: ["Process steps appear as unrelated cards.", "The sequence of action is unclear."],
    bestFor: "How-it-works, onboarding, and workflow feature sections.",
    avoidWhen: "Items are independent features rather than ordered steps.",
    requiredElements: ["steps", "step labels", "descriptions"],
    layoutPreviewType: "workflow-feature-grid",
    tailwindHint: "Use flex flex-col md:flex-row or grid with numbered markers and connector lines.",
    promptInstruction: "Refactor the cards into a step-by-step workflow with visible sequence markers and clear progression.",
    exampleStructure: "Step cards with numbers, connectors, and short action-oriented descriptions."
  },
  {
    id: "pricing-emphasis",
    name: "Pricing Emphasis",
    category: "pricing",
    inspirationTags: ["pricing-page", "conversion-section"],
    problemSolved: ["All plans look equally important.", "The recommended plan is not obvious."],
    bestFor: "Pricing sections with Basic, Pro, and Team-style plans.",
    avoidWhen: "The product intentionally avoids recommending a plan.",
    requiredElements: ["pricing plans", "recommended plan", "plan actions"],
    layoutPreviewType: "pricing-emphasis",
    tailwindHint: "Use md:grid-cols-3; scale/emphasize the middle card; add badge like \"Most popular\".",
    promptInstruction: "Refactor pricing cards so the recommended plan is visually emphasized without changing pricing logic.",
    exampleStructure: "Three plan cards with the recommended card elevated and secondary plans quieter."
  },
  {
    id: "plan-comparison-table",
    name: "Plan Comparison Table",
    category: "pricing",
    inspirationTags: ["pricing-page", "conversion-section"],
    problemSolved: ["Feature differences are buried in plan cards.", "Users cannot compare plans line by line."],
    bestFor: "Pricing pages with many plan features or limits.",
    avoidWhen: "There are only two or three simple plan differences.",
    requiredElements: ["plans", "feature rows", "availability values"],
    layoutPreviewType: "plan-comparison-table",
    tailwindHint: "Use a responsive table or grid with sticky plan headings on larger screens and stacked rows on mobile.",
    promptInstruction: "Refactor detailed pricing differences into a clear comparison table while keeping plan actions easy to find.",
    exampleStructure: "Plan headers across the top; feature rows below with checks, values, or labels."
  },
  {
    id: "two-tier-pricing-split",
    name: "Two-Tier Pricing Split",
    category: "pricing",
    inspirationTags: ["pricing-page", "conversion-section"],
    problemSolved: ["Two plan options feel underdesigned in a three-card layout.", "The buying choice needs clearer contrast."],
    bestFor: "Products with two primary tiers or monthly/yearly plan framing.",
    avoidWhen: "There are three or more equally important plans.",
    requiredElements: ["two plans", "price or tier labels", "actions"],
    layoutPreviewType: "two-tier-pricing-split",
    tailwindHint: "Use md:grid-cols-2 with one plan slightly emphasized and shared feature notes beneath.",
    promptInstruction: "Refactor pricing into a clean two-tier split with clear contrast between entry and advanced options.",
    exampleStructure: "Two large pricing panels side by side with shared notes below."
  },
  {
    id: "pricing-faq-combo",
    name: "Pricing FAQ Combo",
    category: "pricing",
    inspirationTags: ["pricing-page", "conversion-section"],
    problemSolved: ["Pricing objections are separated from the buying decision.", "Users must scroll to answer plan questions."],
    bestFor: "Pricing sections where plan cards need immediate support from short FAQs.",
    avoidWhen: "The section has no common objections or FAQ content.",
    requiredElements: ["pricing plans", "FAQ items", "actions"],
    layoutPreviewType: "pricing-faq-combo",
    tailwindHint: "Use plan cards followed by or beside compact FAQ rows in a constrained container.",
    promptInstruction: "Combine pricing cards with nearby FAQ support so objections are answered close to the conversion point.",
    exampleStructure: "Top plan cards; lower compact FAQ grid or sidebar FAQ list."
  },
  {
    id: "hero-metric-support-stats",
    name: "Hero Metric + Support Stats",
    category: "stats",
    inspirationTags: ["dashboard-summary", "social-proof"],
    problemSolved: ["All metrics are weighted equally.", "The strongest proof point does not anchor the section."],
    bestFor: "Metric sections with one headline number and several supporting stats.",
    avoidWhen: "No metric is clearly more important or numbers require detailed explanation.",
    requiredElements: ["primary metric", "secondary metrics", "labels"],
    layoutPreviewType: "hero-metric-support-stats",
    tailwindHint: "Use one large stat card with a grid of smaller supporting metric cards beside or below it.",
    promptInstruction: "Refactor the stats row into a hierarchy where the strongest metric becomes dominant and the others support it.",
    exampleStructure: "Large metric panel plus two to four smaller metric cards."
  },
  {
    id: "stats-strip",
    name: "Stats Strip",
    category: "stats",
    inspirationTags: ["dashboard-summary", "social-proof"],
    problemSolved: ["Stats take too much space for simple proof.", "A page needs a quick credibility band."],
    bestFor: "Short metric groups that should sit between larger sections.",
    avoidWhen: "Metrics need detailed context, charts, or definitions.",
    requiredElements: ["metrics", "short labels"],
    layoutPreviewType: "stats-strip",
    tailwindHint: "Use a horizontal grid or flex strip with equal metric cells and compact labels.",
    promptInstruction: "Refactor metrics into a concise strip that scans quickly and does not compete with surrounding sections.",
    exampleStructure: "Three or four evenly spaced metric cells in one band."
  },
  {
    id: "metric-bento",
    name: "Metric Bento",
    category: "stats",
    inspirationTags: ["dashboard-summary", "social-proof"],
    problemSolved: ["Dashboard metrics feel monotonous.", "Related numbers need visual grouping."],
    bestFor: "Dashboard summaries, traction blocks, and metric-heavy product pages.",
    avoidWhen: "Metrics are too few or should remain in a simple table.",
    requiredElements: ["metrics", "labels", "grouping logic"],
    layoutPreviewType: "metric-bento",
    tailwindHint: "Use asymmetric grid spans with one or two large metrics and smaller supporting stat tiles.",
    promptInstruction: "Refactor the metrics into a bento-style hierarchy with clear grouping and one dominant signal.",
    exampleStructure: "Large metric tile, wide trend tile, and smaller secondary metric tiles."
  },
  {
    id: "before-after-metrics",
    name: "Before / After Metrics",
    category: "stats",
    inspirationTags: ["dashboard-summary", "conversion-section"],
    problemSolved: ["Improvement claims lack contrast.", "Users cannot see the delta quickly."],
    bestFor: "Case studies, performance claims, and optimization stories.",
    avoidWhen: "There is no baseline or comparison state.",
    requiredElements: ["before value", "after value", "delta label"],
    layoutPreviewType: "before-after-metrics",
    tailwindHint: "Use paired metric cards with a visual arrow or delta chip between them.",
    promptInstruction: "Refactor metrics into a before/after comparison that highlights the change without inventing new numbers.",
    exampleStructure: "Before card, delta indicator, after card, short explanatory label."
  },
  {
    id: "banner-cta",
    name: "Banner CTA",
    category: "cta",
    inspirationTags: ["conversion-section", "saas-landing"],
    problemSolved: ["The CTA is easy to miss.", "The page needs a compact conversion band."],
    bestFor: "Simple calls to action between content sections or near the end of a page.",
    avoidWhen: "The CTA requires detailed explanation, form fields, or multiple audience paths.",
    requiredElements: ["CTA headline", "action", "supporting copy"],
    layoutPreviewType: "banner-cta",
    tailwindHint: "Use a full-width rounded band with flex-col md:flex-row alignment for copy and action.",
    promptInstruction: "Refactor the CTA into a compact banner with a clear action and enough contrast from surrounding content.",
    exampleStructure: "Left: CTA copy. Right: primary button or action group."
  },
  {
    id: "split-cta",
    name: "Split CTA",
    category: "cta",
    inspirationTags: ["conversion-section", "product-preview"],
    problemSolved: ["CTA copy and supporting proof are mixed together.", "The action lacks context."],
    bestFor: "CTA sections that need a benefit list, preview, or proof beside the action.",
    avoidWhen: "The CTA should be a very short final prompt.",
    requiredElements: ["CTA message", "action", "supporting proof or visual"],
    layoutPreviewType: "split-cta",
    tailwindHint: "Use grid grid-cols-1 md:grid-cols-2 gap-6 items-center with action copy and support panel.",
    promptInstruction: "Refactor the CTA into a split layout with persuasive copy on one side and relevant support content on the other.",
    exampleStructure: "Message and button paired with proof list, preview, or benefit panel."
  },
  {
    id: "card-cta",
    name: "Card CTA",
    category: "cta",
    inspirationTags: ["conversion-section", "lead-capture"],
    problemSolved: ["The CTA needs focus inside a busy page.", "Action content blends into the background."],
    bestFor: "End-of-section CTAs that should feel contained and deliberate.",
    avoidWhen: "The design system avoids framed surfaces or the CTA needs full-width impact.",
    requiredElements: ["CTA headline", "supporting copy", "action"],
    layoutPreviewType: "card-cta",
    tailwindHint: "Use a constrained rounded card with clear padding, centered text, and prominent action.",
    promptInstruction: "Place the CTA inside a focused card treatment with stronger hierarchy and accessible action states.",
    exampleStructure: "Centered CTA card with heading, short copy, and primary button."
  },
  {
    id: "cta-trust-notes",
    name: "CTA Trust Notes",
    category: "cta",
    inspirationTags: ["conversion-section", "social-proof"],
    problemSolved: ["Users may hesitate before clicking.", "Trust details are not close to the action."],
    bestFor: "Trial, signup, download, and booking CTAs with reassurance details.",
    avoidWhen: "Trust notes would be unverified or make the CTA visually cluttered.",
    requiredElements: ["CTA action", "trust notes", "supporting copy"],
    layoutPreviewType: "cta-trust-notes",
    tailwindHint: "Use a CTA row with small trust notes beneath or beside the primary action.",
    promptInstruction: "Add concise trust notes near the CTA action while preserving the original conversion path.",
    exampleStructure: "CTA message, action button, small notes such as setup time, privacy, or support."
  },
  {
    id: "form-benefits-sidebar",
    name: "Form + Benefits Sidebar",
    category: "form",
    inspirationTags: ["lead-capture", "conversion-section"],
    problemSolved: ["The form feels disconnected from why users should submit it.", "Benefits are buried below fields."],
    bestFor: "Lead capture, demo request, and contact forms that need supporting benefits.",
    avoidWhen: "The form is only one or two fields and needs maximum speed.",
    requiredElements: ["form fields", "benefit list", "submit action"],
    layoutPreviewType: "form-benefits-sidebar",
    tailwindHint: "Use grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 with benefits beside the form.",
    promptInstruction: "Refactor the form section so benefits and reassurance sit beside the form without changing field names or submission logic.",
    exampleStructure: "Left benefits/sidebar proof; right form card with fields and submit button."
  },
  {
    id: "two-step-form-layout",
    name: "Two-Step Form Layout",
    category: "form",
    inspirationTags: ["lead-capture", "mobile-onboarding"],
    problemSolved: ["A long form feels intimidating.", "Users need a clearer progression through inputs."],
    bestFor: "Forms with logically separable details such as contact info and project needs.",
    avoidWhen: "Changing the visual grouping could imply new state or validation behavior that does not exist.",
    requiredElements: ["form fields", "two field groups", "submit action"],
    layoutPreviewType: "two-step-form-layout",
    tailwindHint: "Use grouped fieldsets with numbered headers; keep one actual form and preserve existing submit behavior.",
    promptInstruction: "Visually group the existing form into two clear steps without adding new form state or changing submission logic.",
    exampleStructure: "Step 1 contact details, Step 2 request details, final submit area."
  },
  {
    id: "compact-lead-form",
    name: "Compact Lead Form",
    category: "form",
    inspirationTags: ["lead-capture", "conversion-section"],
    problemSolved: ["The form takes more space than the offer requires.", "The conversion path feels slow."],
    bestFor: "Newsletter, waitlist, early access, or simple lead forms.",
    avoidWhen: "The form requires detailed qualification or legal fields.",
    requiredElements: ["one to three fields", "submit action", "short value proposition"],
    layoutPreviewType: "compact-lead-form",
    tailwindHint: "Use flex-col sm:flex-row for the primary fields and action, with tight helper text below.",
    promptInstruction: "Refactor the form into a compact lead capture layout that keeps all existing fields and improves scan speed.",
    exampleStructure: "Short heading, inline field/action row, small reassurance text."
  },
  {
    id: "form-faq-sidebar",
    name: "Form + FAQ Sidebar",
    category: "form",
    inspirationTags: ["lead-capture", "conversion-section"],
    problemSolved: ["Users have questions while filling the form.", "Support content is too far from the form."],
    bestFor: "Demo, quote, onboarding, and application forms with common concerns.",
    avoidWhen: "There are no real FAQ items or the page already has nearby help content.",
    requiredElements: ["form fields", "FAQ items", "submit action"],
    layoutPreviewType: "form-faq-sidebar",
    tailwindHint: "Use responsive two-column layout with compact FAQ rows adjacent to the form.",
    promptInstruction: "Place relevant FAQ content beside the form so users can answer objections without leaving the submission context.",
    exampleStructure: "Form column plus FAQ column with three to five concise questions."
  },
  {
    id: "testimonial-wall",
    name: "Testimonial Wall",
    category: "testimonials",
    inspirationTags: ["social-proof", "conversion-section"],
    problemSolved: ["A single quote does not show breadth.", "Social proof lacks volume."],
    bestFor: "Pages with several short testimonials from different users or segments.",
    avoidWhen: "Only one strong testimonial exists or quotes are too long for compact cards.",
    requiredElements: ["multiple testimonials", "names or sources", "quote text"],
    layoutPreviewType: "testimonial-wall",
    tailwindHint: "Use columns or responsive grid with compact quote cards and consistent source treatment.",
    promptInstruction: "Refactor testimonials into a compact wall that shows breadth while keeping quotes readable.",
    exampleStructure: "Masonry-like or grid quote cards with source labels."
  },
  {
    id: "featured-testimonial",
    name: "Featured Testimonial",
    category: "testimonials",
    inspirationTags: ["social-proof", "conversion-section"],
    problemSolved: ["The strongest quote is visually underplayed.", "Testimonials lack a memorable anchor."],
    bestFor: "Sections with one especially strong quote and supporting proof items.",
    avoidWhen: "All quotes are equal or no testimonial is strong enough to feature.",
    requiredElements: ["featured quote", "source", "supporting proof"],
    layoutPreviewType: "featured-testimonial",
    tailwindHint: "Use a large quote panel with smaller supporting quote or logo cells beside it.",
    promptInstruction: "Make the strongest testimonial the focal point and arrange supporting proof around it.",
    exampleStructure: "Large quote card plus smaller supporting quotes or proof marks."
  },
  {
    id: "logo-cloud-quote",
    name: "Logo Cloud + Quote",
    category: "testimonials",
    inspirationTags: ["social-proof", "saas-landing"],
    problemSolved: ["Logo proof feels impersonal.", "A quote needs broader credibility context."],
    bestFor: "Social proof sections with customer logos and one concise quote.",
    avoidWhen: "Logos are unavailable or cannot be used accurately.",
    requiredElements: ["logos or names", "quote", "source"],
    layoutPreviewType: "logo-cloud-quote",
    tailwindHint: "Use a compact logo grid paired with a highlighted quote card.",
    promptInstruction: "Pair broad logo proof with a single quote so the section has both reach and human detail.",
    exampleStructure: "Logo cloud on one side or top, quote card beside or below."
  },
  {
    id: "review-cards-carousel",
    name: "Review Cards Carousel",
    category: "testimonials",
    inspirationTags: ["social-proof", "mobile-onboarding"],
    problemSolved: ["Many reviews overflow the side panel or mobile viewport.", "Testimonials need swipeable browsing."],
    bestFor: "Review-heavy sections where a horizontal rail is already appropriate.",
    avoidWhen: "No carousel behavior exists and adding interaction would be out of scope.",
    requiredElements: ["review cards", "review source", "scroll or carousel controls"],
    layoutPreviewType: "review-cards-carousel",
    tailwindHint: "Use overflow-x-auto with snap-x snap-mandatory cards and accessible controls if controls already exist.",
    promptInstruction: "Refactor reviews into a compact horizontal card rail while preserving existing review content and controls.",
    exampleStructure: "Scrollable row of review cards with snap alignment and visible card boundaries."
  },
  {
    id: "analytics-overview",
    name: "Analytics Overview",
    category: "dashboard",
    inspirationTags: ["dashboard-summary", "data-summary"],
    problemSolved: ["Dashboard metrics do not show priority.", "Users cannot quickly identify the main signal."],
    bestFor: "Analytics screens with KPIs, charts, and recent performance summaries.",
    avoidWhen: "The page is mostly transactional and does not need a reporting overview.",
    requiredElements: ["primary KPI", "secondary metrics", "chart or trend area"],
    layoutPreviewType: "analytics-overview",
    tailwindHint: "Use a top KPI grid with one wide chart panel and compact supporting metric cards.",
    promptInstruction: "Refactor the dashboard area into an analytics overview with a dominant trend panel and supporting metric tiles.",
    exampleStructure: "Top metric row, wide chart card, side stack of compact status cards."
  },
  {
    id: "metric-trend-grid",
    name: "Metric Trend Grid",
    category: "dashboard",
    inspirationTags: ["dashboard-summary", "data-summary"],
    problemSolved: ["Metric cards are static and lack movement context.", "Users cannot compare current values with trends."],
    bestFor: "Dashboard KPI groups where trend direction and change labels matter.",
    avoidWhen: "Values are not comparable or trends are not available.",
    requiredElements: ["metrics", "trend labels", "supporting context"],
    layoutPreviewType: "metric-trend-grid",
    tailwindHint: "Use a responsive metric grid where each card has a value, delta chip, and small trend preview.",
    promptInstruction: "Refactor metric cards into a trend-aware grid that makes changes and relative priority scannable.",
    exampleStructure: "Four metric cards with values, labels, deltas, and compact sparkline areas."
  },
  {
    id: "activity-feed-sidebar",
    name: "Activity Feed Sidebar",
    category: "dashboard",
    inspirationTags: ["dashboard-summary", "app-shell"],
    problemSolved: ["Recent activity is mixed into the main workspace.", "Operational screens lack context about what changed."],
    bestFor: "Admin, CRM, product, or project dashboards with recent events.",
    avoidWhen: "There is no meaningful activity stream or the screen is too narrow for a sidebar.",
    requiredElements: ["main content", "activity events", "timestamps or labels"],
    layoutPreviewType: "activity-feed-sidebar",
    tailwindHint: "Use grid-cols-[1fr_320px] on desktop and stack the activity feed below on mobile.",
    promptInstruction: "Move recent activity into a clear sidebar while keeping the main task area dominant.",
    exampleStructure: "Main dashboard cards on the left; vertical activity feed on the right."
  },
  {
    id: "table-summary-rail",
    name: "Table + Summary Rail",
    category: "dashboard",
    inspirationTags: ["dashboard-summary", "data-table"],
    problemSolved: ["Tables lack immediate summary context.", "Key totals are separated from the detailed rows."],
    bestFor: "Admin tables, customer lists, order lists, and operational dashboards.",
    avoidWhen: "The table needs all available width and summary stats are already visible.",
    requiredElements: ["table rows", "summary metrics", "filters or actions"],
    layoutPreviewType: "table-summary-rail",
    tailwindHint: "Use a wide table area with a narrow summary rail for totals, status, and primary actions.",
    promptInstruction: "Refactor the table area so summary metrics and actions sit in a right rail without changing table data.",
    exampleStructure: "Table card plus summary rail with totals, status breakdown, and action button."
  },
  {
    id: "kanban-board",
    name: "Kanban Board",
    category: "dashboard",
    inspirationTags: ["app-shell", "workflow"],
    problemSolved: ["Workflow items appear as unrelated lists.", "Status progression is hard to scan."],
    bestFor: "Pipeline, task, roadmap, support, or editorial workflow screens.",
    avoidWhen: "Items are not status-based or drag interactions would be implied incorrectly.",
    requiredElements: ["status columns", "cards", "item labels"],
    layoutPreviewType: "kanban-board",
    tailwindHint: "Use horizontal status columns with fixed-width cards and mobile overflow-x-auto if needed.",
    promptInstruction: "Refactor workflow items into a kanban-style board using existing statuses and cards only.",
    exampleStructure: "Three or four status columns, each with stacked task cards."
  },
  {
    id: "settings-detail-pane",
    name: "Settings Detail Pane",
    category: "dashboard",
    inspirationTags: ["settings", "app-shell"],
    problemSolved: ["Settings controls are hard to navigate.", "Users cannot tell which settings group is active."],
    bestFor: "Account, billing, profile, notification, or workspace settings screens.",
    avoidWhen: "The screen has only one short settings group.",
    requiredElements: ["settings navigation", "active settings group", "form controls"],
    layoutPreviewType: "settings-detail-pane",
    tailwindHint: "Use a left settings nav with a right detail panel; stack nav above details on mobile.",
    promptInstruction: "Refactor settings into a navigation pane plus focused detail panel while preserving all controls.",
    exampleStructure: "Left category list; right settings form with grouped controls."
  },
  {
    id: "split-auth-proof",
    name: "Split Auth + Proof",
    category: "auth",
    inspirationTags: ["auth", "lead-capture", "social-proof"],
    problemSolved: ["Auth forms feel untrustworthy or isolated.", "Users do not see why they should sign in."],
    bestFor: "Signup, login, waitlist, and invite screens with proof or benefit content.",
    avoidWhen: "Authentication must stay extremely minimal or embedded in a small modal.",
    requiredElements: ["auth form", "benefits or proof", "primary auth action"],
    layoutPreviewType: "split-auth-proof",
    tailwindHint: "Use a two-column auth layout with proof/benefits on one side and the form card on the other.",
    promptInstruction: "Refactor the auth screen into a split layout that pairs the form with concise proof or benefits.",
    exampleStructure: "Proof panel with benefits; auth card with fields and sign-in actions."
  },
  {
    id: "magic-link-panel",
    name: "Magic Link Panel",
    category: "auth",
    inspirationTags: ["auth", "lead-capture"],
    problemSolved: ["Email-only auth appears too plain.", "Users need clear confirmation and next-step context."],
    bestFor: "Passwordless email login, verification-code, and magic-link flows.",
    avoidWhen: "The auth flow requires multiple providers or long profile setup.",
    requiredElements: ["email field", "submit action", "helper or confirmation text"],
    layoutPreviewType: "magic-link-panel",
    tailwindHint: "Use a focused centered panel with email field, action, and compact helper text below.",
    promptInstruction: "Refactor email auth into a focused magic-link panel with clear next-step messaging.",
    exampleStructure: "Centered auth card, email input, submit button, verification helper text."
  },
  {
    id: "onboarding-checklist-form",
    name: "Onboarding Checklist Form",
    category: "auth",
    inspirationTags: ["auth", "onboarding", "lead-capture"],
    problemSolved: ["Onboarding forms do not show progress.", "Users cannot see what remains before completion."],
    bestFor: "Signup completion, setup wizards, and profile onboarding screens.",
    avoidWhen: "There is only one input or no real checklist/progress information.",
    requiredElements: ["form fields", "checklist", "progress labels"],
    layoutPreviewType: "onboarding-checklist-form",
    tailwindHint: "Use a form column plus compact checklist/progress panel with existing steps.",
    promptInstruction: "Refactor onboarding into a checklist-supported form that makes progress and remaining steps visible.",
    exampleStructure: "Setup checklist on the side; form fields and submit action in the main panel."
  },
  {
    id: "profile-settings-form",
    name: "Profile Settings Form",
    category: "auth",
    inspirationTags: ["auth", "settings"],
    problemSolved: ["Profile fields are ungrouped.", "Users cannot distinguish identity, preferences, and security controls."],
    bestFor: "Profile, account, and personal settings forms.",
    avoidWhen: "The form is only a single edit field.",
    requiredElements: ["profile fields", "group labels", "save action"],
    layoutPreviewType: "profile-settings-form",
    tailwindHint: "Use grouped form sections with labels and a persistent save/action area.",
    promptInstruction: "Refactor profile settings into clear field groups with a stable save action.",
    exampleStructure: "Identity group, preferences group, security notes, save footer."
  },
  {
    id: "command-center-nav",
    name: "Command Center Nav",
    category: "navigation",
    inspirationTags: ["navigation", "app-shell"],
    problemSolved: ["Navigation actions are scattered.", "Users cannot quickly access search, create, and key destinations."],
    bestFor: "Product dashboards, admin tools, and extensions with frequent actions.",
    avoidWhen: "The page has only a few static links and no command/action model.",
    requiredElements: ["navigation links", "search or command input", "primary action"],
    layoutPreviewType: "command-center-nav",
    tailwindHint: "Use a top command bar with search, nav links, and one primary action in a dense layout.",
    promptInstruction: "Refactor navigation into a command-center bar that groups search, destinations, and primary action.",
    exampleStructure: "Logo/link cluster, search field, nav links, primary action."
  },
  {
    id: "sidebar-app-shell",
    name: "Sidebar App Shell",
    category: "navigation",
    inspirationTags: ["navigation", "app-shell"],
    problemSolved: ["App navigation competes with page content.", "Users need stable access to sections across screens."],
    bestFor: "Dashboards, workspaces, and admin tools with multiple persistent sections.",
    avoidWhen: "The page is a marketing landing page or content site.",
    requiredElements: ["sidebar links", "main content", "active state"],
    layoutPreviewType: "sidebar-app-shell",
    tailwindHint: "Use grid-cols-[240px_1fr] on desktop with a collapsible or stacked nav on mobile.",
    promptInstruction: "Refactor the screen into a sidebar app shell with clear active navigation and main content.",
    exampleStructure: "Left nav rail; top page header; main work area."
  },
  {
    id: "mega-menu-topbar",
    name: "Mega Menu Topbar",
    category: "navigation",
    inspirationTags: ["navigation", "saas-landing"],
    problemSolved: ["Many navigation links are flattened into one row.", "Users cannot scan product areas or resource groups."],
    bestFor: "Marketing sites with product, resource, and company navigation groups.",
    avoidWhen: "There are too few links to justify grouped navigation.",
    requiredElements: ["top navigation", "link groups", "primary action"],
    layoutPreviewType: "mega-menu-topbar",
    tailwindHint: "Use top nav with grouped dropdown/mega-panel structure and concise labels.",
    promptInstruction: "Refactor crowded navigation into grouped topbar navigation with clearer link hierarchy.",
    exampleStructure: "Topbar with grouped product/resources links and primary CTA."
  },
  {
    id: "footer-link-hub",
    name: "Footer Link Hub",
    category: "footer",
    inspirationTags: ["navigation", "content"],
    problemSolved: ["Footer links are unorganized.", "Users cannot find product, support, and legal paths quickly."],
    bestFor: "Product websites with multiple footer link groups and final conversion/support content.",
    avoidWhen: "The site only needs a minimal copyright footer.",
    requiredElements: ["footer links", "link groups", "brand or CTA area"],
    layoutPreviewType: "footer-link-hub",
    tailwindHint: "Use a wide footer grid with brand/CTA area and grouped link columns.",
    promptInstruction: "Refactor the footer into a structured link hub with clear groups and a concise brand/support area.",
    exampleStructure: "Brand block, product links, resources links, support/legal links."
  },
  {
    id: "product-detail-split",
    name: "Product Detail Split",
    category: "ecommerce",
    inspirationTags: ["product-preview", "conversion-section"],
    problemSolved: ["Product details and purchase action compete.", "Users cannot inspect product value before acting."],
    bestFor: "Product pages, plan detail pages, and purchasable asset pages.",
    avoidWhen: "The page has no product visual or the item is purely informational.",
    requiredElements: ["product visual", "product details", "purchase or primary action"],
    layoutPreviewType: "product-detail-split",
    tailwindHint: "Use a product media column and sticky details/action column on desktop.",
    promptInstruction: "Refactor product content into a split detail layout with media, summary, and action hierarchy.",
    exampleStructure: "Left product preview; right details, price/value, and primary action."
  },
  {
    id: "product-card-grid",
    name: "Product Card Grid",
    category: "ecommerce",
    inspirationTags: ["product-preview", "cards"],
    problemSolved: ["Product cards are hard to compare.", "Listings lack consistent visual and action hierarchy."],
    bestFor: "Product catalogs, template galleries, marketplace cards, and pricing add-ons.",
    avoidWhen: "Items require detailed row-level comparison instead of browsing.",
    requiredElements: ["product cards", "titles", "price or action"],
    layoutPreviewType: "product-card-grid",
    tailwindHint: "Use a responsive card grid with consistent media, title, meta, and action zones.",
    promptInstruction: "Refactor listing items into a product card grid with consistent browse and action hierarchy.",
    exampleStructure: "Grid of cards with media area, title/meta, price/value, and action."
  },
  {
    id: "checkout-summary-split",
    name: "Checkout Summary Split",
    category: "ecommerce",
    inspirationTags: ["conversion-section", "form"],
    problemSolved: ["Checkout actions and order summary are separated.", "Users cannot verify details before submitting."],
    bestFor: "Checkout, upgrade, booking, and payment confirmation layouts.",
    avoidWhen: "There is no purchase summary or no form/action step.",
    requiredElements: ["checkout form", "order summary", "submit action"],
    layoutPreviewType: "checkout-summary-split",
    tailwindHint: "Use form/content column plus summary column; stack summary above or below on mobile.",
    promptInstruction: "Refactor checkout into a form and summary split that keeps verification close to the final action.",
    exampleStructure: "Left checkout fields; right order summary and total/action."
  },
  {
    id: "comparison-spec-table",
    name: "Comparison Spec Table",
    category: "comparison",
    inspirationTags: ["comparison", "pricing-page"],
    problemSolved: ["Specs are buried in cards.", "Users cannot compare detailed attributes line by line."],
    bestFor: "Plan, product, feature, or package comparisons with many attributes.",
    avoidWhen: "There are only a few high-level differences better served by cards.",
    requiredElements: ["comparison items", "spec rows", "values"],
    layoutPreviewType: "comparison-spec-table",
    tailwindHint: "Use a responsive comparison table with sticky item headers where appropriate.",
    promptInstruction: "Refactor specs into a comparison table that preserves all values and improves scanability.",
    exampleStructure: "Rows of specs with two or more compared columns."
  },
  {
    id: "faq-sidebar",
    name: "FAQ Sidebar",
    category: "faq",
    inspirationTags: ["content", "conversion-section"],
    problemSolved: ["FAQ items feel like a long undifferentiated list.", "Users cannot jump between question groups."],
    bestFor: "FAQ sections with categories, objections, or support topics.",
    avoidWhen: "There are only two or three questions.",
    requiredElements: ["FAQ items", "topic labels", "question answers"],
    layoutPreviewType: "faq-sidebar",
    tailwindHint: "Use a topic/sidebar column with FAQ accordions or rows in the main column.",
    promptInstruction: "Refactor FAQs into a sidebar-supported layout with grouped questions and concise answers.",
    exampleStructure: "Left topic list; right FAQ rows grouped by selected/current topic."
  },
  {
    id: "editorial-feature-stack",
    name: "Editorial Feature Stack",
    category: "content",
    inspirationTags: ["content", "product-preview"],
    problemSolved: ["Content-heavy sections feel like generic cards.", "Readers lack a strong narrative path."],
    bestFor: "Blog, docs, launch, and product narrative sections with substantial copy.",
    avoidWhen: "The section needs fast comparison rather than reading flow.",
    requiredElements: ["headline", "body sections", "supporting media or notes"],
    layoutPreviewType: "editorial-feature-stack",
    tailwindHint: "Use a narrow editorial column with supporting callouts or media cards between content blocks.",
    promptInstruction: "Refactor content into an editorial stack with a clear reading path and supporting callouts.",
    exampleStructure: "Lead text, feature blocks, callout card, supporting detail rows."
  },
  {
    id: "changelog-timeline",
    name: "Changelog Timeline",
    category: "content",
    inspirationTags: ["content", "timeline"],
    problemSolved: ["Updates are listed without chronology.", "Users cannot scan release or progress history."],
    bestFor: "Changelogs, roadmap updates, release notes, and milestone sections.",
    avoidWhen: "The content is not chronological or has only one update.",
    requiredElements: ["dated items", "update labels", "descriptions"],
    layoutPreviewType: "changelog-timeline",
    tailwindHint: "Use a vertical timeline with date labels, markers, and update cards.",
    promptInstruction: "Refactor update content into a timeline that makes chronology and milestones clear.",
    exampleStructure: "Date rail with stacked update cards and marker dots."
  },
  {
    id: "resource-card-grid",
    name: "Resource Card Grid",
    category: "content",
    inspirationTags: ["content", "cards"],
    problemSolved: ["Resources are hard to browse.", "Links lack consistent metadata and visual priority."],
    bestFor: "Docs, blog, template, guide, or asset listing sections.",
    avoidWhen: "The content is sequential and should be read as one article.",
    requiredElements: ["resource cards", "titles", "metadata or descriptions"],
    layoutPreviewType: "resource-card-grid",
    tailwindHint: "Use a responsive grid with category/meta labels and clear card actions.",
    promptInstruction: "Refactor resources into a browsable card grid with consistent metadata and hierarchy.",
    exampleStructure: "Card grid with label, title, summary, and link/action area."
  },
  {
    id: "before-after-hero",
    name: "Before / After Hero",
    category: "hero",
    inspirationTags: ["saas-landing", "conversion-section"],
    problemSolved: ["The hero does not show the transformation.", "Users cannot see the practical improvement quickly."],
    bestFor: "Optimization, redesign, AI, automation, and workflow improvement products.",
    avoidWhen: "There is no honest before/after state to compare.",
    requiredElements: ["headline", "before state", "after state", "primary action"],
    layoutPreviewType: "before-after-hero",
    tailwindHint: "Use hero copy paired with before/after panels or a split comparison preview.",
    promptInstruction: "Refactor the hero to show before and after states as the main proof of transformation.",
    exampleStructure: "Hero copy plus two comparison panels labelled before and after."
  },
  {
    id: "demo-steps-hero",
    name: "Demo Steps Hero",
    category: "hero",
    inspirationTags: ["saas-landing", "workflow"],
    problemSolved: ["The hero promises value but not process.", "Users cannot tell how the product works."],
    bestFor: "Tools and AI workflows where a simple three-step process sells the product.",
    avoidWhen: "The hero should stay purely aspirational or the workflow is too complex.",
    requiredElements: ["headline", "step labels", "primary action"],
    layoutPreviewType: "demo-steps-hero",
    tailwindHint: "Use a hero copy block with a compact three-step demo strip or process preview.",
    promptInstruction: "Refactor the hero to include a concise demo-step preview that explains the workflow.",
    exampleStructure: "Hero message, CTA, and three connected demo steps."
  },
  {
    id: "feature-tabs",
    name: "Feature Tabs",
    category: "features",
    inspirationTags: ["saas-landing", "product-preview"],
    problemSolved: ["Too many features compete at once.", "Users need to explore related feature groups."],
    bestFor: "Feature sections with categories, modes, or use cases.",
    avoidWhen: "Tabs would imply unavailable interaction or hide critical content.",
    requiredElements: ["feature groups", "tab labels", "active feature content"],
    layoutPreviewType: "feature-tabs",
    tailwindHint: "Use segmented tabs above one active content panel; preserve existing tab behavior if present.",
    promptInstruction: "Refactor related features into a tabbed layout using existing groups or visible categories.",
    exampleStructure: "Tab row with one active feature preview and supporting copy."
  },
  {
    id: "integration-logo-grid",
    name: "Integration Logo Grid",
    category: "features",
    inspirationTags: ["saas-landing", "social-proof"],
    problemSolved: ["Integration lists look noisy.", "Users cannot scan supported tools quickly."],
    bestFor: "Integration, partner, tool, and platform compatibility sections.",
    avoidWhen: "There are no recognizable integration names or logos.",
    requiredElements: ["integration names or logos", "category labels", "supporting copy"],
    layoutPreviewType: "integration-logo-grid",
    tailwindHint: "Use a compact logo/name grid with optional category grouping and one highlighted integration.",
    promptInstruction: "Refactor integrations into a structured logo grid that improves scanning and trust.",
    exampleStructure: "Heading, category chips, and grid of integration cells."
  },
  {
    id: "comparison-matrix",
    name: "Comparison Matrix",
    category: "comparison",
    inspirationTags: ["comparison", "conversion-section"],
    problemSolved: ["Users cannot compare alternatives clearly.", "Pros and cons are scattered across cards."],
    bestFor: "Feature comparisons, product alternatives, and plan differences.",
    avoidWhen: "The section is persuasive storytelling rather than comparison.",
    requiredElements: ["comparison criteria", "options", "availability or rating values"],
    layoutPreviewType: "comparison-matrix",
    tailwindHint: "Use a matrix grid with criteria rows and compared option columns; collapse to stacked rows on mobile.",
    promptInstruction: "Refactor comparison content into a matrix that keeps criteria aligned across options.",
    exampleStructure: "Criteria column plus option columns with checks, values, or labels."
  },
  {
    id: "quote-wall",
    name: "Quote Wall",
    category: "testimonials",
    inspirationTags: ["social-proof", "content"],
    problemSolved: ["Quotes lack visual rhythm.", "Social proof does not feel broad or human."],
    bestFor: "Multiple short quotes, community feedback, and customer reactions.",
    avoidWhen: "Quotes are long case studies or require detailed attribution.",
    requiredElements: ["quotes", "sources", "short attribution"],
    layoutPreviewType: "quote-wall",
    tailwindHint: "Use a varied responsive quote grid with compact attribution and one highlighted quote.",
    promptInstruction: "Refactor quotes into a wall that balances breadth with one or two stronger highlighted quotes.",
    exampleStructure: "Highlighted quote plus compact supporting quote cards."
  },
  {
    id: "case-study-split",
    name: "Case Study Split",
    category: "testimonials",
    inspirationTags: ["social-proof", "conversion-section"],
    problemSolved: ["Case study proof is buried in prose.", "Outcome, quote, and context are not connected."],
    bestFor: "Customer story, result, and case study sections.",
    avoidWhen: "There is no concrete outcome or source attribution.",
    requiredElements: ["customer context", "quote or outcome", "result metric"],
    layoutPreviewType: "case-study-split",
    tailwindHint: "Use a split case-study layout with story/context on one side and outcome proof on the other.",
    promptInstruction: "Refactor case study content into a split layout connecting context, quote, and measurable outcome.",
    exampleStructure: "Left story and quote; right result metrics or proof panel."
  },
  {
    id: "pricing-toggle",
    name: "Pricing Toggle",
    category: "pricing",
    inspirationTags: ["pricing-page", "conversion-section"],
    problemSolved: ["Pricing period options are unclear.", "Users cannot compare monthly and annual framing."],
    bestFor: "Pricing pages with monthly/annual, individual/team, or usage modes.",
    avoidWhen: "There is only one pricing mode and no toggle behavior exists.",
    requiredElements: ["pricing plans", "billing toggle", "plan actions"],
    layoutPreviewType: "pricing-toggle",
    tailwindHint: "Use a segmented billing toggle above pricing cards and preserve existing pricing state behavior.",
    promptInstruction: "Refactor pricing so the billing or mode toggle is prominent and connected to the plan cards.",
    exampleStructure: "Billing toggle, plan cards, small savings or mode note."
  },
  {
    id: "demo-panel-cta",
    name: "Demo Panel CTA",
    category: "cta",
    inspirationTags: ["conversion-section", "product-preview"],
    problemSolved: ["CTA lacks tangible product context.", "Users need to see what happens after clicking."],
    bestFor: "Trial, demo, preview, and product-led CTA sections.",
    avoidWhen: "There is no product preview or the CTA should stay minimal.",
    requiredElements: ["CTA copy", "demo preview", "primary action"],
    layoutPreviewType: "demo-panel-cta",
    tailwindHint: "Use a CTA copy area beside a product/demo panel with clear action hierarchy.",
    promptInstruction: "Refactor the CTA into a demo-backed layout that pairs the action with a concrete preview.",
    exampleStructure: "CTA message and button next to a product/demo preview panel."
  },
  {
    id: "stats-story-band",
    name: "Stats Story Band",
    category: "stats",
    inspirationTags: ["dashboard-summary", "social-proof"],
    problemSolved: ["Stats appear without narrative.", "Users cannot connect metrics to the broader result."],
    bestFor: "Traction, impact, customer result, or performance story sections.",
    avoidWhen: "Metrics are purely operational and should stay in a dashboard table.",
    requiredElements: ["metrics", "story copy", "supporting context"],
    layoutPreviewType: "stats-story-band",
    tailwindHint: "Use a narrative text block with a horizontal metric band or grouped stat cards.",
    promptInstruction: "Refactor metrics into a story band that connects numbers with a concise explanation.",
    exampleStructure: "Short story copy plus three metric cells in a strong horizontal band."
  }
];

export const layoutPatterns: LayoutPattern[] = rawLayoutPatterns.map((pattern) => ({
  ...pattern,
  keywords: pattern.keywords ?? inferPatternKeywords(pattern),
  solvesProblems: pattern.solvesProblems ?? inferPatternProblems(pattern),
  designIntents: pattern.designIntents ?? inferPatternIntents(pattern)
}));

export const layoutPatternById = new Map(
  layoutPatterns.map((pattern) => [pattern.id, pattern])
);

function inferPatternKeywords(pattern: RawLayoutPattern): string[] {
  const text = [
    pattern.id,
    pattern.name,
    pattern.category,
    ...pattern.inspirationTags,
    pattern.bestFor,
    pattern.exampleStructure
  ]
    .join(" ")
    .toLowerCase();
  const keywords = new Set<string>([
    pattern.category,
    ...pattern.id.split("-"),
    ...pattern.inspirationTags
  ]);

  if (/hero/.test(text)) keywords.add("hero");
  if (/product|preview/.test(text)) keywords.add("product-preview");
  if (/trust|proof|logo|quote|testimonial/.test(text)) keywords.add("social-proof");
  if (/card|cards|bento/.test(text)) keywords.add("cards");
  if (/grid/.test(text)) keywords.add("grid");
  if (/pricing|plan/.test(text)) keywords.add("pricing");
  if (/metric|stats|kpi/.test(text)) keywords.add("stats");
  if (/form|lead/.test(text)) keywords.add("form");
  if (/workflow|step|process|timeline/.test(text)) keywords.add("workflow");
  if (/cta|action/.test(text)) keywords.add("cta");
  if (/center|featured|highlight/.test(text)) keywords.add("hierarchy");
  if (/dashboard|analytics|table|kanban|settings|admin/.test(text)) keywords.add("dashboard");
  if (/auth|login|sign|email|verification|magic/.test(text)) keywords.add("auth");
  if (/navigation|nav|sidebar|menu|footer/.test(text)) keywords.add("navigation");
  if (/product|checkout|cart|order|purchase|catalog/.test(text)) keywords.add("ecommerce");
  if (/content|editorial|resource|docs|blog|changelog/.test(text)) keywords.add("content");
  if (/faq|question|answer/.test(text)) keywords.add("faq");
  if (/comparison|compare|matrix|spec|versus/.test(text)) keywords.add("comparison");

  return [...keywords];
}

function inferPatternProblems(pattern: RawLayoutPattern): UIProblem[] {
  const text = [pattern.id, pattern.name, pattern.category, ...pattern.problemSolved]
    .join(" ")
    .toLowerCase();
  const problems = new Set<UIProblem>();

  if (/flat|generic|equal|repetitive|uniform/.test(text)) problems.add("flat_layout");
  if (/hierarchy|focal|important|stand out|underplayed/.test(text)) problems.add("weak_hierarchy");
  if (/repeated|repetitive|uniform/.test(text)) problems.add("too_repetitive");
  if (/equal/.test(text) || pattern.id.includes("bento")) problems.add("cards_too_equal");
  if (/trust|proof|credibility/.test(text)) problems.add("weak_trust_signals");
  if (/dense|paragraph|text/.test(text)) problems.add("too_text_heavy");
  if (/scattered|rhythm|sequence|progression/.test(text)) problems.add("no_visual_rhythm");
  if (/cta|action/.test(text)) problems.add("cta_not_clear");

  return problems.size ? [...problems] : ["unknown"];
}

function inferPatternIntents(pattern: RawLayoutPattern): DesignIntent[] {
  const text = [pattern.id, pattern.name, pattern.category, pattern.bestFor]
    .join(" ")
    .toLowerCase();
  const intents = new Set<DesignIntent>();

  if (/hero|cta|conversion|landing|pricing/.test(text)) intents.add("conversion");
  if (/feature|workflow|problem|solution|explain/.test(text)) intents.add("explanation");
  if (/comparison|compare|pricing|plan/.test(text)) intents.add("comparison");
  if (/testimonial|trust|proof|logo|quote/.test(text)) intents.add("social_proof");
  if (/stats|metric|kpi/.test(text)) intents.add("data_summary");
  if (/form|lead/.test(text)) intents.add("lead_capture");
  if (/product|preview/.test(text)) intents.add("product_showcase");
  if (/workflow|step|onboarding/.test(text)) intents.add("onboarding");
  if (/nav|navigation|sidebar|menu|footer/.test(text)) intents.add("navigation");
  if (/trust|proof|credibility|auth|checkout/.test(text)) intents.add("trust_building");

  return intents.size ? [...intents] : ["unknown"];
}
