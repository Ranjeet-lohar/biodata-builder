import { useId } from "react";
import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const ROSE = "#946451";
const GOLD = "#c89a7c";
const CHAMPAGNE = "#e8c9ae";
const DEEP = "#6b4435";
const CREAM = "#fffdf9";

/* ---------- Icons (stroke-based, currentColor, no ids) ---------- */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const Icons = {
  profile: (s = 14) => (
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
  mail: (s = 12) => (
    <svg width={s} height={s} {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7 L12 13 L21 7" />
    </svg>
  ),
  phone: (s = 12) => (
    <svg width={s} height={s} {...base}>
      <path d="M5 4 H9 L11 9 L8.5 10.5 C9.6 12.8 11.2 14.4 13.5 15.5 L15 13 L20 15 V19 C20 19.6 19.6 20 19 20 C10.7 19.5 4.5 13.3 4 5 C4 4.4 4.4 4 5 4 Z" />
    </svg>
  ),
  pin: (s = 12) => (
    <svg width={s} height={s} {...base}>
      <path d="M12 21 C7 15 5 12 5 9 A7 7 0 0 1 19 9 C19 12 17 15 12 21 Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  globe: (s = 12) => (
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
/* Monogram ring ticks (svg is 96x96, centre 48,48) */
const TICKS = Array.from({ length: 36 }, (_, i) => {
  const a = (i * 10 * Math.PI) / 180;
  const r1 = i % 3 === 0 ? 36 : 39;
  const r2 = 42;
  return {
    x1: +(48 + r1 * Math.cos(a)).toFixed(2),
    y1: +(48 + r1 * Math.sin(a)).toFixed(2),
    x2: +(48 + r2 * Math.cos(a)).toFixed(2),
    y2: +(48 + r2 * Math.sin(a)).toFixed(2),
  };
});

/* Footer fan emblem: rays from the bottom centre (svg is 64x32) */
const FAN_RAYS = Array.from({ length: 9 }, (_, i) => {
  const a = Math.PI + (i * Math.PI) / 8;
  return { x: +(32 + 30 * Math.cos(a)).toFixed(2), y: +(32 + 30 * Math.sin(a)).toFixed(2) };
});

/* ---------- Decorative pieces ---------- */
function Diamond({ size = 8, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" className={`shrink-0 ${className}`} aria-hidden="true">
      <polygon points="5,0.5 9.5,5 5,9.5 0.5,5" fill={GOLD} />
    </svg>
  );
}

/* Fan-scallop pattern band that fades into the page. Flip with -scale-y-100 for the bottom edge. */
function FanBand({ className }: { className: string }) {
  const uid = useId().replace(/:/g, "");
  const fan = `elegant-fan-${uid}`;
  const fade = `elegant-fade-${uid}`;
  return (
    <svg className={`pointer-events-none absolute inset-x-0 h-[130px] w-full ${className}`} aria-hidden="true">
      <defs>
        <pattern id={fan} width="40" height="40" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={ROSE} strokeWidth="0.9" opacity="0.4">
            <path d="M0 20 A20 20 0 0 1 40 20" />
            <path d="M10 20 A10 10 0 0 1 30 20" />
            <path d="M-20 40 A20 20 0 0 1 20 40" />
            <path d="M20 40 A20 20 0 0 1 60 40" />
            <path d="M-10 40 A10 10 0 0 1 10 40" />
            <path d="M30 40 A10 10 0 0 1 50 40" />
          </g>
        </pattern>
        <linearGradient id={fade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CREAM} stopOpacity="0" />
          <stop offset="100%" stopColor={CREAM} stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${fan})`} />
      <rect width="100%" height="100%" fill={`url(#${fade})`} />
    </svg>
  );
}

/* Quarter-fan frame corner. Origin is the frame corner; mirror with scale utilities. */
function Corner({ className }: { className: string }) {
  return (
    <svg className={`pointer-events-none absolute ${className}`} width="46" height="46" viewBox="0 0 46 46" fill="none" aria-hidden="true">
      <path d="M0 0 H34 A34 34 0 0 1 0 34 Z" fill={CREAM} />
      <path d="M34 0 A34 34 0 0 1 0 34" stroke={ROSE} strokeWidth="1.3" />
      <g stroke={GOLD} strokeWidth="0.9">
        <path d="M12 0 A12 12 0 0 1 0 12" />
        <path d="M21 0 A21 21 0 0 1 0 21" />
        <path d="M28 0 A28 28 0 0 1 0 28" />
        <path d="M0 0 L26 26" />
        <path d="M0 0 L31 13" />
        <path d="M0 0 L13 31" />
      </g>
      <circle cx="3" cy="3" r="2" fill={ROSE} />
    </svg>
  );
}

function Flourish({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="110"
      height="12"
      viewBox="0 0 110 12"
      fill="none"
      className={flip ? "-scale-x-100" : ""}
      aria-hidden="true"
    >
      <path d="M0 6 H78" stroke={GOLD} strokeWidth="1" />
      <path d="M78 6 C86 6 88 1 94 1 C99 1 100 6 96 6 C93 6 93 3 95 3" stroke={ROSE} strokeWidth="1" strokeLinecap="round" />
      <polygon points="104,6 108,2 112,6 108,10" fill={ROSE} transform="translate(-4 0)" />
    </svg>
  );
}

function Medallion({ icon }: { icon: ReactNode }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c89a7c] to-[#946451] text-white shadow-sm ring-1 ring-[#c89a7c] ring-offset-2 ring-offset-[#fffdf9]">
      {icon}
    </span>
  );
}

function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Medallion icon={icon} />
      <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#946451]">{children}</h2>
      <span className="h-px flex-1 bg-gradient-to-r from-[#c89a7c] to-transparent" />
      <Diamond size={8} />
    </div>
  );
}

function Rule({ children }: { children: ReactNode }) {
  return (
    <div className="relative pl-5">
      <span className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-[#c89a7c] via-[#e6dcd3] to-transparent" />
      <Diamond size={9} className="absolute -left-[4px] top-0" />
      {children}
    </div>
  );
}

function Laurel() {
  const leaves = [
    { cx: 4.4, cy: 15.5, r: -30 },
    { cx: 3.6, cy: 11.5, r: -12 },
    { cx: 4.6, cy: 7.6, r: 12 },
    { cx: 7.2, cy: 4.8, r: 38 },
  ];
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" className="shrink-0 text-[#946451]" aria-hidden="true">
      {[false, true].map((mirror) => (
        <g key={String(mirror)} transform={mirror ? "translate(24 0) scale(-1 1)" : undefined}>
          <path d="M8 20 C3 16 2.5 8 7 3.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          {leaves.map((l, i) => (
            <ellipse
              key={i}
              cx={l.cx}
              cy={l.cy}
              rx="1.1"
              ry="2.3"
              transform={`rotate(${l.r} ${l.cx} ${l.cy})`}
              fill={GOLD}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
        </g>
      ))}
      <polygon points="12,8 13.2,10.8 16,11.2 14,13.2 14.5,16 12,14.6 9.5,16 10,13.2 8,11.2 10.8,10.8" fill={ROSE} />
    </svg>
  );
}

export default function ElegantTemplate(props: ResumeTemplateDesignProps) {
  // Unique ids so several templates can render on one page (e.g. a picker)
  const uid = useId().replace(/:/g, "");
  const ring = `elegant-ring-${uid}`;
  const initial = (props.resume.fullName || "Y").trim().charAt(0).toUpperCase();
  const contactItems = props.contact.length ? props.contact : ["Email", "Phone", "Location"];

  return (
    <article
      className="relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-[#fffdf9] px-[62px] py-[58px] text-[13px] leading-relaxed text-[#40342f] shadow-xl"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* ===== Background: fan bands, double frame, corners ===== */}
      <FanBand className="top-0" />
      <FanBand className="bottom-0 -scale-y-100" />

      <div className="pointer-events-none absolute inset-[16px] border border-[#d9b9a0]" />
      <div className="pointer-events-none absolute inset-[21px] border border-[#ece1d8]" />
      <Corner className="left-[16px] top-[16px]" />
      <Corner className="right-[16px] top-[16px] -scale-x-100" />
      <Corner className="bottom-[16px] left-[16px] -scale-y-100" />
      <Corner className="bottom-[16px] right-[16px] -scale-100" />

      {/* Footer emblem + strip */}
      <svg
        className="pointer-events-none absolute bottom-[26px] left-1/2 -translate-x-1/2"
        width="64"
        height="32"
        viewBox="0 0 64 32"
        fill="none"
        aria-hidden="true"
      >
        <g stroke={GOLD} strokeWidth="0.9">
          {FAN_RAYS.map((p, i) => (
            <line key={i} x1="32" y1="32" x2={p.x} y2={p.y} />
          ))}
          <path d="M18 32 A14 14 0 0 1 46 32" />
          <path d="M8 32 A24 24 0 0 1 56 32" />
        </g>
        <circle cx="32" cy="32" r="2.4" fill={ROSE} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#6b4435] via-[#c89a7c] to-[#e8c9ae]" />

      {/* ===== Content ===== */}
      <div className="relative">
        <header className="mb-8 text-center">
          {/* Monogram medallion */}
          <svg width="96" height="96" viewBox="0 0 96 96" className="mx-auto" aria-hidden="true">
            <defs>
              <linearGradient id={ring} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={CHAMPAGNE} />
                <stop offset="50%" stopColor={GOLD} />
                <stop offset="100%" stopColor={DEEP} />
              </linearGradient>
            </defs>
            <circle cx="48" cy="48" r="45" fill={CREAM} stroke={`url(#${ring})`} strokeWidth="1.8" />
            {TICKS.map((t, i) => (
              <line key={i} {...t} stroke={GOLD} strokeWidth="0.9" />
            ))}
            <circle cx="48" cy="48" r="32" fill="#faf1ea" stroke={`url(#${ring})`} strokeWidth="1" />
            <text
              x="48"
              y="60"
              textAnchor="middle"
              fontSize="34"
              fontStyle="italic"
              fontFamily="Georgia, 'Times New Roman', serif"
              fill={`url(#${ring})`}
            >
              {initial}
            </text>
          </svg>

          <div className="mt-4 flex items-center justify-center gap-3">
            <Flourish />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#946451]">Curriculum Vitae</p>
            <Flourish flip />
          </div>

          <h1 className="mt-3 break-words text-[36px] leading-tight tracking-wide">
            {props.resume.fullName || "Your Name"}
          </h1>
          <p className="mt-2 italic text-[#946451]">{props.resume.jobTitle || "Professional Title"}</p>

          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 break-words text-[10.5px] text-[#786a63]">
            {contactItems.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="text-[#c89a7c]">{contactIcon(item)}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Gradient divider with centre diamonds */}
          <div className="mx-auto mt-6 flex w-[360px] items-center gap-2" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#946451]" />
            <Diamond size={6} />
            <Diamond size={11} />
            <Diamond size={6} />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#946451]" />
          </div>
        </header>

        {/* Profile */}
        <section className="mx-auto mb-9 max-w-[580px] text-center">
          <div className="mb-3 flex flex-col items-center gap-2">
            <Medallion icon={Icons.profile()} />
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#946451]">Profile</h2>
          </div>
          <p className="whitespace-pre-wrap italic text-[#786a63]">
            {props.resume.summary || "Add a concise professional summary."}
          </p>
        </section>

        <section className="mb-8">
          <SectionTitle icon={Icons.experience()}>Experience</SectionTitle>
          <Rule>{props.experienceEntries}</Rule>
        </section>

        <section className="mb-8">
          <SectionTitle icon={Icons.education()}>Education</SectionTitle>
          <Rule>{props.educationEntries}</Rule>
        </section>

        <div className="grid grid-cols-2 gap-8 pb-10">
          <section>
            <SectionTitle icon={Icons.skills()}>Skills</SectionTitle>
            <ul className="flex flex-wrap gap-2">
              {props.skills.length ? (
                props.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-1.5 border border-[#d9b9a0] bg-gradient-to-b from-[#fffdf9] to-[#f8ede4] px-2.5 py-0.5 text-[11px] italic text-[#6b4435]"
                  >
                    <Diamond size={6} />
                    {skill}
                  </li>
                ))
              ) : (
                <li className="text-[#786a63]">Add your skills</li>
              )}
            </ul>
          </section>

          {props.certifications.length > 0 && (
            <section>
              <SectionTitle icon={Icons.certification()}>Certifications</SectionTitle>
              <ul className="space-y-2.5">
                {props.certifications.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 break-words text-[12px] text-[#786a63]">
                    <Laurel />
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