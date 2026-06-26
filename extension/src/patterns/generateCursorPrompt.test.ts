// Fixture tests for generateCursorPrompt + validateGeneratedPrompt.
//
// Run with:  npx tsx extension/src/patterns/generateCursorPrompt.test.ts
//
// This file is excluded from tsconfig (it uses Node globals) and is run via tsx,
// which transpiles without type-checking. It is not part of the extension build.

import assert from "node:assert/strict";
import { generateCursorPrompt } from "./generateCursorPrompt";
import { validateGeneratedPrompt } from "./validateGeneratedPrompt";
import type { LayoutPattern } from "./layoutPatterns";
import type { AIUnderstandingResult, RectangleCapture } from "../shared/types";
import type {
  UncodixifyAnalysisResult,
  UncodixifyFinding
} from "../analysis/uncodixifyTypes";

function finding(over: Partial<UncodixifyFinding>): UncodixifyFinding {
  return {
    ruleId: over.ruleId ?? "oversized-radius",
    category: over.category ?? "radius",
    title: over.title ?? "Oversized rounded corners",
    severity: over.severity ?? "medium",
    evidence: over.evidence ?? ["7 elements use radius >= 20px."],
    recommendation: over.recommendation ?? "Reduce excessive radius and keep it consistent.",
    betterDirection: over.betterDirection ?? "Usually 8-12px unless the design system uses larger.",
    confidence: over.confidence ?? 0.8,
    sources: over.sources ?? ["local"],
    whyItFeelsAI: over.whyItFeelsAI ?? "Large radius fakes polish instead of hierarchy."
  };
}

function analysis(findings: UncodixifyFinding[]): UncodixifyAnalysisResult {
  const score = Math.max(0, 100 - findings.length * 10);
  return {
    score,
    aiLikeScore: 100 - score,
    summary: "test",
    findings,
    topFixes: findings.map((f) => f.recommendation),
    promptInstructions: [],
    scoreBreakdown: []
  };
}

function promptCapture(): RectangleCapture {
  return {
    captureId: "prompt-capture",
    url: "https://example.test",
    title: "Example",
    selectedRect: {
      x: 0,
      y: 0,
      width: 900,
      height: 600,
      top: 0,
      left: 0,
      right: 900,
      bottom: 600,
      devicePixelRatio: 1,
      scrollX: 0,
      scrollY: 0,
      viewportWidth: 900,
      viewportHeight: 600
    },
    screenshotBase64: "",
    matchedElements: [
      promptElement("h2", "Pricing that scales", "pricing-title", 36, 800, 620, 52),
      promptElement("article", "Starter $19 month", "plan-card", 16, 600, 280, 340),
      promptElement("article", "Pro $49 month", "plan-card", 16, 600, 280, 340),
      promptElement("article", "Enterprise custom plan", "plan-card", 16, 600, 280, 340),
      promptElement("button", "Start trial", "primary-button", 15, 700, 140, 44)
    ],
    counts: {
      totalElements: 5,
      headings: 1,
      buttons: 1,
      links: 0,
      images: 0,
      svgs: 0,
      inputs: 0,
      cardsEstimate: 3,
      textLength: 84
    },
    detected: {
      sectionType: "pricing",
      layoutType: "equal_grid",
      confidence: 0.8,
      reasons: ["test fixture"]
    }
  };
}

function promptElement(
  tagName: string,
  text: string,
  className: string,
  fontSize: number,
  fontWeight: number,
  width: number,
  height: number
): RectangleCapture["matchedElements"][number] {
  return {
    tagName,
    id: null,
    className,
    role: tagName === "button" ? "button" : null,
    ariaLabel: null,
    text,
    rect: {
      x: 0,
      y: 0,
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height
    },
    style: {
      display: "block",
      position: "static",
      backgroundColor: "rgb(255, 255, 255)",
      color: "rgb(17, 24, 39)",
      fontSize: `${fontSize}px`,
      fontWeight: String(fontWeight),
      borderColor: "rgb(229, 231, 235)",
      borderRadius: "24px",
      boxShadow: "none",
      padding: "24px",
      margin: "0px"
    }
  };
}

function aiResult(overrides: Partial<AIUnderstandingResult>): AIUnderstandingResult {
  return {
    sectionType: "unknown",
    layoutType: "unknown",
    contentType: "unknown",
    confidence: 0.5,
    detectedBlocks: [],
    detectedKeywords: [],
    designIntent: "unknown",
    uiProblems: [],
    recommendedCategories: {
      layoutCategories: [],
      templateCategories: [],
      animationCategories: []
    },
    animationKeywords: [],
    designerDescription: "",
    currentLayoutProblem: "",
    reasoning: [],
    ...overrides
  };
}

const pattern = {
  id: "feature-bento",
  name: "Bento feature grid",
  promptInstruction: "Arrange features into a bento layout with one dominant cell.",
  tailwindHint: "grid grid-cols-3 gap-4",
  bestFor: "features",
  problemSolved: ["flat layout"]
} as unknown as LayoutPattern;

const tests: Array<[string, () => void]> = [];
const test = (name: string, fn: () => void) => tests.push([name, fn]);

// 1. No design direction selected + findings exist.
test("no design selected + findings", () => {
  const result = analysis([
    finding({ ruleId: "oversized-radius", title: "Oversized rounded corners" }),
    finding({ ruleId: "glow-heavy-ui", title: "Glow-heavy UI", category: "shadow" }),
    finding({ ruleId: "weak-hierarchy", title: "Weak hierarchy", category: "typography" })
  ]);
  const prompt = generateCursorPrompt({
    designDirectionSelected: false,
    uncodixify: result,
    includedUncodixifyRuleIds: result.findings.map((f) => f.ruleId)
  });

  for (const heading of [
    "# Role",
    "# Context",
    "# Task",
    "# Detected Issues",
    "# Implementation Plan",
    "# Style Preservation Rules",
    "# Constraints",
    "# Expected Output",
    "# Self-check"
  ]) {
    assert.ok(prompt.includes(heading), `missing ${heading}`);
  }
  assert.match(prompt, /Do not change the core visual style/);
  assert.match(prompt, /Oversized rounded corners/);
  assert.match(prompt, /Glow-heavy UI/);
  assert.match(prompt, /Weak hierarchy/);
  assert.match(prompt, /composition or component structure/);
  assert.match(prompt, /visible UI change/);
  assert.match(prompt, /Strengthen hierarchy/);
  assert.doesNotMatch(prompt, /Selected design direction \(inspiration only\)/);

  const v = validateGeneratedPrompt(prompt, {
    hasFindings: true,
    designDirectionSelected: false
  });
  assert.equal(v.ok, true, `expected valid, got: ${v.errors.join("; ")}`);
});

// 2. Design direction selected.
test("design direction selected", () => {
  const result = analysis([finding({ ruleId: "oversized-radius" })]);
  const prompt = generateCursorPrompt({
    designDirectionSelected: true,
    pattern,
    uncodixify: result,
    includedUncodixifyRuleIds: ["oversized-radius"]
  });

  assert.match(prompt, /layout inspiration only/);
  assert.match(prompt, /Do not copy external assets, brands, logos, or exact code/);
  assert.match(prompt, /Preserve the product's existing visual identity/);
  assert.match(prompt, /Selected design direction \(inspiration only\)/);

  const v = validateGeneratedPrompt(prompt, {
    hasFindings: true,
    designDirectionSelected: true
  });
  assert.equal(v.ok, true, `expected valid, got: ${v.errors.join("; ")}`);
});

// 3. No findings.
test("no findings", () => {
  const prompt = generateCursorPrompt({
    designDirectionSelected: false,
    uncodixify: analysis([]),
    includedUncodixifyRuleIds: []
  });

  assert.match(prompt, /looks human-designed/);
  assert.match(prompt, /minor cleanup/i);
  assert.match(prompt, /Do not invent issues/);
});

// 4. Recommendation evidence appears in the prompt.
test("recommendation with evidence", () => {
  const result = analysis([finding({ evidence: ["7 elements use radius >= 20px."] })]);
  const prompt = generateCursorPrompt({
    designDirectionSelected: false,
    uncodixify: result,
    includedUncodixifyRuleIds: ["oversized-radius"]
  });

  assert.match(prompt, /7 elements use radius >= 20px\./);
});

// 4b. Object inventory appears in the prompt.
test("object inventory appears in prompt context", () => {
  const result = analysis([
    finding({ ruleId: "repetitive-equal-cards", title: "Repetitive equal cards" })
  ]);
  const prompt = generateCursorPrompt({
    capture: promptCapture(),
    designDirectionSelected: false,
    uncodixify: result,
    includedUncodixifyRuleIds: ["repetitive-equal-cards"]
  });

  assert.match(prompt, /Detected object inventory/);
  assert.match(prompt, /3 cards/);
  assert.match(prompt, /Start trial/);
  assert.match(prompt, /Pricing tokens/);
});

// 4c. Pricing prompts should request structural pricing changes, not cosmetic-only edits.
test("pricing prompt includes pricing-specific structural plan", () => {
  const result = analysis([
    finding({ ruleId: "repetitive-equal-cards", title: "Repetitive equal plan cards" }),
    finding({ ruleId: "weak-primary-action", title: "Weak pricing CTA", category: "buttons" })
  ]);
  const prompt = generateCursorPrompt({
    aiResult: aiResult({ sectionType: "pricing", layoutType: "pricing_columns" }),
    capture: promptCapture(),
    designDirectionSelected: false,
    uncodixify: result,
    includedUncodixifyRuleIds: ["repetitive-equal-cards", "weak-primary-action"]
  });

  assert.match(prompt, /plan comparison/);
  assert.match(prompt, /recommended plan visually dominant/);
  assert.match(prompt, /align price, benefits, and CTA rows/);
  assert.match(prompt, /Rework the block structure, not just styles/);
  assert.doesNotMatch(prompt, /hero supporting copy/i);
});

test("formulaic copy finding changes prompt instructions", () => {
  const result = analysis([
    finding({
      ruleId: "formulaic-ai-copy",
      category: "copywriting",
      title: "Formulaic AI copy patterns",
      evidence: ["Formulaic AI-writing copy pattern detected: throat-clearing opener."],
      recommendation:
        "Replace formulaic phrasing with direct, product-specific copy.",
      betterDirection: "Plain product copy: specific noun, specific action, concrete outcome.",
      whyItFeelsAI:
        "The copy announces insight instead of saying the specific product value."
    })
  ]);
  const prompt = generateCursorPrompt({
    aiResult: aiResult({ sectionType: "features", layoutType: "vertical_stack" }),
    capture: promptCapture(),
    designDirectionSelected: false,
    uncodixify: result,
    includedUncodixifyRuleIds: ["formulaic-ai-copy"]
  });

  assert.match(prompt, /Formulaic AI copy patterns/);
  assert.match(prompt, /direct, product-specific copy/);
  assert.match(prompt, /specific noun, specific action, concrete outcome/);
  assert.match(prompt, /Reduce scan friction/);
  assert.doesNotMatch(prompt, /hero supporting copy/i);
});

test("redrawn chrome finding changes prompt instructions", () => {
  const result = analysis([
    finding({
      ruleId: "redrawn-ui-chrome",
      category: "layout",
      title: "Re-drawn UI chrome",
      evidence: ["Source/classes suggest fake browser, device, or code-window chrome."],
      recommendation:
        "Remove fake chrome. Show the real product view, a real screenshot with a simple hairline border, or a plain content panel.",
      betterDirection: "Product content carries the preview; browser/device chrome is real or absent.",
      whyItFeelsAI:
        "Generated UI often redraws operating-system/browser chrome as decoration."
    })
  ]);
  const prompt = generateCursorPrompt({
    aiResult: aiResult({ sectionType: "features", layoutType: "vertical_stack" }),
    capture: promptCapture(),
    designDirectionSelected: false,
    uncodixify: result,
    includedUncodixifyRuleIds: ["redrawn-ui-chrome"]
  });

  assert.match(prompt, /Re-drawn UI chrome/);
  assert.match(prompt, /Remove fake chrome/);
  assert.match(prompt, /Product content carries the preview/);
  assert.match(prompt, /Rework the block structure, not just styles|visible UI change/);
});

// 5. Prompt safety.
test("no base64 / api keys", () => {
  const result = analysis([finding({})]);
  const prompt = generateCursorPrompt({
    designDirectionSelected: false,
    uncodixify: result,
    includedUncodixifyRuleIds: ["oversized-radius"]
  });

  assert.doesNotMatch(prompt, /base64/i);
  assert.doesNotMatch(prompt, /[A-Za-z0-9+/=]{400,}/);
  assert.doesNotMatch(prompt, /AIza[0-9A-Za-z_-]{20,}/);
});

// 6. Validator: valid / missing sections / unsafe base64.
test("validator behavior", () => {
  const result = analysis([finding({})]);
  const validPrompt = generateCursorPrompt({
    designDirectionSelected: false,
    uncodixify: result,
    includedUncodixifyRuleIds: ["oversized-radius"]
  });
  assert.equal(validateGeneratedPrompt(validPrompt).ok, true);

  const missing = validateGeneratedPrompt("# Task\nDo something.");
  assert.equal(missing.ok, false);
  assert.ok(missing.errors.some((e) => /Role/.test(e)));

  const unsafe = validPrompt + "\n\n" + "A".repeat(500);
  const unsafeResult = validateGeneratedPrompt(unsafe);
  assert.equal(unsafeResult.ok, false);
  assert.ok(unsafeResult.errors.some((e) => /base64|binary/i.test(e)));
});

let failed = 0;
for (const [name, fn] of tests) {
  try {
    fn();
    console.log(`PASS  ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${name}`);
    console.error(error instanceof Error ? error.message : String(error));
  }
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${tests.length} tests passed.`);
