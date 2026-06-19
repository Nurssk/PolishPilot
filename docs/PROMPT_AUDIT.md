# Prompt Audit

This document inventories every prompt the product generates or sends. It is the
reference for understanding (and safely changing) prompt behavior.

## Prompt sources (files)

| Prompt | File | Runs where |
| --- | --- | --- |
| Gemini UI analysis | `web/app/api/analyze-area/route.ts` (`SYSTEM_PROMPT`, `RESPONSE_SHAPE`, `buildGeminiPrompt`) | Backend (Next.js / Vercel) |
| AI image preview | `web/lib/ai/prompts/buildImagePreviewPrompt.ts` (`buildImagePreviewPrompt`) | Backend, called from `web/app/api/generate-ai-preview/route.ts` |
| Cursor/Codex prompt | `extension/src/patterns/generateCursorPrompt.ts` (`generateCursorPrompt`) | Extension (client) |

Supporting inputs:
- Uncodixify rules/analysis: `extension/src/analysis/{uncodixifyRules,runLocalUncodixifyCheck,buildUncodixifyAnalysis,analyzeUncodixify}.ts`
- Layout/template/animation suggestions: `extension/src/patterns/{layoutPatterns,templateReferences,animationReferences,selectHumanizerSuggestions}.ts`
- Extracted style: `extension/src/content/{extractStyleTokens,extractUsedCssRules}.ts`

---

## 1. Gemini Analysis Prompt

- **File:** `web/app/api/analyze-area/route.ts`
- **Inputs used:** screenshot (PNG, sent as a separate `inlineData` image part — **not** in the text prompt), `url`, `title`, `selectedRect`, element `counts`, local `detected` summary, and up to 30 compacted `matchedElements` (tag, classes, role, aria, truncated text, and computed style fields: bg/color/font/border/radius/shadow/padding/margin).
- **Final prompt structure (text part):**
  1. `SYSTEM_PROMPT` — role + analysis instructions, including the **Uncodixify visual quality check** section that lists the AI-pattern checks and constrains `detectedRuleIds` to the fixed rule-id list.
  2. `Selected area context:` — JSON of the compact context above.
  3. `RESPONSE_SHAPE` — the exact JSON schema to return (includes the `uncodixify` block).
- **Includes screenshot?** Yes, but as a separate image payload (`inlineData`), never as base64 inside the text prompt.
- **Includes DOM/CSS?** Yes — compacted matched elements + computed style fields + counts.
- **Includes Uncodixify rules?** Yes — the check list and the allowed rule-id set are embedded; Gemini must only report visible/CSS-supported issues.
- **Expected JSON output:** `AIUnderstandingResult` — `sectionType`, `layoutType`, `contentType`, `confidence`, `detectedBlocks[]`, `detectedKeywords[]`, `designIntent`, `uiProblems[]`, `recommendedCategories`, `animationKeywords[]`, `designerDescription`, `currentLayoutProblem`, `reasoning[]`, and `uncodixify { summary, detectedRuleIds[], visualEvidence[], topRecommendations[] }`. Parsed/repaired/sanitized server-side; a local fallback result is used if Gemini JSON fails.

---

## 2. AI Image Preview Prompt

- **File:** `web/lib/ai/prompts/buildImagePreviewPrompt.ts` (called by `web/app/api/generate-ai-preview/route.ts`)
- **Inputs used:** screenshot (separate image part), `aiResult` (section/layout/description/problem/detected blocks), `selectedPattern`, `selectedTemplateReference`, `selectedAnimationReference`, `previewContent` (extracted titles/eyebrows/items/icons), `styleContext`, and `uncodixify.recommendations` (the included fixes).
- **Final prompt structure:** role → source rules → selected layout pattern → template reference → animation reference → current UI understanding → extracted content (eyebrow/title/subtitle/items) → extracted style context → strict rules (1–20) → optional **"Improve this UI according to these Uncodixify recommendations"** block → "Create one polished visual mockup".
- **Preserves text?** Yes — rule 1 "Preserve all visible text exactly", rules 2–3 forbid translating/rewriting; the Uncodixify block ends with "preserve all visible text exactly."
- **Preserves key visual style?** Yes — rule 14 "Preserve the original visual style as much as possible"; only card layout/hierarchy/spacing/emphasis change (rule 15). Style context (colors/radius/shadow/fonts) is passed in.
- **Includes selected recommendations?** Yes — only when `uncodixify.recommendations` is non-empty (the included fixes from the side panel).
- **Includes layout/template/animation choices?** Yes — pattern always; template/animation only when selected (otherwise "None selected"). Animation is represented as static visual direction only (rule 20).

---

## 3. Cursor/Codex Prompt

- **File:** `extension/src/patterns/generateCursorPrompt.ts`
- **Inputs used:** `aiResult`, `capture` (style tokens/context), `designDirectionSelected` (whether the user actively chose a layout/template/animation), optional `pattern`/`templateReference`/`animationReference`, and `uncodixify` + `includedUncodixifyRuleIds` (the fixes toggled "in prompt").
- **Final prompt structure (Markdown):**
  - `# Task`
  - `# Context` (section/layout + "Current visual style to preserve")
  - `# Important Style Preservation Rule` — **conditional** (see below)
  - `# Detected Issues` — only the included Uncodixify findings (or a "looks clean" message)
  - `# Selected Design Direction (inspiration only)` — **only when a direction was selected**
  - `# Implementation Constraints`
  - `# Expected Output`
- **Changes based on selected recommendations?** Yes — only `includedUncodixifyRuleIds` findings appear in `# Detected Issues`; toggling a recommendation off removes it from the prompt. Each issue lists title, category, evidence, why-it-matters, and a general correction direction (not forced values).
- **Changes based on selected layout/template/animation?** Yes — when `designDirectionSelected` is true, a "Selected Design Direction (inspiration only)" section is added (pattern as structural inspiration; template/animation as visual/motion inspiration, "do not copy code/assets/brands"). When false, that section is omitted entirely.
- **Tells the agent to preserve content and style?** Yes, strongly:
  - **No direction selected:** "Do not change the core visual style… Do not redesign this into a different template. Only fix the detected UI issues listed below. Preserve the current colors, typography, spacing rhythm, component structure, and content unless a detected issue specifically requires adjustment."
  - **Direction selected:** "Use the selected design direction as inspiration for layout structure only. Do not copy external assets, brands, logos, or exact code. Preserve the current content and product meaning. Keep the core visual identity unless a detected issue specifically says to change it."
  - Plus `# Implementation Constraints` (don't rewrite text/functionality/data; prefer small targeted changes; use existing components/tokens).

---

## PromptGen Principle Integration

The Cursor/Codex prompt generator now follows the architecture from PromptGen.md
(see `docs/PROMPT_GENERATION_PRINCIPLES.md`):
- Role

- Task
- Detected Issues
- Style Preservation Rules
- Constraints
- Expected Output
- Self-check

Behavior:
- **Clarification.** When there is no capture/analysis yet, the product does not
  fabricate a prompt — the side panel asks the user to select an area and run
  analysis (the missing inputs are gathered through the capture/analyze flow).
- **Style preservation.** By default (no design direction selected) the prompt
  says "Do not change the core visual style…", preserving colors, typography,
  content structure, spacing rhythm, and component identity.
- **Design direction.** Only when the user *actively* selects a layout/template/
  animation does the prompt add a "Selected design direction (inspiration only)"
  block in Context and switch the Style Preservation Rules to "layout inspiration
  only — do not copy assets/brands/code", while still preserving the existing
  identity.
- **Evidence-based, not over-prescriptive.** Detected issues carry concrete
  evidence and a correction *direction* (not forced final values). The coding
  agent decides specifics against the existing design system.
- **Validation.** `extension/src/patterns/validateGeneratedPrompt.ts` checks the
  prompt for required sections, correct style-preservation rule, absence of
  generic-redesign instructions, and absence of base64/secrets. Developer Mode →
  Prompt Debug shows the validation status (Valid / Warnings / Errors).

## Safety notes

- No prompt text part ever contains screenshot base64 — screenshots are sent as separate image payloads. In debug/logging, screenshots are referenced as `[screenshot image attached separately]`.
- API keys are read from environment variables server-side and never placed in prompts, responses, or logs.
- Developer Mode → **Prompt Debug** (extension side panel) shows the analysis prompt summary, the AI image prompt, and the full Cursor prompt, with base64 defensively redacted.
- Development-only safe logging records prompt **type, character length, and section/selection counts** — never content, base64, or secrets.
