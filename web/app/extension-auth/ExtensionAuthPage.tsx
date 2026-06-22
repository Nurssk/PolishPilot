"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  type User
} from "firebase/auth";
import { firebaseAuth } from "../../lib/firebase/client";

const REQUEST_TYPE = "POLISHPILOT_FIREBASE_AUTH_REQUEST";
const RESPONSE_TYPE = "POLISHPILOT_FIREBASE_AUTH_RESPONSE";

type AuthRequestMessage = {
  type?: string;
};

type AuthResponseMessage =
  | {
      type: typeof RESPONSE_TYPE;
      ok: true;
      user: {
        uid: string;
        email: string | null;
        displayName: string | null;
        photoURL: string | null;
      };
      idToken: string;
    }
  | {
      type: typeof RESPONSE_TYPE;
      ok: false;
      error: {
        code: string;
        message: string;
      };
    };

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export function ExtensionAuthPage() {
  const [status, setStatus] = useState("Waiting for extension...");

  useEffect(() => {
    async function handleMessage(event: MessageEvent<AuthRequestMessage>) {
      if (!isExtensionOrigin(event.origin) || event.data?.type !== REQUEST_TYPE) {
        return;
      }

      setStatus("Opening Google sign-in...");
      const response = await signIn();
      event.source?.postMessage(response, { targetOrigin: event.origin });
      setStatus(response.ok ? "Sign-in complete." : "Sign-in failed.");
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        <p style={styles.eyebrow}>PolishPilot</p>
        <h1 style={styles.title}>Extension sign-in</h1>
        <p style={styles.text}>{status}</p>
      </section>
    </main>
  );
}

async function signIn(): Promise<AuthResponseMessage> {
  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const idToken = await result.user.getIdToken();

    return {
      type: RESPONSE_TYPE,
      ok: true,
      user: toPlainUser(result.user),
      idToken
    };
  } catch (error) {
    const code = (error as { code?: string })?.code ?? "auth/unknown";
    return {
      type: RESPONSE_TYPE,
      ok: false,
      error: {
        code,
        message: error instanceof Error ? error.message : "Could not sign in with Google."
      }
    };
  }
}

function toPlainUser(user: User) {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  };
}

function isExtensionOrigin(origin: string): boolean {
  return origin.startsWith("chrome-extension://");
}

const styles = {
  page: {
    alignItems: "center",
    background: "var(--bg)",
    color: "var(--text)",
    display: "flex",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: "100vh",
    padding: 24
  },
  panel: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-card)",
    boxShadow: "var(--shadow)",
    margin: "0 auto",
    maxWidth: 420,
    padding: 24,
    width: "100%"
  },
  eyebrow: {
    color: "var(--muted)",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0,
    margin: "0 0 10px",
    textTransform: "uppercase"
  },
  title: {
    color: "var(--text)",
    fontSize: 28,
    lineHeight: 1.1,
    margin: 0
  },
  text: {
    color: "var(--muted)",
    fontSize: 15,
    lineHeight: 1.6,
    margin: "14px 0 0"
  }
} satisfies Record<string, CSSProperties>;
