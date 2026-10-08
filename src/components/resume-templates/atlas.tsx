import { useId } from "react";
import type { ReactNode, SVGProps } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

/*
  PDF-safe: no SVG <mask>, backdrop-blur, border-image or CSS clip-path.
  Hooks for print CSS: `resume-page` on the article; add `resume-entry` to each entry component.
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
const FoldIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3 21 20H3L12 3Z" />
    <path d="M12 3v17M7.5 11.5 12 20" />
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

/* ---------- Section title: folded-triangle chip + title + short gradient bar ---------- */
function Heading({ icon: Icon, children }: { icon: (p: IconProps) => ReactNode; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2742d8] to-[#5f8bff] text-white">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="text-[16px] font-bold tracking-tight text-[#0e1330]">{children}</h3>
      <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-[#2742d8] to-[#3ddbb0]" />
    </div>
  );
}

/* ---------- Template ---------- */
export default function AtlasTemplate(props: ResumeTemplateDesignProps) {
  const uid = useId().replace(/:/g, "");
  const id = (n: string) => `origami-${n}-${uid}`;

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
    "Curious, detail-minded professional who simplifies complex work into clear steps and steady results.";
  const skills = props.skills.length ? props.skills : ["Problem Solving", "Communication", "Planning"];
  const certifications = props.certifications.length ? props.certifications : ["Project Management", "Data Analytics"];
  const contact = props.contact.length ? props.contact : ["hello@email.com", "+00 00000 00000", "City, Country"];

  const triangleCount = 24;
  const tw = 794 / triangleCount;

  return (
    <article className="resume-page relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed text-[#2a3150] shadow-xl">
      {/* ===== Sidebar background + folded-paper artwork (right column, 258px) ===== */}
      <svg
        className="absolute right-0 top-0 h-full w-[258px]"
        viewBox="0 0 258 1123"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={id("panel")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e9eeff" />
            <stop offset="100%" stopColor="#f8faff" />
          </linearGradient>
          <pattern id={id("tri")} width="40" height="36" patternUnits="userSpaceOnUse">
            <path d="M0 36 20 2 40 36Z" fill="none" stroke="#2742d8" strokeOpacity="0.07" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="258" height="1123" fill={`url(#${id("panel")})`} />
        <rect width="258" height="1123" fill={`url(#${id("tri")})`} />
        <path d="M0 0V1123" stroke="#d3dcff" strokeWidth="1" />
      </svg>

      <svg className="absolute right-0 top-0 h-[250px] w-[258px]" viewBox="0 0 258 250" aria-hidden>
        <defs>
          <linearGradient id={id("fold-a")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1b2a8f" />
            <stop offset="100%" stopColor="#2742d8" />
          </linearGradient>
          <linearGradient id={id("fold-b")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2742d8" />
            <stop offset="100%" stopColor="#7aa7ff" />
          </linearGradient>
          <linearGradient id={id("fold-c")} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#3ddbb0" />
            <stop offset="100%" stopColor="#7aa7ff" />
          </linearGradient>
        </defs>
        <polygon points="0,0 258,0 258,170" fill={`url(#${id("fold-b")})`} />
        <polygon points="0,0 258,170 0,130" fill={`url(#${id("fold-a")})`} />
        <polygon points="258,70 258,250 110,250" fill={`url(#${id("fold-c")})`} fillOpacity="0.9" />
        <polygon points="0,130 100,250 0,250" fill="#7aa7ff" fillOpacity="0.45" />
        <polygon points="176,0 258,0 258,74" fill="#ffffff" fillOpacity="0.2" />
        <polygon points="0,0 70,0 0,52" fill="#ffffff" fillOpacity="0.12" />
        {/* fold lines */}
        <g fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1">
          <path d="M0 0 258 170" />
          <path d="M258 70 110 250" />
          <path d="M0 130 100 250" />
          <path d="M176 0 258 74" />
        </g>
      </svg>

      {/* Diamond monogram, sits on the fold */}
      <div className="absolute right-[93px] top-[104px] h-[72px] w-[72px]">
        <svg viewBox="0 0 72 72" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <linearGradient id={id("diamond")} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#dbe6ff" />
            </linearGradient>
          </defs>
          <path d="M36 2 70 36 36 70 2 36Z" fill={`url(#${id("diamond")})`} stroke="#2742d8" strokeWidth="2" strokeLinejoin="round" />
          <path d="M36 12 60 36 36 60 12 36Z" fill="none" stroke="#2742d8" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 3" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[22px] font-extrabold text-[#2742d8]">{initials}</span>
      </div>

      {/* ===== Layout ===== */}
      <div className="relative grid grid-cols-[1fr_258px]">
        {/* ----- Main column ----- */}
        <main className="px-10 pb-24 pt-12">
          <header className="mb-9 pr-2">
            <h1 className="text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#0e1330]">{name}</h1>
            <p className="mt-3 text-[16px] font-semibold text-[#2742d8]">{props.resume.jobTitle || "Professional Title"}</p>
            {/* small triangle row */}
            <svg className="mt-4 h-3 w-24" viewBox="0 0 96 12" aria-hidden>
              <polygon points="0,12 8,0 16,12" fill="#2742d8" />
              <polygon points="20,12 28,0 36,12" fill="#7aa7ff" />
              <polygon points="40,12 48,0 56,12" fill="#3ddbb0" />
              <polygon points="60,12 68,0 76,12" fill="#2742d8" fillOpacity="0.25" />
            </svg>
          </header>

          <div className="space-y-8">
            <section>
              <Heading icon={UserIcon}>Summary</Heading>
              <p className="max-w-[34rem] leading-6 text-[#3a4263]">{summary}</p>
            </section>

            <section>
              <Heading icon={BriefcaseIcon}>Experience</Heading>
              <div className="relative pl-7">
                <span className="absolute bottom-1 left-[6px] top-3 w-[2px] rounded-full bg-gradient-to-b from-[#2742d8] via-[#7aa7ff] to-transparent" />
                <svg className="absolute left-0 top-0 h-3.5 w-3.5" viewBox="0 0 14 14" aria-hidden>
                  <polygon points="2,1 13,7 2,13" fill="#2742d8" />
                </svg>
                <div className="space-y-5">{props.experienceEntries}</div>
              </div>
            </section>

            <section>
              <Heading icon={CapIcon}>Education</Heading>
              <div className="relative pl-7">
                <span className="absolute bottom-1 left-[6px] top-3 w-[2px] rounded-full bg-gradient-to-b from-[#3ddbb0] via-[#7aa7ff] to-transparent" />
                <svg className="absolute left-0 top-0 h-3.5 w-3.5" viewBox="0 0 14 14" aria-hidden>
                  <polygon points="2,1 13,7 2,13" fill="#3ddbb0" />
                </svg>
                <div className="space-y-4">{props.educationEntries}</div>
              </div>
            </section>
          </div>
        </main>

        {/* ----- Sidebar content ----- */}
        <aside className="relative space-y-7 px-7 pb-24 pt-[210px]">
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-[14px] font-bold text-[#0e1330]">
              <UserIcon className="h-4 w-4 text-[#2742d8]" />
              Contact
            </h3>
            <ul className="space-y-2.5 text-[12px] text-[#2a3150]">
              {contact.map((item) => {
                const Icon = contactIcon(item);
                return (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[#2742d8] ring-1 ring-[#cfdaff]">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="break-all pt-0.5">{item}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 text-[14px] font-bold text-[#0e1330]">
              <FoldIcon className="h-4 w-4 text-[#2742d8]" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-[11px] font-medium text-[#1b2a8f] ring-1 ring-[#cfdaff]"
                >
                  <svg viewBox="0 0 10 10" className="h-2 w-2 shrink-0" aria-hidden>
                    <polygon points="5,0 10,10 0,10" fill="#2742d8" />
                  </svg>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 text-[14px] font-bold text-[#0e1330]">
              <BadgeIcon className="h-4 w-4 text-[#2742d8]" />
              Certifications
            </h3>
            <ul className="space-y-2.5">
              {certifications.map((item) => (
                <li key={item} className="flex items-start gap-2.5 rounded-xl bg-white p-3 text-[12px] text-[#2a3150] ring-1 ring-[#cfdaff]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#dff8ef] text-[#0f9d77]">
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

      {/* ===== Footer: row of folded triangles ===== */}
      <svg className="absolute bottom-0 left-0 h-12 w-full" viewBox="0 0 794 48" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={id("foot")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3ddbb0" />
            <stop offset="50%" stopColor="#7aa7ff" />
            <stop offset="100%" stopColor="#2742d8" />
          </linearGradient>
        </defs>
        {Array.from({ length: triangleCount }, (_, i) => {
          const x = i * tw;
          const up = i % 2 === 0;
          const points = up
            ? `${x},48 ${x + tw / 2},${14 + (i % 3) * 6} ${x + tw},48`
            : `${x},48 ${x + tw / 2},${28 + (i % 3) * 4} ${x + tw},48`;
          return <polygon key={i} points={points} fill={`url(#${id("foot")})`} fillOpacity={up ? 0.9 : 0.4} />;
        })}
      </svg>
    </article>
  );
}