import { useId } from "react";
import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const NAVY = "#273b59";
const SLATE = "#53647a";
const LINE = "#cbd3df";

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
  profile: (s = 14) => (
    <svg width={s} height={s} {...base}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21" />
    </svg>
  ),
  experience: (s = 14) => (
    <svg width={s} height={s} {...base}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7 V5 A1.5 1.5 0 0 1 10.5 3.5 H13.5 A1.5 1.5 0 0 1 15 5 V7" />
      <path d="M3 13 H21" />
    </svg>
  ),
  education: (s = 14) => (
    <svg width={s} height={s} {...base}>
      <path d="M2 9 L12 4 L22 9 L12 14 Z" />
      <path d="M6 11.5 V16 C6 17.5 9 19 12 19 C15 19 18 17.5 18 16 V11.5" />
      <path d="M22 9 V15" />
    </svg>
  ),
  skills: (s = 14) => (
    <svg width={s} height={s} {...base}>
      <path d="M12 3 L14.5 9.5 L21 12 L14.5 14.5 L12 21 L9.5 14.5 L3 12 L9.5 9.5 Z" />
    </svg>
  ),
  certification: (s = 14) => (
    <svg width={s} height={s} {...base}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9.6 9 L11.4 10.8 L14.6 7.4" />
      <path d="M8.5 13.8 L7 21 L12 18.5 L17 21 L15.5 13.8" />
    </svg>
  ),
  mail: (s = 12) => (
    <svg width={s} height={s} {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7 L12 13 L21 7" />
    </svg>
  ),
  phone: (s = 12) => (
    <svg width={s} height={s} {...base}>
      <path d="M5 4 H9 L11 9 L8.5 10.5 C9.6 12.8 11.2 14.4 13.5 15.5 L15 13 L20 15 V19 C20 19.6 19.6 20 19 20 C10.7 19.5 4.5 13.3 4 5 C4 4.4 4.4 4 5 4 Z" />
    </svg>
  ),
  pin: (s = 12) => (
    <svg width={s} height={s} {...base}>
      <path d="M12 21 C7 15 5 12 5 9 A7 7 0 0 1 19 9 C19 12 17 15 12 21 Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  globe: (s = 12) => (
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
  if (/(https?:\/\/|www\.|linkedin|github|\.com|\.in|\.org)/.test(t)) return Icons.globe();
  if (/^[+\d][\d\s().-]{6,}$/.test(text.trim())) return Icons.phone();
  return Icons.pin();
}

/* ---------- Small decorative pieces ---------- */
function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3d5a85] to-[#1c2c45] text-white shadow-sm">
        {icon}
      </span>
      <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#273b59]">{children}</h2>
      <span className="h-px flex-1 bg-gradient-to-r from-[#273b59]/60 via-[#cbd3df] to-transparent" />
    </div>
  );
}

function OrnamentDivider() {
  return (
    <div className="mx-auto mt-5 flex w-[320px] items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#273b59]" />
      <svg width="46" height="12" viewBox="0 0 46 12">
        <rect x="2" y="3" width="6" height="6" transform="rotate(45 5 6)" fill={NAVY} opacity="0.45" />
        <rect x="19" y="2" width="8" height="8" transform="rotate(45 23 6)" fill={NAVY} />
        <rect x="38" y="3" width="6" height="6" transform="rotate(45 41 6)" fill={NAVY} opacity="0.45" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#273b59]" />
    </div>
  );
}

function CornerOrnament({ className }: { className: string }) {
  return (
    <svg className={`pointer-events-none absolute ${className}`} width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <path d="M2 32 V8 A6 6 0 0 1 8 2 H32" stroke={NAVY} strokeWidth="1.6" />
      <path d="M8 32 V14 A6 6 0 0 1 14 8 H32" stroke={NAVY} strokeWidth="0.7" opacity="0.5" />
      <circle cx="2" cy="32" r="1.8" fill={NAVY} />
    </svg>
  );
}

export default function ClassicTemplate(props: ResumeTemplateDesignProps) {
  // Unique ids so several templates can render on one page (e.g. a picker)
  const uid = useId().replace(/:/g, "");
  const hatch = `classic-hatch-${uid}`;
  const bar = `classic-bar-${uid}`;
  const fadeDown = `classic-fade-down-${uid}`;
  const fadeUp = `classic-fade-up-${uid}`;

  const contactItems = props.contact.length ? props.contact : ["Email", "Phone", "Location"];

  return (
    <article
      className="relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white px-[58px] py-[52px] text-[13px] leading-relaxed shadow-xl"
      style={{ color: "#263248", fontFamily: "Georgia, serif" }}
    >
      {/* ===== Background layer ===== */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 794 1123"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id={hatch} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke={NAVY} strokeWidth="0.8" opacity="0.35" />
          </pattern>
          <linearGradient id={bar} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1c2c45" />
            <stop offset="55%" stopColor="#3d5a85" />
            <stop offset="100%" stopColor="#8fa6c7" />
          </linearGradient>
          <linearGradient id={fadeDown} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <linearGradient id={fadeUp} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Top gradient bar */}
        <rect x="0" y="0" width="794" height="10" fill={`url(#${bar})`} />
        <rect x="0" y="10" width="794" height="2" fill={NAVY} opacity="0.12" />

        {/* Top-right hatch field, fades downward */}
        <rect x="474" y="12" width="320" height="230" fill={`url(#${hatch})`} />
        <rect x="474" y="12" width="320" height="230" fill={`url(#${fadeDown})`} />

        {/* Bottom-left hatch field, fades upward */}
        <rect x="0" y="893" width="320" height="230" fill={`url(#${hatch})`} />
        <rect x="0" y="893" width="320" height="230" fill={`url(#${fadeUp})`} />

        {/* Soft rings behind header, top-left */}
        <g fill="none" stroke={NAVY}>
          <circle cx="0" cy="12" r="90" opacity="0.08" />
          <circle cx="0" cy="12" r="130" opacity="0.06" />
          <circle cx="0" cy="12" r="170" opacity="0.04" />
        </g>

        {/* Inset frame */}
        <rect x="20" y="24" width="754" height="1079" fill="none" stroke={LINE} strokeWidth="1" />

        {/* Bottom gradient bar */}
        <rect x="0" y="1117" width="794" height="6" fill={`url(#${bar})`} />
      </svg>

      <CornerOrnament className="left-[16px] top-[20px]" />
      <CornerOrnament className="right-[16px] top-[20px] -scale-x-100" />
      <CornerOrnament className="bottom-[20px] left-[16px] -scale-y-100" />
      <CornerOrnament className="bottom-[20px] right-[16px] -scale-100" />

      {/* ===== Content ===== */}
      <div className="relative">
        <header className="pb-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#718096]">Curriculum Vitae</p>
          <h1 className="mt-3 break-words text-[36px] font-bold leading-tight">
            {props.resume.fullName || "Your Name"}
          </h1>
          <p className="mt-2 text-lg text-[#53647a]">{props.resume.jobTitle || "Professional Title"}</p>

          <OrnamentDivider />

          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 break-words text-[11px] text-[#53647a]">
            {contactItems.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="text-[#273b59]">{contactIcon(item)}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </header>

        <section className="mt-6">
          <SectionTitle icon={Icons.profile()}>Professional Profile</SectionTitle>
          <p className="whitespace-pre-wrap text-[#53647a]">
            {props.resume.summary || "Add a concise professional summary."}
          </p>
        </section>

        <section className="mt-7">
          <SectionTitle icon={Icons.experience()}>Experience</SectionTitle>
          {props.resume.experience.length ? (
            <div className="space-y-5">
              {props.resume.experience.map((item) => (
                <article key={item.id} className="relative border-l border-[#cbd3df] pl-4">
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    className="absolute -left-[5px] top-[7px]"
                    aria-hidden="true"
                  >
                    <rect x="1.5" y="1.5" width="6" height="6" transform="rotate(45 4.5 4.5)" fill="#fff" stroke={NAVY} strokeWidth="1.2" />
                  </svg>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-bold">{item.role || "Position"}</h3>
                    <p className="shrink-0 text-[11px] text-[#718096]">
                      {[item.startDate, item.endDate].filter(props.hasValue).join(" — ")}
                    </p>
                  </div>
                  <p className="italic text-[#53647a]">
                    {[item.company, item.location].filter(props.hasValue).join(", ") || "Company"}
                  </p>
                  {props.hasValue(item.description) && (
                    <p className="mt-2 whitespace-pre-wrap text-[#53647a]">{item.description}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-[#718096]">Add your professional experience.</p>
          )}
        </section>

        <section className="mt-7">
          <SectionTitle icon={Icons.education()}>Education</SectionTitle>
          {props.resume.education.length ? (
            <div className="space-y-4">
              {props.resume.education.map((item) => (
                <article key={item.id} className="relative border-l border-[#cbd3df] pl-4">
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    className="absolute -left-[5px] top-[7px]"
                    aria-hidden="true"
                  >
                    <rect x="1.5" y="1.5" width="6" height="6" transform="rotate(45 4.5 4.5)" fill="#fff" stroke={NAVY} strokeWidth="1.2" />
                  </svg>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-bold">{item.degree || "Degree"}</h3>
                    <p className="shrink-0 text-[11px] text-[#718096]">
                      {[item.startDate, item.endDate].filter(props.hasValue).join(" — ")}
                    </p>
                  </div>
                  <p className="text-[#53647a]">
                    {[item.institution, item.location].filter(props.hasValue).join(", ") || "Institution"}
                  </p>
                  {props.hasValue(item.details) && (
                    <p className="mt-1 whitespace-pre-wrap text-[#53647a]">{item.details}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-[#718096]">Add your education details.</p>
          )}
        </section>

        {props.skills.length > 0 && (
          <section className="mt-7">
            <SectionTitle icon={Icons.skills()}>Skills</SectionTitle>
            <ul className="flex flex-wrap gap-2">
              {props.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-[#cbd3df] bg-gradient-to-b from-white to-[#eef2f8] px-3 py-0.5 text-[11px] text-[#273b59]"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

        {props.certifications.length > 0 && (
          <section className="mt-7">
            <SectionTitle icon={Icons.certification()}>Certifications</SectionTitle>
            <ul className="space-y-1.5 text-[#53647a]">
              {props.certifications.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-[3px] text-[#273b59]">{Icons.certification(11)}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}