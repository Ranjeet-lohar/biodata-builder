import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  bg: "#070a10",
  panel: "#0e131b",
  ink: "#e4f3ff",
  sub: "#7f8fa8",
  line: "#1c2430",
  lineSoft: "#141b26",
  label: "#4d5972",
};

const glow = {
  green: "#39ffb0",
  cyan: "#38d6ff",
  amber: "#ffb84d",
};

// Fixed page geometry — do NOT rely on flex-1/percent sizing to lay out
// the page. html2canvas/jsPDF-style capture pipelines frequently fail to
// resolve flex-grow or 100% widths on cloned/offscreen nodes, which can
// collapse columns to 0 width and drop content from the exported PDF.
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;

// Single-page guarantee: the page is a hard-clipped A4 box and everything
// inside it lives in a wrapper that is scaled down until it fits. Scaling
// (rather than truncating) keeps every section in the export no matter how
// many fields the user adds.
const MIN_FIT_SCALE = 0.55; // below this the text stops being legible

const HexGridBackdrop = () => {
  const W = 794;
  const H = 1123;
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="hexGrid" width="44" height="76" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
          <polygon
            points="22,2 40,13 40,35 22,46 4,35 4,13"
            fill="none"
            stroke={glow.cyan}
            strokeOpacity="0.06"
            strokeWidth="1"
          />
          <polygon
            points="22,40 40,51 40,73 22,84 4,73 4,51"
            fill="none"
            stroke={glow.cyan}
            strokeOpacity="0.06"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id="vignette" cx="0.5" cy="0.35" r="0.75">
          <stop offset="0%" stopColor={palette.bg} stopOpacity="0" />
          <stop offset="100%" stopColor={palette.bg} stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#hexGrid)" />
      <rect width={W} height={H} fill="url(#vignette)" />
    </svg>
  );
};

const StatusBar = ({ code }: { code: string }) => (
  <div
    className="relative flex items-center gap-3 px-10 py-[6px]"
    style={{ borderBottom: `1px solid ${palette.line}` }}
  >
    <svg width="11" height="11" viewBox="0 0 12 12">
      <circle cx="6" cy="6" r="5" fill="none" stroke={glow.green} strokeWidth="1" />
      <line x1="6" y1="0" x2="6" y2="12" stroke={glow.green} strokeWidth="0.75" />
      <line x1="0" y1="6" x2="12" y2="6" stroke={glow.green} strokeWidth="0.75" />
    </svg>
    <span className="text-[8.5px] tracking-[0.2em] uppercase" style={{ color: palette.sub, fontFamily: "monospace" }}>
      {code}
    </span>
    <span className="flex-1 h-px" style={{ backgroundColor: palette.lineSoft }} />
    <span className="text-[8.5px] tracking-[0.2em] uppercase" style={{ color: glow.green, fontFamily: "monospace" }}>
      ● ACTIVE
    </span>
  </div>
);

const RadarPortrait = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-[126px] h-[126px] shrink-0">
    <svg className="absolute -inset-3 pointer-events-none" viewBox="0 0 216 216" fill="none">
      <circle cx="108" cy="108" r="106" stroke={palette.line} strokeWidth="1" />
      <circle cx="108" cy="108" r="106" stroke={glow.cyan} strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 6" />
      <circle cx="108" cy="108" r="90" stroke={palette.lineSoft} strokeWidth="1" />
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1="108"
          y1="2"
          x2="108"
          y2="14"
          stroke={glow.cyan}
          strokeWidth="1.5"
          transform={`rotate(${deg} 108 108)`}
        />
      ))}
    </svg>
    <div
      className="relative w-full h-full rounded-full overflow-hidden"
      style={{ backgroundColor: palette.panel, border: `1px solid ${palette.line}` }}
    >
      {children}
    </div>
  </div>
);

const SectionTag = ({ index, label, font }: { index: number; label: string; font: string }) => (
  <div className="flex items-center gap-2 mb-[6px]">
    <span
      className="text-[9px] leading-3 px-[6px] py-[2px] block rounded-[3px] tracking-[0.15em]"
      style={{
        fontFamily: "monospace",
        color: glow.green,
        border: `1px solid ${glow.green}55`,
        backgroundColor: `${glow.green}0d`,
      }}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
    <h2
      className="text-[13.5px] leading-4 font-semibold tracking-wide"
      style={{ color: palette.ink, fontFamily: font }}
    >
      {label}
    </h2>
    <span className="flex-1 h-px ml-1" style={{ backgroundColor: palette.line }} />
  </div>
);

const RowMark = () => (
  <span
    className="shrink-0 mt-[5px] w-[5px] h-[5px]"
    style={{ backgroundColor: "transparent", border: `1px solid ${glow.cyan}`, transform: "rotate(45deg)" }}
  />
);

const QuantumGridTemplate = forwardRef<
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

  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Measure the natural (unscaled) content height against the printable
  // area and shrink to fit. Measuring at scale 1 every pass keeps the
  // result stable instead of compounding previous scales.
  const fit = useCallback(() => {
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!frame || !content) return;

    content.style.transform = "scale(1)";
    const natural = content.scrollHeight;
    const available = frame.clientHeight;
    if (!natural || !available) return;

    const next = natural <= available ? 1 : Math.max(MIN_FIT_SCALE, available / natural);
    content.style.transform = `scale(${next})`;
    setScale(next);
  }, []);

  useLayoutEffect(() => {
    fit();
  });

  useEffect(() => {
    // Re-fit once webfonts finish loading — font swap changes metrics and
    // is the usual cause of a "fit" page spilling onto page 2 in the PDF.
    if (typeof document !== "undefined" && "fonts" in document) {
      (document as Document & { fonts: FontFaceSet }).fonts.ready.then(fit).catch(() => {});
    }
    const ro = new ResizeObserver(fit);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [fit]);

  return (
    <div
      ref={ref}
      className="relative a4-page overflow-hidden"
      style={{
        width: `${PAGE_WIDTH_MM}mm`,
        // Hard height (not minHeight) so the capture pipeline can never
        // grow the canvas past one page.
        height: `${PAGE_HEIGHT_MM}mm`,
        maxHeight: `${PAGE_HEIGHT_MM}mm`,
        backgroundColor: palette.bg,
        color: palette.ink,
        fontFamily: body,
        boxSizing: "border-box",
        pageBreakAfter: "avoid",
        breakAfter: "avoid",
      }}
    >
      {/* Solid background layer — kept as its own child rather than
          relying on the root's inline backgroundColor. The shared
          .a4-page class (used by the light/paper templates) forces a
          white background with !important for print/paper styling,
          which otherwise beats this element's inline style and washes
          the page to white during PDF export. */}
      <div className="absolute inset-0" style={{ backgroundColor: palette.bg }} />
      <HexGridBackdrop />

      <div ref={frameRef} className="relative w-full h-full overflow-hidden">
        <div
          ref={contentRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            // Widen the wrapper as it shrinks so the layout still fills
            // the page edge-to-edge instead of leaving a right gutter.
            width: `${100 / scale}%`,
          }}
        >
          <StatusBar code={L("REC / MATRIMONIAL PROFILE", "रिकॉर्ड / वैवाहिक प्रोफ़ाइल")} />

          {/* Header */}
          <div className="relative px-10 pt-6 pb-5 flex items-center gap-6">
            <RadarPortrait>
              {doc.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-[10px]"
                  style={{ color: palette.sub }}
                >
                  {L("Photo", "फोटो")}
                </div>
              )}
            </RadarPortrait>

            <div className="flex-1 min-w-0">
              {doc.invocation.enabled && (
                <p
                  className="text-[9.5px] tracking-[0.3em] uppercase mb-[6px]"
                  style={{ color: glow.amber, fontFamily: "monospace" }}
                >
                  {doc.invocation.text}
                </p>
              )}
              <h1
                className="text-[27px] leading-tight font-bold truncate"
                style={{ fontFamily: heading, color: palette.ink }}
              >
                {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
              </h1>
              <div className="mt-[6px] flex items-center gap-2">
                <span className="h-[2px] w-9" style={{ backgroundColor: glow.green }} />
                <p
                  className="text-[9.5px] tracking-[0.25em] uppercase"
                  style={{ color: palette.sub, fontFamily: "monospace" }}
                >
                  {L("Biodata File", "बायोडाटा फ़ाइल")}
                </p>
              </div>
            </div>
          </div>

          {aboutSection && (
            <div className="relative px-10 pb-5">
              <div
                className="px-4 py-3 text-[11.5px] leading-snug rounded-[6px]"
                style={{
                  backgroundColor: palette.panel,
                  border: `1px solid ${palette.line}`,
                  color: palette.sub,
                }}
              >
                <span
                  className="block text-[8.5px] tracking-[0.2em] uppercase mb-[6px]"
                  style={{ color: glow.cyan, fontFamily: "monospace" }}
                >
                  {L("// SUMMARY", "// सारांश")}
                </span>
                {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
              </div>
            </div>
          )}

          {/* Sections */}
          <div className="relative px-10 pb-8 space-y-4">
            {otherSections.map((section, idx) =>
              section.type === "grid" ? (
                <div key={section.id}>
                  <SectionTag
                    index={idx}
                    font={heading}
                    label={lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  />
                  <div
                    className="grid grid-cols-2 gap-x-6 gap-y-[6px] pl-2 py-3 pr-4 rounded-[6px]"
                    style={{ backgroundColor: palette.panel, border: `1px solid ${palette.line}` }}
                  >
                    {section.fields.map((f) => (
                      <div key={f.id} className="flex gap-2 items-start pl-3">
                        <RowMark />
                        <div className="flex flex-col min-w-0">
                          <span
                            className="text-[8.5px] tracking-[0.08em] uppercase"
                            style={{ color: palette.label, fontFamily: "monospace" }}
                          >
                            {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                          </span>
                          <span className="text-[12px] leading-snug break-words" style={{ color: palette.ink }}>
                            {f.value?.trim() ? f.value : "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={section.id}>
                  <SectionTag
                    index={idx}
                    font={heading}
                    label={lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  />
                  <p className="pl-2 text-[12px] leading-snug" style={{ color: palette.sub }}>
                    {(lang === "hi" && section.fields[0]?.valueHi) || section.fields[0]?.value || "—"}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

QuantumGridTemplate.displayName = "QuantumGridTemplate";
export default QuantumGridTemplate;