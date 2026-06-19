import { useEffect, useMemo, useState } from "react";
import {
  EXCLUDED_UNCODIX_RULES_STORAGE_KEY,
  RECOMMENDATIONS_STORAGE_KEY
} from "../shared/messages";
import { closeCurrentTab } from "../shared/closeCurrentTab";
import type { RecommendationsData } from "../shared/windowData";
import type { UncodixifyFinding } from "../analysis/uncodixifyTypes";

// Maps internal rule categories to the human-facing group labels used here.
const CATEGORY_LABEL: Record<string, string> = {
  layout: "Layout",
  typography: "Typography & Hierarchy",
  color: "Colors",
  spacing: "Spacing",
  cards: "Cards",
  buttons: "Buttons",
  shadow: "Shadows",
  motion: "Motion",
  copywriting: "Copywriting",
  navigation: "Navigation",
  badges: "Badges",
  charts: "Charts",
  panels: "Panels",
  radius: "Radius"
};

// Stable display order for the groups.
const CATEGORY_ORDER = [
  "layout",
  "typography",
  "color",
  "spacing",
  "cards",
  "buttons",
  "radius",
  "shadow",
  "panels",
  "motion",
  "badges",
  "charts",
  "navigation",
  "copywriting"
];

export function RecommendationsPage() {
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void readData().then(() => setLoaded(true));

    function handleChange(
      changes: Record<string, chrome.storage.StorageChange>,
      area: string
    ) {
      if (area !== "session") return;
      if (
        RECOMMENDATIONS_STORAGE_KEY in changes ||
        EXCLUDED_UNCODIX_RULES_STORAGE_KEY in changes
      ) {
        void readData();
      }
    }

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, []);

  async function readData() {
    const result = await chrome.storage.session.get([
      RECOMMENDATIONS_STORAGE_KEY,
      EXCLUDED_UNCODIX_RULES_STORAGE_KEY
    ]);
    const stored = result[RECOMMENDATIONS_STORAGE_KEY] as RecommendationsData | undefined;
    if (!stored) {
      setData(null);
      return;
    }
    const excluded =
      (result[EXCLUDED_UNCODIX_RULES_STORAGE_KEY] as string[] | undefined) ??
      stored.excludedRuleIds ??
      [];
    setData({ ...stored, excludedRuleIds: excluded });
  }

  async function toggleRule(ruleId: string) {
    const current = new Set(data?.excludedRuleIds ?? []);
    if (current.has(ruleId)) current.delete(ruleId);
    else current.add(ruleId);
    await chrome.storage.session.set({
      [EXCLUDED_UNCODIX_RULES_STORAGE_KEY]: [...current]
    });
  }

  const findings = data?.analysis?.findings ?? [];
  const excluded = useMemo(() => new Set(data?.excludedRuleIds ?? []), [data]);
  const groups = useMemo(() => groupByCategory(findings), [findings]);
  const includedCount = findings.filter((finding) => !excluded.has(finding.ruleId)).length;

  return (
    <main className="min-h-screen bg-pilot-bg text-pilot-text">
      <header className="border-b border-pilot-border bg-pilot-panel px-6 py-5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight">Recommendations</h1>
            <p className="mt-1 truncate text-base text-pilot-muted">
              What to fix, why it matters, and what gets added to the prompt.
              {data?.sourceTitle ? ` · ${data.sourceTitle}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {data?.analysis ? (
              <span className="rounded-md border border-pilot-border bg-pilot-bg px-3 py-2 text-sm font-bold">
                {includedCount} prompt fixes
              </span>
            ) : null}
            <button
              className="dh-button-secondary px-4 py-2.5 text-sm"
              onClick={closeCurrentTab}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-6">
        {!loaded ? (
          <EmptyState message="Loading recommendations…" />
        ) : !data || !data.hasAnalysis || !data.analysis ? (
          <EmptyState message="No analysis yet. Select an area in the side panel and run analysis first." />
        ) : findings.length === 0 ? (
          <EmptyState message="This block looks clean — no AI/Codex patterns detected." />
        ) : (
          <div className="space-y-6">
            <section className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
              <div className="dh-card-elevated p-5">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-pilot-primaryDeep">
                  Fix first
                </p>
                <h2 className="mt-2 text-xl font-black text-pilot-text">
                  {findings[0]?.recommendation ?? data.analysis.summary}
                </h2>
                <p className="mt-3 text-base leading-7 text-pilot-muted">
                  {findings[0]?.betterDirection || data.analysis.summary}
                </p>
              </div>
              <div className="dh-card p-5">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-pilot-soft">
                  Prompt status
                </p>
                <p className="mt-2 text-3xl font-black text-pilot-text">
                  {includedCount}/{findings.length}
                </p>
                <p className="mt-2 text-sm leading-6 text-pilot-muted">
                  Checked items are included when you copy the Cursor prompt.
                </p>
              </div>
            </section>

            {CATEGORY_ORDER.filter((category) => groups[category]?.length).map(
              (category) => (
                <section key={category}>
                  <h2 className="mb-3 text-base font-black text-pilot-text">
                    {CATEGORY_LABEL[category] ?? category} ({groups[category].length})
                  </h2>
                  <div className="grid gap-3">
                    {groups[category].map((finding) => (
                      <FindingCard
                        key={finding.ruleId}
                        finding={finding}
                        included={!excluded.has(finding.ruleId)}
                        developer={data.mode === "developer"}
                        onToggle={() => void toggleRule(finding.ruleId)}
                      />
                    ))}
                  </div>
                </section>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function FindingCard({
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
    <article className="rounded-lg border border-pilot-border bg-pilot-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-black text-pilot-text">{finding.title}</h3>
          {developer ? (
            <p className="mt-1 flex flex-wrap gap-1 text-[10px] text-pilot-soft">
              <code className="rounded bg-pilot-bg px-1 py-0.5">{finding.ruleId}</code>
              <span className="rounded bg-pilot-bg px-1 py-0.5">
                conf {Math.round(finding.confidence * 100)}%
              </span>
              <span className="rounded bg-pilot-bg px-1 py-0.5">
                {finding.sources.join("+")}
              </span>
            </p>
          ) : null}
        </div>
        <SeverityBadge severity={finding.severity} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <InfoBlock label="Problem">
          {finding.whyItFeelsAI || finding.evidence[0] || "Detected during analysis."}
        </InfoBlock>
        <InfoBlock label="Fix">{finding.recommendation}</InfoBlock>
        <InfoBlock label="Better direction">{finding.betterDirection}</InfoBlock>
      </div>
      {developer && finding.evidence.length > 1 ? (
        <ul className="mt-1 space-y-0.5 pl-3 text-[11px] leading-5 text-pilot-soft">
          {finding.evidence.slice(1).map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      ) : null}

      <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-md border border-pilot-border bg-pilot-bg px-3 py-2">
        <input checked={included} onChange={onToggle} type="checkbox" />
        <span className="text-sm font-semibold text-pilot-text">
          Include in Cursor Prompt
        </span>
      </label>
    </article>
  );
}

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-pilot-border bg-pilot-bg p-3">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-pilot-soft">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-pilot-muted">{children}</p>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: UncodixifyFinding["severity"] }) {
  const tone =
    severity === "high"
      ? "border-pilot-danger/45 bg-pilot-danger/15 text-pilot-danger"
      : severity === "medium"
        ? "border-pilot-warning/45 bg-pilot-warning/12 text-pilot-warning"
        : "border-pilot-border bg-pilot-bg text-pilot-muted";
  return (
    <span
      className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.06em] ${tone}`}
    >
      {severity}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-pilot-border bg-pilot-panel p-6 text-base font-semibold text-pilot-muted">
      {message}
    </div>
  );
}

function groupByCategory(findings: UncodixifyFinding[]): Record<string, UncodixifyFinding[]> {
  const groups: Record<string, UncodixifyFinding[]> = {};
  for (const finding of findings) {
    const key = finding.category || "layout";
    (groups[key] ??= []).push(finding);
  }
  return groups;
}
