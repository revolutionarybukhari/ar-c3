"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  Truck,
  PackageCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

/* ── Scenario Data ─────────────────────────────────────────────── */

interface RegionDemand {
  region: string;
  current: number;
  projected: number;
  change: number;
}

interface PriceRow {
  region: string;
  currentPrice: number;
  projectedPrice: number;
  change: number;
  response: string;
}

interface Scenario {
  label: string;
  demand: RegionDemand[];
  prices: PriceRow[];
}

const scenarios: Scenario[] = [
  {
    label: "Eid al-Adha Surge",
    demand: [
      { region: "Jakarta", current: 4200, projected: 7140, change: 70 },
      { region: "Surabaya", current: 2800, projected: 4200, change: 50 },
      { region: "Bandung", current: 1500, projected: 2400, change: 60 },
      { region: "Singapore", current: 900, projected: 1260, change: 40 },
      { region: "Dubai", current: 3100, projected: 5270, change: 70 },
      { region: "Riyadh", current: 2600, projected: 4420, change: 70 },
    ],
    prices: [
      { region: "Jakarta", currentPrice: 3.2, projectedPrice: 3.7, change: 15.6, response: "Dynamic pricing activated" },
      { region: "Surabaya", currentPrice: 3.0, projectedPrice: 3.35, change: 11.7, response: "Redirect from surplus regions" },
      { region: "Bandung", currentPrice: 3.1, projectedPrice: 3.55, change: 14.5, response: "Trigger bulk purchase" },
      { region: "Singapore", currentPrice: 5.8, projectedPrice: 6.3, change: 8.6, response: "Dynamic pricing activated" },
      { region: "Dubai", currentPrice: 6.2, projectedPrice: 7.1, change: 14.5, response: "Redirect from surplus regions" },
      { region: "Riyadh", currentPrice: 5.9, projectedPrice: 6.8, change: 15.3, response: "Trigger bulk purchase" },
    ],
  },
  {
    label: "Regional Spike (Jakarta)",
    demand: [
      { region: "Jakarta", current: 4200, projected: 6300, change: 50 },
      { region: "Surabaya", current: 2800, projected: 2940, change: 5 },
      { region: "Bandung", current: 1500, projected: 1575, change: 5 },
      { region: "Singapore", current: 900, projected: 918, change: 2 },
      { region: "Dubai", current: 3100, projected: 3100, change: 0 },
      { region: "Riyadh", current: 2600, projected: 2600, change: 0 },
    ],
    prices: [
      { region: "Jakarta", currentPrice: 3.2, projectedPrice: 3.65, change: 14.1, response: "Dynamic pricing activated" },
      { region: "Surabaya", currentPrice: 3.0, projectedPrice: 3.05, change: 1.7, response: "Redirect stock to Jakarta" },
      { region: "Bandung", currentPrice: 3.1, projectedPrice: 3.12, change: 0.6, response: "Redirect stock to Jakarta" },
      { region: "Singapore", currentPrice: 5.8, projectedPrice: 5.8, change: 0, response: "No action required" },
      { region: "Dubai", currentPrice: 6.2, projectedPrice: 6.2, change: 0, response: "No action required" },
      { region: "Riyadh", currentPrice: 5.9, projectedPrice: 5.9, change: 0, response: "No action required" },
    ],
  },
  {
    label: "Seasonal Decline",
    demand: [
      { region: "Jakarta", current: 4200, projected: 3360, change: -20 },
      { region: "Surabaya", current: 2800, projected: 2380, change: -15 },
      { region: "Bandung", current: 1500, projected: 1275, change: -15 },
      { region: "Singapore", current: 900, projected: 810, change: -10 },
      { region: "Dubai", current: 3100, projected: 2790, change: -10 },
      { region: "Riyadh", current: 2600, projected: 2340, change: -10 },
    ],
    prices: [
      { region: "Jakarta", currentPrice: 3.2, projectedPrice: 2.85, change: -10.9, response: "Reduce procurement orders" },
      { region: "Surabaya", currentPrice: 3.0, projectedPrice: 2.7, change: -10.0, response: "Reduce procurement orders" },
      { region: "Bandung", currentPrice: 3.1, projectedPrice: 2.8, change: -9.7, response: "Freeze new purchases" },
      { region: "Singapore", currentPrice: 5.8, projectedPrice: 5.5, change: -5.2, response: "Hold pricing steady" },
      { region: "Dubai", currentPrice: 6.2, projectedPrice: 5.9, change: -4.8, response: "Hold pricing steady" },
      { region: "Riyadh", currentPrice: 5.9, projectedPrice: 5.6, change: -5.1, response: "Hold pricing steady" },
    ],
  },
];

const responseCards = [
  {
    title: "Accelerate Imports",
    icon: Truck,
    description: "Fast-track livestock shipments from verified partner farms in surplus regions.",
    metric: "ETA: 5-7 days",
    status: "Ready",
    statusColor: "text-emerald-400 bg-emerald-500/10",
  },
  {
    title: "Activate Reserve Stock",
    icon: PackageCheck,
    description: "Deploy reserve inventory from cold-chain warehouses to meet projected shortfall.",
    metric: "Available: 12,500 head",
    status: "On Standby",
    statusColor: "text-amber-400 bg-amber-500/10",
  },
  {
    title: "Dynamic Pricing",
    icon: TrendingUp,
    description: "Algorithmically adjust pricing in deficit zones to balance supply and demand.",
    metric: "Adjust: +8-15% in deficit zones",
    status: "Active",
    statusColor: "text-sky-400 bg-sky-500/10",
  },
];

/* ── Component ─────────────────────────────────────────────────── */

export default function DemandScenarioPanel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const scenario = scenarios[activeIdx];

  return (
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-widest text-slate-500">
        Demand Scenarios
      </p>

      {/* Scenario Selector */}
      <div className="mb-4 flex gap-2">
        {scenarios.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setActiveIdx(i)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              i === activeIdx
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                : "bg-[#0f1629] text-slate-400 border border-[#1e293b]/40 hover:border-slate-500 hover:text-slate-300"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Demand Impact Chart */}
      <div className="rounded-xl border border-[#1e293b]/40 bg-[#0f1629] p-4 mb-4">
        <p className="mb-3 text-xs font-semibold text-slate-300">
          Demand Impact — {scenario.label}
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={scenario.demand}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="region"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#1e293b" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f1629",
                border: "1px solid #1e293b",
                borderRadius: 8,
                fontSize: 12,
                color: "#e2e8f0",
              }}
              cursor={{ fill: "rgba(148,163,184,0.05)" }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
            />
            <Bar dataKey="current" name="Current Demand" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="projected" name="Projected Demand" fill="#f59e0b" radius={[3, 3, 0, 0]}>
              <LabelList
                dataKey="change"
                position="top"
                formatter={(v: unknown) => `${Number(v) > 0 ? "+" : ""}${v}%`}
                style={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Price Impact Table */}
      <div className="rounded-xl border border-[#1e293b]/40 bg-[#0f1629] p-4 mb-4 overflow-x-auto">
        <p className="mb-3 text-xs font-semibold text-slate-300">Price Impact</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1e293b]/60 text-left text-[10px] uppercase tracking-wider text-slate-500">
              <th className="pb-2 pr-4">Region</th>
              <th className="pb-2 pr-4">Current Price</th>
              <th className="pb-2 pr-4">Projected Price</th>
              <th className="pb-2 pr-4">Change</th>
              <th className="pb-2">Platform Response</th>
            </tr>
          </thead>
          <tbody>
            {scenario.prices.map((row) => (
              <tr key={row.region} className="border-b border-[#1e293b]/30">
                <td className="py-2 pr-4 text-slate-300 font-medium">{row.region}</td>
                <td className="py-2 pr-4 text-slate-400">${row.currentPrice.toFixed(2)}/kg</td>
                <td className="py-2 pr-4 text-slate-400">${row.projectedPrice.toFixed(2)}/kg</td>
                <td className="py-2 pr-4">
                  <span className={`inline-flex items-center gap-0.5 font-semibold ${row.change > 0 ? "text-red-400" : row.change < 0 ? "text-emerald-400" : "text-slate-500"}`}>
                    {row.change !== 0 && (
                      row.change > 0
                        ? <ArrowUpRight className="h-3 w-3" />
                        : <ArrowDownRight className="h-3 w-3" />
                    )}
                    {row.change > 0 ? "+" : ""}{row.change.toFixed(1)}%
                  </span>
                </td>
                <td className="py-2 text-slate-400">{row.response}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Supply Chain Response Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {responseCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl border border-[#1e293b]/40 bg-[#0f1629] p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
                    <Icon className="h-4 w-4 text-sky-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">{card.title}</h4>
                </div>
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${card.statusColor}`}>
                  {card.status}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">{card.description}</p>
              <p className="text-xs font-medium text-slate-300">{card.metric}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
