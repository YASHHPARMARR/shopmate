import React from 'react';
import { Link } from 'react-router-dom';
import { DataStatusBadge } from './DataStatusBadge';
import { useShopMate } from '../context/ShopMateContext';

export const Footer: React.FC = () => {
  const { comparison, apiKey } = useShopMate();

  return (
    <footer className="border-t border-[#e5e2da] bg-[#f5f3ee] text-[#121212] pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#ded9cb]">
          {/* Col 1: Identity & Mission */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-display text-2xl font-black tracking-tighter block">
              SHOPMATE
            </span>
            <p className="text-xs font-mono-editorial uppercase tracking-widest text-purple-900 font-bold">
              ONE BASKET. EVERY APP. BEST PRICE.
            </p>
            <p className="text-sm text-[#5a5852] max-w-sm leading-relaxed">
              An editorial decision engine designed to eliminate grocery price fragmentation across Indian quick-commerce platforms.
            </p>
            <div className="pt-2">
              <DataStatusBadge status={comparison.dataStatus} timestamp={apiKey ? 'LIVE DARK STORE FEED' : 'PROTOTYPE BUILD 2026.10'} />
            </div>
          </div>

          {/* Col 2: Chapter Index */}
          <div className="md:col-span-4 space-y-3 font-mono-editorial text-xs">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#78766f]">
              CHAPTER INDEX
            </div>
            <ul className="space-y-2 uppercase text-[#4a4944]">
              <li><Link to="/#ch-problem" className="hover:text-purple-900 transition-colors">CHPT. 01 — Quick commerce is fast. Comparison isn't.</Link></li>
              <li><Link to="/#ch-shift" className="hover:text-purple-900 transition-colors">CHPT. 02 — Stop comparing products. Compare the basket.</Link></li>
              <li><Link to="/#ch-engine" className="hover:text-purple-900 transition-colors">CHPT. 03 — Price isn't the total.</Link></li>
              <li><Link to="/#ch-decision" className="hover:text-purple-900 transition-colors">CHPT. 04 — Three apps. One decision.</Link></li>
              <li><Link to="/#ch-split" className="hover:text-purple-900 transition-colors">CHPT. 05 — Sometimes the best basket is two orders.</Link></li>
              <li><Link to="/#ch-learn" className="hover:text-purple-900 transition-colors">CHPT. 06 — ShopMate learns how you shop.</Link></li>
            </ul>
          </div>

          {/* Col 3: Architecture & Routing */}
          <div className="md:col-span-3 space-y-3 font-mono-editorial text-xs">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#78766f]">
              APPLICATION ROUTES
            </div>
            <ul className="space-y-2 uppercase text-[#4a4944]">
              <li><Link to="/compare" className="hover:text-purple-900 transition-colors font-bold text-[#121212]">/compare — Live Comparison</Link></li>
              <li><Link to="/basket" className="hover:text-purple-900 transition-colors">/basket — Basket Builder</Link></li>
              <li><Link to="/saved" className="hover:text-purple-900 transition-colors">/saved — Saved Baskets</Link></li>
              <li><Link to="/history" className="hover:text-purple-900 transition-colors">/history — Savings History</Link></li>
              <li><Link to="/alerts" className="hover:text-purple-900 transition-colors">/alerts — Price Alerts</Link></li>
              <li><Link to="/features" className="hover:text-purple-900 transition-colors">/features — Feature Stack</Link></li>
              <li><Link to="/how-it-works" className="hover:text-purple-900 transition-colors">/how-it-works — Methodology</Link></li>
              <li><Link to="/preferences" className="hover:text-purple-900 transition-colors">/preferences — Customization</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono-editorial text-[#78766f]">
          <p>
            © 2026 ShopMate Decision Technologies. Experimental prototype inspired by editorial interaction design.
          </p>
          <div className="flex items-center gap-6">
            <span>BLINKIT</span>
            <span>ZEPTO</span>
            <span>INSTAMART</span>
            <span>JIOMART</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
