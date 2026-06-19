import { useEffect, useState } from "react";
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
  const [tab, setTab] = useState<Tab>("layouts");
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

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
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
  const templates = (data?.templateReferences ?? []).filter(
    (reference) => mode === "developer" || reference.urlStatus !== "broken"
  );
  const counts = {
    layouts: data?.layoutPatterns.length ?? 0,
    templates: templates.length,
    animations: data?.animationReferences.length ?? 0
  };

  return (
    <main className="min-h-screen bg-pilot-bg text-pilot-text">
      <header className="border-b border-pilot-border bg-pilot-panel px-6 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight">Design Ideas</h1>
            <p className="mt-1 truncate text-base text-pilot-muted">
              Pick one layout direction, then add optional reference or motion inspiration.
              {data?.sourceTitle ? ` · ${data.sourceTitle}` : ""}
            </p>
          </div>
          <button
            className="dh-button-secondary px-4 py-2.5 text-sm"
            onClick={closeCurrentTab}
            type="button"
          >
            Close
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {!loaded ? (
          <EmptyState message="Loading suggestions…" />
        ) : !data || !data.hasAnalysis ? (
          <EmptyState message="No analysis yet. Select an area in the side panel and run analysis first." />
        ) : (
          <>
            {data.fitReason ? (
              <section className="mb-5 dh-card-elevated p-5">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-pilot-primaryDeep">
                  Detected need
                </p>
                <p className="mt-2 text-base leading-7 text-pilot-muted">
                  {data.fitReason}
                </p>
              </section>
            ) : null}

            <div className="grid gap-2 rounded-lg border border-pilot-border bg-pilot-panel p-1 sm:inline-grid sm:grid-cols-3">
              {(
                [
                  ["layouts", `Layout (${counts.layouts})`],
                  ["templates", `Reference (${counts.templates})`],
                  ["animations", `Motion (${counts.animations})`]
                ] as const
              ).map(([key, label]) => (
                <button
                  className={`rounded-md px-4 py-3 text-sm font-bold transition ${
                    tab === key
                      ? "bg-pilot-primary text-white"
                      : "text-pilot-muted hover:text-pilot-text"
                  }`}
                  key={key}
                  onClick={() => setTab(key)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5">
              {tab === "layouts" ? (
                counts.layouts ? (
                  <>
                    <TabIntro
                      title="Choose the structure"
                      text="This is the main design decision. The selected layout becomes the default direction in the Cursor prompt."
                    />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                      text="Use this when you want the prompt to borrow a specific composition or product feel."
                    />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          </>
        )}
      </div>
    </main>
  );
}

function TabIntro({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-4 rounded-lg border border-pilot-border bg-pilot-bg p-4">
      <h2 className="text-lg font-black text-pilot-text">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-pilot-muted">{text}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-pilot-border bg-pilot-panel p-6 text-base font-semibold text-pilot-muted">
      {message}
    </div>
  );
}
