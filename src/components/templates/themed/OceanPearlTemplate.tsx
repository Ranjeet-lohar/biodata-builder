import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const oceanPearlTheme = createTheme({
  id: "ocean-pearl",
  name: "Ocean Pearl",
  description: "Airy blue-green tones with a calm circular profile layout",
  layout: "centered",
  swatch: ["#176b87", "#8fc9c3", "#f3fbfa"],
  bg: "#f3fbfa",
  text: "#173c48",
  primary: "#176b87",
  secondary: "#4f8f91",
  border: "#b9ded9",
  headingFont: "'Source Serif 4', 'Noto Serif Devanagari', serif",
  bodyFont: "'Inter', 'Noto Sans Devanagari', sans-serif",
  photoShape: "circle",
  corner: "dots",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(oceanPearlTheme);
