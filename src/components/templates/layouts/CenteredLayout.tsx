"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { BiodataDocument } from "@/lib/types";
import { FontPack } from "@/lib/fontPacks";
import { Theme } from "./theme";

// ---------------------------------------------------------------------------
// "Heritage Arch" — a traditional, ornamental biodata template.
//   • double ornamental page border with corner motifs
//   • arch-shaped (mehrab) photo with a radiating halo
//   • name on a folded ribbon
//   • each section is a bordered card whose title sits ON the top border
//   • label ........ value rows with dotted leaders
// Everything decorative is SVG (mm viewBox for the page, px for small pieces)
// so html2canvas / print capture does not drift.
// ---------------------------------------------------------------------------

const ARCH_W = 220; // px — halo + photo container
const ARCH_H = 250;
const PHOTO_W = 140;
const PHOTO_H = 185;
const PHOTO_TOP = 55;
const MIN_SCALE = 0.6; // never shrink the page content below this

function PageOrnament({ theme }: { theme: Theme }) {
  const W = 210;
  const H = 297;
  const OUT = 6; // mm inset of the outer border
  const IN = 8.5; // mm inset of the inner hairline

  const corner = (x: number, y: number, sx: number, sy: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
      <path d="M0,18 C0,7 7,0 18,0" fill="none" stroke={theme.primary} strokeWidth={0.5} />
      <path d="M3,14 C3,8 8,3 14,3" fill="none" stroke={theme.secondary} strokeWidth={0.35} />
      <path d="M4,1.6 L6.4,4 L4,6.4 L1.6,4 Z" fill={theme.primary} />
      <circle cx="18" cy="0" r="0.8" fill={theme.primary} />
      <circle cx="0" cy="18" r="0.8" fill={theme.primary} />
    </g>
  );

  return (
    <svg
      width={`${W}mm`}
      height={`${H}mm`}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    >
      <rect
        x={OUT}
        y={OUT}
        width={W - OUT * 2}
        height={H - OUT * 2}
        fill="none"
        stroke={theme.primary}
        strokeWidth={0.5}
      />
      {/* <rect
        x={IN}
        y={IN}
        width={W - IN * 2}
        height={H - IN * 2}
        fill="none"
        stroke={theme.secondary}
        strokeWidth={0.2}
      /> */}

      {/* Mid-edge diamonds (top & bottom), the page color hides the border behind them */}
      {[OUT, H - OUT].map((cy) => (
        <g key={cy}>
          <rect x={W / 2 - 11} y={cy - 2.6} width={22} height={5.2} fill={theme.bg} />
          <path
            d={`M${W / 2},${cy - 2.4} L${W / 2 + 2.4},${cy} L${W / 2},${cy + 2.4} L${W / 2 - 2.4},${cy} Z`}
            fill={theme.primary}
          />
          <circle cx={W / 2 - 6} cy={cy} r="0.7" fill={theme.secondary} />
          <circle cx={W / 2 + 6} cy={cy} r="0.7" fill={theme.secondary} />
        </g>
      ))}

      {corner(OUT, OUT, 1, 1, "tl")}
      {corner(W - OUT, OUT, -1, 1, "tr")}
      {corner(W - OUT, H - OUT, -1, -1, "br")}
      {corner(OUT, H - OUT, 1, -1, "bl")}
    </svg>
  );
}

function Divider({ theme, width = 200 }: { theme: Theme; width?: number }) {
  const c = width / 2;
  return (
    <svg width={width} height="14" viewBox={`0 0 ${width} 14`} className="block mx-auto">
      <line x1="0" y1="7" x2={c - 14} y2="7" stroke={theme.primary} strokeWidth="0.8" opacity="0.6" />
      <line x1={c + 14} y1="7" x2={width} y2="7" stroke={theme.primary} strokeWidth="0.8" opacity="0.6" />
      <path d={`M${c},1 L${c + 6},7 L${c},13 L${c - 6},7 Z`} fill={theme.primary} />
      <circle cx={c - 14} cy="7" r="2" fill={theme.secondary} />
      <circle cx={c + 14} cy="7" r="2" fill={theme.secondary} />
    </svg>
  );
}

function SmallDiamond({ theme }: { theme: Theme }) {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" className="shrink-0">
      <path d="M4.5,0 L9,4.5 L4.5,9 L0,4.5 Z" fill={theme.secondary} />
    </svg>
  );
}

function ArchHalo({ theme }: { theme: Theme }) {
  const cx = ARCH_W / 2;
  const r = PHOTO_W / 2;
  const cy = PHOTO_TOP + r;
  const bottom = PHOTO_TOP + PHOTO_H;
  const ring = (rr: number) =>
    `M${cx - rr},${bottom} V${cy} A${rr},${rr} 0 0 1 ${cx + rr},${cy} V${bottom}`;

  // Short rays fanning around the top of the arch
  const rays = Array.from({ length: 19 }, (_, i) => {
    const a = Math.PI + (Math.PI * i) / 18;
    const r1 = r + 22;
    const r2 = r + (i % 2 === 0 ? 31 : 27);
    return {
      x1: cx + Math.cos(a) * r1,
      y1: cy + Math.sin(a) * r1,
      x2: cx + Math.cos(a) * r2,
      y2: cy + Math.sin(a) * r2,
    };
  });

  return (
    <svg
      width={ARCH_W}
      height={ARCH_H}
      viewBox={`0 0 ${ARCH_W} ${ARCH_H}`}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    >
      <path d={ring(r + 9)} fill="none" stroke={theme.primary} strokeWidth="1.4" />
      <path d={ring(r + 16)} fill="none" stroke={theme.secondary} strokeWidth="0.9" strokeDasharray="2 3" />
      {rays.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={i % 2 === 0 ? theme.primary : theme.secondary}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      ))}
      {/* Base line with end diamonds */}
      <line x1={cx - r - 22} y1={bottom + 6} x2={cx + r + 22} y2={bottom + 6} stroke={theme.primary} strokeWidth="0.8" opacity="0.6" />
      <path d={`M${cx - r - 22},${bottom + 2} l4,4 l-4,4 l-4,-4 Z`} fill={theme.secondary} />
      <path d={`M${cx + r + 22},${bottom + 2} l4,4 l-4,4 l-4,-4 Z`} fill={theme.secondary} />
    </svg>
  );
}

function NameRibbon({
  theme,
  heading,
  name,
}: {
  theme: Theme;
  heading: string;
  name: string;
}) {
  const H = 52;
  const len = name.length;
  const fontSize = len > 28 ? 22 : len > 22 ? 26 : len > 16 ? 30 : 34;
  return (
    <div className="relative flex justify-center">
      <svg width="18" height={H} viewBox={`0 0 18 ${H}`} className="shrink-0">
        <polygon points={`18,0 18,${H} 0,${H} 8,${H / 2} 0,0`} fill={theme.secondary} />
      </svg>
      <div
        className="px-8 flex items-center justify-center whitespace-nowrap font-semibold tracking-wide"
        style={{
          height: H,
          backgroundColor: theme.primary,
          color: theme.bg,
          fontFamily: heading,
          fontSize,
        }}
      >
        {name}
      </div>
      <svg width="18" height={H} viewBox={`0 0 18 ${H}`} className="shrink-0">
        <polygon points={`0,0 0,${H} 18,${H} 10,${H / 2} 18,0`} fill={theme.secondary} />
      </svg>
    </div>
  );
}

function LegendCard({
  theme,
  heading,
  title,
  children,
}: {
  theme: Theme;
  heading: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative avoid-break px-7 pt-8 pb-5"
      style={{ border: `1px solid ${theme.primary}` }}
    >
      {/* inner hairline for a double-border look */}
      <div
        className="absolute inset-[4px] pointer-events-none"
        style={{ border: `1px solid ${theme.secondary}`, opacity: 0.45 }}
      />
      {/* title sits on the top border */}
      <div
        className="absolute left-1/2 top-0 flex items-center gap-3 px-4 whitespace-nowrap"
        style={{ transform: "translate(-50%, -50%)", backgroundColor: theme.bg }}
      >
        <SmallDiamond theme={theme} />
        <h2
          className="text-[14px] font-semibold tracking-[0.22em] uppercase"
          style={{ color: theme.primary, fontFamily: heading }}
        >
          {title}
        </h2>
        <SmallDiamond theme={theme} />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function LeaderRow({ theme, label, value }: { theme: Theme; label: string; value: string }) {
  return (
    <div className="flex items-end gap-2 avoid-break">
      <span
        className="shrink-0 text-[10.5px] font-semibold tracking-[0.1em] uppercase"
        style={{ color: theme.secondary }}
      >
        {label}
      </span>
      <span
        className="flex-1 min-w-[10px] mb-[5px]"
        style={{ borderBottom: `1px dotted ${theme.primary}`, opacity: 0.45 }}
      />
      <span className="text-right text-[13.5px] font-medium max-w-[56%]">
        {value?.trim() ? value : "—"}
      </span>
    </div>
  );
}

export default function HeritageArchLayout({
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
  const otherSections = visibleSections.filter((s) => s !== aboutSection);

  const isRichTextEmpty = (html?: string) => {
    if (!html) return true;
    return html.replace(/<[^>]*>/g, "").trim().length === 0;
  };

  const aboutValue =
    (lang === "hi" && aboutSection?.fields[0]?.valueHi) ||
    aboutSection?.fields[0]?.value ||
    "";

  const fullName =
    (lang === "hi" && doc.fullNameHi) || doc.fullName || L("Full Name", "पूरा नाम");

  // --- Fit everything on one A4 page --------------------------------------
  // If the content is taller than the page, shrink it AND widen its layout
  // box by the same factor (width = 100/scale %), so it still fills the
  // page width instead of turning into a narrow column.
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const pageEl = pageRef.current;
    const contentEl = contentRef.current;
    if (!pageEl || !contentEl) return;
    let raf = 0;

    const measure = () => {
      const avail = pageEl.clientHeight;
      let s = 1;
      contentEl.style.width = "100%";
      let h = contentEl.scrollHeight;
      if (h > avail) {
        s = Math.max(avail / h, MIN_SCALE);
        for (let i = 0; i < 6; i++) {
          contentEl.style.width = `${100 / s}%`;
          h = contentEl.scrollHeight;
          s = Math.max(Math.min(avail / h, 1), MIN_SCALE);
        }
        contentEl.style.width = `${100 / s}%`;
        h = contentEl.scrollHeight;
        s = Math.max(Math.min(s, avail / h), MIN_SCALE);
      }
      contentEl.style.width = `${100 / s}%`;
      setScale(s);
    };

    measure();
    document.fonts?.ready?.then(measure).catch(() => {});
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    });
    ro.observe(pageEl);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, fonts, theme]);

  const richClasses =
    "rich-text-content [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 last:[&_p]:mb-0";

  return (
    <div
      ref={pageRef}
      className="relative a4-page overflow-hidden"
      style={{
        width: "210mm",
        height: "297mm",
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: body,
      }}
    >
      <PageOrnament theme={theme} />

      <div
        ref={contentRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${100 / scale}%`,
        }}
      >
      <div className="relative px-[22mm] pt-[17mm] pb-[18mm]">
        {/* Invocation + subtitle */}
        <div className="text-center">
          {doc.invocation.enabled && (
            <p
              className="text-[12.5px] tracking-[0.28em] uppercase font-medium"
              style={{ color: theme.secondary }}
            >
              {doc.invocation.text}
            </p>
          )}
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="h-px w-14" style={{ backgroundColor: theme.primary, opacity: 0.5 }} />
            <p
              className="text-[11px] tracking-[0.34em] uppercase font-semibold"
              style={{ color: theme.primary }}
            >
              {L("Marriage Biodata", "विवाह हेतु बायोडाटा")}
            </p>
            <span className="h-px w-14" style={{ backgroundColor: theme.primary, opacity: 0.5 }} />
          </div>
        </div>

        {/* Arch photo */}
        <div
          className="relative mx-auto mt-4"
          style={{ width: ARCH_W, height: ARCH_H }}
        >
          <ArchHalo theme={theme} />
          <div
            className="absolute overflow-hidden bg-white"
            style={{
              left: (ARCH_W - PHOTO_W) / 2,
              top: PHOTO_TOP,
              width: PHOTO_W,
              height: PHOTO_H,
              borderRadius: `${PHOTO_W / 2}px ${PHOTO_W / 2}px 0 0`,
              border: `3px solid ${theme.primary}`,
              boxSizing: "border-box",
            }}
          >
            {doc.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={doc.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-xs text-center px-2"
                style={{ color: theme.secondary, opacity: 0.7 }}
              >
                {L("Photograph", "फोटो")}
              </div>
            )}
          </div>
        </div>

        {/* Name ribbon, overlapping the bottom of the photo */}
        <div className="relative -mt-5">
          <NameRibbon theme={theme} heading={heading} name={fullName} />
        </div>

        {/* About */}
        {aboutSection && !isRichTextEmpty(aboutValue) && (
          <div className="mt-6">
            <Divider theme={theme} width={180} />
            <div
              className={`mt-4 mx-auto max-w-[540px] text-center text-[14.5px] leading-[1.7] italic ${richClasses}`}
              style={{ opacity: 0.9 }}
              dangerouslySetInnerHTML={{ __html: aboutValue }}
            />
            <div className="mt-4">
              <Divider theme={theme} width={180} />
            </div>
          </div>
        )}

        {/* Sections */}
        <div className="mt-10 space-y-9">
          {otherSections.map((section) => {
            const title = lang === "hi" ? section.titleHi || section.titleEn : section.titleEn;
            const sectionValue =
              (lang === "hi" && section.fields[0]?.valueHi) || section.fields[0]?.value || "";

            return (
              <LegendCard key={section.id} theme={theme} heading={heading} title={title}>
                {section.type === "grid" ? (
                  <div className="grid grid-cols-2 gap-x-9 gap-y-2">
                    {section.fields.map((f) => (
                      <LeaderRow
                        key={f.id}
                        theme={theme}
                        label={lang === "hi" ? f.labelHi || f.labelEn : f.labelEn}
                        value={f.value}
                      />
                    ))}
                  </div>
                ) : !isRichTextEmpty(sectionValue) ? (
                  <div
                    className={`text-[13.5px] leading-[1.7] ${richClasses}`}
                    dangerouslySetInnerHTML={{ __html: sectionValue }}
                  />
                ) : (
                  <p className="text-[13.5px] leading-[1.7]">—</p>
                )}
              </LegendCard>
            );
          })}
        </div>

        {/* Footer ornament */}
        <div className="mt-9">
          <Divider theme={theme} width={220} />
        </div>
      </div>
      </div>
    </div>
  );
}