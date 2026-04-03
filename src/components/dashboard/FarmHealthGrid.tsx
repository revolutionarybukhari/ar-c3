import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Wheat,
  Syringe,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import type { Farm, HealthStatus } from "@/types";
import { cn } from "@/lib/utils";

const healthConfig: Record<HealthStatus, {
  dot: string;
  label: string;
  gradient: string;
  text: string;
}> = {
  green: {
    dot: "bg-emerald-400",
    label: "Healthy",
    gradient: "from-emerald-500 via-emerald-400 to-emerald-600",
    text: "text-emerald-400",
  },
  amber: {
    dot: "bg-amber-400",
    label: "At Risk",
    gradient: "from-amber-500 via-amber-400 to-amber-600",
    text: "text-amber-400",
  },
  red: {
    dot: "bg-red-400",
    label: "Critical",
    gradient: "from-red-500 via-red-400 to-red-600",
    text: "text-red-400",
  },
};

const skuColors: Record<string, string> = {
  sheep: "bg-blue-500/15 text-blue-400",
  goat: "bg-violet-500/15 text-violet-400",
  cattle: "bg-amber-500/15 text-amber-400",
};

interface FarmHealthGridProps {
  farms: Farm[];
  onSelectFarm: (farm: Farm) => void;
}

function FarmCard({ farm, onSelect }: { farm: Farm; onSelect: () => void }) {
  const health = healthConfig[farm.health];
  const d = farm.drivers;

  return (
    <div
      className="cursor-pointer bg-[#0f1629] rounded-xl border border-[#1e293b]/50 overflow-hidden transition-colors duration-200 hover:border-[#2a3a55]"
      onClick={onSelect}
    >
      {/* Top color bar */}
      <div className={cn("h-[2px] w-full bg-gradient-to-r", health.gradient)} />

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white leading-tight">
              {farm.name}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {farm.province}, {farm.country}
            </p>
          </div>
          <span className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
            skuColors[farm.sku] ?? "bg-slate-500/15 text-slate-400"
          )}>
            {farm.sku}
          </span>
        </div>

        {/* Health status */}
        <div className="flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full", health.dot)} />
          <span className={cn("text-xs font-medium", health.text)}>
            {health.label}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex gap-4">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">Capacity</span>
            <p className="text-sm font-bold text-white">{farm.capacityPerDay.toLocaleString()}<span className="text-[10px] text-slate-500 font-normal">/day</span></p>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">On-Time</span>
            <p className="text-sm font-bold text-white">{farm.onTimePct}<span className="text-[10px] text-slate-500 font-normal">%</span></p>
          </div>
        </div>

        {/* Health drivers */}
        <div className="border-t border-[#1e293b]/50 pt-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Health Drivers
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <DriverRow
              icon={<Activity className="h-3 w-3" />}
              label="Mortality"
              value={`${d.mortalityRate}%`}
              warn={d.mortalityRate > 5}
            />
            <DriverRow
              icon={<AlertTriangle className="h-3 w-3" />}
              label="Disease"
              value={`${d.diseaseAlerts} alerts`}
              warn={d.diseaseAlerts > 0}
            />
            <DriverRow
              icon={<Wheat className="h-3 w-3" />}
              label="Feed"
              value={`${d.feedDaysLeft}d left`}
              warn={d.feedDaysLeft < 7}
            />
            <DriverRow
              icon={<Syringe className="h-3 w-3" />}
              label="Vaccine"
              value={`${d.vaccineDaysLeft}d left`}
              warn={d.vaccineDaysLeft < 7}
            />
            <DriverRow
              icon={<Stethoscope className="h-3 w-3" />}
              label="Vet Check"
              value={d.lastVetCheck}
              warn={false}
            />
            <DriverRow
              icon={<ShieldCheck className="h-3 w-3" />}
              label="Vaccination"
              value={d.vaccinationStatus}
              warn={d.vaccinationStatus === "overdue"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DriverRow({
  icon,
  label,
  value,
  warn,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  warn: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={warn ? "text-red-400" : "text-slate-500"}>
        {icon}
      </span>
      <span className="text-slate-500 shrink-0">{label}:</span>
      <span className={cn("font-medium truncate", warn ? "text-red-400" : "text-slate-300")}>
        {value}
      </span>
    </div>
  );
}

const tabs: { key: HealthStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "red", label: "Critical" },
  { key: "amber", label: "At Risk" },
  { key: "green", label: "Healthy" },
];

export default function FarmHealthGrid({ farms, onSelectFarm }: FarmHealthGridProps) {
  const [filter, setFilter] = useState<HealthStatus | "all">("all");

  const filtered = filter === "all" ? farms : farms.filter((f) => f.health === filter);

  return (
    <section aria-label="Farm Health Grid" className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Farm Health Monitor
        </h2>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const count =
              tab.key === "all" ? farms.length : farms.filter((f) => f.health === tab.key).length;
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded transition-colors",
                  active
                    ? "bg-[#1e293b]/60 text-white"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {tab.key !== "all" && (
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      healthConfig[tab.key as HealthStatus].dot
                    )}
                  />
                )}
                {tab.label}
                <span className="text-[10px] text-slate-600">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((farm) => (
          <FarmCard key={farm.id} farm={farm} onSelect={() => onSelectFarm(farm)} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-16 text-center text-sm text-slate-500">
            No farms match this filter.
          </p>
        )}
      </div>
    </section>
  );
}
