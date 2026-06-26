# Extension Auth Manual Test Checklist

Prereqs:
- [ ] Backend has `https://www.beuniq.design/extension/authorize`.
- [ ] Backend redirects signed-in users to `/extension/code`.
- [ ] Backend generates a 6-character uppercase alphanumeric code.
- [ ] Backend has `POST https://polish-pilot.vercel.app/api/extension-auth/exchange`.
- [ ] Exchange response returns `token`, `tokenType: "Bearer"`,
      `expiresInSeconds`, and `email`.
- [ ] Extension rebuilt (`npm run build`) and reloaded in `chrome://extensions`.
- [ ] Manifest has no `identity` or `offscreen` permission.

Flow:
- [ ] Side panel shows an Account section with "Open authorization page".
- [ ] Clicking "Open authorization page" opens
      `https://www.beuniq.design/extension/authorize`.
- [ ] After website login, `/extension/code` shows a 6-character code.
- [ ] Extension code input uppercases letters automatically.
- [ ] Extension code input accepts only letters and numbers.
- [ ] Submitting email + code shows "Signed in as {email}".
- [ ] Closing and reopening the side panel still shows the signed-in state.
- [ ] "Sign out" returns to the logged-out state.
- [ ] Popup shows signed-in email when signed in.

Non-regression:
- [ ] Analysis works while logged out with no `Authorization` header.
- [ ] Analysis works while logged in with `Authorization: Bearer <token>`.
- [ ] AI preview and gallery still work.

Error states:
- [ ] Invalid code shows a clear invalid-code message.
- [ ] Expired code shows a clear expired-code message.
- [ ] Used code shows a clear used-code message.
- [ ] Offline or unreachable exchange endpoint shows a network error.

Security:
- [ ] The extension does not generate auth codes.
- [ ] The extension does not run Google/Firebase popup auth.
- [ ] No Firebase packages are bundled in the built extension.
