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
            <h1 className="display mt-6 text-[3.25rem] sm:text-7xl lg:text-[4.5rem]">It knows why each patient enquired—and what they saw.</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/68 sm:text-lg">The AI Sales Brain connects the patient&rsquo;s campaign source, selected concern, completed skin analysis and VELURIA match. It then coordinates specialised calling and messaging agents to choose relevant follow-ups and keep the patient moving towards a consultation with {clinicName}.</p>
            {profile?.pipelineOpportunity && <p className="mt-5 max-w-xl rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-white/62"><strong className="text-white">Why it could matter for your clinic: </strong>{profile.pipelineOpportunity}</p>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={book} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#10231F]">{BOOKING_LABEL} <ArrowIcon /></a><button type="button" onClick={tryApplication} className="inline-flex items-center justify-center rounded-full border border-white/18 px-7 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white">Try the patient application first</button></div>
            <p className="mt-4 text-xs leading-5 text-white/45">Optional and priced separately from the standard VELURIA funnel. Patient communications use consented data, clinic-approved rules and defined human handoffs. Bookings cannot be guaranteed.</p>
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.06] p-4 shadow-[0_35px_90px_-45px_rgba(0,0,0,0.8)] sm:p-6">
            <div className="rounded-[1.7rem] bg-[#F7FAF8] p-5 text-plum sm:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] pb-4"><div><p className="text-[0.55rem] uppercase tracking-[0.16em] text-plum-mute">One lead · connected context</p><p className="mt-1 font-semibold">{clinicName} · VELURIA enquiry</p></div><span className="rounded-full bg-[#EAF6F2] px-3 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-serum">Booking objective</span></div>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {[["Campaign", "Hydration and dullness advert"], ["Patient action", "Completed the photo analysis"], ["Analysis context", "Hydration and texture highlighted"], ["VELURIA match", "Silk Skin pathway"]].map(([label, value]) => <div key={label} className="rounded-xl border border-black/[0.06] bg-white p-3"><p className="text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-serum">{label}</p><p className="mt-1 text-xs leading-5 text-plum-soft">{value}</p></div>)}
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["Messaging agent", "Uses the hydration campaign and Silk Skin match to send the most relevant approved nudge."],
                  ["Calling agent", "Calls within the permitted contact window with the same patient context—without asking them to repeat their journey."],
                  ["Scheduling agent", "Handles availability, answers approved booking questions and offers the clinic calendar."],
                  ["Handoff agent", "Routes medication, suitability or clinical questions to the clinic team with the conversation context attached."],
                ].map(([agent, action], index) => <div key={agent} className="grid grid-cols-[2.1rem_1fr] gap-3 rounded-xl bg-[#EAF6F2] p-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-serum text-xs font-semibold text-white">{index + 1}</span><div><p className="text-xs font-semibold text-plum">{agent}</p><p className="mt-1 text-[0.68rem] leading-5 text-plum-soft">{action}</p></div></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl"><div className="max-w-3xl"><p className="eyebrow">Why it is different from a generic chatbot</p><h2 className="display mt-4 text-4xl text-plum sm:text-6xl">Every nudge starts from the patient&rsquo;s actual journey.</h2><p className="mt-5 leading-7 text-plum-soft">The Brain does not begin with a blank conversation. It uses consented campaign and analysis context to decide which approved message, call or booking action is most relevant next.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[
          ["Campaign awareness", "It knows which advert, email, retargeting route or clinic campaign produced the enquiry."],
          ["Analysis awareness", "It can use the completed analysis summary, selected concern and matched VELURIA pathway as conversation context."],
          ["Personalised nudge selection", "It chooses approved follow-up angles based on what that person explored rather than sending one generic sequence."],
          ["Coordinated messages and calls", "Specialised agents can work across configured messaging and calling channels without losing the lead context."],
          ["Consultation objective", "The agents continue the permitted follow-up sequence, answer booking questions and present the calendar when appropriate."],
          ["Clinical handoff", "Medication, contraindication, diagnosis, suitability, adverse-event and sensitive questions stop the sales flow and go to the clinic."],
        ].map(([title, copy]) => <article key={title} className="conversion-card"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF6F2] text-serum"><TickIcon /></span><h3 className="mt-5 text-lg font-semibold text-plum">{title}</h3><p className="mt-3 text-sm leading-6 text-plum-soft">{copy}</p></article>)}</div></div>
      </section>

      <section className="relative z-10 border-y border-black/[0.06] bg-[#F3F7F5] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-serum/12 bg-white p-7 sm:p-9"><p className="eyebrow">The clinic remains responsible for</p><h2 className="mt-3 text-2xl font-semibold text-plum">Every clinical decision.</h2><div className="mt-6 space-y-3">{["Patient consultation and examination", "Contraindication and medication review", "Diagnosis and treatment suitability", "Consent, protocol and treatment delivery", "Clinical advice and adverse-event management"].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl bg-[#F6FBF9] p-4 text-sm text-plum-soft"><TickIcon />{item}</div>)}</div></article>
          <article className="rounded-[2rem] bg-[#0B2747] p-7 text-white sm:p-9"><p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-[#83D5C5]">Commercial scope</p><h2 className="mt-3 text-2xl font-semibold">A separately priced multi-agent implementation.</h2><p className="mt-4 text-sm leading-7 text-white/62">The VELURIA application is the starting funnel. The AI Sales Brain is an optional additional layer because the campaign data, patient-analysis context, calling, messaging, calendar and clinic handoff must work as one controlled system.</p><div className="mt-6 space-y-3">{["Campaign attribution and lead context", "Consented analysis-summary connection", "Configured calling and messaging agents", "Booking, CRM and calendar connections", "Human handoff, monitoring and improvement"].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-4 text-sm text-white/65"><TickIcon />{item}</div>)}</div><p className="mt-5 text-xs leading-5 text-white/42">Final scope and cost depend on consent, selected channels, integrations, enquiry volume and services covered. The agents are designed to improve follow-up and booking opportunities; they cannot guarantee that a patient books.</p></article>
        </div>
      </section>

      <section className="relative z-10 bg-white px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl"><div className="max-w-3xl"><p className="eyebrow">VELURIA first, then optional expansion</p><h2 className="display mt-4 text-4xl text-plum sm:text-6xl">Start with one controlled knowledge area.</h2><p className="mt-5 leading-7 text-plum-soft">VELURIA gives the clinic a focused place to configure, test and improve the system. If it proves useful, the AI engineering team can scope separate knowledge and journeys for other services rather than mixing every treatment into the first launch.</p></div>{profile?.verifiedServices?.length ? <div className="mt-7 flex flex-wrap gap-2">{profile.verifiedServices.slice(0, 6).map((service) => <span key={service} className="rounded-full border border-serum/12 bg-[#F6FBF9] px-4 py-2 text-xs text-plum-soft">Possible future scope: {service}</span>)}</div> : null}</div>
      </section>

      <section className="relative z-10 bg-[#0B2747] px-5 py-16 text-white sm:px-8 lg:py-20"><div className="mx-auto max-w-4xl text-center"><p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#83D5C5]">Decide whether the extra layer is justified</p><h2 className="display mt-4 text-5xl sm:text-7xl">Map the right first phase for {clinicName}.</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-white/65">See how campaign attribution, patient-analysis context and coordinated calling and messaging agents could fit around your VELURIA funnel as a separately priced implementation.</p><a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={book} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#0B2747]">{BOOKING_LABEL} <ArrowIcon /></a></div></section>
    </>
  );
}
