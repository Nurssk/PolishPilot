import type { CSSProperties } from "react";
import { EmailLogin } from "./EmailLogin";

export default function Home() {
  return (
    <main style={styles.page}>
      <section style={styles.content}>
        <div style={styles.copy}>
          <p style={styles.eyebrow}>PolishPilot</p>
          <h1 style={styles.title}>Design Humanizer</h1>
          <p style={styles.lede}>
            Sign in with your email to verify extension requests against the
            backend.
          </p>
          <p style={styles.apiText}>
            API status: <code>/api/analyze-area</code> and <code>/api/me</code>
          </p>
        </div>
        <EmailLogin />
      </section>
    </main>
  );
}

const styles = {
  page: {
    alignItems: "center",
    background:
      "radial-gradient(circle at 16% 0%, var(--paper-glow) 0, transparent 34rem), var(--bg)",
    color: "var(--text)",
    display: "flex",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: "100vh",
    padding: 32
  },
  content: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: 40,
    justifyContent: "space-between",
    margin: "0 auto",
    maxWidth: 1040,
    width: "100%"
  },
  copy: {
    flex: "1 1 320px",
    maxWidth: 520
  },
  eyebrow: {
    color: "var(--muted)",
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0,
    margin: "0 0 12px",
    textTransform: "uppercase"
  },
  title: {
    color: "var(--text)",
    fontSize: 56,
    letterSpacing: 0,
    lineHeight: 1,
    margin: 0
  },
  lede: {
    color: "var(--muted)",
    fontSize: 18,
    lineHeight: 1.6,
    margin: "20px 0 0"
  },
  apiText: {
    color: "var(--muted-2)",
    fontSize: 14,
    lineHeight: 1.6,
    margin: "24px 0 0"
  }
} satisfies Record<string, CSSProperties>;
