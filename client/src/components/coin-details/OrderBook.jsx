const formatValue = (value, digits = 4) => Number(value || 0).toFixed(digits);

const SideTable = ({ title, rows, colorClass }) => (
  <div>
    <h3 className="mb-2 text-sm font-semibold text-slate-300">{title}</h3>
    <table className="min-w-full text-left text-xs text-slate-300">
      <thead>
        <tr className="text-slate-500">
          <th className="pb-2">Price</th>
          <th className="pb-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([price, qty]) => (
          <tr key={`${title}-${price}`} className="border-t border-slate-800">
            <td className={`py-2 ${colorClass}`}>{formatValue(price, 2)}</td>
            <td className="py-2">{formatValue(qty, 6)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const OrderBook = ({ depth }) => (
  <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
    <h2 className="mb-4 text-lg font-semibold text-white">Order Book</h2>
    <div className="grid gap-6 md:grid-cols-2">
      <SideTable title="Bids" rows={depth?.bids || []} colorClass="text-emerald-400" />
      <SideTable title="Asks" rows={depth?.asks || []} colorClass="text-rose-400" />
    </div>
  </section>
);
