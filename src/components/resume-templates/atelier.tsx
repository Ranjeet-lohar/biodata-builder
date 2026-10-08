import type { ComponentType, ReactNode, SVGProps } from "react";
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

/* Atelier: blush and clay palette, arches, botanical line art, scalloped header edge.
   Uses ./resume-icons (shared with the Ledger/Nocturne/Bloom/Bauhaus/Deco templates).
   PDF-safe: no mask, blur, border-image or clip-path. */

const CLAY = "#8f5c52";
const ROSE = "#c7a390";
const BLUSH = "#efe0d3";

/* ---------- Botanical sprig (line art) ---------- */
function Sprig({ className = "", ...rest }: SVGProps<SVGSVGElement>) {
  const leaves = [
    { y: 138, a: -38 },
    { y: 118, a: 38 },
    { y: 96, a: -38 },
    { y: 76, a: 38 },
    { y: 54, a: -38 },
    { y: 34, a: 38 },
  ];
  return (
    <svg viewBox="0 0 120 170" className={className} fill="none" aria-hidden {...rest}>
      <path d="M60 168C57 120 63 70 60 10" stroke={CLAY} strokeWidth="1.4" strokeLinecap="round" />
      {leaves.map((l) => (
        <path
          key={l.y}
          d="M0 0C8-11 22-11 32 0C22 11 8 11 0 0Z"
          transform={`translate(60 ${l.y}) rotate(${l.a < 0 ? 180 + l.a : l.a})`}
          fill={ROSE}
          fillOpacity="0.28"
          stroke={CLAY}
          strokeOpacity="0.8"
          strokeWidth="1.1"
        />
      ))}
      <path d="M60 10C54 4 54-2 60-8C66-2 66 4 60 10Z" fill={ROSE} fillOpacity="0.4" stroke={CLAY} strokeWidth="1.1" />
    </svg>
  );
}

/* ---------- Leaf marker for timelines ---------- */
function LeafMarker({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <path d="M2 14C2 6 7 2 14 2C14 9 10 14 2 14Z" fill={ROSE} fillOpacity="0.55" stroke={CLAY} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M2 14 10 6" stroke={CLAY} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Section title: arch icon chip + serif title + diamond rule ---------- */
function SectionTitle({ icon: Icon, children }: { icon: ComponentType<IconProps>; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-10 w-8 items-center justify-center rounded-b-[6px] rounded-t-full bg-[#f2e2d6] text-[#8f5c52] ring-1 ring-[#ddc1ae]">
        <Icon className="mt-1 h-4 w-4" />
      </span>
      <h3 className="font-serif text-[19px] font-semibold tracking-tight text-[#231f1d]">{children}</h3>
      <span className="h-px flex-1 bg-gradient-to-r from-[#c7a390] to-transparent" />
      <svg viewBox="0 0 10 10" className="h-2 w-2" aria-hidden>
        <path d="M5 0 10 5 5 10 0 5Z" fill={ROSE} />
      </svg>
    </div>
  );
}

/* ---------- Template ---------- */
export default function AtelierTemplate(props: ResumeTemplateDesignProps) {
  const uid = useUid();
  const id = (n: string) => `atelier-${n}-${uid}`;

  const name = props.resume.fullName || "Your Name";
  const summary =
    props.resume.summary ||
    "Calm, polished professional with excellent judgment, expressive communication, and a strong ability to lead through change.";
  const skills = props.skills.length ? props.skills : ["Client Relations", "Brand Strategy", "Operations"];
  const certifications = props.certifications.length ? props.certifications : ["UX Design Foundations", "Project Leadership"];
  const contact = props.contact.length ? props.contact : ["hello@email.com", "+00 00000 00000", "City, Country"];

  const scallops = 20;
  const sw = 794 / scallops;

  return (
    <article className="resume-page relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-[#f8f4ee] text-[13px] leading-relaxed text-[#2f2d2b] shadow-xl">
      {/* ===== Page texture: fine dot grid ===== */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id={id("dots")} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={CLAY} fillOpacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id("dots")})`} />
      </svg>

      {/* ===== Header artwork: blush band, scalloped edge, concentric rings ===== */}
      <svg className="absolute left-0 top-0 h-[290px] w-full" viewBox="0 0 794 290" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={id("band")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f3e6da" />
            <stop offset="55%" stopColor={BLUSH} />
            <stop offset="100%" stopColor="#e8d2c2" />
          </linearGradient>
        </defs>
        <rect width="794" height="262" fill={`url(#${id("band")})`} />
        {Array.from({ length: scallops }, (_, i) => (
          <circle key={i} cx={i * sw + sw / 2} cy="262" r={sw / 2} fill={`url(#${id("band")})`} />
        ))}
        {/* scallop outlines */}
        <path
          d={Array.from({ length: scallops }, (_, i) => `M${i * sw} 262A${sw / 2} ${sw / 2} 0 0 0 ${(i + 1) * sw} 262`).join("")}
          fill="none"
          stroke={CLAY}
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <g fill="none" stroke={CLAY}>
          <circle cx="118" cy="120" r="56" strokeOpacity="0.3" />
          <circle cx="118" cy="120" r="84" strokeOpacity="0.2" strokeDasharray="2 5" strokeLinecap="round" />
          <circle cx="118" cy="120" r="112" strokeOpacity="0.12" />
          <circle cx="676" cy="140" r="46" strokeOpacity="0.3" />
          <circle cx="676" cy="140" r="74" strokeOpacity="0.2" strokeDasharray="2 5" strokeLinecap="round" />
          <circle cx="676" cy="140" r="102" strokeOpacity="0.12" />
        </g>
      </svg>

      {/* Sprigs on both sides of the header */}
      <Sprig className="absolute left-9 top-8 h-[150px] w-[106px] -rotate-12" />
      <Sprig className="absolute right-9 top-8 h-[150px] w-[106px] rotate-12 -scale-x-100" />

      {/* ===== Header content ===== */}
      <header className="relative flex h-[262px] flex-col items-center pt-8 text-center">
        <div className="relative h-[92px] w-[76px]">
          <svg viewBox="0 0 76 92" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d="M4 92V38A34 34 0 0 1 72 38V92Z" fill="#ffffff" stroke={CLAY} strokeWidth="2" />
            <path d="M12 92V40A26 26 0 0 1 64 40V92Z" fill="none" stroke={ROSE} strokeWidth="1" strokeDasharray="2 4" strokeLinecap="round" />
          </svg>
          <span className="absolute inset-x-0 top-[30px] text-center font-serif text-[26px] font-semibold text-[#8f5c52]">
            {getInitials(name)}
          </span>
        </div>
        <h1 className="mt-4 font-serif text-[42px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#231f1d]">{name}</h1>
        <p className="mt-1.5 text-[14px] font-medium text-[#75635d]">{props.resume.jobTitle || "Professional Title"}</p>
        <svg viewBox="0 0 160 12" className="mt-3 h-3 w-40" aria-hidden>
          <path d="M0 6H62M98 6H160" stroke={CLAY} strokeOpacity="0.6" strokeWidth="1" />
          <path d="M80 0 86 6 80 12 74 6Z" fill={CLAY} />
        </svg>
      </header>

      {/* ===== Contact row ===== */}
      <ul className="relative mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-11 text-[11.5px] text-[#544943]">
        {contact.map((item, i) => {
          const Icon = contactIcon(item);
          return (
            <li key={item} className="flex items-center gap-3">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-[#c7a390]" />}
              <span className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 shrink-0 text-[#8f5c52]" />
                <span className="break-all">{item}</span>
              </span>
            </li>
          );
        })}
      </ul>

      {/* ===== Body ===== */}
      <div className="relative grid grid-cols-[1.3fr_0.7fr] gap-8 px-11 pb-28 pt-9">
        <main className="space-y-8">
          <section>
            <SectionTitle icon={UserIcon}>Summary</SectionTitle>
            <p className="max-w-[34rem] leading-6 text-[#3b3633]">{summary}</p>
          </section>

          <section>
            <SectionTitle icon={BriefcaseIcon}>Experience</SectionTitle>
            <div className="relative pl-7">
              <span className="absolute bottom-1 left-[7px] top-5 w-px bg-gradient-to-b from-[#c7a390] to-transparent" />
              <LeafMarker className="absolute left-0 top-0.5 h-4 w-4" />
              <div className="space-y-5">{props.experienceEntries}</div>
            </div>
          </section>

          <section>
            <SectionTitle icon={CapIcon}>Education</SectionTitle>
            <div className="relative pl-7">
              <span className="absolute bottom-1 left-[7px] top-5 w-px bg-gradient-to-b from-[#c7a390] to-transparent" />
              <LeafMarker className="absolute left-0 top-0.5 h-4 w-4 -scale-x-100" />
              <div className="space-y-4">{props.educationEntries}</div>
            </div>
          </section>
        </main>

        <aside className="space-y-6">
          {/* Skills: arched window card */}
          <section className="relative overflow-hidden rounded-b-[20px] rounded-t-[110px] bg-[#f2e2d6] px-4 pb-6 pt-7 ring-1 ring-[#ddc1ae]">
            <div className="mb-3 flex flex-col items-center gap-1.5 text-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#8f5c52] ring-1 ring-[#ddc1ae]">
                <BoltIcon className="h-4 w-4" />
              </span>
              <h3 className="font-serif text-[17px] font-semibold text-[#231f1d]">Skills</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {skills.map((skill) => (
                <span key={skill} className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#453d39] ring-1 ring-[#ddc1ae]">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="rounded-[20px] border border-[#e3d5cb] bg-white/70 p-4">
            <h3 className="mb-3 flex items-center gap-2 font-serif text-[17px] font-semibold text-[#231f1d]">
              <BadgeIcon className="h-4 w-4 text-[#8f5c52]" />
              Certifications
            </h3>
            <ul className="space-y-2.5 text-[12px] text-[#4e4743]">
              {certifications.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f2e2d6] text-[#8f5c52]">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <Sprig className="mx-auto h-[120px] w-[84px] opacity-80" />
        </aside>
      </div>

      {/* ===== Footer: arch row ===== */}
      <svg className="absolute bottom-0 left-0 h-9 w-full" viewBox="0 0 794 36" preserveAspectRatio="none" aria-hidden>
        <path
          d={Array.from({ length: 26 }, (_, i) => {
            const w = 794 / 26;
            const x = i * w;
            return `M${x} 36V20A${w / 2} ${w / 2} 0 0 1 ${x + w} 20V36`;
          }).join("")}
          fill={BLUSH}
          fillOpacity="0.8"
          stroke={CLAY}
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      </svg>
    </article>
  );
}