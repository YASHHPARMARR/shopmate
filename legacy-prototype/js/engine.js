// js/engine.js — Basket computation, ranking, and split engine
import { PRODUCTS, OFFERS, PLATFORMS, getProduct } from './data.js';

/**
 * Compute basket cost for a single platform.
 * @param {Array<{productId:string, quantity:number}>} basket
 * @param {string} platformId - 'blinkit' | 'zepto' | 'instamart'
 * @returns {Object} { platform, items (subtotal), promo, delivery, platformFee, total, eta, inStockCount, missing[], itemDetails[] }
 */
export function computeForPlatform(basket, platformId) {
  const platform = PLATFORMS[platformId];
  if (!platform) throw new Error(`Unknown platform: ${platformId}`);

  let subtotal = 0;
  let inStockCount = 0;
  let totalUnits = 0;
  const missing = [];
  const itemDetails = [];

  for (const item of basket) {
    if (item.quantity <= 0) continue;
    const offer = OFFERS[item.productId]?.[platformId];
    const product = getProduct(item.productId);
    if (!offer || !offer.inStock) {
      missing.push({
        productId: item.productId,
        name: product ? `${product.brand} ${product.name}` : item.productId
      });
      continue;
    }
    const lineTotal = offer.price * item.quantity;
    subtotal += lineTotal;
    inStockCount++;
    totalUnits += item.quantity;
    itemDetails.push({
      productId: item.productId,
      name: product ? `${product.brand} ${product.name} ${product.size} ${product.unit}` : item.productId,
      unitPrice: offer.price,
      quantity: item.quantity,
      lineTotal
    });
  }

  // Promo calculation
  let promo = 0;
  let promoLabel = '';
  if (subtotal >= platform.promo.minSubtotal) {
    if (platform.promo.type === 'flat') {
      promo = platform.promo.amount;
      promoLabel = `₹${promo} off`;
    } else if (platform.promo.type === 'percent') {
      promo = Math.floor(subtotal * platform.promo.percent / 100);
      if (promo > platform.promo.cap) promo = platform.promo.cap;
      promoLabel = `${platform.promo.percent}% off (₹${promo})`;
    }
  }

  // Delivery fee
  const delivery = subtotal >= platform.freeDeliveryThreshold ? 0 : platform.deliveryFee;
  const deliveryLabel = delivery === 0 ? 'Free' : `₹${delivery}`;

  // Platform fee
  const platformFee = platform.platformFee;

  // Total
  const total = subtotal - promo + delivery + platformFee;

  return {
    platform: platformId,
    platformName: platform.name,
    platformColor: platform.color,
    items: subtotal,
    promo,
    promoLabel,
    delivery,
    deliveryLabel,
    platformFee,
    total,
    eta: platform.eta,
    inStockCount,
    totalProducts: basket.filter(i => i.quantity > 0).length,
    totalUnits,
    missing,
    itemDetails
  };
}

/**
 * Compute basket across all platforms.
 * @param {Array<{productId:string, quantity:number}>} basket
 * @returns {Object} { results: [], ranked: { cheapest, fastest, bestValue } }
 */
export function computeBasket(basket) {
  const platformIds = Object.keys(PLATFORMS);
  const results = platformIds.map(pid => computeForPlatform(basket, pid));
  return {
    results,
    ranked: {
      cheapest: rank(results, 'cheapest'),
      fastest: rank(results, 'fastest'),
      bestValue: rank(results, 'bestValue')
    }
  };
}

/**
 * Rank results by mode.
 * Platforms with missing items rank AFTER complete ones.
 * @param {Array} results - array of computeForPlatform results
 * @param {string} mode - 'cheapest' | 'fastest' | 'bestValue'
 * @returns {Array} sorted copy with .rank and .isWinner fields
 */
export function rank(results, mode) {
  const sorted = [...results].map(r => ({
    ...r,
    hasMissing: r.missing.length > 0,
    // Best value score: total + 2 × ETA
    valueScore: r.total + 2 * r.eta
  }));

  sorted.sort((a, b) => {
    // Missing items rank last
    if (a.hasMissing !== b.hasMissing) return a.hasMissing ? 1 : -1;

    switch (mode) {
      case 'cheapest':
        return a.total - b.total;
      case 'fastest':
        // Primary: lowest ETA, tie-break on total
        if (a.eta !== b.eta) return a.eta - b.eta;
        return a.total - b.total;
      case 'bestValue':
        return a.valueScore - b.valueScore;
      default:
        return a.total - b.total;
    }
  });

  return sorted.map((r, i) => ({
    ...r,
    rank: i + 1,
    isWinner: i === 0
  }));
}

/**
 * Get recommendation explanation text for a winner.
 */
export function getRecommendationReasons(winner, allResults, mode) {
  const reasons = [];
  const allTotals = allResults.map(r => r.total);
  const maxTotal = Math.max(...allTotals);
  const minTotal = Math.min(...allTotals);
  const savings = maxTotal - winner.total;
  const allETAs = allResults.map(r => r.eta);
  const minETA = Math.min(...allETAs);

  if (mode === 'cheapest') {
    reasons.push('Lowest complete-basket cost');
  } else if (mode === 'fastest') {
    reasons.push(`Fastest delivery (${winner.eta} min)`);
  } else {
    reasons.push('Best balance of price and speed');
  }

  if (winner.missing.length === 0) {
    reasons.push('All products available');
  }

  if (mode === 'cheapest' && winner.eta !== minETA) {
    reasons.push(`Only ${winner.eta - minETA} min slower than fastest`);
  }

  if (mode === 'fastest' && winner.total !== minTotal) {
    reasons.push(`₹${winner.total - minTotal} more than cheapest`);
  }

  if (savings > 0 && mode !== 'fastest') {
    reasons.push(`Save ₹${savings} vs the most expensive option`);
  }

  return reasons;
}

/**
 * Get comparison explanation for a mode.
 */
export function getModeExplanation(winner, allResults, mode) {
  const allTotals = allResults.map(r => r.total);
  const maxTotal = Math.max(...allTotals);
  const minTotal = Math.min(...allTotals);
  const savings = maxTotal - winner.total;
  const minETA = Math.min(...allResults.map(r => r.eta));

  switch (mode) {
    case 'cheapest':
      return `${winner.platformName} offers the lowest total at ₹${winner.total}. ${savings > 0 ? `Save ₹${savings} compared to the most expensive option.` : ''}`;
    case 'fastest':
      return `${winner.platformName} delivers in ${winner.eta} minutes.${winner.total > minTotal ? ` ₹${winner.total - minTotal} more than cheapest, but ${minETA === winner.eta ? 'the fastest option' : `${winner.eta} min faster`}.` : ''}`;
    case 'bestValue':
      return `${winner.platformName} provides the best balance of price (₹${winner.total}) and speed (${winner.eta} min).`;
    default:
      return '';
  }
}

/**
 * Brute-force split engine.
 * Tries every pair of platforms and every assignment of products.
 * @param {Array<{productId:string, quantity:number}>} basket
 * @param {number} threshold - minimum savings to recommend split (default ₹15)
 * @returns {Object|null} { platform1, platform2, basket1, basket2, result1, result2, splitTotal, bestSingleTotal, savings, worthIt }
 */
export function computeSplit(basket, threshold = 15) {
  const activeItems = basket.filter(i => i.quantity > 0);
  const n = activeItems.length;

  if (n < 2) return { worthIt: false, savings: 0, bestSingleTotal: 0, splitTotal: 0 };

  const platformIds = Object.keys(PLATFORMS);

  // Best single-store total
  const singleResults = platformIds.map(pid => computeForPlatform(activeItems, pid));
  // Only consider platforms with no missing items for single best
  const completeSingle = singleResults.filter(r => r.missing.length === 0);
  const bestSingle = completeSingle.length > 0
    ? completeSingle.reduce((a, b) => a.total < b.total ? a : b)
    : singleResults.reduce((a, b) => a.total < b.total ? a : b);
  const bestSingleTotal = bestSingle.total;

  let bestSplit = null;
  let bestSplitTotal = Infinity;

  // Try every pair of platforms
  for (let i = 0; i < platformIds.length; i++) {
    for (let j = i + 1; j < platformIds.length; j++) {
      const pid1 = platformIds[i];
      const pid2 = platformIds[j];

      // Try every assignment (bitmask: 0 = pid1, 1 = pid2)
      // Skip mask=0 (all on pid1) and mask=(2^n-1) (all on pid2) — those are single-store
      const totalMasks = 1 << n;
      for (let mask = 1; mask < totalMasks - 1; mask++) {
        const b1 = [];
        const b2 = [];

        for (let k = 0; k < n; k++) {
          if (mask & (1 << k)) {
            b2.push(activeItems[k]);
          } else {
            b1.push(activeItems[k]);
          }
        }

        const r1 = computeForPlatform(b1, pid1);
        const r2 = computeForPlatform(b2, pid2);

        // Skip if any items missing
        if (r1.missing.length > 0 || r2.missing.length > 0) continue;

        const total = r1.total + r2.total;
        if (total < bestSplitTotal) {
          bestSplitTotal = total;
          bestSplit = {
            platform1: pid1,
            platform2: pid2,
            basket1: b1,
            basket2: b2,
            result1: r1,
            result2: r2
          };
        }
      }
    }
  }

  const savings = bestSingleTotal - bestSplitTotal;
  const worthIt = bestSplit !== null && savings >= threshold;

  return {
    worthIt,
    savings: Math.max(0, savings),
    bestSingleTotal,
    splitTotal: bestSplit ? bestSplitTotal : bestSingleTotal,
    bestSinglePlatform: bestSingle.platformName,
    split: bestSplit ? {
      ...bestSplit,
      platform1Name: PLATFORMS[bestSplit.platform1].name,
      platform2Name: PLATFORMS[bestSplit.platform2].name,
      platform1Color: PLATFORMS[bestSplit.platform1].color,
      platform2Color: PLATFORMS[bestSplit.platform2].color
    } : null
  };
}

/**
 * Get basket summary stats.
 */
export function getBasketSummary(basket) {
  let uniqueProducts = 0;
  let totalUnits = 0;
  for (const item of basket) {
    if (item.quantity > 0) {
      uniqueProducts++;
      totalUnits += item.quantity;
    }
  }
  return { uniqueProducts, totalUnits };
}
