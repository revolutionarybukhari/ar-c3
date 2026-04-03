import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

interface Cohort {
  cohortId: string;
  farmName: string;
  sku: "sheep" | "goat" | "cattle";
  batchSize: number;
  stage: "newborn" | "growing" | "fattening" | "market-ready" | "breeding";
  avgWeight: number;
  targetWeight: number;
  weightProgress: number;
  avgAge: number;
  targetAge: number;
  feedConversion: number;
  mortality: number;
  daysToMarket: number;
  healthScore: number;
  weightCurve: number[];
}

const cohorts: Cohort[] = [
  { cohortId: "COH-3401", farmName: "Al Rashid Station", sku: "sheep", batchSize: 420, stage: "market-ready", avgWeight: 52, targetWeight: 55, weightProgress: 95, avgAge: 11, targetAge: 12, feedConversion: 4.8, mortality: 1.2, daysToMarket: 14, healthScore: 94, weightCurve: [5, 12, 20, 28, 35, 42, 48, 52] },
  { cohortId: "COH-3402", farmName: "Sindh Pastoral Hub", sku: "goat", batchSize: 680, stage: "fattening", avgWeight: 34, targetWeight: 45, weightProgress: 76, avgAge: 7, targetAge: 10, feedConversion: 5.2, mortality: 2.1, daysToMarket: 62, healthScore: 87, weightCurve: [3, 8, 14, 20, 25, 29, 32, 34] },
  { cohortId: "COH-3403", farmName: "Mbarara Feedlot", sku: "cattle", batchSize: 150, stage: "growing", avgWeight: 180, targetWeight: 450, weightProgress: 40, avgAge: 8, targetAge: 24, feedConversion: 6.8, mortality: 0.8, daysToMarket: 280, healthScore: 92, weightCurve: [42, 65, 90, 115, 135, 155, 170, 180] },
  { cohortId: "COH-3404", farmName: "East Java Ranch", sku: "cattle", batchSize: 90, stage: "fattening", avgWeight: 340, targetWeight: 480, weightProgress: 71, avgAge: 18, targetAge: 26, feedConversion: 7.1, mortality: 1.5, daysToMarket: 120, healthScore: 85, weightCurve: [45, 95, 150, 210, 260, 300, 325, 340] },
  { cohortId: "COH-3405", farmName: "Aden Livestock", sku: "sheep", batchSize: 550, stage: "growing", avgWeight: 22, targetWeight: 55, weightProgress: 40, avgAge: 4, targetAge: 12, feedConversion: 4.5, mortality: 3.2, daysToMarket: 185, healthScore: 78, weightCurve: [4, 7, 11, 14, 17, 19, 21, 22] },
  { cohortId: "COH-3406", farmName: "Bandung Highlands", sku: "goat", batchSize: 320, stage: "newborn", avgWeight: 4, targetWeight: 42, weightProgress: 10, avgAge: 1, targetAge: 10, feedConversion: 3.2, mortality: 4.5, daysToMarket: 250, healthScore: 72, weightCurve: [1.5, 2, 2.5, 3, 3.2, 3.5, 3.8, 4] },
  { cohortId: "COH-3407", farmName: "Al Rashid Station", sku: "sheep", batchSize: 200, stage: "breeding", avgWeight: 58, targetWeight: 60, weightProgress: 97, avgAge: 24, targetAge: 24, feedConversion: 5.5, mortality: 0.5, daysToMarket: 0, healthScore: 96, weightCurve: [5, 15, 28, 38, 46, 52, 56, 58] },
  { cohortId: "COH-3408", farmName: "Kampala Central", sku: "cattle", batchSize: 75, stage: "market-ready", avgWeight: 440, targetWeight: 450, weightProgress: 98, avgAge: 23, targetAge: 24, feedConversion: 6.5, mortality: 1.0, daysToMarket: 7, healthScore: 91, weightCurve: [44, 100, 165, 240, 310, 370, 415, 440] },
];

const stageConfig = {
  newborn: { label: "NEWBORN", color: "text-blue-400", bg: "bg-blue-500/15" },
  growing: { label: "GROWING", color: "text-cyan-400", bg: "bg-cyan-500/15" },
  fattening: { label: "FATTENING", color: "text-amber-400", bg: "bg-amber-500/15" },
  "market-ready": { label: "MKT READY", color: "text-emerald-400", bg: "bg-emerald-500/15" },
  breeding: { label: "BREEDING", color: "text-purple-400", bg: "bg-purple-500/15" },
};

const skuConfig = {
  sheep: { label: "SHEEP", color: "text-sky-400", bg: "bg-sky-500/10" },
  goat: { label: "GOAT", color: "text-orange-400", bg: "bg-orange-500/10" },
  cattle: { label: "CATTLE", color: "text-rose-400", bg: "bg-rose-500/10" },
};

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 20;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 2) - 1;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className={className} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function healthColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-amber-400";
  return "text-red-400";
}

export default function BreedingLifecycleTracker() {
  const stageCounts = cohorts.reduce<Record<string, number>>((acc, c) => {
    acc[c.stage] = (acc[c.stage] || 0) + c.batchSize;
    return acc;
  }, {});

  const totalHead = cohorts.reduce((s, c) => s + c.batchSize, 0);

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-3.5 w-3.5 text-rose-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Breeding & Lifecycle</span>
        </div>
        <span className="text-[8px] font-bold tracking-wider text-slate-500">{totalHead.toLocaleString()} HEAD</span>
      </div>

      <div className="flex items-center gap-1 px-4 py-2 border-b border-[#0f1a2e] flex-wrap">
        {Object.entries(stageConfig).map(([key, cfg]) => {
          const count = stageCounts[key] || 0;
          return (
            <span key={key} className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider", cfg.bg, cfg.color)}>
              {cfg.label} <span className="text-slate-500">{count}</span>
            </span>
          );
        })}
      </div>

      <div className="max-h-[400px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {cohorts.map(c => {
          const stage = stageConfig[c.stage];
          const sku = skuConfig[c.sku];
          return (
            <div key={c.cohortId} className="px-4 py-2.5 hover:bg-[#0a1020] transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-mono font-bold text-slate-300">{c.cohortId}</span>
                <span className="text-[8px] text-slate-600">{c.farmName}</span>
                <span className={cn("px-1 py-px rounded text-[7px] font-bold tracking-wider", sku.bg, sku.color)}>{sku.label}</span>
                <span className={cn("px-1 py-px rounded text-[7px] font-bold tracking-wider ml-auto", stage.bg, stage.color)}>{stage.label}</span>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[8px] text-slate-600 w-[52px]">Weight</span>
                    <div className="flex-1 h-1 rounded-full bg-[#0f1a2e] overflow-hidden max-w-[100px]">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          c.weightProgress >= 90 ? "bg-emerald-500" : c.weightProgress >= 60 ? "bg-cyan-500" : "bg-amber-500"
                        )}
                        style={{ width: `${c.weightProgress}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-mono text-slate-400 tabular-nums">{c.avgWeight}<span className="text-slate-600">/{c.targetWeight}kg</span></span>
                  </div>

                  <div className="flex items-center gap-3 text-[8px]">
                    {c.daysToMarket > 0 ? (
                      <span className="text-slate-500">
                        <span className={cn("font-mono tabular-nums", c.daysToMarket <= 30 ? "text-emerald-400" : "text-slate-400")}>{c.daysToMarket}d</span> to market
                      </span>
                    ) : (
                      <span className="text-purple-400 font-bold tracking-wider">BREEDER</span>
                    )}
                    <span className="text-slate-600">FCR <span className="font-mono text-slate-400">{c.feedConversion}</span></span>
                    <span className="text-slate-600">Mort <span className={cn("font-mono", c.mortality > 3 ? "text-red-400" : "text-slate-400")}>{c.mortality}%</span></span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-0.5">
                  <span className={cn("text-[10px] font-mono font-bold tabular-nums", healthColor(c.healthScore))}>{c.healthScore}</span>
                  <Sparkline data={c.weightCurve} className={cn("shrink-0", stage.color)} />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1 text-[8px] text-slate-600">
                <span>{c.batchSize} head</span>
                <span className="text-slate-700">|</span>
                <span>Age {c.avgAge}/{c.targetAge}mo</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
