import { readAuthenticatedUser } from "../../../../../lib/auth/readAuthenticatedUser";
import { consumeScreenshot } from "../../../../../lib/billing/screenshotUsage";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  const user = await readAuthenticatedUser(request);
  if (!user?.email) {
    return json(
      {
        ok: false,
        error: { code: "MISSING_AUTH", message: "Sign in to take screenshots." }
      },
      401
    );
  }

  try {
    const usage = await consumeScreenshot(user.email);
    return json({ ok: true, usage }, 200);
  } catch (error) {
    if (error instanceof Error && error.name === "USAGE_LIMIT_EXCEEDED") {
      return json(
        {
          ok: false,
          error: {
            code: "USAGE_LIMIT_EXCEEDED",
            message: "You have no screenshots left this period."
          }
        },
        402
      );
    }

    return json(
      {
        ok: false,
        error: {
          code: "USAGE_BACKEND_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Could not update screenshot usage in Firebase."
        }
      },
      500
    );
  }
}

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: corsHeaders });
}
