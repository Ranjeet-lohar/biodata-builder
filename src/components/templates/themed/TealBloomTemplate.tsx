import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const tealBloomTheme = createTheme({
  id: "teal-bloom",
  name: "Teal Bloom",
  description: "Fresh teal styling with a confident modern sidebar",
  layout: "sidebar",
  swatch: ["#0f5c5c", "#38a3a5", "#ffffff"],
  bg: "#ffffff",
  text: "#1c2b2b",
  primary: "#0f5c5c",
  secondary: "#38a3a5",
  border: "#e3ecec",
  headingFont: "'Poppins', 'Noto Sans Devanagari', sans-serif",
  bodyFont: "'Inter', 'Noto Sans Devanagari', sans-serif",
  photoShape: "rect",
  corner: "none",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(tealBloomTheme);
