import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookmarkPlus,
  Play,
  Trash2,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingDown,
  ShoppingBag
} from 'lucide-react';
import { useShopMate } from '../context/ShopMateContext';
import { ChapterHeader } from '../components/ChapterHeader';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { PLATFORMS } from '../data/platforms';
import type { PlatformId, SavedBasket } from '../types';

export const SavedPage: React.FC = () => {
  const { savedBaskets, loadPreset, deleteSavedBasket, saveCurrentBasket, basket } = useShopMate();
  const navigate = useNavigate();
  const [newBasketName, setNewBasketName] = useState('');
  const [isSavingCurrent, setIsSavingCurrent] = useState(false);

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBasketName.trim()) return;
    saveCurrentBasket(newBasketName.trim());
    setNewBasketName('');
    setIsSavingCurrent(false);
  };

  const handleLoadAndCompare = (basketId: string) => {
    loadPreset(basketId);
    navigate('/compare');
  };

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#e5e0d8] pb-12 mb-12">
        <ChapterHeader
          rubric="CHPT. 05 — RECURRENCE"
          title={<>THE<br />BASKETS<br />YOU RETURN<br />TO.</>}
          subtitle="Recurring shopping lists saved for zero-friction re-comparison. Quick-commerce pricing changes every 4 hours; your basket shouldn't have to be rebuilt from scratch."
        />

        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-[#f0ece4]">
          <div className="flex items-center gap-6 text-xs font-mono-editorial text-[#737373]">
            <div>
              <span className="text-[#121212] font-bold text-base">{savedBaskets.length}</span> SAVED MANIFESTS
            </div>
            <div className="h-4 w-px bg-[#e5e0d8]" />
            <div>
              AVG SAVINGS: <span className="text-[#15803d] font-bold text-base">₹38 / RUN</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DataStatusBadge />
            {basket.length > 0 && (
              <button
                onClick={() => setIsSavingCurrent(!isSavingCurrent)}
                className="inline-flex items-center gap-1.5 text-xs font-mono-editorial px-3 py-1.5 bg-[#581c87] hover:bg-[#4a148c] text-white transition-colors"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                SAVE ACTIVE BASKET ({basket.length})
              </button>
            )}
          </div>
        </div>

        {/* Save Current Inline Drawer */}
        {isSavingCurrent && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleSaveCurrent}
            className="mt-6 p-4 border border-[#581c87] bg-[#faf5ff] flex flex-wrap items-center gap-3"
          >
            <span className="font-mono-editorial text-xs font-bold text-[#581c87] uppercase">
              NAME THIS RECURRING LIST:
            </span>
            <input
              type="text"
              placeholder="e.g. Sunday Breakfast Pantry"
              value={newBasketName}
              onChange={(e) => setNewBasketName(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono-editorial border border-[#d8b4fe] bg-white flex-1 min-w-[200px] outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#581c87] text-white px-4 py-1.5 text-xs font-mono-editorial uppercase font-bold hover:bg-[#4a148c]"
            >
              SAVE MANIFEST
            </button>
            <button
              type="button"
              onClick={() => setIsSavingCurrent(false)}
              className="text-xs font-mono-editorial text-[#737373] hover:text-[#121212]"
            >
              CANCEL
            </button>
          </motion.form>
        )}
      </div>

      {/* Saved Baskets Editorial List */}
      {savedBaskets.length === 0 ? (
        <div className="border border-[#e5e0d8] bg-[#fbfaf8] p-16 text-center my-12">
          <ShoppingBag className="w-12 h-12 text-[#a3a3a3] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#121212] mb-2">NO SAVED BASKETS YET</h2>
          <p className="text-xs text-[#737373] max-w-sm mx-auto mb-6">
            Build a basket on the comparison engine and save it to track fluctuating delivery surge and bundle discounts over time.
          </p>
          <button
            onClick={() => navigate('/compare')}
            className="bg-[#581c87] text-white px-6 py-3 text-xs font-mono-editorial uppercase tracking-wider"
          >
            START COMPARING
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {savedBaskets.map((sb: SavedBasket, idx: number) => {
            const platformKey = (sb.lastBestPlatform?.toLowerCase() || 'blinkit') as PlatformId;
            const platform = PLATFORMS[platformKey] || PLATFORMS['blinkit'];
            const formattedIndex = String(idx + 1).padStart(2, '0');

            return (
              <motion.div
                key={sb.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="border border-[#e5e0d8] bg-white hover:border-[#121212] transition-all p-6 sm:p-10 group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Number & Name */}
                  <div className="lg:col-span-4 flex items-start gap-5">
                    <span className="font-mono-editorial text-4xl sm:text-5xl font-black text-[#e5e0d8] group-hover:text-[#581c87] transition-colors">
                      {formattedIndex}
                    </span>
                    <div>
                      <div className="text-[10px] font-mono-editorial text-[#737373] tracking-widest uppercase mb-1 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" />
                        {sb.itemCount} UNIQUE ITEMS
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight group-hover:text-[#581c87] transition-colors">
                        {sb.title}
                      </h2>
                      <div className="flex items-center gap-2 text-[11px] font-mono-editorial text-[#a3a3a3] mt-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>LAST RUN {sb.lastComparedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Savings Rubrics */}
                  <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-4 border-y sm:border-y-0 sm:border-x border-[#f0ede6] py-4 sm:py-0 sm:px-6">
                    <div>
                      <div className="text-[10px] font-mono-editorial text-[#737373] uppercase mb-1">
                        PREV BEST APP
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: platform.color }}
                        />
                        <span className="font-bold text-sm text-[#121212] font-mono-editorial">
                          {platform.name}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono-editorial text-[#737373] mt-0.5">
                        {platform.defaultEtaMinutes} MIN ETA
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono-editorial text-[#737373] uppercase mb-1">
                        PREV TOTAL
                      </div>
                      <div className="text-2xl font-black font-mono-editorial text-[#121212]">
                        ₹{sb.lastBestPrice}
                      </div>
                      <div className="text-[10px] font-mono-editorial text-[#a3a3a3]">
                        ALL FEES INCL.
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-[10px] font-mono-editorial text-[#15803d] uppercase mb-1 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        EST. SAVING
                      </div>
                      <div className="text-2xl font-black font-mono-editorial text-[#15803d]">
                        ₹{sb.estimatedSaving}
                      </div>
                      <div className="text-[10px] font-mono-editorial text-[#737373]">
                        VS 2ND BEST
                      </div>
                    </div>
                  </div>

                  {/* Actions CTA */}
                  <div className="lg:col-span-3 flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleLoadAndCompare(sb.id)}
                      className="flex-1 bg-[#121212] hover:bg-[#581c87] text-white py-3.5 px-5 text-xs font-mono-editorial tracking-wider uppercase flex items-center justify-center gap-2 transition-colors group/btn"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>COMPARE AGAIN</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                    <button
                      onClick={() => deleteSavedBasket(sb.id)}
                      className="p-3.5 border border-[#e5e0d8] hover:border-[#dc2626] hover:text-[#dc2626] text-[#a3a3a3] transition-colors"
                      title="Delete saved basket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Editorial Explanatory Footer */}
      <div className="mt-16 border-t border-[#e5e0d8] pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#737373]">
        <div>
          <h4 className="font-mono-editorial text-[11px] text-[#121212] font-bold uppercase mb-2">
            WHY PRICES VARY ACROSS SESSIONS
          </h4>
          <p className="leading-relaxed">
            Quick-commerce platforms rely on dynamic micro-warehousing. Stock levels change in real time, shifting delivery fees and small-cart thresholds. Comparing your saved list re-evaluates all 4 platforms with current dark store data.
          </p>
        </div>
        <div>
          <h4 className="font-mono-editorial text-[11px] text-[#121212] font-bold uppercase mb-2">
            DETERMINISTIC RETRIEVAL
          </h4>
          <p className="leading-relaxed">
            All saved baskets are stored privately in your browser's local state. No personal shopping lists or habits are uploaded to remote marketing trackers.
          </p>
        </div>
      </div>
    </div>
  );
};
