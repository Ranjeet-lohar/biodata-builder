export interface FontPack {
  id: string;
  name: string;
  sample: string;
  heading: string;
  body: string;
}

// Latin-only fonts fall back to this family for Hindi and other Devanagari text.
const DEVA = "'Noto Sans Devanagari'";

export const fontPacks: FontPack[] = [
  {
    id: "template",
    name: "Match Template",
    sample: "Aa",
    heading: "",
    body: "",
  },
  {
    id: "signature-serif",
    name: "Playfair Display",
    sample: "Aa",
    heading: `'Playfair Display', ${DEVA}, serif`,
    body: `'Playfair Display', ${DEVA}, serif`,
  },
  {
    id: "soft-elegance",
    name: "Cormorant Garamond",
    sample: "Aa",
    heading: `'Cormorant Garamond', ${DEVA}, serif`,
    body: `'Cormorant Garamond', ${DEVA}, serif`,
  },
  {
    id: "romantic-editorial",
    name: "Bodoni Moda",
    sample: "Aa",
    heading: `'Bodoni Moda', ${DEVA}, serif`,
    body: `'Bodoni Moda', ${DEVA}, serif`,
  },
  {
    id: "elegant-classic",
    name: "Lora",
    sample: "Aa",
    heading: `'Lora', ${DEVA}, serif`,
    body: `'Lora', ${DEVA}, serif`,
  },
  {
    id: "modern-sans",
    name: "Poppins",
    sample: "Aa",
    heading: `'Poppins', ${DEVA}, sans-serif`,
    body: `'Poppins', ${DEVA}, sans-serif`,
  },
  {
    id: "clean-modern",
    name: "Montserrat",
    sample: "Aa",
    heading: `'Montserrat', ${DEVA}, sans-serif`,
    body: `'Montserrat', ${DEVA}, sans-serif`,
  },
  {
    id: "minimal-swiss",
    name: "Inter",
    sample: "Aa",
    heading: `'Inter', ${DEVA}, sans-serif`,
    body: `'Inter', ${DEVA}, sans-serif`,
  },
  {
    id: "royal-script",
    name: "Cinzel",
    sample: "Aa",
    heading: `'Cinzel', ${DEVA}, serif`,
    body: `'Cinzel', ${DEVA}, serif`,
  },
  {
    id: "devanagari-traditional",
    name: "Tiro Devanagari Hindi",
    sample: "शुभ विवाह",
    heading: `'Tiro Devanagari Hindi', ${DEVA}, serif`,
    body: `'Tiro Devanagari Hindi', ${DEVA}, serif`,
  },
  {
    id: "devanagari-modern",
    name: "Noto Sans Devanagari",
    sample: "शुभ विवाह",
    heading: `'Noto Sans Devanagari', sans-serif`,
    body: `'Noto Sans Devanagari', sans-serif`,
  },
];

export function getFontPack(id: string): FontPack {
  return fontPacks.find((f) => f.id === id) ?? fontPacks[0];
}
