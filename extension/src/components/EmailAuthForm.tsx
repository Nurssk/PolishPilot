import { FormEvent, useState } from "react";
import {
  AuthError,
  getGoogleAuthPageUrl,
  requestEmailCode,
  signInWithGoogle,
  verifyEmailCode,
  type AuthErrorCode,
  type ExtensionUser
} from "../shared/authService";

const FRIENDLY_MESSAGE: Record<AuthErrorCode, string> = {
  AUTH_NOT_CONFIGURED: "Email login is not configured yet.",
  GOOGLE_AUTH_NOT_CONFIGURED: "Google sign-in is not configured yet.",
  INVALID_EMAIL: "Enter a valid email address.",
  INVALID_CODE: "Enter the 6-digit code from your email.",
  CODE_EXPIRED: "The code expired. Send a new one.",
  CODE_SEND_FAILED: "Could not send the code. Try again later.",
  INVALID_OAUTH_CLIENT: "Google OAuth is misconfigured.",
  USER_CANCELLED: "Sign-in was cancelled.",
  NETWORK_ERROR: "Network error. Check your connection and try again.",
  FLOW_FAILED: "Could not complete sign-in. Please try again.",
  UNKNOWN: "Could not sign in. Please try again."
};

type EmailAuthFormProps = {
  compact?: boolean;
  onSignedIn: (user: ExtensionUser) => void;
};

export function EmailAuthForm({ compact = false, onSignedIn }: EmailAuthFormProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [status, setStatus] = useState<"idle" | "google" | "sending" | "verifying">("idle");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [debugCode, setDebugCode] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === "email") {
      await sendCode();
      return;
    }
    await verifyCode();
  }

  async function handleGoogleSignIn() {
    setStatus("google");
    setError("");
    setNotice("");
    setDebugCode(null);
    try {
      const user = await signInWithGoogle();
      onSignedIn(user);
    } catch (caught) {
      setError(messageFor(caught));
    } finally {
      setStatus("idle");
    }
  }

  async function sendCode() {
    setStatus("sending");
    setError("");
    setNotice("");
    setDebugCode(null);
    try {
      const result = await requestEmailCode(email);
      setEmail(result.email);
      setStep("code");
      setNotice(`Code sent to ${result.email}.`);
      setDebugCode(result.debugCode ?? null);
    } catch (caught) {
      setError(messageFor(caught));
    } finally {
      setStatus("idle");
    }
  }

  async function verifyCode() {
    setStatus("verifying");
    setError("");
    try {
      const user = await verifyEmailCode(email, code);
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
        className={`dh-button-secondary flex w-full items-center justify-center gap-2 ${compact ? "px-3 py-2 text-xs" : "px-3 py-3 text-sm"}`}
        disabled={status !== "idle"}
        onClick={handleGoogleSignIn}
        type="button"
      >
        <GoogleMark />
        {status === "google" ? "Opening Google..." : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 text-pilot-soft">
        <span className="h-px flex-1 bg-pilot-border" />
        <span className={compact ? "text-[10px] font-bold uppercase" : "text-xs font-bold uppercase"}>
          or
        </span>
        <span className="h-px flex-1 bg-pilot-border" />
      </div>

      <label className="block">
        <span className="sr-only">Email</span>
        <input
          autoComplete="email"
          className={inputClassName(compact)}
          disabled={status !== "idle" || step === "code"}
          inputMode="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          type="email"
          value={email}
        />
      </label>

      {step === "code" ? (
        <label className="block">
          <span className="sr-only">Verification code</span>
          <input
            autoComplete="one-time-code"
            className={inputClassName(compact)}
            disabled={status !== "idle"}
            inputMode="numeric"
            maxLength={6}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="123456"
            type="text"
            value={code}
          />
        </label>
      ) : null}

      <button
        className={`dh-button-primary w-full ${compact ? "px-3 py-2 text-xs" : "px-3 py-3 text-sm"}`}
        disabled={status !== "idle"}
        type="submit"
      >
        {status === "sending"
          ? "Sending..."
          : status === "verifying"
            ? "Verifying..."
            : step === "email"
              ? "Send code"
              : "Verify code"}
      </button>

      {step === "code" ? (
        <button
          className={`dh-button-secondary w-full ${compact ? "px-3 py-2 text-xs" : "px-3 py-2.5 text-sm"}`}
          disabled={status !== "idle"}
          onClick={() => {
            setStep("email");
            setCode("");
            setNotice("");
            setError("");
            setDebugCode(null);
          }}
          type="button"
        >
          Change email
        </button>
      ) : null}

      {notice ? (
        <p className={compact ? "text-[11px] leading-4 text-pilot-muted" : "text-sm leading-6 text-pilot-muted"}>
          {notice}
        </p>
      ) : null}
      {debugCode ? (
        <p className={compact ? "text-[11px] leading-4 text-pilot-muted" : "text-sm leading-6 text-pilot-muted"}>
          Dev code: <span className="font-bold text-pilot-text">{debugCode}</span>
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

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
        fill="#EA4335"
      />
    </svg>
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
  const code: AuthErrorCode = caught instanceof AuthError ? caught.code : "UNKNOWN";
  if (code === "INVALID_OAUTH_CLIENT" || code === "FLOW_FAILED") {
    const authPageUrl = getGoogleAuthPageUrl();
    if (authPageUrl) {
      return `${FRIENDLY_MESSAGE[code]} Check Firebase Authorized domains for the auth page: ${authPageUrl}`;
    }
  }
  return FRIENDLY_MESSAGE[code];
}
