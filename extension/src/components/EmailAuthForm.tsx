import { FormEvent, useState } from "react";
import {
  AuthError,
  exchangeWebsiteCode,
  normalizeCode,
  openAuthorizationPage,
  type AuthErrorCode,
  type ExtensionUser
} from "../shared/authService";

const FRIENDLY_MESSAGE: Record<AuthErrorCode, string> = {
  AUTH_NOT_CONFIGURED: "Authorization is not configured yet.",
  INVALID_CODE: "Enter the 6-character code from the website.",
  CODE_EXPIRED: "This code expired. Generate a new code on the website.",
  CODE_USED: "This code has already been used. Generate a new code on the website.",
  CODE_EXCHANGE_FAILED: "Could not connect this extension. Check the code.",
  NETWORK_ERROR: "Network error. Check your connection and try again.",
  UNKNOWN: "Could not sign in. Please try again."
};

type EmailAuthFormProps = {
  compact?: boolean;
  onSignedIn: (user: ExtensionUser) => void;
};

export function EmailAuthForm({ compact = false, onSignedIn }: EmailAuthFormProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "opening" | "connecting">("idle");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleOpenAuthorizationPage() {
    setStatus("opening");
    setError("");
    setNotice("");
    try {
      await openAuthorizationPage();
      setNotice("Log in on the website, then paste your code here.");
    } catch {
      setError("Could not open the authorization page.");
    } finally {
      setStatus("idle");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("connecting");
    setError("");
    setNotice("");
    try {
      const user = await exchangeWebsiteCode(code);
      setCode("");
      onSignedIn(user);
    } catch (caught) {
      setError(messageFor(caught));
    } finally {
      setStatus("idle");
    }
  }

  return (
    <form className={compact ? "space-y-2" : "mt-3 space-y-3"} onSubmit={handleSubmit}>
      <button
        className={`flex w-full items-center justify-center gap-2 rounded-xl bg-black font-black text-white shadow-sm transition hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "px-3 py-2 text-xs" : "px-3 py-3 text-sm"}`}
        disabled={status !== "idle"}
        onClick={() => void handleOpenAuthorizationPage()}
        type="button"
      >
        {status === "opening" ? "Opening..." : "Open authorization page"}
      </button>

      <p className={compact ? "text-[11px] leading-4 text-pilot-muted" : "text-sm leading-6 text-pilot-muted"}>
        Log in on the website, then paste your code here.
      </p>

      <label className="block">
        <span className="sr-only">Authorization code</span>
        <input
          autoCapitalize="characters"
          autoComplete="one-time-code"
          className={`${inputClassName(compact)} text-center tracking-[0.28em]`}
          disabled={status !== "idle"}
          inputMode="text"
          maxLength={6}
          onChange={(event) => setCode(normalizeCode(event.target.value))}
          placeholder="ABC123"
          type="text"
          value={code}
        />
      </label>

      <button
        className={`dh-button-primary w-full ${compact ? "px-3 py-2 text-xs" : "px-3 py-3 text-sm"}`}
        disabled={status !== "idle" || code.length !== 6}
        type="submit"
      >
        {status === "connecting" ? "Connecting..." : "Connect"}
      </button>

      {notice ? (
        <p className={compact ? "text-[11px] leading-4 text-pilot-muted" : "text-sm leading-6 text-pilot-muted"}>
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className={compact ? "text-[11px] leading-4 text-pilot-danger" : "text-sm leading-6 text-pilot-danger"}>
          {error}
        </p>
      ) : null}
    </form>
  );
}

function inputClassName(compact: boolean): string {
  return [
    "w-full border border-pilot-border bg-pilot-card px-3 font-semibold text-pilot-text outline-none transition",
    "placeholder:text-pilot-soft focus:border-pilot-borderStrong disabled:cursor-not-allowed disabled:text-pilot-soft",
    compact ? "rounded-lg py-2 text-xs" : "rounded-xl py-3 text-sm"
  ].join(" ");
}

function messageFor(caught: unknown): string {
  if (caught instanceof AuthError) {
    return caught.message || FRIENDLY_MESSAGE[caught.code];
  }
  const code: AuthErrorCode = "UNKNOWN";
  return FRIENDLY_MESSAGE[code];
}
