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
  // Footer "Translate this site" → jump to the header widget and pulse it.
  $$("[data-open-language]").forEach(b => b.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" });
    const pill = $(".gt-wrap");
    if (pill) { pill.animate(
      [{ boxShadow: "0 0 0 0 rgba(124,58,237,.5)" }, { boxShadow: "0 0 0 10px rgba(124,58,237,0)" }],
      { duration: 900, iterations: 2 }); }
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

  /* ---- Premium: trailing cursor glow -------------------------------------- */
  if (!RM && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    let tx = innerWidth / 2, ty = innerHeight / 2, gx = tx, gy = ty, shown = false;
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { glow.style.opacity = ".9"; shown = true; }
    }, { passive: true });
    window.addEventListener("pointerover", (e) => {
      glow.classList.toggle("big", !!e.target.closest("a,button,.card,.product,.stat-card,.opt,.chip"));
    });
    window.addEventListener("mouseleave", () => { glow.style.opacity = "0"; shown = false; });
    const loop = () => { gx += (tx - gx) * 0.2; gy += (ty - gy) * 0.2;
      glow.style.left = gx + "px"; glow.style.top = gy + "px"; requestAnimationFrame(loop); };
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
