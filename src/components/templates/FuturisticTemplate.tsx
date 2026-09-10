import { forwardRef } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  bg: "#0b0e14",
  panel: "#11151d",
  ink: "#e7ecf5",
  sub: "#8b95a7",
  line: "#232a38",
  primary: "#7dd8ff",
  accent: "#8f7bff",
  label: "#5c6478",
};

const glow = {
  cyan: "#22d3ee",
  violet: "#8b5cf6",
};

// Fixed page geometry — do NOT rely on flex-1/percent sizing to lay out
// the page. html2canvas/jsPDF-style capture pipelines frequently fail to
// resolve flex-grow or 100% widths on cloned/offscreen nodes, which can
// collapse columns to 0 width and drop content from the exported PDF.
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;

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

const PortraitFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-[132px] h-[132px] shrink-0">
    <svg className="absolute -inset-2 pointer-events-none" viewBox="0 0 152 152" fill="none">
      <rect x="1" y="1" width="150" height="150" rx="14" stroke={glow.cyan} strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="1" cy="1" r="2" fill={glow.cyan} />
      <circle cx="151" cy="1" r="2" fill={glow.violet} />
      <circle cx="1" cy="151" r="2" fill={glow.violet} />
      <circle cx="151" cy="151" r="2" fill={glow.cyan} />
    </svg>
    <div className="relative w-full h-full rounded-[10px] overflow-hidden" style={{ backgroundColor: palette.panel, border: `1px solid ${palette.line}` }}>
      {children}
    </div>
  </div>
);

const RowIcon = () => (
  <svg width="6" height="6" viewBox="0 0 6 6" className="shrink-0 mt-[3px]">
    <rect width="6" height="6" rx="1.5" fill={glow.cyan} opacity="0.8" />
  </svg>
);

const FuturisticTemplate = forwardRef<
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
      className="relative a4-page overflow-hidden"
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
      {/* <FuturisticFrame /> */}

      {/* Header */}
      <div className="relative px-16 pt-16 pb-8 flex items-center gap-6 avoid-break">
        <PortraitFrame>
          {doc.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-[11px]"
              style={{ color: palette.sub }}
            >
              {L("Photo", "फोटो")}
            </div>
          )}
        </PortraitFrame>

        <div className="flex-1 min-w-0">
          {doc.invocation.enabled && (
            <p
              className="text-[10.5px] tracking-[0.25em] uppercase mb-2"
              style={{ color: glow.cyan }}
            >
              {doc.invocation.text}
            </p>
          )}
          <h1
            className="text-[30px] leading-normal font-semibold truncate"
            style={{ fontFamily: heading, color: palette.ink }}
          >
            {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="h-px flex-1"
              style={{ background: `linear-gradient(90deg, ${glow.cyan}, ${glow.violet})`, opacity: 0.5 }}
            />
            <p
              className="text-[10.5px] tracking-[0.3em] uppercase shrink-0"
              style={{ color: palette.sub }}
            >
              {L("Biodata", "बायोडाटा")}
            </p>
          </div>
          {aboutSection && (
            <p className="mt-3 text-[13px] leading-relaxed" style={{ color: palette.sub }}>
              {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
            </p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="relative px-16 pb-16">
        <div className="space-y-8">
          {otherSections.map((section, idx) =>
            section.type === "grid" ? (
              <div key={section.id} className="avoid-break">
                <div className="flex items-baseline gap-3 mb-4">
                  <span
                    className="text-[24px] font-light leading-none"
                    style={{ color: glow.violet, fontFamily: heading }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2
                    className="text-[17px] font-semibold tracking-wide"
                    style={{ fontFamily: heading, color: palette.ink }}
                  >
                    {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  </h2>
                  <span className="flex-1 h-px ml-2" style={{ backgroundColor: palette.line }} />
                </div>
                <div
                  className="grid grid-cols-2 gap-x-8 gap-y-3 pl-9 py-4"
                  style={{ backgroundColor: palette.panel, border: `1px solid ${palette.line}`, borderRadius: "8px" }}
                >
                  {section.fields.map((f) => (
                    <div key={f.id} className="flex gap-2 items-start avoid-break">
                      <RowIcon />
                      <div className="flex flex-col">
                        <span
                          className="text-[10px] tracking-[0.08em] uppercase"
                          style={{ color: palette.label }}
                        >
                          {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                        </span>
                        <span className="text-[14.5px]" style={{ color: palette.ink }}>
                          {f.value?.trim() ? f.value : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div key={section.id} className="avoid-break">
                <div className="flex items-baseline gap-3 mb-3">
                  <span
                    className="text-[24px] font-light leading-none"
                    style={{ color: glow.violet, fontFamily: heading }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2
                    className="text-[17px] font-semibold tracking-wide"
                    style={{ fontFamily: heading, color: palette.ink }}
                  >
                    {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  </h2>
                  <span className="flex-1 h-px ml-2" style={{ backgroundColor: palette.line }} />
                </div>
                <p className="pl-9 text-[14.5px] leading-relaxed" style={{ color: palette.sub }}>
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

FuturisticTemplate.displayName = "FuturisticTemplate";
export default FuturisticTemplate;