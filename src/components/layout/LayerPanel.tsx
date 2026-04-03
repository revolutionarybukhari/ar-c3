import { useState } from "react";
import {
  MapPin,
  Triangle,
  Route,
  Target,
  Warehouse,
  ShieldAlert,
  ChevronDown,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayerPanelProps {
  visibleLayers: Record<string, boolean>;
  onToggleLayer: (layer: string) => void;
  farmCounts: { total: number; red: number; amber: number; green: number; white: number };
  alertCount: number;
}

const layers = [
  { key: "farms", label: "FARMS", icon: MapPin, color: "#22c55e" },
  { key: "suppliers", label: "SUPPLIERS", icon: Triangle, color: "#3b82f6" },
  { key: "routes", label: "TRADE ROUTES", icon: Route, color: "#06b6d4" },
  { key: "demand", label: "DEMAND", icon: Target, color: "#8b5cf6" },
  { key: "warehouses", label: "WAREHOUSES", icon: Warehouse, color: "#f59e0b" },
];

export default function LayerPanel({ visibleLayers, onToggleLayer, farmCounts, alertCount }: LayerPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-3 left-3 z-[1000] max-w-[220px]">
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-t-lg bg-[#0a0f1c]/90 backdrop-blur-md border border-[#1a2236] border-b-0 text-[9px] font-bold tracking-[0.15em] text-slate-400 uppercase hover:text-white transition-colors"
      >
        <Layers className="h-3 w-3" />
        LAYERS
        <ChevronDown className={cn("h-3 w-3 transition-transform", collapsed && "rotate-180")} />
      </button>

      {/* Panel body */}
      {!collapsed && (
        <div className="rounded-b-lg rounded-tr-lg bg-[#0a0f1c]/90 backdrop-blur-md border border-[#1a2236] p-2.5 space-y-2">
          {/* Layer toggles */}
          <div className="space-y-0.5">
            {layers.map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => onToggleLayer(key)}
                className="flex items-center gap-2 w-full px-1.5 py-1 rounded text-left transition-colors hover:bg-[#1a2236]/50"
              >
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-sm border flex items-center justify-center",
                    visibleLayers[key] ? "border-transparent" : "border-slate-700"
                  )}
                  style={visibleLayers[key] ? { backgroundColor: color } : {}}
                >
                  {visibleLayers[key] && (
                    <svg width="7" height="7" viewBox="0 0 8 8">
                      <path d="M1.5 4L3 5.5L6.5 2" stroke="#000" strokeWidth="1.5" fill="none" />
                    </svg>
                  )}
                </div>
                <Icon className="h-2.5 w-2.5 shrink-0" style={{ color: visibleLayers[key] ? color : "#475569" }} />
                <span className={cn("text-[9px] font-medium tracking-wider", visibleLayers[key] ? "text-slate-300" : "text-slate-600")}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#1a2236]" />

          {/* Health counts */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {[
              { label: "CRT", count: farmCounts.red, color: "#ef4444" },
              { label: "RSK", count: farmCounts.amber, color: "#f59e0b" },
              { label: "OK", count: farmCounts.green, color: "#22c55e" },
              { label: "N/A", count: farmCounts.white, color: "#94a3b8" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[8px] text-slate-600">{s.label}</span>
                <span className="text-[8px] font-bold text-slate-400 ml-auto">{s.count}</span>
              </div>
            ))}
          </div>

          {/* Alerts */}
          {alertCount > 0 && (
            <>
              <div className="h-px bg-[#1a2236]" />
              <div className="flex items-center gap-1">
                <ShieldAlert className="h-2.5 w-2.5 text-red-400" />
                <span className="text-[8px] font-bold text-red-400 tracking-wider">{alertCount} ALERTS</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
