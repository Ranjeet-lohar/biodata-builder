import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const sunsetPeachTheme = createTheme({
  id: "sunset-peach",
  name: "Sunset Peach",
  description: "Warm peach and coral tones with a welcoming center focus",
  layout: "centered",
  swatch: ["#e07a5f", "#f2cc8f", "#fff8f2"],
  bg: "#fff8f2",
  text: "#5a3b2e",
  primary: "#e07a5f",
  secondary: "#c98a55",
  border: "#f2cc8f",
  headingFont: "'Playfair Display', 'Noto Serif Devanagari', serif",
  bodyFont: "'Cormorant Garamond', 'Noto Serif Devanagari', serif",
  photoShape: "circle",
  corner: "dots",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(sunsetPeachTheme);
