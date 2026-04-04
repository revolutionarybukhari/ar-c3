import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── mock data ─────────────────────────────────────────── */
const metrics = [
  {
    label: "Risk Score",
    value: "54",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    dotColor: "bg-amber-400",
  },
  {
    label: "Supply Gap",
    value: "-15.5%",
    color: "text-red-400",
    bg: "bg-red-500/15",
    dotColor: "bg-red-400",
  },
  {
    label: "Cost Savings",
    value: "$128K",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    dotColor: "bg-emerald-400",
  },
] as const;

const activeActions = 4;

/* ── component ─────────────────────────────────────────── */
export default function IntegratedOptSummary() {
  return (
    <div className="rounded-md border border-purple-500/20 bg-[#0a0a14] p-2.5 flex flex-col gap-2 h-full">
      {/* header */}
      <div className="flex items-center gap-1.5">
        <div className="rounded bg-purple-500/15 p-0.5">
          <Brain className="h-3 w-3 text-purple-400" />
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-purple-300">
          AI Optimization
        </span>
      </div>

      {/* metrics row */}
      <div className="grid grid-cols-3 gap-1.5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={cn(
              "rounded px-1.5 py-1 flex flex-col items-center gap-0.5",
              m.bg
            )}
          >
            <span className="text-[7px] uppercase tracking-wide text-slate-400">
              {m.label}
            </span>
            <div className="flex items-center gap-0.5">
              <span
                className={cn(
                  "text-[12px] font-bold leading-none tabular-nums",
                  m.color
                )}
              >
                {m.value}
              </span>
              <span className={cn("h-1.5 w-1.5 rounded-full", m.dotColor)} />
            </div>
          </div>
        ))}
      </div>

      {/* footer: active actions */}
      <div className="mt-auto flex items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-purple-500" />
        </span>
        <span className="text-[8px] text-slate-400 tabular-nums">
          <span className="text-purple-300 font-medium">{activeActions} AI actions</span>{" "}
          executing
        </span>
      </div>
    </div>
  );
}
