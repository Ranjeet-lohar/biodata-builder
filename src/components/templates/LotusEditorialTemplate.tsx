import { forwardRef } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  paper: "#f8f4eb",
  ink: "#242a2b",
  teal: "#176b72",
  deepTeal: "#11585e",
  coral: "#c86b52",
  gold: "#b5965b",
  muted: "#70797b",
  line: "#d9d0c3",
  soft: "#eee7dc",
};

function LotusMark({
  color,
  size = 34,
}: {
  color: string;
  size?: number;
}) {
  return (
    <svg
  width={size}
  height={size}
  viewBox="0 0 40 40"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  {/* Center petal */}
  <path
    d="M20 31C16.5 26 16.5 19 20 10C23.5 19 23.5 26 20 31Z"
    stroke={color}
    strokeWidth="1.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  />

  {/* Left petal */}
  <path
    d="M20 31C14 28 10 23 10 17C15 19 19 24 20 31Z"
    stroke={color}
    strokeWidth="1.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  />

  {/* Right petal */}
  <path
    d="M20 31C26 28 30 23 30 17C25 19 21 24 20 31Z"
    stroke={color}
    strokeWidth="1.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  />

  {/* Outer left petal */}
  <path
    d="M19 30C13 29 7 25 5 20C11 20 17 23 19 30Z"
    stroke={color}
    strokeWidth="0.9"
    strokeLinecap="round"
  />

  {/* Outer right petal */}
  <path
    d="M21 30C27 29 33 25 35 20C29 20 23 23 21 30Z"
    stroke={color}
    strokeWidth="0.9"
    strokeLinecap="round"
  />

  {/* Base */}
  <path
    d="M12 31C16 33 24 33 28 31"
    stroke={color}
    strokeWidth="1"
    strokeLinecap="round"
  />

  <circle
    cx="20"
    cy="29"
    r="1"
    fill={color}
  />
</svg>
  );
}

function BotanicalCorner({
  color,
  secondary,
  className = "",
  flip = false,
}: {
  color: string;
  secondary: string;
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      fill="none"
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <path
        d="M8 230 C35 174 72 122 122 80 C158 50 193 28 232 8"
        stroke={color}
        strokeWidth="1"
        opacity="0.55"
      />

      <path
        d="M38 190 C67 172 92 147 111 117"
        stroke={secondary}
        strokeWidth="0.8"
        opacity="0.55"
      />

      {[
        [39, 188, -32],
        [61, 157, 26],
        [83, 131, -22],
        [107, 105, 26],
        [132, 82, -20],
        [159, 60, 25],
        [187, 40, -18],
      ].map(([x, y, rotate], i) => (
        <g
          key={i}
          transform={`translate(${x},${y}) rotate(${rotate})`}
          opacity="0.7"
        >
          <path
            d="M0 0 C10 -8 23 -9 33 -3 C25 5 10 8 0 0Z"
            stroke={color}
            strokeWidth="0.8"
          />
          <path
            d="M3 -1 C12 -3 22 -4 29 -3"
            stroke={color}
            strokeWidth="0.45"
          />
        </g>
      ))}

      <g transform="translate(92 131)">
        <circle
          cx="0"
          cy="-6"
          r="4"
          stroke={secondary}
          strokeWidth="0.8"
        />
        <circle
          cx="6"
          cy="0"
          r="4"
          stroke={secondary}
          strokeWidth="0.8"
        />
        <circle
          cx="0"
          cy="6"
          r="4"
          stroke={secondary}
          strokeWidth="0.8"
        />
        <circle
          cx="-6"
          cy="0"
          r="4"
          stroke={secondary}
          strokeWidth="0.8"
        />
        <circle
          cx="0"
          cy="0"
          r="1.5"
          fill={secondary}
        />
      </g>

      <circle
        cx="232"
        cy="8"
        r="2"
        fill={secondary}
      />
    </svg>
  );
}

function PhotoFrame({
  doc,
  L,
}: {
  doc: BiodataDocument;
  L: (en: string, hi: string) => string;
}) {
  return (
    <div className="relative shrink-0">
      {/* Offset decorative frame */}
     

      {/* Photo */}
      <div
        className="relative h-[158px] w-[120px] overflow-hidden"
        style={{
          border: `1px solid ${palette.teal}`,
          backgroundColor: palette.soft,
        }}
      >
        {doc.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doc.photo}
            alt="Profile"
            crossOrigin="anonymous"
            className="block h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-3 text-center"
            style={{ color: palette.muted }}
          >
            <LotusMark
              color={palette.teal}
              size={32}
            />

            <span className="text-[9px] uppercase tracking-[0.18em]">
              {L("Photograph", "फोटो")}
            </span>
          </div>
        )}

        {/* Corner marks */}
        <span
          className="absolute left-2 top-2 h-5 w-5 border-l border-t"
          style={{ borderColor: palette.gold }}
        />

        <span
          className="absolute bottom-2 right-2 h-5 w-5 border-b border-r"
          style={{ borderColor: palette.gold }}
        />
      </div>

      <p
        className="mt-2 text-center text-[8px] font-medium uppercase tracking-[0.16em]"
        style={{ color: palette.muted }}
      >
        {L("Profile Photograph", "प्रोफ़ाइल फोटो")}
      </p>
    </div>
  );
}

function SectionTitle({
  number,
  title,
  heading,
}: {
  number: number;
  title: string;
  heading: string;
}) {
  return (
    <div
      className="flex items-center gap-3 border-b pb-2"
      style={{ borderColor: palette.line }}
    >
      <span
        className="flex h-6 w-6 items-center justify-center text-[9px] font-semibold"
        style={{
          backgroundColor: palette.teal,
          color: "#ffffff",
        }}
      >
        {String(number).padStart(2, "0")}
      </span>

      <h2
        className="text-[12px] font-semibold uppercase tracking-[0.17em]"
        style={{
          color: palette.ink,
          fontFamily: heading,
        }}
      >
        {title}
      </h2>

      <span
        className="ml-auto h-px w-12"
        style={{
          backgroundColor: palette.coral,
          opacity: 0.6,
        }}
      />
    </div>
  );
}

const LotusEditorialTemplate = forwardRef<
  HTMLDivElement,
  { doc: BiodataDocument; fonts: FontPack }
>(({ doc, fonts }, ref) => {
  const lang = doc.language;

  const L = (en: string, hi: string) =>
    lang === "hi" ? hi : en;

  const heading =
    fonts.heading ||
    "'Playfair Display', 'Noto Serif Devanagari', serif";

  const body =
    fonts.body ||
    "'Inter', 'Noto Sans Devanagari', sans-serif";

  const sections = doc.sections.filter(
    (section) => section.visible
  );

  const gridSections = sections.filter(
    (section) => section.type === "grid"
  );

  const paragraphSections = sections.filter(
    (section) => section.type === "paragraph"
  );

  const aboutSection =
    paragraphSections.find((section) =>
      /about/i.test(section.titleEn)
    );

  const otherParagraphs = paragraphSections.filter(
    (section) => section !== aboutSection
  );

  const displayName =
    (lang === "hi" && doc.fullNameHi) ||
    doc.fullName ||
    L("Full Name", "पूरा नाम");

  return (
    <div
      ref={ref}
      className="relative min-h-[297mm] w-[210mm] overflow-hidden"
      style={{
        backgroundColor: palette.paper,
        color: palette.ink,
        fontFamily: body,
        boxSizing: "border-box",
      }}
    >
      {/* A4 inner border */}
      <div
        className="pointer-events-none absolute inset-[8mm]"
        style={{
          border: `1px solid ${palette.line}`,
        }}
      />

      {/* Botanical decorations */}
      {/* <BotanicalCorner
        color={palette.teal}
        secondary={palette.coral}
        className="pointer-events-none absolute -right-5 -top-5 h-[215px] w-[215px]"
      /> */}

      <BotanicalCorner
        color={palette.teal}
        secondary={palette.coral}
        flip
        className="pointer-events-none absolute -bottom-5 -left-5 h-[205px] w-[205px] opacity-55"
      />

      <div className="relative px-14 pb-12 pt-12">
        {/* TOP BRAND LINE */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LotusMark
              color={palette.coral}
              size={22}
            />

            <span
              className="text-[8px] font-semibold uppercase tracking-[0.25em]"
              style={{ color: palette.teal }}
            >
              {L(
                "Marriage Biodata",
                "विवाह बायोडाटा"
              )}
            </span>
          </div>

          <span
            className="text-[8px] uppercase tracking-[0.2em]"
            style={{ color: palette.muted }}
          >
            {L(
              "Personal Profile",
              "व्यक्तिगत परिचय"
            )}
          </span>
        </div>

        {/* HEADER */}
        <div className="mt-8 flex items-start justify-between gap-10 avoid-break">
          <div className="max-w-[430px] pt-3">
            {doc.invocation.enabled && (
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="h-px w-8"
                  style={{
                    backgroundColor: palette.coral,
                  }}
                />

                <p
                  className="text-[11px]"
                  style={{
                    color: palette.muted,
                  }}
                >
                  {doc.invocation.text}
                </p>
              </div>
            )}

            <p
              className="mb-2 text-[9px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: palette.coral }}
            >
              {L(
                "A Personal Story",
                "व्यक्तिगत परिचय"
              )}
            </p>

            <h1
              className="text-[43px] font-medium leading-[1.03] tracking-[-0.015em]"
              style={{
                fontFamily: heading,
                color: palette.ink,
              }}
            >
              {displayName}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <span
                className="h-[2px] w-16"
                style={{
                  backgroundColor: palette.teal,
                }}
              />

              <span
                className="h-px w-10"
                style={{
                  backgroundColor: palette.coral,
                }}
              />
            </div>

            <p
              className="mt-4 max-w-[330px] text-[11px] leading-[1.7]"
              style={{ color: palette.muted }}
            >
              {L(
                "A thoughtfully arranged marriage profile presenting personal details, family values and life aspirations.",
                "व्यक्तिगत विवरण, पारिवारिक मूल्यों और जीवन की आकांक्षाओं को प्रस्तुत करता हुआ विवाह परिचय।"
              )}
            </p>
          </div>

          <PhotoFrame doc={doc} L={L} />
        </div>

        {/* ABOUT */}
        {aboutSection && (
          <section className="mt-10 avoid-break">
            <div className="grid grid-cols-[90px_1fr] gap-7">
              <div>
                <p
                  className="text-[9px] font-semibold uppercase tracking-[0.22em]"
                  style={{
                    color: palette.teal,
                  }}
                >
                  {L("About", "परिचय")}
                </p>

                <div className="mt-3">
                  <LotusMark
                    color={palette.coral}
                    size={30}
                  />
                </div>
              </div>

              <p
                className="border-l pl-6 text-[13px] leading-[1.85]"
                style={{
                  borderColor: palette.line,
                  color: palette.ink,
                  opacity: 0.88,
                }}
              >
                {(lang === "hi" &&
                  aboutSection.fields[0]?.valueHi) ||
                  aboutSection.fields[0]?.value ||
                  "—"}
              </p>
            </div>
          </section>
        )}

        {/* DETAILS */}
        {gridSections.length > 0 && (
          <section className="mt-10">
            <SectionTitle
              number={1}
              title={L(
                "Personal Details",
                "व्यक्तिगत विवरण"
              )}
              heading={heading}
            />

            <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-6 pl-9">
              {gridSections.map((section) => (
                <div
                  key={section.id}
                  className="avoid-break"
                >
                  <h3
                    className="mb-3 text-[9px] font-semibold uppercase tracking-[0.18em]"
                    style={{
                      color: palette.coral,
                      fontFamily: heading,
                    }}
                  >
                    {lang === "hi"
                      ? section.titleHi ||
                        section.titleEn
                      : section.titleEn}
                  </h3>

                  <div className="space-y-3">
                    {section.fields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-baseline gap-2"
                      >
                        <span
                          className="shrink-0 text-[9px] uppercase tracking-[0.06em]"
                          style={{
                            color: palette.muted,
                          }}
                        >
                          {lang === "hi"
                            ? field.labelHi ||
                              field.labelEn
                            : field.labelEn}
                        </span>

                        <span
                          className="h-px flex-1"
                          style={{
                            backgroundColor:
                              palette.line,
                            opacity: 0.7,
                          }}
                        />

                        <span className="text-right text-[11.5px] font-medium">
                          {field.value?.trim() ||
                            "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* OTHER INFORMATION */}
        {otherParagraphs.length > 0 && (
          <section className="mt-10">
            <SectionTitle
              number={2}
              title={L(
                "Additional Information",
                "अतिरिक्त जानकारी"
              )}
              heading={heading}
            />

            <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-7 pl-9">
              {otherParagraphs.map((section) => (
                <div
                  key={section.id}
                  className="avoid-break"
                >
                  <h3
                    className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em]"
                    style={{
                      color: palette.coral,
                      fontFamily: heading,
                    }}
                  >
                    {lang === "hi"
                      ? section.titleHi ||
                        section.titleEn
                      : section.titleEn}
                  </h3>

                  <p
                    className="text-[12px] leading-[1.75] text-justify"
                    style={{
                      color: palette.ink,
                      opacity: 0.85,
                    }}
                  >
                    {(lang === "hi" &&
                      section.fields[0]?.valueHi) ||
                      section.fields[0]?.value ||
                      "—"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER */}
        <div className="mt-11">
          <div
            className="h-[2px] w-full"
            style={{
              backgroundColor: palette.teal,
            }}
          />

          <div className="mt-3 flex items-center justify-center gap-3">
            <span
              className="h-px w-12"
              style={{
                backgroundColor: palette.line,
              }}
            />

            <LotusMark
              color={palette.coral}
              size={22}
            />

            <span
              className="h-px w-12"
              style={{
                backgroundColor: palette.line,
              }}
            />
          </div>

          <p
            className="mt-2 text-center text-[8px] font-medium uppercase tracking-[0.25em]"
            style={{
              color: palette.muted,
            }}
          >
            {L(
              "With Best Wishes",
              "शुभकामनाओं सहित"
            )}
          </p>
        </div>
      </div>

      {/* Bottom color strip */}
      <div
        className="absolute bottom-0 left-0 h-[5px] w-full"
        style={{
          backgroundColor: palette.teal,
        }}
      />
    </div>
  );
});

LotusEditorialTemplate.displayName =
  "LotusEditorialTemplate";

export default LotusEditorialTemplate;