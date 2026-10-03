// src/services/apify.ts — Apify Cloud QuickCommerce Integration Adapter
import type { Product, ProductOffers } from '../types';

export interface ApifyTestResult {
  ok: boolean;
  status: number;
  latencyMs: number;
  message: string;
  user?: {
    username: string;
    fullName?: string;
    email?: string;
    plan: string;
    creditsUsd: number;
  };
}

export const APIFY_ENDPOINT = 'https://api.apify.com/v2';

/**
 * Validates the Apify API token and retrieves user account metadata & credits.
 */
export async function testApifyConnection(token: string): Promise<ApifyTestResult> {
  const start = performance.now();
  if (!token || !token.trim()) {
    return {
      ok: false,
      status: 400,
      latencyMs: 0,
      message: 'Apify token is required (format: apify_api_...)'
    };
  }

  try {
    const res = await fetch(`${APIFY_ENDPOINT}/users/me?token=${encodeURIComponent(token.trim())}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    const latencyMs = Math.round(performance.now() - start);
    const json = await res.json().catch(() => null);

    if (res.ok && json?.data) {
      const data = json.data;
      return {
        ok: true,
        status: res.status,
        latencyMs,
        message: `Connected to Apify Cloud as ${data.profile?.name || data.username} (${data.plan?.id || 'FREE'} Plan).`,
        user: {
          username: data.username,
          fullName: data.profile?.name,
          email: data.email,
          plan: data.plan?.id || 'FREE',
          creditsUsd: data.plan?.monthlyUsageCreditsUsd || 5
        }
      };
    }

    if (res.status === 401) {
      return {
        ok: false,
        status: 401,
        latencyMs,
        message: 'Invalid Apify API token. Verify your token at console.apify.com.'
      };
    }

    return {
      ok: false,
      status: res.status,
      latencyMs,
      message: json?.error?.message || `HTTP ${res.status}`
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      ok: false,
      status: 0,
      latencyMs,
      message: err.message || 'Failed to connect to Apify API'
    };
  }
}

/**
 * Queries Apify cloud datasets or actors for quick-commerce products.
 */
export async function fetchApifyDatasets(token: string): Promise<any[]> {
  if (!token) return [];
  try {
    const res = await fetch(`${APIFY_ENDPOINT}/datasets?token=${encodeURIComponent(token.trim())}&limit=10&desc=true`);
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.items || [];
  } catch (e) {
    console.warn('Apify datasets fetch error:', e);
    return [];
  }
}
