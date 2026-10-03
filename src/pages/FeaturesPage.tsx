import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { ChapterHeader } from '../components/ChapterHeader';
import { DataStatusBadge } from '../components/DataStatusBadge';

interface FeatureItem {
  id: string;
  num: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  visualType: 'basket' | 'cost' | 'location' | 'split' | 'history' | 'preferences';
}

const FEATURES: FeatureItem[] = [
  {
    id: 'f-1',
    num: '01',
    title: 'SMART BASKET',
    tagline: 'Build your manifest once. Compare across four platforms.',
    description:
      'Unlike single-product price check extensions, ShopMate treats your entire grocery shopping list as a unified transaction. We normalize barcodes, unit sizes (ml, g, kg), and brand registries to build an identical cart on Blinkit, Zepto, Instamart, and JioMart.',
    tags: ['Multi-Item Normalization', 'Zero Platform Bias', 'SKU Equivalence'],
    visualType: 'basket'
  },
  {
    id: 'f-2',
    num: '02',
    title: 'TRUE COST ENGINE',
    tagline: 'Item prices are not the total. We calculate the math.',
    description:
      'A platform that sells milk for ₹1 cheaper is actually ₹20 more expensive if it charges a ₹25 small cart fee or ₹15 rain surge. Our True Cost equation evaluates: Items − Promos + Delivery Fee + Platform Handling + Surge. No hidden fees at final checkout.',
    tags: ['Small-Cart Thresholds', 'Surge Fee Transparency', 'Zero Hidden Numbers'],
    visualType: 'cost'
  },
  {
    id: 'f-3',
    num: '03',
    title: 'LOCATION AWARE',
    tagline: 'Hyperlocal inventory mapped to your exact delivery pincode.',
    description:
      'Quick-commerce doesn’t deliver from regional distribution centers; it delivers from dark stores within 2 km of your door. ShopMate queries hyperlocal micro-hubs in Ahmedabad, Bengaluru, Mumbai, Delhi, and Pune for precise live inventory counts.',
    tags: ['Dark Store Telemetry', 'Pincode Parity', 'Real-Time Stock'],
    visualType: 'location'
  },
  {
    id: 'f-4',
    num: '04',
    title: 'SMART BASKET SPLIT',
    tagline: 'Sometimes the best basket is split between two apps.',
    description:
      'If Blinkit has cheaper pantry staples and Zepto has cheaper dairy, splitting your order can save ₹30 to ₹90 even after paying two separate delivery fees. Our deterministic split engine calculates net savings and explicitly surfaces the 2-delivery tradeoff.',
    tags: ['Dual-Cart Optimization', 'Net Fee Reconciliation', 'Tradeoff Transparency'],
    visualType: 'split'
  },
  {
    id: 'f-5',
    num: '05',
    title: 'PRICE HISTORY',
    tagline: 'Surveillance on transient price drops and off-peak discounts.',
    description:
      'Quick-commerce platforms change prices dynamically throughout the day. ShopMate logs 7-day illustrative trends, highlighting peak vs off-peak pricing and alerting you when high-ticket pantry essentials drop below your threshold.',
    tags: ['Dynamic Rate Audits', '7-Day Trend Sparklines', 'Autonomous Alerts'],
    visualType: 'history'
  },
  {
    id: 'f-6',
    num: '06',
    title: 'PERSONALIZED SHOPPING',
    tagline: 'The decision engine learns how you shop.',
    description:
      'Set hard constraints: prefer 10-minute maximum delivery over ₹10 savings, specify default pack sizes (e.g. 500 ml over 1 L), set minimum split thresholds, or enforce single-store simplicity. ShopMate shapes its recommendations around your priorities.',
    tags: ['User-Tuned Rules', 'ETA Constraints', 'Local Persistence'],
    visualType: 'preferences'
  }
];

export const FeaturesPage: React.FC = () => {
  const activeSplitSavings = 34;

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#e5e0d8] pb-12 mb-16">
        <ChapterHeader
          rubric="ENGINE CAPABILITIES"
          title={<>SYSTEM<br />FEATURES.</>}
          subtitle="Six foundational innovations that make ShopMate a true shopping decision engine rather than a static price comparison table."
        />
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#f0ece4]">
          <span className="font-mono-editorial text-xs text-[#737373]">
            STACKED FEATURE ARCHITECTURE • SCROLL PROGRESSION
          </span>
          <DataStatusBadge />
        </div>
      </div>

      {/* Stacked Sticky Feature Panels Container */}
      <div className="space-y-12 sm:space-y-16 relative">
        {FEATURES.map((feature, idx) => {
          // Staggered sticky top offsets for card stacking
          const stickyTopClass = idx === 0 ? 'top-24' : idx === 1 ? 'top-28' : idx === 2 ? 'top-32' : idx === 3 ? 'top-36' : idx === 4 ? 'top-40' : 'top-44';

          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              style={{ zIndex: 10 + idx }}
              className={`sticky ${stickyTopClass} bg-white border border-[#121212] p-8 sm:p-14 shadow-2xl transition-all duration-300`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left side: Editorial Typography & Copy */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="font-mono-editorial text-4xl sm:text-5xl font-black text-[#581c87]">
                      {feature.num}
                    </span>
                    <span className="h-6 w-px bg-[#e5e0d8]" />
                    <span className="font-mono-editorial text-xs tracking-widest text-[#737373] uppercase font-bold">
                      CORE SUBSYSTEM
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-black text-[#121212] tracking-tight leading-[0.95]">
                    {feature.title}
                  </h2>

                  <div className="text-base sm:text-lg font-serif italic text-[#525252]">
                    "{feature.tagline}"
                  </div>

                  <p className="text-sm sm:text-base text-[#404040] font-sans leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {feature.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono-editorial px-2.5 py-1 bg-[#faf8f5] border border-[#e5e0d8] text-[#121212]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side: Interactive Mini UI Visual */}
                <div className="lg:col-span-5 bg-[#faf8f5] border border-[#e5e0d8] p-6 sm:p-8">
                  {feature.visualType === 'basket' && (
                    <div className="space-y-3 font-mono-editorial text-xs">
                      <div className="text-[10px] text-[#581c87] font-bold uppercase tracking-wider mb-2">
                        NORMALIZATION ENGINE DEMO
                      </div>
                      <div className="p-3 bg-white border border-[#e5e0d8] flex justify-between items-center">
                        <span>Amul Taaza (500 ml)</span>
                        <span className="text-[#15803d] font-bold">MATCH 100%</span>
                      </div>
                      <div className="p-3 bg-white border border-[#e5e0d8] flex justify-between items-center">
                        <span>Diet Coke Can (300 ml)</span>
                        <span className="text-[#15803d] font-bold">MATCH 98%</span>
                      </div>
                      <div className="p-3 bg-white border border-[#e5e0d8] flex justify-between items-center">
                        <span>Aashirvaad Atta (5 kg)</span>
                        <span className="text-[#15803d] font-bold">MATCH 100%</span>
                      </div>
                      <div className="text-[10px] text-[#737373] text-center pt-2">
                        Cross-referenced against 4 dark store catalogs
                      </div>
                    </div>
                  )}

                  {feature.visualType === 'cost' && (
                    <div className="space-y-2 font-mono-editorial text-xs">
                      <div className="text-[10px] text-[#581c87] font-bold uppercase tracking-wider mb-2">
                        TRUE COST EQUATION
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#e5e0d8]">
                        <span>GROCERY ITEMS SUBTOTAL</span>
                        <span className="font-bold text-[#121212]">₹390</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#e5e0d8] text-[#15803d]">
                        <span>STORE DISCOUNTS</span>
                        <span className="font-bold">−₹30</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#e5e0d8] text-[#737373]">
                        <span>RIDER DELIVERY FEE</span>
                        <span>+₹15</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#e5e0d8] text-[#737373]">
                        <span>PLATFORM HANDLING SURCHARGE</span>
                        <span>+₹5</span>
                      </div>
                      <div className="flex justify-between py-2 text-base font-black text-[#581c87] pt-3">
                        <span>TRUE NET TOTAL</span>
                        <span>= ₹380</span>
                      </div>
                    </div>
                  )}

                  {feature.visualType === 'location' && (
                    <div className="space-y-3 font-mono-editorial text-xs">
                      <div className="text-[10px] text-[#581c87] font-bold uppercase tracking-wider mb-2">
                        ACTIVE DELIVERY MICRO-HUBS
                      </div>
                      <div className="p-2.5 bg-white border border-[#581c87] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#581c87]" />
                          <span className="font-bold text-[#121212]">Ahmedabad (380015)</span>
                        </div>
                        <span className="text-[10px] text-[#15803d] font-bold">4 HUBS ONLINE</span>
                      </div>
                      <div className="p-2.5 bg-white border border-[#e5e0d8] flex items-center justify-between text-[#737373]">
                        <span>Bengaluru (560001)</span>
                        <span className="text-[10px]">4 HUBS</span>
                      </div>
                      <div className="p-2.5 bg-white border border-[#e5e0d8] flex items-center justify-between text-[#737373]">
                        <span>Mumbai (400001)</span>
                        <span className="text-[10px]">4 HUBS</span>
                      </div>
                    </div>
                  )}

                  {feature.visualType === 'split' && (
                    <div className="space-y-3 font-mono-editorial text-xs">
                      <div className="text-[10px] text-[#581c87] font-bold uppercase tracking-wider mb-2">
                        DUAL-STORE SPLIT AUDIT
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-white p-3 border border-[#e5e0d8]">
                          <div className="text-[10px] text-[#737373]">BLINKIT (4)</div>
                          <div className="text-base font-bold text-[#121212]">₹290</div>
                        </div>
                        <div className="bg-white p-3 border border-[#e5e0d8]">
                          <div className="text-[10px] text-[#737373]">ZEPTO (2)</div>
                          <div className="text-base font-bold text-[#121212]">₹122</div>
                        </div>
                      </div>
                      <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] text-center">
                        <div className="text-[10px] text-[#15803d] font-bold uppercase">NET SAVINGS AFTER DUAL DELIVERY</div>
                        <div className="text-xl font-black text-[#15803d]">₹{activeSplitSavings} CHEAPER</div>
                      </div>
                      <div className="text-[10px] text-[#737373] text-center italic">
                        Tradeoff: 2 riders arrive separately
                      </div>
                    </div>
                  )}

                  {feature.visualType === 'history' && (
                    <div className="space-y-3 font-mono-editorial text-xs">
                      <div className="text-[10px] text-[#581c87] font-bold uppercase tracking-wider mb-2">
                        SURVEILLANCE TIMELINE
                      </div>
                      <div className="p-3 bg-white border border-[#e5e0d8] flex justify-between items-center">
                        <span>Today (Peak 8 PM)</span>
                        <span className="font-bold text-[#dc2626]">₹45 (+₹5 surge)</span>
                      </div>
                      <div className="p-3 bg-white border border-[#e5e0d8] flex justify-between items-center">
                        <span>Yesterday (Off-Peak)</span>
                        <span className="font-bold text-[#15803d]">₹40 (Best)</span>
                      </div>
                      <div className="p-3 bg-white border border-[#e5e0d8] flex justify-between items-center">
                        <span>7 Days Ago</span>
                        <span className="font-bold text-[#737373]">₹47</span>
                      </div>
                    </div>
                  )}

                  {feature.visualType === 'preferences' && (
                    <div className="space-y-3 font-mono-editorial text-xs">
                      <div className="text-[10px] text-[#581c87] font-bold uppercase tracking-wider mb-2">
                        AUTONOMOUS HEURISTICS
                      </div>
                      <div className="p-2.5 bg-white border border-[#e5e0d8] flex justify-between items-center">
                        <span>Max Delivery Window</span>
                        <span className="font-bold text-[#581c87]">15 MIN</span>
                      </div>
                      <div className="p-2.5 bg-white border border-[#e5e0d8] flex justify-between items-center">
                        <span>Min Split Threshold</span>
                        <span className="font-bold text-[#581c87]">₹30 SAVINGS</span>
                      </div>
                      <div className="p-2.5 bg-white border border-[#e5e0d8] flex justify-between items-center">
                        <span>Single Store Bias</span>
                        <span className="font-bold text-[#121212]">OFF</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Editorial Bottom Navigation */}
      <div className="mt-28 border-t border-[#e5e0d8] pt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#121212]">
            TEST THE ENGINE LIVE
          </h3>
          <p className="text-xs text-[#737373] font-mono-editorial mt-1">
            Experience these 6 capabilities active on your current grocery list.
          </p>
        </div>
        <Link
          to="/compare"
          className="bg-[#581c87] hover:bg-[#4a148c] text-white px-8 py-4 text-xs font-mono-editorial tracking-widest uppercase transition-colors"
        >
          OPEN BASKET COMPARISON
        </Link>
      </div>
    </div>
  );
};
