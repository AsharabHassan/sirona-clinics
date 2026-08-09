"use client";

import { useMemo, useRef, useState } from "react";
import {
  computeRoi,
  gbp,
  ROI_BOUNDS,
  ROI_DEFAULTS,
  type RoiInputs,
} from "@/lib/roi";

type Field = keyof RoiInputs;

const FIELD_CONFIG: Record<Field, { label: string; help: string; money?: boolean; suffix?: string }> = {
  dailyAdSpend: {
    label: "Daily ad spend",
    help: "Calculated across 30 days.",
    money: true,
  },
  qualifiedPaidLeads: {
    label: "Qualified enquiries from ads",
    help: "Relevant enquiries, not clicks or impressions.",
  },
  newPatientCourses: {
    label: "New patients starting a course",
    help: "Must still pass consultation and suitability checks.",
  },
  reactivatedPatientCourses: {
    label: "Existing clients reactivated",
    help: "Clients who start a new VELURIA course.",
  },
  sessionFee: {
    label: "Clinic fee per session",
    help: "The amount charged for one treatment appointment.",
    money: true,
  },
  sessionsPerCourse: {
    label: "Sessions per patient course",
    help: "The default scenario uses a three-session course.",
  },
  directCostPerCourse: {
    label: "Direct delivery cost per course",
    help: "Product, consumables and other variable treatment costs.",
    money: true,
  },
  reactivationSpend: {
    label: "Email and retargeting spend",
    help: "An adjustable allowance for reaching the current client base.",
    money: true,
  },
};

const GROUPS: { title: string; eyebrow: string; fields: Field[] }[] = [
  {
    title: "Reach a new audience",
    eyebrow: "Paid acquisition",
    fields: ["dailyAdSpend", "qualifiedPaidLeads", "newPatientCourses"],
  },
  {
    title: "Reactivate current clients",
    eyebrow: "Existing database",
    fields: ["reactivatedPatientCourses", "reactivationSpend"],
  },
  {
    title: "Set the treatment economics",
    eyebrow: "Clinic assumptions",
    fields: ["sessionFee", "sessionsPerCourse"],
  },
];

function FlowArrow() {
  return <span aria-hidden="true" className="text-serum/35">→</span>;
}

export default function RoiCalculator({
  consultationUrl,
  clinicName = "your clinic",
  onPrivateDemo,
  onAdjust,
  onBook,
  embedded = false,
}: {
  consultationUrl: string;
  clinicName?: string;
  onPrivateDemo?: () => void;
  onAdjust?: () => void;
  onBook?: () => void;
  embedded?: boolean;
}) {
  const [inputs, setInputs] = useState<RoiInputs>(ROI_DEFAULTS);
  const result = useMemo(() => computeRoi(inputs), [inputs]);
  const adjusted = useRef(false);

  const set = (key: Field, value: number) => {
    setInputs((current) => ({ ...current, [key]: value }));
    if (!adjusted.current) {
      adjusted.current = true;
      onAdjust?.();
    }
  };

  const paidCourses = Math.min(inputs.newPatientCourses, inputs.qualifiedPaidLeads);
  const starterCourses = 4;
  const starterSessions = starterCourses * inputs.sessionsPerCourse;
  const starterGross = starterSessions * inputs.sessionFee;

  return (
    <section className={embedded ? "w-full" : "w-full animate-fade-scale"}>
      <div className="mb-9 max-w-4xl">
        <p className="eyebrow">Two patient streams, one transparent model</p>
        <h2 className="display mt-4 text-4xl text-plum sm:text-6xl">
          See how the VELURIA funnel could add revenue for {clinicName}.
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-plum-soft">
          Model new-patient acquisition and current-client reactivation separately. The calculator shows illustrative gross treatment revenue only, not clinic profit or contribution.
        </p>
      </div>

      <article className="mb-6 grid gap-5 rounded-[1.75rem] border border-serum/15 bg-[#EAF6F2] p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-serum">Starter launch · initial four-course supply</p>
          <h3 className="mt-2 text-2xl font-semibold text-plum">A simple first capacity scenario.</h3>
          <p className="mt-2 text-sm leading-6 text-plum-soft">Four courses × {inputs.sessionsPerCourse} sessions × {gbp(inputs.sessionFee)} per session. This is separate from the scaled monthly acquisition scenario below.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[[starterCourses, "courses"], [starterSessions, "sessions"], [gbp(starterGross), "gross"]].map(([value, label]) => <div key={label} className="rounded-xl bg-white px-4 py-3"><p className="font-display text-2xl text-plum">{value}</p><p className="mt-1 text-[0.55rem] uppercase tracking-[0.11em] text-plum-mute">{label}</p></div>)}
        </div>
      </article>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.75rem] border border-serum/12 bg-white p-6 shadow-[0_20px_55px_-42px_rgba(16,35,31,0.45)]">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-serum">New-patient scenario</p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-center">
            <strong className="rounded-xl bg-[#EAF6F2] px-3 py-2 text-sm text-plum">{gbp(inputs.dailyAdSpend)}/day ads</strong>
            <FlowArrow />
            <strong className="rounded-xl bg-[#EAF6F2] px-3 py-2 text-sm text-plum">{inputs.qualifiedPaidLeads} qualified leads</strong>
            <FlowArrow />
            <strong className="rounded-xl bg-[#EAF6F2] px-3 py-2 text-sm text-plum">{paidCourses} courses</strong>
          </div>
          <p className="mt-6 font-display text-4xl text-plum">{gbp(result.paidAcquisitionRevenue)}</p>
          <p className="mt-1 text-xs text-plum-mute">Illustrative gross treatment revenue from new patients. {gbp(result.monthlyAdSpend)} monthly ads ÷ {inputs.qualifiedPaidLeads} enquiries = £{result.costPerQualifiedLead.toFixed(2)} per qualified enquiry; {paidCourses} of {inputs.qualifiedPaidLeads} = {result.leadToCourseRate}% course conversion.</p>
        </article>

        <article className="rounded-[1.75rem] border border-[#0B2747]/10 bg-[#0B2747] p-6 text-white shadow-[0_20px_55px_-42px_rgba(11,39,71,0.6)]">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-[#83D5C5]">Current-client scenario</p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-center">
            <strong className="rounded-xl bg-white/8 px-3 py-2 text-sm">Email and retargeting</strong>
            <span aria-hidden="true" className="text-white/30">→</span>
            <strong className="rounded-xl bg-white/8 px-3 py-2 text-sm">{inputs.reactivatedPatientCourses} reactivated clients</strong>
            <span aria-hidden="true" className="text-white/30">→</span>
            <strong className="rounded-xl bg-white/8 px-3 py-2 text-sm">{inputs.reactivatedPatientCourses * inputs.sessionsPerCourse} sessions</strong>
          </div>
          <p className="mt-6 font-display text-4xl text-white">{gbp(result.reactivationRevenue)}</p>
          <p className="mt-1 text-xs text-white/50">Illustrative gross treatment revenue from the existing database.</p>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
        <div className="conversion-card space-y-8">
          {GROUPS.map((group) => (
            <fieldset key={group.title}>
              <legend className="w-full border-b border-black/[0.06] pb-3">
                <span className="block text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-serum">{group.eyebrow}</span>
                <span className="mt-1 block text-lg font-semibold text-plum">{group.title}</span>
              </legend>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {group.fields.map((key) => {
                  const config = FIELD_CONFIG[key];
                  const bounds = ROI_BOUNDS[key];
                  const value = inputs[key];
                  return (
                    <label key={key} className="block">
                      <span className="flex min-h-12 items-start justify-between gap-3 text-sm font-medium text-plum">
                        <span>{config.label}</span>
                        <span className="flex shrink-0 items-center gap-1 font-display text-lg text-serum">
                          {config.money && <span aria-hidden="true">£</span>}
                          <input
                            type="number"
                            aria-label={`${config.label} value`}
                            min={bounds.min}
                            max={bounds.max}
                            step={bounds.step}
                            value={value}
                            onChange={(event) => set(key, Number(event.currentTarget.value))}
                            className="w-20 rounded-lg border border-plum/10 bg-white px-2 py-1 text-right font-display text-base text-serum outline-none transition focus:border-serum"
                          />
                          {config.suffix && <span aria-hidden="true">{config.suffix}</span>}
                        </span>
                      </span>
                      <input
                        type="range"
                        min={bounds.min}
                        max={bounds.max}
                        step={bounds.step}
                        value={value}
                        onInput={(event) => set(key, Number(event.currentTarget.value))}
                        className="mt-2 w-full accent-serum"
                        aria-describedby={`${key}-help`}
                      />
                      <span id={`${key}-help`} className="mt-2 block text-xs leading-5 text-plum-mute">{config.help}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="report-advantage-card overflow-hidden p-7 text-white sm:p-9">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8ED8C7]">Illustrative monthly scenario</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              ["New patient courses", paidCourses],
              ["Reactivated courses", inputs.reactivatedPatientCourses],
              ["Treatment sessions", result.appointments],
              ["Paid lead to course", `${result.leadToCourseRate}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="font-display text-3xl text-white">{value}</p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.12em] text-white/55">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between gap-4 text-sm text-white/65">
              <span>New-patient gross revenue</span>
              <strong className="font-display text-xl font-normal text-white">{gbp(result.paidAcquisitionRevenue)}</strong>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm text-white/65">
              <span>Existing-client gross revenue</span>
              <strong className="font-display text-xl font-normal text-white">{gbp(result.reactivationRevenue)}</strong>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3 text-sm text-white/80">
              <span>Total gross treatment revenue</span>
              <strong className="font-display text-3xl font-normal text-[#8ED8C7]">{gbp(result.grossRevenue)}</strong>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#8ED8C7]/20 bg-[#8ED8C7]/8 p-4">
            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.15em] text-[#8ED8C7]">What the system automates</p>
            <p className="mt-2 text-xs leading-6 text-white/65">Campaign response, patient education, consented lead capture, configured follow-up, retargeting and booking prompts can run without repetitive manual chasing.</p>
            <p className="mt-2 text-[0.62rem] leading-5 text-white/45">The clinic still conducts the consultation, confirms suitability and delivers treatment.</p>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200/20 bg-amber-200/10 p-4 text-xs leading-6 text-white/65">
            The default scaled month models {result.totalPatientCourses} courses and {result.appointments} sessions. It therefore requires product replenishment and enough practitioner capacity beyond the initial four-course starter supply.
          </div>

          <p className="mt-5 text-[0.65rem] leading-relaxed text-white/45">
            Gross revenue scenario only, not a forecast, guarantee or profit calculation. Clinic costs, practitioner time, product costs, marketing costs, tax, overhead, refunds, unused capacity and the separately priced optional AI Brain are not deducted. Lead volume, conversion, suitability and patient outcomes vary.
          </p>

          <a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={onBook} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#10231F] transition hover:bg-[#EAF6F2]">Book a free 20-minute VELURIA Clinic Growth Map</a>
          {onPrivateDemo && (
            <button type="button" onClick={onPrivateDemo} className="mt-3 w-full text-xs text-white/65 underline underline-offset-4 hover:text-white">Request a private walkthrough</button>
          )}
        </div>
      </div>
    </section>
  );
}
