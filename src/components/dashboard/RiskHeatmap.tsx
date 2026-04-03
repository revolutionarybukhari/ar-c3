"use client";

import { useMemo } from "react";
import type { RiskCell } from "@/types";
import { riskMatrix } from "@/data/mockData";

function interpolateColor(score: number): string {
  // 0 = green, 50 = amber, 100 = red
  const t = Math.min(100, Math.max(0, score)) / 100;
  if (t <= 0.5) {
    // green to amber
    const s = t / 0.5;
    const r = Math.round(34 + (245 - 34) * s);
    const g = Math.round(197 + (158 - 197) * s);
    const b = Math.round(94 + (11 - 94) * s);
    return `rgb(${r}, ${g}, ${b})`;
  }
  // amber to red
  const s = (t - 0.5) / 0.5;
  const r = Math.round(245 + (239 - 245) * s);
  const g = Math.round(158 + (68 - 158) * s);
  const b = Math.round(11 + (68 - 11) * s);
  return `rgb(${r}, ${g}, ${b})`;
}

function cellBg(score: number): string {
  const color = interpolateColor(score);
  const opacity = 0.12 + (score / 100) * 0.25;
  return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
}

export default function RiskHeatmap() {
  const { categories, regions, cellMap } = useMemo(() => {
    const cats = Array.from(new Set(riskMatrix.map((c) => c.category)));
    const regs = Array.from(new Set(riskMatrix.map((c) => c.region)));
    const map = new Map<string, RiskCell>();
    riskMatrix.forEach((cell) => {
      map.set(`${cell.category}::${cell.region}`, cell);
    });
    return { categories: cats, regions: regs, cellMap: map };
  }, []);

  return (
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-widest text-slate-500">
        Risk Matrix
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-1 py-1.5 text-left text-[10px] text-slate-500" />
              {regions.map((r) => (
                <th
                  key={r}
                  className="px-1 py-1.5 text-center text-[10px] text-slate-500"
                >
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat}>
                <td className="whitespace-nowrap px-1 py-1 text-right text-[10px] text-slate-500">
                  {cat}
                </td>
                {regions.map((reg) => {
                  const cell = cellMap.get(`${cat}::${reg}`);
                  if (!cell) {
                    return (
                      <td key={reg} className="p-1">
                        <div className="flex h-10 w-full items-center justify-center rounded-lg bg-[#0a0e1a]" />
                      </td>
                    );
                  }

                  return (
                    <td key={reg} className="p-1">
                      <div
                        className="flex h-10 w-full cursor-default items-center justify-center rounded-lg border border-transparent transition-colors duration-150 hover:border-slate-500/40"
                        style={{ backgroundColor: cellBg(cell.score) }}
                      >
                        <span
                          className="text-xs font-semibold"
                          style={{ color: interpolateColor(cell.score) }}
                        >
                          {cell.score}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-[10px] text-slate-500">Low 0</span>
        <div
          className="h-1.5 flex-1 rounded-full"
          style={{
            background: "linear-gradient(to right, #22c55e, #f59e0b, #ef4444)",
            opacity: 0.5,
          }}
        />
        <span className="text-[10px] text-slate-500">High 100</span>
      </div>
    </div>
  );
}
