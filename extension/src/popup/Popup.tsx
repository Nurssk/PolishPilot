import "../styles/tailwind.css";
import { useEffect, useState } from "react";
import {
  POLISH_PILOT_MODE_STORAGE_KEY,
  chromeLastErrorMessage
} from "../shared/messages";
import type { PolishPilotMode } from "../shared/types";

export function Popup() {
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
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/15 text-sm font-black text-cyan-100">
          PP
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight">PolishPilot</h1>
          <p className="text-xs text-slate-400">Rectangle area understanding</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-1">
        <div className="grid grid-cols-2 gap-1">
          {(["simple", "developer"] as const).map((option) => (
            <button
              className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                mode === option
                  ? "bg-cyan-300 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800"
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

      <p className="mt-4 text-sm leading-5 text-slate-300">{message}</p>

      <button
        className="mt-4 w-full rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100 disabled:cursor-wait disabled:opacity-70"
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

      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/70 p-2.5 text-[11px] leading-4 text-slate-400">
        A temporary overlay appears on the current page. Drag over a UI section
        to capture its screenshot and DOM summary.
      </div>
    </main>
  );
}
