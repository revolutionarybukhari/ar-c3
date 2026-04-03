import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencyPair {
  id: string;
  pair: string;
  rate: number;
  change: number;
  changePct: number;
  favorable: boolean;
  sparkline: number[];
  impact: string;
}

const pairs: CurrencyPair[] = [
  { id: "c1", pair: "USD/IDR", rate: 16284, change: 82, changePct: 0.51, favorable: false, sparkline: [16150, 16180, 16160, 16210, 16195, 16240, 16260, 16284], impact: "IDR weakening raises local procurement costs; margin pressure on Indonesian ops" },
  { id: "c2", pair: "USD/AED", rate: 3.6725, change: 0.0002, changePct: 0.01, favorable: true, sparkline: [3.6720, 3.6722, 3.6718, 3.6725, 3.6723, 3.6724, 3.6726, 3.6725], impact: "AED peg stable — no FX impact on UAE corridor pricing" },
  { id: "c3", pair: "USD/PKR", rate: 281.45, change: -1.82, changePct: -0.64, favorable: true, sparkline: [283.50, 283.10, 282.80, 282.40, 282.00, 281.90, 281.60, 281.45], impact: "PKR strengthening reduces procurement costs from Pakistan suppliers" },
  { id: "c4", pair: "USD/UGX", rate: 3842, change: 28, changePct: 0.73, favorable: false, sparkline: [3790, 3800, 3810, 3815, 3820, 3830, 3838, 3842], impact: "UGX depreciation; Uganda cattle costs cheaper in USD terms" },
  { id: "c5", pair: "USD/YER", rate: 250.35, change: 0.85, changePct: 0.34, favorable: false, sparkline: [249.20, 249.40, 249.60, 249.80, 250.00, 250.10, 250.25, 250.35], impact: "YER slide continues — Yemen import affordability declining" },
  { id: "c6", pair: "USD/SGD", rate: 1.3482, change: -0.0038, changePct: -0.28, favorable: true, sparkline: [1.3520, 1.3515, 1.3510, 1.3500, 1.3498, 1.3490, 1.3485, 1.3482], impact: "SGD firming; Singapore hub operating costs marginal decrease" },
  { id: "c7", pair: "EUR/USD", rate: 1.0842, change: 0.0028, changePct: 0.26, favorable: true, sparkline: [1.0810, 1.0815, 1.0820, 1.0825, 1.0830, 1.0835, 1.0838, 1.0842], impact: "EUR strength benefits EU-sourced feed and equipment imports" },
  { id: "c8", pair: "AED/IDR", rate: 4434, change: 22, changePct: 0.50, favorable: false, sparkline: [4400, 4408, 4412, 4418, 4422, 4426, 4430, 4434], impact: "IDR weaker vs AED — UAE-to-Indonesia corridor costs rising" },
];

function Sparkline({ data, favorable }: { data: number[]; favorable: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 16;
  const w = 48;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${(i * step).toFixed(1)},${(h - ((v - min) / range) * h).toFixed(1)}`).join(" ");
  const color = favorable ? "#22c55e" : "#ef4444";
  return (
    <svg width={w} height={h} className="flex-shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

function formatRate(rate: number): string {
  if (rate >= 1000) return rate.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (rate >= 100) return rate.toFixed(2);
  return rate.toFixed(4);
}

function formatChange(change: number, rate: number): string {
  const prefix = change >= 0 ? "+" : "";
  if (Math.abs(rate) >= 1000) return prefix + change.toFixed(0);
  if (Math.abs(rate) >= 100) return prefix + change.toFixed(2);
  return prefix + change.toFixed(4);
}

export default function CurrencyMonitor() {
  const favorableCount = pairs.filter(p => p.favorable).length;
  const unfavorableCount = pairs.filter(p => !p.favorable).length;

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <Coins className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Currency Monitor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span className="text-[8px] font-bold tracking-wider text-cyan-400 uppercase">LIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-1.5 border-b border-[#0f1a2e] text-[8px]">
        <span className="text-emerald-400/80 font-bold">{favorableCount} Favorable</span>
        <span className="text-slate-800">|</span>
        <span className="text-red-400/80 font-bold">{unfavorableCount} Unfavorable</span>
        <span className="text-slate-700 ml-auto">24h change</span>
      </div>

      <div className="max-h-[340px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {pairs.map(p => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-2 hover:bg-[#0a1020] transition-colors">
            {/* Pair name */}
            <div className="w-[62px] flex-shrink-0">
              <span className="text-[10px] font-bold text-slate-200">{p.pair}</span>
            </div>

            {/* Rate */}
            <div className="w-[68px] flex-shrink-0 text-right">
              <span className="text-[11px] font-bold text-white tabular-nums">{formatRate(p.rate)}</span>
            </div>

            {/* Change */}
            <div className="w-[72px] flex-shrink-0 text-right">
              <span className={cn(
                "text-[9px] font-bold tabular-nums",
                p.favorable ? "text-emerald-400" : "text-red-400"
              )}>
                {formatChange(p.change, p.rate)} ({p.changePct >= 0 ? "+" : ""}{p.changePct.toFixed(2)}%)
              </span>
            </div>

            {/* Sparkline */}
            <Sparkline data={p.sparkline} favorable={p.favorable} />

            {/* Impact */}
            <p className="text-[8px] text-slate-600 leading-tight flex-1 min-w-0 truncate" title={p.impact}>
              {p.impact}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
