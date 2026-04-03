import { useState } from "react";
import { Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface Farm {
  farmId: string;
  farmName: string;
  region: string;
  country: string;
  lastReport: string;
  minutesAgo: number;
  status: "online" | "delayed" | "offline";
  dataCompleteness: number;
  metricsReporting: string[];
  signalStrength: "strong" | "weak" | "none";
}

const farms: Farm[] = [
  { farmId: "F-001", farmName: "Al Rashid Station", region: "Riyadh", country: "SAU", lastReport: "2026-04-04T09:57:00Z", minutesAgo: 3, status: "online", dataCompleteness: 100, metricsReporting: ["health", "inventory", "feed", "weather"], signalStrength: "strong" },
  { farmId: "F-002", farmName: "Sindh Pastoral Hub", region: "Sindh", country: "PAK", lastReport: "2026-04-04T09:55:00Z", minutesAgo: 5, status: "online", dataCompleteness: 98, metricsReporting: ["health", "inventory", "feed", "weather"], signalStrength: "strong" },
  { farmId: "F-003", farmName: "Mbarara Feedlot", region: "Western", country: "UGA", lastReport: "2026-04-04T09:50:00Z", minutesAgo: 10, status: "online", dataCompleteness: 95, metricsReporting: ["health", "inventory", "feed"], signalStrength: "strong" },
  { farmId: "F-004", farmName: "East Java Ranch", region: "E. Java", country: "IDN", lastReport: "2026-04-04T09:48:00Z", minutesAgo: 12, status: "online", dataCompleteness: 92, metricsReporting: ["health", "inventory", "weather"], signalStrength: "strong" },
  { farmId: "F-005", farmName: "Bandung Highlands", region: "W. Java", country: "IDN", lastReport: "2026-04-04T09:40:00Z", minutesAgo: 20, status: "online", dataCompleteness: 88, metricsReporting: ["health", "inventory", "feed", "weather"], signalStrength: "strong" },
  { farmId: "F-006", farmName: "Kampala Central", region: "Central", country: "UGA", lastReport: "2026-04-04T09:30:00Z", minutesAgo: 30, status: "online", dataCompleteness: 85, metricsReporting: ["health", "inventory"], signalStrength: "weak" },
  { farmId: "F-007", farmName: "Jeddah Coast Farm", region: "Makkah", country: "SAU", lastReport: "2026-04-04T09:15:00Z", minutesAgo: 45, status: "online", dataCompleteness: 80, metricsReporting: ["health", "feed", "weather"], signalStrength: "weak" },
  { farmId: "F-008", farmName: "Lahore Dairy Co-op", region: "Punjab", country: "PAK", lastReport: "2026-04-04T08:45:00Z", minutesAgo: 75, status: "delayed", dataCompleteness: 72, metricsReporting: ["health", "inventory"], signalStrength: "weak" },
  { farmId: "F-009", farmName: "Aden Livestock", region: "Aden", country: "YEM", lastReport: "2026-04-04T08:30:00Z", minutesAgo: 90, status: "delayed", dataCompleteness: 65, metricsReporting: ["health", "feed"], signalStrength: "weak" },
  { farmId: "F-010", farmName: "Surabaya Feedworks", region: "E. Java", country: "IDN", lastReport: "2026-04-04T08:00:00Z", minutesAgo: 120, status: "delayed", dataCompleteness: 58, metricsReporting: ["health"], signalStrength: "weak" },
  { farmId: "F-011", farmName: "Mogadishu Pastoral", region: "Banadir", country: "SOM", lastReport: "2026-04-04T06:00:00Z", minutesAgo: 240, status: "delayed", dataCompleteness: 40, metricsReporting: ["inventory"], signalStrength: "none" },
  { farmId: "F-012", farmName: "Sana'a Highland", region: "Sana'a", country: "YEM", lastReport: "2026-04-03T22:00:00Z", minutesAgo: 720, status: "offline", dataCompleteness: 15, metricsReporting: [], signalStrength: "none" },
  { farmId: "F-013", farmName: "Djibouti Transit", region: "Djibouti", country: "DJI", lastReport: "2026-04-03T18:00:00Z", minutesAgo: 960, status: "offline", dataCompleteness: 8, metricsReporting: [], signalStrength: "none" },
  { farmId: "F-014", farmName: "Berbera Port Farm", region: "Sahil", country: "SOM", lastReport: "2026-04-03T12:00:00Z", minutesAgo: 1320, status: "offline", dataCompleteness: 0, metricsReporting: [], signalStrength: "none" },
  { farmId: "F-015", farmName: "Ta'izz Valley", region: "Ta'izz", country: "YEM", lastReport: "2026-04-02T08:00:00Z", minutesAgo: 3000, status: "offline", dataCompleteness: 0, metricsReporting: [], signalStrength: "none" },
];

const statusConfig = {
  online: { dot: "bg-emerald-400", text: "text-emerald-400" },
  delayed: { dot: "bg-amber-400", text: "text-amber-400" },
  offline: { dot: "bg-red-400", text: "text-red-400" },
};

function formatTimeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

function SignalBars({ strength }: { strength: "strong" | "weak" | "none" }) {
  const bars = strength === "strong" ? 3 : strength === "weak" ? 2 : 0;
  return (
    <div className="flex items-end gap-px">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className={cn(
            "rounded-sm",
            i === 1 ? "w-[3px] h-[6px]" : i === 2 ? "w-[3px] h-[9px]" : "w-[3px] h-[12px]",
            i <= bars ? "bg-emerald-400" : "bg-slate-700"
          )}
        />
      ))}
    </div>
  );
}

export default function DataFreshnessMonitor() {
  const sorted = [...farms].sort((a, b) => b.minutesAgo - a.minutesAgo);
  const onlineCount = farms.filter(f => f.status === "online").length;
  const delayedCount = farms.filter(f => f.status === "delayed").length;
  const offlineCount = farms.filter(f => f.status === "offline").length;
  const [filter, setFilter] = useState<"all" | "online" | "delayed" | "offline">("all");
  const filtered = filter === "all" ? sorted : sorted.filter(f => f.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <Wifi className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Data Freshness Monitor</span>
        </div>
        <div className="flex items-center gap-3 text-[8px] font-bold tracking-wider">
          <span className="flex items-center gap-1">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-400">{onlineCount}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-amber-400">{delayedCount}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            <span className="text-red-400">{offlineCount}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 px-4 py-2 border-b border-[#0f1a2e]">
        {([
          { key: "all" as const, label: "ALL", count: farms.length },
          { key: "online" as const, label: "ONLINE", count: onlineCount },
          { key: "delayed" as const, label: "DELAYED", count: delayedCount },
          { key: "offline" as const, label: "OFFLINE", count: offlineCount },
        ]).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-2 py-0.5 text-[8px] font-bold tracking-wider rounded transition-colors",
              filter === f.key ? "bg-[#1a2236] text-white" : "text-slate-600 hover:text-slate-400"
            )}
          >
            {f.label} <span className="text-slate-600">{f.count}</span>
          </button>
        ))}
      </div>

      <div className="max-h-[360px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {filtered.map(farm => {
          const sc = statusConfig[farm.status];
          return (
            <div key={farm.farmId} className="px-4 py-2 hover:bg-[#0a1020] transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", sc.dot, farm.status === "online" && "live-dot")} />
                <span className="text-[10px] font-bold text-slate-200 truncate">{farm.farmName}</span>
                <span className="text-[8px] text-slate-600 font-mono">{farm.region}, {farm.country}</span>
                <span className={cn("ml-auto text-[9px] font-mono tabular-nums", sc.text)}>{formatTimeAgo(farm.minutesAgo)}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className="flex-1 h-1 rounded-full bg-[#0f1a2e] overflow-hidden max-w-[80px]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        farm.dataCompleteness >= 80 ? "bg-emerald-500" : farm.dataCompleteness >= 50 ? "bg-amber-500" : "bg-red-500"
                      )}
                      style={{ width: `${farm.dataCompleteness}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-600 font-mono tabular-nums">{farm.dataCompleteness}%</span>
                </div>

                <SignalBars strength={farm.signalStrength} />

                <div className="flex items-center gap-0.5">
                  {farm.metricsReporting.length > 0 ? (
                    farm.metricsReporting.map(m => (
                      <span key={m} className="px-1 py-px rounded bg-[#0f1a2e] text-[7px] font-bold tracking-wider text-slate-500 uppercase">
                        {m.slice(0, 3)}
                      </span>
                    ))
                  ) : (
                    <span className="text-[7px] text-slate-700">NO DATA</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
