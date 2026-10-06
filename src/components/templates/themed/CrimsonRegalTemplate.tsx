import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const crimsonRegalTheme = createTheme({
  id: "crimson-regal",
  name: "Crimson Regal",
  description: "Bold crimson and gold with an ornate festive frame",
  layout: "frame",
  swatch: ["#8c1c2b", "#d9a441", "#fdf6ec"],
  bg: "#fdf6ec",
  text: "#3a1414",
  primary: "#8c1c2b",
  secondary: "#a3762a",
  border: "#d9a441",
  headingFont: "'Playfair Display', 'Noto Serif Devanagari', serif",
  bodyFont: "'Cormorant Garamond', 'Noto Serif Devanagari', serif",
  photoShape: "rect",
  corner: "paisley",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(crimsonRegalTheme);
