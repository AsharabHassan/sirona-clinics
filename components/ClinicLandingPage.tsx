"use client";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { PartnerLogoStrip } from "@/components/PartnerProof";
import type { CampaignProductId, ClinicProfile, OutreachEventName } from "@/lib/campaign";

const PRODUCTS: Array<{
  id: CampaignProductId;
  name: string;
  purpose: string;
  image: string;
  ingredients: string;
}> = [
  { id: "silk-skin", name: "Silk Skin", purpose: "Texture, luminosity, firmness and elasticity", image: "/assets/products/veluria-silk-skin.webp", ingredients: "Collagenase G&H, exosomes and PDRN" },
  { id: "ultra-lift", name: "Ultra Lift", purpose: "Visible firmness, tone, elasticity and vitality", image: "/assets/products/veluria-ultra-lift.webp", ingredients: "Collagenase G&H, DMAE and vitamins C & E" },
  { id: "pearl-tone", name: "Skin Pearl Tone", purpose: "Brightness, clarity and uneven-looking tone", image: "/assets/products/veluria-pearl-tone.webp", ingredients: "Collagenase G&H, glutathione and hyaluronic acid" },
  { id: "hair-force-plus", name: "Hair Force+", purpose: "The appearance of hair density, strength and scalp vitality", image: "/assets/products/veluria-hair-force.webp", ingredients: "Collagenase G&H, hyaluronidase, recombinant VEGF and saw palmetto" },
];

function ArrowIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function TickIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0"><circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" /><path d="m4.8 8.1 2.05 2.05 4.35-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

const BOOKING_LABEL = "Book a free 20-minute VELURIA Clinic Growth Map";

export default function ClinicLandingPage({ clinicCopy, profile, consultationUrl, beginPreview, onTrack }: {
  clinicCopy: string;
  profile?: ClinicProfile;
  consultationUrl: string;
  beginPreview: () => void;
  onTrack: (event: OutreachEventName) => void;
}) {
  const clinicName = profile?.clinicName ?? clinicCopy;
  const launch = () => {
    onTrack("ai_demo_start");
    beginPreview();
  };
  const book = () => onTrack("booking_click");

  return (
    <>
      <section className="relative z-10 overflow-hidden border-b border-black/[0.06] bg-white">
        <div className="pointer-events-none absolute -right-20 -top-32 h-[34rem] w-[34rem] rounded-full bg-[#DFF3EE] blur-3xl" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-14 sm:px-8 lg:min-h-[630px] lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow">Prepared for {clinicName}</p>
            <h1 className="display mt-5 text-[3.25rem] text-plum sm:text-7xl lg:text-[4.5rem]">A four-product VELURIA range, with a patient funnel to help launch it.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-plum-soft sm:text-lg sm:leading-8">
              PBSerum VELURIA is a four-product professional cosmetic range for skin-quality and scalp/hair pathways. Sirona pairs the range with training and a clinic-branded application designed to create informed consultation opportunities.
            </p>
            {profile?.signals[0] && <p className="mt-5 max-w-xl rounded-2xl border border-serum/12 bg-[#F6FBF9] p-4 text-sm leading-6 text-plum-soft"><strong className="text-plum">Why it may fit {clinicName}: </strong>{profile.signals[0].detail}</p>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => document.getElementById("veluria-range")?.scrollIntoView({ behavior: "smooth" })} className="btn-serum">See the product range <ArrowIcon /></button>
              <a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={book} className="btn-ghost">{BOOKING_LABEL}</a>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2.4rem] border border-black/[0.06] bg-[#F4F4F2] shadow-[0_35px_90px_-45px_rgba(16,35,31,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/products/veluria-family.jpg" alt="The four-product PBSerum VELURIA professional cosmetic range" className="aspect-[1.62/1] w-full object-cover" />
            <div className="grid grid-cols-3 border-t border-black/[0.06] bg-white">
              {[["4", "product pathways"], ["4", "starter courses"], ["12", "starter sessions"]].map(([value, label]) => <div key={label} className="border-r border-black/[0.06] px-3 py-5 text-center last:border-0"><p className="font-display text-3xl text-plum">{value}</p><p className="mt-1 text-[0.58rem] uppercase tracking-[0.12em] text-plum-mute">{label}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <PartnerLogoStrip />

      <section id="veluria-range" className="relative z-10 scroll-mt-24 px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl"><p className="eyebrow">The VELURIA range</p><h2 className="display mt-4 text-4xl text-plum sm:text-6xl">Four clear treatment conversations.</h2><p className="mt-4 leading-7 text-plum-soft">Each pathway gives the clinic a focused way to discuss visible skin quality or scalp and hair vitality. The treating clinic confirms suitability, protocol and expectations.</p></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <article key={product.id} className="conversion-card flex h-full flex-col !p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={`VELURIA ${product.name}`} className="mx-auto h-32 w-full object-contain" />
                <h3 className="mt-4 text-xl font-semibold text-plum">{product.name}</h3>
                <p className="mt-2 text-sm leading-6 text-plum-soft">{product.purpose}</p>
                <p className="mt-3 text-[0.68rem] leading-5 text-plum-mute">{product.ingredients}</p>
                {profile?.productFitNotes[product.id] && <p className="mt-4 border-t border-black/[0.06] pt-4 text-xs leading-5 text-serum"><strong>For {clinicName}: </strong>{profile.productFitNotes[product.id]}</p>}
              </article>
            ))}
          </div>
          <p className="mt-5 text-[0.68rem] leading-6 text-plum-mute">Professional cosmetic range. Product selection, contraindication screening, consent and treatment suitability remain with the treating clinic. Individual outcomes vary.</p>
        </div>
      </section>

      <section className="relative z-10 bg-[#10231F] px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8ED8C7]">A simple starter launch</p>
            <h2 className="display mt-4 text-4xl sm:text-6xl">Product, training and a first clinic offer.</h2>
            <p className="mt-5 max-w-2xl leading-7 text-white/68">The starter scenario models four three-session courses. At an illustrative clinic fee of £299 per session, that is 12 appointments and £3,588 gross treatment revenue.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[["4", "patient courses"], ["12", "treatment sessions"], ["£3,588", "illustrative gross"]].map(([value, label]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"><p className="font-display text-4xl text-[#8ED8C7]">{value}</p><p className="mt-2 text-xs text-white/55">{label}</p></div>)}
            </div>
            <p className="mt-4 text-[0.66rem] leading-5 text-white/45">Illustrative scenario only, not a forecast or guarantee. It excludes product and delivery costs, marketing spend, tax, overhead and unused capacity.</p>
          </div>
          <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/partners/dr-m-sha-trainer.jpg" alt="Dr M. Sha, VELURIA trainer" className="aspect-[16/9] w-full object-cover object-[50%_25%]" />
            <div className="p-6"><p className="text-[0.62rem] uppercase tracking-[0.18em] text-[#8ED8C7]">Dr M. Sha-led training</p><p className="mt-3 text-xl font-semibold">Launch with practitioner confidence.</p><p className="mt-3 text-sm leading-6 text-white/60">Education supports product understanding, responsible patient communication and practical implementation.</p></div>
          </article>
        </div>
      </section>

      <section className="relative z-10 px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-9 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="landing-preview-shell overflow-hidden p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4 px-2 text-white"><div><p className="text-[0.56rem] uppercase tracking-[0.18em] text-white/55">VELURIA clinic case study</p><p className="mt-1 font-semibold">Aesthetics Central</p></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.14em] text-white/75">Documented result</span></div>
            <BeforeAfterSlider before="/assets/case-studies/facial-rejuvenation-before.webp" after="/assets/case-studies/facial-rejuvenation-after.webp" beforeAlt="Before the VELURIA course" afterAlt="After the VELURIA course" afterLabel="After VELURIA" />
          </div>
          <div><p className="eyebrow">The funnel that supports the launch</p><h2 className="display mt-4 text-4xl text-plum sm:text-6xl">Let patients understand the idea before they book.</h2><p className="mt-5 leading-7 text-plum-soft">The clinic-branded application lets people explore a concern or use their own photo, see an illustrative AI skin-quality experience, understand the relevant VELURIA pathway and continue towards a consultation.</p><button type="button" onClick={launch} className="btn-serum mt-7">Try the clinic application <ArrowIcon /></button><p className="mt-3 text-xs leading-5 text-plum-mute">Synthetic demonstrations are clearly labelled and are not clinical evidence. Individual results vary.</p></div>
        </div>
      </section>

      <section className="relative z-10 bg-[#0B2747] px-5 py-16 text-white sm:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl text-center"><p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#83D5C5]">A focused first conversation</p><h2 className="display mt-4 text-5xl sm:text-7xl">Map the VELURIA opportunity for {clinicName}.</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-white/65">Review product fit, training, starter capacity and the clinic-branded patient funnel with Sirona.</p><a href={consultationUrl} target="_blank" rel="noopener noreferrer" onClick={book} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#0B2747]">{BOOKING_LABEL} <ArrowIcon /></a></div>
      </section>
    </>
  );
}
