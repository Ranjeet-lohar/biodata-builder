import { useId } from "react";
import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const PURPLE = "#56366f";
const VIOLET = "#8052a0";
const CORAL = "#ff7a8a";
const SUN = "#ffc857";

const BLOB =
  "M44.7,-58.3C57.9,-48.6,68.3,-34.5,72.6,-18.7C76.9,-2.9,75.1,14.6,67.2,28.6C59.3,42.6,45.3,53.1,29.9,60.4C14.5,67.7,-2.3,71.8,-18.4,68.6C-34.5,65.4,-49.9,54.9,-60.1,41C-70.3,27.1,-75.3,9.8,-72.4,-5.9C-69.5,-21.6,-58.7,-35.7,-45.8,-45.5C-32.9,-55.3,-16.5,-60.8,0.3,-61.2C17,-61.6,31.5,-68,44.7,-58.3Z";

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
  about: (s = 14) => (
    <svg width={s} height={s} {...base}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21" />
    </svg>
  ),
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
  if (/(https?:\/\/|www\.|linkedin|github|behance|dribbble|\.com|\.in|\.org)/.test(t)) return Icons.globe();
  if (/^[+\d][\d\s().-]{6,}$/.test(text.trim())) return Icons.phone();
  return Icons.pin();
}

/* ---------- Decorative pieces ---------- */
function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 8" width="64" height="8" className={className} fill="none" aria-hidden="true">
      <path
        d="M1 4 Q5 0 9 4 T17 4 T25 4 T33 4 T41 4 T49 4 T57 4 T63 4"
        stroke={CORAL}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 -rotate-6 items-center justify-center rounded-xl bg-gradient-to-br from-[#8052a0] to-[#ff7a8a] text-white shadow-md shadow-[#8052a0]/25">
        {icon}
      </span>
      <div>
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#56366f]">{children}</h2>
        <Squiggle className="mt-0.5" />
      </div>
    </div>
  );
}

function Sparkle({ size = 10, color = SUN }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill={color} />
    </svg>
  );
}

export default function CreativeTemplate(props: ResumeTemplateDesignProps) {
  // Unique ids so several templates can render on one page (e.g. a picker)
  const uid = useId().replace(/:/g, "");
  const grad = `creative-grad-${uid}`;
  const dots = `creative-dots-${uid}`;
  const blobFill = `creative-blob-${uid}`;
  const bodyDots = `creative-body-dots-${uid}`;

  const contactItems = props.contact.length ? props.contact : ["Email", "Phone", "Location"];

  return (
    <article className="relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed shadow-xl">
      {/* ===== Body background: faint dot grid + blobs ===== */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id={bodyDots} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill={VIOLET} opacity="0.14" />
          </pattern>
          <linearGradient id={blobFill} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={VIOLET} stopOpacity="0.16" />
            <stop offset="100%" stopColor={CORAL} stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <rect x="0" y="330" width="794" height="793" fill={`url(#${bodyDots})`} />
        <g transform="translate(40 1060) scale(1.9)">
          <path d={BLOB} fill={`url(#${blobFill})`} />
        </g>
        <g transform="translate(790 640) scale(1.1)">
          <path d={BLOB} fill={`url(#${blobFill})`} />
        </g>
      </svg>

      {/* ===== Header ===== */}
      <header className="relative overflow-hidden px-12 pb-20 pt-12 text-white">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3e2358" />
              <stop offset="55%" stopColor={PURPLE} />
              <stop offset="100%" stopColor="#b2468f" />
            </linearGradient>
            <pattern id={dots} width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.8" fill="#fff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${grad})`} />

          {/* Halftone dot patch */}
          <rect x="470" y="24" width="190" height="120" fill={`url(#${dots})`} opacity="0.22" />

          {/* Overlapping blobs */}
          <g transform="translate(700 70) scale(2.1)">
            <path d={BLOB} fill="#ff7a8a" fillOpacity="0.28" />
          </g>
          <g transform="translate(610 150) scale(1.3) rotate(40)">
            <path d={BLOB} fill="#ffc857" fillOpacity="0.2" />
          </g>
          <g transform="translate(30 20) scale(1.1) rotate(-30)">
            <path d={BLOB} fill="#ffffff" fillOpacity="0.07" />
          </g>

          {/* Concentric rings */}
          <g fill="none" stroke="#fff" strokeOpacity="0.2">
            <circle cx="740" cy="60" r="60" />
            <circle cx="740" cy="60" r="90" />
          </g>
        </svg>

        {/* Floating sparkles and shapes */}
        <div className="pointer-events-none absolute right-[210px] top-[34px]"><Sparkle size={18} /></div>
        <div className="pointer-events-none absolute right-[90px] top-[150px]"><Sparkle size={11} color="#fff" /></div>
        <svg className="pointer-events-none absolute right-[330px] top-[100px]" width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
          <path d="M4 4 L26 26 M26 4 L4 26" stroke={SUN} strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
        </svg>
        <svg className="pointer-events-none absolute bottom-[70px] right-[130px]" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
          <circle cx="13" cy="13" r="9" stroke="#fff" strokeWidth="2.4" opacity="0.5" />
        </svg>

        {/* Wavy bottom edge */}
        <svg
          className="pointer-events-none absolute bottom-[-1px] left-0 h-[44px] w-full"
          viewBox="0 0 794 44"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 26 C100 0 200 52 330 26 S560 0 680 24 S760 34 794 20 V44 H0 Z"
            fill="#ffffff"
          />
          <path
            d="M0 26 C100 0 200 52 330 26 S560 0 680 24 S760 34 794 20"
            fill="none"
            stroke={CORAL}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative">
          <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-purple-100">
            <Sparkle size={11} />
            Creative Portfolio
          </p>
          <h1 className="mt-3 break-words text-[40px] font-extrabold leading-tight">
            {props.resume.fullName || "Your Name"}
          </h1>
          <p className="mt-1 text-lg text-purple-100">{props.resume.jobTitle || "Professional Title"}</p>
          <Squiggle className="mt-3" />

          <ul className="mt-5 flex flex-wrap gap-2 text-[10.5px]">
            {contactItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 break-words rounded-full border border-white/30 bg-white/10 px-3 py-1 text-white/95"
              >
                <span className="text-[#ffc857]">{contactIcon(item)}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ===== Body ===== */}
      <div className="relative grid grid-cols-[1fr_220px] gap-9 px-12 pb-14 pt-4">
        <div className="min-w-0">
          {/* About card */}
          <section className="relative mb-8 overflow-hidden rounded-2xl border border-[#eadff2] bg-gradient-to-br from-[#f7f3fa] to-[#fff4f5] px-5 py-4">
            <svg className="pointer-events-none absolute -right-6 -top-6" width="90" height="90" viewBox="0 0 90 90" fill="none" aria-hidden="true">
              <circle cx="45" cy="45" r="30" stroke={VIOLET} strokeOpacity="0.15" />
              <circle cx="45" cy="45" r="44" stroke={VIOLET} strokeOpacity="0.1" />
            </svg>
            <svg className="pointer-events-none absolute bottom-2 right-4 opacity-[0.16]" width="30" height="22" viewBox="0 0 26 20" aria-hidden="true">
              <path d="M0 20 V10 C0 4 3 1 9 0 V4 C6 5 5 7 5 9 H9 V20 Z" fill={VIOLET} />
              <path d="M15 20 V10 C15 4 18 1 24 0 V4 C21 5 20 7 20 9 H24 V20 Z" fill={VIOLET} />
            </svg>
            <div className="relative">
              <SectionTitle icon={Icons.about()}>About Me</SectionTitle>
              <p className="whitespace-pre-wrap pr-8 text-slate-600">
                {props.resume.summary || "Add a concise professional summary."}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <SectionTitle icon={Icons.experience()}>Experience</SectionTitle>
            <div className="relative border-l-2 border-dashed border-[#d9c7e6] pl-5">
              <svg width="14" height="14" viewBox="0 0 14 14" className="absolute -left-[8px] -top-[2px]" aria-hidden="true">
                <circle cx="7" cy="7" r="6" fill="#fff" stroke={CORAL} strokeWidth="2" />
                <circle cx="7" cy="7" r="2.4" fill={CORAL} />
              </svg>
              {props.experienceEntries}
            </div>
          </section>

          <section>
            <SectionTitle icon={Icons.education()}>Education</SectionTitle>
            <div className="relative border-l-2 border-dashed border-[#d9c7e6] pl-5">
              <svg width="14" height="14" viewBox="0 0 14 14" className="absolute -left-[8px] -top-[2px]" aria-hidden="true">
                <circle cx="7" cy="7" r="6" fill="#fff" stroke={SUN} strokeWidth="2" />
                <circle cx="7" cy="7" r="2.4" fill={SUN} />
              </svg>
              {props.educationEntries}
            </div>
          </section>
        </div>

        {/* ===== Sidebar ===== */}
        <aside className="relative self-start overflow-hidden rounded-2xl border border-[#eadff2] bg-gradient-to-b from-[#f7f3fa] to-white p-5">
          <svg className="pointer-events-none absolute -bottom-12 -left-12 opacity-80" width="150" height="150" viewBox="-100 -100 200 200" aria-hidden="true">
            <path d={BLOB} fill={VIOLET} fillOpacity="0.07" />
          </svg>

          <div className="relative">
            <section className="mb-8">
              <SectionTitle icon={Icons.skills()}>Skills</SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {props.skills.length ? (
                  props.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#f0e8f6] to-[#ffe9ec] px-2.5 py-1 text-[10px] font-medium text-[#56366f] ring-1 ring-[#e4d6ee]"
                    >
                      <Sparkle size={8} color={CORAL} />
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-slate-500">Add your skills</span>
                )}
              </div>
            </section>

            {props.certifications.length > 0 && (
              <section>
                <SectionTitle icon={Icons.certification()}>Certifications</SectionTitle>
                <ul className="space-y-2.5">
                  {props.certifications.map((item) => (
                    <li
                      key={item}
                      className="relative flex items-stretch overflow-hidden rounded-lg border border-[#e4d6ee] bg-white text-[11px] text-slate-600"
                    >
                      {/* Ticket stub */}
                      <span className="flex w-9 shrink-0 items-center justify-center bg-gradient-to-b from-[#8052a0] to-[#ff7a8a] text-white">
                        {Icons.certification(14)}
                      </span>
                      <span className="w-0 border-l-2 border-dashed border-[#e4d6ee]" />
                      <span className="break-words px-2.5 py-2">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </aside>
      </div>

      {/* ===== Footer strip ===== */}
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#3e2358] via-[#8052a0] to-[#ff7a8a]" />
    </article>
  );
}