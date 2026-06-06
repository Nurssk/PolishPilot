import { readFile, writeFile } from "node:fs/promises";
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

const USER_AGENT = "DesignHumanizerBot/0.1 (+local MVP research)";
const HOSTNAME = "21st.dev";
const FALLBACK_URL = "https://21st.dev/community/components";
const inputJsonPath = path.resolve("data/template-references/21st-dev.json");
const outputTsPath = path.resolve("extension/src/patterns/templateReferences.ts");
const requestDelayMs = readPositiveIntEnv("REQUEST_DELAY_MS", 500);

function readPositiveIntEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);

    if (url.protocol !== "https:") return null;
    if (url.hostname !== HOSTNAME) return null;

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

function fallbackUrlForReference(reference: TemplateReference): string {
  if (reference.category && reference.category !== "other") {
    return `https://21st.dev/community/components/s/${encodeURIComponent(reference.category)}`;
  }

  return FALLBACK_URL;
}

async function checkUrl(rawUrl: string) {
  const normalized = normalizeUrl(rawUrl);

  if (!normalized) {
    return {
      url: rawUrl,
      statusCode: 0,
      urlStatus: "broken" as const,
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
      statusCode: response.status,
      urlStatus: response.status === 200 ? ("ok" as const) : ("broken" as const),
      checkedAt: new Date().toISOString()
    };
  } catch (error) {
    console.log(`[error] ${normalized} ${error instanceof Error ? error.message : String(error)}`);
    return {
      url: normalized,
      statusCode: 0,
      urlStatus: "broken" as const,
      checkedAt: new Date().toISOString()
    };
  }
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
  const raw = await readFile(inputJsonPath, "utf8");
  const references = JSON.parse(raw) as TemplateReference[];
  const updated: TemplateReference[] = [];
  const counts = {
    ok: 0,
    broken: 0,
    unknown: 0
  };

  console.log(`Checking ${references.length} template links with delay=${requestDelayMs}ms`);

  for (const reference of references) {
    const health = await checkUrl(reference.url);
    await sleep(requestDelayMs);

    const nextReference: TemplateReference = {
      ...reference,
      url: normalizeUrl(health.url) ?? reference.url,
      urlStatus: health.urlStatus,
      checkedAt: health.checkedAt,
      fallbackUrl: fallbackUrlForReference(reference)
    };

    counts[health.urlStatus] += 1;
    console.log(`[${health.urlStatus}:${health.statusCode}] ${reference.id} ${reference.url}`);
    updated.push(nextReference);
  }

  const sorted = updated.sort((a, b) => a.id.localeCompare(b.id));
  await writeFile(inputJsonPath, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
  await writeFile(outputTsPath, generateTypeScript(sorted), "utf8");

  console.log(`Updated ${inputJsonPath}`);
  console.log(`Generated ${outputTsPath}`);
  console.log(JSON.stringify(counts, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
