# Polar Billing Setup — LookRight Pro

This document describes how to wire up Polar subscription billing for the single
paid plan **LookRight Pro**. The code in this repo is **preparation only**:
checkout + webhook routes exist, but billing is not yet enforced on the
analysis/preview APIs because the project has no auth/user database yet.

> No real secrets are committed. All tokens are read from environment variables.

---

## 1. Create the Polar product

In the Polar dashboard (https://polar.sh, or https://sandbox.polar.sh for
testing) create a product with:

| Field         | Value                          |
| ------------- | ------------------------------ |
| Product name  | `LookRight Pro`                |
| Pricing type  | Recurring subscription         |
| Currency      | USD                            |
| Price         | `9.00` / month                 |
| Visibility    | Public                         |

### 2. Product name
`LookRight Pro`

### 3. Pricing
Recurring subscription, USD `9.00` per month.

### 4. Metadata
Add this metadata to the product:

```json
{
  "product_key": "lookright_pro",
  "plan": "pro",
  "monthly_analysis_limit": 300,
  "monthly_preview_limit": 50,
  "features": ["uncodixify", "ai_preview", "cursor_prompt", "gallery"]
}
```

### 5. Benefit
Create a benefit and attach it to the product:

- **Name:** `Pro Access`
- **Description:** `Unlocks higher analysis limits, AI preview generation, saved results, and Pro features.`

**Product description:**
`Detect AI-looking UI and fix it faster with evidence-based recommendations, AI previews, and Cursor-ready prompts.`

After creating the product, copy its **Product ID** into `POLAR_PRODUCT_ID`.

---

## 6. Environment variables

Local: copy `web/.env.example` to `web/.env.local` and fill in values.

```env
POLAR_ACCESS_TOKEN=        # Organization Access Token from Polar settings
POLAR_WEBHOOK_SECRET=      # Webhook signing secret (from the webhook you create)
POLAR_PRODUCT_ID=          # LookRight Pro product ID
POLAR_SUCCESS_URL=https://polish-pilot.vercel.app/billing/success
POLAR_CANCEL_URL=https://polish-pilot.vercel.app/billing/cancel
APP_BASE_URL=https://polish-pilot.vercel.app
POLAR_SERVER=production    # or "sandbox" for testing
```

### 7. Vercel env setup
These variables must be added in Vercel (Project → Settings → Environment
Variables) for Production (and Preview if you test there). They are **not**
read from the repo. Re-deploy after changing them.

---

## 8. Checkout route
`POST /api/billing/create-checkout`

- File: `web/app/api/billing/create-checkout/route.ts`
- Input JSON: `{ "email": "user@example.com" }` (email optional)
- Creates a Polar checkout session for `POLAR_PRODUCT_ID` using
  `POLAR_ACCESS_TOKEN`, with `success_url = POLAR_SUCCESS_URL` and
  `customer_email` from the request.
- Success: `{ "ok": true, "checkoutUrl": "..." }`
- Error: `{ "ok": false, "error": { "code": "POLAR_CHECKOUT_FAILED", "message": "..." } }`
- The access token is used server-side only and never returned to the client.

> Auth not ready: the route accepts an email for now. Once auth exists, bind the
> checkout to a `userId` (pass it as checkout metadata) so the webhook can map
> the subscription to a user.

Production URL: `https://polish-pilot.vercel.app/api/billing/create-checkout`

## 9. Webhook route
`POST /api/billing/polar-webhook`

- File: `web/app/api/billing/polar-webhook/route.ts`
- Verifies the Standard Webhooks signature using `POLAR_WEBHOOK_SECRET`
  (headers `webhook-id`, `webhook-timestamp`, `webhook-signature`).
- Handles: `subscription.created`, `subscription.active`, `subscription.updated`,
  `subscription.canceled` / `subscription.revoked`, and `order.paid` /
  `checkout.updated`.
- Maps the Polar customer/subscription into the `UserBillingState` shape
  (`web/lib/billing/types.ts`). DB persistence is a TODO (no DB yet).
- Returns `{ "ok": true }` after a valid signature.
- In production it logs only safe metadata (event type, ids) — never full
  payloads or secrets.

## 10. Webhook URL to add in Polar
In Polar → Settings → Webhooks, add:

```
https://polish-pilot.vercel.app/api/billing/polar-webhook
```

Copy the generated signing secret into `POLAR_WEBHOOK_SECRET`. Subscribe at least
to the subscription.* and order.paid events.

Other URLs:

```
Success: https://polish-pilot.vercel.app/billing/success
Cancel:  https://polish-pilot.vercel.app/billing/cancel
```

---

## 11. Test checklist
- [ ] `POLAR_SERVER=sandbox` and sandbox token/product set in `web/.env.local`.
- [ ] `POST /api/billing/create-checkout` with `{ "email": "test@example.com" }`
      returns `{ ok: true, checkoutUrl }`.
- [ ] Opening `checkoutUrl` shows the LookRight Pro checkout at $9/month.
- [ ] Completing the sandbox payment redirects to `/billing/success`.
- [ ] Canceling redirects to `/billing/cancel`.
- [ ] Webhook deliveries arrive and pass signature verification (200, `{ ok: true }`).
- [ ] Invalid signature returns 400 and is rejected.

## 12. Production checklist
- [ ] `POLAR_SERVER=production` with production access token + product ID.
- [ ] All Polar env vars set in Vercel for Production and re-deployed.
- [ ] Production webhook registered with the production signing secret.
- [ ] Auth + DB added; checkout bound to `userId`; webhook persists
      `UserBillingState`; analysis/preview routes enforce `getLimitsForPlan`.
