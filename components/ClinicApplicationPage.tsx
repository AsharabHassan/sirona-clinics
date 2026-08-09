"use client";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import type { ClinicProfile, OutreachEventName } from "@/lib/campaign";

function ArrowIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function TickIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0"><circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" /><path d="m4.8 8.1 2.05 2.05 4.35-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

const BOOKING_LABEL = "Book a free 20-minute VELURIA Clinic Growth Map";

export default function ClinicApplicationPage({ clinicName, profile, consultationUrl, onTryExperience, onTrack }: {
  clinicName: string;
  profile?: ClinicProfile;
  consultationUrl: string;
  onTryExperience: () => void;
  onTrack: (event: OutreachEventName) => void;
}) {
  const tryApplication = () => {
    onTrack("application_try_click");
    onTrack("ai_demo_start");
    onTryExperience();
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden bg-[#F8FBFA] px-5 py-14 sm:px-8 lg:py-20">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[38rem] w-[38rem] rounded-full bg-[#D8F0E9] blur-3xl" />
        <div className="relative mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow">Private doctor preview for {clinicName}</p>
            <h1 className="display mt-5 text-[3.25rem] text-plum sm:text-7xl lg:text-[4.5rem]">See the before-and-after application your patients could experience.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-plum-soft sm:text-lg sm:leading-8">
              This clinic-branded application helps a patient explore a visible skin-quality concern, see an illustrative before-and-after experience, understand the relevant VELURIA pathway and move towards a consultation with {clinicName}.
            </p>
            {profile?.serviceMenuBridge && <p className="mt-5 max-w-xl rounded-2xl border border-serum/12 bg-white/75 p-4 text-sm leading-6 text-plum-soft"><strong className="text-plum">Why it fits your clinic: </strong>{profile.serviceMenuBridge}</p>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={tryApplication} className="btn-serum">Try the before-and-after application <ArrowIcon /></button>
              <a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={() => onTrack("booking_click")} className="btn-ghost">{BOOKING_LABEL}</a>
            </div>
            <p className="mt-4 text-xs leading-5 text-plum-mute">Choose an instant patient concern or use your own permitted photograph. Your clinic details are requested once before entering the preview.</p>
          </div>

          <div className="landing-preview-shell overflow-hidden p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4 px-2 text-white">
              <div><p className="text-[0.55rem] uppercase tracking-[0.17em] text-white/55">What a patient sees</p><p className="mt-1 font-semibold">{clinicName} · skin-quality preview</p></div>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[0.5rem] uppercase tracking-[0.12em] text-white/75">Synthetic demonstration</span>
            </div>
            <BeforeAfterSlider before="/assets/concern-samples/fine-lines-before.webp" after="/assets/concern-samples/fine-lines-after.webp" beforeAlt="Synthetic patient before an illustrative skin-quality preview" afterAlt="Synthetic patient after an illustrative skin-quality preview" afterLabel="Illustrative after" />
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {["Visible concern map", "VELURIA product match", "Clinic booking prompt"].map((item) => <div key={item} className="flex items-center gap-2 rounded-xl bg-white/8 p-3 text-xs text-white/65"><TickIcon />{item}</div>)}
            </div>
            <p className="px-2 pt-4 text-[0.62rem] leading-5 text-white/45">Illustrative synthetic preview, not a real patient result or a prediction of treatment outcome.</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-white px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl"><p className="eyebrow">What the application actually does</p><h2 className="display mt-4 text-4xl text-plum sm:text-6xl">It makes the VELURIA conversation visual and interactive.</h2><p className="mt-5 leading-7 text-plum-soft">You are previewing the patient journey as a doctor or clinic owner. The application is designed to create an informed reason to enquire; your clinic remains responsible for consultation, suitability and treatment.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Starts with their concern", "The patient chooses hydration, texture, lines, firmness, tone or another configured skin-quality route."],
              ["02", "Creates a visual moment", "They use a permitted photo or an instant synthetic example to explore an illustrative before-and-after."],
              ["03", "Explains the product match", "The result connects the visible concern to the appropriate VELURIA pathway in accessible language."],
              ["04", "Moves interest to your clinic", "Consented contact details, follow-up prompts and the clinic calendar turn engagement into a consultation opportunity."],
            ].map(([number, title, copy]) => <article key={number} className="conversion-card"><span className="font-display text-3xl text-serum/45">{number}</span><h3 className="mt-4 text-lg font-semibold text-plum">{title}</h3><p className="mt-3 text-sm leading-6 text-plum-soft">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-black/[0.06] bg-[#F3F7F5] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div><p className="eyebrow">What this means for the clinic</p><h2 className="display mt-4 text-4xl text-plum sm:text-6xl">More than a before-and-after image.</h2><p className="mt-5 leading-7 text-plum-soft">The visual is the engagement point. The commercial value comes from connecting that moment to product education, consented lead capture and a clear consultation handoff.</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Active patient engagement", "Patients interact with a concern rather than passively reading a treatment page."],
              ["A clearer VELURIA discussion", "The matched pathway gives the clinic a useful starting point for the consultation."],
              ["Consented enquiry context", "The team can see what the patient explored before following up."],
              ["A direct booking route", "Every completed journey can point towards the clinic calendar and configured follow-up."],
            ].map(([title, copy]) => <article key={title} className="rounded-2xl border border-black/[0.06] bg-white p-6"><h3 className="font-semibold text-plum">{title}</h3><p className="mt-2 text-sm leading-6 text-plum-soft">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-[#0B2747] px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center"><p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#83D5C5]">Experience it as a clinic owner</p><h2 className="display mt-4 text-5xl sm:text-7xl">Try {clinicName}&rsquo;s patient journey now.</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-white/65">Choose a concern for an instant result, or use your own permitted photograph to see the live analysis route.</p><button type="button" onClick={tryApplication} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#0B2747]">Try the before-and-after application <ArrowIcon /></button></div>
      </section>
    </>
  );
}
