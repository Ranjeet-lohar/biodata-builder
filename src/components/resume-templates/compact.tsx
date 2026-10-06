import { useId } from "react";
import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const BLUE = "#315a77";
const DEEP = "#1d3b52";
const AMBER = "#f2b441";

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
  summary: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <path d="M4 5 H20" />
      <path d="M4 10 H20" />
      <path d="M4 15 H14" />
      <path d="M4 20 H10" />
    </svg>
  ),
  experience: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7 V5 A1.5 1.5 0 0 1 10.5 3.5 H13.5 A1.5 1.5 0 0 1 15 5 V7" />
      <path d="M3 13 H21" />
    </svg>
  ),
  education: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <path d="M2 9 L12 4 L22 9 L12 14 Z" />
      <path d="M6 11.5 V16 C6 17.5 9 19 12 19 C15 19 18 17.5 18 16 V11.5" />
      <path d="M22 9 V15" />
    </svg>
  ),
  skills: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <path d="M8 8 L3 12 L8 16" />
      <path d="M16 8 L21 12 L16 16" />
      <path d="M13.5 5 L10.5 19" />
    </svg>
  ),
  certification: (s = 13) => (
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
  if (/(https?:\/\/|www\.|linkedin|github|\.com|\.in|\.org)/.test(t)) return Icons.globe();
  if (/^[+\d][\d\s().-]{6,}$/.test(text.trim())) return Icons.phone();
  return Icons.pin();
}

/* ---------- Decorative pieces ---------- */
function HexBadge({ icon }: { icon: ReactNode }) {
  return (
    <span className="relative flex h-7 w-7 shrink-0 items-center justify-center text-white">
      <svg className="absolute inset-0" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
        <polygon points="12,1.5 21,6.75 21,17.25 12,22.5 3,17.25 3,6.75" fill={BLUE} />
        <polygon
          points="12,3.8 19,7.9 19,16.1 12,20.2 5,16.1 5,7.9"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.35"
          strokeWidth="0.6"
        />
      </svg>
      <span className="relative">{icon}</span>
    </span>
  );
}

function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <HexBadge icon={icon} />
      <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#315a77]">{children}</h2>
      <span className="h-[2px] flex-1 rounded-full bg-gradient-to-r from-[#315a77]/50 via-[#dbe4ea] to-transparent" />
    </div>
  );
}

function HexBullet() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" className="mt-[3px] shrink-0" aria-hidden="true">
      <polygon points="12,1.5 21,6.75 21,17.25 12,22.5 3,17.25 3,6.75" fill={AMBER} />
    </svg>
  );
}

export default function CompactTemplate(props: ResumeTemplateDesignProps) {
  // Unique ids so several templates can render on one page (e.g. a picker)
  const uid = useId().replace(/:/g, "");
  const hex = `compact-hex-${uid}`;
  const banner = `compact-banner-${uid}`;
  const glow = `compact-glow-${uid}`;

  return (
    <article className="relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[12px] leading-snug text-[#273747] shadow-xl">
      {/* ===== Header banner ===== */}
      <header className="relative px-10 pb-12 pt-9 text-white">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id={banner} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={DEEP} />
              <stop offset="60%" stopColor={BLUE} />
              <stop offset="100%" stopColor="#4a86aa" />
            </linearGradient>
            <radialGradient id={glow} cx="0.9" cy="0.1" r="0.6">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <pattern id={hex} width="28" height="49" patternUnits="userSpaceOnUse">
              <path
                fill="#ffffff"
                fillOpacity="0.14"
                fillRule="evenodd"
                d="M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${banner})`} />
          <rect width="100%" height="100%" fill={`url(#${hex})`} />
          <rect width="100%" height="100%" fill={`url(#${glow})`} />
        </svg>

        {/* Slanted bottom edge */}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 h-[22px] w-full"
          viewBox="0 0 794 22"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="0,22 794,0 794,22" fill="#ffffff" />
          <polyline points="0,22 794,0" fill="none" stroke={AMBER} strokeWidth="2" />
        </svg>

        <div className="relative">
          <h1 className="break-words text-[34px] font-bold leading-tight">{props.resume.fullName || "Your Name"}</h1>
          <p className="mt-1 text-base text-[#cfe3f0]">{props.resume.jobTitle || "Professional Title"}</p>
          <div className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-[#f2b441] to-[#f7d58a]" />

          <ul className="mt-4 flex flex-wrap gap-2 text-[10px]">
            {(props.contact.length ? props.contact : ["Email", "Phone", "Location"]).map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 break-words rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-white/90"
              >
                <span className="text-[#f2b441]">{contactIcon(item)}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ===== Body ===== */}
      <div className="relative px-10 pb-12 pt-2">
        <section className="relative mb-6 rounded-r-lg border-l-4 border-[#f2b441] bg-gradient-to-r from-[#f1f6f9] to-white py-3 pl-4 pr-5">
          <svg
            className="absolute right-3 top-2 opacity-20"
            width="26"
            height="20"
            viewBox="0 0 26 20"
            aria-hidden="true"
          >
            <path d="M0 20 V10 C0 4 3 1 9 0 V4 C6 5 5 7 5 9 H9 V20 Z" fill={BLUE} />
            <path d="M15 20 V10 C15 4 18 1 24 0 V4 C21 5 20 7 20 9 H24 V20 Z" fill={BLUE} />
          </svg>
          <h2 className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#315a77]">Summary</h2>
          <p className="pr-6 text-slate-600">{props.resume.summary || "Add a concise professional summary."}</p>
        </section>

        <div className="grid grid-cols-[1.45fr_0.85fr] gap-7">
          <section>
            <SectionTitle icon={Icons.experience()}>Experience</SectionTitle>
            {/* Timeline rail with a node at the top */}
            <div className="relative border-l-2 border-dashed border-[#c5d5e0] pl-4">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                className="absolute -left-[7px] -top-[2px]"
                aria-hidden="true"
              >
                <circle cx="6" cy="6" r="5" fill="#fff" stroke={AMBER} strokeWidth="1.8" />
                <circle cx="6" cy="6" r="2" fill={AMBER} />
              </svg>
              {props.experienceEntries}
            </div>
          </section>

          <aside className="relative overflow-hidden rounded-lg border border-[#dbe4ea] bg-gradient-to-b from-[#f1f6f9] to-white p-4">
            {/* Faint arcs in the card corner */}
            <svg
              className="pointer-events-none absolute -bottom-10 -right-10"
              width="140"
              height="140"
              viewBox="0 0 140 140"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="100" cy="100" r="30" stroke={BLUE} strokeOpacity="0.14" />
              <circle cx="100" cy="100" r="50" stroke={BLUE} strokeOpacity="0.1" />
              <circle cx="100" cy="100" r="70" stroke={BLUE} strokeOpacity="0.06" />
            </svg>

            <div className="relative">
              <section className="mb-6">
                <SectionTitle icon={Icons.education()}>Education</SectionTitle>
                {props.educationEntries}
              </section>

              <section className="mb-6">
                <SectionTitle icon={Icons.skills()}>Skills</SectionTitle>
                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  {props.skills.length ? (
                    props.skills.map((skill) => (
                      <li key={skill} className="flex items-start gap-2">
                        <HexBullet />
                        <span>{skill}</span>
                      </li>
                    ))
                  ) : (
                    <li>Add your skills</li>
                  )}
                </ul>
              </section>

              {props.certifications.length > 0 && (
                <section>
                  <SectionTitle icon={Icons.certification()}>Certifications</SectionTitle>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    {props.certifications.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-[1px] shrink-0 text-[#315a77]">{Icons.certification(11)}</span>
                        <span className="break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ===== Footer gradient strip ===== */}
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#1d3b52] via-[#315a77] to-[#f2b441]" />
    </article>
  );
}