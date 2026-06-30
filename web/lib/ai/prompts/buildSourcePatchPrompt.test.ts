import assert from "node:assert/strict";
import { buildSourcePatchPrompt } from "./buildSourcePatchPrompt";

const selectedPrompt = buildSourcePatchPrompt({
  screenshotBase64: "abc",
  scope: "selected-block",
  originalHtml: `<section class="hero"><h1>Old heading</h1></section>`,
  originalCss: `.hero { padding: 64px; }`,
  modifiedHtml: `<section class="hero"><h1>Better heading</h1></section>`,
  modifiedCss: `.hero { padding: 48px; }`,
  recommendations: ["Make the heading clearer."],
  selectedTemplateReference: {
    title: "Feature Bento",
    source: "watermelon-ui",
    implementationHint: "Use asymmetric bento cards with a featured panel."
  },
  selectedAnimationReference: {
    title: "Staggered Reveal",
    source: "motion-primitives",
    implementationHint: "Reveal cards with small delays and reduced-motion fallback."
  },
  candidateFiles: [
    {
      path: "src/Hero.tsx",
      language: "tsx",
      size: 120,
      score: 90,
      reasons: ["content:hero"],
      matchedTokens: ["hero", "heading"],
      snippet: `export function Hero(){return <section className="hero"><h1>Old heading</h1></section>}`
    }
  ]
});

assert.match(selectedPrompt, /Map only the selected rendered block rewrite back to source files/);
assert.match(selectedPrompt, /originalSnippet MUST be copied exactly/);
assert.match(selectedPrompt, /"filePath": "relative\/path\/from\/project\/root"/);
assert.match(selectedPrompt, /src\/Hero\.tsx/);
assert.match(selectedPrompt, /The user explicitly picked this layout\/template\/animation direction/);
assert.match(selectedPrompt, /Feature Bento/);
assert.match(selectedPrompt, /Staggered Reveal/);
assert.match(selectedPrompt, /If a selected template exists, map its structural intent/);
assert.match(selectedPrompt, /If a selected animation exists, map the motion/);

const wholePrompt = buildSourcePatchPrompt({
  screenshotBase64: "abc",
  scope: "whole-page",
  originalHtml: `<main>Old</main>`,
  modifiedHtml: `<main>New</main>`,
  candidateFiles: []
});

assert.match(wholePrompt, /Map the whole rendered page rewrite back to source files/);

console.log("PASS buildSourcePatchPrompt scopes source patch prompts correctly.");
