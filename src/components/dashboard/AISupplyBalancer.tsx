import { Brain, ArrowRight, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalancingAction {
  id: string;
  type: "REROUTE" | "ACCELERATE" | "HEDGE" | "DEFER" | "STOCKPILE" | "SUBSTITUTE";
  description: string;
  impact: string;
  priority: "critical" | "high" | "medium";
  status: "pending" | "executing" | "completed";
  confidence: number;
}

const actions: BalancingAction[] = [
  { id: "ba1", type: "REROUTE", description: "Redirect 1,200 hd from Karachi → Mombasa corridor to bypass flood disruption", impact: "+1,200 hd recovered", priority: "critical", status: "executing", confidence: 94 },
  { id: "ba2", type: "ACCELERATE", description: "Fast-track Uganda pipeline — increase Mbarara dispatch from 300 to 800 hd/day", impact: "+500 hd/day throughput", priority: "critical", status: "executing", confidence: 91 },
  { id: "ba3", type: "HEDGE", description: "Lock in AUS cattle futures at current $3,800/TEU before projected 15% spike", impact: "~$285k cost avoidance", priority: "high", status: "pending", confidence: 87 },
  { id: "ba4", type: "STOCKPILE", description: "Pre-position 8,000 hd at Surabaya cold chain for Eid al-Adha demand surge", impact: "Fills 62% of Eid gap", priority: "high", status: "pending", confidence: 85 },
  { id: "ba5", type: "SUBSTITUTE", description: "Source Indian buffalo as partial substitute for Pakistan sheep shortfall in GCC", impact: "Covers 30% deficit", priority: "medium", status: "pending", confidence: 78 },
  { id: "ba6", type: "DEFER", description: "Delay non-critical NTT farm expansion procurement by 45 days to free working capital", impact: "$420k cash flow freed", priority: "medium", status: "completed", confidence: 92 },
];

const typeColors: Record<BalancingAction["type"], { bg: string; text: string }> = {
  REROUTE:    { bg: "bg-cyan-500/15",    text: "text-cyan-400" },
  ACCELERATE: { bg: "bg-amber-500/15",   text: "text-amber-400" },
  HEDGE:      { bg: "bg-blue-500/15",    text: "text-blue-400" },
  DEFER:      { bg: "bg-slate-500/15",   text: "text-slate-400" },
  STOCKPILE:  { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  SUBSTITUTE: { bg: "bg-purple-500/15",  text: "text-purple-400" },
};

const priorityColors: Record<BalancingAction["priority"], string> = {
  critical: "text-red-400",
  high: "text-amber-400",
  medium: "text-slate-400",
};

const statusConfig: Record<BalancingAction["status"], { icon: typeof Clock; color: string; label: string }> = {
  pending:   { icon: Clock,        color: "text-slate-500", label: "PENDING" },
  executing: { icon: Loader2,      color: "text-amber-400", label: "EXECUTING" },
  completed: { icon: CheckCircle2, color: "text-emerald-400", label: "DONE" },
};

export default function AISupplyBalancer() {
  const optimizationScore = 76;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (optimizationScore / 100) * circumference;
  const scoreColor = optimizationScore >= 80 ? "#22c55e" : optimizationScore >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="h-3.5 w-3.5 text-purple-400" />
            <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-sm animate-pulse" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">AI Supply Balancer</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
          <div className="h-1.5 w-1.5 rounded-full bg-purple-400 live-dot" />
          <span className="text-[8px] font-bold tracking-wider text-purple-400 uppercase">AI Active</span>
        </div>
      </div>

      {/* Score + Summary */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[#0f1a2e]">
        <div className="relative shrink-0">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r={radius} fill="none" stroke="#1a2236" strokeWidth="5" />
            <circle
              cx="45" cy="45" r={radius}
              fill="none" stroke={scoreColor} strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black tabular-nums" style={{ color: scoreColor }}>{optimizationScore}</span>
            <span className="text-[7px] font-bold tracking-wider text-purple-400 uppercase">Optimizing</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-2">
          {[
            { label: "Total Supply", value: "42,800 hd", color: "text-emerald-400" },
            { label: "Total Demand", value: "58,200 hd", color: "text-red-400" },
            { label: "Supply Gap", value: "-26.4%", color: "text-amber-400" },
            { label: "AI Confidence", value: "89%", color: "text-purple-400" },
          ].map(m => (
            <div key={m.label} className="text-center">
              <div className={cn("text-[12px] font-bold tabular-nums", m.color)}>{m.value}</div>
              <div className="text-[7px] text-slate-600 uppercase tracking-wider">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="max-h-[280px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {actions.map(a => {
          const tc = typeColors[a.type];
          const sc = statusConfig[a.status];
          const StatusIcon = sc.icon;
          return (
            <div key={a.id} className="px-4 py-2.5 hover:bg-[#0a1020] transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={cn("px-1.5 py-0.5 rounded text-[7px] font-bold tracking-wider", tc.bg, tc.text)}>
                    {a.type}
                  </span>
                  <span className={cn("text-[8px] font-bold uppercase tracking-wider", priorityColors[a.priority])}>
                    {a.priority}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <StatusIcon className={cn("h-2.5 w-2.5", sc.color, a.status === "executing" && "animate-spin")} />
                  <span className={cn("text-[7px] font-bold tracking-wider", sc.color)}>{sc.label}</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 leading-relaxed mb-1">{a.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <ArrowRight className="h-2 w-2 text-emerald-500" />
                  <span className="text-[8px] font-bold text-emerald-400">{a.impact}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-[30px] h-1 bg-[#1a2236] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-purple-400" style={{ width: `${a.confidence}%` }} />
                  </div>
                  <span className="text-[8px] font-bold tabular-nums text-purple-400">{a.confidence}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-around px-4 py-2.5 border-t border-[#0f1a2e] bg-purple-500/5">
        {[
          { label: "Routes Optimized", value: "4/6" },
          { label: "Est. Cost Saved", value: "$705k" },
          { label: "Gap Reduced", value: "-26% → -11%" },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="text-[10px] font-bold text-purple-300 tabular-nums">{s.value}</div>
            <div className="text-[7px] text-slate-600 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
