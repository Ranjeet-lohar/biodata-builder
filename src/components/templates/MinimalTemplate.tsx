import { forwardRef } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

const MinimalTemplate = forwardRef<
  HTMLDivElement,
  { doc: BiodataDocument; fonts: FontPack }
>(({ doc, fonts }, ref) => {
  const lang = doc.language;
  const L = (en: string, hi: string) => (lang === "hi" ? hi : en);
  const heading = fonts.heading || "'Inter', 'Noto Sans Devanagari', sans-serif";
  const body = fonts.body || "'Inter', 'Noto Sans Devanagari', sans-serif";
  const visibleSections = doc.sections.filter((s) => s.visible);
  const gridSections = visibleSections.filter((s) => s.type === "grid");
  const paragraphSections = visibleSections.filter((s) => s.type === "paragraph");

  const occupation = gridSections
    .flatMap((s) => s.fields)
    .find((f) => /occupation/i.test(f.labelEn))?.value;
  const cityField = gridSections.flatMap((s) => s.fields).find((f) => /^city$/i.test(f.labelEn))?.value;
  const stateField = gridSections.flatMap((s) => s.fields).find((f) => /^state$/i.test(f.labelEn))?.value;
  const phoneField = gridSections.flatMap((s) => s.fields).find((f) => /^phone$/i.test(f.labelEn))?.value;
  const emailField = gridSections.flatMap((s) => s.fields).find((f) => /^email$/i.test(f.labelEn))?.value;
  const aboutSection = paragraphSections.find((s) => /about/i.test(s.titleEn));

  return (
    <div ref={ref} className="relative a4-page w-[210mm] min-h-[297mm] bg-white text-[#22261f]" style={{ fontFamily: body }}>
      <div className="flex">
        <div className="w-[260px] shrink-0 bg-[#2f3a2b] min-h-[297mm] text-[#eef1e8] px-8 py-12 flex flex-col">
          <div className="w-[150px] h-[186px] bg-[#3f4a3a] overflow-hidden mb-6">
            {doc.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#eef1e8]/40 text-xs text-center px-3">
                {L("Photo", "फोटो")}
              </div>
            )}
          </div>
          {doc.invocation.enabled && (
            <p className="text-[11px] text-[#b9c2ab] mb-1">{doc.invocation.text}</p>
          )}
          <p className="uppercase text-[11px] tracking-[0.25em] text-[#b9c2ab]">{L("Marriage Biodata", "विवाह हेतु बायोडाटा")}</p>
          <h1 className="mt-1 text-3xl font-semibold leading-tight" style={{ fontFamily: heading }}>
            {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
          </h1>

          <div className="mt-10 space-y-4 text-[13px]">
            <div>
              <p className="text-[#b9c2ab] uppercase tracking-wide text-[10px]">{L("Occupation", "व्यवसाय")}</p>
              <p>{occupation || "—"}</p>
            </div>
            <div>
              <p className="text-[#b9c2ab] uppercase tracking-wide text-[10px]">{L("Location", "स्थान")}</p>
              <p>{cityField ? `${cityField}${stateField ? ", " + stateField : ""}` : "—"}</p>
            </div>
            <div>
              <p className="text-[#b9c2ab] uppercase tracking-wide text-[10px]">{L("Contact", "संपर्क")}</p>
              <p>{phoneField || "—"}</p>
              <p className="break-all">{emailField || ""}</p>
            </div>
          </div>

          <div className="mt-auto pt-10 text-[11px] text-[#b9c2ab] leading-relaxed">
            {(lang === "hi" && aboutSection?.fields[0]?.valueHi) || aboutSection?.fields[0]?.value || ""}
          </div>
        </div>

        <div className="flex-1 px-10 py-12">
          {gridSections.map((section, i) => (
            <div key={section.id} className={i > 0 ? "mt-8 avoid-break" : "avoid-break"}>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-[11px] font-semibold text-[#5b7c99] tracking-wide">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-[15px] font-semibold uppercase tracking-[0.12em] text-[#22261f]" style={{ fontFamily: heading }}>
                  {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                </h2>
              </div>
              <div className="border-t border-[#e4e4de]" />
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3 text-[13.5px]">
                {section.fields.map((f) => (
                  <div key={f.id} className="flex flex-col">
                    <span className="text-[#8b8f83] text-[11px]">
                      {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                    </span>
                    <span className="text-[#22261f]">{f.value?.trim() ? f.value : "—"}</span>
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
                  <span className="text-[11px] font-semibold text-[#5b7c99] tracking-wide">
                    {String(gridSections.length + i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-[15px] font-semibold uppercase tracking-[0.12em]" style={{ fontFamily: heading }}>
                    {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  </h2>
                </div>
                <div className="border-t border-[#e4e4de]" />
                <p className="mt-3 text-[13.5px] leading-relaxed text-[#22261f]">
                  {(lang === "hi" && section.fields[0]?.valueHi) || section.fields[0]?.value || "—"}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
});

MinimalTemplate.displayName = "MinimalTemplate";
export default MinimalTemplate;
