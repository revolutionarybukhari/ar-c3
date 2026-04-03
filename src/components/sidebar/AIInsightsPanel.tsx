import { useState } from "react";
import { Brain, Sparkles, RefreshCw, ChevronRight } from "lucide-react";
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
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-1.5">
          <Brain className="h-3 w-3 text-purple-400" />
          <span className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase">AI Insights</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-slate-600 hover:text-slate-400 transition-colors">
            <RefreshCw className="h-3 w-3" />
          </button>
          <div className="flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 text-purple-400" />
            <span className="text-[8px] font-bold tracking-wider text-purple-400 uppercase">AI</span>
          </div>
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
                <span className="ml-auto text-[8px] font-bold text-slate-500">{insight.confidence}%</span>
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
