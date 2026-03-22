import { API_ORIGIN } from "../lib/apiConfig";

const getJson = async (path, signal) => {
  const response = await fetch(`${API_ORIGIN}${path}`, { signal });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload?.error?.message || "Failed to fetch market data.";
    throw new Error(message);
  }

  return response.json();
};

export const marketService = {
  getMarkets: async (limit = 30, signal) => {
    const payload = await getJson(`/api/markets?limit=${limit}`, signal);
    return payload?.data?.items || [];
  },
  getSummary: (symbol, signal) =>
    getJson(`/api/binance/summary/${encodeURIComponent(symbol)}`, signal),
  getKlines: (symbol, interval, signal) =>
    getJson(
      `/api/binance/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=60`,
      signal,
    ),
  getTrades: (symbol, signal) =>
    getJson(`/api/binance/trades?symbol=${encodeURIComponent(symbol)}&limit=20`, signal),
  getDepth: (symbol, signal) =>
    getJson(`/api/binance/depth?symbol=${encodeURIComponent(symbol)}&limit=12`, signal),
};
