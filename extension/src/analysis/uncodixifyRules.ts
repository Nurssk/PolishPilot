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
