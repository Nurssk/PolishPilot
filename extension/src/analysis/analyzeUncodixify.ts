import type { RectangleCapture, AIUnderstandingResult } from "../shared/types";
import { runLocalUncodixifyCheck } from "./runLocalUncodixifyCheck";
import { buildUncodixifyAnalysis } from "./buildUncodixifyAnalysis";
import type { UncodixifyAnalysisResult } from "./uncodixifyTypes";

// Top-level convenience: run the local DOM/CSS detector on a capture, merge it
// with Gemini's visual Uncodixify result (when present on the AI result), and
// return the final scored analysis.
export function analyzeUncodixify(
  capture: RectangleCapture | null | undefined,
  aiResult?: AIUnderstandingResult | null
): UncodixifyAnalysisResult | null {
  if (!capture) return null;

  const localFindings = runLocalUncodixifyCheck({
    matchedElements: capture.matchedElements,
    styleContext: capture.styleContext,
    styleTokens: capture.styleTokens,
    counts: capture.counts,
    detected: capture.detected,
    screenshot: {
      width: capture.selectedRect?.width,
      height: capture.selectedRect?.height
    }
  });

  return buildUncodixifyAnalysis({
    localFindings,
    gemini: aiResult?.uncodixify ?? null
  });
}
