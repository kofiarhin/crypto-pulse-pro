import React from "react";
import { Link } from "react-router-dom";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatCompact = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  });

const formatPercent = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;
};

export const MarketTable = ({ rows }) => {
  if (!rows.length) {
    return <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-300">No markets available.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Coin</th>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">24h %</th>
            <th className="px-4 py-3">Market Cap</th>
            <th className="px-4 py-3">Volume</th>
            <th className="px-4 py-3">Circulating Supply</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((coin) => (
            <tr key={coin.id} className="border-t border-slate-800 text-slate-200 hover:bg-slate-800/40">
              <td className="px-4 py-3">{coin.rank || "-"}</td>
              <td className="px-4 py-3">
                <Link to={`/coins/${coin.binanceSymbol}`} className="flex items-center gap-3 font-medium text-white">
                  {coin.image ? <img src={coin.image} alt={`${coin.name} logo`} className="h-5 w-5 rounded-full" /> : null}
                  {coin.name}
                </Link>
              </td>
              <td className="px-4 py-3">{coin.symbol}</td>
              <td className="px-4 py-3">{formatCurrency(coin.price)}</td>
              <td className={`px-4 py-3 ${Number(coin.percentChange24h) < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                {formatPercent(coin.percentChange24h)}
              </td>
              <td className="px-4 py-3">{formatCompact(coin.marketCap)}</td>
              <td className="px-4 py-3">{formatCompact(coin.volume24h)}</td>
              <td className="px-4 py-3">{formatCompact(coin.circulatingSupply)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
