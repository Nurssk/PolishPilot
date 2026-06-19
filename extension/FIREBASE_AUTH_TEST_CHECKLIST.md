# Firebase Auth — Manual Test Checklist

Prereqs (see FIREBASE_AUTH_SETUP.md):
- [ ] Google provider enabled in Firebase Console.
- [ ] Web-application OAuth client created with redirect URI
      `https://<extension-id>.chromiumapp.org/`.
- [ ] `VITE_GOOGLE_OAUTH_CLIENT_ID` set in `extension/.env.local` or the
      production build environment.
- [ ] Extension rebuilt (`npm run build`) and reloaded in `chrome://extensions`.
- [ ] Manifest has the `identity` permission.

Flow:
- [ ] Side panel shows an **Account** section with "Continue with Google".
- [ ] Clicking "Continue with Google" opens the Google auth flow.
- [ ] After approving, the side panel shows "Signed in as {email}".
- [ ] Closing and reopening the side panel still shows the signed-in state
      (login persists).
- [ ] "Sign out" returns to the logged-out state.
- [ ] The popup shows "Signed in as {email}" when signed in, and a "Sign in"
      shortcut (opens the side panel) when signed out.

Non-regression:
- [ ] Analysis works while **logged out** (no `Authorization` header sent).
- [ ] Analysis works while **logged in** (`Authorization: Bearer <token>` sent to
      `/api/analyze-area` and `/api/generate-ai-preview`).
- [ ] AI preview + gallery still work.

Error states (Simple Mode shows friendly text; Developer Mode appends the code):
- [ ] No OAuth client configured → "Google sign-in isn't set up yet" (`AUTH_NOT_CONFIGURED`).
- [ ] Google provider disabled in Firebase → `PROVIDER_DISABLED`.
- [ ] User closes the auth window → `USER_CANCELLED`.
- [ ] Network offline → `NETWORK_ERROR`.
- [ ] Invalid/misconfigured OAuth client → `INVALID_OAUTH_CLIENT`.

Security:
- [ ] No secrets beyond the public Firebase web config are in the built bundle
      (`grep -r "private_key\|service_account" dist` returns nothing).
- [ ] The ID token is not written to `chrome.storage`.
