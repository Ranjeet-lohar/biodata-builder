import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const emeraldGardenTheme = createTheme({
  id: "emerald-garden",
  name: "Emerald Garden",
  description: "Opulent emerald and gold with artistic paisley corners",
  layout: "frame",
  swatch: ["#0f4a3c", "#c9a227", "#f4f7f0"],
  bg: "#f4f7f0",
  text: "#1c2e27",
  primary: "#0f4a3c",
  secondary: "#7a6a2a",
  border: "#c9a227",
  headingFont: "'Playfair Display', 'Noto Serif Devanagari', serif",
  bodyFont: "'Cormorant Garamond', 'Noto Serif Devanagari', serif",
  photoShape: "rect",
  corner: "paisley",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(emeraldGardenTheme);
