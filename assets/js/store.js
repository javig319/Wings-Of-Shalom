/* ============================================================================
   WINGS OF SHALOM — store.js
   Cart + storefront + Stripe checkout wiring.  No dependencies.
   Prices are integer CENTS everywhere. Display via money().
   ----------------------------------------------------------------------------
   Product data source: window.WOS_PRODUCTS  (see assets/js/products.js)
   Config:              window.WOS_CONFIG    (checkoutEndpoint, currency, freeShipOver)
   ========================================================================== */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const CONFIG = Object.assign(
    { checkoutEndpoint: "", currency: "usd", freeShipOver: 7500, flatShip: 695, taxNote: true },
    window.WOS_CONFIG || {}
  );
  const KEY = "wos_cart_v1";
  const PRODUCTS = window.WOS_PRODUCTS || [];
  const byId = id => PRODUCTS.find(p => p.id === id);
  const money = c => "$" + (c / 100).toFixed(2);
  window.WOS = window.WOS || {};

  /* ---- Cart store ---------------------------------------------------------- */
  let cart = load();
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save() { localStorage.setItem(KEY, JSON.stringify(cart)); render(); }
  const variantKey = (id, opts) => id + "|" + Object.entries(opts || {}).sort().map(([k, v]) => k + ":" + v).join(",");

  const Cart = {
    items: () => cart,
    count: () => cart.reduce((n, i) => n + i.qty, 0),
    subtotal: () => cart.reduce((n, i) => n + i.price * i.qty, 0),
    shipping() { const s = this.subtotal(); return s === 0 || s >= CONFIG.freeShipOver ? 0 : CONFIG.flatShip; },
    total() { return this.subtotal() + this.shipping(); },
    add(item) {
      const key = variantKey(item.id, item.options);
      const ex = cart.find(i => i.key === key);
      if (ex) ex.qty += item.qty || 1;
      else cart.push({ key, id: item.id, sku: item.sku, name: item.name, price: item.price,
        image: item.image, options: item.options || {}, qty: item.qty || 1 });
      save(); bump();
    },
    setQty(key, qty) {
      const i = cart.find(x => x.key === key); if (!i) return;
      i.qty = Math.max(1, qty); save();
    },
    remove(key) { cart = cart.filter(i => i.key !== key); save(); },
    clear() { cart = []; save(); }
  };
  WOS.cart = Cart;

  /* ---- Badge + bump animation --------------------------------------------- */
  function bump() {
    const c = $(".cart-count");
    if (c) { c.classList.add("bump"); setTimeout(() => c.classList.remove("bump"), 400); }
  }
  function updateBadge() {
    $$(".cart-count").forEach(c => {
      const n = Cart.count();
      c.textContent = n;
      c.classList.toggle("show", n > 0);
    });
  }

  /* ---- Cart drawer (exists on every page via the shared markup) ------------ */
  function ensureDrawer() {
    if ($("#wos-drawer")) return;
    const scrim = document.createElement("div");
    scrim.className = "drawer-scrim"; scrim.id = "wos-scrim";
    scrim.innerHTML = `
      <aside class="drawer" id="wos-drawer" role="dialog" aria-label="Shopping cart" aria-modal="true">
        <div class="drawer-head">
          <h3>Your Basket</h3>
          <button class="icon-btn" data-close-cart aria-label="Close cart">✕</button>
        </div>
        <div class="drawer-body" id="wos-lines"></div>
        <div class="drawer-foot" id="wos-foot"></div>
      </aside>`;
    document.body.appendChild(scrim);
    scrim.addEventListener("click", e => { if (e.target === scrim) closeCart(); });
    scrim.querySelector("[data-close-cart]").addEventListener("click", closeCart);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });
  }
  function openCart() { ensureDrawer(); render(); const s = $("#wos-scrim"), d = $("#wos-drawer");
    s.classList.add("open"); requestAnimationFrame(() => d.classList.add("open")); document.body.style.overflow = "hidden"; }
  function closeCart() { const s = $("#wos-scrim"), d = $("#wos-drawer");
    if (!s) return; d.classList.remove("open"); s.classList.remove("open"); document.body.style.overflow = ""; }
  WOS.openCart = openCart; WOS.closeCart = closeCart;

  function optLine(opts) {
    const e = Object.entries(opts || {}); return e.length ? e.map(([k, v]) => v).join(" · ") : "";
  }

  function render() {
    updateBadge();
    const lines = $("#wos-lines"), foot = $("#wos-foot");
    if (!lines || !foot) return;
    if (!cart.length) {
      lines.innerHTML = `<div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6h15l-1.5 9h-12z"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M6 6 5 3H2"/></svg>
        <p><strong>Your basket is empty.</strong><br>Add a flag or banner to begin.</p>
        <a class="btn ghost sm" href="worship-flags.html" data-close-cart>Browse the shop</a></div>`;
      foot.innerHTML = "";
      lines.querySelector("[data-close-cart]")?.addEventListener("click", closeCart);
      return;
    }
    lines.innerHTML = cart.map(i => `
      <div class="line">
        <img src="${i.image}" alt="${esc(i.name)}" loading="lazy">
        <div>
          <div class="l-name">${esc(i.name)}</div>
          ${optLine(i.options) ? `<div class="l-opt">${esc(optLine(i.options))}</div>` : ""}
          <div class="qty" data-key="${i.key}">
            <button data-dec aria-label="Decrease">−</button>
            <input type="text" value="${i.qty}" inputmode="numeric" aria-label="Quantity">
            <button data-inc aria-label="Increase">+</button>
          </div>
          <button class="l-remove" data-remove="${i.key}">Remove</button>
        </div>
        <div class="l-price">${money(i.price * i.qty)}</div>
      </div>`).join("");

    const ship = Cart.shipping();
    foot.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${money(Cart.subtotal())}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${ship === 0 ? "FREE" : money(ship)}</span></div>
      ${Cart.subtotal() < CONFIG.freeShipOver ? `<div class="summary-row" style="color:var(--brand-500);font-size:.82rem">
        <span>Add ${money(CONFIG.freeShipOver - Cart.subtotal())} for free shipping</span><span></span></div>` : ""}
      <div class="summary-row total"><span>Total</span><span>${money(Cart.total())}</span></div>
      <a class="btn block lg" href="checkout.html" style="margin-top:1rem">Checkout →</a>
      <button class="btn ghost block sm" data-close-cart style="margin-top:.6rem">Continue shopping</button>`;

    lines.querySelectorAll(".qty").forEach(q => {
      const key = q.dataset.key, input = q.querySelector("input");
      q.querySelector("[data-inc]").onclick = () => Cart.setQty(key, (+input.value || 1) + 1);
      q.querySelector("[data-dec]").onclick = () => Cart.setQty(key, (+input.value || 1) - 1);
      input.onchange = () => Cart.setQty(key, parseInt(input.value) || 1);
    });
    lines.querySelectorAll("[data-remove]").forEach(b => b.onclick = () => Cart.remove(b.dataset.remove));
    foot.querySelector("[data-close-cart]")?.addEventListener("click", closeCart);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  /* ---- Wire cart buttons --------------------------------------------------- */
  $$("[data-open-cart]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openCart(); }));
  ensureDrawer(); updateBadge();

  /* ======================================================================== */
  /*  STOREFRONT PAGE (product grid + quick view)                             */
  /* ======================================================================== */
  const grid = $("#product-grid");
  if (grid && PRODUCTS.length) {
    const chipsWrap = $("#shop-filters");
    const cats = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
    if (chipsWrap) {
      chipsWrap.innerHTML = cats.map((c, i) =>
        `<button class="chip${i === 0 ? " active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
      chipsWrap.querySelectorAll(".chip").forEach(ch => ch.onclick = () => {
        chipsWrap.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
        ch.classList.add("active"); drawGrid(ch.dataset.cat);
      });
    }
    function stars(n) { let s = ""; for (let i = 0; i < 5; i++) s += i < Math.round(n) ? "★" : "☆"; return s; }
    function drawGrid(cat) {
      const list = !cat || cat === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
      grid.innerHTML = list.map((p, i) => `
        <article class="product" data-reveal data-reveal-delay="${(i % 4) + 1}" data-id="${p.id}">
          <div class="media">
            ${p.badge ? `<span class="badge ${p.badgeClass || ""} tag">${esc(p.badge)}</span>` : ""}
            <img src="${p.image}" alt="${esc(p.name)}" loading="lazy">
            <div class="quick"><button class="btn block sm" data-quick="${p.id}">Quick view</button></div>
          </div>
          <div class="info">
            <span class="cat">${esc(p.category)}</span>
            <h3>${esc(p.name)}</h3>
            ${p.rating ? `<div class="stars-row" aria-label="${p.rating} out of 5">${stars(p.rating)}</div>` : ""}
            <div class="price">${money(p.price)} ${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</div>
          </div>
        </article>`).join("");
      grid.querySelectorAll("[data-quick]").forEach(b => b.onclick = () => openQuick(b.dataset.quick));
      grid.querySelectorAll(".product .media img").forEach(img =>
        img.closest(".product").addEventListener("click", e => {
          if (!e.target.closest(".quick")) openQuick(img.closest(".product").dataset.id);
        }));
      // re-run reveal for freshly injected nodes
      grid.querySelectorAll("[data-reveal]").forEach(el => el.classList.add("in"));
    }
    drawGrid("All");
  }

  /* ---- Quick-view modal ---------------------------------------------------- */
  function openQuick(id) {
    const p = byId(id); if (!p) return;
    let scrim = $("#wos-modal");
    if (!scrim) { scrim = document.createElement("div"); scrim.className = "modal-scrim"; scrim.id = "wos-modal";
      document.body.appendChild(scrim);
      scrim.addEventListener("click", e => { if (e.target === scrim) closeQuick(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape") closeQuick(); });
    }
    const sel = {};
    (p.options || []).forEach(o => sel[o.name] = o.values[0].label !== undefined ? o.values[0].label : o.values[0]);

    function optionsHtml() {
      return (p.options || []).map(o => `
        <div class="opt-group" data-opt="${esc(o.name)}">
          <div class="opt-label">${esc(o.name)}${o.name.toLowerCase().includes("color") ? "" : ""}</div>
          <div class="opt-row">
            ${o.values.map(v => {
              const label = typeof v === "string" ? v : v.label;
              const swatch = typeof v === "object" && v.swatch;
              const active = sel[o.name] === label ? " sel" : "";
              return swatch
                ? `<button class="opt swatch${active}" data-val="${esc(label)}" title="${esc(label)}" style="background:${v.swatch}"></button>`
                : `<button class="opt${active}" data-val="${esc(label)}">${esc(label)}${typeof v === "object" && v.add ? ` (+${money(v.add)})` : ""}</button>`;
            }).join("")}
          </div>
        </div>`).join("");
    }
    function priceNow() {
      let extra = 0;
      (p.options || []).forEach(o => { const v = o.values.find(x => (typeof x === "string" ? x : x.label) === sel[o.name]);
        if (v && typeof v === "object" && v.add) extra += v.add; });
      return p.price + extra;
    }
    function paint() {
      scrim.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-label="${esc(p.name)}">
          <div class="m-media"><img src="${p.image}" alt="${esc(p.name)}"></div>
          <div class="m-body">
            <button class="icon-btn" style="position:absolute;top:1rem;right:1rem" data-close-modal aria-label="Close">✕</button>
            <span class="cat" style="color:var(--brand-500);font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:.75rem">${esc(p.category)}</span>
            <h2 style="margin:.3rem 0 .4rem">${esc(p.name)}</h2>
            <div class="price" style="font-size:1.5rem;font-weight:800;color:var(--brand-600)">${money(priceNow())} ${p.compareAt ? `<s style="color:var(--text-faint);font-weight:600;font-size:1rem">${money(p.compareAt)}</s>` : ""}</div>
            <p style="color:var(--text-soft);margin-top:.8rem">${esc(p.description || "")}</p>
            ${optionsHtml()}
            <div class="flex" style="gap:.8rem;margin-top:1.4rem">
              <div class="qty" id="m-qty"><button data-mdec>−</button><input value="1" inputmode="numeric"><button data-minc>+</button></div>
              <button class="btn lg" style="flex:1" data-add>Add to basket</button>
            </div>
            <div class="secure-note">🔒 Secure checkout · ${p.ships || "Ships in 3–5 business days"}</div>
          </div>
        </div>`;
      scrim.querySelector("[data-close-modal]").onclick = closeQuick;
      scrim.querySelectorAll(".opt-group").forEach(g => {
        const name = g.dataset.opt;
        g.querySelectorAll(".opt").forEach(btn => btn.onclick = () => { sel[name] = btn.dataset.val; paint(); });
      });
      const qi = scrim.querySelector("#m-qty input");
      scrim.querySelector("[data-minc]").onclick = () => qi.value = (+qi.value || 1) + 1;
      scrim.querySelector("[data-mdec]").onclick = () => qi.value = Math.max(1, (+qi.value || 1) - 1);
      scrim.querySelector("[data-add]").onclick = () => {
        Cart.add({ id: p.id, sku: skuFor(p, sel), name: p.name, price: priceNow(), image: p.image,
          options: sel, qty: parseInt(qi.value) || 1 });
        closeQuick(); WOS.toast("Added to basket"); openCart();
      };
    }
    paint();
    requestAnimationFrame(() => scrim.classList.add("open"));
    document.body.style.overflow = "hidden";
  }
  function closeQuick() { const s = $("#wos-modal"); if (s) { s.classList.remove("open"); document.body.style.overflow = ""; } }
  function skuFor(p, sel) {
    const suffix = Object.values(sel).map(v => String(v).replace(/[^a-z0-9]+/gi, "").slice(0, 4).toUpperCase()).join("-");
    return (p.sku || p.id) + (suffix ? "-" + suffix : "");
  }
  WOS.skuFor = skuFor;

  /* ======================================================================== */
  /*  CHECKOUT PAGE                                                            */
  /* ======================================================================== */
  const coSummary = $("#checkout-summary");
  if (coSummary) {
    function paintCheckout() {
      if (!cart.length) {
        coSummary.innerHTML = `<div class="cart-empty"><p><strong>Your basket is empty.</strong></p>
          <a class="btn ghost sm" href="worship-flags.html">Browse the shop</a></div>`;
        const pay = $("#pay-btn"); if (pay) pay.disabled = true;
        return;
      }
      coSummary.innerHTML = cart.map(i => `
        <div class="line">
          <img src="${i.image}" alt="${esc(i.name)}">
          <div><div class="l-name">${esc(i.name)}</div>
            ${optLine(i.options) ? `<div class="l-opt">${esc(optLine(i.options))}</div>` : ""}
            <div class="l-opt">Qty ${i.qty}</div></div>
          <div class="l-price">${money(i.price * i.qty)}</div>
        </div>`).join("") + `
        <div style="margin-top:1rem">
          <div class="summary-row"><span>Subtotal</span><span>${money(Cart.subtotal())}</span></div>
          <div class="summary-row"><span>Shipping</span><span>${Cart.shipping() === 0 ? "FREE" : money(Cart.shipping())}</span></div>
          ${CONFIG.taxNote ? `<div class="summary-row"><span>Tax</span><span>Calculated at payment</span></div>` : ""}
          <div class="summary-row total"><span>Total</span><span>${money(Cart.total())}</span></div>
        </div>`;
    }
    paintCheckout();

    const payBtn = $("#pay-btn");
    if (payBtn) payBtn.addEventListener("click", async () => {
      if (!cart.length) return;
      payBtn.disabled = true; const label = payBtn.textContent; payBtn.textContent = "Preparing secure checkout…";
      const payload = {
        items: cart.map(i => ({ sku: i.sku, id: i.id, name: i.name, qty: i.qty, price: i.price, options: i.options })),
        currency: CONFIG.currency
      };
      try {
        if (!CONFIG.checkoutEndpoint) throw new Error("no-endpoint");
        const res = await fetch(CONFIG.checkoutEndpoint, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("bad-response");
        const data = await res.json();
        if (data.url) { window.location.href = data.url; return; }
        throw new Error("no-url");
      } catch (err) {
        payBtn.disabled = false; payBtn.textContent = label;
        // Graceful fallback while Stripe keys aren't wired yet
        WOS.toast("Payment isn’t connected yet — sending your order by email instead.", false);
        const lines = cart.map(i => `• ${i.qty}× ${i.name}${optLine(i.options) ? " (" + optLine(i.options) + ")" : ""} — ${money(i.price * i.qty)}`).join("%0D%0A");
        const body = `I would like to order:%0D%0A${lines}%0D%0A%0D%0ASubtotal: ${money(Cart.subtotal())}%0D%0ATotal (before tax): ${money(Cart.total())}%0D%0A%0D%0AName:%0D%0AShipping address:%0D%0APhone:`;
        window.location.href = `mailto:${(window.WOS_CONFIG && window.WOS_CONFIG.orderEmail) || "orders@wingsofshalom.org"}?subject=Worship%20Flags%20Order&body=${body}`;
      }
    });
  }

  render();
})();
