import type { ReactNode } from "react";
import type { LayoutPatternId, PatternCategory } from "../patterns/layoutPatterns";

type PatternPreviewProps = {
  patternId: LayoutPatternId;
  active?: boolean;
  category?: PatternCategory;
};

const cardBase = "rounded-md border transition-colors";
const dashboardPatterns: LayoutPatternId[] = [
  "analytics-overview",
  "metric-trend-grid",
  "activity-feed-sidebar",
  "table-summary-rail"
];
const authPatterns: LayoutPatternId[] = [
  "split-auth-proof",
  "magic-link-panel",
  "onboarding-checklist-form",
  "profile-settings-form"
];
const comparisonPatterns: LayoutPatternId[] = [
  "comparison-spec-table",
  "comparison-matrix"
];
const contentGridPatterns: LayoutPatternId[] = [
  "editorial-feature-stack",
  "resource-card-grid"
];
const saasHeroPatterns: LayoutPatternId[] = [
  "hero-dashboard-preview",
  "hero-email-capture",
  "hero-logo-cloud",
  "hero-video-demo",
  "hero-tabs-preview",
  "hero-image-background",
  "hero-contained-card",
  "hero-off-grid-visual"
];

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

  if (saasHeroPatterns.includes(patternId)) {
    return <SaasHeroPreview frameClass={frameClass} patternId={patternId} />;
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

  if (dashboardPatterns.includes(patternId)) {
    return <DashboardPreview frameClass={frameClass} patternId={patternId} />;
  }

  if (patternId === "kanban-board") {
    return <KanbanPreview frameClass={frameClass} />;
  }

  if (patternId === "settings-detail-pane") {
    return <SettingsPreview frameClass={frameClass} />;
  }

  if (authPatterns.includes(patternId)) {
    return <AuthPreview frameClass={frameClass} patternId={patternId} />;
  }

  if (
    patternId === "command-center-nav" ||
    patternId === "sidebar-app-shell" ||
    patternId === "mega-menu-topbar"
  ) {
    return <NavigationPreview frameClass={frameClass} patternId={patternId} />;
  }

  if (patternId === "footer-link-hub") {
    return <FooterPreview frameClass={frameClass} />;
  }

  if (
    patternId === "product-detail-split" ||
    patternId === "product-card-grid" ||
    patternId === "checkout-summary-split"
  ) {
    return <EcommercePreview frameClass={frameClass} patternId={patternId} />;
  }

  if (comparisonPatterns.includes(patternId)) {
    return <ComparisonPreview frameClass={frameClass} />;
  }

  if (patternId === "faq-sidebar") {
    return <FaqPreview frameClass={frameClass} />;
  }

  if (contentGridPatterns.includes(patternId)) {
    return <ContentPreview frameClass={frameClass} patternId={patternId} />;
  }

  if (patternId === "changelog-timeline") {
    return <TimelinePreview frameClass={frameClass} />;
  }

  if (patternId === "before-after-hero" || patternId === "demo-steps-hero") {
    return <MarketingHeroPreview frameClass={frameClass} patternId={patternId} />;
  }

  if (patternId === "feature-tabs" || patternId === "integration-logo-grid") {
    return <FeatureSystemPreview frameClass={frameClass} patternId={patternId} />;
  }

  if (patternId === "quote-wall" || patternId === "case-study-split") {
    return <ProofPreview frameClass={frameClass} patternId={patternId} />;
  }

  if (patternId === "pricing-toggle") {
    return <PricingTogglePreview frameClass={frameClass} />;
  }

  if (patternId === "demo-panel-cta") {
    return <DemoPanelCtaPreview frameClass={frameClass} />;
  }

  if (patternId === "stats-story-band") {
    return <StatsStoryPreview frameClass={frameClass} />;
  }

  return (
    <div className={frameClass}>
      <GenericCategoryPreview category={category} />
    </div>
  );
}

function DashboardPreview({
  frameClass,
  patternId
}: {
  frameClass: string;
  patternId: LayoutPatternId;
}) {
  if (patternId === "activity-feed-sidebar" || patternId === "table-summary-rail") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-[1.25fr_0.75fr] gap-2">
          <div className="grid gap-1.5">
            {[1, 2, 3].map((row) => (
              <div className="h-5 rounded border border-pilot-primary/20 bg-pilot-card/55" key={row} />
            ))}
          </div>
          <PreviewCard strong className="p-2">
            <div className="h-2 w-10 rounded-full bg-pilot-text/30" />
            <div className="mt-2 space-y-1">
              {[1, 2, 3].map((item) => (
                <div className="h-1.5 rounded-full bg-pilot-text/12" key={item} />
              ))}
            </div>
          </PreviewCard>
        </div>
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <div className="grid h-full grid-rows-[0.42fr_1fr] gap-2">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((item) => (
            <PreviewCard className="p-1.5" key={item}>
              <div className="h-2 w-8 rounded-full bg-pilot-text/30" />
              <div className="mt-1 h-1 w-10 rounded-full bg-pilot-primary/30" />
            </PreviewCard>
          ))}
        </div>
        <PreviewCard strong className="p-2">
          <div className="mt-5 h-px w-full bg-pilot-primary/40" />
          <div className="mt-3 grid grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((bar) => (
              <div className="rounded-sm bg-pilot-primary/30" key={bar} style={{ height: `${bar + 10}px` }} />
            ))}
          </div>
        </PreviewCard>
      </div>
    </div>
  );
}

function SaasHeroPreview({
  frameClass,
  patternId
}: {
  frameClass: string;
  patternId: LayoutPatternId;
}) {
  if (patternId === "hero-email-capture") {
    return (
      <div className={frameClass}>
        <div className="flex h-full flex-col justify-center gap-2">
          <div className="mx-auto h-2 w-24 rounded bg-pilot-text/30" />
          <div className="mx-auto h-1.5 w-16 rounded bg-pilot-text/12" />
          <div className="mx-auto grid h-5 w-32 grid-cols-[1fr_0.55fr] gap-1.5">
            <div className="rounded bg-pilot-card/80" />
            <div className="rounded bg-pilot-primary/65" />
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "hero-logo-cloud") {
    return (
      <div className={frameClass}>
        <div className="flex h-full flex-col justify-center gap-2">
          <div className="mx-auto h-2 w-24 rounded bg-pilot-text/30" />
          <div className="mx-auto h-3 w-14 rounded bg-pilot-primary/65" />
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div className="h-4 rounded border border-pilot-primary/20 bg-pilot-card/55" key={item} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "hero-tabs-preview") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-[0.85fr_1.15fr] gap-2">
          <div className="space-y-2 self-center">
            <div className="h-2 w-20 rounded bg-pilot-text/30" />
            <div className="h-1.5 w-14 rounded bg-pilot-text/12" />
            <div className="h-3 w-12 rounded bg-pilot-primary/65" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="grid h-4 grid-cols-3 gap-1">
              <div className="rounded bg-pilot-primary/45" />
              <div className="rounded bg-pilot-card/70" />
              <div className="rounded bg-pilot-card/70" />
            </div>
            <PreviewCard strong className="flex-1 p-2" />
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "hero-image-background") {
    return (
      <div className={frameClass}>
        <div className="flex h-full flex-col justify-center rounded-md border border-pilot-primary/30 bg-pilot-primary/20 p-3">
          <div className="h-2 w-24 rounded bg-pilot-text/35" />
          <div className="mt-2 h-1.5 w-16 rounded bg-pilot-text/18" />
          <div className="mt-3 h-3 w-14 rounded bg-pilot-primary/70" />
        </div>
      </div>
    );
  }

  if (patternId === "hero-contained-card") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-[0.95fr_1.05fr] gap-2 rounded-md border border-pilot-primary/35 bg-pilot-card/50 p-2">
          <div className="space-y-2 self-center">
            <div className="h-2 w-20 rounded bg-pilot-text/30" />
            <div className="h-1.5 w-14 rounded bg-pilot-text/12" />
            <div className="h-3 w-12 rounded bg-pilot-primary/65" />
          </div>
          <PreviewCard strong className="p-2" />
        </div>
      </div>
    );
  }

  if (patternId === "hero-off-grid-visual") {
    return (
      <div className={frameClass}>
        <div className="relative grid h-full grid-cols-[0.85fr_1.15fr] gap-2">
          <div className="space-y-2 self-center">
            <div className="h-2 w-20 rounded bg-pilot-text/30" />
            <div className="h-1.5 w-14 rounded bg-pilot-text/12" />
            <div className="h-3 w-12 rounded bg-pilot-primary/65" />
          </div>
          <PreviewCard strong className="translate-y-2 p-2" />
          <div className="absolute right-2 top-2 h-7 w-12 rounded border border-pilot-primary/30 bg-pilot-card/70" />
        </div>
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <div className="grid h-full grid-cols-[0.85fr_1.15fr] items-center gap-2">
        <div className="space-y-2">
          <div className="h-2 w-20 rounded bg-pilot-text/30" />
          <div className="h-1.5 w-14 rounded bg-pilot-text/12" />
          <div className="h-3 w-12 rounded bg-pilot-primary/65" />
        </div>
        <PreviewCard strong className="p-2">
          {patternId === "hero-video-demo" ? (
            <div className="flex h-full items-center justify-center rounded bg-pilot-card/65">
              <div className="h-5 w-5 rounded-full bg-pilot-primary/60" />
            </div>
          ) : null}
        </PreviewCard>
      </div>
    </div>
  );
}

function KanbanPreview({ frameClass }: { frameClass: string }) {
  return (
    <div className={frameClass}>
      <div className="grid h-full grid-cols-3 gap-2">
        {[1, 2, 3].map((column) => (
          <div className="rounded-md border border-pilot-primary/20 bg-pilot-card/40 p-1.5" key={column}>
            <div className="mb-1.5 h-1.5 w-8 rounded-full bg-pilot-text/24" />
            <PreviewCard strong={column === 2} className="mb-1 h-5 p-1" />
            <PreviewCard className="h-5 p-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPreview({ frameClass }: { frameClass: string }) {
  return (
    <div className={frameClass}>
      <div className="grid h-full grid-cols-[0.72fr_1.28fr] gap-2">
        <div className="space-y-1.5 rounded-md border border-pilot-primary/20 bg-pilot-card/45 p-2">
          {[1, 2, 3, 4].map((item) => (
            <div className={item === 2 ? "h-2 rounded bg-pilot-primary/40" : "h-2 rounded bg-pilot-text/12"} key={item} />
          ))}
        </div>
        <PreviewCard strong className="space-y-1.5 p-2">
          <div className="h-2 w-14 rounded bg-pilot-text/26" />
          <div className="h-2 rounded bg-pilot-text/12" />
          <div className="h-2 rounded bg-pilot-text/12" />
          <div className="mt-2 h-3 w-16 rounded bg-pilot-primary/60" />
        </PreviewCard>
      </div>
    </div>
  );
}

function AuthPreview({
  frameClass,
  patternId
}: {
  frameClass: string;
  patternId: LayoutPatternId;
}) {
  if (patternId === "magic-link-panel") {
    return (
      <div className={frameClass}>
        <div className="mx-auto flex h-full max-w-[80%] flex-col justify-center rounded-md border border-pilot-primary/40 bg-pilot-primary/10 p-3">
          <div className="mx-auto h-2 w-16 rounded-full bg-pilot-text/30" />
          <div className="mt-3 h-3 rounded bg-pilot-card/80" />
          <div className="mt-2 h-3 rounded bg-pilot-primary/65" />
        </div>
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <div className="grid h-full grid-cols-[0.85fr_1.15fr] gap-2">
        <PreviewCard className="p-2">
          <div className="h-2 w-12 rounded-full bg-pilot-text/28" />
          <div className="mt-2 h-1.5 w-16 rounded-full bg-pilot-text/12" />
          <div className="mt-1 h-1.5 w-10 rounded-full bg-pilot-text/12" />
        </PreviewCard>
        <PreviewCard strong className="space-y-1.5 p-2">
          <div className="h-2 w-12 rounded bg-pilot-text/24" />
          <div className="h-2 rounded bg-pilot-card/80" />
          <div className="h-2 rounded bg-pilot-card/80" />
          <div className="mt-2 h-3 rounded bg-pilot-primary/65" />
        </PreviewCard>
      </div>
    </div>
  );
}

function NavigationPreview({
  frameClass,
  patternId
}: {
  frameClass: string;
  patternId: LayoutPatternId;
}) {
  if (patternId === "sidebar-app-shell") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-[0.55fr_1.45fr] gap-2">
          <div className="space-y-2 rounded-md bg-pilot-primary/15 p-2">
            {[1, 2, 3, 4].map((item) => (
              <div className={item === 1 ? "h-2 rounded bg-pilot-primary/60" : "h-2 rounded bg-pilot-text/12"} key={item} />
            ))}
          </div>
          <div className="grid gap-2">
            <PreviewCard strong className="p-2" />
            <div className="grid grid-cols-2 gap-2">
              <PreviewCard className="p-2" />
              <PreviewCard className="p-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-center gap-2 rounded-md border border-pilot-primary/20 bg-pilot-card/50 p-2">
          <div className="h-3 w-3 rounded bg-pilot-primary/55" />
          <div className="h-2 flex-1 rounded bg-pilot-card/80" />
          <div className="h-3 w-12 rounded bg-pilot-primary/60" />
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2">
          {[1, 2, 3].map((item) => (
            <PreviewCard strong={patternId === "mega-menu-topbar" && item === 2} className="p-2" key={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterPreview({ frameClass }: { frameClass: string }) {
  return (
    <div className={frameClass}>
      <div className="grid h-full grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr] gap-2">
        <PreviewCard strong className="p-2" />
        {[1, 2, 3].map((column) => (
          <div className="space-y-1.5 rounded-md border border-pilot-primary/20 bg-pilot-card/45 p-2" key={column}>
            <div className="h-2 rounded bg-pilot-text/24" />
            <div className="h-1.5 rounded bg-pilot-text/12" />
            <div className="h-1.5 rounded bg-pilot-text/12" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EcommercePreview({
  frameClass,
  patternId
}: {
  frameClass: string;
  patternId: LayoutPatternId;
}) {
  if (patternId === "product-card-grid") {
    return (
      <div className={frameClass}>
        <div className="grid h-full grid-cols-3 gap-2">
          {[1, 2, 3].map((item) => (
            <PreviewCard className="p-1.5" key={item}>
              <div className="mb-1.5 h-6 rounded bg-pilot-primary/20" />
              <div className="h-1.5 rounded bg-pilot-text/20" />
              <div className="mt-1 h-2 w-10 rounded bg-pilot-primary/55" />
            </PreviewCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <div className="grid h-full grid-cols-[1.1fr_0.9fr] gap-2">
        <PreviewCard strong className="p-2">
          <div className="h-full rounded bg-pilot-primary/18" />
        </PreviewCard>
        <PreviewCard className="space-y-1.5 p-2">
          <div className="h-2 w-12 rounded bg-pilot-text/28" />
          <div className="h-2 rounded bg-pilot-text/12" />
          <div className="h-2 rounded bg-pilot-text/12" />
          <div className="mt-2 h-3 rounded bg-pilot-primary/65" />
        </PreviewCard>
      </div>
    </div>
  );
}

function ComparisonPreview({ frameClass }: { frameClass: string }) {
  return (
    <div className={frameClass}>
      <div className="grid h-full grid-cols-[0.9fr_1fr_1fr] gap-1.5">
        {[0, 1, 2].map((column) => (
          <div className="space-y-1.5" key={column}>
            <div className={column === 1 ? "h-4 rounded bg-pilot-primary/35" : "h-4 rounded bg-pilot-card/65"} />
            {[1, 2, 3, 4].map((row) => (
              <div className="h-2 rounded bg-pilot-text/12" key={row} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqPreview({ frameClass }: { frameClass: string }) {
  return (
    <div className={frameClass}>
      <div className="grid h-full grid-cols-[0.7fr_1.3fr] gap-2">
        <div className="space-y-1.5 rounded-md bg-pilot-primary/12 p-2">
          {[1, 2, 3].map((item) => (
            <div className={item === 1 ? "h-2 rounded bg-pilot-primary/50" : "h-2 rounded bg-pilot-text/12"} key={item} />
          ))}
        </div>
        <div className="space-y-1.5">
          {[1, 2, 3].map((item) => (
            <PreviewCard strong={item === 1} className="h-6 p-1.5" key={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentPreview({
  frameClass,
  patternId
}: {
  frameClass: string;
  patternId: LayoutPatternId;
}) {
  return (
    <div className={frameClass}>
      <div className={patternId === "resource-card-grid" ? "grid h-full grid-cols-2 gap-2" : "grid h-full grid-rows-[0.5fr_1fr_0.5fr] gap-2"}>
        {[1, 2, 3, 4].slice(0, patternId === "resource-card-grid" ? 4 : 3).map((item) => (
          <PreviewCard strong={item === 1} className="p-2" key={item} />
        ))}
      </div>
    </div>
  );
}

function TimelinePreview({ frameClass }: { frameClass: string }) {
  return (
    <div className={frameClass}>
      <div className="relative h-full pl-5">
        <div className="absolute bottom-1 left-2 top-1 w-px bg-pilot-primary/40" />
        {[1, 2, 3].map((item) => (
          <div className="relative mb-1.5 h-6 rounded border border-pilot-primary/20 bg-pilot-card/55 p-1" key={item}>
            <div className="absolute -left-[17px] top-2 h-2 w-2 rounded-full bg-pilot-primary/70" />
            <div className="h-1.5 w-16 rounded bg-pilot-text/18" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketingHeroPreview({
  frameClass,
  patternId
}: {
  frameClass: string;
  patternId: LayoutPatternId;
}) {
  return (
    <div className={frameClass}>
      <div className="grid h-full grid-cols-[0.9fr_1.1fr] items-center gap-2">
        <div className="space-y-2">
          <div className="h-2 w-20 rounded bg-pilot-text/30" />
          <div className="h-1.5 w-14 rounded bg-pilot-text/12" />
          <div className="h-3 w-12 rounded bg-pilot-primary/65" />
        </div>
        {patternId === "before-after-hero" ? (
          <div className="grid h-full grid-cols-2 gap-1.5">
            <PreviewCard className="p-2 opacity-70" />
            <PreviewCard strong className="p-2" />
          </div>
        ) : (
          <div className="grid h-full grid-cols-3 items-center gap-1.5">
            {[1, 2, 3].map((step) => (
              <PreviewCard strong={step === 2} className="p-1.5" key={step} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureSystemPreview({
  frameClass,
  patternId
}: {
  frameClass: string;
  patternId: LayoutPatternId;
}) {
  return (
    <div className={frameClass}>
      {patternId === "feature-tabs" ? (
        <div className="flex h-full flex-col gap-2">
          <div className="flex gap-1.5">
            {[1, 2, 3].map((tab) => (
              <div className={tab === 1 ? "h-4 flex-1 rounded bg-pilot-primary/45" : "h-4 flex-1 rounded bg-pilot-card/65"} key={tab} />
            ))}
          </div>
          <PreviewCard strong className="flex-1 p-2" />
        </div>
      ) : (
        <div className="grid h-full grid-cols-4 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div className="rounded border border-pilot-primary/20 bg-pilot-card/55" key={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProofPreview({
  frameClass,
  patternId
}: {
  frameClass: string;
  patternId: LayoutPatternId;
}) {
  return (
    <div className={frameClass}>
      <div className={patternId === "case-study-split" ? "grid h-full grid-cols-[1.15fr_0.85fr] gap-2" : "grid h-full grid-cols-2 gap-2"}>
        {[1, 2, 3, 4].slice(0, patternId === "case-study-split" ? 2 : 4).map((item) => (
          <PreviewCard strong={item === 1} className="p-2" key={item}>
            <div className="h-2 w-12 rounded bg-pilot-text/22" />
            <div className="mt-2 h-1.5 rounded bg-pilot-text/12" />
            <div className="mt-1 h-1.5 w-10 rounded bg-pilot-text/12" />
          </PreviewCard>
        ))}
      </div>
    </div>
  );
}

function PricingTogglePreview({ frameClass }: { frameClass: string }) {
  return (
    <div className={frameClass}>
      <div className="flex h-full flex-col gap-2">
        <div className="mx-auto grid h-5 w-28 grid-cols-2 rounded-full border border-pilot-primary/25 bg-pilot-card/60 p-0.5">
          <div className="rounded-full bg-pilot-primary/55" />
          <div />
        </div>
        <div className="grid flex-1 grid-cols-3 items-end gap-2">
          <PreviewCard className="h-14 p-2" />
          <PreviewCard strong className="h-16 p-2" />
          <PreviewCard className="h-14 p-2" />
        </div>
      </div>
    </div>
  );
}

function DemoPanelCtaPreview({ frameClass }: { frameClass: string }) {
  return (
    <div className={frameClass}>
      <div className="grid h-full grid-cols-[0.85fr_1.15fr] items-center gap-2">
        <div className="space-y-2">
          <div className="h-2 w-16 rounded bg-pilot-text/30" />
          <div className="h-1.5 w-14 rounded bg-pilot-text/12" />
          <div className="h-3 w-12 rounded bg-pilot-primary/65" />
        </div>
        <PreviewCard strong className="p-2">
          <div className="h-full rounded bg-pilot-card/65" />
        </PreviewCard>
      </div>
    </div>
  );
}

function StatsStoryPreview({ frameClass }: { frameClass: string }) {
  return (
    <div className={frameClass}>
      <div className="grid h-full grid-rows-[0.75fr_1fr] gap-2">
        <div className="space-y-1.5">
          <div className="h-2 w-24 rounded bg-pilot-text/28" />
          <div className="h-1.5 w-20 rounded bg-pilot-text/12" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((item) => (
            <PreviewCard strong={item === 2} className="p-2" key={item} />
          ))}
        </div>
      </div>
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
