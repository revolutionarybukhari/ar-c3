import { Brain, Zap, Route, TrendingUp, Shield, Clock, Package, RefreshCw, ArrowDownUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types & mock data
// ---------------------------------------------------------------------------

type ActionType = "REROUTE" | "ACCELERATE" | "HEDGE" | "DEFER" | "STOCKPILE" | "SUBSTITUTE";
type Priority = "critical" | "high" | "medium";
type Status = "pending" | "executing" | "completed";

interface RebalancingAction {
  id: string;
  type: ActionType;
  description: string;
  impact: string;
  priority: Priority;
  status: Status;
  confidence: number;
}

const actions: RebalancingAction[] = [
  {
    id: "a1",
    type: "REROUTE",
    description: "Redirect 1,200 head from Lahore corridor to Garut Highland via sea freight — bypasses flood-damaged inland routes",
    impact: "+1,200 head recovered",
    priority: "critical",
    status: "executing",
    confidence: 94,
  },
  {
    id: "a2",
    type: "ACCELERATE",
    description: "Fast-track Bogor Valley shipment by 3 days to cover Jakarta Eid demand spike before competitor lock-in",
    impact: "+$42K revenue captured",
    priority: "critical",
    status: "executing",
    confidence: 91,
  },
  {
    id: "a3",
    type: "HEDGE",
    description: "Lock forward contracts on Australian feeder cattle at current AUD/IDR rate before projected 4% depreciation",
    impact: "$68K cost avoided",
    priority: "high",
    status: "pending",
    confidence: 87,
  },
  {
    id: "a4",
    type: "DEFER",
    description: "Delay Pakistan-Yemen corridor shipment 5 days — port congestion at Aden clears per weather model",
    impact: "$18K logistics saved",
    priority: "medium",
    status: "completed",
    confidence: 82,
  },
  {
    id: "a5",
    type: "STOCKPILE",
    description: "Pre-position 800 head at Semarang cold chain hub — demand forecast shows +22% surge in 14 days",
    impact: "+800 head buffered",
    priority: "high",
    status: "pending",
    confidence: 79,
  },
  {
    id: "a6",
    type: "SUBSTITUTE",
    description: "Switch 30% of East Java sheep allocation to Uganda goat supply — margin improvement +6.2pp at comparable quality",
    impact: "+$31K margin gain",
    priority: "medium",
    status: "pending",
    confidence: 76,
  },
];

// ---------------------------------------------------------------------------
// Action type styling
// ---------------------------------------------------------------------------

const actionTypeConfig: Record<ActionType, { icon: typeof Route; color: string; bg: string }> = {
  REROUTE: { icon: Route, color: "text-violet-400", bg: "bg-violet-500/15" },
  ACCELERATE: { icon: Zap, color: "text-amber-400", bg: "bg-amber-500/15" },
  HEDGE: { icon: Shield, color: "text-cyan-400", bg: "bg-cyan-500/15" },
  DEFER: { icon: Clock, color: "text-slate-400", bg: "bg-slate-500/15" },
  STOCKPILE: { icon: Package, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  SUBSTITUTE: { icon: ArrowDownUp, color: "text-blue-400", bg: "bg-blue-500/15" },
};

const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  critical: { label: "CRITICAL", color: "text-red-400", bg: "bg-red-500/10" },
  high: { label: "HIGH", color: "text-amber-400", bg: "bg-amber-500/10" },
  medium: { label: "MEDIUM", color: "text-slate-400", bg: "bg-slate-500/10" },
};

const statusConfig: Record<Status, { label: string; color: string; bg: string; icon: typeof RefreshCw }> = {
  pending: { label: "PENDING", color: "text-slate-400", bg: "bg-slate-500/10", icon: Clock },
  executing: { label: "EXECUTING", color: "text-violet-400", bg: "bg-violet-500/10", icon: RefreshCw },
  completed: { label: "DONE", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 },
};

// ---------------------------------------------------------------------------
// Confidence bar color
// ---------------------------------------------------------------------------

function confColor(pct: number): string {
  if (pct >= 90) return "#a78bfa"; // violet-400
  if (pct >= 80) return "#818cf8"; // indigo-400
  return "#94a3b8"; // slate-400
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AISupplyBalancer() {
  const optimizationScore = 78;
  const totalSupply = 14_820;
  const totalDemand = 17_540;
  const gapPct = (((totalDemand - totalSupply) / totalDemand) * 100).toFixed(1);
  const aiConfidence = 89;

  // SVG donut gauge
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (optimizationScore / 100) * circumference;

  const executingCount = actions.filter(a => a.status === "executing").length;
  const completedCount = actions.filter(a => a.status === "completed").length;

  return (
    <div>
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="h-3.5 w-3.5 text-violet-400" />
            <div className="absolute inset-0 rounded-full bg-violet-500/30 blur-sm animate-pulse" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
            AI Supply Balancer
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_2px_rgba(139,92,246,0.5)]" />
          </span>
          <span className="text-[8px] font-bold tracking-wider text-violet-400 uppercase">
            AI Active
          </span>
        </div>
      </div>

      {/* ── Optimization gauge + summary ──────────────────────── */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[#0f1a2e]">
        {/* Animated donut */}
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Track */}
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#1a2236" strokeWidth="6" />
            {/* Glow filter */}
            <defs>
              <filter id="ai-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Progress arc */}
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke="#a78bfa"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              filter="url(#ai-glow)"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold tabular-nums text-violet-400">{optimizationScore}</span>
            <span className="text-[7px] font-bold tracking-wider text-violet-400/80">OPTIMIZING</span>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="flex-1 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            AI Optimization Score
          </span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
            <div>
              <span className="text-[8px] text-slate-500 uppercase tracking-wider">Supply</span>
              <p className="text-[14px] font-bold tabular-nums text-slate-200">{totalSupply.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[8px] text-slate-500 uppercase tracking-wider">Demand</span>
              <p className="text-[14px] font-bold tabular-nums text-slate-200">{totalDemand.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[8px] text-slate-500 uppercase tracking-wider">Gap</span>
              <p className="text-[14px] font-bold tabular-nums text-red-400">-{gapPct}%</p>
            </div>
            <div>
              <span className="text-[8px] text-slate-500 uppercase tracking-wider">AI Conf.</span>
              <p className="text-[14px] font-bold tabular-nums text-violet-400">{aiConfidence}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Rebalancing actions header ────────────────────────── */}
      <div className="px-4 pt-3 pb-1 border-b border-[#0f1a2e]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">
            Rebalancing Actions
          </span>
          <div className="flex items-center gap-2 text-[8px]">
            <span className="px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 font-bold">{executingCount} ACTIVE</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">{completedCount} DONE</span>
          </div>
        </div>
      </div>

      {/* ── Action list ──────────────────────────────────────── */}
      <div className="max-h-[320px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {actions.map(action => {
          const typeConf = actionTypeConfig[action.type];
          const TypeIcon = typeConf.icon;
          const priConf = priorityConfig[action.priority];
          const statConf = statusConfig[action.status];
          const StatIcon = statConf.icon;

          return (
            <div key={action.id} className="px-4 py-2.5 hover:bg-[#0a1020] transition-colors">
              {/* Row 1: type badge + priority + status */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider", typeConf.bg, typeConf.color)}>
                    <TypeIcon className="h-2.5 w-2.5" />
                    {action.type}
                  </span>
                  <span className={cn("px-1 py-0.5 rounded text-[8px] font-bold tracking-wider", priConf.bg, priConf.color)}>
                    {priConf.label}
                  </span>
                </div>
                <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider", statConf.bg, statConf.color)}>
                  <StatIcon className={cn("h-2.5 w-2.5", action.status === "executing" && "animate-spin")} />
                  {statConf.label}
                </span>
              </div>

              {/* Row 2: description */}
              <p className="text-[9px] text-slate-400 leading-relaxed mb-1.5">{action.description}</p>

              {/* Row 3: impact + confidence bar */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] font-semibold text-emerald-400 shrink-0">{action.impact}</span>
                <div className="flex items-center gap-1.5 flex-1 max-w-[120px]">
                  <div className="flex-1 h-1.5 bg-[#1a2236] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${action.confidence}%`,
                        backgroundColor: confColor(action.confidence),
                        boxShadow: `0 0 6px ${confColor(action.confidence)}40`,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                  <span className="text-[8px] font-bold tabular-nums" style={{ color: confColor(action.confidence) }}>
                    {action.confidence}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── AI Balancing Summary ──────────────────────────────── */}
      <div className="border-t border-[#0f1a2e] px-4 py-3">
        <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase mb-2 block">
          AI Balancing Summary
        </span>
        <div className="grid grid-cols-3 gap-3">
          {/* Routes Optimized */}
          <div className="rounded-lg bg-[#0c1425] border border-[#1a2236] px-3 py-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-violet-400" />
            </div>
            <p className="text-[14px] font-bold tabular-nums text-violet-400" style={{ textShadow: "0 0 8px rgba(139,92,246,0.4)" }}>
              14
            </p>
            <span className="text-[7px] font-bold tracking-wider text-slate-500 uppercase">Routes Optimized</span>
          </div>

          {/* Cost Saved */}
          <div className="rounded-lg bg-[#0c1425] border border-[#1a2236] px-3 py-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
            </div>
            <p className="text-[14px] font-bold tabular-nums text-emerald-400" style={{ textShadow: "0 0 8px rgba(16,185,129,0.4)" }}>
              $128K
            </p>
            <span className="text-[7px] font-bold tracking-wider text-slate-500 uppercase">Cost Saved (est)</span>
          </div>

          {/* Supply Gap Reduced */}
          <div className="rounded-lg bg-[#0c1425] border border-[#1a2236] px-3 py-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-cyan-400" />
            </div>
            <p className="text-[14px] font-bold tabular-nums text-cyan-400" style={{ textShadow: "0 0 8px rgba(6,182,212,0.4)" }}>
              -62%
            </p>
            <span className="text-[7px] font-bold tracking-wider text-slate-500 uppercase">Gap Reduced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
