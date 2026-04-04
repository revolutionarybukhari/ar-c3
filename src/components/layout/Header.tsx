import { Shield, Bell, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  activeView: string;
  onViewChange: (view: string) => void;
  activeRegion: string;
  onRegionChange: (region: string) => void;
}

const navItems = [
  { id: "command-center", label: "COMMAND CENTER" },
  { id: "meating-point", label: "MEATING POINT" },
  { id: "forecasting", label: "FORECASTING" },
];

const regions = [
  { id: "all", label: "ALL" },
  { id: "indonesia", label: "IDN" },
  { id: "gcc", label: "GCC" },
];

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="text-[11px] font-medium text-slate-500 tabular-nums tracking-wider">
      {time.toLocaleTimeString("en-US", { hour12: false })} UTC+7
    </span>
  );
}

export default function Header({
  activeView,
  onViewChange,
  activeRegion,
  onRegionChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#0f1a2e] bg-[#060a12]/98 backdrop-blur-sm">
      <div className="flex h-10 items-center justify-between px-2 sm:px-4 gap-1 sm:gap-2">
        {/* Brand */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-blue-500/15">
            <Shield className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-white uppercase">
            AR C3
          </span>
          <span className="hidden xl:inline text-[9px] font-medium tracking-[0.2em] text-slate-600 uppercase border-l border-slate-800 pl-2.5 ml-0.5">
            Alia Risk Command &amp; Control
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "px-2 sm:px-3 py-1 text-[8px] sm:text-[10px] font-semibold tracking-[0.1em] sm:tracking-[0.15em] transition-colors whitespace-nowrap shrink-0",
                activeView === item.id
                  ? "text-blue-400 bg-blue-500/8 border border-blue-500/20 rounded"
                  : "text-slate-600 hover:text-slate-400"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Live indicator */}
          <div className="flex items-center gap-1">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="hidden sm:inline text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">Live</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-800" />

          {/* Clock */}
          <div className="hidden md:flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-slate-600" />
            <LiveClock />
          </div>

          <div className="hidden md:block h-4 w-px bg-slate-800" />

          {/* Region toggle */}
          <div className="flex items-center rounded border border-[#1a2236]">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => onRegionChange(r.id)}
                className={cn(
                  "px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold tracking-wider transition-colors",
                  activeRegion === r.id
                    ? "bg-[#1a2236] text-white"
                    : "text-slate-600 hover:text-slate-400"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Notifications */}
          <button className="relative flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:text-slate-400 transition-colors">
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500 live-dot" />
          </button>
        </div>
      </div>
    </header>
  );
}
