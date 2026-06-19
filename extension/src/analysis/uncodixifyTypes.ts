import type { UncodixifyCategory, UncodixifySeverity } from "./uncodixifyRules";

// Where a finding came from. Local CSS/DOM evidence is authoritative; Gemini
// adds visual evidence the CSS cannot see.
export type UncodixifyFindingSource = "local" | "gemini";

export type UncodixifyFinding = {
  ruleId: string;
  category: string;
  title: string;
  severity: "low" | "medium" | "high";
  evidence: string[];
  recommendation: string;
  betterDirection: string;
  confidence: number;
  // Extra (non-breaking) fields used by Developer Mode to show provenance.
  sources: UncodixifyFindingSource[];
  codexPattern?: string;
  whyItFeelsAI?: string;
};

export type UncodixifyScoreBreakdownEntry = {
  ruleId: string;
  title: string;
  severity: UncodixifySeverity;
  penalty: number;
};

export type UncodixifyAnalysisResult = {
  score: number; // 0-100, higher means more human-designed
  aiLikeScore: number; // 0-100, higher means more Codex/AI-like
  summary: string;
  findings: UncodixifyFinding[];
  topFixes: string[];
  promptInstructions: string[];
  // Extra (non-breaking) field used by Developer Mode.
  scoreBreakdown: UncodixifyScoreBreakdownEntry[];
};

// The raw, structured Uncodixify block returned by Gemini in the analyze-area
// response. Visual evaluation only — mapped onto local rules during the merge.
export type GeminiUncodixifyResult = {
  summary: string;
  detectedRuleIds: string[];
  visualEvidence: string[];
  topRecommendations: string[];
};

// A local-only finding produced by the DOM/CSS detector before merging.
export type LocalUncodixifyFinding = {
  ruleId: string;
  evidence: string[];
  confidence: number;
};

export type { UncodixifyCategory, UncodixifySeverity };
