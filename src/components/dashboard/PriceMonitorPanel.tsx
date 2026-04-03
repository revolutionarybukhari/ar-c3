"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { pricePoints } from "@/data/mockData";

export default function PriceMonitorPanel() {
  const countries = useMemo(
    () => Array.from(new Set(pricePoints.map((p) => p.country))),
    []
  );
  const skus = useMemo(
    () => Array.from(new Set(pricePoints.map((p) => p.sku))),
    []
  );

  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [skuFilter, setSkuFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let data = pricePoints;
    if (countryFilter !== "all") data = data.filter((p) => p.country === countryFilter);
    if (skuFilter !== "all") data = data.filter((p) => p.sku === skuFilter);
    return data;
  }, [countryFilter, skuFilter]);

  const globalMean = useMemo(() => {
    if (filtered.length === 0) return 0;
    return filtered.reduce((sum, p) => sum + p.priceMean, 0) / filtered.length;
  }, [filtered]);

  const countryAverages = useMemo(() => {
    const map = new Map<string, { sum: number; count: number }>();
    filtered.forEach((p) => {
      const entry = map.get(p.country) ?? { sum: 0, count: 0 };
      entry.sum += p.priceMean;
      entry.count += 1;
      map.set(p.country, entry);
    });
    return Array.from(map.entries()).map(([country, { sum, count }]) => ({
      country,
      mean: Math.round(sum / count),
    }));
  }, [filtered]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-widest text-slate-500">
          Price Intelligence
        </p>
        <div className="flex gap-2">
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="rounded-lg border border-[#1e293b] bg-[#0a0e1a] px-2.5 py-1 text-xs text-slate-300 outline-none focus:border-blue-500/50"
          >
            <option value="all">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={skuFilter}
            onChange={(e) => setSkuFilter(e.target.value)}
            className="rounded-lg border border-[#1e293b] bg-[#0a0e1a] px-2.5 py-1 text-xs text-slate-300 outline-none focus:border-blue-500/50"
          >
            <option value="all">All SKUs</option>
            {skus.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1e293b]">
              {["Country", "Region", "Outlet", "SKU", "Low", "Mean", "High"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => {
              const aboveAvg = p.priceMean > globalMean;
              return (
                <tr
                  key={idx}
                  className="border-b border-[#1e293b]/30 last:border-0"
                >
                  <td className="px-3 py-2 text-slate-300">{p.country}</td>
                  <td className="px-3 py-2 text-slate-400">{p.region}</td>
                  <td className="px-3 py-2 text-slate-400">{p.outlet}</td>
                  <td className="px-3 py-2 capitalize text-slate-300">{p.sku}</td>
                  <td className="px-3 py-2 tabular-nums text-slate-400">
                    {p.currency} {p.priceLow.toLocaleString()}
                  </td>
                  <td
                    className={`px-3 py-2 tabular-nums font-medium ${
                      aboveAvg ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {p.currency} {p.priceMean.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-slate-400">
                    {p.currency} {p.priceHigh.toLocaleString()}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                  No data matches the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bar chart */}
      {countryAverages.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-slate-500">
            Mean Price by Country
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={countryAverages} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis
                dataKey="country"
                tick={{ fill: "#475569", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#1e293b" }}
              />
              <YAxis
                tick={{ fill: "#475569", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#1e293b" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#94a3b8" }}
                itemStyle={{ color: "#e2e8f0" }}
                cursor={{ fill: "#1e293b", fillOpacity: 0.3 }}
              />
              <Bar dataKey="mean" name="Mean Price" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
