"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

const TOKEN_KEY = "polishpilotEmailSessionToken";

type CodeState = {
  loading: boolean;
  busy: boolean;
  email: string;
  code: string;
  expiresAt: string;
  error: string;
  notice: string;
};

export function ExtensionCodePage() {
  const [state, setState] = useState<CodeState>({
    loading: true,
    busy: false,
    email: "",
    code: "",
    expiresAt: "",
    error: "",
    notice: ""
  });
  const [now, setNow] = useState(Date.now());

  const loadCode = useCallback(async () => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (!token) {
      window.location.assign("/extension/authorize");
      return;
    }

    setState((current) => ({ ...current, busy: true, error: "", notice: "" }));
    try {
      const response = await fetch("/api/extension-auth/code", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const body = (await response.json()) as {
        ok?: boolean;
        email?: string;
        code?: string;
        expiresAt?: string;
        error?: { message?: string };
      };
      if (!response.ok || !body.ok || !body.email || !body.code || !body.expiresAt) {
        throw new Error(body.error?.message || "Could not create an extension code.");
      }
      setState({
        loading: false,
        busy: false,
        email: body.email,
        code: body.code,
        expiresAt: body.expiresAt,
        error: "",
        notice: ""
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        busy: false,
        error: error instanceof Error ? error.message : "Could not create an extension code."
      }));
    }
  }, []);

  useEffect(() => {
    void loadCode();
  }, [loadCode]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const expiresLabel = useMemo(() => {
    if (!state.expiresAt) return "";
    const remaining = Math.max(0, Date.parse(state.expiresAt) - now);
    const minutes = Math.floor(remaining / 60_000);
    const seconds = Math.floor((remaining % 60_000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [now, state.expiresAt]);

  async function copyCode() {
    if (!state.code) return;
    await navigator.clipboard.writeText(state.code);
    setState((current) => ({
      ...current,
      notice: "Code copied. Paste it into the Chrome extension."
    }));
  }

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <aside style={styles.instructions}>
          <div style={styles.logo}>DH</div>
          <h1 style={styles.title}>Your extension code</h1>
          <p style={styles.lede}>Copy this one-time code into the Chrome extension with the same email.</p>

          <div style={styles.steps}>
            <Step index={1} title="Use the same email">
              The extension checks that the email matches this signed-in account.
            </Step>
            <Step index={2} title="Use it once">
              The code expires in 10 minutes and is marked used after exchange.
            </Step>
          </div>
        </aside>

        <section style={styles.content}>
          <h2 style={styles.heading}>Code ready</h2>
          <p style={styles.subheading}>Paste this code into the Chrome extension.</p>

          <div style={styles.codeCard}>
            <p style={styles.label}>One-time code</p>
            <div style={styles.code}>{state.loading ? "------" : formatCode(state.code)}</div>
            <p style={styles.expiry}>
              {state.expiresAt ? `Expires in ${expiresLabel}` : "Generating code..."}
            </p>
          </div>

          <div style={styles.actions}>
            <button disabled={!state.code || state.busy} onClick={copyCode} style={styles.primary} type="button">
              Copy code
            </button>
            <button disabled={state.busy} onClick={() => void loadCode()} style={styles.secondary} type="button">
              {state.busy ? "Working..." : "New code"}
            </button>
          </div>

          {state.email ? <p style={styles.success}>Signed in as {state.email}</p> : null}
          {state.notice ? <p style={styles.success}>{state.notice}</p> : null}
          {state.error ? <p style={styles.error}>{state.error}</p> : null}
        </section>
      </section>
    </main>
  );
}

function Step({ children, index, title }: { children: string; index: number; title: string }) {
  return (
    <div style={styles.step}>
      <span style={styles.stepNumber}>{index}</span>
      <div>
        <h3 style={styles.stepTitle}>{title}</h3>
        <p style={styles.stepText}>{children}</p>
      </div>
    </div>
  );
}

function formatCode(code: string): string {
  return code ? `${code.slice(0, 3)} ${code.slice(3)}` : "";
}

const styles = {
  page: {
    alignItems: "center",
    background: "var(--bg)",
    color: "var(--text)",
    display: "flex",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: "100vh",
    padding: 32
  },
  shell: {
    background: "var(--card-solid)",
    border: "1px solid var(--border)",
    borderRadius: 28,
    boxShadow: "var(--shadow)",
    display: "grid",
    gridTemplateColumns: "0.9fr 1fr",
    margin: "0 auto",
    maxWidth: 1280,
    minHeight: 680,
    overflow: "hidden",
    width: "100%"
  },
  instructions: {
    background: "var(--surface)",
    display: "flex",
    flexDirection: "column",
    gap: 36,
    justifyContent: "center",
    padding: "64px 56px"
  },
  logo: {
    alignItems: "center",
    background: "var(--accent)",
    borderRadius: 24,
    boxShadow: "var(--accent-shadow)",
    color: "var(--on-accent)",
    display: "flex",
    fontSize: 24,
    fontWeight: 900,
    height: 80,
    justifyContent: "center",
    width: 80
  },
  title: {
    fontSize: "clamp(52px, 7vw, 88px)",
    letterSpacing: 0,
    lineHeight: 0.96,
    margin: 0
  },
  lede: {
    color: "var(--muted)",
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.35,
    margin: 0
  },
  steps: {
    borderTop: "1px solid var(--border)",
    display: "grid"
  },
  step: {
    borderBottom: "1px solid var(--border)",
    display: "grid",
    gap: 18,
    gridTemplateColumns: "44px 1fr",
    padding: "24px 0"
  },
  stepNumber: {
    alignItems: "center",
    background: "var(--accent)",
    borderRadius: "50%",
    color: "var(--on-accent)",
    display: "flex",
    fontSize: 18,
    fontWeight: 900,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  stepTitle: {
    fontSize: 22,
    lineHeight: 1.2,
    margin: "0 0 12px"
  },
  stepText: {
    color: "var(--muted)",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.35,
    margin: 0
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "64px 56px"
  },
  heading: {
    fontSize: 48,
    lineHeight: 1,
    margin: "0 0 18px"
  },
  subheading: {
    color: "var(--muted)",
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.3,
    margin: "0 0 28px"
  },
  codeCard: {
    background: "var(--accent)",
    borderRadius: 18,
    color: "var(--on-accent)",
    padding: "42px 40px"
  },
  label: {
    color: "var(--faint)",
    fontSize: 16,
    fontWeight: 900,
    margin: "0 0 28px",
    textTransform: "uppercase"
  },
  code: {
    fontSize: "clamp(56px, 8vw, 96px)",
    fontWeight: 950,
    letterSpacing: 0,
    lineHeight: 0.95,
    minHeight: 92,
    overflowWrap: "anywhere"
  },
  expiry: {
    color: "var(--faint)",
    fontSize: 18,
    fontWeight: 900,
    margin: "30px 0 0"
  },
  actions: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "1fr 190px",
    marginTop: 24
  },
  primary: {
    background: "var(--accent)",
    border: "1px solid var(--accent)",
    borderRadius: 14,
    color: "var(--on-accent)",
    cursor: "pointer",
    fontSize: 22,
    fontWeight: 900,
    minHeight: 70
  },
  secondary: {
    background: "var(--card-solid)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    color: "var(--text)",
    cursor: "pointer",
    fontSize: 22,
    fontWeight: 900,
    minHeight: 70
  },
  success: {
    color: "#147d3f",
    fontSize: 18,
    fontWeight: 900,
    margin: "22px 0 0"
  },
  error: {
    color: "var(--danger)",
    fontSize: 18,
    fontWeight: 900,
    margin: "22px 0 0"
  }
} satisfies Record<string, CSSProperties>;
