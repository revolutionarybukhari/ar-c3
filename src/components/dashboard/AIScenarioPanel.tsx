"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AIScenario, AIRecommendation, HealthStatus } from "@/types";
import { aiScenarios } from "@/data/mockData";

const severityLabel: Record<HealthStatus, string> = {
  red: "HIGH",
  amber: "MED",
  green: "LOW",
};

const severityBorderColor: Record<HealthStatus, string> = {
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
};

const severityBadgeClass: Record<HealthStatus, string> = {
  red: "text-red-400 bg-red-500/10",
  amber: "text-amber-400 bg-amber-500/10",
  green: "text-emerald-400 bg-emerald-500/10",
};

const priorityDotColor: Record<AIRecommendation["priority"], string> = {
  high: "bg-red-400",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

function ScenarioCard({ scenario }: { scenario: AIScenario }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl border border-[#1e293b]/50 bg-[#0f1629]"
      style={{ borderLeftWidth: 2, borderLeftColor: severityBorderColor[scenario.severity] }}
    >
      <div
        className="flex cursor-pointer items-start justify-between gap-3 px-4 py-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white">{scenario.title}</h4>
            <span
              className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${severityBadgeClass[scenario.severity]}`}
            >
              {severityLabel[scenario.severity]}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
            {scenario.description}
          </p>
        </div>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: expanded ? 600 : 0 }}
      >
        <div className="border-t border-[#1e293b]/50 px-4 pb-4 pt-3">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-slate-500">
            Recommendations
          </p>
          <ul className="space-y-2">
            {scenario.recommendations.map((rec) => (
              <li key={rec.id} className="flex items-start gap-2">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${priorityDotColor[rec.priority]}`}
                />
                <div className="min-w-0">
                  <p className="text-xs text-slate-300">{rec.action}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{rec.rationale}</p>
                  {rec.estimatedSavings != null && (
                    <p className="mt-0.5 text-[11px] text-emerald-400">
                      Est. savings: ${rec.estimatedSavings.toLocaleString()}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <button
            className="mt-3 rounded-lg border border-[#1e293b] px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-300"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Simulate
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AIScenarioPanel() {
  return (
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-widest text-slate-500">
        Threat Scenarios
      </p>
      <div className="space-y-2">
        {aiScenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </div>
  );
}
