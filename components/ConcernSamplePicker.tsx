"use client";

import { CONCERN_SAMPLES, type ConcernSample } from "@/lib/concernSamples";
import { VELURIA_PRODUCTS } from "@/lib/veluria";

export default function ConcernSamplePicker({
  onUsePhoto,
  onSelect,
  onEditBrand,
}: {
  onUsePhoto: () => void;
  onSelect: (sample: ConcernSample) => void;
  onEditBrand: () => void;
}) {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Choose your patient experience</p>
        <h2 className="display mt-3 text-4xl text-plum sm:text-6xl">
          Try it on your face, or explore an instant patient journey.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-plum-soft">
          Use a real photograph for a live, consented analysis, or choose a
          common concern to see the complete clinic-branded experience instantly.
        </p>
        <button
          type="button"
          onClick={onEditBrand}
          className="mt-3 text-xs text-plum-mute underline underline-offset-4 hover:text-plum"
        >
          Change clinic branding
        </button>
      </div>

      <button
        type="button"
        onClick={onUsePhoto}
        className="group mx-auto mt-10 flex w-full max-w-5xl flex-col items-start justify-between gap-5 rounded-[2rem] bg-[#10231F] p-7 text-left text-white shadow-dew transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:p-9"
      >
        <div>
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8ED8C7]">
            Live AI experience
          </span>
          <h3 className="display mt-3 text-3xl sm:text-4xl">Analyse my own face</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
            Continue to consent, camera or upload, patient lead capture, live
            skin analysis and a personalised visual preview.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#10231F]">
          Use my photo →
        </span>
      </button>

      <div className="mx-auto mt-10 max-w-5xl">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Instant demonstrations</p>
            <h3 className="mt-2 text-2xl font-medium text-plum">Explore a patient concern</h3>
          </div>
          <p className="text-xs text-plum-mute">No upload, lead form or API wait</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONCERN_SAMPLES.map((sample) => {
            const product = VELURIA_PRODUCTS[sample.productId];
            return (
              <button
                type="button"
                key={sample.id}
                onClick={() => onSelect(sample)}
                className="group overflow-hidden rounded-[1.65rem] border border-black/[0.07] bg-white/80 text-left shadow-sm transition hover:-translate-y-1 hover:border-serum/25 hover:shadow-dew focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-serum"
                aria-label={`Explore ${sample.label} with ${product.name}`}
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-pearl-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.before}
                    alt={`Synthetic demonstration for ${sample.label}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#10231F]/90 px-3 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.13em] text-white">
                    Synthetic AI demo
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-base font-semibold text-plum">{sample.label}</p>
                  <p className="mt-2 text-xs leading-5 text-plum-soft">{sample.description}</p>
                  <p className="mt-4 text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-serum">
                    {product.name} →
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-center text-[0.65rem] leading-5 text-plum-mute">
          All six concern portraits and previews are synthetic AI demonstrations,
          not real patients or clinical evidence. Individual treatment outcomes vary.
        </p>
      </div>
    </section>
  );
}
