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
