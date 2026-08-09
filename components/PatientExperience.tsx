"use client";

import { useEffect, useRef, useState } from "react";
import AnalysisReport from "@/components/AnalysisReport";
import ConcernSamplePicker from "@/components/ConcernSamplePicker";
import LeadForm from "@/components/LeadForm";
import Processing from "@/components/Processing";
import SelfieCapture from "@/components/SelfieCapture";
import { analyseSkinPhoto, createAfterPreview } from "@/lib/afterPreview";
import { brandInitials, type BrandConfig } from "@/lib/brand";
import type { CampaignStage } from "@/lib/campaign";
import {
  snapshotForConcern,
  type ConcernSample,
} from "@/lib/concernSamples";
import type { GhlMeta } from "@/lib/ghl";
import { trackDemo } from "@/lib/meta";
import { trackOutreachEvent } from "@/lib/outreachClient";
import type {
  LeadPayload,
  PatientJourneySnapshot,
  SkinAnalysis,
} from "@/lib/types";
import { planFor } from "@/lib/veluria";

type PatientStep =
  | "choose"
  | "capture"
  | "sample-lead"
  | "lead"
  | "processing"
  | "result"
  | "error";

function BrandedHeader({ brand, clinicPreview }: { brand: BrandConfig; clinicPreview: boolean }) {
  return (
    <div
      className="mx-auto mb-8 flex max-w-3xl items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-sm"
      style={{ background: brand.accent }}
    >
      {brand.logoDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={brand.logoDataUrl} alt="" className="h-10 w-10 rounded-xl bg-white/95 object-contain p-1" />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-xs font-bold text-plum">
          {brandInitials(brand.clinicName)}
        </span>
      )}
      <div>
        <p className="font-semibold">{brand.clinicName}</p>
        <p className="text-[0.58rem] uppercase tracking-[0.16em] text-white/70">
          Illustrative AI skin-quality experience
        </p>
      </div>
      <span className="ml-auto hidden rounded-full bg-white/10 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.14em] text-white/75 sm:block">
        {clinicPreview ? "Clinic preview" : "Patient view"}
      </span>
    </div>
  );
}

export default function PatientExperience({
  brand,
  consultationUrl,
  onEditBrand,
  onContinue,
  audienceMode = "patient",
  recipientToken,
  campaignStage = "demo",
}: {
  brand: BrandConfig;
  consultationUrl: string;
  onEditBrand: () => void;
  onContinue: (snapshot: PatientJourneySnapshot) => void;
  audienceMode?: "patient" | "clinic-preview";
  recipientToken?: string;
  campaignStage?: CampaignStage;
}) {
  const [step, setStep] = useState<PatientStep>("choose");
  const [selfie, setSelfie] = useState<string | null>(null);
  const [lead, setLead] = useState<LeadPayload | null>(null);
  const [leadMeta, setLeadMeta] = useState<GhlMeta | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [afterPending, setAfterPending] = useState(false);
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [mapPending, setMapPending] = useState(false);
  const [selectedSample, setSelectedSample] = useState<ConcernSample | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const analysisPromise = useRef<Promise<SkinAnalysis> | null>(null);
  const previewPromise = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    trackDemo();
  }, []);

  const startPipeline = (image: string) => {
    trackOutreachEvent(recipientToken, "ai_start", campaignStage);
    const request = analyseSkinPhoto(image);
    request.catch(() => {});
    analysisPromise.current = request;
    previewPromise.current = request
      .then((result) => createAfterPreview(image, result))
      .catch(() => null);
  };

  const reset = () => {
    analysisPromise.current = null;
    previewPromise.current = null;
    setSelfie(null);
    setLead(null);
    setLeadMeta(null);
    setAnalysis(null);
    setAfterImage(null);
    setAfterPending(false);
    setMapImage(null);
    setMapPending(false);
    setSelectedSample(null);
    setErrorMsg("");
    setStep("choose");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectSample = (sample: ConcernSample) => {
    setSelectedSample(sample);
    trackOutreachEvent(recipientToken, "concern_sample_select", campaignStage);
    if (audienceMode === "clinic-preview") {
      revealSample(sample);
      return;
    }
    setStep("sample-lead");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const revealSample = (sample: ConcernSample) => {
    setSelfie(sample.before);
    setAfterImage(sample.after);
    setAnalysis(sample.analysis);
    setMapImage(null);
    setAfterPending(false);
    setMapPending(false);
    setStep("result");
    trackOutreachEvent(recipientToken, "patient_result_view", campaignStage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const runAnalysis = async (
    image: string,
    submittedLead?: LeadPayload,
    submittedMeta?: GhlMeta,
  ) => {
    setStep("processing");
    setAfterImage(null);
    setMapImage(null);
    setAfterPending(true);
    setMapPending(true);

    let result: SkinAnalysis;
    try {
      result = await (analysisPromise.current ?? analyseSkinPhoto(image));
      setAnalysis(result);
      setStep("result");
      trackOutreachEvent(recipientToken, "ai_complete", campaignStage);
      trackOutreachEvent(recipientToken, "patient_result_view", campaignStage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "We couldn't complete the skin analysis.");
      setAfterPending(false);
      setMapPending(false);
      setStep("error");
      return;
    }

    if (submittedLead && submittedMeta) {
      fetch("/api/lead/concerns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...submittedLead, analysis: result, meta: submittedMeta }),
      }).catch(() => {});
    }

    (previewPromise.current ?? createAfterPreview(image, result))
      .then((generated) => {
        if (generated) setAfterImage(generated);
      })
      .catch(() => {})
      .finally(() => setAfterPending(false));

    const mapAreas = (result.annotations ?? []).map((annotation) => ({
      area: annotation.area,
      severity: annotation.severity,
    }));
    fetch("/api/map", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, areas: mapAreas }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        return response.ok && typeof data.image === "string" ? data.image : null;
      })
      .catch(() => null)
      .then((generated) => {
        if (generated) setMapImage(generated);
      })
      .finally(() => setMapPending(false));
  };

  const retryPreview = (image: string, result: SkinAnalysis) => {
    setAfterImage(null);
    setAfterPending(true);
    createAfterPreview(image, result)
      .then((generated) => {
        if (generated) setAfterImage(generated);
      })
      .catch(() => {})
      .finally(() => setAfterPending(false));
  };

  const continueToOwnerReport = () => {
    if (!selfie || !analysis || afterPending) return;
    if (selectedSample) {
      onContinue(snapshotForConcern(selectedSample));
      return;
    }
    const matchedProductIds = planFor(analysis.annotations ?? []).map((product) => product.id);
    onContinue({
      source: "live",
      before: selfie,
      after: afterImage,
      mapImage,
      analysis,
      matchedProductIds,
      previewStatus: afterImage ? "ready" : "failed",
    });
  };

  return (
    <div className="w-full animate-fade-scale">
      <BrandedHeader brand={brand} clinicPreview={audienceMode === "clinic-preview"} />

      {step === "choose" && (
        <ConcernSamplePicker
          onUsePhoto={() => {
            setStep("capture");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onSelect={selectSample}
          onEditBrand={onEditBrand}
          clinicPreview={audienceMode === "clinic-preview"}
        />
      )}

      {step === "sample-lead" && selectedSample && (
        <LeadForm
          selfie={selectedSample.before}
          clinicName={brand.clinicName}
          onSubmitted={(submittedLead, submittedMeta) => {
            setLead(submittedLead);
            setLeadMeta(submittedMeta);
            trackOutreachEvent(recipientToken, "lead_gate_submit", campaignStage);
            revealSample(selectedSample);
          }}
        />
      )}

      {step === "capture" && (
        <section className="w-full">
          <div className="mb-8 text-center">
            <p className="eyebrow">Live route · Client photograph</p>
            <h2 className="display mt-3 text-4xl text-plum sm:text-6xl">Analyse a real photo</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-plum-soft">
              Upload or take a clear, front-facing photo. Photo permission is
              required before capture. {audienceMode === "clinic-preview" ? "Your clinic details are not requested again." : "Patient lead capture follows before the complete result."}
            </p>
            <button
              type="button"
              onClick={() => setStep("choose")}
              className="mt-3 text-xs text-plum-mute underline underline-offset-4 hover:text-plum"
            >
              Back to the two experience options
            </button>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <aside className="report-advantage-card order-2 p-7 text-white lg:order-1 sm:p-8">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8ED8C7]">What this demonstrates</p>
              <div className="mt-6 space-y-5">
                {[
                  ["01", "Consent and photograph", "Clear permission and a guided, privacy-conscious upload."],
                  ["02", audienceMode === "clinic-preview" ? "Single clinic-owner gate" : "Patient lead gate", audienceMode === "clinic-preview" ? "Your work details were captured once before entering this demonstration." : "Name, email, phone and treatment priorities are captured before reveal."],
                  ["03", "Illustrative AI skin-quality experience", "Analysis, treatment map, before-and-after and honest limitations."],
                  ["04", "Consultation handoff", "A direct route from visible interest into the clinic conversation."],
                ].map(([number, title, copy]) => (
                  <div key={number} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-sm text-[#8ED8C7]">{number}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/55">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
            <div className="order-1 lg:order-2">
              <SelfieCapture
                onCaptured={(image) => {
                  setSelfie(image);
                  setSelectedSample(null);
                  startPipeline(image);
                  if (audienceMode === "clinic-preview") {
                    runAnalysis(image);
                  } else {
                    setStep("lead");
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          </div>
        </section>
      )}

      {step === "lead" && selfie && (
        <LeadForm
          selfie={selfie}
          clinicName={brand.clinicName}
          onSubmitted={(submittedLead, submittedMeta) => {
            setLead(submittedLead);
            setLeadMeta(submittedMeta);
            trackOutreachEvent(recipientToken, "lead_gate_submit", campaignStage);
            runAnalysis(selfie, submittedLead, submittedMeta);
          }}
        />
      )}

      {step === "processing" && <Processing />}

      {step === "result" && analysis && selfie && (
        <>
          <AnalysisReport
            before={selfie}
            after={afterImage}
            afterPending={afterPending}
            mapImage={mapImage}
            mapPending={mapPending}
            analysis={analysis}
            clinicName={brand.clinicName}
            consultationUrl={consultationUrl}
            sourceDisclosure={selectedSample ? snapshotForConcern(selectedSample).disclosure : undefined}
            onRetryPreview={selectedSample ? undefined : () => retryPreview(selfie, analysis)}
            onRestart={reset}
          />
          <div className="mx-auto -mt-10 mb-10 max-w-3xl rounded-3xl border border-serum/15 bg-[#EAF6F2] p-6 text-center sm:p-8">
            <p className="eyebrow">Clinic-owner view</p>
            <h3 className="mt-3 text-2xl font-medium text-plum">Now translate this patient moment into clinic value.</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-plum-soft">
              The next report carries this exact experience forward and explains
              its product match, conversion purpose and consultation handoff.
            </p>
            <button
              type="button"
              onClick={continueToOwnerReport}
              disabled={afterPending}
              className="btn-serum mt-6 disabled:cursor-wait disabled:opacity-55"
            >
              {afterPending ? "Preparing your clinic report…" : "See the clinic growth report →"}
            </button>
            {afterPending && (
              <p className="mt-3 text-xs text-plum-mute">The report opens when the preview succeeds or reaches its analysis-only fallback.</p>
            )}
          </div>
        </>
      )}

      {step === "error" && (
        <section className="mx-auto max-w-md py-12 text-center">
          <p className="eyebrow">Something interrupted the analysis</p>
          <h2 className="display mt-3 text-4xl text-plum">Let&rsquo;s try again</h2>
          <p className="mt-4 text-sm leading-6 text-plum-soft">{errorMsg}</p>
          <div className="mt-8 flex flex-col items-center gap-4">
            {selfie && (audienceMode === "clinic-preview" || (lead && leadMeta)) && (
              <button type="button" onClick={() => runAnalysis(selfie, lead ?? undefined, leadMeta ?? undefined)} className="btn-serum">Retry analysis</button>
            )}
            <button type="button" onClick={reset} className="text-sm text-plum-mute underline underline-offset-4 hover:text-plum">Choose another route</button>
          </div>
        </section>
      )}

      {lead && leadMeta && step === "result" && (
        <p className="sr-only">Lead captured for {lead.name} with a matched analysis event.</p>
      )}
    </div>
  );
}
