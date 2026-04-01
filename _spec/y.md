# Homepage Market Chart Hero -- Implementation Spec

## Objective

Add a **top hero chart section** to the homepage that: - displays live
market data (default: `BTCUSDT`) - shows summary stats + chart - sits
**above the existing market table** - does **not break current
behavior**

Final structure: \[ Market Chart Hero \] \[ Crypto Markets Table
(existing) \]

------------------------------------------------------------------------

## Architecture

### Home.jsx (Orchestrator)

Responsible for: - state (symbol + interval) - data fetching - composing
sections

### New Component

`client/src/components/home/HomeMarketHero.jsx`

Responsible for: - rendering UI - displaying stats - rendering chart -
interval switching UI

------------------------------------------------------------------------

## Data Flow

### State (Home.jsx)

selectedSymbol = "BTCUSDT"\
selectedInterval = "1m"

### Queries

-   useSummaryQuery(selectedSymbol)
-   useKlinesQuery(selectedSymbol, selectedInterval)
-   useMarketsQuery(50)

------------------------------------------------------------------------

## Component Contract

### HomeMarketHero Props

-   symbol
-   interval
-   summary
-   candles
-   isLoadingSummary
-   isLoadingChart
-   onIntervalChange

------------------------------------------------------------------------

## UI Structure

-   Header Row (symbol, price, %, live)
-   Stats Row (high, low, volume)
-   Interval Selector (1m, 5m, 15m, 1h)
-   Chart

------------------------------------------------------------------------

## Design (Tailwind)

Container: bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6

Price: text-2xl md:text-3xl font-bold text-white

Percent: green → text-emerald-400\
red → text-red-400

------------------------------------------------------------------------

## Behavior

### Default

-   BTCUSDT
-   1m interval

### Interval Change

-   updates chart only

### Loading

-   show placeholders

### Errors

-   show fallback message

------------------------------------------------------------------------

## Home Integration

Update Home.jsx: - add state - add queries - render hero above table

------------------------------------------------------------------------

## Formatting Rules

-   BTCUSDT → BTC/USDT
-   compact numbers (1.3T, 256B)
-   \% color coded

------------------------------------------------------------------------

## File Changes

NEW: - client/src/components/home/HomeMarketHero.jsx

UPDATE: - client/src/pages/Home/Home.jsx

OPTIONAL: - client/src/utils/marketFormatters.js

------------------------------------------------------------------------

## Out of Scope

-   order book
-   trades
-   websockets
-   watchlist

------------------------------------------------------------------------

## Success Criteria

-   chart renders on homepage
-   updates with interval
-   table still works
-   no backend changes
