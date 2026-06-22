import { exchangeExtensionAuthCode } from "../../../../lib/auth/extensionCodeAuth";
import { createAppSessionToken } from "../../../../lib/auth/emailCodeAuth";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: unknown; code?: unknown }
    | null;
  const result = await exchangeExtensionAuthCode(body?.email, body?.code);

  if (!result.ok) {
    return json(
      {
        ok: false,
        error: {
          code: result.code,
          message: result.message
        }
      },
      result.status
    );
  }

  let token: string;
  try {
    token = createAppSessionToken(result.email);
  } catch {
    return json(
      {
        ok: false,
        error: {
          code: "TOKEN_CREATE_FAILED",
          message: "Could not create an extension session. Try again."
        }
      },
      500
    );
  }

  return json(
    {
      token,
      tokenType: "Bearer",
      expiresInSeconds: SESSION_TTL_SECONDS,
      email: result.email
    },
    200
  );
}

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: corsHeaders });
}
