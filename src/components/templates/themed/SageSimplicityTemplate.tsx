import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const sageSimplicityTheme = createTheme({
  id: "sage-simplicity",
  name: "Sage Simplicity",
  description: "Muted sage tones with an understated modern sidebar",
  layout: "sidebar",
  swatch: ["#5b6b4f", "#a3b18a", "#fbfbf8"],
  bg: "#fbfbf8",
  text: "#2c2f27",
  primary: "#5b6b4f",
  secondary: "#8a9678",
  border: "#e6e6dd",
  headingFont: "'Poppins', 'Noto Sans Devanagari', sans-serif",
  bodyFont: "'Inter', 'Noto Sans Devanagari', sans-serif",
  photoShape: "rounded",
  corner: "none",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(sageSimplicityTheme);
