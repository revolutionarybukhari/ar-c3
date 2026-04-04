import WarehousePanel from "@/components/dashboard/WarehousePanel";
import PriceMonitorPanel from "@/components/dashboard/PriceMonitorPanel";
import RiskHeatmap from "@/components/dashboard/RiskHeatmap";
import KpiStrip from "@/components/dashboard/KpiStrip";
import LivestockMarketTicker from "@/components/dashboard/LivestockMarketTicker";
import CostMarginAnalyzer from "@/components/dashboard/CostMarginAnalyzer";
import CurrencyMonitor from "@/components/dashboard/CurrencyMonitor";
import CompetitorIntel from "@/components/dashboard/CompetitorIntel";
import SupplyDemandPanel from "@/components/dashboard/SupplyDemandPanel";
import DemandScenarioPanel from "@/components/dashboard/DemandScenarioPanel";
import HalalCertTracker from "@/components/dashboard/HalalCertTracker";
import SeasonalCalendar from "@/components/dashboard/SeasonalCalendar";
import ShipmentTracker from "@/components/dashboard/ShipmentTracker";
import AISupplyBalancer from "@/components/dashboard/AISupplyBalancer";
import LiveNewsPanel from "@/components/sidebar/LiveNewsPanel";

interface Props {
  activeRegion: string;
}

const PC = "bg-[#0a0f1c] rounded-lg border border-[#0f1a2e] overflow-hidden";

export default function MeatingPoint({ activeRegion: _activeRegion }: Props) {
  return (
    <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
      {/* KPI Strip — full width hero */}
      <div className={`${PC} p-3 sm:p-4`}>
        <KpiStrip />
      </div>

      {/* Panel grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3">

        {/* Row 1: Market Ticker + Price Monitor (wide) + Currency */}
        <div className={PC}><LivestockMarketTicker /></div>
        <div className={`xl:col-span-2 ${PC} p-4`}><PriceMonitorPanel /></div>
        <div className={PC}><CurrencyMonitor /></div>

        {/* Row 2: AI Supply Balancer (wide) + Supply-Demand (wide) */}
        <div className={`xl:col-span-2 ${PC} border-purple-500/20`}><AISupplyBalancer /></div>
        <div className={`xl:col-span-2 ${PC} p-4`}><SupplyDemandPanel /></div>

        {/* Row 3: Cost & Margin (wide) + Demand Scenarios (wide) */}
        <div className={`xl:col-span-2 ${PC}`}><CostMarginAnalyzer /></div>
        <div className={`xl:col-span-2 ${PC} p-4`}><DemandScenarioPanel /></div>

        {/* Row 4: Warehouse + Competitor Intel + Shipment Tracker + Halal Cert */}
        <div className={PC}><WarehousePanel /></div>
        <div className={PC}><CompetitorIntel /></div>
        <div className={PC}><ShipmentTracker /></div>
        <div className={PC}><HalalCertTracker /></div>

        {/* Row 5: Seasonal Calendar + Risk Heatmap + News */}
        <div className={PC}><SeasonalCalendar /></div>
        <div className={PC + " p-4"}><RiskHeatmap /></div>
        <div className={`xl:col-span-2 ${PC}`}><LiveNewsPanel /></div>
      </div>
    </div>
  );
}
