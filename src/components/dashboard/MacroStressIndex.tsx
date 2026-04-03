import { Activity, Gauge, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Signal {
  id: string;
  name: string;
  value: number; // 0-100, higher = more stress
  status: "bullish" | "bearish" | "neutral";
  detail: string;
  trend: "up" | "down" | "stable";
  sparkline: number[];
}

const signals: Signal[] = [
  { id: "s1", name: "Feed Cost Pressure", value: 72, status: "bearish", detail: "Corn +12%, Soy +8% — feed margins compressed", trend: "up", sparkline: [40, 45, 48, 55, 60, 65, 68, 72] },
  { id: "s2", name: "Disease Prevalence", value: 65, status: "bearish", detail: "FMD active in East Java, 3 farms quarantined", trend: "up", sparkline: [30, 25, 35, 40, 55, 58, 62, 65] },
  { id: "s3", name: "Supply Pressure", value: 58, status: "bearish", detail: "Pakistan corridor at 58% capacity post-flood", trend: "up", sparkline: [35, 38, 42, 45, 48, 52, 55, 58] },
  { id: "s4", name: "Weather Impact", value: 45, status: "neutral", detail: "La Niña watch — moderate drought risk in AUS", trend: "stable", sparkline: [40, 42, 38, 44, 46, 43, 44, 45] },
  { id: "s5", name: "Market Volatility", value: 52, status: "neutral", detail: "Jakarta sheep price vol 18% above 30d average", trend: "up", sparkline: [35, 40, 38, 42, 45, 48, 50, 52] },
  { id: "s6", name: "Logistics Strain", value: 61, status: "bearish", detail: "Port congestion Tanjung Priok, cold chain costs +22%", trend: "up", sparkline: [38, 42, 45, 48, 52, 55, 58, 61] },
  { id: "s7", name: "Labor & Staffing", value: 28, status: "bullish", detail: "Adequate vet coverage, farm staffing at 89% avg", trend: "down", sparkline: [45, 42, 40, 38, 35, 32, 30, 28] },
];

function getCompositeScore(sigs: Signal[]): number {
  return Math.round(sigs.reduce((sum, s) => sum + s.value, 0) / sigs.length);
}

function scoreColor(score: number): string {
  if (score >= 75) return "#ef4444";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#3b82f6";
  return "#22c55e";
}

function scoreLabel(score: number): string {
  if (score >= 75) return "CRITICAL";
  if (score >= 60) return "ELEVATED";
  if (score >= 40) return "MODERATE";
  return "LOW";
}

const statusConfig = {
  bullish: { label: "BULLISH", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  bearish: { label: "BEARISH", color: "text-red-400", bg: "bg-red-500/10" },
  neutral: { label: "NEUTRAL", color: "text-slate-400", bg: "bg-slate-500/10" },
};

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

export default function MacroStressIndex() {
  const composite = getCompositeScore(signals);
  const color = scoreColor(composite);
  const label = scoreLabel(composite);
  const bearishCount = signals.filter(s => s.status === "bearish").length;
  const bullishCount = signals.filter(s => s.status === "bullish").length;
  const neutralCount = signals.filter(s => s.status === "neutral").length;

  // SVG gauge parameters
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (composite / 100) * circumference;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <Gauge className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Macro Stress Index</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3 text-amber-400" />
          <span className="text-[8px] font-bold tracking-wider text-amber-400 uppercase">Monitoring</span>
        </div>
      </div>

      {/* Composite gauge + verdict */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[#0f1a2e]">
        {/* Donut gauge */}
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#1a2236" strokeWidth="6" />
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold tabular-nums" style={{ color }}>{composite}</span>
            <span className="text-[8px] font-bold tracking-wider" style={{ color }}>{label}</span>
          </div>
        </div>

        {/* Verdict */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Verdict</span>
          </div>
          <div className="flex gap-2 text-[9px]">
            <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">{bearishCount} BEARISH</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 font-bold">{neutralCount} NEUTRAL</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">{bullishCount} BULLISH</span>
          </div>
          <p className="text-[9px] text-slate-600 mt-1.5 leading-relaxed">
            Livestock sector under elevated stress. Feed costs and disease outbreaks driving composite higher. Supply chain disruption from Pakistan floods adding pressure.
          </p>
        </div>
      </div>

      {/* Signals */}
      <div className="max-h-[280px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {signals.map(sig => {
          const sc = statusConfig[sig.status];
          const TrendIcon = trendIcon[sig.trend];
          return (
            <div key={sig.id} className="px-4 py-2 hover:bg-[#0a1020] transition-colors">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-semibold text-slate-300">{sig.name}</span>
                <div className="flex items-center gap-2">
                  <span className={cn("px-1 py-0.5 rounded text-[8px] font-bold tracking-wider", sc.bg, sc.color)}>
                    {sc.label}
                  </span>
                  <TrendIcon className={cn("h-3 w-3", sig.trend === "up" ? "text-red-400" : sig.trend === "down" ? "text-emerald-400" : "text-slate-500")} />
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: scoreColor(sig.value) }}>
                    {sig.value}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[9px] text-slate-500 flex-1">{sig.detail}</p>
                {/* Mini sparkline */}
                <svg width="40" height="14" viewBox="0 0 40 14" className="shrink-0">
                  <polyline
                    fill="none"
                    stroke={scoreColor(sig.value)}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={sig.sparkline.map((v, i) => `${(i / (sig.sparkline.length - 1)) * 40},${14 - (v / 100) * 14}`).join(" ")}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
