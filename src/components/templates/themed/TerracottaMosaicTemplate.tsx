import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const terracottaMosaicTheme = createTheme({
  id: "terracotta-mosaic",
  name: "Terracotta Mosaic",
  description: "Earthy terracotta and saffron accents in a lively split layout",
  layout: "split",
  swatch: ["#a84f35", "#e2a23b", "#fff7ed"],
  bg: "#fff7ed",
  text: "#49251c",
  primary: "#a84f35",
  secondary: "#9a6a35",
  border: "#edc98f",
  headingFont: "'Cormorant Garamond', 'Noto Serif Devanagari', serif",
  bodyFont: "'Inter', 'Noto Sans Devanagari', sans-serif",
  photoShape: "rounded",
  corner: "diamonds",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(terracottaMosaicTheme);
