export default function VeluriaProfessionalEducation({ report = false }: { report?: boolean }) {
  return (
    <section className="rounded-[2rem] border border-serum/15 bg-white/70 p-6 sm:p-9">
      <p className="eyebrow">{report ? "Patient education inside the report" : "Understand the clinical story"}</p>
      <h2 className="display mt-3 text-3xl text-plum sm:text-5xl">
        {report ? "A clearer treatment conversation, before the consultation." : "What VELURIA is — and why patients see it differently."}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-plum-soft sm:text-base">
        VELURIA is a professional cosmetic bioremodelling range focused on visible skin-quality
        parameters: texture, firmness, tone, luminosity and vitality. The goal is progressive,
        natural-looking skin improvement without changing facial identity or adding filler volume.
      </p>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {[
          ["01", "Assess and select", "A qualified professional assesses suitability and matches Silk Skin, Ultra Lift or Pearl Tone to the appropriate visible concern."],
          ["02", "Professional protocol", "The selected formula can be integrated into a microneedling-led protocol where clinically appropriate; technique and course design remain clinician-led."],
          ["03", "Set honest boundaries", "The conversation separates skin quality from lesions, active disease, visible vessels and structural volume loss that require another assessment or approach."],
        ].map(([number, title, copy]) => (
          <article key={number} className="rounded-2xl border border-black/[0.06] bg-white p-5">
            <span className="font-display text-2xl text-serum/45">{number}</span>
            <h3 className="mt-4 font-semibold text-plum">{title}</h3>
            <p className="mt-2 text-xs leading-6 text-plum-soft">{copy}</p>
          </article>
        ))}
      </div>

      <details className="group mt-5 rounded-2xl border border-serum/10 bg-[#EAF6F2]/70 px-5 py-4">
        <summary className="cursor-pointer list-none text-sm font-semibold text-plum marker:hidden">
          <span className="flex items-center justify-between gap-4">How the goal differs from other injectables<span className="text-xl font-normal text-serum transition group-open:rotate-45" aria-hidden="true">+</span></span>
        </summary>
        <div className="mt-4 grid gap-3 border-t border-serum/10 pt-4 text-xs leading-6 text-plum-soft md:grid-cols-3">
          <p><strong className="text-plum">Dermal filler</strong><br />Primarily restores or adds volume and contour.</p>
          <p><strong className="text-plum">Wrinkle-relaxing injections</strong><br />Reduce selected muscle movement.</p>
          <p><strong className="text-plum">VELURIA</strong><br />Focuses on the visible quality of the skin itself and may complement rather than replace other treatments.</p>
        </div>
      </details>

      <p className="mt-4 text-[0.65rem] leading-relaxed text-plum-mute">
        Professional cosmetic use. Final product choice, protocol, contraindication screening and
        treatment expectations are determined by the treating clinician. Individual outcomes vary.
      </p>
    </section>
  );
}
