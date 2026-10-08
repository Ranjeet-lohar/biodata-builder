import type { ReactNode } from "react";
import type { ResumeTemplateDesignProps } from "./shared";
import { CheckIcon, contactIcon, getInitials, useUid } from "./resume-icons";

/* Bauhaus: flat primary colors, hard black borders, offset shadows, geometric shapes.
   PDF-safe: no mask, blur, border-image or clip-path. */

const INK = "#111111";
const RED = "#e63423";
const YELLOW = "#ffc82c";
const BLUE = "#1d4ed8";

type Shape = "circle" | "square" | "triangle";

function ShapeMark({ shape, color, className = "h-6 w-6" }: { shape: Shape; color: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden>
      {shape === "circle" && <circle cx="12" cy="12" r="10" fill={color} stroke={INK} strokeWidth="2.5" />}
      {shape === "square" && <rect x="2.5" y="2.5" width="19" height="19" fill={color} stroke={INK} strokeWidth="2.5" />}
      {shape === "triangle" && <path d="M12 2.5 22 21.5H2Z" fill={color} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />}
    </svg>
  );
}

function MainTitle({ shape, color, children }: { shape: Shape; color: string; children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <ShapeMark shape={shape} color={color} />
      <h3 className="text-[18px] font-extrabold tracking-tight text-[#111111]">{children}</h3>
      <span className="h-[3px] flex-1 bg-[#111111]" />
    </div>
  );
}

function RailBox({
  shape,
  color,
  title,
  className = "bg-white",
  children,
}: {
  shape: Shape;
  color: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`border-2 border-[#111111] p-4 shadow-[4px_4px_0_#111111] ${className}`}>
      <h3 className="mb-3 flex items-center gap-2 text-[14px] font-extrabold">
        <ShapeMark shape={shape} color={color} className="h-5 w-5" />
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function BauhausTemplate(props: ResumeTemplateDesignProps) {
  const uid = useUid();
  const grid = `bauhaus-grid-${uid}`;
  const dots = `bauhaus-dots-${uid}`;

  const name = props.resume.fullName || "Your Name";
  const summary =
    props.resume.summary ||
    "Practical designer-thinker who reduces problems to their essentials and builds clear, honest solutions.";
  const skills = props.skills.length ? props.skills : ["Design Thinking", "Planning", "Prototyping"];
  const certifications = props.certifications.length ? props.certifications : ["UX Foundations", "Project Management"];
  const contact = props.contact.length ? props.contact : ["hello@email.com", "+00 00000 00000", "City, Country"];

  return (
    <article className="resume-page relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed text-[#1c1c1c] shadow-xl">
      {/* ===== Header ===== */}
      <header className="flex items-stretch justify-between border-b-[3px] border-[#111111]">
        <div className="flex-1 px-9 py-9">
          <h1 className="max-w-[440px] text-[44px] font-black leading-[1] tracking-[-0.04em] text-[#111111]">{name}</h1>
          <p className="mt-4 inline-block border-2 border-[#111111] bg-[#ffc82c] px-3 py-1 text-[14px] font-bold text-[#111111]">
            {props.resume.jobTitle || "Professional Title"}
          </p>
        </div>

        {/* shape cluster holding the initials */}
        <div className="relative h-[190px] w-[270px] shrink-0 border-l-[3px] border-[#111111]">
          <svg viewBox="0 0 270 190" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <pattern id={grid} width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M30 0H0V30" fill="none" stroke={INK} strokeOpacity="0.08" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="270" height="190" fill={`url(#${grid})`} />
            <rect x="118" y="26" width="96" height="96" fill={BLUE} stroke={INK} strokeWidth="3" />
            <path d="M178 176 232 70 262 176Z" fill={YELLOW} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d="M270 190H176A94 94 0 0 1 270 96Z" fill={INK} />
            <circle cx="86" cy="98" r="64" fill={RED} stroke={INK} strokeWidth="3" />
          </svg>
          <span className="absolute left-[22px] top-[34px] flex h-[128px] w-[128px] items-center justify-center text-[38px] font-black text-white">
            {getInitials(name)}
          </span>
        </div>
      </header>

      {/* ===== Body ===== */}
      <div className="grid grid-cols-[238px_1fr]">
        {/* Left rail */}
        <aside className="space-y-6 border-r-[3px] border-[#111111] px-5 pb-24 pt-8">
          <RailBox shape="square" color={BLUE} title="Contact" className="bg-[#1d4ed8] text-white">
            <ul className="space-y-2.5 text-[12px]">
              {contact.map((item) => {
                const Icon = contactIcon(item);
                return (
                  <li key={item} className="flex items-start gap-2">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#ffc82c]" />
                    <span className="break-all">{item}</span>
                  </li>
                );
              })}
            </ul>
          </RailBox>

          <RailBox shape="triangle" color={YELLOW} title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span key={skill} className="border-2 border-[#111111] bg-white px-2 py-0.5 text-[11px] font-bold">
                  {skill}
                </span>
              ))}
            </div>
          </RailBox>

          <RailBox shape="circle" color={RED} title="Certifications">
            <ul className="space-y-2 text-[12px]">
              {certifications.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border-2 border-[#111111] bg-[#e63423] text-white">
                    <CheckIcon className="h-2.5 w-2.5" strokeWidth={3.2} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </RailBox>
        </aside>

        {/* Main */}
        <main className="space-y-8 px-8 pb-24 pt-8">
          <section>
            <MainTitle shape="circle" color={RED}>Profile</MainTitle>
            <p className="max-w-[34rem] text-[13.5px] leading-6">{summary}</p>
          </section>

          <section>
            <MainTitle shape="square" color={BLUE}>Experience</MainTitle>
            <div className="relative border-l-[3px] border-[#111111] pl-5">
              <span className="absolute -left-[9px] top-0.5 h-[15px] w-[15px] border-2 border-[#111111] bg-[#e63423]" />
              <div className="space-y-5">{props.experienceEntries}</div>
            </div>
          </section>

          <section>
            <MainTitle shape="triangle" color={YELLOW}>Education</MainTitle>
            <div className="relative border-l-[3px] border-[#111111] pl-5">
              <span className="absolute -left-[9px] top-0.5 h-[15px] w-[15px] border-2 border-[#111111] bg-[#ffc82c]" />
              <div className="space-y-4">{props.educationEntries}</div>
            </div>
          </section>
        </main>
      </div>

      {/* ===== Footer: halftone dots and color blocks ===== */}
      <svg className="absolute bottom-6 right-8 h-[84px] w-[220px]" viewBox="0 0 220 84" aria-hidden>
        <defs>
          <pattern id={dots} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="2.4" fill={INK} />
          </pattern>
        </defs>
        <rect width="220" height="84" fill={`url(#${dots})`} fillOpacity="0.55" />
      </svg>
      <div className="absolute bottom-0 left-0 flex h-4 w-full border-t-[3px] border-[#111111]">
        <span className="h-full flex-[3] bg-[#111111]" />
        <span className="h-full flex-1 bg-[#e63423]" />
        <span className="h-full flex-1 bg-[#ffc82c]" />
        <span className="h-full flex-1 bg-[#1d4ed8]" />
      </div>
    </article>
  );
}
