"use client";

import { useRef, useState } from "react";
import { ACCENT_SWATCHES, DEFAULT_ACCENT, makeBrand, type BrandConfig } from "@/lib/brand";

const MAX_LOGO_DIM = 320;

async function fileToLogoDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_LOGO_DIM / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/png");
}

export default function BrandStamp({
  initialBrand,
  onDone,
}: {
  initialBrand?: BrandConfig;
  onDone: (brand: BrandConfig) => void;
}) {
  const [clinicName, setClinicName] = useState(
    initialBrand?.clinicName === "Your Clinic" ? "" : initialBrand?.clinicName ?? "",
  );
  const [accent, setAccent] = useState(initialBrand?.accent ?? DEFAULT_ACCENT);
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(
    initialBrand?.logoDataUrl,
  );
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file for your logo.");
      return;
    }
    try {
      setLogoDataUrl(await fileToLogoDataUrl(file));
      setError(null);
    } catch {
      setError("We couldn't read that logo. Try a PNG or JPG.");
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clinicName.trim().length < 2) {
      setError("Please enter your clinic name.");
      return;
    }
    onDone(makeBrand({ clinicName, accent, logoDataUrl }));
  };

  return (
    <div className="mx-auto w-full max-w-lg animate-fade-scale">
      <div className="mb-7 text-center">
        <p className="eyebrow">Step 01 — Your Clinic</p>
        <h2 className="display mt-3 text-4xl text-plum sm:text-5xl">
          Put your name on it
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-plum-soft">
          Add your clinic name, colour and optional logo to preview the patient
          journey before the webinar.
        </p>
      </div>

      <form onSubmit={submit} className="glass space-y-5 p-6 sm:p-8">
        <div>
          <label className="mb-2 block text-[0.65rem] uppercase tracking-[0.18em] text-plum-soft">
            Clinic name
          </label>
          <input
            className="field"
            placeholder="e.g. Harley Street Skin Studio"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            autoComplete="organization"
            required
          />
        </div>

        <div>
          <p className="mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-plum-soft">
            Accent colour
          </p>
          <div className="flex flex-wrap gap-2">
            {ACCENT_SWATCHES.map((s) => (
              <button
                type="button"
                key={s.value}
                onClick={() => setAccent(s.value)}
                aria-label={s.label}
                className={`h-9 w-9 rounded-full border-2 transition ${
                  accent === s.value
                    ? "border-plum scale-110"
                    : "border-white/70 hover:scale-105"
                }`}
                style={{ background: s.value }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[0.65rem] uppercase tracking-[0.18em] text-plum-soft">
            Logo <span className="normal-case tracking-normal text-plum-mute">(optional)</span>
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn-ghost !px-5 !py-2.5 !text-[0.65rem]"
            >
              {logoDataUrl ? "Change logo" : "Upload logo"}
            </button>
            {logoDataUrl && (
              <span className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoDataUrl}
                  alt="Your logo"
                  className="h-9 w-9 rounded-md border border-white/70 object-contain bg-white"
                />
                <button
                  type="button"
                  onClick={() => setLogoDataUrl(undefined)}
                  className="text-xs text-plum-mute underline underline-offset-2 hover:text-plum"
                >
                  remove
                </button>
              </span>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onLogo}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-serum w-full">
          See my branded demo
        </button>
        <p className="text-center text-[0.65rem] uppercase tracking-[0.14em] text-plum-mute">
          Your branding stays in this browser session
        </p>
      </form>
    </div>
  );
}
