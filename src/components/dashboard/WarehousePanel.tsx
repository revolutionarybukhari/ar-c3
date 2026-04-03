"use client";

import { useMemo } from "react";
import type { Warehouse, HealthStatus } from "@/types";
import { warehouses } from "@/data/mockData";

const healthDot: Record<HealthStatus, string> = {
  red: "bg-red-400",
  amber: "bg-amber-400",
  green: "bg-emerald-400",
  white: "bg-slate-400",
};

const healthLabel: Record<HealthStatus, string> = {
  red: "Critical",
  amber: "At Risk",
  green: "Healthy",
  white: "Unmonitored",
};

function capacityColor(pct: number): string {
  if (pct > 90) return "#ef4444";
  if (pct > 70) return "#f59e0b";
  return "#22c55e";
}

function WarehouseRow({ wh }: { wh: Warehouse }) {
  const pct = Math.min(100, Math.round((wh.quantity / wh.capacity) * 100));
  const doiColor = wh.doi < 10 ? "text-red-400" : wh.doi < 20 ? "text-amber-400" : "text-slate-300";

  return (
    <div className="flex items-center gap-4 py-2">
      {/* Name + type */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-white">{wh.name}</p>
      </div>

      {/* Type badge */}
      <span className="shrink-0 rounded bg-[#1e293b]/60 px-1.5 py-0.5 text-[10px] capitalize text-slate-400">
        {wh.type}
      </span>

      {/* DOI */}
      <span className={`w-10 shrink-0 text-right font-mono text-xs ${doiColor}`}>
        {wh.doi}d
      </span>

      {/* Capacity bar */}
      <div className="w-24 shrink-0">
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>{pct}%</span>
        </div>
        <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-[#1e293b]">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              backgroundColor: capacityColor(pct),
            }}
          />
        </div>
      </div>

      {/* Health dot */}
      <div className="flex shrink-0 items-center gap-1.5" title={healthLabel[wh.health]}>
        <span className={`h-2 w-2 rounded-full ${healthDot[wh.health]}`} />
      </div>
    </div>
  );
}

export default function WarehousePanel() {
  const grouped = useMemo(() => {
    const map = new Map<string, Warehouse[]>();
    warehouses.forEach((wh) => {
      const list = map.get(wh.country) ?? [];
      list.push(wh);
      map.set(wh.country, list);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  return (
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-widest text-slate-500">
        Warehouses &amp; Distribution
      </p>

      <div className="space-y-4">
        {grouped.map(([country, whs]) => (
          <div key={country}>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-600">
              {country}
            </p>
            <div className="divide-y divide-[#1e293b]/30">
              {whs.map((wh) => (
                <WarehouseRow key={wh.id} wh={wh} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
