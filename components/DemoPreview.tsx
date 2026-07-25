"use client";

import { useEffect, useMemo, useState } from "react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import SelfieCapture from "@/components/SelfieCapture";
import { brandInitials, type BrandConfig } from "@/lib/brand";
import { heroFirst, heroZone } from "@/lib/hero";
import { SAMPLES, sampleById, type DemoSample } from "@/lib/samples";
import { trackDemo } from "@/lib/meta";
import type { SkinAnalysis } from "@/lib/types";

interface DemoView {
  before: string;
  after: string;
  summary: string;
  metrics: { label: string; score: number; uplift: number }[];
  veluriaNote: string;
  live?: boolean;
}

function sampleToView(s: DemoSample): DemoView {
  return {
    before: s.beforeSrc,
    after: s.afterSrc,
    summary: s.summary,
    metrics: s.metrics,
    veluriaNote: s.veluriaNote,
  };
}

export default function DemoPreview({
  brand,
  onContinue,
}: {
  brand: BrandConfig;
  onContinue: () => void;
}) {
  const [sampleId, setSampleId] = useState(SAMPLES[0].id);
  const [live, setLive] = useState<DemoView | null>(null);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
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

      // One area leads the image — see lib/hero.ts. A change spread evenly over
      // the whole face is the hardest kind to see, and a clinic owner watching
      // this demo decide whether the tool is worth having is exactly the viewer
      // we cannot afford to leave saying "nothing happened". The hero must also
      // lead the list: the route caps it at six and the prompt weights the first
      // bullet most heavily.
      const hero = heroZone(analysis.annotations, analysis.categories);
      const concerns = heroFirst(
        analysis.annotations?.map((a) => ({ area: a.area, concern: a.concern })) ?? [],
        hero,
      );
      const tr = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          quality: "medium",
          areas: concerns,
          annotate: false,
          hero: hero ? { area: hero.area, concern: hero.concern } : null,
        }),
      });
      const td = await tr.json().catch(() => ({}));
      const after = tr.ok ? (td.image as string) : image;

      setLive({
        before: image,
        after,
        summary: analysis.summary,
        metrics: (analysis.categories ?? []).slice(0, 4).map((c) => ({
          label: c.label,
          score: c.score,
          uplift: Math.max(0, Math.min(22, Math.round((100 - c.score) * 0.25))),
        })),
        veluriaNote: analysis.veluriaRecommendation,
        live: true,
      });
      setUploading(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setLiveError(
        msg === "no_face"
          ? "We couldn't detect a face in that photo. Try another, well-lit and head-on."
          : "That live run didn't complete — the sample demos above still show the difference.",
      );
    } finally {
      setBusy(false);
    }
  };

  const accent = brand.accent;

  return (
    <div className="w-full animate-fade-scale">
      <div className="mb-7 text-center">
        <p className="eyebrow">Step 02 — Your Branded Demo</p>
        <h2 className="display mt-3 text-4xl text-plum sm:text-5xl">
          This is what <span className="serum-text italic">{brand.clinicName}</span> patients see
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-plum-soft">
          The exact AI skin-scan that turns an Instagram scroll into a booked
          Veluria consultation — drag the slider to reveal the difference.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[minmax(280px,340px)_1fr] md:items-start">
        {/* ---- Phone frame, stamped with THEIR brand ---- */}
        <div className="mx-auto w-full max-w-[340px]">
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
                <BeforeAfterSlider before={view.before} after={view.after} />
              </div>

              {/* Mini result card */}
              <div className="space-y-3 px-4 pb-5">
                <p className="text-xs leading-relaxed text-plum-soft">{view.summary}</p>
                <div className="space-y-2">
                  {view.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="flex items-baseline justify-between text-[0.7rem]">
                        <span className="text-plum-soft">{m.label}</span>
                        <span className="font-semibold" style={{ color: accent }}>
                          +{m.uplift}%
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
              Veluria scope, honestly
            </p>
            <p className="text-sm leading-relaxed text-plum-soft">{view.veluriaNote}</p>
          </div>

          {/* Optional live path */}
          {!uploading ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setLiveError(null);
                  setUploading(true);
                }}
                className="btn-ghost !px-6 !py-3 !text-[0.65rem]"
              >
                {live ? "Try another photo" : "Try it on a real photo"}
              </button>
              {live && (
                <button
                  type="button"
                  onClick={() => setLive(null)}
                  className="text-xs text-plum-mute underline underline-offset-2 hover:text-plum"
                >
                  back to samples
                </button>
              )}
              <span className="text-[0.65rem] uppercase tracking-[0.14em] text-plum-mute">
                {live?.live ? "Live AI result" : "Optional · live AI"}
              </span>
            </div>
          ) : busy ? (
            <div className="glass-soft p-6 text-center">
              <p className="text-sm text-plum-soft">Running the live skin-scan…</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-plum-mute">
                20–40 seconds · same engine your patients use
              </p>
            </div>
          ) : (
            <div>
              <SelfieCapture onCaptured={(url) => runLive(url)} />
              <button
                type="button"
                onClick={() => setUploading(false)}
                className="mt-3 text-xs text-plum-mute underline underline-offset-2 hover:text-plum"
              >
                cancel
              </button>
            </div>
          )}
          {liveError && <p className="text-sm text-red-600">{liveError}</p>}

          <div className="pt-2">
            <button onClick={onContinue} className="btn-serum">
              What could this do for my clinic? →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
