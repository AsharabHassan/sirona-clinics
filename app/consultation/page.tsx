import type { Metadata } from "next";
import Link from "next/link";
import { getClinicProfile } from "@/lib/clinicProfiles";
import { isCampaignStage } from "@/lib/campaign";
import { readOutreachToken } from "@/lib/outreachToken";

export const metadata: Metadata = {
  title: "Free VELURIA Clinic Growth Map | Sirona Aesthetics",
  description: "Choose a private 20-minute clinic growth-map consultation with Sirona Aesthetics.",
  robots: { index: false, follow: false },
};

const DEFAULT_CALENDAR =
  "https://link.sironaaesthetics.co.uk/widget/bookings/veluria-clinic-growth-map";

interface ConsultationPageProps {
  searchParams: Promise<{ r?: string; stage?: string; clinic?: string }>;
}

export default async function ConsultationPage({ searchParams }: ConsultationPageProps) {
  const query = await searchParams;
  const calendarUrl = new URL(process.env.NEXT_PUBLIC_CALENDAR_URL || DEFAULT_CALENDAR);
  let clinicName = "your clinic";
  let backHref = "/";

  if (typeof query.clinic === "string") {
    const publicProfile = getClinicProfile(query.clinic);
    if (publicProfile) {
      clinicName = publicProfile.clinicName;
      backHref = `/clinic/${encodeURIComponent(publicProfile.slug)}`;
    }
  }

  if (typeof query.r === "string" && isCampaignStage(query.stage)) {
    try {
      const token = readOutreachToken(query.r);
      const profile = getClinicProfile(token.clinicSlug);
      clinicName = profile?.clinicName ?? clinicName;
      backHref = `/clinic/${encodeURIComponent(token.clinicSlug)}?r=${encodeURIComponent(query.r)}&stage=${encodeURIComponent(query.stage)}`;
      calendarUrl.searchParams.set("source", `vl26.${query.r}`);
    } catch {
      // Invalid or expired tokens fall back to an unattributed booking page.
    }
  }

  return (
    <main className="min-h-dvh bg-[#F6F3EE] px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <Link href={backHref} className="text-xs font-semibold uppercase tracking-[0.15em] text-plum-mute">
            Back to the VELURIA preview
          </Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sirona-logo.png" alt="Sirona Aesthetics" className="h-8 w-auto" />
        </div>
        <section className="overflow-hidden rounded-[2rem] border border-black/[0.07] bg-white shadow-dew">
          <div className="grid gap-6 border-b border-black/[0.06] px-6 py-7 sm:px-9 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">Free 20-minute VELURIA Clinic Growth Map</p>
              <h1 className="display mt-3 text-4xl text-plum sm:text-6xl">
                Turn the preview into a practical plan for {clinicName}.
              </h1>
            </div>
            <div className="max-w-sm text-sm leading-6 text-plum-soft">
              Review product fit, the proposed patient journey and one practical launch step with Jacqui Shand.
            </div>
          </div>
          <iframe
            src={calendarUrl.toString()}
            title="Book a free VELURIA Clinic Growth Map"
            className="h-[820px] w-full border-0"
            loading="eager"
            allow="clipboard-write"
          />
        </section>
        <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-plum-mute">
          If the calendar does not load, {" "}
          <a href={calendarUrl.toString()} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            open the secure booking page
          </a>.
        </p>
      </div>
    </main>
  );
}
