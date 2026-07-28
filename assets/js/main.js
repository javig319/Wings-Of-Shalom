/* ============================================================================
   WINGS OF SHALOM — main.js
   Global UI + modern-effects engine (no dependencies).
   ========================================================================== */
(function () {
  "use strict";
  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---- Sticky nav state ---------------------------------------------------- */
  const nav = $(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile nav toggle --------------------------------------------------- */
  const toggle = $(".nav-toggle"), links = $(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = toggle.classList.toggle("open");
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$(".nav-links a").forEach(a => a.addEventListener("click", () => {
      toggle.classList.remove("open"); links.classList.remove("open");
      document.body.style.overflow = "";
    }));
  }

  /* ---- Active nav link by filename ---------------------------------------- */
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav-links a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === here || (here === "index.html" && (href === "" || href === "./" || href === "index.html")))
      a.classList.add("active");
  });

  /* ---- Scroll reveal (IntersectionObserver) -------------------------------- */
  const revealEls = $$("[data-reveal]");
  if (revealEls.length) {
    if (RM || !("IntersectionObserver" in window)) {
      revealEls.forEach(el => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach(el => io.observe(el));
    }
  }

  /* ---- 3D tilt on [data-tilt] --------------------------------------------- */
  if (!RM && window.matchMedia("(pointer:fine)").matches) {
    $$("[data-tilt]").forEach(card => {
      const max = parseFloat(card.dataset.tilt) || 8;
      let raf = null;
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty("--ry", (px * max).toFixed(2) + "deg");
          card.style.setProperty("--rx", (-py * max).toFixed(2) + "deg");
        });
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }

  /* ---- Magnetic buttons (all large CTAs float toward the cursor) ---------- */
  if (!RM && window.matchMedia("(pointer:fine)").matches) {
    const magnets = new Set([...$$("[data-magnetic]"), ...$$(".btn.lg")]);
    magnets.forEach(el => {
      const strength = parseFloat(el.dataset.magnetic) || 0.28;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px,${(e.clientY - r.top - r.height / 2) * strength}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---- Parallax on [data-parallax] ---------------------------------------- */
  if (!RM) {
    const par = $$("[data-parallax]");
    if (par.length) {
      let ticking = false;
      const upd = () => {
        const vh = window.innerHeight;
        par.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.15;
          const r = el.getBoundingClientRect();
          const off = (r.top + r.height / 2 - vh / 2) * -speed;
          el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`;
        });
        ticking = false;
      };
      window.addEventListener("scroll", () => {
        if (!ticking) { requestAnimationFrame(upd); ticking = true; }
      }, { passive: true });
      upd();
    }
  }

  /* ---- Duplicate marquee content for seamless loop ------------------------ */
  $$(".marquee").forEach(m => {
    const ul = m.querySelector("ul");
    if (ul) m.appendChild(ul.cloneNode(true));
  });

  /* ---- Count-up numbers on reveal ----------------------------------------- */
  $$("[data-count]").forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (RM) { el.textContent = target + suffix; return; }
    const io = new IntersectionObserver((en) => {
      en.forEach(e => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const dur = 1400, t0 = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const val = Math.round(target * (1 - Math.pow(1 - p, 3)));
          el.textContent = val.toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    io.observe(el);
  });

  /* ---- Google Translate init (called by the injected script) --------------- */
  window.googleTranslateElementInit = function () {
    try {
      new google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false,
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
        "google_translate_element");
    } catch (e) { /* offline / blocked — pill stays inert */ }
  };
  // Load Google's widget script once (runs in the visitor's browser).
  if ($("#google_translate_element") && !window._gtLoaded) {
    window._gtLoaded = true;
    const gt = document.createElement("script");
    gt.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    gt.async = true;
    document.head.appendChild(gt);
  }
  /* ---- Themed language menu (drives the hidden Google Translate combo) ----- */
  const langToggle = $("[data-lang-toggle]");
  const langMenu = $(".lang-menu");
  const currentLang = () => { const m = document.cookie.match(/googtrans=\/[^/]*\/([^;]+)/); return m ? decodeURIComponent(m[1]) : "en"; };
  const setActiveLang = (code) => { if (langMenu) langMenu.querySelectorAll("[data-lang]").forEach(b => b.classList.toggle("active", b.dataset.lang === code)); };
  const openLang = (o) => {
    if (!langMenu || !langToggle) return;
    const open = o === undefined ? !langMenu.classList.contains("open") : o;
    langMenu.classList.toggle("open", open);
    langToggle.setAttribute("aria-expanded", open);
  };
  function applyLang(code) {
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {                                   // live: translate instantly, no reload
      combo.value = code;
      combo.dispatchEvent(new Event("change"));
      if (code === "en") document.cookie = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
      return;
    }
    const host = location.hostname;                // fallback: cookie + reload
    document.cookie = "googtrans=/en/" + code + ";path=/";
    if (host) document.cookie = "googtrans=/en/" + code + ";path=/;domain=" + host;
    location.reload();
  }
  if (langToggle && langMenu) {
    setActiveLang(currentLang());
    langToggle.addEventListener("click", (e) => { e.stopPropagation(); openLang(); });
    langMenu.addEventListener("click", (e) => {
      const b = e.target.closest("[data-lang]"); if (!b) return;
      setActiveLang(b.dataset.lang); openLang(false); applyLang(b.dataset.lang);
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".gt-wrap")) openLang(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") openLang(false); });
  }
  // Footer "Select language" → jump up and open the header menu.
  $$("[data-open-language]").forEach(b => b.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" });
    setTimeout(() => openLang(true), RM ? 0 : 420);
  }));

  /* ---- Flowing worship-flag silk (hero canvas) ---------------------------- */
  const canvas = $(".flag-canvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, ribbons = [], running = true;

    const palette = [
      ["#7c3aed", "#b794f6"], ["#e0559b", "#f472b6"],
      ["#e0a92e", "#f0c45a"], ["#5b21b6", "#9061f0"], ["#3fd0c9", "#7c3aed"]
    ];

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = W < 640 ? 4 : 6;
      ribbons = Array.from({ length: n }, (_, i) => ({
        x: (W / (n + 1)) * (i + 1) + (Math.random() * 40 - 20),
        w: 60 + Math.random() * 70,
        amp: 22 + Math.random() * 34,
        len: 0.55 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.7,
        pal: palette[i % palette.length],
        alpha: 0.16 + Math.random() * 0.12
      }));
    }

    function drawRibbon(r, t) {
      const topY = -40, botY = H * r.len + 60, steps = 22;
      const grad = ctx.createLinearGradient(r.x, topY, r.x, botY);
      grad.addColorStop(0, r.pal[0]); grad.addColorStop(1, r.pal[1]);
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const p = i / steps, y = topY + (botY - topY) * p;
        const sway = Math.sin(t * r.speed + r.phase + p * 3.2) * r.amp * (0.4 + p);
        const x = r.x + sway - r.w / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      for (let i = steps; i >= 0; i--) {
        const p = i / steps, y = topY + (botY - topY) * p;
        const sway = Math.sin(t * r.speed + r.phase + p * 3.2) * r.amp * (0.4 + p);
        const wob = Math.sin(t * r.speed * 1.3 + p * 5) * 8;
        ctx.lineTo(r.x + sway + r.w / 2 + wob, y);
      }
      ctx.closePath();
      ctx.globalAlpha = r.alpha;
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    let start = performance.now();
    function frame(now) {
      if (!running) return;
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "screen";
      ribbons.forEach(r => drawRibbon(r, t));
      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", () => { clearTimeout(canvas._rt); canvas._rt = setTimeout(resize, 180); });
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) { start = performance.now(); requestAnimationFrame(frame); }
    });
    if (RM) { drawRibbon(ribbons[0] || {}, 0); ribbons.forEach(r => drawRibbon(r, 1)); }
    else requestAnimationFrame(frame);
  }

  /* ---- Simple toast (used by store.js too) -------------------------------- */
  window.WOS = window.WOS || {};
  let toastEl = null, toastTimer = null;
  window.WOS.toast = function (msg, ok = true) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = (ok ? '<span class="ok">✓</span>' : "") + "<span>" + msg + "</span>";
    requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  };

  /* ---- Scroll progress bar + nav auto-hide + back-to-top ------------------- */
  const bar = document.createElement("div"); bar.className = "progress-bar"; document.body.appendChild(bar);
  const toTop = document.createElement("button");
  toTop.className = "to-top"; toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }));

  let lastY = window.scrollY, navTick = false;
  function onScrollUI() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    toTop.classList.toggle("show", y > 600);
    if (nav) {
      if (y > 240 && y > lastY + 6) nav.classList.add("nav-hidden");
      else if (y < lastY - 6 || y < 240) nav.classList.remove("nav-hidden");
    }
    lastY = y; navTick = false;
  }
  window.addEventListener("scroll", () => {
    if (!navTick) { requestAnimationFrame(onScrollUI); navTick = true; }
  }, { passive: true });
  onScrollUI();

  /* ---- Hero pointer parallax ---------------------------------------------- */
  if (!RM && window.matchMedia("(pointer:fine)").matches) {
    const hero = $(".hero");
    if (hero) {
      hero.classList.add("parallax-on");
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        hero.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
      hero.addEventListener("pointerleave", () => {
        hero.style.setProperty("--mx", "0"); hero.style.setProperty("--my", "0");
      });
    }
  }

  /* ---- Premium: realistic trailing silk-flag cursor ----------------------- */
  if (!RM && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const cv = document.createElement("canvas");
    cv.className = "flag-cursor";
    document.body.appendChild(cv);
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W, H;
    const resize = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); window.addEventListener("resize", resize);
    const N = 20, SEG = 9, GRAV = 0.55, FRIC = 0.86;      // verlet cloth: gravity + momentum
    let mx = innerWidth / 2, my = innerHeight / 2, active = false, started = false;
    const pts = Array.from({ length: N }, () => ({ x: mx, y: my, px: mx, py: my }));
    window.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; active = true; }, { passive: true });
    document.addEventListener("mouseleave", () => { active = false; });
    function physics() {
      pts[0].x = mx; pts[0].y = my; pts[0].px = mx; pts[0].py = my;      // pin staff to cursor
      for (let i = 1; i < N; i++) { const p = pts[i]; const vx = (p.x - p.px) * FRIC, vy = (p.y - p.py) * FRIC + GRAV; p.px = p.x; p.py = p.y; p.x += vx; p.y += vy; }
      for (let k = 0; k < 7; k++) { for (let i = 1; i < N; i++) { const a = pts[i - 1], b = pts[i]; let dx = b.x - a.x, dy = b.y - a.y; let d = Math.hypot(dx, dy) || 0.001; let diff = (d - SEG) / d; if (i === 1) { b.x -= dx * diff; b.y -= dy * diff; } else { a.x += dx * diff * 0.5; a.y += dy * diff * 0.5; b.x -= dx * diff * 0.5; b.y -= dy * diff * 0.5; } } pts[0].x = mx; pts[0].y = my; }
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      const top = [], bot = [];
      for (let i = 0; i < N; i++) {
        const p = pts[i], q = pts[Math.max(0, i - 1)];
        let dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
        const taper = 1 - i / N, width = 44 * taper + 5, flutter = Math.sin(t * 0.007 - i * 0.55) * 10 * taper;
        top.push(p); bot.push({ x: p.x + nx * (width + flutter), y: p.y + ny * (width + flutter) });
      }
      ctx.beginPath(); ctx.moveTo(top[0].x, top[0].y);
      for (let i = 1; i < N; i++) ctx.lineTo(top[i].x, top[i].y);
      for (let i = N - 1; i >= 0; i--) ctx.lineTo(bot[i].x, bot[i].y);
      ctx.closePath();
      const g = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[N - 1].x, pts[N - 1].y);
      g.addColorStop(0, "#f3c55e"); g.addColorStop(0.4, "#e14a8b"); g.addColorStop(0.75, "#c0308c"); g.addColorStop(1, "#9c335e");
      ctx.save();
      ctx.shadowColor = "rgba(120,25,60,.4)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
      ctx.fillStyle = g; ctx.globalAlpha = 0.85; ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 0.5; ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(top[0].x, top[0].y); for (let i = 1; i < N; i++) ctx.lineTo(top[i].x, top[i].y); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    function loop(t) { if (active) started = true; physics(); if (started) draw(t); requestAnimationFrame(loop); }
    requestAnimationFrame(loop);
  }

  /* ---- Premium: spotlight that follows the cursor across cards ------------- */
  if (!RM) {
    document.addEventListener("pointermove", (e) => {
      const el = e.target.closest(".card,.stat-card,.product,[data-glow]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    }, { passive: true });
  }

  /* ---- Year in footer ------------------------------------------------------ */
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
})();
