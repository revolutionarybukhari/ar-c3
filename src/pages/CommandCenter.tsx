import { useState, useMemo, lazy, Suspense } from "react";
import type { Farm } from "@/types";
import { farms, suppliers, demandPoints, warehouses } from "@/data/mockData";
import LayerPanel from "@/components/layout/LayerPanel";
import LiveKpiStrip from "@/components/sidebar/LiveKpiStrip";
import AlertsFeed from "@/components/sidebar/AlertsFeed";
import FarmDetailPanel from "@/components/map/FarmDetailPanel";
import AIScenarioPanel from "@/components/dashboard/AIScenarioPanel";
import SupplyDemandPanel from "@/components/dashboard/SupplyDemandPanel";
import DemandScenarioPanel from "@/components/dashboard/DemandScenarioPanel";
import PriceMonitorPanel from "@/components/dashboard/PriceMonitorPanel";
import RiskHeatmap from "@/components/dashboard/RiskHeatmap";
import FarmHealthGrid from "@/components/dashboard/FarmHealthGrid";

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
    <div className="flex h-full">
      {/* Left Sidebar — Layer Controls */}
      <LayerPanel
        visibleLayers={visibleLayers}
        onToggleLayer={toggleLayer}
        farmCounts={farmCounts}
        alertCount={alertCount}
      />

      {/* Center — Map + Bottom Panels */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Map area — takes ~55% of height */}
        <div className="relative flex-[55] min-h-0">
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

          {/* Farm detail overlay — slides in from right over map */}
          {selectedFarm && (
            <div className="absolute top-0 right-0 bottom-0 w-[340px] z-[1000] bg-[#080c16]/95 backdrop-blur-xl border-l border-[#0f1a2e] overflow-y-auto">
              <FarmDetailPanel farm={selectedFarm} onClose={() => onSelectFarm(null)} />
            </div>
          )}
        </div>

        {/* Bottom panels — scrollable */}
        <div className="flex-[45] min-h-0 overflow-y-auto border-t border-[#0f1a2e] bg-[#060a12]">
          <div className="p-4 space-y-4">
            {/* Supply-Demand + AI side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-7 bg-[#0a0f1c] rounded-lg border border-[#0f1a2e] p-4">
                <SupplyDemandPanel />
              </div>
              <div className="xl:col-span-5 bg-[#0a0f1c] rounded-lg border border-[#0f1a2e] p-4">
                <AIScenarioPanel />
              </div>
            </div>

            {/* Farm Health Grid */}
            <div className="bg-[#0a0f1c] rounded-lg border border-[#0f1a2e] p-4">
              <FarmHealthGrid farms={filteredFarms} onSelectFarm={(f) => onSelectFarm(f)} />
            </div>

            {/* Demand Scenarios */}
            <div className="bg-[#0a0f1c] rounded-lg border border-[#0f1a2e] p-4">
              <DemandScenarioPanel />
            </div>

            {/* Price + Risk */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-7 bg-[#0a0f1c] rounded-lg border border-[#0f1a2e] p-4">
                <PriceMonitorPanel />
              </div>
              <div className="xl:col-span-5 bg-[#0a0f1c] rounded-lg border border-[#0f1a2e] p-4">
                <RiskHeatmap />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar — Intel + KPIs */}
      <div className="w-[280px] shrink-0 border-l border-[#0f1a2e] bg-[#060a12] flex flex-col overflow-hidden">
        {/* KPI Section */}
        <div className="border-b border-[#0f1a2e]">
          <LiveKpiStrip />
        </div>

        {/* Alerts Feed */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <AlertsFeed />
        </div>
      </div>
    </div>
  );
}
