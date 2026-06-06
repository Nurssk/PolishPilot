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
      className={`rounded-xl border p-3 shadow-pilot transition ${
        selected
          ? "border-cyan-300/80 bg-cyan-300/10"
          : "border-slate-800 bg-slate-900/72 hover:border-slate-600"
      }`}
    >
      <PatternPreview
        active={selected}
        category={pattern.category}
        patternId={pattern.layoutPreviewType}
      />
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-5 text-slate-50">
            {pattern.name}
          </h3>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-cyan-200/80">
            {pattern.bestFor}
          </p>
        </div>
        {selected ? (
          <span className="shrink-0 rounded-full border border-cyan-300/40 bg-cyan-300/15 px-2 py-0.5 text-[10px] font-semibold text-cyan-100">
            Selected
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-300">
        {pattern.problemSolved[0] ?? pattern.promptInstruction}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className={`rounded-lg px-2.5 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${
            selected
              ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200"
              : "bg-slate-800 text-slate-100 hover:bg-slate-700"
          }`}
          onClick={onSelect}
          type="button"
        >
          {selectLabel}
        </button>
        <button
          aria-label={patternCopyLabel(pattern)}
          className="rounded-lg border border-slate-700 px-2.5 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-300/70 hover:bg-cyan-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          onClick={onCopyPrompt}
          type="button"
        >
          {copied ? "Copied" : copyLabel}
        </button>
      </div>
    </article>
  );
}
