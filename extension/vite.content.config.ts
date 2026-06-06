import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, "src/content/contentScript.ts"),
      output: {
        entryFileNames: "assets/contentScript.js",
        assetFileNames: "assets/[name].[ext]",
        format: "iife",
        inlineDynamicImports: true,
        name: "PolishPilotContentScript"
      }
    }
  }
});
