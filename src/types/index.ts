export type HealthStatus = "red" | "amber" | "green";
export type SKU = "sheep" | "goat" | "cattle";
export type Region = "indonesia" | "gcc";

export interface Farm {
  id: string;
  name: string;
  region: Region;
  country: string;
  province: string;
  lat: number;
  lng: number;
  sku: SKU;
  capacityPerDay: number;
  health: HealthStatus;
  stockPressure: number;
  onTimePct: number;
  defectPct: number;
  drivers: HealthDrivers;
  trendData: number[];
}

export interface HealthDrivers {
  mortalityRate: number;
  diseaseAlerts: number;
  feedDaysLeft: number;
  vaccineDaysLeft: number;
  waterStatus: "ok" | "low" | "critical";
  powerStatus: "ok" | "backup" | "down";
  staffingPct: number;
  lastVetCheck: string;
  vaccinationStatus: "current" | "due" | "overdue";
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  region: Region;
  lat: number;
  lng: number;
  type: "farm" | "aggregator" | "cooperative";
  capacity: number;
  health: HealthStatus;
  certifications: { halal: "valid" | "expiring" | "missing"; vet: "valid" | "expiring" | "missing" };
}

export interface PricePoint {
  country: string;
  region: string;
  outlet: string;
  sku: SKU;
  priceLow: number;
  priceMean: number;
  priceHigh: number;
  currency: string;
  lastUpdated: string;
}

export interface DemandPoint {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  volume: number;
  growthRate: number;
  level: "low" | "medium" | "high" | "critical";
}

export interface AIScenario {
  id: string;
  title: string;
  type: "supply_shock" | "demand_surge" | "sanction" | "disease_outbreak" | "price_disruption";
  description: string;
  impact: string;
  recommendations: AIRecommendation[];
  affectedRegions: string[];
  severity: HealthStatus;
}

export interface AIRecommendation {
  id: string;
  action: string;
  rationale: string;
  impact: string;
  priority: "high" | "medium" | "low";
  estimatedSavings?: number;
}

export interface KpiItem {
  label: string;
  value: string;
  delta: number;
  sparkline: number[];
  prefix?: string;
}

export interface SeasonalData {
  week: number;
  demand: number;
  supply: number;
  inventory: number;
  season?: string;
}

export interface RiskCell {
  category: string;
  region: string;
  score: number;
  trend: "up" | "down" | "stable";
}

export interface Warehouse {
  id: string;
  name: string;
  country: string;
  type: "warehouse" | "port" | "hub";
  lat: number;
  lng: number;
  doi: number;
  quantity: number;
  capacity: number;
  health: HealthStatus;
}
