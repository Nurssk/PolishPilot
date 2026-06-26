import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getAuthHeaders } from "../shared/authService";
import { apiUrl } from "../shared/apiConfig";
import { CODE_CHANGE_STORAGE_KEY } from "../shared/messages";
import type {
  CodeChangeRequest,
  CodeChangeResult,
  CodeChangeScope
} from "../shared/types";
import type { CodeChangeData } from "../shared/windowData";

const CODE_CHANGE_URL = apiUrl("/api/generate-code-change");

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
  const [copied, setCopied] = useState<"html" | "prompt" | null>(null);
  const [generatedScope, setGeneratedScope] = useState<CodeChangeScope | null>(null);

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

  const originalHtml = useMemo(
    () => getOriginalHtml(data, scope),
    [data, scope]
  );
  const selectedHtml = data?.capture?.selectedSourceSection?.htmlPreview ?? "";
  const fullPageHtml = data?.capture?.fullPageHtmlPreview ?? "";
  const diffRows = useMemo(
    () => buildDiffRows(originalHtml, result?.modifiedHtml ?? ""),
    [originalHtml, result?.modifiedHtml]
  );

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

    const request: CodeChangeRequest = {
      screenshotBase64: data.capture.screenshotBase64,
      scope,
      url: data.capture.url,
      title: data.capture.title,
      originalHtml: html,
      selectedHtml,
      fullPageHtml,
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
    } catch (caught) {
      setStatus("error");
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not reach the code-change backend."
      );
    }
  }

  async function copyValue(kind: "html" | "prompt", value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  }

  function downloadModifiedHtml() {
    if (!result?.modifiedHtml) return;
    const blob = new Blob([result.modifiedHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `design-humanizer-${generatedScope ?? scope}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
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

        <div className="mt-4 grid gap-2 md:grid-cols-4">
          <Metric label="Selected HTML" value={`${selectedHtml.length.toLocaleString()} chars`} />
          <Metric label="Full page HTML" value={`${fullPageHtml.length.toLocaleString()} chars`} />
          <Metric
            label="Recommendations"
            value={`${data.recommendations.length.toLocaleString()} items`}
          />
          <Metric label="Generated" value={generatedScope ?? "not yet"} />
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-pilot-border bg-pilot-bg p-3 text-sm leading-6 text-pilot-danger">
            {error}
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <CodePanel title="Original HTML" value={originalHtml || "No HTML snapshot available."} />
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
                  onClick={downloadModifiedHtml}
                  type="button"
                >
                  Download .html
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

function getOriginalHtml(data: CodeChangeData | null, scope: CodeChangeScope) {
  if (!data?.capture) return "";
  if (scope === "whole-page") {
    return data.capture.fullPageHtmlPreview ?? "";
  }
  return (
    data.capture.selectedSourceSection?.htmlPreview ??
    data.capture.sourceSections?.[0]?.htmlPreview ??
    data.capture.fullPageHtmlPreview ??
    ""
  );
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
