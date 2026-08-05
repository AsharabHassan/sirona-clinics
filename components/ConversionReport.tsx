"use client";

import type { BrandConfig } from "@/lib/brand";

function Check({
  muted = false,
  inverse = false,
}: {
  muted?: boolean;
  inverse?: boolean;
}) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
        muted
          ? "bg-black/[0.06] text-plum-mute"
          : inverse
            ? "bg-white/[0.12] text-[#8ED8C7]"
            : "bg-serum/10 text-serum"
      }`}
      aria-hidden="true"
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path
          d="m2.25 6.15 2.25 2.2 5.25-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function ConversionReport({
  brand,
  consultationUrl,
  onExplore,
  onPrivateDemo,
}: {
  brand: BrandConfig;
  consultationUrl: string;
  onExplore: () => void;
  onPrivateDemo: () => void;
}) {
  const clinic =
    brand.clinicName === "Your Clinic" ? "your clinic" : brand.clinicName;

  const traditional = [
    "Static treatment content asks patients to imagine whether it is relevant.",
    "Product education has to carry the entire marketing conversation.",
    "Enquiries can depend on staff being available at exactly the right moment.",
    "The path from social attention to consultation can be difficult to see.",
  ];

  const aiEnabled = [
    "A branded cosmetic AI visualisation gives patients a reason to interact.",
    "Visible skin-quality topics create a more useful consultation starting point.",
    "Consent and enquiry details can move into a structured CRM journey.",
    "Follow-up workflows can keep the conversation moving while the clinic stays in control.",
  ];

  const journey = [
    {
      number: "01",
      title: "Attract",
      copy: "Campaign creative introduces the VELURIA skin-quality conversation.",
    },
    {
      number: "02",
      title: "Engage",
      copy: "The patient explores a personalised, non-diagnostic AI visualisation.",
    },
    {
      number: "03",
      title: "Follow up",
      copy: "The captured enquiry can trigger an agreed CRM, SMS or calling workflow.",
    },
    {
      number: "04",
      title: "Consult",
      copy: "Your clinical team assesses suitability and discusses realistic outcomes.",
    },
  ];

  return (
    <section className="animate-fade-scale">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Your clinic growth report</p>
        <h2 className="display mt-4 text-5xl text-plum sm:text-7xl">
          The product creates the treatment opportunity.
          <span className="serum-text italic"> The journey creates attention.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-plum-soft">
          Here is the commercial difference between simply listing VELURIA and
          giving {clinic} a patient journey designed to attract, engage and
          support timely follow-up.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-serum/[0.12] bg-[#EAF6F2] p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-serum">
              The clinical report patients experience
            </p>
            <h3 className="mt-2 text-xl font-medium text-plum">
              Four conversion moments in one journey
            </h3>
          </div>
          <p className="max-w-sm text-xs leading-5 text-plum-mute">
            Education and visualisation support the consultation—they never
            replace clinical assessment.
          </p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["01", "Visible-skin summary"],
            ["02", "AI before & after"],
            ["03", "VELURIA direction"],
            ["04", "Consultation next step"],
          ].map(([number, label]) => (
            <div
              key={number}
              className="rounded-2xl border border-white bg-white/75 p-4"
            >
              <span className="font-display text-xl text-serum/45">{number}</span>
              <p className="mt-3 text-sm font-semibold text-plum">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-5 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-black/[0.07] bg-white/65 p-7 sm:p-9">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-plum-mute">
                Product-only promotion
              </p>
              <h3 className="mt-2 text-2xl font-medium text-plum">
                A strong treatment with a passive patient journey
              </h3>
            </div>
            <span className="rounded-full bg-black/[0.05] px-3 py-1.5 text-[0.56rem] uppercase tracking-[0.13em] text-plum-mute">
              Traditional
            </span>
          </div>
          <div className="mt-7 space-y-4">
            {traditional.map((item) => (
              <p key={item} className="flex gap-3 text-sm leading-6 text-plum-soft">
                <Check muted />
                {item}
              </p>
            ))}
          </div>
        </article>

        <article className="report-advantage-card p-7 text-white sm:p-9">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8ED8C7]">
                VELURIA + AI patient pipeline
              </p>
              <h3 className="mt-2 text-2xl font-medium text-white">
                Product, interaction and follow-up working together
              </h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-[0.56rem] uppercase tracking-[0.13em] text-white/70">
              Connected
            </span>
          </div>
          <div className="mt-7 space-y-4">
            {aiEnabled.map((item) => (
              <p key={item} className="flex gap-3 text-sm leading-6 text-white/72">
                <Check inverse />
                {item}
              </p>
            ))}
          </div>
        </article>
      </div>

      <div className="mx-auto mt-16 max-w-5xl">
        <div className="text-center">
          <p className="eyebrow">The connected clinic journey</p>
          <h3 className="display mt-3 text-4xl text-plum sm:text-5xl">
            From first click to an informed consultation.
          </h3>
        </div>

        <div className="relative mt-10 grid gap-4 md:grid-cols-4">
          <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-[#3ABBD6] via-[#D83F91] to-[#F1C928] md:block" />
          {journey.map((item, index) => (
            <article
              key={item.number}
              className="relative rounded-[1.6rem] border border-black/[0.06] bg-white/75 p-5 text-center"
            >
              <span
                className={`relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-white font-display text-xl text-white shadow-dew ${
                  index === 0
                    ? "bg-[#34AFCB]"
                    : index === 1
                      ? "bg-[#C63B91]"
                      : index === 2
                        ? "bg-[#D7AD17]"
                        : "bg-[#173C6A]"
                }`}
              >
                {item.number}
              </span>
              <h4 className="mt-5 font-semibold text-plum">{item.title}</h4>
              <p className="mt-2 text-xs leading-5 text-plum-soft">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl rounded-[2rem] border border-black/[0.06] bg-white/70 p-7 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div>
            <p className="eyebrow">The VELURIA clinic offer</p>
            <h3 className="display mt-4 text-4xl text-plum sm:text-5xl">
              Three professional pathways. One patient experience.
            </h3>
            <p className="mt-5 text-sm leading-7 text-plum-soft">
              The clinical range gives the consultation substance. The AI
              experience helps a patient understand which visible skin-quality
              conversation may be relevant before your team assesses them.
            </p>
            <p className="mt-5 text-[0.62rem] leading-relaxed text-plum-mute">
              Final product choice, protocol and suitability are determined by
              a qualified clinician. Individual outcomes vary.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              {
                name: "VELURIA Silk Skin",
                focus: "Texture · hydration · radiance",
                colour: "#36AEC9",
              },
              {
                name: "VELURIA Ultra Lift",
                focus: "Appearance of firmness · elasticity",
                colour: "#D13C91",
              },
              {
                name: "VELURIA Pearl Tone",
                focus: "Appearance of uneven tone · luminosity",
                colour: "#D4AA12",
              },
            ].map((product) => (
              <div
                key={product.name}
                className="flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-4"
              >
                <span
                  className="h-11 w-1.5 shrink-0 rounded-full"
                  style={{ background: product.colour }}
                />
                <div>
                  <p className="font-semibold text-plum">{product.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.11em] text-plum-mute">
                    {product.focus}
                  </p>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-serum/15 bg-[#EAF6F2] p-5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-serum">
                The AI marketing layer
              </p>
              <p className="mt-2 text-sm leading-6 text-plum-soft">
                Branded analysis, illustrative visualisation, consented lead
                capture and an agreed follow-up route around the clinical offer.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="report-consultation-card mx-auto mt-16 max-w-5xl overflow-hidden">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#8ED8C7]">
              Free 20-minute online clinic consultation
            </p>
            <h3 className="display mt-4 text-4xl text-white sm:text-5xl">
              See how VELURIA and the patient pipeline could fit your clinic.
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
              Use a private call to review the professional range, training,
              clinic fit and how the AI, CRM and follow-up layers can support
              your own patient campaign.
            </p>
          </div>
          <a
            href={consultationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#10231F] transition hover:-translate-y-0.5 hover:bg-[#EAF6F2]"
          >
            Choose a consultation time →
          </a>
        </div>
        <div className="grid border-t border-white/10 sm:grid-cols-4">
          {[
            "VELURIA range",
            "AI lead funnel",
            "CRM handoff",
            "Follow-up workflow",
          ].map((item) => (
            <div
              key={item}
              className="border-white/10 px-5 py-4 text-center text-[0.58rem] uppercase tracking-[0.14em] text-white/55 sm:border-r last:sm:border-r-0"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button type="button" onClick={onExplore} className="btn-ghost">
          Explore a clinic scenario
        </button>
        <button
          type="button"
          onClick={onPrivateDemo}
          className="text-xs font-medium text-plum-mute underline underline-offset-4 transition hover:text-plum"
        >
          Prefer a private walkthrough?
        </button>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-[0.62rem] leading-relaxed text-plum-mute">
        Marketing and automation support do not guarantee leads, bookings,
        patients or revenue. Campaign results depend on budget, audience, offer,
        clinic capacity and follow-up.
      </p>
    </section>
  );
}
