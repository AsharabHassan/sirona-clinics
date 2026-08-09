"use client";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { PartnerLogoStrip } from "@/components/PartnerProof";
import RoiCalculator from "@/components/RoiCalculator";
import type { ClinicProfile, OutreachEventName } from "@/lib/campaign";

function ArrowIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function TickIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0"><circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" /><path d="m4.8 8.1 2.05 2.05 4.35-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

const BOOKING_LABEL = "Book a free 20-minute VELURIA Clinic Growth Map";

export default function ClinicFunnelPage({ clinicName, profile, consultationUrl, onTryExperience, onTrack }: {
  clinicName: string;
  profile?: ClinicProfile;
  consultationUrl: string;
  onTryExperience: () => void;
  onTrack: (event: OutreachEventName) => void;
}) {
  const tryApplication = () => {
    onTrack("funnel_try_click");
    onTrack("ai_demo_start");
    onTryExperience();
  };
  const book = () => onTrack("booking_click");

  return (
    <>
      <section className="relative z-10 overflow-hidden border-b border-black/[0.06] bg-[#F8FBFA]">
        <div className="pointer-events-none absolute -right-24 -top-36 h-[38rem] w-[38rem] rounded-full bg-[#CDEBE3] opacity-70 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-14 sm:px-8 lg:min-h-[640px] lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow">Clinic-branded VELURIA application for {clinicName}</p>
            <h1 className="display mt-5 text-[3.25rem] text-plum sm:text-7xl lg:text-[4.5rem]">Turn product interest into booked clinic conversations.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-plum-soft sm:text-lg sm:leading-8">Patients can map visible skin-quality concerns, explore an illustrative before-and-after experience and move into a consultation route carrying {clinicName}&rsquo;s name.</p>
            <p className="mt-5 max-w-xl rounded-2xl border border-serum/12 bg-white/75 p-4 text-sm leading-6 text-plum-soft"><strong className="text-plum">Why this is relevant: </strong>{profile?.pipelineOpportunity ?? "VELURIA gives the clinic a focused first funnel connecting patient education, consented lead capture and consultation booking."}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={tryApplication} className="btn-serum">Try the clinic application <ArrowIcon /></button><a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={book} className="btn-ghost">{BOOKING_LABEL}</a></div>
            <p className="mt-4 text-xs leading-5 text-plum-mute">Your clinic details are requested once before the demonstration. Synthetic previews are illustrative, not treatment predictions.</p>
          </div>
          <div className="landing-preview-shell overflow-hidden p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4 px-2 text-white"><div><p className="text-[0.55rem] uppercase tracking-[0.17em] text-white/55">{clinicName} patient application</p><p className="mt-1 font-semibold">Illustrative AI skin-quality experience</p></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-[0.5rem] uppercase tracking-[0.12em] text-white/75">Synthetic AI demo</span></div>
            <BeforeAfterSlider before="/assets/concern-samples/hydration-before.webp" after="/assets/concern-samples/hydration-after.webp" beforeAlt="Synthetic face before an illustrative skin-quality preview" afterAlt="Synthetic face after an illustrative skin-quality preview" afterLabel="Illustrative preview" />
            <p className="px-2 pt-4 text-[0.62rem] leading-5 text-white/50">Demonstrates the digital journey. Not a real patient, clinical evidence or a prediction of outcome.</p>
          </div>
        </div>
      </section>

      <PartnerLogoStrip />

      <section className="relative z-10 bg-white px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl"><p className="eyebrow">What the application does</p><h2 className="display mt-4 text-4xl text-plum sm:text-6xl">One simple journey from concern to consultation.</h2></div>
          <div className="mt-9 grid gap-4 md:grid-cols-4">
            {[
              ["01", "Engage", "A patient chooses a concern or supplies a permitted photograph."],
              ["02", "Explain", "The application maps visible skin quality and explains the relevant VELURIA pathway."],
              ["03", "Capture", "Consented patient details and context enter the configured clinic follow-up route."],
              ["04", "Book", "Clear prompts move suitable interest towards the clinic calendar."],
            ].map(([number, title, copy]) => <article key={number} className="conversion-card"><span className="font-display text-3xl text-serum/45">{number}</span><h3 className="mt-3 text-lg font-semibold text-plum">{title}</h3><p className="mt-2 text-sm leading-6 text-plum-soft">{copy}</p></article>)}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-5"><button type="button" onClick={tryApplication} className="btn-serum">Launch {clinicName}&rsquo;s preview <ArrowIcon /></button><p className="max-w-xl text-xs leading-5 text-plum-mute">Education, consented lead capture, configured follow-up, retargeting and booking prompts can be automated. The clinic still consults, confirms suitability and treats.</p></div>
        </div>
      </section>

      <section className="relative z-10 border-y border-black/[0.06] bg-[#F3F7F5] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-[2rem] border border-serum/12 bg-white p-7"><p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-serum">Route one · New patients</p><h2 className="mt-3 text-2xl font-semibold text-plum">Paid campaigns create new enquiries.</h2><p className="mt-3 text-sm leading-7 text-plum-soft">Concern-led advertising sends suitable audiences into the clinic-branded experience, where interest can become a consented lead and booking prompt.</p></article>
            <article className="rounded-[2rem] bg-[#0B2747] p-7 text-white"><p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-[#83D5C5]">Route two · Existing clients</p><h2 className="mt-3 text-2xl font-semibold">Email and retargeting reactivate demand.</h2><p className="mt-3 text-sm leading-7 text-white/62">The same focused experience gives the existing database a fresh reason to explore VELURIA and return for a clinic conversation.</p></article>
          </div>
          <div className="mt-12"><RoiCalculator consultationUrl={consultationUrl} clinicName={clinicName} embedded onAdjust={() => onTrack("scenario_interaction")} onBook={book} /></div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden bg-[#10231F] px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div><p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8ED8C7]">Optional AI Brain · priced separately</p><h2 className="display mt-4 text-4xl sm:text-6xl">A configured follow-up layer for VELURIA enquiries.</h2><p className="mt-5 max-w-2xl leading-8 text-white/65">The optional AI Brain can answer agreed non-clinical questions, explain the VELURIA journey, follow up and offer the calendar. Clinical, sensitive and suitability questions are handed to the clinic team.</p><button type="button" onClick={() => onTrack("ai_brain_interest")} className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8ED8C7]">Include this in my Growth Map <ArrowIcon /></button></div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7"><p className="text-[0.58rem] uppercase tracking-[0.18em] text-white/45">Configured automation boundaries</p><div className="mt-5 space-y-3">{["Answer approved product and journey questions", "Use concern context for relevant follow-up", "Prompt a consultation at the right moment", "Hand clinical decisions to a person"].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 p-4 text-sm text-white/65"><TickIcon />{item}</div>)}</div></div>
        </div>
      </section>

      <section className="relative z-10 bg-white px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl"><div className="max-w-3xl"><p className="eyebrow">VELURIA is the starting point</p><h2 className="display mt-4 text-4xl text-plum sm:text-6xl">Prove one focused funnel, then expand.</h2><p className="mt-5 leading-7 text-plum-soft">Sirona&rsquo;s AI engineering team can use the VELURIA implementation as the starting point for customised AI funnels for other appropriate services. Each new service needs its own journey, content, governance and commercial scope.</p></div>{profile?.verifiedServices?.length ? <div className="mt-7 flex flex-wrap gap-2">{profile.verifiedServices.slice(0, 6).map((service) => <span key={service} className="rounded-full border border-serum/12 bg-[#F6FBF9] px-4 py-2 text-xs text-plum-soft">Future option: {service}</span>)}</div> : null}</div>
      </section>

      <section className="relative z-10 bg-[#0B2747] px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center"><p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#83D5C5]">A practical implementation conversation</p><h2 className="display mt-4 text-5xl sm:text-7xl">Map {clinicName}&rsquo;s VELURIA funnel.</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-white/65">Review the application, two acquisition routes, clinic capacity and whether the separately priced AI Brain belongs in the first phase.</p><a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={book} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#0B2747]">{BOOKING_LABEL} <ArrowIcon /></a></div>
      </section>
    </>
  );
}
