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
  /** Baseline skin-quality score out of 100 (higher = healthier). */
  score: number;
  /** Illustrative improvement after a Veluria course (percentage points). */
  uplift: number;
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
      "Skin quality is the opportunity here — dehydration, uneven texture and fine surface lines. All squarely within what a Veluria course improves.",
    metrics: [
      { label: "Hydration & glow", score: 58, uplift: 22 },
      { label: "Texture & pores", score: 62, uplift: 18 },
      { label: "Fine surface lines", score: 66, uplift: 15 },
      { label: "Firmness (appearance)", score: 64, uplift: 12 },
    ],
    veluriaNote:
      "A course of Veluria targets hydration, surface texture and fine lines — the visible skin-quality wins shown above. Anything beyond a skin booster's scope is flagged for an in-clinic consultation.",
  },
];

export function sampleById(id: string): DemoSample {
  return SAMPLES.find((s) => s.id === id) ?? SAMPLES[0];
}
