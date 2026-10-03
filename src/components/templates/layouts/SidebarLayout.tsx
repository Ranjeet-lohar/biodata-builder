import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";
import { Theme } from "./theme";
import { photoShapeClass } from "./Motifs";

/**
 * Scallop (fish-scale) pattern for the colored sidebar.
 * Drawn in the page background color on top of theme.primary.
 * Each tile is 20x20 and every arc stays inside its tile, so there are
 * no clipping seams (safe for html2canvas capture).
 */
function SidebarPattern({
  theme,
  opacity = 0.18,
}: {
  theme: Theme;
  opacity?: number;
}) {
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    >
      <defs>
        <pattern id="pat-scallop" width="20" height="20" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={theme.bg} strokeWidth={0.7}>
            {/* Row A: arches centered on x = 0 and x = 20, base at y = 10 */}
            <path d="M-10,10 A10,10 0 0 1 10,10" />
            <path d="M-6.5,10 A6.5,6.5 0 0 1 6.5,10" />
            <path d="M-3,10 A3,3 0 0 1 3,10" />
            <path d="M10,10 A10,10 0 0 1 30,10" />
            <path d="M13.5,10 A6.5,6.5 0 0 1 26.5,10" />
            <path d="M17,10 A3,3 0 0 1 23,10" />
            {/* Row B: offset arch centered on x = 10, base at y = 20 */}
            <path d="M0,20 A10,10 0 0 1 20,20" />
            <path d="M3.5,20 A6.5,6.5 0 0 1 16.5,20" />
            <path d="M7,20 A3,3 0 0 1 13,20" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pat-scallop)" opacity={opacity} />
    </svg>
  );
}

/**
 * Hexagon grid for the main content area.
 * Strongest in the top-right corner, fading out toward the rest of the page
 * so text stays readable.
 */
function ContentPattern({
  theme,
  opacity = 0.12,
}: {
  theme: Theme;
  opacity?: number;
}) {
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    >
      <defs>
        <pattern id="pat-hex" width="17.32" height="30" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={theme.primary} strokeWidth={0.6}>
            {/* Full hexagon centered in the tile */}
            <path d="M8.66,0 L17.32,5 L17.32,15 L8.66,20 L0,15 L0,5 Z" />
            {/* Pieces of the offset neighbours */}
            <path d="M0,15 L8.66,20 L8.66,30" />
            <path d="M17.32,15 L8.66,20" />
          </g>
        </pattern>

        <radialGradient id="pat-hex-fade" cx="100%" cy="0%" r="90%">
          <stop offset="0%" stopColor={theme.bg} stopOpacity="0" />
          <stop offset="60%" stopColor={theme.bg} stopOpacity="0.8" />
          <stop offset="100%" stopColor={theme.bg} stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#pat-hex)" opacity={opacity} />
      <rect width="100%" height="100%" fill="url(#pat-hex-fade)" />
    </svg>
  );
}

export default function SidebarLayout({
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
  const gridSections = visibleSections.filter((s) => s.type === "grid");
  const paragraphSections = visibleSections.filter((s) => s.type === "paragraph");

  const occupation = gridSections.flatMap((s) => s.fields).find((f) => /occupation/i.test(f.labelEn))?.value;
  const cityField = gridSections.flatMap((s) => s.fields).find((f) => /^city$/i.test(f.labelEn))?.value;
  const stateField = gridSections.flatMap((s) => s.fields).find((f) => /^state$/i.test(f.labelEn))?.value;
  const phoneField = gridSections.flatMap((s) => s.fields).find((f) => /^phone$/i.test(f.labelEn))?.value;
  const emailField = gridSections.flatMap((s) => s.fields).find((f) => /^email$/i.test(f.labelEn))?.value;
  const aboutSection = paragraphSections.find((s) => /about/i.test(s.titleEn));

  return (
    <div
      className="relative a4-page w-[210mm] min-h-[297mm]"
      style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: body }}
    >
      <div className="flex">
        {/* Sidebar */}
        <div
          className="relative overflow-hidden w-[260px] shrink-0"
          style={{ backgroundColor: theme.primary, color: theme.bg }}
        >
          <SidebarPattern theme={theme} />

          <div className="relative px-8 py-12 flex flex-col min-h-[297mm]">
            <div
              className={`w-[150px] h-[186px] overflow-hidden mb-6 ${photoShapeClass(theme.photoShape)}`}
              style={{ backgroundColor: theme.secondary }}>
              {doc.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-center px-3" style={{ opacity: 0.5 }}>
                  {L("Photo", "फोटो")}
                </div>
              )}
            </div>
            {doc.invocation.enabled && (
              <p className="text-[11px] mb-1" style={{ opacity: 0.75 }}>{doc.invocation.text}</p>
            )}
            <p className="uppercase text-[11px] tracking-[0.25em]" style={{ opacity: 0.75 }}>
              {L("Marriage Biodata", "विवाह हेतु बायोडाटा")}
            </p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight" style={{ fontFamily: heading }}>
              {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
            </h1>

            <div className="mt-10 space-y-4 text-[13px]">
              <div>
                <p className="uppercase tracking-wide text-[10px]" style={{ opacity: 0.7 }}>{L("Occupation", "व्यवसाय")}</p>
                <p>{occupation || "—"}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide text-[10px]" style={{ opacity: 0.7 }}>{L("Location", "स्थान")}</p>
                <p>{cityField ? `${cityField}${stateField ? ", " + stateField : ""}` : "—"}</p>
              </div>
              <div>
                <p className="uppercase tracking-wide text-[10px]" style={{ opacity: 0.7 }}>{L("Contact", "संपर्क")}</p>
                <p>{phoneField || "—"}</p>
                <p className="break-all">{emailField || ""}</p>
              </div>
            </div>

            <div className="mt-auto pt-10 text-[11px] leading-relaxed" style={{ opacity: 0.75 }}>
              {(lang === "hi" && aboutSection?.fields[0]?.valueHi) || aboutSection?.fields[0]?.value || ""}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative flex-1">
          <ContentPattern theme={theme} />

          <div className="relative px-10 py-12">
            {gridSections.map((section, i) => (
              <div key={section.id} className={i > 0 ? "mt-8 avoid-break" : "avoid-break"}>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-[11px] font-semibold tracking-wide" style={{ color: theme.primary }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-[15px] font-semibold uppercase tracking-[0.12em]" style={{ fontFamily: heading }}>
                    {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  </h2>
                </div>
                <div className="border-t" style={{ borderColor: theme.border }} />
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3 text-[13.5px]">
                  {section.fields.map((f) => (
                    <div key={f.id} className="flex flex-col">
                      <span className="text-[11px]" style={{ color: theme.secondary }}>
                        {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                      </span>
                      <span>{f.value?.trim() ? f.value : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {paragraphSections
              .filter((s) => s !== aboutSection)
              .map((section, i) => (
                <div key={section.id} className="mt-8 avoid-break">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-[11px] font-semibold tracking-wide" style={{ color: theme.primary }}>
                      {String(gridSections.length + i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-[15px] font-semibold uppercase tracking-[0.12em]" style={{ fontFamily: heading }}>
                      {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                    </h2>
                  </div>
                  <div className="border-t" style={{ borderColor: theme.border }} />
                  <p className="mt-3 text-[13.5px] leading-relaxed">
                    {(lang === "hi" && section.fields[0]?.valueHi) || section.fields[0]?.value || "—"}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}