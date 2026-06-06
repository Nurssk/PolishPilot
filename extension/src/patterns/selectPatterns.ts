import { layoutPatternById, type LayoutPattern, type LayoutPatternId } from "./layoutPatterns";

type DetectedBlock = {
  type: string;
  count: number;
  description: string;
};

export function selectPatterns(args: {
  sectionType: string;
  layoutType: string;
  currentLayoutProblem?: string;
  detectedBlocks?: DetectedBlock[];
}): LayoutPattern[] {
  const sectionType = args.sectionType.toLowerCase();
  const layoutType = args.layoutType.toLowerCase();

  if (sectionType === "hero") {
    return pickPatterns([
      "hero-product-preview",
      "split-hero",
      "hero-trust-bar",
      "hero-feature-chips"
    ]);
  }

  if (isFeatureSection(sectionType) && suggestsSequence(args)) {
    return pickPatterns([
      "workflow-feature-grid",
      "alternating-feature-rows",
      "problem-solution-cards"
    ]);
  }

  if (isFeatureSection(sectionType) && layoutType === "equal_grid") {
    return pickPatterns([
      "bento-grid",
      "featured-side-stack",
      "center-highlight",
      "icon-grid-grouping",
      "problem-solution-cards"
    ]);
  }

  if (sectionType === "pricing") {
    return pickPatterns([
      "pricing-emphasis",
      "plan-comparison-table",
      "pricing-faq-combo",
      "two-tier-pricing-split"
    ]);
  }

  if (sectionType === "stats") {
    return pickPatterns([
      "hero-metric-support-stats",
      "metric-bento",
      "stats-strip",
      "before-after-metrics"
    ]);
  }

  if (sectionType === "cta") {
    return pickPatterns(["split-cta", "banner-cta", "card-cta", "cta-trust-notes"]);
  }

  if (sectionType === "form") {
    return pickPatterns([
      "form-benefits-sidebar",
      "two-step-form-layout",
      "compact-lead-form",
      "form-faq-sidebar"
    ]);
  }

  if (sectionType === "testimonials") {
    return pickPatterns([
      "featured-testimonial",
      "testimonial-wall",
      "logo-cloud-quote",
      "review-cards-carousel"
    ]);
  }

  return pickPatterns(["bento-grid", "center-highlight", "split-cta", "hero-product-preview"]);
}

function pickPatterns(ids: LayoutPatternId[]) {
  return ids
    .slice(0, 5)
    .map((id) => layoutPatternById.get(id))
    .filter((pattern): pattern is LayoutPattern => Boolean(pattern));
}

function isFeatureSection(sectionType: string) {
  return sectionType === "features" || sectionType === "cards";
}

function suggestsSequence(args: {
  currentLayoutProblem?: string;
  detectedBlocks?: DetectedBlock[];
}) {
  const text = [
    args.currentLayoutProblem ?? "",
    ...(args.detectedBlocks ?? []).map((block) =>
      [block.type, block.count, block.description].join(" ")
    )
  ]
    .join(" ")
    .toLowerCase();

  return /\b(step|steps|sequence|process|workflow|flow|onboarding|timeline|journey|how it works|how-it-works)\b/.test(
    text
  );
}
