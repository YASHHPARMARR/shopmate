// src/components/LocationModal.tsx — Location Selection Modal
import React from 'react';
import { useShopMate } from '../context/ShopMateContext';
import { LOCATIONS } from '../data/locations';
import { X, MapPin, Check } from 'lucide-react';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setLocationModalOpen, location: activeLocation, setLocation } = useShopMate();

  if (!isLocationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#121212]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setLocationModalOpen(false)}
      />

      <div className="relative w-full max-w-md bg-[#faf8f5] rounded-3xl border border-[#ded9cb] p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#e5e2da]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-900" />
            <span className="text-xs font-mono-editorial font-bold uppercase tracking-wider text-[#78766f]">
              GEOGRAPHIC ROUTING
            </span>
          </div>
          <button
            onClick={() => setLocationModalOpen(false)}
            className="p-1 rounded-lg text-[#78766f] hover:text-[#121212]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-3">
          <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[#121212]">
            Where are you shopping?
          </h3>
          <p className="text-xs text-[#5a5852] leading-relaxed">
            Dark store inventory, item availability, surge fees, and courier ETAs are tied directly to your delivery micro-hub.
          </p>

          <div className="space-y-2 mt-4">
            {LOCATIONS.map((loc) => {
              const isSelected = activeLocation.pincode === loc.pincode;
              return (
                <button
                  key={loc.pincode}
                  onClick={() => {
                    setLocation(loc);
                    setLocationModalOpen(false);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-purple-950 text-white border-purple-950 shadow-md'
                      : 'bg-white border-[#e5e2da] hover:border-purple-800 text-[#121212]'
                  }`}
                >
                  <div>
                    <div className="font-display font-bold text-base tracking-tight">
                      {loc.city}
                    </div>
                    <div className={`text-xs font-mono-editorial ${isSelected ? 'text-purple-200' : 'text-[#78766f]'}`}>
                      PINCODE {loc.pincode} • [{loc.lat.toFixed(2)}, {loc.lon.toFixed(2)}]
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
