import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";
import { Theme } from "./theme";
import { photoShapeClass } from "./Motifs";

function StatUnit({
  theme,
  label,
  value,
  last = false,
}: {
  theme: Theme;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className="flex flex-col px-6 first:pl-0"
      style={{
        borderRight: last ? "none" : `1px solid ${theme.border}`,
      }}
    >
      <span
        className="text-[9.5px] tracking-[0.14em] uppercase font-semibold mb-1"
        style={{ color: theme.secondary, opacity: 0.75 }}
      >
        {label}
      </span>
      <span className="text-[15px] font-medium" style={{ color: theme.text }}>
        {value?.trim() ? value : "—"}
      </span>
    </div>
  );
}

function SectionBlock({
  theme,
  heading,
  className = "",
  children,
}: {
  theme: Theme;
  heading: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`pt-8 first:pt-0 ${className}`}>
      <div className="flex items-baseline gap-3 mb-5">
        <h2
          className="text-[11.5px] font-semibold tracking-[0.18em] uppercase"
          style={{ color: theme.primary }}
        >
          {heading}
        </h2>
        <span className="flex-1 h-px" style={{ backgroundColor: theme.border }} />
      </div>
      {children}
    </div>
  );
}

export default function ModernMinimalLayout({
  doc,
  fonts,
  theme,
}: {
  doc: BiodataDocument;
  fonts: FontPack;
  theme: Theme;
}) {
  const lang = doc.language;
  const L = (en: string, hi: string) => (lang === "hi" ? hi : en);
  const heading = fonts.heading || theme.headingFont;
  const body = fonts.body || theme.bodyFont;
  const visibleSections = doc.sections.filter((s) => s.visible);
  const aboutSection = visibleSections.find(
    (s) => s.type === "paragraph" && /about/i.test(s.titleEn)
  );
  const restSections = visibleSections.filter((s) => s !== aboutSection);

  const isRichTextEmpty = (html?: string) => {
    if (!html) return true;
    const stripped = html.replace(/<[^>]*>/g, "").trim();
    return stripped.length === 0;
  };

  const aboutValue =
    (lang === "hi" && aboutSection?.fields[0]?.valueHi) ||
    aboutSection?.fields[0]?.value ||
    "";

  // Up to 5 key facts surface in the stat strip under the letterhead rule
  const firstGrid = restSections.find((s) => s.type === "grid");
  const headerStats = (firstGrid?.fields ?? []).slice(0, 5);
  const otherSections = restSections.filter((s) => s !== firstGrid);

  return (
    <div
      className="relative a4-page w-[210mm] min-h-[297mm]"
      style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: body }}
    >
      {/* Letterhead */}
      <div className="px-16 pt-14 pb-8 flex items-start justify-between gap-10">
        <div className="flex-1 min-w-0">
          {doc.invocation.enabled && (
            <p
              className="text-[11px] tracking-[0.3em] uppercase mb-4 font-medium"
              style={{ color: theme.secondary, opacity: 0.7 }}
            >
              {doc.invocation.text}
            </p>
          )}
          <p
            className="text-[10.5px] tracking-[0.28em] uppercase mb-2 font-semibold"
            style={{ color: theme.primary }}
          >
            {L("Marriage Biodata", "विवाह हेतु बायोडाटा")}
          </p>
          <h1
            className="text-[46px] leading-[1.05] font-bold tracking-tight"
            style={{ fontFamily: heading, color: theme.text }}
          >
            {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
          </h1>
        </div>

        {/* Photo: quiet rectangle, hairline border, no shadow */}
        <div className="shrink-0">
          <div
            className={`w-[118px] h-[148px] overflow-hidden bg-white ${photoShapeClass(
              theme.photoShape
            )}`}
            style={{ border: `1px solid ${theme.border}` }}
          >
            {doc.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-xs text-center px-2"
                style={{ color: theme.secondary, opacity: 0.5 }}
              >
                {L("Photograph", "फोटो")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signature rule + stat strip, like a boarding-pass detail line */}
      <div className="px-16">
        <div className="h-[2px] w-full mb-6" style={{ backgroundColor: theme.primary }} />
        {headerStats.length > 0 && (
          <div className="flex flex-wrap pb-8" style={{ borderBottom: `1px solid ${theme.border}` }}>
            {headerStats.map((f, i) => (
              <StatUnit
                key={f.id}
                theme={theme}
                label={lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                value={f.value}
                last={i === headerStats.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-16 pt-2 pb-14">
        {aboutSection && !isRichTextEmpty(aboutValue) && (
          <div className="mt-1 pl-5 " style={{ borderLeft: `2px solid ${theme.border}` }}>
            <div
              className="text-[15.5px] leading-[1.75] italic rich-text-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 last:[&_p]:mb-0"
              style={{ opacity: 0.85 }}
              dangerouslySetInnerHTML={{ __html: aboutValue }}
            />
          </div>
        )}

        {firstGrid && headerStats.length === 0 && (
          <SectionBlock
            theme={theme}
            heading={lang === "hi" ? firstGrid.titleHi || firstGrid.titleEn : firstGrid.titleEn}
            className="avoid-break"
          >
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              {firstGrid.fields.map((f) => (
                <div key={f.id} className="flex flex-col avoid-break">
                  <span
                    className="text-[10px] tracking-[0.1em] uppercase font-semibold"
                    style={{ color: theme.secondary, opacity: 0.7 }}
                  >
                    {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                  </span>
                  <span className="text-[14.5px] mt-1 font-medium">
                    {f.value?.trim() ? f.value : "—"}
                  </span>
                </div>
              ))}
            </div>
          </SectionBlock>
        )}

        {otherSections.map((section) => {
          const sectionValue =
            (lang === "hi" && section.fields[0]?.valueHi) ||
            section.fields[0]?.value ||
            "";

          return (
            <SectionBlock
              key={section.id}
              theme={theme}
              heading={lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
              className="avoid-break"
            >
              {section.type === "grid" ? (
                <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                  {section.fields.map((f) => (
                    <div key={f.id} className="flex flex-col avoid-break">
                      <span
                        className="text-[10px] tracking-[0.1em] uppercase font-semibold"
                        style={{ color: theme.secondary, opacity: 0.7 }}
                      >
                        {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                      </span>
                      <span className="text-[14.5px] mt-1 font-medium">
                        {f.value?.trim() ? f.value : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  {!isRichTextEmpty(sectionValue) ? (
                    <div
                      className="text-[14.5px] leading-[1.75] rich-text-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 last:[&_p]:mb-0"
                      dangerouslySetInnerHTML={{ __html: sectionValue }}
                    />
                  ) : (
                    <p className="text-[14.5px] leading-[1.75]">—</p>
                  )}
                </div>
              )}
            </SectionBlock>
          );
        })}
      </div>
    </div>
  );
}