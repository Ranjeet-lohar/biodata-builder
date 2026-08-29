import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";
import { Theme } from "./theme";
import { photoShapeClass } from "./Motifs";

function GeoBackground({ theme }: { theme: Theme }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 0 0 694 1435"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="triGrid" width="80" height="70" patternUnits="userSpaceOnUse">
          <path
            d="M40 0 L80 70 L0 70 Z"
            fill="none"
            stroke={theme.primary}
            strokeWidth="0.5"
            opacity="0.08"
          />
        </pattern>
        <linearGradient id="edgeFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={theme.bg} stopOpacity="0" />
          <stop offset="88%" stopColor={theme.bg} stopOpacity="0" />
          <stop offset="100%" stopColor={theme.bg} stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="794" height="1123" fill="url(#triGrid)" />
      <rect width="794" height="1123" fill="url(#edgeFade)" />
      {/* top-right accent triangle cluster */}
      <path d="M794 0 L794 160 L634 0 Z" fill={theme.primary} opacity="0.05" />
      <path d="M794 0 L794 90 L704 0 Z" fill={theme.secondary} opacity="0.08" />
    </svg>
  );
}

function HexFrame({ theme, children }: { theme: Theme; children: React.ReactNode }) {
 return (
  <div className="relative w-[160px] h-[176px]">
    <svg className="absolute inset-0" viewBox="0 0 160 176" fill="none">
      <polygon
        points="80,2 156,44 156,132 80,174 4,132 4,44"
        fill="none"
        stroke={theme.primary}
        strokeWidth="2"
      />
      <polygon
        points="80,12 146,50 146,126 80,164 14,126 14,50"
        fill="none"
        stroke={theme.secondary}
        strokeWidth="0.75"
        opacity="0.6"
      />
    </svg>
    <div
      className="absolute inset-[14px] overflow-hidden bg-white"
      style={{ clipPath: "polygon(50% 0%, 97.5% 25%, 97.5% 75%, 50% 100%, 2.5% 75%, 2.5% 25%)" }}
    >
      {children}
    </div>
  </div>
);
}

function TimelineNode({ theme }: { theme: Theme }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0">
      <circle cx="10" cy="10" r="9" fill={theme.bg} stroke={theme.primary} strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3.5" fill={theme.primary} />
    </svg>
  );
}

export default function TimelineLayout({
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
  const aboutSection = visibleSections.find((s) => s.type === "paragraph" && /about/i.test(s.titleEn));
  const otherSections = visibleSections.filter((s) => s !== aboutSection);

  return (
    <div
      className="relative a4-page w-[210mm] min-h-[297mm] overflow-hidden"
      style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: body }}
    >
      <GeoBackground theme={theme} />

      <div className="relative px-20 pt-16 pb-16">
        {/* Header */}
        <div className="flex items-center gap-8 avoid-break">
          <HexFrame theme={theme}>
            {doc.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: theme.primary, opacity: 0.5 }}>
                {L("Photo", "फोटो")}
              </div>
            )}
          </HexFrame>

          <div>
            {doc.invocation.enabled && (
              <p className="text-[12px] tracking-[0.2em] uppercase mb-2" style={{ color: theme.secondary }}>
                {doc.invocation.text}
              </p>
            )}
            <h1 className="text-[34px] font-semibold leading-tight" style={{ fontFamily: heading, color: theme.primary }}>
              {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-[2px] w-8" style={{ backgroundColor: theme.primary }} />
              <p className="text-[12px] tracking-[0.3em] uppercase" style={{ color: theme.secondary }}>
                {L("Marriage Biodata", "विवाह हेतु बायोडाटा")}
              </p>
            </div>
          </div>
        </div>

        {aboutSection && (
          <p className="mt-6 text-[15px] leading-relaxed max-w-[560px] italic avoid-break" style={{ opacity: 0.82 }}>
            {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
          </p>
        )}

        {/* Timeline body */}
        <div className="relative mt-12">
          {/* vertical connecting line */}
          <div
            className="absolute left-[9px] top-2 bottom-2 w-px"
            style={{ backgroundColor: theme.border }}
          />

          <div className="space-y-8">
            {otherSections.map((section) =>
              section.type === "grid" ? (
                <div key={section.id} className="relative pl-10 avoid-break">
                  <div className="absolute left-0 top-0">
                    <TimelineNode theme={theme} />
                  </div>
                  <h2 className="text-[18px] font-semibold mb-3 leading-5" style={{ color: theme.primary, fontFamily: heading }}>
                    {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  </h2>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-[14.5px]">
                    {section.fields.map((f) => (
                      <div key={f.id} className="flex gap-2 avoid-break">
                        <span className="w-[46%] shrink-0 font-medium" style={{ color: theme.secondary }}>
                          {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                        </span>
                        <span>{f.value?.trim() ? f.value : "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={section.id} className="relative pl-10 avoid-break">
                  <div className="absolute left-0 top-0">
                    <TimelineNode theme={theme} />
                  </div>
                  <h2 className="text-[18px] font-semibold mb-2" style={{ color: theme.primary, fontFamily: heading }}>
                    {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  </h2>
                  <p className="text-[14.5px] leading-relaxed max-w-[560px]">
                    {(lang === "hi" && section.fields[0]?.valueHi) || section.fields[0]?.value || "—"}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}