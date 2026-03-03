export interface ServiceTier {
  id: string;
  name: string;
  price: number;
}

export interface Service {
  name: string;
  icon: string;
  category: string;
  tiers: ServiceTier[];
}

export interface CarrierDiscount {
  service: string;
  price: number;
}

export interface Carrier {
  name: string;
  price: number | null;
  freeServices?: string[];
  discounts?: CarrierDiscount[];
  perks?: boolean;
  notes?: string;
}

export interface VerizonPerk {
  id: string;
  name: string;
  price: number;
  coversServices: string[];
  savingsVsRetail: number;
  notes?: string;
}

export interface Card {
  name: string;
  fee: number;
  streamingCredit?: number;
  creditServices?: string[];
  walmartCredit?: number;
  cashbackRate?: number;
  cashbackOn?: string;
  disneyCredit?: number;
  pointsMultiplier?: number;
  pointValue?: number;
  notes?: string;
}

export interface UserSub {
  serviceId: string;
  currentTier: string;
  currentPrice: number;
  wantsRemoved?: boolean;
  usingAmexCredit?: boolean;
}

export interface Household {
  adults: number;
  kids: number;
  homes: number;
}

export type RecommendationType =
  | "carrier_free"
  | "verizon_perk"
  | "card_credit"
  | "stack"
  | "bundle"
  | "family"
  | "redundant"
  | "removal";

export interface Recommendation {
  type: RecommendationType;
  priority: number;
  service: string;
  action: string;
  detail: string;
  savings: number;
}

export interface OptimizationResult {
  recommendations: Recommendation[];
  totalCurrentMonthly: number;
  totalSavings: number;
}
