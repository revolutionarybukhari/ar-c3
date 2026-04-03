import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  category: string;
  title: string;
  time: string;
  icon: "disease" | "supply" | "price" | "logistics" | "security" | "feed";
}

const alerts: Alert[] = [
  { id: "a1", type: "critical", category: "DISEASE", title: "FMD suspected — East Java cluster, 3 farms quarantined", time: "2m ago", icon: "disease" },
  { id: "a2", type: "critical", category: "SUPPLY", title: "Pakistan flood: Sindh corridor -40% capacity", time: "15m ago", icon: "supply" },
  { id: "a3", type: "warning", category: "PRICE", title: "Sheep price spike +18% in Jakarta wholesale", time: "1h ago", icon: "price" },
  { id: "a4", type: "warning", category: "LOGISTICS", title: "Port Tanjung Priok congestion — 48h delay", time: "2h ago", icon: "logistics" },
  { id: "a5", type: "info", category: "SECURITY", title: "Yemen-Singapore route sanctions review", time: "3h ago", icon: "security" },
  { id: "a6", type: "warning", category: "FEED", title: "Corn futures +12% — feed cost pressure building", time: "4h ago", icon: "feed" },
  { id: "a7", type: "critical", category: "DISEASE", title: "Vaccination overdue — Mbarara Ankole Ranch", time: "5h ago", icon: "disease" },
  { id: "a8", type: "info", category: "SUPPLY", title: "Uganda export permit renewal due in 14 days", time: "6h ago", icon: "supply" },
];

const typeColors = {
  critical: { badge: "bg-red-500/15 text-red-400", dot: "bg-red-400" },
  warning: { badge: "bg-amber-500/15 text-amber-400", dot: "bg-amber-400" },
  info: { badge: "bg-blue-500/15 text-blue-400", dot: "bg-blue-400" },
};

export default function AlertsFeed() {
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  const filtered = filter === "all" ? alerts : alerts.filter(a => a.type === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-3 w-3 text-red-400" />
          <span className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase">Intelligence</span>
          <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/15 text-red-400">{alerts.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="live-dot h-1 w-1 rounded-full bg-emerald-400" />
          <span className="text-[8px] font-bold tracking-wider text-emerald-400 uppercase">Live</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0.5 px-3 py-1.5 border-b border-[#0f1a2e]">
        {(["all", "critical", "warning", "info"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase rounded transition-colors",
              filter === f ? "bg-[#1a2236] text-white" : "text-slate-600 hover:text-slate-400"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alert items */}
      <div className="max-h-[300px] overflow-y-auto">
        {filtered.map(alert => {
          const colors = typeColors[alert.type];
          return (
            <div key={alert.id} className="px-3 py-2 border-b border-[#0a1020] hover:bg-[#0a1020] transition-colors cursor-pointer">
              <div className="flex items-start gap-2">
                <span className={cn("mt-0.5 h-1.5 w-1.5 rounded-full shrink-0", colors.dot, alert.type === "critical" && "live-dot")} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={cn("px-1 py-px rounded text-[8px] font-bold tracking-wider", colors.badge)}>
                      {alert.category}
                    </span>
                    <span className="text-[9px] text-slate-700">{alert.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{alert.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
