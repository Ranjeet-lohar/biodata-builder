import { useId } from "react";
import type { ReactNode, SVGProps } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

/* ---------- SVG icons (stroke = currentColor, so Tailwind text-* colors them) ---------- */
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
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const LinkIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1" />
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
    <path d="M9 7V5.500A1.500 1.500 0 0 1 10.500 4h3A1.500 1.500 0 0 1 15 5.500V7M3 13h18" />
  </svg>
);
const CapIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m2 9 10-5 10 5-10 5L2 9Z" />
    <path d="M6 11.500V16c0 1.500 2.700 3 6 3s6-1.500 6-3v-4.500" />
  </svg>
);
const BoltIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M13 3 5 13.500h6L10 21l8-10.500h-6L13 3Z" />
  </svg>
);
const BadgeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="9" r="5.500" />
    <path d="m9 14-1.500 7 4.500-2.500 4.500 2.500L15 14" />
    <path d="m9.800 9 1.600 1.600L14.500 7.500" />
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

/* ---------- Section heading: icon chip + gradient rule ---------- */
function SectionTitle({ icon: Icon, children }: { icon: (p: IconProps) => ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-sky-500 text-white shadow-sm">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">{children}</h3>
      <span className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
    </div>
  );
}

function SideHeading({ icon: Icon, children }: { icon: (p: IconProps) => ReactNode; children: ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-teal-200">
      <Icon className="h-4 w-4" />
      {children}
    </h3>
  );
}

/* ---------- Template ---------- */
export default function SummitTemplate(props: ResumeTemplateDesignProps) {
  // useId contains ":" which is awkward inside url(#...), so strip it
  const uid = useId().replace(/:/g, "");
  const gradId = `aurora-grad-${uid}`;
  const dotsId = `aurora-dots-${uid}`;
  const ringId = `aurora-ring-${uid}`;

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
    "Disciplined professional with a forward-looking approach to leadership, process improvement, and growth strategy.";
  const skills = props.skills.length ? props.skills : ["Operations", "Planning", "Relationship Management"];
  const certifications = props.certifications.length ? props.certifications : ["Business Analysis", "Advanced Excel"];
  const contact = props.contact.length ? props.contact : ["hello@email.com", "+00 00000 00000", "City, Country"];

  return (
    <article className="relative mx-auto grid min-h-[1123px] w-[794px] grid-cols-[262px_1fr] overflow-hidden bg-white text-[13px] leading-relaxed text-slate-700 shadow-xl">
      {/* ===== Sidebar ===== */}
      <aside className="relative overflow-hidden text-slate-100">
        {/* Background gradient + pattern, one SVG so it scales with the column */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 262 1123"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0b1220" />
              <stop offset="55%" stopColor="#0f2a3d" />
              <stop offset="100%" stopColor="#0e4d5a" />
            </linearGradient>
            <pattern id={dotsId} width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.100" fill="#5eead4" fillOpacity="0.16" />
            </pattern>
          </defs>
          <rect width="262" height="1123" fill={`url(#${gradId})`} />
          <rect width="262" height="1123" fill={`url(#${dotsId})`} />
          {/* concentric arcs, top-right and bottom-left */}
          <g fill="none" stroke="#67e8f9" strokeOpacity="0.14">
            <circle cx="262" cy="0" r="90" />
            <circle cx="262" cy="0" r="130" />
            <circle cx="262" cy="0" r="170" />
            <circle cx="0" cy="1123" r="100" />
            <circle cx="0" cy="1123" r="150" />
            <circle cx="0" cy="1123" r="200" />
          </g>
        </svg>

        <div className="relative flex h-full flex-col gap-8 px-7 py-10">
          {/* Monogram with gradient ring */}
          <div className="flex justify-center">
            <svg width="104" height="104" viewBox="0 0 104 104" aria-hidden className="absolute">
              <defs>
                <linearGradient id={ringId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <circle cx="52" cy="52" r="49" fill="none" stroke={`url(#${ringId})`} strokeWidth="2.500" />
            </svg>
            <div className="flex h-[104px] w-[104px] items-center justify-center text-[34px] font-semibold tracking-tight text-white">
              {initials}
            </div>
          </div>

          <section>
            <SideHeading icon={UserIcon}>Contact</SideHeading>
            <ul className="space-y-2.5 text-[12px]">
              {contact.map((item) => {
                const Icon = contactIcon(item);
                return (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10 text-teal-200">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="break-words pt-0.5 text-slate-200">{item}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <SideHeading icon={BoltIcon}>Skills</SideHeading>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-white/10 px-2 py-1 text-[11px] text-slate-100 ring-1 ring-white/15"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <SideHeading icon={BadgeIcon}>Certifications</SideHeading>
            <ul className="space-y-2 text-[12px]">
              {certifications.map((item) => (
                <li key={item} className="flex items-start gap-2 text-slate-200">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" fill="none" stroke="currentColor" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m5 12.500 4.500 4.500L19 7.500" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>

      {/* ===== Main column ===== */}
      <div className="relative">
        {/* soft gradient wash behind the header */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-br from-teal-50 via-sky-50 to-white" />
        <svg className="absolute right-0 top-0 h-44 w-72 text-teal-500/15" viewBox="0 0 288 176" fill="none" aria-hidden>
          <g stroke="currentColor" strokeWidth="1">
            {Array.from({ length: 9 }).map((_, i) => (
              <path key={i} d={`M${288 - i * 36} 0 L288 ${i * 22}`} />
            ))}
          </g>
        </svg>

        <div className="relative px-9 pb-10 pt-12">
          <header className="mb-9">
            <h1 className="text-[36px] font-bold leading-[1.05] tracking-[-0.03em] text-slate-900">{name}</h1>
            <p className="mt-2 text-[15px] font-medium text-teal-700">{props.resume.jobTitle || "Professional Title"}</p>
          </header>

          <div className="space-y-8">
            <section>
              <SectionTitle icon={UserIcon}>Profile</SectionTitle>
              <p className="max-w-[60ch] text-slate-600">{summary}</p>
            </section>

            <section>
              <SectionTitle icon={BriefcaseIcon}>Experience</SectionTitle>
              <div className="space-y-5 border-l-2 border-slate-100 pl-5">{props.experienceEntries}</div>
            </section>

            <section>
              <SectionTitle icon={CapIcon}>Education</SectionTitle>
              <div className="space-y-4 border-l-2 border-slate-100 pl-5">{props.educationEntries}</div>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}