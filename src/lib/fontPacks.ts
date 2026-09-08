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

  // ─────────────────────────────────────────────
  // Elegant / Romantic
  // ─────────────────────────────────────────────

  {
    id: "signature-serif",
    name: "Signature Serif",
    sample: "Aa",
    heading: `'Playfair Display', ${DEVA}, serif`,
    body: `'Cormorant Garamond', ${DEVA}, serif`,
  },

  {
    id: "romantic-editorial",
    name: "Romantic Editorial",
    sample: "Aa",
    heading: `'Bodoni Moda', ${DEVA}, serif`,
    body: `'Libre Baskerville', ${DEVA}, serif`,
  },

  {
    id: "elegant-classic",
    name: "Elegant Classic",
    sample: "Aa",
    heading: `'DM Serif Display', ${DEVA}, serif`,
    body: `'Lora', ${DEVA}, serif`,
  },

  {
    id: "soft-elegance",
    name: "Soft Elegance",
    sample: "Aa",
    heading: `'Cormorant Garamond', ${DEVA}, serif`,
    body: `'Montserrat', ${DEVA}, sans-serif`,
  },

  {
    id: "editorial-luxury",
    name: "Editorial Luxury",
    sample: "Aa",
    heading: `'Libre Bodoni', ${DEVA}, serif`,
    body: `'Source Sans 3', ${DEVA}, sans-serif`,
  },

  // ─────────────────────────────────────────────
  // Modern
  // ─────────────────────────────────────────────

  {
    id: "modern-sans",
    name: "Modern Sans",
    sample: "Aa",
    heading: `'Poppins', ${DEVA}, sans-serif`,
    body: `'Inter', ${DEVA}, sans-serif`,
  },

  {
    id: "clean-modern",
    name: "Clean Modern",
    sample: "Aa",
    heading: `'Montserrat', ${DEVA}, sans-serif`,
    body: `'Open Sans', ${DEVA}, sans-serif`,
  },

  {
    id: "minimal-swiss",
    name: "Minimal Swiss",
    sample: "Aa",
    heading: `'Josefin Sans', ${DEVA}, sans-serif`,
    body: `'Inter', ${DEVA}, sans-serif`,
  },

  {
    id: "modern-editorial",
    name: "Modern Editorial",
    sample: "Aa",
    heading: `'Manrope', ${DEVA}, sans-serif`,
    body: `'DM Sans', ${DEVA}, sans-serif`,
  },

  // ─────────────────────────────────────────────
  // Classic / Editorial
  // ─────────────────────────────────────────────

  {
    id: "classic-editorial",
    name: "Classic Editorial",
    sample: "Aa",
    heading: `'Source Serif 4', ${DEVA}, serif`,
    body: `'Lora', ${DEVA}, serif`,
  },

  {
    id: "literary",
    name: "Literary",
    sample: "Aa",
    heading: `'Merriweather', ${DEVA}, serif`,
    body: `'Source Serif 4', ${DEVA}, serif`,
  },

  {
    id: "old-world",
    name: "Old World",
    sample: "Aa",
    heading: `'Libre Baskerville', ${DEVA}, serif`,
    body: `'Crimson Pro', ${DEVA}, serif`,
  },

  {
    id: "newspaper",
    name: "Newspaper",
    sample: "Aa",
    heading: `'Playfair Display', ${DEVA}, serif`,
    body: `'Source Sans 3', ${DEVA}, sans-serif`,
  },

  // ─────────────────────────────────────────────
  // Royal / Luxury
  // ─────────────────────────────────────────────

  {
    id: "royal-script",
    name: "Royal Script",
    sample: "Aa",
    heading: `'Cinzel', ${DEVA}, serif`,
    body: `'EB Garamond', ${DEVA}, serif`,
  },

  {
    id: "royal-classic",
    name: "Royal Classic",
    sample: "Aa",
    heading: `'Cinzel Decorative', ${DEVA}, serif`,
    body: `'Cormorant Garamond', ${DEVA}, serif`,
  },

  {
    id: "luxury-display",
    name: "Luxury Display",
    sample: "Aa",
    heading: `'Bodoni Moda', ${DEVA}, serif`,
    body: `'Montserrat', ${DEVA}, sans-serif`,
  },

  {
    id: "heritage",
    name: "Royal Heritage",
    sample: "Aa",
    heading: `'Cormorant SC', ${DEVA}, serif`,
    body: `'EB Garamond', ${DEVA}, serif`,
  },

  // ─────────────────────────────────────────────
  // Handwritten / Signature
  // ─────────────────────────────────────────────

  {
    id: "signature",
    name: "Signature",
    sample: "Aa",
    heading: `'Great Vibes', ${DEVA}, cursive`,
    body: `'Lato', ${DEVA}, sans-serif`,
  },

  {
    id: "allura",
    name: "Allura",
    sample: "Aa",
    heading: `'Allura', ${DEVA}, cursive`,
    body: `'Montserrat', ${DEVA}, sans-serif`,
  },

  {
    id: "dancing-script",
    name: "Dancing Script",
    sample: "Aa",
    heading: `'Dancing Script', ${DEVA}, cursive`,
    body: `'Poppins', ${DEVA}, sans-serif`,
  },

  {
    id: "sacramento",
    name: "Sacramento",
    sample: "Aa",
    heading: `'Sacramento', ${DEVA}, cursive`,
    body: `'Lora', ${DEVA}, serif`,
  },

  // ─────────────────────────────────────────────
  // Decorative
  // ─────────────────────────────────────────────

  {
    id: "art-deco",
    name: "Art Deco",
    sample: "Aa",
    heading: `'Poiret One', ${DEVA}, sans-serif`,
    body: `'Montserrat', ${DEVA}, sans-serif`,
  },

  {
    id: "vintage",
    name: "Vintage",
    sample: "Aa",
    heading: `'Bree Serif', ${DEVA}, serif`,
    body: `'Lora', ${DEVA}, serif`,
  },

  {
    id: "fashion",
    name: "Fashion",
    sample: "Aa",
    heading: `'Italiana', ${DEVA}, serif`,
    body: `'Montserrat', ${DEVA}, sans-serif`,
  },

  // ─────────────────────────────────────────────
  // Devanagari
  // ─────────────────────────────────────────────

  {
    id: "devanagari-traditional",
    name: "Devanagari Traditional",
    sample: "अआ",
    heading: `'Tiro Devanagari Hindi', 'Playfair Display', ${DEVA}, serif`,
    body: `'Tiro Devanagari Hindi', 'Cormorant Garamond', ${DEVA}, serif`,
  },

  {
    id: "devanagari-elegant",
    name: "Devanagari Elegant",
    sample: "शुभ विवाह",
    heading: `'Noto Serif Devanagari', ${DEVA}, serif`,
    body: `'Noto Sans Devanagari', ${DEVA}, sans-serif`,
  },

  {
    id: "devanagari-modern",
    name: "Devanagari Modern",
    sample: "शुभ विवाह",
    heading: `'Mukta', ${DEVA}, sans-serif`,
    body: `'Noto Sans Devanagari', ${DEVA}, sans-serif`,
  },

  {
    id: "devanagari-classic",
    name: "Devanagari Classic",
    sample: "शुभ विवाह",
    heading: `'Karma', ${DEVA}, serif`,
    body: `'Hind', ${DEVA}, sans-serif`,
  },
];

export function getFontPack(id: string): FontPack {
  return fontPacks.find((f) => f.id === id) ?? fontPacks[0];
}
