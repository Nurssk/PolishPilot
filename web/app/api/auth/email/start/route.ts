import {
  createEmailCode,
  isEmailAuthConfigured,
  normalizeEmail,
  sendEmailCode
} from "../../../../../lib/auth/emailCodeAuth";
import { consumeCodeSendAllowance } from "../../../../../lib/auth/codeRateLimit";

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
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = normalizeEmail(body?.email);
  if (!email) {
    return json(
      { ok: false, error: { code: "INVALID_EMAIL", message: "Enter a valid email address." } },
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

  const rateLimit = await consumeCodeSendAllowance("email-login", email);
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

  const code = createEmailCode(email);
  const result = await sendEmailCode(email, code);
  if (result.errorCode) {
    return json(
      {
        ok: false,
        error: {
          code: result.errorCode,
          message:
            result.errorCode === "EMAIL_NOT_CONFIGURED"
              ? "Email delivery is not configured."
              : "Could not send the verification code."
        }
      },
      500
    );
  }

  return json(
    {
      ok: true,
      email,
      ...(result.debugCode ? { debugCode: result.debugCode } : {})
    },
    200
  );
}

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...corsHeaders, ...headers } });
}
