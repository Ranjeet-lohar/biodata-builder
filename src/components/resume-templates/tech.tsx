import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const NAVY = "#132638";
const DEEP = "#0c1a28";
const CYAN = "#42c4f5";
const BLUE = "#1486b8";
const MINT = "#3ddc97";
const AMBER = "#f5b942";
const LINE = "#dce9ef";

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
  overview: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <path d="M8 7 L3 12 L8 17" />
      <path d="M16 7 L21 12 L16 17" />
      <path d="M13.5 5 L10.5 19" />
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
  toolbox: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9 L11 12 L8 15" />
      <path d="M13 15 H16" />
    </svg>
  ),
  certification: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <path d="M12 3 L20 6 V12 C20 16.5 16.5 19.8 12 21 C7.5 19.8 4 16.5 4 12 V6 Z" />
      <path d="M8.5 12 L11 14.5 L15.5 9.5" />
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
  if (/(https?:\/\/|www\.|linkedin|github|gitlab|\.com|\.in|\.org|\.dev|\.io)/.test(t)) return Icons.globe();
  if (/^[+\d][\d\s().-]{6,}$/.test(text.trim())) return Icons.phone();
  return Icons.pin();
}

/* ---------- Generated geometry ---------- */
/* Circuit traces for the header (svg 380x230). Each trace is [path, strength]. */
const TRACES: [string, number][] = [
  ["M380 30 H300 L276 54 H210 L190 74 H120", 0.5],
  ["M380 70 H330 L310 90 H250 L232 108 V150", 0.4],
  ["M380 112 H344 L324 132 H280 L262 150 H196 L178 168 H110", 0.32],
  ["M380 156 H352 L334 174 H300 V214", 0.26],
  ["M380 196 H300 L282 214 H220", 0.2],
  ["M300 30 V0", 0.3],
  ["M210 54 V0", 0.22],
];
const PADS: [number, number, number][] = [
  [120, 74, 4], [232, 150, 3.5], [110, 168, 3], [300, 214, 3.5], [220, 214, 3], [276, 54, 3], [324, 132, 3],
];

/* Dot grid for the header, getting stronger toward the right (svg 300x120) */
const GRID = Array.from({ length: 9 * 20 }, (_, n) => {
  const r = Math.floor(n / 20);
  const c = n % 20;
  return { cx: c * 15 + 6, cy: r * 14 + 6, o: +(0.03 + (c / 19) * 0.22).toFixed(3) };
});

/* Faint code lines for the sidebar card: [indent, width, tone] */
const CODE_LINES: [number, number, number][] = [
  [0, 54, 0], [10, 78, 1], [10, 40, 2], [20, 66, 0], [20, 30, 1], [10, 58, 2], [0, 22, 0],
];
const TONES = [CYAN, MINT, AMBER];

/* ---------- Decorative pieces ---------- */
function Square({ size = 6, color = CYAN, className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" className={`shrink-0 ${className}`} aria-hidden="true">
      <rect x="1" y="1" width="8" height="8" fill={color} />
    </svg>
  );
}

/* Fixed-size badge with a cut top-right corner */
function Badge({ icon, size = 26, tone = BLUE }: { icon: ReactNode; size?: number; tone?: string }) {
  const cut = Math.round(size * 0.3);
  return (
    <span className="relative flex shrink-0 items-center justify-center text-white" style={{ width: size, height: size }}>
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <polygon points={`0,0 ${size - cut},0 ${size},${cut} ${size},${size} 0,${size}`} fill={tone} />
        <polygon points={`${size - cut},0 ${size},${cut} ${size - cut},${cut}`} fill="#fff" fillOpacity="0.35" />
      </svg>
      <span className="relative">{icon}</span>
    </span>
  );
}

function SectionTitle({ no, icon, children }: { no: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Badge icon={icon} />
      <span className="shrink-0 font-mono text-[10px] text-[#1486b8]/60">{no}</span>
      <h2 className="shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-[#1486b8]">
        <span className="font-mono text-[#1486b8]/50">// </span>
        {children}
      </h2>
      <span className="h-px min-w-[8px] flex-1 bg-[#dce9ef]" />
      <Square size={6} />
    </div>
  );
}

function SideTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Badge icon={icon} size={22} tone={NAVY} />
      <h2 className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#1486b8]">{children}</h2>
      <span className="h-px min-w-[6px] flex-1 bg-[#dce9ef]" />
    </div>
  );
}

function Rail({ children }: { children: ReactNode }) {
  return (
    <div className="relative border-l border-[#c4e2ef] pl-5">
      <svg width="11" height="11" viewBox="0 0 11 11" className="absolute -left-[5.5px] top-0" aria-hidden="true">
        <rect x="0.8" y="0.8" width="9.4" height="9.4" fill="#fff" stroke={BLUE} strokeWidth="1.3" />
        <rect x="3.6" y="3.6" width="3.8" height="3.8" fill={BLUE} />
      </svg>
      {children}
    </div>
  );
}

export default function TechTemplate(props: ResumeTemplateDesignProps) {
  const contactItems = props.contact.length ? props.contact : ["Email", "Phone", "Location"];

  return (
    <article className="relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed text-[#1c2b39] shadow-xl">
      {/* ===== Header ===== */}
      <header className="relative overflow-hidden bg-[#132638] px-11 pb-9 pt-6 text-white">
        {/* Dot grid */}
        <svg className="pointer-events-none absolute right-0 top-0" width="300" height="120" viewBox="0 0 300 120" aria-hidden="true">
          {GRID.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r="1.4" fill={CYAN} fillOpacity={d.o} />
          ))}
        </svg>

        {/* Circuit traces */}
        <svg className="pointer-events-none absolute bottom-0 right-0" width="380" height="230" viewBox="0 0 380 230" fill="none" aria-hidden="true">
          {TRACES.map(([d, o], i) => (
            <path key={i} d={d} stroke={CYAN} strokeOpacity={o} strokeWidth="1.6" strokeLinejoin="round" />
          ))}
          {PADS.map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r + 3} fill={CYAN} fillOpacity="0.1" />
              <circle cx={x} cy={y} r={r} fill={NAVY} stroke={CYAN} strokeOpacity="0.8" strokeWidth="1.4" />
            </g>
          ))}
          {/* Chip */}
          <g transform="translate(300 96)">
            <rect width="44" height="44" rx="3" fill={DEEP} stroke={CYAN} strokeOpacity="0.6" strokeWidth="1.2" />
            <rect x="12" y="12" width="20" height="20" fill={CYAN} fillOpacity="0.18" stroke={CYAN} strokeOpacity="0.7" />
            {[8, 18, 28, 38].map((p) => (
              <g key={p} stroke={CYAN} strokeOpacity="0.6" strokeWidth="1.2">
                <path d={`M${p} 0 V-6 M${p} 44 V50`} />
                <path d={`M0 ${p} H-6 M44 ${p} H50`} />
              </g>
            ))}
            <circle cx="22" cy="22" r="2.4" fill={MINT} />
          </g>
        </svg>

        {/* Terminal window bar */}
        <div className="relative mb-7 flex items-center gap-2">
          <svg width="40" height="10" viewBox="0 0 40 10" aria-hidden="true">
            <circle cx="5" cy="5" r="4" fill="#ff6b6b" />
            <circle cx="20" cy="5" r="4" fill={AMBER} />
            <circle cx="35" cy="5" r="4" fill={MINT} />
          </svg>
          <span className="shrink-0 font-mono text-[9px] tracking-[0.1em] text-slate-400">~/resume — zsh</span>
          <span className="h-px min-w-[8px] max-w-[260px] flex-1 bg-white/15" />
        </div>

        <div className="relative max-w-[470px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#59c9f3]">Professional // Resume</p>

          <p className="mt-4 font-mono text-[11px] text-[#3ddc97]">
            <span className="text-slate-400">$ </span>whoami
          </p>
          <h1 className="mt-1 break-words font-mono text-[34px] font-bold leading-tight">
            {props.resume.fullName || "Your Name"}
            <span className="ml-1 inline-block h-[28px] w-[12px] translate-y-[5px] bg-[#42c4f5]" />
          </h1>
          <p className="mt-2 text-lg text-slate-200">
            <span className="font-mono text-slate-500">// </span>
            {props.resume.jobTitle || "Professional Title"}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] text-slate-200">
            {contactItems.map((item) => (
              <li key={item} className="flex items-center gap-1.5 break-words rounded border border-white/20 bg-white/5 px-2.5 py-1">
                <span className="text-[#42c4f5]">{contactIcon(item)}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom edge: solid segments */}
        <div className="absolute inset-x-0 bottom-0 flex h-1">
          <span className="w-32 shrink-0 bg-[#42c4f5]" />
          <span className="w-16 shrink-0 bg-[#1486b8]" />
          <span className="w-full bg-[#0c1a28]" />
          <span className="w-20 shrink-0 bg-[#3ddc97]" />
        </div>
      </header>

      {/* ===== Body ===== */}
      <div className="grid grid-cols-[1fr_205px] gap-8 px-11 pb-14 pt-9">
        <div className="min-w-0">
          <section className="mb-8">
            <SectionTitle no="01" icon={Icons.overview()}>Overview</SectionTitle>
            <div className="relative border-l-2 border-[#1486b8] bg-[#f4fafd] py-3 pl-4 pr-4">
              <svg className="pointer-events-none absolute right-2 top-2" width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
                <path d="M6 1 L1 7 L6 13" stroke={BLUE} strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 1 L21 7 L16 13" stroke={BLUE} strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="whitespace-pre-wrap pr-6 text-slate-600">
                {props.resume.summary || "Add a concise professional summary."}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <SectionTitle no="02" icon={Icons.experience()}>Experience</SectionTitle>
            <Rail>{props.experienceEntries}</Rail>
          </section>

          <section>
            <SectionTitle no="03" icon={Icons.education()}>Education</SectionTitle>
            <Rail>{props.educationEntries}</Rail>
          </section>
        </div>

        <aside className="relative min-w-0 border-l border-[#dce9ef] pl-6">
          <svg className="absolute -left-[5px] -top-1" width="10" height="24" viewBox="0 0 10 24" aria-hidden="true">
            <rect x="1" y="1" width="8" height="8" fill={CYAN} />
            <rect x="1" y="13" width="8" height="8" fill={BLUE} />
          </svg>

          <section className="mb-8">
            <SideTitle icon={Icons.toolbox()}>Toolbox</SideTitle>
            <div className="flex flex-wrap gap-1.5">
              {props.skills.length ? (
                props.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 rounded border border-[#c4e2ef] bg-[#eef8fc] px-2 py-1 text-[10px]"
                  >
                    <Square size={5} color={BLUE} />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-500">Add your skills</span>
              )}
            </div>
          </section>

          {props.certifications.length > 0 && (
            <section className="mb-8">
              <SideTitle icon={Icons.certification()}>Certifications</SideTitle>
              <ul className="space-y-2">
                {props.certifications.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 break-words border border-[#dce9ef] border-l-[3px] border-l-[#42c4f5] bg-[#f7fbfd] px-2.5 py-2 text-[11px] text-slate-600"
                  >
                    <span className="mt-[1px] shrink-0 text-[#1486b8]">{Icons.certification(12)}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Code-lines card */}
          <svg className="pointer-events-none block" width="170" height="92" viewBox="0 0 170 92" aria-hidden="true">
            <rect x="0.5" y="0.5" width="169" height="91" rx="4" fill="#f4fafd" stroke="#c4e2ef" />
            <circle cx="10" cy="9" r="2.2" fill="#ff6b6b" />
            <circle cx="18" cy="9" r="2.2" fill={AMBER} />
            <circle cx="26" cy="9" r="2.2" fill={MINT} />
            <path d="M0 18 H170" stroke="#c4e2ef" />
            {CODE_LINES.map(([indent, w, t], i) => (
              <rect key={i} x={14 + indent} y={26 + i * 9} width={w} height="4" rx="2" fill={TONES[t]} fillOpacity="0.55" />
            ))}
          </svg>
        </aside>
      </div>

      {/* ===== Status bar ===== */}
      <div className="absolute inset-x-0 bottom-0 flex h-[18px] items-center bg-[#132638] font-mono text-[8px] uppercase tracking-[0.18em] text-slate-400">
        <span className="flex h-full w-24 shrink-0 items-center justify-center bg-[#42c4f5] text-[#132638]">main</span>
        <span className="ml-3 shrink-0">UTF-8</span>
        <span className="ml-3 shrink-0">A4</span>
        <span className="h-px min-w-[8px] flex-1" />
        <span className="flex h-full w-20 shrink-0 items-center justify-center bg-[#3ddc97] text-[#132638]">ready</span>
      </div>
    </article>
  );
}