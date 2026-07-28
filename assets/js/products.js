/* ============================================================================
   WINGS OF SHALOM — products.js   (PLACEHOLDER CATALOG)
   ----------------------------------------------------------------------------
   ⚠️  Everything here is placeholder data to demonstrate the storefront.
       Replace names / prices / images / options with the REAL products from
       your "Web Site Design" folder. Prices are in CENTS (e.g. 4200 = $42.00).
       `sku` must stay unique — the Stripe worker recomputes price from SKU,
       so the same SKU list must exist in /worker/checkout.js.
   ========================================================================== */
window.WOS_CONFIG = {
  currency: "usd",
  freeShipOver: 7500,     // free shipping at/over $75.00
  flatShip: 695,          // else $6.95 flat (Stripe can override with live rates)
  taxNote: true,
  checkoutEndpoint: "",   // ← paste your deployed Stripe worker URL here to go live
  orderEmail: "orders@wingsofshalom.org"
};

window.WOS_PRODUCTS = [
  {
    id: "wf-angelwings", sku: "WF-ANGEL", category: "Wing Flags",
    name: "Angel Wing Worship Flags (Pair)", price: 8900, compareAt: 9900, rating: 5,
    image: "assets/img/flag-1.svg", badge: "Bestseller", badgeClass: "gold",
    description: "Flowing silk angel-wing flags for prophetic praise and worship dance. Sold as a matched pair. [placeholder copy]",
    ships: "Ships in 3–5 business days",
    options: [
      { name: "Size", values: [{ label: "Standard 36\"", add: 0 }, { label: "Large 40\"", add: 1500 }] },
      { name: "Rod", values: ["Flexible Rod", { label: "No Rod", add: -1200 }] },
      { name: "Color", values: [
        { label: "Royal Purple", swatch: "#6d28d9" }, { label: "Rose", swatch: "#e0559b" },
        { label: "Gold", swatch: "#e0a92e" }, { label: "Sapphire", swatch: "#3fd0c9" }] }
    ]
  },
  {
    id: "wf-shalom", sku: "WF-SHALOM", category: "Worship Flags",
    name: "Jehovah Shalom Silk Flag", price: 4200, rating: 5,
    image: "assets/img/flag-3.svg", badge: "New",
    description: "Hand-finished silk worship flag proclaiming Jehovah Shalom — the Lord our peace. [placeholder copy]",
    options: [
      { name: "Size", values: [{ label: "Small 30\"", add: 0 }, { label: "Medium 36\"", add: 800 }, { label: "Large 40\"", add: 1600 }] },
      { name: "Style", values: ["Single", { label: "Pair", add: 3200 }] }
    ]
  },
  {
    id: "wf-lion", sku: "WF-LION", category: "Worship Flags",
    name: "Lion of Judah Praise Flag", price: 4800, rating: 4.5,
    image: "assets/img/flag-4.svg",
    description: "Bold prophetic flag carrying the Lion of Judah. Vibrant, lightweight, easy to flow. [placeholder copy]",
    options: [
      { name: "Size", values: [{ label: "Medium 36\"", add: 0 }, { label: "Large 40\"", add: 1000 }] },
      { name: "Rod", values: ["Flexible Rod", { label: "No Rod", add: -1000 }] }
    ]
  },
  {
    id: "wf-chiffon", sku: "WF-CHIFFON", category: "Wing Flags",
    name: "Billowing Chiffon Wing Set", price: 7600, rating: 5,
    image: "assets/img/flag-2.svg", badge: "Popular",
    description: "Extra-long chiffon wings that billow and trail beautifully in the dance. Sold as a pair. [placeholder copy]",
    options: [
      { name: "Length", values: [{ label: "45\"", add: 0 }, { label: "54\"", add: 1400 }] },
      { name: "Color", values: [
        { label: "Amethyst", swatch: "#7c3aed" }, { label: "Blush", swatch: "#f472b6" },
        { label: "Ivory Gold", swatch: "#f0c45a" }] }
    ]
  },
  {
    id: "wf-quill", sku: "WF-QUILL", category: "Worship Flags",
    name: "Living Water Quill Flag", price: 5400, rating: 4.5,
    image: "assets/img/flag-5.svg",
    description: "Teal-and-violet quill flag with a graceful sweep — a favourite for flowing worship. [placeholder copy]",
    options: [{ name: "Size", values: [{ label: "Medium 36\"", add: 0 }, { label: "Large 40\"", add: 1000 }] }]
  },
  {
    id: "wf-banner", sku: "WF-BANNER", category: "Banners",
    name: "Handheld Praise Banner", price: 6500, rating: 5,
    image: "assets/img/banner-1.svg", badge: "Handmade",
    description: "Structured handheld banner for corporate worship and processionals. [placeholder copy]",
    options: [
      { name: "Theme", values: ["Shalom / Peace", "Lion of Judah", "Fire & Glory", "Custom"] },
      { name: "Backing", values: ["Standard", { label: "Reinforced", add: 900 }] }
    ]
  },
  {
    id: "wf-rod", sku: "WF-ROD", category: "Rods & Poles",
    name: "Flexible Flag Rod (Pair)", price: 1800, rating: 5,
    image: "assets/img/flag-6.svg",
    description: "Lightweight flexible telescoping rods, sold as a pair. Fits most Wings of Shalom flags. [placeholder copy]",
    options: [{ name: "Length", values: ["30\"", "36\"", "40\""] }]
  },
  {
    id: "wf-starter", sku: "WF-STARTER", category: "Sets",
    name: "Worshipper's Starter Set", price: 11900, compareAt: 14500, rating: 5,
    image: "assets/img/flag-1.svg", badge: "Save $26", badgeClass: "gold",
    description: "A pair of silk flags, flexible rods, and a carry sleeve — everything to begin flagging. [placeholder copy]",
    options: [{ name: "Color Family", values: [
      { label: "Purple & Gold", swatch: "#6d28d9" }, { label: "Rose & Ivory", swatch: "#e0559b" },
      { label: "Fire", swatch: "#e0a92e" }] }]
  }
];
