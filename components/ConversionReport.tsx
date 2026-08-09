"use client";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import type { BrandConfig } from "@/lib/brand";
import type { ClinicProfile } from "@/lib/campaign";
import type { PatientJourneySnapshot } from "@/lib/types";
import {
  VELURIA_PRODUCTS,
  type VeluriaProduct,
  type VeluriaProductId,
} from "@/lib/veluria";

const REAL_CASE_BEFORE = "/assets/case-studies/facial-rejuvenation-before.webp";
const REAL_CASE_AFTER = "/assets/case-studies/facial-rejuvenation-after.webp";

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ConsultationCta({
  consultationUrl,
  clinic,
  position,
}: {
  consultationUrl: string;
  clinic: string;
  position: "patient-value" | "proof" | "final";
}) {
  const copy =
    position === "patient-value"
      ? "See how this exact patient journey could be adapted to your treatments, calendar and follow-up process."
      : position === "proof"
        ? "Review the clinical range, training and patient-acquisition journey in one focused conversation."
        : `Map the most relevant VELURIA pathway and patient journey for ${clinic}.`;

  return (
    <div className="report-consultation-card overflow-hidden">
      <div className="grid gap-6 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8ED8C7]">
            Free 20-minute VELURIA Clinic Growth Map
          </p>
          <h3 className="display mt-3 text-3xl text-white sm:text-4xl">
            Turn patient curiosity into a qualified clinic conversation.
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">{copy}</p>
        </div>
        <a
          href={consultationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[#10231F] transition hover:-translate-y-0.5 hover:bg-[#EAF6F2]"
        >
          Book my growth map <ArrowIcon />
        </a>
      </div>
    </div>
  );
}

function ProductCard({ product, primary }: { product: VeluriaProduct; primary: boolean }) {
  const colour =
    product.id === "silk-skin" ? "#36AEC9" : product.id === "ultra-lift" ? "#D13C91" : "#D4AA12";
  return (
    <article className={`rounded-[1.65rem] border p-6 ${primary ? "border-serum/20 bg-[#EAF6F2]" : "border-black/[0.06] bg-white/75"}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="h-10 w-1.5 rounded-full" style={{ backgroundColor: colour }} />
        {primary && (
          <span className="rounded-full bg-serum px-3 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.13em] text-white">
            Matched first
          </span>
        )}
      </div>
      <h4 className="mt-5 text-lg font-semibold text-plum">{product.name}</h4>
      <p className="mt-1 text-[0.62rem] uppercase tracking-[0.12em] text-plum-mute">{product.tagline}</p>
      <p className="mt-4 text-sm leading-6 text-plum-soft">{product.visibleResult}</p>
    </article>
  );
}

export default function ConversionReport({
  brand,
  profile,
  consultationUrl,
  patientJourney,
  onExplore,
  onPrivateDemo,
}: {
  brand: BrandConfig;
  profile?: ClinicProfile;
  consultationUrl: string;
  patientJourney: PatientJourneySnapshot | null;
  onExplore: () => void;
  onPrivateDemo: () => void;
}) {
  const clinic = brand.clinicName === "Your Clinic" ? "your clinic" : brand.clinicName;
  const isFallback = !patientJourney;
  const before = patientJourney?.before ?? REAL_CASE_BEFORE;
  const after = patientJourney?.after ?? REAL_CASE_AFTER;
  const summary = patientJourney?.analysis.summary ??
    "A real Aesthetics Central VELURIA case study showing visible improvements in hydration, texture and fine-line appearance after a clinician-led treatment course.";
  const concernLabel = patientJourney?.concernLabel ?? "Facial skin-quality rejuvenation";

  const matchedIds: VeluriaProductId[] = patientJourney?.matchedProductIds.length
    ? patientJourney.matchedProductIds
    : ["silk-skin"];
  const profileIds = (profile?.relevantProducts ?? []).filter(
    (id): id is VeluriaProductId => id === "silk-skin" || id === "ultra-lift" || id === "pearl-tone",
  );
  const orderedIds = Array.from(new Set<VeluriaProductId>([...matchedIds, ...profileIds]));
  const orderedProducts = orderedIds.map((id) => VELURIA_PRODUCTS[id]);

  const valueMap = [
    ["Personalised visual", "Patient sees", "A relevant image and concern story", "Clinic gains", "Active engagement instead of a passive page view"],
    ["Concern explanation", "Patient sees", "Clear, supportive language about what is visible", "Clinic gains", "A useful treatment conversation already started"],
    ["VELURIA match", "Patient sees", "The pathway connected to their concern", "Clinic gains", "Informed product interest before the consultation"],
    ["Saved report", "Patient sees", "A useful result they can revisit", "Clinic gains", "A credible follow-up asset for the team"],
    ["Consultation button", "Patient sees", "One clear, human next step", "Clinic gains", "A qualified calendar handoff at peak interest"],
  ];

  const funnel = [
    ["01", "Campaign click", "A clinic-specific message opens the branded experience."],
    ["02", "Concern interaction", "The patient chooses a relevant concern or their own photograph."],
    ["03", "Consented capture", "Live-photo users consent and provide enquiry details before reveal."],
    ["04", "Personalised report", "The result explains visible skin quality and a relevant VELURIA pathway."],
    ["05", "CRM follow-up", "The clinic receives the consented lead and an agreed follow-up task."],
    ["06", "Clinic consultation", "A qualified professional assesses suitability and sets expectations."],
  ];

  return (
    <section className="animate-fade-scale pb-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Your clinic growth report</p>
        <h2 className="display mt-4 text-5xl text-plum sm:text-7xl">
          What your patient just experienced,
          <span className="serum-text italic"> translated into clinic value.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-plum-soft">
          This report shows how the patient-facing journey creates treatment
          relevance, informed product interest and a clear handoff to {clinic}.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-7 rounded-[2rem] border border-black/[0.06] bg-white/75 p-5 shadow-sm sm:p-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.13em] ${patientJourney?.source === "sample" ? "bg-[#10231F] text-white" : "bg-serum text-white"}`}>
              {patientJourney?.source === "sample" ? "Synthetic AI demonstration" : "Real VELURIA case study"}
            </span>
            <span className="rounded-full bg-black/[0.05] px-3 py-1.5 text-[0.56rem] uppercase tracking-[0.12em] text-plum-mute">
              {isFallback ? "Aesthetics Central fallback" : "Completed journey"}
            </span>
          </div>
          {after ? (
            <BeforeAfterSlider
              before={before}
              after={after}
              beforeAlt={`Before: ${concernLabel}`}
              afterAlt={`After preview: ${concernLabel}`}
              afterLabel={patientJourney?.source === "sample" ? "Illustrative after" : "After VELURIA"}
            />
          ) : (
            <div className="overflow-hidden rounded-[1.6rem] border border-black/[0.06] bg-pearl-deep">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={before} alt={`Analysis image for ${concernLabel}`} className="aspect-square w-full object-cover" />
              <p className="bg-white p-4 text-center text-xs leading-5 text-plum-soft">
                The visual preview could not be completed, so this report continues with the analysis-only patient journey.
              </p>
            </div>
          )}
          {patientJourney?.disclosure && (
            <p className="mt-3 text-center text-[0.65rem] leading-5 text-plum-mute">{patientJourney.disclosure}</p>
          )}
          {isFallback && (
            <p className="mt-3 text-center text-[0.65rem] leading-5 text-plum-mute">
              Real VELURIA case study from Aesthetics Central. Individual outcomes vary.
            </p>
          )}
        </div>
        <div className="lg:pt-3">
          <p className="eyebrow">Patient concern</p>
          <h3 className="mt-3 text-3xl font-medium text-plum">{concernLabel}</h3>
          <p className="mt-4 text-sm leading-7 text-plum-soft">{summary}</p>
          <div className="mt-6 space-y-3">
            {(patientJourney?.analysis.categories ?? [
              { label: "Hydration", score: 64, note: "Visible skin-quality opportunity" },
              { label: "Texture & pores", score: 61, note: "Visible skin-quality opportunity" },
              { label: "Fine lines", score: 62, note: "Visible skin-quality opportunity" },
            ]).slice(0, 4).map((category) => (
              <div key={category.label} className="rounded-2xl bg-[#F6FBF9] p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold text-plum">{category.label}</p>
                  <span className="font-display text-lg text-serum">{category.score}/100</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-plum-mute">{category.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-serum/15 bg-[#EAF6F2] p-5">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-serum">Matched pathway</p>
            <p className="mt-2 font-semibold text-plum">{matchedIds.map((id) => VELURIA_PRODUCTS[id].name).join(" + ")}</p>
            {patientJourney && <p className="mt-2 text-xs leading-5 text-plum-soft">{patientJourney.analysis.veluriaRecommendation}</p>}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl">
        <div className="text-center">
          <p className="eyebrow">Patient value · clinic value</p>
          <h3 className="display mt-3 text-4xl text-plum sm:text-5xl">Every screen has a commercial purpose.</h3>
        </div>
        <div className="mt-9 space-y-3">
          {valueMap.map(([moment, patientLabel, patientValue, clinicLabel, clinicValue]) => (
            <article key={moment} className="grid gap-4 rounded-[1.5rem] border border-black/[0.06] bg-white/75 p-5 sm:grid-cols-[0.58fr_1fr_1fr] sm:items-center sm:p-6">
              <p className="font-semibold text-plum">{moment}</p>
              <div>
                <p className="text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-plum-mute">{patientLabel}</p>
                <p className="mt-1 text-sm leading-6 text-plum-soft">{patientValue}</p>
              </div>
              <div className="rounded-xl bg-[#EAF6F2] p-4">
                <p className="text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-serum">{clinicLabel}</p>
                <p className="mt-1 text-sm leading-6 text-plum">{clinicValue}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8"><ConsultationCta consultationUrl={consultationUrl} clinic={clinic} position="patient-value" /></div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl">
        <div className="text-center">
          <p className="eyebrow">The relevant VELURIA pathway</p>
          <h3 className="display mt-3 text-4xl text-plum sm:text-5xl">Lead with what the patient just explored.</h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-plum-soft">
            The matched product appears first. Other products are shown only when they are relevant to the verified clinic profile.
          </p>
        </div>
        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {orderedProducts.map((product) => <ProductCard key={product.id} product={product} primary={matchedIds.includes(product.id)} />)}
        </div>
        {profile && (
          <div className="mt-5 rounded-2xl border border-serum/12 bg-[#EAF6F2] p-5 text-sm leading-6 text-plum-soft">
            <strong className="font-semibold text-plum">Why this fits {profile.clinicName}: </strong>{profile.productFit}
          </div>
        )}
      </div>

      <div className="mx-auto mt-16 max-w-5xl rounded-[2rem] bg-[#10231F] p-6 text-white sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8ED8C7]">Real treatment proof</p>
            <h3 className="display mt-3 text-4xl">Aesthetics Central · real VELURIA case study</h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
              The synthetic samples explain the digital patient journey. This separate case study provides the real clinical proof for VELURIA skin-quality treatment.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Hydration", "Texture", "Fine lines", "Skin quality"].map((tag) => (
                <span key={tag} className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.12em] text-white/65">{tag}</span>
              ))}
            </div>
            <p className="mt-5 text-[0.62rem] leading-5 text-white/45">Real patient case study supplied for VELURIA. Individual outcomes vary.</p>
          </div>
          <BeforeAfterSlider
            before={REAL_CASE_BEFORE}
            after={REAL_CASE_AFTER}
            beforeAlt="Aesthetics Central VELURIA case study before"
            afterAlt="Aesthetics Central VELURIA case study after"
            afterLabel="After VELURIA"
          />
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-5xl"><ConsultationCta consultationUrl={consultationUrl} clinic={clinic} position="proof" /></div>

      <div className="mx-auto mt-16 max-w-5xl">
        <div className="text-center">
          <p className="eyebrow">How the funnel works</p>
          <h3 className="display mt-3 text-4xl text-plum sm:text-5xl">One connected route from click to consultation.</h3>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {funnel.map(([number, title, copy]) => (
            <article key={number} className="rounded-[1.55rem] border border-black/[0.06] bg-white/75 p-6">
              <span className="font-display text-3xl text-serum/45">{number}</span>
              <h4 className="mt-5 font-semibold text-plum">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-plum-soft">{copy}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-5xl rounded-[2rem] border border-black/[0.06] bg-white/75 p-7 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="eyebrow">What Sirona supplies</p>
            <h3 className="display mt-4 text-4xl text-plum sm:text-5xl">The clinical offer and the conversion system.</h3>
            <p className="mt-5 text-sm leading-7 text-plum-soft">
              Sirona connects professional product education with a clinic-branded patient journey and a configured route into follow-up.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["VELURIA professional range", "Concern-led product pathways for skin quality, firmness and tone."],
              ["Dr M. Sha-led training", "Professional education to support appropriate clinic delivery."],
              ["Clinic-branded AI experience", "Your clinic identity across the patient-facing journey."],
              ["Consented lead capture", "Name and contact details captured only on the live-photo route."],
              ["CRM handoff", "Enquiries routed into the clinic's agreed customer-management process."],
              ["Follow-up configuration", "A practical workflow from result view to consultation conversation."],
            ].map(([title, copy]) => (
              <article key={title} className="rounded-2xl bg-[#F6FBF9] p-5">
                <p className="font-semibold text-plum">{title}</p>
                <p className="mt-2 text-xs leading-5 text-plum-soft">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-5xl"><ConsultationCta consultationUrl={consultationUrl} clinic={clinic} position="final" /></div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button type="button" onClick={onExplore} className="btn-ghost">Explore the ROI scenario</button>
        <button type="button" onClick={onPrivateDemo} className="text-xs font-medium text-plum-mute underline underline-offset-4 transition hover:text-plum">
          Prefer to send your details first?
        </button>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-[0.62rem] leading-relaxed text-plum-mute">
        Synthetic demonstrations are illustrative and non-diagnostic. The real Aesthetics Central case study is labelled separately. Marketing support does not guarantee leads, bookings, patients or revenue.
      </p>
    </section>
  );
}
