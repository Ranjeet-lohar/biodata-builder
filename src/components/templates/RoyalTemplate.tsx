import { forwardRef } from "react";
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
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) => (
  <svg
    viewBox="0 0 300 340"
    className={className}
    fill="none"
    style={{ transform: flip ? "scaleX(-1)" : undefined }}
  >
    <path
      d="M12 330 C28 270 48 218 82 166 C122 106 184 56 288 8"
      stroke={palette.olive}
      strokeWidth="1.15"
      opacity="0.8"
    />

    <path
      d="M42 278 C82 250 112 220 142 176"
      stroke={palette.gold}
      strokeWidth="0.8"
      opacity="0.55"
    />

    {[
      [58, 248, -32],
      [82, 208, 24],
      [108, 174, -20],
      [136, 140, 30],
      [165, 108, -18],
      [198, 78, 24],
      [230, 52, -15],
    ].map(([x, y, rot], i) => (
      <g
        key={i}
        transform={`translate(${x},${y}) rotate(${rot})`}
        opacity="0.8"
      >
        <path
          d="M0 0 C12 -10 28 -11 39 -2 C28 6 12 9 0 0Z"
          stroke={palette.olive}
          strokeWidth="0.9"
        />

        <path
          d="M4 -1 C14 -4 25 -5 35 -3"
          stroke={palette.olive}
          strokeWidth="0.55"
        />
      </g>
    ))}

    {/* Small flowers */}
    {[
      [88, 195],
      [153, 120],
      [216, 64],
    ].map(([x, y], i) => (
      <g key={i} transform={`translate(${x},${y})`}>
        <circle cx="0" cy="-7" r="4" stroke={palette.rose} strokeWidth="0.8" />
        <circle cx="6" cy="0" r="4" stroke={palette.rose} strokeWidth="0.8" />
        <circle cx="0" cy="7" r="4" stroke={palette.rose} strokeWidth="0.8" />
        <circle cx="-6" cy="0" r="4" stroke={palette.rose} strokeWidth="0.8" />
        <circle cx="0" cy="0" r="2" fill={palette.gold} />
      </g>
    ))}

    <circle cx="288" cy="8" r="2.2" fill={palette.gold} />
  </svg>
);

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
    height="12"
    viewBox={`0 0 ${width} 12`}
    fill="none"
  >
    <path
      d={`M2 8 Q ${width * 0.25} 2, ${width * 0.5} 7 T ${width - 2} 5`}
      stroke={palette.rose}
      strokeWidth="1"
    />

    <path
      d={`M${width * 0.15} 10 Q ${width * 0.5} 8, ${width * 0.82} 9`}
      stroke={palette.gold}
      strokeWidth="0.6"
      opacity="0.65"
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

    <span
      className="h-px w-8"
      style={{ backgroundColor: palette.line }}
    />

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

const LineTemplate = forwardRef<
  HTMLDivElement,
  { doc: BiodataDocument; fonts: FontPack }
>(({ doc, fonts }, ref) => {
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

      {/* Floral corners */}
      <BotanicalCorner className="absolute -right-8 -top-8 h-[270px] w-[240px]" />

      <BotanicalCorner
        flip
        className="absolute -bottom-10 -left-8 h-[260px] w-[230px] opacity-65"
      />

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
                  <span
                    className="h-px w-8"
                    style={{
                      backgroundColor: palette.gold,
                    }}
                  />

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
                <UnderlineSwash width={155} />
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

                <div className="grid grid-cols-2 gap-x-12 gap-y-4 pl-[8mm]">
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