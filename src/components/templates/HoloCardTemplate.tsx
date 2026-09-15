import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  bg: "#0c0a14",
  panel: "#141220",
  ink: "#f1eefb",
  sub: "#9089ad",
  line: "#262238",
  label: "#9089AD",
};

const holo = {
  pink: "#ff5fae",
  violet: "#8b5cf6",
  cyan: "#4fd8ff",
  gold: "#ffcf6b",
};

// Fixed page geometry — do NOT rely on flex-1/percent sizing to lay out
// the page. html2canvas/jsPDF-style capture pipelines frequently fail to
// resolve flex-grow or 100% widths on cloned/offscreen nodes, which can
// collapse columns to 0 width and drop content from the exported PDF.
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const HEADER_HEIGHT_MM = 76;

// Single-page guarantee: the page is a hard-clipped A4 box, and everything
// inside it lives in a wrapper that is scaled down until it fits. Scaling
// rather than truncating keeps every section in the export no matter how
// many fields the user adds.
const MIN_FIT_SCALE = 0.55;

// Diagonal holographic band across the top — the sheen gradient sweeps
// corner to corner like a foil ID card, cut with a single angled edge
// instead of a straight horizontal split.
const HoloBand = () => {
  const W = 794;
  const H = 348;
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="holoSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={holo.violet} stopOpacity="0.9" />
          <stop offset="35%" stopColor={holo.pink} stopOpacity="0.85" />
          <stop offset="65%" stopColor={holo.cyan} stopOpacity="0.8" />
          <stop offset="100%" stopColor={holo.gold} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="holoFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.bg} stopOpacity="0" />
          <stop offset="100%" stopColor={palette.bg} stopOpacity="1" />
        </linearGradient>
        <pattern id="holoLines" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={palette.bg} />
      <polygon points={`0,0 ${W},0 ${W},${H * 0.62} 0,${H}`} fill="url(#holoSheen)" opacity="0.16" />
      <polygon points={`0,0 ${W},0 ${W},${H * 0.62} 0,${H}`} fill="url(#holoLines)" />
      <line x1="0" y1={H} x2={W} y2={H * 0.62} stroke="url(#holoSheen)" strokeWidth="2.5" />
      <rect width={W} height={H} fill="url(#holoFade)" opacity="0.35" />
    </svg>
  );
};

const CHIP_W = 110;
const CHIP_H = 138;
const FRAME_PAD = 6;
const FRAME_W = CHIP_W + FRAME_PAD * 2;
const FRAME_H = CHIP_H + FRAME_PAD * 2;

const ChipPortrait = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: "relative",
      width: CHIP_W,
      height: CHIP_H,
      flexShrink: 0,
      boxSizing: "border-box",
    }}
  >
    {/* Frame: positioned in px from the SAME box the photo uses, no nested "relative" ancestors between them */}
    <svg
      width={FRAME_W}
      height={FRAME_H}
      style={{
        position: "absolute",
        top: -FRAME_PAD,
        left: -FRAME_PAD,
        pointerEvents: "none",
        overflow: "visible",
      }}
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      fill="none"
    >
      <defs>
        <linearGradient id="chipStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={holo.cyan} />
          <stop offset="100%" stopColor={holo.pink} />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width={FRAME_W - 2} height={FRAME_H - 2} rx="10" stroke="url(#chipStroke)" strokeWidth="1.5" />
      <path d={`M1,20 L1,1 L20,1`} fill="none" stroke={holo.gold} strokeWidth="2" />
      <path d={`M${FRAME_W - 20},1 L${FRAME_W - 1},1 L${FRAME_W - 1},20`} fill="none" stroke={holo.gold} strokeWidth="2" />
      <path
        d={`M${FRAME_W - 1},${FRAME_H - 20} L${FRAME_W - 1},${FRAME_H - 1} L${FRAME_W - 20},${FRAME_H - 1}`}
        fill="none"
        stroke={holo.gold}
        strokeWidth="2"
      />
      <path d={`M20,${FRAME_H - 1} L1,${FRAME_H - 1} L1,${FRAME_H - 20}`} fill="none" stroke={holo.gold} strokeWidth="2" />
    </svg>

    {/* Photo: sibling of the frame, not nested inside another positioned wrapper */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: CHIP_W,
        height: CHIP_H,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: palette.panel,
        border: `1px solid ${palette.line}`,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  </div>
);

const LaserDivider = ({ label, font }: { label: string; font: string }) => (
  <div className="flex items-center gap-3">
    <div
      className="text-[9.5px] px-2 h-[18px] flex items-center justify-center rounded-full tracking-[0.15em] uppercase shrink-0"
      style={{
        color: holo.cyan,
        border: `1px solid ${holo.cyan}55`,
        backgroundColor: `${holo.cyan}0f`,
        fontFamily: font,
      }}
    >
      {label}
    </div>
    <div
      className="flex-1 h-px"
      style={{ background: `linear-gradient(90deg, ${holo.cyan}66, ${palette.line} 40%)` }}
    />
  </div>
);

const RowMark = () => (
  <svg width="7" height="7" viewBox="0 0 7 7" className="shrink-0 mt-[5px]">
    <path d="M3.5,0 L7,3.5 L3.5,7 L0,3.5 Z" fill="none" stroke={holo.pink} strokeWidth="1.1" />
  </svg>
);

const HoloCardTemplate = forwardRef<
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

  // Measure natural (unscaled) content height against the printable area
  // and shrink to fit. Re-measuring at scale 1 on every pass keeps the
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
    // Re-fit once webfonts finish loading — font swap changes text metrics
    // and is the usual reason a page that "fit" in preview spills onto a
    // second page in the exported PDF.
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
          the page to white during PDF export. The HoloBand SVG below
          only paints its own header-height area, so this full-page
          layer is still needed to cover everything beneath it. */}
      <div className="absolute inset-0" style={{ backgroundColor: palette.bg }} />

      <div ref={frameRef} className="relative w-full h-full overflow-hidden">
        <div
          ref={contentRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            // Widen the wrapper as it shrinks so the layout still fills the
            // page edge to edge instead of leaving a right-hand gutter.
            width: `${100 / scale}%`,
          }}
        >
          {/* Holographic header band */}
          <div className="relative overflow-hidden" style={{ height: `${HEADER_HEIGHT_MM}mm` }}>
            <HoloBand />

            <div className="relative h-full px-12 flex items-center">
              <ChipPortrait>
                {doc.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={doc.photo}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center center",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-[10px]"
                    style={{ color: palette.sub }}
                  >
                    {L("Photo", "फोटो")}
                  </div>
                )}
              </ChipPortrait>

              <div className="flex-1 min-w-0" style={{ marginLeft: 28 }}>
                {doc.invocation.enabled && (
                  <p className="text-[9.5px] tracking-[0.3em] uppercase mb-[6px]" style={{ color: holo.gold }}>
                    {doc.invocation.text}
                  </p>
                )}
                <h1
                  className="text-[28px] leading-tight font-bold truncate"
                  style={{ fontFamily: heading, color: palette.ink }}
                >
                  {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
                </h1>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase px-3 py-[3px] rounded-full"
                    style={{
                      color: palette.ink,
                      border: `1px solid ${palette.line}`,
                      backgroundColor: "#ffffff0d",
                    }}
                  >
                    {L("Biodata", "बायोडाटा")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {aboutSection && (
            <div className="relative px-12 pt-5 pb-1">
              <div
                className="px-4 py-3 text-[11.5px] leading-snug rounded-[8px]"
                style={{
                  backgroundColor: palette.panel,
                  border: `1px solid ${palette.line}`,
                  color: palette.sub,
                }}
              >
                {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
              </div>
            </div>
          )}

          {/* Sections */}
          <div className="relative px-12 pt-5 pb-10 space-y-4">
            {otherSections.map((section, idx) =>
              section.type === "grid" ? (
                <div key={section.id}>
                  <div className="mb-[10px]">
                    <LaserDivider
                      font={heading}
                      label={`${String(idx + 1).padStart(2, "0")} · ${
                        lang === "hi" ? section.titleHi || section.titleEn : section.titleEn
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-[6px] pl-1">
                    {section.fields.map((f) => (
                      <div key={f.id} className="flex gap-2 items-start">
                        <RowMark />
                        <div className="flex flex-col min-w-0">
                          <span
                            className="text-[8.5px] block tracking-[0.08em] uppercase"
                            style={{ color: palette.label }}
                          >
                            {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                          </span>
                          <span className="text-[12.5px] leading-snug break-words" style={{ color: palette.ink }}>
                            {f.value?.trim() ? f.value : "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={section.id}>
                  <div className="mb-[8px]">
                    <LaserDivider
                      font={heading}
                      label={`${String(idx + 1).padStart(2, "0")} · ${
                        lang === "hi" ? section.titleHi || section.titleEn : section.titleEn
                      }`}
                    />
                  </div>
                  <p className="pl-1 text-[12.5px] leading-snug" style={{ color: palette.sub }}>
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

HoloCardTemplate.displayName = "HoloCardTemplate";
export default HoloCardTemplate;