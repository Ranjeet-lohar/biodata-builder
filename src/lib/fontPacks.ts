export interface FontPack {
  id: string;
  name: string;
  sample: string;
  heading: string;
  body: string;
}

// Devanagari fallbacks are appended to every stack so Hindi text always
// renders with a matching typeface even when the primary font is Latin-only.
const DEVA = "'Noto Sans Devanagari', 'Noto Serif Devanagari'";

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
    name: "Signature Serif",
    sample: "Aa",
    heading: `'Playfair Display', ${DEVA}, serif`,
    body: `'Cormorant Garamond', ${DEVA}, serif`,
  },
  {
    id: "modern-sans",
    name: "Modern Sans",
    sample: "Aa",
    heading: `'Poppins', ${DEVA}, sans-serif`,
    body: `'Inter', ${DEVA}, sans-serif`,
  },
  {
    id: "classic-editorial",
    name: "Classic Editorial",
    sample: "Aa",
    heading: `'Source Serif 4', ${DEVA}, serif`,
    body: `'Lora', ${DEVA}, serif`,
  },
  {
    id: "royal-script",
    name: "Royal Script",
    sample: "Aa",
    heading: `'Cinzel', ${DEVA}, serif`,
    body: `'EB Garamond', ${DEVA}, serif`,
  },
  {
    id: "devanagari-traditional",
    name: "Devanagari Traditional",
    sample: "अआ",
    heading: `'Tiro Devanagari Hindi', 'Playfair Display', ${DEVA}, serif`,
    body: `'Tiro Devanagari Hindi', 'Cormorant Garamond', ${DEVA}, serif`,
  },
];

export function getFontPack(id: string): FontPack {
  return fontPacks.find((f) => f.id === id) ?? fontPacks[0];
}
