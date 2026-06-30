import { createExtensionAuthCode } from "../../../../lib/auth/extensionCodeAuth";
import { consumeCodeSendAllowance } from "../../../../lib/auth/codeRateLimit";
import { readAuthenticatedUser } from "../../../../lib/auth/readAuthenticatedUser";

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
        error: { code: "MISSING_AUTH", message: "Sign in on the website first." }
      },
      401
    );
  }

  const rateLimit = await consumeCodeSendAllowance("extension-code", user.email);
  if (!rateLimit.ok) {
    return json(
      {
        ok: false,
        error: {
          code: "RATE_LIMITED",
          message: "Too many code requests. Try again in a minute."
        }
      },
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) }
    );
  }

  const result = await createExtensionAuthCode(user.email);
  return json(
    {
      ok: true,
      email: user.email,
      code: result.code,
      expiresAt: result.expiresAt
    },
    200
  );
}

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...corsHeaders, ...headers } });
}
