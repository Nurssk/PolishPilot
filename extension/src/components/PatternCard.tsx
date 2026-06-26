import { PatternPreview } from "./PatternPreview";
import { patternCopyLabel } from "../shared/messages";
import type { LayoutPattern } from "../patterns/layoutPatterns";

type PatternCardProps = {
  pattern: LayoutPattern;
  selected: boolean;
  copied?: boolean;
  selectLabel?: string;
  copyLabel?: string;
  onSelect: () => void;
  onCopyPrompt: () => void;
};

export function PatternCard({
  pattern,
  selected,
  copied = false,
  selectLabel = "Use this pattern",
  copyLabel = "Copy Cursor Prompt",
  onSelect,
  onCopyPrompt
}: PatternCardProps) {
  return (
    <article
      className={`relative rounded-xl border p-3 shadow-pilot transition ${
        selected
          ? "border-pilot-borderStrong bg-pilot-card shadow-glow"
          : "border-pilot-border bg-pilot-card hover:border-pilot-borderStrong"
      }`}
    >
      <PatternPreview
        active={selected}
        category={pattern.category}
        patternId={pattern.layoutPreviewType}
      />
      {selected ? (
        <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-pilot-primary" />
      ) : null}
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-black leading-6 text-pilot-text">
            {pattern.name}
          </h3>
          <span className="mt-1 inline-flex rounded-full border border-pilot-border bg-pilot-surface px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-pilot-muted">
            {pattern.category}
          </span>
        </div>
        {selected ? (
          <span className="shrink-0 rounded-full border border-pilot-primary/40 bg-pilot-primary/15 px-2 py-0.5 text-[10px] font-semibold text-pilot-primaryDeep">
            Selected
          </span>
        ) : null}
      </div>
      <div className="mt-3 grid gap-1.5 text-sm leading-5">
        <p className="text-pilot-muted">
          <span className="text-[10px] font-black uppercase tracking-[0.08em] text-pilot-soft">
            Why
          </span>{" "}
          {pattern.problemSolved[0] ?? pattern.promptInstruction}
        </p>
        <p className="text-pilot-muted">
          <span className="text-[10px] font-black uppercase tracking-[0.08em] text-pilot-soft">
            Best for
          </span>{" "}
          {pattern.bestFor}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className={`rounded-lg px-2.5 py-2.5 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pilot-primary ${
            selected
              ? "bg-pilot-primary text-white hover:bg-pilot-primaryDeep"
              : "bg-pilot-card text-pilot-text hover:bg-pilot-primary/20"
          }`}
          onClick={onSelect}
          type="button"
        >
          {selectLabel}
        </button>
        <button
          aria-label={patternCopyLabel(pattern)}
          className="rounded-lg border border-pilot-border px-2.5 py-2.5 text-sm font-semibold text-pilot-muted transition hover:border-pilot-primary/70 hover:bg-pilot-primary/12 hover:text-pilot-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pilot-primary"
          onClick={onCopyPrompt}
          type="button"
        >
          {copied ? "Copied" : copyLabel}
        </button>
      </div>
    </article>
  );
}
