import type { AIUnderstandingResult, RectangleCapture } from "../shared/types";
import type {
  UncodixifyAnalysisResult,
  UncodixifyFinding
} from "../analysis/uncodixifyTypes";
import type { AnimationReference } from "./animationReferences";
import type { LayoutPattern } from "./layoutPatterns";
import type { TemplateReference } from "./templateReferences";
import { buildCaptureObjectInventory } from "../analysis/buildObjectInventory";

export type GenerateCursorPromptArgs = {
  aiResult?: AIUnderstandingResult | null;
  capture?: RectangleCapture | null;
  // A design direction is only "selected" when the user actively picked one.
  // `pattern` may be a fallback suggestion, so it does NOT by itself mean the
  // user chose a direction — pass `designDirectionSelected` explicitly.
  designDirectionSelected?: boolean;
  pattern?: LayoutPattern | null;
  templateReference?: TemplateReference | null;
  animationReference?: AnimationReference | null;
  uncodixify?: UncodixifyAnalysisResult | null;
  includedUncodixifyRuleIds?: string[];
};

// Builds the user-facing Cursor/Codex prompt following the PromptGen
// architecture (docs/PROMPT_GENERATION_PRINCIPLES.md): Role → Context → Task →
// Detected Issues → Style Preservation Rules → Constraints → Expected Output →
// Self-check.
//
// The prompt is centered on the detected Uncodixify issues. It only introduces a
// design direction when the user actively selected one — otherwise it explicitly
// tells the coding agent to preserve the existing visual style and fix only the
// detected issues (no redesign).
export function generateCursorPrompt(args: GenerateCursorPromptArgs): string {
  const sectionType = args.aiResult?.sectionType ?? "unknown";
  const layoutType = args.aiResult?.layoutType ?? "unknown";
  const hasDirection =
    args.designDirectionSelected ??
    Boolean(args.templateReference || args.animationReference);

  const findings = selectIncludedFindings(args.uncodixify, args.includedUncodixifyRuleIds);
  const styleContext = formatStylePreservation(args.capture);
  const objectContext = formatObjectInventory(args.capture);

  const sections: string[] = [];

  sections.push(`# Role

You are a senior frontend engineer and product UI designer working inside the user's existing codebase.`);

  const contextParts = [
    `This block was selected from the user's existing website/app.`,
    `Section type: ${sectionType}. Current layout: ${layoutType}.`,
    ``,
    `Detected object inventory:`,
    objectContext,
    ``,
    `Current visual style to preserve:`,
    styleContext
  ];
  if (hasDirection) {
    contextParts.push(
      ``,
      `Selected design direction (inspiration only):`,
      formatDesignDirection(args)
    );
  }
  sections.push(`# Context\n\n${contextParts.join("\n")}`);

  sections.push(`# Task

Humanize the selected block by fixing the detected UI-quality issues.
Make the changes visible enough that the selected block no longer reads as generic/generated.
Layout, hierarchy, spacing, card emphasis, container structure, and CTA treatment may change inside this selected block when those changes directly resolve the detected issues.
This is not a page-wide redesign. Keep the block's purpose, content, functionality, and brand identity.`);

  sections.push(`# Detected Issues

${findings.length ? formatDetectedIssues(findings) : formatNoIssues()}`);

  sections.push(`# Implementation Plan

${formatImplementationPlan(args.capture, findings, args.aiResult ?? null)}`);

  sections.push(`# Style Preservation Rules

${
    hasDirection
      ? `Use the selected design direction as layout inspiration only.
Do not copy external assets, brands, logos, or exact code.
Preserve the product's existing visual identity unless a detected issue specifically requires changes.
Use the direction to make concrete structural improvements, not just cosmetic tweaks.`
      : `Do not change the core visual style of the existing UI.
Do not redesign this into a different template or change the brand.
Only fix the detected issues listed below.
Preserve colors, typography family, content meaning, and component identity, but adjust layout, hierarchy, spacing, containers, and emphasis as needed to resolve the issues.`
  }`);

  sections.push(`# Constraints

- Do not rewrite visible text unless necessary.
- Do not change functionality.
- Do not change business logic.
- Do not remove important content.
- Do not change data fetching.
- Preserve accessibility.
- Use existing project components/tokens if present.
- Do not solve structural issues with copy-only or color-only tweaks.
- Prefer focused, visible changes inside the selected block over a full page redesign.${
    args.animationReference
      ? "\n- If adding motion, keep it subtle and respect prefers-reduced-motion."
      : ""
  }`);

  sections.push(`# Expected Output

Modify the relevant UI code.
Make concrete code changes that visibly resolve each included issue.
For layout/card/hierarchy findings, change the composition or component structure enough for the improvement to be obvious.
Return a short summary of what changed.`);

  sections.push(`# Self-check

Before finishing, verify:
- visible text is preserved;
- functionality is unchanged;
- only detected issues were addressed;
- existing brand/style was preserved unless a detected issue required a structural change;
- each included issue has a corresponding visible UI change;
- no external assets or copied designs were introduced.`);

  return sections.join("\n\n");
}

function selectIncludedFindings(
  uncodixify?: UncodixifyAnalysisResult | null,
  includedRuleIds?: string[]
): UncodixifyFinding[] {
  if (!uncodixify || !uncodixify.findings.length) return [];
  const includedSet = includedRuleIds ? new Set(includedRuleIds) : null;
  return uncodixify.findings.filter(
    (finding) => !includedSet || includedSet.has(finding.ruleId)
  );
}

function formatDetectedIssues(findings: UncodixifyFinding[]): string {
  return findings
    .map((finding, index) => formatDetectedIssue(finding, index + 1))
    .join("\n\n");
}

// Evidence-based, not over-prescriptive. We give the issue, evidence, why it
// matters, and a general correction direction — the coding agent decides the
// concrete implementation against the existing design system.
function formatDetectedIssue(finding: UncodixifyFinding, position: number): string {
  const evidence = finding.evidence[0] ?? "Detected during analysis.";
  const lines = [
    `${position}. ${finding.title}`,
    `Category: ${finding.category}`,
    `Evidence: ${evidence}`,
    `Why it matters: ${finding.whyItFeelsAI ?? "Reads as generic AI-generated UI."}`,
    `Correction direction: ${finding.recommendation}`
  ];
  if (finding.betterDirection) {
    lines.push(`Direction (not a forced value): ${finding.betterDirection}`);
  }
  return lines.join("\n");
}

function formatImplementationPlan(
  capture: RectangleCapture | null | undefined,
  findings: UncodixifyFinding[],
  aiResult: AIUnderstandingResult | null | undefined
): string {
  const inventory = capture ? buildCaptureObjectInventory(capture) : null;
  const ruleIds = new Set(findings.map((finding) => finding.ruleId));
  const categories = new Set(findings.map((finding) => finding.category));
  const steps: string[] = [];
  const primaryHeading = inventory?.primaryHeading;
  const mainAction = inventory?.actions[0]?.label;
  const cardCount = inventory?.summary.cards ?? 0;
  const priceTokenCount = inventory?.summary.priceTokens ?? 0;
  const repeatedCards = inventory?.repeatedGroups.find((group) => group.type === "card");
  const sectionType =
    aiResult?.sectionType ?? capture?.detected?.sectionType ?? "unknown";

  steps.push(
    "Locate the selected block in the codebase and preserve its existing content, data flow, and component API."
  );

  if (sectionType === "pricing" || priceTokenCount >= 2) {
    steps.push(
      "Restructure the pricing area around plan comparison: make one recommended plan visually dominant, keep secondary plans quieter, and align price, benefits, and CTA rows for fast scanning."
    );
  }

  if (sectionType === "features" && (repeatedCards || cardCount >= 3)) {
    steps.push(
      "Turn the repeated feature/workflow cards into a clearer story: vary emphasis, introduce a lead step or featured card, and group supporting steps so the section reads as designed rather than cloned."
    );
  }

  if (
    ruleIds.has("repetitive-equal-cards") ||
    ruleIds.has("monotonous-section-rhythm") ||
    categories.has("layout") ||
    categories.has("cards")
  ) {
    steps.push(
      `Rework the block structure, not just styles: ${
        repeatedCards || cardCount >= 3
          ? `turn the ${cardCount || repeatedCards?.count} similar card objects into a hierarchy with one featured item and supporting items.`
          : "create one clear focal area and group supporting content around it."
      }`
    );
  }

  if (ruleIds.has("weak-hierarchy") || categories.has("typography")) {
    steps.push(
      `Strengthen hierarchy around ${primaryHeading ? `"${primaryHeading}"` : "the primary heading"} using type scale, spacing, and visual grouping.`
    );
  }

  if (
    ruleIds.has("weak-primary-action") ||
    ruleIds.has("hero-missing-primary-cta") ||
    ruleIds.has("hero-competing-ctas") ||
    categories.has("buttons")
  ) {
    steps.push(
      `Make ${mainAction ? `"${mainAction}"` : "one action"} the clear primary action and demote competing actions to secondary/link treatment.`
    );
  }

  if (ruleIds.has("text-heavy-block") || categories.has("copywriting")) {
    steps.push(
      "Reduce scan friction: keep the text meaning, but break dense copy into short support text, bullets, or grouped details."
    );
  }

  if (
    categories.has("radius") ||
    categories.has("shadow") ||
    categories.has("panels") ||
    categories.has("color") ||
    ruleIds.has("generic-saas-composition")
  ) {
    steps.push(
      "Clean up generated-looking styling: reduce excessive radius/glow/glass/shadows and rely on spacing, borders, and hierarchy."
    );
  }

  if (findings.length && steps.length < 3) {
    steps.push(
      "Apply each detected recommendation as a visible UI change inside the selected block, then verify the before/after difference."
    );
  }

  if (!findings.length) {
    return [
      "1. Inspect the selected block and make only small cleanup changes if a clear issue exists.",
      "2. Do not redesign the block or invent problems not visible in the UI."
    ].join("\n");
  }

  return steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
}

function formatNoIssues(): string {
  return `No strong AI/Codex UI issues were detected — the block looks human-designed.
Apply only minor cleanup if something is clearly off. Do not invent issues, and do not redesign the block.`;
}

function formatDesignDirection(args: GenerateCursorPromptArgs): string {
  const parts: string[] = [];

  if (args.pattern) {
    parts.push(`Layout pattern: ${args.pattern.name}
Use this only as structural inspiration: ${args.pattern.promptInstruction}`);
  }

  if (args.templateReference) {
    parts.push(`Template reference: ${args.templateReference.title} (${args.templateReference.source})
Use only as high-level visual inspiration. Do not copy code, assets, text, logos, or branding.`);
  }

  if (args.animationReference) {
    parts.push(`Animation idea: ${args.animationReference.title} (${args.animationReference.source})
Use only as motion inspiration. Keep it subtle and respect prefers-reduced-motion.`);
  }

  if (!parts.length) {
    return "Use the selected direction as layout inspiration only. Do not copy external assets or code.";
  }

  return parts.join("\n\n");
}

function formatObjectInventory(capture?: RectangleCapture | null): string {
  if (!capture) {
    return "- No object inventory was captured. Use the visible screenshot and existing code structure.";
  }

  const inventory = buildCaptureObjectInventory(capture);
  const summary = inventory.summary;
  const lines = [
    `- Counts: ${summary.headings} headings, ${summary.actions} actions, ${summary.cards} cards, ${summary.inputs} inputs, ${summary.media} media, ${summary.metrics} metrics, ${summary.priceTokens} price/pricing tokens.`,
    inventory.primaryHeading ? `- Primary heading: ${inventory.primaryHeading}` : "",
    inventory.headings.length
      ? `- Headings: ${inventory.headings.slice(0, 5).join(" | ")}`
      : "",
    inventory.actions.length
      ? `- Actions: ${inventory.actions.slice(0, 6).map((item) => item.label).join(" | ")}`
      : "",
    inventory.cards.length
      ? `- Card-like objects: ${inventory.cards.slice(0, 8).map((item) => item.label).join(" | ")}`
      : "",
    inventory.metrics.length
      ? `- Metrics: ${inventory.metrics.slice(0, 8).join(" | ")}`
      : "",
    inventory.priceTokens.length
      ? `- Pricing tokens: ${inventory.priceTokens.slice(0, 10).join(" | ")}`
      : "",
    inventory.repeatedGroups.length
      ? `- Repeated groups: ${inventory.repeatedGroups
          .slice(0, 4)
          .map((group) => `${group.count} ${group.type}${group.similarSize ? " with similar size" : ""}`)
          .join(" | ")}`
      : "",
    `- Style signals: ${inventory.styleSignals.largeRadiusCount} large-radius, ${inventory.styleSignals.pillCount} pill, ${inventory.styleSignals.shadowCount} heavy-shadow, ${inventory.styleSignals.glowCount} glow, ${inventory.styleSignals.filledSurfaceCount} filled-surface elements.`,
    `- Layout signals: ${inventory.layoutSignals.density} density, approx ${inventory.layoutSignals.columnsEstimate} columns x ${inventory.layoutSignals.rowsEstimate} rows.`
  ].filter(Boolean);

  return lines.join("\n");
}

function formatStylePreservation(capture?: RectangleCapture | null): string {
  const styleTokens = capture?.styleTokens;
  const pageDesignHints = formatPageDesignHints(capture);

  if (styleTokens) {
    return `- Section background: ${styleTokens.section.background ?? "existing section background"}
- Text color: ${styleTokens.section.color ?? styleTokens.heading.color ?? "existing text color"}
- Muted text color: ${styleTokens.muted.color ?? styleTokens.body.color ?? "existing muted text color"}
- Card background: ${styleTokens.card.background ?? "existing card background"}
- Border / radius: ${styleTokens.card.border ?? styleTokens.card.borderColor ?? "existing border"} / ${styleTokens.card.borderRadius ?? "existing radius"}
- Font family: ${styleTokens.section.fontFamily ?? styleTokens.heading.fontFamily ?? "existing font family"}
${pageDesignHints}

Treat these as direction, not forced values. Preserve the visual language through the existing components and design tokens; do not paste extracted CSS wholesale.`;
  }

  const styleContext = capture?.styleContext;

  if (!styleContext) {
    return `Preserve the existing visual style from the component and design system.${pageDesignHints}`;
  }

  return `- Theme: ${styleContext.theme}
- Background: ${styleContext.section.backgroundColor ?? "existing section background"}
- Card background: ${styleContext.card.backgroundColor ?? "existing card background"}
- Text color: ${styleContext.text.headingColor ?? styleContext.section.color ?? "existing text color"}
- Accent color: ${styleContext.accent.color ?? styleContext.accent.backgroundColor ?? "existing accent color"}
- Border radius: ${styleContext.card.borderRadius ?? styleContext.section.borderRadius ?? "existing radius"}
${pageDesignHints}

Treat these as direction, not forced values.`;
}

function formatPageDesignHints(capture?: RectangleCapture | null): string {
  const context = capture?.pageDesignContext;
  if (!context) return "";

  const lines = [
    context.typography.fontFamilies.length
      ? `- Page font stack samples: ${context.typography.fontFamilies.slice(0, 3).join(" | ")}`
      : "",
    context.typography.fontSizes.length
      ? `- Page type scale samples: ${context.typography.fontSizes.slice(0, 6).join(", ")}`
      : "",
    context.colors.backgrounds.length || context.colors.text.length
      ? `- Page color samples: backgrounds ${context.colors.backgrounds.slice(0, 4).join(", ") || "n/a"}; text ${context.colors.text.slice(0, 4).join(", ") || "n/a"}`
      : "",
    context.spacing.scale.length
      ? `- Page spacing scale samples: ${context.spacing.scale.slice(0, 7).join(", ")}`
      : "",
    context.radius.length
      ? `- Page radius samples: ${context.radius.slice(0, 5).join(", ")}`
      : ""
  ].filter(Boolean);

  return lines.length ? `\n${lines.join("\n")}` : "";
}
