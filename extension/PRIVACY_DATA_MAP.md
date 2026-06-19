# Privacy Data Map

What data the extension handles, where it comes from, why, where it is stored,
and what is sent to the backend.

## UI analysis (existing)

| Data | Source | Purpose | Stored | Sent to backend |
| --- | --- | --- | --- | --- |
| Screenshot of selected area | `chrome.tabs.captureVisibleTab` | UI analysis + AI preview | `chrome.storage.session` (current capture only) | Yes, as a separate image payload to `/api/analyze-area` and `/api/generate-ai-preview` |
| DOM/CSS summary of selected area | content script | Local Uncodixify rules + Gemini analysis | `chrome.storage.session` | Yes (compacted elements + computed styles) |
| Generated previews | Gemini image API | Preview gallery | `chrome.storage.session` | N/A (returned to client) |

## Authentication (new — Firebase Auth, Google)

| Data | Source | Purpose | Stored | Sent to backend |
| --- | --- | --- | --- | --- |
| Google email / profile (uid, email, displayName, photoURL) | Firebase Auth | Account identity | Firebase auth state (IndexedDB) + a safe copy in `chrome.storage.local` | Not directly; identity is conveyed via the ID token |
| Firebase ID token | Firebase Auth | Backend authentication | Firebase internal/session only (never persisted by us manually) | Only as an `Authorization: Bearer <token>` header, and only when signed in |

Notes:
- Only **safe profile fields** are cached in `chrome.storage.local` (uid, email,
  displayName, photoURL). The ID token is **never** written to storage by us.
- The ID token is attached to backend requests **only when the user is signed
  in**. Anonymous analysis sends no auth header.
- Authentication is handled by **Firebase / Google**; the extension never sees the
  user's Google password.
- Users can **sign out** at any time (side panel → Account → Sign out), which
  clears the Firebase session and the cached profile.
- Profile data is used for account features and, later, Polar billing and saved
  analysis history.

## Not collected
- No passwords, payment card data, health data, location, or browsing history.
- No service-account keys or admin secrets are shipped in the extension.
