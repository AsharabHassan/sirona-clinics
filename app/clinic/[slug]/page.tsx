import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClinicCampaign from "@/components/ClinicCampaign";
import { getClinicProfile } from "@/lib/clinicProfiles";
import { isCampaignStage, type CampaignStage } from "@/lib/campaign";

interface ClinicPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ r?: string; stage?: string }>;
}
export async function generateMetadata({ params }: ClinicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getClinicProfile(slug);
  if (!profile) return {};
  return {
    title: `${profile.clinicName} | VELURIA clinic growth preview`,
    description: `A private VELURIA product and patient-journey preview prepared for ${profile.clinicName}.`,
    robots: profile.status === "verified" ? { index: false, follow: false } : { index: false, follow: false },
  };
}

export default async function ClinicPage({ params, searchParams }: ClinicPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const profile = getClinicProfile(slug);
  if (!profile) notFound();

  const recipientToken = typeof query.r === "string" && query.r.length <= 512 ? query.r : undefined;
  const initialStage: CampaignStage = isCampaignStage(query.stage) ? query.stage : "overview";

  return (
    <ClinicCampaign
      profile={profile}
      recipientToken={recipientToken}
      initialStage={initialStage}
    />
  );
}
