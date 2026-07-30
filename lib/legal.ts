/**
 * Canonical consent + disclaimer copy, shared across the app UI and the PDF so
 * the wording is identical everywhere and only ever changes in one place.
 */

/** Shown as a required checkbox BEFORE the camera/upload opens (step 01). */
export const PHOTO_CONSENT =
  "I understand this is a cosmetic, non-diagnostic AI visualisation — not medical advice, a diagnosis or a treatment prediction — and I consent to my photo being sent to Sirona's AI processing services solely to generate this preview. I confirm that this is my photo or I have permission to use it.";

/** One-line disclaimer for compact / footer placements. */
export const DISCLAIMER_SHORT =
  "Cosmetic, non-diagnostic AI visualisation of visible skin appearance only. Not medical advice, a diagnosis or a treatment prediction.";

/** Full disclaimer for the prominent notices on the result page and the PDF. */
export const DISCLAIMER_FULL =
  "This is a cosmetic, non-diagnostic AI visualisation of visible skin appearance only. It is not medical advice, a diagnosis or a prediction of treatment results. Images are illustrative and individual outcomes vary. A qualified clinician must assess suitability and discuss realistic expectations before any treatment.";
