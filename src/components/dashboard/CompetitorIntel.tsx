import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Competitor {
  id: string;
  name: string;
  region: "IDN" | "GCC" | "PAK" | "AUS";
  sku: "sheep" | "goat" | "cattle";
  pricePerKg: number;
  ourPrice: number;
  delta: number;
  marketShare: number;
  trend: "aggressive" | "stable" | "retreating";
  lastSeen: string;
  notes: string;
}

const competitors: Competitor[] = [
  { id: "c1", name: "PT Agri Nusantara", region: "IDN", sku: "cattle", pricePerKg: 4.85, ourPrice: 4.62, delta: -0.23, marketShare: 18, trend: "aggressive", lastSeen: "2026-04-04T08:12:00Z", notes: "Aggressively expanding West Java feedlots. Secured new credit line from Bank Mandiri." },
  { id: "c2", name: "Al Watania Group", region: "GCC", sku: "sheep", pricePerKg: 6.20, ourPrice: 5.95, delta: -0.25, marketShare: 22, trend: "aggressive", lastSeen: "2026-04-03T14:30:00Z", notes: "Pre-buying for Hajj season. Offering premium over market to lock supply in Pakistan & Horn of Africa." },
  { id: "c3", name: "MeatCo International", region: "AUS", sku: "cattle", pricePerKg: 5.10, ourPrice: 4.62, delta: -0.48, marketShare: 15, trend: "stable", lastSeen: "2026-04-02T11:00:00Z", notes: "Focused on chilled beef export to Japan/Korea. Minimal overlap on live export routes." },
  { id: "c4", name: "Karachi Livestock Corp", region: "PAK", sku: "goat", pricePerKg: 3.95, ourPrice: 3.80, delta: -0.15, marketShare: 9, trend: "retreating", lastSeen: "2026-04-04T06:45:00Z", notes: "Scaling back after flood losses in Sindh. Reduced buying volume 30% MoM." },
  { id: "c5", name: "Gulf Cattle Company", region: "GCC", sku: "cattle", pricePerKg: 5.40, ourPrice: 4.62, delta: -0.78, marketShare: 12, trend: "aggressive", lastSeen: "2026-04-03T19:20:00Z", notes: "New Saudi contract for 50K head/year. Building cold chain infrastructure in Dammam." },
  { id: "c6", name: "Sumber Ternak Sejahtera", region: "IDN", sku: "goat", pricePerKg: 3.65, ourPrice: 3.80, delta: 0.15, marketShare: 7, trend: "stable", lastSeen: "2026-04-01T09:30:00Z", notes: "Small regional player. Steady volumes but no expansion signals." },
  { id: "c7", name: "Aussie Pastoral Holdings", region: "AUS", sku: "sheep", pricePerKg: 5.70, ourPrice: 5.95, delta: 0.25, marketShare: 11, trend: "retreating", lastSeen: "2026-03-30T16:00:00Z", notes: "Hit by drought in Queensland. Reducing flock sizes. May exit live export within 12 months." },
  { id: "c8", name: "Multan AgriTrade", region: "PAK", sku: "sheep", pricePerKg: 4.10, ourPrice: 3.90, delta: -0.20, marketShare: 6, trend: "stable", lastSeen: "2026-04-02T07:15:00Z", notes: "Consistent buyer at Lahore mandi. Reliable mid-tier competitor with govt subsidy backing." },
];

const regionColors: Record<string, string> = {
  IDN: "bg-blue-500/15 text-blue-400",
  GCC: "bg-amber-500/15 text-amber-400",
  PAK: "bg-emerald-500/15 text-emerald-400",
  AUS: "bg-purple-500/15 text-purple-400",
};

const skuColors: Record<string, string> = {
  sheep: "bg-sky-500/15 text-sky-400",
  goat: "bg-orange-500/15 text-orange-400",
  cattle: "bg-rose-500/15 text-rose-400",
};

const trendConfig: Record<string, { label: string; color: string; bg: string }> = {
  aggressive: { label: "AGGRESSIVE", color: "text-red-400", bg: "bg-red-500/10" },
  stable: { label: "STABLE", color: "text-slate-400", bg: "bg-slate-500/10" },
  retreating: { label: "RETREATING", color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000);
  if (diffH < 1) return "< 1h ago";
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

const sorted = [...competitors].sort((a, b) => a.delta - b.delta);

export default function CompetitorIntel(): ReactNode {
  const aggressiveCount = competitors.filter(c => c.trend === "aggressive").length;

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <Eye className="h-3.5 w-3.5 text-violet-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Competitor Intelligence</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-violet-400" />
          <span className="text-[8px] font-bold tracking-wider text-violet-400 uppercase">{aggressiveCount} Aggressive</span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 border-b border-[#0f1a2e] text-[8px]">
        <span className="text-slate-600">Tracking <span className="text-slate-300 font-bold">{competitors.length}</span> competitors</span>
        <span className="text-slate-700">|</span>
        <span className="text-red-400 font-bold">{aggressiveCount} aggressive</span>
        <span className="text-slate-700">|</span>
        <span className="text-slate-500">{competitors.filter(c => c.trend === "stable").length} stable</span>
        <span className="text-slate-700">|</span>
        <span className="text-emerald-400">{competitors.filter(c => c.trend === "retreating").length} retreating</span>
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {sorted.map(comp => {
          const trend = trendConfig[comp.trend];
          const weAreCheaper = comp.delta < 0;

          return (
            <div key={comp.id} className="px-4 py-2.5 hover:bg-[#0a1020] transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-200">{comp.name}</span>
                  <span className={cn("px-1.5 py-0.5 rounded text-[7px] font-bold tracking-wider", regionColors[comp.region])}>
                    {comp.region}
                  </span>
                  <span className={cn("px-1.5 py-0.5 rounded text-[7px] font-bold tracking-wider uppercase", skuColors[comp.sku])}>
                    {comp.sku}
                  </span>
                </div>
                <span className={cn("px-1.5 py-0.5 rounded text-[7px] font-bold tracking-wider", trend.bg, trend.color)}>
                  {trend.label}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-1.5">
                <div className="flex items-center gap-2 text-[9px]">
                  <span className="text-slate-600">THEM</span>
                  <span className="text-slate-300 font-bold font-mono">${comp.pricePerKg.toFixed(2)}</span>
                  <span className="text-slate-700">/kg</span>
                </div>
                <div className="flex items-center gap-2 text-[9px]">
                  <span className="text-slate-600">US</span>
                  <span className="text-cyan-400 font-bold font-mono">${comp.ourPrice.toFixed(2)}</span>
                  <span className="text-slate-700">/kg</span>
                </div>
                <div className="flex items-center gap-1 text-[9px]">
                  <span className="text-slate-600">&Delta;</span>
                  <span className={cn(
                    "font-bold font-mono",
                    weAreCheaper ? "text-emerald-400" : "text-red-400"
                  )}>
                    {comp.delta > 0 ? "+" : ""}{comp.delta.toFixed(2)}
                  </span>
                  <span className={cn(
                    "text-[7px] font-bold",
                    weAreCheaper ? "text-emerald-500" : "text-red-500"
                  )}>
                    {weAreCheaper ? "CHEAPER" : "UNDERCUT"}
                  </span>
                </div>

                <div className="flex items-center gap-1 ml-auto">
                  <div className="w-16 h-1.5 bg-[#0f1a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500/60 rounded-full"
                      style={{ width: `${comp.marketShare}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-500 font-mono">{comp.marketShare}%</span>
                </div>
              </div>

              <p className="text-[8px] text-slate-500 leading-relaxed mb-1">{comp.notes}</p>

              <div className="text-[7px] text-slate-700">
                Last seen: {formatTime(comp.lastSeen)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
