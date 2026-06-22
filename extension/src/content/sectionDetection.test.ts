// Fixture tests for local section identification.
// Run with: npx tsx extension/src/content/sectionDetection.test.ts
import assert from "node:assert/strict";
import type { ElementCounts, MatchedElement } from "../shared/types";
import { detectSectionAndLayout, estimateCards } from "./sectionDetection";

const tests: Array<[string, () => void]> = [];
const test = (name: string, fn: () => void) => tests.push([name, fn]);

test("semantic h1 and button classify as hero", () => {
  const elements = [
    el("h1", "Build better products faster", rect(48, 120, 560, 88), { fontSize: "64px", fontWeight: "800" }),
    el("p", "A simple platform for teams to ship, learn, and iterate.", rect(52, 230, 480, 56), { fontSize: "18px" }),
    el("button", "Get started", rect(52, 312, 144, 48), { className: "primary-button" }),
    el("img", "", rect(700, 110, 420, 320), { className: "product-preview" })
  ];

  const result = detectSectionAndLayout(elements, counts(elements));

  assert.equal(result.sectionType, "hero");
  assert.equal(result.layoutType, "two_column");
});

test("non-semantic SlopPilot-like hero classifies as hero", () => {
  const elements = [
    el("div", "SlopPilot", rect(48, 34, 140, 36), { className: "brand" }),
    el("div", "Noise", rect(612, 38, 72, 34), { className: "nav-link" }),
    el("div", "Templates", rect(720, 38, 120, 34), { className: "nav-link" }),
    el("div", "Pricing", rect(862, 38, 90, 34), { className: "nav-link" }),
    el("div", "Start slopping", rect(1350, 36, 168, 54), { className: "button cta" }),
    el("div", "Generate the internet nobody asked for.", rect(48, 186, 610, 420), {
      className: "headline hero-title",
      fontSize: "96px",
      fontWeight: "900"
    }),
    el("div", "One click turns vague intent into infinite posts, pitches, recaps, and monetized fog.", rect(52, 782, 720, 62), {
      className: "subtitle",
      fontSize: "24px"
    }),
    el("div", "Start slopping", rect(52, 900, 210, 56), { className: "button primary-cta" }),
    el("div", "Watch demo", rect(280, 900, 190, 56), { className: "button secondary-cta" }),
    el("svg", "", rect(860, 250, 650, 560), { className: "hero orb visual illustration" })
  ];

  const result = detectSectionAndLayout(elements, counts(elements));

  assert.equal(result.sectionType, "hero");
  assert.equal(result.layoutType, "two_column");
  assert.ok(result.confidence >= 0.85);
  assert.ok(result.reasons.some((reason) => reason.includes("hero-off-grid-visual")));
});

test("hero with decorative SVG visual still classifies as hero", () => {
  const elements = [
    el("div", "Launch campaigns in minutes", rect(80, 120, 520, 78), {
      className: "headline",
      fontSize: "56px",
      fontWeight: "800"
    }),
    el("p", "Plan, preview, and publish every launch asset from one workspace.", rect(82, 214, 460, 52), {
      fontSize: "18px"
    }),
    el("a", "Try it free", rect(82, 300, 128, 44), { className: "cta" }),
    el("svg", "", rect(660, 92, 420, 360), { className: "hero-visual abstract-orb" })
  ];

  const result = detectSectionAndLayout(elements, counts(elements));

  assert.equal(result.sectionType, "hero");
  assert.equal(result.layoutType, "two_column");
});

test("metric text inside hero does not override hero", () => {
  const elements = [
    el("div", "Generate better briefs instantly", rect(48, 120, 560, 84), {
      fontSize: "58px",
      fontWeight: "850"
    }),
    el("p", "Turn rough notes into useful marketing drafts without rewriting from scratch.", rect(52, 224, 500, 56), {
      fontSize: "18px"
    }),
    el("button", "Start now", rect(52, 304, 128, 44)),
    el("div", "82% plausible", rect(780, 180, 180, 74), { className: "proof-card" }),
    el("svg", "", rect(720, 270, 420, 320), { className: "hero-visual" })
  ];

  const result = detectSectionAndLayout(elements, counts(elements));

  assert.equal(result.sectionType, "hero");
  assert.notEqual(result.sectionType, "stats");
});

test("nav-only block classifies as navigation", () => {
  const elements = [
    el("a", "Product", rect(120, 24, 88, 36), { className: "nav-link" }),
    el("a", "Pricing", rect(232, 24, 76, 36), { className: "nav-link" }),
    el("a", "Docs", rect(330, 24, 58, 36), { className: "nav-link" }),
    el("a", "Login", rect(420, 24, 64, 36), { className: "nav-link" })
  ];

  const result = detectSectionAndLayout(elements, counts(elements));

  assert.equal(result.sectionType, "navigation");
});

test("short CTA-only block classifies as cta", () => {
  const elements = [
    el("p", "Ready to publish?", rect(80, 60, 220, 28), { fontSize: "20px", fontWeight: "600" }),
    el("div", "Start now", rect(80, 108, 120, 44), { className: "button primary" }),
    el("div", "Contact sales", rect(216, 108, 140, 44), { className: "button secondary" })
  ];

  const result = detectSectionAndLayout(elements, counts(elements));

  assert.equal(result.sectionType, "cta");
});

function counts(elements: MatchedElement[]): ElementCounts {
  return {
    totalElements: elements.length,
    headings: elements.filter((element) => /^h[1-6]$/.test(element.tagName)).length,
    buttons: elements.filter((element) => element.tagName === "button" || element.role === "button").length,
    links: elements.filter((element) => element.tagName === "a").length,
    images: elements.filter((element) => element.tagName === "img").length,
    svgs: elements.filter((element) => element.tagName === "svg").length,
    inputs: elements.filter((element) => ["input", "textarea", "select"].includes(element.tagName)).length,
    cardsEstimate: estimateCards(elements),
    textLength: elements.reduce((sum, element) => sum + element.text.length, 0)
  };
}

function el(
  tagName: string,
  text: string,
  elementRect: MatchedElement["rect"],
  options: Partial<MatchedElement> & { fontSize?: string; fontWeight?: string } = {}
): MatchedElement {
  return {
    tagName,
    id: options.id ?? null,
    className: options.className ?? null,
    role: options.role ?? null,
    ariaLabel: options.ariaLabel ?? null,
    text,
    rect: elementRect,
    style: {
      display: "block",
      position: "static",
      backgroundColor: "rgba(255, 255, 255, 0)",
      color: "rgb(17, 17, 17)",
      fontSize: options.fontSize ?? "16px",
      fontWeight: options.fontWeight ?? "400",
      borderColor: "rgba(0, 0, 0, 0)",
      borderRadius: "8px",
      boxShadow: "none",
      padding: "0px",
      margin: "0px",
      ...options.style
    }
  };
}

function rect(
  left: number,
  top: number,
  width: number,
  height: number
): MatchedElement["rect"] {
  return {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height
  };
}

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
