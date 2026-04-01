import { useState } from "react";
import { useMarketsQuery } from "../../hooks/queries/useMarketsQuery";
import { useSummaryQuery } from "../../hooks/queries/useSummaryQuery";
import { useKlinesQuery } from "../../hooks/queries/useKlinesQuery";
import { MarketTable } from "../../components/market/MarketTable";
import { HomeMarketHero } from "../../components/home/HomeMarketHero";

const Home = () => {
  const [selectedSymbol] = useState("BTCUSDT");
  const [selectedInterval, setSelectedInterval] = useState("1m");

  const marketsQuery = useMarketsQuery(50);
  const summaryQuery = useSummaryQuery(selectedSymbol);
  const klinesQuery = useKlinesQuery(selectedSymbol, selectedInterval);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Crypto Markets</h1>
          <button
            type="button"
            onClick={() => marketsQuery.refetch()}
            className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Refresh
          </button>
        </header>

        <HomeMarketHero
          symbol={selectedSymbol}
          interval={selectedInterval}
          summary={summaryQuery.data}
          candles={klinesQuery.data ?? []}
          isLoadingSummary={summaryQuery.isLoading}
          isLoadingChart={klinesQuery.isLoading}
          onIntervalChange={setSelectedInterval}
        />

        {marketsQuery.isLoading ? <p className="text-slate-300">Loading markets...</p> : null}

        {marketsQuery.isError ? (
          <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-4 text-rose-300">
            <p>{marketsQuery.error.message}</p>
            <button type="button" className="mt-3 rounded-md border border-rose-600 px-3 py-2" onClick={() => marketsQuery.refetch()}>
              Retry
            </button>
          </div>
        ) : null}

        {marketsQuery.isSuccess ? <MarketTable rows={marketsQuery.data} /> : null}
      </div>
    </main>
  );
};

export default Home;
