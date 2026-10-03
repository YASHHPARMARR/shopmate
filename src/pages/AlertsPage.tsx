import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  Trash2,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { useShopMate } from '../context/ShopMateContext';
import { ChapterHeader } from '../components/ChapterHeader';
import { DataStatusBadge } from '../components/DataStatusBadge';
import type { PriceAlert, Product } from '../types';

export const AlertsPage: React.FC = () => {
  const { alerts, removeAlert, toggleAlert, products, offers } = useShopMate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [targetPrice, setTargetPrice] = useState('35');

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    toggleAlert(product.id, parseFloat(targetPrice));
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-[#e5e0d8] pb-12 mb-12">
        <ChapterHeader
          rubric="CHPT. 07 — PERSISTENCE"
          title={<>WAIT<br />FOR THE<br />RIGHT<br />PRICE.</>}
          subtitle="Autonomous surveillance across dark store inventories. When platform surge discounts or stock replenishment cross your target threshold, ShopMate triggers an immediate alert."
        />

        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-[#f0ece4]">
          <div className="flex items-center gap-6 text-xs font-mono-editorial text-[#737373]">
            <div>
              <span className="text-[#121212] font-bold text-base">{alerts.length}</span> ACTIVE MONITORS
            </div>
            <div className="h-4 w-px bg-[#e5e0d8]" />
            <div>
              SCAN FREQUENCY: <span className="text-[#581c87] font-bold text-base">HOURLY</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DataStatusBadge />
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 text-xs font-mono-editorial px-3 py-1.5 bg-[#581c87] hover:bg-[#4a148c] text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD NEW MONITOR
            </button>
          </div>
        </div>

        {/* Add Alert Drawer Form */}
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleAddAlert}
            className="mt-6 p-6 border border-[#581c87] bg-[#faf5ff] grid grid-cols-1 sm:grid-cols-12 gap-4 items-end"
          >
            <div className="sm:col-span-5">
              <label className="block text-[10px] font-mono-editorial text-[#581c87] font-bold uppercase mb-1">
                SELECT PRODUCT TO TRACK
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  const prodOffers = offers[e.target.value];
                  if (prodOffers) {
                    const min = Math.min(...Object.values(prodOffers).map((o) => o.price));
                    setTargetPrice(String(Math.round(min * 0.9)));
                  }
                }}
                className="w-full p-2.5 text-xs font-mono-editorial border border-[#d8b4fe] bg-white outline-none"
              >
                {products.map((p: Product) => {
                  const prodOffers = offers[p.id];
                  const min = prodOffers ? Math.min(...Object.values(prodOffers).map((o) => o.price)) : p.mrp;
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.size} {p.unit}) — Current: ₹{min}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[10px] font-mono-editorial text-[#581c87] font-bold uppercase mb-1">
                ALERT WHEN PRICE DROPS BELOW (₹)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full p-2.5 text-xs font-mono-editorial border border-[#d8b4fe] bg-white outline-none"
                placeholder="Target Price"
                required
              />
            </div>

            <div className="sm:col-span-3 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#581c87] text-white py-2.5 px-4 text-xs font-mono-editorial font-bold uppercase hover:bg-[#4a148c] transition-colors"
              >
                ACTIVATE MONITOR
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="border border-[#e5e0d8] bg-white px-3 py-2.5 text-xs font-mono-editorial text-[#737373] hover:text-[#121212]"
              >
                CANCEL
              </button>
            </div>
          </motion.form>
        )}
      </div>

      {/* Monitored Products List */}
      {alerts.length === 0 ? (
        <div className="border border-[#e5e0d8] bg-[#fbfaf8] p-16 text-center my-12">
          <Bell className="w-12 h-12 text-[#a3a3a3] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#121212] mb-2">NO PRICE ALERTS SET</h2>
          <p className="text-xs text-[#737373] max-w-sm mx-auto mb-6 font-sans">
            Track staple groceries and receive alerts when quick-commerce platforms drop prices or restock inventory.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#581c87] text-white px-6 py-3 text-xs font-mono-editorial uppercase tracking-wider"
          >
            CREATE FIRST ALERT
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-[11px] font-mono-editorial tracking-wider text-[#a3a3a3] uppercase pb-2 border-b border-[#e5e0d8] flex items-center justify-between">
            <span>ACTIVE SURVEILLANCE FEED</span>
            <span>CURRENT VS TARGET</span>
          </div>

          {alerts.map((alert: PriceAlert, idx: number) => {
            const product = products.find((p) => p.id === alert.productId);
            const dropNeeded = alert.currentLowestPrice - alert.targetPrice;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-[#e5e0d8] bg-white p-6 sm:p-8 hover:border-[#121212] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-5">
                  {product && (
                    <Link
                      to={`/product/${product.id}`}
                      className="w-16 h-16 shrink-0 bg-[#faf8f5] border border-[#e5e0d8] flex items-center justify-center p-2 hover:border-[#581c87] transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </Link>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono-editorial text-[#581c87] font-semibold uppercase">
                        {product?.brand || 'VERIFIED BRAND'}
                      </span>
                      <span className="text-[10px] font-mono-editorial text-[#a3a3a3]">•</span>
                      <span className="text-[10px] font-mono-editorial text-[#737373]">
                        {product?.size} {product?.unit}
                      </span>
                    </div>

                    <Link
                      to={`/product/${alert.productId}`}
                      className="text-lg font-bold text-[#121212] tracking-tight hover:text-[#581c87] transition-colors"
                    >
                      {product?.name || alert.productId}
                    </Link>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 font-mono-editorial text-[9px] bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0] px-2 py-0.5 font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" />
                        {alert.active ? 'ALERT ACTIVE' : 'PAUSED'}
                      </span>
                      <span className="text-[10px] font-mono-editorial text-[#737373]">
                        Created {alert.createdDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#f0ede6]">
                  <div>
                    <div className="text-[10px] font-mono-editorial text-[#737373] uppercase mb-0.5">
                      CURRENT
                    </div>
                    <div className="text-xl font-black font-mono-editorial text-[#121212]">
                      ₹{alert.currentLowestPrice}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono-editorial text-[#581c87] uppercase mb-0.5">
                      ALERT BELOW
                    </div>
                    <div className="text-xl font-black font-mono-editorial text-[#581c87]">
                      ₹{alert.targetPrice}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono-editorial text-[#737373] uppercase mb-0.5">
                      DELTA TO TRIGGER
                    </div>
                    <div className="text-sm font-mono-editorial text-[#737373]">
                      {dropNeeded > 0 ? `−₹${dropNeeded}` : 'TRIGGERED'}
                    </div>
                  </div>

                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="p-2 border border-[#e5e0d8] hover:border-[#dc2626] hover:text-[#dc2626] text-[#a3a3a3] transition-colors"
                    title="Remove alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Editorial Rubric Note */}
      <div className="mt-16 border-t border-[#e5e0d8] pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#737373]">
        <div>
          <h4 className="font-mono-editorial text-[11px] text-[#121212] font-bold uppercase mb-2">
            AUTONOMOUS POLLING POLICY
          </h4>
          <p className="leading-relaxed font-sans">
            Quick-commerce dark stores dynamically lower prices on perishables approaching expiration dates or during off-peak windows. Target alerts watch these transient shifts so you don't have to check apps manually.
          </p>
        </div>
        <div>
          <h4 className="font-mono-editorial text-[11px] text-[#121212] font-bold uppercase mb-2">
            ZERO SPAM PROMISE
          </h4>
          <p className="leading-relaxed font-sans">
            ShopMate notifications are deterministic and state-driven. We do not blast promotional notifications or fake urgency banners.
          </p>
        </div>
      </div>
    </div>
  );
};
