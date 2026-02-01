// External Data API Service for procurement intelligence

const COMMODITIES_API_BASE = 'https://api.api-ninjas.com/v1';
const FINNHUB_API_BASE = 'https://finnhub.io/api/v1';

// API Keys - In production, these should be in environment variables
const API_NINJAS_KEY = import.meta.env.VITE_API_NINJAS_KEY || '';
const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_KEY || '';

// Types
export interface CommodityPrice {
  name: string;
  price: number;
  unit: string;
  exchange: string;
  updated: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  datetime: number;
  summary: string;
  url: string;
  sentiment?: number;
}

export interface MarketSentiment {
  bullishPercent: number;
  bearishPercent: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

// Commodity Price API (API Ninjas - Free tier: 10,000 requests/month)
export async function fetchCommodityPrice(commodity: string): Promise<CommodityPrice | null> {
  try {
    const response = await fetch(
      `${COMMODITIES_API_BASE}/commodityprice?name=${encodeURIComponent(commodity)}`,
      {
        headers: {
          'X-Api-Key': API_NINJAS_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error('Commodity API error:', response.status);
      return null;
    }

    const data = await response.json();
    return {
      name: data.name,
      price: data.price,
      unit: data.unit || 'USD',
      exchange: data.exchange || 'COMEX',
      updated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching commodity price:', error);
    return null;
  }
}

// Fetch multiple commodity prices
export async function fetchMultipleCommodities(commodities: string[]): Promise<CommodityPrice[]> {
  const results = await Promise.all(
    commodities.map(commodity => fetchCommodityPrice(commodity))
  );
  return results.filter((r): r is CommodityPrice => r !== null);
}

// Finnhub News API (Free tier: 60 calls/minute)
export async function fetchMarketNews(category: string = 'general'): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `${FINNHUB_API_BASE}/news?category=${category}&token=${FINNHUB_KEY}`
    );

    if (!response.ok) {
      console.error('Finnhub API error:', response.status);
      return [];
    }

    const data = await response.json();
    return data.slice(0, 10).map((article: any, index: number) => ({
      id: `news-${index}`,
      headline: article.headline,
      source: article.source,
      datetime: article.datetime,
      summary: article.summary,
      url: article.url,
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// Company News (for supplier monitoring)
export async function fetchCompanyNews(symbol: string): Promise<NewsArticle[]> {
  try {
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const to = new Date().toISOString().split('T')[0];

    const response = await fetch(
      `${FINNHUB_API_BASE}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_KEY}`
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.slice(0, 5).map((article: any, index: number) => ({
      id: `company-${symbol}-${index}`,
      headline: article.headline,
      source: article.source,
      datetime: article.datetime,
      summary: article.summary,
      url: article.url,
    }));
  } catch (error) {
    console.error('Error fetching company news:', error);
    return [];
  }
}

// Market Sentiment (Finnhub)
export async function fetchMarketSentiment(symbol: string): Promise<MarketSentiment | null> {
  try {
    const response = await fetch(
      `${FINNHUB_API_BASE}/news-sentiment?symbol=${symbol}&token=${FINNHUB_KEY}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const bullish = data.sentiment?.bullishPercent || 50;
    const bearish = data.sentiment?.bearishPercent || 50;

    return {
      bullishPercent: bullish,
      bearishPercent: bearish,
      sentiment: bullish > 60 ? 'bullish' : bearish > 60 ? 'bearish' : 'neutral',
    };
  } catch (error) {
    console.error('Error fetching sentiment:', error);
    return null;
  }
}

// Free alternative: Fetch metal prices from metals-api (demo mode)
export async function fetchMetalPrices(): Promise<Record<string, number>> {
  // Using a public endpoint for demo - in production use metals-api.com with API key
  try {
    // Simulated prices based on typical market ranges (for demo without API key)
    // In production, replace with actual API call
    return {
      gold: 2024.50 + (Math.random() - 0.5) * 20,
      silver: 23.15 + (Math.random() - 0.5) * 0.5,
      copper: 3.85 + (Math.random() - 0.5) * 0.1,
      aluminum: 2245 + (Math.random() - 0.5) * 30,
      steel: 680 + (Math.random() - 0.5) * 15,
      zinc: 2520 + (Math.random() - 0.5) * 40,
    };
  } catch (error) {
    console.error('Error fetching metal prices:', error);
    return {};
  }
}

// India-specific: Fetch from BigMint or similar (requires enterprise account)
// For demo, we'll simulate India commodity prices
export async function fetchIndiaCommodityPrices(): Promise<CommodityPrice[]> {
  // Simulated India-specific prices (INR)
  const basePrices: Record<string, { price: number; unit: string }> = {
    'HR Steel': { price: 58500, unit: '₹/MT' },
    'CR Steel': { price: 64200, unit: '₹/MT' },
    'TMT Bars': { price: 52800, unit: '₹/MT' },
    'Copper Wire': { price: 785, unit: '₹/kg' },
    'Aluminum Sheet': { price: 245, unit: '₹/kg' },
    'PVC Resin': { price: 98500, unit: '₹/MT' },
    'HDPE': { price: 112000, unit: '₹/MT' },
    'Crude Palm Oil': { price: 89500, unit: '₹/MT' },
  };

  return Object.entries(basePrices).map(([name, data]) => ({
    name,
    price: data.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% variation
    unit: data.unit,
    exchange: 'MCX/NCDEX',
    updated: new Date().toISOString(),
  }));
}

// Fetch exchange rates for INR conversion
export async function fetchExchangeRate(from: string = 'USD', to: string = 'INR'): Promise<number> {
  try {
    // Using a free exchange rate API
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    );

    if (!response.ok) return 83.5; // Fallback rate

    const data = await response.json();
    return data.rates[to] || 83.5;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 83.5; // Fallback USD to INR rate
  }
}

// Real-time price updates using polling
export function startPricePolling(
  onUpdate: (prices: CommodityPrice[]) => void,
  intervalMs: number = 60000
): () => void {
  const poll = async () => {
    const prices = await fetchIndiaCommodityPrices();
    onUpdate(prices);
  };

  poll(); // Initial fetch
  const intervalId = setInterval(poll, intervalMs);

  return () => clearInterval(intervalId);
}

// Export default service object
export default {
  fetchCommodityPrice,
  fetchMultipleCommodities,
  fetchMarketNews,
  fetchCompanyNews,
  fetchMarketSentiment,
  fetchMetalPrices,
  fetchIndiaCommodityPrices,
  fetchExchangeRate,
  startPricePolling,
};
