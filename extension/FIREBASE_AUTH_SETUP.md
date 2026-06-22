# Firebase Auth Setup (Google sign-in for the Chrome extension)

The extension signs in with Google using **Firebase Auth** + Chrome's
`chrome.identity.launchWebAuthFlow` (the MV3-correct flow — no web popup). The
Firebase web config is public and already in `extension/src/shared/firebase.ts`.

> **Blocking step:** Google must allow the extension redirect URI. If the
> OAuth client does not include the exact `https://<EXTENSION_ID>.chromiumapp.org/`
> URL, Google returns `redirect_uri_mismatch`.

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
   VITE_GOOGLE_OAUTH_CLIENT_ID=190071602462-qkbijci6vff39s528to3gj7pqhf0cfjf.apps.googleusercontent.com
   ```
   Use `extension/.env.local` for local development or your production build
   environment for release builds, then rebuild the extension.

> We use a **Web application** OAuth client (not a "Chrome App" client) because
> the flow is `launchWebAuthFlow` + `signInWithCredential`, which does not use the
> manifest `oauth2` block or `chrome.identity.getAuthToken`.

## 4. Extension ID (local unpacked)
- Load `extension/dist` via `chrome://extensions` → **Load unpacked**.
- The card shows the **ID** — that's `<EXTENSION_ID>` for the redirect URI above.
- If Google sign-in fails, the extension now prints the exact redirect URI in the
  login error message after the auth window closes.
- **The ID changes** between machines/reloads for unpacked extensions **unless you
  pin it** by adding a `"key"` to `manifest.json` (the public key half of a
  generated key pair). For stable local testing, generate a key and add it; the
  Web Store assigns a permanent ID on publish. Update the redirect URI whenever
  the ID changes.

## 5. OAuth consent / Google verification copy
Use only the basic scopes: `openid`, `email`, `profile`.

Suggested app description:
```text
PolishPilot helps users capture screenshots of web UI sections and generate
design feedback. Google sign-in is used only to identify the user account,
show the signed-in email/profile, and associate screenshot usage credits with
that account. PolishPilot does not access Gmail, Drive, Calendar, or other
Google user data.
```

## 6. Secrets / config
- **No service account** in the extension. The Firebase web config is public.
- The backend verifies Firebase **ID tokens** and reads usage credits from
  Firestore. Vercel must have either `FIREBASE_SERVICE_ACCOUNT_JSON` or the split
  `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`
  variables; the private key must never be committed.

## Summary of what the owner must do
1. Enable Google provider in Firebase. ✅ required
2. Create a **Web application** OAuth client in GCP with the
   `https://<extension-id>.chromiumapp.org/` redirect URI. ✅ required
3. Keep `VITE_GOOGLE_OAUTH_CLIENT_ID` in the extension env files and rebuild. ✅ required
4. (Optional) Pin the extension ID with a manifest `key` for stable local testing.
5. Add Firebase Admin env vars in Vercel for Firestore usage tracking.
