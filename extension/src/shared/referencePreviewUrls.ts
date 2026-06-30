import type { AnimationReference } from "../patterns/animationReferences";

const THUMBNAIL_BASE_URL = "https://image.thum.io/get/width/900/crop/650/noanimate/";

export function buildReferenceScreenshotUrl(rawUrl?: string | null): string | undefined {
  const targetUrl = normalizePreviewTargetUrl(rawUrl);
  return targetUrl ? `${THUMBNAIL_BASE_URL}${targetUrl}` : undefined;
}

export function getAnimationPreviewImageUrl(
  reference: AnimationReference
): string | undefined {
  return reference.previewImageUrl ?? buildReferenceScreenshotUrl(getAnimationPreviewTargetUrl(reference));
}

export function getAnimationPreviewTargetUrl(reference: AnimationReference): string {
  if (reference.previewPageUrl) return reference.previewPageUrl;

  if (reference.source === "watermelon-ui") {
    const registrySlug = registrySlugFromUrl(reference.url);
    if (registrySlug) return `https://ui.watermelon.sh/animated-components/${registrySlug}`;
  }

  return reference.url;
}

function normalizePreviewTargetUrl(rawUrl?: string | null): string | undefined {
  if (!rawUrl) return undefined;

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    url.hash = "";
    return url.toString();
  } catch {
    return undefined;
  }
}

function registrySlugFromUrl(rawUrl: string): string | undefined {
  try {
    const url = new URL(rawUrl);
    if (url.hostname !== "registry.watermelon.sh") return undefined;
    const match = url.pathname.match(/\/r\/([^/]+)\.json$/);
    return match?.[1];
  } catch {
    return undefined;
  }
}
