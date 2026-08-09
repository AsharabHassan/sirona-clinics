"use client";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { PartnerLogoStrip } from "@/components/PartnerProof";
import RoiCalculator from "@/components/RoiCalculator";
import type {
  CampaignProductId,
  ClinicProfile,
  OutreachEventName,
} from "@/lib/campaign";

interface ProductCard {
  id: CampaignProductId;
  name: string;
  category: string;
  image: string;
  accent: string;
  concerns: string;
  benefits: string;
  ingredients: string;
  route: "skin-ai" | "hair-consultation";
}

const PRODUCTS: ProductCard[] = [
  {
    id: "silk-skin",
    name: "Silk Skin",
    category: "Skin Quality Enhancer",
    image: "/assets/products/veluria-silk-skin.webp",
    accent: "#0A8FA6",
    concerns: "Texture, luminosity, firmness and elasticity",
    benefits: "Supports smoother, fresher and more radiant-looking skin.",
    ingredients: "Collagenase G&H, exosomes and PDRN",
    route: "skin-ai",
  },
  {
    id: "ultra-lift",
    name: "Ultra Lift",
    category: "Firming & Revitalising Care",
    image: "/assets/products/veluria-ultra-lift.webp",
    accent: "#D79B27",
    concerns: "Visible firmness, tone, elasticity and vitality",
    benefits: "Supports firmer, revitalised and more luminous-looking skin.",
    ingredients: "Collagenase G&H, DMAE and vitamins C & E",
    route: "skin-ai",
  },
  {
    id: "pearl-tone",
    name: "Skin Pearl Tone",
    category: "Illuminating & Tone-Perfecting Care",
    image: "/assets/products/veluria-pearl-tone.webp",
    accent: "#D78FAB",
    concerns: "Brightness, clarity and uneven-looking tone",
    benefits: "Supports a clearer, more luminous and even-looking complexion.",
    ingredients: "Collagenase G&H, glutathione and hyaluronic acid",
    route: "skin-ai",
  },
  {
    id: "hair-force-plus",
    name: "Hair Force+",
    category: "Scalp & Hair Revitalising Care",
    image: "/assets/products/veluria-hair-force.webp",
    accent: "#A11C37",
    concerns: "The appearance of hair density, strength and scalp vitality",
    benefits: "Supports a comfortable scalp and stronger, healthier-looking hair.",
    ingredients: "Collagenase G&H, hyaluronidase, recombinant VEGF and saw palmetto",
    route: "hair-consultation",
  },
];

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

const FALLBACK_FIT: Record<CampaignProductId, string> = {
  "silk-skin": "A clear skin-quality pathway for patients asking about texture, radiance, firmness and elasticity.",
  "ultra-lift": "A focused firmness and revitalisation pathway for patients concerned about tone and elasticity.",
  "pearl-tone": "A professional clarity and luminosity pathway for patients concerned about uneven-looking tone.",
  "hair-force-plus": "A distinct scalp and hair vitality pathway with its own consultation conversation.",
};

export default function ClinicLandingPage({
  clinicCopy,
  profile,
  consultationUrl,
  beginPreview,
  onTrack,
}: {
  clinicCopy: string;
  profile?: ClinicProfile;
  consultationUrl: string;
  beginPreview: () => void;
  onTrack: (event: OutreachEventName) => void;
}) {
  const clinicName = profile?.clinicName ?? clinicCopy;
  const firstSignal = profile?.signals[0];

  const scrollToFit = () => {
    onTrack("hero_fit_click");
    document.getElementById("veluria-range")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const launchSkinExperience = (productId?: CampaignProductId) => {
    if (productId) onTrack("product_interest");
    onTrack("ai_demo_start");
    beginPreview();
  };

  const trackBooking = (hair = false) => {
    if (hair) onTrack("hair_consultation_click");
    onTrack("booking_click");
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden border-b border-black/[0.06] bg-white">
        <div className="pointer-events-none absolute -right-20 -top-32 h-[34rem] w-[34rem] rounded-full bg-[#DFF3EE] blur-3xl" />
        <div className="relative mx-auto grid min-h-[680px] max-w-[1320px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-serum/15 bg-[#F4FAF8] px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-serum">
              <span className="h-1.5 w-1.5 rounded-full bg-serum" />
              Prepared for {clinicName}
            </div>
            <h1 className="display mt-7 text-[3.45rem] text-plum sm:text-7xl lg:text-[4.7rem]">
              Expand treatment capacity with VELURIA.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-plum-soft sm:text-lg sm:leading-8">
              Four professional cosmetic skin and hair pathways, combined with a
              clinic-branded patient funnel designed to create informed
              consultation opportunities for <strong className="font-semibold text-plum">{clinicName}</strong>.
            </p>
            {firstSignal && (
              <div className="mt-6 max-w-xl rounded-2xl border border-serum/12 bg-[#F6FBF9] p-4 text-sm leading-6 text-plum-soft">
                <span className="font-semibold text-plum">Why this is relevant: </span>
                {firstSignal.detail}
              </div>
            )}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={scrollToFit} className="btn-serum">
                See how VELURIA fits {clinicName} <ArrowIcon />
              </button>
              <a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackBooking()} className="btn-ghost">
                Book a free consultation
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-plum-mute">
              {["Four product pathways", "Training included", "Clinic-branded funnel"].map((item) => (
                <span key={item} className="flex items-center gap-2"><TickIcon />{item}</span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[690px]">
            <div className="overflow-hidden rounded-[2.4rem] border border-black/[0.06] bg-[#F4F4F2] shadow-[0_35px_90px_-45px_rgba(16,35,31,0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/products/veluria-family.jpg" alt="The four-product PBSerum VELURIA professional cosmetic range" className="aspect-[1.62/1] w-full object-cover" />
              <div className="grid grid-cols-3 border-t border-black/[0.06] bg-white">
                {[["4", "product pathways"], ["4", "patient courses"], ["12", "treatment sessions"]].map(([value, label]) => (
                  <div key={label} className="border-r border-black/[0.06] px-3 py-5 text-center last:border-r-0">
                    <p className="font-display text-3xl text-plum">{value}</p>
                    <p className="mt-1 text-[0.58rem] uppercase tracking-[0.12em] text-plum-mute">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnerLogoStrip />

      <section id="veluria-range" className="relative z-10 scroll-mt-24 px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="eyebrow">The complete professional range</p>
            <h2 className="display mt-4 text-4xl text-plum sm:text-6xl">Four focused solutions. One clear clinic offer.</h2>
            <p className="mt-5 max-w-2xl leading-7 text-plum-soft">
              Each VELURIA product supports a different visible skin or hair-quality conversation. Every pathway has equal prominence; the clinic decides suitability, protocol and treatment expectations.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {PRODUCTS.map((product) => (
              <article key={product.id} className="conversion-card group flex h-full flex-col overflow-hidden !p-0">
                <div className="grid min-h-52 grid-cols-[0.9fr_1.1fr] items-center gap-3 bg-[#F5F5F3] p-5 sm:p-7">
                  <div>
                    <span className="inline-block h-1 w-12 rounded-full" style={{ backgroundColor: product.accent }} />
                    <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-plum-mute">{product.category}</p>
                    <h3 className="mt-2 text-2xl font-medium text-plum">{product.name}</h3>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={`VELURIA ${product.name} product packaging`} className="mx-auto max-h-36 w-full object-contain transition duration-300 group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="text-sm font-semibold leading-6 text-plum">{product.concerns}</p>
                  <p className="mt-2 text-sm leading-6 text-plum-soft">{product.benefits}</p>
                  <p className="mt-3 text-xs leading-5 text-plum-mute"><strong className="font-semibold text-plum-soft">Key ingredients:</strong> {product.ingredients}</p>
                  <div className="mt-5 rounded-2xl bg-[#F6FBF9] p-4 text-sm leading-6 text-plum-soft">
                    <span className="font-semibold text-serum">For {clinicName}: </span>
                    {profile?.productFitNotes[product.id] ?? FALLBACK_FIT[product.id]}
                  </div>
                  <div className="mt-auto pt-5">
                    {product.route === "skin-ai" ? (
                      <button type="button" onClick={() => launchSkinExperience(product.id)} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-serum hover:text-[#07594b]">
                        Explore the patient experience <ArrowIcon />
                      </button>
                    ) : (
                      <a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={() => { onTrack("product_interest"); trackBooking(true); }} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-serum hover:text-[#07594b]">
                        Discuss the hair pathway <ArrowIcon />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-[0.68rem] leading-6 text-plum-mute">
            VELURIA is a professional cosmetic range. Product selection, contraindication screening, consent, protocol and treatment suitability remain the responsibility of the treating clinic. Individual outcomes vary.
          </p>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden bg-[#10231F] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8ED8C7]">A practical clinic capacity model</p>
            <h2 className="display mt-5 text-4xl sm:text-6xl">Grow the service, not only the doctor&rsquo;s diary.</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/68">
              {profile?.teamCapacityOpportunity ?? "VELURIA can support a repeatable professional service delivered by appropriately trained and competent clinic team members, within the clinic's scope, insurance, consent process and treatment protocols."}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[["4", "three-session patient courses"], ["12", "treatment appointments"], ["1", "clinic launch plan"]].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                  <p className="font-display text-4xl text-[#8ED8C7]">{value}</p>
                  <p className="mt-2 text-xs leading-5 text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/partners/dr-m-sha-trainer.jpg" alt="Dr M. Sha, VELURIA trainer" className="aspect-[16/9] w-full object-cover object-[50%_25%]" />
            <div className="p-6 sm:p-8">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8ED8C7]">VELURIA training</p>
              <h3 className="mt-3 text-2xl font-medium">Launch with practitioner confidence.</h3>
              <p className="mt-3 text-sm leading-7 text-white/62">Dr M. Sha-led education supports product understanding, responsible patient communication and practical protocol implementation.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="relative z-10 bg-white px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p className="eyebrow">The patient-acquisition funnel</p>
              <h2 className="display mt-4 text-4xl text-plum sm:text-6xl">From patient curiosity to a clinic conversation.</h2>
              <p className="mt-5 leading-7 text-plum-soft">
                {profile?.serviceMenuBridge ?? "The product story and the digital journey work together: patients explore a concern, understand the relevant pathway and have a clear next step with the clinic."}
              </p>
              <button type="button" onClick={() => launchSkinExperience()} className="btn-serum mt-8">Experience the patient funnel <ArrowIcon /></button>
              <p className="mt-3 text-xs leading-5 text-plum-mute">Choose a concern first. Contact details and consent are captured before the complete AI result is revealed.</p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {[
                ["01", "Campaign click", "A relevant concern earns attention."],
                ["02", "Interactive experience", "The patient selects a concern or supplies a photo."],
                ["03", "Consented lead capture", "Contact details enter the clinic follow-up route."],
                ["04", "Personalised result", "The patient sees an illustrative visual and VELURIA pathway."],
                ["05", "Clinic consultation", "A clear booking action hands interest to the clinic."],
                ["06", "CRM follow-up", "The clinic can continue the conversation with context."],
              ].map(([number, title, copy]) => (
                <li key={number} className="rounded-2xl border border-black/[0.06] bg-[#F8FAF9] p-5">
                  <span className="font-display text-2xl text-serum/45">{number}</span>
                  <h3 className="mt-3 font-semibold text-plum">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-plum-soft">{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-black/[0.06] bg-[#F3F7F5] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <RoiCalculator consultationUrl={consultationUrl} clinicName={clinicName} embedded onAdjust={() => onTrack("calculator_adjust")} />
        </div>
      </section>

      <section className="relative z-10 px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="landing-preview-shell overflow-hidden p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4 px-2">
              <div>
                <p className="text-[0.56rem] uppercase tracking-[0.18em] text-white/55">Real treatment proof</p>
                <p className="mt-1 text-base font-semibold text-white">VELURIA case study</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.14em] text-white/75">Aesthetics Central</span>
            </div>
            <BeforeAfterSlider before="/assets/case-studies/facial-rejuvenation-before.webp" after="/assets/case-studies/facial-rejuvenation-after.webp" beforeAlt="Before the VELURIA course" afterAlt="After the VELURIA course" afterLabel="After VELURIA" />
          </div>
          <div>
            <p className="eyebrow">Real proof, clearly separated from AI</p>
            <h2 className="display mt-4 text-4xl text-plum sm:text-6xl">Show the product. Let patients explore the possibility.</h2>
            <p className="mt-5 leading-7 text-plum-soft">The Aesthetics Central result is presented as a real VELURIA case study. Synthetic AI demonstrations are always labelled and used only to explain the patient journey, never as clinical evidence.</p>
            <p className="mt-4 text-xs leading-6 text-plum-mute">Individual results vary. Images do not predict suitability or outcome for another patient.</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-[#0B2747] px-5 py-20 text-white sm:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#83D5C5]">Free 20-minute online consultation</p>
          <h2 className="display mt-5 text-5xl sm:text-7xl">Build {clinicName}&rsquo;s VELURIA Growth Map.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/68">{profile?.consultationRationale ?? "Review the complete range, training, clinic fit, starter treatment capacity and the patient-acquisition funnel with Sirona."}</p>
          <a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackBooking()} className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-9 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#0B2747] transition hover:-translate-y-0.5 hover:bg-[#EAF6F2]">
            Book my free Clinic Growth Map <ArrowIcon />
          </a>
          <p className="mt-4 text-xs text-white/45">Personalised · Online · No obligation</p>
        </div>
      </section>
    </>
  );
}
