import React, { useState } from 'react';
import { useShopMate } from '../context/ShopMateContext';
import { testConnection } from '../services/api';
import { testApifyConnection, type ApifyTestResult } from '../services/apify';
import { X, Bolt, Copy, Check, Loader2, Network, Cloud, ShieldCheck } from 'lucide-react';

export const ApiSettingsModal: React.FC = () => {
  const {
    isApiModalOpen,
    setApiModalOpen,
    apiKey,
    setApiKey,
    apifyApiKey,
    setApifyApiKey,
    location: activeLocation,
    refreshCatalogWithApi
  } = useShopMate();

  const [activeTab, setActiveTab] = useState<'quickcommerce' | 'apify'>('quickcommerce');
  const [inputKey, setInputKey] = useState(apiKey);
  const [inputApifyKey, setInputApifyKey] = useState(apifyApiKey);
  
  const [testingQc, setTestingQc] = useState(false);
  const [qcTestResult, setQcTestResult] = useState<any>(null);

  const [testingApify, setTestingApify] = useState(false);
  const [apifyTestResult, setApifyTestResult] = useState<ApifyTestResult | null>(null);

  const [copied, setCopied] = useState(false);

  if (!isApiModalOpen) return null;

  const handleTestQc = async () => {
    setTestingQc(true);
    const res = await testConnection(inputKey, activeLocation.lat, activeLocation.lon);
    setTestingQc(false);
    setQcTestResult(res);
  };

  const handleTestApify = async () => {
    setTestingApify(true);
    const res = await testApifyConnection(inputApifyKey);
    setTestingApify(false);
    setApifyTestResult(res);
  };

  const handleSave = () => {
    setApiKey(inputKey);
    setApifyApiKey(inputApifyKey);
    refreshCatalogWithApi(inputKey);
    setApiModalOpen(false);
  };

  const qcCurlCommand = `curl -H "X-API-Key: ${inputKey || '41273e9b-b914-4f43-be72-91fec72153b7'}" \\\n  "https://api.quickcommerceapi.com/v1/search?q=milk&platform=Zepto&lat=${activeLocation.lat}&lon=${activeLocation.lon}"`;
  const apifyCurlCommand = `curl "https://api.apify.com/v2/users/me?token=${inputApifyKey || 'YOUR_APIFY_TOKEN'}"`;

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#121212]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setApiModalOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-[#faf8f5] rounded-3xl border border-[#ded9cb] p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#e5e2da]">
          <div className="flex items-center gap-2">
            <Bolt className="w-4 h-4 text-purple-900" />
            <span className="text-xs font-mono-editorial font-bold uppercase tracking-wider text-[#78766f]">
              DATA INGESTION & CLOUD APIs
            </span>
          </div>
          <button
            onClick={() => setApiModalOpen(false)}
            className="p-1 rounded-lg text-[#78766f] hover:text-[#121212]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('quickcommerce')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono-editorial uppercase font-bold flex items-center justify-center gap-2 border transition-all ${
              activeTab === 'quickcommerce'
                ? 'bg-purple-950 text-white border-purple-950 shadow-xs'
                : 'bg-white text-[#78766f] border-[#ded9cb] hover:border-[#121212]'
            }`}
          >
            <Bolt className="w-3.5 h-3.5" />
            <span>QuickCommerce API</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('apify')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono-editorial uppercase font-bold flex items-center justify-center gap-2 border transition-all ${
              activeTab === 'apify'
                ? 'bg-purple-950 text-white border-purple-950 shadow-xs'
                : 'bg-white text-[#78766f] border-[#ded9cb] hover:border-[#121212]'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Apify Cloud API</span>
          </button>
        </div>

        <div className="py-4 space-y-4">
          {activeTab === 'quickcommerce' ? (
            <>
              <div>
                <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-[#121212]">
                  QuickCommerce Dark Stores Feed
                </h3>
                <p className="text-xs text-[#5a5852] mt-1 leading-relaxed">
                  Real-time multi-platform price, ETA, and stock feeds across Zepto, Swiggy Instamart, JioMart, and BlinkIt.
                </p>
              </div>

              {/* Endpoint display */}
              <div className="p-3 rounded-xl bg-white border border-[#e5e2da] text-xs font-mono-editorial flex items-center justify-between">
                <span className="truncate text-[#4a4944]">GET /v1/search?platform=Zepto|Swiggy|JioMart</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  PARALLEL FETCH
                </span>
              </div>

              {/* API Key Input */}
              <div>
                <label className="block text-xs font-mono-editorial uppercase font-bold text-[#121212] mb-1.5">
                  QuickCommerce API Key (X-API-Key)
                </label>
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="41273e9b-b914-4f43-be72-91fec72153b7"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded9cb] bg-white text-xs font-mono-editorial focus:outline-hidden focus:border-purple-900"
                />
              </div>

              {/* Diagnostics test */}
              <div className="pt-2 border-t border-[#e5e2da]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono-editorial font-bold uppercase text-[#78766f]">
                    Live Dark Store Diagnostics
                  </span>
                  <button
                    type="button"
                    onClick={handleTestQc}
                    disabled={testingQc}
                    className="px-3 py-1.5 rounded-lg bg-[#121212] text-white text-[11px] font-mono-editorial uppercase font-bold hover:bg-purple-950 transition-colors flex items-center gap-1.5"
                  >
                    {testingQc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Network className="w-3.5 h-3.5" />}
                    <span>Test Ping</span>
                  </button>
                </div>

                {qcTestResult && (
                  <div className={`p-3 rounded-xl border text-xs font-mono-editorial ${
                    qcTestResult.ok
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                      : 'bg-red-50/70 border-red-300 text-red-900'
                  }`}>
                    <div className="flex justify-between items-center font-bold mb-1">
                      <span>{qcTestResult.ok ? '✓ 200 OK' : `HTTP ${qcTestResult.status}`}</span>
                      <span>{qcTestResult.latencyMs} ms latency</span>
                    </div>
                    <div className="text-[11px] opacity-90">{qcTestResult.message}</div>
                  </div>
                )}
              </div>

              {/* Curl Command */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono-editorial uppercase font-bold text-[#78766f]">
                    cURL Snippet
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(qcCurlCommand)}
                    className="text-[11px] font-mono-editorial text-purple-900 font-bold hover:underline flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy cURL'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#121212] text-[#faf8f5] text-[11px] font-mono-editorial overflow-x-auto whitespace-pre-wrap">
                  {qcCurlCommand}
                </pre>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-[#121212]">
                  Apify Cloud Crawlers
                </h3>
                <p className="text-xs text-[#5a5852] mt-1 leading-relaxed">
                  Apify web scraping actors and dataset crawlers for automated grocery catalogue indexing and price monitoring.
                </p>
              </div>

              {/* Endpoint display */}
              <div className="p-3 rounded-xl bg-white border border-[#e5e2da] text-xs font-mono-editorial flex items-center justify-between">
                <span className="truncate text-[#4a4944]">https://api.apify.com/v2</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
                  APIFY v2 API
                </span>
              </div>

              {/* Apify API Key Input */}
              <div>
                <label className="block text-xs font-mono-editorial uppercase font-bold text-[#121212] mb-1.5">
                  Apify API Token (?token=)
                </label>
                <input
                  type="text"
                  value={inputApifyKey}
                  onChange={(e) => setInputApifyKey(e.target.value)}
                  placeholder="apify_api_..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ded9cb] bg-white text-xs font-mono-editorial focus:outline-hidden focus:border-purple-900"
                />
                <p className="text-[11px] text-[#78766f] mt-1">
                  Connect your Apify account to leverage cloud scraper actors & dataset storage.
                </p>
              </div>

              {/* Apify Diagnostics test */}
              <div className="pt-2 border-t border-[#e5e2da]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono-editorial font-bold uppercase text-[#78766f]">
                    Apify Connection Test
                  </span>
                  <button
                    type="button"
                    onClick={handleTestApify}
                    disabled={testingApify}
                    className="px-3 py-1.5 rounded-lg bg-[#121212] text-white text-[11px] font-mono-editorial uppercase font-bold hover:bg-purple-950 transition-colors flex items-center gap-1.5"
                  >
                    {testingApify ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>Verify Apify</span>
                  </button>
                </div>

                {apifyTestResult && (
                  <div className={`p-3 rounded-xl border text-xs font-mono-editorial ${
                    apifyTestResult.ok
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                      : 'bg-red-50/70 border-red-300 text-red-900'
                  }`}>
                    <div className="flex justify-between items-center font-bold mb-1">
                      <span>{apifyTestResult.ok ? '✓ Apify Verified' : `HTTP ${apifyTestResult.status}`}</span>
                      <span>{apifyTestResult.latencyMs} ms latency</span>
                    </div>
                    <div className="text-[11px] opacity-90">{apifyTestResult.message}</div>
                    {apifyTestResult.user && (
                      <div className="mt-2 pt-2 border-t border-emerald-200/60 flex flex-wrap gap-2 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          User: {apifyTestResult.user.fullName || apifyTestResult.user.username}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          Plan: {apifyTestResult.user.plan}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          Credits: ${apifyTestResult.user.creditsUsd} USD
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Apify Curl Command */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono-editorial uppercase font-bold text-[#78766f]">
                    Apify cURL Snippet
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(apifyCurlCommand)}
                    className="text-[11px] font-mono-editorial text-purple-900 font-bold hover:underline flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy cURL'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-[#121212] text-[#faf8f5] text-[11px] font-mono-editorial overflow-x-auto whitespace-pre-wrap">
                  {apifyCurlCommand}
                </pre>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-[#e5e2da] flex gap-3">
          <button
            onClick={() => setApiModalOpen(false)}
            className="flex-1 py-3 rounded-xl border border-[#ded9cb] hover:bg-[#edeae1] text-xs font-mono-editorial uppercase font-bold text-[#4a4944]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-purple-950 hover:bg-purple-900 text-white text-xs font-mono-editorial uppercase font-bold transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
