import { useId } from "react";
import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const AMBER = "#a76118";
const ORANGE = "#e8731a";
const MARIGOLD = "#f4a62a";
const DEEP = "#6b401b";
const GOLD = "#d7ae68";
const SAND = "#ead5ae";
const CREAM = "#fffaf0";
const LEAF = "#5f7f3a";

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
  about: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21" />
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
  if (/(https?:\/\/|www\.|linkedin|github|behance|\.com|\.in|\.org)/.test(t)) return Icons.globe();
  if (/^[+\d][\d\s().-]{6,}$/.test(text.trim())) return Icons.phone();
  return Icons.pin();
}

/* ---------- Generated geometry ---------- */
const RING_OUT = Array.from({ length: 12 }, (_, i) => i * 30);
const RING_MID = Array.from({ length: 10 }, (_, i) => i * 36 + 18);
const RING_IN = Array.from({ length: 8 }, (_, i) => i * 45);
const SCALLOP = Array.from({ length: 12 }, (_, i) => i * 30);

/* Garland: a quadratic curve across the top (svg 794x150) */
const P0 = { x: -10, y: 8 };
const P1 = { x: 397, y: 118 };
const P2 = { x: 804, y: 8 };
const bez = (t: number) => ({
  x: +((1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t * t * P2.x).toFixed(1),
  y: +((1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t * t * P2.y).toFixed(1),
});
const GARLAND_PATH = `M${P0.x} ${P0.y} Q${P1.x} ${P1.y} ${P2.x} ${P2.y}`;
const FLOWERS = Array.from({ length: 21 }, (_, i) => ({
  ...bez(i / 20),
  tone: i % 2 ? ("b" as const) : ("a" as const),
  r: (i * 37) % 360,
}));
const LEAVES = Array.from({ length: 20 }, (_, i) => ({ ...bez((i + 0.5) / 20), r: i % 2 ? 40 : -40 }));
const STRANDS = [0.06, 0.14, 0.22, 0.78, 0.86, 0.94].map((t, i) => ({ ...bez(t), len: 26 + (i % 3) * 7 }));

/* Rangoli corner (svg 120x120, centre 60,60) */
const RANGOLI_OUTER = Array.from({ length: 16 }, (_, i) => {
  const a = (i * 22.5 * Math.PI) / 180;
  return { x: +(60 + 46 * Math.cos(a)).toFixed(1), y: +(60 + 46 * Math.sin(a)).toFixed(1) };
});
const RANGOLI_INNER = Array.from({ length: 8 }, (_, i) => {
  const a = ((i * 45 + 22.5) * Math.PI) / 180;
  return { x: +(60 + 31 * Math.cos(a)).toFixed(1), y: +(60 + 31 * Math.sin(a)).toFixed(1) };
});

/* ---------- Decorative pieces ---------- */
/* Marigold drawn as a <g> centred on 0,0 with radius ~20, so it can be placed inside any svg */
function MarigoldShape({ tone = "a" }: { tone?: "a" | "b" }) {
  const outer = tone === "a" ? ORANGE : MARIGOLD;
  const mid = tone === "a" ? MARIGOLD : "#ffc247";
  return (
    <g>
      {RING_OUT.map((a) => (
        <ellipse key={`o${a}`} cx="0" cy="-12" rx="4.6" ry="8" transform={`rotate(${a})`} fill={outer} stroke={DEEP} strokeOpacity="0.25" strokeWidth="0.4" />
      ))}
      {RING_MID.map((a) => (
        <ellipse key={`m${a}`} cx="0" cy="-8" rx="3.8" ry="6.5" transform={`rotate(${a})`} fill={mid} stroke={DEEP} strokeOpacity="0.2" strokeWidth="0.4" />
      ))}
      {RING_IN.map((a) => (
        <ellipse key={`i${a}`} cx="0" cy="-4.5" rx="2.8" ry="4.5" transform={`rotate(${a})`} fill="#ffd772" />
      ))}
      <circle r="2.2" fill="#b8541a" />
    </g>
  );
}

function Marigold({ size = 24, tone = "a", className = "" }: { size?: number; tone?: "a" | "b"; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="-20 -20 40 40" className={`shrink-0 ${className}`} aria-hidden="true">
      <MarigoldShape tone={tone} />
    </svg>
  );
}

function FlowerBadge({ icon, size = 32 }: { icon: ReactNode; size?: number }) {
  return (
    <span className="relative flex shrink-0 items-center justify-center text-[#a76118]" style={{ width: size, height: size }}>
      <svg className="absolute inset-0" width={size} height={size} viewBox="-20 -20 40 40" aria-hidden="true">
        <MarigoldShape tone="a" />
        <circle r="9.5" fill="#fff8e6" />
      </svg>
      <span className="relative">{icon}</span>
    </span>
  );
}

function Petal({ size = 8, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" className="shrink-0" aria-hidden="true">
      <path d="M5 0.5 C9 3 9 7 5 9.5 C1 7 1 3 5 0.5 Z" fill={color} />
    </svg>
  );
}

/* Hanging marigold garland across the top */
function Garland() {
  return (
    <svg className="pointer-events-none absolute left-0 top-0" width="794" height="150" viewBox="0 0 794 150" aria-hidden="true">
      <path d={GARLAND_PATH} fill="none" stroke={DEEP} strokeOpacity="0.55" strokeWidth="1.4" />
      {LEAVES.map((l, i) => (
        <ellipse key={i} cx="0" cy="7" rx="3" ry="7" transform={`translate(${l.x} ${l.y}) rotate(${l.r})`} fill={LEAF} fillOpacity="0.85" />
      ))}
      {STRANDS.map((s, i) => (
        <g key={i}>
          <line x1={s.x} y1={s.y} x2={s.x} y2={s.y + s.len} stroke={DEEP} strokeOpacity="0.5" strokeWidth="1" />
          <circle cx={s.x} cy={s.y + s.len * 0.35} r="2.6" fill={MARIGOLD} />
          <circle cx={s.x} cy={s.y + s.len * 0.65} r="2.6" fill={ORANGE} />
          <g transform={`translate(${s.x} ${s.y + s.len + 7}) scale(0.34)`}>
            <MarigoldShape tone="b" />
          </g>
        </g>
      ))}
      {FLOWERS.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.r}) scale(0.72)`}>
          <MarigoldShape tone={f.tone} />
        </g>
      ))}
    </svg>
  );
}

/* Arch pattern band, fading out toward its top edge */
function ArchBand() {
  const uid = useId().replace(/:/g, "");
  const arch = `marigold-arch-${uid}`;
  const fade = `marigold-fade-${uid}`;
  return (
    <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] w-full" aria-hidden="true">
      <defs>
        <pattern id={arch} width="36" height="44" patternUnits="userSpaceOnUse">
          <path d="M4 44 V22 A14 14 0 0 1 32 22 V44" fill="none" stroke={GOLD} strokeWidth="0.9" opacity="0.5" />
          <path d="M10 44 V23 A8 8 0 0 1 26 23 V44" fill="none" stroke={AMBER} strokeWidth="0.7" opacity="0.3" />
          <circle cx="18" cy="20" r="1.3" fill={ORANGE} opacity="0.5" />
        </pattern>
        <linearGradient id={fade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={CREAM} stopOpacity="1" />
          <stop offset="100%" stopColor={CREAM} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${arch})`} />
      <rect width="100%" height="100%" fill={`url(#${fade})`} />
    </svg>
  );
}

function Rangoli({ className }: { className: string }) {
  return (
    <svg className={`pointer-events-none absolute opacity-60 ${className}`} width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="56" stroke={GOLD} strokeWidth="0.8" strokeDasharray="2 4" />
      {RING_IN.map((a) => (
        <ellipse key={a} cx="60" cy="42" rx="6" ry="14" transform={`rotate(${a} 60 60)`} stroke={ORANGE} strokeWidth="1" fill={MARIGOLD} fillOpacity="0.18" />
      ))}
      {RANGOLI_INNER.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.8" fill={AMBER} />
      ))}
      {RANGOLI_OUTER.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={ORANGE} />
      ))}
      <circle cx="60" cy="60" r="4" fill={AMBER} />
    </svg>
  );
}

function Diya() {
  return (
    <svg className="pointer-events-none absolute bottom-[14px] left-1/2 -translate-x-1/2" width="40" height="34" viewBox="0 0 40 34" aria-hidden="true">
      <path d="M20 3 C27 10 26 16 20 20 C14 16 13 10 20 3 Z" fill={ORANGE} />
      <path d="M20 9 C23 12 23 15 20 17.5 C17 15 17 12 20 9 Z" fill="#ffd772" />
      <path d="M4 21 H36 C35 29 28 33 20 33 C12 33 5 29 4 21 Z" fill={AMBER} />
      <path d="M4 21 H36" stroke={DEEP} strokeWidth="1.2" />
      <path d="M10 26 H30" stroke={GOLD} strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

function Rosette() {
  return (
    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center text-[#a76118]">
      <svg className="absolute inset-0" width="32" height="32" viewBox="-16 -16 32 32" aria-hidden="true">
        {SCALLOP.map((a) => (
          <circle key={a} cx="0" cy="-11.5" r="4" transform={`rotate(${a})`} fill={MARIGOLD} fillOpacity="0.55" />
        ))}
        <circle r="11" fill="#fff7e3" stroke={AMBER} strokeOpacity="0.5" strokeWidth="0.8" />
      </svg>
      <span className="relative">{Icons.certification(14)}</span>
    </span>
  );
}

/* Card with a small marigold pinned to the top-right corner */
function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-lg border border-[#ead5ae] bg-white/80 ${className}`}>
      <Marigold size={26} tone="b" className="pointer-events-none absolute -right-3 -top-3" />
      {children}
    </div>
  );
}

/* Solid-colour rule with a min width: no CSS gradients on flexible items */
function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <FlowerBadge icon={icon} />
      <h2 className="shrink-0 text-[11px] font-bold uppercase tracking-[0.16em] text-[#a76118]">{children}</h2>
      <span className="h-px min-w-[8px] flex-1 bg-[#e3c58c]" />
      <Petal size={7} color={GOLD} />
    </div>
  );
}

function Rail({ children }: { children: ReactNode }) {
  return (
    <div className="relative border-l-2 border-dashed border-[#e3c58c] pl-4">
      <Marigold size={16} className="absolute -left-[9px] -top-[3px]" />
      {children}
    </div>
  );
}

export default function MarigoldTemplate(props: ResumeTemplateDesignProps) {
  const contactItems = props.contact.length ? props.contact : ["Email", "Phone", "Location"];

  return (
    <article
      className="relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-[#fffaf0] px-[58px] pb-[56px] pt-[104px] text-[13px] leading-relaxed text-[#443625] shadow-xl"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* ===== Background ===== */}
      <ArchBand />
      <Rangoli className="-bottom-8 -left-8" />
      <Rangoli className="-bottom-8 -right-8" />
      <Garland />
      <Diya />
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#6b401b] via-[#f4a62a] to-[#6b401b]" />

      {/* ===== Content ===== */}
      <div className="relative">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <Marigold size={16} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#a76118]">Profile & Portfolio</p>
            <Marigold size={16} />
          </div>

          <h1 className="mt-3 break-words text-[38px] font-semibold leading-tight text-[#6b401b]">
            {props.resume.fullName || "Your Name"}
          </h1>
          <p className="mt-2 text-lg italic text-[#a76118]">{props.resume.jobTitle || "Professional Title"}</p>

          <ul className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10.5px] text-[#796950]">
            {contactItems.map((item) => (
              <li key={item} className="flex items-center gap-1.5 break-words rounded-full border border-[#e3c58c] bg-white/70 px-3 py-1">
                <span className="text-[#e8731a]">{contactIcon(item)}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Divider with a centre marigold (fixed-size svg) */}
          <svg className="mx-auto mt-5" width="340" height="24" viewBox="0 0 340 24" fill="none" aria-hidden="true">
            <path d="M0 12 H138" stroke={GOLD} strokeWidth="1.2" />
            <path d="M202 12 H340" stroke={GOLD} strokeWidth="1.2" />
            <circle cx="146" cy="12" r="2" fill={ORANGE} />
            <circle cx="194" cy="12" r="2" fill={ORANGE} />
            <g transform="translate(170 12) scale(0.5)">
              <MarigoldShape tone="a" />
            </g>
          </svg>
        </header>

        <Card className="mb-8 px-6 py-5">
          <SectionTitle icon={Icons.about()}>About</SectionTitle>
          <p className="whitespace-pre-wrap text-[#6b5a43]">
            {props.resume.summary || "Add a concise professional summary."}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-8 pb-10">
          <Card className="min-w-0 p-5">
            <SectionTitle icon={Icons.experience()}>Experience</SectionTitle>
            <Rail>{props.experienceEntries}</Rail>
          </Card>

          <div className="min-w-0 space-y-7">
            <Card className="p-5">
              <SectionTitle icon={Icons.education()}>Education</SectionTitle>
              <Rail>{props.educationEntries}</Rail>
            </Card>

            <Card className="p-5">
              <SectionTitle icon={Icons.skills()}>Skills</SectionTitle>
              <ul className="flex flex-wrap gap-1.5">
                {props.skills.length ? (
                  props.skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center gap-1.5 rounded-full border border-[#ead5ae] bg-[#fff3d9] px-2.5 py-0.5 text-[11px] text-[#6b401b]"
                    >
                      <Petal />
                      {skill}
                    </li>
                  ))
                ) : (
                  <li className="text-[#6b5a43]">Add your skills</li>
                )}
              </ul>

              {props.certifications.length > 0 && (
                <div className="mt-6">
                  <SectionTitle icon={Icons.certification()}>Certifications</SectionTitle>
                  <ul className="space-y-2.5">
                    {props.certifications.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 break-words text-[12px] text-[#6b5a43]">
                        <Rosette />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </article>
  );
}