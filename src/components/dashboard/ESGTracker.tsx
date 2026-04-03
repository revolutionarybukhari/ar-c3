import { Leaf, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface RouteESG {
  id: string;
  route: string;
  carbonPerHead: number;
  targetCarbon: number;
  waterUsage: number;
  animalWelfareScore: number;
  laborPracticeScore: number;
  certifications: string[];
  overallESG: number;
  trend: "improving" | "stable" | "declining";
}

interface ESGSummary {
  totalCarbon: number;
  avgWelfareScore: number;
  complianceRate: number;
  overallScore: number;
}

const routes: RouteESG[] = [
  { id: "r1", route: "Java \u2192 Jeddah (Sea)", carbonPerHead: 42, targetCarbon: 38, waterUsage: 320, animalWelfareScore: 78, laborPracticeScore: 82, certifications: ["ISO 14001", "GlobalGAP"], overallESG: 76, trend: "improving" },
  { id: "r2", route: "Pakistan \u2192 UAE (Sea)", carbonPerHead: 35, targetCarbon: 38, waterUsage: 280, animalWelfareScore: 65, laborPracticeScore: 58, certifications: ["GlobalGAP"], overallESG: 62, trend: "stable" },
  { id: "r3", route: "Queensland \u2192 Jakarta (Sea)", carbonPerHead: 55, targetCarbon: 45, waterUsage: 410, animalWelfareScore: 88, laborPracticeScore: 91, certifications: ["ISO 14001", "GlobalGAP", "RSPO"], overallESG: 85, trend: "improving" },
  { id: "r4", route: "Sindh \u2192 Oman (Road+Sea)", carbonPerHead: 48, targetCarbon: 42, waterUsage: 350, animalWelfareScore: 55, laborPracticeScore: 52, certifications: [], overallESG: 48, trend: "declining" },
  { id: "r5", route: "East Java \u2192 Dammam (Sea)", carbonPerHead: 39, targetCarbon: 38, waterUsage: 290, animalWelfareScore: 72, laborPracticeScore: 75, certifications: ["ISO 14001"], overallESG: 71, trend: "stable" },
  { id: "r6", route: "Lahore \u2192 Bahrain (Air)", carbonPerHead: 85, targetCarbon: 60, waterUsage: 180, animalWelfareScore: 81, laborPracticeScore: 79, certifications: ["GlobalGAP", "RSPO"], overallESG: 68, trend: "declining" },
];

const summary: ESGSummary = {
  totalCarbon: 284,
  avgWelfareScore: 73,
  complianceRate: 91,
  overallScore: 68,
};

const trendConfig: Record<string, { icon: typeof TrendingUp; label: string; color: string }> = {
  improving: { icon: TrendingUp, label: "IMPROVING", color: "text-emerald-400" },
  stable: { icon: Minus, label: "STABLE", color: "text-slate-400" },
  declining: { icon: TrendingDown, label: "DECLINING", color: "text-red-400" },
};

function esgColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function esgBarColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function carbonColor(actual: number, target: number): string {
  return actual <= target ? "text-emerald-400" : "text-red-400";
}

function carbonBarColor(actual: number, target: number): string {
  return actual <= target ? "bg-emerald-500" : "bg-red-500";
}

export default function ESGTracker(): ReactNode {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <Leaf className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">ESG & Sustainability</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[8px] font-bold tracking-wider text-emerald-400 uppercase">{routes.length} Routes</span>
        </div>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-4 gap-px bg-[#0f1a2e] border-b border-[#0f1a2e]">
        <div className="bg-[#0a0f1c] px-3 py-2.5 text-center">
          <div className="text-[7px] font-bold tracking-wider text-slate-600 uppercase mb-1">Overall ESG</div>
          <div className={cn("text-xl font-bold font-mono leading-none", esgColor(summary.overallScore))}>
            {summary.overallScore}
          </div>
          <div className="text-[7px] text-slate-600 mt-0.5">/ 100</div>
        </div>
        <div className="bg-[#0a0f1c] px-3 py-2.5 text-center">
          <div className="text-[7px] font-bold tracking-wider text-slate-600 uppercase mb-1">Carbon</div>
          <div className="text-xl font-bold font-mono leading-none text-slate-200">
            {summary.totalCarbon}
          </div>
          <div className="text-[7px] text-slate-600 mt-0.5">t CO&sup2;e/mo</div>
        </div>
        <div className="bg-[#0a0f1c] px-3 py-2.5 text-center">
          <div className="text-[7px] font-bold tracking-wider text-slate-600 uppercase mb-1">Welfare</div>
          <div className={cn("text-xl font-bold font-mono leading-none", esgColor(summary.avgWelfareScore))}>
            {summary.avgWelfareScore}
          </div>
          <div className="text-[7px] text-slate-600 mt-0.5">avg score</div>
        </div>
        <div className="bg-[#0a0f1c] px-3 py-2.5 text-center">
          <div className="text-[7px] font-bold tracking-wider text-slate-600 uppercase mb-1">Compliance</div>
          <div className={cn("text-xl font-bold font-mono leading-none", esgColor(summary.complianceRate))}>
            {summary.complianceRate}%
          </div>
          <div className="text-[7px] text-slate-600 mt-0.5">rate</div>
        </div>
      </div>

      {/* Route List */}
      <div className="max-h-[320px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {routes.map(route => {
          const trend = trendConfig[route.trend];
          const TrendIcon = trend.icon;
          const carbonPct = Math.min((route.carbonPerHead / (route.targetCarbon * 1.5)) * 100, 100);
          const targetPct = Math.min((route.targetCarbon / (route.targetCarbon * 1.5)) * 100, 100);

          return (
            <div key={route.id} className="px-4 py-2.5 hover:bg-[#0a1020] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-200">{route.route}</span>
                <div className="flex items-center gap-1">
                  <TrendIcon className={cn("h-2.5 w-2.5", trend.color)} />
                  <span className={cn("text-[7px] font-bold tracking-wider", trend.color)}>{trend.label}</span>
                </div>
              </div>

              {/* Carbon row */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[7px] font-bold tracking-wider text-slate-600 uppercase">Carbon per head</span>
                  <div className="flex items-center gap-2 text-[8px]">
                    <span className={cn("font-bold font-mono", carbonColor(route.carbonPerHead, route.targetCarbon))}>
                      {route.carbonPerHead}
                    </span>
                    <span className="text-slate-700">/</span>
                    <span className="text-slate-500 font-mono">{route.targetCarbon}</span>
                    <span className="text-slate-700">kg CO&sup2;e</span>
                  </div>
                </div>
                <div className="relative w-full h-1.5 bg-[#0f1a2e] rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", carbonBarColor(route.carbonPerHead, route.targetCarbon))}
                    style={{ width: `${carbonPct}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-px bg-slate-500"
                    style={{ left: `${targetPct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-2">
                {/* Animal welfare */}
                <div className="flex items-center gap-2">
                  <span className="text-[7px] text-slate-600 uppercase">Welfare</span>
                  <span className={cn("text-[10px] font-bold font-mono", esgColor(route.animalWelfareScore))}>
                    {route.animalWelfareScore}
                  </span>
                  <div className="w-10 h-1 bg-[#0f1a2e] rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", esgBarColor(route.animalWelfareScore))} style={{ width: `${route.animalWelfareScore}%` }} />
                  </div>
                </div>

                {/* Water */}
                <div className="flex items-center gap-2">
                  <span className="text-[7px] text-slate-600 uppercase">Water</span>
                  <span className="text-[9px] font-mono text-slate-400">{route.waterUsage}L/hd</span>
                </div>

                {/* Labor */}
                <div className="flex items-center gap-2">
                  <span className="text-[7px] text-slate-600 uppercase">Labor</span>
                  <span className={cn("text-[9px] font-bold font-mono", esgColor(route.laborPracticeScore))}>
                    {route.laborPracticeScore}
                  </span>
                </div>

                {/* Overall ESG */}
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-[7px] text-slate-600">ESG</span>
                  <span className={cn("text-[11px] font-bold font-mono", esgColor(route.overallESG))}>
                    {route.overallESG}
                  </span>
                </div>
              </div>

              {/* Certifications */}
              {route.certifications.length > 0 ? (
                <div className="flex items-center gap-1">
                  {route.certifications.map(cert => (
                    <span
                      key={cert}
                      className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-[7px] font-bold tracking-wider text-emerald-500"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[7px] text-red-400/60 font-bold tracking-wider">NO CERTIFICATIONS</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
