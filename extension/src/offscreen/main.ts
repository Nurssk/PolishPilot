import {
  GOOGLE_AUTH_OFFSCREEN_MESSAGE,
  GOOGLE_AUTH_REQUEST_MESSAGE,
  GOOGLE_AUTH_RESPONSE_MESSAGE,
  type GoogleAuthResult
} from "../shared/googleAuthMessages";

const AUTH_PAGE_URL =
  import.meta.env.VITE_EXTENSION_AUTH_URL?.trim() ||
  `${import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "")}/extension-auth`;

let authFrame: HTMLIFrameElement | null = null;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== GOOGLE_AUTH_OFFSCREEN_MESSAGE) {
    return;
  }

  runAuthFlow()
    .then(sendResponse)
    .catch((error: unknown) => {
      sendResponse({
        ok: false,
        error: {
          code: "offscreen/flow-failed",
          message: error instanceof Error ? error.message : "Google sign-in failed."
        }
      } satisfies GoogleAuthResult);
    });

  return true;
});

async function runAuthFlow(): Promise<GoogleAuthResult> {
  if (!AUTH_PAGE_URL) {
    return {
      ok: false,
      error: {
        code: "offscreen/auth-url-missing",
        message: "VITE_EXTENSION_AUTH_URL or VITE_API_BASE_URL is not configured."
      }
    };
  }

  const frame = await getAuthFrame();
  const authOrigin = new URL(AUTH_PAGE_URL).origin;

  return new Promise<GoogleAuthResult>((resolve) => {
    const timer = window.setTimeout(() => {
      cleanup();
      resolve({
        ok: false,
        error: {
          code: "offscreen/auth-timeout",
          message: "Google sign-in timed out."
        }
      });
    }, 2 * 60 * 1000);

    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("message", handleMessage);
    }

    function handleMessage(event: MessageEvent) {
      if (event.origin !== authOrigin || event.data?.type !== GOOGLE_AUTH_RESPONSE_MESSAGE) {
        return;
      }
      cleanup();
      resolve(toGoogleAuthResult(event.data));
    }

    window.addEventListener("message", handleMessage);
    frame.contentWindow?.postMessage({ type: GOOGLE_AUTH_REQUEST_MESSAGE }, authOrigin);
  });
}

function getAuthFrame(): Promise<HTMLIFrameElement> {
  if (authFrame?.contentWindow) {
    return Promise.resolve(authFrame);
  }

  return new Promise((resolve, reject) => {
    const frame = document.createElement("iframe");
    frame.src = AUTH_PAGE_URL;
    frame.style.display = "none";
    frame.onload = () => {
      authFrame = frame;
      resolve(frame);
    };
    frame.onerror = () => reject(new Error(`Could not load auth page: ${AUTH_PAGE_URL}`));
    document.body.appendChild(frame);
  });
}

function toGoogleAuthResult(value: unknown): GoogleAuthResult {
  if (
    value &&
    typeof value === "object" &&
    "ok" in value &&
    value.ok === true &&
    "user" in value &&
    "idToken" in value &&
    typeof value.idToken === "string"
  ) {
    const user = value.user as {
      uid?: unknown;
      email?: unknown;
      displayName?: unknown;
      photoURL?: unknown;
    };
    if (typeof user.uid === "string") {
      return {
        ok: true,
        user: {
          uid: user.uid,
          email: typeof user.email === "string" ? user.email : null,
          displayName: typeof user.displayName === "string" ? user.displayName : null,
          photoURL: typeof user.photoURL === "string" ? user.photoURL : null
        },
        idToken: value.idToken
      };
    }
  }

  const error =
    value && typeof value === "object" && "error" in value
      ? (value.error as { code?: unknown; message?: unknown })
      : null;
  return {
    ok: false,
    error: {
      code: typeof error?.code === "string" ? error.code : "offscreen/invalid-response",
      message:
        typeof error?.message === "string"
          ? error.message
          : "The auth page returned an invalid response."
    }
  };
}
