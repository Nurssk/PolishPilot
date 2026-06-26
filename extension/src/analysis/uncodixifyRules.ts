// Uncodixify rule database.
//
// These rules encode the "Uncodixify" design-quality framework: a catalog of
// generic AI/Codex UI patterns that make an interface feel auto-generated
// instead of human-designed. Each rule describes the Codex pattern, why it
// reads as AI, how to detect it (locally and/or visually), and what to do
// instead. The local detector and the Gemini merge layer both reference these
// rules by `id`.

export type UncodixifyCategory =
  | "radius"
  | "buttons"
  | "cards"
  | "typography"
  | "spacing"
  | "color"
  | "shadow"
  | "motion"
  | "layout"
  | "navigation"
  | "badges"
  | "iconography"
  | "accessibility"
  | "forms"
  | "charts"
  | "panels"
  | "copywriting";

export type UncodixifySeverity = "low" | "medium" | "high";

export type UncodixifyRule = {
  id: string;
  category: UncodixifyCategory;
  title: string;
  codexPattern: string;
  whyItFeelsAI: string;
  detectSignals: string[];
  recommendation: string;
  betterDirection: string;
  severity: UncodixifySeverity;
};

export const uncodixifyRules: UncodixifyRule[] = [
  {
    id: "oversized-radius",
    category: "radius",
    title: "Oversized rounded corners",
    codexPattern: "Cards, buttons, and panels use 20–32px radius everywhere.",
    whyItFeelsAI:
      "AI-generated UI often uses large radii to fake a premium look instead of creating hierarchy.",
    detectSignals: ["border-radius >= 20px", "rounded-2xl", "rounded-3xl", "pill cards"],
    recommendation:
      "Reduce most radii to 8–12px. Use larger radius only for intentionally large containers.",
    betterDirection: "Use 8–10px for buttons and 8–12px for cards.",
    severity: "medium"
  },
  {
    id: "pill-overload",
    category: "buttons",
    title: "Pill button and chip overload",
    codexPattern: "Most buttons and chips are fully rounded pills (border-radius 999px).",
    whyItFeelsAI:
      "Pill-everything is the path of least resistance and signals a template rather than a deliberate button system.",
    detectSignals: ["border-radius >= 999px", "rounded-full", "pill chips", "tag pills"],
    recommendation:
      "Use 8–10px radius for buttons. Reserve pills for a small number of genuine tag/filter chips.",
    betterDirection: "Solid or bordered buttons with consistent 8–10px radius, not pills.",
    severity: "medium"
  },
  {
    id: "gradient-overuse",
    category: "color",
    title: "Unnecessary gradients",
    codexPattern: "Backgrounds, buttons, and text use soft corporate gradients to fake taste.",
    whyItFeelsAI:
      "Decorative gradients are a default AI move used to look premium without earning hierarchy.",
    detectSignals: [
      "linear-gradient backgrounds",
      "radial-gradient backgrounds",
      "bg-gradient-to-*",
      "gradient text",
      "gradient brand marks"
    ],
    recommendation:
      "Replace decorative gradients with solid surfaces. Keep contrast and hierarchy doing the work.",
    betterDirection: "Flat, calm surfaces. Gradients only when they carry real meaning.",
    severity: "medium"
  },
  {
    id: "glow-heavy-ui",
    category: "shadow",
    title: "Glow-heavy UI",
    codexPattern: "Cards and buttons use colored glow shadows instead of hierarchy.",
    whyItFeelsAI:
      "Colored glows simulate depth and 'energy' but are decorative filler that weakens real structure.",
    detectSignals: [
      "colored box-shadow",
      "shadow with saturated rgba",
      "neon glow",
      "drop-shadow with hue"
    ],
    recommendation:
      "Remove glows. Use subtle neutral shadows (max 0 2px 8px rgba(0,0,0,0.1)) and spacing for hierarchy.",
    betterDirection: "Replace glow with simple borders, spacing, and typography hierarchy.",
    severity: "medium"
  },
  {
    id: "glassmorphism-default",
    category: "panels",
    title: "Glassmorphism as the default",
    codexPattern: "Floating frosted-glass panels with backdrop blur are the default visual language.",
    whyItFeelsAI:
      "Frosted glass everywhere is a generic AI aesthetic that hides weak layout behind blur.",
    detectSignals: [
      "backdrop-filter: blur",
      "backdrop-blur",
      "translucent panel backgrounds",
      "frosted glass cards"
    ],
    recommendation:
      "Use solid panel backgrounds with subtle borders. Drop the blur unless there is a real overlay reason.",
    betterDirection: "Solid surfaces with 1px borders, no glass effect.",
    severity: "medium"
  },
  {
    id: "dramatic-shadows",
    category: "shadow",
    title: "Excessive / dramatic shadows",
    codexPattern: "Large dramatic drop shadows (e.g. 0 24px 60px rgba(0,0,0,0.35)) on everything.",
    whyItFeelsAI:
      "Heavy floating shadows fake elevation that the layout did not earn.",
    detectSignals: ["box-shadow blur > 16px", "large shadow offsets", "floating card effect"],
    recommendation:
      "Cap shadows at a subtle 0 2px 8px rgba(0,0,0,0.1). Avoid floating-everything elevation.",
    betterDirection: "Subtle, consistent shadows; let borders and spacing define edges.",
    severity: "medium"
  },
  {
    id: "decorative-eyebrows",
    category: "typography",
    title: "Decorative eyebrow labels",
    codexPattern: "Small <small>/eyebrow labels above headings ('TEAM COMMAND', 'MARCH SNAPSHOT').",
    whyItFeelsAI:
      "Eyebrow labels are decorative scaffolding AI adds to look structured without adding meaning.",
    detectSignals: ["small uppercase label above heading", "eyebrow class", "overline label"],
    recommendation:
      "Remove eyebrow labels. Lead with a clear heading and let hierarchy come from size and weight.",
    betterDirection: "Just h1/h2 with proper hierarchy, no decorative eyebrow.",
    severity: "low"
  },
  {
    id: "uppercase-label-overuse",
    category: "typography",
    title: "Uppercase label overuse",
    codexPattern: "Many muted labels use uppercase + letter-spacing.",
    whyItFeelsAI:
      "Uppercase + tracking is a template tic used to make ordinary labels look designed.",
    detectSignals: ["text-transform: uppercase", "letter-spacing on labels", "ALL CAPS micro labels"],
    recommendation:
      "Use normal sentence-case labels. Reserve uppercase for rare, intentional emphasis.",
    betterDirection: "Readable sentence-case labels with clear hierarchy.",
    severity: "low"
  },
  {
    id: "fake-premium-copy",
    category: "copywriting",
    title: "Fake premium / generic SaaS copy",
    codexPattern: "Decorative headers like 'Operational clarity without the clutter'.",
    whyItFeelsAI:
      "Generic startup copy is filler that AI generates to sound premium without saying anything.",
    detectSignals: [
      "decorative page-header copy",
      "buzzwords (seamless, effortless, powerful, clarity)",
      "mini-notes explaining the UI"
    ],
    recommendation:
      "Cut decorative copy. Use plain, specific labels that describe the actual content.",
    betterDirection: "Honest, functional copy from the product voice.",
    severity: "low"
  },
  {
    id: "formulaic-ai-copy",
    category: "copywriting",
    title: "Formulaic AI copy patterns",
    codexPattern:
      "Visible UI copy uses throat-clearing openers, rhetorical setup, binary contrast, or generic business phrasing.",
    whyItFeelsAI:
      "The copy announces insight instead of saying the specific product value, so the block reads like generated marketing prose.",
    detectSignals: [
      "throat-clearing phrases",
      "not X but Y contrast",
      "rhetorical setup",
      "generic business phrasing"
    ],
    recommendation:
      "Replace formulaic phrasing with direct, product-specific copy. State the value without setup, fake drama, or meta-commentary.",
    betterDirection: "Plain product copy: specific noun, specific action, concrete outcome.",
    severity: "medium"
  },
  {
    id: "ai-slop-phrase-tells",
    category: "copywriting",
    title: "AI-slop phrase tells",
    codexPattern:
      "Visible copy uses common generated phrases, generic sentence openers, or a cluster of high-probability AI words.",
    whyItFeelsAI:
      "These phrases are statistically common in generated writing and make product copy feel interchangeable instead of specific.",
    detectSignals: [
      "In today's...",
      "It's important to note...",
      "Let's dive in",
      "unlock the power",
      "multiple generic AI vocabulary terms"
    ],
    recommendation:
      "Replace AI-slop phrasing with concrete product language: specific nouns, specific actions, and real context.",
    betterDirection: "Direct, grounded copy that sounds like this product and this team.",
    severity: "medium"
  },
  {
    id: "ai-punctuation-tells",
    category: "copywriting",
    title: "AI punctuation tells",
    codexPattern: "Copy overuses em dashes, exclamation marks, or ellipses as a generated-writing rhythm.",
    whyItFeelsAI:
      "Generated text often leans on punctuation for drama or cadence instead of earning emphasis through wording.",
    detectSignals: ["multiple em dashes", "exclamation spam", "ellipsis as transition"],
    recommendation:
      "Reduce punctuation theatrics. Use commas, periods, or sentence structure, and let the words carry emphasis.",
    betterDirection: "Cleaner punctuation with a more natural, less generated rhythm.",
    severity: "low"
  },
  {
    id: "default-font-stack-template",
    category: "typography",
    title: "Default one-font template stack",
    codexPattern:
      "The page relies on one familiar generated-UI font stack, usually Inter/system/Roboto, without a distinct display/body role.",
    whyItFeelsAI:
      "A one-font page can work when it is a deliberate brand choice, but generated UI often defaults there without creating typographic identity or hierarchy.",
    detectSignals: ["single default font family", "Inter/system stack only", "no display/body pairing"],
    recommendation:
      "Define a deliberate type system: keep the body font if it works, but add a distinct display/wordmark role or stronger scale where the brand needs it.",
    betterDirection: "Typography has named roles and hierarchy instead of one default stack everywhere.",
    severity: "low"
  },
  {
    id: "emoji-iconography",
    category: "iconography",
    title: "Emoji used as UI icons",
    codexPattern: "Feature cards, headings, buttons, or lists use emoji as decorative icons.",
    whyItFeelsAI:
      "Emoji are a common generated shortcut for adding personality when the design has not chosen a real icon or visual system.",
    detectSignals: ["emoji before headings", "emoji in feature cards", "emoji checklist icons", "emoji inside CTA/buttons"],
    recommendation:
      "Replace decorative emoji with a real icon set, product-specific visuals, or plain text. Keep emoji only when it is part of the brand voice.",
    betterDirection: "Consistent icon system or no icon; content and hierarchy carry the section.",
    severity: "medium"
  },
  {
    id: "duplicate-cta-intent",
    category: "buttons",
    title: "Duplicate CTA intent",
    codexPattern: "The same user action appears under several different CTA labels.",
    whyItFeelsAI:
      "Generated pages often add more buttons to look complete, then accidentally split one intent across multiple labels.",
    detectSignals: ["Get in touch + Contact us", "Try free + Get started", "View work + Browse projects"],
    recommendation:
      "Pick one label per CTA intent and reuse it consistently across nav, section actions, and footer.",
    betterDirection: "One clear action vocabulary: one intent, one label, one visual priority.",
    severity: "medium"
  },
  {
    id: "cheap-section-meta-labels",
    category: "typography",
    title: "Decorative section-number labels",
    codexPattern: "Eyebrows use labels like 'SECTION 01', 'QUESTION 05', or '00 / INDEX'.",
    whyItFeelsAI:
      "Numbered micro-labels are a generated design tic that adds fake structure without helping the user understand the section.",
    detectSignals: ["SECTION 01", "QUESTION 05", "00 / INDEX", "001 · Capabilities"],
    recommendation:
      "Remove section-number/meta labels. Use a plain topic heading, or let the headline carry the section by itself.",
    betterDirection: "Specific section titles instead of decorative numbering.",
    severity: "low"
  },
  {
    id: "centered-stack-default",
    category: "layout",
    title: "Over-centered default composition",
    codexPattern: "The block relies on centered text, centered containers, and symmetrical stacking by default.",
    whyItFeelsAI:
      "Over-centering is the lowest-risk generated layout choice, so it makes unrelated sections feel templated and generic.",
    detectSignals: ["text-center", "items-center", "justify-center", "mx-auto", "centered equal grid"],
    recommendation:
      "Break the default symmetry: left-align the section header, use a split layout, or create one asymmetric focal area.",
    betterDirection: "Intentional alignment and asymmetry driven by the content, not automatic centering.",
    severity: "medium"
  },
  {
    id: "mobile-viewport-height-risk",
    category: "layout",
    title: "Mobile viewport height risk",
    codexPattern: "Sections use `h-screen`, `min-h-screen`, or `height: 100vh` for full-height layouts.",
    whyItFeelsAI:
      "Generated full-screen sections often ignore mobile browser chrome, which can cause jumping, clipping, or hidden actions.",
    detectSignals: ["h-screen", "min-h-screen", "height: 100vh", "min-height: 100vh"],
    recommendation:
      "Use responsive `min-height` with `100dvh`/safe-area handling and verify that key content is visible on mobile.",
    betterDirection: "Stable viewport sizing that works with mobile browser UI.",
    severity: "medium"
  },
  {
    id: "pure-black-surface",
    category: "color",
    title: "Pure black surface",
    codexPattern: "Dark sections use pure `#000`, `rgb(0,0,0)`, or `bg-black` as the main surface.",
    whyItFeelsAI:
      "Generated dark UIs often jump straight to absolute black, which feels harsher and flatter than a tuned off-black palette.",
    detectSignals: ["#000 background", "rgb(0,0,0) background", "bg-black"],
    recommendation:
      "Replace pure black surfaces with off-black or tinted dark neutrals such as charcoal, zinc, or brand-tinted near-black.",
    betterDirection: "Dark surfaces are calibrated, not default black.",
    severity: "low"
  },
  {
    id: "placeholder-dead-links",
    category: "navigation",
    title: "Placeholder / dead links",
    codexPattern: "Links or CTAs point to `#`, `javascript:void(0)`, or other placeholder destinations.",
    whyItFeelsAI:
      "Generated interfaces often look interactive while leaving the actual destinations unfinished.",
    detectSignals: ["href=\"#\"", "href=\"javascript:void(0)\"", "href=\"/TODO\""],
    recommendation:
      "Connect links to real destinations. If a destination is not ready, disable the control visually and explain the unavailable state.",
    betterDirection: "Every visible action either works or is clearly unavailable.",
    severity: "medium"
  },
  {
    id: "missing-image-alt",
    category: "accessibility",
    title: "Image alt text is missing or generic",
    codexPattern: "Meaningful images have no `alt`, empty `alt`, or generic labels like `alt=\"image\"`.",
    whyItFeelsAI:
      "Generated UI frequently treats images as decoration and misses the semantic/accessibility pass.",
    detectSignals: ["img without alt", "alt=\"\"", "alt=\"image\""],
    recommendation:
      "Add useful alt text for meaningful images. Use empty alt only for truly decorative images.",
    betterDirection: "Images have intentional accessible descriptions or are explicitly decorative.",
    severity: "high"
  },
  {
    id: "arbitrary-z-index",
    category: "layout",
    title: "Arbitrary z-index values",
    codexPattern: "The UI uses `z-index: 9999`, `z-[9999]`, or other arbitrary layering values.",
    whyItFeelsAI:
      "Large arbitrary z-index values are a generated quick fix that makes future overlays and stacking contexts fragile.",
    detectSignals: ["z-index: 9999", "z-[9999]", "z-[99999]"],
    recommendation:
      "Replace arbitrary z-index values with a small layering scale for nav, popover, modal, toast, and overlay.",
    betterDirection: "Layering is systematic and documented, not a pile of emergency values.",
    severity: "medium"
  },
  {
    id: "overwide-paragraph-measure",
    category: "typography",
    title: "Paragraph measure is too wide",
    codexPattern: "Long body copy spans a very wide container instead of being constrained to a readable measure.",
    whyItFeelsAI:
      "Generated layouts often stretch text to fill the container, making copy harder to scan and less deliberately typeset.",
    detectSignals: ["paragraph width > 760px", "no max-width on long body copy", "missing 65ch measure"],
    recommendation:
      "Limit long paragraphs to roughly 60-70 characters per line with `max-width: 65ch` or an equivalent layout constraint.",
    betterDirection: "Readable text measure with clear heading/body rhythm.",
    severity: "low"
  },
  {
    id: "hero-inside-dashboard",
    category: "layout",
    title: "Hero block inside a dashboard",
    codexPattern: "A full hero strip with decorative copy sits inside an internal/app UI.",
    whyItFeelsAI:
      "Dropping a marketing hero into a dashboard is a default AI composition with no product reason.",
    detectSignals: ["hero strip in app UI", "large decorative header band", "marketing copy in dashboard"],
    recommendation:
      "Remove the hero. Start internal UIs with the actual working content and a simple header.",
    betterDirection: "Standard app header, then real content — no hero inside dashboards.",
    severity: "medium"
  },
  {
    id: "hero-missing-clear-headline",
    category: "copywriting",
    title: "Hero lacks a clear headline",
    codexPattern: "The first viewport has no readable, concise headline that explains the product or offer.",
    whyItFeelsAI:
      "Generated heroes often rely on decorative visuals or vague fragments instead of one clear value proposition.",
    detectSignals: ["no h1/heading in hero", "vague headline", "headline not readable quickly"],
    recommendation:
      "Lead with one concise, specific headline that communicates the product value in under two seconds.",
    betterDirection: "A clear H1/value proposition first, then supporting copy and CTA.",
    severity: "high"
  },
  {
    id: "hero-supporting-copy-too-long",
    category: "copywriting",
    title: "Hero supporting copy is too long",
    codexPattern: "The hero uses a long paragraph or multiple text blocks before the primary action.",
    whyItFeelsAI:
      "AI often explains too much in the hero, increasing cognitive load before the user understands the offer.",
    detectSignals: ["supporting copy over 25 words", "multiple long hero paragraphs", "text-heavy hero"],
    recommendation:
      "Compress hero supporting copy to one short paragraph, ideally under 25 words.",
    betterDirection: "Short value clarification that points toward the CTA.",
    severity: "medium"
  },
  {
    id: "hero-missing-primary-cta",
    category: "buttons",
    title: "Hero has no primary CTA",
    codexPattern: "The hero introduces the product but does not provide a clear next action above the fold.",
    whyItFeelsAI:
      "A generated hero can look complete visually while failing the conversion job of the section.",
    detectSignals: ["no button/link CTA in hero", "primary action missing", "above-fold CTA absent"],
    recommendation:
      "Add one obvious primary CTA aligned with the most predictable user action.",
    betterDirection: "One clear primary action above the fold, with optional subtle secondary action.",
    severity: "high"
  },
  {
    id: "hero-competing-ctas",
    category: "buttons",
    title: "Hero has competing CTAs",
    codexPattern: "The hero presents several actions with similar visual weight.",
    whyItFeelsAI:
      "Generated layouts often add multiple buttons to look useful, but the choices compete and weaken conversion.",
    detectSignals: ["three or more hero buttons", "primary and secondary CTA same weight", "too many hero actions"],
    recommendation:
      "Keep one dominant primary CTA and at most one quieter secondary CTA.",
    betterDirection: "Primary CTA is visually strongest; secondary action is text/link or low-emphasis.",
    severity: "medium"
  },
  {
    id: "tiny-touch-targets",
    category: "accessibility",
    title: "Tiny touch targets",
    codexPattern: "Buttons, links, or icon controls are smaller than a comfortable 44x44px tap area.",
    whyItFeelsAI:
      "Generated UI often optimizes for visual compactness and misses the physical ergonomics of touch and pointer use.",
    detectSignals: ["button/link rect below 44x44", "w-6 h-6 icon button", "tiny clickable control"],
    recommendation:
      "Increase interactive controls to at least 44x44px, or wrap small icons in a larger hit area with adequate spacing.",
    betterDirection: "Comfortable tap targets with visible spacing between adjacent actions.",
    severity: "high"
  },
  {
    id: "icon-button-missing-label",
    category: "accessibility",
    title: "Icon-only button lacks accessible name",
    codexPattern: "An icon-only button or link has no visible text, aria-label, title, or labelled-by relationship.",
    whyItFeelsAI:
      "Generated interfaces frequently render icon controls that look finished but are unnamed for screen readers.",
    detectSignals: ["empty button text", "svg/icon-only control", "missing aria-label"],
    recommendation:
      "Add a concise accessible name with `aria-label`, visible text, or an associated label for every icon-only control.",
    betterDirection: "Every control has a clear visual purpose and a programmatic accessible name.",
    severity: "high"
  },
  {
    id: "weak-primary-action",
    category: "buttons",
    title: "Weak primary action",
    codexPattern: "The block has no dominant action, or several actions have the same visual weight.",
    whyItFeelsAI:
      "Generated UI often includes buttons as decoration but fails to make the next step obvious.",
    detectSignals: ["primary CTA missing", "multiple equal-weight buttons", "CTA not clear"],
    recommendation:
      "Make one action visually primary and move competing actions to secondary/link treatment.",
    betterDirection: "One clear primary button near the decision point; secondary actions are quieter.",
    severity: "medium"
  },
  {
    id: "hero-missing-relevant-visual",
    category: "layout",
    title: "Hero visual is missing or not product-relevant",
    codexPattern: "The hero has no meaningful product visual, or the visual appears decorative and disconnected.",
    whyItFeelsAI:
      "AI heroes frequently use abstract decoration instead of showing the product, outcome, or context users need.",
    detectSignals: ["no image/svg/product preview", "decorative abstract visual", "visual does not support message"],
    recommendation:
      "Use a relevant product screenshot, demo, real image, proof panel, or remove the visual if it adds no meaning.",
    betterDirection: "Visual proof that reinforces the headline and clarifies the offer.",
    severity: "medium"
  },
  {
    id: "redrawn-ui-chrome",
    category: "layout",
    title: "Re-drawn UI chrome",
    codexPattern:
      "Product previews are wrapped in fake browser bars, phone frames, code windows, traffic-light dots, or IDE chrome.",
    whyItFeelsAI:
      "Generated UI often redraws operating-system/browser chrome as decoration instead of showing the actual product surface.",
    detectSignals: [
      "browser/window frame classes",
      "traffic-light dots",
      "fake phone frame",
      "fake code/terminal chrome"
    ],
    recommendation:
      "Remove fake chrome. Show the real product view, a real screenshot with a simple hairline border, or a plain content panel.",
    betterDirection: "Product content carries the preview; browser/device chrome is real or absent.",
    severity: "medium"
  },
  {
    id: "hero-missing-trust-support",
    category: "copywriting",
    title: "Hero lacks trust support",
    codexPattern: "The hero asks for a conversion without nearby proof, reassurance, or credibility signal.",
    whyItFeelsAI:
      "Generated heroes often jump from claim to CTA without the small support details that reduce hesitation.",
    detectSignals: ["no logos/testimonials/metrics", "no reassurance near CTA", "no post-CTA trust note"],
    recommendation:
      "Add concise trust support near the CTA only when real proof exists: logos, metrics, testimonial, or reassurance.",
    betterDirection: "Small proof or reassurance that supports the CTA without cluttering the hero.",
    severity: "low"
  },
  {
    id: "hero-poor-scan-flow",
    category: "layout",
    title: "Hero scan flow is unclear",
    codexPattern: "Hero elements do not form a clear headline → copy → CTA → proof/visual reading path.",
    whyItFeelsAI:
      "AI can place hero pieces decoratively without preserving the natural scanning order users expect.",
    detectSignals: ["disconnected hero elements", "CTA far from copy", "visual competes with headline"],
    recommendation:
      "Reorder and align the hero around a clear scan path: headline, supporting copy, primary CTA, then proof/visual.",
    betterDirection: "One obvious visual path from value proposition to action.",
    severity: "medium"
  },
  {
    id: "hero-performance-heavy-visual",
    category: "layout",
    title: "Hero visual may be performance-heavy",
    codexPattern: "The first viewport depends on a heavy background/video/animation before core content is useful.",
    whyItFeelsAI:
      "Generated hero concepts often over-index on spectacle while delaying the headline, CTA, or product meaning.",
    detectSignals: ["large video background", "animation-heavy hero", "critical content hidden behind media load"],
    recommendation:
      "Prioritize immediate headline, supporting copy, and CTA; keep video/animation optimized and non-blocking.",
    betterDirection: "Core hero content loads first; media supports rather than blocks comprehension.",
    severity: "medium"
  },
  {
    id: "metric-card-grid-default",
    category: "cards",
    title: "Metric/KPI card grid as default",
    codexPattern: "A 3–4 column grid of KPI metric cards is the first dashboard instinct.",
    whyItFeelsAI:
      "The metric-card grid is the default AI dashboard layout regardless of whether the data warrants it.",
    detectSignals: ["3-column kpi grid", "equal metric cards", "stat tiles row"],
    recommendation:
      "Only use metric tiles when the numbers matter. Prioritize the primary metric and de-emphasize the rest.",
    betterDirection: "Lead with the metric that matters; avoid a default uniform KPI grid.",
    severity: "medium"
  },
  {
    id: "fake-charts",
    category: "charts",
    title: "Fake charts / metrics",
    codexPattern: "Donut charts and canvas graphs that exist only to fill space.",
    whyItFeelsAI:
      "Decorative charts with hand-wavy percentages are filler that imply data the UI does not have.",
    detectSignals: ["donut chart with vague %", "canvas chart in glass card", "decorative sparklines"],
    recommendation:
      "Remove charts that carry no real data. Show real numbers or nothing.",
    betterDirection: "Only chart real, product-specific data.",
    severity: "medium"
  },
  {
    id: "placeholder-proof-copy",
    category: "copywriting",
    title: "Placeholder proof or stock metrics",
    codexPattern:
      "Proof areas use placeholder names, lorem ipsum, Acme/Jane Doe examples, or stock metrics like '10x faster' and 'trusted by 50,000+ teams'.",
    whyItFeelsAI:
      "Fabricated proof is a strong generated-content tell because it fills credibility slots without real evidence.",
    detectSignals: ["Jane Doe / John Smith", "Acme / lorem ipsum", "10x faster", "trusted by 50,000+ teams"],
    recommendation:
      "Use only verified proof. Replace stock names/metrics with real data, mark metrics as pending, or remove the proof slot.",
    betterDirection: "Credibility content is factual, sourced, or intentionally left blank.",
    severity: "medium"
  },
  {
    id: "placeholder-only-form-labels",
    category: "forms",
    title: "Placeholder-only form fields",
    codexPattern: "Inputs rely on placeholder text instead of visible or programmatic labels.",
    whyItFeelsAI:
      "Generated forms often look clean by removing labels, but placeholders disappear during typing and weaken accessibility.",
    detectSignals: ["input placeholder without label", "no aria-label", "floating label absent"],
    recommendation:
      "Give every field a visible label or a clear programmatic label. Keep placeholders only as examples, not as the field name.",
    betterDirection: "Labeled inputs with visible error, focus, loading, and success states.",
    severity: "high"
  },
  {
    id: "left-border-accent-cards",
    category: "cards",
    title: "Left-border accent cards",
    codexPattern:
      "Repeated cards use a colored left border as the main visual accent.",
    whyItFeelsAI:
      "Colored left-border cards are a generated dashboard/feature trope that adds emphasis without a real information hierarchy.",
    detectSignals: ["border-left: 4px solid", "border-l-4 + color utility", "repeated accent strips on cards"],
    recommendation:
      "Remove the decorative accent strip. Use hierarchy, grouping, background contrast, or one intentionally featured card instead.",
    betterDirection: "Cards have purposeful hierarchy rather than repeated colored rails.",
    severity: "medium"
  },
  {
    id: "blue-cyan-ai-dashboard",
    category: "color",
    title: "Random blue/cyan AI-dashboard colors",
    codexPattern: "'Premium dark mode' = blue-black gradients plus cyan accents.",
    whyItFeelsAI:
      "Blue/cyan-on-dark is the signature default AI dashboard palette used without product reason.",
    detectSignals: ["blue/cyan accents on dark UI", "radial blue gradient background", "cyan glow accents"],
    recommendation:
      "Use the project's real palette or a calm, dark muted scheme. Avoid defaulting to blue/cyan.",
    betterDirection: "Calm, dark muted colors from the project palette, not generic blue/cyan.",
    severity: "medium"
  },
  {
    id: "overpadded-layout",
    category: "spacing",
    title: "Overpadded layout",
    codexPattern: "Sections and cards use very large padding (48px+) to look airy/expensive.",
    whyItFeelsAI:
      "Excessive padding creates dead space that fakes a premium feel instead of organizing content.",
    detectSignals: ["padding >= 48px in cards/sections", "huge whitespace bands", "dead space for effect"],
    recommendation:
      "Use a consistent 16/24/32px spacing scale. Reserve large padding for genuinely large containers.",
    betterDirection: "Standard section padding (20–30px); no dead space for effect.",
    severity: "low"
  },
  {
    id: "text-heavy-block",
    category: "copywriting",
    title: "Text-heavy block",
    codexPattern: "Large paragraphs or repeated explanatory copy carry the section instead of scannable structure.",
    whyItFeelsAI:
      "AI-generated UI often explains the interface with too much copy instead of designing hierarchy and grouping.",
    detectSignals: ["long paragraphs", "dense supporting copy", "too_text_heavy"],
    recommendation:
      "Reduce copy density by grouping text into a clear heading, short body, bullets, or cards with visible hierarchy.",
    betterDirection: "Scannable structure: concise heading, short support, grouped details.",
    severity: "medium"
  },
  {
    id: "weak-hierarchy",
    category: "typography",
    title: "Weak visual hierarchy",
    codexPattern: "Headings, labels, and body text are nearly the same size/weight.",
    whyItFeelsAI:
      "Flat hierarchy is what you get when styling is generated uniformly instead of designed.",
    detectSignals: ["similar font sizes across headings", "no clear primary element", "uniform weight"],
    recommendation:
      "Establish a clear type scale. Make the primary element noticeably larger/heavier.",
    betterDirection: "Strong h1 → h2 → body contrast; one clear focal point.",
    severity: "medium"
  },
  {
    id: "monotonous-section-rhythm",
    category: "layout",
    title: "Monotonous section rhythm",
    codexPattern: "Everything has the same size, density, and emphasis, so the section has no focal point.",
    whyItFeelsAI:
      "Generated layouts often distribute all content evenly because equal grids are easy to produce.",
    detectSignals: ["flat_layout", "no_visual_rhythm", "uniform cards", "no dominant element"],
    recommendation:
      "Introduce a clear focal point: make the most important item larger or more prominent and group supporting content around it.",
    betterDirection: "One dominant element, supporting groups, and intentional spacing rhythm.",
    severity: "medium"
  },
  {
    id: "repetitive-equal-cards",
    category: "cards",
    title: "Repetitive equal cards",
    codexPattern: "Three or more cards share identical size and visual weight.",
    whyItFeelsAI:
      "Perfectly equal cards are a default grid output with no editorial emphasis.",
    detectSignals: ["equal_grid layout", "cards with same width/height", "same visual weight repeated"],
    recommendation:
      "Create hierarchy: feature one card and reduce the emphasis of supporting cards.",
    betterDirection: "Make one card visually dominant; vary size or emphasis.",
    severity: "medium"
  },
  {
    id: "icon-tile-feature-cards",
    category: "cards",
    title: "Default icon-tile feature cards",
    codexPattern:
      "A feature section uses three or more equal cards with a rounded icon tile above a heading and short body copy.",
    whyItFeelsAI:
      "The icon-above-heading card grid is a common generated layout that treats every feature as equally important and adds icons as decoration.",
    detectSignals: ["3-column feature grid", "rounded icon tiles", "equal feature cards"],
    recommendation:
      "Break the feature-card template: make one feature dominant, move icons inline, group features by workflow, or switch to a bento/stacked structure.",
    betterDirection: "Feature hierarchy follows product value or workflow, not a cloned card pattern.",
    severity: "medium"
  },
  {
    id: "pricing-plan-weak-emphasis",
    category: "layout",
    title: "Pricing plans lack decision hierarchy",
    codexPattern: "Pricing cards are presented as identical columns with no recommended plan or comparison rhythm.",
    whyItFeelsAI:
      "Generated pricing sections often clone three plan cards and leave the user to compare everything manually.",
    detectSignals: ["pricing tokens", "credits/plan cards", "equal pricing columns", "no dominant plan"],
    recommendation:
      "Make one recommended plan visually dominant, keep secondary plans quieter, and align price, benefits, and CTA rows.",
    betterDirection: "Pricing comparison with one clear recommended option and fast horizontal scanning.",
    severity: "medium"
  },
  {
    id: "nested-panel-overload",
    category: "panels",
    title: "Too many nested panels",
    codexPattern: "Multiple nested panel types (panel, panel-2, rail-panel, table-panel).",
    whyItFeelsAI:
      "Boxes inside boxes inside boxes is structure-as-decoration, a hallmark of generated layouts.",
    detectSignals: ["bordered panel inside bordered panel", "many nested backgrounds", "panel-in-panel"],
    recommendation:
      "Flatten the structure. Use spacing and a single level of containers instead of nested shells.",
    betterDirection: "One level of panels; separate content with spacing, not nested boxes.",
    severity: "medium"
  },
  {
    id: "decorative-badges",
    category: "badges",
    title: "Decorative badges",
    codexPattern: "Badges/tags on every row and nav item that do not communicate state.",
    whyItFeelsAI:
      "Badges-everywhere is ornamental noise added because it is easy to generate.",
    detectSignals: ["tag badge on every status", "nav badges ('Live', counts)", "decorative chips"],
    recommendation:
      "Keep badges only where they convey real, changing state. Remove decorative ones.",
    betterDirection: "Functional badges only; plain text otherwise.",
    severity: "low"
  },
  {
    id: "decorative-announcement-bubble",
    category: "badges",
    title: "Decorative announcement bubble",
    codexPattern:
      "A large pastel pill/bubble with a decorative dot and short availability copy like 'Coming soon' or 'Soon in Astana'.",
    whyItFeelsAI:
      "Generated landing pages often turn ordinary availability/location notes into oversized soft pills with a dot because it looks designed without adding real hierarchy or information.",
    detectSignals: [
      "large rounded announcement pill",
      "coming soon / скоро badge",
      "decorative dot inside location/status bubble",
      "pastel bordered availability chip"
    ],
    recommendation:
      "Remove the oversized announcement bubble. Use plain text, a compact functional badge, or a real status row only if the availability/location state matters.",
    betterDirection:
      "Short availability copy set in normal hierarchy; no decorative dot or inflated pastel pill.",
    severity: "medium"
  },
  {
    id: "transform-hover-overuse",
    category: "motion",
    title: "Decorative hover transforms",
    codexPattern: "Hover effects translate/scale elements (e.g. translateX(2px) on nav links).",
    whyItFeelsAI:
      "Transform-on-hover everywhere is a default motion tic that adds movement without purpose.",
    detectSignals: ["hover:scale", "hover:translate", "transition-transform", "bouncy hover motion"],
    recommendation:
      "Use simple opacity/color hover changes (100–200ms). Avoid transform animations.",
    betterDirection: "Subtle color/opacity hover states, no transforms.",
    severity: "low"
  },
  {
    id: "unbounded-sluggish-motion",
    category: "motion",
    title: "Unbounded or sluggish UI motion",
    codexPattern: "UI transitions use `transition: all`, `ease-in`, or long durations on ordinary interface elements.",
    whyItFeelsAI:
      "Generated motion often works technically but feels slow, vague, or disconnected because it animates too much with weak timing.",
    detectSignals: ["transition: all", "ease-in on UI", "UI duration over 300ms", "transition-all utility"],
    recommendation:
      "Specify exact animated properties, use responsive ease-out/custom curves, and keep routine UI motion under 300ms.",
    betterDirection: "Purposeful 125-250ms transitions on transform/opacity/color only.",
    severity: "medium"
  },
  {
    id: "layout-property-animation",
    category: "motion",
    title: "Layout-property animation",
    codexPattern: "Animations or transitions target width, height, margin, padding, top, left, right, or bottom.",
    whyItFeelsAI:
      "Animating layout properties is a generated shortcut that risks jank because it forces layout and paint work.",
    detectSignals: ["transitioning width/height", "animating margin/padding", "keyframes moving top/left"],
    recommendation:
      "Move motion to transform and opacity. Use translate/scale/clip-path for movement and reveal instead of layout properties.",
    betterDirection: "GPU-friendly transform/opacity motion with stable layout.",
    severity: "medium"
  },
  {
    id: "motion-reduced-accessibility-missing",
    category: "motion",
    title: "Motion lacks reduced-motion fallback",
    codexPattern: "Transform/position animation is present without a `prefers-reduced-motion` fallback.",
    whyItFeelsAI:
      "Generated animation often optimizes for spectacle and skips the accessibility details that make motion safe to use.",
    detectSignals: ["transform animation", "keyframes movement", "no prefers-reduced-motion media query"],
    recommendation:
      "Add a reduced-motion path: keep helpful opacity/color transitions, but remove or shorten transform/position movement.",
    betterDirection: "Motion respects `prefers-reduced-motion` and keeps the interface understandable.",
    severity: "medium"
  },
  {
    id: "inconsistent-spacing",
    category: "spacing",
    title: "Inconsistent / poor spacing",
    codexPattern: "Random gaps and padding values that do not follow a scale.",
    whyItFeelsAI:
      "Off-scale spacing is what generated CSS produces when each value is chosen independently.",
    detectSignals: ["padding values off the 4/8 scale", "mixed alignment logic", "random gaps"],
    recommendation:
      "Adopt a consistent 4/8/12/16/24/32px spacing scale across the section.",
    betterDirection: "Consistent spacing scale; predictable rhythm.",
    severity: "low"
  },
  {
    id: "sidebar-floating-shell",
    category: "navigation",
    title: "Floating sidebar shell",
    codexPattern: "A detached sidebar with rounded outer corners, margin, and shadow.",
    whyItFeelsAI:
      "The floating rounded sidebar shell is a generated 'app chrome' look with no functional reason.",
    detectSignals: ["sidebar with outer radius", "detached/floating rail", "sidebar with shadow + margin"],
    recommendation:
      "Use a normal fixed sidebar (240–260px, solid background, simple border-right, square outer corners).",
    betterDirection: "Solid edge-to-edge sidebar with a border-right, not a floating card.",
    severity: "low"
  },
  {
    id: "ai-nav-footer-template",
    category: "navigation",
    title: "Generic AI navigation/footer template",
    codexPattern:
      "Navigation uses the default 'Features / Pricing / Docs / Blog / About' row, or footer uses Product / Company / Resources / Legal columns without real IA.",
    whyItFeelsAI:
      "Generic nav and footer shapes are genre-blind; they make very different products look like the same generated SaaS template.",
    detectSignals: [
      "Features Pricing Docs Blog About nav",
      "Product Company Resources Legal footer",
      "link cluster with no product-specific IA"
    ],
    recommendation:
      "Rebuild navigation/footer around the actual information architecture. Keep only real destinations and choose a structure that matches the product type.",
    betterDirection: "Navigation/footer labels and grouping reflect this product, not a stock SaaS sitemap.",
    severity: "medium"
  },
  {
    id: "decorative-status-dots",
    category: "badges",
    title: "Decorative status dots",
    codexPattern: "Colored ::before dots / 'live pulse' indicators used decoratively.",
    whyItFeelsAI:
      "Pulsing status dots add fake liveliness that doesn't reflect real state.",
    detectSignals: ["::before colored dots", "live pulse indicator", "decorative status dot"],
    recommendation:
      "Use status indicators only for real status. Drop decorative pulses.",
    betterDirection: "Plain text or one functional indicator; no decorative dots.",
    severity: "low"
  },
  {
    id: "too-many-muted-labels",
    category: "typography",
    title: "Too many muted labels",
    codexPattern: "Overuse of muted gray-blue text that weakens contrast and clarity.",
    whyItFeelsAI:
      "Muting everything is a generated way to look 'calm' that actually destroys readability.",
    detectSignals: ["many low-contrast muted labels", "gray-blue secondary text everywhere"],
    recommendation:
      "Limit muted text. Keep primary content at full contrast and readable.",
    betterDirection: "Strong contrast for content; muted only for true secondary info.",
    severity: "low"
  },
  {
    id: "random-glass-panels",
    category: "panels",
    title: "Random glass panels",
    codexPattern: "Frosted/blur-haze panels scattered as decoration with no overlay purpose.",
    whyItFeelsAI:
      "Glass haze used as decoration is a generated effect that adds nothing functional.",
    detectSignals: ["isolated frosted panels", "blur haze decoration", "conic-gradient donuts"],
    recommendation:
      "Remove decorative glass panels. Use solid surfaces and structure instead.",
    betterDirection: "Solid, honest panels; no decorative glass.",
    severity: "low"
  },
  {
    id: "generic-saas-composition",
    category: "layout",
    title: "Generic dark SaaS composition",
    codexPattern: "The whole block reads as a generic dark SaaS template (sidebar + KPI grid + glass + glow).",
    whyItFeelsAI:
      "The overall composition follows the path of least resistance and screams 'an AI made this'.",
    detectSignals: [
      "multiple AI-default patterns combined",
      "template-like dark SaaS layout",
      "control-room cosplay"
    ],
    recommendation:
      "Rebuild from the real information architecture. Think Linear/Stripe/GitHub: functional, calm, honest.",
    betterDirection: "Clean, content-first layout that reflects the actual product, not a template.",
    severity: "high"
  }
];

export const uncodixifyRuleMap: Record<string, UncodixifyRule> = uncodixifyRules.reduce(
  (map, rule) => {
    map[rule.id] = rule;
    return map;
  },
  {} as Record<string, UncodixifyRule>
);

export function getUncodixifyRule(id: string): UncodixifyRule | undefined {
  return uncodixifyRuleMap[id];
}

export const uncodixifyRuleIds = uncodixifyRules.map((rule) => rule.id);
