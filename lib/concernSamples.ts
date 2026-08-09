import type {
  ConcernSampleId,
  PatientJourneySnapshot,
  SkinAnalysis,
} from "./types";
import { VELURIA_PRODUCTS, type VeluriaProductId } from "./veluria";

export const SYNTHETIC_DEMO_DISCLOSURE =
  "Synthetic AI demonstration created to illustrate the patient journey. This is not a real patient or clinical case study. Individual treatment outcomes vary.";

export interface ConcernSample {
  id: ConcernSampleId;
  label: string;
  description: string;
  productId: VeluriaProductId;
  before: string;
  after: string;
  analysis: SkinAnalysis;
}

const disclaimer =
  "This cosmetic AI demonstration is illustrative and non-diagnostic. A qualified clinician must assess suitability, treatment choice and realistic outcomes. Individual results vary.";

export const CONCERN_SAMPLES: ConcernSample[] = [
  {
    id: "hydration",
    label: "Hydration and dullness",
    description: "Explore how a patient could understand hydration, luminosity and surface suppleness.",
    productId: "silk-skin",
    before: "/assets/concern-samples/hydration-before.webp",
    after: "/assets/concern-samples/hydration-after.webp",
    analysis: {
      summary:
        "The skin appears mildly dehydrated and light reflection is uneven through the central cheeks. Texture remains natural, with room to support a fresher, more luminous appearance.",
      categories: [
        { label: "Hydration", score: 54, note: "Mild surface dehydration is most visible across the cheeks." },
        { label: "Radiance", score: 57, note: "Light reflection looks a little flat rather than naturally luminous." },
        { label: "Texture & pores", score: 68, note: "Texture is generally even, with subtle surface roughness." },
        { label: "Fine lines", score: 72, note: "Only light dehydration-related surface lines are visible." },
      ],
      annotations: [
        {
          x: 35,
          y: 56,
          area: "Cheeks",
          concern: "dehydrated, dull-looking surface",
          treatment: "Discuss VELURIA Silk Skin for visible hydration, smoothness and radiance.",
          scope: "veluria",
          severity: "moderate",
        },
        {
          x: 54,
          y: 38,
          area: "Central face",
          concern: "uneven light reflection and mild surface dryness",
          treatment: "Support skin quality while preserving natural texture and identity.",
          scope: "veluria",
          severity: "low",
        },
      ],
      preserve: ["Natural pores, freckles and facial structure remain unchanged."],
      veluriaRecommendation:
        "VELURIA Silk Skin is the relevant pathway because the visible opportunity is hydration, surface smoothness and radiance rather than facial reshaping.",
      disclaimer,
    },
  },
  {
    id: "texture",
    label: "Texture and visible pores",
    description: "See the patient story for roughness, refinement and enlarged-looking pores.",
    productId: "silk-skin",
    before: "/assets/concern-samples/texture-before.webp",
    after: "/assets/concern-samples/texture-after.webp",
    analysis: {
      summary:
        "Visible pores and mild unevenness are concentrated around the nose and inner cheeks. The demonstration focuses on refinement while keeping real skin texture visible.",
      categories: [
        { label: "Texture & pores", score: 49, note: "Pores look more visible through the nose and inner cheek area." },
        { label: "Hydration", score: 63, note: "Hydration appears fair with some surface dryness." },
        { label: "Radiance", score: 61, note: "Uneven texture slightly interrupts reflected light." },
        { label: "Tone & redness", score: 74, note: "Tone appears broadly even." },
      ],
      annotations: [
        {
          x: 44,
          y: 53,
          area: "Inner cheeks and nose",
          concern: "uneven texture and enlarged-looking pores",
          treatment: "Discuss VELURIA Silk Skin for a smoother, more refined-looking surface.",
          scope: "veluria",
          severity: "moderate",
        },
        {
          x: 67,
          y: 58,
          area: "Outer cheek",
          concern: "mild surface roughness",
          treatment: "Support hydration and visible skin quality without erasing natural pores.",
          scope: "veluria",
          severity: "low",
        },
      ],
      preserve: ["Natural pores, facial hair and facial structure remain unchanged."],
      veluriaRecommendation:
        "VELURIA Silk Skin matches this texture-led conversation, with the aim of improving visible refinement, hydration and luminosity while retaining realistic skin detail.",
      disclaimer,
    },
  },
  {
    id: "post-acne",
    label: "Mild post-acne marks",
    description: "Explore a cautious skin-quality pathway for superficial marks and uneven texture.",
    productId: "silk-skin",
    before: "/assets/concern-samples/post-acne-before.webp",
    after: "/assets/concern-samples/post-acne-after.webp",
    analysis: {
      summary:
        "The cheeks show mild post-acne colour marks and superficial texture variation. There is no claim to treat active acne or deep scarring in this demonstration.",
      categories: [
        { label: "Texture & pores", score: 48, note: "Mild superficial unevenness is visible across both cheeks." },
        { label: "Tone & redness", score: 55, note: "Small residual colour marks make the cheek tone look less uniform." },
        { label: "Hydration", score: 66, note: "Hydration appears moderate." },
        { label: "Radiance", score: 58, note: "Uneven surface reflection softens overall luminosity." },
      ],
      annotations: [
        {
          x: 32,
          y: 59,
          area: "Left cheek",
          concern: "mild post-acne marks and uneven surface texture",
          treatment: "Discuss VELURIA Silk Skin for visible skin-quality support.",
          scope: "veluria",
          severity: "moderate",
        },
        {
          x: 68,
          y: 60,
          area: "Right cheek",
          concern: "superficial post-acne unevenness",
          treatment: "Set expectations around softening rather than erasing marks.",
          scope: "veluria",
          severity: "moderate",
        },
      ],
      preserve: ["Natural skin detail remains visible; active acne and deep scarring require separate clinical assessment."],
      veluriaRecommendation:
        "VELURIA Silk Skin is the relevant pathway for mild superficial post-acne marks, texture and radiance. Deep scars and active acne remain outside this cosmetic preview.",
      disclaimer,
    },
  },
  {
    id: "fine-lines",
    label: "Forehead and crow's-feet lines",
    description: "See how firmness and elasticity can be explained without changing facial identity.",
    productId: "ultra-lift",
    before: "/assets/concern-samples/fine-lines-before.webp",
    after: "/assets/concern-samples/fine-lines-after.webp",
    analysis: {
      summary:
        "Visible forehead and outer-eye lines are paired with a mild loss of surface elasticity. The preview keeps normal expression lines present while illustrating a firmer, more rested appearance.",
      categories: [
        { label: "Fine lines", score: 43, note: "Forehead and crow's-feet lines are visibly established." },
        { label: "Firmness & elasticity", score: 52, note: "Skin elasticity appears mildly reduced." },
        { label: "Hydration", score: 62, note: "Hydration is moderate and can affect line visibility." },
        { label: "Radiance", score: 67, note: "Luminosity is broadly maintained." },
      ],
      annotations: [
        {
          x: 50,
          y: 25,
          area: "Forehead lines",
          concern: "visible forehead lines with reduced surface elasticity",
          treatment: "Discuss VELURIA Ultra Lift for the appearance of firmness and elasticity.",
          scope: "veluria",
          severity: "moderate",
        },
        {
          x: 73,
          y: 42,
          area: "Crow's-feet",
          concern: "visible periorbital lines",
          treatment: "Explore realistic softening while preserving natural expression.",
          scope: "veluria",
          severity: "moderate",
        },
      ],
      preserve: ["Natural expression, facial volume, eye shape and bone structure remain unchanged."],
      veluriaRecommendation:
        "VELURIA Ultra Lift is matched to this firmness-and-elasticity conversation. The aim is a softer, firmer-looking skin surface, not removal of expression or structural lifting.",
      disclaimer,
    },
  },
  {
    id: "firmness",
    label: "Jawline firmness and mild laxity",
    description: "Explore an elasticity-led consultation while keeping face shape unchanged.",
    productId: "ultra-lift",
    before: "/assets/concern-samples/firmness-before.webp",
    after: "/assets/concern-samples/firmness-after.webp",
    analysis: {
      summary:
        "The lower cheeks and jaw transition show a mild reduction in visible firmness. The demonstration illustrates skin-quality support only and does not simulate surgery, volume replacement or facial reshaping.",
      categories: [
        { label: "Firmness & elasticity", score: 46, note: "Mild laxity softens the lower-face transition." },
        { label: "Fine lines", score: 59, note: "Fine surface lines are present but are not the primary concern." },
        { label: "Hydration", score: 64, note: "Hydration appears moderate." },
        { label: "Texture & pores", score: 69, note: "Texture is generally even." },
      ],
      annotations: [
        {
          x: 34,
          y: 72,
          area: "Lower cheek and jawline",
          concern: "mild skin laxity and reduced firmness",
          treatment: "Discuss VELURIA Ultra Lift for visible firmness and elasticity.",
          scope: "veluria",
          severity: "moderate",
        },
        {
          x: 66,
          y: 71,
          area: "Jaw transition",
          concern: "softened skin definition without structural volume loss",
          treatment: "Illustrate skin tightening only, with facial shape preserved.",
          scope: "veluria",
          severity: "moderate",
        },
      ],
      preserve: ["Jaw shape, facial volume, bone structure and identity remain unchanged."],
      veluriaRecommendation:
        "VELURIA Ultra Lift is the relevant pathway for visible firmness and elasticity. A clinician determines whether the concern is skin quality or requires a different structural treatment.",
      disclaimer,
    },
  },
  {
    id: "tone",
    label: "Uneven tone and sun spots",
    description: "See a restrained brightening pathway for mild, discrete superficial colour variation.",
    productId: "pearl-tone",
    before: "/assets/concern-samples/tone-before.webp",
    after: "/assets/concern-samples/tone-after.webp",
    analysis: {
      summary:
        "Mild uneven tone and a few discrete superficial-looking sun spots are visible across the upper cheeks and temples. Natural skin colour, freckles and significant pigment remain preserved.",
      categories: [
        { label: "Tone & redness", score: 47, note: "Small areas of colour variation make tone look less uniform." },
        { label: "Radiance", score: 56, note: "Uneven tone slightly reduces the impression of luminosity." },
        { label: "Hydration", score: 66, note: "Hydration appears moderate." },
        { label: "Texture & pores", score: 72, note: "Texture is broadly even." },
      ],
      annotations: [
        {
          x: 31,
          y: 48,
          area: "Upper cheek and temple",
          concern: "mild uneven tone and discrete sun spots",
          treatment: "Discuss VELURIA Pearl Tone for a clearer, more uniform-looking complexion.",
          scope: "veluria",
          severity: "moderate",
        },
        {
          x: 68,
          y: 50,
          area: "Upper cheek",
          concern: "small superficial-looking areas of colour variation",
          treatment: "Set expectations around modest softening, never whitening or erasure.",
          scope: "veluria",
          severity: "low",
        },
      ],
      preserve: ["Natural skin colour, freckles and significant or high-contrast pigmentation remain unchanged."],
      veluriaRecommendation:
        "VELURIA Pearl Tone is matched to this mild tone-led conversation. The goal is a clearer, more even-looking surface at the same natural skin colour, not bleaching or pigment removal.",
      disclaimer,
    },
  },
];

export function snapshotForConcern(sample: ConcernSample): PatientJourneySnapshot {
  return {
    source: "sample",
    concernId: sample.id,
    concernLabel: sample.label,
    before: sample.before,
    after: sample.after,
    mapImage: null,
    analysis: sample.analysis,
    matchedProductIds: [VELURIA_PRODUCTS[sample.productId].id],
    previewStatus: "ready",
    disclosure: SYNTHETIC_DEMO_DISCLOSURE,
  };
}
