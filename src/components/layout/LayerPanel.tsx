import {
  MapPin,
  Triangle,
  Route,
  Target,
  Warehouse,
  ShieldAlert,
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
  { key: "demand", label: "DEMAND ZONES", icon: Target, color: "#8b5cf6" },
  { key: "warehouses", label: "WAREHOUSES", icon: Warehouse, color: "#f59e0b" },
];

export default function LayerPanel({ visibleLayers, onToggleLayer, farmCounts, alertCount }: LayerPanelProps) {
  return (
    <div className="w-[180px] shrink-0 border-r border-[#0f1a2e] bg-[#060a12] flex flex-col">
      {/* Title */}
      <div className="px-3 pt-3 pb-2 border-b border-[#0f1a2e]">
        <p className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase">
          Global Situation
        </p>
      </div>

      {/* Layer toggles */}
      <div className="px-3 py-2 space-y-0.5 flex-1">
        <p className="text-[8px] font-semibold tracking-[0.2em] text-slate-700 uppercase mb-2">Layers</p>
        {layers.map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => onToggleLayer(key)}
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-left transition-colors hover:bg-[#0d1424]"
          >
            <div
              className={cn(
                "h-3 w-3 rounded-sm border flex items-center justify-center transition-colors",
                visibleLayers[key]
                  ? "border-transparent"
                  : "border-slate-700 bg-transparent"
              )}
              style={visibleLayers[key] ? { backgroundColor: color, borderColor: color } : {}}
            >
              {visibleLayers[key] && (
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <path d="M1.5 4L3 5.5L6.5 2" stroke="#000" strokeWidth="1.5" fill="none" />
                </svg>
              )}
            </div>
            <Icon className="h-3 w-3 shrink-0" style={{ color: visibleLayers[key] ? color : "#475569" }} />
            <span className={cn(
              "text-[10px] font-medium tracking-wider",
              visibleLayers[key] ? "text-slate-300" : "text-slate-600"
            )}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Health summary */}
      <div className="px-3 py-3 border-t border-[#0f1a2e] space-y-2">
        <p className="text-[8px] font-semibold tracking-[0.2em] text-slate-700 uppercase">Health Status</p>
        <div className="space-y-1">
          {[
            { label: "Critical", count: farmCounts.red, color: "#ef4444" },
            { label: "At Risk", count: farmCounts.amber, color: "#f59e0b" },
            { label: "Healthy", count: farmCounts.green, color: "#22c55e" },
            { label: "Unmonitored", count: farmCounts.white, color: "#94a3b8" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] text-slate-500">{s.label}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active alerts */}
      <div className="px-3 py-3 border-t border-[#0f1a2e]">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="h-3 w-3 text-red-400" />
          <span className="text-[10px] font-semibold text-red-400">{alertCount} ACTIVE ALERTS</span>
        </div>
      </div>
    </div>
  );
}
