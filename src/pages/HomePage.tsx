import React from 'react';
import { Link } from 'react-router-dom';
import { ChapterHeader } from '../components/ChapterHeader';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { useShopMate } from '../context/ShopMateContext';
import {
  ArrowRight,
  ShoppingBag,
  TrendingDown
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { comparisonMode, setComparisonMode, preferences, updatePreferences, comparison, apiKey } = useShopMate();
  const splitSavingsDemo = 34;

  return (
    <div className="relative overflow-hidden pt-24 pb-20">
      {/* ========================================================
          HERO / CHAPTER 00 — PRELUDE
          ======================================================== */}
      <section id="ch-hero" className="min-h-[92vh] flex flex-col justify-center px-6 md:px-10 max-w-7xl mx-auto py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Oversized Editorial Statement */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-mono-editorial font-bold uppercase tracking-widest text-purple-950 bg-purple-100/60 px-3 py-1 rounded-full border border-purple-200">
                QUICK-COMMERCE DECISION ENGINE
              </span>
              <DataStatusBadge status={comparison.dataStatus} timestamp={apiKey ? 'LIVE DARK STORE FEED' : 'PROTOTYPE STAGE'} />
            </div>

            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-[#121212] leading-[0.92]">
              ONE<br />
              <span className="text-purple-950">BASKET.</span><br />
              EVERY<br />
              APP.<br />
              <span className="text-emerald-800">BEST PRICE.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#5a5852] font-normal max-w-xl leading-relaxed">
              Compare your complete shopping basket across quick-commerce platforms and make one smarter decision.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/compare"
                className="px-7 py-4 rounded-full bg-[#121212] text-[#faf8f5] font-mono-editorial text-xs font-bold uppercase tracking-wider hover:bg-purple-950 transition-all flex items-center gap-2.5 shadow-md hover:scale-[1.02]"
              >
                <span>COMPARE MY BASKET</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#ch-problem"
                className="px-6 py-4 rounded-full border border-[#ded9cb] hover:bg-[#edeae1] font-mono-editorial text-xs font-bold uppercase tracking-wider text-[#4a4944] transition-colors"
              >
                EXPLORE STORY
              </a>
            </div>
          </div>

          {/* Right: Floating Narrative Basket Interface */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#ded9cb] shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[#edeae1] mb-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-purple-900" />
                  <span className="text-xs font-mono-editorial uppercase font-bold text-[#78766f]">
                    NARRATIVE SIMULATOR
                  </span>
                </div>
                <span className="text-[10px] font-mono-editorial font-bold bg-[#f5f3ee] px-2 py-0.5 rounded text-[#5a5852]">
                  LIVE ENGINE
                </span>
              </div>

              {/* Items dropping into basket */}
              <div className="space-y-2 mb-6">
                {[
                  { name: 'Amul Taaza Milk 500ml', emoji: '🥛', blinkit: '₹31', zepto: '₹30', instamart: '₹32', jiomart: '₹31' },
                  { name: 'Diet Coke Can 300ml', emoji: '🥤', blinkit: '₹50', zepto: '₹45', instamart: '₹40', jiomart: '₹44' },
                  { name: 'Maggi 2-Minute 70g', emoji: '🍜', blinkit: '₹15', zepto: '₹15', instamart: '₹14', jiomart: '₹15' },
                  { name: "Lay's Salted Chips 50g", emoji: '🥔', blinkit: '₹20', zepto: '₹19', instamart: '₹20', jiomart: '₹21' }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#faf8f5] border border-[#edeae1] flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium">
                      <span>{item.emoji}</span>
                      <span className="truncate max-w-[140px] sm:max-w-none">{item.name}</span>
                    </span>
                    <span className="text-[11px] font-mono-editorial text-emerald-800 font-bold">
                      {item.zepto} – {item.blinkit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Platform cost summary */}
              <div className="p-4 rounded-2xl bg-[#f5f3ee] border border-[#ded9cb] space-y-2 mb-6">
                <div className="flex justify-between items-center text-xs font-mono-editorial text-[#78766f]">
                  <span>WHOLE BASKET WINNER</span>
                  <span className="text-purple-900 font-bold">BLINKIT</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase">Estimated Total</span>
                  <span className="font-display text-2xl font-black font-mono-editorial text-[#121212]">
                    ₹380
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Saves ₹21 vs Instamart (₹401)</span>
                </div>
              </div>

              <Link
                to="/compare"
                className="w-full py-3 rounded-xl bg-purple-950 text-white font-mono-editorial text-xs font-bold text-center block uppercase tracking-wider hover:bg-purple-900 transition-colors"
              >
                OPEN FULL ENGINE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CHAPTER 01 — THE PROBLEM
          ======================================================== */}
      <section id="ch-problem" className="py-24 md:py-32 border-t border-[#e5e2da] bg-[#f5f3ee]/50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <ChapterHeader
            number="01"
            rubric="THE PROBLEM"
            title={
              <>
                QUICK COMMERCE<br />
                IS FAST.<br />
                <span className="text-purple-950">COMPARISON ISN'T.</span>
              </>
            }
            description="You open three separate apps, search the same six items, try to memorize prices, discover out-of-stock items at checkout, and guess which order total is actually cheaper."
          />

          {/* Horizontal Journey Timeline */}
          <div className="mt-16 overflow-x-auto pb-6 no-scrollbar">
            <div className="flex items-center gap-4 min-w-[900px]">
              {[
                { step: '01', title: 'Open Blinkit', desc: 'Search milk, bread, soda. Note item prices.', icon: '🔍' },
                { step: '02', title: 'Switch to Zepto', desc: 'Repeat searches. Forget Blinkit prices.', icon: '⚡' },
                { step: '03', title: 'Open Instamart', desc: 'Repeat searches. Atta is unavailable.', icon: '📦' },
                { step: '04', title: 'Fee Surprises', desc: 'Platform fee, rain fee, delivery fee added.', icon: '💸' },
                { step: '05', title: 'Cognitive Fatigue', desc: 'Give up and overpay on instinct.', icon: '🤦' }
              ].map((card, i) => (
                <div
                  key={i}
                  className="flex-1 p-6 rounded-2xl bg-white border border-[#ded9cb] shadow-xs space-y-3 relative group hover:border-purple-900 transition-colors"
                >
                  <span className="text-2xl">{card.icon}</span>
                  <div className="text-[11px] font-mono-editorial uppercase font-bold text-[#78766f]">
                    STEP {card.step}
                  </div>
                  <div className="font-display font-bold text-lg text-[#121212]">
                    {card.title}
                  </div>
                  <p className="text-xs text-[#5a5852] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Statement */}
          <div className="mt-16 pt-10 border-t border-[#ded9cb] text-center max-w-3xl mx-auto">
            <blockquote className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#121212]">
              "One basket should be enough."
            </blockquote>
            <p className="text-sm text-[#78766f] font-mono-editorial uppercase tracking-wider mt-3">
              ShopMate unifies the comparison before you place a single order.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          CHAPTER 02 — THE SHIFT
          ======================================================== */}
      <section id="ch-shift" className="py-24 md:py-32 border-t border-[#e5e2da]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <ChapterHeader
            number="02"
            rubric="THE PARADIGM SHIFT"
            title={
              <>
                STOP COMPARING<br />
                PRODUCTS.<br />
                <span className="text-purple-950">COMPARE THE BASKET.</span>
              </>
            }
            description="Looking for the cheapest milk is useless if that app charges ₹25 more for eggs and ₹20 for delivery. We evaluate the entire basket as an indivisible unit."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Flawed item-level paradigm */}
            <div className="p-8 rounded-3xl bg-white border border-red-200 space-y-4">
              <div className="text-xs font-mono-editorial font-bold uppercase tracking-wider text-red-700">
                ✕ CONVENTIONAL FRAGMENTED SHOPPING
              </div>
              <h3 className="font-display text-2xl font-bold text-[#121212]">
                Individual Item Illusion
              </h3>
              <p className="text-xs text-[#5a5852] leading-relaxed">
                App A has ₹2 cheaper milk. App B has ₹4 cheaper chips. You order from App A, but delivery fees and high snack prices wipe out your entire savings.
              </p>
              <div className="p-4 rounded-xl bg-red-50 text-xs font-mono-editorial text-red-900 space-y-1">
                <div>Milk: ₹30 (App A) vs ₹32 (App B)</div>
                <div>Snacks: ₹95 (App A) vs ₹85 (App B)</div>
                <div>Net result: You lost ₹8 while thinking you saved.</div>
              </div>
            </div>

            {/* Whole basket paradigm */}
            <div className="p-8 rounded-3xl bg-purple-50/70 border border-purple-300 space-y-4 shadow-sm">
              <div className="text-xs font-mono-editorial font-bold uppercase tracking-wider text-purple-900">
                ✓ THE SHOPMATE BASKET ENGINE
              </div>
              <h3 className="font-display text-2xl font-bold text-[#121212]">
                Complete Basket Optimization
              </h3>
              <p className="text-xs text-[#5a5852] leading-relaxed">
                ShopMate aggregates every item in your regular grocery run, applies live fee tiers, thresholds, and promos, then crowns the real net winner.
              </p>
              <div className="p-4 rounded-xl bg-white text-xs font-mono-editorial text-purple-950 space-y-1 border border-purple-200">
                <div className="font-bold">Total Effective Formula:</div>
                <div>Items Subtotal − Promos + Delivery Fee + Tech Fee</div>
                <div className="text-emerald-700 font-bold">1 Click Decision across 4 apps.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CHAPTER 03 — THE ENGINE
          ======================================================== */}
      <section id="ch-engine" className="py-24 md:py-32 border-t border-[#e5e2da] bg-[#f5f3ee]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <ChapterHeader
            number="03"
            rubric="TRUE COST ENGINE"
            title={
              <>
                PRICE ISN'T<br />
                <span className="text-purple-950">THE TOTAL.</span>
              </>
            }
            description="Quick-commerce pricing is layered with hidden friction. ShopMate reveals every mathematical component so you never face checkout surprises."
          />

          {/* Interactive Cost Equation */}
          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-white border border-[#ded9cb] shadow-sm max-w-4xl mx-auto">
            <div className="text-xs font-mono-editorial uppercase font-bold text-[#78766f] mb-8 pb-3 border-b border-[#edeae1] flex justify-between">
              <span>TRUE COST BREAKDOWN EQUATION</span>
              <span>VERIFIED MATH</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center items-center font-mono-editorial">
              {/* Items */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#edeae1]">
                <div className="text-[10px] text-[#78766f] uppercase font-bold mb-1">ITEMS</div>
                <div className="font-display text-2xl sm:text-3xl font-black text-[#121212]">₹390</div>
                <div className="text-[10px] text-[#a8a69f] mt-1">5 Products</div>
              </div>

              {/* Minus Promo */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-[10px] text-emerald-800 uppercase font-bold mb-1">DISCOUNT</div>
                <div className="font-display text-2xl sm:text-3xl font-black text-emerald-800">−₹30</div>
                <div className="text-[10px] text-emerald-700 mt-1">Promo Code</div>
              </div>

              {/* Plus Delivery */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#edeae1]">
                <div className="text-[10px] text-[#78766f] uppercase font-bold mb-1">DELIVERY</div>
                <div className="font-display text-2xl sm:text-3xl font-black text-[#121212]">+₹15</div>
                <div className="text-[10px] text-[#a8a69f] mt-1">&lt; ₹399 Tier</div>
              </div>

              {/* Plus Platform Fee */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#edeae1]">
                <div className="text-[10px] text-[#78766f] uppercase font-bold mb-1">TECH FEE</div>
                <div className="font-display text-2xl sm:text-3xl font-black text-[#121212]">+₹5</div>
                <div className="text-[10px] text-[#a8a69f] mt-1">Platform Charge</div>
              </div>

              {/* Equals Total */}
              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-purple-950 text-white shadow-md">
                <div className="text-[10px] text-purple-200 uppercase font-bold mb-1">EFFECTIVE</div>
                <div className="font-display text-2xl sm:text-3xl font-black text-purple-200">₹380</div>
                <div className="text-[10px] text-purple-300 mt-1">Actual Out-Of-Pocket</div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#edeae1] text-center">
              <span className="font-display text-xl font-bold uppercase tracking-tight text-[#121212]">
                "ShopMate shows the math."
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CHAPTER 04 — THE DECISION
          ======================================================== */}
      <section id="ch-decision" className="py-24 md:py-32 border-t border-[#e5e2da]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <ChapterHeader
            number="04"
            rubric="MULTI-PLATFORM ARBITRAGE"
            title={
              <>
                THREE APPS.<br />
                <span className="text-purple-950">ONE DECISION.</span>
              </>
            }
            description="Whether your priority is saving the most rupees, getting emergency supplies in 8 minutes, or balancing price and speed, ShopMate delivers transparent clarity."
          />

          {/* Mode Switcher Pills */}
          <div className="mt-12 flex justify-center">
            <div className="p-1 rounded-full bg-[#edeae1] border border-[#ded9cb] inline-flex gap-1 text-xs font-mono-editorial uppercase font-bold">
              {(['cheapest', 'fastest', 'bestValue'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setComparisonMode(mode)}
                  className={`px-5 py-2 rounded-full transition-all ${
                    comparisonMode === mode
                      ? 'bg-purple-950 text-white shadow-xs'
                      : 'text-[#5a5852] hover:text-[#121212]'
                  }`}
                >
                  {mode === 'cheapest' ? '01 / CHEAPEST' : mode === 'fastest' ? '02 / FASTEST' : '03 / BEST VALUE'}
                </button>
              ))}
            </div>
          </div>

          {/* Platform comparison cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'blinkit', name: 'Blinkit', total: 380, eta: '10 MIN', stock: '5/5 AVAILABLE', highlight: comparisonMode === 'cheapest', reason: 'Lowest complete-basket cost' },
              { id: 'zepto', name: 'Zepto', total: 392, eta: '8 MIN', stock: '5/5 AVAILABLE', highlight: comparisonMode === 'fastest', reason: 'Fastest dispatch time' },
              { id: 'instamart', name: 'Instamart', total: 401, eta: '12 MIN', stock: '5/5 AVAILABLE', highlight: comparisonMode === 'bestValue', reason: 'Verified inventory accuracy' }
            ].map(card => (
              <div
                key={card.id}
                className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                  card.highlight
                    ? 'bg-white border-purple-900 shadow-xl scale-[1.02]'
                    : 'bg-[#faf8f5] border-[#ded9cb] opacity-80'
                }`}
              >
                <div className="flex items-center justify-between pb-4 border-b border-[#edeae1] mb-4">
                  <span className="font-display font-extrabold text-xl text-[#121212] uppercase tracking-tight">
                    {card.name}
                  </span>
                  {card.highlight && (
                    <span className="text-[10px] font-mono-editorial font-bold bg-purple-100 text-purple-950 px-2.5 py-0.5 rounded-full uppercase">
                      RECOMMENDED
                    </span>
                  )}
                </div>

                <div className="font-display text-4xl font-black font-mono-editorial text-[#121212] mb-1">
                  ₹{card.total}
                </div>
                <div className="text-xs font-mono-editorial text-[#78766f] uppercase mb-4">
                  {card.eta} • {card.stock}
                </div>
                <p className="text-xs text-[#5a5852] leading-relaxed pb-4 border-b border-[#edeae1]">
                  {card.reason}
                </p>

                <div className="pt-4 flex justify-between items-center text-xs font-mono-editorial">
                  <span className="text-[#78766f]">DELIVERY ESTIMATE</span>
                  <span className="font-bold text-[#121212]">{card.eta}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 text-xs font-mono-editorial uppercase font-bold text-purple-900 hover:text-purple-950 underline underline-offset-4"
            >
              <span>RUN YOUR LIVE BASKET ON ALL 4 PLATFORMS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          CHAPTER 05 — THE EDGE / SMART BASKET SPLIT
          ======================================================== */}
      <section id="ch-split" className="py-24 md:py-32 border-t border-[#e5e2da] bg-[#f5f3ee]/50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <ChapterHeader
            number="05"
            rubric="SPLIT BASKET ARBITRAGE"
            title={
              <>
                SOMETIMES THE BEST BASKET<br />
                <span className="text-purple-950">IS TWO ORDERS.</span>
              </>
            }
            description="Our deterministic split engine tests every mathematical permutation between platforms. If splitting products between Blinkit and Zepto saves meaningful money even after paying two delivery fees, we show you the exact trade-off."
          />

          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-white border border-[#ded9cb] shadow-sm max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-8 border-b border-[#edeae1]">
              {/* Single Store Order */}
              <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#edeae1] space-y-2">
                <div className="text-[10px] font-mono-editorial uppercase font-bold text-[#78766f]">
                  BEST SINGLE APP (BLINKIT)
                </div>
                <div className="font-display text-3xl font-black font-mono-editorial text-[#121212]">
                  ₹461
                </div>
                <div className="text-xs text-[#5a5852]">
                  1 Delivery • All 6 items together
                </div>
              </div>

              {/* Split Order */}
              <div className="p-6 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                <div className="text-[10px] font-mono-editorial uppercase font-bold text-purple-950 flex justify-between">
                  <span>SMART SPLIT COMBO</span>
                  <span className="text-emerald-700 font-extrabold">SAVE ₹{splitSavingsDemo}</span>
                </div>
                <div className="font-display text-3xl font-black font-mono-editorial text-purple-950">
                  ₹427
                </div>
                <div className="text-xs text-[#5a5852]">
                  Blinkit: 4 items (₹290) + Zepto: 2 items (₹122) + Fees (₹15)
                </div>
              </div>
            </div>

            {/* Tradeoff disclosure */}
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono-editorial font-bold uppercase tracking-wider text-amber-800">
                  ⚠️ HONEST TRADEOFF DISCLOSURE
                </div>
                <p className="text-xs text-[#5a5852] mt-1">
                  Requires answering the door twice for two couriers. ShopMate never hides operational trade-offs for false savings.
                </p>
              </div>
              <Link
                to="/compare"
                className="px-5 py-2.5 rounded-full bg-[#121212] text-white font-mono-editorial text-xs font-bold uppercase tracking-wider whitespace-nowrap hover:bg-purple-950 transition-colors"
              >
                TEST MY BASKET SPLIT
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CHAPTER 06 — THE FUTURE / PREFERENCES
          ======================================================== */}
      <section id="ch-learn" className="py-24 md:py-32 border-t border-[#e5e2da]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <ChapterHeader
            number="06"
            rubric="PERSONALIZED INTELLIGENCE"
            title={
              <>
                SHOPMATE LEARNS<br />
                <span className="text-purple-950">HOW YOU SHOP.</span>
              </>
            }
            description="Teach ShopMate your brand loyalties, maximum acceptable wait times, and split sensitivity. Your next grocery run becomes automatic."
          />

          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-white border border-[#ded9cb] shadow-sm max-w-3xl mx-auto space-y-6">
            <div className="text-xs font-mono-editorial uppercase font-bold text-[#78766f] pb-3 border-b border-[#edeae1] flex justify-between">
              <span>ACTIVE USER TUNING</span>
              <span>LOCAL PRIVACY ONLY</span>
            </div>

            <div className="space-y-4">
              {/* Max ETA control */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono-editorial mb-1.5">
                  <span className="font-bold text-[#121212]">MAXIMUM ACCEPTABLE ETA</span>
                  <span className="text-purple-900 font-bold">{preferences.maxEta} MINUTES</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="30"
                  step="2"
                  value={preferences.maxEta}
                  onChange={(e) => updatePreferences({ maxEta: Number(e.target.value) })}
                  className="w-full accent-purple-900"
                />
              </div>

              {/* Minimum Split Savings */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono-editorial mb-1.5">
                  <span className="font-bold text-[#121212]">MINIMUM SPLIT SAVING TO RECOMMEND</span>
                  <span className="text-purple-900 font-bold">₹{preferences.minimumSplitSavings}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={preferences.minimumSplitSavings}
                  onChange={(e) => updatePreferences({ minimumSplitSavings: Number(e.target.value) })}
                  className="w-full accent-purple-900"
                />
              </div>

              {/* Single store toggle */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-sm text-[#121212] block">
                    Prefer Single Store Orders Only
                  </span>
                  <span className="text-xs text-[#78766f]">
                    Disable basket splitting across multiple couriers
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => updatePreferences({ singleStorePreference: !preferences.singleStorePreference })}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    preferences.singleStorePreference ? 'bg-purple-950' : 'bg-[#ded9cb]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      preferences.singleStorePreference ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#edeae1] flex justify-between items-center">
              <span className="text-xs font-mono-editorial text-[#78766f]">
                Preferences stored in browser localStorage.
              </span>
              <Link
                to="/preferences"
                className="text-xs font-mono-editorial text-purple-900 font-bold hover:underline"
              >
                OPEN PREFERENCES PANEL →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          HOME END CTA — FINAL STATEMENT
          ======================================================== */}
      <section className="py-28 md:py-36 border-t border-[#e5e2da] bg-[#121212] text-[#faf8f5] text-center">
        <div className="max-w-4xl mx-auto px-6 md:px-10 space-y-8">
          <div className="text-xs font-mono-editorial uppercase font-bold text-purple-400 tracking-widest">
            THE CONCLUSION
          </div>

          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-[0.92]">
            STOP<br />
            CHECKING<br />
            THREE APPS.
          </h2>

          <p className="text-lg sm:text-xl text-[#a8a69f] max-w-xl mx-auto leading-relaxed">
            Build your basket once. Let ShopMate compare the rest.
          </p>

          <div className="pt-4">
            <Link
              to="/compare"
              className="px-8 py-5 rounded-full bg-[#faf8f5] text-[#121212] font-mono-editorial text-sm font-bold uppercase tracking-wider hover:bg-purple-100 hover:text-purple-950 transition-all inline-flex items-center gap-2 shadow-2xl hover:scale-105"
            >
              <span>COMPARE MY BASKET</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
