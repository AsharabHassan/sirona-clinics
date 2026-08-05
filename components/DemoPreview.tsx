"use client";

import { useEffect, useMemo, useState } from "react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import SelfieCapture from "@/components/SelfieCapture";
import { brandInitials, type BrandConfig } from "@/lib/brand";
import { createAfterPreview } from "@/lib/afterPreview";
import { SAMPLES, sampleById, type DemoSample } from "@/lib/samples";
import { trackDemo } from "@/lib/meta";
import type { SkinAnalysis } from "@/lib/types";

interface DemoView {
  before: string;
  after: string;
  summary: string;
  metrics: { label: string; score: number }[];
  veluriaNote: string;
  live?: boolean;
  afterAvailable?: boolean;
}

type LivePhase = "analysing" | "generating";

function sampleToView(s: DemoSample): DemoView {
  return {
    before: s.beforeSrc,
    after: s.afterSrc,
    summary: s.summary,
    metrics: s.metrics,
    veluriaNote: s.veluriaNote,
    afterAvailable: true,
  };
}

export default function DemoPreview({
  brand,
  consultationUrl,
  onEditBrand,
  onContinue,
}: {
  brand: BrandConfig;
  consultationUrl: string;
  onEditBrand: () => void;
  onContinue: () => void;
}) {
  const [sampleId, setSampleId] = useState(SAMPLES[0].id);
  const [live, setLive] = useState<DemoView | null>(null);
  const [uploading, setUploading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [livePhase, setLivePhase] = useState<LivePhase>("analysing");
  const [liveError, setLiveError] = useState<string | null>(null);

  // Mid-funnel signal → optimisation + "demo viewers who didn't book" retargeting.
  useEffect(() => {
    trackDemo();
  }, []);

  const view: DemoView = useMemo(
    () => live ?? sampleToView(sampleById(sampleId)),
    [live, sampleId],
  );

  const runLive = async (image: string) => {
    setBusy(true);
    setLivePhase("analysing");
    setLiveError(null);
    try {
      const ar = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const ad = await ar.json().catch(() => ({}));
      if (!ar.ok) throw new Error(ad.error ?? "analyze_failed");
      const analysis = ad.analysis as SkinAnalysis;

      setLivePhase("generating");

      const after = await createAfterPreview(image, analysis);
      if (!after) {
        setLive({
          before: image,
          after: image,
          summary: analysis.summary,
          metrics: (analysis.categories ?? []).slice(0, 4).map((c) => ({
            label: c.label,
            score: c.score,
          })),
          veluriaNote: analysis.veluriaRecommendation,
          live: true,
          afterAvailable: false,
        });
        setUploading(false);
        setLiveError(
          "Your skin analysis completed successfully, but the illustrative after image did not finish. You can still review the analysis below or try another photo.",
        );
        return;
      }

      setLive({
        before: image,
        after,
        summary: analysis.summary,
        metrics: (analysis.categories ?? []).slice(0, 4).map((c) => ({
          label: c.label,
          score: c.score,
        })),
        veluriaNote: analysis.veluriaRecommendation,
        live: true,
        afterAvailable: true,
      });
      setUploading(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setLiveError(
        msg.includes("clear face") || msg === "no_face"
          ? "We couldn't detect a face in that photo. Try another, well-lit and head-on."
          : msg.includes("Too many live previews")
            ? "This preview has reached its short-term usage limit. Please wait a few minutes and try again."
            : msg.includes("configured")
              ? "The live analysis service is temporarily unavailable. Please try again shortly."
              : "The skin analysis did not complete. Please try a clear JPG, PNG or WebP photo with the face looking straight at the camera.",
      );
    } finally {
      setBusy(false);
    }
  };

  const accent = brand.accent;

  if (uploading) {
    return (
      <div className="w-full animate-fade-scale">
        <div className="mb-8 text-center">
          <p className="eyebrow">Step 02 — Live AI Experience</p>
          <h2 className="display mt-3 text-4xl text-plum sm:text-6xl">
            Try the AI on a real photo
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-plum-soft">
            Use the camera or upload a clear, front-facing photo. The experience
            will create a cosmetic skin analysis and an illustrative VELURIA
            before-and-after for the clinic report.
          </p>
          <button
            type="button"
            onClick={onEditBrand}
            className="mt-3 text-xs text-plum-mute underline underline-offset-4 transition hover:text-plum"
          >
            Change clinic branding
          </button>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <aside className="report-advantage-card order-2 p-7 text-white lg:order-1 sm:p-8">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8ED8C7]">
              What the clinic owner will see
            </p>
            <h3 className="mt-3 text-2xl font-medium text-white">
              One photo becomes a complete patient-conversation preview.
            </h3>
            <div className="mt-7 space-y-5">
              {[
                ["01", "Visible-skin analysis", "Cosmetic observations written in clear patient language."],
                ["02", "AI before & after", "An illustrative visualisation that makes the experience tangible."],
                ["03", "VELURIA direction", "A report showing how the range and the clinic journey connect."],
              ].map(([number, title, copy]) => (
                <div key={number} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-sm text-[#8ED8C7]">
                    {number}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-white/55">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-xs leading-6 text-white/55">
                The output is cosmetic and non-diagnostic. It is not medical
                advice or a prediction of treatment results.
              </p>
            </div>
          </aside>

          <div className="order-1 lg:order-2">
            {busy ? (
              <div className="glass min-h-[470px] overflow-hidden p-8 text-center sm:p-12">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-serum/10">
                  <div className="h-12 w-12 animate-spin rounded-full border-2 border-serum/20 border-t-serum" />
                </div>
                <p className="eyebrow mt-9">
                  {livePhase === "analysing"
                    ? "Analysing visible skin quality"
                    : "Skin analysis complete"}
                </p>
                <h3 className="display mx-auto mt-4 max-w-md text-4xl text-plum sm:text-5xl">
                  {livePhase === "analysing"
                    ? "Reading the photo and building the skin analysis."
                    : "Now creating the illustrative before-and-after."}
                </h3>
                <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-plum-soft">
                  {livePhase === "analysing"
                    ? "This first step normally completes within a few moments."
                    : "Your analysis is safe. The visual image step can take around one minute, so please keep this page open."}
                </p>
                <div className="mx-auto mt-7 flex max-w-sm items-center justify-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.13em]">
                  <span className="rounded-full bg-serum px-3 py-2 text-white">
                    Photo received
                  </span>
                  <span
                    className={`rounded-full px-3 py-2 ${
                      livePhase === "generating"
                        ? "bg-serum text-white"
                        : "bg-serum/10 text-serum"
                    }`}
                  >
                    Analysis complete
                  </span>
                  <span className="rounded-full bg-serum/10 px-3 py-2 text-serum">
                    AI comparison
                  </span>
                </div>
              </div>
            ) : (
              <SelfieCapture onCaptured={(url) => runLive(url)} />
            )}
            {liveError && (
              <p className="mt-4 rounded-2xl bg-red-50 p-4 text-center text-sm text-red-700">
                {liveError}
              </p>
            )}
            {!busy && (
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setLiveError(null);
                    setUploading(false);
                  }}
                  className="text-xs font-medium text-plum-mute underline underline-offset-4 hover:text-plum"
                >
                  View the real VELURIA case study instead
                </button>
                <span className="hidden text-plum-mute/40 sm:inline">·</span>
                <a
                  href={consultationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-serum underline underline-offset-4"
                >
                  Get my free clinic growth map
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-scale">
      <div className="mb-7 text-center">
        <p className="eyebrow">Step 02 — Your Branded Preview</p>
        <h2 className="display mt-3 text-4xl text-plum sm:text-5xl">
          A patient journey, branded for{" "}
          <span className="serum-text italic">{brand.clinicName}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-plum-soft">
          Explore the cosmetic AI visualisation, then see how the experience can
          lead into a qualified clinic conversation.
        </p>
        <button
          type="button"
          onClick={onEditBrand}
          className="mt-3 text-xs text-plum-mute underline underline-offset-4 transition hover:text-plum"
        >
          Change clinic branding
        </button>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(360px,520px)_1fr] lg:items-start">
        {/* ---- Hero visualisation, stamped with THEIR brand ---- */}
        <div className="mx-auto w-full max-w-[520px]">
          <div className="rounded-[2.4rem] border-[6px] border-plum/90 bg-plum/90 p-2 shadow-dew">
            <div className="overflow-hidden rounded-[1.9rem] bg-white">
              {/* Brand bar */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ background: accent }}
              >
                {brand.logoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logoDataUrl}
                    alt=""
                    className="h-7 w-7 rounded-md bg-white/90 object-contain p-0.5"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-[0.6rem] font-bold text-plum">
                    {brandInitials(brand.clinicName)}
                  </span>
                )}
                <span className="truncate text-sm font-semibold text-white">
                  {brand.clinicName}
                </span>
                <span className="ml-auto text-[0.55rem] uppercase tracking-[0.16em] text-white/80">
                  AI Skin Scan
                </span>
              </div>

              {/* Before/after */}
              <div className="p-3">
                {view.afterAvailable === false ? (
                  <div className="relative overflow-hidden rounded-[1.45rem] bg-plum/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={view.before}
                      alt="Uploaded photo used for the completed skin analysis"
                      className="aspect-square w-full object-cover"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-serum px-3 py-2 text-[0.55rem] font-semibold uppercase tracking-[0.13em] text-white">
                      Skin analysis complete
                    </span>
                  </div>
                ) : (
                  <BeforeAfterSlider
                    key={live?.live ? "live-ai" : "veluria-case-study"}
                    before={view.before}
                    after={view.after}
                    beforeAlt={live?.live ? "Uploaded photo" : "Before the VELURIA course"}
                    afterAlt={
                      live?.live
                        ? "Illustrative AI VELURIA visualisation"
                        : "Real VELURIA result"
                    }
                    afterLabel={live?.live ? "AI preview" : "After VELURIA"}
                  />
                )}
              </div>

              {/* Mini result card */}
              <div className="space-y-3 px-4 pb-5">
                <p className="text-xs leading-relaxed text-plum-soft">{view.summary}</p>
                <div className="space-y-2">
                  {view.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="flex items-center justify-between gap-3 text-[0.7rem]">
                        <span className="text-plum-soft">{m.label}</span>
                        <span
                          className="rounded-full px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.12em]"
                          style={{ color: accent, background: `${accent}12` }}
                        >
                          Visual focus
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-plum/10">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${m.score}%`, background: accent }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="w-full rounded-full py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white"
                  style={{ background: accent }}
                  disabled
                >
                  Book with {brand.clinicName}
                </button>
                <p className="text-[0.52rem] leading-relaxed text-plum-mute">
                  {live?.live
                    ? view.afterAvailable === false
                      ? "The cosmetic skin analysis completed. No after image is being presented for this run."
                      : "AI-generated cosmetic visualisation. Not a diagnosis, treatment prediction or guarantee."
                    : "Real VELURIA case study from Aesthetics Central. Individual results vary."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Controls + explainer ---- */}
        <div className="space-y-6">
          {SAMPLES.length > 1 && (
            <div>
              <p className="mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-plum-soft">
                Try a sample face
              </p>
              <div className="flex flex-wrap gap-2">
                {SAMPLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setLive(null);
                      setSampleId(s.id);
                    }}
                    className={`rounded-full border px-4 py-2 text-xs transition ${
                      !live && sampleId === s.id
                        ? "border-transparent bg-plum text-white"
                        : "border-[#E0E0E0] bg-white/70 text-plum-soft hover:border-plum/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="glass-soft space-y-2 p-5">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-serum">
              A responsible patient conversation
            </p>
            <p className="text-sm leading-relaxed text-plum-soft">{view.veluriaNote}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setLiveError(null);
                setUploading(true);
              }}
              className="btn-ghost !px-6 !py-3 !text-[0.65rem]"
            >
              {live ? "Try another real photo" : "Try the live AI instead"}
            </button>
            {live && (
              <button
                type="button"
                onClick={() => setLive(null)}
                className="text-xs text-plum-mute underline underline-offset-2 hover:text-plum"
              >
                View the VELURIA case study
              </button>
            )}
            <span className="text-[0.65rem] uppercase tracking-[0.14em] text-plum-mute">
              {live?.live ? "Your live AI result" : "Real VELURIA case study"}
            </span>
          </div>

          <div className="space-y-3 border-t border-black/[0.07] pt-6">
            <div className="rounded-2xl bg-[#EAF6F2] p-4">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-serum">
                Next: your clinic growth report
              </p>
              <p className="mt-2 text-sm leading-relaxed text-plum-soft">
                Compare product-only marketing with the VELURIA + AI patient
                journey behind this preview.
              </p>
            </div>
            <button onClick={onContinue} className="btn-serum w-full">
              See the clinic growth report →
            </button>
            <a
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full"
            >
              Get my free clinic growth map
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
