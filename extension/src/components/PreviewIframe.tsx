import { useEffect, useMemo, useRef, useState } from "react";
import {
  createPreviewDebugLog,
  sanitizeDebugCss,
  sanitizeDebugHtml,
  truncateDebugText,
  type PreviewDebugLog
} from "../shared/previewDebug";

export type PreviewIframeRenderInfo = {
  readyState: string;
  htmlLength: number;
  usedCssLength: number;
  layoutCssLength: number;
  totalDocumentLength: number;
  renderedFrameWidth: number;
  renderedFrameHeight: number;
  scale: number;
  error?: string;
};

type PreviewIframeProps = {
  html: string;
  usedCssText?: string;
  layoutCss?: string;
  title?: string;
  viewportWidth?: number;
  viewportHeight?: number;
  debug?: boolean;
  onDebugLog?: (log: PreviewDebugLog) => void;
  onRenderInfoChange?: (info: PreviewIframeRenderInfo) => void;
};

type PreviewDocumentInput = {
  html: string;
  usedCssText: string;
  layoutCss: string;
  title: string;
  viewportWidth: number;
  viewportHeight: number;
  scale: number;
  debug: boolean;
};

export function PreviewIframe({
  html,
  usedCssText = "",
  layoutCss = "",
  title = "Humanized preview",
  viewportWidth = 800,
  viewportHeight = 420,
  debug = false,
  onDebugLog,
  onRenderInfoChange
}: PreviewIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [frameSize, setFrameSize] = useState({
    width: viewportWidth,
    height: viewportHeight
  });
  const scale = Math.max(
    0.1,
    Math.min(frameSize.width / viewportWidth, frameSize.height / viewportHeight)
  );
  const srcDoc = useMemo(
    () =>
      buildPreviewDocument({
        html,
        usedCssText,
        layoutCss,
        title,
        viewportWidth,
        viewportHeight,
        scale,
        debug
      }),
    [debug, html, layoutCss, scale, title, usedCssText, viewportHeight, viewportWidth]
  );
  const renderInfo = useMemo<PreviewIframeRenderInfo>(
    () => ({
      readyState: "pending",
      htmlLength: html.length,
      usedCssLength: usedCssText.length,
      layoutCssLength: layoutCss.length,
      totalDocumentLength: srcDoc.length,
      renderedFrameWidth: frameSize.width,
      renderedFrameHeight: frameSize.height,
      scale
    }),
    [
      frameSize.height,
      frameSize.width,
      html.length,
      layoutCss.length,
      scale,
      srcDoc.length,
      usedCssText.length
    ]
  );

  useEffect(() => {
    onRenderInfoChange?.(renderInfo);
  }, [onRenderInfoChange, renderInfo]);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return undefined;
    }
    const observedIframe = iframe;

    function updateFrameSize() {
      const rect = observedIframe.getBoundingClientRect();

      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      setFrameSize((current) => {
        const nextWidth = Math.round(rect.width);
        const nextHeight = Math.round(rect.height);

        if (current.width === nextWidth && current.height === nextHeight) {
          return current;
        }

        return {
          width: nextWidth,
          height: nextHeight
        };
      });
    }

    updateFrameSize();

    const observer = new ResizeObserver(updateFrameSize);
    observer.observe(observedIframe);
    window.addEventListener("resize", updateFrameSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateFrameSize);
    };
  }, []);

  useEffect(() => {
    if (!debug) {
      return;
    }

    onDebugLog?.(
      createPreviewDebugLog("iframe-render", "Preview iframe document injected", {
        summary: {
          htmlLength: html.length,
          usedCssLength: usedCssText.length,
          layoutCssLength: layoutCss.length,
          totalDocumentLength: srcDoc.length,
          viewportWidth,
          viewportHeight,
          renderedFrameWidth: frameSize.width,
          renderedFrameHeight: frameSize.height,
          scale
        },
        htmlPreview: truncateDebugText(sanitizeDebugHtml(html), 4000),
        cssPreview: truncateDebugText(
          sanitizeDebugCss(`${usedCssText}\n\n${buildSafePreviewCss(debug)}\n\n${layoutCss}`),
          8000
        )
      })
    );
  }, [
    debug,
    frameSize.height,
    frameSize.width,
    html,
    layoutCss,
    onDebugLog,
    scale,
    srcDoc,
    usedCssText,
    viewportHeight,
    viewportWidth
  ]);

  function handleLoad() {
    let readyState = "loaded";
    let error: string | undefined;

    try {
      readyState = iframeRef.current?.contentDocument?.readyState ?? "loaded";
    } catch (caughtError) {
      error = caughtError instanceof Error ? caughtError.message : String(caughtError);
    }

    const nextInfo = {
      ...renderInfo,
      readyState,
      error
    };

    onRenderInfoChange?.(nextInfo);

    if (debug) {
      onDebugLog?.(
        createPreviewDebugLog("iframe-render", "Preview iframe loaded", {
          summary: nextInfo,
          warnings: error ? [error] : []
        })
      );
    }
  }

  return (
    <iframe
      className="h-full w-full border-0 bg-white"
      onLoad={handleLoad}
      ref={iframeRef}
      sandbox=""
      srcDoc={srcDoc}
      title={title}
    />
  );
}

function buildPreviewDocument({
  html,
  usedCssText,
  layoutCss,
  title,
  viewportWidth,
  viewportHeight,
  scale,
  debug
}: PreviewDocumentInput) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: light dark;
      }
      * {
        box-sizing: border-box;
      }
      html,
      body {
        margin: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      body {
        background: transparent;
      }
      .dh-preview-document {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
      }
      .dh-preview-viewport {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
      }
      .dh-preview-canvas {
        width: ${Math.max(1, Math.round(viewportWidth))}px;
        height: ${Math.max(1, Math.round(viewportHeight))}px;
        overflow: hidden;
        transform: scale(${scale.toFixed(6)});
        transform-origin: top left;
      }
      ${sanitizeCss(usedCssText)}
      ${buildSafePreviewCss(debug)}
      ${sanitizeCss(layoutCss)}
      ${buildSafePreviewCss(debug)}
    </style>
  </head>
  <body>
    <div class="dh-preview-document">
      <div class="dh-preview-viewport">
        <div class="dh-preview-canvas">
          ${sanitizeHtml(html)}
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function sanitizeHtml(value: string) {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/\s(?:href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\1/gi, "");
}

function sanitizeCss(value: string) {
  return value
    .replace(/<\/style/gi, "<\\/style")
    .replace(/@import[^;]+;/gi, "")
    .replace(/url\(\s*(['"]?)\s*javascript:[^)]+\)/gi, "none");
}

function buildSafePreviewCss(debug: boolean) {
  return `
html,
body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
  background: #ffffff;
  color: #111827;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
* {
  box-sizing: border-box;
}
.dh-preview-document,
.dh-preview-viewport,
.dh-preview-canvas {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}
.polishpilot-preview-root {
  display: flex !important;
  opacity: 1 !important;
  visibility: visible !important;
  min-height: 100% !important;
  background: var(--pp-section-bg, #ffffff);
  color: var(--pp-text, #111827);
  font-family: inherit;
  ${debug ? "outline: 2px dashed rgba(14, 165, 233, 0.35);" : ""}
}
.polishpilot-preview-section,
.polishpilot-preview-header,
.polishpilot-preview-grid,
.polishpilot-preview-card,
.polishpilot-preview-heading,
.polishpilot-preview-subtitle,
.polishpilot-preview-card-title,
.polishpilot-preview-card-text {
  opacity: 1 !important;
  visibility: visible !important;
}
.polishpilot-preview-section {
  position: relative !important;
}
.polishpilot-preview-grid {
  display: grid !important;
}
.polishpilot-preview-card {
  display: block !important;
  background: var(--pp-card-bg, #ffffff);
  color: var(--pp-text, #111827);
  border: 1px solid var(--pp-border, #e5e7eb);
  border-radius: var(--pp-radius, 16px);
  box-shadow: var(--pp-shadow, none);
  padding: 24px;
}
.polishpilot-preview-icon-placeholder {
  display: inline-flex !important;
}
`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
