// src/components/CheckoutModal.tsx — Simulated Checkout Handoff Modal
import React, { useState, useEffect } from 'react';
import { useShopMate } from '../context/ShopMateContext';
import { PLATFORMS } from '../data/platforms';
import { X, ExternalLink, Check, Loader2 } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutModalOpen, setCheckoutModalOpen, checkoutPlatform, comparison, basket } = useShopMate();
  const [injecting, setInjecting] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const platform = PLATFORMS[checkoutPlatform] || PLATFORMS.blinkit;
  const platformResult = comparison.results[checkoutPlatform] || comparison.recommended;
  const totalUnits = basket.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (isCheckoutModalOpen) {
      setInjecting(false);
      setProgressIndex(0);
      setIsCompleted(false);
    }
  }, [isCheckoutModalOpen]);

  if (!isCheckoutModalOpen) return null;

  const handleSimulateHandoff = () => {
    setInjecting(true);
    let current = 0;
    const itemsCount = platformResult.itemDetails.length;

    const interval = setInterval(() => {
      current++;
      setProgressIndex(current);
      if (current >= itemsCount) {
        clearInterval(interval);
        setTimeout(() => {
          setInjecting(false);
          setIsCompleted(true);
        }, 400);
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#121212]/50 backdrop-blur-xs transition-opacity"
        onClick={() => !injecting && setCheckoutModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#faf8f5] rounded-3xl border border-[#ded9cb] p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#e5e2da]">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: platform.color }}
            />
            <span className="text-xs font-mono-editorial font-bold uppercase tracking-wider text-[#78766f]">
              PLATFORM HANDOFF
            </span>
          </div>
          <button
            onClick={() => !injecting && setCheckoutModalOpen(false)}
            className="p-1 rounded-lg text-[#78766f] hover:text-[#121212]"
            disabled={injecting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4">
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#121212]">
            Ready to continue?
          </h3>
          <p className="text-sm text-[#5a5852] leading-relaxed">
            You are about to transfer your verified basket to <strong>{platform.name}</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-white border border-[#e5e2da] space-y-2">
            <div className="flex justify-between items-center text-xs font-mono-editorial text-[#78766f]">
              <span>TOTAL ITEMS</span>
              <span className="font-bold text-[#121212]">{totalUnits} units ({platformResult.itemDetails.length} products)</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono-editorial text-[#78766f]">
              <span>ESTIMATED DELIVERY</span>
              <span className="font-bold text-[#121212]">~{platform.defaultEtaMinutes} mins</span>
            </div>
            <div className="pt-2 border-t border-[#edeae1] flex justify-between items-baseline">
              <span className="font-bold text-xs uppercase text-[#121212]">Estimated Total</span>
              <span className="font-display text-2xl font-black font-mono-editorial text-purple-950">
                ₹{platformResult.effectiveTotal}
              </span>
            </div>
          </div>

          {/* Item transfer simulation visualizer */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono-editorial uppercase text-[#78766f] flex justify-between">
              <span>BASKET PAYLOAD</span>
              <span>{progressIndex}/{platformResult.itemDetails.length} Transferred</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-[#f5f3ee] border border-[#e5e2da]">
              {platformResult.itemDetails.map((it, idx) => {
                const isTransferred = idx < progressIndex || isCompleted;
                return (
                  <div
                    key={it.productId}
                    className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                      isTransferred ? 'bg-white text-[#121212] shadow-2xs' : 'text-[#78766f]'
                    }`}
                  >
                    <span className="truncate">{it.name} × {it.quantity}</span>
                    {isTransferred ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#ded9cb]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-[#78766f] text-center italic">
            Prototype demo simulation. In production, this deep-links directly to the {platform.name} mobile app cart.
          </p>
        </div>

        <div className="pt-4 border-t border-[#e5e2da] flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setCheckoutModalOpen(false)}
            className="flex-1 py-3 px-4 rounded-xl border border-[#ded9cb] hover:bg-[#edeae1] text-xs font-mono-editorial uppercase font-bold text-[#4a4944] transition-colors"
            disabled={injecting}
          >
            Keep Comparing
          </button>

          {!isCompleted ? (
            <button
              onClick={handleSimulateHandoff}
              disabled={injecting}
              className="flex-1 py-3 px-4 rounded-xl bg-purple-950 hover:bg-purple-900 text-white text-xs font-mono-editorial uppercase font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              {injecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transferring Cart...</span>
                </>
              ) : (
                <>
                  <span>Open {platform.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-mono-editorial uppercase font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Cart Ready on {platform.name}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
