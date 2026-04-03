"use client";

import { cn } from "@/lib/utils";
import {
  Brain,
  AlertTriangle,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Radar,
  Activity,
  Zap,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

/* ─── Mock Data ─────────────────────────────────────────────────────── */

type Trend = "up" | "down" | "stable";
type Horizon = "7d" | "30d" | "90d";
type Severity = "CRITICAL" | "HIGH" | "MODERATE";

interface RiskCategory {
  name: string;
  probability: number;
  trend: Trend;
  horizon: Horizon;
  confidence: number;
  icon: typeof AlertTriangle;
}

interface WarningSignal {
  severity: Severity;
  description: string;
  detectedBy: string;
  action: string;
  timestamp: string;
}

const riskCategories: RiskCategory[] = [
  {
    name: "Disease Outbreak",
    probability: 73,
    trend: "up",
    horizon: "7d",
    confidence: 91,
    icon: AlertTriangle,
  },
  {
    name: "Supply Disruption",
    probability: 58,
    trend: "up",
    horizon: "30d",
    confidence: 84,
    icon: Zap,
  },
  {
    name: "Price Spike",
    probability: 41,
    trend: "stable",
    horizon: "30d",
    confidence: 78,
    icon: BarChart3,
  },
  {
    name: "Regulatory Change",
    probability: 26,
    trend: "down",
    horizon: "90d",
    confidence: 65,
    icon: Shield,
  },
  {
    name: "Climate Event",
    probability: 62,
    trend: "up",
    horizon: "7d",
    confidence: 87,
    icon: Activity,
  },
];

const warningSignals: WarningSignal[] = [
  {
    severity: "CRITICAL",
    description:
      "Abnormal mortality clustering detected across 3 eastern-region farms — matches H5N1 signature pattern from 2024 dataset.",
    detectedBy: "Pattern matching",
    action: "Initiate biosecurity protocol L3; isolate affected batches immediately.",
    timestamp: "12m ago",
  },
  {
    severity: "HIGH",
    description:
      "Soybean meal futures diverging +18% from 90-day moving avg. Supplier lead times extending by 4.2 days.",
    detectedBy: "Anomaly detection",
    action: "Pre-purchase 30-day buffer stock; activate secondary supplier contracts.",
    timestamp: "1h ago",
  },
  {
    severity: "MODERATE",
    description:
      "Negative sentiment surge in USDA regulatory filings — 3 draft rules flagged on antibiotic usage thresholds.",
    detectedBy: "NLP sentiment",
    action: "Brief compliance team; schedule audit of current antibiotic protocols.",
    timestamp: "3h ago",
  },
  {
    severity: "HIGH",
    description:
      "Simultaneous feed-conversion drop and water-intake spike correlated across 7 sites — early heat-stress indicator.",
    detectedBy: "Cross-correlation",
    action: "Deploy cooling systems; adjust feeding schedules to night cycles.",
    timestamp: "45m ago",
  },
];

const accuracyStats = {
  accuracy: 94.2,
  alertsValidated: 187,
  falsePositiveRate: 3.1,
};

/* ─── Helpers ───────────────────────────────────────────────────────── */

function probabilityColor(p: number): string {
  if (p >= 70) return "#ef4444";
  if (p >= 50) return "#f59e0b";
  if (p >= 30) return "#a78bfa";
  return "#22c55e";
}

function probabilityBarBg(p: number): string {
  if (p >= 70) return "bg-red-500/20";
  if (p >= 50) return "bg-amber-500/20";
  if (p >= 30) return "bg-violet-500/20";
  return "bg-emerald-500/20";
}

function probabilityBarFill(p: number): string {
  if (p >= 70) return "bg-red-500";
  if (p >= 50) return "bg-amber-500";
  if (p >= 30) return "bg-violet-500";
  return "bg-emerald-500";
}

const trendIcon: Record<Trend, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColor: Record<Trend, string> = {
  up: "text-red-400",
  down: "text-emerald-400",
  stable: "text-slate-400",
};

const severityBadge: Record<Severity, string> = {
  CRITICAL: "bg-red-500/15 text-red-400 border-red-500/30",
  HIGH: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  MODERATE: "bg-violet-500/15 text-violet-300 border-violet-500/30",
};

const detectorIcons: Record<string, typeof Eye> = {
  "Pattern matching": Eye,
  "Anomaly detection": Radar,
  "NLP sentiment": Brain,
  "Cross-correlation": Activity,
};

/* ─── Component ─────────────────────────────────────────────────────── */

export default function AIRiskPredictor() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-[#0f1a2e] bg-[#060d1b]">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[#0f1a2e] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15">
            <Brain className="h-4 w-4 text-violet-400" />
          </div>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-200">
            AI Risk Predictor
          </h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-violet-300">
            Predicting
          </span>
        </div>
      </div>

      {/* ── Threat Probability Matrix ────────────────────────────── */}
      <div className="border-b border-[#0f1a2e] px-4 py-3">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Threat Probability Matrix
        </p>

        <div className="space-y-2.5">
          {riskCategories.map((risk) => {
            const TrendIcon = trendIcon[risk.trend];
            const RiskIcon = risk.icon;
            return (
              <div
                key={risk.name}
                className="group rounded-lg border border-[#0f1a2e] bg-[#080e1e] px-3 py-2 transition-colors hover:bg-[#0a1020]"
              >
                {/* Row 1: name + meta */}
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RiskIcon
                      className="h-3 w-3"
                      style={{ color: probabilityColor(risk.probability) }}
                    />
                    <span className="text-[10px] font-medium text-slate-300">
                      {risk.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <TrendIcon
                        className={cn("h-3 w-3", trendColor[risk.trend])}
                      />
                    </div>
                    <span className="rounded bg-slate-800/60 px-1.5 py-0.5 text-[8px] font-semibold tabular-nums text-slate-400">
                      {risk.horizon}
                    </span>
                    <span className="text-[8px] text-slate-500">
                      conf{" "}
                      <span className="font-semibold tabular-nums text-violet-400">
                        {risk.confidence}%
                      </span>
                    </span>
                  </div>
                </div>
                {/* Row 2: bar + percentage */}
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-1.5 flex-1 overflow-hidden rounded-full",
                      probabilityBarBg(risk.probability)
                    )}
                  >
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        probabilityBarFill(risk.probability)
                      )}
                      style={{ width: `${risk.probability}%` }}
                    />
                  </div>
                  <span
                    className="min-w-[28px] text-right text-[10px] font-bold tabular-nums"
                    style={{ color: probabilityColor(risk.probability) }}
                  >
                    {risk.probability}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AI Early Warning Signals ─────────────────────────────── */}
      <div className="flex-1 border-b border-[#0f1a2e] px-4 py-3">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          AI Early Warning Signals
        </p>

        <div className="divide-y divide-[#0f1a2e]">
          {warningSignals.map((signal, idx) => {
            const DetectorIcon =
              detectorIcons[signal.detectedBy] ?? Radar;
            return (
              <div
                key={idx}
                className="py-2.5 first:pt-0 last:pb-0"
              >
                {/* Severity + timestamp */}
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider",
                      severityBadge[signal.severity]
                    )}
                  >
                    {signal.severity}
                  </span>
                  <span className="text-[8px] tabular-nums text-slate-600">
                    {signal.timestamp}
                  </span>
                </div>
                {/* Description */}
                <p className="mb-1.5 text-[9px] leading-relaxed text-slate-400">
                  {signal.description}
                </p>
                {/* Detected by + action */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-1 shrink-0">
                    <DetectorIcon className="h-2.5 w-2.5 text-violet-500" />
                    <span className="text-[8px] text-violet-400">
                      {signal.detectedBy}
                    </span>
                  </div>
                  <p className="text-[8px] leading-snug text-emerald-400/80 text-right">
                    <span className="text-slate-600">Action: </span>
                    {signal.action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Prediction Accuracy ──────────────────────────────────── */}
      <div className="px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Prediction Accuracy
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-[#0f1a2e] bg-[#080e1e] px-3 py-2 text-center">
            <p className="text-[8px] uppercase text-slate-500">Last 30d</p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-emerald-400">
              {accuracyStats.accuracy}%
            </p>
          </div>
          <div className="rounded-lg border border-[#0f1a2e] bg-[#080e1e] px-3 py-2 text-center">
            <p className="text-[8px] uppercase text-slate-500">Validated</p>
            <div className="mt-0.5 flex items-center justify-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span className="text-sm font-bold tabular-nums text-slate-200">
                {accuracyStats.alertsValidated}
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-[#0f1a2e] bg-[#080e1e] px-3 py-2 text-center">
            <p className="text-[8px] uppercase text-slate-500">False +ve</p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-amber-400">
              {accuracyStats.falsePositiveRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
