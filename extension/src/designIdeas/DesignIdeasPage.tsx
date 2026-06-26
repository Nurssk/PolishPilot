import { useEffect, useMemo, useState } from "react";
import {
  DESIGN_IDEAS_STORAGE_KEY,
  SELECTED_ANIMATION_STORAGE_KEY,
  SELECTED_PATTERN_STORAGE_KEY,
  SELECTED_TEMPLATE_STORAGE_KEY
} from "../shared/messages";
import { PatternCard } from "../components/PatternCard";
import { TemplateReferenceCard } from "../components/TemplateReferenceCard";
import { AnimationReferenceCard } from "../components/AnimationReferenceCard";
import { closeCurrentTab } from "../shared/closeCurrentTab";
import type { DesignIdeasData } from "../shared/windowData";
import type { LayoutPattern } from "../patterns/layoutPatterns";
import type { TemplateReference } from "../patterns/templateReferences";

type Tab = "layouts" | "templates" | "animations";

export function DesignIdeasPage() {
  const [data, setData] = useState<DesignIdeasData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>(() => tabFromHash());
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
        SELECTED_PATTERN_STORAGE_KEY in changes ||
        SELECTED_TEMPLATE_STORAGE_KEY in changes ||
        SELECTED_ANIMATION_STORAGE_KEY in changes
      ) {
        void readData();
      }
    }

    function handleHashChange() {
      setTab(tabFromHash());
    }

    chrome.storage.onChanged.addListener(handleChange);
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      chrome.storage.onChanged.removeListener(handleChange);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  async function readData() {
    const result = await chrome.storage.session.get([
      DESIGN_IDEAS_STORAGE_KEY,
      SELECTED_PATTERN_STORAGE_KEY,
      SELECTED_TEMPLATE_STORAGE_KEY,
      SELECTED_ANIMATION_STORAGE_KEY
    ]);
    const stored = result[DESIGN_IDEAS_STORAGE_KEY] as DesignIdeasData | undefined;
    if (!stored) {
      setData(null);
      return;
    }
    setData({
      ...stored,
      selectedPatternId:
        (result[SELECTED_PATTERN_STORAGE_KEY] as string | undefined) ??
        stored.selectedPatternId ??
        null,
      selectedTemplateId:
        (result[SELECTED_TEMPLATE_STORAGE_KEY] as string | undefined) ??
        stored.selectedTemplateId ??
        null,
      selectedAnimationId:
        (result[SELECTED_ANIMATION_STORAGE_KEY] as string | undefined) ??
        stored.selectedAnimationId ??
        null
    });
  }

  function changeTab(next: Tab) {
    setTab(next);
    window.history.replaceState(null, "", `#${next}`);
  }

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
    const current = data?.selectedTemplateId === reference.id ? null : reference.id;
    await chrome.storage.session.set({ [SELECTED_TEMPLATE_STORAGE_KEY]: current });
  }

  async function selectAnimation(id: string) {
    const current = data?.selectedAnimationId === id ? null : id;
    await chrome.storage.session.set({ [SELECTED_ANIMATION_STORAGE_KEY]: current });
  }

  async function openTemplate(reference: TemplateReference) {
    const url =
      reference.urlStatus === "broken" ? reference.fallbackUrl : reference.url;
    if (url) await chrome.tabs.create({ url });
  }

  const mode = data?.mode ?? "simple";
  const templates = useMemo(
    () =>
      (data?.templateReferences ?? []).filter(
        (reference) => mode === "developer" || reference.urlStatus !== "broken"
      ),
    [data?.templateReferences, mode]
  );
  const counts = {
    layouts: data?.layoutPatterns.length ?? 0,
    templates: templates.length,
    animations: data?.animationReferences.length ?? 0
  };
  const selectedSummary = [
    selectedName(data?.layoutPatterns, data?.selectedPatternId),
    selectedName(templates, data?.selectedTemplateId),
    selectedName(data?.animationReferences, data?.selectedAnimationId)
  ].filter((item): item is string => Boolean(item));

  return (
    <main className="flex min-h-screen bg-pilot-bg text-pilot-text">
      <WorkspaceSidebar
        active={tab === "animations" ? "animations" : "ideas"}
        counts={counts}
        onTab={changeTab}
        sourceTitle={data?.sourceTitle}
        sourceUrl={data?.sourceUrl}
        status={data?.hasAnalysis ? "Analysis complete" : "Waiting for analysis"}
      />

      <section className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-8 py-7">
          {!loaded ? (
            <EmptyState message="Loading design ideas..." />
          ) : !data || !data.hasAnalysis ? (
            <EmptyState message="No analysis yet. Select an area in the side panel and run analysis first." />
          ) : (
            <>
              <PageHeader
                description="Choose a structure, optional reference, and motion direction for this selected UI."
                eyebrow="Design ideas"
                title={tab === "animations" ? "Animations" : "Layout Ideas"}
              />

              {data.fitReason ? (
                <section className="mt-5 rounded-xl border border-pilot-border bg-pilot-card p-4 shadow-pilot">
                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-pilot-soft">
                    Detected need
                  </p>
                  <p className="mt-2 text-sm leading-6 text-pilot-muted">{data.fitReason}</p>
                </section>
              ) : null}

              <div className="mt-5 inline-grid grid-cols-3 gap-1 rounded-xl bg-pilot-surface p-1">
                <SegmentButton
                  active={tab === "layouts"}
                  count={counts.layouts}
                  label="Layouts"
                  onClick={() => changeTab("layouts")}
                />
                <SegmentButton
                  active={tab === "templates"}
                  count={counts.templates}
                  label="Templates"
                  onClick={() => changeTab("templates")}
                />
                <SegmentButton
                  active={tab === "animations"}
                  count={counts.animations}
                  label="Animations"
                  onClick={() => changeTab("animations")}
                />
              </div>

              <div className="mt-5">
                {tab === "layouts" ? (
                  counts.layouts ? (
                    <>
                      <TabIntro
                        title="Choose the structure"
                        text="This is the main design decision. The selected layout becomes the default direction in the Cursor prompt."
                      />
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {data.layoutPatterns.map((pattern) => (
                          <PatternCard
                            key={pattern.id}
                            pattern={pattern}
                            selected={data.selectedPatternId === pattern.id}
                            copied={copiedPatternId === pattern.id}
                            selectLabel={
                              data.selectedPatternId === pattern.id ? "Selected" : "Use layout"
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
                  counts.templates ? (
                    <>
                      <TabIntro
                        title="Add a visual reference"
                        text="Attach one reference when you want the prompt to borrow a specific composition or product feel."
                      />
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {templates.map((reference) => (
                          <TemplateReferenceCard
                            key={reference.id}
                            mode={mode}
                            reference={reference}
                            selected={data.selectedTemplateId === reference.id}
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
                  counts.animations ? (
                    <>
                      <TabIntro
                        title="Add motion guidance"
                        text="Use motion only when it clarifies state, focus, or transitions. Avoid decoration-only animation."
                      />
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {data.animationReferences.map((reference) => (
                          <AnimationReferenceCard
                            key={reference.id}
                            reference={reference}
                            selected={data.selectedAnimationId === reference.id}
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

              <SelectionBar selections={selectedSummary} />
            </>
          )}
        </div>
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
  active: "recommendations" | "ideas" | "animations";
  counts: { layouts: number; templates: number; animations: number };
  onTab: (tab: Tab) => void;
  sourceTitle?: string;
  sourceUrl?: string;
  status: string;
}) {
  async function openRecommendations() {
    window.location.href = chrome.runtime.getURL("recommendations.html");
  }

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
          label="Recommendations"
          onClick={() => void openRecommendations()}
        />
        <NavButton
          active={active === "ideas"}
          badge={String(counts.layouts + counts.templates)}
          label="Layout Ideas"
          onClick={() => onTab("layouts")}
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

function SegmentButton({
  active,
  count,
  label,
  onClick
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-lg px-4 py-2 text-sm font-black transition ${
        active
          ? "bg-pilot-card text-pilot-text shadow-pilot"
          : "text-pilot-muted hover:text-pilot-text"
      }`}
      onClick={onClick}
      type="button"
    >
      {label} <span className="font-semibold text-pilot-soft">{count}</span>
    </button>
  );
}

function TabIntro({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-4 rounded-xl border border-pilot-border bg-pilot-card p-4 shadow-pilot">
      <h2 className="text-lg font-black text-pilot-text">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-pilot-muted">{text}</p>
    </div>
  );
}

function SelectionBar({ selections }: { selections: string[] }) {
  if (!selections.length) return null;

  return (
    <div className="sticky bottom-4 mt-6 rounded-xl border border-pilot-borderStrong bg-pilot-card/95 p-3 shadow-glow backdrop-blur">
      <p className="text-[11px] font-black uppercase tracking-[0.08em] text-pilot-soft">
        Selected direction
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {selections.map((selection) => (
          <span className="dh-chip" key={selection}>
            {selection}
          </span>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-pilot-border bg-pilot-card p-6 text-base font-semibold text-pilot-muted shadow-pilot">
      {message}
    </div>
  );
}

function tabFromHash(): Tab {
  const value = window.location.hash.replace("#", "");
  if (value === "templates" || value === "animations") return value;
  return "layouts";
}

function selectedName<T extends { id: string; name?: string; title?: string }>(
  items: T[] | undefined,
  id: string | null | undefined
) {
  if (!items || !id) return null;
  const item = items.find((candidate) => candidate.id === id);
  return item?.name ?? item?.title ?? null;
}
