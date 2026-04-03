import { DollarSign, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteMargin {
  id: string;
  route: string;
  sku: "sheep" | "goat" | "cattle";
  procurement: number;
  transport: number;
  feed: number;
  veterinary: number;
  logistics: number;
  insurance: number;
  totalCost: number;
  sellingPrice: number;
  margin: number;
  marginPct: number;
  volume: number;
  trend: "improving" | "declining" | "stable";
}

const routes: RouteMargin[] = [
  { id: "r1", route: "Pakistan → Indonesia", sku: "goat", procurement: 82, transport: 45, feed: 28, veterinary: 14, logistics: 18, insurance: 8, totalCost: 195, sellingPrice: 248, margin: 53, marginPct: 21.4, volume: 3200, trend: "improving" },
  { id: "r2", route: "Pakistan → UAE", sku: "sheep", procurement: 96, transport: 32, feed: 22, veterinary: 12, logistics: 15, insurance: 6, totalCost: 183, sellingPrice: 215, margin: 32, marginPct: 14.9, volume: 5400, trend: "stable" },
  { id: "r3", route: "Uganda → Indonesia", sku: "cattle", procurement: 420, transport: 180, feed: 95, veterinary: 45, logistics: 62, insurance: 28, totalCost: 830, sellingPrice: 980, margin: 150, marginPct: 15.3, volume: 800, trend: "improving" },
  { id: "r4", route: "Australia → Indonesia", sku: "cattle", procurement: 580, transport: 120, feed: 68, veterinary: 35, logistics: 48, insurance: 32, totalCost: 883, sellingPrice: 1020, margin: 137, marginPct: 13.4, volume: 1200, trend: "declining" },
  { id: "r5", route: "Pakistan → Yemen", sku: "sheep", procurement: 88, transport: 55, feed: 30, veterinary: 16, logistics: 22, insurance: 12, totalCost: 223, sellingPrice: 242, margin: 19, marginPct: 7.9, volume: 1800, trend: "declining" },
  { id: "r6", route: "Uganda → UAE", sku: "goat", procurement: 68, transport: 72, feed: 35, veterinary: 18, logistics: 25, insurance: 10, totalCost: 228, sellingPrice: 278, margin: 50, marginPct: 18.0, volume: 1400, trend: "improving" },
  { id: "r7", route: "Pakistan → Singapore", sku: "goat", procurement: 90, transport: 58, feed: 25, veterinary: 15, logistics: 20, insurance: 9, totalCost: 217, sellingPrice: 260, margin: 43, marginPct: 16.5, volume: 600, trend: "stable" },
  { id: "r8", route: "Yemen → UAE", sku: "sheep", procurement: 105, transport: 28, feed: 18, veterinary: 10, logistics: 12, insurance: 5, totalCost: 178, sellingPrice: 185, margin: 7, marginPct: 3.8, volume: 900, trend: "declining" },
];

const skuConfig = {
  sheep: { label: "SHEEP", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  goat: { label: "GOAT", color: "text-amber-400", bg: "bg-amber-500/10" },
  cattle: { label: "CATTLE", color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

const trendConfig = {
  improving: { label: "IMPROVING", color: "text-emerald-400", Icon: TrendingUp },
  declining: { label: "DECLINING", color: "text-red-400", Icon: TrendingDown },
  stable: { label: "STABLE", color: "text-slate-400", Icon: Minus },
};

const costSegments = [
  { key: "procurement" as const, color: "#3b82f6", label: "Procurement" },
  { key: "transport" as const, color: "#06b6d4", label: "Transport" },
  { key: "feed" as const, color: "#f59e0b", label: "Feed" },
  { key: "veterinary" as const, color: "#10b981", label: "Veterinary" },
  { key: "logistics" as const, color: "#a855f7", label: "Logistics" },
  { key: "insurance" as const, color: "#64748b", label: "Insurance" },
];

function marginColor(pct: number): string {
  if (pct >= 15) return "text-emerald-400";
  if (pct >= 5) return "text-amber-400";
  return "text-red-400";
}

function marginBg(pct: number): string {
  if (pct >= 15) return "bg-emerald-500/10";
  if (pct >= 5) return "bg-amber-500/10";
  return "bg-red-500/10";
}

export default function CostMarginAnalyzer() {
  const avgMargin = (routes.reduce((s, r) => s + r.marginPct, 0) / routes.length).toFixed(1);
  const bestRoute = routes.reduce((a, b) => (a.marginPct > b.marginPct ? a : b));
  const worstRoute = routes.reduce((a, b) => (a.marginPct < b.marginPct ? a : b));

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Cost & Margin Analyzer</span>
        </div>
        <span className="text-[8px] font-bold tracking-wider text-slate-600 uppercase">{routes.length} Routes</span>
      </div>

      <div className="flex items-center gap-4 px-4 py-2 border-b border-[#0f1a2e] text-[9px]">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600">Avg Margin</span>
          <span className={cn("font-bold tabular-nums", marginColor(Number(avgMargin)))}>{avgMargin}%</span>
        </div>
        <span className="text-slate-800">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600">Best</span>
          <span className="text-emerald-400 font-bold">{bestRoute.route}</span>
          <span className="text-emerald-400/70 tabular-nums">{bestRoute.marginPct}%</span>
        </div>
        <span className="text-slate-800">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600">Worst</span>
          <span className="text-red-400 font-bold">{worstRoute.route}</span>
          <span className="text-red-400/70 tabular-nums">{worstRoute.marginPct}%</span>
        </div>
      </div>

      {/* Cost legend */}
      <div className="flex items-center gap-3 px-4 py-1.5 border-b border-[#0f1a2e]">
        {costSegments.map(seg => (
          <div key={seg.key} className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-[7px] text-slate-600">{seg.label}</span>
          </div>
        ))}
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {routes.map(r => {
          const sku = skuConfig[r.sku];
          const trend = trendConfig[r.trend];
          const TrendIcon = trend.Icon;
          return (
            <div key={r.id} className="px-4 py-2.5 hover:bg-[#0a1020] transition-colors">
              {/* Route header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-200">{r.route}</span>
                  <span className={cn("px-1.5 py-0.5 rounded text-[7px] font-bold tracking-wider", sku.bg, sku.color)}>
                    {sku.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendIcon className={cn("h-2.5 w-2.5", trend.color)} />
                  <span className={cn("text-[7px] font-bold tracking-wider", trend.color)}>{trend.label}</span>
                </div>
              </div>

              {/* Cost breakdown bar */}
              <div className="flex h-3 rounded-sm overflow-hidden mb-1.5">
                {costSegments.map(seg => {
                  const pct = (r[seg.key] / r.totalCost) * 100;
                  return (
                    <div
                      key={seg.key}
                      className="h-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: seg.color, opacity: 0.8 }}
                      title={`${seg.label}: $${r[seg.key]} (${pct.toFixed(1)}%)`}
                    />
                  );
                })}
              </div>

              {/* Metrics row */}
              <div className="flex items-center gap-3 text-[8px]">
                <span className="text-slate-600">
                  Cost <span className="text-slate-400 tabular-nums font-bold">${r.totalCost}</span>
                </span>
                <span className="text-slate-600">
                  Sell <span className="text-slate-400 tabular-nums font-bold">${r.sellingPrice}</span>
                </span>
                <span className={cn("px-1.5 py-0.5 rounded font-bold tabular-nums", marginBg(r.marginPct), marginColor(r.marginPct))}>
                  {r.marginPct}% (${r.margin})
                </span>
                <span className="text-slate-600 ml-auto">
                  <span className="tabular-nums text-slate-500">{r.volume.toLocaleString()}</span> hd/mo
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
