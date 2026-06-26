import { useEffect, useState } from "react";
import { downloadBase64Image, previewDownloadFilename } from "../shared/downloadImage";
import {
  clearGeneratedPreviews,
  getGeneratedPreviews,
  removeGeneratedPreview
} from "../shared/generatedPreviewStore";
import type { GeneratedPreviewImage } from "../shared/generatedPreviewTypes";

export function PreviewGalleryPage() {
  const [previews, setPreviews] = useState<GeneratedPreviewImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void loadPreviews();
  }, []);

  async function loadPreviews() {
    const stored = await getGeneratedPreviews();
    setPreviews(stored);
    setLoaded(true);
  }

  async function openPreview(preview: GeneratedPreviewImage) {
    const url = chrome.runtime.getURL(`preview-image.html?id=${preview.id}`);

    await chrome.tabs.create({ url });
  }

  async function removePreview(preview: GeneratedPreviewImage) {
    await removeGeneratedPreview(preview.id);
    await loadPreviews();
  }

  async function clearAll() {
    await clearGeneratedPreviews();
    setPreviews([]);
  }

  return (
    <main className="min-h-screen bg-pilot-bg text-pilot-text">
      <header className="border-b border-pilot-border bg-pilot-panel/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black tracking-tight">Generated Previews</h1>
            <p className="mt-1 text-sm text-pilot-muted">
              {previews.length ? `${previews.length} saved in this session` : "Session gallery"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="dh-button-secondary px-4 py-2 text-sm hover:border-red-300/70 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:text-pilot-soft"
              disabled={!previews.length}
              onClick={() => void clearAll()}
              type="button"
            >
              Clear all
            </button>
            <button
              className="dh-button-secondary px-4 py-2 text-sm"
              onClick={() => window.close()}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </header>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl">
          {!loaded ? (
            <EmptyState message="Loading generated previews..." />
          ) : previews.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {previews.map((preview) => (
                <PreviewCard
                  key={preview.id}
                  preview={preview}
                  onDownload={() =>
                    downloadBase64Image(
                      preview.imageBase64,
                      previewDownloadFilename(preview.createdAt)
                    )
                  }
                  onOpen={() => void openPreview(preview)}
                  onRemove={() => void removePreview(preview)}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No generated previews yet." />
          )}
        </div>
      </section>
    </main>
  );
}

function PreviewCard({
  preview,
  onDownload,
  onOpen,
  onRemove
}: {
  preview: GeneratedPreviewImage;
  onDownload: () => void;
  onOpen: () => void;
  onRemove: () => void;
}) {
  return (
    <article className="dh-card p-3 shadow-pilot">
      <button
        className="block aspect-[4/3] w-full overflow-hidden rounded-lg border border-pilot-border bg-pilot-bg/70"
        onClick={onOpen}
        type="button"
      >
        <img
          alt="Generated preview thumbnail"
          className="h-full w-full object-contain"
          src={toDataUrl(preview.imageBase64)}
        />
      </button>
      <div className="mt-3">
        <h2 className="truncate text-sm font-black text-pilot-text">
          {preview.patternName ?? "Generated preview"}
        </h2>
        <p className="mt-1 text-xs text-pilot-muted">{formatCreatedAt(preview.createdAt)}</p>
        <p className="mt-1 truncate text-[11px] text-pilot-soft">
          {[preview.provider, preview.model].filter(Boolean).join(" · ") || "model unknown"}
        </p>
        {typeof preview.uncodixifyScore === "number" ? (
          <p className="mt-1 truncate text-[11px] text-pilot-soft">
            AI Detect: {aiDetectFromCleanScore(preview.uncodixifyScore)}/100
          </p>
        ) : null}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          className="rounded-lg border border-pilot-primary/40 bg-pilot-primary px-2 py-2 text-xs font-bold text-white transition hover:bg-pilot-primaryDeep"
          onClick={onOpen}
          type="button"
        >
          Open
        </button>
        <button
          className="dh-button-secondary px-2 py-2 text-xs"
          onClick={onDownload}
          type="button"
        >
          Download
        </button>
        <button
          className="dh-button-secondary px-2 py-2 text-xs hover:border-red-300/70 hover:bg-red-500/10"
          onClick={onRemove}
          type="button"
        >
          Remove
        </button>
      </div>
    </article>
  );
}

function aiDetectFromCleanScore(score: number) {
  return Math.max(0, Math.min(100, 100 - Math.round(score)));
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="dh-card-elevated p-6 text-sm font-semibold text-pilot-muted">
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
