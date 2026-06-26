import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright";

type AnimationCategory =
  | "text"
  | "card"
  | "button"
  | "scroll"
  | "background"
  | "loader"
  | "transition"
  | "hover"
  | "cursor"
  | "image"
  | "list"
  | "navigation"
  | "other";

type TemplateCategory =
  | "hero"
  | "features"
  | "pricing"
  | "cta"
  | "testimonials"
  | "forms"
  | "cards"
  | "buttons"
  | "dashboard"
  | "navigation"
  | "footer"
  | "auth"
  | "settings"
  | "other";

type RelatedSectionType =
  | "hero"
  | "features"
  | "cards"
  | "pricing"
  | "cta"
  | "stats"
  | "form"
  | "dashboard"
  | "testimonials"
  | "unknown";

type AnimationReference = {
  id: string;
  source: "watermelon-ui";
  title: string;
  url: string;
  category: AnimationCategory;
  tags: string[];
  keywords?: string[];
  description?: string;
  dependencies?: string[];
  framework?: "react" | "next" | "css" | "framer-motion" | "gsap" | "three" | "unknown";
  bestFor: string;
  avoidWhen: string;
  solvesProblems?: Array<
    | "flat_layout"
    | "weak_hierarchy"
    | "too_repetitive"
    | "cta_not_clear"
    | "cards_too_equal"
    | "spacing_issue"
    | "too_text_heavy"
    | "no_visual_rhythm"
    | "weak_trust_signals"
    | "missing_microinteraction"
    | "unknown"
  >;
  relatedSectionTypes: RelatedSectionType[];
  relatedPatternIds: string[];
  usageNote: string;
  scrapedAt: string;
};

type TemplateReference = {
  id: string;
  source: "watermelon-ui";
  title: string;
  url: string;
  category: TemplateCategory;
  tags: string[];
  keywords?: string[];
  description?: string;
  author?: string;
  relatedPatternIds: string[];
  usageNote: string;
  scrapedAt: string;
  urlStatus?: "ok" | "broken" | "unknown";
  checkedAt?: string;
  fallbackUrl?: string;
};

const HOST = "https://ui.watermelon.sh";
const START_URL = `${HOST}/animated-components/category/`;
const ANIMATED_ROOT_URL = `${HOST}/animated-components`;
const BLOCKS_ROOT_URL = `${HOST}/blocks`;
const USER_AGENT = "DesignHumanizerBot/0.1 (+local MVP research)";
const SCRAPED_AT = new Date().toISOString();
const ANIMATION_JSON_PATH = path.resolve("data/animation-references/watermelon.json");
const TEMPLATE_JSON_PATH = path.resolve("data/template-references/watermelon.json");
const ANIMATION_TS_PATH = path.resolve("extension/src/patterns/watermelonAnimationReferences.ts");
const TEMPLATE_TS_PATH = path.resolve("extension/src/patterns/watermelonTemplateReferences.ts");
const USAGE_NOTE =
  "Use as high-level Watermelon UI inspiration only. Do not copy exact code, text, assets, logos, or branding unless the project's license allows it.";

const maxAnimatedCategories = readPositiveIntEnv("MAX_WATERMELON_ANIMATED_CATEGORIES", 80);
const maxBlockCategories = readPositiveIntEnv("MAX_WATERMELON_BLOCK_CATEGORIES", 80);
const maxItemsPerCategory = readPositiveIntEnv("MAX_WATERMELON_ITEMS_PER_CATEGORY", 120);
const requestDelayMs = readPositiveIntEnv("REQUEST_DELAY_MS", 350);

function readPositiveIntEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  await assertRobotsAllowsScrape();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    viewport: { width: 1440, height: 1600 }
  });
  const page = await context.newPage();

  try {
    const animatedCategories = (await scrapeSidebarLinks(page, START_URL, "/animated-components/category/"))
      .slice(0, maxAnimatedCategories);
    const blockCategories = (await scrapeSidebarLinks(page, BLOCKS_ROOT_URL, "/blocks/"))
      .slice(0, maxBlockCategories);

    console.log(`[watermelon] animated categories=${animatedCategories.length}`);
    console.log(`[watermelon] block categories=${blockCategories.length}`);

    const animations = new Map<string, AnimationReference>();
    for (const category of animatedCategories) {
      const items = await scrapeAnimatedCategory(page, category);
      for (const item of items) animations.set(item.id, item);
      await sleep(requestDelayMs);
    }

    const templates = new Map<string, TemplateReference>();
    for (const category of blockCategories) {
      const items = await scrapeBlockCategory(page, category);
      for (const item of items) templates.set(item.id, item);
      await sleep(requestDelayMs);
    }

    const sortedAnimations = [...animations.values()].sort((a, b) => a.id.localeCompare(b.id));
    const sortedTemplates = [...templates.values()].sort((a, b) => a.id.localeCompare(b.id));

    await mkdir(path.dirname(ANIMATION_JSON_PATH), { recursive: true });
    await mkdir(path.dirname(TEMPLATE_JSON_PATH), { recursive: true });
    await writeFile(ANIMATION_JSON_PATH, `${JSON.stringify(sortedAnimations, null, 2)}\n`);
    await writeFile(TEMPLATE_JSON_PATH, `${JSON.stringify(sortedTemplates, null, 2)}\n`);
    await writeFile(ANIMATION_TS_PATH, generateAnimationTypeScript(sortedAnimations));
    await writeFile(TEMPLATE_TS_PATH, generateTemplateTypeScript(sortedTemplates));

    console.log(`[watermelon] saved animations=${sortedAnimations.length} to ${ANIMATION_JSON_PATH}`);
    console.log(`[watermelon] saved templates=${sortedTemplates.length} to ${TEMPLATE_JSON_PATH}`);
  } finally {
    await browser.close();
  }
}

async function assertRobotsAllowsScrape() {
  const response = await fetch(`${HOST}/robots.txt`, {
    headers: { "User-Agent": USER_AGENT }
  });
  if (!response.ok) {
    throw new Error(`Could not load robots.txt: ${response.status}`);
  }

  const robots = await response.text();
  if (/User-agent:\s*\*\s+Disallow:\s*\/\s*$/im.test(robots)) {
    throw new Error("robots.txt disallows crawling / for generic user agents.");
  }
}

async function scrapeSidebarLinks(page: Page, url: string, pathPrefix: string) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });

  const links = await page.locator("a").evaluateAll((anchors, prefix) => {
    const seen = new Set<string>();
    return anchors
      .map((anchor) => ({
        title: anchor.textContent?.trim() ?? "",
        url: (anchor as HTMLAnchorElement).href
      }))
      .filter((link) => {
        const parsed = new URL(link.url);
        if (parsed.origin !== "https://ui.watermelon.sh") return false;
        if (!parsed.pathname.startsWith(prefix as string)) return false;
        if (parsed.pathname === prefix || parsed.pathname === prefix.replace(/\/$/, "")) return false;
        const key = parsed.toString().toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, pathPrefix);

  return links.map((link) => ({
    title: cleanText(link.title).replace(/\d+\s*(blocks?|components?)$/i, ""),
    url: normalizeWatermelonUrl(link.url)
  }));
}

async function scrapeAnimatedCategory(
  page: Page,
  categoryLink: { title: string; url: string }
): Promise<AnimationReference[]> {
  await page.goto(categoryLink.url, { waitUntil: "networkidle", timeout: 60_000 });
  await scrollToLoadAll(page);

  const cards = await page.locator('[role="button"]').evaluateAll((elements) =>
    elements
      .map((element, index) => {
        const spans = [...element.querySelectorAll("span")]
          .map((span) => span.textContent?.trim() ?? "")
          .filter(Boolean);
        const name = spans[0] ?? "";
        const category = spans[1] ?? "";
        return { name, category, index };
      })
      .filter((item) => item.name && item.category)
  );

  const categorySlug = slugFromUrl(categoryLink.url);
  const output: AnimationReference[] = [];

  for (const card of cards.slice(0, maxItemsPerCategory)) {
    const locator = page.locator('[role="button"]').filter({ hasText: card.name }).first();
    const modal = await readAnimatedModal(page, locator);
    const registryUrl =
      modal.registryUrl ?? `https://registry.watermelon.sh/r/${slugify(card.name)}.json`;
    const title = cleanText(modal.title || card.name);
    const itemCategory = cleanText(card.category || categoryLink.title || categorySlug);
    const mappedCategory = animationCategoryFor(itemCategory, title, modal.description);
    const sectionTypes = relatedSectionsForWatermelon(itemCategory, title, modal.description);

    output.push({
      id: `watermelon-${slugify(title)}`,
      source: "watermelon-ui",
      title,
      url: registryUrl,
      category: mappedCategory,
      tags: uniqueStrings([
        "watermelon-ui",
        "animated",
        categorySlug,
        slugify(itemCategory),
        ...keywordsFromText(`${title} ${itemCategory} ${modal.description}`).slice(0, 5)
      ], 8),
      keywords: uniqueStrings(keywordsFromText(`${title} ${itemCategory} ${modal.description}`), 12),
      description: modal.description || `Animated ${itemCategory.toLowerCase()} component from Watermelon UI.`,
      dependencies: modal.dependencies,
      framework: frameworkForDependencies(modal.dependencies),
      bestFor: bestForAnimation(mappedCategory, sectionTypes, itemCategory),
      avoidWhen: avoidWhenForAnimation(mappedCategory),
      solvesProblems: solvesProblemsForAnimation(mappedCategory),
      relatedSectionTypes: sectionTypes,
      relatedPatternIds: relatedPatternIdsForSections(sectionTypes),
      usageNote: USAGE_NOTE,
      scrapedAt: SCRAPED_AT
    });
  }

  console.log(`[animated] ${categorySlug} ${output.length}`);
  return output;
}

async function readAnimatedModal(page: Page, locator: ReturnType<Page["locator"]>) {
  await locator.click({ timeout: 10_000 });
  const dialog = page.locator('[data-slot="dialog-content"][role="dialog"]').first();
  await dialog.waitFor({ state: "visible", timeout: 10_000 });
  const dialogText = await dialog.innerText();
  const lines = dialogText.split(/\n+/).map(cleanText).filter(Boolean);
  const registryUrl = dialogText.match(/https:\/\/registry\.watermelon\.sh\/r\/[^\s]+?\.json/)?.[0];
  const title = lines[0] ?? "";
  const description =
    lines.find((line, index) =>
      index > 0 &&
      line.length > 24 &&
      !/^components$/i.test(line) &&
      !/^dependencies$/i.test(line) &&
      !/^installation$/i.test(line) &&
      !/^copy for ai$/i.test(line)
    ) ?? "";
  const dependencies = sliceBetween(lines, "Dependencies", ["Inspired by", "Copy for AI", "Installation"])
    .filter((line) => !/^\d+$/.test(line))
    .slice(0, 8);

  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);

  return {
    title,
    description,
    dependencies,
    registryUrl
  };
}

async function scrapeBlockCategory(
  page: Page,
  categoryLink: { title: string; url: string }
): Promise<TemplateReference[]> {
  await page.goto(categoryLink.url, { waitUntil: "networkidle", timeout: 60_000 });
  await scrollToLoadAll(page);

  const categorySlug = slugFromUrl(categoryLink.url);
  const records = await page.locator('[role="button"]').evaluateAll((elements) =>
    elements
      .map((element) => {
        const text = (element as HTMLElement).innerText || element.textContent || "";
        const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
        const registryUrl = text.match(/https:\/\/registry\.watermelon\.sh\/r\/[^\s]+?\.json/)?.[0];
        const title = lines[0] ?? "";
        return { title, registryUrl };
      })
      .filter((item) => item.title && item.registryUrl)
  );

  const output = records.slice(0, maxItemsPerCategory).map((record): TemplateReference => {
    const category = templateCategoryFor(categorySlug, record.title);
    return {
      id: `watermelon-${slugify(record.title)}`,
      source: "watermelon-ui",
      title: record.title,
      url: record.registryUrl,
      category,
      tags: uniqueStrings([
        "watermelon-ui",
        "block",
        categorySlug,
        category,
        ...keywordsFromText(record.title).slice(0, 4)
      ], 8),
      keywords: uniqueStrings(keywordsFromText(`${record.title} ${categorySlug} ${category}`), 12),
      description: `Watermelon UI ${categorySlug} block reference for ${humanizeSlug(categorySlug)} sections.`,
      author: "Watermelon UI",
      relatedPatternIds: relatedPatternIdsForTemplateCategory(category),
      usageNote: USAGE_NOTE,
      scrapedAt: SCRAPED_AT,
      urlStatus: "ok",
      checkedAt: SCRAPED_AT,
      fallbackUrl: categoryLink.url
    };
  });

  console.log(`[blocks] ${categorySlug} ${output.length}`);
  return output;
}

async function scrollToLoadAll(page: Page) {
  let previousCount = -1;
  for (let i = 0; i < 12; i += 1) {
    await page.evaluate(() => {
      const candidates = [...document.querySelectorAll("*")]
        .filter((element) => element.scrollHeight > element.clientHeight + 100)
        .sort(
          (a, b) =>
            b.scrollHeight - b.clientHeight - (a.scrollHeight - a.clientHeight)
        );
      const scroller = candidates[0] ?? document.documentElement;
      scroller.scrollTop = scroller.scrollHeight;
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await page.waitForTimeout(450);

    const count = await page.locator('[role="button"]').count();
    if (count === previousCount) break;
    previousCount = count;
  }

  await page.evaluate(() => {
    const candidates = [...document.querySelectorAll("*")]
      .filter((element) => element.scrollHeight > element.clientHeight + 100)
      .sort(
        (a, b) =>
          b.scrollHeight - b.clientHeight - (a.scrollHeight - a.clientHeight)
      );
    const scroller = candidates[0] ?? document.documentElement;
    scroller.scrollTop = 0;
    window.scrollTo(0, 0);
  });
}

function sliceBetween(lines: string[], start: string, endLabels: string[]) {
  const startIndex = lines.findIndex((line) => line.toLowerCase() === start.toLowerCase());
  if (startIndex === -1) return [];

  const endIndex = lines.findIndex(
    (line, index) =>
      index > startIndex &&
      endLabels.some((label) => line.toLowerCase() === label.toLowerCase())
  );

  return lines.slice(startIndex + 1, endIndex === -1 ? undefined : endIndex);
}

function animationCategoryFor(category: string, title: string, description: string): AnimationCategory {
  const haystack = `${category} ${title} ${description}`.toLowerCase();
  if (/button|action|toggle/.test(haystack)) return "button";
  if (/card|pricing|widget/.test(haystack)) return "card";
  if (/list|accordion|disclosure/.test(haystack)) return "list";
  if (/navigation|pagination|tabs/.test(haystack)) return "navigation";
  if (/slider|carousel|scroll/.test(haystack)) return "scroll";
  if (/image|media|map/.test(haystack)) return "image";
  if (/input|form|scheduler|dropdown|popover|tooltip|dialog/.test(haystack)) return "transition";
  if (/micro|hover|interaction|choice|chip/.test(haystack)) return "hover";
  if (/marketing|background/.test(haystack)) return "background";
  return "other";
}

function relatedSectionsForWatermelon(category: string, title: string, description: string): RelatedSectionType[] {
  const haystack = `${category} ${title} ${description}`.toLowerCase();
  const sections: RelatedSectionType[] = [];
  if (/hero|marketing/.test(haystack)) sections.push("hero");
  if (/feature|accordion|disclosure|list|card|carousel/.test(haystack)) sections.push("features", "cards");
  if (/pricing|plan|checkout/.test(haystack)) sections.push("pricing");
  if (/cta|action|button|subscribe|newsletter/.test(haystack)) sections.push("cta");
  if (/stat|metric|dashboard|widget/.test(haystack)) sections.push("stats", "dashboard");
  if (/form|input|auth|login|signup|scheduler/.test(haystack)) sections.push("form");
  if (/testimonial|review/.test(haystack)) sections.push("testimonials");
  if (/navigation|pagination|tabs|dropdown|tooltip|popover/.test(haystack)) sections.push("dashboard");
  return uniqueStrings(sections.length ? sections : ["unknown"], 6) as RelatedSectionType[];
}

function templateCategoryFor(slug: string, title: string): TemplateCategory {
  const haystack = `${slug} ${title}`.toLowerCase();
  if (/hero/.test(haystack)) return "hero";
  if (/feature|integrations|faq/.test(haystack)) return "features";
  if (/pricing/.test(haystack)) return "pricing";
  if (/cta|announcement|newsletter|notification/.test(haystack)) return "cta";
  if (/testimonial|team/.test(haystack)) return "testimonials";
  if (/form|contact|file-upload/.test(haystack)) return "forms";
  if (/auth/.test(haystack)) return "auth";
  if (/footer/.test(haystack)) return "footer";
  if (/navigation/.test(haystack)) return "navigation";
  if (/stats|widget/.test(haystack)) return "dashboard";
  if (/button/.test(haystack)) return "buttons";
  return "other";
}

function bestForAnimation(category: AnimationCategory, sections: RelatedSectionType[], sourceCategory: string) {
  if (category === "button" || sections.includes("cta")) {
    return "Calls to action, confirmations, and interactive controls that need clearer feedback.";
  }
  if (category === "card") {
    return "Card groups, pricing plans, and repeated content that need hover or reveal treatment.";
  }
  if (category === "navigation") {
    return "Navigation, tabs, pagination, and wayfinding controls that need smoother state changes.";
  }
  if (category === "transition") {
    return "Dialogs, popovers, inputs, and stateful controls that need polished entrance/exit motion.";
  }
  if (category === "background") {
    return "Hero, marketing, and CTA sections where subtle ambient motion supports the message.";
  }
  return `Selected ${sourceCategory.toLowerCase()} UI that needs a specific Watermelon motion reference.`;
}

function avoidWhenForAnimation(category: AnimationCategory) {
  if (category === "background") {
    return "Avoid when readability, performance, or reduced-motion accessibility is more important than atmosphere.";
  }
  if (category === "hover" || category === "button") {
    return "Avoid when the interaction is critical, disabled, or would become less predictable with motion.";
  }
  return "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.";
}

function solvesProblemsForAnimation(category: AnimationCategory): AnimationReference["solvesProblems"] {
  if (category === "button" || category === "hover" || category === "transition") {
    return ["missing_microinteraction", "cta_not_clear"];
  }
  if (category === "card") {
    return ["cards_too_equal", "no_visual_rhythm", "flat_layout"];
  }
  if (category === "text") {
    return ["weak_hierarchy"];
  }
  return ["unknown"];
}

function relatedPatternIdsForSections(sections: RelatedSectionType[]) {
  const ids: string[] = [];
  if (sections.includes("hero")) ids.push("hero-product-preview", "split-hero");
  if (sections.includes("features") || sections.includes("cards")) ids.push("feature-bento", "feature-tabs");
  if (sections.includes("pricing")) ids.push("pricing-emphasis", "pricing-toggle");
  if (sections.includes("cta")) ids.push("banner-cta", "split-cta");
  if (sections.includes("form")) ids.push("form-benefits-sidebar", "compact-lead-form");
  if (sections.includes("dashboard") || sections.includes("stats")) ids.push("metric-bento", "dashboard-summary-rail");
  if (sections.includes("testimonials")) ids.push("testimonial-wall", "featured-testimonial");
  return uniqueStrings(ids, 6);
}

function relatedPatternIdsForTemplateCategory(category: TemplateCategory) {
  switch (category) {
    case "hero":
      return ["hero-product-preview", "split-hero", "hero-trust-bar"];
    case "features":
      return ["feature-bento", "feature-tabs", "icon-feature-grid"];
    case "pricing":
      return ["pricing-emphasis", "pricing-toggle", "plan-comparison-table"];
    case "cta":
      return ["banner-cta", "split-cta", "card-cta"];
    case "testimonials":
      return ["testimonial-wall", "featured-testimonial"];
    case "forms":
    case "auth":
      return ["form-benefits-sidebar", "compact-lead-form", "split-auth-proof"];
    case "navigation":
      return ["navigation-cleanup"];
    case "footer":
      return ["footer-columns"];
    case "dashboard":
      return ["metric-bento", "dashboard-summary-rail"];
    default:
      return [];
  }
}

function frameworkForDependencies(dependencies: string[]): AnimationReference["framework"] {
  const text = dependencies.join(" ").toLowerCase();
  if (/motion\/react|framer-motion/.test(text)) return "framer-motion";
  if (/three|webgl/.test(text)) return "three";
  if (/gsap/.test(text)) return "gsap";
  if (/react/.test(text)) return "react";
  return "react";
}

function keywordsFromText(text: string) {
  return uniqueStrings(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]+/g, " ")
      .split(/\s+/)
      .map((word) => word.trim())
      .filter((word) => word.length >= 3 && !STOP_WORDS.has(word)),
    16
  );
}

function normalizeWatermelonUrl(url: string) {
  const parsed = new URL(url);
  parsed.hash = "";
  parsed.search = "";
  return parsed.toString().replace(/\/$/, "");
}

function slugFromUrl(url: string) {
  return new URL(url).pathname.split("/").filter(Boolean).pop()?.toLowerCase() ?? "unknown";
}

function humanizeSlug(slug: string) {
  return slug.replace(/[-_]+/g, " ");
}

function slugify(value: string) {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function uniqueStrings<T extends string>(values: T[], limit: number): T[] {
  const seen = new Set<string>();
  const output: T[] = [];
  for (const value of values) {
    const normalized = cleanText(value);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    output.push(normalized as T);
    if (output.length >= limit) break;
  }
  return output;
}

function generateAnimationTypeScript(references: AnimationReference[]) {
  return `// Generated by scripts/scrape-watermelon.ts. Do not edit by hand.\nimport type { AnimationReference } from \"./animationReferences\";\n\nexport const watermelonAnimationReferences: AnimationReference[] = ${JSON.stringify(references, null, 2)};\n`;
}

function generateTemplateTypeScript(references: TemplateReference[]) {
  return `// Generated by scripts/scrape-watermelon.ts. Do not edit by hand.\nimport type { TemplateReference } from \"./templateReferences\";\n\nexport const watermelonTemplateReferences: TemplateReference[] = ${JSON.stringify(references, null, 2)};\n`;
}

const STOP_WORDS = new Set([
  "and",
  "the",
  "for",
  "with",
  "that",
  "this",
  "from",
  "into",
  "your",
  "you",
  "are",
  "our",
  "component",
  "components",
  "animated",
  "watermelon"
]);

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
