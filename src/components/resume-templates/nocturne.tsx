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

/* Nocturne: dark circuit-board header, light body.
   Entry components render on white cards, so their own text colors stay readable.
   PDF-safe: no mask, blur, border-image or clip-path (the "glow" is a radial gradient). */

function GradCard({ children }: { children: ReactNode }) {
  // gradient border = 1px padding on a gradient wrapper (no border-image)
  return (
    <section className="rounded-2xl bg-gradient-to-br from-cyan-300 via-violet-300 to-pink-300 p-px">
      <div className="rounded-[15px] bg-white p-5">{children}</div>
    </section>
  );
}

function CardTitle({ icon: Icon, children }: { icon: ComponentType<IconProps>; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a0e1a] text-cyan-300">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="text-[15px] font-bold tracking-tight text-[#0a0e1a]">{children}</h3>
    </div>
  );
}

export default function NocturneTemplate(props: ResumeTemplateDesignProps) {
  const uid = useUid();
  const id = (n: string) => `nocturne-${n}-${uid}`;

  const name = props.resume.fullName || "Your Name";
  const summary =
    props.resume.summary ||
    "Engineer-minded professional who builds reliable, well-documented solutions and ships them on time.";
  const skills = props.skills.length ? props.skills : ["Automation", "Systems Design", "Problem Solving"];
  const certifications = props.certifications.length ? props.certifications : ["Cloud Practitioner", "Agile Fundamentals"];
  const contact = props.contact.length ? props.contact : ["hello@email.com", "+00 00000 00000", "City, Country"];

  return (
    <article className="resume-page relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-[#f1f3f9] text-[13px] leading-relaxed text-[#2a3150] shadow-xl">
      {/* ===== Header artwork ===== */}
      <svg className="absolute left-0 top-0 h-[262px] w-full" viewBox="0 0 794 262" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={id("base")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#070b16" />
            <stop offset="100%" stopColor="#111a35" />
          </linearGradient>
          <radialGradient id={id("g1")} cx="0.82" cy="0.35" r="0.45">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id("g2")} cx="0.98" cy="0.95" r="0.4">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <pattern id={id("circuit")} width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M0 28H18L28 18H56M28 0V18M28 38V56M10 56V46L18 38H40" fill="none" stroke="#22d3ee" strokeOpacity="0.22" strokeWidth="1" />
            <circle cx="18" cy="28" r="2" fill="#22d3ee" fillOpacity="0.55" />
            <circle cx="40" cy="38" r="2" fill="#a78bfa" fillOpacity="0.6" />
          </pattern>
          {/* fades the pattern out toward the text side without using a mask */}
          <linearGradient id={id("fade")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#070b16" stopOpacity="0.97" />
            <stop offset="55%" stopColor="#070b16" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#070b16" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={id("edge")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="55%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <rect width="794" height="262" fill={`url(#${id("base")})`} />
        <rect width="794" height="262" fill={`url(#${id("g1")})`} />
        <rect width="794" height="262" fill={`url(#${id("g2")})`} />
        <rect width="794" height="262" fill={`url(#${id("circuit")})`} />
        <rect width="794" height="262" fill={`url(#${id("fade")})`} />
        <rect y="259" width="794" height="3" fill={`url(#${id("edge")})`} />
      </svg>

      {/* ===== Header content ===== */}
      <header className="relative flex h-[262px] flex-col justify-between px-11 pb-7 pt-11">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-[480px] text-white">
            <h1 className="text-[40px] font-extrabold leading-[1.04] tracking-[-0.035em]">{name}</h1>
            <p className="mt-2 text-[15px] font-medium text-cyan-300">{props.resume.jobTitle || "Professional Title"}</p>
          </div>

          <div className="relative mr-3 h-[92px] w-[92px] shrink-0">
            <svg viewBox="0 0 92 92" className="absolute inset-0 h-full w-full" aria-hidden>
              <circle cx="46" cy="46" r="42" fill="#0d1428" stroke={`url(#${id("edge")})`} strokeWidth="2.5" />
              <circle cx="46" cy="46" r="34" fill="none" stroke="#22d3ee" strokeOpacity="0.35" strokeDasharray="2 5" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[28px] font-extrabold text-white">
              {getInitials(name)}
            </span>
          </div>
        </div>

        <ul className="flex flex-wrap gap-2 text-[11.5px] text-slate-200">
          {contact.map((item) => {
            const Icon = contactIcon(item);
            return (
              <li key={item} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20">
                <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
                <span className="break-all">{item}</span>
              </li>
            );
          })}
        </ul>
      </header>

      {/* ===== Body ===== */}
      <div className="relative grid grid-cols-[1.5fr_0.82fr] gap-6 px-11 pb-20 pt-8">
        <main className="space-y-6">
          <GradCard>
            <CardTitle icon={UserIcon}>Summary</CardTitle>
            <p className="leading-6 text-[#3a4263]">{summary}</p>
          </GradCard>

          <GradCard>
            <CardTitle icon={BriefcaseIcon}>Experience</CardTitle>
            <div className="space-y-5">{props.experienceEntries}</div>
          </GradCard>

          <GradCard>
            <CardTitle icon={CapIcon}>Education</CardTitle>
            <div className="space-y-4">{props.educationEntries}</div>
          </GradCard>
        </main>

        <aside className="space-y-6">
          {/* dark skills card with a signal line */}
          <section className="relative overflow-hidden rounded-2xl bg-[#0a0e1a] p-5 text-white">
            <h3 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-cyan-300">
              <BoltIcon className="h-4 w-4" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-1.5 pb-14">
              {skills.map((skill) => (
                <span key={skill} className="rounded-md bg-cyan-400/10 px-2 py-1 text-[11px] text-cyan-100 ring-1 ring-cyan-300/30">
                  {skill}
                </span>
              ))}
            </div>
            <svg className="absolute bottom-0 left-0 h-14 w-full" viewBox="0 0 200 56" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id={id("sig")} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <path
                d="M0 40H34L44 18L56 48L68 30L80 40H118L128 10L142 50L154 32L164 40H200"
                fill="none"
                stroke={`url(#${id("sig")})`}
                strokeWidth="1.8"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </section>

          <GradCard>
            <CardTitle icon={BadgeIcon}>Certifications</CardTitle>
            <ul className="space-y-2.5 text-[12px] text-[#3a4263]">
              {certifications.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0a0e1a] text-cyan-300">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </GradCard>
        </aside>
      </div>

      {/* ===== Footer strip ===== */}
      <svg className="absolute bottom-0 left-0 h-8 w-full" viewBox="0 0 794 32" preserveAspectRatio="none" aria-hidden>
        <rect width="794" height="32" fill="#070b16" />
        <rect width="794" height="2" fill={`url(#${id("edge")})`} />
        {Array.from({ length: 28 }, (_, i) => (
          <circle key={i} cx={i * 30 + 15} cy="17" r={i % 4 === 0 ? 2.2 : 1.2} fill={i % 2 ? "#22d3ee" : "#a78bfa"} fillOpacity="0.7" />
        ))}
      </svg>
    </article>
  );
}
