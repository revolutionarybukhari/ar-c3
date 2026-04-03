import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: "supply" | "logistics" | "health" | "pricing" | "compliance" | "emergency";
  priority: "critical" | "high" | "normal";
  status: "completed" | "in-progress" | "pending";
  impact: string;
  relatedEntity: string;
}

const logEntries: LogEntry[] = [
  { id: "A-001", timestamp: "2026-04-04T09:52:00Z", actor: "Dr. Amina Yusuf", action: "Initiated emergency quarantine protocol for East Java FMD cluster. Sealed 15km perimeter, redirected 3 inbound shipments.", category: "emergency", priority: "critical", status: "in-progress", impact: "4,500 head isolated; 3 supply routes rerouted through Surabaya bypass", relatedEntity: "East Java Ranch" },
  { id: "A-002", timestamp: "2026-04-04T09:30:00Z", actor: "SYSTEM — AutoPricer", action: "Adjusted forward contract pricing for Q3 goat SKU. Increased spot price 4.2% based on supply deficit signal.", category: "pricing", priority: "high", status: "completed", impact: "Revenue uplift est. $38K across 12 active contracts", relatedEntity: "Jeddah Coast Farm" },
  { id: "A-003", timestamp: "2026-04-04T09:15:00Z", actor: "Khalid Al-Mansour", action: "Approved emergency feed procurement — 40 tonnes soybean meal diverted from Djibouti reserve to Aden Livestock.", category: "supply", priority: "critical", status: "completed", impact: "Feed gap closed for 2,200 head; 12-day runway secured", relatedEntity: "Aden Livestock" },
  { id: "A-004", timestamp: "2026-04-04T08:45:00Z", actor: "SYSTEM — RouteOptimizer", action: "Rerouted vessel MV Baraka from Berbera to Aden port due to congestion forecast. ETA adjusted +18h.", category: "logistics", priority: "high", status: "in-progress", impact: "Avoids 3-day port queue; saves $12K demurrage", relatedEntity: "Berbera–Aden Route" },
  { id: "A-005", timestamp: "2026-04-04T08:00:00Z", actor: "Dr. Fatima Reza", action: "Completed batch vaccination — PPR booster administered to 3,200 head at Sindh Pastoral Hub.", category: "health", priority: "high", status: "completed", impact: "Herd immunity coverage raised to 94% in Sindh region", relatedEntity: "Sindh Pastoral Hub" },
  { id: "A-006", timestamp: "2026-04-04T07:30:00Z", actor: "Omar Hassan", action: "Filed updated GSMA export compliance docs for Uganda cattle shipment. Certificate validity extended 14 days.", category: "compliance", priority: "normal", status: "completed", impact: "Shipment UGA-2841 cleared for departure on schedule", relatedEntity: "Mbarara Feedlot" },
  { id: "A-007", timestamp: "2026-04-04T06:00:00Z", actor: "SYSTEM — AlertEngine", action: "Triggered connectivity alert for Sana'a Highland — no telemetry received in 12h. Escalated to regional ops.", category: "emergency", priority: "critical", status: "pending", impact: "Potential data blackout affecting 1,800 head monitoring", relatedEntity: "Sana'a Highland" },
  { id: "A-008", timestamp: "2026-04-04T05:30:00Z", actor: "Rashid Osman", action: "Negotiated spot charter for 800 head cattle transport Kampala → Mombasa. Rate locked at $14.2/head.", category: "logistics", priority: "normal", status: "completed", impact: "Cost saving $2.1K vs. previous carrier quote", relatedEntity: "Kampala Central" },
  { id: "A-009", timestamp: "2026-04-03T22:00:00Z", actor: "Dr. Amina Yusuf", action: "Reviewed mortality spike report for Mogadishu Pastoral. Root cause: water contamination from recent flooding.", category: "health", priority: "high", status: "in-progress", impact: "Mortality rate 3.8% → corrective water treatment deployed", relatedEntity: "Mogadishu Pastoral" },
  { id: "A-010", timestamp: "2026-04-03T18:00:00Z", actor: "SYSTEM — DemandForecaster", action: "Updated Eid al-Adha demand model with satellite market data. Revised sheep demand +8% for GCC region.", category: "supply", priority: "normal", status: "completed", impact: "Procurement targets adjusted; 6,400 additional head earmarked", relatedEntity: "Al Rashid Station" },
  { id: "A-011", timestamp: "2026-04-03T14:00:00Z", actor: "Khalid Al-Mansour", action: "Suspended exports from Ta'izz Valley pending security clearance update. Diverted allocation to Aden.", category: "compliance", priority: "high", status: "completed", impact: "Zero disruption to delivery schedule; Aden absorbs 100% of volume", relatedEntity: "Ta'izz Valley" },
  { id: "A-012", timestamp: "2026-04-03T10:00:00Z", actor: "Layla Farah", action: "Completed quarterly weight audit across Bandung Highlands cohorts. All batches within 2% of target curve.", category: "supply", priority: "normal", status: "completed", impact: "98% of cohorts on track for June market window", relatedEntity: "Bandung Highlands" },
];

const categoryConfig = {
  supply: { label: "SUPPLY", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  logistics: { label: "LOGISTICS", color: "text-blue-400", bg: "bg-blue-500/10" },
  health: { label: "HEALTH", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  pricing: { label: "PRICING", color: "text-amber-400", bg: "bg-amber-500/10" },
  compliance: { label: "COMPLIANCE", color: "text-purple-400", bg: "bg-purple-500/10" },
  emergency: { label: "EMERGENCY", color: "text-red-400", bg: "bg-red-500/10" },
};

const priorityConfig = {
  critical: { label: "CRIT", color: "text-red-400", bg: "bg-red-500/15" },
  high: { label: "HIGH", color: "text-amber-400", bg: "bg-amber-500/15" },
  normal: { label: "NORM", color: "text-slate-400", bg: "bg-slate-500/10" },
};

const statusStyle = {
  completed: { label: "DONE", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  "in-progress": { label: "IN PROG", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  pending: { label: "PENDING", color: "text-amber-400", bg: "bg-amber-500/10" },
};

type CategoryKey = LogEntry["category"];

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const mon = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  return `${mon} ${d.getUTCDate()} ${hh}:${mm}`;
}

export default function ActionLog() {
  const [filter, setFilter] = useState<"all" | CategoryKey>("all");
  const filtered = filter === "all" ? logEntries : logEntries.filter(e => e.category === filter);

  const categories: { key: "all" | CategoryKey; label: string; count: number }[] = [
    { key: "all", label: "ALL", count: logEntries.length },
    ...Object.entries(categoryConfig).map(([key, cfg]) => ({
      key: key as CategoryKey,
      label: cfg.label,
      count: logEntries.filter(e => e.category === key).length,
    })),
  ];

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-3.5 w-3.5 text-purple-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Action Log</span>
        </div>
        <span className="text-[8px] font-bold tracking-wider text-slate-500">{logEntries.length} ENTRIES</span>
      </div>

      <div className="flex items-center gap-1 px-4 py-2 border-b border-[#0f1a2e] flex-wrap">
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={cn(
              "px-2 py-0.5 text-[8px] font-bold tracking-wider rounded transition-colors",
              filter === c.key ? "bg-[#1a2236] text-white" : "text-slate-600 hover:text-slate-400"
            )}
          >
            {c.label} <span className="text-slate-600">{c.count}</span>
          </button>
        ))}
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {filtered.map(entry => {
          const cat = categoryConfig[entry.category];
          const pri = priorityConfig[entry.priority];
          const sts = statusStyle[entry.status];
          return (
            <div key={entry.id} className="px-4 py-2.5 hover:bg-[#0a1020] transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[8px] font-mono text-slate-600 tabular-nums">{formatTimestamp(entry.timestamp)}</span>
                <span className="text-[9px] font-bold text-slate-300">{entry.actor}</span>
                <div className="flex items-center gap-1 ml-auto">
                  <span className={cn("px-1 py-px rounded text-[7px] font-bold tracking-wider", cat.bg, cat.color)}>{cat.label}</span>
                  <span className={cn("px-1 py-px rounded text-[7px] font-bold tracking-wider", pri.bg, pri.color)}>{pri.label}</span>
                </div>
              </div>

              <p className="text-[9px] text-slate-400 leading-relaxed mb-1">{entry.action}</p>

              <div className="flex items-center gap-2">
                <span className={cn("px-1 py-px rounded text-[7px] font-bold tracking-wider", sts.bg, sts.color)}>{sts.label}</span>
                <span className="text-[8px] text-slate-600 flex-1 truncate">{entry.impact}</span>
                <span className="text-[8px] font-mono text-cyan-600 shrink-0">{entry.relatedEntity}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
