/* ============================================================================
   WINGS OF SHALOM — Stripe Checkout Worker  (Cloudflare Workers)
   ----------------------------------------------------------------------------
   Creates a Stripe Checkout Session from the cart. Prices are recomputed here
   from CATALOG (server-side source of truth) so the browser can never set the
   amount. Stripe collects the card, shipping address, and phone.

   DEPLOY (see worker/README.md):
     1. npm i -g wrangler   (or use `npx wrangler`)
     2. wrangler secret put STRIPE_SECRET_KEY      # your sk_live_… / sk_test_…
     3. Set vars in wrangler.toml (ALLOWED_ORIGIN, SUCCESS_URL, CANCEL_URL)
     4. wrangler deploy
     5. Paste the deployed URL into WOS_CONFIG.checkoutEndpoint (products.js)

   ⚠️  Keep CATALOG prices in sync with assets/js/products.js. This file is the
       authority for money; products.js is for display only.
   ========================================================================== */

/* --- Server-side catalog (CENTS). Mirror of products.js pricing. ---------- */
const CATALOG = {
  "wf-angelwings": { name: "Angel Wing Worship Flags (Pair)", price: 8900,
    opts: { Size: { 'Large 40"': 1500 }, Rod: { "No Rod": -1200 },
            Color: { "Royal Purple": 0, "Rose": 0, "Gold": 0, "Sapphire": 0 } } },
  "wf-shalom": { name: "Jehovah Shalom Silk Flag", price: 4200,
    opts: { Size: { 'Medium 36"': 800, 'Large 40"': 1600 }, Style: { "Pair": 3200 } } },
  "wf-lion": { name: "Lion of Judah Praise Flag", price: 4800,
    opts: { Size: { 'Large 40"': 1000 }, Rod: { "No Rod": -1000 } } },
  "wf-chiffon": { name: "Billowing Chiffon Wing Set", price: 7600,
    opts: { Length: { '54"': 1400 }, Color: {} } },
  "wf-quill": { name: "Living Water Quill Flag", price: 5400,
    opts: { Size: { 'Large 40"': 1000 } } },
  "wf-banner": { name: "Handheld Praise Banner", price: 6500,
    opts: { Theme: {}, Backing: { "Reinforced": 900 } } },
  "wf-rod": { name: "Flexible Flag Rod (Pair)", price: 1800, opts: { Length: {} } },
  "wf-starter": { name: "Worshipper's Starter Set", price: 11900, opts: { "Color Family": {} } }
};

const FREE_SHIP_OVER = 7500;   // $75.00
const FLAT_SHIP = 695;         // $6.95

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}
const json = (obj, status, origin) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...cors(origin) } });

function amountFor(item) {
  const p = CATALOG[item.id];
  if (!p) return null;
  let amount = p.price;
  const opts = item.options || {};
  for (const [name, val] of Object.entries(opts)) {
    const group = p.opts && p.opts[name];
    if (group && typeof group[val] === "number") amount += group[val];
  }
  return { name: p.name, amount: Math.max(0, amount), options: opts };
}

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || request.headers.get("Origin") || "*";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);
    if (!env.STRIPE_SECRET_KEY) return json({ error: "Stripe not configured" }, 500, origin);

    let body;
    try { body = await request.json(); } catch { return json({ error: "Bad JSON" }, 400, origin); }
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) return json({ error: "Empty cart" }, 400, origin);

    // Build validated line items + subtotal
    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("phone_number_collection[enabled]", "true");
    params.set("billing_address_collection", "auto");
    params.set("shipping_address_collection[allowed_countries][0]", "US");
    params.set("shipping_address_collection[allowed_countries][1]", "CA");
    params.set("shipping_address_collection[allowed_countries][2]", "GB");
    params.set("shipping_address_collection[allowed_countries][3]", "AU");

    let subtotal = 0, li = 0;
    for (const item of items) {
      const priced = amountFor(item);
      if (!priced) return json({ error: "Unknown item: " + item.id }, 400, origin);
      const qty = Math.max(1, Math.min(99, parseInt(item.qty) || 1));
      subtotal += priced.amount * qty;
      const desc = Object.values(priced.options || {}).join(" · ");
      params.set(`line_items[${li}][price_data][currency]`, body.currency || "usd");
      params.set(`line_items[${li}][price_data][unit_amount]`, String(priced.amount));
      params.set(`line_items[${li}][price_data][product_data][name]`, priced.name);
      if (desc) params.set(`line_items[${li}][price_data][product_data][description]`, desc);
      params.set(`line_items[${li}][quantity]`, String(qty));
      li++;
    }

    // Shipping option (free over threshold)
    const ship = subtotal >= FREE_SHIP_OVER ? 0 : FLAT_SHIP;
    params.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
    params.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(ship));
    params.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", body.currency || "usd");
    params.set("shipping_options[0][shipping_rate_data][display_name]", ship === 0 ? "Free shipping" : "Standard shipping");
    params.set("shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]", "business_day");
    params.set("shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]", "3");
    params.set("shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]", "business_day");
    params.set("shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]", "7");

    // Optional Stripe Tax (enable in Stripe dashboard, then set STRIPE_TAX=on)
    if (env.STRIPE_TAX === "on") params.set("automatic_tax[enabled]", "true");

    const success = env.SUCCESS_URL || (origin !== "*" ? origin + "/success.html" : "https://example.com/success.html");
    const cancel = env.CANCEL_URL || (origin !== "*" ? origin + "/cancel.html" : "https://example.com/cancel.html");
    params.set("success_url", success + "?session_id={CHECKOUT_SESSION_ID}");
    params.set("cancel_url", cancel);

    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.STRIPE_SECRET_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
    const data = await resp.json();
    if (!resp.ok) return json({ error: (data.error && data.error.message) || "Stripe error" }, 502, origin);
    return json({ url: data.url, id: data.id }, 200, origin);
  }
};
