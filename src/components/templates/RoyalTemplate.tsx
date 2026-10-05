import { forwardRef, useId } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  bg: "#fbf8f2",
  paper: "#fffdf9",
  ink: "#26241f",
  muted: "#918b81",
  line: "#ddd7cc",
  accent: "#7b6650",
  rose: "#a87578",
  gold: "#b3935b",
  olive: "#78816a",
};

const BotanicalCorner = ({
  className = "bg-[#fbf8f2]",
  flip = false,
  animated = false,
  colors,
}: {
  className?: string;
  flip?: boolean;
  animated?: boolean;
  colors?: Partial<typeof palette>;
}) => {
  const p = { ...palette, ...colors };

  return (
    <svg
      viewBox="0 0 300 340"
      className={className}
      fill="none"
      aria-hidden="true"
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
        transformOrigin: "center",
      }}
    >
      <g className={animated ? "origin-bottom-left animate-[breathe_9s_ease-in-out_infinite]" : undefined}>

        {/* ── Scalloped lace border along the two edges ── */}
        {Array.from({ length: 9 }).map((_, i) => (
          <circle
            key={`scallop-h-${i}`}
            cx={22 + i * 33}
            cy={326}
            r="7"
            stroke={p.gold}
            strokeWidth="0.8"
            opacity={0.5 + i * 0.05}
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <circle
            key={`scallop-v-${i}`}
            cx={14}
            cy={300 - i * 31}
            r="7"
            stroke={p.gold}
            strokeWidth="0.8"
            opacity={0.55 + i * 0.04}
          />
        ))}

        {/* ── Concentric quarter arcs (fan) ── */}
        {[290, 258, 226, 194].map((r, i) => (
          <path
            key={`arc-${i}`}
            d={`M ${-60 + i * 8} 400 A ${r} ${r} 0 0 1 400 ${-60 + i * 8}`}
            stroke={p.olive}
            strokeWidth={1.4 - i * 0.25}
            opacity={0.75 - i * 0.15}
            strokeLinecap="round"
            transform="translate(-6, -6)"
          />
        ))}

        {/* ── Diagonal stem ── */}
        <path
          d="M26 318 C60 268 96 214 146 158 C196 102 246 56 296 18"
          stroke={p.olive}
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.85"
          strokeDasharray="none"
        />

        {/* ── Teardrop / paisley leaves along stem ── */}
        {[
          [52, 282, -42, 1.15],
          [78, 246, 30, 1],
          [106, 208, -38, 1.1],
          [136, 172, 28, 0.95],
          [168, 136, -34, 1.05],
          [200, 102, 30, 0.9],
          [232, 72, -28, 0.85],
          [262, 46, 24, 0.75],
        ].map(([x, y, rot, s], i) => (
          <g
            key={`drop-${i}`}
            transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}
            opacity="0.9"
          >
            {/* Teardrop body */}
            <path
              d="M0 14 C-9 8 -13 -2 -8 -10 C-4 -16 4 -16 8 -10 C13 -2 9 8 0 14 Z"
              fill={p.olive}
              fillOpacity="0.1"
              stroke={p.olive}
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
            {/* Inner spiral dot */}
            <circle cx="0" cy="-4" r="1.4" fill={p.gold} />
            {/* Tiny tail line */}
            <path d="M0 14 L0 20" stroke={p.olive} strokeWidth="0.7" strokeLinecap="round" />
          </g>
        ))}

        {/* ── Diamond flowers ── */}
        {[
          [92, 228, 1],
          [156, 154, 0.85],
          [220, 88, 0.7],
        ].map(([x, y, s], i) => (
          <g key={`flower-${i}`} transform={`translate(${x},${y}) scale(${s})`}>
            {/* 4 diamond petals */}
            {[45, 135, 225, 315].map((deg) => (
              <path
                key={deg}
                d="M0 -4 L4.5 -10 L0 -16 L-4.5 -10 Z"
                transform={`rotate(${deg})`}
                fill={p.rose}
                fillOpacity="0.1"
                stroke={p.rose}
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            ))}
            {/* Center ring + dot */}
            <circle r="3" stroke={p.gold} strokeWidth="0.8" fill={p.gold} fillOpacity="0.15" />
            <circle r="1.2" fill={p.gold} />
            {/* Orbiting dots */}
            {[0, 90, 180, 270].map((deg) => (
              <circle
                key={deg}
                cx={Math.cos((deg * Math.PI) / 180) * 12}
                cy={Math.sin((deg * Math.PI) / 180) * 12}
                r="1"
                fill={p.gold}
                opacity="0.6"
              />
            ))}
          </g>
        ))}

        {/* ── Chevron accents on the arcs ── */}
        {[
          [120, 258],
          [176, 220],
          [222, 168],
          [258, 108],
        ].map(([x, y], i) => (
          <g key={`chev-${i}`} transform={`translate(${x},${y}) rotate(45)`} opacity="0.65">
            <path d="M-4 0 L0 -4 L4 0" stroke={p.gold} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}

        {/* ── Corner jewel ── */}
        <g transform="translate(292, 12)">
          <path
            d="M0 -7 L5 0 L0 7 L-5 0 Z"
            fill={p.gold}
            fillOpacity="0.2"
            stroke={p.gold}
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <circle r="1.5" fill={p.gold} />
        </g>

        {/* ── Scattered pin dots ── */}
        {[
          [64, 300],
          [118, 240],
          [186, 176],
          [248, 116],
          [280, 70],
        ].map(([x, y], i) => (
          <circle key={`pin-${i}`} cx={x} cy={y} r="1.2" fill={p.rose} opacity="0.55" />
        ))}
      </g>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-1.2deg) scale(1.01); }
        }
      `}</style>
    </svg>
  );
};

/* ───────────────────────────────────────────────────────────────
   MandalaCorner — quarter lotus-mandala centred on the svg's
   bottom-left corner. Use `rotate={180}` to anchor it to a
   top-right page corner.
   ─────────────────────────────────────────────────────────────── */

const M_CX = 0;
const M_CY = 340;

const polar = (r: number, deg: number) => ({
  x: M_CX + r * Math.cos((deg * Math.PI) / 180),
  y: M_CY - r * Math.sin((deg * Math.PI) / 180),
});

// Pointed lotus petal drawn along +x, starting r0 from the origin.
const lotusPetal = (r0: number, len: number, w: number) =>
  `M ${r0} 0 C ${r0 + len * 0.25} ${-w}, ${r0 + len * 0.75} ${-w * 0.7}, ${r0 + len} 0 ` +
  `C ${r0 + len * 0.75} ${w * 0.7}, ${r0 + len * 0.25} ${w}, ${r0} 0 Z`;

const range = (start: number, step: number, count: number) =>
  Array.from({ length: count }, (_, i) => start + i * step);

const INNER_PETALS = range(7.5, 15, 6); // 7.5 … 82.5
const OUTER_PETALS = range(15, 15, 5); // 15 … 75
const BEADS = range(5, 7.5, 12); // 5 … 87.5
const SCALLOPS = range(10, 10, 8); // 10 … 80
const PENDANTS = range(12, 11, 7); // 12 … 78

const MandalaCorner = ({
  className = "",
  flip = false,
  rotate = 0,
  animated = false,
  colors,
}: {
  className?: string;
  flip?: boolean;
  rotate?: number;
  animated?: boolean;
  colors?: Partial<typeof palette>;
}) => {
  const p = { ...palette, ...colors };
  const uid = useId().replace(/:/g, "");
  const fadeId = `mandala-fade-${uid}`;

  return (
    <svg
      viewBox="0 0 300 340"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
      style={{
        transform:
          [flip ? "scaleX(-1)" : "", rotate ? `rotate(${rotate}deg)` : ""]
            .filter(Boolean)
            .join(" ") || undefined,
        transformOrigin: "center",
      }}
    >
      <defs>
        {/* Outer rings thin out as they leave the corner */}
        <radialGradient id={fadeId} cx={M_CX} cy={M_CY} r="262" gradientUnits="userSpaceOnUse">
          <stop offset="0.45" stopColor={p.gold} stopOpacity="0.9" />
          <stop offset="1" stopColor={p.gold} stopOpacity="0.25" />
        </radialGradient>
      </defs>

      <g
        className={animated ? "mandala-turn" : undefined}
        style={{ transformOrigin: `${M_CX}px ${M_CY}px` }}
      >
        {/* Guide arcs */}
        {[196, 204].map((r, i) => (
          <path
            key={`guide-${r}`}
            d={`M ${r} ${M_CY} A ${r} ${r} 0 0 0 0 ${M_CY - r}`}
            stroke={`url(#${fadeId})`}
            strokeWidth={i === 0 ? 1.1 : 0.6}
          />
        ))}

        {/* Outer pendants: stalk, leaf-drop, tip bead */}
        {PENDANTS.map((a, i) => (
          <g
            key={`pend-${a}`}
            transform={`translate(${M_CX},${M_CY}) rotate(${-a})`}
            opacity={0.95 - i * 0.04}
          >
            <path d="M 204 0 L 222 0" stroke={p.olive} strokeWidth="0.8" strokeLinecap="round" />
            <path
              d="M 222 0 C 228 -5.5 238 -4.5 244 0 C 238 4.5 228 5.5 222 0 Z"
              fill={p.rose}
              fillOpacity="0.16"
              stroke={p.rose}
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
            <circle cx="250" cy="0" r="1.8" fill={p.gold} />
          </g>
        ))}

        {/* Scalloped ring */}
        {SCALLOPS.map((a) => {
          const { x, y } = polar(172, a);
          return (
            <circle key={`sc-${a}`} cx={x} cy={y} r="6" stroke={p.olive} strokeWidth="0.8" opacity="0.7" />
          );
        })}

        {/* Bead ring, alternating large and small */}
        {BEADS.map((a, i) => {
          const { x, y } = polar(142, a);
          return (
            <circle key={`bd-${a}`} cx={x} cy={y} r={i % 2 === 0 ? 1.8 : 1} fill={p.gold} opacity="0.8" />
          );
        })}

        {/* Outer lotus petals */}
        {OUTER_PETALS.map((a) => (
          <g key={`op-${a}`} transform={`translate(${M_CX},${M_CY}) rotate(${-a})`}>
            <path
              d={lotusPetal(66, 62, 13)}
              fill={p.rose}
              fillOpacity="0.1"
              stroke={p.rose}
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
            <path d="M 78 0 L 118 0" stroke={p.rose} strokeWidth="0.5" opacity="0.55" strokeLinecap="round" />
          </g>
        ))}

        {/* Inner lotus petals, staggered against the outer ring */}
        {INNER_PETALS.map((a) => (
          <g key={`ip-${a}`} transform={`translate(${M_CX},${M_CY}) rotate(${-a})`}>
            <path
              d={lotusPetal(20, 56, 12)}
              fill={p.gold}
              fillOpacity="0.16"
              stroke={p.gold}
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
            <circle cx="62" cy="0" r="1.3" fill={p.gold} />
          </g>
        ))}

        {/* Centre seed */}
        <circle cx={M_CX} cy={M_CY} r="17" fill={p.olive} fillOpacity="0.12" stroke={p.olive} strokeWidth="0.9" />
        <circle cx={M_CX} cy={M_CY} r="9" stroke={p.gold} strokeWidth="0.8" />
        <circle cx={M_CX} cy={M_CY} r="3" fill={p.gold} />
      </g>

      {animated && (
        <style>{`
          @keyframes mandala-turn {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(2deg); }
          }
          .mandala-turn { animation: mandala-turn 12s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .mandala-turn { animation: none; }
          }
        `}</style>
      )}
    </svg>
  );
};

const SmallFloral = () => (
  <svg width="52" height="18" viewBox="0 0 52 18" fill="none">
    <path
      d="M2 9 C12 9 17 9 23 9"
      stroke={palette.line}
      strokeWidth="0.8"
    />

    <path
      d="M29 9 C35 9 40 9 50 9"
      stroke={palette.line}
      strokeWidth="0.8"
    />

    <path
      d="M26 3 C29 5 30 7 26 9 C22 7 23 5 26 3Z"
      stroke={palette.rose}
      strokeWidth="0.8"
    />

    <path
      d="M26 15 C29 13 30 11 26 9 C22 11 23 13 26 15Z"
      stroke={palette.olive}
      strokeWidth="0.8"
    />

    <circle cx="26" cy="9" r="1.6" fill={palette.gold} />
  </svg>
);

const UnderlineSwash = ({ width = 150 }: { width?: number }) => (
  <svg
    width={width}
    height="16"
    viewBox={`0 0 ${width} 16`}
    fill="none"
    aria-hidden="true"
  >
    {/* Main flourish */}
    <path
      d={`M2 9
          C ${width * 0.12} 3,
            ${width * 0.22} 3,
            ${width * 0.32} 8
          C ${width * 0.42} 13,
            ${width * 0.55} 12,
            ${width * 0.64} 7
          C ${width * 0.73} 2,
            ${width * 0.87} 3,
            ${width - 2} 7`}
      stroke={palette.rose}
      strokeWidth="1.2"
      strokeLinecap="round"
    />

    {/* Fine gold underline */}
    <path
      d={`M${width * 0.18} 12
          C ${width * 0.38} 10,
            ${width * 0.62} 10,
            ${width * 0.82} 11`}
      stroke={palette.gold}
      strokeWidth="0.7"
      strokeLinecap="round"
      opacity="0.7"
    />
  </svg>
);

const NumberMark = ({ n }: { n: number }) => (
  <span
    className="inline-flex min-w-[20px] items-center justify-center text-[10px]"
    style={{
      color: palette.accent,
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "0.08em",
    }}
  >
    {String(n).padStart(2, "0")}
  </span>
);

const SectionHeading = ({
  number,
  title,
}: {
  number: number;
  title: string;
}) => (
  <div className="mb-5 flex items-center gap-3">
    <NumberMark n={number} />

    <h2
      className="text-[11px] font-semibold uppercase tracking-[0.22em]"
      style={{ color: palette.ink }}
    >
      {title}
    </h2>

    <span
      className="h-px flex-1"
      style={{ backgroundColor: palette.line }}
    />
  </div>
);

type CornerStyle = "botanical" | "mandala";

const LineTemplate = forwardRef<
  HTMLDivElement,
  { doc: BiodataDocument; fonts: FontPack; corner?: CornerStyle }
>(({ doc, fonts, corner = "mandala" }, ref) => {
  const lang = doc.language;

  const L = (en: string, hi: string) =>
    lang === "hi" ? hi : en;

  const heading =
    fonts.heading ||
    "'Cormorant Garamond', 'Noto Serif Devanagari', serif";

  const body =
    fonts.body ||
    "'Inter', 'Noto Sans Devanagari', sans-serif";

  const visibleSections = doc.sections.filter(
    (s) => s.visible
  );

  const aboutSection = visibleSections.find(
    (s) =>
      s.type === "paragraph" &&
      /about/i.test(s.titleEn)
  );

  const otherSections = visibleSections.filter(
    (s) => s !== aboutSection
  );

  return (
    <div
      ref={ref}
      className="relative min-h-[297mm] w-[210mm] overflow-hidden"
      style={{
        backgroundColor: palette.bg,
        color: palette.ink,
        fontFamily: body,
      }}
    >
      {/* Paper frame */}
      <div
        className="pointer-events-none absolute inset-[9mm]"
        style={{
          border: `1px solid ${palette.line}`,
        }}
      />

      {/* Corner ornaments */}
      {corner === "mandala" ? (
        <>
          {/* Svg is centred on its bottom-left, so the top-right corner is rotated 180° */}
          <MandalaCorner
            rotate={180}
            className="absolute -right-5 -top-5 h-[230px] w-[203px] bg-[#fbf8f2]"
          />

          <MandalaCorner className="absolute -bottom-5 -left-5 h-[230px] w-[203px]  bg-[#fbf8f2]" />
        </>
      ) : (
        <>
          <BotanicalCorner className="absolute -right-8 -top-8 h-[270px] w-[240px]" />

          <BotanicalCorner
            flip
            className="absolute -bottom-10 -left-8 h-[260px] w-[230px] opacity-65"
          />
        </>
      )}

      {/* Small decorative dots */}
      <div
        className="absolute left-[12mm] top-[34mm] h-1.5 w-1.5"
        style={{ backgroundColor: palette.gold }}
      />

      <div
        className="absolute right-[12mm] bottom-[34mm] h-1.5 w-1.5"
        style={{ backgroundColor: palette.rose }}
      />

      <div className="relative px-[20mm] pb-[15mm] pt-[18mm]">
        {/* HEADER */}
        <header className="avoid-break">
          <div className="flex items-start justify-between gap-10">
            <div className="max-w-[125mm]">
              {doc.invocation.enabled && (
                <div className="mb-5 flex items-center gap-3">

                  <p
                    className="text-[10px] tracking-[0.22em]"
                    style={{ color: palette.muted }}
                  >
                    {doc.invocation.text}
                  </p>
                </div>
              )}

              <p
                className="mb-3 text-[10px] font-semibold uppercase tracking-[0.34em]"
                style={{ color: palette.accent }}
              >
                {L(
                  "Marriage Biodata",
                  "विवाह हेतु बायोडाटा"
                )}
              </p>

              <h1
                className="text-[48px] font-medium leading-[0.98] tracking-[-0.02em]"
                style={{
                  fontFamily: heading,
                  color: palette.ink,
                }}
              >
                {(lang === "hi" && doc.fullNameHi) ||
                  doc.fullName ||
                  L("Full Name", "पूरा नाम")}
              </h1>

              <div className="mt-4">
                <UnderlineSwash width={195} />
              </div>
            </div>

            {/* PHOTO */}
            <div
              className="relative h-[48mm] w-[37mm] shrink-0 overflow-hidden"
              style={{
                border: `1px solid ${palette.line}`,
                backgroundColor: palette.paper,
              }}
            >
              {doc.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={doc.photo}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                  decoding="sync"
                  style={{
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                  } as React.CSSProperties}
                />
              ) : (
                <div
                  className="flex h-full w-full flex-col items-center justify-center gap-2 text-center"
                  style={{ color: palette.muted }}
                >
                  <SmallFloral />

                  <span className="text-[9px] uppercase tracking-[0.2em]">
                    {L("Photo", "फोटो")}
                  </span>
                </div>
              )}

              {/* Photo corner detail */}
              <span
                className="absolute left-2 top-2 h-3 w-3 border-l border-t"
                style={{ borderColor: palette.gold }}
              />

              <span
                className="absolute bottom-2 right-2 h-3 w-3 border-b border-r"
                style={{ borderColor: palette.rose }}
              />
            </div>
          </div>
        </header>

        {/* ABOUT */}
        {aboutSection && (
          <section
            className="mt-11 max-w-[150mm] avoid-break"
            style={{
              borderLeft: `2px solid ${palette.rose}`,
              paddingLeft: "7mm",
            }}
          >
            <p
              className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: palette.muted }}
            >
              {L("About", "परिचय")}
            </p>

            <p
              className="text-[13.5px] leading-[1.8]"
              style={{
                color: palette.ink,
                opacity: 0.82,
              }}
            >
              {(lang === "hi" &&
                aboutSection.fields[0]?.valueHi) ||
                aboutSection.fields[0]?.value ||
                ""}
            </p>
          </section>
        )}

        {/* SECTIONS */}
        <div className="mt-12 space-y-9">
          {otherSections.map((section, idx) => {
            const title =
              lang === "hi"
                ? section.titleHi || section.titleEn
                : section.titleEn;

            return section.type === "grid" ? (
              <section
                key={section.id}
                className="avoid-break"
              >
                <SectionHeading
                  number={idx + 1}
                  title={title}
                />

                <div className="grid grid-cols-2 gap-x-12 gap-y-3 pl-[8mm]">
                  {section.fields.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-baseline gap-3"
                    >
                      <p
                        className="min-w-[30mm] text-[9px] font-medium uppercase tracking-[0.08em]"
                        style={{
                          color: palette.muted,
                        }}
                      >
                        {lang === "hi"
                          ? f.labelHi || f.labelEn
                          : f.labelEn}
                      </p>

                      <span
                        className="h-px flex-1"
                        style={{
                          backgroundColor:
                            palette.line,
                        }}
                      />

                      <p
                        className="text-right text-[12.5px]"
                        style={{
                          color: palette.ink,
                        }}
                      >
                        {f.value?.trim() || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section
                key={section.id}
                className="avoid-break"
              >
                <SectionHeading
                  number={idx + 1}
                  title={title}
                />

                <p
                  className="pl-[8mm] text-[13px] leading-[1.8]"
                  style={{
                    color: palette.ink,
                    opacity: 0.82,
                  }}
                >
                  {(lang === "hi" &&
                    section.fields[0]?.valueHi) ||
                    section.fields[0]?.value ||
                    "—"}
                </p>
              </section>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="mt-14 flex items-center justify-center gap-4">
          <span
            className="h-px w-20"
            style={{ backgroundColor: palette.line }}
          />

          <SmallFloral />

          <span
            className="h-px w-20"
            style={{ backgroundColor: palette.line }}
          />
        </div>

        <div className="mt-3 text-center">
          <span
            className="text-[8px] uppercase tracking-[0.28em]"
            style={{ color: palette.muted }}
          >
            {L(
              "With Best Wishes",
              "शुभकामनाओं सहित"
            )}
          </span>
        </div>
      </div>
    </div>
  );
});

LineTemplate.displayName = "LineTemplate";

export default LineTemplate;