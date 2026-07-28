/* ============================================================================
   WINGS OF SHALOM — products.js
   The 4 real worship-flag designs. PRICES ARE PLACEHOLDERS ($ in cents) — the
   source files had no prices, so update `price` when you set them. For now the
   Worship Flags page runs in ORDER / INQUIRY mode (no live payment).
   ========================================================================== */
window.WOS_CONFIG = {
  currency: "usd",
  mode: "inquiry",                 // "inquiry" (email order) or "stripe" (live)
  checkoutEndpoint: "",            // paste Stripe worker URL to enable live payment
  orderEmail: "wingsofshalom@gmail.com",
  freeShipOver: 7500, flatShip: 695, taxNote: true
};

window.WOS_PRODUCTS = [
  {
    id: "arise-and-shine", sku: "WF-ARISE", category: "Worship Flags",
    name: "Arise and Shine", subtitle: "Shimmering Worship Flags Collection",
    price: 0, placeholderPrice: true, image: "assets/img/photos/studio-orange.jpg",
    scripture: "“Arise, shine, for your light has come, and the glory of the LORD rises upon you.” — Isaiah 60:1",
    description: "Shimmering silk worship flags that catch the light as you worship. [price to be confirmed]"
  },
  {
    id: "river-of-life", sku: "WF-RIVER", category: "Worship Flags",
    name: "River of Life", subtitle: "Gradient Silk Worship Flags",
    price: 0, placeholderPrice: true, image: "assets/img/photos/aerial-colorful.jpg",
    scripture: "“Then the angel showed me the river of the water of life, as clear as crystal, flowing from the throne of God…” — Revelation 22:1-2",
    description: "Flowing gradient silk flags in colours that move like living water. [price to be confirmed]"
  },
  {
    id: "first-love", sku: "WF-FIRST", category: "Worship Flags",
    name: "First Love", subtitle: "Single-Layer Silk Petal Worship Flags",
    price: 0, placeholderPrice: true, image: "assets/img/photos/outdoor-pink-flags.jpg",
    scripture: "“Place me like a seal over your heart, like a seal on your arm…” — Song of Songs 8:6",
    description: "Light single-layer silk petal flags — tender and expressive in worship. [price to be confirmed]"
  },
  {
    id: "wings-of-shalom", sku: "WF-WINGS", category: "Worship Flags",
    name: "Wings of Shalom", subtitle: "Double-Layer Silk Wing Worship Flags",
    price: 0, placeholderPrice: true, image: "assets/img/photos/group-blue-wings.jpg",
    scripture: "“He will cover you with his feathers, and under his wings you will find refuge…” — Psalm 91:4",
    description: "Our signature double-layer silk wing flags — full, billowing, and glorious. [price to be confirmed]"
  }
];
