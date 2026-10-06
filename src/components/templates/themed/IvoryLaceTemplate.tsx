import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const ivoryLaceTheme = createTheme({
  id: "ivory-lace",
  name: "Ivory Lace",
  description: "Soft ivory and silver with delicate diamond detailing",
  layout: "frame",
  swatch: ["#8a8578", "#c7c2b3", "#fffdf7"],
  bg: "#fffdf7",
  text: "#3c3a33",
  primary: "#8a8578",
  secondary: "#9c8e6a",
  border: "#c7c2b3",
  headingFont: "'Source Serif 4', 'Noto Serif Devanagari', serif",
  bodyFont: "'Lora', 'Noto Serif Devanagari', serif",
  photoShape: "rounded",
  corner: "diamonds",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(ivoryLaceTheme);
