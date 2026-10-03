import type { PlatformConfig, PlatformId } from '../types';

export const PLATFORMS: Record<PlatformId, PlatformConfig> = {
  blinkit: {
    id: 'blinkit',
    name: 'Blinkit',
    tagline: '10-minute dark store delivery',
    color: '#eab308', // Amber-yellow
    accentBg: '#fef9c3',
    baseDeliveryFee: 15,
    freeDeliveryThreshold: 399,
    platformFee: 5,
    smallCartThreshold: 100,
    smallCartFee: 15,
    defaultEtaMinutes: 10,
    promo: {
      type: 'flat',
      amount: 15,
      minSubtotal: 200,
      label: '₹15 off on ₹200+'
    }
  },
  zepto: {
    id: 'zepto',
    name: 'Zepto',
    tagline: 'Lightning fast 8-minute delivery',
    color: '#9333ea', // Purple
    accentBg: '#f3e8ff',
    baseDeliveryFee: 12,
    freeDeliveryThreshold: 499,
    platformFee: 8,
    smallCartThreshold: 120,
    smallCartFee: 20,
    defaultEtaMinutes: 8,
    promo: {
      type: 'percent',
      percent: 5,
      cap: 25,
      minSubtotal: 250,
      label: '5% off (max ₹25) on ₹250+'
    }
  },
  instamart: {
    id: 'instamart',
    name: 'Instamart',
    tagline: 'Swiggy verified groceries & essentials',
    color: '#f97316', // Orange
    accentBg: '#ffedd5',
    baseDeliveryFee: 25,
    freeDeliveryThreshold: 499,
    platformFee: 10,
    smallCartThreshold: 150,
    smallCartFee: 25,
    defaultEtaMinutes: 12,
    promo: {
      type: 'flat',
      amount: 30,
      minSubtotal: 300,
      label: '₹30 off on ₹300+'
    }
  },
  jiomart: {
    id: 'jiomart',
    name: 'JioMart',
    tagline: 'Wholesale & daily value delivered',
    color: '#0284c7', // Sky blue
    accentBg: '#e0f2fe',
    baseDeliveryFee: 20,
    freeDeliveryThreshold: 349,
    platformFee: 3,
    smallCartThreshold: 99,
    smallCartFee: 10,
    defaultEtaMinutes: 18,
    promo: {
      type: 'flat',
      amount: 20,
      minSubtotal: 250,
      label: '₹20 off on ₹250+'
    }
  }
};
