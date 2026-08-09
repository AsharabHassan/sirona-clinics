"use client";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { PartnerLogoStrip } from "@/components/PartnerProof";
import RoiCalculator from "@/components/RoiCalculator";
import type { ClinicProfile, OutreachEventName } from "@/lib/campaign";

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

const PATIENT_STEPS = [
  ["01", "A patient recognises a concern", "A focused campaign gives them a relevant reason to engage."],
  ["02", "The application maps visible skin", "They upload a photo or choose a concern-led demonstration."],
  ["03", "They explore an illustrative preview", "The experience explains the matched VELURIA pathway without promising an outcome."],
  ["04", "Interest becomes a clinic conversation", "Consented details and context support a more informed consultation follow-up."],
] as const;

const CLINIC_GAINS = [
  ["Clinic-branded application", "A dedicated experience carrying the clinic name, relevant services and booking route."],
  ["Consented lead capture", "Patient details are captured before the complete result and passed into follow-up."],
  ["VELURIA pathway matching", "Concern-led education creates a clearer reason to discuss the appropriate product pathway."],
  ["Consultation handoff", "Every journey leads to the clinic calendar instead of ending with a passive product page."],
] as const;

export default function ClinicFunnelPage({
  clinicName,
  profile,
  consultationUrl,
  onTryExperience,
  onTrack,
}: {
  clinicName: string;
  profile?: ClinicProfile;
  consultationUrl: string;
  onTryExperience: () => void;
  onTrack: (event: OutreachEventName) => void;
}) {
  const trackBooking = () => onTrack("booking_click");
  const tryApplication = () => {
    onTrack("funnel_try_click");
    onTrack("ai_demo_start");
    onTryExperience();
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden border-b border-black/[0.06] bg-[#F8FBFA]">
        <div className="pointer-events-none absolute -right-24 -top-36 h-[38rem] w-[38rem] rounded-full bg-[#CDEBE3] opacity-70 blur-3xl" />
        <div className="relative mx-auto grid min-h-[690px] max-w-[1320px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-serum/15 bg-white/75 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-serum">
              <span className="h-1.5 w-1.5 rounded-full bg-serum" />
              AI growth funnel prepared for {clinicName}
            </div>
            <h1 className="display mt-7 text-[3.45rem] text-plum sm:text-7xl lg:text-[4.65rem]">
              Turn VELURIA interest into clinic conversations.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-plum-soft sm:text-lg sm:leading-8">
              A dedicated application for <strong className="font-semibold text-plum">{clinicName}</strong> that helps patients map visible skin concerns, explore an illustrative before-and-after experience and take the next step towards a consultation.
            </p>
            <p className="mt-5 max-w-xl rounded-2xl border border-serum/12 bg-white/70 p-4 text-sm leading-6 text-plum-soft">
              <strong className="font-semibold text-plum">Why it fits your clinic: </strong>
              {profile?.pipelineOpportunity ?? "The VELURIA application gives your clinic a focused starting point for turning patient interest into a measurable consultation journey."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={tryApplication} className="btn-serum">Try the patient application <ArrowIcon /></button>
              <a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={trackBooking} className="btn-ghost">Map the opportunity</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-plum-mute">
              {["Clinic branded", "Consented lead capture", "Built to book consultations"].map((item) => (
                <span key={item} className="flex items-center gap-2"><TickIcon />{item}</span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[680px]">
            <div className="overflow-hidden rounded-[2.4rem] border border-black/[0.08] bg-[#10231F] p-3 shadow-[0_35px_90px_-42px_rgba(16,35,31,0.65)] sm:p-5">
              <div className="rounded-[1.8rem] bg-white p-4 sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] pb-4">
                  <div>
                    <p className="text-[0.55rem] uppercase tracking-[0.18em] text-plum-mute">{clinicName} patient experience</p>
                    <p className="mt-1 text-sm font-semibold text-plum">Your visible-skin map</p>
                  </div>
                  <span className="rounded-full bg-[#EAF6F2] px-3 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-serum">AI preview</span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-[0.92fr_1.08fr]">
                  <div className="relative overflow-hidden rounded-2xl bg-[#E9EFEC]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/concern-samples/hydration-before.webp" alt="Synthetic face used to demonstrate the patient skin-mapping journey" className="aspect-square w-full object-cover" />
                    {[[35, 52], [52, 35], [65, 55]].map(([left, top], index) => (
                      <span key={index} className="absolute h-4 w-4 rounded-full border-2 border-white bg-serum shadow-[0_0_0_5px_rgba(11,110,92,0.24)]" style={{ left: `${left}%`, top: `${top}%` }} />
                    ))}
                    <span className="absolute bottom-3 left-3 rounded-full bg-[#10231F]/85 px-3 py-1.5 text-[0.5rem] uppercase tracking-[0.12em] text-white">Synthetic AI demo</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[0.55rem] uppercase tracking-[0.16em] text-serum">Concern map</p>
                    <h2 className="mt-2 text-2xl font-medium text-plum">Hydration and luminosity</h2>
                    <div className="mt-4 space-y-2">
                      {["Visible-skin summary", "Illustrative visual preview", "Matched VELURIA pathway"].map((item) => (
                        <div key={item} className="flex items-center gap-2 rounded-xl bg-[#F4F8F6] p-3 text-xs text-plum-soft"><TickIcon />{item}</div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl bg-[#0B2747] p-4 text-white sm:mt-auto">
                      <p className="text-[0.5rem] uppercase tracking-[0.14em] text-white/55">Suggested next step</p>
                      <p className="mt-1 text-sm font-semibold">Book a clinic consultation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnerLogoStrip />

      <section className="relative z-10 bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="eyebrow">The patient-facing VELURIA application</p>
            <h2 className="display mt-4 text-4xl text-plum sm:text-6xl">Let patients experience the idea before they enquire.</h2>
            <p className="mt-5 max-w-2xl leading-7 text-plum-soft">This is not another brochure page. It is an interactive journey that turns a skin-quality concern into a personalised, educational route towards the clinic.</p>
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="landing-preview-shell overflow-hidden p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-4 px-2 text-white">
                <div>
                  <p className="text-[0.55rem] uppercase tracking-[0.17em] text-white/55">Illustrative patient experience</p>
                  <p className="mt-1 font-semibold">Hydration and dullness</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[0.5rem] uppercase tracking-[0.12em] text-white/75">Synthetic AI demonstration</span>
              </div>
              <BeforeAfterSlider before="/assets/concern-samples/hydration-before.webp" after="/assets/concern-samples/hydration-after.webp" beforeAlt="Synthetic face before an illustrative VELURIA preview" afterAlt="Synthetic face after an illustrative VELURIA preview" afterLabel="Illustrative preview" />
              <p className="px-2 pt-4 text-[0.62rem] leading-5 text-white/50">This explains the digital patient journey. It is not a real patient, clinical evidence or a prediction of treatment outcome.</p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {PATIENT_STEPS.map(([number, title, copy]) => (
                <li key={number} className="rounded-2xl border border-black/[0.06] bg-[#F8FAF9] p-5">
                  <span className="font-display text-2xl text-serum/45">{number}</span>
                  <h3 className="mt-3 font-semibold text-plum">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-plum-soft">{copy}</p>
                </li>
              ))}
            </ol>
          </div>
          <button type="button" onClick={tryApplication} className="btn-serum mt-9">Launch {clinicName}&rsquo;s demo <ArrowIcon /></button>
        </div>
      </section>

      <section className="relative z-10 border-y border-black/[0.06] bg-[#F3F7F5] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">What the clinic receives</p>
            <h2 className="display mt-4 text-4xl text-plum sm:text-6xl">A working acquisition asset, not just campaign creative.</h2>
            <p className="mt-5 leading-7 text-plum-soft">The VELURIA funnel gives {clinicName} a reusable patient experience that connects education, lead capture and consultation booking.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {CLINIC_GAINS.map(([title, copy]) => (
              <article key={title} className="conversion-card h-full">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF6F2] text-serum"><TickIcon /></span>
                <h3 className="mt-5 text-lg font-semibold text-plum">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-plum-soft">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden bg-[#10231F] px-5 py-20 text-white sm:px-8 lg:py-24">
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-serum/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8ED8C7]">Optional AI Brain · additional investment</p>
            <h2 className="display mt-5 text-4xl sm:text-6xl">A 24/7 digital sales layer for VELURIA enquiries.</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/68">After the patient uses the funnel, a clinic-specific AI Brain can continue the conversation. It can answer configured non-clinical questions, explain the VELURIA journey, follow up consistently and guide interested people towards a consultation.</p>
            <button type="button" onClick={() => { onTrack("ai_brain_interest"); document.getElementById("funnel-growth-map")?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8ED8C7] hover:text-white">See the implementation path <ArrowIcon /></button>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 sm:p-8">
            <p className="text-[0.58rem] uppercase tracking-[0.18em] text-white/45">Example follow-up loop</p>
            <div className="mt-6 space-y-3">
              {[
                ["Immediately", "Acknowledge the enquiry and answer the patient’s first configured question."],
                ["With context", "Use the selected concern and pathway to keep the follow-up relevant."],
                ["At the right moment", "Offer the clinic calendar when the patient is ready to speak."],
                ["Human handoff", "Route clinical, sensitive or suitability questions to the clinic team."],
              ].map(([label, copy]) => (
                <div key={label} className="grid grid-cols-[6.2rem_1fr] gap-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[#8ED8C7]">{label}</span>
                  <p className="text-sm leading-6 text-white/65">{copy}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[0.62rem] leading-5 text-white/45">The AI Brain does not diagnose, decide suitability or replace the clinic’s clinical assessment. Scope, channels and escalation rules are agreed during implementation.</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="eyebrow">VELURIA is the starting point</p>
            <h2 className="display mt-4 text-4xl text-plum sm:text-6xl">Prove one focused funnel. Then expand the system.</h2>
            <p className="mt-5 leading-7 text-plum-soft">The first implementation is deliberately focused on VELURIA. Once {clinicName} has a working patient journey, Sirona’s AI engineering team can adapt the same model into customised funnels and follow-up systems for other suitable clinic services.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["01", "Launch VELURIA", "Build the branded application, concern journeys, lead capture and consultation route."],
              ["02", "Add the AI Brain", "Connect an optional follow-up layer configured around the clinic’s VELURIA offer."],
              ["03", "Expand intelligently", "Apply what works to other services with new journeys, logic and governance."],
            ].map(([number, title, copy]) => (
              <article key={number} className="conversion-card">
                <span className="font-display text-3xl text-serum/45">{number}</span>
                <h3 className="mt-4 text-xl font-semibold text-plum">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-plum-soft">{copy}</p>
              </article>
            ))}
          </div>
          {profile?.verifiedServices?.length ? (
            <div className="mt-8 rounded-2xl border border-serum/12 bg-[#F6FBF9] p-5">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-serum">Potential future pathways for {clinicName}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.verifiedServices.slice(0, 6).map((service) => <span key={service} className="rounded-full border border-black/[0.06] bg-white px-3 py-2 text-xs text-plum-soft">{service}</span>)}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="relative z-10 border-y border-black/[0.06] bg-[#F3F7F5] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <RoiCalculator consultationUrl={consultationUrl} clinicName={clinicName} embedded onAdjust={() => onTrack("calculator_adjust")} />
        </div>
      </section>

      <section id="funnel-growth-map" className="relative z-10 bg-[#0B2747] px-5 py-20 text-white sm:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#83D5C5]">Free 20-minute online consultation</p>
          <h2 className="display mt-5 text-5xl sm:text-7xl">Map {clinicName}&rsquo;s VELURIA funnel.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/68">See how the dedicated application, consented lead capture, booking route and optional AI Brain could fit your clinic now, with a clear path to expand later.</p>
          <a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={trackBooking} className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-9 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#0B2747] transition hover:-translate-y-0.5 hover:bg-[#EAF6F2]">Book my free growth map <ArrowIcon /></a>
          <p className="mt-4 text-xs text-white/45">VELURIA funnel included in the discussion · AI Brain priced separately</p>
        </div>
      </section>
    </>
  );
}
