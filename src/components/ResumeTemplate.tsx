import type { CSSProperties } from "react";
import type {
  ResumeDocument,
  ResumeTemplateId,
} from "@/lib/resumeTypes";

const ink = "#192b3a";
const muted = "#627383";
const accent = "#247b83";

function hasValue(value: string) {
  return value.trim().length > 0;
}

export default function ResumeTemplate({
  resume,
  templateId = "professional",
}: {
  resume: ResumeDocument;
  templateId?: ResumeTemplateId;
}) {
  const contact = [
    resume.email,
    resume.phone,
    resume.location,
    resume.website,
  ].filter(hasValue);
  const skills = resume.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const certifications = resume.certifications
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const headingStyle: CSSProperties = {
    color: accent,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.12em",
    marginBottom: 12,
    textTransform: "uppercase",
  };

  const experienceEntries = resume.experience.length ? (
    <div className="space-y-5">
      {resume.experience.map((item) => (
        <article key={item.id}>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-bold">{item.role || "Position"}</h3>
            <p className="shrink-0 text-right text-[10px] text-slate-500">
              {[item.startDate, item.endDate].filter(hasValue).join(" — ")}
            </p>
          </div>
          <p className="text-slate-600">
            {[item.company, item.location].filter(hasValue).join(" · ") || "Company"}
          </p>
          {hasValue(item.description) && (
            <p className="mt-1 whitespace-pre-wrap text-slate-600">
              {item.description}
            </p>
          )}
        </article>
      ))}
    </div>
  ) : (
    <p className="text-slate-500">Add your professional experience.</p>
  );

  const educationEntries = resume.education.length ? (
    <div className="space-y-4">
      {resume.education.map((item) => (
        <article key={item.id}>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-bold">{item.degree || "Degree"}</h3>
            <p className="shrink-0 text-right text-[10px] text-slate-500">
              {[item.startDate, item.endDate].filter(hasValue).join(" — ")}
            </p>
          </div>
          <p className="text-slate-600">
            {[item.institution, item.location].filter(hasValue).join(" · ") || "Institution"}
          </p>
          {hasValue(item.details) && (
            <p className="mt-1 whitespace-pre-wrap text-slate-600">{item.details}</p>
          )}
        </article>
      ))}
    </div>
  ) : (
    <p className="text-slate-500">Add your education details.</p>
  );

  if (templateId === "executive") {
    return (
      <article className="mx-auto flex min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed shadow-xl">
        <aside className="w-[235px] shrink-0 bg-[#232a32] px-7 py-10 text-white">
          <div className="mb-8 h-1 w-12 bg-[#b58b45]" />
          <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9b775]">Contact</h2>
          <ul className="mb-9 space-y-3 break-words text-[11px] text-slate-200">
            {contact.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9b775]">Expertise</h2>
          <ul className="space-y-2 text-[11px] text-slate-100">
            {skills.map((skill) => <li key={skill}>• {skill}</li>)}
          </ul>
          {certifications.length > 0 && (
            <>
              <h2 className="mb-3 mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d9b775]">Credentials</h2>
              <ul className="space-y-2 text-[11px] text-slate-200">
                {certifications.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </>
          )}
        </aside>
        <div className="min-w-0 flex-1 px-9 py-12">
          <header className="mb-8 border-b border-[#e4e1db] pb-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b58b45]">Executive Profile</p>
            <h1 className="mt-3 break-words text-[34px] font-bold leading-tight text-[#232a32]">{resume.fullName || "Your Name"}</h1>
            <p className="mt-2 text-lg text-slate-600">{resume.jobTitle || "Professional Title"}</p>
          </header>
          <section className="mb-8">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b58b45]">Summary</h2>
            <p className="whitespace-pre-wrap text-slate-600">{resume.summary || "Add a concise professional summary."}</p>
          </section>
          <section className="mb-8">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#b58b45]">Career History</h2>
            {experienceEntries}
          </section>
          <section>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[#b58b45]">Education</h2>
            {educationEntries}
          </section>
        </div>
      </article>
    );
  }

  if (templateId === "minimal") {
    return (
      <article className="mx-auto min-h-[1123px] w-[794px] bg-white px-[68px] py-[62px] text-[13px] leading-relaxed text-[#29342f] shadow-xl">
        <header className="mb-10 border-t-[5px] border-[#53665c] pt-8">
          <h1 className="break-words text-[38px] font-light tracking-tight">{resume.fullName || "Your Name"}</h1>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-base text-[#53665c]">{resume.jobTitle || "Professional Title"}</p>
            <p className="break-words text-right text-[10px] text-slate-500">{contact.join("   /   ")}</p>
          </div>
        </header>
        <section className="mb-9">
          <h2 className="mb-3 border-b border-[#dce2de] pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#53665c]">Profile</h2>
          <p className="whitespace-pre-wrap text-slate-600">{resume.summary || "Add a concise professional summary."}</p>
        </section>
        <section className="mb-9">
          <h2 className="mb-4 border-b border-[#dce2de] pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#53665c]">Experience</h2>
          {experienceEntries}
        </section>
        <section className="mb-9">
          <h2 className="mb-4 border-b border-[#dce2de] pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#53665c]">Education</h2>
          {educationEntries}
        </section>
        <div className="grid grid-cols-2 gap-10 border-t border-[#dce2de] pt-6">
          <section>
            <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#53665c]">Skills</h2>
            <p className="text-slate-600">{skills.join(" · ") || "Add your skills"}</p>
          </section>
          {certifications.length > 0 && (
            <section>
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#53665c]">Certifications</h2>
              <p className="text-slate-600">{certifications.join(" · ")}</p>
            </section>
          )}
        </div>
      </article>
    );
  }

  if (templateId === "creative") {
    return (
      <article className="mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed shadow-xl">
        <header className="relative overflow-hidden bg-[#56366f] px-12 py-12 text-white">
          <svg aria-hidden="true" viewBox="0 0 240 240" className="absolute -right-8 -top-16 h-64 w-64 opacity-20" fill="none">
            <circle cx="120" cy="120" r="110" stroke="white" strokeWidth="2" />
            <circle cx="120" cy="120" r="80" stroke="white" strokeWidth="2" />
            <path d="M10 120h220M120 10v220" stroke="white" strokeWidth="1" />
          </svg>
          <div className="relative">
            <p className="text-[10px] uppercase tracking-[0.25em] text-purple-200">Creative Portfolio</p>
            <h1 className="mt-3 break-words text-[38px] font-bold leading-tight">{resume.fullName || "Your Name"}</h1>
            <p className="mt-2 text-lg text-purple-100">{resume.jobTitle || "Professional Title"}</p>
            <p className="mt-5 break-words text-[11px] text-white/85">{contact.join("  •  ")}</p>
          </div>
        </header>
        <div className="grid grid-cols-[1fr_220px] gap-9 px-12 py-9">
          <div>
            <section className="mb-8 rounded-r border-l-4 border-[#8052a0] bg-[#f7f3fa] px-5 py-4">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#8052a0]">About Me</h2>
              <p className="whitespace-pre-wrap text-slate-600">{resume.summary || "Add a concise professional summary."}</p>
            </section>
            <section className="mb-8">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#8052a0]">Experience</h2>
              {experienceEntries}
            </section>
            <section>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#8052a0]">Education</h2>
              {educationEntries}
            </section>
          </div>
          <aside className="border-l border-[#e8dfef] pl-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#8052a0]">Skills</h2>
            <div className="mb-8 flex flex-wrap gap-2">
              {skills.map((skill) => <span key={skill} className="rounded-full bg-[#f0e8f6] px-2.5 py-1 text-[10px] text-[#56366f]">{skill}</span>)}
            </div>
            {certifications.length > 0 && (
              <>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#8052a0]">Certifications</h2>
                <ul className="space-y-2 text-[11px] text-slate-600">
                  {certifications.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </>
            )}
          </aside>
        </div>
      </article>
    );
  }

  if (templateId === "compact") {
    return (
      <article className="mx-auto min-h-[1123px] w-[794px] bg-white px-10 py-9 text-[12px] leading-snug text-[#273747] shadow-xl">
        <header className="mb-6 flex items-end justify-between gap-6 border-b-2 border-[#315a77] pb-5">
          <div className="min-w-0">
            <h1 className="break-words text-[32px] font-bold leading-tight">{resume.fullName || "Your Name"}</h1>
            <p className="mt-1 text-base text-[#315a77]">{resume.jobTitle || "Professional Title"}</p>
          </div>
          <p className="max-w-[250px] break-words text-right text-[10px] text-slate-500">{contact.join("  •  ")}</p>
        </header>
        <section className="mb-6">
          <h2 className="mb-2 border-b border-[#dbe4ea] pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#315a77]">Summary</h2>
          <p className="text-slate-600">{resume.summary || "Add a concise professional summary."}</p>
        </section>
        <div className="grid grid-cols-[1.45fr_0.85fr] gap-8">
          <section>
            <h2 className="mb-3 border-b border-[#dbe4ea] pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#315a77]">Experience</h2>
            {experienceEntries}
          </section>
          <div>
            <section className="mb-7">
              <h2 className="mb-3 border-b border-[#dbe4ea] pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#315a77]">Education</h2>
              {educationEntries}
            </section>
            <section className="mb-7">
              <h2 className="mb-3 border-b border-[#dbe4ea] pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#315a77]">Skills</h2>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                {skills.map((skill) => <li key={skill}>— {skill}</li>)}
              </ul>
            </section>
            {certifications.length > 0 && (
              <section>
                <h2 className="mb-3 border-b border-[#dbe4ea] pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#315a77]">Certifications</h2>
                <ul className="space-y-1.5 text-[11px] text-slate-600">
                  {certifications.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (templateId === "elegant") {
    return (
      <article className="mx-auto min-h-[1123px] w-[794px] bg-[#fffdf9] px-[62px] py-[58px] text-[13px] leading-relaxed text-[#40342f] shadow-xl" style={{ fontFamily: "Georgia, serif" }}>
        <header className="mb-9 text-center">
          <div className="mx-auto mb-5 h-px w-20 bg-[#946451]" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#946451]">Curriculum Vitae</p>
          <h1 className="mt-3 break-words text-[36px] leading-tight">{resume.fullName || "Your Name"}</h1>
          <p className="mt-2 italic text-[#946451]">{resume.jobTitle || "Professional Title"}</p>
          <p className="mt-4 break-words text-[10px] text-[#786a63]">{contact.join("  ·  ")}</p>
          <div className="mx-auto mt-5 h-px w-20 bg-[#946451]" />
        </header>
        <section className="mb-8">
          <h2 className="mb-2 text-center text-[11px] uppercase tracking-[0.18em] text-[#946451]">Profile</h2>
          <p className="text-center italic text-[#786a63]">{resume.summary || "Add a concise professional summary."}</p>
        </section>
        <section className="mb-8">
          <h2 className="mb-4 border-b border-[#e6dcd3] pb-2 text-[11px] uppercase tracking-[0.18em] text-[#946451]">Experience</h2>
          {experienceEntries}
        </section>
        <section className="mb-8">
          <h2 className="mb-4 border-b border-[#e6dcd3] pb-2 text-[11px] uppercase tracking-[0.18em] text-[#946451]">Education</h2>
          {educationEntries}
        </section>
        <div className="grid grid-cols-2 gap-8 border-t border-[#e6dcd3] pt-5">
          <section>
            <h2 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#946451]">Skills</h2>
            <p className="text-[#786a63]">{skills.join("  ·  ") || "Add your skills"}</p>
          </section>
          {certifications.length > 0 && (
            <section>
              <h2 className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#946451]">Certifications</h2>
              <p className="text-[#786a63]">{certifications.join("  ·  ")}</p>
            </section>
          )}
        </div>
      </article>
    );
  }

  if (templateId === "tech") {
    return (
      <article className="mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed text-[#1c2b39] shadow-xl">
        <header className="relative overflow-hidden bg-[#132638] px-11 py-10 text-white">
          <svg aria-hidden="true" viewBox="0 0 240 150" className="absolute right-0 top-0 h-full w-64 opacity-20" fill="none">
            <path d="M0 120h60l22-22h40l18-18h100M80 0v32l24 24v24M160 0v30l-18 18v20" stroke="#42c4f5" strokeWidth="2" />
            <circle cx="60" cy="120" r="4" fill="#42c4f5" /><circle cx="104" cy="56" r="4" fill="#42c4f5" /><circle cx="142" cy="66" r="4" fill="#42c4f5" />
          </svg>
          <div className="relative">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#59c9f3]">Professional // Resume</p>
            <h1 className="mt-3 break-words font-mono text-[34px] font-bold leading-tight">{resume.fullName || "Your Name"}</h1>
            <p className="mt-2 text-lg text-slate-200">{resume.jobTitle || "Professional Title"}</p>
            <p className="mt-5 break-words font-mono text-[10px] text-slate-300">{contact.join("   |   ")}</p>
          </div>
        </header>
        <div className="grid grid-cols-[1fr_205px] gap-8 px-11 py-9">
          <div>
            <section className="mb-8">
              <h2 className="mb-2 border-l-2 border-[#1486b8] pl-3 text-xs font-bold uppercase tracking-[0.12em] text-[#1486b8]">Overview</h2>
              <p className="whitespace-pre-wrap text-slate-600">{resume.summary || "Add a concise professional summary."}</p>
            </section>
            <section className="mb-8">
              <h2 className="mb-4 border-l-2 border-[#1486b8] pl-3 text-xs font-bold uppercase tracking-[0.12em] text-[#1486b8]">Experience</h2>
              {experienceEntries}
            </section>
            <section>
              <h2 className="mb-4 border-l-2 border-[#1486b8] pl-3 text-xs font-bold uppercase tracking-[0.12em] text-[#1486b8]">Education</h2>
              {educationEntries}
            </section>
          </div>
          <aside className="border-l border-[#dce9ef] pl-6">
            <h2 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#1486b8]">Toolbox</h2>
            <div className="mb-8 flex flex-wrap gap-1.5">
              {skills.map((skill) => <span key={skill} className="rounded border border-[#c4e2ef] bg-[#eef8fc] px-2 py-1 text-[10px]">{skill}</span>)}
            </div>
            {certifications.length > 0 && (
              <>
                <h2 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#1486b8]">Certifications</h2>
                <ul className="space-y-2 text-[11px] text-slate-600">{certifications.map((item) => <li key={item}>{item}</li>)}</ul>
              </>
            )}
          </aside>
        </div>
      </article>
    );
  }

  if (templateId === "bold") {
    return (
      <article className="mx-auto flex min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed text-[#352b28] shadow-xl">
        <div className="w-5 shrink-0 bg-[#ce603d]" />
        <div className="min-w-0 flex-1 px-10 py-11">
          <header className="mb-8 border-b-4 border-[#ce603d] pb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ce603d]">Resume / Profile</p>
            <h1 className="mt-2 break-words text-[40px] font-black uppercase leading-none">{resume.fullName || "Your Name"}</h1>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <p className="text-lg font-semibold">{resume.jobTitle || "Professional Title"}</p>
              <p className="break-words text-right text-[10px] text-slate-500">{contact.join("  •  ")}</p>
            </div>
          </header>
          <section className="mb-8 grid grid-cols-[120px_1fr] gap-5">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ce603d]">Profile</h2>
            <p className="whitespace-pre-wrap text-slate-600">{resume.summary || "Add a concise professional summary."}</p>
          </section>
          <section className="mb-8 grid grid-cols-[120px_1fr] gap-5">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ce603d]">Experience</h2>
            {experienceEntries}
          </section>
          <section className="mb-8 grid grid-cols-[120px_1fr] gap-5">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ce603d]">Education</h2>
            {educationEntries}
          </section>
          <div className="grid grid-cols-2 gap-8 border-t border-[#eadbd4] pt-6">
            <section>
              <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#ce603d]">Skills</h2>
              <p className="text-slate-600">{skills.join("  /  ") || "Add your skills"}</p>
            </section>
            {certifications.length > 0 && (
              <section>
                <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#ce603d]">Certifications</h2>
                <p className="text-slate-600">{certifications.join("  /  ")}</p>
              </section>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (templateId === "classic") {
    return (
      <article
        className="mx-auto min-h-[1123px] w-[794px] bg-white px-[58px] py-[52px] text-[13px] leading-relaxed shadow-xl"
        style={{ color: "#263248", fontFamily: "Georgia, serif" }}
      >
        <header className="border-b-2 border-[#273b59] pb-7 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#718096]">
            Curriculum Vitae
          </p>
          <h1 className="mt-3 break-words text-[36px] font-bold leading-tight">
            {resume.fullName || "Your Name"}
          </h1>
          <p className="mt-2 text-lg text-[#53647a]">
            {resume.jobTitle || "Professional Title"}
          </p>
          <p className="mt-4 break-words text-[11px] text-[#53647a]">
            {contact.join("  |  ") || "Email  |  Phone  |  Location"}
          </p>
        </header>
        <section className="mt-7">
          <h2 className="mb-2 border-b border-[#cbd3df] pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#273b59]">
            Professional Profile
          </h2>
          <p className="whitespace-pre-wrap text-[#53647a]">
            {resume.summary || "Add a concise professional summary."}
          </p>
        </section>
        <section className="mt-7">
          <h2 className="mb-3 border-b border-[#cbd3df] pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#273b59]">
            Experience
          </h2>
          {resume.experience.length ? (
            <div className="space-y-5">
              {resume.experience.map((item) => (
                <article key={item.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-bold">{item.role || "Position"}</h3>
                    <p className="shrink-0 text-[11px] text-[#718096]">
                      {[item.startDate, item.endDate].filter(hasValue).join(" — ")}
                    </p>
                  </div>
                  <p className="italic text-[#53647a]">
                    {[item.company, item.location].filter(hasValue).join(", ") || "Company"}
                  </p>
                  {hasValue(item.description) && (
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
          <h2 className="mb-3 border-b border-[#cbd3df] pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#273b59]">
            Education
          </h2>
          {resume.education.length ? (
            <div className="space-y-4">
              {resume.education.map((item) => (
                <article key={item.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-bold">{item.degree || "Degree"}</h3>
                    <p className="shrink-0 text-[11px] text-[#718096]">
                      {[item.startDate, item.endDate].filter(hasValue).join(" — ")}
                    </p>
                  </div>
                  <p className="text-[#53647a]">
                    {[item.institution, item.location].filter(hasValue).join(", ") || "Institution"}
                  </p>
                  {hasValue(item.details) && (
                    <p className="mt-1 whitespace-pre-wrap text-[#53647a]">{item.details}</p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-[#718096]">Add your education details.</p>
          )}
        </section>
        {(skills.length > 0 || certifications.length > 0) && (
          <section className="mt-7">
            <h2 className="mb-3 border-b border-[#cbd3df] pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#273b59]">
              Skills & Certifications
            </h2>
            {skills.length > 0 && <p className="text-[#53647a]">{skills.join("  ·  ")}</p>}
            {certifications.length > 0 && (
              <p className="mt-2 text-[#53647a]">{certifications.join("  ·  ")}</p>
            )}
          </section>
        )}
      </article>
    );
  }

  if (templateId === "modern") {
    return (
      <article
        className="mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed shadow-xl"
        style={{ color: "#20332e", fontFamily: "Arial, sans-serif" }}
      >
        <header className="relative overflow-hidden bg-[#176b55] px-12 py-12 text-white">
          <svg
            aria-hidden="true"
            viewBox="0 0 320 180"
            className="absolute -right-2 -top-8 h-52 w-80 opacity-15"
            fill="none"
          >
            <circle cx="240" cy="18" r="110" stroke="white" strokeWidth="1.2" />
            <circle cx="240" cy="18" r="78" stroke="white" strokeWidth="1.2" />
            <circle cx="240" cy="18" r="46" stroke="white" strokeWidth="1.2" />
          </svg>
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-100">
              Resume
            </p>
            <h1 className="mt-3 break-words text-[38px] font-bold leading-tight">
              {resume.fullName || "Your Name"}
            </h1>
            <p className="mt-2 text-lg text-emerald-100">
              {resume.jobTitle || "Professional Title"}
            </p>
            <p className="mt-5 max-w-2xl break-words text-[11px] text-white/90">
              {contact.join("  •  ") || "Email  •  Phone  •  Location"}
            </p>
          </div>
        </header>
        <div className="grid grid-cols-[1fr_220px] gap-9 px-12 py-10">
          <div>
            <section className="mb-8">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#176b55]">
                About
              </h2>
              <p className="whitespace-pre-wrap text-[#5d716a]">
                {resume.summary || "Add a concise professional summary."}
              </p>
            </section>
            <section className="mb-8">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#176b55]">
                Experience
              </h2>
              {resume.experience.length ? (
                <div className="space-y-6 border-l border-[#c6ddd3] pl-5">
                  {resume.experience.map((item) => (
                    <article key={item.id} className="relative">
                      <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-[#176b55]" />
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-bold">{item.role || "Position"}</h3>
                        <p className="shrink-0 text-[10px] text-[#71857d]">
                          {[item.startDate, item.endDate].filter(hasValue).join(" — ")}
                        </p>
                      </div>
                      <p className="text-[#5d716a]">
                        {[item.company, item.location].filter(hasValue).join(" · ") || "Company"}
                      </p>
                      {hasValue(item.description) && (
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
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#176b55]">
                Education
              </h2>
              {resume.education.length ? (
                <div className="space-y-4">
                  {resume.education.map((item) => (
                    <article key={item.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-bold">{item.degree || "Degree"}</h3>
                        <p className="shrink-0 text-[10px] text-[#71857d]">
                          {[item.startDate, item.endDate].filter(hasValue).join(" — ")}
                        </p>
                      </div>
                      <p className="text-[#5d716a]">
                        {[item.institution, item.location].filter(hasValue).join(" · ") || "Institution"}
                      </p>
                      {hasValue(item.details) && (
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
          <aside className="border-l border-[#e1ebe6] pl-6">
            <section className="mb-7">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#176b55]">
                Skills
              </h2>
              {skills.length ? (
                <ul className="space-y-2">
                  {skills.map((skill) => (
                    <li key={skill} className="rounded bg-[#e9f3ed] px-2.5 py-1.5 text-[11px]">
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-[#71857d]">Add skills separated by commas</p>
              )}
            </section>
            {certifications.length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#176b55]">
                  Certifications
                </h2>
                <ul className="space-y-2 text-[11px] text-[#5d716a]">
                  {certifications.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </article>
    );
  }

  return (
    <article
      className="relative mx-auto flex min-h-[1123px] w-[794px] overflow-hidden bg-white text-[13px] leading-relaxed shadow-xl"
      style={{ color: ink, fontFamily: "Arial, sans-serif" }}
    >
      <aside className="w-[245px] shrink-0 bg-[#edf3f3] px-8 py-10">
        <div className="mb-8 h-1 w-12 rounded-full bg-[#247b83]" />

        <section className="mb-8">
          <h2 style={headingStyle}>Contact</h2>
          <ul className="space-y-3 break-words text-[12px]" style={{ color: muted }}>
            {contact.length > 0 ? (
              contact.map((item) => <li key={item}>{item}</li>)
            ) : (
              <li>Add your contact details</li>
            )}
          </ul>
        </section>

        <section className="mb-8">
          <h2 style={headingStyle}>Core skills</h2>
          {skills.length > 0 ? (
            <ul className="space-y-2">
              {skills.map((skill) => (
                <li key={skill} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#247b83]" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[12px]" style={{ color: muted }}>
              Add skills separated by commas
            </p>
          )}
        </section>

        {certifications.length > 0 && (
          <section>
            <h2 style={headingStyle}>Certifications</h2>
            <ul className="space-y-2">
              {certifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      <div className="min-w-0 flex-1 px-10 py-12">
        <header className="mb-9 border-b border-[#dce5e7] pb-7">
          <p
            className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            Professional Resume
          </p>
          <h1
            className="break-words text-[34px] font-bold leading-tight"
            style={{ color: ink }}
          >
            {resume.fullName || "Your Name"}
          </h1>
          <p className="mt-2 text-lg" style={{ color: muted }}>
            {resume.jobTitle || "Professional Title"}
          </p>
        </header>

        <section className="mb-8">
          <h2 style={headingStyle}>Profile</h2>
          <p className="whitespace-pre-wrap" style={{ color: muted }}>
            {resume.summary || "Add a concise professional summary."}
          </p>
        </section>

        <section className="mb-8">
          <h2 style={headingStyle}>Experience</h2>
          {resume.experience.length > 0 ? (
            <div className="space-y-6">
              {resume.experience.map((item) => (
                <article key={item.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold">
                        {item.role || "Position"}
                      </h3>
                      <p style={{ color: muted }}>
                        {[item.company, item.location]
                          .filter(hasValue)
                          .join(" · ") || "Company"}
                      </p>
                    </div>
                    <p className="shrink-0 text-right text-[11px]" style={{ color: muted }}>
                      {[item.startDate, item.endDate].filter(hasValue).join(" — ")}
                    </p>
                  </div>
                  {hasValue(item.description) && (
                    <p className="mt-2 whitespace-pre-wrap" style={{ color: muted }}>
                      {item.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p style={{ color: muted }}>Add your professional experience.</p>
          )}
        </section>

        <section>
          <h2 style={headingStyle}>Education</h2>
          {resume.education.length > 0 ? (
            <div className="space-y-5">
              {resume.education.map((item) => (
                <article key={item.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold">{item.degree || "Degree"}</h3>
                      <p style={{ color: muted }}>
                        {[item.institution, item.location]
                          .filter(hasValue)
                          .join(" · ") || "Institution"}
                      </p>
                    </div>
                    <p className="shrink-0 text-right text-[11px]" style={{ color: muted }}>
                      {[item.startDate, item.endDate].filter(hasValue).join(" — ")}
                    </p>
                  </div>
                  {hasValue(item.details) && (
                    <p className="mt-2 whitespace-pre-wrap" style={{ color: muted }}>
                      {item.details}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p style={{ color: muted }}>Add your education details.</p>
          )}
        </section>
      </div>
    </article>
  );
}
