import { useMemo } from "react";

const CHART_WIDTH = 800;
const CHART_HEIGHT = 260;
const PADDING = 18;

const buildPath = (candles) => {
  if (!candles.length) return "";
  const closes = candles.map((candle) => Number(candle[4]));
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;

  return closes
    .map((close, index) => {
      const x = PADDING + (index * (CHART_WIDTH - PADDING * 2)) / Math.max(closes.length - 1, 1);
      const y = CHART_HEIGHT - PADDING - ((close - min) / range) * (CHART_HEIGHT - PADDING * 2);
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
};

export const PriceChart = ({ candles }) => {
  const path = useMemo(() => buildPath(candles), [candles]);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="mb-4 text-lg font-semibold text-white">Price Chart</h2>
      {candles.length ? (
        <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="h-64 w-full" role="img" aria-label="Coin chart">
          <path d={path} fill="none" stroke="#60a5fa" strokeWidth="2.5" />
        </svg>
      ) : (
        <p className="text-slate-400">No chart data.</p>
      )}
    </section>
  );
};
