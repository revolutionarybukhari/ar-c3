import { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import type { KpiItem } from "@/types";
import { kpiData } from "@/data/mockData";

const accents = [
  { border: "#3b82f6", bg: "rgba(59,130,246,0.06)" },
  { border: "#10b981", bg: "rgba(16,185,129,0.06)" },
  { border: "#8b5cf6", bg: "rgba(139,92,246,0.06)" },
  { border: "#f59e0b", bg: "rgba(245,158,11,0.06)" },
  { border: "#3b82f6", bg: "rgba(59,130,246,0.06)" },
  { border: "#10b981", bg: "rgba(16,185,129,0.06)" },
  { border: "#8b5cf6", bg: "rgba(139,92,246,0.06)" },
  { border: "#f59e0b", bg: "rgba(245,158,11,0.06)" },
];

function KpiCard({ item, index }: { item: KpiItem; index: number }) {
  const isPositive = item.delta >= 0;
  const accent = accents[index];
  const chartData = item.sparkline.map((v, i) => ({ i, v }));

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-[#1e293b]/40"
      style={{ backgroundColor: accent.bg }}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${accent.border}, transparent)` }}
      />

      <div className="px-4 py-3.5">
        {/* Label */}
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 mb-2">
          {item.label}
        </p>

        {/* Value row */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xl font-semibold text-white tracking-tight leading-none">
              {item.prefix ?? ""}{item.value}
            </span>
            <div className="mt-1.5 flex items-center gap-1">
              <span
                className={
                  isPositive
                    ? "text-[10px] font-medium text-emerald-400"
                    : "text-[10px] font-medium text-red-400"
                }
              >
                {isPositive ? "▲" : "▼"} {isPositive ? "+" : ""}{item.delta.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-600">vs prev</span>
            </div>
          </div>

          {/* Sparkline */}
          <div className="w-[56px] h-[28px] opacity-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
                <defs>
                  <linearGradient id={`kpi-fill-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accent.border} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={accent.border} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={accent.border}
                  strokeWidth={1.5}
                  fill={`url(#kpi-fill-${index})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KpiStrip() {
  const items: KpiItem[] = useMemo(() => kpiData, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2.5">
      {items.map((item, idx) => (
        <KpiCard key={idx} item={item} index={idx} />
      ))}
    </div>
  );
}
