const axios = require("axios");

const COINGECKO_BASE = process.env.COINGECKO_BASE || "https://api.coingecko.com/api/v3";
const BINANCE_REST_BASE =
  process.env.BINANCE_REST_BASE || "https://data-api.binance.vision/api/v3";

const marketClient = axios.create({
  baseURL: COINGECKO_BASE,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

const binanceClient = axios.create({
  baseURL: BINANCE_REST_BASE,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

const EXCHANGE_INFO_TTL_MS = 60_000;
let exchangeInfoCache = {
  expiresAt: 0,
  symbols: new Set(),
};

const MARKET_LIMIT_MIN = 1;
const MARKET_LIMIT_MAX = 100;
const DEFAULT_MARKET_LIMIT = 30;

const parseLimit = (limitValue) => {
  if (limitValue === undefined) {
    return DEFAULT_MARKET_LIMIT;
  }

  const parsed = Number(limitValue);

  if (!Number.isInteger(parsed)) {
    return null;
  }

  if (parsed < MARKET_LIMIT_MIN || parsed > MARKET_LIMIT_MAX) {
    return null;
  }

  return parsed;
};

const getBinanceSymbols = async () => {
  const now = Date.now();
  if (exchangeInfoCache.expiresAt > now && exchangeInfoCache.symbols.size > 0) {
    return exchangeInfoCache.symbols;
  }

  const { data } = await binanceClient.get("/exchangeInfo");
  const symbols = new Set((data?.symbols || []).map((item) => item.symbol));

  exchangeInfoCache = {
    expiresAt: now + EXCHANGE_INFO_TTL_MS,
    symbols,
  };

  return symbols;
};

const normalizeMarketRow = (coin, binanceSymbols) => {
  const inferredBinanceSymbol = `${String(coin.symbol || "").toUpperCase()}USDT`;

  return {
    id: coin.id,
    name: coin.name,
    symbol: String(coin.symbol || "").toUpperCase(),
    image: coin.image || null,
    rank: coin.market_cap_rank ?? null,
    price: coin.current_price ?? null,
    marketCap: coin.market_cap ?? null,
    volume24h: coin.total_volume ?? null,
    circulatingSupply: coin.circulating_supply ?? null,
    percentChange24h: coin.price_change_percentage_24h ?? null,
    percentChange1h: coin.price_change_percentage_1h_in_currency ?? null,
    percentChange7d: coin.price_change_percentage_7d_in_currency ?? null,
    binanceSymbol: binanceSymbols.has(inferredBinanceSymbol)
      ? inferredBinanceSymbol
      : null,
  };
};

const getMarkets = async (req, res) => {
  const limit = parseLimit(req.query.limit);

  if (limit === null) {
    return res.status(400).json({
      success: false,
      error: {
        message: `limit must be an integer between ${MARKET_LIMIT_MIN} and ${MARKET_LIMIT_MAX}`,
      },
    });
  }

  try {
    const [marketResponse, binanceSymbols] = await Promise.all([
      marketClient.get("/coins/markets", {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: "1h,24h,7d",
        },
      }),
      getBinanceSymbols(),
    ]);

    const items = (marketResponse.data || [])
      .map((coin) => normalizeMarketRow(coin, binanceSymbols))
      .filter((coin) => coin.binanceSymbol);

    return res.json({
      success: true,
      data: {
        items,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return res.status(error.response?.status || 502).json({
      success: false,
      error: {
        message: "Failed to load market list",
        upstreamStatus: error.response?.status || null,
      },
    });
  }
};

module.exports = {
  getMarkets,
  __private__: {
    parseLimit,
    normalizeMarketRow,
  },
};
