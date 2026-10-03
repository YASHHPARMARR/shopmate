// src/services/engine.ts — True Cost Calculation, Multi-Platform Ranking & Smart Split Engine
import type {
  BasketItem,
  ComparisonMode,
  ComparisonSummary,
  PlatformBasketResult,
  PlatformId,
  PlatformItemDetail,
  Product,
  ProductOffers,
  SplitResult,
  SplitSubOrder,
  UserPreferences
} from '../types';
import { PLATFORMS } from '../data/platforms';

/**
 * Compute true cost for a single platform with full transparency.
 */
export function computeForPlatform(
  basket: BasketItem[],
  platformId: PlatformId,
  products: Product[],
  offers: Record<string, ProductOffers>
): PlatformBasketResult {
  const config = PLATFORMS[platformId];
  if (!config) throw new Error(`Unknown platform: ${platformId}`);

  let itemsSubtotal = 0;
  let inStockCount = 0;
  const missingItems: Array<{ productId: string; name: string }> = [];
  const itemDetails: PlatformItemDetail[] = [];

  const productMap = new Map(products.map(p => [p.id, p]));

  for (const item of basket) {
    if (item.quantity <= 0) continue;
    const p = productMap.get(item.productId);
    const offer = offers[item.productId]?.[platformId];

    if (!offer || !offer.inStock) {
      missingItems.push({
        productId: item.productId,
        name: p ? `${p.brand} ${p.name}` : item.productId
      });
      continue;
    }

    const lineTotal = offer.price * item.quantity;
    itemsSubtotal += lineTotal;
    inStockCount++;

    itemDetails.push({
      productId: item.productId,
      name: p ? `${p.brand} ${p.name} ${p.size}${p.unit}` : item.productId,
      unitPrice: offer.price,
      quantity: item.quantity,
      lineTotal,
      inStock: true
    });
  }

  // 1. Discount / Promo
  let discount = 0;
  let discountLabel = 'None';
  if (itemsSubtotal >= config.promo.minSubtotal) {
    if (config.promo.type === 'flat') {
      discount = config.promo.amount || 0;
      discountLabel = config.promo.label;
    } else if (config.promo.type === 'percent') {
      const raw = Math.floor(itemsSubtotal * ((config.promo.percent || 0) / 100));
      discount = Math.min(raw, config.promo.cap || raw);
      discountLabel = `${config.promo.percent}% off (₹${discount})`;
    }
  }

  // 2. Delivery Fee (Free above threshold)
  const deliveryFee = itemsSubtotal >= config.freeDeliveryThreshold ? 0 : config.baseDeliveryFee;

  // 3. Platform Fee
  const platformFee = itemsSubtotal > 0 ? config.platformFee : 0;

  // 4. Small Cart Fee (if below threshold)
  const smallCartFee = (itemsSubtotal > 0 && itemsSubtotal < config.smallCartThreshold) ? config.smallCartFee : 0;

  // 5. Effective Total (Preserve all components)
  const effectiveTotal = Math.max(0, itemsSubtotal - discount + deliveryFee + platformFee + smallCartFee);

  const activeItemsCount = basket.filter(i => i.quantity > 0).length;

  return {
    platformId,
    platformName: config.name,
    itemsSubtotal,
    discount,
    discountLabel,
    deliveryFee,
    platformFee,
    smallCartFee,
    effectiveTotal,
    etaMinutes: config.defaultEtaMinutes,
    inStockCount,
    totalRequestedProducts: activeItemsCount,
    allAvailable: inStockCount === activeItemsCount && activeItemsCount > 0,
    missingItems,
    itemDetails
  };
}

/**
 * Rank platform results by mode.
 */
export function rankResults(
  results: PlatformBasketResult[],
  mode: ComparisonMode
): PlatformBasketResult[] {
  const sorted = [...results];

  sorted.sort((a, b) => {
    // 1. Complete availability always prioritized over partial baskets
    if (a.allAvailable !== b.allAvailable) {
      return a.allAvailable ? -1 : 1;
    }
    // 2. More in-stock items prioritized
    if (a.inStockCount !== b.inStockCount) {
      return b.inStockCount - a.inStockCount;
    }

    switch (mode) {
      case 'cheapest':
        return a.effectiveTotal - b.effectiveTotal;

      case 'fastest':
        // Lowest ETA, tie-break on total cost
        if (a.etaMinutes !== b.etaMinutes) {
          return a.etaMinutes - b.etaMinutes;
        }
        return a.effectiveTotal - b.effectiveTotal;

      case 'bestValue': {
        // Transparent score: total cost + 2 × ETA minutes
        const scoreA = a.effectiveTotal + 2 * a.etaMinutes;
        const scoreB = b.effectiveTotal + 2 * b.etaMinutes;
        return scoreA - scoreB;
      }

      default:
        return a.effectiveTotal - b.effectiveTotal;
    }
  });

  const maxTotal = Math.max(...results.map(r => r.effectiveTotal));

  return sorted.map((r, i) => ({
    ...r,
    rank: i + 1,
    isWinner: i === 0,
    savingsVsMax: Math.max(0, maxTotal - r.effectiveTotal)
  }));
}

/**
 * Deterministic Smart Basket Split Engine.
 * Tests if distributing items across two separate apps yields true net savings
 * after calculating two separate delivery and platform fees.
 */
export function computeSmartSplit(
  basket: BasketItem[],
  products: Product[],
  offers: Record<string, ProductOffers>,
  minSavingsThreshold: number = 15
): SplitResult {
  const activeItems = basket.filter(i => i.quantity > 0);
  if (activeItems.length < 2) {
    return {
      isRecommended: false,
      orders: [],
      combinedTotal: 0,
      bestSingleStoreTotal: 0,
      netSavings: 0,
      tradeoffText: 'Requires at least 2 items to evaluate split orders',
      explanation: 'Not enough items to test combination'
    };
  }

  // Calculate single store totals
  const platformIds: PlatformId[] = ['blinkit', 'zepto', 'instamart', 'jiomart'];
  const singleResults = platformIds.map(p => computeForPlatform(activeItems, p, products, offers));
  const completeSingles = singleResults.filter(r => r.allAvailable);
  const bestSingle = (completeSingles.length > 0 ? completeSingles : singleResults)
    .reduce((min, r) => r.effectiveTotal < min.effectiveTotal ? r : min, singleResults[0]);

  let bestSplitCombined = Infinity;
  let bestPair: [PlatformId, PlatformId] | null = null;
  let bestPartition: [PlatformItemDetail[], PlatformItemDetail[]] | null = null;

  // Test primary platform pairs (Blinkit + Zepto, Blinkit + Instamart, Zepto + Instamart)
  const pairs: Array<[PlatformId, PlatformId]> = [
    ['blinkit', 'zepto'],
    ['blinkit', 'instamart'],
    ['zepto', 'instamart']
  ];

  for (const [pA, pB] of pairs) {
    const itemsA: PlatformItemDetail[] = [];
    const itemsB: PlatformItemDetail[] = [];
    let possible = true;

    for (const item of activeItems) {
      const offerA = offers[item.productId]?.[pA];
      const offerB = offers[item.productId]?.[pB];
      const p = products.find(prod => prod.id === item.productId);
      const name = p ? `${p.brand} ${p.name}` : item.productId;

      if (!offerA?.inStock && !offerB?.inStock) {
        possible = false;
        break;
      }

      if (offerA?.inStock && (!offerB?.inStock || offerA.price <= offerB.price)) {
        itemsA.push({
          productId: item.productId,
          name,
          unitPrice: offerA.price,
          quantity: item.quantity,
          lineTotal: offerA.price * item.quantity,
          inStock: true
        });
      } else if (offerB?.inStock) {
        itemsB.push({
          productId: item.productId,
          name,
          unitPrice: offerB.price,
          quantity: item.quantity,
          lineTotal: offerB.price * item.quantity,
          inStock: true
        });
      }
    }

    if (!possible || itemsA.length === 0 || itemsB.length === 0) continue;

    // Compute fee breakdown for sub-order A
    const subA = itemsA.reduce((sum, it) => sum + it.lineTotal, 0);
    const cfgA = PLATFORMS[pA];
    const delA = subA >= cfgA.freeDeliveryThreshold ? 0 : cfgA.baseDeliveryFee;
    const feeA = cfgA.platformFee;
    const totalA = subA + delA + feeA;

    // Compute fee breakdown for sub-order B
    const subB = itemsB.reduce((sum, it) => sum + it.lineTotal, 0);
    const cfgB = PLATFORMS[pB];
    const delB = subB >= cfgB.freeDeliveryThreshold ? 0 : cfgB.baseDeliveryFee;
    const feeB = cfgB.platformFee;
    const totalB = subB + delB + feeB;

    const combined = totalA + totalB;
    if (combined < bestSplitCombined) {
      bestSplitCombined = combined;
      bestPair = [pA, pB];
      bestPartition = [itemsA, itemsB];
    }
  }

  const netSavings = bestSingle.effectiveTotal - bestSplitCombined;
  const isRecommended = Boolean(bestPair && netSavings >= minSavingsThreshold);

  if (!bestPair || !bestPartition) {
    return {
      isRecommended: false,
      orders: [],
      combinedTotal: bestSingle.effectiveTotal,
      bestSingleStoreTotal: bestSingle.effectiveTotal,
      netSavings: 0,
      tradeoffText: 'Single store order is already optimized',
      explanation: 'No split combination saves money after accounting for additional delivery charges.'
    };
  }

  const [pA, pB] = bestPair;
  const [itemsA, itemsB] = bestPartition;
  const subA = itemsA.reduce((sum, it) => sum + it.lineTotal, 0);
  const cfgA = PLATFORMS[pA];
  const delA = subA >= cfgA.freeDeliveryThreshold ? 0 : cfgA.baseDeliveryFee;
  const feeA = cfgA.platformFee;

  const subB = itemsB.reduce((sum, it) => sum + it.lineTotal, 0);
  const cfgB = PLATFORMS[pB];
  const delB = subB >= cfgB.freeDeliveryThreshold ? 0 : cfgB.baseDeliveryFee;
  const feeB = cfgB.platformFee;

  const orders: SplitSubOrder[] = [
    {
      platformId: pA,
      platformName: cfgA.name,
      items: itemsA,
      itemsSubtotal: subA,
      deliveryFee: delA,
      platformFee: feeA,
      total: subA + delA + feeA
    },
    {
      platformId: pB,
      platformName: cfgB.name,
      items: itemsB,
      itemsSubtotal: subB,
      deliveryFee: delB,
      platformFee: feeB,
      total: subB + delB + feeB
    }
  ];

  return {
    isRecommended,
    orders,
    combinedTotal: bestSplitCombined,
    bestSingleStoreTotal: bestSingle.effectiveTotal,
    netSavings: Math.max(0, netSavings),
    tradeoffText: '2 deliveries from separate dark stores',
    explanation: isRecommended
      ? `Splitting saves ₹${netSavings} even after paying ₹${delA + delB} in delivery fees across ${cfgA.name} and ${cfgB.name}.`
      : `Splitting saves only ₹${Math.max(0, netSavings)}, which is below your minimum threshold of ₹${minSavingsThreshold}. One store recommended.`
  };
}

/**
 * Generate clear editorial explanation for the recommendation.
 */
export function getRecommendationExplanation(
  winner: PlatformBasketResult,
  ranked: PlatformBasketResult[],
  mode: ComparisonMode
): string {
  if (ranked.length < 2) return 'Only available platform for this basket.';

  const runnerUp = ranked[1];
  const diff = runnerUp.effectiveTotal - winner.effectiveTotal;

  if (mode === 'cheapest') {
    if (diff > 0) {
      return `₹${diff} cheaper than ${runnerUp.platformName} for the complete basket, keeping all requested items available.`;
    }
    return 'Lowest complete-basket cost across all monitored apps.';
  }

  if (mode === 'fastest') {
    const timeSaved = runnerUp.etaMinutes - winner.etaMinutes;
    if (timeSaved > 0) {
      return `${timeSaved} minutes faster delivery to your doorstep than the next closest app.`;
    }
    return 'Fastest available courier dispatch time in your area.';
  }

  // bestValue
  return `Optimal balance: ${winner.etaMinutes} min delivery and competitive ₹${winner.effectiveTotal} total with all items in stock.`;
}

/**
 * Execute full basket comparison.
 */
export function computeComparison(
  basket: BasketItem[],
  products: Product[],
  offers: Record<string, ProductOffers>,
  preferences: UserPreferences,
  isLiveOrApiKey: boolean = false
): ComparisonSummary {
  const platformIds: PlatformId[] = ['blinkit', 'zepto', 'instamart', 'jiomart'];
  const resultsList = platformIds.map(p => computeForPlatform(basket, p, products, offers));

  const resultsMap = {} as Record<PlatformId, PlatformBasketResult>;
  resultsList.forEach(r => {
    resultsMap[r.platformId] = r;
  });

  const rankedCheapest = rankResults(resultsList, 'cheapest');
  const rankedFastest = rankResults(resultsList, 'fastest');
  const rankedBestValue = rankResults(resultsList, 'bestValue');

  const recommended = rankedCheapest[0] || resultsList[0];
  const recommendationExplanation = getRecommendationExplanation(recommended, rankedCheapest, 'cheapest');
  const splitResult = computeSmartSplit(basket, products, offers, preferences.minimumSplitSavings);

  const active = basket.filter(i => i.quantity > 0);
  const totalUnits = active.reduce((sum, i) => sum + i.quantity, 0);

  const hasLiveProducts = isLiveOrApiKey || products.some(p => p.isLive);
  const dataStatus = hasLiveProducts ? 'LIVE' : 'DEMO DATA';
  const timestamp = hasLiveProducts ? 'LIVE DARK STORES' : 'JUST NOW';

  return {
    results: resultsMap,
    ranked: {
      cheapest: rankedCheapest,
      fastest: rankedFastest,
      bestValue: rankedBestValue
    },
    recommended,
    recommendationExplanation,
    splitResult,
    totalUnits,
    uniqueCount: active.length,
    dataStatus,
    timestamp
  };
}
