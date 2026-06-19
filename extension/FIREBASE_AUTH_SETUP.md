# Firebase Auth Setup (Google sign-in for the Chrome extension)

The extension signs in with Google using **Firebase Auth** + Chrome's
`chrome.identity.launchWebAuthFlow` (the MV3-correct flow — no web popup). The
Firebase web config is public and already in `extension/src/shared/firebase.ts`.

> **Blocking step:** sign-in is wired but disabled until a Google OAuth **Web
> application** client ID is added. Until then the UI shows
> "Google sign-in isn't set up yet" (error code `AUTH_NOT_CONFIGURED`). No fake
> client ID is committed.

## 1. Firebase Console
1. Open the **humanize-ui** project → **Authentication** → **Sign-in method**.
2. Enable the **Google** provider and save.

## 2. Authorized domains
In Authentication → Settings → **Authorized domains**, ensure these exist:
- `humanize-ui.firebaseapp.com`
- `polish-pilot.vercel.app`
- any future production domain.

(Note: `launchWebAuthFlow` uses the `chromiumapp.org` redirect, not an authorized
domain — but keep these for the rest of the app and future web sign-in.)

## 3. Google Cloud Console — OAuth client (required)
1. Open the same GCP project → **APIs & Services → Credentials**.
2. Configure the **OAuth consent screen** if prompted (External, app name, support
   email, scopes `openid`, `email`, `profile`).
3. **Create credentials → OAuth client ID → Web application.**
4. Under **Authorized redirect URIs**, add the extension's redirect URL:
   ```
   https://<EXTENSION_ID>.chromiumapp.org/
   ```
   Get `<EXTENSION_ID>` from `chrome://extensions` (see step 4). The value also
   equals `chrome.identity.getRedirectURL()` at runtime.
5. Copy the generated **Client ID** into the extension env file:
   ```bash
   VITE_GOOGLE_OAUTH_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
   ```
   Use `extension/.env.local` for local development or your production build
   environment for release builds, then rebuild the extension.

> We use a **Web application** OAuth client (not a "Chrome App" client) because
> the flow is `launchWebAuthFlow` + `signInWithCredential`, which does not use the
> manifest `oauth2` block or `chrome.identity.getAuthToken`.

## 4. Extension ID (local unpacked)
- Load `extension/dist` via `chrome://extensions` → **Load unpacked**.
- The card shows the **ID** — that's `<EXTENSION_ID>` for the redirect URI above.
- **The ID changes** between machines/reloads for unpacked extensions **unless you
  pin it** by adding a `"key"` to `manifest.json` (the public key half of a
  generated key pair). For stable local testing, generate a key and add it; the
  Web Store assigns a permanent ID on publish. Update the redirect URI whenever
  the ID changes.

## 5. Secrets / config
- **No service account** in the extension. The Firebase web config is public.
- The backend verifies the Firebase **ID token** with only the project ID +
  Google's public keys (`web/lib/auth/verifyFirebaseToken.ts`) — no service
  account required. A service account (`FIREBASE_CLIENT_EMAIL` /
  `FIREBASE_PRIVATE_KEY` in Vercel) is only needed for future privileged admin
  operations and must never be committed.

## Summary of what the owner must do
1. Enable Google provider in Firebase. ✅ required
2. Create a **Web application** OAuth client in GCP with the
   `https://<extension-id>.chromiumapp.org/` redirect URI. ✅ required
3. Paste the client ID into `authService.ts` and rebuild. ✅ required
4. (Optional) Pin the extension ID with a manifest `key` for stable local testing.
5. (Later) Add `FIREBASE_PROJECT_ID` (and optionally a service account) in Vercel.
