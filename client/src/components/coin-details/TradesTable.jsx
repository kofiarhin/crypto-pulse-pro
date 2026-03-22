const formatValue = (value, digits = 4) => Number(value || 0).toFixed(digits);

export const TradesTable = ({ trades }) => (
  <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
    <h2 className="mb-4 text-lg font-semibold text-white">Recent Trades</h2>
    <div className="overflow-auto">
      <table className="min-w-full text-left text-xs text-slate-300">
        <thead>
          <tr className="text-slate-500">
            <th className="pb-2">Price</th>
            <th className="pb-2">Qty</th>
            <th className="pb-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id} className="border-t border-slate-800">
              <td className={`py-2 ${trade.isBuyerMaker ? "text-rose-400" : "text-emerald-400"}`}>{formatValue(trade.price, 2)}</td>
              <td className="py-2">{formatValue(trade.qty, 6)}</td>
              <td className="py-2">{new Date(trade.time).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
