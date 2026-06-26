import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const WAI_USAGE_NOTE =
  "Use as interaction and accessibility guidance only. Preserve the visual direction, but implement keyboard behavior, roles, labels, and focus handling correctly.";
const WCAG_USAGE_NOTE =
  "Use as WCAG-backed accessibility guidance only. Keep the design polished while ensuring the selected controls remain operable by keyboard, pointer, and assistive technology users.";
const GOVUK_USAGE_NOTE =
  "Use as form-validation UX guidance only. Preserve the product's voice, but make errors specific, recoverable, and reachable by keyboard and assistive technology.";

export const interactionGuidelineReferences: TemplateReference[] = [
  {
    id: "wai-aria-apg-tabs-keyboard-semantics",
    source: "wai-aria-apg",
    title: "Accessible Tabs Keyboard And Semantics",
    url: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/",
    category: "navigation",
    tags: ["interaction-guideline", "tabs", "keyboard", "aria", "state"],
    keywords: [
      "tabs",
      "tablist",
      "tabpanel",
      "keyboard-navigation",
      "aria-selected",
      "settings",
      "segmented-control",
      "feature-tabs",
      "pricing-toggle"
    ],
    description:
      "WAI-ARIA APG tab guidance covers the expected keyboard model and ARIA relationship between a tab list, selected tab, and tab panel.",
    relatedPatternIds: [
      "feature-tabs",
      "hero-tabs-preview",
      "settings-detail-pane",
      "pricing-toggle",
      "command-center-nav"
    ],
    usageNote: WAI_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "wai-aria-apg-dialog-modal-focus-management",
    source: "wai-aria-apg",
    title: "Modal Dialog Focus Management",
    url: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
    category: "other",
    tags: ["interaction-guideline", "dialog", "modal", "focus", "aria"],
    keywords: [
      "dialog",
      "modal",
      "popover",
      "focus-trap",
      "aria-modal",
      "inert",
      "preview",
      "details",
      "overlay"
    ],
    description:
      "WAI-ARIA APG modal guidance treats content behind a modal as inert and requires deliberate focus behavior so users understand and exit the dialog.",
    relatedPatternIds: [
      "settings-detail-pane",
      "resource-card-grid",
      "product-detail-split",
      "checkout-summary-split",
      "demo-panel-cta"
    ],
    usageNote: WAI_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "wai-aria-apg-disclosure-expanded-controls",
    source: "wai-aria-apg",
    title: "Disclosure Buttons With Expanded State",
    url: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/",
    category: "navigation",
    tags: ["interaction-guideline", "disclosure", "accordion", "aria-expanded", "keyboard"],
    keywords: [
      "disclosure",
      "accordion",
      "show-hide",
      "aria-expanded",
      "aria-controls",
      "faq",
      "menu",
      "navigation",
      "details"
    ],
    description:
      "WAI-ARIA APG disclosure guidance makes show/hide controls explicit buttons with expanded state, instead of hidden click areas or unlabeled chevrons.",
    relatedPatternIds: [
      "faq-sidebar",
      "form-faq-sidebar",
      "mega-menu-topbar",
      "footer-link-hub",
      "command-center-nav"
    ],
    usageNote: WAI_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "wai-aria-apg-accordion-section-structure",
    source: "wai-aria-apg",
    title: "Accordion Section Structure",
    url: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/",
    category: "other",
    tags: ["interaction-guideline", "accordion", "sections", "faq", "keyboard"],
    keywords: [
      "accordion",
      "faq",
      "sections",
      "show-hide",
      "keyboard",
      "heading-button",
      "aria-expanded",
      "content-groups"
    ],
    description:
      "WAI-ARIA APG accordion guidance keeps section headings, toggle buttons, expanded state, and content panels connected for keyboard and assistive technology users.",
    relatedPatternIds: [
      "faq-sidebar",
      "form-faq-sidebar",
      "resource-card-grid",
      "pricing-faq-combo",
      "changelog-timeline"
    ],
    usageNote: WAI_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "wcag-target-size-minimum-controls",
    source: "wcag-wai",
    title: "Pointer Target Size Minimum",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html",
    category: "buttons",
    tags: ["interaction-guideline", "wcag", "target-size", "touch-target", "controls"],
    keywords: [
      "target-size",
      "touch-target",
      "24px",
      "small-buttons",
      "icon-buttons",
      "toolbar",
      "dense-ui",
      "pointer-input",
      "spacing"
    ],
    description:
      "WCAG 2.2 target-size guidance sets a 24 by 24 CSS pixel minimum or sufficient spacing so pointer users do not accidentally activate adjacent controls.",
    relatedPatternIds: [
      "command-center-nav",
      "sidebar-app-shell",
      "settings-detail-pane",
      "table-summary-rail",
      "compact-lead-form"
    ],
    usageNote: WCAG_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "wcag-focus-visible-keyboard-controls",
    source: "wcag-wai",
    title: "Visible Keyboard Focus",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html",
    category: "buttons",
    tags: ["interaction-guideline", "wcag", "focus-visible", "keyboard", "accessibility"],
    keywords: [
      "focus-visible",
      "keyboard-focus",
      "focus-ring",
      "keyboard-navigation",
      "accessibility",
      "buttons",
      "links",
      "form-controls",
      "navigation"
    ],
    description:
      "WCAG Focus Visible requires keyboard-operable UI to show a visible focus indicator so users know which component will respond.",
    relatedPatternIds: [
      "command-center-nav",
      "sidebar-app-shell",
      "compact-lead-form",
      "settings-detail-pane",
      "magic-link-panel"
    ],
    usageNote: WCAG_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "govuk-validation-error-summary-recovery",
    source: "govuk-design-system",
    title: "Validation Errors With Summary And Field Messages",
    url: "https://design-system.service.gov.uk/patterns/validation/",
    category: "forms",
    tags: ["interaction-guideline", "forms", "validation", "error-summary", "recovery"],
    keywords: [
      "validation",
      "error-summary",
      "error-message",
      "form-errors",
      "field-errors",
      "recover",
      "form",
      "accessibility",
      "focus"
    ],
    description:
      "GOV.UK validation guidance asks forms to preserve the user's answers, show an error summary, move focus to it, and place specific messages next to each invalid field.",
    relatedPatternIds: [
      "compact-lead-form",
      "form-benefits-sidebar",
      "two-step-form-layout",
      "profile-settings-form",
      "checkout-summary-split"
    ],
    usageNote: GOVUK_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "govuk-error-message-specific-actionable-copy",
    source: "govuk-design-system",
    title: "Specific Error Message Copy",
    url: "https://design-system.service.gov.uk/components/error-message/",
    category: "forms",
    tags: ["interaction-guideline", "forms", "error-message", "copywriting", "validation"],
    keywords: [
      "error-message",
      "validation-copy",
      "specific-error",
      "field-error",
      "plain-language",
      "form",
      "input",
      "recoverable"
    ],
    description:
      "GOV.UK error-message guidance keeps field errors close to the relevant input and uses direct copy that explains what went wrong and how to fix it.",
    relatedPatternIds: [
      "compact-lead-form",
      "form-faq-sidebar",
      "two-step-form-layout",
      "magic-link-panel",
      "checkout-summary-split"
    ],
    usageNote: GOVUK_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  }
];
