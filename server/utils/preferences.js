const DEFAULT_PREFERENCES = {
  watchlistSymbols: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"],
  defaultSymbol: "BTCUSDT",
  defaultInterval: "1m",
};

const ALLOWED_INTERVALS = ["1m", "5m", "15m", "1h"];
const SYMBOL_REGEX = /^[A-Z0-9]{3,20}$/;
const WATCHLIST_MAX_SIZE = 20;

const normalizeSymbol = (symbol) => String(symbol || "").trim().toUpperCase();

const parsePreferencesPatch = (payload = {}) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "Invalid preferences payload." };
  }

  const update = {};

  if (Object.hasOwn(payload, "watchlistSymbols")) {
    if (!Array.isArray(payload.watchlistSymbols)) {
      return { error: "watchlistSymbols must be an array." };
    }

    const deduped = [...new Set(payload.watchlistSymbols.map(normalizeSymbol).filter(Boolean))];

    if (deduped.length === 0) {
      return { error: "watchlistSymbols cannot be empty." };
    }

    if (deduped.length > WATCHLIST_MAX_SIZE) {
      return { error: `watchlistSymbols cannot exceed ${WATCHLIST_MAX_SIZE} symbols.` };
    }

    if (!deduped.every((symbol) => SYMBOL_REGEX.test(symbol))) {
      return { error: "watchlistSymbols contains invalid symbols." };
    }

    update.watchlistSymbols = deduped;
  }

  if (Object.hasOwn(payload, "defaultSymbol")) {
    const symbol = normalizeSymbol(payload.defaultSymbol);
    if (!SYMBOL_REGEX.test(symbol)) {
      return { error: "defaultSymbol is invalid." };
    }
    update.defaultSymbol = symbol;
  }

  if (Object.hasOwn(payload, "defaultInterval")) {
    const interval = String(payload.defaultInterval || "").trim();
    if (!ALLOWED_INTERVALS.includes(interval)) {
      return { error: "defaultInterval is invalid." };
    }
    update.defaultInterval = interval;
  }

  return { update };
};

module.exports = {
  DEFAULT_PREFERENCES,
  ALLOWED_INTERVALS,
  WATCHLIST_MAX_SIZE,
  normalizeSymbol,
  parsePreferencesPatch,
};
