import assert from "node:assert/strict";
import {
  applyExactSourceEdit,
  buildSourceSearchTokens,
  isLikelySourceFile,
  rankSourceFileCandidates,
  shouldSkipSourceDirectory
} from "./sourcePatch";
import type { SourcePatchEdit } from "../shared/types";

assert.equal(shouldSkipSourceDirectory("node_modules"), true);
assert.equal(shouldSkipSourceDirectory("src"), false);
assert.equal(isLikelySourceFile("src/Hero.tsx", 1200), true);
assert.equal(isLikelySourceFile("dist/Hero.tsx", 1200), true);
assert.equal(isLikelySourceFile("src/bundle.min.css", 1200), false);
assert.equal(isLikelySourceFile("src/Hero.tsx", 999_999), false);

const context = {
  title: "Vzyal landing",
  originalHtml: `
    <section id="hero" class="hero-section">
      <h1>Спасай еду, экономь деньги</h1>
      <a class="hero-store-btn" href="#app-store">Скачать в App Store</a>
    </section>
  `,
  modifiedHtml: `<section class="hero-section"><h1>Спасай еду и покупай выгоднее</h1></section>`,
  originalCss: ".hero-section { color: #111; }",
  recommendations: ["Reduce text density and improve CTA hierarchy."]
};

const tokens = buildSourceSearchTokens(context);
assert.ok(tokens.includes("hero-section"));
assert.ok(tokens.includes("app-store"));

const candidates = rankSourceFileCandidates(
  [
    {
      path: "src/components/Hero.tsx",
      content: `export function Hero(){return <section className="hero-section"><h1>Спасай еду, экономь деньги</h1></section>}`
    },
    {
      path: "src/components/Footer.tsx",
      content: `export function Footer(){return <footer>Contacts</footer>}`
    }
  ],
  context
);

assert.equal(candidates[0]?.path, "src/components/Hero.tsx");
assert.ok(candidates[0]?.score > 0);

const edit: SourcePatchEdit = {
  id: "edit-1",
  filePath: "src/components/Hero.tsx",
  originalSnippet: "Спасай еду, экономь деньги",
  replacementSnippet: "Спасай еду и покупай выгоднее",
  explanation: "Tighten heading copy.",
  confidence: 0.91
};

const applied = applyExactSourceEdit(
  `export const title = "Спасай еду, экономь деньги";`,
  edit
);
assert.equal(applied.status.status, "applied");
assert.match(applied.content, /покупай выгоднее/);

const blocked = applyExactSourceEdit(`export const title = "Other";`, edit);
assert.equal(blocked.status.status, "blocked");

const duplicate = applyExactSourceEdit(
  `Спасай еду, экономь деньги\nСпасай еду, экономь деньги`,
  edit
);
assert.equal(duplicate.status.status, "blocked");

console.log("PASS sourcePatch ranks candidates and applies exact edits.");
