// Fixture tests for section-aware Uncodixify analysis.
// Run with: npx tsx extension/src/analysis/analyzeUncodixify.test.ts
import assert from "node:assert/strict";
import type { AIUnderstandingResult, RectangleCapture, SourceSectionPart } from "../shared/types";
import { analyzeUncodixify } from "./analyzeUncodixify";

const tests: Array<[string, () => void]> = [];
const test = (name: string, fn: () => void) => tests.push([name, fn]);

test("effective non-hero section suppresses stale local hero findings", () => {
  const capture = captureWithLocalHeroDetection();
  const result = analyzeUncodixify(capture, aiResult({
    sectionType: "unknown",
    uncodixify: {
      summary: "Visual check incorrectly mentioned hero.",
      detectedRuleIds: ["hero-supporting-copy-too-long", "oversized-radius"],
      visualEvidence: ["Hero copy appears long.", "Several cards have large radius."],
      topRecommendations: ["Compress hero copy.", "Reduce radius."]
    }
  }));

  assert.ok(result);
  assert.ok(
    result.findings.every((finding) => !finding.ruleId.startsWith("hero-")),
    `unexpected hero findings: ${result.findings.map((finding) => finding.ruleId).join(", ")}`
  );
  assert.ok(result.findings.some((finding) => finding.ruleId === "oversized-radius"));
});

test("local CSS check does not emit semantic hero findings without Gemini", () => {
  const result = analyzeUncodixify(captureWithLocalHeroDetection(), null);

  assert.ok(result);
  assert.ok(
    result.findings.every((finding) => !finding.ruleId.startsWith("hero-")),
    `unexpected local hero findings: ${result.findings.map((finding) => finding.ruleId).join(", ")}`
  );
  assert.ok(result.findings.some((finding) => finding.ruleId === "oversized-radius"));
});

test("Gemini UI problems map into concrete rule recommendations", () => {
  const capture = captureWithLocalHeroDetection();
  const result = analyzeUncodixify(capture, aiResult({
    sectionType: "features",
    uiProblems: ["flat_layout", "cards_too_equal", "cta_not_clear", "too_text_heavy"],
    uncodixify: {
      summary: "The section is visually flat.",
      detectedRuleIds: [],
      visualEvidence: [],
      topRecommendations: []
    }
  }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("monotonous-section-rhythm"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("repetitive-equal-cards"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("weak-primary-action"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("text-heavy-block"), ruleIds.join(", "));
});

test("source-only card counts still produce layout recommendations", () => {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [];
  capture.counts = emptyCounts();
  capture.detected = {
    sectionType: "features",
    layoutType: "equal_grid",
    confidence: 0.7,
    reasons: ["source detected repeated cards"]
  };
  capture.selectedSourceSection = sourceFeatureSection();
  capture.sourceSections = [capture.selectedSourceSection];

  const result = analyzeUncodixify(capture, aiResult({ sectionType: "features" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("repetitive-equal-cards"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("monotonous-section-rhythm"), ruleIds.join(", "));
});

test("pricing credits cards produce pricing-specific recommendations", () => {
  const result = analyzeUncodixify(pricingCapture(), aiResult({
    sectionType: "pricing",
    layoutType: "pricing_columns",
    uiProblems: ["cards_too_equal"]
  }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("pricing-plan-weak-emphasis"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("repetitive-equal-cards"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /recommended plan|price, benefits, and CTA/i.test(fix)),
    result.topFixes.join(" | ")
  );
});

test("formulaic marketing copy produces copywriting recommendation", () => {
  const capture = formulaicCopyCapture();
  const result = analyzeUncodixify(capture, aiResult({ sectionType: "features" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("formulaic-ai-copy"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /direct|product-specific|copy/i.test(fix)),
    result.topFixes.join(" | ")
  );
  assert.ok(
    result.findings.every((finding) => !finding.ruleId.startsWith("hero-")),
    `unexpected hero findings: ${ruleIds.join(", ")}`
  );
});

test("anti AI slop writing patterns produce copywriting recommendations", () => {
  const capture = aiSlopWritingCapture();
  const result = analyzeUncodixify(capture, aiResult({ sectionType: "features" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("ai-slop-phrase-tells"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("ai-punctuation-tells"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /concrete product language|punctuation|specific/i.test(fix)),
    result.topFixes.join(" | ")
  );
});

test("pastel coming-soon bubble produces announcement-bubble recommendation", () => {
  const result = analyzeUncodixify(announcementBubbleCapture(), aiResult({
    sectionType: "unknown",
    layoutType: "horizontal_row"
  }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("decorative-announcement-bubble"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /announcement bubble|availability copy|status badge/i.test(fix)),
    result.topFixes.join(" | ")
  );
});

test("fake browser chrome produces Hallmark-derived recommendation", () => {
  const capture = chromeMockupCapture();
  const result = analyzeUncodixify(capture, aiResult({ sectionType: "features" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("redrawn-ui-chrome"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /fake chrome|real product|screenshot/i.test(fix)),
    result.topFixes.join(" | ")
  );
});

test("placeholder proof copy produces proof-specific recommendation", () => {
  const capture = placeholderProofCapture();
  const result = analyzeUncodixify(capture, aiResult({ sectionType: "hero" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("placeholder-proof-copy"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /verified proof|real data|proof slot/i.test(fix)),
    result.topFixes.join(" | ")
  );
});

test("generic navigation template produces navigation recommendation", () => {
  const capture = genericNavCapture();
  const result = analyzeUncodixify(capture, aiResult({ sectionType: "navigation" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("ai-nav-footer-template"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /information architecture|real destinations|navigation/i.test(fix)),
    result.topFixes.join(" | ")
  );
});

test("emoji iconography produces Huashu-derived iconography recommendation", () => {
  const capture = emojiIconographyCapture();
  const result = analyzeUncodixify(capture, aiResult({ sectionType: "features" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("emoji-iconography"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /emoji|icon|brand voice/i.test(fix)),
    result.topFixes.join(" | ")
  );
});

test("left-border accent cards produce Huashu-derived card recommendation", () => {
  const capture = leftBorderAccentCapture();
  const result = analyzeUncodixify(capture, aiResult({ sectionType: "features" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("left-border-accent-cards"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /accent strip|featured card|colored rails/i.test(fix)),
    result.topFixes.join(" | ")
  );
});

test("accessibility checklist issues produce UI UX Pro Max-derived recommendations", () => {
  const capture = accessibilityIssueCapture();
  const result = analyzeUncodixify(capture, aiResult({ sectionType: "form" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("tiny-touch-targets"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("icon-button-missing-label"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("placeholder-only-form-labels"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /44x44|accessible name|visible label/i.test(fix)),
    result.topFixes.join(" | ")
  );
});

test("Taste Skill anti-default checks produce concrete recommendations", () => {
  const capture = tasteSkillIssueCapture();
  const result = analyzeUncodixify(capture, aiResult({ sectionType: "features" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("duplicate-cta-intent"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("cheap-section-meta-labels"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("centered-stack-default"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("mobile-viewport-height-risk"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /one label per CTA intent|section-number|100dvh/i.test(fix)),
    result.topFixes.join(" | ")
  );
});

test("Taste Skill source quality checks catch concrete HTML and CSS issues", () => {
  const capture = tasteSkillSourceQualityCapture();
  const result = analyzeUncodixify(capture, aiResult({ sectionType: "features" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("pure-black-surface"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("placeholder-dead-links"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("missing-image-alt"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("arbitrary-z-index"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("overwide-paragraph-measure"), ruleIds.join(", "));
});

test("bad motion CSS produces design-engineering motion recommendations", () => {
  const capture = badMotionCapture();
  const result = analyzeUncodixify(capture, aiResult({ sectionType: "features" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("unbounded-sluggish-motion"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("layout-property-animation"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("motion-reduced-accessibility-missing"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /exact animated properties|under 300ms|transform and opacity/i.test(fix)),
    result.topFixes.join(" | ")
  );
});

test("repo-derived anti-template checks catch default fonts, icon cards, status dots, and fake charts", () => {
  const capture = repoDerivedIssueCapture();
  const result = analyzeUncodixify(capture, aiResult({ sectionType: "features" }));

  assert.ok(result);
  const ruleIds = result.findings.map((finding) => finding.ruleId);
  assert.ok(ruleIds.includes("default-font-stack-template"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("icon-tile-feature-cards"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("decorative-status-dots"), ruleIds.join(", "));
  assert.ok(ruleIds.includes("fake-charts"), ruleIds.join(", "));
  assert.ok(
    result.topFixes.some((fix) => /type system|feature-card template|status indicators|charts/i.test(fix)),
    result.topFixes.join(" | ")
  );
});

function captureWithLocalHeroDetection(): RectangleCapture {
  return {
    captureId: "capture-1",
    url: "https://example.test",
    title: "Example",
    selectedRect: {
      x: 0,
      y: 0,
      width: 1200,
      height: 760,
      top: 0,
      left: 0,
      right: 1200,
      bottom: 760,
      devicePixelRatio: 1,
      scrollX: 0,
      scrollY: 0,
      viewportWidth: 1200,
      viewportHeight: 760
    },
    screenshotBase64: "",
    matchedElements: [
      element("h2", "How Alter Works", 48, "700", "8px"),
      element(
        "p",
        "From concept to campaign, Alter streamlines every step of content creation, allowing you to generate and schedule posts in minutes.",
        18,
        "400",
        "8px"
      ),
      element("article", "Define your needs", 18, "700", "28px"),
      element("article", "AI Generation", 18, "700", "28px"),
      element("article", "Publish & Schedule", 18, "700", "28px")
    ],
    counts: {
      totalElements: 5,
      headings: 1,
      buttons: 0,
      links: 0,
      images: 0,
      svgs: 0,
      inputs: 0,
      cardsEstimate: 3,
      textLength: 190
    },
    detected: {
      sectionType: "hero",
      layoutType: "equal_grid",
      confidence: 0.82,
      reasons: ["stale local hero classification"]
    }
  };
}

function element(
  tagName: string,
  text: string,
  fontSize: number,
  fontWeight: string,
  borderRadius: string
): RectangleCapture["matchedElements"][number] {
  return {
    tagName,
    id: null,
    className: null,
    role: null,
    ariaLabel: null,
    text,
    rect: {
      x: 0,
      y: 0,
      width: 240,
      height: 120,
      top: 0,
      left: 0,
      right: 240,
      bottom: 120
    },
    style: {
      display: "block",
      position: "static",
      backgroundColor: "rgb(255, 255, 255)",
      color: "rgb(17, 17, 17)",
      fontSize: `${fontSize}px`,
      fontWeight,
      borderColor: "rgba(0, 0, 0, 0)",
      borderRadius,
      boxShadow: "none",
      padding: "0px",
      margin: "0px"
    }
  };
}

function sourceFeatureSection(): SourceSectionPart {
  return {
    domPath: "section#features",
    tagName: "section",
    id: "features",
    className: "features-grid",
    role: null,
    ariaLabel: null,
    textSummary: "How it works Define your needs AI Generation Publish and Schedule",
    childElementCount: 3,
    rect: {
      x: 0,
      y: 0,
      width: 900,
      height: 520,
      top: 0,
      left: 0,
      right: 900,
      bottom: 520
    },
    selectionOverlap: 1,
    counts: {
      ...emptyCounts(),
      totalElements: 8,
      headings: 1,
      cardsEstimate: 3,
      textLength: 120
    },
    headingSnippets: ["How it works"],
    ctaSnippets: [],
    mediaSnippets: [],
    htmlPreview: "<section id=\"features\"><article>Define your needs</article></section>",
    sectionType: "features",
    layoutType: "equal_grid",
    confidence: 0.8,
    score: 72,
    reasons: ["source fixture"]
  };
}

function pricingCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    element("h2", "Buy more credits", 36, "800", "8px"),
    element("article", "Starter 100 credits $19 Buy credits", 16, "500", "24px"),
    element("article", "Pro 500 credits $49 Buy credits", 16, "500", "24px"),
    element("article", "Scale 2000 credits $149 Contact sales", 16, "500", "24px"),
    element("button", "Buy credits", 15, "700", "8px")
  ];
  capture.counts = {
    totalElements: 5,
    headings: 1,
    buttons: 1,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 3,
    textLength: 120
  };
  capture.detected = {
    sectionType: "pricing",
    layoutType: "equal_grid",
    confidence: 0.8,
    reasons: ["pricing fixture"]
  };
  return capture;
}

function badMotionCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    {
      ...element("article", "Workflow step", 16, "600", "12px"),
      className: "feature-card transition-all hover:scale-105"
    },
    element("button", "Open details", 15, "700", "8px")
  ];
  capture.counts = {
    totalElements: 2,
    headings: 0,
    buttons: 1,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 1,
    textLength: 26
  };
  capture.detected = {
    sectionType: "features",
    layoutType: "vertical_stack",
    confidence: 0.72,
    reasons: ["bad motion fixture"]
  };
  capture.usedCssRules = {
    cssText:
      ".feature-card { transition: all 450ms ease-in; height: 240px; }\n.feature-card:hover { transform: scale(1.05); height: 280px; }\n@keyframes expand-card { from { height: 0; } to { height: 240px; } }",
    ruleCount: 3,
    skippedStyleSheets: 0,
    errors: [],
    debug: {
      matchedSelectors: [".feature-card", ".feature-card:hover"],
      skippedSelectors: [],
      skippedStyleSheetHrefs: [],
      mediaRuleCount: 0
    }
  };
  return capture;
}

function repoDerivedIssueCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    { ...element("h2", "Workflow benefits", 36, "800", "8px"), className: "section-title" },
    { ...element("article", "Plan campaigns with one brief", 18, "700", "16px"), className: "feature-card icon-card" },
    { ...element("article", "Generate variants for every channel", 18, "700", "16px"), className: "feature-card icon-card" },
    { ...element("article", "Publish with approvals and scheduling", 18, "700", "16px"), className: "feature-card icon-card" },
    { ...element("span", "Live", 12, "700", "9999px"), className: "badge live-dot animate-pulse" },
    { ...element("div", "95% conversion 82% retention 75% growth", 14, "600", "16px"), className: "sample-chart donut-chart" }
  ];
  capture.counts = {
    totalElements: 6,
    headings: 1,
    buttons: 0,
    links: 0,
    images: 0,
    svgs: 3,
    inputs: 0,
    cardsEstimate: 3,
    textLength: 160
  };
  capture.detected = {
    sectionType: "features",
    layoutType: "equal_grid",
    confidence: 0.76,
    reasons: ["repo derived anti-template fixture"]
  };
  capture.pageDesignContext = {
    sampledAt: "2026-06-26T00:00:00.000Z",
    totalElements: 80,
    sampledElements: 40,
    typography: {
      fontFamilies: ["Inter, system-ui, sans-serif"],
      fontSizes: ["12px", "14px", "18px", "36px"],
      fontWeights: ["400", "600", "800"],
      lineHeights: ["1.2", "1.5"],
      letterSpacing: ["0px"]
    },
    colors: {
      text: ["rgb(17, 17, 17)"],
      backgrounds: ["rgb(255, 255, 255)"],
      borders: ["rgb(229, 231, 235)"],
      focus: []
    },
    spacing: {
      margin: ["0px"],
      padding: ["16px", "24px"],
      scale: ["8px", "16px", "24px"]
    },
    radius: ["8px", "16px", "9999px"],
    shadows: ["none"],
    motion: {
      durations: ["200ms"],
      easings: ["ease"]
    },
    components: [
      { type: "cards", count: 3 },
      { type: "badges", count: 1 }
    ],
    siteSignals: {
      title: "Example",
      description: "",
      keywords: "",
      ogType: "",
      ogSiteName: "",
      appName: "",
      pathname: "/",
      hostname: "example.test",
      headings: ["Workflow benefits"],
      navTexts: [],
      ctaTexts: [],
      textSample: "Workflow benefits Plan campaigns Generate variants Publish with approvals",
      elementCounts: {
        forms: 0,
        inputs: 0,
        tables: 0,
        codeBlocks: 0,
        articles: 3,
        pricingSections: 0,
        productMarkers: 1,
        authMarkers: 0,
        checkoutMarkers: 0
      }
    },
    diagnostics: []
  };
  capture.selectedSourceSection = {
    ...sourceFeatureSection(),
    htmlPreview:
      '<section class="features equal-grid"><article class="feature-card"><div class="icon-tile rounded-xl w-10 h-10"><svg></svg></div><h3>Plan campaigns</h3></article><article class="feature-card"><div class="icon-tile rounded-xl w-10 h-10"><svg></svg></div><h3>Generate variants</h3></article><article class="feature-card"><div class="icon-tile rounded-xl w-10 h-10"><svg></svg></div><h3>Publish everywhere</h3></article><span class="badge live-dot animate-pulse">Live</span><div class="sample-chart donut-chart" style="background: conic-gradient(#111 75%, #eee 0)">95%</div></section>',
    sectionType: "features",
    layoutType: "equal_grid"
  };
  capture.sourceSections = [capture.selectedSourceSection];
  capture.usedCssRules = {
    cssText:
      ".feature-card { border: 1px solid #e5e7eb; border-radius: 16px; }\n.icon-tile { width: 40px; height: 40px; border-radius: 12px; }\n.live-dot::before { border-radius: 50%; animation: ping 1s infinite; }\n.sample-chart { background: conic-gradient(#111 75%, #eee 0); }",
    ruleCount: 4,
    skippedStyleSheets: 0,
    errors: [],
    debug: {
      matchedSelectors: [".feature-card", ".icon-tile", ".live-dot::before", ".sample-chart"],
      skippedSelectors: [],
      skippedStyleSheetHrefs: [],
      mediaRuleCount: 0
    }
  };
  return capture;
}

function chromeMockupCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    element("h2", "How Alter Works", 36, "800", "8px"),
    element("div", "View Calendar", 16, "700", "12px"),
    element("button", "Get started", 15, "700", "8px")
  ];
  capture.counts = {
    totalElements: 3,
    headings: 1,
    buttons: 1,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 1,
    textLength: 42
  };
  capture.detected = {
    sectionType: "features",
    layoutType: "vertical_stack",
    confidence: 0.74,
    reasons: ["chrome mockup fixture"]
  };
  capture.selectedSourceSection = {
    ...sourceFeatureSection(),
    htmlPreview:
      '<section class="workflow"><div class="browser-window"><div class="traffic-lights"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div><button>View Calendar</button></div></section>',
    sectionType: "features",
    layoutType: "vertical_stack"
  };
  capture.sourceSections = [capture.selectedSourceSection];
  return capture;
}

function formulaicCopyCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    element("h2", "Here's the thing: content automation changes everything", 36, "800", "8px"),
    element(
      "p",
      "Not because the tools are complex. Because workflows are fragmented. Let that sink in.",
      18,
      "400",
      "8px"
    ),
    element(
      "p",
      "At its core, our seamless platform helps teams navigate challenges.",
      16,
      "400",
      "8px"
    )
  ];
  capture.counts = {
    totalElements: 3,
    headings: 1,
    buttons: 0,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 0,
    textLength: 190
  };
  capture.detected = {
    sectionType: "features",
    layoutType: "vertical_stack",
    confidence: 0.72,
    reasons: ["copy fixture"]
  };
  return capture;
}

function aiSlopWritingCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    element(
      "p",
      "In today's competitive landscape, it's important to note that teams can unlock the power of seamless workflows.",
      18,
      "400",
      "8px"
    ),
    element(
      "p",
      "Let's dive in—this is where automation comes in—without the friction!!!",
      18,
      "400",
      "8px"
    )
  ];
  capture.counts = {
    totalElements: 2,
    headings: 0,
    buttons: 0,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 0,
    textLength: 168
  };
  capture.detected = {
    sectionType: "features",
    layoutType: "vertical_stack",
    confidence: 0.72,
    reasons: ["anti AI slop writing fixture"]
  };
  return capture;
}

function announcementBubbleCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    {
      ...element("span", "Скоро в Астане", 24, "700", "9999px"),
      className: "soon-bubble badge rounded-full",
      rect: {
        x: 0,
        y: 0,
        width: 290,
        height: 68,
        top: 0,
        left: 0,
        right: 290,
        bottom: 68
      },
      style: {
        ...element("span", "", 24, "700", "9999px").style,
        display: "inline-flex",
        backgroundColor: "rgb(255, 243, 231)",
        color: "rgb(249, 115, 22)",
        borderColor: "rgb(255, 186, 135)",
        borderRadius: "9999px",
        padding: "16px 28px",
        margin: "0px",
        boxShadow: "none"
      }
    }
  ];
  capture.counts = {
    totalElements: 1,
    headings: 0,
    buttons: 0,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 0,
    textLength: 15
  };
  capture.detected = {
    sectionType: "unknown",
    layoutType: "horizontal_row",
    confidence: 0.64,
    reasons: ["announcement bubble fixture"]
  };
  capture.selectedSourceSection = {
    ...sourceFeatureSection(),
    tagName: "div",
    id: null,
    className: "location-announcement",
    textSummary: "Скоро в Астане",
    htmlPreview:
      '<div class="location-announcement"><span class="soon-bubble badge rounded-full"><span class="dot rounded-full"></span>Скоро в Астане</span></div>',
    sectionType: "unknown",
    layoutType: "horizontal_row"
  };
  capture.sourceSections = [capture.selectedSourceSection];
  capture.usedCssRules = {
    cssText:
      ".soon-bubble { display: inline-flex; gap: 16px; border-radius: 9999px; border: 1px solid #ffba87; background: #fff3e7; color: #f97316; }\n.soon-bubble .dot { width: 12px; height: 12px; border-radius: 50%; background: #fb923c; }",
    ruleCount: 2,
    skippedStyleSheets: 0,
    errors: [],
    debug: {
      matchedSelectors: [".soon-bubble", ".soon-bubble .dot"],
      skippedSelectors: [],
      skippedStyleSheetHrefs: [],
      mediaRuleCount: 0
    }
  };
  return capture;
}

function placeholderProofCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    element("h1", "Trusted by 10,000+ happy customers", 42, "800", "8px"),
    element("p", "3x faster workflows with 99.9% uptime.", 18, "400", "8px"),
    element("blockquote", "This platform changed everything. Jane Doe, Head of Product at Acme", 16, "500", "8px")
  ];
  capture.counts = {
    totalElements: 3,
    headings: 1,
    buttons: 0,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 0,
    textLength: 120
  };
  capture.detected = {
    sectionType: "hero",
    layoutType: "vertical_stack",
    confidence: 0.76,
    reasons: ["placeholder proof fixture"]
  };
  return capture;
}

function emojiIconographyCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    element("h2", "Workflow benefits", 36, "800", "8px"),
    { ...element("article", "🚀 Launch campaigns", 18, "700", "12px"), className: "feature-card" },
    { ...element("article", "⚡ Automate approvals", 18, "700", "12px"), className: "feature-card" },
    { ...element("button", "✨ Start now", 15, "700", "8px"), className: "cta-button" }
  ];
  capture.counts = {
    totalElements: 4,
    headings: 1,
    buttons: 1,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 2,
    textLength: 78
  };
  capture.detected = {
    sectionType: "features",
    layoutType: "equal_grid",
    confidence: 0.76,
    reasons: ["emoji icon fixture"]
  };
  return capture;
}

function leftBorderAccentCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    element("h2", "Benefits", 36, "800", "8px"),
    { ...element("article", "Plan content faster", 18, "700", "12px"), className: "card border-l-4 border-blue-500" },
    { ...element("article", "Publish everywhere", 18, "700", "12px"), className: "card border-l-4 border-purple-500" },
    { ...element("article", "Measure outcomes", 18, "700", "12px"), className: "card border-l-4 border-emerald-500" }
  ];
  capture.counts = {
    totalElements: 4,
    headings: 1,
    buttons: 0,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 3,
    textLength: 80
  };
  capture.detected = {
    sectionType: "features",
    layoutType: "equal_grid",
    confidence: 0.78,
    reasons: ["left border fixture"]
  };
  capture.usedCssRules = {
    cssText:
      ".card { border-left: 4px solid var(--accent); padding: 16px; border-radius: 12px; }",
    ruleCount: 1,
    skippedStyleSheets: 0,
    errors: [],
    debug: {
      matchedSelectors: [".card"],
      skippedSelectors: [],
      skippedStyleSheetHrefs: [],
      mediaRuleCount: 0
    }
  };
  return capture;
}

function accessibilityIssueCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    element("h2", "Join the waitlist", 36, "800", "8px"),
    {
      ...element("input", "", 16, "400", "8px"),
      className: "email-field",
      rect: {
        x: 0,
        y: 64,
        width: 220,
        height: 36,
        top: 64,
        left: 0,
        right: 220,
        bottom: 100
      }
    },
    {
      ...element("button", "", 15, "700", "9999px"),
      className: "icon-button",
      ariaLabel: null,
      rect: {
        x: 228,
        y: 64,
        width: 28,
        height: 28,
        top: 64,
        left: 228,
        right: 256,
        bottom: 92
      }
    }
  ];
  capture.counts = {
    totalElements: 3,
    headings: 1,
    buttons: 1,
    links: 0,
    images: 0,
    svgs: 1,
    inputs: 1,
    cardsEstimate: 0,
    textLength: 18
  };
  capture.detected = {
    sectionType: "form",
    layoutType: "form_layout",
    confidence: 0.78,
    reasons: ["accessibility fixture"]
  };
  capture.selectedSourceSection = {
    ...sourceFeatureSection(),
    tagName: "form",
    htmlPreview:
      '<form class="waitlist-form"><input class="email-field" type="email" placeholder="Email"><button class="icon-button"><svg aria-hidden="true"></svg></button></form>',
    sectionType: "form",
    layoutType: "form_layout"
  };
  capture.sourceSections = [capture.selectedSourceSection];
  return capture;
}

function tasteSkillIssueCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    { ...element("p", "SECTION 01", 12, "700", "0px"), className: "eyebrow text-center" },
    { ...element("h2", "Build better launch systems", 36, "800", "8px"), className: "text-center mx-auto" },
    { ...element("article", "Plan campaigns", 18, "700", "12px"), className: "card text-center items-center" },
    { ...element("article", "Publish everywhere", 18, "700", "12px"), className: "card text-center items-center" },
    { ...element("button", "Contact us", 15, "700", "8px"), className: "cta-button" },
    { ...element("button", "Get in touch", 15, "700", "8px"), className: "cta-button" }
  ];
  capture.counts = {
    totalElements: 6,
    headings: 1,
    buttons: 2,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 2,
    textLength: 112
  };
  capture.detected = {
    sectionType: "features",
    layoutType: "vertical_stack",
    confidence: 0.74,
    reasons: ["taste skill fixture"]
  };
  capture.selectedSourceSection = {
    ...sourceFeatureSection(),
    htmlPreview:
      '<section class="min-h-screen text-center"><p>SECTION 01</p><h2 class="mx-auto">Build better launch systems</h2><div class="items-center justify-center"><button>Contact us</button><button>Get in touch</button></div></section>',
    sectionType: "features",
    layoutType: "vertical_stack"
  };
  capture.sourceSections = [capture.selectedSourceSection];
  capture.usedCssRules = {
    cssText:
      ".launch-section { min-height: 100vh; text-align: center; align-items: center; justify-content: center; }",
    ruleCount: 1,
    skippedStyleSheets: 0,
    errors: [],
    debug: {
      matchedSelectors: [".launch-section"],
      skippedSelectors: [],
      skippedStyleSheetHrefs: [],
      mediaRuleCount: 0
    }
  };
  return capture;
}

function tasteSkillSourceQualityCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  const longParagraph =
    "This long paragraph stretches across the whole selected block and becomes difficult to read because the line length is far beyond a comfortable measure for normal product copy.";
  capture.matchedElements = [
    {
      ...element("section", "Source quality fixture", 16, "400", "0px"),
      className: "bg-black z-[9999]",
      style: {
        ...element("section", "", 16, "400", "0px").style,
        backgroundColor: "rgb(0, 0, 0)",
        color: "rgb(255, 255, 255)"
      }
    },
    {
      ...element("p", longParagraph, 17, "400", "0px"),
      rect: {
        x: 0,
        y: 80,
        width: 920,
        height: 96,
        top: 80,
        left: 0,
        right: 920,
        bottom: 176
      }
    }
  ];
  capture.counts = {
    totalElements: 2,
    headings: 0,
    buttons: 0,
    links: 1,
    images: 1,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 0,
    textLength: longParagraph.length
  };
  capture.detected = {
    sectionType: "features",
    layoutType: "vertical_stack",
    confidence: 0.72,
    reasons: ["source quality fixture"]
  };
  capture.selectedSourceSection = {
    ...sourceFeatureSection(),
    htmlPreview:
      '<section class="bg-black z-[9999]"><p>This long paragraph stretches across the whole selected block and becomes difficult to read because the line length is far beyond a comfortable measure for normal product copy.</p><a href="#">Learn more</a><img src="/product.png"></section>',
    sectionType: "features",
    layoutType: "vertical_stack"
  };
  capture.sourceSections = [capture.selectedSourceSection];
  capture.usedCssRules = {
    cssText: ".source-quality { background: #000; z-index: 9999; }",
    ruleCount: 1,
    skippedStyleSheets: 0,
    errors: [],
    debug: {
      matchedSelectors: [".source-quality"],
      skippedSelectors: [],
      skippedStyleSheetHrefs: [],
      mediaRuleCount: 0
    }
  };
  return capture;
}

function genericNavCapture(): RectangleCapture {
  const capture = captureWithLocalHeroDetection();
  capture.matchedElements = [
    element("nav", "Features Pricing Docs Blog About Get started", 16, "500", "0px"),
    element("a", "Features", 15, "500", "0px"),
    element("a", "Pricing", 15, "500", "0px"),
    element("a", "Docs", 15, "500", "0px"),
    element("a", "Blog", 15, "500", "0px"),
    element("a", "About", 15, "500", "0px"),
    element("button", "Get started", 15, "700", "8px")
  ];
  capture.counts = {
    totalElements: 7,
    headings: 0,
    buttons: 1,
    links: 5,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 0,
    textLength: 82
  };
  capture.detected = {
    sectionType: "navigation",
    layoutType: "horizontal_row",
    confidence: 0.8,
    reasons: ["generic nav fixture"]
  };
  return capture;
}

function emptyCounts(): RectangleCapture["counts"] {
  return {
    totalElements: 0,
    headings: 0,
    buttons: 0,
    links: 0,
    images: 0,
    svgs: 0,
    inputs: 0,
    cardsEstimate: 0,
    textLength: 0
  };
}

function aiResult(overrides: Partial<AIUnderstandingResult>): AIUnderstandingResult {
  return {
    sectionType: "unknown",
    layoutType: "unknown",
    contentType: "unknown",
    confidence: 0.4,
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
