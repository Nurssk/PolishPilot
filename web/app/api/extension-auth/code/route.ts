import { createExtensionAuthCode } from "../../../../lib/auth/extensionCodeAuth";
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

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: corsHeaders });
}
