import * as cheerio from "cheerio";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type AnimationSource = "reactbits";

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

type AnimationFramework = "react" | "next" | "css" | "framer-motion" | "gsap" | "three" | "unknown";

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
  source: AnimationSource;
  title: string;
  url: string;
  category: AnimationCategory;
  tags: string[];
  keywords?: string[];
  description?: string;
  dependencies?: string[];
  framework?: AnimationFramework;
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

type RobotsRule = {
  pattern: string;
  allow: boolean;
};

const START_URL = "https://reactbits.dev/get-started/index";
const SITEMAP_URL = "https://reactbits.dev/sitemap.xml";
const HOSTNAME = "reactbits.dev";
const SOURCE: AnimationSource = "reactbits";
const USER_AGENT = "DesignHumanizerBot/0.1 (+local MVP research)";
const USAGE_NOTE =
  "Use as animation inspiration only. Respect ReactBits license and do not copy code unless allowed.";

const maxPages = readPositiveIntEnv("MAX_REACTBITS_PAGES", 300);
const requestDelayMs = readPositiveIntEnv("REQUEST_DELAY_MS", 800);
const outputJsonPath = path.resolve("data/animation-references/reactbits.json");
const outputTsPath = path.resolve("extension/src/patterns/animationReferences.ts");

function readPositiveIntEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(rawUrl: string, baseUrl = START_URL): string | null {
  try {
    const url = new URL(rawUrl, baseUrl);

    if (url.hostname !== HOSTNAME) return null;
    if (url.protocol !== "https:") return null;

    url.hash = "";
    url.search = "";

    if (url.pathname.length > 1) {
      url.pathname = url.pathname.replace(/\/+$/, "");
    }

    return url.toString();
  } catch {
    return null;
  }
}

function isCrawlCandidate(url: string): boolean {
  const { pathname } = new URL(url);

  if (pathname.startsWith("/_next/")) return false;
  if (pathname.startsWith("/static/")) return false;
  if (pathname.startsWith("/api/")) return false;
  if (pathname.startsWith("/auth/")) return false;
  if (pathname.startsWith("/admin/")) return false;
  if (pathname.startsWith("/login")) return false;
  if (pathname.startsWith("/signup")) return false;
  if (pathname.includes("/pro/") || pathname.includes("/paid/")) return false;

  return true;
}

function isAnimationReferencePage(url: string): boolean {
  const { pathname } = new URL(url);
  const parts = pathname.split("/").filter(Boolean);
  const allowedNamespaces = new Set([
    "text-animations",
    "animations",
    "components",
    "backgrounds",
    "loaders",
    "cards",
    "buttons",
    "navigation"
  ]);

  return parts.length >= 2 && allowedNamespaces.has(parts[0]);
}

async function fetchText(url: string, robotsRules?: RobotsRule[]): Promise<string | null> {
  if (robotsRules && !isAllowedByRobots(url, robotsRules)) {
    console.log(`[skip:robots] ${url}`);
    return null;
  }

  try {
    console.log(`[fetch] ${url}`);
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,text/xml,text/plain;q=0.8,*/*;q=0.5"
      }
    });

    if (!response.ok) {
      console.log(`[skip:${response.status}] ${url}`);
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("text/xml") &&
      !contentType.includes("application/xml") &&
      !contentType.includes("text/plain")
    ) {
      console.log(`[skip:content-type] ${url} ${contentType}`);
      return null;
    }

    return response.text();
  } catch (error) {
    console.log(`[error] ${url} ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

async function loadRobotsRules(): Promise<RobotsRule[]> {
  const robotsText = await fetchText("https://reactbits.dev/robots.txt");

  if (!robotsText) {
    throw new Error("Could not load robots.txt; refusing to crawl.");
  }

  return parseRobotsRules(robotsText, USER_AGENT);
}

function parseRobotsRules(robotsText: string, userAgent: string): RobotsRule[] {
  const normalizedAgent = userAgent.toLowerCase();
  const rules: RobotsRule[] = [];
  let appliesToCurrentGroup = false;
  let sawDirectiveInGroup = false;

  for (const rawLine of robotsText.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    if (!line) {
      appliesToCurrentGroup = false;
      sawDirectiveInGroup = false;
      continue;
    }

    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();

    if (key === "user-agent") {
      if (sawDirectiveInGroup) {
        appliesToCurrentGroup = false;
        sawDirectiveInGroup = false;
      }

      const agent = value.toLowerCase();
      appliesToCurrentGroup = appliesToCurrentGroup || agent === "*" || normalizedAgent.includes(agent);
      continue;
    }

    if ((key === "allow" || key === "disallow") && appliesToCurrentGroup) {
      sawDirectiveInGroup = true;
      if (value) {
        rules.push({ pattern: value, allow: key === "allow" });
      }
    }
  }

  return rules;
}

function isAllowedByRobots(rawUrl: string, rules: RobotsRule[]): boolean {
  const { pathname } = new URL(rawUrl);
  const matchingRules = rules
    .filter((rule) => robotsPatternMatches(rule.pattern, pathname))
    .sort((a, b) => b.pattern.length - a.pattern.length);

  return matchingRules[0]?.allow ?? true;
}

function robotsPatternMatches(pattern: string, pathname: string): boolean {
  if (pattern === "/") return true;

  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\\\$$/, "$");

  return new RegExp(`^${escaped}`).test(pathname);
}

function discoverUrls(html: string, pageUrl: string): string[] {
  const $ = cheerio.load(html);
  const urls = new Set<string>();

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (!href) return;

    const normalized = normalizeUrl(href, pageUrl);
    if (normalized && isCrawlCandidate(normalized)) {
      urls.add(normalized);
    }
  });

  for (const match of html.matchAll(/https:\/\/reactbits\.dev\/[a-zA-Z0-9._~/-]+/g)) {
    const normalized = normalizeUrl(match[0], pageUrl);
    if (normalized && isCrawlCandidate(normalized)) {
      urls.add(normalized);
    }
  }

  for (const match of html.matchAll(/\/(?:text-animations|animations|components|backgrounds|loaders|cards|buttons|navigation)\/[a-zA-Z0-9._~-]+/g)) {
    const normalized = normalizeUrl(match[0], pageUrl);
    if (normalized && isCrawlCandidate(normalized)) {
      urls.add(normalized);
    }
  }

  return [...urls];
}

function discoverUrlsFromSitemap(xml: string): string[] {
  const urls = new Set<string>();

  for (const match of xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)) {
    const normalized = normalizeUrl(decodeXml(match[1]));
    if (normalized && isCrawlCandidate(normalized)) {
      urls.add(normalized);
    }
  }

  return [...urls];
}

function extractAnimationReference(html: string, pageUrl: string, scrapedAt: string): AnimationReference | null {
  if (!isAnimationReferencePage(pageUrl)) return null;

  const $ = cheerio.load(html);
  const readableText = cleanOptional($("body").text()) ?? "";
  const title = pickFirst(
    [
      text($("h1").first()),
      attr($, "meta[property='og:title']", "content"),
      attr($, "meta[name='twitter:title']", "content"),
      $("title").first().text(),
      slugToTitle(new URL(pageUrl).pathname.split("/").filter(Boolean).at(-1) ?? "")
    ].map(cleanTitle)
  ) ?? slugToTitle(new URL(pageUrl).pathname.split("/").filter(Boolean).at(-1) ?? "");

  if (!title) return null;

  const extractedDescription = cleanOptional(
    pickFirst([
      attr($, "meta[name='description']", "content"),
      attr($, "meta[property='og:description']", "content"),
      attr($, "meta[name='twitter:description']", "content"),
      firstMeaningfulParagraph($)
    ])
  );
  const description = isGenericReactBitsDescription(extractedDescription) ? undefined : extractedDescription;
  const reference = buildAnimationReference(pageUrl, title, description, scrapedAt);
  const dependencyHints = inferFrameworkAndDependencies(`${pageUrl} ${title} ${description ?? ""} ${readableText}`);

  return {
    ...reference,
    ...(dependencyHints.dependencies.length > 0 ? { dependencies: dependencyHints.dependencies } : {}),
    framework: dependencyHints.framework
  };
}

function extractAnimationReferenceFromUrl(pageUrl: string, scrapedAt: string): AnimationReference | null {
  if (!isAnimationReferencePage(pageUrl)) return null;

  const slug = new URL(pageUrl).pathname.split("/").filter(Boolean).at(-1);
  if (!slug) return null;

  return buildAnimationReference(pageUrl, slugToTitle(slug), undefined, scrapedAt);
}

function buildAnimationReference(
  pageUrl: string,
  title: string,
  description: string | undefined,
  scrapedAt: string
): AnimationReference {
  const tags = unique([...tagsFromPath(pageUrl), ...extractTagsFromText(`${pageUrl} ${title} ${description ?? ""}`)]).slice(0, 14);
  const category = inferAnimationCategory(pageUrl, title, description, tags);
  const dependencyHints = inferFrameworkAndDependencies(`${pageUrl} ${title} ${description ?? ""}`);
  const relatedSectionTypes = mapAnimationToSectionTypes(category, title, tags);
  const relatedPatternIds = mapAnimationToPatternIds(category, tags);

  return {
    id: makeAnimationId(pageUrl),
    source: SOURCE,
    title,
    url: pageUrl,
    category,
    tags,
    ...(description ? { description } : {}),
    ...(dependencyHints.dependencies.length > 0 ? { dependencies: dependencyHints.dependencies } : {}),
    framework: dependencyHints.framework,
    bestFor: bestForAnimation(category, relatedSectionTypes),
    avoidWhen: avoidWhenAnimation(category),
    relatedSectionTypes,
    relatedPatternIds,
    usageNote: USAGE_NOTE,
    scrapedAt
  };
}

function attr($: cheerio.CheerioAPI, selector: string, attribute: string): string | undefined {
  return cleanOptional($(selector).first().attr(attribute));
}

function text(element: { text(): string }): string | undefined {
  return cleanOptional(element.text());
}

function firstMeaningfulParagraph($: cheerio.CheerioAPI): string | undefined {
  for (const paragraph of $("p").toArray()) {
    const value = cleanOptional($(paragraph).text());
    if (value && value.length > 32 && !/copy|install|npm|import/i.test(value)) {
      return value;
    }
  }

  return undefined;
}

function extractKeywords($: cheerio.CheerioAPI): string[] {
  const content = attr($, "meta[name='keywords']", "content");
  if (!content) return [];

  return content
    .split(",")
    .map((keyword) => normalizeTag(keyword))
    .filter((keyword): keyword is string => Boolean(keyword));
}

function tagsFromPath(url: string): string[] {
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  const namespaceTags: Record<string, string[]> = {
    "text-animations": ["text", "animation"],
    animations: ["animation"],
    components: ["component"],
    backgrounds: ["background"],
    loaders: ["loader"],
    cards: ["card"],
    buttons: ["button"],
    navigation: ["navigation"]
  };

  return unique([...(namespaceTags[parts[0]] ?? []), ...parts.map((part) => normalizeTag(part)).filter(Boolean) as string[]]);
}

function extractTagsFromText(value: string): string[] {
  const normalized = value.toLowerCase();
  const tags: string[] = [];
  const candidates = [
    "text",
    "split",
    "text-reveal",
    "typewriter",
    "blur",
    "card",
    "tilt",
    "glare",
    "spotlight",
    "button",
    "magnetic",
    "click",
    "ripple",
    "scroll",
    "reveal",
    "parallax",
    "sticky",
    "background",
    "particles",
    "gradient",
    "noise",
    "grid",
    "aurora",
    "loader",
    "spinner",
    "loading",
    "skeleton",
    "transition",
    "page",
    "route",
    "hover",
    "cursor",
    "mouse",
    "follow",
    "image",
    "gallery",
    "media",
    "list",
    "stagger",
    "nav",
    "navbar",
    "menu",
    "hero",
    "testimonial",
    "review",
    "pricing",
    "form",
    "stats"
  ];

  for (const candidate of candidates) {
    if (normalized.includes(candidate)) {
      tags.push(candidate);
    }
  }

  return tags;
}

function inferAnimationCategory(
  url: string,
  title: string,
  description: string | undefined,
  tags: string[]
): AnimationCategory {
  const haystack = `${url} ${title} ${description ?? ""} ${tags.join(" ")}`.toLowerCase();

  if (url.includes("/backgrounds/")) return "background";
  if (/text|split|text-reveal|typewriter|blur/.test(haystack)) return "text";
  if (/card|tilt|glare|spotlight|border|surface|glass|bento/.test(haystack)) return "card";
  if (/button|magnetic|magnet|click|ripple|spark/.test(haystack)) return "button";
  if (/scroll|reveal|parallax|sticky/.test(haystack)) return "scroll";
  if (/background|particles|particle|gradient|noise|grid|aurora|ribbon|laser|magic-rings|meta-balls|cubes|metallic|shape|antigravity/.test(haystack)) return "background";
  if (/loader|spinner|loading|skeleton/.test(haystack)) return "loader";
  if (/transition|page|route|fade|animated-content/.test(haystack)) return "transition";
  if (/hover|mouseover/.test(haystack)) return "hover";
  if (/cursor|mouse|follow|crosshair/.test(haystack)) return "cursor";
  if (/image|gallery|media|orbit|poster|sticker/.test(haystack)) return "image";
  if (/list|stagger|stack|masonry|carousel|counter/.test(haystack)) return "list";
  if (/nav|navbar|navigation|menu|dock/.test(haystack)) return "navigation";

  return "other";
}

function inferFrameworkAndDependencies(textValue: string): { framework: AnimationFramework; dependencies: string[] } {
  const text = textValue.toLowerCase();
  const dependencies: string[] = [];
  let framework: AnimationFramework = "unknown";

  if (/framer-motion|motion\/react|\bmotion\b/.test(text)) {
    dependencies.push("framer-motion");
    framework = "framer-motion";
  }

  if (/\bgsap\b/.test(text)) {
    dependencies.push("gsap");
    framework = "gsap";
  }

  if (/three\.js|\bthree\b|react-three-fiber|\br3f\b/.test(text)) {
    dependencies.push("three");
    framework = "three";
  }

  if (/next\.js|\bnext\b/.test(text) && framework === "unknown") {
    framework = "next";
  }

  if (/css only|pure css|\bcss\b/.test(text) && framework === "unknown") {
    framework = "css";
  }

  if (/\breact\b|component/.test(text) && framework === "unknown") {
    framework = "react";
  }

  return { framework: framework === "unknown" ? "react" : framework, dependencies: unique(dependencies) };
}

function mapAnimationToSectionTypes(
  category: AnimationCategory,
  title: string,
  tags: string[]
): RelatedSectionType[] {
  const haystack = `${title} ${tags.join(" ")}`.toLowerCase();

  if (/testimonial|review/.test(haystack)) return ["testimonials"];
  if (/pricing/.test(haystack)) return ["pricing", "cards"];
  if (/stats|count/.test(haystack)) return ["stats", "dashboard"];

  switch (category) {
    case "text":
      return ["hero", "cta"];
    case "card":
    case "hover":
      return ["features", "cards", "pricing"];
    case "background":
      return ["hero", "cta"];
    case "loader":
      return ["dashboard", "form"];
    case "scroll":
      return ["hero", "features", "pricing", "testimonials"];
    case "button":
      return ["cta", "hero", "form"];
    case "list":
      return ["features", "cards", "stats"];
    case "image":
      return ["hero", "features", "cards"];
    case "navigation":
      return ["hero", "dashboard"];
    case "cursor":
    case "transition":
    case "other":
      return ["unknown"];
  }
}

function mapAnimationToPatternIds(category: AnimationCategory, tags: string[]): string[] {
  const haystack = `${category} ${tags.join(" ")}`.toLowerCase();

  if (/card|hover|tilt/.test(haystack)) {
    return ["bento-grid", "featured-side-stack", "center-highlight", "pricing-emphasis"];
  }

  if (/scroll|reveal|stagger/.test(haystack)) {
    return ["alternating-feature-rows", "workflow-feature-grid", "testimonial-wall"];
  }

  if (/text|hero/.test(haystack)) {
    return ["split-hero", "centered-hero", "hero-product-preview"];
  }

  if (/background/.test(haystack)) {
    return ["split-hero", "hero-product-preview", "banner-cta"];
  }

  if (/button/.test(haystack)) {
    return ["split-cta", "banner-cta", "card-cta"];
  }

  if (/stats|list|count/.test(haystack)) {
    return ["metric-bento", "stats-strip"];
  }

  return [];
}

function bestForAnimation(category: AnimationCategory, sections: RelatedSectionType[]): string {
  const sectionText = sections.filter((section) => section !== "unknown").join(", ");

  switch (category) {
    case "text":
      return "Hero headlines, CTA copy, and short emphasis text that benefits from a memorable reveal.";
    case "card":
    case "hover":
      return "Feature cards, pricing cards, and interactive tiles that need subtle hover feedback.";
    case "button":
      return "Primary CTAs and form actions where a small microinteraction can reinforce clickability.";
    case "scroll":
      return "Long landing sections where content should enter progressively as users scroll.";
    case "background":
      return "Hero and CTA sections that need motion atmosphere behind clear foreground content.";
    case "loader":
      return "Async dashboard, form, and generation states where users need visible progress feedback.";
    case "transition":
      return "State changes, route changes, or view swaps that need continuity.";
    case "cursor":
      return "Experimental marketing surfaces where pointer-following effects fit the brand.";
    case "image":
      return "Media galleries, product previews, and visual card layouts.";
    case "list":
      return "Feature lists, stats groups, and repeated cards that should appear as a coordinated set.";
    case "navigation":
      return "Menus, navbars, and dashboard navigation that need active-state feedback.";
    case "other":
      return sectionText ? `Selected ${sectionText} sections that need a specific animation reference.` : "Selected UI blocks that need a specific animation reference.";
  }
}

function avoidWhenAnimation(category: AnimationCategory): string {
  switch (category) {
    case "background":
    case "cursor":
      return "Avoid when readability, performance, or reduced-motion accessibility is more important than visual novelty.";
    case "loader":
      return "Avoid when the operation is instant or when skeleton/content placeholders would communicate progress better.";
    case "scroll":
      return "Avoid for dense dashboards or workflows where delayed content reduces scanning speed.";
    case "text":
      return "Avoid on long paragraphs, critical instructions, or pages where text must be immediately readable.";
    case "card":
    case "hover":
    case "button":
      return "Avoid when the surface already has many competing motion effects or must stay very utilitarian.";
    case "transition":
    case "image":
    case "list":
    case "navigation":
    case "other":
      return "Avoid when the animation distracts from the primary task or conflicts with reduced-motion preferences.";
  }
}

function cleanTitle(value: string | undefined): string {
  return cleanOptional(value)
    ?.replace(/\s*\|\s*React Bits.*$/i, "")
    .replace(/\s*-\s*React Bits.*$/i, "")
    .replace(/^React Bits\s*/i, "")
    .replace(/^[-|]\s*Animated UI Components For React$/i, "")
    .trim() ?? "";
}

function isGenericReactBitsDescription(value: string | undefined): boolean {
  return Boolean(value?.includes("open source collection of high quality, animated, interactive"));
}

function cleanOptional(value: string | undefined): string | undefined {
  const cleaned = value?.replace(/\s+/g, " ").trim();
  if (!cleaned) return undefined;
  if (cleaned === "null" || cleaned === "undefined") return undefined;
  return cleaned;
}

function normalizeTag(value: string): string | undefined {
  return cleanOptional(value)
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function pickFirst(values: Array<string | undefined>): string | undefined {
  return values.find((value) => cleanOptional(value));
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function makeAnimationId(url: string): string {
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  return `reactbits-${parts.join("-")}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'");
}

function generateTypeScript(references: AnimationReference[]): string {
  return `export type AnimationSource = "reactbits";

export type AnimationCategory =
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

export type AnimationReference = {
  id: string;
  source: AnimationSource;
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
  relatedSectionTypes: Array<
    "hero" | "features" | "cards" | "pricing" | "cta" | "stats" | "form" | "dashboard" | "testimonials" | "unknown"
  >;
  relatedPatternIds: string[];
  usageNote: string;
  scrapedAt: string;
};

export const animationReferences: AnimationReference[] = ${JSON.stringify(references, null, 2)};
`;
}

async function main(): Promise<void> {
  console.log(`Starting ReactBits metadata crawl with maxPages=${maxPages}, delay=${requestDelayMs}ms`);

  const robotsRules = await loadRobotsRules();
  const queue = [START_URL];
  const queued = new Set(queue);
  const visited = new Set<string>();
  const references = new Map<string, AnimationReference>();
  const scrapedAt = new Date().toISOString();

  const sitemapXml = await fetchText(SITEMAP_URL, robotsRules);
  await sleep(requestDelayMs);

  if (sitemapXml) {
    for (const sitemapUrl of discoverUrlsFromSitemap(sitemapXml)) {
      if (!queued.has(sitemapUrl) && queued.size < maxPages * 4) {
        queued.add(sitemapUrl);
        queue.push(sitemapUrl);
      }

      const reference = extractAnimationReferenceFromUrl(sitemapUrl, scrapedAt);
      if (reference) {
        references.set(reference.id, reference);
        console.log(`[ref:sitemap] ${reference.id} ${reference.title}`);
      }
    }
  }

  while (queue.length > 0 && visited.size < maxPages) {
    const nextUrl = queue.shift();
    if (!nextUrl || visited.has(nextUrl)) continue;

    visited.add(nextUrl);

    if (!isCrawlCandidate(nextUrl)) {
      continue;
    }

    const html = await fetchText(nextUrl, robotsRules);
    await sleep(requestDelayMs);

    if (!html) continue;

    for (const discoveredUrl of discoverUrls(html, nextUrl)) {
      if (!queued.has(discoveredUrl) && !visited.has(discoveredUrl) && queued.size < maxPages * 4) {
        queued.add(discoveredUrl);
        queue.push(discoveredUrl);
      }
    }

    const reference = extractAnimationReference(html, nextUrl, scrapedAt);
    if (reference) {
      references.set(reference.id, reference);
      console.log(`[ref] ${reference.id} ${reference.title}`);
    }
  }

  const sortedReferences = [...references.values()].sort((a, b) => a.id.localeCompare(b.id));

  await mkdir(path.dirname(outputJsonPath), { recursive: true });
  await mkdir(path.dirname(outputTsPath), { recursive: true });
  await writeFile(outputJsonPath, `${JSON.stringify(sortedReferences, null, 2)}\n`, "utf8");
  await writeFile(outputTsPath, generateTypeScript(sortedReferences), "utf8");

  console.log(`Saved ${sortedReferences.length} references to ${outputJsonPath}`);
  console.log(`Generated ${outputTsPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
