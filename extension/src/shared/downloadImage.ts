export function downloadBase64Image(
  base64OrDataUrl: string,
  filename: string
): void {
  const href = base64OrDataUrl.startsWith("data:")
    ? base64OrDataUrl
    : `data:image/png;base64,${base64OrDataUrl}`;
  const link = document.createElement("a");

  link.href = href;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function previewDownloadFilename(createdAt: string): string {
  const timestamp = createdAt
    .replace(/[:.]/g, "-")
    .replace(/[^\dA-Za-z-]/g, "")
    .slice(0, 32);

  return `design-humanizer-preview-${timestamp || Date.now()}.png`;
}
