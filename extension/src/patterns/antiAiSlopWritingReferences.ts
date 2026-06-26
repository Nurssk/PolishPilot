import type { TemplateReference } from "./templateReferences";

const SCRAPED_AT = "2026-06-26T00:00:00.000Z";
const USAGE_NOTE =
  "Use as high-level copywriting guidance only. Preserve the user's product facts, voice, and context; do not copy exact examples or invent proof.";

const SKILL_URL =
  "https://github.com/jalaalrd/anti-ai-slop-writing/blob/main/skills/anti-ai-slop-writing/SKILL.md";
const BANNED_WORDS_URL =
  "https://github.com/jalaalrd/anti-ai-slop-writing/blob/main/skills/anti-ai-slop-writing/references/banned-words.md";

export const antiAiSlopWritingReferences: TemplateReference[] = [
  {
    id: "anti-ai-slop-copywriting-direction",
    source: "anti-ai-slop-writing",
    title: "Anti-AI-Slop Copywriting Direction",
    url: SKILL_URL,
    category: "features",
    tags: ["copywriting", "anti-slop", "voice", "specificity", "human-writing"],
    keywords: [
      "copywriting",
      "fake-premium-copy",
      "formulaic-ai-copy",
      "ai-slop-phrase-tells",
      "ai-punctuation-tells",
      "generic-copy",
      "specificity"
    ],
    description:
      "Writing direction for replacing generated-sounding product copy with specific, grounded language and natural sentence rhythm.",
    author: "jalaalrd/anti-ai-slop-writing",
    relatedPatternIds: ["editorial-feature-stack", "resource-card-grid", "split-cta"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/jalaalrd/anti-ai-slop-writing/main/skills/anti-ai-slop-writing/SKILL.md"
  },
  {
    id: "anti-ai-slop-banned-phrase-checklist",
    source: "anti-ai-slop-writing",
    title: "AI-Slop Phrase Checklist",
    url: BANNED_WORDS_URL,
    category: "cards",
    tags: ["copywriting", "phrases", "punctuation", "openers", "anti-slop"],
    keywords: [
      "ai-slop-phrase-tells",
      "ai-punctuation-tells",
      "banned-phrases",
      "sentence-openers",
      "em-dash",
      "punctuation"
    ],
    description:
      "Checklist direction for removing common generated phrases, assistant-style openers, and punctuation habits from visible copy.",
    author: "jalaalrd/anti-ai-slop-writing",
    relatedPatternIds: ["editorial-feature-stack", "split-cta", "compact-lead-form"],
    usageNote: USAGE_NOTE,
    scrapedAt: SCRAPED_AT,
    urlStatus: "ok",
    checkedAt: SCRAPED_AT,
    fallbackUrl:
      "https://raw.githubusercontent.com/jalaalrd/anti-ai-slop-writing/main/skills/anti-ai-slop-writing/references/banned-words.md"
  }
];
