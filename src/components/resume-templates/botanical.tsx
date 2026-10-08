import { useId } from "react";
import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const LEAF = "M0 0 C5 -9 15 -9 22 0 C15 9 5 9 0 0 Z";
const GOLD = "#d0b36e";
const FOREST = "#294b38";
const SAGE = "#66876a";
const MIST = "#bdcdb8";

/* Leaves along the stem: y position, scale, rotation */
const BRANCH_LEAVES = [
  { y: 232, s: 1.7, a: -38 }, { y: 214, s: 1.7, a: -142 },
  { y: 186, s: 1.9, a: -36 }, { y: 168, s: 1.9, a: -144 },
  { y: 140, s: 1.7, a: -40 }, { y: 122, s: 1.7, a: -140 },
  { y: 94, s: 1.5, a: -42 },  { y: 76, s: 1.5, a: -138 },
  { y: 50, s: 1.2, a: -46 },  { y: 36, s: 1.2, a: -134 },
];

const iconProps = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function ContactIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7 L12 13 L21 7" />
    </svg>
  );
}

function SkillsIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 3 L14.5 9.5 L21 12 L14.5 14.5 L12 21 L9.5 14.5 L3 12 L9.5 9.5 Z" />
    </svg>
  );
}

function CertificationIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9.6 9 L11.4 10.8 L14.6 7.4" />
      <path d="M8.5 13.8 L7 21 L12 18.5 L17 21 L15.5 13.8" />
    </svg>
  );
}

function SidebarTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#d0b36e]/70 bg-white/5 text-[#d0b36e]">
        {icon}
      </span>
      <p className="font-serif text-[15px] tracking-wide text-[#e6ead0]">{children}</p>
    </div>
  );
}

function Branch({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} fill="none" aria-hidden="true">
      <path d="M100 258 C97 190 103 100 100 16" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      {BRANCH_LEAVES.map((l, i) => (
        <g key={i} transform={`translate(100 ${l.y}) rotate(${l.a}) scale(${l.s})`}>
          <path d={LEAF} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="0.9" />
          <path d="M0 0 L20 0" stroke={color} strokeWidth="0.6" />
        </g>
      ))}
      <g transform="translate(100 16) rotate(-90) scale(1.5)">
        <path d={LEAF} fill={color} fillOpacity="0.18" stroke={color} strokeWidth="0.9" />
      </g>
    </svg>
  );
}

function LeafIcon({ color = SAGE }: { color?: string }) {
  return (
    <svg width="16" height="12" viewBox="-2 -8 26 16" className="shrink-0" aria-hidden="true">
      <path d={LEAF} fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.2" />
      <path d="M0 0 L20 0" stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

function Wave({ color, className }: { color: string; className?: string }) {
  const d = "M0 6 Q10 0 20 6" + Array.from({ length: 11 }, (_, i) => ` T${(i + 2) * 20} 6`).join("");
  return (
    <svg viewBox="0 0 240 12" className={className} fill="none" aria-hidden="true">
      <path d={d} stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 font-serif text-[17px] font-semibold text-[#294b38]">
      <LeafIcon />
      <span>{children}</span>
    </h2>
  );
}

function VineNode() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className="absolute -left-[7px] top-[3px]"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="5" fill="#fbfcf8" stroke={GOLD} strokeWidth="1.5" />
      <circle cx="6" cy="6" r="2" fill={GOLD} />
    </svg>
  );
}

export default function BotanicalTemplate(props: ResumeTemplateDesignProps) {
  const initial = (props.resume.fullName || "Y").trim().charAt(0).toUpperCase();
  // Unique, URL-safe ids so several templates can render on one page (e.g. previews)
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${name}-${uid}`;

  return (
    <article className="relative mx-auto flex min-h-[1123px] w-[794px] overflow-hidden bg-[#fbfcf8] text-[13px] leading-relaxed text-[#28372c] shadow-xl">
      {/* Shared gradient + pattern definitions (zero-size svg) */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          {/* Sidebar background: deep forest, lighter at the top-left */}
          <linearGradient id={id("side")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a6249" />
            <stop offset="0.55" stopColor={FOREST} />
            <stop offset="1" stopColor="#1b3326" />
          </linearGradient>
          {/* Gold metallic stroke */}
          <linearGradient id={id("gold")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ecd89a" />
            <stop offset="0.5" stopColor={GOLD} />
            <stop offset="1" stopColor="#a98a45" />
          </linearGradient>
          {/* Main-area corner glow */}
          <radialGradient id={id("glow")} cx="1" cy="0" r="1">
            <stop offset="0" stopColor="#d7e3cb" stopOpacity="0.85" />
            <stop offset="1" stopColor="#d7e3cb" stopOpacity="0" />
          </radialGradient>
          {/* Header divider fades out to the right */}
          <linearGradient id={id("rule")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={GOLD} />
            <stop offset="1" stopColor={MIST} stopOpacity="0" />
          </linearGradient>
          {/* Soft fade so the bottom branch melts into the sidebar */}
          <linearGradient id={id("fade")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <mask id={id("branchMask")}>
            <rect width="200" height="260" fill={`url(#${id("fade")})`} />
          </mask>
          {/* Tiled leaf pattern, staggered rows */}
          <pattern id={id("leaves")} width="44" height="44" patternUnits="userSpaceOnUse">
            <g transform="translate(6 12) rotate(-35) scale(0.6)">
              <path d={LEAF} fill="#d1d8a9" fillOpacity="0.5" />
            </g>
            <g transform="translate(28 34) rotate(-35) scale(0.6)">
              <path d={LEAF} fill="#d1d8a9" fillOpacity="0.5" />
            </g>
            <circle cx="34" cy="10" r="1" fill={GOLD} fillOpacity="0.7" />
            <circle cx="10" cy="36" r="1" fill={GOLD} fillOpacity="0.7" />
          </pattern>
          {/* Fine dot grid for the main area */}
          <pattern id={id("dots")} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill={SAGE} fillOpacity="0.35" />
          </pattern>
        </defs>
      </svg>

      {/* ===== Main-area decoration: one glow, one dotted field, one faint branch ===== */}
      <svg
        className="pointer-events-none absolute right-0 top-0 h-[320px] w-[320px]"
        viewBox="0 0 320 320"
        aria-hidden="true"
      >
        <rect width="320" height="320" fill={`url(#${id("glow")})`} />
        <rect x="170" y="0" width="150" height="130" fill={`url(#${id("dots")})`} opacity="0.7" />
      </svg>

      <Branch
        color={FOREST}
        className="pointer-events-none absolute -bottom-8 -right-6 h-[260px] w-[200px] rotate-[18deg] opacity-[0.07]"
      />

      {/* ===== Sidebar ===== */}
      <aside className="relative w-[248px] shrink-0 overflow-hidden px-7 py-10 text-[#f5f5e9]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <rect width="100%" height="100%" fill={`url(#${id("side")})`} />
          <rect width="100%" height="100%" fill={`url(#${id("leaves")})`} opacity="0.12" />
        </svg>

        {/* Large branch rising from the bottom, fading into the background */}
        <svg
          viewBox="0 0 200 260"
          className="pointer-events-none absolute -bottom-4 left-1/2 h-[330px] w-[254px] -translate-x-1/2 opacity-30"
          fill="none"
          aria-hidden="true"
        >
          <g mask={`url(#${id("branchMask")})`}>
            <path d="M100 258 C97 190 103 100 100 16" stroke="#d1d8a9" strokeWidth="1.6" strokeLinecap="round" />
            {BRANCH_LEAVES.map((l, i) => (
              <g key={i} transform={`translate(100 ${l.y}) rotate(${l.a}) scale(${l.s})`}>
                <path d={LEAF} fill="#d1d8a9" fillOpacity="0.2" stroke="#d1d8a9" strokeWidth="0.9" />
              </g>
            ))}
          </g>
        </svg>

        <div className="relative">
          {/* Arched monogram with gold gradient outline */}
          <svg width="64" height="80" viewBox="0 0 64 80" className="mb-8" aria-hidden="true">
            <path
              d="M3 77 V32 A29 29 0 0 1 61 32 V77 Z"
              fill="#ffffff"
              fillOpacity="0.07"
              stroke={`url(#${id("gold")})`}
              strokeWidth="1.8"
            />
            <path
              d="M10 77 V33 A22 22 0 0 1 54 33 V77"
              fill="none"
              stroke={`url(#${id("gold")})`}
              strokeWidth="0.7"
              opacity="0.55"
            />
            <text
              x="32"
              y="56"
              textAnchor="middle"
              fontSize="28"
              fontFamily="Georgia, 'Times New Roman', serif"
              fill="#f5f5e9"
            >
              {initial}
            </text>
          </svg>

          <SidebarTitle icon={<ContactIcon />}>Contact</SidebarTitle>
          <ul className="mb-9 mt-3 space-y-3 break-words text-[11px] text-white/85">
            {props.contact.length ? props.contact.map((item) => <li key={item}>{item}</li>) : <li>Add contact details</li>}
          </ul>

          <Wave color={GOLD} className="mb-7 h-3 w-full opacity-60" />

          <SidebarTitle icon={<SkillsIcon />}>Skills</SidebarTitle>
          <ul className="mb-9 mt-3 space-y-2 text-[11px]">
            {props.skills.length ? (
              props.skills.map((skill) => (
                <li key={skill} className="flex items-start gap-2">
                  <svg width="10" height="8" viewBox="-1 -6 24 12" className="mt-[4px] shrink-0" aria-hidden="true">
                    <path d={LEAF} fill={GOLD} fillOpacity="0.8" />
                  </svg>
                  <span>{skill}</span>
                </li>
              ))
            ) : (
              <li>Add your skills</li>
            )}
          </ul>

          {props.certifications.length > 0 && (
            <>
              <Wave color={GOLD} className="mb-7 h-3 w-full opacity-60" />
              <SidebarTitle icon={<CertificationIcon />}>Certifications</SidebarTitle>
              <ul className="mt-3 space-y-2 break-words text-[11px] text-white/85">
                {props.certifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </aside>

      {/* ===== Main content ===== */}
      <div className="relative min-w-0 flex-1 px-10 py-12">
        <header className="relative mb-9 pb-7">
          <h1 className="break-words font-serif text-[40px] font-light leading-tight text-[#294b38]">
            {props.resume.fullName || "Your Name"}
          </h1>
          <p className="mt-2 text-lg text-[#66876a]">{props.resume.jobTitle || "Professional Title"}</p>

          {/* Gold bud + gradient rule that fades out */}
          <svg
            className="absolute bottom-0 left-0 h-3 w-full"
            viewBox="0 0 400 12"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <rect x="12" y="5" width="388" height="1.6" fill={`url(#${id("rule")})`} />
          </svg>
          <svg width="12" height="12" viewBox="0 0 12 12" className="absolute bottom-0 left-0" aria-hidden="true">
            <circle cx="6" cy="6" r="5" fill={`url(#${id("gold")})`} />
          </svg>
        </header>

        <section className="mb-8">
          <SectionTitle>Profile</SectionTitle>
          <p className="whitespace-pre-wrap text-[#5c695f]">
            {props.resume.summary || "Add a concise professional summary."}
          </p>
        </section>

        <section className="relative mb-8 border-l-2 border-[#bdcdb8] pl-5">
          <VineNode />
          <SectionTitle>Experience</SectionTitle>
          {props.experienceEntries}
        </section>

        <section className="relative border-l-2 border-[#bdcdb8] pl-5">
          <VineNode />
          <SectionTitle>Education</SectionTitle>
          {props.educationEntries}
        </section>
      </div>
    </article>
  );
}