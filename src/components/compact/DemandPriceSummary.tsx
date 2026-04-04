import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const mockPrices = [
  { market: "Jakarta Sheep", price: "$4.85/kg", change: +3.2 },
  { market: "Dubai Goat", price: "$5.20/kg", change: -1.1 },
  { market: "Riyadh Cattle", price: "$8.90/kg", change: +0.8 },
];

const avgSpread = +2.4;

export default function DemandPriceSummary() {
  return (
    <div className="flex h-full flex-col justify-between px-3 py-2.5">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <DollarSign className="h-3 w-3 text-amber-400" />
        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
          Price Snapshot
        </span>
        <TrendingUp className="ml-auto h-2.5 w-2.5 text-slate-500" />
      </div>

      {/* Price rows */}
      <div className="flex flex-col gap-1.5">
        {mockPrices.map((item) => {
          const isUp = item.change > 0;
          return (
            <div key={item.market} className="flex items-center justify-between">
              <span className="text-[8px] text-slate-500">{item.market}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium tabular-nums text-slate-200">
                  {item.price}
                </span>
                <span
                  className={cn(
                    "text-[8px] font-medium tabular-nums",
                    isUp ? "text-red-400" : "text-emerald-400"
                  )}
                >
                  {isUp ? "+" : ""}
                  {item.change}%
                </span>
                {isUp ? (
                  <TrendingUp className="h-2 w-2 text-red-400" />
                ) : (
                  <TrendingDown className="h-2 w-2 text-emerald-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Spread footer */}
      <div className="flex items-center gap-1">
        <span className="text-[8px] text-slate-500">Avg spread vs. last month:</span>
        <span
          className={cn(
            "text-[9px] font-medium tabular-nums",
            avgSpread > 0 ? "text-red-400" : "text-emerald-400"
          )}
        >
          {avgSpread > 0 ? "+" : ""}
          {avgSpread}%
        </span>
        {avgSpread > 0 ? (
          <TrendingUp className="h-2 w-2 text-red-400" />
        ) : (
          <TrendingDown className="h-2 w-2 text-emerald-400" />
        )}
      </div>
    </div>
  );
}
