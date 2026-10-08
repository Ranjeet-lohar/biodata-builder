import type { ComponentType, ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";
import {
  BadgeIcon,
  BoltIcon,
  BriefcaseIcon,
  CapIcon,
  CheckIcon,
  UserIcon,
  contactIcon,
  getInitials,
  useUid,
} from "./resume-icons";
import type { IconProps } from "./resume-icons";

/* Deco: emerald and gold, sunburst fan, double frame, centered section titles.
   Entries render on a pale page, so their own text colors stay readable.
   PDF-safe: no mask, blur, border-image or clip-path. */

const GOLD = "#c9a24d";
const GOLD_LIGHT = "#e8cf8e";
const EMERALD = "#0b3b32";

/** Radiating lines from (cx, cy), angles in degrees (screen coords, so 180-360 points upward). */
function fan(cx: number, cy: number, r1: number, r2: number, count: number, a0: number, a1: number) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const a = ((a0 + ((a1 - a0) * i) / (count - 1)) * Math.PI) / 180;
    d += `M${(cx + r1 * Math.cos(a)).toFixed(1)} ${(cy + r1 * Math.sin(a)).toFixed(1)}`;
    d += `L${(cx + r2 * Math.cos(a)).toFixed(1)} ${(cy + r2 * Math.sin(a)).toFixed(1)}`;
  }
  return d;
}

/** Semicircle arc over the top, centered on (cx, cy). */
const arc = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx + r} ${cy}`;

function Diamond({ className = "h-2 w-2" }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" className={`shrink-0 ${className}`} aria-hidden>
      <path d="M5 0 10 5 5 10 0 5Z" fill={GOLD} />
    </svg>
  );
}

function Title({ icon: Icon, children }: { icon: ComponentType<IconProps>; children: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a24d]" />
      <Diamond />
      <Icon className="h-4 w-4 text-[#c9a24d]" />
      <h3 className="text-[16px] font-bold tracking-tight text-[#0b3b32]">{children}</h3>
      <Diamond />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a24d]" />
    </div>
  );
}

export default function DecoTemplate(props: ResumeTemplateDesignProps) {
  const uid = useUid();
  const id = (n: string) => `deco-${n}-${uid}`;

  const name = props.resume.fullName || "Your Name";
  const summary =
    props.resume.summary ||
    "Poised, exacting professional with a reputation for quiet leadership, careful planning, and dependable delivery.";
  const skills = props.skills.length ? props.skills : ["Leadership", "Negotiation", "Planning", "Reporting"];
  const certifications = props.certifications.length ? props.certifications : ["Chartered Management", "Lean Six Sigma"];
  const contact = props.contact.length ? props.contact : ["hello@email.com", "+00 00000 00000", "City, Country"];

  return (
    <article className="resume-page relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-[#f7f8f6] text-[13px] leading-relaxed text-[#26332f] shadow-xl">
      {/* ===== Header artwork: emerald field with sunburst ===== */}
      <svg className="absolute left-0 top-0 h-[300px] w-full" viewBox="0 0 794 300" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={id("emerald")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a342c" />
            <stop offset="100%" stopColor="#0f4a3f" />
          </linearGradient>
          <linearGradient id={id("gold")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b88a35" />
            <stop offset="50%" stopColor={GOLD_LIGHT} />
            <stop offset="100%" stopColor="#b88a35" />
          </linearGradient>
        </defs>
        <rect width="794" height="300" fill={`url(#${id("emerald")})`} />
        <path d={fan(397, 300, 72, 300, 25, 190, 350)} stroke={GOLD} strokeOpacity="0.28" strokeWidth="1" fill="none" />
        <g fill="none" stroke={GOLD} strokeWidth="1">
          <path strokeOpacity="0.5" d={arc(397, 300, 72)} />
          <path strokeOpacity="0.35" d={arc(397, 300, 120)} />
          <path strokeOpacity="0.25" d={arc(397, 300, 170)} />
          <path strokeOpacity="0.18" d={arc(397, 300, 230)} />
        </g>
        <rect y="296" width="794" height="4" fill={`url(#${id("gold")})`} />
      </svg>

      {/* double frame, drawn above the artwork and below the content */}
      <div className="pointer-events-none absolute inset-[14px] border-2 border-[#c9a24d]/80" />
      <div className="pointer-events-none absolute inset-[21px] border border-[#c9a24d]/40" />

      {/* ===== Header content ===== */}
      <header className="relative flex h-[300px] flex-col items-center px-12 pt-12 text-center">
        <div className="relative h-[68px] w-[68px]">
          <svg viewBox="0 0 68 68" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d="M22 2H46L66 22V46L46 66H22L2 46V22Z" fill={EMERALD} stroke={`url(#${id("gold")})`} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M24 9H44L59 24V44L44 59H24L9 44V24Z" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[22px] font-bold text-[#e8cf8e]">
            {getInitials(name)}
          </span>
        </div>
        <h1 className="mt-4 text-[38px] font-bold leading-[1.1] tracking-[-0.02em] text-[#f7ecd0]">{name}</h1>
        <p className="mt-2 text-[14px] font-medium text-[#e8cf8e]">{props.resume.jobTitle || "Professional Title"}</p>
        <svg viewBox="0 0 160 12" className="mt-4 h-3 w-40" aria-hidden>
          <path d="M0 6H62M98 6H160" stroke={GOLD} strokeWidth="1" />
          <path d="M80 0 86 6 80 12 74 6Z" fill={GOLD} />
        </svg>
      </header>

      {/* ===== Body ===== */}
      <div className="relative px-[52px] pb-32 pt-7">
        <ul className="mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11.5px] text-[#26332f]">
          {contact.map((item, i) => {
            const Icon = contactIcon(item);
            return (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && <Diamond className="h-1.5 w-1.5" />}
                <span className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[#b88a35]" />
                  <span className="break-all">{item}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="space-y-8">
          <section>
            <Title icon={UserIcon}>Profile</Title>
            <p className="mx-auto max-w-[36rem] text-center leading-6 text-[#34443f]">{summary}</p>
          </section>

          <section>
            <Title icon={BriefcaseIcon}>Experience</Title>
            <div className="space-y-5">{props.experienceEntries}</div>
          </section>

          <section>
            <Title icon={CapIcon}>Education</Title>
            <div className="space-y-4">{props.educationEntries}</div>
          </section>

          <section>
            <Title icon={BoltIcon}>Skills</Title>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {skills.map((skill) => (
                <li key={skill} className="flex items-center gap-2 text-[12.5px] font-medium text-[#0b3b32]">
                  <Diamond className="h-2 w-2" />
                  {skill}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <Title icon={BadgeIcon}>Certifications</Title>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5">
              {certifications.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[12.5px]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0b3b32] text-[#e8cf8e]">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* ===== Footer fan (rays point up from the bottom edge) ===== */}
      <svg className="absolute bottom-[22px] left-0 h-[84px] w-full" viewBox="0 0 794 110" preserveAspectRatio="none" aria-hidden>
        <path d={fan(397, 110, 16, 110, 25, 190, 350)} stroke={GOLD} strokeOpacity="0.45" strokeWidth="1" fill="none" />
        <g fill="none" stroke={GOLD} strokeWidth="1">
          <path strokeOpacity="0.6" d={arc(397, 110, 16)} />
          <path strokeOpacity="0.45" d={arc(397, 110, 50)} />
          <path strokeOpacity="0.3" d={arc(397, 110, 84)} />
        </g>
      </svg>
    </article>
  );
}
