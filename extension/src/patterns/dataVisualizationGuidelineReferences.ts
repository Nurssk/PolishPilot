import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const CARBON_USAGE_NOTE =
  "Use as data-visualization guidance only. Preserve real data and product context; choose chart structure, labels, legends, and color rules that clarify the selected dashboard/stat block.";
const APPLE_USAGE_NOTE =
  "Use as Apple chart guidance only. Preserve platform and brand, but make the chart focused, approachable, and accessible instead of decorative.";
const MATERIAL_USAGE_NOTE =
  "Use as Material data-visualization guidance only. Apply the principle to chart readability, accessibility, and contextual fit without copying Material styling.";
const USWDS_USAGE_NOTE =
  "Use as public-sector data-visualization accessibility guidance only. Treat usability and accessibility as shared requirements for chart, table, and metric recommendations.";

export const dataVisualizationGuidelineReferences: TemplateReference[] = [
  {
    id: "carbon-data-viz-chart-purpose-and-type",
    source: "carbon-data-viz",
    title: "Choose Chart Type By Data Purpose",
    url: "https://carbondesignsystem.com/data-visualization/chart-types/",
    category: "dashboard",
    tags: ["data-viz-guideline", "chart-type", "comparison", "trend", "part-to-whole"],
    keywords: [
      "data-visualization",
      "chart-type",
      "chart-purpose",
      "comparison",
      "trend",
      "part-to-whole",
      "correlation",
      "dashboard",
      "stats",
      "fake-charts"
    ],
    description:
      "Carbon chart-type guidance starts with the purpose of the visualization, then maps the data task to comparison, trend, part-to-whole, relationship, or map patterns.",
    relatedPatternIds: [
      "analytics-overview",
      "metric-trend-grid",
      "comparison-spec-table",
      "comparison-matrix",
      "stats-story-band"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "carbon-data-viz-chart-anatomy-labels",
    source: "carbon-data-viz",
    title: "Chart Anatomy: Titles, Axes, Legends, Tooltips",
    url: "https://carbondesignsystem.com/data-visualization/chart-anatomy/",
    category: "dashboard",
    tags: ["data-viz-guideline", "chart-anatomy", "axis", "legend", "tooltip"],
    keywords: [
      "data-visualization",
      "chart-anatomy",
      "axis",
      "axis-title",
      "legend",
      "tooltip",
      "chart-title",
      "ticks",
      "graph-frame",
      "dashboard"
    ],
    description:
      "Carbon chart anatomy names the core pieces of a useful chart: title, axes, ticks, axis titles, legend, toolbar, zoom, frame, and tooltip.",
    relatedPatternIds: [
      "analytics-overview",
      "metric-trend-grid",
      "table-summary-rail",
      "comparison-spec-table",
      "metric-bento"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "carbon-data-viz-accessible-color-palettes",
    source: "carbon-data-viz",
    title: "Accessible Data-Viz Color Palettes",
    url: "https://carbondesignsystem.com/data-visualization/color-palettes/",
    category: "dashboard",
    tags: ["data-viz-guideline", "color", "palette", "accessibility", "charts"],
    keywords: [
      "data-visualization",
      "chart-color",
      "palette",
      "categorical-palette",
      "sequential-palette",
      "alert-palette",
      "gradient-use",
      "accessibility",
      "color-alone",
      "one-note-palette"
    ],
    description:
      "Carbon data-viz palettes are selected to maximize accessibility and visual harmony, with separate use cases for categorical, sequential, alert, and gradient color.",
    relatedPatternIds: [
      "analytics-overview",
      "metric-trend-grid",
      "metric-bento",
      "before-after-metrics",
      "stats-story-band"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "carbon-data-viz-legends-texture-accessibility",
    source: "carbon-data-viz",
    title: "Legends Need More Than Color",
    url: "https://carbondesignsystem.com/data-visualization/legends/",
    category: "dashboard",
    tags: ["data-viz-guideline", "legend", "texture", "accessibility", "color"],
    keywords: [
      "data-visualization",
      "legend",
      "legends",
      "texture",
      "color-alone",
      "visual-impairment",
      "chart-accessibility",
      "hover-highlight",
      "series",
      "dashboard"
    ],
    description:
      "Carbon legend guidance uses color by default but recommends texture alongside color when visual impairment or chart complexity makes color alone insufficient.",
    relatedPatternIds: [
      "analytics-overview",
      "metric-trend-grid",
      "comparison-matrix",
      "comparison-spec-table",
      "table-summary-rail"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "carbon-data-viz-simple-charts-story",
    source: "carbon-data-viz",
    title: "Every Simple Chart Should Tell A Story",
    url: "https://carbondesignsystem.com/data-visualization/simple-charts/",
    category: "dashboard",
    tags: ["data-viz-guideline", "simple-chart", "story", "context", "stats"],
    keywords: [
      "data-visualization",
      "simple-chart",
      "tell-a-story",
      "context",
      "stats",
      "metric",
      "kpi",
      "sparkline",
      "dashboard",
      "placeholder-metric"
    ],
    description:
      "Carbon simple-chart guidance says every chart should tell a story and reflect the surrounding page content, not sit as decorative filler.",
    relatedPatternIds: [
      "stats-story-band",
      "metric-bento",
      "metric-trend-grid",
      "analytics-overview",
      "before-after-metrics"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "apple-hig-charting-data-clarity",
    source: "apple-hig",
    title: "Charting Data With Clarity",
    url: "https://developer.apple.com/design/human-interface-guidelines/charting-data",
    category: "dashboard",
    tags: ["data-viz-guideline", "apple", "charts", "clarity", "interaction"],
    keywords: [
      "data-visualization",
      "charting-data",
      "charts",
      "clarity",
      "glanceable",
      "interactive-chart",
      "dashboard",
      "stats",
      "data-summary",
      "focus"
    ],
    description:
      "Apple's charting guidance ranges from glanceable charts to rich interactive experiences, with emphasis on communicating information clearly and attractively.",
    relatedPatternIds: [
      "analytics-overview",
      "metric-trend-grid",
      "stats-story-band",
      "table-summary-rail",
      "before-after-metrics"
    ],
    usageNote: APPLE_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "apple-wwdc-effective-chart-focused-accessible",
    source: "apple-hig",
    title: "Effective Charts Are Focused, Approachable, Accessible",
    url: "https://developer.apple.com/videos/play/wwdc2022/110340/",
    category: "dashboard",
    tags: ["data-viz-guideline", "apple", "accessible-charts", "axes", "descriptions"],
    keywords: [
      "data-visualization",
      "effective-chart",
      "focused",
      "approachable",
      "accessible",
      "clear-marks",
      "axes",
      "descriptions",
      "interaction",
      "color"
    ],
    description:
      "Apple's chart design session frames effective charts as focused, approachable, and accessible, with clear marks, axes, descriptions, interaction, and color.",
    relatedPatternIds: [
      "analytics-overview",
      "metric-trend-grid",
      "comparison-spec-table",
      "stats-story-band",
      "metric-bento"
    ],
    usageNote: APPLE_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "material-data-viz-context-at-a-glance",
    source: "material-design",
    title: "Data Visualization At A Glance",
    url: "https://m2.material.io/design/communication/data-visualization.html",
    category: "dashboard",
    tags: ["data-viz-guideline", "material", "charts", "context", "glanceable"],
    keywords: [
      "data-visualization",
      "material-design",
      "glanceable",
      "context",
      "chart-style",
      "custom-shape",
      "data-easier-to-understand",
      "dashboard",
      "stats",
      "chart"
    ],
    description:
      "Material's data visualization guidance focuses on making data easier to understand at a glance in ways that fit the user's needs and context.",
    relatedPatternIds: [
      "analytics-overview",
      "metric-trend-grid",
      "metric-bento",
      "stats-strip",
      "comparison-matrix"
    ],
    usageNote: MATERIAL_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "material-data-viz-accessibility-strategies",
    source: "material-design",
    title: "Accessible Data Visualization Strategies",
    url: "https://m3.material.io/blog/data-visualization-accessibility",
    category: "dashboard",
    tags: ["data-viz-guideline", "material", "accessibility", "charts", "color"],
    keywords: [
      "data-visualization",
      "chart-accessibility",
      "accessible-chart",
      "scalable",
      "color-accessibility",
      "data-table",
      "screen-reader",
      "labels",
      "dashboard",
      "stats"
    ],
    description:
      "Material's data visualization accessibility guidance covers strategies for making charts accessible, scalable, and understandable beyond visual styling alone.",
    relatedPatternIds: [
      "analytics-overview",
      "table-summary-rail",
      "metric-trend-grid",
      "comparison-spec-table",
      "stats-story-band"
    ],
    usageNote: MATERIAL_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "uswds-data-visualizations-usability-accessibility",
    source: "uswds",
    title: "Data Visualization Usability And Accessibility",
    url: "https://designsystem.digital.gov/components/data-visualizations/",
    category: "dashboard",
    tags: ["data-viz-guideline", "uswds", "accessibility", "usability", "assistive-tools"],
    keywords: [
      "data-visualization",
      "uswds",
      "usability",
      "accessibility",
      "assistive-tooling",
      "patterns",
      "relationships",
      "data-set",
      "dashboard",
      "charts"
    ],
    description:
      "USWDS data-visualization guidance treats usability and accessibility as complementary goals, with examples focused on assistive tooling and clear pattern communication.",
    relatedPatternIds: [
      "analytics-overview",
      "table-summary-rail",
      "comparison-spec-table",
      "metric-trend-grid",
      "resource-card-grid"
    ],
    usageNote: USWDS_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  }
];
