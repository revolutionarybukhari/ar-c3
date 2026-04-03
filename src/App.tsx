import { useState, Suspense, lazy } from "react";
import type { Farm } from "@/types";
import Layout from "@/components/layout/Layout";
import Header from "@/components/layout/Header";

const CommandCenter = lazy(() => import("@/pages/CommandCenter"));
const MeatingPoint = lazy(() => import("@/pages/MeatingPoint"));
const Forecasting = lazy(() => import("@/pages/Forecasting"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-muted-foreground text-lg animate-pulse">
        Loading...
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
    </Layout>
  );
}

export default App;
