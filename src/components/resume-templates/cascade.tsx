import { useId } from "react";
import type { ReactNode, SVGProps } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

/*
  PDF-safe notes:
  - no SVG <mask>, CSS backdrop-blur, border-image or clip-path (these break in many PDF exporters)
  - only hex colors, linearGradient, pattern and plain paths
  - `resume-page` / `resume-entry` classes are hooks for your print CSS
*/

/* ---------- SVG icons (stroke = currentColor) ---------- */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const MailIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7.5 8.5 6 8.5-6" />
  </svg>
);
const PhoneIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
const PinIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const LinkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
);
const UserIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c1-4 4-6 8-6s7 2 8 6" />
  </svg>
);
const BriefcaseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 13h18" />
  </svg>
);
const CapIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m2 9 10-5 10 5-10 5L2 9Z" />
    <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
  </svg>
);
const StepsIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 20h5v-5h5v-5h5V5h3" />
  </svg>
);
const BadgeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="m9 14-1.5 7 4.5-2.5 4.5 2.5L15 14" />
  </svg>
);

function contactIcon(value: string) {
  const v = value.trim().toLowerCase();
  if (v.includes("@")) return MailIcon;
  if (/^(https?:|www\.)|linkedin|github|portfolio|\.(com|in|io|dev|net)(\/|$)/.test(v)) return LinkIcon;
  if (/^[+()\d][\d\s()+-]{6,}$/.test(v)) return PhoneIcon;
  return PinIcon;
}

/* ---------- Section title: icon chip + title + stepped rule ---------- */
function SectionTitle({ icon: Icon, children }: { icon: (p: IconProps) => ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#163d40] to-[#2f7c6f] text-[#d9f1ea]">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="text-[16px] font-bold tracking-tight text-[#17373a]">{children}</h3>
      {/* stepped rule, echoes the "cascade" idea */}
      <svg className="h-3 flex-1" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
        <path d="M0 11H60V6H120V1H200" fill="none" stroke="#b9d9cf" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/* ---------- Template ---------- */
export default function CascadeTemplate(props: ResumeTemplateDesignProps) {
  const uid = useId().replace(/:/g, "");
  const id = (n: string) => `cascade-${n}-${uid}`;

  const name = props.resume.fullName || "Your Name";
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "Y";

  const summary =
    props.resume.summary ||
    "Impact-driven professional with a history of building resilient teams, simplifying processes, and delivering measurable growth.";
  const skills = props.skills.length ? props.skills : ["Strategy", "Analysis", "Team Leadership"];
  const certifications = props.certifications.length ? props.certifications : ["Digital Transformation", "Agile Fundamentals"];
  const contact = props.contact.length ? props.contact : ["hello@email.com", "+00 00000 00000", "City, Country"];

  return (
    <article className="resume-page relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-[#f6faf8] text-[13px] leading-relaxed text-[#1f2a2d] shadow-xl">
      {/* ===== Header artwork: layered waves + step pattern ===== */}
      <svg className="absolute left-0 top-0 h-[190px] w-full" viewBox="0 0 794 190" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={id("band")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#123d40" />
            <stop offset="55%" stopColor="#2d6f67" />
            <stop offset="100%" stopColor="#7db9a7" />
          </linearGradient>
          <linearGradient id={id("band-2")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1b5a57" />
            <stop offset="100%" stopColor="#a7d6ca" />
          </linearGradient>
          <pattern id={id("steps")} width="24" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 15H8V8H16V1H24" fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1" />
          </pattern>
        </defs>
        {/* back wave */}
        <path d="M0 0H794V120C690 160 600 100 470 124C340 148 230 170 0 130Z" fill={`url(#${id("band-2")})`} fillOpacity="0.55" />
        {/* middle wave */}
        <path d="M0 0H794V88C700 126 610 70 480 94C350 118 220 140 0 98Z" fill={`url(#${id("band")})`} fillOpacity="0.9" />
        {/* front band with pattern overlay */}
        <path d="M0 0H794V56C690 86 600 40 470 62C340 84 200 104 0 70Z" fill={`url(#${id("band")})`} />
        <path d="M0 0H794V56C690 86 600 40 470 62C340 84 200 104 0 70Z" fill={`url(#${id("steps")})`} />
        {/* light accent crest */}
        <path d="M0 70C200 104 340 84 470 62C600 40 690 86 794 56" fill="none" stroke="#d9f1ea" strokeOpacity="0.6" strokeWidth="1.5" />
      </svg>

      <div className="relative px-10 pb-14 pt-9">
        {/* ===== Header card ===== */}
        <header className="relative mb-8 mt-6 rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-[#d8e6e0]">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h1 className="text-[34px] font-bold leading-[1.05] tracking-[-0.04em] text-[#17373a]">{name}</h1>
              <p className="mt-2 text-[14px] font-medium text-[#2f7c6f]">{props.resume.jobTitle || "Professional Title"}</p>
            </div>

            {/* monogram with gradient ring */}
            <div className="relative h-[72px] w-[72px] shrink-0">
              <svg viewBox="0 0 72 72" className="absolute inset-0 h-full w-full" aria-hidden>
                <defs>
                  <linearGradient id={id("ring")} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#163d40" />
                    <stop offset="100%" stopColor="#7db9a7" />
                  </linearGradient>
                </defs>
                <circle cx="36" cy="36" r="33" fill="#17373a" />
                <circle cx="36" cy="36" r="33" fill="none" stroke={`url(#${id("ring")})`} strokeWidth="3" />
                <circle cx="36" cy="36" r="27" fill="none" stroke="#a7d6ca" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 4" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[24px] font-bold text-white">{initials}</span>
            </div>
          </div>

          <ul className="mt-4 grid grid-cols-3 gap-x-4 gap-y-2 border-t border-[#e3eee9] pt-4 text-[11.5px] text-[#375a5d]">
            {contact.map((item) => {
              const Icon = contactIcon(item);
              return (
                <li key={item} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e6f4ef] text-[#2f7c6f]">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="break-all">{item}</span>
                </li>
              );
            })}
          </ul>
        </header>

        {/* ===== Body ===== */}
        <div className="grid grid-cols-[1.5fr_0.8fr] gap-8">
          <main className="space-y-7">
            <section>
              <SectionTitle icon={UserIcon}>Summary</SectionTitle>
              <p className="max-w-[34rem] text-[#2a3e3d]">{summary}</p>
            </section>

            <section>
              <SectionTitle icon={BriefcaseIcon}>Experience</SectionTitle>
              {/* cascading timeline: spine + stepped nodes */}
              <div className="relative pl-6">
                <span className="absolute bottom-1 left-[5px] top-1 w-[2px] rounded-full bg-gradient-to-b from-[#2f7c6f] via-[#7db9a7] to-[#e3eee9]" />
                <span className="absolute left-0 top-1 h-3 w-3 rounded-full border-[3px] border-[#2f7c6f] bg-white" />
                <div className="space-y-5">{props.experienceEntries}</div>
              </div>
            </section>

            <section>
              <SectionTitle icon={CapIcon}>Education</SectionTitle>
              <div className="relative pl-6">
                <span className="absolute bottom-1 left-[5px] top-1 w-[2px] rounded-full bg-gradient-to-b from-[#7db9a7] to-[#e3eee9]" />
                <span className="absolute left-0 top-1 h-3 w-3 rounded-full border-[3px] border-[#7db9a7] bg-white" />
                <div className="space-y-4">{props.educationEntries}</div>
              </div>
            </section>
          </main>

          <aside className="space-y-5">
            {/* Skills: dark card with cascade artwork */}
            <section className="relative overflow-hidden rounded-[22px] bg-[#17373a] p-5 text-white shadow-sm">
              <svg className="absolute bottom-0 right-0 h-24 w-32" viewBox="0 0 128 96" aria-hidden>
                <defs>
                  <linearGradient id={id("bars")} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#a7d6ca" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#a7d6ca" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path d="M0 96V80H32V62H64V44H96V26H128V96Z" fill={`url(#${id("bars")})`} />
                <path d="M0 80H32V62H64V44H96V26H128" fill="none" stroke="#a7d6ca" strokeOpacity="0.4" strokeWidth="1.2" />
              </svg>

              <div className="relative">
                <h3 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-[#d9f1ea]">
                  <StepsIcon className="h-4 w-4" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-1.5 pb-10">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-[#edf8f5] ring-1 ring-white/15">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Certifications */}
            <section className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-[#ddede8]">
              <h3 className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-[#17373a]">
                <BadgeIcon className="h-4 w-4 text-[#2f7c6f]" />
                Certifications
              </h3>
              <ul className="space-y-2.5 text-[12px] text-[#385b5c]">
                {certifications.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e6f4ef] text-[#2f7c6f]">
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {/* ===== Footer: mirrored wave ===== */}
      <svg className="absolute bottom-0 left-0 h-12 w-full" viewBox="0 0 794 48" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={id("foot")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7db9a7" />
            <stop offset="100%" stopColor="#123d40" />
          </linearGradient>
        </defs>
        <path d="M0 48V30C140 6 260 44 400 28C540 12 660 36 794 14V48Z" fill={`url(#${id("foot")})`} fillOpacity="0.35" />
        <path d="M0 48V38C150 18 270 50 410 36C550 22 670 42 794 28V48Z" fill={`url(#${id("foot")})`} />
      </svg>
    </article>
  );
}