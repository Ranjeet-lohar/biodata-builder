import { useId } from "react";
import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const RUST = "#a34f3d";
const DEEP = "#7e3526";
const CLAY = "#d2a17f";
const PEACH = "#f3c5a9";
const LINE = "#dfcfc2";

/* Sunburst rays radiating from the top-right corner (svg is 440x440, origin at 440,0) */
const RAYS = Array.from({ length: 13 }, (_, i) => {
  const a = ((90 + i * 7.5) * Math.PI) / 180;
  return { x: +(440 + 440 * Math.cos(a)).toFixed(1), y: +(440 * Math.sin(a)).toFixed(1) };
});

/* Halftone dots: biggest in the bottom-right corner, shrinking away from it */
const HALFTONE = Array.from({ length: 14 * 14 }, (_, n) => {
  const r = Math.floor(n / 14);
  const c = n % 14;
  const d = Math.hypot(13 - c, 13 - r) / 18.4;
  return { cx: c * 13 + 6, cy: r * 13 + 6, r: +(3.4 * (1 - d)).toFixed(2) };
}).filter((dot) => dot.r > 0.35);

/* ---------- Icons (stroke-based, currentColor, no ids) ---------- */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const Icons = {
  experience: (s = 14) => (
    <svg width={s} height={s} {...base}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7 V5 A1.5 1.5 0 0 1 10.5 3.5 H13.5 A1.5 1.5 0 0 1 15 5 V7" />
      <path d="M3 13 H21" />
    </svg>
  ),
  education: (s = 14) => (
    <svg width={s} height={s} {...base}>
      <path d="M2 9 L12 4 L22 9 L12 14 Z" />
      <path d="M6 11.5 V16 C6 17.5 9 19 12 19 C15 19 18 17.5 18 16 V11.5" />
      <path d="M22 9 V15" />
    </svg>
  ),
  skills: (s = 14) => (
    <svg width={s} height={s} {...base}>
      <path d="M12 3 L14.5 9.5 L21 12 L14.5 14.5 L12 21 L9.5 14.5 L3 12 L9.5 9.5 Z" />
    </svg>
  ),
  certification: (s = 14) => (
    <svg width={s} height={s} {...base}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9.6 9 L11.4 10.8 L14.6 7.4" />
      <path d="M8.5 13.8 L7 21 L12 18.5 L17 21 L15.5 13.8" />
    </svg>
  ),
  arrow: (s = 11) => (
    <svg width={s} height={s} {...base} strokeWidth={2.2}>
      <path d="M7 17 L17 7" />
      <path d="M8 7 H17 V16" />
    </svg>
  ),
  mail: (s = 11) => (
    <svg width={s} height={s} {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7 L12 13 L21 7" />
    </svg>
  ),
  phone: (s = 11) => (
    <svg width={s} height={s} {...base}>
      <path d="M5 4 H9 L11 9 L8.5 10.5 C9.6 12.8 11.2 14.4 13.5 15.5 L15 13 L20 15 V19 C20 19.6 19.6 20 19 20 C10.7 19.5 4.5 13.3 4 5 C4 4.4 4.4 4 5 4 Z" />
    </svg>
  ),
  pin: (s = 11) => (
    <svg width={s} height={s} {...base}>
      <path d="M12 21 C7 15 5 12 5 9 A7 7 0 0 1 19 9 C19 12 17 15 12 21 Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  globe: (s = 11) => (
    <svg width={s} height={s} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12 H21" />
      <path d="M12 3 C15 6 15 18 12 21 C9 18 9 6 12 3 Z" />
    </svg>
  ),
};

function contactIcon(text: string) {
  const t = text.toLowerCase();
  if (t.includes("@")) return Icons.mail();
  if (/(https?:\/\/|www\.|linkedin|github|behance|\.com|\.in|\.org)/.test(t)) return Icons.globe();
  if (/^[+\d][\d\s().-]{6,}$/.test(text.trim())) return Icons.phone();
  return Icons.pin();
}

/* ---------- Decorative pieces ---------- */
function SectionTitle({
  no,
  icon,
  tone = RUST,
  children,
}: {
  no: string;
  icon: ReactNode;
  tone?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 border-t-2 pt-3" style={{ borderColor: tone }}>
      <div className="flex items-center gap-2.5">
        <span className="text-[22px] italic leading-none" style={{ color: tone, opacity: 0.45, fontFamily: "Georgia, serif" }}>
          {no}
        </span>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a34f3d]">{children}</h2>
        <span className="ml-auto text-[#a34f3d]">{icon}</span>
      </div>
    </div>
  );
}

function DoubleRule({ className }: { className?: string }) {
  return (
    <svg className={className} width="100%" height="7" aria-hidden="true">
      <line x1="0" y1="1" x2="100%" y2="1" stroke={RUST} strokeWidth="2" />
      <line x1="0" y1="6" x2="100%" y2="6" stroke={RUST} strokeWidth="0.7" />
    </svg>
  );
}

function CropMark({ className }: { className: string }) {
  return (
    <svg className={`pointer-events-none absolute ${className}`} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 13 V1 H13" stroke={RUST} strokeWidth="1.2" />
    </svg>
  );
}

function Seal() {
  return (
    <span className="relative flex h-7 w-7 shrink-0 -rotate-6 items-center justify-center text-[#a34f3d]">
      <svg className="absolute inset-0" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="13" stroke={RUST} strokeWidth="1" strokeDasharray="2 2.4" />
        <circle cx="14" cy="14" r="10.5" fill={PEACH} fillOpacity="0.45" />
      </svg>
      <span className="relative">{Icons.certification(13)}</span>
    </span>
  );
}

function RegistrationMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.2" stroke={RUST} strokeWidth="0.9" />
      <path d="M7 0 V14 M0 7 H14" stroke={RUST} strokeWidth="0.9" />
    </svg>
  );
}

export default function EditorialTemplate(props: ResumeTemplateDesignProps) {
  // Unique ids so several templates can render on one page (e.g. a picker)
  const uid = useId().replace(/:/g, "");
  const diamonds = `editorial-diamonds-${uid}`;
  const railFade = `editorial-rail-${uid}`;
  const rayFade = `editorial-rays-${uid}`;

  const initial = (props.resume.fullName || "Y").trim().charAt(0).toUpperCase();
  const contactItems = props.contact.length ? props.contact : ["Email", "Phone", "Location"];

  return (
    <article className="relative mx-auto flex min-h-[1123px] w-[794px] overflow-hidden bg-[#faf7f2] text-[13px] leading-relaxed text-[#332e2b] shadow-xl">
      {/* ===== Left rail ===== */}
      <div className="relative w-[34px] shrink-0 overflow-hidden bg-gradient-to-b from-[#7e3526] via-[#a34f3d] to-[#d2a17f]">
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <pattern id={diamonds} width="12" height="12" patternUnits="userSpaceOnUse">
              <polygon points="6,1 11,6 6,11 1,6" fill={PEACH} fillOpacity="0.32" />
            </pattern>
            <linearGradient id={railFade} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${diamonds})`} />
          <rect width="100%" height="100%" fill={`url(#${railFade})`} />
        </svg>

        {/* Emblem at the top */}
        <svg className="absolute left-1/2 top-8 -translate-x-1/2" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="9" stroke={PEACH} strokeWidth="1.2" />
          <polygon points="11,5 17,11 11,17 5,11" fill={PEACH} />
        </svg>

        {/* Vertical caption at the bottom */}
        <svg className="absolute bottom-10 left-1/2 -translate-x-1/2" width="16" height="190" viewBox="0 0 16 190" aria-hidden="true">
          <text
            transform="translate(12 188) rotate(-90)"
            fontSize="9"
            letterSpacing="4"
            fill="#faf7f2"
            fillOpacity="0.85"
            fontFamily="Georgia, serif"
          >
            CURRICULUM VITAE
          </text>
        </svg>
      </div>

      {/* ===== Corner decorations (main area) ===== */}
      <svg
        className="pointer-events-none absolute right-0 top-0 h-[440px] w-[440px]"
        viewBox="0 0 440 440"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={rayFade} gradientUnits="userSpaceOnUse" cx="440" cy="0" r="440">
            <stop offset="0%" stopColor={RUST} stopOpacity="0.4" />
            <stop offset="100%" stopColor={RUST} stopOpacity="0" />
          </radialGradient>
        </defs>
        {RAYS.map((p, i) => (
          <line key={i} x1="440" y1="0" x2={p.x} y2={p.y} stroke={`url(#${rayFade})`} strokeWidth="1.2" />
        ))}
        <circle cx="440" cy="0" r="90" stroke={RUST} strokeOpacity="0.16" />
        <circle cx="440" cy="0" r="150" stroke={RUST} strokeOpacity="0.1" strokeDasharray="2 5" />
      </svg>

      <svg
        className="pointer-events-none absolute bottom-2 right-0"
        width="182"
        height="182"
        viewBox="0 0 182 182"
        aria-hidden="true"
      >
        {HALFTONE.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={RUST} fillOpacity="0.2" />
        ))}
      </svg>

      {/* ===== Main content ===== */}
      <div className="relative min-w-0 flex-1 px-11 pb-16 pt-12">
        <header className="relative mb-8 pb-6">
          {/* Outlined initial watermark */}
          <svg className="pointer-events-none absolute -top-4 right-0" width="170" height="200" viewBox="0 0 170 200" aria-hidden="true">
            <text
              x="85"
              y="172"
              textAnchor="middle"
              fontSize="190"
              fontFamily="Georgia, 'Times New Roman', serif"
              fill="none"
              stroke={RUST}
              strokeWidth="1.2"
              opacity="0.24"
            >
              {initial}
            </text>
          </svg>

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="rounded-sm bg-[#a34f3d] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                No. 01
              </span>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a34f3d]">Selected Work & Experience</p>
              <span className="h-px w-16 bg-gradient-to-r from-[#a34f3d]/60 to-transparent" />
            </div>

            <h1
              className="mt-4 max-w-[480px] break-words text-[42px] font-semibold leading-[1.05] tracking-tight text-[#332e2b]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {props.resume.fullName || "Your Name"}
            </h1>
            <p className="mt-2 text-lg italic text-[#a34f3d]" style={{ fontFamily: "Georgia, serif" }}>
              {props.resume.jobTitle || "Professional Title"}
            </p>

            <ul className="mt-4 flex max-w-[560px] flex-wrap gap-x-5 gap-y-1.5 break-words text-[10.5px] text-[#776d65]">
              {contactItems.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <span className="text-[#a34f3d]">{contactIcon(item)}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <DoubleRule className="absolute bottom-0 left-0" />
        </header>

        {/* Introduction as a pull-quote */}
        <section className="mb-9 grid max-w-[640px] grid-cols-[34px_1fr] gap-3">
          <svg width="34" height="28" viewBox="0 0 26 20" className="mt-1" aria-hidden="true">
            <path d="M0 20 V10 C0 4 3 1 9 0 V4 C6 5 5 7 5 9 H9 V20 Z" fill={RUST} fillOpacity="0.85" />
            <path d="M15 20 V10 C15 4 18 1 24 0 V4 C21 5 20 7 20 9 H24 V20 Z" fill={CLAY} />
          </svg>
          <div>
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a34f3d]">Introduction</h2>
            <p className="whitespace-pre-wrap text-[#6b625c]">
              {props.resume.summary || "Add a concise professional summary."}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-[1.35fr_0.8fr] gap-8">
          <section className="min-w-0">
            <SectionTitle no="01" icon={Icons.experience()}>
              Experience
            </SectionTitle>
            <div className="relative border-l border-[#dfcfc2] pl-4">
              <svg width="9" height="9" viewBox="0 0 9 9" className="absolute -left-[5px] top-0" aria-hidden="true">
                <rect x="1" y="1" width="7" height="7" fill={RUST} />
              </svg>
              {props.experienceEntries}
            </div>
          </section>

          <div className="min-w-0 space-y-8">
            <section>
              <SectionTitle no="02" icon={Icons.education()} tone={CLAY}>
                Education
              </SectionTitle>
              {props.educationEntries}
            </section>

            <aside className="relative bg-[#f3ebe1] p-5">
              <CropMark className="left-1 top-1" />
              <CropMark className="right-1 top-1 -scale-x-100" />
              <CropMark className="bottom-1 left-1 -scale-y-100" />
              <CropMark className="bottom-1 right-1 -scale-100" />

              <section>
                <SectionTitle no="03" icon={Icons.skills()}>
                  Skills
                </SectionTitle>
                <ul className="space-y-1.5 text-[#6b625c]">
                  {props.skills.length ? (
                    props.skills.map((skill) => (
                      <li key={skill} className="flex items-center gap-2 border-b border-dotted border-[#d9c2b0] pb-1.5">
                        <span className="shrink-0 text-[#a34f3d]">{Icons.arrow()}</span>
                        <span>{skill}</span>
                      </li>
                    ))
                  ) : (
                    <li>Add your skills</li>
                  )}
                </ul>
              </section>

              {props.certifications.length > 0 && (
                <section className="mt-7">
                  <SectionTitle no="04" icon={Icons.certification()} tone={CLAY}>
                    Certifications
                  </SectionTitle>
                  <ul className="space-y-3 break-words text-[11px] text-[#6b625c]">
                    {props.certifications.map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <Seal />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* ===== Footer: folio + strip ===== */}
      <div className="pointer-events-none absolute bottom-4 left-[78px] flex items-center gap-2 text-[8px] uppercase tracking-[0.3em] text-[#a34f3d]/70">
        <RegistrationMark />
        <span>Folio 01</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#7e3526] via-[#a34f3d] to-[#f3c5a9]" />
    </article>
  );
}