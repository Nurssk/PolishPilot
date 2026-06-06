import { GoogleGenAI, type Model } from "@google/genai";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type GeminiModelSummary = {
  name: string;
  displayName: string;
  supportedActions: string[];
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return errorResponse(500, {
        code: "MISSING_GEMINI_API_KEY",
        message: "GEMINI_API_KEY is not configured in web/.env.local",
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const pager = await ai.models.list({
      config: {
        pageSize: 100,
        queryBase: true,
      },
    });
    const models: GeminiModelSummary[] = [];

    for await (const model of pager) {
      models.push(toModelSummary(model));
    }

    models.sort((a, b) => a.name.localeCompare(b.name));

    return Response.json(
      {
        ok: true,
        models,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    return errorResponse(502, {
      code: "GEMINI_MODELS_LIST_FAILED",
      message: "Could not list Gemini models for the current API key.",
      details: safeErrorMessage(error),
    });
  }
}

function toModelSummary(model: Model): GeminiModelSummary {
  return {
    name: model.name ?? "",
    displayName: model.displayName ?? "",
    supportedActions: Array.isArray(model.supportedActions) ? model.supportedActions : [],
  };
}

function errorResponse(
  status: number,
  error: {
    code: string;
    message: string;
    details?: string;
  }
) {
  return Response.json(
    {
      ok: false,
      error,
    },
    {
      status,
      headers: corsHeaders,
    }
  );
}

function safeErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
