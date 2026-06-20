import { useEffect, useState } from "react";
import {
  getCurrentUser,
  onAuthStateChangedSafe,
  signOutUser,
  type ExtensionUser
} from "../shared/authService";
import type { PolishPilotMode } from "../shared/types";
import { EmailAuthForm } from "./EmailAuthForm";
import { getScreenshotUsage, type ScreenshotUsage } from "../shared/usageService";

export function AccountPanel({ mode: _mode }: { mode: PolishPilotMode }) {
  const [user, setUser] = useState<ExtensionUser | null>(null);
  const [usage, setUsage] = useState<ScreenshotUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getCurrentUser().then((current) => {
      if (active) setUser(current);
    });
    const unsubscribe = onAuthStateChangedSafe((next) => {
      if (!active) return;
      setUser(next);
      setIsLoading(false);
    });
    // Stop the loading state even if no auth event fires quickly.
    const timer = window.setTimeout(() => active && setIsLoading(false), 1500);
    const handleUsageMessage = (message: unknown) => {
      if (
        message &&
        typeof message === "object" &&
        "type" in message &&
        message.type === "USAGE_UPDATED" &&
        "usage" in message
      ) {
        setUsage(message.usage as ScreenshotUsage);
      }
    };
    chrome.runtime.onMessage.addListener(handleUsageMessage);
    return () => {
      active = false;
      window.clearTimeout(timer);
      unsubscribe();
      chrome.runtime.onMessage.removeListener(handleUsageMessage);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setUsage(null);
      return;
    }
    void getScreenshotUsage().then(setUsage).catch(() => undefined);
  }, [user]);

  async function handleSignOut() {
    try {
      await signOutUser();
    } catch {
      // signOut clears local state regardless; ignore.
    }
    setUser(null);
    setUsage(null);
  }

  return (
    <section className="dh-card mt-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-black text-pilot-text">Account</h2>
        <span className="dh-chip">Plan: {usage?.plan === "pro" ? "Pro" : "Free"}</span>
      </div>

      {isLoading && !user ? (
        <p className="mt-3 text-sm leading-6 text-pilot-muted">Checking sign-in…</p>
      ) : user ? (
        <div className="mt-3">
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                alt=""
                className="h-9 w-9 rounded-full border border-pilot-border object-cover"
                src={user.photoURL}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pilot-primary text-sm font-black text-white">
                {(user.email ?? "?").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs text-pilot-soft">Signed in as</p>
              <p className="truncate text-sm font-semibold text-pilot-text">
                {user.email ?? user.displayName ?? user.uid}
              </p>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-pilot-border bg-pilot-panel/70 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-pilot-soft">
              Screenshots left
            </p>
            <p className="mt-1 text-2xl font-black text-pilot-text">
              {usage ? `${usage.screenshotsRemaining}/${usage.screenshotsTotal}` : "Loading..."}
            </p>
            {usage ? (
              <p className="mt-1 text-xs leading-5 text-pilot-muted">
                Resets {new Date(usage.currentPeriodEnd).toLocaleDateString()}
              </p>
            ) : null}
          </div>
          <button
            className="dh-button-secondary mt-3 w-full px-3 py-2.5 text-sm"
            onClick={() => void handleSignOut()}
            type="button"
          >
            Sign out
          </button>
        </div>
      ) : (
        <EmailAuthForm onSignedIn={setUser} />
      )}
    </section>
  );
}
