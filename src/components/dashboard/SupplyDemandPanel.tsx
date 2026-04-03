"use client";

import { useState } from "react";
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
import { ArrowRight } from "lucide-react";
import { seasonalData } from "@/data/mockData";
import type { SeasonalData } from "@/types";

const SAFETY_STOCK = 8000;

// ---------------------------------------------------------------------------
// Scenario definitions
// ---------------------------------------------------------------------------
interface Scenario {
  id: string;
  label: string;
  supplyMultiplier: number;
  demandMultiplier: number;
  inventoryMultiplier: number;
}

const scenarios: Scenario[] = [
  { id: "baseline", label: "Baseline", supplyMultiplier: 1, demandMultiplier: 1, inventoryMultiplier: 1 },
  { id: "pakistan-flood", label: "Pakistan Flood (-40%)", supplyMultiplier: 0.6, demandMultiplier: 1.05, inventoryMultiplier: 0.7 },
  { id: "disease-outbreak", label: "Disease Outbreak (-25%)", supplyMultiplier: 0.75, demandMultiplier: 0.9, inventoryMultiplier: 0.8 },
  { id: "feed-crisis", label: "Feed Crisis (-15%)", supplyMultiplier: 0.85, demandMultiplier: 1, inventoryMultiplier: 0.88 },
];

// ---------------------------------------------------------------------------
// Supply redirection cards
// ---------------------------------------------------------------------------
interface Redirection {
  id: string;
  source: string;
  destination: string;
  quantity: string;
  reason: string;
}

const redirections: Record<string, Redirection[]> = {
  "pakistan-flood": [
    { id: "r1", source: "Lahore Premium", destination: "Garut Highland", quantity: "500 hd/day", reason: "Flood displacement" },
    { id: "r2", source: "Faisalabad Station", destination: "Bogor Valley", quantity: "320 hd/day", reason: "Supply gap fill" },
    { id: "r3", source: "Islamabad Highland", destination: "Semarang Feedlot", quantity: "200 hd/day", reason: "Capacity rebalance" },
  ],
  "disease-outbreak": [
    { id: "r1", source: "Cianjur Agri", destination: "Sukabumi Green", quantity: "250 hd/day", reason: "Quarantine reroute" },
    { id: "r2", source: "East Java Station", destination: "Malang Sheep", quantity: "400 hd/day", reason: "Disease containment" },
    { id: "r3", source: "Kampala Corp", destination: "Medan Ranch", quantity: "180 hd/day", reason: "Backup sourcing" },
  ],
  "feed-crisis": [
    { id: "r1", source: "Purwakarta Feedlot", destination: "Subang Agro", quantity: "150 hd/day", reason: "Feed shortage swap" },
    { id: "r2", source: "Karawang Collective", destination: "Tasikmalaya Ranch", quantity: "280 hd/day", reason: "Feed reallocation" },
    { id: "r3", source: "Karachi Exchange", destination: "Bandung Hub", quantity: "350 hd/day", reason: "Cross-region support" },
  ],
};

// ---------------------------------------------------------------------------
// Build scenario-adjusted data
// ---------------------------------------------------------------------------
function buildScenarioData(scenario: Scenario): (SeasonalData & {
  baselineSupply: number;
  baselineDemand: number;
  baselineInventory: number;
})[] {
  return seasonalData.map((d) => ({
    ...d,
    baselineSupply: d.supply,
    baselineDemand: d.demand,
    baselineInventory: d.inventory,
    supply: Math.round(d.supply * scenario.supplyMultiplier),
    demand: Math.round(d.demand * scenario.demandMultiplier),
    inventory: Math.round(d.inventory * scenario.inventoryMultiplier),
  }));
}

// ---------------------------------------------------------------------------
// Legend items
// ---------------------------------------------------------------------------
const legendItems = [
  { label: "Demand", color: "#60a5fa" },
  { label: "Supply", color: "#34d399" },
  { label: "Inventory", color: "#a855f7" },
  { label: "Safety Stock", color: "#f87171", dashed: true },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function SupplyDemandPanel() {
  const [activeScenario, setActiveScenario] = useState<string>("baseline");

  const scenario = scenarios.find((s) => s.id === activeScenario) ?? scenarios[0];
  const isBaseline = activeScenario === "baseline";
  const chartData = buildScenarioData(scenario);
  const activeRedirections = redirections[activeScenario] ?? [];

  return (
    <div>
      {/* Header */}
      <div className="mb-1">
        <p className="text-[11px] uppercase tracking-widest text-slate-500">
          Supply &amp; Demand
        </p>
        <p className="text-[10px] text-slate-600">
          52-week outlook &middot; shock simulation
        </p>
      </div>

      {/* Scenario buttons */}
      <div className="mb-3 flex flex-wrap gap-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveScenario(s.id)}
            className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors ${
              activeScenario === s.id
                ? "bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30"
                : "bg-[#1e293b]/40 text-slate-400 hover:bg-[#1e293b]/70 hover:text-slate-300"
            }`}
          >
            {s.label}
          </button>
        ))}
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
        {!isBaseline && (
          <div className="flex items-center gap-1.5">
            <svg width="14" height="2" className="shrink-0">
              <line
                x1="0"
                y1="1"
                x2="14"
                y2="1"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="4 3"
                strokeOpacity="0.5"
              />
            </svg>
            <span className="text-[11px] text-slate-500">Baseline</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="inventoryFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={0.01} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" strokeOpacity={0.3} />

          {/* Seasonal markers */}
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

          {/* Baseline dashed lines (only when a shock scenario is active) */}
          {!isBaseline && (
            <>
              <Line
                type="monotone"
                dataKey="baselineSupply"
                name="Baseline Supply"
                stroke="#34d399"
                strokeWidth={1.5}
                strokeDasharray="6 4"
                strokeOpacity={0.35}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="baselineDemand"
                name="Baseline Demand"
                stroke="#60a5fa"
                strokeWidth={1.5}
                strokeDasharray="6 4"
                strokeOpacity={0.35}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="baselineInventory"
                name="Baseline Inventory"
                stroke="#a855f7"
                strokeWidth={1.5}
                strokeDasharray="6 4"
                strokeOpacity={0.35}
                dot={false}
              />
            </>
          )}

          {/* Scenario / active data */}
          <Area
            type="monotone"
            dataKey="inventory"
            name="Inventory"
            fill="url(#inventoryFill)"
            stroke="#a855f7"
            strokeWidth={isBaseline ? 1 : 2}
            strokeOpacity={isBaseline ? 0.5 : 1}
          />
          <Line
            type="monotone"
            dataKey="demand"
            name="Demand"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
          />
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

      {/* Supply redirection section */}
      {!isBaseline && activeRedirections.length > 0 && (
        <div className="mt-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
            Supply Redirection
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {activeRedirections.map((r) => (
              <div
                key={r.id}
                className="rounded-lg bg-[#0f1629] border border-[#1e293b]/50 p-3 space-y-2"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-slate-300">{r.source}</span>
                  <ArrowRight className="h-3 w-3 text-blue-400 shrink-0" />
                  <span className="font-medium text-slate-300">{r.destination}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white">{r.quantity}</span>
                  <span className="text-[10px] text-slate-500">{r.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
