import { getFirebaseAdminDebugInfo } from "../../../../lib/auth/firebaseAdmin";
import { getFirestoreDocument } from "../../../../lib/firebase/firestoreRest";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function GET() {
  const admin = getFirebaseAdminDebugInfo();
  const [firestore, firebaseKeys] = await Promise.all([
    checkFirestoreAccess(),
    checkFirebasePublicKeys()
  ]);

  return Response.json(
    {
      ok: true,
      checkedAt: new Date().toISOString(),
      firebase: {
        admin,
        firestore,
        firebasePublicKeys: firebaseKeys
      }
    },
    {
      status: 200,
      headers: corsHeaders
    }
  );
}

async function checkFirestoreAccess() {
  if (!getFirebaseAdminDebugInfo().hasAdminCredentials) {
    return {
      ok: false,
      skipped: true,
      reason: "admin_credentials_missing"
    };
  }

  try {
    await getFirestoreDocument("customerCredits", "debug_probe");
    return {
      ok: true,
      message: "Firestore REST auth succeeded"
    };
  } catch (error) {
    return {
      ok: false,
      error: sanitizeError(error)
    };
  }
}

async function checkFirebasePublicKeys() {
  try {
    const response = await fetch(
      "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
      { cache: "no-store" }
    );
    if (!response.ok) {
      return {
        ok: false,
        status: response.status
      };
    }
    const body = (await response.json()) as { keys?: unknown[] };
    return {
      ok: true,
      keyCount: Array.isArray(body.keys) ? body.keys.length : 0
    };
  } catch (error) {
    return {
      ok: false,
      error: sanitizeError(error)
    };
  }
}

function sanitizeError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Unknown error";
}
