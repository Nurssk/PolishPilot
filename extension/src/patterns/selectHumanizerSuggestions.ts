import type { AIUnderstandingResult, DesignIntent, UIProblem } from "../shared/types";
import { animationReferences, type AnimationReference } from "./animationReferences";
import { keywordScore, normalizeKeywords } from "./keywordUtils";
import { layoutPatterns, type LayoutPattern } from "./layoutPatterns";
import { templateReferences, type TemplateReference } from "./templateReferences";

export type HumanizerSuggestions = {
  layoutPatterns: LayoutPattern[];
  templateReferences: TemplateReference[];
  animationReferences: AnimationReference[];
  debug: {
    inputKeywords: string[];
    sectionType?: string;
    layoutType?: string;
    scores: Array<{
      type: "layout" | "template" | "animation";
      id: string;
      score: number;
      matchedKeywords: string[];
    }>;
  };
};

type Scored<T> = {
  item: T;
  score: number;
  matchedKeywords: string[];
};

export function selectHumanizerSuggestions(args: {
  aiResult: AIUnderstandingResult;
  limit?: {
    layouts?: number;
    templates?: number;
    animations?: number;
  };
}): HumanizerSuggestions {
  const limits = {
    layouts: args.limit?.layouts ?? 4,
    templates: args.limit?.templates ?? 4,
    animations: args.limit?.animations ?? 3
  };
  const inputKeywords = buildInputKeywords(args.aiResult);

  const scoredLayouts = layoutPatterns
    .map((pattern) => scoreLayout(pattern, args.aiResult, inputKeywords))
    .filter((scored) => scored.score > 0)
    .sort(sortScored);
  const selectedLayouts = dedupeById(scoredLayouts).slice(0, limits.layouts);
  const selectedLayoutIds = selectedLayouts.map((scored) => scored.item.id);

  const scoredTemplates = templateReferences
    .map((reference) => scoreTemplate(reference, args.aiResult, inputKeywords, selectedLayoutIds))
    .filter((scored) => scored.score > 0)
    .sort(sortScored);
  const selectedTemplates = dedupeById(scoredTemplates).slice(0, limits.templates);

  const scoredAnimations = animationReferences
    .map((reference) => scoreAnimation(reference, args.aiResult, inputKeywords))
    .filter((scored) => scored.score > 0)
    .sort(sortScored);
  const selectedAnimations = dedupeById(scoredAnimations).slice(0, limits.animations);

  return {
    layoutPatterns: selectedLayouts.map((scored) => scored.item),
    templateReferences: selectedTemplates.map((scored) => scored.item),
    animationReferences: selectedAnimations.map((scored) => scored.item),
    debug: {
      inputKeywords,
      sectionType: args.aiResult.sectionType,
      layoutType: args.aiResult.layoutType,
      scores: [
        ...selectedLayouts.map((scored) => debugScore("layout", scored.item.id, scored)),
        ...selectedTemplates.map((scored) => debugScore("template", scored.item.id, scored)),
        ...selectedAnimations.map((scored) => debugScore("animation", scored.item.id, scored))
      ]
    }
  };
}

function buildInputKeywords(aiResult: AIUnderstandingResult) {
  return normalizeKeywords([
    aiResult.sectionType,
    aiResult.layoutType,
    aiResult.contentType,
    aiResult.designIntent,
    ...aiResult.detectedKeywords,
    ...aiResult.uiProblems,
    ...aiResult.animationKeywords,
    ...aiResult.recommendedCategories.layoutCategories,
    ...aiResult.recommendedCategories.templateCategories,
    ...aiResult.recommendedCategories.animationCategories,
    ...aiResult.detectedBlocks.flatMap((block) => [block.type, block.description])
  ]);
}

function scoreLayout(
  pattern: LayoutPattern,
  aiResult: AIUnderstandingResult,
  inputKeywords: string[]
): Scored<LayoutPattern> {
  const targetKeywords = normalizeKeywords([
    pattern.id,
    pattern.name,
    pattern.category,
    ...pattern.keywords,
    ...pattern.inspirationTags,
    ...pattern.problemSolved
  ]);
  const matchedKeywords = matched(inputKeywords, targetKeywords);
  let score = matchedKeywords.length;

  if (categoryMatches(aiResult.sectionType, pattern.category)) score += 5;
  score += intersectionCount(aiResult.uiProblems, pattern.solvesProblems) * 3;
  score += intersectionCount([aiResult.designIntent], pattern.designIntents) * 2;
  if (aiResult.layoutType === "equal_grid" && pattern.solvesProblems.includes("cards_too_equal")) score += 4;
  if (aiResult.sectionType === "pricing" && pattern.category === "pricing") score += 5;
  if (aiResult.sectionType === "hero" && pattern.category === "hero") score += 5;
  if (aiResult.sectionType === "form" && pattern.category === "form") score += 5;

  return { item: pattern, score, matchedKeywords };
}

function scoreTemplate(
  reference: TemplateReference,
  aiResult: AIUnderstandingResult,
  inputKeywords: string[],
  selectedLayoutIds: string[]
): Scored<TemplateReference> {
  const targetKeywords = normalizeKeywords([
    reference.id,
    reference.title,
    reference.category,
    ...reference.tags,
    ...(reference.keywords ?? []),
    ...(reference.description ? [reference.description] : [])
  ]);
  const matchedKeywords = matched(inputKeywords, targetKeywords);
  let score = matchedKeywords.length;

  if (categoryMatches(aiResult.sectionType, reference.category)) score += 5;
  score += intersectionCount(reference.relatedPatternIds, selectedLayoutIds) * 2;
  if (aiResult.sectionType === "pricing" && reference.category === "pricing") score += 5;
  if (aiResult.sectionType === "hero" && reference.category === "hero") score += 5;
  if (aiResult.sectionType === "form" && (reference.category === "forms" || reference.category === "auth")) score += 5;

  return { item: reference, score, matchedKeywords };
}

function scoreAnimation(
  reference: AnimationReference,
  aiResult: AIUnderstandingResult,
  inputKeywords: string[]
): Scored<AnimationReference> {
  const targetKeywords = normalizeKeywords([
    reference.id,
    reference.title,
    reference.category,
    ...reference.tags,
    ...(reference.keywords ?? []),
    ...(reference.description ? [reference.description] : []),
    ...reference.relatedSectionTypes,
    ...reference.relatedPatternIds
  ]);
  const matchedKeywords = matched(inputKeywords, targetKeywords);
  let score = matchedKeywords.length;

  if (aiResult.recommendedCategories.animationCategories.includes(reference.category)) score += 4;
  score += intersectionCount(aiResult.uiProblems, reference.solvesProblems ?? []) * 3;
  if (aiResult.uiProblems.includes("missing_microinteraction")) score += 2;
  if (aiResult.sectionType === "hero" && reference.relatedSectionTypes.includes("hero")) score += 5;
  if (aiResult.sectionType === "pricing" && reference.relatedSectionTypes.includes("pricing")) score += 5;
  if (aiResult.sectionType === "form" && reference.relatedSectionTypes.includes("form")) score += 5;

  return { item: reference, score, matchedKeywords };
}

function categoryMatches(sectionType: string, category: string) {
  if (sectionType === category) return true;
  if (sectionType === "form" && category === "forms") return true;
  if (sectionType === "cards" && category === "features") return true;
  return false;
}

function matched(inputKeywords: string[], targetKeywords: string[]) {
  const normalizedInput = normalizeKeywords(inputKeywords);
  const normalizedTarget = normalizeKeywords(targetKeywords);
  const targetSet = new Set(normalizedTarget);

  return normalizedInput.filter((keyword) => targetSet.has(keyword));
}

function intersectionCount(source: string[], target: string[]) {
  return keywordScore(source, target);
}

function sortScored<T>(a: Scored<T>, b: Scored<T>) {
  return b.score - a.score;
}

function dedupeById<T extends { id: string }>(items: Scored<T>[]) {
  const seen = new Set<string>();

  return items.filter((scored) => {
    if (seen.has(scored.item.id)) return false;
    seen.add(scored.item.id);
    return true;
  });
}

function debugScore(
  type: "layout" | "template" | "animation",
  id: string,
  scored: Scored<unknown>
) {
  return {
    type,
    id,
    score: scored.score,
    matchedKeywords: scored.matchedKeywords
  };
}
