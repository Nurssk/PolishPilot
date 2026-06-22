"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { EmailLogin } from "../../EmailLogin";

const TOKEN_KEY = "polishpilotEmailSessionToken";

export function AuthorizeExtensionPage() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const token = window.localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const response = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const body = (await response.json()) as { ok?: boolean };
        if (response.ok && body.ok) {
          window.location.assign("/extension/code");
          return;
        }
      } catch {
        // Stay on the login screen.
      }
      setChecking(false);
    }

    void checkSession();
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <div style={styles.copy}>
          <div style={styles.logo}>DH</div>
          <h1 style={styles.title}>Connect your extension</h1>
          <p style={styles.lede}>
            Sign in on the website, then continue to get a one-time code for the
            Chrome extension.
          </p>
        </div>

        <div style={styles.panel}>
          {checking ? (
            <p style={styles.muted}>Checking your session...</p>
          ) : (
            <>
              <EmailLogin />
              <a href="/extension/code" style={styles.button}>
                Continue
              </a>
            </>
          )}
        </div>
      </section>
    </main>
  );
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
    alignItems: "center",
    display: "grid",
    gap: 48,
    gridTemplateColumns: "minmax(280px, 0.9fr) minmax(320px, 1fr)",
    margin: "0 auto",
    maxWidth: 1100,
    width: "100%"
  },
  copy: {
    display: "grid",
    gap: 24
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
    fontSize: "clamp(48px, 7vw, 92px)",
    letterSpacing: 0,
    lineHeight: 0.95,
    margin: 0
  },
  lede: {
    color: "var(--muted)",
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1.35,
    margin: 0,
    maxWidth: 560
  },
  panel: {
    display: "grid",
    gap: 18,
    justifyItems: "stretch"
  },
  button: {
    alignItems: "center",
    background: "var(--accent)",
    borderRadius: "var(--radius-control)",
    color: "var(--on-accent)",
    display: "flex",
    fontSize: 18,
    fontWeight: 900,
    justifyContent: "center",
    minHeight: 58,
    textDecoration: "none"
  },
  muted: {
    color: "var(--muted)",
    fontSize: 18,
    fontWeight: 700
  }
} satisfies Record<string, CSSProperties>;
