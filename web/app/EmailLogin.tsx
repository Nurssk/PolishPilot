"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

type SessionState = {
  email: string;
  code: string;
  token: string;
  loading: boolean;
  busy: boolean;
  step: "email" | "code";
  error: string;
  notice: string;
  debugCode: string | null;
};

const TOKEN_KEY = "polishpilotEmailSessionToken";

export function EmailLogin() {
  const [state, setState] = useState<SessionState>({
    email: "",
    code: "",
    token: "",
    loading: true,
    busy: false,
    step: "email",
    error: "",
    notice: "",
    debugCode: null
  });

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY) ?? "";
    if (!token) {
      setState((current) => ({ ...current, loading: false }));
      return;
    }
    void verifySession(token);
  }, []);

  async function verifySession(token: string) {
    try {
      const response = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const body = (await response.json()) as {
        ok?: boolean;
        user?: { email?: string | null };
        error?: { message?: string };
      };
      if (!response.ok || !body.ok || !body.user?.email) {
        throw new Error(body.error?.message || "Could not verify session.");
      }
      setState((current) => ({
        ...current,
        email: body.user?.email ?? current.email,
        token,
        loading: false,
        error: ""
      }));
    } catch {
      window.localStorage.removeItem(TOKEN_KEY);
      setState((current) => ({ ...current, token: "", loading: false }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.step === "email") {
      await sendCode();
      return;
    }
    await verifyCode();
  }

  async function sendCode() {
    setState((current) => ({ ...current, busy: true, error: "", notice: "", debugCode: null }));
    try {
      const response = await fetch("/api/auth/email/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email })
      });
      const body = (await response.json()) as {
        ok?: boolean;
        email?: string;
        debugCode?: string;
        error?: { message?: string };
      };
      if (!response.ok || !body.ok || !body.email) {
        throw new Error(body.error?.message || "Could not send code.");
      }
      setState((current) => ({
        ...current,
        email: body.email ?? current.email,
        step: "code",
        busy: false,
        notice: `Code sent to ${body.email}.`,
        debugCode: body.debugCode ?? null
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        busy: false,
        error: error instanceof Error ? error.message : "Could not send code."
      }));
    }
  }

  async function verifyCode() {
    setState((current) => ({ ...current, busy: true, error: "" }));
    try {
      const response = await fetch("/api/auth/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.email, code: state.code })
      });
      const body = (await response.json()) as {
        ok?: boolean;
        token?: string;
        user?: { email?: string };
        error?: { message?: string };
      };
      if (!response.ok || !body.ok || !body.token || !body.user?.email) {
        throw new Error(body.error?.message || "Could not verify code.");
      }
      window.localStorage.setItem(TOKEN_KEY, body.token);
      setState((current) => ({
        ...current,
        token: body.token ?? "",
        email: body.user?.email ?? current.email,
        code: "",
        busy: false,
        notice: "",
        debugCode: null
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        busy: false,
        error: error instanceof Error ? error.message : "Could not verify code."
      }));
    }
  }

  function signOut() {
    window.localStorage.removeItem(TOKEN_KEY);
    setState((current) => ({
      ...current,
      token: "",
      code: "",
      step: "email",
      error: "",
      notice: "",
      debugCode: null
    }));
  }

  return (
    <section style={styles.panel}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Account</p>
          <h2 style={styles.title}>Email login</h2>
        </div>
        <span style={styles.status}>
          {state.loading ? "Checking" : state.token ? "Signed in" : "Signed out"}
        </span>
      </div>

      {state.loading ? (
        <p style={styles.muted}>Checking your session...</p>
      ) : state.token ? (
        <div>
          <p style={styles.name}>{state.email}</p>
          <p style={styles.muted}>Session verified by backend.</p>
          <button onClick={signOut} style={styles.button} type="button">
            Sign out
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            autoComplete="email"
            disabled={state.busy || state.step === "code"}
            onChange={(event) =>
              setState((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="you@example.com"
            style={styles.input}
            type="email"
            value={state.email}
          />
          {state.step === "code" ? (
            <input
              autoComplete="one-time-code"
              disabled={state.busy}
              inputMode="numeric"
              maxLength={6}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  code: event.target.value.replace(/\D/g, "").slice(0, 6)
                }))
              }
              placeholder="123456"
              style={styles.input}
              type="text"
              value={state.code}
            />
          ) : null}
          <button disabled={state.busy} style={styles.button} type="submit">
            {state.busy
              ? "Working..."
              : state.step === "email"
                ? "Send code"
                : "Verify code"}
          </button>
        </form>
      )}

      {state.notice ? <p style={styles.muted}>{state.notice}</p> : null}
      {state.debugCode ? (
        <p style={styles.muted}>
          Dev code: <strong>{state.debugCode}</strong>
        </p>
      ) : null}
      {state.error ? <p style={styles.error}>{state.error}</p> : null}
    </section>
  );
}

const styles = {
  panel: {
    width: "min(100%, 440px)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-card)",
    background: "var(--card)",
    boxShadow: "var(--shadow)",
    padding: 24
  },
  header: {
    alignItems: "flex-start",
    display: "flex",
    gap: 16,
    justifyContent: "space-between",
    marginBottom: 24
  },
  eyebrow: {
    color: "var(--muted-2)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0,
    margin: "0 0 6px",
    textTransform: "uppercase"
  },
  title: {
    color: "var(--text)",
    fontSize: 28,
    lineHeight: 1.15,
    margin: 0
  },
  status: {
    background: "var(--soft-bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-control)",
    color: "var(--muted)",
    flexShrink: 0,
    fontSize: 12,
    fontWeight: 700,
    padding: "6px 10px"
  },
  form: {
    display: "grid",
    gap: 12
  },
  input: {
    background: "var(--card-solid)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    color: "var(--text)",
    font: "inherit",
    fontSize: 15,
    fontWeight: 600,
    outline: "none",
    padding: "13px 14px",
    width: "100%"
  },
  button: {
    background: "var(--accent)",
    border: 0,
    borderRadius: "var(--radius-control)",
    boxShadow: "var(--accent-shadow)",
    color: "var(--on-accent)",
    cursor: "pointer",
    font: "inherit",
    fontSize: 15,
    fontWeight: 800,
    padding: "13px 18px",
    width: "100%"
  },
  name: {
    color: "var(--text)",
    fontSize: 17,
    fontWeight: 800,
    margin: "0 0 6px"
  },
  muted: {
    color: "var(--muted)",
    fontSize: 14,
    lineHeight: 1.6,
    margin: "12px 0 0"
  },
  error: {
    color: "var(--danger)",
    fontSize: 14,
    lineHeight: 1.6,
    margin: "12px 0 0"
  }
} satisfies Record<string, CSSProperties>;
