import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const CARBON_USAGE_NOTE =
  "Use as table/list-management guidance only. Preserve the product's data and business logic while improving sorting, filtering, pagination, row actions, and table accessibility.";
const MATERIAL_USAGE_NOTE =
  "Use as Material data-table guidance only. Apply the principle to table controls and hierarchy without copying Material styling.";
const WAI_USAGE_NOTE =
  "Use as WAI-ARIA table/grid guidance only. Choose semantic tables for static tabular data and grid patterns only when the table is an interactive composite widget.";
const GOV_USAGE_NOTE =
  "Use as government-service table guidance only. Keep information comparable in rows and columns; do not use tables as page layout.";

export const tableGuidelineReferences: TemplateReference[] = [
  {
    id: "carbon-data-table-sort-filter-select-expand",
    source: "carbon-table",
    title: "Data Table Behaviors: Sort, Filter, Select, Expand",
    url: "https://carbondesignsystem.com/components/data-table/usage/",
    category: "dashboard",
    tags: ["table-guideline", "data-table", "sorting", "filtering", "row-selection"],
    keywords: [
      "table-guideline",
      "data-table",
      "sorting",
      "filtering",
      "row-selection",
      "batch-actions",
      "row-expansion",
      "column-header",
      "dashboard-table",
      "list-management"
    ],
    description:
      "Carbon data-table guidance covers the product behaviors users expect around tables: sortable headers, filtering, selectable rows, batch actions, expandable rows, and contextual controls.",
    relatedPatternIds: [
      "table-summary-rail",
      "analytics-overview",
      "activity-feed-sidebar",
      "settings-detail-pane",
      "comparison-spec-table"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "carbon-data-table-accessible-sort-indicators",
    source: "carbon-table",
    title: "Accessible Sort Indicators And Table Updates",
    url: "https://carbondesignsystem.com/components/data-table/accessibility/",
    category: "dashboard",
    tags: ["table-guideline", "accessibility", "sorting", "focus", "headers"],
    keywords: [
      "table-guideline",
      "accessible-table",
      "sort-indicator",
      "hover-focus",
      "sorted-column",
      "column-header",
      "aria-sort",
      "keyboard-focus",
      "table-accessibility",
      "data-table"
    ],
    description:
      "Carbon table accessibility guidance keeps sort indicators visible on hover/focus and retained for sorted columns, so visual and keyboard users understand table state.",
    relatedPatternIds: [
      "table-summary-rail",
      "comparison-spec-table",
      "analytics-overview",
      "settings-detail-pane",
      "command-center-nav"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "carbon-pagination-large-content-control",
    source: "carbon-table",
    title: "Pagination Gives Users Control Over Large Content",
    url: "https://carbondesignsystem.com/components/pagination/usage/",
    category: "dashboard",
    tags: ["table-guideline", "pagination", "large-data", "controls", "table"],
    keywords: [
      "table-guideline",
      "pagination",
      "large-data",
      "page-size",
      "rows-per-page",
      "page-controls",
      "data-table",
      "search-results",
      "list-management",
      "dashboard-table"
    ],
    description:
      "Carbon pagination guidance frames pagination as a way to divide large content and give users control over how much they view on each page.",
    relatedPatternIds: [
      "table-summary-rail",
      "resource-card-grid",
      "product-card-grid",
      "analytics-overview",
      "comparison-spec-table"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "material-data-table-controls-placement",
    source: "material-design",
    title: "Data Table Controls Belong Near The Table",
    url: "https://m2.material.io/components/data-tables",
    category: "dashboard",
    tags: ["table-guideline", "material", "filters", "pagination", "selection"],
    keywords: [
      "table-guideline",
      "material-design",
      "data-table",
      "filter-chips",
      "pagination",
      "selection",
      "sort",
      "toolbar",
      "table-controls",
      "column-header"
    ],
    description:
      "Material data-table guidance places filters, pagination, selection, and sorting controls directly above or below the table so controls manipulate the visible data without ambiguity.",
    relatedPatternIds: [
      "table-summary-rail",
      "settings-detail-pane",
      "analytics-overview",
      "product-card-grid",
      "comparison-spec-table"
    ],
    usageNote: MATERIAL_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "material-data-table-default-sort-state",
    source: "material-design",
    title: "Default Sort The Most Important Data",
    url: "https://m1.material.io/components/data-tables.html#data-tables-interaction",
    category: "dashboard",
    tags: ["table-guideline", "material", "sorting", "default-state", "scan"],
    keywords: [
      "table-guideline",
      "default-sort",
      "sorted-state",
      "important-column",
      "sort-icon",
      "ascending",
      "descending",
      "data-table",
      "priority",
      "scan"
    ],
    description:
      "Material table guidance says sortable tables should default to the most important data and show sorted state in the column header.",
    relatedPatternIds: [
      "table-summary-rail",
      "analytics-overview",
      "metric-trend-grid",
      "comparison-spec-table",
      "activity-feed-sidebar"
    ],
    usageNote: MATERIAL_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "wai-aria-table-vs-grid-choice",
    source: "wai-aria-apg",
    title: "Choose Table Or Grid By Interaction Model",
    url: "https://www.w3.org/WAI/ARIA/apg/patterns/table/",
    category: "dashboard",
    tags: ["table-guideline", "wai-aria", "table", "grid", "keyboard"],
    keywords: [
      "table-guideline",
      "wai-aria",
      "table",
      "grid",
      "interactive-table",
      "static-table",
      "tab-sequence",
      "keyboard-navigation",
      "cells",
      "rows"
    ],
    description:
      "WAI-ARIA APG distinguishes static tables from interactive grids: tables present tabular data, while grids are composite widgets that reduce long tab sequences for interactive cells.",
    relatedPatternIds: [
      "table-summary-rail",
      "comparison-spec-table",
      "settings-detail-pane",
      "kanban-board",
      "command-center-nav"
    ],
    usageNote: WAI_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "wai-aria-grid-directional-navigation",
    source: "wai-aria-apg",
    title: "Interactive Grids Use Directional Keyboard Navigation",
    url: "https://www.w3.org/WAI/ARIA/apg/patterns/grid/",
    category: "dashboard",
    tags: ["table-guideline", "wai-aria", "grid", "keyboard", "interactive"],
    keywords: [
      "table-guideline",
      "interactive-grid",
      "grid-widget",
      "directional-navigation",
      "arrow-keys",
      "home-end",
      "spreadsheet",
      "interactive-cells",
      "keyboard",
      "dashboard-table"
    ],
    description:
      "WAI-ARIA APG grid guidance defines directional keyboard navigation for interactive tabular widgets, including arrow keys, Home, and End behavior.",
    relatedPatternIds: [
      "table-summary-rail",
      "settings-detail-pane",
      "kanban-board",
      "analytics-overview",
      "comparison-spec-table"
    ],
    usageNote: WAI_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "govuk-table-comparison-not-layout",
    source: "govuk-design-system",
    title: "Tables Are For Comparing Rows And Columns",
    url: "https://design-system.service.gov.uk/components/table/",
    category: "dashboard",
    tags: ["table-guideline", "govuk", "comparison", "semantic-table", "layout"],
    keywords: [
      "table-guideline",
      "govuk-design-system",
      "table",
      "compare",
      "rows",
      "columns",
      "semantic-table",
      "not-layout",
      "grid-system",
      "comparison"
    ],
    description:
      "GOV.UK table guidance uses tables for comparing information in rows and columns and explicitly avoids using table markup for page layout.",
    relatedPatternIds: [
      "comparison-spec-table",
      "table-summary-rail",
      "comparison-matrix",
      "plan-comparison-table",
      "pricing-faq-combo"
    ],
    usageNote: GOV_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "ons-table-empty-state-specific-message",
    source: "ons-design-system",
    title: "Empty Tables Need Specific Empty-State Text",
    url: "https://service-manual.ons.gov.uk/design-system/components/table",
    category: "dashboard",
    tags: ["table-guideline", "empty-state", "no-results", "table", "search"],
    keywords: [
      "table-guideline",
      "empty-state",
      "empty-table",
      "no-results",
      "search-results",
      "no-data",
      "zero-state",
      "filter-empty",
      "list-management",
      "table"
    ],
    description:
      "ONS table guidance replaces empty tables with direct text like no details or no results, so users understand whether the system has no data or the search/filter returned none.",
    relatedPatternIds: [
      "table-summary-rail",
      "resource-card-grid",
      "activity-feed-sidebar",
      "settings-detail-pane",
      "product-card-grid"
    ],
    usageNote: GOV_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  }
];
