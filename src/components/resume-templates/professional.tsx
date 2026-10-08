import type { CSSProperties, ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";

const TEAL = "#247b83";
const DEEP = "#1a5a60";
const SUN = "#e9b44c";

/* ---------- Icons (stroke-based, currentColor, no ids) ---------- */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const Icons = {
  contact: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7 L12 13 L21 7" />
    </svg>
  ),
  skills: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="18" cy="9" r="2.4" />
      <circle cx="9" cy="18" r="2.4" />
      <path d="M8 7 L16 8.5 M7.4 8.2 L8.4 15.6 M16.6 11 L11 16.6" />
    </svg>
  ),
  certification: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M9.6 9 L11.4 10.8 L14.6 7.4" />
      <path d="M8.5 13.8 L7 21 L12 18.5 L17 21 L15.5 13.8" />
    </svg>
  ),
  profile: (s = 13) => (
    <svg width={s} height={s} {...base}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21" />
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
  check: (s = 12) => (
    <svg width={s} height={s} {...base} strokeWidth={2.4}>
      <path d="M5 12.5 L10 17.5 L19 7" />
    </svg>
  ),
};

function contactIcon(text: string) {
  const t = text.toLowerCase();
  if (t.includes("@")) return Icons.mail();
  if (/(https?:\/\/|www\.|linkedin|github|behance|\.com|\.in|\.org)/.test(t)) return Icons.globe();
  if (/^[+\d][\d\s().-]{6,}$/.test(text.trim())) return Icons.phone();
  return Icons.pin();
}

/* ---------- Generated geometry ---------- */
/* Constellation for the sidebar (svg 245x250) */
const NODES: [number, number, number][] = [
  [28, 40, 4], [88, 18, 3], [150, 62, 5], [210, 28, 3.5], [60, 108, 3.5],
  [124, 132, 4.5], [196, 120, 3], [30, 178, 3], [96, 204, 4], [172, 190, 5], [226, 226, 3.5],
];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [2, 5], [5, 6], [3, 6],
  [4, 7], [5, 8], [7, 8], [8, 9], [5, 9], [9, 10], [6, 9],
];

/* Dot grid for the header, fading toward the left (svg 300x110) */
const GRID = Array.from({ length: 9 * 20 }, (_, n) => {
  const r = Math.floor(n / 20);
  const c = n % 20;
  return { cx: c * 15 + 6, cy: r * 13 + 6, o: +(0.04 + (c / 19) * 0.3).toFixed(3) };
});

/* ---------- Decorative pieces ---------- */
function Dot({ size = 6, color = TEAL }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" className="shrink-0" aria-hidden="true">
      <circle cx="5" cy="5" r="4.2" fill={color} />
    </svg>
  );
}

/* Fixed-size rounded-square badge, so it can't collapse */
function Badge({ icon, size = 26, tone = TEAL }: { icon: ReactNode; size?: number; tone?: string }) {
  return (
    <span className="relative flex shrink-0 items-center justify-center text-white" style={{ width: size, height: size }}>
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <rect width={size} height={size} rx={size * 0.3} fill={tone} />
        <circle cx={size - 3} cy="3" r="2" fill="#fff" fillOpacity="0.4" />
      </svg>
      <span className="relative">{icon}</span>
    </span>
  );
}

function SectionTitle({
  icon,
  style,
  children,
}: {
  icon: ReactNode;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Badge icon={icon} />
      <h2 className="shrink-0" style={{ ...style, margin: 0 }}>
        {children}
      </h2>
      <span className="h-px min-w-[8px] flex-1 bg-[#dce5e7]" />
      <Dot size={5} color={SUN} />
    </div>
  );
}

function SidebarTitle({
  icon,
  style,
  children,
}: {
  icon: ReactNode;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <Badge icon={icon} size={22} tone={DEEP} />
      <h2 className="shrink-0" style={{ ...style, margin: 0 }}>
        {children}
      </h2>
      <span className="h-px min-w-[6px] flex-1 bg-[#247b83]/30" />
    </div>
  );
}

function Entry({ children }: { children: ReactNode }) {
  return (
    <article className="relative">
      <svg width="13" height="13" viewBox="0 0 13 13" className="absolute -left-[26.5px] top-[3px]" aria-hidden="true">
        <circle cx="6.5" cy="6.5" r="5.5" fill="#fff" stroke={TEAL} strokeWidth="1.6" />
        <circle cx="6.5" cy="6.5" r="2.2" fill={TEAL} />
      </svg>
      {children}
    </article>
  );
}

function DatePill({ children, muted }: { children: ReactNode; muted: string }) {
  return (
    <span
      className="shrink-0 whitespace-nowrap rounded-full border border-[#cfe0e2] bg-[#f3f8f8] px-2.5 py-0.5 text-[10.5px]"
      style={{ color: muted }}
    >
      {children}
    </span>
  );
}

export default function ProfessionalTemplate(props: ResumeTemplateDesignProps) {
  const initial = (props.resume.fullName || "Y").trim().charAt(0).toUpperCase();
  const contactItems = props.contact.length ? props.contact : ["Add your contact details"];
  const dates = (a?: string, b?: string) =>
    [a, b].filter((value): value is string => value !== undefined && props.hasValue(value)).join(" — ");

  return (
    <article
      className="relative mx-auto flex min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed shadow-xl"
      style={{ color: props.ink, fontFamily: "Arial, sans-serif" }}
    >
      {/* ===== Sidebar ===== */}
      <aside className="relative w-[245px] shrink-0 overflow-hidden bg-[#edf3f3] px-8 pb-[150px] pt-10">
        {/* Constellation, bottom */}
        <svg className="pointer-events-none absolute bottom-[60px] left-0" width="245" height="250" viewBox="0 0 245 250" fill="none" aria-hidden="true">
          {EDGES.map(([a, b], i) => (
            <line key={i} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke={TEAL} strokeOpacity="0.2" strokeWidth="1" />
          ))}
          {NODES.map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r + 4} fill={TEAL} fillOpacity="0.07" />
              <circle cx={x} cy={y} r={r} fill={i === 5 ? SUN : TEAL} fillOpacity={i === 5 ? 0.9 : 0.35} />
            </g>
          ))}
        </svg>

        {/* Layered waves, very bottom */}
        <svg className="pointer-events-none absolute bottom-0 left-0" width="245" height="96" viewBox="0 0 245 96" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C50 14 90 66 140 40 S210 20 245 34 V96 H0 Z" fill={TEAL} fillOpacity="0.14" />
          <path d="M0 58 C46 36 96 82 150 58 S210 46 245 54 V96 H0 Z" fill={TEAL} fillOpacity="0.24" />
          <path d="M0 76 C60 58 100 94 160 74 S220 70 245 72 V96 H0 Z" fill={DEEP} fillOpacity="0.9" />
        </svg>

        <div className="relative">
          {/* Stamp monogram with an orbit dot */}
          <svg width="76" height="76" viewBox="0 0 76 76" className="mb-8" aria-hidden="true">
            <circle cx="38" cy="38" r="35" fill="none" stroke={TEAL} strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 4" />
            <circle cx="38" cy="38" r="28" fill={TEAL} />
            <circle cx="38" cy="38" r="24" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.8" />
            <text x="38" y="49" textAnchor="middle" fontSize="30" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">
              {initial}
            </text>
            <circle cx="62.7" cy="13.3" r="4.2" fill={SUN} />
          </svg>

          <section className="mb-8">
            <SidebarTitle icon={Icons.contact()} style={props.headingStyle}>
              Contact
            </SidebarTitle>
            <ul className="space-y-2.5 break-words text-[12px]" style={{ color: props.muted }}>
              {contactItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-[2px] shrink-0" style={{ color: TEAL }}>
                    {props.contact.length ? contactIcon(item) : null}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <SidebarTitle icon={Icons.skills()} style={props.headingStyle}>
              Core skills
            </SidebarTitle>
            {props.skills.length > 0 ? (
              <ul className="space-y-2">
                {props.skills.map((skill) => (
                  <li key={skill} className="flex items-start gap-2 border-b border-[#cfe0e2] pb-2">
                    <span className="mt-[5px]">
                      <Dot size={7} />
                    </span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px]" style={{ color: props.muted }}>
                Add skills separated by commas
              </p>
            )}
          </section>

          {props.certifications.length > 0 && (
            <section>
              <SidebarTitle icon={Icons.certification()} style={props.headingStyle}>
                Certifications
              </SidebarTitle>
              <ul className="space-y-2.5">
                {props.certifications.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 break-words rounded-md border border-[#cfe0e2] bg-white/80 p-2 text-[12px]">
                    <span className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#247b83] text-white">
                      {Icons.check(11)}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </aside>

      {/* ===== Main ===== */}
      <div className="relative min-w-0 flex-1 px-10 pb-14 pt-12">
        {/* Dot grid, top-right */}
        <svg className="pointer-events-none absolute right-0 top-0" width="300" height="118" viewBox="0 0 300 118" aria-hidden="true">
          {GRID.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r="1.6" fill={TEAL} fillOpacity={d.o} />
          ))}
        </svg>

        {/* Corner tab */}
        <svg className="pointer-events-none absolute right-0 top-0" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
          <polygon points="0,0 64,0 64,64" fill={TEAL} />
          <polygon points="26,0 64,0 64,38" fill="#fff" fillOpacity="0.2" />
          <circle cx="52" cy="12" r="3" fill={SUN} />
        </svg>

        <header className="relative mb-9 pb-7">
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-8 shrink-0 rounded-full bg-[#247b83]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: props.accent }}>
              Professional Resume
            </p>
          </div>
          <h1 className="mt-3 max-w-[330px] break-words text-[34px] font-bold leading-tight" style={{ color: props.ink }}>
            {props.resume.fullName || "Your Name"}
          </h1>
          <p className="mt-2 max-w-[330px] text-lg" style={{ color: props.muted }}>
            {props.resume.jobTitle || "Professional Title"}
          </p>

          <div className="absolute inset-x-0 bottom-0 flex items-center">
            <span className="h-[3px] w-20 shrink-0 bg-[#247b83]" />
            <span className="h-px min-w-[8px] flex-1 bg-[#dce5e7]" />
            <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#e9b44c]" />
          </div>
        </header>

        <section className="mb-8">
          <SectionTitle icon={Icons.profile()} style={props.headingStyle}>
            Profile
          </SectionTitle>
          <p className="whitespace-pre-wrap" style={{ color: props.muted }}>
            {props.resume.summary || "Add a concise professional summary."}
          </p>
        </section>

        <section className="mb-8">
          <SectionTitle icon={Icons.experience()} style={props.headingStyle}>
            Experience
          </SectionTitle>
          {props.resume.experience.length > 0 ? (
            <div className="ml-[6px] space-y-6 border-l border-[#cfe0e2] pl-5">
              {props.resume.experience.map((item) => (
                <Entry key={item.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-bold">{item.role || "Position"}</h3>
                      <p style={{ color: props.muted }}>
                        {[item.company, item.location].filter(props.hasValue).join(" · ") || "Company"}
                      </p>
                    </div>
                    {dates(item.startDate, item.endDate) && (
                      <DatePill muted={props.muted}>{dates(item.startDate, item.endDate)}</DatePill>
                    )}
                  </div>
                  {props.hasValue(item.description) && (
                    <p className="mt-2 whitespace-pre-wrap" style={{ color: props.muted }}>
                      {item.description}
                    </p>
                  )}
                </Entry>
              ))}
            </div>
          ) : (
            <p style={{ color: props.muted }}>Add your professional experience.</p>
          )}
        </section>

        <section>
          <SectionTitle icon={Icons.education()} style={props.headingStyle}>
            Education
          </SectionTitle>
          {props.resume.education.length > 0 ? (
            <div className="ml-[6px] space-y-5 border-l border-[#cfe0e2] pl-5">
              {props.resume.education.map((item) => (
                <Entry key={item.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-bold">{item.degree || "Degree"}</h3>
                      <p style={{ color: props.muted }}>
                        {[item.institution, item.location].filter(props.hasValue).join(" · ") || "Institution"}
                      </p>
                    </div>
                    {dates(item.startDate, item.endDate) && (
                      <DatePill muted={props.muted}>{dates(item.startDate, item.endDate)}</DatePill>
                    )}
                  </div>
                  {props.hasValue(item.details) && (
                    <p className="mt-2 whitespace-pre-wrap" style={{ color: props.muted }}>
                      {item.details}
                    </p>
                  )}
                </Entry>
              ))}
            </div>
          ) : (
            <p style={{ color: props.muted }}>Add your education details.</p>
          )}
        </section>
      </div>

      {/* ===== Footer strip ===== */}
      <div className="absolute inset-x-0 bottom-0 flex h-1.5">
        <span className="w-[245px] shrink-0 bg-[#1a5a60]" />
        <span className="w-full bg-[#247b83]" />
        <span className="w-24 shrink-0 bg-[#e9b44c]" />
      </div>
    </article>
  );
}