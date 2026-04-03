import { useState } from "react";
import { Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  source: string;
  category: "MARKET" | "DISEASE" | "TRADE" | "WEATHER" | "POLICY" | "SUPPLY";
  title: string;
  time: string;
  urgent: boolean;
}

const newsItems: NewsItem[] = [
  { id: "n1", source: "REUTERS", category: "DISEASE", title: "Indonesia reports new FMD cases in East Java province, export restrictions may follow", time: "3m ago", urgent: true },
  { id: "n2", source: "BLOOMBERG", category: "MARKET", title: "Live cattle futures rise 2.3% on tightening global supply outlook", time: "12m ago", urgent: false },
  { id: "n3", source: "FAO", category: "TRADE", title: "Pakistan flood impact: livestock losses estimated at $1.2B, supply routes disrupted", time: "28m ago", urgent: true },
  { id: "n4", source: "USDA", category: "SUPPLY", title: "Global sheep meat production forecast revised down 3.5% for Q2 2026", time: "45m ago", urgent: false },
  { id: "n5", source: "AL JAZEERA", category: "TRADE", title: "UAE-Indonesia halal meat corridor agreement enters final negotiation phase", time: "1h ago", urgent: false },
  { id: "n6", source: "REUTERS", category: "WEATHER", title: "La Niña advisory: drought conditions threaten Australian cattle feed supply", time: "2h ago", urgent: false },
  { id: "n7", source: "BLOOMBERG", category: "MARKET", title: "Saudi Arabia increases Hajj livestock import quota by 15% ahead of season", time: "2h ago", urgent: false },
  { id: "n8", source: "OIE", category: "DISEASE", title: "Rift Valley Fever outbreak contained in East Africa — travel ban partially lifted", time: "3h ago", urgent: false },
  { id: "n9", source: "FAO", category: "POLICY", title: "New EU carbon border adjustment impacts livestock feed imports from 2027", time: "4h ago", urgent: false },
  { id: "n10", source: "CNBC", category: "SUPPLY", title: "Cold chain logistics costs surge 22% in GCC region amid fuel price hikes", time: "5h ago", urgent: false },
  { id: "n11", source: "REUTERS", category: "TRADE", title: "Yemen-Singapore shipping lane reopens after 48h security closure", time: "6h ago", urgent: false },
  { id: "n12", source: "BLOOMBERG", category: "MARKET", title: "Goat meat premium over sheep narrows to 5-year low in Jakarta market", time: "7h ago", urgent: false },
];

const categoryColors: Record<string, string> = {
  MARKET: "bg-blue-500/15 text-blue-400",
  DISEASE: "bg-red-500/15 text-red-400",
  TRADE: "bg-cyan-500/15 text-cyan-400",
  WEATHER: "bg-amber-500/15 text-amber-400",
  POLICY: "bg-purple-500/15 text-purple-400",
  SUPPLY: "bg-emerald-500/15 text-emerald-400",
};

export default function LiveNewsPanel() {
  const [filter, setFilter] = useState<string>("ALL");
  const categories = ["ALL", "MARKET", "DISEASE", "TRADE", "SUPPLY", "WEATHER", "POLICY"];
  const filtered = filter === "ALL" ? newsItems : newsItems.filter(n => n.category === filter);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-1.5">
          <Newspaper className="h-3 w-3 text-cyan-400" />
          <span className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase">Livestock News</span>
          <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/15 text-cyan-400">{newsItems.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="live-dot h-1 w-1 rounded-full bg-emerald-400" />
          <span className="text-[8px] font-bold tracking-wider text-emerald-400 uppercase">Live</span>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-0.5 px-3 py-1.5 border-b border-[#0f1a2e]">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "px-1.5 py-0.5 text-[8px] font-semibold tracking-wider uppercase rounded transition-colors",
              filter === c ? "bg-[#1a2236] text-white" : "text-slate-600 hover:text-slate-400"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* News items */}
      <div className="max-h-[280px] overflow-y-auto">
        {filtered.map(item => (
          <div
            key={item.id}
            className={cn(
              "px-3 py-2 border-b border-[#0a1020] hover:bg-[#0a1020] transition-colors cursor-pointer",
              item.urgent && "border-l-2 border-l-red-500/50"
            )}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[8px] font-bold tracking-wider text-slate-500">{item.source}</span>
              <span className={cn("px-1 py-px rounded text-[7px] font-bold tracking-wider", categoryColors[item.category])}>
                {item.category}
              </span>
              {item.urgent && (
                <span className="px-1 py-px rounded text-[7px] font-bold tracking-wider bg-red-500/15 text-red-400 live-dot">URGENT</span>
              )}
              <span className="text-[8px] text-slate-700 ml-auto">{item.time}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
