import { useState } from "react";
import { Truck, Thermometer, Heart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shipment {
  id: string;
  shipmentId: string;
  origin: string;
  destination: string;
  route: string;
  status: "in-transit" | "customs" | "loading" | "delivered" | "delayed";
  departDate: string;
  eta: string;
  headCount: number;
  mortality: number;
  temperature: number;
  vessel: string;
  progress: number;
  welfareStatus: "good" | "concern" | "critical";
}

const shipments: Shipment[] = [
  { id: "s1", shipmentId: "SHP-2026-0412", origin: "Karachi, Pakistan", destination: "Surabaya, Indonesia", route: "Karachi → Surabaya", status: "in-transit", departDate: "2026-03-28", eta: "2026-04-09", headCount: 2400, mortality: 3, temperature: 26.4, vessel: "MV Nusantara Star", progress: 58, welfareStatus: "good" },
  { id: "s2", shipmentId: "SHP-2026-0398", origin: "Mombasa, Kenya", destination: "Jakarta, Indonesia", route: "Mombasa → Jakarta", status: "customs", departDate: "2026-03-20", eta: "2026-04-06", headCount: 1800, mortality: 7, temperature: 28.1, vessel: "MV Indian Ocean II", progress: 92, welfareStatus: "concern" },
  { id: "s3", shipmentId: "SHP-2026-0421", origin: "Darwin, Australia", destination: "Jakarta, Indonesia", route: "Darwin → Jakarta", status: "in-transit", departDate: "2026-04-01", eta: "2026-04-06", headCount: 3200, mortality: 0, temperature: 24.8, vessel: "MV Brahman Express", progress: 65, welfareStatus: "good" },
  { id: "s4", shipmentId: "SHP-2026-0415", origin: "Aden, Yemen", destination: "Singapore", route: "Aden → Singapore", status: "delayed", departDate: "2026-03-25", eta: "2026-04-10", headCount: 900, mortality: 12, temperature: 31.2, vessel: "MV Gulf Carrier", progress: 41, welfareStatus: "critical" },
  { id: "s5", shipmentId: "SHP-2026-0430", origin: "Mumbai, India", destination: "Jebel Ali, UAE", route: "Mumbai → Jebel Ali", status: "loading", departDate: "2026-04-05", eta: "2026-04-09", headCount: 1500, mortality: 0, temperature: 27.0, vessel: "MV Arabian Tide", progress: 5, welfareStatus: "good" },
  { id: "s6", shipmentId: "SHP-2026-0388", origin: "Latakia, Syria", destination: "Jebel Ali, UAE", route: "Latakia → Jebel Ali", status: "delivered", departDate: "2026-03-18", eta: "2026-03-24", headCount: 1100, mortality: 2, temperature: 23.5, vessel: "MV Levant Pioneer", progress: 100, welfareStatus: "good" },
  { id: "s7", shipmentId: "SHP-2026-0425", origin: "Surabaya, Indonesia", destination: "Banjarmasin, Indonesia", route: "Surabaya → Banjarmasin", status: "in-transit", departDate: "2026-04-03", eta: "2026-04-05", headCount: 600, mortality: 0, temperature: 27.8, vessel: "KM Sapi Jaya", progress: 72, welfareStatus: "good" },
  { id: "s8", shipmentId: "SHP-2026-0410", origin: "Karachi, Pakistan", destination: "Jeddah, Saudi Arabia", route: "Karachi → Jeddah", status: "customs", departDate: "2026-03-26", eta: "2026-04-05", headCount: 2000, mortality: 5, temperature: 29.3, vessel: "MV Hajj Livestock I", progress: 88, welfareStatus: "concern" },
];

const statusConfig = {
  "in-transit": { label: "IN TRANSIT", color: "text-cyan-400",    bg: "bg-cyan-500/15",    dot: "bg-cyan-400" },
  customs:      { label: "CUSTOMS",    color: "text-amber-400",   bg: "bg-amber-500/15",   dot: "bg-amber-400" },
  loading:      { label: "LOADING",    color: "text-blue-400",    bg: "bg-blue-500/15",    dot: "bg-blue-400" },
  delivered:    { label: "DELIVERED",  color: "text-emerald-400", bg: "bg-emerald-500/15", dot: "bg-emerald-400" },
  delayed:      { label: "DELAYED",    color: "text-red-400",     bg: "bg-red-500/15",     dot: "bg-red-400" },
};

const welfareConfig = {
  good:     { label: "GOOD",     color: "text-emerald-400", bg: "bg-emerald-500/10" },
  concern:  { label: "CONCERN",  color: "text-amber-400",   bg: "bg-amber-500/10" },
  critical: { label: "CRITICAL", color: "text-red-400",     bg: "bg-red-500/10" },
};

type FilterKey = "all" | "in-transit" | "customs" | "delayed" | "loading";

export default function ShipmentTracker() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const filtered = filter === "all" ? shipments : shipments.filter(s => s.status === filter);
  const activeCount = shipments.filter(s => s.status !== "delivered").length;

  const counts: Record<FilterKey, number> = {
    all: shipments.length,
    "in-transit": shipments.filter(s => s.status === "in-transit").length,
    customs: shipments.filter(s => s.status === "customs").length,
    delayed: shipments.filter(s => s.status === "delayed").length,
    loading: shipments.filter(s => s.status === "loading").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <Truck className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Shipment Tracker</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span className="text-[8px] font-bold tracking-wider text-cyan-400 uppercase">{activeCount} Active</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-[#0f1a2e]">
        {([
          { key: "all" as const, label: "ALL" },
          { key: "in-transit" as const, label: "IN-TRANSIT" },
          { key: "customs" as const, label: "CUSTOMS" },
          { key: "delayed" as const, label: "DELAYED" },
          { key: "loading" as const, label: "LOADING" },
        ]).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-2 py-0.5 text-[8px] font-bold tracking-wider rounded transition-colors",
              filter === f.key ? "bg-[#1a2236] text-white" : "text-slate-600 hover:text-slate-400"
            )}
          >
            {f.label} <span className="text-slate-600">{counts[f.key]}</span>
          </button>
        ))}
      </div>

      {/* Shipment List */}
      <div className="max-h-[320px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {filtered.map(s => {
          const sc = statusConfig[s.status];
          const wc = welfareConfig[s.welfareStatus];
          const progressColor = s.status === "delayed" ? "#ef4444"
            : s.status === "delivered" ? "#22c55e"
            : "#3b82f6";

          return (
            <div key={s.id} className="px-4 py-2.5 hover:bg-[#0a1020] transition-colors">
              {/* Row 1: Shipment ID + Status */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono text-slate-200">{s.shipmentId}</span>
                  <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider", sc.bg, sc.color)}>
                    {sc.label}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500">{s.vessel}</span>
              </div>

              {/* Row 2: Route */}
              <div className="flex items-center gap-1.5 mb-1.5 text-[9px]">
                <span className="text-slate-400">{s.origin}</span>
                <ArrowRight className="h-2.5 w-2.5 text-slate-600" />
                <span className="text-slate-400">{s.destination}</span>
              </div>

              {/* Row 3: Progress bar */}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 h-1.5 bg-[#1a2236] rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", s.status === "in-transit" && "live-dot")}
                    style={{ width: `${s.progress}%`, backgroundColor: progressColor }}
                  />
                </div>
                <span className="text-[8px] font-bold tabular-nums text-slate-400 w-[28px] text-right">{s.progress}%</span>
              </div>

              {/* Row 4: Welfare indicators */}
              <div className="flex items-center gap-3 mb-1 text-[8px]">
                <div className="flex items-center gap-1">
                  <Thermometer className="h-2.5 w-2.5 text-slate-600" />
                  <span className={cn("font-bold tabular-nums", s.temperature > 30 ? "text-red-400" : s.temperature > 28 ? "text-amber-400" : "text-emerald-400")}>
                    {s.temperature}°C
                  </span>
                </div>
                <span className="text-slate-700">|</span>
                <span className="text-slate-500">
                  Mortality: <span className={cn("font-bold tabular-nums", s.mortality > 5 ? "text-red-400" : s.mortality > 0 ? "text-amber-400" : "text-emerald-400")}>{s.mortality}</span>
                </span>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-1">
                  <Heart className="h-2.5 w-2.5 text-slate-600" />
                  <span className={cn("font-bold tracking-wider", wc.color)}>{wc.label}</span>
                </div>
              </div>

              {/* Row 5: Head count + ETA */}
              <div className="flex items-center justify-between text-[8px]">
                <span className="text-slate-600">
                  <span className="font-bold text-slate-400 tabular-nums">{s.headCount.toLocaleString()}</span> head
                </span>
                <span className="text-slate-500">
                  ETA: <span className="font-bold text-slate-400">{s.eta}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
