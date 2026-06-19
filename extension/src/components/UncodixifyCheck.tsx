import type {
  GeminiUncodixifyResult,
  UncodixifyAnalysisResult,
  UncodixifyFinding
} from "../analysis/uncodixifyTypes";
import type { PolishPilotMode } from "../shared/types";

type UncodixifyCheckProps = {
  result: UncodixifyAnalysisResult | null;
  mode: PolishPilotMode;
  geminiRaw?: GeminiUncodixifyResult | null;
  includedRuleIds: string[];
  onToggleRule: (ruleId: string) => void;
  // "summary" = compact control-center card (score + summary + top 3).
  // "full" = detailed recommendation cards + developer panel.
  variant?: "summary" | "full";
};

export function UncodixifyCheck({
  result,
  mode,
  geminiRaw,
  includedRuleIds,
  onToggleRule,
  variant = "full"
}: UncodixifyCheckProps) {
  if (!result) {
    return (
      <section className="dh-card mt-4 p-4">
        <h2 className="text-lg font-black text-pilot-text">Design Check</h2>
        <p className="mt-3 text-sm leading-6 text-pilot-muted">
          Recommendations appear after capture.
        </p>
      </section>
    );
  }

  const included = new Set(includedRuleIds);
  const topIssues = result.findings.slice(0, 3);
  const topFixes = result.topFixes.slice(0, 3);

  return (
    <section className="dh-card mt-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-pilot-text">Design Check</h2>
          {variant === "full" || mode === "developer" ? (
            <p className="mt-1 text-sm leading-6 text-pilot-muted">
              Detects generic UI patterns and suggests fixes.
            </p>
          ) : null}
        </div>
        <ScoreBadge score={result.score} />
      </div>

      {variant === "full" || mode === "developer" ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <ScoreMetric label="Human-designed" value={`${result.score}/100`} tone="good" />
          <ScoreMetric label="AI-like signals" value={`${result.aiLikeScore}/100`} tone="warn" />
        </div>
      ) : null}

      {variant === "full" || mode === "developer" ? (
        <p className="mt-3 text-sm leading-6 text-pilot-muted">{result.summary}</p>
      ) : null}

      {result.findings.length === 0 ? (
        <p className="mt-3 rounded-lg border border-pilot-border bg-pilot-card/45 p-3 text-sm leading-6 text-pilot-success">
          This block reads as human-designed.
        </p>
      ) : (
        <>
          <div className="mt-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-pilot-soft">
              Detected
            </h3>
            <ol className="mt-2 space-y-1 text-sm leading-6 text-pilot-text">
              {topIssues.map((finding, index) => (
                <li key={finding.ruleId}>
                  {index + 1}. {finding.title}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-pilot-soft">
              Recommended
            </h3>
            <ol className="mt-2 space-y-1 text-sm leading-6 text-pilot-muted">
              {topFixes.map((fix, index) => (
                <li key={`${index}-${fix.slice(0, 16)}`}>
                  {index + 1}. {fix}
                </li>
              ))}
            </ol>
          </div>

          {variant === "full" ? (
            <div className="mt-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-pilot-soft">
                Recommendations
              </h3>
              {result.findings.map((finding) => (
                <RecommendationCard
                  key={finding.ruleId}
                  finding={finding}
                  included={included.has(finding.ruleId)}
                  developer={mode === "developer"}
                  onToggle={() => onToggleRule(finding.ruleId)}
                />
              ))}
            </div>
          ) : null}
        </>
      )}

      {variant === "full" && mode === "developer" ? (
        <UncodixifyDeveloperPanel result={result} geminiRaw={geminiRaw} />
      ) : null}
    </section>
  );
}

function RecommendationCard({
  finding,
  included,
  developer,
  onToggle
}: {
  finding: UncodixifyFinding;
  included: boolean;
  developer: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-lg border border-pilot-border bg-pilot-card/45 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold text-pilot-text">{finding.title}</p>
        <SeverityBadge severity={finding.severity} />
      </div>

      <p className="mt-2 text-[11px] leading-5 text-pilot-soft">
        <span className="font-semibold text-pilot-muted">Evidence:</span>{" "}
        {finding.evidence[0] ?? "Detected during analysis."}
      </p>
      {developer && finding.evidence.length > 1 ? (
        <ul className="mt-1 space-y-0.5 text-[11px] leading-5 text-pilot-soft">
          {finding.evidence.slice(1).map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      ) : null}

      <p className="mt-2 text-[11px] leading-5 text-pilot-muted">
        <span className="font-semibold">Recommendation:</span> {finding.recommendation}
      </p>
      <p className="mt-1 text-[11px] leading-5 text-pilot-muted">
        <span className="font-semibold">Better direction:</span> {finding.betterDirection}
      </p>

      <div className="mt-2 flex items-center justify-between gap-2">
        {developer ? (
          <span className="flex flex-wrap gap-1 text-[10px] text-pilot-soft">
            <code className="rounded bg-pilot-bg/60 px-1 py-0.5">{finding.ruleId}</code>
            <span className="rounded bg-pilot-bg/60 px-1 py-0.5">
              conf {Math.round(finding.confidence * 100)}%
            </span>
            <span className="rounded bg-pilot-bg/60 px-1 py-0.5">
              {finding.sources.join("+")}
            </span>
          </span>
        ) : (
          <span />
        )}
        <button
          className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-bold transition ${
            included
              ? "border-pilot-primary/60 bg-pilot-primary/20 text-pilot-primaryDeep"
              : "border-pilot-border bg-pilot-bg/40 text-pilot-soft hover:text-pilot-text"
          }`}
          onClick={onToggle}
          type="button"
        >
          {included ? "✓ In Cursor Prompt" : "Add to Cursor Prompt"}
        </button>
      </div>
    </div>
  );
}

function UncodixifyDeveloperPanel({
  result,
  geminiRaw
}: {
  result: UncodixifyAnalysisResult;
  geminiRaw?: GeminiUncodixifyResult | null;
}) {
  return (
    <div className="mt-4 rounded-lg border border-pilot-border bg-pilot-bg/40 p-3">
      <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-pilot-soft">
        Developer details
      </h3>

      <div className="mt-2">
        <p className="text-[11px] font-semibold text-pilot-muted">Scoring breakdown</p>
        <div className="mt-1 rounded-md border border-pilot-border bg-pilot-card/50">
          <div className="grid grid-cols-[1fr_64px_36px] gap-1 border-b border-pilot-border px-2 py-1 text-[10px] font-bold uppercase text-pilot-soft">
            <span>Rule</span>
            <span>Severity</span>
            <span className="text-right">-pts</span>
          </div>
          {result.scoreBreakdown.length ? (
            result.scoreBreakdown.map((entry) => (
              <div
                className="grid grid-cols-[1fr_64px_36px] gap-1 border-b border-pilot-border px-2 py-1 text-[10px] last:border-b-0"
                key={entry.ruleId}
              >
                <span className="min-w-0 truncate text-pilot-muted" title={entry.title}>
                  {entry.title}
                </span>
                <span className="text-pilot-soft">{entry.severity}</span>
                <span className="text-right font-bold text-pilot-text">{entry.penalty}</span>
              </div>
            ))
          ) : (
            <p className="px-2 py-2 text-[10px] text-pilot-soft">No penalties applied.</p>
          )}
          <div className="grid grid-cols-[1fr_64px_36px] gap-1 px-2 py-1 text-[10px] font-bold">
            <span className="text-pilot-muted">Final score</span>
            <span />
            <span className="text-right text-pilot-text">{result.score}</span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[11px] font-semibold text-pilot-muted">Prompt instructions</p>
        <ul className="mt-1 space-y-0.5 text-[10px] leading-5 text-pilot-soft">
          {result.promptInstructions.length ? (
            result.promptInstructions.map((instruction, index) => (
              <li key={index}>• {instruction}</li>
            ))
          ) : (
            <li>None.</li>
          )}
        </ul>
      </div>

      <div className="mt-3">
        <p className="text-[11px] font-semibold text-pilot-muted">Raw Gemini Uncodixify result</p>
        <pre className="mt-1 max-h-48 overflow-auto rounded-md border border-pilot-border bg-pilot-card/60 p-2 text-[10px] leading-4 text-pilot-soft">
          {geminiRaw ? JSON.stringify(geminiRaw, null, 2) : "No Gemini Uncodixify result available."}
        </pre>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 80
      ? "bg-emerald-100/80 text-emerald-700"
      : score >= 55
        ? "bg-amber-100/80 text-amber-800"
        : "bg-red-100/80 text-red-700";
  return (
    <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-black ${tone}`}>
      {score}/100
    </span>
  );
}

function ScoreMetric({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "good" | "warn";
}) {
  return (
    <div className="rounded-lg border border-pilot-border bg-pilot-card/45 p-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-pilot-soft">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-black ${
          tone === "good" ? "text-pilot-text" : "text-amber-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: UncodixifyFinding["severity"] }) {
  const tone =
    severity === "high"
      ? "bg-red-100/80 text-red-700"
      : severity === "medium"
        ? "bg-amber-100/80 text-amber-800"
        : "bg-pilot-primary/15 text-pilot-primaryDeep";
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] ${tone}`}
    >
      {severity}
    </span>
  );
}
