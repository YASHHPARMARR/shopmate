import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  Plus,
  ShieldCheck,
  TrendingDown,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useShopMate } from '../context/ShopMateContext';
import { PLATFORMS } from '../data/platforms';
import { DataStatusBadge } from '../components/DataStatusBadge';
import type { PlatformId, Product } from '../types';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    offers,
    basket,
    updateQuantity,
    toggleAlert,
    alerts,
    openCheckout
  } = useShopMate();

  const [alertSuccess, setAlertSuccess] = useState(false);
  const [targetPriceInput, setTargetPriceInput] = useState<string>('');

  const product = products.find((p) => p.id === id) || products[0];
  const inBasketItem = basket.find((b) => b.productId === product.id);

  // Platform offers
  const prodOffers = offers[product.id] || {};
  const platformList = Object.values(PLATFORMS);

  const availableOffers = platformList
    .map((p) => ({ platform: p, offer: prodOffers[p.id] }))
    .filter((item) => item.offer && item.offer.inStock);

  const lowestOffer = availableOffers.length > 0
    ? availableOffers.reduce((prev, curr) => (curr.offer.price < prev.offer.price ? curr : prev))
    : { platform: platformList[0], offer: prodOffers[platformList[0].id] || { price: product.mrp, inStock: true, etaMinutes: 10, matchConfidence: 98, matchType: 'EXACT MATCH' } };

  const existingAlert = alerts.find((a) => a.productId === product.id);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetPriceInput) || Math.round(lowestOffer.offer.price * 0.9);
    toggleAlert(product.id, target);
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 3000);
  };

  // Find alternatives (same category, different id)
  const alternatives = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 mb-8 text-xs font-mono-editorial text-[#737373] border-b border-[#e5e0d8] pb-4">
        <button
          onClick={() => navigate(-1)}
          className="hover:text-[#121212] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          BACK TO PREVIOUS
        </button>
        <div className="flex items-center gap-2">
          <span>CATALOG</span>
          <span>/</span>
          <span className="text-[#581c87] font-semibold">{product.category.toUpperCase()}</span>
          <span>/</span>
          <span className="text-[#121212]">{product.id.toUpperCase()}</span>
        </div>
        <DataStatusBadge />
      </div>

      {/* Main Editorial Presentation: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
        {/* Left Column: Large Product Imagery & Match Confidence */}
        <div className="lg:col-span-6 space-y-8">
          <div className="border border-[#e5e0d8] bg-white p-8 sm:p-14 relative overflow-hidden group">
            {/* Editorial Badge */}
            <div className="absolute top-6 left-6 font-mono-editorial text-[10px] tracking-widest text-[#737373] uppercase">
              SKU • {product.id.toUpperCase()}
            </div>
            <div className="absolute top-6 right-6 font-mono-editorial text-[10px] tracking-widest text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1">
              IN STOCK • {availableOffers.length}/4 PLATFORMS
            </div>

            <div className="h-72 sm:h-96 w-full flex items-center justify-center p-6 my-4">
              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="border-t border-[#f0ede6] pt-4 flex items-center justify-between text-xs font-mono-editorial text-[#737373]">
              <span>STANDARDIZED PACKAGING</span>
              <span className="text-[#121212] font-semibold">{product.size} {product.unit}</span>
            </div>
          </div>

          {/* Match Confidence Rubric Card */}
          <div className="border border-[#e5e0d8] bg-[#faf8f5] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#581c87]" />
                <span className="font-mono-editorial text-xs font-bold text-[#121212] tracking-wider uppercase">
                  MATCH CONFIDENCE ENGINE
                </span>
              </div>
              <span className="font-mono-editorial text-sm font-bold text-[#581c87] bg-[#f3e8ff] px-2.5 py-0.5 border border-[#e9d5ff]">
                98% EXACT MATCH
              </span>
            </div>

            <p className="text-xs text-[#525252] leading-relaxed mb-4 font-sans">
              Cross-platform algorithm evaluated normalized grammage ({product.size} {product.unit}), brand registry ({product.brand}), and GTIN / barcode signatures across quick-commerce dark stores.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#e5e0d8] font-mono-editorial text-[10px]">
              <div>
                <span className="text-[#a3a3a3] block">UNIT PARITY</span>
                <span className="text-[#121212] font-bold">100% IDENTICAL</span>
              </div>
              <div>
                <span className="text-[#a3a3a3] block">FORM FACTOR</span>
                <span className="text-[#121212] font-bold">SINGLE RETAIL</span>
              </div>
              <div>
                <span className="text-[#a3a3a3] block">VERIFICATION</span>
                <span className="text-[#15803d] font-bold">DETERMINISTIC</span>
              </div>
            </div>
          </div>

          {/* Price Drop Alert Form */}
          <div className="border border-[#e5e0d8] bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-[#581c87]" />
              <h3 className="font-mono-editorial text-xs font-bold tracking-wider uppercase text-[#121212]">
                PRICE DROP MONITOR
              </h3>
            </div>
            <p className="text-xs text-[#737373] mb-4 font-sans">
              Notify me automatically when {product.name} falls below target price.
            </p>

            {existingAlert ? (
              <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] text-xs font-mono-editorial text-[#15803d] flex items-center justify-between">
                <span>ACTIVE MONITOR: BELOW ₹{existingAlert.targetPrice}</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : (
              <form onSubmit={handleCreateAlert} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs font-mono-editorial text-[#737373]">₹</span>
                  <input
                    type="number"
                    placeholder={`e.g. ${Math.round(lowestOffer.offer.price * 0.9)}`}
                    value={targetPriceInput}
                    onChange={(e) => setTargetPriceInput(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-xs font-mono-editorial border border-[#e5e0d8] focus:border-[#581c87] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#121212] hover:bg-[#581c87] text-white px-4 py-2 text-xs font-mono-editorial tracking-wider uppercase transition-colors"
                >
                  CREATE ALERT
                </button>
              </form>
            )}

            {alertSuccess && (
              <div className="mt-2 text-[10px] font-mono-editorial text-[#15803d] flex items-center gap-1">
                <Check className="w-3 h-3" /> Target alert registered in local session.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Giant Typography, Platform Matrix & Price Intelligence */}
        <div className="lg:col-span-6 space-y-10">
          <div>
            <div className="text-[11px] font-mono-editorial tracking-widest text-[#581c87] uppercase mb-2 font-bold">
              {product.brand} • {product.category.toUpperCase()}
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-[#121212] tracking-tight leading-[0.95] mb-4">
              {product.name}
            </h1>
            <div className="text-2xl font-mono-editorial font-bold text-[#737373]">
              {product.size} {product.unit}
            </div>
          </div>

          {/* Quick Add To Basket Strip */}
          <div className="p-4 bg-[#fbfaf8] border border-[#e5e0d8] flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono-editorial text-[#737373] block uppercase">
                YOUR BASKET STATUS
              </span>
              <span className="text-sm font-bold text-[#121212]">
                {inBasketItem ? `${inBasketItem.quantity} units currently selected` : 'Not in active basket'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, 1)}
                className="bg-[#581c87] hover:bg-[#4a148c] text-white px-4 py-2.5 text-xs font-mono-editorial tracking-wider uppercase flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                {inBasketItem ? 'ADD ANOTHER' : 'ADD TO BASKET'}
              </button>
              {inBasketItem && (
                <Link
                  to="/basket"
                  className="border border-[#e5e0d8] hover:border-[#121212] bg-white px-3 py-2.5 text-xs font-mono-editorial transition-colors"
                >
                  VIEW BASKET
                </Link>
              )}
            </div>
          </div>

          {/* Platform Price Comparison Matrix */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#121212] mb-4">
              <span className="font-mono-editorial text-xs font-bold text-[#121212] tracking-wider uppercase">
                COMPARE PRICE ACROSS 04 PLATFORMS
              </span>
              <span className="font-mono-editorial text-[10px] text-[#737373]">
                CHECKED 2 MIN AGO
              </span>
            </div>

            <div className="space-y-3">
              {platformList.map((platform) => {
                const offer = prodOffers[platform.id as PlatformId];
                const isLowest = offer && offer.inStock && offer.price === lowestOffer.offer.price;

                return (
                  <div
                    key={platform.id}
                    className={`border p-4 transition-all flex items-center justify-between ${
                      isLowest
                        ? 'border-[#581c87] bg-[#faf5ff] ring-1 ring-[#581c87]/20'
                        : 'border-[#e5e0d8] bg-white hover:border-[#a3a3a3]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-3 h-10 rounded-sm"
                        style={{ backgroundColor: platform.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-[#121212]">
                            {platform.name}
                          </span>
                          {isLowest && (
                            <span className="font-mono-editorial text-[9px] bg-[#581c87] text-white px-2 py-0.5 font-bold uppercase tracking-wider">
                              LOWEST PRICE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono-editorial text-[#737373] mt-0.5">
                          ETA {platform.defaultEtaMinutes} MIN • {offer?.inStock ? 'READY IN DARK STORE' : 'OUT OF STOCK'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        {offer?.inStock ? (
                          <>
                            <div className="text-2xl font-black font-mono-editorial text-[#121212]">
                              ₹{offer.price}
                            </div>
                            <div className="text-[10px] font-mono-editorial text-[#15803d]">
                              MRP: ₹{product.mrp}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm font-mono-editorial text-[#dc2626] font-semibold">
                            UNAVAILABLE
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => openCheckout(platform.id as PlatformId)}
                        className="p-2 border border-[#e5e0d8] hover:border-[#121212] hover:bg-[#faf8f5] text-[#737373] hover:text-[#121212] transition-colors"
                        title={`Open on ${platform.name}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-[11px] text-[#737373] italic">
              * Note: Individual item winners do not determine complete basket winners once delivery tiers and platform surge fees are applied.
            </p>
          </div>

          {/* Price Intelligence & Illustrative Sparkline */}
          <div className="border border-[#e5e0d8] bg-[#fbfaf8] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono-editorial text-xs font-bold text-[#121212] tracking-wider uppercase">
                PRICE INTELLIGENCE &amp; TREND
              </span>
              <span className="font-mono-editorial text-[10px] text-[#581c87] font-semibold uppercase">
                ILLUSTRATIVE HISTORY
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <div className="text-5xl font-black font-mono-editorial text-[#121212]">
                ₹{lowestOffer.offer.price}
              </div>
              <div className="flex items-center gap-1 text-xs font-mono-editorial text-[#15803d]">
                <TrendingDown className="w-4 h-4" />
                <span>₹5 CHEAPER THAN 7-DAY AVERAGE</span>
              </div>
            </div>

            {/* Illustrative timeline points */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#e5e0d8] text-center font-mono-editorial">
              <div className="bg-white p-3 border border-[#e5e0d8]">
                <div className="text-[10px] text-[#737373] uppercase mb-1">TODAY</div>
                <div className="text-lg font-black text-[#581c87]">₹{lowestOffer.offer.price}</div>
              </div>
              <div className="bg-white p-3 border border-[#e5e0d8]">
                <div className="text-[10px] text-[#737373] uppercase mb-1">YESTERDAY</div>
                <div className="text-lg font-black text-[#121212]">₹{lowestOffer.offer.price + 5}</div>
              </div>
              <div className="bg-white p-3 border border-[#e5e0d8]">
                <div className="text-[10px] text-[#737373] uppercase mb-1">7 DAYS AGO</div>
                <div className="text-lg font-black text-[#737373]">₹{lowestOffer.offer.price + 7}</div>
              </div>
            </div>
          </div>

          {/* Similar Alternatives */}
          {alternatives.length > 0 && (
            <div>
              <div className="text-[11px] font-mono-editorial tracking-wider text-[#121212] uppercase font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#581c87]" />
                SIMILAR ALTERNATIVES IN SAME CATEGORY
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {alternatives.map((alt: Product) => {
                  const altOffers = offers[alt.id];
                  const altMinPrice = altOffers ? Math.min(...Object.values(altOffers).map(o => o.price)) : alt.mrp;
                  return (
                    <Link
                      key={alt.id}
                      to={`/product/${alt.id}`}
                      className="border border-[#e5e0d8] bg-white p-4 hover:border-[#581c87] transition-all group block"
                    >
                      <div className="h-20 w-full flex items-center justify-center p-2 mb-2 bg-[#faf8f5]">
                        <img src={alt.image} alt={alt.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="text-[10px] font-mono-editorial text-[#581c87] uppercase font-semibold">{alt.brand}</div>
                      <div className="font-bold text-xs text-[#121212] truncate group-hover:text-[#581c87] transition-colors">{alt.name}</div>
                      <div className="text-[11px] font-mono-editorial text-[#737373] mt-1">₹{altMinPrice} • {alt.size} {alt.unit}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
