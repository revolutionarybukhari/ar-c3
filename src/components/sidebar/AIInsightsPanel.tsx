import { useState } from "react";
import { Brain, Sparkles, RefreshCw, ChevronRight, Activity, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  type: "brief" | "signal" | "forecast" | "recommendation";
  title: string;
  content: string;
  confidence: number;
  timestamp: string;
}

const insights: Insight[] = [
  {
    id: "i1",
    type: "brief",
    title: "DAILY LIVESTOCK BRIEF",
    content: "Global livestock supply chain under moderate stress. Pakistan flood disruption reducing live animal imports to Indonesia by est. 35-40%. Compensatory sourcing from Uganda and East Africa partially offsetting shortfall. Eid al-Adha demand surge projected to begin in 6 weeks — recommend accelerating procurement now.",
    confidence: 92,
    timestamp: "Updated 5m ago",
  },
  {
    id: "i2",
    type: "signal",
    title: "CROSS-SIGNAL DETECTION",
    content: "Correlation detected: Rising corn futures (+12%) + drought advisory in Australia → feed cost pressure likely to cascade to Indonesian farms within 2-3 weeks. Historical pattern match: 78% similarity to Q3 2024 feed crisis.",
    confidence: 78,
    timestamp: "15m ago",
  },
  {
    id: "i3",
    type: "forecast",
    title: "PRICE FORECAST",
    content: "Jakarta wholesale sheep price projected to rise 8-12% over next 14 days driven by pre-Eid demand acceleration and constrained Pakistan supply. GCC goat prices stable with adequate UAE reserve stock.",
    confidence: 85,
    timestamp: "1h ago",
  },
  {
    id: "i4",
    type: "recommendation",
    title: "ACTION RECOMMENDATION",
    content: "Activate Uganda backup supply corridor (Mbarara → Surabaya). Current Uganda capacity utilization at 62% — headroom for 500 hd/day increase. Estimated cost delta: +$2.30/hd vs Pakistan route, but 99.2% delivery reliability vs 67% current Pakistan reliability.",
    confidence: 88,
    timestamp: "2h ago",
  },
  {
    id: "i5",
    type: "recommendation",
    title: "SUPPLY CHAIN OPTIMIZATION",
    content: "AI detected optimal rerouting through Mombasa corridor to avoid Pakistan flood disruption. Rerouting via Mombasa–Dar es Salaam–Surabaya reduces transit risk by 62% and saves estimated $180k/month in spoilage and delay penalties. Recommend immediate activation.",
    confidence: 91,
    timestamp: "30m ago",
  },
  {
    id: "i6",
    type: "signal",
    title: "DEMAND ANOMALY DETECTED",
    content: "Unusual pre-Eid buying patterns detected in Jakarta markets suggesting demand surge 2 weeks earlier than historical average. Social media sentiment analysis and wholesale order velocity both confirm accelerated procurement cycle. Recommend front-loading inventory.",
    confidence: 83,
    timestamp: "45m ago",
  },
];

const typeConfig = {
  brief: { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-l-cyan-500" },
  signal: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-l-amber-500" },
  forecast: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-l-blue-500" },
  recommendation: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-l-emerald-500" },
};

export default function AIInsightsPanel() {
  const [expandedId, setExpandedId] = useState<string>("i1");

  return (
    <div>
      {/* Header */}
      <div className="relative flex items-center justify-between px-3 py-2.5 border-b border-[#0f1a2e] bg-gradient-to-r from-purple-950/30 via-[#060d1b] to-violet-950/20">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-md animate-pulse" />
            <Brain className="relative h-4 w-4 text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]" />
          </div>
          <span className="text-[10px] font-black tracking-[0.2em] text-purple-300 uppercase drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
            AI Command Intelligence
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-slate-600 hover:text-purple-400 transition-colors">
            <RefreshCw className="h-3 w-3" />
          </button>
          <div className="relative flex items-center gap-1 px-1.5 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/10">
            <div className="absolute inset-0 rounded-full bg-purple-500/5 animate-pulse" />
            <Sparkles className="relative h-2.5 w-2.5 text-purple-400 animate-pulse" />
            <span className="relative text-[7px] font-black tracking-widest text-purple-300 uppercase">Powered by AI</span>
          </div>
        </div>
      </div>

      {/* AI Engine Status Bar */}
      <div className="flex items-center gap-3 px-3 py-1.5 border-b border-[#0f1a2e] bg-gradient-to-r from-violet-950/20 to-purple-950/10">
        <div className="flex items-center gap-1.5">
          <Cpu className="h-2.5 w-2.5 text-purple-400/70" />
          <span className="text-[8px] font-bold tracking-wider text-purple-400/80">Models Active:</span>
          <span className="text-[8px] font-black text-purple-300">4</span>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.7)]" />
        </div>
        <div className="flex items-center gap-1">
          <Activity className="h-2.5 w-2.5 text-purple-400/50" />
          <span className="text-[7px] text-slate-500">Last inference: <span className="text-purple-400/80 font-bold">2m ago</span></span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-[7px] text-slate-500">Accuracy:</span>
          <span className="text-[8px] font-black text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]">94.2%</span>
        </div>
      </div>

      {/* Insights */}
      <div className="max-h-[350px] overflow-y-auto">
        {insights.map(insight => {
          const config = typeConfig[insight.type];
          const isExpanded = expandedId === insight.id;
          return (
            <div
              key={insight.id}
              onClick={() => setExpandedId(isExpanded ? "" : insight.id)}
              className={cn(
                "px-3 py-2 border-b border-[#0a1020] cursor-pointer transition-colors hover:bg-[#0a1020]",
                "border-l-2",
                config.border
              )}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={cn("px-1 py-px rounded text-[7px] font-bold tracking-wider", config.bg, config.color)}>
                  {insight.type.toUpperCase()}
                </span>
                <span className="text-[8px] text-slate-700">{insight.timestamp}</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="text-[8px] font-bold text-slate-500">{insight.confidence}%</span>
                  <div className="w-10 h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        insight.confidence >= 90 ? "bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]" :
                        insight.confidence >= 80 ? "bg-purple-400 shadow-[0_0_4px_rgba(168,85,247,0.5)]" :
                        "bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.5)]"
                      )}
                      style={{ width: `${insight.confidence}%` }}
                    />
                  </div>
                </div>
                <ChevronRight className={cn("h-2.5 w-2.5 text-slate-600 transition-transform", isExpanded && "rotate-90")} />
              </div>
              <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase mb-0.5">{insight.title}</p>
              <p className={cn(
                "text-[10px] text-slate-500 leading-relaxed transition-all",
                isExpanded ? "line-clamp-none" : "line-clamp-2"
              )}>
                {insight.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
