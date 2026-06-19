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
  selectedPattern: {
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

  const uncodixifyBlock = formatUncodixifyRecommendations(
    input.uncodixify?.recommendations
  );

  return `You are Design Humanizer, a senior UI/UX designer.
You are given a screenshot of a selected UI section from the user's own website/app.
Create a visual preview image of the SAME section redesigned using the selected layout pattern.
This is a visual preview only, not implementation code.

Source:
- The input image is the selected section from the user's own website/app.
- Output only the redesigned selected section, not a browser page, not a full website.
- Keep the aspect ratio close to the selected screenshot.

Selected layout pattern:
Name: ${empty(input.selectedPattern.name)}
Description: ${empty(input.selectedPattern.description ?? input.selectedPattern.bestFor)}
Structure: ${empty(input.selectedPattern.exampleStructure)}
Instruction: ${empty(input.selectedPattern.promptInstruction)}
Layout hint: ${empty(input.selectedPattern.tailwindHint)}

Selected template reference:
${formatTemplateReference(input.selectedTemplateReference)}

Selected animation reference:
${formatAnimationReference(input.selectedAnimationReference)}

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
1. Preserve all visible text exactly where possible.
2. Do not translate text.
3. Do not rewrite text.
4. Do not invent a different product.
5. Do not add logos, watermarks, or external brand assets.
6. Do not copy any external website.
7. Header stays header.
8. Subtitle stays subtitle.
9. Text outside cards stays outside cards.
10. Cards stay cards.
11. Do not add extra cards.
12. Do not remove existing cards.
13. If icons exist, use simple safe placeholder icons.
14. Preserve the original visual style as much as possible.
15. Only change card layout, hierarchy, spacing, and size/emphasis according to the selected pattern.
16. Do not generate implementation code.
17. Do not include browser chrome, controls, explanations, labels, or before/after annotations.
18. Use selected references only as high-level inspiration.
19. Do not copy external assets, code, text, logos, or branding.
20. If an animation is selected, represent it only as static visual direction in this image preview.
${uncodixifyBlock}
Create one polished visual mockup image of the redesigned selected section.`;
}

function formatUncodixifyRecommendations(recommendations: string[] | undefined) {
  const cleaned = Array.isArray(recommendations)
    ? recommendations.map((item) => item.trim()).filter(Boolean)
    : [];

  if (!cleaned.length) return "";

  return `
Improve this UI according to these Uncodixify recommendations:
${cleaned.map((item) => `- ${item}`).join("\n")}
- avoid generic AI SaaS composition;
- preserve all visible text exactly.
`;
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
