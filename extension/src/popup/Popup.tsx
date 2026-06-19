import "../styles/tailwind.css";
import { useEffect, useState } from "react";
import {
  POLISH_PILOT_MODE_STORAGE_KEY,
  chromeLastErrorMessage
} from "../shared/messages";
import { getCurrentUser, type ExtensionUser } from "../shared/authService";
import type { PolishPilotMode } from "../shared/types";
import { EmailAuthForm } from "../components/EmailAuthForm";

export function Popup() {
  const [user, setUser] = useState<ExtensionUser | null>(null);
  const [status, setStatus] = useState<"idle" | "starting" | "ready" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("Drag over a UI section to analyze its layout.");
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [mode, setMode] = useState<PolishPilotMode>("simple");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setActiveTabId(tabs[0]?.id ?? null);
    });

    void getCurrentUser().then(setUser).catch(() => undefined);

    chrome.storage.local
      .get(POLISH_PILOT_MODE_STORAGE_KEY)
      .then((result) => {
        const storedMode = result[POLISH_PILOT_MODE_STORAGE_KEY];

        if (storedMode === "developer" || storedMode === "simple") {
          setMode(storedMode);
        }
      })
      .catch(() => undefined);
  }, []);

  async function updateMode(nextMode: PolishPilotMode) {
    setMode(nextMode);
    await chrome.storage.local.set({
      [POLISH_PILOT_MODE_STORAGE_KEY]: nextMode
    });
  }

  async function handleSelectArea() {
    if (!activeTabId) {
      setStatus("error");
      setMessage("No active tab found.");
      return;
    }

    setStatus("starting");
    setMessage("Opening side panel...");

    try {
      await chrome.sidePanel.open({ tabId: activeTabId });
      await sendStartSelectionMessage(activeTabId);

      window.close();
    } catch (error) {
      console.error("PolishPilot selection start failed", error);
      setStatus("error");
      setMessage(userFacingError(error));
    }
  }

  async function sendStartSelectionMessage(tabId: number, attemptedInjection = false): Promise<void> {
    try {
      await sendTabMessage(tabId, { type: "START_RECTANGLE_SELECTION" });
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

  function sendTabMessage(tabId: number, message: { type: "START_RECTANGLE_SELECTION" }) {
    return new Promise<void>((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, () => {
        const error = chromeLastErrorMessage();

        if (error && !isClosedMessagePortError(error)) {
          reject(new Error(error));
          return;
        }

        resolve();
      });
    });
  }

  function userFacingError(error: unknown): string {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (/receiving end does not exist|cannot access|missing host permission/i.test(errorMessage)) {
      return "This page cannot be analyzed. Try localhost, your app, or a Vercel preview.";
    }

    return errorMessage || "Could not start rectangle selection.";
  }

  function isClosedMessagePortError(errorMessage: string) {
    return /message port closed before a response was received/i.test(errorMessage);
  }

  return (
    <main className="w-72 bg-pilot-bg p-4 text-pilot-text">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pilot-primary text-sm font-black text-white shadow-lg shadow-black/20">
          DH
        </div>
        <div>
          <h1 className="text-base font-black leading-tight">Design Humanizer</h1>
          <p className="text-xs text-pilot-muted">AI UI polish assistant</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-pilot-border bg-pilot-card/60 p-1">
        <div className="grid grid-cols-2 gap-1">
          {(["simple", "developer"] as const).map((option) => (
            <button
              className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                mode === option
                  ? "bg-pilot-primary text-white shadow-glow"
                  : "text-pilot-muted hover:bg-pilot-card"
              }`}
              key={option}
              onClick={() => void updateMode(option)}
              type="button"
            >
              {option === "simple" ? "Simple" : "Developer"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-pilot-border bg-pilot-panel/70 p-2.5">
        {user ? (
          <p className="truncate text-[11px] leading-4 text-pilot-muted">
            Signed in as{" "}
            <span className="font-semibold text-pilot-text">
              {user.email ?? user.displayName ?? user.uid}
            </span>
          </p>
        ) : (
          <EmailAuthForm compact onSignedIn={setUser} />
        )}
      </div>

      <p className="mt-4 text-sm leading-5 text-pilot-muted">{message}</p>

      <button
        className="dh-button-primary mt-4 w-full px-4 py-2.5 text-sm disabled:cursor-wait disabled:opacity-70"
        disabled={status === "starting"}
        onClick={handleSelectArea}
        type="button"
      >
        {status === "starting"
          ? "Starting..."
          : mode === "simple"
            ? "Improve Selected Area"
            : "Select Area"}
      </button>

      <div className="mt-3 rounded-lg border border-pilot-border bg-pilot-panel/70 p-2.5 text-[11px] leading-4 text-pilot-muted">
        A temporary overlay appears on the current page. Drag over a UI section
        to capture its screenshot and DOM summary.
      </div>
    </main>
  );
}
