const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const BINANCE_REST_BASE = "https://api.binance.com/api/v3";

app.use(cors());
app.use(express.json());

const buildUrl = (path, params = {}) => {
  const url = new URL(`${BINANCE_REST_BASE}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const fetchBinance = async (path, params = {}) => {
  const url = buildUrl(path, params);
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Binance request failed: ${response.status} ${errorText}`);
  }

  return response.json();
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
        fetchBinance("/ticker/24hr", { symbol }).catch(() => null),
      ),
    );

    res.json(results.filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
