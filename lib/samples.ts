/**
 * Pre-baked demo samples. These render the "wow" before/after INSTANTLY with
 * zero per-visitor AI cost — critical when the traffic is paid Meta clicks that
 * may bounce. Each sample is a licensed face plus a Veluria before/after and a
 * canned, guardrail-safe result card (skin-booster-scope only).
 *
 * Add more samples by running `scripts/gen-samples.ts` (needs OPENAI/ANTHROPIC
 * keys) and dropping the outputs into `public/samples/`, then extend SAMPLES.
 */

export interface SampleMetric {
  label: string;
  /** Relative emphasis used to order the visual focus bars. */
  score: number;
}

export interface DemoSample {
  id: string;
  /** Short label for the switcher, e.g. "Fine lines & texture". */
  label: string;
  beforeSrc: string;
  afterSrc: string;
  /** Optional annotated treatment map. */
  mapSrc?: string;
  summary: string;
  metrics: SampleMetric[];
  veluriaNote: string;
}

export const SAMPLES: DemoSample[] = [
  {
    id: "facial-rejuvenation",
    label: "Hydration, texture & fine lines",
    beforeSrc: "/assets/case-studies/facial-rejuvenation-before.webp",
    afterSrc: "/assets/case-studies/facial-rejuvenation-after.webp",
    mapSrc: "/assets/face-map-premium.webp",
    summary:
      "A real VELURIA result from Aesthetics Central, showing the kind of visible skin-quality conversation the clinic can then explore with a patient.",
    metrics: [
      { label: "Hydration & glow", score: 82 },
      { label: "Texture & pores", score: 74 },
      { label: "Fine surface lines", score: 66 },
      { label: "Firmness (appearance)", score: 58 },
    ],
    veluriaNote:
      "This case study establishes the real treatment story. The live AI experience then helps a new patient explore their own visible concerns before suitability, product choice and realistic outcomes are assessed in clinic.",
  },
];

export function sampleById(id: string): DemoSample {
  return SAMPLES.find((s) => s.id === id) ?? SAMPLES[0];
}
