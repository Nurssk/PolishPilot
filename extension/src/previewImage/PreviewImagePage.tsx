import { useEffect, useMemo, useState } from "react";
import { downloadBase64Image, previewDownloadFilename } from "../shared/downloadImage";
import { getGeneratedPreviews } from "../shared/generatedPreviewStore";
import { closeCurrentTab } from "../shared/closeCurrentTab";
import { AI_PREVIEW_REGENERATE_KEY } from "../shared/messages";
import type { GeneratedPreviewImage } from "../shared/generatedPreviewTypes";

export function PreviewImagePage() {
  const [preview, setPreview] = useState<GeneratedPreviewImage | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerateNote, setRegenerateNote] = useState("");
  const previewId = useMemo(
    () => new URLSearchParams(window.location.search).get("id"),
    []
  );

  useEffect(() => {
    getGeneratedPreviews()
      .then((previews) => {
        setPreview(previews.find((item) => item.id === previewId) ?? previews[0] ?? null);
      })
      .catch(() => setPreview(null))
      .finally(() => setLoaded(true));
  }, [previewId]);

  async function openGallery() {
    await chrome.tabs.create({ url: chrome.runtime.getURL("preview-gallery.html") });
  }

  function downloadPreview() {
    if (!preview) return;
    downloadBase64Image(preview.imageBase64, previewDownloadFilename(preview.createdAt));
  }

  async function copyPrompt() {
    if (!preview?.promptUsed) return;
    await navigator.clipboard.writeText(preview.promptUsed);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function regenerate() {
    // The side panel owns the capture + selected pattern, so it performs the
    // actual regeneration. We signal it through session storage.
    await chrome.storage.session.set({ [AI_PREVIEW_REGENERATE_KEY]: Date.now() });
    setRegenerateNote(
      "Regenerate requested. Keep the side panel open — a new preview will appear."
    );
    window.setTimeout(() => setRegenerateNote(""), 4000);
  }

  return (
    <main className="min-h-screen bg-pilot-bg text-pilot-text">
      <header className="border-b border-pilot-border bg-pilot-panel px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight">AI Preview</h1>
            <p className="mt-1 truncate text-base text-pilot-muted">
              Compare the generated direction with the original screenshot.
              {preview ? ` · ${formatCreatedAt(preview.createdAt)}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="dh-button-primary px-4 py-2.5 text-sm"
              disabled={!preview}
              onClick={downloadPreview}
              type="button"
            >
              Download
            </button>
            <button
              className="dh-button-secondary px-4 py-2.5 text-sm"
              disabled={!preview}
              onClick={() => void regenerate()}
              type="button"
            >
              Regenerate
            </button>
            <button
              className="dh-button-secondary px-4 py-2.5 text-sm"
              disabled={!preview?.promptUsed}
              onClick={() => void copyPrompt()}
              type="button"
            >
              {copied ? "Copied" : "Copy Prompt"}
            </button>
            <button
              className="dh-button-secondary px-4 py-2.5 text-sm"
              onClick={() => void openGallery()}
              type="button"
            >
              Open Gallery
            </button>
            <button
              className="dh-button-secondary px-4 py-2.5 text-sm hover:border-pilot-danger/70"
              onClick={closeCurrentTab}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </header>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl">
          {regenerateNote ? (
            <p className="mb-4 rounded-lg border border-pilot-border bg-pilot-panel p-3 text-sm text-pilot-muted">
              {regenerateNote}
            </p>
          ) : null}

          {!loaded ? (
            <EmptyState message="Loading generated preview…" />
          ) : preview ? (
            <div className="grid gap-4">
              <section className="dh-card-elevated p-5">
                <p className="text-sm font-bold uppercase tracking-[0.08em] text-pilot-primaryDeep">
                  Selected direction
                </p>
                <h2 className="mt-2 text-xl font-black text-pilot-text">
                  {preview.patternName ?? "Generated design"}
                </h2>
                {preview.uncodixifyFindings && preview.uncodixifyFindings.length ? (
                  <p className="mt-3 text-base leading-7 text-pilot-muted">
                    Fixes used: {preview.uncodixifyFindings.slice(0, 3).join(", ")}
                  </p>
                ) : (
                  <p className="mt-3 text-base leading-7 text-pilot-muted">
                    Use this preview as a visual direction, then copy the prompt from the side panel for implementation.
                  </p>
                )}
              </section>

              <div className="grid gap-4 lg:grid-cols-2">
                <figure className="dh-card-elevated flex min-h-[420px] flex-col items-center justify-center p-4">
                  <figcaption className="mb-3 w-full text-base font-black text-pilot-text">
                    Generated design
                  </figcaption>
                  <img
                    alt="Generated AI preview"
                    className="max-h-[calc(100vh-260px)] max-w-full rounded-lg border border-pilot-border object-contain"
                    src={toDataUrl(preview.imageBase64)}
                  />
                </figure>

                {preview.sourceScreenshotBase64 ? (
                  <figure className="dh-card flex min-h-[420px] flex-col items-center justify-center p-4">
                    <figcaption className="mb-3 w-full text-base font-black text-pilot-text">
                      Original screenshot
                    </figcaption>
                    <img
                      alt="Source screenshot"
                      className="max-h-[calc(100vh-260px)] max-w-full rounded-lg border border-pilot-border object-contain"
                      src={toDataUrl(preview.sourceScreenshotBase64)}
                    />
                  </figure>
                ) : null}
              </div>

              <details className="dh-card p-4">
                <summary className="cursor-pointer text-base font-black text-pilot-text">
                  Details
                </summary>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric label="Section" value={preview.sectionType ?? "unknown"} />
                  <Metric label="Layout" value={preview.layoutType ?? "unknown"} />
                  <Metric
                    label="Model"
                    value={[preview.provider, preview.model].filter(Boolean).join(" · ") || "unknown"}
                  />
                  {typeof preview.uncodixifyScore === "number" ? (
                    <Metric label="Score" value={`${preview.uncodixifyScore}/100`} />
                  ) : null}
                </div>
                {preview.sourceTitle || preview.sourceUrl ? (
                  <p className="mt-3 break-words text-sm leading-6 text-pilot-muted">
                    {preview.sourceTitle ? `${preview.sourceTitle} · ` : ""}
                    {preview.sourceUrl ?? ""}
                  </p>
                ) : null}
              </details>
            </div>
          ) : (
            <div className="rounded-lg border border-pilot-border bg-pilot-panel p-6">
              <p className="text-lg font-bold text-pilot-text">
                AI Preview is unavailable right now.
              </p>
              <p className="mt-2 text-sm text-pilot-muted">
                You can still use the Cursor Prompt with the detected fixes.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  className="dh-button-secondary px-4 py-2.5 text-sm"
                  onClick={() => void openGallery()}
                  type="button"
                >
                  Open Gallery
                </button>
                <button
                  className="dh-button-secondary px-4 py-2.5 text-sm"
                  onClick={closeCurrentTab}
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-pilot-border bg-pilot-bg p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-pilot-soft">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold text-pilot-text">{value}</p>
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

function toDataUrl(imageBase64: string) {
  return imageBase64.startsWith("data:")
    ? imageBase64
    : `data:image/png;base64,${imageBase64}`;
}

function formatCreatedAt(createdAt: string) {
  return new Date(createdAt).toLocaleString();
}
