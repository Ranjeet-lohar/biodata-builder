"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";
import { Theme } from "./theme";
import { photoShapeClass } from "./Motifs";

const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const MIN_SCALE = 0.72; // last-resort floor — compact mode kicks in before this

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
    <svg className={`absolute ${pos[position]} pointer-events-none`} width="26" height="26" viewBox="0 0 26 26" style={colorAdjust}>
      <path d="M1 14 V1 H14" stroke={theme.primary} strokeWidth="1.25" opacity="0.55" />
      <circle cx="1" cy="1" r="1.6" fill={theme.primary} opacity="0.55" />
    </svg>
  );
}

function MeshBackground({ theme }: { theme: Theme }) {
  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none overflow-hidden" style={{ height: `${PAGE_HEIGHT_MM}mm`, ...colorAdjust }}>
      <div className="absolute top-0 left-0 w-full h-full" style={{ background: `linear-gradient(180deg, ${theme.primary} 0%, ${theme.secondary} 14%, transparent 45%)` }} />
      <div className="absolute" style={{ width: "50%", height: "22%", top: "-4%", left: "-8%", borderRadius: "9999px", background: `radial-gradient(circle, ${theme.secondary} 0%, ${theme.secondary}66 35%, transparent 70%)`, opacity: 0.35 }} />
      <div className="absolute" style={{ width: "40%", height: "18%", top: "2%", right: "-6%", borderRadius: "9999px", background: `radial-gradient(circle, ${theme.primary} 0%, ${theme.primary}66 35%, transparent 70%)`, opacity: 0.3 }} />
      <div className="absolute" style={{ width: "55%", height: "20%", bottom: "-6%", left: "20%", borderRadius: "9999px", background: `radial-gradient(circle, ${theme.secondary} 0%, ${theme.secondary}66 35%, transparent 70%)`, opacity: 0.14 }} />
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${theme.bg} 1px, transparent 1px)`, backgroundSize: "22px 22px", opacity: 0.06 }} />
    </div>
  );
}

function BadgeNumber({ n, theme }: { n: number; theme: Theme }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" className="shrink-0" style={colorAdjust}>
      <circle cx="17" cy="17" r="16" fill="none" stroke={theme.primary} strokeWidth="1.25" />
      <circle cx="17" cy="17" r="16" fill={theme.primary} opacity="0.08" />
      <text x="17" y="22" textAnchor="middle" fontSize="13" fontWeight="600" fill={theme.primary}>{String(n).padStart(2, "0")}</text>
    </svg>
  );
}

function WaveRule({ theme }: { theme: Theme }) {
  return (
    <svg width="100%" height="10" viewBox="0 0 560 10" preserveAspectRatio="none" className="block">
      <path d="M0 5 Q 10 0, 20 5 T 40 5 T 60 5 T 80 5 T 100 5 T 120 5 T 140 5 T 160 5 T 180 5 T 200 5 T 220 5 T 240 5 T 260 5 T 280 5 T 300 5 T 320 5 T 340 5 T 360 5 T 380 5 T 400 5 T 420 5 T 440 5 T 460 5 T 480 5 T 500 5 T 520 5 T 540 5 T 560 5" stroke={theme.secondary} strokeWidth="1" fill="none" opacity="0.5" />
    </svg>
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
  // Applied BEFORE the hard MIN_SCALE floor: tightens vertical rhythm so we
  // fit more content at a still-legible scale instead of shrinking text
  // past readability (or, previously, silently clipping it).
  const [compact, setCompact] = useState(false);

  useLayoutEffect(() => {
    const pageEl = pageRef.current;
    const contentEl = contentRef.current;
    if (!pageEl || !contentEl) return;

    let raf = 0;

    const measure = () => {
      // scrollHeight ignores any CSS transform on the element itself, so
      // this always reflects the true untransformed layout height — no
      // need to reset the transform before reading it.
      const natural = contentEl.scrollHeight;
      const available = pageEl.clientHeight;

      if (natural <= available) {
        setCompact(false);
        setScale(1);
        return;
      }

      // Would even the floor scale still overflow? Switch to compact
      // spacing and let the resulting reflow trigger another measure pass
      // via the ResizeObserver below, rather than clipping.
      if (natural * MIN_SCALE > available && !compact) {
        setCompact(true);
        return;
      }

      setScale(Math.max(available / natural, MIN_SCALE));
    };

    measure();
    document.fonts?.ready?.then(measure).catch(() => {});

    // Re-measure on every real layout change: font swap finishing, an image
    // loading, field text changing length/wrap — not on a guessed timeout.
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
              <svg className="absolute -inset-3 pointer-events-none" width="164" height="204" viewBox="0 0 164 204">
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
            <p className="text-center text-[15.5px] leading-relaxed max-w-[500px] mx-auto italic" style={{ opacity: 0.85, ...noBreak }}>
              {(lang === "hi" && aboutSection.fields[0]?.valueHi) || aboutSection.fields[0]?.value || ""}
            </p>
          )}

          <div className={sectionGap}>
            {otherSections.map((section, idx) =>
              section.type === "grid" ? (
                <div key={section.id} className="avoid-break" style={noBreak}>
                  <div className="flex items-center gap-3 mb-3">
                    <BadgeNumber n={idx + 1} theme={theme} />
                    <h2 className="text-[19px] font-semibold" style={{ color: theme.primary, fontFamily: heading }}>
                      {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                    </h2>
                  </div>
                  <WaveRule theme={theme} />
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
                  <div className="flex items-center gap-3 mb-3">
                    <BadgeNumber n={idx + 1} theme={theme} />
                    <h2 className="text-[19px] font-semibold" style={{ color: theme.primary, fontFamily: heading }}>
                      {lang === "hi" ? section.titleHi || section.titleEn : section.titleEn}
                    </h2>
                  </div>
                  <WaveRule theme={theme} />
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