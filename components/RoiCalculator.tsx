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

const FIELDS: {
  key: Field;
  label: string;
  help: string;
  suffix?: string;
  money?: boolean;
}[] = [
  {
    key: "qualifiedEnquiries",
    label: "Qualified enquiries per month",
    help: "People who complete the clinic-branded funnel or enquire directly.",
  },
  {
    key: "bookRate",
    label: "Enquiries that book",
    help: "The percentage that books a clinic consultation.",
    suffix: "%",
  },
  {
    key: "closeRate",
    label: "Consultations that start a course",
    help: "The percentage that is suitable and chooses a three-session course.",
    suffix: "%",
  },
  {
    key: "courseValue",
    label: "Average three-session course fee",
    help: "What your clinic would charge the patient for the complete course.",
    money: true,
  },
  {
    key: "variableCourseCost",
    label: "Delivery cost per course",
    help: "Product, consumables and other direct treatment costs.",
    money: true,
  },
  {
    key: "monthlyMarketingCost",
    label: "Monthly campaign cost",
    help: "An adjustable allowance for media and campaign activity.",
    money: true,
  },
];

export default function RoiCalculator({
  consultationUrl,
  clinicName = "your clinic",
  onPrivateDemo,
  onAdjust,
  embedded = false,
}: {
  consultationUrl: string;
  clinicName?: string;
  onPrivateDemo?: () => void;
  onAdjust?: () => void;
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

  return (
    <section className={embedded ? "w-full" : "w-full animate-fade-scale"}>
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">Transparent clinic economics</p>
        <h2 className="display mt-4 text-4xl text-plum sm:text-6xl">
          Model the opportunity for {clinicName}.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-plum-soft">
          Change every assumption to match your clinic. The model includes
          direct delivery costs and campaign spend, so the result is visible
          rather than hidden behind a headline revenue claim.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="conversion-card grid gap-6 sm:grid-cols-2">
          {FIELDS.map(({ key, label, help, suffix, money }) => {
            const bounds = ROI_BOUNDS[key];
            const value = inputs[key];
            return (
              <label key={key} className="block">
                <span className="flex min-h-12 items-start justify-between gap-4 text-sm font-medium text-plum">
                  <span>{label}</span>
                  <span className="flex shrink-0 items-center gap-1 font-display text-lg text-serum">
                    {money && <span aria-hidden="true">£</span>}
                    <input
                      type="number"
                      aria-label={`${label} value`}
                      min={bounds.min}
                      max={bounds.max}
                      step={bounds.step}
                      value={value}
                      onChange={(event) => set(key, Number(event.currentTarget.value))}
                      className="w-20 rounded-lg border border-plum/10 bg-white px-2 py-1 text-right font-display text-base text-serum outline-none transition focus:border-serum"
                    />
                    {suffix && <span aria-hidden="true">{suffix}</span>}
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
                <span id={`${key}-help`} className="mt-2 block text-xs leading-5 text-plum-mute">
                  {help}
                </span>
              </label>
            );
          })}
        </div>

        <div className="report-advantage-card overflow-hidden p-7 text-white sm:p-9">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8ED8C7]">
            Illustrative monthly scenario
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              ["Consultations", result.consultations],
              ["Patient courses", result.courses],
              ["Appointments", result.appointments],
              ["Break-even courses", result.breakEvenCourses ?? "Not reached"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="font-display text-3xl text-white">{value}</p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.12em] text-white/55">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
            <div className="flex items-center justify-between gap-4 text-sm text-white/65">
              <span>Gross course revenue</span>
              <strong className="font-display text-2xl font-normal text-white">
                {gbp(result.grossRevenue)}
              </strong>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm text-white/65">
              <span>Direct and campaign costs</span>
              <strong className="font-medium text-white">− {gbp(result.deliveryCosts)}</strong>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3 text-sm text-white/80">
              <span>Contribution before overhead</span>
              <strong className="font-display text-3xl font-normal text-[#8ED8C7]">
                {gbp(result.contribution)}
              </strong>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white/[0.06] p-4 text-xs leading-6 text-white/60">
            The starter supply supports four patient courses of three sessions
            each: 12 treatment appointments across the complete range. Package
            pricing is reviewed privately during the consultation.
          </div>

          <p className="mt-5 text-[0.65rem] leading-relaxed text-white/45">
            Adjustable scenario only, not a forecast or guarantee. It excludes
            tax, fixed overhead, refunds, finance costs and unused capacity.
            Actual demand, suitability, pricing and follow-up will vary.
          </p>

          <a
            href={consultationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#10231F] transition hover:bg-[#EAF6F2]"
          >
            Build my clinic growth map
          </a>
          {onPrivateDemo && (
            <button type="button" onClick={onPrivateDemo} className="mt-3 w-full text-xs text-white/65 underline underline-offset-4 hover:text-white">
              Request a private walkthrough
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
