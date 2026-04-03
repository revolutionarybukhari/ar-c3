import { Shield, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  activeView: string;
  onViewChange: (view: string) => void;
  activeRegion: string;
  onRegionChange: (region: string) => void;
}

const navItems = [
  { id: "command-center", label: "Command Center" },
  { id: "meating-point", label: "Meating Point" },
  { id: "forecasting", label: "Forecasting" },
];

const regions = [
  { id: "all", label: "All Regions" },
  { id: "indonesia", label: "Indonesia" },
  { id: "gcc", label: "GCC" },
];

export default function Header({
  activeView,
  onViewChange,
  activeRegion,
  onRegionChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e293b]/40 bg-[#080c16]/95 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-blue-500" />
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold tracking-tight text-white">
              AR C3
            </span>
            <span className="hidden sm:inline text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
              Alia Risk Command & Control
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "relative px-4 py-1.5 text-[12px] font-medium transition-colors duration-200",
                activeView === item.id
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {item.label}
              {activeView === item.id && (
                <span className="absolute inset-x-2 -bottom-[15px] h-[2px] bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-md border border-[#1e293b]/50 bg-[#0a0e1a]/60">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => onRegionChange(r.id)}
                className={cn(
                  "px-3 py-1 text-[11px] font-medium transition-colors duration-200",
                  activeRegion === r.id
                    ? "bg-[#1e293b] text-white"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button className="relative flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:text-slate-300 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
