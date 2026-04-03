import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Globe } from "lucide-react";
import type { Farm, Supplier, DemandPoint, Warehouse } from "@/types";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface DualRegionMapProps {
  farms: Farm[];
  suppliers: Supplier[];
  demandPoints: DemandPoint[];
  warehouses: Warehouse[];
  selectedFarm: Farm | null;
  onSelectFarm: (farm: Farm) => void;
  activeRegion: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://carto.com/">CARTO</a>';

const HEALTH_COLORS: Record<string, string> = {
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
};

const DEMAND_COLORS: Record<string, string> = {
  low: "#3b82f6",
  medium: "#8b5cf6",
  high: "#f59e0b",
  critical: "#ef4444",
};

const INDONESIA_CENTER: L.LatLngExpression = [-2.5, 118];
const GCC_CENTER: L.LatLngExpression = [20, 55];
const INDONESIA_ZOOM = 5;
const GCC_ZOOM = 4;

// ---------------------------------------------------------------------------
// Helper: custom div icons
// ---------------------------------------------------------------------------
function makeSupplierIcon(health: string) {
  const color = HEALTH_COLORS[health] ?? HEALTH_COLORS.green;
  return L.divIcon({
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    html: `<svg width="18" height="18" viewBox="0 0 18 18">
      <polygon points="9,1 17,15 1,15" fill="${color}" fill-opacity="0.85" stroke="${color}" stroke-width="1.5"/>
    </svg>`,
  });
}

function makeWarehouseIcon(health: string) {
  const color = HEALTH_COLORS[health] ?? HEALTH_COLORS.green;
  return L.divIcon({
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: `<svg width="16" height="16" viewBox="0 0 16 16">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="${color}" fill-opacity="0.8" stroke="${color}" stroke-width="1.5"/>
    </svg>`,
  });
}

// ---------------------------------------------------------------------------
// Sub-component: map invalidation helper
// ---------------------------------------------------------------------------
function InvalidateSize() {
  const map = useMap();
  // Invalidate on mount and whenever the container resizes
  useMemo(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
}

// ---------------------------------------------------------------------------
// Legend overlay
// ---------------------------------------------------------------------------
function MapLegend() {
  const items = [
    { label: "Farm", shape: "circle", color: "#22c55e" },
    { label: "Supplier", shape: "triangle", color: "#3b82f6" },
    { label: "Demand", shape: "ring", color: "#8b5cf6" },
    { label: "Warehouse", shape: "square", color: "#f59e0b" },
  ];

  return (
    <div className="absolute bottom-3 right-3 z-[1000] rounded-lg bg-card/90 border border-border/60 backdrop-blur-md px-3 py-2.5 shadow-lg">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Legend</p>
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-[11px] text-slate-300">
            {item.shape === "circle" && (
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            )}
            {item.shape === "triangle" && (
              <svg width="11" height="11" viewBox="0 0 11 11">
                <polygon points="5.5,0.5 10.5,10 0.5,10" fill={item.color} fillOpacity="0.9" />
              </svg>
            )}
            {item.shape === "ring" && (
              <span
                className="inline-block h-2.5 w-2.5 rounded-full border-2"
                style={{ borderColor: item.color, backgroundColor: "transparent" }}
              />
            )}
            {item.shape === "square" && (
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: single region map pane
// ---------------------------------------------------------------------------
interface RegionPaneProps {
  center: L.LatLngExpression;
  zoom: number;
  farms: Farm[];
  suppliers: Supplier[];
  demandPoints: DemandPoint[];
  warehouses: Warehouse[];
  selectedFarm: Farm | null;
  onSelectFarm: (farm: Farm) => void;
  label: string;
}

function RegionPane({
  center,
  zoom,
  farms,
  suppliers,
  demandPoints,
  warehouses,
  selectedFarm,
  onSelectFarm,
  label,
}: RegionPaneProps) {
  return (
    <div className="relative flex-1 min-h-[400px] rounded-xl overflow-hidden border border-border/60 shadow-[0_0_20px_rgba(59,130,246,0.06)]">
      {/* Region badge */}
      <span className="absolute top-3 left-3 z-[1000] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-primary/15 text-primary border border-primary/25 backdrop-blur-md shadow-sm">
        <Globe className="w-3 h-3" />
        {label}
      </span>

      {/* Legend */}
      <MapLegend />

      {/* Bottom gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[999] h-16 bg-gradient-to-t from-card/60 to-transparent" />

      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        style={{ height: "100%", minHeight: 400 }}
        zoomControl={false}
        attributionControl={false}
      >
        <InvalidateSize />
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} />

        {/* Farm markers */}
        {farms.map((farm) => {
          const isSelected = selectedFarm?.id === farm.id;
          const isCritical = farm.health === "red";
          const radius = Math.max(6, Math.min(14, farm.capacityPerDay / 40));
          const color = HEALTH_COLORS[farm.health];
          return (
            <CircleMarker
              key={farm.id}
              center={[farm.lat, farm.lng]}
              radius={isSelected ? radius + 2 : radius}
              pathOptions={{
                color: isSelected ? "#ffffff" : color,
                fillColor: color,
                fillOpacity: 0.85,
                weight: isSelected ? 3 : 1.5,
              }}
              className={cn(
                isCritical && !isSelected && "animate-pulse",
                isSelected && "drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              )}
              eventHandlers={{ click: () => onSelectFarm(farm) }}
            >
              <Tooltip direction="top" offset={[0, -8]} className="dark-tooltip">
                <span className="text-xs font-medium">
                  {farm.name} &mdash; {farm.sku} &mdash;{" "}
                  <span style={{ color: HEALTH_COLORS[farm.health] }}>
                    {farm.health.toUpperCase()}
                  </span>
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* Supplier markers (triangles) */}
        {suppliers.map((s) => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={makeSupplierIcon(s.health)}
          >
            <Tooltip direction="top" offset={[0, -10]} className="dark-tooltip">
              <span className="text-xs font-medium">
                {s.name} ({s.type}) &mdash;{" "}
                <span style={{ color: HEALTH_COLORS[s.health] }}>
                  {s.health.toUpperCase()}
                </span>
              </span>
            </Tooltip>
          </Marker>
        ))}

        {/* Demand hotspot markers (pulsing circles) */}
        {demandPoints.map((dp) => {
          const baseRadius = Math.max(8, Math.min(22, dp.volume / 800));
          const color = DEMAND_COLORS[dp.level];
          return (
            <CircleMarker
              key={dp.id}
              center={[dp.lat, dp.lng]}
              radius={baseRadius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.3,
                weight: 2,
                dashArray: "4 4",
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} className="dark-tooltip">
                <span className="text-xs font-medium">
                  {dp.city} &mdash; {dp.volume.toLocaleString()} head &mdash;{" "}
                  +{dp.growthRate}%
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* Warehouse markers (squares) */}
        {warehouses.map((w) => (
          <Marker
            key={w.id}
            position={[w.lat, w.lng]}
            icon={makeWarehouseIcon(w.health)}
          >
            <Tooltip direction="top" offset={[0, -10]} className="dark-tooltip">
              <span className="text-xs font-medium">
                {w.name} &mdash; DOI {w.doi}d &mdash;{" "}
                {Math.round((w.quantity / w.capacity) * 100)}% full
              </span>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function DualRegionMap({
  farms,
  suppliers,
  demandPoints,
  warehouses,
  selectedFarm,
  onSelectFarm,
  activeRegion,
}: DualRegionMapProps) {
  // Filter entities by region
  const indoFarms = useMemo(() => farms.filter((f) => f.region === "indonesia"), [farms]);
  const gccFarms = useMemo(() => farms.filter((f) => f.region === "gcc"), [farms]);
  const indoSuppliers = useMemo(() => suppliers.filter((s) => s.region === "indonesia"), [suppliers]);
  const gccSuppliers = useMemo(() => suppliers.filter((s) => s.region === "gcc"), [suppliers]);

  // Demand/warehouse split by rough geographic bounds
  const indoDemand = useMemo(
    () => demandPoints.filter((d) => d.lng > 90 && d.lng < 145),
    [demandPoints]
  );
  const gccDemand = useMemo(
    () => demandPoints.filter((d) => d.lng >= 30 && d.lng <= 90),
    [demandPoints]
  );
  const indoWarehouses = useMemo(
    () => warehouses.filter((w) => w.lng > 90),
    [warehouses]
  );
  const gccWarehouses = useMemo(
    () => warehouses.filter((w) => w.lng <= 90),
    [warehouses]
  );

  const showIndonesia = activeRegion === "all" || activeRegion === "indonesia";
  const showGcc = activeRegion === "all" || activeRegion === "gcc";

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-lg overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border/50">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <Globe className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Global Operations Map</h2>
          <p className="text-[11px] text-muted-foreground">Real-time farm, supplier & logistics view</p>
        </div>
      </div>

      {/* Map content */}
      <div
        className={cn(
          "flex gap-3 p-3",
          activeRegion === "all" ? "flex-row" : "flex-col"
        )}
        style={{ height: activeRegion === "all" ? 480 : 520 }}
      >
        {showIndonesia && (
          <RegionPane
            key="indonesia"
            center={INDONESIA_CENTER}
            zoom={INDONESIA_ZOOM}
            farms={indoFarms}
            suppliers={indoSuppliers}
            demandPoints={indoDemand}
            warehouses={indoWarehouses}
            selectedFarm={selectedFarm}
            onSelectFarm={onSelectFarm}
            label="Indonesia"
          />
        )}
        {showGcc && (
          <RegionPane
            key="gcc"
            center={GCC_CENTER}
            zoom={GCC_ZOOM}
            farms={gccFarms}
            suppliers={gccSuppliers}
            demandPoints={gccDemand}
            warehouses={gccWarehouses}
            selectedFarm={selectedFarm}
            onSelectFarm={onSelectFarm}
            label="GCC & Suppliers"
          />
        )}
      </div>
    </div>
  );
}
