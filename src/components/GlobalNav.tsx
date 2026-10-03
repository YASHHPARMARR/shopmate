// src/components/GlobalNav.tsx — Minimal Editorial Header & Mobile Bar
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShopMate } from '../context/ShopMateContext';
import { Menu, X, MapPin, ArrowUpRight } from 'lucide-react';

export const GlobalNav: React.FC = () => {
  const { basket, comparison, setLocationModalOpen, location: activeLocation, setApiModalOpen, apiKey } = useShopMate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerLocation = useLocation();

  const totalUnits = basket.reduce((sum, item) => sum + item.quantity, 0);
  const activeProducts = basket.filter(item => item.quantity > 0).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [routerLocation.pathname]);

  const navLinks = [
    { num: '01', label: 'COMPARE', to: '/compare' },
    { num: '02', label: 'BASKET', to: '/basket' },
    { num: '03', label: 'LIVE STATUS', to: '/status', isLive: true },
    { num: '04', label: 'SAVED', to: '/saved' },
    { num: '05', label: 'HISTORY', to: '/history' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e5e2da] py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="group flex items-baseline gap-2 text-decoration-none">
            <span className="font-display text-xl sm:text-2xl font-black tracking-tighter text-[#121212]">
              SHOPMATE
            </span>
            <span className="text-[10px] font-mono-editorial text-purple-900 font-bold uppercase tracking-widest hidden sm:inline">
              DECISION ENGINE
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[12px] font-mono-editorial uppercase tracking-wider text-[#78766f]">
            {navLinks.map((item) => {
              const active = routerLocation.pathname === item.to;
              return (
                <Link
                  key={item.num}
                  to={item.to}
                  className={`transition-colors hover:text-[#121212] flex items-center gap-1.5 ${
                    active ? 'text-purple-950 font-bold' : ''
                  }`}
                >
                  <span className="text-[10px] opacity-60 font-semibold">{item.num}</span>
                  {item.isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* QuickCommerce API indicator */}
            <button
              onClick={() => setApiModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#e5e2da] hover:border-purple-800 text-[11px] font-mono-editorial transition-colors text-[#5a5852]"
              title="QuickCommerce Live API Feed"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`} />
              <span>{apiKey ? 'API LIVE' : 'API READY'}</span>
            </button>

            {/* Location selector */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono-editorial uppercase text-[#4a4944] hover:bg-[#edeae1] transition-colors border border-transparent hover:border-[#ded9cb]"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-900" />
              <span className="hidden md:inline">{activeLocation.city}</span>
              <span className="text-[10px] opacity-70">[{activeLocation.pincode}]</span>
            </button>

            {/* Compare CTA */}
            <Link
              to="/compare"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121212] text-[#faf8f5] text-[11px] font-mono-editorial font-bold uppercase tracking-wider hover:bg-purple-950 transition-colors shadow-xs"
            >
              <span>COMPARE NOW</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#121212] hover:bg-[#edeae1]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#faf8f5] flex flex-col p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-6 border-b border-[#e5e2da]">
            <Link to="/" className="font-display text-2xl font-black tracking-tighter text-[#121212]">
              SHOPMATE
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-[#edeae1]"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-6 py-10 font-display text-3xl font-extrabold">
            <Link to="/" className="hover:text-purple-900 transition-colors">
              <span className="text-xs font-mono-editorial block text-[#78766f]">00 / INTRO</span>
              HOME STORY
            </Link>
            <Link to="/compare" className="hover:text-purple-900 transition-colors">
              <span className="text-xs font-mono-editorial block text-[#78766f]">01 / ENGINE</span>
              COMPARE BASKET
            </Link>
            <Link to="/basket" className="hover:text-purple-900 transition-colors">
              <span className="text-xs font-mono-editorial block text-[#78766f]">02 / BUILDER</span>
              YOUR BASKET
            </Link>
            <Link to="/status" className="hover:text-purple-900 transition-colors flex items-center justify-between">
              <div>
                <span className="text-xs font-mono-editorial block text-purple-900 font-bold">03 / INTELLIGENCE</span>
                LIVE STATUS
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            </Link>
            <Link to="/saved" className="hover:text-purple-900 transition-colors">
              <span className="text-xs font-mono-editorial block text-[#78766f]">04 / PERSISTENCE</span>
              SAVED ORDERS
            </Link>
            <Link to="/history" className="hover:text-purple-900 transition-colors">
              <span className="text-xs font-mono-editorial block text-[#78766f]">04 / SAVINGS</span>
              SAVINGS HISTORY
            </Link>
            <Link to="/features" className="hover:text-purple-900 transition-colors">
              <span className="text-xs font-mono-editorial block text-[#78766f]">05 / ARCHITECTURE</span>
              FEATURE STACK
            </Link>
            <Link to="/how-it-works" className="hover:text-purple-900 transition-colors">
              <span className="text-xs font-mono-editorial block text-[#78766f]">06 / METHODOLOGY</span>
              HOW IT WORKS
            </Link>
            <Link to="/preferences" className="hover:text-purple-900 transition-colors">
              <span className="text-xs font-mono-editorial block text-[#78766f]">07 / PROFILE</span>
              PREFERENCES
            </Link>
          </nav>

          <div className="mt-auto pt-6 border-t border-[#e5e2da] flex flex-col gap-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setLocationModalOpen(true);
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e5e2da] text-xs font-mono-editorial"
            >
              <span>LOCATION: {activeLocation.label}</span>
              <span className="text-purple-900 font-bold">CHANGE</span>
            </button>
            <Link
              to="/compare"
              className="w-full py-4 rounded-xl bg-purple-900 text-white font-mono-editorial font-bold text-center uppercase tracking-wider"
            >
              LAUNCH COMPARISON ENGINE
            </Link>
          </div>
        </div>
      )}

      {/* Sticky Bottom Basket Bar (When basket has items) */}
      {activeProducts > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 z-30 pointer-events-auto">
          <Link
            to="/basket"
            className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-full bg-[#121212] text-[#faf8f5] shadow-2xl hover:bg-purple-950 transition-all hover:scale-[1.02] border border-[#2b2a26]"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-800 text-white flex items-center justify-center text-xs font-bold font-mono-editorial">
                {totalUnits}
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono-editorial uppercase text-[#a8a69f] leading-none">
                  ACTIVE BASKET
                </div>
                <div className="text-sm font-bold tracking-tight">
                  {activeProducts} items • est. ₹{comparison.recommended.effectiveTotal}
                </div>
              </div>
            </div>
            <span className="text-xs font-mono-editorial font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
              VIEW BASKET <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      )}
    </>
  );
};
