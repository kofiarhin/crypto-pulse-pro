const REST_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getJson = async (path, signal) => {
  const response = await fetch(`${REST_BASE}${path}`, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch market data.");
  }

  return response.json();
};

export const marketService = {
  getWatchlist: (symbols, signal) =>
    getJson(`/binance/watchlist?symbols=${symbols.join(",")}`, signal),
  getSummary: (symbol, signal) => getJson(`/binance/summary/${symbol}`, signal),
  getKlines: (symbol, interval, signal) =>
    getJson(`/binance/klines?symbol=${symbol}&interval=${interval}&limit=60`, signal),
  getTrades: (symbol, signal) =>
    getJson(`/binance/trades?symbol=${symbol}&limit=12`, signal),
  getDepth: (symbol, signal) =>
    getJson(`/binance/depth?symbol=${symbol}&limit=10`, signal),
};
