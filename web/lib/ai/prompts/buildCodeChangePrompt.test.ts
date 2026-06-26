// Run with: npx tsx web/lib/ai/prompts/buildCodeChangePrompt.test.ts
import assert from "node:assert/strict";
import {
  buildCodeChangePrompt,
  type GenerateCodeChangeRequest
} from "./buildCodeChangePrompt";

const baseRequest: GenerateCodeChangeRequest = {
  screenshotBase64: "base64",
  scope: "selected-block",
  title: "Code change test",
  originalHtml: `<section><h1>Launch faster</h1><p>Generic copy with too many words.</p><button>Start</button></section>`,
  selectedHtml: `<section><h1>Launch faster</h1><p>Generic copy with too many words.</p><button>Start</button></section>`,
  fullPageHtml: `<html><body><nav>Nav</nav><section><h1>Launch faster</h1></section><footer>Footer</footer></body></html>`,
  usedCss: `.hero { border-radius: 32px; }`,
  recommendations: [
    "Reduce dense copy and make the CTA clearer.",
    "Reduce oversized radius."
  ],
  aiResult: {
    sectionType: "hero",
    layoutType: "vertical_stack"
  }
};

const selectedPrompt = buildCodeChangePrompt(baseRequest);

assert.match(selectedPrompt, /Scope: selected-block/);
assert.match(selectedPrompt, /Rewrite ONLY the selected block/);
assert.match(selectedPrompt, /Return modifiedHtml for that selected block only/);
assert.match(selectedPrompt, /Do not rewrite the full page/);
assert.match(selectedPrompt, /FULL_PAGE_HTML_CONTEXT:\nNot included because selected-block scope is active\./);
assert.match(selectedPrompt, /HTML\/CSS is rendered DOM\/CSS and must be mapped to React\/Next\/Vue\/static source files/);
assert.match(selectedPrompt, /Reduce dense copy/);
assert.match(selectedPrompt, /USED_CSS:/);
assert.match(selectedPrompt, /"modifiedCss": "string"/);
assert.match(selectedPrompt, /"fullHtmlDocument": "string"/);
assert.match(selectedPrompt, /modifiedCss must include the CSS required to render modifiedHtml/);
assert.match(selectedPrompt, /standalone \.html file/);
assert.match(selectedPrompt, /Return JSON only/);

const wholePagePrompt = buildCodeChangePrompt({
  ...baseRequest,
  scope: "whole-page",
  originalHtml: baseRequest.fullPageHtml ?? ""
});

assert.match(wholePagePrompt, /Scope: whole-page/);
assert.match(wholePagePrompt, /Rewrite the full rendered HTML document/);
assert.match(wholePagePrompt, /Keep unrelated areas stable/);
assert.match(wholePagePrompt, /FULL_PAGE_HTML_CONTEXT:\n<html><body><nav>Nav<\/nav>/);
assert.doesNotMatch(
  wholePagePrompt,
  /FULL_PAGE_HTML_CONTEXT:\nNot included because selected-block scope is active\./
);
assert.match(wholePagePrompt, /The HTML is a rendered DOM snapshot/);

console.log("PASS buildCodeChangePrompt scopes code rewrite prompts correctly.");
