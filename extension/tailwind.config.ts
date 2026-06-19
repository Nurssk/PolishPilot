import type { Config } from "tailwindcss";

export default {
  content: ["./*.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pilot: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          surface2: "var(--surface-2)",
          panel: "var(--surface)",
          card: "var(--card)",
          border: "var(--border)",
          borderStrong: "var(--border-strong)",
          soft: "var(--muted-2)",
          text: "var(--text)",
          muted: "var(--muted)",
          faint: "var(--faint)",
          primary: "var(--accent)",
          primaryDeep: "var(--accent-hover)",
          purple: "var(--accent)",
          violet: "var(--accent-hover)",
          glow: "var(--accent-soft)",
          success: "var(--success)",
          warning: "#8a5a16",
          danger: "var(--danger)"
        }
      },
      borderRadius: {
        card: "var(--radius-card)",
        control: "var(--radius-control)"
      },
      boxShadow: {
        pilot: "var(--shadow)",
        glow: "var(--accent-shadow)"
      }
    }
  },
  plugins: []
} satisfies Config;
