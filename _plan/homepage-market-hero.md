# Implementation Plan: Homepage Market Chart Hero

**Spec source:** `_spec/y.md`  
**Status:** Ready to implement  
**Scope:** Frontend only — no backend changes

---

## Goal

Add a hero section above the existing `MarketTable` on the homepage that displays:
- Live price + 24h change for a selected symbol (default: `BTCUSDT`)
- 24h stats: high, low, volume
- An interval selector (1m, 5m, 15m, 1h)
- A line chart of recent closes

Final page layout:
```
[ HomeMarketHero ]
[ MarketTable    ]
```

---

## What Already Exists (No Changes Needed)

| Asset | Path | Notes |
|---|---|---|
| `useSummaryQuery` | `client/src/hooks/queries/useSummaryQuery.js` | Ready — accepts `(symbol)` |
| `useKlinesQuery` | `client/src/hooks/queries/useKlinesQuery.js` | Ready — accepts `(symbol, interval)` |
| `useMarketsQuery` | `client/src/hooks/queries/useMarketsQuery.js` | Already used in Home.jsx |
| `PriceChart` | `client/src/components/coin-details/PriceChart.jsx` | SVG line chart, accepts `candles` (array of Binance kline arrays), reads `candle[4]` as close price |
| `marketService` | `client/src/services/marketService.js` | Fetch-based, supports AbortSignal for Query cancellation |

---

## Files to Create

### 1. `client/src/utils/marketFormatters.js` _(new)_

Centralises formatting logic currently duplicated across `MarketTable`, `CoinHeader`, `OrderBook`, and `TradesTable`. The hero component needs these formatters.

**Functions to export:**

```js
// "BTCUSDT" → "BTC/USDT"
// Strategy: strip "USDT"/"BTC"/"ETH"/"BNB"/"USDC" suffix, insert "/"
export function formatSymbolDisplay(symbol)

// Number → "$1,234.56"
export function formatCurrency(value)

// Number → "+2.45%" or "-1.20%" (with sign)
export function formatPercent(value)

// Number → "1.3T", "256.4B", "45.2M", "123.4K"
export function formatCompact(value)
```

**Implementation notes:**
- `formatSymbolDisplay`: match known quote assets (`USDT`, `BUSD`, `BTC`, `ETH`, `BNB`, `USDC`) at the end of the string; if matched, split at that position and join with `/`. Fall back to the raw symbol if no match.
- `formatCurrency`: `Number(value || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })`
- `formatPercent`: `Number.isNaN(num) ? "-" : \`${num > 0 ? "+" : ""}${num.toFixed(2)}%\``
- `formatCompact`: `Number(value || 0).toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 })`

---

### 2. `client/src/components/home/HomeMarketHero.jsx` _(new)_

Pure presentational component. All data and state come from props.

#### Props contract

| Prop | Type | Description |
|---|---|---|
| `symbol` | `string` | Raw symbol e.g. `"BTCUSDT"` |
| `interval` | `string` | Current interval e.g. `"1m"` |
| `summary` | `object \| undefined` | Binance 24hr ticker data |
| `candles` | `array` | Binance klines array (each item is `[openTime, open, high, low, close, ...]`) |
| `isLoadingSummary` | `boolean` | Show stat placeholders |
| `isLoadingChart` | `boolean` | Show chart placeholder |
| `onIntervalChange` | `function` | `(interval: string) => void` |

#### Summary data fields used

From the Binance `/api/binance/summary/:symbol` endpoint (24hr ticker):
- `summary.lastPrice` — current price
- `summary.priceChangePercent` — 24h % change
- `summary.highPrice` — 24h high
- `summary.lowPrice` — 24h low
- `summary.volume` — 24h base volume

#### UI layout

```
┌──────────────────────────────────────────────────────────────┐
│  BTC/USDT                                          • LIVE    │
│  $67,420.00     +2.34%                                       │
│─────────────────────────────────────────────────────────────│
│  24H HIGH: $68,100    24H LOW: $66,900    VOLUME: 45.2K     │
│─────────────────────────────────────────────────────────────│
│  [1m]  5m   15m   1h                                         │
│─────────────────────────────────────────────────────────────│
│                                                              │
│                 [SVG Line Chart]                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Section breakdown

**Container**
```
bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6
```

**Header row** (`flex items-start justify-between`)
- Left: formatted symbol (`BTC/USDT`) in `text-sm text-slate-400`, price in `text-2xl md:text-3xl font-bold text-white`, percent change colored `text-emerald-400` / `text-red-400`
- Right: live badge — small pulsing green dot + `LIVE` label (`text-xs text-emerald-400`)

**Stats row** (`flex gap-6 mt-3 text-sm text-slate-400`)
- `24H HIGH:` value in `text-white`
- `24H LOW:` value in `text-white`
- `VOLUME:` compact value in `text-white`

**Interval selector** (`flex gap-2 mt-4`)
- Buttons: `[1m, 5m, 15m, 1h]`
- Active: `bg-blue-600 text-white rounded-md px-3 py-1 text-xs font-medium`
- Inactive: `border border-slate-700 text-slate-300 rounded-md px-3 py-1 text-xs hover:bg-slate-800`

**Chart** — reuse `<PriceChart candles={candles} />` from `coin-details/`

#### Loading state

When `isLoadingSummary` is true:
- Show gray animated placeholder bars (`animate-pulse bg-slate-800 rounded`) for price, percent, and stats

When `isLoadingChart` is true:
- Show a placeholder div matching chart height: `h-64 rounded bg-slate-800 animate-pulse`

#### Error state

If `summary` is `undefined` and not loading:
- Show: `<p className="text-slate-400 text-sm">Could not load market data.</p>` in the stats area

If `candles` is empty and not loading:
- `PriceChart` already handles this with `"No chart data."` fallback — no extra work needed

---

## Files to Update

### 3. `client/src/pages/Home/Home.jsx` _(update)_

**Current state:** Uses only `useMarketsQuery(50)`.

**Changes:**

1. Add imports:
   ```js
   import { useState } from "react";
   import { useSummaryQuery } from "../../hooks/queries/useSummaryQuery";
   import { useKlinesQuery } from "../../hooks/queries/useKlinesQuery";
   import { HomeMarketHero } from "../../components/home/HomeMarketHero";
   ```

2. Add state inside the component:
   ```js
   const [selectedSymbol] = useState("BTCUSDT");
   const [selectedInterval, setSelectedInterval] = useState("1m");
   ```
   > `selectedSymbol` uses `useState` (not a plain `const`) to leave the door open for future user-driven symbol selection without a spec change today.

3. Add queries:
   ```js
   const summaryQuery = useSummaryQuery(selectedSymbol);
   const klinesQuery = useKlinesQuery(selectedSymbol, selectedInterval);
   ```

4. Render `<HomeMarketHero>` above `<MarketTable>`. Pass:
   ```jsx
   <HomeMarketHero
     symbol={selectedSymbol}
     interval={selectedInterval}
     summary={summaryQuery.data}
     candles={klinesQuery.data ?? []}
     isLoadingSummary={summaryQuery.isLoading}
     isLoadingChart={klinesQuery.isLoading}
     onIntervalChange={setSelectedInterval}
   />
   ```

5. Keep everything below (`header`, `MarketTable`, error/loading states) exactly as-is.

---

## Data Shape Reference

### Summary (`/api/binance/summary/:symbol`)
Binance 24hr ticker response fields used:
```json
{
  "symbol": "BTCUSDT",
  "lastPrice": "67420.00",
  "priceChangePercent": "2.34",
  "highPrice": "68100.00",
  "lowPrice": "66900.00",
  "volume": "45200.00"
}
```

### Klines (`/api/binance/klines?symbol=BTCUSDT&interval=1m&limit=60`)
Each candle is a Binance kline array:
```
[openTime, open, high, low, close, volume, closeTime, ...]
  [0]        [1]   [2]  [3]  [4]    [5]     [6]
```
`PriceChart` reads index `[4]` as the close price — this is already correct.

---

## Sequence of Implementation

1. **Create `client/src/utils/marketFormatters.js`**  
   Write and verify all four formatters. This has no dependencies and can be done first.

2. **Create `client/src/components/home/HomeMarketHero.jsx`**  
   Build from the top down: container → header row → stats row → interval selector → chart. Import `PriceChart` and `marketFormatters`. Implement loading skeletons and error fallbacks.

3. **Update `client/src/pages/Home/Home.jsx`**  
   Add state, queries, and the `<HomeMarketHero>` render. Verify `MarketTable` is unaffected.

4. **Manual smoke test**
   - [ ] Hero renders above the table on the homepage
   - [ ] Price and percent load within ~1s
   - [ ] Clicking interval buttons updates the chart
   - [ ] High, low, volume stats populate correctly
   - [ ] Table still loads and links work
   - [ ] Page is not broken when API is slow (loading states show)

---

## Out of Scope

- Order book
- Trades feed
- WebSocket / real-time streaming
- Watchlist
- User symbol selection
- Backend changes
- Tests (no spec requirement; add separately if needed)

---

## Risk Notes

- **`PriceChart` is imported from `coin-details/`** — no copy needed, just import from its current path. If it is ever moved, update the import.
- **`summary` shape** — we depend on Binance 24hr ticker fields. If the backend transforms the response, verify field names against `server/controllers/marketController.js` before finalising `HomeMarketHero`.
- **`formatSymbolDisplay`** — must handle any symbol in the markets list, not just `BTCUSDT`. Test with a few: `ETHUSDT`, `BNBUSDT`, `SOLUSDT`.
