import type { MatchedElement, RectangleCapture, StyleContext } from "../shared/types";
import type { StyleTokens } from "../content/extractStyleTokens";
import type { LocalUncodixifyFinding } from "./uncodixifyTypes";
import { buildObjectInventory, type ObjectInventory } from "./buildObjectInventory";

// Local, deterministic Uncodixify detector.
//
// Runs entirely from extracted DOM/CSS data — no network. It is intentionally
// conservative: it only emits a finding when concrete CSS evidence supports it,
// so that local findings can be treated as higher-priority than Gemini guesses.

export type LocalUncodixifyInput = {
  matchedElements: MatchedElement[];
  styleContext?: StyleContext;
  styleTokens?: StyleTokens;
  counts?: RectangleCapture["counts"];
  detected?: RectangleCapture["detected"];
  screenshot?: { width?: number; height?: number };
  objectInventory?: ObjectInventory;
  usedCssRules?: RectangleCapture["usedCssRules"];
  sourceSections?: RectangleCapture["sourceSections"];
  selectedSourceSection?: RectangleCapture["selectedSourceSection"];
  pageDesignContext?: RectangleCapture["pageDesignContext"];
};

export function runLocalUncodixifyCheck(
  input: LocalUncodixifyInput
): LocalUncodixifyFinding[] {
  const elements = Array.isArray(input.matchedElements) ? input.matchedElements : [];
  const findings: LocalUncodixifyFinding[] = [];
  const total = Math.max(elements.length, 1);
  const objectInventory = input.objectInventory ?? buildObjectInventory(elements, input.counts);

  // Pre-compute reusable measurements.
  const classText = elements
    .map((element) => (element.className ?? "").toLowerCase())
    .join(" ");
  const fullText = elements.map((element) => element.text ?? "").join(" ");
  const cssText = input.usedCssRules?.cssText ?? "";
  const sourceText = buildSourceSignalText(input, elements);
  const isDark =
    input.styleContext?.theme === "dark" || input.styleTokens?.theme === "dark";
  const sectionType: string = input.detected?.sectionType ?? "unknown";

  // --- typography/source: one-font generated template --------------------
  const defaultFontSignals = findDefaultFontStackTemplateSignals(input, elements);
  if (defaultFontSignals.length >= 1) {
    findings.push({
      ruleId: "default-font-stack-template",
      confidence: defaultFontSignals.length >= 2 ? 0.58 : 0.48,
      evidence: [
        "The page appears to rely on a default/generated font stack without a distinct display/body system.",
        `Signal: ${defaultFontSignals.slice(0, 3).join(", ")}.`
      ]
    });
  }

  // --- radius: oversized rounded corners ---------------------------------
  const oversizedRadius = elements.filter(
    (element) => maxBorderRadiusPx(element.style.borderRadius) >= 20
  );
  if (oversizedRadius.length >= 3) {
    findings.push({
      ruleId: "oversized-radius",
      confidence: confidenceFromCount(oversizedRadius.length, total, 0.7),
      evidence: [
        `${oversizedRadius.length} elements use border-radius >= 20px.`,
        ...sampleRadiusEvidence(oversizedRadius)
      ]
    });
  }

  // --- buttons: pill overload --------------------------------------------
  const pillElements = elements.filter((element) => isPillShaped(element));
  if (pillElements.length >= 3) {
    findings.push({
      ruleId: "pill-overload",
      confidence: confidenceFromCount(pillElements.length, total, 0.7),
      evidence: [
        `${pillElements.length} elements are pill-shaped (fully rounded).`,
        ...samplePillEvidence(pillElements)
      ]
    });
  }

  // --- shadow: dramatic shadows ------------------------------------------
  const dramaticShadows = elements.filter(
    (element) => maxShadowBlurPx(element.style.boxShadow) > 16
  );
  if (dramaticShadows.length >= 2) {
    findings.push({
      ruleId: "dramatic-shadows",
      confidence: confidenceFromCount(dramaticShadows.length, total, 0.65),
      evidence: [
        `${dramaticShadows.length} elements use box-shadow blur > 16px.`,
        ...dramaticShadows
          .slice(0, 2)
          .map((element) => `${describeElement(element)} shadow: ${element.style.boxShadow}.`)
      ]
    });
  }

  // --- shadow/color: glow-heavy UI (colored shadows) ---------------------
  const glowElements = elements.filter((element) => hasColoredShadow(element.style.boxShadow));
  if (glowElements.length >= 1) {
    findings.push({
      ruleId: "glow-heavy-ui",
      confidence: confidenceFromCount(glowElements.length, total, 0.6),
      evidence: [
        `${glowElements.length} element(s) use colored glow shadows instead of hierarchy.`,
        ...glowElements
          .slice(0, 2)
          .map((element) => `${describeElement(element)} glow: ${element.style.boxShadow}.`)
      ]
    });
  }

  // --- color: gradient overuse (class-based, computed bg can't show it) ---
  const gradientClassHits = countClassMatches(elements, [
    "bg-gradient",
    "gradient-to",
    "from-",
    "via-",
    "to-"
  ]);
  if (gradientClassHits >= 2 || /gradient/.test(classText)) {
    findings.push({
      ruleId: "gradient-overuse",
      confidence: gradientClassHits >= 2 ? 0.6 : 0.45,
      evidence: [
        gradientClassHits >= 2
          ? `${gradientClassHits} elements use gradient utility classes.`
          : "Gradient-related classes were detected in the selection."
      ]
    });
  }

  // --- panels: glassmorphism (backdrop blur via class) -------------------
  const glassHits = countClassMatches(elements, [
    "backdrop-blur",
    "backdrop-filter",
    "glass",
    "frosted"
  ]);
  if (glassHits >= 1) {
    findings.push({
      ruleId: "glassmorphism-default",
      confidence: confidenceFromCount(glassHits, total, 0.6),
      evidence: [`Detected backdrop-blur / glass classes on ${glassHits} element(s).`]
    });
  }

  // --- spacing: overpadded layout ----------------------------------------
  const overpadded = elements.filter((element) => maxPaddingPx(element.style.padding) >= 48);
  if (overpadded.length >= 2) {
    findings.push({
      ruleId: "overpadded-layout",
      confidence: confidenceFromCount(overpadded.length, total, 0.6),
      evidence: [
        `${overpadded.length} sections/cards use padding >= 48px.`,
        ...overpadded
          .slice(0, 2)
          .map((element) => `${describeElement(element)} padding: ${element.style.padding}.`)
      ]
    });
  }

  // --- spacing: inconsistent spacing -------------------------------------
  const paddingValues = elements
    .map((element) => maxPaddingPx(element.style.padding))
    .filter((value) => value > 0);
  const offScale = paddingValues.filter((value) => !isOnSpacingScale(value));
  if (paddingValues.length >= 4 && offScale.length >= Math.ceil(paddingValues.length / 2)) {
    findings.push({
      ruleId: "inconsistent-spacing",
      confidence: 0.55,
      evidence: [
        `${offScale.length} of ${paddingValues.length} padding values are off the 4/8px spacing scale.`,
        `Off-scale values: ${[...new Set(offScale)].slice(0, 6).map((v) => `${v}px`).join(", ")}.`
      ]
    });
  }

  // --- typography: uppercase label overuse / eyebrows --------------------
  const uppercaseLabels = elements.filter((element) => isUppercaseLabel(element));
  if (uppercaseLabels.length >= 2) {
    findings.push({
      ruleId: "uppercase-label-overuse",
      confidence: confidenceFromCount(uppercaseLabels.length, total, 0.55),
      evidence: [
        `${uppercaseLabels.length} short uppercase labels were detected.`,
        ...uppercaseLabels
          .slice(0, 3)
          .map((element) => `Label: "${truncate(element.text, 40)}".`)
      ]
    });
  }
  const eyebrowHits = countClassMatches(elements, ["eyebrow", "overline", "kicker"]);
  if (eyebrowHits >= 1 || uppercaseLabels.length >= 3) {
    findings.push({
      ruleId: "decorative-eyebrows",
      confidence: eyebrowHits >= 1 ? 0.6 : 0.45,
      evidence: [
        eyebrowHits >= 1
          ? `Detected eyebrow/overline labels on ${eyebrowHits} element(s).`
          : "Multiple small uppercase labels read as decorative eyebrows."
      ]
    });
  }

  // --- copy: generic premium/SaaS filler ---------------------------------
  if (hasGenericPremiumCopy(fullText)) {
    findings.push({
      ruleId: "fake-premium-copy",
      confidence: 0.5,
      evidence: [
        "Generic premium/SaaS wording was detected in visible copy.",
        `Example copy: "${truncate(findGenericCopyExample(elements), 90)}".`
      ]
    });
  }

  // --- copy: formulaic AI prose patterns ---------------------------------
  const formulaicCopySignals = findFormulaicCopySignals(elements, fullText);
  if (formulaicCopySignals.length >= 1) {
    findings.push({
      ruleId: "formulaic-ai-copy",
      confidence: formulaicCopySignals.length >= 2 ? 0.68 : 0.58,
      evidence: formulaicCopySignals.slice(0, 2).flatMap((signal) => [
        `Formulaic AI-writing copy pattern detected: ${signal.label}.`,
        `Example copy: "${truncate(signal.example, 110)}".`
      ])
    });
  }

  const aiSlopPhraseSignals = findAiSlopPhraseSignals(elements, fullText);
  if (aiSlopPhraseSignals.length >= 1) {
    findings.push({
      ruleId: "ai-slop-phrase-tells",
      confidence: aiSlopPhraseSignals.length >= 2 ? 0.68 : 0.58,
      evidence: aiSlopPhraseSignals.slice(0, 2).flatMap((signal) => [
        `AI-slop copy pattern detected: ${signal.label}.`,
        `Example copy: "${truncate(signal.example, 110)}".`
      ])
    });
  }

  const punctuationTellSignals = findAiPunctuationTellSignals(fullText);
  if (punctuationTellSignals.length >= 1) {
    findings.push({
      ruleId: "ai-punctuation-tells",
      confidence: punctuationTellSignals.length >= 2 ? 0.62 : 0.52,
      evidence: [
        "Generated-writing punctuation rhythm was detected.",
        `Signal: ${punctuationTellSignals.slice(0, 3).join(", ")}.`
      ]
    });
  }

  // --- iconography: emoji used as UI icons -------------------------------
  const emojiIconSignals = findEmojiIconographySignals(elements);
  if (emojiIconSignals.length >= 2) {
    findings.push({
      ruleId: "emoji-iconography",
      confidence: emojiIconSignals.length >= 3 ? 0.68 : 0.58,
      evidence: [
        `${emojiIconSignals.length} UI text item(s) use emoji as decorative icons.`,
        ...emojiIconSignals
          .slice(0, 3)
          .map((signal) => `Emoji UI copy: "${truncate(signal, 80)}".`)
      ]
    });
  }

  // --- source/layout: fake browser/device chrome -------------------------
  const redrawnChromeSignals = findRedrawnChromeSignals(sourceText, elements);
  if (redrawnChromeSignals.length >= 1) {
    findings.push({
      ruleId: "redrawn-ui-chrome",
      confidence: redrawnChromeSignals.length >= 2 ? 0.68 : 0.58,
      evidence: [
        "Source/classes suggest fake browser, device, or code-window chrome.",
        `Signal: ${redrawnChromeSignals.slice(0, 3).join(", ")}.`
      ]
    });
  }

  // --- copy/proof: placeholder names or stock metrics --------------------
  const placeholderProofSignals = findPlaceholderProofSignals(elements, fullText);
  if (placeholderProofSignals.length >= 1) {
    findings.push({
      ruleId: "placeholder-proof-copy",
      confidence: placeholderProofSignals.length >= 2 ? 0.62 : 0.52,
      evidence: placeholderProofSignals.slice(0, 2).flatMap((signal) => [
        `Placeholder or stock proof detected: ${signal.label}.`,
        `Example copy: "${truncate(signal.example, 110)}".`
      ])
    });
  }

  // --- cards: colored left-border accent trope ---------------------------
  const leftBorderAccentSignals = findLeftBorderAccentSignals(sourceText, elements);
  if (leftBorderAccentSignals.length >= 1) {
    findings.push({
      ruleId: "left-border-accent-cards",
      confidence: leftBorderAccentSignals.length >= 2 ? 0.66 : 0.56,
      evidence: [
        "Repeated colored left-border card accents were detected.",
        `Signal: ${leftBorderAccentSignals.slice(0, 3).join(", ")}.`
      ]
    });
  }

  // --- accessibility/forms: concrete UX checklist failures ---------------
  const tinyTouchTargets = findTinyTouchTargets(elements);
  if (tinyTouchTargets.length >= 1) {
    findings.push({
      ruleId: "tiny-touch-targets",
      confidence: tinyTouchTargets.length >= 2 ? 0.72 : 0.62,
      evidence: [
        `${tinyTouchTargets.length} interactive control(s) are smaller than the 44x44px touch target guideline.`,
        ...tinyTouchTargets
          .slice(0, 3)
          .map((element) => `${describeElement(element)} is ${Math.round(element.rect.width)}x${Math.round(element.rect.height)}px.`)
      ]
    });
  }

  const unnamedIconButtons = findUnnamedIconButtonSignals(sourceText, elements);
  if (unnamedIconButtons.length >= 1) {
    findings.push({
      ruleId: "icon-button-missing-label",
      confidence: unnamedIconButtons.length >= 2 ? 0.72 : 0.62,
      evidence: [
        "Icon-only interactive controls lack an accessible name.",
        `Signal: ${unnamedIconButtons.slice(0, 3).join(", ")}.`
      ]
    });
  }

  const placeholderOnlyInputs = findPlaceholderOnlyInputSignals(sourceText);
  if (placeholderOnlyInputs.length >= 1) {
    findings.push({
      ruleId: "placeholder-only-form-labels",
      confidence: placeholderOnlyInputs.length >= 2 ? 0.74 : 0.64,
      evidence: [
        `${placeholderOnlyInputs.length} input field(s) appear to rely on placeholder text instead of labels.`,
        `Signal: ${placeholderOnlyInputs.slice(0, 3).join(", ")}.`
      ]
    });
  }

  // --- copy/buttons/layout: Taste Skill anti-default checks --------------
  const duplicateCtaIntent = findDuplicateCtaIntentSignal(elements);
  if (duplicateCtaIntent) {
    findings.push({
      ruleId: "duplicate-cta-intent",
      confidence: duplicateCtaIntent.uniqueLabels.length >= 3 ? 0.68 : 0.58,
      evidence: [
        `Multiple CTA labels share the same "${duplicateCtaIntent.intent}" intent.`,
        `Labels: ${duplicateCtaIntent.uniqueLabels.slice(0, 4).map((label) => `"${label}"`).join(", ")}.`
      ]
    });
  }

  const sectionMetaLabels = findCheapSectionMetaLabelSignals(elements, sourceText);
  if (sectionMetaLabels.length >= 1) {
    findings.push({
      ruleId: "cheap-section-meta-labels",
      confidence: sectionMetaLabels.length >= 2 ? 0.66 : 0.56,
      evidence: [
        "Decorative section-number/meta labels were detected.",
        ...sectionMetaLabels.slice(0, 3).map((label) => `Label: "${truncate(label, 60)}".`)
      ]
    });
  }

  const centeredStackSignals = findCenteredStackDefaultSignals(
    classText,
    sourceText,
    input.detected?.layoutType,
    sectionType
  );
  if (centeredStackSignals.length >= 1) {
    findings.push({
      ruleId: "centered-stack-default",
      confidence: centeredStackSignals.length >= 2 ? 0.64 : 0.54,
      evidence: [
        "The block uses several centered-layout defaults.",
        `Signal: ${centeredStackSignals.slice(0, 4).join(", ")}.`
      ]
    });
  }

  const viewportHeightSignals = findMobileViewportHeightRiskSignals(
    sourceText,
    classText,
    cssText
  );
  if (viewportHeightSignals.length >= 1) {
    findings.push({
      ruleId: "mobile-viewport-height-risk",
      confidence: viewportHeightSignals.length >= 2 ? 0.66 : 0.56,
      evidence: [
        "Full-screen viewport sizing was detected without a visible dynamic viewport fallback.",
        `Signal: ${viewportHeightSignals.slice(0, 3).join(", ")}.`
      ]
    });
  }

  const pureBlackSignals = findPureBlackSurfaceSignals(elements, sourceText, cssText);
  if (pureBlackSignals.length >= 1) {
    findings.push({
      ruleId: "pure-black-surface",
      confidence: pureBlackSignals.length >= 2 ? 0.62 : 0.52,
      evidence: [
        "Pure black surface styling was detected.",
        `Signal: ${pureBlackSignals.slice(0, 3).join(", ")}.`
      ]
    });
  }

  const placeholderLinks = findPlaceholderDeadLinkSignals(sourceText);
  if (placeholderLinks.length >= 1) {
    findings.push({
      ruleId: "placeholder-dead-links",
      confidence: placeholderLinks.length >= 2 ? 0.74 : 0.64,
      evidence: [
        `${placeholderLinks.length} placeholder/dead link pattern(s) were detected in the captured source.`,
        `Signal: ${placeholderLinks.slice(0, 3).join(", ")}.`
      ]
    });
  }

  const missingImageAlts = findMissingImageAltSignals(sourceText);
  if (missingImageAlts.length >= 1) {
    findings.push({
      ruleId: "missing-image-alt",
      confidence: missingImageAlts.length >= 2 ? 0.78 : 0.68,
      evidence: [
        `${missingImageAlts.length} image tag(s) appear to have missing or generic alt text.`,
        `Signal: ${missingImageAlts.slice(0, 3).join(", ")}.`
      ]
    });
  }

  const arbitraryZIndexSignals = findArbitraryZIndexSignals(sourceText, cssText, classText);
  if (arbitraryZIndexSignals.length >= 1) {
    findings.push({
      ruleId: "arbitrary-z-index",
      confidence: arbitraryZIndexSignals.length >= 2 ? 0.68 : 0.58,
      evidence: [
        "Arbitrary high z-index values were detected.",
        `Signal: ${arbitraryZIndexSignals.slice(0, 3).join(", ")}.`
      ]
    });
  }

  const overwideParagraphs = findOverwideParagraphSignals(elements);
  if (overwideParagraphs.length >= 1) {
    findings.push({
      ruleId: "overwide-paragraph-measure",
      confidence: overwideParagraphs.length >= 2 ? 0.62 : 0.52,
      evidence: [
        `${overwideParagraphs.length} long text block(s) appear wider than a readable measure.`,
        ...overwideParagraphs.slice(0, 2)
      ]
    });
  }

  // --- cards: repetitive equal cards -------------------------------------
  const equalCards = findEqualCards(elements);
  const equalGrid = input.detected?.layoutType === "equal_grid";
  const inventoryCardCount = objectInventory.summary.cards;
  const iconTileFeatureSignals = findIconTileFeatureCardSignals(
    sourceText,
    classText,
    fullText,
    equalCards.count,
    equalGrid,
    inventoryCardCount,
    sectionType
  );
  if (iconTileFeatureSignals.length >= 1) {
    findings.push({
      ruleId: "icon-tile-feature-cards",
      confidence: iconTileFeatureSignals.length >= 2 ? 0.66 : 0.56,
      evidence: [
        "The section matches the common generated feature-card pattern.",
        `Signal: ${iconTileFeatureSignals.slice(0, 4).join(", ")}.`
      ]
    });
  }

  if (equalCards.count >= 3) {
    findings.push({
      ruleId: "repetitive-equal-cards",
      confidence: equalGrid ? 0.8 : 0.65,
      evidence: [
        `${equalCards.count} card containers share the same width/height and visual weight.`,
        ...(equalGrid ? ["Local detection classified the layout as an equal grid."] : [])
      ]
    });
  } else if (equalGrid && Math.max(input.counts?.cardsEstimate ?? 0, inventoryCardCount) >= 3) {
    findings.push({
      ruleId: "repetitive-equal-cards",
      confidence: 0.6,
      evidence: [
        `Equal-grid layout with ${Math.max(input.counts?.cardsEstimate ?? 0, inventoryCardCount)} similar cards detected.`
      ]
    });
  }

  if (equalCards.count >= 3 || (equalGrid && Math.max(input.counts?.cardsEstimate ?? 0, inventoryCardCount) >= 3)) {
    findings.push({
      ruleId: "monotonous-section-rhythm",
      confidence: equalCards.count >= 3 ? 0.66 : 0.56,
      evidence: [
        equalCards.count >= 3
          ? `${equalCards.count} card-like containers share similar emphasis.`
          : `Equal-grid rhythm with ${Math.max(input.counts?.cardsEstimate ?? 0, inventoryCardCount)} card-like items was detected.`
      ]
    });
  }

  const pricingLike =
    sectionType === "pricing" ||
    objectInventory.summary.priceTokens >= 2 ||
    /\b(pricing|billing|plans?|credits?|seats?|monthly|yearly|enterprise)\b/i.test(fullText);
  const pricingCardCount = Math.max(input.counts?.cardsEstimate ?? 0, inventoryCardCount);
  if (
    pricingLike &&
    pricingCardCount >= 2 &&
    (equalCards.count >= 2 || equalGrid || objectInventory.repeatedGroups.some((group) => group.type === "card" && group.similarSize))
  ) {
    findings.push({
      ruleId: "pricing-plan-weak-emphasis",
      confidence: equalCards.count >= 3 || equalGrid ? 0.66 : 0.56,
      evidence: [
        `${pricingCardCount} pricing/credits plan card(s) are presented with similar emphasis.`,
        objectInventory.summary.priceTokens >= 2
          ? `${objectInventory.summary.priceTokens} pricing token(s) were detected.`
          : "Pricing/billing language was detected in the selected block."
      ]
    });
  }

  // --- cards: metric/KPI grid default ------------------------------------
  if (
    (sectionType === "stats" || sectionType === "dashboard") &&
    (equalGrid || equalCards.count >= 3) &&
    Math.max(input.counts?.cardsEstimate ?? 0, inventoryCardCount) >= 3
  ) {
    findings.push({
      ruleId: "metric-card-grid-default",
      confidence: 0.6,
      evidence: [
        `A ${Math.max(input.counts?.cardsEstimate ?? 0, inventoryCardCount)}-tile equal metric/KPI grid is used as the default ${sectionType} layout.`
      ]
    });
  }

  // --- panels: nested panel overload -------------------------------------
  const panelLike = elements.filter((element) => isPanelLike(element));
  if (panelLike.length >= 4) {
    findings.push({
      ruleId: "nested-panel-overload",
      confidence: confidenceFromCount(panelLike.length, total, 0.55),
      evidence: [
        `${panelLike.length} bordered/filled panel containers were detected, suggesting nested panels.`
      ]
    });
  }

  // --- color: blue/cyan AI-dashboard -------------------------------------
  if (isDark) {
    const accentColors = collectAccentColors(input, elements);
    const blueCyan = accentColors.filter((color) => isBlueOrCyan(color));
    if (blueCyan.length >= 1) {
      findings.push({
        ruleId: "blue-cyan-ai-dashboard",
        confidence: confidenceFromCount(blueCyan.length, Math.max(accentColors.length, 1), 0.55),
        evidence: [
          `Dark UI uses blue/cyan accent colors (${[...new Set(blueCyan)].slice(0, 3).join(", ")}).`
        ]
      });
    }
  }

  // --- typography: weak hierarchy ----------------------------------------
  const headingSizes = elements
    .filter((element) => isHeadingLike(element))
    .map((element) => parsePx(element.style.fontSize))
    .filter((value) => value > 0);
  if (headingSizes.length >= 2) {
    const max = Math.max(...headingSizes);
    const min = Math.min(...headingSizes);
    if (max > 0 && max - min <= 4) {
      findings.push({
        ruleId: "weak-hierarchy",
        confidence: 0.55,
        evidence: [
          `Heading-like text sizes are nearly equal (${min}px–${max}px), so hierarchy is weak.`
        ]
      });
    }
  }

  // --- copy/layout: text-heavy block -------------------------------------
  const longTextBlocks = elements.filter((element) => wordCount(element.text) >= 34);
  if (
    longTextBlocks.length >= 1 ||
    objectInventory.summary.longTextBlocks >= 1 ||
    (input.counts?.textLength ?? 0) >= 650
  ) {
    const longTextCount = Math.max(longTextBlocks.length, objectInventory.summary.longTextBlocks);
    findings.push({
      ruleId: "text-heavy-block",
      confidence: longTextBlocks.length >= 2 ? 0.68 : 0.55,
      evidence: [
        longTextCount
          ? `${longTextCount} long text block(s) were detected.`
          : `The selected block contains ${(input.counts?.textLength ?? 0)} characters of text.`,
        ...longTextBlocks
          .slice(0, 2)
          .map((element) => `Long copy: "${truncate(element.text, 110)}".`)
      ]
    });
  }

  // --- actions: weak primary action --------------------------------------
  const actionElements = elements.filter(isActionElement);
  const conversionSection = ["hero", "cta", "pricing", "form", "auth"].includes(sectionType);
  if (conversionSection && actionElements.length === 0 && objectInventory.summary.actions === 0) {
    findings.push({
      ruleId: "weak-primary-action",
      confidence: 0.62,
      evidence: [`The ${sectionType} block has no obvious button/link primary action.`]
    });
  } else if (
    actionElements.length >= 2 &&
    actionsHaveSimilarWeight(actionElements)
  ) {
    findings.push({
      ruleId: "weak-primary-action",
      confidence: 0.58,
      evidence: [
        `${actionElements.length} actions have similar visual weight, so the primary next step is unclear.`,
        `Actions: ${actionElements.slice(0, 4).map((element) => `"${truncate(element.text || element.ariaLabel || element.tagName, 32)}"`).join(", ")}.`
      ]
    });
  }

  // --- typography: too many muted labels ---------------------------------
  const mutedLabels = elements.filter((element) => isMutedSmallText(element, input));
  if (mutedLabels.length >= 4) {
    findings.push({
      ruleId: "too-many-muted-labels",
      confidence: confidenceFromCount(mutedLabels.length, total, 0.5),
      evidence: [`${mutedLabels.length} low-contrast muted labels were detected.`]
    });
  }

  // --- motion: decorative hover transforms (class-based) -----------------
  const transformHits = countClassMatches(elements, [
    "hover:scale",
    "hover:-translate",
    "hover:translate",
    "transition-transform",
    "hover:rotate"
  ]);
  if (transformHits >= 1) {
    findings.push({
      ruleId: "transform-hover-overuse",
      confidence: confidenceFromCount(transformHits, total, 0.5),
      evidence: [`Detected hover transform classes on ${transformHits} element(s).`]
    });
  }

  // --- motion: design-engineering quality signals ------------------------
  const motionQualitySignals = findUnboundedMotionSignals(cssText, classText);
  if (motionQualitySignals.length >= 1) {
    findings.push({
      ruleId: "unbounded-sluggish-motion",
      confidence: motionQualitySignals.length >= 2 ? 0.68 : 0.58,
      evidence: [
        "CSS motion uses broad, sluggish, or weak timing.",
        `Signal: ${motionQualitySignals.slice(0, 3).join(", ")}.`
      ]
    });
  }

  const layoutMotionSignals = findLayoutPropertyAnimationSignals(cssText);
  if (layoutMotionSignals.length >= 1) {
    findings.push({
      ruleId: "layout-property-animation",
      confidence: layoutMotionSignals.length >= 2 ? 0.68 : 0.58,
      evidence: [
        "CSS motion targets layout properties instead of GPU-friendly properties.",
        `Signal: ${layoutMotionSignals.slice(0, 3).join(", ")}.`
      ]
    });
  }

  if (hasMovementMotionWithoutReducedFallback(cssText, classText)) {
    findings.push({
      ruleId: "motion-reduced-accessibility-missing",
      confidence: 0.56,
      evidence: [
        "Movement animation was detected without a matching prefers-reduced-motion fallback."
      ]
    });
  }

  // --- badges: decorative badges -----------------------------------------
  const badgeHits = countClassMatches(elements, ["badge", "tag", "chip", "pill"]);
  if (badgeHits >= 3) {
    findings.push({
      ruleId: "decorative-badges",
      confidence: confidenceFromCount(badgeHits, total, 0.5),
      evidence: [`${badgeHits} badge/tag/chip elements were detected.`]
    });
  }

  const announcementBubbleSignals = findDecorativeAnnouncementBubbleSignals(
    sourceText,
    classText,
    cssText,
    elements
  );
  if (announcementBubbleSignals.length >= 1) {
    findings.push({
      ruleId: "decorative-announcement-bubble",
      confidence: announcementBubbleSignals.length >= 2 ? 0.68 : 0.58,
      evidence: [
        "A large announcement/status pill appears to be used as decoration.",
        `Signal: ${announcementBubbleSignals.slice(0, 4).join(", ")}.`
      ]
    });
  }

  const decorativeStatusDotSignals = findDecorativeStatusDotSignals(
    sourceText,
    classText,
    cssText,
    elements
  );
  if (decorativeStatusDotSignals.length >= 1) {
    findings.push({
      ruleId: "decorative-status-dots",
      confidence: decorativeStatusDotSignals.length >= 2 ? 0.64 : 0.54,
      evidence: [
        "Status-dot or pulse indicators appear to be used as decoration.",
        `Signal: ${decorativeStatusDotSignals.slice(0, 4).join(", ")}.`
      ]
    });
  }

  const fakeChartSignals = findFakeChartSignals(sourceText, cssText, fullText, sectionType);
  if (fakeChartSignals.length >= 1) {
    findings.push({
      ruleId: "fake-charts",
      confidence: fakeChartSignals.length >= 2 ? 0.66 : 0.56,
      evidence: [
        "Chart/metric visuals appear decorative or placeholder-like.",
        `Signal: ${fakeChartSignals.slice(0, 4).join(", ")}.`
      ]
    });
  }

  // --- navigation: floating sidebar shell --------------------------------
  const sidebar = elements.find((element) => isFloatingSidebar(element, classText));
  if (sidebar) {
    findings.push({
      ruleId: "sidebar-floating-shell",
      confidence: 0.5,
      evidence: [
        `A sidebar with rounded outer corners / floating shell was detected (${describeElement(sidebar)}).`
      ]
    });
  }

  // --- nav/footer: generic AI sitemap shape ------------------------------
  const navFooterSignal = findAiNavFooterTemplateSignal(elements, fullText, sectionType);
  if (navFooterSignal) {
    findings.push({
      ruleId: "ai-nav-footer-template",
      confidence: navFooterSignal.kind === "footer" ? 0.66 : 0.6,
      evidence: [
        `Generic ${navFooterSignal.kind} template detected.`,
        `Visible copy: "${truncate(navFooterSignal.example, 110)}".`
      ]
    });
  }

  const aiDefaultRuleCount = findings.filter((finding) =>
    [
      "gradient-overuse",
      "glow-heavy-ui",
      "glassmorphism-default",
      "dramatic-shadows",
      "repetitive-equal-cards",
      "nested-panel-overload",
      "blue-cyan-ai-dashboard",
      "monotonous-section-rhythm",
      "fake-premium-copy",
      "formulaic-ai-copy",
      "ai-slop-phrase-tells",
      "ai-punctuation-tells",
      "emoji-iconography",
      "redrawn-ui-chrome",
      "placeholder-proof-copy",
      "ai-nav-footer-template",
      "left-border-accent-cards",
      "duplicate-cta-intent",
      "cheap-section-meta-labels",
      "centered-stack-default",
      "mobile-viewport-height-risk",
      "pure-black-surface",
      "placeholder-dead-links",
      "arbitrary-z-index",
      "overwide-paragraph-measure",
      "default-font-stack-template",
      "icon-tile-feature-cards",
      "decorative-status-dots",
      "fake-charts",
      "tiny-touch-targets",
      "icon-button-missing-label",
      "placeholder-only-form-labels",
      "unbounded-sluggish-motion",
      "layout-property-animation",
      "decorative-announcement-bubble"
    ].includes(finding.ruleId)
  ).length;
  if (aiDefaultRuleCount >= 4 && !findings.some((finding) => finding.ruleId === "generic-saas-composition")) {
    findings.push({
      ruleId: "generic-saas-composition",
      confidence: 0.7,
      evidence: [
        `${aiDefaultRuleCount} AI-default visual/composition patterns appear together in this block.`
      ]
    });
  }

  return dedupeByRuleId(findings);
}

// --- evidence helpers ----------------------------------------------------

function sampleRadiusEvidence(elements: MatchedElement[]): string[] {
  return elements
    .slice(0, 2)
    .map((element) => `${describeElement(element)} radius: ${element.style.borderRadius}.`);
}

function samplePillEvidence(elements: MatchedElement[]): string[] {
  return elements
    .slice(0, 2)
    .map((element) => `${describeElement(element)} is pill-shaped.`);
}

function describeElement(element: MatchedElement): string {
  const tag = element.tagName ? element.tagName.toLowerCase() : "element";
  const firstClass = (element.className ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join(".");
  return firstClass ? `${tag}.${firstClass}` : tag;
}

function hasGenericPremiumCopy(text: string): boolean {
  return /\b(seamless|effortless|powerful|beautiful|modern|intuitive|unlock|supercharge|elevate|transform|streamline|clarity|delightful|next-generation|all-in-one)\b/i.test(text);
}

function findGenericCopyExample(elements: MatchedElement[]): string {
  return (
    elements.find((element) => hasGenericPremiumCopy(element.text))?.text ||
    elements.find((element) => element.text.trim().length > 20)?.text ||
    ""
  );
}

type FormulaicCopySignal = {
  label: string;
  example: string;
};

const FORMULAIC_COPY_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  {
    label: "throat-clearing opener",
    regex:
      /\b(here'?s the thing|here'?s why|it turns out|let me be clear|the truth is|the reality is|the real [a-z0-9\s-]{1,32} is|can we talk about)\b/i
  },
  {
    label: "rhetorical setup",
    regex:
      /\b(what if|imagine a world where|in a world where|think about it|here'?s what i mean|why does this matter|and that'?s okay)\b/i
  },
  {
    label: "emphasis crutch",
    regex:
      /\b(full stop|let that sink in|make no mistake|this matters because|here'?s why that matters)\b/i
  },
  {
    label: "binary contrast structure",
    regex:
      /\b(not because\b[^.?!]{0,120}\bbecause\b|not just\b[^.?!]{2,120}\bbut also\b|not\b[^.?!]{2,90}\bbut\b|isn'?t\b[^.?!]{2,90}\bit'?s\b)\b/i
  },
  {
    label: "generic business phrasing",
    regex:
      /\b(navigate challenges|lean into|game[- ]changer|deep dive|moving forward|circle back|at its core|at the end of the day|when it comes to|the implications are significant|the stakes are high|the consequences are real)\b/i
  },
  {
    label: "vague generated declarative",
    regex:
      /\b(the reasons are structural|this is what [a-z0-9\s-]{1,36} actually looks like|what actually matters|the future of [a-z0-9\s-]{2,32})\b/i
  }
];

function findFormulaicCopySignals(
  elements: MatchedElement[],
  fullText: string
): FormulaicCopySignal[] {
  const visibleCopy = elements
    .map((element) => (element.text ?? "").trim())
    .filter((text) => text.length >= 24 || wordCount(text) >= 5);
  const candidates = [
    ...visibleCopy,
    ...(fullText.trim().length >= 90 ? [fullText.trim()] : [])
  ];
  const signals: FormulaicCopySignal[] = [];
  const seen = new Set<string>();

  for (const pattern of FORMULAIC_COPY_PATTERNS) {
    const match = candidates.find((text) =>
      pattern.regex.test(normalizeCopyForDetection(text))
    );
    if (!match || seen.has(pattern.label)) continue;
    signals.push({ label: pattern.label, example: match });
    seen.add(pattern.label);
  }

  return signals;
}

const AI_SLOP_PHRASE_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  {
    label: "generic current-era opener",
    regex: /\bin today'?s\s+(?:competitive|fast[- ]paced|digital|modern|ever[- ]evolving)\s+[a-z-]+\b/i
  },
  {
    label: "note-taking preface",
    regex: /\bit'?s\s+(?:worth|important|crucial)\s+to\s+note\s+that\b/i
  },
  {
    label: "dive/delve setup",
    regex: /\blet'?s\s+(?:dive|delve)(?:\s+(?:in|into|deeper))?\b/i
  },
  {
    label: "realm / landscape abstraction",
    regex: /\b(?:in the realm of|competitive landscape|digital landscape|evolving landscape)\b/i
  },
  {
    label: "range-persona opener",
    regex: /\bwhether you'?re (?:a|an)\s+[^.?!]{1,50}\s+or\s+(?:a|an)\s+[^.?!]{1,50}\b/i
  },
  {
    label: "generated explainer bridge",
    regex: /\bthis is where\s+[^.?!]{1,60}\s+comes in\b/i
  },
  {
    label: "generic conclusion phrase",
    regex: /\b(?:at the end of the day|the bottom line is|in conclusion|in a nutshell|without further ado)\b/i
  },
  {
    label: "generic uplift CTA phrase",
    regex: /\b(?:unlock the power of|take (?:it|your [a-z\s-]{1,30}) to the next level|bridge the gap|move the needle)\b/i
  },
  {
    label: "stock email courtesy phrase",
    regex: /\b(?:i hope this (?:email )?finds you well|i hope this helps|please don'?t hesitate to reach out)\b/i
  },
  {
    label: "assistant-style opener",
    regex: /^(?:certainly|absolutely|sure|moreover|furthermore|additionally|importantly|notably),\b/i
  }
];

const AI_SLOP_VOCABULARY_PATTERNS: RegExp[] = [
  /\b(?:delve|delves|delving)\b/i,
  /\btapestry\b/i,
  /\btestament to\b/i,
  /\b(?:pivotal|crucial|intricate|meticulous|multifaceted|nuanced|paramount|groundbreaking|cutting-edge|game-changing|transformative|unprecedented|remarkable|profound)\b/i,
  /\b(?:bolster|garner|underscore|foster|leverage|utilize|commence|facilitate|encompass|spearhead|navigate|showcase|highlight|emphasize|enhance)\w*\b/i,
  /\b(?:seamless|seamlessly|robust|comprehensive|synergy|pain points|value proposition|moving forward|touch base|circle back|rest assured)\b/i
];

function findAiSlopPhraseSignals(
  elements: MatchedElement[],
  fullText: string
): FormulaicCopySignal[] {
  const candidates = [
    ...elements
      .map((element) => (element.text ?? "").trim())
      .filter((text) => text.length >= 12 || wordCount(text) >= 3),
    ...(fullText.trim().length >= 40 ? [fullText.trim()] : [])
  ];
  const signals: FormulaicCopySignal[] = [];
  const seen = new Set<string>();

  for (const pattern of AI_SLOP_PHRASE_PATTERNS) {
    const match = candidates.find((text) =>
      pattern.regex.test(normalizeCopyForDetection(text))
    );
    if (!match || seen.has(pattern.label)) continue;
    signals.push({ label: pattern.label, example: match });
    seen.add(pattern.label);
  }

  const vocabularyHits = AI_SLOP_VOCABULARY_PATTERNS.filter((regex) =>
    regex.test(normalizeCopyForDetection(fullText))
  ).length;
  if (vocabularyHits >= 3 && !seen.has("AI vocabulary cluster")) {
    signals.push({
      label: "AI vocabulary cluster",
      example: findAiSlopVocabularyExample(elements, fullText)
    });
  }

  return signals;
}

function findAiSlopVocabularyExample(
  elements: MatchedElement[],
  fullText: string
): string {
  return (
    elements.find((element) =>
      AI_SLOP_VOCABULARY_PATTERNS.some((regex) =>
        regex.test(normalizeCopyForDetection(element.text ?? ""))
      )
    )?.text ||
    fullText
  );
}

function findAiPunctuationTellSignals(fullText: string): string[] {
  const signals: string[] = [];
  const emDashCount = countRegexMatches(fullText, /—/g);
  const exclamationCount = countRegexMatches(fullText, /!/g);
  const ellipsisCount = countRegexMatches(fullText, /(?:\.\.\.|…)/g);

  if (emDashCount >= 2) signals.push(`${emDashCount} em dashes`);
  if (exclamationCount >= 3) signals.push(`${exclamationCount} exclamation marks`);
  if (ellipsisCount >= 2) signals.push(`${ellipsisCount} ellipsis markers`);

  return signals;
}

function normalizeCopyForDetection(text: string): string {
  return text
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, "\"")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function findEmojiIconographySignals(elements: MatchedElement[]): string[] {
  const signals: string[] = [];
  const seen = new Set<string>();

  for (const element of elements) {
    const text = (element.text ?? "").trim();
    if (!text || !hasEmoji(text) || !isLikelyDecorativeEmojiUse(element, text)) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    signals.push(text);
    seen.add(key);
  }

  return signals;
}

function hasEmoji(text: string): boolean {
  return /\p{Extended_Pictographic}/u.test(text);
}

function isLikelyDecorativeEmojiUse(element: MatchedElement, text: string): boolean {
  const tag = (element.tagName ?? "").toLowerCase();
  const identity = `${element.id ?? ""} ${element.className ?? ""} ${element.role ?? ""} ${element.ariaLabel ?? ""}`.toLowerCase();
  const compactText = text.replace(/\s+/g, " ");
  const startsWithEmoji = /^\p{Extended_Pictographic}/u.test(compactText);
  const shortUiText = compactText.length <= 90 && wordCount(compactText) <= 10;
  const uiTag = /^(h[1-6]|button|a|li|dt|summary)$/.test(tag);
  const uiClass = /\b(icon|feature|benefit|card|step|item|badge|chip|cta|button)\b/.test(identity);

  return startsWithEmoji || (shortUiText && (uiTag || uiClass));
}

function findDefaultFontStackTemplateSignals(
  input: LocalUncodixifyInput,
  elements: MatchedElement[]
): string[] {
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };

  const pageFamilies = input.pageDesignContext?.typography.fontFamilies ?? [];
  const tokenFamilies = [
    input.styleContext?.section.fontFamily,
    input.styleContext?.text.fontFamily,
    input.styleTokens?.section.fontFamily,
    input.styleTokens?.heading.fontFamily
  ].filter((value): value is string => Boolean(value));
  const families = uniqueFontFamilies([...pageFamilies, ...tokenFamilies]);
  if (!families.length) return signals;

  const meaningfulFamilies = families.filter((family) => !isGenericCssFamily(family));
  const defaultFamilies = meaningfulFamilies.filter(isDefaultGeneratedFontFamily);
  const hasNonDefaultFamily = meaningfulFamilies.some((family) => !isDefaultGeneratedFontFamily(family));
  const enoughSurface =
    (input.pageDesignContext?.sampledElements ?? 0) >= 8 ||
    elements.filter((element) => (element.text ?? "").trim()).length >= 6;

  if (!enoughSurface || hasNonDefaultFamily) return signals;
  if (meaningfulFamilies.length === 1 && defaultFamilies.length === 1) {
    push(`single default family "${meaningfulFamilies[0]}"`);
  }
  if (defaultFamilies.length >= 1 && (input.pageDesignContext?.typography.fontWeights.length ?? 0) <= 3) {
    push("limited type role variation");
  }
  if (
    (input.pageDesignContext?.sampledElements ?? 0) >= 20 &&
    (input.pageDesignContext?.typography.fontSizes.length ?? 0) <= 4
  ) {
    push("small page type scale sample");
  }

  return signals;
}

function uniqueFontFamilies(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const primary = normalizePrimaryFontFamily(value);
    if (!primary || seen.has(primary)) continue;
    seen.add(primary);
    result.push(primary);
  }
  return result;
}

function normalizePrimaryFontFamily(value: string): string {
  return value
    .split(",")[0]
    .replace(/["']/g, "")
    .trim()
    .toLowerCase();
}

function isGenericCssFamily(family: string): boolean {
  return /^(sans-serif|serif|monospace|system-ui|ui-sans-serif|ui-serif|ui-monospace|arial|helvetica)$/.test(family);
}

function isDefaultGeneratedFontFamily(family: string): boolean {
  return /^(inter|roboto|open sans|lato|poppins|dm sans|geist|geistsans|system-ui|arial|helvetica)$/.test(family);
}

function buildSourceSignalText(
  input: LocalUncodixifyInput,
  elements: MatchedElement[]
): string {
  const elementIdentity = elements
    .slice(0, 80)
    .map((element) =>
      [
        element.tagName,
        element.id ?? "",
        element.className ?? "",
        element.role ?? "",
        element.ariaLabel ?? "",
        element.text ?? ""
      ].join(" ")
    )
    .join(" ");
  const sourceHtml = [
    input.selectedSourceSection?.htmlPreview ?? "",
    ...(input.sourceSections ?? []).slice(0, 4).map((section) => section.htmlPreview ?? "")
  ].join(" ");
  return [elementIdentity, sourceHtml, input.usedCssRules?.cssText ?? ""]
    .join(" ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function findRedrawnChromeSignals(
  sourceText: string,
  elements: MatchedElement[]
): string[] {
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };
  const identityText = elements
    .map((element) => `${element.tagName} ${element.id ?? ""} ${element.className ?? ""} ${element.ariaLabel ?? ""}`)
    .join(" ")
    .toLowerCase();
  const text = `${sourceText} ${identityText}`;

  if (/\b(browser|chrome|window|mockup|preview)[-_ ]?(bar|frame|chrome|window)\b/.test(text)) {
    push("browser/window frame class");
  }
  if (/\b(traffic[-_ ]?lights?|mac[-_ ]?dots?|window[-_ ]?dots?|close[-_ ]?minimi[sz]e[-_ ]?maximi[sz]e)\b/.test(text)) {
    push("traffic-light dots");
  }
  if (/\b(url[-_ ]?bar|address[-_ ]?bar|fake[-_ ]?browser|browser[-_ ]?mockup)\b/.test(text)) {
    push("fake browser URL bar");
  }
  if (/\b(phone[-_ ]?(frame|mockup|shell|notch)|device[-_ ]?(frame|mockup|shell)|notch|speaker[-_ ]?slot)\b/.test(text)) {
    push("fake device frame");
  }
  if (/\b(code[-_ ]?(window|frame|mockup|shell)|terminal[-_ ]?(window|frame|chrome)|ide[-_ ]?(chrome|frame|mockup))\b/.test(text)) {
    push("fake code/terminal chrome");
  }

  return signals;
}

function findLeftBorderAccentSignals(
  sourceText: string,
  elements: MatchedElement[]
): string[] {
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };

  const leftBorderClassElements = elements.filter((element) => {
    const className = (element.className ?? "").toLowerCase();
    return (
      /\bborder-l-(?:2|4|8|\[[^\]]+\])\b/.test(className) &&
      /\bborder-(?:blue|cyan|sky|indigo|violet|purple|fuchsia|pink|rose|red|orange|amber|yellow|lime|green|emerald|teal)-/.test(className)
    );
  });
  if (leftBorderClassElements.length >= 2) {
    push(`${leftBorderClassElements.length} elements use border-l accent color utilities`);
  }

  const cssLeftBorderHits = countRegexMatches(
    sourceText,
    /border-left(?:-width)?\s*:\s*(?:[3-9]|\d{2,})px|border-left\s*:\s*(?:[3-9]|\d{2,})px\s+solid/g
  );
  if (cssLeftBorderHits >= 1) {
    push(`${cssLeftBorderHits} CSS left-border accent declaration(s)`);
  }

  return signals;
}

function findTinyTouchTargets(elements: MatchedElement[]): MatchedElement[] {
  return elements.filter((element) => {
    if (!isInteractiveElement(element)) return false;
    const width = element.rect?.width ?? 0;
    const height = element.rect?.height ?? 0;
    if (width <= 0 || height <= 0) return false;
    if (width >= 44 && height >= 44) return false;

    const tag = (element.tagName ?? "").toLowerCase();
    const label = (element.text || element.ariaLabel || "").trim();
    const identity = `${element.id ?? ""} ${element.className ?? ""} ${element.role ?? ""}`.toLowerCase();
    const iconLike = /\b(icon|close|menu|search|settings|more|chevron|arrow|toggle|copy|trash|edit)\b/.test(`${identity} ${label}`);

    // Avoid flagging ordinary inline text links as mobile controls.
    return tag === "button" || element.role === "button" || iconLike || height < 28;
  });
}

function findUnnamedIconButtonSignals(
  sourceText: string,
  elements: MatchedElement[]
): string[] {
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };

  const unnamedElements = elements.filter((element) => {
    if (!isInteractiveElement(element)) return false;
    if ((element.text ?? "").trim() || (element.ariaLabel ?? "").trim()) return false;
    const identity = `${element.tagName} ${element.id ?? ""} ${element.className ?? ""} ${element.role ?? ""}`.toLowerCase();
    const compactControl = (element.rect?.width ?? 0) <= 64 && (element.rect?.height ?? 0) <= 64;
    return compactControl || /\b(icon|icon-button|close|menu|search|settings|more|kebab|ellipsis|chevron)\b/.test(identity);
  });
  if (unnamedElements.length >= 1) {
    push(`${unnamedElements.length} empty icon-like matched control(s)`);
  }

  const html = sourceText.toLowerCase();
  const buttonMatches = html.match(/<(button|a)\b(?=[^>]*(?:svg|lucide|icon|icon-button))(?!(?=[^>]*(?:aria-label|aria-labelledby|title=)))[^>]*>/g) ?? [];
  if (buttonMatches.length >= 1) {
    push(`${buttonMatches.length} icon-only button/link tag(s) without aria label`);
  }

  return signals;
}

function findPlaceholderOnlyInputSignals(sourceText: string): string[] {
  const html = sourceText.toLowerCase();
  const signals: string[] = [];
  const inputTags = html.match(/<(input|textarea)\b[^>]*>/g) ?? [];
  if (!inputTags.length) return signals;

  const hasAnyLabel =
    /<label\b/.test(html) ||
    /\baria-label\s*=/.test(html) ||
    /\baria-labelledby\s*=/.test(html) ||
    /\bdata-floating-label\b/.test(html) ||
    /\bfloating[-_ ]?label\b/.test(html);

  const placeholderOnly = inputTags.filter((tag) => {
    if (!/\bplaceholder\s*=/.test(tag)) return false;
    if (/\b(aria-label|aria-labelledby|title)\s*=/.test(tag)) return false;
    if (/\btype\s*=\s*["']?(hidden|submit|button|checkbox|radio)\b/.test(tag)) return false;
    return true;
  });

  if (placeholderOnly.length >= 1 && !hasAnyLabel) {
    signals.push(`${placeholderOnly.length} placeholder-only input tag(s)`);
  }

  return signals;
}

type DuplicateCtaIntentSignal = {
  intent: string;
  uniqueLabels: string[];
};

const CTA_INTENT_PATTERNS: Array<{ intent: string; regex: RegExp }> = [
  {
    intent: "contact",
    regex: /\b(contact(?:\s+us)?|get in touch|let'?s talk|reach out|start a project|book a call|schedule a call)\b/i
  },
  {
    intent: "start/signup",
    regex: /\b(get started|start free|try free|try it free|sign up|create account|join waitlist|join now)\b/i
  },
  {
    intent: "demo",
    regex: /\b(book demo|request demo|watch demo|see demo|view demo)\b/i
  },
  {
    intent: "purchase",
    regex: /\b(buy|buy now|buy credits|purchase|upgrade|subscribe|checkout)\b/i
  },
  {
    intent: "portfolio",
    regex: /\b(view work|see work|browse projects|view projects|case studies|see cases)\b/i
  }
];

function findDuplicateCtaIntentSignal(
  elements: MatchedElement[]
): DuplicateCtaIntentSignal | null {
  const labels = elements
    .filter(isActionElement)
    .map((element) => ((element.text ?? "") || (element.ariaLabel ?? "")).trim())
    .filter((label) => label.length >= 3 && label.length <= 64);
  if (labels.length < 2) return null;

  for (const pattern of CTA_INTENT_PATTERNS) {
    const uniqueLabels = uniqueNormalizedLabels(
      labels.filter((label) => pattern.regex.test(normalizeCopyForDetection(label)))
    );
    if (uniqueLabels.length >= 2) {
      return {
        intent: pattern.intent,
        uniqueLabels
      };
    }
  }

  return null;
}

function uniqueNormalizedLabels(labels: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const label of labels) {
    const normalized = normalizeCopyForDetection(label);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    unique.push(label);
  }
  return unique;
}

function findCheapSectionMetaLabelSignals(
  elements: MatchedElement[],
  sourceText: string
): string[] {
  const signals: string[] = [];
  const push = (label: string) => {
    const clean = label.replace(/\s+/g, " ").trim();
    if (clean && !signals.includes(clean)) signals.push(clean);
  };

  const visibleCandidates = elements
    .map((element) => (element.text ?? "").trim())
    .filter((text) => text.length >= 3 && text.length <= 48);
  for (const text of visibleCandidates) {
    if (isCheapSectionMetaLabel(text)) push(text);
  }

  const htmlTextCandidates =
    sourceText
      .match(/>([^<]{3,48})</g)
      ?.map((match) => match.slice(1, -1).trim())
      .filter(Boolean) ?? [];
  for (const text of htmlTextCandidates) {
    if (isCheapSectionMetaLabel(text)) push(text);
  }

  return signals;
}

function isCheapSectionMetaLabel(text: string): boolean {
  const normalized = normalizeCopyForDetection(text).replace(/[•]/g, "·");
  return (
    /\b(section|question|chapter|stage|phase|step)\s*(?:0?\d{1,2}|[ivx]{1,4})\b/i.test(normalized) ||
    /\b(?:0?\d{1,3})\s*(?:\/|\.|·|-)\s*(?:index|about|overview|capabilities|features|work|faq|story)\b/i.test(normalized) ||
    /\b(?:index|about|overview|capabilities|features|work|faq|story)\s*(?:\/|\.|·|-)\s*(?:0?\d{1,3})\b/i.test(normalized)
  );
}

function findCenteredStackDefaultSignals(
  classText: string,
  sourceText: string,
  layoutType: RectangleCapture["detected"]["layoutType"] | undefined,
  sectionType: string
): string[] {
  if (sectionType === "navigation" || sectionType === "footer") return [];

  const source = sourceText.toLowerCase();
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };

  const classSignals: Array<[string, RegExp]> = [
    ["text-center", /\btext-center\b/g],
    ["items-center", /\bitems-center\b/g],
    ["justify-center", /\bjustify-center\b/g],
    ["place-items-center", /\bplace-items-center\b/g],
    ["mx-auto", /\bmx-auto\b/g],
    ["content-center", /\bcontent-center\b/g]
  ];
  const cssSignals: Array<[string, RegExp]> = [
    ["text-align:center", /text-align\s*:\s*center/g],
    ["align-items:center", /align-items\s*:\s*center/g],
    ["justify-content:center", /justify-content\s*:\s*center/g],
    ["margin auto centering", /margin(?:-[a-z]+)?\s*:\s*(?:0\s+)?auto/g]
  ];

  let hitCount = 0;
  for (const [label, regex] of classSignals) {
    const count = countRegexMatches(classText, regex);
    if (count <= 0) continue;
    hitCount += count;
    push(`${label} x${count}`);
  }
  for (const [label, regex] of cssSignals) {
    const count = countRegexMatches(source, regex);
    if (count <= 0) continue;
    hitCount += count;
    push(`${label} x${count}`);
  }

  const defaultLayout =
    layoutType === "vertical_stack" || layoutType === "equal_grid" || layoutType === "unknown" || !layoutType;
  return hitCount >= 3 && defaultLayout ? signals : [];
}

function findMobileViewportHeightRiskSignals(
  sourceText: string,
  classText: string,
  cssText: string
): string[] {
  const combined = `${sourceText}\n${classText}\n${cssText}`.toLowerCase();
  if (/\b100dvh\b|\b100svh\b|\b100lvh\b/.test(combined)) return [];

  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };
  if (/\bh-screen\b/.test(combined)) push("h-screen");
  if (/\bmin-h-screen\b/.test(combined)) push("min-h-screen");
  if (/\bheight\s*:\s*100vh\b/.test(combined)) push("height: 100vh");
  if (/\bmin-height\s*:\s*100vh\b/.test(combined)) push("min-height: 100vh");

  return signals;
}

function findPureBlackSurfaceSignals(
  elements: MatchedElement[],
  sourceText: string,
  cssText: string
): string[] {
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };

  const blackElements = elements.filter((element) =>
    isPureBlackCssColor(element.style.backgroundColor)
  );
  if (blackElements.length >= 1) {
    push(`${blackElements.length} element(s) have computed pure black background`);
  }

  const combined = `${sourceText}\n${cssText}`.toLowerCase();
  if (/\bbg-black\b|\bbg-\[#000(?:000)?\]/.test(combined)) push("Tailwind pure-black background utility");
  if (/(?:background|background-color)\s*:\s*(?:#000(?:000)?\b|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)|black\b)/.test(combined)) {
    push("pure-black background declaration");
  }

  return signals;
}

function isPureBlackCssColor(value: string | undefined): boolean {
  const color = parseColor(value);
  return Boolean(color && color.r === 0 && color.g === 0 && color.b === 0 && (color.a ?? 1) >= 0.95);
}

function findPlaceholderDeadLinkSignals(sourceText: string): string[] {
  const html = sourceText.toLowerCase();
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };

  const hashLinks = html.match(/<a\b[^>]*\bhref\s*=\s*["']#["'][^>]*>/g) ?? [];
  if (hashLinks.length >= 1) push(`${hashLinks.length} href="#" link(s)`);

  const javascriptLinks = html.match(/<a\b[^>]*\bhref\s*=\s*["']javascript:void\(0\)["'][^>]*>/g) ?? [];
  if (javascriptLinks.length >= 1) push(`${javascriptLinks.length} javascript:void(0) link(s)`);

  const todoLinks = html.match(/<a\b[^>]*\bhref\s*=\s*["'](?:\/?todo|\/?placeholder|\/?coming-soon)["'][^>]*>/g) ?? [];
  if (todoLinks.length >= 1) push(`${todoLinks.length} placeholder destination link(s)`);

  return signals;
}

function findMissingImageAltSignals(sourceText: string): string[] {
  const html = sourceText.toLowerCase();
  const imgTags = html.match(/<img\b[^>]*>/g) ?? [];
  const signals: string[] = [];

  for (const tag of imgTags) {
    if (!/\balt\s*=/.test(tag)) {
      signals.push("img without alt attribute");
      continue;
    }
    if (/\balt\s*=\s*(?:"\s*"|'\s*')/.test(tag)) {
      signals.push("img with empty alt");
      continue;
    }
    if (/\balt\s*=\s*(?:"(?:image|photo|picture|graphic|icon)"|'(?:image|photo|picture|graphic|icon)')/.test(tag)) {
      signals.push("img with generic alt text");
    }
  }

  return [...new Set(signals)];
}

function findArbitraryZIndexSignals(
  sourceText: string,
  cssText: string,
  classText: string
): string[] {
  const combined = `${sourceText}\n${cssText}\n${classText}`.toLowerCase();
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };

  const cssZMatches = combined.match(/\bz-index\s*:\s*(?:999|[1-9]\d{3,})\b/g) ?? [];
  if (cssZMatches.length >= 1) push(`${cssZMatches.length} high z-index declaration(s)`);

  const arbitraryTailwindMatches = combined.match(/\bz-\[(?:999|[1-9]\d{3,})\]/g) ?? [];
  if (arbitraryTailwindMatches.length >= 1) push(`${arbitraryTailwindMatches.length} arbitrary Tailwind z-index utility class(es)`);

  return signals;
}

function findOverwideParagraphSignals(elements: MatchedElement[]): string[] {
  return elements
    .filter((element) => {
      const tag = (element.tagName ?? "").toLowerCase();
      const text = (element.text ?? "").trim();
      if (tag !== "p" && tag !== "blockquote" && tag !== "li") return false;
      if (wordCount(text) < 14) return false;
      return (element.rect?.width ?? 0) >= 760;
    })
    .map((element) => `${describeElement(element)} is ${Math.round(element.rect.width)}px wide with ${wordCount(element.text)} words.`);
}

function findIconTileFeatureCardSignals(
  sourceText: string,
  classText: string,
  fullText: string,
  equalCardCount: number,
  equalGrid: boolean,
  inventoryCardCount: number,
  sectionType: string
): string[] {
  if (!["features", "cards", "unknown"].includes(sectionType)) return [];

  const combined = `${sourceText}\n${classText}`.toLowerCase();
  const cardCount = Math.max(equalCardCount, inventoryCardCount);
  const hasFeatureLanguage =
    /\b(feature|benefit|capabilit|workflow|step|how it works|why choose)\b/i.test(fullText) ||
    /\b(feature|benefit|capabilit|workflow|step)[-_ ]?(card|grid|item)?\b/.test(combined);
  const hasIconTile =
    /\b(icon[-_ ]?(tile|box|wrap|badge|container)|lucide|heroicon|phosphor|iconbox|icon-card)\b/.test(combined) ||
    /\b(?:w|h)-(?:8|9|10|11|12|14|16)\b[\s\S]{0,80}\brounded(?:-[a-z0-9[\]]+)?\b/.test(combined) ||
    /\brounded(?:-[a-z0-9[\]]+)?\b[\s\S]{0,80}\b(?:svg|icon)\b/.test(combined);
  const repeatedCards = cardCount >= 3 || equalGrid;
  if (!repeatedCards || !hasFeatureLanguage || !hasIconTile) return [];

  const signals: string[] = [];
  if (cardCount >= 3) signals.push(`${cardCount} feature/card containers`);
  if (equalGrid) signals.push("equal-grid layout");
  if (hasIconTile) signals.push("rounded icon tile/source icon pattern");
  if (hasFeatureLanguage) signals.push("feature/workflow copy language");
  return signals;
}

type PlaceholderProofSignal = {
  label: string;
  example: string;
};

const PLACEHOLDER_PROOF_PATTERNS: Array<{ label: string; regex: RegExp }> = [
  {
    label: "placeholder person/company name",
    regex: /\b(jane doe|john smith|acme|lorem ipsum|your company|company name)\b/i
  },
  {
    label: "stock trust metric",
    regex:
      /\b(trusted by\s+(?:50,?000\+?|10,?000\+?|thousands of|millions of)\s+(?:happy\s+)?(?:teams|companies|users|customers)|(?:50,?000\+?|10,?000\+?|1m\+|1,000,000\+?)\s+(?:happy\s+)?(?:teams|companies|users|customers))\b/i
  },
  {
    label: "stock performance metric",
    regex:
      /\b(10x faster|10× faster|2x faster|2× faster|3x faster|3× faster|saves? 5 hours per week|99\.9\s?%\s+uptime|\+47\s?%\s+conversion|\d{1,3}\s?%\s+(?:more|faster|better|increase|improvement))\b/i
  },
  {
    label: "generic fake quote",
    regex:
      /\b(this (?:product|platform|tool) (?:changed everything|saved us hours|is a game[- ]changer)|we could not imagine working without it)\b/i
  }
];

function findPlaceholderProofSignals(
  elements: MatchedElement[],
  fullText: string
): PlaceholderProofSignal[] {
  const candidates = [
    ...elements.map((element) => (element.text ?? "").trim()).filter(Boolean),
    fullText.trim()
  ].filter((text) => text.length >= 4);
  const signals: PlaceholderProofSignal[] = [];
  const seen = new Set<string>();

  for (const pattern of PLACEHOLDER_PROOF_PATTERNS) {
    const match = candidates.find((text) => pattern.regex.test(text));
    if (!match || seen.has(pattern.label)) continue;
    signals.push({ label: pattern.label, example: match });
    seen.add(pattern.label);
  }

  return signals;
}

type NavFooterTemplateSignal = {
  kind: "navigation" | "footer";
  example: string;
};

function findAiNavFooterTemplateSignal(
  elements: MatchedElement[],
  fullText: string,
  sectionType: string
): NavFooterTemplateSignal | null {
  const text = normalizeCopyForDetection(fullText);
  const linkishCount = elements.filter((element) => {
    const tag = (element.tagName ?? "").toLowerCase();
    return tag === "a" || tag === "button" || element.role === "button";
  }).length;
  const navWords = countRegexMatches(text, /\b(features?|pricing|docs?|blog|about|resources?|company|product|solutions?|customers?)\b/g);
  const footerColumns = countRegexMatches(text, /\b(product|company|resources?|legal|social|privacy|terms|security)\b/g);
  const navLike =
    (sectionType === "navigation" || /\b(nav|navbar|header)\b/i.test(elements.map((element) => `${element.tagName} ${element.className ?? ""} ${element.role ?? ""}`).join(" "))) &&
    linkishCount >= 4 &&
    navWords >= 4;
  const footerLike =
    (sectionType === "footer" || elements.some((element) => element.tagName === "footer")) &&
    footerColumns >= 4 &&
    linkishCount >= 4;

  if (footerLike) return { kind: "footer", example: fullText };
  if (navLike) return { kind: "navigation", example: fullText };
  return null;
}

function findDecorativeStatusDotSignals(
  sourceText: string,
  classText: string,
  cssText: string,
  elements: MatchedElement[]
): string[] {
  const combined = `${sourceText}\n${classText}\n${cssText}`.toLowerCase();
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };

  const pulseNearBadge = countRegexMatches(
    combined,
    /\b(?:animate-(?:pulse|ping)|pulse|ping|blinking|live[-_ ]?dot|status[-_ ]?dot)\b[\s\S]{0,100}\b(?:badge|pill|chip|new|live|available|online|ai-powered)\b/g
  );
  if (pulseNearBadge >= 1) push(`${pulseNearBadge} pulse/status-dot badge signal(s)`);

  const beforeDot = countRegexMatches(
    combined,
    /::before[\s\S]{0,220}(?:border-radius\s*:\s*50%|rounded-full)[\s\S]{0,220}(?:animation|pulse|ping|box-shadow)/g
  );
  if (beforeDot >= 1) push(`${beforeDot} animated pseudo-element dot(s)`);

  const visibleStatusLabels = elements.filter((element) => {
    const text = normalizeCopyForDetection(element.text ?? "");
    const identity = `${element.className ?? ""} ${element.id ?? ""} ${element.ariaLabel ?? ""}`.toLowerCase();
    return (
      /\b(new|live|online|available|active|ai-powered)\b/.test(text) &&
      /\b(badge|pill|chip|status|dot|pulse|ping)\b/.test(identity)
    );
  });
  if (visibleStatusLabels.length >= 1) {
    push(`${visibleStatusLabels.length} status-like badge label(s)`);
  }

  return signals;
}

function findDecorativeAnnouncementBubbleSignals(
  sourceText: string,
  classText: string,
  cssText: string,
  elements: MatchedElement[]
): string[] {
  const combined = `${sourceText}\n${classText}\n${cssText}`.toLowerCase();
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };

  const announcementPills = elements.filter((element) => {
    const text = normalizeCopyForDetection(element.text ?? "");
    const identity = `${element.className ?? ""} ${element.id ?? ""} ${element.role ?? ""} ${element.ariaLabel ?? ""}`.toLowerCase();
    const height = element.rect?.height ?? 0;
    const width = element.rect?.width ?? 0;
    const shortAnnouncement =
      wordCount(element.text ?? "") <= 6 &&
      hasAnnouncementBubbleCopy(element.text ?? "");
    const announcementIdentity =
      /\b(announcement|announce|badge|chip|pill|bubble|status|availability|available|coming[-_ ]?soon|soon|location)\b/.test(
        identity
      );
    return (
      shortAnnouncement &&
      isPillShaped(element) &&
      width >= 120 &&
      height >= 28 &&
      height <= 80 &&
      (announcementIdentity || hasVisiblePaint(element.style.backgroundColor))
    );
  });

  if (announcementPills.length >= 1) {
    push(
      `${announcementPills.length} pill-shaped short announcement badge(s): "${truncate(
        announcementPills[0].text,
        80
      )}"`
    );
  }

  const dotInsideAnnouncement = countRegexMatches(
    combined,
    /(?:dot|status[-_ ]?dot|indicator|before:|::before|rounded-full)[\s\S]{0,180}(?:coming[-_ ]?soon|soon|скоро|жакында|жақында|availability|available|location|badge|bubble|pill)/g
  );
  if (dotInsideAnnouncement >= 1) {
    push(`${dotInsideAnnouncement} decorative dot/indicator announcement signal(s)`);
  }

  const pastelBubbleSource = countRegexMatches(
    combined,
    /(?:coming[-_ ]?soon|soon|скоро|жакында|жақында)[\s\S]{0,240}(?:rounded-full|border-radius\s*:\s*(?:9999px|999px|50%)|pill|bubble|badge|chip)/g
  );
  if (pastelBubbleSource >= 1) {
    push(`${pastelBubbleSource} source/CSS announcement bubble signal(s)`);
  }

  return signals;
}

function hasAnnouncementBubbleCopy(value: string): boolean {
  const text = normalizeCopyForDetection(value);
  return /(?:coming soon|launching soon|available soon|opening soon|now open|new location|new city|\bsoon\b|скоро|жакында|жақында)/i.test(
    text
  );
}

function findFakeChartSignals(
  sourceText: string,
  cssText: string,
  fullText: string,
  sectionType: string
): string[] {
  const combined = `${sourceText}\n${cssText}`.toLowerCase();
  const text = normalizeCopyForDetection(fullText);
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };

  if (/\b(fake|placeholder|sample|dummy)[-_ ]?(chart|graph|metric|data)\b/.test(combined)) {
    push("placeholder/fake chart naming");
  }
  if (/\b(conic-gradient|donut[-_ ]?chart|pie[-_ ]?chart|sparkline|mini[-_ ]?chart)\b/.test(combined)) {
    const hasStockNumbers =
      /\b(?:75|80|82|85|90|92|95|99)\s?%\b/.test(text) ||
      /\b(?:conversion|growth|uptime|retention|engagement)\b/.test(text);
    const isDataSection = sectionType === "dashboard" || sectionType === "stats";
    if (!isDataSection || hasStockNumbers) {
      push("decorative chart primitive with stock metric language");
    }
  }
  if (
    countRegexMatches(text, /\b\d{1,3}\s?%\b/g) >= 3 &&
    /\b(?:chart|graph|sparkline|metric|kpi)\b/.test(combined) &&
    /\b(?:lorem|sample|placeholder|demo|dummy)\b/.test(combined)
  ) {
    push("multiple placeholder percentage metrics");
  }

  return signals;
}

function countRegexMatches(value: string, regex: RegExp): number {
  return (value.match(regex) ?? []).length;
}

function findUnboundedMotionSignals(cssText: string, classText: string): string[] {
  const css = cssText.toLowerCase();
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };

  if (/\btransition-all\b/.test(classText) || /transition(?:-property)?\s*:\s*all\b/.test(css)) {
    push("transition-all");
  }
  if (/(transition|animation)[^{};]*\bease-in\b/.test(css)) {
    push("ease-in timing");
  }
  if (hasLongUiMotionDuration(css)) {
    push("UI duration over 300ms");
  }
  if (/cubic-bezier\(\s*0\.42\s*,\s*0\s*,\s*1\s*,\s*1\s*\)/.test(css)) {
    push("built-in ease-in curve");
  }

  return signals;
}

function hasLongUiMotionDuration(cssText: string): boolean {
  const declarations = cssText.match(/(?:transition|animation)(?:-[a-z-]+)?\s*:[^;}]+/g) ?? [];
  return declarations.some((declaration) => extractDurationsMs(declaration).some((duration) => duration > 300));
}

function extractDurationsMs(value: string): number[] {
  const durations: number[] = [];
  const matches = value.matchAll(/(-?\d*\.?\d+)(ms|s)\b/g);
  for (const match of matches) {
    const amount = Number(match[1]);
    if (!Number.isFinite(amount) || amount < 0) continue;
    durations.push(match[2] === "s" ? amount * 1000 : amount);
  }
  return durations;
}

function findLayoutPropertyAnimationSignals(cssText: string): string[] {
  const css = cssText.toLowerCase();
  const signals: string[] = [];
  const push = (label: string) => {
    if (!signals.includes(label)) signals.push(label);
  };
  const layoutProperties = "(width|height|min-height|max-height|min-width|max-width|margin|padding|top|left|right|bottom)";

  if (new RegExp(`transition(?:-property)?\\s*:[^;}]*\\b${layoutProperties}\\b`).test(css)) {
    push("transitioning layout properties");
  }
  if (new RegExp(`@keyframes[\\s\\S]{0,800}\\b${layoutProperties}\\s*:`).test(css)) {
    push("keyframes animate layout properties");
  }
  if (/transition(?:-property)?\s*:\s*all\b/.test(css) && /\b(width|height|padding|margin|top|left|right|bottom)\s*:/.test(css)) {
    push("transition-all near layout styles");
  }

  return signals;
}

function hasMovementMotionWithoutReducedFallback(cssText: string, classText: string): boolean {
  const css = cssText.toLowerCase();
  if (!css.trim()) return false;
  if (/prefers-reduced-motion/.test(css)) return false;
  const hasMovement =
    /(?:transition|animation)(?:-[a-z-]+)?\s*:[^;}]*(transform|translate|scale|rotate|clip-path|top|left|right|bottom)/.test(css) ||
    /@keyframes[\s\S]{0,800}\b(transform|translate|scale|rotate|clip-path|top|left|right|bottom)\s*:/.test(css) ||
    /\b(hover:scale|hover:-?translate|transition-transform|animate-)/.test(classText);
  return hasMovement;
}

function wordCount(text: string | undefined): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function isActionElement(element: MatchedElement): boolean {
  const tag = (element.tagName ?? "").toLowerCase();
  const text = (element.text ?? "").trim();
  const identity = `${element.id ?? ""} ${element.className ?? ""} ${element.role ?? ""} ${element.ariaLabel ?? ""}`.toLowerCase();
  const buttonShape =
    (element.rect?.width ?? 0) >= 48 &&
    (element.rect?.width ?? 0) <= 280 &&
    (element.rect?.height ?? 0) >= 28 &&
    (element.rect?.height ?? 0) <= 76;

  return (
    tag === "button" ||
    element.role === "button" ||
    (tag === "a" && text.length > 0 && text.length <= 64) ||
    (buttonShape && /\b(btn|button|cta|action|submit|start|get|try|buy|book|join|sign|contact|demo)\b/i.test(`${identity} ${text}`))
  );
}

function isInteractiveElement(element: MatchedElement): boolean {
  const tag = (element.tagName ?? "").toLowerCase();
  const identity = `${element.id ?? ""} ${element.className ?? ""} ${element.role ?? ""} ${element.ariaLabel ?? ""}`.toLowerCase();

  return (
    tag === "button" ||
    tag === "a" ||
    tag === "input" ||
    tag === "select" ||
    tag === "textarea" ||
    element.role === "button" ||
    /\b(btn|button|cta|action|icon-button|clickable|link|toggle|tab|menuitem)\b/i.test(identity)
  );
}

function actionsHaveSimilarWeight(actions: MatchedElement[]): boolean {
  const visibleActions = actions.filter((action) => (action.text || action.ariaLabel || "").trim());
  if (visibleActions.length < 2) return false;

  const first = actionWeightSignature(visibleActions[0]);
  return visibleActions
    .slice(1)
    .filter((action) => actionWeightSignature(action) === first).length >= visibleActions.length - 1;
}

function actionWeightSignature(action: MatchedElement): string {
  const background = normalizeCssColor(action.style.backgroundColor);
  const color = normalizeCssColor(action.style.color);
  const radius = Math.round(maxBorderRadiusPx(action.style.borderRadius) / 4) * 4;
  const weight = Number.parseInt(action.style.fontWeight ?? "400", 10);
  const filled = background && !/rgba?\(0,\s*0,\s*0,\s*0\)|transparent/.test(background);
  return `${filled ? "filled" : "plain"}|${background}|${color}|${radius}|${Math.round(weight / 100)}`;
}

function normalizeCssColor(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, "").toLowerCase();
}

function hasVisiblePaint(value: string | undefined) {
  if (!value || value === "none" || value === "transparent") return false;
  if (/rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)/i.test(value)) return false;
  return true;
}

// --- numeric parsing -----------------------------------------------------

function parsePx(value: string | undefined): number {
  if (!value) return 0;
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number.parseFloat(match[0]) : 0;
}

function maxBorderRadiusPx(value: string | undefined): number {
  if (!value) return 0;
  if (/\d+%/.test(value)) {
    // percentage radius — only count as large if >= ~40%
    const pct = Number.parseFloat(value);
    return pct >= 40 ? 999 : 0;
  }
  const numbers = (value.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  return numbers.length ? Math.max(...numbers) : 0;
}

function isPillShaped(element: MatchedElement): boolean {
  const radius = element.style.borderRadius ?? "";
  if (/9999px|50%/.test(radius)) return true;
  const radiusPx = maxBorderRadiusPx(radius);
  const height = element.rect?.height ?? 0;
  // Pill = radius >= half the height on a short element (button/chip-like).
  return radiusPx >= 18 && height > 0 && height <= 72 && radiusPx >= height / 2 - 2;
}

function maxShadowBlurPx(value: string | undefined): number {
  if (!value || value === "none") return 0;
  // box-shadow: offsetX offsetY blur spread color — pick the largest 3rd number
  // across comma-separated shadows.
  const shadows = value.split(/,(?![^()]*\))/);
  let maxBlur = 0;
  for (const shadow of shadows) {
    const lengths = (shadow.match(/-?\d+(?:\.\d+)?px/g) ?? []).map((n) => Number.parseFloat(n));
    const blur = lengths[2] ?? 0;
    if (blur > maxBlur) maxBlur = blur;
  }
  return maxBlur;
}

function hasColoredShadow(value: string | undefined): boolean {
  if (!value || value === "none") return false;
  const colors = value.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}|hsla?\([^)]*\)/gi) ?? [];
  return colors.some((color) => {
    const parsed = parseColor(color);
    if (!parsed) return false;
    if (parsed.a !== undefined && parsed.a < 0.05) return false;
    // Colored = noticeably saturated (not gray/black) shadow.
    const max = Math.max(parsed.r, parsed.g, parsed.b);
    const min = Math.min(parsed.r, parsed.g, parsed.b);
    return max - min >= 40 && max >= 60;
  });
}

function maxPaddingPx(value: string | undefined): number {
  if (!value) return 0;
  const numbers = (value.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  return numbers.length ? Math.max(...numbers) : 0;
}

function isOnSpacingScale(value: number): boolean {
  if (value <= 0) return true;
  const scale = [4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96];
  return scale.some((step) => Math.abs(step - value) <= 1);
}

function isUppercaseLabel(element: MatchedElement): boolean {
  const text = (element.text ?? "").trim();
  if (!text || text.length > 28) return false;
  const letters = text.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 2) return false;
  return letters === letters.toUpperCase() && /[A-Z]/.test(letters);
}

function isHeadingLike(element: MatchedElement): boolean {
  const tag = (element.tagName ?? "").toLowerCase();
  if (/^h[1-4]$/.test(tag)) return true;
  if (element.role === "heading") return true;
  const weight = Number.parseInt(element.style.fontWeight ?? "", 10);
  const size = parsePx(element.style.fontSize);
  return size >= 20 && weight >= 600;
}

function isMutedSmallText(element: MatchedElement, input: LocalUncodixifyInput): boolean {
  const size = parsePx(element.style.fontSize);
  if (size === 0 || size > 15) return false;
  const text = (element.text ?? "").trim();
  if (!text || text.length > 60) return false;
  const color = parseColor(element.style.color);
  const background = parseColor(
    element.style.backgroundColor ||
      input.styleContext?.section.backgroundColor ||
      input.styleTokens?.section.background ||
      ""
  );
  if (!color) return false;
  if (!background) return false;
  return contrastRatio(color, background) < 4.5;
}

function isPanelLike(element: MatchedElement): boolean {
  const hasBackground = Boolean(parseColor(element.style.backgroundColor));
  const hasBorder = Boolean(parseColor(element.style.borderColor));
  const radius = maxBorderRadiusPx(element.style.borderRadius);
  const rect = element.rect;
  const isContainer = (rect?.width ?? 0) >= 120 && (rect?.height ?? 0) >= 80;
  return isContainer && (hasBackground || hasBorder) && (hasBorder || radius > 0);
}

function isFloatingSidebar(element: MatchedElement, classText: string): boolean {
  const className = (element.className ?? "").toLowerCase();
  const looksSidebar = /sidebar|side-?nav|rail/.test(className) || /sidebar/.test(classText);
  if (!looksSidebar) return false;
  const rect = element.rect;
  const tall = (rect?.height ?? 0) >= 320 && (rect?.width ?? 0) <= 340;
  const rounded = maxBorderRadiusPx(element.style.borderRadius) >= 10;
  const floats = maxShadowBlurPx(element.style.boxShadow) > 0;
  return tall && (rounded || floats);
}

type EqualCardsResult = { count: number };

function findEqualCards(elements: MatchedElement[]): EqualCardsResult {
  const cards = elements.filter((element) => isPanelLike(element));
  const buckets = new Map<string, number>();
  for (const card of cards) {
    const width = Math.round((card.rect?.width ?? 0) / 12) * 12;
    const height = Math.round((card.rect?.height ?? 0) / 12) * 12;
    const bg = card.style.backgroundColor || "none";
    const key = `${width}x${height}|${bg}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  let max = 0;
  for (const value of buckets.values()) {
    if (value > max) max = value;
  }
  return { count: max };
}

function collectAccentColors(
  input: LocalUncodixifyInput,
  elements: MatchedElement[]
): string[] {
  const colors: string[] = [];
  const push = (value: string | undefined) => {
    if (value && value !== "none") colors.push(value);
  };
  push(input.styleTokens?.accentColor);
  push(input.styleContext?.accent.color);
  push(input.styleContext?.accent.backgroundColor);
  push(input.styleContext?.button?.backgroundColor);
  for (const element of elements) {
    const tag = (element.tagName ?? "").toLowerCase();
    if (tag === "a" || tag === "button" || element.role === "button") {
      push(element.style.backgroundColor);
      push(element.style.color);
    }
  }
  return colors;
}

function isBlueOrCyan(value: string): boolean {
  const color = parseColor(value);
  if (!color) return false;
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  if (max - min < 30) return false; // grayish, not a saturated accent
  const hue = rgbToHue(color);
  // Blue/cyan band ~ 180deg (cyan) to 260deg (blue) and blue dominant.
  const blueDominant = color.b >= color.r && color.b >= color.g - 10;
  return blueDominant && hue >= 175 && hue <= 265;
}

// --- color utilities -----------------------------------------------------

type ParsedColor = { r: number; g: number; b: number; a?: number };

function parseColor(value: string | undefined): ParsedColor | null {
  if (!value) return null;
  const rgb = value.match(
    /rgba?\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)(?:,\s*([0-9.]+))?\)/i
  );
  if (rgb) {
    return {
      r: Number(rgb[1]),
      g: Number(rgb[2]),
      b: Number(rgb[3]),
      a: rgb[4] !== undefined ? Number(rgb[4]) : 1
    };
  }
  const hex = value.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
  if (hex) {
    const raw = hex[1];
    const normalized =
      raw.length === 3
        ? raw
            .split("")
            .map((c) => `${c}${c}`)
            .join("")
        : raw;
    return {
      r: Number.parseInt(normalized.slice(0, 2), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      b: Number.parseInt(normalized.slice(4, 6), 16),
      a: 1
    };
  }
  return null;
}

function rgbToHue(color: ParsedColor): number {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let hue: number;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  hue *= 60;
  return hue < 0 ? hue + 360 : hue;
}

function relativeLuminance(color: ParsedColor): number {
  const [r, g, b] = [color.r, color.g, color.b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: ParsedColor, b: ParsedColor): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

// --- misc ----------------------------------------------------------------

function countClassMatches(elements: MatchedElement[], needles: string[]): number {
  return elements.filter((element) => {
    const className = (element.className ?? "").toLowerCase();
    return needles.some((needle) => className.includes(needle));
  }).length;
}

function confidenceFromCount(count: number, total: number, base: number): number {
  const ratio = Math.min(count / Math.max(total, 1), 1);
  return clamp01(base + ratio * 0.2);
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function truncate(value: string | undefined, max: number): string {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

function dedupeByRuleId(findings: LocalUncodixifyFinding[]): LocalUncodixifyFinding[] {
  const map = new Map<string, LocalUncodixifyFinding>();
  for (const finding of findings) {
    const existing = map.get(finding.ruleId);
    if (!existing) {
      map.set(finding.ruleId, finding);
      continue;
    }
    map.set(finding.ruleId, {
      ruleId: finding.ruleId,
      confidence: Math.max(existing.confidence, finding.confidence),
      evidence: [...new Set([...existing.evidence, ...finding.evidence])]
    });
  }
  return [...map.values()];
}
