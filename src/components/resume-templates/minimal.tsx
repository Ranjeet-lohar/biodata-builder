import { useId } from "react";
import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const SAGE = "#53665c";
const MIST = "#dce2de";
const CLAY = "#c8a27a";

/* ---------- Icons (hairline, currentColor, no ids) ---------- */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const Icons = {
  profile: (s = 12) => (
    <svg width={s} height={s} {...base}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21" />
    </svg>
  ),
  experience: (s = 12) => (
    <svg width={s} height={s} {...base}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7 V5 A1.5 1.5 0 0 1 10.5 3.5 H13.5 A1.5 1.5 0 0 1 15 5 V7" />
      <path d="M3 13 H21" />
    </svg>
  ),
  education: (s = 12) => (
    <svg width={s} height={s} {...base}>
      <path d="M2 9 L12 4 L22 9 L12 14 Z" />
      <path d="M6 11.5 V16 C6 17.5 9 19 12 19 C15 19 18 17.5 18 16 V11.5" />
      <path d="M22 9 V15" />
    </svg>
  ),
  skills: (s = 12) => (
    <svg width={s} height={s} {...base}>
      <path d="M12 3 L14.5 9.5 L21 12 L14.5 14.5 L12 21 L9.5 14.5 L3 12 L9.5 9.5 Z" />
    </svg>
  ),
  certification: (s = 12) => (
    <svg width={s} height={s} {...base}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9.6 9 L11.4 10.8 L14.6 7.4" />
      <path d="M8.5 13.8 L7 21 L12 18.5 L17 21 L15.5 13.8" />
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

/* ---------- Generated geometry ---------- */
/* Flowing contour lines, top-right (svg 400x260). Opacity falls off line by line. */
const WAVES = Array.from({ length: 12 }, (_, i) => {
  const y = 14 + i * 17;
  const amp = 16 + i * 1.6;
  return {
    d: `M0 ${y + 24} C70 ${y - amp} 130 ${y + amp + 14} 215 ${y + 6} S340 ${y - amp} 400 ${y - 10}`,
    o: +(0.34 - i * 0.024).toFixed(3),
  };
});

/* Halftone dots, bottom-right (svg 170x170): biggest in the corner, shrinking away from it */
const HALFTONE = Array.from({ length: 12 * 12 }, (_, n) => {
  const r = Math.floor(n / 12);
  const c = n % 12;
  const d = Math.hypot(11 - c, 11 - r) / 15.6;
  return { cx: c * 14 + 7, cy: r * 14 + 7, r: +(2.8 * (1 - d)).toFixed(2) };
}).filter((dot) => dot.r > 0.3);

/* ---------- Decorative pieces ---------- */
/* Brush-style enso: two open arcs with different dash gaps, so it reads as hand-drawn */
function Enso({ className }: { className: string }) {
  return (
    <svg className={`pointer-events-none absolute ${className}`} width="300" height="300" viewBox="-150 -150 300 300" fill="none" aria-hidden="true">
      <circle r="118" stroke={SAGE} strokeOpacity="0.1" strokeWidth="14" strokeLinecap="round" strokeDasharray="640 102" transform="rotate(-70)" />
      <circle r="118" stroke={SAGE} strokeOpacity="0.1" strokeWidth="5" strokeLinecap="round" strokeDasharray="610 132" transform="rotate(-62)" />
      <circle cx="104" cy="-62" r="4" fill={CLAY} fillOpacity="0.45" />
    </svg>
  );
}

function Dot({ size = 5, color = CLAY }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" className="shrink-0" aria-hidden="true">
      <circle cx="5" cy="5" r="4" fill={color} />
    </svg>
  );
}

/* Hairline circle with the icon inside, fixed size so it can't collapse */
function RingIcon({ icon, size = 24 }: { icon: ReactNode; size?: number }) {
  const c = size / 2;
  return (
    <span className="relative flex shrink-0 items-center justify-center text-[#53665c]" style={{ width: size, height: size }}>
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={c} cy={c} r={c - 1} fill="#fff" stroke={SAGE} strokeOpacity="0.45" strokeWidth="1" />
      </svg>
      <span className="relative">{icon}</span>
    </span>
  );
}

/* Solid-colour rule with a min width: no CSS gradients on flexible items */
function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <RingIcon icon={icon} />
      <h2 className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#53665c]">{children}</h2>
      <span className="h-px min-w-[8px] flex-1 bg-[#dce2de]" />
      <Dot size={5} />
    </div>
  );
}

function Rail({ children }: { children: ReactNode }) {
  return (
    <div className="relative border-l border-[#dce2de] pl-5">
      <svg width="9" height="9" viewBox="0 0 9 9" className="absolute -left-[4.5px] top-[3px]" aria-hidden="true">
        <circle cx="4.5" cy="4.5" r="3.4" fill="#fff" stroke={SAGE} strokeWidth="1" />
      </svg>
      {children}
    </div>
  );
}

export default function MinimalTemplate(props: ResumeTemplateDesignProps) {
  // Unique id so several templates can render on one page (e.g. a picker)
  const uid = useId().replace(/:/g, "");
  const initial = (props.resume.fullName || "Y").trim().charAt(0).toUpperCase();
  const contactItems = props.contact.length ? props.contact : ["Email", "Phone", "Location"];

  return (
    <article className="relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white px-[68px] pb-[70px] pt-[62px] text-[13px] leading-relaxed text-[#29342f] shadow-xl">
      {/* ===== Background ===== */}
      <svg className="pointer-events-none absolute right-0 top-[5px]" width="400" height="260" viewBox="0 0 400 260" fill="none" aria-hidden="true" data-id={uid}>
        {WAVES.map((w, i) => (
          <path key={i} d={w.d} stroke={SAGE} strokeOpacity={w.o} strokeWidth="1" />
        ))}
      </svg>

      <Enso className="-bottom-[110px] -left-[110px]" />

      <svg className="pointer-events-none absolute bottom-0 right-0" width="170" height="170" viewBox="0 0 170 170" aria-hidden="true">
        {HALFTONE.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={SAGE} fillOpacity="0.2" />
        ))}
      </svg>

      {/* Top bar: sage with a short clay segment */}
      <div className="absolute inset-x-0 top-0 flex h-[5px]">
        <span className="w-full bg-[#53665c]" />
        <span className="w-24 shrink-0 bg-[#c8a27a]" />
      </div>
      {/* Bottom bar */}
      <div className="absolute inset-x-0 bottom-0 flex h-[3px]">
        <span className="w-24 shrink-0 bg-[#c8a27a]" />
        <span className="w-full bg-[#53665c]" />
      </div>

      {/* ===== Content ===== */}
      <div className="relative">
        <header className="mb-10 pt-2">
          <div className="flex items-center gap-5">
            {/* Monogram: hairline ring with a small gap, like a stamp */}
            <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0" aria-hidden="true">
              <circle cx="32" cy="32" r="29" fill="none" stroke={SAGE} strokeWidth="1.2" strokeDasharray="170 12" strokeLinecap="round" transform="rotate(-80 32 32)" />
              <circle cx="32" cy="32" r="24" fill="none" stroke={MIST} strokeWidth="1" />
              <text x="32" y="41" textAnchor="middle" fontSize="26" fontWeight="300" fontFamily="Georgia, 'Times New Roman', serif" fill={SAGE}>
                {initial}
              </text>
            </svg>
            <div className="min-w-0 max-w-[420px]">
              <h1 className="break-words text-[38px] font-light leading-tight tracking-tight">
                {props.resume.fullName || "Your Name"}
              </h1>
              <p className="mt-1 text-base text-[#53665c]">{props.resume.jobTitle || "Professional Title"}</p>
            </div>
          </div>

          <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 break-words text-[10.5px] text-slate-500">
            {contactItems.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="text-[#53665c]">{contactIcon(item)}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-2" aria-hidden="true">
            <span className="h-[2px] w-10 bg-[#53665c]" />
            <span className="h-px min-w-[8px] flex-1 bg-[#dce2de]" />
          </div>
        </header>

        <section className="mb-9">
          <SectionTitle icon={Icons.profile()}>Profile</SectionTitle>
          <p className="whitespace-pre-wrap pl-1 text-slate-600">
            {props.resume.summary || "Add a concise professional summary."}
          </p>
        </section>

        <section className="mb-9">
          <SectionTitle icon={Icons.experience()}>Experience</SectionTitle>
          <Rail>{props.experienceEntries}</Rail>
        </section>

        <section className="mb-9">
          <SectionTitle icon={Icons.education()}>Education</SectionTitle>
          <Rail>{props.educationEntries}</Rail>
        </section>

        <div className="grid grid-cols-2 gap-10 pb-6">
          <section className="min-w-0">
            <SectionTitle icon={Icons.skills()}>Skills</SectionTitle>
            <ul className="flex flex-wrap gap-1.5">
              {props.skills.length ? (
                props.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-1.5 rounded-full border border-[#dce2de] bg-white/80 px-2.5 py-0.5 text-[11px] text-slate-600"
                  >
                    <Dot size={4} color={SAGE} />
                    {skill}
                  </li>
                ))
              ) : (
                <li className="text-slate-600">Add your skills</li>
              )}
            </ul>
          </section>

          {props.certifications.length > 0 && (
            <section className="min-w-0">
              <SectionTitle icon={Icons.certification()}>Certifications</SectionTitle>
              <ul className="space-y-2">
                {props.certifications.map((item) => (
                  <li key={item} className="flex items-start gap-2 break-words text-[12px] text-slate-600">
                    <span className="mt-[2px] shrink-0 text-[#c8a27a]">{Icons.certification(13)}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}