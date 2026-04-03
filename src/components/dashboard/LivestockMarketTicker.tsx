import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ticker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  currency: string;
  sparkline: number[];
  category: "livestock" | "feed" | "energy";
}

const tickers: Ticker[] = [
  { symbol: "LC", name: "Live Cattle", price: 198.45, change: 2.35, changePct: 1.2, currency: "USD/cwt", sparkline: [190, 192, 194, 191, 195, 197, 196, 198], category: "livestock" },
  { symbol: "FC", name: "Feeder Cattle", price: 262.80, change: -1.15, changePct: -0.4, currency: "USD/cwt", sparkline: [265, 264, 263, 266, 264, 263, 264, 263], category: "livestock" },
  { symbol: "SHP-JKT", name: "Sheep (Jakarta)", price: 4.85, change: 0.42, changePct: 9.5, currency: "USD/kg", sparkline: [4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.85], category: "livestock" },
  { symbol: "GT-JKT", name: "Goat (Jakarta)", price: 5.12, change: 0.18, changePct: 3.6, currency: "USD/kg", sparkline: [4.8, 4.85, 4.9, 4.95, 5.0, 5.05, 5.1, 5.12], category: "livestock" },
  { symbol: "GT-DXB", name: "Goat (Dubai)", price: 6.80, change: -0.05, changePct: -0.7, currency: "USD/kg", sparkline: [6.9, 6.88, 6.85, 6.82, 6.84, 6.83, 6.81, 6.80], category: "livestock" },
  { symbol: "CTL-IDN", name: "Cattle (Indonesia)", price: 3.95, change: 0.12, changePct: 3.1, currency: "USD/kg", sparkline: [3.7, 3.75, 3.8, 3.82, 3.85, 3.88, 3.92, 3.95], category: "livestock" },
  { symbol: "ZC", name: "Corn Futures", price: 478.50, change: 22.75, changePct: 5.0, currency: "USd/bu", sparkline: [440, 445, 450, 455, 460, 465, 470, 478], category: "feed" },
  { symbol: "ZS", name: "Soybean Meal", price: 342.20, change: 12.40, changePct: 3.8, currency: "USD/t", sparkline: [315, 320, 325, 328, 332, 335, 338, 342], category: "feed" },
  { symbol: "HAY-IDN", name: "Hay (Indonesia)", price: 185.00, change: 8.50, changePct: 4.8, currency: "USD/t", sparkline: [165, 168, 172, 175, 178, 180, 182, 185], category: "feed" },
  { symbol: "CL", name: "Crude Oil (WTI)", price: 78.42, change: -1.23, changePct: -1.5, currency: "USD/bbl", sparkline: [82, 81, 80, 79, 80, 79, 79, 78], category: "energy" },
  { symbol: "NG", name: "Natural Gas", price: 2.84, change: 0.06, changePct: 2.2, currency: "USD/MMBtu", sparkline: [2.65, 2.7, 2.72, 2.75, 2.78, 2.8, 2.82, 2.84], category: "energy" },
  { symbol: "DSL-IDN", name: "Diesel (Indonesia)", price: 1.12, change: 0.03, changePct: 2.7, currency: "USD/L", sparkline: [1.05, 1.06, 1.07, 1.08, 1.09, 1.1, 1.11, 1.12], category: "energy" },
];

const categoryLabels = { livestock: "LIVESTOCK", feed: "FEED & GRAIN", energy: "ENERGY" };

export default function LivestockMarketTicker() {
  const grouped = {
    livestock: tickers.filter(t => t.category === "livestock"),
    feed: tickers.filter(t => t.category === "feed"),
    energy: tickers.filter(t => t.category === "energy"),
  };

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Market Ticker</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[8px] font-bold tracking-wider text-emerald-400 uppercase">Live</span>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map(cat => (
          <div key={cat}>
            <div className="px-4 py-1.5 bg-[#060a12] sticky top-0 z-10">
              <span className="text-[8px] font-bold tracking-[0.2em] text-slate-600 uppercase">{categoryLabels[cat]}</span>
            </div>
            {grouped[cat].map(t => {
              const isUp = t.change >= 0;
              return (
                <div key={t.symbol} className="flex items-center px-4 py-1.5 hover:bg-[#0a1020] transition-colors">
                  <div className="w-[52px] shrink-0">
                    <span className="text-[9px] font-bold text-slate-500 tracking-wider">{t.symbol}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-slate-400 truncate block">{t.name}</span>
                  </div>
                  {/* Sparkline */}
                  <svg width="36" height="12" viewBox="0 0 36 12" className="shrink-0 mx-2">
                    <polyline
                      fill="none"
                      stroke={isUp ? "#22c55e" : "#ef4444"}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={t.sparkline.map((v, i) => {
                        const min = Math.min(...t.sparkline);
                        const max = Math.max(...t.sparkline);
                        const range = max - min || 1;
                        return `${(i / (t.sparkline.length - 1)) * 36},${12 - ((v - min) / range) * 12}`;
                      }).join(" ")}
                    />
                  </svg>
                  <div className="text-right shrink-0 w-[70px]">
                    <span className="text-[10px] font-bold text-white tabular-nums block">{t.price.toFixed(2)}</span>
                    <span className="text-[8px] text-slate-600">{t.currency}</span>
                  </div>
                  <div className="w-[55px] text-right shrink-0">
                    <span className={cn("text-[9px] font-bold tabular-nums", isUp ? "text-emerald-400" : "text-red-400")}>
                      {isUp ? "+" : ""}{t.changePct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
