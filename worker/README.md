# Wings of Shalom — Stripe Checkout Worker

A tiny Cloudflare Worker that turns the site's cart into a **Stripe Checkout**
session. It recomputes every price from its own `CATALOG` so the browser can
never tamper with amounts, and lets Stripe collect the card, **shipping
address**, and phone number.

## Why a worker?
The site is static (GitHub Pages) and cannot hold your secret Stripe key. The
worker holds the secret and talks to Stripe on the server side — the standard,
PCI-safe pattern. You never touch raw card numbers.

## One-time setup (~10 min)

1. **Create a Stripe account** → get your **Secret key** (`sk_test_…` for testing,
   `sk_live_…` when ready) from the Stripe Dashboard → Developers → API keys.

2. **Install Wrangler** (Cloudflare's CLI) and log in:
   ```bash
   npm i -g wrangler
   wrangler login
   ```

3. **Add your secret key** (kept encrypted by Cloudflare, never in git):
   ```bash
   cd worker
   wrangler secret put STRIPE_SECRET_KEY
   # paste sk_test_… (or sk_live_…) when prompted
   ```

4. **Edit `wrangler.toml`** — set `ALLOWED_ORIGIN`, `SUCCESS_URL`, `CANCEL_URL`
   to your real site URLs (no trailing slash on ALLOWED_ORIGIN).

5. **Deploy**:
   ```bash
   wrangler deploy
   ```
   Wrangler prints a URL like `https://wings-of-shalom-checkout.<you>.workers.dev`.

6. **Connect the site**: open `assets/js/products.js` and set
   ```js
   checkoutEndpoint: "https://wings-of-shalom-checkout.<you>.workers.dev"
   ```
   Commit & push. The **Checkout** button now sends buyers to Stripe.

## Testing
Use Stripe **test mode** (`sk_test_…`) and card `4242 4242 4242 4242`, any future
expiry, any CVC/ZIP. Switch to `sk_live_…` when you're ready to take real orders.

## Keeping prices correct
`checkout.js` → `CATALOG` is the **source of truth for money**. Whenever you
change a product's price or options in `assets/js/products.js`, mirror it here,
then `wrangler deploy` again. (products.js is display-only; the worker decides
the real charge.)

## Shipping & tax
- Flat shipping / free-over-threshold is set in `checkout.js`
  (`FLAT_SHIP`, `FREE_SHIP_OVER`). Stripe collects the shipping address.
- For automatic sales tax, enable **Stripe Tax** in the dashboard, then set
  `STRIPE_TAX = "on"` in `wrangler.toml` and redeploy.

## Prefer no code at all?
You can instead create **Payment Links** per product in the Stripe dashboard and
point the buttons there — but you lose the multi-item cart and variant pricing.
The worker is the recommended path.
