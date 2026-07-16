/**
 * ROI projection for a clinic running the AI skin-scan lead magnet on Meta ads.
 * Deliberately simple and transparent — every input is a slider the owner can
 * see and adjust, and the maths is a plain funnel so the number feels earned,
 * not conjured.
 *
 * Funnel:  ad clicks/scans  →  leads (opt-in %)  →  consultations (book %)
 *          →  Veluria courses sold (close %)  →  revenue (avg course value)
 */
export interface RoiInputs {
  /** Skin-scans started per month (from ads / social / website). */
  monthlyScans: number;
  /** % of scans that submit contact details (become a lead). */
  optInRate: number;
  /** % of leads that book a consultation. */
  bookRate: number;
  /** % of consultations that buy a Veluria course. */
  closeRate: number;
  /** Average value of a Veluria course (£). */
  courseValue: number;
}

export interface RoiResult {
  leads: number;
  consultations: number;
  courses: number;
  monthlyRevenue: number;
  annualRevenue: number;
}

export const ROI_DEFAULTS: RoiInputs = {
  monthlyScans: 150,
  optInRate: 55,
  bookRate: 40,
  closeRate: 35,
  courseValue: 600,
};

/** Sensible slider bounds for the UI. */
export const ROI_BOUNDS = {
  monthlyScans: { min: 20, max: 1000, step: 10 },
  optInRate: { min: 20, max: 90, step: 1 },
  bookRate: { min: 10, max: 80, step: 1 },
  closeRate: { min: 10, max: 70, step: 1 },
  courseValue: { min: 150, max: 2500, step: 50 },
} as const;

const pct = (n: number) => Math.max(0, Math.min(100, n)) / 100;

export function computeRoi(input: RoiInputs): RoiResult {
  const scans = Math.max(0, input.monthlyScans);
  const leads = scans * pct(input.optInRate);
  const consultations = leads * pct(input.bookRate);
  const courses = consultations * pct(input.closeRate);
  const monthlyRevenue = courses * Math.max(0, input.courseValue);
  return {
    leads: Math.round(leads),
    consultations: Math.round(consultations),
    courses: Math.round(courses),
    monthlyRevenue: Math.round(monthlyRevenue),
    annualRevenue: Math.round(monthlyRevenue * 12),
  };
}

/** £12,345 → "£12,345". */
export function gbp(n: number): string {
  return "£" + Math.round(n).toLocaleString("en-GB");
}
