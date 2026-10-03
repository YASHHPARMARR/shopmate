import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  Fingerprint,
  Calculator,
  GitCompare,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { ChapterHeader } from '../components/ChapterHeader';
import { DataStatusBadge } from '../components/DataStatusBadge';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'BUILD',
      tagline: 'Tell us what you need.',
      description:
        'Instead of opening Blinkit, then Zepto, then Instamart to assemble identical shopping carts in three separate places, build your manifest once inside ShopMate. Search products, specify pack sizes, and select quantities without committing to any vendor.',
      details: [
        'Multi-category grocery search',
        'Direct pack size specification',
        'Offline browser-persisted state'
      ],
      icon: Layers
    },
    {
      num: '02',
      title: 'MATCH',
      tagline: 'We identify the same product across platforms.',
      description:
        'Quick-commerce apps intentionally obfuscate product listings with disparate pack descriptions, subtle branding variations, and distinct SKU titles. Our deterministic engine maps items using normalized barcodes, grammage, and volume units to guarantee true equivalence.',
      details: [
        'Deterministic unit conversion (g, kg, ml, L)',
        'Strict 98%+ match confidence verification',
        'Explicit flagging of alternative substitutes'
      ],
      icon: Fingerprint
    },
    {
      num: '03',
      title: 'CALCULATE',
      tagline: 'We combine prices, discounts and fees.',
      description:
        'A ₹10 cheaper product means nothing if that platform slaps on a ₹25 small-cart fee, a ₹15 surge delivery surcharge, and a ₹5 platform handling fee. ShopMate calculates the True Net Effective Total: items minus promos plus all hidden fees.',
      details: [
        'Dynamic small-cart threshold checking',
        'Weather & surge delivery fee resolution',
        'Real-time promo coupon reconciliation'
      ],
      icon: Calculator
    },
    {
      num: '04',
      title: 'COMPARE',
      tagline: 'We consider availability and ETA.',
      description:
        'A cheap basket is useless if 2 out of your 5 staple items are out of stock. We inspect real-time dark store stock counts across your specific delivery pincode, factoring in live rider availability and realistic arrival minutes.',
      details: [
        'Dark store inventory verification',
        'Rider ETA precision comparison',
        'Instant multi-app scorecard matrix'
      ],
      icon: GitCompare
    },
    {
      num: '05',
      title: 'DECIDE',
      tagline: 'You choose cheapest, fastest or best value.',
      description:
        'We never declare a blind "Winner". You decide what matters right now: minimum total cash outflow, absolute fastest rider turnaround, or our deterministic Smart Basket Split that divides orders across two stores when savings exceed your tradeoff threshold.',
      details: [
        'Transparent decision rubric (Cheapest / Fastest / Best Value)',
        'Deterministic Smart Basket Split calculator',
        'Direct cart handoff with zero lock-in'
      ],
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#e5e0d8] pb-12 mb-16">
        <ChapterHeader
          rubric="METHODOLOGY &amp; ARCHITECTURE"
          title={<>HOW<br />SHOPMATE<br />WORKS.</>}
          subtitle="The engineering philosophy behind turning fragmented quick-commerce apps into a single, high-fidelity decision engine."
        />
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#f0ece4]">
          <span className="font-mono-editorial text-xs text-[#737373]">
            SYSTEM DESIGN • 05 STEP PIPELINE
          </span>
          <DataStatusBadge />
        </div>
      </div>

      {/* 5 Chapters of the Process */}
      <div className="space-y-16 lg:space-y-24">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="border-t border-[#121212] pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Number & Title */}
              <div className="lg:col-span-5">
                <div className="font-mono-editorial text-xs text-[#581c87] font-bold tracking-widest uppercase mb-2">
                  CHPT. {step.num} — 05
                </div>
                <h2 className="text-5xl sm:text-7xl font-black text-[#121212] tracking-tight leading-[0.9] mb-4">
                  {step.title}
                </h2>
                <div className="text-xl sm:text-2xl font-serif italic text-[#525252] leading-snug">
                  "{step.tagline}"
                </div>
              </div>

              {/* Right Column: Description & Feature Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3 text-xs font-mono-editorial text-[#581c87]">
                  <Icon className="w-5 h-5 text-[#581c87]" />
                  <span className="uppercase tracking-widest font-bold">ENGINE SUBSYSTEM</span>
                </div>

                <p className="text-base sm:text-lg text-[#262626] font-sans leading-relaxed">
                  {step.description}
                </p>

                <div className="p-6 bg-[#faf8f5] border border-[#e5e0d8] space-y-2.5">
                  <div className="font-mono-editorial text-[10px] text-[#737373] tracking-wider uppercase mb-2">
                    CORE SYSTEM CHECKS
                  </div>
                  {step.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2.5 text-xs text-[#121212]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#581c87]" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Massive Editorial Closing Statement */}
      <div className="mt-28 border-t-2 border-[#121212] pt-16 lg:pt-24 pb-12">
        <div className="max-w-4xl">
          <div className="font-mono-editorial text-xs text-[#581c87] font-bold tracking-widest uppercase mb-6">
            THE OUTCOME
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#121212] tracking-tight leading-[0.92] mb-8">
            YOU ASKED FOR<br />
            GROCERIES.<br />
            <br />
            WE FOUND<br />
            THE SMARTER<br />
            WAY TO BUY THEM.
          </h2>
          <p className="text-base sm:text-xl text-[#525252] max-w-2xl leading-relaxed mb-10 font-sans">
            No more bouncing between apps, second-guessing delivery fees, or overpaying out of convenience.
          </p>

          <Link
            to="/compare"
            className="inline-flex items-center gap-3 bg-[#581c87] hover:bg-[#4a148c] text-white px-8 py-5 text-xs font-mono-editorial tracking-widest uppercase transition-colors shadow-lg"
          >
            <span>COMPARE MY BASKET NOW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
