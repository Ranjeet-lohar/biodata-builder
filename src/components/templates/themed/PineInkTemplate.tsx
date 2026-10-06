import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const pineInkTheme = createTheme({
  id: "pine-ink",
  name: "Pine Ink",
  description: "Deep pine, parchment, and soft copper in a modern sidebar",
  layout: "sidebar",
  swatch: ["#23483d", "#b77b52", "#f7f6ef"],
  bg: "#f7f6ef",
  text: "#26352f",
  primary: "#23483d",
  secondary: "#8d765f",
  border: "#d9d6c9",
  headingFont: "'Cinzel', 'Noto Serif Devanagari', serif",
  bodyFont: "'Inter', 'Noto Sans Devanagari', sans-serif",
  photoShape: "rounded",
  corner: "none",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(pineInkTheme);
