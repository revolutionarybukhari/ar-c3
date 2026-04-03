import { useState, useMemo, lazy, Suspense } from "react";
import type { Farm } from "@/types";
import { farms, suppliers, demandPoints, warehouses } from "@/data/mockData";
import LayerPanel from "@/components/layout/LayerPanel";
import LiveKpiStrip from "@/components/sidebar/LiveKpiStrip";
import AlertsFeed from "@/components/sidebar/AlertsFeed";
import LiveNewsPanel from "@/components/sidebar/LiveNewsPanel";
import AIInsightsPanel from "@/components/sidebar/AIInsightsPanel";
import LiveMediaPanel from "@/components/sidebar/LiveMediaPanel";
import FarmDetailPanel from "@/components/map/FarmDetailPanel";
import AIScenarioPanel from "@/components/dashboard/AIScenarioPanel";
import SupplyDemandPanel from "@/components/dashboard/SupplyDemandPanel";
import DemandScenarioPanel from "@/components/dashboard/DemandScenarioPanel";
import PriceMonitorPanel from "@/components/dashboard/PriceMonitorPanel";
import RiskHeatmap from "@/components/dashboard/RiskHeatmap";
import FarmHealthGrid from "@/components/dashboard/FarmHealthGrid";
import SupplyChainMonitor from "@/components/dashboard/SupplyChainMonitor";
import MacroStressIndex from "@/components/dashboard/MacroStressIndex";
import DiseaseOutbreakMonitor from "@/components/dashboard/DiseaseOutbreakMonitor";
import LivestockMarketTicker from "@/components/dashboard/LivestockMarketTicker";
import WeatherImpactPanel from "@/components/dashboard/WeatherImpactPanel";

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

const PC = "bg-[#0a0f1c] rounded-lg border border-[#0f1a2e] overflow-hidden";

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
    <div className="p-3 space-y-3">
      {/* Map — scrolls with page */}
      <div className="relative h-[55vh] min-h-[400px] rounded-lg overflow-hidden border border-[#0f1a2e]">
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

      {/* Panel grid — WorldMonitor style */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">

        {/* Live Media + KPIs + Market Ticker + Macro Stress */}
        <div className={PC}>
          <LiveMediaPanel />
        </div>
        <div className={PC}>
          <LiveKpiStrip />
        </div>
        <div className={PC}>
          <LivestockMarketTicker />
        </div>
        <div className={PC}>
          <MacroStressIndex />
        </div>

        {/* Supply Chain + Disease + Weather + Alerts */}
        <div className={PC}>
          <SupplyChainMonitor />
        </div>
        <div className={PC}>
          <DiseaseOutbreakMonitor />
        </div>
        <div className={PC}>
          <WeatherImpactPanel />
        </div>
        <div className={PC}>
          <AlertsFeed />
        </div>

        {/* AI Insights + News + AI Scenarios */}
        <div className={PC}>
          <AIInsightsPanel />
        </div>
        <div className={PC}>
          <LiveNewsPanel />
        </div>
        <div className={`xl:col-span-2 ${PC} p-4`}>
          <AIScenarioPanel />
        </div>

        {/* Supply-Demand (wide) + Demand Scenarios (wide) */}
        <div className={`xl:col-span-2 ${PC} p-4`}>
          <SupplyDemandPanel />
        </div>
        <div className={`xl:col-span-2 ${PC} p-4`}>
          <DemandScenarioPanel />
        </div>

        {/* Farm Health Grid (full width) */}
        <div className={`col-span-full ${PC} p-4`}>
          <FarmHealthGrid farms={filteredFarms} onSelectFarm={(f) => onSelectFarm(f)} />
        </div>

        {/* Price Monitor + Risk Heatmap */}
        <div className={`xl:col-span-2 ${PC} p-4`}>
          <PriceMonitorPanel />
        </div>
        <div className={`xl:col-span-2 ${PC} p-4`}>
          <RiskHeatmap />
        </div>
      </div>
    </div>
  );
}
