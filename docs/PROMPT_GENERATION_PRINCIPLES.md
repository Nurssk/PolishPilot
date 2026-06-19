# Prompt Generation Principles

Adapted from `PromptGen.md` for this product. These rules govern how we generate
the Cursor/Codex implementation prompt (and inform the Gemini analysis/image
prompts).

## Core principles

- **Diagnosis before solution.** Detect issues first (Uncodixify local + Gemini),
  then generate a prompt that addresses only what was found.
- **Structured prompt architecture.** Every generated prompt uses a fixed,
  hierarchical section layout (below).
- **Clear role / context / task / constraints / format.** Each is its own
  section with unambiguous, active-voice instructions.
- **Model adaptation.** The Cursor/Codex prompt is **Markdown** (Cursor/Codex and
  Gemini both read Markdown well). The Gemini analysis prompt is Markdown + a
  strict JSON output contract. (Claude-targeted prompts would use XML structure.)
- **Evidence-based recommendations.** Every detected issue carries concrete
  evidence (e.g. "7 elements use radius ≥ 20px"). No vague advice.
- **No vague advice / no over-prescription.** Give the correction *direction*, not
  forced final values; the coding agent decides specifics against the existing
  design system.
- **Preserve user intent and existing UI style.** Default to preserving the
  current visual identity; never redesign unless a detected issue requires it.
- **Ask clarifying questions when information is missing.** When there is no
  capture/analysis yet, the product asks the user to select an area and run
  analysis rather than inventing a prompt. (The product gathers the missing
  inputs through the capture/analyze flow instead of guessing.)

## Prompt architecture

Every generated Cursor/Codex prompt follows this structure (empty sections are
omitted):

```md
# Role

# Context

# Task

# Detected Issues

# Style Preservation Rules

# Constraints

# Expected Output

# Self-check
```

- **Role** — senior frontend engineer + product UI designer working inside the
  user's existing codebase.
- **Context** — selected block context (section/layout), a style summary to
  preserve, and the selected design direction *only if the user explicitly chose
  one*.
- **Task** — fix the detected UI-quality issues; explicitly *not* a redesign.
- **Detected Issues** — only Uncodixify-detected issues, each with title,
  category, evidence, why it matters, and a correction direction. Never invented.
- **Style Preservation Rules** — conditional: "do not change core visual style"
  when no direction is selected; "layout inspiration only, do not copy
  assets/brands/code" when a direction is selected.
- **Constraints** — preserve text/functionality/business logic/data fetching/
  accessibility; use existing components/tokens; prefer small targeted changes.
- **Expected Output** — modify the relevant UI code minimally and return a short
  summary of what changed.
- **Self-check** — a verification checklist the agent runs before finishing.

## What this prevents

- Generic redesign prompts ("make this UI more modern and beautiful").
- Template swaps ("use this template and redesign the section").
- Free restyling ("change colors, fonts, layout, and animations freely").

Instead the prompt says: *fix only the detected issues while preserving the
existing UI identity*, and *use a selected direction as layout inspiration only*.
