import { TagList } from "./TagList";
import type { AnimationReference } from "../patterns/animationReferences";

export function AnimationReferenceCard({
  reference,
  selected,
  onSelect
}: {
  reference: AnimationReference;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={`rounded-lg border p-4 transition ${
        selected
          ? "border-pilot-borderStrong bg-pilot-primary/10"
          : "border-pilot-border bg-pilot-card hover:border-pilot-borderStrong"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-black text-pilot-text">{reference.title}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-pilot-primaryDeep">
            {reference.source} · {reference.category}
          </p>
        </div>
        {selected ? (
          <span className="shrink-0 rounded-md border border-pilot-borderStrong bg-pilot-primary/15 px-2 py-0.5 text-[10px] font-semibold text-pilot-primary">
            Selected
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-pilot-muted">
        <span className="font-semibold text-pilot-text">Best for:</span> {reference.bestFor}
      </p>
      <TagList tags={reference.tags.slice(0, 5)} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className={`rounded-lg px-2.5 py-2.5 text-sm font-bold transition ${
            selected
              ? "bg-pilot-primary text-white hover:bg-pilot-primaryDeep"
              : "border border-pilot-border bg-pilot-bg text-pilot-text hover:border-pilot-borderStrong"
          }`}
          onClick={onSelect}
          type="button"
        >
          {selected ? "Added" : "Use animation idea"}
        </button>
        <a
          className="rounded-lg border border-pilot-border px-2.5 py-2.5 text-center text-sm font-semibold text-pilot-text transition hover:border-pilot-borderStrong hover:bg-pilot-primary/10"
          href={reference.url}
          rel="noreferrer"
          target="_blank"
        >
          Open link
        </a>
      </div>
    </article>
  );
}
