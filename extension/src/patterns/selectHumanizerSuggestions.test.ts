// Fixture tests for humanizer recommendation selection.
// Run with: npx tsx extension/src/patterns/selectHumanizerSuggestions.test.ts
import assert from "node:assert/strict";
import type { AIUnderstandingResult } from "../shared/types";
import { selectHumanizerSuggestions } from "./selectHumanizerSuggestions";
import { animationReferences } from "./animationReferences";
import { templateReferences } from "./templateReferences";

const tests: Array<[string, () => void]> = [];
const test = (name: string, fn: () => void) => tests.push([name, fn]);

test("unknown section suppresses hero recommendations even with hero keywords", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "unknown",
      detectedKeywords: ["hero", "headline", "product-preview"],
      recommendedCategories: {
        layoutCategories: ["unknown"],
        templateCategories: ["unknown"],
        animationCategories: ["other"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 4,
      animations: 4
    }
  });

  assert.ok(suggestions.layoutPatterns.length > 0);
  assert.ok(
    suggestions.layoutPatterns.every((pattern) => pattern.category !== "hero" && !pattern.id.includes("hero")),
    `unexpected hero layouts: ${suggestions.layoutPatterns.map((pattern) => pattern.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.every((reference) => reference.category !== "hero"),
    `unexpected hero templates: ${suggestions.templateReferences.map((reference) => reference.id).join(", ")}`
  );
  assert.ok(
    suggestions.animationReferences.every(
      (reference) =>
        !reference.relatedSectionTypes.includes("hero") &&
        !reference.relatedPatternIds.some((id) => id.includes("hero"))
    ),
    `unexpected hero animations: ${suggestions.animationReferences.map((reference) => reference.id).join(", ")}`
  );
});

test("watermelon references are available to pricing recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "pricing",
      layoutType: "pricing_columns",
      contentType: "pricing_plans",
      detectedKeywords: ["pricing", "plans", "credits", "cards"],
      uiProblems: ["cards_too_equal", "missing_microinteraction"],
      recommendedCategories: {
        layoutCategories: ["pricing"],
        templateCategories: ["pricing"],
        animationCategories: ["card", "button", "hover"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 8,
      animations: 8
    }
  });

  assert.ok(
    templateReferences.some(
      (reference) => reference.source === "watermelon-ui" && reference.category === "pricing"
    ),
    "expected Watermelon pricing templates in registry"
  );
  assert.ok(
    animationReferences.some((reference) => reference.source === "watermelon-ui"),
    "expected Watermelon animation refs in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "watermelon-ui"),
    `expected Watermelon template suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.animationReferences.some((reference) => reference.source === "watermelon-ui"),
    `expected Watermelon animation suggestion, got ${suggestions.animationReferences.map((item) => item.id).join(", ")}`
  );
});

test("typeui design skills are available to dashboard recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "dashboard",
      layoutType: "equal_grid",
      contentType: "dashboard_widgets",
      detectedKeywords: ["dashboard", "metrics", "data", "kpi"],
      uiProblems: ["cards_too_equal", "weak_hierarchy"],
      recommendedCategories: {
        layoutCategories: ["dashboard"],
        templateCategories: ["dashboard"],
        animationCategories: ["card", "hover"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 10,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some(
      (reference) => reference.source === "typeui-design-skills" && reference.category === "dashboard"
    ),
    "expected TypeUI dashboard design skills in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "typeui-design-skills"),
    `expected TypeUI design skill suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("huashu design references are available to anti-slop card recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "features",
      layoutType: "equal_grid",
      contentType: "feature_cards",
      detectedKeywords: ["features", "cards", "asymmetric", "anti-slop"],
      uiProblems: ["cards_too_equal", "no_visual_rhythm"],
      recommendedCategories: {
        layoutCategories: ["features"],
        templateCategories: ["features", "cards"],
        animationCategories: ["card", "hover"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 12,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some(
      (reference) => reference.source === "huashu-design" && reference.category === "features"
    ),
    "expected Huashu feature design references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "huashu-design"),
    `expected Huashu design reference suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("ui ux pro max references are available to accessibility/form recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "form",
      layoutType: "form_layout",
      contentType: "form",
      detectedKeywords: ["form", "input", "label", "touch-target", "aria-label", "accessibility"],
      uiProblems: ["cta_not_clear", "missing_microinteraction"],
      recommendedCategories: {
        layoutCategories: ["form"],
        templateCategories: ["forms", "buttons"],
        animationCategories: ["button", "loader"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 12,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some(
      (reference) => reference.source === "ui-ux-pro-max" && reference.category === "forms"
    ),
    "expected UI UX Pro Max form references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "ui-ux-pro-max"),
    `expected UI UX Pro Max reference suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("taste skill references are available to anti-generic layout recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "features",
      layoutType: "equal_grid",
      contentType: "cards",
      detectedKeywords: ["anti-slop", "centered-stack-default", "cards-too-equal", "asymmetric"],
      uiProblems: ["cards_too_equal", "no_visual_rhythm", "weak_hierarchy"],
      recommendedCategories: {
        layoutCategories: ["features", "cards"],
        templateCategories: ["features", "cards"],
        animationCategories: ["card", "hover"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 12,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some(
      (reference) => reference.source === "taste-skill" && reference.category === "features"
    ),
    "expected Taste Skill feature references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "taste-skill"),
    `expected Taste Skill reference suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("anti AI slop writing references are available to copywriting recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "features",
      layoutType: "vertical_stack",
      contentType: "text_block",
      detectedKeywords: ["copywriting", "ai-slop-phrase-tells", "ai-punctuation-tells", "specificity"],
      uiProblems: ["too_text_heavy"],
      recommendedCategories: {
        layoutCategories: ["features"],
        templateCategories: ["features", "unknown"],
        animationCategories: ["text"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 12,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some((reference) => reference.source === "anti-ai-slop-writing"),
    "expected anti-ai-slop-writing references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "anti-ai-slop-writing"),
    `expected anti-ai-slop-writing reference suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("repo-parsed design and anti-slop references are available to anti-template recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "features",
      layoutType: "equal_grid",
      contentType: "cards",
      detectedKeywords: [
        "hallmark",
        "icon-tile-feature-cards",
        "decorative-status-dots",
        "default-font-stack-template",
        "fake-charts",
        "copywriting"
      ],
      uiProblems: ["cards_too_equal", "weak_hierarchy", "missing_microinteraction"],
      recommendedCategories: {
        layoutCategories: ["features", "cards"],
        templateCategories: ["features", "cards"],
        animationCategories: ["card", "hover"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 16,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some((reference) => reference.source === "hallmark"),
    "expected Hallmark references in registry"
  );
  assert.ok(
    templateReferences.some((reference) => reference.source === "stop-slop"),
    "expected Stop Slop references in registry"
  );
  assert.ok(
    templateReferences.some((reference) => reference.source === "anti-ai-slop-pack"),
    "expected Anti-AI-Slop Pack references in registry"
  );
  assert.ok(
    templateReferences.some((reference) => reference.source === "interface-design"),
    "expected Interface Design references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "hallmark"),
    `expected Hallmark reference suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "anti-ai-slop-pack"),
    `expected Anti-AI-Slop Pack suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("motion primitives and animate ui references are available to animation recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "pricing",
      layoutType: "pricing_columns",
      contentType: "pricing_plans",
      detectedKeywords: [
        "animated-number",
        "credits",
        "pricing",
        "button",
        "reduced-motion",
        "motion-config",
        "tabs"
      ],
      uiProblems: ["cta_not_clear", "missing_microinteraction"],
      recommendedCategories: {
        layoutCategories: ["pricing"],
        templateCategories: ["pricing"],
        animationCategories: ["text", "button", "transition"]
      },
      animationKeywords: ["animated-number", "button", "tabs", "reduced-motion"]
    }),
    limit: {
      layouts: 4,
      templates: 8,
      animations: 12
    }
  });

  assert.ok(
    animationReferences.some((reference) => reference.source === "motion-primitives"),
    "expected Motion-Primitives references in registry"
  );
  assert.ok(
    animationReferences.some((reference) => reference.source === "animate-ui"),
    "expected Animate UI references in registry"
  );
  assert.ok(
    suggestions.animationReferences.some((reference) => reference.source === "motion-primitives"),
    `expected Motion-Primitives animation suggestion, got ${suggestions.animationReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.animationReferences.some((reference) => reference.source === "animate-ui"),
    `expected Animate UI animation suggestion, got ${suggestions.animationReferences.map((item) => item.id).join(", ")}`
  );
});

test("magic ui references are available to source-parsed layout and animation recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "features",
      layoutType: "equal_grid",
      contentType: "feature_cards",
      detectedKeywords: [
        "magic-ui",
        "bento-grid",
        "marquee",
        "animated-list",
        "animated-beam",
        "number-ticker",
        "feature-cards",
        "social-proof"
      ],
      uiProblems: ["cards_too_equal", "weak_hierarchy", "missing_microinteraction", "no_visual_rhythm"],
      recommendedCategories: {
        layoutCategories: ["features", "cards"],
        templateCategories: ["features", "testimonials"],
        animationCategories: ["card", "scroll", "list", "transition", "text"]
      },
      animationKeywords: ["magic-card", "marquee", "animated-list", "animated-beam", "number-ticker"]
    }),
    limit: {
      layouts: 4,
      templates: 20,
      animations: 20
    }
  });

  assert.ok(
    templateReferences.some((reference) => reference.source === "magic-ui"),
    "expected Magic UI template references in registry"
  );
  assert.ok(
    animationReferences.some((reference) => reference.source === "magic-ui"),
    "expected Magic UI animation references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "magic-ui"),
    `expected Magic UI template suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.animationReferences.some((reference) => reference.source === "magic-ui"),
    `expected Magic UI animation suggestion, got ${suggestions.animationReferences.map((item) => item.id).join(", ")}`
  );
});

test("aceternity ui references are available to source-parsed block and motion recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "features",
      layoutType: "equal_grid",
      contentType: "feature_cards",
      detectedKeywords: [
        "aceternity-ui",
        "feature-sections",
        "bento-grids",
        "cta-sections",
        "sticky-scroll-reveal",
        "tracing-beam",
        "focus-cards",
        "stateful-button",
        "compare"
      ],
      uiProblems: ["cards_too_equal", "weak_hierarchy", "missing_microinteraction", "no_visual_rhythm"],
      recommendedCategories: {
        layoutCategories: ["features", "cards"],
        templateCategories: ["features", "cards", "cta"],
        animationCategories: ["card", "scroll", "button", "image", "text"]
      },
      animationKeywords: [
        "card-hover-effect",
        "sticky-scroll-reveal",
        "tracing-beam",
        "stateful-button",
        "text-generate-effect"
      ]
    }),
    limit: {
      layouts: 4,
      templates: 24,
      animations: 24
    }
  });

  assert.ok(
    templateReferences.some((reference) => reference.source === "aceternity-ui"),
    "expected Aceternity UI template references in registry"
  );
  assert.ok(
    animationReferences.some((reference) => reference.source === "aceternity-ui"),
    "expected Aceternity UI animation references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "aceternity-ui"),
    `expected Aceternity UI template suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.animationReferences.some((reference) => reference.source === "aceternity-ui"),
    `expected Aceternity UI animation suggestion, got ${suggestions.animationReferences.map((item) => item.id).join(", ")}`
  );
});

test("motion guideline references are available to accessibility and choreography recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "dashboard",
      layoutType: "equal_grid",
      contentType: "table_and_cards",
      detectedKeywords: [
        "motion-guideline",
        "duration",
        "stagger",
        "sequence",
        "prefers-reduced-motion",
        "accessibility",
        "dashboard",
        "table",
        "cards"
      ],
      uiProblems: ["cards_too_equal", "missing_microinteraction", "no_visual_rhythm"],
      recommendedCategories: {
        layoutCategories: ["dashboard", "cards"],
        templateCategories: ["dashboard"],
        animationCategories: ["list", "transition", "button", "other"]
      },
      animationKeywords: [
        "stagger",
        "duration",
        "productive-motion",
        "prefers-reduced-motion",
        "spatial-consistency"
      ]
    }),
    limit: {
      layouts: 4,
      templates: 8,
      animations: 24
    }
  });

  assert.ok(
    animationReferences.some((reference) => reference.source === "carbon-motion"),
    "expected Carbon motion guideline references in registry"
  );
  assert.ok(
    animationReferences.some((reference) => reference.source === "material-motion"),
    "expected Material motion guideline references in registry"
  );
  assert.ok(
    animationReferences.some((reference) => reference.source === "apple-hig"),
    "expected Apple HIG motion guideline references in registry"
  );
  assert.ok(
    animationReferences.some((reference) => reference.source === "mdn-web-docs"),
    "expected MDN reduced-motion guideline reference in registry"
  );
  assert.ok(
    suggestions.animationReferences.some((reference) => reference.source === "carbon-motion"),
    `expected Carbon motion guideline suggestion, got ${suggestions.animationReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.animationReferences.some((reference) => reference.source === "mdn-web-docs"),
    `expected MDN reduced-motion guideline suggestion, got ${suggestions.animationReferences.map((item) => item.id).join(", ")}`
  );
});

test("nng ux guideline references are available to hierarchy scanning and form recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "form",
      layoutType: "form_layout",
      contentType: "text_heavy_form",
      detectedKeywords: [
        "layout-guideline",
        "visual-hierarchy",
        "weak-hierarchy",
        "text-scanning",
        "text-heavy",
        "single-column",
        "field-grouping",
        "form-layout",
        "labels"
      ],
      uiProblems: ["weak_hierarchy", "too_text_heavy", "spacing_issue"],
      recommendedCategories: {
        layoutCategories: ["form"],
        templateCategories: ["forms", "other"],
        animationCategories: ["button"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 20,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some((reference) => reference.source === "nng-ux-guidelines"),
    "expected NN/g UX guideline references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "nng-ux-guidelines"),
    `expected NN/g UX guideline suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("baymard ux guideline references are available to ecommerce layout recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "unknown",
      layoutType: "equal_grid",
      contentType: "ecommerce_checkout_product_list",
      detectedKeywords: [
        "baymard-ux",
        "layout-guideline",
        "ecommerce",
        "checkout",
        "cart",
        "payment",
        "product-list",
        "filters",
        "sorting",
        "marketplace",
        "product-card"
      ],
      uiProblems: ["cards_too_equal", "weak_hierarchy", "cta_not_clear"],
      recommendedCategories: {
        layoutCategories: ["unknown"],
        templateCategories: ["cards", "forms"],
        animationCategories: ["button", "card"]
      }
    }),
    limit: {
      layouts: 6,
      templates: 20,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some((reference) => reference.source === "baymard-ux"),
    "expected Baymard UX guideline references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "baymard-ux"),
    `expected Baymard UX guideline suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.every((reference) => reference.category !== "hero"),
    `unknown ecommerce case should not receive hero templates: ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("wai aria and wcag interaction references are available to keyboard accessibility recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "dashboard",
      layoutType: "unknown",
      contentType: "settings_tabs_modal_toolbar",
      detectedKeywords: [
        "interaction-guideline",
        "wai-aria-apg",
        "wcag-wai",
        "tabs",
        "tablist",
        "dialog",
        "modal",
        "keyboard-navigation",
        "focus-visible",
        "target-size",
        "touch-target",
        "24px"
      ],
      uiProblems: ["cta_not_clear", "missing_microinteraction"],
      recommendedCategories: {
        layoutCategories: ["dashboard", "navigation"],
        templateCategories: ["navigation", "buttons", "other"],
        animationCategories: ["button", "transition"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 24,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some((reference) => reference.source === "wai-aria-apg"),
    "expected WAI-ARIA APG interaction references in registry"
  );
  assert.ok(
    templateReferences.some((reference) => reference.source === "wcag-wai"),
    "expected WCAG WAI interaction references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "wai-aria-apg"),
    `expected WAI-ARIA APG suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "wcag-wai"),
    `expected WCAG WAI suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("govuk interaction references are available to validation and error recovery recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "form",
      layoutType: "form_layout",
      contentType: "validation_form",
      detectedKeywords: [
        "interaction-guideline",
        "govuk-design-system",
        "validation",
        "error-summary",
        "error-message",
        "form-errors",
        "field-errors",
        "recover",
        "plain-language"
      ],
      uiProblems: ["cta_not_clear", "too_text_heavy"],
      recommendedCategories: {
        layoutCategories: ["form"],
        templateCategories: ["forms"],
        animationCategories: ["button"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 20,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some((reference) => reference.source === "govuk-design-system"),
    "expected GOV.UK Design System interaction references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "govuk-design-system"),
    `expected GOV.UK Design System suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("visual system guideline references are available to color typography spacing and radius recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "dashboard",
      layoutType: "equal_grid",
      contentType: "dashboard_cards",
      detectedKeywords: [
        "visual-guideline",
        "material-design",
        "carbon-design-system",
        "apple-hig",
        "color-roles",
        "semantic-color",
        "type-scale",
        "typography",
        "shape-scale",
        "corner-radius",
        "color-tokens",
        "spacing-scale",
        "2x-grid",
        "dark-mode",
        "legibility"
      ],
      uiProblems: ["weak_hierarchy", "spacing_issue", "cards_too_equal"],
      recommendedCategories: {
        layoutCategories: ["dashboard", "cards"],
        templateCategories: ["dashboard", "cards", "other"],
        animationCategories: ["transition"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 32,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some((reference) => reference.source === "material-design"),
    "expected Material Design visual-system references in registry"
  );
  assert.ok(
    templateReferences.some((reference) => reference.source === "carbon-design-system"),
    "expected Carbon Design System visual references in registry"
  );
  assert.ok(
    templateReferences.some((reference) => reference.source === "apple-hig"),
    "expected Apple HIG visual references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "material-design"),
    `expected Material Design visual guideline suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "carbon-design-system"),
    `expected Carbon Design System visual suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "apple-hig"),
    `expected Apple HIG visual suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("data visualization guideline references are available to chart dashboard recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "dashboard",
      layoutType: "equal_grid",
      contentType: "analytics_dashboard_charts",
      detectedKeywords: [
        "data-viz-guideline",
        "data-visualization",
        "carbon-data-viz",
        "uswds",
        "chart-type",
        "chart-purpose",
        "chart-anatomy",
        "legend",
        "axis",
        "tooltip",
        "chart-accessibility",
        "glanceable",
        "fake-charts",
        "stats",
        "dashboard"
      ],
      uiProblems: ["weak_hierarchy", "cards_too_equal", "no_visual_rhythm"],
      recommendedCategories: {
        layoutCategories: ["dashboard", "stats"],
        templateCategories: ["dashboard", "other"],
        animationCategories: ["transition", "text"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 36,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some((reference) => reference.source === "carbon-data-viz"),
    "expected Carbon data visualization references in registry"
  );
  assert.ok(
    templateReferences.some(
      (reference) => reference.source === "material-design" && reference.tags.includes("data-viz-guideline")
    ),
    "expected Material data visualization references in registry"
  );
  assert.ok(
    templateReferences.some(
      (reference) => reference.source === "apple-hig" && reference.tags.includes("data-viz-guideline")
    ),
    "expected Apple data visualization references in registry"
  );
  assert.ok(
    templateReferences.some((reference) => reference.source === "uswds"),
    "expected USWDS data visualization references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "carbon-data-viz"),
    `expected Carbon data-viz suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some(
      (reference) => reference.source === "material-design" && reference.tags.includes("data-viz-guideline")
    ),
    `expected Material data-viz suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some(
      (reference) => reference.source === "apple-hig" && reference.tags.includes("data-viz-guideline")
    ),
    `expected Apple data-viz suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "uswds"),
    `expected USWDS data-viz suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("table guideline references are available to data table and list management recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "dashboard",
      layoutType: "unknown",
      contentType: "data_table_list_management",
      detectedKeywords: [
        "table-guideline",
        "carbon-table",
        "data-table",
        "sorting",
        "filtering",
        "pagination",
        "row-selection",
        "batch-actions",
        "sort-indicator",
        "interactive-table",
        "grid",
        "keyboard-navigation",
        "filter-chips",
        "default-sort",
        "empty-state",
        "no-results",
        "list-management"
      ],
      uiProblems: ["weak_hierarchy", "spacing_issue", "cta_not_clear"],
      recommendedCategories: {
        layoutCategories: ["dashboard"],
        templateCategories: ["dashboard", "navigation", "other"],
        animationCategories: ["transition", "button"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 40,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some((reference) => reference.source === "carbon-table"),
    "expected Carbon table references in registry"
  );
  assert.ok(
    templateReferences.some(
      (reference) => reference.source === "material-design" && reference.tags.includes("table-guideline")
    ),
    "expected Material table references in registry"
  );
  assert.ok(
    templateReferences.some(
      (reference) => reference.source === "wai-aria-apg" && reference.tags.includes("table-guideline")
    ),
    "expected WAI-ARIA table/grid references in registry"
  );
  assert.ok(
    templateReferences.some((reference) => reference.source === "ons-design-system"),
    "expected ONS empty-table references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "carbon-table"),
    `expected Carbon table suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some(
      (reference) => reference.source === "material-design" && reference.tags.includes("table-guideline")
    ),
    `expected Material table suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some(
      (reference) => reference.source === "wai-aria-apg" && reference.tags.includes("table-guideline")
    ),
    `expected WAI-ARIA table/grid suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "ons-design-system"),
    `expected ONS table empty-state suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

test("navigation guideline references are available to nav shell breadcrumb and menu recommendations", () => {
  const suggestions = selectHumanizerSuggestions({
    aiResult: aiResult({
      sectionType: "unknown",
      layoutType: "horizontal_row",
      contentType: "navigation_shell_menu",
      detectedKeywords: [
        "navigation-guideline",
        "carbon-navigation",
        "material-navigation",
        "ui-shell",
        "global-header",
        "side-nav",
        "navigation-rail",
        "navigation-drawer",
        "responsive-navigation",
        "breadcrumb",
        "service-header",
        "menubar",
        "menu-button",
        "command-menu",
        "app-shell"
      ],
      uiProblems: ["weak_hierarchy", "cta_not_clear"],
      recommendedCategories: {
        layoutCategories: ["navigation"],
        templateCategories: ["navigation", "footer"],
        animationCategories: ["navigation", "transition"]
      }
    }),
    limit: {
      layouts: 4,
      templates: 40,
      animations: 4
    }
  });

  assert.ok(
    templateReferences.some((reference) => reference.source === "carbon-navigation"),
    "expected Carbon navigation references in registry"
  );
  assert.ok(
    templateReferences.some((reference) => reference.source === "material-navigation"),
    "expected Material navigation references in registry"
  );
  assert.ok(
    templateReferences.some(
      (reference) => reference.source === "govuk-design-system" && reference.tags.includes("navigation-guideline")
    ),
    "expected GOV.UK navigation references in registry"
  );
  assert.ok(
    templateReferences.some(
      (reference) => reference.source === "wai-aria-apg" && reference.tags.includes("navigation-guideline")
    ),
    "expected WAI-ARIA navigation/menu references in registry"
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "carbon-navigation"),
    `expected Carbon navigation suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some((reference) => reference.source === "material-navigation"),
    `expected Material navigation suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some(
      (reference) => reference.source === "govuk-design-system" && reference.tags.includes("navigation-guideline")
    ),
    `expected GOV.UK navigation suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.some(
      (reference) => reference.source === "wai-aria-apg" && reference.tags.includes("navigation-guideline")
    ),
    `expected WAI-ARIA navigation/menu suggestion, got ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
  assert.ok(
    suggestions.templateReferences.every((reference) => reference.category !== "hero"),
    `unknown navigation case should not receive hero templates: ${suggestions.templateReferences.map((item) => item.id).join(", ")}`
  );
});

function aiResult(overrides: Partial<AIUnderstandingResult> = {}): AIUnderstandingResult {
  return {
    sectionType: "unknown",
    layoutType: "unknown",
    contentType: "unknown",
    confidence: 0.3,
    detectedBlocks: [],
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
    ...overrides
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
