import React, { useState, useEffect } from 'react';
import { useShopMate } from '../context/ShopMateContext';
import { DataStatusBadge } from '../components/DataStatusBadge';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Split,
  Clock,
  Sparkles,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ComparePage: React.FC = () => {
  const {
    products,
    offers,
    basket,
    addToBasket,
    updateQuantity,
    removeFromBasket,
    comparison,
    comparisonMode,
    setComparisonMode,
    runComparison,
    isCalculating,
    location: activeLocation,
    setWhyDrawerOpen,
    openCheckout,
    savedBaskets,
    loadPreset,
    searchLiveProducts,
    isLiveLoading,
    apiKey
  } = useShopMate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Debounced search for live QuickCommerce products
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return;
    const timer = setTimeout(() => {
      searchLiveProducts(searchQuery);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery, searchLiveProducts]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const popularChips = [
    { label: '🥛 Milk', query: 'milk' },
    { label: '🍞 Bread', query: 'bread' },
    { label: '🥚 Eggs', query: 'eggs' },
    { label: '🍜 Maggi', query: 'maggi' },
    { label: '🥤 Coke', query: 'coke' },
    { label: '🌾 Atta', query: 'atta' },
    { label: '🧀 Paneer', query: 'paneer' },
    { label: '🥔 Chips', query: 'chips' }
  ];

  const totalUnits = basket.reduce((sum, item) => sum + item.quantity, 0);
  const activeProducts = basket.filter(item => item.quantity > 0);

  const winner = comparison.recommended;
  const split = comparison.splitResult;

  return (
    <div className="pt-24 pb-28 px-6 md:px-10 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-[#e5e2da]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-mono-editorial font-bold uppercase tracking-widest text-purple-900">
              01 / COMPARISON ENGINE
            </span>
            <DataStatusBadge status={comparison.dataStatus} timestamp={comparison.timestamp} />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#121212] leading-[0.95]">
            COMPARE<br />YOUR BASKET.
          </h1>
        </div>

        {/* Location & Metadata Pill */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono-editorial">
          <div className="p-3 rounded-2xl bg-white border border-[#ded9cb] space-y-0.5">
            <div className="text-[10px] text-[#78766f] uppercase">DELIVERY LOCATION</div>
            <div className="font-bold text-[#121212]">{activeLocation.label}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-[#ded9cb] space-y-0.5">
            <div className="text-[10px] text-[#78766f] uppercase">BASKET POPULATION</div>
            <div className="font-bold text-purple-950">{activeProducts.length} Products • {totalUnits} Units</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Catalog / Search (Left) + Sticky Basket Builder (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10 items-start">
        {/* Left Column: Product Search & Grid */}
        <div className="lg:col-span-8 space-y-8">
          {/* Big Search Input */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-[#78766f]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="WHAT DO YOU NEED TODAY? (e.g., milk, bread, soda)..."
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white border border-[#ded9cb] text-sm font-mono-editorial focus:outline-hidden focus:border-purple-900 shadow-2xs transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono-editorial uppercase text-[#78766f] hover:text-[#121212]"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Popular quick chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono-editorial">
              <span className="text-[10px] text-[#78766f] font-bold uppercase tracking-wider whitespace-nowrap">POPULAR:</span>
              {popularChips.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSearchQuery(chip.query);
                    searchLiveProducts(chip.query);
                  }}
                  className="px-3 py-1.5 rounded-full bg-white border border-[#ded9cb] hover:border-purple-800 text-[#4a4944] whitespace-nowrap transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Category selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono-editorial">
              {['all', 'dairy', 'beverages', 'snacks', 'staples', 'instant'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded border text-[11px] uppercase transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#581c87] text-white border-[#581c87] font-bold'
                      : 'bg-white text-[#78766f] border-[#ded9cb] hover:border-[#121212]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items Table / Cards */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono-editorial uppercase text-[#78766f] pb-2 border-b border-[#e5e2da]">
              <div className="flex items-center gap-2">
                <span>PRODUCT CATALOG ({filteredProducts.length})</span>
                {isLiveLoading && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-purple-900 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                    <Loader2 className="w-3 h-3 animate-spin text-purple-700" />
                    <span>FETCHING LIVE PRICES...</span>
                  </span>
                )}
              </div>
              <span>4-STORE INDICATIVE RANGE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((p) => {
                const itemOffers = offers[p.id];
                const prices = itemOffers ? Object.values(itemOffers).map(o => o.price) : [p.mrp];
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);

                const inBasket = basket.find(b => b.productId === p.id);
                const qty = inBasket?.quantity || 0;

                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-white border border-[#ded9cb] hover:border-[#121212] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-[#faf8f5] flex items-center justify-center text-2xl flex-shrink-0 border border-[#edeae1] overflow-hidden">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            p.emoji
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono-editorial text-[#78766f] uppercase block truncate">
                              {p.brand} • {p.size}{p.unit}
                            </span>
                            {p.isLive && (
                              <span className="text-[9px] font-mono-editorial font-bold bg-emerald-50 text-emerald-800 px-1 py-0.2 rounded-xs border border-emerald-300">
                                LIVE
                              </span>
                            )}
                          </div>
                          <Link
                            to={`/product/${p.id}`}
                            className="font-display font-bold text-sm text-[#121212] group-hover:text-purple-900 transition-colors block truncate"
                          >
                            {p.name}
                          </Link>
                          <span className="text-[11px] text-[#78766f]">
                            {p.variant}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between py-2 border-t border-[#edeae1]">
                        <div>
                          <span className="font-mono-editorial font-bold text-base text-[#121212]">
                            ₹{minPrice}
                          </span>
                          {minPrice !== maxPrice && (
                            <span className="text-xs font-mono-editorial text-[#78766f] ml-1.5">
                              – ₹{maxPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono-editorial text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          EXACT MATCH 98%
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#edeae1]">
                      {qty > 0 ? (
                        <div className="flex items-center justify-between bg-[#f5f3ee] rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(p.id, -1)}
                            className="w-8 h-8 rounded-lg bg-white shadow-2xs flex items-center justify-center font-bold text-xs hover:bg-purple-900 hover:text-white transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono-editorial font-bold">{qty}</span>
                          <button
                            onClick={() => updateQuantity(p.id, 1)}
                            className="w-8 h-8 rounded-lg bg-white shadow-2xs flex items-center justify-center font-bold text-xs hover:bg-purple-900 hover:text-white transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToBasket(p.id)}
                          className="w-full py-2 rounded-xl border border-[#ded9cb] hover:bg-[#121212] hover:text-white text-xs font-mono-editorial uppercase font-bold text-[#4a4944] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Basket</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Basket Summary & Compare Button */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#ded9cb] shadow-lg space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#edeae1]">
              <div>
                <span className="text-[10px] font-mono-editorial text-purple-900 uppercase font-bold block">
                  ACTIVE SELECTION
                </span>
                <h3 className="font-display text-xl font-bold uppercase text-[#121212]">
                  Your Basket
                </h3>
              </div>
              <span className="text-xs font-mono-editorial font-bold px-2.5 py-1 rounded-full bg-[#f5f3ee] text-[#4a4944]">
                {totalUnits} items
              </span>
            </div>

            {/* Basket items list */}
            {activeProducts.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono-editorial text-[#78766f] space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-[#ded9cb]" />
                <p>Your basket is empty.</p>
                <p className="text-[11px] text-[#a8a69f]">Add products from the left to start comparison.</p>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-[#edeae1]">
                {activeProducts.map((item) => {
                  const p = products.find(prod => prod.id === item.productId);
                  if (!p) return null;
                  const itemOffers = offers[p.id];
                  const minPrice = itemOffers ? Math.min(...Object.values(itemOffers).map(o => o.price)) : p.mrp;

                  return (
                    <div key={item.productId} className="pt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg">{p.emoji}</span>
                        <div className="min-w-0">
                          <div className="font-bold truncate text-[#121212]">{p.name}</div>
                          <div className="text-[10px] text-[#78766f] font-mono-editorial">₹{minPrice} × {item.quantity}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono-editorial font-bold text-[#121212]">
                          ₹{minPrice * item.quantity}
                        </span>
                        <button
                          onClick={() => removeFromBasket(item.productId)}
                          className="p-1 text-[#a8a69f] hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Basket Subtotal & Presets */}
            {activeProducts.length > 0 && (
              <div className="pt-4 border-t border-[#edeae1] space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono-editorial text-[#78766f] uppercase">ESTIMATED RANGE</span>
                  <span className="font-display font-extrabold text-xl text-[#121212] font-mono-editorial">
                    ₹{comparison.recommended.effectiveTotal}
                  </span>
                </div>

                <button
                  onClick={runComparison}
                  disabled={isCalculating}
                  className="w-full py-4 rounded-2xl bg-[#121212] hover:bg-purple-950 text-white font-mono-editorial text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
                >
                  {isCalculating ? (
                    <span>COMPUTING PLATFORM MATRIX...</span>
                  ) : (
                    <>
                      <span>COMPARE NOW ACROSS 4 APPS</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Quick Preset loader card */}
          <div className="p-4 rounded-2xl bg-[#f5f3ee] border border-[#ded9cb] space-y-2">
            <span className="text-[10px] font-mono-editorial uppercase font-bold text-[#78766f] block">
              LOAD RECURRING PRESET
            </span>
            <div className="flex flex-col gap-1.5">
              {savedBaskets.slice(0, 3).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => loadPreset(preset.id)}
                  className="p-2 rounded-xl bg-white border border-[#ded9cb] hover:border-purple-800 text-left text-xs font-mono-editorial flex items-center justify-between transition-colors"
                >
                  <span className="font-bold text-[#121212] truncate">{preset.title}</span>
                  <span className="text-[10px] text-purple-900 font-bold">{preset.itemCount} items</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          COMPARISON RESULTS SECTION
          ======================================================== */}
      {activeProducts.length > 0 && (
        <section id="results-dashboard" className="mt-20 pt-16 border-t-2 border-[#121212] space-y-12">
          {/* Dashboard Header & Mode Tabs */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <div className="text-[10px] font-mono-editorial font-bold uppercase tracking-widest text-purple-900 mb-1">
                EVALUATED ACROSS BLINKIT • ZEPTO • INSTAMART • JIOMART
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#121212]">
                04 Platforms Evaluated
              </h2>
            </div>

            {/* Mode selection */}
            <div className="p-1 rounded-full bg-[#edeae1] border border-[#ded9cb] inline-flex gap-1 text-xs font-mono-editorial font-bold">
              {(['cheapest', 'fastest', 'bestValue'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setComparisonMode(mode)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    comparisonMode === mode
                      ? 'bg-purple-950 text-white shadow-xs'
                      : 'text-[#5a5852] hover:text-[#121212]'
                  }`}
                >
                  {mode === 'cheapest' ? 'CHEAPEST' : mode === 'fastest' ? 'FASTEST' : 'BEST VALUE'}
                </button>
              ))}
            </div>
          </div>

          {/* ShopMate Recommends Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-purple-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="text-[11px] font-mono-editorial font-bold uppercase tracking-widest text-purple-200">
                  SHOPMATE RECOMMENDS
                </span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight">
                {winner.platformName} — ₹{winner.effectiveTotal}
              </h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                {comparison.recommendationExplanation}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setWhyDrawerOpen(true)}
                className="flex-1 md:flex-none px-5 py-3.5 rounded-full border border-purple-400/40 hover:bg-purple-900 text-xs font-mono-editorial uppercase font-bold text-white transition-colors"
              >
                VIEW WHY
              </button>
              <button
                onClick={() => openCheckout(winner.platformId)}
                className="flex-1 md:flex-none px-6 py-3.5 rounded-full bg-white text-purple-950 font-mono-editorial text-xs font-bold uppercase tracking-wider hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>CONTINUE TO {winner.platformName.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 Platform Scorecard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {comparison.ranked[comparisonMode].map((res, i) => {
              const isWinner = res.isWinner;
              return (
                <div
                  key={res.platformId}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                    isWinner
                      ? 'bg-white border-purple-900 shadow-xl ring-2 ring-purple-900/10'
                      : 'bg-[#faf8f5] border-[#ded9cb]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#edeae1] mb-4">
                      <span className="text-xs font-mono-editorial font-bold text-[#78766f]">
                        0{i + 1}
                      </span>
                      <span className="font-display font-extrabold text-lg uppercase tracking-tight text-[#121212]">
                        {res.platformName}
                      </span>
                    </div>

                    <div className="font-display text-3xl font-black font-mono-editorial text-[#121212] mb-1">
                      ₹{res.effectiveTotal}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono-editorial mb-4">
                      <span className="flex items-center gap-1 text-[#78766f]">
                        <Clock className="w-3 h-3" />
                        {res.etaMinutes}m
                      </span>
                      <span className="text-[#ded9cb]">/</span>
                      <span className={res.allAvailable ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                        {res.inStockCount}/{res.totalRequestedProducts} Available
                      </span>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-1.5 text-xs font-mono-editorial py-3 border-y border-[#edeae1] text-[#5a5852]">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span>₹{res.itemsSubtotal}</span>
                      </div>
                      {res.discount > 0 && (
                        <div className="flex justify-between text-emerald-800">
                          <span>Discount</span>
                          <span>−₹{res.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>{res.deliveryFee === 0 ? 'Free' : `₹${res.deliveryFee}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Fee</span>
                        <span>₹{res.platformFee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <button
                      onClick={() => openCheckout(res.platformId)}
                      className={`w-full py-2.5 rounded-xl font-mono-editorial text-xs font-bold uppercase tracking-wider transition-colors ${
                        isWinner
                          ? 'bg-purple-950 text-white hover:bg-purple-900'
                          : 'border border-[#ded9cb] hover:bg-[#edeae1] text-[#4a4944]'
                      }`}
                    >
                      Select {res.platformName}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Item-Level Comparison Matrix */}
          <div className="p-8 rounded-3xl bg-white border border-[#ded9cb] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-[#edeae1]">
              <div>
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#121212]">
                  Where Each Item Wins.
                </h3>
                <p className="text-xs text-[#78766f] font-mono-editorial mt-0.5">
                  Individual lowest prices do not determine the complete basket winner.
                </p>
              </div>
              <span className="text-[10px] font-mono-editorial font-bold bg-[#f5f3ee] px-2.5 py-1 rounded text-[#5a5852] uppercase">
                MATRIX PROVENANCE
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-editorial">
                <thead>
                  <tr className="border-b border-[#e5e2da] text-[#78766f]">
                    <th className="py-3 pr-4 uppercase">Product</th>
                    <th className="py-3 px-3 uppercase text-center">Blinkit</th>
                    <th className="py-3 px-3 uppercase text-center">Zepto</th>
                    <th className="py-3 px-3 uppercase text-center">Instamart</th>
                    <th className="py-3 pl-3 uppercase text-center">JioMart</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edeae1]">
                  {activeProducts.map((item) => {
                    const p = products.find(prod => prod.id === item.productId);
                    if (!p) return null;
                    const itOffers = offers[p.id];

                    const pBlink = itOffers?.blinkit?.price || 0;
                    const pZepto = itOffers?.zepto?.price || 0;
                    const pInsta = itOffers?.instamart?.price || 0;
                    const pJio = itOffers?.jiomart?.price || 0;

                    const minP = Math.min(pBlink, pZepto, pInsta, pJio);

                    return (
                      <tr key={item.productId} className="hover:bg-[#faf8f5]">
                        <td className="py-3.5 pr-4">
                          <span className="font-bold text-[#121212]">{p.brand} {p.name}</span>
                          <span className="text-[#a8a69f] block text-[10px]">{p.size}{p.unit} × {item.quantity}</span>
                        </td>
                        <td className={`py-3.5 px-3 text-center ${pBlink === minP ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-[#5a5852]'}`}>
                          ₹{pBlink}
                        </td>
                        <td className={`py-3.5 px-3 text-center ${pZepto === minP ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-[#5a5852]'}`}>
                          ₹{pZepto}
                        </td>
                        <td className={`py-3.5 px-3 text-center ${pInsta === minP ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-[#5a5852]'}`}>
                          ₹{pInsta}
                        </td>
                        <td className={`py-3.5 pl-3 text-center ${pJio === minP ? 'text-emerald-800 font-bold bg-emerald-50/50' : 'text-[#5a5852]'}`}>
                          ₹{pJio}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-[#78766f] font-mono-editorial text-center pt-2">
              Highlighted prices indicate individual item winners. Platform fees, promos, and delivery thresholds determine the final order winner.
            </div>
          </div>

          {/* Smart Basket Split Module */}
          <div className="p-8 rounded-3xl bg-purple-50/60 border border-purple-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-purple-200">
              <div className="flex items-center gap-3">
                <Split className="w-5 h-5 text-purple-900" />
                <div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight text-[#121212]">
                    There's a cheaper combination.
                  </h3>
                  <span className="text-xs font-mono-editorial text-purple-900 font-semibold">
                    SMART SPLIT ENGINE
                  </span>
                </div>
              </div>

              {split.isRecommended ? (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono-editorial text-xs font-bold">
                  SAVES ₹{split.netSavings} NET
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-white text-[#78766f] font-mono-editorial text-xs">
                  SINGLE STORE RECOMMENDED
                </span>
              )}
            </div>

            <p className="text-xs text-[#5a5852] max-w-2xl leading-relaxed">
              {split.explanation}
            </p>

            {split.orders.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {split.orders.map((sub, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-purple-200/70 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono-editorial">
                      <span className="font-bold text-purple-950 uppercase">{sub.platformName} SUB-ORDER</span>
                      <span className="font-bold text-[#121212]">₹{sub.total}</span>
                    </div>
                    <div className="text-[11px] text-[#78766f]">
                      {sub.items.length} items • Delivery ₹{sub.deliveryFee} • Platform fee ₹{sub.platformFee}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
