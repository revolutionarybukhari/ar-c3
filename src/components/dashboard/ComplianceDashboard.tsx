import { useState } from "react";
import { FileCheck, FileText, Shield, Stethoscope, Container, Stamp } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DocType = "export-permit" | "import-license" | "vet-certificate" | "quarantine" | "customs";
type Status = "active" | "pending" | "expiring" | "expired" | "under-review";

interface ComplianceItem {
  id: string;
  type: DocType;
  entity: string;
  country: string;
  countryCode: string;
  documentId: string;
  issueDate: string;
  expiryDate: string;
  status: Status;
  authority: string;
  daysRemaining: number;
  action: string;
}

const items: ComplianceItem[] = [
  { id: "c1", type: "export-permit", entity: "Al-Rashid Livestock Farms", country: "Pakistan", countryCode: "PAK", documentId: "EP-2026-PKR-0482", issueDate: "2026-01-15", expiryDate: "2026-07-15", status: "active", authority: "Dept of Animal Quarantine — Pakistan", daysRemaining: 102, action: "Renewal window opens in 42 days" },
  { id: "c2", type: "import-license", entity: "PT Nusantara Livestock", country: "Indonesia", countryCode: "IDN", documentId: "IL-2026-IDN-1187", issueDate: "2025-12-01", expiryDate: "2026-06-01", status: "active", authority: "BKPM Indonesia", daysRemaining: 58, action: "Prepare Q3 renewal application" },
  { id: "c3", type: "vet-certificate", entity: "Kampala Cattle Cooperative", country: "Uganda", countryCode: "UGA", documentId: "VC-2026-UGA-0093", issueDate: "2026-03-20", expiryDate: "2026-04-19", status: "expiring", authority: "MAAIF Uganda", daysRemaining: 15, action: "Schedule re-inspection by Apr 12; vet visit pending" },
  { id: "c4", type: "quarantine", entity: "Sindh Province Hub", country: "Pakistan", countryCode: "PAK", documentId: "QC-2026-PKR-0211", issueDate: "2026-04-01", expiryDate: "2026-04-15", status: "expiring", authority: "Livestock & Dairy Dept — Sindh", daysRemaining: 11, action: "Quarantine clearance extension needed due to active PPR outbreak" },
  { id: "c5", type: "customs", entity: "Dubai Logistics Terminal", country: "UAE", countryCode: "ARE", documentId: "CD-2026-UAE-0567", issueDate: "2026-02-10", expiryDate: "2026-08-10", status: "active", authority: "Dubai Customs Authority", daysRemaining: 128, action: "No action required" },
  { id: "c6", type: "export-permit", entity: "Aden Port Authority", country: "Yemen", countryCode: "YEM", documentId: "EP-2026-YEM-0034", issueDate: "2025-10-01", expiryDate: "2026-04-01", status: "expired", authority: "Min. of Agriculture — Yemen", daysRemaining: -3, action: "URGENT: Permit expired. Halt shipments; submit emergency renewal" },
  { id: "c7", type: "import-license", entity: "SG Fresh Imports Pte", country: "Singapore", countryCode: "SGP", documentId: "IL-2026-SGP-0822", issueDate: "2026-03-01", expiryDate: "2026-09-01", status: "active", authority: "SFA Singapore", daysRemaining: 150, action: "Annual audit scheduled for Jul 2026" },
  { id: "c8", type: "vet-certificate", entity: "East Java Feedlot #3", country: "Indonesia", countryCode: "IDN", documentId: "VC-2026-IDN-0445", issueDate: "2026-02-15", expiryDate: "2026-05-15", status: "under-review", authority: "BKSDA East Java", daysRemaining: 41, action: "FMD zone review in progress; awaiting OIE field report" },
  { id: "c9", type: "quarantine", entity: "Mbarara Holding Station", country: "Uganda", countryCode: "UGA", documentId: "QC-2026-UGA-0107", issueDate: "2026-03-28", expiryDate: "2026-04-28", status: "pending", authority: "MAAIF Uganda", daysRemaining: 24, action: "Awaiting lab results for RVF batch testing" },
  { id: "c10", type: "customs", entity: "Tanjung Priok Terminal", country: "Indonesia", countryCode: "IDN", documentId: "CD-2026-IDN-0891", issueDate: "2026-01-20", expiryDate: "2026-04-20", status: "expiring", authority: "DJBC Indonesia", daysRemaining: 16, action: "Submit port clearance renewal before Apr 15 cutoff" },
];

const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  active: { label: "ACTIVE", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  pending: { label: "PENDING", color: "text-blue-400", bg: "bg-blue-500/10" },
  expiring: { label: "EXPIRING", color: "text-amber-400", bg: "bg-amber-500/10" },
  expired: { label: "EXPIRED", color: "text-red-400", bg: "bg-red-500/10" },
  "under-review": { label: "REVIEW", color: "text-purple-400", bg: "bg-purple-500/10" },
};

const typeIcons: Record<DocType, ReactNode> = {
  "export-permit": <Stamp className="h-3 w-3 text-cyan-400" />,
  "import-license": <FileText className="h-3 w-3 text-blue-400" />,
  "vet-certificate": <Stethoscope className="h-3 w-3 text-emerald-400" />,
  "quarantine": <Shield className="h-3 w-3 text-amber-400" />,
  "customs": <Container className="h-3 w-3 text-purple-400" />,
};

const typeLabels: Record<DocType, string> = {
  "export-permit": "Export Permit",
  "import-license": "Import License",
  "vet-certificate": "Vet Certificate",
  "quarantine": "Quarantine",
  "customs": "Customs",
};

type FilterKey = "all" | Status;

function urgencyColor(days: number): string {
  if (days < 0) return "text-red-400";
  if (days <= 14) return "text-red-400";
  if (days <= 30) return "text-amber-400";
  return "text-slate-500";
}

function urgencyBg(days: number): string {
  if (days < 0) return "bg-red-500/10";
  if (days <= 14) return "bg-red-500/10";
  if (days <= 30) return "bg-amber-500/10";
  return "bg-transparent";
}

export default function ComplianceDashboard() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts: Record<Status, number> = {
    active: items.filter(i => i.status === "active").length,
    pending: items.filter(i => i.status === "pending").length,
    expiring: items.filter(i => i.status === "expiring").length,
    expired: items.filter(i => i.status === "expired").length,
    "under-review": items.filter(i => i.status === "under-review").length,
  };

  const filtered = filter === "all" ? items : items.filter(i => i.status === filter);
  const urgentCount = items.filter(i => i.daysRemaining <= 14).length;

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#0f1a2e]">
        <div className="flex items-center gap-2">
          <FileCheck className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">Compliance Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          {urgentCount > 0 && (
            <>
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-400" />
              <span className="text-[8px] font-bold tracking-wider text-red-400 uppercase">{urgentCount} Urgent</span>
            </>
          )}
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#0f1a2e]">
        {(Object.entries(counts) as [Status, number][]).map(([status, count]) => {
          const cfg = statusConfig[status];
          return (
            <span key={status} className={cn("px-1.5 py-0.5 rounded text-[7px] font-bold tracking-wider", cfg.bg, cfg.color)}>
              {cfg.label} {count}
            </span>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 px-4 py-1.5 border-b border-[#0f1a2e]">
        {([
          { key: "all" as const, label: "ALL", count: items.length },
          { key: "active" as const, label: "ACTIVE", count: counts.active },
          { key: "expiring" as const, label: "EXPIRING", count: counts.expiring },
          { key: "pending" as const, label: "PENDING", count: counts.pending },
          { key: "expired" as const, label: "EXPIRED", count: counts.expired },
        ]).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-2 py-0.5 text-[8px] font-bold tracking-wider rounded transition-colors",
              filter === f.key ? "bg-[#1a2236] text-white" : "text-slate-600 hover:text-slate-400"
            )}
          >
            {f.label} <span className="text-slate-600">{f.count}</span>
          </button>
        ))}
      </div>

      <div className="max-h-[340px] overflow-y-auto divide-y divide-[#0f1a2e]">
        {filtered.map(item => {
          const st = statusConfig[item.status];
          return (
            <div
              key={item.id}
              className={cn(
                "px-4 py-2.5 hover:bg-[#0a1020] transition-colors border-l-2",
                item.status === "expired" ? "border-l-red-500" :
                item.status === "expiring" ? "border-l-amber-500" :
                item.status === "pending" ? "border-l-blue-500" :
                item.status === "under-review" ? "border-l-purple-500" :
                "border-l-emerald-500/30"
              )}
            >
              {/* Row 1: Type icon + entity + status */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {typeIcons[item.type]}
                  <span className="text-[10px] font-bold text-slate-200">{item.entity}</span>
                  <span className="text-[8px] text-slate-600 font-mono">{item.countryCode}</span>
                </div>
                <span className={cn("px-1.5 py-0.5 rounded text-[7px] font-bold tracking-wider", st.bg, st.color)}>
                  {st.label}
                </span>
              </div>

              {/* Row 2: Authority + doc ID + days */}
              <div className="flex items-center gap-2 mb-1 text-[8px]">
                <span className="text-slate-600">{typeLabels[item.type]}</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-500 font-mono">{item.documentId}</span>
                <span className="text-slate-700">|</span>
                <span className="text-slate-600 truncate">{item.authority}</span>
                <span className={cn(
                  "ml-auto px-1.5 py-0.5 rounded font-bold tabular-nums whitespace-nowrap",
                  urgencyBg(item.daysRemaining),
                  urgencyColor(item.daysRemaining)
                )}>
                  {item.daysRemaining < 0 ? `${Math.abs(item.daysRemaining)}d overdue` : `${item.daysRemaining}d left`}
                </span>
              </div>

              {/* Row 3: Action */}
              <p className="text-[8px] text-slate-500 leading-relaxed">
                {item.daysRemaining <= 0 && <span className="text-red-400 font-bold">!! </span>}
                {item.action}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
