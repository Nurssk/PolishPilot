import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as high-level design-system direction only. Preserve the existing product style and do not copy placeholder token values blindly.";

const README_URL = "https://github.com/Dammyjay93/interface-design";
const SYSTEM_TEMPLATE_URL =
  "https://github.com/Dammyjay93/interface-design/blob/main/reference/system-template.md";

export const interfaceDesignReferences: TemplateReference[] = [
  {
    id: "interface-design-token-consistency",
    source: "interface-design",
    title: "Design-System Token Consistency",
    url: SYSTEM_TEMPLATE_URL,
    category: "dashboard",
    tags: ["design-system", "tokens", "spacing", "radius", "depth", "dashboard"],
    keywords: [
      "dashboard",
      "settings",
      "inconsistent-spacing",
      "oversized-radius",
      "dramatic-shadows",
      "weak-hierarchy",
      "design-system"
    ],
    description:
      "Design-system direction for keeping spacing, radius, depth, typography, and component decisions consistent across app/dashboard surfaces.",
    author: "Dammyjay93/interface-design",
    relatedPatternIds: ["settings-detail-pane", "table-summary-rail", "analytics-overview"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/Dammyjay93/interface-design/main/reference/system-template.md"
  },
  {
    id: "interface-design-app-ui-memory",
    source: "interface-design",
    title: "App UI Consistency Direction",
    url: README_URL,
    category: "settings",
    tags: ["app-ui", "admin", "tools", "consistency", "density"],
    keywords: [
      "app-ui",
      "admin",
      "settings",
      "dashboard",
      "density",
      "surface-treatment",
      "consistency"
    ],
    description:
      "App-interface direction for using consistent button heights, spacing scale, card padding, borders, and surface treatment in dense tools instead of drifting values.",
    author: "Dammyjay93/interface-design",
    relatedPatternIds: ["settings-detail-pane", "command-center-nav", "table-summary-rail"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl: "https://raw.githubusercontent.com/Dammyjay93/interface-design/main/README.md"
  }
];
