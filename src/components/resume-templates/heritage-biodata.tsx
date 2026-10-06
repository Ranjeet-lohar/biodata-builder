import { useId } from "react";
import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const MAROON = "#8b2635";
const DEEP = "#54232b";
const GOLD = "#b3843f";
const SAND = "#d9c5a3";
const CREAM = "#fbf5e9";

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
  profile: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21" />
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
  skills: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <path d="M12 3 L14.5 9.5 L21 12 L14.5 14.5 L12 21 L9.5 14.5 L3 12 L9.5 9.5 Z" />
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

/* ---------- Generated geometry ---------- */
/* Mandala watermark: rings of petals around the centre (svg viewBox -320 -320 640 640) */
const MANDALA_RINGS = [
  { n: 24, R: 286, rx: 10, ry: 34 },
  { n: 16, R: 226, rx: 14, ry: 42 },
  { n: 12, R: 162, rx: 16, ry: 46 },
  { n: 8, R: 102, rx: 14, ry: 38 },
];
const MANDALA = MANDALA_RINGS.flatMap((r) =>
  Array.from({ length: r.n }, (_, i) => ({ ...r, a: +((i * 360) / r.n).toFixed(2) })),
);

/* Small 8-petal rosette for the footer (svg 44x44, centre 22,22) */
const ROSETTE = Array.from({ length: 8 }, (_, i) => i * 45);

/* ---------- Decorative pieces ---------- */
/* Five-petal lotus. Sits on the baseline y=0, grows upward. */
function Lotus({ width = 52, className = "" }: { width?: number; className?: string }) {
  const petals = [
    { r: -70, s: 0.72 },
    { r: -36, s: 0.9 },
    { r: 36, s: 0.9 },
    { r: 70, s: 0.72 },
    { r: 0, s: 1 },
  ];
  return (
    <svg
      width={width}
      height={width * 0.5}
      viewBox="-26 -23 52 26"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {petals.map((p, i) => (
        <path
          key={i}
          d="M0 0 C-6 -6 -6 -15 0 -21 C6 -15 6 -6 0 0 Z"
          transform={`rotate(${p.r}) scale(${p.s})`}
          fill={i === 4 ? MAROON : GOLD}
          fillOpacity={i === 4 ? 0.9 : 0.35}
          stroke={MAROON}
          strokeWidth="0.9"
        />
      ))}
      <path d="M-14 1.5 H14" stroke={GOLD} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function Diamond({ size = 8, color = GOLD, className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" className={`shrink-0 ${className}`} aria-hidden="true">
      <polygon points="5,0.5 9.5,5 5,9.5 0.5,5" fill={color} />
    </svg>
  );
}

/* Jali lattice band that fades into the page. Flip with -scale-y-100 for the bottom edge. */
function JaliBand({ className }: { className: string }) {
  const uid = useId().replace(/:/g, "");
  const jali = `heritage-jali-${uid}`;
  const fade = `heritage-fade-${uid}`;
  return (
    <svg className={`pointer-events-none absolute inset-x-0 h-[150px] w-full ${className}`} aria-hidden="true">
      <defs>
        <pattern id={jali} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M12 1 L23 12 L12 23 L1 12 Z" fill="none" stroke={MAROON} strokeWidth="0.8" opacity="0.35" />
          <path d="M12 7 L17 12 L12 17 L7 12 Z" fill="none" stroke={GOLD} strokeWidth="0.7" opacity="0.5" />
          <circle cx="12" cy="12" r="1.2" fill={MAROON} opacity="0.4" />
        </pattern>
        <linearGradient id={fade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CREAM} stopOpacity="0" />
          <stop offset="100%" stopColor={CREAM} stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${jali})`} />
      <rect width="100%" height="100%" fill={`url(#${fade})`} />
    </svg>
  );
}

/* Quarter-arc frame corner with a petal on the diagonal. Mirror with scale utilities. */
function Corner({ className }: { className: string }) {
  return (
    <svg className={`pointer-events-none absolute ${className}`} width="58" height="58" viewBox="0 0 58 58" fill="none" aria-hidden="true">
      <path d="M0 0 H44 A44 44 0 0 1 0 44 Z" fill={CREAM} />
      <path d="M44 0 A44 44 0 0 1 0 44" stroke={MAROON} strokeWidth="1.3" />
      <g stroke={GOLD} strokeWidth="0.9">
        <path d="M14 0 A14 14 0 0 1 0 14" />
        <path d="M28 0 A28 28 0 0 1 0 28" />
        <path d="M36 0 A36 36 0 0 1 0 36" />
      </g>
      <ellipse cx="17" cy="17" rx="3.2" ry="9" transform="rotate(-45 17 17)" fill={GOLD} fillOpacity="0.35" stroke={MAROON} strokeWidth="0.9" />
      <circle cx="3" cy="3" r="2.2" fill={MAROON} />
      <circle cx="30" cy="30" r="1.5" fill={MAROON} />
    </svg>
  );
}

/* Short vine flourish. Mirror with -scale-x-100. */
function Vine({ flip = false }: { flip?: boolean }) {
  return (
    <svg width="92" height="14" viewBox="0 0 92 14" fill="none" className={`shrink-0 ${flip ? "-scale-x-100" : ""}`} aria-hidden="true">
      <path d="M0 7 H58" stroke={GOLD} strokeWidth="1" />
      <path d="M58 7 C66 7 68 1.5 74 1.5 C79 1.5 80 7 76 7 C73 7 73 4 75 4" stroke={MAROON} strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="64" cy="11" rx="2.2" ry="1.2" transform="rotate(25 64 11)" fill={GOLD} fillOpacity="0.6" />
      <polygon points="84,7 88,3 92,7 88,11" fill={MAROON} />
    </svg>
  );
}

/* Diamond-shaped icon badge, drawn in SVG at a fixed size so it can't collapse */
function DiamondBadge({ icon, size = 30 }: { icon: ReactNode; size?: number }) {
  const h = size / 2;
  return (
    <span className="relative flex shrink-0 items-center justify-center text-[#fbf5e9]" style={{ width: size, height: size }}>
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <polygon points={`${h},1 ${size - 1},${h} ${h},${size - 1} 1,${h}`} fill={MAROON} />
        <polygon
          points={`${h},${size * 0.16} ${size * 0.84},${h} ${h},${size * 0.84} ${size * 0.16},${h}`}
          fill="none"
          stroke={SAND}
          strokeOpacity="0.7"
          strokeWidth="0.8"
        />
      </svg>
      <span className="relative">{icon}</span>
    </span>
  );
}

/* Solid-colour rules with a min width: no CSS gradients on flexible items */
function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-px min-w-[12px] flex-1 bg-[#d9c5a3]" />
      <Diamond size={7} />
      <DiamondBadge icon={icon} />
      <h2 className="shrink-0 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b2635]">{children}</h2>
      <Diamond size={7} />
      <span className="h-px min-w-[12px] flex-1 bg-[#d9c5a3]" />
    </div>
  );
}

function SubTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <DiamondBadge icon={icon} size={26} />
      <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8b2635]">{children}</h2>
      <span className="h-px min-w-[8px] flex-1 bg-[#d9c5a3]" />
    </div>
  );
}

function Rail({ children }: { children: ReactNode }) {
  return (
    <div className="relative border-l border-[#d9c5a3] pl-5">
      <Diamond size={9} color={MAROON} className="absolute -left-[4.5px] top-0" />
      {children}
    </div>
  );
}

function Seal() {
  return (
    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center text-[#8b2635]">
      <svg className="absolute inset-0" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="15" stroke={GOLD} strokeWidth="1" strokeDasharray="2 2.5" />
        <circle cx="16" cy="16" r="12" fill={GOLD} fillOpacity="0.16" stroke={MAROON} strokeOpacity="0.5" strokeWidth="0.8" />
      </svg>
      <span className="relative">{Icons.certification(14)}</span>
    </span>
  );
}

export default function HeritageBiodataTemplate(props: ResumeTemplateDesignProps) {
  // Unique ids so several templates can render on one page (e.g. a picker)
  const uid = useId().replace(/:/g, "");
  const ring = `heritage-ring-${uid}`;

  const initial = (props.resume.fullName || "Y").trim().charAt(0).toUpperCase();
  const contactItems = props.contact.length ? props.contact : ["Email", "Phone", "Location"];

  return (
    <article
      className="relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-[#fbf5e9] px-[58px] py-[48px] text-[13px] leading-relaxed text-[#382a25] shadow-xl"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* ===== Background: mandala watermark + jali bands ===== */}
      <svg
        className="pointer-events-none absolute left-1/2 top-[560px] h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2"
        viewBox="-320 -320 640 640"
        fill="none"
        aria-hidden="true"
      >
        <g stroke={MAROON} strokeOpacity="0.1">
          {MANDALA.map((p, i) => (
            <ellipse key={i} cx="0" cy={-p.R} rx={p.rx} ry={p.ry} transform={`rotate(${p.a})`} />
          ))}
          <circle r="316" />
          <circle r="304" strokeDasharray="2 6" />
          <circle r="60" />
          <circle r="36" />
        </g>
        <circle r="12" fill={GOLD} fillOpacity="0.2" />
      </svg>

      <JaliBand className="top-0" />
      <JaliBand className="bottom-0 -scale-y-100" />

      {/* ===== Double frame + corners ===== */}
      <div className="pointer-events-none absolute inset-5 border border-[#b99462]" />
      <div className="pointer-events-none absolute inset-[26px] border border-[#b99462]/40" />
      <Corner className="left-[20px] top-[20px]" />
      <Corner className="right-[20px] top-[20px] -scale-x-100" />
      <Corner className="bottom-[20px] left-[20px] -scale-y-100" />
      <Corner className="bottom-[20px] right-[20px] -scale-100" />

      {/* ===== Footer: rosette + strip ===== */}
      <svg
        className="pointer-events-none absolute bottom-[30px] left-1/2 -translate-x-1/2"
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden="true"
      >
        {ROSETTE.map((a) => (
          <ellipse key={a} cx="22" cy="10" rx="3.4" ry="8" transform={`rotate(${a} 22 22)`} fill={GOLD} fillOpacity="0.25" stroke={MAROON} strokeOpacity="0.6" strokeWidth="0.8" />
        ))}
        <circle cx="22" cy="22" r="3.4" fill={MAROON} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#54232b] via-[#b3843f] to-[#54232b]" />

      {/* ===== Content ===== */}
      <div className="relative">
        <header className="mb-8 text-center">
          {/* Arched monogram with a lotus on top */}
          <div className="flex flex-col items-center">
            <Lotus width={46} />
            <svg width="84" height="100" viewBox="0 0 84 100" className="-mt-0.5" aria-hidden="true">
              <defs>
                <linearGradient id={ring} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e3c58c" />
                  <stop offset="50%" stopColor={GOLD} />
                  <stop offset="100%" stopColor={DEEP} />
                </linearGradient>
              </defs>
              <path d="M5 98 V44 A37 37 0 0 1 79 44 V98 Z" fill="#fffaf0" stroke={`url(#${ring})`} strokeWidth="1.8" />
              <path d="M12 98 V45 A30 30 0 0 1 72 45 V98" fill="none" stroke={MAROON} strokeOpacity="0.45" strokeWidth="0.8" />
              <circle cx="42" cy="46" r="21" fill="none" stroke={GOLD} strokeWidth="0.8" strokeDasharray="1.5 3" />
              <text x="42" y="58" textAnchor="middle" fontSize="34" fontStyle="italic" fontFamily="Georgia, 'Times New Roman', serif" fill={`url(#${ring})`}>
                {initial}
              </text>
            </svg>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <Vine />
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#8b2635]">Personal Biodata</p>
            <Vine flip />
          </div>

          <h1 className="mt-3 break-words text-[38px] font-semibold leading-tight text-[#54232b]">
            {props.resume.fullName || "Your Name"}
          </h1>
          <p className="mt-2 text-base italic text-[#8b2635]">{props.resume.jobTitle || "Professional Title"}</p>

          <ul className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10.5px] text-[#6f6155]">
            {contactItems.map((item) => (
              <li key={item} className="flex items-center gap-1.5 break-words rounded-full border border-[#d9c5a3] bg-white/60 px-3 py-1">
                <span className="text-[#8b2635]">{contactIcon(item)}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Divider with a centre lotus (fixed size SVG) */}
          <svg className="mx-auto mt-5" width="340" height="22" viewBox="0 0 340 22" fill="none" aria-hidden="true">
            <path d="M0 15 H132" stroke={SAND} strokeWidth="1" />
            <path d="M208 15 H340" stroke={SAND} strokeWidth="1" />
            <circle cx="140" cy="15" r="2" fill={GOLD} />
            <circle cx="200" cy="15" r="2" fill={GOLD} />
            <g transform="translate(170 18) scale(0.6)">
              {[-70, -36, 36, 70, 0].map((r, i) => (
                <path
                  key={r}
                  d="M0 0 C-6 -6 -6 -15 0 -21 C6 -15 6 -6 0 0 Z"
                  transform={`rotate(${r}) scale(${i === 4 ? 1 : 0.85})`}
                  fill={i === 4 ? MAROON : GOLD}
                  fillOpacity={i === 4 ? 0.9 : 0.4}
                  stroke={MAROON}
                  strokeWidth="1.2"
                />
              ))}
            </g>
          </svg>
        </header>

        {/* Profile card */}
        <section className="relative mb-8 rounded-sm border border-[#e4d4b9] bg-white/60 px-6 pb-5 pt-6">
          <span className="absolute -top-[13px] left-1/2 -translate-x-1/2 bg-[#fbf5e9] px-2">
            <DiamondBadge icon={Icons.profile()} size={26} />
          </span>
          <svg className="pointer-events-none absolute left-1.5 top-1.5" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 11 V1 H11" stroke={MAROON} strokeWidth="1" />
          </svg>
          <svg className="pointer-events-none absolute right-1.5 top-1.5 -scale-x-100" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 11 V1 H11" stroke={MAROON} strokeWidth="1" />
          </svg>
          <svg className="pointer-events-none absolute bottom-1.5 left-1.5 -scale-y-100" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 11 V1 H11" stroke={MAROON} strokeWidth="1" />
          </svg>
          <svg className="pointer-events-none absolute bottom-1.5 right-1.5 -scale-100" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 11 V1 H11" stroke={MAROON} strokeWidth="1" />
          </svg>
          <h2 className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b2635]">Personal Profile</h2>
          <p className="whitespace-pre-wrap text-center text-[#66584e]">
            {props.resume.summary || "Add a concise professional summary."}
          </p>
        </section>

        <section className="mb-8">
          <SectionTitle icon={Icons.career()}>Career History</SectionTitle>
          <Rail>{props.experienceEntries}</Rail>
        </section>

        <section className="mb-8">
          <SectionTitle icon={Icons.education()}>Education</SectionTitle>
          <Rail>{props.educationEntries}</Rail>
        </section>

        <div className="grid grid-cols-2 gap-8 pb-14">
          <section className="min-w-0">
            <SubTitle icon={Icons.skills()}>Skills</SubTitle>
            <ul className="flex flex-wrap gap-2">
              {props.skills.length ? (
                props.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-1.5 border border-[#d9c5a3] bg-white/70 px-2.5 py-0.5 text-[11px] italic text-[#54232b]"
                  >
                    <Diamond size={6} color={MAROON} />
                    {skill}
                  </li>
                ))
              ) : (
                <li className="text-[#66584e]">Add your skills</li>
              )}
            </ul>
          </section>

          {props.certifications.length > 0 && (
            <section className="min-w-0">
              <SubTitle icon={Icons.certification()}>Certifications</SubTitle>
              <ul className="space-y-2.5">
                {props.certifications.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 break-words text-[12px] text-[#66584e]">
                    <Seal />
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