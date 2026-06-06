# Deployment

Production backend:

```txt
https://polish-pilot.vercel.app
```

Health check:

```txt
https://polish-pilot.vercel.app/api/health
```

To build the Chrome extension for the production backend:

```bash
cd /Users/nursultansarsenbay/dev/swipeUI/extension
npm run build
```

The production build uses `extension/.env.production`:

```txt
VITE_API_BASE_URL=https://polish-pilot.vercel.app
```

Then reload the unpacked extension from:

```txt
/Users/nursultansarsenbay/dev/swipeUI/extension/dist
```

For local backend testing:

```bash
cd /Users/nursultansarsenbay/dev/swipeUI/web
npm run dev
```

Local extension development uses `extension/.env.local`:

```txt
VITE_API_BASE_URL=http://localhost:3000
```

Do not put Gemini API keys in extension env files. Keep Gemini keys only in the
backend environment, such as Vercel project environment variables or `web/.env.local`.
