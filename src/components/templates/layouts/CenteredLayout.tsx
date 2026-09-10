"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";
import { Theme } from "./theme";
import { photoShapeClass } from "./Motifs";

const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const MIN_SCALE = 0.72;

const colorAdjust: React.CSSProperties = {
  WebkitPrintColorAdjust: "exact",
  printColorAdjust: "exact",
} as React.CSSProperties;

const noBreak: React.CSSProperties = {
  breakInside: "avoid",
  pageBreakInside: "avoid",
};

function CornerMark({ theme, position }: { theme: Theme; position: "tl" | "tr" | "bl" | "br" }) {
  const pos: Record<string, string> = {
    tl: "top-6 left-6",
    tr: "top-6 right-6 scale-x-[-1]",
    bl: "bottom-6 left-6 scale-y-[-1]",
    br: "bottom-6 right-6 scale-x-[-1] scale-y-[-1]",
  };
  return (
    <svg
      className={`absolute ${pos[position]} pointer-events-none`}
      width="26"
      height="26"
      viewBox="0 0 26 26"
      style={colorAdjust}
    >
      <path d="M1 14 V1 H14" stroke={theme.primary} strokeWidth="1.25" opacity="0.55" />
      <circle cx="1" cy="1" r="1.6" fill={theme.primary} opacity="0.55" />
    </svg>
  );
}

function MeshBackground({ theme }: { theme: Theme }) {
  return (
    <div
      className="absolute top-0 left-0 w-full pointer-events-none overflow-hidden"
      style={{ height: `${PAGE_HEIGHT_MM}mm`, ...colorAdjust }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{ background: `linear-gradient(180deg, ${theme.primary} 0%, ${theme.secondary} 14%, transparent 45%)` }}
      />
      <div
        className="absolute"
        style={{
          width: "50%", height: "22%", top: "-4%", left: "-8%", borderRadius: "9999px",
          background: `radial-gradient(circle, ${theme.secondary} 0%, ${theme.secondary}66 35%, transparent 70%)`, opacity: 0.35,
        }}
      />
      <div
        className="absolute"
        style={{
          width: "40%", height: "18%", top: "2%", right: "-6%", borderRadius: "9999px",
          background: `radial-gradient(circle, ${theme.primary} 0%, ${theme.primary}66 35%, transparent 70%)`, opacity: 0.3,
        }}
      />
      <div
        className="absolute"
        style={{
          width: "55%", height: "20%", bottom: "-6%", left: "20%", borderRadius: "9999px",
          background: `radial-gradient(circle, ${theme.secondary} 0%, ${theme.secondary}66 35%, transparent 70%)`, opacity: 0.14,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `radial-gradient(${theme.bg} 1px, transparent 1px)`, backgroundSize: "22px 22px", opacity: 0.06 }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Futuristic section header — angled-bracket number badge + glowing accent
// rule. Used by BOTH grid and paragraph sections below via one shared
// component, specifically so a future fix only has to happen in one place.
// Row height is fixed in px (not derived from font line-height) so the
// badge and title are guaranteed to align the same way in the live browser
// and in an html2canvas capture — see BADGE_SIZE below.
// ---------------------------------------------------------------------------
const BADGE_SIZE = 34;

function SectionBadge({ n, theme }: { n: number; theme: Theme }) {
  const S = BADGE_SIZE;
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} className="shrink-0" style={colorAdjust}>
      <polygon
        points={`${S * 0.5},1 ${S - 1},${S * 0.28} ${S - 1},${S * 0.72} ${S * 0.5},${S - 1} 1,${S * 0.72} 1,${S * 0.28}`}
        fill={theme.primary}
        opacity="0.08"
        stroke={theme.primary}
        strokeWidth="1.25"
      />
      <text
        x={S / 2}
        y={S / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
        fontWeight="700"
        fill={theme.primary}
        style={{ fontFamily: "ui-monospace, monospace" }}
      >
        {String(n).padStart(2, "0")}
      </text>
    </svg>
  );
}

function FutureRule({ theme }: { theme: Theme }) {
  return (
    <svg width="100%" height="6" viewBox="0 0 560 6" preserveAspectRatio="none" className="block">
      <defs>
        <linearGradient id={`ruleFade-${theme.primary.replace("#", "")}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={theme.primary} stopOpacity="0.8" />
          <stop offset="100%" stopColor={theme.primary} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="2.5" width="560" height="1" fill={`url(#ruleFade-${theme.primary.replace("#", "")})`} />
      <polygon points="0,0 6,3 0,6" fill={theme.primary} opacity="0.7" />
    </svg>
  );
}

function SectionHeader({ n, title, theme, heading }: { n: number; title: string; theme: Theme; heading: string }) {
  return (
    <div style={noBreak}>
      <div className="flex items-center gap-3 mb-3 h-8 max-h-8 min-h-8" style={{ height: BADGE_SIZE }}>
        <SectionBadge n={n} theme={theme} />
        <h2
          className="text-[19px] font-semibold leading-none flex items-center"
          style={{ color: theme.primary, fontFamily: heading, height: BADGE_SIZE }}
        >
          {title}
        </h2>
      </div>
      <FutureRule theme={theme} />
    </div>
  );
}

type BannerLayoutProps = {
  doc: BiodataDocument;
  fonts: FontPack;
  theme: Theme;
};

export default function BannerLayout({ doc, fonts, theme }: BannerLayoutProps) {
  const lang = doc.language;
  const L = (en: string, hi: string) => (lang === "hi" ? hi : en);
  const heading = fonts.heading || theme.headingFont;
  const body = fonts.body || theme.bodyFont;
  const visibleSections = doc.sections.filter((s) => s.visible);
  const aboutSection = visibleSections.find((s) => s.type === "paragraph" && /about/i.test(s.titleEn));
  const otherSections = visibleSections.filter((s) => s !== aboutSection);

  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [compact, setCompact] = useState(false);

  useLayoutEffect(() => {
    const pageEl = pageRef.current;
    const contentEl = contentRef.current;
    if (!pageEl || !contentEl) return;

    let raf = 0;

    const measure = () => {
      const natural = contentEl.scrollHeight;
      const available = pageEl.clientHeight;

      if (natural <= available) {
        setCompact(false);
        setScale(1);
        return;
      }

      if (natural * MIN_SCALE > available && !compact) {
        setCompact(true);
        return;
      }

      setScale(Math.max(available / natural, MIN_SCALE));
    };

    measure();
    document.fonts?.ready?.then(measure).catch(() => {});

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    });
    ro.observe(contentEl);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, fonts, theme, compact]);

  const sectionGap = compact ? "mt-6 space-y-5" : "mt-10 space-y-8";
  const bodyPad = compact ? "px-20 pb-8" : "px-20 pb-16";
  const headerPad = compact ? "pt-8 pb-4" : "pt-14 pb-6";
  const photoMargin = compact ? "-mt-1 mb-2" : "-mt-2 mb-4";

  return (
    <div
      ref={pageRef}
      className="relative a4-page overflow-hidden"
      style={{
        width: `${PAGE_WIDTH_MM}mm`,
        height: `${PAGE_HEIGHT_MM}mm`,
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: body,
        boxSizing: "border-box",
        WebkitFontSmoothing: "antialiased",
        textRendering: "optimizeLegibility",
        ...colorAdjust,
      }}
    >
      <MeshBackground theme={theme} />

      <div className="absolute pointer-events-none" style={{ inset: "10mm", border: `1px solid ${theme.border}`, opacity: 0.6 }} />
      <CornerMark theme={theme} position="tl" />
      <CornerMark theme={theme} position="tr" />
      <CornerMark theme={theme} position="bl" />
      <CornerMark theme={theme} position="br" />

      <div
        ref={contentRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width: "100%",
        }}
      >
        <div style={noBreak}>
          <div className={`relative ${headerPad} text-center`}>
            {doc.invocation.enabled && (
              <p className="text-[12px] tracking-[0.2em] uppercase mb-2" style={{ color: theme.bg, opacity: 0.85 }}>
                {doc.invocation.text}
              </p>
            )}
            <h1 className="text-[36px] font-semibold tracking-wide" style={{ fontFamily: heading, color: theme.bg }}>
              {(lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम")}
            </h1>
            <p className="mt-1 text-[13px] tracking-[0.3em] uppercase" style={{ color: theme.bg, opacity: 0.75 }}>
              {L("Marriage Biodata", "विवाह हेतु बायोडाटा")}
            </p>
          </div>

          <div className={`relative flex justify-center ${photoMargin}`}>
            <div className="relative">
              <svg
                className="absolute -inset-3 pointer-events-none"
                width="164"
                height="204"
                viewBox="0 0 164 204"
              >
                <rect x="1" y="1" width="162" height="202" rx="6" fill="none" stroke={theme.primary} strokeWidth="1.5" />
              </svg>
              <div
                className={`w-[140px] h-[180px] overflow-hidden border-[5px] bg-white ${photoShapeClass(theme.photoShape)}`}
                style={{ borderColor: theme.bg, boxSizing: "border-box", ...colorAdjust }}
              >
                {doc.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" style={colorAdjust} crossOrigin="anonymous" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: theme.primary, opacity: 0.6 }}>
                    {L("Photo", "फोटो")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`relative ${bodyPad}`} style={{ boxSizing: "border-box" }}>
          {aboutSection && (
            <p
              className="text-center text-[15.5px] leading-relaxed max-w-[500px] mx-auto italic"
              style={{ opacity: 0.85, ...noBreak }}
            >
              {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
            </p>
          )}

          <div className={sectionGap}>
            {otherSections.map((section, idx) =>
              section.type === "grid" ? (
                <div key={section.id} className="avoid-break" style={noBreak}>
                  <SectionHeader
                    n={idx + 1}
                    title={lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                    theme={theme}
                    heading={heading}
                  />
                  <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-[15px] mt-4 pl-1">
                    {section.fields.map((f) => (
                      <div key={f.id} className="flex gap-2" style={noBreak}>
                        <span className="w-[46%] shrink-0 font-medium" style={{ color: theme.secondary }}>
                          {lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                        </span>
                        <span>{f.value?.trim() ? f.value : "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={section.id} className="avoid-break" style={noBreak}>
                  <SectionHeader
                    n={idx + 1}
                    title={lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                    theme={theme}
                    heading={heading}
                  />
                  <p className="mt-4 text-[15px] leading-relaxed pl-1">
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