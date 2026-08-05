import "server-only";

import type { ClinicProfile } from "./campaign";
import profileData from "@/data/clinic-profiles.json";

/**
 * Only approved, source-backed profiles belong here. Prospect research is kept
 * out of the client bundle and an unknown slug always resolves to a 404.
 *
 * Demonstration records are preview-only and never qualify for outreach. A real
 * clinic may have a source-backed demonstration profile so the user can review
 * its personalised funnel before recipient and corporate approval is complete.
 */
const CLINIC_PROFILES = profileData as ClinicProfile[];

export function getClinicProfile(slug: string): ClinicProfile | undefined {
  return CLINIC_PROFILES.find(
    (profile) => profile.slug === slug && profile.status !== "held",
  );
}

export function getApprovedClinicSlugs(): string[] {
  return CLINIC_PROFILES.filter((profile) => profile.status === "verified").map(
    (profile) => profile.slug,
  );
}
