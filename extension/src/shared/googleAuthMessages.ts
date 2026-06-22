export const GOOGLE_AUTH_START_MESSAGE = "POLISHPILOT_START_GOOGLE_AUTH";
export const GOOGLE_AUTH_OFFSCREEN_MESSAGE = "POLISHPILOT_FIREBASE_AUTH_OFFSCREEN";
export const GOOGLE_AUTH_REQUEST_MESSAGE = "POLISHPILOT_FIREBASE_AUTH_REQUEST";
export const GOOGLE_AUTH_RESPONSE_MESSAGE = "POLISHPILOT_FIREBASE_AUTH_RESPONSE";

export type GoogleAuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export type GoogleAuthSuccess = {
  ok: true;
  user: GoogleAuthUser;
  idToken: string;
};

export type GoogleAuthFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};

export type GoogleAuthResult = GoogleAuthSuccess | GoogleAuthFailure;
