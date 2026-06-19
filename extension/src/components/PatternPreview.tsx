import type { ReactNode } from "react";
import type { LayoutPatternId, PatternCategory } from "../patterns/layoutPatterns";

type PatternPreviewProps = {
  patternId: LayoutPatternId;
  active?: boolean;
  category?: PatternCategory;
};

const cardBase = "rounded-md border transition-colors";

function PreviewCard({
  className = "",
  strong = false,
  children
}: {
  className?: string;
  strong?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`${cardBase} ${strong ? "border-pilot-primary/70 bg-pilot-primary/20" : "border-pilot-primary/20 bg-pilot-card/55"} ${className}`}
    >
      {children ?? (
        <>
          <div className="h-1.5 w-1/2 rounded-full bg-pilot-text/28" />
          <div className="mt-2 h-1 w-3/4 rounded-full bg-pilot-text/12" />
          <div className="mt-1 h-1 w-2/5 rounded-full bg-pilot-text/10" />
        </>
      )}
    </div>
  );
}

export function PatternPreview({
  patternId,
  active = false,
  category = "features"
}: PatternPreviewProps) {
  const frameClass = `h-24 overflow-hidden rounded-lg border p-2 ${
    active
      ? "border-pilot-primary/70 bg-pilot-primary/10"
      : "border-pilot-border bg-pilot-bg/70"
  }`;

  if (patternId === "split-hero") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-[0.9fr_1.1fr] items-center gap-2">
          <div className="space-y-2">
            <div className="h-2 w-16 rounded-full bg-pilot-text/35" />
            <div className="h-1.5 w-20 rounded-full bg-pilot-text/16" />
            <div className="h-3 w-12 rounded bg-pilot-primary/70" />
          </div>
          <PreviewCard strong className="h-20 p-3" />
        </div>
      </div>
    );
  }

  if (patternId === "hero-product-preview") {
    return (
      <div className={frameClass}>
        <div className="flex h-full flex-col gap-2">
          <div className="mx-auto h-2 w-24 rounded-full bg-pilot-text/28" />
          <PreviewCard strong className="flex-1 p-3" />
        </div>
      </div>
    );
  }

  if (patternId === "hero-trust-bar") {
    return (
      <div className={frameClass}>
        <div className="flex h-full flex-col justify-between gap-2">
          <div className="mx-auto mt-1 h-2 w-24 rounded-full bg-pilot-text/32" />
          <div className="mx-auto h-3 w-14 rounded bg-pilot-primary/70" />
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((item) => (
              <div className="h-5 rounded border border-pilot-primary/20 bg-pilot-card/55" key={item} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "featured-side-stack") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-[1.25fr_0.75fr] gap-2">
          <PreviewCard strong className="p-3" />
          <div className="grid gap-2">
            <PreviewCard className="p-2" />
            <PreviewCard className="p-2" />
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "bento-grid") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-3 grid-rows-2 gap-2">
          <PreviewCard strong className="col-span-2 row-span-2 p-3" />
          <PreviewCard className="p-2" />
          <PreviewCard className="p-2" />
        </div>
      </div>
    );
  }

  if (patternId === "workflow-feature-grid") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-3 items-center gap-2">
          {[1, 2, 3].map((step) => (
            <div className="relative h-full" key={step}>
              {step < 3 ? (
                <div className="absolute left-[72%] top-4 h-px w-7 bg-pilot-primary/50" />
              ) : null}
              <div className="mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-pilot-primary/25 text-[10px] font-bold text-[#05100E]">
                {step}
              </div>
              <PreviewCard className="h-[calc(100%-1.5rem)] p-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (patternId === "center-highlight") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-3 items-center gap-2">
          <PreviewCard className="h-16 p-2 opacity-75" />
          <PreviewCard strong className="h-20 p-2 shadow-lg shadow-black/50" />
          <PreviewCard className="h-16 p-2 opacity-75" />
        </div>
      </div>
    );
  }

  if (patternId === "pricing-emphasis") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-3 items-end gap-2">
          <PreviewCard className="h-[4.2rem] p-2" />
          <div className="h-full rounded-md border border-pilot-primary/70 bg-pilot-primary/20 p-2 shadow-lg shadow-black/50">
            <div className="mb-1 h-2 w-10 rounded-full bg-pilot-primary/80" />
            <div className="h-1.5 w-1/2 rounded-full bg-pilot-text/35" />
            <div className="mt-2 h-1 w-4/5 rounded-full bg-pilot-text/16" />
            <div className="mt-3 h-3 rounded bg-pilot-primary/70" />
          </div>
          <PreviewCard className="h-[4.2rem] p-2" />
        </div>
      </div>
    );
  }

  if (patternId === "plan-comparison-table") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-[0.9fr_1fr_1fr_1fr] gap-1.5">
          {[0, 1, 2, 3].map((column) => (
            <div className="space-y-1.5" key={column}>
              <div className={column === 2 ? "h-4 rounded bg-pilot-primary/35" : "h-4 rounded bg-pilot-card/65"} />
              <div className="h-2 rounded bg-pilot-text/12" />
              <div className="h-2 rounded bg-pilot-text/10" />
              <div className="h-2 rounded bg-pilot-text/12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (patternId === "metric-bento" || patternId === "hero-metric-support-stats") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-[1.15fr_0.85fr] gap-2">
          <PreviewCard strong className="flex flex-col justify-center p-3">
            <div className="h-3 w-12 rounded-full bg-[#05100E]/80" />
            <div className="mt-2 h-2 w-16 rounded-full bg-pilot-text/22" />
            <div className="mt-1 h-1 w-10 rounded-full bg-pilot-text/12" />
          </PreviewCard>
          <div className="grid grid-rows-2 gap-2">
            <PreviewCard className="p-2">
              <div className="h-2 w-8 rounded-full bg-pilot-text/28" />
              <div className="mt-2 h-1 w-10 rounded-full bg-pilot-text/12" />
            </PreviewCard>
            <PreviewCard className="p-2">
              <div className="h-2 w-10 rounded-full bg-pilot-text/28" />
              <div className="mt-2 h-1 w-8 rounded-full bg-pilot-text/12" />
            </PreviewCard>
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "split-cta") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-[1fr_0.8fr] items-center gap-2">
          <div className="space-y-2">
            <div className="h-2 w-20 rounded-full bg-pilot-text/32" />
            <div className="h-1.5 w-16 rounded-full bg-pilot-text/16" />
            <div className="h-3 w-12 rounded bg-pilot-primary/70" />
          </div>
          <PreviewCard className="h-16 p-2" />
        </div>
      </div>
    );
  }

  if (patternId === "form-benefits-sidebar") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-[0.8fr_1.1fr] gap-2">
          <div className="space-y-2 rounded-md border border-pilot-primary/20 bg-pilot-card/50 p-2">
            <div className="h-1.5 w-14 rounded-full bg-pilot-text/28" />
            <div className="h-1 w-12 rounded-full bg-pilot-text/12" />
            <div className="h-1 w-16 rounded-full bg-pilot-text/12" />
          </div>
          <div className="space-y-1.5 rounded-md border border-pilot-primary/50 bg-pilot-primary/10 p-2">
            <div className="h-2 rounded bg-pilot-text/12" />
            <div className="h-2 rounded bg-pilot-text/12" />
            <div className="h-2 rounded bg-pilot-text/12" />
            <div className="mt-2 h-3 rounded bg-pilot-primary/70" />
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "featured-testimonial") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-[1.25fr_0.75fr] gap-2">
          <PreviewCard strong className="p-3">
            <div className="h-2 w-20 rounded-full bg-pilot-text/28" />
            <div className="mt-2 h-1.5 w-24 rounded-full bg-pilot-text/16" />
            <div className="mt-1 h-1.5 w-16 rounded-full bg-pilot-text/12" />
          </PreviewCard>
          <div className="grid gap-2">
            <PreviewCard className="p-2" />
            <PreviewCard className="p-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <GenericCategoryPreview category={category} />
    </div>
  );
}

function GenericCategoryPreview({ category }: { category: PatternCategory }) {
  if (category === "hero" || category === "cta") {
    return (
      <div className="flex h-full flex-col justify-center gap-2">
        <div className="h-2 w-24 rounded-full bg-pilot-text/28" />
        <div className="h-1.5 w-16 rounded-full bg-pilot-text/12" />
        <div className="h-3 w-14 rounded bg-pilot-primary/65" />
      </div>
    );
  }

  if (category === "pricing") {
    return (
      <div className="grid h-full grid-cols-3 items-end gap-2">
        <PreviewCard className="h-16 p-2" />
        <PreviewCard strong className="h-20 p-2" />
        <PreviewCard className="h-16 p-2" />
      </div>
    );
  }

  if (category === "form") {
    return (
      <div className="space-y-2 rounded-md border border-pilot-primary/40 bg-pilot-primary/10 p-2">
        <div className="h-2 rounded bg-pilot-text/12" />
        <div className="h-2 rounded bg-pilot-text/12" />
        <div className="h-2 rounded bg-pilot-text/12" />
        <div className="h-3 rounded bg-pilot-primary/70" />
      </div>
    );
  }

  if (category === "stats" || category === "dashboard") {
    return (
      <div className="grid h-full grid-cols-2 gap-2">
        <PreviewCard strong className="p-2" />
        <div className="grid gap-2">
          <PreviewCard className="p-2" />
          <PreviewCard className="p-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-2 gap-2">
      <PreviewCard strong className="p-2" />
      <PreviewCard className="p-2" />
      <PreviewCard className="p-2" />
      <PreviewCard className="p-2" />
    </div>
  );
}
