import type { AIUnderstandingResult, RectangleCapture } from "../shared/types";
import type {
  UncodixifyAnalysisResult,
  UncodixifyFinding
} from "../analysis/uncodixifyTypes";
import type { AnimationReference } from "./animationReferences";
import type { LayoutPattern } from "./layoutPatterns";
import type { TemplateReference } from "./templateReferences";

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
  const sectionType =
    args.aiResult?.sectionType ?? args.capture?.detected.sectionType ?? "unknown";
  const layoutType =
    args.aiResult?.layoutType ?? args.capture?.detected.layoutType ?? "unknown";
  const hasDirection =
    args.designDirectionSelected ??
    Boolean(args.templateReference || args.animationReference);

  const findings = selectIncludedFindings(args.uncodixify, args.includedUncodixifyRuleIds);
  const styleContext = formatStylePreservation(args.capture);

  const sections: string[] = [];

  sections.push(`# Role

You are a senior frontend engineer and product UI designer working inside the user's existing codebase.`);

  const contextParts = [
    `This block was selected from the user's existing website/app.`,
    `Section type: ${sectionType}. Current layout: ${layoutType}.`,
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

Fix the detected UI-quality issues in the selected block.
This is not a redesign of the product. Only address the detected issues listed below while keeping the block's purpose and visual identity.`);

  sections.push(`# Detected Issues

${findings.length ? formatDetectedIssues(findings) : formatNoIssues()}`);

  sections.push(`# Style Preservation Rules

${
    hasDirection
      ? `Use the selected design direction as layout inspiration only.
Do not copy external assets, brands, logos, or exact code.
Preserve the product's existing visual identity unless a detected issue specifically requires changes.`
      : `Do not change the core visual style of the existing UI.
Do not redesign this into a different template.
Only fix the detected issues listed below.
Preserve current colors, typography, content structure, spacing rhythm, and component identity unless a detected issue specifically requires adjustment.`
  }`);

  sections.push(`# Constraints

- Do not rewrite visible text unless necessary.
- Do not change functionality.
- Do not change business logic.
- Do not remove important content.
- Do not change data fetching.
- Preserve accessibility.
- Use existing project components/tokens if present.
- Prefer small targeted changes over a full redesign.${
    args.animationReference
      ? "\n- If adding motion, keep it subtle and respect prefers-reduced-motion."
      : ""
  }`);

  sections.push(`# Expected Output

Modify the relevant UI code.
Keep the changes minimal, intentional, and consistent with the existing codebase.
Return a short summary of what changed.`);

  sections.push(`# Self-check

Before finishing, verify:
- visible text is preserved;
- functionality is unchanged;
- only detected issues were addressed;
- existing style was preserved unless a detected issue required a change;
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

function formatStylePreservation(capture?: RectangleCapture | null): string {
  const styleTokens = capture?.styleTokens;

  if (styleTokens) {
    return `- Section background: ${styleTokens.section.background ?? "existing section background"}
- Text color: ${styleTokens.section.color ?? styleTokens.heading.color ?? "existing text color"}
- Muted text color: ${styleTokens.muted.color ?? styleTokens.body.color ?? "existing muted text color"}
- Card background: ${styleTokens.card.background ?? "existing card background"}
- Border / radius: ${styleTokens.card.border ?? styleTokens.card.borderColor ?? "existing border"} / ${styleTokens.card.borderRadius ?? "existing radius"}
- Font family: ${styleTokens.section.fontFamily ?? styleTokens.heading.fontFamily ?? "existing font family"}

Treat these as direction, not forced values. Preserve the visual language through the existing components and design tokens; do not paste extracted CSS wholesale.`;
  }

  const styleContext = capture?.styleContext;

  if (!styleContext) {
    return "Preserve the existing visual style from the component and design system.";
  }

  return `- Theme: ${styleContext.theme}
- Background: ${styleContext.section.backgroundColor ?? "existing section background"}
- Card background: ${styleContext.card.backgroundColor ?? "existing card background"}
- Text color: ${styleContext.text.headingColor ?? styleContext.section.color ?? "existing text color"}
- Accent color: ${styleContext.accent.color ?? styleContext.accent.backgroundColor ?? "existing accent color"}
- Border radius: ${styleContext.card.borderRadius ?? styleContext.section.borderRadius ?? "existing radius"}

Treat these as direction, not forced values.`;
}
