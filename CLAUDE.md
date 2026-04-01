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
                → /api/auth     → authController
                → /api/user     → userController
                → /api/binance  → marketController → Binance REST API
                → /api/markets  → marketController → CoinGecko + Binance
```

### Auth

JWT dual-token scheme:
- **Access token** (15m): stored in Redux `authSlice`, sent as `Authorization: Bearer` header
- **Refresh token** (7d): stored as `cpp_refresh_token` HTTP-only cookie
- On app load, `useInitializeAuth` calls `GET /api/auth/me` to restore session; if it fails with 401 it calls `POST /api/auth/refresh` automatically via the axios interceptor

The `requireAuth` middleware verifies the access token. Refresh happens client-side via the axios interceptor in `lib/apiClient.js`.

### State Boundaries

- **Redux** (`features/auth/authSlice`): `user`, `accessToken`, `isAuthenticated`, `initialized`. Nothing else lives in Redux.
- **TanStack Query**: all market/price data — markets list, klines, depth, trades, summary, user preferences. Stale time 30s with auto-refetch every 30s.

### Market Data

`/api/markets` aggregates CoinGecko (metadata/ranking) with Binance availability check.  
`/api/binance/*` are thin proxies to the Binance REST API (`BINANCE_REST_BASE` env var).  
`marketService.js` uses native `fetch` with `AbortController` signals (not Axios) — this is intentional for React Query's cancellation support.

### Server Entry

`server/server.js` loads env → `config/env.js` validates all required vars (throws on missing) → connects MongoDB → calls `createApp(env)` from `app.js` → listens on `PORT`.

### Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `VITE_API_ORIGIN` | `client/.env` | Backend origin (no trailing slash, no `/api`) |
| `PORT` | root `.env` | Express port (default 5000) |
| `MONGODB_URI` | root `.env` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | root `.env` | Signing access tokens |
| `JWT_REFRESH_SECRET` | root `.env` | Signing refresh tokens |
| `CLIENT_URL` | root `.env` | Frontend origin for CORS |
| `BINANCE_REST_BASE` | root `.env` | Binance API base URL |

The root `.env` is loaded by the server. The `client/.env` is loaded by Vite. They are separate files.

### Key Conventions

- API responses follow `{ success: boolean, data?: object }` on success and `{ success: false, error: { message, status } }` on error
- User objects are always passed through `sanitizeUser()` before sending to the client
- Preference defaults and validation live in `server/utils/preferences.js`
- Hooks follow naming: `use*Query` for reads, `use*Mutation` for writes
