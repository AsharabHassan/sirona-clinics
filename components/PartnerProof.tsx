interface TrainerSpotlightProps {
  consultationUrl: string;
  onTryExperience: () => void;
}

const PARTNER_CLINICS = [
  {
    name: "Dr M. Sha Wellness & Aesthetics",
    logo: "/partners/dr-m-sha-logo.jpg",
    logoClass: "h-12 sm:h-14",
    surface: "bg-white",
  },
  {
    name: "OD Aesthetic Clinic",
    logo: "/partners/od-aesthetic-clinic-logo.png",
    logoClass: "h-14 sm:h-16",
    surface: "bg-[#ead6e1]",
  },
  {
    name: "Aesthetics Central",
    logo: "/partners/aesthetics-central-logo.png",
    logoClass: "h-16 sm:h-[4.5rem]",
    surface: "bg-[#17120f]",
  },
  {
    name: "Harley Street Medics",
    logo: "/partners/harley-street-medics-logo.webp",
    logoClass: "h-12 sm:h-14",
    surface: "bg-[#111c19]",
  },
] as const;

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m4.8 8.1 2.05 2.05 4.35-4.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PartnerLogoStrip() {
  return (
    <section className="relative z-10 border-y border-black/[0.06] bg-white/80">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Trusted by clinics across the UK</p>
          <h2 className="mt-3 text-2xl font-medium text-plum sm:text-3xl">
            Built with real clinic partners, not in isolation.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-plum-soft">
            Sirona works with a growing network of UK clinics across professional
            education, treatment innovation and patient-growth support.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PARTNER_CLINICS.map((clinic) => (
            <article
              key={clinic.name}
              className="group overflow-hidden rounded-[1.35rem] border border-black/[0.07] bg-white shadow-[0_16px_45px_rgba(44,27,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(44,27,42,0.1)]"
            >
              <div className={`flex h-28 items-center justify-center px-5 ${clinic.surface}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={clinic.logo}
                  alt={`${clinic.name} logo`}
                  className={`w-auto max-w-full object-contain ${clinic.logoClass}`}
                />
              </div>
              <p className="flex min-h-14 items-center justify-center px-3 py-3 text-center text-[0.62rem] font-semibold uppercase leading-5 tracking-[0.1em] text-plum-soft">
                {clinic.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrainerSpotlight({
  consultationUrl,
  onTryExperience,
}: TrainerSpotlightProps) {
  return (
    <section className="relative z-10 overflow-hidden bg-[#10231F] text-white">
      <div className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#2E8B78]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#C78B66]/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:py-24">
        <div className="relative mx-auto w-full max-w-[430px]">
          <div className="absolute -inset-3 rounded-[2.6rem] border border-white/10" />
          <div className="relative overflow-hidden rounded-[2.2rem] bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.3)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/partners/dr-m-sha-trainer.jpg"
              alt="Dr M. Sha, VELURIA trainer, in her clinic"
              className="aspect-[4/5] w-full object-cover object-[50%_28%]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-6 pb-6 pt-24 sm:px-8 sm:pb-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8ED8C7]">
                    VELURIA trainer
                  </p>
                  <p className="mt-2 text-2xl font-medium text-white">Dr M. Sha</p>
                  <p className="mt-1 text-xs leading-5 text-white/65">
                    Dr M. Sha Wellness &amp; Aesthetics Clinic
                  </p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/partners/dr-m-sha-logo.jpg"
                  alt=""
                  className="h-12 w-20 rounded-lg bg-white object-contain p-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8ED8C7]">
            Training grounded in clinic reality
          </p>
          <h2 className="display mt-5 text-4xl text-white sm:text-6xl">
            Product confidence starts with practitioner confidence.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/68">
            Dr M. Sha supports VELURIA training from the perspective of a working
            aesthetics clinic. Clinics can explore how the range fits, how to
            explain the treatment story clearly and how to connect patient
            interest with a structured consultation journey.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Clinic-led training", "Practical implementation", "Patient journey support"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-xs text-white/78"
                >
                  <span className="text-[#8ED8C7]">
                    <TickIcon />
                  </span>
                  {item}
                </div>
              ),
            )}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#10231F] transition hover:-translate-y-0.5 hover:bg-[#EAF6F2]"
            >
              Discuss VELURIA for my clinic <ArrowIcon />
            </a>
            <button
              type="button"
              onClick={onTryExperience}
              className="inline-flex items-center justify-center rounded-full border border-white/18 px-7 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white/35 hover:bg-white/[0.06]"
            >
              Experience the patient journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
