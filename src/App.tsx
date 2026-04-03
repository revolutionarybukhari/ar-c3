import { useState, Suspense, lazy } from "react";
import type { Farm } from "@/types";
import Layout from "@/components/layout/Layout";
import Header from "@/components/layout/Header";

const CommandCenter = lazy(() => import("@/pages/CommandCenter"));
const MeatingPoint = lazy(() => import("@/pages/MeatingPoint"));
const Forecasting = lazy(() => import("@/pages/Forecasting"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center flex-1">
      <div className="text-slate-600 text-xs font-mono tracking-wider animate-pulse uppercase">
        Initializing...
      </div>
    </div>
  );
}

function App() {
  const [activeView, setActiveView] = useState("command-center");
  const [activeRegion, setActiveRegion] = useState("all");
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  return (
    <Layout>
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        activeRegion={activeRegion}
        onRegionChange={setActiveRegion}
      />
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<LoadingFallback />}>
          {activeView === "command-center" && (
            <CommandCenter
              activeRegion={activeRegion}
              selectedFarm={selectedFarm}
              onSelectFarm={setSelectedFarm}
            />
          )}
          {activeView === "meating-point" && (
            <MeatingPoint activeRegion={activeRegion} />
          )}
          {activeView === "forecasting" && (
            <Forecasting activeRegion={activeRegion} />
          )}
        </Suspense>
      </div>
    </Layout>
  );
}

export default App;
