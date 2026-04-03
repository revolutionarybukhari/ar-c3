"use client";

import { useState, useMemo } from "react";
import {
  Area,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SliderConfig {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultValue: number;
}

const sliders: SliderConfig[] = [
  { key: "supplyGrowth", label: "Supply Growth", min: 0, max: 50, step: 1, unit: "%", defaultValue: 5 },
  { key: "mortalityRate", label: "Mortality Rate", min: 0, max: 20, step: 0.5, unit: "%", defaultValue: 3 },
  { key: "priceDelta", label: "Price Delta", min: -30, max: 30, step: 1, unit: "%", defaultValue: 0 },
  { key: "demandBoost", label: "Demand Boost", min: 0, max: 100, step: 1, unit: "%", defaultValue: 10 },
  { key: "leadTime", label: "Lead Time", min: 1, max: 30, step: 1, unit: " days", defaultValue: 7 },
  { key: "safetyStock", label: "Safety Stock", min: 0, max: 50, step: 1, unit: "%", defaultValue: 15 },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const BASE_DEMAND = 12000;
const BASE_SUPPLY = 11500;

function generateForecast(params: Record<string, number>) {
  const data = MONTHS.map((month, i) => {
    const seasonFactor = 1 + 0.15 * Math.sin(((i - 3) * Math.PI) / 6);
    const demand = BASE_DEMAND * seasonFactor * (1 + params.demandBoost / 100);
    const effectiveSupply =
      BASE_SUPPLY *
      (1 + params.supplyGrowth / 100) *
      (1 - params.mortalityRate / 100) *
      (1 + i * 0.008);
    const confidenceWidth = demand * 0.08 * (1 + i * 0.04);

    return {
      month,
      demand: Math.round(demand),
      supply: Math.round(effectiveSupply),
      forecastHigh: Math.round(demand + confidenceWidth),
      forecastLow: Math.round(Math.max(0, demand - confidenceWidth)),
    };
  });

  const totalDemand = data.reduce((s, d) => s + d.demand, 0);
  const totalSupply = data.reduce((s, d) => s + d.supply, 0);
  const deficit = totalDemand - totalSupply;
  const costImpact = deficit * (2.5 * (1 + params.priceDelta / 100));

  return { data, deficit, costImpact };
}

export default function ForecastSimulator() {
  const [params, setParams] = useState<Record<string, number>>(
    Object.fromEntries(sliders.map((s) => [s.key, s.defaultValue]))
  );
  const [hasRun, setHasRun] = useState(false);

  const { data, deficit, costImpact } = useMemo(() => generateForecast(params), [params]);

  const handleSlider = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-widest text-slate-500">
        Forecast Simulator
      </p>

      {/* Sliders */}
      <div className="mb-4 grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-3">
        {sliders.map((s) => {
          const pct =
            s.max === s.min ? 0 : ((params[s.key] - s.min) / (s.max - s.min)) * 100;
          return (
            <div key={s.key}>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-[11px] text-slate-500">{s.label}</label>
                <span className="font-mono text-xs text-white">
                  {params[s.key]}{s.unit}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={params[s.key]}
                onChange={(e) => handleSlider(s.key, Number(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#1e293b] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${pct}%, #1e293b ${pct}%, #1e293b 100%)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Run button */}
      <button
        onClick={() => setHasRun(true)}
        className="mb-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
      >
        Run Simulation
      </button>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis
            dataKey="month"
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
          />

          {/* Confidence band */}
          <Area
            type="monotone"
            dataKey="forecastHigh"
            stroke="none"
            fill="url(#confBand)"
            name="Confidence High"
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="forecastLow"
            stroke="none"
            fill="#0a0e1a"
            fillOpacity={1}
            name="Confidence Low"
            legendType="none"
          />

          <Line
            type="monotone"
            dataKey="demand"
            name="Projected Demand"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="supply"
            name="Projected Supply"
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
            strokeDasharray="6 3"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-2 flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
          <span className="text-[11px] text-slate-400">Projected Demand</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="14" height="2">
            <line x1="0" y1="1" x2="14" y2="1" stroke="#34d399" strokeWidth="2" strokeDasharray="3 2" />
          </svg>
          <span className="text-[11px] text-slate-400">Projected Supply</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-4 rounded-sm bg-blue-500/10" />
          <span className="text-[11px] text-slate-400">Confidence Band</span>
        </div>
      </div>

      {/* Results */}
      {hasRun && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[#1e293b]/50 bg-[#0f1629] px-3 py-2.5">
            <p className="text-[11px] text-slate-500">
              {deficit > 0 ? "Projected Deficit" : "Projected Surplus"}
            </p>
            <p className={`mt-0.5 text-sm font-semibold ${deficit > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {Math.abs(deficit).toLocaleString()} head
            </p>
          </div>
          <div className="rounded-lg border border-[#1e293b]/50 bg-[#0f1629] px-3 py-2.5">
            <p className="text-[11px] text-slate-500">Cost Impact</p>
            <p className={`mt-0.5 text-sm font-semibold ${costImpact > 0 ? "text-red-400" : "text-emerald-400"}`}>
              ${Math.abs(Math.round(costImpact)).toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-[#1e293b]/50 bg-[#0f1629] px-3 py-2.5">
            <p className="text-[11px] text-slate-500">Recommendation</p>
            <p className="mt-0.5 text-sm font-semibold text-blue-400">
              {deficit > 5000
                ? "Increase sourcing urgently"
                : deficit > 0
                ? "Monitor & optimize"
                : "Supply adequate"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
