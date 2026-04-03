import { Cloud, Thermometer, Droplets, Wind, Sun, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherEvent {
  id: string;
  type: "drought" | "flood" | "heatwave" | "storm" | "cold" | "normal";
  region: string;
  country: string;
  severity: "severe" | "moderate" | "mild" | "advisory";
  title: string;
  impact: string;
  farmCount: number;
  temp: string;
  humidity: string;
  forecast: string;
}

const weatherEvents: WeatherEvent[] = [
  { id: "w1", type: "flood", region: "Sindh", country: "Pakistan", severity: "severe", title: "Monsoon flooding — Sindh & Punjab", impact: "40% supply corridor capacity loss, livestock displacement", farmCount: 7, temp: "34°C", humidity: "92%", forecast: "Flooding expected to persist 2-3 weeks" },
  { id: "w2", type: "drought", region: "Queensland", country: "Australia", severity: "moderate", title: "La Niña drought advisory", impact: "Pasture degradation, supplemental feeding required", farmCount: 12, temp: "38°C", humidity: "22%", forecast: "Below-average rainfall forecast through June" },
  { id: "w3", type: "heatwave", region: "UAE/Oman", country: "GCC", severity: "moderate", title: "Heat stress warning — GCC region", impact: "Livestock heat stress risk, cold chain strain", farmCount: 4, temp: "46°C", humidity: "18%", forecast: "Temperatures above 44°C expected next 10 days" },
  { id: "w4", type: "storm", region: "East Java", country: "Indonesia", severity: "mild", title: "Tropical storm advisory — Java Sea", impact: "Shipping delays, port closures possible", farmCount: 8, temp: "29°C", humidity: "85%", forecast: "Storm tracking northwest, clearing in 48h" },
  { id: "w5", type: "normal", region: "West Java", country: "Indonesia", severity: "advisory", title: "Seasonal transition — dry season onset", impact: "Water supply planning required, pasture management", farmCount: 15, temp: "31°C", humidity: "68%", forecast: "Dry season conditions beginning mid-April" },
  { id: "w6", type: "cold", region: "Mbarara", country: "Uganda", severity: "mild", title: "Cold front — East African highlands", impact: "Minor livestock stress, respiratory illness risk", farmCount: 3, temp: "12°C", humidity: "75%", forecast: "Temperatures normalizing within 5 days" },
];

const typeIcons = {
  drought: Sun,
  flood: Droplets,
  heatwave: Thermometer,
  storm: Wind,
  cold: Thermometer,
  normal: Cloud,
};

const severityColors = {
  severe: { bg: "bg-red-500/15", text: "text-red-400", border: "border-l-red-500" },
  moderate: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-l-amber-500" },
  mild: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-l-blue-500" },
  advisory: { bg: "bg-slate-500/15", text: "text-slate-400", border: "border-l-slate-500" },
};

export default function WeatherImpactPanel() {
  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <Cloud className="h-3.5 w-3.5 text-sky-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Weather Impact Monitor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-3 w-3 text-amber-400" />
          <span className="text-[8px] font-bold tracking-wider text-amber-400 uppercase">
            {weatherEvents.filter(w => w.severity === "severe").length} Severe
          </span>
        </div>
      </div>

      <div className="max-h-[320px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {weatherEvents.map(ev => {
          const Icon = typeIcons[ev.type];
          const sev = severityColors[ev.severity];
          return (
            <div key={ev.id} className={cn("px-4 py-2.5 hover:bg-[#0a1020] transition-colors border-l-2", sev.border)}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-300">{ev.title}</span>
                </div>
                <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider", sev.bg, sev.text)}>
                  {ev.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-[9px] text-slate-500 mb-1.5">{ev.impact}</p>
              <div className="flex items-center gap-3 text-[8px] text-slate-600">
                <span>{ev.region}, {ev.country}</span>
                <span>|</span>
                <span className="tabular-nums">{ev.temp}</span>
                <span>|</span>
                <span className="tabular-nums">{ev.humidity} RH</span>
                <span>|</span>
                <span>{ev.farmCount} farms</span>
              </div>
              <p className="text-[8px] text-slate-600 mt-1 italic">{ev.forecast}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
