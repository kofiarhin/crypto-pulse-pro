const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;
const BINANCE_REST_BASE =
  process.env.BINANCE_REST_BASE || "https://api.binance.com/api/v3";

app.use(
  cors({
    origin: ["http://localhost:5173", "https://crypto-pulse-pro.vercel.app"],
  }),
);

app.use(express.json());

const fetchBinance = async (path, params = {}) => {
  const response = await axios.get(`${BINANCE_REST_BASE}${path}`, { params });
  return response.data;
};

app.get("/", (_req, res) => {
  res.json({ message: "Crypto Pulse Pro server is running." });
});

app.get("/api/binance/summary/:symbol", async (req, res) => {
  try {
    const data = await fetchBinance("/ticker/24hr", {
      symbol: req.params.symbol.toUpperCase(),
    });

    res.json(data);
  } catch (error) {
    console.error("SUMMARY ERROR:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to load summary",
      error: error.response?.data || error.message,
    });
  }
});

app.get("/api/binance/klines", async (req, res) => {
  try {
    const { symbol = "BTCUSDT", interval = "1m", limit = "60" } = req.query;

    const data = await fetchBinance("/klines", {
      symbol: String(symbol).toUpperCase(),
      interval,
      limit,
    });

    res.json(data);
  } catch (error) {
    console.error("KLINES ERROR:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to load klines",
      error: error.response?.data || error.message,
    });
  }
});

app.get("/api/binance/depth", async (req, res) => {
  try {
    const { symbol = "BTCUSDT", limit = "10" } = req.query;

    const data = await fetchBinance("/depth", {
      symbol: String(symbol).toUpperCase(),
      limit,
    });

    res.json(data);
  } catch (error) {
    console.error("DEPTH ERROR:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to load depth",
      error: error.response?.data || error.message,
    });
  }
});

app.get("/api/binance/trades", async (req, res) => {
  try {
    const { symbol = "BTCUSDT", limit = "12" } = req.query;

    const data = await fetchBinance("/trades", {
      symbol: String(symbol).toUpperCase(),
      limit,
    });

    res.json(data);
  } catch (error) {
    console.error("TRADES ERROR:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to load trades",
      error: error.response?.data || error.message,
    });
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
      symbols.map((symbol) =>
        fetchBinance("/ticker/24hr", { symbol }).catch((error) => {
          console.error(
            `WATCHLIST ERROR (${symbol}):`,
            error.response?.data || error.message,
          );
          return null;
        }),
      ),
    );

    res.json(results.filter(Boolean));
  } catch (error) {
    console.error("WATCHLIST ERROR:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to load watchlist",
      error: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
