/**
 * The clinic owner's own brand, captured at runtime (step "brand") and applied
 * ONLY to the demo preview frame — so they see the AI skin-scan "stamped" with
 * their clinic. This is NOT a per-clinic re-theme of the app; it is transient
 * state that lives for the length of one visit.
 */
export interface BrandConfig {
  clinicName: string;
  /** Optional logo as a data URL (uploaded in-browser, never sent anywhere). */
  logoDataUrl?: string;
  /** Optional accent colour (hex) used on the preview frame. */
  accent: string;
}

/** Sirona's own accent — the default the preview falls back to. */
export const DEFAULT_ACCENT = "#0E8C77";

/** A small, tasteful palette owners can pick from without a colour picker. */
export const ACCENT_SWATCHES: { label: string; value: string }[] = [
  { label: "Emerald", value: "#0E8C77" },
  { label: "Ink", value: "#1E2A44" },
  { label: "Plum", value: "#5B2A4E" },
  { label: "Gold", value: "#9A7B1F" },
  { label: "Rose", value: "#B14A64" },
  { label: "Teal", value: "#0F6E8C" },
];

export function makeBrand(partial: Partial<BrandConfig> = {}): BrandConfig {
  return {
    clinicName: partial.clinicName?.trim() || "Your Clinic",
    logoDataUrl: partial.logoDataUrl,
    accent: partial.accent || DEFAULT_ACCENT,
  };
}

/** Readable initials for a logo fallback chip (e.g. "O.D. Aesthetics" → "OA"). */
export function brandInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "YC";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
