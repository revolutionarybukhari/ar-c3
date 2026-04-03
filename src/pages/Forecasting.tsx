import ForecastSimulator from "@/components/dashboard/ForecastSimulator";
import SupplyDemandPanel from "@/components/dashboard/SupplyDemandPanel";
import AIScenarioPanel from "@/components/dashboard/AIScenarioPanel";
import MacroStressIndex from "@/components/dashboard/MacroStressIndex";
import LivestockMarketTicker from "@/components/dashboard/LivestockMarketTicker";
import SupplyChainMonitor from "@/components/dashboard/SupplyChainMonitor";

interface Props {
  activeRegion: string;
}

const PC = "bg-[#0a0f1c] rounded-lg border border-[#0f1a2e] overflow-hidden";

export default function Forecasting({ activeRegion: _activeRegion }: Props) {
  return (
    <div className="p-3 space-y-3">
      {/* Forecast Simulator — full width, hero panel */}
      <div className={`${PC} p-4`}>
        <ForecastSimulator />
      </div>

      {/* Supporting panels grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        <div className={`xl:col-span-2 ${PC} p-4`}>
          <SupplyDemandPanel />
        </div>
        <div className={PC}>
          <MacroStressIndex />
        </div>
        <div className={PC}>
          <LivestockMarketTicker />
        </div>
        <div className={`xl:col-span-2 ${PC} p-4`}>
          <AIScenarioPanel />
        </div>
        <div className={`xl:col-span-2 ${PC}`}>
          <SupplyChainMonitor />
        </div>
      </div>
    </div>
  );
}
