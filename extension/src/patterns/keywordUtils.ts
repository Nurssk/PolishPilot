const SYNONYMS: Record<string, string> = {
  feature: "features",
  card: "cards",
  price: "pricing",
  testimonial: "testimonials",
  review: "testimonials",
  metric: "stats",
  kpi: "stats",
  signup: "form",
  lead: "lead-capture",
  "cta-button": "cta",
  microinteraction: "microinteraction",
  "hover-effect": "hover",
  "reveal-animation": "reveal"
};

export function normalizeKeyword(input: string): string {
  const normalized = input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return SYNONYMS[normalized] ?? normalized;
}

export function normalizeKeywords(inputs: string[]): string[] {
  return [...new Set(inputs.map(normalizeKeyword).filter(Boolean))];
}

export function keywordScore(sourceKeywords: string[], targetKeywords: string[]): number {
  const source = new Set(normalizeKeywords(sourceKeywords));
  const target = normalizeKeywords(targetKeywords);

  return target.reduce((score, keyword) => score + (source.has(keyword) ? 1 : 0), 0);
}
