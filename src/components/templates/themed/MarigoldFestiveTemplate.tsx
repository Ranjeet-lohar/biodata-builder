import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const marigoldFestiveTheme = createTheme({
  id: "marigold-festive",
  name: "Marigold Festive",
  description: "Joyful marigold orange tones in a bright split layout",
  layout: "split",
  swatch: ["#c9660b", "#f2b134", "#fff9ef"],
  bg: "#fff9ef",
  text: "#4a2e10",
  primary: "#c9660b",
  secondary: "#a85f1c",
  border: "#fbe4b8",
  headingFont: "'Playfair Display', 'Noto Serif Devanagari', serif",
  bodyFont: "'Cormorant Garamond', 'Noto Serif Devanagari', serif",
  photoShape: "rounded",
  corner: "diamonds",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(marigoldFestiveTheme);
