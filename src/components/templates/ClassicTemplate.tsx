import { forwardRef } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  bg: "#f7f5f1",
  card: "#ffffff",
  ink: "#22262b",
  muted: "#7c8590",
  primary: "#2f5d50",
  primarySoft: "#dce8e2",
  accent: "#c98a4b",
  line: "#e9e5dc",
};

const BlobBackground = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 794 1123"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="blob1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={palette.primary} stopOpacity="0.14" />
        <stop offset="100%" stopColor={palette.primary} stopOpacity="0" />
      </linearGradient>
      <linearGradient id="blob2" x1="1" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor={palette.accent} stopOpacity="0.12" />
        <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M794 -80 C 620 -20, 560 160, 700 260 C 840 360, 900 120, 794 -80 Z"
      fill="url(#blob1)"
    />
    <path
      d="M-80 1123 C 100 1000, 220 1123, 140 1200 C 20 1260, -180 1200, -80 1123 Z"
      fill="url(#blob2)"
    />
    <path
      d="M0 900 C 60 960, 40 1040, -40 1060"
      stroke={palette.primary}
      strokeOpacity="0.08"
      strokeWidth="90"
      fill="none"
    />
  </svg>
);

const IdentityRing = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" className="inline-block">
    <circle cx="4" cy="4" r="4" fill={palette.accent} />
  </svg>
);

const SoftDivider = () => (
  <div className="flex items-center gap-1.5 my-1">
    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: palette.accent }} />
    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: palette.accent, opacity: 0.5 }} />
    <span className="h-1 w-1 rounded-full" style={{ backgroundColor: palette.accent, opacity: 0.25 }} />
  </div>
);

const ClassicTemplate = forwardRef<
  HTMLDivElement,
  { doc: BiodataDocument; fonts: FontPack }
>(({ doc, fonts }, ref) => {
  const lang = doc.language;
  const L = (en: string, hi: string) => (lang === "hi" ? hi : en);
  const heading = fonts.heading || "'Playfair Display', 'Noto Serif Devanagari', serif";
  const body = fonts.body || "'Inter', 'Noto Sans Devanagari', sans-serif";
  const visibleSections = doc.sections.filter((s) => s.visible);
  const gridSections = visibleSections.filter((s) => s.type === "grid");
  const paragraphSections = visibleSections.filter((s) => s.type === "paragraph");
  const aboutSection = paragraphSections.find((s) => /about/i.test(s.titleEn)) ?? paragraphSections[0];
  const restParagraphs = paragraphSections.filter((s) => s !== aboutSection);

  return (
    <div
      ref={ref}
      className="relative a4-page w-[210mm] min-h-[297mm] overflow-hidden"
      style={{ backgroundColor: palette.bg, color: palette.ink, fontFamily: body }}
    >
      <BlobBackground />

      <div className="relative px-16 pt-14 pb-16">
        {/* Identity card */}
        <div
          className="flex items-center gap-7 rounded-[28px] px-9 py-7 avoid-break"
          style={{ backgroundColor: palette.card, boxShadow: "0 8px 30px rgba(34,38,43,0.06)", border: `1px solid ${palette.line}` }}
        >
          <div className="relative shrink-0">
            <div
              className="w-[112px] h-[112px] rounded-full overflow-hidden"
              style={{ border: `4px solid ${palette.card}`, boxShadow: `0 0 0 2px ${palette.primarySoft}` }}
            >
              {doc.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-[10px] text-center"
                  style={{ color: palette.muted, backgroundColor: palette.primarySoft }}
                >
                  {L("Photo", "फोटो")}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {doc.invocation.enabled && (
              <p
                className="text-[11px] tracking-[0.15em] uppercase mb-1.5 flex items-center gap-1.5"
                style={{ color: palette.accent }}
              >
                <IdentityRing /> {doc.invocation.text}
              </p>
            )}
            <h1
              className="text-[32px] leading-tight font-semibold truncate"
              style={{ fontFamily: heading, color: palette.ink }}
            >
              {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
            </h1>
            <p
              className="mt-1.5 inline-block text-[11px] tracking-[0.2em] uppercase px-3 py-1 rounded-full"
              style={{ backgroundColor: palette.primarySoft, color: palette.primary }}
            >
              {L("Marriage Biodata", "विवाह हेतु बायोडाटा")}
            </p>
          </div>
        </div>

        {/* About */}
        {aboutSection && (
          <div
            className="mt-6 rounded-[20px] px-8 py-5 avoid-break"
            style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}
          >
            <p className="text-[14.5px] leading-relaxed" style={{ color: palette.ink, opacity: 0.82 }}>
              {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
            </p>
          </div>
        )}

        {/* Grid sections as cards */}
        <div className="mt-6 grid grid-cols-2 gap-5">
          {gridSections.map((section) => (
            <div
              key={section.id}
              className="avoid-break rounded-[20px] px-7 py-6"
              style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}`, boxShadow: "0 4px 16px rgba(34,38,43,0.03)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <h2
                  className="text-[13px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: palette.primary, fontFamily: heading }}
                >
                  {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                </h2>
              </div>
              <SoftDivider />
              <div className="mt-2 space-y-2 text-[13px]">
                {section.fields.map((f) => (
                  <div key={f.id} className="flex justify-between items-baseline gap-3 avoid-break">
                    <span style={{ color: palette.muted }}>
                      {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                    </span>
                    <span className="text-right font-medium" style={{ color: palette.ink }}>
                      {f.value?.trim() ? f.value : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Remaining paragraph sections */}
        {restParagraphs.length > 0 && (
          <div className="mt-5 space-y-5">
            {restParagraphs.map((section) => (
              <div
                key={section.id}
                className="avoid-break rounded-[20px] px-8 py-6"
                style={{ backgroundColor: palette.card, border: `1px solid ${palette.line}` }}
              >
                <h2
                  className="text-[13px] font-semibold uppercase tracking-[0.14em] mb-1"
                  style={{ color: palette.primary, fontFamily: heading }}
                >
                  {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                </h2>
                <SoftDivider />
                <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: palette.ink, opacity: 0.85 }}>
                  {(lang === "hi" && section.fields[0]?.valueHi) || section.fields[0]?.value || "—"}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="h-px w-16" style={{ backgroundColor: palette.line }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: palette.accent }} />
          <span className="h-px w-16" style={{ backgroundColor: palette.line }} />
        </div>
      </div>
    </div>
  );
});

ClassicTemplate.displayName = "ClassicTemplate";
export default ClassicTemplate;