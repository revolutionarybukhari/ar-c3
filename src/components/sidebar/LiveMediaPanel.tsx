import { useState } from "react";
import { Radio, Tv, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Channel {
  id: string;
  name: string;
  category: "finance" | "news" | "agriculture";
  embedUrl: string;
  color: string;
}

const channels: Channel[] = [
  { id: "bloomberg", name: "BLOOMBERG", category: "finance", embedUrl: "https://www.youtube.com/embed/dp8PhLsUcFE?autoplay=1&mute=1", color: "#f97316" },
  { id: "cnbc", name: "CNBC", category: "finance", embedUrl: "https://www.youtube.com/embed/9NyxcX3rhQs?autoplay=1&mute=1", color: "#3b82f6" },
  { id: "aljazeera", name: "AL JAZEERA", category: "news", embedUrl: "https://www.youtube.com/embed/F-POY4Q0QSI?autoplay=1&mute=1", color: "#f59e0b" },
  { id: "france24", name: "FRANCE 24", category: "news", embedUrl: "https://www.youtube.com/embed/Ap-UM1O9RBk?autoplay=1&mute=1", color: "#06b6d4" },
  { id: "dw", name: "DW NEWS", category: "news", embedUrl: "https://www.youtube.com/embed/GE_SfNVNyqk?autoplay=1&mute=1", color: "#8b5cf6" },
];

export default function LiveMediaPanel() {
  const [activeChannel, setActiveChannel] = useState(channels[0]);
  const [muted, setMuted] = useState(true);

  const embedUrl = muted
    ? activeChannel.embedUrl
    : activeChannel.embedUrl.replace("mute=1", "mute=0");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-1.5">
          <Tv className="h-3 w-3 text-red-400" />
          <span className="text-[9px] font-bold tracking-[0.2em] text-slate-600 uppercase">Live Media</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-500" />
          <span className="text-[8px] font-bold tracking-wider text-red-400 uppercase">Live</span>
        </div>
      </div>

      {/* Video player */}
      <div className="relative aspect-video bg-black">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={activeChannel.name}
        />
        {/* Controls overlay */}
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-2 py-1 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-1">
            <Radio className="h-2.5 w-2.5 text-red-400 live-dot" />
            <span className="text-[9px] font-bold text-white tracking-wider">{activeChannel.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setMuted(!muted)} className="text-white/70 hover:text-white transition-colors">
              {muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Channel selector */}
      <div className="flex flex-wrap gap-0.5 px-2 py-1.5">
        {channels.map(ch => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(ch)}
            className={cn(
              "px-1.5 py-0.5 text-[8px] font-bold tracking-wider rounded transition-colors",
              activeChannel.id === ch.id
                ? "text-white"
                : "text-slate-600 hover:text-slate-400"
            )}
            style={activeChannel.id === ch.id ? { backgroundColor: ch.color + "30", color: ch.color } : {}}
          >
            {ch.name}
          </button>
        ))}
      </div>
    </div>
  );
}
