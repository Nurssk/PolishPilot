// Fixture tests for object inventory extraction.
// Run with: npx tsx extension/src/analysis/buildObjectInventory.test.ts
import assert from "node:assert/strict";
import { buildCaptureObjectInventory, buildObjectInventory } from "./buildObjectInventory";
import type { MatchedElement, SourceSectionPart } from "../shared/types";

const elements: MatchedElement[] = [
  element("h2", "Choose your plan", {
    fontSize: "36px",
    fontWeight: "800",
    width: 620,
    height: 52,
    className: "pricing-title"
  }),
  element("article", "Starter $19 month Basic features", {
    width: 280,
    height: 340,
    className: "plan-card rounded-3xl"
  }),
  element("article", "Pro $49 month Unlimited credits", {
    width: 282,
    height: 342,
    className: "plan-card rounded-3xl"
  }),
  element("article", "Enterprise Custom seats", {
    width: 281,
    height: 341,
    className: "plan-card rounded-3xl"
  }),
  element("button", "Start trial", {
    width: 140,
    height: 44,
    className: "primary-button"
  }),
  element("p", "Trusted by 10k teams", {
    width: 260,
    height: 24,
    className: "metric-copy"
  })
];

const inventory = buildObjectInventory(elements);

assert.equal(inventory.summary.headings, 1);
assert.equal(inventory.summary.actions, 1);
assert.ok(inventory.summary.cards >= 3, `cards=${inventory.summary.cards}`);
assert.ok(inventory.summary.metrics >= 1, `metrics=${inventory.summary.metrics}`);
assert.ok(inventory.summary.priceTokens >= 3, inventory.priceTokens.join(", "));
assert.equal(inventory.repeatedGroups.some((group) => group.type === "card"), true);
assert.equal(inventory.primaryHeading, "Choose your plan");

const sourceOnlyInventory = buildCaptureObjectInventory({
  matchedElements: [],
  counts: counts(0),
  selectedSourceSection: sourceSection()
});

assert.equal(sourceOnlyInventory.primaryHeading, "Pricing that scales");
assert.ok(sourceOnlyInventory.summary.cards >= 3, `cards=${sourceOnlyInventory.summary.cards}`);
assert.ok(sourceOnlyInventory.summary.actions >= 1, `actions=${sourceOnlyInventory.summary.actions}`);
assert.ok(sourceOnlyInventory.summary.priceTokens >= 2, sourceOnlyInventory.priceTokens.join(", "));
assert.ok(sourceOnlyInventory.repeatedGroups.some((group) => group.type === "card"));

console.log("PASS buildObjectInventory extracts element and source-section object inventory.");

function element(
  tagName: string,
  text: string,
  options: {
    className?: string;
    fontSize?: string;
    fontWeight?: string;
    width?: number;
    height?: number;
  } = {}
): MatchedElement {
  return {
    tagName,
    id: null,
    className: options.className ?? null,
    role: null,
    ariaLabel: null,
    text,
    rect: {
      x: 0,
      y: 0,
      width: options.width ?? 120,
      height: options.height ?? 40,
      top: 0,
      left: 0,
      right: options.width ?? 120,
      bottom: options.height ?? 40
    },
    style: {
      display: "block",
      position: "static",
      backgroundColor: "rgb(255, 255, 255)",
      color: "rgb(17, 24, 39)",
      fontSize: options.fontSize ?? "16px",
      fontWeight: options.fontWeight ?? "500",
      borderColor: "rgb(229, 231, 235)",
      borderRadius: "24px",
      boxShadow: "none",
      padding: "24px",
      margin: "0px"
    }
  };
}

function sourceSection(): SourceSectionPart {
  return {
    domPath: "section#pricing",
    tagName: "section",
    id: "pricing",
    className: "pricing-section",
    role: null,
    ariaLabel: null,
    textSummary: "Pricing that scales Starter $19 per month Pro $49 per month Enterprise Custom plan",
    childElementCount: 4,
    rect: {
      x: 0,
      y: 0,
      width: 960,
      height: 520,
      top: 0,
      left: 0,
      right: 960,
      bottom: 520
    },
    selectionOverlap: 1,
    counts: counts(3),
    headingSnippets: ["Pricing that scales"],
    ctaSnippets: ["Start trial", "Contact sales"],
    mediaSnippets: [],
    htmlPreview: "<section id=\"pricing\"><h2>Pricing that scales</h2></section>",
    sectionType: "pricing",
    layoutType: "equal_grid",
    confidence: 0.9,
    score: 80,
    reasons: ["source fixture"]
  };
}

function counts(cardsEstimate: number) {
  return {
    totalElements: cardsEstimate ? 9 : 0,
    headings: cardsEstimate ? 1 : 0,
    buttons: cardsEstimate ? 2 : 0,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate,
    textLength: cardsEstimate ? 92 : 0
  };
}
