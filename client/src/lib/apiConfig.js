const DEFAULT_API_ORIGIN = "http://localhost:5000";

const stripTrailingSlashes = (value) => value.replace(/\/+$/, "");

const normalizeOrigin = (value) => {
  const trimmed = (value || "").trim();

  if (!trimmed) {
    return DEFAULT_API_ORIGIN;
  }

  return stripTrailingSlashes(trimmed);
};

export const API_ORIGIN = normalizeOrigin(import.meta.env.VITE_API_ORIGIN);
export const API_AUTH_BASE = `${API_ORIGIN}/api/auth`;
export const API_USER_BASE = `${API_ORIGIN}/api/user`;
export const API_MARKET_BASE = `${API_ORIGIN}/api/binance`;
