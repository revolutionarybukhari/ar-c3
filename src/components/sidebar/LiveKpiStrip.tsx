import { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import type { KpiItem } from "@/types";
import { kpiData } from "@/data/mockData";

export default function LiveKpiStrip() {
  const items: KpiItem[] = useMemo(() => kpiData, []);

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase">Key Metrics</p>
        <div className="flex items-center gap-1">
          <span className="live-dot h-1 w-1 rounded-full bg-emerald-400" />
          <span className="text-[8px] font-bold tracking-wider text-emerald-400 uppercase">Live</span>
        </div>
      </div>
      {items.slice(0, 6).map((item, idx) => {
        const isPositive = item.delta >= 0;
        const chartData = item.sparkline.map((v, i) => ({ i, v }));
        return (
          <div key={idx} className="flex items-center justify-between px-3 py-1.5 hover:bg-[#0a1020] transition-colors">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-medium tracking-wider text-slate-600 uppercase truncate">
                {item.label}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-white tabular-nums">
                  {item.prefix ?? ""}{item.value}
                </span>
                <span className={isPositive ? "text-[9px] font-semibold text-emerald-400" : "text-[9px] font-semibold text-red-400"}>
                  {isPositive ? "+" : ""}{item.delta.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-[40px] h-[18px] opacity-50">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 1, right: 0, bottom: 1, left: 0 }}>
                  <defs>
                    <linearGradient id={`live-kpi-${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={isPositive ? "#22c55e" : "#ef4444"}
                    strokeWidth={1}
                    fill={`url(#live-kpi-${idx})`}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
