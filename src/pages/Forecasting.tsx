import ForecastSimulator from "@/components/dashboard/ForecastSimulator";
import SupplyDemandPanel from "@/components/dashboard/SupplyDemandPanel";
import AIScenarioPanel from "@/components/dashboard/AIScenarioPanel";
import KpiStrip from "@/components/dashboard/KpiStrip";

interface Props {
  activeRegion: string;
}

export default function Forecasting({ activeRegion }: Props) {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      <KpiStrip />

      <ForecastSimulator />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <SupplyDemandPanel />
        </div>
        <div className="lg:col-span-5">
          <AIScenarioPanel />
        </div>
      </div>
    </div>
  );
}
