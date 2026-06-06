import { GoogleGenAI } from "@google/genai";

export const IMAGE_MODEL_PRIORITY = [
  "models/gemini-3.1-flash-image",
  "models/gemini-3.1-flash-image-preview",
  "models/gemini-2.5-flash-image",
  "models/gemini-2.5-flash-preview-image",
  "models/gemini-3-pro-image-preview",
  "models/gemini-3-pro-image",
  "models/imagen-4.0-fast-generate-001",
  "models/imagen-4.0-generate-001",
  "models/imagen-4.0-ultra-generate-001",
] as const;

export type SelectedImageModel = {
  modelName: string;
  availableImageModels: string[];
  orderedModelCandidates: string[];
  warning?: string;
};

export async function selectImageModel(
  ai: GoogleGenAI,
  preferredModelName?: string
): Promise<SelectedImageModel> {
  const availableModels = await listAvailableModels(ai);
  const availableModelSet = new Set(availableModels.map(normalizeModelName));
  const availableImageModels = IMAGE_MODEL_PRIORITY.filter((modelName) =>
    availableModelSet.has(normalizeModelName(modelName))
  );
  const normalizedPreferred = preferredModelName
    ? normalizeModelName(preferredModelName)
    : "";
  const preferredIsAvailable = Boolean(
    normalizedPreferred && availableModelSet.has(normalizedPreferred)
  );
  const orderedModelCandidates = uniqueModels([
    ...(preferredIsAvailable ? [normalizedPreferred] : []),
    ...availableImageModels,
  ]);

  return {
    modelName: orderedModelCandidates[0] ?? "",
    availableImageModels,
    orderedModelCandidates,
    warning:
      normalizedPreferred && !preferredIsAvailable
        ? `GEMINI_IMAGE_MODEL is set to ${normalizedPreferred}, but that model is not available for this key. Falling back to priority list.`
        : undefined,
  };
}

export function normalizeModelName(modelName: string) {
  const trimmed = modelName.trim();
  return trimmed.startsWith("models/") ? trimmed : `models/${trimmed}`;
}

export function toSdkModelName(modelName: string) {
  return modelName.replace(/^models\//, "");
}

async function listAvailableModels(ai: GoogleGenAI) {
  const pager = await ai.models.list({
    config: {
      pageSize: 100,
      queryBase: true,
    },
  });
  const models: string[] = [];

  for await (const model of pager) {
    if (model.name) {
      models.push(normalizeModelName(model.name));
    }
  }

  return models;
}

function uniqueModels(modelNames: string[]) {
  return [...new Set(modelNames.map(normalizeModelName))];
}
