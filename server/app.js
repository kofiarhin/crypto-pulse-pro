const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://crypto-pulse-pro.vercel.app",
].filter(Boolean);

const BINANCE_REST_BASE =
  process.env.BINANCE_REST_BASE || "https://data-api.binance.vision/api/v3";

const binanceClient = axios.create({
  baseURL: BINANCE_REST_BASE,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
  }),
);

app.use(express.json());

const forwardBinanceError = (res, label, error) => {
  const upstreamStatus = error.response?.status || 502;
  const upstreamData = error.response?.data || null;
  const message = error.message || "Unknown upstream error";

  console.error(`${label} ERROR:`, {
    upstreamStatus,
    upstreamData,
    message,
  });

  return res.status(upstreamStatus).json({
    message: `Failed to load ${label.toLowerCase()}`,
    upstreamStatus,
    upstreamError: upstreamData,
    error: message,
  });
};

const fetchBinance = async (path, params = {}) => {
  const response = await binanceClient.get(path, { params });
  return response.data;
};

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "Crypto Pulse Pro server is running.",
    binanceBase: BINANCE_REST_BASE,
  });
});

app.get("/api/health", async (_req, res) => {
  try {
    const ping = await fetchBinance("/ping");
    return res.json({
      ok: true,
      binanceBase: BINANCE_REST_BASE,
      ping,
    });
  } catch (error) {
    return forwardBinanceError(res, "Health Check", error);
  }
});

app.get("/api/binance/ping", async (_req, res) => {
  try {
    const data = await fetchBinance("/ping");
    return res.json({
      ok: true,
      data,
    });
  } catch (error) {
    return forwardBinanceError(res, "Binance Ping", error);
  }
});

app.get("/api/binance/summary/:symbol", async (req, res) => {
  try {
    const data = await fetchBinance("/ticker/24hr", {
      symbol: String(req.params.symbol).toUpperCase(),
    });

    return res.json(data);
  } catch (error) {
    return forwardBinanceError(res, "Summary", error);
  }
});

app.get("/api/binance/klines", async (req, res) => {
  try {
    const { symbol = "BTCUSDT", interval = "1m", limit = "60" } = req.query;

    const data = await fetchBinance("/klines", {
      symbol: String(symbol).toUpperCase(),
      interval: String(interval),
      limit: Number(limit),
    });

    return res.json(data);
  } catch (error) {
    return forwardBinanceError(res, "Klines", error);
  }
});

app.get("/api/binance/depth", async (req, res) => {
  try {
    const { symbol = "BTCUSDT", limit = "10" } = req.query;

    const data = await fetchBinance("/depth", {
      symbol: String(symbol).toUpperCase(),
      limit: Number(limit),
    });

    return res.json(data);
  } catch (error) {
    return forwardBinanceError(res, "Depth", error);
  }
});

app.get("/api/binance/trades", async (req, res) => {
  try {
    const { symbol = "BTCUSDT", limit = "12" } = req.query;

    const data = await fetchBinance("/trades", {
      symbol: String(symbol).toUpperCase(),
      limit: Number(limit),
    });

    return res.json(data);
  } catch (error) {
    return forwardBinanceError(res, "Trades", error);
  }
});

app.get("/api/binance/watchlist", async (req, res) => {
  try {
    const rawSymbols =
      req.query.symbols || "BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT,XRPUSDT";

    const symbols = String(rawSymbols)
      .split(",")
      .map((item) => item.trim().toUpperCase())
      .filter(Boolean);

    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          return await fetchBinance("/ticker/24hr", { symbol });
        } catch (error) {
          console.error(`WATCHLIST ITEM ERROR (${symbol}):`, {
            upstreamStatus: error.response?.status,
            upstreamError: error.response?.data,
            error: error.message,
          });

          return {
            symbol,
            error: true,
          };
        }
      }),
    );

    return res.json(results.filter((item) => !item?.error));
  } catch (error) {
    return forwardBinanceError(res, "Watchlist", error);
  }
});

app.use((err, _req, res, _next) => {
  console.error("UNHANDLED SERVER ERROR:", err);

  return res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

module.exports = app;
