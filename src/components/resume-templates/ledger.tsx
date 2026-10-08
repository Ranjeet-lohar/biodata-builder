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

/* Ledger: black and white editorial grid with one red-orange accent.
   PDF-safe: no mask, blur, border-image or clip-path. */

function Row({ icon: Icon, label, children }: { icon: ComponentType<IconProps>; label: string; children: ReactNode }) {
  return (
    <section className="grid grid-cols-[132px_1fr] gap-6 border-t border-[#141414]/15 py-6">
      <h3 className="flex items-start gap-2 text-[13px] font-bold text-[#141414]">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#ff4b2b]" />
        {label}
      </h3>
      <div>{children}</div>
    </section>
  );
}

export default function LedgerTemplate(props: ResumeTemplateDesignProps) {
  const uid = useUid();
  const stripes = `ledger-stripes-${uid}`;

  const name = props.resume.fullName || "Your Name";
  const summary =
    props.resume.summary ||
    "Clear thinker who turns messy requirements into simple, dependable systems and communicates them well.";
  const skills = props.skills.length ? props.skills : ["Research", "Systems Thinking", "Documentation"];
  const certifications = props.certifications.length ? props.certifications : ["Project Management", "Data Analytics"];
  const contact = props.contact.length ? props.contact : ["hello@email.com", "+00 00000 00000", "City, Country"];

  return (
    <article className="resume-page relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed text-[#2b2b2b] shadow-xl">
      <header className="relative px-11 pt-11">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-[520px]">
            <h1 className="text-[48px] font-extrabold leading-[0.98] tracking-[-0.045em] text-[#141414]">{name}</h1>
            <p className="mt-3 text-[18px] font-light text-[#141414]/70">{props.resume.jobTitle || "Professional Title"}</p>
          </div>

          {/* stripe block with accent corner holding the initials */}
          <div className="relative h-[112px] w-[112px] shrink-0">
            <svg viewBox="0 0 112 112" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <pattern id={stripes} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="3" height="8" fill="#141414" />
                </pattern>
              </defs>
              <rect width="112" height="112" fill={`url(#${stripes})`} />
              <rect width="46" height="46" fill="#ff4b2b" />
            </svg>
            <span className="absolute left-0 top-0 flex h-[46px] w-[46px] items-center justify-center text-[17px] font-extrabold text-white">
              {getInitials(name)}
            </span>
          </div>
        </div>

        <ul className="mt-7 flex flex-wrap items-center gap-y-2 border-y-[3px] border-[#141414] py-3 text-[11.5px] text-[#141414]">
          {contact.map((item, i) => {
            const Icon = contactIcon(item);
            return (
              <li key={item} className={`flex items-center gap-1.5 ${i ? "ml-4 border-l border-[#141414]/20 pl-4" : ""}`}>
                <Icon className="h-3.5 w-3.5 shrink-0 text-[#ff4b2b]" />
                <span className="break-all">{item}</span>
              </li>
            );
          })}
        </ul>
      </header>

      <div className="px-11 pb-28 pt-1">
        <Row icon={UserIcon} label="Profile">
          <p className="max-w-[34rem] text-[13.5px] leading-6 text-[#2b2b2b]">{summary}</p>
        </Row>

        <Row icon={BriefcaseIcon} label="Experience">
          <div className="space-y-5">{props.experienceEntries}</div>
        </Row>

        <Row icon={CapIcon} label="Education">
          <div className="space-y-4">{props.educationEntries}</div>
        </Row>

        <Row icon={BoltIcon} label="Skills">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {skills.map((skill) => (
              <li key={skill} className="flex items-center gap-2 text-[12.5px] font-medium text-[#141414]">
                <span className="h-1.5 w-1.5 bg-[#ff4b2b]" />
                {skill}
              </li>
            ))}
          </ul>
        </Row>

        <Row icon={BadgeIcon} label="Certifications">
          <ul className="space-y-2">
            {certifications.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[12.5px]">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#141414]" />
                {item}
              </li>
            ))}
          </ul>
        </Row>
      </div>

      {/* Footer: barcode ticks and accent square */}
      <svg className="absolute bottom-7 left-11 h-4 w-[330px]" viewBox="0 0 330 14" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 33 }, (_, i) => (
          <rect key={i} x={i * 10} y="0" width={(i * 7) % 3 + 1} height="14" fill="#141414" />
        ))}
      </svg>
      <span className="absolute bottom-7 right-11 h-4 w-4 bg-[#ff4b2b]" />
      <span className="absolute bottom-0 left-0 h-3 w-full bg-[#141414]" />
    </article>
  );
}
