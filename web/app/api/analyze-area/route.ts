import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

type AnalyzeAreaRequest = {
  screenshotBase64: string;
  url: string;
  title: string;
  selectedRect: unknown;
  matchedElements: unknown[];
  counts: unknown;
  detected: unknown;
};

type JsonParseStrategy = "direct" | "extracted" | "repaired" | "fallback";
type ErrorStage =
  | "validation"
  | "gemini_request"
  | "gemini_response"
  | "json_parse"
  | "unknown";

type AIUnderstandingResult = {
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
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
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

const SYSTEM_PROMPT = `You are Design Humanizer, a senior UI/UX designer and frontend layout analyst.
You analyze a selected screenshot area from the user's own website/app.
You also receive DOM, CSS, visible text, element counts, and local detection summaries.
Your job is to classify the selected UI block and extract signals that our local template engine can use.
Do NOT generate implementation code.
Do NOT suggest copying external websites.
Do NOT directly choose third-party templates.
Do NOT invent template names or output local database IDs.
Do NOT rewrite user content.
Analyze:
1. What kind of UI block this is.
2. What layout type it currently uses.
3. What content type it contains.
4. What visual/design problem it has.
5. What keywords describe this block.
6. What design intent it serves.
7. What animation categories could improve it.
8. What local pattern/template categories should be searched.
Return strict JSON only.
Important:
- Use keywords that help match local template and animation databases.
- Useful examples: hero, product-preview, trust-bar, cta, button, gradient, dashboard, features, cards, equal-grid, icon-cards, bento, hierarchy, pricing, plan, comparison, stats, metric, social-proof, form, lead-capture, testimonial, logo-cloud, hover, card-hover, stagger, reveal, text-reveal, button-microinteraction.
- Do not include markdown.
- confidence must be between 0 and 1.`;

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
  "reasoning": [""]
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
    matchedElementsCount?: number;
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
    const matchedElements = Array.isArray(body.matchedElements)
      ? body.matchedElements
      : [];
    debugBase = {
      ...debugBase,
      screenshotLength,
      matchedElementsCount: matchedElements.length
    };

    logGemini(requestId, `screenshot exists: ${Boolean(body.screenshotBase64)}`);
    logGemini(requestId, "screenshot summary", {
      startsWithDataImage:
        typeof body.screenshotBase64 === "string" &&
        body.screenshotBase64.startsWith("data:image"),
      length: screenshotLength
    });
    logGemini(requestId, `matchedElements count: ${matchedElements.length}`, {
      sample: matchedElements.slice(0, 3).map(compactMatchedElementLog)
    });
    logGemini(requestId, "counts summary", body.counts ?? null);
    logGemini(requestId, "selectedRect size", summarizeSelectedRect(body.selectedRect));

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
      url: typeof body.url === "string" ? body.url : "",
      title: typeof body.title === "string" ? body.title : "",
      selectedRect: body.selectedRect ?? null,
      matchedElements: Array.isArray(body.matchedElements) ? body.matchedElements : [],
      counts: body.counts ?? null,
      detected: body.detected ?? null
    };

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildGeminiPrompt(payload);
    const generated = await generateGeminiText(ai, normalizedImage, prompt, requestId);
    debugBase = {
      ...debugBase,
      model: generated.model,
      retryCount: generated.retryCount
    };

    logGemini(requestId, "Gemini response received");
    logGemini(requestId, `raw response length: ${generated.text.length}`);

    let parsed: unknown;
    let jsonParseStrategy: JsonParseStrategy;
    try {
      const parsedResult = parseGeminiJson(generated.text);
      parsed = parsedResult.value;
      jsonParseStrategy = parsedResult.strategy;
      logGemini(requestId, "JSON parse success", { strategy: jsonParseStrategy });
    } catch (error) {
      logGemini(requestId, "JSON parse failure", { error: safeErrorMessage(error) });
      parsed = buildFallbackAIUnderstandingResult(payload);
      jsonParseStrategy = "fallback";
      logGemini(requestId, "using local fallback result after JSON parse failure", {
        error: safeErrorMessage(error)
      });
    }

    const result = sanitizeAIUnderstandingResult(parsed);

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
          matchedElementsCount: matchedElements.length,
          localDetected: body.detected ?? null,
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
    matchedElementsCount?: number;
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

function buildGeminiPrompt(payload: AnalyzeAreaRequest) {
  const compactContext = {
    url: payload.url,
    title: payload.title,
    selectedRect: payload.selectedRect,
    counts: payload.counts,
    detected: payload.detected,
    matchedElements: payload.matchedElements.slice(0, 30).map(compactMatchedElement)
  };

  return `${SYSTEM_PROMPT}

Selected area context:
${JSON.stringify(compactContext, null, 2)}

${RESPONSE_SHAPE}`;
}

function compactMatchedElement(element: unknown) {
  if (!isRecord(element)) {
    return element;
  }

  const rect = isRecord(element.rect) ? element.rect : null;
  const style = isRecord(element.style) ? element.style : null;

  return {
    tagName: stringOrNull(element.tagName),
    id: stringOrNull(element.id),
    className: truncate(stringOrNull(element.className), 140),
    role: stringOrNull(element.role),
    ariaLabel: truncate(stringOrNull(element.ariaLabel), 120),
    text: truncate(stringOrNull(element.text), 180),
    rect,
    style: style
      ? {
          display: style.display,
          position: style.position,
          backgroundColor: style.backgroundColor,
          color: style.color,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          borderRadius: style.borderRadius,
          boxShadow: style.boxShadow,
          padding: style.padding,
          margin: style.margin
        }
      : null
  };
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

function buildFallbackAIUnderstandingResult(payload: AnalyzeAreaRequest): AIUnderstandingResult {
  const detected = isRecord(payload.detected) ? payload.detected : {};
  const counts = isRecord(payload.counts) ? payload.counts : {};
  const sectionType = oneOf(detected.sectionType, SECTION_TYPES, "unknown");
  const layoutType = oneOf(detected.layoutType, LAYOUT_TYPES, "unknown");
  const blocks: AIUnderstandingResult["detectedBlocks"] = [];
  const blockCountMap: Array<[AIUnderstandingResult["detectedBlocks"][number]["type"], unknown]> = [
    ["heading", counts.headings],
    ["button", counts.buttons],
    ["image", counts.images],
    ["icon", counts.svgs],
    ["input", counts.inputs],
    ["card", counts.cardsEstimate],
    ["text", counts.textLength]
  ];

  blockCountMap.forEach(([type, value]) => {
    const count = numberOrZero(value);

    if (count <= 0) {
      return;
    }

    blocks.push({
      type,
      count,
      description: `${count} ${type} ${count === 1 ? "block" : "blocks"} detected locally.`
    });
  });

  return {
    sectionType,
    layoutType,
    contentType: inferContentType(sectionType, counts),
    confidence: 0.35,
    detectedBlocks: blocks.slice(0, 10),
    detectedKeywords: extractLocalKeywords(payload),
    designIntent: inferDesignIntent(sectionType),
    uiProblems: inferLocalProblems(sectionType, layoutType, counts),
    recommendedCategories: {
      layoutCategories: [sectionType],
      templateCategories: [sectionType],
      animationCategories: inferAnimationCategories(sectionType, counts)
    },
    animationKeywords: inferAnimationKeywords(sectionType, counts),
    designerDescription:
      sectionType === "unknown"
        ? "PolishPilot could not parse Gemini JSON, so this uses local DOM and screenshot metadata."
        : `This appears to be a ${sectionType} section using a ${layoutType} layout.`,
    currentLayoutProblem:
      "Gemini returned malformed JSON, so PolishPilot used a local fallback classification.",
    reasoning: [
      "Gemini response JSON could not be parsed.",
      "Fallback result was built from local DOM counts and detected layout metadata."
    ]
  };
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
      : []
  };
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

function extractLocalKeywords(payload: AnalyzeAreaRequest) {
  const detected = isRecord(payload.detected) ? payload.detected : {};
  const counts = isRecord(payload.counts) ? payload.counts : {};
  const elementText = payload.matchedElements
    .slice(0, 40)
    .map((element) => {
      if (!isRecord(element)) return "";
      return [element.tagName, element.className, element.role, element.ariaLabel, element.text]
        .map(stringOrEmpty)
        .join(" ");
    })
    .join(" ");
  const base = [
    stringOrEmpty(detected.sectionType),
    stringOrEmpty(detected.layoutType),
    counts.cardsEstimate ? "cards" : "",
    counts.buttons ? "button cta" : "",
    counts.inputs ? "form input lead-capture" : "",
    counts.images ? "image product-preview" : "",
    counts.svgs ? "icon" : "",
    elementText
  ].join(" ");

  return [...new Set(base.split(/[^a-zA-Z0-9_-]+/).map(normalizeKeyword).filter(Boolean))].slice(0, 30);
}

function inferContentType(
  sectionType: AIUnderstandingResult["sectionType"],
  counts: Record<string, unknown>
): AIUnderstandingResult["contentType"] {
  if (sectionType === "pricing") return "pricing_plans";
  if (sectionType === "stats") return "metrics";
  if (sectionType === "form" || numberOrZero(counts.inputs) > 0) return "form";
  if (sectionType === "testimonials") return "testimonial_cards";
  if (sectionType === "dashboard") return "dashboard_widgets";
  if (sectionType === "navigation") return "navigation_links";
  if (numberOrZero(counts.cardsEstimate) > 0) return "cards";
  if (numberOrZero(counts.textLength) > 0) return "text_block";
  return "unknown";
}

function inferDesignIntent(sectionType: AIUnderstandingResult["sectionType"]): AIUnderstandingResult["designIntent"] {
  if (sectionType === "hero" || sectionType === "cta" || sectionType === "pricing") return "conversion";
  if (sectionType === "features" || sectionType === "cards") return "explanation";
  if (sectionType === "stats" || sectionType === "dashboard") return "data_summary";
  if (sectionType === "form" || sectionType === "auth") return "lead_capture";
  if (sectionType === "testimonials") return "social_proof";
  if (sectionType === "navigation") return "navigation";
  return "unknown";
}

function inferLocalProblems(
  sectionType: AIUnderstandingResult["sectionType"],
  layoutType: AIUnderstandingResult["layoutType"],
  counts: Record<string, unknown>
): AIUnderstandingResult["uiProblems"] {
  const problems = new Set<AIUnderstandingResult["uiProblems"][number]>();

  if (layoutType === "equal_grid") problems.add("cards_too_equal");
  if (layoutType === "equal_grid" || sectionType === "cards") problems.add("flat_layout");
  if (numberOrZero(counts.textLength) > 500) problems.add("too_text_heavy");
  if (numberOrZero(counts.buttons) === 0 && (sectionType === "hero" || sectionType === "cta")) problems.add("cta_not_clear");
  if (numberOrZero(counts.cardsEstimate) >= 3) problems.add("too_repetitive");
  if (sectionType === "hero" || sectionType === "features") problems.add("weak_hierarchy");

  return problems.size ? [...problems] : ["unknown"];
}

function inferAnimationCategories(
  sectionType: AIUnderstandingResult["sectionType"],
  counts: Record<string, unknown>
): AIUnderstandingResult["recommendedCategories"]["animationCategories"] {
  const categories = new Set<AIUnderstandingResult["recommendedCategories"]["animationCategories"][number]>();

  if (sectionType === "hero" || sectionType === "cta") {
    categories.add("text");
    categories.add("button");
    categories.add("background");
  }
  if (sectionType === "features" || sectionType === "cards" || sectionType === "pricing") {
    categories.add("card");
    categories.add("hover");
    categories.add("scroll");
  }
  if (sectionType === "dashboard" || sectionType === "form" || numberOrZero(counts.inputs) > 0) {
    categories.add("loader");
    categories.add("button");
  }
  if (sectionType === "navigation") categories.add("navigation");

  return categories.size ? [...categories] : ["other"];
}

function inferAnimationKeywords(
  sectionType: AIUnderstandingResult["sectionType"],
  counts: Record<string, unknown>
) {
  const keywords = new Set<string>();

  if (sectionType === "hero") {
    keywords.add("text-reveal");
    keywords.add("background");
  }
  if (numberOrZero(counts.cardsEstimate) > 0) {
    keywords.add("card-hover");
    keywords.add("stagger");
  }
  if (numberOrZero(counts.buttons) > 0) keywords.add("button-microinteraction");
  if (sectionType === "features" || sectionType === "pricing") keywords.add("reveal");

  return [...keywords];
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

function numberOrZero(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.round(value))
    : 0;
}

function stringOrNull(value: unknown) {
  return typeof value === "string" ? value : null;
}

function stringOrEmpty(value: unknown) {
  return typeof value === "string" ? value : "";
}

function truncate(value: string | null, maxLength: number) {
  if (!value) {
    return value;
  }

  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

function logGemini(requestId: string, message: string, data?: unknown) {
  if (typeof data === "undefined") {
    console.log(`[Gemini][${requestId}] ${message}`);
    return;
  }

  console.log(`[Gemini][${requestId}] ${message}`, data);
}

function compactMatchedElementLog(element: unknown) {
  if (!isRecord(element)) {
    return { tagName: "unknown", text: "" };
  }

  return {
    tagName: truncate(stringOrNull(element.tagName), 30) ?? "unknown",
    text: truncate(stringOrNull(element.text), 80) ?? ""
  };
}

function summarizeSelectedRect(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }

  return {
    width: typeof value.width === "number" ? Math.round(value.width) : null,
    height: typeof value.height === "number" ? Math.round(value.height) : null
  };
}

function safeErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
