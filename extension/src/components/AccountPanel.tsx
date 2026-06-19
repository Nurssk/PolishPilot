import { useEffect, useState } from "react";
import {
  getCurrentUser,
  onAuthStateChangedSafe,
  signOutUser,
  type ExtensionUser,
  type UserPlan
} from "../shared/authService";
import type { PolishPilotMode } from "../shared/types";
import { EmailAuthForm } from "./EmailAuthForm";

// Plan is hard-coded to "free" for now. Pro detection will be connected to Polar
// later via the backend (verified Firebase ID token -> billing state).
const CURRENT_PLAN: UserPlan = "free";

export function AccountPanel({ mode: _mode }: { mode: PolishPilotMode }) {
  const [user, setUser] = useState<ExtensionUser | null>(null);
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
    return () => {
      active = false;
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    try {
      await signOutUser();
    } catch {
      // signOut clears local state regardless; ignore.
    }
    setUser(null);
  }

  return (
    <section className="dh-card mt-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-black text-pilot-text">Account</h2>
        <span className="dh-chip">Plan: {CURRENT_PLAN === "pro" ? "Pro" : "Free"}</span>
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
