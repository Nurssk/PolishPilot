import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

type AnalyzeAreaRequest = {
  screenshotBase64: string;
  sourceContext?: unknown;
};

type JsonParseStrategy = "direct" | "extracted" | "repaired";
type ErrorStage =
  | "validation"
  | "gemini_request"
  | "gemini_response"
  | "json_parse"
  | "unknown";

export type AIUnderstandingResult = {
  sectionType:
    | "hero"
    | "features"
    | "cards"
    | "pricing"
    | "cta"
    | "stats"
    | "form"
    | "testimonials"
    | "dashboard"
    | "navigation"
    | "footer"
    | "auth"
    | "settings"
    | "unknown";
  layoutType:
    | "equal_grid"
    | "two_column"
    | "vertical_stack"
    | "horizontal_row"
    | "bento"
    | "pricing_columns"
    | "form_layout"
    | "timeline"
    | "carousel"
    | "unknown";
  contentType:
    | "cards"
    | "text_block"
    | "form"
    | "pricing_plans"
    | "metrics"
    | "testimonial_cards"
    | "navigation_links"
    | "dashboard_widgets"
    | "unknown";
  confidence: number;
  detectedBlocks: Array<{
    type:
      | "heading"
      | "text"
      | "card"
      | "button"
      | "image"
      | "icon"
      | "input"
      | "stat"
      | "price"
      | "testimonial"
      | "nav_item"
      | "unknown";
    count: number;
    description: string;
  }>;
  detectedKeywords: string[];
  designIntent:
    | "conversion"
    | "explanation"
    | "comparison"
    | "social_proof"
    | "data_summary"
    | "lead_capture"
    | "navigation"
    | "onboarding"
    | "trust_building"
    | "product_showcase"
    | "unknown";
  uiProblems: Array<
    | "flat_layout"
    | "weak_hierarchy"
    | "too_repetitive"
    | "cta_not_clear"
    | "cards_too_equal"
    | "spacing_issue"
    | "too_text_heavy"
    | "no_visual_rhythm"
    | "weak_trust_signals"
    | "missing_microinteraction"
    | "unknown"
  >;
  recommendedCategories: {
    layoutCategories: AIUnderstandingResult["sectionType"][];
    templateCategories: AIUnderstandingResult["sectionType"][];
    animationCategories: Array<
      | "text"
      | "card"
      | "button"
      | "scroll"
      | "background"
      | "loader"
      | "transition"
      | "hover"
      | "cursor"
      | "image"
      | "list"
      | "navigation"
      | "other"
    >;
  };
  animationKeywords: string[];
  designerDescription: string;
  currentLayoutProblem: string;
  reasoning: string[];
  uncodixify: {
    summary: string;
    detectedRuleIds: string[];
    visualEvidence: string[];
    topRecommendations: string[];
  };
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;
const GEMINI_TIMEOUT_MS = 30_000;
const TRANSIENT_STATUS_CODES = [429, 500, 503] as const;

const SECTION_TYPES = [
  "hero",
  "features",
  "cards",
  "pricing",
  "cta",
  "stats",
  "form",
  "testimonials",
  "dashboard",
  "navigation",
  "footer",
  "auth",
  "settings",
  "unknown"
] as const;

const LAYOUT_TYPES = [
  "equal_grid",
  "two_column",
  "vertical_stack",
  "horizontal_row",
  "bento",
  "pricing_columns",
  "form_layout",
  "timeline",
  "carousel",
  "unknown"
] as const;

const CONTENT_TYPES = [
  "cards",
  "text_block",
  "form",
  "pricing_plans",
  "metrics",
  "testimonial_cards",
  "navigation_links",
  "dashboard_widgets",
  "unknown"
] as const;

const DESIGN_INTENTS = [
  "conversion",
  "explanation",
  "comparison",
  "social_proof",
  "data_summary",
  "lead_capture",
  "navigation",
  "onboarding",
  "trust_building",
  "product_showcase",
  "unknown"
] as const;

const UI_PROBLEMS = [
  "flat_layout",
  "weak_hierarchy",
  "too_repetitive",
  "cta_not_clear",
  "cards_too_equal",
  "spacing_issue",
  "too_text_heavy",
  "no_visual_rhythm",
  "weak_trust_signals",
  "missing_microinteraction",
  "unknown"
] as const;

const ANIMATION_CATEGORIES = [
  "text",
  "card",
  "button",
  "scroll",
  "background",
  "loader",
  "transition",
  "hover",
  "cursor",
  "image",
  "list",
  "navigation",
  "other"
] as const;

const UNCODIXIFY_RULE_IDS = [
  "oversized-radius",
  "pill-overload",
  "gradient-overuse",
  "glow-heavy-ui",
  "glassmorphism-default",
  "dramatic-shadows",
  "decorative-eyebrows",
  "uppercase-label-overuse",
  "fake-premium-copy",
  "formulaic-ai-copy",
  "ai-slop-phrase-tells",
  "ai-punctuation-tells",
  "default-font-stack-template",
  "emoji-iconography",
  "duplicate-cta-intent",
  "cheap-section-meta-labels",
  "centered-stack-default",
  "mobile-viewport-height-risk",
  "pure-black-surface",
  "placeholder-dead-links",
  "missing-image-alt",
  "arbitrary-z-index",
  "overwide-paragraph-measure",
  "hero-inside-dashboard",
  "hero-missing-clear-headline",
  "hero-supporting-copy-too-long",
  "hero-missing-primary-cta",
  "hero-competing-ctas",
  "tiny-touch-targets",
  "icon-button-missing-label",
  "weak-primary-action",
  "hero-missing-relevant-visual",
  "redrawn-ui-chrome",
  "hero-missing-trust-support",
  "hero-poor-scan-flow",
  "hero-performance-heavy-visual",
  "metric-card-grid-default",
  "fake-charts",
  "placeholder-proof-copy",
  "placeholder-only-form-labels",
  "left-border-accent-cards",
  "blue-cyan-ai-dashboard",
  "overpadded-layout",
  "text-heavy-block",
  "weak-hierarchy",
  "monotonous-section-rhythm",
  "repetitive-equal-cards",
  "icon-tile-feature-cards",
  "pricing-plan-weak-emphasis",
  "nested-panel-overload",
  "decorative-badges",
  "transform-hover-overuse",
  "unbounded-sluggish-motion",
  "layout-property-animation",
  "motion-reduced-accessibility-missing",
  "inconsistent-spacing",
  "sidebar-floating-shell",
  "ai-nav-footer-template",
  "decorative-status-dots",
  "decorative-announcement-bubble",
  "too-many-muted-labels",
  "random-glass-panels",
  "generic-saas-composition"
] as const;

const BLOCK_TYPES = [
  "heading",
  "text",
  "card",
  "button",
  "image",
  "icon",
  "input",
  "stat",
  "price",
  "testimonial",
  "nav_item",
  "unknown"
] as const;

const SYSTEM_PROMPT = `Analyze the attached screenshot first. Divide the visible UI into text and components yourself, then identify what kind of UI block it is and what recommendations fit it. Supplemental source context may include capped HTML snippets, visible text, an objectInventory of headings/actions/cards/forms/media/metrics, element styles, selected-section candidates, pageDesignContext tokens/site signals, and used CSS. Use that context to confirm visible text, structure, semantic containers, object counts, repeated groups, design-system tokens, and style problems. Do not let local or source-derived labels override the screenshot when they conflict.

For uncodixify.detectedRuleIds, use only these ids when they are visibly supported:
${UNCODIXIFY_RULE_IDS.join(", ")}.`;

const RESPONSE_SHAPE = `Return exactly one JSON object with:
{
  "sectionType": "hero | features | cards | pricing | cta | stats | form | testimonials | dashboard | navigation | footer | auth | settings | unknown",
  "layoutType": "equal_grid | two_column | vertical_stack | horizontal_row | bento | pricing_columns | form_layout | timeline | carousel | unknown",
  "contentType": "cards | text_block | form | pricing_plans | metrics | testimonial_cards | navigation_links | dashboard_widgets | unknown",
  "confidence": 0.0,
  "detectedBlocks": [{ "type": "heading | text | card | button | image | icon | input | stat | price | testimonial | nav_item | unknown", "count": 0, "description": "" }],
  "detectedKeywords": ["keyword"],
  "designIntent": "conversion | explanation | comparison | social_proof | data_summary | lead_capture | navigation | onboarding | trust_building | product_showcase | unknown",
  "uiProblems": ["flat_layout | weak_hierarchy | too_repetitive | cta_not_clear | cards_too_equal | spacing_issue | too_text_heavy | no_visual_rhythm | weak_trust_signals | missing_microinteraction | unknown"],
  "recommendedCategories": {
    "layoutCategories": ["hero | features | cards | pricing | cta | stats | form | testimonials | dashboard | navigation | footer | auth | settings | unknown"],
    "templateCategories": ["hero | features | cards | pricing | cta | stats | form | testimonials | dashboard | navigation | footer | auth | settings | unknown"],
    "animationCategories": ["text | card | button | scroll | background | loader | transition | hover | cursor | image | list | navigation | other"]
  },
  "animationKeywords": ["keyword"],
  "designerDescription": "",
  "currentLayoutProblem": "",
  "reasoning": [""],
  "uncodixify": {
    "summary": "One sentence on whether this looks AI/Codex-generated and why.",
    "detectedRuleIds": ["oversized-radius", "glow-heavy-ui"],
    "visualEvidence": [
      "The cards use large rounded corners and glow shadows.",
      "Several chips are decorative and do not communicate state."
    ],
    "topRecommendations": [
      "Reduce card radius to 8-12px.",
      "Replace glow with simple borders and spacing hierarchy."
    ]
  }
}`;

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  let debugBase: {
    model?: string;
    screenshotLength?: number;
    sourceContextChars?: number;
    retryCount?: number;
  } = {};

  try {
    logGemini(requestId, "request received");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return errorResponse(requestId, startedAt, 500, {
        code: "MISSING_GEMINI_API_KEY",
        message: "GEMINI_API_KEY is not configured in web/.env.local",
        stage: "validation"
      }, debugBase);
    }

    const body = (await request.json()) as Partial<AnalyzeAreaRequest>;
    const screenshotLength =
      typeof body.screenshotBase64 === "string" ? body.screenshotBase64.length : 0;
    const sourceContext = sanitizeSourceContext(body.sourceContext);
    const sourceContextChars = sourceContext ? JSON.stringify(sourceContext).length : 0;
    debugBase = {
      ...debugBase,
      screenshotLength,
      sourceContextChars
    };

    logGemini(requestId, `screenshot exists: ${Boolean(body.screenshotBase64)}`);
    logGemini(requestId, "screenshot summary", {
      startsWithDataImage:
        typeof body.screenshotBase64 === "string" &&
        body.screenshotBase64.startsWith("data:image"),
      length: screenshotLength
    });
    logGemini(requestId, "analysis input mode", {
      mode: sourceContext ? "screenshot+source-context" : "screenshot-only",
      sourceContextChars
    });

    if (!body.screenshotBase64 || typeof body.screenshotBase64 !== "string") {
      return errorResponse(requestId, startedAt, 400, {
        code: "MISSING_SCREENSHOT",
        message: "No screenshotBase64 was provided.",
        stage: "validation"
      }, debugBase);
    }

    const normalizedImage = normalizeBase64Image(body.screenshotBase64);

    if (!normalizedImage) {
      return errorResponse(requestId, startedAt, 400, {
        code: "MISSING_SCREENSHOT",
        message: "No screenshotBase64 was provided.",
        details: "screenshotBase64 was empty after normalization.",
        stage: "validation"
      }, debugBase);
    }

    const payload: AnalyzeAreaRequest = {
      screenshotBase64: body.screenshotBase64,
      sourceContext
    };

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildGeminiPrompt(payload);
    if (process.env.NODE_ENV !== "production") {
      // Safe summary only — no screenshot base64, no keys.
      logGemini(requestId, "analysis prompt summary", {
        promptChars: prompt.length,
        inputMode: sourceContext ? "screenshot+source-context" : "screenshot-only",
        sourceContextChars,
        includesUncodixifyCheck: true
      });
    }
    const generated = await generateGeminiText(ai, normalizedImage, prompt, requestId);
    debugBase = {
      ...debugBase,
      model: generated.model,
      retryCount: generated.retryCount
    };

    logGemini(requestId, "Gemini response received");
    logGemini(requestId, `raw response length: ${generated.text.length}`);

    let jsonParseStrategy: JsonParseStrategy;
    let result: AIUnderstandingResult;
    try {
      const parsedResult = parseGeminiJson(generated.text);
      jsonParseStrategy = parsedResult.strategy;
      const normalized = normalizeAIUnderstandingCandidate(parsedResult.value);
      result = enrichResultFromSourceContext(
        sanitizeAIUnderstandingResult(normalized),
        sourceContext
      );
      logGemini(requestId, "JSON parse success", {
        strategy: jsonParseStrategy,
        parsedShape: describeJsonShape(parsedResult.value),
        normalizedShape: describeJsonShape(normalized)
      });
    } catch (error) {
      logGemini(requestId, "JSON parse or shape failure", {
        error: safeErrorMessage(error)
      });
      return errorResponse(requestId, startedAt, 502, {
        code: "GEMINI_INVALID_JSON",
        message: "Gemini returned invalid JSON.",
        details: safeErrorMessage(error),
        stage: "json_parse"
      }, {
        ...debugBase,
        rawResponseLength: generated.text.length
      });
    }

    const durationMs = Date.now() - startedAt;
    logGemini(requestId, "response sent", { durationMs });

    return jsonResponse(
      {
        ok: true,
        requestId,
        model: generated.model,
        durationMs,
        result,
        debug: {
          screenshotLength,
          sourceContextChars,
          rawResponseLength: generated.text.length,
          jsonParseStrategy,
          retryCount: generated.retryCount
        }
      },
      200
    );
  } catch (error) {
    console.error(`[Gemini][${requestId}] PolishPilot Gemini analysis failed`, error);

    return errorResponse(requestId, startedAt, 500, {
      code: "GEMINI_REQUEST_FAILED",
      message: "Gemini request failed.",
      details: safeErrorMessage(error),
      stage: isGeminiRequestFailure(error) ? "gemini_request" : "unknown"
    }, debugBase);
  }
}

function jsonResponse(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: corsHeaders,
  });
}

function errorResponse(
  requestId: string,
  startedAt: number,
  status: number,
  error: {
    code: string;
    message: string;
    details?: string;
    stage: ErrorStage;
  },
  debug: {
    model?: string;
    durationMs?: number;
    screenshotLength?: number;
    sourceContextChars?: number;
    rawResponseLength?: number;
    retryCount?: number;
  }
) {
  const durationMs = debug.durationMs ?? Date.now() - startedAt;
  logGemini(requestId, "response sent", {
    ok: false,
    code: error.code,
    stage: error.stage,
    durationMs
  });

  return jsonResponse(
    {
      ok: false,
      requestId,
      error,
      debug: {
        ...debug,
        durationMs
      }
    },
    status
  );
}

function normalizeBase64Image(input: string) {
  return input.replace(/^data:image\/\w+;base64,/, "").trim();
}

function buildGeminiPrompt(_payload: AnalyzeAreaRequest) {
  const contextBlock = _payload.sourceContext
    ? `\n\nSUPPLEMENTAL SOURCE CONTEXT (capped and sanitized; use only as supporting evidence):\n${JSON.stringify(_payload.sourceContext, null, 2)}`
    : "";

  return `${SYSTEM_PROMPT}${contextBlock}

${RESPONSE_SHAPE}`;
}

function sanitizeSourceContext(value: unknown) {
  if (!isRecord(value)) return undefined;
  const sanitized = deepSanitizeSourceContext(value, 0) as Record<string, unknown>;
  const text = JSON.stringify(sanitized);

  if (text.length <= 24_000) {
    return sanitized;
  }

  return {
    ...sanitized,
    usedCssRules: undefined,
    matchedElements: Array.isArray(sanitized.matchedElements)
      ? sanitized.matchedElements.slice(0, 24)
      : undefined,
    sourceSectionCandidates: Array.isArray(sanitized.sourceSectionCandidates)
      ? sanitized.sourceSectionCandidates.slice(0, 4)
      : undefined,
    truncated: `Source context was reduced from ${text.length} chars.`
  };
}

function deepSanitizeSourceContext(value: unknown, depth: number): unknown {
  if (depth > 6) return "[max depth omitted]";

  if (typeof value === "string") {
    return sanitizeContextString(value, depth);
  }

  if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.slice(0, depth <= 2 ? 80 : 40).map((item) =>
      deepSanitizeSourceContext(item, depth + 1)
    );
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const output: Record<string, unknown> = {};
  const entries = Object.entries(value).slice(0, 80);

  for (const [key, item] of entries) {
    if (/screenshot|base64|token|secret|password|authorization|cookie/i.test(key)) {
      output[key] = "[omitted]";
      continue;
    }

    output[key] = deepSanitizeSourceContext(item, depth + 1);
  }

  return output;
}

function sanitizeContextString(value: string, depth: number) {
  const withoutBinary = value
    .replace(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/g, "[image omitted]")
    .replace(/[A-Za-z0-9+/=]{500,}/g, "[long encoded value omitted]");
  const maxLength = depth <= 2 ? 6000 : 1800;

  return withoutBinary.length <= maxLength
    ? withoutBinary
    : `${withoutBinary.slice(0, maxLength)}\n/* truncated ${withoutBinary.length - maxLength} chars */`;
}

async function generateGeminiText(
  ai: GoogleGenAI,
  normalizedImage: string,
  prompt: string,
  requestId: string
) {
  let lastError: unknown = null;
  let retryCount = 0;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        if (attempt > 0) {
          retryCount += 1;
        }

        logGemini(requestId, `calling Gemini model: ${model}`, { attempt: attempt + 1 });
        const response = await withTimeout(
          ai.models.generateContent({
            model,
            contents: [
              {
                inlineData: {
                  mimeType: "image/png",
                  data: normalizedImage
                }
              },
              {
                text: prompt
              }
            ],
            config: {
              responseMimeType: "application/json",
              temperature: 0.2,
              maxOutputTokens: 2048
            }
          }),
          GEMINI_TIMEOUT_MS
        );

        const text = response.text;

        if (!text) {
          throw new Error(`Gemini model ${model} returned no text.`);
        }

        return { text, model, retryCount };
      } catch (error) {
        lastError = error;

        if (isModelAvailabilityError(error)) {
          break;
        }

        if (attempt === 0 && isTransientGeminiError(error)) {
          logGemini(requestId, "transient Gemini error, retrying", {
            model,
            error: safeErrorMessage(error)
          });
          continue;
        }

        throw error;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("No Gemini Flash vision-capable model was available.");
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`Gemini request timed out after ${timeoutMs}ms.`)), timeoutMs);
    })
  ]);
}

function isModelAvailabilityError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /not found|not available|unsupported|permission|model/i.test(message);
}

function isTransientGeminiError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    /network|fetch|timeout|timed out|temporar/i.test(message) ||
    TRANSIENT_STATUS_CODES.some((status) => message.includes(String(status)))
  );
}

function isGeminiRequestFailure(error: unknown) {
  return isTransientGeminiError(error) || !isModelAvailabilityError(error);
}

function parseGeminiJson(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
  const candidates = [
    { text: cleaned, strategy: "direct" as JsonParseStrategy },
    ...extractJsonCandidates(cleaned).map((candidate) => ({
      text: candidate,
      strategy: "extracted" as JsonParseStrategy
    }))
  ];

  for (const candidate of candidates) {
    try {
      return {
        value: JSON.parse(candidate.text),
        strategy: candidate.strategy
      };
    } catch {
      // Try the next parsing strategy.
    }
  }

  for (const candidate of candidates) {
    const repaired = repairLikelyJson(candidate.text);

    if (repaired === candidate.text) {
      continue;
    }

    try {
      return {
        value: JSON.parse(repaired),
        strategy: "repaired" as JsonParseStrategy
      };
    } catch {
      // Keep trying remaining candidates.
    }
  }

  throw new Error("Gemini returned invalid JSON.");
}

function extractJsonCandidates(text: string) {
  const candidates: string[] = [];
  const objectCandidate = extractBalancedJson(text, "{", "}");

  if (objectCandidate) {
    candidates.push(objectCandidate);
  }

  const arrayCandidate = extractBalancedJson(text, "[", "]");

  if (arrayCandidate) {
    candidates.push(arrayCandidate);
  }

  return candidates.filter((candidate, index, array) => array.indexOf(candidate) === index);
}

function extractBalancedJson(text: string, open: "{" | "[", close: "}" | "]") {
  const start = text.indexOf(open);

  if (start < 0) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "\"") {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === open) {
      depth += 1;
    }

    if (char === close) {
      depth -= 1;

      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  const end = text.lastIndexOf(close);
  return end > start ? text.slice(start, end + 1) : null;
}

function repairLikelyJson(text: string) {
  return text
    .replace(/[\u201C\u201D]/g, "\"")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/}\s*{/g, "},{")
    .replace(/]\s*\[/g, "],[")
    .replace(/"\s*(?=\{)/g, "\",")
    .replace(/}\s*(?="[^"]+"\s*:)/g, "},")
    .replace(/]\s*(?="[^"]+"\s*:)/g, "],")
    .replace(/"\s+(?=")/g, "\",")
    .replace(/\b(true|false|null)\s+(?=["{\[])/g, "$1,")
    .replace(/(-?\d+(?:\.\d+)?)\s+(?=["{\[])/g, "$1,");
}

function normalizeAIUnderstandingCandidate(value: unknown): unknown {
  if (Array.isArray(value)) {
    const objectItem = value.find(isRecord);
    return objectItem ? normalizeAIUnderstandingCandidate(objectItem) : value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      return normalizeAIUnderstandingCandidate(parseGeminiJson(trimmed).value);
    }

    return value;
  }

  if (!isRecord(value)) {
    return value;
  }

  for (const key of [
    "result",
    "analysis",
    "data",
    "response",
    "understanding",
    "aiUnderstanding",
    "uiAnalysis"
  ]) {
    const nested = value[key];

    if (isRecord(nested) || Array.isArray(nested)) {
      return normalizeAIUnderstandingCandidate(nested);
    }
  }

  return value;
}

function describeJsonShape(value: unknown) {
  if (Array.isArray(value)) {
    return `array(${value.length})`;
  }

  if (isRecord(value)) {
    return `object(${Object.keys(value).slice(0, 8).join(",")})`;
  }

  return typeof value;
}

function sanitizeAIUnderstandingResult(value: unknown): AIUnderstandingResult {
  if (!isRecord(value)) {
    throw new Error("Gemini JSON result must be an object.");
  }

  return {
    sectionType: oneOf(value.sectionType, SECTION_TYPES, "unknown"),
    layoutType: oneOf(value.layoutType, LAYOUT_TYPES, "unknown"),
    contentType: oneOf(value.contentType, CONTENT_TYPES, "unknown"),
    confidence: clampNumber(value.confidence, 0, 1),
    detectedBlocks: Array.isArray(value.detectedBlocks)
      ? value.detectedBlocks.slice(0, 20).map(sanitizeDetectedBlock)
      : [],
    detectedKeywords: sanitizeStringArray(value.detectedKeywords, 30),
    designIntent: oneOf(value.designIntent, DESIGN_INTENTS, "unknown"),
    uiProblems: sanitizeEnumArray(value.uiProblems, UI_PROBLEMS, 8),
    recommendedCategories: sanitizeRecommendedCategories(value.recommendedCategories),
    animationKeywords: sanitizeStringArray(value.animationKeywords, 20),
    designerDescription: stringOrEmpty(value.designerDescription),
    currentLayoutProblem: stringOrEmpty(value.currentLayoutProblem),
    reasoning: Array.isArray(value.reasoning)
      ? value.reasoning.slice(0, 12).map(stringOrEmpty).filter(Boolean)
      : [],
    uncodixify: sanitizeUncodixify(value.uncodixify)
  };
}

export function enrichResultFromSourceContext(
  result: AIUnderstandingResult,
  sourceContext: unknown
): AIUnderstandingResult {
  const inventory = getObjectInventory(sourceContext);
  if (!inventory) return result;

  const summary = getInventorySummary(inventory);
  const sectionType = chooseSectionTypeFromInventory(result, inventory, summary);
  const detectedBlocks = enrichDetectedBlocks(result.detectedBlocks, summary, inventory);
  const inferredProblems = inferProblemsFromInventory(summary, inventory);
  const inferredAnimationCategories = inferAnimationCategories(summary);
  const detectedKeywords = mergeUniqueStrings(
    result.detectedKeywords,
    getStringArray(inventory.keywords).map(normalizeKeyword),
    getStringArray(inventory.priceTokens).map(normalizeKeyword),
    getStringArray(inventory.metrics).map(normalizeKeyword)
  ).slice(0, 30);
  const uiProblems = mergeUniqueEnums(
    inferredProblems.length
      ? result.uiProblems.filter((problem) => problem !== "unknown")
      : result.uiProblems,
    inferredProblems,
    UI_PROBLEMS,
    8
  );
  const recommendedCategories: AIUnderstandingResult["recommendedCategories"] = {
    layoutCategories: mergeUniqueEnums(
      sectionType === "unknown"
        ? result.recommendedCategories.layoutCategories
        : result.recommendedCategories.layoutCategories.filter((category) => category !== "unknown"),
      sectionType === "unknown" ? [] : [sectionType],
      SECTION_TYPES,
      6
    ),
    templateCategories: mergeUniqueEnums(
      sectionType === "unknown"
        ? result.recommendedCategories.templateCategories
        : result.recommendedCategories.templateCategories.filter((category) => category !== "unknown"),
      sectionType === "unknown" ? [] : [sectionType],
      SECTION_TYPES,
      6
    ),
    animationCategories: mergeUniqueEnums(
      inferredAnimationCategories.some((category) => category !== "other")
        ? result.recommendedCategories.animationCategories.filter((category) => category !== "other")
        : result.recommendedCategories.animationCategories,
      inferredAnimationCategories,
      ANIMATION_CATEGORIES,
      6
    )
  };

  return {
    ...result,
    sectionType,
    layoutType: chooseLayoutTypeFromInventory(result, summary, inventory),
    contentType: chooseContentTypeFromInventory(result, sectionType, summary),
    designIntent: chooseDesignIntentFromInventory(result, sectionType),
    confidence:
      result.sectionType === "unknown" && sectionType !== "unknown"
        ? Math.max(result.confidence, 0.62)
        : result.confidence,
    detectedBlocks,
    detectedKeywords,
    uiProblems,
    recommendedCategories,
    animationKeywords: result.animationKeywords.length
      ? result.animationKeywords
      : inferAnimationKeywordsFromInventory(sectionType, summary),
    designerDescription:
      result.designerDescription ||
      describeInventorySection(sectionType, summary, inventory),
    currentLayoutProblem:
      result.currentLayoutProblem ||
      describeInventoryProblem(summary, inventory),
    reasoning: mergeUniqueStrings(
      result.reasoning,
      ["Source object inventory filled sparse Gemini fields."]
    ).slice(0, 12),
    uncodixify: enrichUncodixifyFromInventory(result.uncodixify, summary, inventory)
  };
}

function getObjectInventory(sourceContext: unknown): Record<string, unknown> | null {
  if (!isRecord(sourceContext)) return null;
  const inventory = sourceContext.objectInventory;
  return isRecord(inventory) ? inventory : null;
}

function getInventorySummary(inventory: Record<string, unknown>) {
  const summary = isRecord(inventory.summary) ? inventory.summary : {};
  return {
    totalElements: numberFromRecord(summary, "totalElements"),
    headings: numberFromRecord(summary, "headings"),
    actions: numberFromRecord(summary, "actions"),
    cards: numberFromRecord(summary, "cards"),
    inputs: numberFromRecord(summary, "inputs"),
    media: numberFromRecord(summary, "media"),
    metrics: numberFromRecord(summary, "metrics"),
    priceTokens: numberFromRecord(summary, "priceTokens"),
    testimonials: numberFromRecord(summary, "testimonials"),
    navItems: numberFromRecord(summary, "navItems"),
    longTextBlocks: numberFromRecord(summary, "longTextBlocks")
  };
}

function chooseSectionTypeFromInventory(
  result: AIUnderstandingResult,
  inventory: Record<string, unknown>,
  summary: ReturnType<typeof getInventorySummary>
): AIUnderstandingResult["sectionType"] {
  if (result.sectionType !== "unknown" && result.confidence >= 0.55) {
    return result.sectionType;
  }

  const keywords = getInventoryKeywordText(inventory);
  if (summary.priceTokens >= 2 || /\b(pricing|billing|plan|starter|pro|enterprise|credits?)\b/i.test(keywords)) return "pricing";
  if (summary.inputs >= 2 && /\b(password|login|sign-in|signin|sign up|signup|auth)\b/i.test(keywords)) return "auth";
  if (summary.inputs >= 1 || /\b(form|email|waitlist|newsletter|contact)\b/i.test(keywords)) return "form";
  if (summary.navItems >= 3 || /\b(nav|navigation|menu|navbar)\b/i.test(keywords)) return "navigation";
  if (summary.testimonials >= 1 || /\b(testimonial|review|rating|customer|quote)\b/i.test(keywords)) return "testimonials";
  if (summary.metrics >= 2 || /\b(metric|kpi|analytics|dashboard)\b/i.test(keywords)) return summary.cards >= 3 ? "dashboard" : "stats";
  if (summary.cards >= 3 || /\b(feature|workflow|steps?|process|benefit)\b/i.test(keywords)) return "features";
  if (summary.actions >= 1 && summary.totalElements <= 12) return "cta";

  return result.sectionType;
}

function chooseLayoutTypeFromInventory(
  result: AIUnderstandingResult,
  summary: ReturnType<typeof getInventorySummary>,
  inventory: Record<string, unknown>
): AIUnderstandingResult["layoutType"] {
  if (result.layoutType !== "unknown") return result.layoutType;
  const repeatedGroups = getRepeatedGroups(inventory);
  const cardGroup = repeatedGroups.find((group) => group.type === "card");
  if (summary.priceTokens >= 2 && summary.cards >= 2) return "pricing_columns";
  if ((cardGroup?.count ?? 0) >= 3 && cardGroup?.similarSize) return "equal_grid";
  if (summary.inputs >= 1) return "form_layout";
  const layoutSignals = isRecord(inventory.layoutSignals) ? inventory.layoutSignals : {};
  const columns = numberFromRecord(layoutSignals, "columnsEstimate");
  const rows = numberFromRecord(layoutSignals, "rowsEstimate");
  if (columns >= 3 && rows <= 3) return "equal_grid";
  if (columns >= 2 && rows >= 2) return "two_column";
  if (rows >= 3 && columns <= 2) return "vertical_stack";
  if (columns >= 3 && rows <= 2) return "horizontal_row";
  return result.layoutType;
}

function chooseContentTypeFromInventory(
  result: AIUnderstandingResult,
  sectionType: AIUnderstandingResult["sectionType"],
  summary: ReturnType<typeof getInventorySummary>
): AIUnderstandingResult["contentType"] {
  if (result.contentType !== "unknown") return result.contentType;
  if (sectionType === "pricing" || summary.priceTokens >= 2) return "pricing_plans";
  if (summary.inputs >= 1) return "form";
  if (summary.metrics >= 2) return "metrics";
  if (sectionType === "testimonials" || summary.testimonials >= 1) return "testimonial_cards";
  if (sectionType === "navigation" || summary.navItems >= 3) return "navigation_links";
  if (sectionType === "dashboard") return "dashboard_widgets";
  if (summary.cards >= 2) return "cards";
  return result.contentType;
}

function chooseDesignIntentFromInventory(
  result: AIUnderstandingResult,
  sectionType: AIUnderstandingResult["sectionType"]
): AIUnderstandingResult["designIntent"] {
  if (result.designIntent !== "unknown") return result.designIntent;
  if (sectionType === "hero" || sectionType === "pricing" || sectionType === "cta") return "conversion";
  if (sectionType === "features" || sectionType === "cards") return "explanation";
  if (sectionType === "stats" || sectionType === "dashboard") return "data_summary";
  if (sectionType === "form" || sectionType === "auth") return "lead_capture";
  if (sectionType === "testimonials") return "social_proof";
  if (sectionType === "navigation" || sectionType === "footer") return "navigation";
  return result.designIntent;
}

function enrichDetectedBlocks(
  current: AIUnderstandingResult["detectedBlocks"],
  summary: ReturnType<typeof getInventorySummary>,
  inventory: Record<string, unknown>
): AIUnderstandingResult["detectedBlocks"] {
  const sourceHasObjects = Object.values(summary).some((value) => value > 0);
  const initialBlocks = sourceHasObjects
    ? current.filter((block) => block.type !== "unknown")
    : current;
  const byType = new Map(initialBlocks.map((block) => [block.type, block]));
  const add = (
    type: AIUnderstandingResult["detectedBlocks"][number]["type"],
    count: number,
    description: string
  ) => {
    if (count <= 0 || byType.has(type)) return;
    byType.set(type, { type, count, description });
  };

  add("heading", summary.headings, `Headings from source inventory: ${getStringArray(inventory.headings).slice(0, 3).join(", ")}`);
  add("button", summary.actions, `Actions from source inventory: ${getLabels(inventory.actions).slice(0, 4).join(", ")}`);
  add("card", summary.cards, "Card-like objects from DOM/source inventory.");
  add("input", summary.inputs, "Form controls from DOM/source inventory.");
  add("image", summary.media, "Media/visual objects from DOM/source inventory.");
  add("stat", summary.metrics, `Metric values: ${getStringArray(inventory.metrics).slice(0, 4).join(", ")}`);
  add("price", summary.priceTokens, `Pricing tokens: ${getStringArray(inventory.priceTokens).slice(0, 4).join(", ")}`);
  add("testimonial", summary.testimonials, "Testimonial/review language from source inventory.");
  add("nav_item", summary.navItems, "Navigation items from source inventory.");

  return [...byType.values()].slice(0, 20);
}

function inferProblemsFromInventory(
  summary: ReturnType<typeof getInventorySummary>,
  inventory: Record<string, unknown>
): AIUnderstandingResult["uiProblems"] {
  const problems: AIUnderstandingResult["uiProblems"] = [];
  const repeatedGroups = getRepeatedGroups(inventory);
  const styleSignals = isRecord(inventory.styleSignals) ? inventory.styleSignals : {};
  if (repeatedGroups.some((group) => group.type === "card" && group.count >= 3 && group.similarSize)) {
    problems.push("cards_too_equal", "no_visual_rhythm");
  }
  if (summary.longTextBlocks >= 1) problems.push("too_text_heavy");
  if (summary.actions === 0 && ["pricing", "form", "cta"].some((keyword) => getInventoryKeywordText(inventory).includes(keyword))) {
    problems.push("cta_not_clear");
  }
  if (numberFromRecord(styleSignals, "largeRadiusCount") >= 3 || numberFromRecord(styleSignals, "glowCount") >= 1) {
    problems.push("flat_layout");
  }
  return problems;
}

function inferAnimationCategories(
  summary: ReturnType<typeof getInventorySummary>
): AIUnderstandingResult["recommendedCategories"]["animationCategories"] {
  const categories: AIUnderstandingResult["recommendedCategories"]["animationCategories"] = [];
  if (summary.cards >= 2) categories.push("card", "hover");
  if (summary.actions >= 1) categories.push("button");
  if (summary.headings >= 1) categories.push("text");
  if (summary.media >= 1) categories.push("image");
  return categories.length ? categories.slice(0, 6) : ["other"];
}

function inferAnimationKeywordsFromInventory(
  sectionType: AIUnderstandingResult["sectionType"],
  summary: ReturnType<typeof getInventorySummary>
) {
  const keywords: string[] = [];
  if (summary.cards >= 2) keywords.push("card-hover", "staggered-reveal");
  if (summary.actions >= 1) keywords.push("button-microinteraction");
  if (summary.headings >= 1) keywords.push("text-reveal");
  if (summary.media >= 1) keywords.push("image-reveal");
  if (summary.inputs >= 1) keywords.push("form-feedback");
  if (sectionType === "navigation") keywords.push("navigation-transition");
  if (sectionType === "pricing") keywords.push("plan-emphasis");
  return mergeUniqueStrings(keywords).slice(0, 8);
}

function enrichUncodixifyFromInventory(
  uncodixify: AIUnderstandingResult["uncodixify"],
  summary: ReturnType<typeof getInventorySummary>,
  inventory: Record<string, unknown>
): AIUnderstandingResult["uncodixify"] {
  const detectedRuleIds = [...(uncodixify?.detectedRuleIds ?? [])];
  const visualEvidence = [...(uncodixify?.visualEvidence ?? [])];
  const topRecommendations = [...(uncodixify?.topRecommendations ?? [])];
  const add = (ruleId: string, evidence: string, recommendation: string) => {
    if (!detectedRuleIds.includes(ruleId)) {
      detectedRuleIds.push(ruleId as (typeof UNCODIXIFY_RULE_IDS)[number]);
      visualEvidence.push(evidence);
      topRecommendations.push(recommendation);
    }
  };
  const repeatedGroups = getRepeatedGroups(inventory);
  const styleSignals = isRecord(inventory.styleSignals) ? inventory.styleSignals : {};

  if (repeatedGroups.some((group) => group.type === "card" && group.count >= 3 && group.similarSize)) {
    add("repetitive-equal-cards", "Source inventory found repeated equal card-like objects.", "Create a featured card and quieter supporting cards.");
    add("monotonous-section-rhythm", "Source inventory found a monotonous repeated card rhythm.", "Introduce one clear focal point and grouped supporting content.");
  }
  if (summary.priceTokens >= 2 && summary.cards >= 2) {
    add("pricing-plan-weak-emphasis", "Source inventory found pricing tokens inside similar plan cards.", "Make one recommended plan dominant and align price, benefits, and CTA rows.");
  }
  if (summary.longTextBlocks >= 1) {
    add("text-heavy-block", "Source inventory found long text blocks.", "Break dense copy into scannable groups while preserving meaning.");
  }
  if (numberFromRecord(styleSignals, "largeRadiusCount") >= 3) {
    add("oversized-radius", "Source inventory found several large-radius elements.", "Reduce excessive radii and reserve large corners for intentional large containers.");
  }
  if (numberFromRecord(styleSignals, "glowCount") >= 1) {
    add("glow-heavy-ui", "Source inventory found colored glow shadows.", "Replace glows with simpler borders, spacing, and neutral shadows.");
  }
  if (
    numberFromRecord(styleSignals, "pillCount") >= 1 &&
    hasAnnouncementBubbleCopy(getInventoryKeywordText(inventory))
  ) {
    add(
      "decorative-announcement-bubble",
      "Source inventory found a pill-shaped announcement/location badge.",
      "Replace the decorative announcement bubble with plain availability copy or a compact functional status badge."
    );
  }

  return {
    summary: uncodixify?.summary ?? "",
    detectedRuleIds,
    visualEvidence: visualEvidence.slice(0, 12),
    topRecommendations: topRecommendations.slice(0, 8)
  };
}

function describeInventorySection(
  sectionType: AIUnderstandingResult["sectionType"],
  summary: ReturnType<typeof getInventorySummary>,
  inventory: Record<string, unknown>
) {
  const heading = String(inventory.primaryHeading ?? "").trim();
  return `${sectionType} block${heading ? ` headed by "${heading}"` : ""} with ${summary.cards} card(s), ${summary.actions} action(s), ${summary.inputs} input(s), and ${summary.media} media item(s).`;
}

function describeInventoryProblem(
  summary: ReturnType<typeof getInventorySummary>,
  inventory: Record<string, unknown>
) {
  const repeated = getRepeatedGroups(inventory).find((group) => group.type === "card" && group.count >= 3);
  if (repeated) return `${repeated.count} similar card-like objects need stronger hierarchy and rhythm.`;
  if (summary.longTextBlocks >= 1) return "Dense text blocks need more scannable structure.";
  if (summary.actions === 0) return "No clear primary action was found in the object inventory.";
  return "Improve hierarchy, grouping, and visual rhythm based on the detected objects.";
}

type RepeatedGroup = {
  type: string;
  count: number;
  similarSize: boolean;
};

function mergeUniqueStrings(...groups: string[][]) {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const group of groups) {
    for (const item of group) {
      const value = typeof item === "string" ? item.trim() : "";
      if (!value || seen.has(value)) continue;
      seen.add(value);
      merged.push(value);
    }
  }

  return merged;
}

function mergeUniqueEnums<const T extends readonly string[]>(
  current: T[number][],
  next: unknown[],
  allowed: T,
  limit: number
) {
  const allowedSet = new Set<string>(allowed as readonly string[]);
  const merged: T[number][] = [];

  for (const item of [...current, ...next]) {
    if (typeof item !== "string" || !allowedSet.has(item)) continue;
    const typed = item as T[number];
    if (merged.includes(typed)) continue;
    merged.push(typed);
    if (merged.length >= limit) break;
  }

  return merged;
}

function getStringArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean)
    : [];
}

function getLabels(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (typeof item === "string") return [item.trim()].filter(Boolean);
    if (!isRecord(item)) return [];

    const label = stringOrEmpty(item.label).trim();
    const title = stringOrEmpty(item.title).trim();
    const text = stringOrEmpty(item.text).trim();
    return [label || title || text].filter(Boolean);
  });
}

function getRepeatedGroups(inventory: Record<string, unknown>): RepeatedGroup[] {
  if (!Array.isArray(inventory.repeatedGroups)) return [];

  return inventory.repeatedGroups
    .filter(isRecord)
    .map((group) => ({
      type: typeof group.type === "string" ? group.type : "unknown",
      count: numberFromRecord(group, "count"),
      similarSize: Boolean(group.similarSize)
    }))
    .filter((group) => group.count > 0);
}

function getInventoryKeywordText(inventory: Record<string, unknown>) {
  return [
    ...getStringArray(inventory.keywords),
    ...getStringArray(inventory.priceTokens),
    ...getStringArray(inventory.metrics),
    ...getStringArray(inventory.headings),
    ...getLabels(inventory.actions),
    ...getLabels(inventory.cards)
  ]
    .join(" ")
    .toLowerCase();
}

function hasAnnouncementBubbleCopy(value: string): boolean {
  return /(?:coming soon|launching soon|available soon|opening soon|now open|new location|new city|\bsoon\b|скоро|жакында|жақында)/i.test(
    value
  );
}

function numberFromRecord(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sanitizeUncodixify(value: unknown): AIUnderstandingResult["uncodixify"] {
  const record = isRecord(value) ? value : {};

  return {
    summary: stringOrEmpty(record.summary),
    detectedRuleIds: sanitizeEnumArray(record.detectedRuleIds, UNCODIXIFY_RULE_IDS, 25),
    visualEvidence: sanitizeStringSentenceArray(record.visualEvidence, 12),
    topRecommendations: sanitizeStringSentenceArray(record.topRecommendations, 8)
  };
}

function sanitizeStringSentenceArray(value: unknown, limit: number) {
  return Array.isArray(value)
    ? value
        .slice(0, limit)
        .map(stringOrEmpty)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function sanitizeRecommendedCategories(value: unknown): AIUnderstandingResult["recommendedCategories"] {
  const record = isRecord(value) ? value : {};

  return {
    layoutCategories: sanitizeEnumArray(record.layoutCategories, SECTION_TYPES, 6),
    templateCategories: sanitizeEnumArray(record.templateCategories, SECTION_TYPES, 6),
    animationCategories: sanitizeEnumArray(record.animationCategories, ANIMATION_CATEGORIES, 6)
  };
}

function sanitizeStringArray(value: unknown, limit: number) {
  return Array.isArray(value)
    ? value.slice(0, limit).map(stringOrEmpty).map(normalizeKeyword).filter(Boolean)
    : [];
}

function sanitizeEnumArray<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
  limit: number
) {
  return Array.isArray(value)
    ? value
        .slice(0, limit)
        .map((item) => oneOf(item, allowed, null))
        .filter((item): item is T[number] => Boolean(item))
    : [];
}

function sanitizeDetectedBlock(value: unknown): AIUnderstandingResult["detectedBlocks"][number] {
  if (!isRecord(value)) {
    return {
      type: "unknown",
      count: 0,
      description: ""
    };
  }

  return {
    type: oneOf(value.type, BLOCK_TYPES, "unknown"),
    count: Math.max(0, Math.round(typeof value.count === "number" ? value.count : 0)),
    description: stringOrEmpty(value.description)
  };
}

function normalizeKeyword(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/^-+|-+$/g, "");
}

function oneOf<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number]
): T[number];
function oneOf<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: null
): T[number] | null;
function oneOf<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number] | null
) {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? value
    : fallback;
}

function clampNumber(value: unknown, min: number, max: number) {
  const numberValue = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return Math.max(min, Math.min(max, numberValue));
}

function stringOrEmpty(value: unknown) {
  return typeof value === "string" ? value : "";
}

function logGemini(requestId: string, message: string, data?: unknown) {
  if (typeof data === "undefined") {
    console.log(`[Gemini][${requestId}] ${message}`);
    return;
  }

  console.log(`[Gemini][${requestId}] ${message}`, data);
}

function safeErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
