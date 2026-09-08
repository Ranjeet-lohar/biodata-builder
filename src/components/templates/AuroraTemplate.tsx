import { forwardRef } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  bg: "#080b14",
  panel: "#0f1420",
  ink: "#eef2fb",
  sub: "#8a93ab",
  line: "#1c2333",
  label: "#565f78",
};

const aurora = {
  teal: "#2ee6c6",
  blue: "#4f8bff",
  violet: "#9b6bff",
};

// Fixed page geometry — do NOT rely on flex-1/percent sizing to lay out
// the page. html2canvas/jsPDF-style capture pipelines frequently fail to
// resolve flex-grow or 100% widths on cloned/offscreen nodes, which can
// collapse columns to 0 width and drop content from the exported PDF.
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;

// Soft flowing aurora-borealis bands across the upper portion of the
// page — organic curves instead of hard geometric frames/grids, kept
// very low-opacity so text stays fully legible over it.
const AuroraBackdrop = () => {
  const W = 794;
  const H = 1123;
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="auroraTeal" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor={aurora.teal} stopOpacity="0" />
          <stop offset="45%" stopColor={aurora.teal} stopOpacity="0.28" />
          <stop offset="100%" stopColor={aurora.teal} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="auroraBlue" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor={aurora.blue} stopOpacity="0" />
          <stop offset="50%" stopColor={aurora.blue} stopOpacity="0.24" />
          <stop offset="100%" stopColor={aurora.blue} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="auroraViolet" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor={aurora.violet} stopOpacity="0" />
          <stop offset="55%" stopColor={aurora.violet} stopOpacity="0.22" />
          <stop offset="100%" stopColor={aurora.violet} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="auroraFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.bg} stopOpacity="0" />
          <stop offset="100%" stopColor={palette.bg} stopOpacity="1" />
        </linearGradient>
      </defs>

      <path
        d="M -50,180 C 150,60 300,260 500,140 C 620,70 700,150 850,60 L 850,0 L -50,0 Z"
        fill="url(#auroraTeal)"
      />
      <path
        d="M -50,260 C 180,120 340,320 540,200 C 660,130 720,220 850,140 L 850,0 L -50,0 Z"
        fill="url(#auroraBlue)"
      />
      <path
        d="M -50,340 C 200,180 360,380 560,260 C 680,190 740,280 850,210 L 850,0 L -50,0 Z"
        fill="url(#auroraViolet)"
      />

      {/* faint star flecks scattered through the aurora zone */}
      {[
        [60, 90], [140, 200], [230, 60], [320, 160], [410, 90], [480, 220],
        [560, 70], [640, 180], [710, 110], [90, 260], [380, 40], [630, 40],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.6 : 1} fill="#ffffff" fillOpacity="0.5" />
      ))}

      <rect width={W} height={H} fill="url(#auroraFade)" opacity="0.55" />
    </svg>
  );
};

const GlowPortrait = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-[150px] h-[150px] shrink-0">
    <svg className="absolute -inset-3 pointer-events-none" viewBox="0 0 180 180" fill="none">
      <defs>
        <linearGradient id="glowRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={aurora.teal} />
          <stop offset="50%" stopColor={aurora.blue} />
          <stop offset="100%" stopColor={aurora.violet} />
        </linearGradient>
      </defs>
      <circle cx="90" cy="90" r="87" fill="none" stroke="url(#glowRing)" strokeWidth="1.5" strokeOpacity="0.8" />
      <circle cx="90" cy="90" r="87" fill="none" stroke="url(#glowRing)" strokeWidth="6" strokeOpacity="0.08" />
    </svg>
    <div
      className="relative w-full h-full rounded-full overflow-hidden"
      style={{ backgroundColor: palette.panel, border: `1px solid ${palette.line}` }}
    >
      {children}
    </div>
  </div>
);

const SectionHeading = ({ index, label }: { index: number; label: string }) => (
  <div className="flex items-center gap-3 mb-4">
    {/* Plain solid color instead of a gradient-clipped-text effect —
        background-clip: text is unreliable in html2canvas/jsPDF-style
        export pipelines: the clip mask often doesn't apply, so the
        gradient paints as a solid block instead of showing through
        the numeral (that's the empty colored square in the exported
        PDF). A flat color renders correctly in every export path. */}
    <span className="text-[22px] font-light leading-none" style={{ color: aurora.teal }}>
      {String(index + 1).padStart(2, "0")}
    </span>
    <h2 className="text-[16.5px] font-semibold tracking-wide" style={{ color: palette.ink }}>
      {label}
    </h2>
    <span className="flex-1 h-px ml-1" style={{ backgroundColor: palette.line }} />
  </div>
);

const RowMark = () => (
  <span
    className="shrink-0 mt-[7px] block w-[6px] h-[6px] rounded-full"
    style={{ background: `linear-gradient(135deg, ${aurora.teal}, ${aurora.violet})` }}
  />
);

const AuroraTemplate = forwardRef<
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
      {/* Solid background layer — kept as its own child (not relying on
          the root's inline backgroundColor) because the shared .a4-page
          class used by the light/paper templates forces a white
          background with !important for print/paper styling, which
          otherwise beats this element's inline style and washes the
          whole page out to white behind the aurora gradients during
          PDF export. */}
      <div className="absolute inset-0" style={{ backgroundColor: palette.bg }} />
      <AuroraBackdrop />

      {/* Header */}
      <div className="relative px-14 pt-16 pb-8 flex flex-col items-center text-center avoid-break">
        <GlowPortrait>
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
        </GlowPortrait>

        {doc.invocation.enabled && (
          <p
            className="mt-6 text-[10px] tracking-[0.3em] uppercase"
            style={{ color: aurora.teal }}
          >
            {doc.invocation.text}
          </p>
        )}

        <h1
          className="mt-3 text-[32px] leading-tight font-semibold"
          style={{ fontFamily: heading, color: palette.ink }}
        >
          {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
        </h1>

        <div className="mt-3 flex items-center gap-3">
          <span className="h-px w-8" style={{ background: `linear-gradient(90deg, transparent, ${aurora.blue})` }} />
          <p
            className="text-[10.5px] tracking-[0.35em] uppercase"
            style={{ color: palette.sub }}
          >
            {L("Biodata", "बायोडाटा")}
          </p>
          <span className="h-px w-8" style={{ background: `linear-gradient(90deg, ${aurora.violet}, transparent)` }} />
        </div>

        {aboutSection && (
          <p className="mt-5 max-w-[480px] text-[13px] leading-relaxed" style={{ color: palette.sub }}>
            {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
          </p>
        )}
      </div>

      {/* Sections */}
      <div className="relative px-14 pb-14 space-y-7">
        {otherSections.map((section, idx) =>
          section.type === "grid" ? (
            <div key={section.id} className="avoid-break">
              <SectionHeading
                index={idx}
                label={lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
              />
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
              <SectionHeading
                index={idx}
                label={lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
              />
              <p className="pl-9 text-[14px] leading-relaxed" style={{ color: palette.sub }}>
                {(lang === "hi" && section.fields[0]?.valueHi) || section.fields[0]?.value || "—"}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
});

AuroraTemplate.displayName = "AuroraTemplate";
export default AuroraTemplate;