import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  RotateCcw,
  Sparkles,
  Clock,
  SplitSquareVertical,
  Store,
  Tag
} from 'lucide-react';
import { useShopMate } from '../context/ShopMateContext';
import { ChapterHeader } from '../components/ChapterHeader';
import { DataStatusBadge } from '../components/DataStatusBadge';

const AVAILABLE_BRANDS = [
  'Amul',
  'Coca-Cola',
  'Lay\'s',
  'Aashirvaad',
  'Maggi',
  'Britannia',
  'Nestle',
  'Tata',
  'India Gate',
  'Mother Dairy',
  'Parle'
];

const PACK_SIZES = [
  { id: 'single', label: 'Single / Snack (50g – 200g / 300ml)' },
  { id: 'medium', label: 'Daily Standard (500g / 500ml / 6 eggs)' },
  { id: 'bulk', label: 'Family / Pantry Bulk (1kg – 5kg / 1L)' }
];

export const PreferencesPage: React.FC = () => {
  const { preferences, updatePreferences } = useShopMate();
  const [savedNotice, setSavedNotice] = useState(false);

  const notifySaved = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleEtaChange = (eta: number) => {
    updatePreferences({ maxEta: eta });
    notifySaved();
  };

  const handleMinSplitChange = (val: number) => {
    updatePreferences({ minimumSplitSavings: val });
    notifySaved();
  };

  const handleToggleSingleStore = () => {
    updatePreferences({ singleStorePreference: !preferences.singleStorePreference });
    notifySaved();
  };

  const toggleBrand = (brand: string) => {
    const current = preferences.preferredBrands || [];
    const updated = current.includes(brand)
      ? current.filter((b) => b !== brand)
      : [...current, brand];
    updatePreferences({ preferredBrands: updated });
    notifySaved();
  };

  const togglePackSize = (sizeId: string) => {
    const current = preferences.preferredPackSizes || [];
    const updated = current.includes(sizeId)
      ? current.filter((s) => s !== sizeId)
      : [...current, sizeId];
    updatePreferences({ preferredPackSizes: updated });
    notifySaved();
  };

  const resetDefaults = () => {
    updatePreferences({
      preferredBrands: ['Amul', 'Coca-Cola', 'Lay\'s', 'Aashirvaad'],
      preferredPackSizes: ['medium'],
      maxEta: 20,
      minimumSplitSavings: 25,
      singleStorePreference: false
    });
    notifySaved();
  };

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#e5e0d8] pb-12 mb-12">
        <ChapterHeader
          rubric="CHPT. 10 — PERSONALIZATION"
          title={<>MAKE<br />SHOPMATE<br />SHOP<br />LIKE YOU.</>}
          subtitle="Define personal thresholds for delivery urgency, brand loyalty, and tradeoff tolerance. The comparison engine recalculates recommendations against your custom rules."
        />

        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-[#f0ece4]">
          <div className="flex items-center gap-2 text-xs font-mono-editorial text-[#737373]">
            <span className="text-[#121212] font-bold">5 TUNING PARAMETERS</span>
            <span>• PERSISTED IN LOCAL STORAGE</span>
            {savedNotice && (
              <span className="inline-flex items-center gap-1 text-[#15803d] font-bold ml-2">
                <Check className="w-3.5 h-3.5" /> CHANGES SAVED
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <DataStatusBadge />
            <button
              onClick={resetDefaults}
              className="text-xs font-mono-editorial text-[#a3a3a3] hover:text-[#121212] transition-colors flex items-center gap-1.5 px-3 py-1.5 border border-[#e5e0d8]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RESTORE DEFAULTS
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Preference Panels */}
      <div className="space-y-12 max-w-4xl">
        {/* 01: Maximum Delivery ETA */}
        <div className="border border-[#e5e0d8] bg-white p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-[#581c87]" />
            <span className="font-mono-editorial text-xs font-bold text-[#581c87] tracking-widest uppercase">
              01 • DELIVERY HORIZON
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight mb-2">
            MAXIMUM ACCEPTABLE ETA
          </h2>
          <p className="text-xs text-[#737373] leading-relaxed mb-6 font-sans">
            Platforms exceeding this threshold are automatically flagged as delayed or deprioritized in the "Best Value" algorithm, even if their item price is lower.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[10, 15, 20, 30].map((mins) => {
              const active = preferences.maxEta === mins;
              return (
                <button
                  key={mins}
                  onClick={() => handleEtaChange(mins)}
                  className={`p-4 border text-left transition-all ${
                    active
                      ? 'border-[#581c87] bg-[#faf5ff] ring-1 ring-[#581c87]'
                      : 'border-[#e5e0d8] bg-white hover:border-[#121212]'
                  }`}
                >
                  <div className="font-mono-editorial text-2xl font-black text-[#121212]">
                    {mins} <span className="text-xs font-normal">MIN</span>
                  </div>
                  <div className="text-[10px] font-mono-editorial text-[#737373] mt-1">
                    {mins === 10 ? 'Ultra-express' : mins === 15 ? 'Standard quick' : mins === 20 ? 'Relaxed' : 'Any turnaround'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 02: Minimum Split Savings Threshold */}
        <div className="border border-[#e5e0d8] bg-white p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-2">
            <SplitSquareVertical className="w-5 h-5 text-[#581c87]" />
            <span className="font-mono-editorial text-xs font-bold text-[#581c87] tracking-widest uppercase">
              02 • DUAL-ORDER SENSITIVITY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight mb-2">
            MINIMUM SAVING TO RECOMMEND BASKET SPLIT
          </h2>
          <p className="text-xs text-[#737373] leading-relaxed mb-6 font-sans">
            Splitting a basket across two stores means answering two doorbells. ShopMate will only recommend a dual-store split if the net saving (after two delivery fees) exceeds this amount.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[15, 25, 40, 60].map((amt) => {
              const active = preferences.minimumSplitSavings === amt;
              return (
                <button
                  key={amt}
                  onClick={() => handleMinSplitChange(amt)}
                  className={`p-4 border text-left transition-all ${
                    active
                      ? 'border-[#581c87] bg-[#faf5ff] ring-1 ring-[#581c87]'
                      : 'border-[#e5e0d8] bg-white hover:border-[#121212]'
                  }`}
                >
                  <div className="font-mono-editorial text-2xl font-black text-[#121212]">
                    ₹{amt}
                  </div>
                  <div className="text-[10px] font-mono-editorial text-[#737373] mt-1">
                    {amt <= 20 ? 'Sensitive (Split easily)' : amt <= 30 ? 'Balanced' : 'High threshold (Significant only)'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 03: Single Store Exclusivity */}
        <div className="border border-[#e5e0d8] bg-white p-8 sm:p-10">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Store className="w-5 h-5 text-[#581c87]" />
                <span className="font-mono-editorial text-xs font-bold text-[#581c87] tracking-widest uppercase">
                  03 • STORE CONSOLIDATION
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight mb-2">
                FORCE SINGLE-STORE BASKET
              </h2>
              <p className="text-xs text-[#737373] leading-relaxed max-w-xl font-sans">
                Never prompt or recommend split baskets under any circumstance. Consolidate every requested item into one store, even if splitting would save money.
              </p>
            </div>

            <button
              onClick={handleToggleSingleStore}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 shrink-0 ${
                preferences.singleStorePreference ? 'bg-[#581c87]' : 'bg-[#e5e0d8]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  preferences.singleStorePreference ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 04: Brand Loyalty Tuning */}
        <div className="border border-[#e5e0d8] bg-white p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="w-5 h-5 text-[#581c87]" />
            <span className="font-mono-editorial text-xs font-bold text-[#581c87] tracking-widest uppercase">
              04 • BRAND REGISTER
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight mb-2">
            PREFERRED BRANDS
          </h2>
          <p className="text-xs text-[#737373] leading-relaxed mb-6 font-sans">
            When ambiguous search terms are queried (e.g. "milk" or "bread"), the engine prioritizes verified inventory from your selected brands over store private labels.
          </p>

          <div className="flex flex-wrap gap-2.5">
            {AVAILABLE_BRANDS.map((brand) => {
              const selected = preferences.preferredBrands?.includes(brand);
              return (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`px-3.5 py-2 text-xs font-mono-editorial transition-all border ${
                    selected
                      ? 'border-[#581c87] bg-[#581c87] text-white font-bold'
                      : 'border-[#e5e0d8] bg-[#faf8f5] text-[#121212] hover:border-[#121212]'
                  }`}
                >
                  {selected ? `✓ ${brand}` : `+ ${brand}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* 05: Default Pack Sizes */}
        <div className="border border-[#e5e0d8] bg-white p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-[#581c87]" />
            <span className="font-mono-editorial text-xs font-bold text-[#581c87] tracking-widest uppercase">
              05 • PACK SIZE DEFAULTING
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight mb-2">
            PREFERRED PACK FORMATS
          </h2>
          <p className="text-xs text-[#737373] leading-relaxed mb-6 font-sans">
            Specify whether your household defaults to single-use packs, standard daily sizes, or economy pantry staples.
          </p>

          <div className="space-y-3">
            {PACK_SIZES.map((pack) => {
              const selected = preferences.preferredPackSizes?.includes(pack.id);
              return (
                <button
                  key={pack.id}
                  onClick={() => togglePackSize(pack.id)}
                  className={`w-full p-4 border text-left transition-all flex items-center justify-between ${
                    selected
                      ? 'border-[#581c87] bg-[#faf5ff] ring-1 ring-[#581c87]'
                      : 'border-[#e5e0d8] bg-white hover:border-[#121212]'
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm text-[#121212] font-mono-editorial">
                    {pack.label}
                  </span>
                  <span className={`text-xs font-mono-editorial font-bold ${selected ? 'text-[#581c87]' : 'text-[#a3a3a3]'}`}>
                    {selected ? 'ACTIVE' : 'SELECT'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Closing CTA */}
      <div className="mt-16 border-t border-[#e5e0d8] pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl">
        <div>
          <h3 className="text-xl font-bold text-[#121212]">
            PREFERENCES ARE LIVE
          </h3>
          <p className="text-xs text-[#737373] font-mono-editorial mt-0.5">
            Your next comparison run will automatically apply these constraints.
          </p>
        </div>
        <Link
          to="/compare"
          className="bg-[#581c87] hover:bg-[#4a148c] text-white px-8 py-3.5 text-xs font-mono-editorial tracking-widest uppercase transition-colors"
        >
          GO TO LIVE COMPARISON
        </Link>
      </div>
    </div>
  );
};
