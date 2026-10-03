# ShopMate — Quick-Commerce Decision Engine

> **Tagline:** One Basket. Every App. Best Price.  
> **Aesthetic Philosophy:** Editorial publication storytelling inspired by Atelier's interactive design language, coupled with a deterministic quick-commerce optimization engine underneath.

---

## 1. Executive Summary

**ShopMate** is a major departure from conventional SaaS dashboards and standard e-commerce grid layouts. Rather than acting as a simple price-checker or affiliate storefront, ShopMate functions as an **autonomous decision engine**:
- **Editorial Experience on Top:** Oversized display typography, numbered chapter progressions (`CHPT. 01 — 06`), dramatic whitespace, sparse metadata labels, and scroll-driven revelations that treat the product like an interactive magazine.
- **Decision Engine Underneath:** A multi-platform algorithmic engine that resolves full basket transactions across **Blinkit**, **Zepto**, **Instamart**, and **JioMart** by computing **True Net Effective Cost**, factoring in surge fees, delivery thresholds, small-cart penalties, and cross-store **Smart Basket Splits**.

---

## 2. Core UI & Editorial Design Principles

Inspired conceptually by Atelier (`https://atelier.net/social-mobility/economic-opportunities-for-our-avatars/`):

1. **Editorial Visual Storytelling:** Content unfolds like chapters in a high-fashion or economic publication rather than a software tool.
2. **Oversized Typography:** Massive headlines (`ONE BASKET. EVERY APP. BEST PRICE.`), multi-line broken title structures (`COMPARE LESS. SAVE MORE. SHOP SMARTER.`), and huge pricing statements.
3. **Sparse but Information-Dense:** Generous margins, thin 1px dividers, monospaced metadata (`font-mono-editorial`), and discreet rubric labels.
4. **Persistent Chapter Indicator:** Floating desktop indicator transitioning from `00 / PRELUDE` through `06 / LEARNING` with scroll progress.
5. **Purposeful Purple Accent:** Warm neutral / off-white primary canvas (`#faf8f5`), near-black typography (`#121212`), with restrained purple (`#581c87`) reserved strictly for active states, CTAs, platform selections, and mathematical highlights.

---

## 3. Application Architecture & Routes

ShopMate features 10 fully interactive, dedicated routes:

| Route | View | Description |
|---|---|---|
| `/` | **Home** | Editorial 6-chapter scroll story with interactive narrative simulator, horizontal journey, true cost equation, and platform comparisons. |
| `/compare` | **Compare Engine** | Primary functional decision tool: category filters, 4-platform scorecards, Best Value / Cheapest / Fastest ranking, and item matrices. |
| `/basket` | **Basket Manifest** | Dedicated full-screen basket editor with quantity controls, unit calculations, and one-tap engine trigger. |
| `/product/:id` | **Product Intelligence** | Deep dive on single SKUs: 98% exact match confidence, 4-app price check, 7-day illustrative trend, and price drop monitors. |
| `/saved` | **Saved Baskets** | *"The Baskets You Return To"* — Recurring order manifests (Weekly Groceries, Monthly Essentials) for rapid re-comparison. |
| `/history` | **Savings History** | *"What You've Saved"* — Cumulative financial audit dashboard with ₹1,284 savings metric and chronological timeline. |
| `/alerts` | **Price Alerts** | *"Wait For The Right Price"* — Active surveillance list tracking threshold triggers across dark store inventories. |
| `/how-it-works` | **Methodology** | 5-chapter architectural breakdown: 01 Build, 02 Match, 03 Calculate, 04 Compare, 05 Decide. |
| `/features` | **Feature Stack** | 6 giant stacked sticky editorial panels with Framer Motion scroll stacking and mini UI interactive simulations. |
| `/preferences` | **Preferences** | Editorial personalization tuning: max ETA (10–30 min), minimum split saving threshold, brand biases, and pack defaults. |

---

## 4. Algorithmic Decision Engine

### A. True Cost Calculation
Standard aggregators mislead shoppers by comparing standalone item prices. ShopMate computes the **Effective Net Outflow**:

$$\text{Effective Total} = \sum (\text{Item Price} \times \text{Qty}) - \text{Promotions} + \text{Delivery Fee} + \text{Platform Surcharge} + \text{Small Cart Penalty}$$

- **Delivery Fee:** Waived if item subtotal crosses platform threshold (e.g. ₹199 for Zepto, ₹249 for Blinkit).
- **Small-Cart Penalty:** Applied when subtotal falls below minimum cart size (e.g. +₹25 on orders under ₹99).
- **Platform Handling:** Fixed dark store processing fee (₹4–₹6).

### B. Transparent Ranking Modes
1. **Cheapest Mode:** Strictly selects the platform with the absolute lowest complete-basket effective total.
2. **Fastest Mode:** Selects the dark store with minimum rider turnaround (8–18 minutes) while ensuring all items are in stock.
3. **Best Value Mode:** Deterministically balances arrival time and cost. Explains trade-offs in plain English (e.g. *"₹12 more than cheapest, but 5 minutes faster and all items are in stock"*).

### C. Smart Basket Split Engine
When staple groceries are significantly cheaper on one store and dairy/beverages on another:
1. Calculates single-store optimal total ($C_1$).
2. Partitions items into two sub-orders across Store A and Store B.
3. Adds second delivery fee ($+D_2$) and platform surcharge.
4. If $(\text{Net Dual Total}) < C_1 - \text{Threshold}$, recommends the split.
5. Explicitly communicates the tradeoff: **"Save ₹34, but expect 2 separate deliveries."**

---

## 5. Live QuickCommerce API Integration

### Endpoint Configuration
ShopMate includes an adapter for external quick-commerce providers:
```bash
curl -H "X-API-Key: sk_live_..." \
  "https://api.quickcommerceapi.com/v1/search?q=milk&platform=BlinkIt&lat=23.0225&lon=72.5714"
```

### Data Provenance & Honesty
The UI never fabricates live data or hides mock states. A persistent badge indicates provenance:
- **`DEMO DATA`**: Clean, deterministic reference data simulating dark store catalogs.
- **`ESTIMATED`**: Normalized calculations where specific surge variables are derived.
- **`LIVE`**: Verified against active provider endpoints with timestamp diagnostics.

API keys can be supplied via the interactive settings drawer or via `.env`:
```env
VITE_QUICK_COMMERCE_API_KEY=sk_live_your_key_here
```

---

## 6. Tech Stack & Directory Structure

- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) + Custom Editorial Typography Tokens
- **Motion:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router v7 (`react-router-dom`)
- **Persistence:** LocalStorage (zero remote surveillance of shopping manifests)

```
shopmate/
├── src/
│   ├── assets/              # Static media & reference assets
│   ├── components/          # Reusable editorial components
│   │   ├── ApiSettingsModal.tsx
│   │   ├── ChapterHeader.tsx
│   │   ├── ChapterIndicator.tsx
│   │   ├── CheckoutModal.tsx
│   │   ├── CostBreakdownDrawer.tsx
│   │   ├── DataStatusBadge.tsx
│   │   ├── Footer.tsx
│   │   ├── GlobalNav.tsx
│   │   └── LocationModal.tsx
│   ├── context/             # ShopMateContext & global reactive state
│   ├── data/                # Catalogs, dark store platforms, presets
│   │   ├── catalog.ts
│   │   ├── locations.ts
│   │   └── platforms.ts
│   ├── pages/               # 10 dedicated application routes
│   │   ├── AlertsPage.tsx
│   │   ├── BasketPage.tsx
│   │   ├── ComparePage.tsx
│   │   ├── FeaturesPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── HowItWorksPage.tsx
│   │   ├── PreferencesPage.tsx
│   │   ├── ProductPage.tsx
│   │   └── SavedPage.tsx
│   ├── services/            # Core business logic
│   │   ├── api.ts           # QuickCommerce API client
│   │   ├── engine.ts        # True Cost & Smart Split Engine
│   │   └── storage.ts       # LocalStorage persistence
│   ├── types/               # TypeScript data contracts & models
│   ├── App.tsx              # Router & layout shell
│   ├── index.css            # Editorial design tokens & typography
│   └── main.tsx             # Application bootstrap
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 7. Running Locally

### Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 8. License
ShopMate is built as a state-of-the-art prototype showcasing editorial product design and quick-commerce decision architecture.
