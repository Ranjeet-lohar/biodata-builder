export interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeEducation {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface ResumeDocument {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string;
  certifications: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
}

export type ResumeTemplateId =
  | "professional"
  | "classic"
  | "modern"
  | "executive"
  | "minimal"
  | "creative"
  | "compact"
  | "elegant"
  | "tech"
  | "bold";

export const resumeTemplates: {
  id: ResumeTemplateId;
  name: string;
  description: string;
  accent: string;
  background: string;
}[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean sidebar with a calm teal accent",
    accent: "#247b83",
    background: "#edf3f3",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional typography and a refined navy header",
    accent: "#273b59",
    background: "#eef1f5",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold emerald banner with a crisp, open layout",
    accent: "#176b55",
    background: "#e9f3ed",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Confident charcoal sidebar with a gold accent",
    accent: "#b58b45",
    background: "#e9e6df",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Spacious single-column layout with subtle rules",
    accent: "#53665c",
    background: "#f0f1ed",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Expressive plum header with colorful skill details",
    accent: "#8052a0",
    background: "#f0eaf5",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Efficient two-column layout for dense experience",
    accent: "#315a77",
    background: "#e8eef3",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Warm ivory page with classic serif typography",
    accent: "#946451",
    background: "#f4eee6",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Dark header and crisp electric-blue details",
    accent: "#1486b8",
    background: "#e8f2f7",
  },
  {
    id: "bold",
    name: "Bold",
    description: "Strong terracotta accents and dynamic page structure",
    accent: "#ce603d",
    background: "#f8eee8",
  },
];

export function emptyResume(): ResumeDocument {
  return {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: "",
    skills: "",
    certifications: "",
    experience: [],
    education: [],
  };
}
