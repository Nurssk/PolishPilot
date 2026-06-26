// Fixture tests for server-side Gemini result enrichment.
// Run with: npx tsx web/app/api/analyze-area/route.enrichment.test.ts
import assert from "node:assert/strict";
import { enrichResultFromSourceContext, type AIUnderstandingResult } from "./route";

const tests: Array<[string, () => void]> = [];
const test = (name: string, fn: () => void) => tests.push([name, fn]);

test("pricing credits inventory upgrades sparse unknown Gemini result", () => {
  const result = enrichResultFromSourceContext(baseAIResult(), {
    objectInventory: pricingCreditsInventory()
  });

  assert.equal(result.sectionType, "pricing");
  assert.equal(result.layoutType, "pricing_columns");
  assert.equal(result.contentType, "pricing_plans");
  assert.equal(result.designIntent, "conversion");
  assert.ok(result.confidence >= 0.62, `confidence=${result.confidence}`);
  assert.ok(!result.uiProblems.includes("unknown"), result.uiProblems.join(", "));
  assert.ok(result.uiProblems.includes("cards_too_equal"), result.uiProblems.join(", "));
  assert.ok(result.recommendedCategories.layoutCategories.includes("pricing"));
  assert.ok(!result.recommendedCategories.layoutCategories.includes("unknown"));
  assert.ok(result.recommendedCategories.animationCategories.includes("card"));
  assert.ok(result.recommendedCategories.animationCategories.includes("button"));
  assert.ok(!result.recommendedCategories.animationCategories.includes("other"));
  assert.ok(result.animationKeywords.includes("plan-emphasis"), result.animationKeywords.join(", "));
  assert.ok(result.uncodixify.detectedRuleIds.includes("pricing-plan-weak-emphasis"));

  const blockTypes = result.detectedBlocks.map((block) => block.type);
  assert.ok(blockTypes.includes("heading"), blockTypes.join(", "));
  assert.ok(blockTypes.includes("card"), blockTypes.join(", "));
  assert.ok(blockTypes.includes("button"), blockTypes.join(", "));
  assert.ok(blockTypes.includes("price"), blockTypes.join(", "));
  assert.ok(!blockTypes.includes("unknown"), blockTypes.join(", "));
});

test("workflow card inventory does not turn into hero", () => {
  const result = enrichResultFromSourceContext(baseAIResult(), {
    objectInventory: workflowCardsInventory()
  });

  assert.equal(result.sectionType, "features");
  assert.equal(result.layoutType, "equal_grid");
  assert.equal(result.contentType, "cards");
  assert.equal(result.designIntent, "explanation");
  assert.ok(result.uiProblems.includes("cards_too_equal"), result.uiProblems.join(", "));
  assert.ok(result.uiProblems.includes("no_visual_rhythm"), result.uiProblems.join(", "));
  assert.ok(result.uncodixify.detectedRuleIds.includes("repetitive-equal-cards"));
  assert.ok(result.uncodixify.detectedRuleIds.includes("monotonous-section-rhythm"));
  assert.ok(!result.recommendedCategories.layoutCategories.includes("hero"));
});

test("coming-soon pill inventory adds announcement-bubble rule", () => {
  const result = enrichResultFromSourceContext(baseAIResult(), {
    objectInventory: announcementBubbleInventory()
  });

  assert.ok(
    result.uncodixify.detectedRuleIds.includes("decorative-announcement-bubble"),
    result.uncodixify.detectedRuleIds.join(", ")
  );
  assert.ok(
    result.uncodixify.topRecommendations.some((item) => /announcement bubble|status badge/i.test(item)),
    result.uncodixify.topRecommendations.join(" | ")
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

function baseAIResult(): AIUnderstandingResult {
  return {
    sectionType: "unknown",
    layoutType: "unknown",
    contentType: "unknown",
    confidence: 0.2,
    detectedBlocks: [{ type: "unknown", count: 0, description: "" }],
    detectedKeywords: [],
    designIntent: "unknown",
    uiProblems: ["unknown"],
    recommendedCategories: {
      layoutCategories: ["unknown"],
      templateCategories: ["unknown"],
      animationCategories: ["other"]
    },
    animationKeywords: [],
    designerDescription: "",
    currentLayoutProblem: "",
    reasoning: [],
    uncodixify: {
      summary: "",
      detectedRuleIds: [],
      visualEvidence: [],
      topRecommendations: []
    }
  };
}

function pricingCreditsInventory() {
  return {
    summary: {
      totalElements: 12,
      headings: 1,
      actions: 3,
      cards: 3,
      inputs: 0,
      media: 0,
      metrics: 0,
      priceTokens: 4,
      testimonials: 0,
      navItems: 0,
      longTextBlocks: 0
    },
    primaryHeading: "Buy more credits",
    headings: ["Buy more credits"],
    actions: [
      inventoryItem("Buy credits", "button"),
      inventoryItem("Upgrade plan", "button"),
      inventoryItem("Contact sales", "button")
    ],
    cards: [
      inventoryItem("Starter 100 credits $19", "article"),
      inventoryItem("Pro 500 credits $49", "article"),
      inventoryItem("Scale 2000 credits $149", "article")
    ],
    inputs: [],
    media: [],
    metrics: [],
    priceTokens: ["$19", "$49", "$149", "credits"],
    testimonials: [],
    navItems: [],
    longTextBlocks: [],
    repeatedGroups: [
      {
        type: "card",
        count: 3,
        averageWidth: 280,
        averageHeight: 340,
        similarSize: true
      }
    ],
    styleSignals: {
      largeRadiusCount: 3,
      pillCount: 0,
      shadowCount: 1,
      glowCount: 0,
      filledSurfaceCount: 3
    },
    layoutSignals: {
      boundsWidth: 960,
      boundsHeight: 520,
      density: "balanced",
      columnsEstimate: 3,
      rowsEstimate: 1
    },
    keywords: ["pricing", "credits", "plans"]
  };
}

function workflowCardsInventory() {
  return {
    summary: {
      totalElements: 8,
      headings: 1,
      actions: 0,
      cards: 3,
      inputs: 0,
      media: 2,
      metrics: 0,
      priceTokens: 0,
      testimonials: 0,
      navItems: 0,
      longTextBlocks: 0
    },
    primaryHeading: "How Alter Works",
    headings: ["How Alter Works"],
    actions: [],
    cards: [
      inventoryItem("Define your needs", "article"),
      inventoryItem("AI Generation", "article"),
      inventoryItem("Publish & Schedule", "article")
    ],
    inputs: [],
    media: [inventoryItem("workflow preview", "img"), inventoryItem("calendar preview", "img")],
    metrics: [],
    priceTokens: [],
    testimonials: [],
    navItems: [],
    longTextBlocks: [],
    repeatedGroups: [
      {
        type: "card",
        count: 3,
        averageWidth: 280,
        averageHeight: 440,
        similarSize: true
      }
    ],
    styleSignals: {
      largeRadiusCount: 3,
      pillCount: 0,
      shadowCount: 0,
      glowCount: 0,
      filledSurfaceCount: 3
    },
    layoutSignals: {
      boundsWidth: 1100,
      boundsHeight: 640,
      density: "balanced",
      columnsEstimate: 3,
      rowsEstimate: 1
    },
    keywords: ["workflow", "steps", "features", "publish", "schedule"]
  };
}

function announcementBubbleInventory() {
  return {
    summary: {
      totalElements: 1,
      headings: 0,
      actions: 0,
      cards: 0,
      inputs: 0,
      media: 0,
      metrics: 0,
      priceTokens: 0,
      testimonials: 0,
      navItems: 0,
      longTextBlocks: 0
    },
    primaryHeading: "",
    headings: [],
    actions: [],
    cards: [],
    inputs: [],
    media: [],
    metrics: [],
    priceTokens: [],
    testimonials: [],
    navItems: [],
    longTextBlocks: [],
    repeatedGroups: [],
    styleSignals: {
      largeRadiusCount: 1,
      pillCount: 1,
      shadowCount: 0,
      glowCount: 0,
      filledSurfaceCount: 1
    },
    layoutSignals: {
      boundsWidth: 290,
      boundsHeight: 68,
      density: "sparse",
      columnsEstimate: 1,
      rowsEstimate: 1
    },
    keywords: ["Скоро в Астане", "soon-bubble"]
  };
}

function inventoryItem(label: string, tagName: string) {
  return {
    label,
    tagName,
    role: tagName === "button" ? "button" : null,
    className: null,
    width: 280,
    height: tagName === "button" ? 44 : 320,
    top: 0,
    left: 0
  };
}
