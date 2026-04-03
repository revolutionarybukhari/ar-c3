import { useState } from "react";
import { Ship, TrendingUp, Route, Anchor } from "lucide-react";
import { cn } from "@/lib/utils";

interface Corridor {
  id: string;
  name: string;
  from: string;
  to: string;
  status: "operational" | "disrupted" | "closed";
  capacity: number; // percentage
  vessels: number;
  transitDays: number;
  risk: "low" | "medium" | "high" | "critical";
}

interface Chokepoint {
  id: string;
  name: string;
  region: string;
  riskScore: number; // 0-100
  status: string;
  impactedRoutes: number;
  vesselQueue: number;
}

interface RateIndex {
  id: string;
  route: string;
  current: number;
  previous: number;
  unit: string;
  trend: number; // percentage change
}

const corridors: Corridor[] = [
  { id: "c1", name: "Pakistan → Indonesia (Karachi-Surabaya)", from: "PAK", to: "IDN", status: "disrupted", capacity: 58, vessels: 3, transitDays: 12, risk: "high" },
  { id: "c2", name: "Uganda → Indonesia (Mombasa-Jakarta)", from: "UGA", to: "IDN", status: "operational", capacity: 82, vessels: 5, transitDays: 18, risk: "low" },
  { id: "c3", name: "Yemen → Singapore (Aden-SIN)", from: "YEM", to: "SGP", status: "disrupted", capacity: 35, vessels: 1, transitDays: 8, risk: "critical" },
  { id: "c4", name: "Syria → UAE (Latakia-Jebel Ali)", from: "SYR", to: "UAE", status: "operational", capacity: 71, vessels: 4, transitDays: 6, risk: "medium" },
  { id: "c5", name: "Australia → Indonesia (Darwin-Jakarta)", from: "AUS", to: "IDN", status: "operational", capacity: 91, vessels: 7, transitDays: 5, risk: "low" },
  { id: "c6", name: "India → GCC (Mumbai-Jebel Ali)", from: "IND", to: "UAE", status: "operational", capacity: 76, vessels: 6, transitDays: 4, risk: "low" },
];

const chokepoints: Chokepoint[] = [
  { id: "cp1", name: "Strait of Hormuz", region: "GCC", riskScore: 72, status: "Elevated security — sanctions enforcement", impactedRoutes: 4, vesselQueue: 12 },
  { id: "cp2", name: "Suez Canal", region: "MENA", riskScore: 45, status: "Normal operations — minor delays", impactedRoutes: 6, vesselQueue: 3 },
  { id: "cp3", name: "Strait of Malacca", region: "SEA", riskScore: 28, status: "Clear passage — routine inspections", impactedRoutes: 5, vesselQueue: 1 },
  { id: "cp4", name: "Tanjung Priok Port", region: "IDN", riskScore: 68, status: "Congestion — 48h delay on livestock vessels", impactedRoutes: 3, vesselQueue: 8 },
  { id: "cp5", name: "Karachi Port", region: "PAK", riskScore: 85, status: "Flood damage — limited berth capacity", impactedRoutes: 2, vesselQueue: 15 },
  { id: "cp6", name: "Mombasa Port", region: "EAF", riskScore: 32, status: "Operational — vet inspection backlog", impactedRoutes: 2, vesselQueue: 4 },
];

const rates: RateIndex[] = [
  { id: "r1", route: "PAK → IDN (Livestock)", current: 4850, previous: 3920, unit: "USD/TEU", trend: 23.7 },
  { id: "r2", route: "UGA → IDN (Livestock)", current: 5200, previous: 5100, unit: "USD/TEU", trend: 2.0 },
  { id: "r3", route: "AUS → IDN (Cattle)", current: 3800, previous: 3650, unit: "USD/TEU", trend: 4.1 },
  { id: "r4", route: "YEM → SGP (Livestock)", current: 6100, previous: 4200, unit: "USD/TEU", trend: 45.2 },
  { id: "r5", route: "SYR → UAE (Livestock)", current: 2900, previous: 2750, unit: "USD/TEU", trend: 5.5 },
  { id: "r6", route: "IND → UAE (Cattle)", current: 2100, previous: 2200, unit: "USD/TEU", trend: -4.5 },
  { id: "r7", route: "IDN Domestic (Truck)", current: 85, previous: 78, unit: "USD/hd", trend: 9.0 },
  { id: "r8", route: "GCC Domestic (Truck)", current: 42, previous: 40, unit: "USD/hd", trend: 5.0 },
];

const statusColors = {
  operational: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  disrupted: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  closed: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
};

const riskColors = {
  low: "text-emerald-400",
  medium: "text-amber-400",
  high: "text-orange-400",
  critical: "text-red-400",
};

function riskScoreColor(score: number): string {
  if (score >= 75) return "#ef4444";
  if (score >= 50) return "#f59e0b";
  if (score >= 25) return "#3b82f6";
  return "#22c55e";
}

export default function SupplyChainMonitor() {
  const [tab, setTab] = useState<"corridors" | "chokepoints" | "rates">("corridors");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <Ship className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Supply Chain Monitor</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[8px] font-bold tracking-wider text-emerald-400 uppercase">Live</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#0f1a2e]">
        {([
          { key: "corridors" as const, label: "CORRIDORS", icon: Route },
          { key: "chokepoints" as const, label: "CHOKEPOINTS", icon: Anchor },
          { key: "rates" as const, label: "RATES", icon: TrendingUp },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex items-center gap-1 px-3 py-2 text-[9px] font-bold tracking-[0.12em] uppercase transition-colors border-b-2",
              tab === t.key
                ? "text-cyan-400 border-cyan-400"
                : "text-slate-600 border-transparent hover:text-slate-400"
            )}
          >
            <t.icon className="h-3 w-3" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-h-[320px] overflow-y-auto">
        {tab === "corridors" && (
          <div className="divide-y divide-[#0f1a2e]">
            {corridors.map(c => {
              const sc = statusColors[c.status];
              return (
                <div key={c.id} className="px-4 py-2.5 hover:bg-[#0a1020] transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-slate-300">{c.name}</span>
                    <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase", sc.bg, sc.text)}>
                      {c.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[9px]">
                    <span className="text-slate-500">Capacity:</span>
                    <div className="flex-1 h-1 bg-[#1a2236] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${c.capacity}%`, backgroundColor: c.capacity > 70 ? "#22c55e" : c.capacity > 40 ? "#f59e0b" : "#ef4444" }}
                      />
                    </div>
                    <span className="text-slate-400 font-bold tabular-nums">{c.capacity}%</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-500">{c.vessels} vessels</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-500">{c.transitDays}d transit</span>
                    <span className="text-slate-600">|</span>
                    <span className={cn("font-bold uppercase", riskColors[c.risk])}>{c.risk}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "chokepoints" && (
          <div className="divide-y divide-[#0f1a2e]">
            {chokepoints.map(cp => (
              <div key={cp.id} className="px-4 py-2.5 hover:bg-[#0a1020] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-300">{cp.name}</span>
                    <span className="text-[8px] text-slate-600 tracking-wider">{cp.region}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold tabular-nums" style={{ color: riskScoreColor(cp.riskScore) }}>
                      {cp.riskScore}
                    </span>
                    <div className="w-[40px] h-1.5 bg-[#1a2236] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${cp.riskScore}%`, backgroundColor: riskScoreColor(cp.riskScore) }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 mb-1">{cp.status}</p>
                <div className="flex items-center gap-3 text-[8px] text-slate-600">
                  <span>{cp.impactedRoutes} routes impacted</span>
                  <span>|</span>
                  <span>{cp.vesselQueue} vessels queued</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "rates" && (
          <div className="divide-y divide-[#0f1a2e]">
            {rates.map(r => (
              <div key={r.id} className="flex items-center justify-between px-4 py-2 hover:bg-[#0a1020] transition-colors">
                <span className="text-[10px] text-slate-400 flex-1">{r.route}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-white tabular-nums">
                    {r.unit === "USD/TEU" ? `$${r.current.toLocaleString()}` : `$${r.current}`}
                  </span>
                  <span className="text-[8px] text-slate-600">{r.unit}</span>
                  <span className={cn(
                    "text-[9px] font-bold tabular-nums",
                    r.trend > 0 ? "text-red-400" : "text-emerald-400"
                  )}>
                    {r.trend > 0 ? "+" : ""}{r.trend.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
