import type { AIUnderstandingResult, RectangleCapture } from "../shared/types";
import type { AnimationReference } from "./animationReferences";
import type { LayoutPattern } from "./layoutPatterns";
import type { TemplateReference } from "./templateReferences";

export function generateCursorPrompt(args: {
  pattern: LayoutPattern;
  aiResult?: AIUnderstandingResult | null;
  capture?: RectangleCapture | null;
  templateReference?: TemplateReference | null;
  animationReference?: AnimationReference | null;
}): string {
  const sectionType =
    args.aiResult?.sectionType ?? args.capture?.detected.sectionType ?? "unknown";
  const layoutType =
    args.aiResult?.layoutType ?? args.capture?.detected.layoutType ?? "unknown";
  const currentLayoutProblem =
    args.aiResult?.currentLayoutProblem ||
    "The selected section needs stronger layout hierarchy and spacing.";
  const styleDirection = formatStyleDirection(args.capture);
  const detectedKeywords = args.aiResult?.detectedKeywords?.join(", ") || "unknown";
  const uiProblems = args.aiResult?.uiProblems?.join(", ") || currentLayoutProblem;
  const templateReference = args.templateReference
    ? `${args.templateReference.title} (${args.templateReference.url})`
    : "none";
  const animationReference = args.animationReference
    ? `${args.animationReference.title} (${args.animationReference.url})`
    : "none";

  return `You are working in a React + Next.js + Tailwind CSS project.
Refactor the selected UI section using this layout pattern:
${args.pattern.name}

Design Humanizer context:
Section type: ${sectionType}
Current layout: ${layoutType}
Current issue: ${currentLayoutProblem}
Detected keywords: ${detectedKeywords}
UI problems: ${uiProblems}
Selected layout pattern: ${args.pattern.name}
Selected template reference: ${templateReference}
Selected animation idea: ${animationReference}

Instructions:
1. Keep existing content, props, data mapping, links, API calls and business logic.
2. Do not remove any existing content.
3. Preserve the component API.
4. Improve visual hierarchy and spacing.
5. Use responsive Tailwind CSS.
6. Keep mobile layout clean and single-column when needed.
7. Add subtle hover states and accessible focus-visible states.
8. Do not add unnecessary dependencies.
9. Return the updated component code only.
10. Keep the same content. Change layout, hierarchy, spacing, and arrangement only.
11. Use the selected template/reference only as high-level inspiration.
12. Do not copy exact code, assets, text, logos, or branding from references.
13. Preserve card radius, background, shadow, and style direction where possible.
14. If animation is selected, add subtle accessible motion and respect prefers-reduced-motion.

Pattern direction:
${args.pattern.promptInstruction}

Reference direction:
${formatTemplateReference(args.templateReference)}

Animation direction:
${formatAnimationReference(args.animationReference)}

Tailwind hint:
${args.pattern.tailwindHint}

Visual style direction:
${styleDirection}`;
}

function formatTemplateReference(reference?: TemplateReference | null) {
  if (!reference) return "No external template reference selected.";

  return `Use ${reference.title} from ${reference.source} only as high-level visual inspiration.
Category: ${reference.category}
Tags: ${reference.tags.join(", ")}
Usage note: ${reference.usageNote}`;
}

function formatAnimationReference(reference?: AnimationReference | null) {
  if (!reference) return "No animation reference selected.";

  return `Use ${reference.title} from ${reference.source} as motion inspiration only.
Category: ${reference.category}
Tags: ${reference.tags.join(", ")}
Best for: ${reference.bestFor}
Avoid when: ${reference.avoidWhen}
Respect prefers-reduced-motion and avoid heavy motion.`;
}

function formatStyleDirection(capture?: RectangleCapture | null) {
  const styleTokens = capture?.styleTokens;

  if (styleTokens) {
    return `Preserve the existing visual style:
- Section background: ${styleTokens.section.background ?? "existing section background"}
- Text color: ${styleTokens.section.color ?? styleTokens.heading.color ?? "existing text color"}
- Muted text color: ${styleTokens.muted.color ?? styleTokens.body.color ?? "existing muted text color"}
- Card background: ${styleTokens.card.background ?? "existing card background"}
- Border: ${styleTokens.card.border ?? styleTokens.card.borderColor ?? "existing border treatment"}
- Border radius: ${styleTokens.card.borderRadius ?? "existing radius"}
- Shadow: ${styleTokens.card.boxShadow ?? "existing shadow treatment"}
- Button background: ${styleTokens.button.background ?? "existing button background"}
- Button radius: ${styleTokens.button.borderRadius ?? "existing button radius"}
- Font family: ${styleTokens.section.fontFamily ?? styleTokens.heading.fontFamily ?? "existing font family"}

Use these as style direction, not as forced values if they conflict with the project's design system. Do not paste extracted CSS wholesale; preserve the visual language through the existing component and design tokens.`;
  }

  const styleContext = capture?.styleContext;

  if (!styleContext) {
    return "Preserve the existing visual style from the component and design system.";
  }

  return `Preserve the current visual style using these as direction, not exact forced values if they conflict with the existing design system:
- Theme: ${styleContext.theme}
- Background: ${styleContext.section.backgroundColor ?? "existing section background"}
- Card background: ${styleContext.card.backgroundColor ?? "existing card background"}
- Text color: ${styleContext.text.headingColor ?? styleContext.section.color ?? "existing text color"}
- Muted text color: ${styleContext.text.mutedColor ?? styleContext.text.bodyColor ?? "existing muted text color"}
- Accent color: ${styleContext.accent.color ?? styleContext.accent.backgroundColor ?? "existing accent color"}
- Border radius: ${styleContext.card.borderRadius ?? styleContext.section.borderRadius ?? "existing radius"}
- Shadow: ${styleContext.card.boxShadow ?? "existing shadow treatment"}`;
}
