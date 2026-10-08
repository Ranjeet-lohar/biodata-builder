import type { ComponentType, CSSProperties } from "react";
import type { ResumeDocument, ResumeTemplateId } from "@/lib/resumeTypes";
import { hasValue, type ResumeTemplateDesignProps } from "./resume-templates/shared";
import ProfessionalTemplate from "./resume-templates/professional";
import ExecutiveTemplate from "./resume-templates/executive";
import MinimalTemplate from "./resume-templates/minimal";
import CreativeTemplate from "./resume-templates/creative";
import CompactTemplate from "./resume-templates/compact";
import ElegantTemplate from "./resume-templates/elegant";
import TechTemplate from "./resume-templates/tech";
import BoldTemplate from "./resume-templates/bold";
import ClassicTemplate from "./resume-templates/classic";
import ModernTemplate from "./resume-templates/modern";
import HeritageBiodataTemplate from "./resume-templates/heritage-biodata";
import BotanicalTemplate from "./resume-templates/botanical";
import GeometricTemplate from "./resume-templates/geometric";
import MarigoldTemplate from "./resume-templates/marigold";
import EditorialTemplate from "./resume-templates/editorial";
import AtlasTemplate from "./resume-templates/atlas";
import HarborTemplate from "./resume-templates/harbor";
import SummitTemplate from "./resume-templates/summit";
import AtelierTemplate from "./resume-templates/atelier";
import CascadeTemplate from "./resume-templates/cascade";
import LedgerTemplate from "./resume-templates/ledger";
import NocturneTemplate from "./resume-templates/nocturne";
import BloomTemplate from "./resume-templates/bloom";
import BauhausTemplate from "./resume-templates/bauhaus";
import DecoTemplate from "./resume-templates/deco";

const ink = "#192b3a";
const muted = "#627383";
const accent = "#247b83";

const resumeTemplateComponents: Record<ResumeTemplateId, ComponentType<ResumeTemplateDesignProps>> = {
  "professional": ProfessionalTemplate,
  "executive": ExecutiveTemplate,
  "minimal": MinimalTemplate,
  "creative": CreativeTemplate,
  "compact": CompactTemplate,
  "elegant": ElegantTemplate,
  "tech": TechTemplate,
  "bold": BoldTemplate,
  "classic": ClassicTemplate,
  "modern": ModernTemplate,
  "heritage-biodata": HeritageBiodataTemplate,
  "botanical": BotanicalTemplate,
  "geometric": GeometricTemplate,
  "marigold": MarigoldTemplate,
  "editorial": EditorialTemplate,
  "atlas": AtlasTemplate,
  "harbor": HarborTemplate,
  "summit": SummitTemplate,
  "atelier": AtelierTemplate,
  "cascade": CascadeTemplate,
  "ledger": LedgerTemplate,
  "nocturne": NocturneTemplate,
  "bloom": BloomTemplate,
  "bauhaus": BauhausTemplate,
  "deco": DecoTemplate,
};

export default function ResumeTemplate({
  resume,
  templateId = "professional",
}: {
  resume: ResumeDocument;
  templateId?: ResumeTemplateId;
}) {
  const contact = [resume.email, resume.phone, resume.location, resume.website].filter(hasValue);
  const skills = resume.skills.split(",").map((skill) => skill.trim()).filter(Boolean);
  const certifications = resume.certifications.split("\n").map((item) => item.trim()).filter(Boolean);
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
            <p className="shrink-0 text-right text-[10px] text-slate-500">{[item.startDate, item.endDate].filter(hasValue).join(" — ")}</p>
          </div>
          <p className="text-slate-600">{[item.company, item.location].filter(hasValue).join(" · ") || "Company"}</p>
          {hasValue(item.description) && <p className="mt-1 whitespace-pre-wrap text-slate-600">{item.description}</p>}
        </article>
      ))}
    </div>
  ) : <p className="text-slate-500">Add your professional experience.</p>;
  const educationEntries = resume.education.length ? (
    <div className="space-y-4">
      {resume.education.map((item) => (
        <article key={item.id}>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-bold">{item.degree || "Degree"}</h3>
            <p className="shrink-0 text-right text-[10px] text-slate-500">{[item.startDate, item.endDate].filter(hasValue).join(" — ")}</p>
          </div>
          <p className="text-slate-600">{[item.institution, item.location].filter(hasValue).join(" · ") || "Institution"}</p>
          {hasValue(item.details) && <p className="mt-1 whitespace-pre-wrap text-slate-600">{item.details}</p>}
        </article>
      ))}
    </div>
  ) : <p className="text-slate-500">Add your education details.</p>;
  const Template = resumeTemplateComponents[templateId];
  return <Template resume={resume} contact={contact} skills={skills} certifications={certifications} experienceEntries={experienceEntries} educationEntries={educationEntries} headingStyle={headingStyle} ink={ink} muted={muted} accent={accent} hasValue={hasValue} />;
}
