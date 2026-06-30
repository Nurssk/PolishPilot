import {
  FULL_PREVIEW_STORAGE_KEY,
  LATEST_AI_RESULT_STORAGE_KEY,
  LATEST_CAPTURE_STORAGE_KEY,
  SELECTED_PATTERN_STORAGE_KEY,
  isPolishPilotMessage
} from "../shared/messages";
import { consumeScreenshotCredit, getScreenshotUsage } from "../shared/usageService";
import type {
  PolishPilotMessage,
  RectangleCapture,
  RectangleSelectionCompleteMessage,
  RemoveInPagePreviewMessage,
  SelectionRect,
  ShowInPagePreviewMessage
} from "../shared/types";

let latestCapture: RectangleCapture | null = null;

chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel?.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!isPolishPilotMessage(message)) {
    return;
  }

  if (message.type === "RECTANGLE_SELECTION_COMPLETE") {
    handleRectangleSelection(message as RectangleSelectionCompleteMessage, sender)
      .then(() => sendResponse({ ok: true }))
      .catch((error: unknown) => {
        console.error("PolishPilot capture failed", error);
        sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
      });

    return true;
  }

  if (message.type === "START_NEW_SCREENSHOT") {
    startNewScreenshot()
      .then(() => sendResponse({ ok: true }))
      .catch((error: unknown) => {
        console.error("PolishPilot start screenshot failed", error);
        sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
      });

    return true;
  }

  if (
    message.type === "SHOW_IN_PAGE_PREVIEW" ||
    message.type === "REMOVE_IN_PAGE_PREVIEW"
  ) {
    forwardPreviewMessageToActiveTab(
      message as ShowInPagePreviewMessage | RemoveInPagePreviewMessage
    )
      .then(() => sendResponse({ ok: true }))
      .catch((error: unknown) => {
        console.error("PolishPilot preview message failed", error);
        sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) });
      });

    return true;
  }
});

async function handleRectangleSelection(
  message: RectangleSelectionCompleteMessage,
  sender: chrome.runtime.MessageSender
) {
  const tab = sender.tab;

  if (!tab?.windowId) {
    throw new Error("No sender tab/window available for capture.");
  }

  const visibleScreenshot = await captureVisibleTab(tab.windowId);
  const screenshotBase64 = await cropScreenshot(
    visibleScreenshot,
    message.payload.selectedRect
  );
  const usage = await consumeScreenshotCredit();

  latestCapture = {
    ...message.payload,
    captureId: Date.now().toString(),
    screenshotBase64
  };

  await chrome.storage.session.set({
    [LATEST_CAPTURE_STORAGE_KEY]: latestCapture
  });
  await chrome.storage.session.remove([
    LATEST_AI_RESULT_STORAGE_KEY,
    SELECTED_PATTERN_STORAGE_KEY,
    FULL_PREVIEW_STORAGE_KEY
  ]);

  chrome.runtime.sendMessage({
    type: "CAPTURE_UPDATED",
    capture: latestCapture
  });
  chrome.runtime.sendMessage({
    type: "USAGE_UPDATED",
    usage
  });
}

async function startNewScreenshot() {
  const usage = await getScreenshotUsage();
  if (usage.screenshotsRemaining <= 0) {
    throw new Error("You have no screenshots left this period.");
  }

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab?.id) {
    throw new Error("No active tab available for screenshot selection.");
  }

  await sendMessageToTab(tab.id, { type: "REMOVE_IN_PAGE_PREVIEW" }).catch(
    () => undefined
  );
  await sendStartSelectionMessage(tab.id);
}

async function sendStartSelectionMessage(
  tabId: number,
  attemptedInjection = false
): Promise<void> {
  try {
    await sendMessageToTab(tabId, { type: "START_RECTANGLE_SELECTION" });
  } catch (error) {
    if (attemptedInjection) {
      throw error;
    }

    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["assets/contentScript.js"]
    });
    await sendStartSelectionMessage(tabId, true);
  }
}

async function forwardPreviewMessageToActiveTab(
  message: ShowInPagePreviewMessage | RemoveInPagePreviewMessage
) {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab?.id) {
    throw new Error("No active tab available for page preview.");
  }

  await sendMessageToTab(tab.id, message);
}

function sendMessageToTab(tabId: number, message: PolishPilotMessage): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, () => {
      const error = chrome.runtime.lastError?.message;

      if (error && !isClosedMessagePortError(error)) {
        reject(new Error(error));
        return;
      }

      resolve();
    });
  });
}

function isClosedMessagePortError(message: string) {
  return /message port closed before a response was received/i.test(message);
}

function captureVisibleTab(windowId: number): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(
      windowId,
      { format: "png" },
      (dataUrl?: string) => {
        const error = chrome.runtime.lastError?.message;

        if (error || !dataUrl) {
          reject(new Error(error ?? "captureVisibleTab returned no image data."));
          return;
        }

        resolve(dataUrl);
      }
    );
  });
}

async function cropScreenshot(
  screenshotDataUrl: string,
  rect: SelectionRect
): Promise<string> {
  const imageBlob = await (await fetch(screenshotDataUrl)).blob();
  const imageBitmap = await createImageBitmap(imageBlob);
  const scale = rect.devicePixelRatio || 1;
  const cropX = Math.round(rect.x * scale);
  const cropY = Math.round(rect.y * scale);
  const cropWidth = Math.max(1, Math.round(rect.width * scale));
  const cropHeight = Math.max(1, Math.round(rect.height * scale));
  const canvas = new OffscreenCanvas(cropWidth, cropHeight);
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create canvas context for screenshot crop.");
  }

  context.drawImage(
    imageBitmap,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  const croppedBlob = await canvas.convertToBlob({ type: "image/png" });
  const base64 = await blobToBase64(croppedBlob);

  return `data:image/png;base64,${base64}`;
}

async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}
