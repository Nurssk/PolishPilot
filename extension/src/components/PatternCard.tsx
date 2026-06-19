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
      className={`rounded-xl border p-4 shadow-pilot transition ${
        selected
          ? "border-pilot-primary/80 bg-pilot-primary/14 shadow-glow"
          : "border-pilot-border bg-pilot-panel/82 hover:border-pilot-primary/45 hover:bg-pilot-card/80"
      }`}
    >
      <PatternPreview
        active={selected}
        category={pattern.category}
        patternId={pattern.layoutPreviewType}
      />
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-black leading-6 text-pilot-text">
            {pattern.name}
          </h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-pilot-muted">
            {pattern.bestFor}
          </p>
        </div>
        {selected ? (
          <span className="shrink-0 rounded-full border border-pilot-primary/45 bg-pilot-primary/18 px-2 py-0.5 text-[10px] font-semibold text-pilot-primaryDeep">
            Selected
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-pilot-muted">
        {pattern.problemSolved[0] ?? pattern.promptInstruction}
      </p>
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
