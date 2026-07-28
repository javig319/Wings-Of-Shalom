# Wings of Shalom — Website

A modern redesign of **wingsofshalom.org** — a Christian flag-dancing ministry
with a full **worship-flags storefront**. Static, fast, self-contained
(no runtime CDNs), purple-anchored, with tasteful modern motion.

> **Status:** working prototype. The visual design, effects, Google Translate
> widget, and the store/checkout are complete. Text and imagery marked
> `[placeholder]` are waiting for the real content from the
> *"Wings of Shalom – Web Site Design"* folder + the current live site.

## What's here

| Path | What it is |
|------|------------|
| `index.html` | Home page |
| `flag-dancing.html` | Christian Flag Dancing (extra motion/effects) |
| `worship-flags.html` | **Storefront** — product grid, quick-view, cart |
| `checkout.html` · `success.html` · `cancel.html` | Checkout flow |
| `about · gallery · events · contact · give .html` | Supporting pages |
| `assets/css/theme.css` | Whole design system (colors, type, components, effects) |
| `assets/js/main.js` | Nav, scroll-reveal, 3D tilt, magnetic buttons, parallax, hero flag-canvas, Google Translate |
| `assets/js/store.js` | Cart (localStorage), quick-view, drawer, Stripe checkout |
| `assets/js/products.js` | **Product catalog + shop config** (edit me) |
| `assets/js/components.js` | Shared header + footer (edit nav once) |
| `assets/fonts/` | Self-hosted fonts (Cormorant, Manrope, Playfair) |
| `assets/img/` | Placeholder imagery (swap for real photos) |
| `worker/` | Cloudflare Worker for secure Stripe checkout (+ its README) |
| `_source/` | Drop your original design files/photos/videos here |

## Run it locally
It's plain static files — just serve the folder:
```bash
python3 -m http.server 8080      # then open http://localhost:8080
```
(Google Translate needs internet; everything else works offline.)

## Swapping in your real content
1. **Text:** open each `.html` and replace anything marked `[placeholder]`.
2. **Images/videos:** put real files in `assets/img/` and update the `src="…"`
   attributes. For videos, paste your YouTube/Vimeo embed into `flag-dancing.html`
   (there's a commented `<iframe>` ready to uncomment).
3. **Products:** edit `assets/js/products.js` — names, prices (in **cents**),
   images, options. Mirror any price change in `worker/checkout.js`.
4. **Nav / footer:** edit once in `assets/js/components.js`.
5. **Brand colors:** all live at the top of `assets/css/theme.css` (`:root`).
   Purple stays the main color; accents are tunable.

## Turning on payments (Stripe)
See **`worker/README.md`**. In short: deploy the worker with your Stripe secret
key, then paste the worker URL into `WOS_CONFIG.checkoutEndpoint` in
`products.js`. Until then, checkout falls back to an email order.

## Hosting (GitHub Pages)
This repo includes `.github/workflows/pages.yml`. In the repo:
**Settings → Pages → Build and deployment → Source: GitHub Actions.**
Every push to `main` then deploys to
`https://<user>.github.io/wings-of-shalom/`.
(A `.nojekyll` file is included so nothing is stripped.)

## Accessibility & performance
- Respects `prefers-reduced-motion` (all animation stops).
- Self-hosted fonts, no blocking CDNs, GPU-friendly transforms.
- Semantic HTML, keyboard-focusable controls, labelled forms.
