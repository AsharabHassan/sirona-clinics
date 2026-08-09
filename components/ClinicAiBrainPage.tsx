"use client";

import type { ClinicProfile, OutreachEventName } from "@/lib/campaign";

function ArrowIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function TickIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0"><circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" /><path d="m4.8 8.1 2.05 2.05 4.35-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

const BOOKING_LABEL = "Book a free 20-minute VELURIA Clinic Growth Map";

export default function ClinicAiBrainPage({ clinicName, profile, consultationUrl, onTryExperience, onTrack }: {
  clinicName: string;
  profile?: ClinicProfile;
  consultationUrl: string;
  onTryExperience: () => void;
  onTrack: (event: OutreachEventName) => void;
}) {
  const book = () => {
    onTrack("ai_brain_interest");
    onTrack("booking_click");
  };
  const tryApplication = () => {
    onTrack("application_try_click");
    onTrack("ai_demo_start");
    onTryExperience();
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden bg-[#10231F] px-5 py-14 text-white sm:px-8 lg:py-20">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[38rem] w-[38rem] rounded-full bg-serum/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8ED8C7]/25 bg-white/[0.06] px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-[#8ED8C7]"><span className="h-1.5 w-1.5 rounded-full bg-[#8ED8C7]" />Optional AI Sales Brain · additional cost</div>
            <h1 className="display mt-6 text-[3.25rem] sm:text-7xl lg:text-[4.5rem]">A consistent response and follow-up layer for clinic enquiries.</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/68 sm:text-lg">The AI Sales Brain is optional software configured around {clinicName}&rsquo;s approved VELURIA information. It can respond to non-clinical questions, continue follow-up and guide interested people towards the clinic calendar.</p>
            {profile?.pipelineOpportunity && <p className="mt-5 max-w-xl rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-white/62"><strong className="text-white">Why it could matter for your clinic: </strong>{profile.pipelineOpportunity}</p>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={book} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#10231F]">{BOOKING_LABEL} <ArrowIcon /></a><button type="button" onClick={tryApplication} className="inline-flex items-center justify-center rounded-full border border-white/18 px-7 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white">Try the patient application first</button></div>
            <p className="mt-4 text-xs leading-5 text-white/45">Not included in the standard VELURIA funnel. Configuration, channels, integrations and ongoing service are quoted separately.</p>
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.06] p-4 shadow-[0_35px_90px_-45px_rgba(0,0,0,0.8)] sm:p-6">
            <div className="rounded-[1.7rem] bg-[#F7FAF8] p-5 text-plum sm:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] pb-4"><div><p className="text-[0.55rem] uppercase tracking-[0.16em] text-plum-mute">Example enquiry</p><p className="mt-1 font-semibold">{clinicName} · VELURIA follow-up</p></div><span className="rounded-full bg-[#EAF6F2] px-3 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-serum">Human handoff ready</span></div>
              <div className="mt-5 space-y-3 text-sm leading-6">
                <div className="ml-auto max-w-[86%] rounded-2xl rounded-br-md bg-[#E7ECE9] p-4 text-plum-soft">I viewed the Silk Skin preview. How many appointments are normally discussed?</div>
                <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-serum p-4 text-white">VELURIA pathways are commonly discussed as a course, but the clinic must first confirm suitability and the appropriate plan. Would you like to choose a consultation time?</div>
                <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-md bg-[#E7ECE9] p-4 text-plum-soft">Yes, but I also take prescription medication.</div>
                <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-serum/15 bg-[#EAF6F2] p-4 text-plum">That needs a member of the clinical team. I can pass on your question and offer the consultation calendar.</div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">{[["Answer", "approved FAQs"], ["Follow up", "with context"], ["Escalate", "clinical questions"]].map(([title, copy]) => <div key={title} className="rounded-xl border border-black/[0.06] bg-white p-3"><p className="text-xs font-semibold text-plum">{title}</p><p className="mt-1 text-[0.55rem] uppercase tracking-[0.1em] text-plum-mute">{copy}</p></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl"><div className="max-w-3xl"><p className="eyebrow">What it can handle</p><h2 className="display mt-4 text-4xl text-plum sm:text-6xl">Designed for the space between enquiry and consultation.</h2><p className="mt-5 leading-7 text-plum-soft">The system works from clinic-approved information and agreed escalation rules. It supports the commercial conversation without taking over clinical decisions.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[
          ["Fast first response", "Acknowledge a new enquiry promptly, including outside staffed reception hours when the agreed channel permits."],
          ["Approved VELURIA answers", "Explain the range, patient journey, clinic process and other pre-approved non-clinical information consistently."],
          ["Context-aware follow-up", "Continue from the concern or VELURIA pathway the person explored instead of restarting a generic conversation."],
          ["Booking prompts", "Offer the clinic calendar when the person indicates they are ready to speak with the team."],
          ["Enquiry organisation", "Record the topic, interest level and next action so the clinic team receives useful context."],
          ["Human escalation", "Stop and hand over medication, contraindication, diagnosis, suitability, adverse-event and sensitive questions."],
        ].map(([title, copy]) => <article key={title} className="conversion-card"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF6F2] text-serum"><TickIcon /></span><h3 className="mt-5 text-lg font-semibold text-plum">{title}</h3><p className="mt-3 text-sm leading-6 text-plum-soft">{copy}</p></article>)}</div></div>
      </section>

      <section className="relative z-10 border-y border-black/[0.06] bg-[#F3F7F5] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-serum/12 bg-white p-7 sm:p-9"><p className="eyebrow">The clinic remains responsible for</p><h2 className="mt-3 text-2xl font-semibold text-plum">Every clinical decision.</h2><div className="mt-6 space-y-3">{["Patient consultation and examination", "Contraindication and medication review", "Diagnosis and treatment suitability", "Consent, protocol and treatment delivery", "Clinical advice and adverse-event management"].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl bg-[#F6FBF9] p-4 text-sm text-plum-soft"><TickIcon />{item}</div>)}</div></article>
          <article className="rounded-[2rem] bg-[#0B2747] p-7 text-white sm:p-9"><p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-[#83D5C5]">Commercial scope</p><h2 className="mt-3 text-2xl font-semibold">A separately priced implementation.</h2><p className="mt-4 text-sm leading-7 text-white/62">The VELURIA application is the starting funnel. The AI Sales Brain is an optional additional layer because each clinic needs its own approved knowledge, conversation rules, integrations, escalation process and ongoing refinement.</p><div className="mt-6 space-y-3">{["Clinic-approved knowledge base", "Agreed communication channels", "Booking and CRM connections", "Human handoff rules", "Monitoring and iterative improvement"].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/65"><TickIcon />{item}</div>)}</div><p className="mt-5 text-xs leading-5 text-white/42">Final scope and cost depend on the selected channels, integrations, enquiry volume and services covered.</p></article>
        </div>
      </section>

      <section className="relative z-10 bg-white px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl"><div className="max-w-3xl"><p className="eyebrow">VELURIA first, then optional expansion</p><h2 className="display mt-4 text-4xl text-plum sm:text-6xl">Start with one controlled knowledge area.</h2><p className="mt-5 leading-7 text-plum-soft">VELURIA gives the clinic a focused place to configure, test and improve the system. If it proves useful, the AI engineering team can scope separate knowledge and journeys for other services rather than mixing every treatment into the first launch.</p></div>{profile?.verifiedServices?.length ? <div className="mt-7 flex flex-wrap gap-2">{profile.verifiedServices.slice(0, 6).map((service) => <span key={service} className="rounded-full border border-serum/12 bg-[#F6FBF9] px-4 py-2 text-xs text-plum-soft">Possible future scope: {service}</span>)}</div> : null}</div>
      </section>

      <section className="relative z-10 bg-[#0B2747] px-5 py-16 text-white sm:px-8 lg:py-20"><div className="mx-auto max-w-4xl text-center"><p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#83D5C5]">Decide whether the extra layer is justified</p><h2 className="display mt-4 text-5xl sm:text-7xl">Map the right first phase for {clinicName}.</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-white/65">We can separate what belongs in the core VELURIA funnel from what would require a separately priced AI Sales Brain implementation.</p><a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={book} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#0B2747]">{BOOKING_LABEL} <ArrowIcon /></a></div></section>
    </>
  );
}
