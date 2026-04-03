import { Calendar, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeasonalEvent {
  id: string;
  name: string;
  date: string;
  daysUntil: number;
  region: "IDN" | "GCC" | "ALL";
  demandMultiplier: number;
  category: "religious" | "national" | "commercial";
  readiness: number;
  requiredStock: number;
  currentStock: number;
}

const events: SeasonalEvent[] = [
  { id: "e1", name: "Eid al-Adha 2026", date: "2026-06-16", daysUntil: 73, region: "ALL", demandMultiplier: 2.5, category: "religious", readiness: 62, requiredStock: 185000, currentStock: 114700 },
  { id: "e2", name: "Indonesian Independence Day", date: "2026-08-17", daysUntil: 135, region: "IDN", demandMultiplier: 1.4, category: "national", readiness: 38, requiredStock: 95000, currentStock: 36100 },
  { id: "e3", name: "Hajj Season 2026", date: "2026-06-06", daysUntil: 63, region: "GCC", demandMultiplier: 2.1, category: "religious", readiness: 71, requiredStock: 220000, currentStock: 156200 },
  { id: "e4", name: "Idul Fitri 2027", date: "2027-03-20", daysUntil: 350, region: "IDN", demandMultiplier: 1.8, category: "religious", readiness: 12, requiredStock: 160000, currentStock: 19200 },
  { id: "e5", name: "Christmas / Year-End", date: "2026-12-25", daysUntil: 265, region: "ALL", demandMultiplier: 1.3, category: "commercial", readiness: 20, requiredStock: 110000, currentStock: 22000 },
  { id: "e6", name: "Chinese New Year 2027", date: "2027-02-06", daysUntil: 308, region: "IDN", demandMultiplier: 1.5, category: "commercial", readiness: 8, requiredStock: 120000, currentStock: 9600 },
  { id: "e7", name: "Ramadan 2027 Start", date: "2027-02-18", daysUntil: 320, region: "ALL", demandMultiplier: 1.6, category: "religious", readiness: 5, requiredStock: 140000, currentStock: 7000 },
  { id: "e8", name: "Local Harvest Festival (NTT)", date: "2026-05-10", daysUntil: 36, region: "IDN", demandMultiplier: 1.2, category: "national", readiness: 85, requiredStock: 45000, currentStock: 38250 },
];

const categoryConfig = {
  religious:   { label: "RELIGIOUS",   color: "text-purple-400", bg: "bg-purple-500/15" },
  national:    { label: "NATIONAL",    color: "text-cyan-400",   bg: "bg-cyan-500/15" },
  commercial:  { label: "COMMERCIAL",  color: "text-amber-400",  bg: "bg-amber-500/15" },
};

const regionConfig = {
  IDN: { label: "IDN", color: "text-red-400",    bg: "bg-red-500/10" },
  GCC: { label: "GCC", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ALL: { label: "ALL", color: "text-blue-400",   bg: "bg-blue-500/10" },
};

function countdownColor(days: number): string {
  if (days < 14) return "#ef4444";
  if (days < 30) return "#f59e0b";
  return "#22c55e";
}

function formatCountdown(days: number): string {
  if (days >= 365) {
    const y = Math.floor(days / 365);
    const d = days % 365;
    return `${y}y ${d}d`;
  }
  return `${days}d`;
}

export default function SeasonalCalendar() {
  const sorted = [...events].sort((a, b) => a.daysUntil - b.daysUntil);
  const nextEvent = sorted[0];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-purple-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Seasonal Calendar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-2.5 w-2.5 text-slate-500" />
          <span className="text-[8px] font-bold tracking-wider text-slate-400 uppercase">Next:</span>
          <span className="text-[8px] font-bold tabular-nums" style={{ color: countdownColor(nextEvent.daysUntil) }}>
            {nextEvent.daysUntil}d
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-h-[320px] overflow-y-auto">
        {sorted.map((ev, idx) => {
          const cat = categoryConfig[ev.category];
          const reg = regionConfig[ev.region];
          const stockPct = Math.round((ev.currentStock / ev.requiredStock) * 100);

          return (
            <div key={ev.id} className="relative px-4 py-3 hover:bg-[#0a1020] transition-colors">
              {/* Timeline connector */}
              {idx < sorted.length - 1 && (
                <div className="absolute left-[22px] top-[34px] bottom-0 w-px bg-[#1a2236]" />
              )}

              <div className="flex gap-3">
                {/* Timeline dot */}
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={cn("h-2.5 w-2.5 rounded-full border-2", ev.daysUntil < 30 && "live-dot")}
                    style={{
                      borderColor: countdownColor(ev.daysUntil),
                      backgroundColor: ev.daysUntil < 14 ? countdownColor(ev.daysUntil) : "transparent",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Row 1: Name + badges */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-200 truncate">{ev.name}</span>
                    <span className={cn("px-1 py-px rounded text-[7px] font-bold tracking-wider flex-shrink-0", reg.bg, reg.color)}>
                      {reg.label}
                    </span>
                    <span className={cn("px-1 py-px rounded text-[7px] font-bold tracking-wider flex-shrink-0", cat.bg, cat.color)}>
                      {cat.label}
                    </span>
                  </div>

                  {/* Row 2: Countdown + Date + Multiplier */}
                  <div className="flex items-center gap-3 mb-1.5">
                    <span
                      className="text-[14px] font-black tabular-nums leading-none"
                      style={{ color: countdownColor(ev.daysUntil) }}
                    >
                      {formatCountdown(ev.daysUntil)}
                    </span>
                    <span className="text-[9px] text-slate-500">{ev.date}</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <TrendingUp className="h-2.5 w-2.5 text-amber-400" />
                      <span className="text-[9px] font-bold text-amber-400 tabular-nums">{ev.demandMultiplier}x</span>
                      <span className="text-[8px] text-slate-600">demand</span>
                    </div>
                  </div>

                  {/* Row 3: Readiness bar */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] text-slate-600 w-[52px]">Readiness</span>
                    <div className="flex-1 h-1.5 bg-[#1a2236] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${ev.readiness}%`,
                          backgroundColor: ev.readiness > 70 ? "#22c55e" : ev.readiness > 40 ? "#f59e0b" : "#ef4444",
                        }}
                      />
                    </div>
                    <span className="text-[8px] font-bold tabular-nums text-slate-400 w-[28px] text-right">{ev.readiness}%</span>
                  </div>

                  {/* Row 4: Stock status */}
                  <div className="flex items-center justify-between text-[8px]">
                    <span className="text-slate-500">
                      Stock: <span className="font-bold tabular-nums text-slate-400">{(ev.currentStock / 1000).toFixed(1)}k</span>
                      <span className="text-slate-700"> / </span>
                      <span className="tabular-nums">{(ev.requiredStock / 1000).toFixed(1)}k</span>
                      <span className="text-slate-600"> head</span>
                    </span>
                    <span
                      className="font-bold tabular-nums"
                      style={{ color: stockPct > 70 ? "#22c55e" : stockPct > 40 ? "#f59e0b" : "#ef4444" }}
                    >
                      {stockPct}% stocked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
