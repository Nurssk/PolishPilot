import { readAuthenticatedUser } from "../../../../lib/auth/readAuthenticatedUser";
import { getScreenshotUsage } from "../../../../lib/billing/screenshotUsage";

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
  if (!user?.email) {
    return json(
      {
        ok: false,
        error: { code: "MISSING_AUTH", message: "Sign in to view screenshot usage." }
      },
      401
    );
  }

  try {
    const usage = await getScreenshotUsage(user.email);
    return json({ ok: true, usage }, 200);
  } catch (error) {
    return json(
      {
        ok: false,
        error: {
          code: "USAGE_BACKEND_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Could not load screenshot usage from Firebase."
        }
      },
      500
    );
  }
}

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: corsHeaders });
}
