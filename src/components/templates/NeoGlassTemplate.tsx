import { forwardRef } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  bg: "#f7f4ee",
  panel: "#ffffff",
  ink: "#211d1a",
  sub: "#6f675c",
  line: "#d9cfbd",
  label: "#a3987f",
};

const deco = {
  black: "#1c1a17",
  gold: "#af8a3f",
  goldDeep: "#8c6a28",
};

// Fixed page geometry — do NOT rely on flex-1/percent sizing to lay out
// the page. html2canvas/jsPDF-style capture pipelines frequently fail to
// resolve flex-grow or 100% widths on cloned/offscreen nodes, which can
// collapse columns to 0 width and drop content from the exported PDF.
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;

// A stepped art-deco frame: a black rule, a gold rule set slightly in
// from it, and notched "staircase" corner blocks — classic 1920s
// border geometry instead of open HUD brackets or a floral sidebar.
// Built entirely from <rect>/<path>, no clip-path, no gradient text.
const DecoFrame = () => {
  const W = 794;
  const H = 1123;
  const outer = 26;
  const inner = 38;
  const step = 16;

  const cornerSteps = (x: number, y: number, dx: number, dy: number) => {
    const pts = [
      [x, y + dy * step * 3],
      [x, y + dy * step * 2],
      [x + dx * step, y + dy * step * 2],
      [x + dx * step, y + dy * step],
      [x + dx * step * 2, y + dy * step],
      [x + dx * step * 2, y],
      [x + dx * step * 3, y],
    ];
    return pts.map((p) => p.join(",")).join(" ");
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <rect x={outer} y={outer} width={W - outer * 2} height={H - outer * 2} fill="none" stroke={deco.black} strokeWidth="2" />
      <rect x={inner} y={inner} width={W - inner * 2} height={H - inner * 2} fill="none" stroke={deco.gold} strokeWidth="1" />

      {/* stepped corner ornaments */}
      {[
        { x: outer, y: outer, dx: 1, dy: 1 },
        { x: W - outer, y: outer, dx: -1, dy: 1 },
        { x: outer, y: H - outer, dx: 1, dy: -1 },
        { x: W - outer, y: H - outer, dx: -1, dy: -1 },
      ].map(({ x, y, dx, dy }, i) => (
        <polyline
          key={i}
          points={cornerSteps(x, y, dx, dy)}
          fill="none"
          stroke={deco.gold}
          strokeWidth="1.5"
        />
      ))}

      {/* small sunburst / fan motif centered on the top rule */}
      <g transform={`translate(${W / 2}, ${outer})`}>
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = -90 + (i - 3) * 12;
          const rad = (angle * Math.PI) / 180;
          const len = 14;
          return (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={Math.cos(rad) * len}
              y2={Math.sin(rad) * len}
              stroke={deco.gold}
              strokeWidth="1.25"
            />
          );
        })}
        <circle cx="0" cy="0" r="3" fill={deco.black} />
      </g>
    </svg>
  );
};

// Circular portrait framed by two concentric rings and four short tick
// marks — border-radius based mask only, no CSS clip-path.
const MedallionPortrait = ({ photoSrc, placeholder }: { photoSrc?: string; placeholder: string }) => (
  <div className="relative w-[140px] h-[140px] shrink-0">
    <svg className="absolute -inset-4 pointer-events-none" viewBox="0 0 204 204" fill="none">
      <circle cx="102" cy="102" r="100" stroke={deco.gold} strokeWidth="1" />
      <circle cx="102" cy="102" r="92" stroke={deco.black} strokeWidth="1.5" />
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1="102"
          y1="2"
          x2="102"
          y2="14"
          stroke={deco.gold}
          strokeWidth="1.5"
          transform={`rotate(${deg} 102 102)`}
        />
      ))}
    </svg>
    <div
      className="relative w-full h-full rounded-full overflow-hidden"
      style={{ backgroundColor: palette.panel, border: `1px solid ${palette.line}` }}
    >
      {photoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoSrc} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[10.5px]" style={{ color: palette.sub }}>
          {placeholder}
        </div>
      )}
    </div>
  </div>
);

const SectionHeading = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="w-2 h-2 rotate-45 shrink-0" style={{ backgroundColor: deco.gold }} />
    <h2
      className="text-[15px] font-semibold tracking-[0.18em] uppercase"
      style={{ color: deco.black }}
    >
      {label}
    </h2>
    <span className="flex-1 h-px" style={{ backgroundColor: palette.line }} />
    <span className="w-2 h-2 rotate-45 shrink-0" style={{ backgroundColor: deco.gold }} />
  </div>
);

const RowMark = () => (
  <span className="shrink-0 mt-[7px] w-[5px] h-[5px] rotate-45" style={{ backgroundColor: deco.goldDeep }} />
);

const ArtDecoFrameTemplate = forwardRef<
HTMLDivElement,
  { doc: BiodataDocument; fonts: FontPack }
>(({ doc, fonts }, ref) => {
  const lang = doc.language;
  const L = (en: string, hi: string) => (lang === "hi" ? hi : en);
  const heading = fonts.heading || "'Playfair Display', 'Noto Serif Devanagari', serif";
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
      {/* Solid background layer kept separate from the root's inline
          style, since the shared .a4-page class forces a background
          with !important that would otherwise beat it during export. */}
      <div className="absolute inset-0" style={{ backgroundColor: palette.bg }} />
      <DecoFrame />

      {/* Header */}
      <div className="relative px-16 pt-16 pb-8 flex flex-col items-center text-center avoid-break">
        <MedallionPortrait photoSrc={doc.photo} placeholder={L("Photo", "फोटो")} />

        {doc.invocation.enabled && (
          <p className="mt-6 text-[10.5px] tracking-[0.3em] uppercase" style={{ color: deco.goldDeep }}>
            {doc.invocation.text}
          </p>
        )}

        <h1
          className="mt-3 text-[32px] leading-tight font-semibold tracking-wide"
          style={{ fontFamily: heading, color: deco.black }}
        >
          {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
        </h1>

        <div className="mt-3 flex items-center gap-3">
          <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: deco.gold }} />
          <p className="text-[10.5px] tracking-[0.4em] uppercase" style={{ color: palette.sub }}>
            {L("Biodata", "बायोडाटा")}
          </p>
          <span className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: deco.gold }} />
        </div>

        {aboutSection && (
          <p className="mt-5 max-w-[480px] text-[13px] leading-relaxed" style={{ color: palette.sub }}>
            {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
          </p>
        )}
      </div>

      {/* Sections */}
      <div className="relative px-16 pb-16 space-y-7">
        {otherSections.map((section) =>
          section.type === "grid" ? (
            <div key={section.id} className="avoid-break">
              <SectionHeading label={lang === "hi" ? section.titleHi || section.titleEn : section.titleEn} />
              <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                {section.fields.map((f) => (
                  <div key={f.id} className="flex gap-2.5 items-start avoid-break">
                    <RowMark />
                    <div className="flex flex-col">
                      <span className="text-[10px] tracking-[0.1em] uppercase" style={{ color: palette.label }}>
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
              <SectionHeading label={lang === "hi" ? section.titleHi || section.titleEn : section.titleEn} />
              <p className="text-[14.5px] leading-relaxed" style={{ color: palette.sub }}>
                {(lang === "hi" && section.fields[0]?.valueHi) || section.fields[0]?.value || "—"}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
});

ArtDecoFrameTemplate.displayName = "ArtDecoFrameTemplate";
export default ArtDecoFrameTemplate;