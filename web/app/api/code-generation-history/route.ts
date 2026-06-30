import { readAuthenticatedUser } from "../../../lib/auth/readAuthenticatedUser";
import { listCodeGenerationHistory } from "../../../lib/codeGeneration/history";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: Request) {
  const user = await readAuthenticatedUser(request);
  if (!user) {
    return json(
      {
        ok: false,
        error: {
          code: "MISSING_AUTH",
          message: "Authorization bearer token is required."
        }
      },
      401
    );
  }

  const url = new URL(request.url);
  const limit = clamp(Number(url.searchParams.get("limit") ?? 20), 1, 50);
  const includeHtml = url.searchParams.get("includeHtml") === "true";
  const items = await listCodeGenerationHistory(user, { limit, includeHtml });

  return json(
    {
      ok: true,
      items
    },
    200
  );
}

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: corsHeaders });
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}
