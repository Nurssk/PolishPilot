import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PreviewIframe } from "../components/PreviewIframe";
import { FULL_PREVIEW_STORAGE_KEY } from "../shared/messages";
import { buildHumanizedPreviewHtml } from "../patterns/buildHumanizedPreviewHtml";
import { generateCursorPrompt } from "../patterns/generateCursorPrompt";
import {
  appendPreviewDebugLogs,
  createPreviewDebugLog,
  sanitizeDebugCss,
  sanitizeDebugHtml,
  truncateDebugText,
  type PreviewDebugLog
} from "../shared/previewDebug";
import type { PreviewContent } from "../patterns/extractPreviewItems";
import type { AnimationReference } from "../patterns/animationReferences";
import type { LayoutPattern } from "../patterns/layoutPatterns";
import type { PreviewIframeRenderInfo } from "../components/PreviewIframe";
import type { TemplateReference } from "../patterns/templateReferences";
import type {
  AIUnderstandingResult,
  PolishPilotMode,
  RectangleCapture,
  StyleContext
} from "../shared/types";

type FullPreviewData = {
  patternId: LayoutPattern["id"];
  pattern: LayoutPattern;
  previewContent: PreviewContent;
  styleContext?: StyleContext;
  sectionType?: string;
  aiResult?: AIUnderstandingResult | null;
  templateReference?: TemplateReference | null;
  animationReference?: AnimationReference | null;
  capture?: RectangleCapture | null;
  captureId?: string;
  mode?: PolishPilotMode;
};

export function FullPreviewPage() {
  const [data, setData] = useState<FullPreviewData | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [iframeRenderInfo, setIframeRenderInfo] =
    useState<PreviewIframeRenderInfo | null>(null);
  const generatedLogKeyRef = useRef("");
  const iframeLogKeyRef = useRef("");

  useEffect(() => {
    chrome.storage.session
      .get(FULL_PREVIEW_STORAGE_KEY)
      .then((result) => {
        setData((result[FULL_PREVIEW_STORAGE_KEY] as FullPreviewData | undefined) ?? null);
      })
      .catch(() => setData(null));
  }, []);

  async function copyPrompt() {
    if (!data?.pattern) {
      return;
    }

    const prompt = generateCursorPrompt({
      pattern: data.pattern,
      aiResult: data.aiResult,
      capture: data.capture,
      designDirectionSelected: true,
      templateReference: data.templateReference,
      animationReference: data.animationReference
    });

    await navigator.clipboard.writeText(prompt);
    setCopyStatus("Copied.");
    window.setTimeout(() => setCopyStatus(""), 1800);
  }

  const builtPreview = useMemo(
    () =>
      data?.pattern && data.previewContent
        ? buildHumanizedPreviewHtml({
            pattern: data.pattern,
            content: data.previewContent,
            styleTokens: data.capture?.styleTokens
          })
        : null,
    [data]
  );
  const previewDimensions = getPreviewDimensions(data?.capture);
  const previewFrameStyle = {
    aspectRatio: `${previewDimensions.width} / ${previewDimensions.height}`
  };

  const appendPreviewLog = useCallback(
    (log: PreviewDebugLog) => {
      setData((current) => {
        if (!current?.capture) {
          return current;
        }

        const nextCapture = {
          ...current.capture,
          previewDebugLogs: appendPreviewDebugLogs(current.capture.previewDebugLogs, [log])
        };
        const nextData = {
          ...current,
          capture: nextCapture
        };

        void chrome.storage.session.set({
          [FULL_PREVIEW_STORAGE_KEY]: nextData
        });

        return nextData;
      });
    },
    []
  );

  useEffect(() => {
    if (!data?.pattern || !data.previewContent || !builtPreview) {
      return;
    }

    const key = `${data.captureId ?? "none"}:${data.pattern.id}:html-generation`;
    if (generatedLogKeyRef.current === key) {
      return;
    }
    generatedLogKeyRef.current = key;

    appendPreviewLog(
      createPreviewDebugLog("html-generation", "Humanized preview HTML/CSS generated", {
        summary: {
          patternId: data.pattern.id,
          patternName: data.pattern.name,
          rendererUsed: builtPreview.debug?.rendererUsed,
          preservedClassCount: builtPreview.debug?.preservedClassCount,
          inlineFallbackUsed: builtPreview.debug?.inlineFallbackUsed,
          generatedNodeCount: builtPreview.debug?.generatedNodeCount
        },
        outputHtml: truncateDebugText(sanitizeDebugHtml(builtPreview.html), 8000),
        outputCss: truncateDebugText(sanitizeDebugCss(builtPreview.layoutCss), 8000)
      })
    );
  }, [appendPreviewLog, builtPreview, data]);

  const handleIframeDebugLog = useCallback(
    (log: PreviewDebugLog) => {
      const key = `${data?.captureId ?? "none"}:${data?.pattern.id ?? "none"}:${log.stage}`;
      if (iframeLogKeyRef.current === key) {
        return;
      }
      iframeLogKeyRef.current = key;
      appendPreviewLog(log);
    },
    [appendPreviewLog, data?.captureId, data?.pattern.id]
  );

  return (
    <main className="min-h-screen bg-pilot-bg text-pilot-text">
      <header className="border-b border-pilot-border bg-pilot-panel/90 px-8 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black tracking-tight">Design Humanizer Preview</h1>
            <p className="mt-1 text-sm text-pilot-muted">
              {data?.pattern.name ?? "No selected pattern"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="dh-button-primary px-4 py-2 text-sm"
              disabled={!data?.pattern || !data.capture}
              onClick={() => void copyPrompt()}
              type="button"
            >
              Copy Cursor Prompt
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
        {copyStatus ? (
          <p className="mx-auto mt-2 max-w-7xl text-xs font-semibold text-pilot-primaryDeep">
            {copyStatus}
          </p>
        ) : null}
      </header>

      <section className="px-8 py-8">
        <div className="dh-card-elevated mx-auto max-w-[1440px] p-6">
          {data && builtPreview ? (
            <div className="grid gap-5 xl:grid-cols-2">
              <section className="min-w-0">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-black text-pilot-text">Original screenshot</h2>
                  <span className="dh-chip px-2 py-1 text-[11px]">
                    {data.capture?.selectedRect
                      ? `${Math.round(data.capture.selectedRect.width)} x ${Math.round(data.capture.selectedRect.height)}`
                      : "captured area"}
                  </span>
                </div>
                <div
                  className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-pilot-border bg-pilot-bg/70"
                  style={previewFrameStyle}
                >
                  {data.capture?.screenshotBase64 ? (
                    <img
                      alt="Original selected UI area"
                      className="h-full w-full object-contain"
                      src={getScreenshotImageSrc(data.capture.screenshotBase64)}
                    />
                  ) : (
                    <p className="text-sm text-pilot-muted">No screenshot found.</p>
                  )}
                </div>
              </section>

              <section className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-black text-pilot-text">Humanized live preview</h2>
                    <p className="mt-1 text-xs text-pilot-muted">
                      Isolated iframe using extracted CSS plus style-token fallback.
                    </p>
                  </div>
                  {data.mode === "developer" && data.capture ? (
                    <div className="flex flex-wrap gap-2 text-[11px] font-bold text-pilot-muted">
                      <span className="dh-chip px-2 py-1">
                        Used CSS rules: {data.capture.usedCssRules?.ruleCount ?? 0}
                      </span>
                      <span className="dh-chip px-2 py-1">
                        Skipped stylesheets: {data.capture.usedCssRules?.skippedStyleSheets ?? 0}
                      </span>
                      <span className="dh-chip px-2 py-1">
                        Style token fallback: {data.capture.styleTokens ? "enabled" : "missing"}
                      </span>
                    </div>
                  ) : null}
                </div>
                <div
                  className="w-full overflow-hidden rounded-xl border border-pilot-border bg-white shadow-2xl shadow-black/25"
                  style={previewFrameStyle}
                >
                  <PreviewIframe
                    debug={data.mode === "developer"}
                    html={builtPreview.html}
                    layoutCss={builtPreview.layoutCss}
                    onDebugLog={handleIframeDebugLog}
                    onRenderInfoChange={setIframeRenderInfo}
                    usedCssText={data.capture?.usedCssRules?.cssText}
                    viewportHeight={previewDimensions.height}
                    viewportWidth={previewDimensions.width}
                  />
                </div>
                {data.mode === "developer" ? (
                  <PreviewDebugPanel
                    builtHtmlLength={builtPreview.html.length}
                    cssRuleCount={data.capture?.usedCssRules?.ruleCount ?? 0}
                    iframeRenderInfo={iframeRenderInfo}
                    patternId={data.pattern.id}
                    previewContent={data.previewContent}
                  />
                ) : null}
              </section>
            </div>
          ) : (
            <div className="flex min-h-[600px] items-center justify-center rounded-xl border border-pilot-border bg-pilot-bg/60 p-8 text-center">
              <div>
                <h2 className="text-lg font-black text-pilot-text">No preview data found</h2>
                <p className="mt-2 text-sm leading-6 text-pilot-muted">
                  Return to the side panel, select a layout pattern, then open the full
                  preview again.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function getScreenshotImageSrc(screenshotBase64: string) {
  return screenshotBase64.startsWith("data:")
    ? screenshotBase64
    : `data:image/png;base64,${screenshotBase64}`;
}

function PreviewDebugPanel({
  builtHtmlLength,
  cssRuleCount,
  iframeRenderInfo,
  patternId,
  previewContent
}: {
  builtHtmlLength: number;
  cssRuleCount: number;
  iframeRenderInfo: PreviewIframeRenderInfo | null;
  patternId: string;
  previewContent: PreviewContent;
}) {
  const itemTitles = previewContent.items
    .map((item) => item.title)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mt-3 rounded-xl border border-pilot-border bg-pilot-bg/70 p-3 text-[11px] leading-5 text-pilot-muted">
      <div className="mb-2 font-black uppercase tracking-wide text-pilot-primaryDeep">
        Preview debug
      </div>
      <div className="grid gap-x-4 gap-y-1 md:grid-cols-2">
        <DebugRow label="previewContent" value={previewContent ? "yes" : "no"} />
        <DebugRow label="pattern id" value={patternId} />
        <DebugRow label="sectionTitle" value={previewContent.sectionTitle ?? "none"} />
        <DebugRow label="sectionSubtitle" value={previewContent.sectionSubtitle ?? "none"} />
        <DebugRow label="items count" value={String(previewContent.items.length)} />
        <DebugRow label="item titles" value={itemTitles || "none"} />
        <DebugRow label="iframe readyState" value={iframeRenderInfo?.readyState ?? "pending"} />
        <DebugRow
          label="html length"
          value={String(iframeRenderInfo?.htmlLength ?? builtHtmlLength)}
        />
        <DebugRow label="css rules count" value={String(cssRuleCount)} />
        <DebugRow
          label="frame"
          value={
            iframeRenderInfo
              ? `${iframeRenderInfo.renderedFrameWidth} x ${iframeRenderInfo.renderedFrameHeight}`
              : "pending"
          }
        />
        <DebugRow
          label="scale"
          value={iframeRenderInfo ? iframeRenderInfo.scale.toFixed(3) : "pending"}
        />
        <DebugRow label="render error" value={iframeRenderInfo?.error ?? "none"} />
      </div>
    </div>
  );
}

function DebugRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <span className="font-black text-pilot-soft">{label}: </span>
      <span className="break-words text-pilot-text">{value}</span>
    </div>
  );
}

function getPreviewDimensions(capture: RectangleCapture | null | undefined) {
  const width = Math.max(1, Math.round(capture?.selectedRect.width ?? 800));
  const height = Math.max(1, Math.round(capture?.selectedRect.height ?? 420));

  return { width, height };
}
