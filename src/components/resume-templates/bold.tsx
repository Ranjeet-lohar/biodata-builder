import type { ResumeTemplateDesignProps } from "./shared";

const ACCENT = "#ce603d";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-start gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#ce603d]">
      <svg width="10" height="10" viewBox="0 0 10 10" className="mt-[1px] shrink-0" aria-hidden="true">
        <rect x="1" y="1" width="8" height="8" transform="rotate(45 5 5)" fill={ACCENT} />
      </svg>
      <span>{children}</span>
    </h2>
  );
}

export default function BoldTemplate(props: ResumeTemplateDesignProps) {
  return (
    <article className="relative mx-auto flex min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed text-[#352b28] shadow-xl">
      {/* ===== Background pattern layer ===== */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 794 1123"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle dot grid */}
          <pattern id="bold-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill={ACCENT} opacity="0.22" />
          </pattern>

          {/* Diagonal stripes for the left rail */}
          <pattern
            id="bold-stripes"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="8" height="8" fill={ACCENT} />
            <line x1="0" y1="0" x2="0" y2="8" stroke="#ffffff" strokeWidth="1.5" opacity="0.28" />
          </pattern>

          {/* Fine grid fade for top area */}
          <linearGradient id="bold-fade-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="bold-fade-bottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          <mask id="bold-dots-mask">
            <rect x="0" y="0" width="794" height="260" fill="url(#bold-fade-bottom)" />
          </mask>

          <mask id="bold-dots-mask-bottom">
            <rect x="0" y="0" width="794" height="1123" fill="#000" />
            <rect x="0" y="863" width="794" height="260" fill="url(#bold-fade-top)" />
          </mask>
        </defs>

        {/* Top-right dot field, fades downward */}
        <g mask="url(#bold-dots-mask)">
          <rect x="440" y="0" width="354" height="260" fill="url(#bold-dots)" />
        </g>

        {/* Bottom-right dot field, fades upward */}
        <g mask="url(#bold-dots-mask-bottom)">
          <rect x="480" y="863" width="314" height="260" fill="url(#bold-dots)" />
        </g>

        {/* Concentric rings, top-right corner */}
        <g fill="none" stroke={ACCENT} strokeWidth="1">
          <circle cx="794" cy="0" r="70" opacity="0.18" />
          <circle cx="794" cy="0" r="110" opacity="0.13" />
          <circle cx="794" cy="0" r="150" opacity="0.09" />
          <circle cx="794" cy="0" r="190" opacity="0.05" />
        </g>

        {/* Solid corner triangle, bottom-right */}
        <polygon points="794,1123 794,1043 714,1123" fill={ACCENT} opacity="0.9" />
        <polygon points="794,1123 794,1073 744,1123" fill="#ffffff" opacity="0.25" />

        {/* Faint chevron cluster, bottom-left of content area */}
        <g fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
          <polyline points="52,1070 62,1080 52,1090" />
          <polyline points="64,1070 74,1080 64,1090" />
          <polyline points="76,1070 86,1080 76,1090" />
        </g>
      </svg>

      {/* ===== Left accent rail with stripe pattern ===== */}
      <div className="relative w-5 shrink-0 overflow-hidden bg-[#ce603d]">
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <pattern
              id="bold-rail"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="10" height="10" fill={ACCENT} />
              <line x1="0" y1="0" x2="0" y2="10" stroke="#fff" strokeWidth="2" opacity="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bold-rail)" />
        </svg>
      </div>

      {/* ===== Content ===== */}
      <div className="relative min-w-0 flex-1 px-10 py-11">
        <header className="relative mb-8 border-b-4 border-[#ce603d] pb-6">
          <div className="flex items-center gap-3">
            <svg width="34" height="8" viewBox="0 0 34 8" aria-hidden="true">
              <rect x="0" y="0" width="14" height="8" fill={ACCENT} />
              <rect x="18" y="0" width="6" height="8" fill={ACCENT} opacity="0.6" />
              <rect x="28" y="0" width="6" height="8" fill={ACCENT} opacity="0.3" />
            </svg>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ce603d]">Resume / Profile</p>
          </div>

          <h1 className="mt-2 break-words text-[40px] font-black uppercase leading-none">
            {props.resume.fullName || "Your Name"}
          </h1>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <p className="text-lg font-semibold">{props.resume.jobTitle || "Professional Title"}</p>
            <p className="break-words text-right text-[10px] text-slate-500">{props.contact.join("  •  ")}</p>
          </div>

          {/* Tick-mark ruler on the header underline */}
          <svg
            className="absolute -bottom-[14px] left-0"
            width="220"
            height="8"
            viewBox="0 0 220 8"
            aria-hidden="true"
          >
            {Array.from({ length: 23 }).map((_, i) => (
              <line
                key={i}
                x1={i * 10 + 0.5}
                y1="0"
                x2={i * 10 + 0.5}
                y2={i % 5 === 0 ? 8 : 4}
                stroke={ACCENT}
                strokeWidth="1"
                opacity="0.55"
              />
            ))}
          </svg>
        </header>

        <section className="mb-8 grid grid-cols-[120px_1fr] gap-5">
          <SectionTitle>Profile</SectionTitle>
          <p className="whitespace-pre-wrap text-slate-600">
            {props.resume.summary || "Add a concise professional summary."}
          </p>
        </section>

        <section className="mb-8 grid grid-cols-[120px_1fr] gap-5">
          <SectionTitle>Experience</SectionTitle>
          {props.experienceEntries}
        </section>

        <section className="mb-8 grid grid-cols-[120px_1fr] gap-5">
          <SectionTitle>Education</SectionTitle>
          {props.educationEntries}
        </section>

        <div className="relative grid grid-cols-2 gap-8 border-t border-[#eadbd4] pt-6">
          {/* Small diamond marker sitting on the divider */}
          <svg
            className="absolute -top-[5px] left-0"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="8" height="8" transform="rotate(45 5 5)" fill={ACCENT} />
          </svg>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#ce603d]">
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <rect x="1" y="1" width="8" height="8" transform="rotate(45 5 5)" fill={ACCENT} />
              </svg>
              Skills
            </h2>
            <p className="text-slate-600">{props.skills.join("  /  ") || "Add your skills"}</p>
          </section>

          {props.certifications.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#ce603d]">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <rect x="1" y="1" width="8" height="8" transform="rotate(45 5 5)" fill={ACCENT} />
                </svg>
                Certifications
              </h2>
              <p className="text-slate-600">{props.certifications.join("  /  ")}</p>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}