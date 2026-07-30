"use client";

import { useState } from "react";
import type { BrandConfig } from "@/lib/brand";
import type { ClinicLeadPayload } from "@/lib/types";
import { getFbc, getFbclid, getFbp, newEventId, trackLead } from "@/lib/meta";

export default function ClinicLeadForm({
  brand,
  onSubmitted,
}: {
  brand: BrandConfig;
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
        body: JSON.stringify({ ...lead, meta }),
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
        <p className="eyebrow">Private walkthrough</p>
        <h2 className="display mt-3 text-4xl text-plum sm:text-5xl">
          Talk through your clinic&rsquo;s setup
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-plum-soft">
          Leave your details and Sirona will follow up about a focused VELURIA
          pipeline walkthrough for your clinic.
        </p>
      </div>

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
          {submitting ? "Sending…" : "Request my walkthrough"}
        </button>
      </form>
    </div>
  );
}
