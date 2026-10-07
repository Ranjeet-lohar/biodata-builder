import { useId } from "react";
import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const INK = "#232a32";
const GOLD = "#b58b45";
const LIGHT = "#d9b775";
const PALE = "#f1dcae";
const DEEP = "#8a6428";

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
      <path d="M4 6 H20" />
      <path d="M4 11 H20" />
      <path d="M4 16 H14" />
    </svg>
  ),
  career: (s = 13) => (
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
  target: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2 V5 M12 19 V22 M2 12 H5 M19 12 H22" />
    </svg>
  ),
  shield: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <path d="M12 3 L20 6 V12 C20 16.5 16.5 19.8 12 21 C7.5 19.8 4 16.5 4 12 V6 Z" />
      <path d="M8.5 12 L11 14.5 L15.5 9.5" />
    </svg>
  ),
  chevron: (s = 10) => (
    <svg width={s} height={s} {...base} strokeWidth={2.4}>
      <path d="M8 5 L15 12 L8 19" />
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

/* ---------- Generated geometry ---------- */
/* Topographic contour rings (svg 235x320, centre 200,40) */
const CONTOURS = Array.from({ length: 11 }, (_, i) => ({
  rx: 24 + i * 24,
  o: +(0.22 - i * 0.017).toFixed(3),
}));

/* Skyline buildings (svg 235x130) */
const SKYLINE = [
  { x: 0, w: 22, h: 40 },
  { x: 22, w: 18, h: 70 },
  { x: 40, w: 26, h: 52 },
  { x: 66, w: 16, h: 96 },
  { x: 82, w: 24, h: 62 },
  { x: 106, w: 20, h: 112 },
  { x: 126, w: 28, h: 58 },
  { x: 154, w: 18, h: 84 },
  { x: 172, w: 24, h: 48 },
  { x: 196, w: 39, h: 66 },
];

/* Growth bars (svg 170x110) */
const BARS = [24, 36, 30, 52, 68, 90].map((h, i) => ({ x: 6 + i * 26, h }));
const TREND = BARS.map((b) => `${b.x + 8},${100 - b.h - 9}`).join(" ");
const LAST = BARS[BARS.length - 1];

/* ---------- Decorative pieces ---------- */
function Tile({ icon }: { icon: ReactNode }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[3px] bg-gradient-to-br from-[#f1dcae] via-[#d9b775] to-[#8a6428] text-[#232a32] shadow-sm">
      {icon}
    </span>
  );
}

function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Tile icon={icon} />
      <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6428]">{children}</h2>
      <span className="h-px flex-1 bg-gradient-to-r from-[#b58b45]/70 via-[#e4e1db] to-transparent" />
    </div>
  );
}

function SidebarTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-[#d9b775]">
      {icon}
      <h2 className="text-[10px] font-bold uppercase tracking-[0.18em]">{children}</h2>
      <span className="h-px flex-1 bg-gradient-to-r from-[#d9b775]/50 to-transparent" />
    </div>
  );
}

function Rail({ children }: { children: ReactNode }) {
  return (
    <div className="relative pl-5">
      <span className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-[#b58b45] via-[#e4e1db] to-transparent" />
      <svg width="11" height="11" viewBox="0 0 11 11" className="absolute -left-[5px] top-0" aria-hidden="true">
        <rect x="0.8" y="0.8" width="9.4" height="9.4" fill="#fff" stroke={GOLD} strokeWidth="1.2" />
        <rect x="3.4" y="3.4" width="4.2" height="4.2" fill={GOLD} />
      </svg>
      {children}
    </div>
  );
}

export default function ExecutiveTemplate(props: ResumeTemplateDesignProps) {
  // Unique ids so several templates can render on one page (e.g. a picker)
  const uid = useId().replace(/:/g, "");
  const brass = `exec-brass-${uid}`;
  const sky = `exec-sky-${uid}`;
  const win = `exec-win-${uid}`;
  const bar = `exec-bar-${uid}`;
  const grid = `exec-grid-${uid}`;
  const gridFade = `exec-grid-fade-${uid}`;

  const initial = (props.resume.fullName || "Y").trim().charAt(0).toUpperCase();
  const contactItems = props.contact.length ? props.contact : ["Email", "Phone", "Location"];

  return (
    <article className="relative mx-auto flex min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed shadow-xl">
      {/* ===== Sidebar ===== */}
      <aside className="relative w-[235px] shrink-0 overflow-hidden bg-gradient-to-b from-[#1b2128] via-[#232a32] to-[#2d3742] px-7 pb-40 pt-10 text-white">
        {/* Contour lines, top-right */}
        <svg className="pointer-events-none absolute right-0 top-0" width="235" height="320" viewBox="0 0 235 320" fill="none" aria-hidden="true">
          <g transform="rotate(-25 200 40)">
            {CONTOURS.map((c, i) => (
              <ellipse key={i} cx="200" cy="40" rx={c.rx} ry={+(c.rx * 0.72).toFixed(1)} stroke={LIGHT} strokeOpacity={c.o} />
            ))}
          </g>
        </svg>

        {/* Skyline, bottom */}
        <svg className="pointer-events-none absolute bottom-0 left-0" width="235" height="130" viewBox="0 0 235 130" aria-hidden="true">
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LIGHT} stopOpacity="0.3" />
              <stop offset="100%" stopColor={LIGHT} stopOpacity="0.05" />
            </linearGradient>
            <pattern id={win} width="8" height="10" patternUnits="userSpaceOnUse">
              <rect x="2.5" y="3" width="2.5" height="3.5" fill={PALE} fillOpacity="0.45" />
            </pattern>
          </defs>
          {SKYLINE.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={130 - b.h} width={b.w} height={b.h} fill={`url(#${sky})`} />
              <rect x={b.x} y={130 - b.h + 4} width={b.w} height={b.h - 4} fill={`url(#${win})`} />
              <line x1={b.x} y1={130 - b.h} x2={b.x + b.w} y2={130 - b.h} stroke={LIGHT} strokeOpacity="0.5" strokeWidth="1" />
            </g>
          ))}
          <line x1="116" y1="18" x2="116" y2="5" stroke={LIGHT} strokeOpacity="0.6" strokeWidth="1" />
          <circle cx="116" cy="4" r="1.6" fill={PALE} />
        </svg>

        <div className="relative">
          {/* Monogram with corner brackets */}
          <svg width="60" height="60" viewBox="0 0 60 60" className="mb-8" aria-hidden="true">
            <defs>
              <linearGradient id={brass} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={PALE} />
                <stop offset="50%" stopColor={LIGHT} />
                <stop offset="100%" stopColor={DEEP} />
              </linearGradient>
            </defs>
            <rect x="5" y="5" width="50" height="50" fill="#fff" fillOpacity="0.04" stroke={`url(#${brass})`} strokeWidth="1" />
            <g stroke={`url(#${brass})`} strokeWidth="2.2" fill="none">
              <path d="M0 12 V0 H12" />
              <path d="M48 0 H60 V12" />
              <path d="M60 48 V60 H48" />
              <path d="M12 60 H0 V48" />
            </g>
            <text x="30" y="41" textAnchor="middle" fontSize="28" fontFamily="Georgia, 'Times New Roman', serif" fill={`url(#${brass})`}>
              {initial}
            </text>
          </svg>

          <SidebarTitle icon={Icons.mail(13)}>Contact</SidebarTitle>
          <ul className="mb-9 space-y-3 break-words text-[11px] text-slate-200">
            {contactItems.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border border-[#d9b775]/40 bg-white/5 text-[#d9b775]">
                  {contactIcon(item)}
                </span>
                <span className="pt-[1px]">{item}</span>
              </li>
            ))}
          </ul>

          <SidebarTitle icon={Icons.target()}>Expertise</SidebarTitle>
          <ul className="space-y-2 text-[11px] text-slate-100">
            {props.skills.length ? (
              props.skills.map((skill) => (
                <li key={skill} className="flex items-start gap-2 border-b border-white/10 pb-2">
                  <span className="mt-[2px] shrink-0 text-[#d9b775]">{Icons.chevron()}</span>
                  <span>{skill}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-300">Add your skills</li>
            )}
          </ul>

          {props.certifications.length > 0 && (
            <div className="mt-9">
              <SidebarTitle icon={Icons.shield()}>Credentials</SidebarTitle>
              <ul className="space-y-2.5 text-[11px] text-slate-200">
                {props.certifications.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 break-words">
                    <span className="mt-[1px] shrink-0 text-[#d9b775]">{Icons.shield(14)}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* ===== Main ===== */}
      <div className="relative min-w-0 flex-1 px-9 pb-14 pt-12">
        {/* Top brass bar */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#8a6428] via-[#d9b775] to-[#f1dcae]" />

        {/* Blueprint grid + growth bars, top-right */}
        <svg className="pointer-events-none absolute right-0 top-0" width="300" height="200" viewBox="0 0 300 200" aria-hidden="true">
          <defs>
            <pattern id={grid} width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M16 0 V16 M0 16 H16" fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.28" />
            </pattern>
            <radialGradient id={gridFade} gradientUnits="userSpaceOnUse" cx="300" cy="0" r="270">
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="100%" stopColor="#fff" stopOpacity="1" />
            </radialGradient>
            <linearGradient id={bar} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LIGHT} stopOpacity="0.85" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" fill={`url(#${grid})`} />
          <rect width="300" height="200" fill={`url(#${gridFade})`} />

          <g transform="translate(118 62)">
            <line x1="0" y1="100" x2="170" y2="100" stroke={GOLD} strokeOpacity="0.5" />
            {BARS.map((b, i) => (
              <rect key={i} x={b.x} y={100 - b.h} width="16" height={b.h} fill={`url(#${bar})`} />
            ))}
            <polyline points={TREND} fill="none" stroke={DEEP} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            {BARS.map((b, i) => (
              <circle key={i} cx={b.x + 8} cy={100 - b.h - 9} r="2" fill="#fff" stroke={DEEP} strokeWidth="1.2" />
            ))}
            <circle cx={LAST.x + 8} cy={100 - LAST.h - 9} r="5" fill="none" stroke={GOLD} strokeOpacity="0.5" />
          </g>
        </svg>

        <header className="relative mb-8 pb-7">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-8 bg-gradient-to-r from-[#8a6428] to-[#d9b775]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b58b45]">Executive Profile</p>
          </div>
          <h1 className="mt-3 max-w-[340px] break-words text-[34px] font-bold leading-tight text-[#232a32]">
            {props.resume.fullName || "Your Name"}
          </h1>
          <p className="mt-2 max-w-[340px] text-lg text-slate-600">{props.resume.jobTitle || "Professional Title"}</p>

          {/* Brass rule with a heavy segment */}
          <div className="absolute inset-x-0 bottom-0 flex items-center">
            <span className="h-[3px] w-24 bg-gradient-to-r from-[#8a6428] to-[#d9b775]" />
            <span className="h-px flex-1 bg-gradient-to-r from-[#d9b775] via-[#e4e1db] to-transparent" />
          </div>
        </header>

        {/* Summary card */}
        <section className="relative mb-8 overflow-hidden bg-[#faf7f0] py-4 pl-6 pr-5">
          <span className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#f1dcae] via-[#b58b45] to-[#8a6428]" />
          <svg className="pointer-events-none absolute right-2 top-2" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M0 8 V0 H8" stroke={GOLD} strokeWidth="1.4" transform="translate(14 0) scale(-1 1)" />
            {/* <path d="M14 22 H22 V14" stroke={GOLD} strokeWidth="1.4" /> */}
          </svg>
          <SectionTitle icon={Icons.summary()}>Summary</SectionTitle>
          <p className="whitespace-pre-wrap pr-4 text-slate-600">
            {props.resume.summary || "Add a concise professional summary."}
          </p>
        </section>

        <section className="mb-8">
          <SectionTitle icon={Icons.career()}>Career History</SectionTitle>
          <Rail>{props.experienceEntries}</Rail>
        </section>

        <section>
          <SectionTitle icon={Icons.education()}>Education</SectionTitle>
          <Rail>{props.educationEntries}</Rail>
        </section>
      </div>

      {/* ===== Footer strip ===== */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#1b2128] via-[#8a6428] to-[#f1dcae]" />
    </article>
  );
}