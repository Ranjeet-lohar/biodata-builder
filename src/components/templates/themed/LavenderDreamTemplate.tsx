import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const lavenderDreamTheme = createTheme({
  id: "lavender-dream",
  name: "Lavender Dream",
  description: "Soft lavender romance in a balanced centered layout",
  layout: "centered",
  swatch: ["#7b6a9e", "#c9b6e4", "#faf8fd"],
  bg: "#faf8fd",
  text: "#40365a",
  primary: "#7b6a9e",
  secondary: "#9a86bd",
  border: "#dfd2f0",
  headingFont: "'Playfair Display', 'Noto Serif Devanagari', serif",
  bodyFont: "'Cormorant Garamond', 'Noto Serif Devanagari', serif",
  photoShape: "circle",
  corner: "dots",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(lavenderDreamTheme);
