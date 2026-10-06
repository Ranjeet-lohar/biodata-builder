import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

/* ---------- Icons (inline SVG, stroke-based, inherit currentColor) ---------- */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const MailIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);

const PhoneIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);

const PinIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const LinkIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1" />
  </svg>
);

const UserIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

const BriefcaseIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
  </svg>
);

const CapIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="m2 9 10-5 10 5-10 5L2 9Z" />
    <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 9v6" />
  </svg>
);

const SparkIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>
);

const AwardIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="9" r="6" />
    <path d="m8.5 14 -1.5 7 5-3 5 3-1.5-7" />
  </svg>
);

const CheckIcon = ({ className }: IconProps) => (
  <svg {...base} strokeWidth={2.4} className={className}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

/* ---------- Helpers ---------- */

function contactIcon(value: string) {
  const v = value.toLowerCase();
  if (v.includes("@")) return MailIcon;
  if (/(https?:\/\/|www\.|linkedin|github|\.com|\.dev|\.io)/.test(v)) return LinkIcon;
  if (/^[+()\d\s.-]{7,}$/.test(value.trim())) return PhoneIcon;
  return PinIcon;
}

function SectionHeading({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#176b55] text-white">
        {icon}
      </span>
      <h2 className="text-[13px] font-bold tracking-wide text-[#176b55]">{children}</h2>
      <span className="h-px flex-1 bg-gradient-to-r from-[#c6ddd3] to-transparent" />
    </div>
  );
}

/* ---------- Template ---------- */

export default function ModernTemplate(props: ResumeTemplateDesignProps) {
  return (
    <article
      className="relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed shadow-xl [print-color-adjust:exact] [-webkit-print-color-adjust:exact] print:shadow-none"
      style={{ color: "#20332e", fontFamily: "Arial, sans-serif" }}
    >
      {/* ===== Header ===== */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#0f5543] via-[#176b55] to-[#1f8a6c] px-12 py-12 text-white">
        {/* Topographic contour lines + dot grid */}
        <svg
          aria-hidden="true"
          viewBox="0 0 794 260"
          preserveAspectRatio="xMaxYMid slice"
          className="pointer-events-none absolute inset-0 h-full w-full"
          fill="none"
        >
          <defs>
            <pattern id="mt-dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="white" />
            </pattern>
            <linearGradient id="mt-fade" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0.35" stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="white" stopOpacity="1" />
            </linearGradient>
            <mask id="mt-mask">
              <rect width="794" height="260" fill="url(#mt-fade)" />
            </mask>
          </defs>

          <g mask="url(#mt-mask)">
            <rect width="794" height="260" fill="url(#mt-dots)" opacity="0.18" />
            <g stroke="white" strokeWidth="1.1" opacity="0.22">
              <path d="M520 300C560 220 620 250 670 170S760 90 830 120" />
              <path d="M500 300C550 205 615 238 665 152S765 66 840 96" />
              <path d="M480 300C540 190 610 226 660 134S770 42 850 72" />
              <path d="M460 300C530 175 605 214 655 116S775 18 860 48" />
              <path d="M440 300C520 160 600 202 650 98S780-6 870 24" />
            </g>
          </g>

          {/* Accent ring cluster */}
          <circle cx="712" cy="44" r="64" stroke="white" strokeWidth="1.2" opacity="0.2" />
          <circle cx="712" cy="44" r="38" stroke="white" strokeWidth="1.2" opacity="0.28" />
          <circle cx="712" cy="44" r="12" fill="#a7f0d2" opacity="0.55" />
        </svg>

        <div className="relative">
          <h1 className="break-words text-[38px] font-bold leading-tight">
            {props.resume.fullName || "Your Name"}
          </h1>
          <p className="mt-1.5 text-lg text-emerald-100">
            {props.resume.jobTitle || "Professional Title"}
          </p>

          {props.contact.length ? (
            <ul className="mt-6 flex max-w-2xl flex-wrap gap-x-5 gap-y-2 text-[11px] text-white/95">
              {props.contact.map((item) => {
                const Icon = contactIcon(item);
                return (
                  <li key={item} className="flex items-center gap-1.5 break-all">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                      <Icon className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 text-[11px] text-white/80">Email, phone, location</p>
          )}
        </div>

        {/* Wavy bottom edge */}
        <svg
          aria-hidden="true"
          viewBox="0 0 794 14"
          preserveAspectRatio="none"
          className="absolute -bottom-px left-0 h-3.5 w-full"
        >
          <path d="M0 14V6c60 8 120 8 200 2s160-8 260-2 200 8 334-2v10Z" fill="white" />
        </svg>
      </header>

      {/* ===== Body ===== */}
      <div className="relative grid grid-cols-[1fr_220px] gap-9 px-12 pb-12 pt-9">
        {/* Faint diagonal pattern in lower-left corner */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-48 w-72"
          fill="none"
        >
          <defs>
            <pattern id="mt-diag" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#176b55" strokeWidth="1" />
            </pattern>
            <linearGradient id="mt-diag-fade" x1="0" x2="1" y1="1" y2="0">
              <stop offset="0" stopColor="white" stopOpacity="1" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="mt-diag-mask">
              <rect width="100%" height="100%" fill="url(#mt-diag-fade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#mt-diag)" opacity="0.07" mask="url(#mt-diag-mask)" />
        </svg>

        {/* Main column */}
        <div className="relative">
          <section className="mb-8">
            <SectionHeading icon={<UserIcon className="h-3.5 w-3.5" />}>About</SectionHeading>
            <p className="whitespace-pre-wrap text-[#5d716a]">
              {props.resume.summary || "Add a concise professional summary."}
            </p>
          </section>

          <section className="mb-8">
            <SectionHeading icon={<BriefcaseIcon className="h-3.5 w-3.5" />}>Experience</SectionHeading>
            {props.resume.experience.length ? (
              <div className="relative space-y-6 pl-6">
                <span className="absolute bottom-1 left-[5px] top-1 w-px bg-gradient-to-b from-[#176b55] via-[#c6ddd3] to-transparent" />
                {props.resume.experience.map((item) => (
                  <article key={item.id} className="relative break-inside-avoid">
                    <span className="absolute -left-[25px] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-white ring-2 ring-[#176b55]">
                      <span className="h-1 w-1 rounded-full bg-[#176b55]" />
                    </span>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-bold">{item.role || "Position"}</h3>
                      <p className="shrink-0 rounded-full bg-[#e9f3ed] px-2 py-0.5 text-[10px] text-[#176b55]">
                        {[item.startDate, item.endDate].filter(props.hasValue).join(" — ")}
                      </p>
                    </div>
                    <p className="font-medium text-[#176b55]">
                      {[item.company, item.location].filter(props.hasValue).join(" · ") || "Company"}
                    </p>
                    {props.hasValue(item.description) && (
                      <p className="mt-2 whitespace-pre-wrap text-[#5d716a]">{item.description}</p>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-[#71857d]">Add your professional experience.</p>
            )}
          </section>

          <section>
            <SectionHeading icon={<CapIcon className="h-3.5 w-3.5" />}>Education</SectionHeading>
            {props.resume.education.length ? (
              <div className="space-y-4">
                {props.resume.education.map((item) => (
                  <article key={item.id} className="break-inside-avoid">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-bold">{item.degree || "Degree"}</h3>
                      <p className="shrink-0 rounded-full bg-[#e9f3ed] px-2 py-0.5 text-[10px] text-[#176b55]">
                        {[item.startDate, item.endDate].filter(props.hasValue).join(" — ")}
                      </p>
                    </div>
                    <p className="font-medium text-[#176b55]">
                      {[item.institution, item.location].filter(props.hasValue).join(" · ") || "Institution"}
                    </p>
                    {props.hasValue(item.details) && (
                      <p className="mt-1 whitespace-pre-wrap text-[#5d716a]">{item.details}</p>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-[#71857d]">Add your education details.</p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="relative -my-2 overflow-hidden rounded-2xl bg-[#f1f7f3] px-5 py-6 ring-1 ring-[#dcebe3]">
          {/* Dot-grid texture */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            fill="none"
          >
            <defs>
              <pattern id="mt-side-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1" fill="#176b55" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mt-side-dots)" opacity="0.1" />
          </svg>

          <div className="relative">
            <section className="mb-7">
              <SectionHeading icon={<SparkIcon className="h-3.5 w-3.5" />}>Skills</SectionHeading>
              {props.skills.length ? (
                <ul className="space-y-1.5">
                  {props.skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-[11px] shadow-sm ring-1 ring-[#dcebe3]"
                    >
                      <CheckIcon className="h-3 w-3 shrink-0 text-[#176b55]" />
                      <span className="break-words">{skill}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-[#71857d]">Add skills separated by commas</p>
              )}
            </section>

            {props.certifications.length > 0 && (
              <section>
                <SectionHeading icon={<AwardIcon className="h-3.5 w-3.5" />}>Certifications</SectionHeading>
                <ul className="space-y-2.5 text-[11px] text-[#5d716a]">
                  {props.certifications.map((item) => (
                    <li key={item} className="flex gap-2">
                      <AwardIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#176b55]" />
                      <span className="break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}