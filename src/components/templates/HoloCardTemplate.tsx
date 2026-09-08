import { forwardRef } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  bg: "#0c0a14",
  panel: "#141220",
  ink: "#f1eefb",
  sub: "#9089ad",
  line: "#262238",
  label: "#5a5378",
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
const HEADER_HEIGHT_MM = 92;

// Diagonal holographic band across the top — the sheen gradient sweeps
// corner to corner like a foil ID card, cut with a single angled edge
// instead of a straight horizontal split.
const HoloBand = () => {
  const W = 794;
  const H = 348; // ~92mm at 96dpi/mm≈3.78 -> kept generous, clipped by parent
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
      <line
        x1="0"
        y1={H}
        x2={W}
        y2={H * 0.62}
        stroke="url(#holoSheen)"
        strokeWidth="2.5"
      />
      <rect width={W} height={H} fill="url(#holoFade)" opacity="0.35" />
    </svg>
  );
};

const ChipPortrait = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-[128px] h-[160px] shrink-0">
    <svg className="absolute -inset-[6px] pointer-events-none" viewBox="0 0 140 172" fill="none">
      <rect
        x="1"
        y="1"
        width="138"
        height="170"
        rx="10"
        stroke="url(#chipStroke)"
        strokeWidth="1.5"
      />
      <defs>
        <linearGradient id="chipStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={holo.cyan} />
          <stop offset="100%" stopColor={holo.pink} />
        </linearGradient>
      </defs>
      {/* corner ticks like an ID-card capture frame */}
      <path d="M1,20 L1,1 L20,1" fill="none" stroke={holo.gold} strokeWidth="2" />
      <path d="M120,1 L139,1 L139,20" fill="none" stroke={holo.gold} strokeWidth="2" />
      <path d="M139,152 L139,171 L120,171" fill="none" stroke={holo.gold} strokeWidth="2" />
      <path d="M20,171 L1,171 L1,152" fill="none" stroke={holo.gold} strokeWidth="2" />
    </svg>
    <div
      className="relative w-full h-full rounded-[8px] overflow-hidden"
      style={{ backgroundColor: palette.panel, border: `1px solid ${palette.line}` }}
    >
      {children}
    </div>
  </div>
);

const LaserDivider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3">
    <span
      className="text-[10px] px-2 py-[3px] rounded-full tracking-[0.15em] uppercase shrink-0"
      style={{
        color: holo.cyan,
        border: `1px solid ${holo.cyan}55`,
        backgroundColor: `${holo.cyan}0f`,
      }}
    >
      {label}
    </span>
    <span
      className="flex-1 h-px"
      style={{
        background: `linear-gradient(90deg, ${holo.cyan}66, ${palette.line} 40%)`,
      }}
    />
  </div>
);

const RowMark = () => (
  <svg width="7" height="7" viewBox="0 0 7 7" className="shrink-0 mt-[7px]">
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
          the page to white during PDF export. The HoloBand SVG below
          only paints its own header-height area, so this full-page
          layer is still needed to cover everything beneath it. */}
      <div className="absolute inset-0" style={{ backgroundColor: palette.bg }} />

      {/* Holographic header band */}
      <div
        className="relative overflow-hidden"
        style={{ height: `${HEADER_HEIGHT_MM}mm` }}
      >
        <HoloBand />

        <div className="relative h-full px-14 flex items-center gap-8 avoid-break">
          <ChipPortrait>
            {doc.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-[10.5px]"
                style={{ color: palette.sub }}
              >
                {L("Photo", "फोटो")}
              </div>
            )}
          </ChipPortrait>

          <div className="flex-1 min-w-0">
            {doc.invocation.enabled && (
              <p
                className="text-[10px] tracking-[0.3em] uppercase mb-2"
                style={{ color: holo.gold }}
              >
                {doc.invocation.text}
              </p>
            )}
            <h1
              className="text-[33px] leading-tight font-bold truncate"
              style={{ fontFamily: heading, color: palette.ink }}
            >
              {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
            </h1>
            <div className="mt-3 flex items-center gap-2">
              <span
                className="text-[10.5px] tracking-[0.3em] uppercase px-3 py-1 rounded-full"
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
        <div className="relative px-14 pt-8 pb-2 avoid-break">
          <div
            className="px-5 py-4 text-[13px] leading-relaxed rounded-[8px]"
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
      <div className="relative px-14 pt-8 pb-14 space-y-7">
        {otherSections.map((section, idx) =>
          section.type === "grid" ? (
            <div key={section.id} className="avoid-break">
              <div className="mb-4">
                <LaserDivider
                  label={`${String(idx + 1).padStart(2, "0")} · ${
                    lang === "hi" ? section.titleHi || section.titleEn : section.titleEn
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 pl-1">
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
              <div className="mb-3">
                <LaserDivider
                  label={`${String(idx + 1).padStart(2, "0")} · ${
                    lang === "hi" ? section.titleHi || section.titleEn : section.titleEn
                  }`}
                />
              </div>
              <p className="pl-1 text-[14.5px] leading-relaxed" style={{ color: palette.sub }}>
                {(lang === "hi" && section.fields[0]?.valueHi) || section.fields[0]?.value || "—"}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
});

HoloCardTemplate.displayName = "HoloCardTemplate";
export default HoloCardTemplate;