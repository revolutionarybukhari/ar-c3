import { Droplets, RefreshCw, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Farm {
  farmId: string;
  farmName: string;
  region: string;
  feedType: "corn-based" | "hay" | "mixed pellet";
  feedDaysLeft: number;
  feedLevel: number;
  feedDailyUsage: number;
  waterDaysLeft: number;
  waterLevel: number;
  waterDailyUsage: number;
  reorderPoint: number;
  autoReorder: boolean;
  lastDelivery: string;
  nextDelivery: string | null;
  status: "adequate" | "low" | "critical" | "reorder-placed";
}

const farms: Farm[] = [
  { farmId: "F-001", farmName: "Bandung Central Hub", region: "West Java", feedType: "mixed pellet", feedDaysLeft: 2, feedLevel: 12, feedDailyUsage: 3.2, waterDaysLeft: 1, waterLevel: 8, waterDailyUsage: 18.5, reorderPoint: 5, autoReorder: true, lastDelivery: "2026-03-28", nextDelivery: null, status: "critical" },
  { farmId: "F-002", farmName: "Malang Fattening Yard", region: "East Java", feedType: "corn-based", feedDaysLeft: 3, feedLevel: 18, feedDailyUsage: 4.1, waterDaysLeft: 4, waterLevel: 22, waterDailyUsage: 24.0, reorderPoint: 5, autoReorder: true, lastDelivery: "2026-03-30", nextDelivery: "2026-04-05", status: "reorder-placed" },
  { farmId: "F-003", farmName: "Sindh Aggregation Point", region: "Pakistan", feedType: "hay", feedDaysLeft: 4, feedLevel: 28, feedDailyUsage: 2.8, waterDaysLeft: 3, waterLevel: 19, waterDailyUsage: 15.0, reorderPoint: 5, autoReorder: false, lastDelivery: "2026-03-25", nextDelivery: null, status: "low" },
  { farmId: "F-004", farmName: "Surabaya Transit Pen", region: "East Java", feedType: "mixed pellet", feedDaysLeft: 5, feedLevel: 35, feedDailyUsage: 2.5, waterDaysLeft: 6, waterLevel: 40, waterDailyUsage: 12.0, reorderPoint: 5, autoReorder: true, lastDelivery: "2026-04-01", nextDelivery: null, status: "low" },
  { farmId: "F-005", farmName: "Lahore Mandi Depot", region: "Pakistan", feedType: "hay", feedDaysLeft: 8, feedLevel: 55, feedDailyUsage: 1.9, waterDaysLeft: 10, waterLevel: 62, waterDailyUsage: 9.5, reorderPoint: 5, autoReorder: true, lastDelivery: "2026-04-02", nextDelivery: null, status: "adequate" },
  { farmId: "F-006", farmName: "Jeddah Receiving Yard", region: "GCC", feedType: "mixed pellet", feedDaysLeft: 12, feedLevel: 72, feedDailyUsage: 3.0, waterDaysLeft: 9, waterLevel: 58, waterDailyUsage: 20.0, reorderPoint: 5, autoReorder: true, lastDelivery: "2026-04-03", nextDelivery: null, status: "adequate" },
  { farmId: "F-007", farmName: "Semarang Feedlot A", region: "Central Java", feedType: "corn-based", feedDaysLeft: 1, feedLevel: 6, feedDailyUsage: 5.0, waterDaysLeft: 2, waterLevel: 11, waterDailyUsage: 28.0, reorderPoint: 5, autoReorder: false, lastDelivery: "2026-03-20", nextDelivery: null, status: "critical" },
  { farmId: "F-008", farmName: "Dammam Quarantine", region: "GCC", feedType: "mixed pellet", feedDaysLeft: 15, feedLevel: 80, feedDailyUsage: 2.2, waterDaysLeft: 14, waterLevel: 78, waterDailyUsage: 11.0, reorderPoint: 5, autoReorder: true, lastDelivery: "2026-04-03", nextDelivery: null, status: "adequate" },
  { farmId: "F-009", farmName: "Queensland Export Yard", region: "Australia", feedType: "hay", feedDaysLeft: 6, feedLevel: 42, feedDailyUsage: 3.5, waterDaysLeft: 5, waterLevel: 33, waterDailyUsage: 22.0, reorderPoint: 7, autoReorder: true, lastDelivery: "2026-03-31", nextDelivery: "2026-04-06", status: "reorder-placed" },
  { farmId: "F-010", farmName: "Bekasi Holding Pen", region: "West Java", feedType: "corn-based", feedDaysLeft: 7, feedLevel: 48, feedDailyUsage: 2.0, waterDaysLeft: 8, waterLevel: 50, waterDailyUsage: 10.0, reorderPoint: 5, autoReorder: true, lastDelivery: "2026-04-01", nextDelivery: null, status: "adequate" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  adequate: { label: "ADEQUATE", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  low: { label: "LOW", color: "text-amber-400", bg: "bg-amber-500/10" },
  critical: { label: "CRITICAL", color: "text-red-400", bg: "bg-red-500/10" },
  "reorder-placed": { label: "REORDER PLACED", color: "text-sky-400", bg: "bg-sky-500/10" },
};

function daysColor(days: number): string {
  if (days <= 2) return "text-red-400";
  if (days <= 5) return "text-amber-400";
  return "text-emerald-400";
}

function levelBarColor(pct: number): string {
  if (pct <= 15) return "bg-red-500";
  if (pct <= 35) return "bg-amber-500";
  return "bg-emerald-500";
}

const sorted = [...farms].sort((a, b) => Math.min(a.feedDaysLeft, a.waterDaysLeft) - Math.min(b.feedDaysLeft, b.waterDaysLeft));

export default function FeedWaterInventory(): ReactNode {
  const adequate = farms.filter(f => f.status === "adequate").length;
  const low = farms.filter(f => f.status === "low").length;
  const critical = farms.filter(f => f.status === "critical" || f.status === "reorder-placed").length;

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <Droplets className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Feed & Water Inventory</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span className="text-[8px] font-bold tracking-wider text-cyan-400 uppercase">{farms.length} Farms</span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 border-b border-[#0f1a2e] text-[8px]">
        <span className="text-emerald-400 font-bold">{adequate} Adequate</span>
        <span className="text-slate-700">|</span>
        <span className="text-amber-400 font-bold">{low} Low</span>
        <span className="text-slate-700">|</span>
        <span className="text-red-400 font-bold">{critical} Critical / Reorder</span>
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {sorted.map(farm => {
          const st = statusConfig[farm.status];

          return (
            <div key={farm.farmId} className="px-4 py-2.5 hover:bg-[#0a1020] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-200">{farm.farmName}</span>
                  <span className="text-[7px] text-slate-600 font-mono">{farm.farmId}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-500/10 text-[7px] font-bold tracking-wider text-slate-500">
                    {farm.region}
                  </span>
                </div>
                <span className={cn("px-1.5 py-0.5 rounded text-[7px] font-bold tracking-wider", st.bg, st.color)}>
                  {st.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-2">
                {/* Feed */}
                <div className="bg-[#060a12] rounded px-2.5 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[7px] font-bold tracking-wider text-slate-600 uppercase">Feed</span>
                    <span className="text-[7px] text-slate-600 uppercase">{farm.feedType}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1.5">
                    <span className={cn("text-lg font-bold font-mono leading-none", daysColor(farm.feedDaysLeft))}>
                      {farm.feedDaysLeft}
                    </span>
                    <span className="text-[8px] text-slate-600">days left</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0f1a2e] rounded-full overflow-hidden mb-1">
                    <div
                      className={cn("h-full rounded-full transition-all", levelBarColor(farm.feedLevel))}
                      style={{ width: `${farm.feedLevel}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[7px] text-slate-600">
                    <span>{farm.feedLevel}% full</span>
                    <span>{farm.feedDailyUsage} t/day</span>
                  </div>
                </div>

                {/* Water */}
                <div className="bg-[#060a12] rounded px-2.5 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[7px] font-bold tracking-wider text-slate-600 uppercase">Water</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1.5">
                    <span className={cn("text-lg font-bold font-mono leading-none", daysColor(farm.waterDaysLeft))}>
                      {farm.waterDaysLeft}
                    </span>
                    <span className="text-[8px] text-slate-600">days left</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0f1a2e] rounded-full overflow-hidden mb-1">
                    <div
                      className={cn("h-full rounded-full transition-all", levelBarColor(farm.waterLevel))}
                      style={{ width: `${farm.waterLevel}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[7px] text-slate-600">
                    <span>{farm.waterLevel}% full</span>
                    <span>{farm.waterDailyUsage} m&sup3;/day</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[8px]">
                <div className="flex items-center gap-3">
                  <span className="text-slate-600">Last delivery: <span className="text-slate-400">{farm.lastDelivery}</span></span>
                  {farm.nextDelivery ? (
                    <span className="flex items-center gap-1 text-sky-400">
                      <Truck className="h-2.5 w-2.5" />
                      Next: {farm.nextDelivery}
                    </span>
                  ) : farm.status === "critical" || farm.status === "low" ? (
                    <span className="text-red-400 font-bold tracking-wider animate-pulse">REORDER NEEDED</span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1">
                  <RefreshCw className={cn("h-2.5 w-2.5", farm.autoReorder ? "text-emerald-400" : "text-slate-700")} />
                  <span className={cn("text-[7px] font-bold", farm.autoReorder ? "text-emerald-400" : "text-slate-700")}>
                    {farm.autoReorder ? "AUTO" : "MANUAL"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
