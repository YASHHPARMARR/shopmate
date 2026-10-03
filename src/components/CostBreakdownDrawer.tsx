// src/components/CostBreakdownDrawer.tsx — Transparent Mathematical Breakdown Drawer
import React from 'react';
import { useShopMate } from '../context/ShopMateContext';
import { X, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { DataStatusBadge } from './DataStatusBadge';

export const CostBreakdownDrawer: React.FC = () => {
  const { isWhyDrawerOpen, setWhyDrawerOpen, comparison, openCheckout } = useShopMate();

  if (!isWhyDrawerOpen) return null;

  const winner = comparison.recommended;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#121212]/40 backdrop-blur-xs transition-opacity"
        onClick={() => setWhyDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf8f5] shadow-2xl border-l border-[#e5e2da] p-6 sm:p-8 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#e5e2da]">
            <div>
              <div className="text-[10px] font-mono-editorial uppercase tracking-widest text-purple-900 font-bold mb-1">
                CALCULATION PROVENANCE
              </div>
              <h3 className="font-display text-2xl font-extrabold text-[#121212] uppercase tracking-tight">
                Why {winner.platformName}?
              </h3>
            </div>
            <button
              onClick={() => setWhyDrawerOpen(false)}
              className="p-2 rounded-lg text-[#78766f] hover:text-[#121212] hover:bg-[#edeae1] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Explanation Banner */}
          <div className="my-6 p-4 rounded-xl bg-purple-50/70 border border-purple-200/60">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-900 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono-editorial font-bold uppercase tracking-wider text-purple-950 mb-1">
                  DETERMINISTIC VERIFICATION
                </div>
                <p className="text-xs text-purple-950/80 leading-relaxed">
                  {comparison.recommendationExplanation}
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Equation */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between text-xs font-mono-editorial text-[#78766f] uppercase pb-2 border-b border-[#e5e2da]">
              <span>COMPONENT</span>
              <span>CALCULATION</span>
            </div>

            <div className="flex justify-between items-center text-sm py-1">
              <span className="text-[#4a4944]">Item Subtotal ({winner.itemDetails.length} items)</span>
              <span className="font-mono-editorial font-bold text-[#121212]">₹{winner.itemsSubtotal}</span>
            </div>

            {winner.discount > 0 && (
              <div className="flex justify-between items-center text-sm py-1 text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <span>Discounts & Promotions</span>
                  <span className="text-[10px] font-mono-editorial px-1.5 py-0.2 rounded bg-emerald-100">
                    {winner.discountLabel}
                  </span>
                </span>
                <span className="font-mono-editorial font-bold">−₹{winner.discount}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm py-1">
              <span className="text-[#4a4944]">Delivery Fee</span>
              <span className="font-mono-editorial font-bold text-[#121212]">
                {winner.deliveryFee === 0 ? (
                  <span className="text-emerald-700">₹0 (Free delivery threshold met)</span>
                ) : (
                  `+₹${winner.deliveryFee}`
                )}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-1">
              <span className="text-[#4a4944]">Platform & Tech Fee</span>
              <span className="font-mono-editorial font-bold text-[#121212]">+₹{winner.platformFee}</span>
            </div>

            {winner.smallCartFee > 0 && (
              <div className="flex justify-between items-center text-sm py-1 text-amber-800">
                <span>Small Cart Surcharge</span>
                <span className="font-mono-editorial font-bold">+₹{winner.smallCartFee}</span>
              </div>
            )}

            {/* Total Row */}
            <div className="pt-4 border-t-2 border-[#121212] flex justify-between items-baseline">
              <div>
                <span className="font-display font-extrabold text-base text-[#121212] uppercase tracking-tight block">
                  EFFECTIVE TOTAL
                </span>
                <span className="text-[11px] text-[#78766f]">All mandatory fees inclusive</span>
              </div>
              <div className="text-right">
                <span className="font-display text-3xl font-black text-[#121212] font-mono-editorial">
                  ₹{winner.effectiveTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Line Item Availability */}
          <div className="space-y-3 mb-8">
            <div className="text-xs font-mono-editorial font-bold uppercase tracking-wider text-[#78766f]">
              ITEM AVAILABILITY & PRICES
            </div>
            <div className="divide-y divide-[#edeae1] border border-[#e5e2da] rounded-xl overflow-hidden bg-white">
              {winner.itemDetails.map((item) => (
                <div key={item.productId} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                    <span className="font-medium text-[#121212]">{item.name}</span>
                    <span className="text-[#a8a69f]">×{item.quantity}</span>
                  </div>
                  <span className="font-mono-editorial font-bold text-[#121212]">₹{item.lineTotal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-auto pt-6 border-t border-[#e5e2da] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <DataStatusBadge status={comparison.dataStatus} timestamp={comparison.timestamp} />
              <span className="text-[11px] font-mono-editorial text-[#78766f]">ETA: ~{winner.etaMinutes} mins</span>
            </div>

            <button
              onClick={() => {
                setWhyDrawerOpen(false);
                openCheckout(winner.platformId);
              }}
              className="w-full py-3.5 rounded-xl bg-purple-950 text-white font-mono-editorial text-xs font-bold uppercase tracking-wider hover:bg-purple-900 transition-colors flex items-center justify-center gap-2"
            >
              <span>PROCEED TO {winner.platformName.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
