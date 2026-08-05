import type { BrandConfig } from "./brand";

export const CAMPAIGN_ID = "veluria-consultation-2026" as const;

export type ClinicSegment =
  | "skin-rejuvenation"
  | "injectables-regenerative"
  | "device-led"
  | "dermatology"
  | "surgical-aesthetics"
  | "hair-scalp";

export type CampaignProductId =
  | "silk-skin"
  | "ultra-lift"
  | "pearl-tone"
  | "hair-force-plus";

export type CampaignStage =
  | "overview"
  | "demo"
  | "report"
  | "roi"
  | "email-1"
  | "email-2"
  | "email-3"
  | "email-4"
  | "linkedin-inmail"
  | "linkedin-1"
  | "linkedin-2"
  | "linkedin-3"
  | "linkedin-4"
  | "linkedin-5"
  | "linkedin-6"
  | "linkedin-7";

export type OutreachEventName =
  | "outreach_click"
  | "landing_view"
  | "ai_start"
  | "ai_complete"
  | "report_view"
  | "roi_view"
  | "booking_click";

export interface EvidenceSource {
  label: string;
  url: string;
  verifiedAt: string;
}

export interface ClinicSignal {
  label: string;
  detail: string;
  sourceUrl: string;
}

export interface ClinicProfile {
  id: string;
  slug: string;
  clinicName: string;
  city: string;
  website: string;
  segment: ClinicSegment;
  legalEntityType: "corporate" | "sole-trader" | "partnership" | "unknown";
  status: "verified" | "demo" | "held";
  verifiedAt: string;
  brand: Pick<BrandConfig, "accent">;
  signals: ClinicSignal[];
  evidence: EvidenceSource[];
  relevantProducts: CampaignProductId[];
  heroEyebrow: string;
  heroHeadline: string;
  heroIntro: string;
  productFit: string;
  pipelineOpportunity: string;
  consultationRationale: string;
}

export const CAMPAIGN_PRODUCT_LABELS: Record<CampaignProductId, string> = {
  "silk-skin": "VELURIA Silk Skin",
  "ultra-lift": "VELURIA Ultra Lift",
  "pearl-tone": "VELURIA Pearl Tone",
  "hair-force-plus": "VELURIA Hair Force+",
};

export const CAMPAIGN_STAGE_TO_VIEW: Record<CampaignStage, "landing" | "demo" | "report" | "roi"> = {
  overview: "landing",
  demo: "demo",
  report: "report",
  roi: "roi",
  "email-1": "landing",
  "email-2": "demo",
  "email-3": "report",
  "email-4": "landing",
  "linkedin-inmail": "landing",
  "linkedin-1": "landing",
  "linkedin-2": "demo",
  "linkedin-3": "report",
  "linkedin-4": "demo",
  "linkedin-5": "report",
  "linkedin-6": "report",
  "linkedin-7": "landing",
};

export function isCampaignStage(value: unknown): value is CampaignStage {
  return typeof value === "string" && value in CAMPAIGN_STAGE_TO_VIEW;
}

export function isOutreachEventName(value: unknown): value is OutreachEventName {
  return (
    value === "outreach_click" ||
    value === "landing_view" ||
    value === "ai_start" ||
    value === "ai_complete" ||
    value === "report_view" ||
    value === "roi_view" ||
    value === "booking_click"
  );
}
