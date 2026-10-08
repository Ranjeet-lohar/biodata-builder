import { useId } from "react";
import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const NAVY = "#233e5b";
const BLUE = "#315b83";
const TEAL = "#69a8b7";
const AMBER = "#d9a856";
const SKILL_TONES = [TEAL, AMBER, BLUE];

/* ---------- Generated geometry ---------- */
/* Deterministic pseudo-random so the mesh is identical on every render */
const hash = (a: number, b: number, c: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

/* Low-poly mesh for the header: 15 cols x 6 rows, each cell split into two triangles.
   Opacity grows toward the right so the text on the left stays clean. */
const MESH = Array.from({ length: 6 * 15 }, (_, n) => {
  const r = Math.floor(n / 15);
  const c = n % 15;
  const x = c * 53;
  const y = r * 46;
  const fade = (c + 1) / 15;
  return [
    { points: `${x},${y} ${x + 53},${y} ${x},${y + 46}`, k: 0 },
    { points: `${x + 53},${y} ${x + 53},${y + 46} ${x},${y + 46}`, k: 1 },
  ].map((t) => {
    const v = hash(r, c, t.k);
    return {
      points: t.points,
      fill: v > 0.88 ? AMBER : v > 0.45 ? TEAL : "#ffffff",
      opacity: +(v * fade * 0.24).toFixed(3),
    };
  });
}).flat();

/* Zigzag bottom edge of the header (svg 794x16) */
const ZIGZAG = (() => {
  const teeth = 30;
  const w = 794 / teeth;
  const pts = Array.from({ length: teeth }, (_, i) => `${(i * w).toFixed(1)},16 ${(i * w + w / 2).toFixed(1)},2`);
  return `${pts.join(" ")} 794,16 794,17 0,17`;
})();

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
      <path d="M12 3 L21 19 H3 Z" />
      <path d="M12 9 V14" />
      <circle cx="12" cy="16.4" r="0.6" />
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

/* ---------- Decorative pieces ---------- */
/* Square badge with a cut bottom-right corner */
function Badge({ icon, tone = BLUE, size = 26 }: { icon: ReactNode; tone?: string; size?: number }) {
  const p = size;
  const cut = Math.round(size * 0.38);
  return (
    <span className="relative flex shrink-0 items-center justify-center text-white" style={{ width: p, height: p }}>
      <svg className="absolute inset-0" width={p} height={p} viewBox={`0 0 ${p} ${p}`} aria-hidden="true">
        <polygon points={`0,0 ${p},0 ${p},${p - cut} ${p - cut},${p} 0,${p}`} fill={tone} />
        <polygon points={`${p},${p - cut} ${p - cut},${p} ${p - cut},${p - cut}`} fill="#fff" fillOpacity="0.28" />
      </svg>
      <span className="relative">{icon}</span>
    </span>
  );
}

/* Tiny square / circle / triangle trio */
function ShapeTrio() {
  return (
    <svg width="44" height="12" viewBox="0 0 44 12" aria-hidden="true">
      <rect x="1" y="1" width="10" height="10" fill={BLUE} />
      <circle cx="22" cy="6" r="5" fill={AMBER} />
      <polygon points="33,11 38,1 43,11" fill={TEAL} />
    </svg>
  );
}

function SectionTitle({ icon, children, tone }: { icon: ReactNode; children: ReactNode; tone?: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Badge icon={icon} tone={tone} />
      <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#315b83]">{children}</h2>
      <span className="h-[2px] flex-1 bg-gradient-to-r from-[#315b83] via-[#c9d9e2] to-transparent" />
      <ShapeTrio />
    </div>
  );
}

function Rail({ color = AMBER, children }: { color?: string; children: ReactNode }) {
  return (
    <div className="relative border-l-2 border-[#c9d9e2] pl-5">
      <svg width="12" height="14" viewBox="0 0 12 14" className="absolute -left-[2px] top-0" aria-hidden="true">
        <polygon points="0,0 12,7 0,14" fill={color} />
      </svg>
      {children}
    </div>
  );
}

export default function GeometricTemplate(props: ResumeTemplateDesignProps) {
  // Unique ids so several templates can render on one page (e.g. a picker)
  const uid = useId().replace(/:/g, "");
  const headGrad = `geo-head-${uid}`;
  const tri = `geo-tri-${uid}`;
  const triFade = `geo-tri-fade-${uid}`;

  const contactItems = props.contact.length ? props.contact : ["Email", "Phone", "Location"];

  return (
    <article className="relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed text-[#27384a] shadow-xl">
      {/* ===== Corner triangle pattern (bottom-right), fades toward the content ===== */}
      <svg className="pointer-events-none absolute bottom-0 right-0" width="380" height="300" aria-hidden="true">
        <defs>
          <pattern id={tri} width="26" height="22" patternUnits="userSpaceOnUse">
            <polygon points="0,22 13,0 26,22" fill="none" stroke={BLUE} strokeWidth="0.8" opacity="0.3" />
          </pattern>
          <radialGradient id={triFade} gradientUnits="userSpaceOnUse" cx="380" cy="300" r="340">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="380" height="300" fill={`url(#${tri})`} />
        <rect width="380" height="300" fill={`url(#${triFade})`} />
      </svg>

      {/* ===== Header ===== */}
      <header className="relative overflow-hidden px-12 pb-16 pt-12 text-white">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          width="794"
          height="276"
          viewBox="0 0 794 276"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={headGrad} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#182c43" />
              <stop offset="60%" stopColor={NAVY} />
              <stop offset="100%" stopColor="#2f5a7e" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${headGrad})`} />
        </svg>

        {/* Low-poly mesh */}
        <svg className="pointer-events-none absolute right-0 top-0" width="794" height="276" viewBox="0 0 794 276" aria-hidden="true">
          {MESH.map((t, i) => (
            <polygon key={i} points={t.points} fill={t.fill} fillOpacity={t.opacity} />
          ))}
        </svg>

        {/* Bauhaus cluster */}
        <svg className="pointer-events-none absolute right-10 top-8" width="210" height="190" viewBox="0 0 210 190" fill="none" aria-hidden="true">
          <circle cx="140" cy="62" r="60" stroke="#fff" strokeOpacity="0.28" />
          <circle cx="140" cy="62" r="40" fill={AMBER} fillOpacity="0.92" />
          <rect x="16" y="14" width="64" height="64" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.4" />
          <rect x="30" y="28" width="36" height="36" fill={TEAL} fillOpacity="0.85" />
          <path d="M26 172 A32 32 0 0 1 90 172 Z" fill="#fff" fillOpacity="0.88" />
          <polygon points="108,172 172,108 172,172" fill={TEAL} />
          <polygon points="140,172 172,140 172,172" fill={NAVY} fillOpacity="0.55" />
          <circle cx="192" cy="150" r="5" fill="#fff" fillOpacity="0.8" />
        </svg>

        {/* Zigzag bottom edge */}
        <svg
          className="pointer-events-none absolute bottom-[-1px] left-0 h-4 w-full"
          width="794"
          height="17"
          viewBox="0 0 794 17"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points={ZIGZAG} fill="#ffffff" />
        </svg>

        <div className="relative max-w-[500px]">
          <div className="flex items-center gap-3">
            <svg width="30" height="10" viewBox="0 0 30 10" aria-hidden="true">
              <rect width="10" height="10" fill={AMBER} />
              <polygon points="12,10 17,0 22,10" fill={TEAL} />
              <circle cx="27" cy="5" r="3" fill="#fff" />
            </svg>
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#a9d1df]">Professional Profile</p>
          </div>
          <h1 className="mt-3 break-words text-[40px] font-bold leading-tight">{props.resume.fullName || "Your Name"}</h1>
          <p className="mt-2 text-lg text-[#d4e4ed]">{props.resume.jobTitle || "Professional Title"}</p>

          <ul className="mt-5 flex flex-wrap gap-2 text-[10.5px]">
            {contactItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 break-words border border-white/25 bg-white/10 px-2.5 py-1 text-white/90"
              >
                <span className="text-[#d9a856]">{contactIcon(item)}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ===== Body ===== */}
      <div className="relative px-12 pb-14 pt-6">
        {/* Summary */}
        <section className="relative mb-8 overflow-hidden border-l-4 border-[#69a8b7] bg-[#f1f6f8] px-5 py-4">
          <svg className="pointer-events-none absolute right-0 top-0" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
            <polygon points="0,0 64,0 64,64" fill={TEAL} fillOpacity="0.2" />
            <polygon points="24,0 64,0 64,40" fill={AMBER} fillOpacity="0.28" />
          </svg>
          <div className="relative">
            <SectionTitle icon={Icons.summary()} tone={TEAL}>
              Summary
            </SectionTitle>
            <p className="whitespace-pre-wrap pr-6 text-[#607181]">
              {props.resume.summary || "Add a concise professional summary."}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-[1.5fr_0.8fr] gap-9">
          <div className="min-w-0">
            <section className="mb-8">
              <SectionTitle icon={Icons.experience()}>Experience</SectionTitle>
              <Rail color={AMBER}>{props.experienceEntries}</Rail>
            </section>
            <section>
              <SectionTitle icon={Icons.education()}>Education</SectionTitle>
              <Rail color={TEAL}>{props.educationEntries}</Rail>
            </section>
          </div>

          <aside className="relative min-w-0 border-l border-[#d9e2e8] pl-6">
            {/* Stacked triangles at the top of the sidebar rule */}
            <svg className="absolute -left-[7px] -top-1" width="14" height="30" viewBox="0 0 14 30" aria-hidden="true">
              <polygon points="0,0 14,0 7,12" fill={AMBER} />
              <polygon points="0,14 14,14 7,26" fill={TEAL} />
            </svg>

            <section className="mb-8">
              <SectionTitle icon={Icons.skills()} tone={TEAL}>
                Skills
              </SectionTitle>
              <div className="flex flex-wrap gap-2">
                {props.skills.length ? (
                  props.skills.map((skill, i) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1.5 border border-[#c9d9e2] bg-[#f1f6f8] px-2 py-1 text-[10px]"
                    >
                      <svg width="7" height="7" viewBox="0 0 7 7" aria-hidden="true">
                        {i % 3 === 0 && <rect width="7" height="7" fill={SKILL_TONES[0]} />}
                        {i % 3 === 1 && <circle cx="3.5" cy="3.5" r="3.5" fill={SKILL_TONES[1]} />}
                        {i % 3 === 2 && <polygon points="0,7 3.5,0 7,7" fill={SKILL_TONES[2]} />}
                      </svg>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-[11px] text-[#607181]">Add your skills</p>
                )}
              </div>
            </section>

            {props.certifications.length > 0 && (
              <section>
                <SectionTitle icon={Icons.certification()} tone={AMBER}>
                  Certifications
                </SectionTitle>
                <ul className="space-y-2.5 text-[11px] text-[#607181]">
                  {props.certifications.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 break-words">
                      <Badge icon={Icons.certification(11)} tone={BLUE} size={20} />
                      <span className="pt-[2px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </div>

      {/* ===== Footer strip ===== */}
      <div className="absolute inset-x-0 bottom-0 flex h-1.5">
        <span className="w-2/3 bg-gradient-to-r from-[#182c43] to-[#69a8b7]" />
        <span className="w-1/3 bg-gradient-to-r from-[#d9a856] to-[#f0cd8c]" />
      </div>
    </article>
  );
}