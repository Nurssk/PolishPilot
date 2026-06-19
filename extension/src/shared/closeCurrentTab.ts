// Closes the tab this extension page is running in. `window.close()` does not
// reliably work for tabs opened via chrome.tabs.create, so remove the current
// tab through the tabs API and fall back to window.close().
export function closeCurrentTab(): void {
  try {
    chrome.tabs.getCurrent((tab) => {
      if (tab?.id != null) {
        chrome.tabs.remove(tab.id);
      } else {
        window.close();
      }
    });
  } catch {
    window.close();
  }
}
