const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatPercent = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;
};

export const CoinHeader = ({ summary }) => {
  const isDown = Number(summary?.priceChangePercent) < 0;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-xs uppercase tracking-wider text-slate-400">{summary?.symbol}</p>
      <div className="mt-2 flex flex-wrap items-end gap-4">
        <h1 className="text-3xl font-semibold text-white">{formatCurrency(summary?.lastPrice)}</h1>
        <p className={isDown ? "text-rose-400" : "text-emerald-400"}>{formatPercent(summary?.priceChangePercent)} (24h)</p>
      </div>
    </section>
  );
};
