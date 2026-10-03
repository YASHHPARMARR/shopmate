import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ShopMateProvider } from './context/ShopMateContext';
import { GlobalNav } from './components/GlobalNav';
import { Footer } from './components/Footer';
import { CostBreakdownDrawer } from './components/CostBreakdownDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LocationModal } from './components/LocationModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ComparePage } from './pages/ComparePage';
import { BasketPage } from './pages/BasketPage';
import { ProductPage } from './pages/ProductPage';
import { SavedPage } from './pages/SavedPage';
import { HistoryPage } from './pages/HistoryPage';
import { AlertsPage } from './pages/AlertsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { PreferencesPage } from './pages/PreferencesPage';

// Scroll to top helper on route transitions
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ShopMateProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-[#faf8f5] text-[#121212] font-sans selection:bg-[#581c87] selection:text-white flex flex-col justify-between">
          {/* Persistent Editorial Global Navigation */}
          <GlobalNav />

          {/* Main Route Viewport */}
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/basket" element={<BasketPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/preferences" element={<PreferencesPage />} />
              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Modals & Drawers */}
          <CostBreakdownDrawer />
          <CheckoutModal />
          <LocationModal />
          <ApiSettingsModal />

          {/* Publication-style Editorial Footer */}
          <Footer />
        </div>
      </ShopMateProvider>
    </BrowserRouter>
  );
};

export default App;
