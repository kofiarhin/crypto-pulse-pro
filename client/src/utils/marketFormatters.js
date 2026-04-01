const QUOTE_ASSETS = ["USDT", "BUSD", "USDC", "BTC", "ETH", "BNB"];

export function formatSymbolDisplay(symbol) {
  if (!symbol) return symbol;
  const quote = QUOTE_ASSETS.find((q) => symbol.endsWith(q));
  if (!quote) return symbol;
  const base = symbol.slice(0, symbol.length - quote.length);
  return `${base}/${quote}`;
}

export function formatCurrency(value) {
  return Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function formatPercent(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;
}

export function formatCompact(value) {
  return Number(value || 0).toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
}
