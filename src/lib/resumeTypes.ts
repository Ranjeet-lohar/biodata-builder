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
  | "bold"
  | "heritage-biodata"
  | "botanical"
  | "geometric"
  | "marigold"
  | "editorial"
  | "atlas"
  | "harbor"
  | "summit"
  | "atelier"
  | "cascade"
  | "ledger"
  | "nocturne"
  | "bloom"
  | "bauhaus"
  | "deco";

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
  {
    id: "heritage-biodata",
    name: "Heritage Biodata",
    description: "A traditional ivory profile framed with Indian-inspired ornament",
    accent: "#8b2635",
    background: "#fbf5e9",
  },
  {
    id: "botanical",
    name: "Botanical",
    description: "A leafy forest-green sidebar with a calm editorial layout",
    accent: "#496b50",
    background: "#eef3e9",
  },
  {
    id: "geometric",
    name: "Geometric",
    description: "A crisp indigo header with angular SVG detailing",
    accent: "#315b83",
    background: "#edf2f8",
  },
  {
    id: "marigold",
    name: "Marigold",
    description: "A festive saffron-and-cream design with ornamental arches",
    accent: "#b96b16",
    background: "#fbf1dc",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "A contemporary rust-and-sand profile with asymmetric structure",
    accent: "#a34f3d",
    background: "#f6eee7",
  },
  {
    id: "atlas",
    name: "Atlas",
    description: "A structured navy-and-gold profile with a polished executive feel",
    accent: "#10263e",
    background: "#eef3f7",
  },
  {
    id: "harbor",
    name: "Harbor",
    description: "A calm teal sidebar layout inspired by coastal soft tones",
    accent: "#193d48",
    background: "#f1f5f2",
  },
  {
    id: "summit",
    name: "Summit",
    description: "A refined stately layout with warm neutral accents and clean hierarchy",
    accent: "#ad8d5d",
    background: "#faf7f1",
  },
  {
    id: "atelier",
    name: "Atelier",
    description: "An editorial ivory style with soft terracotta details and serif elegance",
    accent: "#8f5c52",
    background: "#f9f4ef",
  },
  {
    id: "cascade",
    name: "Cascade",
    description: "A modern green profile with layered blocks and lighter editorial rhythm",
    accent: "#2f7c6f",
    background: "#edf8f5",
  },
  {
    id: "ledger",
    name: "Ledger",
    description: "A sharp black-and-white editorial layout with a vivid accent",
    accent: "#ff4b2b",
    background: "#f4f4f4",
  },
  {
    id: "nocturne",
    name: "Nocturne",
    description: "A dark circuit-inspired header with a cool neon accent",
    accent: "#22d3ee",
    background: "#f1f3f9",
  },
  {
    id: "bloom",
    name: "Bloom",
    description: "A friendly pastel design with soft rounded section cards",
    accent: "#8b5cf6",
    background: "#fdf8ff",
  },
  {
    id: "bauhaus",
    name: "Bauhaus",
    description: "A bold geometric layout with primary colors and hard-edged shapes",
    accent: "#e63423",
    background: "#fffdf5",
  },
  {
    id: "deco",
    name: "Deco",
    description: "An emerald-and-gold design with elegant art deco details",
    accent: "#0b3b32",
    background: "#f7f8f6",
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
