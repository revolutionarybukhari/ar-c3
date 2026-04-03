import WarehousePanel from "@/components/dashboard/WarehousePanel";
import PriceMonitorPanel from "@/components/dashboard/PriceMonitorPanel";
import RiskHeatmap from "@/components/dashboard/RiskHeatmap";
import KpiStrip from "@/components/dashboard/KpiStrip";

interface Props {
  activeRegion: string;
}

export default function MeatingPoint({ activeRegion }: Props) {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      <KpiStrip />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <WarehousePanel />
        </div>
        <div className="lg:col-span-5">
          <RiskHeatmap />
        </div>
      </div>

      <PriceMonitorPanel />
    </div>
  );
}
