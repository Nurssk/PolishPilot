export type AIPreviewSolutionBrief = {
  summary?: string;
  visualDirection?: string;
  layoutDirection?: string;
  copyDirection?: string;
  priorityFixes?: string[];
  textEdits?: Array<{
    original?: string;
    revised?: string;
    reason?: string;
  }>;
  imagePromptNotes?: string[];
};

export type GenerateAIPreviewRequest = {
  screenshotBase64: string;
  url?: string;
  title?: string;
  aiResult?: {
    sectionType?: string;
    layoutType?: string;
    designerDescription?: string;
    currentLayoutProblem?: string;
    detectedBlocks?: Array<{
      type: string;
      count: number;
      description: string;
    }>;
  };
  selectedPattern?: {
    id: string;
    name: string;
    description?: string;
    bestFor?: string;
    tailwindHint?: string;
    promptInstruction?: string;
    exampleStructure?: string;
  };
  selectedTemplateReference?: {
    title: string;
    source: string;
    url: string;
    category: string;
    tags?: string[];
    usageNote?: string;
  } | null;
  selectedAnimationReference?: {
    title: string;
    source: string;
    url: string;
    category: string;
    tags?: string[];
    bestFor?: string;
    avoidWhen?: string;
    usageNote?: string;
  } | null;
  recommendationContext?: {
    designChecks?: Array<{
      index?: number;
      ruleId?: string;
      title?: string;
      category?: string;
      severity?: string;
      recommendation?: string;
      betterDirection?: string;
      evidence?: string;
    }>;
    layoutIdeas?: Array<{
      index?: number;
      id?: string;
      name?: string;
      category?: string;
      instruction?: string;
      solves?: string[];
    }>;
    templateReferences?: Array<{
      index?: number;
      id?: string;
      title?: string;
      source?: string;
      category?: string;
      tags?: string[];
      description?: string;
      usageNote?: string;
    }>;
    animationReferences?: Array<{
      index?: number;
      id?: string;
      title?: string;
      source?: string;
      category?: string;
      tags?: string[];
      bestFor?: string;
      avoidWhen?: string;
    }>;
  };
  previewContent?: {
    sectionEyebrow?: string;
    sectionTitle?: string;
    sectionSubtitle?: string;
    outsideText?: string[];
    items?: Array<{
      title: string;
      description?: string;
      eyebrow?: string;
      cta?: string;
      meta?: string;
      value?: string;
      rawText?: string;
      icon?: {
        exists: boolean;
        type?: string;
        color?: string;
        position?: string;
      };
    }>;
  };
  styleContext?: {
    theme?: "light" | "dark";
    section?: Record<string, string | undefined>;
    card?: Record<string, string | undefined>;
    text?: Record<string, string | undefined>;
    accent?: Record<string, string | undefined>;
    button?: Record<string, string | undefined>;
  };
  templateMode?: "text-only" | "schematic-image" | "both";
  templateImageBase64?: string;
  uncodixify?: {
    recommendations?: string[];
  };
  previewSolution?: AIPreviewSolutionBrief;
};

export function buildImagePreviewPrompt(input: GenerateAIPreviewRequest): string {
  const content = input.previewContent;
  const style = input.styleContext;
  const items = content?.items?.length
    ? content.items
        .map(
          (item, index) =>
            `${index + 1}. Title: ${empty(item.title)}\n   Description: ${empty(
              item.description
            )}\n   Eyebrow: ${empty(item.eyebrow)}\n   CTA: ${empty(
              item.cta
            )}\n   Value/meta: ${empty(item.value ?? item.meta)}\n   Icon: ${
              item.icon?.exists
                ? `placeholder, type=${empty(item.icon.type)}, position=${empty(
                    item.icon.position
                  )}, color=${empty(item.icon.color)}`
                : "none"
            }`
        )
        .join("\n")
    : "No structured card items were extracted. Preserve visible screenshot content.";

  const humanizerChecklistBlock = formatRequiredHumanizerChecklist(
    input.recommendationContext?.designChecks,
    input.uncodixify?.recommendations
  );

  return `You are Design Humanizer, a senior UI/UX designer.
You are given a screenshot of a selected UI section from the user's own website/app.
Create a visual preview image of the SAME section redesigned using the Humanizer recommendations and the optional selected layout pattern.
This is a visual preview only, not implementation code.

Source:
- The input image is the selected section from the user's own website/app.
- Output only the redesigned selected section, not a browser page, not a full website.
- Keep the aspect ratio close to the selected screenshot.

Humanizer recommendations Gemini must satisfy:
${humanizerChecklistBlock}

Fast Gemini solution brief:
${formatPreviewSolution(input.previewSolution)}

Selected layout pattern:
${formatSelectedPattern(input.selectedPattern)}

Selected template reference:
${formatTemplateReference(input.selectedTemplateReference)}

Selected animation reference:
${formatAnimationReference(input.selectedAnimationReference)}

Full recommendation context to account for:
${formatRecommendationContext(input.recommendationContext)}

Current UI understanding:
Section type: ${empty(input.aiResult?.sectionType)}
Current layout: ${empty(input.aiResult?.layoutType)}
Designer description: ${empty(input.aiResult?.designerDescription)}
Current layout problem: ${empty(input.aiResult?.currentLayoutProblem)}
Detected blocks:
${formatDetectedBlocks(input.aiResult?.detectedBlocks)}

Extracted content:
Section eyebrow: ${empty(content?.sectionEyebrow)}
Section title: ${empty(content?.sectionTitle)}
Section subtitle: ${empty(content?.sectionSubtitle)}
Outside text:
${formatList(content?.outsideText)}
Card/items:
${items}

Extracted style context:
Theme: ${empty(style?.theme)}
Section background: ${empty(style?.section?.backgroundColor)}
Section color: ${empty(style?.section?.color)}
Section font family: ${empty(style?.section?.fontFamily)}
Card background: ${empty(style?.card?.backgroundColor)}
Card border radius: ${empty(style?.card?.borderRadius)}
Card border color: ${empty(style?.card?.borderColor)}
Card shadow: ${empty(style?.card?.boxShadow)}
Card padding: ${empty(style?.card?.padding)}
Heading color: ${empty(style?.text?.headingColor)}
Body color: ${empty(style?.text?.bodyColor)}
Muted color: ${empty(style?.text?.mutedColor)}
Accent color: ${empty(style?.accent?.color ?? style?.accent?.backgroundColor)}

Strict rules:
1. Apply every Humanizer recommendation listed above; do not optimize only for the selected layout.
2. If the checklist contains 12 recommendations, all 12 must influence the generated preview.
3. If the Fast Gemini solution brief is present, use it as the implementation plan for visual fixes and text edits.
4. Text may change when the recommendations mention copywriting, text-heavy content, weak hierarchy, unclear CTA, generic/AI-slop phrasing, punctuation tells, or humanization.
5. When changing text, preserve the original language, product meaning, names, numbers, prices, dates, and factual claims.
6. Rewrite text to be shorter, more specific, and more human only where it improves the recommendation outcome.
7. If a layout/template/animation idea conflicts with a Humanizer recommendation, satisfy the Humanizer recommendation first.
8. Do not invent a different product.
9. Do not add logos, watermarks, or external brand assets.
10. Do not copy any external website.
11. Header stays header.
12. Subtitle stays subtitle.
13. Text outside cards stays outside cards.
14. Cards stay cards.
15. Do not add extra cards.
16. Do not remove existing cards.
17. If icons exist, use simple safe placeholder icons.
18. Preserve the original visual style as much as possible.
19. Change layout, hierarchy, spacing, size, emphasis, motion cues, copy, and polish where needed to satisfy the Humanizer recommendations.
20. Do not generate implementation code.
21. Do not include browser chrome, controls, explanations, labels, or before/after annotations.
22. Use selected references only as high-level inspiration.
23. Do not copy external assets, code, text, logos, or branding.
24. If an animation is selected, represent it only as static visual direction in this image preview.
25. Account for every item in the full recommendation context. Preserve screenshot content and meaning first, then satisfy all Humanizer/design-check recommendations, then use layout/template/animation ideas as supporting direction.
Create one polished visual mockup image of the redesigned selected section.`;
}

export function buildImagePreviewSolutionPrompt(input: GenerateAIPreviewRequest): string {
  const content = input.previewContent;
  const itemLines = content?.items?.length
    ? content.items
        .slice(0, 12)
        .map(
          (item, index) =>
            `${index + 1}. ${empty(item.title)} — ${empty(
              item.description ?? item.rawText
            )} CTA: ${empty(item.cta)}`
        )
        .join("\n")
    : "No structured items. Read the screenshot text directly.";
  const checklist = formatRequiredHumanizerChecklist(
    input.recommendationContext?.designChecks,
    input.uncodixify?.recommendations
  );

  return `You are the fast planning Gemini for Design Humanizer.
Analyze the screenshot and this structured context. Do not generate an image.
Return JSON only. Build a concrete solution brief that the slower image-preview Gemini can follow.

Required Humanizer recommendations:
${checklist}

Visible/extracted text:
Section eyebrow: ${empty(content?.sectionEyebrow)}
Section title: ${empty(content?.sectionTitle)}
Section subtitle: ${empty(content?.sectionSubtitle)}
Outside text: ${formatInlineList(content?.outsideText)}
Items:
${itemLines}

Current UI understanding:
Section type: ${empty(input.aiResult?.sectionType)}
Current layout: ${empty(input.aiResult?.layoutType)}
Designer description: ${empty(input.aiResult?.designerDescription)}
Current layout problem: ${empty(input.aiResult?.currentLayoutProblem)}

Optional selected layout:
${formatSelectedPattern(input.selectedPattern)}

Return exactly:
{
  "summary": "one short sentence describing the solution",
  "priorityFixes": ["3-6 concrete fixes, ordered by impact"],
  "visualDirection": "specific visual changes for hierarchy, spacing, radii, color, cards, buttons, panels",
  "layoutDirection": "how to arrange the same content; say keep current structure if no major layout change is needed",
  "copyDirection": "how text should change, or say preserve text if no copy change is needed",
  "textEdits": [
    { "original": "exact visible text if changing it", "revised": "humanized replacement in the same language", "reason": "which recommendation it satisfies" }
  ],
  "imagePromptNotes": ["short instructions the image model must obey"]
}

Rules:
- Use the screenshot as truth for visible text and hierarchy.
- Base the solution on the recommendations, not generic redesign advice.
- Keep language, product meaning, names, numbers, prices, dates, and factual claims.
- If the original text is Russian, keep revised text Russian. If English, keep English.
- Humanize text only when recommendations indicate copywriting, text-heavy, unclear CTA, generic AI phrasing, or weak hierarchy.
- Do not invent new cards, products, testimonials, prices, logos, or brand assets.
- Keep textEdits to at most 8 entries.`;
}

function formatSelectedPattern(pattern: GenerateAIPreviewRequest["selectedPattern"]) {
  if (!pattern) {
    return `None selected.
Use the Humanizer recommendations as the primary direction. Improve the current structure only as much as needed to show the fixes clearly.`;
  }

  return `Name: ${empty(pattern.name)}
Description: ${empty(pattern.description ?? pattern.bestFor)}
Structure: ${empty(pattern.exampleStructure)}
Instruction: ${empty(pattern.promptInstruction)}
Layout hint: ${empty(pattern.tailwindHint)}
Role: supporting structure after satisfying the Humanizer checklist.`;
}

function formatRequiredHumanizerChecklist(
  designChecks: GenerateAIPreviewRequest["recommendationContext"] extends infer Context
    ? Context extends { designChecks?: infer Checks }
      ? Checks | undefined
      : never
    : never,
  fallbackRecommendations: string[] | undefined
) {
  const checks = Array.isArray(designChecks) ? designChecks.filter(Boolean) : [];

  if (checks.length) {
    return `There are ${checks.length} required Humanizer recommendations. Apply all ${checks.length}.
${checks
  .map(
    (item, index) =>
      `${item.index ?? index + 1}. ${empty(item.title)} [${empty(item.category)} / ${empty(
        item.severity
      )}]
   Must fix: ${empty(item.recommendation)}
   Humanized direction: ${empty(item.betterDirection)}
   Evidence: ${empty(item.evidence)}`
  )
  .join("\n")}`;
  }

  const cleaned = Array.isArray(fallbackRecommendations)
    ? fallbackRecommendations.map((item) => item.trim()).filter(Boolean)
    : [];

  if (cleaned.length) {
    return `There are ${cleaned.length} required Humanizer recommendations. Apply all ${cleaned.length}.
${cleaned.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
  }

  return "No Humanizer recommendations were provided. Use the screenshot conservatively and make only obvious clarity improvements.";
}

function formatPreviewSolution(solution: AIPreviewSolutionBrief | undefined) {
  if (!solution) {
    return "No prepass solution was available. Infer fixes from the Humanizer recommendations.";
  }

  const textEdits = Array.isArray(solution.textEdits)
    ? solution.textEdits
        .slice(0, 8)
        .map(
          (edit, index) =>
            `${index + 1}. "${empty(edit.original)}" -> "${empty(edit.revised)}" (${empty(
              edit.reason
            )})`
        )
        .join("\n")
    : "none";

  return `Summary: ${empty(solution.summary)}
Priority fixes:
${formatList(solution.priorityFixes)}
Visual direction: ${empty(solution.visualDirection)}
Layout direction: ${empty(solution.layoutDirection)}
Copy direction: ${empty(solution.copyDirection)}
Text edits:
${textEdits}
Image prompt notes:
${formatList(solution.imagePromptNotes)}`;
}

function formatRecommendationContext(
  context: GenerateAIPreviewRequest["recommendationContext"]
) {
  if (!context) return "none";

  const sections = [
    formatDesignChecks(context.designChecks),
    formatLayoutIdeas(context.layoutIdeas),
    formatTemplateIdeas(context.templateReferences),
    formatAnimationIdeas(context.animationReferences)
  ].filter(Boolean);

  return sections.length ? sections.join("\n\n") : "none";
}

function formatDesignChecks(
  items: NonNullable<GenerateAIPreviewRequest["recommendationContext"]>["designChecks"]
) {
  const cleaned = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!cleaned.length) return "";

  return `Design-check recommendations (${cleaned.length}; account for all):
${cleaned
  .map(
    (item, index) =>
      `${item.index ?? index + 1}. ${empty(item.title)} [${empty(item.category)} / ${empty(
        item.severity
      )}]
   Recommendation: ${empty(item.recommendation)}
   Better direction: ${empty(item.betterDirection)}
   Evidence: ${empty(item.evidence)}`
  )
  .join("\n")}`;
}

function formatLayoutIdeas(
  items: NonNullable<GenerateAIPreviewRequest["recommendationContext"]>["layoutIdeas"]
) {
  const cleaned = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!cleaned.length) return "";

  return `Layout ideas (${cleaned.length}; use as optional structure, not as a replacement for recommendation fixes):
${cleaned
  .map(
    (item, index) =>
      `${item.index ?? index + 1}. ${empty(item.name)} (${empty(item.id)}, ${empty(
        item.category
      )})
   Instruction: ${empty(item.instruction)}
   Solves: ${formatInlineList(item.solves)}`
  )
  .join("\n")}`;
}

function formatTemplateIdeas(
  items: NonNullable<GenerateAIPreviewRequest["recommendationContext"]>["templateReferences"]
) {
  const cleaned = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!cleaned.length) return "";

  return `Template/source references (${cleaned.length}; use as high-level inspiration only):
${cleaned
  .map(
    (item, index) =>
      `${item.index ?? index + 1}. ${empty(item.title)} (${empty(item.source)} / ${empty(
        item.category
      )})
   Tags: ${formatInlineList(item.tags)}
   Description: ${empty(item.description)}
   Usage note: ${empty(item.usageNote)}`
  )
  .join("\n")}`;
}

function formatAnimationIdeas(
  items: NonNullable<GenerateAIPreviewRequest["recommendationContext"]>["animationReferences"]
) {
  const cleaned = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!cleaned.length) return "";

  return `Animation references (${cleaned.length}; represent as static visual direction):
${cleaned
  .map(
    (item, index) =>
      `${item.index ?? index + 1}. ${empty(item.title)} (${empty(item.source)} / ${empty(
        item.category
      )})
   Tags: ${formatInlineList(item.tags)}
   Best for: ${empty(item.bestFor)}
   Avoid when: ${empty(item.avoidWhen)}`
  )
  .join("\n")}`;
}

function formatTemplateReference(reference: GenerateAIPreviewRequest["selectedTemplateReference"]) {
  if (!reference) return "None selected.";

  return `Title: ${empty(reference.title)}
Source: ${empty(reference.source)}
URL: ${empty(reference.url)}
Category: ${empty(reference.category)}
Tags: ${formatList(reference.tags)}
Usage note: ${empty(reference.usageNote)}`;
}

function formatAnimationReference(reference: GenerateAIPreviewRequest["selectedAnimationReference"]) {
  if (!reference) return "None selected.";

  return `Title: ${empty(reference.title)}
Source: ${empty(reference.source)}
URL: ${empty(reference.url)}
Category: ${empty(reference.category)}
Tags: ${formatList(reference.tags)}
Best for: ${empty(reference.bestFor)}
Avoid when: ${empty(reference.avoidWhen)}
Usage note: ${empty(reference.usageNote)}`;
}

function empty(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "none";
}

function formatList(values: string[] | undefined) {
  return values?.length
    ? values.map((value, index) => `${index + 1}. ${value}`).join("\n")
    : "none";
}

function formatInlineList(values: string[] | undefined) {
  return values?.length ? values.join(", ") : "none";
}

function formatDetectedBlocks(
  blocks: GenerateAIPreviewRequest["aiResult"] extends infer Result
    ? Result extends { detectedBlocks?: infer Blocks }
      ? Blocks | undefined
      : never
    : never
) {
  return Array.isArray(blocks) && blocks.length
    ? blocks
        .slice(0, 12)
        .map(
          (block) =>
            `- ${block.type}: ${block.count} (${block.description || "no description"})`
        )
        .join("\n")
    : "none";
}
