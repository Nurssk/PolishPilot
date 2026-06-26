import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as high-level copy-quality direction only. Preserve the user's facts and product voice; do not copy examples or invent proof.";

const PHRASES_URL =
  "https://github.com/hardikpandya/stop-slop/blob/main/references/phrases.md";
const STRUCTURES_URL =
  "https://github.com/hardikpandya/stop-slop/blob/main/references/structures.md";

export const stopSlopReferences: TemplateReference[] = [
  {
    id: "stop-slop-phrase-cleanup",
    source: "stop-slop",
    title: "Stop Slop Phrase Cleanup",
    url: PHRASES_URL,
    category: "features",
    tags: ["copywriting", "phrases", "voice", "specificity", "anti-slop"],
    keywords: [
      "copywriting",
      "ai-slop-phrase-tells",
      "formulaic-ai-copy",
      "fake-premium-copy",
      "business-jargon",
      "specificity"
    ],
    description:
      "Copy cleanup direction for removing throat-clearing openers, generic business jargon, softeners, meta-commentary, and vague importance claims from visible UI copy.",
    author: "hardikpandya/stop-slop",
    relatedPatternIds: ["editorial-feature-stack", "resource-card-grid", "compact-lead-form"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/hardikpandya/stop-slop/main/references/phrases.md"
  },
  {
    id: "stop-slop-structure-cleanup",
    source: "stop-slop",
    title: "Stop Slop Structure Cleanup",
    url: STRUCTURES_URL,
    category: "cta",
    tags: ["copywriting", "structure", "rhythm", "cta", "plain-language"],
    keywords: [
      "formulaic-ai-copy",
      "ai-punctuation-tells",
      "binary-contrast",
      "rhetorical-setup",
      "cta_not_clear",
      "plain-language"
    ],
    description:
      "Writing-structure direction for replacing binary contrasts, rhetorical setups, dramatic fragments, passive voice, and over-punchy rhythm with direct product copy.",
    author: "hardikpandya/stop-slop",
    relatedPatternIds: ["split-cta", "banner-cta", "form-benefits-sidebar"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/hardikpandya/stop-slop/main/references/structures.md"
  }
];
