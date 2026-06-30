import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getAuthHeaders } from "../shared/authService";
import { apiUrl } from "../shared/apiConfig";
import { CODE_CHANGE_STORAGE_KEY } from "../shared/messages";
import type {
  CodeApplyStatus,
  CodeChangeRequest,
  CodeChangeResult,
  CodeChangeScope,
  SourceFileCandidate,
  SourcePatchEdit,
  SourcePatchRequest,
  SourcePatchResult
} from "../shared/types";
import type { CodeChangeData } from "../shared/windowData";
import {
  applyExactSourceEdit,
  buildUnifiedPatchText,
  isLikelySourceFile,
  rankSourceFileCandidates,
  shouldSkipSourceDirectory,
  type SourceFileInput
} from "./sourcePatch";

const CODE_CHANGE_URL = apiUrl("/api/generate-code-change");
const SOURCE_PATCH_URL = apiUrl("/api/generate-source-patch");
const CODE_HISTORY_URL = apiUrl("/api/code-generation-history");

type GenerateCodeChangeSuccessResponse = {
  ok: true;
  requestId: string;
  provider: "gemini";
  model: string;
  durationMs: number;
  result: CodeChangeResult;
  promptUsed: string;
  debug?: Record<string, unknown>;
};

type GenerateCodeChangeErrorResponse = {
  ok: false;
  requestId?: string;
  error?: {
    code?: string;
    message?: string;
    details?: string;
  };
  debug?: Record<string, unknown>;
};

type GenerateSourcePatchSuccessResponse = {
  ok: true;
  requestId: string;
  provider: "gemini";
  model: string;
  durationMs: number;
  result: SourcePatchResult;
  promptUsed: string;
  debug?: Record<string, unknown>;
};

type GenerateSourcePatchErrorResponse = {
  ok: false;
  requestId?: string;
  error?: {
    code?: string;
    message?: string;
    details?: string;
  };
  debug?: Record<string, unknown>;
};

type CodeGenerationHistoryItem = {
  id: string;
  createdAt: string;
  sourceUrl: string | null;
  sourceTitle: string | null;
  scope: string;
  sectionType: string | null;
  layoutType: string | null;
  patternName: string | null;
  templateTitle: string | null;
  animationTitle: string | null;
  model: string | null;
  requestId: string | null;
  diffSummary: string | null;
  generatedHtmlPreview: string;
  generatedHtml?: string;
  modifiedHtml?: string;
  modifiedCss?: string;
  cursorPrompt?: string;
  htmlChars: number;
  cssChars: number;
  htmlTruncated: boolean;
  cssTruncated: boolean;
};

type CodeHistoryResponse =
  | { ok: true; items: CodeGenerationHistoryItem[] }
  | { ok: false; error?: { code?: string; message?: string } };

type ProjectFileHandle = {
  kind: "file";
  name: string;
  getFile(): Promise<File>;
  createWritable(): Promise<{
    write(data: string): Promise<void>;
    close(): Promise<void>;
  }>;
};

type ProjectDirectoryHandle = {
  kind: "directory";
  name: string;
  values(): AsyncIterable<ProjectEntryHandle>;
  requestPermission?(descriptor?: { mode?: "read" | "readwrite" }): Promise<PermissionState>;
  getDirectoryHandle(name: string): Promise<ProjectDirectoryHandle>;
  getFileHandle(name: string): Promise<ProjectFileHandle>;
};

type ProjectEntryHandle = ProjectFileHandle | ProjectDirectoryHandle;

type WindowWithFileSystemAccess = Window & {
  showDirectoryPicker?: (options?: { mode?: "read" | "readwrite" }) => Promise<ProjectDirectoryHandle>;
};

type DiffRow = {
  kind: "same" | "added" | "removed";
  text: string;
  index: number;
};

export function CodeChangePage() {
  const [data, setData] = useState<CodeChangeData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [scope, setScope] = useState<CodeChangeScope>("selected-block");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<CodeChangeResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<
    "html" | "css" | "document" | "original" | "prompt" | "patch" | "download"
    | null
  >(null);
  const [generatedScope, setGeneratedScope] = useState<CodeChangeScope | null>(null);
  const [projectDirectory, setProjectDirectory] = useState<ProjectDirectoryHandle | null>(null);
  const [projectName, setProjectName] = useState("");
  const [fileHandles, setFileHandles] = useState<Map<string, ProjectFileHandle>>(new Map());
  const [candidateFiles, setCandidateFiles] = useState<SourceFileCandidate[]>([]);
  const [sourcePatch, setSourcePatch] = useState<SourcePatchResult | null>(null);
  const [sourcePatchStatus, setSourcePatchStatus] = useState<
    "idle" | "indexing" | "ready" | "generating" | "success" | "applying" | "error"
  >("idle");
  const [sourcePatchError, setSourcePatchError] = useState("");
  const [selectedEditIds, setSelectedEditIds] = useState<Set<string>>(new Set());
  const [applyStatuses, setApplyStatuses] = useState<CodeApplyStatus[]>([]);
  const [pagePreviewStatus, setPagePreviewStatus] = useState("");
  const [historyItems, setHistoryItems] = useState<CodeGenerationHistoryItem[]>([]);
  const [historyStatus, setHistoryStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    void readData().then(() => setLoaded(true));

    function handleChange(
      changes: Record<string, chrome.storage.StorageChange>,
      area: string
    ) {
      if (area !== "session") return;
      if (CODE_CHANGE_STORAGE_KEY in changes) {
        void readData();
      }
    }

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (loaded) {
      void loadCodeGenerationHistory();
    }
  }, [loaded]);

  const originalHtml = useMemo(
    () => getOriginalHtml(data, scope),
    [data, scope]
  );
  const selectedHtml = data?.capture?.selectedSourceSection?.htmlPreview ?? "";
  const selectedInlineHtml = data?.capture?.selectedSourceSection?.inlineHtmlPreview ?? "";
  const fullPageHtml = data?.capture?.fullPageHtmlPreview ?? "";
  const fullPageInlineHtml = data?.capture?.fullPageInlineHtmlPreview ?? "";
  const extractedCss = data?.capture?.usedCssRules?.cssText ?? "";
  const originalDownloadableDocument = useMemo(
    () =>
      originalHtml
        ? buildStandaloneHtmlDocument({
            title: data?.capture?.title,
            html: originalHtml,
            css: extractedCss
          })
        : "",
    [data?.capture?.title, extractedCss, originalHtml]
  );
  const downloadableDocument = useMemo(
    () =>
      result
        ? result.fullHtmlDocument ||
          buildStandaloneHtmlDocument({
            title: data?.capture?.title,
            html: result.modifiedHtml,
            css: result.modifiedCss || extractedCss
          })
        : "",
    [data?.capture?.title, extractedCss, result]
  );
  const diffRows = useMemo(
    () => buildDiffRows(originalHtml, result?.modifiedHtml ?? ""),
    [originalHtml, result?.modifiedHtml]
  );
  const sourcePatchText = useMemo(
    () => buildUnifiedPatchText(sourcePatch?.edits ?? []),
    [sourcePatch]
  );
  const supportsProjectFolder = typeof (window as WindowWithFileSystemAccess).showDirectoryPicker === "function";

  async function readData() {
    const stored = await chrome.storage.session.get(CODE_CHANGE_STORAGE_KEY);
    const next = (stored[CODE_CHANGE_STORAGE_KEY] as CodeChangeData | undefined) ?? null;
    setData(next);
    if (next) {
      setScope(next.defaultScope);
      setResult(next.lastResult ?? null);
      setGeneratedScope(next.lastResult ? next.defaultScope : null);
    }
  }

  function updateScope(nextScope: CodeChangeScope) {
    setScope(nextScope);
    setResult(null);
    setGeneratedScope(null);
    setError("");
    setStatus("idle");
    resetSourcePatchState();
  }

  async function generateCodeChange() {
    if (!data?.capture) {
      setError("No captured page data is available. Capture a UI area first.");
      setStatus("error");
      return;
    }

    const html = getOriginalHtml(data, scope);
    if (!html.trim()) {
      setError(
        scope === "whole-page"
          ? "No whole-page HTML snapshot is available for this capture."
          : "No selected-block HTML snapshot is available for this capture."
      );
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");
    setResult(null);
    setGeneratedScope(null);
    resetSourcePatchState();

    const request: CodeChangeRequest = {
      screenshotBase64: data.capture.screenshotBase64,
      scope,
      url: data.capture.url,
      title: data.capture.title,
      originalHtml: html,
      selectedHtml: selectedInlineHtml || selectedHtml,
      fullPageHtml: fullPageInlineHtml || fullPageHtml,
      usedCss: data.capture.usedCssRules?.cssText,
      styleContext: data.capture.styleContext,
      styleTokens: data.capture.styleTokens,
      aiResult: data.aiResult,
      recommendations: data.recommendations,
      selectedPattern: data.selectedPattern ?? undefined,
      selectedTemplateReference: data.selectedTemplateReference ?? undefined,
      selectedAnimationReference: data.selectedAnimationReference ?? undefined
    };

    try {
      const response = await fetch(CODE_CHANGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await getAuthHeaders()) },
        body: JSON.stringify(request)
      });
      const rawBody = await response.text().catch(() => "");
      const body = parseCodeChangeResponseBody(rawBody);

      if (!response.ok || !isCodeChangeSuccessResponse(body)) {
        const message = formatCodeChangeFailure({
          status: response.status,
          statusText: response.statusText,
          body,
          rawBody
        });
        setStatus("error");
        setError(message);
        return;
      }

      setResult(body.result);
      setGeneratedScope(scope);
      setStatus("success");

      const nextData: CodeChangeData = {
        ...data,
        lastResult: body.result,
        defaultScope: scope
      };
      setData(nextData);
      await chrome.storage.session.set({ [CODE_CHANGE_STORAGE_KEY]: nextData });
      void loadCodeGenerationHistory();
    } catch (caught) {
      setStatus("error");
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not reach the code-change backend."
      );
    }
  }

  async function loadCodeGenerationHistory() {
    setHistoryStatus("loading");
    setHistoryError("");

    try {
      const response = await fetch(`${CODE_HISTORY_URL}?limit=12&includeHtml=true`, {
        method: "GET",
        headers: await getAuthHeaders()
      });
      const body = (await response.json().catch(() => null)) as CodeHistoryResponse | null;

      if (!response.ok || !body?.ok) {
        const message =
          response.status === 401
            ? "Sign in to save and view code generation history."
            : body && !body.ok && body.error?.message
              ? body.error.message
              : "Could not load code generation history.";
        setHistoryStatus("error");
        setHistoryError(message);
        return;
      }

      setHistoryItems(body.items);
      setHistoryStatus("success");
    } catch (caught) {
      setHistoryStatus("error");
      setHistoryError(
        caught instanceof Error ? caught.message : "Could not load code generation history."
      );
    }
  }

  function resetSourcePatchState() {
    setCandidateFiles([]);
    setSourcePatch(null);
    setSourcePatchStatus("idle");
    setSourcePatchError("");
    setSelectedEditIds(new Set());
    setApplyStatuses([]);
    setPagePreviewStatus("");
  }

  async function copyValue(
    kind: "html" | "css" | "document" | "original" | "prompt",
    value: string
  ) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  }

  function downloadModifiedHtml() {
    if (!downloadableDocument) return;
    const blob = new Blob([downloadableDocument], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `design-humanizer-${generatedScope ?? scope}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function downloadOriginalCapturedHtml() {
    if (!originalDownloadableDocument) return;
    downloadTextFile({
      filename: `design-humanizer-original-${scope}.html`,
      content: originalDownloadableDocument,
      type: "text/html;charset=utf-8"
    });
  }

  function downloadCssFile() {
    const css = result?.modifiedCss || extractedCss;
    if (!css) return;
    downloadTextFile({
      filename: "design-humanizer.css",
      content: css,
      type: "text/css;charset=utf-8"
    });
  }

  function downloadHtmlAndCssFiles() {
    if (!result?.modifiedHtml) return;
    const css = result.modifiedCss || extractedCss;
    const linkedHtml = buildLinkedHtmlDocument({
      title: data?.capture?.title,
      html: result.modifiedHtml,
      cssHref: "design-humanizer.css"
    });

    downloadTextFile({
      filename: "design-humanizer.css",
      content: css,
      type: "text/css;charset=utf-8"
    });
    window.setTimeout(() => {
      downloadTextFile({
        filename: `design-humanizer-${generatedScope ?? scope}.html`,
        content: linkedHtml,
        type: "text/html;charset=utf-8"
      });
      setCopied("download");
      window.setTimeout(() => setCopied(null), 1600);
    }, 150);
  }

  async function chooseAndIndexProjectFolder() {
    if (!result) {
      setSourcePatchError("Generate a code change before indexing project files.");
      setSourcePatchStatus("error");
      return;
    }

    const picker = (window as WindowWithFileSystemAccess).showDirectoryPicker;
    if (!picker) {
      setSourcePatchError(
        "This browser does not support project folder access. Use Download patch or Copy Prompt instead."
      );
      setSourcePatchStatus("error");
      return;
    }

    setSourcePatchStatus("indexing");
    setSourcePatchError("");
    setSourcePatch(null);
    setApplyStatuses([]);
    setSelectedEditIds(new Set());

    try {
      const directory = await picker({ mode: "readwrite" });
      const permission = await directory.requestPermission?.({ mode: "readwrite" });
      if (permission === "denied") {
        throw new Error("Write permission for the project folder was denied.");
      }

      const indexed = await collectSourceFiles(directory);
      const candidates = rankSourceFileCandidates(indexed.files, {
        originalHtml,
        modifiedHtml: result.modifiedHtml,
        originalCss: extractedCss,
        modifiedCss: result.modifiedCss || extractedCss,
        recommendations: data?.recommendations,
        title: data?.capture?.title,
        url: data?.capture?.url
      });

      setProjectDirectory(directory);
      setProjectName(directory.name);
      setFileHandles(indexed.handles);
      setCandidateFiles(candidates);
      setSourcePatchStatus("ready");

      if (!candidates.length) {
        setSourcePatchError(
          "No matching source files were found. Download the patch or use the Cursor/Claude prompt."
        );
      }
    } catch (caught) {
      setSourcePatchStatus("error");
      setSourcePatchError(
        caught instanceof Error ? caught.message : "Could not index the selected project folder."
      );
    }
  }

  async function generateSourcePatch() {
    if (!data?.capture || !result) {
      setSourcePatchError("Generate a code change before creating a source patch.");
      setSourcePatchStatus("error");
      return;
    }

    if (!candidateFiles.length) {
      setSourcePatchError("Choose a project folder and index matching source files first.");
      setSourcePatchStatus("error");
      return;
    }

    setSourcePatchStatus("generating");
    setSourcePatchError("");
    setSourcePatch(null);
    setApplyStatuses([]);
    setSelectedEditIds(new Set());

    const request: SourcePatchRequest = {
      screenshotBase64: data.capture.screenshotBase64,
      scope: generatedScope ?? scope,
      url: data.capture.url,
      title: data.capture.title,
      originalHtml,
      originalCss: extractedCss,
      modifiedHtml: result.modifiedHtml,
      modifiedCss: result.modifiedCss || extractedCss,
      recommendations: data.recommendations,
      selectedPattern: data.selectedPattern ?? undefined,
      selectedTemplateReference: data.selectedTemplateReference ?? undefined,
      selectedAnimationReference: data.selectedAnimationReference ?? undefined,
      candidateFiles
    };

    try {
      const response = await fetch(SOURCE_PATCH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await getAuthHeaders()) },
        body: JSON.stringify(request)
      });
      const rawBody = await response.text().catch(() => "");
      const body = parseCodeChangeResponseBody(rawBody);

      if (!response.ok || !isSourcePatchSuccessResponse(body)) {
        const message = formatSourcePatchFailure({
          status: response.status,
          statusText: response.statusText,
          body,
          rawBody
        });
        setSourcePatchStatus("error");
        setSourcePatchError(message);
        return;
      }

      setSourcePatch(body.result);
      setSelectedEditIds(new Set(body.result.edits.map((edit) => edit.id)));
      setSourcePatchStatus("success");
    } catch (caught) {
      setSourcePatchStatus("error");
      setSourcePatchError(
        caught instanceof Error ? caught.message : "Could not reach the source-patch backend."
      );
    }
  }

  async function applySelectedSourceEdits() {
    if (!sourcePatch?.edits.length) return;

    const selectedEdits = sourcePatch.edits.filter((edit) => selectedEditIds.has(edit.id));
    if (!selectedEdits.length) {
      setSourcePatchError("Select at least one source edit to apply.");
      setSourcePatchStatus("error");
      return;
    }

    setSourcePatchStatus("applying");
    setSourcePatchError("");

    const nextStatuses: CodeApplyStatus[] = [];

    for (const edit of selectedEdits) {
      const handle = fileHandles.get(edit.filePath);
      if (!handle) {
        nextStatuses.push({
          editId: edit.id,
          filePath: edit.filePath,
          status: "manual",
          message: "No file handle is available for this path. Re-index the project folder."
        });
        continue;
      }

      try {
        const file = await handle.getFile();
        const currentContent = await file.text();
        const patched = applyExactSourceEdit(currentContent, edit);

        if (patched.status.status === "applied") {
          const writable = await handle.createWritable();
          await writable.write(patched.content);
          await writable.close();
        }

        nextStatuses.push(patched.status);
      } catch (caught) {
        nextStatuses.push({
          editId: edit.id,
          filePath: edit.filePath,
          status: "error",
          message: caught instanceof Error ? caught.message : "Could not write this source file."
        });
      }
    }

    setApplyStatuses(nextStatuses);
    setSourcePatchStatus("success");
  }

  function toggleSourceEdit(editId: string) {
    setSelectedEditIds((current) => {
      const next = new Set(current);
      if (next.has(editId)) next.delete(editId);
      else next.add(editId);
      return next;
    });
  }

  function downloadSourcePatch() {
    downloadTextFile({
      filename: "design-humanizer-source.patch",
      content: sourcePatchText,
      type: "text/plain;charset=utf-8"
    });
    setCopied("patch");
    window.setTimeout(() => setCopied(null), 1600);
  }

  async function copySourcePatch() {
    await navigator.clipboard.writeText(sourcePatchText);
    setCopied("patch");
    window.setTimeout(() => setCopied(null), 1600);
  }

  async function applyToCurrentPagePreview() {
    if (!data?.capture || !result) return;

    try {
      const tab = await findCapturedPageTab(data.capture.url);
      if (!tab?.id) {
        throw new Error("Could not find the captured page tab.");
      }

      await chrome.tabs.sendMessage(tab.id, {
        type: "APPLY_CODE_CHANGE_PREVIEW",
        payload: {
          domPath: data.capture.selectedSourceSection?.domPath,
          html: result.modifiedHtml,
          css: result.modifiedCss || extractedCss,
          scope: generatedScope ?? scope
        }
      });
      setPagePreviewStatus("Preview applied to the live page only. Source files were not changed.");
    } catch (caught) {
      setPagePreviewStatus(
        caught instanceof Error ? caught.message : "Could not apply preview to the live page."
      );
    }
  }

  if (!loaded) {
    return <PageShell title="Code Change" subtitle="Loading capture context..." />;
  }

  if (!data?.capture) {
    return (
      <PageShell title="Code Change" subtitle="No capture available.">
        <EmptyState />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Code Change"
      subtitle="Generate a reviewable rendered-HTML rewrite and source-code prompt."
    >
      <section className="dh-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-pilot-text">
              {data.sourceTitle || data.capture.title || "Captured page"}
            </p>
            <p className="mt-1 max-w-3xl break-all text-xs text-pilot-muted">
              {data.sourceUrl || data.capture.url}
            </p>
          </div>
          <span className="dh-chip">Review only</span>
        </div>

        <p className="mt-4 max-w-4xl text-sm leading-6 text-pilot-muted">
          This rewrites the rendered DOM snapshot. It does not directly edit React,
          Next, Vue, or static source files. Use the generated prompt to map the
          HTML back to the real codebase before applying changes.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-pilot-muted">
              Scope
            </p>
            <div className="grid grid-cols-2 gap-1 rounded-lg border border-pilot-border bg-pilot-panel p-1">
              {(["selected-block", "whole-page"] as const).map((option) => (
                <button
                  className={`rounded-md px-3 py-2.5 text-sm font-bold transition ${
                    scope === option
                      ? "bg-pilot-primary text-white"
                      : "text-pilot-muted hover:bg-pilot-primary/10 hover:text-pilot-text"
                  }`}
                  key={option}
                  onClick={() => updateScope(option)}
                  type="button"
                >
                  {option === "selected-block" ? "Selected block" : "Whole page"}
                </button>
              ))}
            </div>
          </div>
          <button
            className="dh-button-primary h-12 px-6 text-sm"
            disabled={status === "loading" || !originalHtml}
            onClick={() => void generateCodeChange()}
            type="button"
          >
            {status === "loading" ? "Generating..." : "Generate Code Change"}
          </button>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-5">
          <Metric label="Selected HTML" value={`${selectedHtml.length.toLocaleString()} chars`} />
          <Metric label="Inline HTML" value={`${selectedInlineHtml.length.toLocaleString()} chars`} />
          <Metric label="Full page HTML" value={`${fullPageHtml.length.toLocaleString()} chars`} />
          <Metric label="Extracted CSS" value={`${extractedCss.length.toLocaleString()} chars`} />
          <Metric
            label="Recommendations"
            value={`${data.recommendations.length.toLocaleString()} items`}
          />
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-pilot-border bg-pilot-bg p-3 text-sm leading-6 text-pilot-danger">
            {error}
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <CodePanel
          title="Original HTML"
          value={originalHtml || "No HTML snapshot available."}
          actions={
            originalHtml ? (
              <>
                <button
                  className="dh-button-secondary px-3 py-2 text-xs"
                  onClick={() => void copyValue("original", originalDownloadableDocument)}
                  type="button"
                >
                  {copied === "original" ? "Copied" : "Copy captured HTML"}
                </button>
                <button
                  className="dh-button-secondary px-3 py-2 text-xs"
                  onClick={downloadOriginalCapturedHtml}
                  type="button"
                >
                  Download captured .html
                </button>
              </>
            ) : null
          }
        />
        <CodePanel
          title="Modified HTML"
          value={result?.modifiedHtml || "Generate a code change to see Gemini's HTML rewrite."}
          actions={
            result ? (
              <>
                <button
                  className="dh-button-secondary px-3 py-2 text-xs"
                  onClick={() => void copyValue("html", result.modifiedHtml)}
                  type="button"
                >
                  {copied === "html" ? "Copied" : "Copy HTML"}
                </button>
                <button
                  className="dh-button-secondary px-3 py-2 text-xs"
                  onClick={() => void copyValue("document", downloadableDocument)}
                  type="button"
                >
                  {copied === "document" ? "Copied" : "Copy Full HTML"}
                </button>
                <button
                  className="dh-button-secondary px-3 py-2 text-xs"
                  onClick={downloadModifiedHtml}
                  type="button"
                >
                  Download inline .html
                </button>
                <button
                  className="dh-button-secondary px-3 py-2 text-xs"
                  onClick={downloadHtmlAndCssFiles}
                  type="button"
                >
                  {copied === "download" ? "Downloaded" : "HTML + CSS files"}
                </button>
              </>
            ) : null
          }
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <CodePanel
          title="Extracted CSS"
          value={extractedCss || "No used CSS was extracted for this capture."}
        />
        <CodePanel
          title="Modified CSS"
          value={
            result?.modifiedCss ||
            "Generate a code change to see Gemini's CSS output. If Gemini omits it, extracted CSS is used as fallback."
          }
          actions={
            result ? (
              <>
                <button
                  className="dh-button-secondary px-3 py-2 text-xs"
                  onClick={() => void copyValue("css", result.modifiedCss || extractedCss)}
                  type="button"
                >
                  {copied === "css" ? "Copied" : "Copy CSS"}
                </button>
                <button
                  className="dh-button-secondary px-3 py-2 text-xs"
                  onClick={downloadCssFile}
                  type="button"
                >
                  Download CSS
                </button>
              </>
            ) : null
          }
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <DiffPanel rows={diffRows} hasResult={Boolean(result)} />
        <CodePanel
          title="Cursor / Claude Code Prompt"
          value={
            result?.cursorPrompt ||
            "Generate a code change to get a source-code prompt for the real project files."
          }
          actions={
            result ? (
              <button
                className="dh-button-secondary px-3 py-2 text-xs"
                onClick={() => void copyValue("prompt", result.cursorPrompt)}
                type="button"
              >
                {copied === "prompt" ? "Copied" : "Copy Prompt"}
              </button>
            ) : null
          }
        />
      </section>

      {result ? (
        <section className="dh-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-pilot-text">Apply to Project</h2>
              <p className="mt-1 max-w-4xl text-sm leading-6 text-pilot-muted">
                Gemini maps the rendered rewrite back to real source snippets. Files are
                written only when the original snippet matches exactly.
              </p>
            </div>
            <span className="dh-chip">Patch review</span>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-4">
            <Metric
              label="Project"
              value={projectName || (supportsProjectFolder ? "not selected" : "folder access unavailable")}
            />
            <Metric label="Candidates" value={`${candidateFiles.length.toLocaleString()} files`} />
            <Metric label="Source edits" value={`${sourcePatch?.edits.length ?? 0} edits`} />
            <Metric label="Apply status" value={sourcePatchStatus} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="dh-button-secondary px-4 py-2 text-sm"
              disabled={!supportsProjectFolder || sourcePatchStatus === "indexing"}
              onClick={() => void chooseAndIndexProjectFolder()}
              type="button"
            >
              {sourcePatchStatus === "indexing" ? "Indexing..." : "Choose Project Folder"}
            </button>
            <button
              className="dh-button-primary px-4 py-2 text-sm"
              disabled={!candidateFiles.length || sourcePatchStatus === "generating"}
              onClick={() => void generateSourcePatch()}
              type="button"
            >
              {sourcePatchStatus === "generating" ? "Generating source patch..." : "Generate Source Patch"}
            </button>
            <button
              className="dh-button-secondary px-4 py-2 text-sm"
              onClick={() => void applyToCurrentPagePreview()}
              type="button"
            >
              Apply to Current Page Preview
            </button>
            <button
              className="dh-button-secondary px-4 py-2 text-sm"
              disabled={!sourcePatch?.edits.length}
              onClick={() => void copySourcePatch()}
              type="button"
            >
              {copied === "patch" ? "Copied" : "Copy Patch"}
            </button>
            <button
              className="dh-button-secondary px-4 py-2 text-sm"
              disabled={!sourcePatch?.edits.length}
              onClick={downloadSourcePatch}
              type="button"
            >
              Download Patch
            </button>
            <button
              className="dh-button-primary px-4 py-2 text-sm"
              disabled={!sourcePatch?.edits.length || sourcePatchStatus === "applying"}
              onClick={() => void applySelectedSourceEdits()}
              type="button"
            >
              {sourcePatchStatus === "applying" ? "Applying..." : "Apply Selected Edits"}
            </button>
          </div>

          {!supportsProjectFolder ? (
            <p className="mt-3 rounded-lg border border-pilot-border bg-pilot-bg p-3 text-sm leading-6 text-pilot-muted">
              This browser cannot write project folders from an extension page. Use
              Download Patch or Copy Prompt as the fallback.
            </p>
          ) : null}

          {sourcePatchError ? (
            <p className="mt-3 rounded-lg border border-pilot-border bg-pilot-bg p-3 text-sm leading-6 text-pilot-danger">
              {sourcePatchError}
            </p>
          ) : null}

          {pagePreviewStatus ? (
            <p className="mt-3 rounded-lg border border-pilot-border bg-pilot-bg p-3 text-sm leading-6 text-pilot-muted">
              {pagePreviewStatus}
            </p>
          ) : null}

          {candidateFiles.length ? (
            <div className="mt-4">
              <h3 className="text-sm font-black text-pilot-text">Ranked source candidates</h3>
              <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {candidateFiles.slice(0, 6).map((candidate) => (
                  <div
                    className="rounded-lg border border-pilot-border bg-pilot-bg p-3"
                    key={candidate.path}
                  >
                    <p className="break-all text-xs font-black text-pilot-text">
                      {candidate.path}
                    </p>
                    <p className="mt-1 text-xs text-pilot-muted">
                      {candidate.language} · score {candidate.score}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-pilot-muted">
                      {candidate.reasons.join(", ") || "matched source context"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {sourcePatch ? (
            <div className="mt-4 space-y-3">
              <div>
                <h3 className="text-sm font-black text-pilot-text">Source patch review</h3>
                <p className="mt-1 text-sm leading-6 text-pilot-muted">
                  {sourcePatch.summary}
                </p>
              </div>
              {sourcePatch.warnings.length ? (
                <ul className="space-y-1 text-sm leading-6 text-pilot-muted">
                  {sourcePatch.warnings.map((warning, index) => (
                    <li key={`${warning}-${index}`}>{warning}</li>
                  ))}
                </ul>
              ) : null}
              {sourcePatch.manualInstructions ? (
                <p className="rounded-lg border border-pilot-border bg-pilot-bg p-3 text-sm leading-6 text-pilot-muted">
                  {sourcePatch.manualInstructions}
                </p>
              ) : null}
              {sourcePatch.edits.length ? (
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-pilot-muted">
                    Unified source diff
                  </p>
                  <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-pilot-border bg-pilot-card/70 p-3 font-mono text-xs leading-5 text-pilot-muted">
                    {sourcePatchText}
                  </pre>
                </div>
              ) : null}
              {sourcePatch.edits.map((edit) => (
                <SourceEditCard
                  checked={selectedEditIds.has(edit.id)}
                  edit={edit}
                  key={edit.id}
                  onToggle={() => toggleSourceEdit(edit.id)}
                  status={applyStatuses.find((item) => item.editId === edit.id)}
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {result?.diffSummary || result?.warnings.length ? (
        <section className="dh-card p-4">
          <h2 className="text-lg font-black text-pilot-text">Generation Notes</h2>
          {result.diffSummary ? (
            <p className="mt-3 text-sm leading-6 text-pilot-muted">{result.diffSummary}</p>
          ) : null}
          {result.warnings.length ? (
            <ul className="mt-3 space-y-2 text-sm leading-6 text-pilot-muted">
              {result.warnings.map((warning, index) => (
                <li key={`${warning}-${index}`}>{warning}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <section className="dh-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-pilot-text">Code Generation History</h2>
            <p className="mt-1 text-sm leading-6 text-pilot-muted">
              Saved to your account whenever Gemini generates HTML while you are signed in.
            </p>
          </div>
          <button
            className="dh-button-secondary px-3 py-2 text-xs"
            disabled={historyStatus === "loading"}
            onClick={() => void loadCodeGenerationHistory()}
            type="button"
          >
            {historyStatus === "loading" ? "Loading..." : "Refresh"}
          </button>
        </div>

        {historyError ? (
          <p className="mt-3 rounded-lg border border-pilot-border bg-pilot-bg p-3 text-sm leading-6 text-pilot-muted">
            {historyError}
          </p>
        ) : null}

        {!historyError && historyStatus === "success" && !historyItems.length ? (
          <p className="mt-3 rounded-lg border border-pilot-border bg-pilot-bg p-3 text-sm leading-6 text-pilot-muted">
            No saved code generations yet.
          </p>
        ) : null}

        {historyItems.length ? (
          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {historyItems.map((item) => (
              <HistoryCard item={item} key={item.id} />
            ))}
          </div>
        ) : null}
      </section>
    </PageShell>
  );
}

function PageShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-pilot-bg px-4 py-5 text-pilot-text md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-pilot-muted">
              Beunique
            </p>
            <h1 className="mt-1 text-3xl font-black text-pilot-text">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-pilot-muted">{subtitle}</p>
          </div>
        </header>
        <div className="space-y-4">{children}</div>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <section className="dh-card p-5">
      <h2 className="text-lg font-black text-pilot-text">No captured page</h2>
      <p className="mt-2 text-sm leading-6 text-pilot-muted">
        Capture a UI area from the extension side panel, then open Code Change again.
      </p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-pilot-border bg-pilot-bg p-3">
      <p className="text-[11px] font-black uppercase tracking-wide text-pilot-muted">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black text-pilot-text">{value}</p>
    </div>
  );
}

function CodePanel({
  title,
  value,
  actions
}: {
  title: string;
  value: string;
  actions?: ReactNode;
}) {
  return (
    <section className="dh-card flex min-h-[28rem] flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pilot-border p-4">
        <h2 className="text-lg font-black text-pilot-text">{title}</h2>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words bg-pilot-card/60 p-4 font-mono text-xs leading-5 text-pilot-muted">
        {value}
      </pre>
    </section>
  );
}

function DiffPanel({ rows, hasResult }: { rows: DiffRow[]; hasResult: boolean }) {
  return (
    <section className="dh-card min-h-[28rem] overflow-hidden">
      <div className="border-b border-pilot-border p-4">
        <h2 className="text-lg font-black text-pilot-text">Text Diff</h2>
        <p className="mt-1 text-xs leading-5 text-pilot-muted">
          Position-based line diff for review. Use the full HTML panels for exact output.
        </p>
      </div>
      <div className="max-h-[34rem] overflow-auto bg-pilot-card/60 p-3 font-mono text-xs leading-5">
        {!hasResult ? (
          <p className="font-sans text-sm text-pilot-muted">
            Generate a code change to compare the original and modified HTML.
          </p>
        ) : rows.length ? (
          rows.map((row) => (
            <div
              className={`mb-1 rounded-md px-2 py-1 ${
                row.kind === "added"
                  ? "bg-emerald-500/10 text-emerald-800"
                  : row.kind === "removed"
                    ? "bg-red-500/10 text-red-800"
                    : "text-pilot-muted"
              }`}
              key={`${row.kind}-${row.index}-${row.text}`}
            >
              <span className="mr-2 font-black">
                {row.kind === "added" ? "+" : row.kind === "removed" ? "-" : " "}
              </span>
              {row.text || " "}
            </div>
          ))
        ) : (
          <p className="font-sans text-sm text-pilot-muted">No text changes detected.</p>
        )}
      </div>
    </section>
  );
}

function SourceEditCard({
  edit,
  checked,
  status,
  onToggle
}: {
  edit: SourcePatchEdit;
  checked: boolean;
  status?: CodeApplyStatus;
  onToggle: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-pilot-border bg-pilot-bg">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pilot-border p-3">
        <label className="flex min-w-0 flex-1 items-center gap-2">
          <input checked={checked} onChange={onToggle} type="checkbox" />
          <span className="break-all text-sm font-black text-pilot-text">
            {edit.filePath}
          </span>
        </label>
        <span className="dh-chip">{Math.round(edit.confidence * 100)}%</span>
      </div>
      <div className="grid gap-3 p-3 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-pilot-muted">
            Original snippet
          </p>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md bg-pilot-card/70 p-3 font-mono text-xs leading-5 text-pilot-muted">
            {edit.originalSnippet}
          </pre>
        </div>
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-pilot-muted">
            Replacement snippet
          </p>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-md bg-pilot-card/70 p-3 font-mono text-xs leading-5 text-pilot-muted">
            {edit.replacementSnippet}
          </pre>
        </div>
      </div>
      <div className="border-t border-pilot-border p-3">
        <p className="text-sm leading-6 text-pilot-muted">
          {edit.explanation || "Generated source edit."}
        </p>
        {status ? (
          <p
            className={`mt-2 rounded-md px-3 py-2 text-sm leading-5 ${
              status.status === "applied"
                ? "bg-emerald-500/10 text-emerald-800"
                : status.status === "blocked" || status.status === "error"
                  ? "bg-red-500/10 text-red-800"
                  : "bg-pilot-panel text-pilot-muted"
            }`}
          >
            {status.status}: {status.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function HistoryCard({ item }: { item: CodeGenerationHistoryItem }) {
  const [copied, setCopied] = useState<"html" | "css" | "prompt" | "">("");
  const date = formatHistoryDate(item.createdAt);
  const direction = [
    item.patternName,
    item.templateTitle,
    item.animationTitle
  ].filter(Boolean);

  return (
    <article className="overflow-hidden rounded-lg border border-pilot-border bg-pilot-bg">
      <div className="border-b border-pilot-border p-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="break-words text-sm font-black text-pilot-text">
              {item.sourceTitle || "Generated HTML"}
            </p>
            <p className="mt-1 break-all text-xs text-pilot-muted">
              {item.sourceUrl || "unknown source"}
            </p>
          </div>
          <span className="dh-chip">{item.scope}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold text-pilot-muted">
          <span>{date}</span>
          <span>{item.htmlChars.toLocaleString()} HTML chars</span>
          <span>{item.cssChars.toLocaleString()} CSS chars</span>
          {item.model ? <span>{item.model}</span> : null}
          {item.htmlTruncated || item.cssTruncated ? <span>truncated</span> : null}
        </div>
      </div>
      <div className="p-3">
        {direction.length ? (
          <p className="mb-2 text-xs leading-5 text-pilot-muted">
            Direction: {direction.join(" + ")}
          </p>
        ) : null}
        {item.diffSummary ? (
          <p className="mb-2 text-xs leading-5 text-pilot-muted">{item.diffSummary}</p>
        ) : null}
        <div className="mb-2 flex flex-wrap gap-2">
          <button
            className="dh-button-secondary px-3 py-2 text-[11px]"
            disabled={!item.generatedHtml}
            onClick={() => void copyHistoryText(item.generatedHtml ?? "", "html", setCopied)}
            type="button"
          >
            {copied === "html" ? "Copied HTML" : "Copy generated HTML"}
          </button>
          <button
            className="dh-button-secondary px-3 py-2 text-[11px]"
            disabled={!item.modifiedCss}
            onClick={() => void copyHistoryText(item.modifiedCss ?? "", "css", setCopied)}
            type="button"
          >
            {copied === "css" ? "Copied CSS" : "Copy CSS"}
          </button>
          <button
            className="dh-button-secondary px-3 py-2 text-[11px]"
            disabled={!item.cursorPrompt}
            onClick={() => void copyHistoryText(item.cursorPrompt ?? "", "prompt", setCopied)}
            type="button"
          >
            {copied === "prompt" ? "Copied Prompt" : "Copy prompt"}
          </button>
        </div>
        <pre className="max-h-52 overflow-auto whitespace-pre-wrap break-words rounded-md bg-pilot-card/70 p-3 font-mono text-[11px] leading-5 text-pilot-muted">
          {item.generatedHtmlPreview || "No HTML preview saved."}
        </pre>
      </div>
    </article>
  );
}

async function copyHistoryText(
  value: string,
  field: "html" | "css" | "prompt",
  setCopied: (field: "html" | "css" | "prompt" | "") => void
) {
  if (!value) return;
  await navigator.clipboard.writeText(value);
  setCopied(field);
  window.setTimeout(() => setCopied(""), 1600);
}

function getOriginalHtml(data: CodeChangeData | null, scope: CodeChangeScope) {
  if (!data?.capture) return "";
  if (scope === "whole-page") {
    return data.capture.fullPageInlineHtmlPreview ?? data.capture.fullPageHtmlPreview ?? "";
  }
  return (
    data.capture.selectedSourceSection?.inlineHtmlPreview ??
    data.capture.selectedSourceSection?.htmlPreview ??
    data.capture.sourceSections?.[0]?.htmlPreview ??
    data.capture.fullPageHtmlPreview ??
    ""
  );
}

function buildStandaloneHtmlDocument({
  title,
  html,
  css
}: {
  title?: string;
  html: string;
  css: string;
}) {
  if (/<!doctype html|<html[\s>]/i.test(html)) {
    return injectCssIntoHtmlDocument(html, css);
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title || "Design Humanizer code change")}</title>
    <style>
${css}
    </style>
  </head>
  <body>
${html}
  </body>
</html>`;
}

function buildLinkedHtmlDocument({
  title,
  html,
  cssHref
}: {
  title?: string;
  html: string;
  cssHref: string;
}) {
  if (/<!doctype html|<html[\s>]/i.test(html)) {
    return injectStylesheetLinkIntoHtmlDocument(html, cssHref);
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title || "Design Humanizer code change")}</title>
    <link rel="stylesheet" href="${escapeHtml(cssHref)}">
  </head>
  <body>
${html}
  </body>
</html>`;
}

function injectCssIntoHtmlDocument(html: string, css: string) {
  const styleTag = `<style>\n${css}\n</style>`;

  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${styleTag}\n</head>`);
  }

  if (/<html[\s>]/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, `<html$1><head>${styleTag}</head>`);
  }

  return `<!doctype html><html><head>${styleTag}</head><body>${html}</body></html>`;
}

function injectStylesheetLinkIntoHtmlDocument(html: string, cssHref: string) {
  const linkTag = `<link rel="stylesheet" href="${escapeHtml(cssHref)}">`;

  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${linkTag}\n</head>`);
  }

  if (/<html[\s>]/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, `<html$1><head>${linkTag}</head>`);
  }

  return `<!doctype html><html><head>${linkTag}</head><body>${html}</body></html>`;
}

function downloadTextFile({
  filename,
  content,
  type
}: {
  filename: string;
  content: string;
  type: string;
}) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatHistoryDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function buildDiffRows(original: string, modified: string): DiffRow[] {
  if (!original || !modified) return [];
  const originalLines = original.split(/\r?\n/);
  const modifiedLines = modified.split(/\r?\n/);
  const max = Math.max(originalLines.length, modifiedLines.length);
  const rows: DiffRow[] = [];

  for (let index = 0; index < max; index += 1) {
    const before = originalLines[index] ?? "";
    const after = modifiedLines[index] ?? "";

    if (before === after) {
      if (rows.length < 260) rows.push({ kind: "same", text: before, index });
      continue;
    }

    if (before) rows.push({ kind: "removed", text: before, index });
    if (after) rows.push({ kind: "added", text: after, index });

    if (rows.length >= 260) {
      rows.push({
        kind: "same",
        text: `Diff truncated after ${rows.length} rows.`,
        index
      });
      break;
    }
  }

  return rows.filter((row) => row.kind !== "same" || row.text.trim());
}

function isCodeChangeSuccessResponse(
  value: unknown
): value is GenerateCodeChangeSuccessResponse {
  return Boolean(value && typeof value === "object" && (value as { ok?: unknown }).ok === true);
}

function isCodeChangeErrorResponse(value: unknown): value is GenerateCodeChangeErrorResponse {
  return Boolean(value && typeof value === "object" && (value as { ok?: unknown }).ok === false);
}

function parseCodeChangeResponseBody(rawBody: string): unknown {
  if (!rawBody.trim()) return null;
  try {
    return JSON.parse(rawBody);
  } catch {
    return null;
  }
}

function formatCodeChangeFailure({
  status,
  statusText,
  body,
  rawBody
}: {
  status: number;
  statusText: string;
  body: unknown;
  rawBody: string;
}) {
  if (isCodeChangeErrorResponse(body)) {
    return formatCodeChangeError(body);
  }

  if (status === 404) {
    return `Code-change API is not deployed at ${CODE_CHANGE_URL}. Deploy the web backend with /api/generate-code-change, then try again.`;
  }

  if (status === 401 || status === 403) {
    return `Code-change API returned ${status}. Sign in again or check backend auth.`;
  }

  const pageTitle = rawBody.match(/<title>(.*?)<\/title>/i)?.[1]?.trim();
  return `Code-change API returned ${status} ${statusText || ""}${
    pageTitle ? ` (${pageTitle})` : ""
  }. Backend URL: ${CODE_CHANGE_URL}`;
}

function formatCodeChangeError(response: GenerateCodeChangeErrorResponse) {
  const message = response.error?.message || "Gemini code-change generation failed.";
  const details = response.error?.details;
  return details ? `${message} ${details}` : message;
}

function isSourcePatchSuccessResponse(
  value: unknown
): value is GenerateSourcePatchSuccessResponse {
  return Boolean(value && typeof value === "object" && (value as { ok?: unknown }).ok === true);
}

function isSourcePatchErrorResponse(value: unknown): value is GenerateSourcePatchErrorResponse {
  return Boolean(value && typeof value === "object" && (value as { ok?: unknown }).ok === false);
}

function formatSourcePatchFailure({
  status,
  statusText,
  body,
  rawBody
}: {
  status: number;
  statusText: string;
  body: unknown;
  rawBody: string;
}) {
  if (isSourcePatchErrorResponse(body)) {
    const message = body.error?.message || "Gemini source-patch generation failed.";
    const details = body.error?.details;
    return details ? `${message} ${details}` : message;
  }

  if (status === 404) {
    return `Source-patch API is not deployed at ${SOURCE_PATCH_URL}. Deploy the web backend with /api/generate-source-patch, then try again.`;
  }

  if (status === 401 || status === 403) {
    return `Source-patch API returned ${status}. Sign in again or check backend auth.`;
  }

  const pageTitle = rawBody.match(/<title>(.*?)<\/title>/i)?.[1]?.trim();
  return `Source-patch API returned ${status} ${statusText || ""}${
    pageTitle ? ` (${pageTitle})` : ""
  }. Backend URL: ${SOURCE_PATCH_URL}`;
}

async function collectSourceFiles(root: ProjectDirectoryHandle) {
  const files: SourceFileInput[] = [];
  const handles = new Map<string, ProjectFileHandle>();

  async function visitDirectory(directory: ProjectDirectoryHandle, prefix: string) {
    for await (const entry of directory.values()) {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

      if (entry.kind === "directory") {
        if (!shouldSkipSourceDirectory(entry.name)) {
          await visitDirectory(entry, relativePath);
        }
        continue;
      }

      if (!isLikelySourceFile(relativePath, 0)) continue;

      try {
        const file = await entry.getFile();
        if (!isLikelySourceFile(relativePath, file.size)) continue;
        const content = await file.text();
        files.push({
          path: relativePath,
          content,
          size: file.size
        });
        handles.set(relativePath, entry);
      } catch {
        continue;
      }
    }
  }

  await visitDirectory(root, "");
  return { files, handles };
}

async function findCapturedPageTab(captureUrl: string) {
  const tabs = await chrome.tabs.query({});
  const normalizedCaptureUrl = normalizeComparableUrl(captureUrl);

  return tabs.find((tab) => normalizeComparableUrl(tab.url ?? "") === normalizedCaptureUrl);
}

function normalizeComparableUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    return url.toString();
  } catch {
    return value;
  }
}
