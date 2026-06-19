import { verifyAppSessionToken } from "../../../lib/auth/emailCodeAuth";
import { verifyFirebaseToken } from "../../../lib/auth/verifyFirebaseToken";
import { getLimitsForPlan } from "../../../lib/billing/usageLimits";
import type { UserPlan } from "../../../lib/billing/types";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// Sample protected route: returns the verified user identity + plan.
// Accepts the extension email session token, with Firebase ID-token fallback for
// older clients.
export async function GET(request: Request) {
  const token = readBearerToken(request);
  if (!token) {
    return json(
      {
        ok: false,
        error: { code: "MISSING_AUTH", message: "Authorization bearer token is required." }
      },
      401
    );
  }

  const verified = verifyAppSessionToken(token) ?? (await verifyFirebaseToken(token));
  if (!verified) {
    return json(
      {
        ok: false,
        error: { code: "INVALID_TOKEN", message: "Firebase ID token is invalid or expired." }
      },
      401
    );
  }

  // Plan is "free" until Polar billing is connected (no DB yet).
  const plan: UserPlan = "free";

  return json(
    {
      ok: true,
      user: { uid: verified.uid, email: verified.email ?? null },
      plan,
      limits: getLimitsForPlan(plan)
    },
    200
  );
}

function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: corsHeaders });
}
