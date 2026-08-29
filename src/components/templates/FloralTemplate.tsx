import { forwardRef } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const palette = {
  bg: "#ffffff",
  sidebar: "#2e2a26",
  sidebarText: "#f3ede6",
  ink: "#28221f",
  accent: "#c17a4e",
  accentSoft: "#e8c9a8",
  line: "#e7e0d8",
  label: "#8f857a",
};

const SidebarPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 260 1123"
    preserveAspectRatio="none"
  >
    <defs>
      <pattern id="sidebarLines" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="26" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" />
      </pattern>
      <linearGradient id="sidebarFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c17a4e" stopOpacity="0.16" />
        <stop offset="45%" stopColor="#c17a4e" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="260" height="1123" fill="url(#sidebarLines)" />
    <rect width="260" height="1123" fill="url(#sidebarFade)" />
  </svg>
);

const PortraitFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-[168px] h-[168px]">
    <svg className="absolute -inset-3 pointer-events-none" viewBox="0 0 192 192" fill="none">
      <circle cx="96" cy="96" r="94" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1" />
      <circle cx="96" cy="2" r="2.5" fill="#c17a4e" />
      <circle cx="96" cy="190" r="2.5" fill="#c17a4e" />
      <circle cx="2" cy="96" r="2.5" fill="#c17a4e" />
      <circle cx="190" cy="96" r="2.5" fill="#c17a4e" />
    </svg>
    <div className="relative w-full h-full rounded-full overflow-hidden bg-[#3a352f]">{children}</div>
  </div>
);

const RowIcon = () => (
  <svg width="6" height="6" viewBox="0 0 6 6" className="shrink-0 mt-[7px]">
    <circle cx="3" cy="3" r="3" fill="#c17a4e" opacity="0.8" />
  </svg>
);

// Fixed page geometry — do NOT rely on flex-1 to size the main column.
// html2canvas/jsPDF-style capture pipelines frequently fail to resolve
// flex-grow widths on cloned/offscreen nodes, which collapses this
// column to 0 width and drops it from the exported PDF entirely.
const PAGE_WIDTH_MM = 210;
const SIDEBAR_WIDTH_MM = 68;
const MAIN_WIDTH_MM = PAGE_WIDTH_MM - SIDEBAR_WIDTH_MM;

const FloralTemplate = forwardRef<
HTMLDivElement,
  { doc: BiodataDocument; fonts: FontPack }
>(({ doc, fonts }, ref) => {
  const lang = doc.language;
  const L = (en: string, hi: string) => (lang === "hi" ? hi : en);
  const heading = fonts.heading || "'Playfair Display', 'Noto Serif Devanagari', serif";
  const body = fonts.body || "'Cormorant Garamond', 'Noto Serif Devanagari', serif";
  const visibleSections = doc.sections.filter((s) => s.visible);
  const aboutSection = visibleSections.find((s) => s.type === "paragraph" && /about/i.test(s.titleEn));
  const otherSections = visibleSections.filter((s) => s !== aboutSection);

  return (
    <div
      ref={ref}
      className="relative a4-page flex overflow-hidden"
      style={{
        width: `${PAGE_WIDTH_MM}mm`,
        minHeight: "297mm",
        backgroundColor: palette.bg,
        color: palette.ink,
        fontFamily: body,
        boxSizing: "border-box",
      }}
    >
      {/* Sidebar */}
      <div
        className="relative shrink-0 px-8 pt-16 pb-10 flex flex-col items-center"
        style={{
          width: `${SIDEBAR_WIDTH_MM}mm`,
          backgroundColor: palette.sidebar,
          color: palette.sidebarText,
          boxSizing: "border-box",
        }}
      >
        <SidebarPattern />

        <div className="relative avoid-break">
          <PortraitFrame>
            {doc.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] opacity-50">
                {L("Photo", "फोटो")}
              </div>
            )}
          </PortraitFrame>
        </div>

        <div className="relative mt-8 text-center avoid-break">
          {doc.invocation.enabled && (
            <p
              className="text-[11px] tracking-[0.2em] uppercase mb-3"
              style={{ color: palette.accentSoft }}
            >
              {doc.invocation.text}
            </p>
          )}
          <h1
            className="text-[26px] leading-tight font-semibold"
            style={{ fontFamily: heading }}
          >
            {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
          </h1>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-6" style={{ backgroundColor: palette.accentSoft, opacity: 0.5 }} />
            <p className="text-[11px] tracking-[0.3em] uppercase" style={{ color: palette.accentSoft }}>
              {L("Biodata", "बायोडाटा")}
            </p>
            <span className="h-px w-6" style={{ backgroundColor: palette.accentSoft, opacity: 0.5 }} />
          </div>
        </div>

        {aboutSection && (
          <p className="relative mt-8 text-[13.5px] leading-relaxed text-center opacity-80 avoid-break">
            {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
          </p>
        )}

        <div className="relative mt-auto pt-10">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.35">
            <circle cx="20" cy="20" r="14" stroke={palette.accentSoft} strokeWidth="1" />
            <circle cx="20" cy="20" r="4" fill={palette.accentSoft} />
          </svg>
        </div>
      </div>

      {/* Main content — explicit width instead of flex-1 */}
      <div
        className="relative px-14 pt-16 pb-14"
        style={{ width: `${MAIN_WIDTH_MM}mm`, boxSizing: "border-box" }}
      >
        <div className="space-y-10">
          {otherSections.map((section, idx) =>
            section.type === "grid" ? (
              <div key={section.id} className="avoid-break">
                <div className="flex items-baseline gap-3 mb-4">
                  <span
                    className="text-[28px] font-light leading-none"
                    style={{ color: palette.accentSoft, fontFamily: heading }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2
                    className="text-[19px] font-semibold tracking-wide"
                    style={{ fontFamily: heading, color: palette.ink }}
                  >
                    {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  </h2>
                  <span className="flex-1 h-px ml-2" style={{ backgroundColor: palette.line }} />
                </div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-3 pl-10">
                  {section.fields.map((f) => (
                    <div key={f.id} className="flex gap-2 items-start avoid-break">
                      <RowIcon />
                      <div className="flex flex-col">
                        <span
                          className="text-[10.5px] tracking-[0.06em] uppercase"
                          style={{ color: palette.label }}
                        >
                          {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                        </span>
                        <span className="text-[15px]" style={{ color: palette.ink }}>
                          {f.value?.trim() ? f.value : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div key={section.id} className="avoid-break">
                <div className="flex items-baseline gap-3 mb-3">
                  <span
                    className="text-[28px] font-light leading-none"
                    style={{ color: palette.accentSoft, fontFamily: heading }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2
                    className="text-[19px] font-semibold tracking-wide"
                    style={{ fontFamily: heading, color: palette.ink }}
                  >
                    {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  </h2>
                  <span className="flex-1 h-px ml-2" style={{ backgroundColor: palette.line }} />
                </div>
                <p className="pl-10 text-[15px] leading-relaxed" style={{ color: palette.ink }}>
                  {(lang === "hi" && section.fields[0]?.valueHi) || section.fields[0]?.value || "—"}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
});

FloralTemplate.displayName = "FloralTemplate";
export default FloralTemplate;