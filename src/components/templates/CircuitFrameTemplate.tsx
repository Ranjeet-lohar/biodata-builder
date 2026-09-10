import { forwardRef } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  bg: "#0a0f0c",
  panel: "#101712",
  ink: "#eafaf0",
  sub: "#87a087",
  line: "#1e2a20",
  label: "#59705a",
};

const trace = {
  green: "#39ff9d",
  lime: "#c6ff5e",
  teal: "#2fe0c4",
};

function Elbow({
  x1,
  y1,
  x2,
  y2,
  x3,
  y3,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
}) {
  return (
    <>
      <path
        d={`M ${x1},${y1} L ${x2},${y2} L ${x3},${y3}`}
        fill="none"
        stroke={trace.green}
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      <circle cx={x2} cy={y2} r="3" fill={trace.green} fillOpacity="0.6" />
    </>
  );
}

// Fixed page geometry — do NOT rely on flex-1/percent sizing to lay out
// the page. html2canvas/jsPDF-style capture pipelines frequently fail to
// resolve flex-grow or 100% widths on cloned/offscreen nodes, which can
// collapse columns to 0 width and drop content from the exported PDF.
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;

// A continuous PCB-trace border running the full perimeter of the page:
// right-angled circuit paths, via-pads at each bend, and small chip
// blocks parked at the corners. This is the "frame" element — unlike
// FuturisticFrame's open HUD brackets, this one is a closed rectangular
// loop the whole page sits inside.
const CircuitFrame = () => {
  const W = 794;
  const H = 1123;
  const m = 30; // margin of the trace loop from the page edge

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="cfCornerGlow" cx="0" cy="0" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={trace.lime} stopOpacity="0.5" />
          <stop offset="100%" stopColor={trace.teal} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* main rectangular trace loop */}
      <rect x={m} y={m} width={W - m * 2} height={H - m * 2} fill="none" stroke={trace.green} strokeOpacity="0.35" strokeWidth="1.5" />
      <rect x={m + 8} y={m + 8} width={W - (m + 8) * 2} height={H - (m + 8) * 2} fill="none" stroke={palette.line} strokeWidth="1" />

      {/* branch traces peeling off the top edge */}
      <Elbow x1={140} y1={m} x2={140} y2={m - 14} x3={200} y3={m - 14} />
      <Elbow x1={W - 140} y1={m} x2={W - 140} y2={m - 14} x3={W - 200} y3={m - 14} />

      {/* branch traces peeling off the bottom edge */}
      <Elbow x1={180} y1={H - m} x2={180} y2={H - m + 14} x3={260} y3={H - m + 14} />
      <Elbow x1={W - 180} y1={H - m} x2={W - 180} y2={H - m + 14} x3={W - 260} y3={H - m + 14} />

      {/* via-pads scattered along the left and right rails */}
      {[220, 400, 580, 760, 940].map((y, i) => (
        <g key={i}>
          <circle cx={m} cy={y} r="3" fill={i % 2 === 0 ? trace.green : trace.teal} fillOpacity="0.55" />
          <circle cx={W - m} cy={y} r="3" fill={i % 2 === 0 ? trace.teal : trace.green} fillOpacity="0.55" />
        </g>
      ))}

      {/* corner chip blocks with glow */}
      {[
        { x: m - 4, y: m - 4 },
        { x: W - m - 26, y: m - 4 },
        { x: m - 4, y: H - m - 26 },
        { x: W - m - 26, y: H - m - 26 },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width="30" height="30" rx="4" fill="url(#cfCornerGlow)" opacity="0.5" />
          <rect x={c.x} y={c.y} width="30" height="30" rx="4" fill="none" stroke={trace.lime} strokeOpacity="0.6" strokeWidth="1" />
          {[6, 14, 22].map((o) => (
            <line key={o} x1={c.x} y1={c.y + o} x2={c.x - 5} y2={c.y + o} stroke={trace.lime} strokeOpacity="0.5" strokeWidth="1" />
          ))}
        </g>
      ))}
    </svg>
  );
};

const NodePortrait = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-[140px] h-[140px] shrink-0">
    <svg className="absolute -inset-3 pointer-events-none" viewBox="0 0 176 176" fill="none">
      <polygon
        points="88,4 168,88 88,172 8,88"
        fill="none"
        stroke={trace.green}
        strokeOpacity="0.5"
        strokeWidth="1.25"
      />
      <circle cx="88" cy="4" r="3" fill={trace.lime} />
      <circle cx="168" cy="88" r="3" fill={trace.teal} />
      <circle cx="88" cy="172" r="3" fill={trace.lime} />
      <circle cx="8" cy="88" r="3" fill={trace.teal} />
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
  <div className="flex items-baseline gap-3 mb-4">
    <span
      className="text-[10px] px-2 pt-1 h-6 rounded-[3px] flex items-center justify-center tracking-[0.15em]"
      style={{
        fontFamily: "monospace",
        color: trace.lime,
        border: `1px solid ${trace.lime}55`,
        backgroundColor: `${trace.lime}0d`,
      }}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
    <h2 className="text-[16.5px] font-semibold tracking-wide" style={{ color: palette.ink }}>
      {label}
    </h2>
    <span className="flex-1 h-px ml-1" style={{ backgroundColor: palette.line }} />
  </div>
);

const RowMark = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" className="shrink-0 ">
    <rect x="0.5" y="0.5" width="7" height="7" fill="none" stroke={trace.teal} strokeWidth="1" />
  </svg>
);

const CircuitFrameTemplate = forwardRef<
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
      <CircuitFrame />

      {/* Header */}
      <div className="relative px-16 pt-16 pb-8 flex items-center gap-7 avoid-break">
        <NodePortrait>
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
        </NodePortrait>

        <div className="flex-1 min-w-0">
          {doc.invocation.enabled && (
            <p
              className="text-[10px] tracking-[0.3em] uppercase mb-2"
              style={{ color: trace.lime, fontFamily: "monospace" }}
            >
              {doc.invocation.text}
            </p>
          )}
          <h1
            className="text-[31px] leading-normal font-bold truncate"
            style={{ fontFamily: heading, color: palette.ink }}
          >
            {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-[2px] w-10" style={{ backgroundColor: trace.green }} />
            <p
              className="text-[10.5px] tracking-[0.25em] uppercase"
              style={{ color: palette.sub, fontFamily: "monospace" }}
            >
              {L("Biodata", "बायोडाटा")}
            </p>
          </div>
        </div>
      </div>

      {aboutSection && (
        <div className="relative px-16 pb-8 avoid-break">
          <div
            className="px-5 py-4 text-[13px] leading-relaxed rounded-[6px]"
            style={{
              backgroundColor: palette.panel,
              border: `1px solid ${palette.line}`,
              borderLeft: `2px solid ${trace.teal}`,
              color: palette.sub,
            }}
          >
            {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="relative px-16 pb-16 space-y-7">
        {otherSections.map((section, idx) =>
          section.type === "grid" ? (
            <div key={section.id} className="avoid-break">
              <SectionHeading
                index={idx}
                label={lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
              />
              <div
                className="grid grid-cols-2 gap-x-8 gap-y-3 pl-9 py-4 pr-5 rounded-[6px]"
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

CircuitFrameTemplate.displayName = "CircuitFrameTemplate";
export default CircuitFrameTemplate;