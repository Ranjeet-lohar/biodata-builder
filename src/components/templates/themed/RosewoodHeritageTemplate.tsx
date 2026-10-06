import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const rosewoodHeritageTheme = createTheme({
  id: "rosewood-heritage",
  name: "Rosewood Heritage",
  description: "Warm rosewood, antique gold, and a refined heritage frame",
  layout: "frame",
  swatch: ["#6b2737", "#c69c6d", "#fbf4e8"],
  bg: "#fbf4e8",
  text: "#321f24",
  primary: "#6b2737",
  secondary: "#986b4d",
  border: "#c69c6d",
  headingFont: "'Playfair Display', 'Noto Serif Devanagari', serif",
  bodyFont: "'Lora', 'Noto Serif Devanagari', serif",
  photoShape: "rect",
  corner: "diamonds",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(rosewoodHeritageTheme);
