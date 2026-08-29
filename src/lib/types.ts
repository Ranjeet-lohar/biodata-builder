export interface FieldItem {
  id: string;
  labelEn: string;
  labelHi: string;
  value: string;
  /** Optional Hindi translation of the value — used mainly for paragraph fields. */
  valueHi?: string;
}

export type SectionType = "grid" | "paragraph";

export interface SectionItem {
  id: string;
  titleEn: string;
  titleHi: string;
  type: SectionType;
  visible: boolean;
  fields: FieldItem[];
}

export interface Invocation {
  enabled: boolean;
  text: string;
}

export type Language = "en" | "hi";

export interface BiodataDocument {
  photo: string;
  fullName: string;
  fullNameHi: string;
  invocation: Invocation;
  sections: SectionItem[];
  language: Language;
  fontPackId: string;
}

export interface SavedBiodata {
  id: string;
  name: string;
  templateId: string;
  doc: BiodataDocument;
  updatedAt: number;
}

export const invocationPresets = [
  "श्री गणेशाय नमः",
  "ॐ नमः शिवाय",
  "श्री राधे कृष्णाय नमः",
  "जय श्री राम",
  // "God is one",
];

let counter = 0;
export function newFieldId() {
  counter += 1;
  return `f_${Date.now()}_${counter}`;
}
export function newSectionId() {
  counter += 1;
  return `s_${Date.now()}_${counter}`;
}
