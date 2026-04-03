import { useState } from "react";
import { Shield, Building2, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";

interface CertEntry {
  id: string;
  entity: string;
  type: "farm" | "supplier";
  country: string;
  certBody: string;
  certNumber: string;
  issueDate: string;
  expiryDate: string;
  status: "valid" | "expiring" | "expired" | "pending";
  daysRemaining: number;
  lastAudit: string;
}

const entries: CertEntry[] = [
  { id: "h1", entity: "PT Agro Nusantara Farm", type: "farm", country: "Indonesia", certBody: "MUI", certNumber: "MUI-IDN-2024-08831", issueDate: "2025-06-01", expiryDate: "2027-05-31", status: "valid", daysRemaining: 423, lastAudit: "2026-01-15" },
  { id: "h2", entity: "Al-Rashid Livestock Co.", type: "supplier", country: "UAE", certBody: "ESMA", certNumber: "ESMA-UAE-2025-4410", issueDate: "2025-09-10", expiryDate: "2026-09-09", status: "valid", daysRemaining: 158, lastAudit: "2026-02-20" },
  { id: "h3", entity: "Karachi Meatpacking Ltd.", type: "supplier", country: "Pakistan", certBody: "SANHA", certNumber: "SANHA-PAK-2023-7201", issueDate: "2023-11-01", expiryDate: "2026-04-30", status: "expiring", daysRemaining: 26, lastAudit: "2025-10-12" },
  { id: "h4", entity: "Java Barat Cattle Ranch", type: "farm", country: "Indonesia", certBody: "MUI", certNumber: "MUI-IDN-2024-09102", issueDate: "2024-12-15", expiryDate: "2026-12-14", status: "valid", daysRemaining: 254, lastAudit: "2026-03-01" },
  { id: "h5", entity: "Mombasa Export Hub", type: "supplier", country: "Kenya", certBody: "KEBS", certNumber: "KEBS-KEN-2024-1155", issueDate: "2024-03-01", expiryDate: "2026-02-28", status: "expired", daysRemaining: -35, lastAudit: "2025-08-10" },
  { id: "h6", entity: "Johor Livestock Sdn Bhd", type: "supplier", country: "Malaysia", certBody: "JAKIM", certNumber: "JAKIM-MYS-2025-3340", issueDate: "2025-07-20", expiryDate: "2027-07-19", status: "valid", daysRemaining: 471, lastAudit: "2026-01-28" },
  { id: "h7", entity: "Riyadh Premium Meats", type: "supplier", country: "Saudi Arabia", certBody: "SFDA", certNumber: "SFDA-SAU-2025-6621", issueDate: "2025-10-01", expiryDate: "2026-04-15", status: "expiring", daysRemaining: 11, lastAudit: "2026-03-20" },
  { id: "h8", entity: "Sulawesi Highland Farm", type: "farm", country: "Indonesia", certBody: "MUI", certNumber: "MUI-IDN-2025-10054", issueDate: "2025-04-01", expiryDate: "2027-03-31", status: "valid", daysRemaining: 362, lastAudit: "2025-12-05" },
  { id: "h9", entity: "Aden Trading Group", type: "supplier", country: "Yemen", certBody: "YSMO", certNumber: "YSMO-YEM-2023-0882", issueDate: "2023-06-15", expiryDate: "2025-06-14", status: "expired", daysRemaining: -295, lastAudit: "2024-12-01" },
  { id: "h10", entity: "Bandung Organik Farm", type: "farm", country: "Indonesia", certBody: "MUI", certNumber: "MUI-IDN-2026-11200", issueDate: "2026-04-01", expiryDate: "2028-03-31", status: "pending", daysRemaining: 727, lastAudit: "2026-03-28" },
  { id: "h11", entity: "Dubai Halal Foods FZCO", type: "supplier", country: "UAE", certBody: "ESMA", certNumber: "ESMA-UAE-2024-3892", issueDate: "2024-08-01", expiryDate: "2026-07-31", status: "valid", daysRemaining: 118, lastAudit: "2026-02-14" },
  { id: "h12", entity: "Lahore Cold Chain Corp", type: "supplier", country: "Pakistan", certBody: "SANHA", certNumber: "SANHA-PAK-2025-8100", issueDate: "2025-11-20", expiryDate: "2026-05-20", status: "expiring", daysRemaining: 46, lastAudit: "2026-03-10" },
];

const statusConfig = {
  valid:    { label: "VALID",    color: "text-[#22c55e]", bg: "bg-[#22c55e]/15" },
  expiring: { label: "EXPIRING", color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/15" },
  expired:  { label: "EXPIRED",  color: "text-[#ef4444]", bg: "bg-[#ef4444]/15" },
  pending:  { label: "PENDING",  color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/15" },
};

function daysColor(days: number): string {
  if (days < 30) return "#ef4444";
  if (days < 90) return "#f59e0b";
  return "#22c55e";
}

function certProgress(issueDate: string, expiryDate: string): number {
  const start = new Date(issueDate).getTime();
  const end = new Date(expiryDate).getTime();
  const now = new Date("2026-04-04").getTime();
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.round(((now - start) / (end - start)) * 100);
}

export default function HalalCertTracker() {
  const [filter, setFilter] = useState<"all" | "valid" | "expiring" | "expired" | "pending">("all");
  const filtered = filter === "all" ? entries : entries.filter(e => e.status === filter);

  const counts = {
    all: entries.length,
    valid: entries.filter(e => e.status === "valid").length,
    expiring: entries.filter(e => e.status === "expiring").length,
    expired: entries.filter(e => e.status === "expired").length,
    pending: entries.filter(e => e.status === "pending").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Halal Certification Tracker</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[8px] font-bold tracking-wider text-emerald-400 uppercase">{entries.length} Tracked</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-[#0f1a2e]">
        {([
          { key: "all" as const, label: "ALL" },
          { key: "valid" as const, label: "VALID" },
          { key: "expiring" as const, label: "EXPIRING" },
          { key: "expired" as const, label: "EXPIRED" },
          { key: "pending" as const, label: "PENDING" },
        ]).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-2 py-0.5 text-[8px] font-bold tracking-wider rounded transition-colors",
              filter === f.key ? "bg-[#1a2236] text-white" : "text-slate-600 hover:text-slate-400"
            )}
          >
            {f.label} <span className="text-slate-600">{counts[f.key]}</span>
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="max-h-[320px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {filtered.map(e => {
          const sc = statusConfig[e.status];
          const progress = certProgress(e.issueDate, e.expiryDate);
          const progressBarColor = e.status === "expired" ? "#ef4444"
            : e.status === "pending" ? "#3b82f6"
            : daysColor(e.daysRemaining);

          return (
            <div key={e.id} className="px-4 py-2.5 hover:bg-[#0a1020] transition-colors">
              {/* Row 1: Entity + Status */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {e.type === "farm"
                    ? <Warehouse className="h-2.5 w-2.5 text-slate-600" />
                    : <Building2 className="h-2.5 w-2.5 text-slate-600" />
                  }
                  <span className="text-[10px] font-bold text-slate-200">{e.entity}</span>
                  <span className="px-1 py-px rounded text-[7px] font-bold tracking-wider bg-[#1a2236] text-slate-500 uppercase">
                    {e.type}
                  </span>
                </div>
                <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider", sc.bg, sc.color)}>
                  {sc.label}
                </span>
              </div>

              {/* Row 2: Cert info */}
              <div className="flex items-center gap-2 mb-1.5 text-[9px]">
                <span className="text-slate-500">{e.country}</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-400 font-semibold">{e.certBody}</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-500 font-mono text-[8px]">{e.certNumber}</span>
              </div>

              {/* Row 3: Progress bar */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[8px] text-slate-600 w-[52px]">{e.issueDate}</span>
                <div className="flex-1 h-1 bg-[#1a2236] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${progress}%`, backgroundColor: progressBarColor }}
                  />
                </div>
                <span className="text-[8px] text-slate-600 w-[52px] text-right">{e.expiryDate}</span>
              </div>

              {/* Row 4: Days remaining + last audit */}
              <div className="flex items-center justify-between text-[8px]">
                <div className="flex items-center gap-3">
                  <span className="font-bold tabular-nums" style={{ color: e.status === "pending" ? "#3b82f6" : daysColor(e.daysRemaining) }}>
                    {e.status === "expired"
                      ? `${Math.abs(e.daysRemaining)}d overdue`
                      : e.status === "pending"
                        ? "Pending approval"
                        : `${e.daysRemaining}d remaining`
                    }
                  </span>
                </div>
                <span className="text-slate-600">Last audit: {e.lastAudit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
