import { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";

/*
  LumenGrid: light companion to QuantumGrid.
  Same page geometry and single-page "scale to fit" logic, so PDF export behaves the same.
  Adds: SVG gradient + hex-pattern backdrop, gradient ring portrait, and SVG icons
  chosen automatically from each section title and field label.
  No SVG <mask>, filter or backdrop-blur is used (safer for html2canvas / jsPDF capture).
*/

const palette = {
  bg: "#f5f8ff",
  panel: "#ffffff",
  ink: "#14233b",
  sub: "#5b6b86",
  line: "#dfe7f5",
  lineSoft: "#ebf0fa",
  label: "#7a89a6",
};

const accent = {
  blue: "#2f7bff",
  teal: "#14b8a6",
  violet: "#8b5cf6",
  amber: "#b7791f",
};

const gradH = `linear-gradient(90deg, ${accent.blue}, ${accent.teal})`;
const gradBrand = `linear-gradient(90deg, ${accent.blue}, ${accent.teal} 55%, ${accent.violet})`;
const gradChip = `linear-gradient(135deg, ${accent.blue}, ${accent.teal})`;

// Fixed page geometry: do NOT rely on flex-1/percent sizing for the page itself.
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const MIN_FIT_SCALE = 0.55;

/* ---------- Icons ---------- */
type IconName =
  | "user"
  | "users"
  | "calendar"
  | "ruler"
  | "cap"
  | "briefcase"
  | "pin"
  | "phone"
  | "mail"
  | "star"
  | "heart"
  | "home"
  | "quote"
  | "compass"
  | "diamond";

const ICON_PATHS: Record<IconName, string[]> = {
  user: ["M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z", "M4 20c1-4 4-6 8-6s7 2 8 6"],
  users: [
    "M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20",
    "M10 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
    "M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.3",
    "M15.5 4.2a3.5 3.5 0 0 1 0 6.6",
  ],
  calendar: ["M6 5h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z", "M3 10h18M8 3v4M16 3v4"],
  ruler: ["M3 17 17 3l4 4L7 21l-4-4Z", "M7 13l2 2M10 10l2 2M13 7l2 2"],
  cap: ["m2 9 10-5 10 5-10 5L2 9Z", "M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"],
  briefcase: ["M5.5 7h13A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-8A2.5 2.5 0 0 1 5.5 7Z", "M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 13h18"],
  pin: ["M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z", "M12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"],
  phone: ["M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"],
  mail: ["M5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9A2.5 2.5 0 0 1 5.5 5Z", "m3.5 7.5 8.5 6 8.5-6"],
  star: ["m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"],
  heart: ["M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"],
  home: ["M3 11 12 4l9 7", "M5 10v10h14V10", "M10 20v-6h4v6"],
  quote: ["M9 7C6 7.5 4 9.5 4 13.5 4 15.5 5 17 7 17c1.7 0 3-1.300 3-3s-1.300-3-3-3", "M19 7c-3 .5-5 2.500-5 6.500 0 2 1 3.500 3 3.500 1.700 0 3-1.300 3-3s-1.300-3-3-3"],
  compass: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z", "m15.5 8.5-2 5-5 2 2-5 5-2Z"],
  diamond: ["M12 3 21 12 12 21 3 12Z"],
};

const Icon = ({ name, className = "w-4 h-4" }: { name: IconName; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICON_PATHS[name].map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

/** Chooses an icon from an English field label. Order matters (family and place win over name/date). */
function fieldIcon(label: string): IconName {
  const l = label.toLowerCase();
  if (/(father|mother|brother|sister|sibling|family|parent|uncle)/.test(l)) return "users";
  if (/(place|address|city|location|native|residence|state|town|village)/.test(l)) return "pin";
  if (/(phone|mobile|whatsapp|contact)/.test(l)) return "phone";
  if (/mail/.test(l)) return "mail";
  if (/(birth|dob|date|age|time)/.test(l)) return "calendar";
  if (/(height|weight)/.test(l)) return "ruler";
  if (/(education|qualification|degree|college|school)/.test(l)) return "cap";
  if (/(occupation|profession|job|work|company|income|salary|designation|business)/.test(l)) return "briefcase";
  if (/(religion|caste|gotra|rashi|nakshatra|manglik|kundli|horoscope|zodiac|star)/.test(l)) return "star";
  if (/(hobby|hobbies|interest)/.test(l)) return "heart";
  if (/name/.test(l)) return "user";
  return "diamond";
}

/** Chooses an icon from an English section title. */
function sectionIcon(title: string): IconName {
  const l = title.toLowerCase();
  if (/(about|summary|introduction)/.test(l)) return "quote";
  if (/family/.test(l)) return "users";
  if (/(education|qualification)/.test(l)) return "cap";
  if (/(profession|career|occupation|work)/.test(l)) return "briefcase";
  if (/(contact|address)/.test(l)) return "pin";
  if (/(horoscope|kundli|religio|astro)/.test(l)) return "star";
  if (/(personal|basic|profile)/.test(l)) return "user";
  if (/(hobby|hobbies|interest)/.test(l)) return "heart";
  return "compass";
}

/* ---------- Page backdrop: gradient mesh, hex pattern, arcs ---------- */
const Backdrop = ({ uid }: { uid: string }) => {
  const W = 794;
  const H = 1123;
  const id = (n: string) => `lumen-${n}-${uid}`;
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id("base")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eaf2ff" />
          <stop offset="45%" stopColor="#fbfdff" />
          <stop offset="100%" stopColor="#edf6ff" />
        </linearGradient>
        <radialGradient id={id("blob-a")} cx="0.08" cy="0.04" r="0.5">
          <stop offset="0%" stopColor={accent.blue} stopOpacity="0.24" />
          <stop offset="100%" stopColor={accent.blue} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("blob-b")} cx="0.96" cy="0.16" r="0.45">
          <stop offset="0%" stopColor={accent.violet} stopOpacity="0.2" />
          <stop offset="100%" stopColor={accent.violet} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("blob-c")} cx="0.06" cy="0.98" r="0.5">
          <stop offset="0%" stopColor={accent.teal} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent.teal} stopOpacity="0" />
        </radialGradient>
        <pattern id={id("hex")} width="44" height="76" patternUnits="userSpaceOnUse">
          <polygon points="22,2 40,13 40,35 22,46 4,35 4,13" fill="none" stroke={accent.blue} strokeOpacity="0.12" strokeWidth="1" />
          <polygon points="22,40 40,51 40,73 22,84 4,73 4,51" fill="none" stroke={accent.blue} strokeOpacity="0.12" strokeWidth="1" />
        </pattern>
        {/* hides the pattern in the middle where the content sits (no mask needed) */}
        <linearGradient id={id("calm")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbfdff" stopOpacity="0" />
          <stop offset="30%" stopColor="#fbfdff" stopOpacity="0.92" />
          <stop offset="70%" stopColor="#fbfdff" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#fbfdff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id("base")})`} />
      <rect width={W} height={H} fill={`url(#${id("blob-a")})`} />
      <rect width={W} height={H} fill={`url(#${id("blob-b")})`} />
      <rect width={W} height={H} fill={`url(#${id("blob-c")})`} />
      <rect width={W} height={H} fill={`url(#${id("hex")})`} />
      <rect width={W} height={H} fill={`url(#${id("calm")})`} />
      <g fill="none">
        <g stroke={accent.blue} strokeOpacity="0.14">
          <circle cx={W} cy="0" r="110" />
          <circle cx={W} cy="0" r="150" strokeDasharray="2 6" strokeLinecap="round" />
          <circle cx={W} cy="0" r="190" />
        </g>
        <g stroke={accent.teal} strokeOpacity="0.18">
          <circle cx="0" cy={H} r="100" />
          <circle cx="0" cy={H} r="140" strokeDasharray="2 6" strokeLinecap="round" />
          <circle cx="0" cy={H} r="180" />
        </g>
      </g>
    </svg>
  );
};

/* ---------- Pieces ---------- */
const StatusBar = ({ code }: { code: string }) => (
  <div className="relative flex items-center gap-3 px-10 pt-[12px] pb-[7px]" style={{ borderBottom: `1px solid ${palette.line}` }}>
    <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full text-white" style={{ background: gradChip }}>
      <Icon name="compass" className="w-[11px] h-[11px]" />
    </span>
    <span className="text-[9px] tracking-[0.18em]" style={{ color: palette.sub, fontFamily: "monospace" }}>
      {code}
    </span>
    <span className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${palette.line}, transparent)` }} />
    <span
      className="flex items-center gap-[5px] text-[8.5px] tracking-[0.16em] px-2 py-[2px] rounded-full"
      style={{ color: "#0f8f82", backgroundColor: "#14b8a61a", border: "1px solid #14b8a64d", fontFamily: "monospace" }}
    >
      <span className="block w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accent.teal }} />
      ACTIVE
    </span>
  </div>
);

const RingPortrait = ({ children, uid }: { children: React.ReactNode; uid: string }) => {
  const gid = `lumen-ring-${uid}`;
  return (
    <div className="relative w-[126px] h-[126px] shrink-0">
      <svg className="absolute -inset-3 pointer-events-none" viewBox="0 0 216 216" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent.blue} />
            <stop offset="55%" stopColor={accent.teal} />
            <stop offset="100%" stopColor={accent.violet} />
          </linearGradient>
        </defs>
        <circle cx="108" cy="108" r="106" stroke={`url(#${gid})`} strokeWidth="2.5" />
        <circle cx="108" cy="108" r="96" stroke={accent.blue} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 6" />
        <circle cx="108" cy="108" r="88" stroke={palette.line} strokeWidth="1" />
        {[0, 90, 180, 270].map((deg) => (
          <line key={deg} x1="108" y1="0" x2="108" y2="12" stroke={`url(#${gid})`} strokeWidth="2" transform={`rotate(${deg} 108 108)`} />
        ))}
      </svg>
      <div
        className="relative w-full h-full rounded-full overflow-hidden"
        style={{ backgroundColor: palette.panel, border: `3px solid ${palette.panel}`, boxShadow: `0 0 0 1px ${palette.line}` }}
      >
        {children}
      </div>
    </div>
  );
};

const SectionTag = ({ icon, label, font }: { icon: IconName; label: string; font: string }) => (
  <div className="flex items-center gap-2 mb-[7px]">
    <span className="flex items-center justify-center w-[22px] h-[22px] rounded-[7px] text-white shrink-0" style={{ background: gradChip }}>
      <Icon name={icon} className="w-[13px] h-[13px]" />
    </span>
    <h2 className="text-[13.5px] leading-4 font-semibold tracking-wide" style={{ color: palette.ink, fontFamily: font }}>
      {label}
    </h2>
    <span className="flex-1 h-px ml-1" style={{ background: `linear-gradient(90deg, ${palette.line}, transparent)` }} />
    <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M5 0 10 5 5 10 0 5Z" fill={accent.teal} fillOpacity="0.8" />
    </svg>
  </div>
);

const FieldChip = ({ name }: { name: IconName }) => (
  <span
    className="flex items-center justify-center w-[22px] h-[22px] rounded-full shrink-0 mt-[1px]"
    style={{ backgroundColor: "#2f7bff14", color: accent.blue, border: "1px solid #2f7bff2e" }}
  >
    <Icon name={name} className="w-[12px] h-[12px]" />
  </span>
);

const LumenGridTemplate = forwardRef<HTMLDivElement, { doc: BiodataDocument; fonts: FontPack }>(({ doc, fonts }, ref) => {
  const uid = useId().replace(/:/g, "");
  const lang = doc.language;
  const L = (en: string, hi: string) => (lang === "hi" ? hi : en);
  const heading = fonts.heading || "'Space Grotesk', 'Noto Serif Devanagari', sans-serif";
  const body = fonts.body || "'Inter', 'Noto Serif Devanagari', sans-serif";
  const visibleSections = doc.sections.filter((s) => s.visible);
  const aboutSection = visibleSections.find((s) => s.type === "paragraph" && /about/i.test(s.titleEn));
  const otherSections = visibleSections.filter((s) => s !== aboutSection);

  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Measure natural (unscaled) content height against the printable area and
  // shrink to fit. Measuring at scale 1 every pass keeps the result stable.
  const fit = useCallback(() => {
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!frame || !content) return;

    content.style.transform = "scale(1)";
    const natural = content.scrollHeight;
    const available = frame.clientHeight;
    if (!natural || !available) return;

    const next = natural <= available ? 1 : Math.max(MIN_FIT_SCALE, available / natural);
    content.style.transform = `scale(${next})`;
    setScale(next);
  }, []);

  useLayoutEffect(() => {
    fit();
  });

  useEffect(() => {
    // Re-fit once webfonts finish loading: font swap changes metrics.
    if (typeof document !== "undefined" && "fonts" in document) {
      (document as Document & { fonts: FontFaceSet }).fonts.ready.then(fit).catch(() => {});
    }
    const ro = new ResizeObserver(fit);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [fit]);

  return (
    <div
      ref={ref}
      className="relative a4-page overflow-hidden"
      style={{
        width: `${PAGE_WIDTH_MM}mm`,
        height: `${PAGE_HEIGHT_MM}mm`,
        maxHeight: `${PAGE_HEIGHT_MM}mm`,
        backgroundColor: palette.bg,
        color: palette.ink,
        fontFamily: body,
        boxSizing: "border-box",
        pageBreakAfter: "avoid",
        breakAfter: "avoid",
      }}
    >
      {/* Solid background layer as its own child: .a4-page forces a white background
          with !important, which would beat the root's inline style. */}
      <div className="absolute inset-0" style={{ backgroundColor: palette.bg }} />
      <Backdrop uid={uid} />

      {/* Gradient edge strips live on the page layer, outside the scaled wrapper */}
      <div className="absolute top-0 left-0 w-full h-[5px]" style={{ background: gradBrand }} />
      <div className="absolute bottom-0 left-0 w-full h-[5px]" style={{ background: gradBrand }} />

      <div ref={frameRef} className="relative w-full h-full overflow-hidden">
        <div
          ref={contentRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            // Widen the wrapper as it shrinks so the layout still fills the page edge to edge.
            width: `${100 / scale}%`,
          }}
        >
          <StatusBar code={L("REC / MATRIMONIAL PROFILE", "रिकॉर्ड / वैवाहिक प्रोफ़ाइल")} />

          {/* Header */}
          <div className="relative px-10 pt-6 pb-5 flex items-center gap-6">
            <RingPortrait uid={uid}>
              {doc.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-[10px]" style={{ color: palette.sub }}>
                  <Icon name="user" className="w-6 h-6" />
                  {L("Photo", "फोटो")}
                </div>
              )}
            </RingPortrait>

            <div className="flex-1 min-w-0">
              {doc.invocation.enabled && (
                <p className="text-[9.5px] tracking-[0.28em] mb-[6px]" style={{ color: accent.amber, fontFamily: "monospace" }}>
                  {doc.invocation.text}
                </p>
              )}
              <h1 className="text-[27px] leading-tight font-bold truncate" style={{ fontFamily: heading, color: palette.ink }}>
                {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
              </h1>
              <div className="mt-[7px] flex items-center gap-2">
                <span className="h-[3px] w-10 rounded-full" style={{ background: gradH }} />
                <p className="text-[9.5px] tracking-[0.22em]" style={{ color: palette.sub, fontFamily: "monospace" }}>
                  {L("Biodata File", "बायोडाटा फ़ाइल")}
                </p>
              </div>
            </div>
          </div>

          {aboutSection && (
            <div className="relative px-10 pb-5">
              <div
                className="relative pl-5 pr-4 py-3 text-[11.5px] leading-snug rounded-[8px] overflow-hidden"
                style={{ backgroundColor: palette.panel, border: `1px solid ${palette.line}`, color: palette.sub }}
              >
                <span className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ background: "linear-gradient(180deg, #2f7bff, #14b8a6)" }} />
                <span className="flex items-center gap-[6px] text-[8.5px] tracking-[0.18em] mb-[6px]" style={{ color: accent.blue, fontFamily: "monospace" }}>
                  <Icon name="quote" className="w-[11px] h-[11px]" />
                  {L("// SUMMARY", "// सारांश")}
                </span>
                {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
              </div>
            </div>
          )}

          {/* Sections */}
          <div className="relative px-10 pb-8 space-y-4">
            {otherSections.map((section) =>
              section.type === "grid" ? (
                <div key={section.id}>
                  <SectionTag
                    icon={sectionIcon(section.titleEn)}
                    font={heading}
                    label={lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  />
                  <div
                    className="grid grid-cols-2 gap-x-6 gap-y-[8px] px-4 py-3 rounded-[8px]"
                    style={{ backgroundColor: palette.panel, border: `1px solid ${palette.line}` }}
                  >
                    {section.fields.map((f) => (
                      <div key={f.id} className="flex gap-2 items-start">
                        {/* <FieldChip name={fieldIcon(f.labelEn)} /> */}
                        <div className="flex flex-col min-w-0">
                          <span className="text-[8.5px] tracking-[0.08em]" style={{ color: palette.label, fontFamily: "monospace" }}>
                            {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                          </span>
                          <span className="text-[12px] leading-snug break-words" style={{ color: palette.ink }}>
                            {f.value?.trim() ? f.value : "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={section.id}>
                  <SectionTag
                    icon={sectionIcon(section.titleEn)}
                    font={heading}
                    label={lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                  />
                  <p
                    className="px-4 py-3 text-[12px] leading-snug rounded-[8px]"
                    style={{ backgroundColor: palette.panel, border: `1px solid ${palette.line}`, color: palette.sub }}
                  >
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
});

LumenGridTemplate.displayName = "LumenGridTemplate";
export default LumenGridTemplate;