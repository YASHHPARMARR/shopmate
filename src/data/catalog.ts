import type { Product, ProductOffers } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-coke',
    brand: 'Coca-Cola',
    name: 'Diet Coke Can',
    variant: 'Zero Sugar',
    size: 300,
    unit: 'ml',
    category: 'beverages',
    emoji: '🥤',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
    keywords: ['coke', 'diet', 'cola', 'soda', 'can', 'cold drink'],
    mrp: 50
  },
  {
    id: 'p-milk',
    brand: 'Amul',
    name: 'Taaza Milk',
    variant: 'Homogenised Toned',
    size: 500,
    unit: 'ml',
    category: 'dairy',
    emoji: '🥛',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    keywords: ['milk', 'amul', 'taaza', 'toned', 'dairy', 'doodh'],
    mrp: 32
  },
  {
    id: 'p-lays',
    brand: "Lay's",
    name: 'Classic Salted',
    variant: 'Potato Chips',
    size: 50,
    unit: 'g',
    category: 'snacks',
    emoji: '🥔',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
    keywords: ['lays', 'chips', 'salted', 'snack', 'crisps'],
    mrp: 20
  },
  {
    id: 'p-atta',
    brand: 'Aashirvaad',
    name: 'Superior MP Atta',
    variant: '100% Whole Wheat',
    size: 5,
    unit: 'kg',
    category: 'staples',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    keywords: ['atta', 'flour', 'wheat', 'roti', 'aashirvaad', 'staple'],
    mrp: 325
  },
  {
    id: 'p-maggi',
    brand: 'Maggi',
    name: '2-Minute Noodles',
    variant: 'Masala',
    size: 70,
    unit: 'g',
    category: 'instant',
    emoji: '🍜',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    keywords: ['maggi', 'noodles', 'instant', 'masala', 'snack'],
    mrp: 15
  },
  {
    id: 'p-eggs',
    brand: 'Country',
    name: 'Brown Eggs',
    variant: 'Farm Fresh',
    size: 6,
    unit: 'pcs',
    category: 'dairy',
    emoji: '🥚',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80',
    keywords: ['eggs', 'brown', 'protein', 'fresh', 'farm'],
    mrp: 75
  },
  {
    id: 'p-bread',
    brand: 'Britannia',
    name: 'Whole Wheat Bread',
    variant: '100% Atta',
    size: 400,
    unit: 'g',
    category: 'staples',
    emoji: '🍞',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    keywords: ['bread', 'wheat', 'brown', 'toast', 'bakery'],
    mrp: 50
  },
  {
    id: 'p-paneer',
    brand: 'Amul',
    name: 'Fresh Malai Paneer',
    variant: 'Rich Block',
    size: 200,
    unit: 'g',
    category: 'dairy',
    emoji: '🧀',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80',
    keywords: ['paneer', 'cheese', 'cottage', 'amul', 'malai'],
    mrp: 95
  },
  {
    id: 'p-tea',
    brand: 'Tata Tea',
    name: 'Gold Leaf Tea',
    variant: 'Gently Rolled',
    size: 250,
    unit: 'g',
    category: 'beverages',
    emoji: '🍵',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
    keywords: ['tea', 'chai', 'tata', 'gold', 'beverage'],
    mrp: 160
  },
  {
    id: 'p-rice',
    brand: 'India Gate',
    name: 'Basmati Rice',
    variant: 'Tibar Aged',
    size: 1,
    unit: 'kg',
    category: 'staples',
    emoji: '🍚',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    keywords: ['rice', 'basmati', 'grain', 'chawal'],
    mrp: 125
  },
  {
    id: 'p-biscuit',
    brand: 'Parle-G',
    name: 'Original Gluco Biscuits',
    variant: 'Family Pack',
    size: 250,
    unit: 'g',
    category: 'snacks',
    emoji: '🍪',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80',
    keywords: ['parle', 'biscuit', 'gluco', 'cookie', 'tea snack'],
    mrp: 30
  },
  {
    id: 'p-butter',
    brand: 'Amul',
    name: 'Pasteurised Butter',
    variant: 'Salted',
    size: 100,
    unit: 'g',
    category: 'dairy',
    emoji: '🧈',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80',
    keywords: ['butter', 'amul', 'salted', 'dairy', 'makkhan'],
    mrp: 60
  }
];

export const INITIAL_OFFERS: Record<string, ProductOffers> = {
  'p-coke': {
    blinkit:   { price: 50, inStock: true,  etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' },
    zepto:     { price: 45, inStock: true,  etaMinutes: 8,  matchConfidence: 98, matchType: 'EXACT MATCH' },
    instamart: { price: 40, inStock: true,  etaMinutes: 12, matchConfidence: 98, matchType: 'EXACT MATCH' },
    jiomart:   { price: 44, inStock: true,  etaMinutes: 18, matchConfidence: 98, matchType: 'EXACT MATCH' }
  },
  'p-milk': {
    blinkit:   { price: 31, inStock: true,  etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' },
    zepto:     { price: 30, inStock: true,  etaMinutes: 8,  matchConfidence: 98, matchType: 'EXACT MATCH' },
    instamart: { price: 32, inStock: true,  etaMinutes: 12, matchConfidence: 98, matchType: 'EXACT MATCH' },
    jiomart:   { price: 31, inStock: true,  etaMinutes: 18, matchConfidence: 98, matchType: 'EXACT MATCH' }
  },
  'p-lays': {
    blinkit:   { price: 20, inStock: true,  etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' },
    zepto:     { price: 19, inStock: true,  etaMinutes: 8,  matchConfidence: 98, matchType: 'EXACT MATCH' },
    instamart: { price: 20, inStock: true,  etaMinutes: 12, matchConfidence: 98, matchType: 'EXACT MATCH' },
    jiomart:   { price: 21, inStock: true,  etaMinutes: 18, matchConfidence: 98, matchType: 'EXACT MATCH' }
  },
  'p-atta': {
    blinkit:   { price: 299, inStock: true,  etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' },
    zepto:     { price: 305, inStock: true,  etaMinutes: 8,  matchConfidence: 98, matchType: 'EXACT MATCH' },
    instamart: { price: 289, inStock: true,  etaMinutes: 12, matchConfidence: 98, matchType: 'EXACT MATCH' },
    jiomart:   { price: 295, inStock: true,  etaMinutes: 18, matchConfidence: 98, matchType: 'EXACT MATCH' }
  },
  'p-maggi': {
    blinkit:   { price: 15, inStock: true,  etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' },
    zepto:     { price: 15, inStock: true,  etaMinutes: 8,  matchConfidence: 98, matchType: 'EXACT MATCH' },
    instamart: { price: 14, inStock: true,  etaMinutes: 12, matchConfidence: 98, matchType: 'EXACT MATCH' },
    jiomart:   { price: 15, inStock: true,  etaMinutes: 18, matchConfidence: 98, matchType: 'EXACT MATCH' }
  },
  'p-eggs': {
    blinkit:   { price: 62, inStock: true,  etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' },
    zepto:     { price: 68, inStock: true,  etaMinutes: 8,  matchConfidence: 98, matchType: 'EXACT MATCH' },
    instamart: { price: 64, inStock: true,  etaMinutes: 12, matchConfidence: 98, matchType: 'EXACT MATCH' },
    jiomart:   { price: 60, inStock: false, etaMinutes: 18, matchConfidence: 95, matchType: 'SIMILAR' }
  },
  'p-bread': {
    blinkit:   { price: 45, inStock: true,  etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' },
    zepto:     { price: 42, inStock: true,  etaMinutes: 8,  matchConfidence: 98, matchType: 'EXACT MATCH' },
    instamart: { price: 44, inStock: true,  etaMinutes: 12, matchConfidence: 98, matchType: 'EXACT MATCH' },
    jiomart:   { price: 45, inStock: true,  etaMinutes: 18, matchConfidence: 98, matchType: 'EXACT MATCH' }
  },
  'p-paneer': {
    blinkit:   { price: 90, inStock: true,  etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' },
    zepto:     { price: 85, inStock: true,  etaMinutes: 8,  matchConfidence: 98, matchType: 'EXACT MATCH' },
    instamart: { price: 88, inStock: true,  etaMinutes: 12, matchConfidence: 98, matchType: 'EXACT MATCH' },
    jiomart:   { price: 89, inStock: true,  etaMinutes: 18, matchConfidence: 98, matchType: 'EXACT MATCH' }
  },
  'p-tea': {
    blinkit:   { price: 145, inStock: true, etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' },
    zepto:     { price: 150, inStock: true, etaMinutes: 8,  matchConfidence: 98, matchType: 'EXACT MATCH' },
    instamart: { price: 140, inStock: true, etaMinutes: 12, matchConfidence: 98, matchType: 'EXACT MATCH' },
    jiomart:   { price: 142, inStock: true, etaMinutes: 18, matchConfidence: 98, matchType: 'EXACT MATCH' }
  },
  'p-rice': {
    blinkit:   { price: 110, inStock: true, etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' },
    zepto:     { price: 115, inStock: true, etaMinutes: 8,  matchConfidence: 98, matchType: 'EXACT MATCH' },
    instamart: { price: 108, inStock: true, etaMinutes: 12, matchConfidence: 98, matchType: 'EXACT MATCH' },
    jiomart:   { price: 105, inStock: true, etaMinutes: 18, matchConfidence: 98, matchType: 'EXACT MATCH' }
  },
  'p-biscuit': {
    blinkit:   { price: 25, inStock: true,  etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' },
    zepto:     { price: 24, inStock: true,  etaMinutes: 8,  matchConfidence: 98, matchType: 'EXACT MATCH' },
    instamart: { price: 26, inStock: true,  etaMinutes: 12, matchConfidence: 98, matchType: 'EXACT MATCH' },
    jiomart:   { price: 24, inStock: true,  etaMinutes: 18, matchConfidence: 98, matchType: 'EXACT MATCH' }
  },
  'p-butter': {
    blinkit:   { price: 56, inStock: true,  etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' },
    zepto:     { price: 58, inStock: true,  etaMinutes: 8,  matchConfidence: 98, matchType: 'EXACT MATCH' },
    instamart: { price: 55, inStock: true,  etaMinutes: 12, matchConfidence: 98, matchType: 'EXACT MATCH' },
    jiomart:   { price: 54, inStock: true,  etaMinutes: 18, matchConfidence: 98, matchType: 'EXACT MATCH' }
  }
};

export const DEFAULT_BASKET_ITEMS = [
  { productId: 'p-milk', quantity: 2 },
  { productId: 'p-bread', quantity: 1 },
  { productId: 'p-coke', quantity: 2 },
  { productId: 'p-maggi', quantity: 4 },
  { productId: 'p-lays', quantity: 2 }
];

export const SAVED_PRESETS = [
  {
    id: 'preset-weekly',
    title: '01 / WEEKLY GROCERIES',
    itemCount: 12,
    items: [
      { productId: 'p-milk', quantity: 4 },
      { productId: 'p-atta', quantity: 1 },
      { productId: 'p-eggs', quantity: 2 },
      { productId: 'p-bread', quantity: 2 },
      { productId: 'p-butter', quantity: 1 },
      { productId: 'p-maggi', quantity: 4 }
    ],
    lastComparedDate: '2 days ago',
    lastBestPlatform: 'Blinkit',
    lastBestPrice: 598,
    estimatedSaving: 74
  },
  {
    id: 'preset-monthly',
    title: '02 / MONTHLY ESSENTIALS',
    itemCount: 18,
    items: [
      { productId: 'p-atta', quantity: 2 },
      { productId: 'p-rice', quantity: 3 },
      { productId: 'p-tea', quantity: 2 },
      { productId: 'p-milk', quantity: 6 },
      { productId: 'p-butter', quantity: 2 }
    ],
    lastComparedDate: '5 days ago',
    lastBestPlatform: 'JioMart',
    lastBestPrice: 1420,
    estimatedSaving: 168
  },
  {
    id: 'preset-hostel',
    title: '03 / HOSTEL SNACKS',
    itemCount: 9,
    items: [
      { productId: 'p-coke', quantity: 4 },
      { productId: 'p-maggi', quantity: 6 },
      { productId: 'p-lays', quantity: 3 },
      { productId: 'p-biscuit', quantity: 2 }
    ],
    lastComparedDate: 'Yesterday',
    lastBestPlatform: 'Zepto',
    lastBestPrice: 380,
    estimatedSaving: 42
  }
];

export const DEMO_HISTORY = [
  {
    id: 'hist-1',
    date: 'Sep 30, 2026',
    basketTitle: 'Weekly Groceries',
    itemCount: 12,
    bestPlatform: 'Blinkit',
    bestTotal: 612,
    savingsAmount: 74
  },
  {
    id: 'hist-2',
    date: 'Sep 24, 2026',
    basketTitle: 'Late Night Movie Snacks',
    itemCount: 8,
    bestPlatform: 'Zepto',
    bestTotal: 295,
    savingsAmount: 38
  },
  {
    id: 'hist-3',
    date: 'Sep 18, 2026',
    basketTitle: 'Monthly Pantry Refill',
    itemCount: 15,
    bestPlatform: 'Instamart',
    bestTotal: 1180,
    savingsAmount: 142
  }
];

export const DEMO_ALERTS = [
  {
    id: 'alt-1',
    productId: 'p-coke',
    targetPrice: 38,
    currentLowestPrice: 40,
    createdDate: 'Oct 01, 2026',
    active: true
  },
  {
    id: 'alt-2',
    productId: 'p-milk',
    targetPrice: 28,
    currentLowestPrice: 30,
    createdDate: 'Sep 28, 2026',
    active: true
  },
  {
    id: 'alt-3',
    productId: 'p-atta',
    targetPrice: 280,
    currentLowestPrice: 289,
    createdDate: 'Sep 25, 2026',
    active: true
  }
];
