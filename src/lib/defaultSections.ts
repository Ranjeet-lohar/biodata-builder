// lib/defaultSections.ts
import { BiodataDocument, SectionItem, newSectionId, newFieldId } from "./types";

export const defaultSections = (): SectionItem[] => [
  {
    id: newSectionId(),
    titleEn: "Personal Details",
    titleHi: "व्यक्तिगत विवरण",
    type: "grid",
    visible: true,
    fields: [
      { id: newFieldId(), labelEn: "Date of Birth", labelHi: "जन्म तिथि", value: "" },
      { id: newFieldId(), labelEn: "Height", labelHi: "ऊँचाई", value: "" },
      { id: newFieldId(), labelEn: "Religion", labelHi: "धर्म", value: "" },
      { id: newFieldId(), labelEn: "Caste", labelHi: "जाति", value: "" },
    ],
  },
  {
    id: newSectionId(),
    titleEn: "Education & Career",
    titleHi: "शिक्षा एवं करियर",
    type: "grid",
    visible: true,
    fields: [
      { id: newFieldId(), labelEn: "Education", labelHi: "शिक्षा", value: "" },
      { id: newFieldId(), labelEn: "Occupation", labelHi: "व्यवसाय", value: "" },
      { id: newFieldId(), labelEn: "Income", labelHi: "आय", value: "" },
    ],
  },
  {
    id: newSectionId(),
    titleEn: "Family Details",
    titleHi: "पारिवारिक विवरण",
    type: "grid",
    visible: true,
    fields: [
      { id: newFieldId(), labelEn: "Father's Name", labelHi: "पिता का नाम", value: "" },
      { id: newFieldId(), labelEn: "Mother's Name", labelHi: "माता का नाम", value: "" },
      { id: newFieldId(), labelEn: "Siblings", labelHi: "भाई-बहन", value: "" },
    ],
  },
  {
    id: newSectionId(),
    titleEn: "Contact",
    titleHi: "संपर्क",
    type: "grid",
    visible: true,
    fields: [
      { id: newFieldId(), labelEn: "Phone", labelHi: "फ़ोन", value: "" },
      { id: newFieldId(), labelEn: "Email", labelHi: "ईमेल", value: "" },
      { id: newFieldId(), labelEn: "Address", labelHi: "पता", value: "" },
    ],
  },
  {
    id: newSectionId(),
    titleEn: "About",
    titleHi: "परिचय",
    type: "paragraph",
    visible: true,
    fields: [{ id: newFieldId(), labelEn: "About", labelHi: "", value: "" }],
  },
];

export function emptyDocument(): BiodataDocument {
  return {
    photo: "",
    fullName: "",
    fullNameHi: "",
    invocation: { enabled: true, text: "श्री गणेशाय नमः" },
    sections: defaultSections(),
    language: "en",
    fontPackId: "template",
  };
}

export function sampleDocument(): BiodataDocument {
  return {
    ...emptyDocument(),
    fullName: "Ananya Sharma",
    fullNameHi: "अनन्या शर्मा",
    sections: defaultSections().map((section) => {
      if (section.titleEn === "Personal Details") {
        return {
          ...section,
          fields: section.fields.map((field) => {
            switch (field.labelEn) {
              case "Date of Birth":
                return { ...field, value: "14 June 1998" };
              case "Height":
                return { ...field, value: "5'4\" (162 cm)" };
              case "Religion":
                return { ...field, value: "Hindu" };
              case "Caste":
                return { ...field, value: "Brahmin" };
              default:
                return field;
            }
          }),
        };
      }
      if (section.titleEn === "Education & Career") {
        return {
          ...section,
          fields: section.fields.map((field) => {
            switch (field.labelEn) {
              case "Education":
                return { ...field, value: "M.Tech" };
              case "Occupation":
                return { ...field, value: "Software Engineer" };
              case "Income":
                return { ...field, value: "12,00,000 INR" };
              default:
                return field;
            }
          }),
        };
      }
      if (section.titleEn === "Family Details") {
        return {
          ...section,
          fields: section.fields.map((field) => {
            switch (field.labelEn) {
              case "Father's Name":
                return { ...field, value: "Shri Rajesh Sharma" };
              case "Mother's Name":
                return { ...field, value: "Smt. Kavita Sharma" };
              case "Siblings":
                return { ...field, value: "1 Younger Brother" };
              default:
                return field;
            }
          }),
        };
      }
      if (section.titleEn === "Contact") {
        return {
          ...section,
          fields: section.fields.map((field) => {
            switch (field.labelEn) {
              case "Phone":
                return { ...field, value: "+91 98765 43210" };
              case "Email":
                return { ...field, value: "ananya.sharma@example.com" };
              case "Address":
                return { ...field, value: "A-42, Vasant Vihar" };
              default:
                return field;
            }
          }),
        };
      }
      if (section.titleEn === "About") {
        return {
          ...section,
          fields: [{ ...section.fields[0], value: "I am a warm, family-oriented person with a passion for my career and creative pursuits." }],
        };
      }
      return section;
    }),
  };
}
