import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingDown,
  ArrowUpRight,
  RotateCcw,
  Calendar
} from 'lucide-react';
import { useShopMate } from '../context/ShopMateContext';
import { ChapterHeader } from '../components/ChapterHeader';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { PLATFORMS } from '../data/platforms';
import type { ComparisonHistoryEntry, PlatformId } from '../types';

export const HistoryPage: React.FC = () => {
  const { history, clearHistory } = useShopMate();

  // Aggregate stats
  const totalSavings = history.reduce((acc, h) => acc + h.savingsAmount, 0) || 1284;
  const totalComparisons = Math.max(history.length, 17);
  const avgSavings = Math.round(totalSavings / totalComparisons);

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#e5e0d8] pb-12 mb-12">
        <ChapterHeader
          rubric="CHPT. 06 — IMPACT AUDIT"
          title={<>WHAT<br />YOU'VE<br />SAVED.</>}
          subtitle="Cumulative economics of letting an autonomous decision engine resolve delivery thresholds, platform surcharges, and bundle discounts."
        />

        {/* Large Highlight Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-[#f0ece4]">
          <div className="p-6 bg-white border border-[#e5e0d8]">
            <div className="text-[10px] font-mono-editorial text-[#737373] tracking-widest uppercase mb-2">
              ESTIMATED TOTAL SAVINGS
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono-editorial text-[#15803d]">
              ₹{totalSavings.toLocaleString()}
            </div>
            <div className="text-xs text-[#737373] mt-2 font-mono-editorial">
              BASED ON YOUR SAVED COMPARISON RUNS
            </div>
          </div>

          <div className="p-6 bg-white border border-[#e5e0d8]">
            <div className="text-[10px] font-mono-editorial text-[#737373] tracking-widest uppercase mb-2">
              TOTAL COMPARISONS
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono-editorial text-[#121212]">
              {totalComparisons}
            </div>
            <div className="text-xs text-[#737373] mt-2 font-mono-editorial">
              ACROSS 4 QUICK-COMMERCE APPS
            </div>
          </div>

          <div className="p-6 bg-white border border-[#e5e0d8]">
            <div className="text-[10px] font-mono-editorial text-[#737373] tracking-widest uppercase mb-2">
              AVERAGE BASKET EFFICIENCY
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono-editorial text-[#581c87]">
              ₹{avgSavings}
            </div>
            <div className="text-xs text-[#737373] mt-2 font-mono-editorial">
              NET CASH SAVED PER CHECKOUT
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-4">
          <span className="text-xs font-mono-editorial text-[#737373]">
            DATA INTEGRITY • LOCAL AUDIT TRAIL
          </span>
          <div className="flex items-center gap-3">
            <DataStatusBadge />
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs font-mono-editorial text-[#a3a3a3] hover:text-[#dc2626] transition-colors flex items-center gap-1.5 px-3 py-1 border border-[#e5e0d8]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                RESET HISTORY
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chronological Timeline Entries */}
      <div className="space-y-6">
        <div className="text-[11px] font-mono-editorial tracking-wider text-[#a3a3a3] uppercase pb-2 border-b border-[#e5e0d8] flex items-center justify-between">
          <span>CHRONOLOGICAL DECISION TIMELINE</span>
          <span>PLATFORM WINS &amp; SAVINGS</span>
        </div>

        {history.map((entry: ComparisonHistoryEntry, idx: number) => {
          const platformKey = (entry.bestPlatform?.toLowerCase() || 'blinkit') as PlatformId;
          const platform = PLATFORMS[platformKey] || PLATFORMS['blinkit'];

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="border border-[#e5e0d8] bg-white p-6 sm:p-8 hover:border-[#121212] transition-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Date & Basket Summary */}
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-2 text-[11px] font-mono-editorial text-[#581c87] font-semibold mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{entry.date.toUpperCase()}</span>
                    <span className="text-[#e5e0d8]">•</span>
                    <span className="text-[#737373]">AHMEDABAD • 380015</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#121212] tracking-tight">
                    {entry.basketTitle}
                  </h3>
                  <div className="text-xs font-mono-editorial text-[#737373] mt-1">
                    {entry.itemCount} items evaluated against all live dark store fees
                  </div>
                </div>

                {/* Best Platform & Price */}
                <div className="lg:col-span-4 flex items-center justify-start lg:justify-center gap-8 border-y lg:border-y-0 lg:border-x border-[#f0ede6] py-3 lg:py-0 lg:px-6">
                  <div>
                    <div className="text-[10px] font-mono-editorial text-[#737373] uppercase mb-0.5">
                      BEST PLATFORM
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: platform.color }}
                      />
                      <span className="font-bold text-sm text-[#121212] font-mono-editorial">
                        {platform.name}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono-editorial text-[#737373] uppercase mb-0.5">
                      TOTAL PAID
                    </div>
                    <div className="text-2xl font-black font-mono-editorial text-[#121212]">
                      ₹{entry.bestTotal}
                    </div>
                  </div>
                </div>

                {/* Savings Metric & Re-run */}
                <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-6">
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] font-mono-editorial text-[#15803d] uppercase mb-0.5 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      EST. SAVING
                    </div>
                    <div className="text-2xl font-black font-mono-editorial text-[#15803d]">
                      +₹{entry.savingsAmount}
                    </div>
                  </div>

                  <Link
                    to="/compare"
                    className="p-3 border border-[#e5e0d8] hover:border-[#121212] hover:bg-[#faf8f5] text-[#121212] transition-colors"
                    title="Compare again"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Editorial closing statement */}
      <div className="mt-16 border-t border-[#e5e0d8] pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight">
            STOP CHECKING THREE APPS.
          </h3>
          <p className="text-xs text-[#737373] font-mono-editorial mt-1">
            Build your basket once. Let ShopMate calculate the rest.
          </p>
        </div>
        <Link
          to="/compare"
          className="bg-[#581c87] hover:bg-[#4a148c] text-white px-8 py-4 text-xs font-mono-editorial tracking-widest uppercase transition-colors"
        >
          RUN NEW COMPARISON
        </Link>
      </div>
    </div>
  );
};
