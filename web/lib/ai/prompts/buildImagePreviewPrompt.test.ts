// Run with: npx tsx web/lib/ai/prompts/buildImagePreviewPrompt.test.ts
import assert from "node:assert/strict";
import {
  buildImagePreviewPrompt,
  buildImagePreviewSolutionPrompt,
  type GenerateAIPreviewRequest
} from "./buildImagePreviewPrompt";

const request: GenerateAIPreviewRequest = {
  screenshotBase64: "base64",
  title: "Preview test",
  aiResult: {
    sectionType: "features",
    layoutType: "equal_grid",
    designerDescription: "Feature cards need hierarchy.",
    currentLayoutProblem: "Cards are equal and copy is dense.",
    detectedBlocks: [
      {
        type: "card",
        count: 3,
        description: "Feature cards"
      }
    ]
  },
  selectedPattern: {
    id: "bento-grid",
    name: "Bento grid",
    description: "Mixed-size cards",
    promptInstruction: "Use a bento grid with one dominant card."
  },
  selectedTemplateReference: {
    title: "Reference template",
    source: "watermelon-ui",
    url: "https://example.com/template",
    category: "features",
    tags: ["features", "bento"],
    usageNote: "Use composition only."
  },
  selectedAnimationReference: {
    title: "Reference animation",
    source: "motion-primitives",
    url: "https://example.com/motion",
    category: "card",
    tags: ["hover"],
    bestFor: "Card feedback",
    avoidWhen: "Dense tables"
  },
  recommendationContext: {
    designChecks: Array.from({ length: 12 }, (_, index) => ({
      index: index + 1,
      ruleId: `rule-${index + 1}`,
      title: `Design check ${index + 1}`,
      category: "layout",
      severity: "medium",
      recommendation: `Apply recommendation ${index + 1}`,
      betterDirection: `Better direction ${index + 1}`,
      evidence: `Evidence ${index + 1}`
    })),
    layoutIdeas: [
      {
        index: 1,
        id: "bento-grid",
        name: "Bento grid",
        category: "features",
        instruction: "Make one card dominant.",
        solves: ["cards_too_equal"]
      }
    ],
    templateReferences: [
      {
        index: 1,
        id: "template-1",
        title: "Template idea",
        source: "watermelon-ui",
        category: "features",
        tags: ["feature"],
        description: "Feature layout reference",
        usageNote: "Do not copy assets."
      }
    ],
    animationReferences: [
      {
        index: 1,
        id: "animation-1",
        title: "Animation idea",
        source: "motion-primitives",
        category: "card",
        tags: ["hover"],
        bestFor: "Card hover feedback",
        avoidWhen: "Dense UI"
      }
    ]
  },
  previewContent: {
    sectionTitle: "How it works",
    items: [
      {
        title: "Define your needs",
        description: "Long copy should become easier to scan."
      }
    ]
  },
  uncodixify: {
    recommendations: Array.from(
      { length: 12 },
      (_, index) => `Design check ${index + 1}: Apply recommendation ${index + 1}`
    )
  },
  previewSolution: {
    summary: "Make one feature dominant and tighten copy.",
    priorityFixes: ["Feature the most important card", "Shorten body copy"],
    visualDirection: "Use stronger hierarchy and cleaner spacing.",
    layoutDirection: "Use one dominant card with two supporting cards.",
    copyDirection: "Shorten generic copy without changing meaning.",
    textEdits: [
      {
        original: "Long copy should become easier to scan.",
        revised: "Make each step easy to scan.",
        reason: "text-heavy-block"
      }
    ],
    imagePromptNotes: ["Show the revised text in the preview."]
  }
};

const prompt = buildImagePreviewPrompt(request);

assert.match(prompt, /Full recommendation context to account for:/);
assert.match(prompt, /Humanizer recommendations Gemini must satisfy:/);
assert.match(prompt, /Fast Gemini solution brief:/);
assert.match(prompt, /Make one feature dominant and tighten copy\./);
assert.match(prompt, /"Long copy should become easier to scan\." -> "Make each step easy to scan\."/);
assert.match(prompt, /There are 12 required Humanizer recommendations\. Apply all 12\./);
assert.match(
  prompt,
  /Selected layout pattern:\nName: Bento grid/
);
assert.match(prompt, /Role: supporting structure after satisfying the Humanizer checklist\./);
assert.match(prompt, /Design-check recommendations \(12; account for all\):/);
assert.match(prompt, /Template\/source references \(1; use as high-level inspiration only\):/);
assert.match(prompt, /Animation references \(1; represent as static visual direction\):/);
assert.match(prompt, /Reference template/);
assert.match(prompt, /Reference animation/);
assert.match(
  prompt,
  /1\. Apply every Humanizer recommendation listed above; do not optimize only for the selected layout\./
);
assert.match(
  prompt,
  /2\. If the checklist contains 12 recommendations, all 12 must influence the generated preview\./
);
assert.match(
  prompt,
  /3\. If the Fast Gemini solution brief is present, use it as the implementation plan for visual fixes and text edits\./
);
assert.match(
  prompt,
  /4\. Text may change when the recommendations mention copywriting, text-heavy content, weak hierarchy, unclear CTA, generic\/AI-slop phrasing, punctuation tells, or humanization\./
);
assert.doesNotMatch(prompt, /Do not rewrite text\./);
assert.match(prompt, /25\. Account for every item in the full recommendation context/);

for (let index = 1; index <= 12; index += 1) {
  assert.match(prompt, new RegExp(`Design check ${index}`));
  assert.match(prompt, new RegExp(`Apply recommendation ${index}`));
  assert.match(prompt, new RegExp(`Better direction ${index}`));
}

const noLayoutPrompt = buildImagePreviewPrompt({
  ...request,
  selectedPattern: undefined,
  recommendationContext: {
    designChecks: [
      {
        index: 1,
        ruleId: "text-heavy-block",
        title: "Text-heavy block",
        category: "copywriting",
        severity: "medium",
        recommendation: "Reduce dense copy and make it sound more human.",
        betterDirection: "Shorter, specific copy that preserves the same meaning.",
        evidence: "The paragraph is long and generic."
      }
    ]
  }
});

assert.match(noLayoutPrompt, /Selected layout pattern:\nNone selected\./);
assert.match(noLayoutPrompt, /Use the Humanizer recommendations as the primary direction/);
assert.match(noLayoutPrompt, /Reduce dense copy and make it sound more human/);

const solutionPrompt = buildImagePreviewSolutionPrompt(request);

assert.match(solutionPrompt, /fast planning Gemini/);
assert.match(solutionPrompt, /Return JSON only/);
assert.match(solutionPrompt, /textEdits/);
assert.match(solutionPrompt, /Long copy should become easier to scan/);
assert.match(solutionPrompt, /Keep language, product meaning, names, numbers, prices, dates, and factual claims/);

console.log("PASS buildImagePreviewPrompt includes all recommendation context and solution prepass.");
