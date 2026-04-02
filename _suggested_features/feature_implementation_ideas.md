# Crypto Pulse Pro — Suggested Features to Implement Next

This list is based on the current codebase shape (React + Express + Binance/CoinGecko proxy + auth/preferences).
I prioritized ideas that fit your existing architecture and can be shipped incrementally.

## 1) Re-enable and upgrade the `/dashboard` route (Quick win, high product impact)
**What to build**
- Route `/dashboard` should render the existing dashboard page instead of redirecting to `/`.
- Add a route guard so unauthenticated users are sent to `/login`.

**Why this matters**
- You already built a rich `Dashboard` page with watchlist management, chart, trades, and order book.
- Right now, users cannot reach it from routing.

**Implementation outline**
- Replace the `/dashboard` `<Navigate to='/' />` with `<Dashboard />`.
- Add a small `ProtectedRoute` component using auth state from Redux.
- Add “Dashboard” navigation CTA in `Header` for signed-in users.

**Estimated effort**
- Small (0.5–1 day).

---

## 2) Symbol search/autocomplete + validation before adding to watchlist
**What to build**
- Replace free-text symbol entry with:
  - autocomplete suggestions,
  - pair validation (exists on Binance),
  - helpful empty/error states.

**Why this matters**
- Current add flow allows invalid entries that later fail silently or produce confusing behavior.
- It reduces friction for non-expert users.

**Implementation outline**
- Backend: add endpoint `GET /api/binance/symbols?query=BTC` using cached `/exchangeInfo`.
- Frontend: debounced search input + dropdown suggestions.
- On submit: verify symbol is tradeable before saving.

**Estimated effort**
- Medium (1–2 days).

---

## 3) Multi-watchlist support per user (named lists)
**What to build**
- Let each user create multiple watchlists (e.g., “Scalp”, “L1 Alts”, “Swing”).
- CRUD operations for watchlists and list items.

**Why this matters**
- High retention feature and clear monetization lever later.
- Fits naturally with your existing `preferences` persistence flow.

**Implementation outline**
- Mongo: add a `Watchlist` model keyed by `userId`.
- API: `/api/user/watchlists` (create/read/update/delete).
- UI: list switcher + active watchlist pinning.
- Migration path: bootstrap first watchlist from existing `preferences.watchlistSymbols`.

**Estimated effort**
- Medium/Large (3–5 days).

---

## 4) Price alerts v1 (in-app) with threshold triggers
**What to build**
- Alert rules: above price, below price, % change threshold.
- In-app “Alerts” panel with active/triggered statuses.

**Why this matters**
- Strong daily-return driver and future paid-tier anchor.

**Implementation outline**
- Mongo model `Alert` with `userId`, `symbol`, `type`, `threshold`, `status`, `lastTriggeredAt`.
- Worker/poller job every 10–30s (server cron-like interval or background worker) to evaluate rules.
- API + UI for creating/deleting/toggling alerts.

**Estimated effort**
- Large (4–7 days).

---

## 5) “Market Movers” endpoint + homepage widget
**What to build**
- Add top gainers, top losers, and top volume movers across fetched market rows.

**Why this matters**
- Gives users a reason to open the app even without a specific symbol in mind.

**Implementation outline**
- Backend: compute movers from CoinGecko market response or a cached snapshot.
- Frontend: compact widget on Home with quick links to coin detail pages.

**Estimated effort**
- Small/Medium (1–2 days).

---

## 6) Better data freshness and resilience (stale cache + circuit breaker style fallback)
**What to build**
- Short-lived cache for Binance/CoinGecko responses.
- If upstream fails, return most recent cached snapshot with a `stale: true` metadata flag.

**Why this matters**
- Improves perceived reliability during temporary upstream/API failures.

**Implementation outline**
- Add server-side in-memory cache utility with TTL per endpoint.
- Wrap external calls in “cache-first on failure” behavior.
- Surface freshness timestamp in frontend cards.

**Estimated effort**
- Medium (2–3 days).

---

## 7) URL-state deep linking for symbol + interval
**What to build**
- Keep selected symbol and interval in URL query params (`?symbol=BTCUSDT&interval=5m`).

**Why this matters**
- Shareable links and smoother navigation behavior.
- Better onboarding from alerts, notifications, and external links.

**Implementation outline**
- Use React Router search params in Home and Coin Details.
- Keep UI state synchronized with URL and validated against allowed intervals.

**Estimated effort**
- Small (0.5–1 day).

---

## 8) Add pagination / virtualized rendering for market table
**What to build**
- Client-side pagination or virtualized rows when market list grows.

**Why this matters**
- Keeps page responsive as you increase `limit` or add more columns/filters.

**Implementation outline**
- Add page size controls and local state.
- Optional: use row virtualization to keep DOM small.

**Estimated effort**
- Small/Medium (1–2 days).

---

## 9) API hardening: rate limiting + input validation layer
**What to build**
- Add request rate limits and stricter query/body schema validation.

**Why this matters**
- Protects your proxy from accidental abuse and malformed inputs.

**Implementation outline**
- Add middleware for IP/user-level rate limiting.
- Introduce schema validation (e.g., zod/joi) for all market/auth/user endpoints.

**Estimated effort**
- Medium (1–2 days).

---

## 10) Test coverage expansion (high leverage)
**What to build**
- Backend tests for auth + preferences edge cases.
- Frontend tests for:
  - login/register flows,
  - dashboard watchlist add/remove,
  - coin details error and loading states.

**Why this matters**
- Faster iteration without regressions as you add monetization features.

**Implementation outline**
- Build fixtures + mocks for API responses.
- Add CI test script gates for backend + frontend.

**Estimated effort**
- Medium (2–4 days initially).

---

## Suggested implementation order (practical roadmap)
1. Re-enable Dashboard route + guard.
2. Symbol autocomplete/validation.
3. Market Movers widget.
4. URL deep linking.
5. Multi-watchlist model + APIs.
6. Alerts v1.
7. Reliability cache/fallback layer.
8. Rate limiting + full validation pass.
9. Test coverage expansion.

## Nice-to-have stretch ideas
- WebSocket live mode (replace polling for trades/depth).
- Notification center UI for alert history.
- Portfolio tracker lite (manual holdings + PnL snapshot).
- Lightweight onboarding wizard (favorite coins, default timeframe).
