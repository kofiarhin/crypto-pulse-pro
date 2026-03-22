import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CoinHeader } from "../../components/coin-details/CoinHeader";
import { PriceChart } from "../../components/coin-details/PriceChart";
import { TradesTable } from "../../components/coin-details/TradesTable";
import { OrderBook } from "../../components/coin-details/OrderBook";
import { useSummaryQuery } from "../../hooks/queries/useSummaryQuery";
import { useKlinesQuery } from "../../hooks/queries/useKlinesQuery";
import { useTradesQuery } from "../../hooks/queries/useTradesQuery";
import { useDepthQuery } from "../../hooks/queries/useDepthQuery";

const INTERVALS = ["1m", "5m", "15m", "1h"];

const isValidBinanceSymbol = (symbol) => /^[A-Z0-9]{5,20}$/.test(symbol || "");

const CoinDetails = () => {
  const { symbol } = useParams();
  const [interval, setInterval] = useState("1m");
  const normalizedSymbol = useMemo(() => String(symbol || "").toUpperCase(), [symbol]);

  const enabled = isValidBinanceSymbol(normalizedSymbol);
  const summaryQuery = useSummaryQuery(normalizedSymbol, { enabled });
  const klinesQuery = useKlinesQuery(normalizedSymbol, interval, { enabled });
  const tradesQuery = useTradesQuery(normalizedSymbol, { enabled });
  const depthQuery = useDepthQuery(normalizedSymbol, { enabled });

  if (!enabled) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-6 text-white">
        <div className="mx-auto max-w-4xl rounded-xl border border-rose-900/50 bg-rose-950/20 p-6">
          <p>Invalid market symbol.</p>
          <Link to="/" className="mt-3 inline-block text-blue-400">Back to markets</Link>
        </div>
      </main>
    );
  }

  const isLoading = summaryQuery.isLoading || klinesQuery.isLoading || tradesQuery.isLoading || depthQuery.isLoading;
  const hasError = summaryQuery.isError || klinesQuery.isError || tradesQuery.isError || depthQuery.isError;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-slate-300 hover:text-white">← Back to markets</Link>
          <div className="flex gap-2">
            {INTERVALS.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setInterval(choice)}
                className={`rounded-md border px-3 py-1 text-sm ${interval === choice ? "border-blue-500 bg-blue-500/20" : "border-slate-700"}`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? <p className="text-slate-300">Loading market details...</p> : null}
        {hasError ? (
          <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-4 text-rose-300">
            <p>{summaryQuery.error?.message || klinesQuery.error?.message || tradesQuery.error?.message || depthQuery.error?.message}</p>
            <button
              type="button"
              className="mt-3 rounded-md border border-rose-600 px-3 py-2"
              onClick={() => {
                summaryQuery.refetch();
                klinesQuery.refetch();
                tradesQuery.refetch();
                depthQuery.refetch();
              }}
            >
              Retry
            </button>
          </div>
        ) : null}

        {summaryQuery.data ? <CoinHeader summary={summaryQuery.data} /> : null}
        {klinesQuery.data ? <PriceChart candles={klinesQuery.data} /> : null}
        <div className="grid gap-4 lg:grid-cols-2">
          <TradesTable trades={tradesQuery.data || []} />
          <OrderBook depth={depthQuery.data || { bids: [], asks: [] }} />
        </div>
      </div>
    </main>
  );
};

export default CoinDetails;
