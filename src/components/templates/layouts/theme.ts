export interface Theme {
  /** Unique theme identifier */
  id: string;

  /** Display name shown in theme selector */
  name: string;

  /** Short description for the UI */
  description: string;

  /** Theme preview colors */
  swatch: [string, string, string];

  /** Main page / paper background */
  bg: string;

  /** Main text color */
  text: string;

  /** Primary brand color — headings, major accents */
  primary: string;

  /** Secondary color — labels, metadata, muted text */
  secondary: string;

  /** Borders, dividers and subtle lines */
  border: string;

  /** Decorative accent — gold, coral, rose, etc. */
  accent: string;

  /** Soft version of the primary/accent color */
  accentSoft: string;

  /** Heading typography */
  headingFont: string;

  /** Body typography */
  bodyFont: string;

  /** Profile photograph shape */
  photoShape: "rect" | "circle" | "rounded";

  /** Decorative corner/background motif */
  corner:
    | "paisley"
    | "dots"
    | "diamonds"
    | "floral"
    | "lotus"
    | "leaves"
    | "geometric"
    | "none";

  /** Overall visual style */
  style:
    | "classic"
    | "editorial"
    | "floral"
    | "minimal"
    | "luxury"
    | "modern";

  /** Border radius — useful for switching between rounded and sharp designs */
  radius:
    | "none"
    | "sm"
    | "md"
    | "lg"
    | "full";

  /** Shadow intensity */
  shadow:
    | "none"
    | "soft"
    | "medium";

  /** Decorative background treatment */
  background:
    | "solid"
    | "gradient"
    | "pattern"
    | "floral";

  /** Optional paper texture */
  texture?: boolean;
}
