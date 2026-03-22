import { API_MARKET_BASE } from "../lib/apiConfig";

const getJson = async (path, signal) => {
  const response = await fetch(`${API_MARKET_BASE}${path}`, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch market data.");
  }

  return response.json();
};

export const marketService = {
  getWatchlist: (symbols, signal) =>
    getJson(`/watchlist?symbols=${symbols.join(",")}`, signal),
  getSummary: (symbol, signal) => getJson(`/summary/${symbol}`, signal),
  getKlines: (symbol, interval, signal) =>
    getJson(`/klines?symbol=${symbol}&interval=${interval}&limit=60`, signal),
  getTrades: (symbol, signal) =>
    getJson(`/trades?symbol=${symbol}&limit=12`, signal),
  getDepth: (symbol, signal) =>
    getJson(`/depth?symbol=${symbol}&limit=10`, signal),
};
