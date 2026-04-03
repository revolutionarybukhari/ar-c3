import { useState } from "react";
import { Bug, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Outbreak {
  id: string;
  disease: string;
  severity: "alert" | "warning" | "watch";
  location: string;
  country: string;
  countryCode: string;
  date: string;
  farmsAffected: number;
  animalsAtRisk: number;
  containment: "contained" | "spreading" | "monitoring";
  summary: string;
}

const outbreaks: Outbreak[] = [
  { id: "d1", disease: "Foot-and-Mouth Disease (FMD)", severity: "alert", location: "East Java", country: "Indonesia", countryCode: "IDN", date: "2026-04-03", farmsAffected: 3, animalsAtRisk: 4500, containment: "spreading", summary: "Active FMD cluster detected across 3 farms in Malang district. Quarantine perimeter established 15km radius. Movement restrictions in effect." },
  { id: "d2", disease: "Peste des Petits Ruminants (PPR)", severity: "alert", location: "Sindh Province", country: "Pakistan", countryCode: "PAK", date: "2026-04-01", farmsAffected: 7, animalsAtRisk: 12000, containment: "spreading", summary: "PPR outbreak in flood-affected areas. Compounded by displacement of livestock. Emergency vaccination campaign initiated." },
  { id: "d3", disease: "Rift Valley Fever (RVF)", severity: "warning", location: "Mbarara", country: "Uganda", countryCode: "UGA", date: "2026-03-28", farmsAffected: 2, animalsAtRisk: 800, containment: "contained", summary: "RVF cases confirmed in 2 cattle farms. Vector control measures deployed. Export certification temporarily suspended." },
  { id: "d4", disease: "Brucellosis", severity: "watch", location: "West Java", country: "Indonesia", countryCode: "IDN", date: "2026-03-25", farmsAffected: 1, animalsAtRisk: 200, containment: "monitoring", summary: "Single brucellosis case detected during routine screening at Bandung Hub. Test-and-cull protocol initiated. Adjacent farms under surveillance." },
  { id: "d5", disease: "Lumpy Skin Disease (LSD)", severity: "warning", location: "Aden", country: "Yemen", countryCode: "YEM", date: "2026-03-22", farmsAffected: 4, animalsAtRisk: 1500, containment: "contained", summary: "LSD cluster stabilized following emergency vaccination of 5000 head. Export from affected zone suspended 30 days." },
  { id: "d6", disease: "Anthrax", severity: "watch", location: "Kampala District", country: "Uganda", countryCode: "UGA", date: "2026-03-20", farmsAffected: 1, animalsAtRisk: 350, containment: "contained", summary: "Isolated anthrax case in grazing cattle. Area decontamination complete. Annual vaccination schedule being accelerated." },
];

const severityConfig = {
  alert: { label: "ALERT", color: "text-red-400", bg: "bg-red-500/15", border: "border-l-red-500" },
  warning: { label: "WARNING", color: "text-amber-400", bg: "bg-amber-500/15", border: "border-l-amber-500" },
  watch: { label: "WATCH", color: "text-blue-400", bg: "bg-blue-500/15", border: "border-l-blue-500" },
};

const containmentConfig = {
  spreading: { label: "SPREADING", color: "text-red-400", bg: "bg-red-500/10" },
  contained: { label: "CONTAINED", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  monitoring: { label: "MONITORING", color: "text-blue-400", bg: "bg-blue-500/10" },
};

export default function DiseaseOutbreakMonitor() {
  const [filter, setFilter] = useState<"all" | "alert" | "warning" | "watch">("all");
  const filtered = filter === "all" ? outbreaks : outbreaks.filter(o => o.severity === filter);
  const alertCount = outbreaks.filter(o => o.severity === "alert").length;
  const warningCount = outbreaks.filter(o => o.severity === "warning").length;
  const watchCount = outbreaks.filter(o => o.severity === "watch").length;

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <Bug className="h-3.5 w-3.5 text-red-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Disease Outbreak Monitor</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-400" />
          <span className="text-[8px] font-bold tracking-wider text-red-400 uppercase">{outbreaks.length} Active</span>
        </div>
      </div>

      <div className="flex items-center gap-1 px-4 py-2 border-b border-[#0f1a2e]">
        {([
          { key: "all" as const, label: "ALL", count: outbreaks.length },
          { key: "alert" as const, label: "ALERT", count: alertCount },
          { key: "warning" as const, label: "WARNING", count: warningCount },
          { key: "watch" as const, label: "WATCH", count: watchCount },
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

      <div className="max-h-[320px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {filtered.map(ob => {
          const sev = severityConfig[ob.severity];
          const cont = containmentConfig[ob.containment];
          return (
            <div key={ob.id} className={cn("px-4 py-2.5 hover:bg-[#0a1020] transition-colors border-l-2", sev.border)}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-200">{ob.disease}</span>
                <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider", sev.bg, sev.color)}>
                  {sev.label}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1 text-[9px]">
                <MapPin className="h-2.5 w-2.5 text-slate-600" />
                <span className="text-slate-400">{ob.location}, {ob.country}</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-500">{ob.date}</span>
                <span className={cn("px-1 py-px rounded text-[7px] font-bold tracking-wider ml-auto", cont.bg, cont.color)}>
                  {cont.label}
                </span>
              </div>
              <p className="text-[9px] text-slate-500 leading-relaxed mb-1.5">{ob.summary}</p>
              <div className="flex gap-4 text-[8px]">
                <span className="text-slate-600">{ob.farmsAffected} farms affected</span>
                <span className="text-slate-600">{ob.animalsAtRisk.toLocaleString()} animals at risk</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
