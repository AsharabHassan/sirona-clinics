"use client";

import { useState } from "react";
import BrandStamp from "@/components/BrandStamp";
import DemoPreview from "@/components/DemoPreview";
import RoiCalculator from "@/components/RoiCalculator";
import ClinicLeadForm from "@/components/ClinicLeadForm";
import { makeBrand, type BrandConfig } from "@/lib/brand";
import type { ClinicLeadPayload } from "@/lib/types";

type Step = "welcome" | "brand" | "demo" | "roi" | "form" | "done";

// Sirona's "book a demo" calendar (GoHighLevel). Set NEXT_PUBLIC_CALENDAR_URL
// in the environment; the fallback keeps local dev working.
const CALENDAR_URL =
  process.env.NEXT_PUBLIC_CALENDAR_URL ?? "https://sironaaesthetics.co.uk/contact";

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [brand, setBrand] = useState<BrandConfig>(makeBrand());
  const [lead, setLead] = useState<ClinicLeadPayload | null>(null);

  return (
    <main className="relative min-h-dvh">
      <header className="relative z-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-2 px-6 pt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sirona-logo.png" alt="Sirona Aesthetics" className="h-9 w-auto" />
          <p className="text-[0.6rem] uppercase tracking-couture text-plum-mute">
            AI Skin-Scan for Clinics
          </p>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-12 sm:py-16">
        {step === "welcome" && (
          <section key="welcome" className="relative mx-auto max-w-2xl text-center">
            <p className="eyebrow animate-fade-scale" style={{ animationDelay: "60ms" }}>
              For aesthetic clinics
            </p>
            <h1
              className="display mt-6 animate-fade-scale text-5xl text-plum sm:text-7xl"
              style={{ animationDelay: "140ms" }}
            >
              Turn Instagram scrollers
              <br />
              <span className="serum-text italic">into booked Veluria consults.</span>
            </h1>
            <p
              className="mx-auto mt-7 max-w-md animate-fade-scale text-balance text-plum-soft"
              style={{ animationDelay: "240ms" }}
            >
              An AI skin-scan — branded to your clinic — that shows a patient
              their Veluria before/after and captures the lead. See it with your
              own name on it in under a minute.
            </p>
            <div
              className="mt-10 flex animate-fade-scale flex-col items-center gap-4"
              style={{ animationDelay: "340ms" }}
            >
              <button onClick={() => setStep("brand")} className="btn-serum">
                See it with my clinic&rsquo;s name
              </button>
              <p className="text-[0.7rem] uppercase tracking-[0.16em] text-plum-mute">
                No signup · Powered by Sirona &amp; PB Serum Veluria
              </p>
            </div>

            <div
              className="mx-auto mt-14 grid max-w-lg animate-fade-scale grid-cols-3 gap-3"
              style={{ animationDelay: "440ms" }}
            >
              {[
                ["01", "Brand the demo"],
                ["02", "See the difference"],
                ["03", "Project the ROI"],
              ].map(([n, label]) => (
                <div key={n} className="glass-soft px-4 py-5 text-center">
                  <p className="font-display text-2xl text-plum-mute">{n}</p>
                  <p className="mt-1 text-[0.65rem] uppercase tracking-[0.14em] text-plum-soft">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {step === "brand" && (
          <BrandStamp
            key="brand"
            onDone={(b) => {
              setBrand(b);
              setStep("demo");
            }}
          />
        )}

        {step === "demo" && (
          <DemoPreview key="demo" brand={brand} onContinue={() => setStep("roi")} />
        )}

        {step === "roi" && (
          <RoiCalculator key="roi" onContinue={() => setStep("form")} />
        )}

        {step === "form" && (
          <ClinicLeadForm
            key="form"
            brand={brand}
            onSubmitted={(l) => {
              setLead(l);
              setStep("done");
            }}
          />
        )}

        {step === "done" && (
          <section key="done" className="mx-auto max-w-md animate-fade-scale text-center">
            <p className="eyebrow">You&rsquo;re in</p>
            <h2 className="display mt-3 text-4xl text-plum sm:text-5xl">
              Thanks{lead?.ownerName ? `, ${lead.ownerName.split(/\s+/)[0]}` : ""} —
              let&rsquo;s talk
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-plum-soft">
              Pick a 15-minute slot and we&rsquo;ll walk you through your branded
              Veluria skin-scan and the ad funnel that fills it.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn-serum">
                Book your 15-min demo
              </a>
              <button
                onClick={() => setStep("welcome")}
                className="text-sm text-plum-mute underline-offset-4 hover:text-plum hover:underline"
              >
                Back to start
              </button>
            </div>
          </section>
        )}
      </div>

      <footer className="relative z-10 mx-auto max-w-5xl px-6 pb-10 text-center text-[0.65rem] uppercase tracking-[0.14em] text-plum-mute/70">
        © {new Date().getFullYear()} Sirona Aesthetics · Veluria by PB Serum · AI
        skin-scan for clinics
      </footer>
    </main>
  );
}
