import { TagList } from "./TagList";
import type { TemplateReference } from "../patterns/templateReferences";
import type { PolishPilotMode } from "../shared/types";

export function TemplateReferenceCard({
  mode,
  reference,
  selected,
  onOpen,
  onSelect
}: {
  mode: PolishPilotMode;
  reference: TemplateReference;
  selected: boolean;
  onOpen: () => void;
  onSelect: () => void;
}) {
  const isBroken = reference.urlStatus === "broken";
  const isUnknown = reference.urlStatus === "unknown" || !reference.urlStatus;

  return (
    <article
      className={`relative rounded-xl border p-3 shadow-pilot transition ${
        selected
          ? "border-pilot-borderStrong bg-pilot-card"
          : "border-pilot-border bg-pilot-card hover:border-pilot-borderStrong"
      }`}
    >
      <ReferenceWireframe active={selected} />
      {selected ? (
        <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-pilot-primary" />
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-black text-pilot-text">{reference.title}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-pilot-muted">
            {reference.source} · {reference.category}
          </p>
        </div>
        {selected ? (
          <span className="shrink-0 rounded-md border border-pilot-borderStrong bg-pilot-primary/15 px-2 py-0.5 text-[10px] font-semibold text-pilot-primary">
            Attached
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {isBroken && mode === "developer" ? (
          <span className="rounded-md border border-pilot-danger/40 bg-pilot-danger/15 px-2 py-0.5 text-[10px] font-bold text-pilot-danger">
            Broken link
          </span>
        ) : null}
        {isUnknown ? (
          <span className="rounded-md border border-pilot-warning/40 bg-pilot-warning/12 px-2 py-0.5 text-[10px] font-bold text-pilot-warning">
            Unchecked link
          </span>
        ) : null}
        {reference.urlStatus === "ok" ? (
          <span className="rounded-md border border-pilot-success/40 bg-pilot-success/12 px-2 py-0.5 text-[10px] font-bold text-pilot-success">
            Link checked
          </span>
        ) : null}
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-pilot-muted">
        {isBroken
          ? "Reference unavailable. A fallback 21st.dev page will be used."
          : reference.description ?? reference.usageNote}
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
          {selected ? "Attached" : "Use template"}
        </button>
        <button
          className="rounded-lg border border-pilot-border px-2.5 py-2.5 text-center text-sm font-semibold text-pilot-text transition hover:border-pilot-borderStrong hover:bg-pilot-primary/10"
          onClick={onOpen}
          type="button"
        >
          {isBroken ? "Open fallback" : "Open reference"}
        </button>
      </div>
    </article>
  );
}

function ReferenceWireframe({ active }: { active: boolean }) {
  return (
    <div
      className={`mb-3 grid h-24 grid-cols-[0.9fr_1.1fr] gap-2 rounded-lg border p-2 ${
        active
          ? "border-pilot-primary/40 bg-pilot-primary/10"
          : "border-pilot-border bg-pilot-surface"
      }`}
    >
      <div className="space-y-2 rounded-md border border-pilot-border bg-pilot-card p-2">
        <div className="h-2 w-12 rounded bg-pilot-muted/35" />
        <div className="h-2 rounded bg-pilot-muted/20" />
        <div className="h-2 w-2/3 rounded bg-pilot-muted/20" />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-md border border-pilot-border bg-pilot-card" />
        <div className="rounded-md border border-pilot-border bg-pilot-card" />
        <div className="col-span-2 rounded-md border border-pilot-border bg-pilot-card" />
      </div>
    </div>
  );
}
