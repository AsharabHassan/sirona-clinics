/**
 * Transparent two-stream clinic economics model for the VELURIA funnel.
 * Every commercial assumption is adjustable and the output is an illustrative
 * scenario, never a forecast or guarantee.
 */
export interface RoiInputs {
  dailyAdSpend: number;
  qualifiedPaidLeads: number;
  newPatientCourses: number;
  reactivatedPatientCourses: number;
  sessionFee: number;
  sessionsPerCourse: number;
  directCostPerCourse: number;
  reactivationSpend: number;
}

export interface RoiResult {
  monthlyAdSpend: number;
  costPerQualifiedLead: number;
  leadToCourseRate: number;
  totalPatientCourses: number;
  appointments: number;
  paidAcquisitionRevenue: number;
  reactivationRevenue: number;
  grossRevenue: number;
  marketingSpend: number;
  directDeliveryCosts: number;
  totalCosts: number;
  contribution: number;
  breakEvenCourses: number | null;
}

export const ROI_DEFAULTS: RoiInputs = {
  dailyAdSpend: 15,
  qualifiedPaidLeads: 24,
  newPatientCourses: 6,
  reactivatedPatientCourses: 3,
  sessionFee: 299,
  sessionsPerCourse: 3,
  directCostPerCourse: 125,
  reactivationSpend: 150,
};

export const ROI_BOUNDS = {
  dailyAdSpend: { min: 5, max: 200, step: 5 },
  qualifiedPaidLeads: { min: 1, max: 200, step: 1 },
  newPatientCourses: { min: 0, max: 100, step: 1 },
  reactivatedPatientCourses: { min: 0, max: 100, step: 1 },
  sessionFee: { min: 100, max: 1000, step: 1 },
  sessionsPerCourse: { min: 1, max: 6, step: 1 },
  directCostPerCourse: { min: 0, max: 1000, step: 25 },
  reactivationSpend: { min: 0, max: 3000, step: 25 },
} as const;

const safe = (n: number) => Math.max(0, Number.isFinite(n) ? n : 0);

export function computeRoi(input: RoiInputs): RoiResult {
  const dailyAdSpend = safe(input.dailyAdSpend);
  const qualifiedPaidLeads = safe(input.qualifiedPaidLeads);
  const newPatientCourses = Math.min(safe(input.newPatientCourses), qualifiedPaidLeads);
  const reactivatedPatientCourses = safe(input.reactivatedPatientCourses);
  const sessionFee = safe(input.sessionFee);
  const sessionsPerCourse = safe(input.sessionsPerCourse);
  const directCostPerCourse = safe(input.directCostPerCourse);
  const reactivationSpend = safe(input.reactivationSpend);

  const monthlyAdSpend = dailyAdSpend * 30;
  const courseRevenue = sessionFee * sessionsPerCourse;
  const paidAcquisitionRevenue = newPatientCourses * courseRevenue;
  const reactivationRevenue = reactivatedPatientCourses * courseRevenue;
  const totalPatientCourses = newPatientCourses + reactivatedPatientCourses;
  const appointments = totalPatientCourses * sessionsPerCourse;
  const grossRevenue = paidAcquisitionRevenue + reactivationRevenue;
  const marketingSpend = monthlyAdSpend + reactivationSpend;
  const directDeliveryCosts = totalPatientCourses * directCostPerCourse;
  const totalCosts = marketingSpend + directDeliveryCosts;
  const contribution = grossRevenue - totalCosts;
  const contributionPerCourse = courseRevenue - directCostPerCourse;

  return {
    monthlyAdSpend: Math.round(monthlyAdSpend),
    costPerQualifiedLead:
      qualifiedPaidLeads > 0
        ? Math.round((monthlyAdSpend / qualifiedPaidLeads) * 100) / 100
        : 0,
    leadToCourseRate:
      qualifiedPaidLeads > 0
        ? Math.round((newPatientCourses / qualifiedPaidLeads) * 1000) / 10
        : 0,
    totalPatientCourses: Math.round(totalPatientCourses * 10) / 10,
    appointments: Math.round(appointments),
    paidAcquisitionRevenue: Math.round(paidAcquisitionRevenue),
    reactivationRevenue: Math.round(reactivationRevenue),
    grossRevenue: Math.round(grossRevenue),
    marketingSpend: Math.round(marketingSpend),
    directDeliveryCosts: Math.round(directDeliveryCosts),
    totalCosts: Math.round(totalCosts),
    contribution: Math.round(contribution),
    breakEvenCourses:
      contributionPerCourse > 0
        ? Math.ceil(marketingSpend / contributionPerCourse)
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
