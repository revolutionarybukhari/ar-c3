import {
  X,
  MapPin,
  Stethoscope,
  Truck,
  RefreshCw,
  ClipboardList,
  Activity,
  Droplets,
  Zap,
  Users,
  Syringe,
  CalendarCheck,
  AlertTriangle,
  Wheat,
  TrendingUp,
  Gauge,
} from "lucide-react";
import type { Farm } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FarmDetailPanelProps {
  farm: Farm | null;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Health colour helpers
// ---------------------------------------------------------------------------
const HEALTH_BG: Record<string, string> = {
  red: "bg-destructive",
  amber: "bg-warning",
  green: "bg-success",
};

const HEALTH_GRADIENT: Record<string, string> = {
  red: "from-red-600/30 via-red-500/10 to-transparent",
  amber: "from-amber-600/30 via-amber-500/10 to-transparent",
  green: "from-emerald-600/30 via-emerald-500/10 to-transparent",
};

const HEALTH_LABEL: Record<string, string> = {
  red: "Critical",
  amber: "At Risk",
  green: "Healthy",
};

const STATUS_VARIANT: Record<string, "destructive" | "warning" | "success"> = {
  red: "destructive",
  amber: "warning",
  green: "success",
};

function statusBadgeVariant(
  value: string,
  good: string,
  warn: string
): "success" | "warning" | "destructive" {
  if (value === good) return "success";
  if (value === warn) return "warning";
  return "destructive";
}

// ---------------------------------------------------------------------------
// Sparkline (larger, dedicated)
// ---------------------------------------------------------------------------
function Sparkline({ data }: { data: number[] }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 64;
  const w = 280;
  const step = w / (data.length - 1);

  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 8)}`)
    .join(" ");

  // Build area fill path
  const areaPath = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 8)}`)
    .join(" ");

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="block">
      {/* Gradient fill */}
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${areaPath} ${(data.length - 1) * step},${h}`}
        fill="url(#sparkGrad)"
      />
      <polyline
        points={points}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      {data.length > 0 && (
        <>
          <circle
            cx={(data.length - 1) * step}
            cy={h - ((data[data.length - 1] - min) / range) * (h - 8)}
            r="5"
            fill="#1e3a5f"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <circle
            cx={(data.length - 1) * step}
            cy={h - ((data[data.length - 1] - min) / range) * (h - 8)}
            r="2.5"
            fill="#3b82f6"
          />
        </>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Radial gauge mini
// ---------------------------------------------------------------------------
function MiniGauge({
  value,
  max,
  label,
  unit = "",
  warn = false,
}: {
  value: number;
  max: number;
  label: string;
  unit?: string;
  warn?: boolean;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const radius = 28;
  const stroke = 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = warn ? "#f59e0b" : "#3b82f6";

  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/40 border border-border/40 p-3">
      <div className="relative">
        <svg width="68" height="68" viewBox="0 0 68 68">
          <circle
            cx="34"
            cy="34"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/60"
          />
          <circle
            cx="34"
            cy="34"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 34 34)"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">
            {value}
            <span className="text-[9px] text-muted-foreground">{unit}</span>
          </span>
        </div>
      </div>
      <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Driver row (table style)
// ---------------------------------------------------------------------------
function DriverRow({
  icon: Icon,
  label,
  children,
  even,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
  even?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2.5 first:rounded-t-lg last:rounded-b-lg",
        even ? "bg-muted/30" : "bg-transparent"
      )}
    >
      <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-muted/50">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span>{label}</span>
      </div>
      <div className="text-xs text-foreground">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------
export default function FarmDetailPanel({
  farm,
  onClose,
}: FarmDetailPanelProps) {
  if (!farm) return null;

  const { drivers } = farm;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="fixed top-3 right-3 bottom-3 z-50 w-full max-w-md rounded-2xl bg-card border border-border/60 shadow-2xl shadow-black/40 overflow-hidden animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Health status banner */}
        <div className={cn("h-1.5 w-full shrink-0", HEALTH_BG[farm.health])} />
        <div className={cn("w-full bg-gradient-to-b px-5 pt-4 pb-3", HEALTH_GRADIENT[farm.health])}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-muted/60 hover:bg-muted transition-colors group"
          >
            <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>

          {/* Farm name and location */}
          <div className="space-y-2 pr-10">
            <h2 className="text-lg font-bold text-foreground leading-tight">
              {farm.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {farm.province}, {farm.country}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <Badge variant={STATUS_VARIANT[farm.health]} className="text-[11px]">
                {HEALTH_LABEL[farm.health]}
              </Badge>
              <Badge variant="outline" className="capitalize text-[11px]">
                {farm.sku}
              </Badge>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-6">
            {/* Performance metrics - 2x2 gauge grid */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5 text-primary" />
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Performance
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <MiniGauge
                  label="Capacity"
                  value={farm.capacityPerDay}
                  max={500}
                  unit=" hd/d"
                />
                <MiniGauge
                  label="On-Time"
                  value={farm.onTimePct}
                  max={100}
                  unit="%"
                  warn={farm.onTimePct < 85}
                />
                <MiniGauge
                  label="Defect Rate"
                  value={farm.defectPct}
                  max={10}
                  unit="%"
                  warn={farm.defectPct > 2}
                />
                <MiniGauge
                  label="Stock Pressure"
                  value={Math.round(farm.stockPressure * 100)}
                  max={100}
                  unit="%"
                  warn={farm.stockPressure > 0.8}
                />
              </div>
            </section>

            {/* 7-day trend */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  7-Day Output Trend
                </h3>
              </div>
              <div className="rounded-xl bg-muted/30 border border-border/40 p-4">
                <Sparkline data={farm.trendData} />
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>7 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            </section>

            {/* Health drivers table */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Health Drivers
                </h3>
              </div>
              <div className="rounded-xl border border-border/40 overflow-hidden">
                <DriverRow icon={Activity} label="Mortality Rate" even>
                  <span
                    className={cn(
                      "font-semibold",
                      drivers.mortalityRate > 3
                        ? "text-destructive"
                        : drivers.mortalityRate > 1.5
                          ? "text-warning"
                          : "text-success"
                    )}
                  >
                    {drivers.mortalityRate}%
                  </span>
                </DriverRow>

                <DriverRow icon={AlertTriangle} label="Disease Alerts">
                  <span
                    className={cn(
                      "font-semibold",
                      drivers.diseaseAlerts > 3
                        ? "text-destructive"
                        : drivers.diseaseAlerts > 0
                          ? "text-warning"
                          : "text-success"
                    )}
                  >
                    {drivers.diseaseAlerts}
                  </span>
                </DriverRow>

                <DriverRow icon={Wheat} label="Feed Days Left" even>
                  <span
                    className={cn(
                      "font-semibold",
                      drivers.feedDaysLeft < 7
                        ? "text-destructive"
                        : drivers.feedDaysLeft < 14
                          ? "text-warning"
                          : "text-success"
                    )}
                  >
                    {drivers.feedDaysLeft}d
                  </span>
                </DriverRow>

                <DriverRow icon={Syringe} label="Vaccine Days Left">
                  <span
                    className={cn(
                      "font-semibold",
                      drivers.vaccineDaysLeft < 3
                        ? "text-destructive"
                        : drivers.vaccineDaysLeft < 10
                          ? "text-warning"
                          : "text-success"
                    )}
                  >
                    {drivers.vaccineDaysLeft}d
                  </span>
                </DriverRow>

                <DriverRow icon={Droplets} label="Water Status" even>
                  <Badge
                    variant={statusBadgeVariant(
                      drivers.waterStatus,
                      "ok",
                      "low"
                    )}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {drivers.waterStatus.toUpperCase()}
                  </Badge>
                </DriverRow>

                <DriverRow icon={Zap} label="Power Status">
                  <Badge
                    variant={statusBadgeVariant(
                      drivers.powerStatus,
                      "ok",
                      "backup"
                    )}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {drivers.powerStatus.toUpperCase()}
                  </Badge>
                </DriverRow>

                <DriverRow icon={Users} label="Staffing" even>
                  <span
                    className={cn(
                      "font-semibold",
                      drivers.staffingPct < 75
                        ? "text-destructive"
                        : drivers.staffingPct < 90
                          ? "text-warning"
                          : "text-success"
                    )}
                  >
                    {drivers.staffingPct}%
                  </span>
                </DriverRow>

                <DriverRow icon={CalendarCheck} label="Last Vet Check">
                  <span className="font-semibold">{drivers.lastVetCheck}</span>
                </DriverRow>

                <DriverRow icon={ClipboardList} label="Vaccination Status" even>
                  <Badge
                    variant={statusBadgeVariant(
                      drivers.vaccinationStatus,
                      "current",
                      "due"
                    )}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {drivers.vaccinationStatus.toUpperCase()}
                  </Badge>
                </DriverRow>
              </div>
            </section>
          </div>
        </div>

        {/* Sticky action buttons at bottom */}
        <div className="shrink-0 border-t border-border/50 bg-card/95 backdrop-blur-md p-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-2 border-border/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all">
              <Stethoscope className="w-3.5 h-3.5" />
              Dispatch Vet
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-2 border-border/60 hover:bg-warning/10 hover:text-warning hover:border-warning/30 transition-all">
              <RefreshCw className="w-3.5 h-3.5" />
              Rebalance
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-2 border-border/60 hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all">
              <Truck className="w-3.5 h-3.5" />
              Reassign
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
