import "server-only";

import type { ClinicProfile } from "./campaign";
import profileData from "@/data/clinic-profiles.json";

/**
 * Only approved, source-backed profiles belong here. Prospect research is kept
 * out of the client bundle and an unknown slug always resolves to a 404.
 *
 * The demonstration record contains no claims about a real clinic. It exists so
 * the complete personalised route can be tested before prospect profiles are
 * reviewed and approved.
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
