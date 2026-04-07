# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (runs frontend + backend concurrently)
npm run dev

# Backend only (nodemon, auto-reload)
npm run server

# Frontend only (Vite dev server)
npm run client

# Backend tests (Jest + Supertest, from root)
npm test

# Run a single backend test file
npx jest server/test/marketRoutes.test.js

# Frontend tests (Vitest + Testing Library)
npm run test --prefix client

# Run a single frontend test file
npm run test --prefix client -- test/path/to/file.test.jsx

# Lint frontend
npm run lint --prefix client

# Build frontend for production
npm run build --prefix client
```

## Architecture

### Request Flow

```
Browser → React (Vite, port 5173)
            → Axios (lib/apiClient.js, VITE_API_ORIGIN)
            → Express (port 5000)
                → /api/auth       → authController
                → /api/user       → userController
                → /api/markets    → marketController → CoinGecko + Binance exchangeInfo
                → /api/binance/*  → inline handlers in app.js → Binance REST API
```

### Auth

JWT dual-token scheme:
- **Access token** (15m): stored in Redux `authSlice`, sent as `Authorization: Bearer` header
- **Refresh token** (7d): stored as `cpp_refresh_token` HTTP-only cookie
- On app load, `useInitializeAuth` proactively calls `POST /api/auth/refresh` first, then `GET /api/auth/me` with the new access token. If either fails, auth is cleared. This is not interceptor-based — the hook manages the full init sequence directly.

The `requireAuth` middleware verifies the access token on protected routes. Routes are built via factory functions (`buildAuthRoutes(env)`, `buildUserRoutes(env)`) that close over the `env` config object so secrets are never read from `process.env` directly inside middleware.

### State Boundaries

- **Redux** (`features/auth/authSlice`): `user`, `accessToken`, `isAuthenticated`, `initialized`. Nothing else lives in Redux.
- **TanStack Query**: all market/price data — markets list, klines, depth, trades, summary, user preferences. Stale time 30s with auto-refetch every 30s.

### Market Data

`/api/markets` (via `marketController.js`) aggregates CoinGecko (metadata/ranking) with a Binance `exchangeInfo` availability check. Only coins with a `{SYMBOL}USDT` pair on Binance are returned. The `exchangeInfo` response is in-memory cached for 60s.

`/api/binance/*` routes (klines, depth, trades, summary, watchlist) are defined **inline in `app.js`** — not in a separate routes file — using a shared `binanceClient` axios instance.

`client/src/services/marketService.js` uses native `fetch` with `AbortController` signals (not Axios) — this is intentional for React Query's cancellation support.

### Server Entry

`server/server.js` loads env → `config/env.js` validates all required vars (throws on missing) → connects MongoDB → calls `createApp(env)` from `app.js` → listens on `PORT`.

### Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `VITE_API_ORIGIN` | `client/.env` | Backend origin (no trailing slash, no `/api`). Falls back to `http://localhost:5000` if unset — this fallback is dev-only. |
| `PORT` | root `.env` | Express port (default 5000) |
| `NODE_ENV` | root `.env` | Required; used by env validation |
| `MONGODB_URI` | root `.env` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | root `.env` | Signing access tokens |
| `JWT_REFRESH_SECRET` | root `.env` | Signing refresh tokens |
| `CLIENT_URL` | root `.env` | Frontend origin for CORS |
| `BINANCE_REST_BASE` | root `.env` | Binance API base URL (defaults to `https://data-api.binance.vision/api/v3`) |
| `COINGECKO_BASE` | root `.env` | CoinGecko API base URL (defaults to `https://api.coingecko.com/api/v3`) |

The root `.env` is loaded by the server. The `client/.env` is loaded by Vite. They are separate files.

### Key Conventions

- API responses follow `{ success: boolean, data?: object }` on success and `{ success: false, error: { message, status } }` on error
- User objects are always passed through `sanitizeUser()` before sending to the client
- Preference defaults and validation live in `server/utils/preferences.js`
- Hooks follow naming: `use*Query` for reads, `use*Mutation` for writes
- Controller private functions used in tests are exported under `__private__` (e.g. `module.exports = { getMarkets, __private__: { parseLimit, normalizeMarketRow } }`)
