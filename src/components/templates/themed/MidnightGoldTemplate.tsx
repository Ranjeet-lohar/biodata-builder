import { createTheme, createThemedTemplate } from "./createThemedTemplate";

export const midnightGoldTheme = createTheme({
  id: "midnight-gold",
  name: "Midnight Gold",
  description: "A polished charcoal band with rich golden accents",
  layout: "band",
  swatch: ["#14161c", "#d4af37", "#ffffff"],
  bg: "#ffffff",
  text: "#1a1a1a",
  primary: "#14161c",
  secondary: "#d4af37",
  border: "#e6e1d3",
  headingFont: "'Cinzel', 'Noto Serif Devanagari', serif",
  bodyFont: "'EB Garamond', 'Noto Serif Devanagari', serif",
  photoShape: "rounded",
  corner: "none",
  shadow: "none",
  background: "floral",
});

export default createThemedTemplate(midnightGoldTheme);
