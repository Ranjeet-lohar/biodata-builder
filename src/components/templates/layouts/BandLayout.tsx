import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";
import { Theme } from "./theme";
import { photoShapeClass } from "./Motifs";

function FloralCorner({
  theme,
  className = "",
  flip = false,
}: {
  theme: Theme;
  className?: string;
  flip?: boolean;
}) {
 return (
  <img src="/bio-bg.png" width="100" height="100" className="absolute bottom-8 left-8 " />
);
}

function MastheadRule({ theme }: { theme: Theme }) {
  return (
    <div className="relative h-[10px] w-full z-20">
      <div
        className="absolute left-0 right-0 top-[1px] h-[2px]"
        style={{ backgroundColor: theme.primary }}
      />

      <div
        className="absolute left-0 right-0 top-[7px] h-[1px]"
        style={{
          backgroundColor: theme.secondary,
          opacity: 0.45,
        }}
      />
    </div>
  );
}

function SectionDivider({
  theme,
  number,
  title,
  heading,
}: {
  theme: Theme;
  number: number;
  title: string;
  heading: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span
        className="flex h-6 w-6 items-center justify-center border text-[9px] font-semibold"
        style={{
          borderColor: theme.primary,
          color: theme.primary,
        }}
      >
        {String(number).padStart(2, "0")}
      </span>

      <div className="flex-1">
        <h2
          className="text-[12px] font-bold uppercase tracking-[0.2em]"
          style={{
            color: theme.primary,
            fontFamily: heading,
          }}
        >
          {title}
        </h2>
      </div>

      <span
        className="h-px w-16"
        style={{
          backgroundColor: theme.border,
        }}
      />
    </div>
  );
}

function PhotoInset({
  theme,
  doc,
  L,
}: {
  theme: Theme;
  doc: BiodataDocument;
  L: (en: string, hi: string) => string;
}) {
  return (
    <div
      className="shrink-0"
      style={{ width: "132px" }}
    >
      <div
        className={`relative h-[166px] w-[132px] overflow-hidden ${photoShapeClass(
          theme.photoShape
        )}`}
        style={{
          border: `1px solid ${theme.primary}`,
          backgroundColor: theme.bg,
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
            className="flex h-full w-full flex-col items-center justify-center gap-3 text-center px-3"
            style={{
              color: theme.text,
              opacity: 0.4,
            }}
          >
            <div
              className="h-10 w-10 border"
              style={{ borderColor: theme.secondary }}
            />

            <span className="text-[9px] uppercase tracking-[0.18em]">
              {L("Photograph", "फोटो")}
            </span>
          </div>
        )}

        {/* Corner marks */}
        <span
          className="absolute left-2 top-2 h-5 w-5 border-l border-t"
          style={{ borderColor: theme.secondary }}
        />

        <span
          className="absolute bottom-2 right-2 h-5 w-5 border-b border-r"
          style={{ borderColor: theme.secondary }}
        />
      </div>

      <p
        className="mt-2 text-center text-[8.5px] font-medium uppercase tracking-[0.16em]"
        style={{ color: theme.secondary }}
      >
        {L("Profile Photograph", "प्रोफ़ाइल फोटो")}
      </p>
    </div>
  );
}

export default function MastheadLayout({
  doc,
  fonts,
  theme,
}: {
  doc: BiodataDocument;
  fonts: FontPack;
  theme: Theme;
}) {
  const lang = doc.language;

  const L = (en: string, hi: string) =>
    lang === "hi" ? hi : en;

  const heading =
    fonts.heading || theme.headingFont;

  const body =
    fonts.body || theme.bodyFont;

  const visibleSections = doc.sections.filter(
    (s) => s.visible
  );

  const gridSections = visibleSections.filter(
    (s) => s.type === "grid"
  );

  const paragraphSections = visibleSections.filter(
    (s) => s.type === "paragraph"
  );

  const aboutSection =
    paragraphSections.find((s) =>
      /about/i.test(s.titleEn)
    ) ?? paragraphSections[0];

  const restParagraphs = paragraphSections.filter(
    (s) => s !== aboutSection
  );

  const aboutText =
    (lang === "hi" &&
      aboutSection?.fields[0]?.valueHi) ||
    aboutSection?.fields[0]?.value ||
    "";

  const cleanAbout = aboutText.trim();

  const firstChar = cleanAbout.charAt(0);
  const restOfAbout = cleanAbout.slice(1);

  const today = new Date();

  const formattedDate = today.toLocaleDateString(
    lang === "hi" ? "hi-IN" : "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <div
      className="relative min-h-[297mm] w-[210mm] overflow-hidden"
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: body,
      }}
    >
      {/* Decorative floral corners */}
      <FloralCorner
        theme={theme}
        className="pointer-events-none absolute -right-8 -top-8 h-[250px] w-[250px]"
      />

      <FloralCorner
        theme={theme}
        flip
        className="pointer-events-none absolute -bottom-8 -left-8 h-[240px] w-[240px] opacity-60"
      />

      {/* A4 inner frame */}
      <div
        className="pointer-events-none absolute inset-[8mm]"
        style={{
          border: `1px solid ${theme.border}`,
        }}
      />

      {/* Small accent marks */}
      <div
        className="absolute left-[10mm] top-[18mm] h-1.5 w-1.5"
        style={{ backgroundColor: theme.primary }}
      />

      <div
        className="absolute right-[10mm] bottom-[18mm] h-1.5 w-1.5"
        style={{ backgroundColor: theme.secondary }}
      />

      <div className="relative px-16 pb-14 pt-10">
        {/* TOP META */}
        <div
          className="flex items-center justify-between text-[8.5px] uppercase tracking-[0.2em]"
          style={{ color: theme.secondary }}
        >
          <span>
            {L(
              "Personal Edition",
              "व्यक्तिगत संस्करण"
            )}
          </span>

          <span className="font-semibold">
            {L(
              "Marriage Biodata",
              "विवाह बायोडाटा"
            )}
          </span>

          <span>{formattedDate}</span>
        </div>

        <div className="mt-3">
          <MastheadRule theme={theme} />
        </div>

        {/* INVOCATION */}
        {doc.invocation.enabled && (
          <div className="mt-7 text-center avoid-break">
            <p
              className="text-[12px] italic"
              style={{ color: theme.secondary }}
            >
              {doc.invocation.text}
            </p>
          </div>
        )}

        {/* NAME */}
        <div
          className={`text-center avoid-break ${
            doc.invocation.enabled
              ? "mt-2"
              : "mt-7"
          }`}
        >
          <p
            className="mb-2 text-[9px] font-semibold uppercase tracking-[0.35em]"
            style={{ color: theme.secondary }}
          >
            {L(
              "Marriage Profile",
              "विवाह परिचय"
            )}
          </p>

          <h1
            className="text-[50px] font-semibold leading-[1] tracking-[-0.02em]"
            style={{
              fontFamily: heading,
              color: theme.primary,
            }}
          >
            {(lang === "hi" &&
              doc.fullNameHi) ||
              doc.fullName ||
              L(
                "Full Name",
                "पूरा नाम"
              )}
          </h1>
        </div>

        <div className="mt-5">
          <MastheadRule theme={theme} />
        </div>

        {/* PHOTO + ABOUT */}
        <div className="mt-8 flex items-start gap-8 avoid-break">
          <PhotoInset
            theme={theme}
            doc={doc}
            L={L}
          />

          <div className="flex-1 pt-1">
            {aboutSection && cleanAbout && (
              <>
                <p
                  className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em]"
                  style={{
                    color: theme.secondary,
                  }}
                >
                  {L("About Me", "परिचय")}
                </p>

                <p className="text-[14px] leading-[1.8] text-justify">
                  <span
                    className="float-left pr-2 pt-1 text-[52px] font-bold leading-[40px]"
                    style={{
                      fontFamily: heading,
                      color: theme.primary,
                    }}
                  >
                    {firstChar}
                  </span>

                  {restOfAbout}
                </p>
              </>
            )}
          </div>
        </div>

        {/* PARTICULARS */}
        {gridSections.length > 0 && (
          <div className="mt-11">
            <SectionDivider
              theme={theme}
              number={1}
              title={L(
                "Personal Particulars",
                "व्यक्तिगत विवरण"
              )}
              heading={heading}
            />

            <div className="grid grid-cols-2 gap-x-10 gap-y-0 pl-9">
              {gridSections.map((section) => (
                <div
                  key={section.id}
                  className="avoid-break pt-7"
                >
                  <h3
                    className="mb-3 border-b pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{
                      color: theme.secondary,
                      borderColor: theme.border,
                      fontFamily: heading,
                    }}
                  >
                    {lang === "hi"
                      ? section.titleHi ||
                        section.titleEn
                      : section.titleEn}
                  </h3>

                  <div className="space-y-2.5">
                    {section.fields.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-baseline gap-2 text-[11.5px]"
                      >
                        <span
                          className="shrink-0"
                          style={{
                            color: theme.secondary,
                            opacity: 0.8,
                          }}
                        >
                          {lang === "hi"
                            ? f.labelHi ||
                              f.labelEn
                            : f.labelEn}
                        </span>

                        <span
                          className="h-px flex-1"
                          style={{
                            backgroundColor:
                              theme.border,
                            opacity: 0.55,
                          }}
                        />

                        <span className="text-right font-medium">
                          {f.value?.trim()
                            ? f.value
                            : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OTHER PARAGRAPHS */}
        {restParagraphs.length > 0 && (
          <div className="mt-11">
            <SectionDivider
              theme={theme}
              number={2}
              title={L(
                "Additional Information",
                "अतिरिक्त जानकारी"
              )}
              heading={heading}
            />

            <div className="grid grid-cols-2 gap-x-10 gap-y-8 pl-9">
              {restParagraphs.map((section) => (
                <div
                  key={section.id}
                  className="avoid-break"
                >
                  <h3
                    className="mb-2 border-b pb-1.5 text-[10px] font-bold uppercase tracking-[0.15em]"
                    style={{
                      color: theme.primary,
                      borderColor: theme.border,
                      fontFamily: heading,
                    }}
                  >
                    {lang === "hi"
                      ? section.titleHi ||
                        section.titleEn
                      : section.titleEn}
                  </h3>

                  <p
                    className="text-[12px] leading-[1.8] text-justify"
                    style={{ opacity: 0.86 }}
                  >
                    {(lang === "hi" &&
                      section.fields[0]?.valueHi) ||
                      section.fields[0]?.value ||
                      "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-12">
          <MastheadRule theme={theme} />

          <div className="mt-3 flex items-center justify-center gap-4">
            <span
              className="h-px w-16"
              style={{
                backgroundColor: theme.border,
              }}
            />

            <span
              className="text-[8px] font-semibold uppercase tracking-[0.28em]"
              style={{
                color: theme.secondary,
              }}
            >
              {L(
                "With Best Wishes",
                "शुभकामनाओं सहित"
              )}
            </span>

            <span
              className="h-px w-16"
              style={{
                backgroundColor: theme.border,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}