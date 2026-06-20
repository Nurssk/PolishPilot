import { verifyAppSessionToken } from "./emailCodeAuth";
import { verifyFirebaseToken } from "./verifyFirebaseToken";

export type AuthenticatedUser = {
  uid: string;
  email?: string;
};

export async function readAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const token = readBearerToken(request);
  if (!token) return null;
  return verifyAppSessionToken(token) ?? (await verifyFirebaseToken(token));
}

export function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization") ?? request.headers.get("Authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}
