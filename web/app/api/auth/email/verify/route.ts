import {
  createAppSessionToken,
  getEmailUserId,
  isEmailAuthConfigured,
  normalizeEmail,
  verifyEmailCode
} from "../../../../../lib/auth/emailCodeAuth";

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
  const body = (await request.json().catch(() => null)) as
    | { email?: unknown; code?: unknown }
    | null;
  const email = normalizeEmail(body?.email);
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  if (!email) {
    return json(
      { ok: false, error: { code: "INVALID_EMAIL", message: "Enter a valid email address." } },
      400
    );
  }
  if (!/^\d{6}$/.test(code)) {
    return json(
      { ok: false, error: { code: "INVALID_CODE", message: "Enter the 6-digit code." } },
      400
    );
  }
  if (!isEmailAuthConfigured()) {
    return json(
      {
        ok: false,
        error: {
          code: "AUTH_NOT_CONFIGURED",
          message: "AUTH_EMAIL_SECRET or AUTH_SESSION_SECRET is not configured."
        }
      },
      500
    );
  }
  if (!verifyEmailCode(email, code)) {
    return json(
      { ok: false, error: { code: "INVALID_CODE", message: "The code is invalid or expired." } },
      401
    );
  }

  const token = createAppSessionToken(email);
  const uid = getEmailUserId(email);
  return json(
    {
      ok: true,
      token,
      user: { uid, email }
    },
    200
  );
}

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: corsHeaders });
}
