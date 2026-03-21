const Home = ({
  featuredPair,
  marketHighlights = [],
  stats = [],
  intervals = [],
  selectedInterval = "",
  marketWatch = [],
  autoRefreshLabel = "Live market updates",
}) => {
  return (
    <section className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-blue-950/40 to-emerald-950/20 p-6 shadow-xl lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-400">
              Crypto Pulse Pro
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Crypto Dashboard
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
              Track market movement, monitor key pairs, and stay on top of
              crypto performance in one place.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 self-start rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            {autoRefreshLabel}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {marketHighlights.map((coin) => (
            <article
              key={coin.symbol}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{coin.symbol}</h2>
                  <p className="mt-2 text-2xl font-semibold text-slate-200">
                    {coin.price}
                  </p>
                </div>

                <span
                  className={`text-sm font-semibold ${
                    coin.change?.startsWith("-")
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  {coin.change}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-400">
                {featuredPair?.symbol || "Selected Pair"}
              </p>

              <div className="mt-3 flex flex-wrap items-end gap-3">
                <h2 className="text-4xl font-bold sm:text-6xl">
                  {featuredPair?.price || "--"}
                </h2>

                <span
                  className={`pb-2 text-2xl font-semibold ${
                    featuredPair?.change?.startsWith("-")
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  {featuredPair?.changeAmount || ""}
                  {featuredPair?.changePercent
                    ? ` (${featuredPair.changePercent})`
                    : ""}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {intervals.map((interval) => (
                <button
                  key={interval}
                  type="button"
                  className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                    selectedInterval === interval
                      ? "border-blue-400 bg-blue-500/20 text-white"
                      : "border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5"
              >
                <p className="text-sm text-slate-400">{stat.label}</p>
                <h3
                  className={`mt-3 text-3xl font-bold ${
                    stat.value?.startsWith("-") ? "text-rose-400" : "text-white"
                  }`}
                >
                  {stat.value}
                </h3>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {featuredPair?.symbol || "Chart"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Interval: {selectedInterval || "--"}
                </p>
              </div>

              <div className="rounded-full bg-emerald-500/15 px-5 py-3 text-xl font-bold text-emerald-400">
                {featuredPair?.price || "--"}
              </div>
            </div>

            <div className="mt-6 flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 text-slate-500">
              Chart goes here
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            <h2 className="text-2xl font-bold">Market Watch</h2>

            <div className="mt-6 space-y-4">
              {marketWatch.map((coin) => (
                <div
                  key={coin.symbol}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4"
                >
                  <div>
                    <p className="font-semibold text-white">{coin.symbol}</p>
                    <p className="mt-1 text-sm text-slate-400">{coin.price}</p>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      coin.change?.startsWith("-")
                        ? "text-rose-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {coin.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
