/* ============================================================================
   WINGS OF SHALOM — components.js
   Shared header + footer (matches the live site: 7 pages, wine nav, real logo).
   Edit nav/footer ONCE here.
   ========================================================================== */
(function () {
  "use strict";

  const NAV = [
    { label: "Home", href: "index.html" },
    { label: "About Us", href: "about.html" },
    { label: "Programs", href: "programs.html" },
    { label: "Testimonies", href: "testimonies.html" },
    { label: "Our Team", href: "our-team.html" },
    { label: "Worship Flags", href: "worship-flags.html" },
    { label: "Contact Us", href: "contact.html" }
  ];
  const YT = "https://youtube.com/channel/UC98ZPEoElNtVEr2OM-H6AbQ";
  const LANGS = [
    { code: "en", label: "English" },
    { code: "zh-CN", label: "简体中文" },
    { code: "zh-TW", label: "繁體中文" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "ko", label: "한국어" },
    { code: "ja", label: "日本語" },
    { code: "pt", label: "Português" }
  ];
  const chev = `<svg class="gt-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M6 9l6 6 6-6"/></svg>`;
  const langMenu = `<div class="lang-menu" role="menu">${LANGS.map(l => `<button type="button" role="menuitem" data-lang="${l.code}">${l.label}</button>`).join("")}</div>`;

  const globeSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/></svg>`;
  const cartSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 6h15l-1.6 9.5a2 2 0 0 1-2 1.7H9.6a2 2 0 0 1-2-1.6L6 6 5 3H2"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/></svg>`;
  const fbSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l.5-3H13V9c0-1 .3-1.6 1.8-1.6H16V4.8C15.6 4.7 14.6 4.6 13.5 4.6 11 4.6 9.4 6 9.4 8.6V11H7v3h2.4v8z"/></svg>`;
  const ytSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.7 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.3-3.8.3-3.8s0-2.6-.3-3.8ZM10 15V9l5.2 3z"/></svg>`;

  const header = `
  <header class="nav" id="nav">
    <div class="nav-inner">
      <a class="brand" href="index.html" aria-label="Wings of Shalom home">
        <img class="logo-img" src="assets/img/logo.png" alt="Wings of Shalom — 平安的翅膀 旗舞敬拜">
      </a>
      <nav class="nav-links" id="nav-links" aria-label="Primary">
        ${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join("")}
        <div class="lang-mobile only-mobile">
          <span class="lm-label">🌐 Language</span>
          <div class="lm-row">${LANGS.map(l => `<button type="button" data-lang="${l.code}">${l.label}</button>`).join("")}</div>
        </div>
      </nav>
      <div class="nav-actions">
        <div class="gt-wrap hide-mobile">
          <button type="button" class="gt-pill" data-lang-toggle aria-haspopup="true" aria-expanded="false">${globeSVG}<span>Language</span>${chev}</button>
          ${langMenu}
          <div id="google_translate_element" aria-hidden="true"></div>
        </div>
        <button class="cart-btn sound-btn" data-sound-toggle aria-label="Play or mute background hymns" title="Background hymns"></button>
        <button class="cart-btn" data-open-cart aria-label="Open order list">${cartSVG}<span class="cart-count">0</span></button>
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
          <img src="assets/img/logo.png" alt="Wings of Shalom" style="height:96px;width:auto;margin-bottom:1rem">
          <p style="color:#f3d9e6;max-width:36ch">Equipping believers to worship God through flags, movement, and heartfelt praise. <em>Worship · Prayer · Transformation.</em></p>
          <div class="socials" style="margin-top:1.1rem">
            <a href="#" aria-label="Facebook">${fbSVG}</a>
            <a href="${YT}" target="_blank" rel="noopener" aria-label="YouTube">${ytSVG}</a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <div class="fnav">${NAV.map(n => `<a href="${n.href}">${n.label}</a>`).join("")}</div>
        </div>
        <div>
          <h4>Contact</h4>
          <div class="fnav">
            <a href="tel:+15103207580">📞 (510) 320-7580</a>
            <a href="mailto:wingsofshalom@gmail.com">✉️ wingsofshalom@gmail.com</a>
            <a href="${YT}" target="_blank" rel="noopener">▶ YouTube Channel</a>
          </div>
        </div>
        <div>
          <h4>Translate</h4>
          <p style="color:#f3d9e6">Read this site in your language.</p>
          <button class="gt-pill" data-open-language style="cursor:pointer;background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.2);color:#fbe9f1">${globeSVG}<span>Select language</span></button>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span data-year>${year}</span> Wings of Shalom · A 501(c)(3) Nonprofit Organization</span>
        <span style="display:flex;gap:1.2rem"><a href="contact.html">Contact</a><a href="worship-flags.html">Worship Flags</a></span>
      </div>
    </div>
  </footer>`;

  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;
})();
