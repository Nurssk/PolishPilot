import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const CARBON_USAGE_NOTE =
  "Use as navigation/system-shell guidance only. Preserve the product IA and routes while improving orientation, active state, responsive behavior, and grouped navigation.";
const MATERIAL_USAGE_NOTE =
  "Use as responsive navigation guidance only. Match the component family to viewport size, destination count, and task frequency rather than copying Material styling.";
const GOVUK_USAGE_NOTE =
  "Use as service navigation guidance only. Preserve content and IA, but make location, service identity, and hierarchy easier to understand.";
const WAI_USAGE_NOTE =
  "Use as accessible menu guidance only. Apply ARIA menu/menubar patterns to application-style command menus, not simple site link lists.";

export const navigationGuidelineReferences: TemplateReference[] = [
  {
    id: "carbon-navigation-ui-shell-header-orientation",
    source: "carbon-navigation",
    title: "UI Shell Header Orients Product Navigation",
    url: "https://carbondesignsystem.com/components/UI-shell-header/usage/",
    category: "navigation",
    tags: ["navigation-guideline", "ui-shell", "header", "orientation", "app-shell"],
    keywords: [
      "navigation-guideline",
      "ui-shell",
      "shell-header",
      "header-navigation",
      "orientation",
      "global-navigation",
      "product-name",
      "header-actions",
      "app-shell",
      "navbar"
    ],
    description:
      "Carbon UI Shell header guidance treats the header as the foundation for navigation and orientation, optionally combining it with left and right panels for complex product navigation.",
    relatedPatternIds: [
      "sidebar-app-shell",
      "command-center-nav",
      "mega-menu-topbar",
      "settings-detail-pane",
      "activity-feed-sidebar"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "carbon-navigation-global-header-persistent",
    source: "carbon-navigation",
    title: "Global Header For Persistent Main Navigation",
    url: "https://carbondesignsystem.com/patterns/global-header/",
    category: "navigation",
    tags: ["navigation-guideline", "global-header", "persistent-nav", "topbar"],
    keywords: [
      "navigation-guideline",
      "global-header",
      "persistent-navigation",
      "topbar",
      "nav-links",
      "header-icons",
      "dropdowns",
      "small-number-of-sections",
      "site-title",
      "primary-navigation"
    ],
    description:
      "Carbon global-header guidance uses a persistent header for site title, main links, dropdowns, and header icons when only a small number of main sections need top-level access.",
    relatedPatternIds: [
      "command-center-nav",
      "mega-menu-topbar",
      "sidebar-app-shell",
      "footer-link-hub",
      "hero-tabs-preview"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "carbon-navigation-side-nav-secondary",
    source: "carbon-navigation",
    title: "Side Nav For Secondary Navigation",
    url: "https://carbondesignsystem.com/components/UI-shell-left-panel/code/",
    category: "navigation",
    tags: ["navigation-guideline", "side-nav", "secondary-navigation", "nested-nav"],
    keywords: [
      "navigation-guideline",
      "side-nav",
      "sidebar",
      "left-panel",
      "secondary-navigation",
      "nested-navigation",
      "active-state",
      "navigation-rail",
      "app-shell",
      "responsive-sidebar"
    ],
    description:
      "Carbon side-nav guidance positions secondary navigation below the header and supports fixed or flexible width with limited nested navigation.",
    relatedPatternIds: [
      "sidebar-app-shell",
      "settings-detail-pane",
      "activity-feed-sidebar",
      "command-center-nav",
      "table-summary-rail"
    ],
    usageNote: CARBON_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "material-navigation-rail-destination-count",
    source: "material-navigation",
    title: "Navigation Rail For 3-7 Primary Destinations",
    url: "https://m3.material.io/components/navigation-rail/overview",
    category: "navigation",
    tags: ["navigation-guideline", "navigation-rail", "responsive", "destinations"],
    keywords: [
      "navigation-guideline",
      "navigation-rail",
      "rail",
      "3-7-destinations",
      "primary-destinations",
      "medium-window",
      "expanded-window",
      "responsive-navigation",
      "fab",
      "app-navigation"
    ],
    description:
      "Material navigation rails are for switching between primary views on mid-sized devices, typically with 3 to 7 destinations and an optional FAB.",
    relatedPatternIds: [
      "sidebar-app-shell",
      "command-center-nav",
      "settings-detail-pane",
      "activity-feed-sidebar",
      "kanban-board"
    ],
    usageNote: MATERIAL_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "material-navigation-drawer-large-destinations",
    source: "material-navigation",
    title: "Navigation Drawer For Larger App Destinations",
    url: "https://m3.material.io/components/navigation-drawer/overview",
    category: "navigation",
    tags: ["navigation-guideline", "navigation-drawer", "large-screen", "destinations"],
    keywords: [
      "navigation-guideline",
      "navigation-drawer",
      "drawer",
      "larger-devices",
      "app-destinations",
      "side-navigation",
      "responsive-navigation",
      "destination-groups",
      "sidebar",
      "app-shell"
    ],
    description:
      "Material navigation drawers provide access to app destinations on larger devices and should be chosen when destination hierarchy needs more room than compact navigation.",
    relatedPatternIds: [
      "sidebar-app-shell",
      "settings-detail-pane",
      "mega-menu-topbar",
      "command-center-nav",
      "footer-link-hub"
    ],
    usageNote: MATERIAL_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "govuk-navigation-breadcrumbs-location",
    source: "govuk-design-system",
    title: "Breadcrumbs Show Location In Site Structure",
    url: "https://design-system.service.gov.uk/components/breadcrumbs/",
    category: "navigation",
    tags: ["navigation-guideline", "breadcrumbs", "site-structure", "location"],
    keywords: [
      "navigation-guideline",
      "breadcrumb",
      "breadcrumbs",
      "site-structure",
      "location",
      "hierarchy",
      "back-link",
      "page-location",
      "content-navigation",
      "docs-navigation"
    ],
    description:
      "GOV.UK breadcrumb guidance helps users understand where they are within a website's structure and move between levels.",
    relatedPatternIds: [
      "command-center-nav",
      "footer-link-hub",
      "resource-card-grid",
      "faq-sidebar",
      "editorial-feature-stack"
    ],
    usageNote: GOVUK_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "govuk-navigation-header-service-identity",
    source: "govuk-design-system",
    title: "Header Communicates Service Identity",
    url: "https://design-system.service.gov.uk/components/header/",
    category: "navigation",
    tags: ["navigation-guideline", "header", "masthead", "service-identity"],
    keywords: [
      "navigation-guideline",
      "header",
      "masthead",
      "service-header",
      "service-identity",
      "brand-header",
      "wide-tools",
      "service-navigation",
      "top-navigation",
      "identity"
    ],
    description:
      "GOV.UK header guidance makes the service identity clear and provides site-wide tools without turning the header into a generic decorative navbar.",
    relatedPatternIds: [
      "command-center-nav",
      "mega-menu-topbar",
      "sidebar-app-shell",
      "footer-link-hub",
      "split-auth-proof"
    ],
    usageNote: GOVUK_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  },
  {
    id: "wai-aria-menu-menubar-application-commands",
    source: "wai-aria-apg",
    title: "Menu And Menubar For Application Commands",
    url: "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/",
    category: "navigation",
    tags: ["navigation-guideline", "menubar", "menu-button", "keyboard", "commands"],
    keywords: [
      "navigation-guideline",
      "menubar",
      "menu-button",
      "menuitem",
      "aria-haspopup",
      "aria-expanded",
      "keyboard-menu",
      "command-menu",
      "application-menu",
      "dropdown-menu"
    ],
    description:
      "WAI-ARIA APG menu/menubar guidance is for command-style menus that behave like native application menus, with a detailed keyboard model.",
    relatedPatternIds: [
      "command-center-nav",
      "mega-menu-topbar",
      "settings-detail-pane",
      "sidebar-app-shell",
      "feature-tabs"
    ],
    usageNote: WAI_USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT
  }
];
