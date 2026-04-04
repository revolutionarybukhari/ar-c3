import { useState, useMemo, lazy, Suspense } from "react";
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
import LiveKpiStrip from "@/components/sidebar/LiveKpiStrip";
import AlertsFeed from "@/components/sidebar/AlertsFeed";
import LiveNewsPanel from "@/components/sidebar/LiveNewsPanel";
import LiveMediaPanel from "@/components/sidebar/LiveMediaPanel";

// Compact summary cards
import SupplyHealthSummary from "@/components/compact/SupplyHealthSummary";
import DemandPriceSummary from "@/components/compact/DemandPriceSummary";
import IntegratedOptSummary from "@/components/compact/IntegratedOptSummary";

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

/* Section header component */
function SectionHeader({ title, subtitle, color }: { title: string; subtitle: string; color: string }) {
  return (
    <div className="flex items-center gap-3 col-span-full">
      <div className={`h-3 w-1 rounded-full ${color}`} />
      <div>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">{title}</h2>
        <p className="text-[8px] text-slate-600 uppercase tracking-wider">{subtitle}</p>
      </div>
      <div className="flex-1 h-px bg-[#0f1a2e]" />
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
    <div className="h-[calc(100vh-40px)] flex flex-col overflow-hidden">
      {/* Top: Map + 3 Summary Cards */}
      <div className="flex gap-2 p-2 shrink-0" style={{ height: "32vh", minHeight: 220 }}>
        {/* Map */}
        <div className="relative flex-1 rounded-lg overflow-hidden border border-[#0f1a2e]">
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
            <div className="absolute top-0 right-0 bottom-0 w-[340px] z-[1000] bg-[#080c16]/95 backdrop-blur-xl border-l border-[#0f1a2e] overflow-y-auto">
              <FarmDetailPanel farm={selectedFarm} onClose={() => onSelectFarm(null)} />
            </div>
          )}
        </div>

        {/* 3 Summary Cards stacked */}
        <div className="flex flex-col gap-2 w-[260px] shrink-0">
          <div className="flex-1 rounded-lg border border-emerald-500/20 bg-[#0a0f1c] overflow-hidden">
            <SupplyHealthSummary />
          </div>
          <div className="flex-1 rounded-lg border border-amber-500/20 bg-[#0a0f1c] overflow-hidden">
            <DemandPriceSummary />
          </div>
          <div className="flex-1 rounded-lg border border-purple-500/20 bg-[#0a0f1c] overflow-hidden">
            <IntegratedOptSummary />
          </div>
        </div>
      </div>

      {/* Bottom: 3-Section Panel Grid */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <div className="grid grid-cols-12 gap-2">

          {/* ═══════════════ SECTION 1: SUPPLY SIDE ═══════════════ */}
          <SectionHeader
            title="Supply Side"
            subtitle="Health Check • Vaccination • Disease • Farm Status"
            color="bg-emerald-400"
          />

          <ExpandablePanel title="Farm Health Grid" className="col-span-4">
            <div className="max-h-[180px] overflow-hidden p-2">
              <FarmHealthGrid farms={filteredFarms} onSelectFarm={(f) => onSelectFarm(f)} />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Disease Outbreak Monitor" className="col-span-2">
            <div className="max-h-[180px] overflow-hidden">
              <DiseaseOutbreakMonitor />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Supply Chain Monitor" className="col-span-2">
            <div className="max-h-[180px] overflow-hidden">
              <SupplyChainMonitor />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Feed & Water Inventory" className="col-span-2">
            <div className="max-h-[180px] overflow-hidden">
              <FeedWaterInventory />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Halal Certification" className="col-span-2">
            <div className="max-h-[180px] overflow-hidden">
              <HalalCertTracker />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Weather Impact" className="col-span-3">
            <div className="max-h-[140px] overflow-hidden">
              <WeatherImpactPanel />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Breeding & Lifecycle" className="col-span-3">
            <div className="max-h-[140px] overflow-hidden">
              <BreedingLifecycleTracker />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Compliance Dashboard" className="col-span-3">
            <div className="max-h-[140px] overflow-hidden">
              <ComplianceDashboard />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Data Freshness" className="col-span-3">
            <div className="max-h-[140px] overflow-hidden">
              <DataFreshnessMonitor />
            </div>
          </ExpandablePanel>

          {/* ═══════════════ SECTION 2: DEMAND SIDE ═══════════════ */}
          <SectionHeader
            title="Demand Side"
            subtitle="Pricing • Market Intelligence • Currency • Seasonal"
            color="bg-amber-400"
          />

          <ExpandablePanel title="Price Monitor" className="col-span-4">
            <div className="max-h-[180px] overflow-hidden p-2">
              <PriceMonitorPanel />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Market Ticker" className="col-span-2">
            <div className="max-h-[180px] overflow-hidden">
              <LivestockMarketTicker />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Cost & Margin" className="col-span-2">
            <div className="max-h-[180px] overflow-hidden">
              <CostMarginAnalyzer />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Currency Monitor" className="col-span-2">
            <div className="max-h-[180px] overflow-hidden">
              <CurrencyMonitor />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Competitor Intel" className="col-span-2">
            <div className="max-h-[180px] overflow-hidden">
              <CompetitorIntel />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Seasonal Calendar" className="col-span-3">
            <div className="max-h-[140px] overflow-hidden">
              <SeasonalCalendar />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Shipment Tracker" className="col-span-3">
            <div className="max-h-[140px] overflow-hidden">
              <ShipmentTracker />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Live News" className="col-span-3">
            <div className="max-h-[140px] overflow-hidden">
              <LiveNewsPanel />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Alerts Feed" className="col-span-3">
            <div className="max-h-[140px] overflow-hidden">
              <AlertsFeed />
            </div>
          </ExpandablePanel>

          {/* ═══════════════ SECTION 3: INTEGRATED VIEW ═══════════════ */}
          <SectionHeader
            title="Integrated View"
            subtitle="Risk Management • Price & Resource Optimization • AI Scenarios"
            color="bg-purple-400"
          />

          <ExpandablePanel title="AI Supply Balancer" className="col-span-3 border-purple-500/20">
            <div className="max-h-[180px] overflow-hidden">
              <AISupplyBalancer />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="AI Risk Predictor" className="col-span-3 border-purple-500/20">
            <div className="max-h-[180px] overflow-hidden">
              <AIRiskPredictor />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Supply & Demand" className="col-span-3">
            <div className="max-h-[180px] overflow-hidden p-2">
              <SupplyDemandPanel />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Macro Stress Index" className="col-span-3">
            <div className="max-h-[180px] overflow-hidden">
              <MacroStressIndex />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="AI Command Intelligence" className="col-span-3 border-purple-500/10">
            <div className="max-h-[140px] overflow-hidden">
              <AIInsightsPanel />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="AI Scenarios" className="col-span-3 border-purple-500/10">
            <div className="max-h-[140px] overflow-hidden p-2">
              <AIScenarioPanel />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Demand Scenarios" className="col-span-2">
            <div className="max-h-[140px] overflow-hidden p-2">
              <DemandScenarioPanel />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Risk Heatmap" className="col-span-2">
            <div className="max-h-[140px] overflow-hidden p-2">
              <RiskHeatmap />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Action Log" className="col-span-2">
            <div className="max-h-[140px] overflow-hidden">
              <ActionLog />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="ESG & Sustainability" className="col-span-2">
            <div className="max-h-[140px] overflow-hidden">
              <ESGTracker />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Live KPIs" className="col-span-2">
            <div className="max-h-[140px] overflow-hidden">
              <LiveKpiStrip />
            </div>
          </ExpandablePanel>

          <ExpandablePanel title="Live Media" className="col-span-2">
            <div className="max-h-[140px] overflow-hidden">
              <LiveMediaPanel />
            </div>
          </ExpandablePanel>
        </div>
      </div>
    </div>
  );
}
