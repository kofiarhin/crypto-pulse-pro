import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useUserPreferencesQuery } from "../../hooks/queries/useUserPreferencesQuery";
import { useUpdatePreferencesMutation } from "../../hooks/mutations/useUpdatePreferencesMutation";
import { marketService } from "../../services/marketService";

const DEFAULT_SYMBOL = "BTCUSDT";
const DEFAULT_INTERVAL = "1m";
const WATCHLIST_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"];
const INTERVALS = ["1m", "5m", "15m", "1h"];

const formatCurrency = (value, digits = 2) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

const formatCompact = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num);
};

const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const formatPair = (symbol) => (symbol.endsWith("USDT") ? `${symbol.replace("USDT", "")}/USDT` : symbol);

const getPercentClass = (value) => {
  const num = Number(value);
  if (num > 0) return "positive";
  if (num < 0) return "negative";
  return "neutral";
};

const buildChartPath = (points, width, height, padding) => {
  if (!points.length) return "";
  const prices = points.map((point) => Number(point.close));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(points.length - 1, 1);
      const normalized = (Number(point.close) - min) / range;
      const y = height - padding - normalized * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

const buildVolumeBars = (points, maxHeight) => {
  const volumes = points.map((point) => Number(point.volume));
  const maxVolume = Math.max(...volumes, 1);

  return points.map((point) => ({
    height: (Number(point.volume) / maxVolume) * maxHeight,
    isPositive: Number(point.close) >= Number(point.open),
  }));
};

const SummaryCard = ({ label, value, extraClass = "" }) => (
  <div className={`summary-card ${extraClass}`}>
    <p className="summary-label">{label}</p>
    <p className="summary-value">{value}</p>
  </div>
);

const WatchlistItem = ({ item, isActive, onClick, onRemove }) => (
  <div className={`watchlist-item ${isActive ? "active" : ""}`}>
    <button type="button" className="flex-1 text-left" onClick={onClick}>
      <p className="watchlist-symbol">{formatPair(item.symbol)}</p>
      <p className="watchlist-price">${formatCurrency(item.lastPrice, 2)}</p>
    </button>

    <div className="flex items-center gap-2">
      <span className={`watchlist-change ${getPercentClass(item.priceChangePercent)}`}>
        {Number(item.priceChangePercent) > 0 ? "+" : ""}
        {Number(item.priceChangePercent).toFixed(2)}%
      </span>
      <button type="button" aria-label={`Remove ${item.symbol}`} className="text-xs text-slate-400 hover:text-rose-400" onClick={onRemove}>
        X
      </button>
    </div>
  </div>
);

const TradesTable = ({ trades }) => (
  <div className="panel">
    <div className="panel-header">
      <h3>Recent Trades</h3>
    </div>

    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Price</th>
            <th>Amount</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id}>
              <td className={trade.isBuyerMaker ? "negative" : "positive"}>${formatCurrency(trade.price, 2)}</td>
              <td>{formatCurrency(trade.qty, 5)}</td>
              <td>{formatTime(trade.time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const OrderBook = ({ bids, asks }) => (
  <div className="panel">
    <div className="panel-header">
      <h3>Order Book</h3>
    </div>

    <div className="orderbook-grid">
      <div>
        <p className="orderbook-title">Bids</p>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Price</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {bids.map(([price, qty]) => (
                <tr key={`bid-${price}`}><td className="positive">${formatCurrency(price, 2)}</td><td>{formatCurrency(qty, 5)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="orderbook-title">Asks</p>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Price</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {asks.map(([price, qty]) => (
                <tr key={`ask-${price}`}><td className="negative">${formatCurrency(price, 2)}</td><td>{formatCurrency(qty, 5)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

const LiveChart = ({ candles, symbol, interval }) => {
  const width = 1000;
  const height = 360;
  const padding = 24;
  const path = useMemo(() => buildChartPath(candles, width, height, padding), [candles]);
  const volumes = useMemo(() => buildVolumeBars(candles, 60), [candles]);

  const lastClose = candles.length ? Number(candles[candles.length - 1].close) : 0;
  const closes = candles.map((item) => Number(item.close));
  const minClose = closes.length ? Math.min(...closes) : 0;
  const maxClose = closes.length ? Math.max(...closes) : 1;
  const range = maxClose - minClose || 1;
  const lastY = height - padding - ((lastClose - minClose) / range) * (height - padding * 2);

  return (
    <div className="chart-panel panel">
      <div className="panel-header">
        <div>
          <h3>{formatPair(symbol)} Chart</h3>
          <p className="panel-subtext">Interval: {interval}</p>
        </div>
        <div className="chart-price-pill">${formatCurrency(lastClose, 2)}</div>
      </div>

      <div className="chart-wrap">
        <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-label="Price chart">
          {[0.2, 0.4, 0.6, 0.8].map((line) => (
            <line key={line} x1="0" y1={height * line} x2={width} y2={height * line} className="chart-grid-line" />
          ))}
          <path d={path} className="chart-line" />
          {candles.length > 0 && <circle cx={width - padding} cy={lastY} r="5" className="chart-point" />}
        </svg>

        <div className="volume-bars">
          {volumes.map((bar, index) => (
            <span key={`${candles[index]?.openTime}-${index}`} className={`volume-bar ${bar.isPositive ? "positive" : "negative"}`} style={{ height: `${bar.height}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);
  const [watchlistSymbols, setWatchlistSymbols] = useState(WATCHLIST_SYMBOLS);
  const [selectedSymbol, setSelectedSymbol] = useState(DEFAULT_SYMBOL);
  const [selectedInterval, setSelectedInterval] = useState(DEFAULT_INTERVAL);
  const [newSymbol, setNewSymbol] = useState("");

  const [summary, setSummary] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [candles, setCandles] = useState([]);
  const [trades, setTrades] = useState([]);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const preferencesQuery = useUserPreferencesQuery({ accessToken, enabled: isAuthenticated });
  const updatePreferencesMutation = useUpdatePreferencesMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      setWatchlistSymbols(WATCHLIST_SYMBOLS);
      setSelectedSymbol(DEFAULT_SYMBOL);
      setSelectedInterval(DEFAULT_INTERVAL);
      return;
    }

    const preferences = preferencesQuery.data;
    if (!preferences) return;

    const symbols = preferences.watchlistSymbols?.length ? preferences.watchlistSymbols : WATCHLIST_SYMBOLS;
    setWatchlistSymbols(symbols);

    const nextSymbol = symbols.includes(preferences.defaultSymbol) ? preferences.defaultSymbol : symbols[0] || DEFAULT_SYMBOL;
    setSelectedSymbol(nextSymbol);
    setSelectedInterval(INTERVALS.includes(preferences.defaultInterval) ? preferences.defaultInterval : DEFAULT_INTERVAL);
  }, [isAuthenticated, preferencesQuery.data]);

  useEffect(() => {
    if (!isAuthenticated || !preferencesQuery.data) return;

    const timeoutId = setTimeout(() => {
      updatePreferencesMutation.mutate({
        accessToken,
        payload: {
          watchlistSymbols,
          defaultSymbol: selectedSymbol,
          defaultInterval: selectedInterval,
        },
      });
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, accessToken, watchlistSymbols, selectedSymbol, selectedInterval, preferencesQuery.data]);

  useEffect(() => {
    if (!watchlistSymbols.includes(selectedSymbol)) {
      setSelectedSymbol(watchlistSymbols[0] || DEFAULT_SYMBOL);
    }
  }, [watchlistSymbols, selectedSymbol]);

  const fetchWatchlist = async (signal) => {
    const data = await marketService.getWatchlist(watchlistSymbols, signal);
    const normalized = Array.isArray(data) ? data : [];
    normalized.sort((a, b) => watchlistSymbols.indexOf(a.symbol) - watchlistSymbols.indexOf(b.symbol));
    setWatchlist(normalized);
  };

  const fetchSummary = async (signal) => {
    setSummary(await marketService.getSummary(selectedSymbol, signal));
  };

  const fetchChart = async (signal) => {
    const data = await marketService.getKlines(selectedSymbol, selectedInterval, signal);
    setCandles(
      data.map((item) => ({
        openTime: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        volume: item[5],
        closeTime: item[6],
      })),
    );
  };

  const fetchTrades = async (signal) => {
    const data = await marketService.getTrades(selectedSymbol, signal);
    setTrades(data.map((trade) => ({ id: trade.id, price: trade.price, qty: trade.qty, time: trade.time, isBuyerMaker: trade.isBuyerMaker })));
  };

  const fetchDepth = async (signal) => {
    const data = await marketService.getDepth(selectedSymbol, signal);
    setOrderBook({ bids: data.bids.slice(0, 10), asks: data.asks.slice(0, 10) });
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");
        await Promise.all([
          fetchSummary(controller.signal),
          fetchChart(controller.signal),
          fetchTrades(controller.signal),
          fetchDepth(controller.signal),
          fetchWatchlist(controller.signal),
        ]);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
    return () => controller.abort();
  }, [selectedSymbol, selectedInterval, watchlistSymbols]);

  useEffect(() => {
    const controller = new AbortController();
    const intervalId = setInterval(() => {
      fetchSummary(controller.signal).catch(() => {});
      fetchTrades(controller.signal).catch(() => {});
      fetchDepth(controller.signal).catch(() => {});
      fetchWatchlist(controller.signal).catch(() => {});
    }, 5000);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [selectedSymbol, watchlistSymbols]);

  useEffect(() => {
    const controller = new AbortController();
    const intervalId = setInterval(() => {
      fetchChart(controller.signal).catch(() => {});
    }, 15000);

    return () => {
      controller.abort();
      clearInterval(intervalId);
    };
  }, [selectedSymbol, selectedInterval]);

  const addSymbol = () => {
    const symbol = newSymbol.trim().toUpperCase();
    if (!/^[A-Z0-9]{3,20}$/.test(symbol)) return;
    if (watchlistSymbols.includes(symbol)) return;
    if (watchlistSymbols.length >= 20) return;
    setWatchlistSymbols((prev) => [...prev, symbol]);
    setSelectedSymbol(symbol);
    setNewSymbol("");
  };

  const removeSymbol = (symbol) => {
    if (watchlistSymbols.length <= 1) return;
    setWatchlistSymbols((prev) => prev.filter((item) => item !== symbol));
  };

  const priceChangeClass = getPercentClass(summary?.priceChangePercent);

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div>
            <p className="eyebrow">Crypto Pulse Pro</p>
            <h1>Crypto Dashboard MVP</h1>
          </div>
          <div className="topbar-meta"><span className="status-dot" /><span>Auto-refreshing market data</span></div>
        </header>

        <section className="mb-4 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={newSymbol}
            onChange={(event) => setNewSymbol(event.target.value.toUpperCase())}
            placeholder="Add symbol"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            aria-label="Add symbol"
          />
          <button type="button" onClick={addSymbol} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm">Add</button>
          {isAuthenticated && <span className="text-xs text-slate-400">Preferences sync automatically.</span>}
        </section>

        <section className="watchlist-strip">
          {watchlist.map((item) => (
            <WatchlistItem key={item.symbol} item={item} isActive={item.symbol === selectedSymbol} onClick={() => setSelectedSymbol(item.symbol)} onRemove={() => removeSymbol(item.symbol)} />
          ))}
        </section>

        <section className="hero-card">
          <div className="hero-head">
            <div>
              <p className="hero-symbol">{formatPair(selectedSymbol)}</p>
              <div className="hero-price-row">
                <h2>{summary ? `$${formatCurrency(summary.lastPrice, 2)}` : "--"}</h2>
                {summary && (
                  <span className={`hero-change ${priceChangeClass}`}>
                    {Number(summary.priceChange) > 0 ? "+" : ""}
                    {formatCurrency(summary.priceChange, 2)} ({Number(summary.priceChangePercent) > 0 ? "+" : ""}
                    {Number(summary.priceChangePercent).toFixed(2)}%)
                  </span>
                )}
              </div>
            </div>

            <div className="interval-switcher">
              {INTERVALS.map((interval) => (
                <button key={interval} type="button" className={selectedInterval === interval ? "active" : ""} onClick={() => setSelectedInterval(interval)}>
                  {interval}
                </button>
              ))}
            </div>
          </div>

          <div className="summary-grid">
            <SummaryCard label="24h Change" value={summary ? `${Number(summary.priceChangePercent) > 0 ? "+" : ""}${Number(summary.priceChangePercent).toFixed(2)}%` : "--"} extraClass={priceChangeClass} />
            <SummaryCard label="24h High" value={summary ? `$${formatCurrency(summary.highPrice, 2)}` : "--"} />
            <SummaryCard label="24h Low" value={summary ? `$${formatCurrency(summary.lowPrice, 2)}` : "--"} />
            <SummaryCard label="24h Volume" value={summary ? formatCompact(summary.quoteVolume) : "--"} />
          </div>
        </section>

        {loading ? (
          <section className="feedback-card"><p>Loading market data...</p></section>
        ) : error ? (
          <section className="feedback-card error-card"><p>{error}</p></section>
        ) : (
          <section className="main-grid">
            <div className="left-column">
              <LiveChart candles={candles} symbol={selectedSymbol} interval={selectedInterval} />
              <div className="bottom-grid">
                <TradesTable trades={trades} />
                <OrderBook bids={orderBook.bids} asks={orderBook.asks} />
              </div>
            </div>

            <aside className="right-column">
              <div className="panel">
                <div className="panel-header"><h3>Market Watch</h3></div>
                <div className="market-watch-list">
                  {watchlist.map((item) => (
                    <div key={`side-${item.symbol}`} className="market-watch-row">
                      <div>
                        <p className="market-watch-symbol">{formatPair(item.symbol)}</p>
                        <p className="market-watch-price">${formatCurrency(item.lastPrice, 2)}</p>
                      </div>
                      <span className={`watchlist-change ${getPercentClass(item.priceChangePercent)}`}>
                        {Number(item.priceChangePercent) > 0 ? "+" : ""}{Number(item.priceChangePercent).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-header"><h3>Quick Stats</h3></div>
                <div className="quick-stats">
                  <div className="quick-stat-row"><span>Best Bid</span><strong>${summary ? formatCurrency(summary.bidPrice, 2) : "--"}</strong></div>
                  <div className="quick-stat-row"><span>Best Ask</span><strong>${summary ? formatCurrency(summary.askPrice, 2) : "--"}</strong></div>
                  <div className="quick-stat-row"><span>Weighted Avg</span><strong>${summary ? formatCurrency(summary.weightedAvgPrice, 2) : "--"}</strong></div>
                  <div className="quick-stat-row"><span>Trade Count</span><strong>{summary ? formatCompact(summary.count) : "--"}</strong></div>
                  <div className="quick-stat-row"><span>Last Qty</span><strong>{summary ? formatCurrency(summary.lastQty, 5) : "--"}</strong></div>
                </div>
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
