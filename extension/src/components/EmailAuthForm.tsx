import { FormEvent, useState } from "react";
import {
  AuthError,
  requestEmailCode,
  verifyEmailCode,
  type AuthErrorCode,
  type ExtensionUser
} from "../shared/authService";

const FRIENDLY_MESSAGE: Record<AuthErrorCode, string> = {
  AUTH_NOT_CONFIGURED: "Email login is not configured yet.",
  INVALID_EMAIL: "Enter a valid email address.",
  INVALID_CODE: "Enter the 6-digit code from your email.",
  CODE_EXPIRED: "The code expired. Send a new one.",
  CODE_SEND_FAILED: "Could not send the code. Try again later.",
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
  const [status, setStatus] = useState<"idle" | "sending" | "verifying">("idle");
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

function inputClassName(compact: boolean): string {
  return [
    "w-full border border-pilot-border bg-pilot-card px-3 font-semibold text-pilot-text outline-none transition",
    "placeholder:text-pilot-soft focus:border-pilot-borderStrong disabled:cursor-not-allowed disabled:text-pilot-soft",
    compact ? "rounded-lg py-2 text-xs" : "rounded-xl py-3 text-sm"
  ].join(" ");
}

function messageFor(caught: unknown): string {
  const code: AuthErrorCode = caught instanceof AuthError ? caught.code : "UNKNOWN";
  return FRIENDLY_MESSAGE[code];
}
