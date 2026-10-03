import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowUpRight, ShoppingCart, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { useShopMate } from '../context/ShopMateContext';
import { ChapterHeader } from '../components/ChapterHeader';
import { DataStatusBadge } from '../components/DataStatusBadge';

export const BasketPage: React.FC = () => {
  const { basket, products, offers, updateQuantity, removeFromBasket, clearBasket, loadPreset } = useShopMate();
  const navigate = useNavigate();

  // Compute live basket metrics
  const totalUnits = basket.reduce((acc, item) => acc + item.quantity, 0);
  const uniqueProducts = basket.length;
  const subtotal = basket.reduce((acc, item) => {
    const prodOffers = offers[item.productId];
    const lowestPrice = prodOffers
      ? Math.min(...Object.values(prodOffers).filter(o => o.inStock).map(o => o.price))
      : 40;
    return acc + (lowestPrice * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#e5e0d8] pb-12 mb-12">
        <ChapterHeader
          rubric="CHPT. 02 — CURATION"
          title={<>YOUR<br />BASKET.</>}
          subtitle="One basket assembled once. Transparently compared across Blinkit, Zepto, Instamart and JioMart with true net calculations."
        />

        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-[#f0ece4]">
          <div className="flex items-center gap-6 text-xs font-mono-editorial text-[#737373]">
            <div>
              <span className="text-[#121212] font-bold text-base">{uniqueProducts}</span> PRODUCTS
            </div>
            <div className="h-4 w-px bg-[#e5e0d8]" />
            <div>
              <span className="text-[#121212] font-bold text-base">{totalUnits}</span> TOTAL UNITS
            </div>
            <div className="h-4 w-px bg-[#e5e0d8]" />
            <div>
              EST. BASE: <span className="text-[#121212] font-bold text-base">₹{subtotal}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DataStatusBadge />
            {basket.length > 0 && (
              <button
                onClick={clearBasket}
                className="text-xs font-mono-editorial text-[#a3a3a3] hover:text-[#dc2626] transition-colors flex items-center gap-1.5 px-3 py-1.5 border border-[#e5e0d8] rounded hover:border-[#dc2626]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                EMPTY BASKET
              </button>
            )}
          </div>
        </div>
      </div>

      {basket.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-[#e5e0d8] bg-[#fbfaf8] p-12 sm:p-20 text-center my-12"
        >
          <div className="w-16 h-16 rounded-full bg-[#f0ede6] flex items-center justify-center mx-auto mb-6 text-[#581c87]">
            <ShoppingCart className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#121212] tracking-tight mb-4">
            BASKET IS CURRENTLY EMPTY
          </h2>
          <p className="text-[#737373] text-sm max-w-md mx-auto mb-8 leading-relaxed font-sans">
            Add groceries to build your combined list, or preload our curated 5-item everyday quick-commerce basket to preview real-time engine comparisons.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => loadPreset('preset-1')}
              className="inline-flex items-center gap-2 bg-[#581c87] hover:bg-[#4a148c] text-white px-6 py-3.5 text-xs font-mono-editorial tracking-wider transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              LOAD DEMO BASKET (5 ITEMS)
            </button>
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#f5f3ee] text-[#121212] px-6 py-3.5 text-xs font-mono-editorial tracking-wider transition-colors border border-[#e5e0d8]"
            >
              BROWSE CATALOG
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      ) : (
        /* Content layout: 2 columns editorial */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main items list */}
          <div className="lg:col-span-8 space-y-4">
            <div className="text-[11px] font-mono-editorial tracking-wider text-[#a3a3a3] uppercase pb-2 border-b border-[#e5e0d8]">
              MANIFEST • {basket.length} UNIQUE ESSENTIALS
            </div>

            {basket.map((item, idx) => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;

              const prodOffers = offers[item.productId];
              const availableOffers = prodOffers ? Object.values(prodOffers).filter(o => o.inStock) : [];
              const lowestOfferPrice = availableOffers.length > 0
                ? Math.min(...availableOffers.map(o => o.price))
                : product.mrp;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group border border-[#e5e0d8] hover:border-[#121212] transition-colors bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <Link
                      to={`/product/${product.id}`}
                      className="w-20 h-20 shrink-0 bg-[#faf8f5] border border-[#e5e0d8] flex items-center justify-center p-2.5 overflow-hidden group-hover:border-[#581c87] transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono-editorial tracking-wider text-[#581c87] uppercase font-semibold">
                          {product.brand}
                        </span>
                        <span className="text-[10px] font-mono-editorial text-[#a3a3a3]">•</span>
                        <span className="text-[10px] font-mono-editorial text-[#737373]">
                          {product.size} {product.unit}
                        </span>
                      </div>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-lg font-bold text-[#121212] tracking-tight hover:text-[#581c87] transition-colors truncate block"
                      >
                        {product.name}
                      </Link>
                      <div className="text-xs text-[#737373] mt-1 flex items-center gap-3">
                        <span>Best single: <strong className="text-[#121212] font-mono-editorial">₹{lowestOfferPrice}</strong></span>
                        <span className="text-[#e5e0d8]">•</span>
                        <span className="text-[11px] font-mono-editorial text-[#15803d]">In stock on {availableOffers.length}/4 apps</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#f0ede6]">
                    <div className="flex items-center border border-[#e5e0d8]">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-9 h-9 flex items-center justify-center text-[#737373] hover:text-[#121212] hover:bg-[#faf8f5] transition-colors"
                        title="Reduce quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-mono-editorial text-sm font-bold text-[#121212]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-9 h-9 flex items-center justify-center text-[#737373] hover:text-[#121212] hover:bg-[#faf8f5] transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <div className="text-base font-bold font-mono-editorial text-[#121212]">
                        ₹{lowestOfferPrice * item.quantity}
                      </div>
                      <div className="text-[10px] font-mono-editorial text-[#a3a3a3]">
                        EST. ROW
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromBasket(product.id)}
                      className="text-[#a3a3a3] hover:text-[#dc2626] p-1.5 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Quick Add recommendations */}
            <div className="pt-8">
              <div className="text-[11px] font-mono-editorial tracking-wider text-[#737373] uppercase mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#581c87]" />
                FREQUENCY ADDITIONS • POPULAR WITH THIS BASKET
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {products.filter(p => !basket.some(b => b.productId === p.id)).slice(0, 3).map((prod) => {
                  const prodOffers = offers[prod.id];
                  const minPrice = prodOffers ? Math.min(...Object.values(prodOffers).map(o => o.price)) : prod.mrp;
                  return (
                    <div
                      key={prod.id}
                      className="border border-[#e5e0d8] bg-white p-3.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-[#121212] truncate">{prod.name}</div>
                        <div className="font-mono-editorial text-[10px] text-[#737373]">{prod.size} {prod.unit} • ₹{minPrice}</div>
                      </div>
                      <button
                        onClick={() => updateQuantity(prod.id, 1)}
                        className="shrink-0 font-mono-editorial text-[10px] px-2.5 py-1 bg-[#faf8f5] border border-[#e5e0d8] hover:bg-[#581c87] hover:text-white hover:border-[#581c87] transition-colors"
                      >
                        + ADD
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right side: Giant Statement CTA Panel */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="border border-[#121212] bg-[#121212] text-[#faf8f5] p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="text-[10px] font-mono-editorial text-[#c084fc] tracking-widest uppercase mb-3">
                READY FOR TRUE COST ENGINE
              </div>

              <div className="text-4xl sm:text-5xl font-black leading-[0.9] tracking-tight mb-8">
                COMPARE<br />
                THIS<br />
                BASKET.
              </div>

              <div className="space-y-3.5 py-6 border-y border-[#262626] font-mono-editorial text-xs mb-8">
                <div className="flex justify-between text-[#a3a3a3]">
                  <span>TOTAL ITEMS</span>
                  <span className="text-[#faf8f5] font-semibold">{totalUnits} Units ({uniqueProducts} Lines)</span>
                </div>
                <div className="flex justify-between text-[#a3a3a3]">
                  <span>ESTIMATED BASE</span>
                  <span className="text-[#faf8f5] font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#a3a3a3]">
                  <span>PLATFORMS CHECKED</span>
                  <span className="text-[#c084fc] font-semibold">Blinkit, Zepto, Instamart, JioMart</span>
                </div>
                <div className="flex justify-between text-[#a3a3a3]">
                  <span>FEE RESOLUTION</span>
                  <span className="text-[#4ade80] font-semibold">Surge, Small-Cart, Rain Included</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/compare')}
                className="w-full bg-[#581c87] hover:bg-[#6b21a8] text-white py-4 px-6 text-xs font-mono-editorial tracking-widest uppercase flex items-center justify-between transition-colors shadow-lg group"
              >
                <span>RUN DECISION ENGINE</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <div className="mt-4 text-[10px] font-mono-editorial text-[#737373] text-center">
                CALCULATES CHEAPEST, FASTEST &amp; SMART SPLIT
              </div>
            </div>

            {/* Editorial rubric box */}
            <div className="border border-[#e5e0d8] bg-[#fbfaf8] p-6 text-xs text-[#737373] leading-relaxed">
              <div className="font-mono-editorial text-[10px] text-[#121212] font-bold uppercase mb-2">
                HOW SHOPMATE TREATS BASKETS
              </div>
              Unlike standard aggregators that look at products in isolation, ShopMate evaluates the basket as a unified transactional unit. Delivery fees, small cart thresholds, and product bundle discounts are resolved together.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
