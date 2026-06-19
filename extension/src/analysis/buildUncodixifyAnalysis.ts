import { getUncodixifyRule, type UncodixifySeverity } from "./uncodixifyRules";
import type {
  GeminiUncodixifyResult,
  LocalUncodixifyFinding,
  UncodixifyAnalysisResult,
  UncodixifyFinding,
  UncodixifyFindingSource,
  UncodixifyScoreBreakdownEntry
} from "./uncodixifyTypes";

const SEVERITY_PENALTY: Record<UncodixifySeverity, number> = {
  low: 5,
  medium: 10,
  high: 16
};

export type BuildUncodixifyAnalysisInput = {
  localFindings: LocalUncodixifyFinding[];
  gemini?: GeminiUncodixifyResult | null;
};

type MergeAccumulator = {
  ruleId: string;
  evidence: string[];
  localConfidence?: number;
  geminiConfidence?: number;
  sources: Set<UncodixifyFindingSource>;
};

// Merge the local DOM/CSS findings with Gemini's visual findings into a single
// scored result. Local CSS evidence is authoritative; Gemini visual evidence
// helps where CSS cannot detect the issue. When both agree, confidence rises.
export function buildUncodixifyAnalysis(
  input: BuildUncodixifyAnalysisInput
): UncodixifyAnalysisResult {
  const accumulators = new Map<string, MergeAccumulator>();

  const ensure = (ruleId: string): MergeAccumulator => {
    let entry = accumulators.get(ruleId);
    if (!entry) {
      entry = { ruleId, evidence: [], sources: new Set() };
      accumulators.set(ruleId, entry);
    }
    return entry;
  };

  // Local findings first (higher priority).
  for (const finding of input.localFindings) {
    if (!getUncodixifyRule(finding.ruleId)) continue;
    const entry = ensure(finding.ruleId);
    entry.localConfidence = Math.max(entry.localConfidence ?? 0, finding.confidence);
    entry.sources.add("local");
    for (const item of finding.evidence) {
      if (item && !entry.evidence.includes(item)) entry.evidence.push(item);
    }
  }

  // Gemini detected rule IDs, mapped onto the local rule database.
  const gemini = input.gemini;
  const geminiRuleIds = normalizeGeminiRuleIds(gemini?.detectedRuleIds);
  const geminiEvidence = Array.isArray(gemini?.visualEvidence)
    ? gemini!.visualEvidence.filter((item): item is string => typeof item === "string")
    : [];

  geminiRuleIds.forEach((ruleId, index) => {
    if (!getUncodixifyRule(ruleId)) return;
    const entry = ensure(ruleId);
    entry.geminiConfidence = 0.5;
    entry.sources.add("gemini");
    // Attach a matching piece of Gemini visual evidence when available.
    const evidence = geminiEvidence[index] ?? geminiEvidence[0];
    if (geminiRuleIds.length === 1 && geminiEvidence.length) {
      for (const item of geminiEvidence) {
        if (item && !entry.evidence.includes(item)) entry.evidence.push(`Gemini: ${item}`);
      }
    } else if (evidence && !entry.evidence.includes(`Gemini: ${evidence}`)) {
      entry.evidence.push(`Gemini: ${evidence}`);
    }
  });

  const findings = [...accumulators.values()]
    .map(toFinding)
    .filter((finding): finding is UncodixifyFinding => finding !== null)
    .sort(bySeverityThenConfidence);

  const { score, breakdown } = computeScore(findings);
  const aiLikeScore = 100 - score;

  return {
    score,
    aiLikeScore,
    summary: buildSummary(findings, score, gemini),
    findings,
    topFixes: buildTopFixes(findings),
    promptInstructions: buildPromptInstructions(findings),
    scoreBreakdown: breakdown
  };
}

function toFinding(entry: MergeAccumulator): UncodixifyFinding | null {
  const rule = getUncodixifyRule(entry.ruleId);
  if (!rule) return null;

  const hasLocal = entry.sources.has("local");
  const hasGemini = entry.sources.has("gemini");
  let confidence = entry.localConfidence ?? entry.geminiConfidence ?? 0.5;
  if (hasLocal && hasGemini) {
    // Both agree → boost confidence.
    confidence = Math.min(1, Math.max(entry.localConfidence ?? 0.7, 0.7) + 0.2);
  } else if (hasGemini && !hasLocal) {
    confidence = entry.geminiConfidence ?? 0.5;
  }

  const evidence = entry.evidence.length
    ? entry.evidence
    : hasGemini
      ? ["Detected from the screenshot during visual evaluation."]
      : [rule.detectSignals[0] ?? "Detected locally."];

  return {
    ruleId: rule.id,
    category: rule.category,
    title: rule.title,
    severity: rule.severity,
    evidence,
    recommendation: rule.recommendation,
    betterDirection: rule.betterDirection,
    confidence: Number(confidence.toFixed(2)),
    sources: orderSources(entry.sources),
    codexPattern: rule.codexPattern,
    whyItFeelsAI: rule.whyItFeelsAI
  };
}

function orderSources(sources: Set<UncodixifyFindingSource>): UncodixifyFindingSource[] {
  const ordered: UncodixifyFindingSource[] = [];
  if (sources.has("local")) ordered.push("local");
  if (sources.has("gemini")) ordered.push("gemini");
  return ordered;
}

const SEVERITY_RANK: Record<UncodixifySeverity, number> = {
  high: 3,
  medium: 2,
  low: 1
};

function bySeverityThenConfidence(a: UncodixifyFinding, b: UncodixifyFinding): number {
  const severityDelta = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
  if (severityDelta !== 0) return severityDelta;
  return b.confidence - a.confidence;
}

function computeScore(findings: UncodixifyFinding[]): {
  score: number;
  breakdown: UncodixifyScoreBreakdownEntry[];
} {
  let score = 100;
  const breakdown: UncodixifyScoreBreakdownEntry[] = [];
  for (const finding of findings) {
    const penalty = SEVERITY_PENALTY[finding.severity];
    score -= penalty;
    breakdown.push({
      ruleId: finding.ruleId,
      title: finding.title,
      severity: finding.severity,
      penalty
    });
  }
  return { score: clampScore(score), breakdown };
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildSummary(
  findings: UncodixifyFinding[],
  score: number,
  gemini?: GeminiUncodixifyResult | null
): string {
  if (!findings.length) {
    return "No strong AI/Codex UI patterns were detected. This block reads as human-designed.";
  }
  const top = findings.slice(0, 3).map((finding) => finding.title.toLowerCase());
  const base = `Human-designed score ${score}/100. Detected ${findings.length} AI-like pattern${
    findings.length === 1 ? "" : "s"
  }: ${top.join(", ")}.`;
  const geminiSummary = typeof gemini?.summary === "string" ? gemini.summary.trim() : "";
  return geminiSummary ? `${base} ${geminiSummary}` : base;
}

function buildTopFixes(findings: UncodixifyFinding[]): string[] {
  return findings.slice(0, 3).map((finding) => finding.recommendation);
}

function buildPromptInstructions(findings: UncodixifyFinding[]): string[] {
  return findings.map(
    (finding) =>
      `${finding.title}: ${finding.recommendation} (${finding.betterDirection})`
  );
}

function normalizeGeminiRuleIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const id = item.trim().toLowerCase();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}
