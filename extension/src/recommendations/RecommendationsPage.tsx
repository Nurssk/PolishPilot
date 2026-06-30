import { useEffect, useMemo, useState } from "react";
import {
  DESIGN_IDEAS_STORAGE_KEY,
  EXCLUDED_UNCODIX_RULES_STORAGE_KEY,
  RECOMMENDATIONS_STORAGE_KEY,
  SELECTED_ANIMATION_STORAGE_KEY,
  SELECTED_PATTERN_STORAGE_KEY,
  SELECTED_TEMPLATE_STORAGE_KEY
} from "../shared/messages";
import { closeCurrentTab } from "../shared/closeCurrentTab";
import { PatternCard } from "../components/PatternCard";
import { TemplateReferenceCard } from "../components/TemplateReferenceCard";
import { AnimationReferenceCard } from "../components/AnimationReferenceCard";
import type { DesignIdeasData, RecommendationsData } from "../shared/windowData";
import type { UncodixifyFinding } from "../analysis/uncodixifyTypes";
import type { LayoutPattern } from "../patterns/layoutPatterns";
import type { TemplateReference } from "../patterns/templateReferences";

type WorkspaceTab =
  | "recommendations"
  | "layouts"
  | "templates"
  | "animations";

const CATEGORY_LABEL: Record<string, string> = {
  layout: "Layout",
  typography: "Hierarchy",
  color: "Visual style",
  spacing: "Spacing",
  cards: "Cards",
  buttons: "Buttons",
  shadow: "Visual style",
  motion: "Motion / interaction",
  copywriting: "Copywriting",
  navigation: "Navigation",
  badges: "Badges",
  charts: "Charts",
  panels: "Panels",
  radius: "Visual style"
};

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
  const [ideas, setIdeas] = useState<DesignIdeasData | null>(null);
  const [tab, setTab] = useState<WorkspaceTab>("recommendations");
  const [loaded, setLoaded] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedPatternId, setCopiedPatternId] = useState<string | null>(null);
  useEffect(() => {
    void readData().then(() => setLoaded(true));

    function handleChange(
      changes: Record<string, chrome.storage.StorageChange>,
      area: string
    ) {
      if (area !== "session") return;
      if (
        DESIGN_IDEAS_STORAGE_KEY in changes ||
        RECOMMENDATIONS_STORAGE_KEY in changes ||
        EXCLUDED_UNCODIX_RULES_STORAGE_KEY in changes ||
        SELECTED_PATTERN_STORAGE_KEY in changes ||
        SELECTED_TEMPLATE_STORAGE_KEY in changes ||
        SELECTED_ANIMATION_STORAGE_KEY in changes
      ) {
        void readData();
      }
    }

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, []);

  async function readData() {
    const result = await chrome.storage.session.get([
      DESIGN_IDEAS_STORAGE_KEY,
      RECOMMENDATIONS_STORAGE_KEY,
      EXCLUDED_UNCODIX_RULES_STORAGE_KEY,
      SELECTED_PATTERN_STORAGE_KEY,
      SELECTED_TEMPLATE_STORAGE_KEY,
      SELECTED_ANIMATION_STORAGE_KEY
    ]);
    const stored = result[RECOMMENDATIONS_STORAGE_KEY] as RecommendationsData | undefined;
    const storedIdeas = result[DESIGN_IDEAS_STORAGE_KEY] as DesignIdeasData | undefined;
    if (!stored && !storedIdeas) {
      setData(null);
      setIdeas(null);
      return;
    }
    const excluded =
      (result[EXCLUDED_UNCODIX_RULES_STORAGE_KEY] as string[] | undefined) ??
      stored?.excludedRuleIds ??
      [];
    setData(stored ? { ...stored, excludedRuleIds: excluded } : null);
    setIdeas(
      storedIdeas
        ? {
            ...storedIdeas,
            selectedPatternId:
              (result[SELECTED_PATTERN_STORAGE_KEY] as string | undefined) ??
              storedIdeas.selectedPatternId ??
              null,
            selectedTemplateId:
              (result[SELECTED_TEMPLATE_STORAGE_KEY] as string | undefined) ??
              storedIdeas.selectedTemplateId ??
              null,
            selectedAnimationId:
              (result[SELECTED_ANIMATION_STORAGE_KEY] as string | undefined) ??
              storedIdeas.selectedAnimationId ??
              null
          }
        : null
    );
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
  const strongestArea = strongestCategory(findings);
  const mode = data?.mode ?? ideas?.mode ?? "simple";
  const templates = useMemo(
    () =>
      (ideas?.templateReferences ?? []).filter(
        (reference) => mode === "developer" || reference.urlStatus !== "broken"
      ),
    [ideas?.templateReferences, mode]
  );
  const selectedPattern = ideas?.layoutPatterns.find(
    (pattern) => pattern.id === ideas.selectedPatternId
  );
  const selectedTemplate = templates.find(
    (reference) => reference.id === ideas?.selectedTemplateId
  );
  const selectedAnimation = ideas?.animationReferences.find(
    (reference) => reference.id === ideas.selectedAnimationId
  );
  const cursorPrompt = ideas?.cursorPrompt ?? data?.cursorPrompt ?? "";
  const counts = {
    recommendations: findings.length,
    layouts: ideas?.layoutPatterns.length ?? 0,
    templates: templates.length,
    animations: ideas?.animationReferences.length ?? 0
  };

  async function selectPattern(pattern: LayoutPattern) {
    await chrome.storage.session.set({ [SELECTED_PATTERN_STORAGE_KEY]: pattern.id });
  }

  async function copyPatternDirection(pattern: LayoutPattern) {
    const text = [
      `Layout direction: ${pattern.name}`,
      pattern.promptInstruction,
      pattern.tailwindHint ? `Tailwind hint: ${pattern.tailwindHint}` : ""
    ]
      .filter(Boolean)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopiedPatternId(pattern.id);
    window.setTimeout(
      () => setCopiedPatternId((current) => (current === pattern.id ? null : current)),
      1600
    );
  }

  async function selectTemplate(reference: TemplateReference) {
    const current = ideas?.selectedTemplateId === reference.id ? null : reference.id;
    await chrome.storage.session.set({ [SELECTED_TEMPLATE_STORAGE_KEY]: current });
  }

  async function selectAnimation(id: string) {
    const current = ideas?.selectedAnimationId === id ? null : id;
    await chrome.storage.session.set({ [SELECTED_ANIMATION_STORAGE_KEY]: current });
  }

  async function openTemplate(reference: TemplateReference) {
    const url =
      reference.urlStatus === "broken" ? reference.fallbackUrl : reference.url;
    if (url) await chrome.tabs.create({ url });
  }

  async function copyPrompt() {
    if (!cursorPrompt) return;
    await navigator.clipboard.writeText(cursorPrompt);
    setCopiedPrompt(true);
    window.setTimeout(() => setCopiedPrompt(false), 1600);
  }

  return (
    <main className="flex min-h-screen bg-pilot-bg text-pilot-text">
      <WorkspaceSidebar
        active={tab}
        counts={counts}
        onTab={setTab}
        sourceTitle={data?.sourceTitle ?? ideas?.sourceTitle}
        sourceUrl={data?.sourceUrl ?? ideas?.sourceUrl}
        status={data?.hasAnalysis || ideas?.hasAnalysis ? "Analysis complete" : "Waiting for analysis"}
      />

      <section className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-8 pb-28 pt-7">
          {!loaded ? (
            <EmptyState message="Loading recommendations..." />
          ) : !data || !data.hasAnalysis || !data.analysis ? (
            <EmptyState message="No analysis yet. Select an area in the side panel and run analysis first." />
          ) : (
            <div>
              {tab === "recommendations" ? (
                findings.length === 0 ? (
                  <EmptyState message="This block looks clean. No generic AI UI patterns were detected." />
                ) : (
                  <>
                    <PageHeader
                      eyebrow="Recommendations"
                      title="What to fix first"
                      description={`${findings.length} issues found on ${data.sourceTitle ?? "Beunique"}`}
                    />

                    <SummaryBand
                      aiDetectScore={data.analysis.aiLikeScore}
                      total={findings.length}
                      included={includedCount}
                      strongestArea={strongestArea}
                      summary={data.analysis.summary}
                    />

                    {CATEGORY_ORDER.filter((category) => groups[category]?.length).map(
                      (category) => (
                        <section className="mt-6" key={category}>
                          <GroupHeader
                            count={groups[category].length}
                            label={CATEGORY_LABEL[category] ?? category}
                          />
                          <div className="grid gap-2.5">
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
                  </>
                )
              ) : null}

              {tab === "layouts" ? (
                ideas && counts.layouts ? (
                  <>
                    <PageHeader
                      eyebrow="Layout ideas"
                      title="Choose the structure"
                      description="The selected layout becomes the default direction in the Cursor prompt."
                    />
                    {ideas.fitReason ? (
                      <section className="mt-5 rounded-xl border border-pilot-border bg-pilot-card p-4 shadow-pilot">
                        <p className="text-[11px] font-black uppercase tracking-[0.08em] text-pilot-soft">
                          Detected need
                        </p>
                        <p className="mt-2 text-sm leading-6 text-pilot-muted">
                          {ideas.fitReason}
                        </p>
                      </section>
                    ) : null}
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {ideas.layoutPatterns.map((pattern) => (
                        <PatternCard
                          key={pattern.id}
                          pattern={pattern}
                          selected={ideas.selectedPatternId === pattern.id}
                          copied={copiedPatternId === pattern.id}
                          selectLabel={
                            ideas.selectedPatternId === pattern.id ? "Selected" : "Use layout"
                          }
                          copyLabel="Copy direction"
                          onSelect={() => void selectPattern(pattern)}
                          onCopyPrompt={() => void copyPatternDirection(pattern)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyState message="No layout patterns matched this block." />
                )
              ) : null}

              {tab === "templates" ? (
                ideas && counts.templates ? (
                  <>
                    <PageHeader
                      eyebrow="Templates"
                      title="Add a visual reference"
                      description="Attach one reference when you want the prompt to borrow a specific composition or product feel."
                    />
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {templates.map((reference) => (
                        <TemplateReferenceCard
                          key={reference.id}
                          mode={mode}
                          reference={reference}
                          selected={ideas.selectedTemplateId === reference.id}
                          onOpen={() => void openTemplate(reference)}
                          onSelect={() => void selectTemplate(reference)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyState message="No template references for this block." />
                )
              ) : null}

              {tab === "animations" ? (
                ideas && counts.animations ? (
                  <>
                    <PageHeader
                      eyebrow="Animations"
                      title="Add motion guidance"
                      description="Use motion only when it clarifies state, focus, or transitions."
                    />
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {ideas.animationReferences.map((reference) => (
                        <AnimationReferenceCard
                          key={reference.id}
                          reference={reference}
                          selected={ideas.selectedAnimationId === reference.id}
                          onSelect={() => void selectAnimation(reference.id)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyState message="No animation ideas for this block." />
                )
              ) : null}

            </div>
          )}
        </div>
        <WorkspaceActionBar
          copiedPrompt={copiedPrompt}
          cursorPrompt={cursorPrompt}
          onCopyPrompt={() => void copyPrompt()}
          selectedAnimation={selectedAnimation?.title}
          selectedPattern={selectedPattern?.name}
          selectedTemplate={selectedTemplate?.title}
        />
      </section>
    </main>
  );
}

function WorkspaceSidebar({
  active,
  counts,
  onTab,
  sourceTitle,
  sourceUrl,
  status
}: {
  active: WorkspaceTab;
  counts: {
    recommendations: number;
    layouts: number;
    templates: number;
    animations: number;
  };
  onTab: (tab: WorkspaceTab) => void;
  sourceTitle?: string;
  sourceUrl?: string;
  status: string;
}) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-pilot-border bg-pilot-card">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pilot-primary text-base font-black tracking-[-0.04em] text-pilot-bg">
          B
        </div>
        <div className="leading-tight">
          <p className="text-sm font-black text-pilot-text">Beunique</p>
          <p className="text-[11px] text-pilot-soft">Design analysis</p>
        </div>
      </div>

      <nav className="grid gap-1 px-2">
        <NavButton
          active={active === "recommendations"}
          badge={counts.recommendations ? String(counts.recommendations) : undefined}
          label="Recommendations"
          onClick={() => onTab("recommendations")}
        />
        <NavButton
          active={active === "layouts"}
          badge={counts.layouts ? String(counts.layouts) : undefined}
          label="Layout Ideas"
          onClick={() => onTab("layouts")}
        />
        <NavButton
          active={active === "templates"}
          badge={counts.templates ? String(counts.templates) : undefined}
          label="Templates"
          onClick={() => onTab("templates")}
        />
        <NavButton
          active={active === "animations"}
          badge={counts.animations ? String(counts.animations) : undefined}
          label="Animations"
          onClick={() => onTab("animations")}
        />
      </nav>

      <div className="mx-4 my-4 h-px bg-pilot-border" />

      <div className="mx-4 rounded-xl border border-pilot-border bg-pilot-bg p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-pilot-border bg-pilot-panel text-xs font-black text-pilot-muted">
            B
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold text-pilot-text">
              {sourceTitle || "Beunique"}
            </p>
            <p className="truncate font-mono text-[10px] text-pilot-soft">
              {sourceUrl || "beunique.app"}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-pilot-success" />
          <span className="text-xs font-medium text-pilot-muted">{status}</span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="grid gap-2 p-4">
        <button
          className="rounded-lg border border-pilot-borderStrong px-3 py-2 text-sm font-semibold text-pilot-text transition hover:bg-pilot-surface"
          onClick={closeCurrentTab}
          type="button"
        >
          Close tab
        </button>
      </div>
    </aside>
  );
}

function NavButton({
  active,
  badge,
  label,
  onClick
}: {
  active: boolean;
  badge?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
        active ? "bg-pilot-surface text-pilot-text" : "text-pilot-muted hover:bg-pilot-surface"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-60" />
      <span className="flex-1">{label}</span>
      {badge ? (
        <span className="rounded-full bg-pilot-primary px-2 py-0.5 text-[11px] font-bold text-pilot-bg">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function WorkspaceActionBar({
  copiedPrompt,
  cursorPrompt,
  onCopyPrompt,
  selectedAnimation,
  selectedPattern,
  selectedTemplate
}: {
  copiedPrompt: boolean;
  cursorPrompt: string;
  onCopyPrompt: () => void;
  selectedAnimation?: string;
  selectedPattern?: string;
  selectedTemplate?: string;
}) {
  if (!cursorPrompt && !selectedPattern) return null;

  const selections = [
    selectedPattern ?? "Recommendation fixes",
    selectedTemplate,
    selectedAnimation
  ].filter(
    (item): item is string => Boolean(item)
  );

  return (
    <div className="sticky bottom-0 border-t border-pilot-border bg-pilot-card/95 px-8 py-3 shadow-glow backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-pilot-soft">
            Selected direction
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {selections.map((selection) => (
              <span className="dh-chip" key={selection}>
                {selection}
              </span>
            ))}
          </div>
        </div>
        <button
          className="dh-button-primary px-4 py-2.5 text-sm"
          disabled={!cursorPrompt}
          onClick={onCopyPrompt}
          type="button"
        >
          {copiedPrompt ? "Copied" : "Copy Prompt"}
        </button>
      </div>
    </div>
  );
}

function PageHeader({
  description,
  eyebrow,
  title
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <header>
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-pilot-soft">
        {eyebrow}
      </p>
      <h1 className="mt-1 text-2xl font-black tracking-tight text-pilot-text">
        {title}
      </h1>
      <p className="mt-1 text-sm leading-6 text-pilot-muted">{description}</p>
    </header>
  );
}

function SummaryBand({
  aiDetectScore,
  included,
  strongestArea,
  summary,
  total
}: {
  aiDetectScore: number;
  included: number;
  strongestArea: string;
  summary: string;
  total: number;
}) {
  return (
    <section className="mt-5 flex flex-wrap items-center gap-5 rounded-xl border border-pilot-border bg-pilot-card p-5 shadow-pilot">
      <div className="flex items-center gap-3">
        <ScoreRing score={aiDetectScore} />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-pilot-soft">
            AI Detect
          </p>
          <p className="mt-1 text-sm font-semibold text-pilot-muted">{summary}</p>
        </div>
      </div>
      <Divider />
      <Metric label="Detected issues" value={total} />
      <Divider />
      <Metric label="Included fixes" value={`${included}/${total}`} />
      <Divider />
      <div className="min-w-48">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-pilot-soft">
          Strongest area
        </p>
        <p className="mt-1 text-sm font-black text-pilot-text">{strongestArea}</p>
      </div>
    </section>
  );
}

function ScoreRing({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[5px] border-pilot-borderStrong bg-pilot-bg text-lg font-black text-pilot-text">
      {clamped}
    </div>
  );
}

function Divider() {
  return <div className="hidden h-11 w-px bg-pilot-border md:block" />;
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-pilot-soft">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-pilot-text">{value}</p>
    </div>
  );
}

function GroupHeader({ count, label }: { count: number; label: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h2 className="text-xs font-black uppercase tracking-[0.08em] text-pilot-soft">
        {label}
      </h2>
      <span className="text-xs font-semibold text-pilot-soft">{count}</span>
      <div className="h-px flex-1 bg-pilot-border" />
    </div>
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
    <article className="relative flex gap-3 rounded-xl border border-pilot-border bg-pilot-card p-4 shadow-pilot transition hover:border-pilot-borderStrong">
      <button
        aria-label={included ? "Exclude from prompt" : "Include in prompt"}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-black ${
          included
            ? "border-pilot-primary bg-pilot-primary text-pilot-bg"
            : "border-pilot-borderStrong bg-transparent text-transparent"
        }`}
        onClick={onToggle}
        type="button"
      >
        ✓
      </button>

      <EvidenceThumb finding={finding} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-black leading-6 text-pilot-text">
            {finding.title}
          </h3>
          <SeverityBadge severity={finding.severity} />
        </div>
        {developer ? (
          <div className="mt-1 flex flex-wrap gap-1 font-mono text-[10px] text-pilot-soft">
            <code className="rounded bg-pilot-surface px-1.5 py-0.5">{finding.ruleId}</code>
            <span className="rounded bg-pilot-surface px-1.5 py-0.5">
              {Math.round(finding.confidence * 100)}%
            </span>
            <span className="rounded bg-pilot-surface px-1.5 py-0.5">
              {finding.sources.join("+")}
            </span>
          </div>
        ) : null}
        <p className="mt-2 text-sm leading-6 text-pilot-muted">
          {finding.whyItFeelsAI || finding.evidence[0] || "Detected during analysis."}
        </p>
        <div className="mt-2 flex gap-2 text-sm leading-6">
          <span className="mt-1 text-[10px] font-black uppercase tracking-[0.08em] text-pilot-soft">
            Fix
          </span>
          <span className="text-pilot-muted">{finding.recommendation}</span>
        </div>
        <p className="mt-1 text-xs leading-5 text-pilot-soft">
          Better direction: {finding.betterDirection}
        </p>
      </div>
    </article>
  );
}

function EvidenceThumb({ finding }: { finding: UncodixifyFinding }) {
  const high = finding.severity === "high";
  return (
    <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-pilot-border bg-pilot-surface sm:block">
      <div className="absolute left-2 right-2 top-2 h-2 rounded bg-pilot-muted/30" />
      <div className="absolute left-2 top-6 h-7 w-8 rounded border border-pilot-border bg-pilot-card" />
      <div className="absolute left-12 right-2 top-6 h-7 rounded border border-pilot-border bg-pilot-card" />
      <div
        className={`absolute inset-x-2 bottom-2 h-3 rounded border ${
          high ? "border-pilot-danger" : "border-pilot-warning"
        } border-dashed`}
      />
    </div>
  );
}

function SeverityBadge({ severity }: { severity: UncodixifyFinding["severity"] }) {
  const tone =
    severity === "high"
      ? "bg-pilot-danger/15 text-pilot-danger"
      : severity === "medium"
        ? "bg-pilot-warning/15 text-pilot-warning"
        : "bg-pilot-surface text-pilot-muted";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tone}`}>
      {severity}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-pilot-border bg-pilot-card p-6 text-base font-semibold text-pilot-muted shadow-pilot">
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

function strongestCategory(findings: UncodixifyFinding[]) {
  const counts = new Map<string, number>();
  for (const finding of findings) {
    const label = CATEGORY_LABEL[finding.category] ?? finding.category ?? "Layout";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  const [label, count] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] ?? [
    "None",
    0
  ];
  return count ? `${label} · ${count} ${count === 1 ? "issue" : "issues"}` : "None";
}
