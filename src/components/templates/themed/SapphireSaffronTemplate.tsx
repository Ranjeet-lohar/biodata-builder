import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const sapphireSaffronTheme = createTheme({
  id: "sapphire-saffron",
  name: "Sapphire Saffron",
  description: "Confident sapphire with saffron highlights and a polished band",
  layout: "band",
  swatch: ["#164e63", "#e5a83b", "#f8fbfc"],
  bg: "#f8fbfc",
  text: "#18313c",
  primary: "#164e63",
  secondary: "#a16f25",
  border: "#c7dce2",
  headingFont: "'Playfair Display', 'Noto Serif Devanagari', serif",
  bodyFont: "'Inter', 'Noto Sans Devanagari', sans-serif",
  photoShape: "rect",
  corner: "none",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(sapphireSaffronTheme);
