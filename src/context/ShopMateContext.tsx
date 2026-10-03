// src/context/ShopMateContext.tsx — Reactive Global Application State
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type {
  BasketItem,
  ComparisonHistoryEntry,
  ComparisonMode,
  ComparisonSummary,
  LocationInfo,
  PlatformId,
  PriceAlert,
  Product,
  ProductOffers,
  SavedBasket,
  UserPreferences
} from '../types';
import { INITIAL_OFFERS, INITIAL_PRODUCTS, SAVED_PRESETS } from '../data/catalog';
import { computeComparison } from '../services/engine';
import { searchLiveProviders } from '../services/api';
import {
  getStoredAlerts,
  getStoredApiKey,
  getStoredApifyKey,
  getStoredBasket,
  getStoredHistory,
  getStoredLocation,
  getStoredPreferences,
  getStoredSavedBaskets,
  setStoredAlerts,
  setStoredApiKey,
  setStoredApifyKey,
  setStoredBasket,
  setStoredHistory,
  setStoredLocation,
  setStoredPreferences,
  setStoredSavedBaskets
} from '../services/storage';

interface ShopMateContextType {
  products: Product[];
  offers: Record<string, ProductOffers>;
  basket: BasketItem[];
  location: LocationInfo;
  preferences: UserPreferences;
  savedBaskets: SavedBasket[];
  history: ComparisonHistoryEntry[];
  alerts: PriceAlert[];
  comparisonMode: ComparisonMode;
  comparison: ComparisonSummary;
  isCalculating: boolean;
  apiKey: string;
  apifyApiKey: string;
  isLiveLoading: boolean;
  
  // Actions
  addToBasket: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromBasket: (productId: string) => void;
  clearBasket: () => void;
  loadPreset: (presetId: string) => void;
  setComparisonMode: (mode: ComparisonMode) => void;
  setLocation: (loc: LocationInfo) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  saveCurrentBasket: (title?: string) => void;
  deleteSavedBasket: (id: string) => void;
  toggleAlert: (productId: string, targetPrice?: number) => void;
  removeAlert: (alertId: string) => void;
  runComparison: () => Promise<void>;
  clearHistory: () => void;
  setApiKey: (key: string) => void;
  setApifyApiKey: (key: string) => void;
  searchLiveProducts: (query: string) => Promise<boolean>;
  refreshCatalogWithApi: (keyToUse?: string) => Promise<void>;

  // Modals & Drawers state
  isWhyDrawerOpen: boolean;
  setWhyDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setCheckoutModalOpen: (open: boolean) => void;
  checkoutPlatform: PlatformId;
  openCheckout: (platform: PlatformId) => void;
  isLocationModalOpen: boolean;
  setLocationModalOpen: (open: boolean) => void;
  isApiModalOpen: boolean;
  setApiModalOpen: (open: boolean) => void;
}

const ShopMateContext = createContext<ShopMateContextType | null>(null);

export const ShopMateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [offers, setOffers] = useState<Record<string, ProductOffers>>(INITIAL_OFFERS);
  const [basket, setBasketState] = useState<BasketItem[]>(getStoredBasket);
  const [location, setLocationState] = useState<LocationInfo>(getStoredLocation);
  const [preferences, setPreferencesState] = useState<UserPreferences>(getStoredPreferences);
  const [savedBaskets, setSavedBasketsState] = useState<SavedBasket[]>(getStoredSavedBaskets);
  const [history, setHistoryState] = useState<ComparisonHistoryEntry[]>(getStoredHistory);
  const [alerts, setAlertsState] = useState<PriceAlert[]>(getStoredAlerts);
  const [apiKey, setApiKeyState] = useState<string>(getStoredApiKey);
  const [apifyApiKey, setApifyApiKeyState] = useState<string>(getStoredApifyKey);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('cheapest');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(false);

  // Modals
  const [isWhyDrawerOpen, setWhyDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutPlatform, setCheckoutPlatform] = useState<PlatformId>('blinkit');
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const [isApiModalOpen, setApiModalOpen] = useState(false);

  // Synchronize state with localStorage
  const updateBasket = useCallback((newBasketOrUpdater: BasketItem[] | ((prev: BasketItem[]) => BasketItem[])) => {
    setBasketState(prev => {
      const next = typeof newBasketOrUpdater === 'function' ? newBasketOrUpdater(prev) : newBasketOrUpdater;
      setStoredBasket(next);
      return next;
    });
  }, []);

  const setLocation = useCallback((loc: LocationInfo) => {
    setLocationState(loc);
    setStoredLocation(loc);
  }, []);

  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferencesState(prev => {
      const updated = { ...prev, ...partial };
      setStoredPreferences(updated);
      return updated;
    });
  }, []);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    setStoredApiKey(key);
  }, []);

  const setApifyApiKey = useCallback((key: string) => {
    setApifyApiKeyState(key);
    setStoredApifyKey(key);
  }, []);

  // Live API Catalog Refresh
  const refreshCatalogWithApi = useCallback(async (keyToUse?: string) => {
    const key = keyToUse || apiKey || getStoredApiKey();
    if (!key) return;

    setIsLiveLoading(true);
    try {
      const res = await searchLiveProviders('milk', key, location.lat, location.lon, location.pincode);
      if (res.isLive && res.products.length > 0) {
        setProducts(prev => {
          const liveIds = new Set(res.products.map(p => p.id));
          const oldStatic = prev.filter(p => !p.id.startsWith('live-') && !liveIds.has(p.id));
          return [...res.products, ...oldStatic];
        });
        setOffers(prev => ({
          ...prev,
          ...res.offers
        }));
      }
    } catch (e) {
      console.warn('Auto catalog refresh error:', e);
    } finally {
      setIsLiveLoading(false);
    }
  }, [apiKey, location]);

  // Live Query Search
  const searchLiveProducts = useCallback(async (query: string): Promise<boolean> => {
    const activeKey = apiKey || getStoredApiKey();
    if (!activeKey || !query || !query.trim()) return false;

    setIsLiveLoading(true);
    try {
      const live = await searchLiveProviders(query, activeKey, location.lat, location.lon, location.pincode);
      if (live.isLive && live.products.length > 0) {
        setProducts(prev => {
          const incomingIds = new Set(live.products.map(p => p.id));
          const filteredPrev = prev.filter(p => !incomingIds.has(p.id));
          return [...live.products, ...filteredPrev];
        });
        setOffers(prev => ({
          ...prev,
          ...live.offers
        }));
        return true;
      }
    } catch (err) {
      console.error('Failed to search live products:', err);
    } finally {
      setIsLiveLoading(false);
    }
    return false;
  }, [apiKey, location]);

  // Fetch live products when an API key is present
  useEffect(() => {
    const activeKey = apiKey || getStoredApiKey();
    if (activeKey) {
      refreshCatalogWithApi(activeKey);
    }
  }, [apiKey, refreshCatalogWithApi]);

  // Compute live comparison
  const comparison = useMemo(() => {
    const isLive = Boolean(apiKey) || products.some(p => p.isLive);
    return computeComparison(basket, products, offers, preferences, isLive);
  }, [basket, products, offers, preferences, apiKey]);

  // Basket actions
  const addToBasket = useCallback((productId: string, quantity: number = 1) => {
    updateBasket(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { productId, quantity }];
    });
  }, [updateBasket]);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    updateBasket(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (!existing) return prev;
      const nextQty = existing.quantity + delta;
      if (nextQty <= 0) {
        return prev.filter(i => i.productId !== productId);
      }
      return prev.map(i => i.productId === productId ? { ...i, quantity: nextQty } : i);
    });
  }, [updateBasket]);

  const removeFromBasket = useCallback((productId: string) => {
    updateBasket(prev => prev.filter(i => i.productId !== productId));
  }, [updateBasket]);

  const clearBasket = useCallback(() => {
    updateBasket([]);
  }, [updateBasket]);

  const loadPreset = useCallback((presetId: string) => {
    const preset = SAVED_PRESETS.find(p => p.id === presetId) || savedBaskets.find(p => p.id === presetId);
    if (preset) {
      updateBasket(preset.items);
    }
  }, [savedBaskets, updateBasket]);

  const saveCurrentBasket = useCallback((title?: string) => {
    const active = basket.filter(i => i.quantity > 0);
    if (active.length === 0) return;

    const count = active.reduce((sum, i) => sum + i.quantity, 0);
    const newSaved: SavedBasket = {
      id: `saved-${Date.now()}`,
      title: title || `Custom Basket #${savedBaskets.length + 1}`,
      itemCount: count,
      items: active,
      lastComparedDate: 'Today',
      lastBestPlatform: comparison.recommended.platformName,
      lastBestPrice: comparison.recommended.effectiveTotal,
      estimatedSaving: comparison.recommended.savingsVsMax || 35
    };

    setSavedBasketsState(prev => {
      const updated = [newSaved, ...prev];
      setStoredSavedBaskets(updated);
      return updated;
    });
  }, [basket, comparison, savedBaskets.length]);

  const deleteSavedBasket = useCallback((id: string) => {
    setSavedBasketsState(prev => {
      const updated = prev.filter(b => b.id !== id);
      setStoredSavedBaskets(updated);
      return updated;
    });
  }, []);

  const toggleAlert = useCallback((productId: string, targetPrice?: number) => {
    setAlertsState(prev => {
      const existing = prev.find(a => a.productId === productId);
      let updated: PriceAlert[];
      if (existing) {
        updated = prev.filter(a => a.productId !== productId);
      } else {
        const lowestOffer = offers[productId] ? Math.min(...Object.values(offers[productId]).map(o => o.price)) : 40;
        const newAlert: PriceAlert = {
          id: `alt-${Date.now()}`,
          productId,
          targetPrice: targetPrice || Math.round(lowestOffer * 0.9),
          currentLowestPrice: lowestOffer,
          createdDate: 'Today',
          active: true
        };
        updated = [newAlert, ...prev];
      }
      setStoredAlerts(updated);
      return updated;
    });
  }, [offers]);

  const removeAlert = useCallback((alertId: string) => {
    setAlertsState(prev => {
      const updated = prev.filter(a => a.id !== alertId);
      setStoredAlerts(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryState([]);
    setStoredHistory([]);
  }, []);

  const runComparison = useCallback(async () => {
    setIsCalculating(true);
    await new Promise(r => setTimeout(r, 600));
    setIsCalculating(false);

    // Record in history if meaningful
    if (basket.length > 0) {
      const active = basket.filter(i => i.quantity > 0);
      const entry: ComparisonHistoryEntry = {
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        basketTitle: `Quick Basket (${active.length} items)`,
        itemCount: active.reduce((s, i) => s + i.quantity, 0),
        bestPlatform: comparison.recommended.platformName,
        bestTotal: comparison.recommended.effectiveTotal,
        savingsAmount: comparison.recommended.savingsVsMax || 35
      };
      setHistoryState(prev => {
        const updated = [entry, ...prev.slice(0, 19)];
        setStoredHistory(updated);
        return updated;
      });
    }
  }, [basket, comparison]);

  const openCheckout = useCallback((platform: PlatformId) => {
    setCheckoutPlatform(platform);
    setCheckoutModalOpen(true);
  }, []);

  return (
    <ShopMateContext.Provider
      value={{
        products,
        offers,
        basket,
        location,
        preferences,
        savedBaskets,
        history,
        alerts,
        comparisonMode,
        comparison,
        isCalculating,
        apiKey,
        apifyApiKey,
        addToBasket,
        updateQuantity,
        removeFromBasket,
        clearBasket,
        loadPreset,
        setComparisonMode,
        setLocation,
        updatePreferences,
        saveCurrentBasket,
        deleteSavedBasket,
        toggleAlert,
        removeAlert,
        clearHistory,
        runComparison,
        setApiKey,
        setApifyApiKey,
        searchLiveProducts,
        refreshCatalogWithApi,
        isLiveLoading,
        isWhyDrawerOpen,
        setWhyDrawerOpen,
        isCheckoutModalOpen,
        setCheckoutModalOpen,
        checkoutPlatform,
        openCheckout,
        isLocationModalOpen,
        setLocationModalOpen,
        isApiModalOpen,
        setApiModalOpen
      }}
    >
      {children}
    </ShopMateContext.Provider>
  );
};

export const useShopMate = () => {
  const ctx = useContext(ShopMateContext);
  if (!ctx) throw new Error('useShopMate must be used within ShopMateProvider');
  return ctx;
};
