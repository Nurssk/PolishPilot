# Design Humanizer

## One-Liner

Design Humanizer is a Chrome extension, currently implemented under the PolishPilot name, that helps developers turn generic AI-generated UI into more deliberate, structured, and usable layouts without changing the underlying content.

## Problem

AI app builders can generate interfaces quickly, but the first result often looks flat: equal cards everywhere, weak hierarchy, repetitive grids, vague spacing, and sections that do not communicate priority. Developers then need to manually decide how to improve the layout, preserve existing content, keep styles consistent, and write a useful prompt for a coding agent.

The product exists to bridge that gap. It acts as a design polish layer on top of the user's own running website or app.

## Target Users

- Developers building with AI coding tools who need better UI structure.
- Indie hackers and founders shipping landing pages, SaaS screens, dashboards, and onboarding flows.
- Frontend engineers who want layout alternatives without opening a full design tool.
- AI-app builders who need a better prompt for Cursor, Codex, or similar coding agents.

## What The Product Does

Design Humanizer lets the user select an area of their own webpage, analyzes the selected screenshot plus DOM/CSS context, classifies the section, suggests curated layout transformations, previews the result as live HTML/CSS, and generates a coding-agent prompt for applying the selected pattern.

The product is not trying to make a new design from nothing. It rearranges the existing section into a stronger layout while preserving content and visual style.

## Current Implemented Architecture

The repo currently has two main apps:

- `extension/`: a Manifest V3 Chrome extension built with Vite, React, TypeScript, and Tailwind CSS.
- `web/`: a Next.js backend that exposes Gemini analysis endpoints.

Implemented extension pieces:

- Popup entry point: `extension/src/popup/Popup.tsx`
- Side panel control surface: `extension/src/sidepanel/SidePanel.tsx`
- Background service worker: `extension/src/background/serviceWorker.ts`
- Page content script: `extension/src/content/contentScript.ts`
- Local layout pattern library: `extension/src/patterns/layoutPatterns.ts`
- Pattern selection rules: `extension/src/patterns/selectPatterns.ts`
- Preview content extraction: `extension/src/patterns/extractPreviewItems.ts`
- Live React preview: `extension/src/components/LiveLayoutPreview.tsx`
- Small pattern thumbnails: `extension/src/components/PatternPreview.tsx`
- Full preview page in a new tab: `extension/src/fullPreview/FullPreviewPage.tsx`
- Cursor prompt generation: `extension/src/patterns/generateCursorPrompt.ts`

Implemented backend pieces:

- `web/app/api/health/route.ts`: health check endpoint.
- `web/app/api/analyze-area/route.ts`: Gemini analysis endpoint with CORS, request IDs, safe debug metadata, timeout, retry, and structured error responses.

## Main User Flow

1. The user opens the extension popup.
2. The popup opens the Chrome side panel and sends `START_RECTANGLE_SELECTION` to the active tab.
3. The content script renders a temporary rectangle-selection overlay on the webpage.
4. The user drags over a UI section.
5. The content script collects:
   - selected rectangle coordinates,
   - visible DOM elements inside the selection,
   - element counts,
   - rough local section/layout detection,
   - representative CSS/style context.
6. The background service worker captures the visible tab, crops the screenshot to the selected rectangle, and stores the latest capture in `chrome.storage.session`.
7. The side panel shows the screenshot and analysis controls.
8. Gemini analyzes the screenshot plus compact DOM/CSS summary through the Next.js backend.
9. The side panel uses Gemini's section/layout classification to select patterns from the local curated pattern database.
10. The user selects a pattern.
11. The user can:
    - open a full live preview in a new tab,
    - show an in-page overlay preview on the current site,
    - copy a Cursor/Codex prompt for applying the layout.

The side panel also includes a `New Screenshot` button so users can start a new rectangle selection without returning to the popup.

## Simple Mode vs Developer Mode

Simple Mode is designed for the normal product experience:

- The popup button says `Improve Selected Area`.
- Gemini analysis runs automatically after a new capture.
- Error messages are friendly and concise.
- A failed analysis shows `Retry Analysis`.

Developer Mode is designed for debugging and inspection:

- The popup button says `Select Area`.
- Gemini analysis is manual from the side panel.
- The side panel shows backend health, AI status, detailed errors, and a `Gemini Debug` panel.
- The debug panel includes request ID, model, duration, retry count, screenshot length, matched element count, JSON parse strategy, error code/stage/message, chronological logs, `Retry Gemini`, and `Copy Debug Info`.
- Debug copy intentionally excludes API keys, screenshots, full DOM text, and page content.

## Core Principle

Same content, better layout.

The preview and prompt generation should follow these rules:

- Section headers stay section headers.
- Section subtitles stay under the section header.
- Text outside cards stays outside cards.
- Repeated card-like containers become preview cards.
- Card titles stay card titles.
- Card descriptions stay card descriptions.
- Existing icons are represented as simple placeholders, not copied exactly.
- Card background, border, radius, shadow, padding, theme, and text colors should be preserved when detected.
- The layout pattern changes arrangement and hierarchy, not the meaning of the content.

This makes the product a layout humanizer, not a content generator.

## Screenshot, DOM/CSS, And Gemini

The system uses three sources of understanding:

- Screenshot crop: gives Gemini the visual appearance of the selected area.
- DOM summary: gives the backend element types, text snippets, dimensions, roles, and local counts.
- CSS/style context: gives the preview renderer theme, card style, typography, accent colors, and button/card details.

Gemini is used to classify and describe the selected section. It returns structured data such as section type, layout type, detected blocks, designer description, current layout problem, and reasoning.

The Gemini API key stays only in `web/.env.local`. The extension calls `http://localhost:3000/api/analyze-area`; it does not contain or expose the key.

## Layout Pattern Suggestions

Pattern suggestions come from a local database, not directly from Gemini's suggested patterns.

The implemented local database contains 34 original abstract layout patterns across:

- hero
- features
- pricing
- stats
- CTA
- form
- testimonials
- dashboard

`selectPatterns.ts` maps Gemini's classification and detected structure to curated recommendations. For example:

- Hero sections get patterns like product preview, split hero, trust bar, and feature chips.
- Equal feature grids get bento, featured side stack, center highlight, icon grouping, and problem/solution options.
- Process-like feature sections get workflow and alternating feature layouts.
- Pricing, stats, CTA, form, and testimonials each have their own pattern sets.

This keeps recommendations consistent, inspectable, and product-specific.

## Live HTML/CSS Preview

The repo currently implements two preview surfaces:

1. Full preview page in a new tab:
   - Uses `FullPreviewPage.tsx`.
   - Reads preview data from `chrome.storage.session`.
   - Renders `LiveLayoutPreview` with the selected pattern and extracted content.
   - Includes `Copy Cursor Prompt`.

2. In-page overlay preview:
   - Implemented in the content script with safe DOM creation.
   - Appears fixed at the top-right by default.
   - Can expand to full-screen style preview.
   - Can be closed with the close button or Escape.
   - Does not permanently modify the user's page.

Both previews are HTML/CSS mockups. They preserve the extracted section title, subtitle, card items, icon placeholders, and style context while changing the arrangement according to the selected layout pattern.

## What This Product Does Not Do

- It is not a design stealing tool.
- It is not a website cloner.
- It does not scrape or reproduce third-party design libraries.
- It is not an AI image generator.
- It is not a Figma replacement.
- It does not directly edit the user's code yet.
- It does not copy exact icons or third-party screenshots into previews.
- It does not expose `GEMINI_API_KEY` in the extension, UI, browser console, copied debug info, or API responses.

## MVP Modules

Current MVP modules are:

- Rectangle selection overlay
- Screenshot crop capture
- DOM and element summary extraction
- CSS/style context extraction
- Gemini backend analysis
- Backend health check
- Simple Mode and Developer Mode
- Developer Gemini diagnostics
- Curated layout pattern database
- Pattern selection rules
- Pattern cards with visual thumbnails
- Live full preview in a new tab
- In-page overlay preview
- Cursor/Codex prompt generation
- New screenshot flow from the side panel

## Current Technical Stack

Extension:

- Chrome Manifest V3
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Chrome APIs: `sidePanel`, `tabs`, `scripting`, `storage`, `captureVisibleTab`

Backend:

- Next.js App Router
- TypeScript
- `@google/genai`
- Node.js runtime for the analyze route
- CORS-enabled API routes
- `GEMINI_API_KEY` stored in `web/.env.local`

## Current MVP Status

Implemented:

- Popup-to-side-panel selection flow.
- Rectangle selection on the active webpage.
- Screenshot cropping and session storage.
- DOM, count, local detection, and style-context extraction.
- Gemini backend with health endpoint, CORS, request IDs, safe logs, timeout, retry, and wrapped debug responses.
- Simple Mode auto-analysis and Developer Mode manual analysis.
- Developer Mode Gemini diagnostics and safe debug copy.
- Local layout pattern database with 34 patterns.
- Curated pattern selection from Gemini classification.
- Pattern thumbnails and cards.
- Live React preview in a full preview page opened in a new tab.
- In-page preview overlay with expandable view.
- Cursor/Codex prompt generation from selected pattern and captured style context.
- `New Screenshot` flow from the side panel.

In progress or needs hardening:

- More accurate card grouping for unusual DOM structures.
- Broader live preview support for every pattern, not only the currently handled set plus generic fallback.
- Better extraction for dashboards, testimonials, complex pricing tables, and forms.
- Visual QA across more real websites and AI-generated app layouts.
- More robust handling for pages that block content scripts or screenshot capture.
- A production deployment story for the backend beyond local `localhost:3000`.

Planned:

- Direct code application or guided patch generation.
- More pattern-specific preview controls.
- Better before/after comparison UX.
- Persistent project/session history.
- Team-ready export/share flow.

## Next Development Steps

1. Improve extraction reliability for repeated cards, headings, subtitles, and forms.
2. Expand `LiveLayoutPreview` so every curated pattern has a specific renderer.
3. Add stronger before/after comparison in the full preview page.
4. Add a clear production backend configuration path.
5. Add automated tests for pattern selection, preview content extraction, and backend response parsing.
6. Add manual QA fixtures for common AI-generated layouts.
7. Explore code-change generation while keeping user approval explicit.

## Success Metric For MVP

The MVP succeeds if a developer can take a generic AI-generated section, select it in the browser, receive 3-5 relevant layout alternatives, preview one with the same content and preserved style, and copy a prompt that helps a coding agent produce a visibly better section in one iteration.

