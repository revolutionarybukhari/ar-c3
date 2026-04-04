import { useState, useMemo, lazy, Suspense } from "react";
import { TrendingUp, TrendingDown, Activity, ShieldCheck, DollarSign, AlertTriangle, Syringe } from "lucide-react";
import type { Farm } from "@/types";
import { farms, suppliers, demandPoints, warehouses } from "@/data/mockData";
import LayerPanel from "@/components/layout/LayerPanel";
import ExpandablePanel from "@/components/layout/ExpandablePanel";
import FarmDetailPanel from "@/components/map/FarmDetailPanel";

// Supply-side panels
import FarmHealthGrid from "@/components/dashboard/FarmHealthGrid";
import DiseaseOutbreakMonitor from "@/components/dashboard/DiseaseOutbreakMonitor";
import WeatherImpactPanel from "@/components/dashboard/WeatherImpactPanel";
import FeedWaterInventory from "@/components/dashboard/FeedWaterInventory";
import BreedingLifecycleTracker from "@/components/dashboard/BreedingLifecycleTracker";
import DataFreshnessMonitor from "@/components/dashboard/DataFreshnessMonitor";
import HalalCertTracker from "@/components/dashboard/HalalCertTracker";
import ComplianceDashboard from "@/components/dashboard/ComplianceDashboard";
import ESGTracker from "@/components/dashboard/ESGTracker";
import SupplyChainMonitor from "@/components/dashboard/SupplyChainMonitor";

// Demand-side panels
import PriceMonitorPanel from "@/components/dashboard/PriceMonitorPanel";
import LivestockMarketTicker from "@/components/dashboard/LivestockMarketTicker";
import CurrencyMonitor from "@/components/dashboard/CurrencyMonitor";
import SeasonalCalendar from "@/components/dashboard/SeasonalCalendar";
import CompetitorIntel from "@/components/dashboard/CompetitorIntel";
import CostMarginAnalyzer from "@/components/dashboard/CostMarginAnalyzer";
import ShipmentTracker from "@/components/dashboard/ShipmentTracker";

// Integrated / AI panels
import AISupplyBalancer from "@/components/dashboard/AISupplyBalancer";
import AIRiskPredictor from "@/components/dashboard/AIRiskPredictor";
import AIInsightsPanel from "@/components/sidebar/AIInsightsPanel";
import AIScenarioPanel from "@/components/dashboard/AIScenarioPanel";
import SupplyDemandPanel from "@/components/dashboard/SupplyDemandPanel";
import DemandScenarioPanel from "@/components/dashboard/DemandScenarioPanel";
import MacroStressIndex from "@/components/dashboard/MacroStressIndex";
import RiskHeatmap from "@/components/dashboard/RiskHeatmap";
import ActionLog from "@/components/dashboard/ActionLog";

// Sidebar / Live panels
import AlertsFeed from "@/components/sidebar/AlertsFeed";
import LiveNewsPanel from "@/components/sidebar/LiveNewsPanel";

const DualRegionMap = lazy(() => import("@/components/map/DualRegionMap"));

interface Props {
  activeRegion: string;
  selectedFarm: Farm | null;
  onSelectFarm: (farm: Farm | null) => void;
}

const DEFAULT_LAYERS: Record<string, boolean> = {
  farms: true,
  suppliers: true,
  routes: true,
  demand: true,
  warehouses: true,
};

const PC = "bg-[#0a0f1c] rounded-2xl border border-[#0f1a2e] overflow-hidden";

/* ── Hero KPI Card (ServiceNow style) ──────────────────────────── */
function HeroKpi({ label, value, delta, deltaLabel, icon: Icon, color, sparkData }: {
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  icon: typeof Activity;
  color: string;
  sparkData: number[];
}) {
  const isUp = delta > 0;
  const max = Math.max(...sparkData);
  const min = Math.min(...sparkData);
  const range = max - min || 1;
  const points = sparkData.map((v, i) =>
    `${(i / (sparkData.length - 1)) * 120},${40 - ((v - min) / range) * 36}`
  ).join(" ");

  return (
    <div className={`${PC} p-3 sm:p-5 flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-[11px] sm:text-[13px] font-medium text-slate-400">{label}</span>
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color }} />
      </div>
      <div className="text-[22px] sm:text-[32px] font-bold text-white tracking-tight leading-none mb-1.5 sm:mb-2 tabular-nums">
        {value}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
          {isUp ? <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400" /> : <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-red-400" />}
          <span className={`text-[11px] sm:text-[13px] font-semibold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            {isUp ? "↑" : "↓"} {Math.abs(delta)}%
          </span>
          <span className="text-[10px] sm:text-[12px] text-slate-500">{deltaLabel}</span>
        </div>
        <svg width="80" height="30" viewBox="0 0 120 40" className="opacity-50 hidden sm:block shrink-0">
          <defs>
            <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points={`0,40 ${points} 120,40`}
            fill={`url(#grad-${label})`}
          />
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
}

/* ── Section Header (ServiceNow style) ─────────────────────────── */
function SectionHeader({ title, subtitle, color }: { title: string; subtitle: string; color: string }) {
  return (
    <div className="mt-6 sm:mt-8 mb-3 sm:mb-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`h-4 sm:h-5 w-1 sm:w-1.5 rounded-full ${color}`} />
        <div>
          <h2 className="text-[15px] sm:text-[18px] font-bold text-white">{title}</h2>
          <p className="text-[11px] sm:text-[13px] text-slate-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function CommandCenter({ activeRegion, selectedFarm, onSelectFarm }: Props) {
  const [visibleLayers, setVisibleLayers] = useState(DEFAULT_LAYERS);

  const filteredFarms = useMemo(
    () => activeRegion === "all" ? farms : farms.filter(f => f.region === activeRegion),
    [activeRegion]
  );

  const farmCounts = useMemo(() => ({
    total: filteredFarms.length,
    red: filteredFarms.filter(f => f.health === "red").length,
    amber: filteredFarms.filter(f => f.health === "amber").length,
    green: filteredFarms.filter(f => f.health === "green").length,
    white: filteredFarms.filter(f => f.health === "white").length,
  }), [filteredFarms]);

  const alertCount = useMemo(
    () => filteredFarms.filter(f => f.health === "red" || f.health === "amber").length +
          filteredFarms.filter(f => f.drivers.diseaseAlerts > 0).length,
    [filteredFarms]
  );

  const toggleLayer = (key: string) => {
    setVisibleLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="overflow-y-auto" style={{ height: "calc(100vh - 40px)" }}>
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-5">

        {/* ── Page Title ─────────────────────────────────────── */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-[17px] sm:text-[22px] font-bold text-white mb-1">AR C3 — Command & Control Center</h1>
          <p className="text-[12px] sm:text-[14px] text-slate-500">
            Monitor supply chain health, pricing intelligence, and AI-optimized resource allocation across 21 AAAID member countries.
          </p>
        </div>

        {/* ── Hero KPI Row ───────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <HeroKpi label="Total Livestock" value="142,500" delta={8.3} deltaLabel="Last 30 days" icon={Activity} color="#22c55e" sparkData={[105,112,108,118,125,130,128,135,140,142]} />
          <HeroKpi label="Active Farms" value="22" delta={-4.5} deltaLabel="vs. last month" icon={ShieldCheck} color="#06b6d4" sparkData={[28,26,25,24,23,22,23,22,22,22]} />
          <HeroKpi label="Avg. Price" value="$4.85/kg" delta={3.2} deltaLabel="Last 30 days" icon={DollarSign} color="#f59e0b" sparkData={[4.2,4.3,4.1,4.4,4.5,4.6,4.7,4.65,4.8,4.85]} />
          <HeroKpi label="Disease Alerts" value="3" delta={50} deltaLabel="vs. last week" icon={AlertTriangle} color="#ef4444" sparkData={[0,1,0,1,2,1,2,2,3,3]} />
          <HeroKpi label="Vaccination Rate" value="87%" delta={2.1} deltaLabel="Last 30 days" icon={Syringe} color="#a78bfa" sparkData={[78,80,81,82,83,84,85,85,86,87]} />
        </div>

        {/* ── Map ────────────────────────────────────────────── */}
        <div className="relative h-[35vh] sm:h-[40vh] md:h-[45vh] min-h-[250px] sm:min-h-[350px] rounded-xl sm:rounded-2xl overflow-hidden border border-[#0f1a2e] mb-4 sm:mb-6">
          <Suspense fallback={<div className="h-full bg-[#060a12] animate-pulse" />}>
            <DualRegionMap
              farms={filteredFarms}
              suppliers={suppliers}
              demandPoints={demandPoints}
              warehouses={warehouses}
              selectedFarm={selectedFarm}
              onSelectFarm={onSelectFarm}
              activeRegion={activeRegion}
              visibleLayers={visibleLayers}
            />
          </Suspense>
          <LayerPanel
            visibleLayers={visibleLayers}
            onToggleLayer={toggleLayer}
            farmCounts={farmCounts}
            alertCount={alertCount}
          />
          {selectedFarm && (
            <div className="absolute top-0 right-0 bottom-0 w-full sm:w-[380px] z-[1000] bg-[#080c16]/95 backdrop-blur-xl border-l border-[#0f1a2e] overflow-y-auto">
              <FarmDetailPanel farm={selectedFarm} onClose={() => onSelectFarm(null)} />
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 1: SUPPLY SIDE
            ═══════════════════════════════════════════════════════ */}
        <SectionHeader
          title="Supply Side"
          subtitle="Health status, vaccination, disease outbreaks, and farm monitoring across all regions."
          color="bg-emerald-400"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4 mb-2">
          <ExpandablePanel title="Farm Health Grid" className="sm:col-span-2 xl:col-span-2">
            <div className="max-h-[300px] overflow-hidden p-3">
              <FarmHealthGrid farms={filteredFarms} onSelectFarm={(f) => onSelectFarm(f)} />
            </div>
          </ExpandablePanel>
          <ExpandablePanel title="Disease Outbreak Monitor">
            <div className="max-h-[300px] overflow-hidden"><DiseaseOutbreakMonitor /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Supply Chain Monitor">
            <div className="max-h-[300px] overflow-hidden"><SupplyChainMonitor /></div>
          </ExpandablePanel>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4 mb-2">
          <ExpandablePanel title="Feed & Water Inventory">
            <div className="max-h-[260px] overflow-hidden"><FeedWaterInventory /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Halal Certification">
            <div className="max-h-[260px] overflow-hidden"><HalalCertTracker /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Weather Impact">
            <div className="max-h-[260px] overflow-hidden"><WeatherImpactPanel /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Compliance Dashboard">
            <div className="max-h-[260px] overflow-hidden"><ComplianceDashboard /></div>
          </ExpandablePanel>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4">
          <ExpandablePanel title="Breeding & Lifecycle">
            <div className="max-h-[240px] overflow-hidden"><BreedingLifecycleTracker /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Data Freshness">
            <div className="max-h-[240px] overflow-hidden"><DataFreshnessMonitor /></div>
          </ExpandablePanel>
          <ExpandablePanel title="ESG & Sustainability">
            <div className="max-h-[240px] overflow-hidden"><ESGTracker /></div>
          </ExpandablePanel>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 2: DEMAND SIDE
            ═══════════════════════════════════════════════════════ */}
        <SectionHeader
          title="Demand Side"
          subtitle="Pricing by country, region, and outlet. Market intelligence, currency, and seasonal demand."
          color="bg-amber-400"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4 mb-2">
          <ExpandablePanel title="Price Monitor" className="sm:col-span-2 xl:col-span-2">
            <div className="max-h-[300px] overflow-hidden p-3"><PriceMonitorPanel /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Market Ticker">
            <div className="max-h-[300px] overflow-hidden"><LivestockMarketTicker /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Currency Monitor">
            <div className="max-h-[300px] overflow-hidden"><CurrencyMonitor /></div>
          </ExpandablePanel>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4 mb-2">
          <ExpandablePanel title="Cost & Margin" className="sm:col-span-2 xl:col-span-2">
            <div className="max-h-[260px] overflow-hidden"><CostMarginAnalyzer /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Competitor Intel">
            <div className="max-h-[260px] overflow-hidden"><CompetitorIntel /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Seasonal Calendar">
            <div className="max-h-[260px] overflow-hidden"><SeasonalCalendar /></div>
          </ExpandablePanel>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4">
          <ExpandablePanel title="Shipment Tracker">
            <div className="max-h-[240px] overflow-hidden"><ShipmentTracker /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Live News">
            <div className="max-h-[240px] overflow-hidden"><LiveNewsPanel /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Alerts Feed">
            <div className="max-h-[240px] overflow-hidden"><AlertsFeed /></div>
          </ExpandablePanel>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 3: INTEGRATED VIEW
            ═══════════════════════════════════════════════════════ */}
        <SectionHeader
          title="Integrated View"
          subtitle="Risk management, price & resource optimization — AI-driven scenarios that balance supply with demand."
          color="bg-purple-400"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4 mb-2">
          <ExpandablePanel title="AI Supply Balancer" className="xl:col-span-2 border-purple-500/20">
            <div className="max-h-[300px] overflow-hidden"><AISupplyBalancer /></div>
          </ExpandablePanel>
          <ExpandablePanel title="AI Risk Predictor" className="xl:col-span-2 border-purple-500/20">
            <div className="max-h-[300px] overflow-hidden"><AIRiskPredictor /></div>
          </ExpandablePanel>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4 mb-2">
          <ExpandablePanel title="Supply & Demand" className="sm:col-span-2 xl:col-span-2">
            <div className="max-h-[280px] overflow-hidden p-3"><SupplyDemandPanel /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Demand Scenarios" className="sm:col-span-2 xl:col-span-2">
            <div className="max-h-[280px] overflow-hidden p-3"><DemandScenarioPanel /></div>
          </ExpandablePanel>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-4 mb-2">
          <ExpandablePanel title="Macro Stress Index">
            <div className="max-h-[260px] overflow-hidden"><MacroStressIndex /></div>
          </ExpandablePanel>
          <ExpandablePanel title="AI Command Intelligence" className="border-purple-500/10">
            <div className="max-h-[260px] overflow-hidden"><AIInsightsPanel /></div>
          </ExpandablePanel>
          <ExpandablePanel title="AI Scenarios" className="border-purple-500/10">
            <div className="max-h-[260px] overflow-hidden p-3"><AIScenarioPanel /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Risk Heatmap">
            <div className="max-h-[260px] overflow-hidden p-3"><RiskHeatmap /></div>
          </ExpandablePanel>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 pb-8">
          <ExpandablePanel title="Action Log">
            <div className="max-h-[240px] overflow-hidden"><ActionLog /></div>
          </ExpandablePanel>
          <ExpandablePanel title="Live News">
            <div className="max-h-[240px] overflow-hidden"><LiveNewsPanel /></div>
          </ExpandablePanel>
        </div>

      </div>
    </div>
  );
}
