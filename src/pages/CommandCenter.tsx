import { lazy, Suspense } from "react";
import type { Farm } from "@/types";
import { farms, suppliers, demandPoints, warehouses } from "@/data/mockData";
import KpiStrip from "@/components/dashboard/KpiStrip";
import FarmHealthGrid from "@/components/dashboard/FarmHealthGrid";
import SupplyDemandPanel from "@/components/dashboard/SupplyDemandPanel";
import AIScenarioPanel from "@/components/dashboard/AIScenarioPanel";
import DemandScenarioPanel from "@/components/dashboard/DemandScenarioPanel";
import PriceMonitorPanel from "@/components/dashboard/PriceMonitorPanel";
import RiskHeatmap from "@/components/dashboard/RiskHeatmap";
import FarmDetailPanel from "@/components/map/FarmDetailPanel";

const DualRegionMap = lazy(() => import("@/components/map/DualRegionMap"));

interface Props {
  activeRegion: string;
  selectedFarm: Farm | null;
  onSelectFarm: (farm: Farm | null) => void;
}

export default function CommandCenter({ activeRegion, selectedFarm, onSelectFarm }: Props) {
  const filteredFarms = activeRegion === "all"
    ? farms
    : farms.filter(f => f.region === activeRegion);

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <KpiStrip />

      {/* Map + Farm Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={selectedFarm ? "lg:col-span-8" : "lg:col-span-12"}>
          <Suspense fallback={<div className="h-[500px] bg-card rounded-lg animate-pulse" />}>
            <DualRegionMap
              farms={filteredFarms}
              suppliers={suppliers}
              demandPoints={demandPoints}
              warehouses={warehouses}
              selectedFarm={selectedFarm}
              onSelectFarm={onSelectFarm}
              activeRegion={activeRegion}
            />
          </Suspense>
        </div>
        {selectedFarm && (
          <div className="lg:col-span-4">
            <FarmDetailPanel farm={selectedFarm} onClose={() => onSelectFarm(null)} />
          </div>
        )}
      </div>

      {/* Supply-Demand + AI Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <SupplyDemandPanel />
        </div>
        <div className="lg:col-span-5">
          <AIScenarioPanel />
        </div>
      </div>

      {/* Farm Health Grid */}
      <FarmHealthGrid farms={filteredFarms} onSelectFarm={(f) => onSelectFarm(f)} />

      {/* Demand Scenarios */}
      <DemandScenarioPanel />

      {/* Price Monitor + Risk Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <PriceMonitorPanel />
        </div>
        <div className="lg:col-span-5">
          <RiskHeatmap />
        </div>
      </div>
    </div>
  );
}
