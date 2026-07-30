"use client";

import { useMemo, useState } from "react";
import {
  computeRoi,
  gbp,
  ROI_BOUNDS,
  ROI_DEFAULTS,
  type RoiInputs,
} from "@/lib/roi";

type Field = keyof RoiInputs;

const FIELDS: { key: Field; label: string; suffix?: string; money?: boolean }[] = [
  { key: "monthlyScans", label: "Skin-scans per month" },
  { key: "optInRate", label: "Become a lead", suffix: "%" },
  { key: "bookRate", label: "Book a consultation", suffix: "%" },
  { key: "closeRate", label: "Buy a Veluria course", suffix: "%" },
  { key: "courseValue", label: "Avg. course value", money: true },
];

export default function RoiCalculator({
  webinarUrl,
  onPrivateDemo,
}: {
  webinarUrl: string;
  onPrivateDemo: () => void;
}) {
  const [inputs, setInputs] = useState<RoiInputs>(ROI_DEFAULTS);
  const result = useMemo(() => computeRoi(inputs), [inputs]);

  const set = (k: Field, v: number) => setInputs((p) => ({ ...p, [k]: v }));

  return (
    <div className="w-full animate-fade-scale">
      <div className="mb-7 text-center">
        <p className="eyebrow">Step 03 — Scenario Planner</p>
        <h2 className="display mt-3 text-4xl text-plum sm:text-5xl">
          Model the patient pathway
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-plum-soft">
          Start with our deliberately conservative assumptions, then move the
          sliders to reflect your clinic. This is planning support, not a
          forecast.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2 md:items-start">
        {/* Sliders */}
        <div className="glass space-y-5 p-6 sm:p-7">
          {FIELDS.map(({ key, label, suffix, money }) => {
            const b = ROI_BOUNDS[key];
            const val = inputs[key];
            return (
              <div key={key}>
                <div className="flex items-baseline justify-between">
                  <label className="text-sm text-plum-soft">{label}</label>
                  <span className="font-display text-lg text-plum">
                    {money ? gbp(val) : `${val}${suffix ?? ""}`}
                  </span>
                </div>
                <input
                  type="range"
                  min={b.min}
                  max={b.max}
                  step={b.step}
                  value={val}
                  onChange={(e) => set(key, Number(e.target.value))}
                  className="mt-2 w-full accent-serum"
                />
              </div>
            );
          })}
        </div>

        {/* Result */}
        <div className="glass flex flex-col gap-5 p-6 sm:p-7">
          <div className="text-center">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-plum-soft">
          Illustrative pipeline value
            </p>
            <p className="font-display text-5xl text-plum sm:text-6xl">
              {gbp(result.monthlyRevenue)}
            </p>
            <p className="mt-1 text-sm text-plum-mute">per month</p>
            <p className="mt-2 text-sm font-medium serum-text">
              {gbp(result.annualRevenue)} a year
            </p>
          </div>

          <div className="hairline" />

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ["Leads", result.leads],
              ["Consults", result.consultations],
              ["Courses", result.courses],
            ].map(([label, n]) => (
              <div key={label as string} className="glass-soft px-2 py-4">
                <p className="font-display text-2xl text-plum">{n as number}</p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.12em] text-plum-soft">
                  {label as string}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-[0.65rem] leading-relaxed text-plum-mute">
            Scenario only—not a forecast or guarantee. Revenue is gross course
            value before product, media, staffing and operating costs. Actual
            results depend on demand, offer, clinical suitability and follow-up.
          </p>

          <a
            href={webinarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-serum w-full"
          >
            Reserve webinar place →
          </a>
          <button onClick={onPrivateDemo} className="btn-ghost w-full">
            Request a private walkthrough
          </button>
        </div>
      </div>
    </div>
  );
}
