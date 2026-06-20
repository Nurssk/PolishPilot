import { readAuthenticatedUser } from "../../../lib/auth/readAuthenticatedUser";
import { getScreenshotUsage } from "../../../lib/billing/screenshotUsage";
import { getLimitsForPlan } from "../../../lib/billing/usageLimits";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: Request) {
  const verified = await readAuthenticatedUser(request);
  if (!verified) {
    return json(
      {
        ok: false,
        error: { code: "MISSING_AUTH", message: "Authorization bearer token is required." }
      },
      401
    );
  }

  const usage = verified.email ? await getScreenshotUsage(verified.email) : null;
  const plan = usage?.plan ?? "free";

  return json(
    {
      ok: true,
      user: { uid: verified.uid, email: verified.email ?? null },
      plan,
      limits: getLimitsForPlan(plan),
      usage
    },
    200
  );
}

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: corsHeaders });
}
