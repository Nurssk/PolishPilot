# Extension Auth Setup

The extension uses the website code flow. It does not use Firebase Auth,
Google popup, `chrome.identity`, or `chrome.offscreen` inside the extension.

## Flow

1. Extension opens:
   `https://www.beuniq.design/extension/authorize`
2. User logs in on the website.
3. Website redirects to `/extension/code` and shows a 6-character code.
4. User copies the code into the extension with their email.
5. Extension exchanges the email/code at:
   `https://polish-pilot.vercel.app/api/extension-auth/exchange`
6. Extension stores the returned bearer token in `chrome.storage.local`.
7. Extension sends the token on API requests:
   `Authorization: Bearer <token>`

## Required Backend Response

```json
{
  "token": "...",
  "tokenType": "Bearer",
  "expiresInSeconds": 2592000,
  "email": "user@example.com"
}
```

## Extension Permissions

The manifest does not need:

- `identity`
- `offscreen`

The login button uses `chrome.tabs.create` to open the website authorization
page, so the existing `tabs` permission is enough.
