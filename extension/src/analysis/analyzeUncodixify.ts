import type { RectangleCapture, AIUnderstandingResult } from "../shared/types";
import { runLocalUncodixifyCheck } from "./runLocalUncodixifyCheck";
import { buildUncodixifyAnalysis } from "./buildUncodixifyAnalysis";
import type { GeminiUncodixifyResult, UncodixifyAnalysisResult } from "./uncodixifyTypes";
import { buildCaptureObjectInventory } from "./buildObjectInventory";

// Top-level convenience: run the local DOM/CSS detector on a capture, merge it
// with Gemini's visual Uncodixify result (when present on the AI result), and
// return the final scored analysis.
export function analyzeUncodixify(
  capture: RectangleCapture | null | undefined,
  aiResult?: AIUnderstandingResult | null
): UncodixifyAnalysisResult | null {
  if (!capture) return null;
  const effectiveSectionType = aiResult?.sectionType ?? "unknown";
  const effectiveDetected = {
    ...capture.detected,
    sectionType: effectiveSectionType
  };
  const objectInventory = buildCaptureObjectInventory(capture);

  const localFindings = runLocalUncodixifyCheck({
    matchedElements: capture.matchedElements,
    styleContext: capture.styleContext,
    styleTokens: capture.styleTokens,
    counts: capture.counts,
    detected: effectiveDetected,
    screenshot: {
      width: capture.selectedRect?.width,
      height: capture.selectedRect?.height
    },
    objectInventory,
    usedCssRules: capture.usedCssRules,
    sourceSections: capture.sourceSections,
    selectedSourceSection: capture.selectedSourceSection,
    pageDesignContext: capture.pageDesignContext
  });

  const enrichedGemini = enrichGeminiRulesFromAIProblems(
    aiResult?.uncodixify,
    aiResult,
    effectiveSectionType
  );

  return buildUncodixifyAnalysis({
    localFindings,
    gemini: filterGeminiRulesForSection(enrichedGemini, effectiveSectionType)
  });
}

function enrichGeminiRulesFromAIProblems(
  gemini: GeminiUncodixifyResult | null | undefined,
  aiResult: AIUnderstandingResult | null | undefined,
  sectionType: AIUnderstandingResult["sectionType"]
): GeminiUncodixifyResult | null {
  if (!aiResult) return gemini ?? null;

  const detectedRuleIds = [...(gemini?.detectedRuleIds ?? [])];
  const visualEvidence = [...(gemini?.visualEvidence ?? [])];
  const topRecommendations = [...(gemini?.topRecommendations ?? [])];
  const add = (ruleId: string, evidence: string, recommendation: string) => {
    if (!detectedRuleIds.includes(ruleId)) {
      detectedRuleIds.push(ruleId);
      visualEvidence.push(evidence);
      topRecommendations.push(recommendation);
    }
  };

  for (const problem of aiResult.uiProblems ?? []) {
    if (problem === "weak_hierarchy") {
      add(
        "weak-hierarchy",
        "Gemini reported weak visual hierarchy in the selected block.",
        "Create a stronger primary focal point with clearer type scale and spacing."
      );
    }
    if (problem === "flat_layout" || problem === "no_visual_rhythm") {
      add(
        "monotonous-section-rhythm",
        `Gemini reported ${problem.replace(/_/g, " ")}.`,
        "Introduce a dominant element and group supporting content with clearer rhythm."
      );
    }
    if (problem === "too_repetitive" || problem === "cards_too_equal") {
      add(
        "repetitive-equal-cards",
        `Gemini reported ${problem.replace(/_/g, " ")}.`,
        "Break the equal-card pattern with one featured item and quieter supporting cards."
      );
      if (sectionType === "pricing") {
        add(
          "pricing-plan-weak-emphasis",
          "Gemini reported equal card treatment in a pricing block.",
          "Make one recommended plan dominant and align price, benefits, and CTA rows."
        );
      }
    }
    if (problem === "spacing_issue") {
      add(
        "inconsistent-spacing",
        "Gemini reported spacing issues in the selected block.",
        "Normalize spacing to a consistent 4/8px scale and align related groups."
      );
    }
    if (problem === "too_text_heavy") {
      add(
        "text-heavy-block",
        "Gemini reported that the block is too text-heavy.",
        "Reduce copy density and convert details into scannable groups."
      );
    }
    if (problem === "cta_not_clear") {
      add(
        sectionType === "hero" ? "hero-missing-primary-cta" : "weak-primary-action",
        "Gemini reported that the primary action is unclear.",
        "Make one primary action obvious and demote competing actions."
      );
    }
  }

  if (!detectedRuleIds.length && !gemini) return null;

  return {
    summary: gemini?.summary ?? aiResult.currentLayoutProblem ?? "",
    detectedRuleIds,
    visualEvidence,
    topRecommendations
  };
}

function filterGeminiRulesForSection(
  gemini: GeminiUncodixifyResult | null | undefined,
  sectionType: AIUnderstandingResult["sectionType"]
): GeminiUncodixifyResult | null {
  if (!gemini) return null;
  if (sectionType === "hero") return gemini;

  const keptIndexes: number[] = [];
  const detectedRuleIds = gemini.detectedRuleIds.filter((ruleId, index) => {
    const keep = !isHeroOnlyRule(ruleId);
    if (keep) keptIndexes.push(index);
    return keep;
  });

  return {
    ...gemini,
    detectedRuleIds,
    visualEvidence: gemini.visualEvidence.filter((_, index) => keptIndexes.includes(index)),
    topRecommendations: gemini.topRecommendations.filter(
      (recommendation) => !/\bhero\b/i.test(recommendation)
    )
  };
}

function isHeroOnlyRule(ruleId: string) {
  return ruleId === "hero-inside-dashboard" || ruleId.startsWith("hero-");
}
