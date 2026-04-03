import { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { Farm, Supplier, DemandPoint, Warehouse } from "@/types";
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
  visibleLayers: Record<string, boolean>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
const TILE_ATTR = '&copy; <a href="https://carto.com/">CARTO</a>';

const HEALTH_COLORS: Record<string, string> = {
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
  white: "#94a3b8",
};

const DEMAND_COLORS: Record<string, string> = {
  low: "#3b82f6",
  medium: "#8b5cf6",
  high: "#f59e0b",
  critical: "#ef4444",
};

const MAP_CENTER: L.LatLngExpression = [5, 80];
const MAP_ZOOM = 3;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getArcPoints(
  from: [number, number],
  to: [number, number],
  numPoints = 20
): [number, number][] {
  const points: [number, number][] = [];
  const dist = Math.sqrt(
    Math.pow(to[0] - from[0], 2) + Math.pow(to[1] - from[1], 2)
  );
  const arcHeight = dist * 0.3;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat =
      from[0] + t * (to[0] - from[0]) + Math.sin(t * Math.PI) * arcHeight;
    const lng = from[1] + t * (to[1] - from[1]);
    points.push([lat, lng]);
  }
  return points;
}

function haversineDistance(
  a: [number, number],
  b: [number, number]
): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

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
// Map invalidation helper
// ---------------------------------------------------------------------------
function InvalidateSize() {
  const map = useMap();
  useMemo(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
}

// ---------------------------------------------------------------------------
// Legend
// ---------------------------------------------------------------------------
function MapLegend() {
  const items = [
    { label: "Farm", shape: "circle" as const, color: "#22c55e" },
    { label: "Supplier", shape: "triangle" as const, color: "#3b82f6" },
    { label: "Trade Route", shape: "line" as const, color: "#06b6d4" },
    { label: "Demand", shape: "ring" as const, color: "#8b5cf6" },
    { label: "Warehouse", shape: "square" as const, color: "#f59e0b" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        right: 12,
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.9)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
        borderRadius: 6,
        padding: "8px 12px",
        backdropFilter: "blur(8px)",
        fontFamily: "ui-monospace, monospace",
        fontSize: 11,
        color: "#cbd5e1",
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#64748b",
          marginBottom: 6,
        }}
      >
        Legend
      </div>
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 3,
          }}
        >
          {item.shape === "circle" && (
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: item.color,
              }}
            />
          )}
          {item.shape === "triangle" && (
            <svg width="11" height="11" viewBox="0 0 11 11">
              <polygon
                points="5.5,0.5 10.5,10 0.5,10"
                fill={item.color}
                fillOpacity="0.9"
              />
            </svg>
          )}
          {item.shape === "line" && (
            <svg width="14" height="10" viewBox="0 0 14 10">
              <path
                d="M0 8 Q7 0 14 8"
                fill="none"
                stroke={item.color}
                strokeWidth="1.5"
                strokeDasharray="3 2"
                opacity="0.7"
              />
            </svg>
          )}
          {item.shape === "ring" && (
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                border: `2px solid ${item.color}`,
                backgroundColor: "transparent",
              }}
            />
          )}
          {item.shape === "square" && (
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: item.color,
              }}
            />
          )}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline CSS for glow & pulse animations
// ---------------------------------------------------------------------------
const GLOW_STYLES = `
  .farm-marker-glow {
    filter: drop-shadow(0 0 6px var(--glow-color, #22c55e));
  }
  .farm-marker-glow-selected {
    filter: drop-shadow(0 0 12px rgba(255,255,255,0.7));
  }
  .farm-marker-pulse-red {
    animation: pulse-red 2s ease-in-out infinite;
  }
  @keyframes pulse-red {
    0%, 100% { filter: drop-shadow(0 0 4px #ef4444); }
    50% { filter: drop-shadow(0 0 14px #ef4444) drop-shadow(0 0 20px #ef444480); }
  }
`;

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
  visibleLayers,
}: DualRegionMapProps) {
  // Compute trade routes: connect each supplier to the 2 nearest farms in its region
  const tradeRoutes = useMemo(() => {
    const routes: { from: [number, number]; to: [number, number]; key: string }[] = [];

    for (const supplier of suppliers) {
      const regionFarms = farms.filter((f) => f.region === supplier.region);
      if (regionFarms.length === 0) continue;

      const sorted = [...regionFarms].sort(
        (a, b) =>
          haversineDistance([supplier.lat, supplier.lng], [a.lat, a.lng]) -
          haversineDistance([supplier.lat, supplier.lng], [b.lat, b.lng])
      );

      const nearest = sorted.slice(0, 2);
      for (const farm of nearest) {
        routes.push({
          from: [supplier.lat, supplier.lng],
          to: [farm.lat, farm.lng],
          key: `${supplier.id}-${farm.id}`,
        });
      }
    }

    return routes;
  }, [suppliers, farms]);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <style dangerouslySetInnerHTML={{ __html: GLOW_STYLES }} />

      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <InvalidateSize />
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} />

        {/* Trade route arcs */}
        {visibleLayers.routes &&
          tradeRoutes.map((route) => {
            const arcPoints = getArcPoints(route.from, route.to);
            return (
              <Polyline
                key={route.key}
                positions={arcPoints}
                pathOptions={{
                  color: "#06b6d4",
                  weight: 1.5,
                  opacity: 0.4,
                  dashArray: "8 4",
                }}
              />
            );
          })}

        {/* Farm markers */}
        {visibleLayers.farms &&
          farms.map((farm) => {
            const isSelected = selectedFarm?.id === farm.id;
            const isCritical = farm.health === "red";
            const radius = Math.max(5, Math.min(14, farm.capacityPerDay / 40));
            const color = HEALTH_COLORS[farm.health] ?? HEALTH_COLORS.green;

            return (
              <CircleMarker
                key={farm.id}
                center={[farm.lat, farm.lng]}
                radius={isSelected ? radius + 3 : radius}
                pathOptions={{
                  color: isSelected ? "#ffffff" : color,
                  fillColor: color,
                  fillOpacity: 0.85,
                  weight: isSelected ? 3 : 1.5,
                }}
                className={
                  isSelected
                    ? "farm-marker-glow-selected"
                    : isCritical
                      ? "farm-marker-pulse-red"
                      : "farm-marker-glow"
                }
                eventHandlers={{ click: () => onSelectFarm(farm) }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -8]}
                  className="dark-tooltip"
                >
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
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
        {visibleLayers.suppliers &&
          suppliers.map((s) => (
            <Marker
              key={s.id}
              position={[s.lat, s.lng]}
              icon={makeSupplierIcon(s.health)}
            >
              <Tooltip
                direction="top"
                offset={[0, -10]}
                className="dark-tooltip"
              >
                <span style={{ fontSize: 12, fontWeight: 500 }}>
                  {s.name} ({s.type}) &mdash;{" "}
                  <span style={{ color: HEALTH_COLORS[s.health] }}>
                    {s.health.toUpperCase()}
                  </span>
                </span>
              </Tooltip>
            </Marker>
          ))}

        {/* Demand hotspot markers */}
        {visibleLayers.demand &&
          demandPoints.map((dp) => {
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
                <Tooltip
                  direction="top"
                  offset={[0, -8]}
                  className="dark-tooltip"
                >
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    {dp.city} &mdash; {dp.volume.toLocaleString()} head &mdash;{" "}
                    +{dp.growthRate}%
                  </span>
                </Tooltip>
              </CircleMarker>
            );
          })}

        {/* Warehouse markers (squares) */}
        {visibleLayers.warehouses &&
          warehouses.map((w) => (
            <Marker
              key={w.id}
              position={[w.lat, w.lng]}
              icon={makeWarehouseIcon(w.health)}
            >
              <Tooltip
                direction="top"
                offset={[0, -10]}
                className="dark-tooltip"
              >
                <span style={{ fontSize: 12, fontWeight: 500 }}>
                  {w.name} &mdash; DOI {w.doi}d &mdash;{" "}
                  {Math.round((w.quantity / w.capacity) * 100)}% full
                </span>
              </Tooltip>
            </Marker>
          ))}
      </MapContainer>

      {/* Legend overlay */}
      <MapLegend />
    </div>
  );
}
