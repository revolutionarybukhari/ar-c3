import { Activity, Clock, Syringe } from "lucide-react";
import { cn } from "@/lib/utils";

const mockData = {
  status: {
    critical: 3,
    warning: 5,
    healthy: 12,
    noData: 2,
  },
  lastVetCheck: "2d ago",
  vaccinationRate: 87,
  diseaseAlerts: 3,
};

const statusDots = [
  { key: "critical", color: "bg-red-400", label: "Critical" },
  { key: "warning", color: "bg-amber-400", label: "Warning" },
  { key: "healthy", color: "bg-emerald-400", label: "Healthy" },
  { key: "noData", color: "bg-slate-400", label: "No Data" },
] as const;

export default function SupplyHealthSummary() {
  const { status, lastVetCheck, vaccinationRate, diseaseAlerts } = mockData;

  return (
    <div className="flex h-full flex-col justify-between px-3 py-2.5">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <Activity className="h-3 w-3 text-emerald-400" />
        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
          Farm Health Status
        </span>
      </div>

      {/* Status dots row */}
      <div className="flex items-center gap-3">
        {statusDots.map((dot) => (
          <div key={dot.key} className="flex items-center gap-1">
            <div className={cn("h-2.5 w-2.5 rounded-full", dot.color)} />
            <span
              className={cn(
                "text-[11px] font-medium tabular-nums text-slate-200"
              )}
            >
              {status[dot.key]}
            </span>
          </div>
        ))}
      </div>

      {/* Key stats row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Clock className="h-2.5 w-2.5 text-slate-500" />
          <span className="text-[8px] text-slate-500">Last Vet</span>
          <span className="text-[10px] font-medium tabular-nums text-slate-300">
            {lastVetCheck}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Syringe className="h-2.5 w-2.5 text-slate-500" />
          <span className="text-[8px] text-slate-500">Vacc.</span>
          <span className="text-[10px] font-medium tabular-nums text-slate-300">
            {vaccinationRate}%
          </span>
        </div>
      </div>

      {/* Disease alert footer */}
      {diseaseAlerts > 0 && (
        <p className="text-[8px] font-medium text-red-400">
          {diseaseAlerts} disease alert{diseaseAlerts !== 1 ? "s" : ""} active
        </p>
      )}
    </div>
  );
}
