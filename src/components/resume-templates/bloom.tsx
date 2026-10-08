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

/* Bloom: soft pastel blobs, centered header, stacked rounded cards.
   PDF-safe: no mask, blur, border-image or clip-path. */

type Tone = { bg: string; fg: string };
const TONES: Tone[] = [
  { bg: "#f3e8ff", fg: "#7c3aed" }, // lilac
  { bg: "#ffe4e6", fg: "#e11d48" }, // rose
  { bg: "#dcfce7", fg: "#16a34a" }, // mint
  { bg: "#ffedd5", fg: "#ea580c" }, // peach
  { bg: "#cffafe", fg: "#0891b2" }, // sky
];

function Card({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_-18px_rgba(139,92,246,0.45)] ring-1 ring-[#f0e4fa]">
      {children}
    </section>
  );
}

function Title({ icon: Icon, tone, children }: { icon: ComponentType<IconProps>; tone: Tone; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: tone.bg, color: tone.fg }}>
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="text-[16px] font-bold tracking-tight text-[#3b2a56]">{children}</h3>
    </div>
  );
}

const SPARKLE = "M0 -9 2.2 -2.2 9 0 2.2 2.2 0 9 -2.2 2.2 -9 0 -2.2 -2.2Z";

export default function BloomTemplate(props: ResumeTemplateDesignProps) {
  const uid = useUid();
  const id = (n: string) => `bloom-${n}-${uid}`;

  const name = props.resume.fullName || "Your Name";
  const summary =
    props.resume.summary ||
    "Warm, organized professional who brings people together, keeps projects moving, and cares about the details.";
  const skills = props.skills.length ? props.skills : ["Communication", "Planning", "Creativity", "Teamwork"];
  const certifications = props.certifications.length ? props.certifications : ["Project Coordination", "Customer Success"];
  const contact = props.contact.length ? props.contact : ["hello@email.com", "+00 00000 00000", "City, Country"];

  return (
    <article className="resume-page relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-[#fdf8ff] text-[13px] leading-relaxed text-[#4a3d63] shadow-xl">
      {/* ===== Background blobs and sparkles ===== */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 794 1123" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={id("lilac")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>
          <linearGradient id={id("peach")} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fecdd3" />
          </linearGradient>
          <linearGradient id={id("mint")} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#bbf7d0" />
            <stop offset="100%" stopColor="#a5f3fc" />
          </linearGradient>
        </defs>
        <path d="M0 0H330C312 64 258 104 194 114C114 128 62 176 0 200Z" fill={`url(#${id("lilac")})`} />
        <path d="M794 0V214C728 192 676 140 688 78C694 40 728 16 760 0Z" fill={`url(#${id("peach")})`} />
        <path d="M0 1123V1008C62 988 132 1020 172 1072C186 1090 190 1108 190 1123Z" fill={`url(#${id("mint")})`} />
        <path d="M794 1123V1042C728 1030 660 1062 618 1123Z" fill={`url(#${id("lilac")})`} />
        <g fillOpacity="0.9">
          <path d={SPARKLE} transform="translate(236 64)" fill="#f0abfc" />
          <path d={SPARKLE} transform="translate(570 52) scale(0.7)" fill="#fdba74" />
          <path d={SPARKLE} transform="translate(130 252) scale(0.6)" fill="#c4b5fd" />
          <path d={SPARKLE} transform="translate(668 262) scale(0.8)" fill="#fda4af" />
          <path d={SPARKLE} transform="translate(244 1066) scale(0.7)" fill="#86efac" />
          <path d={SPARKLE} transform="translate(560 1070) scale(0.6)" fill="#c4b5fd" />
        </g>
      </svg>

      <div className="relative px-11 pb-16 pt-12">
        {/* ===== Centered header ===== */}
        <header className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-4 h-[96px] w-[96px]">
            <svg viewBox="0 0 96 96" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <linearGradient id={id("mono")} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fda4af" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              <circle cx="48" cy="48" r="45" fill="none" stroke="#c4b5fd" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" />
              <circle cx="48" cy="48" r="38" fill={`url(#${id("mono")})`} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[28px] font-bold text-white">
              {getInitials(name)}
            </span>
          </div>
          <h1 className="text-[36px] font-bold leading-[1.1] tracking-[-0.03em] text-[#3b2a56]">{name}</h1>
          <p className="mt-1.5 text-[15px] font-medium text-[#8b5cf6]">{props.resume.jobTitle || "Professional Title"}</p>

          <ul className="mt-5 flex flex-wrap justify-center gap-2 text-[11.5px] text-[#4a3d63]">
            {contact.map((item, i) => {
              const Icon = contactIcon(item);
              const tone = TONES[i % TONES.length];
              return (
                <li key={item} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-[#eadcf7]">
                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: tone.fg }} />
                  <span className="break-all">{item}</span>
                </li>
              );
            })}
          </ul>
        </header>

        {/* ===== Stacked cards ===== */}
        <div className="space-y-5">
          <Card>
            <Title icon={UserIcon} tone={TONES[0]}>About me</Title>
            <p className="leading-6">{summary}</p>
          </Card>

          <Card>
            <Title icon={BriefcaseIcon} tone={TONES[1]}>Experience</Title>
            <div className="relative pl-6">
              <span className="absolute bottom-1 left-[5px] top-2 w-[2px] rounded-full bg-gradient-to-b from-[#c4b5fd] via-[#fda4af] to-transparent" />
              <span className="absolute left-0 top-1 h-3 w-3 rounded-full bg-[#c4b5fd] ring-4 ring-[#f3e8ff]" />
              <div className="space-y-5">{props.experienceEntries}</div>
            </div>
          </Card>

          <Card>
            <Title icon={CapIcon} tone={TONES[2]}>Education</Title>
            <div className="relative pl-6">
              <span className="absolute bottom-1 left-[5px] top-2 w-[2px] rounded-full bg-gradient-to-b from-[#86efac] via-[#a5f3fc] to-transparent" />
              <span className="absolute left-0 top-1 h-3 w-3 rounded-full bg-[#86efac] ring-4 ring-[#dcfce7]" />
              <div className="space-y-4">{props.educationEntries}</div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-5">
            <Card>
              <Title icon={BoltIcon} tone={TONES[3]}>Skills</Title>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => {
                  const tone = TONES[i % TONES.length];
                  return (
                    <span
                      key={skill}
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={{ backgroundColor: tone.bg, color: tone.fg }}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </Card>

            <Card>
              <Title icon={BadgeIcon} tone={TONES[4]}>Certifications</Title>
              <ul className="space-y-2.5 text-[12px]">
                {certifications.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#cffafe] text-[#0891b2]">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </article>
  );
}
