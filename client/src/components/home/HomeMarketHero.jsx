import { PriceChart } from "../coin-details/PriceChart";
import {
  formatSymbolDisplay,
  formatCurrency,
  formatPercent,
  formatCompact,
} from "../../utils/marketFormatters";

const INTERVALS = ["1m", "5m", "15m", "1h"];

export const HomeMarketHero = ({
  symbol,
  interval,
  summary,
  candles,
  isLoadingSummary,
  isLoadingChart,
  onIntervalChange,
}) => {
  const changePercent = Number(summary?.priceChangePercent ?? 0);
  const isPositive = changePercent >= 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{formatSymbolDisplay(symbol)}</p>

          {isLoadingSummary ? (
            <div className="mt-1 space-y-2">
              <div className="h-8 w-48 animate-pulse rounded bg-slate-800" />
              <div className="h-4 w-20 animate-pulse rounded bg-slate-800" />
            </div>
          ) : (
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-bold text-white">
                {formatCurrency(summary?.lastPrice)}
              </span>
              <span
                className={
                  isPositive ? "text-emerald-400 font-medium" : "text-red-400 font-medium"
                }
              >
                {formatPercent(summary?.priceChangePercent)}
              </span>
            </div>
          )}
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs text-emerald-400 font-medium">LIVE</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-6 mt-3 text-sm text-slate-400">
        {isLoadingSummary ? (
          <>
            <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />
            <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />
            <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />
          </>
        ) : summary ? (
          <>
            <span>
              24H HIGH:{" "}
              <span className="text-white">{formatCurrency(summary.highPrice)}</span>
            </span>
            <span>
              24H LOW:{" "}
              <span className="text-white">{formatCurrency(summary.lowPrice)}</span>
            </span>
            <span>
              VOLUME:{" "}
              <span className="text-white">{formatCompact(summary.volume)}</span>
            </span>
          </>
        ) : (
          <p className="text-slate-400 text-sm">Could not load market data.</p>
        )}
      </div>

      {/* Interval selector */}
      <div className="flex gap-2 mt-4">
        {INTERVALS.map((iv) => (
          <button
            key={iv}
            type="button"
            onClick={() => onIntervalChange(iv)}
            className={
              iv === interval
                ? "bg-blue-600 text-white rounded-md px-3 py-1 text-xs font-medium"
                : "border border-slate-700 text-slate-300 rounded-md px-3 py-1 text-xs hover:bg-slate-800"
            }
          >
            {iv}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-4">
        {isLoadingChart ? (
          <div className="h-64 rounded bg-slate-800 animate-pulse" />
        ) : (
          <PriceChart candles={candles} />
        )}
      </div>
    </div>
  );
};
