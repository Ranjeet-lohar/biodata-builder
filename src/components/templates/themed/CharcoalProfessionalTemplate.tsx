import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const charcoalProfessionalTheme = createTheme({
  id: "charcoal-professional",
  name: "Charcoal Professional",
  description: "Steel blue and charcoal with a clean professional finish",
  layout: "band",
  swatch: ["#2b2f38", "#4a6fa5", "#ffffff"],
  bg: "#ffffff",
  text: "#1f2229",
  primary: "#2b2f38",
  secondary: "#4a6fa5",
  border: "#e2e4e8",
  headingFont: "'Source Serif 4', 'Noto Serif Devanagari', serif",
  bodyFont: "'Inter', 'Noto Sans Devanagari', sans-serif",
  photoShape: "rect",
  corner: "none",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(charcoalProfessionalTheme);
