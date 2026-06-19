import type { GeneratedPreviewImage } from "./generatedPreviewTypes";

export const GENERATED_PREVIEWS_KEY = "generatedPreviewImages";
const MAX_GENERATED_PREVIEWS = 20;

export async function addGeneratedPreview(
  image: GeneratedPreviewImage
): Promise<void> {
  const current = await getGeneratedPreviews();
  const next = [
    image,
    ...current.filter((preview) => preview.id !== image.id)
  ].slice(0, MAX_GENERATED_PREVIEWS);

  try {
    await chrome.storage.session.set({ [GENERATED_PREVIEWS_KEY]: next });
  } catch (error) {
    console.warn("Could not store generated preview gallery. Falling back to latest image only.", error);
    // TODO: Move generated preview storage to IndexedDB when session storage quota is too small.
    await chrome.storage.session.set({ [GENERATED_PREVIEWS_KEY]: [image] });
  }
}

export async function getGeneratedPreviews(): Promise<GeneratedPreviewImage[]> {
  const result = await chrome.storage.session.get(GENERATED_PREVIEWS_KEY);
  const previews = result[GENERATED_PREVIEWS_KEY];

  return Array.isArray(previews)
    ? previews.filter(isGeneratedPreviewImage)
    : [];
}

export async function clearGeneratedPreviews(): Promise<void> {
  await chrome.storage.session.remove(GENERATED_PREVIEWS_KEY);
}

export async function removeGeneratedPreview(id: string): Promise<void> {
  const current = await getGeneratedPreviews();
  await chrome.storage.session.set({
    [GENERATED_PREVIEWS_KEY]: current.filter((preview) => preview.id !== id)
  });
}

function isGeneratedPreviewImage(value: unknown): value is GeneratedPreviewImage {
  return Boolean(
    value &&
      typeof value === "object" &&
      "id" in value &&
      "createdAt" in value &&
      "imageBase64" in value &&
      typeof (value as { id?: unknown }).id === "string" &&
      typeof (value as { createdAt?: unknown }).createdAt === "string" &&
      typeof (value as { imageBase64?: unknown }).imageBase64 === "string"
  );
}
