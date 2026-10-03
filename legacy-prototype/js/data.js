// js/data.js — Product catalog, platform rules, demo data
// All prices are ILLUSTRATIVE DEMO DATA in ₹

export const PRODUCTS = [
  {
    id: 'p1', brand: 'Amul', name: 'Taaza Milk', variant: 'Toned',
    size: 500, unit: 'ml', category: 'dairy',
    emoji: '🥛', color: '#60a5fa',
    keywords: ['milk', 'amul', 'taaza', 'toned', 'dairy']
  },
  {
    id: 'p2', brand: 'Diet Coke', name: 'Can', variant: 'Zero Sugar',
    size: 300, unit: 'ml', category: 'beverages',
    emoji: '🥤', color: '#ef4444',
    keywords: ['coke', 'diet', 'cola', 'soda', 'drink', 'beverage', 'can']
  },
  {
    id: 'p3', brand: 'Maggi', name: '2-Minute Noodles', variant: 'Masala',
    size: 70, unit: 'g', category: 'instant',
    emoji: '🍜', color: '#f59e0b',
    keywords: ['maggi', 'noodles', 'instant', 'masala', '2-minute', '2 min']
  },
  {
    id: 'p4', brand: "Lay's", name: 'Classic Salted', variant: 'Chips',
    size: 50, unit: 'g', category: 'snacks',
    emoji: '🥔', color: '#22c55e',
    keywords: ['lays', 'chips', 'salted', 'classic', 'snack', 'potato']
  },
  {
    id: 'p5', brand: 'Aashirvaad', name: 'Superior MP Atta', variant: 'Whole Wheat',
    size: 5, unit: 'kg', category: 'staples',
    emoji: '🌾', color: '#d97706',
    keywords: ['atta', 'flour', 'wheat', 'aashirvaad', 'staple', 'roti']
  },
  {
    id: 'p6', brand: 'Country', name: 'Brown Eggs', variant: 'Farm Fresh',
    size: 6, unit: 'pcs', category: 'dairy',
    emoji: '🥚', color: '#fb923c',
    keywords: ['eggs', 'brown', 'country', 'farm', 'fresh', 'dairy']
  },
  {
    id: 'p7', brand: 'Britannia', name: 'Whole Wheat Bread', variant: '100%',
    size: 400, unit: 'g', category: 'staples',
    emoji: '🍞', color: '#a78bfa',
    keywords: ['bread', 'britannia', 'wheat', 'whole', 'brown']
  },
  {
    id: 'p8', brand: 'Amul', name: 'Fresh Paneer', variant: 'Block',
    size: 200, unit: 'g', category: 'dairy',
    emoji: '🧀', color: '#fbbf24',
    keywords: ['paneer', 'amul', 'fresh', 'cottage', 'cheese', 'dairy']
  },
  {
    id: 'p9', brand: 'Tata Tea', name: 'Gold', variant: 'Leaf Tea',
    size: 250, unit: 'g', category: 'beverages',
    emoji: '🍵', color: '#84cc16',
    keywords: ['tea', 'tata', 'gold', 'leaf', 'chai', 'beverage']
  },
  {
    id: 'p10', brand: 'India Gate', name: 'Basmati Rice', variant: 'Tibar',
    size: 1, unit: 'kg', category: 'staples',
    emoji: '🍚', color: '#e2e8f0',
    keywords: ['rice', 'basmati', 'india gate', 'tibar', 'grain', 'staple']
  },
  {
    id: 'p11', brand: 'Parle-G', name: 'Original Gluco Biscuits', variant: 'Classic',
    size: 250, unit: 'g', category: 'snacks',
    emoji: '🍪', color: '#fcd34d',
    keywords: ['parle', 'biscuit', 'gluco', 'snack', 'cookie']
  },
  {
    id: 'p12', brand: 'Amul', name: 'Pasteurised Butter', variant: 'Salted',
    size: 100, unit: 'g', category: 'dairy',
    emoji: '🧈', color: '#fde68a',
    keywords: ['butter', 'amul', 'salted', 'dairy']
  }
];

// Per-unit prices in ₹ — ILLUSTRATIVE DEMO DATA
export const OFFERS = {
  p1:  { blinkit: { price: 31,  inStock: true },  zepto: { price: 32,  inStock: true },  instamart: { price: 30,  inStock: true } },
  p2:  { blinkit: { price: 40,  inStock: true },  zepto: { price: 45,  inStock: true },  instamart: { price: 50,  inStock: true } },
  p3:  { blinkit: { price: 14,  inStock: true },  zepto: { price: 14,  inStock: true },  instamart: { price: 15,  inStock: true } },
  p4:  { blinkit: { price: 20,  inStock: true },  zepto: { price: 19,  inStock: true },  instamart: { price: 20,  inStock: true } },
  p5:  { blinkit: { price: 289, inStock: true },  zepto: { price: 305, inStock: true },  instamart: { price: 295, inStock: true } },
  p6:  { blinkit: { price: 60,  inStock: true },  zepto: { price: 68,  inStock: true },  instamart: { price: 64,  inStock: false } },
  p7:  { blinkit: { price: 45,  inStock: true },  zepto: { price: 42,  inStock: true },  instamart: { price: 44,  inStock: true } },
  p8:  { blinkit: { price: 90,  inStock: true },  zepto: { price: 85,  inStock: true },  instamart: { price: 88,  inStock: true } },
  p9:  { blinkit: { price: 145, inStock: true },  zepto: { price: 150, inStock: true },  instamart: { price: 140, inStock: true } },
  p10: { blinkit: { price: 110, inStock: true },  zepto: { price: 115, inStock: true },  instamart: { price: 108, inStock: true } },
  p11: { blinkit: { price: 25,  inStock: true },  zepto: { price: 24,  inStock: true },  instamart: { price: 26,  inStock: true } },
  p12: { blinkit: { price: 56,  inStock: true },  zepto: { price: 58,  inStock: true },  instamart: { price: 55,  inStock: true } }
};

export const PLATFORMS = {
  blinkit: {
    id: 'blinkit',
    name: 'Blinkit',
    color: '#f59e0b',
    colorLight: '#fef3c7',
    eta: 10,
    deliveryFee: 15,
    freeDeliveryThreshold: 399,
    platformFee: 5,
    promo: { type: 'flat', amount: 10, minSubtotal: 150, label: '₹10 off on ₹150+' }
  },
  zepto: {
    id: 'zepto',
    name: 'Zepto',
    color: '#9333ea',
    colorLight: '#f3e8ff',
    eta: 8,
    deliveryFee: 10,
    freeDeliveryThreshold: 499,
    platformFee: 8,
    promo: { type: 'percent', percent: 5, cap: 15, minSubtotal: 200, label: '5% off (max ₹15) on ₹200+' }
  },
  instamart: {
    id: 'instamart',
    name: 'Instamart',
    color: '#f97316',
    colorLight: '#fff7ed',
    eta: 12,
    deliveryFee: 25,
    freeDeliveryThreshold: 499,
    platformFee: 10,
    promo: { type: 'flat', amount: 20, minSubtotal: 250, label: '₹20 off on ₹250+' }
  }
};

// Default basket: p2 ×2, p1 ×1, p3 ×3, p4 ×2 (4 products, 8 units)
export const DEFAULT_BASKET = [
  { productId: 'p2', quantity: 2 },
  { productId: 'p1', quantity: 1 },
  { productId: 'p3', quantity: 3 },
  { productId: 'p4', quantity: 2 }
];

export const CATEGORIES = [
  { id: 'all',       label: 'All' },
  { id: 'dairy',     label: 'Dairy & Eggs' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'snacks',    label: 'Snacks' },
  { id: 'staples',   label: 'Staples' },
  { id: 'instant',   label: 'Instant Food' }
];

export const ROUTINE_PRESETS = [
  {
    id: 'weekly',
    name: 'Weekly Groceries',
    items: [
      { productId: 'p1', quantity: 4 },
      { productId: 'p5', quantity: 1 },
      { productId: 'p6', quantity: 2 },
      { productId: 'p7', quantity: 2 },
      { productId: 'p12', quantity: 1 },
      { productId: 'p3', quantity: 4 }
    ]
  },
  {
    id: 'monthly',
    name: 'Monthly Essentials',
    items: [
      { productId: 'p5', quantity: 2 },
      { productId: 'p10', quantity: 3 },
      { productId: 'p9', quantity: 2 },
      { productId: 'p1', quantity: 6 },
      { productId: 'p12', quantity: 2 },
      { productId: 'p6', quantity: 3 }
    ]
  },
  {
    id: 'hostel',
    name: 'Hostel Snacks',
    items: [
      { productId: 'p2', quantity: 4 },
      { productId: 'p3', quantity: 6 },
      { productId: 'p4', quantity: 3 },
      { productId: 'p11', quantity: 2 }
    ]
  }
];

// Illustrative price history (last 7 days) — DEMO DATA
export const PRICE_HISTORY = {
  p1: {
    blinkit:   [33, 33, 31, 31, 32, 31, 31],
    zepto:     [34, 32, 32, 33, 32, 32, 32],
    instamart: [30, 30, 31, 30, 30, 30, 30]
  },
  p2: {
    blinkit:   [42, 42, 40, 40, 45, 40, 40],
    zepto:     [47, 47, 45, 45, 45, 45, 45],
    instamart: [50, 48, 50, 52, 50, 50, 50]
  },
  p3: {
    blinkit:   [14, 15, 14, 14, 14, 14, 14],
    zepto:     [14, 14, 15, 14, 14, 14, 14],
    instamart: [15, 15, 15, 16, 15, 15, 15]
  },
  p4: {
    blinkit:   [20, 20, 22, 20, 20, 20, 20],
    zepto:     [20, 19, 19, 20, 19, 19, 19],
    instamart: [20, 22, 20, 20, 20, 20, 20]
  },
  p5: {
    blinkit:   [295, 295, 289, 289, 289, 289, 289],
    zepto:     [310, 308, 305, 305, 305, 305, 305],
    instamart: [299, 295, 295, 295, 295, 295, 295]
  },
  p6: {
    blinkit:   [62, 60, 60, 60, 60, 60, 60],
    zepto:     [70, 68, 68, 68, 68, 68, 68],
    instamart: [66, 66, 64, 64, 64, 64, 64]
  }
};

export const LOCATIONS = [
  { city: 'Ahmedabad', pincode: '380015', label: 'Ahmedabad 380015' },
  { city: 'Mumbai',    pincode: '400001', label: 'Mumbai 400001' },
  { city: 'Bengaluru', pincode: '560001', label: 'Bengaluru 560001' },
  { city: 'Delhi',     pincode: '110001', label: 'Delhi 110001' },
  { city: 'Pune',      pincode: '411001', label: 'Pune 411001' }
];

export const DEFAULT_LOCATION = LOCATIONS[0]; // Ahmedabad 380015

// Match confidence scoring (simplified)
export function getMatchConfidence(product) {
  // In a real system this would compare normalized brand+product+variant+size
  // For demo data, all products are exact matches
  return 98;
}

// Helper: get product by id
export function getProduct(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

// Helper: format product display name
export function productDisplayName(product) {
  return `${product.brand} ${product.name} ${product.size} ${product.unit}`;
}

// Helper: get lowest price across platforms
export function getLowestPrice(productId) {
  const offer = OFFERS[productId];
  if (!offer) return null;
  let min = Infinity;
  let platform = null;
  for (const [pid, o] of Object.entries(offer)) {
    if (o.inStock && o.price < min) {
      min = o.price;
      platform = pid;
    }
  }
  return { price: min, platform };
}

// Helper: get price range across platforms
export function getPriceRange(productId) {
  const offer = OFFERS[productId];
  if (!offer) return null;
  const prices = Object.values(offer).filter(o => o.inStock).map(o => o.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

// Search products
export function searchProducts(query) {
  if (!query || !query.trim()) return PRODUCTS;
  const q = query.toLowerCase().trim();
  return PRODUCTS.filter(p => {
    const text = `${p.brand} ${p.name} ${p.variant} ${p.size}${p.unit} ${p.category} ${p.keywords.join(' ')}`.toLowerCase();
    return text.includes(q);
  });
}

// Filter products by category
export function filterByCategory(categoryId) {
  if (categoryId === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === categoryId);
}

// Register or update dynamic/live product in catalog and offers
export function registerProduct(product, offers, history = null) {
  const existingIdx = PRODUCTS.findIndex(p => p.id === product.id);
  if (existingIdx >= 0) {
    PRODUCTS[existingIdx] = { ...PRODUCTS[existingIdx], ...product };
  } else {
    // Place at front so live search items appear at top
    PRODUCTS.unshift(product);
  }

  if (offers) {
    OFFERS[product.id] = { ...(OFFERS[product.id] || {}), ...offers };
  }

  if (history) {
    PRICE_HISTORY[product.id] = history;
  } else if (!PRICE_HISTORY[product.id] && offers) {
    PRICE_HISTORY[product.id] = {
      blinkit: Array(7).fill(offers.blinkit?.price || 30).map((v, i) => v + (i % 2 === 0 ? 0 : 1)),
      zepto: Array(7).fill(offers.zepto?.price || 30).map((v, i) => v + (i % 3 === 0 ? -1 : 0)),
      instamart: Array(7).fill(offers.instamart?.price || 30)
    };
  }
  return product;
}
