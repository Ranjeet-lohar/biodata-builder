import { forwardRef } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  bg: "#0a0c12",
  panel: "#12151d",
  panelSoft: "#0f1218",
  ink: "#eef1f8",
  sub: "#98a0b3",
  line: "#20242f",
  rail: "#0d0f16",
  label: "#5c6478",
};

const glow = {
  cyan: "#2dd4ff",
  violet: "#a78bfa",
  rose: "#fb7dc4",
};

// Fixed page geometry — do NOT rely on flex-1/percent sizing to lay out
// the page. html2canvas/jsPDF-style capture pipelines frequently fail to
// resolve flex-grow or 100% widths on cloned/offscreen nodes, which can
// collapse columns to 0 width and drop content from the exported PDF.
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const RAIL_WIDTH_MM = 16;
const MAIN_WIDTH_MM = PAGE_WIDTH_MM - RAIL_WIDTH_MM;

// Slim left accent rail: gradient spine, tick marks, and a rotated
// "BIODATA" label — reads as a spec-sheet / ID-badge edge rather than
// a full sidebar, so the main column keeps almost the full page width.
const AccentRail = ({ label }: { label: string }) => {
  const W = 60;
  const H = 1123;
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="railGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={glow.cyan} stopOpacity="0.9" />
          <stop offset="50%" stopColor={glow.violet} stopOpacity="0.9" />
          <stop offset="100%" stopColor={glow.rose} stopOpacity="0.9" />
        </linearGradient>
        <pattern id="railDots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#ffffff" fillOpacity="0.05" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={palette.rail} />
      <rect width={W} height={H} fill="url(#railDots)" />
      <rect x={W - 3} y="0" width="3" height={H} fill="url(#railGrad)" />
      {Array.from({ length: 26 }).map((_, i) => (
        <line
          key={i}
          x1={W - 14}
          y1={30 + i * 42}
          x2={W - 8}
          y2={30 + i * 42}
          stroke="#ffffff"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
      ))}
      <text
        x={H / 2}
        y={22}
        transform={`rotate(-90, ${W / 2}, ${H / 2})`}
        textAnchor="middle"
        fill="#ffffff"
        fillOpacity="0.22"
        fontSize="15"
        letterSpacing="8"
        style={{ fontFamily: "sans-serif" }}
      >
        {label}
      </text>
    </svg>
  );
};

const HexPortrait = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-[150px] h-[150px] shrink-0">
    <svg className="absolute -inset-2 pointer-events-none" viewBox="0 0 170 170" fill="none">
      <polygon
        points="85,3 160,44 160,126 85,167 10,126 10,44"
        stroke="url(#hexStroke)"
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient id="hexStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={glow.cyan} />
          <stop offset="100%" stopColor={glow.violet} />
        </linearGradient>
        <clipPath id="hexClip">
          <polygon points="82,10 152,48 152,124 82,162 12,124 12,48" />
        </clipPath>
      </defs>
      <g clipPath="url(#hexClip)">
        <rect x="0" y="0" width="170" height="170" fill={palette.panel} />
      </g>
    </svg>
    <div
      className="absolute overflow-hidden"
      style={{
        top: "8px",
        left: "10px",
        width: "150px",
        height: "150px",
        clipPath: "polygon(50% 0%, 93% 24%, 93% 76%, 50% 100%, 7% 76%, 7% 24%)",
      }}
    >
      {children}
    </div>
  </div>
);

const SectionMarker = ({ index }: { index: number }) => (
  <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
    <svg width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10.5" fill="none" stroke={palette.line} strokeWidth="1" />
      <circle cx="12" cy="12" r="10.5" fill="none" stroke={glow.cyan} strokeWidth="1.5" strokeDasharray="8 58" />
    </svg>
    <span
      className="absolute text-[9px] font-semibold"
      style={{ color: glow.cyan }}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  </div>
);

const RowMark = () => (
  <svg width="7" height="7" viewBox="0 0 7 7" className="shrink-0 mt-[7px]">
    <polygon points="3.5,0 7,3.5 3.5,7 0,3.5" fill={glow.violet} opacity="0.85" />
  </svg>
);

const NeoGlassTemplate = forwardRef<
HTMLDivElement,
  { doc: BiodataDocument; fonts: FontPack }
>(({ doc, fonts }, ref) => {
  const lang = doc.language;
  const L = (en: string, hi: string) => (lang === "hi" ? hi : en);
  const heading = fonts.heading || "'Space Grotesk', 'Noto Serif Devanagari', sans-serif";
  const body = fonts.body || "'Inter', 'Noto Serif Devanagari', sans-serif";
  const visibleSections = doc.sections.filter((s) => s.visible);
  const aboutSection = visibleSections.find((s) => s.type === "paragraph" && /about/i.test(s.titleEn));
  const otherSections = visibleSections.filter((s) => s !== aboutSection);

  return (
    <div
      ref={ref}
      className="relative a4-page flex overflow-hidden"
      style={{
        width: `${PAGE_WIDTH_MM}mm`,
        minHeight: `${PAGE_HEIGHT_MM}mm`,
        backgroundColor: palette.bg,
        color: palette.ink,
        fontFamily: body,
        boxSizing: "border-box",
      }}
    >
      {/* Solid background layer — kept as its own child rather than
          relying on the root's inline backgroundColor. The shared
          .a4-page class (used by the light/paper templates) forces a
          white background with !important for print/paper styling,
          which otherwise beats this element's inline style and washes
          the page to white during PDF export. */}
      <div className="absolute inset-0" style={{ backgroundColor: palette.bg }} />

      {/* Accent rail */}
      <div
        className="relative shrink-0"
        style={{ width: `${RAIL_WIDTH_MM}mm`, boxSizing: "border-box" }}
      >
        <AccentRail label={L("BIODATA", "बायोडाटा")} />
      </div>

      {/* Main column — explicit width instead of flex-1 */}
      <div
        className="relative"
        style={{ width: `${MAIN_WIDTH_MM}mm`, boxSizing: "border-box" }}
      >
        {/* Header */}
        <div className="relative px-12 pt-14 pb-8 flex items-center gap-7 avoid-break">
          <HexPortrait>
            {doc.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-[10.5px]"
                style={{ backgroundColor: palette.panel, color: palette.sub }}
              >
                {L("Photo", "फोटो")}
              </div>
            )}
          </HexPortrait>

          <div className="flex-1 min-w-0">
            {doc.invocation.enabled && (
              <p
                className="text-[10px] tracking-[0.3em] uppercase mb-2"
                style={{ color: glow.cyan }}
              >
                {doc.invocation.text}
              </p>
            )}
            {/* Plain solid color instead of a gradient-clipped-text
                effect — background-clip: text is unreliable in
                html2canvas/jsPDF-style export pipelines: the clip mask
                often doesn't apply, so the gradient paints as a solid
                block instead of showing through the text. */}
            <h1
              className="text-[32px] leading-tight font-bold truncate"
              style={{ fontFamily: heading, color: palette.ink }}
            >
              {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
            </h1>
            <p
              className="mt-2 text-[10.5px] tracking-[0.25em] uppercase"
              style={{ color: palette.sub }}
            >
              {L("Marriage Biodata", "वैवाहिक बायोडाटा")}
            </p>
          </div>
        </div>

        {aboutSection && (
          <div className="relative px-12 pb-8 avoid-break">
            <div
              className="px-5 py-4 text-[13px] leading-relaxed rounded-[10px]"
              style={{
                backgroundColor: palette.panelSoft,
                border: `1px solid ${palette.line}`,
                borderLeft: `2px solid ${glow.violet}`,
                color: palette.sub,
              }}
            >
              {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
            </div>
          </div>
        )}

        {/* Sections */}
        <div className="relative px-12 pb-14 space-y-7">
          {otherSections.map((section, idx) =>
            section.type === "grid" ? (
              <div key={section.id} className="avoid-break">
                <div className="flex items-center gap-3 mb-4">
                  <SectionMarker index={idx} />
                  <h2
                    className="text-[16.5px] font-semibold tracking-wide"
                    style={{ fontFamily: heading, color: palette.ink }}
                  >
                    {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  </h2>
                  <span className="flex-1 h-px ml-1" style={{ backgroundColor: palette.line }} />
                </div>
                <div
                  className="grid grid-cols-2 gap-x-8 gap-y-3 pl-9 py-4 pr-5 rounded-[10px]"
                  style={{ backgroundColor: palette.panel, border: `1px solid ${palette.line}` }}
                >
                  {section.fields.map((f) => (
                    <div key={f.id} className="flex gap-2 items-start avoid-break">
                      <RowMark />
                      <div className="flex flex-col">
                        <span
                          className="text-[9.5px] tracking-[0.08em] uppercase"
                          style={{ color: palette.label }}
                        >
                          {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                        </span>
                        <span className="text-[14px]" style={{ color: palette.ink }}>
                          {f.value?.trim() ? f.value : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div key={section.id} className="avoid-break">
                <div className="flex items-center gap-3 mb-3">
                  <SectionMarker index={idx} />
                  <h2
                    className="text-[16.5px] font-semibold tracking-wide"
                    style={{ fontFamily: heading, color: palette.ink }}
                  >
                    {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  </h2>
                  <span className="flex-1 h-px ml-1" style={{ backgroundColor: palette.line }} />
                </div>
                <p className="pl-9 text-[14px] leading-relaxed" style={{ color: palette.sub }}>
                  {(lang === "hi" && section.fields[0]?.valueHi) || section.fields[0]?.value || "—"}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
});

NeoGlassTemplate.displayName = "NeoGlassTemplate";
export default NeoGlassTemplate;