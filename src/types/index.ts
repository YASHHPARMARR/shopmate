// src/types/index.ts — Core Data Contracts & Models

export type PlatformId = 'blinkit' | 'zepto' | 'instamart' | 'jiomart';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  tagline: string;
  color: string;
  accentBg: string;
  baseDeliveryFee: number;
  freeDeliveryThreshold: number;
  platformFee: number;
  smallCartThreshold: number;
  smallCartFee: number;
  defaultEtaMinutes: number;
  promo: {
    type: 'flat' | 'percent';
    amount?: number;
    percent?: number;
    cap?: number;
    minSubtotal: number;
    label: string;
  };
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  variant: string;
  size: number;
  unit: string;
  category: 'dairy' | 'beverages' | 'snacks' | 'staples' | 'instant';
  emoji: string;
  image: string;
  keywords: string[];
  mrp: number;
  isLive?: boolean;
}

export interface PlatformOffer {
  price: number;
  inStock: boolean;
  etaMinutes: number;
  stockCount?: number;
  matchConfidence: number; // e.g. 98 for exact match
  matchType: 'EXACT MATCH' | 'SIMILAR' | 'NOT COMPARABLE';
}

export type ProductOffers = Record<PlatformId, PlatformOffer>;

export interface BasketItem {
  productId: string;
  quantity: number;
}

export interface PlatformItemDetail {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  inStock: boolean;
}

export interface PlatformBasketResult {
  platformId: PlatformId;
  platformName: string;
  itemsSubtotal: number;
  discount: number;
  discountLabel: string;
  deliveryFee: number;
  platformFee: number;
  smallCartFee: number;
  effectiveTotal: number;
  etaMinutes: number;
  inStockCount: number;
  totalRequestedProducts: number;
  allAvailable: boolean;
  missingItems: Array<{ productId: string; name: string }>;
  itemDetails: PlatformItemDetail[];
  rank?: number;
  isWinner?: boolean;
  savingsVsMax?: number;
}

export type ComparisonMode = 'cheapest' | 'fastest' | 'bestValue';

export interface SplitSubOrder {
  platformId: PlatformId;
  platformName: string;
  items: PlatformItemDetail[];
  itemsSubtotal: number;
  deliveryFee: number;
  platformFee: number;
  total: number;
}

export interface SplitResult {
  isRecommended: boolean;
  orders: SplitSubOrder[];
  combinedTotal: number;
  bestSingleStoreTotal: number;
  netSavings: number;
  tradeoffText: string;
  explanation: string;
}

export interface ComparisonSummary {
  results: Record<PlatformId, PlatformBasketResult>;
  ranked: Record<ComparisonMode, PlatformBasketResult[]>;
  recommended: PlatformBasketResult;
  recommendationExplanation: string;
  splitResult: SplitResult;
  totalUnits: number;
  uniqueCount: number;
  dataStatus: 'DEMO DATA' | 'LIVE' | 'ESTIMATED';
  timestamp: string;
}

export interface SavedBasket {
  id: string;
  title: string;
  itemCount: number;
  items: BasketItem[];
  lastComparedDate: string;
  lastBestPlatform: string;
  lastBestPrice: number;
  estimatedSaving: number;
}

export interface ComparisonHistoryEntry {
  id: string;
  date: string;
  basketTitle: string;
  itemCount: number;
  bestPlatform: string;
  bestTotal: number;
  savingsAmount: number;
}

export interface PriceAlert {
  id: string;
  productId: string;
  targetPrice: number;
  currentLowestPrice: number;
  createdDate: string;
  active: boolean;
}

export interface UserPreferences {
  preferredBrands: string[];
  preferredPackSizes: string[];
  maxEta: number;
  minimumSplitSavings: number;
  singleStorePreference: boolean;
}

export interface LocationInfo {
  city: string;
  pincode: string;
  label: string;
  lat: number;
  lon: number;
}
