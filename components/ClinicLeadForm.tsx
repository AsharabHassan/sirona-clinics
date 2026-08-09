"use client";

import { useState } from "react";
import type { BrandConfig } from "@/lib/brand";
import type { ClinicLeadPayload } from "@/lib/types";
import { getFbc, getFbclid, getFbp, newEventId, trackLead } from "@/lib/meta";

export default function ClinicLeadForm({
  brand,
  mode = "walkthrough",
  interest,
  previewImage,
  onBack,
  onSubmitted,
}: {
  brand: BrandConfig;
  mode?: "walkthrough" | "concern-gate";
  interest?: string;
  previewImage?: string;
  onBack?: () => void;
  onSubmitted: (lead: ClinicLeadPayload) => void;
}) {
  const [clinicName, setClinicName] = useState(
    brand.clinicName === "Your Clinic" ? "" : brand.clinicName,
  );
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [monthlyPatients, setMonthlyPatients] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const lead: ClinicLeadPayload = {
      clinicName,
      ownerName,
      email,
      phone,
      city,
      monthlyPatients: monthlyPatients ? Number(monthlyPatients) : undefined,
      interest,
      consent,
    };
    // Shared id so the browser Pixel + GHL's server (CAPI) event deduplicate.
    const eventId = newEventId();
    const meta = {
      event_id: eventId,
      event_name: "Lead",
      event_source_url:
        typeof window !== "undefined" ? window.location.href : "",
      fbp: getFbp(),
      fbc: getFbc(),
      fbclid: getFbclid(),
    };
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadType: "clinic", ...lead, meta }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      trackLead(eventId);
      onSubmitted(lead);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg animate-fade-scale">
      <div className="mb-6 text-center">
        <p className="eyebrow">
          {mode === "concern-gate" ? "Your selected patient journey" : "Private walkthrough"}
        </p>
        <h2 className="display mt-3 text-4xl text-plum sm:text-5xl">
          {mode === "concern-gate"
            ? "Unlock your clinic preview"
            : "Talk through your clinic&rsquo;s setup"}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-plum-soft">
          {mode === "concern-gate"
            ? `Enter your work details to unlock the ${interest ?? "selected"} patient journey and its clinic growth report.`
            : "Leave your details and Sirona will follow up about a focused VELURIA pipeline walkthrough for your clinic."}
        </p>
      </div>

      {mode === "concern-gate" && previewImage && (
        <div className="mx-auto mb-5 flex max-w-sm items-center gap-4 rounded-2xl border border-serum/15 bg-[#EAF6F2] p-3 text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage}
            alt="Selected synthetic concern demonstration"
            className="h-20 w-20 shrink-0 rounded-xl object-cover"
          />
          <div>
            <p className="text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-serum">
              Selected concern
            </p>
            <p className="mt-1 text-sm font-semibold text-plum">{interest}</p>
            <p className="mt-1 text-[0.62rem] leading-4 text-plum-mute">
              Synthetic AI demonstration
            </p>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="glass space-y-4 p-6 sm:p-8">
        <input
          className="field"
          placeholder="Clinic name"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          autoComplete="organization"
          required
        />
        <input
          className="field"
          placeholder="Your name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          autoComplete="name"
          required
        />
        <input
          className="field"
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          className="field"
          type="tel"
          placeholder="Phone / WhatsApp"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          required
        />
        {mode === "walkthrough" && (
          <div className="grid grid-cols-2 gap-4">
          <input
            className="field"
            placeholder="Town / city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoComplete="address-level2"
          />
          <input
            className="field"
            type="number"
            min={0}
            placeholder="Patients / month"
            aria-label="Current patients per month"
            value={monthlyPatients}
            onChange={(e) => setMonthlyPatients(e.target.value)}
          />
          </div>
        )}

        <label className="flex items-start gap-3 text-xs leading-relaxed text-plum-soft">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-plum"
            required
          />
          <span>
            I agree to Sirona Aesthetics contacting me about VELURIA and the
            clinic patient-pipeline preview. I can ask not to be contacted again
            at any time.
          </span>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-serum w-full" disabled={submitting}>
          {submitting
            ? "Saving your details…"
            : mode === "concern-gate"
              ? "Unlock the patient journey"
              : "Request my walkthrough"}
        </button>
        {mode === "concern-gate" && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="block w-full text-center text-xs text-plum-mute underline underline-offset-4 hover:text-plum"
          >
            Choose a different concern
          </button>
        )}
      </form>
    </div>
  );
}
