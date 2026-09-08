import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  bg: "#f7f5f1",
  card: "#ffffff",
  ink: "#22262b",
  muted: "#7c8590",
  primary: "#2f5d50",
  primarySoft: "#dce8e2",
  accent: "#c98a4b",
  line: "#e9e5dc",
};

// A4 at 96dpi-equivalent mm->px isn't needed here since everything is authored
// in mm; keep the page height as a constant so the fit-to-page logic and the
// outer frame stay in sync.
const PAGE_HEIGHT_MM = 297;
const PAGE_WIDTH_MM = 210;
const OUTER_PAD_MM = 14; // matches p-[14mm] below

// Accent glow colors layered on top of the existing earthy palette so the
// frame reads as "modern / futuristic" (thin vector linework, HUD-style
// corner brackets, circuit-node accents, gradient glow) without abandoning
// the warm card colors used everywhere else in the template.
const glow = {
  cyan: "#3fd0c9",
  violet: "#7c6ef2",
};

/**
 * Vector frame replacing the old raster frame-bio.png. Draws:
 *  - a soft ambient glow in two corners
 *  - a fine 1px inset border
 *  - HUD-style open corner brackets
 *  - a thin circuit trace with node dots along one edge
 *  - a faint dot-grid in the far corner for texture
 * All linework uses vector strokes so it stays crisp at any print DPI.
 */
const FuturisticFrame = () => {
  const W = 794;
  const H = 1123;
  const inset = 26; // px in the 794x1123 viewBox, keeps the border off the trim edge

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="glowCyan" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={glow.cyan} stopOpacity="0.16" />
          <stop offset="100%" stopColor={glow.cyan} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowViolet" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={glow.violet} stopOpacity="0.14" />
          <stop offset="100%" stopColor={glow.violet} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="edgeLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={glow.cyan} stopOpacity="0" />
          <stop offset="45%" stopColor={glow.cyan} stopOpacity="0.55" />
          <stop offset="55%" stopColor={glow.violet} stopOpacity="0.55" />
          <stop offset="100%" stopColor={glow.violet} stopOpacity="0" />
        </linearGradient>
        <pattern id="dotGrid" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="1.2" fill={palette.primary} fillOpacity="0.14" />
        </pattern>
      </defs>

      {/* ambient corner glows */}
      <circle cx={W - 40} cy={40} r="220" fill="url(#glowCyan)" />
      <circle cx={40} cy={H - 60} r="240" fill="url(#glowViolet)" />

      {/* dot-grid texture, top-left corner only */}
      <rect x="0" y="0" width="170" height="170" fill="url(#dotGrid)" />

      {/* fine inset border */}
      <rect
        x={inset}
        y={inset}
        width={W - inset * 2}
        height={H - inset * 2}
        fill="none"
        stroke={palette.line}
        strokeWidth="1"
      />

      {/* gradient accent line tracing the top edge, just inside the border */}
      <line x1={inset + 60} y1={inset + 14} x2={W - inset - 60} y2={inset + 14} stroke="url(#edgeLine)" strokeWidth="2" />
      {/* circuit nodes along that trace */}
      {[0.18, 0.36, 0.64, 0.82].map((t, i) => (
        <circle
          key={i}
          cx={inset + 60 + (W - inset * 2 - 120) * t}
          cy={inset + 14}
          r="3"
          fill={i % 2 === 0 ? glow.cyan : glow.violet}
          fillOpacity="0.7"
        />
      ))}

      {/* HUD-style open corner brackets */}
      {[
        { x: inset, y: inset, dx: 1, dy: 1 },
        { x: W - inset, y: inset, dx: -1, dy: 1 },
        { x: inset, y: H - inset, dx: 1, dy: -1 },
        { x: W - inset, y: H - inset, dx: -1, dy: -1 },
      ].map(({ x, y, dx, dy }, i) => {
        const len = 34;
        return (
          <path
            key={i}
            d={`M ${x + dx * len} ${y} L ${x} ${y} L ${x} ${y + dy * len}`}
            fill="none"
            stroke={palette.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

const IdentityRing = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" className="inline-block">
    <circle cx="4" cy="4" r="4" fill={palette.accent} />
  </svg>
);

const SoftDivider = () => (
  <div className="flex items-center gap-1.5 my-1">
    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: palette.accent }} />
    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: palette.accent, opacity: 0.5 }} />
    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: palette.accent, opacity: 0.25 }} />
  </div>
);

const ClassicTemplate = forwardRef<HTMLDivElement, { doc: BiodataDocument; fonts: FontPack }>(
  ({ doc, fonts }, ref) => {
    const lang = doc.language;
    const L = (en: string, hi: string) => (lang === "hi" ? hi : en);
    const heading = fonts.heading || "'Playfair Display', 'Noto Serif Devanagari', serif";
    const body = fonts.body || "'Inter', 'Noto Sans Devanagari', sans-serif";
    const visibleSections = doc.sections.filter((s) => s.visible);
    const gridSections = visibleSections.filter((s) => s.type === "grid");
    const paragraphSections = visibleSections.filter((s) => s.type === "paragraph");
    const aboutSection = paragraphSections.find((s) => /about/i.test(s.titleEn)) ?? paragraphSections[0];
    const restParagraphs = paragraphSections.filter((s) => s !== aboutSection);

    // --- Auto-fit content to a single A4 page -------------------------------
    // Content length is user-controlled (any number of grid fields / paragraph
    // sections), so instead of guessing at padding/font sizes we measure the
    // actual rendered height and scale the whole block down (never up) until
    // it fits inside the printable area. transform-origin stays top-center so
    // the frame border and identity card never get clipped asymmetrically.
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useLayoutEffect(() => {
      const el = contentRef.current;
      if (!el) return;

      const mmToPx = (mm: number) => (mm / 25.4) * 96;
      const availableHeightPx = mmToPx(PAGE_HEIGHT_MM - OUTER_PAD_MM * 2);

      const measure = () => {
        // Reset scale before measuring so we're reading natural height, not a
        // previously-scaled one.
        el.style.transform = "scale(1)";
        const naturalHeight = el.scrollHeight;
        const next = naturalHeight > availableHeightPx ? availableHeightPx / naturalHeight : 1;
        setScale(Math.max(next, 0.55)); // floor so text never becomes illegible
      };

      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }, [doc, fonts]);
    // -------------------------------------------------------------------------

    return (
      <div
        ref={ref}
        className="a4-page relative shrink-0 overflow-hidden"
        style={{
          width: `${PAGE_WIDTH_MM}mm`,
          height: `${PAGE_HEIGHT_MM}mm`, // fixed height (not min-h) so the page never grows
          backgroundColor: palette.bg,
          color: palette.ink,
          fontFamily: body,
          padding: `${OUTER_PAD_MM}mm`,
        }}
      >
        <FuturisticFrame />

        <div
          ref={contentRef}
          className="relative px-10 pt-8 pb-8"
          style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
        >
          {/* Identity card */}
          <div
            className="flex items-center gap-7 rounded-[28px] px-9 py-7 avoid-break"
            style={{ backgroundColor: palette.card, boxShadow: "0 8px 30px rgba(34,38,43,0.06)", border: `1px solid ${palette.line}` }}
          >
            <div className="relative shrink-0">
              <div
                className="w-[112px] h-[112px] rounded-full overflow-hidden"
                style={{ border: `4px solid ${palette.card}`, boxShadow: `0 0 0 2px ${palette.primarySoft}` }}
              >
                {doc.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-[10px] text-center"
                    style={{ color: palette.muted, backgroundColor: palette.primarySoft }}
                  >
                    {L("Photo", "फोटो")}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {doc.invocation.enabled && (
                <p
                  className="text-[11px] tracking-[0.15em] uppercase mb-1.5 flex items-center gap-1.5"
                  style={{ color: palette.accent }}
                >
                  <IdentityRing /> {doc.invocation.text}
                </p>
              )}
              <h1 className="text-[32px] leading-tight font-semibold truncate" style={{ fontFamily: heading, color: palette.ink }}>
                {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
              </h1>
              <p
                className="mt-1.5 inline-block text-[11px] tracking-[0.2em] uppercase px-3 py-1 rounded-full"
                style={{ backgroundColor: palette.primarySoft, color: palette.primary }}
              >
                {L("Marriage Biodata", "विवाह हेतु बायोडाटा")}
              </p>
            </div>
          </div>

          {/* About */}
          {aboutSection && (
            <div className="mt-5 rounded-[20px] px-8 py-5 avoid-break" style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}>
              <p className="text-[14px] leading-relaxed" style={{ color: palette.ink, opacity: 0.82 }}>
                {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
              </p>
            </div>
          )}

          {/* Grid sections as cards */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            {gridSections.map((section) => (
              <div
                key={section.id}
                className="avoid-break rounded-[20px] px-7 py-5"
                style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}`, boxShadow: "0 4px 16px rgba(34,38,43,0.03)" }}
              >
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: palette.primary, fontFamily: heading }}>
                  {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                </h2>
                <SoftDivider />
                <div className="mt-1.5 space-y-1.5 text-[13px]">
                  {section.fields.map((f) => (
                    <div key={f.id} className="flex justify-between items-baseline gap-3 avoid-break">
                      <span style={{ color: palette.muted }}>{lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}</span>
                      <span className="text-right font-medium" style={{ color: palette.ink }}>
                        {f.value?.trim() ? f.value : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Remaining paragraph sections */}
          {restParagraphs.length > 0 && (
            <div className="mt-4 space-y-4">
              {restParagraphs.map((section) => (
                <div key={section.id} className="avoid-break rounded-[20px] px-8 py-5" style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}>
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] mb-1" style={{ color: palette.primary, fontFamily: heading }}>
                    {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  </h2>
                  <SoftDivider />
                  <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: palette.ink, opacity: 0.85 }}>
                    {(lang === "hi" && section.fields[0]?.valueHi) || section.fields[0]?.value || "—"}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-px w-16" style={{ backgroundColor: palette.line }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: palette.accent }} />
            <span className="h-px w-16" style={{ backgroundColor: palette.line }} />
          </div>
        </div>
      </div>
    );
  }
);

ClassicTemplate.displayName = "ClassicTemplate";
export default ClassicTemplate;