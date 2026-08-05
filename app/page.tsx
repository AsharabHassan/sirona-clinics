"use client";

import { useEffect, useState } from "react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import BrandStamp from "@/components/BrandStamp";
import ClinicLeadForm from "@/components/ClinicLeadForm";
import ConversionReport from "@/components/ConversionReport";
import DemoPreview from "@/components/DemoPreview";
import RoiCalculator from "@/components/RoiCalculator";
import { makeBrand, type BrandConfig } from "@/lib/brand";
import type { ClinicLeadPayload } from "@/lib/types";

type Step =
  | "landing"
  | "brand"
  | "demo"
  | "report"
  | "roi"
  | "form"
  | "done";

const CONSULTATION_URL =
  "https://link.sironaaesthetics.co.uk/widget/bookings/free-20-mint-online-consultation";

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m4.8 8.1 2.05 2.05 4.35-4.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [brand, setBrand] = useState<BrandConfig>(makeBrand());
  const [lead, setLead] = useState<ClinicLeadPayload | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clinic = params.get("clinic")?.trim().slice(0, 80);
    if (clinic) setBrand(makeBrand({ clinicName: clinic }));

    const requestedView = params.get("view");
    if (
      requestedView === "demo" ||
      requestedView === "report" ||
      requestedView === "roi"
    ) {
      setStep(requestedView);
    }
  }, []);

  const isPersonalised = brand.clinicName !== "Your Clinic";
  const clinicCopy = isPersonalised ? brand.clinicName : "your clinic";

  const beginPreview = () => {
    setStep(isPersonalised ? "demo" : "brand");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goTo = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <header className="relative z-30 border-b border-black/[0.06] bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <button
            type="button"
            onClick={() => goTo("landing")}
            className="flex items-center gap-3 text-left"
            aria-label="Back to the campaign page"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sirona-logo.png"
              alt="Sirona Aesthetics"
              className="h-8 w-auto"
            />
            <span className="hidden border-l border-black/10 pl-3 text-[0.58rem] uppercase leading-relaxed tracking-[0.22em] text-plum-mute sm:block">
              VELURIA
              <br />
              clinic growth
            </span>
          </button>

          <div className="hidden items-center gap-2 text-xs text-plum-soft md:flex">
            <span className="h-2 w-2 rounded-full bg-serum shadow-[0_0_0_5px_rgba(11,110,92,0.1)]" />
            Free 20-minute clinic consultation
          </div>

          <a
            href={CONSULTATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-serum !px-5 !py-3 !text-[0.62rem] sm:!px-7"
          >
            Book a free consultation
          </a>
        </div>
      </header>

      {step === "landing" ? (
        <LandingPage
          clinicCopy={clinicCopy}
          beginPreview={beginPreview}
        />
      ) : (
        <div className="relative z-10 mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => goTo("landing")}
              className="text-xs font-medium uppercase tracking-[0.14em] text-plum-mute transition hover:text-plum"
            >
              ← Campaign overview
            </button>
            <div className="flex items-center gap-2">
              {["Brand", "AI Preview", "Report", "Potential"].map((label, index) => {
                const activeIndex =
                  step === "brand"
                    ? 0
                    : step === "demo"
                      ? 1
                      : step === "report"
                        ? 2
                        : 3;
                return (
                  <span
                    key={label}
                    className={`rounded-full px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.12em] ${
                      index <= activeIndex
                        ? "bg-serum text-white"
                        : "bg-black/[0.05] text-plum-mute"
                    }`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>

          {step === "brand" && (
            <BrandStamp
              key="brand"
              initialBrand={brand}
              onDone={(nextBrand) => {
                setBrand(nextBrand);
                goTo("demo");
              }}
            />
          )}

          {step === "demo" && (
            <DemoPreview
              key="demo"
              brand={brand}
              consultationUrl={CONSULTATION_URL}
              onEditBrand={() => goTo("brand")}
              onContinue={() => goTo("report")}
            />
          )}

          {step === "report" && (
            <ConversionReport
              key="report"
              brand={brand}
              consultationUrl={CONSULTATION_URL}
              onExplore={() => goTo("roi")}
              onPrivateDemo={() => goTo("form")}
            />
          )}

          {step === "roi" && (
            <RoiCalculator
              key="roi"
              consultationUrl={CONSULTATION_URL}
              onPrivateDemo={() => goTo("form")}
            />
          )}

          {step === "form" && (
            <ClinicLeadForm
              key="form"
              brand={brand}
              onSubmitted={(submittedLead) => {
                setLead(submittedLead);
                goTo("done");
              }}
            />
          )}

          {step === "done" && (
            <section className="mx-auto max-w-xl animate-fade-scale text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-serum text-white">
                <TickIcon />
              </div>
              <p className="eyebrow mt-6">Request received</p>
              <h2 className="display mt-3 text-4xl text-plum sm:text-6xl">
                Thank you
                {lead?.ownerName
                  ? `, ${lead.ownerName.split(/\s+/)[0]}`
                  : ""}
                .
              </h2>
              <p className="mx-auto mt-5 max-w-md leading-relaxed text-plum-soft">
                Sirona will follow up about your VELURIA clinic-growth
                walkthrough. You can choose a free 20-minute online consultation
                now.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={CONSULTATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-serum"
                >
                  Choose my consultation <ArrowIcon />
                </a>
              </div>
            </section>
          )}
        </div>
      )}

      <footer className="relative z-10 border-t border-black/[0.06] bg-white/55">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-center text-[0.62rem] uppercase tracking-[0.14em] text-plum-mute sm:flex-row sm:px-8 sm:text-left">
          <span>
            © {new Date().getFullYear()} Sirona Aesthetics · VELURIA by PBSerum
          </span>
          <span>
            Cosmetic AI visualisation · Non-diagnostic · Results vary
          </span>
        </div>
      </footer>
    </main>
  );
}

function LandingPage({
  clinicCopy,
  beginPreview,
}: {
  clinicCopy: string;
  beginPreview: () => void;
}) {
  return (
    <>
      <section className="relative z-10">
        <div className="mx-auto grid min-h-[760px] max-w-[1320px] items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:py-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-serum/15 bg-white/70 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-serum">
              <span className="h-1.5 w-1.5 rounded-full bg-serum" />
              The live VELURIA AI patient experience
            </div>

            <h1 className="display mt-7 text-[3.45rem] text-plum sm:text-7xl lg:text-[4.75rem]">
              Show the difference.
              <span className="serum-text italic"> Start the conversation.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-plum-soft sm:text-lg sm:leading-8">
              For <strong className="font-semibold text-plum">{clinicCopy}</strong>,
              this is the patient hook: a branded, non-diagnostic AI
              before-and-after designed to move passive treatment interest
              toward an informed consultation.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={beginPreview} className="btn-serum">
                Launch the AI before &amp; after <ArrowIcon />
              </button>
              <a
                href={CONSULTATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Book a free consultation
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-plum-mute">
              {["Drag-to-compare preview", "Optional live AI", "Clinic-branded journey"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <TickIcon />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[650px]">
            <div className="absolute -inset-10 -z-10 rounded-full bg-[#DFF3EE]/80 blur-3xl" />
            <div className="landing-preview-shell">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7 sm:py-5">
                <div>
                  <p className="text-[0.56rem] uppercase tracking-[0.18em] text-white/55">
                    Drag to compare
                  </p>
                  <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                    Real VELURIA before &amp; after
                  </p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.14em] text-white/75">
                  Aesthetics Central
                </span>
              </div>

              <div className="p-4 sm:p-7">
                <BeforeAfterSlider
                  before="/assets/case-studies/facial-rejuvenation-before.webp"
                  after="/assets/case-studies/facial-rejuvenation-after.webp"
                  beforeAlt="Before the VELURIA course"
                  afterAlt="Real VELURIA result"
                  afterLabel="After VELURIA"
                />
                <div className="mt-5 rounded-2xl bg-white/[0.07] p-4 sm:p-5">
                  <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                    The real result establishes product credibility. The AI
                    experience lets a patient explore visible skin quality and
                    creates a clearer route into consultation.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Hydration", "Texture", "Fine lines"].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.12em] text-white/60"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-sm text-center text-[0.65rem] leading-relaxed text-plum-mute">
              Real VELURIA case study from Aesthetics Central. Individual
              results vary. The live AI experience is illustrative and
              non-diagnostic.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-serum/10 bg-[#EAF6F2]/75">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-7 sm:px-8 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <p className="eyebrow">Free 20-minute online consultation</p>
            <h2 className="mt-2 text-xl font-medium text-plum">
              See how VELURIA and the AI patient funnel could fit your clinic
            </h2>
          </div>
          <div className="text-sm leading-6 text-plum-soft md:border-l md:border-serum/15 md:pl-8">
            <strong className="font-semibold text-plum">Choose a time that suits you</strong>
            <br />
            Personalised · Online · No obligation
          </div>
          <a
            href={CONSULTATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-serum whitespace-nowrap"
          >
            View available times <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">More than a product introduction</p>
          <h2 className="display mt-4 text-4xl text-plum sm:text-6xl">
            The range, the patient story and the route to consultation.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-plum-soft">
            The campaign is designed to help clinics explain skin quality
            clearly, capture genuine interest and follow up with the right
            conversation.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Personalised attention",
              copy: "A clinic-branded experience gives patients a reason to stop, interact and understand the treatment conversation.",
            },
            {
              number: "02",
              title: "Responsible visualisation",
              copy: "The AI experience stays cosmetic and non-diagnostic, with visible limitations and clinician consultation built in.",
            },
            {
              number: "03",
              title: "Follow-up that connects",
              copy: "Patient interest can move into a structured enquiry and follow-up journey instead of disappearing after a social click.",
            },
          ].map((item) => (
            <article key={item.number} className="conversion-card">
              <span className="font-display text-3xl text-serum/45">
                {item.number}
              </span>
              <h3 className="mt-8 text-xl font-medium text-plum">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-plum-soft">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 bg-[#10231F] text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8ED8C7]">
              See it before your consultation
            </p>
            <h2 className="display mt-5 text-4xl sm:text-6xl">
              Put your clinic&rsquo;s name on the patient journey.
            </h2>
            <p className="mt-5 max-w-lg leading-7 text-white/65">
              The fastest way to understand the concept is to experience it.
              Brand the preview, explore the patient view and then use a short
              Sirona consultation to review the range, training and funnel.
            </p>
            <button
              type="button"
              onClick={beginPreview}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#10231F] transition hover:-translate-y-0.5 hover:bg-[#EAF6F2]"
            >
              Build my preview <ArrowIcon />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Clinic branded", "Your name, colour and optional logo appear in the patient preview."],
              ["Instant sample", "Visitors can understand the experience before choosing to try the live AI."],
              ["Transparent model", "Inputs and assumptions remain visible in the optional pipeline planner."],
              ["Human next step", "Every route leads back to a qualified clinic conversation."],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6"
              >
                <TickIcon />
                <h3 className="mt-5 font-medium text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
        <p className="eyebrow">Free 20-minute online consultation</p>
        <h2 className="display mt-5 text-5xl text-plum sm:text-7xl">
          See where VELURIA could fit in your clinic.
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-plum-soft">
          Choose a private time with Sirona to discuss the professional range,
          clinic fit, training and the patient-pipeline support behind this preview.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={CONSULTATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-serum"
          >
            Book my free consultation <ArrowIcon />
          </a>
          <button type="button" onClick={beginPreview} className="btn-ghost">
            Try the clinic preview
          </button>
        </div>
      </section>
    </>
  );
}
