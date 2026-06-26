// Fixture tests for local layout pattern selection.
// Run with: npx tsx extension/src/patterns/selectPatterns.test.ts
import assert from "node:assert/strict";
import { selectPatterns } from "./selectPatterns";

const tests: Array<[string, () => void]> = [];
const test = (name: string, fn: () => void) => tests.push([name, fn]);

test("unknown section does not fall back to hero recommendations", () => {
  const patterns = selectPatterns({
    sectionType: "unknown",
    layoutType: "unknown"
  });

  assert.ok(patterns.length > 0);
  assert.ok(
    patterns.every((pattern) => pattern.category !== "hero" && !pattern.id.includes("hero")),
    `unexpected hero patterns: ${patterns.map((pattern) => pattern.id).join(", ")}`
  );
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
