"use client";

import { useEffect, useState } from "react";
import BrandStamp from "@/components/BrandStamp";
import ClinicFunnelPage from "@/components/ClinicFunnelPage";
import ClinicLandingPage from "@/components/ClinicLandingPage";
import ClinicLeadForm from "@/components/ClinicLeadForm";
import ConversionReport from "@/components/ConversionReport";
import PatientExperience from "@/components/PatientExperience";
import RoiCalculator from "@/components/RoiCalculator";
import { makeBrand, type BrandConfig } from "@/lib/brand";
import {
  CAMPAIGN_STAGE_TO_VIEW,
  type CampaignStage,
  type ClinicProfile,
  type OutreachEventName,
} from "@/lib/campaign";
import { consultationHref, trackOutreachEvent } from "@/lib/outreachClient";
import type { ClinicLeadPayload, PatientJourneySnapshot } from "@/lib/types";

type Step = "landing" | "funnel" | "brand" | "demo" | "report" | "roi" | "form" | "done";

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4.8 8.1 2.05 2.05 4.35-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface ClinicCampaignProps {
  profile?: ClinicProfile;
  recipientToken?: string;
  initialStage?: CampaignStage;
}

export default function ClinicCampaign({
  profile,
  recipientToken,
  initialStage = "overview",
}: ClinicCampaignProps) {
  const startingView = CAMPAIGN_STAGE_TO_VIEW[initialStage];
  const [step, setStep] = useState<Step>(startingView);
  const [brand, setBrand] = useState<BrandConfig>(
    makeBrand(profile ? { clinicName: profile.clinicName, accent: profile.brand.accent } : undefined),
  );
  const [lead, setLead] = useState<ClinicLeadPayload | null>(null);
  const [patientJourney, setPatientJourney] = useState<PatientJourneySnapshot | null>(null);
  const consultationUrl = consultationHref(recipientToken, initialStage, profile?.slug);

  const track = (event: OutreachEventName) => {
    trackOutreachEvent(recipientToken, event, initialStage);
  };

  useEffect(() => {
    if (profile) {
      trackOutreachEvent(recipientToken, startingView === "funnel" ? "funnel_view" : "landing_view", initialStage);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get("view");
    if (requestedView === "demo" || requestedView === "report" || requestedView === "roi") {
      setStep(requestedView);
    }
  }, [initialStage, profile, recipientToken]);

  const isPersonalised = Boolean(profile) || brand.clinicName !== "Your Clinic";
  const clinicCopy = isPersonalised ? brand.clinicName : "your clinic";

  const beginPreview = () => {
    setStep(isPersonalised ? "demo" : "brand");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goTo = (next: Step) => {
    setStep(next);
    const eventForStep: Partial<Record<Step, OutreachEventName>> = {
      report: "report_view",
      roi: "roi_view",
    };
    const event = eventForStep[next];
    if (event) track(event);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <header className="relative z-30 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <button type="button" onClick={() => goTo("landing")} className="flex items-center gap-3 text-left" aria-label="Back to the VELURIA clinic page">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sirona-logo.png" alt="Sirona Aesthetics" className="h-8 w-auto" />
            <span className="hidden border-l border-black/10 pl-3 text-[0.58rem] uppercase leading-relaxed tracking-[0.22em] text-plum-mute sm:block">VELURIA<br />clinic growth</span>
          </button>
          <div className="hidden items-center gap-2 text-xs text-plum-soft md:flex">
            <span className="h-2 w-2 rounded-full bg-serum shadow-[0_0_0_5px_rgba(11,110,92,0.1)]" />
            Free 20-minute VELURIA Clinic Growth Map
          </div>
          <a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("booking_click")} className="btn-serum !px-5 !py-3 !text-[0.62rem] sm:!px-7">
            Book free consultation
          </a>
        </div>
      </header>

      {step === "landing" ? (
        <ClinicLandingPage clinicCopy={clinicCopy} profile={profile} consultationUrl={consultationUrl} beginPreview={beginPreview} onTrack={track} />
      ) : step === "funnel" ? (
        <ClinicFunnelPage clinicName={clinicCopy} profile={profile} consultationUrl={consultationUrl} onTryExperience={beginPreview} onTrack={track} />
      ) : (
        <div className="relative z-10 mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
            <button type="button" onClick={() => goTo("landing")} className="text-xs font-medium uppercase tracking-[0.14em] text-plum-mute transition hover:text-plum">← Campaign overview</button>
            <div className="flex items-center gap-2">
              {["Brand", "AI Preview", "Report", "Potential"].map((label, index) => {
                const activeIndex = step === "brand" ? 0 : step === "demo" ? 1 : step === "report" ? 2 : 3;
                return <span key={label} className={`rounded-full px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.12em] ${index <= activeIndex ? "bg-serum text-white" : "bg-black/[0.05] text-plum-mute"}`}>{label}</span>;
              })}
            </div>
          </div>

          {step === "brand" && <BrandStamp key="brand" initialBrand={brand} onDone={(nextBrand) => { setBrand(nextBrand); goTo("demo"); }} />}
          {step === "demo" && (
            <PatientExperience key="demo" brand={brand} consultationUrl={consultationUrl} onEditBrand={() => goTo("brand")} recipientToken={recipientToken} campaignStage={initialStage} onContinue={(snapshot) => { setPatientJourney(snapshot); goTo("report"); }} />
          )}
          {step === "report" && (
            <ConversionReport key="report" brand={brand} consultationUrl={consultationUrl} profile={profile} patientJourney={patientJourney} onExplore={() => goTo("roi")} onPrivateDemo={() => goTo("form")} />
          )}
          {step === "roi" && (
            <RoiCalculator key="roi" consultationUrl={consultationUrl} clinicName={clinicCopy} onAdjust={() => track("calculator_adjust")} onPrivateDemo={() => goTo("form")} />
          )}
          {step === "form" && (
            <ClinicLeadForm key="form" brand={brand} onSubmitted={(submittedLead) => { setLead(submittedLead); goTo("done"); }} />
          )}
          {step === "done" && (
            <section className="mx-auto max-w-xl animate-fade-scale text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-serum text-white"><TickIcon /></div>
              <p className="eyebrow mt-6">Request received</p>
              <h2 className="display mt-3 text-4xl text-plum sm:text-6xl">Thank you{lead?.ownerName ? `, ${lead.ownerName.split(/\s+/)[0]}` : ""}.</h2>
              <p className="mx-auto mt-5 max-w-md leading-relaxed text-plum-soft">Sirona will follow up about your VELURIA clinic-growth walkthrough. You can choose a free 20-minute Clinic Growth Map now.</p>
              <a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("booking_click")} className="btn-serum mt-8">Choose my growth-map time <ArrowIcon /></a>
            </section>
          )}
        </div>
      )}

      <footer className="relative z-10 border-t border-black/[0.06] bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-center text-[0.62rem] uppercase tracking-[0.14em] text-plum-mute sm:flex-row sm:px-8 sm:text-left">
          <span>© {new Date().getFullYear()} Sirona Aesthetics · VELURIA by PBSerum</span>
          <span>Professional cosmetic range · Individual outcomes vary</span>
        </div>
      </footer>
    </main>
  );
}
