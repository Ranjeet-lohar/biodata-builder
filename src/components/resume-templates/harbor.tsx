import { useId } from "react";
import type { ReactNode, SVGProps } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

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
const SparkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>
);
const BadgeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="9" r="5.5" />
    <path d="m9 14-1.5 7 4.5-2.5 4.5 2.5L15 14" />
  </svg>
);

/* Pick an icon from what the contact string looks like */
function contactIcon(value: string) {
  const v = value.trim().toLowerCase();
  if (v.includes("@")) return MailIcon;
  if (/^(https?:|www\.)|linkedin|github|portfolio|\.(com|in|io|dev|net)(\/|$)/.test(v)) return LinkIcon;
  if (/^[+()\d][\d\s()+-]{6,}$/.test(v)) return PhoneIcon;
  return PinIcon;
}

/* ---------- Headings ---------- */
function SectionTitle({ icon: Icon, children }: { icon: (p: IconProps) => ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1b5b62] to-[#2f8f8a] text-[#e6f5ea]">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="text-[16px] font-semibold tracking-tight text-[#193d48]">{children}</h3>
      <span className="h-[2px] flex-1 rounded-full bg-gradient-to-r from-[#bcd7c4] to-transparent" />
    </div>
  );
}

function SideHeading({ icon: Icon, children }: { icon: (p: IconProps) => ReactNode; children: ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[#d1e4d4]">
      <Icon className="h-4 w-4" />
      {children}
    </h3>
  );
}

/* ---------- Template ---------- */
export default function HarborTemplate(props: ResumeTemplateDesignProps) {
  // useId contains ":" which is awkward inside url(#...), so strip it
  const uid = useId().replace(/:/g, "");
  const bgId = `harbor-bg-${uid}`;
  const glowId = `harbor-glow-${uid}`;
  const waveId = `harbor-wave-${uid}`;
  const ringId = `harbor-ring-${uid}`;
  const mainWaveId = `harbor-main-wave-${uid}`;

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
    "Strategic and people-focused professional with a strong record of improving operations and delivering meaningful business outcomes.";
  const skills = props.skills.length ? props.skills : ["Operations", "Communication", "Leadership"];
  const certifications = props.certifications.length ? props.certifications : ["Digital Marketing", "HR Management"];
  const contact = props.contact.length ? props.contact : ["hello@email.com", "+00 00000 00000", "City, Country"];

  return (
    <article className="relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-[#f7f5f0] text-[13px] leading-relaxed text-[#1d2f37] shadow-xl">
      <div className="relative grid min-h-[1123px] grid-cols-[236px_1fr]">
        {/* ===== Sidebar ===== */}
        <aside className="relative overflow-hidden text-white">
          {/* Gradient + wave pattern + glow in one SVG */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 236 1123"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            <defs>
              <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f2f3a" />
                <stop offset="50%" stopColor="#193d48" />
                <stop offset="100%" stopColor="#1b5b62" />
              </linearGradient>
              <radialGradient id={glowId} cx="0.2" cy="0" r="0.9">
                <stop offset="0%" stopColor="#d1e4d4" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#d1e4d4" stopOpacity="0" />
              </radialGradient>
              <pattern id={waveId} width="48" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M0 10 Q12 0 24 10 T48 10"
                  fill="none"
                  stroke="#d1e4d4"
                  strokeOpacity="0.14"
                  strokeWidth="1.2"
                />
              </pattern>
            </defs>
            <rect width="236" height="1123" fill={`url(#${bgId})`} />
            <rect width="236" height="1123" fill={`url(#${waveId})`} />
            <rect width="236" height="420" fill={`url(#${glowId})`} />
          </svg>

          <div className="relative px-7 pb-10 pt-10">
            {/* Monogram with gradient ring */}
            <div className="relative mb-7 h-[84px] w-[84px]">
              <svg className="absolute inset-0" width="84" height="84" viewBox="0 0 84 84" aria-hidden>
                <defs>
                  <linearGradient id={ringId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#e6f5ea" />
                    <stop offset="100%" stopColor="#5fb3a6" />
                  </linearGradient>
                </defs>
                <circle cx="42" cy="42" r="39" fill="#ffffff" fillOpacity="0.08" stroke={`url(#${ringId})`} strokeWidth="2.5" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[28px] font-semibold tracking-tight text-[#e6f5ea]">
                {initials}
              </span>
            </div>

            <h1 className="text-[27px] font-bold leading-tight tracking-tight text-white">{name}</h1>
            <p className="mt-2 text-[13px] font-medium text-[#bcd7c4]">{props.resume.jobTitle || "Professional Title"}</p>

            <section className="mt-9">
              <SideHeading icon={UserIcon}>Contact</SideHeading>
              <ul className="space-y-2.5 text-[12px] text-[#edf4ef]">
                {contact.map((item) => {
                  const Icon = contactIcon(item);
                  return (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#d1e4d4]">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="break-all pt-0.5">{item}</span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="mt-9">
              <SideHeading icon={SparkIcon}>Skills</SideHeading>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-[#edfbf2] ring-1 ring-white/15"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* ===== Main column ===== */}
        <main className="relative overflow-hidden">
          {/* Soft sage wave wash in the top corner */}
          <svg className="absolute right-0 top-0 h-40 w-[360px]" viewBox="0 0 360 160" fill="none" aria-hidden>
            <defs>
              <pattern id={mainWaveId} width="48" height="20" patternUnits="userSpaceOnUse">
                <path d="M0 10 Q12 0 24 10 T48 10" stroke="#1b5b62" strokeOpacity="0.1" strokeWidth="1.2" />
              </pattern>
              <linearGradient id={`${mainWaveId}-fade`} x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <mask id={`${mainWaveId}-mask`}>
                <rect width="360" height="160" fill={`url(#${mainWaveId}-fade)`} />
              </mask>
            </defs>
            <rect width="360" height="160" fill={`url(#${mainWaveId})`} mask={`url(#${mainWaveId}-mask)`} />
          </svg>

          <div className="relative space-y-8 px-9 pb-10 pt-12">
            <section>
              <SectionTitle icon={UserIcon}>Summary</SectionTitle>
              <p className="max-w-[30rem] text-[#35515b]">{summary}</p>
            </section>

            <section>
              <SectionTitle icon={BriefcaseIcon}>Experience</SectionTitle>
              <div className="space-y-5 border-l-2 border-[#dfe7dc] pl-5">{props.experienceEntries}</div>
            </section>

            <section>
              <SectionTitle icon={CapIcon}>Education</SectionTitle>
              <div className="space-y-4 border-l-2 border-[#dfe7dc] pl-5">{props.educationEntries}</div>
            </section>

            <section>
              <SectionTitle icon={BadgeIcon}>Certifications</SectionTitle>
              <ul className="space-y-2 text-[#35515b]">
                {certifications.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#1b5b62]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>
    </article>
  );
}