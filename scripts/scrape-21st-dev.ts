import * as cheerio from "cheerio";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type TemplateSource = "21st.dev";

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

type TemplateReference = {
  id: string;
  source: TemplateSource;
  title: string;
  url: string;
  category: TemplateCategory;
  tags: string[];
  keywords?: string[];
  description?: string;
  author?: string;
  previewImageUrl?: string;
  relatedPatternIds: string[];
  usageNote: string;
  scrapedAt: string;
  urlStatus?: "ok" | "broken" | "unknown";
  checkedAt?: string;
  fallbackUrl?: string;
};

type RobotsRule = {
  pattern: string;
  allow: boolean;
};

const START_URL = "https://21st.dev/community/";
const HOSTNAME = "21st.dev";
const SOURCE: TemplateSource = "21st.dev";
const USER_AGENT = "DesignHumanizerBot/0.1 (+local MVP research)";
const USAGE_NOTE =
  "Use as high-level visual inspiration only. Do not copy exact code, text, assets, logos, or branding.";
const FALLBACK_URL = "https://21st.dev/community/components";

const maxPages = readPositiveIntEnv("MAX_21ST_PAGES", 300);
const requestDelayMs = readPositiveIntEnv("REQUEST_DELAY_MS", 800);
const outputJsonPath = path.resolve("data/template-references/21st-dev.json");
const outputTsPath = path.resolve("extension/src/patterns/templateReferences.ts");

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

  if (pathname.startsWith("/api/")) return false;
  if (pathname.startsWith("/auth/")) return false;
  if (pathname.startsWith("/admin/")) return false;
  if (pathname.startsWith("/preview/")) return false;
  if (pathname.startsWith("/community/feed/")) return false;
  if (pathname.startsWith("/community/bookmarks/")) return false;

  return pathname === "/community/components" || pathname.startsWith("/community/components/") || pathname.startsWith("/s/");
}

function isTemplatePage(url: string): boolean {
  const { pathname } = new URL(url);
  const parts = pathname.split("/").filter(Boolean);
  const nonTemplateNamespaces = new Set(["s", "week", "featured", "newest", "popular"]);

  return (
    parts[0] === "community" &&
    parts[1] === "components" &&
    parts.length >= 4 &&
    !nonTemplateNamespaces.has(parts[2])
  );
}

function canonicalTemplateUrl(url: string): string {
  const parsed = new URL(url);
  const parts = parsed.pathname.split("/").filter(Boolean);

  if (parts[0] === "community" && parts[1] === "components" && parts.length > 4 && parts[4] === "default") {
    parsed.pathname = `/${parts.slice(0, 4).join("/")}`;
  }

  return parsed.toString().replace(/\/$/, "");
}

function fallbackUrlForReference(category?: TemplateCategory): string {
  if (category && category !== "other") {
    return `https://21st.dev/community/components/s/${encodeURIComponent(category)}`;
  }

  return FALLBACK_URL;
}

async function checkReferenceUrl(url: string, robotsRules?: RobotsRule[]) {
  const normalized = normalizeUrl(url);

  if (!normalized || !isTemplatePage(normalized)) {
    return {
      url: normalized ?? url,
      ok: false,
      statusCode: 0,
      status: "broken" as const,
      checkedAt: new Date().toISOString()
    };
  }

  if (robotsRules && !isAllowedByRobots(normalized, robotsRules)) {
    return {
      url: normalized,
      ok: false,
      statusCode: 0,
      status: "broken" as const,
      checkedAt: new Date().toISOString()
    };
  }

  try {
    const response = await fetch(normalized, {
      redirect: "follow",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.8,*/*;q=0.5"
      }
    });
    const finalUrl = normalizeUrl(response.url) ?? normalized;

    return {
      url: finalUrl,
      ok: response.status === 200,
      statusCode: response.status,
      status: response.status === 200 ? ("ok" as const) : ("broken" as const),
      checkedAt: new Date().toISOString()
    };
  } catch (error) {
    console.log(`[skip:link-error] ${normalized} ${error instanceof Error ? error.message : String(error)}`);
    return {
      url: normalized,
      ok: false,
      statusCode: 0,
      status: "broken" as const,
      checkedAt: new Date().toISOString()
    };
  }
}

async function validateReferenceForStorage(reference: TemplateReference, robotsRules: RobotsRule[]) {
  const health = await checkReferenceUrl(reference.url, robotsRules);

  if (!health.ok) {
    console.log(`[skip:broken-reference] ${reference.url} status=${health.statusCode}`);
    return null;
  }

  return {
    ...reference,
    url: health.url,
    urlStatus: "ok" as const,
    checkedAt: health.checkedAt,
    fallbackUrl: fallbackUrlForReference(reference.category)
  };
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
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.8,*/*;q=0.5"
      }
    });

    if (!response.ok) {
      console.log(`[skip:${response.status}] ${url}`);
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
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
  const robotsUrl = "https://21st.dev/robots.txt";
  const text = await fetchText(robotsUrl);

  if (!text) {
    throw new Error("Could not load robots.txt; refusing to crawl.");
  }

  return parseRobotsRules(text, USER_AGENT);
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

  const relaxedHtml = relaxEscapedNextData(html);
  const componentUrlPattern = /https:\/\/21st\.dev\/community\/components\/[a-zA-Z0-9._~-]+\/[a-zA-Z0-9._~-]+(?:\/[a-zA-Z0-9._~-]+)?/g;
  for (const match of relaxedHtml.matchAll(componentUrlPattern)) {
    const normalized = normalizeUrl(match[0], pageUrl);
    if (normalized && isCrawlCandidate(normalized)) {
      urls.add(normalized);
    }
  }

  const relativeComponentPattern = /\/community\/components\/[a-zA-Z0-9._~-]+\/[a-zA-Z0-9._~-]+(?:\/[a-zA-Z0-9._~-]+)?/g;
  for (const match of relaxedHtml.matchAll(relativeComponentPattern)) {
    const normalized = normalizeUrl(match[0], pageUrl);
    if (normalized && isCrawlCandidate(normalized)) {
      urls.add(normalized);
    }
  }

  return [...urls];
}

function extractEmbeddedTemplateReferences(html: string, pageUrl: string, scrapedAt: string): TemplateReference[] {
  const relaxedHtml = relaxEscapedNextData(html);
  const references = new Map<string, TemplateReference>();
  const componentSlugPattern = /"component_slug"\s*:\s*"((?:\\.|[^"\\])*)"/gi;

  for (const match of relaxedHtml.matchAll(componentSlugPattern)) {
    const slug = normalizeSlug(decodeJsonString(match[1]));
    if (!slug || match.index === undefined) continue;

    const contextStart = Math.max(0, match.index - 5_000);
    const contextEnd = Math.min(relaxedHtml.length, match.index + 14_000);
    const context = relaxedHtml.slice(contextStart, contextEnd);
    const afterSlugContext = relaxedHtml.slice(match.index, contextEnd);

    if (isPaidOrPrivateContext(context)) continue;

    const authorSlug = normalizeSlug(
      pickFirst([
        extractString(afterSlugContext, "username"),
        extractString(afterSlugContext, "display_username")
      ])
    );

    if (!authorSlug) continue;

    const canonicalUrl = `https://21st.dev/community/components/${authorSlug}/${slug}`;
    const title = cleanTitle(extractString(afterSlugContext, "name") || slugToTitle(slug));
    if (!title) continue;

    const description = cleanOptional(extractString(context, "description"));
    const tags = unique([
      ...extractTags(context),
      ...extractTagsFromText(`${canonicalUrl} ${title} ${description ?? ""}`)
    ]).slice(0, 12);
    const category = inferTemplateCategory(canonicalUrl, title, description, tags);
    const author = cleanOptional(
      pickFirst([
        extractString(afterSlugContext, "display_name"),
        extractString(afterSlugContext, "display_username"),
        extractString(afterSlugContext, "username"),
        slugToTitle(authorSlug)
      ])
    );
    const previewImageUrl = normalizePreviewUrl(extractString(afterSlugContext, "preview_url"), pageUrl);
    const reference: TemplateReference = {
      id: makeTemplateId(canonicalUrl),
      source: SOURCE,
      title,
      url: canonicalUrl,
      category,
      tags,
      ...(description ? { description } : {}),
      ...(author ? { author } : {}),
      ...(previewImageUrl ? { previewImageUrl } : {}),
      relatedPatternIds: mapCategoryToPatternIds(category, title, description, tags),
      usageNote: USAGE_NOTE,
      scrapedAt
    };

    references.set(reference.id, reference);
  }

  return [...references.values()];
}

function extractTemplateReference(html: string, pageUrl: string, scrapedAt: string): TemplateReference | null {
  const canonicalUrl = canonicalTemplateUrl(pageUrl);
  const $ = cheerio.load(html);
  const relaxedHtml = relaxEscapedNextData(html);
  const routeParts = new URL(canonicalUrl).pathname.split("/").filter(Boolean);
  const routeAuthor = routeParts[2];
  const routeSlug = routeParts[3];
  const context = findMostRelevantContext(relaxedHtml, routeSlug);

  if (isPaidOrPrivateContext(context)) {
    console.log(`[skip:paid-or-private] ${canonicalUrl}`);
    return null;
  }

  const embeddedTitle = pickFirst([
    extractString(context, "name"),
    extractString(context, "title")
  ]);
  const metaTitle = cleanTitle(
    pickFirst([
      text($("h1").first()),
      attr($, "meta[property='og:title']", "content"),
      attr($, "meta[name='twitter:title']", "content"),
      $("title").first().text()
    ])
  );
  const title = cleanTitle(embeddedTitle || metaTitle || slugToTitle(routeSlug));

  if (!title || title.toLowerCase() === "components") {
    return null;
  }

  const description = cleanOptional(
    pickFirst([
      extractString(context, "description"),
      attr($, "meta[name='description']", "content"),
      attr($, "meta[property='og:description']", "content"),
      attr($, "meta[name='twitter:description']", "content"),
      firstMeaningfulParagraph($)
    ])
  );
  const tags = unique([
    ...extractTags(context),
    ...extractTagsFromText(`${canonicalUrl} ${title} ${description ?? ""}`)
  ]).slice(0, 12);
  const category = inferTemplateCategory(canonicalUrl, title, description, tags);
  const author = cleanOptional(
    pickFirst([
      extractDisplayAuthor(context),
      routeAuthor ? slugToTitle(routeAuthor) : undefined
    ])
  );
  const previewImageUrl = normalizePreviewUrl(
    pickFirst([
      extractString(context, "preview_url"),
      attr($, "meta[property='og:image']", "content"),
      attr($, "meta[name='twitter:image']", "content"),
      firstMeaningfulImage($)
    ]),
    canonicalUrl
  );

  return {
    id: makeTemplateId(canonicalUrl),
    source: SOURCE,
    title,
    url: canonicalUrl,
    category,
    tags,
    ...(description ? { description } : {}),
    ...(author ? { author } : {}),
    ...(previewImageUrl ? { previewImageUrl } : {}),
    relatedPatternIds: mapCategoryToPatternIds(category, title, description, tags),
    usageNote: USAGE_NOTE,
    scrapedAt
  };
}

function relaxEscapedNextData(html: string): string {
  return html
    .replace(/\\"/g, "\"")
    .replace(/\\u0026/g, "&")
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">")
    .replace(/\\\//g, "/");
}

function findMostRelevantContext(html: string, slug?: string): string {
  if (!slug) return html.slice(0, 40_000);

  const slugIndex = html.indexOf(`"component_slug":"${slug}"`);
  if (slugIndex === -1) return html.slice(0, 40_000);

  const start = Math.max(0, slugIndex - 8_000);
  const end = Math.min(html.length, slugIndex + 24_000);
  return html.slice(start, end);
}

function isPaidOrPrivateContext(context: string): boolean {
  return (
    /"visibility"\s*:\s*"private"/i.test(context) ||
    /"is_public"\s*:\s*false/i.test(context) ||
    /"is_listed"\s*:\s*false/i.test(context) ||
    /"payment_url"\s*:\s*"https?:\/\//i.test(context)
  );
}

function extractString(context: string, key: string): string | undefined {
  const pattern = new RegExp(`"${escapeRegExp(key)}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`, "i");
  const match = context.match(pattern);

  if (!match) return undefined;

  return decodeJsonString(match[1]);
}

function extractDisplayAuthor(context: string): string | undefined {
  return pickFirst([
    extractString(context, "display_name"),
    extractString(context, "display_username"),
    extractString(context, "username")
  ]);
}

function extractTags(context: string): string[] {
  const tags = new Set<string>();
  const tagObjectPattern = /"tags"\s*:\s*\[(.*?)\]/is;
  const match = context.match(tagObjectPattern);

  if (match) {
    for (const tagMatch of match[1].matchAll(/"name"\s*:\s*"((?:\\.|[^"\\])*)"/gi)) {
      const tag = normalizeTag(decodeJsonString(tagMatch[1]));
      if (tag) tags.add(tag);
    }

    for (const tagMatch of match[1].matchAll(/"slug"\s*:\s*"((?:\\.|[^"\\])*)"/gi)) {
      const tag = normalizeTag(decodeJsonString(tagMatch[1]));
      if (tag) tags.add(tag);
    }
  }

  return [...tags];
}

function extractTagsFromText(value: string): string[] {
  const normalized = value.toLowerCase();
  const tags: string[] = [];
  const candidates = [
    "hero",
    "features",
    "pricing",
    "cta",
    "call-to-action",
    "testimonial",
    "form",
    "cards",
    "buttons",
    "dashboard",
    "navigation",
    "footer",
    "auth",
    "login",
    "signup",
    "settings"
  ];

  for (const candidate of candidates) {
    if (normalized.includes(candidate)) {
      tags.push(candidate);
    }
  }

  return tags;
}

function decodeJsonString(value: string): string {
  try {
    return JSON.parse(`"${value.replace(/"/g, "\\\"")}"`);
  } catch {
    return value.replace(/\\n/g, " ").replace(/\\"/g, "\"").replace(/\\\\/g, "\\");
  }
}

function attr($: cheerio.CheerioAPI, selector: string, attribute: string): string | undefined {
  return cleanOptional($(selector).first().attr(attribute));
}

function text(element: { text(): string }): string | undefined {
  return cleanOptional(element.text());
}

function firstMeaningfulParagraph($: cheerio.CheerioAPI): string | undefined {
  const ignored = new Set(["title", "description", "read more", "components", "search"]);

  for (const paragraph of $("p").toArray()) {
    const value = cleanOptional($(paragraph).text());
    if (value && value.length > 24 && !ignored.has(value.toLowerCase())) {
      return value;
    }
  }

  return undefined;
}

function firstMeaningfulImage($: cheerio.CheerioAPI): string | undefined {
  for (const image of $("img[src]").toArray()) {
    const src = $(image).attr("src");
    const alt = ($(image).attr("alt") ?? "").toLowerCase();

    if (src && !alt.includes("avatar") && !src.includes("avatar")) {
      return src;
    }
  }

  return undefined;
}

function normalizePreviewUrl(value: string | undefined, baseUrl: string): string | undefined {
  const cleaned = cleanOptional(value);
  if (!cleaned) return undefined;

  try {
    const url = new URL(cleaned, baseUrl);
    if (url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function cleanTitle(value: string | undefined): string {
  return cleanOptional(value)
    ?.replace(/\s*\|\s*Community Components.*$/i, "")
    .replace(/\s*\|\s*21st.*$/i, "")
    .replace(/\s*-\s*The first vibe-crafting tool.*$/i, "")
    .trim() ?? "";
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

function normalizeSlug(value: string | undefined): string | undefined {
  return cleanOptional(value)
    ?.toLowerCase()
    .replace(/[^a-z0-9._~-]+/g, "-")
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

function makeTemplateId(url: string): string {
  const parts = new URL(url).pathname.split("/").filter(Boolean).slice(2);
  return `21st-dev-${parts.join("-")}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferTemplateCategory(
  url: string,
  title: string,
  description: string | undefined,
  tags: string[]
): TemplateCategory {
  const haystack = `${url} ${title} ${description ?? ""} ${tags.join(" ")}`.toLowerCase();

  if (/\bauth\b|login|sign-in|signin|sign-up|signup/.test(haystack)) return "auth";
  if (/hero|heros|heroes/.test(haystack)) return "hero";
  if (/features?|feature/.test(haystack)) return "features";
  if (/pricing|price|plans?/.test(haystack)) return "pricing";
  if (/cta|call-to-action/.test(haystack)) return "cta";
  if (/testimonial|review|social-proof/.test(haystack)) return "testimonials";
  if (/forms?|input|contact/.test(haystack)) return "forms";
  if (/cards?/.test(haystack)) return "cards";
  if (/buttons?/.test(haystack)) return "buttons";
  if (/dashboard|analytics|admin|stats|metrics/.test(haystack)) return "dashboard";
  if (/nav|navbar|navigation|menu/.test(haystack)) return "navigation";
  if (/footer/.test(haystack)) return "footer";
  if (/settings|preferences|profile/.test(haystack)) return "settings";

  return "other";
}

function mapCategoryToPatternIds(
  category: TemplateCategory,
  title: string,
  description: string | undefined,
  tags: string[]
): string[] {
  const haystack = `${title} ${description ?? ""} ${tags.join(" ")}`.toLowerCase();

  switch (category) {
    case "hero":
      return includesAny(haystack, ["product", "preview", "screenshot"])
        ? ["hero-product-preview", "split-hero", "hero-trust-bar"]
        : ["split-hero", "hero-product-preview", "hero-trust-bar"];
    case "features":
      return ["bento-grid", "featured-side-stack", "center-highlight", "icon-grid-grouping"];
    case "pricing":
      return ["pricing-emphasis", "plan-comparison-table", "pricing-faq-combo"];
    case "cta":
      return ["split-cta", "banner-cta", "card-cta"];
    case "dashboard":
      return ["metric-bento", "hero-metric-support-stats", "stats-strip"];
    case "forms":
    case "auth":
      return ["form-benefits-sidebar", "compact-lead-form"];
    case "testimonials":
      return ["featured-testimonial", "testimonial-wall", "logo-cloud-quote"];
    case "cards":
      return ["bento-grid", "center-highlight"];
    case "navigation":
    case "footer":
    case "buttons":
    case "settings":
    case "other":
      return [];
  }
}

function includesAny(value: string, needles: string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function generateTypeScript(references: TemplateReference[]): string {
  return `export type TemplateSource = "21st.dev";

export type TemplateCategory =
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

export type TemplateReference = {
  id: string;
  source: TemplateSource;
  title: string;
  url: string;
  category: TemplateCategory;
  tags: string[];
  keywords?: string[];
  description?: string;
  author?: string;
  previewImageUrl?: string;
  relatedPatternIds: string[];
  usageNote: string;
  scrapedAt: string;
  urlStatus?: "ok" | "broken" | "unknown";
  checkedAt?: string;
  fallbackUrl?: string;
};

export const templateReferences: TemplateReference[] = ${JSON.stringify(references, null, 2)};
`;
}

async function main(): Promise<void> {
  console.log(`Starting 21st.dev metadata crawl with maxPages=${maxPages}, delay=${requestDelayMs}ms`);

  const robotsRules = await loadRobotsRules();
  const queue = [normalizeUrl(START_URL) ?? START_URL, "https://21st.dev/community/components"];
  const queued = new Set(queue);
  const visited = new Set<string>();
  const references = new Map<string, TemplateReference>();
  const scrapedAt = new Date().toISOString();

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

    for (const reference of extractEmbeddedTemplateReferences(html, nextUrl, scrapedAt)) {
      const validated = await validateReferenceForStorage(reference, robotsRules);
      await sleep(requestDelayMs);

      if (validated) {
        references.set(validated.id, validated);
        console.log(`[ref:embedded] ${validated.id} ${validated.title}`);
      }
    }

    if (isTemplatePage(nextUrl)) {
      const reference = extractTemplateReference(html, nextUrl, scrapedAt);

      if (reference) {
        const validated = await validateReferenceForStorage(reference, robotsRules);
        await sleep(requestDelayMs);

        if (validated) {
          references.set(validated.id, validated);
          console.log(`[ref] ${validated.id} ${validated.title}`);
        }
      }
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
