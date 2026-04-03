import { useState, useMemo, useCallback } from "react";
import type { CSSProperties } from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Zap,
  Shield,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

interface ScenarioParams {
  supplyGrowth: number;
  mortality: number;
  priceVol: number;
  demandMult: number;
  leadTime: number;
  safetyStock: number;
  feedCost: number;
  currencyFx: number;
}

type PresetKey = "baseline" | "eidSurge" | "supplyCrisis" | "diseaseOutbreak" | "custom";

interface SliderConfig {
  key: keyof ScenarioParams;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: string;
}

interface ForecastPoint {
  month: string;
  monthIdx: number;
  demand: number;
  supply: number;
  aiForecast: number;
  conf90High: number;
  conf90Low: number;
  conf50High: number;
  conf50Low: number;
  event?: string;
}

interface RiskFactor {
  label: string;
  score: number;
  trend: "up" | "down" | "flat";
  desc: string;
}

interface Recommendation {
  priority: "critical" | "high" | "medium";
  text: string;
  impact: string;
}

interface SensitivityRow {
  param: string;
  current: string;
  bestCase: string;
  worstCase: string;
  sensitivity: "high" | "med" | "low";
}

/* ─── Constants ─── */

const presets: Record<PresetKey, ScenarioParams | null> = {
  baseline: { supplyGrowth: 5, mortality: 3, priceVol: 10, demandMult: 1.0, leadTime: 7, safetyStock: 15, feedCost: 0, currencyFx: 0 },
  eidSurge: { supplyGrowth: 5, mortality: 3, priceVol: 25, demandMult: 2.5, leadTime: 14, safetyStock: 25, feedCost: 5, currencyFx: -3 },
  supplyCrisis: { supplyGrowth: -15, mortality: 8, priceVol: 35, demandMult: 1.0, leadTime: 21, safetyStock: 30, feedCost: 20, currencyFx: -8 },
  diseaseOutbreak: { supplyGrowth: -25, mortality: 15, priceVol: 40, demandMult: 0.85, leadTime: 28, safetyStock: 35, feedCost: 12, currencyFx: -5 },
  custom: null,
};

const presetLabels: Record<PresetKey, string> = {
  baseline: "Baseline",
  eidSurge: "Eid Surge",
  supplyCrisis: "Supply Crisis",
  diseaseOutbreak: "Disease Outbreak",
  custom: "Custom",
};

const presetColors: Record<PresetKey, string> = {
  baseline: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
  eidSurge: "text-amber-400 border-amber-500/30 bg-amber-500/5",
  supplyCrisis: "text-red-400 border-red-500/30 bg-red-500/5",
  diseaseOutbreak: "text-rose-400 border-rose-500/30 bg-rose-500/5",
  custom: "text-blue-400 border-blue-500/30 bg-blue-500/5",
};

const sliderConfigs: SliderConfig[] = [
  { key: "supplyGrowth", label: "Supply Growth", min: -30, max: 30, step: 1, unit: "%", color: "#34d399" },
  { key: "mortality", label: "Mortality Rate", min: 0, max: 25, step: 0.5, unit: "%", color: "#f87171" },
  { key: "priceVol", label: "Price Volatility", min: 0, max: 50, step: 1, unit: "%", color: "#fbbf24" },
  { key: "demandMult", label: "Demand Multiplier", min: 0.5, max: 3.0, step: 0.1, unit: "\u00d7", color: "#60a5fa" },
  { key: "leadTime", label: "Lead Time", min: 1, max: 30, step: 1, unit: "d", color: "#a78bfa" },
  { key: "safetyStock", label: "Safety Stock", min: 0, max: 50, step: 1, unit: "%", color: "#2dd4bf" },
  { key: "feedCost", label: "Feed Cost Impact", min: -20, max: 40, step: 1, unit: "%", color: "#fb923c" },
  { key: "currencyFx", label: "Currency Effect", min: -15, max: 15, step: 0.5, unit: "%", color: "#818cf8" },
];

const MONTHS_18 = [
  "May 26", "Jun 26", "Jul 26", "Aug 26", "Sep 26", "Oct 26",
  "Nov 26", "Dec 26", "Jan 27", "Feb 27", "Mar 27", "Apr 27",
  "May 27", "Jun 27", "Jul 27", "Aug 27", "Sep 27", "Oct 27",
];

const BASE_DEMAND = 12000;
const BASE_SUPPLY = 11500;

/* Seasonal events mapped to month indices */
const SEASONAL_EVENTS: { start: number; end: number; label: string }[] = [
  { start: 0, end: 1, label: "Ramadan" },       // May-Jun 2026
  { start: 3, end: 4, label: "Eid al-Adha" },   // Aug-Sep 2026
  { start: 5, end: 5, label: "Hajj" },           // Oct 2026
  { start: 12, end: 13, label: "Ramadan" },      // May-Jun 2027
  { start: 15, end: 16, label: "Eid al-Adha" },  // Aug-Sep 2027
];

/* ─── Forecast Generator ─── */

function generateForecast(params: ScenarioParams): ForecastPoint[] {
  return MONTHS_18.map((month, i) => {
    // Seasonal demand factors
    const monthOfYear = (i + 4) % 12; // Starting from May
    const seasonFactor = 1 + 0.12 * Math.sin(((monthOfYear - 2) * Math.PI) / 6);

    // Eid/Ramadan surge
    const isEidSeason = monthOfYear >= 7 && monthOfYear <= 9;
    const isRamadan = monthOfYear >= 4 && monthOfYear <= 5;
    const eventFactor = isEidSeason ? 1.35 : isRamadan ? 1.15 : 1.0;

    // Demand calculation
    const baseDemand = BASE_DEMAND * seasonFactor * eventFactor * params.demandMult;
    const feedCostDemandImpact = 1 - (params.feedCost * 0.003);
    const currencyDemandImpact = 1 + (params.currencyFx * 0.005);
    const demand = baseDemand * feedCostDemandImpact * currencyDemandImpact;

    // Supply calculation
    const growthFactor = 1 + (params.supplyGrowth / 100);
    const mortalityFactor = 1 - (params.mortality / 100);
    const leadTimeImpact = 1 - ((params.leadTime - 7) * 0.004);
    const feedCostSupplyImpact = 1 - (params.feedCost * 0.005);
    const trend = 1 + i * 0.006;
    const supply = BASE_SUPPLY * growthFactor * mortalityFactor * leadTimeImpact * feedCostSupplyImpact * trend;

    // AI forecast (smoothed blend with forward-looking correction)
    const aiCorrection = (demand - supply) * 0.15;
    const aiSmoothing = 1 + (i * 0.003);
    const aiForecast = (demand * 0.55 + supply * 0.45 + aiCorrection) * aiSmoothing;

    // Confidence bands widen over time
    const volFactor = params.priceVol / 100;
    const timeDecay = 1 + i * 0.06;
    const conf90Width = demand * (0.06 + volFactor * 0.12) * timeDecay;
    const conf50Width = demand * (0.03 + volFactor * 0.06) * timeDecay;

    // Find event label for this month
    const event = SEASONAL_EVENTS.find(e => i >= e.start && i <= e.end)?.label;

    return {
      month,
      monthIdx: i,
      demand: Math.round(demand),
      supply: Math.round(supply),
      aiForecast: Math.round(aiForecast),
      conf90High: Math.round(aiForecast + conf90Width),
      conf90Low: Math.round(Math.max(0, aiForecast - conf90Width)),
      conf50High: Math.round(aiForecast + conf50Width),
      conf50Low: Math.round(Math.max(0, aiForecast - conf50Width)),
      event,
    };
  });
}

/* ─── Analysis Generators ─── */

function computeMetrics(data: ForecastPoint[], params: ScenarioParams) {
  const totalDemand = data.reduce((s, d) => s + d.demand, 0);
  const totalSupply = data.reduce((s, d) => s + d.supply, 0);
  const deficit = totalDemand - totalSupply;
  const utilization = Math.min(100, (totalSupply / totalDemand) * 100);
  const costImpact = deficit * 2.8 * (1 + params.priceVol / 100);
  const revenueImpact = deficit > 0 ? -deficit * 3.2 : Math.abs(deficit) * 1.1;
  const breakEvenMonth = data.findIndex((d, i) => i > 0 && d.supply >= d.demand);

  return {
    deficit,
    utilization: Math.round(utilization * 10) / 10,
    costImpact: Math.round(costImpact),
    revenueImpact: Math.round(revenueImpact),
    breakEvenMonth: breakEvenMonth >= 0 ? MONTHS_18[breakEvenMonth] : "N/A",
  };
}

function computeRecommendations(deficit: number, params: ScenarioParams): Recommendation[] {
  const recs: Recommendation[] = [];

  if (deficit > 10000) {
    recs.push({
      priority: "critical",
      text: "Activate emergency import corridors from Australia and Brazil",
      impact: `Covers ~${Math.round(deficit * 0.4).toLocaleString()} head deficit`,
    });
  } else if (deficit > 3000) {
    recs.push({
      priority: "high",
      text: "Increase procurement from secondary suppliers by 25%",
      impact: `Reduces deficit by ~${Math.round(deficit * 0.3).toLocaleString()} head`,
    });
  } else {
    recs.push({
      priority: "medium",
      text: "Maintain current sourcing with quarterly review cadence",
      impact: "Stable supply pipeline, no immediate action needed",
    });
  }

  if (params.mortality > 8) {
    recs.push({
      priority: "critical",
      text: "Deploy veterinary surge teams to high-mortality zones",
      impact: `Could reduce mortality by ${Math.round(params.mortality * 0.3)}% within 60 days`,
    });
  } else if (params.feedCost > 10) {
    recs.push({
      priority: "high",
      text: "Negotiate bulk feed contracts to lock in current pricing",
      impact: `Saves est. $${Math.round(params.feedCost * 12000).toLocaleString()} over 6 months`,
    });
  } else {
    recs.push({
      priority: "medium",
      text: "Optimize feed mix ratios using ML-based nutritional models",
      impact: "3-5% feed cost reduction with maintained weight gain",
    });
  }

  if (params.demandMult > 1.8) {
    recs.push({
      priority: "high",
      text: "Pre-position inventory at regional distribution hubs",
      impact: `Reduces lead time by ${Math.round(params.leadTime * 0.3)} days during peak`,
    });
  } else if (params.currencyFx < -5) {
    recs.push({
      priority: "high",
      text: "Hedge currency exposure with 90-day forward contracts",
      impact: `Mitigates ${Math.abs(params.currencyFx)}% FX downside risk`,
    });
  } else {
    recs.push({
      priority: "medium",
      text: "Diversify supplier base across 3+ currency zones",
      impact: "Reduces single-currency exposure by 40%",
    });
  }

  return recs;
}

function computeRisks(params: ScenarioParams, deficit: number): RiskFactor[] {
  const supplyScore = Math.min(100, Math.max(0, 50 - params.supplyGrowth * 2 + params.mortality * 3));
  const priceScore = Math.min(100, params.priceVol * 2 + Math.abs(params.currencyFx) * 3);
  const demandScore = Math.min(100, (params.demandMult - 1) * 60 + (deficit > 0 ? 20 : 0));
  const operationalScore = Math.min(100, params.leadTime * 2.5 + params.feedCost * 1.5);

  return [
    {
      label: "Supply Disruption",
      score: Math.round(supplyScore),
      trend: params.supplyGrowth < 0 ? "up" : params.mortality > 5 ? "up" : "flat",
      desc: supplyScore > 60 ? "Significant supply constraints detected" : "Supply pipeline within tolerance",
    },
    {
      label: "Price Volatility",
      score: Math.round(priceScore),
      trend: params.priceVol > 20 ? "up" : "flat",
      desc: priceScore > 60 ? "Market instability driving price swings" : "Pricing within normal bands",
    },
    {
      label: "Demand Shock",
      score: Math.round(demandScore),
      trend: params.demandMult > 1.5 ? "up" : params.demandMult < 0.9 ? "down" : "flat",
      desc: demandScore > 60 ? "Demand surge exceeds fulfillment capacity" : "Demand patterns tracking forecast",
    },
    {
      label: "Operational Risk",
      score: Math.round(operationalScore),
      trend: params.leadTime > 14 ? "up" : params.feedCost > 15 ? "up" : "down",
      desc: operationalScore > 60 ? "Lead times and costs elevated" : "Operations running efficiently",
    },
  ];
}

function computeSensitivity(params: ScenarioParams, data: ForecastPoint[]): SensitivityRow[] {
  const baseDeficit = data.reduce((s, d) => s + d.demand, 0) - data.reduce((s, d) => s + d.supply, 0);

  function deficitDelta(override: Partial<ScenarioParams>): number {
    const d = generateForecast({ ...params, ...override });
    const newDeficit = d.reduce((s, p) => s + p.demand, 0) - d.reduce((s, p) => s + p.supply, 0);
    return newDeficit - baseDeficit;
  }

  const rows: SensitivityRow[] = [
    {
      param: "Supply Growth",
      current: `${params.supplyGrowth}%`,
      bestCase: `${Math.abs(deficitDelta({ supplyGrowth: 20 })).toLocaleString()} fewer`,
      worstCase: `${Math.abs(deficitDelta({ supplyGrowth: -20 })).toLocaleString()} more`,
      sensitivity: Math.abs(deficitDelta({ supplyGrowth: 20 })) > 15000 ? "high" : "med",
    },
    {
      param: "Mortality Rate",
      current: `${params.mortality}%`,
      bestCase: `${Math.abs(deficitDelta({ mortality: 1 })).toLocaleString()} fewer`,
      worstCase: `${Math.abs(deficitDelta({ mortality: 20 })).toLocaleString()} more`,
      sensitivity: Math.abs(deficitDelta({ mortality: 20 })) > 20000 ? "high" : "med",
    },
    {
      param: "Demand Multiplier",
      current: `${params.demandMult}\u00d7`,
      bestCase: `${Math.abs(deficitDelta({ demandMult: 0.8 })).toLocaleString()} fewer`,
      worstCase: `${Math.abs(deficitDelta({ demandMult: 2.5 })).toLocaleString()} more`,
      sensitivity: "high",
    },
    {
      param: "Feed Cost",
      current: `${params.feedCost}%`,
      bestCase: `${Math.abs(deficitDelta({ feedCost: -10 })).toLocaleString()} fewer`,
      worstCase: `${Math.abs(deficitDelta({ feedCost: 30 })).toLocaleString()} more`,
      sensitivity: Math.abs(deficitDelta({ feedCost: 30 })) > 8000 ? "med" : "low",
    },
    {
      param: "Lead Time",
      current: `${params.leadTime}d`,
      bestCase: `${Math.abs(deficitDelta({ leadTime: 3 })).toLocaleString()} fewer`,
      worstCase: `${Math.abs(deficitDelta({ leadTime: 28 })).toLocaleString()} more`,
      sensitivity: Math.abs(deficitDelta({ leadTime: 28 })) > 10000 ? "med" : "low",
    },
    {
      param: "Currency Effect",
      current: `${params.currencyFx}%`,
      bestCase: `${Math.abs(deficitDelta({ currencyFx: 10 })).toLocaleString()} fewer`,
      worstCase: `${Math.abs(deficitDelta({ currencyFx: -12 })).toLocaleString()} more`,
      sensitivity: "low",
    },
  ];

  return rows;
}

/* ─── Custom Tooltip ─── */

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#0f1a2e] bg-[#060a12]/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      {payload.filter(p => p.name !== "conf90High" && p.name !== "conf90Low" && p.name !== "conf50High" && p.name !== "conf50Low").map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-6 py-0.5">
          <span className="text-[11px] text-slate-500">{entry.name}</span>
          <span className="font-mono text-xs font-medium" style={{ color: entry.color }}>
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Component ─── */

export default function ForecastSimulator() {
  const [activePreset, setActivePreset] = useState<PresetKey>("baseline");
  const [params, setParams] = useState<ScenarioParams>({ ...presets.baseline! });

  const handlePreset = useCallback((key: PresetKey) => {
    setActivePreset(key);
    if (key !== "custom" && presets[key]) {
      setParams({ ...presets[key]! });
    }
  }, []);

  const handleSlider = useCallback((key: keyof ScenarioParams, value: number) => {
    setActivePreset("custom");
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const data = useMemo(() => generateForecast(params), [params]);
  const metrics = useMemo(() => computeMetrics(data, params), [data, params]);
  const recommendations = useMemo(() => computeRecommendations(metrics.deficit, params), [metrics.deficit, params]);
  const risks = useMemo(() => computeRisks(params, metrics.deficit), [params, metrics.deficit]);
  const sensitivity = useMemo(() => computeSensitivity(params, data), [params, data]);

  const safetyStockLevel = useMemo(() => {
    const avg = data.reduce((s, d) => s + d.supply, 0) / data.length;
    return Math.round(avg * (params.safetyStock / 100));
  }, [data, params.safetyStock]);

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Brain className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <h2 className="font-mono text-sm font-semibold tracking-wide text-white">FORECAST SIMULATOR</h2>
            <p className="font-mono text-[10px] text-slate-500">18-Month Projection &middot; AI-Enhanced &middot; Real-Time</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="live-dot mr-1" />
          <span className="font-mono text-[10px] text-emerald-400">LIVE MODEL</span>
        </div>
      </div>

      {/* ── Scenario Presets ── */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(presetLabels) as PresetKey[]).map(key => (
          <button
            key={key}
            onClick={() => handlePreset(key)}
            className={cn(
              "rounded-md border px-3 py-1.5 font-mono text-[11px] font-medium transition-all duration-150",
              activePreset === key
                ? cn(presetColors[key], "shadow-lg")
                : "border-[#0f1a2e] bg-[#060a12] text-slate-500 hover:border-slate-700 hover:text-slate-300"
            )}
          >
            {presetLabels[key]}
          </button>
        ))}
      </div>

      {/* ── Parameter Sliders (4-col, 2 rows) ── */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-3 rounded-lg border border-[#0f1a2e] bg-[#060a12]/60 p-3 lg:grid-cols-4">
        {sliderConfigs.map(s => {
          const value = params[s.key];
          const pct = s.max === s.min ? 0 : ((value - s.min) / (s.max - s.min)) * 100;
          return (
            <div key={s.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{s.label}</span>
                <span className="font-mono text-xs font-semibold text-white">
                  {s.key === "demandMult" ? value.toFixed(1) : value}{s.unit}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={value}
                onChange={e => handleSlider(s.key, Number(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#1e293b] [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                style={{
                  background: `linear-gradient(to right, ${s.color} 0%, ${s.color} ${pct}%, #1e293b ${pct}%, #1e293b 100%)`,
                  "--thumb-color": s.color,
                } as CSSProperties & Record<string, string>}
              />
            </div>
          );
        })}
      </div>

      {/* ── Main Forecast Chart ── */}
      <div className="rounded-lg border border-[#0f1a2e] bg-[#060a12]/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
              <span className="font-mono text-[10px] text-slate-500">Demand</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-[10px] text-slate-500">Supply</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="14" height="2"><line x1="0" y1="1" x2="14" y2="1" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3 2" /></svg>
              <span className="font-mono text-[10px] text-slate-500">AI Forecast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-4 rounded-sm bg-purple-500/20" />
              <span className="font-mono text-[10px] text-slate-500">90% CI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-4 rounded-sm bg-purple-500/30" />
              <span className="font-mono text-[10px] text-slate-500">50% CI</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-slate-600">
            Safety Stock: {safetyStockLevel.toLocaleString()} head
          </span>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data} margin={{ top: 10, right: 16, bottom: 4, left: 0 }}>
            <defs>
              <linearGradient id="conf90Fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="conf50Fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#0f1a2e" strokeDasharray="2 4" strokeOpacity={0.5} />

            <XAxis
              dataKey="month"
              tick={{ fill: "#475569", fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
              tickLine={false}
              axisLine={{ stroke: "#0f1a2e" }}
              interval={1}
            />
            <YAxis
              tick={{ fill: "#475569", fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
              tickLine={false}
              axisLine={{ stroke: "#0f1a2e" }}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
              width={40}
            />
            <Tooltip content={<ChartTooltip />} />

            {/* Seasonal event reference areas */}
            {SEASONAL_EVENTS.map((event, idx) => (
              <ReferenceArea
                key={idx}
                x1={MONTHS_18[event.start]}
                x2={MONTHS_18[event.end]}
                fill={event.label === "Ramadan" ? "#3b82f6" : event.label === "Hajj" ? "#f59e0b" : "#ef4444"}
                fillOpacity={0.04}
                label={{
                  value: event.label,
                  position: "insideTopLeft",
                  fill: "#475569",
                  fontSize: 9,
                  fontFamily: "JetBrains Mono, monospace",
                }}
              />
            ))}

            {/* Safety stock threshold */}
            <ReferenceLine
              y={safetyStockLevel}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
              label={{
                value: "Safety Stock",
                position: "right",
                fill: "#ef4444",
                fontSize: 9,
                fontFamily: "JetBrains Mono, monospace",
              }}
            />

            {/* 90% confidence band */}
            <Area
              type="monotone"
              dataKey="conf90High"
              stroke="none"
              fill="url(#conf90Fill)"
              name="conf90High"
              legendType="none"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="conf90Low"
              stroke="none"
              fill="#060a12"
              fillOpacity={1}
              name="conf90Low"
              legendType="none"
              isAnimationActive={false}
            />

            {/* 50% confidence band */}
            <Area
              type="monotone"
              dataKey="conf50High"
              stroke="none"
              fill="url(#conf50Fill)"
              name="conf50High"
              legendType="none"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="conf50Low"
              stroke="none"
              fill="#060a12"
              fillOpacity={1}
              name="conf50Low"
              legendType="none"
              isAnimationActive={false}
            />

            {/* Data lines */}
            <Line
              type="monotone"
              dataKey="demand"
              name="Demand"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="supply"
              name="Supply"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="aiForecast"
              name="AI Forecast"
              stroke="#a78bfa"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* ── AI Analysis Panel (3 columns) ── */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Column 1: Key Metrics */}
        <div className="rounded-lg border border-[#0f1a2e] bg-[#060a12]/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Key Metrics</span>
          </div>
          <div className="space-y-3">
            <MetricRow
              label={metrics.deficit > 0 ? "Projected Deficit" : "Projected Surplus"}
              value={`${Math.abs(metrics.deficit).toLocaleString()} head`}
              color={metrics.deficit > 0 ? "text-red-400" : "text-emerald-400"}
              icon={metrics.deficit > 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
            />
            <MetricRow
              label="Cost Impact"
              value={`$${Math.abs(metrics.costImpact).toLocaleString()}`}
              color={metrics.costImpact > 0 ? "text-red-400" : "text-emerald-400"}
              icon={<Target className="h-3 w-3" />}
            />
            <MetricRow
              label="Revenue Impact"
              value={`$${Math.abs(metrics.revenueImpact).toLocaleString()}`}
              color={metrics.revenueImpact < 0 ? "text-red-400" : "text-emerald-400"}
              icon={<Activity className="h-3 w-3" />}
            />
            <MetricRow
              label="Supply Utilization"
              value={`${metrics.utilization}%`}
              color={metrics.utilization > 90 ? "text-emerald-400" : metrics.utilization > 70 ? "text-amber-400" : "text-red-400"}
              icon={<Zap className="h-3 w-3" />}
            />
            <MetricRow
              label="Break-even Point"
              value={metrics.breakEvenMonth}
              color="text-slate-300"
              icon={<Target className="h-3 w-3" />}
            />
          </div>
        </div>

        {/* Column 2: AI Recommendations */}
        <div className="rounded-lg border border-[#0f1a2e] bg-[#060a12]/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Brain className="h-3.5 w-3.5 text-purple-400" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">AI Recommendations</span>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="rounded-md border border-[#0f1a2e] bg-[#0a0f1c]/80 p-2.5">
                <div className="mb-1 flex items-center gap-2">
                  <span className={cn(
                    "rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider",
                    rec.priority === "critical" ? "bg-red-500/15 text-red-400" :
                    rec.priority === "high" ? "bg-amber-500/15 text-amber-400" :
                    "bg-blue-500/15 text-blue-400"
                  )}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">{rec.text}</p>
                <p className="mt-1 font-mono text-[10px] text-slate-500">Impact: {rec.impact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Risk Assessment */}
        <div className="rounded-lg border border-[#0f1a2e] bg-[#060a12]/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Risk Assessment</span>
          </div>
          <div className="space-y-3">
            {risks.map((risk, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">{risk.label}</span>
                  <div className="flex items-center gap-1.5">
                    {risk.trend === "up" && <ArrowUpRight className="h-3 w-3 text-red-400" />}
                    {risk.trend === "down" && <ArrowDownRight className="h-3 w-3 text-emerald-400" />}
                    {risk.trend === "flat" && <Minus className="h-3 w-3 text-slate-500" />}
                    <span className={cn(
                      "font-mono text-xs font-bold",
                      risk.score > 60 ? "text-red-400" : risk.score > 35 ? "text-amber-400" : "text-emerald-400"
                    )}>
                      {risk.score}
                    </span>
                  </div>
                </div>
                {/* Score bar */}
                <div className="h-1 w-full overflow-hidden rounded-full bg-[#1e293b]">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      risk.score > 60 ? "bg-red-500" : risk.score > 35 ? "bg-amber-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${risk.score}%` }}
                  />
                </div>
                <p className="font-mono text-[10px] text-slate-600">{risk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sensitivity Table ── */}
      <div className="rounded-lg border border-[#0f1a2e] bg-[#060a12]/60 p-4">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sensitivity Analysis</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0f1a2e]">
                {["Parameter", "Current", "Best Case \u0394", "Worst Case \u0394", "Sensitivity"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sensitivity.map((row, i) => (
                <tr key={i} className="border-b border-[#0f1a2e]/50 last:border-0">
                  <td className="px-3 py-2 text-[11px] text-slate-300">{row.param}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-400">{row.current}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-emerald-400">{row.bestCase}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-red-400">{row.worstCase}</td>
                  <td className="px-3 py-2">
                    <span className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase",
                      row.sensitivity === "high" ? "bg-red-500/15 text-red-400" :
                      row.sensitivity === "med" ? "bg-amber-500/15 text-amber-400" :
                      "bg-slate-500/15 text-slate-400"
                    )}>
                      {row.sensitivity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function MetricRow({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-[#0f1a2e]/50 bg-[#0a0f1c]/60 px-3 py-2">
      <div className="flex items-center gap-2">
        <span className={cn("text-slate-500", color)}>{icon}</span>
        <span className="font-mono text-[10px] text-slate-500">{label}</span>
      </div>
      <span className={cn("font-mono text-xs font-semibold", color)}>{value}</span>
    </div>
  );
}
