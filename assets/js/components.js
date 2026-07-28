/* ============================================================================
   WINGS OF SHALOM — components.js
   Injects the shared header + footer so every page stays in sync.
   Runs synchronously (placed at top of <body>). Header is position:fixed,
   so no layout shift. Edit nav/footer ONCE here.
   ========================================================================== */
(function () {
  "use strict";

  /* Update these to match your final pages / details */
  const NAV = [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Flag Dancing", href: "flag-dancing.html" },
    { label: "Shop Flags", href: "worship-flags.html" },
    { label: "Gallery", href: "gallery.html" },
    { label: "Contact", href: "contact.html" }
  ];
  const BRAND = "Wings of <span>Shalom</span>";

  const markSVG = `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M16 5c-3 4-8 5-12 5 3 3 7 4 12 3M16 5c3 4 8 5 12 5-3 3-7 4-12 3" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 9v18M16 27c-2-1-4-1-6 0M16 27c2-1 4-1 6 0" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>
  </svg>`;
  const globeSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/></svg>`;
  const cartSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 6h15l-1.6 9.5a2 2 0 0 1-2 1.7H9.6a2 2 0 0 1-2-1.6L6 6 5 3H2"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/></svg>`;

  const header = `
  <header class="nav" id="nav">
    <div class="nav-inner">
      <a class="brand" href="index.html" aria-label="Wings of Shalom home">
        <span class="mark">${markSVG}</span><span><b>${BRAND}</b></span>
      </a>
      <nav class="nav-links" id="nav-links" aria-label="Primary">
        ${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join("")}
        <a href="give.html" class="only-mobile" style="color:var(--brand-600);font-weight:700">Give ♥</a>
      </nav>
      <div class="nav-actions">
        <div class="gt-wrap hide-mobile" title="Choose language">
          <span class="gt-pill">${globeSVG}<span>Language</span></span>
          <div id="google_translate_element" aria-label="Select language"></div>
        </div>
        <a class="btn sm gold hide-mobile" href="give.html" data-magnetic="0.25">Give</a>
        <button class="cart-btn" data-open-cart aria-label="Open cart">${cartSVG}<span class="cart-count">0</span></button>
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>`;

  const year = new Date().getFullYear();
  const footer = `
  <footer class="footer" id="footer">
    <div class="container">
      <div class="cols">
        <div>
          <a class="brand" href="index.html" style="color:#fff;margin-bottom:1rem;display:inline-flex">
            <span class="mark">${markSVG}</span><span><b>Wings of <span style="color:var(--gold-400)">Shalom</span></b></span>
          </a>
          <p style="color:#c9bce6;max-width:34ch">Raising a banner of praise — worship flags, banners, and the ministry of Christian flag dancing. <em>[placeholder tagline — replace with your text]</em></p>
          <div class="socials" style="margin-top:1.2rem">
            <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l.5-3H13V9c0-1 .3-1.6 1.8-1.6H16V4.8C15.6 4.7 14.6 4.6 13.5 4.6 11 4.6 9.4 6 9.4 8.6V11H7v3h2.4v8z"/></svg></a>
            <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/></svg></a>
            <a href="#" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.7 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.3-3.8.3-3.8s0-2.6-.3-3.8ZM10 15V9l5.2 3z"/></svg></a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <div class="fnav">
            ${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join("")}
            <a href="events.html">Events</a>
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          <div class="fnav">
            <a href="worship-flags.html">All Worship Flags</a>
            <a href="worship-flags.html">Banners</a>
            <a href="worship-flags.html">Flag Rods & Poles</a>
            <a href="give.html">Give / Donate</a>
            <a href="contact.html">Shipping & Returns</a>
          </div>
        </div>
        <div>
          <h4>Stay Connected</h4>
          <p style="color:#c9bce6">Join our list for new flags, teachings &amp; events.</p>
          <form class="newsletter" onsubmit="return false" style="margin-top:.6rem">
            <input class="input" type="email" placeholder="you@email.com" aria-label="Email" required>
            <button class="btn sm gold" type="submit">Join</button>
          </form>
          <button class="gt-pill" data-open-language style="margin-top:1.1rem;cursor:pointer;background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14);color:#e9e0fb">${globeSVG}<span>Translate this site</span></button>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span data-year>${year}</span> Wings of Shalom. All rights reserved.</span>
        <span style="display:flex;gap:1.2rem"><a href="#">Privacy</a><a href="#">Terms</a><a href="contact.html">Contact</a></span>
      </div>
    </div>
  </footer>`;

  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;
})();
