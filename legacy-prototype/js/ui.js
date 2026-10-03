// js/ui.js — Application state, DOM rendering, interactions
import {
  PRODUCTS, OFFERS, PLATFORMS, CATEGORIES, DEFAULT_BASKET,
  ROUTINE_PRESETS, PRICE_HISTORY, LOCATIONS, DEFAULT_LOCATION,
  getProduct, productDisplayName, getLowestPrice, getPriceRange,
  searchProducts, filterByCategory, getMatchConfidence, registerProduct
} from './data.js';

import {
  computeBasket, computeForPlatform, rank, computeSplit,
  getBasketSummary, getRecommendationReasons, getModeExplanation
} from './engine.js';

import {
  API_CONFIG, saveApiConfig, searchQuickCommerce,
  testApiConnection, searchCrossPlatform
} from './api.js';

// ===== APP STATE =====
const state = {
  basket: [], // [{productId, quantity}]
  location: null,
  comparisonResults: null,
  comparisonMode: 'cheapest',
  splitResult: null,
  savedBaskets: [],
  comparisonHistory: [],
  preferences: {
    preferredBrands: [],
    maxEta: 15,
    minimumSplitSavings: 15,
    singleStorePreference: false
  },
  searchQuery: '',
  activeCategory: 'all',
  priceAlerts: {},
  motionEnabled: true
};

// ===== INIT =====
function init() {
  loadState();
  if (state.basket.length === 0) {
    state.basket = JSON.parse(JSON.stringify(DEFAULT_BASKET));
  }
  if (!state.location) {
    state.location = DEFAULT_LOCATION;
  }

  bindEvents();
  initApiControls();
  renderCategoryChips();
  renderProductGrid();
  renderBasket();
  renderPresetOptions();
  renderLocationOptions();
  renderSavedBaskets();

  try { updateMarquee(); } catch (e) { console.warn('Marquee update error:', e); }
  try { updateHeroCard(); } catch (e) { console.warn('Hero card update error:', e); }

  // Show dashboard if we have results
  if (state.comparisonResults) {
    showDashboard();
  }
}

// ===== STATE PERSISTENCE =====
function saveState() {
  try {
    localStorage.setItem('shopmate_basket', JSON.stringify(state.basket));
    localStorage.setItem('shopmate_location', JSON.stringify(state.location));
    localStorage.setItem('shopmate_saved', JSON.stringify(state.savedBaskets));
    localStorage.setItem('shopmate_history', JSON.stringify(state.comparisonHistory));
    localStorage.setItem('shopmate_prefs', JSON.stringify(state.preferences));
    localStorage.setItem('shopmate_alerts', JSON.stringify(state.priceAlerts));
    localStorage.setItem('shopmate_motion', JSON.stringify(state.motionEnabled));
  } catch (e) { /* quota exceeded, ignore */ }
}

function loadState() {
  try {
    const b = localStorage.getItem('shopmate_basket');
    if (b) state.basket = JSON.parse(b);
    const l = localStorage.getItem('shopmate_location');
    if (l) state.location = JSON.parse(l);
    const s = localStorage.getItem('shopmate_saved');
    if (s) state.savedBaskets = JSON.parse(s);
    const h = localStorage.getItem('shopmate_history');
    if (h) state.comparisonHistory = JSON.parse(h);
    const p = localStorage.getItem('shopmate_prefs');
    if (p) state.preferences = JSON.parse(p);
    const a = localStorage.getItem('shopmate_alerts');
    if (a) state.priceAlerts = JSON.parse(a);
    const m = localStorage.getItem('shopmate_motion');
    if (m !== null) state.motionEnabled = JSON.parse(m);
  } catch (e) { /* corrupt data, ignore */ }

  // Apply motion state
  if (!state.motionEnabled) {
    document.body.classList.add('motion-off');
  }
  updateMotionToggle();
}

// ===== EVENT BINDING =====
let searchDebounceTimer = null;

function bindEvents() {
  // Search
  const searchInput = document.getElementById('product-search');
  searchInput?.addEventListener('input', (e) => {
    const val = e.target.value;
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      handleProductSearch(val);
    }, 280);
  });

  // Clear search button
  document.getElementById('clear-search-btn')?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      handleProductSearch('');
      searchInput.focus();
    }
  });

  // Quick search chips
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      if (searchInput && q) {
        searchInput.value = q;
        handleProductSearch(q);
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Compare button
  document.getElementById('compare-btn')?.addEventListener('click', runComparison);

  // Mode tabs
  document.querySelectorAll('.mode-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      setCompareMode(mode);
    });
  });

  // Location button
  document.getElementById('location-btn')?.addEventListener('click', () => openModal('location-modal'));
  document.getElementById('location-label').textContent = state.location?.city || 'Select';

  // Continue button
  document.getElementById('continue-btn')?.addEventListener('click', openHandoffModal);

  // Why recommended
  document.getElementById('why-recommended-btn')?.addEventListener('click', openWhyDrawer);

  // Modal close buttons
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal.id);
    });
  });

  // Drawer closes
  document.getElementById('why-drawer-close')?.addEventListener('click', () => closeDrawer('why-drawer'));
  document.getElementById('why-drawer-backdrop')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDrawer('why-drawer');
  });
  document.getElementById('history-drawer-close')?.addEventListener('click', () => closeDrawer('history-drawer'));
  document.getElementById('history-drawer-backdrop')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDrawer('history-drawer');
  });

  // Modal backdrops
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });

  // Keyboard: Esc closes modals/drawers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => closeModal(m.id));
      document.querySelectorAll('.drawer-backdrop.active').forEach(d => closeDrawer(d.id.replace('-backdrop', '')));
      closeMobileNav();
    }
  });

  // Mobile nav
  document.getElementById('mobile-menu-btn')?.addEventListener('click', openMobileNav);
  document.getElementById('mobile-nav-close')?.addEventListener('click', closeMobileNav);
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Load preset
  document.getElementById('load-preset-btn')?.addEventListener('click', loadPreset);

  // Split threshold
  document.getElementById('split-threshold')?.addEventListener('change', (e) => {
    state.preferences.minimumSplitSavings = parseInt(e.target.value) || 15;
    saveState();
    if (state.comparisonResults) {
      renderSplitModule();
    }
  });

  // Motion toggle
  document.getElementById('motion-toggle')?.addEventListener('click', toggleMotion);

  // Save basket button (will be dynamically added)
  document.addEventListener('click', (e) => {
    if (e.target.closest('#save-basket-btn')) {
      saveCurrentBasket();
    }
  });
}

// ===== PRODUCT GRID =====
function renderProductGrid() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  let products = state.searchQuery
    ? searchProducts(state.searchQuery)
    : (state.activeCategory !== 'all' ? filterByCategory(state.activeCategory) : PRODUCTS);

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full bg-white rounded-2xl p-8 text-center border border-outline/30 shadow-xs">
        <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <span class="material-symbols-outlined text-2xl">search_off</span>
        </div>
        <h4 class="font-bold text-base mb-1">No products match "${state.searchQuery}"</h4>
        <p class="text-xs text-on-surface-muted mb-4">Try searching for milk, bread, eggs, diet coke, maggi, or trigger a live QuickCommerce API query.</p>
        <button type="button" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm" onclick="window.__shopmate.forceLiveSearch('${state.searchQuery.replace(/'/g, "\\'")}')">
          <span class="material-symbols-outlined text-sm">bolt</span>
          Search Live Dark Stores
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map((p, i) => {
    const range = getPriceRange(p.id);
    const lowest = getLowestPrice(p.id);
    const inBasket = state.basket.find(b => b.productId === p.id);
    const qty = inBasket?.quantity || 0;
    const confidence = getMatchConfidence(p);
    const isAlertSet = Boolean(state.priceAlerts[p.id]);

    const hasDiscount = p.mrp && lowest && p.mrp > lowest.price;
    const discountPct = hasDiscount ? Math.round(((p.mrp - lowest.price) / p.mrp) * 100) : 0;
    const platInfo = lowest?.platform ? PLATFORMS[lowest.platform] : null;

    return `
      <div class="product-card-tilt bg-white rounded-xl border border-outline/20 shadow-sm hover:shadow-md transition-all overflow-hidden relative group" data-aos="fade-up" data-aos-delay="${(i % 3) * 80}" data-product-id="${p.id}">
        ${p.isLive ? `
          <div class="absolute top-3 right-3 z-10">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-primary/10 text-primary border border-primary/20 backdrop-blur-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              LIVE API
            </span>
          </div>
        ` : ''}

        <div class="p-4">
          <div class="flex items-start gap-3 mb-3">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 relative overflow-hidden" style="background: ${p.color}15">
              ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" class="w-full h-full object-cover">` : p.emoji}
            </div>
            <div class="flex-1 min-w-0 pr-8">
              <div class="flex items-center gap-1.5">
                <span class="text-xs text-on-surface-muted font-medium">${p.brand}</span>
              </div>
              <div class="text-sm font-bold leading-snug truncate" title="${p.name}">${p.name}</div>
              <div class="text-xs text-on-surface-muted">${p.size} ${p.unit} · ${p.variant}</div>
            </div>
          </div>

          <!-- Price & Best Platform -->
          <div class="flex items-baseline justify-between mb-2">
            <div>
              ${hasDiscount ? `<span class="text-xs text-on-surface-muted line-through mr-1">₹${p.mrp}</span>` : ''}
              <span class="text-base font-extrabold text-primary">₹${lowest?.price ?? '—'}</span>
              ${hasDiscount ? `<span class="text-[10px] font-bold text-secondary ml-1">${discountPct}% off</span>` : ''}
              ${range && range.min !== range.max ? `<span class="text-xs text-on-surface-muted ml-1">₹${range.min}–${range.max}</span>` : ''}
            </div>
            
            <button type="button" class="p-1 rounded-md text-on-surface-muted hover:text-primary transition-colors" onclick="window.__shopmate.togglePriceAlert('${p.id}')" title="${isAlertSet ? 'Remove price drop alert' : 'Notify me on price drop'}">
              <span class="material-symbols-outlined text-base ${isAlertSet ? 'text-primary filled' : ''}">notifications</span>
            </button>
          </div>

          <!-- Best Platform Tag -->
          <div class="flex items-center justify-between mb-3">
            ${platInfo ? `
              <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md" style="background:${platInfo.colorLight}; color:${platInfo.color}">
                <span class="w-1.5 h-1.5 rounded-full" style="background:${platInfo.color}"></span>
                Best on ${platInfo.name}
              </span>
            ` : `<span class="text-[10px] text-on-surface-muted/60">3 platforms compared</span>`}
            <span class="text-[10px] text-on-surface-muted/70">${confidence}% match</span>
          </div>

          <!-- Quantity Stepper / Add CTA -->
          <div>
            ${qty > 0 ? `
              <div class="flex items-center justify-between bg-primary/5 rounded-lg p-1">
                <button class="qty-btn w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary font-bold hover:bg-primary/10 transition-colors" onclick="window.__shopmate.changeQty('${p.id}', -1)" aria-label="Decrease quantity of ${p.brand} ${p.name}">−</button>
                <span class="text-sm font-bold tabular-nums qty-display" id="qty-${p.id}">${qty}</span>
                <button class="qty-btn w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary font-bold hover:bg-primary/10 transition-colors" onclick="window.__shopmate.changeQty('${p.id}', 1)" aria-label="Increase quantity of ${p.brand} ${p.name}">+</button>
              </div>
            ` : `
              <button class="add-btn w-full py-2 rounded-lg border-2 border-primary/20 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-1" onclick="window.__shopmate.addToBasket('${p.id}')" aria-label="Add ${p.brand} ${p.name} to basket">
                <span class="material-symbols-outlined text-base">add</span>Add
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Refresh AOS after DOM change
  if (typeof AOS !== 'undefined') {
    setTimeout(() => AOS.refreshHard(), 50);
  }
}

// ===== CATEGORY CHIPS =====
function renderCategoryChips() {
  const container = document.getElementById('category-chips');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => `
    <button class="category-chip px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
      state.activeCategory === cat.id
        ? 'bg-primary text-white border-primary'
        : 'bg-white text-on-surface-muted border-outline/30 hover:border-primary/30'
    }" onclick="window.__shopmate.setCategory('${cat.id}')">${cat.label}</button>
  `).join('');
}

// ===== BASKET RENDERING =====
function renderBasket() {
  const rowsContainer = document.getElementById('basket-rows');
  const emptyEl = document.getElementById('basket-empty');
  const footerEl = document.getElementById('basket-footer');
  const compareBtn = document.getElementById('compare-btn');
  const thresholdControl = document.getElementById('split-threshold-control');

  const activeItems = state.basket.filter(i => i.quantity > 0);
  const summary = getBasketSummary(state.basket);

  // Update count labels
  document.getElementById('basket-count-label').textContent = `${summary.totalUnits} item${summary.totalUnits !== 1 ? 's' : ''}`;
  document.getElementById('basket-badge').textContent = summary.uniqueProducts;
  document.getElementById('mobile-basket-count').textContent = summary.totalUnits;

  // Show/hide mobile bar
  const mobileBar = document.getElementById('mobile-basket-bar');
  if (mobileBar) mobileBar.style.display = summary.uniqueProducts > 0 ? '' : 'none';

  const deliveryTracker = document.getElementById('free-delivery-tracker');

  if (activeItems.length === 0) {
    emptyEl.classList.remove('hidden');
    rowsContainer.classList.add('hidden');
    footerEl.style.display = 'none';
    if (deliveryTracker) deliveryTracker.classList.add('hidden');
    if (thresholdControl) thresholdControl.style.display = 'none';
    if (compareBtn) compareBtn.disabled = true;
    return;
  }

  emptyEl.classList.add('hidden');
  rowsContainer.classList.remove('hidden');
  footerEl.style.display = '';
  if (deliveryTracker) deliveryTracker.classList.remove('hidden');
  if (thresholdControl) thresholdControl.style.display = '';
  if (compareBtn) compareBtn.disabled = false;

  // Render rows
  rowsContainer.innerHTML = activeItems.map(item => {
    const p = getProduct(item.productId);
    if (!p) return '';
    const lowest = getLowestPrice(item.productId);
    const lineTotal = (lowest?.price || 0) * item.quantity;

    return `
      <div class="basket-row flex items-center gap-3 p-2.5 rounded-lg bg-surface/50 hover:bg-surface transition-colors" data-basket-item="${item.productId}">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style="background:${p.color}15">${p.emoji}</div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold truncate">${p.brand} ${p.name}</div>
          <div class="text-[10px] text-on-surface-muted">${p.size} ${p.unit}</div>
        </div>
        <div class="flex items-center gap-1">
          <button class="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/10" onclick="window.__shopmate.changeQty('${item.productId}', -1)" aria-label="Decrease ${p.name}">−</button>
          <span class="text-xs font-bold tabular-nums w-5 text-center">${item.quantity}</span>
          <button class="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/10" onclick="window.__shopmate.changeQty('${item.productId}', 1)" aria-label="Increase ${p.name}">+</button>
        </div>
        <div class="text-xs font-bold tabular-nums w-12 text-right">₹${lineTotal}</div>
        <button class="p-1 rounded hover:bg-red-50 text-on-surface-muted hover:text-red-500 transition-colors" onclick="window.__shopmate.removeFromBasket('${item.productId}')" aria-label="Remove ${p.name}">
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    `;
  }).join('');

  // Update free delivery bars
  renderFreeDeliveryProgress();

  // Update range hint
  updateBasketHints();
  saveState();
}

function renderFreeDeliveryProgress() {
  const container = document.getElementById('delivery-bars-container');
  const tracker = document.getElementById('free-delivery-tracker');
  if (!container || !tracker) return;

  const activeItems = state.basket.filter(i => i.quantity > 0);
  if (activeItems.length === 0) {
    tracker.classList.add('hidden');
    return;
  }
  tracker.classList.remove('hidden');

  const pids = ['blinkit', 'zepto', 'instamart'];
  container.innerHTML = pids.map(pid => {
    const plat = PLATFORMS[pid];
    const comp = computeForPlatform(activeItems, pid);
    const subtotal = comp.items;
    const threshold = plat.freeDeliveryThreshold;
    const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
    const isFree = subtotal >= threshold;
    const remaining = Math.max(0, threshold - subtotal);

    return `
      <div>
        <div class="flex items-center justify-between text-[11px] mb-1">
          <span class="font-bold flex items-center gap-1.5" style="color: ${plat.color}">
            <span class="w-1.5 h-1.5 rounded-full" style="background:${plat.color}"></span>
            ${plat.name} (₹${threshold})
          </span>
          <span class="font-semibold ${isFree ? 'text-secondary font-bold' : 'text-on-surface-muted'}">
            ${isFree ? '🎉 Free Delivery Unlocked!' : `Add ₹${remaining} for Free Delivery`}
          </span>
        </div>
        <div class="w-full bg-outline/30 rounded-full h-1.5 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: ${isFree ? 'var(--secondary)' : plat.color}"></div>
        </div>
      </div>
    `;
  }).join('');
}

function updateBasketHints() {
  const activeItems = state.basket.filter(i => i.quantity > 0);
  if (activeItems.length === 0) return;

  // Quick compute all platforms for range
  const results = Object.keys(PLATFORMS).map(pid => computeForPlatform(activeItems, pid));
  const totals = results.map(r => r.total);
  const minTotal = Math.min(...totals);
  const maxTotal = Math.max(...totals);

  document.getElementById('basket-range').textContent = `₹${minTotal} – ₹${maxTotal}`;

  // Subtotal hint (average)
  const subtotals = results.map(r => r.items);
  const avgSubtotal = Math.round(subtotals.reduce((a, b) => a + b, 0) / subtotals.length);
  document.getElementById('basket-subtotal-hint').textContent = `~₹${avgSubtotal}`;
}

// ===== LIVE SEARCH & QUICKCOMMERCE API HANDLERS =====
async function handleProductSearch(query) {
  state.searchQuery = query;
  const clearBtn = document.getElementById('clear-search-btn');
  const spinner = document.getElementById('search-spinner');
  const searchIcon = document.getElementById('search-icon');
  const isLiveEnabled = document.getElementById('live-search-toggle')?.checked ?? API_CONFIG.isLiveEnabled;

  if (clearBtn) {
    clearBtn.classList.toggle('hidden', !query);
  }

  // If live search is enabled and query has 2+ characters, query live API
  if (isLiveEnabled && query && query.trim().length >= 2) {
    if (spinner) spinner.classList.remove('hidden');
    if (searchIcon) searchIcon.classList.add('hidden');

    try {
      const res = await searchCrossPlatform({
        query: query.trim(),
        lat: API_CONFIG.lat,
        lon: API_CONFIG.lon,
        apiKey: API_CONFIG.apiKey
      });

      if (res.success && res.items && res.items.length > 0) {
        res.items.forEach(item => {
          registerProduct(item.product, item.offers);
        });
      }
    } catch (err) {
      console.warn('QuickCommerce API live search error:', err);
    } finally {
      if (spinner) spinner.classList.add('hidden');
      if (searchIcon) searchIcon.classList.remove('hidden');
    }
  }

  renderProductGrid();
}

async function forceLiveSearch(query) {
  const searchInput = document.getElementById('product-search');
  if (searchInput && query) {
    searchInput.value = query;
  }
  const spinner = document.getElementById('search-spinner');
  if (spinner) spinner.classList.remove('hidden');

  try {
    const res = await searchCrossPlatform({
      query: query || 'milk',
      lat: API_CONFIG.lat,
      lon: API_CONFIG.lon,
      apiKey: API_CONFIG.apiKey
    });

    if (res.success && res.items && res.items.length > 0) {
      res.items.forEach(item => {
        registerProduct(item.product, item.offers);
      });
      showToast(`Found ${res.items.length} items from QuickCommerce API!`);
    } else {
      showToast('No items returned from live feed.');
    }
  } catch (e) {
    showToast(`API error: ${e.message}`);
  } finally {
    if (spinner) spinner.classList.add('hidden');
    renderProductGrid();
  }
}

function togglePriceAlert(productId) {
  const product = getProduct(productId);
  if (!product) return;
  state.priceAlerts[productId] = !state.priceAlerts[productId];
  saveState();
  renderProductGrid();
  showToast(state.priceAlerts[productId]
    ? `Price alert set for ${product.brand} ${product.name}!`
    : `Price alert removed for ${product.brand} ${product.name}`);
}

// ===== API SETTINGS & DIAGNOSTICS CONTROLS =====
function initApiControls() {
  updateApiStatusBar();

  // Open modal button
  document.getElementById('open-api-modal-btn')?.addEventListener('click', () => {
    const keyInput = document.getElementById('qc-api-key');
    const latInput = document.getElementById('qc-lat');
    const lonInput = document.getElementById('qc-lon');
    if (keyInput) keyInput.value = API_CONFIG.apiKey;
    if (latInput) latInput.value = API_CONFIG.lat;
    if (lonInput) lonInput.value = API_CONFIG.lon;
    updateCurlPreview();
    openModal('api-config-modal');
  });

  // Toggle key visibility
  document.getElementById('toggle-key-visibility')?.addEventListener('click', () => {
    const keyInput = document.getElementById('qc-api-key');
    const icon = document.getElementById('key-vis-icon');
    if (!keyInput || !icon) return;
    if (keyInput.type === 'password') {
      keyInput.type = 'text';
      icon.textContent = 'visibility_off';
    } else {
      keyInput.type = 'password';
      icon.textContent = 'visibility';
    }
  });

  // Use GPS button
  document.getElementById('use-gps-btn')?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser');
      return;
    }
    showToast('Detecting location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lon = parseFloat(pos.coords.longitude.toFixed(4));
        const latInput = document.getElementById('qc-lat');
        const lonInput = document.getElementById('qc-lon');
        if (latInput) latInput.value = lat;
        if (lonInput) lonInput.value = lon;
        updateCurlPreview();
        showToast(`Coordinates set to ${lat}, ${lon}`);
      },
      (err) => {
        showToast(`Location error: ${err.message}`);
      },
      { timeout: 8000 }
    );
  });

  // Real-time curl preview update
  ['qc-api-key', 'qc-lat', 'qc-lon'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateCurlPreview);
  });

  // Test Connection button
  document.getElementById('test-qc-api-btn')?.addEventListener('click', async () => {
    const keyInput = document.getElementById('qc-api-key');
    const latInput = document.getElementById('qc-lat');
    const lonInput = document.getElementById('qc-lon');
    const resBox = document.getElementById('api-test-result');
    const spinner = document.getElementById('test-api-spinner');

    const key = keyInput?.value?.trim() || '';
    const lat = parseFloat(latInput?.value) || 12.90;
    const lon = parseFloat(lonInput?.value) || 77.66;

    if (spinner) spinner.classList.add('animate-spin');
    if (resBox) resBox.innerHTML = '<span class="text-primary font-semibold">Pinging quickcommerceapi.com (milk, BlinkIt)...</span>';

    try {
      const result = await testApiConnection(key, lat, lon);
      if (spinner) spinner.classList.remove('animate-spin');

      if (!resBox) return;

      if (result.ok) {
        resBox.innerHTML = `
          <div class="text-left w-full space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-secondary font-bold">✓ 200 OK (${result.latency}ms)</span>
              <span class="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded font-bold">Connected</span>
            </div>
            <div class="text-[11px] text-on-surface truncate">Platform: BlinkIt · lat: ${lat}, lon: ${lon}</div>
            <div class="text-[10px] text-on-surface-muted truncate">Response: Received live inventory data successfully</div>
          </div>
        `;
      } else if (result.status === 401) {
        resBox.innerHTML = `
          <div class="text-left w-full space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-warning font-bold">⚠ 401 Unauthorized (${result.latency || 0}ms)</span>
              <span class="text-[10px] bg-warning/10 text-warning px-2 py-0.5 rounded font-bold">Live Key Required</span>
            </div>
            <div class="text-[11px] text-on-surface">${result.error || 'API key required'}</div>
            <div class="text-[10px] text-on-surface-muted">Tip: Paste your active sk_live_... key to query live store servers.</div>
          </div>
        `;
      } else {
        resBox.innerHTML = `
          <div class="text-left w-full space-y-1">
            <span class="text-red-500 font-bold">✕ Error (${result.status || 'Network'})</span>
            <div class="text-[11px] text-on-surface">${result.error || 'Connection failed'}</div>
          </div>
        `;
      }
    } catch (err) {
      if (spinner) spinner.classList.remove('animate-spin');
      if (resBox) resBox.innerHTML = `<span class="text-red-500 font-bold">Error: ${err.message}</span>`;
    }
  });

  // Copy curl button
  document.getElementById('copy-curl-btn')?.addEventListener('click', () => {
    const code = document.getElementById('curl-preview-code')?.textContent || '';
    navigator.clipboard.writeText(code).then(() => {
      showToast('Curl command copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy to clipboard');
    });
  });

  // Save Settings button
  document.getElementById('save-qc-api-btn')?.addEventListener('click', () => {
    const key = document.getElementById('qc-api-key')?.value || '';
    const lat = document.getElementById('qc-lat')?.value || '12.90';
    const lon = document.getElementById('qc-lon')?.value || '77.66';

    saveApiConfig({
      apiKey: key,
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    });

    updateApiStatusBar();
    showToast('QuickCommerce API configuration saved!');
    closeModal('api-config-modal');
  });

  // Live Search toggle
  document.getElementById('live-search-toggle')?.addEventListener('change', (e) => {
    saveApiConfig({ isLiveEnabled: e.target.checked });
    showToast(e.target.checked ? 'Live Search enabled' : 'Local Catalog search enabled');
  });
}

function updateCurlPreview() {
  const key = document.getElementById('qc-api-key')?.value?.trim() || 'sk_live_...';
  const lat = document.getElementById('qc-lat')?.value?.trim() || '12.90';
  const lon = document.getElementById('qc-lon')?.value?.trim() || '77.66';
  const preview = document.getElementById('curl-preview-code');
  if (preview) {
    preview.textContent = `curl -H "X-API-Key: ${key}" \\\n  "https://api.quickcommerceapi.com/v1/search?q=milk&platform=BlinkIt&lat=${lat}&lon=${lon}"`;
  }
}

function updateApiStatusBar() {
  const badge = document.getElementById('api-status-badge');
  const dot = document.getElementById('api-status-dot');
  const coords = document.getElementById('api-coords-display');
  const liveToggle = document.getElementById('live-search-toggle');

  if (coords) {
    coords.textContent = `${API_CONFIG.lat.toFixed(2)}, ${API_CONFIG.lon.toFixed(2)}`;
  }
  if (liveToggle) {
    liveToggle.checked = API_CONFIG.isLiveEnabled;
  }

  if (API_CONFIG.apiKey && API_CONFIG.apiKey.startsWith('sk_')) {
    if (badge) {
      badge.textContent = 'v1 Live Active';
      badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
    }
    if (dot) {
      dot.className = 'absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse';
    }
  } else {
    if (badge) {
      badge.textContent = 'v1 Ready (Demo/Key)';
      badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200';
    }
    if (dot) {
      dot.className = 'absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white';
    }
  }
}

// ===== BASKET OPERATIONS =====
function addToBasket(productId) {
  const existing = state.basket.find(i => i.productId === productId);
  if (existing) {
    existing.quantity++;
  } else {
    state.basket.push({ productId, quantity: 1 });
  }
  renderBasket();
  renderProductGrid();
  updateHeroCard();
  updateMarquee();

  // Dispatch event for animations
  document.dispatchEvent(new CustomEvent('shopmate:basket-add', { detail: { productId } }));
}

function changeQty(productId, delta) {
  const item = state.basket.find(i => i.productId === productId);
  if (!item) return;
  item.quantity = Math.max(0, item.quantity + delta);
  if (item.quantity === 0) {
    state.basket = state.basket.filter(i => i.productId !== productId);
  }
  renderBasket();
  renderProductGrid();
  updateHeroCard();
  updateMarquee();

  document.dispatchEvent(new CustomEvent('shopmate:basket-change', { detail: { productId, quantity: item.quantity } }));
}

function removeFromBasket(productId) {
  state.basket = state.basket.filter(i => i.productId !== productId);
  renderBasket();
  renderProductGrid();
  updateHeroCard();
  updateMarquee();

  document.dispatchEvent(new CustomEvent('shopmate:basket-remove', { detail: { productId } }));
}

// ===== CATEGORY FILTER =====
function setCategory(categoryId) {
  state.activeCategory = categoryId;
  state.searchQuery = '';
  const searchInput = document.getElementById('product-search');
  if (searchInput) searchInput.value = '';
  renderCategoryChips();
  renderProductGrid();
}

// ===== COMPARISON FLOW =====
async function runComparison() {
  const activeItems = state.basket.filter(i => i.quantity > 0);
  if (activeItems.length === 0) return;

  const btn = document.getElementById('compare-btn');
  const btnContent = document.getElementById('compare-btn-content');
  const progress = document.getElementById('compare-progress');
  if (!btn) return;

  btn.disabled = true;

  // Dispatch start event
  document.dispatchEvent(new CustomEvent('shopmate:route-start'));

  // Step sequence
  const steps = [
    { text: 'Building basket...', progress: 0.2 },
    { text: 'Matching products...', progress: 0.4 },
    { text: 'Checking availability...', progress: 0.6 },
    { text: 'Calculating final cost...', progress: 0.8 },
    { text: 'Finding best option...', progress: 1.0 }
  ];

  for (let i = 0; i < steps.length; i++) {
    btnContent.innerHTML = `<span class="material-symbols-outlined text-lg animate-spin">sync</span> ${steps[i].text}`;

    if (typeof gsap !== 'undefined') {
      gsap.to(progress, { scaleX: steps[i].progress, duration: 0.4, ease: 'power2.out' });
    } else {
      progress.style.transform = `scaleX(${steps[i].progress})`;
    }

    document.dispatchEvent(new CustomEvent('shopmate:route-step', { detail: { index: i } }));

    await sleep(450);
  }

  // Compute results
  state.comparisonResults = computeBasket(activeItems);
  state.splitResult = computeSplit(activeItems, state.preferences.minimumSplitSavings);

  // Get winner
  const ranked = state.comparisonResults.ranked[state.comparisonMode];
  const winner = ranked[0];

  // Dispatch complete
  document.dispatchEvent(new CustomEvent('shopmate:route-complete', {
    detail: { winner: winner.platform }
  }));

  // Reset button
  await sleep(300);
  btnContent.innerHTML = `<span class="material-symbols-outlined text-lg">check_circle</span> Comparison Complete`;
  if (typeof gsap !== 'undefined') {
    gsap.to(progress, { scaleX: 0, duration: 0.3 });
  } else {
    progress.style.transform = 'scaleX(0)';
  }

  await sleep(500);
  btnContent.innerHTML = `<span class="material-symbols-outlined text-lg">compare_arrows</span> Compare Prices`;
  btn.disabled = false;

  // Save to history
  addToHistory(winner);

  // Show dashboard
  showDashboard();

  // Scroll to dashboard
  document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' });

  showToast(`${winner.platformName} wins with ₹${winner.total}!`);
}

function showDashboard() {
  const section = document.getElementById('dashboard-section');
  if (!section || !state.comparisonResults) return;

  section.style.display = '';

  const activeItems = state.basket.filter(i => i.quantity > 0);
  const summary = getBasketSummary(state.basket);

  // Update dashboard info
  document.getElementById('dashboard-basket-info').textContent =
    `${summary.uniqueProducts} products • ${summary.totalUnits} items • ${state.location?.label || 'Unknown'}`;

  renderRecommendation();
  renderPlatformCards();
  renderComparisonMatrix();
  renderFeeScorecard();
  renderSplitModule();

  // Refresh AOS
  if (typeof AOS !== 'undefined') {
    setTimeout(() => AOS.refreshHard(), 100);
  }
}

// ===== MODE SWITCHING =====
function setCompareMode(mode) {
  state.comparisonMode = mode;

  // Update tab styles
  document.querySelectorAll('.mode-tab').forEach(tab => {
    const isActive = tab.dataset.mode === mode;
    tab.setAttribute('aria-pressed', isActive);
    tab.classList.toggle('text-white', isActive);
    tab.classList.toggle('text-on-surface-muted', !isActive);
  });

  // Move pill indicator
  const activeTab = document.querySelector(`.mode-tab[data-mode="${mode}"]`);
  const pill = document.getElementById('mode-pill');
  if (activeTab && pill) {
    const tabRect = activeTab.getBoundingClientRect();
    const containerRect = activeTab.parentElement.getBoundingClientRect();
    pill.style.width = `${tabRect.width}px`;
    pill.style.height = `${tabRect.height}px`;
    pill.style.left = `${tabRect.left - containerRect.left}px`;
    pill.style.top = `${tabRect.top - containerRect.top}px`;
  }

  if (state.comparisonResults) {
    renderRecommendation();
    renderPlatformCards();
  }

  // Dispatch for 3D scene
  const ranked = state.comparisonResults?.ranked[mode];
  if (ranked) {
    document.dispatchEvent(new CustomEvent('shopmate:mode-change', {
      detail: { mode, winner: ranked[0].platform }
    }));
  }
}

// ===== RECOMMENDATION =====
function renderRecommendation() {
  if (!state.comparisonResults) return;

  const ranked = state.comparisonResults.ranked[state.comparisonMode];
  const winner = ranked[0];
  const allResults = state.comparisonResults.results;
  const reasons = getRecommendationReasons(winner, allResults, state.comparisonMode);
  const maxTotal = Math.max(...allResults.map(r => r.total));
  const savings = maxTotal - winner.total;

  document.getElementById('rec-platform-name').textContent = winner.platformName;
  document.getElementById('rec-total').textContent = `₹${winner.total}`;
  document.getElementById('rec-explanation').textContent = getModeExplanation(winner, allResults, state.comparisonMode);
  document.getElementById('rec-savings-text').textContent = savings > 0 ? `Save ₹${savings} vs most expensive` : 'Best option available';
  document.getElementById('rec-stock').textContent = `${winner.inStockCount}/${winner.totalProducts} available`;
  document.getElementById('rec-eta').textContent = `${winner.eta} min ETA`;
  document.getElementById('continue-platform-name').textContent = winner.platformName;

  // Render reasons
  const reasonsEl = document.getElementById('rec-reasons');
  reasonsEl.innerHTML = reasons.map(r => `
    <div class="flex items-center gap-2 text-sm">
      <span class="material-symbols-outlined text-secondary text-base filled">check_circle</span>
      <span>${r}</span>
    </div>
  `).join('');

  // Animate numbers if GSAP available
  if (typeof gsap !== 'undefined' && state.motionEnabled) {
    animateNumber(document.getElementById('rec-total'), winner.total, { prefix: '₹' });
    if (savings > 0) {
      animateNumber(document.getElementById('rec-savings-text'), savings, { prefix: 'Save ₹', suffix: ' vs most expensive' });
    }
  }
}

// ===== PLATFORM CARDS =====
function renderPlatformCards() {
  const container = document.getElementById('platform-cards');
  if (!container || !state.comparisonResults) return;

  const ranked = state.comparisonResults.ranked[state.comparisonMode];

  container.innerHTML = ranked.map((r, i) => {
    const platform = PLATFORMS[r.platform];
    const isWinner = r.isWinner;
    const modeLabels = { cheapest: 'Lowest Total', fastest: 'Fastest', bestValue: 'Best Value' };

    return `
      <div class="bg-white rounded-2xl border border-outline/20 overflow-hidden transition-all ${
        isWinner ? 'winner-border platform-card-win shadow-xl' : 'platform-card-dim shadow-md'
      }" data-aos="fade-up" data-aos-delay="${i * 150}" id="platform-card-${r.platform}">
        <div class="p-5">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style="background:${platform.color}">
                ${platform.name.charAt(0)}
              </div>
              <span class="font-bold">${platform.name}</span>
            </div>
            ${isWinner ? `<span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase text-white" style="background:${platform.color}">${modeLabels[state.comparisonMode]}</span>` : ''}
          </div>

          <div class="text-3xl font-extrabold mb-1 animate-num" style="color:${platform.color}">₹${r.total}</div>
          <div class="text-xs text-on-surface-muted mb-4">${r.eta} min • ${r.inStockCount}/${r.totalProducts} available</div>

          ${r.missing.length > 0 ? `
            <div class="text-xs text-red-500 mb-3 flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">warning</span>
              Missing: ${r.missing.map(m => m.name).join(', ')}
            </div>
          ` : ''}

          <div class="space-y-1.5 text-xs fee-stagger">
            <div class="fee-row flex justify-between"><span class="text-on-surface-muted">Items</span><span class="font-semibold">₹${r.items}</span></div>
            ${r.promo > 0 ? `<div class="fee-row flex justify-between"><span class="text-secondary">Promo</span><span class="font-semibold text-secondary">−₹${r.promo}</span></div>` : ''}
            <div class="fee-row flex justify-between"><span class="text-on-surface-muted">Delivery</span><span class="font-semibold">${r.deliveryLabel}</span></div>
            <div class="fee-row flex justify-between"><span class="text-on-surface-muted">Platform fee</span><span class="font-semibold">₹${r.platformFee}</span></div>
            <div class="fee-row flex justify-between border-t border-outline/20 pt-1.5 mt-1.5"><span class="font-bold">Total</span><span class="font-extrabold" style="color:${platform.color}">₹${r.total}</span></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Init mode pill position
  setTimeout(() => setCompareMode(state.comparisonMode), 50);

  // Animate fee rows
  setTimeout(() => {
    container.querySelectorAll('.fee-row').forEach((row, i) => {
      setTimeout(() => row.classList.add('visible'), i * 80);
    });
  }, 300);
}

// ===== COMPARISON MATRIX =====
function renderComparisonMatrix() {
  const tbody = document.getElementById('matrix-body');
  if (!tbody || !state.comparisonResults) return;

  const activeItems = state.basket.filter(i => i.quantity > 0);
  const platformIds = Object.keys(PLATFORMS);

  tbody.innerHTML = activeItems.map(item => {
    const p = getProduct(item.productId);
    if (!p) return '';

    const prices = platformIds.map(pid => {
      const offer = OFFERS[item.productId]?.[pid];
      return { pid, price: offer?.price, inStock: offer?.inStock ?? false };
    });

    const inStockPrices = prices.filter(pp => pp.inStock).map(pp => pp.price);
    const minPrice = inStockPrices.length > 0 ? Math.min(...inStockPrices) : null;

    return `
      <tr class="border-b border-outline/10 hover:bg-surface/30 transition-colors">
        <td class="p-4">
          <div class="flex items-center gap-2">
            <span class="text-lg">${p.emoji}</span>
            <div>
              <div class="text-sm font-semibold">${p.brand} ${p.name}</div>
              <div class="text-xs text-on-surface-muted">${p.size} ${p.unit} × ${item.quantity}</div>
            </div>
          </div>
        </td>
        ${prices.map(pp => `
          <td class="p-4 text-center">
            ${!pp.inStock ? `<span class="text-xs text-red-400">Out of stock</span>` :
              `<span class="text-sm font-bold ${pp.price === minPrice ? 'text-secondary' : ''}"}>₹${pp.price}${pp.price === minPrice ? ' ✓' : ''}</span>`}
          </td>
        `).join('')}
      </tr>
    `;
  }).join('');
}

// ===== FEE SCORECARD =====
function renderFeeScorecard() {
  const container = document.getElementById('fee-scorecards');
  if (!container || !state.comparisonResults) return;

  const ranked = state.comparisonResults.ranked[state.comparisonMode];
  const maxTotal = Math.max(...ranked.map(r => r.total));

  container.innerHTML = ranked.map(r => {
    const platform = PLATFORMS[r.platform];
    const barWidth = maxTotal > 0 ? ((r.total / maxTotal) * 100) : 100;

    return `
      <div class="bg-white rounded-xl p-4 border border-outline/20 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style="background:${platform.color}">${platform.name.charAt(0)}</div>
          <span class="text-sm font-bold">${platform.name}</span>
          <span class="text-xs font-bold ml-auto" style="color:${platform.color}">₹${r.total}</span>
        </div>
        <div class="w-full bg-surface-dim rounded-full h-1.5 mb-3">
          <div class="score-bar h-full rounded-full" style="background:${platform.color}; width:${barWidth}%"></div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div><span class="text-on-surface-muted">ETA</span> <strong>${r.eta} min</strong></div>
          <div><span class="text-on-surface-muted">Stock</span> <strong>${r.inStockCount}/${r.totalProducts}</strong></div>
          <div><span class="text-on-surface-muted">Delivery</span> <strong>${r.deliveryLabel}</strong></div>
          <div><span class="text-on-surface-muted">Promo</span> <strong>${r.promo > 0 ? `−₹${r.promo}` : 'None'}</strong></div>
        </div>
      </div>
    `;
  }).join('');

  // Animate score bars
  setTimeout(() => {
    container.querySelectorAll('.score-bar').forEach(bar => bar.classList.add('filled'));
  }, 300);
}

// ===== SPLIT MODULE =====
function renderSplitModule() {
  const container = document.getElementById('split-module');
  if (!container) return;

  const activeItems = state.basket.filter(i => i.quantity > 0);
  state.splitResult = computeSplit(activeItems, state.preferences.minimumSplitSavings);
  const split = state.splitResult;

  if (split.worthIt && split.split) {
    const s = split.split;
    container.innerHTML = `
      <div class="bg-gradient-to-br from-primary/5 to-secondary-container/10 rounded-2xl p-6 sm:p-8 border border-primary/20">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-outlined text-primary filled">call_split</span>
          <span class="text-xs font-bold text-primary uppercase tracking-wider">Smart Basket Split</span>
        </div>
        <h3 class="text-xl font-extrabold mb-2">There's a cheaper combination.</h3>
        <p class="text-sm text-on-surface-muted mb-6">Splitting your order across two apps saves you real money.</p>

        <div class="grid sm:grid-cols-2 gap-4 mb-6">
          <div class="bg-white rounded-xl p-4 border border-outline/20">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded-md text-white text-[10px] font-bold flex items-center justify-center" style="background:${s.platform1Color}">${s.platform1Name.charAt(0)}</div>
              <span class="text-sm font-bold">${s.platform1Name}</span>
            </div>
            <div class="text-xs text-on-surface-muted mb-1">${s.basket1.length} items</div>
            <div class="text-lg font-extrabold" style="color:${s.platform1Color}">₹${s.result1.total}</div>
          </div>
          <div class="bg-white rounded-xl p-4 border border-outline/20">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded-md text-white text-[10px] font-bold flex items-center justify-center" style="background:${s.platform2Color}">${s.platform2Name.charAt(0)}</div>
              <span class="text-sm font-bold">${s.platform2Name}</span>
            </div>
            <div class="text-xs text-on-surface-muted mb-1">${s.basket2.length} items</div>
            <div class="text-lg font-extrabold" style="color:${s.platform2Color}">₹${s.result2.total}</div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 border border-outline/20 mb-4">
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="text-on-surface-muted">Split total</span><span class="font-bold">₹${split.splitTotal}</span>
          </div>
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="text-on-surface-muted">Best single store</span><span class="font-bold">₹${split.bestSingleTotal}</span>
          </div>
          <div class="flex items-center justify-between text-sm font-bold text-secondary">
            <span>You save</span><span>₹${split.savings}</span>
          </div>
          <div class="text-xs text-on-surface-muted mt-2">⚠️ Tradeoff: 2 separate deliveries</div>
        </div>

        <div class="flex gap-3">
          <button class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white text-sm font-bold shadow-md hover:shadow-lg transition-all" onclick="window.__shopmate.showToast('Split basket selected! (Demo)')">Use Split Basket</button>
          <button class="px-5 py-2.5 rounded-xl border border-outline/40 text-sm font-semibold hover:bg-surface transition-colors" onclick="window.__shopmate.showToast('Keeping single store order')">Keep One Store</button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="bg-surface rounded-2xl p-6 sm:p-8 border border-outline/20">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-symbols-outlined text-on-surface-muted">call_split</span>
          <span class="text-xs font-bold text-on-surface-muted uppercase tracking-wider">Smart Basket Split</span>
        </div>
        <h3 class="text-lg font-bold mb-2">Split not worth it</h3>
        <p class="text-sm text-on-surface-muted mb-4">Splitting your basket across apps would not save enough (minimum ₹${state.preferences.minimumSplitSavings} threshold).</p>
        <div class="flex items-center gap-6 text-sm">
          <div>
            <div class="text-xs text-on-surface-muted">Best single</div>
            <div class="font-bold">₹${split.bestSingleTotal} (${split.bestSinglePlatform})</div>
          </div>
          <div>
            <div class="text-xs text-on-surface-muted">Best split</div>
            <div class="font-bold">₹${split.splitTotal}</div>
          </div>
          <div>
            <div class="text-xs text-on-surface-muted">Difference</div>
            <div class="font-bold">${split.savings > 0 ? `₹${split.savings}` : '₹0'}</div>
          </div>
        </div>
        <div class="mt-4">
          <svg class="balance-scale w-16 h-16 mx-auto" viewBox="0 0 64 64" fill="none">
            <line x1="32" y1="8" x2="32" y2="48" stroke="#d4d4e8" stroke-width="2"/>
            <line x1="12" y1="24" x2="52" y2="24" stroke="#d4d4e8" stroke-width="2"/>
            <circle cx="12" cy="32" r="8" fill="#f0f0f6" stroke="#d4d4e8" stroke-width="1.5"/>
            <circle cx="52" cy="28" r="8" fill="#ecfdf5" stroke="#006c49" stroke-width="1.5"/>
            <text x="12" y="35" text-anchor="middle" font-size="6" fill="#64648c">Split</text>
            <text x="52" y="31" text-anchor="middle" font-size="6" fill="#006c49">One</text>
            <rect x="28" y="48" width="8" height="4" rx="1" fill="#d4d4e8"/>
          </svg>
        </div>
      </div>
    `;
  }
}

// ===== HERO CARD UPDATE =====
function updateHeroCard() {
  const activeItems = state.basket.filter(i => i.quantity > 0);
  if (activeItems.length === 0) return;

  const summary = getBasketSummary(state.basket);
  const summaryEl = document.getElementById('hero-basket-summary');
  if (summaryEl) summaryEl.textContent = `${summary.uniqueProducts} products • ${summary.totalUnits} items`;

  const results = Object.keys(PLATFORMS).map(pid => computeForPlatform(activeItems, pid));
  const totals = results.map(r => r.total);
  const maxTotal = Math.max(...totals);

  // Update bars and prices
  results.forEach(r => {
    const barEl = document.getElementById(`hero-bar-${r.platform}`);
    const priceEl = document.getElementById(`hero-price-${r.platform}`);
    if (barEl) barEl.style.width = `${(r.total / maxTotal) * 100}%`;
    if (priceEl) priceEl.textContent = `₹${r.total}`;
  });

  // Update winner
  const cheapest = results.reduce((a, b) => a.total < b.total ? a : b);
  const savings = maxTotal - cheapest.total;
  const winnerNameEl = document.getElementById('hero-winner-name');
  if (winnerNameEl) winnerNameEl.innerHTML =
    `${cheapest.platformName} — <span class="text-secondary">₹${cheapest.total}</span>`;
  const heroSavingsEl = document.getElementById('hero-savings');
  if (heroSavingsEl) heroSavingsEl.textContent = `₹${savings}`;
}

// ===== MARQUEE UPDATE =====
function updateMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;

  const activeItems = state.basket.filter(i => i.quantity > 0);
  if (activeItems.length === 0) return;

  const results = Object.keys(PLATFORMS).map(pid => computeForPlatform(activeItems, pid));
  const cheapest = results.reduce((a, b) => a.total < b.total ? a : b);
  const summary = getBasketSummary(state.basket);

  const texts = [
    ...results.map(r => `${r.platformName} ₹${r.total} · ${r.eta} min`),
    `🏆 ${cheapest.platformName} wins at ₹${cheapest.total}`,
    `${summary.uniqueProducts} products · ${summary.totalUnits} items`,
    `Save ₹${Math.max(...results.map(r => r.total)) - cheapest.total} with ShopMate`
  ];

  // Duplicate for seamless loop
  const allTexts = [...texts, ...texts];
  track.innerHTML = allTexts.map(t => `<span class="px-2">${t}</span>`).join('');
}

// ===== PRESET LOADING =====
function renderPresetOptions() {
  const select = document.getElementById('preset-select');
  if (!select) return;

  ROUTINE_PRESETS.forEach(preset => {
    const opt = document.createElement('option');
    opt.value = preset.id;
    opt.textContent = `${preset.name} (${preset.items.length} products)`;
    select.appendChild(opt);
  });
}

function loadPreset() {
  const select = document.getElementById('preset-select');
  if (!select || !select.value) return;

  const preset = ROUTINE_PRESETS.find(p => p.id === select.value);
  if (!preset) return;

  // REPLACE basket, not patch
  state.basket = JSON.parse(JSON.stringify(preset.items));
  renderBasket();
  renderProductGrid();
  updateHeroCard();
  updateMarquee();
  showToast(`Loaded "${preset.name}" basket`);
  select.value = '';
}

// ===== LOCATION =====
function renderLocationOptions() {
  const container = document.getElementById('location-options');
  if (!container) return;

  container.innerHTML = LOCATIONS.map(loc => `
    <button class="w-full text-left p-4 rounded-xl border transition-all ${
      state.location?.pincode === loc.pincode
        ? 'border-primary bg-primary/5'
        : 'border-outline/30 hover:border-primary/30'
    }" onclick="window.__shopmate.selectLocation('${loc.pincode}')">
      <div class="flex items-center justify-between">
        <div>
          <div class="font-semibold text-sm">${loc.city}</div>
          <div class="text-xs text-on-surface-muted">${loc.pincode}</div>
        </div>
        ${state.location?.pincode === loc.pincode ? '<span class="material-symbols-outlined text-primary filled">check_circle</span>' : ''}
      </div>
    </button>
  `).join('');
}

function selectLocation(pincode) {
  const loc = LOCATIONS.find(l => l.pincode === pincode);
  if (!loc) return;
  state.location = loc;
  document.getElementById('location-label').textContent = loc.city;
  closeModal('location-modal');
  renderLocationOptions();
  saveState();
  showToast(`Location set to ${loc.label}`);
}

// ===== SAVED BASKETS =====
function saveCurrentBasket() {
  const activeItems = state.basket.filter(i => i.quantity > 0);
  if (activeItems.length === 0) return;

  const name = prompt('Name this basket:') || `Basket ${state.savedBaskets.length + 1}`;
  const ranked = state.comparisonResults?.ranked?.cheapest;
  const winner = ranked?.[0];

  state.savedBaskets.push({
    id: Date.now().toString(),
    name,
    items: JSON.parse(JSON.stringify(activeItems)),
    lastCompared: new Date().toISOString(),
    lastBestPlatform: winner?.platformName || 'Unknown',
    lastTotal: winner?.total || 0,
    estimatedSavings: winner ? Math.max(...state.comparisonResults.results.map(r => r.total)) - winner.total : 0
  });

  saveState();
  renderSavedBaskets();
  showToast(`Basket "${name}" saved!`);
}

function renderSavedBaskets() {
  const grid = document.getElementById('saved-baskets-grid');
  const emptyEl = document.getElementById('saved-empty');
  if (!grid) return;

  const baskets = state.savedBaskets;

  if (baskets.length === 0) {
    grid.innerHTML = '';
    emptyEl?.classList.remove('hidden');
    return;
  }

  emptyEl?.classList.add('hidden');

  grid.innerHTML = baskets.map((b, i) => `
    <div class="bg-white rounded-xl p-5 border border-outline/20 shadow-sm hover:shadow-md transition-all" data-aos="fade-up" data-aos-delay="${i * 100}">
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-bold text-sm">${b.name}</h4>
        <span class="text-xs text-on-surface-muted">${b.items.length} products</span>
      </div>
      ${b.lastTotal ? `
        <div class="flex items-center gap-3 mb-3 text-xs">
          <span class="text-on-surface-muted">Best: <strong>${b.lastBestPlatform}</strong></span>
          <span class="font-bold text-primary">₹${b.lastTotal}</span>
          ${b.estimatedSavings > 0 ? `<span class="text-secondary font-bold">Saved ₹${b.estimatedSavings}</span>` : ''}
        </div>
      ` : ''}
      <div class="flex gap-2">
        <button class="flex-1 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors" onclick="window.__shopmate.loadSavedBasket('${b.id}')">Compare Again</button>
        <button class="px-3 py-2 rounded-lg border border-outline/30 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors" onclick="window.__shopmate.deleteSavedBasket('${b.id}')">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    </div>
  `).join('');
}

function loadSavedBasket(id) {
  const saved = state.savedBaskets.find(b => b.id === id);
  if (!saved) return;
  state.basket = JSON.parse(JSON.stringify(saved.items));
  renderBasket();
  renderProductGrid();
  updateHeroCard();
  updateMarquee();
  showToast(`Loaded "${saved.name}"`);
  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
}

function deleteSavedBasket(id) {
  state.savedBaskets = state.savedBaskets.filter(b => b.id !== id);
  saveState();
  renderSavedBaskets();
  showToast('Basket deleted');
}

// ===== COMPARISON HISTORY =====
function addToHistory(winner) {
  const summary = getBasketSummary(state.basket);
  const maxTotal = Math.max(...state.comparisonResults.results.map(r => r.total));

  state.comparisonHistory.unshift({
    date: new Date().toISOString(),
    products: summary.uniqueProducts,
    items: summary.totalUnits,
    bestPlatform: winner.platformName,
    total: winner.total,
    savings: maxTotal - winner.total
  });

  // Keep last 20
  if (state.comparisonHistory.length > 20) state.comparisonHistory.pop();
  saveState();
}

// ===== MODALS =====
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('active'));

  // Focus trap
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) focusable[0].focus();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  setTimeout(() => { modal.style.display = 'none'; }, 300);
}

// ===== DRAWERS =====
function openDrawer(id) {
  const backdrop = document.getElementById(`${id}-backdrop`);
  const panel = document.getElementById(id);
  if (!backdrop || !panel) return;
  backdrop.classList.add('active');
  panel.classList.add('active');

  const focusable = panel.querySelectorAll('button, [href], input, select, textarea');
  if (focusable.length) focusable[0].focus();
}

function closeDrawer(id) {
  const backdrop = document.getElementById(`${id}-backdrop`);
  const panel = document.getElementById(id);
  if (!backdrop || !panel) return;
  panel.classList.remove('active');
  backdrop.classList.remove('active');
}

// ===== WHY RECOMMENDED DRAWER =====
function openWhyDrawer() {
  if (!state.comparisonResults) return;

  const ranked = state.comparisonResults.ranked[state.comparisonMode];
  const winner = ranked[0];
  const allResults = state.comparisonResults.results;
  const reasons = getRecommendationReasons(winner, allResults, state.comparisonMode);
  const maxTotal = Math.max(...allResults.map(r => r.total));

  const content = document.getElementById('why-drawer-content');
  content.innerHTML = `
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-1">
        <span class="material-symbols-outlined text-secondary filled">verified</span>
        <span class="text-sm font-bold text-secondary">Recommending ${winner.platformName}</span>
      </div>
      <div class="text-3xl font-extrabold mt-2">₹${winner.total}</div>
    </div>

    <h4 class="text-sm font-bold mb-3">Fee Breakdown</h4>
    <div class="space-y-3 mb-6">
      <div class="flex justify-between py-2 border-b border-outline/10 text-sm">
        <span class="text-on-surface-muted">Product subtotal</span>
        <span class="font-bold">₹${winner.items}</span>
      </div>
      ${winner.promo > 0 ? `
        <div class="flex justify-between py-2 border-b border-outline/10 text-sm">
          <span class="text-secondary">${winner.promoLabel}</span>
          <span class="font-bold text-secondary">−₹${winner.promo}</span>
        </div>
      ` : ''}
      <div class="flex justify-between py-2 border-b border-outline/10 text-sm">
        <span class="text-on-surface-muted">Delivery fee</span>
        <span class="font-bold">${winner.deliveryLabel}</span>
      </div>
      <div class="flex justify-between py-2 border-b border-outline/10 text-sm">
        <span class="text-on-surface-muted">Platform fee</span>
        <span class="font-bold">₹${winner.platformFee}</span>
      </div>
      <div class="flex justify-between py-3 bg-secondary/5 rounded-lg px-3 -mx-3 text-sm">
        <span class="font-bold">Estimated total</span>
        <span class="font-extrabold text-secondary text-lg">₹${winner.total}</span>
      </div>
    </div>

    <h4 class="text-sm font-bold mb-3">Why ${winner.platformName}?</h4>
    <p class="text-sm text-on-surface-muted mb-4">
      ${getModeExplanation(winner, allResults, state.comparisonMode)}
    </p>
    <div class="space-y-2 mb-6">
      ${reasons.map(r => `
        <div class="flex items-center gap-2 text-sm">
          <span class="material-symbols-outlined text-secondary text-base filled">check_circle</span>
          <span>${r}</span>
        </div>
      `).join('')}
    </div>

    <div class="bg-surface rounded-xl p-4 text-xs text-on-surface-muted">
      <span class="demo-badge mb-2 inline-flex">DEMO DATA</span>
      <p>All values shown are illustrative. Platform integrations are not connected in this prototype.</p>
    </div>
  `;

  openDrawer('why-drawer');
}

// ===== HANDOFF MODAL =====
function openHandoffModal() {
  if (!state.comparisonResults) return;

  const ranked = state.comparisonResults.ranked[state.comparisonMode];
  const winner = ranked[0];
  const platform = PLATFORMS[winner.platform];
  const summary = getBasketSummary(state.basket);

  const content = document.getElementById('handoff-content');
  content.innerHTML = `
    <p class="text-sm text-on-surface-muted mb-4">You are about to continue with <strong>${winner.platformName}</strong>.</p>

    <div class="bg-surface rounded-xl p-4 mb-4">
      <div class="flex items-center justify-between text-sm mb-2">
        <span class="text-on-surface-muted">${summary.totalUnits} items</span>
        <span class="font-bold">Estimated ₹${winner.total}</span>
      </div>
      <div class="text-xs text-on-surface-muted">${winner.eta} min delivery • ${winner.inStockCount}/${winner.totalProducts} available</div>
    </div>

    <div class="space-y-2 mb-6" id="handoff-items">
      ${winner.itemDetails.map(item => `
        <div class="inject-row text-sm" id="inject-${item.productId}">
          <span class="material-symbols-outlined text-on-surface-muted text-base">radio_button_unchecked</span>
          <span class="flex-1">${item.name} × ${item.quantity}</span>
          <span class="font-semibold tabular-nums">₹${item.lineTotal}</span>
        </div>
      `).join('')}
    </div>

    <div class="flex gap-3">
      <button class="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-md" onclick="window.__shopmate.simulateHandoff('${winner.platform}')" id="open-platform-btn">
        <span class="material-symbols-outlined text-base align-middle mr-1">open_in_new</span>
        Open ${winner.platformName}
      </button>
      <button class="px-5 py-3 rounded-xl border border-outline/40 text-sm font-semibold hover:bg-surface transition-colors" onclick="window.__shopmate.closeModal('handoff-modal')">Keep Comparing</button>
    </div>

    <p class="text-[10px] text-on-surface-muted text-center mt-4">This is a simulated checkout. No real platform connection.</p>
  `;

  openModal('handoff-modal');
}

// ===== SIMULATE HANDOFF =====
async function simulateHandoff(platformId) {
  const items = document.querySelectorAll('.inject-row');
  const btn = document.getElementById('open-platform-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined text-base align-middle mr-1 animate-spin">sync</span> Injecting items...`;
  }

  for (let i = 0; i < items.length; i++) {
    await sleep(400);
    const row = items[i];
    row.classList.add('injected');
    const icon = row.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.textContent = 'check_circle';
      icon.classList.add('text-secondary', 'filled');
    }
    if (btn) btn.innerHTML = `<span class="material-symbols-outlined text-base align-middle mr-1 animate-spin">sync</span> Injecting items... ${i + 1}/${items.length}`;
  }

  await sleep(500);

  // Show success
  if (btn) {
    btn.innerHTML = `
      <svg class="success-check inline-block mr-2" viewBox="0 0 52 52" style="width:24px;height:24px">
        <circle class="circle" cx="26" cy="26" r="24" fill="none" stroke="white" stroke-width="2"/>
        <path class="check" d="M14 27 L22 35 L38 17" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Done!
    `;
  }

  await sleep(1500);
  closeModal('handoff-modal');
}

// ===== TOAST =====
function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===== MOTION TOGGLE =====
function toggleMotion() {
  state.motionEnabled = !state.motionEnabled;
  document.body.classList.toggle('motion-off', !state.motionEnabled);
  updateMotionToggle();
  saveState();

  // Dispatch for 3D scenes
  document.dispatchEvent(new CustomEvent('shopmate:motion-toggle', {
    detail: { enabled: state.motionEnabled }
  }));

  showToast(state.motionEnabled ? 'Motion effects enabled' : 'Motion effects disabled');
}

function updateMotionToggle() {
  const label = document.getElementById('motion-toggle-label');
  if (label) {
    label.textContent = state.motionEnabled ? 'Motion' : 'Static';
  }
}

// ===== MOBILE NAV =====
function openMobileNav() {
  const nav = document.getElementById('mobile-nav');
  const panel = nav?.querySelector('.drawer-panel');
  if (nav) nav.classList.add('active');
  if (panel) panel.classList.add('active');
}

function closeMobileNav() {
  const nav = document.getElementById('mobile-nav');
  const panel = nav?.querySelector('.drawer-panel');
  if (panel) panel.classList.remove('active');
  if (nav) nav.classList.remove('active');
}

// ===== ANIMATE NUMBER UTILITY =====
function animateNumber(el, to, opts = {}) {
  if (!el || typeof gsap === 'undefined') return;
  const prefix = opts.prefix || '';
  const suffix = opts.suffix || '';
  const duration = opts.duration || 0.8;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: to,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
    }
  });
}

// ===== HELPERS =====
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== GLOBAL API (for onclick handlers) =====
window.__shopmate = {
  addToBasket,
  changeQty,
  removeFromBasket,
  setCategory,
  selectLocation,
  loadSavedBasket,
  deleteSavedBasket,
  showToast,
  closeModal,
  simulateHandoff,
  saveCurrentBasket,
  togglePriceAlert,
  forceLiveSearch,
  handleProductSearch
};

// ===== EXPORT for motion.js =====
export { state, animateNumber, showToast };

// ===== BOOT =====
document.addEventListener('DOMContentLoaded', () => {
  init();
});
