// Run with: npx tsx extension/src/content/htmlSnapshot.test.ts
import assert from "node:assert/strict";
import { sanitizeHtmlSnapshot } from "./htmlSnapshot";

const dirtyHtml = `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <meta name="tracking-id" content="abc">
    <link rel="preload" href="/font.woff2">
    <style>.hero { color: red; }</style>
    <script>window.secret = "token";</script>
  </head>
  <body>
    <div id="polishpilot-rectangle-overlay" data-polishpilot="true">
      <div>Extension overlay</div>
    </div>
    <section class="hero" onclick="alert(1)">
      <h1>Make launches feel calm</h1>
      <p>Ship work without noisy handoffs.</p>
      <a href="javascript:alert(1)">Start now</a>
      <img src="data:image/png;base64,${"a".repeat(900)}" alt="Preview">
    </section>
  </body>
</html>`;

const sanitized = sanitizeHtmlSnapshot(dirtyHtml, {
  scope: "whole-page",
  maxLength: 20_000
});

assert.match(sanitized, /<h1>Make launches feel calm<\/h1>/);
assert.match(sanitized, /<p>Ship work without noisy handoffs\.<\/p>/);
assert.match(sanitized, /<a href="blocked-javascript:alert\(1\)">Start now<\/a>/);
assert.match(sanitized, /<meta charset="UTF-8">/);
assert.match(sanitized, /<meta name="viewport"/);
assert.doesNotMatch(sanitized, /<script/i);
assert.doesNotMatch(sanitized, /<style/i);
assert.doesNotMatch(sanitized, /tracking-id/);
assert.doesNotMatch(sanitized, /preload/);
assert.doesNotMatch(sanitized, /onclick/);
assert.doesNotMatch(sanitized, /polishpilot-rectangle-overlay/);
assert.doesNotMatch(sanitized, /data:image\/png;base64/);

const capped = sanitizeHtmlSnapshot(`<main>${"x".repeat(200)}</main>`, {
  maxLength: 50
});

assert.ok(capped.length > 50);
assert.match(capped, /truncated:/);

console.log("PASS htmlSnapshot sanitizes and caps rendered HTML.");
