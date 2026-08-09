/**
 * Transparent clinic economics model for the VELURIA patient-acquisition
 * funnel. Every commercial assumption is adjustable and the output is a
 * scenario, never a forecast or guarantee.
 */
export interface RoiInputs {
  qualifiedEnquiries: number;
  bookRate: number;
  closeRate: number;
  courseValue: number;
  variableCourseCost: number;
  monthlyMarketingCost: number;
}

export interface RoiResult {
  consultations: number;
  courses: number;
  appointments: number;
  grossRevenue: number;
  deliveryCosts: number;
  contribution: number;
  breakEvenCourses: number | null;
}

export const ROI_DEFAULTS: RoiInputs = {
  qualifiedEnquiries: 24,
  bookRate: 35,
  closeRate: 25,
  courseValue: 600,
  variableCourseCost: 125,
  monthlyMarketingCost: 300,
};

export const ROI_BOUNDS = {
  qualifiedEnquiries: { min: 4, max: 200, step: 2 },
  bookRate: { min: 5, max: 60, step: 1 },
  closeRate: { min: 5, max: 60, step: 1 },
  courseValue: { min: 150, max: 2500, step: 50 },
  variableCourseCost: { min: 0, max: 1000, step: 25 },
  monthlyMarketingCost: { min: 0, max: 3000, step: 50 },
} as const;

const pct = (n: number) => Math.max(0, Math.min(100, n)) / 100;

export function computeRoi(input: RoiInputs): RoiResult {
  const enquiries = Math.max(0, input.qualifiedEnquiries);
  const consultations = enquiries * pct(input.bookRate);
  const courses = consultations * pct(input.closeRate);
  const courseValue = Math.max(0, input.courseValue);
  const variableCourseCost = Math.max(0, input.variableCourseCost);
  const marketingCost = Math.max(0, input.monthlyMarketingCost);
  const grossRevenue = courses * courseValue;
  const variableCosts = courses * variableCourseCost;
  const contribution = grossRevenue - variableCosts - marketingCost;
  const contributionPerCourse = courseValue - variableCourseCost;

  return {
    consultations: Math.round(consultations),
    courses: Math.round(courses * 10) / 10,
    appointments: Math.round(courses * 3),
    grossRevenue: Math.round(grossRevenue),
    deliveryCosts: Math.round(variableCosts + marketingCost),
    contribution: Math.round(contribution),
    breakEvenCourses:
      contributionPerCourse > 0
        ? Math.ceil(marketingCost / contributionPerCourse)
        : null,
  };
}

export function gbp(n: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}
