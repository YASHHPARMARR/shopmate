// src/services/storage.ts — LocalStorage Persistence Layer
import type {
  BasketItem,
  ComparisonHistoryEntry,
  LocationInfo,
  PriceAlert,
  SavedBasket,
  UserPreferences
} from '../types';
import { DEFAULT_BASKET_ITEMS, DEMO_ALERTS, DEMO_HISTORY, SAVED_PRESETS } from '../data/catalog';
import { DEFAULT_LOCATION } from '../data/locations';

const KEYS = {
  BASKET: 'shopmate_basket',
  SAVED: 'shopmate_saved_baskets',
  HISTORY: 'shopmate_history',
  ALERTS: 'shopmate_alerts',
  PREFERENCES: 'shopmate_preferences',
  LOCATION: 'shopmate_location',
  API_KEY: 'shopmate_qc_api_key',
  APIFY_KEY: 'shopmate_apify_api_key',
  LIVE_ENABLED: 'shopmate_qc_live_enabled'
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  preferredBrands: ['Amul', 'Tata', 'Aashirvaad'],
  preferredPackSizes: ['Standard', 'Family Pack'],
  maxEta: 15,
  minimumSplitSavings: 15,
  singleStorePreference: false
};

export function getStoredBasket(): BasketItem[] {
  try {
    const raw = localStorage.getItem(KEYS.BASKET);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return DEFAULT_BASKET_ITEMS;
}

export function setStoredBasket(basket: BasketItem[]): void {
  try {
    localStorage.setItem(KEYS.BASKET, JSON.stringify(basket));
  } catch (e) { /* ignore */ }
}

export function getStoredSavedBaskets(): SavedBasket[] {
  try {
    const raw = localStorage.getItem(KEYS.SAVED);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return SAVED_PRESETS;
}

export function setStoredSavedBaskets(baskets: SavedBasket[]): void {
  try {
    localStorage.setItem(KEYS.SAVED, JSON.stringify(baskets));
  } catch (e) { /* ignore */ }
}

export function getStoredHistory(): ComparisonHistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEYS.HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return DEMO_HISTORY;
}

export function setStoredHistory(history: ComparisonHistoryEntry[]): void {
  try {
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch (e) { /* ignore */ }
}

export function getStoredAlerts(): PriceAlert[] {
  try {
    const raw = localStorage.getItem(KEYS.ALERTS);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return DEMO_ALERTS;
}

export function setStoredAlerts(alerts: PriceAlert[]): void {
  try {
    localStorage.setItem(KEYS.ALERTS, JSON.stringify(alerts));
  } catch (e) { /* ignore */ }
}

export function getStoredPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(KEYS.PREFERENCES);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return DEFAULT_PREFERENCES;
}

export function setStoredPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (e) { /* ignore */ }
}

export function getStoredLocation(): LocationInfo {
  try {
    const raw = localStorage.getItem(KEYS.LOCATION);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return DEFAULT_LOCATION;
}

export function setStoredLocation(loc: LocationInfo): void {
  try {
    localStorage.setItem(KEYS.LOCATION, JSON.stringify(loc));
  } catch (e) { /* ignore */ }
}

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(KEYS.API_KEY) || '41273e9b-b914-4f43-be72-91fec72153b7';
  } catch (e) {
    return '41273e9b-b914-4f43-be72-91fec72153b7';
  }
}

export function setStoredApiKey(key: string): void {
  try {
    localStorage.setItem(KEYS.API_KEY, key);
  } catch (e) { /* ignore */ }
}

export function getStoredApifyKey(): string {
  try {
    return localStorage.getItem(KEYS.APIFY_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function setStoredApifyKey(key: string): void {
  try {
    localStorage.setItem(KEYS.APIFY_KEY, key);
  } catch (e) { /* ignore */ }
}
