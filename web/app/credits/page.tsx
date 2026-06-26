import type { CSSProperties } from "react";

export default function CreditsPage() {
  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        <p style={styles.eyebrow}>Credits</p>
        <h1 style={styles.title}>Buy more screenshot credits</h1>
        <p style={styles.copy}>
          Add more analysis credits to continue capturing UI sections with Design
          Humanizer.
        </p>
        <div style={styles.card}>
          <div>
            <p style={styles.plan}>Credit pack</p>
            <p style={styles.detail}>Extra screenshot captures for your account.</p>
          </div>
          <a href="mailto:support@polishpilot.app?subject=Buy%20more%20credits" style={styles.button}>
            Contact to buy
          </a>
        </div>
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
  panel: {
    margin: "0 auto",
    maxWidth: 680,
    width: "100%"
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
    fontSize: 48,
    letterSpacing: 0,
    lineHeight: 1.05,
    margin: 0
  },
  copy: {
    color: "var(--muted)",
    fontSize: 18,
    lineHeight: 1.6,
    margin: "20px 0 0"
  },
  card: {
    alignItems: "center",
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 18,
    boxShadow: "var(--shadow)",
    display: "flex",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "space-between",
    marginTop: 28,
    padding: 24
  },
  plan: {
    color: "var(--text)",
    fontSize: 20,
    fontWeight: 900,
    margin: 0
  },
  detail: {
    color: "var(--muted)",
    fontSize: 14,
    lineHeight: 1.6,
    margin: "6px 0 0"
  },
  button: {
    background: "var(--accent)",
    borderRadius: 999,
    color: "var(--on-accent)",
    display: "inline-flex",
    fontSize: 14,
    fontWeight: 800,
    padding: "12px 18px",
    textDecoration: "none"
  }
} satisfies Record<string, CSSProperties>;
