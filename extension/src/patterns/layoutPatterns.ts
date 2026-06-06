import type { DesignIntent, UIProblem } from "../shared/types";

export type PatternCategory =
  | "hero"
  | "features"
  | "pricing"
  | "stats"
  | "cta"
  | "form"
  | "testimonials"
  | "dashboard";

export type LayoutPatternId =
  | "split-hero"
  | "centered-hero"
  | "hero-product-preview"
  | "hero-trust-bar"
  | "hero-feature-chips"
  | "hero-social-proof-strip"
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
  | "review-cards-carousel";

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

  return intents.size ? [...intents] : ["unknown"];
}
