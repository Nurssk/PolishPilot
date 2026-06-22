// Fixture tests for the layout pattern registry.
// Run with: npx tsx extension/src/patterns/layoutPatterns.test.ts
import assert from "node:assert/strict";
import {
  layoutPatternIds,
  layoutPatterns,
  patternCategories
} from "./layoutPatterns";

const tests: Array<[string, () => void]> = [];
const test = (name: string, fn: () => void) => tests.push([name, fn]);

test("declares the expected v1 layout count", () => {
  assert.equal(layoutPatternIds.length, 74);
  assert.equal(layoutPatterns.length, 74);
});

test("every declared layout id appears exactly once", () => {
  const declaredIds = new Set(layoutPatternIds);
  const registryIds = layoutPatterns.map((pattern) => pattern.id);
  const registryIdCounts = new Map<string, number>();

  for (const id of registryIds) {
    registryIdCounts.set(id, (registryIdCounts.get(id) ?? 0) + 1);
  }

  assert.equal(declaredIds.size, layoutPatternIds.length, "layoutPatternIds has duplicates");

  for (const id of layoutPatternIds) {
    assert.equal(registryIdCounts.get(id), 1, `${id} should appear once`);
  }

  for (const id of registryIds) {
    assert.ok(declaredIds.has(id), `${id} must be listed in layoutPatternIds`);
  }
});

test("every layout has required metadata", () => {
  for (const pattern of layoutPatterns) {
    assert.ok(pattern.name.trim(), `${pattern.id} missing name`);
    assert.ok(pattern.category.trim(), `${pattern.id} missing category`);
    assert.ok(pattern.inspirationTags.length, `${pattern.id} missing inspiration tags`);
    assert.ok(pattern.keywords.length, `${pattern.id} missing keywords`);
    assert.ok(pattern.solvesProblems.length, `${pattern.id} missing solved problems`);
    assert.ok(pattern.designIntents.length, `${pattern.id} missing design intents`);
    assert.ok(pattern.problemSolved.length, `${pattern.id} missing problemSolved`);
    assert.ok(pattern.bestFor.trim(), `${pattern.id} missing bestFor`);
    assert.ok(pattern.avoidWhen.trim(), `${pattern.id} missing avoidWhen`);
    assert.ok(pattern.requiredElements.length, `${pattern.id} missing required elements`);
    assert.ok(pattern.tailwindHint.trim(), `${pattern.id} missing tailwindHint`);
    assert.ok(pattern.promptInstruction.trim(), `${pattern.id} missing promptInstruction`);
    assert.ok(pattern.exampleStructure.trim(), `${pattern.id} missing exampleStructure`);
  }
});

test("every layoutPreviewType points to a valid layout id", () => {
  const validIds = new Set(layoutPatternIds);

  for (const pattern of layoutPatterns) {
    assert.ok(
      validIds.has(pattern.layoutPreviewType),
      `${pattern.id} has invalid layoutPreviewType ${pattern.layoutPreviewType}`
    );
  }
});

test("every declared category has at least one layout", () => {
  const categoriesWithLayouts = new Set(layoutPatterns.map((pattern) => pattern.category));

  for (const category of patternCategories) {
    assert.ok(categoriesWithLayouts.has(category), `${category} has no layouts`);
  }
});

let failed = 0;

for (const [name, fn] of tests) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}`);
    console.error(error);
  }
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${tests.length} tests passed.`);
