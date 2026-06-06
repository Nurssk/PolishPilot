import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./sidepanel.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pilot: {
          bg: "#070A12",
          panel: "#0D1220",
          card: "#111827",
          border: "#243044",
          soft: "#9CA3AF",
          text: "#F8FAFC",
          blue: "#60A5FA",
          cyan: "#22D3EE"
        }
      },
      boxShadow: {
        pilot: "0 18px 60px rgba(0, 0, 0, 0.34)"
      }
    }
  },
  plugins: []
} satisfies Config;
