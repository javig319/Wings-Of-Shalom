/* Build-time generator for the simpler static pages (About, Gallery, Events,
   Contact, Give). Produces plain static HTML — the shipped site needs NO build
   step. Run:  node scripts/gen-pages.js   (from the project root)         */
const fs = require("fs");
const path = require("path");
const OUT = path.resolve(__dirname, "..");

const page = ({ slug, title, desc, eyebrow, heading, intro, body }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — Wings of Shalom</title>
  <meta name="description" content="${desc}">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preload" as="font" type="font/woff2" href="assets/fonts/cormorant-600.woff2" crossorigin>
  <link rel="stylesheet" href="assets/css/theme.css">
  <script defer src="assets/js/products.js"></script>
  <script defer src="assets/js/components.js"></script>
  <script defer src="assets/js/store.js"></script>
  <script defer src="assets/js/main.js"></script>
</head>
<body>
<div id="site-header"></div>
<main>
  <section class="band royal" style="padding:10rem 0 3.5rem;position:relative;overflow:hidden">
    <div class="aurora" style="opacity:.5"><i></i><i></i><i></i></div>
    <div class="container" style="position:relative;z-index:2">
      <span class="eyebrow" style="color:var(--gold-400)" data-reveal>${eyebrow}</span>
      <h1 data-reveal data-reveal-delay="1" style="color:#fff">${heading}</h1>
      <p class="lead" data-reveal data-reveal-delay="2" style="color:#e9ddfb;max-width:58ch">${intro}</p>
    </div>
  </section>
  ${body}
</main>
<div id="site-footer"></div>
</body>
</html>
`;

const PAGES = [
  {
    slug: "about", title: "About Us", eyebrow: "Our Story",
    heading: "About Wings of Shalom",
    desc: "The story and heart behind Wings of Shalom — worship flags and Christian flag dancing.",
    intro: "A ministry devoted to worship expressed in colour and movement. <em>[placeholder — replace with the real story from your folder.]</em>",
    body: `
  <section class="section">
    <div class="container grid cols-2" style="gap:var(--sp-6);align-items:center">
      <div data-reveal="left">
        <span class="eyebrow">Our Beginning</span>
        <h2>Born out of worship</h2>
        <p class="lead">[Placeholder — the founding story of Wings of Shalom goes here, taken from your
          Web Site Design folder.]</p>
        <p>[Placeholder paragraph about the ministry's journey, calling, and vision.]</p>
      </div>
      <div data-reveal="right" data-tilt="7" class="tilt"><div class="tilt-lift shine-border" style="border-radius:var(--r-xl);overflow:hidden;box-shadow:var(--sh-4)"><img src="assets/img/media-1.svg" alt="[placeholder]" class="obj-cover" style="aspect-ratio:4/3"></div></div>
    </div>
  </section>
  <section class="section band soft">
    <div class="container">
      <div class="section-head center text-center" style="margin-bottom:var(--sp-5)"><span class="eyebrow" style="justify-content:center">What We Value</span><h2>Our Heart &amp; Values</h2></div>
      <div class="grid cols-3">
        <div class="card" data-reveal><div class="pad"><span class="ic feature-ic">✚</span><h3>Christ at the Centre</h3><p>[Placeholder value description.]</p></div></div>
        <div class="card" data-reveal data-reveal-delay="1"><div class="pad"><h3>Excellence in Craft</h3><p>[Placeholder value description.]</p></div></div>
        <div class="card" data-reveal data-reveal-delay="2"><div class="pad"><h3>Worship for All</h3><p>[Placeholder value description.]</p></div></div>
      </div>
    </div>
  </section>
  <section class="section band royal" style="text-align:center"><div class="narrow"><h2 data-reveal>Come worship with us</h2><p class="lead" data-reveal data-reveal-delay="1" style="color:#e9ddfb">[placeholder call to action]</p><div class="flex center wrap" data-reveal data-reveal-delay="2" style="margin-top:1.2rem"><a class="btn lg gold" href="worship-flags.html">Shop Flags</a><a class="btn lg ghost" href="contact.html">Get in Touch</a></div></div></section>`
  },
  {
    slug: "flag-dancing-alt", title: "unused", eyebrow: "", heading: "", desc: "", intro: "", body: ""
  },
  {
    slug: "gallery", title: "Gallery", eyebrow: "Media",
    heading: "Gallery",
    desc: "Photos and videos of Wings of Shalom worship flags and flag dancing.",
    intro: "Moments of worship in colour and motion. <em>[placeholder — your photos &amp; videos from the folder / live site will fill this grid.]</em>",
    body: `
  <section class="section">
    <div class="container">
      <div class="shop-toolbar" id="gallery-filters"></div>
      <div class="grid cols-3" id="gallery-grid">
        ${Array.from({ length: 9 }).map((_, i) => `
        <figure class="card" data-reveal data-reveal-delay="${(i % 3) + 1}" style="margin:0">
          <div class="shine-border" style="position:relative;aspect-ratio:4/5;overflow:hidden">
            <img src="assets/img/flag-${(i % 6) + 1}.svg" alt="[placeholder ${i + 1}]" class="obj-cover" loading="lazy">
          </div>
        </figure>`).join("")}
      </div>
      <p class="text-center small" style="color:var(--text-faint);margin-top:var(--sp-4)">[Replace these with your real photos &amp; embedded videos.]</p>
    </div>
  </section>`
  },
  {
    slug: "events", title: "Events", eyebrow: "Gather",
    heading: "Events &amp; Workshops",
    desc: "Upcoming worship nights, flag-dancing workshops, and conferences with Wings of Shalom.",
    intro: "Come learn, flow, and worship together. <em>[placeholder — real events from your folder.]</em>",
    body: `
  <section class="section">
    <div class="container" style="max-width:820px">
      ${["Worship &amp; Flags Workshop", "Prophetic Praise Night", "Flag-Dancing Intensive", "Conference Ministry"].map((t, i) => `
      <article class="card" data-reveal data-reveal-delay="${(i % 3) + 1}" style="margin-bottom:1.1rem">
        <div class="pad flex between wrap" style="gap:1rem">
          <div class="flex" style="gap:1.1rem">
            <div style="flex:0 0 auto;width:64px;height:64px;border-radius:14px;display:grid;place-items:center;background:var(--lilac-100);color:var(--brand-600);font-family:var(--font-display);line-height:1;text-align:center">
              <div><strong style="font-size:1.4rem">00</strong><br><span style="font-size:.7rem;letter-spacing:.1em">MON</span></div>
            </div>
            <div><h3 style="margin:0">${t}</h3><p class="small" style="color:var(--text-faint);margin:.2rem 0 0">[Date · Time · Location — placeholder]</p></div>
          </div>
          <a class="btn sm" href="contact.html">Register</a>
        </div>
      </article>`).join("")}
      <p class="text-center small" style="color:var(--text-faint);margin-top:var(--sp-3)">[Replace with your real event calendar.]</p>
    </div>
  </section>`
  },
  {
    slug: "contact", title: "Contact", eyebrow: "Say Hello",
    heading: "Contact Us",
    desc: "Get in touch with Wings of Shalom — questions, custom flags, bookings, and prayer.",
    intro: "Questions, custom orders, bookings, or prayer — we'd love to hear from you. <em>[placeholder]</em>",
    body: `
  <section class="section">
    <div class="container grid cols-2" style="gap:var(--sp-6);align-items:start">
      <div class="card" data-reveal="left"><div class="pad">
        <h3>Send a message</h3>
        <form onsubmit="WOS.toast('Thanks! (Wire this form to your email service.)');return false">
          <div class="row-2"><div class="field"><label>First name</label><input class="input" required></div><div class="field"><label>Last name</label><input class="input"></div></div>
          <div class="field"><label>Email</label><input class="input" type="email" required></div>
          <div class="field"><label>Subject</label><input class="input"></div>
          <div class="field"><label>Message</label><textarea class="textarea" required></textarea></div>
          <button class="btn block lg" type="submit">Send message</button>
          <p class="small" style="color:var(--text-faint);margin-top:.6rem">[Connect to Formspree / your email service — placeholder handler.]</p>
        </form>
      </div></div>
      <div data-reveal="right">
        <div class="card" style="margin-bottom:1.1rem"><div class="pad flex" style="gap:1rem"><span class="ic feature-ic" style="width:48px;height:48px;border-radius:12px;display:grid;place-items:center;background:var(--lilac-100);color:var(--brand-600)">✉</span><div><strong>Email</strong><br><a href="mailto:hello@wingsofshalom.org">hello@wingsofshalom.org</a> <span class="small" style="color:var(--text-faint)">[placeholder]</span></div></div></div>
        <div class="card" style="margin-bottom:1.1rem"><div class="pad flex" style="gap:1rem"><span class="ic feature-ic" style="width:48px;height:48px;border-radius:12px;display:grid;place-items:center;background:var(--lilac-100);color:var(--brand-600)">☎</span><div><strong>Phone</strong><br>[+1 000 000 0000 — placeholder]</div></div></div>
        <div class="card" style="margin-bottom:1.1rem"><div class="pad flex" style="gap:1rem"><span class="ic feature-ic" style="width:48px;height:48px;border-radius:12px;display:grid;place-items:center;background:var(--lilac-100);color:var(--brand-600)">📍</span><div><strong>Location</strong><br>[City, Country — placeholder]</div></div></div>
        <div class="card"><div class="pad"><strong>Follow along</strong><div class="socials" style="margin-top:.7rem">
          <a href="#" aria-label="Facebook" style="background:var(--lilac-100);color:var(--brand-600)">f</a>
          <a href="#" aria-label="Instagram" style="background:var(--lilac-100);color:var(--brand-600)">◎</a>
          <a href="#" aria-label="YouTube" style="background:var(--lilac-100);color:var(--brand-600)">▶</a>
        </div></div></div>
      </div>
    </div>
  </section>`
  },
  {
    slug: "give", title: "Give", eyebrow: "Partner With Us",
    heading: "Give a Gift",
    desc: "Support the ministry of Wings of Shalom — help send flags and teaching around the world.",
    intro: "Your generosity sends worship flags and teaching to churches and worshippers worldwide. <em>[placeholder]</em>",
    body: `
  <section class="section">
    <div class="container">
      <div class="grid cols-3">
        ${[["$25", "Blesses a worshipper with a flag"], ["$75", "Equips a small dance team"], ["$150", "Sends flags to a church abroad"]].map((t, i) => `
        <div class="card tilt" data-tilt="6" data-reveal data-reveal-delay="${i + 1}"><div class="pad tilt-lift text-center">
          <div class="display" style="font-size:2.6rem" class="grad-text">${t[0]}</div>
          <p style="color:var(--text-soft)">${t[1]}</p>
          <a class="btn block" href="#" data-magnetic="0.2">Give ${t[0]}</a>
        </div></div>`).join("")}
      </div>
      <div class="card" style="margin-top:var(--sp-4)"><div class="pad text-center">
        <h3>Give another amount</h3>
        <p style="color:var(--text-soft)">[Connect this to Stripe / your giving platform — placeholder.]</p>
        <div class="newsletter center" style="max-width:420px;margin:1rem auto 0">
          <input class="input" placeholder="$ Amount" inputmode="decimal">
          <a class="btn gold" href="#">Give ♥</a>
        </div>
      </div></div>
    </div>
  </section>`
  }
];

let n = 0;
PAGES.forEach(p => {
  if (p.slug === "flag-dancing-alt") return; // handcrafted separately
  fs.writeFileSync(path.join(OUT, p.slug + ".html"), page(p));
  n++;
  console.log("wrote", p.slug + ".html");
});
console.log("Done —", n, "pages generated.");
