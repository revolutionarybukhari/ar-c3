"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { seasonalData } from "@/data/mockData";

const SAFETY_STOCK = 8000;

const legendItems = [
  { label: "Demand", color: "#60a5fa" },
  { label: "Supply", color: "#34d399" },
  { label: "Inventory", color: "#a855f7" },
  { label: "Safety Stock", color: "#f87171", dashed: true },
];

export default function SupplyDemandPanel() {
  return (
    <div>
      <div className="mb-1">
        <p className="text-[11px] uppercase tracking-widest text-slate-500">
          Supply &amp; Demand
        </p>
        <p className="text-[10px] text-slate-600">52-week outlook</p>
      </div>

      {/* Legend */}
      <div className="mb-3 flex flex-wrap items-center gap-4">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            {item.dashed ? (
              <svg width="14" height="2" className="shrink-0">
                <line
                  x1="0"
                  y1="1"
                  x2="14"
                  y2="1"
                  stroke={item.color}
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
              </svg>
            ) : (
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span className="text-[11px] text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={seasonalData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="inventoryFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" strokeOpacity={0.3} />

          {/* Seasonal markers - very subtle */}
          <ReferenceArea
            x1={10}
            x2={14}
            fill="#f59e0b"
            fillOpacity={0.03}
            label={{
              value: "Ramadan",
              position: "insideTop",
              fill: "#f59e0b",
              fontSize: 10,
              fontWeight: 500,
            }}
          />
          <ReferenceArea
            x1={24}
            x2={25}
            fill="#ef4444"
            fillOpacity={0.03}
            label={{
              value: "Eid al-Adha",
              position: "insideTop",
              fill: "#ef4444",
              fontSize: 10,
              fontWeight: 500,
            }}
          />

          <XAxis
            dataKey="week"
            tick={{ fill: "#475569", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "#1e293b" }}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "#1e293b" }}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#94a3b8" }}
            itemStyle={{ color: "#e2e8f0" }}
            labelFormatter={(w) => `Week ${w}`}
            cursor={{ stroke: "#334155", strokeDasharray: "4 4" }}
          />
          <Legend content={() => null} />

          {/* Inventory area */}
          <Area
            type="monotone"
            dataKey="inventory"
            name="Inventory"
            fill="url(#inventoryFill)"
            stroke="#a855f7"
            strokeWidth={1}
            strokeOpacity={0.5}
          />

          {/* Demand line */}
          <Line
            type="monotone"
            dataKey="demand"
            name="Demand"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
          />

          {/* Supply line */}
          <Line
            type="monotone"
            dataKey="supply"
            name="Supply"
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
          />

          {/* Safety stock */}
          <ReferenceLine
            y={SAFETY_STOCK}
            stroke="#f87171"
            strokeDasharray="6 4"
            strokeOpacity={0.4}
            label={{
              value: "Safety Stock",
              position: "right",
              fill: "#f87171",
              fontSize: 10,
              fontWeight: 500,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
